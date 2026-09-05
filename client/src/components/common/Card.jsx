import React from 'react';

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

  const baseClasses = isDark
    ? 'bg-brand-navy/90 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-xl'
    : 'bg-white border border-brand-border text-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200';

  const headerBorder = isDark ? 'border-white/10' : 'border-slate-100';

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {(title || action || Icon) && (
        <div className={`flex items-center justify-between ${headerClassName} ${headerBorder}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  isDark ? 'bg-white/10 text-white' : 'bg-blue-50 text-brand-blue'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className={`text-base font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={`text-xs truncate ${isDark ? 'text-brand-slate' : 'text-slate-500'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
