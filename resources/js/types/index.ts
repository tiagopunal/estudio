import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Review {
    id: number;
    user_id: number;
    service_id: number;
    booking_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    service?: Service;
    booking?: Booking;
}

export interface Service {
    id: number;
    user_id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    latitude: number;
    longitude: number;
    average_rating: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Booking {
    id: number;
    user_id: number;
    service_id: number;
    date: string;
    status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
