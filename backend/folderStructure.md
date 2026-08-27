backend/
│
├── src/
│   │
│   ├── app.js
│   ├── server.js
│   │
│   ├── controllers/
│   │   └── chatControllers.js
│   │
│   ├── routes/
│   │   └── chatRoutes.js
│   │
│   ├── services/
│   │   └── geminiServices.js
│   │
│   ├── models/
│   │   └── UserModel.js
│   │
│   ├── ai/
│   │   ├── embeddings.js
│   │   ├── retrieval.js
│   │   ├── rag.js
│   │   ├── reranker.js
│   │   ├── contextBuilder.js
│   │   └── citationValidator.js
│   │
│   ├── ingestion/
│   │   ├── pdfParser.js
│   │   ├── textCleaner.js
│   │   ├── chunker.js
│   │   └── ingestDocuments.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── quadrant.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   └── utils/
│       └── ...
│
├── .env
├── .gitignore
├── package.json
└── README.md