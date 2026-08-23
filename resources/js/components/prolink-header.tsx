import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function ProLinkHeader() {
    const { auth } = usePage<SharedData>().props;
    const [open, setOpen] = useState(false);
    const links = [
        { label: 'Inicio', href: route('home') },
        { label: 'Explorar servicios', href: route('services.browse') },
        { label: 'Cómo funciona', href: `${route('home')}#como-funciona` },
    ];

    if (auth.user) return <AppSidebarHeader />;

    return (
        <header className="sticky top-0 z-40 border-b border-blue-200 bg-white shadow-sm">
            <div className="mx-auto flex min-h-20 max-w-[1440px] items-center gap-5 px-5 lg:px-8">
                <Link href={route('home')} className="shrink-0 text-xl font-extrabold text-blue-700 sm:text-2xl">
                    ProLink Marketplace
                </Link>
                <nav className="ml-auto hidden items-center gap-5 lg:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="hidden items-center gap-2 lg:flex">
                    <Link href={route('login')} className="rounded-lg px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">
                        Iniciar sesión
                    </Link>
                    <Link href={route('register')} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
                        Registrarse
                    </Link>
                </div>
                <button
                    className="ml-auto rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 lg:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Abrir menú"
                >
                    {open ? <X /> : <Menu />}
                </button>
            </div>
            {open && (
                <nav className="border-t border-blue-100 bg-white p-4 lg:hidden">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-3 font-bold text-slate-800 hover:bg-blue-50"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href={route('login')} className="prolink-primary mt-3 w-full">
                        Iniciar sesión
                    </Link>
                    <Link
                        href={route('register')}
                        className="mt-2 flex min-h-11 items-center justify-center rounded-lg border-2 border-blue-700 font-bold text-blue-700"
                    >
                        Registrarse
                    </Link>
                </nav>
            )}
        </header>
    );
}
