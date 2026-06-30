import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { ArrowRight, Mail, UserRound } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfil',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-[24px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Perfil</p>
                                <h1 className="text-2xl font-semibold sm:text-3xl">Actualiza tus datos principales.</h1>
                                <p className="text-sm leading-6 text-slate-100/90">Mantén tu información de contacto actualizada para que tu experiencia en el marketplace sea más clara y confiable.</p>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm">
                                <UserRound className="h-4 w-4" />
                                Información básica
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-slate-900 dark:text-white">Nombre</Label>
                                <Input id="name" className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoComplete="name" placeholder="Tu nombre completo" />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-white">Correo electrónico</Label>
                                <Input id="email" type="email" className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoComplete="username" placeholder="Tu correo electrónico" />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Tu correo aún no está verificado.
                                        <Link href={route('verification.send')} method="post" as="button" className="ml-1 font-medium text-emerald-600 underline hover:text-emerald-700">
                                            Enviar otro correo de verificación.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-emerald-600">Se envió un nuevo enlace a tu correo.</div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Button disabled={processing} className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>

                                <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                    <p className="text-sm text-slate-600 dark:text-slate-300">Guardado correctamente</p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-200">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Más opciones de cuenta</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Aquí puedes gestionar datos sensibles y otras acciones de cuenta desde una vista más clara.</p>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                                Revisar cuenta
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="mt-6">
                            <DeleteUser />
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
