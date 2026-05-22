import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Compass, Settings, ShieldCheck, Sparkles, Star } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const quickActions = [
    {
        title: 'Explorar marketplace',
        description: 'Encuentra servicios locales y revisa opciones listas para reservar.',
        href: route('marketplace'),
        icon: Compass,
    },
    {
        title: 'Ver reseñas',
        description: 'Consulta experiencias de otros usuarios y descubre lo mejor calificado.',
        href: route('reviews.demo'),
        icon: Star,
    },
    {
        title: 'Ajustes de perfil',
        description: 'Actualiza tu información, seguridad y preferencias visuales.',
        href: route('profile.edit'),
        icon: Settings,
    },
];

const activityCards = [
    {
        title: 'Reservas rápidas',
        text: 'Revisa tus servicios más recientes y conserva tu historial en un solo lugar.',
    },
    {
        title: 'Calificaciones útiles',
        text: 'Las reseñas te ayudan a comparar calidad, tiempos y atención antes de reservar.',
    },
    {
        title: 'Experiencia lista para usar',
        text: 'Los botones principales ya navegan a pantallas reales del proyecto.',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="rounded-2xl border border-sidebar-border/70 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 dark:border-sidebar-border dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-900/80 dark:text-slate-200">
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                Bienvenido de nuevo, {auth.user.name}
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Centro de control</p>
                                <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Gestiona tu marketplace local con una sola vista.</h1>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                    Desde aquí puedes explorar servicios, revisar calificaciones y acceder a tu información personal sin perder tiempo.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href={route('marketplace')}>
                                    Explorar servicios
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={route('appearance')}>Cambiar apariencia</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="rounded-2xl border border-sidebar-border/70 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:bg-slate-900"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{action.title}</h2>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{action.description}</p>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Flujo principal</p>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Lo que puedes hacer ahora</h2>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {activityCards.map((card) => (
                                <div key={card.title} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.title}</p>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 dark:bg-slate-900">
                        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Estado</p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Todo listo para navegar</h2>
                        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                            <li>• Los botones principales redirigen a pantallas reales.</li>
                            <li>• El marketplace cuenta con filtros y acciones locales.</li>
                            <li>• Las reseñas muestran una experiencia visual lista para conectarse a tu API.</li>
                            <li>• La navegación del sidebar y header está alineada con el proyecto.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
