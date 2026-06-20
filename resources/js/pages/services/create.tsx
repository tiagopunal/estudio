import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ServiceForm from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Servicios', href: '/services' },
    { title: 'Crear', href: '/services/create' },
];

export default function CreateService() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear servicio" />
            <main className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Crear servicio</h1>
                    <p className="text-muted-foreground text-sm">Publica un servicio asociado a tu perfil profesional.</p>
                </div>

                <div className="max-w-3xl">
                    <ServiceForm submitLabel="Crear servicio" submitUrl="/services" />
                </div>
            </main>
        </AppLayout>
    );
}
