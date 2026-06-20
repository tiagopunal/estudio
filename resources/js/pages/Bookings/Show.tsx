import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Calendar, User, Loader } from 'lucide-react';

interface Booking {
    id: number;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
    service: {
        id: number;
        title: string;
        description: string;
        price: number;
        category: string;
        user: {
            id: number;
            name: string;
        };
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    booking: Booking;
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

export default function BookingsShow({ booking }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        status: booking.status,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
        { title: `Reserva #${booking.id}`, href: `/bookings/${booking.id}` },
    ];

    const handleStatusChange = (newStatus: string) => {
        if (newStatus !== data.status) {
            setData('status', newStatus);
            patch(`/bookings/${booking.id}/status`, {
                onSuccess: () => {
                    console.log('Estado actualizado');
                },
            });
        }
    };

    const canChangeStatus =
        (booking.status === 'pending' || booking.status === 'confirmed') &&
        booking.status !== 'completed' &&
        booking.status !== 'cancelled';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reserva #${booking.id}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Reserva #{booking.id}</h1>
                    <Badge className={`${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                    </Badge>
                </div>

                {/* Información del Servicio */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Información del Servicio</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="font-semibold">Servicio:</span> {booking.service.title}
                        </div>
                        <div>
                            <span className="font-semibold">Descripción:</span> {booking.service.description}
                        </div>
                        <div>
                            <span className="font-semibold">Categoría:</span> {booking.service.category}
                        </div>
                        <div>
                            <span className="font-semibold">Precio:</span> ${booking.service.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            <span className="font-semibold">{booking.service.user.name}</span>
                        </div>
                    </div>
                </Card>

                {/* Información de la Reserva */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Información de la Reserva</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <div>
                                <span className="font-semibold">Fecha y Hora:</span>{' '}
                                {new Date(booking.date).toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold">Creada:</span>{' '}
                            {new Date(booking.created_at).toLocaleString()}
                        </div>
                        <div>
                            <span className="font-semibold">Cliente:</span> {booking.user.name}
                        </div>
                    </div>
                </Card>

                {/* Cambiar Estado */}
                {canChangeStatus && (
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Cambiar Estado</h2>
                        <div className="space-y-3">
                            {booking.status === 'pending' && (
                                <>
                                    <Button
                                        onClick={() => handleStatusChange('confirmed')}
                                        disabled={processing}
                                        className="w-full"
                                        variant="default"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader size={18} className="animate-spin" />
                                                Confirmando...
                                            </>
                                        ) : (
                                            'Confirmar Reserva'
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={processing}
                                        className="w-full"
                                        variant="destructive"
                                    >
                                        {processing ? 'Cancelando...' : 'Cancelar Reserva'}
                                    </Button>
                                </>
                            )}
                            {booking.status === 'confirmed' && (
                                <>
                                    <Button
                                        onClick={() => handleStatusChange('completed')}
                                        disabled={processing}
                                        className="w-full"
                                        variant="default"
                                    >
                                        {processing ? 'Completando...' : 'Completar Reserva'}
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={processing}
                                        className="w-full"
                                        variant="destructive"
                                    >
                                        {processing ? 'Cancelando...' : 'Cancelar Reserva'}
                                    </Button>
                                </>
                            )}
                        </div>
                        {errors.status && (
                            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                                {errors.status}
                            </div>
                        )}
                    </Card>
                )}

                {/* Acciones */}
                <div className="flex gap-4">
                    <a href="/bookings" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Volver
                        </Button>
                    </a>
                    {booking.status === 'completed' && (
                        <a href={`/bookings/${booking.id}/reviews/create`} className="flex-1">
                            <Button className="w-full">Dejar Reseña</Button>
                        </a>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
