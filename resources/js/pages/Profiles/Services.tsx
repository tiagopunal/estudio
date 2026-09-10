import { ProLinkFooter } from '@/components/prolink-footer';
import { ProLinkHeader } from '@/components/prolink-header';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BriefcaseBusiness, MapPin, Star } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number | string;
    category: string;
    location?: string | null;
    average_rating?: number | null;
    reviews_avg_rating?: number | string | null;
    reviews_count: number;
}

interface User {
    id: number;
    name: string;
    profile?: { full_name?: string | null; profession?: string | null };
}

interface Props {
    user: User;
    services: Service[];
}

const formatPrice = (price: number | string) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(price));

export default function ProfilesServices({ user, services }: Props) {
    const displayName = user.profile?.full_name || user.name;

    return (
        <div className="flex min-h-screen flex-col bg-[#f8f7fc] text-slate-950">
            <Head title={`Servicios de ${displayName}`} />
            <ProLinkHeader />
            <main className="prolink-page flex-1">
                <Link href={`/profiles/${user.id}`} className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900">
                    <ArrowLeft className="size-4" /> Volver al perfil
                </Link>
                <div className="mt-6">
                    <p className="prolink-kicker">Catálogo profesional</p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Servicios de {displayName}</h1>
                    <p className="mt-2 text-lg text-slate-700">
                        {user.profile?.profession || 'Profesional de ProLink'} · {services.length}{' '}
                        {services.length === 1 ? 'servicio disponible' : 'servicios disponibles'}
                    </p>
                </div>

                {services.length === 0 ? (
                    <section className="prolink-panel mt-8 flex min-h-72 flex-col items-center justify-center p-10 text-center">
                        <span className="flex size-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <BriefcaseBusiness className="size-8" />
                        </span>
                        <h2 className="mt-5 text-2xl font-bold">Todavía no hay servicios publicados</h2>
                        <p className="mt-2 text-slate-600">Volvé pronto para conocer las propuestas de este profesional.</p>
                    </section>
                ) : (
                    <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {services.map((service) => {
                            const rating = Number(service.reviews_avg_rating ?? service.average_rating ?? 0);
                            return (
                                <article
                                    key={service.id}
                                    className="prolink-panel flex min-h-72 flex-col p-6 transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black tracking-wide text-blue-800 uppercase">
                                            {service.category}
                                        </span>
                                        <span className="text-xl font-black text-blue-700">{formatPrice(service.price)}</span>
                                    </div>
                                    <h2 className="mt-5 text-2xl font-bold">{service.title}</h2>
                                    <p className="mt-3 line-clamp-3 leading-6 text-slate-600">{service.description}</p>
                                    <div className="mt-auto pt-6">
                                        <div className="mb-4 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4 text-sm font-semibold text-slate-600">
                                            <span className="flex items-center gap-1.5">
                                                <Star className="size-4 fill-amber-400 text-amber-500" /> {rating.toFixed(1)} ({service.reviews_count}
                                                )
                                            </span>
                                            {service.location && (
                                                <span className="flex min-w-0 items-center gap-1.5">
                                                    <MapPin className="size-4 shrink-0 text-blue-700" />
                                                    <span className="truncate">{service.location}</span>
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/services/${service.id}`} className="prolink-primary w-full">
                                            Ver servicio
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>
            <ProLinkFooter />
        </div>
    );
}
