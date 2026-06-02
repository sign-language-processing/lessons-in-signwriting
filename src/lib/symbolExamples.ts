import { fsw2swu } from "@sutton-signwriting/core/convert";
import examples from "../content/symbol-examples.generated.json";
import { symbolToKey } from "./handImage";

const EXAMPLES = examples as Record<string, string>;

export type SymbolExample = {
  /** The example sign as SWU, for <sgnw-sign>. */
  sign: string;
  /** Its whatsthatsign clip, named by signbox FSW. */
  video: string;
};

/**
 * An example dictionary sign containing the given symbol, or null. Prefers an
 * exact match (base + fill + rotation), then base + fill, then base alone — so
 * the example always demonstrates the symbol even when the precise variant has
 * no sign in the dataset.
 */
export function exampleForSymbol(symbol: string): SymbolExample | null {
  const key = symbolToKey(symbol);
  if (!key || key.length !== 6 || key[0] !== "S") return null;
  const fsw =
    EXAMPLES[key] ?? EXAMPLES[key.slice(0, 5)] ?? EXAMPLES[key.slice(0, 4)];
  if (!fsw) return null;
  return { sign: fsw2swu(fsw), video: `/videos/whatsthatsign/${fsw}.mp4` };
}
