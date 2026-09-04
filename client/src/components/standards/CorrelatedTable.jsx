import React from 'react';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import Badge from '../common/Badge';

export default function CorrelatedTable({ standards = [] }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Correlated Technical Standards & Subassemblies
          </h3>
          <p className="text-xs text-slate-500">
            Component standards required for full BoQ technical compliance
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
          {standards.length} Subordinate Standards
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4">Standard Number</th>
              <th className="py-3 px-4">Title & Scope</th>
              <th className="py-3 px-4">Correlation Relevance</th>
              <th className="py-3 px-4">Subsystem Category</th>
              <th className="py-3 px-4">Compliance Scheme</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {standards.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                  {item.code}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs">
                  {item.title}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-blue">{item.relevance}</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-blue rounded-full"
                        style={{ width: item.relevance }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {item.category}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    {item.complianceScheme}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => alert(`Viewing cross-reference specification for ${item.code}`)}
                    className="text-brand-blue hover:text-brand-blue-hover font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Spec</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}