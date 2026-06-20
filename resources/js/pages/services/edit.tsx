import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { Head } from '@inertiajs/react';
import ServiceForm from './form';

type Props = {
    service: Service;
};

export default function EditService({ service }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Servicios', href: '/services' },
        { title: service.title, href: `/services/${service.id}` },
        { title: 'Editar', href: `/services/${service.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${service.title}`} />
            <main className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Editar servicio</h1>
                    <p className="text-muted-foreground text-sm">Actualiza la informacion visible del servicio.</p>
                </div>

                <div className="max-w-3xl">
                    <ServiceForm service={service} submitLabel="Guardar cambios" submitUrl={`/services/${service.id}`} method="put" />
                </div>
            </main>
        </AppLayout>
    );
}
