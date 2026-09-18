import { AccountDrawer } from '@/components/account-drawer';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs: _breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    void _breadcrumbs;
    const { auth } = usePage<SharedData>().props;
    const user = auth.user!;
    const links = [
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'Explorar servicios', href: route('services.browse') },
        { label: 'Mis reservas', href: route('bookings.index') },
        { label: 'Mi billetera', href: route('wallet.show') },
        ...(user.role === 'professional' ? [{ label: 'Servicios', href: route('services.index') }] : []),
    ];
    return (
        <header className="sticky top-0 z-30 flex min-h-20 items-center border-b border-blue-200 bg-white px-5 shadow-[0_3px_18px_rgba(30,64,175,.08)] lg:px-8">
            <Link href={route('dashboard')} className="text-xl font-extrabold text-blue-700">
                ProLink Marketplace
            </Link>
            <nav className="ml-auto hidden items-center gap-1 lg:flex">
                {links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-blue-100 hover:text-blue-800"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="ml-auto lg:ml-4">
                <AccountDrawer user={user} />
            </div>
        </header>
    );
}
