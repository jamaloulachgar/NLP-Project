from __future__ import annotations

"""
Convert UM5 structured JSON (data/jsondataaaa.json) into RAG KB JSONL.

Output format (one JSON object per line):
  {"id": "...", "title": "...", "url": "...", "type": "official|faq|policy", "text": "Q: ...\nA: ..."}

Usage (Windows CMD):
  cd NLP-project
  python nlp\\tools\\um5_json_to_kb.py --in data\\jsondataaaa.json --out data\\kb_um5.jsonl

Then you can merge into your main KB:
  type data\\kb_um5.jsonl >> data\\kb.jsonl
"""

import argparse
import json
import os
import re
from datetime import datetime
from hashlib import sha1
from typing import Any, Dict, Iterable, List, Optional, Tuple

import requests
import time


def _slugify(s: str) -> str:
    s = (s or "").lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "item"


def _emit(out: List[Dict[str, Any]], *, id_: str, title: str, url: str, type_: str, q: str, a: str):
    out.append(
        {
            "id": id_,
            "title": title,
            "url": url,
            "type": type_,
            "text": f"Q: {q}\nA: {a}",
        }
    )


def _safe_get(d: Dict[str, Any], path: List[str]) -> Any:
    cur: Any = d
    for p in path:
        if not isinstance(cur, dict) or p not in cur:
            return None
        cur = cur[p]
    return cur


def _fmt_date(s: str) -> str:
    # Keep as-is if already ISO
    try:
        dt = datetime.fromisoformat(s)
        return dt.date().isoformat()
    except Exception:
        return str(s)


def _load_cache(path: str) -> Dict[str, Dict[str, str]]:
    if not path or not os.path.exists(path):
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f) or {}
    except Exception:
        return {}


