#!/usr/bin/env python3
"""Split chapter 4 (Contact) figure artifacts into illustration / sign pieces
and resolve each word against whatsthatsign.

docling extracted the book's figure-clusters inconsistently: most are a single
PNG bundling a line drawing, its SignWriting sign, and a blue word label (often
two examples side by side); a few have the drawing and the sign as separate
artifacts. This rebuilds them as separate images so the page can render the
drawing and the sign independently, and — when the word exists in whatsthatsign —
attach the live sign plus its source clip.

Per-figure SPEC keys:
  slug         — manifest key / output filename stem (section-prefixed, unique)
  img          — source artifact number for cell-based crops
  illustration — cells (col,row from split_figures.segment) forming the drawing
  sign         — cells forming the SignWriting sign
  illus_img    — whole artifact number used as the illustration (trimmed)
  sign_img     — whole artifact number used as the sign (trimmed)
  word         — book word label (caption + default whatsthatsign lookup)
  lookup       — search whatsthatsign for this word instead of `word`
  candidate    — which match (0-based, CSV order) to use when a word has several
  fsw          — pin an exact FSW instead of looking the word up
  video_url    — fetch the hover clip from an explicit URL (takes precedence)
  confirmed    — match approved: render the live sign in place of the raster
"""
import csv
import glob
import json
import os
import subprocess
import tempfile
import urllib.request

import numpy as np
from PIL import Image

from download_hand_example_videos import crop, download_and_crop
from split_figures import segment

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
ARTIFACTS = os.path.join(PROJECT_DIR, "docling-out", "sw0116-Lessons-SignWriting_artifacts")
CSV_PATH = os.path.join(HERE, "whatsthatsign_index.csv")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "contact")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "contact-figures.generated.json")
CELLS_DIR = "/tmp/contact_cells"

MORE_FSW = ("AS18510S2fe00S18518S2fe00S21406S20600"
            "M526x515S18510501x500S18518474x500S20600489x486")
MORE_VIDEO = ("https://www.whatsthatsign.com/videos/"
              "%F1%83%87%B1%F1%8F%81%A1%F1%83%87%B9%F1%8F%81%A1%F1%86%9E%87%F1%86%89%81.mov")

SPEC = [
    # Touch (pp.94-95) — confirmed, rendered live.
    {"slug": "more", "img": 191, "illustration": [(0, 0), (0, 1)], "sign": [(0, 2)], "word": "more",
     "fsw": MORE_FSW, "video_url": MORE_VIDEO, "confirmed": True},
    {"slug": "school", "img": 191, "illustration": [(1, 0), (1, 1)], "sign": [(1, 2), (1, 3)], "word": "school",
     "confirmed": True},
    {"slug": "dating", "img": 194, "illustration": [], "sign": [(0, 0)], "word": "dating", "lookup": "date",
     "confirmed": True},
    {"slug": "deaf", "img": 195, "illustration": [], "sign": [(0, 0)], "word": "deaf", "confirmed": True},

    # Grasp (p.96)
    {"slug": "grasp-earring", "img": 196, "illustration": [(0, 0)], "sign": [(0, 1)], "word": "earring"},
    {"slug": "grasp-congratulations", "img": 196, "illustration": [(1, 0), (1, 1), (1, 2)], "sign": [(1, 3)],
     "word": "congratulations"},

    # Between (p.96)
    {"slug": "between-disappear", "img": 197, "illustration": [(0, 0), (0, 1), (0, 2)], "sign": [(0, 3)],
     "word": "disappear", "confirmed": True},
    {"slug": "between-america", "img": 197, "illustration": [(1, 0), (1, 1)], "sign": [(1, 2)], "word": "america",
     "confirmed": True},

    # Strike (p.97)
    {"slug": "strike-hit", "img": 200, "illustration": [(0, 0)], "sign": [(0, 1)], "word": "hit"},
    {"slug": "strike-clap", "img": 200, "illustration": [(1, 0)], "sign": [(1, 1)], "word": "clap",
     "confirmed": True},

    # Brush (p.97 band)
    {"slug": "brush-excuse-me", "img": 201, "illustration": [(0, 0)], "sign": [(0, 1)], "word": "excuse me"},
    {"slug": "brush-monthly", "img": 201, "illustration": [(1, 0)], "sign": [(1, 1)], "word": "monthly",
     "confirmed": True},

    # Brush detail (p.98) — single signs, no drawing
    {"slug": "brush-monthly-2", "img": 204, "illustration": [], "sign": [(0, 1)], "word": "monthly",
     "confirmed": True},
    {"slug": "brush-easy", "img": 205, "illustration": [], "sign": [(0, 0), (0, 1)], "word": "easy",
     "confirmed": True},
    {"slug": "brush-excuse-me-2", "img": 206, "illustration": [], "sign": [(0, 0)], "word": "excuse me"},

    # Circular Rub (p.99) — drawing and sign are separate artifacts
    {"slug": "circular-coffee", "illus_img": 207, "sign_img": 208, "word": "coffee", "confirmed": True},
    {"slug": "circular-chocolate", "illus_img": 209, "sign_img": 210, "word": "chocolate", "confirmed": True},

    # Straight Rub (p.99) — the "neat" example uses the "nice" sign and is labelled
    # "nice"; the standalone "nice" detail figure (img 216) is dropped as a duplicate.
    {"slug": "straight-nice", "img": 211, "illustration": [(0, 0)], "sign": [(0, 1)], "word": "nice",
     "confirmed": True},
    {"slug": "straight-eager", "img": 211, "illustration": [(1, 0), (1, 1)], "sign": [(1, 2), (1, 3)],
     "word": "eager", "confirmed": True},

    # Rub detail (p.100) — single signs
    {"slug": "rub-temperature", "img": 214, "illustration": [], "sign": [(0, 0)], "word": "temperature",
     "confirmed": True},
    {"slug": "rub-coffee", "img": 215, "illustration": [], "sign": [(0, 0)], "word": "coffee", "confirmed": True},
]


