import Heading from '@/components/heading';
import RatingStars from '@/components/rating-stars';
import ReviewForm from '@/components/review-form';
import ReviewList from '@/components/review-list';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useReviews } from '@/hooks/useReviews';
import { Review, Service, User } from '@/types';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

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
export default function ServiceReviewsPage({ service, currentUser, currentBooking, authToken }: ServiceReviewsPageProps) {
    const { reviews, isLoading, error, averageRating, fetchServiceReviews, createReview, updateReview, deleteReview } = useReviews({
        serviceId: service.id,
    });

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

    // Manejar envío de formulario
    const handleSubmitReview = async (data: { rating: number; comment: string }) => {
        if (!authToken || !currentBooking) return;

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            if (editingReview) {
                // Actualizar reseña existente
                await updateReview(editingReview.id, data.rating, data.comment, authToken);
                setSubmitSuccess('Reseña actualizada correctamente');
                setEditingReview(null);
            } else {
                // Crear nueva reseña
                await createReview(currentBooking.id, data.rating, data.comment, authToken);
                setSubmitSuccess('Reseña creada correctamente');
            }
            setShowForm(false);
            setTimeout(() => setSubmitSuccess(null), 3000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
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
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setSubmitError(message);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Encabezado */}
            <Heading title="Reseñas y Calificaciones" description={`${reviews.length} reseña${reviews.length !== 1 ? 's' : ''}`} />

            {/* Resumen de calificación */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-600">Calificación promedio</p>
                        <RatingStars rating={averageRating} readOnly size="lg" showValue={true} />
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
                <Alert variant="default" className="border-green-200 bg-green-50">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{submitSuccess}</AlertDescription>
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
                            className="w-full rounded-lg border-2 border-dashed border-blue-300 p-4 text-center transition-colors hover:bg-blue-50"
                        >
                            <p className="font-medium text-blue-600">+ Comparte tu experiencia</p>
                            <p className="mt-1 text-sm text-gray-600">Ayuda a otros a conocer tu opinión sobre este servicio</p>
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
                <h3 className="mb-4 text-lg font-semibold">Todas las reseñas</h3>
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
