// The Fingerspelling drill: show a name fingerspelled in SignWriting and have
// the learner type it. Fingerspelling is fetched live from the SignWriting API
// (one manual alphabet per signed language), so it works across many signed
// languages — the list below is the set the endpoint actually supports
// (verified live; the rest return empty).
//
// GET https://signwriting.nagish.dev/fingerspelling?text=<word>&signed_language=<code>
// → { fsw }. Results are cached in memory for the session.

const API = "https://signwriting.nagish.dev/fingerspelling";

export type FsLang = { signed: string; name: string };

// Signed languages with a working fingerspelling alphabet on the endpoint
// (names from the IANA signed-language registry, same source as SignMaker).
export const FS_LANGS: FsLang[] = [
  { signed: "ase", name: "American Sign Language" },
  { signed: "bfi", name: "British Sign Language" },
  { signed: "bzs", name: "Brazilian Sign Language" },
  { signed: "dsl", name: "Danish Sign Language" },
  { signed: "vgt", name: "Flemish Sign Language" },
  { signed: "fsl", name: "French Sign Language" },
  { signed: "gsg", name: "German Sign Language" },
  { signed: "ise", name: "Italian Sign Language" },
  { signed: "mfs", name: "Mexican Sign Language" },
  { signed: "nsl", name: "Norwegian Sign Language" },
  { signed: "psr", name: "Portuguese Sign Language" },
  { signed: "ssp", name: "Spanish Sign Language" },
  { signed: "sgg", name: "Swiss-German Sign Language" },
  { signed: "swl", name: "Swedish Sign Language" },
];

// Common given names — fingerspelling's main real-world use, and Latin-script
// so they read the same across every alphabet above (no per-language wordlist).
const WORDS = [
  "anna", "maria", "david", "sarah", "daniel", "laura", "thomas", "sofia",
  "marco", "nina", "erik", "lena", "paula", "oscar", "emma", "leon", "clara",
  "hugo", "mia", "noah", "elena", "diego", "lucas", "olivia", "peter", "julia",
  "simon", "eva", "martin", "rosa",
];

const cache = new Map<string, string | null>();

export async function fetchFingerspelling(signed: string, word: string): Promise<string | null> {
  const key = `${signed}|${word}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  try {
    const res = await fetch(`${API}?text=${encodeURIComponent(word)}&signed_language=${signed}`);
    const data = (await res.json()) as { fsw?: string };
    const fsw = data.fsw || null;
    cache.set(key, fsw);
    return fsw;
  } catch {
    return null;
  }
}

export function randomWord(exclude?: string): string {
  const pool = exclude && WORDS.length > 1 ? WORDS.filter((w) => w !== exclude) : WORDS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

/** Compare answers leniently: case-, space-, and accent-insensitive. */
export function normalizeAnswer(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
