import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    ArrowRight,
    CalendarDays,
    ChevronRight,
    Clock3,
    MapPin,
    Sparkles,
    UserRound,
} from 'lucide-react';

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

export default function BookingsIndex({ bookings }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Reservas" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Tus reservas</p>
                            <h1 className="text-3xl font-semibold sm:text-4xl">Gestioná tus reservas con el mismo tono visual del marketplace.</h1>
                            <p className="text-sm leading-6 text-slate-100/90">
                                Revisá el estado de cada servicio, accedé al detalle y seguí el flujo sin salir de una experiencia consistente.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-emerald-300 text-slate-950 hover:bg-emerald-200">
                                <Link href={route('marketplace')}>
                                    Volver al marketplace
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-white/70 text-white hover:bg-white/10"
                            >
                                <Link href={route('bookings.create')}>Nueva reserva</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-200">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">No tenés reservas aún</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Creá tu primera reserva desde el marketplace o desde el botón de abajo.
                        </p>
                        <div className="mt-5">
                            <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                                <Link href={route('bookings.create')}>Crear primera reserva</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map((booking) => (
                            <Link
                                key={booking.id}
                                href={route('bookings.show', booking.id)}
                                className="block"
                            >
                                <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_60px_rgba(16,185,129,0.16)] dark:border-white/10 dark:bg-slate-900">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {booking.service.title}
                                                </h2>
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[booking.status]}`}
                                                >
                                                    {statusLabels[booking.status]}
                                                </span>
                                            </div>

                                            <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                                                <p className="inline-flex items-center gap-2">
                                                    <UserRound className="h-4 w-4" />
                                                    {booking.service.user.name}
                                                </p>
                                                <p className="inline-flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {formatBookingDate(booking.date)}
                                                </p>
                                                <p className="inline-flex items-center gap-2">
                                                    <Clock3 className="h-4 w-4" />
                                                    ${booking.service.price.toFixed(2)}
                                                </p>
                                                <p className="inline-flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Servicio #{booking.service.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                                            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                                                Ver detalle
                                            </span>
                                            <ChevronRight className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
