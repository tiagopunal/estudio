import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, MapPin, Star, Trash2 } from 'lucide-react';

type Props = {
    service: Service;
};

export default function ShowService({ service }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Servicios', href: '/services' },
        { title: service.title, href: `/services/${service.id}` },
    ];

    const deleteService = () => {
        if (window.confirm('Eliminar este servicio?')) {
            router.delete(`/services/${service.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={service.title} />
            <main className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs">{service.category}</span>
                            <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                                <Star className="size-4" />
                                {service.average_rating.toFixed(1)}
                            </span>
                        </div>
                        <h1 className="text-3xl font-semibold">{service.title}</h1>
                        <p className="text-muted-foreground text-sm">Publicado por {service.professional.name}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {service.can_update && (
                            <Button asChild variant="outline">
                                <Link href={`/services/${service.id}/edit`}>
                                    <Edit />
                                    Editar
                                </Link>
                            </Button>
                        )}
                        {service.can_delete && (
                            <Button variant="destructive" onClick={deleteService}>
                                <Trash2 />
                                Eliminar
                            </Button>
                        )}
                    </div>
                </div>

                <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-6">
                        <h2 className="mb-3 text-lg font-semibold">Descripcion</h2>
                        <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-6">{service.description}</p>
                    </div>

                    <aside className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-6">
                        <dl className="grid gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Precio</dt>
                                <dd className="text-2xl font-semibold">${service.price.toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Profesional</dt>
                                <dd>{service.professional.name}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Ubicacion</dt>
                                <dd className="flex items-center gap-2">
                                    <MapPin className="size-4" />
                                    {service.latitude}, {service.longitude}
                                </dd>
                            </div>
                        </dl>
                    </aside>
                </section>
            </main>
        </AppLayout>
    );
}
