import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="border-b border-slate-200/70 flex h-16 shrink-0 items-center gap-2 px-6 transition-[width,height] ease-linear dark:border-white/10 md:px-4">
            <SidebarTrigger className="-ml-2" aria-label="Abrir o cerrar navegación" />
            <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />
            <div className="flex min-w-0 items-center gap-2">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
