import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { ArrowRight, Monitor, Moon, Sparkles, Sun } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Apariencia',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Apariencia" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-[24px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(6,78,59,0.92),rgba(34,211,238,0.85))] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Apariencia</p>
                                <h1 className="text-2xl font-semibold sm:text-3xl">Elige cómo quieres ver la plataforma.</h1>
                                <p className="text-sm leading-6 text-slate-100/90">Cambia el modo de visualización para que la experiencia se sienta más cómoda y alineada con tu estilo.</p>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm">
                                <Sparkles className="h-4 w-4" />
                                Estilo marketplace
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-emerald-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Modo de visualización</h2>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Selecciona el tema que mejor te funcione para navegar por marketplace, reservas y perfil.</p>

                        <div className="mt-5 rounded-[20px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
                            <AppearanceTabs />
                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <span className="inline-flex items-center gap-2"><Sun className="h-4 w-4 text-amber-500" />Claro</span>
                                <span className="inline-flex items-center gap-2"><Moon className="h-4 w-4 text-cyan-500" />Oscuro</span>
                                <span className="inline-flex items-center gap-2"><Monitor className="h-4 w-4 text-emerald-500" />Sistema</span>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                                Guardar preferencia
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
