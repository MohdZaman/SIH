import React from 'react';

const VARIANTS = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-600/10',
  compliant: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-600/10',
  emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  
  warning: 'bg-amber-50 text-amber-800 border-amber-200/60 ring-amber-600/10',
  incomplete: 'bg-amber-50 text-amber-800 border-amber-200/60 ring-amber-600/10',
  amber: 'bg-amber-500/10 text-amber-700 border-amber-500/20',

  danger: 'bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-600/10',
  critical: 'bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-600/10',
  superseded: 'bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-600/10',
  rose: 'bg-rose-500/10 text-rose-600 border-rose-500/20',

  info: 'bg-blue-50 text-blue-700 border-blue-200/60 ring-blue-600/10',
  blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  
  indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',

  neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10',
  dark: 'bg-[#1E293B] text-slate-200 border-slate-700',
};

const DOT_COLORS = {
  success: 'bg-emerald-500',
  compliant: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-rose-500',
  danger: 'bg-rose-500',
  superseded: 'bg-rose-500',
  info: 'bg-blue-500',
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
  const variantClass = VARIANTS[variant] || VARIANTS.neutral;
  const dotColor = DOT_COLORS[variant] || DOT_COLORS.neutral;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  }[size] || 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sizeClasses} ${variantClass} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}
