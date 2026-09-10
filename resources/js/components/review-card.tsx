import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Review, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';
import RatingStars from './rating-stars';

interface ReviewCardProps {
    review: Review;
    currentUser?: Pick<User, 'id'>;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: number) => void;
}

export default function ReviewCard({ review, currentUser, onEdit, onDelete }: ReviewCardProps) {
    const isOwner = currentUser?.id === review.user_id;

    return (
        <div className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
            {/* Header con usuario y fecha */}
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <img
                            src={review.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.id}`}
                            alt={review.user?.name}
                        />
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">{review.user?.name}</p>
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
                            <Button variant="ghost" size="sm" onClick={() => onEdit(review)} className="hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="ghost" size="sm" onClick={() => onDelete(review.id)} className="hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
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
            {review.comment && <p className="mb-2 text-sm text-gray-700">{review.comment}</p>}

            {/* Servicio */}
            {review.service && (
                <p className="border-t pt-2 text-xs text-gray-500">
                    Servicio: <span className="font-semibold">{review.service.title}</span>
                </p>
            )}
        </div>
    );
}
