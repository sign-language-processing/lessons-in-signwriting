import { convert } from "@sutton-signwriting/core";

// Each base's 6 photos are the same handshape at 6 orientations, indexed by the
// symbol's rotation. Symbols beyond that range have no photo.
const HAND_PHOTOS_PER_BASE = 6;

/**
 * For a SignWriting symbol character, return the path to its corresponding
 * 3d-hands-benchmark photo, or null if the symbol is not in the Hands
 * category (the dataset only covers category 01) or its rotation has no photo.
 *
 * The symid is `CC-GG-BBB-VV-FF-RR`; the dataset filenames are
 * `CC-GG-BBB-VV-RR.png` — the photos are real hand orientations selected by the
 * symbol's rotation (RR), so the fill segment is dropped, not the rotation.
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
