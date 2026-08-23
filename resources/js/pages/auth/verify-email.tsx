// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout
            title="Verifica tu correo electrónico"
            description="Por favor verifica tu dirección de correo haciendo clic en el enlace que te enviamos."
        >
            <Head title="Verificación de correo" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-300">
                    Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} className="w-full rounded-full bg-cyan-300 py-2.5 font-semibold text-slate-950 hover:bg-cyan-200">
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Reenviar correo de verificación
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm font-medium text-cyan-300 hover:text-cyan-200">
                    Cerrar sesión
                </TextLink>
            </form>
        </AuthLayout>
    );
}
