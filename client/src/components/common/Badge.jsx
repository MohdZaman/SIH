import React from 'react';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const VARIANT_MAP = {
  success: 'emerald',
  compliant: 'emerald',
  emerald: 'emerald',
  warning: 'amber',
  incomplete: 'amber',
  amber: 'amber',
  danger: 'rose',
  critical: 'rose',
  superseded: 'rose',
  rose: 'rose',
  red: 'rose',
  info: 'blue',
  blue: 'blue',
  indigo: 'purple',
  neutral: 'outline',
  default: 'default',
  dark: 'secondary',
};

const DOT_COLORS = {
  success: 'bg-emerald-500',
  compliant: 'bg-emerald-500',
  emerald: 'bg-emerald-500',
  warning: 'bg-amber-500',
  amber: 'bg-amber-500',
  critical: 'bg-rose-500',
  danger: 'bg-rose-500',
  rose: 'bg-rose-500',
  red: 'bg-rose-500',
  info: 'bg-blue-500',
  blue: 'bg-blue-500',
  neutral: 'bg-slate-400',
  dark: 'bg-slate-300',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  const mappedVariant = VARIANT_MAP[variant] || 'outline';
  const dotColor = DOT_COLORS[variant] || 'bg-slate-400';

  const sizeClass = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-xs',
  }[size] || 'px-2.5 py-0.5 text-xs';

  return (
    <ShadcnBadge
      variant={mappedVariant}
      className={cn('inline-flex items-center gap-1.5 font-medium shadow-2xs', sizeClass, className)}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />}
      {children}
    </ShadcnBadge>
  );
}