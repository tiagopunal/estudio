import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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

interface User {
    id: number;
    name: string;
}

interface Props {
    user: User;
    reviews: Review[];
}

export default function ProfilesReviews({ user, reviews }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inicio', href: '/' },
        { title: user.name, href: `/profiles/${user.id}` },
        { title: 'Reseñas', href: `/profiles/${user.id}/reviews` },
    ];

    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reseñas de ${user.name}`} />

            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Reseñas de {user.name}</h1>

                    {reviews.length > 0 && (
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={24}
                                        className={
                                            i < Math.round(parseFloat(averageRating as string)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                        }
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{averageRating}/5</p>
                                <p className="text-gray-600">
                                    Basado en {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {reviews.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500">{user.name} aún no tiene reseñas</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {reviews.map((review) => (
                            <Card key={review.id} className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{review.user.name}</p>
                                            <p className="text-sm text-gray-600">en {review.service.title}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-gray-700">{review.comment}</p>

                                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="flex gap-4">
                    <a href={`/profiles/${user.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                            Volver al Perfil
                        </Button>
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
