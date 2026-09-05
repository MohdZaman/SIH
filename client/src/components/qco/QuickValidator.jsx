import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { apiClient } from '../../api';

export default function QuickValidator() {
  const [standardCode, setStandardCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedStandard, setMatchedStandard] = useState(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(null);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!standardCode.trim()) return;

    setLoading(true);
    setError(null);
    setChecked(false);
    try {
      const res = await apiClient.get(`/standard/search?q=${encodeURIComponent(standardCode.trim())}`);
      const match = res.standards?.find((s) =>
        s.code.toLowerCase().includes(standardCode.trim().toLowerCase())
      ) || res.standards?.[0] || null;

      setMatchedStandard(match);
      setChecked(true);
    } catch (err) {
      setError(err.message || 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="h-5 w-5 text-brand-blue" />
        <h3 className="text-sm font-bold text-slate-900">
          Instant BIS Standard & Specification Verification
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Validate any Indian Standard code directly against the Bureau of Indian Standards master index.
      </p>

      <form onSubmit={handleValidate} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={standardCode}
            onChange={(e) => setStandardCode(e.target.value)}
            placeholder="Enter standard code (e.g., IS 10322, IS 1786, IS 15885)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-blue"
          />
        </div>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Verifying...' : 'Validate Standard'}
        </Button>
      </form>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {checked && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in">
          {matchedStandard ? (
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{matchedStandard.code}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Valid BIS Standard
                  </span>
                </div>
                <p className="font-medium text-slate-700 mb-1">{matchedStandard.title}</p>
                <p className="text-slate-500 text-[11px] mb-2">{matchedStandard.description}</p>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                  <span>Category: <strong>{matchedStandard.category || 'General'}</strong></span>
                  <span>•</span>
                  <span>Status: <strong>{matchedStandard.status || 'Active'}</strong></span>
                  <span>•</span>
                  <span>Version: <strong>{matchedStandard.latestVersion || 'Current'}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <XCircle className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 mb-0.5">Standard Not Found in BIS Registry</p>
                <p className="text-slate-500 text-[11px]">
                  "{standardCode}" could not be correlated to an active BIS standard code. Verify the designation prefix (e.g., IS, IS/IEC, SP).
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
