import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Crea tu cuenta" description="Completa los datos a continuación para registrarte">
            <Head title="Registrarse" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-200">Nombre completo</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Tu nombre completo"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-200">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-slate-200">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Tu contraseña"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-slate-200">Confirma tu contraseña</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirma tu contraseña"
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 font-semibold rounded-full py-2.5" 
                        tabIndex={5} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Crear cuenta
                    </Button>
                </div>

                <div className="text-slate-300 text-center text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <TextLink href={route('login')} tabIndex={6} className="text-cyan-300 hover:text-cyan-200 font-medium">
                        Inicia sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
