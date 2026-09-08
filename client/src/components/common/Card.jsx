import React from 'react';
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Card({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  variant = 'surface', // 'surface' (light) or 'dark' (glass/navy)
  className = '',
  bodyClassName = 'p-5',
  headerClassName = 'px-5 py-4 border-b',
  ...props
}) {
  const isDark = variant === 'dark';

  return (
    <ShadcnCard
      className={cn(
        'transition-all duration-200',
        isDark
          ? 'bg-brand-navy/95 backdrop-blur-md border-white/10 text-white shadow-xl'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs',
        className
      )}
      {...props}
    >
      {(title || action || Icon) && (
        <div
          className={cn(
            'flex items-center justify-between',
            headerClassName,
            isDark ? 'border-white/10' : 'border-slate-100'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div
                className={cn(
                  'p-2 rounded-xl shrink-0',
                  isDark ? 'bg-white/10 text-white' : 'bg-emerald-50 text-emerald-700'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <CardTitle
                  className={cn(
                    'text-base font-serif font-semibold truncate',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <CardDescription
                  className={cn('truncate', isDark ? 'text-slate-400' : 'text-slate-500')}
                >
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </ShadcnCard>
  );
}

export {
  ShadcnCard as UiCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
};