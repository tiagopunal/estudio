import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Star } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    service: {
        id: number;
        title: string;
    };
}

interface Props {
    review: Review;
}

export default function ReviewsEdit({ review }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        rating: review.rating,
        comment: review.comment,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reseña', href: `/reviews/${review.id}` },
        { title: 'Editar', href: `/reviews/${review.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('reviews.update', review.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Reseña" />

            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-3xl font-bold">Editar Reseña: {review.service.title}</h1>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Calificación */}
                        <div>
                            <Label>Calificación</Label>
                            <div className="mt-3 flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setData('rating', star)}
                                        className="transition focus:outline-none"
                                    >
                                        <Star size={32} className={star <= data.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{data.rating} de 5 estrellas</p>
                        </div>

                        {/* Comentario */}
                        <div>
                            <Label htmlFor="comment">Tu comentario</Label>
                            <textarea
                                id="comment"
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                rows={6}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.comment && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.comment}
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={processing} className="flex-1">
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                            <a href={`/reviews/${review.id}`}>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </a>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
