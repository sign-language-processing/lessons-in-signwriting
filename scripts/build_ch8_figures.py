#!/usr/bin/env python3
"""Decompose chapter 8 (Axial Movement) artifacts and resolve word-signs.

Chapter 8 is mostly arrow/plane rotation DIAGRAMS plus a handful of labeled
SignWriting word examples. docling extracted most diagrams as clean individual
PNGs, but bundled two full pages (img 354, 355) as single composites and packed
the whole wrist-flexing page (img 379) into one artifact mixing five examples
with two-column text. This script:

  * trims every diagram artifact into public/figures/ch8/ for plain rendering;
  * crops the labeled word-sign examples (stripping any baked-in blue label),
    looks each word up in whatsthatsign, and writes a PENDING manifest entry
    (swu + clip) so the user can confirm later.

Manifest -> src/content/ch8-figures.generated.json (merged into figures.ts).
"""
import glob
import json
import os
import tempfile

import numpy as np
from PIL import Image

from build_contact_figures import (
    artifact_path,
    download_and_crop,
    fsw_to_swu,
    load_index,
)

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch8")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch8-figures.generated.json")

# Plain diagram artifacts: trimmed and copied as ch8-<name>.png for the page.
DIAGRAMS = {
    "forearm-up-baby": 330,
    "forearm-up-thumb": 331,
    "forearm-up-rose": 332,
    "forearm-up-baby-2": 333,
    "forearm-up-thumb-2": 334,
    "forearm-forward-thumb": 335,
    "forearm-forward-rose": 336,
    "forearm-forward-baby": 337,
    "forearm-forward-baby-2": 338,
    "forearm-forward-thumb-2": 339,
    "forearm-side-1": 346,
    "forearm-side-2": 347,
    "forearm-side-3": 348,
    "forearm-side-4": 349,
    "forearm-side-5": 351,
    "shaking-chart": 378,
    "blue-comparison-books": 370,
    "books-detail": 371,
}

# Traveling-rotation chart signs (wall plane left, floor plane right).
TRAVELING = {
    "wall-plane-twist": 372,
    "wall-plane-twist-twist": 373,
    "wall-plane-twist-shake": 374,
    "floor-plane-twist": 375,
    "floor-plane-twist-twist": 376,
    "floor-plane-twist-shake": 377,
}

# Word-sign examples cropped from a single artifact (whole artifact, blue label
# stripped). word = caption + whatsthatsign lookup.
SIGN_SPECS = [
    {"slug": "ch8-class", "img": 340, "word": "class"},
    {"slug": "ch8-finish", "img": 341, "word": "finish"},
    {"slug": "ch8-close", "img": 342, "word": "close"},
    {"slug": "ch8-happen", "img": 343, "word": "happen"},
    {"slug": "ch8-dead", "img": 344, "word": "dead"},
    {"slug": "ch8-break", "img": 345, "word": "break"},
    {"slug": "ch8-third", "img": 350, "word": "third"},
    {"slug": "ch8-apple", "img": 352, "word": "apple"},
    {"slug": "ch8-begin", "img": 353, "word": "begin"},
    {"slug": "ch8-blue", "img": 368, "word": "blue"},
]

# Word-sign examples cropped by an explicit box from a page composite (379).
SIGN_BOXES = [
    {"slug": "ch8-yes-yes", "img": 379, "box": (140, 0, 215, 92), "word": "yes-yes",
     "lookup": "yes"},
    {"slug": "ch8-flag", "img": 379, "box": (105, 205, 255, 372), "word": "flag"},
    {"slug": "ch8-chat", "img": 379, "box": (0, 498, 255, 622), "word": "chat"},
    {"slug": "ch8-before", "img": 379, "box": (268, 525, 412, 625), "word": "before"},
    {"slug": "ch8-basketball", "img": 379, "box": (505, 448, 684, 645),
     "word": "basketball"},
    {"slug": "ch8-aerobics", "img": 354, "box": (25, 795, 185, 965), "word": "aerobics"},
    {"slug": "ch8-baptism", "img": 354, "box": (265, 765, 435, 965), "word": "baptism"},
    {"slug": "ch8-broom", "img": 354, "box": (515, 785, 715, 975), "word": "broom"},
    {"slug": "ch8-bald", "img": 355, "box": (295, 815, 445, 1005), "word": "bald"},
    {"slug": "ch8-weight", "img": 355, "box": (525, 815, 705, 1015), "word": "weight"},
]


def strip_blue(img):
    arr = np.asarray(img.convert("RGB")).astype(int)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    blue = (b - np.maximum(r, g) > 40) & (b > 100)
    out = np.asarray(img.convert("RGB")).copy()
    out[blue] = 255
    return Image.fromarray(out)


def trim_white(img):
    arr = np.asarray(img.convert("RGB"))
    ink = np.minimum(np.minimum(arr[..., 0], arr[..., 1]), arr[..., 2]) < 200
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return img
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def save_plain(slug, num):
    img = trim_white(Image.open(artifact_path(num)))
    out = f"{slug}.png"
    img.save(os.path.join(OUT_DIR, out))
    return f"/figures/ch8/{out}"


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    idx = load_index()
    manifest = {}
    fsw_for = {}

    diagram_manifest = {}
    for slug, num in {**DIAGRAMS, **TRAVELING}.items():
        diagram_manifest[slug] = save_plain(slug, num)

    with open(os.path.join(OUT_DIR, "diagrams.json"), "w") as f:
        json.dump(diagram_manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    with tempfile.TemporaryDirectory() as raw:
        for spec in SIGN_SPECS:
            slug = spec["slug"]
            img = trim_white(strip_blue(Image.open(artifact_path(spec["img"]))))
            out = f"{slug}-sign.png"
            img.save(os.path.join(OUT_DIR, out))
            entry = {"word": spec["word"], "sign": f"/figures/ch8/{out}"}

            candidates = idx.get((spec.get("lookup") or spec["word"]).lower(), [])
            match = candidates[0] if candidates else None
            if match:
                fsw_for[slug] = match["fsw"]
                entry["video"] = download_and_crop(match["file"], slug, raw)
            manifest[slug] = entry

        for spec in SIGN_BOXES:
            slug = spec["slug"]
            src = Image.open(artifact_path(spec["img"])).convert("RGB")
            img = trim_white(strip_blue(src.crop(spec["box"])))
            out = f"{slug}-sign.png"
            img.save(os.path.join(OUT_DIR, out))
            entry = {"word": spec["word"], "sign": f"/figures/ch8/{out}"}

            candidates = idx.get((spec.get("lookup") or spec["word"]).lower(), [])
            match = candidates[0] if candidates else None
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

    found = sum("swu" in v for v in manifest.values())
    print(f"Wrote {len(manifest)} sign figures ({found} matched) -> "
          f"{os.path.relpath(MANIFEST, PROJECT_DIR)}")
    print(f"Wrote {len(diagram_manifest)} diagram crops -> public/figures/ch8/")
    for slug, v in manifest.items():
        print(f"  {slug:20s} swu={'y' if 'swu' in v else '-'} "
              f"video={'y' if 'video' in v else '-'}  {v['word']}")


if __name__ == "__main__":
    main()
