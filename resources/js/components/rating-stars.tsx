import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export default function RatingStars({
    rating,
    onRatingChange,
    readOnly = true,
    size = 'md',
    showValue = true,
}: RatingStarsProps) {
    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleStarClick = (value: number) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        disabled={readOnly}
                        className={`${sizeMap[size]} transition-colors ${
                            readOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
                        }`}
                    >
                        <Star
                            className={`w-full h-full ${
                                star <= rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
            {showValue && (
                <span className="text-sm font-semibold text-gray-700 ml-2">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
