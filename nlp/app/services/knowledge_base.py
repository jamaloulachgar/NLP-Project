from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class KBItem:
    id: str
    title: str
    url: str
    type: str
    text: str


def _default_kb_items() -> List[KBItem]:
    # Minimal seed KB so the demo works out-of-the-box.
    return [
        KBItem(
            id="calendar-2024-2025-en",
            title="Academic Calendar (Sample)",
            url="https://university.example.edu/calendar",
            type="official",
            text="Academic year 2024-2025: Semester 1 starts on 2024-09-09. Winter break: 2024-12-21 to 2025-01-05. S1 exams: 2025-01-13 to 2025-01-24.",
        ),
        KBItem(
            id="calendar-2024-2025-ar",
            title="التقويم الأكاديمي (مثال)",
            url="https://university.example.edu/calendar-ar",
            type="official",
            text="السنة الجامعية 2024-2025: بداية الفصل الأول 09-09-2024. عطلة الشتاء: 21-12-2024 إلى 05-01-2025. امتحانات الفصل الأول: 13-01-2025 إلى 24-01-2025.",
        ),
        KBItem(
            id="admissions-en",
            title="Admissions & Registration (Sample)",
            url="https://university.example.edu/admissions",
            type="policy",
            text="Registration process: online pre-registration, then submit documents (ID copy, transcripts, photos). Office hours: Mon-Fri 09:00-12:00 and 14:00-16:00.",
        ),
        KBItem(
            id="admissions-ar",
            title="القبول والتسجيل (مثال)",
            url="https://university.example.edu/admissions-ar",
            type="policy",
            text="مسطرة التسجيل: تسجيل أولي عبر الإنترنت ثم إيداع الملف (نسخة بطاقة التعريف، بيانات النقط، صور). أوقات العمل: الإثنين-الجمعة 09:00-12:00 و 14:00-16:00.",
        ),
    ]


def resolve_kb_path(data_dir: str) -> Optional[str]:
    """
    Decide which KB file to use.
    Priority:
      1) KB_FILENAME env var (explicit override)
      2) kb_backup.jsonl (preferred default if present)
      3) kb.jsonl
    """
    kb_filename = (os.getenv("KB_FILENAME") or "").strip()
    candidates: list[str] = []
    if kb_filename:
        candidates.append(kb_filename)
    candidates.extend(["kb_backup.jsonl", "kb.jsonl"])
    for name in candidates:
        p = os.path.join(data_dir, name)
        if os.path.exists(p):
            return p
    return None


def load_kb(data_dir: str) -> List[KBItem]:
    """
    Loads knowledge base from /app/data/kb.jsonl (recommended) or falls back to a seeded KB.

    Expected jsonl format (one object per line):
      {"id":"...", "title":"...", "url":"...", "type":"official|faq|policy", "text":"..."}
    """
    path = resolve_kb_path(data_dir)
    if not path:
        return _default_kb_items()

    items: List[KBItem] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            items.append(
                KBItem(
                    id=str(obj.get("id") or ""),
                    title=str(obj.get("title") or "Source"),
                    url=str(obj.get("url") or ""),
                    type=str(obj.get("type") or "official"),
                    text=str(obj.get("text") or ""),
                )
            )
    # Drop empty texts
    return [it for it in items if it.text.strip()]






