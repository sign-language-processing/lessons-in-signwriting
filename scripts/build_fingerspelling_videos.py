#!/usr/bin/env python3
"""Attach whatsthatsign clips to individual fingerspelling signs.

A few ASL fingerspelling signs are drawn with motion (J, Z) or a path (@), so a
static SignWriting glyph is ambiguous — a short clip disambiguates. This maps the
sign's SWU (as it appears in fingerspelling.generated.json) to a downloaded,
center-cropped whatsthatsign clip and writes
src/content/fingerspelling-videos.generated.json, which Fingerspelling overlays
as the hover video. The upstream-generated fingerspelling JSON is left untouched.

Each SPEC item names the language + letter + sign index (to read the exact SWU
from the data — a letter may have several sign variants) and the whatsthatsign
gloss to fetch. Signs sharing that SWU in other languages inherit the clip
automatically, since the overlay is keyed by SWU.
"""
import csv
import json
import os
import tempfile

from download_hand_example_videos import download_and_crop

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
CSV_PATH = os.path.join(HERE, "whatsthatsign_index.csv")
FINGERSPELLING = os.path.join(PROJECT_DIR, "src", "content", "fingerspelling.generated.json")
OUT_PATH = os.path.join(PROJECT_DIR, "src", "content", "fingerspelling-videos.generated.json")

SPEC = [
    {"lang": "en-us-ase-asl", "letter": "@", "sign_index": 2, "gloss": "@", "slug": "fs-asl-at"},
    {"lang": "en-us-ase-asl", "letter": "Z", "sign_index": 0, "gloss": "z", "slug": "fs-asl-z"},
    {"lang": "en-us-ase-asl", "letter": "J", "sign_index": 0, "gloss": "j", "slug": "fs-asl-j"},
]


def swu_for(data, lang_code, letter, sign_index):
    lang = next(l for l in data["languages"] if l["code"] == lang_code)
    entry = next(e for e in lang["entries"] if e["letter"] == letter)
    sign = entry["signs"][sign_index]
    assert not sign["single"], f"{letter}[{sign_index}] is a single symbol, not a sign"
    return sign["swu"]


def file_for(gloss):
    with open(CSV_PATH, newline="") as f:
        for row in csv.DictReader(f):
            ex = json.loads(row["extra"]) if row["extra"] else {}
            if not ex.get("sign_fsw"):
                continue
            if gloss in [s.strip().lower() for s in row["text"].split(",")]:
                return row["file"]
    raise LookupError(f"no whatsthatsign entry for gloss {gloss!r}")


def main():
    data = json.load(open(FINGERSPELLING))
    videos = {}
    with tempfile.TemporaryDirectory() as raw:
        for item in SPEC:
            swu = swu_for(data, item["lang"], item["letter"], item["sign_index"])
            videos[swu] = download_and_crop(file_for(item["gloss"]), item["slug"], raw)
            print(f"  {item['letter']:2s} ({item['gloss']}) -> {videos[swu]}")

    with open(OUT_PATH, "w") as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Wrote {len(videos)} fingerspelling videos -> {os.path.relpath(OUT_PATH, PROJECT_DIR)}")


if __name__ == "__main__":
    main()
