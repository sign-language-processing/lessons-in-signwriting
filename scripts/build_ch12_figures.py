#!/usr/bin/env python3
"""Build chapter 12 (Body) figures.

The Body chapter is a reference chapter: three symbol+label lists (shoulder
positions/movements, torso positions/movements, upper-body tilt arrows on a
circle) plus a cover photo and the "The Body" SignWriting glyph. There are no
word-signs to resolve against whatsthatsign, so this only decomposes artifacts
into per-item symbol crops and whole diagram crops.

docling bundled each list as one tall PNG (symbol column + blue label column).
This splits the shoulder/torso lists into one trimmed symbol image per item so
the page can pair each symbol with transcribed text. The tilts chart (one big
arrow grid) is emitted whole. The cover photo and glyph are cropped from a
high-resolution render of the chapter-cover PDF page.
"""
import glob
import json
import os
import subprocess

import numpy as np
from PIL import Image

from split_figures import masks, runs, GAP_Y

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
ARTIFACTS = os.path.join(PROJECT_DIR, "docling-out", "sw0116-Lessons-SignWriting_artifacts")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch12")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch12-figures.generated.json")
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")

PAD = 6


def artifact_path(num):
    matches = glob.glob(os.path.join(ARTIFACTS, f"image_{num:06d}_*.png"))
    if not matches:
        raise FileNotFoundError(f"no artifact image_{num:06d}_*")
    return matches[0]


def trimmed(img):
    arr = np.asarray(img.convert("RGB"))
    ink = np.minimum(np.minimum(arr[..., 0], arr[..., 1]), arr[..., 2]) < 200
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return img
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


SHOULDER_ITEMS = [
    ("shoulders", "Shoulders"),
    ("right-shoulder-up", "Right Shoulder Up (Position)"),
    ("both-shoulders-up", "Both Shoulders Up (Position)"),
    ("right-shoulder-down", "Right Shoulder Down (Position)"),
    ("both-shoulders-down", "Both Shoulders Down (Position)"),
    ("one-up-one-down", "One Shoulder Up, One Shoulder Down (Position)"),
    ("shoulder-moves-up", "Shoulder Moves Up"),
    ("shoulder-moves-up-diagonal", "Shoulder Moves Up-Diagonal"),
    ("shoulder-moves-down-diagonal", "Shoulder Moves Down-Diagonal"),
    ("shoulder-moves-down", "Shoulder Moves Down"),
    ("shoulder-moves-forward", "Shoulder Moves Forward"),
    ("shoulder-moves-forward-diagonal", "Shoulder Moves Forward-Diagonal"),
    ("shoulder-moves-back-diagonal", "Shoulder Moves Back-Diagonal"),
    ("shoulder-moves-back", "Shoulder Moves Back"),
    ("shoulder-moves-up-down", "Shoulder Moves Up & Down"),
    ("shoulder-moves-forward-back", "Shoulder Moves Forward & Back"),
]

# Each torso item names its slug and the left-column symbol-band index range it
# spans. The double-down "sinks down" arrow segments into two bands; everything
# else is one band per item.
TORSO_ITEMS = [
    ("torso-pulls-up", (0, 0), "Torso (Upper Body) Pulls Up"),
    ("torso-sinks-down", (1, 2), "Torso (Upper Body) Sinks Down"),
    ("torso-curve-up-side", (3, 3), "Torso Moves in a Curve, Up & Side"),
    ("torso-bends-left", (4, 4), "Torso Bends to the Left Side (Arrow Pushes Torso Up & Side)"),
    ("torso-twists-left", (5, 5), "Torso Twists to the Left Side (Arrow Pushes Torso in a Left Rotation)"),
    ("torso-twists-right", (6, 6), "Torso Twists to the Right Side (Arrow Pushes Torso in a Right Rotation)"),
    ("ribcage-tilts-forward", (7, 7), "Upper Torso (Ribcage) Tilts Forward"),
    ("ribcage-tilts-forward-diagonal", (8, 8), "Upper Torso (Ribcage) Tilts Forward Diagonal"),
    ("ribcage-tilts-side", (9, 9), "Upper Torso (Ribcage) Tilts Side"),
    ("ribcage-tilts-back-diagonal", (10, 10), "Upper Torso (Ribcage) Tilts Back-Diagonal"),
    ("ribcage-tilts-back", (11, 11), "Upper Torso (Ribcage) Tilts Back"),
    ("ribcage-rocks-back-forward", (12, 12), "Rocking Motion From the Ribcage — Upper Torso Tilts (Rocks) Back & Forward"),
    ("ribcage-rocks-back-forward-back", (13, 13), "Rocking Motion From the Ribcage — Upper Torso Tilts (Rocks) Back-Forward-Back"),
]


