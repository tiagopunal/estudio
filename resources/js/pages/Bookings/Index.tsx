import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarCheck2, CalendarDays, Check, Clock3, Plus, UserRound, X } from 'lucide-react';
import { useState } from 'react';
interface Booking {
    id: number;
    user_id: number;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    service: { id: number; title: string; price: number; user: { id: number; name: string } };
    user: { id: number; name: string; email: string };
    review?: { id: number } | null;
}
const labels = { pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada' };
const colors = {
    pending: 'bg-orange-100 text-orange-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-700',
};
const format = (v: string) => {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? 'Fecha por confirmar' : d.toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
};
export default function BookingsIndex({ bookings }: { bookings: Booking[] }) {
    const { auth } = usePage<SharedData>().props;
    const [filter, setFilter] = useState<'all' | Booking['status']>('all');
    const [section, setSection] = useState<'received' | 'made'>(auth.user?.role === 'professional' ? 'received' : 'made');
    const [updating, setUpdating] = useState<number | null>(null);
    const filters: Array<{ key: 'all' | Booking['status']; label: string }> = [
        { key: 'all', label: 'Todas' },
        { key: 'pending', label: 'Pendientes' },
        { key: 'confirmed', label: 'Confirmadas' },
        { key: 'completed', label: 'Completadas' },
        { key: 'cancelled', label: 'Canceladas' },
    ];
    const receivedBookings = bookings.filter(
        (booking) => booking.service.user.id === auth.user?.id && booking.user_id !== auth.user?.id,
    );
    const madeBookings = bookings.filter((booking) => booking.user_id === auth.user?.id);
    const sectionBookings = section === 'received' ? receivedBookings : madeBookings;
    const visibleBookings = filter === 'all' ? sectionBookings : sectionBookings.filter((booking) => booking.status === filter);
    const updateStatus = (booking: Booking, status: 'confirmed' | 'cancelled') => {
        setUpdating(booking.id);
        router.patch(route('bookings.updateStatus', booking.id), { status }, { preserveScroll: true, onFinish: () => setUpdating(null) });
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Mis reservas', href: '/bookings' }]}>
            <Head title="Mis reservas" />
            <div className="prolink-page">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="prolink-kicker">Agenda de servicios</p>
                        <h1 className="prolink-title mt-2">Reservas</h1>
                        <p className="prolink-subtitle">Gestioná solicitudes recibidas y servicios que contrataste.</p>
                    </div>
                    <Link href={route('services.browse')} className="prolink-primary">
                        <Plus />
                        Nueva reserva
                    </Link>
                </div>
                {auth.user?.role === 'professional' && (
                    <div className="mt-8 grid gap-3 rounded-2xl border border-blue-200 bg-white p-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => { setSection('received'); setFilter('all'); }}
                            className={`flex items-center justify-between rounded-xl px-5 py-4 text-left font-bold transition ${section === 'received' ? 'bg-blue-700 text-white shadow-md' : 'text-slate-700 hover:bg-blue-50'}`}
                        >
                            <span className="flex items-center gap-3"><CalendarCheck2 className="size-5" /> Solicitudes recibidas</span>
                            <span className={`rounded-full px-2.5 py-1 text-xs ${section === 'received' ? 'bg-white/20' : 'bg-blue-100 text-blue-800'}`}>{receivedBookings.length}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setSection('made'); setFilter('all'); }}
                            className={`flex items-center justify-between rounded-xl px-5 py-4 text-left font-bold transition ${section === 'made' ? 'bg-blue-700 text-white shadow-md' : 'text-slate-700 hover:bg-blue-50'}`}
                        >
                            <span className="flex items-center gap-3"><CalendarDays className="size-5" /> Mis contrataciones</span>
                            <span className={`rounded-full px-2.5 py-1 text-xs ${section === 'made' ? 'bg-white/20' : 'bg-blue-100 text-blue-800'}`}>{madeBookings.length}</span>
                        </button>
                    </div>
                )}
                <div className="border-border mt-8 flex gap-6 overflow-x-auto border-b">
                    {filters.map((item) => (
                        <button
                            type="button"
                            key={item.key}
                            onClick={() => setFilter(item.key)}
                            className={`border-b-2 px-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${filter === item.key ? 'border-primary text-primary' : 'border-transparent text-slate-600 hover:text-blue-700'}`}
                        >
                            {item.label}
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                {item.key === 'all'
                                    ? sectionBookings.length
                                    : sectionBookings.filter((booking) => booking.status === item.key).length}
                            </span>
                        </button>
                    ))}
                </div>
                {visibleBookings.length === 0 ? (
                    <div className="prolink-panel mt-8 p-12 text-center">
                        <CalendarDays className="mx-auto size-12 text-blue-300" />
                        <h2 className="mt-4 text-xl font-bold">
                            {section === 'received' ? 'No tenés solicitudes recibidas' : 'No tenés contrataciones todavía'}
                        </h2>
                        <p className="mt-2 text-slate-600">
                            {section === 'received'
                                ? 'Cuando alguien reserve uno de tus servicios, la solicitud aparecerá acá.'
                                : 'Explorá el marketplace para encontrar tu próximo servicio.'}
                        </p>
                        {section === 'made' && (
                            <Link href={route('services.browse')} className="prolink-primary mt-6">Explorar servicios</Link>
                        )}
                    </div>
                ) : (
                    <div className="mt-8 grid gap-5 xl:grid-cols-2">
                        {visibleBookings.map((booking, i) => (
                            <article key={booking.id} className="prolink-panel overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    <div
                                        className={`flex h-40 items-center justify-center bg-gradient-to-br sm:h-auto sm:w-40 ${i % 2 ? 'from-indigo-100 to-blue-200' : 'from-slate-100 to-indigo-100'}`}
                                    >
                                        <CalendarDays className="text-primary/40 size-12" />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[booking.status]}`}>
                                                    {labels[booking.status]}
                                                </span>
                                                <h2 className="mt-3 text-xl font-bold">{booking.service.title}</h2>
                                            </div>
                                            <strong className="text-primary text-xl">
                                                {new Intl.NumberFormat('es-AR', {
                                                    style: 'currency',
                                                    currency: 'ARS',
                                                    maximumFractionDigits: 0,
                                                }).format(Number(booking.service.price))}
                                            </strong>
                                        </div>
                                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                                            <p className="flex items-center gap-2">
                                                <UserRound className="size-4" />
                                                {section === 'received' ? `Cliente: ${booking.user.name}` : `Profesional: ${booking.service.user.name}`}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Clock3 className="size-4" />
                                                {format(booking.date)}
                                            </p>
                                        </div>
                                        {section === 'received' && booking.status === 'pending' ? (
                                            <div className="mt-5 grid gap-2 sm:grid-cols-2">
                                                <button
                                                    type="button"
                                                    disabled={updating === booking.id}
                                                    onClick={() => updateStatus(booking, 'confirmed')}
                                                    className="prolink-primary"
                                                >
                                                    <Check className="size-4" /> Aceptar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={updating === booking.id}
                                                    onClick={() => updateStatus(booking, 'cancelled')}
                                                    className="prolink-secondary text-red-700"
                                                >
                                                    <X className="size-4" /> Rechazar
                                                </button>
                                            </div>
                                        ) : null}
                                        {section === 'made' && booking.status === 'completed' && !booking.review && (
                                            <Link href={route('bookings.reviews.create', booking.id)} className="prolink-primary mt-5 w-full">
                                                Reseñar trabajo finalizado
                                            </Link>
                                        )}
                                        {section === 'made' && booking.status === 'completed' && booking.review && (
                                            <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-800">
                                                Trabajo finalizado · Reseña enviada
                                            </p>
                                        )}
                                        <Link href={route('bookings.show', booking.id)} className={`${section === 'received' && booking.status === 'pending' ? 'prolink-secondary' : 'prolink-primary'} mt-3 w-full`}>
                                            Ver detalles
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
