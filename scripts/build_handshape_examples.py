#!/usr/bin/env python3
"""Select the example signs for chapter 3's "Directed Towards the Face" and
"Directed Up" sections from the whatsthatsign index.

Each section in the book shows a collage of example signs. We render them live
instead. The book's word lists drive the selection; any word missing from the
dataset is replaced by another sign that meets the section's structural rule:

  toFace: a face symbol (S2ff-S336) is present AND a fill-0 hand whose base is
          an Angle / Hinge / Cup / Curve handshape.
  toUp:   a fill-4 hand whose base is an Angle / Hinge / Cup / Curve handshape.

Handshape families are read by name from src/lib/baseSymbolNames.ts (any hand
base whose name contains Angle/Hinge/Cup/Curve). FSW is converted to SWU via the
project's @sutton-signwriting/core, and the result written to
src/content/handshape-examples.generated.json (imported by HandshapeExamples).
"""
import csv, json, os, re, subprocess, tempfile

from download_hand_example_videos import download_and_crop, slugify

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, "whatsthatsign_index.csv")
NAMES_PATH = os.path.join(HERE, "..", "src", "lib", "baseSymbolNames.ts")
OUT_PATH = os.path.join(HERE, "..", "src", "content", "handshape-examples.generated.json")
PROJECT_DIR = os.path.normpath(os.path.join(HERE, ".."))

FACE_LO, FACE_HI = 0x2ff, 0x336
HAND_LO, HAND_HI = 0x100, 0x204

S_RE = re.compile(r"S([0-9a-f]{3})([0-5])([0-9a-f])")
SHAPE_RE = re.compile(r"\b(cup|hinge|angle|curve)\b", re.I)

FACE_WORDS = ["glass", "oral", "no-to-me", "wolf", "information", "Jew", "clown",
              "going out", "illness", "lucky", "prefer", "birthday", "eat", "blow a kiss"]
UP_WORDS = ["Jewish", "grow", "soft", "poor", "dissolve"]


def load_shape_bases():
    bases = set()
    with open(NAMES_PATH) as f:
        for line in f:
            m = re.match(r'\s*"([0-9a-f]{3})":\s*"(.*)",?\s*$', line)
            if m and SHAPE_RE.search(m.group(2)) and HAND_LO <= int(m.group(1), 16) <= HAND_HI:
                bases.add(m.group(1))
    return bases


def parse(fsw):
    return [(b, int(fi, 16), int(ro, 16)) for (b, fi, ro) in S_RE.findall(fsw)]


def load_rows():
    rows = []
    with open(CSV_PATH, newline="") as f:
        for row in csv.DictReader(f):
            ex = json.loads(row["extra"]) if row["extra"] else {}
            fsw = ex.get("sign_fsw", "")
            if not fsw:
                continue
            syns = [s.strip().lower() for s in row["text"].split(",")]
            rows.append({"file": row["file"], "first": syns[0], "syns": syns,
                         "fsw": fsw, "syms": parse(fsw)})
    return rows


def simple_score(r):
    first = r["first"]
    return (any(c.isdigit() for c in first), len(first.split()), len(first))


def build_set(rows, shape_bases, words, predicate):
    by_syn = {}
    for r in rows:
        for s in r["syns"]:
            by_syn.setdefault(s, r)

    used_files, used_words, picks, missing = set(), set(), [], []
    for w in words:
        r = by_syn.get(w.strip().lower())
        if r:
            picks.append({"word": w, "fsw": r["fsw"], "file": r["file"]})
            used_files.add(r["file"]); used_words.add(r["first"])
        else:
            missing.append(w)

    candidates = sorted(
        (r for r in rows if r["file"] not in used_files
         and r["first"] not in used_words and predicate(r["syms"], shape_bases)),
        key=simple_score,
    )
    seen = set()
    for r in candidates:
        if len(picks) >= len(words) or r["first"] in seen:
            continue
        seen.add(r["first"])
        picks.append({"word": r["first"], "fsw": r["fsw"], "file": r["file"]})
    return picks


def to_face(syms, shape_bases):
    has_face = any(FACE_LO <= int(b, 16) <= FACE_HI for (b, _, _) in syms)
    return has_face and any(b in shape_bases and fi == 0 for (b, fi, _) in syms)


def to_up(syms, shape_bases):
    return any(b in shape_bases and fi == 4 for (b, fi, _) in syms)


def fsw_to_swu(fsws):
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


def main():
    rows = load_rows()
    shape_bases = load_shape_bases()
    face = build_set(rows, shape_bases, FACE_WORDS, to_face)
    up = build_set(rows, shape_bases, UP_WORDS, to_up)

    picks = face + up
    swu = fsw_to_swu([p["fsw"] for p in picks])
    with tempfile.TemporaryDirectory() as raw:
        for p, s in zip(picks, swu):
            slug = slugify(p["word"])
            print(f"  {slug:20s} <- {p['file']}")
            p["video"] = download_and_crop(p["file"], slug, raw)
            p["swu"] = s
            del p["fsw"], p["file"]

    data = {"toFace": face, "toUp": up}
    with open(OUT_PATH, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Wrote {len(face)} + {len(up)} signs to {os.path.relpath(OUT_PATH, PROJECT_DIR)}")


if __name__ == "__main__":
    main()
