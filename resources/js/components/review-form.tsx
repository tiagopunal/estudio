import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/types';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import RatingStars from './rating-stars';

interface ReviewFormProps {
    bookingId: number;
    onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
    isLoading?: boolean;
    error?: string;
    existingReview?: Review;
    onCancel?: () => void;
}

export default function ReviewForm({ bookingId, onSubmit, isLoading = false, error, existingReview, onCancel }: ReviewFormProps) {
    void bookingId;
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [submitError, setSubmitError] = useState<string | null>(error || null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (rating === 0) {
            setSubmitError('Por favor selecciona una calificación');
            return;
        }

        try {
            await onSubmit({ rating, comment });
            // Reset form
            setRating(0);
            setComment('');
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Error al guardar la reseña');
        }
    };

    return (
        <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">{existingReview ? 'Editar Reseña' : 'Compartir tu Experiencia'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Errores */}
                {submitError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                {/* Rating */}
                <div>
                    <label className="mb-2 block text-sm font-medium">¿Cómo fue tu experiencia?</label>
                    <RatingStars rating={rating} onRatingChange={setRating} readOnly={false} size="lg" showValue={true} />
                </div>

                {/* Comentario */}
                <div>
                    <label className="mb-2 block text-sm font-medium">Comentario (opcional)</label>
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comparte más detalles sobre tu experiencia..."
                        maxLength={1000}
                        className="resize-none"
                        rows={4}
                    />
                    <p className="mt-1 text-xs text-gray-500">{comment.length}/1000 caracteres</p>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                            Cancelar
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading || rating === 0} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? 'Guardando...' : existingReview ? 'Actualizar Reseña' : 'Enviar Reseña'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
