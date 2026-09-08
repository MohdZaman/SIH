import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const VARIANT_MAP = {
  whiteCta: 'whiteCta',
  royal: 'royal',
  emerald: 'emerald',
  outline: 'outline',
  secondary: 'secondary',
  danger: 'destructive',
  ghost: 'ghost',
  ghostDark: 'outline',
  default: 'default',
};

const SIZE_MAP = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  icon: 'icon',
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
  const mappedVariant = VARIANT_MAP[variant] || 'royal';
  const mappedSize = SIZE_MAP[size] || 'md';

  return (
    <ShadcnButton
      type={type}
      variant={mappedVariant}
      size={mappedSize}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        variant === 'danger' && 'bg-rose-600 hover:bg-rose-700 text-white',
        variant === 'ghostDark' && 'bg-transparent text-white border-white/20 hover:bg-white/10',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : IconLeft ? (
        <IconLeft className="h-4 w-4 shrink-0" />
      ) : null}

      {children && <span>{children}</span>}

      {!loading && IconRight && <IconRight className="h-4 w-4 shrink-0" />}
    </ShadcnButton>
  );
}