def symbol_bands(num, x_cut):
    img = Image.open(artifact_path(num)).convert("RGB")
    arr = np.asarray(img)
    ink, _ = masks(arr)
    return img, runs(ink[:, :x_cut].any(axis=1), GAP_Y)


def crop_symbol(img, x_cut, y0, y1):
    box = (0, max(0, y0 - PAD), x_cut, min(img.height, y1 + PAD))
    return trimmed(img.crop(box))


def build_shoulders(manifest):
    x_cut = 118
    img, bands = symbol_bands(473, x_cut)
    assert len(bands) == len(SHOULDER_ITEMS), (len(bands), len(SHOULDER_ITEMS))
    for (slug, label), (y0, y1) in zip(SHOULDER_ITEMS, bands):
        out = f"ch12-shoulder-{slug}.png"
        crop_symbol(img, x_cut, y0, y1).save(os.path.join(OUT_DIR, out))
        manifest[f"ch12-shoulder-{slug}"] = {"word": label, "illustration": f"/figures/ch12/{out}"}


def build_torso(manifest):
    x_cut = 178
    img, bands = symbol_bands(474, x_cut)
    assert len(bands) == 14, len(bands)
    for slug, (b0, b1), label in TORSO_ITEMS:
        y0 = bands[b0][0]
        y1 = bands[b1][1]
        out = f"ch12-{slug}.png"
        crop_symbol(img, x_cut, y0, y1).save(os.path.join(OUT_DIR, out))
        manifest[f"ch12-{slug}"] = {"word": label, "illustration": f"/figures/ch12/{out}"}


def build_tilts(manifest):
    out = "ch12-upper-body-tilts.png"
    trimmed(Image.open(artifact_path(475))).save(os.path.join(OUT_DIR, out))
    manifest["ch12-upper-body-tilts"] = {
        "word": "Upper Body Tilts", "illustration": f"/figures/ch12/{out}"}


def render_cover_page():
    proc = subprocess.run(
        ["pdftoppm", "-f", "183", "-l", "183", "-r", "300", "-png", "-singlefile",
         PDF, "/tmp/ch12_cover"],
        capture_output=True, text=True, check=True,
    )
    _ = proc
    return Image.open("/tmp/ch12_cover.png").convert("RGB")


def build_cover(manifest):
    page = render_cover_page()
    w, h = page.size
    photo = trimmed(page.crop((int(w * 0.20), int(h * 0.05), int(w * 0.80), int(h * 0.52))))
    photo.save(os.path.join(OUT_DIR, "ch12-cover-photo.png"))
    manifest["ch12-cover-photo"] = {
        "word": "The Body", "illustration": "/figures/ch12/ch12-cover-photo.png"}

    glyph = trimmed(page.crop((int(w * 0.55), int(h * 0.60), int(w * 0.85), int(h * 0.755))))
    glyph.save(os.path.join(OUT_DIR, "ch12-the-body-glyph.png"))
    manifest["ch12-the-body-glyph"] = {
        "word": "The Body", "illustration": "/figures/ch12/ch12-the-body-glyph.png"}


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = {}
    build_cover(manifest)
    build_shoulders(manifest)
    build_torso(manifest)
    build_tilts(manifest)

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Wrote {len(manifest)} figures -> {os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for slug in manifest:
        print(f"  {slug}")


if __name__ == "__main__":
    main()
