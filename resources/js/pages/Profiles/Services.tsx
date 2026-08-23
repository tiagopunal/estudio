import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Star } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    average_rating: number;
    reviews: any[];
}

interface User {
    id: number;
    name: string;
}

interface Props {
    user: User;
    services: Service[];
}

export default function ProfilesServices({ user, services }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inicio', href: '/' },
        { title: user.name, href: `/profiles/${user.id}` },
        { title: 'Servicios', href: `/profiles/${user.id}/services` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Servicios de ${user.name}`} />

            <div className="mx-auto max-w-4xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Servicios de {user.name}</h1>
                </div>

                {services.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500">{user.name} aún no tiene servicios publicados</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {services.map((service) => (
                            <Link key={service.id} href={`/services/${service.id}`}>
                                <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{service.title}</h3>
                                            <Badge className="mt-2">{service.category}</Badge>
                                            <p className="mt-2 line-clamp-2 text-gray-600">{service.description}</p>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="text-2xl font-bold text-green-600">${service.price.toFixed(2)}</div>
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
                                                        <span className="text-xs text-gray-600">({service.reviews.length})</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="ml-4 text-gray-400" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex gap-4">
                    <a href={`/profiles/${user.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                            Volver al Perfil
                        </Button>
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
