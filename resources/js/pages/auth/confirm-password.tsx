// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirma tu contraseña"
            description="Esta es un área segura. Por favor confirma tu contraseña antes de continuar."
        >
            <Head title="Confirmar contraseña" />

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-slate-200">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Tu contraseña"
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            className="border-slate-600/50 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Button 
                            className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 font-semibold rounded-full py-2.5" 
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Confirmar contraseña
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
