<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Support\ApiResponse;

class BookingController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LISTAR RESERVAS DEL USUARIO
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        $bookings = Booking::where('user_id', auth()->id())
            ->with('service')
            ->get();

        return ApiResponse::success($bookings, "Reservas obtenidas correctamente");
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR RESERVA
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date'
            
        ]);

        if (strtotime($request->date) < time()) {
    return ApiResponse::error("No puedes reservar en una fecha pasada", 400);
} 

        // 🔥 VALIDACIÓN DE CONFLICTO DE HORARIO
        $exists = Booking::where('service_id', $request->service_id)
            ->where('date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($exists) {
            return ApiResponse::error(
                "Este servicio ya tiene una reserva en ese horario",
                409
            );
        }

        // CREAR RESERVA
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'service_id' => $request->service_id,
            'date' => $request->date,
            'status' => 'pending'
        ]);

        return ApiResponse::success($booking, "Reserva creada correctamente");
    }

    /*
    |--------------------------------------------------------------------------
    | CAMBIAR ESTADO DE RESERVA
    |--------------------------------------------------------------------------
    */
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:pending,confirmed,cancelled,completed'
    ]);

    $booking = Booking::find($id);

    if (!$booking) {
        return ApiResponse::error("Reserva no encontrada", 404);
    }

    $user = auth()->user();

    /*
    |--------------------------------------------------------------------------
    | REGLA 1: NO SE PUEDE MODIFICAR UNA COMPLETADA
    |--------------------------------------------------------------------------
    */
    if ($booking->status === 'completed') {
        return ApiResponse::error("No se puede modificar una reserva completada", 400);
    }

    /*
    |--------------------------------------------------------------------------
    | REGLA 2: SOLO PROFESIONAL PUEDE CONFIRMAR O COMPLETAR
    |--------------------------------------------------------------------------
    */
    if (in_array($request->status, ['confirmed', 'completed']) && $user->role !== 'professional') {
        return ApiResponse::error("Solo el profesional puede confirmar o completar reservas", 403);
    }

    /*
    |--------------------------------------------------------------------------
    | REGLA 3: CLIENTE SOLO PUEDE CANCELAR
    |--------------------------------------------------------------------------
    */
    if ($request->status === 'cancelled' && $user->id !== $booking->user_id && $user->role !== 'professional') {
        return ApiResponse::error("No tienes permisos para cancelar esta reserva", 403);
    }

    /*
    |--------------------------------------------------------------------------
    | REGLA 4: FLUJO LÓGICO DE ESTADOS
    |--------------------------------------------------------------------------
    */
    $validTransitions = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['completed', 'cancelled'],
        'cancelled' => [],
        'completed' => []
    ];

    if (!in_array($request->status, $validTransitions[$booking->status])) {
        return ApiResponse::error("Transición de estado no válida", 400);
    }

    if ($request->status === 'cancelled') {

    if ($booking->status === 'confirmed') {
        return ApiResponse::error(
            "No se puede cancelar una reserva ya confirmada sin autorización",
            400
        );
    }
} 
    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR ESTADO
    |--------------------------------------------------------------------------
    */
    $booking->status = $request->status;
    $booking->save();

    return ApiResponse::success($booking, "Estado actualizado correctamente");
}


} 