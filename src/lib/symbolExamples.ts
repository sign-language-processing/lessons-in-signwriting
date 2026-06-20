import { fsw2swu } from "@sutton-signwriting/core/convert";
import examples from "../content/symbol-examples.generated.json";
import { symbolToKey } from "./handImage";

const EXAMPLES = examples as Record<string, string>;

export type SymbolExample = {
  /** The example sign as SWU, for <sgnw-sign>. */
  sign: string;
  /** Its whatsthatsign clip, named by signbox FSW. */
  video: string;
  /** True when the example matches the full symbol (base + fill + rotation),
   * false when it's a looser base/fill/rotation-group fallback. */
  exact: boolean;
};

// Forward/Back curve arrows (S2b7–S2d4): an example only demonstrates the
// symbol if its rotation shares the same facing group. Group A = {0,1,2,7},
// B = {3,4,5,6}; 8–f mirror back via `& 7`. Must mirror build_symbol_examples.mjs.
const CURVE_LO = 0x2b7;
const CURVE_HI = 0x2d4;
const ROT_GROUP_A = new Set([0, 1, 2, 7]);

function curveGroupKey(key: string): string | null {
  const base = parseInt(key.slice(1, 4), 16);
  if (base < CURVE_LO || base > CURVE_HI) return null;
  const rot = parseInt(key.slice(5), 16) & 7;
  return `${key.slice(0, 4)}.${ROT_GROUP_A.has(rot) ? "A" : "B"}`;
}

/**
 * An example dictionary sign containing the given symbol, or null. Prefers an
 * exact match (base + fill + rotation), then base + fill, then base alone — so
 * the example always demonstrates the symbol even when the precise variant has
 * no sign in the dataset. Curve arrows (S2b7–S2d4) instead fall back to a
 * rotation-group match, never crossing the facing groups.
 */
export function exampleForSymbol(symbol: string): SymbolExample | null {
  const key = symbolToKey(symbol);
  if (!key || key.length !== 6 || key[0] !== "S") return null;
  const groupKey = curveGroupKey(key);
  const exactFsw = EXAMPLES[key];
  const fsw = groupKey
    ? exactFsw ?? EXAMPLES[groupKey]
    : exactFsw ?? EXAMPLES[key.slice(0, 5)] ?? EXAMPLES[key.slice(0, 4)];
  if (!fsw) return null;
  return {
    sign: fsw2swu(fsw),
    video: `/videos/whatsthatsign/${fsw}.mp4`,
    exact: exactFsw !== undefined,
  };
}
