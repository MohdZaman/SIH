import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import Button from '../common/Button';

export default function BoQUploader({ onFileAnalyzed, isAuditing = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    name: 'NIT_Bridge_Steel_Procurement_Draft_2024.pdf',
    size: '3.4 MB',
    pages: 24,
    clauses: 32,
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: 18,
        clauses: 26,
      });
    }
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive
            ? 'border-brand-blue bg-blue-50/50'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
        }`}
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue mb-3">
          <UploadCloud className="h-6 w-6" />
        </div>

        <h4 className="text-sm font-bold text-slate-800">
          Upload Tender NIT / Schedule of Requirements (BoQ)
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Drop PDF, DOCX, or scanned tender document. AI automatically extracts clauses, standards, and line items.
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.xlsx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const f = e.target.files[0];
                  setSelectedFile({
                    name: f.name,
                    size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                    pages: 12,
                    clauses: 18,
                  });
                }
              }}
            />
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white text-xs font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors shadow-sm">
              Browse Document
            </span>
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-500">
                {selectedFile.size} • {selectedFile.pages} pages detected • {selectedFile.clauses} specifications identified
              </p>
            </div>
          </div>

          <Button
            variant="royal"
            size="sm"
            disabled={isAuditing}
            onClick={() => {
              if (onFileAnalyzed) onFileAnalyzed(selectedFile);
            }}
          >
            {isAuditing ? 'Parsing Clauses...' : 'Execute Audit'}
          </Button>
        </div>
      )}
    </div>
  );
}
