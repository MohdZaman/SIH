import React, { useState } from 'react';
import {
  Building,
  User,
  Key,
  Shield,
  Sliders,
  Check,
  Save,
  Lock,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import { useSelector } from 'react-redux';

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const [apiKey, setApiKey] = useState('manak_live_sec_994821a8901cf');
  const [copiedKey, setCopiedKey] = useState(false);

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

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <DashboardLayout
      headerTitle="Department Settings & Officer Profile"
      headerSubtitle="Manage procurement agency credentials, GeM integration keys, and departmental audit tolerance thresholds."
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
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-brand-blue">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Procuring Organization & Nodal Officer
              </h2>
              <p className="text-xs text-slate-500">
                Official Ministry, Central PSU, or State Department profile details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                Account ID (Database ObjectId)
              </label>
              <input
                type="text"
                readOnly
                value={user?._id || user?.id || 'N/A'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                Role / Designation
              </label>
              <input
                type="text"
                readOnly
                value={user?.role || 'Procurement Officer'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                Officer Name
              </label>
              <input
                type="text"
                readOnly
                value={user?.name || 'Authorized Officer'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                Registered Email
              </label>
              <input
                type="text"
                readOnly
                value={user?.email || 'N/A'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none"
              />
            </div>
          </div>

          {/* API Access Token Section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center gap-1.5">
              <Key className="h-4 w-4 text-brand-blue" />
              <span>ManakAI GeM Live REST API Access Token</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                readOnly
                value={apiKey}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyApiKey}
              >
                {copiedKey ? 'Copied' : 'Copy Key'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconLeft={RefreshCw}
                onClick={() => {
                  setApiKey(`manak_live_sec_${Math.random().toString(36).substring(2, 12)}`);
                  alert('Generated new GeM API credentials.');
                }}
              >
                Rotate
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Authorizes direct integration with your enterprise SAP/ERP or internal tender management system.
            </p>
          </div>
        </div>

        {/* Audit Rule Customization */}
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Departmental Audit Tolerance Thresholds
              </h2>
              <p className="text-xs text-slate-500">
                Configure automated compliance flags and statutory validation rigidity
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-start justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="max-w-xl">
                <span className="font-bold text-slate-900 block text-xs">
                  Strict Obsolete Standard Rejection
                </span>
                <span className="text-slate-500 text-[11px]">
                  Instantly flag and block any tender draft citing withdrawn BIS editions (e.g. IS 1786:1985).
                </span>
              </div>
              <input
                type="checkbox"
                checked={rules.strictSupersededRejection}
                onChange={() => toggleRule('strictSupersededRejection')}
                className="mt-1 rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="max-w-xl">
                <span className="font-bold text-slate-900 block text-xs">
                  Mandatory NABL Test Validity Threshold (&lt; 180 Days)
                </span>
                <span className="text-slate-500 text-[11px]">
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

            <label className="flex items-start justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="max-w-xl">
                <span className="font-bold text-slate-900 block text-xs">
                  Enforce Pre-dispatch Third Party Inspection (TPI) for Contracts &gt; ₹50 Lakhs
                </span>
                <span className="text-slate-500 text-[11px]">
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

            <label className="flex items-start justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="max-w-xl">
                <span className="font-bold text-slate-900 block text-xs">
                  Notify Departmental Technical Review Committee on High-Risk Flags
                </span>
                <span className="text-slate-500 text-[11px]">
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
        </div>
      </div>
    </DashboardLayout>
  );
}
