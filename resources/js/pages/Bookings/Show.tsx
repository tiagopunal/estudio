import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import {
    ArrowRight,
    CalendarDays,
    ChevronRight,
    Clock3,
    Loader,
    MapPin,
    Sparkles,
    UserRound,
} from 'lucide-react';

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
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-100',
    confirmed: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-100',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-100',
    cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-100',
};

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

function formatBookingDate(value: string) {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return 'Fecha por confirmar';
    }

    return parsed.toLocaleString();
}

export default function BookingsShow({ booking }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
        { title: `Reserva #${booking.id}`, href: `/bookings/${booking.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reserva #${booking.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Reserva #{booking.id}</p>
                            <h1 className="text-3xl font-semibold sm:text-4xl">Revisa los detalles de tu reserva en un solo lugar.</h1>
                            <p className="text-sm leading-6 text-slate-100/90">
                                Consulta el servicio, la fecha y el estado actual sin salir de la experiencia del marketplace.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-emerald-300 text-slate-950 hover:bg-emerald-200">
                                <Link href={route('bookings.index')}>
                                    Volver a mis reservas
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-white/70 text-white hover:bg-white/10"
                            >
                                <Link href={route('marketplace')}>Volver al marketplace</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-1">
                    <div className="space-y-4">
                        <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Servicio</p>
                                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                                        {booking.service.title}
                                    </h2>
                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                        {booking.service.description}
                                    </p>
                                </div>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[booking.status]}`}>
                                    {statusLabels[booking.status]}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                                <p className="inline-flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    {booking.service.category}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <Clock3 className="h-4 w-4" />
                                    ${booking.service.price.toFixed(2)}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <UserRound className="h-4 w-4" />
                                    {booking.service.user.name}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Servicio #{booking.service.id}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-cyan-500" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Detalle de la reserva</h2>
                            </div>
                            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <p className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    {formatBookingDate(booking.date)}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <Clock3 className="h-4 w-4" />
                                    Creada: {formatBookingDate(booking.created_at)}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <UserRound className="h-4 w-4" />
                                    Cliente: {booking.user.name}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Email del cliente: {booking.user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
