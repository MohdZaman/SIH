# SIH26108 — BIS Standards Intelligence & Procurement Compliance Platform

> AI-powered assistant for identifying relevant Indian Standards (IS), validating their versions, discovering related/normative standards, checking Quality Control Orders (QCOs), and generating compliance-ready tender clauses.

---

## 📌 Project Overview

This project is being developed for **Smart India Hackathon (SIH) Problem Statement 26108**.

The goal is to build an **AI-powered BIS Standards Intelligence and Procurement Compliance Platform** for government departments, PSUs, municipal corporations, and procurement officers.

When preparing a government tender, the procurement officer needs to identify the correct **Bureau of Indian Standards (BIS)** standards for the product being purchased.

Finding the correct standard manually is difficult because:

* BIS has a very large number of standards.
* Standards are revised and replaced over time.
* Older standards may accidentally be referenced in tenders.
* A primary product standard may depend on multiple testing/normative standards.
* Government **Quality Control Orders (QCOs)** may make BIS certification mandatory.
* Procurement officers may not know all associated standards and compliance requirements.

Our system aims to automate this process.

---

# 🎯 Main Objective

The system should allow a user to enter a procurement requirement such as:

> "Supply of corrosion-resistant TMT reinforcement bars for bridge construction."

The system should then:

1. Understand the procurement requirement.
2. Extract important technical requirements.
3. Find relevant BIS standards.
4. Rank the most relevant standards.
5. Verify whether the standard is current/active.
6. Detect outdated or superseded standards.
7. Find related and normative/test standards.
8. Check applicable QCO requirements.
9. Identify missing compliance requirements.
10. Provide evidence for every important recommendation.
11. Generate a professional tender clause.
12. Audit an existing tender for standards/compliance issues.

---

# 🧠 Product Vision

The application is designed as a **professional intelligence platform**, inspired by modern SaaS intelligence dashboards rather than a simple chatbot.

The frontend will provide a ManakAI-style experience with:

* Dashboard
* Procurement workspace
* Standards explorer
* AI recommendations
* Evidence viewer
* Standards graph
* Compliance analysis
* Tender audit
* Clause builder
* Standards watchlist
* Activity feed

The AI should work **behind the workflow** rather than being the entire interface.

---

# 🏗️ High-Level Architecture

```text
                         USER
                           │
                           ▼
                 ┌────────────────────┐
                 │   React Frontend   │
                 │ Intelligence UI    │
                 └─────────┬──────────┘
                           │
                       REST APIs
                           │
                           ▼
                 ┌────────────────────┐
                 │  Node + Express    │
                 │     Backend        │
                 └─────────┬──────────┘
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
     Procurement       Standards         Dashboard
       Service          Service            Service
          │                │                 │
          └────────────────┼─────────────────┘
                           │
              ┌────────────┼─────────────┐
              ▼            ▼             ▼
             AI/RAG     Compliance      QCO
             Engine       Engine       Engine
              │            │             │
              └────────────┼─────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
          MongoDB                    Vector DB
             │                           │
             └─────────────┬─────────────┘
                           ▼
                     Verified Output
```

---

# 🔄 Core AI Workflow

```text
User Procurement Requirement
            │
            ▼
Requirement Extraction
            │
            ▼
Product / Category Identification
            │
            ▼
Query Generation
            │
            ├───────────────┐
            ▼               ▼
      Keyword Search   Semantic Search
            │               │
            └───────┬───────┘
                    ▼
               Candidate
               Standards
                    │
                    ▼
                 Ranking
                    │
                    ▼
           Relevant Standards
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
   Version Check  Graph Check   QCO Check
        │           │            │
        └───────────┼────────────┘
                    ▼
              Compliance
                Analysis
                    │
                    ▼
             Evidence + Sources
                    │
                    ▼
            Tender Clause
              Generation
```

---

# 📂 Backend Structure

The backend is built using **Node.js + Express + MongoDB**.

Current architecture:

```text
backend/
│
├── server.js
├── app.js
├── package.json
├── .env
├── .gitignore
│
├── config/
│   └── db.js
│
└── src/
    │
    ├── controllers/
    │   ├── chatControllers.js
    │   └── procurementsController.js
    │
    ├── models/
    │   ├── UserModel.js
    │   └── procurementsModel.js
    │
    ├── routes/
    │   ├── chatRoutes.js
    │   └── procurementRoutes.js
    │
    └── services/
        └── geminiServices.js
```

