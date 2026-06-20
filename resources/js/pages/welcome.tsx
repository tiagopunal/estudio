import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
    {
        title: 'Busca servicios rápidos',
        description: 'Filtra profesionales por categoría, ubicación y disponibilidad para empezar tu búsqueda al instante.',
    },
    {
        title: 'Reserva con confianza',
        description: 'Revisa perfiles destacados, calificaciones y deja listo el flujo para agendar tu próximo servicio.',
    },
    {
        title: 'Gestiona tu día',
        description: 'Navega de forma clara entre marketplace, reseñas y dashboard para mantener todo centralizado.',
    },
];

const stats = [
    { label: 'Servicios activos', value: '120+' },
    { label: 'Tiempo de reserva', value: '24h' },
    { label: 'Satisfacción', value: '98%' },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Grupo4 Marketplace">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),transparent_20%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#111827_100%)] text-white">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Grupo4</p>
                        <p className="mt-2 text-lg font-semibold text-white">Marketplace para servicios confiables</p>
                    </div>
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/60 hover:bg-white/5"
                            >
                                Ir al dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/60 hover:bg-white/5"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-14 lg:flex-row lg:items-center lg:px-8">
                    <section className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">
                            <Sparkles className="h-4 w-4" />
                            Nuevo catálogo de servicios
                        </div>
                        <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
                            Encuentra expertos, agenda tu servicio y deja una experiencia premium para tu comunidad.
                        </h1>
                        <p className="mt-5 text-lg leading-8 text-slate-200">
                            Un marketplace moderno con navegación clara, botones grandes y una estética fresca que mantiene todo enfocado en el usuario.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={route('marketplace')}
                                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                            >
                                Explorar marketplace
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href={route('reviews.demo')}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-200/70 hover:bg-white/5"
                            >
                                Ver reseñas demo
                            </Link>
                        </div>

                        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
                            {stats.map((item) => (
                                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                    <dt className="text-sm text-slate-200">{item.label}</dt>
                                    <dd className="mt-2 text-2xl font-semibold text-white">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section className="flex-1">
                        <div className="rounded-[28px] border border-cyan-300/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.9),rgba(16,185,129,0.18))] p-6 shadow-[0_28px_80px_rgba(34,211,238,0.16)]">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {features.map((feature) => (
                                    <article key={feature.title} className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                                        <p className="text-sm font-semibold text-cyan-200">{feature.title}</p>
                                        <p className="mt-3 text-sm leading-6 text-slate-200">{feature.description}</p>
                                    </article>
                                ))}
                            </div>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                                <div className="flex items-center gap-2 text-sm text-slate-200">
                                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                    Diseño pensado para seguir creciendo
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Link
                                        href={route('marketplace')}
                                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                                    >
                                        Ir al marketplace
                                    </Link>
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/60"
                                        >
                                            Ver dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/60"
                                        >
                                            Iniciar sesión
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
