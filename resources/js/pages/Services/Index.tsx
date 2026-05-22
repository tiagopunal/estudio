import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Star, Edit, Trash2, ChevronRight } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
}

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    average_rating: number;
    reviews: Review[];
    bookings: any[];
}

interface Props {
    services: Service[];
}

export default function ServicesIndex({ services }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mis Servicios', href: '/services' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Servicios" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Mis Servicios</h1>
                    <Link href="/services/create">
                        <Button>Nuevo Servicio</Button>
                    </Link>
                </div>

                {services.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500">No tienes servicios publicados</p>
                        <Link href="/services/create">
                            <Button className="mt-4">Publicar primer servicio</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {services.map((service) => (
                            <Card key={service.id} className="overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{service.title}</h3>
                                            <Badge className="mt-2">{service.category}</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/services/${service.id}/edit`}>
                                                <Button size="sm" variant="outline">
                                                    <Edit size={16} />
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="destructive">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4">{service.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-2xl font-bold">
                                                ${service.price.toFixed(2)}
                                            </div>
                                            {service.average_rating > 0 && (
                                                <div className="flex items-center gap-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={
                                                                i < Math.round(service.average_rating)
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                            }
                                                        />
                                                    ))}
                                                    <span className="text-sm text-gray-600">
                                                        ({service.reviews.length})
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Link href={`/services/${service.id}`}>
                                            <Button variant="ghost">
                                                <ChevronRight size={20} />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
