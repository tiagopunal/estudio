import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset className="min-h-screen bg-[#f8f7fc]" {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main className="flex min-h-screen w-full flex-1 flex-col bg-[#eef0fb]" {...props}>
            {children}
        </main>
    );
}
