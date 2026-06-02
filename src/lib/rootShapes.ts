import { convert } from "@sutton-signwriting/core";
import rootOf from "../content/rootshapes.json";

export type RootShape = { name: string; swu: string };

/** The ten rootshapes, in the order the book introduces them. */
export const ROOT_SHAPES: RootShape[] = [
  { name: "Tight Fist", swu: "񆄡" },
  { name: "Circle", swu: "񂱁" },
  { name: "Oval", swu: "񂲡" },
  { name: "Curlicue", swu: "񂯡" },
  { name: "Cup", swu: "񂣡" },
  { name: "Hinge", swu: "񂻡" },
  { name: "Angle", swu: "񃇡" },
  { name: "Flat Thumb Across", swu: "񁪡" },
  { name: "Flat", swu: "񂇁" },
  { name: "Flat Heel", swu: "񂊑" },
];

const NAME_BY_SWU = new Map(ROOT_SHAPES.map((r) => [r.swu, r.name]));

// Hand-curated map: a handshape symbol (default fill/rotation) → its rootshape
// symbol. The single source of truth — see src/content/rootshapes.json.
const ROOT_OF = rootOf as Record<string, string>;

/** Every handshape symbol that has a rootshape (the practice pool). */
export const PRACTICE_SYMBOLS: string[] = Object.keys(ROOT_OF);

export function rootSymbolFor(symbol: string): string | undefined {
  return ROOT_OF[symbol];
}

export function rootNameFor(symbol: string): string | undefined {
  const root = ROOT_OF[symbol];
  return root ? NAME_BY_SWU.get(root) : undefined;
}

/** The rootshape (symbol + name) for any hand symbol key (SXXXFR), or undefined. */
export function rootForKey(key: string): RootShape | undefined {
  if (key.length !== 6 || key[0] !== "S") return undefined;
  const swu = convert.key2swu(`S${key.slice(1, 4)}00`);
  const rootSwu = ROOT_OF[swu];
  const name = rootSwu ? NAME_BY_SWU.get(rootSwu) : undefined;
  return rootSwu && name ? { name, swu: rootSwu } : undefined;
}

const SYMBOLS_BY_ROOT: Record<string, string[]> = {};
for (const [symbol, root] of Object.entries(ROOT_OF)) {
  (SYMBOLS_BY_ROOT[root] ??= []).push(symbol);
}

/**
 * Sample uniformly over rootshapes (not over handshapes), so a rare rootshape
 * like Flat Thumb Across appears as often as Tight Fist. Picks a random
 * rootshape, then a random handshape within it.
 */
export function randomPracticeSymbol(exclude?: string): string {
  const roots = ROOT_SHAPES.map((r) => r.swu).filter(
    (swu) => (SYMBOLS_BY_ROOT[swu]?.length ?? 0) > 0,
  );
  const root = roots[Math.floor(Math.random() * roots.length)]!;
  let pool = SYMBOLS_BY_ROOT[root]!;
  if (exclude && pool.length > 1) pool = pool.filter((s) => s !== exclude);
  return pool[Math.floor(Math.random() * pool.length)]!;
}
