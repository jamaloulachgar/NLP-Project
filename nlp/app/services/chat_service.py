from __future__ import annotations

import os
from pathlib import Path
import re
from typing import Any, Dict, List, Literal

from app.services.knowledge_base import KBItem, load_kb
from app.services.language import detect_lang
from app.services.fallback_llm import FallbackLLM
from app.services.mistral_client import MistralClient
from app.services.retrieval import Retriever
from app.services.rules import apply_rules


class ChatService:
    def __init__(self):
        # Resolve DATA_DIR robustly.
        # Repo layout: NLP-project/
        #   data/kb.jsonl
        #   nlp/app/services/chat_service.py  (this file)
        #
        # When running uvicorn from `nlp/`, cwd is `.../NLP-project/nlp`,
        # so os.getcwd()/data would be `.../NLP-project/nlp/data` (wrong).
        # Default to `.../NLP-project/data` instead.
        repo_root = Path(__file__).resolve().parents[3]
        self._default_data_dir = str(repo_root / "data")
        self._data_dir = os.getenv("DATA_DIR", self._default_data_dir)

        self.kb_items: List[KBItem] = load_kb(self._data_dir)
        self.retriever = Retriever(self.kb_items)
        self.mistral = MistralClient()
        # Note: env vars can change between runs; we'll also refresh per-request before use.
        self.fallback_llm = FallbackLLM()

    # --- debug helpers (no secrets) ---
    def kb_size(self) -> int:
        return len(self.kb_items)

    def data_dir(self) -> str:
        return self._data_dir

    def top_k(self) -> int:
        return int(os.getenv("TOP_K", "4"))

    def min_similarity(self) -> float:
        return float(os.getenv("MIN_SIMILARITY", "0.25"))

    def min_token_overlap(self) -> int:
        return int(os.getenv("MIN_TOKEN_OVERLAP", "2"))

    def mistral_enabled(self) -> bool:
        return self.mistral.available()

    def fallback_status(self) -> Dict[str, Any]:
        llm = FallbackLLM()
        provider = (os.getenv("FALLBACK_LLM_PROVIDER") or "").strip().lower()
        return {
            "provider": provider or None,
            "enabled": llm.available(),
            "hasGeminiKey": bool(os.getenv("GEMINI_API_KEY")),
            "geminiModel": (os.getenv("GEMINI_MODEL") or "").strip() or None,
            "geminiApiVersion": (os.getenv("GEMINI_API_VERSION") or "").strip() or None,
            "hasOpenAIKey": bool(os.getenv("OPENAI_API_KEY")),
            "openaiModel": (os.getenv("OPENAI_MODEL") or "").strip() or None,
            "llmMode": (os.getenv("LLM_MODE") or "auto").strip().lower(),
        }

    def kb_filename(self) -> str:
        # Mirrors knowledge_base.load_kb() selection logic (debug only).
        return (os.getenv("KB_FILENAME") or "").strip() or "kb_backup.jsonl (default-if-present)"

    def _extract_answer(self, text: str) -> str:
        """
        Our KB entries often look like:
          Q: ...
          A: ...
        For UI quality, return only the A part when present.
        """
        m = re.search(r"(?mi)^\s*A:\s*(.+)$", text or "")
        if m:
            return m.group(1).strip()
        return (text or "").strip()

    def answer(
        self,
        message: str,
        language_hint: str,
        conversation_id: str,
    ) -> Dict[str, Any]:
        lang: Literal["ar", "en"] = detect_lang(message, language_hint)

        # 1) Rule-based router (quick clarification prompts)
        rule = apply_rules(message, lang)
        if rule:
            return {
                "answer": rule.answer,
                "lang": lang,
                "sources": [],
                "explain": {
                    "detectedLang": lang,
                    "ruleHit": True,
                    "intent": rule.intent,
                    "intentConfidence": float(rule.confidence),
                    "retrievalMethod": "tfidf",
                    "topMatches": [],
                    "decision": "answer",
                },
            }

        # 2) Retrieval
        retrieved = self.retriever.search(message, top_k=int(os.getenv("TOP_K", "4")), lang=lang)

        top_matches = [{"text": r.item.text[:240], "similarity": r.similarity} for r in retrieved]

        # If nothing relevant, Gemini/OpenAI generates a general answer.
        # Score scale differs from embeddings; keep a small threshold.
        min_sim = float(os.getenv("MIN_SIMILARITY", "0.25"))
        if not retrieved or retrieved[0].similarity < min_sim:
            # Optional fallback to external LLM (Gemini/OpenAI) when KB doesn't contain the answer.
            # Refresh env-based config (important on Windows where users often restart shells).
            self.fallback_llm = FallbackLLM()
            if self.fallback_llm.available():
                try:
                    disclaimer = (
                        "تنبيه: هذه الإجابة عامة وليست مبنية على وثائق الجامعة الداخلية.\n\n"
                        if lang == "ar"
                        else "Note: This is a general answer and is NOT based on the university's internal documents.\n\n"
                    )
                    llm_answer = self.fallback_llm.complete(lang=lang, user_message=message).strip()
                    return {
                        "answer": disclaimer + llm_answer,
                        "lang": lang,
                        "sources": [],
                        "explain": {
                            "detectedLang": lang,
                            "ruleHit": False,
                            "intent": "fallback_llm",
                            "intentConfidence": 0.2,
                            "retrievalMethod": "tfidf",
                            "topMatches": top_matches,
                            "decision": "answer",
                        },
                    }
                except Exception as e:
                    # If the external LLM fails, return a clearer fallback so debugging is easy.
                    debug_line = f"{type(e).__name__}: {e}"
                    prefix = (
                        "تعذر الاتصال بخدمة Gemini/OpenAI. تحقق من المفتاح (API key) والصلاحيات/الحصة (quota) واسم النموذج.\n"
                        if lang == "ar"
                        else "Could not reach Gemini/OpenAI. Check API key, permissions/quota, and model name.\n"
                    )
                    fallback = (
                        "عذراً، لم أجد هذه المعلومة في الوثائق المتاحة. هل يمكنك توضيح سؤالك أو ذكر الشعبة/المستوى؟"
                        if lang == "ar"
                        else "Sorry — I couldn't find this in the available documents. Can you clarify your question or share your program/level?"
                    )
                    return {
                        "answer": f"{prefix}{fallback}\n\n(Details: {debug_line})",
                        "lang": lang,
                        "sources": [],
                        "explain": {
                            "detectedLang": lang,
                            "ruleHit": False,
                            "intent": "fallback_llm_error",
                            "intentConfidence": 0.0,
                            "retrievalMethod": "tfidf",
                            "topMatches": top_matches,
                            "decision": "fallback",
                        },
                    }

            # If we reach here, external LLM is NOT enabled (or no key/provider).
            fallback = (
                "عذراً، لم أجد هذه المعلومة في الوثائق المتاحة. هل يمكنك توضيح سؤالك أو ذكر الشعبة/المستوى؟"
                if lang == "ar"
                else "Sorry — I couldn't find this in the available documents. Can you clarify your question or share your program/level?"
            )
            return {
                "answer": fallback,
                "lang": lang,
                "sources": [],
                "explain": {
                    "detectedLang": lang,
                    "ruleHit": False,
                    "intent": "unknown",
                    "intentConfidence": 0.0,
                    "retrievalMethod": "tfidf",
                    "topMatches": top_matches,
                    "decision": "fallback",
                    "fallbackLLM": self.fallback_status(),
                },
            }

        # 3) Build context for RAG (then ALWAYS ask Gemini/OpenAI to reformulate short/pro)
        context_blocks: List[str] = []
        for i, r in enumerate(retrieved, start=1):
            context_blocks.append(f"[{i}] {r.item.title}\nURL: {r.item.url}\n{r.item.text}")
        context = "\n\n".join(context_blocks)

        sources = [
            {
                "title": r.item.title,
                "url": r.item.url,
                "type": r.item.type if r.item.type in ("official", "faq", "policy") else "official",
            }
            for r in retrieved
        ]

        # Preferred path: grounded generation with Gemini/OpenAI
        self.fallback_llm = FallbackLLM()
        if self.fallback_llm.available():
            try:
                answer_text = self.fallback_llm.answer_with_sources(
                    lang=lang, question=message, sources_text=context
                ).strip()
                return {
                    "answer": answer_text,
                    "lang": lang,
                    "sources": sources,
                    "explain": {
                        "detectedLang": lang,
                        "ruleHit": False,
                        "intent": "rag_llm_rewrite",
                        "intentConfidence": 0.75,
                        "retrievalMethod": "tfidf",
                        "topMatches": top_matches,
                        "decision": "answer",
                    },
                }
            except Exception:
                # If Gemini/OpenAI fails, fall back to extractive.
                pass

        system = (
            "You are a university student-services assistant. "
            "Answer ONLY using the provided sources. If the sources do not contain the answer, say you don't know and ask a clarifying question. "
            "Always answer in the user's language (Arabic if Arabic, otherwise English)."
        )
        user = (
            f"User question:\n{message}\n\nSources:\n{context}\n\n"
            "Return a helpful answer and cite sources by numbers like [1], [2] when relevant."
        )

        # 4) Generation (Mistral) with safe fallback (extractive)
        try:
            if self.mistral.available():
                answer_text = self.mistral.chat(system=system, user=user).strip()
            else:
                # No generator model: return a clean extractive answer (prefer the best match only).
                best = retrieved[0]
                ans = self._extract_answer(best.item.text)
                cite = "[1]"
                answer_text = f"{ans} {cite}".strip()
        except Exception:
            best = retrieved[0]
            ans = self._extract_answer(best.item.text)
            answer_text = f"{ans} [1]".strip()

        return {
            "answer": answer_text,
            "lang": lang,
            "sources": sources,
            "explain": {
                "detectedLang": lang,
                "ruleHit": False,
                "intent": "rag_answer",
                "intentConfidence": 0.6,
                "retrievalMethod": "tfidf",
                "topMatches": top_matches,
                "decision": "answer",
            },
        }


