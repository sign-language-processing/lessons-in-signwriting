import { convert } from "@sutton-signwriting/core";
import rootshapeData from "../content/rootshapes.generated.json";

export type RootShape = { name: string; swu: string };

/** The seven rootshapes, in the order the book introduces them. */
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

const BASES = rootshapeData.bases as Record<string, string>;

/** Hand bases that have a rootshape assignment (the practice-eligible set). */
export const ROOT_SHAPE_BASES: string[] = Object.keys(BASES);

const BASES_BY_ROOT: Record<string, string[]> = {};
for (const [base, root] of Object.entries(BASES)) {
  (BASES_BY_ROOT[root] ??= []).push(base);
}

export function rootShapeForBase(base: string): string | undefined {
  return BASES[base.toLowerCase()];
}

/** The SWU glyph for a base at its default fill/rotation. */
export function baseSymbol(base: string): string {
  return convert.key2swu(`S${base.toLowerCase()}00`);
}

/**
 * Sample uniformly over rootshapes (not over bases), so a rare rootshape like
 * Flat Thumb Across (6 bases) appears as often as Tight Fist (82). Picks a
 * random rootshape, then a random base within it.
 */
export function randomRootShapeBase(exclude?: string): string {
  const roots = ROOT_SHAPES.map((r) => r.name).filter(
    (name) => (BASES_BY_ROOT[name]?.length ?? 0) > 0,
  );
  const root = roots[Math.floor(Math.random() * roots.length)]!;
  let pool = BASES_BY_ROOT[root]!;
  if (exclude && pool.length > 1) pool = pool.filter((b) => b !== exclude);
  return pool[Math.floor(Math.random() * pool.length)]!;
}
