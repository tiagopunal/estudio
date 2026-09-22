import { ServiceMap } from '@/components/maps/service-map';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Loader, MapPin, UserRound } from 'lucide-react';
import { useState } from 'react';

interface Booking {
    id: number;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
    service: {
        id: number;
        title: string;
        description: string;
        price: number | string;
        category: string;
        location?: string | null;
        latitude?: number | string | null;
        longitude?: number | string | null;
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
    review?: { id: number } | null;
    payment?: {
        amount: number | string;
        initial_amount?: number | string;
        held_amount?: number | string;
        service_price: number | string;
        currency: string;
        status: 'pending' | 'held' | 'released' | 'refunded';
    } | null;
}

interface Props {
    booking: Booking;
    canManageStatus: boolean;
    isReceivedBooking: boolean;
    canReview: boolean;
    canCancelPending: boolean;
    canCustomerCancelConfirmed: boolean;
    canApprovePayment: boolean;
    canReleasePayment: boolean;
    wallet: {
        available_balance: number | string;
        held_balance: number | string;
        paid_amount: number | string;
        service_price: number | string;
        remaining_balance: number | string;
        paid_percentage: number;
        held_amount: number | string;
        released_amount: number | string;
        final_charge_at?: string | null;
    };
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

const statusSubtitles = {
    pending: 'Tu solicitud está esperando confirmación del profesional',
    confirmed: 'Tu reserva fue confirmada',
    completed: 'El servicio fue completado',
    cancelled: 'Esta reserva fue cancelada',
};

function formatBookingDate(value: string) {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return 'Fecha por confirmar';
    }

    return parsed.toLocaleString();
}

export default function BookingsShow({ booking, canManageStatus, isReceivedBooking, canReview, canCancelPending, canCustomerCancelConfirmed, canApprovePayment, canReleasePayment, wallet }: Props) {
    const [processing, setProcessing] = useState(false);
    const errors = usePage().props.errors as { status?: string; payment?: string };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
        { title: `Reserva #${booking.id}`, href: `/bookings/${booking.id}` },
    ];

    const handleStatusChange = (newStatus: Booking['status']) => {
        if (newStatus !== booking.status) {
            setProcessing(true);
            router.patch(
                route('bookings.updateStatus', booking.id),
                { status: newStatus },
                {
                preserveScroll: true,
                    onFinish: () => setProcessing(false),
                },
            );
        }
    };

    const canChangeStatus = booking.status === 'pending' || booking.status === 'confirmed';
    const hasServiceLocation = booking.service.latitude != null && booking.service.longitude != null;

    const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reserva #${booking.id}`} />

