#!/usr/bin/env python3
"""dsh-provider-catalog: maintain a local model catalog from OpenCode metadata."""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import subprocess
import sys


def parse_opencode_models() -> list[dict]:
    out = subprocess.check_output(
        ["opencode", "models", "--verbose"], text=True, timeout=60, stderr=subprocess.DEVNULL,
    )
    lines = out.splitlines()
    entries = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line and "/" in line and not line.startswith("{") and not line.startswith("}"):
            j = i + 1
            while j < len(lines) and lines[j].strip() == "":
                j += 1
            if j < len(lines) and lines[j].strip() == "{":
                text = "\n".join(lines[j:])
                obj, end = json.JSONDecoder().raw_decode(text)
                provider, _, model_id = line.partition("/")
                entries.append({
                    "provider": provider,
                    "id": model_id,
                    "name": obj.get("name", model_id),
                    "api": obj.get("api", {}),
                    "limit": obj.get("limit", {}),
                    "capabilities": obj.get("capabilities", {}),
                    "variants": obj.get("variants", {}),
                })
                i = j + text[:end].count("\n") + 1
                continue
        i += 1
    return entries


def cache_path(dsh_home: pathlib.Path) -> pathlib.Path:
    return dsh_home / "cache" / "model-catalog.json"


def load_cache(dsh_home: pathlib.Path) -> list[dict]:
    path = cache_path(dsh_home)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_cache(dsh_home: pathlib.Path, entries: list[dict]) -> None:
    path = cache_path(dsh_home)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dsh-home", default=os.environ.get("DSH_HOME") or str(pathlib.Path.home() / ".dsh"))
    sub = ap.add_subparsers(dest="command", required=True)

    sub.add_parser("refresh", help="refresh catalog from OpenCode")

    p_list = sub.add_parser("list", help="list catalog")
    p_list.add_argument("--provider", default=None)
    p_list.add_argument("--query", default=None)

    args = ap.parse_args(argv)
    dsh_home = pathlib.Path(args.dsh_home)

    if args.command == "refresh":
        entries = parse_opencode_models()
        save_cache(dsh_home, entries)
        print(f"Refreshed {len(entries)} models -> {cache_path(dsh_home)}")
        return 0

    if args.command == "list":
        entries = load_cache(dsh_home)
        if not entries:
            print("Catalog is empty. Run: dsh-provider-catalog refresh", file=sys.stderr)
            return 1
        q = (args.query or "").lower()
        for e in entries:
            if args.provider and e["provider"] != args.provider:
                continue
            if q and q not in f"{e['provider']}/{e['id']} {e.get('name','')}".lower():
                continue
            print(f"{e['provider']}/{e['id']} ({e.get('name','')})")
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
