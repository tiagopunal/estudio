import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Clock3, MapPin, Sparkles, Star } from 'lucide-react';

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

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm tracking-[0.3em] text-emerald-100 uppercase">Reserva tu próximo servicio</p>
                            <h1 className="text-3xl font-semibold sm:text-4xl">Nueva reserva con el mismo estilo visual del marketplace.</h1>
                            <p className="text-sm leading-6 text-slate-100/90">
                                Seleccioná el servicio, elegí la fecha y enviá tu reserva desde una pantalla limpia y consistente.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-emerald-300 text-slate-950 hover:bg-emerald-200">
                                <Link href={route('marketplace')}>
                                    Volver al marketplace
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-full border-white/70 text-white hover:bg-white/10">
                                <Link href={route('bookings.index')}>Ver mis reservas</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-emerald-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Datos de la reserva</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <div>
                                <Label htmlFor="service_id" className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Servicio
                                </Label>
                                <select
                                    id="service_id"
                                    value={data.service_id}
                                    onChange={(e) => setData('service_id', e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-slate-950"
                                >
                                    <option value="">Selecciona un servicio...</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.title} -{' '}
                                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(
                                                Number(service.price),
                                            )}{' '}
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
                                <Label htmlFor="date" className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Fecha y Hora
                                </Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950"
                                />
                                {errors.date && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle size={16} />
                                        {errors.date}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button type="submit" disabled={processing} className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                                    {processing ? 'Guardando...' : 'Crear Reserva'}
                                </Button>
                                <Button asChild type="button" variant="outline" className="rounded-full border-slate-200 dark:border-white/10">
                                    <Link href={route('bookings.index')}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                            <p className="text-sm tracking-[0.3em] text-emerald-600 uppercase">Detalle del servicio</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                                {selectedService ? selectedService.title : 'Seleccioná un servicio'}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {selectedService ? selectedService.description : 'Elegí un servicio para ver su información y preparar la reserva.'}
                            </p>

                            {selectedService && (
                                <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <p className="inline-flex items-center gap-2">
                                        <Star className="h-4 w-4 text-amber-500" />
                                        Profesional: {selectedService.user.name}
                                    </p>
                                    <p className="inline-flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Categoría: {selectedService.category}
                                    </p>
                                    <p className="inline-flex items-center gap-2">
                                        <Clock3 className="h-4 w-4" />
                                        Precio:{' '}
                                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(
                                            Number(selectedService.price),
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Estado del flujo</h2>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Cuando completes el formulario, la reserva se guardará y podrás verla en tu lista de reservas.
                            </p>
                            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                                <p>
                                    La pantalla quedó alineada con el estilo visual del marketplace para que el cambio entre páginas se sienta
                                    natural.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
