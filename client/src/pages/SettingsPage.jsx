import React, { useState } from 'react';
import {
  Building,
  Sliders,
  Save,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);

  const [rules, setRules] = useState({
    strictSupersededRejection: true,
    mandatoryNabl180Days: true,
    forceTpiForHighValue: true,
    allowDualCertification: false,
    autoNotifyReviewCommittee: true,
  });

  const toggleRule = (key) => {
    setRules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout
      headerTitle="Department Settings & Officer Profile"
      headerSubtitle="Manage procurement agency credentials, officer profile, and departmental audit tolerance thresholds."
      actions={
        <Button
          variant="royal"
          size="sm"
          iconLeft={Save}
          onClick={() => alert('Settings successfully updated.')}
        >
          Save Configuration
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Organization Profile Card */}
        <Card className="bg-white border-slate-200/90 shadow-2xs">
          <CardHeader className="flex flex-row items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-blue-50 text-brand-blue shrink-0">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif font-semibold text-slate-900">
                Procuring Organization &amp; Nodal Officer
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-sans font-normal mt-0.5">
                Official Ministry, Central PSU, or State Department profile details
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <label className="block text-slate-600 font-medium text-xs mb-1.5">
                  Officer Name
                </label>
                <Input
                  type="text"
                  readOnly
                  value={user?.name || 'Authorized Officer'}
                  className="bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium text-xs mb-1.5">
                  Government Employee ID
                </label>
                <Input
                  type="text"
                  readOnly
                  value={user?.employeeID || 'N/A'}
                  className="bg-slate-50 text-slate-800 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium text-xs mb-1.5">
                  Role / Designation
                </label>
                <Input
                  type="text"
                  readOnly
                  value={user?.role || 'OFFICIAL'}
                  className="bg-slate-50 text-slate-800 uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium text-xs mb-1.5">
                  Registered Email
                </label>
                <Input
                  type="text"
                  readOnly
                  value={user?.email || 'N/A'}
                  className="bg-slate-50 text-slate-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Rule Customization */}
        <Card className="bg-white border-slate-200/90 shadow-2xs">
          <CardHeader className="flex flex-row items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif font-semibold text-slate-900">
                Departmental Audit Tolerance Thresholds
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-sans font-normal mt-0.5">
                Configure automated compliance flags and statutory validation rigidity
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="space-y-3.5 text-xs font-sans">
              <label className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="max-w-xl">
                  <span className="font-medium text-slate-900 block text-xs">
                    Strict Obsolete Standard Rejection
                  </span>
                  <span className="text-slate-500 text-[11px] font-normal leading-relaxed">
                    Instantly flag and block any tender draft citing withdrawn BIS editions (e.g. <span className="font-mono font-normal text-slate-600">IS 1786:1985</span>).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rules.strictSupersededRejection}
                  onChange={() => toggleRule('strictSupersededRejection')}
                  className="mt-1 rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                />
              </label>

              <label className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="max-w-xl">
                  <span className="font-medium text-slate-900 block text-xs">
                    Mandatory NABL Test Validity Threshold (&lt; 180 Days)
                  </span>
                  <span className="text-slate-500 text-[11px] font-normal leading-relaxed">
                    Reject vendor test reports older than 6 months for critical safety and electrical items.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rules.mandatoryNabl180Days}
                  onChange={() => toggleRule('mandatoryNabl180Days')}
                  className="mt-1 rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                />
              </label>

              <label className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="max-w-xl">
                  <span className="font-medium text-slate-900 block text-xs">
                    Enforce Pre-dispatch Third Party Inspection (TPI) for Contracts &gt; ₹50 Lakhs
                  </span>
                  <span className="text-slate-500 text-[11px] font-normal leading-relaxed">
                    Automatically insert mandatory RITES / EIL inspection clauses into synthesized BoQs.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rules.forceTpiForHighValue}
                  onChange={() => toggleRule('forceTpiForHighValue')}
                  className="mt-1 rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                />
              </label>

              <label className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="max-w-xl">
                  <span className="font-medium text-slate-900 block text-xs">
                    Notify Departmental Technical Review Committee on High-Risk Flags
                  </span>
                  <span className="text-slate-500 text-[11px] font-normal leading-relaxed">
                    Send automated alerts to nodal engineers when a BoQ audit detects missing testing requirements.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rules.autoNotifyReviewCommittee}
                  onChange={() => toggleRule('autoNotifyReviewCommittee')}
                  className="mt-1 rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
