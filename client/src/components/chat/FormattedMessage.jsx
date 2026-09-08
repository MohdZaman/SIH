import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

/**
 * Clean plain text for copying to clipboard (removes all markdown artifacts like ###, **, *, etc.)
 */
export function cleanPlainText(rawText) {
  if (!rawText) return '';
  return rawText
    // Remove headers ###, ##, #
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold **text** -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove italics *(Note...)* or *text* -> text
    .replace(/\*([^*]+)\*/g, '$1')
    // Normalize bullet points * item -> • item
    .replace(/^\s*[\*\-]\s+/gm, '• ')
    // Remove extra trailing lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Helper to parse inline bold (**...**), italics (*...*), and code (`...`)
 */
function parseInlineContent(text) {
  if (!text) return null;

  // Match **bold**, `code`, or *italic*
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const elements = [];
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      // Check if it's an Indian Standard citation like "IS 2062:" or "IS 1786:"
      const isCitation = /^IS\s+\d+/i.test(inner);
      elements.push(
        <strong
          key={keyIdx++}
          className={`font-semibold ${
            isCitation
              ? 'text-purple-700 bg-purple-50/70 px-1 py-0.5 rounded border border-purple-200/60 font-mono text-[11px]'
              : 'text-slate-900 font-semibold'
          }`}
        >
          {inner}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const inner = token.slice(1, -1);
      elements.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-purple-700 font-mono text-[11px]"
        >
          {inner}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const inner = token.slice(1, -1);
      elements.push(
        <em key={keyIdx++} className="italic text-slate-600 font-normal">
          {inner}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

/**
 * FormattedBotResponse Component:
 * Parses raw chatbot markdown response and renders it as an executive, structured UI:
 * - Turns ### into styled category headers with indicator dots
 * - Turns * bullet points into clean, styled list items with custom bullets
 * - Turns *(Note: ...)* into an official highlighted callout card
 * - Strips all unwanted asterisks (***, **, *) and hashes (###, ##, #)
 */
export default function FormattedBotResponse({ text }) {
  if (!text) return null;

  const rawLines = text.split('\n');
  const blocks = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({
        type: 'list',
        items: [...currentList],
      });
      currentList = [];
    }
  };

  rawLines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // 1. Heading check: ###, ##, #
    if (/^#{1,6}\s+/.test(trimmed)) {
      flushList();
      const headingText = trimmed.replace(/^#{1,6}\s+/, '').replace(/\*\*/g, '').trim();
      blocks.push({
        type: 'heading',
        text: headingText,
      });
      return;
    }

    // 2. Note Callout check: *(Note: ...)* or (Note: ...) or Note: ...
    if (/^\*?\s*\(?(Note:?.*)\)?\*?$/i.test(trimmed) && trimmed.length > 15) {
      flushList();
      const noteContent = trimmed
        .replace(/^\*?\s*\(?\s*(Note:?)\s*/i, '')
        .replace(/\)?\*?$/, '')
        .replace(/\*\*/g, '')
        .trim();

      blocks.push({
        type: 'note',
        text: noteContent,
      });
      return;
    }

    // 3. Bullet Point check: * item or - item or • item
    if (/^[\*\-\•]\s+/.test(trimmed)) {
      const content = trimmed.replace(/^[\*\-\•]\s+/, '').trim();
      currentList.push(content);
      return;
    }

    // 4. Regular Paragraph
    flushList();
    blocks.push({
      type: 'paragraph',
      text: trimmed,
    });
  });

  flushList();

  return (
    <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <div
              key={idx}
              className="mt-3.5 mb-1.5 pt-2 pb-1 border-b border-slate-100 flex items-center gap-2 first:mt-0"
            >
              <span className="h-2 w-2 rounded-full bg-purple-600 shrink-0" />
              <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
                {block.text}
              </h4>
            </div>
          );
        }

        if (block.type === 'note') {
          return (
            <div
              key={idx}
              className="my-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-[11px] leading-relaxed flex items-start gap-2 shadow-2xs"
            >
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-900">Note: </span>
                <span className="text-amber-900/90">{parseInlineContent(block.text)}</span>
              </div>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="space-y-1.5 my-1.5 pl-0.5">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2 text-xs leading-normal">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                  <div className="flex-1 text-slate-700">
                    {parseInlineContent(item)}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="text-xs text-slate-700 leading-relaxed">
            {parseInlineContent(block.text)}
          </p>
        );
      })}
    </div>
  );
}