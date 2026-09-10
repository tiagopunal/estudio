import { Review } from '@/types';
import { useCallback, useState } from 'react';

interface UseReviewsOptions {
    serviceId?: number;
}

interface ReviewResponse {
    success: boolean;
    data: Review;
    message: string;
}

interface ReviewsListResponse {
    success: boolean;
    data: Review[];
    message: string;
}

export function useReviews(options: UseReviewsOptions = {}) {
    void options;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [averageRating, setAverageRating] = useState(0);

    // Obtener reseñas de un servicio
    const fetchServiceReviews = useCallback(async (serviceId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/reviews/service/${serviceId}`);

            if (!response.ok) {
                throw new Error('Error al obtener reseñas');
            }

            const data: ReviewsListResponse & { data: { reviews: Review[]; average_rating: number } } = await response.json();

            setReviews(data.data.reviews);
            setAverageRating(data.data.average_rating);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            console.error('Error fetching reviews:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Obtener mis reseñas
    const fetchMyReviews = useCallback(async (token: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/reviews/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener tus reseñas');
            }

            const data: ReviewsListResponse = await response.json();
            setReviews(data.data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            console.error('Error fetching my reviews:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Crear reseña
    const createReview = useCallback(
        async (bookingId: number, rating: number, comment: string, token: string) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        booking_id: bookingId,
                        rating,
                        comment: comment || null,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al crear reseña');
                }

                const data: ReviewResponse = await response.json();
                setReviews((prev) => [data.data, ...prev]);
                setAverageRating((prev) => (prev * reviews.length + data.data.rating) / (reviews.length + 1));
                return data.data;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [reviews.length],
    );

    // Actualizar reseña
    const updateReview = useCallback(async (reviewId: number, rating: number, comment: string, token: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating,
                    comment: comment || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar reseña');
            }

            const data: ReviewResponse = await response.json();
            setReviews((prev) => prev.map((r) => (r.id === reviewId ? data.data : r)));
            return data.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Eliminar reseña
    const deleteReview = useCallback(
        async (reviewId: number, token: string) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/reviews/${reviewId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar reseña');
                }

                setReviews((prev) => prev.filter((r) => r.id !== reviewId));

                // Recalcular promedio
                if (reviews.length > 0) {
                    const deletedReview = reviews.find((r) => r.id === reviewId);
                    if (deletedReview) {
                        setAverageRating((prev) => (prev * reviews.length - deletedReview.rating) / (reviews.length - 1 || 1));
                    }
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [reviews],
    );

    return {
        reviews,
        isLoading,
        error,
        averageRating,
        fetchServiceReviews,
        fetchMyReviews,
        createReview,
        updateReview,
        deleteReview,
    };
}
