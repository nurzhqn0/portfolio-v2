import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'bg-clay text-white shadow-glow hover:bg-[#f06a2a] hover:shadow-neon',
        variant === 'secondary' && 'bg-ink text-white hover:bg-brand-navy',
        variant === 'ghost' && 'bg-white/70 text-ink ring-1 ring-ink/10 hover:bg-white hover:ring-clay/30',
        variant === 'danger' && 'bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100',
        className,
      )}
      {...props}
    />
  );
}
