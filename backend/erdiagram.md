                         ┌─────────────────────┐
                         │        USERS        │
                         ├─────────────────────┤
                         │ _id (PK)            │
                         │ name                │
                         │ email               │
                         │ passwordHash        │
                         │ role                │
                         │ preferredLanguage   │
                         │ createdAt           │
                         │ updatedAt           │
                         └──────────┬──────────┘
                                    │
                              1     │     N
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   CONVERSATIONS     │
                         ├─────────────────────┤
                         │ _id (PK)            │
                         │ userId (FK)         │
                         │ title               │
                         │ language            │
                         │ createdAt           │
                         │ updatedAt           │
                         └──────────┬──────────┘
                                    │
                              1     │     N
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      MESSAGES       │
                         ├─────────────────────┤
                         │ _id (PK)            │
                         │ conversationId (FK) │
                         │ role                │
                         │ content             │
                         │ sources[]           │
                         │ intent              │
                         │ createdAt           │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                       1 │                     │ N
                         ▼                     ▼
              ┌─────────────────┐    ┌─────────────────────┐
              │    FEEDBACK     │    │      DOCUMENTS      │
              ├─────────────────┤    ├─────────────────────┤
              │ _id (PK)        │    │ _id (PK)            │
              │ userId (FK)     │    │ title               │
              │ messageId (FK)  │    │ standardNumber      │
              │ rating          │    │ documentType        │
              │ comment         │    │ version             │
              │ createdAt       │    │ sourceUrl           │
              └─────────────────┘    │ createdAt           │
                                     └──────────┬──────────┘
                                                │
                                         1      │      N
                                                │
                                                ▼
                                      ┌─────────────────────┐
                                      │  DOCUMENT_METADATA  │
                                      ├─────────────────────┤
                                      │ _id (PK)            │
                                      │ documentId (FK)     │
                                      │ standardNumber      │
                                      │ clause              │
                                      │ section             │
                                      │ page                │
                                      │ category            │
                                      │ language            │
                                      │ sourceUrl           │
                                      │ version             │
                                      └─────────────────────┘


                    ┌──────────────────────────────┐
                    │       SEARCH_HISTORY         │
                    ├──────────────────────────────┤
                    │ _id (PK)                     │
                    │ userId (FK)                  │
                    │ query                        │
                    │ intent                       │
                    │ filters                      │
                    │ resultsCount                 │
                    │ createdAt                    │
                    └──────────────┬───────────────┘
                                   │
                              N    │    1
                                   │
                                   ▼
                                  USERS




  // RelationShip Model 
  USERS
  │
  └── conversations
          │
          └── messages
                  │
                  ├── sources[]
                  │
                  └── feedback

DOCUMENTS
  │
  └── document_metadata

USERS
  │
  └── search_history                                