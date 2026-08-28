# SIH26107 — AI-Powered BIS Intelligent Assistant

Backend and AI/RAG architecture for the SIH26107 solution.

---

## 📌 1. Project Overview

The backend provides APIs for an AI-powered conversational assistant for **BIS (Bureau of Indian Standards)** information and services.

The system is designed to:

- Answer BIS-related questions.
- Identify potentially applicable Indian Standards from product descriptions.
- Explain BIS certification schemes and procedures.
- Provide testing and laboratory guidance.
- Support hallmarking and consumer-related queries.
- Support multilingual interaction, initially English and Hindi.
- Return source-backed answers with document, clause, and page references.

The core AI approach is **Retrieval-Augmented Generation (RAG)** rather than training or fine-tuning an LLM.

---

# 🛠️ 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | Chat and application UI |
| Backend | Node.js + Express.js | APIs, business logic, AI orchestration |
| Database | MongoDB | Users, conversations, messages, metadata |
| Vector Database | Quadrant VectorDB | Embeddings and semantic retrieval |
| AI | Gemini API | Answer generation and reasoning |
| Language | JavaScript / Node.js | Complete backend + AI pipeline |

### Important

We are **not** using Python/FastAPI or traditional ML training for the core solution.

The complete RAG pipeline will be implemented in **JavaScript/Node.js**.

---

# 🏗️ 3. High-Level Architecture

```text
                         React Frontend
                               |
                               | REST API
                               v
                    +------------------------+
                    |    Node.js + Express    |
                    |                        |
                    | API / Auth / Business  |
                    | RAG Orchestration      |
                    +-----------+------------+
                                |
             +------------------+------------------+
             |                  |                  |
             v                  v                  v
       +-----------+      +------------+     +-----------+
       | MongoDB   |      | Quadrant   |     | Gemini    |
       |           |      | VectorDB   |     | API       |
       | Users     |      |            |     |           |
       | Chats     |      | Embeddings |     | Generation|
       | Messages  |      | Chunks     |     | Reasoning |
       +-----------+      +-----+------+     +-----------+
                                ^
                                |
                         BIS Knowledge Base
                                |
                    +-----------+-----------+
                    |                       |
                   PDFs                  Web Sources
                    |                       |
                    +-----------+-----------+
                                |
                         Document Ingestion
