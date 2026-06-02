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

import base64
import json
import re
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageFont
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
REPORT_OUT = HERE / "rootshapes_report.html"

# name, reference glyph key (fill 0, rotation 0)
ROOT_DEFS = [
    ("Tight Fist", "S20300"),
    ("Circle", "S17600"),
    ("Oval", "S17700"),
    ("Curlicue", "S17500"),
    ("Cup", "S16d00"),
    ("Hinge", "S17d00"),
    ("Angle", "S18500"),
    ("Flat Thumb Across", "S14700"),
    ("Flat", "S15a00"),
]
ROOT_NAMES = [r[0] for r in ROOT_DEFS]

# Rule 2: name-keyword -> rootshape. ISWA names encode the rootshape; Hook and
# Claw are normalized (Hook→Angle, Claw→Hinge). When a name has an "on X"
# suffix, X is the rootshape (e.g. "Index Hinge on Circle" is Circle — the
# "Hinge" only describes the finger), so the suffix is checked before the bare
# keywords.
NAME_KEYWORDS = [
    ("angle", "Angle"),
    ("hinge", "Hinge"),
    ("cup", "Cup"),
    ("circle", "Circle"),
    ("oval", "Oval"),
    ("curlicue", "Curlicue"),
    ("hook", "Angle"),
    ("claw", "Hinge"),
    ("fist", "Tight Fist"),
]
KEYWORD_MAP = dict(NAME_KEYWORDS)

WRIST_VIEW = {"14d", "14f", "151", "15c", "15e", "1f6", "204"}
INCOMPLETE = {"15b"}

# A convolution score at/above this means the base fully contains the rootshape,
# which is treated as definitive (convolution wins even over the name keyword).
CONV_WINS = 0.999


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


_PAD = 10
_SHIFT = range(-6, 7, 2)


def inclusion(base_mask: np.ndarray, root_mask: np.ndarray) -> float:
    """Max |root ∩ base| / |root| with the rootshape anchored at the bottom.

    Rootshapes sit at the bottom of the glyph, so the template is bottom-aligned
    (not free to slide up into the fingers) and tried at both the bottom-left and
    bottom-right of the base, with a small ± tolerance. Returns the best coverage
    — does the base contain the whole rootshape at its base curve?
    """
    total = root_mask.sum()
    if total == 0:
        return 0.0
    bh, bw = base_mask.shape
    rh, rw = root_mask.shape
    h = max(bh, rh) + 2 * _PAD
    w = max(bw, rw) + 2 * _PAD
    base = np.zeros((h, w), bool)
    base_x = _PAD
    base[h - _PAD - bh:h - _PAD, base_x:base_x + bw] = base_mask
    best = 0.0
    for x0 in (base_x, base_x + bw - rw):  # bottom-left, bottom-right anchor
        for dy in _SHIFT:
            for dx in _SHIFT:
                y, x = h - _PAD - rh + dy, x0 + dx
                if y < 0 or x < 0 or y + rh > h or x + rw > w:
                    continue
                placed = np.zeros((h, w), bool)
                placed[y:y + rh, x:x + rw] = root_mask
                cov = (placed & base).sum() / total
                if cov > best:
                    best = cov
    return round(float(best), 3)


