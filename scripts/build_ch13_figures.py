#!/usr/bin/env python3
"""Build chapter 13 (Dynamics) figures.

The Dynamics chapter (book pp.181-187 / PDF pp.187-193) is a diagram chapter:
the five Dynamics-Symbol category rows, the Movement-Dynamics symbol list, the
"bed" classifier shown in three placements, and the Unit-Connecting-Line column.
docling extracted the per-page composites; this script decomposes them into the
individual figures the page needs and renders the symbol rows / movement symbols
straight from the source PDF (cleaner than the fragmentary docling crops).

Only one figure is a SignWriting sign for a word: the "bed" classifier. It is
recorded as a whatsthatsign candidate (matched, left PENDING for confirmation).

Outputs crops to public/figures/ch13/ and the manifest to
src/content/ch13-figures.generated.json (merged into figures.ts for SignFigure).
"""
import json
import os
import subprocess
import tempfile

import numpy as np
from PIL import Image

from build_contact_figures import artifact_path, fsw_to_swu, load_index
from download_hand_example_videos import download_and_crop

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch13")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch13-figures.generated.json")
RENDER_DIR = "/tmp/ch13_render"
DPI = 200

# PDF page (1-indexed) for each book page used here.
PAGE_SYMBOLS = 188      # "Dynamics Symbols" (5 category rows)
PAGE_MOVEMENT = 189     # "Movement Dynamics" (symbol list)
PAGE_HANDSHAPE = 190    # "Handshape Dynamics" (Goldilocks classifier sentence)

# Right-hand SignWriting sentence on PAGE_HANDSHAPE (the prose on the left is
# transcribed in the component, so only the sign column is cropped).
HANDSHAPE_SEQUENCE_BOX = (850, 180, 1340, 1820)

# Category symbol-row boxes on PAGE_SYMBOLS at 200 DPI (x0, y0, x1, y1), trimmed.
# The unit example sits to the right of its paragraph, so it is cropped by x too.
SYMBOL_ROWS = {
    "ch13-cat-movement": (100, 450, 1650, 580),
    "ch13-cat-handshape": (100, 730, 1650, 845),
    "ch13-cat-facial": (100, 1045, 1650, 1155),
    "ch13-cat-punctuation": (100, 1330, 1650, 1405),
    "ch13-cat-unit": (980, 1470, 1650, 1830),
}

# Movement-Dynamics symbols on PAGE_MOVEMENT at 200 DPI: (y0, y1) of the symbol,
# cropped from the left symbol column (x < 560).
MOVEMENT_SYMBOLS = [
    ("ch13-move-simultaneous", 300, 360),
    ("ch13-move-alternating", 405, 470),
    ("ch13-move-uneven", 555, 600),
    ("ch13-move-slow", 760, 815),
    ("ch13-move-smooth", 890, 945),
    ("ch13-move-fast", 1035, 1075),
    ("ch13-move-fast-emphasis", 1145, 1210),
    ("ch13-move-tense", 1305, 1345),
    ("ch13-move-tense-emphasis", 1420, 1470),
    ("ch13-move-relaxed", 1560, 1605),
    ("ch13-move-relaxed-emphasis", 1670, 1740),
]

# Three "bed" classifier placements bundled in image_000495 (x clusters).
BED_FIGURE = 495
BED_COLUMNS = {
    "ch13-bed-left": (0, 130),
    "ch13-bed-center": (255, 380),
    "ch13-bed-right": (495, 629),
}


def render_page(num):
    os.makedirs(RENDER_DIR, exist_ok=True)
    out = os.path.join(RENDER_DIR, f"p-{num}")
    subprocess.run(
        ["pdftoppm", "-f", str(num), "-l", str(num), "-r", str(DPI), "-png", PDF, out],
        check=False,
    )
    return Image.open(f"{out}-{num}.png").convert("RGB")


def ink_mask(img):
    a = np.asarray(img)
    return np.minimum(np.minimum(a[..., 0], a[..., 1]), a[..., 2]) < 200


def trim(img, axis="both"):
    mask = ink_mask(img)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return img
    x0, x1 = (xs.min(), xs.max() + 1) if axis in ("both", "x") else (0, img.width)
    y0, y1 = (ys.min(), ys.max() + 1) if axis in ("both", "y") else (0, img.height)
    return img.crop((x0, y0, x1, y1))


# The diagram crops are referenced by path from the chapter component, so they
# are written to disk but kept OUT of the manifest (which only carries the
# SignFigure-consumable "bed" entry; figures.ts types every value as a sign).


def crop_symbol_rows():
    page = render_page(PAGE_SYMBOLS)
    for slug, box in SYMBOL_ROWS.items():
        trim(page.crop(box)).save(os.path.join(OUT_DIR, f"{slug}.png"))


def crop_movement_symbols():
    page = render_page(PAGE_MOVEMENT)
    for slug, y0, y1 in MOVEMENT_SYMBOLS:
        trim(page.crop((300, y0, 560, y1))).save(os.path.join(OUT_DIR, f"{slug}.png"))


def split_bed():
    img = Image.open(artifact_path(BED_FIGURE)).convert("RGB")
    for slug, (x0, x1) in BED_COLUMNS.items():
        crop = trim(img.crop((x0, 0, x1, img.height)), axis="x")
        crop.save(os.path.join(OUT_DIR, f"{slug}.png"))
    # The center placement, with no extra annotation, is the "bed" classifier
    # sign used for the whatsthatsign candidate.
    center = trim(img.crop((BED_COLUMNS["ch13-bed-center"][0], 0,
                            BED_COLUMNS["ch13-bed-center"][1], img.height)))
    center.save(os.path.join(OUT_DIR, "ch13-bed-sign.png"))


def crop_handshape_sequence():
    page = render_page(PAGE_HANDSHAPE)
    trim(page.crop(HANDSHAPE_SEQUENCE_BOX)).save(
        os.path.join(OUT_DIR, "ch13-handshape-sequence.png"))


def copy_artifact(slug, num):
    trim(Image.open(artifact_path(num)).convert("RGB")).save(
        os.path.join(OUT_DIR, f"{slug}.png"))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    idx = load_index()
    manifest = {}

    crop_symbol_rows()
    crop_movement_symbols()
    crop_handshape_sequence()
    split_bed()
    copy_artifact("ch13-unit-column", 496)
    copy_artifact("ch13-classroom-photo", 497)

    bed = {"word": "bed", "sign": "/figures/ch13/ch13-bed-sign.png"}
    match = idx.get("bed", [None])[0]
    fsw_for = {}
    with tempfile.TemporaryDirectory() as raw:
        if match:
            fsw_for["ch13-bed"] = match["fsw"]
            bed["video"] = download_and_crop(match["file"], "ch13-bed", raw)
    manifest["ch13-bed"] = bed

    swu = fsw_to_swu(list(fsw_for.values()))
    for slug, value in zip(fsw_for, swu):
        manifest[slug]["swu"] = value

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    diagrams = len([f for f in os.listdir(OUT_DIR) if f.endswith(".png")])
    matched = sum("swu" in v for v in manifest.values())
    print(f"Wrote {diagrams} crops to {os.path.relpath(OUT_DIR, PROJECT_DIR)}; "
          f"{len(manifest)} manifest entr{'y' if len(manifest) == 1 else 'ies'} "
          f"({matched} matched) -> {os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for slug, v in manifest.items():
        print(f"  {slug:30s} swu={'y' if 'swu' in v else '-'} "
              f"video={'y' if 'video' in v else '-'}")


if __name__ == "__main__":
    main()