The project will gradually evolve into:

```text
backend/
│
├── server.js
├── app.js
├── package.json
├── .env
├── .gitignore
│
├── config/
│   ├── db.js
│   └── ai.js
│
├── src/
│   │
│   ├── controllers/
│   │   ├── dashboardController.js
│   │   ├── procurementController.js
│   │   ├── standardController.js
│   │   ├── auditController.js
│   │   └── clauseController.js
│   │
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── ProcurementModel.js
│   │   ├── RequirementModel.js
│   │   ├── StandardModel.js
│   │   ├── StandardVersionModel.js
│   │   ├── EvidenceModel.js
│   │   ├── RecommendationModel.js
│   │   ├── AuditModel.js
│   │   ├── FindingModel.js
│   │   ├── QCOModel.js
│   │   └── ActivityModel.js
│   │
│   ├── routes/
│   │   ├── dashboardRoutes.js
│   │   ├── procurementRoutes.js
│   │   ├── standardRoutes.js
│   │   ├── auditRoutes.js
│   │   └── clauseRoutes.js
│   │
│   ├── services/
│   │   │
│   │   ├── ai/
│   │   │   ├── geminiService.js
│   │   │   └── extractionService.js
│   │   │
│   │   ├── rag/
│   │   │   ├── embeddingService.js
│   │   │   ├── retrievalService.js
│   │   │   └── rerankingService.js
│   │   │
│   │   ├── standards/
│   │   │   ├── recommendationService.js
│   │   │   ├── versionService.js
│   │   │   └── graphService.js
│   │   │
│   │   ├── compliance/
│   │   │   └── complianceService.js
│   │   │
│   │   ├── qco/
│   │   │   └── qcoService.js
│   │   │
│   │   ├── audit/
│   │   │   └── auditService.js
│   │   │
│   │   └── clause/
│   │       └── clauseService.js
│   │
│   ├── middleware/
│   │
│   └── utils/
│
└── ingestion/
    ├── pdf/
    ├── excel/
    ├── chunking/
    └── embeddings/
```

---

# 🧩 Backend Responsibilities

## 1. Routes

Routes define the public API endpoints.

Example:

```text
POST /api/procurement
GET  /api/procurement
GET  /api/procurement/:id
```

Routes should not contain business logic.

---

## 2. Controllers

Controllers:

* Receive HTTP requests.
* Validate basic request data.
* Call the appropriate service.
* Return HTTP responses.

Example:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Database / AI
```

---

## 3. Services

Services contain the actual business logic.

For example:

```text
recommendationService
```

should handle:

* Searching standards.
* Ranking standards.
* Calculating relevance.
* Preparing recommendations.

Controllers should remain thin.

---

# 🗄️ Database Design

MongoDB will store the application's structured information.

Main collections:

```text
users
procurements
requirements
standards
standard_versions
standard_references
documents
evidence
recommendations
qcos
audits
findings
activities
```

---

# 📦 Procurement

Represents a procurement project/tender.

Example:

```json
{
  "name": "Bridge Reinforcement Procurement",
  "description": "Supply of corrosion resistant TMT reinforcement bars for bridge construction",
  "type": "tender",
  "status": "DRAFT"
}
```

Possible statuses:

```text
DRAFT
ANALYZING
COMPLETED
FAILED
```

---

# 📚 Standard

Represents a BIS standard.

Conceptual structure:

```json
{
  "standardNumber": "IS XXXXX",
  "title": "Example Standard",
  "scope": "Standard scope...",
  "category": "Electrical",
  "industry": [
    "Power",
    "Construction"
  ]
}
```

A standard may have multiple versions/editions.

---

# 🔢 Standard Version

Stores information about different editions.

Example:

```json
{
  "standardNumber": "IS XXXXX",
  "edition": "2024",
  "status": "ACTIVE"
}
```

Possible statuses:

```text
ACTIVE
SUPERSEDED
WITHDRAWN
```

This allows the system to detect outdated tender references.

---

# 🔗 Standard References

Standards can reference other standards.

Example:

```text
Primary Standard
      │
      ├── TEST_METHOD
      │
      ├── MATERIAL
      │
      ├── SAFETY
      │
      └── NORMATIVE_REFERENCE
