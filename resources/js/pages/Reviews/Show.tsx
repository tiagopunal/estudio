import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem, Review, User } from '@/types';

interface ShowProps {
    review: Review;
    auth?: {
        user?: User;
    };
}

export default function Show({ review, auth }: ShowProps) {
    const page = usePage();
    const flash = page.props.flash as { success?: string; error?: string } | undefined;
    const isOwner = auth?.user?.id === review.user_id;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reseñas', href: '/reviews' },
        { title: `Reseña #${review.id}`, href: `/reviews/${review.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reseña #${review.id}`} />

            <div className="space-y-6">
                {flash?.success && (
                    <Alert>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">Reseña de {review.service?.title}</h1>
                            <p className="text-sm text-gray-500">
                                Publicada por {review.user?.name}
                            </p>
                        </div>
                        {isOwner && (
                            <Link href={route('reviews.edit', review.id)}>
                                <Button>Editar reseña</Button>
                            </Link>
                        )}
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Calificación: {review.rating}/5</div>
                            <span className="text-sm text-slate-500">Reserva #{review.booking?.id}</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {review.service && (
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <h2 className="font-semibold">Servicio</h2>
                                    <p className="text-sm text-slate-600">{review.service.title}</p>
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

                        <div className="border-t pt-4">
                            <p className="text-base leading-7 text-slate-700">{review.comment ?? 'Sin comentario adicional.'}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500">
                                Publicado el {new Date(review.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
