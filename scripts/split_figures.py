#!/usr/bin/env python3
"""Segment a docling composite artifact into its constituent cells.

The book's figure clusters are laid out as a grid: one column per example,
each column stacked as illustration (line drawing) over SignWriting sign over
a blue word label. docling extracted each cluster as a single PNG; this splits
it back apart by whitespace projection so each piece can be rendered on its own.

Usage:
    split_figures.py <image.png> [out_dir]

Writes cell_c<col>_r<row>.png crops and prints each cell's bbox + a colour tag
(black = drawing/sign, blue = word label) so the caller can assign roles.
"""
import os
import sys

import numpy as np
from PIL import Image

INK_MAX = 200
BLUE_DELTA = 40
GAP_X = 14
GAP_Y = 10
PAD = 4


def masks(arr):
    r, g, b = arr[..., 0].astype(int), arr[..., 1].astype(int), arr[..., 2].astype(int)
    ink = np.minimum(np.minimum(r, g), b) < INK_MAX
    blue = ink & (b - np.maximum(r, g) > BLUE_DELTA) & (b > 100)
    return ink, blue


def runs(profile, gap):
    """Yield (start, end) spans of True separated by >= `gap` False pixels."""
    spans, start, gap_len = [], None, 0
    for i, on in enumerate(profile):
        if on:
            if start is None:
                start = i
            gap_len = 0
        else:
            if start is not None:
                gap_len += 1
                if gap_len >= gap:
                    spans.append((start, i - gap_len + 1))
                    start = None
    if start is not None:
        spans.append((start, len(profile)))
    return spans


def crop_box(mask, x0, x1, y0, y1):
    sub = mask[y0:y1, x0:x1]
    ys, xs = np.where(sub)
    if len(xs) == 0:
        return None
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1)


def segment(path, out_dir):
    img = Image.open(path).convert("RGB")
    arr = np.asarray(img)
    ink, blue = masks(arr)
    h, w = ink.shape
    os.makedirs(out_dir, exist_ok=True)

    cells = []
    col_spans = runs(ink.any(axis=0), GAP_X)
    for ci, (x0, x1) in enumerate(col_spans):
        col = ink[:, x0:x1]
        row_spans = runs(col.any(axis=1), GAP_Y)
        for ri, (y0, y1) in enumerate(row_spans):
            box = crop_box(ink, x0, x1, y0, y1)
            if box is None:
                continue
            bx0, by0, bx1, by1 = box
            region_blue = blue[by0:by1, bx0:bx1].sum()
            region_ink = ink[by0:by1, bx0:bx1].sum()
            tag = "blue" if region_ink and region_blue / region_ink > 0.5 else "black"
            cx0, cy0 = max(0, bx0 - PAD), max(0, by0 - PAD)
            cx1, cy1 = min(w, bx1 + PAD), min(h, by1 + PAD)
            name = f"cell_c{ci}_r{ri}.png"
            img.crop((cx0, cy0, cx1, cy1)).save(os.path.join(out_dir, name))
            cells.append({"col": ci, "row": ri, "tag": tag,
                          "box": (cx0, cy0, cx1, cy1), "name": name,
                          "h": by1 - by0, "w": bx1 - bx0})
            print(f"  c{ci} r{ri} {tag:5s} box=({cx0},{cy0},{cx1},{cy1}) "
                  f"{bx1-bx0}x{by1-by0} -> {name}")
    return cells


if __name__ == "__main__":
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "/tmp/figcells"
    segment(src, out)
