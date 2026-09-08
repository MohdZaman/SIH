import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200/90 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl font-sans text-xs',
          description: 'group-[.toast]:text-slate-500 text-xs font-normal',
          actionButton:
            'group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 text-xs font-medium rounded-lg px-3 py-1.5',
          cancelButton:
            'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 text-xs font-medium rounded-lg px-3 py-1.5',
          success:
            'group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-950 group-[.toaster]:border-emerald-200 group-[.toaster]:shadow-emerald-500/10',
          error:
            'group-[.toaster]:bg-rose-50 group-[.toaster]:text-rose-950 group-[.toaster]:border-rose-200 group-[.toaster]:shadow-rose-500/10',
          warning:
            'group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-950 group-[.toaster]:border-amber-200 group-[.toaster]:shadow-amber-500/10',
          info:
            'group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-950 group-[.toaster]:border-blue-200 group-[.toaster]:shadow-blue-500/10',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
export default Toaster;