import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BriefcaseBusiness, CalendarDays, Compass, House, PlusCircle, Star, UserRound } from 'lucide-react';
import AppLogo from './app-logo';

const publicNavItems: NavItem[] = [
    { title: 'Inicio', url: '/dashboard', icon: House },
    { title: 'Explorar servicios', url: '/services/browse', icon: Compass },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const mainNavItems: NavItem[] = auth.user
        ? [
              ...publicNavItems,
              { title: 'Mis reservas', url: '/bookings', icon: CalendarDays },
              { title: 'Opiniones y reseñas', url: '/reviews', icon: Star },
              { title: 'Mi perfil profesional', url: '/my-profile', icon: UserRound },
              ...(auth.user.role === 'professional'
                  ? [
                        { title: 'Mis servicios', url: '/services', icon: BriefcaseBusiness },
                        { title: 'Publicar servicio', url: '/services/create', icon: PlusCircle },
                    ]
                  : []),
          ]
        : publicNavItems.filter((item) => item.url !== '/dashboard');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={auth.user ? '/dashboard' : '/'} prefetch><AppLogo /></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="mt-2"><NavUser /></div>
            </SidebarHeader>
            <SidebarContent><NavMain items={mainNavItems} /></SidebarContent>
            <SidebarFooter>
                <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Encontrá, reservá y ofrecé servicios cerca tuyo.</p>
            </SidebarFooter>
        </Sidebar>
    );
}
