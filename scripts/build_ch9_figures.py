#!/usr/bin/env python3
"""Build chapter 9 (Circular Movement) figures.

This chapter is almost entirely arrow/circle DIAGRAMS arranged as numbered
lists: each item is a black SignWriting movement symbol beside a blue text
label. docling extracted the page-152 set as one giant composite and the rest
as tiny, hard-to-map per-symbol PNGs, so instead of trusting those we crop the
symbols straight from high-resolution renders of the source PDF pages.

For each symbol GRID we locate the rows of black ink inside a half-page column
band and tightly crop each symbol; output goes to public/figures/ch9/. The few
genuine word-signs (ideas/international/inferior, who/hearing person/beautiful,
and the page-156 examples) are cropped the same way and, when the word exists in
whatsthatsign, matched (swu + clip) and left PENDING for later confirmation.
"""
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from build_contact_figures import (  # noqa: E402
    download_url_and_crop,
    fsw_to_swu,
    load_index,
)
from download_hand_example_videos import download_and_crop  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch9")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch9-figures.generated.json")
RENDER_DIR = "/tmp/ch9_render"
DPI = 200
PAD = 6

# Page midline (200-DPI pixels): symbols of the left section sit left of it,
# the right section's symbols to its right.
MIDLINE = 720


def render(page):
    import glob
    os.makedirs(RENDER_DIR, exist_ok=True)
    stem = os.path.join(RENDER_DIR, f"p{page}")
    existing = glob.glob(f"{stem}-*.png")
    if not existing:
        subprocess.run(
            ["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(DPI),
             "-png", PDF, stem],
            check=True, capture_output=True,
        )
        existing = glob.glob(f"{stem}-*.png")
    return existing[0]


def black_mask(arr):
    r, g, b = arr[..., 0].astype(int), arr[..., 1].astype(int), arr[..., 2].astype(int)
    ink = np.minimum(np.minimum(r, g), b) < 160
    blue = (b - np.maximum(r, g) > 40) & (b > 100)
    red = (r - np.maximum(g, b) > 40) & (r > 100)
    return ink & ~blue & ~red


def y_spans(prof, gap):
    spans, start, gl = [], None, 0
    for i, on in enumerate(prof):
        if on:
            start = i if start is None else start
            gl = 0
        else:
            if start is not None:
                gl += 1
                if gl >= gap:
                    spans.append((start, i - gl + 1))
                    start = None
    if start is not None:
        spans.append((start, len(prof)))
    return spans


def symbol_xband(mask, x_lo, x_hi, y0, y1):
    """The first contiguous black-ink x-cluster in [x_lo, x_hi) — the symbol."""
    col = mask[y0:y1, x_lo:x_hi].sum(axis=0)
    on = col > 1
    spans = []
    s = None
    for i, v in enumerate(on):
        if v:
            s = i if s is None else s
        elif s is not None:
            spans.append((s, i))
            s = None
    if s is not None:
        spans.append((s, len(on)))
    spans = [(a, b) for a, b in spans if b - a > 8]
    if not spans:
        raise RuntimeError(f"no symbol x-cluster in [{x_lo},{x_hi}) y[{y0},{y1})")
    a, b = spans[0]
    return x_lo + a, x_lo + b


def tight_box(mask, x0, x1, y0, y1):
    sub = mask[y0:y1, x0:x1]
    ys, xs = np.where(sub)
    if len(xs) == 0:
        return None
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1)


def crop_pad(img, box, w, h):
    x0, y0, x1, y1 = box
    return img.crop((max(0, x0 - PAD), max(0, y0 - PAD),
                     min(w, x1 + PAD), min(h, y1 + PAD)))


def grid_symbols(page, side, count, slug_prefix, y_top, y_bot):
    """Crop `count` symbols stacked in one section's symbol column.

    `side` is "left" or "right". The symbol column is auto-detected as the first
    black-ink x-cluster in the section's half between y_top and y_bot.
    """
    img = Image.open(render(page)).convert("RGB")
    mask = black_mask(np.asarray(img))
    h, w = mask.shape
    x_lo, x_hi = (200, MIDLINE) if side == "left" else (MIDLINE, 1500)
    sx0, sx1 = symbol_xband(mask, x_lo, x_hi, y_top, y_bot)
    sx0, sx1 = max(0, sx0 - 4), min(w, sx1 + 4)
    prof = mask[y_top:y_bot, sx0:sx1].any(axis=1)
    spans = [(a + y_top, b + y_top) for a, b in y_spans(prof, 12)]
    spans = [s for s in spans if 15 <= (s[1] - s[0]) <= 220]
    if len(spans) != count:
        raise RuntimeError(
            f"page {page} {side}: expected {count}, got {len(spans)}: {spans}"
        )
    out = []
    for i, (y0, y1) in enumerate(spans, 1):
        box = tight_box(mask, sx0, sx1, y0, y1)
        name = f"{slug_prefix}-{i}.png"
        crop_pad(img, box, w, h).save(os.path.join(OUT_DIR, name))
        out.append(f"/figures/ch9/{name}")
    return out


