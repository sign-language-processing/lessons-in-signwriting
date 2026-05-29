#!/usr/bin/env python3
"""Split chapter 5 (Finger Movement) example composites into illustration / sign
pieces and resolve each word against whatsthatsign.

Same approach as build_contact_figures.py (shared helpers imported from it): each
SPEC figure names the segmented cells forming the illustration and the sign, plus
the book word. Crops go to public/figures/finger/, the whatsthatsign clip to
public/videos/whatsthatsign/<slug>/, and the manifest to
src/content/finger-figures.generated.json (merged into figures.ts for SignFigure).
"""
import json
import os
import tempfile

from PIL import Image

from build_contact_figures import (
    artifact_path,
    download_url_and_crop,
    fsw_to_swu,
    load_index,
    trimmed,
    union,
)
from download_hand_example_videos import download_and_crop
from split_figures import segment

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "finger")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "finger-figures.generated.json")
CELLS_DIR = "/tmp/finger_cells"

SPEC = [
    # Squeeze, Middle Joint Closes (p.103)
    {"slug": "finger-huh", "img": 222, "illustration": [(0, 0)], "sign": [(0, 1)], "word": "huh?", "lookup": "huh",
     "confirmed": True},
    {"slug": "finger-milk", "img": 222, "illustration": [(1, 0), (2, 0)], "sign": [(2, 1)], "word": "milk",
     "confirmed": True},

    # Flick, Middle Joint Opens (p.103)
    {"slug": "finger-eleven", "img": 223, "illustration": [(0, 0), (0, 1), (0, 2)], "sign": [(0, 3)],
     "word": "eleven", "swu": "𝠃𝤒𝤛񀀁𝣻𝣽񆫡𝤀𝣲",
     "video_url": "https://www.whatsthatsign.com/videos/%F1%80%80%81%F1%8F%81%A1%C3%98%F1%86%AB%A1.mov",
     "confirmed": True},
    {"slug": "finger-understand", "img": 223, "illustration": [(1, 0), (1, 1)], "sign": [(1, 2)],
     "word": "understand", "lookup": "understanding", "confirmed": True},

    # Hinge, Knuckle Joint Closes (p.104)
    {"slug": "finger-twenty", "img": 226, "illustration": [(0, 0)], "sign": [(0, 1)], "word": "twenty",
     "confirmed": True},
    {"slug": "finger-boy", "img": 226, "illustration": [(1, 0)], "sign": [(1, 1)], "word": "boy",
     "confirmed": True},

    # Hinge, Knuckle Joint Opens (p.104)
    {"slug": "finger-send", "img": 227, "illustration": [(0, 0)], "sign": [(0, 1), (0, 2)], "word": "send",
     "image_only": True},
    {"slug": "finger-send-send", "img": 227, "illustration": [(1, 0), (1, 1)], "sign": [(1, 2)],
     "word": "send-send", "image_only": True},

    # Hinge, Knuckles Open & Close Together (p.105)
    {"slug": "finger-goodbye", "img": 230, "illustration": [(0, 0), (0, 1)], "sign": [(0, 2)], "word": "goodbye"},
    {"slug": "finger-why", "img": 230, "illustration": [(1, 0)], "sign": [(1, 1)], "word": "why",
     "swu": "𝠃𝤴𝤘񋾡𝣴𝣵񄧸𝤛𝣺񆲅𝤑𝣮",
     "video_url": "https://www.whatsthatsign.com/videos/%F1%84%A7%B8%F1%8C%80%88%C3%98%F1%86%B2%85.mov",
     "confirmed": True},

    # Trill, Knuckles Open-Close Alternating (p.105)
    {"slug": "finger-fingerspell", "img": 231, "illustration": [(0, 0)], "sign": [(0, 1)], "word": "fingerspell",
     "confirmed": True},
    {"slug": "finger-typing", "img": 231, "illustration": [(1, 0)], "sign": [(1, 1)], "word": "typing",
     "confirmed": True},
]


def make_images(fig, cells_by_img, entry):
    slug = fig["slug"]
    num = fig["img"]
    if num not in cells_by_img:
        cells = segment(artifact_path(num), os.path.join(CELLS_DIR, str(num)))
        cells_by_img[num] = {(c["col"], c["row"]): c["box"] for c in cells}
    cells = cells_by_img[num]
    img = Image.open(artifact_path(num)).convert("RGB")
    if fig.get("illustration"):
        out = f"{slug}-illustration.png"
        img.crop(union([cells[k] for k in fig["illustration"]])).save(os.path.join(OUT_DIR, out))
        entry["illustration"] = f"/figures/finger/{out}"
    if fig.get("sign"):
        out = f"{slug}-sign.png"
        img.crop(union([cells[k] for k in fig["sign"]])).save(os.path.join(OUT_DIR, out))
        entry["sign"] = f"/figures/finger/{out}"


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

            match = None
            if fig.get("image_only"):
                pass  # render the book crop only — no whatsthatsign sign/video
            elif fig.get("swu"):
                entry["swu"] = fig["swu"]
            else:
                candidates = idx.get((fig.get("lookup") or fig["word"]).strip().lower(), [])
                ci = fig.get("candidate", 0)
                match = candidates[ci] if ci < len(candidates) else None
                if match:
                    fsw_for[slug] = match["fsw"]

            if fig.get("image_only"):
                pass
            elif fig.get("video_url"):
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
        print(f"  {slug:22s} illus={'y' if 'illustration' in v else '-'} "
              f"swu={'y' if 'swu' in v else '-'} video={'y' if 'video' in v else '-'} "
              f"{'CONFIRMED' if v.get('confirmed') else ''}")


if __name__ == "__main__":
    main()
