from __future__ import annotations

import math
import re
from dataclasses import dataclass
from typing import Dict, List

from app.services.knowledge_base import KBItem


@dataclass
class RetrievedChunk:
    item: KBItem
    similarity: float


_TOKEN_RE = re.compile(r"[\w\u0600-\u06FF]+", re.UNICODE)


def _tokenize(text: str) -> List[str]:
    return [t.lower() for t in _TOKEN_RE.findall(text or "")]


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

    def search(self, query: str, top_k: int = 4) -> List[RetrievedChunk]:
        if not self.items:
            return []
        q_tokens = _tokenize(query)
        scored: List[RetrievedChunk] = []
        for it, toks in zip(self.items, self._docs_tokens):
            scored.append(RetrievedChunk(item=it, similarity=self._score(q_tokens, toks)))
        scored.sort(key=lambda x: x.similarity, reverse=True)
        return scored[:top_k]


