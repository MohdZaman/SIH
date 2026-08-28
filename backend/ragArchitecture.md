User Question
      |
      v
Query Preprocessing
      |
      v
Intent Detection
      |
      v
Query Rewriting
      |
      v
Embedding Generation
      |
      v
Hybrid Retrieval
      |
      +-------------------+
      |                   |
      v                   v
Vector Search       Keyword Search
Quadrant                 |
      |                   |
      +---------+---------+
                |
                v
             Reranking
                |
                v
        Relevant BIS Chunks
                |
                v
        Context Construction
                |
                v
              Gemini
                |
                v
       Citation Validation
                |
                v
      Structured Final Answer