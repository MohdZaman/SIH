import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  Scale,
  ShieldCheck,
  Zap,
  Sparkles,
  FileText,
  Building,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notify } from '@/lib/notify';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProcurements,
  fetchProcurementById,
  analyzeProcurement,
  fetchRecommendations,
  fetchProcurementEvidence,
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

  useEffect(() => {
    if (error) {
      notify.error(error, 'Tender Auditor notice');
    }
  }, [error]);

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

      try {
        await dispatch(fetchRecommendations(selectedId)).unwrap();
      } catch (recErr) {
        console.warn('Recommendations fetch note:', recErr);
      }

      try {
        await dispatch(fetchProcurementEvidence(selectedId)).unwrap();
      } catch (evErr) {
        console.warn('Evidence fetch note:', evErr);
      }

      // Search live BIS standards database using extracted tokens
      const queryTerm = reqRes?.product || (reqRes?.keywords && reqRes.keywords[0]) || '';
      if (queryTerm) {
        dispatch(searchStandards(queryTerm));
      }

      notify.success('Tender analysis completed successfully');
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Procurement analysis failed';
      notify.error(msg);
    }
  };

  const handleKeywordSearch = async (kw) => {
    dispatch(searchStandards(kw));
    setActiveTab('citations-evidence');
  };

  return (
    <DashboardLayout
      headerTitle="Analyze Tender"
      headerSubtitle="Run deep AI analysis on tender statements to extract technical requirements, verify against BIS standards, and generate statutory citations & evidence trails."
    >
      <div className="space-y-6">
        {/* Tender Selector & Action Header */}
        <Card className="bg-white border-slate-200/90 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Select registered procurement tender to analyze
              </label>
              <select
                value={selectedId}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brand-blue"
              >
                <option value="">-- Choose Procurement Tender ({procurements.length} Available) --</option>
                {procurements.map((p) => {
                  const pid = p._id || p.id;
                  return (
                    <option key={pid} value={pid}>
                      {p.title || p.name || 'Untitled Tender'}
                    </option>
                  );
                })}
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
              Analyze Tender
            </Button>
          </div>
        </Card>

        {/* Analysis Navigation Tabs */}
        {selectedId && (
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100/90 p-1 rounded-xl h-11 w-full sm:w-auto justify-start gap-1">
                <TabsTrigger
                  value="requirements"
                  className="gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-lg text-xs"
                >
                  <FileCheck2 className="h-4 w-4 text-emerald-600" />
                  <span>Extracted Requirements</span>
                  {requirement && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                </TabsTrigger>

                <TabsTrigger
                  value="gap-audit"
                  className="gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-lg text-xs"
                >
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Reverse Tender Gap Analysis</span>
                </TabsTrigger>

                <TabsTrigger
                  value="citations-evidence"
                  className="gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-lg text-xs"
                >
                  <Scale className="h-4 w-4 text-indigo-500" />
                  <span>Statutory Citations &amp; Evidence Trail</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-sans font-medium">
                    {(evidence?.length || 0) + (recommendations?.length || liveStandards?.length || 0)}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* TAB 1: EXTRACTED REQUIREMENTS (NO RAW JSON!) */}
        {selectedId && activeTab === 'requirements' && (
          <div>
            {requirement ? (
              <RequirementsInspectionView
                requirement={requirement}
                onSearchKeyword={handleKeywordSearch}
                onOpenClauseStudio={() => {
                  const targetProc =
                    currentProcurement ||
                    procurements.find((p) => (p._id || p.id) === selectedId) ||
                    null;
                  navigate(`/clause-studio?id=${selectedId}`, {
                    state: {
                      procurementId: selectedId,
                      procurement: targetProc,
                      requirement,
                    },
                  });
                }}
              />
            ) : (
              <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-slate-400 space-y-4">
                <FileCheck2 className="h-10 w-10 mx-auto text-slate-300" />
                <div>
                  <h3 className="text-base font-serif font-semibold text-slate-800">Tender Requirements Not Yet Extracted</h3>
                </div>
                <div>
                  <Button
                    variant="royal"
                    size="sm"
                    loading={isAuditing}
                    onClick={handleRunAnalysis}
                    iconLeft={FileCheck2}
                  >
                    Analyze Tender
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REVERSE TENDER GAP AUDIT (BEFORE VS AFTER SPLIT) */}
        {selectedId && activeTab === 'gap-audit' && (
          <GapAnalysisSplitView
            procurementId={selectedId}
            procurement={currentProcurement || procurements.find((p) => (p._id || p.id) === selectedId)}
            requirement={requirement}
          />
        )}

        {/* TAB 3: STATUTORY CITATIONS & EVIDENCE TRAIL */}
        {selectedId && activeTab === 'citations-evidence' && (
          <CitationsEvidenceView
            recommendations={recommendations}
            evidence={evidence}
            matchedStandards={liveStandards}
            onInspectGraph={(stdId) => navigate(`/normative-graph?id=${stdId}`)}
            onAddToClause={() => {
              const targetProc =
                currentProcurement ||
                procurements.find((p) => (p._id || p.id) === selectedId) ||
                null;
              navigate(`/clause-studio?id=${selectedId}`, {
                state: {
                  procurementId: selectedId,
                  procurement: targetProc,
                  requirement,
                },
              });
            }}
          />
        )}

        {/* Empty State when no procurement selected */}
        {!selectedId && (
          <div className="bg-white border border-brand-border rounded-2xl p-16 text-center text-slate-400 space-y-3">
            <FileCheck2 className="h-12 w-12 mx-auto text-slate-300" />
            <h3 className="text-lg font-serif font-semibold text-slate-800">No Procurement Tender Selected</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-normal font-sans leading-relaxed">
              Select an existing procurement tender from the dropdown above to analyze technical specifications, check obsolete standards, and review statutory citations.
            </p>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}
