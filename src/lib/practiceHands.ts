import { convert } from "@sutton-signwriting/core";
import { BASE_SYMBOL_NAMES } from "./baseSymbolNames";
import { handImageForKey, WRIST_VIEW_BASES } from "./handImage";

const FILLS_PER_BASE = 6;

// Hand bases that lack the full set of six orientation photos and so can't seed
// a six-way matching round. "15b" (Flat, Between Palm Facings) only ships four.
const INCOMPLETE_BASES = new Set(["15b"]);

export type PracticePair = {
  fill: number;
  key: string;
  swu: string;
  photo: string;
};

/**
 * A base is practice-eligible when it's a hand symbol (symid `01-…`, so it has
 * photos), has all six orientation photos, and isn't one of the seven Wrist
 * View bases (which vary by rotation, not fill — the six-orientation game
 * doesn't apply to them).
 */
export function isPracticeBase(base: string): boolean {
  const b = base.toLowerCase();
  if (WRIST_VIEW_BASES.has(b) || INCOMPLETE_BASES.has(b)) return false;
  return handImageForKey(`S${b}00`) !== null;
}

export const PRACTICE_BASES: string[] =
  Object.keys(BASE_SYMBOL_NAMES).filter(isPracticeBase);

export function randomPracticeBase(exclude?: string): string {
  const pool = exclude
    ? PRACTICE_BASES.filter((b) => b !== exclude)
    : PRACTICE_BASES;
  const source = pool.length > 0 ? pool : PRACTICE_BASES;
  return source[Math.floor(Math.random() * source.length)] ?? PRACTICE_BASES[0]!;
}

/** The six fill variants of a base at rotation 0, each with its photo. */
export function practicePairs(base: string): PracticePair[] {
  return Array.from({ length: FILLS_PER_BASE }, (_, fill) => {
    const key = `S${base.toLowerCase()}${fill}0`;
    return { fill, key, swu: convert.key2swu(key), photo: handImageForKey(key)! };
  });
}

export function shuffle<T>(items: readonly T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = a;
  }
  return arr;
}
