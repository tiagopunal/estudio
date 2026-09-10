import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingStarsProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export default function RatingStars({ rating, onRatingChange, readOnly = true, size = 'md', showValue = true }: RatingStarsProps) {
    const [hoveredRating, setHoveredRating] = useState(0);
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
        <div className="flex flex-wrap items-center gap-1">
            <div className="flex gap-1" role={readOnly ? undefined : 'radiogroup'} aria-label={readOnly ? undefined : 'Calificación de 1 a 5 estrellas'}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        type="button"
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => !readOnly && setHoveredRating(star)}
                        onMouseLeave={() => !readOnly && setHoveredRating(0)}
                        disabled={readOnly}
                        role={readOnly ? undefined : 'radio'}
                        aria-checked={readOnly ? undefined : rating === star}
                        aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                        className={`${sizeMap[size]} transition duration-150 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                    >
                        <Star className={`h-full w-full transition-colors ${star <= (hoveredRating || rating) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                    </button>
                ))}
            </div>
            {showValue && <span className="ml-2 text-sm font-semibold text-slate-700">{rating} de 5</span>}
        </div>
    );
}
