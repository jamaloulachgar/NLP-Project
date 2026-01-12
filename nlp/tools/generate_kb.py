from __future__ import annotations

"""
Generate a synthetic FAQ-style knowledge base as JSONL for the chatbot.

Output format (one JSON object per line):
  {"id": "...", "title": "...", "url": "...", "type": "official|faq|policy", "text": "Q: ...\nA: ..."}

Usage (Windows CMD):
  cd NLP-project
  python nlp\\tools\\generate_kb.py --out data\\kb.jsonl --count 1000
"""

import argparse
import json
import random
import re
from dataclasses import dataclass
from typing import Iterable, List, Literal, Sequence


Type = Literal["official", "faq", "policy"]


def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "item"


@dataclass(frozen=True)
class Topic:
    key: str
    url: str
    type: Type
    # Q/A templates; we’ll expand with variants.
    questions_en: Sequence[str]
    answers_en: Sequence[str]
    questions_ar: Sequence[str]
    answers_ar: Sequence[str]


TOPICS: List[Topic] = [
    Topic(
        key="academic_calendar",
        url="https://university.example.edu/calendar",
        type="official",
        questions_en=[
            "When does semester {sem} start?",
            "What is the start date of semester {sem}?",
            "When do classes begin for semester {sem}?",
            "What are the exam dates for semester {sem}?",
            "When is the make-up session for semester {sem}?",
        ],
        answers_en=[
            "Please refer to the official academic calendar. Semester {sem} typically starts on {date}.",
            "According to the academic calendar, semester {sem} starts on {date}.",
            "Exam dates are published in the academic calendar; for semester {sem}, exams are typically during {range}.",
            "Make-up sessions are typically scheduled after the main exams; check the calendar for the exact dates.",
        ],
        questions_ar=[
            "متى يبدأ الفصل {sem}؟",
            "ما تاريخ بداية الفصل {sem}؟",
            "متى تبدأ الدراسة في الفصل {sem}؟",
            "متى تجرى امتحانات الفصل {sem}؟",
            "متى تكون الدورة الاستدراكية للفصل {sem}؟",
        ],
        answers_ar=[
            "يرجى الرجوع إلى التقويم الأكاديمي الرسمي. يبدأ الفصل {sem} عادةً في {date}.",
            "حسب التقويم الأكاديمي، يبدأ الفصل {sem} في {date}.",
            "تُنشر تواريخ الامتحانات في التقويم الأكاديمي؛ وغالباً ما تكون امتحانات الفصل {sem} خلال {range}.",
            "الدورة الاستدراكية تكون عادةً بعد الامتحانات الرئيسية؛ تحقق من التقويم للتواريخ الدقيقة.",
        ],
    ),
    Topic(
        key="registration",
        url="https://university.example.edu/registration",
        type="policy",
        questions_en=[
            "How do I register as a new student?",
            "What documents are required for registration?",
            "Where do I submit my registration file?",
            "What are the office hours for student services?",
            "Can I register online?",
        ],
        answers_en=[
            "Registration usually includes online pre-registration and in-person document submission. Requirements may vary by program.",
            "Common documents: ID copy, transcripts, photos, and the admission decision (if applicable). Please check your faculty page.",
            "Files are typically submitted to the Student Services/Registrar office. Verify location on the official website.",
            "Office hours are typically Mon–Fri, morning and afternoon. Please confirm on the official page.",
            "Many universities provide online pre-registration, but final validation often requires document submission.",
        ],
        questions_ar=[
            "كيف أسجل كطالب جديد؟",
            "ما هي الوثائق المطلوبة للتسجيل؟",
            "أين أضع ملف التسجيل؟",
            "ما هي أوقات عمل مصلحة شؤون الطلبة؟",
            "هل يمكن التسجيل عبر الإنترنت؟",
        ],
        answers_ar=[
            "عادةً يشمل التسجيل تسجيلًا أوليًا عبر الإنترنت ثم إيداع الوثائق حضوريًا. تختلف المتطلبات حسب الشعبة.",
            "وثائق شائعة: نسخة بطاقة التعريف، بيانات النقط، صور، وقرار القبول (إن وجد). تحقق من صفحة الكلية.",
            "يتم إيداع الملفات غالبًا لدى مصلحة شؤون الطلبة/التسجيل. تحقق من العنوان في الموقع الرسمي.",
            "أوقات العمل غالبًا من الإثنين إلى الجمعة صباحًا ومساءً. يرجى التأكد من الصفحة الرسمية.",
            "يتوفر غالبًا تسجيل أولي عبر الإنترنت، لكن المصادقة النهائية تتطلب عادةً إيداع الملف.",
        ],
    ),
    Topic(
        key="tuition_fees",
        url="https://university.example.edu/fees",
        type="policy",
        questions_en=[
            "What are the tuition fees for {cycle}?",
            "How do I pay the registration fees?",
            "Is there a fee waiver or scholarship?",
            "Do I need to pay insurance fees?",
        ],
        answers_en=[
            "Fees depend on the cycle ({cycle}) and status. Please check the official fees page.",
            "Payment options may include bank transfer or payment at the cashier. Check instructions for your faculty.",
            "Scholarships/waivers depend on eligibility criteria. Consult the scholarship office or official portal.",
            "Some universities require insurance fees; confirm the amount and procedure on the official page.",
        ],
        questions_ar=[
            "ما هي رسوم التسجيل ل{cycle}؟",
            "كيف أدفع رسوم التسجيل؟",
            "هل توجد إعفاءات أو منح؟",
            "هل يجب دفع رسوم التأمين؟",
        ],
        answers_ar=[
            "تختلف الرسوم حسب السلك ({cycle}) والوضعية. راجع صفحة الرسوم الرسمية.",
            "طرق الأداء قد تشمل التحويل البنكي أو الأداء لدى الصندوق. تحقق من تعليمات كليتك.",
            "المنح/الإعفاءات تعتمد على شروط الاستحقاق. راجع مصلحة المنح أو البوابة الرسمية.",
            "قد تكون هناك رسوم تأمين؛ تحقق من المبلغ والمساطر في الصفحة الرسمية.",
        ],
    ),
    Topic(
        key="events",
        url="https://university.example.edu/events",
        type="official",
        questions_en=[
            "Are there any events this week?",
            "How can I register for a workshop?",
            "Where can I find the university events calendar?",
            "Is there a student club fair?",
        ],
        answers_en=[
            "Check the official events page for the latest announcements and dates.",
            "Workshop registration is usually via an online form or email; details are listed in the event announcement.",
            "The events calendar is published on the university website and social media channels.",
            "Student club fairs are announced at the start of the semester; follow official updates for dates.",
        ],
        questions_ar=[
            "هل توجد فعاليات هذا الأسبوع؟",
            "كيف أسجل في ورشة؟",
            "أين أجد رزنامة فعاليات الجامعة؟",
            "هل يوجد معرض للأندية الطلابية؟",
        ],
        answers_ar=[
            "تحقق من صفحة الفعاليات الرسمية للاطلاع على آخر الإعلانات والتواريخ.",
            "التسجيل في الورش يكون عادةً عبر استمارة إلكترونية أو البريد؛ التفاصيل في إعلان الفعالية.",
            "تنشر رزنامة الفعاليات في موقع الجامعة والحسابات الرسمية.",
            "معارض الأندية تُعلن غالبًا في بداية الفصل؛ تابع القنوات الرسمية للتواريخ.",
        ],
    ),
]


