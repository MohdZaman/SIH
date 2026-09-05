import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Send,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { askAI, addUserMessage } from '../features/chat/chatSlice';

export default function ClauseStudioPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chat);
  const [prompt, setPrompt] = useState(
    'Synthesize an airtight dispute-proof technical tender specification clause for outdoor streetlighting conforming to BIS standards, mandatory ISI mark, 10kV surge suppressor, and DPIIT Quality Control Orders.'
  );
  const [synthesizedClause, setSynthesizedClause] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSynthesize = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      dispatch(addUserMessage(prompt));
      const response = await dispatch(askAI(prompt)).unwrap();
      setSynthesizedClause(response);
    } catch {
      // Error handled in Redux slice
    }
  };

  const handleCopy = () => {
    if (!synthesizedClause) return;
    navigator.clipboard.writeText(synthesizedClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout
      headerTitle="AI Clause Synthesizer Studio"
      headerSubtitle="Synthesize dispute-proof tender specifications and BoQ technical clauses using live AI backend intelligence."
    >
      <div className="space-y-6">
        {/* Input Console */}
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-blue" />
            <h3 className="text-sm font-semibold text-slate-900">
              Draft Specification Requirements & Parameters
            </h3>
          </div>

          <form onSubmit={handleSynthesize} className="space-y-3">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Specify the product requirements, testing standards, or statutory mandates to synthesize..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-brand-blue resize-none"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="royal"
                size="md"
                loading={loading}
                iconLeft={Sparkles}
              >
                Synthesize Clause via Backend AI
              </Button>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>AI Error: {error}</span>
          </div>
        )}

        {/* Synthesized Output Result */}
        {synthesizedClause && (
          <div className="bg-white border-2 border-brand-blue/30 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-blue" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Synthesized Specification Clause
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconLeft={copied ? Check : Copy}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy Clause'}
              </Button>
            </div>

            <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed rounded-xl whitespace-pre-wrap font-normal">
              {synthesizedClause}
            </div>
          </div>
        )}

        {!synthesizedClause && !loading && (
          <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-700">No Clause Generated Yet</h3>
            <p className="text-xs font-normal text-slate-500 max-w-sm mx-auto mt-1">
              Click "Synthesize Clause via Backend AI" above to generate authoritative tender specifications via Gemini AI.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
