# NLP Service (FastAPI)

AI/NLP service for intent classification, language detection, and semantic search.

## Setup

```bash
pip install -r requirements.txt
```

## Development

```bash
uvicorn app.main:app --reload
```

## Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Features

- Intent classification
- Language detection (Arabic/English)
- Semantic search using LaBSE embeddings
- TF-IDF and LaBSE retrieval methods
- Response generation
- Explain metadata for debugging

## API Endpoints

- `POST /api/chat` - Process chat message
- `GET /api/health` - Health check

## Optional LLM fallback (Gemini / OpenAI)

By default, if the answer is not found in local documents, the bot asks for clarification.
You can enable an external LLM fallback when the KB has no match:

### OpenAI (ChatGPT)

- `FALLBACK_LLM_PROVIDER=openai`
- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=gpt-4o-mini` (optional)

### Gemini

- `FALLBACK_LLM_PROVIDER=gemini`
- `GEMINI_API_KEY=...`
- `GEMINI_MODEL=gemini-1.5-flash` (optional)

The response will include a disclaimer that it is **not based on the university documents**.

## Models

- LaBSE: Language-agnostic BERT Sentence Embedding
- Intent Classifier: Custom trained model
- Vector Database: FAISS

