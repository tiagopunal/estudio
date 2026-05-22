import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Star, Edit, Trash2, MapPin } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    user: {
        id: number;
        name: string;
    };
}

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    average_rating: number;
    latitude?: number;
    longitude?: number;
    user: {
        id: number;
        name: string;
    };
    reviews: Review[];
}

interface Props {
    service: Service;
    isOwner: boolean;
}

export default function ServicesShow({ service, isOwner }: Props) {
    const { delete: destroy } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Servicios', href: '/services' },
        { title: service.title, href: `/services/${service.id}` },
    ];

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            destroy(`/services/${service.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={service.title} />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{service.title}</h1>
                        <Badge className="mt-2">{service.category}</Badge>
                    </div>
                    {isOwner && (
                        <div className="flex gap-2">
                            <Link href={`/services/${service.id}/edit`}>
                                <Button size="sm">
                                    <Edit size={16} />
                                    Editar
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} />
                                Eliminar
                            </Button>
                        </div>
                    )}
                </div>

                {/* Información principal */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                            <p className="text-gray-700">{service.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-semibold">Precio:</span>
                                <p className="text-2xl font-bold text-green-600">
                                    ${service.price.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold">Profesional:</span>
                                <p className="text-lg">{service.user.name}</p>
                            </div>
                        </div>

                        {(service.latitude || service.longitude) && (
                            <div className="flex items-center gap-2">
                                <MapPin size={18} />
                                <span>
                                    {service.latitude}, {service.longitude}
                                </span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Calificaciones */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Reseñas y Calificaciones</h2>
                    
                    {service.average_rating > 0 && (
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={
                                            i < Math.round(service.average_rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="font-semibold">
                                    {service.average_rating.toFixed(1)} de 5
                                </p>
                                <p className="text-sm text-gray-600">
                                    ({service.reviews.length} reseña{service.reviews.length !== 1 ? 's' : ''})
                                </p>
                            </div>
                        </div>
                    )}

                    {service.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {service.reviews.map((review) => (
                                <div key={review.id} className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{review.user.name}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={
                                                        i < review.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay reseñas aún</p>
                    )}
                </Card>

                {/* Acciones */}
                <div className="flex gap-4">
                    <a href="/services" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Volver
                        </Button>
                    </a>
                    {!isOwner && (
                        <Link href="/bookings/create" className="flex-1">
                            <Button className="w-full">Hacer Reserva</Button>
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
