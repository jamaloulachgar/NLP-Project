from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List


def _item(_id: str, title: str, url: str, type_: str, q: str, a: str) -> Dict[str, Any]:
    return {
        "id": _id,
        "title": title,
        "url": url,
        "type": type_,
        "text": f"Q: {q}\nA: {a}",
    }


def build_um5_official_items() -> List[Dict[str, Any]]:
    """
    Curated, verifiable facts from the official UM5 website homepage contact section.
    Source: https://www.um5.ac.ma/um5/
    """
    url = "https://www.um5.ac.ma/um5/"
    items: List[Dict[str, Any]] = []

    # Contact (FR)
    items.append(
        _item(
            "um5-contact-email-fr",
            "UM5 — Contact (FR)",
            url,
            "official",
            "Quel est l’e-mail de contact de la Présidence de l’UM5 ?",
            "Vous pouvez contacter la Présidence de l’UM5 à l’adresse : presidence@um5.ac.ma.",
        )
    )
    items.append(
        _item(
            "um5-contact-phone-fr",
            "UM5 — Contact (FR)",
            url,
            "official",
            "Quel est le numéro de téléphone de l’UM5 (Présidence) ?",
            "Téléphone : 0537272755 (ou +212 537 272 755).",
        )
    )
    items.append(
        _item(
            "um5-contact-fax-fr",
            "UM5 — Contact (FR)",
            url,
            "official",
            "Quel est le numéro de fax de l’UM5 (Présidence) ?",
            "Fax : 0537671401 (ou +212 537 671 401).",
        )
    )
    items.append(
        _item(
            "um5-contact-address-fr",
            "UM5 — Contact (FR)",
            url,
            "official",
            "Quelle est l’adresse de la Présidence de l’UM5 ?",
            "Avenue des Nations Unies, Agdal, Rabat, Maroc (B.P: 8007 N.U).",
        )
    )
    items.append(
        _item(
            "um5-contact-webmaster-fr",
            "UM5 — Contact (FR)",
            url,
            "official",
            "Quel est l’e-mail du webmaster (UM5) ?",
            "E-mail webmaster : web@um5.ac.ma.",
        )
    )

    # Contact (EN)
    items.append(
        _item(
            "um5-contact-email-en",
            "UM5 — Contact (EN)",
            url,
            "official",
            "What is the contact email for UM5 (Presidency)?",
            "You can contact UM5 Presidency at: presidence@um5.ac.ma.",
        )
    )
    items.append(
        _item(
            "um5-contact-phone-en",
            "UM5 — Contact (EN)",
            url,
            "official",
            "What is the phone number for UM5 (Presidency)?",
            "Phone: +212 537 272 755.",
        )
    )
    items.append(
        _item(
            "um5-contact-fax-en",
            "UM5 — Contact (EN)",
            url,
            "official",
            "What is the fax number for UM5 (Presidency)?",
            "Fax: +212 537 671 401.",
        )
    )
    items.append(
        _item(
            "um5-contact-address-en",
            "UM5 — Contact (EN)",
            url,
            "official",
            "What is the address of UM5 Presidency?",
            "Avenue des Nations Unies, Agdal, Rabat, Morocco (P.O. Box: 8007 N.U).",
        )
    )
    items.append(
        _item(
            "um5-contact-webmaster-en",
            "UM5 — Contact (EN)",
            url,
            "official",
            "What is the webmaster email for UM5?",
            "Webmaster email: web@um5.ac.ma.",
        )
    )

    # Contact (AR)
    items.append(
        _item(
            "um5-contact-email-ar",
            "UM5 — معلومات الاتصال (AR)",
            url,
            "official",
            "ما هو البريد الإلكتروني للتواصل مع رئاسة جامعة محمد الخامس؟",
            "يمكنك التواصل مع رئاسة الجامعة عبر البريد: presidence@um5.ac.ma.",
        )
    )
    items.append(
        _item(
            "um5-contact-phone-ar",
            "UM5 — معلومات الاتصال (AR)",
            url,
            "official",
            "ما هو رقم هاتف رئاسة جامعة محمد الخامس؟",
            "الهاتف: +212 537 272 755.",
        )
    )
    items.append(
        _item(
            "um5-contact-fax-ar",
            "UM5 — معلومات الاتصال (AR)",
            url,
            "official",
            "ما هو رقم الفاكس الخاص برئاسة جامعة محمد الخامس؟",
            "الفاكس: +212 537 671 401.",
        )
    )
    items.append(
        _item(
            "um5-contact-address-ar",
            "UM5 — معلومات الاتصال (AR)",
            url,
            "official",
            "ما هو عنوان رئاسة جامعة محمد الخامس؟",
            "شارع الأمم المتحدة، أكدال، الرباط، المغرب (ص.ب: 8007 N.U).",
        )
    )
    items.append(
        _item(
            "um5-contact-webmaster-ar",
            "UM5 — معلومات الاتصال (AR)",
            url,
            "official",
            "ما هو البريد الإلكتروني للويبماستر (UM5)؟",
            "بريد الويبماستر: web@um5.ac.ma.",
        )
    )

    return items


def merge_jsonl(*, base_path: Path, add_path: Path, out_path: Path, overwrite: bool) -> None:
    base_by_id: dict[str, str] = {}
    base_order: list[str] = []
    if base_path.exists():
        for line in base_path.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            obj = json.loads(line)
            _id = str(obj.get("id") or "")
            if not _id:
                continue
            if _id not in base_by_id:
                base_order.append(_id)
            base_by_id[_id] = line

    add_by_id: dict[str, str] = {}
    add_order: list[str] = []
    for line in add_path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        obj = json.loads(line)
        _id = str(obj.get("id") or "")
        if not _id:
            continue
        if _id not in add_by_id:
            add_order.append(_id)
        add_by_id[_id] = line

    # Start with official items first, then the rest.
    merged_lines: list[str] = []
    seen: set[str] = set()

    for _id in add_order:
        merged_lines.append(add_by_id[_id])
        seen.add(_id)

    for _id in base_order:
        if _id in seen:
            if overwrite:
                # keep the official item already inserted
                continue
            merged_lines.append(base_by_id[_id])
        else:
            merged_lines.append(base_by_id[_id])
            seen.add(_id)

    out_path.write_text("\n".join(merged_lines) + "\n", encoding="utf-8")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="data/kb_um5_official.jsonl", help="Output jsonl path")
    p.add_argument("--merge-into", default="", help="If set, merge into this kb jsonl path")
    p.add_argument("--overwrite", action="store_true", help="When merging, overwrite existing items with same id")
    args = p.parse_args()

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    items = build_um5_official_items()
    out_path.write_text("\n".join(json.dumps(it, ensure_ascii=False) for it in items) + "\n", encoding="utf-8")
    print(f"Wrote {len(items)} items to {out_path}")

    if args.merge_into:
        base_path = Path(args.merge_into)
        merged_path = base_path
        merge_jsonl(base_path=base_path, add_path=out_path, out_path=merged_path, overwrite=args.overwrite)
        print(f"Merged into {merged_path}")


if __name__ == "__main__":
    main()


