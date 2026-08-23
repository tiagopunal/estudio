import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.94),rgba(59,130,246,0.88))] p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-slate-900/40" />
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    {name}
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-cyan-100/70">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="w-full bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),transparent_40%)] lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-white sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-semibold text-white">{title}</h1>
                        <p className="text-sm text-balance text-slate-300">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
