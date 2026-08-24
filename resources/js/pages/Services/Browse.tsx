import { ProLinkFooter } from '@/components/prolink-footer';
import { ProLinkHeader } from '@/components/prolink-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, BriefcaseBusiness, Search, SlidersHorizontal, Star, UserRound } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    average_rating: number;
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
    filters: { search?: string; category?: string; min_price?: string; max_price?: string; sort?: 'price_asc' | 'price_desc' };
    categories: string[];
}

export default function ServicesBrowse({ services, filters, categories }: Props) {
    const { data, setData, get, processing, errors } = useForm({
        search: filters.search || '',
        category: filters.category || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        sort: filters.sort || '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(window.location.pathname === '/marketplace' ? '/marketplace' : '/services/browse', { preserveScroll: true });
    };
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
                                <span>{data.min_price || data.max_price ? `${data.min_price || 'Sin mínimo'} - ${data.max_price || 'Sin máximo'}` : 'Cualquier precio'}</span>
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
                {services.data.length === 0 ? (
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
                                        <span className="text-primary text-xl font-bold">${Number(service.price).toFixed(0)}</span>
                                    </div>
                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{service.description}</p>
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
