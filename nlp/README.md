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

## Streamlit demo UI (optional)

If you want to test the chatbot in a simple UI before integrating with the React frontend:

1) Start the NLP API (port 8001 recommended on Windows)
```bat
cd nlp
python -m uvicorn app.main:app --reload --port 8001
```

2) In a new terminal, install Streamlit dependencies and run the UI:
```bat
cd nlp
python -m pip install -r requirements-demo.txt
python -m streamlit run demo_streamlit.py
```

The UI will call `http://127.0.0.1:8001/api/chat` by default. You can change it in the sidebar.

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
- `GEMINI_API_VERSION=auto` (optional, tries `v1beta` then `v1`)

The response will include a disclaimer that it is **not based on the university documents**.

## Models

- LaBSE: Language-agnostic BERT Sentence Embedding
- Intent Classifier: Custom trained model
- Vector Database: FAISS

