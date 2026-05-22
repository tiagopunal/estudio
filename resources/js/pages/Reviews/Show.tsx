import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Review, BreadcrumbItem, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface ShowProps {
    review: Review;
    auth?: {
        user?: User;
    };
}

export default function Show({ review, auth }: ShowProps) {
    const flash = (usePage().props.flash ?? {}) as { success?: string; error?: string };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reseñas', href: '/reviews' },
        { title: `Reseña #${review.id}`, href: `/reviews/${review.id}` },
    ];

    const isOwner = auth?.user?.id === review.user_id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reseña #${review.id}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Reseña de {review.service?.title}</h1>
                        <p className="text-sm text-gray-500">
                            Publicada por {review.user?.name} {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: es })}
                        </p>
                    </div>
                    {isOwner && (
                        <Link href={route('reviews.edit', review.id)}>
                            <Button>Editar reseña</Button>
                        </Link>
                    )}
                </div>

                {flash.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                        {flash.error}
                    </div>
                )}

                <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Calificación: {review.rating}/5</div>
                        <span className="text-sm text-slate-500">Reserva #{review.booking?.id}</span>
                    </div>
                    <p className="text-base leading-7 text-slate-700">{review.comment ?? 'Sin comentario adicional.'}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                        {review.service && (
                            <div className="rounded-lg border border-slate-200 p-4">
                                <h2 className="font-semibold">Servicio</h2>
                                <p className="text-sm text-slate-600">{review.service.title}</p>
                                <p className="text-sm text-slate-500">Precio: ${review.service.price}</p>
                            </div>
                        )}
                        {review.booking && (
                            <div className="rounded-lg border border-slate-200 p-4">
                                <h2 className="font-semibold">Reserva</h2>
                                <p className="text-sm text-slate-600">Fecha: {review.booking.date}</p>
                                <p className="text-sm text-slate-500">Estado: {review.booking.status}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
