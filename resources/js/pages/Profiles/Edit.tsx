import InputError from '@/components/input-error';
import { LocationPicker } from '@/components/maps/location-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type MarketplaceProfile, type SharedData, type User } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, BadgeCheck, BriefcaseBusiness, Camera, FileText, MapPin, Save, UserRound } from 'lucide-react';
import { useRef, useState } from 'react';
interface Props {
    profile: User & { profile: MarketplaceProfile };
}
export default function ProfilesEdit({ profile }: Props) {
    const { flash, errors: pageErrors } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        full_name: profile.profile?.full_name ?? profile.name,
        description: profile.profile?.description ?? '',
        phone: profile.profile?.phone ?? '',
        location: profile.profile?.location ?? '',
        latitude: profile.profile?.latitude ?? '',
        longitude: profile.profile?.longitude ?? '',
        avatar: null as File | null,
        profession: profile.profile?.profession ?? '',
        experience_years: profile.profile?.experience_years ?? 0,
        skills: profile.profile?.skills ?? '',
    });
    const [activationAttempted, setActivationAttempted] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(profile.profile?.avatar ? `/storage/${profile.profile.avatar}` : '');
    const activationNotice = useRef<HTMLDivElement>(null);
    const requiredProfessionalFields = [
        { key: 'description', label: 'Resumen de experiencia' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'location', label: 'Ciudad o zona' },
        { key: 'profession', label: 'Profesión u oficio' },
        { key: 'skills', label: 'Habilidades' },
    ] as const;
    const missingFields = requiredProfessionalFields.filter((field) => !String(data[field.key] ?? '').trim());
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('marketplace-profile.update'), { forceFormData: true, preserveScroll: true });
    };
    const activateProfessional = () => {
        setActivationAttempted(true);
        if (missingFields.length) {
            requestAnimationFrame(() => activationNotice.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
            return;
        }
        post(route('marketplace-profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => router.patch(route('marketplace-profile.upgrade'), {}, { preserveScroll: true }),
        });
    };
    const selectAvatar = (file: File | null) => {
        setData('avatar', file);
        if (file) setAvatarPreview(URL.createObjectURL(file));
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Mi perfil', href: '/my-profile' }]}>
            <Head title="Mi perfil" />
            <div className="prolink-page">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="prolink-kicker">Identidad en ProLink</p>
                        <h1 className="prolink-title mt-2">Mi perfil profesional</h1>
                        <p className="prolink-subtitle">Esta información será visible para quienes visiten tu perfil.</p>
                    </div>
                    <Link href={route('profiles.show', profile.id)} className="prolink-secondary">
                        Ver perfil público
                    </Link>
                </div>
                {(flash?.success || recentlySuccessful) && (
                    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                        {flash?.success || 'Los cambios fueron guardados.'}
                    </div>
                )}
                <section className="prolink-panel mt-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                    <div className="relative">
                        <div className="text-primary flex size-24 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-3xl font-bold">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Vista previa del perfil" className="size-full object-cover" />
                            ) : (
                                profile.name.charAt(0)
                            )}
                        </div>
                        <label
                            htmlFor="avatar-upload"
                            className="bg-primary absolute right-0 bottom-0 cursor-pointer rounded-full p-2 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
                            aria-label="Cambiar foto de perfil"
                            title="Cambiar foto de perfil"
                        >
                            <Camera className="size-4" />
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(e) => selectAvatar(e.target.files?.[0] ?? null)}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">{data.full_name}</h2>
                        <p className="mt-1 text-slate-600">{data.profession || 'Completá tu profesión u oficio'}</p>
                        <span className="text-primary mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold">
                            {profile.role === 'professional' ? <BadgeCheck className="size-4" /> : <UserRound className="size-4" />}
                            {profile.role === 'professional' ? 'Cuenta profesional activa' : 'Cuenta cliente'}
                        </span>
                    </div>
                    {profile.role !== 'professional' && (
                        <Button onClick={activateProfessional} className="prolink-primary">
                            <BriefcaseBusiness />
                            Activar cuenta profesional
                        </Button>
                    )}
                </section>
                {profile.role !== 'professional' && (activationAttempted || pageErrors.professional) && missingFields.length > 0 && (
                    <div ref={activationNotice} className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-sm">
                        <div className="flex gap-3">
                            <AlertCircle className="mt-0.5 size-6 shrink-0 text-amber-600" />
                            <div>
                                <h2 className="text-lg font-extrabold">Faltan datos para activar tu cuenta profesional</h2>
                                <p className="mt-1 text-sm leading-6">
                                    Completá y guardá los siguientes campos. Al volver a presionar “Activar cuenta profesional”, guardaremos el perfil
                                    y realizaremos la activación.
                                </p>
                                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {missingFields.map((field) => (
                                        <li key={field.key} className="rounded-lg bg-white px-3 py-2 text-sm font-bold">
                                            • {field.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {pageErrors.professional && missingFields.length === 0 && (
                    <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-700">{pageErrors.professional}</div>
                )}
                <form onSubmit={submit} className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_.8fr]">
                    <div className="space-y-6">
                        <section className="prolink-panel p-6">
                            <h2 className="flex items-center gap-3 text-xl font-bold">
                                <UserRound className="text-primary" />
                                Información personal
                            </h2>
                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <Field label="Nombre completo" error={errors.full_name}>
                                    <Input
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                        className="prolink-field"
                                    />
                                </Field>
                                <Field label="Correo electrónico">
                                    <Input value={profile.email} disabled className="prolink-field" />
                                </Field>
                                <Field label="Teléfono" error={errors.phone}>
                                    <Input
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="prolink-field"
                                        placeholder="+54 11 0000 0000"
                                    />
                                </Field>
                                <Field label="Profesión u oficio" error={errors.profession}>
                                    <Input
                                        value={data.profession}
                                        onChange={(e) => setData('profession', e.target.value)}
                                        className="prolink-field"
                                        placeholder="Electricista, tutor, diseñador..."
                                    />
                                </Field>
                                <Field label="Años de experiencia" error={errors.experience_years}>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={80}
                                        value={data.experience_years}
                                        onChange={(e) => setData('experience_years', Number(e.target.value))}
                                        className="prolink-field"
                                    />
                                </Field>
                            </div>
                            {data.avatar && (
                                <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
                                    Nueva foto seleccionada: {data.avatar.name}. Se guardará al presionar “Guardar cambios”.
                                </p>
                            )}
                            <InputError message={errors.avatar} className="mt-3" />
                        </section>
                        <section className="prolink-panel p-6">
                            <h2 className="flex items-center gap-3 text-xl font-bold">
                                <FileText className="text-primary" />
                                Biografía profesional
                            </h2>
                            <div className="mt-6 space-y-5">
                                <Field label="Resumen de experiencia" error={errors.description}>
                                    <Textarea
                                        rows={6}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="prolink-field py-3"
                                        placeholder="Contá cómo trabajás y qué experiencia tenés."
                                    />
                                </Field>
                                <Field label="Habilidades" error={errors.skills}>
                                    <Textarea
                                        rows={3}
                                        value={data.skills}
                                        onChange={(e) => setData('skills', e.target.value)}
                                        className="prolink-field py-3"
                                        placeholder="Instalaciones, reparaciones, mantenimiento..."
                                    />
                                </Field>
                            </div>
                        </section>
                    </div>
                    <aside className="space-y-6">
                        <section className="prolink-panel p-6">
                            <h2 className="flex items-center gap-3 text-xl font-bold">
                                <MapPin className="text-primary" />
                                Ubicación
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">Marcá tu zona de trabajo para que los clientes cercanos puedan encontrarte.</p>
                            <div className="mt-5">
                                <Field label="Ciudad o zona" error={errors.location}>
                                    <Input
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="prolink-field"
                                        placeholder="Córdoba, Argentina"
                                    />
                                </Field>
                            </div>
                            <div className="mt-5">
                                <LocationPicker
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    title="Ubicación profesional"
                                    onChange={(latitude, longitude) => setData((current) => ({ ...current, latitude, longitude }))}
                                    onAddressChange={(location) => setData('location', location)}
                                />
                            </div>
                            <InputError message={errors.latitude || errors.longitude} className="mt-3" />
                        </section>
                        <button type="submit" disabled={processing} className="prolink-primary w-full">
                            <Save />
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </aside>
                </form>
            </div>
        </AppLayout>
    );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <Label className="mb-2 block text-slate-800">{label}</Label>
            {children}
            <InputError message={error} className="mt-2" />
        </div>
    );
}
