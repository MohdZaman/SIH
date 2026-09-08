import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('p-0 overflow-hidden border border-slate-200 shadow-xl sm:rounded-2xl', maxWidth)}>
        {(title || subtitle) && (
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            {title && <DialogTitle className="text-base font-serif font-semibold text-slate-900">{title}</DialogTitle>}
            {subtitle && (
              <DialogDescription className="text-xs text-slate-500 mt-1 font-sans font-normal leading-relaxed">
                {subtitle}
              </DialogDescription>
            )}
          </div>
        )}

        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}