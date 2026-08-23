import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BriefcaseBusiness, Edit3, Eye, Plus, Star } from 'lucide-react';
interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    average_rating: number;
    reviews: unknown[];
    bookings: unknown[];
}
export default function ServicesIndex({ services }: { services: Service[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Mis servicios', href: '/services' }]}>
            <Head title="Mis servicios" />
            <div className="prolink-page">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="prolink-kicker">Catálogo profesional</p>
                        <h1 className="prolink-title mt-2">Mis servicios</h1>
                        <p className="prolink-subtitle">Gestioná y optimizá tu oferta profesional.</p>
                    </div>
                    <Link href={route('services.create')} className="prolink-primary">
                        <Plus />
                        Añadir servicio
                    </Link>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="prolink-panel p-6">
                        <Eye className="text-primary" />
                        <p className="mt-4 text-sm text-slate-500">Servicios publicados</p>
                        <p className="mt-1 text-3xl font-bold">{services.length}</p>
                    </div>
                    <div className="prolink-panel p-6">
                        <BriefcaseBusiness className="text-primary" />
                        <p className="mt-4 text-sm text-slate-500">Reservas vinculadas</p>
                        <p className="mt-1 text-3xl font-bold">{services.reduce((n, s) => n + s.bookings.length, 0)}</p>
                    </div>
                    <div className="prolink-panel p-6">
                        <Star className="text-primary" />
                        <p className="mt-4 text-sm text-slate-500">Reseñas recibidas</p>
                        <p className="mt-1 text-3xl font-bold">{services.reduce((n, s) => n + s.reviews.length, 0)}</p>
                    </div>
                </div>
                {services.length === 0 ? (
                    <div className="prolink-panel mt-8 p-12 text-center">
                        <BriefcaseBusiness className="mx-auto size-12 text-blue-300" />
                        <h2 className="mt-4 text-xl font-bold">Todavía no publicaste servicios</h2>
                        <p className="mt-2 text-slate-600">Creá tu primera propuesta y empezá a recibir reservas.</p>
                        <Link href={route('services.create')} className="prolink-primary mt-6">
                            Publicar primer servicio
                        </Link>
                    </div>
                ) : (
                    <div className="prolink-panel mt-8 overflow-hidden">
                        <div className="hidden grid-cols-[1.6fr_.7fr_.5fr_.55fr] gap-4 border-b bg-[#f4f4fc] px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase md:grid">
                            <span>Servicio</span>
                            <span>Categoría</span>
                            <span>Precio</span>
                            <span>Acciones</span>
                        </div>
                        {services.map((service) => (
                            <article
                                key={service.id}
                                className="border-border grid gap-4 border-b p-6 last:border-0 md:grid-cols-[1.6fr_.7fr_.5fr_.55fr] md:items-center"
                            >
                                <div>
                                    <h2 className="font-bold">{service.title}</h2>
                                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">{service.description}</p>
                                </div>
                                <span className="text-primary w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold">{service.category}</span>
                                <span className="text-primary font-bold">${Number(service.price).toFixed(2)}</span>
                                <div className="flex gap-2">
                                    <Link href={route('services.show', service.id)} className="rounded-lg border p-2 text-slate-600" aria-label="Ver">
                                        <Eye className="size-4" />
                                    </Link>
                                    <Link
                                        href={route('services.edit', service.id)}
                                        className="text-primary rounded-lg border p-2"
                                        aria-label="Editar"
                                    >
                                        <Edit3 className="size-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
