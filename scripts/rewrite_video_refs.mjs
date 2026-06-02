#!/usr/bin/env bun
// Repoint every whatsthatsign video reference at its signbox-FSW filename, the
// file the sign maps to — so references follow the signwriting, not an
// arbitrary slug. Walks src/content/*.json and src/lib/handGroups.ts, computes
// each entry's signbox FSW from its stored swu/sign, and string-replaces the
// old /videos/whatsthatsign/<slug>/<slug>.mp4 path with
// /videos/whatsthatsign/<signbox-fsw>.mp4.
//
// Dry-run by default; pass --apply to write. Reports any reference whose target
// clip is not in the bucket (those are re-encoded from the existing local clip
// by rewire_local_clips, below).
import fs from "node:fs";
import path from "node:path";
import { canonFromSwu, loadIndex } from "./whatsthatsign_lib.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.join(HERE, "..");
const CONTENT = path.join(ROOT, "src", "content");
const HANDGROUPS = path.join(ROOT, "src", "lib", "handGroups.ts");
const PREFIX = "/videos/whatsthatsign/";

const apply = process.argv.includes("--apply");
const bucketCanon = new Set(loadIndex().map((e) => e.canon));

function collectRefs() {
  const refs = [];
  for (const f of fs.readdirSync(CONTENT)) {
    if (!f.endsWith(".json")) continue;
    const file = path.join(CONTENT, f);
    const stack = [JSON.parse(fs.readFileSync(file, "utf8"))];
    while (stack.length) {
      const o = stack.pop();
      if (Array.isArray(o)) {
        stack.push(...o);
        continue;
      }
      if (o && typeof o === "object") {
        for (const [key, value] of Object.entries(o)) {
          if (typeof value === "string" && value.startsWith(PREFIX)) {
            // Either { video, swu/sign } objects, or { <swu>: <path> } maps
            // where the property key is itself the sign.
            refs.push({ video: value, sign: o.swu ?? o.sign ?? key });
          }
        }
        stack.push(...Object.values(o));
      }
    }
  }
  const hg = fs.readFileSync(HANDGROUPS, "utf8");
  const re =
    /sign:\s*"([^"]*)",\s*video:\s*"(\/videos\/whatsthatsign\/[^"]*)"/g;
  let m;
  while ((m = re.exec(hg))) refs.push({ video: m[2], sign: m[1] });
  return refs;
}

function buildMap(refs) {
  const map = new Map();
  const missing = [];
  for (const ref of refs) {
    if (!ref.sign) {
      console.warn(`  no sign for ${ref.video}`);
      continue;
    }
    const canon = canonFromSwu(ref.sign);
    map.set(ref.video, `${PREFIX}${canon}.mp4`);
    if (!bucketCanon.has(canon)) missing.push({ ...ref, canon });
  }
  return { map, missing };
}

function rewriteFiles(map) {
  const files = [
    HANDGROUPS,
    ...fs
      .readdirSync(CONTENT)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(CONTENT, f)),
  ];
  const byLength = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const file of files) {
    let text = fs.readFileSync(file, "utf8");
    let changed = 0;
    for (const [oldPath, newPath] of byLength) {
      const needle = `"${oldPath}"`;
      if (text.includes(needle)) {
        text = text.split(needle).join(`"${newPath}"`);
        changed++;
      }
    }
    if (changed && apply) fs.writeFileSync(file, text);
    if (changed) console.log(`  ${path.basename(file)}: ${changed} paths`);
  }
}

const refs = collectRefs();
const { map, missing } = buildMap(refs);
console.log(`${refs.length} refs · ${map.size} distinct old paths`);
console.log(`\n${missing.length} not in bucket (re-encode locally):`);
for (const m of missing) console.log(`  ${m.video}\n    -> ${PREFIX}${m.canon}.mp4`);
console.log(`\n${apply ? "Applying" : "Dry run"} rewrites:`);
rewriteFiles(map);
if (!apply) console.log("\n(dry run — pass --apply to write)");
