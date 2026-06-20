import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Calendar, MapPin, User, ChevronRight } from 'lucide-react';

interface Booking {
    id: number;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    service: {
        id: number;
        title: string;
        price: number;
        user: {
            id: number;
            name: string;
        };
    };
}

interface Props {
    bookings: Booking[];
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

export default function BookingsIndex({ bookings }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Reservas" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Mis Reservas</h1>
                    <Link href="/bookings/create">
                        <Button>Nueva Reserva</Button>
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500">No tienes reservas aún</p>
                        <Link href="/bookings/create">
                            <Button className="mt-4">Crear primera reserva</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map((booking) => (
                            <Link
                                key={booking.id}
                                href={`/bookings/${booking.id}`}
                                className="block"
                            >
                                <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <h3 className="text-lg font-semibold">
                                                    {booking.service.title}
                                                </h3>
                                                <Badge
                                                    className={`${statusColors[booking.status]}`}
                                                >
                                                    {statusLabels[booking.status]}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} />
                                                    <span>{booking.service.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    <span>{new Date(booking.date).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">
                                                        ${booking.service.price.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronRight className="text-gray-400" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
