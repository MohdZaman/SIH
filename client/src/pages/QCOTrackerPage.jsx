import React from 'react';
import { ShieldCheck, Scale, FileText, Download } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GazetteGrid from '../components/qco/GazetteGrid';
import QuickValidator from '../components/qco/QuickValidator';
import Button from '../components/common/Button';

export default function QCOTrackerPage() {
  return (
    <DashboardLayout
      headerTitle="Legal & Statutory QCO / CRS Compliance Tracker"
      headerSubtitle="Real-time Gazette notification tracker for Quality Control Orders issued under Section 16 of the BIS Act, 2016."
      actions={
        <Button
          variant="outline"
          size="sm"
          iconLeft={Download}
          onClick={() => alert('Downloading official DPIIT Gazette compendium PDF')}
        >
          Download QCO Compendium
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statutory Enforcement Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Statutory Government Procurement Rule:</span>
              <p className="mt-0.5 text-amber-800">
                Under DPIIT mandatory orders, no central ministry, department, PSU, or autonomous entity may accept bids or release payment for products lacking an authentic Bureau of Indian Standards (BIS) standard mark license.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Bidder / OEM License Validator */}
        <QuickValidator />

        {/* Gazette Notification Grid with Ministry Filters */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Gazette Notifications & Statutory Orders
              </h2>
              <p className="text-xs text-slate-500">
                Updated weekly from the Department for Promotion of Industry and Internal Trade (DPIIT)
              </p>
            </div>
          </div>

          <GazetteGrid />
        </div>
      </div>
    </DashboardLayout>
  );
}
