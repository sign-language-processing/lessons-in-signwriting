#!/usr/bin/env python3
"""Build chapter 11 (Head) figures.

The Head chapter (PDF pages 176-182, book pages 170-176) is entirely reference
charts: head-viewpoint diagrams, rim-of-head symbol tables, head-movement arrow
grids, and the face-direction position lines. There are no SignWriting word-signs
to resolve against whatsthatsign, so every figure is a plain decomposed image.

docling's artifacts for this chapter are incomplete and mis-numbered (page 177 has
no artifact; image_000471 is actually a photo from a later lesson). To recreate the
chapter faithfully we render the source PDF pages at high DPI and crop the diagram
body of each page (below the heading text, above the footer page number), tight to
the ink. Headings and prose are transcribed as text in the component.

Crops go to public/figures/ch11/ and the manifest to
src/content/ch11-figures.generated.json (merged into figures.ts).
"""
import json
import os
import subprocess
import tempfile

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch11")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch11-figures.generated.json")
DPI = 200
PAD = 12

# (slug, pdf_page, body_y_top, body_y_bottom): the diagram body band, excluding the
# blue/red heading text at the top and the footer page number near y~2030.
SPEC = [
    ("ch11-viewpoints", 176, 390, 1700),
    ("ch11-rim-face", 177, 560, 1620),
    ("ch11-rim-top-side", 178, 440, 1830),
    ("ch11-rim-relating-touching", 179, 560, 1730),
    ("ch11-face-direction-movement", 180, 430, 1710),
    ("ch11-head-direction-movement", 181, 440, 1720),
    ("ch11-face-direction-lines", 182, 440, 1790),
]


def render_page(page, raw):
    stem = os.path.join(raw, f"p-{page}")
    subprocess.run(
        ["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(DPI), "-png", PDF, stem],
        check=True,
    )
    return Image.open(f"{stem}-{page}.png").convert("RGB")


def tight_box(arr, y0, y1, width, height):
    sub = arr[y0:y1]
    mask = (sub < 240).any(axis=2)
    ys, xs = np.where(mask)
    return (
        max(0, int(xs.min()) - PAD),
        max(0, int(ys.min()) + y0 - PAD),
        min(width, int(xs.max()) + 1 + PAD),
        min(height, int(ys.max()) + 1 + y0 + PAD),
    )


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = {}
    with tempfile.TemporaryDirectory() as raw:
        for slug, page, y0, y1 in SPEC:
            im = render_page(page, raw)
            box = tight_box(np.asarray(im), y0, y1, im.width, im.height)
            out = f"{slug}.png"
            im.crop(box).save(os.path.join(OUT_DIR, out))
            manifest[slug] = {"image": f"/figures/ch11/{out}"}

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {len(manifest)} figures -> {os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for slug, v in manifest.items():
        print(f"  {slug:34s} {v['image']}")


if __name__ == "__main__":
    main()
