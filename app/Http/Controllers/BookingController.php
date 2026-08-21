<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
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
        $query = Service::query()
            ->with('user')
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
        $service = Service::findOrFail($request->service_id);

        if ($service->user_id === auth()->id()) {
            return back()
                ->withErrors(['service_id' => 'No puedes reservar tu propio servicio'])
                ->withInput();
        }

        $exists = Booking::where('service_id', $request->service_id)
            ->where('date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($exists) {
            return back()
                ->withErrors(['date' => 'Este servicio ya tiene una reserva en ese horario'])
                ->withInput();
        }

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'service_id' => $request->service_id,
            'date' => $request->date,
            'status' => 'pending',
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Reserva creada correctamente');
    }

    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load(['service.user', 'user']);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
            'canManageStatus' => auth()->id() === $booking->service->user_id,
            'canCancel' => auth()->id() === $booking->user_id || auth()->id() === $booking->service->user_id,
        ]);
    }

    public function edit(Booking $booking)
    {
        $this->authorize('update', $booking);

        return redirect()->route('bookings.show', $booking);
    }

    public function update(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $validated = $request->validate([
            'service_id' => ['sometimes', 'required', 'exists:services,id'],
            'date' => ['sometimes', 'required', 'date_format:Y-m-d H:i', 'after:now'],
        ]);

        $booking->update($validated);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Reserva actualizada correctamente');
    }

    public function destroy(Booking $booking)
    {
        $this->authorize('delete', $booking);

        if ($booking->status !== 'pending') {
            return back()->withErrors(['status' => 'Solo puedes eliminar reservas pendientes']);
        }

        $booking->delete();

        return redirect()->route('bookings.index')
            ->with('success', 'Reserva eliminada correctamente');
    }

    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $user = auth()->user();
        $currentStatus = $booking->status;
        $newStatus = $request->status;

        if ($currentStatus === 'completed') {
            return back()->withErrors(['status' => 'Una reserva completada no puede modificarse']);
        }

        if ($currentStatus === 'cancelled') {
            return back()->withErrors(['status' => 'Una reserva cancelada no puede modificarse']);
        }

        $isProvider = $user->id === $booking->service->user_id;
        $isCustomer = $user->id === $booking->user_id;

        if (in_array($newStatus, ['confirmed', 'completed'], true) && ! $isProvider) {
            return back()->withErrors(['status' => 'Solo el profesional puede confirmar o completar reservas']);
        }

        if ($newStatus === 'cancelled' && ! $isCustomer && ! $isProvider) {
            return back()->withErrors(['status' => 'No tienes permisos para cancelar esta reserva']);
        }

        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['completed', 'cancelled'],
            'cancelled' => [],
            'completed' => [],
        ];

        if (! in_array($newStatus, $validTransitions[$currentStatus], true)) {
            return back()->withErrors(['status' => 'Transición de estado no válida']);
        }

        $booking->update(['status' => $newStatus]);

        if ($newStatus === 'cancelled') {
            return redirect()->route('bookings.index')
                ->with('success', 'Reserva cancelada correctamente');
        }

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Estado actualizado correctamente');
    }
}
