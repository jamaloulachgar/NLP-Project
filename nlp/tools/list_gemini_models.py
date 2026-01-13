from __future__ import annotations

"""
List available Gemini models for your API key.

Usage (Windows CMD):
  cd NLP-project
  set GEMINI_API_KEY=...   (do NOT commit this)
  python nlp\\tools\\list_gemini_models.py

Or:
  python nlp\\tools\\list_gemini_models.py --key YOUR_KEY --api-version v1
"""

import argparse
import os
import requests


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--key", default="", help="Gemini API key (or use env GEMINI_API_KEY)")
    p.add_argument("--api-version", default="v1", choices=["v1", "v1beta"], help="API version")
    args = p.parse_args()

    key = (args.key or os.getenv("GEMINI_API_KEY") or "").strip()
    if not key:
        raise SystemExit("Missing key. Provide --key or set GEMINI_API_KEY.")

    url = f"https://generativelanguage.googleapis.com/{args.api_version}/models"
    r = requests.get(url, params={"key": key}, timeout=30)
    print("status:", r.status_code)
    r.raise_for_status()
    data = r.json()
    models = data.get("models") or []
    for m in models:
        name = m.get("name")
        display = m.get("displayName")
        methods = m.get("supportedGenerationMethods")
        short = str(name).replace("models/", "")
        print(f"- {name} | {display} | methods={methods} | set GEMINI_MODEL={short}")


if __name__ == "__main__":
    main()


