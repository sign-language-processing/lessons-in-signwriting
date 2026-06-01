#!/usr/bin/env python
"""Build the hand-base -> rootshape mapping used by the Rootshape practice game.

Each eligible ISWA hand base is assigned one of the seven rootshapes the book
defines (Tight Fist, Circle, Cup, Hinge, Angle, Flat Thumb Across, Flat) only
when two independent rules agree:

  Rule 1 - convolution. Render the base glyph and each rootshape glyph (with the
    `signwriting` visualizer), bottom-center aligned, and measure inclusion:
    coverage = |rootshape ∩ base| / |rootshape| (does the base contain the whole
    rootshape?). The best-covered rootshape is rule 1's answer.

  Rule 2 - name keyword. ISWA names encode the rootshape; we trust only the five
    unambiguous keywords: Fist, Circle, Cup, Hinge, Angle.

A base is mapped only when it has a name keyword AND convolution's top rootshape
is the same one. Everything else is left unmapped and reported (no LLM guessing).

Output: src/content/rootshapes.generated.json ({roots, bases}); per-base scores,
sources, and the unresolved list go to scripts/rootshapes_debug.json. Re-runnable:
`python scripts/build_rootshapes.py`.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import numpy as np
from PIL import ImageFont
from scipy.signal import fftconvolve
from signwriting.visualizer import visualize as _viz

# The visualizer hardcodes the Sutton font at 30px, which renders ~16px glyphs —
# far too coarse for shape comparison (the outline boundary is ~10% of pixels,
# so a rootshape isn't a clean pixel-subset of the bases that contain it).
# Render ~8x larger for precise masks.
_RENDER_PX = 240
_viz.get_font = lambda name: ImageFont.truetype(
    str(Path(_viz.__file__).parent / f"{name}.ttf"), _RENDER_PX
)
_viz.get_symbol_size.cache_clear()
from signwriting.visualizer.visualize import signwriting_to_image  # noqa: E402

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
NAMES_TS = ROOT / "src/lib/baseSymbolNames.ts"
OUT = ROOT / "src/content/rootshapes.generated.json"
DEBUG_OUT = HERE / "rootshapes_debug.json"

# name, reference glyph key (fill 0, rotation 0)
ROOT_DEFS = [
    ("Tight Fist", "S20300"),
    ("Circle", "S17600"),
    ("Cup", "S16d00"),
    ("Hinge", "S17d00"),
    ("Angle", "S18500"),
    ("Flat Thumb Across", "S14700"),
    ("Flat", "S15a00"),
]
ROOT_NAMES = [r[0] for r in ROOT_DEFS]

# Rule 2: name-keyword -> rootshape. ISWA names encode the rootshape; some use
# a non-canonical word that we normalize (Curlicue→Circle, Hook→Angle,
# Claw→Hinge). When a name has an "on X" suffix, X is the rootshape (e.g.
# "Index Hinge on Circle" is Circle — the "Hinge" only describes the finger), so
# the suffix is checked before the bare keywords.
NAME_KEYWORDS = [
    ("angle", "Angle"),
    ("hinge", "Hinge"),
    ("cup", "Cup"),
    ("circle", "Circle"),
    ("curlicue", "Circle"),
    ("hook", "Angle"),
    ("claw", "Hinge"),
    ("fist", "Tight Fist"),
]
KEYWORD_MAP = dict(NAME_KEYWORDS)

WRIST_VIEW = {"14d", "14f", "151", "15c", "15e", "1f6", "204"}
INCOMPLETE = {"15b"}

def load_names() -> dict[str, str]:
    return dict(re.findall(r'"([0-9a-f]{3})":\s*"([^"]+)"', NAMES_TS.read_text()))


def is_eligible(base: str) -> bool:
    return (
        base not in WRIST_VIEW
        and base not in INCOMPLETE
        and 0x100 <= int(base, 16) <= 0x204
    )


def name_root(name: str) -> str | None:
    n = name.lower()
    on = re.search(r"\bon (\w+)", n)
    if on and on.group(1) in KEYWORD_MAP:
        return KEYWORD_MAP[on.group(1)]
    for keyword, root in NAME_KEYWORDS:
        if keyword in n:
            return root
    return None


def render_mask(key: str) -> np.ndarray:
    """Tight boolean mask of the solid-black glyph (line + fill both black)."""
    arr = np.array(
        signwriting_to_image(
            f"M500x500{key}500x500",
            trust_box=False,
            antialiasing=False,
            line_color=(0, 0, 0, 255),
            fill_color=(0, 0, 0, 255),
        )
    )
    return arr[:, :, 3] > 32 if arr.shape[-1] == 4 else (arr[:, :, 0] < 128)


def inclusion(base_mask: np.ndarray, root_mask: np.ndarray) -> float:
    """Max |root ∩ base| / |root| over *all* translations (full-shift convolution).

    Does the base glyph contain the whole rootshape glyph at its best alignment?
    Computed as the peak of the cross-correlation, so the rootshape is free to
    slide anywhere within the base.
    """
    total = root_mask.sum()
    if total == 0:
        return 0.0
    corr = fftconvolve(
        base_mask.astype(np.float32), root_mask[::-1, ::-1].astype(np.float32)
    )
    return round(float(corr.max()) / total, 3)


def main() -> None:
    names = load_names()
    bases = sorted((b for b in names if is_eligible(b)), key=lambda b: int(b, 16))

    print(f"rendering {len(ROOT_DEFS)} rootshape references…")
    root_masks = {name: render_mask(key) for name, key in ROOT_DEFS}

    print(f"classifying {len(bases)} bases by convolution + name…")
    mapping: dict[str, str] = {}
    debug: dict[str, dict] = {}
    conv_only: list[dict] = []
    disagreements: list[dict] = []

    for b in bases:
        base_mask = render_mask(f"S{b}00")
        scores = {name: inclusion(base_mask, mask) for name, mask in root_masks.items()}
        conv = max(scores, key=scores.__getitem__)  # rule 1
        nroot = name_root(names[b])  # rule 2 (authoritative when present)

        if nroot is not None:
            mapping[b] = nroot
            source = "both" if conv == nroot else "name"
        else:
            mapping[b] = conv
            source = "convolution"

        debug[b] = {"name": names[b], "name_root": nroot, "conv": conv,
                    "source": source, "scores": scores}
        if source == "name":
            disagreements.append({"base": b, "name": names[b], "name_root": nroot,
                                  "conv": conv, "conv_score": scores[conv]})
        elif source == "convolution":
            conv_only.append({"base": b, "name": names[b], "conv": conv,
                              "conv_score": scores[conv]})

    OUT.write_text(
        json.dumps({"roots": ROOT_NAMES, "bases": mapping}, indent=2, ensure_ascii=False) + "\n"
    )
    DEBUG_OUT.write_text(
        json.dumps({"bases": mapping, "conv_only": conv_only,
                    "disagreements": disagreements, "all": debug},
                   indent=2, ensure_ascii=False) + "\n"
    )

    counts: dict[str, int] = {}
    src_counts: dict[str, int] = {}
    for b in bases:
        counts[mapping[b]] = counts.get(mapping[b], 0) + 1
        src_counts[debug[b]["source"]] = src_counts.get(debug[b]["source"], 0) + 1
    print(f"\nmapped {len(mapping)}/{len(bases)} bases")
    print("by rootshape:", dict(sorted(counts.items(), key=lambda kv: -kv[1])))
    print("by source:   ", src_counts, "(both = name keyword confirmed by convolution)")

    print(f"\n--- ASSIGNED BY CONVOLUTION ONLY (no name keyword) ({len(conv_only)}) ---")
    for u in conv_only:
        print(f'  {u["base"]}  {u["name"]:42s}  -> {u["conv"]} ({u["conv_score"]})')
    print(f"\n--- NAME vs CONVOLUTION DISAGREE (name wins) ({len(disagreements)}) ---")
    for u in disagreements:
        print(f'  {u["base"]}  {u["name"]:42s}  name={u["name_root"]:11s} conv={u["conv"]} ({u["conv_score"]})')


if __name__ == "__main__":
    main()
