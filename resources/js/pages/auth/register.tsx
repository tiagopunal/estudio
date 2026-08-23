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
    [key: string]: string;
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
                        <Label htmlFor="name" className="text-slate-200">
                            Nombre completo
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            minLength={2}
                            maxLength={100}
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Tu nombre completo"
                            className="prolink-field"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-200">
                            Correo electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            inputMode="email"
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="nombre@gmail.com"
                            className="prolink-field"
                        />
                        <InputError message={errors.email} />
                        <p className="text-xs text-slate-400">Usá un correo completo, por ejemplo nombre@gmail.com.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-slate-200">
                            Contraseña
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Tu contraseña"
                            className="prolink-field"
                        />
                        <InputError message={errors.password} />
                        <p className="text-xs text-slate-400">Mínimo 8 caracteres, con mayúscula, minúscula y número.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-slate-200">
                            Confirma tu contraseña
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            minLength={8}
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirma tu contraseña"
                            className="prolink-field"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="prolink-primary mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Crear cuenta
                    </Button>
                </div>

                <div className="text-center text-sm text-slate-300">
                    ¿Ya tienes cuenta?{' '}
                    <TextLink href={route('login')} tabIndex={6} className="font-medium text-cyan-300 hover:text-cyan-200">
                        Inicia sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
