import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Scale,
  CheckCheck,
} from 'lucide-react';
import Button from '../common/Button';

export default function GapAnalysisSplitView({
  findings = [],
  procurementId,
  procurement,
  requirement,
}) {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const handleGoToClauseStudio = () => {
    if (procurementId) {
      navigate(`/clause-studio?id=${procurementId}`, {
        state: {
          procurementId,
          procurement,
          requirement,
        },
      });
    } else {
      navigate('/clause-studio');
    }
  };

  const handleCopyClause = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const auditGaps = [
    {
      id: 'gap-1',
      parameter: 'Photometric Standard & ISI Mark',
      severity: 'high',
      severityLabel: 'Audit Disqualification',
      originalStandard: 'IS 1944 (Parts 1 & 2):1970',
      status: 'Withdrawn / Obsolete',
      originalText:
        'Clause specifies obsolete 1970 streetlighting standard. Bidders may supply low-efficiency mercury vapor or unregulated luminaires without ISI certification.',
      risk: 'High probability of commercial dispute and audit disqualification under GFR Rule 144(vii).',
      remediatedStandard: 'IS 10322 (Part 5/Sec 3):2024',
      remediationStatus: 'Active & Enforced QCO',
      remediatedText:
        '"Luminaires must conform to IS 10322 (Part 5/Sec 3):2024 bearing authentic Bureau of Indian Standards (BIS) Standard Mark (ISI license)."',
      statutoryBasis: 'DPIIT Quality Control Order S.O. 1563(E)',
    },
    {
      id: 'gap-2',
      parameter: 'Driver Surge Protection Immunity',
      severity: 'medium',
      severityLabel: 'Premature Failure Risk',
      originalStandard: 'Missing: IS 15885-2-13',
      status: 'Omitted from NIT',
      originalText:
        'Driver surge protection is absent. Luminaires will fail in outdoor monsoon spikes without 10kV surge protection report from NABL lab.',
      risk: 'Field premature failure within 6 months during lightning transients.',
      remediatedStandard: 'IS 15885-2-13 + IS 16103',
      remediationStatus: 'Safety & Surge Norm Added',
      remediatedText:
        '"Power controlgear must comply with IS 15885-2-13 with built-in surge immunity of 10kV tested as per IS 16103 at an accredited NABL laboratory."',
      statutoryBasis: 'Central Electricity Authority (CEA) Technical Guidelines 2023',
    },
    {
      id: 'gap-3',
      parameter: 'Optical Enclosure Ingress Protection',
      severity: 'low',
      severityLabel: 'Compliant Specification',
      originalStandard: 'IS 12063: IP66 Ingress Protection',
      status: 'Compliant',
      originalText:
        'Dust-tight and water-jet ingress clause correctly aligns with BIS test protocols.',
      risk: 'No operational risk. Fully aligned with municipal roadway conditions.',
      remediatedStandard: 'IS/IEC 60529 (IP66 Enclosure)',
      remediationStatus: 'Verified Compliant',
      remediatedText:
        '"Optical and electronic controlgear compartment shall have minimum IP66 protection as per IS/IEC 60529 with silicon gaskets."',
      statutoryBasis: 'Ministry of Power Energy Conservation Norms',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              REVERSE TENDER GAP AUDIT
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-medium">
              3 Compliance Issues Identified &amp; Resolved
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">
            Itemized Statutory Clause Remediation
          </h3>
          <p className="text-xs text-slate-500 font-normal">
            Side-by-side diagnosis of deficient NIT clauses paired with official statutory text aligned with BIS Quality Control Orders.
          </p>
        </div>

        <Button
          variant="royal"
          size="md"
          iconRight={ArrowRight}
          onClick={handleGoToClauseStudio}
          className="shadow-sm shrink-0"
        >
          Apply All Fixes in Clause Studio
        </Button>
      </div>

      {/* Cards Stack */}
      <div className="space-y-4">
        {auditGaps.map((gap, index) => (
          <div
            key={gap.id}
            className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-all"
          >
            {/* Card Header Bar */}
            <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-6 rounded-md bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {gap.parameter}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  gap.severity === 'high'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : gap.severity === 'medium'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {gap.severityLabel}
              </span>
            </div>

            {/* Card Body: Problem vs Solution */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Deficient Drafted Clause */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/70 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>Original Tender Finding: {gap.originalStandard}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    {gap.originalText}
                  </p>
                </div>
                <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1 pt-1">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{gap.risk}</span>
                </div>
              </div>

              {/* Right: Statutory Auto-Remediation */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/90 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-emerald-900 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <CheckCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Statutory Replacement: {gap.remediatedStandard}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyClause(gap.remediatedText, gap.id)}
                      className="text-xs text-brand-blue hover:text-blue-700 font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      {copiedId === gap.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Clause</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                    {gap.remediatedText}
                  </p>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 pt-1">
                  <Scale className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Statutory Authority: {gap.statutoryBasis}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
