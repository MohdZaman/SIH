import React from 'react';
import { toast } from 'sonner';
import {
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

/**
 * Design Sample 1: Modern Shadcn Minimalist
 * Clean monochrome card with subtle status accents, crisp typography, and border.
 */
export const renderMinimalistToast = (t, { type = 'success', title, description, actionText, onAction }) => {
  const isSuccess = type === 'success';

  return (
    <div className="flex items-start gap-3 w-full sm:w-[356px] p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-200/60 text-slate-900 font-sans transition-all">
      <div className="shrink-0 mt-0.5">
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-rose-600" />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs font-medium text-slate-900 leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-[11px] text-slate-500 font-normal leading-normal mt-0.5">
            {description}
          </p>
        )}
        {actionText && (
          <button
            type="button"
            onClick={() => {
              onAction?.();
              toast.dismiss(t);
            }}
            className="mt-2 text-[11px] font-medium text-slate-900 hover:text-emerald-700 underline underline-offset-2 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <span>{actionText}</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => toast.dismiss(t)}
        className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
        title="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

/**
 * Design Sample 2: Status Glow / Rich Pill
 * Vibrant tinted background with frosted glass, status badge pill, and colored iconography.
 */
export const renderStatusGlowToast = (t, { type = 'success', title, description, actionText, onAction }) => {
  const isSuccess = type === 'success';

  return (
    <div
      className={`flex items-start gap-3.5 w-full sm:w-[370px] p-4 rounded-2xl border shadow-xl backdrop-blur-md font-sans transition-all ${
        isSuccess
          ? 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10'
          : 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-500/10'
      }`}
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
          isSuccess
            ? 'bg-emerald-100/80 border-emerald-300/80 text-emerald-700'
            : 'bg-rose-100/80 border-rose-300/80 text-rose-700'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
              isSuccess
                ? 'bg-emerald-200/80 text-emerald-800'
                : 'bg-rose-200/80 text-rose-800'
            }`}
          >
            {isSuccess ? 'Success' : 'Attention Required'}
          </span>
        </div>
        <p className="text-xs font-semibold leading-tight">
          {title}
        </p>
        {description && (
          <p
            className={`text-[11px] font-normal leading-relaxed mt-1 ${
              isSuccess ? 'text-emerald-800/85' : 'text-rose-800/85'
            }`}
          >
            {description}
          </p>
        )}
        {actionText && (
          <button
            type="button"
            onClick={() => {
              onAction?.();
              toast.dismiss(t);
            }}
            className={`mt-2.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer shadow-2xs ${
              isSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600'
            }`}
          >
            {actionText}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => toast.dismiss(t)}
        className={`p-1 rounded-md transition-colors shrink-0 cursor-pointer ${
          isSuccess
            ? 'text-emerald-600/70 hover:text-emerald-950 hover:bg-emerald-200/50'
            : 'text-rose-600/70 hover:text-rose-950 hover:bg-rose-200/50'
        }`}
        title="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

/**
 * Design Sample 3: Executive Obsidian / GovTech Royal
 * High-contrast dark carbon card with neon accent strip, shield badge, and micro-actions.
 */
export const renderExecutiveToast = (t, { type = 'success', title, description, actionText, onAction }) => {
  const isSuccess = type === 'success';

  return (
    <div className="relative flex items-start gap-3.5 w-full sm:w-[380px] p-4 bg-[#0A0F1D] border border-slate-800/90 rounded-xl shadow-2xl text-slate-100 font-sans overflow-hidden transition-all">
      {/* Neon left accent stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isSuccess
            ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
            : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
        }`}
      />

      <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 ml-1">
        {isSuccess ? (
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-rose-400" />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
            {isSuccess ? 'SYS_OK' : 'SYS_ALERT'}
          </span>
        </div>
        <p className="text-xs font-semibold text-white tracking-tight leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-[11px] text-slate-400 font-normal leading-relaxed mt-0.5">
            {description}
          </p>
        )}
        {actionText && (
          <button
            type="button"
            onClick={() => {
              onAction?.();
              toast.dismiss(t);
            }}
            className="mt-2.5 text-[11px] font-medium px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            {actionText}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => toast.dismiss(t)}
        className="text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
        title="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

/**
 * Universal Trigger Helper:
 * Trigger toast by design index (1, 2, or 3) or fallback to active choice
 */
export const triggerToastSample = (designNumber, type, options = {}) => {
  const defaultTitles = {
    success: 'Tender Clause Verified & Approved',
    error: 'Mandatory BIS Standard Conflict Detected',
  };

  const defaultDescriptions = {
    success: 'IS 1786:2008 high-strength deformed bars confirmed compliant with GeM Schedule 4.',
    error: 'Withdrawn IS 456:1978 edition cited in BoQ item 12. Please upgrade to latest version.',
  };

  const payload = {
    type,
    title: options.title || defaultTitles[type],
    description: options.description || defaultDescriptions[type],
    actionText: options.actionText || (type === 'success' ? 'View Details' : 'Resolve Issue'),
    onAction: options.onAction,
  };

  if (designNumber === 1) {
    return toast.custom((t) => renderMinimalistToast(t, payload));
  } else if (designNumber === 2) {
    return toast.custom((t) => renderStatusGlowToast(t, payload));
  } else {
    return toast.custom((t) => renderExecutiveToast(t, payload));
  }
};