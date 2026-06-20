import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { AlertCircle } from 'lucide-react';

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
}

interface Props {
    profile: Profile;
}

export default function ProfilesEdit({ profile }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        description: profile.profile?.description || '',
        phone: profile.profile?.phone || '',
        location: profile.profile?.location || '',
        avatar: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mi Perfil', href: '/profile/my-profile' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/my-profile');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Perfil" />

            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información de Cuenta */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Información de Cuenta</h2>
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <Label>Nombre</Label>
                                    <Input value={profile.name} disabled className="mt-2" />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>Rol</Label>
                                    <Input
                                        value={profile.role === 'professional' ? 'Profesional' : 'Cliente'}
                                        disabled
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información de Perfil */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Información de Perfil</h2>
                            <div className="space-y-4">
                                {/* Descripción */}
                                <div>
                                    <Label htmlFor="description">Descripción</Label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Cuéntanos sobre ti..."
                                        rows={4}
                                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.description && (
                                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle size={16} />
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                        className="mt-2"
                                    />
                                    {errors.phone && (
                                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle size={16} />
                                            {errors.phone}
                                        </div>
                                    )}
                                </div>

                                {/* Ubicación */}
                                <div>
                                    <Label htmlFor="location">Ubicación</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Ciudad, País"
                                        className="mt-2"
                                    />
                                    {errors.location && (
                                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle size={16} />
                                            {errors.location}
                                        </div>
                                    )}
                                </div>

                                {/* Avatar */}
                                <div>
                                    <Label htmlFor="avatar">Avatar</Label>
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.currentTarget.files?.[0];
                                            setData('avatar', file || null);
                                        }}
                                        className="mt-2"
                                    />
                                    {errors.avatar && (
                                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle size={16} />
                                            {errors.avatar}
                                        </div>
                                    )}
                                    {profile.profile?.avatar && !data.avatar && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Avatar actual: {profile.profile.avatar}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={processing} className="flex-1">
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                            <a href="/dashboard">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </a>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
