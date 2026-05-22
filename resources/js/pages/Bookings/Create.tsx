import { Head, useForm, usePage } from '@inertiajs/react';
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
    user: {
        id: number;
        name: string;
    };
}

interface Props {
    services: Service[];
}

export default function BookingsCreate({ services }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: '',
        date: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
        { title: 'Nueva Reserva', href: '/bookings/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bookings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Reserva" />

            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Nueva Reserva</h1>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Seleccionar Servicio */}
                        <div>
                            <Label htmlFor="service_id">Servicio</Label>
                            <select
                                id="service_id"
                                value={data.service_id}
                                onChange={(e) => setData('service_id', e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona un servicio...</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.title} - ${service.price} ({service.user.name})
                                    </option>
                                ))}
                            </select>
                            {errors.service_id && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    {errors.service_id}
                                </div>
                            )}
                        </div>

                        {/* Seleccionar Fecha y Hora */}
                        <div>
                            <Label htmlFor="date">Fecha y Hora</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="mt-2"
                            />
                            {errors.date && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    {errors.date}
                                </div>
                            )}
                        </div>

                        {/* Servicios disponibles */}
                        {services.length > 0 && data.service_id && (
                            <Card className="p-4 bg-gray-50">
                                {services
                                    .filter(
                                        (s) => s.id === parseInt(data.service_id as string)
                                    )
                                    .map((service) => (
                                        <div key={service.id}>
                                            <h3 className="font-semibold mb-2">{service.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {service.description}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-semibold">Profesional:</span>{' '}
                                                {service.user.name}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-semibold">Precio:</span> $
                                                {service.price.toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                            </Card>
                        )}

                        {/* Botones de acción */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing ? 'Guardando...' : 'Crear Reserva'}
                            </Button>
                            <a href="/bookings">
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
