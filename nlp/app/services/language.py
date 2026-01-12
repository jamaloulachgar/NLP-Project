from __future__ import annotations

import re
from typing import Literal


_ARABIC_RE = re.compile(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]")


def detect_lang(text: str, language_hint: str | None = None) -> Literal["ar", "en"]:
    if language_hint in ("ar", "en"):
        return language_hint  # type: ignore[return-value]
    if _ARABIC_RE.search(text or ""):
        return "ar"
    return "en"






