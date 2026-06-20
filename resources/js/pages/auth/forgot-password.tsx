// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Recupera tu contraseña" description="Ingresa tu email para recibir un enlace de recuperación">
            <Head title="Recuperar contraseña" />

            <div className="space-y-6">
                {status && <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm font-medium text-emerald-300">{status}</div>}

                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-200">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button 
                            className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 font-semibold rounded-full py-2.5" 
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Enviar enlace de recuperación
                        </Button>
                    </div>
                </form>

                <div className="text-slate-300 space-x-1 text-center text-sm">
                    <span>O vuelve a</span>
                    <TextLink href={route('login')} className="text-cyan-300 hover:text-cyan-200 font-medium">iniciar sesión</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
