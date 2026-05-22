import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Review, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface EditProps {
    review: Review;
    auth?: {
        user?: User;
    };
}

export default function Edit({ review }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        rating: review.rating,
        comment: review.comment || '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        put(route('reviews.update', review.id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reseñas', href: '/reviews' },
        { title: `Editar #${review.id}`, href: `/reviews/${review.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar reseña #${review.id}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Editar reseña</h1>
                        <p className="text-sm text-gray-500">
                            Ajusta la valoración y el comentario de tu reseña.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <Label htmlFor="rating">Calificación</Label>
                        <Input
                            id="rating"
                            type="number"
                            min={1}
                            max={5}
                            value={data.rating}
                            onChange={(event) => setData('rating', Number(event.target.value))}
                            placeholder="1 a 5"
                        />
                        <InputError message={errors.rating} />
                    </div>

                    <div>
                        <Label htmlFor="comment">Comentario</Label>
                        <Textarea
                            id="comment"
                            value={data.comment}
                            onChange={(event) => setData('comment', event.target.value)}
                            placeholder="Actualiza tu comentario"
                            rows={5}
                        />
                        <InputError message={errors.comment} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Actualizando...' : 'Guardar cambios'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
