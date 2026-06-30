import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { AlertCircle, ArrowRight, BadgeCheck, Briefcase, Mail, MapPin, Phone, Sparkles, UserRound } from 'lucide-react';

interface Profile {
    id: number;
    name: string;
    email: string;
    role: string;
    profile?: {
        description?: string;
        phone?: string;
        location?: string;
        avatar?: string;
    };
}

interface Props {
    profile: Profile;
}

export default function ProfilesEdit({ profile }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        description: profile.profile?.description || '',
        phone: profile.profile?.phone || '',
        location: profile.profile?.location || '',
        avatar: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mi Perfil', href: '/profile/my-profile' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/my-profile');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi perfil" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Tu perfil</p>
                            <h1 className="text-3xl font-semibold sm:text-4xl">Personaliza tu información y mantén tu perfil alineado con la experiencia del marketplace.</h1>
                            <p className="text-sm leading-6 text-slate-100/90">
                                Revisa tus datos, añade detalles de contacto y deja tu perfil listo para destacar.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-emerald-300 text-slate-950 hover:bg-emerald-200">
                                <Link href={route('dashboard')}>
                                    Volver al panel
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-emerald-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Información de la cuenta</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-900 dark:text-white">Nombre</Label>
                                        <Input value={profile.name} disabled className="mt-2 rounded-2xl border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-900 dark:text-white">Email</Label>
                                        <Input type="email" value={profile.email} disabled className="mt-2 rounded-2xl border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Rol</Label>
                                    <Input value={profile.role === 'professional' ? 'Profesional' : 'Cliente'} disabled className="mt-2 rounded-2xl border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-sm font-semibold text-slate-900 dark:text-white">Descripción</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Cuéntanos sobre ti y lo que ofreces..."
                                    rows={4}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-slate-950"
                                />
                                {errors.description && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle size={16} />
                                        {errors.description}
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-900 dark:text-white">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+54 11 1234 5678"
                                        className="mt-2 rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950"
                                    />
                                    {errors.phone && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle size={16} />
                                            {errors.phone}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="location" className="text-sm font-semibold text-slate-900 dark:text-white">Ubicación</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Ciudad, país"
                                        className="mt-2 rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950"
                                    />
                                    {errors.location && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle size={16} />
                                            {errors.location}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="avatar" className="text-sm font-semibold text-slate-900 dark:text-white">Avatar</Label>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.currentTarget.files?.[0];
                                        setData('avatar', file || null);
                                    }}
                                    className="mt-2 rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950"
                                />
                                {errors.avatar && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle size={16} />
                                        {errors.avatar}
                                    </div>
                                )}
                                {profile.profile?.avatar && !data.avatar && (
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        Avatar actual: {profile.profile.avatar}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button type="submit" disabled={processing} className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Button asChild type="button" variant="outline" className="rounded-full border-slate-200 dark:border-white/10">
                                    <Link href={route('dashboard')}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="h-5 w-5 text-emerald-500" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vista previa del perfil</h2>
                            </div>
                            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/40">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{profile.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{profile.role === 'professional' ? 'Profesional' : 'Cliente'}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {profile.email}</p>
                                    {data.phone ? <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> {data.phone}</p> : null}
                                    {data.location ? <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {data.location}</p> : null}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-cyan-500" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Qué puedes hacer aquí</h2>
                            </div>
                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                <p className="flex items-start gap-2"><UserRound className="mt-0.5 h-4 w-4 text-emerald-500" /> Añade una descripción para que otros vean mejor quién eres.</p>
                                <p className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-emerald-500" /> Completa tus datos de contacto para facilitar la comunicación.</p>
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-emerald-500" /> Indica tu ubicación para que sea más fácil encontrarte.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
