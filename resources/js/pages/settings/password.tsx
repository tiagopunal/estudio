import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contraseña',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contraseña" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-[24px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Seguridad</p>
                                <h1 className="text-2xl font-semibold sm:text-3xl">Actualiza tu contraseña de forma sencilla.</h1>
                                <p className="text-sm leading-6 text-slate-100/90">Usa una contraseña segura para proteger tu cuenta y tus reservas.</p>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm">
                                <ShieldCheck className="h-4 w-4" />
                                Protección
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <LockKeyhole className="h-5 w-5 text-emerald-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cambiar contraseña</h2>
                        </div>

                        <form onSubmit={updatePassword} className="mt-5 space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="current_password" className="text-sm font-semibold text-slate-900 dark:text-white">Contraseña actual</Label>
                                <Input id="current_password" ref={currentPasswordInput} value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} type="password" className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950" autoComplete="current-password" placeholder="Contraseña actual" />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-900 dark:text-white">Nueva contraseña</Label>
                                <Input id="password" ref={passwordInput} value={data.password} onChange={(e) => setData('password', e.target.value)} type="password" className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950" autoComplete="new-password" placeholder="Nueva contraseña" />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-900 dark:text-white">Confirmar contraseña</Label>
                                <Input id="password_confirmation" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} type="password" className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950" autoComplete="new-password" placeholder="Confirmar contraseña" />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Button disabled={processing} className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                                    {processing ? 'Guardando...' : 'Guardar contraseña'}
                                </Button>
                                <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                    <p className="text-sm text-slate-600 dark:text-slate-300">Contraseña actualizada</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
