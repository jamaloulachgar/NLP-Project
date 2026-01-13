from __future__ import annotations

import math
import os
import re
from dataclasses import dataclass
from typing import Dict, List

from app.services.knowledge_base import KBItem


@dataclass
class RetrievedChunk:
    item: KBItem
    similarity: float


_TOKEN_RE = re.compile(r"[\w\u0600-\u06FF]+", re.UNICODE)

_ARABIC_RE = re.compile(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]")

# Very small stopword lists to improve relevance.
_EN_STOP = {
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "in",
    "on",
    "for",
    "with",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "it",
    "this",
    "that",
    "i",
    "you",
    "we",
    "they",
    "he",
    "she",
    "my",
    "your",
    "our",
    "their",
    "can",
    "how",
    "what",
    "when",
    "where",
    "do",
    "does",
    # Domain-generic words that cause many false matches in university FAQs
    "student",
    "students",
    "university",
    "faculty",
    "campus",
    "office",
    "services",
}

_AR_STOP = {
    "في",
    "من",
    "على",
    "الى",
    "إلى",
    "عن",
    "هل",
    "ما",
    "متى",
    "كيف",
    "أين",
    "انا",
    "أنا",
    "انت",
    "أنت",
    "هو",
    "هي",
}


def _tokenize(text: str) -> List[str]:
    toks = [t.lower() for t in _TOKEN_RE.findall(text or "")]
    if not toks:
        return toks
    is_ar = bool(_ARABIC_RE.search(text or ""))
    if is_ar:
        return [t for t in toks if t not in _AR_STOP and len(t) > 1]
    return [t for t in toks if t not in _EN_STOP and len(t) > 1]


def _is_arabic_text(text: str) -> bool:
    return bool(_ARABIC_RE.search(text or ""))


class Retriever:
    """
    Ultra-light retriever (no numpy / no sklearn) using a TF-IDF-like scoring.
    Not as strong as LaBSE, but works reliably on Windows with low disk space.
    """

    def __init__(self, items: List[KBItem]):
        self.items = items
        self._docs_tokens: List[List[str]] = [_tokenize(it.text) for it in items]
        self._idf: Dict[str, float] = self._build_idf(self._docs_tokens)

    def _build_idf(self, docs_tokens: List[List[str]]) -> Dict[str, float]:
        df: Dict[str, int] = {}
        n = len(docs_tokens) or 1
        for toks in docs_tokens:
            for tok in set(toks):
                df[tok] = df.get(tok, 0) + 1
        idf: Dict[str, float] = {}
        for tok, d in df.items():
            idf[tok] = math.log((n + 1) / (d + 1)) + 1.0
        return idf

    def _score(self, q_tokens: List[str], doc_tokens: List[str]) -> float:
        if not q_tokens or not doc_tokens:
            return 0.0
        doc_tf: Dict[str, int] = {}
        for t in doc_tokens:
            doc_tf[t] = doc_tf.get(t, 0) + 1

        score = 0.0
        for t in q_tokens:
            if t in doc_tf:
                score += (1.0 + math.log(doc_tf[t])) * self._idf.get(t, 1.0)

        # Normalize by doc length a bit to avoid bias towards long docs
        return score / math.sqrt(len(doc_tokens) + 1)

    def search(self, query: str, top_k: int = 4, lang: str | None = None) -> List[RetrievedChunk]:
        if not self.items:
            return []
        q_tokens = _tokenize(query)
        q_set = set(q_tokens)
        min_overlap = int(os.getenv("MIN_TOKEN_OVERLAP", "2"))
        scored: List[RetrievedChunk] = []
        q_is_ar = _is_arabic_text(query)
        for it, toks in zip(self.items, self._docs_tokens):
            # Optional language filter to avoid mixing AR/EN when not needed.
            if lang in ("ar", "en"):
                it_is_ar = _is_arabic_text(it.text)
                if lang == "ar" and not it_is_ar:
                    continue
                if lang == "en" and it_is_ar:
                    continue
            # Filter out near-random matches: require at least N shared tokens (after stopword removal)
            if min_overlap > 0:
                overlap = len(q_set.intersection(toks))
                if overlap < min_overlap:
                    continue
            scored.append(RetrievedChunk(item=it, similarity=self._score(q_tokens, toks)))
        scored.sort(key=lambda x: x.similarity, reverse=True)
        # De-duplicate by item.id so we don't show the same FAQ multiple times.
        out: List[RetrievedChunk] = []
        seen: set[str] = set()
        for r in scored:
            if r.item.id in seen:
                continue
            seen.add(r.item.id)
            out.append(r)
            if len(out) >= top_k:
                break
        return out


