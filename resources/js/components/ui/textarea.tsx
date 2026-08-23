import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex min-h-[80px] w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-base text-white ring-offset-background placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400/30 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-200 disabled:opacity-100 md:text-sm',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);

Textarea.displayName = 'Textarea';

export { Textarea };
