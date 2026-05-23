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
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
            'query' => $request->only(['service_id']),
        ]);
    }

    public function create(Request $request, ?Booking $booking = null)
    {
        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        if ($booking) {
            if ($booking->user_id !== $user->id) {
                abort(403);
            }

            $bookings = collect([$booking->load(['service', 'user'])]);
            $selectedServiceId = $booking->service_id;
        } else {
            $bookingsQuery = Booking::where('user_id', $user->id)
                ->whereIn('status', ['completed', 'completada'])
                ->whereNotIn('id', Review::select('booking_id'))
                ->with('service');

            if ($request->filled('service')) {
                $bookingsQuery->where('service_id', $request->input('service'));
            }

            $bookings = $bookingsQuery->get();
            $selectedServiceId = $request->input('service');
        }

        return Inertia::render('Reviews/Create', [
            'bookings' => $bookings,
            'selectedServiceId' => $selectedServiceId,
        ]);
    }

    public function store(ReviewStoreRequest $request)
    {
        $booking = Booking::findOrFail($request->booking_id);
        $user = Auth::user();

        if (! $user || $booking->user_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para reseñar esta reserva')->withInput();
        }

        if (! $this->isCompletedStatus($booking->status)) {
            return back()->with('error', 'Solo se pueden reseñar reservas completadas')->withInput();
        }

        if (Review::where('booking_id', $booking->id)->exists()) {
            return back()->with('error', 'Ya existe una reseña para esta reserva')->withInput();
        }

        $review = Review::create([
            'user_id' => $user->id,
            'service_id' => $booking->service_id,
            'booking_id' => $booking->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $this->updateServiceAverageRating($booking->service_id);

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
        $this->authorize('update', $review);

        $review->load(['user', 'service', 'booking']);

        return Inertia::render('Reviews/Edit', [
            'review' => $review,
        ]);
    }

    public function update(ReviewUpdateRequest $request, Review $review)
    {
        $this->authorize('update', $review);

        $review->update($request->validated());
        $this->updateServiceAverageRating($review->service_id);

        return redirect()->route('reviews.show', $review)
            ->with('success', 'Reseña actualizada correctamente');
    }

    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);

        $serviceId = $review->service_id;
        $review->delete();
        $this->updateServiceAverageRating($serviceId);

        return back()->with('success', 'Reseña eliminada correctamente');
    }

    public function serviceReviews(Service $service)
    {
        $reviews = $service->reviews()
            ->with('user')
            ->orderByDesc('created_at')
            ->get();

        $currentBooking = null;
        $currentUser = Auth::user();

        if ($currentUser) {
            $currentBooking = Booking::where('user_id', $currentUser->id)
                ->where('service_id', $service->id)
                ->whereIn('status', ['completed', 'completada'])
                ->whereNotIn('id', Review::select('booking_id'))
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

        if (! $user) {
            abort(403);
        }

        $reviews = Review::where('user_id', $user->id)
            ->with(['service', 'booking'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
            'mine' => true,
        ]);
    }

    private function updateServiceAverageRating(int $serviceId): void
    {
        $averageRating = Review::where('service_id', $serviceId)
            ->average('rating');

        Service::where('id', $serviceId)
            ->update(['average_rating' => $averageRating ?? 0]);
    }

    private function isCompletedStatus(?string $status): bool
    {
        return in_array($status, ['completed', 'completada'], true);
    }
}
