import React from 'react';
import { X, ShieldCheck, Beaker, Building2, BookOpen, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function NodeInspectorDrawer({ node, onClose, onInjectClause }) {
  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
              {node.type || 'Normative Reference'}
            </span>
            <span className="text-xs font-mono text-slate-500">Level {node.level}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {node.code}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{node.title}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
        {/* Statutory Mandate */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Statutory Mandate:</span>
            <p className="text-slate-600 mt-0.5">{node.qcoMandate || 'Mandatory Quality Control Order'}</p>
          </div>
        </div>

        {/* Clause Scope */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            <span>Standard Clause Excerpt & Scope</span>
          </h4>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-800">
            {node.scope}
          </div>
        </div>

        {/* Laboratory Testing Methods */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Beaker className="h-3.5 w-3.5 text-slate-400" />
            <span>Mandatory NABL Test Methods</span>
          </h4>
          <div className="space-y-1.5">
            {node.labTestingMethods?.map((method, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-slate-800"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                <span>{method}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accredited Test Labs */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Accredited Test Laboratories</span>
          </h4>
          <div className="space-y-1.5">
            {node.accreditedLabs?.map((lab, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
              >
                {lab}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert(`Downloaded testing method document for ${node.code}`)}
        >
          Download PDF
        </Button>
        <Button
          variant="royal"
          size="sm"
          iconRight={ArrowRight}
          onClick={() => {
            if (onInjectClause) onInjectClause(node);
          }}
        >
          Insert in GeM Clause
        </Button>
      </div>
    </div>
  );
}
