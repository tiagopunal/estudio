import RatingStars from '@/components/rating-stars';
import ReviewList from '@/components/review-list';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Review, Service, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface ServiceProps {
    service: Service;
    reviews: Review[];
    average_rating: number;
    currentBooking?: {
        id: number;
        status: string;
    };
    currentUser?: User;
    auth?: {
        user?: User;
    };
}

export default function ServicePage({ service, reviews, average_rating, currentBooking, currentUser, auth }: ServiceProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reseñas', href: '/reviews' },
        { title: service.title, href: `/reviews/service/${service.id}` },
    ];

    const userReview = currentUser ? reviews.find((review) => review.user_id === currentUser.id) : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reseñas de ${service.title}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">{service.title}</h1>
                            <p className="text-sm text-slate-500">{service.description}</p>
                            {service.user?.profile?.description && (
                                <p className="mt-2 text-sm text-slate-600">
                                    Vendedor: <span className="font-medium">{service.user.name}</span> — {service.user.profile.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700">
                            <span className="font-semibold">{average_rating?.toFixed(1) ?? '0.0'}</span>
                            <RatingStars rating={average_rating ?? 0} readOnly showValue={false} size="sm" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Reseñas del servicio</h2>
                                    <p className="text-sm text-slate-500">
                                        {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                {auth?.user && (
                                    <Link
                                        href={route('reviews.create', { service: service.id })}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Escribir reseña
                                    </Link>
                                )}
                            </div>
                        </div>

                        <ReviewList
                            reviews={reviews}
                            currentUserId={auth?.user?.id}
                            onEditReview={(review) => {
                                router.visit(route('reviews.edit', review.id));
                            }}
                            onDeleteReview={(reviewId) => {
                                if (!window.confirm('¿Eliminar reseña?')) return;
                                router.delete(route('reviews.destroy', reviewId), {
                                    preserveScroll: true,
                                });
                            }}
                            emptyMessage="No hay reseñas para este servicio todavía."
                        />
                    </div>

                    <div className="space-y-4">
                        {currentBooking && (
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold">Reserva lista para reseñar</h3>
                                <p className="text-sm text-slate-500">Puedes dejar tu opinión porque tu reserva está completada.</p>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={route('reviews.create', { service: service.id })}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Dejar reseña
                                    </Link>
                                </div>
                            </div>
                        )}

                        {userReview && (
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold">Tu reseña</h3>
                                <p className="text-sm text-slate-500">Edita tu comentario directamente si deseas mejorar tu opinión.</p>
                                <div className="mt-4">
                                    <Link
                                        href={route('reviews.edit', userReview.id)}
                                        className="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
                                    >
                                        Editar reseña
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
