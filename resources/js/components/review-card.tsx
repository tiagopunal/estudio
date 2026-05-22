import React from 'react';
import { Review, User } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import RatingStars from './rating-stars';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
    review: Review;
    currentUser?: User;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: number) => void;
}

export default function ReviewCard({
    review,
    currentUser,
    onEdit,
    onDelete,
}: ReviewCardProps) {
    const isOwner = currentUser?.id === review.user_id;

    return (
        <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
            {/* Header con usuario y fecha */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <img
                            src={review.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.id}`}
                            alt={review.user?.name}
                        />
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{review.user?.name}</p>
                        <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(review.created_at), {
                                addSuffix: true,
                                locale: es,
                            })}
                        </p>
                    </div>
                </div>

                {/* Acciones (solo para el dueño) */}
                {isOwner && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(review)}
                                className="hover:text-blue-600"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(review.id)}
                                className="hover:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="mb-3">
                <RatingStars rating={review.rating} readOnly size="md" showValue={true} />
            </div>

            {/* Comentario */}
            {review.comment && (
                <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
            )}

            {/* Servicio */}
            {review.service && (
                <p className="text-xs text-gray-500 border-t pt-2">
                    Servicio: <span className="font-semibold">{review.service.title}</span>
                </p>
            )}
        </div>
    );
}
