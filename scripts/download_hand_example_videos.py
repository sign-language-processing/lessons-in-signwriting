#!/usr/bin/env python3
"""Download and center-crop the whatsthatsign videos chosen by
build_hand_examples.py into public/videos/whatsthatsign/<slug>/<slug>.mp4.

For every selected pick it:
  1. downloads gs://sign-external-datasets/whatsthatsign/<file> to a temp dir,
  2. center-crops the 1280x720 source to a 720x720 square,
  3. writes <slug>.mp4 (H.264, faststart, no audio) under the public dir.

The slug is the first listed word, lowercased with spaces -> hyphens, matching
the `video` paths referenced from src/lib/handGroups.ts. Requires gsutil and
ffmpeg on PATH.
"""
import os, subprocess, sys, tempfile

from build_hand_examples import load_rows, select

GS_PREFIX = "gs://sign-external-datasets/whatsthatsign"
HERE = os.path.dirname(os.path.abspath(__file__))
DEST_BASE = os.path.normpath(os.path.join(HERE, "..", "public", "videos", "whatsthatsign"))


def slugify(word):
    return word.lower().replace(" ", "-")


def crop(src, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", src,
        "-vf", "crop=720:720:280:0",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
        dest,
    ], check=True)


def download_and_crop(file, slug, raw_dir, skip_existing=True):
    """Download gs://.../<file>, center-crop to <slug>/<slug>.mp4, return its
    public path. Skips the download+crop when the output already exists."""
    dest = os.path.join(DEST_BASE, slug, f"{slug}.mp4")
    if not (skip_existing and os.path.exists(dest)):
        local = os.path.join(raw_dir, os.path.basename(file))
        subprocess.run(["gsutil", "-q", "cp", f"{GS_PREFIX}/{file}", local], check=True)
        crop(local, dest)
    return f"/videos/whatsthatsign/{slug}/{slug}.mp4"


def main():
    picks = [p for group in select(load_rows()).values() for p in group if p]
    with tempfile.TemporaryDirectory() as raw:
        for pick in picks:
            slug = slugify(pick["word"])
            print(f"  {slug:20s} <- {pick['file']}")
            download_and_crop(pick["file"], slug, raw, skip_existing=False)
    print(f"Done. {len(picks)} videos under {DEST_BASE}")


if __name__ == "__main__":
    sys.exit(main())
