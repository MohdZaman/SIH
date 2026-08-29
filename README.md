# ManakAI — AI-Powered Recommendation & Compliance Engine for Indian Standards in Procurement

**Problem Statement ID:** 26108

**Target Beneficiaries:** Government Departments, PSUs (Railways, NTPC, BHEL), GeM Portal Officials, and State Procurement Agencies

## 1. Executive Summary & Value Proposition

Public procurement across Indian portals (GeM / CPPP) requires precise technical clauses referencing Bureau of Indian Standards (BIS) specifications. In practice, procurement officials often:

- Cite outdated or superseded standards (e.g., specifying a 1985 revision instead of a 2024 amendment).
- Omit mandatory normative reference standards and essential test methods (chemical composition, tensile, ingress, fire safety).
- Overlook statutory Quality Control Orders (QCOs) and Compulsory Registration Schemes (CRS).

**ManakAI** automates technical specification drafting, validates legal and testing compliance, maps multi-hop normative dependencies, and outputs standardized, dispute-proof GeM tender clauses.

## 2. End-to-End System Architecture

```text
                       [ USER / PROCUREMENT OFFICER ]
                 (Text Specs / BoQ CSV / Draft Tender PDF)
                                    │
                                    ▼
                     [ Ingestion & OCR Pipeline ]
                     ├── Multer / pdf-parse / unpdf
                     └── Tesseract.js / OCR Engine
                                    │
                                    ▼
                     [ Express.js Core Engine ]
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
 [ Hybrid Search ]         [ Graph Traversal ]       [ Statutory Engine ]
 ├── Qdrant Vector DB       ├── MongoDB ($graphLookup)├── QCO Gazette Mapping
 └── Dense + Sparse BM25    └── Normative References   └── CRS / ISI Check
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    ▼
                    [ AI Synthesizer & Reasoner ]
                   (LangChain.js / Vercel AI SDK)
                                    │
                                    ▼
                     [ React.js Dashboard Views ]
    ├── Spec Recommender (Hero Match + Match %)
    ├── SVG Normative Graph Canvas (Pan/Zoom/Drag)
    ├── Tender Gap Auditor (Before vs. After Analysis)
    └── 1-Click GeM Clause Synthesizer (.docx/Copy)
```

## 3. Core Modules & Key Deliverables

### Module 1: Hybrid Retrieval & Matching Engine

- **Dense Semantic Matching:** Uses embedding models to capture natural-language technical descriptions (e.g., *"damp heat resistant 50W driver"*).
- **Sparse Lexical Matching:** BM25 filtering for exact alphanumeric BIS identifiers, material grades, and electrical ratings (e.g., `IS 1786`, `Fe 500D`, `IP65`).

### Module 2: Relational Normative Graph (MongoDB `$graphLookup`)

- Maps every primary standard to its complete structural hierarchy:
  - **Normative References:** Foundational materials, general safety standards (`IS 302-1`).
  - **Test Methods:** Mechanical, chemical, and environmental testing codes (`IS 1608`, `IS 9000`).
  - **Ingress & Safety Codes:** Environmental protection specs (`IS 12063`).

### Module 3: Legal & QCO Compliance Checker

- Continuously cross-references queries against Ministry of Commerce and DPIIT Quality Control Orders.
- Flags whether an item legally requires mandatory **ISI mark**, **CRS registration**, or **BEE Star rating** before tender floating.

### Module 4: Reverse Tender Auditor (Gap Analysis)

- Ingests existing tender documents and runs automated error-detection:
  - ❌ **Critical:** Obsolete/withdrawn standard revisions detected.
  - ⚠️ **Warning:** Missing mandatory sampling plans or laboratory test clauses.
  - ✅ **Compliant:** Verified technical limits and material parameters.

### Module 5: 1-Click GeM Clause Synthesizer

- Compiles recommendations into standardized clauses formatted for direct insertion into GeM/CPPP tender templates.
- Configurable toggles for third-party inspection requirements, NABL laboratory certificates, and BIS license declarations.

## 4. Technical Stack

| **Layer** | **Technology Selected** | **Purpose** |
|---|---|---|
| **Frontend** | React.js / Next.js, Tailwind CSS, Lucide Icons | Responsive Gov-Tech dashboard interface |
| **Graph Visualization** | Custom Interactive SVG Canvas | Draggable nodes, animated cubic Bezier flow edges, zoom/pan controls |
| **Backend API** | Node.js + Express.js | Async REST controllers, streaming responses |
| **Vector Database** | Qdrant | Fast dense-vector retrieval and payload metadata filtering |
| **Primary & Graph DB** | MongoDB | Document storage + `$graphLookup` multi-hop dependency traversal |
| **AI Orchestration** | LangChain.js / Vercel AI SDK | Structured output synthesis, gap analysis, and clause formatting |
| **Document Parsing** | `pdf-parse`, `xlsx`, `tesseract.js` | Processing tender PDFs, scanned notices, and BoQ tables |

## 5. Implementation & Submission Checklist

- [ ] **Pre-seed Database:** Index 300–500 key Indian Standards across critical sectors (Electrical Goods, Structural Steel/Civil, Medical Supplies, IT/Electronics).
- [ ] **Dataset Coverage:** Ensure QCO gazette notification numbers (`S.O.` numbers) and amendment years are mapped to each document.
- [ ] **Live Demo Scenarios:** Prepare 3 ready-to-run demonstration queries (e.g., LED Drivers with surge protection, TMT Bridge Rebars, Medical Masks).
- [ ] **Export Verification:** Ensure the 1-click clause generator produces clean, formatted text with one-click copy and `.docx` download options.

