import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Sparkles,
  Lightbulb,
  FileText,
  ShieldCheck,
  Search,
  ChevronDown,
  Send,
  X,
  RotateCcw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Check,
  Bot,
  User,
  Info,
  ArrowRight,
  FileCheck,
  Scale,
} from 'lucide-react';
import {
  openChat,
  closeChat,
  clearMessages,
  addUserMessage,
  sendChatMessage,
} from '../../features/chat/chatSlice';
import FormattedBotResponse, { cleanPlainText } from './FormattedMessage';

const DOMAIN_IDEAS = {
  'Civil & Structural': [
    {
      title: 'Draft strict NABL 180-day test report submission clause',
      query: 'Draft a strict tender clause mandating NABL test reports with test dates under 180 days for structural steel and TMT bars.',
    },
    {
      title: 'Generate Pre-dispatch Third Party Inspection (TPI) clause',
      query: 'Generate a Pre-dispatch Third Party Inspection (TPI) clause through RITES or EIL for high-value procurement contracts above ₹50 Lakhs.',
    },
    {
      title: 'Formulate warranty & guarantee criteria compliant with GeM Schedule 4',
      query: 'Write comprehensive warranty and defect liability criteria compliant with GeM Schedule 4 standard procurement terms.',
    },
  ],
  'Electrical & Power': [
    {
      title: 'Draft IS 694 flame-retardant wiring compliance clause',
      query: 'Draft a technical clause mandating IS 694 certified FRLS copper wires with mandatory BIS ISI marking for institutional wiring.',
    },
    {
      title: 'Require BEE 5-Star energy efficiency performance clause',
      query: 'Draft an energy efficiency compliance clause mandating BEE 5-Star rated distribution equipment with energy consumption limits.',
    },
    {
      title: 'Require type-test certificates from CPRI or ERDA labs',
      query: 'Generate a qualification requirement clause specifying type-test certificates from CPRI or ERDA dated within the last 5 years.',
    },
  ],
  'Safety & Medical': [
    {
      title: 'Mandate BIS ISI Mark license as technical eligibility condition',
      query: 'Draft a technical qualification clause requiring active BIS license and ISI marking for personal protective equipment.',
    },
    {
      title: 'Insert medical packaging & minimum 75% residual shelf-life clause',
      query: 'Draft a supply clause requiring minimum 75% residual shelf-life at time of departmental consignee receipt.',
    },
    {
      title: 'Add random statutory batch testing clause prior to payment',
      query: 'Generate a quality assurance clause specifying random batch testing in government laboratories prior to release of final payment.',
    },
  ],
  'IT & Hardware': [
    {
      title: 'Formulate MeitY CRO registration requirement clause for servers',
      query: 'Draft a mandatory MeitY Compulsory Registration Order (CRO) clause under IS 13252 for rack servers and networking appliances.',
    },
    {
      title: 'Draft OEM Authorization (MAF) & 4-hour onsite SLA clause',
      query: 'Generate a manufacturer authorization form (MAF) requirement with a 4-hour onsite SLA for mission-critical IT infrastructure.',
    },
    {
      title: 'Add cybersecurity STQC certification prerequisite',
      query: 'Write a technical compliance clause requiring STQC cybersecurity certification for telecommunications hardware.',
    },
  ],
};

const GENERAL_QUESTIONS = [
  {
    title: 'Which BIS standards are mandatory under Steel QCO 2024?',
    query: 'List all mandatory Indian Standards (IS) enforced under the latest Steel & Steel Products Quality Control Order (QCO).',
  },
  {
    title: 'What are the mandatory test norms for Fe 500D TMT bars?',
    query: 'What are the key chemical and mechanical testing requirements for Fe 500D high-strength deformed bars under IS 1786?',
  },
  {
    title: 'Find substitute standards for withdrawn IS 456:1978',
    query: 'What is the current active standard replacing withdrawn IS 456:1978, and what are the normative differences?',
  },
];

