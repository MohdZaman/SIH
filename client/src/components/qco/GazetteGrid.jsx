import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, ExternalLink, Calendar, Building, AlertCircle } from 'lucide-react';
import { apiClient } from '../../api';

export default function GazetteGrid() {
  const [qcos, setQcos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQCOStandards = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/standard/search?q=${encodeURIComponent('QCO mandatory')}`);
        setQcos(res.standards || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch statutory QCO records');
      } finally {
        setLoading(false);
      }
    };

    fetchQCOStandards();
  }, []);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Statutory Notice: {error}</span>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center text-xs text-slate-500">
          Loading statutory Quality Control Orders from BIS index...
        </div>
      )}

      {!loading && qcos.length === 0 && !error && (
        <div className="bg-white border border-brand-border rounded-xl p-8 text-center text-slate-400">
          <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-700">No statutory QCO standards indexed yet</p>
          <p className="text-[11px] text-slate-500 mt-1">Check back once DPIIT gazette notices have synced.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qcos.map((qco) => (
          <div
            key={qco._id}
            className="bg-white border border-brand-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {qco.code}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Enforced
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1 line-clamp-2">
                {qco.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                {qco.description || 'Statutory Quality Control Order mandated under BIS Act 2016.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {qco.category || 'DPIIT / BIS'}
              </span>
              <span className="font-mono text-slate-500">v{qco.latestVersion || '1.0'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
