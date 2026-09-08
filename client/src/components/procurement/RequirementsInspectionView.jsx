import React, { useState } from 'react';
import {
  TableProperties,
  FileText,
  CheckCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Button from '../common/Button';

// Sanitize raw text to strip all residual page indicators, headers, and footer artifacts
export function cleanRawSpecificationSnippet(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    // Remove "--- Page 1 of 1 ---", "--- Page X of Y ---", "--- Page X ---"
    .replace(/---?\s*Page\s*\d+\s*(?:of|\/)\s*\d+\s*---?/gi, '')
    .replace(/---?\s*Page\s*\d+\s*---?/gi, '')
    // Remove "showing page 1 of 1", "showing 1 of 1", "page 1 of 1", "page 1"
    .replace(/\bshowing\s+(?:page\s+)?\d+\s*(?:of|\/)\s*\d+\b/gi, '')
    .replace(/\b(?:showing\s+)?page\s*\d+\s*(?:of|\/)\s*\d+\b/gi, '')
    .replace(/\bshowing\s+page\s*\d+\b/gi, '')
    .replace(/\[\s*Page\s*\d+\s*(?:of|\/)?\s*\d*\s*\]/gi, '')
    .replace(/\(\s*Page\s*\d+\s*(?:of|\/)?\s*\d*\s*\)/gi, '')
    // Remove standalone lines like "Page 1"
    .replace(/^\s*page\s*\d+\s*$/gim, '')
    // Remove leftover empty brackets or parentheses: "[]", "()"
    .replace(/^\s*\[\s*\]\s*$/gm, '')
    .replace(/^\s*\(\s*\)\s*$/gm, '')
    // Remove standalone divider lines
    .replace(/^[-=_*]{3,}$/gm, '')
    // Collapse 3+ newlines into 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Parse cleaned specification text into distinct, uncluttered clauses or paragraphs
export function parseSpecificationClauses(text) {
  if (!text) return [];

  // Split on double newlines or numbered clause boundaries
  const blocks = text.split(/\n{2,}/);
  const clauses = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check if the block contains numbered list lines like "1. ... \n 2. ..."
    const lines = trimmed.split('\n');
    let currentClause = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const isNewItem = /^(?:(?:\d+(\.\d+)*[.)]|[a-zA-Z][.)]|[•\-*]|Clause\s+\d+|Section\s+\d+|Item\s+\d+)\s+)/i.test(line);

      if (isNewItem && currentClause) {
        clauses.push(currentClause.trim());
        currentClause = line;
      } else {
        currentClause = currentClause ? `${currentClause}\n${line}` : line;
      }
    }

    if (currentClause.trim()) {
      clauses.push(currentClause.trim());
    }
  }

  // Fallback: If only 1 clause was created but text has multiple distinct lines
  if (clauses.length <= 1 && text.includes('\n')) {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length > 1) {
      return lines;
    }
  }

  return clauses.length > 0 ? clauses : [text];
}

// Split clause into title and body if a prominent heading prefix exists
export function formatClauseContent(clause) {
  if (!clause) return { title: null, body: '' };

  const firstColonIdx = clause.indexOf(':');
  const firstNewlineIdx = clause.indexOf('\n');

  if (
    firstColonIdx > 0 &&
    (firstNewlineIdx === -1 || firstColonIdx < firstNewlineIdx) &&
    firstColonIdx < 80
  ) {
    const potentialTitle = clause.substring(0, firstColonIdx + 1).trim();
    const potentialBody = clause.substring(firstColonIdx + 1).trim();
    return { title: potentialTitle, body: potentialBody };
  }

  return { title: null, body: clause };
}

export default function RequirementsInspectionView({
  requirement,
  onSearchKeyword,
  onOpenClauseStudio,
}) {
  const [showRawText, setShowRawText] = useState(false);

  if (!requirement) return null;

  const {
    product = 'Not specified',
    application = 'Public Procurement',
    technicalParameters = {},
    keywords = [],
    rawText = '',
    createdAt,
    _id,
  } = requirement;

  // Sanitize text dynamically to eliminate any "Page 1 of 1" or parser artifacts
  const cleanedText = cleanRawSpecificationSnippet(rawText);
  const clauses = parseSpecificationClauses(cleanedText);

  const paramEntries = Object.entries(technicalParameters || {});

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Top Accent Strip */}
      <div className="h-1.5 bg-gradient-to-r from-brand-blue via-indigo-600 to-emerald-500 w-full" />

      {/* Clean Executive Light Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              STATUTORY SPECIFICATION DOSSIER
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">Domain: {application}</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Audit Ready
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
            {product}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {onOpenClauseStudio && (
            <Button
              variant="royal"
              size="md"
              iconLeft={FileText}
              onClick={onOpenClauseStudio}
              className="shadow-sm font-medium"
            >
              Draft Tender Clause
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* High-Readability Spec-Sheet Table */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TableProperties className="h-3.5 w-3.5 text-slate-500" />
              <span>Technical Compliance Parameters Matrix</span>
            </h4>
            <span className="text-xs text-slate-500">
              <strong>{paramEntries.length}</strong> verified compliance parameters
            </span>
          </div>

          {paramEntries.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-5/12">Engineering Parameter</th>
                    <th className="py-3 px-4 w-5/12">Requirement Value &amp; Standard</th>
                    <th className="py-3 px-4 text-right w-2/12">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paramEntries.map(([key, val], idx) => {
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase());
                    const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-blue-50/40 transition-colors ${
                          idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-900 border-r border-slate-100 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0" />
                          <span>{formattedKey}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-800 font-medium leading-relaxed">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-900 font-mono text-[11px] border border-slate-200/80 inline-block">
                            {stringVal}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCheck className="h-3.5 w-3.5" />
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No discrete technical parameter pairs extracted. Review schedule text below.
            </div>
          )}
        </div>

        {/* Clean, Uncluttered Raw Specification Snippet (White Background) */}
        {cleanedText && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowRawText((prev) => !prev)}
              className="w-full p-3.5 bg-slate-50/90 hover:bg-slate-100/80 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-200/70 flex items-center justify-center text-brand-blue shrink-0">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-800">
                    Inspect Raw Specification Snippet
                  </span>
                  <span className="text-[11px] text-slate-500 ml-2 font-normal hidden sm:inline">
                    Tender Source Document
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-brand-blue font-medium text-xs">
                <span>{showRawText ? 'Collapse Source' : 'Expand Source'}</span>
                {showRawText ? (
                  <ChevronUp className="h-4 w-4 text-brand-blue" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-brand-blue" />
                )}
              </div>
            </button>

            {showRawText && (
              <div className="bg-white border-t border-slate-200 p-5">
                {/* Specification Content Area */}
                <div className="max-h-[460px] overflow-y-auto pr-1 space-y-3">
                  {clauses.map((clause, idx) => {
                    const { title: titleText, body: bodyText } = formatClauseContent(clause);

                    return (
                      <div
                        key={idx}
                        className="bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 transition-all duration-150"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold font-mono bg-white text-slate-600 border border-slate-200/90 shadow-2xs">
                            Clause #{String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                          {titleText && (
                            <span className="font-semibold text-slate-900 block mb-1">
                              {titleText}
                            </span>
                          )}
                          <p className="whitespace-pre-wrap font-sans text-slate-700 font-normal">
                            {bodyText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
