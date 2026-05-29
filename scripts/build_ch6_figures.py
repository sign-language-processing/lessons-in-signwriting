#!/usr/bin/env python3
"""Build chapter 6 (Straight Movement) figures.

Chapter 6 is overwhelmingly arrow / plane DIAGRAMS; docling fragmented every
diagram into individual symbol glyphs, so its artifacts cannot be reassembled
faithfully. Instead this crops the figures directly from high-resolution
renders of the original PDF pages (book pages 107-128 == PDF pages 113-128).

Each figure SPEC names the source PDF page and a crop box in the coordinate
system of an 80-DPI render (the resolution used while laying the chapter out);
boxes are scaled to the 200-DPI working render and tightened with `trimmed`.

Diagram figures are emitted as plain images under public/figures/ch6/. Word
figures (a SignWriting sign under a blue word label) additionally resolve the
word against whatsthatsign: the matched sign's swu + source clip are attached so
SignFigure can reveal the live sign. Matches stay PENDING (never confirmed) for
the user to approve.
"""
import json
import os
import subprocess
import tempfile

from PIL import Image

from build_contact_figures import fsw_to_swu, load_index, trimmed
from download_hand_example_videos import download_and_crop

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))
PDF = os.path.join(PROJECT_DIR, "public", "sw0116-Lessons-SignWriting.pdf")
OUT_DIR = os.path.join(PROJECT_DIR, "public", "figures", "ch6")
MANIFEST = os.path.join(PROJECT_DIR, "src", "content", "ch6-figures.generated.json")
RENDER_DIR = "/tmp/ch6_render"
RENDER_DPI = 200
SPEC_DPI = 80
SCALE = RENDER_DPI / SPEC_DPI

# --- Diagram figures: cropped straight from the PDF, no whatsthatsign lookup ---
# box is (x0, y0, x1, y1) in 80-DPI page coordinates (page render is 680x880).
DIAGRAMS = [
    # p110 Signing Space — room + person illustration
    {"slug": "ch6-signing-space", "page": 116, "box": (255, 175, 545, 640)},
    # p111 Wall Plane: person-in-doorframe + 8-direction arrow rose + Floor Plane person + rose
    {"slug": "ch6-wall-plane-person", "page": 117, "box": (150, 60, 290, 470)},
    {"slug": "ch6-wall-plane-rose", "page": 117, "box": (330, 70, 470, 175)},
    {"slug": "ch6-floor-plane-rose", "page": 117, "box": (210, 480, 350, 580)},
    {"slug": "ch6-floor-plane-person", "page": 117, "box": (350, 320, 500, 700)},
    # p112 The Planes — two room diagrams (wall plane, floor plane)
    {"slug": "ch6-planes-wall-room", "page": 118, "box": (120, 100, 525, 365)},
    {"slug": "ch6-planes-floor-room", "page": 118, "box": (110, 395, 555, 665)},
    # p113 The Planes with arrow roses inside the rooms
    {"slug": "ch6-planes-wall-room-arrows", "page": 119, "box": (140, 95, 545, 350)},
    {"slug": "ch6-planes-floor-room-arrows", "page": 119, "box": (120, 405, 575, 685)},
    # p114 Up-Down Movement — full arrow rose around silhouette
    {"slug": "ch6-up-down-rose", "page": 120, "box": (95, 180, 545, 760)},
    # p115 Forward-Back Movement — forward rose + back rose
    {"slug": "ch6-forward-rose", "page": 121, "box": (130, 180, 560, 460)},
    {"slug": "ch6-back-rose", "page": 121, "box": (150, 480, 540, 770)},
    # p116 Movement with the right / left hand — front + top views
    {"slug": "ch6-right-hand", "page": 122, "box": (85, 120, 570, 400)},
    {"slug": "ch6-left-hand", "page": 122, "box": (85, 475, 570, 760)},
    # p117 Movement to the side — front + top views
    {"slug": "ch6-side", "page": 123, "box": (100, 150, 575, 330)},
    # p118 Do not confuse these arrows — up (double) vs forward (single)
    {"slug": "ch6-confuse-up", "page": 124, "box": (120, 150, 460, 410)},
    {"slug": "ch6-confuse-forward", "page": 124, "box": (120, 490, 440, 730)},
    # p120 Up-Down (Wall-Plane) variations chart
    {"slug": "ch6-wall-plane-chart", "page": 126, "box": (110, 190, 575, 680)},
    # p122 Forward-Back (Floor-Plane) variations chart
    {"slug": "ch6-floor-plane-chart", "page": 128, "box": (110, 190, 575, 680)},
    # p124 rocketship: double-stemmed up arrow beside a rocket launch image
    {"slug": "ch6-rocketship", "page": 124, "box": (185, 320, 470, 700)},
    # p125 car: single-stemmed forward arrows beside a driving image
    {"slug": "ch6-car", "page": 125, "box": (230, 195, 480, 720)},
    # p126 The Diagonal Plane (room) + Forward/Back Diagonal (room with arrows)
    {"slug": "ch6-diagonal-plane", "page": 126, "box": (95, 105, 555, 410)},
    {"slug": "ch6-forward-back-diagonal", "page": 126, "box": (95, 460, 555, 740)},
    # p127 Up-Forward (airplane taking off) + Down-Back (airplane landing)
    {"slug": "ch6-up-forward", "page": 127, "box": (220, 165, 485, 335)},
    {"slug": "ch6-down-back", "page": 127, "box": (180, 500, 530, 660)},
    # p128 Do Not Confuse These Arrows — up row + down row
    {"slug": "ch6-confuse-diag-up", "page": 128, "box": (105, 140, 555, 320)},
    {"slug": "ch6-confuse-diag-down", "page": 128, "box": (105, 425, 555, 615)},
]

