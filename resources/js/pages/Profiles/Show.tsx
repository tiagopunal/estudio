import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type MarketplaceProfile, type Review, type Service, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BriefcaseBusiness, MapPin, Star } from 'lucide-react';

interface Props {
    profile: User & { profile?: MarketplaceProfile; services: Service[] };
    receivedReviews: Review[];
}

export default function ProfilesShow({ profile, receivedReviews }: Props) {
    const details = profile.profile;
    const average = receivedReviews.length
        ? receivedReviews.reduce((sum, review) => sum + review.rating, 0) / receivedReviews.length
        : 0;

    return (
        <AppLayout breadcrumbs={[{ title: 'Servicios', href: '/services/browse' }, { title: profile.name, href: `/profiles/${profile.id}` }]}>
            <Head title={`Perfil de ${profile.name}`} />
            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                <Card className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                        {details?.avatar ? (
                            <img src={`/storage/${details.avatar}`} alt={profile.name} className="h-32 w-32 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-slate-200 text-4xl font-bold text-slate-600">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold">{details?.full_name || profile.name}</h1>
                                <Badge variant={profile.role === 'professional' ? 'default' : 'secondary'}>
                                    {profile.role === 'professional' ? 'Profesional verificado' : 'Cliente'}
                                </Badge>
                            </div>
                            {details?.profession && <p className="flex items-center gap-2 font-medium"><BriefcaseBusiness className="size-4" />{details.profession}</p>}
                            {details?.location && <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" />{details.location}</p>}
                            {details?.description && <p className="max-w-2xl leading-7 text-muted-foreground">{details.description}</p>}
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span>{details?.experience_years ?? 0} años de experiencia</span>
                                <span className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" />{average.toFixed(1)} ({receivedReviews.length} reseñas)</span>
                            </div>
                            {details?.skills && <p><strong>Habilidades:</strong> {details.skills}</p>}
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold">Servicios publicados</h2>
                        <p className="mt-2 text-3xl font-bold">{profile.services.length}</p>
                        <Button asChild variant="outline" className="mt-4"><Link href={route('profiles.services', profile.id)}>Ver servicios</Link></Button>
                    </Card>
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold">Reputación recibida</h2>
                        <p className="mt-2 text-3xl font-bold">{receivedReviews.length} reseñas</p>
                        <Button asChild variant="outline" className="mt-4"><Link href={route('profiles.reviews', profile.id)}>Ver reseñas</Link></Button>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