def glyph_data_uri(key: str, height: int = 64) -> str:
    """A trimmed PNG data URI of the symbol (black outline, white fill) for HTML."""
    img = signwriting_to_image(
        f"M500x500{key}500x500", trust_box=False, antialiasing=True,
        line_color=(0, 0, 0, 255), fill_color=(255, 255, 255, 255),
    ).convert("RGBA")
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(bg, img).convert("RGB")
    if img.width and img.height:
        img = img.resize((max(1, img.width * height // img.height), height))
    else:
        img = Image.new("RGB", (height, height), (255, 255, 255))
    with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
        img.save(tmp.name, "PNG")
        data = Path(tmp.name).read_bytes()
    return "data:image/png;base64," + base64.b64encode(data).decode()


SOURCE_COLOR = {"convolution": "#fff3cd", "name": "#e7f0ff",
                "conv>name": "#fde2e1", "both": "#e6f6ea"}
SOURCE_LABEL = {"convolution": "convolution (no name keyword)",
                "name": "name keyword", "conv>name": "convolution ≥ threshold",
                "both": "name + convolution agree"}


def write_report(bases, names, debug, root_keys, eligible):
    """One flat table of every hand base, with a per-row rootshape selector.

    Choices persist to localStorage; an Export button logs/copies the full
    {base: rootshape} object reflecting the current selections.
    """
    glyph_cache = {}

    def glyph(key):
        if key not in glyph_cache:
            glyph_cache[key] = glyph_data_uri(key)
        return glyph_cache[key]

    predicted = {}
    rows = []
    for b in bases:
        d = debug[b]
        src = d["source"]
        pred = d["conv"] if src in ("conv>name", "convolution") else d["name_root"]
        predicted[b] = pred
        note = "" if b in eligible else " <small>· not in game</small>"
        options = "".join(
            f'<option{" selected" if r == pred else ""}>{r}</option>'
            for r in ROOT_NAMES
        )
        rows.append(
            f'<tr data-base="{b}" style="background:{SOURCE_COLOR[src]}">'
            f'<td><img src="{glyph(f"S{b}00")}" height="56"></td>'
            f'<td><code>{b}</code></td>'
            f'<td>{names[b]}{note}</td>'
            f'<td><img src="{glyph(root_keys[pred])}" height="40"> <b>{pred}</b></td>'
            f'<td>{SOURCE_LABEL[src]} · conv {d["conv"]} ({d["scores"][d["conv"]]})</td>'
            f'<td><select data-base="{b}">{options}</select></td></tr>'
        )

    script = """
const PREDICTED = %s;
const KEY = "rootshapeChoices";
const stored = JSON.parse(localStorage.getItem(KEY) || "{}");
const choices = {};
for (const b in PREDICTED) choices[b] = stored[b] || PREDICTED[b];

function refreshRow(b) {
  const row = document.querySelector(`tr[data-base="${b}"]`);
  row.classList.toggle("changed", choices[b] !== PREDICTED[b]);
}
function save() { localStorage.setItem(KEY, JSON.stringify(choices)); }
function updateCount() {
  const n = Object.keys(choices).filter(b => choices[b] !== PREDICTED[b]).length;
  document.getElementById("count").textContent = n;
}

for (const sel of document.querySelectorAll("select[data-base]")) {
  const b = sel.dataset.base;
  sel.value = choices[b];
  refreshRow(b);
  sel.addEventListener("change", () => {
    choices[b] = sel.value; save(); refreshRow(b); updateCount();
  });
}
updateCount();

document.getElementById("export").addEventListener("click", async () => {
  const json = JSON.stringify(choices, null, 2);
  console.log(json);
  try { await navigator.clipboard.writeText(json); } catch (e) {}
  document.getElementById("out").textContent = json;
});
document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Reset all selections to the predictions?")) return;
  localStorage.removeItem(KEY);
  for (const b in PREDICTED) choices[b] = PREDICTED[b];
  for (const sel of document.querySelectorAll("select[data-base]")) {
    sel.value = choices[sel.dataset.base]; refreshRow(sel.dataset.base);
  }
  updateCount();
});
""" % json.dumps(predicted, ensure_ascii=False)

    html = (
        "<!doctype html><meta charset=utf-8><title>Rootshape review</title>"
        "<style>body{font:14px system-ui;margin:2rem;max-width:1150px}"
        "table{border-collapse:collapse;width:100%}"
        "td,th{border:1px solid #ddd;padding:6px 10px;text-align:left;vertical-align:middle}"
        "th{background:#f2f2f2;position:sticky;top:0;z-index:1}code{font-size:1.15em}"
        "small{color:#999}tr.changed{outline:3px solid #d33;outline-offset:-3px}"
        "tr.changed td:nth-child(6){font-weight:700}"
        ".bar{position:sticky;top:0;background:#fff;padding:.75rem 0;z-index:2;"
        "border-bottom:1px solid #ddd;margin-bottom:1rem}"
        ".bar button{font:inherit;font-weight:600;padding:.4em 1em;margin-right:.5em;cursor:pointer}"
        "#out{white-space:pre-wrap;background:#f6f8fa;border:1px solid #ddd;border-radius:6px;"
        "padding:1rem;max-height:240px;overflow:auto;margin-top:.5rem}select{font:inherit}</style>"
        f"<h1>Rootshape review — all {len(bases)} hand bases</h1>"
        '<div class="bar"><button id="export">Export (log + copy)</button>'
        '<button id="reset">Reset to predictions</button>'
        '<span><b id="count">0</b> overrides</span><div id="out"></div></div>'
        "<p>Pick the correct rootshape per row; changes save automatically and "
        "survive refresh. Overridden rows get a red outline. Row color = how it was "
        "predicted (yellow convolution-only, blue name, green agree, red conv-over-name).</p>"
        "<table><tr><th>Shape</th><th>Id</th><th>Name</th>"
        "<th>Predicted</th><th>How</th><th>Correct?</th></tr>"
        + "".join(rows) + "</table>"
        f"<script>{script}</script>"
    )
    REPORT_OUT.write_text(html)


def main() -> None:
    names = load_names()
    # Every hand base (100–204), for the review report.
    all_bases = sorted(
        (b for b in names if 0x100 <= int(b, 16) <= 0x204), key=lambda b: int(b, 16)
    )
    # The subset the practice game can quiz (drops wrist-view + photo-less 15b).
    bases = [b for b in all_bases if is_eligible(b)]

    print(f"rendering {len(ROOT_DEFS)} rootshape references…")
    root_masks = {name: render_mask(key) for name, key in ROOT_DEFS}

    print(f"classifying {len(all_bases)} hand bases by convolution + name…")
    mapping: dict[str, str] = {}
    debug: dict[str, dict] = {}
    conv_only: list[dict] = []
    disagreements: list[dict] = []
    conv_over_name: list[dict] = []

    for b in all_bases:
        base_mask = render_mask(f"S{b}00")
        scores = {name: inclusion(base_mask, mask) for name, mask in root_masks.items()}
        conv = max(scores, key=scores.__getitem__)  # rule 1
        conv_score = scores[conv]
        nroot = name_root(names[b])  # rule 2

        if nroot is None:
            # No name signal — trust convolution.
            mapping[b] = conv
            source = "convolution"
        elif conv == nroot:
            mapping[b] = nroot
            source = "both"
        elif conv_score >= CONV_WINS and conv != "Tight Fist":
            # Full containment of a *discriminative* rootshape is definitive and
            # beats the name. Tight Fist is excluded: its square is a sub-shape
            # of most closed hands (52/253 contain it), so a 1.0 there is not
            # evidence of the rootshape — the named finger action is.
            mapping[b] = conv
            source = "conv>name"
        else:
            mapping[b] = nroot
            source = "name"

        debug[b] = {"name": names[b], "name_root": nroot, "conv": conv,
                    "source": source, "scores": scores}
        entry = {"base": b, "name": names[b], "name_root": nroot,
                 "conv": conv, "conv_score": conv_score}
        if source == "name":
            disagreements.append(entry)
        elif source == "conv>name":
            conv_over_name.append(entry)
        elif source == "convolution":
            conv_only.append(entry)

    OUT.write_text(
        json.dumps({"roots": ROOT_NAMES, "bases": {b: mapping[b] for b in bases}},
                   indent=2, ensure_ascii=False) + "\n"
    )
    DEBUG_OUT.write_text(
        json.dumps({"bases": mapping, "conv_only": conv_only,
                    "disagreements": disagreements, "conv_over_name": conv_over_name,
                    "all": debug}, indent=2, ensure_ascii=False) + "\n"
    )
    print(f"writing {REPORT_OUT.name}…")
    write_report(all_bases, names, debug, dict(ROOT_DEFS), set(bases))

    counts: dict[str, int] = {}
    src_counts: dict[str, int] = {}
    for b in bases:
        counts[mapping[b]] = counts.get(mapping[b], 0) + 1
        src_counts[debug[b]["source"]] = src_counts.get(debug[b]["source"], 0) + 1
    print(f"\nmapped {len(bases)} game bases (report covers all {len(all_bases)})")
    print("by rootshape:", dict(sorted(counts.items(), key=lambda kv: -kv[1])))
    print("by source:   ", src_counts, "(both = name keyword confirmed by convolution)")

    print(f"\n--- CONVOLUTION ≥{CONV_WINS} OVERRODE A NAME KEYWORD ({len(conv_over_name)}) ---")
    for u in conv_over_name:
        print(f'  {u["base"]}  {u["name"]:42s}  name said {u["name_root"]:11s} -> conv {u["conv"]} ({u["conv_score"]})')
    print(f"\n--- NAME vs CONVOLUTION DISAGREE, name wins (conv <{CONV_WINS}) ({len(disagreements)}) ---")
    for u in disagreements:
        print(f'  {u["base"]}  {u["name"]:42s}  name={u["name_root"]:11s} conv={u["conv"]} ({u["conv_score"]})')
    print(f"\n--- ASSIGNED BY CONVOLUTION ONLY (no name keyword) ({len(conv_only)}) ---")
    for u in conv_only:
        print(f'  {u["base"]}  {u["name"]:42s}  -> {u["conv"]} ({u["conv_score"]})')


if __name__ == "__main__":
    main()
