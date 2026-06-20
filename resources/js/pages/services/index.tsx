import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, SlidersHorizontal, Star } from 'lucide-react';
import { FormEventHandler } from 'react';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedServices = {
    data: Service[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};

type Filters = {
    search: string;
    category: string;
    min_price: string;
    max_price: string;
    sort: string;
};

type Props = {
    services: PaginatedServices;
    filters: Filters;
    categories: string[];
    canCreate: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Servicios', href: '/services' }];

const cleanLabel = (label: string) => label.replace('&laquo;', 'Anterior').replace('&raquo;', 'Siguiente');

export default function ServicesIndex({ services, filters, categories, canCreate }: Props) {
    const { data, setData, get, processing } = useForm<Filters>(filters);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        get('/services', { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => router.get('/services');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <main className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Servicios</h1>
                        <p className="text-muted-foreground text-sm">Busca profesionales por servicio, categoria, precio o reputacion.</p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href="/services/create">
                                <Plus />
                                Nuevo servicio
                            </Link>
                        </Button>
                    )}
                </div>

                <form onSubmit={submit} className="border-sidebar-border/70 dark:border-sidebar-border grid gap-4 rounded-lg border p-4 md:grid-cols-6">
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="search">Buscar</Label>
                        <Input id="search" value={data.search} onChange={(event) => setData('search', event.target.value)} placeholder="Titulo, descripcion o profesional" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <select
                            id="category"
                            value={data.category}
                            onChange={(event) => setData('category', event.target.value)}
                            className="border-input bg-background h-10 rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="">Todas</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="min_price">Minimo</Label>
                        <Input id="min_price" type="number" min="0" step="0.01" value={data.min_price} onChange={(event) => setData('min_price', event.target.value)} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="max_price">Maximo</Label>
                        <Input id="max_price" type="number" min="0" step="0.01" value={data.max_price} onChange={(event) => setData('max_price', event.target.value)} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sort">Orden</Label>
                        <select id="sort" value={data.sort} onChange={(event) => setData('sort', event.target.value)} className="border-input bg-background h-10 rounded-md border px-3 py-2 text-sm">
                            <option value="latest">Recientes</option>
                            <option value="price_asc">Menor precio</option>
                            <option value="price_desc">Mayor precio</option>
                            <option value="rating_desc">Mejor rating</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap items-end gap-2 md:col-span-6">
                        <Button type="submit" disabled={processing}>
                            <Search />
                            Buscar
                        </Button>
                        <Button type="button" variant="outline" onClick={clearFilters}>
                            <SlidersHorizontal />
                            Limpiar
                        </Button>
                    </div>
                </form>

                <div className="grid gap-4">
                    {services.data.length === 0 && <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-6 text-sm text-muted-foreground">No se encontraron servicios.</div>}

                    {services.data.map((service) => (
                        <article key={service.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link href={`/services/${service.id}`} className="text-lg font-semibold hover:underline">
                                            {service.title}
                                        </Link>
                                        <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs">{service.category}</span>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-sm">{service.description}</p>
                                    <p className="text-sm">Profesional: {service.professional.name}</p>
                                </div>
                                <div className="flex shrink-0 flex-col gap-2 text-left md:text-right">
                                    <span className="text-xl font-semibold">${service.price.toFixed(2)}</span>
                                    <span className="text-muted-foreground inline-flex items-center gap-1 text-sm md:justify-end">
                                        <Star className="size-4" />
                                        {service.average_rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {services.links.length > 3 && (
                    <nav className="flex flex-wrap gap-2">
                        {services.links.map((link, index) => (
                            <Button key={`${link.label}-${index}`} asChild={Boolean(link.url)} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url}>
                                {link.url ? <Link href={link.url}>{cleanLabel(link.label)}</Link> : <span>{cleanLabel(link.label)}</span>}
                            </Button>
                        ))}
                    </nav>
                )}
            </main>
        </AppLayout>
    );
}
