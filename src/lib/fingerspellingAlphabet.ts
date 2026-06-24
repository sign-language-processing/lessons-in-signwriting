import data from "../content/fingerspelling.generated.json";
import { shuffle } from "./practiceHands";

type Sign = { fsw: string; single: boolean; symbol?: string; swu?: string };
type Entry = { letter: string; signs: Sign[] };
type Language = { code: string; label: string; description: string; entries: Entry[] };

const DATA = data as { languages: Language[] };

export type AlphabetLang = { code: string; label: string };
export const ALPHABET_LANGS: AlphabetLang[] = DATA.languages.map((l) => ({
  code: l.code,
  label: l.label,
}));

export type LetterOption = { letter: string; fsw: string };
export type LetterRound = { letter: string; options: LetterOption[] };

const OPTIONS = 4;

function entriesFor(code: string): Entry[] {
  const lang = DATA.languages.find((l) => l.code === code) ?? DATA.languages[0]!;
  return lang.entries.filter((e) => e.signs.length > 0);
}

const toOption = (e: Entry): LetterOption => ({ letter: e.letter, fsw: e.signs[0]!.fsw });

export function randomLetterRound(code: string, prevLetter?: string): LetterRound {
  const entries = entriesFor(code);
  let pool = prevLetter && entries.length > 1 ? entries.filter((e) => e.letter !== prevLetter) : entries;
  const target = pool[Math.floor(Math.random() * pool.length)]!;
  const distractors = shuffle(entries.filter((e) => e.letter !== target.letter)).slice(0, OPTIONS - 1);
  return { letter: target.letter, options: shuffle([target, ...distractors].map(toOption)) };
}
