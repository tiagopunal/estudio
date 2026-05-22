<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest; 
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

        return ApiResponse::success(
            $bookings,
            "Reservas obtenidas correctamente"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR RESERVA
    |--------------------------------------------------------------------------
    */
    public function store(StoreBookingRequest $request)
    {
        /*
        |--------------------------------------------------------------------------
        | VALIDAR FECHA PASADA
        |--------------------------------------------------------------------------
        */
        if (strtotime($request->date) < time()) {
            return ApiResponse::error(
                "No puedes reservar en una fecha pasada",
                400
            );
        }

        /*
        |--------------------------------------------------------------------------
        | VALIDAR CONFLICTO DE HORARIO
        |--------------------------------------------------------------------------
        */
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

        /*
        |--------------------------------------------------------------------------
        | CREAR RESERVA
        |--------------------------------------------------------------------------
        */
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'service_id' => $request->service_id,
            'date' => $request->date,
            'status' => 'pending'
        ]);

        return ApiResponse::success(
            $booking,
            "Reserva creada correctamente"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CAMBIAR ESTADO DE RESERVA
    |--------------------------------------------------------------------------
    */
   public function updateStatus(UpdateBookingStatusRequest $request, $id)
    {

        $booking = Booking::find($id);

        if (!$booking) {
            return ApiResponse::error(
                "Reserva no encontrada",
                404
            );
        }

        $user = auth()->user();

        $currentStatus = $booking->status;
        $newStatus = $request->status;

        /*
        |--------------------------------------------------------------------------
        | REGLA 1: COMPLETED NO PUEDE MODIFICARSE
        |--------------------------------------------------------------------------
        */
        if ($currentStatus === 'completed') {
            return ApiResponse::error(
                "Una reserva completada no puede modificarse",
                400
            );
        }

        /*
        |--------------------------------------------------------------------------
        | REGLA 2: CANCELLED NO PUEDE MODIFICARSE
        |--------------------------------------------------------------------------
        */
        if ($currentStatus === 'cancelled') {
            return ApiResponse::error(
                "Una reserva cancelada no puede modificarse",
                400
            );
        }

        /*
        |--------------------------------------------------------------------------
        | REGLA 3: SOLO PROFESIONAL PUEDE CONFIRMAR O COMPLETAR
        |--------------------------------------------------------------------------
        */
        if (
            in_array($newStatus, ['confirmed', 'completed']) &&
            $user->role !== 'professional'
        ) {
            return ApiResponse::error(
                "Solo el profesional puede confirmar o completar reservas",
                403
            );
        }

        /*
        |--------------------------------------------------------------------------
        | REGLA 4: CLIENTE SOLO PUEDE CANCELAR SU RESERVA
        |--------------------------------------------------------------------------
        */
        if (
            $newStatus === 'cancelled' &&
            $user->id !== $booking->user_id &&
            $user->role !== 'professional'
        ) {
            return ApiResponse::error(
                "No tienes permisos para cancelar esta reserva",
                403
            );
        }

        /*
        |--------------------------------------------------------------------------
        | REGLA 5: TRANSICIONES VÁLIDAS
        |--------------------------------------------------------------------------
        */
        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['completed', 'cancelled'],
            'cancelled' => [],
            'completed' => []
        ];

        if (!in_array($newStatus, $validTransitions[$currentStatus])) {
            return ApiResponse::error(
                "Transición de estado no válida",
                400
            );
        }

        /*
        |--------------------------------------------------------------------------
        | ACTUALIZAR ESTADO
        |--------------------------------------------------------------------------
        */
        $booking->status = $newStatus;
        $booking->save();

        return ApiResponse::success(
            $booking,
            "Estado actualizado correctamente"
        );
    }
}