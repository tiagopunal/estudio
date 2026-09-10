<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::query()
            ->where(function ($query) {
                $query->where('user_id', auth()->id())
                    ->orWhereHas('service', fn ($serviceQuery) => $serviceQuery->where('user_id', auth()->id()));
            })
            ->with(['service.user', 'user'])
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

        $booking = DB::transaction(function () use ($request, $user, $service) {
            Service::query()->whereKey($service->id)->lockForUpdate()->firstOrFail();

            if ($this->hasScheduleConflict($service->id, $request->date)) {
                return null;
            }

            return Booking::create([
                'user_id' => $user->id,
                'service_id' => $service->id,
                'date' => $request->date,
                'status' => 'pending',
            ]);
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

        $booking->load(['service.user', 'user']);
        $user = auth()->user();

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
            'canManageStatus' => $user->isProfessional() && $user->id === $booking->service->user_id,
            'isReceivedBooking' => $user->id === $booking->service->user_id && $user->id !== $booking->user_id,
            'canCancelPending' => ($user->id === $booking->user_id)
                || ($user->isProfessional() && $user->id === $booking->service->user_id),
            'canCustomerCancelConfirmed' => $user->id === $booking->user_id
                && $this->canCustomerCancelConfirmedBooking($booking),
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

        $booking->update(['status' => $newStatus]);

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
}
