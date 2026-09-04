import React, { useState } from 'react';
import {
  Copy,
  Check,
  FileDown,
  FileSpreadsheet,
  FileText,
  Sliders,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Button from '../common/Button';

export default function ClauseSynthesizer() {
  const [copied, setCopied] = useState(false);

  // Parameter toggles
  const [params, setParams] = useState({
    isiMark: true,
    nablReport: true,
    thirdPartyInspection: true,
    beeStar: false,
    makeInIndia: true,
  });

  const toggleParam = (key) => {
    setParams((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamically constructed dispute-proof clause based on toggles
  const generatedClause = `The contractor/supplier shall supply LED Luminaires conforming strictly to IS 10322 (Part 5/Sec 3):2024 bearing valid Bureau of Indian Standards (BIS) certification mark (ISI License) as on bid opening date.${
    params.nablReport
      ? ' The power controlgear must satisfy IS 15885-2-13 with surge immunity up to 10kV tested in accordance with IS 16103 at an accredited NABL facility with test reports not older than 180 days.'
      : ' The power controlgear must satisfy IS 15885-2-13 with surge immunity up to 10kV per IS 16103.'
  }${
    params.thirdPartyInspection
      ? ' Pre-dispatch Third Party Inspection (TPI) shall be executed through an approved agency (RITES / EIL / SGS) certifying dimensional and photometric compliance.'
      : ''
  }${
    params.beeStar
      ? ' Luminaires must possess valid BEE 5-Star energy efficiency rating with minimum system efficacy of 130 lm/W.'
      : ''
  }${
    params.makeInIndia
      ? ' Bidder must submit DPIIT Class-I Local Supplier self-certification and QCO S.O. 1563(E) compliance affidavit.'
      : ''
  } Any deviation or submission of obsolete IS codes shall result in immediate technical disqualification under CVC Guidelines Section 4.2.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Parameter Customization Column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="h-4 w-4 text-brand-blue" />
            <h3 className="text-sm font-bold text-slate-900">
              Procurement Clause Builder
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Toggle statutory parameters to instantly synthesize airtight GeM Special Terms & Conditions (STC).
          </p>

          <div className="space-y-3">
            {/* ISI Mark Toggle */}
            <div
              onClick={() => toggleParam('isiMark')}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50 select-none"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">Mandatory ISI Mark</span>
                <span className="text-[11px] text-slate-500">Scheme-I BIS certification license</span>
              </div>
              <input
                type="checkbox"
                checked={params.isiMark}
                readOnly
                className="h-4 w-4 text-brand-blue rounded border-slate-300 pointer-events-none"
              />
            </div>

            {/* NABL Lab Report Toggle */}
            <div
              onClick={() => toggleParam('nablReport')}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50 select-none"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">NABL Test Reports</span>
                <span className="text-[11px] text-slate-500">10kV surge immunity certificate &lt; 180 days</span>
              </div>
              <input
                type="checkbox"
                checked={params.nablReport}
                readOnly
                className="h-4 w-4 text-brand-blue rounded border-slate-300 pointer-events-none"
              />
            </div>

            {/* Third Party Inspection */}
            <div
              onClick={() => toggleParam('thirdPartyInspection')}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50 select-none"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">Pre-dispatch TPI (RITES/EIL)</span>
                <span className="text-[11px] text-slate-500">Mandatory physical factory inspection</span>
              </div>
              <input
                type="checkbox"
                checked={params.thirdPartyInspection}
                readOnly
                className="h-4 w-4 text-brand-blue rounded border-slate-300 pointer-events-none"
              />
            </div>

            {/* BEE Star Rating */}
            <div
              onClick={() => toggleParam('beeStar')}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50 select-none"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">BEE 5-Star Energy Rating</span>
                <span className="text-[11px] text-slate-500">Bureau of Energy Efficiency verified</span>
              </div>
              <input
                type="checkbox"
                checked={params.beeStar}
                readOnly
                className="h-4 w-4 text-brand-blue rounded border-slate-300 pointer-events-none"
              />
            </div>

            {/* Make in India Preference */}
            <div
              onClick={() => toggleParam('makeInIndia')}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer bg-slate-50/50 select-none"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">DPIIT Make-In-India (MII)</span>
                <span className="text-[11px] text-slate-500">Class-I Local Supplier 50% minimum content</span>
              </div>
              <input
                type="checkbox"
                checked={params.makeInIndia}
                readOnly
                className="h-4 w-4 text-brand-blue rounded border-slate-300 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Synthesized Output Box */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Synthesized Dispute-Proof NIT Tender Clause
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Airtight & CVC Compliant
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed tracking-wide select-all border border-slate-800">
              {generatedClause}
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-brand-blue shrink-0" />
              <span>
                Formatted specifically for copy-pasting directly into Government e-Marketplace (GeM) Custom Bid Specifications.
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant={copied ? 'emerald' : 'royal'}
                size="sm"
                iconLeft={copied ? Check : Copy}
                onClick={handleCopy}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Clause to Clipboard'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                iconLeft={FileText}
                onClick={() => alert('Exporting GeM STC Clause as DOCX document')}
              >
                Export Word (.docx)
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconLeft={FileSpreadsheet}
                onClick={() => alert('Exporting Schedule of Requirements as Excel BoQ')}
              >
                Export BoQ (.xlsx)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
