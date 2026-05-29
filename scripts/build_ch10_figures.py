#!/usr/bin/env python3
"""Build chapter 10 (Face) figures.

The Face chapter is a reference catalog of facial-expression symbols grouped by
part of the face. docling already exported most groups as clean, self-labeled
table images (the symbol plus its blue word label baked in); those are copied
through trimmed. Two pieces are not usable from docling and are cropped from the
page scans instead: the Eyegaze block and the Ears block (page 161, whose
artifacts are bare unlabeled circles), and the closing "The Head" demonstration
photo plus its sign glyph (page 169).

Every figure is a diagram, so there are no whatsthatsign word-signs to resolve;
the manifest is written empty and the page references the crops directly.
"""
import glob
import json
import os
import subprocess

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
ARTIFACTS = os.path.join(
    PROJECT_DIR, "docling-out", "sw0116-Lessons-SignWriting_artifacts"
)
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch10")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch10-figures.generated.json")

# Self-labeled group tables straight from docling (artifact number -> slug).
GROUP_TABLES = {
    435: "ch10-facial-forehead-eyebrows",
    436: "ch10-eyebrows-continued",
    437: "ch10-eyes",
    457: "ch10-cheeks",
    458: "ch10-breathing-nose-mouth",
    459: "ch10-mouth-continued",
    460: "ch10-tongue",
    461: "ch10-tongue-continued",
    462: "ch10-teeth-chin",
    463: "ch10-chin-other",
}


def artifact_path(num):
    matches = glob.glob(os.path.join(ARTIFACTS, f"image_{num:06d}_*.png"))
    if not matches:
        raise FileNotFoundError(f"no artifact image_{num:06d}_*")
    return matches[0]


def trimmed(img, thresh=200):
    arr = np.asarray(img.convert("RGB"))
    ink = np.minimum(np.minimum(arr[..., 0], arr[..., 1]), arr[..., 2]) < thresh
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return img
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def render_page(pdf_page, dpi=200):
    stem = f"/tmp/ch10_build_p{pdf_page}"
    subprocess.run(
        ["pdftoppm", "-f", str(pdf_page), "-l", str(pdf_page), "-r", str(dpi),
         "-png", PDF, stem],
        check=False,
    )
    return Image.open(f"{stem}-{pdf_page}.png").convert("RGB")


def ink_mask(img, thresh=180):
    arr = np.asarray(img)
    return np.minimum(np.minimum(arr[..., 0], arr[..., 1]), arr[..., 2]) < thresh


def black_mask(img, thresh=90):
    arr = np.asarray(img).astype(int)
    return (arr[..., 0] < thresh) & (arr[..., 1] < thresh) & (arr[..., 2] < thresh)


def crop_region(img, mask, y0, y1, x0, x1, pad, min_count=1):
    region = mask[y0:y1, x0:x1]
    rows = np.where(region.sum(axis=1) >= min_count)[0]
    cols = np.where(region.sum(axis=0) >= min_count)[0]
    box = (
        x0 + cols.min() - pad,
        y0 + rows.min() - pad,
        x0 + cols.max() + pad,
        y0 + rows.max() + pad,
    )
    return img.crop(box)


def build_eyegaze_and_ears():
    page = render_page(167)
    mask = ink_mask(page)
    eyegaze = crop_region(page, mask, 190, 1335, 360, 1360, pad=20, min_count=3)
    eyegaze.save(os.path.join(OUT_DIR, "ch10-eyegaze.png"))
    ears = crop_region(page, mask, 1490, 1725, 360, 1200, pad=20, min_count=2)
    ears.save(os.path.join(OUT_DIR, "ch10-ears.png"))


def build_head():
    page = render_page(175)
    ink = ink_mask(page, thresh=200)
    photo = crop_region(page, ink, 0, 1400, 0, 1700, pad=6, min_count=5)
    photo.save(os.path.join(OUT_DIR, "ch10-head-photo.png"))
    black = black_mask(page)
    sign = crop_region(page, black, 1400, 1820, 1050, 1400, pad=25, min_count=1)
    sign.save(os.path.join(OUT_DIR, "ch10-head-sign.png"))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for num, slug in GROUP_TABLES.items():
        trimmed(Image.open(artifact_path(num))).save(
            os.path.join(OUT_DIR, f"{slug}.png")
        )
    build_eyegaze_and_ears()
    build_head()

    manifest = {}
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    written = sorted(os.listdir(OUT_DIR))
    print(f"Wrote {len(written)} images -> public/figures/ch10/")
    for name in written:
        print(f"  {name}")
    print(f"Manifest (empty, no word-signs in this chapter) -> "
          f"{os.path.relpath(MANIFEST, PROJECT_DIR)}")


if __name__ == "__main__":
    main()
