#!/usr/bin/env python3
"""Regenerate src/content/fingerspelling.generated.json from upstream
sign-language-processing/signwriting fingerspelling data.

The upstream repo ships per-language `.txt` files where each line is
`<letter>,<FSW>[,<FSW>...]` (lines starting with `#` are comments). This
script clones the repo, parses each file, converts every FSW string to its
Unicode SWU form via the upstream `fsw2swu` utility, and writes a single
JSON artifact the React app imports.

Re-running the script overwrites the JSON, so a refresh of upstream data
shows up in the app on the next dev/build cycle.

Usage (from docling-out/):
    ./scripts/extract_fingerspelling.py
"""
from __future__ import annotations

import json
import locale
import re
import subprocess
import sys
import tempfile
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

REPO_URL = "https://github.com/sign-language-processing/signwriting.git"
PROJECT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_FILE = PROJECT_DIR / "src" / "content" / "fingerspelling.generated.json"

# Map ISO 3166-1 alpha-2 codes to display names. Using a small inline lookup
# avoids depending on pycountry or any Babel install for this one script.
COUNTRY_NAMES = {
    "be": "Belgium", "br": "Brazil", "ch": "Switzerland", "cn": "China",
    "de": "Germany", "dk": "Denmark", "es": "Spain", "fr": "France",
    "gb": "United Kingdom", "hn": "Honduras", "ie": "Ireland", "il": "Israel",
    "it": "Italy", "jp": "Japan", "kr": "South Korea", "mx": "Mexico",
    "ni": "Nicaragua", "no": "Norway", "pt": "Portugal", "se": "Sweden",
    "th": "Thailand", "us": "United States",
}

SYMBOL_RE = re.compile(r"S[0-9a-f]{5}")
LANE_RE = re.compile(r"[MBLR]\d{3}x\d{3}")


def import_upstream(repo_dir: Path):
    """Load the upstream fsw_to_swu module without installing the package."""
    module_path = repo_dir / "signwriting" / "formats" / "fsw_to_swu.py"
    spec = spec_from_file_location("fsw_to_swu", module_path)
    assert spec and spec.loader, f"Cannot load {module_path}"
    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def language_label(code: str) -> str:
    parts = code.split("-")
    country = parts[1] if len(parts) > 1 else ""
    acronym = (parts[3] if len(parts) > 3 else parts[-1]).upper()
    country_name = COUNTRY_NAMES.get(country, country.upper())
    return f"{acronym} — {country_name}" if country_name else acronym


def parse_file(path: Path, fsw_to_swu) -> dict:
    raw = path.read_text(encoding="utf-8")

    description = ""
    for line in raw.splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            description = stripped.lstrip("#").strip()
            break

    entries = []
    for line in raw.splitlines():
        cleaned = re.sub(r"#.*$", "", line).strip()
        if not cleaned:
            continue
        letter, *fsws = cleaned.split(",")
        signs = []
        for fsw in fsws:
            matches = SYMBOL_RE.findall(fsw)
            if len(matches) == 1:
                signs.append({
                    "fsw": fsw,
                    "single": True,
                    "symbol": fsw_to_swu.key2swu(matches[0]),
                })
            else:
                lane = LANE_RE.search(fsw)
                box = fsw[lane.start():] if lane else fsw
                signs.append({
                    "fsw": fsw,
                    "single": False,
                    "swu": fsw_to_swu.fsw2swu(box),
                })
        entries.append({"letter": letter, "signs": signs})

    return {
        "code": path.stem,
        "label": language_label(path.stem),
        "description": description,
        "entries": entries,
    }


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="lis-fingerspelling-") as tmp:
        work = Path(tmp)
        print(f"→ Cloning {REPO_URL}", file=sys.stderr)
        subprocess.run(
            ["git", "clone", "--depth", "1", "--quiet", REPO_URL, str(work / "signwriting")],
            check=True,
        )

        repo = work / "signwriting"
        fsw_to_swu = import_upstream(repo)
        data_dir = repo / "signwriting" / "fingerspelling" / "data"

        # Sort with the user's locale so labels (used as dropdown ordering keys)
        # collate naturally rather than by raw codepoint.
        try:
            locale.setlocale(locale.LC_COLLATE, "")
        except locale.Error:
            pass

        languages = sorted(
            (parse_file(p, fsw_to_swu) for p in data_dir.glob("*.txt")),
            key=lambda L: locale.strxfrm(L["label"]),
        )

    payload = {
        "generatedFrom": "github.com/sign-language-processing/signwriting",
        "languages": languages,
    }
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"→ Wrote {len(languages)} languages to {OUTPUT_FILE.relative_to(PROJECT_DIR)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
