import { convert } from "@sutton-signwriting/core";

const HAND_PHOTOS_PER_BASE = 6;

/**
 * Heel-of-hand "Wrist View" bases (the 7 in the grid) that exist only at fill 1
 * and vary by rotation instead. Their hover/dialog photos are rotation-indexed,
 * and their symbol-variants dialog shows just that single fill.
 */
export const WRIST_VIEW_BASES = new Set([
  "14d",
  "14f",
  "151",
  "15c",
  "15e",
  "1f6",
  "204",
]);

/** True for keys whose base is a fill-1-only Wrist View base. */
export function isWristViewKey(key: string): boolean {
  return WRIST_VIEW_BASES.has(key.slice(1, 4));
}

/**
 * For a SignWriting symbol character, return the path to its corresponding
 * 3d-hands-benchmark photo, or null if the symbol is not in the Hands
 * category (the dataset only covers category 01).
 *
 * The 3d-hands-benchmark filenames are `CC-GG-BBB-VV-FF.png` — the rotation
 * segment of the symid is dropped because each photo set is one canonical
 * pose. All rotations of the same base+fill therefore resolve to the same
 * photo.
 */
export function handImageFor(symbol: string): string | null {
  const key = symbolToKey(symbol);
  return key ? handImageForKey(key) : null;
}

export function handImageForKey(key: string): string | null {
  let symid: string;
  try {
    symid = convert.key2symid(key);
  } catch {
    return null;
  }
  if (!symid || !symid.startsWith("01-")) return null;
  const parts = symid.split("-");
  if (parts.length < 5) return null;
  const [cc, gg, bbb, vv, ff] = parts;
  return `/hands/${cc}-${gg}/${cc}-${gg}-${bbb}/${cc}-${gg}-${bbb}-${vv}-${ff}.png`;
}

/**
 * Heel-of-hand "Wrist View" symbols only use fill 1, so their photo varies by
 * rotation instead of fill — file `CC-GG-BBB-VV-RR` (the RR segment of the
 * symid `CC-GG-BBB-VV-FF-RR`). Used to override the default fill-indexed photo
 * for those specific symbols.
 */
export function handImageForRotation(symbol: string): string | null {
  const key = symbolToKey(symbol);
  if (!key) return null;
  let symid: string;
  try {
    symid = convert.key2symid(key);
  } catch {
    return null;
  }
  if (!symid || !symid.startsWith("01-")) return null;
  const parts = symid.split("-");
  if (parts.length < 6) return null;
  const [cc, gg, bbb, vv, , rr] = parts;
  if (!rr || Number(rr) > HAND_PHOTOS_PER_BASE) return null;
  return `/hands/${cc}-${gg}/${cc}-${gg}-${bbb}/${cc}-${gg}-${bbb}-${vv}-${rr}.png`;
}

export function symbolToKey(symbol: string): string | null {
  try {
    const key = convert.swu2key(symbol);
    return key || null;
  } catch {
    return null;
  }
}

/**
 * Given any symbol key (SXXXFR), produce the 6 fill variants at the same
 * rotation. Returns objects with the SWU character and key for each.
 */
export function fillVariants(
  key: string,
): Array<{ key: string; swu: string }> {
  if (!key || key.length !== 6 || key[0] !== "S") return [];
  const base = key.slice(1, 4); // 3-hex base
  const rot = key[5] ?? "0";
  return Array.from({ length: 6 }, (_, fill) => {
    const variantKey = `S${base}${fill}${rot}`;
    return { key: variantKey, swu: convert.key2swu(variantKey) };
  });
}