def _save_cache(path: str, cache: Dict[str, Dict[str, str]]) -> None:
    if not path:
        return
    with open(path, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def _gemini_translate(
    *,
    q_fr: str,
    a_fr: str,
    target_lang: str,
    api_key: str,
    model: str,
    api_version: str,
) -> Tuple[str, str]:
    base = "https://generativelanguage.googleapis.com"
    model = model.replace("models/", "").strip()
    api_version = (api_version or "v1").strip()
    url = f"{base}/{api_version}/models/{model}:generateContent"

    instruction = (
        "Translate the following French question and answer into English."
        if target_lang == "en"
        else "ترجم السؤال والجواب التاليين من الفرنسية إلى العربية."
    )
    constraints = (
        "Rules: preserve dates, numbers, URLs exactly; keep university names; do not add new facts. "
        "Return JSON with keys q and a only."
        if target_lang == "en"
        else "القواعد: حافظ على التواريخ والأرقام والروابط كما هي؛ لا تضف معلومات جديدة. "
        "أرجع JSON فقط بالمفاتيح q و a."
    )
    prompt = f"{instruction}\n{constraints}\n\nFR_Q: {q_fr}\nFR_A: {a_fr}\n"

    payload = {"contents": [{"role": "user", "parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.0}}
    # Retry on rate limits / transient errors
    max_retries = int(os.getenv("GEMINI_TRANSLATE_RETRIES", "6"))
    base_sleep = float(os.getenv("GEMINI_TRANSLATE_SLEEP", "2.0"))
    last_exc: Exception | None = None
    for attempt in range(max_retries):
        try:
            r = requests.post(url, params={"key": api_key}, json=payload, timeout=60)
            if r.status_code == 429:
                retry_after = r.headers.get("Retry-After")
                sleep_s = float(retry_after) if (retry_after and retry_after.isdigit()) else base_sleep * (2**attempt)
                print(f"[429] Rate limited. Sleeping {sleep_s:.1f}s then retrying...")
                time.sleep(sleep_s)
                continue
            if r.status_code >= 500:
                sleep_s = base_sleep * (2**attempt)
                print(f"[{r.status_code}] Server error. Sleeping {sleep_s:.1f}s then retrying...")
                time.sleep(sleep_s)
                continue
            r.raise_for_status()
            data = r.json()
            break
        except Exception as e:
            last_exc = e
            sleep_s = base_sleep * (2**attempt)
            print(f"[error] {type(e).__name__}: {e}. Sleeping {sleep_s:.1f}s then retrying...")
            time.sleep(sleep_s)
    else:
        raise RuntimeError(f"Gemini translate failed after retries. Last error: {last_exc}")
    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError("Gemini returned no candidates")
    content = candidates[0].get("content") or {}
    parts = content.get("parts") or []
    if not parts:
        raise RuntimeError("Gemini returned empty parts")
    text = str(parts[0].get("text") or "").strip()
    m = re.search(r"\{[\s\S]*\}", text)
    if not m:
        raise RuntimeError(f"Gemini did not return JSON. Got: {text[:200]}")
    obj = json.loads(m.group(0))
    q = str(obj.get("q") or "").strip()
    a = str(obj.get("a") or "").strip()
    if not q or not a:
        raise RuntimeError("Gemini JSON missing q/a")
    return q, a


def translate_entries(
    items_fr: List[Dict[str, Any]],
    *,
    langs: List[str],
    cache_path: str,
    gemini_key: str,
    gemini_model: str,
    gemini_api_version: str,
) -> List[Dict[str, Any]]:
    if not langs:
        return items_fr

    cache = _load_cache(cache_path)
    out: List[Dict[str, Any]] = []

    max_items = int(os.getenv("UM5_TRANSLATE_MAX_ITEMS", "0"))  # 0 = no limit
    processed = 0
    for it in items_fr:
        base_id = str(it.get("id") or "")
        url = str(it.get("url") or "")
        type_ = str(it.get("type") or "official")
        text = str(it.get("text") or "")
        q_fr = ""
        a_fr = ""
        for line in text.splitlines():
            if line.startswith("Q:"):
                q_fr = line[2:].strip()
            if line.startswith("A:"):
                a_fr = line[2:].strip()
        if not q_fr or not a_fr:
            continue

        for lang in langs:
            lang = lang.strip().lower()
            if lang not in ("en", "ar"):
                continue
            cache_key = sha1(f"{lang}|{q_fr}|{a_fr}".encode("utf-8")).hexdigest()
            if cache_key in cache:
                q = cache[cache_key].get("q", "")
                a = cache[cache_key].get("a", "")
            else:
                if not gemini_key:
                    continue
                try:
                    q, a = _gemini_translate(
                        q_fr=q_fr,
                        a_fr=a_fr,
                        target_lang=lang,
                        api_key=gemini_key,
                        model=gemini_model,
                        api_version=gemini_api_version,
                    )
                    cache[cache_key] = {"q": q, "a": a}
                except Exception as e:
                    # Don't crash the whole run on one failure; user can rerun later (cache will keep progress).
                    print(f"[WARN] Translation failed for id={base_id} lang={lang}: {e}")
                    continue

            title = str(it.get("title") or "UM5 FAQ")
            title = f"{title} ({'EN' if lang == 'en' else 'AR'})"
            out.append(
                {
                    "id": f"{base_id}-{lang}",
                    "title": title,
                    "url": url,
                    "type": type_,
                    "text": f"Q: {q}\nA: {a}",
                }
            )
            processed += 1
            if max_items and processed >= max_items:
                print(f"Reached UM5_TRANSLATE_MAX_ITEMS={max_items}. Stopping early.")
                _save_cache(cache_path, cache)
                return out

    _save_cache(cache_path, cache)
    return out


def build_entries(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []

    uni = data.get("university") or {}
    uni_name = uni.get("name") or "Université"
    uni_site = uni.get("website") or ""

    # --- Sources list (metadata) ---
    sources = _safe_get(data, ["scrape_metadata", "sources"]) or []
    if isinstance(sources, list) and sources:
        for i, s in enumerate(sources[:80]):  # cap
            if not isinstance(s, dict):
                continue
            name = s.get("name") or "Source"
            url = s.get("url") or uni_site
            type_ = "official"
            q = f"Quelle est la page officielle pour: {name} ?"
            a = f"La page officielle est: {url}"
            _emit(
                out,
                id_=f"um5-source-{i}-{_slugify(name)[:32]}",
                title=f"{uni_name} — Sources officielles",
                url=url,
                type_=type_,
                q=q,
                a=a,
            )

    # --- Calendar (rentrée) ---
    cal_url = "https://www.um5.ac.ma/um5/calendrier-universitaire"
    cal = data.get("calendrier") or {}
    annee = cal.get("annee_universitaire") or ""
    if annee:
        _emit(
            out,
            id_=f"um5-cal-year-{_slugify(str(annee))}",
            title=f"{uni_name} — Calendrier universitaire",
            url=cal_url,
            type_="official",
            q="Quelle est l'année universitaire (UM5) ?",
            a=f"L'année universitaire est {annee}.",
        )

    # key dates across sections
    rentree = cal.get("rentee_universitaire") or {}
    # DUT
    dut = rentree.get("dut") or {}
    if dut:
        pre = dut.get("preinscription") or {}
        if isinstance(pre, dict) and pre.get("start_date") and pre.get("end_date"):
            q = "Quelles sont les dates de préinscription DUT (Accès EST) ?"
            a = (
                f"Préinscription DUT via {pre.get('platform_name','la plateforme')} ({pre.get('platform_url','')}) "
                f"du {_fmt_date(pre['start_date'])} au {_fmt_date(pre['end_date'])}."
            )
            _emit(out, id_="um5-dut-preinscription", title=f"{uni_name} — DUT préinscription", url=cal_url, type_="official", q=q, a=a)

    # Licence accès ouvert
    lao = rentree.get("licence_acces_ouvert") or {}
    if lao:
        pre = lao.get("preinscription") or {}
        if isinstance(pre, dict) and pre.get("start_date") and pre.get("end_date"):
            q = "Quelles sont les dates de préinscription Licence (accès ouvert) ?"
            a = (
                f"Préinscription Licence (accès ouvert) via {pre.get('platform_url','la plateforme UM5')} "
                f"du {_fmt_date(pre['start_date'])} au {_fmt_date(pre['end_date'])}."
            )
            _emit(out, id_="um5-licence-ao-preinscription", title=f"{uni_name} — Licence accès ouvert", url=cal_url, type_="official", q=q, a=a)

        insc = lao.get("inscription_administrative") or {}
        if isinstance(insc, dict):
            ni = insc.get("inscriptions_administratives_ni") or {}
            if isinstance(ni, dict) and ni.get("start_date") and ni.get("end_date"):
                q = "Quelles sont les dates d’inscription administrative (nouveaux inscrits) pour la Licence accès ouvert ?"
                a = f"Inscriptions administratives (nouveaux inscrits) du {_fmt_date(ni['start_date'])} au {_fmt_date(ni['end_date'])}."
                _emit(out, id_="um5-licence-ao-insc-ni", title=f"{uni_name} — Inscription administrative", url=cal_url, type_="official", q=q, a=a)

    # Master
    master = rentree.get("master") or {}
    if master:
        pre = master.get("preinscription") or {}
        if isinstance(pre, dict) and pre.get("start_date") and pre.get("end_date"):
            q = "Quelles sont les dates de préinscription Master (UM5) ?"
            a = (
                f"Préinscription Master via {pre.get('platform_url','la plateforme UM5')} "
                f"du {_fmt_date(pre['start_date'])} au {_fmt_date(pre['end_date'])}."
            )
            _emit(out, id_="um5-master-preinscription", title=f"{uni_name} — Master préinscription", url=cal_url, type_="official", q=q, a=a)

    # --- Registration portals ---
    insc = data.get("inscription") or {}
    portails = insc.get("portails") or []
    if isinstance(portails, list) and portails:
        for i, p in enumerate(portails[:30]):
            if not isinstance(p, dict):
                continue
            name = p.get("name") or "Portail"
            url = p.get("url") or uni_site
            q = f"Quel est le lien officiel pour: {name} ?"
            a = f"Le lien officiel est: {url}"
            _emit(out, id_=f"um5-portail-{i}-{_slugify(name)[:32]}", title=f"{uni_name} — Portails d’inscription", url=url, type_="official", q=q, a=a)

    # --- Formation overview ---
    formation = data.get("formation") or {}
    fi = _safe_get(formation, ["formation_initiale"]) or {}
    if isinstance(fi, dict):
        url = fi.get("url") or "https://www.um5.ac.ma/um5/formation-initiale"
        headline = fi.get("headline") or ""
        if headline:
            _emit(out, id_="um5-formation-headline", title=f"{uni_name} — Formation initiale", url=url, type_="official", q="Quels sont les chiffres clés de la formation initiale à l’UM5 ?", a=headline)
        ck = _safe_get(fi, ["chiffres_cles", "filieres_total"])
        if ck is not None:
            _emit(out, id_="um5-formation-filieres-total", title=f"{uni_name} — Formation initiale", url=url, type_="official", q="Combien de filières sont accréditées (formation initiale) ?", a=f"{ck} filières accréditées (selon la page formation initiale).")

    # --- Exam resources (links) ---
    examens = data.get("examens") or {}
    res = examens.get("resources") or []
    if isinstance(res, list) and res:
        for i, r in enumerate(res[:60]):
            if not isinstance(r, dict):
                continue
            title = r.get("title") or r.get("institution") or "Ressource examens"
            url = r.get("url") or uni_site
            inst = r.get("institution") or ""
            q = f"Où trouver le planning/calendrier des examens ({inst}) ?".strip()
            a = f"Voir la ressource officielle: {title} — {url}"
            _emit(out, id_=f"um5-exams-{i}-{_slugify(title)[:32]}", title=f"{uni_name} — Examens", url=url, type_="official", q=q, a=a)

    # Deduplicate by id (just in case)
    uniq: Dict[str, Dict[str, Any]] = {}
    for it in out:
        uniq[it["id"]] = it
    return list(uniq.values())


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--in", dest="in_path", default="data/jsondataaaa.json", help="Input JSON path")
    p.add_argument("--out", dest="out_path", default="data/kb_um5.jsonl", help="Output JSONL path")
    p.add_argument("--langs", default="en,ar", help="Target languages (comma-separated). Supported: en,ar")
    p.add_argument("--cache", default="data/translate_cache_um5.json", help="Translation cache path")
    p.add_argument("--gemini-model", default=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), help="Gemini model name")
    p.add_argument("--gemini-api-version", default=os.getenv("GEMINI_API_VERSION", "v1"), help="Gemini API version (v1/v1beta)")
    args = p.parse_args()

    with open(args.in_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    items_fr = build_entries(data)
    langs = [x.strip() for x in (args.langs or "").split(",") if x.strip()]
    gemini_key = (os.getenv("GEMINI_API_KEY") or "").strip()
    if langs and not gemini_key:
        print("WARNING: GEMINI_API_KEY not set; translations will be skipped. Set GEMINI_API_KEY and re-run.")

    items = translate_entries(
        items_fr,
        langs=langs,
        cache_path=args.cache,
        gemini_key=gemini_key,
        gemini_model=args.gemini_model,
        gemini_api_version=args.gemini_api_version,
    )
    with open(args.out_path, "w", encoding="utf-8") as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False) + "\n")

    print(f"Wrote {len(items)} lines to {args.out_path}")


if __name__ == "__main__":
    main()


