import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
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
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: 'client' | 'professional';
    profile?: MarketplaceProfile;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface MarketplaceProfile {
    id: number;
    user_id: number;
    full_name: string;
    description?: string | null;
    phone?: string | null;
    location?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    avatar?: string | null;
    profession?: string | null;
    experience_years: number;
    skills?: string | null;
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
    location?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
    average_rating: number;
    created_at: string;
    updated_at: string;
    user?: User;
    [key: string]: unknown;
}

export interface Booking {
    id: number;
    user_id: number;
    service_id: number;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    updated_at: string;
    service?: Service;
    user?: User;
    [key: string]: unknown;
}
