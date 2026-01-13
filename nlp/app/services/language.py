from __future__ import annotations

import re
from typing import Literal


_ARABIC_RE = re.compile(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]")


def detect_lang(text: str, language_hint: str | None = None) -> Literal["ar", "en"]:
    # Always trust the actual text if it contains Arabic characters.
    # This fixes cases where the UI language is set to "en" but the user types Arabic.
    if _ARABIC_RE.search(text or ""):
        return "ar"
    if language_hint in ("ar", "en"):
        return language_hint  # type: ignore[return-value]
    return "en"