```

This relationship data will later power the **Standards Graph**.

---

# 📄 Evidence

Every important AI recommendation should have supporting evidence.

Example:

```json
{
  "document": "BIS Standard XXXXX",
  "section": "Scope",
  "page": 4,
  "content": "Relevant source text..."
}
```

The system should be able to answer:

> Why did the AI recommend this standard?

with evidence instead of an unsupported AI response.

---

# ⚖️ QCO / Compliance

The QCO engine will determine whether a procurement is subject to a government Quality Control Order.

Potential result:

```json
{
  "applicable": true,
  "order": "Example QCO",
  "certificationRequired": true,
  "requirements": [
    "BIS licence",
    "ISI marking"
  ]
}
```

The system should clearly distinguish:

```text
AI recommendation
        vs
Verified regulatory requirement
```

---

# 🤖 AI Architecture

Gemini is used as part of the AI layer.

Gemini should primarily perform tasks such as:

### Requirement extraction

Input:

```text
50W outdoor street LED driver with surge protection
```

Output:

```json
{
  "product": "LED driver",
  "power": "50W",
  "application": "outdoor street lighting",
  "requirement": "surge protection"
}
```

### Explanation

Explain why a particular standard is relevant.

### Ambiguity detection

Identify missing information.

Example:

```text
The requirement does not specify voltage.

Additional information may be required before
final standard selection.
```

### Clause generation

Generate readable tender clauses using **validated facts retrieved by the backend**.

Gemini should NOT be trusted as the sole source of BIS facts.

---

# 🔎 RAG Architecture

The system will use Retrieval-Augmented Generation.

## Why RAG?

The model should not rely only on its internal knowledge.

BIS standards and regulatory information need to come from a controlled knowledge base.

---

## Hybrid Retrieval

We will combine:

```text
Keyword Search
      +
Semantic Vector Search
      ↓
Candidate Results
      ↓
Reranking
      ↓
Top Standards
```

### Keyword Search

Useful for exact identifiers:

```text
IS 694
IS 7098
IS XXXXX
```

### Semantic Search

Useful when the user uses natural language.

For example:

```text
"fire retardant low smoke power cable"
```

may need to match documents using different terminology.

---

# 🧠 Requirement Extraction

Before searching the knowledge base, the user's input should be converted into structured requirements.

Example:

```text
User:
"Supply of 12kV indoor vacuum circuit breakers
for substation."
```

Possible extracted information:

```json
{
  "product": "vacuum circuit breaker",
  "voltage": "12kV",
  "installation": "indoor",
  "application": "substation"
}
```

This structured representation becomes the basis for retrieval.

---

# 📊 Recommendation Engine

The recommendation engine should rank candidate standards based on multiple factors.

Conceptually:

```text
Relevance Score
       │
       ├── Product match
       ├── Application match
       ├── Technical attribute match
       ├── Semantic similarity
       ├── Keyword match
       └── Standard scope match
```

Example response:

```text
#1 IS XXXXX
Relevance: 96%
Status: ACTIVE

#2 IS YYYY
Relevance: 82%
Status: ACTIVE

#3 IS ZZZZ
Relevance: 71%
Status: ACTIVE
```

The exact scoring formula will be implemented and refined during development.

---

# 🕸️ Standards Graph

The Standards Graph represents relationships between standards.

Example:

```text
                    PRIMARY STANDARD
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      TEST METHOD      MATERIAL          SAFETY
          │
          ▼
      TEST METHOD
```

Graph nodes:

```text
Standard
QCO
Test Method
Material Standard
Safety Standard
```

Graph relationships:

```text
REQUIRES_TEST
NORMATIVE_REFERENCE
MATERIAL_REFERENCE
RELATED_STANDARD
REPLACED_BY
REQUIRES_CERTIFICATION
```

---

# 🛡️ Compliance Engine

The compliance engine checks whether a procurement satisfies required conditions.

Example:

```text
Compliance

Primary Standard
✓ Identified

Latest Edition
✓ Verified

Normative References
✓ Checked

QCO
⚠ Applicable

Certification
✕ Missing
```

A compliance score can then be calculated.

Example:

```text
Compliance Score: 87%
```

The score is an application-level metric and should not be presented as an official BIS certification score.

---

# 🔍 Tender Audit

Users should be able to upload an existing tender PDF or document.

Workflow:

```text
Tender PDF
    ↓
Text Extraction
    ↓
Requirement Extraction
    ↓
