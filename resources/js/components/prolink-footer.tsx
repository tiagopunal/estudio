import { Link } from '@inertiajs/react';

export function ProLinkFooter() {
    return (
        <footer className="border-border border-t bg-[#f0f1fb]">
            <div className="mx-auto grid max-w-[1320px] gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
                <div>
                    <p className="text-xl font-bold text-slate-950">ProLink</p>
                    <p className="mt-3 max-w-xs text-sm text-slate-600">Conectamos clientes con profesionales locales de confianza.</p>
                </div>
                <div>
                    <p className="font-semibold">Plataforma</p>
                    <Link href={route('services.browse')} className="hover:text-primary mt-3 block text-sm text-slate-600">
                        Explorar servicios
                    </Link>
                    <Link href={route('marketplace')} className="hover:text-primary mt-2 block text-sm text-slate-600">
                        Cómo funciona
                    </Link>
                </div>
                <div>
                    <p className="font-semibold">Cuenta</p>
                    <Link href={route('profile.edit')} className="hover:text-primary mt-3 block text-sm text-slate-600">
                        Configuración
                    </Link>
                    <Link href={route('marketplace-profile.edit')} className="hover:text-primary mt-2 block text-sm text-slate-600">
                        Perfil profesional
                    </Link>
                </div>
                <div>
                    <p className="font-semibold">Proyecto</p>
                    <p className="mt-3 text-sm text-slate-600">Marketplace de Servicios Locales</p>
                    <p className="mt-2 text-sm text-slate-500">© 2026 ProLink Marketplace</p>
                </div>
            </div>
        </footer>
    );
}
