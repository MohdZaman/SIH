import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, BellRing } from 'lucide-react';
import { triggerToastSample } from './toast-presets';
import { getActiveToastDesign, setActiveToastDesign } from '@/lib/notify';

export default function ToastDesignShowcase() {
  const [activeDesign, setActiveDesignState] = useState(getActiveToastDesign);

  useEffect(() => {
    const handleUpdate = () => setActiveDesignState(getActiveToastDesign());
    window.addEventListener('toast_design_change', handleUpdate);
    return () => window.removeEventListener('toast_design_change', handleUpdate);
  }, []);

  const handleSelectDesign = (num) => {
    setActiveToastDesign(num);
    setActiveDesignState(num);
  };

  const designs = [
    {
      id: 1,
      name: 'Design 1: Modern Shadcn Minimalist',
      badge: 'Default Clean',
      badgeVariant: 'secondary',
      tagline: 'Precision monochrome card with crisp border and subtle status indicators.',
      features: [
        'Pure white card with fine 1px neutral border',
        'Subtle circular emerald check / rose alert icons',
        'Inline action link and minimal dismiss button',
      ],
      previewSuccess: {
        title: 'Specifications Saved Successfully',
        description: 'Updated clause parameters synced with GeM Portal.',
      },
      previewError: {
        title: 'Verification Conflict Detected',
        description: 'Selected standard IS 456 requires revision update.',
      },
    },
    {
      id: 2,
      name: 'Design 2: Status Glow / Rich Pill',
      badge: 'Vibrant Glass',
      badgeVariant: 'emerald',
      tagline: 'Soft pastel tinted glass cards with prominent status pill badges and icon chips.',
      features: [
        'Emerald-50 / Rose-50 tinted translucent background',
        'Floating icon container with matching border tone',
        'Status chip (SUCCESS / ATTENTION REQUIRED) badge',
      ],
      previewSuccess: {
        title: 'Tender Clause Verified & Approved',
        description: 'IS 1786:2008 high-strength bars approved.',
      },
      previewError: {
        title: 'Statutory BIS Standard Conflict',
        description: 'Withdrawn IS 1786:1985 cited in BoQ Item #4.',
      },
    },
    {
      id: 3,
      name: 'Design 3: Executive Obsidian / GovTech Royal',
      badge: 'Dark Luxe Command',
      badgeVariant: 'royal',
      tagline: 'High-contrast dark obsidian card with glowing neon status strip and shield badge.',
      features: [
        'Deep carbon obsidian card with 3px glowing neon left stripe',
        'Frosted government shield badge with SYS_OK / SYS_ALERT',
        'Tactile dark command button for immediate resolution',
      ],
      previewSuccess: {
        title: 'Departmental BoQ Audited: 100% Compliant',
        description: 'Zero obsolete standard citations detected across 42 line items.',
      },
      previewError: {
        title: 'Critical Audit Block: Obsolete Standard Cited',
        description: 'BoQ #10 cites superseded edition. Pre-bid submission locked.',
      },
    },
  ];

  return (
    <Card className="bg-white border-slate-200/90 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-serif font-semibold text-slate-900">
                Shadcn Toast / Sonner Design Samples
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono">
                Active: Design {activeDesign}
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 font-sans font-normal mt-0.5">
              Choose from 3 purpose-built toast notification designs for operational success &amp; failure alerts.
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleSelectDesign(num)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeDesign === num
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Design {num}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {designs.map((design) => {
            const isCurrent = activeDesign === design.id;

            return (
              <div
                key={design.id}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-500/80 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/10'
                    : 'border-slate-200/90 bg-slate-50/30 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-semibold font-serif text-slate-900">
                      {design.name}
                    </span>
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        <Check className="h-3 w-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectDesign(design.id)}
                        className="text-[10px] font-medium text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                      >
                        Set Active
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
                    {design.tagline}
                  </p>

                  <ul className="space-y-1.5 text-[11px] text-slate-500 mb-6">
                    {design.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/70">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Live Interactive Trigger
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => triggerToastSample(design.id, 'success', design.previewSuccess)}
                      className="border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 text-emerald-600 text-xs font-medium cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 mr-1 text-emerald-500" />
                      Test Success
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => triggerToastSample(design.id, 'error', design.previewError)}
                      className="border-rose-300 hover:bg-rose-50 hover:text-rose-700 text-rose-600 text-xs font-medium cursor-pointer"
                    >
                      Test Fail
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}