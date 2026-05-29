#!/usr/bin/env python3
"""Decompose chapter 15 (Writing Signs & Sign Literature) artifacts and resolve
word-signs against whatsthatsign.

This chapter is mostly arrow/plane diagrams (a Movement Wheel, the eight
directions, the curve and rotation charts) plus a handful of genuine
SignWriting word-signs used as examples (MEET, SEE, CURTAINS, YOU on the
"Every Sign Has A Center" page; "Help All Of You" on the curve page;
really/not/good on the exception page).

docling bundled several distinct figures into one PNG:
  - 511 packs the Correct and Incorrect comparison boxes side by side.
  - 513 / 514 pack two word-sign example boxes (sign + caption) side by side.
  - 522 packs the whole curve-arrow chart and the "Help All Of You" sign.
  - 525 packs three exception signs (really / not / good).
  - 526 packs the three "without the Facial Circle" rewrites.

DIAGRAM specs are plain crops (illustration only); SIGN specs additionally look
up the book word in whatsthatsign and attach a matched (PENDING) live sign + clip.
"""
import csv
import glob
import json
import os
import tempfile

from PIL import Image

from build_contact_figures import (
    artifact_path,
    download_url_and_crop,
    fsw_to_swu,
    load_index,
    trimmed,
    union,
)
from download_hand_example_videos import download_and_crop
from split_figures import segment

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch15")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch15-figures.generated.json")
CELLS_DIR = "/tmp/ch15_cells"

# Plain decomposed diagram crops: explicit boxes are used where the green box
# borders fuse the cells the whitespace segmenter would otherwise split.
DIAGRAMS = [
    {"slug": "ch15-correct", "img": 511, "box": (0, 0, 201, 165)},
    {"slug": "ch15-incorrect", "img": 511, "box": (201, 0, 402, 165)},
    {"slug": "ch15-correct-grid", "img": 512},
    {"slug": "ch15-movement-wheel-intro", "img": 515},
    {"slug": "ch15-step-contact", "img": 516},
    {"slug": "ch15-step-wheel", "img": 517},
    {"slug": "ch15-up", "img": 518},
    {"slug": "ch15-forward", "img": 519},
    {"slug": "ch15-forward-diagonal", "img": 520},
    {"slug": "ch15-back", "img": 521},
    {"slug": "ch15-curve-chart", "img": 522, "box": (0, 0, 366, 360)},
    {"slug": "ch15-rotation", "img": 523},
    {"slug": "ch15-rotation-placement", "img": 524},
    {"slug": "ch15-exception-without-circle", "img": 526},
]

# Word-sign examples: the sign crop is the book raster; the matched whatsthatsign
# entry stays PENDING (no `confirmed`) for the user to approve later.
SIGNS = [
    {"slug": "ch15-meet", "img": 513, "box": (8, 6, 196, 80), "word": "meet"},
    {"slug": "ch15-see", "img": 513, "box": (205, 6, 396, 80), "word": "see"},
    {"slug": "ch15-curtains", "img": 514, "box": (8, 6, 196, 72), "word": "curtains"},
    {"slug": "ch15-you", "img": 514, "box": (205, 6, 396, 72), "word": "you", "candidate": 2},
    {"slug": "ch15-help", "img": 522, "box": (110, 855, 260, 968), "word": "help all of you", "lookup": "help"},
    {"slug": "ch15-really", "img": 525, "box": (0, 4, 130, 150), "word": "really", "lookup": "real"},
    {"slug": "ch15-not", "img": 525, "box": (200, 0, 320, 150), "word": "not"},
    {"slug": "ch15-good", "img": 525, "box": (410, 0, 543, 150), "word": "good"},
]


def crop_box(num, box):
    img = Image.open(artifact_path(num)).convert("RGB")
    return trimmed(img.crop(box)) if box else trimmed(img)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    idx = load_index()
    manifest = {}
    fsw_for = {}

    for fig in DIAGRAMS:
        slug = fig["slug"]
        out = f"{slug}.png"
        crop_box(fig["img"], fig.get("box")).save(os.path.join(OUT_DIR, out))
        manifest[slug] = {"illustration": f"/figures/ch15/{out}"}

    with tempfile.TemporaryDirectory() as raw:
        for fig in SIGNS:
            slug = fig["slug"]
            out = f"{slug}-sign.png"
            crop_box(fig["img"], fig.get("box")).save(os.path.join(OUT_DIR, out))
            entry = {"word": fig["word"], "sign": f"/figures/ch15/{out}"}

            candidates = idx.get((fig.get("lookup") or fig["word"]).strip().lower(), [])
            ci = fig.get("candidate", 0)
            match = candidates[ci] if ci < len(candidates) else None
            if match:
                fsw_for[slug] = match["fsw"]
                entry["video"] = download_and_crop(match["file"], slug, raw)
            manifest[slug] = entry

    swu = fsw_to_swu(list(fsw_for.values()))
    for slug, value in zip(fsw_for, swu):
        manifest[slug]["swu"] = value

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    matched = sum("swu" in v for v in manifest.values())
    print(f"Wrote {len(manifest)} figures ({matched} matched) -> {os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for slug, v in manifest.items():
        kind = "sign" if "sign" in v else "diagram"
        print(f"  {slug:32s} {kind:7s} "
              f"swu={'y' if 'swu' in v else '-'} video={'y' if 'video' in v else '-'}")


if __name__ == "__main__":
    main()
