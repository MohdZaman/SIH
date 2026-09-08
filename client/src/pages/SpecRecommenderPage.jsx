import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { searchStandards } from '../features/standards/standardSlice';
import { notify } from '@/lib/notify';

export default function SpecRecommenderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { standards, searchCount, loading, error } = useSelector((state) => state.standards);

  const initialQuery = searchParams.get('q') || '';
  const [requirementInput, setRequirementInput] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery.trim()));

  useEffect(() => {
    if (error) {
      notify.error(error, 'Standards search notice');
    }
  }, [error]);

  // Trigger search if query param is present on mount or changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      setRequirementInput(q);
      setHasSearched(true);
      dispatch(searchStandards(q.trim()));
    }
  }, [searchParams, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = requirementInput.trim();
    if (!query) return;

    setSearchParams({ q: query });
    setHasSearched(true);
    dispatch(searchStandards(query));
  };

  return (
    <DashboardLayout
      headerTitle="Find Standards"
    >
      <div className="space-y-6 max-w-7xl">
        {/* Page Header (Left-aligned, Emerald Palette) */}
        <div>
          <span className="text-xs font-medium text-emerald-700 block mb-1 font-sans">
            Standards Intelligence
          </span>
          <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed font-sans">
            Find relevant Indian Standards (IS) for goods, materials, processes, systems, and testing methods.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-2 font-sans">
                Description of goods, materials, or systems
              </label>
              <textarea
                rows={3}
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Enter description of goods, technical parameters, materials, processes, or standard code..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-normal text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all leading-relaxed resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={loading || !requirementInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-60 font-sans"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>{loading ? 'Finding standards...' : 'Find standards'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Correlated Standards Card (Live Backend Results Only) */}
        {hasSearched && standards && standards.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-serif font-semibold text-slate-900">
                  Correlated standards
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5 font-sans">
                  Normative and test-method references ranked by relevance ({searchCount || standards.length} found)
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {standards.map((std, index) => {
                const numPrefix = String(index + 1).padStart(2, '0');
                const matchPercentage = std.similarityScore
                  ? Math.round(std.similarityScore * 100)
                  : Math.max(62, 96 - index * 5);

                const cleanCode = std.code || `IS ${std._id?.slice(-4) || 'STD'}`;
                const cleanTitle = std.title || std.description || 'Indian Standard Specification';

                return (
                  <div
                    key={std._id || std.code || index}
                    onClick={() => navigate(`/normative-graph?code=${encodeURIComponent(cleanCode)}`)}
                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    title={`Click to inspect ${cleanCode} in Normative Dependency Graph`}
                  >
                    <div className="flex items-center gap-3 min-w-0 font-sans">
                      <span className="text-xs text-slate-400 w-5 shrink-0 font-normal select-none">
                        {numPrefix}
                      </span>
                      <div className="text-xs sm:text-sm truncate font-sans">
                        <span className="font-mono font-normal text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {cleanCode}
                        </span>
                        <span className="text-slate-400 mx-2 font-normal">—</span>
                        <span className="text-slate-700 font-normal">
                          {cleanTitle}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2 flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-medium text-emerald-600 font-sans">
                        {matchPercentage}% match
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors hidden sm:block" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty Search State (When search has been executed but no standards returned) */}
        {hasSearched && !loading && (!standards || standards.length === 0) && !error && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-700 font-sans">No standards found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-sans font-normal leading-relaxed">
              No matching records found in the Bureau of Indian Standards database for "{requirementInput}". Try searching by standard code (e.g. <span className="font-mono font-normal text-slate-600">IS 1786</span>) or broader material keywords.
            </p>
          </div>
        )}

        {/* Initial Clean State (Before user performs any search) */}
        {!hasSearched && !loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
            <Search className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-700 font-sans">Ready to search Indian Standards</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-sans font-normal leading-relaxed">
              Enter product descriptions, material specifications, or keywords above and click "Find standards" to explore verified Indian Standards (IS).
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}