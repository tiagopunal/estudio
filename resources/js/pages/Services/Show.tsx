import { ServiceMap } from '@/components/maps/service-map';
import { ProLinkFooter } from '@/components/prolink-footer';
import { ProLinkHeader } from '@/components/prolink-header';
import { Head, Link, useForm } from '@inertiajs/react';
import { BriefcaseBusiness, Edit3, MapPin, MessageSquarePlus, Star, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
interface Review {
    id: number;
    rating: number;
    comment: string;
    user: { id: number; name: string };
}
interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    location?: string | null;
    image_url?: string | null;
    average_rating: number;
    latitude?: number;
    longitude?: number;
    user: { id: number; name: string; profile?: { description?: string } };
    reviews: Review[];
}
interface Props {
    service: Service;
    isOwner: boolean;
    reviewableBookingId?: number | null;
}
export default function ServicesShow({ service, isOwner, reviewableBookingId }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { delete: destroy, processing } = useForm();
    const remove = () => destroy(`/services/${service.id}`, { onFinish: () => setDeleteOpen(false) });
    return (
        <div className="flex min-h-screen flex-col bg-[#f8f7fc]">
            <Head title={service.title} />
            <ProLinkHeader />
            <main className="prolink-page flex-1">
                <div className="grid gap-8 lg:grid-cols-[1.45fr_.65fr]">
                    <div>
                        {service.image_url ? (
                            <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200">
                                <img src={`/${service.image_url}`} alt={service.title} className="h-full w-full object-cover" />
                            </div>
                        ) : (
                            <div className="flex min-h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200">
                                <BriefcaseBusiness className="size-24 text-blue-700/30" />
                            </div>
                        )}
                        <p className="prolink-kicker mt-8">{service.category}</p>
                        <h1 className="prolink-title mt-2">{service.title}</h1>
                        <p className="mt-6 text-lg leading-8 whitespace-pre-line text-slate-700">{service.description}</p>
                        <section className="prolink-panel mt-8 p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Reseñas de este servicio</h2>
                                    <span className="mt-1 flex items-center gap-2 font-bold text-slate-700">
                                        <Star className="fill-amber-400 text-amber-400" />
                                        {Number(service.average_rating || 0).toFixed(1)} ({service.reviews.length})
                                    </span>
                                </div>
                                {reviewableBookingId && (
                                    <Link href={route('bookings.reviews.create', reviewableBookingId)} className="prolink-primary shrink-0">
                                        <MessageSquarePlus className="size-5" />
                                        Reseñar servicio recibido
                                    </Link>
                                )}
                            </div>
                            {service.reviews.length ? (
                                <div className="mt-5 space-y-4">
                                    {service.reviews.map((r) => (
                                        <article key={r.id} className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
                                            <div className="flex justify-between">
                                                <strong>{r.user.name}</strong>
                                                <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                                            </div>
                                            <p className="mt-3 text-slate-700">{r.comment}</p>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-5 text-slate-600">
                                    Este servicio todavía no tiene reseñas. Solo pueden opinar quienes hayan completado una reserva.
                                </p>
                            )}
                        </section>
                    </div>
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="prolink-panel p-6">
                            <p className="text-sm font-bold text-slate-500 uppercase">Desde</p>
                            <p className="mt-1 text-4xl font-bold text-blue-700">
                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(
                                    Number(service.price),
                                )}
                            </p>
                            <div className="border-border mt-6 border-t pt-5">
                                <p className="flex items-center gap-2 font-bold">
                                    <UserRound className="text-primary" />
                                    {service.user.name}
                                </p>
                                {service.user.profile?.description && (
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.user.profile.description}</p>
                                )}
                                <Link href={route('profiles.show', service.user.id)} className="text-primary mt-3 inline-flex text-sm font-bold">
                                    Ver perfil profesional
                                </Link>
                            </div>
                            {service.latitude != null && service.longitude != null && (
                                <p className="mt-5 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                                    <MapPin />
                                    Ubicación registrada
                                </p>
                            )}
                            {!isOwner ? (
                                <Link href={`${route('bookings.create')}?service_id=${service.id}`} className="prolink-primary mt-6 w-full">
                                    Reservar ahora
                                </Link>
                            ) : (
                                <div className="mt-6 grid gap-2">
                                    <Link href={route('services.edit', service.id)} className="prolink-primary">
                                        <Edit3 />
                                        Editar servicio
                                    </Link>
                                    <button
                                        onClick={() => setDeleteOpen(true)}
                                        className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 font-bold text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 />
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
                {service.latitude != null && service.longitude != null && (
                    <section className="mt-8">
                        <div className="mb-4">
                            <p className="prolink-kicker">Ubicación</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-950">Dónde se presta este servicio</h2>
                            {service.location && <p className="mt-1 text-slate-600">{service.location}</p>}
                        </div>
                        <ServiceMap
                            className="h-96"
                            services={[
                                {
                                    id: service.id,
                                    title: service.title,
                                    category: service.category,
                                    price: service.price,
                                    location: service.location,
                                    latitude: service.latitude,
                                    longitude: service.longitude,
                                    user: { name: service.user.name },
                                },
                            ]}
                        />
                    </section>
                )}
            </main>
            <ProLinkFooter />
            {deleteOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
                    onMouseDown={() => setDeleteOpen(false)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-service-title"
                        className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-7 shadow-2xl"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                            <Trash2 />
                        </div>
                        <h2 id="delete-service-title" className="mt-5 text-2xl font-bold text-slate-950">
                            Eliminar servicio
                        </h2>
                        <p className="mt-3 leading-6 text-slate-600">
                            Vas a eliminar <strong className="text-slate-900">{service.title}</strong>. Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button type="button" className="prolink-secondary" onClick={() => setDeleteOpen(false)} disabled={processing}>
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
                                onClick={remove}
                                disabled={processing}
                            >
                                <Trash2 className="size-4" />
                                {processing ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
