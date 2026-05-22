import React from 'react';
import { Review } from '@/types';
import ReviewCard from './review-card';
import { Skeleton } from '@/components/ui/skeleton';

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
                    <div key={i} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8">
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
                    currentUser={
                        currentUserId
                            ? { id: currentUserId } as any
                            : undefined
                    }
                    onEdit={onEditReview}
                    onDelete={onDeleteReview}
                />
            ))}
        </div>
    );
}
