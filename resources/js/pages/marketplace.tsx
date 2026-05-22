import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock3, MapPin, Search, Star, Sparkles } from 'lucide-react';

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
    const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null);
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);

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

    const handleReserve = (service: (typeof services)[number]) => {
        setSelectedService(service);
        setBookingStatus(`Solicitud preparada para ${service.title}. Continúa con el flujo de reserva desde el dashboard.`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marketplace" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="rounded-2xl border border-sidebar-border/70 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 dark:border-sidebar-border dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Marketplace local</p>
                            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Encuentra, compara y reserva servicios cerca tuyo.</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Filtra por categoría, revisa calificaciones y accede a acciones rápidas para revisar reseñas o preparar tu reserva.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href={route('dashboard')}>
                                    Volver al dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={route('reviews.demo')}>Ver reseñas</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-4 dark:bg-slate-900">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                <label className="flex flex-1 items-center gap-2 rounded-xl border border-input bg-slate-50 px-3 py-2 dark:bg-slate-950">
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
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {filteredServices.map((service) => (
                                <div key={service.id} className="rounded-2xl border border-sidebar-border/70 bg-white p-5 dark:bg-slate-900">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{service.category}</p>
                                            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{service.title}</h2>
                                        </div>
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                                            {service.badge}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                                        <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {service.rating}</span>
                                        <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {service.location}</span>
                                        <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {service.price}</span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button type="button" onClick={() => handleReserve(service)}>
                                            Reservar ahora
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setSelectedService(service)}>
                                            Ver detalles
                                        </Button>
                                        <Button type="button" variant="ghost" asChild>
                                            <Link href={route('reviews.demo')}>Ver reseñas</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredServices.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-sidebar-border/70 bg-white p-6 text-center dark:bg-slate-900">
                                <p className="text-sm text-slate-600 dark:text-slate-300">No encontramos servicios para ese filtro. Prueba con otra categoría o palabra clave.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 dark:bg-slate-900">
                            <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Detalle activo</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                                {selectedService ? selectedService.title : 'Selecciona un servicio'}
                            </h2>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                {selectedService
                                    ? selectedService.description
                                    : 'Haz clic en “Ver detalles” para cargar la información de un servicio y preparar el próximo paso.'}
                            </p>
                            {selectedService && (
                                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p>• Categoría: {selectedService.category}</p>
                                    <p>• Precio: {selectedService.price}</p>
                                    <p>• Ubicación: {selectedService.location}</p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Estado del flujo</h2>
                            </div>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                {bookingStatus || 'Aquí verás el estado de tus acciones cuando reserves o selecciones un servicio.'}
                            </p>
                            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                                <p>Los botones de marketplace ya están conectados a navegación y estados locales interactivos, sin depender de una página externa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
