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
        description: 'Encuentra servicios locales, compara opciones y ve qué está disponible ahora mismo.',
        href: route('marketplace'),
        icon: Compass,
    },
    {
        title: 'Ver reseñas',
        description: 'Consulta opiniones reales para elegir el servicio con mejor experiencia.',
        href: route('reviews.demo'),
        icon: Star,
    },
    {
        title: 'Ajustes de perfil',
        description: 'Actualiza tus datos, seguridad y preferencias visuales del proyecto.',
        href: route('profile.edit'),
        icon: Settings,
    },
];

const highlights = [
    {
        title: 'Reservas rápidas',
        text: 'Unifica tu búsqueda y acción en un flujo simple y visual.',
    },
    {
        title: 'Calificaciones útiles',
        text: 'La comunidad te ayuda a decidir con confianza antes de contratar.',
    },
    {
        title: 'Navegación fluida',
        text: 'Los accesos principales ya están conectados a pantallas reales del proyecto.',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.94),rgba(59,130,246,0.88))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] dark:border-white/10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-cyan-100 backdrop-blur">
                                <Sparkles className="h-4 w-4 text-cyan-200" />
                                Bienvenido de nuevo, {auth.user.name}
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Centro de control</p>
                                <h1 className="text-3xl font-semibold sm:text-4xl">Gestiona tu marketplace local con una experiencia visual limpia y lista para usar.</h1>
                                <p className="max-w-xl text-sm leading-6 text-slate-100/90">
                                    Encuentra servicios, revisa reseñas y accede a tu perfil desde una sola vista con botones grandes y una estética consistente.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                                <Link href={route('marketplace')}>
                                    Explorar servicios
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-full border-white/70 text-white hover:bg-white/10">
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
                                className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_60px_rgba(34,211,238,0.18)] dark:border-white/10 dark:bg-slate-900"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-200">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{action.title}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{action.description}</p>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Flujo principal</p>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Todo preparado para navegar con estilo</h2>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {highlights.map((card) => (
                                <div key={card.title} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.title}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Estado</p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Enfocado en tu experiencia</h2>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            <p>• Los botones principales redirigen a pantallas reales del proyecto.</p>
                            <p>• El marketplace incluye filtros, detalle y estado visual para tu búsqueda.</p>
                            <p>• Las reseñas están preparadas para conectar con tu API de forma limpia.</p>
                            <p>• La navegación del header y sidebar quedó alineada al mismo estilo visual.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
