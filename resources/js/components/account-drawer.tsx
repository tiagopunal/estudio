import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { BriefcaseBusiness, CalendarDays, Compass, House, LogOut, Settings, Star, UserRound, X } from 'lucide-react';
import { useState } from 'react';

export function AccountDrawer({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const avatar = user.profile?.avatar ? `/storage/${user.profile.avatar}` : user.avatar;
    const links = [
        { label: 'Dashboard', href: route('dashboard'), icon: House },
        { label: 'Explorar servicios', href: route('services.browse'), icon: Compass },
        { label: 'Mis reservas', href: route('bookings.index'), icon: CalendarDays },
        { label: 'Reseñas', href: route('reviews.index'), icon: Star },
        ...(user.role === 'professional' ? [{ label: 'Mis servicios', href: route('services.index'), icon: BriefcaseBusiness }] : []),
        { label: 'Mi perfil', href: route('marketplace-profile.edit'), icon: UserRound },
    ];
    const close = () => setOpen(false);
    const avatarContent = avatar ? <img src={avatar} alt="" className="size-full object-cover" /> : user.name.charAt(0).toUpperCase();

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-full border-2 border-blue-200 bg-blue-50 p-1.5 pr-2 transition hover:border-blue-600 hover:bg-blue-100 sm:pr-3"
                aria-label="Abrir menú de usuario"
                aria-expanded={open}
            >
                <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-blue-700 font-bold text-white">
                    {avatarContent}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-bold text-slate-900 sm:block">{user.name}</span>
            </button>
            <button
                aria-label="Cerrar menú"
                onClick={close}
                className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            />
            <aside
                className={`fixed inset-y-3 right-3 z-50 flex w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px] border border-blue-200 bg-white shadow-[-20px_0_60px_rgba(15,23,42,.22)] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-[calc(100%+24px)]'}`}
                aria-hidden={!open}
            >
                <div className="flex items-center gap-4 border-b border-blue-100 bg-blue-700 p-6 text-white">
                    <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/60 bg-white/15 text-xl font-bold">
                        {avatarContent}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold">{user.name}</p>
                        <p className="text-sm text-blue-100">{user.role === 'professional' ? 'Cuenta profesional' : 'Cuenta cliente'}</p>
                    </div>
                    <button onClick={close} className="rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Cerrar">
                        <X />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {links.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={close}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-slate-800 transition hover:bg-blue-100 hover:text-blue-800"
                        >
                            <Icon className="size-5 text-blue-700" />
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="space-y-2 border-t border-blue-100 p-4">
                    <Link
                        href={route('profile.edit')}
                        onClick={close}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-slate-800 hover:bg-slate-100"
                    >
                        <Settings className="size-5" />
                        Configuración
                    </Link>
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-bold text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="size-5" />
                        Cerrar sesión
                    </Link>
                </div>
            </aside>
        </>
    );
}
