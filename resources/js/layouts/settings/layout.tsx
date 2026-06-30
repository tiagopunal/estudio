import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Settings2, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        url: '/settings/profile',
        icon: UserRound,
    },
    {
        title: 'Contraseña',
        url: '/settings/password',
        icon: ShieldCheck,
    },
    {
        title: 'Apariencia',
        url: '/settings/appearance',
        icon: Sparkles,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = window.location.pathname;

    return (
        <div className="flex flex-col gap-6 rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900 md:p-6">
            <div className="flex flex-col gap-4 rounded-[20px] border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/40 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <Settings2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Configuración de cuenta</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Gestiona tu perfil, seguridad y apariencia desde un solo lugar.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                <aside className="w-full lg:w-56">
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950">
                        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Secciones</p>
                        <nav className="flex flex-col gap-2">
                            {sidebarNavItems.map((item) => {
                                const Icon = item.icon;
                                const active = currentPath === item.url;

                                return (
                                    <Button
                                        key={item.url}
                                        size="sm"
                                        asChild
                                        className={cn('w-full justify-start rounded-full px-3', {
                                            'bg-slate-950 text-white hover:bg-slate-800': active,
                                            'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800': !active,
                                        })}
                                    >
                                        <Link href={item.url} prefetch>
                                            {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                                            {item.title}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <div className="flex-1">
                    <section className="space-y-6">{children}</section>
                </div>
            </div>
        </div>
    );
}
