import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Network,
  Search,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
  FileCheck2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import NormativeGraphCanvas from '../components/graph/NormativeGraphCanvas';
import NodeInspectorDrawer from '../components/graph/NodeInspectorDrawer';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStandardGraph,
  fetchStandardGraphByCode,
  searchStandards,
} from '../features/standards/standardSlice';
import {
  DEFAULT_IS_1786_GRAPH,
  buildNormativeGraphFromBackend,
} from '../utils/normativeGraphData';
import { notify } from '@/lib/notify';

const POPULAR_STANDARDS = [
  { code: 'IS 1786', label: 'IS 1786: TMT Reinforcement Bars (Default)' },
  { code: 'IS 456', label: 'IS 456: Concrete Code of Practice' },
  { code: 'IS 10322', label: 'IS 10322: Streetlighting Luminaires' },
  { code: 'IS 6909', label: 'IS 6909: Supersulphated Cement' },
  { code: 'IS 302', label: 'IS 302: Electrical Appliances Safety' },
];

export default function NormativeGraphPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { standardGraph, loading, error } = useSelector((state) => state.standards);

  const initialQuery = searchParams.get('id') || searchParams.get('code') || 'IS 1786';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedNode, setSelectedNode] = useState(null);
  const [drawerNode, setDrawerNode] = useState(null);

  // Auto-fetch on mount with the initial query
  useEffect(() => {
    const query = searchParams.get('id') || searchParams.get('code') || 'IS 1786';
    setSearchQuery(query);

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query.trim());
    if (isObjectId) {
      dispatch(fetchStandardGraph({ id: query.trim() }));
    } else {
      dispatch(fetchStandardGraphByCode({ code: query.trim() }));
    }
  }, [searchParams, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchParams({ code: searchQuery.trim() });
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(searchQuery.trim());
    if (isObjectId) {
      dispatch(fetchStandardGraph({ id: searchQuery.trim() }));
    } else {
      dispatch(fetchStandardGraphByCode({ code: searchQuery.trim() }));
    }
  };

  useEffect(() => {
    if (error) {
      notify.error(error, 'Normative graph notice');
    }
  }, [error]);

  const handleSelectQuickChip = (code) => {
    setSearchQuery(code);
    setSearchParams({ code });
    dispatch(fetchStandardGraphByCode({ code }));
  };

  // Build high-fidelity graph data combining backend API response and normative knowledge engine
  const activeGraphData = React.useMemo(() => {
    return buildNormativeGraphFromBackend(standardGraph, searchQuery);
  }, [standardGraph, searchQuery]);

  const handleInjectClause = (node) => {
    notify.success(`Inserted clause from ${node.label} into GeM Clause Studio!`);
    setTimeout(() => {
      navigate('/clause-studio');
    }, 1000);
  };

  return (
    <DashboardLayout
      headerTitle="Normative Dependency Graph Canvas"
      headerSubtitle="Interactive BIS Knowledge Graph visualizing hierarchical standards, test methods, material rules, statutory QCO orders, and NABL evidence."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* TOP SEARCH CONTROLS BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between font-sans">
                <span>BIS Standard Code</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter standard code (e.g. IS 1786) or database ID..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all font-sans"
                />
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <Button
              type="submit"
              variant="royal"
              size="md"
              loading={loading}
              iconLeft={Search}
              className="w-full sm:w-auto h-[42px]"
            >
              Load Graph
            </Button>
          </form>

          {/* Quick Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-sans">
            <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Quick Presets:</span>
            </span>
            {POPULAR_STANDARDS.map((p) => {
              const isActive =
                searchQuery.toUpperCase().trim() === p.code.toUpperCase().trim();
              return (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => handleSelectQuickChip(p.code)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-medium'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-normal'
                    }`}
                >
                  {p.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE STANDARD OVERVIEW BANNER */}
        {activeGraphData?.standard && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-semibold font-sans text-sm shrink-0 shadow-sm">
                IS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-normal text-slate-800 font-mono text-base">
                    {activeGraphData.standard.code}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-sans">
                    {activeGraphData.standard.status || 'Active'}
                  </span>
                  {activeGraphData.standard.version && (
                    <span className="text-xs text-slate-500 font-sans font-normal">
                      Edition: {activeGraphData.standard.version}
                    </span>
                  )}
                </div>
                <p className="text-xs font-normal text-slate-700 mt-0.5 max-w-2xl font-sans leading-relaxed">
                  {activeGraphData.standard.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center font-sans">
              <div className="text-right text-xs">
                <span className="text-slate-400 block text-xs font-normal">
                  Knowledge graph nodes
                </span>
                <span className="font-normal text-slate-700 text-xs">
                  {activeGraphData.nodes.length} Nodes • {activeGraphData.edges.length} Edges
                </span>
              </div>
            </div>
          </div>
        )}

        {/* NORMATIVE GRAPH CANVAS MATCHING THE UPLOADED IMAGE */}
        <NormativeGraphCanvas
          graphData={activeGraphData}
          selectedNode={selectedNode}
          onSelectNode={(node) => setSelectedNode(node)}
          onInjectClause={handleInjectClause}
        />

        {/* DRAWER FOR ADVANCED TESTING LABS & CLAUSE INJECTION IF REQUESTED */}
        {drawerNode && (
          <NodeInspectorDrawer
            node={drawerNode}
            onClose={() => setDrawerNode(null)}
            onInjectClause={handleInjectClause}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