export default function GovAIChatDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, isOpen, loading } = useSelector((state) => state.chat);

  const [input, setInput] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Civil & Structural');
  const [isDomainMenuOpen, setIsDomainMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const messagesEndRef = useRef(null);
  const domainMenuRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, loading]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (domainMenuRef.current && !domainMenuRef.current.contains(e.target)) {
        setIsDomainMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    dispatch(addUserMessage(query));
    dispatch(sendChatMessage(query));
  };

  const handleCopyMessage = (id, text) => {
    const cleaned = cleanPlainText(text);
    navigator.clipboard.writeText(cleaned);
    setCopiedId(id);
    toast.success('Clean text copied (markdown removed)');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const domainList = Object.keys(DOMAIN_IDEAS);

  return (
    <>
      {/* Floating Action Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => dispatch(openChat())}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 group border border-white/30 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-amber-200 animate-pulse" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <span className="text-xs font-semibold tracking-wide">Ask SARAL</span>
        </button>
      )}

      {/* Floating Chat Panel / Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden font-sans ${
            isExpanded
              ? 'inset-4 sm:inset-10 w-auto h-auto max-w-5xl mx-auto'
              : 'bottom-6 right-6 w-[94vw] sm:w-[460px] h-[660px] max-h-[90vh]'
          }`}
        >
          {/* Top Header */}
          <div className="px-4 py-3.5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
            {/* Left Brand Badge */}
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                  SARAL Brain
                </h3>
                <span className="text-[10px] font-medium text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.2 rounded-full">
                  BIS Copilot
                </span>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <button
                type="button"
                onClick={() => setShowInfoModal(!showInfoModal)}
                title="Model & Knowledge Coverage"
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <Info className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => dispatch(clearMessages())}
                title="New Session / Clear Chat"
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore View' : 'Expand View'}
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => dispatch(closeChat())}
                title="Close Assistant"
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Info Banner Dropdown */}
          {showInfoModal && (
            <div className="p-3 bg-purple-50/70 border-b border-purple-100 text-xs text-purple-900 flex items-start justify-between gap-2 shrink-0 animate-in fade-in duration-150">
              <div className="space-y-0.5">
                <p className="font-semibold text-purple-950">Grounding &amp; Data Sources</p>
                <p className="text-[11px] text-purple-800 font-normal leading-relaxed">
                  Connected to Bureau of Indian Standards (BIS) e-codes, DPIIT Gazette QCO database, and GeM Schedule 4 procurement conditions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="text-purple-600 hover:text-purple-900 text-xs p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Main Body Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#FAFBFD]">
            {/* 1. EMPTY STATE (ClickUp Brain Inspired Layout) */}
            {messages.length === 0 ? (
              <div className="max-w-xl mx-auto space-y-6 pt-2 pb-4">
                {/* Hero Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 text-white shadow-md shadow-purple-500/20 mb-1">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-950 tracking-tight">
                    Ask anything or synthesize with AI
                  </h2>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-md mx-auto">
                    Use SARAL to draft tender clauses for you, or query BIS standards, QCO mandates, and active procurement specifications.
                  </p>
                </div>

                {/* Section 1: Enhance Knowledge with Tenders & Specs */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">
                      Enhance SARAL&apos;s knowledge with Tenders &amp; Specs
                    </h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Use AI to quickly search for specifications and verify compliance across your procurement documentation.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <button
                      type="button"
                      onClick={() => navigate('/tender-auditor')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FileCheck className="h-3.5 w-3.5 text-purple-600" />
                      <span>Audit Active Tender</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/qco-tracker')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Check QCO Gazette</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/clause-studio')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-brand-blue" />
                      <span>Open Clause Studio</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Ask about your procurements */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1">
                    Ask about your procurements &amp; standards
                  </span>

                  <div className="space-y-1.5">
                    {GENERAL_QUESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(item.query)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-purple-300 text-xs text-slate-700 hover:text-slate-950 font-normal transition-all flex items-center gap-2.5 group cursor-pointer shadow-2xs"
                      >
                        <Lightbulb className="h-4 w-4 text-amber-500/80 group-hover:text-amber-500 shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Ideas for drafting clauses with Domain Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Ideas for drafting:
                    </span>

                    {/* Domain Dropdown */}
                    <div className="relative" ref={domainMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsDomainMenuOpen(!isDomainMenuOpen)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-xs font-medium text-slate-800 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <span>{selectedDomain}</span>
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </button>

                      {isDomainMenuOpen && (
                        <div className="absolute right-0 bottom-full mb-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100 font-sans">
                          {domainList.map((domain) => (
                            <button
                              key={domain}
                              type="button"
                              onClick={() => {
                                setSelectedDomain(domain);
                                setIsDomainMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                                selectedDomain === domain
                                  ? 'bg-purple-50 text-purple-900 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{domain}</span>
                              {selectedDomain === domain && (
                                <Check className="h-3 w-3 text-purple-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Domain-specific prompt suggestions */}
                  <div className="space-y-1.5">
                    {DOMAIN_IDEAS[selectedDomain]?.map((idea, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(idea.query)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-purple-300 text-xs text-slate-700 hover:text-slate-950 font-normal transition-all flex items-center gap-2.5 group cursor-pointer shadow-2xs"
                      >
                        <Lightbulb className="h-4 w-4 text-purple-500/80 group-hover:text-purple-600 shrink-0" />
                        <span className="flex-1 truncate">{idea.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* 2. ACTIVE CONVERSATION STREAM */
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400">
                    Active Session • {messages.length} messages
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(clearMessages())}
                    className="text-[11px] font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Back to Ideas &amp; Templates</span>
                  </button>
                </div>

                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {isBot && (
                        <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all ${
                          isBot
                            ? 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-sm'
                        }`}
                      >
                        {isBot ? (
                          <FormattedBotResponse text={msg.text} />
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        )}

                        {/* Bot actions (copy, timestamp) */}
                        {isBot && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span>{msg.time}</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.text)}
                                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600" />
                                    <span className="text-emerald-600">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {!isBot && (
                          <span className="text-[9px] opacity-70 block text-right mt-1">
                            {msg.time}
                          </span>
                        )}
                      </div>

                      {!isBot && (
                        <div className="h-7 w-7 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-2.5 text-purple-700 text-xs pl-10 py-2">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="font-medium">Synthesizing BIS clauses &amp; tender standards...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick Workflow Action Pills (Docked above input bar) */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSend('Draft a strict quality clause requiring BIS certification and NABL test reports for ')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileText className="h-3 w-3 text-purple-600" />
              <span>Draft Clause</span>
            </button>

            <button
              type="button"
              onClick={() => handleSend('What are the statutory QCO penalty and rejection rules for ')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="h-3 w-3 text-indigo-600" />
              <span>Check QCO Penalties</span>
            </button>

            <button
              type="button"
              onClick={() => handleSend('Audit this technical parameter for compliance with Indian Standards: ')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className="h-3 w-3 text-emerald-600" />
              <span>Audit BoQ Item</span>
            </button>
          </div>

          {/* Input Bar with ClickUp Brain Inspired Purple/Gradient Border */}
          <div className="p-3.5 bg-white border-t border-slate-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center rounded-2xl border-2 border-purple-300/80 focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-500/10 bg-white shadow-sm transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about BIS standards, draft clauses, or verify tenders..."
                className="flex-1 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-sans"
              />

              <div className="pr-1.5 flex items-center gap-1.5">
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm disabled:opacity-40 disabled:hover:from-purple-600 disabled:hover:to-indigo-600 transition-all cursor-pointer flex items-center justify-center shrink-0"
                  title="Send query"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}