def sign_crop(page, region, slug):
    """Crop a single sign from an (x0,y0,x1,y1) region; tighten to ink."""
    path = render(page)
    img = Image.open(path).convert("RGB")
    arr = np.asarray(img)
    rx0, ry0, rx1, ry1 = region
    sub = arr[ry0:ry1, rx0:rx1]
    r, g, b = sub[..., 0].astype(int), sub[..., 1].astype(int), sub[..., 2].astype(int)
    ink = np.minimum(np.minimum(r, g), b) < 180
    ys, xs = np.where(ink)
    box = (rx0 + xs.min(), ry0 + ys.min(), rx0 + xs.max() + 1, ry0 + ys.max() + 1)
    name = f"{slug}-sign.png"
    crop_pad(img, box, arr.shape[1], arr.shape[0]).save(os.path.join(OUT_DIR, name))
    return f"/figures/ch9/{name}"


# Symbol grids: (page, side, count, slug_prefix, y_top, y_bot).
GRIDS = [
    (158, "left", 8, "arm-single", 650, 1800),
    (158, "right", 8, "arm-double", 650, 1800),
    (159, "left", 8, "circle-single", 340, 1460),
    (159, "right", 8, "circle-double", 340, 1460),
    (160, "left", 8, "wrist-side-single", 590, 1760),
    (160, "right", 8, "wrist-side-double", 590, 1760),
    (161, "left", 6, "wrist-fb-single", 340, 1230),
    (161, "right", 6, "wrist-fb-double", 340, 1230),
]

# Word-signs: (slug, page, region (x0,y0,x1,y1), word, lookup, candidate).
WORD_SIGNS = [
    # p153 — Single/Double Circles word examples.
    ("ideas", 159, (400, 1590, 620, 1785), "ideas", None, 0),
    ("international", 159, (810, 1590, 940, 1785), "international", None, 0),
    ("inferior", 159, (1150, 1590, 1360, 1785), "inferior", None, 0),
    # p155 — Wrist Circles Forward-Back word examples.
    ("who", 161, (400, 1360, 545, 1530), "who", "who", 0),
    ("hearing-person", 161, (780, 1360, 960, 1530), "hearing person", "hearing person", 0),
    ("beautiful", 161, (1170, 1360, 1360, 1545), "beautiful", "beautiful", 0),
    # p156 — Arm & Wrist Circles word examples (left column then right column).
    ("festival", 162, (567, 360, 745, 500), "festival", "festival", 0),
    ("aw-beautiful", 162, (567, 640, 745, 815), "beautiful", "beautiful", 0),
    ("establish", 162, (567, 930, 745, 1050), "establish", None, 0),
    ("use", 162, (567, 1175, 760, 1395), "use", None, 0),
    ("who-left", 162, (567, 1495, 745, 1655), "who", "who", 0),
    ("imagine", 162, (891, 345, 1105, 525), "imagine", None, 0),
    ("hot", 162, (891, 635, 1105, 815), "hot", None, 0),
    ("same-continuously", 162, (891, 930, 1105, 1065), "same continuously", "same", 0),
    ("worried", 162, (891, 1195, 1105, 1360), "worried", "worry", 0),
    ("who-right", 162, (891, 1490, 1115, 1650), "who", "who", 0),
]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    idx = load_index()
    manifest = {}

    grids = {}
    for page, side, count, prefix, y_top, y_bot in GRIDS:
        grids[prefix] = grid_symbols(page, side, count, prefix, y_top, y_bot)

    fsw_for = {}
    with tempfile.TemporaryDirectory() as raw:
        for slug, page, region, word, lookup, ci in WORD_SIGNS:
            key = f"ch9-{slug}"
            entry = {"word": word}
            entry["sign"] = sign_crop(page, region, f"ch9-{slug}")
            cands = idx.get((lookup or word).strip().lower(), [])
            match = cands[ci] if ci < len(cands) else None
            if match:
                fsw_for[key] = match["fsw"]
                try:
                    entry["video"] = download_and_crop(match["file"], f"ch9-{slug}", raw)
                except Exception as exc:  # noqa: BLE001
                    print(f"  warn: video for {key} failed: {exc}")
            manifest[key] = entry

        swu = fsw_to_swu(list(fsw_for.values()))
        for key, value in zip(fsw_for, swu):
            manifest[key]["swu"] = value

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    matched = sum(1 for v in manifest.values() if "swu" in v)
    print(f"Wrote {len(manifest)} word-signs ({matched} matched) + "
          f"{sum(len(v) for v in grids.values())} grid symbols -> "
          f"{os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for k, v in manifest.items():
        print(f"  {k:26s} swu={'y' if 'swu' in v else '-'} "
              f"video={'y' if 'video' in v else '-'}")


if __name__ == "__main__":
    main()
