import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import {
  FileText,
  UploadCloud,
  FileUp,
  FileCheck2,
  CheckCircle2,
  Trash2,
  Loader2,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { createProcurement } from '../../features/procurement/procurementSlice';
import { extractTextFromDocument } from '../../utils/documentParser';

export default function CreateProcurementModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [activeMode, setActiveMode] = useState('text'); // 'text' | 'pdf'
  const [name, setName] = useState('');
  const [type, setType] = useState('tender');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PDF Extraction states
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState('');
  const [pdfMeta, setPdfMeta] = useState(null); // { fileName, pageCount, fileSize, words }

  const resetForm = () => {
    setName('');
    setType('tender');
    setDescription('');
    setActiveMode('text');
    setIsExtracting(false);
    setExtractionProgress('');
    setPdfMeta(null);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsExtracting(true);
    setExtractionProgress('Initializing document parser...');

    try {
      const result = await extractTextFromDocument(file, (curr, total) => {
        setExtractionProgress(`Extracting page ${curr} of ${total}...`);
      });

      setDescription(result.text);

      // Auto-populate name if empty
      if (!name.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();
        setName(cleanName);
      }

      const wordCount = result.text.split(/\s+/).filter(Boolean).length;
      setPdfMeta({
        fileName: file.name,
        pageCount: result.pageCount,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        words: wordCount,
      });

      toast.success(
        `Extracted ${result.pageCount} page${result.pageCount > 1 ? 's' : ''} (${wordCount.toLocaleString()} words) from ${file.name}`
      );
    } catch (err) {
      console.error('File parsing error:', err);
      toast.error(err.message || 'Failed to extract text from document');
    } finally {
      setIsExtracting(false);
      setExtractionProgress('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemovePdf = () => {
    setPdfMeta(null);
    setDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a procurement name');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description or upload a tender document (PDF)');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        type,
      };

      const res = await dispatch(createProcurement(payload)).unwrap();
      toast.success('Procurement registered successfully in National Grid!');

      if (onSuccess) {
        onSuccess(res);
      }
      handleModalClose();
    } catch (err) {
      console.error('Procurement registration error:', err);
      const msg = typeof err === 'string' ? err : err?.message || 'Failed to create procurement';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Add New Procurement"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {/* 1. Name & 2. Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Supply of Fe 500D TMT Rebar for Flyover Project"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all font-sans"
            >
              <option value="tender">Tender (NIT / RFP)</option>
              <option value="procurement">Procurement Order</option>
              <option value="boq">Bill of Quantities (BoQ)</option>
            </select>
          </div>
        </div>

        {/* 3. Description (Accepts either text as input or PDF) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-700 font-sans">
              Description <span className="text-rose-500">*</span>
            </label>

            {/* Segmented Mode Selector: Text vs PDF */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 gap-0.5">
              <button
                type="button"
                onClick={() => setActiveMode('text')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeMode === 'text'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Text Input</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeMode === 'pdf'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload PDF</span>
                {pdfMeta && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Hidden File Input for PDF */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.docx,.doc"
            className="hidden"
          />

          {/* Option A: Text Input */}
          {activeMode === 'text' && (
            <div className="space-y-2">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className="relative"
              >
                <textarea
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste tender specifications, BoQ item descriptions, technical parameters (e.g. grade, tensile strength, voltage ratings, testing methods, delivery terms)..."
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-normal text-slate-900 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all font-sans leading-relaxed resize-none ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200'
                  }`}
                />

                {isDragging && (
                  <div className="absolute inset-0 bg-emerald-50/90 rounded-xl flex items-center justify-center pointer-events-none border-2 border-dashed border-emerald-500 text-emerald-700 text-xs font-medium">
                    Drop PDF here to parse and fill description
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('pdf');
                    fileInputRef.current?.click();
                  }}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <FileUp className="h-3 w-3" />
                  <span>Or import from PDF</span>
                </button>

                {description && (
                  <span className="font-sans font-normal text-slate-500">
                    {description.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Option B: PDF Upload */}
          {activeMode === 'pdf' && (
            <div className="space-y-3">
              {!pdfMeta ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                    isDragging
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-emerald-600 hover:bg-slate-50/60'
                  }`}
                >
                  {isExtracting ? (
                    <div className="py-4 flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                      <p className="text-xs font-medium text-slate-800 font-sans">
                        Extracting tender document text...
                      </p>
                      <p className="text-[11px] text-slate-500 font-normal">{extractionProgress}</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800 font-sans">
                          Click to upload or drag and drop tender PDF
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                          Supports NIT / RFP PDF documents, BoQ sheets, and text files (up to 50MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* PDF Document Summary Card */}
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-emerald-950 truncate font-sans">
                          {pdfMeta.fileName}
                        </p>
                        <p className="text-[11px] text-emerald-700 flex items-center gap-2 mt-0.5 font-sans font-normal">
                          <span>{pdfMeta.pageCount} page{pdfMeta.pageCount > 1 ? 's' : ''} parsed</span>
                          <span>•</span>
                          <span>{pdfMeta.fileSize}</span>
                          <span>•</span>
                          <span className="font-medium">~{pdfMeta.words.toLocaleString()} words</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePdf}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remove PDF"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Extracted Editable Description */}
                  <div>
                    <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1.5 font-sans">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Extracted description (editable before saving):</span>
                    </label>
                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all font-sans leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 font-sans font-normal">
            {activeMode === 'pdf' && pdfMeta && (
              <span className="text-emerald-600 font-medium">
                ✓ Document ready for Gemini RAG ingestion
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="royal"
              size="sm"
              loading={isSubmitting}
              iconLeft={FileCheck2}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
