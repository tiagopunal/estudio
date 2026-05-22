import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Star } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    service: {
        id: number;
        title: string;
    };
}

interface Props {
    review: Review;
}

export default function ReviewsShow({ review }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reseña', href: `/reviews/${review.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reseña" />

            <div className="max-w-2xl mx-auto">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold">{review.service.title}</h1>
                            <p className="text-gray-600">por {review.user.name}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={24}
                                    className={
                                        i < review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }
                                />
                            ))}
                            <span className="ml-2 text-lg font-semibold">{review.rating}/5</span>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-gray-700">{review.comment}</p>
                        </div>

                        <p className="text-sm text-gray-500">
                            Publicado el {new Date(review.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <a href="/bookings" className="flex-1">
                            <Button variant="outline" className="w-full">
                                Volver
                            </Button>
                        </a>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
