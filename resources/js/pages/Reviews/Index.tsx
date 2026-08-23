import ReviewList from '@/components/review-list';
import AppLayout from '@/layouts/app-layout';
import { type Review, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { MessageSquareText, Plus, Star } from 'lucide-react';
interface Props {
    reviews: Review[];
    mine?: boolean;
    auth?: { user?: User };
}
export default function ReviewsIndex({ reviews, mine, auth }: Props) {
    const flash = usePage().props.flash as { success?: string; error?: string } | undefined;
    const average = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;
    const remove = (id: number) => {
        if (confirm('¿Querés eliminar esta reseña?')) router.delete(route('reviews.destroy', id), { preserveScroll: true });
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Reseñas', href: '/reviews' }]}>
            <Head title="Reseñas" />
            <div className="prolink-page">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="prolink-kicker">Opiniones del marketplace</p>
                        <h1 className="prolink-title mt-2">{mine ? 'Mis reseñas' : 'Reseñas y calificaciones'}</h1>
                        <p className="prolink-subtitle">Experiencias reales que ayudan a elegir mejor.</p>
                    </div>
                    {auth?.user && (
                        <Link href={route('reviews.create')} className="prolink-primary">
                            <Plus />
                            Escribir reseña
                        </Link>
                    )}
                </div>
                {(flash?.success || flash?.error) && (
                    <div
                        className={`mt-6 rounded-xl border p-4 ${flash.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}
                    >
                        {flash.error || flash.success}
                    </div>
                )}
                <div className="mt-8 grid gap-5 sm:grid-cols-3">
                    <div className="prolink-panel p-6 sm:col-span-1">
                        <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">Calificación promedio</p>
                        <p className="mt-3 text-5xl font-bold">
                            {average.toFixed(1)}
                            <span className="text-xl text-slate-400"> / 5</span>
                        </p>
                        <div className="mt-3 flex gap-1">
                            {[1, 2, 3, 4, 5].map((x) => (
                                <Star key={x} className={`size-5 ${x <= Math.round(average) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="prolink-panel flex items-center gap-5 p-6 sm:col-span-2">
                        <span className="text-primary flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-50">
                            <MessageSquareText />
                        </span>
                        <div>
                            <p className="text-3xl font-bold">{reviews.length}</p>
                            <p className="mt-1 text-slate-600">reseñas disponibles en esta sección</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 [&>*]:max-w-none">
                    <ReviewList
                        reviews={reviews}
                        currentUserId={auth?.user?.id}
                        onEditReview={(review) => router.visit(route('reviews.edit', review.id))}
                        onDeleteReview={remove}
                        emptyMessage="Todavía no hay reseñas disponibles."
                    />
                </div>
            </div>
        </AppLayout>
    );
}