IS Code Detection
    ↓
Version Validation
    ↓
Normative Reference Check
    ↓
QCO Check
    ↓
Missing Requirement Detection
    ↓
Findings
```

Example:

```text
TENDER AUDIT

Overall Score: 82%

🔴 Critical
Mandatory certification requirement missing.

🟠 Warning
Referenced standard appears outdated.

🟡 Recommendation
Associated test standard not mentioned.
```

---

# ✍️ Tender Clause Builder

The system can generate a ready-to-use tender clause.

Workflow:

```text
Verified Standards
        +
Validated Requirements
        +
QCO Requirements
        +
Evidence
        ↓
      Gemini
        ↓
Tender Clause
```

The generated clause should include relevant standards and compliance requirements.

The user should be able to:

```text
Copy
Export PDF
Export DOCX
```

---

# 🌐 Frontend ↔ Backend API

The frontend communicates with the backend using REST APIs.

## Procurement APIs

### Create Procurement

```http
POST /api/procurement
```

Request:

```json
{
  "name": "Bridge Reinforcement Procurement",
  "description": "Supply of corrosion resistant TMT reinforcement bars for bridge construction",
  "type": "tender"
}
```

---

### Get All Procurements

```http
GET /api/procurement
```

---

### Get Procurement

```http
GET /api/procurement/:id
```

Example:

```http
GET /api/procurement/68xxxxxxxx
```

---

# 🚧 Planned APIs

These APIs will be implemented as development progresses.

## Dashboard

```http
GET /api/dashboard
```

Returns:

```text
Active procurements
Compliance health
Critical findings
Standards monitored
Recent activity
Watchlist
```

---

## Procurement Analysis

```http
POST /api/procurement/:id/analyze
```

Starts:

```text
Requirement extraction
        ↓
Standard retrieval
        ↓
Ranking
        ↓
Version validation
        ↓
Normative graph
        ↓
QCO check
        ↓
Compliance analysis
```

---

## Recommendations

```http
GET /api/procurement/:id/recommendations
```

---

## Evidence

```http
GET /api/recommendations/:id/evidence
```

---

## Standards

```http
GET /api/standards
GET /api/standards/:id
GET /api/standards/:id/graph
```

---

## Compliance

```http
GET /api/procurement/:id/compliance
```

---

## Tender Audit

```http
POST /api/audits
GET /api/audits/:id
```

---

## Clause Generation

```http
POST /api/clauses/generate
```

---

# 🧪 Current Development Status

## Completed

* [x] Express server setup
* [x] CORS setup
* [x] Environment variable configuration
* [x] MongoDB connection
* [x] Gemini service foundation
* [x] Chat API foundation
* [x] Procurement model
* [x] Procurement creation API
* [x] Get procurements API
* [x] Get procurement by ID API

---

## In Progress

* [ ] Frontend integration
* [ ] Procurement analysis endpoint
* [ ] Requirement extraction
* [ ] BIS knowledge base
* [ ] Document ingestion
* [ ] Embeddings
* [ ] Vector search
* [ ] Hybrid retrieval
* [ ] Standard recommendation engine
* [ ] Version validation
* [ ] Normative standards graph
* [ ] QCO engine
* [ ] Compliance engine
* [ ] Tender audit
* [ ] Tender clause generation
* [ ] Evidence/citation system
* [ ] Standards watchlist
* [ ] Dashboard analytics

---

# 🚀 Development Order

Team members should follow this sequence.

```text
1. Backend foundation
        ↓
2. Procurement CRUD
        ↓
3. Frontend ↔ Backend integration
        ↓
4. Requirement extraction
        ↓
5. BIS data/knowledge base
        ↓
6. Document ingestion
        ↓
7. Embeddings
        ↓
8. Vector retrieval
        ↓
9. Hybrid search
        ↓
10. Recommendation engine
        ↓
11. Evidence system
        ↓
12. Version validation
        ↓
13. Standards graph
        ↓
14. QCO engine
        ↓
15. Compliance engine
        ↓
16. Tender audit
        ↓
17. Clause generation
        ↓
18. Dashboard + final UI integration
```

Do not implement all features simultaneously.

Each layer should be tested before the next layer is added.

---

# 🔐 Environment Variables

Create a `.env` file locally.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env` to GitHub.

Make sure `.gitignore` contains:

```text
node_modules/
.env
```

---

