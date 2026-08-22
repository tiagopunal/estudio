import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    [key: string]: string | boolean;
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Inicia sesión en tu cuenta" description="Ingresa tu email y contraseña para acceder">
            <Head title="Iniciar sesión" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                {status && <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm font-medium text-emerald-300">{status}</div>}
                
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-200">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            inputMode="email"
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nombre@gmail.com"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.email} />
                        <p className="text-xs text-slate-400">Ingresá el correo completo con el que te registraste.</p>
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-slate-200">Contraseña</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-cyan-300 hover:text-cyan-200" tabIndex={5}>
                                    ¿Olvidaste tu contraseña?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Tu contraseña"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox 
                            id="remember" 
                            name="remember" 
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked === true)}
                            className="border-slate-600 bg-slate-900/50"
                        />
                        <Label htmlFor="remember" className="text-slate-300 font-normal cursor-pointer">Recuérdame</Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 font-semibold rounded-full py-2.5" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Iniciar sesión
                    </Button>
                </div>

                <div className="text-slate-300 text-center text-sm">
                    ¿No tienes cuenta?{' '}
                    <TextLink href={route('register')} tabIndex={5} className="text-cyan-300 hover:text-cyan-200 font-medium">
                        Regístrate aquí
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
