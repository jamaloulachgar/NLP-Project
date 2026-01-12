from __future__ import annotations

import os
from typing import Any, Dict, List, Literal

from app.services.knowledge_base import KBItem, load_kb
from app.services.language import detect_lang
from app.services.fallback_llm import FallbackLLM
from app.services.mistral_client import MistralClient
from app.services.retrieval import Retriever
from app.services.rules import apply_rules


class ChatService:
    def __init__(self):
        data_dir = os.getenv("DATA_DIR", os.path.join(os.getcwd(), "data"))

        self.kb_items: List[KBItem] = load_kb(data_dir)
        self.retriever = Retriever(self.kb_items)
        self.mistral = MistralClient()
        self.fallback_llm = FallbackLLM()

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
        retrieved = self.retriever.search(message, top_k=int(os.getenv("TOP_K", "4")))

        top_matches = [{"text": r.item.text[:240], "similarity": r.similarity} for r in retrieved]

        # If nothing relevant, fallback
        # Score scale differs from embeddings; keep a small threshold.
        if not retrieved or retrieved[0].similarity < float(os.getenv("MIN_SIMILARITY", "0.10")):
            # Optional fallback to external LLM (Gemini/OpenAI) when KB doesn't contain the answer.
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
                except Exception:
                    # If the external LLM fails, use the classic clarification fallback.
                    pass

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
                },
            }

        # 3) Build context for RAG
        context_blocks: List[str] = []
        for i, r in enumerate(retrieved, start=1):
            context_blocks.append(f"[{i}] {r.item.title}\nURL: {r.item.url}\n{r.item.text}")
        context = "\n\n".join(context_blocks)

        system = (
            "You are a university student-services assistant. "
            "Answer ONLY using the provided sources. If the sources do not contain the answer, say you don't know and ask a clarifying question. "
            "Always answer in the user's language (Arabic if Arabic, otherwise English)."
        )
        user = f"User question:\n{message}\n\nSources:\n{context}\n\nReturn a helpful answer and cite sources by numbers like [1], [2] when relevant."

        # 4) Generation (Mistral) with safe fallback (extractive)
        try:
            if self.mistral.available():
                answer_text = self.mistral.chat(system=system, user=user).strip()
            else:
                # No API key: extractive fallback.
                lead = (
                    "حسب الوثائق المتاحة:\n" if lang == "ar" else "Based on the available documents:\n"
                )
                answer_text = lead + "\n\n".join(
                    [f"- {r.item.text.strip()} [{i}]" for i, r in enumerate(retrieved, start=1)]
                )
        except Exception:
            lead = "Based on the available documents:\n"
            if lang == "ar":
                lead = "حسب الوثائق المتاحة:\n"
            answer_text = lead + "\n\n".join(
                [f"- {r.item.text.strip()} [{i}]" for i, r in enumerate(retrieved, start=1)]
            )

        sources = [
            {
                "title": r.item.title,
                "url": r.item.url,
                "type": r.item.type if r.item.type in ("official", "faq", "policy") else "official",
            }
            for r in retrieved
        ]

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


