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

## Models

- LaBSE: Language-agnostic BERT Sentence Embedding
- Intent Classifier: Custom trained model
- Vector Database: FAISS

