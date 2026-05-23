import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/review-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Review } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, MessageSquareText, ShieldCheck, Sparkles, Star } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reseñas',
        href: '/reviews-demo',
    },
];

const demoReviews: Review[] = [
    {
        id: 1,
        user_id: 10,
        service_id: 1,
        booking_id: 101,
        rating: 5,
        comment: 'Muy profesional, puntual y con una atención impecable. Lo volvería a contratar.',
        created_at: '2026-05-10T10:00:00.000Z',
        updated_at: '2026-05-10T10:00:00.000Z',
        user: {
            id: 10,
            name: 'María Gómez',
            email: 'maria@example.com',
            email_verified_at: null,
            created_at: '2026-05-01T00:00:00.000Z',
            updated_at: '2026-05-01T00:00:00.000Z',
        },
        service: {
            id: 1,
            user_id: 2,
            title: 'Limpieza residencial express',
            description: 'Limpieza profunda y agenda flexible.',
            price: 28,
            category: 'Hogar',
            latitude: -34.6,
            longitude: -58.4,
            average_rating: 4.9,
            created_at: '2026-05-01T00:00:00.000Z',
            updated_at: '2026-05-01T00:00:00.000Z',
        },
        booking: {
            id: 101,
            user_id: 10,
            service_id: 1,
            date: '2026-05-12',
            status: 'completada',
            created_at: '2026-05-01T00:00:00.000Z',
            updated_at: '2026-05-01T00:00:00.000Z',
        },
    },
    {
        id: 2,
        user_id: 11,
        service_id: 2,
        booking_id: 102,
        rating: 4,
        comment: 'Excelente método de enseñanza y buena experiencia general. Muy recomendable.',
        created_at: '2026-05-09T08:00:00.000Z',
        updated_at: '2026-05-09T08:00:00.000Z',
        user: {
            id: 11,
            name: 'José Ramírez',
            email: 'jose@example.com',
            email_verified_at: null,
            created_at: '2026-05-01T00:00:00.000Z',
            updated_at: '2026-05-01T00:00:00.000Z',
        },
        service: {
            id: 2,
            user_id: 3,
            title: 'Clases de inglés para adultos',
            description: 'Sesiones prácticas de conversación.',
            price: 22,
            category: 'Educación',
            latitude: -34.6,
            longitude: -58.5,
            average_rating: 4.8,
            created_at: '2026-05-01T00:00:00.000Z',
            updated_at: '2026-05-01T00:00:00.000Z',
        },
        booking: {
            id: 102,
            user_id: 11,
            service_id: 2,
            date: '2026-05-11',
            status: 'completada',
            created_at: '2026-05-01T00:00:00.000Z',
            updated_at: '2026-05-01T00:00:00.000Z',
        },
    },
];

export default function ReviewsDemo() {
    const { auth } = usePage().props as { auth: { user?: { name?: string } } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reseñas" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="overflow-hidden rounded-[28px] border border-amber-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(120,53,15,0.9),rgba(245,158,11,0.8))] p-6 text-white shadow-[0_28px_80px_rgba(120,53,15,0.22)] dark:border-white/10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Reseñas destacadas</p>
                            <h1 className="text-3xl font-semibold sm:text-4xl">Descubre qué dice la comunidad sobre cada servicio y toma una decisión con confianza.</h1>
                            <p className="text-sm leading-6 text-slate-100/90">
                                Esta vista está pensada para mostrar experiencias reales, potencias la confianza del usuario y deja el flujo listo para conectar con tu API.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-amber-300 text-slate-950 hover:bg-amber-200">
                                <Link href={route('marketplace')}>
                                    Explorar marketplace
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-full border-white/70 text-white hover:bg-white/10">
                                <Link href={route('login')}>Iniciar sesión para opinar</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-amber-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Resumen de confianza</h2>
                        </div>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            <p>• {demoReviews.length} reseñas de ejemplo cargadas en la interfaz.</p>
                            <p>• El botón principal te lleva al marketplace para seguir explorando.</p>
                            <p>• El layout está listo para conectarse con la API cuando quieras ampliar el flujo real.</p>
                        </div>

                        <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Usuario activo</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {auth?.user?.name ? `Ahora estás navegando como ${auth.user.name}.` : 'Aún no has iniciado sesión, pero puedes revisar la experiencia pública.'}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                                <ShieldCheck className="h-4 w-4" />
                                Flujo de autenticación listo
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <MessageSquareText className="h-5 w-5 text-slate-500" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Opiniones recientes</h2>
                            </div>
                            <div className="mt-4 space-y-4">
                                {demoReviews.map((review) => (
                                    <ReviewCard key={review.id} review={review} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
