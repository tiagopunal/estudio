import { Skeleton } from '@/components/ui/skeleton';
import { Review } from '@/types';
import ReviewCard from './review-card';

interface ReviewListProps {
    reviews: Review[];
    isLoading?: boolean;
    onEditReview?: (review: Review) => void;
    onDeleteReview?: (reviewId: number) => void;
    currentUserId?: number;
    emptyMessage?: string;
}

export default function ReviewList({
    reviews,
    isLoading = false,
    onEditReview,
    onDeleteReview,
    currentUserId,
    emptyMessage = 'No hay reseñas aún',
}: ReviewListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg border bg-white p-4">
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex flex-1 items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="mb-2 h-4 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    currentUser={currentUserId ? { id: currentUserId } : undefined}
                    onEdit={onEditReview}
                    onDelete={onDeleteReview}
                />
            ))}
        </div>
    );
}
