import { BASE_SYMBOL_NAMES } from "./baseSymbolNames";
import { shuffle } from "./practiceHands";
import { STRAIGHT_MOVEMENT_SIGNS } from "./watchGames";
import type { ReadingRound } from "./readingSigns";

// A movement arrow is a Wall/Floor-plane movement symbol. The "Read the
// Movement" game keeps the whole sign fixed and only rotates this arrow, so the
// four options differ solely in the direction the hand moves.
const isArrow = (base: string): boolean => {
  const n = BASE_SYMBOL_NAMES[base];
  return !!n && (n.includes("Wall Plane") || n.includes("Floor Plane"));
};

const TOKEN = /S([0-9a-f]{3})[0-9a-f][0-9a-f]\d+x\d+/g;
const ROTS = "0123456789abcdef".split("");

/** Index (in `fsw`) of the rotation hex of the first movement-arrow symbol. */
function arrowRotIndex(fsw: string): number | null {
  for (const m of fsw.matchAll(TOKEN)) {
    if (isArrow(m[1]!)) return m.index! + 5; // S + 3 base + 1 fill → rotation char
  }
  return null;
}

const withRot = (fsw: string, idx: number, rot: string) =>
  fsw.slice(0, idx) + rot + fsw.slice(idx + 1);

export function randomMovementRound(prev?: string): ReadingRound {
  const pool =
    prev && STRAIGHT_MOVEMENT_SIGNS.length > 1
      ? STRAIGHT_MOVEMENT_SIGNS.filter((s) => s !== prev)
      : STRAIGHT_MOVEMENT_SIGNS;

  for (const answer of shuffle(pool)) {
    const idx = arrowRotIndex(answer);
    if (idx === null) continue;
    const rots = shuffle(ROTS.filter((r) => r !== answer[idx])).slice(0, 3);
    const distractors = rots.map((r) => withRot(answer, idx, r));
    return { answer, options: shuffle([answer, ...distractors]) };
  }
  // Fallback: no rotatable arrow found — pick a sign and reuse it (rare).
  const answer = pool[0]!;
  return { answer, options: [answer] };
}