SEMESTERS = ["1", "2"]
DATES = ["2024-09-09", "2025-02-03"]  # example placeholders
RANGES = ["January 13–24, 2025", "May 26–June 6, 2025"]
CYCLES_EN = ["Bachelor", "Master", "PhD"]
CYCLES_AR = ["الإجازة", "الماستر", "الدكتوراه"]


def expand_topic(topic: Topic, *, count: int, rng: random.Random) -> List[dict]:
    out: List[dict] = []
    for i in range(count):
        lang = "ar" if rng.random() < 0.5 else "en"
        sem = rng.choice(SEMESTERS)
        date = rng.choice(DATES)
        range_ = rng.choice(RANGES)
        if lang == "en":
            q = rng.choice(topic.questions_en).format(sem=sem, date=date, range=range_, cycle=rng.choice(CYCLES_EN))
            a = rng.choice(topic.answers_en).format(sem=sem, date=date, range=range_, cycle=rng.choice(CYCLES_EN))
            title = f"FAQ: {topic.key} (EN)"
        else:
            q = rng.choice(topic.questions_ar).format(sem=sem, date=date, range=range_, cycle=rng.choice(CYCLES_AR))
            a = rng.choice(topic.answers_ar).format(sem=sem, date=date, range=range_, cycle=rng.choice(CYCLES_AR))
            title = f"سؤال وجواب: {topic.key} (AR)"

        item_id = f"{topic.key}-{lang}-{i}-{slugify(q)[:40]}"
        out.append(
            {
                "id": item_id,
                "title": title,
                "url": topic.url,
                "type": topic.type,
                "text": f"Q: {q}\nA: {a}",
            }
        )
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="data/kb.jsonl", help="Output path for kb.jsonl")
    p.add_argument("--count", type=int, default=1000, help="Number of lines to generate")
    p.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = p.parse_args()

    rng = random.Random(args.seed)
    per_topic = max(1, args.count // len(TOPICS))
    items: List[dict] = []
    for t in TOPICS:
        items.extend(expand_topic(t, count=per_topic, rng=rng))
    # If rounding produced more/less, trim/pad by sampling
    if len(items) > args.count:
        items = items[: args.count]
    while len(items) < args.count:
        t = rng.choice(TOPICS)
        items.extend(expand_topic(t, count=1, rng=rng))
        items = items[: args.count]

    with open(args.out, "w", encoding="utf-8") as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False) + "\n")

    print(f"Wrote {len(items)} lines to {args.out}")


if __name__ == "__main__":
    main()



