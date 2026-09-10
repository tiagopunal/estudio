import InputError from '@/components/input-error';
import { LocationPicker } from '@/components/maps/location-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BriefcaseBusiness, MapPin, Save } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number | string;
    category: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}

export default function ServicesEdit({ service }: { service: Service }) {
    const { data, setData, put, processing, errors } = useForm({
        title: service.title,
        description: service.description,
        price: String(service.price),
        category: service.category,
        location: service.location || '',
        latitude: service.latitude?.toString() || '',
        longitude: service.longitude?.toString() || '',
    });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(route('services.update', service.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Mis servicios', href: '/services' },
                { title: 'Editar', href: `/services/${service.id}/edit` },
            ]}
        >
            <Head title={`Editar ${service.title}`} />
            <div className="prolink-page max-w-5xl">
                <p className="prolink-kicker">Catálogo profesional</p>
                <h1 className="prolink-title mt-2">Editar servicio</h1>
                <p className="prolink-subtitle">Actualizá la información que verán tus futuros clientes.</p>
                <form onSubmit={submit} className="mt-8 space-y-6">
                    <section className="prolink-panel p-6 sm:p-8">
                        <h2 className="flex items-center gap-3 text-xl font-bold">
                            <BriefcaseBusiness className="text-primary" />
                            Información básica
                        </h2>
                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <Field label="Título del servicio" error={errors.title} wide>
                                <Input
                                    required
                                    minLength={5}
                                    maxLength={120}
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="prolink-field"
                                />
                            </Field>
                            <Field label="Categoría" error={errors.category}>
                                <Input
                                    required
                                    minLength={3}
                                    maxLength={50}
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="prolink-field"
                                />
                            </Field>
                            <Field label="Precio en pesos argentinos (ARS)" error={errors.price}>
                                <Input
                                    type="number"
                                    required
                                    min="0.01"
                                    max="99999999.99"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="prolink-field"
                                />
                            </Field>
                            <Field label="Descripción detallada" error={errors.description} wide>
                                <Textarea
                                    required
                                    minLength={20}
                                    maxLength={2000}
                                    rows={7}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="prolink-field py-3"
                                />
                            </Field>
                        </div>
                    </section>
                    <section className="prolink-panel p-6 sm:p-8">
                        <h2 className="flex items-center gap-3 text-xl font-bold">
                            <MapPin className="text-primary" />
                            Zona del servicio
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">Actualizá la zona o mové el punto haciendo clic sobre el mapa.</p>
                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <Field label="Ciudad o zona (opcional)" error={errors.location} wide>
                                <Input
                                    maxLength={255}
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="prolink-field"
                                    placeholder="Ej: Córdoba Capital"
                                />
                            </Field>
                            <div className="md:col-span-2">
                                <LocationPicker
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    onChange={(latitude, longitude) => setData((current) => ({ ...current, latitude, longitude }))}
                                    onAddressChange={(location) => setData('location', location)}
                                />
                            </div>
                            <Field label="Latitud (opcional)" error={errors.latitude}>
                                <Input
                                    type="number"
                                    step="0.0001"
                                    min="-90"
                                    max="90"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    className="prolink-field"
                                />
                            </Field>
                            <Field label="Longitud (opcional)" error={errors.longitude}>
                                <Input
                                    type="number"
                                    step="0.0001"
                                    min="-180"
                                    max="180"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    className="prolink-field"
                                />
                            </Field>
                        </div>
                    </section>
                    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                        <Link href={route('services.show', service.id)} className="prolink-secondary">
                            Cancelar
                        </Link>
                        <button type="submit" disabled={processing} className="prolink-primary">
                            <Save />
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, error, children, wide = false }: { label: string; error?: string; children: React.ReactNode; wide?: boolean }) {
    return (
        <div className={wide ? 'md:col-span-2' : ''}>
            <Label className="mb-2 block">{label}</Label>
            {children}
            <InputError message={error} className="mt-2" />
        </div>
    );
}
