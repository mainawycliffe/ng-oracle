# Documentation Processing Tools

## process-docs.ts

Processes Angular documentation and creates vector embeddings for RAG (Retrieval-Augmented Generation).

### What it does:

1. **Reads markdown files** from `docs/v18`, `docs/v19`, `docs/v20`
2. **Chunks content** into ~500 token pieces for optimal retrieval
3. **Generates embeddings** using Gemini 2.5 Flash
4. **Stores in Firestore** with:
   - Content chunks
   - Vector embeddings
   - Metadata (version, section, URL)
   - Timestamps

### Firestore Schema:

```typescript
Collection: angular-docs
Document ID: {version}-{path}-{chunkIndex}
Fields:
  - id: string
  - version: string (v18, v19, v20)
  - path: string (relative file path)
  - title: string
  - content: string (chunk text)
  - embedding: number[] (vector embedding)
  - metadata:
      - section: string
      - url: string
      - tokens: number
  - createdAt: timestamp
```

### Prerequisites:

1. Firebase project setup
2. Service account credentials
3. Google Cloud API key for Gemini

### Environment Setup:

```bash
# Set Firebase credentials
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"

# Set Google AI API key
export GOOGLE_GENAI_API_KEY="your-api-key"
```

### Usage:

```bash
# Install dependencies (if not already done)
pnpm install

# Run the processor
pnpm process-docs
```

### Output:

The script will:
- Process all markdown files
- Show progress for each version
- Commit documents in batches of 450
- Rate limit to avoid API quotas

### Notes:

- Processing time: ~10-30 minutes depending on doc size
- Cost: Embeddings via Gemini API (check pricing)
- Firestore writes: ~1000-5000 documents per version
- Can be run multiple times (will overwrite existing docs)

### Next Steps:

After processing, you can query the vector database using Firestore's `findNearest` for semantic search.
