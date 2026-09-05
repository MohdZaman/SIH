import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pill', // 'pill' | 'underline' | 'darkPill'
  className = '',
}) {
  if (variant === 'darkPill') {
    return (
      <div className={`flex items-center p-1 bg-[#121722] rounded-lg border border-white/10 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all duration-150 flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-brand-navy text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full ${
                    isActive ? 'bg-brand-blue text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className={`flex items-center border-b border-slate-200 gap-6 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                isActive ? 'text-brand-blue font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default light pill (Dashboard header style)
  return (
    <div className={`inline-flex items-center p-1 bg-slate-100 rounded-lg gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-all duration-150 flex items-center gap-1.5 ${
              isActive
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
