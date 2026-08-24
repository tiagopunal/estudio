import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, Compass, HelpCircle, House, LogOut, Settings, Star, UserRound } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const items: NavItem[] = [
        { title: 'Inicio', url: '/', icon: House },
        { title: 'Explorar servicios', url: '/services/browse', icon: Compass },
        { title: 'Mis reservas', url: '/bookings', icon: CalendarDays },
        { title: 'Reseñas', url: '/reviews', icon: Star },
        { title: 'Mi perfil', url: '/my-profile', icon: UserRound },
    ];
    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-border border-r bg-[#f8f7fc]">
            <SidebarHeader className="border-border gap-4 border-b p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarHeader>
            <SidebarContent className="px-2 py-5">
                <NavMain items={items} />
            </SidebarContent>
            <SidebarFooter className="border-border border-t p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={route('profile.edit')}>
                                <Settings />
                                <span>Configuración</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <HelpCircle />
                            <span>Ayuda</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {auth.user && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild className="text-red-600">
                                <Link method="post" href={route('logout')} as="button">
                                    <LogOut />
                                    <span>Cerrar sesión</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
