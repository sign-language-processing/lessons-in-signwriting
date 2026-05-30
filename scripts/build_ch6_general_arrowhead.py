#!/usr/bin/env python3
"""Add the General Arrowhead examples from PDF page 123 to chapter 6.

Page 123's lower half (under "General Arrowhead Writes Overlapping Paths") holds
worked examples of the General Arrowhead. The base build_ch6_figures.py is not
re-runnable without regressing hand-curated fields (illustrations, confirmed
flags, chosen candidates), so this script crops just these figures and MERGES
them into the existing manifest, preserving any existing `confirmed` flag.

Boxes are in 200-DPI page coordinates (the render is 1700x2200); `trimmed`
tightens each to its ink. Word figures resolve against whatsthatsign.
"""
import json
import os
import tempfile

from PIL import Image

from build_contact_figures import fsw_to_swu, load_index, trimmed
from download_hand_example_videos import download_and_crop

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch6")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch6-figures.generated.json")
RENDER = "/tmp/p123/hi-123.png"

# Word examples: sign-only crop (the red word label is excluded — SignFigure
# renders the word as a caption). `lookup` overrides the whatsthatsign query.
WORDS = [
    {"slug": "ch6-follow", "word": "follow", "box": (565, 1010, 800, 1320)},
    {"slug": "ch6-plan", "word": "plan", "box": (575, 1490, 875, 1700)},
]


def crop(im, box):
    return trimmed(im.crop(box))


def main():
    im = Image.open(RENDER).convert("RGB")
    idx = load_index()

    with open(MANIFEST, encoding="utf-8") as f:
        manifest = json.load(f)

    fsw_for = {}
    with tempfile.TemporaryDirectory() as raw:
        for fig in WORDS:
            slug = fig["slug"]
            out = f"{slug}-sign.png"
            crop(im, fig["box"]).save(os.path.join(OUT_DIR, out))
            entry = {"word": fig["word"], "sign": f"/figures/ch6/{out}"}
            candidates = idx.get((fig.get("lookup") or fig["word"]).strip().lower(), [])
            match = candidates[0] if candidates else None
            if match:
                fsw_for[slug] = match["fsw"]
                entry["video"] = download_and_crop(match["file"], slug, raw)
            if manifest.get(slug, {}).get("confirmed"):
                entry["confirmed"] = True
            manifest[slug] = entry

    swu = fsw_to_swu(list(fsw_for.values()))
    for slug, value in zip(fsw_for, swu):
        manifest[slug]["swu"] = value

    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Merged {len(WORDS)} word figures into "
          f"{os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for fig in WORDS:
        v = manifest[fig["slug"]]
        print(f"  {fig['slug']:20s} swu={'y' if 'swu' in v else '-'} "
              f"video={'y' if 'video' in v else '-'}")


if __name__ == "__main__":
    main()
