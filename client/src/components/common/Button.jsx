import React from 'react';

const VARIANTS = {
  // Dark Hero Primary (Solid white background with black text)
  whiteCta: 'bg-white text-black hover:bg-neutral-100 font-medium shadow-sm border border-neutral-200',
  
  // Emerald Primary (Workspace default)
  royal: 'bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-sm border border-transparent',
  emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-sm border border-transparent',
  
  // Secondary Ghost
  ghostDark: 'bg-transparent text-white border border-white/20 hover:bg-white/10 backdrop-blur-sm font-medium',
  
  // Secondary Outline for Light Workspace
  outline: 'bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50 shadow-sm font-medium',
  
  // Soft Slate button
  secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-200 font-medium',

  // Danger
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm font-medium',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
};

export default function Button({
  children,
  variant = 'royal',
  size = 'md',
  iconLeft: IconLeft,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.royal;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : IconLeft ? (
        <IconLeft className="h-4 w-4 shrink-0" />
      ) : null}

      <span>{children}</span>

      {!loading && IconRight && <IconRight className="h-4 w-4 shrink-0" />}
    </button>
  );
}
