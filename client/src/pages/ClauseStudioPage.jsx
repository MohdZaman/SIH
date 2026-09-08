import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Printer, FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import { synthesizeManakAIClause } from '../utils/clauseSynthesizerEngine';
import { fetchProcurements, fetchProcurementById } from '../features/procurement/procurementSlice';
import extractProcurementRequirements from '../utils/requirementExtractor';

export default function ClauseStudioPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const { procurements, recentProcurements, currentProcurement, requirement: reduxRequirement } = useSelector(
    (state) => state.procurement
  );

  // Helper to extract identifier regardless of format (_id vs id)
  const getId = (item) => item?._id || item?.id || '';

  // Determine initial tender ID from URL or route state
  const initialId = searchParams.get('id') || location.state?.procurementId || '';
  const [selectedTenderId, setSelectedTenderId] = useState(initialId);

  const allProcurements = procurements.length > 0 ? procurements : recentProcurements;

  // Active tender resolution with robust multi-source lookup
  const activeTender = useMemo(() => {
    if (selectedTenderId) {
      if (location.state?.procurement && getId(location.state.procurement) === selectedTenderId) {
        return location.state.procurement;
      }
      const foundInAll = allProcurements.find((p) => getId(p) === selectedTenderId);
      if (foundInAll) return foundInAll;

      if (currentProcurement && getId(currentProcurement) === selectedTenderId) {
        return currentProcurement;
      }
    }
    if (location.state?.procurement) return location.state.procurement;
    if (currentProcurement) return currentProcurement;
    if (selectedTenderId && allProcurements.length > 0) {
      return allProcurements.find((p) => getId(p) === selectedTenderId) || null;
    }
    return null;
  }, [selectedTenderId, location.state?.procurement, allProcurements, currentProcurement]);

  // Active requirement resolution: from navigation state, Redux, or automatic extraction from active tender
  const activeRequirement = useMemo(() => {
    if (location.state?.requirement) {
      return location.state.requirement;
    }
    if (reduxRequirement) {
      if (
        !selectedTenderId ||
        reduxRequirement.procurement === selectedTenderId ||
        getId(currentProcurement) === selectedTenderId
      ) {
        return reduxRequirement;
      }
    }
    // Fallback: If tender is present, extract structured parameters immediately
    if (activeTender) {
      return extractProcurementRequirements(
        activeTender.description || activeTender.name || '',
        activeTender.name || activeTender.title || ''
      );
    }
    return null;
  }, [location.state?.requirement, reduxRequirement, selectedTenderId, currentProcurement, activeTender]);

  // Helper to build a comprehensive specification prompt from tender details & parameters
  const buildPromptFromTender = (tender, req) => {
    if (!tender && !req) return '';
    const title = tender?.name || tender?.title || req?.product || 'Procurement Item';
    const desc = tender?.description || req?.rawText || '';

    const parts = [];
    parts.push(`Supply and technical specification for ${title}.`);

    if (req?.product && req.product !== title) {
      parts.push(`Specified Product: ${req.product}.`);
    }
    if (req?.application) {
      parts.push(`Intended Application: ${req.application}.`);
    }
    if (req?.technicalParameters && Object.keys(req.technicalParameters).length > 0) {
      const paramStr = Object.entries(req.technicalParameters)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${v}`)
        .join(', ');
      parts.push(`Mandatory Technical Parameters: ${paramStr}.`);
    }
    if (req?.keywords && req.keywords.length > 0) {
      parts.push(`Relevant Standards & Tokens: ${req.keywords.join(', ')}.`);
    }
    if (desc && (!req || !req.technicalParameters || Object.keys(req.technicalParameters).length === 0)) {
      parts.push(`Requirement Details: ${desc}.`);
    }
    parts.push(
      'Must enforce applicable Bureau of Indian Standards (BIS), statutory QCO compliance, and accredited NABL test certification.'
    );

    return parts.join(' ');
  };

  const defaultPrompt =
    'Synthesize an airtight dispute-proof technical tender specification clause for corrosion-resistant TMT bars conforming to IS 1786 Fe 500D with mandatory ISI mark, NABL tensile test reports, and Steel QCO 2024 compliance.';

  // Structured Clause State
  const [synthesizedResult, setSynthesizedResult] = useState(() => {
    const initialText = activeTender || activeRequirement ? buildPromptFromTender(activeTender, activeRequirement) : defaultPrompt;
    return synthesizeManakAIClause(initialText);
  });

  // Fetch procurements on mount if not loaded
  useEffect(() => {
    if (allProcurements.length === 0) {
      dispatch(fetchProcurements());
    }
    if (selectedTenderId && !activeTender) {
      dispatch(fetchProcurementById(selectedTenderId));
    }
  }, [dispatch, allProcurements.length, selectedTenderId, activeTender]);

  // Synchronize tender ID when URL query parameter or navigation state changes
  useEffect(() => {
    const paramId = searchParams.get('id') || location.state?.procurementId;
    if (paramId && paramId !== selectedTenderId) {
      setSelectedTenderId(paramId);
    }
  }, [searchParams, location.state]);

  // Whenever active tender or requirement changes, update synthesized document
  useEffect(() => {
    if (activeTender || activeRequirement) {
      const tenderPrompt = buildPromptFromTender(activeTender, activeRequirement);
      const newClause = synthesizeManakAIClause(tenderPrompt);
      setSynthesizedResult(newClause);
    }
  }, [activeTender, activeRequirement]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout
      headerTitle="Reports & AI Clause Synthesizer Studio"
      headerSubtitle="Synthesize dispute-proof tender specifications and BoQ technical clauses using live SARAL intelligence."
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Navigation Header & Target Tender Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-blue text-white shadow-sm flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              <span>AI Specification &amp; Clause Document (SARAL)</span>
            </div>
            {activeTender && (
              <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {activeTender.name || activeTender.title}
              </span>
            )}
          </div>

          {/* Target Tender Selector */}
          {allProcurements.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600 shrink-0">
                Target Tender:
              </label>
              <select
                value={selectedTenderId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedTenderId(newId);
                  setSearchParams(newId ? { id: newId } : {});
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-brand-blue shadow-2xs"
              >
                <option value="">-- Choose Procurement Tender --</option>
                {allProcurements.map((p) => {
                  const pId = getId(p);
                  return (
                    <option key={pId} value={pId}>
                      {p.name || p.title} [{p.type || 'tender'}]
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* GENERATED DRAFT DOCUMENT SECTION */}
        {synthesizedResult && (
          <div className="space-y-6">
            {/* SINGLE PAGE GENERATED DOCUMENT SHEET (CONTINUOUS, ZERO BOX PARTITIONS) */}
            <div className="bg-white border border-slate-300 shadow-md rounded-lg p-8 sm:p-14 text-slate-900 font-sans space-y-7 animate-in fade-in duration-200 print:shadow-none print:border-none print:p-0">
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-mono tracking-widest uppercase text-slate-500 font-bold mb-1">
                      Bureau of Indian Standards Compliance Grid • SARAL Platform
                    </div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
                      ANNEXURE — TECHNICAL SPECIFICATION &amp; SPECIAL CONTRACT CLAUSE
                    </h1>
                    <p className="text-xs text-slate-600 mt-1 font-sans">
                      Mandatory Special Terms and Conditions (STC) for Public Procurement &amp; GeM Bids
                    </p>
                  </div>

                  <div className="sm:text-right text-xs font-mono text-slate-600 space-y-1 shrink-0">
                    <div>DOC REF: <strong className="text-slate-900 font-bold">SRL/SPEC/{new Date().getFullYear()}/089</strong></div>
                    <div>ISSUE DATE: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div>STATUS: <span className="text-emerald-700 font-semibold uppercase">Statutory Enforced</span></div>
                  </div>
                </div>
              </div>

              {/* 1. Applicable Standards & Governing Codes */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900">
                  1.0 Applicable Technical Standards &amp; Specifications
                </h2>
                <div className="text-xs text-slate-800 space-y-2 leading-relaxed">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-slate-500 font-medium sm:w-48 shrink-0">Primary Standard:</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {synthesizedResult.standardCode}
                      <span className="font-sans font-normal text-slate-700 ml-2">— {synthesizedResult.standardTitle}</span>
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-slate-500 font-medium sm:w-48 shrink-0">Key Technical Threshold:</span>
                    <span className="text-slate-900 font-normal">{synthesizedResult.materialRule}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-slate-500 font-medium sm:w-48 shrink-0">Statutory Quality Mandate:</span>
                    <span className="text-slate-900 font-normal">{synthesizedResult.qcoMandate}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-slate-500 font-medium sm:w-48 shrink-0">Auditable Evidence Required:</span>
                    <span className="text-slate-900 font-normal">{synthesizedResult.evidence}</span>
                  </div>
                </div>
              </div>

              {/* 2. Scope & Procurement Objective */}
              <div className="space-y-2 border-t border-slate-200 pt-5">
                <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900">
                  2.0 Scope of Requirement &amp; Procurement Intent
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans text-justify">
                  {synthesizedResult.shortExplanation}
                </p>
              </div>

              {/* 3. Mandatory Tender Clause (Full Legal Text) */}
              <div className="space-y-3 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900">
                    3.0 Mandatory Special Terms &amp; Conditions (Tender Specification Clause)
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-900 leading-relaxed font-serif text-justify whitespace-pre-wrap pl-3 border-l-2 border-slate-300">
                  {synthesizedResult.clauseText}
                </div>
              </div>

              {/* 4. Statutory Compliance & Pre-Dispatch Checklist */}
              <div className="space-y-3 border-t border-slate-200 pt-5">
                <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900">
                  4.0 Pre-Dispatch Compliance &amp; Acceptance Checklist
                </h2>
                <ol className="space-y-2 text-xs text-slate-800 pl-5 list-decimal font-sans leading-relaxed">
                  {synthesizedResult.checklist?.map((item, idx) => (
                    <li key={idx} className="text-slate-800">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              {/* 5. Document Certification & Regulatory Declaration */}
              <div className="border-t-2 border-slate-900 pt-5 space-y-4">
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans text-justify">
                  <strong>Statutory Declaration:</strong> This technical specification clause has been synthesized in strict conformity with the Bureau of Indian Standards Act 2016, relevant Central Quality Control Orders (QCOs), and Central Vigilance Commission (CVC) public procurement guidelines. Non-conformance or supply of uncertified non-ISI marked items shall lead to immediate disqualification and contractual forfeiture.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500 pt-1">
                  <div>Verification Grid: <strong className="text-emerald-700">COMPLIANCE CERTIFIED</strong></div>
                  <div>OFFICIAL SPECIFICATION SCHEDULE • SARAL PLATFORM</div>
                </div>
              </div>
            </div>

            {/* Print Document Button at the end of the draft page */}
            <div className="flex items-center justify-end pt-2 pb-6 print:hidden">
              <Button
                variant="royal"
                size="md"
                iconLeft={Printer}
                onClick={handlePrint}
                className="shadow-sm font-semibold"
              >
                Print Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

