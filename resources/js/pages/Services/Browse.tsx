import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Star, ChevronRight } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    average_rating: number;
    reviews: any[];
    user: {
        id: number;
        name: string;
    };
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface Pagination {
    data: Service[];
    links: PaginationLink[];
    current_page: number;
    total: number;
}

interface Props {
    services: Pagination;
    filters: {
        search?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
    };
}

export default function ServicesBrowse({ services, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        category: filters.category || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inicio', href: '/' },
        { title: 'Buscar Servicios', href: '/services/browse' },
    ];

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        get('/services/browse', { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buscar Servicios" />

            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Buscar Servicios</h1>

                {/* Filtros */}
                <Card className="p-6">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="search">Buscar</Label>
                                <Input
                                    id="search"
                                    type="text"
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    placeholder="Buscar por nombre..."
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Categoría</Label>
                                <Input
                                    id="category"
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    placeholder="Filtrar por categoría..."
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="min_price">Precio Mínimo</Label>
                                <Input
                                    id="min_price"
                                    type="number"
                                    step="0.01"
                                    value={data.min_price}
                                    onChange={(e) => setData('min_price', e.target.value)}
                                    placeholder="0.00"
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="max_price">Precio Máximo</Label>
                                <Input
                                    id="max_price"
                                    type="number"
                                    step="0.01"
                                    value={data.max_price}
                                    onChange={(e) => setData('max_price', e.target.value)}
                                    placeholder="99999.99"
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Buscando...' : 'Buscar'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setData({
                                        search: '',
                                        category: '',
                                        min_price: '',
                                        max_price: '',
                                    });
                                    get('/services/browse');
                                }}
                            >
                                Limpiar Filtros
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Servicios */}
                {services.data.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500">No se encontraron servicios</p>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4">
                            {services.data.map((service) => (
                                <Link key={service.id} href={`/services/${service.id}`}>
                                    <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
                                        <div className="p-6 flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold mb-2">
                                                    {service.title}
                                                </h3>
                                                <p className="text-gray-600 mb-3 line-clamp-2">
                                                    {service.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            {service.user.name}
                                                        </p>
                                                        <p className="text-2xl font-bold text-green-600">
                                                            ${service.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    {service.average_rating > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={16}
                                                                    className={
                                                                        i <
                                                                        Math.round(
                                                                            service.average_rating
                                                                        )
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }
                                                                />
                                                            ))}
                                                            <span className="text-xs text-gray-600">
                                                                ({service.reviews.length})
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className="ml-4 text-gray-400" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Paginación */}
                        {services.links.length > 3 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {services.links.map((link, index) => {
                                    // Skip "Previous" and "Next" text links that are at start/end
                                    if (
                                        (!link.url &&
                                            (link.label.includes('Previous') ||
                                                link.label.includes('Next'))) ||
                                        link.label.includes('...')
                                    ) {
                                        return null;
                                    }

                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 rounded ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