# ▶️ Running the Backend

Install dependencies:

```bash
npm install
```

Start normally:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

Test the root endpoint:

```http
GET /
```

Expected response:

```json
{
  "success": true,
  "message": "BIS intelligence AI backend is working"
}
```

---

# 🧪 Testing Procurement API

## Create

```http
POST http://localhost:5000/api/procurement
```

Body:

```json
{
  "name": "Bridge Reinforcement Procurement",
  "description": "Supply of corrosion resistant TMT reinforcement bars for bridge construction",
  "type": "tender"
}
```

---

## Get All

```http
GET http://localhost:5000/api/procurement
```

---

## Get By ID

```http
GET http://localhost:5000/api/procurement/:id
```

---

# 🔀 Git Workflow

The team should avoid directly pushing unfinished work into the shared/main branch.

Recommended workflow:

```text
main
 │
 ├── feature/procurement
 │
 ├── feature/rag
 │
 ├── feature/standards
 │
 ├── feature/qco
 │
 ├── feature/audit
 │
 └── feature/frontend
```

Example:

```bash
git checkout -b feature/procurement
```

After completing the feature:

```bash
git add .
git commit -m "Add procurement API"
git push origin feature/procurement
```

Then create a Pull Request.

---

# ⚠️ Important Git Rules

Before starting work:

```bash
git pull origin main
```

Before pushing:

```bash
git status
git add .
git commit -m "Meaningful commit message"
git push origin <your-branch>
```

Do not use:

```bash
git push --force
```

unless the team has explicitly agreed to it.

Do not commit:

```text
.env
node_modules/
API keys
Database credentials
Private documents
```

---

# 👥 Team Responsibilities

The project can be divided into the following areas.

### Backend

Responsible for:

* Express APIs
* Controllers
* MongoDB
* Authentication
* Procurement workflow

### AI/RAG

Responsible for:

* Gemini integration
* Requirement extraction
* Embeddings
* Retrieval
* Reranking
* AI explanations

### BIS Knowledge Base

Responsible for:

* Standards metadata
* Documents
* Editions
* Amendments
* References
* Evidence

### Compliance

Responsible for:

* Version validation
* Normative references
* QCO
* Certification requirements
* Compliance scoring

### Frontend

Responsible for:

* Dashboard
* Procurement UI
* Recommendation UI
* Evidence viewer
* Graph
* Compliance dashboard
* Tender audit
* Clause builder

---

# 🧭 Important Architectural Principle

The system should follow:

```text
AI ≠ Source of Truth
```

Instead:

```text
Trusted Knowledge Base
        ↓
Retrieval
        ↓
Validation
        ↓
AI Explanation / Generation
```

Gemini should help **understand and generate**, while factual standards and compliance information should come from the application's verified data sources.

---

# 🎯 Final Product Flow

The intended final user journey is:

```text
                    Dashboard
                        │
                        ▼
                New Procurement
                        │
                        ▼
             Enter / Upload Requirement
                        │
                        ▼
                 AI Analysis
                        │
                        ▼
              Standard Recommendations
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       Evidence       Graph          QCO
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                  Compliance
                        │
                        ▼
                  Tender Audit
                        │
                        ▼
                  Clause Builder
                        │
                        ▼
                Final Tender Clause
```

---

# 🏆 SIH Goal

The final system should not feel like:

> "Ask an AI which BIS standard I should use."

It should feel like:

> **"An intelligent procurement compliance platform that helps an officer discover, verify, understand, and correctly apply BIS standards."**

The focus should therefore be on:

* Accuracy
* Evidence
* Traceability
* Current standards
* Compliance
* Explainability
* Ease of use
* Professional procurement workflow

---

# 📌 Development Rule

Before implementing a new feature, ask:

1. What problem does this solve?
2. Which frontend screen uses it?
3. Which API exposes it?
4. Which database model stores its data?
5. Is the information AI-generated or source-backed?
6. How will we verify the result?
7. How will another team member test it?

This keeps the project modular and prevents the backend from becoming a collection of disconnected AI functions.

---

## Project Status

**Project:** SIH26108 — BIS Standards Intelligence & Procurement Compliance Platform

**Backend:** Node.js + Express

**Database:** MongoDB

**AI:** Gemini

**Architecture:** REST API + RAG + Compliance Engine

**Frontend:** ManakAI-style Intelligence Console

**Status:** Active Development
