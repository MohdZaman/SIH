import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search IS code, standard number, tender...',
  onClear,
  variant = 'light', // 'light' | 'dark'
  shortcut = '/',
  className = '',
  ...props
}) {
  const isDark = variant === 'dark';

  const containerClasses = isDark
    ? 'bg-brand-input border border-slate-700/60 text-white placeholder-brand-muted focus-within:border-brand-blue/80 focus-within:ring-1 focus-within:ring-brand-blue/50'
    : 'bg-white border border-brand-border text-slate-900 placeholder-slate-400 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/30';

  return (
    <div
      className={`relative flex items-center rounded-lg px-3 py-1.5 transition-all duration-150 ${containerClasses} ${className}`}
    >
      <Search
        className={`h-4 w-4 shrink-0 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-inherit"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="p-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {shortcut && !value && (
        <kbd
          className={`hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border ml-1 ${
            isDark
              ? 'bg-[#1A2234] text-slate-400 border-slate-700'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          {shortcut}
        </kbd>
      )}
    </div>
  );
}
