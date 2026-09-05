import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Network, Search, AlertCircle, Layers } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStandardGraph } from '../features/standards/standardSlice';

export default function NormativeGraphPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { standardGraph, loading, error } = useSelector((state) => state.standards);
  const [standardId, setStandardId] = useState(searchParams.get('id') || '');
  const [depth, setDepth] = useState(1);

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) {
      setStandardId(paramId);
      dispatch(fetchStandardGraph({ id: paramId, depth }));
    }
  }, [searchParams, depth, dispatch]);

  const handleFetch = (e) => {
    e.preventDefault();
    if (!standardId.trim()) return;
    dispatch(fetchStandardGraph({ id: standardId.trim(), depth }));
  };

  const graphData = standardGraph?.graph;
  const standardInfo = standardGraph?.standard;

  return (
    <DashboardLayout
      headerTitle="Normative Dependency Graph Canvas"
      headerSubtitle="Explore hierarchical standard relationships and multi-hop testing dependencies directly from the backend graph service."
    >
      <div className="space-y-6">
        {/* Standard ID / Depth Control Bar */}
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm">
          <form onSubmit={handleFetch} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Database ID (MongoDB ObjectId)
              </label>
              <input
                type="text"
                value={standardId}
                onChange={(e) => setStandardId(e.target.value)}
                placeholder="e.g. 64f1a2b3c4d5e6f7a8b9c0d1 or inspect via Spec Recommender"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 outline-none focus:border-brand-blue"
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Graph Depth
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-brand-blue"
              >
                <option value={1}>1 Tier</option>
                <option value={2}>2 Tiers</option>
                <option value={3}>3 Tiers</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="royal"
              size="md"
              loading={loading}
              iconLeft={Search}
            >
              Load Graph
            </Button>
          </form>
        </div>

        {/* Backend Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Graph Error: {error}</span>
          </div>
        )}

        {/* Standard Header Details if loaded */}
        {standardInfo && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-brand-blue font-mono text-sm mr-2">
                {standardInfo.code}
              </span>
              <span className="font-semibold text-slate-900">{standardInfo.title}</span>
              {standardInfo.version && (
                <span className="ml-2 text-slate-500">Edition: {standardInfo.version}</span>
              )}
            </div>
            <div className="text-slate-600">
              Depth: <strong>{standardGraph.depth || depth}</strong>
            </div>
          </div>
        )}

        {/* Graph Canvas */}
        {graphData ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 min-h-[460px] text-white">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-brand-blue" />
                <h3 className="text-sm font-bold">Backend Dependency Nodes & Edges</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {graphData.nodes?.length || 0} Nodes • {graphData.edges?.length || 0} Edges
              </span>
            </div>

            {/* Render Nodes List or SVG layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {graphData.nodes?.map((node, i) => (
                <div
                  key={node.id || i}
                  className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-blue font-mono">{node.code || node.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                      {node.type || 'Standard'}
                    </span>
                  </div>
                  {node.title && <p className="text-slate-300 text-[11px]">{node.title}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading && (
            <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-slate-400">
              <Network className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">No Standard Graph Loaded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Enter a Standard ObjectId above or click "Inspect Normative Graph" on any standard in Spec Recommender.
              </p>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
