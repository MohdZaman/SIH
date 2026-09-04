import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  FileEdit,
  Download,
  Filter,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function TenderTable({ tenders = [], onSelectTender }) {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const filtered = tenders.filter((tender) => {
    const matchesCategory =
      filterCategory === 'all'
        ? true
        : filterCategory === 'high-risk'
        ? tender.statusType === 'critical' || tender.statusType === 'warning'
        : true;

    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map((t) => t.id));
    }
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden">
      {/* Table Filter & Search Action Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category filter pills */}
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories ({tenders.length})
          </button>

          <button
            onClick={() => setFilterCategory('high-risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'high-risk'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
            High Risk Flagged
          </button>

          <Button variant="outline" size="sm" iconLeft={Filter}>
            More Filters
          </Button>
        </div>

        {/* Search input in table bar */}
        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter table tenders..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4 w-10">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {selectedRows.length > 0 && selectedRows.length === filtered.length ? (
                    <CheckSquare className="h-4 w-4 text-brand-blue" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Tender Title & NIT Identifier</th>
              <th className="py-3 px-4">Standard Coverage</th>
              <th className="py-3 px-4">Compliance Status</th>
              <th className="py-3 px-4">Reviewers</th>
              <th className="py-3 px-4">Sector / Division</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tender) => {
              const isSelected = selectedRows.includes(tender.id);

              return (
                <tr
                  key={tender.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleRow(tender.id)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-brand-blue" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>

                  {/* Tender Title */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 hover:text-brand-blue cursor-pointer"
                      onClick={() => {
                        if (onSelectTender) onSelectTender(tender);
                        navigate('/tender-auditor');
                      }}
                    >
                      {tender.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span className="font-mono text-slate-500 font-medium">{tender.id}</span>
                      <span>•</span>
                      <span>Updated {tender.updatedAt}</span>
                      <span>•</span>
                      <span className="text-brand-blue font-mono">{tender.isStandardCode}</span>
                    </div>
                  </td>

                  {/* Coverage Progress Bar */}
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>{tender.coveragePercent}%</span>
                      <span className="text-[10px] text-slate-400">BIS Met</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          tender.coveragePercent >= 90
                            ? 'bg-brand-blue'
                            : tender.coveragePercent >= 60
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${tender.coveragePercent}%` }}
                      />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={tender.statusType} size="sm" dot>
                      {tender.status}
                    </Badge>
                  </td>

                  {/* Stacked Reviewer Avatars */}
                  <td className="py-3.5 px-4">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {tender.reviewers.map((rev, i) => (
                        <div
                          key={i}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 ring-2 ring-white text-[10px] font-bold text-white uppercase"
                        >
                          {rev}
                        </div>
                      ))}
                      {tender.reviewersCount > tender.reviewers.length && (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 ring-2 ring-white text-[10px] font-bold text-slate-600">
                          +{tender.reviewersCount - tender.reviewers.length}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Sector */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{tender.sector}</div>
                    <div className="text-[11px] text-slate-400">{tender.department}</div>
                  </td>

                  {/* Action Icons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Audit Tender Clauses"
                        onClick={() => {
                          if (onSelectTender) onSelectTender(tender);
                          navigate('/tender-auditor');
                        }}
                        className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Edit / Re-synthesize"
                        onClick={() => navigate('/clause-studio')}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                      >
                        <FileEdit className="h-4 w-4" />
                      </button>
                      <button
                        title="Export GeM Document"
                        onClick={() => alert(`Exporting GeM draft package for ${tender.id}`)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
