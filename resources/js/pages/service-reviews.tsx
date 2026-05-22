import React, { useEffect, useState } from 'react';
import { Service, Review, User } from '@/types';
import { useReviews } from '@/hooks/useReviews';
import ReviewForm from '@/components/review-form';
import ReviewList from '@/components/review-list';
import RatingStars from '@/components/rating-stars';
import Heading from '@/components/heading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ServiceReviewsPageProps {
    service: Service;
    currentUser?: User;
    currentBooking?: {
        id: number;
        status: string;
    };
    authToken?: string;
}

/**
 * Componente que muestra todas las reseñas de un servicio
 * Se integra en la página de detalle del servicio
 */
export default function ServiceReviewsPage({
    service,
    currentUser,
    currentBooking,
    authToken,
}: ServiceReviewsPageProps) {
    const {
        reviews,
        isLoading,
        error,
        averageRating,
        fetchServiceReviews,
        createReview,
        updateReview,
        deleteReview,
    } = useReviews({ serviceId: service.id });

    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar reseñas al iniciar
    useEffect(() => {
        fetchServiceReviews(service.id);
    }, [service.id, fetchServiceReviews]);

    // Verificar si el usuario puede dejar reseña
    const canLeaveReview =
        currentUser &&
        currentBooking &&
        currentBooking.status === 'completada' &&
        !reviews.some((r) => r.booking_id === currentBooking.id) &&
        authToken;

    const userReview = currentUser
        ? reviews.find((r) => r.user_id === currentUser.id)
        : null;

    // Manejar envío de formulario
    const handleSubmitReview = async (data: {
        rating: number;
        comment: string;
    }) => {
        if (!authToken || !currentBooking) return;

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            if (editingReview) {
                // Actualizar reseña existente
                await updateReview(
                    editingReview.id,
                    data.rating,
                    data.comment,
                    authToken
                );
                setSubmitSuccess('Reseña actualizada correctamente');
                setEditingReview(null);
            } else {
                // Crear nueva reseña
                await createReview(
                    currentBooking.id,
                    data.rating,
                    data.comment,
                    authToken
                );
                setSubmitSuccess('Reseña creada correctamente');
            }
            setShowForm(false);
            setTimeout(() => setSubmitSuccess(null), 3000);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Error desconocido';
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejar edición de reseña
    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    // Manejar eliminación de reseña
    const handleDeleteReview = async (reviewId: number) => {
        if (!authToken || !window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
            return;
        }

        try {
            await deleteReview(reviewId, authToken);
            setSubmitSuccess('Reseña eliminada correctamente');
            setTimeout(() => setSubmitSuccess(null), 3000);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Error desconocido';
            setSubmitError(message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <Heading
                title="Reseñas y Calificaciones"
                description={`${reviews.length} reseña${reviews.length !== 1 ? 's' : ''}`}
            />

            {/* Resumen de calificación */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">
                            Calificación promedio
                        </p>
                        <RatingStars
                            rating={averageRating}
                            readOnly
                            size="lg"
                            showValue={true}
                        />
                    </div>
                    <div className="text-sm text-gray-600">
                        Basada en {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Mensajes de error y éxito */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {submitError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                </Alert>
            )}

            {submitSuccess && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        {submitSuccess}
                    </AlertDescription>
                </Alert>
            )}

            {/* Formulario de reseña */}
            {canLeaveReview && (
                <>
                    {showForm ? (
                        <ReviewForm
                            bookingId={currentBooking.id}
                            onSubmit={handleSubmitReview}
                            isLoading={isSubmitting}
                            error={submitError || undefined}
                            existingReview={editingReview || undefined}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingReview(null);
                            }}
                        />
                    ) : (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors"
                        >
                            <p className="text-blue-600 font-medium">
                                + Comparte tu experiencia
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Ayuda a otros a conocer tu opinión sobre este servicio
                            </p>
                        </button>
                    )}
                </>
            )}

            {/* Formulario de edición */}
            {editingReview && showForm && (
                <ReviewForm
                    bookingId={currentBooking?.id || 0}
                    onSubmit={handleSubmitReview}
                    isLoading={isSubmitting}
                    error={submitError || undefined}
                    existingReview={editingReview}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingReview(null);
                    }}
                />
            )}

            {/* Listado de reseñas */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Todas las reseñas</h3>
                <ReviewList
                    reviews={reviews}
                    isLoading={isLoading}
                    onEditReview={currentUser ? handleEditReview : undefined}
                    onDeleteReview={currentUser ? handleDeleteReview : undefined}
                    currentUserId={currentUser?.id}
                    emptyMessage="No hay reseñas aún. ¡Sé el primero en compartir tu experiencia!"
                />
            </div>
        </div>
    );
}
