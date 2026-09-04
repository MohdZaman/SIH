import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertCircle,
  FileCheck,
  Tag,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { searchStandards } from '../features/standards/standardSlice';

export default function SpecRecommenderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { standards, searchCount, loading, error } = useSelector((state) => state.standards);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    try {
      await dispatch(searchStandards(searchInput.trim())).unwrap();
    } catch {
      // Handled in Redux slice
    }
  };

  return (
    <DashboardLayout
      headerTitle="BIS Standard Search & Recommendation"
      headerSubtitle="Execute semantic and keyword queries against the Bureau of Indian Standards master index."
    >
      <div className="space-y-6">
        {/* Search Console */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-brand-blue" />
              <span className="text-xs font-medium uppercase tracking-normal text-slate-700">
                Live BIS Standard Search
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter standard code (e.g. IS 10322) or technical product description..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-blue"
                />
              </div>

              <Button
                type="submit"
                variant="royal"
                size="md"
                loading={loading}
                iconLeft={Search}
              >
                Search Standards
              </Button>
            </div>
          </form>
        </div>

        {/* Backend Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Search error: {error}</span>
          </div>
        )}

        {/* Search Results Display */}
        {standards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                Found {searchCount || standards.length} standard(s) matching query
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {standards.map((std) => (
                <div
                  key={std._id || std.code}
                  className="bg-white border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                        {std.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {std.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {std.status && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {std.status}
                        </span>
                      )}
                      {std.latestVersion && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          v{std.latestVersion}
                        </span>
                      )}
                    </div>
                  </div>

                  {std.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {std.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      {std.category && <span>Category: <strong>{std.category}</strong></span>}
                      {std.subcategory && <span>Subcategory: <strong>{std.subcategory}</strong></span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconRight={ArrowRight}
                        onClick={() => navigate(`/normative-graph?id=${std._id}`)}
                      >
                        Inspect Normative Graph
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && standards.length === 0 && !error && (
          <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-slate-400">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Standard Search Executed</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Enter an Indian Standard code or technical description above to fetch verified records from the BIS database.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}