from __future__ import annotations

import os
import time
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel, Field

from app.services.chat_service import ChatService

load_dotenv()

app = FastAPI(title="University Chatbot NLP", version="0.1.0")

chat_service = ChatService()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    conversationId: str = Field(min_length=1)
    language: Literal["ar", "en", "fr"] = "en"


class Source(BaseModel):
    title: str
    url: str
    type: Literal["official", "faq", "policy"] = "official"


class TopMatch(BaseModel):
    text: str
    similarity: float


class ExplainData(BaseModel):
    detectedLang: Literal["ar", "en"]
    ruleHit: bool
    intent: str
    intentConfidence: float
    retrievalMethod: Literal["tfidf", "labse"]  # kept for frontend contract
    topMatches: List[TopMatch]
    decision: Literal["answer", "fallback"]


class ChatResponse(BaseModel):
    answer: str
    lang: Literal["ar", "en"]
    sources: List[Source]
    explain: ExplainData


@app.get("/api/health")
def health():
    # Useful debug info (no secrets) to validate env/config at runtime
    return {
        "ok": True,
        "kbSize": chat_service.kb_size(),
        "kbFile": chat_service.kb_filename(),
        "dataDir": chat_service.data_dir(),
        "rag": {
            "topK": chat_service.top_k(),
            "minSimilarity": chat_service.min_similarity(),
            "minTokenOverlap": chat_service.min_token_overlap(),
        },
        "fallbackLLM": chat_service.fallback_status(),
        "mistral": {"enabled": chat_service.mistral_enabled()},
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    started = time.perf_counter()
    result = chat_service.answer(
        message=req.message,
        language_hint=req.language,
        conversation_id=req.conversationId,
    )
    # Frontend expects processing in explain, but its type doesn't include timing here.
    # Keep pipeline deterministic; timing can be added later without breaking.
    _ = time.perf_counter() - started
    return result






