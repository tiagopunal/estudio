import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),transparent_20%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#111827_100%)] flex flex-col items-center justify-center gap-6 p-6 md:p-10 text-white">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold text-white">{title}</h1>
                            <p className="text-center text-sm text-slate-300">{description}</p>
                        </div>
                    </div>
                    <div className="rounded-[24px] border border-cyan-300/20 bg-slate-950/40 backdrop-blur p-8 shadow-[0_28px_80px_rgba(34,211,238,0.08)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
