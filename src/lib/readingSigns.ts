import { convert } from "@sutton-signwriting/core";
import { shuffle } from "./practiceHands";
import signsJson from "../content/reading-signs.generated.json";

// Signbox FSW for every sign with a local clip — the filename is the FSW.
const SIGNS = signsJson as string[];

const OPTIONS = 4;

export type ReadingRound = { answer: string; options: string[] };

export function readingClip(fsw: string): string {
  return `/videos/whatsthatsign/${fsw}.mp4`;
}

export function readingSwu(fsw: string): string {
  return convert.fsw2swu(fsw);
}

export function randomReadingRound(signs: string[] = SIGNS, exclude?: string): ReadingRound {
  const pickFrom = exclude && signs.length > 1 ? signs.filter((s) => s !== exclude) : signs;
  const answer = pickFrom[Math.floor(Math.random() * pickFrom.length)]!;
  const distractors = shuffle(signs.filter((s) => s !== answer)).slice(0, OPTIONS - 1);
  return { answer, options: shuffle([answer, ...distractors]) };
}
