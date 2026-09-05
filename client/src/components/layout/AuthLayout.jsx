import React from 'react';

export default function AuthLayout({ children, maxWidth = 'max-w-[440px]' }) {
  return (
    <div className="min-h-screen bg-neutral-50 sm:bg-neutral-100 flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Centered Auth Card: White Background, Black Text, Emerald Accents */}
      <div className={`w-full ${maxWidth} bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-neutral-200/70 border border-neutral-200/90 p-8 sm:p-12 transition-all`}>
        {children}
      </div>
    </div>
  );
}