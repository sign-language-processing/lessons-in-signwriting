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
from signwriting.visualizer.visualize import signwriting_to_image

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

CANVAS = (300, 300)
SHIFT = range(-26, 27, 2)


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
    img = signwriting_to_image(
        f"M500x500{key}500x500",
        trust_box=False,
        antialiasing=False,
        line_color=(0, 0, 0, 255),
        fill_color=(0, 0, 0, 255),
    )
    arr = np.array(img)
    glyph = arr[:, :, 3] > 32 if arr.shape[-1] == 4 else (arr[:, :, 0] < 128)
    h, w = CANVAS
    out = np.zeros((h, w), bool)
    gh, gw = glyph.shape
    if gh > h or gw > w:
        glyph = glyph[max(0, gh - h):, max(0, (gw - w) // 2):][:h, :w]
        gh, gw = glyph.shape
    y0, x0 = h - gh, (w - gw) // 2
    out[y0:y0 + gh, x0:x0 + gw] = glyph
    return out


def inclusion(base_mask: np.ndarray, root_mask: np.ndarray) -> float:
    """Best |root ∩ base| / |root| over small translations — does base include root?"""
    total = root_mask.sum()
    if total == 0:
        return 0.0
    best = 0.0
    for dy in SHIFT:
        for dx in SHIFT:
            shifted = np.roll(np.roll(root_mask, dy, 0), dx, 1)
            best = max(best, (shifted & base_mask).sum() / total)
    return round(float(best), 3)


def main() -> None:
    names = load_names()
    bases = sorted((b for b in names if is_eligible(b)), key=lambda b: int(b, 16))

    print(f"rendering {len(ROOT_DEFS)} rootshape references…")
    root_masks = {name: render_mask(key) for name, key in ROOT_DEFS}

    print(f"classifying {len(bases)} bases by convolution + name…")
    mapping: dict[str, str] = {}
    debug: dict[str, dict] = {}
    unresolved: list[dict] = []

    disagreements: list[dict] = []
    for b in bases:
        base_mask = render_mask(f"S{b}00")
        scores = {name: inclusion(base_mask, mask) for name, mask in root_masks.items()}
        conv = max(scores, key=scores.__getitem__)  # rule 1 (verification)
        nroot = name_root(names[b])  # rule 2 (authoritative when present)

        agree = nroot is not None and conv == nroot
        debug[b] = {"name": names[b], "name_root": nroot, "conv": conv,
                    "agree": agree, "scores": scores}

        if nroot is not None:
            mapping[b] = nroot
            if not agree:
                disagreements.append({"base": b, "name": names[b],
                                      "name_root": nroot, "conv": conv,
                                      "conv_score": scores[conv]})
        else:
            unresolved.append({"base": b, "name": names[b], "conv": conv,
                               "conv_score": scores[conv]})

    OUT.write_text(
        json.dumps({"roots": ROOT_NAMES, "bases": mapping}, indent=2, ensure_ascii=False) + "\n"
    )
    DEBUG_OUT.write_text(
        json.dumps({"resolved": mapping, "unresolved": unresolved,
                    "disagreements": disagreements, "all": debug},
                   indent=2, ensure_ascii=False) + "\n"
    )

    counts: dict[str, int] = {}
    for root in mapping.values():
        counts[root] = counts.get(root, 0) + 1
    print(f"\nmapped {len(mapping)}/{len(bases)} bases by name keyword")
    print("by rootshape:", dict(sorted(counts.items(), key=lambda kv: -kv[1])))

    print(f"\n--- UNMAPPED: no name keyword ({len(unresolved)}) ---")
    for u in unresolved:
        print(f'  {u["base"]}  {u["name"]:42s}  (conv guess: {u["conv"]} {u["conv_score"]})')
    print(f"\n--- MAPPED BUT CONVOLUTION DISAGREES ({len(disagreements)}) ---")
    for u in disagreements:
        print(f'  {u["base"]}  {u["name"]:42s}  name={u["name_root"]:11s} conv={u["conv"]} ({u["conv_score"]})')


if __name__ == "__main__":
    main()
