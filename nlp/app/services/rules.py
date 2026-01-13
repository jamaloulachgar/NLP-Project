from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, Optional


@dataclass
class RuleResult:
    intent: str
    confidence: float
    answer: str


def apply_rules(message: str, lang: Literal["ar", "en"]) -> Optional[RuleResult]:
    m = (message or "").lower()

    # Greetings / small talk (keep response short and don't call KB/LLM)
    greeting_en = any(k in m for k in ["hi", "hello", "hey", "heyy", "heyyy", "heey", "hiya"])
    greeting_fr = any(k in m for k in ["salut", "bonjour", "bonsoir", "coucou"])
    greeting_ar = any(k in m for k in ["سلام", "السلام", "مرحبا", "أهلا", "اهلا"])
    how_are_you = any(k in m for k in ["how are you", "how r u", "how are u", "how are uu", "hru"])
    if greeting_en or greeting_fr or greeting_ar or how_are_you:
        if lang == "ar":
            return RuleResult(
                intent="greeting",
                confidence=0.95,
                answer="مرحباً! أنا مساعد شؤون الطلبة. كيف يمكنني مساعدتك؟",
            )
        return RuleResult(
            intent="greeting",
            confidence=0.95,
            answer="Hello there! I'm happy to help in any way I can as your university student-services assistant.",
        )

    # Calendar / schedule
    calendarish = any(k in m for k in ["calendar", "schedule", "exam", "semester"])
    mentions_academic_calendar = "academic calendar" in m
    mentions_timetable = any(k in m for k in ["timetable", "class timetable"])
    # Arabic hints
    mentions_academic_calendar_ar = any(k in m for k in ["التقويم", "تقويم أكاديمي", "التقويم الأكاديمي"])
    mentions_timetable_ar = any(k in m for k in ["جدول", "جدول الحصص"])
    # If the user explicitly asks for a start date, it's almost certainly the academic calendar (not class timetable).
    explicit_start_date_en = any(k in m for k in ["start date", "date of start", "when does semester", "semester start"])
    explicit_start_date_ar = any(k in m for k in ["تاريخ بداية", "بداية الفصل", "متى يبدأ الفصل", "متى تبدا الفصل"])

    # Only ask clarification if user seems to ask about dates/schedule but didn't specify calendar vs timetable.
    if calendarish and not (explicit_start_date_en or explicit_start_date_ar) and not (
        mentions_academic_calendar
        or mentions_timetable
        or mentions_academic_calendar_ar
        or mentions_timetable_ar
    ):
        if lang == "ar":
            return RuleResult(
                intent="academic_calendar",
                confidence=0.85,
                answer="هل تقصد **التقويم الأكاديمي** (بداية الفصل/نهاية الفصل/الامتحانات) أم **جدول الحصص**؟ أعطني الشعبة/المستوى وسأبحث في الوثائق.",
            )
        return RuleResult(
            intent="academic_calendar",
            confidence=0.85,
            answer="Do you mean the **academic calendar** (semester dates/exams) or the **class timetable**? Tell me your program/level and I’ll look it up in the documents.",
        )

    if any(k in m for k in ["admission", "apply", "enroll", "registration", "inscription"]):
        if lang == "ar":
            return RuleResult(
                intent="admissions",
                confidence=0.85,
                answer="لأسئلة القبول/التسجيل: هل أنت طالب جديد أم إعادة تسجيل؟ أعطني المستوى/الشعبة وسأستخرج الشروط والوثائق المطلوبة من الدليل.",
            )
        return RuleResult(
            intent="admissions",
            confidence=0.85,
            answer="For admissions/registration: are you a new student or re-enrolling? Share your program/level and I’ll extract the requirements and documents from the guide.",
        )

    if any(k in m for k in ["event", "conference", "workshop", "club", "activité", "événement"]):
        if lang == "ar":
            return RuleResult(
                intent="events",
                confidence=0.8,
                answer="هل تبحث عن **حدث** محدد (اسم/تاريخ) أم قائمة الفعاليات القادمة؟ أعطني الفترة الزمنية وسأبحث في إعلانات الجامعة.",
            )
        return RuleResult(
            intent="events",
            confidence=0.8,
            answer="Are you looking for a specific **event** (name/date) or a list of upcoming events? Give me the timeframe and I’ll search the university announcements.",
        )

    return None




