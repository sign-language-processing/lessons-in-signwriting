#!/usr/bin/env python3
"""Build chapter 14 (Punctuation) figures.

The chapter is mostly punctuation-symbol glyphs and whole-sentence SignWriting
diagrams (the latter with red/blue annotations baked into the artifact). docling
only extracted three of the six page-188 punctuation glyphs and bundled the
sentence examples as single composites, so this:

  * crops the six punctuation glyphs straight from the rendered book page (188),
  * trims the Dynamics chart and the three sentence-example composites,
  * looks the two genuine word-signs in the "Where is the house?" example
    (where, house) up in whatsthatsign and records them as pending candidates.

Crops go to public/figures/ch14/, clips to public/videos/whatsthatsign/<slug>/,
and the manifest to src/content/ch14-figures.generated.json (merged into
figures.ts for SignFigure).
"""
import json
import os
import subprocess
import tempfile

from PIL import Image

from build_contact_figures import (
    artifact_path,
    download_and_crop,
    fsw_to_swu,
    load_index,
    trimmed,
    union,
)
from split_figures import segment

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch14")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch14-figures.generated.json")

SYMBOL_PAGE = 194
SYMBOL_DPI = 200
SYMBOL_CROP = (200, 250, 480, 2000)
SYMBOL_PAD = 12

# Punctuation glyphs on book page 188, by segmented row(s) of SYMBOL_CROP.
SYMBOLS = [
    {"slug": "ch14-pause", "rows": [0]},
    {"slug": "ch14-end-of-sentence", "rows": [1]},
    {"slug": "ch14-pause-before-end-of-phrase", "rows": [2]},
    {"slug": "ch14-questioning-pause", "rows": [3, 4]},
    {"slug": "ch14-pause-before-listing", "rows": [5, 6]},
    {"slug": "ch14-pause-sub-phrase", "rows": [7, 8]},
]

# Whole-composite diagrams: trim the artifact and render as a plain image.
DIAGRAMS = [
    {"slug": "ch14-dynamics-chart", "img": 502},
    {"slug": "ch14-asl-perspective", "img": 503},
    {"slug": "ch14-where-house", "img": 504},
    {"slug": "ch14-goldilocks", "img": 505},
]

# Genuine word-signs embedded in the "Where is the house?" composite (504).
# Recorded as pending candidates; the composite itself is rendered as an image.
WORD_LOOKUPS = [
    {"slug": "ch14-word-where", "word": "where"},
    {"slug": "ch14-word-house", "word": "house"},
]


def render_page(num, dpi):
    with tempfile.TemporaryDirectory() as tmp:
        stem = os.path.join(tmp, "page")
        subprocess.run(
            ["pdftoppm", "-f", str(num), "-l", str(num), "-r", str(dpi), "-png", PDF, stem],
            check=True, capture_output=True,
        )
        out = f"{stem}-{num:03d}.png"
        if not os.path.exists(out):
            out = f"{stem}-{num}.png"
        return Image.open(out).convert("RGB")


def build_symbols():
    page = render_page(SYMBOL_PAGE, SYMBOL_DPI)
    col = page.crop(SYMBOL_CROP)
    with tempfile.TemporaryDirectory() as cells_dir:
        cells = {c["row"]: c["box"] for c in segment_col(col, cells_dir)}
    cw, ch = col.size
    for spec in SYMBOLS:
        box = union([cells[r] for r in spec["rows"]])
        x0 = max(0, box[0] - SYMBOL_PAD)
        y0 = max(0, box[1] - SYMBOL_PAD)
        x1 = min(cw, box[2] + SYMBOL_PAD)
        y1 = min(ch, box[3] + SYMBOL_PAD)
        out = f"{spec['slug']}.png"
        col.crop((x0, y0, x1, y1)).save(os.path.join(OUT_DIR, out))


def segment_col(col, cells_dir):
    tmp = os.path.join(cells_dir, "col.png")
    col.save(tmp)
    return segment(tmp, cells_dir)


def build_diagrams():
    for spec in DIAGRAMS:
        img = trimmed(Image.open(artifact_path(spec["img"])).convert("RGB"))
        out = f"{spec['slug']}.png"
        img.save(os.path.join(OUT_DIR, out))


def build_word_candidates(manifest, candidates_out):
    idx = load_index()
    fsw_for = {}
    with tempfile.TemporaryDirectory() as raw:
        for spec in WORD_LOOKUPS:
            matches = idx.get(spec["word"].lower(), [])
            match = matches[0] if matches else None
            entry = {"word": spec["word"]}
            if match:
                fsw_for[spec["slug"]] = match["fsw"]
                entry["video"] = download_and_crop(match["file"], spec["slug"], raw)
                candidates_out.append(
                    {"slug": spec["slug"], "word": spec["word"], "matched": True,
                     "note": "embedded in ch14-where-house composite; pending"}
                )
            else:
                candidates_out.append(
                    {"slug": spec["slug"], "word": spec["word"], "matched": False,
                     "note": "no whatsthatsign entry"}
                )
            manifest[spec["slug"]] = entry
        swu = fsw_to_swu(list(fsw_for.values()))
        for slug, value in zip(fsw_for, swu):
            manifest[slug]["swu"] = value


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = {}
    candidates = []
    build_symbols()
    build_diagrams()
    build_word_candidates(manifest, candidates)

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {len(manifest)} manifest entries -> {os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for slug, v in manifest.items():
        print(f"  {slug:20s} word={v.get('word'):8s} "
              f"swu={'y' if 'swu' in v else '-'} video={'y' if 'video' in v else '-'}")


if __name__ == "__main__":
    main()
