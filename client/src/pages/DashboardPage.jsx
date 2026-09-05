import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
  Award,
  Layers,
  Search,
  ArrowRight,
  AlertCircle,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/common/MetricCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardSummary,
  createProcurement,
} from '../features/procurement/procurementSlice';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    dashboardSummary,
    recentProcurements,
    recentRecommendations,
    loading,
    error,
  } = useSelector((state) => state.procurement);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProcurement, setNewProcurement] = useState({
    name: '',
    description: '',
    type: 'Goods',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProcurement.name.trim() || !newProcurement.description.trim()) return;

    setSubmitting(true);
    try {
      await dispatch(createProcurement(newProcurement)).unwrap();
      setIsCreateModalOpen(false);
      setNewProcurement({ name: '', description: '', type: 'Goods' });
      await dispatch(fetchDashboardSummary()).unwrap();
    } catch (err) {
      alert(err.message || 'Failed to create procurement');
    } finally {
      setSubmitting(false);
    }
  };

  const summary = dashboardSummary || {
    totalProcurements: 0,
    totalRequirements: 0,
    totalRecommendations: 0,
    highConfidence: 0,
    needsReview: 0,
  };

  return (
    <DashboardLayout
      headerTitle={`Welcome${user?.name ? `, ${user.name}` : ''}`}
      headerSubtitle="Real-time BIS technical specifications and procurement dashboard"
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            variant="royal"
            size="sm"
            iconLeft={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Procurement
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Backend Error Alert if connection issues */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Backend Notice: {error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDashboardSummary()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* 3 Real KPI Metric Cards based on getDashboardSummary response */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MetricCard
            title="Total Procurements"
            value={summary.totalProcurements}
            subtitle="Registered procurement tenders"
            trend={summary.totalRequirements ? `${summary.totalRequirements} Requirements Extracted` : 'Active'}
            trendType="success"
            icon={FileText}
            badgeIconBg="bg-blue-50 text-brand-blue"
            sparklineColor="#2563EB"
            sparklineData={[0, 2, summary.totalProcurements]}
          />

          <MetricCard
            title="Total Recommendations"
            value={summary.totalRecommendations}
            subtitle="Authoritative standards identified"
            trend={summary.highConfidence ? `${summary.highConfidence} High Confidence` : 'Live Analysis'}
            trendType="success"
            icon={CheckCircle2}
            badgeIconBg="bg-emerald-50 text-emerald-600"
            sparklineColor="#10B981"
            sparklineData={[0, 1, summary.totalRecommendations]}
          />

          <MetricCard
            title="Needs Officer Review"
            value={summary.needsReview}
            subtitle="Relevance scores under 70%"
            trend={summary.needsReview > 0 ? 'Requires Evaluation' : 'Zero Flags'}
            trendType={summary.needsReview > 0 ? 'warning' : 'success'}
            icon={ShieldAlert}
            badgeIconBg="bg-amber-50 text-amber-600"
            sparklineColor="#F59E0B"
            sparklineData={[summary.needsReview, summary.needsReview]}
          />
        </div>

        {/* Recent Procurements Table */}
        <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Procurements
              </h2>
              <p className="text-xs text-slate-500">
                Tenders managed in this agency workspace
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Add Procurement
            </Button>
          </div>

          {recentProcurements.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No procurements registered yet</p>
              <p className="text-[11px] mt-1">Create your first tender procurement to begin standard recommendation.</p>
              <div className="mt-4">
                <Button
                  variant="royal"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Tender Procurement
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Title / Identifier</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentProcurements.map((proc) => (
                    <tr key={proc._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {proc.title || proc.name || 'Untitled Procurement'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-sm truncate">
                        {proc.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-brand-blue border border-blue-200/60">
                          {proc.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {proc.createdAt ? new Date(proc.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/tender-auditor?id=${proc._id}`)}
                        >
                          Audit Tender
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Recommendations Table */}
        {recentRecommendations?.length > 0 && (
          <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">
                Latest Standards Recommendations
              </h2>
              <p className="text-xs text-slate-500">
                Matched against procurement requirements by the AI matching engine
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {recentRecommendations.map((rec, index) => (
                <div key={rec._id || index} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {rec.code}
                      </span>
                      <span className="font-semibold text-slate-900">{rec.title}</span>
                    </div>
                    {rec.reason && (
                      <p className="text-slate-600 mt-1 max-w-2xl">{rec.reason}</p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Score: {rec.relevanceScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Procurement Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Tender Procurement"
        subtitle="Registers a new procurement in the backend database for AI clause audit and recommendation."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Procurement Name / Tender Title
            </label>
            <input
              type="text"
              required
              value={newProcurement.name}
              onChange={(e) => setNewProcurement({ ...newProcurement, name: e.target.value })}
              placeholder="e.g. Highway Streetlighting Fixtures NIT-2024"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Procurement Type
            </label>
            <select
              value={newProcurement.type}
              onChange={(e) => setNewProcurement({ ...newProcurement, type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-brand-blue"
            >
              <option value="Goods">Goods / Equipment</option>
              <option value="Works">Civil / Engineering Works</option>
              <option value="Services">Technical Services</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technical Description / Scope of Work
            </label>
            <textarea
              rows={4}
              required
              value={newProcurement.description}
              onChange={(e) => setNewProcurement({ ...newProcurement, description: e.target.value })}
              placeholder="Detailed description of goods, specifications, voltage ratings, materials, ingress ratings..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-brand-blue resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="royal"
              size="sm"
              loading={submitting}
            >
              Save Procurement
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
