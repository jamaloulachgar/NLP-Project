from __future__ import annotations

import os
from typing import Literal, Optional

import requests


Provider = Literal["openai", "gemini"]


class FallbackLLM:
    """
    Optional fallback LLM when RAG can't find an answer in local documents.

    Configure with env:
      - FALLBACK_LLM_PROVIDER: "openai" | "gemini" | "" (disabled)
      - OPENAI_API_KEY / OPENAI_MODEL
      - GEMINI_API_KEY / GEMINI_MODEL
    """

    def __init__(self):
        self.provider = (os.getenv("FALLBACK_LLM_PROVIDER") or "").strip().lower()
        self.openai_api_key = (os.getenv("OPENAI_API_KEY") or "").strip()
        self.openai_model = (os.getenv("OPENAI_MODEL") or "gpt-4o-mini").strip()
        self.openai_base_url = (os.getenv("OPENAI_BASE_URL") or "https://api.openai.com").strip().rstrip(
            "/"
        )

        self.gemini_api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
        self.gemini_model = (os.getenv("GEMINI_MODEL") or "gemini-1.5-flash").strip()
        self.gemini_base_url = (
            os.getenv("GEMINI_BASE_URL") or "https://generativelanguage.googleapis.com"
        ).strip().rstrip("/")
        # Some accounts/projects expose models under v1 instead of v1beta.
        # Allowed: "v1beta" or "v1" or "auto" (try both).
        self.gemini_api_version = (os.getenv("GEMINI_API_VERSION") or "auto").strip().lower()

    def available(self) -> bool:
        if self.provider == "openai":
            return bool(self.openai_api_key)
        if self.provider == "gemini":
            return bool(self.gemini_api_key)
        return False

    def complete(self, *, lang: Literal["ar", "en"], user_message: str) -> str:
        if self.provider == "openai":
            return self._openai_chat(lang=lang, user_message=user_message)
        if self.provider == "gemini":
            return self._gemini_generate(lang=lang, user_message=user_message)
        raise RuntimeError("FALLBACK_LLM_PROVIDER not configured")

    def _system_prompt(self, lang: Literal["ar", "en"]) -> str:
        if lang == "ar":
            return (
                "أنت مساعد لخدمات الطلبة بالجامعة. "
                "أجب بشكل عام ومفيد، وصرّح بوضوح أن الإجابة ليست مبنية على وثائق الجامعة الداخلية. "
                "إذا كانت المعلومة قد تختلف حسب الكلية/الشعبة/المستوى، اطلب هذه التفاصيل."
            )
        return (
            "You are a university student-services assistant. "
            "Answer generally and helpfully, and clearly state the answer is NOT based on the university's internal documents. "
            "If details may vary by faculty/program/level, ask for those details."
        )

    def _openai_chat(self, *, lang: Literal["ar", "en"], user_message: str) -> str:
        if not self.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY not set")
        url = f"{self.openai_base_url}/v1/chat/completions"
        payload = {
            "model": self.openai_model,
            "messages": [
                {"role": "system", "content": self._system_prompt(lang)},
                {"role": "user", "content": user_message},
            ],
            "temperature": 0.2,
        }
        r = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {self.openai_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=60,
        )
        r.raise_for_status()
        data = r.json()
        return str(data["choices"][0]["message"]["content"])

    def _gemini_generate(self, *, lang: Literal["ar", "en"], user_message: str) -> str:
        if not self.gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY not set")

        # Try a few common model name variants because Gemini model names differ by account/region.
        # Users can also discover valid names with: GET /v1beta/models?key=...
        candidates = []
        m = self.gemini_model.strip()
        if m:
            candidates.append(m)
        # Common variants (safe to try)
        for v in ["gemini-1.5-flash-latest", "gemini-1.5-flash-002", "gemini-1.5-flash", "gemini-1.5-pro-latest"]:
            if v not in candidates:
                candidates.append(v)

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{self._system_prompt(lang)}\n\nUser: {user_message}"}],
                }
            ]
        }

        def version_candidates() -> list[str]:
            if self.gemini_api_version in ("v1", "v1beta"):
                return [self.gemini_api_version]
            # auto
            return ["v1beta", "v1"]

        last_err: Exception | None = None
        for api_version in version_candidates():
            for model_name in candidates:
                url = f"{self.gemini_base_url}/{api_version}/models/{model_name}:generateContent"
                try:
                    r = requests.post(url, params={"key": self.gemini_api_key}, json=payload, timeout=60)
                    if r.status_code == 404:
                        last_err = requests.HTTPError(
                            f"404 Not Found for model '{model_name}' on {api_version}. "
                            f"Try listing models via {self.gemini_base_url}/{api_version}/models?key=YOUR_KEY"
                        )
                        continue
                    r.raise_for_status()
                    data = r.json()
                    break
                except Exception as e:
                    last_err = e
                    continue
            else:
                # tried all models for this version
                continue
            # success
            break
        else:
            raise RuntimeError(f"Gemini request failed. Last error: {last_err}")

        candidates = data.get("candidates") or []
        if not candidates:
            raise RuntimeError("Gemini returned no candidates")
        content = candidates[0].get("content") or {}
        parts = content.get("parts") or []
        if not parts:
            raise RuntimeError("Gemini returned empty content parts")
        return str(parts[0].get("text") or "")




