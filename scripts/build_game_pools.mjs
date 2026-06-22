// Precompute the answer→clip pools that drive the "Watch & Name" games.
// Reads the whatsthatsign index, parses each sign's FSW symbols, classifies
// the sign by which closed-set member it uses (contact / handshape group /
// movement plane / movement family), and keeps only clips whose membership is
// UNAMBIGUOUS (exactly one member of the set). Writes
// src/content/game-pools.generated.json — { gameId: { answerKey: signboxFsw[] } }.
//
// Run: bun scripts/build_game_pools.mjs   (needs the index CSV + local clips)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadIndex, signboxFsw } from "./whatsthatsign_lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLIP_DIR = path.join(ROOT, "public/videos/whatsthatsign");
const OUT = path.join(ROOT, "src/content/game-pools.generated.json");
const READING_OUT = path.join(ROOT, "src/content/reading-signs.generated.json");
const PER_ANSWER_CAP = 40;
const READING_CAP = 800;

const localClips = new Set(
  fs.readdirSync(CLIP_DIR).filter((f) => f.endsWith(".mp4")).map((f) => f.slice(0, -4)),
);

function readBaseNames() {
  const src = fs.readFileSync(path.join(ROOT, "src/lib/baseSymbolNames.ts"), "utf8");
  const names = {};
  for (const m of src.matchAll(/"([0-9a-f]{3})":\s*"([^"]+)"/g)) names[m[1]] = m[2];
  return names;
}

function readGroupBases() {
  const src = fs.readFileSync(path.join(ROOT, "src/lib/handGroups.ts"), "utf8");
  const block = src.match(/GROUP_BASES[^=]*=\s*{([\s\S]*?)};/)[1];
  const baseToGroup = {};
  for (const m of block.matchAll(/(\d+):\s*\[([^\]]*)\]/g)) {
    const group = Number(m[1]);
    for (const b of m[2].matchAll(/"([0-9a-f]+)"/g)) baseToGroup[b[1]] = group;
  }
  return baseToGroup;
}

const GROUP_NAMES = {
  1: "Index Finger", 2: "Index & Middle Fingers", 3: "Index, Middle & Thumb",
  4: "Four Fingers", 5: "Five Fingers", 6: "Baby Finger", 7: "Ring Finger",
  8: "Middle Finger", 9: "Index & Thumb", 10: "Thumb",
};

// Contact categories follow the book's six (Touch / Grasp / Strike / Brush /
// Rub / Between). Each verb covers its Single + Multiple base; "Between" covers
// every *-Between base.
const CONTACT = {
  Touch: ["205", "206"], Grasp: ["208", "209"], Strike: ["20b", "20c"],
  Brush: ["20e", "20f"], Rub: ["211", "212"],
  Between: ["207", "20a", "20d", "210", "213"],
};
const CONTACT_OF = {};
for (const [cat, bases] of Object.entries(CONTACT)) for (const b of bases) CONTACT_OF[b] = cat;

const NAMES = readBaseNames();
const BASE_TO_GROUP = readGroupBases();

const isHand = (b) => b >= "100" && b <= "204";
const planeOf = (b) => {
  const n = NAMES[b];
  if (!n) return null;
  if (n.includes("Wall Plane")) return "Wall Plane";
  if (n.includes("Floor Plane")) return "Floor Plane";
  return null;
};
const familyOf = (b) => {
  const n = NAMES[b];
  if (!n) return null;
  if (n.includes("Curve")) return "Curve";
  if (n.includes("Circle")) return "Circle";
  if (n.includes("Rotation")) return "Rotation";
  if (n.includes("Straight")) return "Straight";
  return null;
};

function basesIn(fsw) {
  const out = [];
  for (const m of fsw.matchAll(/S([0-9a-f]{3})[0-9a-f]{2}/g)) out.push(m[1]);
  return out;
}

// Assign a sign to exactly one answer of a dimension, or null if it touches
// zero or more-than-one member (ambiguous → dropped).
function uniqueMember(bases, classify) {
  const hits = new Set();
  for (const b of bases) {
    const k = classify(b);
    if (k) hits.add(k);
  }
  return hits.size === 1 ? [...hits][0] : null;
}

const pools = {
  contact: {}, "handshape-group": {}, "movement-plane": {}, "movement-family": {},
};
const add = (game, key, fsw) => {
  if (!key) return;
  (pools[game][key] ??= []).push(fsw);
};

const index = loadIndex();
const readingSet = new Set();
let kept = 0;
for (const row of index) {
  const fsw = row.fsw ?? row.sign_fsw ?? (row.extra && row.extra.sign_fsw);
  if (!fsw) continue;
  const box = signboxFsw(fsw);
  if (!localClips.has(box)) continue;
  kept++;
  readingSet.add(box);
  const bases = basesIn(fsw);
  add("contact", uniqueMember(bases, (b) => CONTACT_OF[b] ?? null), box);
  add("handshape-group",
    uniqueMember(bases, (b) => (isHand(b) ? GROUP_NAMES[BASE_TO_GROUP[b]] : null)), box);
  add("movement-plane", uniqueMember(bases, planeOf), box);
  add("movement-family", uniqueMember(bases, familyOf), box);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

for (const game of Object.keys(pools)) {
  for (const key of Object.keys(pools[game])) {
    pools[game][key] = shuffle(pools[game][key]).slice(0, PER_ANSWER_CAP);
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(pools, null, 0) + "\n");

const reading = shuffle([...readingSet]).slice(0, READING_CAP);
fs.writeFileSync(READING_OUT, JSON.stringify(reading, null, 0) + "\n");

console.log(`scanned ${index.length} index rows, ${kept} with local clips`);
console.log(`reading pool: ${reading.length} signs`);
for (const game of Object.keys(pools)) {
  const counts = Object.fromEntries(
    Object.entries(pools[game]).map(([k, v]) => [k, v.length]),
  );
  console.log(`\n${game}:`, counts);
}
console.log(`\nwrote ${path.relative(ROOT, OUT)}`);
