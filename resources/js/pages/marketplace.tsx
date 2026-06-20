import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock3, MapPin, Search, Star } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Marketplace',
        href: '/marketplace',
    },
];

const services = [
    {
        id: 1,
        title: 'Limpieza residencial express',
        category: 'Hogar',
        description: 'Limpieza profunda y agenda flexible para hogares ocupados.',
        price: '$28 / hora',
        rating: 4.9,
        location: 'Palermo',
        badge: 'Disponible hoy',
    },
    {
        id: 2,
        title: 'Clases de inglés para adultos',
        category: 'Educación',
        description: 'Sesiones prácticas de conversación con enfoque personalizado.',
        price: '$22 / clase',
        rating: 4.8,
        location: 'Belgrano',
        badge: 'Nuevo',
    },
    {
        id: 3,
        title: 'Reparación de electrodomésticos',
        category: 'Tecnología',
        description: 'Diagnóstico rápido y reparación con repuestos compatibles.',
        price: '$35 / visita',
        rating: 4.7,
        location: 'Caballito',
        badge: 'Top rating',
    },
    {
        id: 4,
        title: 'Instalación de iluminación inteligente',
        category: 'Tecnología',
        description: 'Conexión y configuración de luces inteligentes en viviendas y comercios.',
        price: '$40 / servicio',
        rating: 5,
        location: 'San Telmo',
        badge: 'Sello premium',
    },
];

const categories = ['Todos', 'Hogar', 'Educación', 'Tecnología'];

export default function Marketplace() {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const matchesCategory = selectedCategory === 'Todos' || service.category === selectedCategory;
            const matchesQuery =
                service.title.toLowerCase().includes(query.toLowerCase()) ||
                service.description.toLowerCase().includes(query.toLowerCase()) ||
                service.location.toLowerCase().includes(query.toLowerCase());

            return matchesCategory && matchesQuery;
        });
    }, [query, selectedCategory]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marketplace" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Marketplace local</p>
                            <h1 className="text-3xl font-semibold sm:text-4xl">Encuentra, compara y reserva servicios cerca tuyo con un diseño más claro y moderno.</h1>
                            <p className="text-sm leading-6 text-slate-100/90">
                                Filtra por categoría, revisa detalle y prepara tu próxima reserva sin salir de esta pantalla.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-emerald-300 text-slate-950 hover:bg-emerald-200">
                                <Link href={route('dashboard')}>
                                    Volver al dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-full border-white/70 text-white hover:bg-white/10">
                                <Link href={route('reviews.demo')}>Ver reseñas</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-slate-950">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Buscar por servicio, ciudad o palabra clave"
                                    className="w-full border-0 bg-transparent text-sm outline-none"
                                />
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        type="button"
                                        variant={selectedCategory === category ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className={
                                            selectedCategory === category
                                                ? '!rounded-full !bg-cyan-400 !text-slate-950 hover:!bg-cyan-300'
                                                : '!rounded-full border-slate-200 dark:border-white/10'
                                        }
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredServices.map((service) => (
                            <div key={service.id} className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_60px_rgba(16,185,129,0.16)] dark:border-white/10 dark:bg-slate-900">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{service.category}</p>
                                        <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{service.title}</h2>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                                        {service.badge}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>

                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                                    <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {service.rating}</span>
                                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {service.location}</span>
                                    <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {service.price}</span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        asChild
                                        className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                                    >
                                        <Link href={route('bookings.create', { service_id: service.id })}>
                                            Reservar ahora
                                        </Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        asChild
                                        variant="outline"
                                        className="rounded-full border-slate-200 dark:border-white/10"
                                    >
                                        <Link href={route('services.show', service.id)}>
                                            Ver detalles
                                        </Link>
                                    </Button>
                                    <Button type="button" variant="ghost" asChild className="rounded-full">
                                        <Link href={route('reviews.demo')}>Ver reseñas</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredServices.length === 0 && (
                        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-6 text-center dark:border-white/10 dark:bg-slate-900">
                            <p className="text-sm text-slate-600 dark:text-slate-300">No encontramos servicios para ese filtro. Probá otra categoría o palabra clave.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
