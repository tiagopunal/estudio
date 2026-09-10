import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BriefcaseBusiness, CalendarDays, Compass, Plus, ShieldCheck, UserRound } from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const professional = auth.user?.role === 'professional';
    const actions = [
        {
            title: 'Explorar servicios',
            text: 'Buscá profesionales por categoría, precio y ubicación.',
            href: route('services.browse'),
            icon: Compass,
        },
        {
            title: 'Mis reservas',
            text: 'Consultá fechas, estados y detalles de tus contrataciones.',
            href: route('bookings.index'),
            icon: CalendarDays,
        },
        {
            title: professional ? 'Mis servicios' : 'Mi perfil',
            text: professional ? 'Administrá tu catálogo profesional.' : 'Completá tus datos y prepará tu perfil.',
            href: professional ? route('services.index') : route('marketplace-profile.edit'),
            icon: professional ? BriefcaseBusiness : UserRound,
        },
    ];
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />
            <div className="prolink-page">
                <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="prolink-kicker">Panel {professional ? 'profesional' : 'personal'}</p>
                        <h1 className="prolink-title mt-2">¡Hola, {auth.user?.name?.split(' ')[0]}!</h1>
                        <p className="prolink-subtitle">Todo lo que necesitás para moverte dentro de ProLink.</p>
                    </div>
                    <Button asChild className="prolink-primary">
                        <Link href={professional ? route('services.create') : route('services.browse')}>
                            <Plus />
                            {professional ? 'Publicar servicio' : 'Nueva reserva'}
                        </Link>
                    </Button>
                </section>
                <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {actions.map(({ title, text, href, icon: Icon }) => (
                        <Link href={href} key={title} className="prolink-panel group p-6 transition hover:-translate-y-1 hover:border-blue-300">
                            <span className="text-primary flex size-12 items-center justify-center rounded-xl bg-blue-50">
                                <Icon />
                            </span>
                            <h2 className="mt-5 text-lg font-bold">{title}</h2>
                            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{text}</p>
                            <span className="text-primary mt-5 flex items-center text-sm font-semibold">
                                Abrir <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                            </span>
                        </Link>
                    ))}
                </section>
                <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_.8fr]">
                    <div className="prolink-panel p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="prolink-kicker">Primeros pasos</p>
                                <h2 className="mt-2 text-2xl font-bold">Aprovechá mejor tu cuenta</h2>
                            </div>
                            <ShieldCheck className="text-primary size-8" />
                        </div>
                        <div className="mt-7 grid gap-4 md:grid-cols-3">
                            {[
                                { n: '1', t: 'Completá tu perfil', d: 'Agregá datos claros para generar confianza.' },
                                {
                                    n: '2',
                                    t: 'Explorá o publicá',
                                    d: professional ? 'Creá tu primer servicio profesional.' : 'Encontrá el servicio que necesitás.',
                                },
                                { n: '3', t: 'Construí reputación', d: 'Reservá y compartí una reseña honesta.' },
                            ].map((x) => (
                                <div key={x.n} className="rounded-xl bg-[#f8f7fc] p-5">
                                    <span className="text-primary font-bold">{x.n.padStart(2, '0')}</span>
                                    <p className="mt-3 font-bold">{x.t}</p>
                                    <p className="mt-2 text-sm text-slate-600">{x.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <aside className="bg-primary rounded-2xl p-7 text-white shadow-lg">
                        <p className="text-sm font-bold tracking-widest text-blue-100 uppercase">Consejo ProLink</p>
                        <h2 className="mt-4 text-2xl font-bold">Un perfil completo destaca más.</h2>
                        <p className="mt-3 leading-7 text-blue-50">
                            Actualizá tu descripción, oficio, experiencia y ubicación para que otros usuarios sepan quién sos.
                        </p>
                        <Link
                            href={route('marketplace-profile.edit')}
                            className="text-primary mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-semibold"
                        >
                            Mejorar mi perfil
                        </Link>
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
