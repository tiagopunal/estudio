<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewStoreRequest;
use App\Http\Requests\ReviewUpdateRequest;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query();

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        $reviews = $query->with(['user', 'service', 'booking'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
            'query' => $request->only(['service_id']),
        ]);
    }

    public function create(Request $request)
    {
        $user = Auth::user();

        $bookingsQuery = Booking::where('user_id', $user->id)
            ->where('status', 'completada')
            ->whereDoesntHave('review')
            ->with('service');

        if ($request->filled('service')) {
            $bookingsQuery->where('service_id', $request->service);
        }

        $bookings = $bookingsQuery->get();

        return Inertia::render('Reviews/Create', [
            'bookings' => $bookings,
            'selectedServiceId' => $request->input('service'),
        ]);
    }

    public function store(ReviewStoreRequest $request)
    {
        $booking = Booking::findOrFail($request->booking_id);
        $user = Auth::user();

        if ($booking->user_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para reseñar esta reserva')->withInput();
        }

        if ($booking->status !== 'completada') {
            return back()->with('error', 'Solo se pueden reseñar reservas completadas')->withInput();
        }

        $existingReview = Review::where('booking_id', $booking->id)->first();
        if ($existingReview) {
            return back()->with('error', 'Ya existe una reseña para esta reserva')->withInput();
        }

        $review = Review::create([
            'user_id' => $user->id,
            'service_id' => $booking->service_id,
            'booking_id' => $booking->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $this->updateServiceRating($booking->service_id);
        $review->load(['user', 'service', 'booking']);

        return redirect()->route('reviews.show', $review)
            ->with('success', 'Reseña creada correctamente');
    }

    public function show(Review $review)
    {
        $review->load(['user', 'service', 'booking']);

        return Inertia::render('Reviews/Show', [
            'review' => $review,
        ]);
    }

    public function edit(Review $review)
    {
        $user = Auth::user();

        if ($review->user_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para editar esta reseña');
        }

        $review->load(['service', 'booking']);
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

<<<<<<< HEAD
    public function update(ReviewUpdateRequest $request, Review $review)
    {
        $user = Auth::user();

        if ($review->user_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para editar esta reseña');
        }

        $review->update([
            'rating' => $request->rating ?? $review->rating,
            'comment' => $request->comment ?? $review->comment,
        ]);

        $this->updateServiceRating($review->service_id);
        $review->load(['user', 'service', 'booking']);
=======
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
>>>>>>> 427c8c77788f0f90503d8e2a80805119c302fe70

        return redirect()->route('reviews.show', $review)
            ->with('success', 'Reseña actualizada correctamente');
    }

<<<<<<< HEAD
    public function destroy(Review $review)
    {
        $user = Auth::user();

        if ($review->user_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para eliminar esta reseña');
        }

        $serviceId = $review->service_id;
        $review->delete();
        $this->updateServiceRating($serviceId);

        return redirect()->route('reviews.index')
            ->with('success', 'Reseña eliminada correctamente');
    }

    private function updateServiceRating($serviceId)
    {
        try {
            $service = Service::findOrFail($serviceId);

            $averageRating = Review::where('service_id', $serviceId)
                ->avg('rating');

            $service->update([
                'average_rating' => $averageRating ?? 0,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al recalcular rating del servicio: ' . $e->getMessage());
        }
    }

    public function serviceReviews(Service $service)
    {
        $reviews = $service->reviews()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $currentBooking = null;
        $currentUser = Auth::user();

        if ($currentUser) {
            $currentBooking = Booking::where('user_id', $currentUser->id)
                ->where('service_id', $service->id)
                ->where('status', 'completada')
                ->whereDoesntHave('review')
                ->with('service')
                ->first();
        }

        return Inertia::render('Reviews/Service', [
            'service' => $service,
            'reviews' => $reviews,
            'average_rating' => $service->average_rating,
            'currentBooking' => $currentBooking,
            'currentUser' => $currentUser,
        ]);
    }

    public function userReviews()
    {
        $user = Auth::user();

        $reviews = Review::where('user_id', $user->id)
            ->with(['service', 'booking'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
            'mine' => true,
        ]);
=======
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
>>>>>>> 427c8c77788f0f90503d8e2a80805119c302fe70
    }
}
