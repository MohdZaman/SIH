import React, { useState } from 'react';
import {
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  Tag,
  Scale,
  Wrench,
  AlertCircle,
  Building,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function RequirementsInspectionView({
  requirement,
  onSearchKeyword,
  onOpenClauseStudio,
}) {
  const [showRawText, setShowRawText] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!requirement) return null;

  const {
    product = 'Not specified',
    application = 'Public Procurement',
    technicalParameters = {},
    keywords = [],
    rawText = '',
    createdAt,
    _id,
  } = requirement;

  const handleCopyRaw = () => {
    if (!rawText) return;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paramEntries = Object.entries(technicalParameters || {});

  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                AI Schedule Analysis
              </span>
              <span className="text-xs text-slate-400">ID: {_id?.slice(-8) || 'Active'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {product}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Application Domain: <strong>{application}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenClauseStudio && (
            <Button
              variant="whiteCta"
              size="sm"
              iconLeft={FileText}
              onClick={onOpenClauseStudio}
            >
              Draft Tender Clause
            </Button>
          )}
        </div>
      </div>

      {/* Main Extracted Metadata Grid */}
      <div className="p-5 space-y-5">
        {/* Keywords and Tags */}
        {keywords.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-brand-blue" />
              <span>Extracted Engineering Keywords & Standards Tokens</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => onSearchKeyword?.(kw)}
                  title={`Click to search BIS standards for "${kw}"`}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-blue border border-blue-200/70 font-medium transition-colors cursor-pointer group"
                >
                  <span>{kw}</span>
                  <span className="text-[10px] opacity-60 group-hover:opacity-100">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Technical Parameters Table */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-slate-400" />
              <span>Extracted Technical & Engineering Parameters ({paramEntries.length})</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Parsed by ManakAI NLP Engine</span>
          </h4>

          {paramEntries.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4 w-1/3">Engineering Parameter</th>
                    <th className="py-2.5 px-4 w-1/2">Specified Requirement Value</th>
                    <th className="py-2.5 px-4 text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paramEntries.map(([key, val], idx) => {
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase());
                    const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);

                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {formattedKey}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                          {stringVal}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Extracted
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No discrete technical parameter pairs extracted. Review schedule text below.
            </div>
          )}
        </div>

        {/* Accordion: Raw Analyzed Text */}
        {rawText && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowRawText((prev) => !prev)}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Original Tender NIT Text Snippet ({rawText.length} characters)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-normal text-slate-500">
                  {showRawText ? 'Hide Source' : 'View Source'}
                </span>
                {showRawText ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </button>

            {showRawText && (
              <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed max-h-60 overflow-y-auto border-t border-slate-200 relative">
                <button
                  onClick={handleCopyRaw}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <p className="whitespace-pre-wrap pr-16">{rawText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
