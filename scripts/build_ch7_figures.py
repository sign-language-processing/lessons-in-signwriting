#!/usr/bin/env python3
"""Chapter 7 (Curved Movement) figure builder.

The chapter is mostly arrow/plane diagrams, rendered as plain decomposed images
straight from the artifacts. Two pages are genuine word-signs: page 131 (Up-Down
Curved Arrows: drive / but / shape,figure / spaghetti) and page 140 (Forward-Back
Curved Arrows: across / grandmother / allow / announce / we / us / workshop /
area). docling bundled each of those pages into a single artifact; this splits
them into per-sign crops (illustration + sign, or sign only) and resolves each
word against whatsthatsign.

Crops go to public/figures/ch7/, clips to public/videos/whatsthatsign/<slug>/,
and the manifest to src/content/ch7-figures.generated.json (spread into figures.ts
for SignFigure). Matches stay PENDING (no confirmed flag) for later review.
"""
import json
import os
import tempfile

import numpy as np
from PIL import Image

from build_contact_figures import (
    artifact_path,
    download_url_and_crop,
    fsw_to_swu,
    load_index,
    trimmed,
)
from download_hand_example_videos import download_and_crop

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch7")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch7-figures.generated.json")

# Page 131 — Up-Down Curved Arrows. Artifact 312 is a 2x2 grid of
# illustration-over-sign-over-word cells; boxes are (x0, y0, x1, y1).
PAGE131 = {
    "img": 312,
    "signs": [
        {"slug": "ch7-drive", "word": "drive", "illustration": (20, 0, 345, 168),
         "sign": (20, 175, 345, 318)},
        {"slug": "ch7-but", "word": "but", "illustration": (460, 0, 760, 168),
         "sign": (460, 175, 760, 318)},
        {"slug": "ch7-shape", "word": "shape, figure", "lookup": "shape",
         "illustration": (20, 500, 345, 700), "sign": (20, 705, 345, 885)},
        {"slug": "ch7-spaghetti", "word": "spaghetti", "illustration": (460, 500, 760, 700),
         "sign": (460, 705, 760, 885)},
    ],
}

# Page 140 — Forward-Back Curved Arrows. Artifact 327 is a 2-column grid with a
# central divider; each cell is a sign next to its blue word label. Crop the sign
# region (word trimmed off) then whitespace-trim.
PAGE140 = {
    "img": 327,
    "rows": [(40, 150), (245, 390), (495, 700), (795, 952)],
    "left_box": lambda y0, y1: (158, y0, 403, y1),
    "right_box": lambda y0, y1: (408, y0, 690, y1),
    "signs": [
        ("ch7-across", "across", "left", 0),
        ("ch7-grandmother", "grandmother", "left", 1),
        ("ch7-allow", "allow", "left", 2),
        ("ch7-announce", "announce", "left", 3),
        ("ch7-we", "we", "right", 0),
        ("ch7-us", "us", "right", 1),
        ("ch7-workshop", "workshop", "right", 2),
        ("ch7-area", "area", "right", 3),
    ],
}


def crop_box(img, box, do_trim=False):
    out = img.crop(box)
    return trimmed(out) if do_trim else out


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    idx = load_index()
    manifest = {}
    fsw_for = {}

    img131 = Image.open(artifact_path(PAGE131["img"])).convert("RGB")
    img140 = Image.open(artifact_path(PAGE140["img"])).convert("RGB")

    specs = []
    for s in PAGE131["signs"]:
        specs.append({
            "slug": s["slug"], "word": s["word"], "lookup": s.get("lookup"),
            "illustration": crop_box(img131, s["illustration"]),
            "sign": crop_box(img131, s["sign"]),
        })
    for slug, word, side, ri in PAGE140["signs"]:
        y0, y1 = PAGE140["rows"][ri]
        box = (PAGE140["left_box"](y0, y1) if side == "left"
               else PAGE140["right_box"](y0, y1))
        specs.append({
            "slug": slug, "word": word, "lookup": None,
            "illustration": None, "sign": crop_box(img140, box, do_trim=True),
        })

    with tempfile.TemporaryDirectory() as raw:
        for spec in specs:
            slug = spec["slug"]
            entry = {"word": spec["word"]}
            if spec["illustration"] is not None:
                out = f"{slug}-illustration.png"
                spec["illustration"].save(os.path.join(OUT_DIR, out))
                entry["illustration"] = f"/figures/ch7/{out}"
            out = f"{slug}-sign.png"
            spec["sign"].save(os.path.join(OUT_DIR, out))
            entry["sign"] = f"/figures/ch7/{out}"

            lookup = (spec["lookup"] or spec["word"]).strip().lower()
            match = idx.get(lookup, [None])[0]
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
    print(f"Wrote {len(manifest)} figures ({found} matched) -> {os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for slug, v in manifest.items():
        print(f"  {slug:18s} illus={'y' if 'illustration' in v else '-'} "
              f"swu={'y' if 'swu' in v else '-'} video={'y' if 'video' in v else '-'}")


if __name__ == "__main__":
    main()
