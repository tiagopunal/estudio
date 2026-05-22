<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewStoreRequest;
use App\Http\Requests\ReviewUpdateRequest;
use App\Models\Review;
use App\Models\Booking;
use App\Models\Service;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Listar todas las reseñas (opcional: filtrar por servicio)
     * GET /api/reviews
     * GET /api/reviews?service_id=1
     */
    public function index(Request $request)
    {
        try {
            $query = Review::query();

            // Filtrar por servicio si se proporciona
            if ($request->has('service_id')) {
                $query->where('service_id', $request->service_id);
            }

            $reviews = $query->with(['user', 'service', 'booking'])
                ->orderBy('created_at', 'desc')
                ->get();

            return ApiResponse::success($reviews, "Reseñas obtenidas correctamente");
        } catch (\Exception $e) {
            return ApiResponse::error("Error al obtener reseñas: " . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener reseñas de un servicio específico
     * GET /api/reviews/service/{serviceId}
     */
    public function serviceReviews($serviceId)
    {
        try {
            $service = Service::findOrFail($serviceId);

            $reviews = $service->reviews()
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get();

            return ApiResponse::success(
                [
                    'service' => $service,
                    'reviews' => $reviews,
                    'average_rating' => $service->average_rating
                ],
                "Reseñas del servicio obtenidas correctamente"
            );
        } catch (\Exception $e) {
            return ApiResponse::error("Error al obtener reseñas del servicio: " . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener una reseña específica
     * GET /api/reviews/{id}
     */
    public function show($id)
    {
        try {
            $review = Review::with(['user', 'service', 'booking'])->findOrFail($id);

            return ApiResponse::success($review, "Reseña obtenida correctamente");
        } catch (\Exception $e) {
            return ApiResponse::error("Reseña no encontrada", 404);
        }
    }

    /**
     * Crear una nueva reseña
     * POST /api/reviews
     */
    public function store(ReviewStoreRequest $request)
    {
        try {
            $booking = Booking::findOrFail($request->booking_id);
            $user = Auth::user();

            // Validar que la reserva pertenezca al usuario autenticado
            if ($booking->user_id !== $user->id) {
                return ApiResponse::error("No tienes permiso para reseñar esta reserva", 403);
            }

            // Validar que la reserva esté completada
            if ($booking->status !== 'completada') {
                return ApiResponse::error("Solo se pueden reseñar reservas completadas", 400);
            }

            // Validar que no exista ya una reseña para esta reserva
            $existingReview = Review::where('booking_id', $booking->id)->first();
            if ($existingReview) {
                return ApiResponse::error("Ya existe una reseña para esta reserva", 400);
            }

            // Crear la reseña
            $review = Review::create([
                'user_id' => $user->id,
                'service_id' => $booking->service_id,
                'booking_id' => $booking->id,
                'rating' => $request->rating,
                'comment' => $request->comment
            ]);

            // Recalcular el promedio de calificaciones del servicio
            $this->updateServiceRating($booking->service_id);

            // Obtener la reseña con sus relaciones
            $review->load(['user', 'service', 'booking']);

            return ApiResponse::success($review, "Reseña creada correctamente", 201);
        } catch (\Exception $e) {
            return ApiResponse::error("Error al crear reseña: " . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar una reseña
     * PUT /api/reviews/{id}
     */
    public function update($id, ReviewUpdateRequest $request)
    {
        try {
            $review = Review::findOrFail($id);
            $user = Auth::user();

            // Validar que el usuario sea el dueño de la reseña
            if ($review->user_id !== $user->id) {
                return ApiResponse::error("No tienes permiso para editar esta reseña", 403);
            }

            // Actualizar la reseña
            $review->update([
                'rating' => $request->rating ?? $review->rating,
                'comment' => $request->comment ?? $review->comment
            ]);

            // Recalcular el promedio de calificaciones del servicio
            $this->updateServiceRating($review->service_id);

            // Obtener la reseña con sus relaciones
            $review->load(['user', 'service', 'booking']);

            return ApiResponse::success($review, "Reseña actualizada correctamente");
        } catch (\Exception $e) {
            return ApiResponse::error("Error al actualizar reseña: " . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar una reseña
     * DELETE /api/reviews/{id}
     */
    public function destroy($id)
    {
        try {
            $review = Review::findOrFail($id);
            $user = Auth::user();

            // Validar que el usuario sea el dueño de la reseña
            if ($review->user_id !== $user->id) {
                return ApiResponse::error("No tienes permiso para eliminar esta reseña", 403);
            }

            $serviceId = $review->service_id;

            // Eliminar la reseña
            $review->delete();

            // Recalcular el promedio de calificaciones del servicio
            $this->updateServiceRating($serviceId);

            return ApiResponse::success(null, "Reseña eliminada correctamente");
        } catch (\Exception $e) {
            return ApiResponse::error("Error al eliminar reseña: " . $e->getMessage(), 500);
        }
    }

    /**
     * Calcular y actualizar el promedio de calificaciones de un servicio
     */
    private function updateServiceRating($serviceId)
    {
        try {
            $service = Service::findOrFail($serviceId);

            // Calcular el promedio de ratings
            $averageRating = Review::where('service_id', $serviceId)
                ->avg('rating');

            // Actualizar el servicio
            $service->update([
                'average_rating' => $averageRating ?? 0
            ]);
        } catch (\Exception $e) {
            // Log silencioso de errores en recalculación
            \Log::error("Error al recalcular rating del servicio: " . $e->getMessage());
        }
    }

    /**
     * Obtener reseñas del usuario autenticado
     * GET /api/reviews/user/me
     */
    public function userReviews()
    {
        try {
            $user = Auth::user();

            $reviews = Review::where('user_id', $user->id)
                ->with(['service', 'booking'])
                ->orderBy('created_at', 'desc')
                ->get();

            return ApiResponse::success($reviews, "Reseñas del usuario obtenidas correctamente");
        } catch (\Exception $e) {
            return ApiResponse::error("Error al obtener reseñas del usuario: " . $e->getMessage(), 500);
        }
    }
}
