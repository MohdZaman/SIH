import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  ExternalLink,
  FileText,
  Network,
  AlertTriangle,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function StandardSearchCard({ standard }) {
  const navigate = useNavigate();

  if (!standard) return null;

  return (
    <div className="bg-white border-2 border-brand-blue/30 rounded-2xl p-6 sm:p-7 shadow-lg shadow-blue-500/5 relative overflow-hidden">
      {/* Top ambient highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-blue via-blue-400 to-emerald-400" />

      {/* Header section with Code & Match Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
              Primary BIS Recommendation
            </span>
            <span className="text-xs text-slate-500">{standard.status}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-normal">
            {standard.code}
          </h2>
          <p className="text-sm font-medium text-slate-700 mt-1">
            {standard.title}
          </p>
        </div>

        <div className="shrink-0">
          <Badge variant="emerald" size="lg" dot>
            {standard.matchConfidence || '96.8% Confidence Match'}
          </Badge>
        </div>
      </div>

      {/* Scope Description */}
      <p className="mt-4 text-xs text-slate-600 leading-relaxed max-w-4xl">
        {standard.description}
      </p>

      {/* Key Metadata Badges */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <Award className="h-4 w-4 text-amber-500" />
          <span>Mark Scheme: <strong>{standard.complianceScheme || 'ISI Scheme-I Mandatory'}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>QCO Enforcement: <strong>{standard.qcoMandate || 'DPIIT S.O. 1563(E) Mandated'}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-brand-blue">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <span>GeM Filter: <strong>Golden Specification Parameter</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconLeft={Network}
            onClick={() => navigate(`/normative-graph?id=${encodeURIComponent(standard.code)}`)}
          >
            Explore Normative Dependency Tree
          </Button>

          <Button
            variant="ghost"
            size="sm"
            iconLeft={FileText}
            onClick={() => alert(`Opening official BIS standard catalog portal for ${standard.code}`)}
          >
            View Bureau Gazette Spec
          </Button>
        </div>

        <Button
          variant="royal"
          size="sm"
          onClick={() => navigate('/clause-studio')}
        >
          Draft Procurement Clause
        </Button>
      </div>
    </div>
  );
}