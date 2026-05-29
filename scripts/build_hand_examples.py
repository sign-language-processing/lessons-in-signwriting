#!/usr/bin/env python3
"""Select 6 example signs per hand group, one per fill (0..5), from the
whatsthatsign index.

Reads scripts/whatsthatsign_index.csv (a copy of the original dataset index)
and, for each of the 10 hand groups, picks one sign per fill value 0..5.
Preference order per fill: the group's root base at rotation 0, then the root
at any rotation, then any other base in the group at rotation 0, then any other
base in the group. Within a tier, candidates are biased toward short, simple,
single lowercase words (no digits/punctuation, one hand base, fewer symbols).

Prints a JSON object keyed by group number; each value is a list of 6 picks
(or null when the dataset has no sign with that fill for the group). Each pick
carries `word`, `file` (the dataset-relative video path), and `fsw`. Feed the
output into the download/crop step and convert `fsw` -> SWU for handGroups.ts.
"""
import csv, json, os, re

S_RE = re.compile(r'S([0-9a-f]{3})([0-5])([0-9a-f])')

GROUP_BASES = {
    1: ['100','101','102','103','104','105','106','107','108','109','10a','10b','10c','10d'],
    2: ['10e','10f','110','111','112','113','114','115','116','117','118','119','11a','11b','11c','11d'],
    3: ['11e','11f','120','121','122','123','124','125','126','127','128','129','12a','12b','12c','12d','12e','12f','130','131','132','133','134','135','136','137','138','139','13a','13b','13c','13d','13e','13f','140','141','142','143'],
    4: ['144','145','146','147','148','149','14a','14b'],
    5: ['14c','14d','14e','14f','150','151','152','153','154','155','156','157','158','159','15a','15b','15c','15d','15e','15f','160','161','162','163','164','165','166','167','168','169','16a','16b','16c','16d','16e','16f','170','171','172','173','174','175','176','177','178','179','17a','17b','17c','17d','17e','17f','180','181','182','183','184','185'],
    6: ['186','187','188','189','18a','18b','18c','18d','18e','18f','190','191','192','193','194','195','196','197','198','199','19a','19b','19c','19d','19e','19f','1a0','1a1','1a2','1a3','1a4','1a5','1a6','1a7','1a8','1a9','1aa'],
    7: ['1ab','1ac','1ad','1ae','1af','1b0','1b1','1b2','1b3','1b4','1b5','1b6','1b7','1b8','1b9','1ba','1bb','1bc','1bd','1be','1bf','1c0','1c1','1c2','1c3'],
    8: ['1c4','1c5','1c6','1c7','1c8','1c9','1ca','1cb','1cc','1cd','1ce','1cf','1d0','1d1','1d2','1d3','1d4','1d5','1d6','1d7','1d8','1d9','1da'],
    9: ['1db','1dc','1dd','1de','1df','1e0','1e1','1e2','1e3','1e4','1e5','1e6','1e7','1e8','1e9','1ea','1eb','1ec','1ed','1ee','1ef','1f0','1f1','1f2','1f3','1f4'],
    10: ['1f5','1f6','1f7','1f8','1f9','1fa','1fb','1fc','1fd','1fe','1ff','200','201','202','203','204'],
}

HAND_LO, HAND_HI = 0x100, 0x204
USED = {'one-half','deaf','where','happen','you','dinner','dating','dessert','doctor'}

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, 'whatsthatsign_index.csv')


def first_text(text):
    return text.split(',')[0].strip()


def quality(text, hands, group_set):
    """Lower is better. Biased toward simple, single, lowercase common words."""
    first = first_text(text)
    has_digit = any(c.isdigit() for c in first)
    has_punct = any(c in "&,;:!?$/()'\".-" for c in first)
    n_words = len(first.split())
    has_upper = first[:1].isupper() if first else False
    length = len(first)
    n_hands = len(hands)
    out_of_group = sum(1 for s in hands if s[0] not in group_set)
    distinct_bases = len(set(s[0] for s in hands))
    return (
        out_of_group,
        2 * has_digit + has_punct,
        max(0, n_words - 1),
        distinct_bases - 1,
        n_hands,
        has_upper,
        length,
    )


def load_rows():
    rows = []
    with open(CSV_PATH, newline='') as f:
        for row in csv.DictReader(f):
            ex = json.loads(row['extra']) if row['extra'] else {}
            fsw = ex.get('sign_fsw', '')
            if not fsw:
                continue
            syms = [(int(b, 16), int(fi, 16), int(ro, 16)) for (b, fi, ro) in S_RE.findall(fsw)]
            hand_syms = [s for s in syms if HAND_LO <= s[0] <= HAND_HI]
            rows.append({'file': row['file'], 'text': row['text'], 'fsw': fsw, 'hands': hand_syms})
    return rows


def select(rows):
    selected = {}
    for g, bases in GROUP_BASES.items():
        group_set = set(int(b, 16) for b in bases)
        root = int(bases[0], 16)
        picks = []
        used_files = set()
        for fill in range(6):
            candidates = []
            for r in rows:
                if r['file'] in used_files:
                    continue
                slug = first_text(r['text']).lower().replace(' ', '-')
                if slug in USED:
                    continue
                for s in r['hands']:
                    if s[1] != fill:
                        continue
                    base, _, rot = s
                    if base == root:
                        tier = 0 if rot == 0 else 1
                    elif base in group_set:
                        tier = 2 if rot == 0 else 3
                    else:
                        continue
                    candidates.append((tier, quality(r['text'], r['hands'], group_set), r, base, rot))
                    break
            candidates.sort(key=lambda c: (c[0], c[1]))
            if not candidates:
                picks.append(None)
                continue
            tier, q, r, base, rot = candidates[0]
            picks.append({
                'fill': fill, 'tier': tier, 'base': f'{base:03x}', 'rot': rot,
                'word': first_text(r['text']),
                'file': r['file'], 'fsw': r['fsw'],
            })
            used_files.add(r['file'])
        selected[g] = picks
    return selected


if __name__ == '__main__':
    print(json.dumps({str(g): picks for g, picks in select(load_rows()).items()}, indent=2))
