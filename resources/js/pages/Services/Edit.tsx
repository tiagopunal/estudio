import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { AlertCircle } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}

interface Props {
    service: Service;
}

export default function ServicesEdit({ service }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: service.title,
        description: service.description,
        price: service.price.toString(),
        category: service.category,
        location: service.location || '',
        latitude: service.latitude?.toString() || '',
        longitude: service.longitude?.toString() || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Servicios', href: '/services' },
        { title: 'Editar Servicio', href: `/services/${service.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/services/${service.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Servicio" />

            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Editar Servicio</h1>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Título */}
                        <div>
                            <Label htmlFor="title">Título del Servicio</Label>
                            <Input
                                id="title"
                                type="text"
                                required
                                minLength={5}
                                maxLength={120}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-2"
                            />
                            {errors.title && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    {errors.title}
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <Label htmlFor="description">Descripción</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={5}
                                required
                                minLength={20}
                                maxLength={2000}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.description && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        {/* Precio */}
                        <div>
                            <Label htmlFor="price">Precio (USD)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                required
                                min="0.01"
                                max="99999999.99"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="mt-2"
                            />
                            {errors.price && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    {errors.price}
                                </div>
                            )}
                        </div>

                        {/* Categoría */}
                        <div>
                            <Label htmlFor="category">Categoría</Label>
                            <Input
                                id="category"
                                type="text"
                                required
                                minLength={3}
                                maxLength={50}
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-2"
                            />
                            {errors.category && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    {errors.category}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="location">Ubicación o zona del servicio</Label>
                            <Input id="location" maxLength={255} value={data.location} onChange={(e) => setData('location', e.target.value)} className="mt-2" />
                            {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
                        </div>

                        {/* Ubicación */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="latitude">Latitud (Opcional)</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="0.0001"
                                    min="-90"
                                    max="90"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    className="mt-2"
                                />
                                {errors.latitude && <p className="mt-2 text-sm text-red-600">{errors.latitude}</p>}
                            </div>
                            <div>
                                <Label htmlFor="longitude">Longitud (Opcional)</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="0.0001"
                                    min="-180"
                                    max="180"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    className="mt-2"
                                />
                                {errors.longitude && <p className="mt-2 text-sm text-red-600">{errors.longitude}</p>}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={processing} className="flex-1">
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                            <a href={`/services/${service.id}`}>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </a>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
