<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewStoreRequest;
use App\Http\Requests\ReviewUpdateRequest;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        return Inertia::render('Reviews/Edit', [
            'review' => $review,
        ]);
    }

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

        return redirect()->route('reviews.show', $review)
            ->with('success', 'Reseña actualizada correctamente');
    }

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
    }
}
