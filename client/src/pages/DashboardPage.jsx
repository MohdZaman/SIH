import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  AlertCircle,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import CreateProcurementModal from '../components/procurement/CreateProcurementModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardSummary,
  deleteProcurement,
} from '../features/procurement/procurementSlice';
import { notify } from '@/lib/notify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    recentProcurements,
    loading,
    error,
  } = useSelector((state) => state.procurement);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      notify.error(error, 'Dashboard sync notice');
    }
  }, [error]);

  const handleDeleteTender = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const targetId = deleteTarget.id || deleteTarget._id;
      if (!targetId) {
        notify.error('Unable to identify tender ID');
        return;
      }

      await dispatch(deleteProcurement(targetId)).unwrap();
      dispatch(fetchDashboardSummary());
      setDeleteTarget(null);
      notify.success(`Procurement tender "${deleteTarget.title || deleteTarget.name || 'item'}" deleted successfully`);
    } catch (err) {
      console.error('Failed to delete procurement:', err);
      notify.error('Failed to remove procurement tender');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout
      headerTitle="Procurement Dashboard"
      headerSubtitle="Real-time monitoring of active procurements, standards compliance, and technical audit flags."
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
        {/* Recent Procurements Table Card */}
        <Card className="bg-white border-slate-200/90 shadow-2xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <CardTitle className="text-lg font-serif font-semibold text-slate-900">
                Recent Procurements
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-sans mt-0.5">
                Tenders managed in this agency workspace
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Add Procurement
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {recentProcurements.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium text-slate-600">No procurements registered yet</p>
                <p className="text-[11px] mt-1 font-normal">Create your first tender procurement to begin standard recommendation.</p>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-4/12">Title / Identifier</TableHead>
                    <TableHead className="w-4/12">Description</TableHead>
                    <TableHead className="w-1/12">Status</TableHead>
                    <TableHead className="w-1/12">Created Date</TableHead>
                    <TableHead className="text-right w-2/12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProcurements.map((proc) => {
                    const procId = proc._id || proc.id;
                    return (
                      <TableRow key={procId} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-medium text-slate-900 py-3.5">
                          {proc.title || proc.name || 'Untitled Procurement'}
                        </TableCell>
                        <TableCell className="text-slate-600 max-w-sm truncate font-normal py-3.5">
                          {proc.description}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Badge variant="emerald" className="font-medium">
                            {proc.status || 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs font-normal py-3.5">
                          {proc.createdAt ? new Date(proc.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/tender-auditor?id=${procId}`)}
                            >
                              Analyze Tender
                            </Button>
                            <button
                              type="button"
                              title="Delete Tender"
                              aria-label={`Delete ${proc.title || proc.name || 'tender'}`}
                              onClick={() => setDeleteTarget(proc)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200/80 hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        title="Delete Tender"
        subtitle="This action will permanently delete this procurement tender."
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={isDeleting}
              iconLeft={Trash2}
              onClick={handleDeleteTender}
            >
              Delete Tender
            </Button>
          </>
        }
      >
        <div className="text-xs text-slate-600 space-y-3 font-sans">
          <p>
            Are you sure you want to delete{' '}
            <strong className="font-semibold text-slate-900">
              {deleteTarget?.title || deleteTarget?.name || 'this tender'}
            </strong>
            ?
          </p>
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-800 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>
              All extracted specifications, compliance audits, and AI analyses linked to this procurement will be permanently removed.
            </span>
          </div>
        </div>
      </Modal>

      {/* Create Procurement Modal with Dual Text & PDF Document Upload */}
      <CreateProcurementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          dispatch(fetchDashboardSummary());
        }}
      />
    </DashboardLayout>
  );
}
