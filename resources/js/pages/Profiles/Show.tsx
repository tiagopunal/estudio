import { ServiceMap, type MapService } from '@/components/maps/service-map';
import { ProLinkFooter } from '@/components/prolink-footer';
import { ProLinkHeader } from '@/components/prolink-header';
import { type MarketplaceProfile, type Review, type Service, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BadgeCheck, BriefcaseBusiness, MapPin, Star } from 'lucide-react';
interface Props {
    profile: User & { profile?: MarketplaceProfile; services: Service[] };
    receivedReviews: Review[];
}
export default function ProfilesShow({ profile, receivedReviews }: Props) {
    const d = profile.profile;
    const avg = receivedReviews.length ? receivedReviews.reduce((n, r) => n + r.rating, 0) / receivedReviews.length : 0;
    const locatedServices: MapService[] = profile.services
        .filter((service) => service.latitude != null && service.longitude != null)
        .map((service) => ({
            id: service.id,
            title: service.title,
            category: service.category,
            price: service.price,
            location: service.location,
            latitude: service.latitude!,
            longitude: service.longitude!,
            user: { name: d?.full_name || profile.name },
        }));
    const professionalLocation =
        d?.latitude != null && d?.longitude != null ? { latitude: Number(d.latitude), longitude: Number(d.longitude) } : null;
    return (
        <div className="flex min-h-screen flex-col bg-[#f8f7fc]">
            <Head title={`Perfil de ${profile.name}`} />
            <ProLinkHeader />
            <main className="prolink-page flex-1">
                <section className="prolink-panel flex flex-col gap-6 p-7 sm:flex-row sm:items-center">
                    <div className="text-primary flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-4xl font-bold">
                        {d?.avatar ? <img src={`/storage/${d.avatar}`} className="size-full object-cover" /> : profile.name.charAt(0)}
                    </div>
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                            <BadgeCheck className="size-4" />
                            {profile.role === 'professional' ? 'Profesional' : 'Cliente'}
                        </span>
                        <h1 className="mt-3 text-4xl font-bold">{d?.full_name || profile.name}</h1>
                        {d?.profession && <p className="mt-2 text-xl text-slate-600">{d.profession}</p>}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                            {d?.location && (
                                <span className="flex gap-2">
                                    <MapPin className="text-primary size-4" />
                                    {d.location}
                                </span>
                            )}
                            <span className="flex gap-2">
                                <Star className="size-4 fill-amber-400 text-amber-400" />
                                {avg.toFixed(1)} ({receivedReviews.length} reseñas)
                            </span>
                            <span>{d?.experience_years ?? 0} años de experiencia</span>
                        </div>
                    </div>
                </section>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
                    <section className="prolink-panel p-7">
                        <h2 className="text-2xl font-bold">Sobre este profesional</h2>
                        <p className="mt-4 leading-8 whitespace-pre-line text-slate-700">
                            {d?.description || 'Este usuario todavía no agregó una descripción profesional.'}
                        </p>
                        {d?.skills && (
                            <div className="mt-6">
                                <h3 className="font-bold">Habilidades</h3>
                                <p className="mt-2 text-slate-600">{d.skills}</p>
                            </div>
                        )}
                    </section>
                    <aside className="space-y-4">
                        <div className="prolink-panel p-6">
                            <BriefcaseBusiness className="text-primary" />
                            <p className="mt-4 text-3xl font-bold">{profile.services.length}</p>
                            <p className="text-slate-600">servicios publicados</p>
                            <Link href={route('profiles.services', profile.id)} className="prolink-primary mt-5 w-full">
                                Ver servicios
                            </Link>
                        </div>
                        <div className="prolink-panel p-6">
                            <Star className="text-primary" />
                            <p className="mt-4 text-3xl font-bold">{receivedReviews.length}</p>
                            <p className="text-slate-600">reseñas recibidas</p>
                            <Link href={route('profiles.reviews', profile.id)} className="prolink-secondary mt-5 w-full">
                                Ver reseñas
                            </Link>
                        </div>
                    </aside>
                </div>
                {(professionalLocation || locatedServices.length > 0) && (
                    <section className="mt-6">
                        <div className="mb-4">
                            <p className="prolink-kicker">Cobertura</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-950">Ubicación y servicios publicados</h2>
                            <p className="mt-1 text-slate-600">La ubicación es aproximada y ayuda a encontrar profesionales cercanos.</p>
                        </div>
                        <ServiceMap
                            className="h-[460px]"
                            services={locatedServices}
                            userLocation={professionalLocation}
                            originLabel="Zona de trabajo aproximada del profesional"
                        />
                    </section>
                )}
            </main>
            <ProLinkFooter />
        </div>
    );
}
