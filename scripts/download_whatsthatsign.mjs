#!/usr/bin/env bun
// Download every whatsthatsign clip and process it into
// public/videos/whatsthatsign/<signbox-fsw>.mp4 — the filename IS the sign
// (Formal SignWriting; ASCII, so it survives the filesystem, git, and URLs).
//
//   1. gsutil -m cp the whole bucket into a temp dir (parallel, fast),
//   2. ffmpeg center-crop each 1280x720 source to a 720x720 square,
//   3. write <signbox-swu>.mp4 (H.264, faststart, no audio).
//
// Idempotent: a destination that already exists is skipped, so reruns only
// fetch what's missing. Requires gsutil and ffmpeg on PATH.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadIndex } from "./whatsthatsign_lib.mjs";

const GS_PREFIX = "gs://sign-external-datasets/whatsthatsign";
const HERE = path.dirname(new URL(import.meta.url).pathname);
const DEST = path.join(HERE, "..", "public", "videos", "whatsthatsign");

function crop(src, dest) {
  const r = spawnSync(
    "ffmpeg",
    [
      "-y", "-loglevel", "error", "-i", src,
      "-vf", "crop=720:720:280:0",
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
      dest,
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${src}`);
}

function main() {
  fs.mkdirSync(DEST, { recursive: true });
  const index = loadIndex();
  const pending = index.filter(
    (e) => !fs.existsSync(path.join(DEST, `${e.canon}.mp4`)),
  );
  console.log(`${index.length} clips total · ${pending.length} missing`);
  if (!pending.length) return;

  const raw = fs.mkdtempSync(path.join(os.tmpdir(), "wts-"));
  try {
    const list = pending.map((e) => `${GS_PREFIX}/${e.file}`).join("\n");
    console.log("Downloading from bucket…");
    const cp = spawnSync("gsutil", ["-m", "cp", "-I", raw], {
      input: list,
      stdio: ["pipe", "inherit", "inherit"],
    });
    if (cp.status !== 0) throw new Error("gsutil cp failed");

    console.log("Cropping…");
    let done = 0;
    for (const e of pending) {
      const src = path.join(raw, path.basename(e.file));
      if (!fs.existsSync(src)) {
        console.warn(`  missing download: ${e.file}`);
        continue;
      }
      crop(src, path.join(DEST, `${e.canon}.mp4`));
      if (++done % 100 === 0) console.log(`  ${done}/${pending.length}`);
    }
    console.log(`Done. ${done} clips processed into ${DEST}`);
  } finally {
    fs.rmSync(raw, { recursive: true, force: true });
  }
}

main();