            <main className="min-h-full bg-[#f8f7fc]">
                <div className="prolink-page">
                    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="prolink-kicker">Detalle de reserva</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <h1 className="prolink-title">Reserva #{booking.id}</h1>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusColors[booking.status]}`}>
                                    {statusLabels[booking.status]}
                                </span>
                            </div>
                            <p className="prolink-subtitle">
                                {isReceivedBooking && booking.status === 'pending'
                                    ? `${booking.user.name} está esperando que aceptes o rechaces esta solicitud.`
                                    : booking.status === 'completed' && !isReceivedBooking
                                      ? 'El profesional marcó el trabajo como finalizado. Ya podés dejar tu reseña.'
                                      : statusSubtitles[booking.status]}
                            </p>
                        </div>
                        <Link href={route('bookings.index')} className="prolink-secondary self-start sm:self-auto">
                            <ArrowLeft className="size-4" />
                            Volver a mis reservas
                        </Link>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
                        <div className="space-y-6">
                            <section className="prolink-panel p-6 sm:p-8">
                                <div className="flex flex-wrap items-start justify-between gap-5">
                                    <div>
                                        <p className="prolink-kicker">{booking.service.category}</p>
                                        <h2 className="mt-2 text-3xl font-bold text-slate-950">{booking.service.title}</h2>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">{currency.format(Number(booking.service.price))}</p>
                                </div>
                                <p className="mt-5 leading-7 whitespace-pre-line text-slate-700">{booking.service.description}</p>
                                <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 text-sm text-slate-700 sm:grid-cols-2">
                                    <p className="flex items-center gap-2 font-bold">
                                        <UserRound className="size-5 text-blue-700" />
                                        {booking.service.user.name}
                                    </p>
                                    {booking.service.location && (
                                        <p className="flex items-center gap-2">
                                            <MapPin className="size-5 text-blue-700" />
                                            {booking.service.location}
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section className="prolink-panel p-6 sm:p-8">
                                <p className="prolink-kicker">Agenda</p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-950">Fecha y hora de la reserva</h2>
                                <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-blue-900">
                                    <CalendarDays className="mt-0.5 size-6 shrink-0 text-blue-700" />
                                    <div>
                                        <p className="font-bold">{formatBookingDate(booking.date)}</p>
                                        <p className="mt-1 text-sm text-blue-800">Creada el {formatBookingDate(booking.created_at)}</p>
                                    </div>
                                </div>
                            </section>

                            {canManageStatus && (
                                <section className="prolink-panel p-6 sm:p-8">
                                    <p className="prolink-kicker">Contacto</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Información del cliente</h2>
                                    <div className="mt-5 space-y-3 text-sm text-slate-700">
                                        <p className="flex items-center gap-2 font-bold">
                                            <UserRound className="size-5 text-blue-700" />
                                            {booking.user.name}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPin className="size-5 text-blue-700" />
                                            {booking.user.email}
                                        </p>
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <div className="prolink-panel p-6">
                                <p className="text-sm font-bold text-slate-500 uppercase">Acciones de la reserva</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Gestioná el siguiente paso según el estado actual.</p>

                                {booking.payment && (
                                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                                        <p className="font-bold">Pago simulado · {currency.format(Number(wallet.service_price))}</p>
                                        <p className="mt-1 leading-6">Estado: {booking.payment.status === 'pending' ? 'Pendiente de aprobación' : booking.payment.status === 'held' ? 'Retenido en custodia' : booking.payment.status === 'released' ? 'Liberado' : 'Reembolsado'}</p>
                                        <p className="mt-2 leading-6">Seña abonada: {currency.format(Number(wallet.paid_amount))}</p>
                                        <p className="leading-6">Saldo restante: {currency.format(Number(wallet.remaining_balance))}</p>
                                        <p className="leading-6">Total en custodia: {currency.format(Number(wallet.held_amount))}</p>
                                        {wallet.remaining_balance === '0.00' || Number(wallet.remaining_balance) === 0 ? <p className="mt-1 font-bold">Servicio abonado en su totalidad.</p> : <p className="mt-1">El saldo pendiente queda fuera de esta simulación.</p>}
                                        {booking.status === 'completed' && booking.payment.status === 'held' && <p className="mt-2 font-bold">Pago completado. Esperando confirmación del cliente para liberar el pago.</p>}
                                        {booking.payment.status === 'released' && <p className="mt-2 font-bold">Pago liberado al profesional: {currency.format(Number(wallet.released_amount))}</p>}
                                        <p className="mt-2 leading-6">No se procesa dinero real.</p>
                                        {errors.payment && <p className="mt-3 font-bold text-red-700">{errors.payment}</p>}
                                        {canApprovePayment && (
                                            <Button onClick={() => router.post(route('bookings.payment.approve', booking.id), {}, { preserveScroll: true })} className="prolink-primary mt-4 w-full">
                                                Aprobar pago simulado
                                            </Button>
                                        )}
                                        {canApprovePayment && Number(wallet.available_balance) < Number(booking.payment.amount) && <Link href={route('wallet.show')} className="mt-3 block text-center text-sm font-bold text-blue-700 hover:underline">Cargar saldo en mi billetera</Link>}
                                        {canReleasePayment && (
                                            <Button onClick={() => router.post(route('bookings.payment.release', booking.id), {}, { preserveScroll: true })} className="prolink-primary mt-4 w-full">
                                                Confirmar trabajo terminado y liberar pago
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {canChangeStatus && (
                                    <div className="mt-6 space-y-3">
                                        {booking.status === 'pending' && canManageStatus && (
                                            <Button
                                                onClick={() => handleStatusChange('confirmed')}
                                                disabled={processing}
                                                className="prolink-primary w-full"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader className="size-4 animate-spin" />
                                                        Confirmando...
                                                    </>
                                                ) : (
                                                    'Confirmar reserva'
                                                )}
                                            </Button>
                                        )}
                                        {booking.status === 'pending' && canCancelPending && (
                                            <Button
                                                onClick={() => handleStatusChange('cancelled')}
                                                disabled={processing}
                                                variant="outline"
                                                className="prolink-secondary w-full"
                                            >
                                                {processing ? 'Procesando...' : canManageStatus ? 'Rechazar reserva' : 'Cancelar reserva'}
                                            </Button>
                                        )}
                                        {booking.status === 'confirmed' && canManageStatus && (
                                            <Button
                                                onClick={() => handleStatusChange('completed')}
                                                disabled={processing}
                                                className="prolink-primary w-full"
                                            >
                                                {processing ? 'Completando...' : 'Completar reserva'}
                                            </Button>
                                        )}
                                        {booking.status === 'confirmed' && canCustomerCancelConfirmed && (
                                            <Button
                                                onClick={() => handleStatusChange('cancelled')}
                                                disabled={processing}
                                                variant="outline"
                                                className="prolink-secondary w-full"
                                            >
                                                {processing ? 'Cancelando...' : 'Cancelar reserva'}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {errors.status && (
                                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {errors.status}
                                    </div>
                                )}

                                {!canChangeStatus && booking.status !== 'completed' && (
                                    <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                                        Esta reserva no admite nuevas acciones.
                                    </p>
                                )}

                                {booking.status === 'completed' && canReview && (
                                    <Link href={`/bookings/${booking.id}/reviews/create`} className="prolink-primary mt-6 w-full">
                                        Reseñar trabajo finalizado
                                    </Link>
                                )}

                                {booking.status === 'completed' && !canManageStatus && !canReview && booking.review && (
                                    <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-800">
                                        Trabajo finalizado · Reseña enviada
                                    </p>
                                )}

                                {booking.status === 'completed' && canManageStatus && (
                                    <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                                        Marcaste este trabajo como finalizado. El cliente ya puede reseñar el servicio.
                                    </p>
                                )}

                                <Link href={route('bookings.create')} className="prolink-secondary mt-3 w-full">
                                    Nueva reserva
                                </Link>
                            </div>
                        </aside>
                    </div>

                    {hasServiceLocation && (
                        <section className="prolink-panel mt-8 p-6 sm:p-8">
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="prolink-kicker">Ubicación del servicio</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Cómo llegar a tu reserva</h2>
                                    <p className="mt-1 text-slate-600">
                                        {booking.service.location || 'Consultá con el profesional para confirmar la dirección exacta.'}
                                    </p>
                                </div>
                                <Link href={route('services.show', booking.service.id)} className="font-bold text-blue-700 hover:underline">
                                    Ver servicio completo
                                </Link>
                            </div>
                            <ServiceMap
                                className="h-80"
                                services={[
                                    {
                                        id: booking.service.id,
                                        title: booking.service.title,
                                        category: booking.service.category,
                                        price: booking.service.price,
                                        location: booking.service.location,
                                        latitude: booking.service.latitude!,
                                        longitude: booking.service.longitude!,
                                        user: { name: booking.service.user.name },
                                    },
                                ]}
                            />
                        </section>
                    )}
                </div>
            </main>
        </AppLayout>
    );
}
