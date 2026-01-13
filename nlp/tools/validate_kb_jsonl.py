from __future__ import annotations

import argparse
import json
from pathlib import Path


def main():
    p = argparse.ArgumentParser()
    p.add_argument("path", nargs="?", default="data/kb.jsonl", help="Path to kb.jsonl")
    args = p.parse_args()

    path = Path(args.path)
    if not path.exists():
        raise SystemExit(f"File not found: {path}")

    bad = 0
    total = 0
    ids = set()
    dup = 0

    for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        total += 1
        try:
            obj = json.loads(line)
        except Exception as e:
            print(f"BAD JSON at line {i}: {e}")
            bad += 1
            continue
        _id = obj.get("id")
        if _id in ids:
            dup += 1
        else:
            ids.add(_id)

    print("file:", str(path))
    print("total_lines:", total)
    print("bad_json_lines:", bad)
    print("unique_ids:", len(ids))
    print("dup_ids:", dup)


if __name__ == "__main__":
    main()


