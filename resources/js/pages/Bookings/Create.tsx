import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, Clock3, MapPin, UserRound } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    location?: string | null;
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
        service_id: services[0]?.id?.toString() ?? '',
        date: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Reservas', href: '/bookings' },
        { title: 'Nueva Reserva', href: '/bookings/create' },
    ];

    const selectedService = services.find((service) => service.id === Number(data.service_id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bookings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Reserva" />

            <main className="min-h-full bg-[#f8f7fc]">
                <div className="prolink-page">
                    <div className="mb-8 max-w-3xl">
                        <p className="prolink-kicker">Nueva reserva</p>
                        <h1 className="prolink-title mt-2">Reservá tu servicio</h1>
                        <p className="prolink-subtitle">Elegí un servicio y el momento que mejor se adapte a vos.</p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
                        <section className="prolink-panel p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-slate-950">Datos de la reserva</h2>

                            <form onSubmit={handleSubmit} className="mt-7 space-y-6">
                                <div>
                                    <Label htmlFor="service_id" className="font-bold text-slate-900">
                                        Servicio
                                    </Label>
                                    <select
                                        id="service_id"
                                        value={data.service_id}
                                        onChange={(e) => setData('service_id', e.target.value)}
                                        className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 !bg-white px-4 py-3 text-sm !text-slate-900 transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                                    >
                                        <option value="">Selecciona un servicio...</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.title} -{' '}
                                                {new Intl.NumberFormat('es-AR', {
                                                    style: 'currency',
                                                    currency: 'ARS',
                                                    maximumFractionDigits: 0,
                                                }).format(Number(service.price))}{' '}
                                                ({service.user.name})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.service_id && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle size={16} />
                                            {errors.service_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="date" className="font-bold text-slate-900">
                                        Fecha y Hora
                                    </Label>
                                    <Input
                                        id="date"
                                        type="datetime-local"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="mt-2 !min-h-12 rounded-lg border border-slate-300 !bg-white px-4 !text-slate-900 focus:border-blue-600 focus:ring-blue-600/20"
                                    />
                                    {errors.date && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle size={16} />
                                            {errors.date}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                    <Button type="submit" disabled={processing} className="prolink-primary sm:min-w-40">
                                        {processing ? 'Guardando...' : 'Crear Reserva'}
                                    </Button>
                                    <Button asChild type="button" variant="outline" className="prolink-secondary">
                                        <Link href={route('bookings.index')}>Cancelar</Link>
                                    </Button>
                                </div>
                            </form>
                        </section>

                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <div className="prolink-panel p-6">
                                <p className="text-sm font-bold text-slate-500 uppercase">Resumen del servicio</p>

                                {selectedService ? (
                                    <>
                                        <p className="prolink-kicker mt-5">{selectedService.category}</p>
                                        <h2 className="mt-2 text-2xl font-bold text-slate-950">{selectedService.title}</h2>
                                        <p className="mt-3 text-4xl font-bold text-blue-700">
                                            {new Intl.NumberFormat('es-AR', {
                                                style: 'currency',
                                                currency: 'ARS',
                                                maximumFractionDigits: 0,
                                            }).format(Number(selectedService.price))}
                                        </p>
                                        <div className="mt-6 space-y-4 border-t border-slate-200 pt-5 text-sm text-slate-700">
                                            <p className="flex items-center gap-2 font-bold">
                                                <UserRound className="size-5 text-blue-700" />
                                                {selectedService.user.name}
                                            </p>
                                            {selectedService.location && (
                                                <p className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-800">
                                                    <MapPin className="size-5" />
                                                    {selectedService.location}
                                                </p>
                                            )}
                                            <p className="flex items-start gap-2 leading-6">
                                                <Clock3 className="mt-0.5 size-5 shrink-0 text-blue-700" />
                                                {selectedService.description}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-5 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-5 text-sm leading-6 text-slate-600">
                                        Seleccioná un servicio para ver su resumen.
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
