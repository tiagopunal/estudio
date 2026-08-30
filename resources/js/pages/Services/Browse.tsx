import InputError from '@/components/input-error';
import { ServiceMap, type MapService } from '@/components/maps/service-map';
import { ProLinkFooter } from '@/components/prolink-footer';
import { ProLinkHeader } from '@/components/prolink-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { explainGeolocationError, type GeolocationFailure } from '@/lib/geolocation';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    BriefcaseBusiness,
    List,
    LocateFixed,
    Map,
    MapPin,
    Search,
    SlidersHorizontal,
    Star,
    UserRound,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    average_rating: number;
    location?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
    distance_km?: number | null;
    reviews: unknown[];
    user: { id: number; name: string };
}
interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}
interface Props {
    services: { data: Service[]; links: PaginationLink[]; total: number };
    mapServices: MapService[];
    filters: {
        search?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
        sort?: 'price_asc' | 'price_desc';
        latitude?: string;
        longitude?: string;
        radius?: string;
    };
    categories: string[];
}

export default function ServicesBrowse({ services, mapServices, filters, categories }: Props) {
    const [view, setView] = useState<'list' | 'map'>(filters.latitude ? 'map' : 'list');
    const [locationStatus, setLocationStatus] = useState('');
    const [locationError, setLocationError] = useState<GeolocationFailure | null>(null);
    const [locating, setLocating] = useState(false);
    const { data, setData, get, processing, errors } = useForm({
        search: filters.search || '',
        category: filters.category || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        sort: filters.sort || '',
        latitude: filters.latitude || '',
        longitude: filters.longitude || '',
        radius: filters.radius || '50',
    });
    const endpoint = window.location.pathname === '/marketplace' ? '/marketplace' : '/services/browse';
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(endpoint, { preserveScroll: true });
    };
    const locate = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Tu dispositivo no admite geolocalización.');
            return;
        }
        setLocating(true);
        setLocationError(null);
        setLocationStatus('Buscando tu ubicación…');
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const latitude = coords.latitude.toFixed(7);
                const longitude = coords.longitude.toFixed(7);
                setData((current) => ({ ...current, latitude, longitude }));
                setView('map');
                setLocationStatus('Ubicación encontrada.');
                setLocating(false);
                router.get(endpoint, { ...data, latitude, longitude, radius: data.radius || '50' }, { preserveScroll: true, preserveState: true });
            },
            (error) => {
                setLocationStatus('');
                setLocationError(explainGeolocationError(error));
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
        );
    };
    const clearLocation = () => {
        setData((current) => ({ ...current, latitude: '', longitude: '' }));
        setLocationStatus('');
        setLocationError(null);
        router.get(endpoint, { ...data, latitude: '', longitude: '', radius: '' }, { preserveScroll: true, preserveState: true });
    };
    const applyRadius = () => {
        router.get(endpoint, data, { preserveScroll: true, preserveState: true });
    };
    const hasLocationFilter = Boolean(data.latitude && data.longitude);
    const radiusChanged = hasLocationFilter && data.radius !== (filters.radius || '50');
    return (
        <div className="flex min-h-screen flex-col bg-[#f8f7fc]">
            <Head title="Explorar servicios" />
            <ProLinkHeader />
            <main className="prolink-page flex-1">
                <div>
                    <p className="prolink-kicker">Marketplace local</p>
                    <h1 className="prolink-title mt-2">Explorá servicios</h1>
                    <p className="prolink-subtitle">Encontrá profesionales, compará opciones y elegí con confianza.</p>
                </div>
                <form onSubmit={submit} className="prolink-panel mt-8 grid gap-4 p-5 lg:grid-cols-[1.6fr_1fr_1.2fr_auto] lg:items-end">
                    <div>
                        <Label htmlFor="search">Servicio</Label>
                        <div className="relative mt-2">
                            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
                            <Input
                                id="search"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="prolink-field pl-12"
                                placeholder="¿Qué servicio buscás?"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="category">Categoría</Label>
                        <select
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="prolink-field mt-2"
                        >
                            <option value="">Todas</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="price">Precio</Label>
                        <details className="relative mt-2">
                            <summary id="price" className="prolink-field flex cursor-pointer list-none items-center justify-between">
                                <span>
                                    {data.min_price || data.max_price
                                        ? `${data.min_price || 'Sin mínimo'} - ${data.max_price || 'Sin máximo'}`
                                        : 'Cualquier precio'}
                                </span>
                                <SlidersHorizontal className="size-4" />
                            </summary>
                            <div className="absolute right-0 z-10 mt-2 grid w-72 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-slate-900">
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Desde
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.min_price}
                                            onChange={(e) => setData('min_price', e.target.value)}
                                            className="prolink-field mt-1"
                                        />
                                    </label>
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Hasta
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.max_price}
                                            onChange={(e) => setData('max_price', e.target.value)}
                                            className="prolink-field mt-1"
                                        />
                                    </label>
                                </div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Ordenar por precio
                                    <select
                                        value={data.sort}
                                        onChange={(e) => setData('sort', e.target.value as '' | 'price_asc' | 'price_desc')}
                                        className="prolink-field mt-1 w-full"
                                    >
                                        <option value="">Predeterminado</option>
                                        <option value="price_asc">Menor a mayor</option>
                                        <option value="price_desc">Mayor a menor</option>
                                    </select>
                                </label>
                                <InputError message={errors.min_price || errors.max_price} />
                            </div>
                        </details>
                    </div>
                    <Button disabled={processing} className="prolink-primary">
                        <SlidersHorizontal />
                        {processing ? 'Buscando' : 'Filtrar'}
                    </Button>
                </form>
                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" onClick={locate} disabled={locating} variant="outline" className="border-blue-300 text-blue-800">
                            <LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} /> {locating ? 'Buscando...' : 'Usar mi ubicación'}
                        </Button>
                        {data.latitude && data.longitude && (
                            <Button type="button" onClick={clearLocation} variant="ghost" className="text-slate-700">
                                <X className="size-4" /> Quitar ubicación
                            </Button>
                        )}
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            Radio
                            <select
                                value={data.radius}
                                onChange={(e) => setData('radius', e.target.value)}
                                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-slate-900"
                            >
                                {[10, 25, 50, 100, 250, 500].map((radius) => (
                                    <option key={radius} value={radius}>
                                        {radius} km
                                    </option>
                                ))}
                            </select>
                        </label>
                        {radiusChanged && (
                            <Button type="button" onClick={applyRadius} className="bg-blue-700 text-white hover:bg-blue-800">
                                Aplicar distancia
                            </Button>
                        )}
                        {locationStatus && <span className="text-sm text-slate-600">{locationStatus}</span>}
                    </div>
                    <div className="flex rounded-xl bg-blue-50 p-1">
                        <button
                            type="button"
                            onClick={() => setView('list')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${view === 'list' ? 'bg-blue-700 text-white' : 'text-blue-800'}`}
                        >
                            <List className="size-4" /> Lista
                        </button>
                        <button
                            type="button"
                            onClick={() => setView('map')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${view === 'map' ? 'bg-blue-700 text-white' : 'text-blue-800'}`}
                        >
                            <Map className="size-4" /> Mapa
                        </button>
                    </div>
                </div>
                {locationError && (
                    <div role="alert" className="mt-3 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
                        <AlertCircle className="mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="font-bold">{locationError.title}</p>
                            <p className="mt-1 text-sm">{locationError.message}</p>
                        </div>
                    </div>
                )}
                {hasLocationFilter && !locationError && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-800">
                        <LocateFixed className="size-4" /> Mostrando servicios a menos de {filters.radius || data.radius} km de tu ubicación
                        aproximada.
                    </div>
                )}
                <div className="mt-8 flex items-center justify-between">
                    <p className="text-slate-600">
                        <strong className="text-slate-950">{services.total}</strong> resultados disponibles
                    </p>
                    {Object.values(filters).some(Boolean) && (
                        <Link href={window.location.pathname} className="text-primary text-sm font-semibold">
                            Limpiar filtros
                        </Link>
                    )}
                </div>
                {view === 'map' ? (
                    <div className="mt-6">
                        {mapServices.length ? (
                            <ServiceMap
                                services={mapServices}
                                userLocation={
                                    data.latitude && data.longitude ? { latitude: Number(data.latitude), longitude: Number(data.longitude) } : null
                                }
                                radiusKm={data.latitude && data.longitude ? Number(data.radius) : undefined}
                            />
                        ) : (
                            <div className="prolink-panel p-12 text-center">
                                <Map className="mx-auto size-10 text-blue-300" />
                                <h2 className="mt-4 text-xl font-bold">No hay servicios con ubicación válida</h2>
                                <p className="mt-2 text-slate-600">Probá cambiando los filtros o la distancia de búsqueda.</p>
                            </div>
                        )}
                    </div>
                ) : services.data.length === 0 ? (
                    <div className="prolink-panel mt-6 p-12 text-center">
                        <Search className="mx-auto size-10 text-blue-300" />
                        <h2 className="mt-4 text-xl font-bold">No encontramos servicios</h2>
                        <p className="mt-2 text-slate-600">Probá con otros términos o eliminá algunos filtros.</p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {services.data.map((service, i) => (
                            <Link
                                href={`/services/${service.id}`}
                                key={service.id}
                                className="prolink-panel group overflow-hidden transition hover:-translate-y-1 hover:border-blue-300"
                            >
                                <div
                                    className={`flex h-48 items-center justify-center bg-gradient-to-br ${i % 3 === 0 ? 'from-blue-100 to-indigo-200' : i % 3 === 1 ? 'from-slate-100 to-blue-100' : 'from-indigo-100 to-violet-200'}`}
                                >
                                    <BriefcaseBusiness className="text-primary/35 size-14" />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="prolink-kicker">{service.category}</p>
                                            <h2 className="mt-2 text-xl font-bold">{service.title}</h2>
                                        </div>
                                        <span className="text-primary text-xl font-bold">{formatArs(service.price)}</span>
                                    </div>
                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{service.description}</p>
                                    {(service.location || service.distance_km != null) && (
                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                                            {service.location && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="size-4 text-blue-700" /> {service.location}
                                                </span>
                                            )}
                                            {service.distance_km != null && (
                                                <strong className="text-blue-800">A {service.distance_km} km de vos</strong>
                                            )}
                                        </div>
                                    )}
                                    <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
                                        <span className="flex items-center gap-2 text-sm">
                                            <UserRound className="size-4" />
                                            {service.user.name}
                                        </span>
                                        <span className="flex items-center text-sm font-semibold">
                                            <Star className="mr-1 size-4 fill-amber-400 text-amber-400" />
                                            {Number(service.average_rating || 0).toFixed(1)}{' '}
                                            <span className="ml-1 text-slate-400">({service.reviews.length})</span>
                                        </span>
                                    </div>
                                    <span className="text-primary mt-4 flex items-center text-sm font-semibold">
                                        Ver servicio <ArrowRight className="ml-2 size-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {services.links.length > 3 && (
                    <nav className="mt-10 flex flex-wrap justify-center gap-2" aria-label="Paginación">
                        {services.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`rounded-lg border px-4 py-2 text-sm ${link.active ? 'border-primary bg-primary text-white' : 'border-border bg-white text-slate-700'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : null,
                        )}
                    </nav>
                )}
            </main>
            <ProLinkFooter />
        </div>
    );
}

function formatArs(value: number | string) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value));
}