def artifact_path(num):
    matches = glob.glob(os.path.join(ARTIFACTS, f"image_{num:06d}_*.png"))
    if not matches:
        raise FileNotFoundError(f"no artifact image_{num:06d}_*")
    return matches[0]


def union(boxes):
    xs0, ys0, xs1, ys1 = zip(*boxes)
    return (min(xs0), min(ys0), max(xs1), max(ys1))


def trimmed(img):
    arr = np.asarray(img.convert("RGB"))
    ink = np.minimum(np.minimum(arr[..., 0], arr[..., 1]), arr[..., 2]) < 200
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return img
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def load_index():
    idx = {}
    with open(CSV_PATH, newline="") as f:
        for row in csv.DictReader(f):
            ex = json.loads(row["extra"]) if row["extra"] else {}
            fsw = ex.get("sign_fsw", "")
            if not fsw:
                continue
            for syn in row["text"].split(","):
                idx.setdefault(syn.strip().lower(), []).append({"fsw": fsw, "file": row["file"]})
    return idx


def download_url_and_crop(url, slug, raw_dir):
    dest = os.path.join(PROJECT_DIR, "public", "videos", "whatsthatsign", slug, f"{slug}.mp4")
    local = os.path.join(raw_dir, f"{slug}-src{os.path.splitext(url)[1] or '.mov'}")
    urllib.request.urlretrieve(url, local)
    crop(local, dest)
    return f"/videos/whatsthatsign/{slug}/{slug}.mp4"


def fsw_to_swu(fsws):
    if not fsws:
        return []
    script = (
        "const { convert } = require('@sutton-signwriting/core');"
        "let s=''; process.stdin.on('data',d=>s+=d).on('end',()=>{"
        "const a=JSON.parse(s);"
        "process.stdout.write(JSON.stringify(a.map(f=>convert.fsw2swu(f))));});"
    )
    proc = subprocess.run(
        ["node", "-e", script], input=json.dumps(fsws),
        capture_output=True, text=True, cwd=PROJECT_DIR, check=True,
    )
    return json.loads(proc.stdout)


def make_images(fig, cells_by_img, entry):
    slug = fig["slug"]
    if "illus_img" in fig:
        out = f"{slug}-illustration.png"
        trimmed(Image.open(artifact_path(fig["illus_img"]))).save(os.path.join(OUT_DIR, out))
        entry["illustration"] = f"/figures/contact/{out}"
    if "sign_img" in fig:
        out = f"{slug}-sign.png"
        trimmed(Image.open(artifact_path(fig["sign_img"]))).save(os.path.join(OUT_DIR, out))
        entry["sign"] = f"/figures/contact/{out}"
    if "img" not in fig:
        return
    num = fig["img"]
    if num not in cells_by_img:
        cells = segment(artifact_path(num), os.path.join(CELLS_DIR, str(num)))
        cells_by_img[num] = {(c["col"], c["row"]): c["box"] for c in cells}
    cells = cells_by_img[num]
    img = Image.open(artifact_path(num)).convert("RGB")
    if fig.get("illustration"):
        out = f"{slug}-illustration.png"
        img.crop(union([cells[k] for k in fig["illustration"]])).save(os.path.join(OUT_DIR, out))
        entry["illustration"] = f"/figures/contact/{out}"
    if fig.get("sign"):
        out = f"{slug}-sign.png"
        img.crop(union([cells[k] for k in fig["sign"]])).save(os.path.join(OUT_DIR, out))
        entry["sign"] = f"/figures/contact/{out}"


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    idx = load_index()
    cells_by_img = {}
    manifest = {}
    fsw_for = {}

    with tempfile.TemporaryDirectory() as raw:
        for fig in SPEC:
            slug = fig["slug"]
            entry = {"word": fig["word"]}
            make_images(fig, cells_by_img, entry)

            candidates = idx.get((fig.get("lookup") or fig["word"]).strip().lower(), [])
            ci = fig.get("candidate", 0)
            match = candidates[ci] if ci < len(candidates) else None

            fsw = fig.get("fsw") or (match["fsw"] if match else None)
            if fsw:
                fsw_for[slug] = fsw

            if fig.get("video_url"):
                entry["video"] = download_url_and_crop(fig["video_url"], slug, raw)
            elif match:
                entry["video"] = download_and_crop(match["file"], slug, raw)

            if fig.get("confirmed"):
                entry["confirmed"] = True
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
        print(f"  {slug:24s} illus={'y' if 'illustration' in v else '-'} "
              f"swu={'y' if 'swu' in v else '-'} video={'y' if 'video' in v else '-'} "
              f"{'CONFIRMED' if v.get('confirmed') else ''}")


if __name__ == "__main__":
    main()
