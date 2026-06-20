<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | MOSTRAR FORMULARIO PARA CREAR RESEÑA
    |--------------------------------------------------------------------------
    */
    public function create(Booking $booking)
    {
        // Solo el cliente puede crear reseña
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        // Solo en reservas completadas
        if ($booking->status !== 'completed') {
            abort(403, 'Solo puedes reseñar servicios completados');
        }

        // No permitir reseña duplicada
        if ($booking->reviews()->exists()) {
            abort(403, 'Ya has reseñado este servicio');
        }

        return Inertia::render('Reviews/Create', [
            'booking' => $booking->load('service', 'user'),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GUARDAR RESEÑA
    |--------------------------------------------------------------------------
    */
    public function store(Request $request, Booking $booking)
    {
        // Solo el cliente puede crear reseña
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        // Solo en reservas completadas
        if ($booking->status !== 'completed') {
            return back()->withErrors([
                'error' => 'Solo puedes reseñar servicios completados'
            ]);
        }

        // No permitir reseña duplicada
        if ($booking->reviews()->exists()) {
            return back()->withErrors([
                'error' => 'Ya has reseñado este servicio'
            ]);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ], [
            'rating.required' => 'La calificación es obligatoria',
            'rating.integer' => 'La calificación debe ser un número entero',
            'rating.min' => 'La calificación mínima es 1',
            'rating.max' => 'La calificación máxima es 5',
            'comment.required' => 'El comentario es obligatorio',
            'comment.max' => 'El comentario no puede exceder 1000 caracteres',
        ]);

        $review = Review::create([
            'user_id' => auth()->id(),
            'service_id' => $booking->service_id,
            'booking_id' => $booking->id,
            ...$validated
        ]);

        // Actualizar rating promedio del servicio
        $this->updateServiceAverageRating($booking->service_id);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Reseña publicada correctamente');
    }

    /*
    |--------------------------------------------------------------------------
    | MOSTRAR RESEÑA
    |--------------------------------------------------------------------------
    */
    public function show(Review $review)
    {
        return Inertia::render('Reviews/Show', [
            'review' => $review->load('user', 'service', 'booking'),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MOSTRAR FORMULARIO DE EDITAR RESEÑA
    |--------------------------------------------------------------------------
    */
    public function edit(Review $review)
    {
        $this->authorize('update', $review);

        return Inertia::render('Reviews/Edit', [
            'review' => $review,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR RESEÑA
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, Review $review)
    {
        $this->authorize('update', $review);

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $serviceId = $review->service_id;
        $review->update($validated);

        // Actualizar rating promedio del servicio
        $this->updateServiceAverageRating($serviceId);

        return redirect()->route('reviews.show', $review)
            ->with('success', 'Reseña actualizada correctamente');
    }

    /*
    |--------------------------------------------------------------------------
    | ELIMINAR RESEÑA
    |--------------------------------------------------------------------------
    */
    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);

        $serviceId = $review->service_id;
        $review->delete();

        // Actualizar rating promedio del servicio
        $this->updateServiceAverageRating($serviceId);

        return back()->with('success', 'Reseña eliminada correctamente');
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR PROMEDIO DE CALIFICACIÓN DEL SERVICIO
    |--------------------------------------------------------------------------
    */
    private function updateServiceAverageRating($serviceId)
    {
        $averageRating = Review::where('service_id', $serviceId)
            ->average('rating');

        \App\Models\Service::where('id', $serviceId)
            ->update(['average_rating' => $averageRating]);
    }
}
