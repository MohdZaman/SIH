import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ variant = 'light' }) {
  const isDark = variant === 'dark';

  return (
    <footer
      className={`py-6 px-6 text-xs transition-colors ${
        isDark
          ? 'bg-brand-dark/95 border-t border-slate-800/80 text-slate-400'
          : 'bg-white border-t border-slate-200 text-slate-500'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>
            Protected by NIC GovTech Standards • Bureau of Indian Standards (BIS) Verified Repo
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>SIH PS 26108 Compliant</span>
          <span>•</span>
          <span>GeM 4.0 API Compatible</span>
          <span>•</span>
          <span>DPIIT Statutory QCO Engine</span>
        </div>
      </div>
    </footer>
  );
}