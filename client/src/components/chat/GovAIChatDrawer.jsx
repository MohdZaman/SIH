import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
} from 'lucide-react';
import {
  openChat,
  closeChat,
  clearMessages,
  addUserMessage,
  sendChatMessage,
} from '../../features/chat/chatSlice';

const DEFAULT_SUGGESTIONS = [
  'What are the mandatory clauses for 50W LED streetlighting?',
  'Check Fe 500D vs Fe 415 TMT bar compliance',
  'Explain DPIIT Gazette S.O. 1563(E) penalties',
];

export default function GovAIChatDrawer() {
  const dispatch = useDispatch();
  const { messages, isOpen, loading } = useSelector((state) => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    dispatch(addUserMessage(query));
    dispatch(sendChatMessage(query));
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => dispatch(openChat())}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-brand-blue text-white rounded-full shadow-2xl hover:bg-brand-blue-hover transition-all duration-200 hover:scale-105 group border border-white/20"
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-brand-blue" />
          </div>
          <span className="text-xs font-bold tracking-wide">Ask ManakAI</span>
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-[#161B26] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-brand-navy border-b border-slate-700/80 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold">ManakAI Copilot</h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400">BIS & GeM Intelligence Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch(clearMessages())}
                title="Clear Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => dispatch(closeChat())}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-brand-dark/90">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="h-6 w-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-3 w-3 text-blue-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isBot
                        ? 'bg-[#1F2739] text-slate-200 border border-slate-700/60'
                        : 'bg-brand-blue text-white font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {msg.references?.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          Authoritative References:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {msg.references.map((ref, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[9px] opacity-60 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3 w-3 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Synthesizing BIS clauses...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-2 bg-brand-navy border-t border-slate-800 flex gap-1.5 overflow-x-auto text-[11px]">
            {DEFAULT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#121722] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about BIS codes, QCOs, testing norms..."
              className="flex-1 bg-[#1A2234] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-brand-blue"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-hover disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
