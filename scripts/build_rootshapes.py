#!/usr/bin/env python
"""Build the hand-base -> rootshape mapping used by the Rootshape practice game.

Each of the 261 ISWA hand bases is assigned one of the seven rootshapes the book
defines (Tight Fist, Circle, Cup, Hinge, Angle, Flat Thumb Across, Flat).

Strategy, in order of authority:
  1. Name keyword. ISWA base names encode the rootshape ("Index on Angle" is the
     Angle rootshape, "Index on Cup" is Cup, a bare "Index" is the Tight Fist).
     This is authoritative and covers most bases.
  2. claude -p. Names without a rootshape keyword (Oval, Claw, Hook, Curlicue,
     and the Flat vs Flat-Thumb-Across split) are resolved by the LLM, which is
     given the seven book definitions plus the rendered-glyph convolution scores
     as visual evidence. Answers are cached so re-runs are incremental.

A convolution coverage score (how much of each rootshape glyph is contained in
the base glyph, rendered with the `signwriting` visualizer) is computed for every
base and stored alongside the mapping for transparency. It is a weak signal on
its own (rootshape glyphs overlap heavily) so it is used only as an LLM hint.

Re-run any time: `python scripts/build_rootshapes.py` (add --force to re-ask the
LLM for cached bases, --no-llm to use the deterministic fallback only).
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from signwriting.visualizer.visualize import signwriting_to_image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
NAMES_TS = ROOT / "src/lib/baseSymbolNames.ts"
OUT = ROOT / "src/content/rootshapes.generated.json"
DEBUG_OUT = HERE / "rootshapes_debug.json"
CACHE = HERE / "rootshapes_llm_cache.json"

# name, reference glyph key (fill 0, rotation 0), book definition
ROOT_DEFS = [
    ("Tight Fist", "S20300", "at least one finger touches the palm of the hand"),
    ("Circle", "S17600",
     "a fingertip touches the thumbtip in a curve, or a curved finger is close "
     "to the palm; closed loops such as ovals also count"),
    ("Cup", "S16d00",
     "fingers are curved at the middle and tip joints with no bend at the knuckle"),
    ("Hinge", "S17d00",
     "fingers bend at the knuckle joint while the middle and tip joints stay "
     "completely straight"),
    ("Angle", "S18500", "the hinge, with the fingertips and thumb tip touching"),
    ("Flat Thumb Across", "S14700",
     "the thumb lies across the palm and four fingers point straight up with no "
     "bends"),
    ("Flat", "S15a00", "five fingers point straight up with no bends"),
]
ROOT_NAMES = [r[0] for r in ROOT_DEFS]

WRIST_VIEW = {"14d", "14f", "151", "15c", "15e", "1f6", "204"}
INCOMPLETE = {"15b"}

CANVAS = (260, 260)
SHIFT = range(-14, 15, 2)


def load_names() -> dict[str, str]:
    text = NAMES_TS.read_text()
    return dict(re.findall(r'"([0-9a-f]{3})":\s*"([^"]+)"', text))


def is_eligible(base: str) -> bool:
    return (
        base not in WRIST_VIEW
        and base not in INCOMPLETE
        and 0x100 <= int(base, 16) <= 0x204
    )


def name_root(name: str) -> str | None:
    """Authoritative rootshape from the ISWA name, or None when keyword-less."""
    n = name.lower()
    if "angle" in n:
        return "Angle"
    if "hinge" in n:
        return "Hinge"
    if "cup" in n:
        return "Cup"
    if "circle" in n:
        return "Circle"
    if "oval" in n or any(k in n for k in ("claw", "hook", "curlicue", "curve")):
        return None
    if "four fingers" in n:
        return "Flat Thumb Across"
    if "five fingers" in n or "flat" in n:
        return "Flat"
    # A bare "spread" (e.g. "Index Middle Up Spread") only means the raised
    # fingers fan apart — the base is still a Tight Fist.
    return "Tight Fist"


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


def coverage(base_mask: np.ndarray, root_mask: np.ndarray) -> float:
    total = root_mask.sum()
    if total == 0:
        return 0.0
    best = 0.0
    for dy in SHIFT:
        for dx in SHIFT:
            shifted = np.roll(np.roll(root_mask, dy, 0), dx, 1)
            best = max(best, (shifted & base_mask).sum() / total)
    return round(float(best), 3)


def conv_scores(base: str, root_masks: dict[str, np.ndarray]) -> dict[str, float]:
    base_mask = render_mask(f"S{base}00")
    return {name: coverage(base_mask, mask) for name, mask in root_masks.items()}


def ask_llm(bases: list[tuple[str, str, dict[str, float]]]) -> dict[str, str]:
    """One batched claude -p call mapping keyword-less names to a rootshape."""
    defs = "\n".join(f"- {name}: {desc}" for name, _, desc in ROOT_DEFS)
    rows = []
    for base, name, scores in bases:
        top = sorted(scores.items(), key=lambda kv: -kv[1])[:3]
        hint = ", ".join(f"{n} {v}" for n, v in top)
        rows.append(f'{base}\t{name}\t(glyph-overlap hint: {hint})')
    listing = "\n".join(rows)
    prompt = f"""You are an expert in Valerie Sutton's SignWriting. Each ISWA hand \
symbol is built on exactly one of seven rootshapes:
{defs}

