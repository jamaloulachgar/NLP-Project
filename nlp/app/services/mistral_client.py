from __future__ import annotations

import os
from typing import Literal, Optional

import requests


class MistralClient:
    def __init__(self):
        self.api_key = os.getenv("MISTRAL_API_KEY", "").strip()
        self.model = os.getenv("MISTRAL_MODEL", "mistral-small-latest").strip()
        self.base_url = os.getenv("MISTRAL_BASE_URL", "https://api.mistral.ai").strip().rstrip("/")

    def available(self) -> bool:
        return bool(self.api_key)

    def chat(self, system: str, user: str) -> str:
        """
        Uses Mistral Chat Completions API.
        If no API key is configured, raise and caller should fallback.
        """
        if not self.api_key:
            raise RuntimeError("MISTRAL_API_KEY not set")

        url = f"{self.base_url}/v1/chat/completions"
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.2,
        }
        r = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=60,
        )
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]







