import signsJson from "../content/reading-signs.generated.json";

// Signbox FSW (with coordinates) for every sign with a local clip.
const SIGNS = signsJson as string[];

// Symbol classes by 3-hex base, per the SignWriting symbol groups.
export type SymbolClass = "hands" | "contact" | "movement" | "face" | "etc";

export function classOf(base: string): SymbolClass {
  if (base < "205") return "hands";
  if (base < "221") return "contact";
  if (base < "2ff") return "movement";
  if (base < "36a") return "face";
  return "etc";
}

export type WritingMode = {
  key: string;
  label: string;
  instruction: string;
  /** Symbol class to blank out and ask the learner to write, or null for the whole sign. */
  cls: SymbolClass | null;
};

export const WRITING_MODES: WritingMode[] = [
  { key: "hands", label: "Hands", instruction: "Add the hand symbols.", cls: "hands" },
  { key: "contact", label: "Contact", instruction: "Add the contact symbol.", cls: "contact" },
  { key: "movement", label: "Movement", instruction: "Add the movement arrows.", cls: "movement" },
  { key: "face", label: "Face", instruction: "Add the face / head symbols.", cls: "face" },
  { key: "all", label: "Entire sign", instruction: "Write the whole sign from scratch.", cls: null },
];

// An FSW symbol token is a symbol (S + 5 hex) followed by its x×y coordinate.
const TOKEN_RE = /S[0-9a-f]{5}\d+x\d+/g;
const BOX_RE = /^[BLMR]\d+x\d+/;

const tokenBase = (token: string): string => token.slice(1, 4);
const symbolId = (token: string): string => token.slice(0, 6); // Sbbbfr, no coords

const inClass = (base: string, cls: SymbolClass | null): boolean =>
  cls === null || classOf(base) === cls;

function tokensOf(fsw: string): string[] {
  return fsw.match(TOKEN_RE) ?? [];
}

function boxOf(fsw: string): string {
  return fsw.match(BOX_RE)?.[0] ?? "M500x500";
}

/** The sign with every symbol of `cls` removed (the canvas the learner starts from). */
function blankOut(fsw: string, cls: SymbolClass | null): string {
  const kept = tokensOf(fsw).filter((t) => !inClass(tokenBase(t), cls));
  return boxOf(fsw) + kept.join("");
}

/** Position-independent symbol identities of `cls` in a sign (the answer key). */
function classIds(fsw: string, cls: SymbolClass | null): string[] {
  return tokensOf(fsw)
    .filter((t) => inClass(tokenBase(t), cls))
    .map(symbolId)
    .sort();
}

function hasClass(fsw: string, cls: SymbolClass | null): boolean {
  if (cls === null) return tokensOf(fsw).length > 0;
  return tokensOf(fsw).some((t) => inClass(tokenBase(t), cls));
}

export type WritingRound = {
  mode: WritingMode;
  /** Full original sign (signbox FSW) — the answer + the reference clip name. */
  sign: string;
  /** The pre-filled canvas (original minus the target class). */
  start: string;
  /** Sorted symbol identities the learner must reproduce. */
  answerIds: string[];
};

export function buildWritingRound(modeKey: string, prevSign?: string): WritingRound {
  const mode = WRITING_MODES.find((m) => m.key === modeKey) ?? WRITING_MODES[0]!;
  let pool = SIGNS.filter((s) => hasClass(s, mode.cls));
  if (prevSign && pool.length > 1) pool = pool.filter((s) => s !== prevSign);
  const sign = pool[Math.floor(Math.random() * pool.length)]!;
  return {
    mode,
    sign,
    start: blankOut(sign, mode.cls),
    answerIds: classIds(sign, mode.cls),
  };
}

/** Did the learner produce exactly the target-class symbols of the original? */
export function gradeWriting(userFsw: string, round: WritingRound): boolean {
  const got = classIds(userFsw, round.mode.cls);
  return (
    got.length === round.answerIds.length &&
    got.every((id, i) => id === round.answerIds[i])
  );
}