Assign the single best rootshape to each handshape below. The third column is a \
weak glyph-overlap hint (higher = more contained); use it only to break ties. \
Reply with ONLY a JSON object mapping the 3-hex base to the exact rootshape name \
(one of: {", ".join(ROOT_NAMES)}). No prose.

{listing}"""
    proc = subprocess.run(
        ["claude", "-p", prompt], capture_output=True, text=True, timeout=600
    )
    if proc.returncode != 0:
        raise RuntimeError(f"claude -p failed: {proc.stderr[:300]}")
    match = re.search(r"\{.*\}", proc.stdout, re.S)
    if not match:
        raise RuntimeError(f"no JSON in claude output: {proc.stdout[:300]}")
    raw = json.loads(match.group(0))
    result = {}
    for base, root in raw.items():
        if root not in ROOT_NAMES:
            raise RuntimeError(f"claude returned unknown rootshape {root!r} for {base}")
        result[base] = root
    return result


FALLBACK = {  # deterministic resolution for keyword-less names, --no-llm
    "oval": "Circle",
    "curlicue": "Circle",
    "claw": "Cup",
    "hook": "Cup",
    "curve": "Cup",
}


def fallback_root(name: str) -> str:
    n = name.lower()
    for keyword, root in FALLBACK.items():
        if keyword in n:
            return root
    return "Cup"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="re-ask the LLM for cached bases")
    parser.add_argument("--no-llm", action="store_true", help="skip claude, use the deterministic fallback")
    args = parser.parse_args()

    names = load_names()
    bases = [b for b in names if is_eligible(b)]
    bases.sort(key=lambda b: int(b, 16))

    print(f"rendering {len(ROOT_DEFS)} rootshape references…", file=sys.stderr)
    root_masks = {name: render_mask(key) for name, key, _ in ROOT_DEFS}

    print(f"classifying {len(bases)} bases by name + convolution…", file=sys.stderr)
    scores = {b: conv_scores(b, root_masks) for b in bases}

    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}

    mapping: dict[str, str] = {}
    sources: dict[str, str] = {}
    pending: list[tuple[str, str, dict[str, float]]] = []
    for b in bases:
        root = name_root(names[b])
        if root is not None:
            mapping[b] = root
            sources[b] = "name"
        elif not args.force and b in cache:
            mapping[b] = cache[b]
            sources[b] = "llm-cached"
        else:
            pending.append((b, names[b], scores[b]))

    if pending:
        if args.no_llm:
            for b, name, _ in pending:
                mapping[b] = fallback_root(name)
                sources[b] = "fallback"
        else:
            print(f"asking claude -p to resolve {len(pending)} keyword-less names…", file=sys.stderr)
            resolved = ask_llm(pending)
            for b, name, _ in pending:
                root = resolved.get(b) or fallback_root(name)
                mapping[b] = root
                sources[b] = "llm" if b in resolved else "fallback"
                cache[b] = root
            CACHE.write_text(json.dumps(cache, indent=2, ensure_ascii=False) + "\n")

    OUT.write_text(
        json.dumps(
            {"roots": ROOT_NAMES, "bases": {b: mapping[b] for b in bases}},
            indent=2,
            ensure_ascii=False,
        )
        + "\n"
    )
    DEBUG_OUT.write_text(
        json.dumps(
            {b: {"name": names[b], "source": sources[b], "scores": scores[b]} for b in bases},
            indent=2,
            ensure_ascii=False,
        )
        + "\n"
    )

    counts: dict[str, int] = {}
    src_counts: dict[str, int] = {}
    for b in bases:
        counts[mapping[b]] = counts.get(mapping[b], 0) + 1
        src_counts[sources[b]] = src_counts.get(sources[b], 0) + 1
    print(f"\nwrote {OUT.relative_to(ROOT)} ({len(bases)} bases)")
    print("by rootshape:", dict(sorted(counts.items(), key=lambda kv: -kv[1])))
    print("by source:   ", src_counts)


if __name__ == "__main__":
    main()
