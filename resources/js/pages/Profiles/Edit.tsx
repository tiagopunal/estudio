import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type MarketplaceProfile, type SharedData, type User } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { BadgeCheck, BriefcaseBusiness } from 'lucide-react';

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
        avatar: null as File | null,
        profession: profile.profile?.profession ?? '',
        experience_years: profile.profile?.experience_years ?? 0,
        skills: profile.profile?.skills ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mi perfil profesional', href: '/my-profile' },
    ];

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post(route('marketplace-profile.update'), { forceFormData: true, preserveScroll: true });
    };

    const activateProfessional = () => {
        router.patch(route('marketplace-profile.upgrade'), {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi perfil profesional" />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Mi perfil del marketplace</h1>
                        <p className="text-sm text-muted-foreground">Administrá la información que verán los clientes y profesionales.</p>
                    </div>
                    <Button variant="outline" asChild><Link href={route('profiles.show', profile.id)}>Ver perfil público</Link></Button>
                </div>

                {flash?.success && <Alert><AlertDescription>{flash.success}</AlertDescription></Alert>}
                {recentlySuccessful && <p className="text-sm font-medium text-emerald-600">Los cambios fueron guardados.</p>}

                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        {profile.role === 'professional' ? <BadgeCheck className="text-emerald-600" /> : <BriefcaseBusiness className="text-blue-600" />}
                        <div>
                            <p className="font-semibold">{profile.role === 'professional' ? 'Cuenta profesional activa' : 'Cuenta cliente'}</p>
                            <p className="text-sm text-muted-foreground">
                                {profile.role === 'professional' ? 'Ya podés publicar y administrar servicios.' : 'Completá los datos profesionales y activá tu cuenta para publicar servicios.'}
                            </p>
                        </div>
                    </div>
                    <InputError message={pageErrors.professional} className="mt-3" />
                </Card>

                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div><Label htmlFor="full_name">Nombre completo</Label><Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} /><InputError message={errors.full_name} /></div>
                            <div><Label>Correo de la cuenta</Label><Input value={profile.email} disabled /></div>
                            <div><Label htmlFor="phone">Teléfono</Label><Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} /><InputError message={errors.phone} /></div>
                            <div><Label htmlFor="location">Ubicación</Label><Input id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} placeholder="Ciudad, provincia" /><InputError message={errors.location} /></div>
                            <div><Label htmlFor="profession">Profesión u oficio</Label><Input id="profession" value={data.profession} onChange={(e) => setData('profession', e.target.value)} placeholder="Plomero, tutor, diseñador..." /><InputError message={errors.profession} /></div>
                            <div><Label htmlFor="experience_years">Años de experiencia</Label><Input id="experience_years" type="number" min={0} max={80} value={data.experience_years} onChange={(e) => setData('experience_years', Number(e.target.value))} /><InputError message={errors.experience_years} /></div>
                        </div>

                        <div><Label htmlFor="description">Descripción</Label><Textarea id="description" rows={5} value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Contá quién sos, cómo trabajás y qué experiencia tenés." /><InputError message={errors.description} /></div>
                        <div><Label htmlFor="skills">Habilidades</Label><Textarea id="skills" rows={3} value={data.skills} onChange={(e) => setData('skills', e.target.value)} placeholder="Ejemplo: instalaciones, reparaciones, mantenimiento" /><InputError message={errors.skills} /></div>
                        <div>
                            <Label htmlFor="avatar">Foto de perfil</Label>
                            <Input id="avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)} />
                            <InputError message={errors.avatar} />
                            {profile.profile?.avatar && <img src={`/storage/${profile.profile.avatar}`} alt="Avatar actual" className="mt-3 h-20 w-20 rounded-full object-cover" />}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : 'Guardar perfil'}</Button>
                            {profile.role !== 'professional' && <Button type="button" variant="secondary" onClick={activateProfessional}>Activar cuenta profesional</Button>}
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