# --- Word figures: a SignWriting example (illustration + sign) under a blue word
# label; resolved against whatsthatsign. `sign_box` is the whole example cell
# (80-DPI page coords); the matched live sign is authoritative on hover.
WORDS = [
    # p119 Straight Movement examples (Up/Down section)
    {"slug": "ch6-monthly", "page": 119, "word": "monthly", "sign_box": (108, 110, 256, 340)},
    {"slug": "ch6-disappear", "page": 119, "word": "disappear", "lookup": "disappear",
     "sign_box": (258, 110, 412, 340)},
    # p119 Straight Movement examples (Forward/Back section)
    {"slug": "ch6-excuse-me", "page": 119, "word": "excuse me", "lookup": "excuse",
     "sign_box": (108, 402, 256, 656)},
    {"slug": "ch6-eager", "page": 119, "word": "eager", "sign_box": (258, 402, 412, 656)},
    # p121 Up-Down Straight Arrows examples
    {"slug": "ch6-exam-test", "page": 121, "word": "exam, test", "lookup": "exam",
     "sign_box": (130, 195, 300, 348)},
    {"slug": "ch6-house", "page": 121, "word": "house", "sign_box": (300, 190, 568, 348)},
    {"slug": "ch6-system", "page": 121, "word": "system", "sign_box": (130, 500, 300, 648)},
    {"slug": "ch6-square", "page": 121, "word": "square", "sign_box": (300, 500, 568, 648)},
    # p123 Forward-Back Straight Arrows examples
    {"slug": "ch6-hello", "page": 123, "word": "hello", "sign_box": (130, 160, 340, 300)},
    {"slug": "ch6-nothing", "page": 123, "word": "nothing", "sign_box": (385, 160, 570, 300)},
    {"slug": "ch6-right", "page": 123, "word": "right (direction)", "lookup": "right",
     "sign_box": (138, 560, 360, 730)},
    {"slug": "ch6-ask-question", "page": 123, "word": "ask a question", "lookup": "ask",
     "sign_box": (385, 560, 570, 730)},
]


def render_page(page):
    out = os.path.join(RENDER_DIR, f"p-{page}.png")
    if not os.path.exists(out):
        subprocess.run(
            ["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(RENDER_DPI),
             "-png", PDF, os.path.join(RENDER_DIR, "p")],
            check=True, capture_output=True,
        )
        rendered = os.path.join(RENDER_DIR, f"p-{page:02d}.png")
        if os.path.exists(rendered) and rendered != out:
            os.replace(rendered, out)
    return out


def scale_box(box):
    return tuple(int(round(v * SCALE)) for v in box)


def crop(page, box):
    im = Image.open(render_page(page)).convert("RGB")
    return trimmed(im.crop(scale_box(box)))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(RENDER_DIR, exist_ok=True)
    idx = load_index()
    manifest = {}
    fsw_for = {}

    for fig in DIAGRAMS:
        out = f"{fig['slug']}.png"
        crop(fig["page"], fig["box"]).save(os.path.join(OUT_DIR, out))

    with tempfile.TemporaryDirectory() as raw:
        for fig in WORDS:
            slug = fig["slug"]
            out = f"{slug}-sign.png"
            crop(fig["page"], fig["sign_box"]).save(os.path.join(OUT_DIR, out))
            entry = {"word": fig["word"], "sign": f"/figures/ch6/{out}"}

            candidates = idx.get((fig.get("lookup") or fig["word"]).strip().lower(), [])
            match = candidates[0] if candidates else None
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

    matched = sum("swu" in v for v in manifest.values())
    print(f"Wrote {len(manifest)} word figures ({matched} matched), "
          f"{len(DIAGRAMS)} diagram images -> "
          f"{os.path.relpath(MANIFEST, PROJECT_DIR)}")
    for slug, v in manifest.items():
        print(f"  {slug:28s} swu={'y' if 'swu' in v else '-'} "
              f"video={'y' if 'video' in v else '-'}")


if __name__ == "__main__":
    main()
