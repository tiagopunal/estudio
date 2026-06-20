import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Star, Mail, Phone, MapPin } from 'lucide-react';

interface Profile {
    id: number;
    name: string;
    email: string;
    role: string;
    profile?: {
        description?: string;
        phone?: string;
        location?: string;
        avatar?: string;
    };
    services?: any[];
    reviews?: any[];
    _count?: {
        services: number;
        reviews: number;
        bookings: number;
    };
}

interface Props {
    profile: Profile;
}

export default function ProfilesShow({ profile }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inicio', href: '/' },
        { title: profile.name, href: `/profiles/${profile.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={profile.name} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Información Personal */}
                <Card className="p-6">
                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            {profile.profile?.avatar ? (
                                <img
                                    src={profile.profile.avatar}
                                    alt={profile.name}
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                                    <span className="text-gray-600 text-2xl font-bold">
                                        {profile.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            {profile.role === 'professional' && (
                                <Badge className="bg-blue-100 text-blue-800">Profesional</Badge>
                            )}
                        </div>

                        {/* Información */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold">{profile.name}</h1>
                            </div>

                            {profile.profile?.description && (
                                <div>
                                    <p className="text-gray-700">{profile.profile.description}</p>
                                </div>
                            )}

                            {/* Contacto */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={18} />
                                    <span>{profile.email}</span>
                                </div>
                                {profile.profile?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={18} />
                                        <span>{profile.profile.phone}</span>
                                    </div>
                                )}
                                {profile.profile?.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} />
                                        <span>{profile.profile.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Estadísticas */}
                            {profile._count && (
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <Link href={`/profiles/${profile.id}/services`}>
                                        <Card className="p-4 text-center hover:shadow-lg cursor-pointer">
                                            <p className="text-2xl font-bold">
                                                {profile._count.services}
                                            </p>
                                            <p className="text-sm text-gray-600">Servicios</p>
                                        </Card>
                                    </Link>
                                    <Link href={`/profiles/${profile.id}/reviews`}>
                                        <Card className="p-4 text-center hover:shadow-lg cursor-pointer">
                                            <p className="text-2xl font-bold">
                                                {profile._count.reviews}
                                            </p>
                                            <p className="text-sm text-gray-600">Reseñas</p>
                                        </Card>
                                    </Link>
                                    <Card className="p-4 text-center">
                                        <p className="text-2xl font-bold">{profile._count.bookings}</p>
                                        <p className="text-sm text-gray-600">Reservas</p>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Acciones */}
                <div className="flex gap-4">
                    <a href="/" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Volver
                        </Button>
                    </a>
                    {profile.role === 'professional' && (
                        <Link href={`/profiles/${profile.id}/services`} className="flex-1">
                            <Button className="w-full">Ver Servicios</Button>
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
