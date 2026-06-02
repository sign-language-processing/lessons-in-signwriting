#!/usr/bin/env bun
// Build src/content/symbol-examples.generated.json: a lookup from a SignWriting
// symbol to an example sign in the whatsthatsign dictionary that contains it.
//
// Keyed at three granularities (no cross-tier collision — keys differ in
// length): full symbol "SbbbFR" (6), base+fill "SbbbF" (5), base "Sbbb" (4).
// The value is the example's signbox FSW — both the <sgnw-sign> (via fsw2swu)
// and its clip (/videos/whatsthatsign/<signbox-fsw>.mp4) derive from it.
//
// The chosen example is the cleanest demonstration of the symbol: it minimises,
// in order, (1) the number of OTHER movement arrows in the sign — so a movement
// symbol's example ideally contains only that one arrow and no competing ones,
// (2) total symbol count — the shortest sign, (3) word length.
import { fsw as fswModule } from "@sutton-signwriting/core";
import fs from "node:fs";
import path from "node:path";
import { parseCSV, signboxFsw } from "./whatsthatsign_lib.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CSV = path.join(HERE, "whatsthatsign_index.csv");
const OUT = path.join(HERE, "..", "src", "content", "symbol-examples.generated.json");

// SignWriting "movement" category, as base hex values (e.g. wall/floor-plane
// arrows, curves, circles). From the library's own range table.
const [MOVEMENT_LO, MOVEMENT_HI] = fswModule.ranges.movement;
const baseValue = (key) => parseInt(key.slice(1, 4), 16);
const isMovement = (key) => {
  const v = baseValue(key);
  return v >= MOVEMENT_LO && v <= MOVEMENT_HI;
};

const csv = parseCSV(fs.readFileSync(CSV, "utf8"));
const header = csv[0];
const textIdx = header.indexOf("text");
const extraIdx = header.indexOf("extra");

const best = new Map(); // lookupKey -> { fsw, score }
function consider(key, fsw, score) {
  const cur = best.get(key);
  if (!cur || score < cur.score) best.set(key, { fsw, score });
}

for (let r = 1; r < csv.length; r++) {
  const fsw = signboxFsw(JSON.parse(csv[r][extraIdx]).sign_fsw);
  const word = (csv[r][textIdx] || "").split(",")[0].trim();
  const symbols = fsw.match(/S[0-9a-f]{5}/g) || [];
  const movementBases = symbols.filter(isMovement).map((k) => k.slice(0, 4));
  for (const key of symbols) {
    const targetBase = key.slice(0, 4);
    const otherArrows = movementBases.filter((b) => b !== targetBase).length;
    const score = otherArrows * 1e6 + symbols.length * 1e3 + word.length;
    consider(key, fsw, score); // full SbbbFR
    consider(key.slice(0, 5), fsw, score); // base + fill
    consider(key.slice(0, 4), fsw, score); // base
  }
}

const out = {};
for (const key of [...best.keys()].sort()) out[key] = best.get(key).fsw;
fs.writeFileSync(OUT, JSON.stringify(out, null, 0) + "\n");
console.log(`${Object.keys(out).length} symbol keys → ${path.relative(process.cwd(), OUT)}`);
