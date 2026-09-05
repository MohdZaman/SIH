import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldAlert,
  Search,
  BookOpen,
  Scale,
  ShieldCheck,
  Zap,
  Sparkles,
  FileText,
  Building,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProcurements,
  fetchProcurementById,
  analyzeProcurement,
  fetchRecommendations,
  fetchProcurementEvidence,
  recommendStandard,
} from '../features/procurement/procurementSlice';
import { searchStandards } from '../features/standards/standardSlice';
import RequirementsInspectionView from '../components/procurement/RequirementsInspectionView';
import CitationsEvidenceView from '../components/procurement/CitationsEvidenceView';
import GapAnalysisSplitView from '../components/procurement/GapAnalysisSplitView';

export default function TenderAuditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    procurements,
    currentProcurement,
    requirement,
    recommendations,
    evidence,
    isAuditing,
    error,
  } = useSelector((state) => state.procurement);

  const { standards: liveStandards } = useSelector((state) => state.standards);

  const [selectedId, setSelectedId] = useState(searchParams.get('id') || '');
  const [activeTab, setActiveTab] = useState('requirements'); // 'requirements', 'gap-audit', 'citations-evidence'
  const [recommendQuery, setRecommendQuery] = useState('');
  const [matchingQuery, setMatchingQuery] = useState(false);

  useEffect(() => {
    dispatch(fetchProcurements());
    const paramId = searchParams.get('id');
    if (paramId) {
      setSelectedId(paramId);
      dispatch(fetchProcurementById(paramId));
      dispatch(fetchRecommendations(paramId));
      dispatch(fetchProcurementEvidence(paramId));
    }
  }, [searchParams, dispatch]);

  const handleSelect = (id) => {
    setSelectedId(id);
    if (id) {
      setSearchParams({ id });
      dispatch(fetchProcurementById(id));
      dispatch(fetchRecommendations(id));
      dispatch(fetchProcurementEvidence(id));
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedId) return;
    try {
      const reqRes = await dispatch(analyzeProcurement(selectedId)).unwrap();
      await dispatch(fetchRecommendations(selectedId)).unwrap();
      await dispatch(fetchProcurementEvidence(selectedId)).unwrap();

      // If recommendations from backend are empty, perform a live search against BIS standards
      if (reqRes && (!recommendations || recommendations.length === 0)) {
        const queryTerm = reqRes.product || (reqRes.keywords && reqRes.keywords[0]) || '';
        if (queryTerm) {
          dispatch(searchStandards(queryTerm));
        }
      }
    } catch (err) {
      alert(err.message || 'Analysis failed');
    }
  };

  const handleRecommendByQuery = async (e) => {
    e.preventDefault();
    if (!selectedId || !recommendQuery.trim()) return;
    setMatchingQuery(true);
    try {
      await dispatch(recommendStandard({ id: selectedId, query: recommendQuery.trim() })).unwrap();
      await dispatch(searchStandards(recommendQuery.trim())).unwrap();
      await dispatch(fetchProcurementEvidence(selectedId)).unwrap();
    } catch (err) {
      alert(err.message || 'Recommendation failed');
    } finally {
      setMatchingQuery(false);
    }
  };

  const handleKeywordSearch = async (kw) => {
    setRecommendQuery(kw);
    dispatch(searchStandards(kw));
    setActiveTab('citations-evidence');
  };

  return (
    <DashboardLayout
      headerTitle="Reverse Tender Auditor & Requirements Analyzer"
      headerSubtitle="Run deep AI analysis on tender statements to extract technical requirements, verify against BIS standards, and generate statutory citations & evidence trails."
    >
      <div className="space-y-6">
        {/* Tender Selector & Action Header */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-800 mb-1.5 uppercase tracking-normal">
                Select Registered Procurement Tender for Audit
              </label>
              <select
                value={selectedId}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brand-blue"
              >
                <option value="">-- Choose Procurement Tender ({procurements.length} Available) --</option>
                {procurements.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name || p.title} [{p.type || 'tender'}] — ID: {p._id.substring(0, 8)}...
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="royal"
              size="md"
              disabled={!selectedId}
              loading={isAuditing}
              onClick={handleRunAnalysis}
              iconLeft={FileCheck2}
              className="shadow-sm shrink-0"
            >
              Analyze Requirements
            </Button>
          </div>

          {/* Current Procurement Overview Bar */}
          {currentProcurement && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">
                    {currentProcurement.name || currentProcurement.title}
                  </span>
                  <Badge variant="blue" size="sm">
                    {currentProcurement.type || 'tender'}
                  </Badge>
                  {currentProcurement.status && (
                    <Badge variant={currentProcurement.status === 'COMPLETED' ? 'emerald' : 'amber'} size="sm">
                      {currentProcurement.status}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 line-clamp-2 leading-relaxed font-normal">
                  {currentProcurement.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-slate-500 text-[11px]">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Created: {new Date(currentProcurement.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Backend Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs flex items-center gap-2 font-normal">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Audit Service Notice: {error}</span>
          </div>
        )}

        {/* Quick Custom Match Query Bar */}
        {selectedId && (
          <div className="bg-white border border-brand-border rounded-xl p-4 shadow-sm">
            <form onSubmit={handleRecommendByQuery} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={recommendQuery}
                  onChange={(e) => setRecommendQuery(e.target.value)}
                  placeholder="Match custom standard (e.g., 'steel bar', 'packaged drinking water', 'IS 1786')..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-900 outline-none focus:border-brand-blue"
                />
              </div>
              <Button
                type="submit"
                variant="royal"
                size="sm"
                loading={matchingQuery}
                iconLeft={Search}
              >
                Match Standards
              </Button>
            </form>
          </div>
        )}

        {/* Audit Navigation Tabs */}
        {selectedId && (
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('requirements')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'requirements'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Extracted Requirements</span>
              {requirement && <span className="h-2 w-2 rounded-full bg-emerald-300" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gap-audit')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'gap-audit'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Reverse Tender Gap Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('citations-evidence')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'citations-evidence'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>Statutory Citations & Evidence Trail</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-800 font-mono">
                {(evidence?.length || 0) + (recommendations?.length || liveStandards?.length || 0)}
              </span>
            </button>
          </div>
        )}

        {/* TAB 1: EXTRACTED REQUIREMENTS (NO RAW JSON!) */}
        {selectedId && activeTab === 'requirements' && (
          <div>
            {requirement ? (
              <RequirementsInspectionView
                requirement={requirement}
                onSearchKeyword={handleKeywordSearch}
                onOpenClauseStudio={() => navigate('/clause-studio')}
              />
            ) : (
              <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-slate-400 space-y-4">
                <FileCheck2 className="h-10 w-10 mx-auto text-slate-300" />
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Tender Requirements Not Yet Extracted</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Click <strong>"Analyze Requirements"</strong> above to dispatch the procurement text to the backend Gemini AI engine. The engine will extract structured technical parameters, materials, quantities, and keywords.
                  </p>
                </div>
                <div>
                  <Button
                    variant="royal"
                    size="sm"
                    loading={isAuditing}
                    onClick={handleRunAnalysis}
                    iconLeft={FileCheck2}
                  >
                    Run Requirements Extraction
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REVERSE TENDER GAP AUDIT (BEFORE VS AFTER SPLIT) */}
        {selectedId && activeTab === 'gap-audit' && (
          <GapAnalysisSplitView />
        )}

        {/* TAB 3: STATUTORY CITATIONS & EVIDENCE TRAIL */}
        {selectedId && activeTab === 'citations-evidence' && (
          <CitationsEvidenceView
            recommendations={recommendations}
            evidence={evidence}
            matchedStandards={liveStandards}
            onInspectGraph={(stdId) => navigate(`/normative-graph?id=${stdId}`)}
            onAddToClause={() => navigate('/clause-studio')}
          />
        )}

        {/* Empty State when no procurement selected */}
        {!selectedId && (
          <div className="bg-white border border-brand-border rounded-2xl p-16 text-center text-slate-400 space-y-3">
            <FileCheck2 className="h-12 w-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No Procurement Tender Selected</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Select an existing procurement tender from the dropdown above to audit technical specifications, check obsolete standards, and review statutory citations.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
