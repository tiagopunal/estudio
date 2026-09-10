import { ProLinkFooter } from '@/components/prolink-footer';
import { ProLinkHeader } from '@/components/prolink-header';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MessageSquareText, Star } from 'lucide-react';

interface Review {
    id: number;
    rating: number | string;
    comment?: string | null;
    created_at: string;
    user: { id: number; name: string };
    service: { id: number; title: string };
}

interface User {
    id: number;
    name: string;
    profile?: { full_name?: string | null; profession?: string | null };
}

export default function ProfilesReviews({ user, reviews }: { user: User; reviews: Review[] }) {
    const displayName = user.profile?.full_name || user.name;
    const average = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length : 0;

    return (
        <div className="flex min-h-screen flex-col bg-[#f8f7fc] text-slate-950">
            <Head title={`Reseñas de ${displayName}`} />
            <ProLinkHeader />
            <main className="prolink-page flex-1">
                <Link href={`/profiles/${user.id}`} className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900">
                    <ArrowLeft className="size-4" /> Volver al perfil
                </Link>

                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="prolink-kicker">Opiniones verificadas</p>
                        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Reseñas de {displayName}</h1>
                        <p className="mt-2 text-lg text-slate-700">Experiencias compartidas por clientes de sus servicios.</p>
                    </div>
                    <div className="prolink-panel flex items-center gap-4 px-6 py-4">
                        <span className="text-4xl font-black">{average.toFixed(1)}</span>
                        <div>
                            <div className="flex gap-1" aria-label={`${average.toFixed(1)} de 5 estrellas`}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`size-5 ${star <= Math.round(average) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                                    />
                                ))}
                            </div>
                            <p className="mt-1 text-sm font-semibold text-slate-600">
                                {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                            </p>
                        </div>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <section className="prolink-panel mt-8 flex min-h-72 flex-col items-center justify-center p-10 text-center">
                        <span className="flex size-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <MessageSquareText className="size-8" />
                        </span>
                        <h2 className="mt-5 text-2xl font-bold">Todavía no recibió reseñas</h2>
                        <p className="mt-2 text-slate-600">Las opiniones aparecerán cuando se completen y califiquen sus servicios.</p>
                    </section>
                ) : (
                    <section className="mt-8 space-y-5">
                        {reviews.map((review) => (
                            <article key={review.id} className="prolink-panel p-6 sm:p-7">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-11 items-center justify-center rounded-full bg-blue-100 font-black text-blue-800">
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </span>
                                        <div>
                                            <p className="font-bold">{review.user.name}</p>
                                            <Link
                                                href={`/services/${review.service.id}`}
                                                className="text-sm font-semibold text-blue-700 hover:underline"
                                            >
                                                {review.service.title}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex gap-1" aria-label={`${review.rating} de 5 estrellas`}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`size-5 ${star <= Number(review.rating) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-5 text-lg leading-8 text-slate-700">
                                    {review.comment || 'El cliente dejó una calificación sin comentario.'}
                                </p>
                                <p className="mt-4 text-sm font-semibold text-slate-500">
                                    {new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(new Date(review.created_at))}
                                </p>
                            </article>
                        ))}
                    </section>
                )}
            </main>
            <ProLinkFooter />
        </div>
    );
}
