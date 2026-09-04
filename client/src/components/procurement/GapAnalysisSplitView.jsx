import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function GapAnalysisSplitView({ findings = [] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Reverse Tender Audit Completed</h4>
            <p className="text-xs text-slate-300">
              Found 1 Superseded Standard • 1 Missing Mandatory Lab Test • 1 Verified Compliant
            </p>
          </div>
        </div>

        <Button
          variant="whiteCta"
          size="sm"
          iconRight={ArrowRight}
          onClick={() => navigate('/clause-studio')}
        >
          Apply Auto-Remediation to GeM Clause
        </Button>
      </div>

      {/* Before vs After Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: As Drafted in NIT */}
        <div className="bg-white border-2 border-red-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-red-100">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h4 className="text-sm font-bold text-slate-900">
                Current NIT Clause (Discrepant)
              </h4>
            </div>
            <Badge variant="red" size="sm">
              Non-Compliant
            </Badge>
          </div>

          {/* Discrepancy Card 1: Superseded Standard */}
          <div className="p-3.5 rounded-lg bg-red-50/50 border border-red-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-red-700">
                IS 1944 (Parts 1 & 2):1970
              </span>
              <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded">
                Withdrawn / Obsolete
              </span>
            </div>
            <p className="text-xs text-slate-700">
              Clause specifies obsolete 1970 streetlighting standard. Bidders may supply low-efficiency mercury vapor or unregulated luminaires without ISI certification.
            </p>
            <div className="text-[11px] text-red-600 font-medium">
              Risk: High probability of commercial dispute and audit disqualification.
            </div>
          </div>

          {/* Discrepancy Card 2: Missing Test Norm */}
          <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-800">
                Missing: IS 15885-2-13 (Surge Immunity)
              </span>
              <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded">
                Omitted
              </span>
            </div>
            <p className="text-xs text-slate-700">
              Driver surge protection is absent. Luminaires will fail in outdoor monsoon spikes without 10kV surge protection report from NABL lab.
            </p>
            <div className="text-[11px] text-amber-700 font-medium">
              Risk: Field premature failure within 6 months.
            </div>
          </div>

          {/* Compliant Item */}
          <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-800">
                IS 12063: IP66 Ingress Protection
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                Compliant
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Dust-tight and water-jet ingress clause correctly aligns with BIS test protocols.
            </p>
          </div>
        </div>

        {/* Right Column: AI Auto-Remediated Statutory Clause */}
        <div className="bg-white border-2 border-emerald-500/50 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Auto-Remediated Specification (BIS Compliant)
              </h4>
            </div>
            <Badge variant="emerald" size="sm">
              Airtight GeM Spec
            </Badge>
          </div>

          {/* Remediated Clause Card 1 */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-800">
                IS 10322 (Part 5/Sec 3):2024
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                Active & Enforced QCO
              </span>
            </div>
            <p className="text-xs text-slate-800 font-mono leading-relaxed bg-white/80 p-2.5 rounded border border-emerald-100">
              "Luminaires must conform to IS 10322 (Part 5/Sec 3):2024 bearing authentic Bureau of Indian Standards (BIS) Standard Mark (ISI license)."
            </p>
            <div className="text-[11px] text-emerald-700 font-medium">
              Statutory Basis: DPIIT Quality Control Order S.O. 1563(E)
            </div>
          </div>

          {/* Remediated Clause Card 2 */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-800">
                IS 15885-2-13 + IS 16103
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                Safety & Performance Added
              </span>
            </div>
            <p className="text-xs text-slate-800 font-mono leading-relaxed bg-white/80 p-2.5 rounded border border-emerald-100">
              "Power controlgear must comply with IS 15885-2-13 with built-in surge immunity of 10kV tested as per IS 16103 at an accredited NABL laboratory."
            </p>
            <div className="text-[11px] text-emerald-700 font-medium">
              Assurance: Eliminates driver burnouts during lightning transients.
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="royal"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => navigate('/clause-studio')}
            >
              Transfer to Clause Studio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
