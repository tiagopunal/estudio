import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Restablece tu contraseña" description="Ingresa tu nueva contraseña a continuación">
            <Head title="Restablecer contraseña" />

            <form onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-200">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-slate-200">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Tu nueva contraseña"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-slate-200">Confirma tu contraseña</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirma tu contraseña"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 font-semibold rounded-full py-2.5" 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Restablecer contraseña
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
