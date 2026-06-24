import { convert } from "@sutton-signwriting/core";
import { handImageForKey } from "./handImage";
import { PRACTICE_BASES } from "./practiceHands";

// SignWriting fill encodes palm facing: 0 = palm (white/hollow), 1 = side
// (half), 2 = back (filled). The book teaches exactly this trichotomy in Ch2.
export const ORIENTATIONS = [
  { fill: 0, name: "Palm" },
  { fill: 1, name: "Side" },
  { fill: 2, name: "Back" },
] as const;

export type OrientationOption = { fill: number; name: string; symbol: string };
export type OrientationRound = {
  base: string;
  fill: number;
  photo: string;
  options: OrientationOption[];
};

// Practice-eligible hands that have palm/side/back photos (fills 0–2).
const BASES = PRACTICE_BASES.filter((b) =>
  ORIENTATIONS.every((o) => handImageForKey(`S${b}${o.fill}0`)),
);

export function randomOrientationRound(prevBase?: string): OrientationRound {
  let pool = prevBase && BASES.length > 1 ? BASES.filter((b) => b !== prevBase) : BASES;
  const base = pool[Math.floor(Math.random() * pool.length)]!;
  const fill = Math.floor(Math.random() * ORIENTATIONS.length);
  const options = ORIENTATIONS.map((o) => ({
    fill: o.fill,
    name: o.name,
    symbol: convert.key2swu(`S${base}${o.fill}0`),
  }));
  return { base, fill, photo: handImageForKey(`S${base}${fill}0`)!, options };
}
