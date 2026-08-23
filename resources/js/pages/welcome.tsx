import { ProLinkFooter } from '@/components/prolink-footer';
import { ProLinkHeader } from '@/components/prolink-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    GraduationCap,
    HeartPulse,
    Home,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Wrench,
} from 'lucide-react';

const categories = [
    { name: 'Hogar', icon: Home },
    { name: 'Reparaciones', icon: Wrench },
    { name: 'Educación', icon: GraduationCap },
    { name: 'Bienestar', icon: HeartPulse },
    { name: 'Profesionales', icon: BriefcaseBusiness },
];
const steps = [
    { n: '01', title: 'Buscá y compará', text: 'Explorá servicios, precios y opiniones reales.' },
    { n: '02', title: 'Reservá', text: 'Elegí el servicio que necesitás y coordiná la fecha.' },
    { n: '03', title: 'Calificá', text: 'Compartí tu experiencia con la comunidad.' },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    return (
        <div className="min-h-screen bg-[#f8f7fc]">
            <Head title="ProLink Marketplace" />
            <ProLinkHeader />
            <main>
                <section className="prolink-page grid min-h-[620px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
                    <div>
                        <div className="prolink-kicker inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2">
                            <ShieldCheck className="size-4" /> Profesionales locales de confianza
                        </div>
                        <h1 className="mt-6 text-5xl leading-[1.04] font-bold tracking-[-.05em] text-slate-950 sm:text-6xl">
                            Encontrá el <span className="text-primary">talento local</span> perfecto para cada tarea.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            Desde reparaciones para el hogar hasta clases particulares. Compará profesionales, reservá y calificá desde un solo lugar.
                        </p>
                        <form action="/services/browse" className="prolink-panel mt-8 flex flex-col gap-2 p-2 sm:flex-row">
                            <div className="flex flex-1 items-center gap-3 px-3">
                                <Search className="size-5 text-slate-400" />
                                <input name="search" className="min-h-12 w-full bg-transparent" placeholder="¿Qué servicio estás buscando?" />
                            </div>
                            <button className="prolink-primary sm:min-w-36">Buscar</button>
                        </form>
                        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-emerald-500" /> Perfiles completos
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-emerald-500" /> Reseñas verificadas
                            </span>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500 p-8 text-white shadow-[0_30px_80px_rgba(0,75,210,.22)] sm:p-12">
                        <Sparkles className="absolute top-8 right-8 size-12 text-blue-200" />
                        <p className="text-sm font-bold tracking-[.18em] text-blue-100 uppercase">Comunidad ProLink</p>
                        <h2 className="mt-5 text-4xl leading-tight font-bold">Tu próximo profesional está más cerca de lo que pensás.</h2>
                        <p className="mt-5 text-blue-50">Publicá, reservá y construí reputación con una experiencia simple y transparente.</p>
                        <div className="mt-12 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white/12 p-5 backdrop-blur">
                                <p className="text-3xl font-bold">5★</p>
                                <p className="mt-1 text-sm text-blue-100">Sistema de reseñas</p>
                            </div>
                            <div className="rounded-2xl bg-white/12 p-5 backdrop-blur">
                                <p className="text-3xl font-bold">24/7</p>
                                <p className="mt-1 text-sm text-blue-100">Catálogo disponible</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="border-border border-y bg-white">
                    <div className="prolink-page">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="prolink-kicker">Explorá por categoría</p>
                                <h2 className="mt-2 text-3xl font-bold">Servicios para cada necesidad</h2>
                            </div>
                            <Link href={route('services.browse')} className="text-primary hidden font-semibold sm:flex">
                                Ver todos <ArrowRight className="ml-2 size-5" />
                            </Link>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
                            {categories.map(({ name, icon: Icon }) => (
                                <Link
                                    key={name}
                                    href={`/services/browse?category=${encodeURIComponent(name)}`}
                                    className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 text-center text-slate-950 shadow-sm transition hover:-translate-y-1 hover:border-blue-600 hover:bg-blue-100"
                                >
                                    <span className="text-primary mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50">
                                        <Icon />
                                    </span>
                                    <p className="mt-4 font-extrabold text-blue-950">{name}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="como-funciona" className="prolink-page scroll-mt-24">
                    <div className="text-center">
                        <p className="prolink-kicker">Cómo funciona</p>
                        <h2 className="mt-2 text-3xl font-bold">Conectarse nunca fue tan simple</h2>
                    </div>
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {steps.map((step) => (
                            <article key={step.n} className="prolink-panel p-7">
                                <span className="text-3xl font-bold text-blue-200">{step.n}</span>
                                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                                <p className="mt-2 text-slate-600">{step.text}</p>
                            </article>
                        ))}
                    </div>
                    <div className="mt-12 flex flex-col items-center rounded-3xl bg-slate-950 p-8 text-center text-white sm:p-12">
                        <Star className="size-8 fill-blue-400 text-blue-400" />
                        <h2 className="mt-4 text-3xl font-bold">¿Ofrecés un servicio?</h2>
                        <p className="mt-3 max-w-xl text-slate-300">Creá tu perfil profesional, publicá tus servicios y empezá a recibir reservas.</p>
                        <Link
                            href={auth.user ? route('marketplace-profile.edit') : route('register')}
                            className="prolink-primary text-primary mt-6 bg-white hover:bg-blue-50"
                        >
                            Comenzar ahora
                        </Link>
                    </div>
                </section>
            </main>
            <ProLinkFooter />
        </div>
    );
}
