/**
 * Document Parser Utility
 * Extracts readable text from Tender PDFs, TXT, and Document files in the browser
 * so full tender specifications can be ingested into the ManakAI procurement pipeline.
 */

let pdfjsPromise = null;

const loadPdfJs = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);

  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('Failed to initialize PDF.js'));
        }
      };
      script.onerror = () => reject(new Error('Could not load PDF reader library'));
      document.head.appendChild(script);
    });
  }

  return pdfjsPromise;
};

/**
 * Fallback raw text stream extractor from PDF ArrayBuffer
 * Used if CDN is unreachable or offline
 */
const fallbackExtractPdfText = async (arrayBuffer) => {
  try {
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const raw = textDecoder.decode(arrayBuffer);
    
    // Extract text blocks inside parentheses between BT and ET
    const matches = raw.match(/\(([^()]{3,})\)/g) || [];
    const cleaned = matches
      .map((m) => m.slice(1, -1).replace(/\\([0-9]{3}|.)/g, '$1'))
      .filter((m) => /[a-zA-Z0-9]/.test(m))
      .join(' ');

    if (cleaned.length > 100) {
      return cleaned.slice(0, 50000);
    }
  } catch (err) {
    console.warn('Fallback stream extraction error:', err);
  }
  return '';
};

/**
 * Extracts text from a PDF file
 * @param {File} file
 * @param {Function} onProgress - Optional progress callback (page, total)
 * @returns {Promise<{ text: string, pageCount: number, fileName: string, fileSize: number }>}
 */
export const extractTextFromPdf = async (file, onProgress) => {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfjsLib = await loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const numPages = pdf.numPages;
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (onProgress) onProgress(pageNum, numPages);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map((item) => item.str).filter(Boolean);
      const combinedPage = pageStrings.join(' ').replace(/\s+/g, ' ').trim();

      if (combinedPage) {
        pageTexts.push(combinedPage);
      }
    }

    const fullText = pageTexts.join('\n\n');
    if (!fullText.trim()) {
      throw new Error('No selectable text found in PDF (might be a scanned image).');
    }

    return {
      text: fullText.trim(),
      pageCount: numPages,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (err) {
    console.warn('PDF.js failed, attempting fallback extraction:', err.message);
    const fallbackText = await fallbackExtractPdfText(arrayBuffer);
    if (fallbackText) {
      return {
        text: fallbackText,
        pageCount: 1,
        fileName: file.name,
        fileSize: file.size,
      };
    }
    throw new Error(err.message || 'Unable to parse PDF text');
  }
};

/**
 * Universal document text extractor supporting PDF, TXT, MD, CSV, JSON
 * @param {File} file
 * @param {Function} onProgress
 */
export const extractTextFromDocument = async (file, onProgress) => {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return extractTextFromPdf(file, onProgress);
  }

  // Text-based files (.txt, .md, .csv, .json)
  const text = await file.text();
  return {
    text: text.trim(),
    pageCount: 1,
    fileName: file.name,
    fileSize: file.size,
  };
};