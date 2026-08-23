import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col bg-[#f8f7fc] px-5 py-6">
            <div className="flex items-center justify-between">
                <Link href={route('home')} className="text-primary text-xl font-bold sm:text-2xl">
                    ProLink Marketplace
                </Link>
                <Link href={route('home')} className="hover:text-primary text-sm font-medium text-slate-600">
                    Volver al inicio
                </Link>
            </div>
            <div className="mx-auto my-auto w-full max-w-lg py-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="space-y-2 text-center">
                            <p className="text-primary text-2xl font-bold">ProLink Marketplace</p>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
                            <p className="text-center text-base text-slate-600">{description}</p>
                        </div>
                    </div>
                    <div className="border-border rounded-2xl border bg-white p-6 text-slate-800 shadow-[0_18px_55px_rgba(20,35,80,0.08)] sm:p-8 [&_label]:text-slate-800 [&_p]:text-slate-500">
                        {children}
                    </div>
                </div>
            </div>
            <p className="text-center text-xs text-slate-500">© 2026 ProLink Marketplace · Calidad y confianza local.</p>
        </div>
    );
}
