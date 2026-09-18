<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Payment;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(private readonly WalletService $wallets) {}

    public function index()
    {
        $bookings = Booking::query()
            ->where(function ($query) {
                $query->where('user_id', auth()->id())
                    ->orWhereHas('service', fn ($serviceQuery) => $serviceQuery->where('user_id', auth()->id()));
            })
            ->with(['service.user', 'user', 'review'])
            ->latest()
            ->get();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Booking::class);

        $query = Service::query()
            ->with('user')
            ->where('status', 'active')
            ->where('user_id', '!=', auth()->id());

        if ($request->filled('service_id')) {
            $query->where('id', $request->service_id);
        }

        $services = $query->latest()->get();

        return Inertia::render('Bookings/Create', [
            'services' => $services,
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        $user = auth()->user();

        if (! $user) {
            abort(403);
        }

        $service = Service::find($request->service_id);

        if (! $service) {
            return back()
                ->withErrors(['service_id' => 'El servicio seleccionado no existe'])
                ->withInput();
        }

        if ($service->user_id === $user->id) {
            return back()
                ->withErrors(['service_id' => 'No puedes reservar tu propio servicio'])
                ->withInput();
        }

        if ($service->status !== 'active') {
            return back()
                ->withErrors(['service_id' => 'El servicio seleccionado no está disponible'])
                ->withInput();
        }

            $servicePrice = Payment::amountToCents($service->price);
            $amount = $request->filled('amount') ? Payment::amountToCents($request->amount) : $servicePrice;
            $minimum = (int) ceil($servicePrice * 0.10);

            if ($amount < $minimum || $amount > $servicePrice) {
                return back()
                ->withErrors(['amount' => 'El importe debe estar entre el 10% y el 100% del precio del servicio.'])
                ->withInput();
            }

        $booking = DB::transaction(function () use ($request, $user, $service, $servicePrice, $amount) {
            Service::query()->whereKey($service->id)->lockForUpdate()->firstOrFail();

            if ($this->hasScheduleConflict($service->id, $request->date)) {
                return null;
            }

            $booking = Booking::create([
                'user_id' => $user->id,
                'service_id' => $service->id,
                'date' => $request->date,
                'status' => 'pending',
            ]);

            $booking->payment()->create([
                'customer_id' => $user->id,
                'service_price' => number_format($servicePrice / 100, 2, '.', ''),
                'amount' => number_format($amount / 100, 2, '.', ''),
                'initial_amount' => number_format($amount / 100, 2, '.', ''),
                'held_amount' => '0.00',
                'currency' => 'ARS',
                'status' => 'pending',
                'release_at' => Carbon::parse($request->date)->addDays(60),
            ]);

            return $booking;
        });

        if (! $booking) {
            return back()
                ->withErrors(['date' => 'Este servicio ya tiene una reserva en ese horario'])
                ->withInput();
        }

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Reserva creada correctamente');
    }

    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load(['service.user', 'user', 'review', 'payment']);
        $this->releasePaymentIfDue($booking);
        $user = auth()->user();
        $wallet = $this->wallets->getOrCreateWallet($user);
        $paidAmount = Payment::amountToCents((string) ($booking->payment?->initial_amount ?: $booking->payment?->amount ?? '0'));
        $servicePrice = Payment::amountToCents((string) ($booking->payment?->service_price ?? $booking->service->price));
        $heldAmount = Payment::amountToCents((string) ($booking->payment?->held_amount ?: ($booking->payment?->status === 'held' ? $booking->payment?->amount : '0')));
        $isFinalizedPayment = in_array($booking->payment?->status, ['released', 'refunded'], true);
        $remainingBalance = $isFinalizedPayment ? 0 : max(0, $servicePrice - $heldAmount);
        $releasedAmount = $booking->payment?->status === 'released'
            ? ($booking->payment?->final_charge_at ? $servicePrice : Payment::amountToCents((string) ($booking->payment?->amount ?? '0')))
            : 0;

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
            'wallet' => [
                'available_balance' => $wallet->available_balance,
                'held_balance' => $wallet->held_balance,
                'paid_amount' => number_format($paidAmount / 100, 2, '.', ''),
                'service_price' => number_format($servicePrice / 100, 2, '.', ''),
                'remaining_balance' => number_format($remainingBalance / 100, 2, '.', ''),
                'paid_percentage' => $servicePrice > 0 ? round(($paidAmount * 10000) / $servicePrice) / 100 : 0,
                'held_amount' => number_format($heldAmount / 100, 2, '.', ''),
                'released_amount' => number_format($releasedAmount / 100, 2, '.', ''),
                'final_charge_at' => $booking->payment?->final_charge_at,
            ],
            'canManageStatus' => $user->isProfessional() && $user->id === $booking->service->user_id,
            'isReceivedBooking' => $user->id === $booking->service->user_id && $user->id !== $booking->user_id,
            'canReview' => $user->id === $booking->user_id
                && $booking->status === 'completed'
                && $booking->review === null,
            'canCancelPending' => ($user->id === $booking->user_id)
                || ($user->isProfessional() && $user->id === $booking->service->user_id),
            'canCustomerCancelConfirmed' => $user->id === $booking->user_id
                && $this->canCustomerCancelConfirmedBooking($booking),
            'canApprovePayment' => $user->id === $booking->user_id && $booking->payment?->status === 'pending',
            'canReleasePayment' => $user->id === $booking->user_id
                && $booking->status === 'completed'
                && $booking->payment?->status === 'held',
        ]);
    }

    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $user = auth()->user();
        $currentStatus = $booking->status;
        $newStatus = $request->status;

        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['completed', 'cancelled'],
            'cancelled' => [],
            'completed' => [],
        ];

        if (! in_array($newStatus, $validTransitions[$currentStatus], true)) {
            return back()->withErrors(['status' => 'Transición de estado no válida']);
        }

        $isProvider = $user->isProfessional() && $user->id === $booking->service->user_id;
        $isCustomer = $user->id === $booking->user_id;

        if ($currentStatus === 'pending' && $newStatus === 'confirmed' && ! $isProvider) {
            return back()->withErrors(['status' => 'Solo el profesional dueño del servicio puede confirmar reservas']);
        }

        if ($currentStatus === 'pending' && $newStatus === 'confirmed' && $booking->payment?->status !== 'held') {
            return back()->withErrors(['status' => 'El profesional solo puede confirmar una reserva con el pago simulado retenido.']);
        }

        if ($currentStatus === 'pending' && $newStatus === 'cancelled' && ! $isCustomer && ! $isProvider) {
            return back()->withErrors(['status' => 'No tienes permisos para rechazar esta reserva']);
        }

        if ($currentStatus === 'confirmed' && $newStatus === 'completed' && ! $isProvider) {
            return back()->withErrors(['status' => 'Solo el profesional dueño del servicio puede completar reservas']);
        }

        if ($currentStatus === 'confirmed' && $newStatus === 'cancelled') {
            if (! $isCustomer) {
                return back()->withErrors(['status' => 'Solo el cliente puede cancelar una reserva confirmada']);
            }

            if (! $this->canCustomerCancelConfirmedBooking($booking)) {
                return back()->withErrors(['status' => 'No puedes cancelar una reserva confirmada con menos de 24 horas de anticipación']);
            }
        }

        try {
            DB::transaction(function () use ($booking, $newStatus): void {
                $payment = $booking->payment()->lockForUpdate()->first();

                $booking->update([
                    'status' => $newStatus,
                    'completed_at' => $newStatus === 'completed' ? now() : $booking->completed_at,
                ]);

                if ($newStatus === 'cancelled' && $payment) {
                    $this->wallets->refundClientFunds($payment, 'booking_cancelled');
                }
            });
        } catch (\RuntimeException $exception) {
            return back()->withErrors(['status' => $exception->getMessage()]);
        }

        if ($newStatus === 'cancelled') {
            return redirect()->route('bookings.index')
                ->with('success', 'Reserva cancelada correctamente');
        }

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Estado actualizado correctamente');
    }

    private function hasScheduleConflict(int $serviceId, string $date, ?int $ignoredBookingId = null): bool
    {
        return Booking::query()
            ->where('service_id', $serviceId)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->when($ignoredBookingId, fn ($query) => $query->where('id', '!=', $ignoredBookingId))
            ->exists();
    }

    private function canCustomerCancelConfirmedBooking(Booking $booking): bool
    {
        return Carbon::now()->addHours(24)->lte(Carbon::parse($booking->date));
    }

    private function releasePaymentIfDue(Booking $booking): void
    {
        if ($this->paymentIsAutomaticallyReleasable($booking)) {
            $this->wallets->releaseFundsToProfessional($booking->payment, 'automatic_60_day_expiration');
        }
    }

    private function paymentIsAutomaticallyReleasable(Booking $booking): bool
    {
        if ($booking->payment?->status !== 'held') {
            return false;
        }

        $referenceDate = $booking->status === 'completed'
            ? $booking->completed_at
            : ($booking->status === 'confirmed' ? Carbon::parse($booking->date) : null);

        return $referenceDate?->copy()->addDays(60)->lte(now()) ?? false;
    }
}
