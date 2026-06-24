// Per-game attempt log, persisted in localStorage. Small volume (a few thousand
// short records at most), so localStorage is plenty — no IndexedDB needed.

export type Attempt = {
  ts: number;
  correct: boolean;
  /**
   * The question stimulus. How it renders in the table follows `questionType`:
   * `video` → the whatsthatsign clip for this signbox FSW; `image` → an asset
   * path; otherwise a signbox FSW renders as a sign and anything else as text.
   */
  question: string;
  questionType?: "video" | "image";
  chosen: string;
  answer: string;
  /** Stable id of the item being tested, for spaced repetition. */
  key?: string;
};

const key = (game: string) => `lis-game-stats:${game}`;

export function getAttempts(game: string): Attempt[] {
  try {
    const raw = localStorage.getItem(key(game));
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch {
    return [];
  }
}

export function recordAttempt(game: string, attempt: Omit<Attempt, "ts">): void {
  try {
    const all = getAttempts(game);
    all.push({ ...attempt, ts: Date.now() });
    localStorage.setItem(key(game), JSON.stringify(all));
  } catch {
    /* storage unavailable or full — stats are best-effort */
  }
}

export function clearAttempts(game: string): void {
  try {
    localStorage.removeItem(key(game));
  } catch {
    /* ignore */
  }
}

// Spaced repetition: weight an item for the next draw. Unseen items rank high;
// a recent miss ranks high; a long correct streak (mastery) ranks low; and the
// weight grows with time since last seen, so items resurface for review.
function srsWeight(history: Attempt[], now: number): number {
  if (history.length === 0) return 6;
  const last = history[history.length - 1]!;
  let streak = 0;
  for (let i = history.length - 1; i >= 0 && history[i]!.correct; i--) streak++;
  const base = last.correct ? 1 : 4;
  const ageBoost = Math.min((now - last.ts) / MINUTE / 5, 3);
  const mastery = streak >= 3 ? 0.4 : streak === 2 ? 0.7 : 1;
  return Math.max(0.25, (base + ageBoost) * mastery);
}

/**
 * Pick the next item id for a game, biased by spaced-repetition weight over the
 * recorded attempt history (grouped by `key`). Falls back to uniform when there
 * is no history. Games should record the same `key` they pass here.
 */
export function pickWeighted(game: string, keys: string[]): string {
  if (keys.length <= 1) return keys[0]!;
  const byKey = new Map<string, Attempt[]>();
  for (const a of getAttempts(game)) {
    if (a.key == null) continue;
    const arr = byKey.get(a.key);
    if (arr) arr.push(a);
    else byKey.set(a.key, [a]);
  }
  const now = Date.now();
  const weights = keys.map((k) => srsWeight(byKey.get(k) ?? [], now));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < keys.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return keys[i]!;
  }
  return keys[keys.length - 1]!;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export type StatBucket = { t: number; tried: number; correct: number };
export type StatSeries = { buckets: StatBucket[]; unit: number };

/**
 * Cumulative tried/correct counts at each time bucket. Granularity follows the
 * data span: under an hour → per minute, under a day → per hour, else per day.
 */
export function cumulativeSeries(attempts: Attempt[]): StatSeries {
  const sorted = [...attempts].sort((a, b) => a.ts - b.ts);
  const first = sorted[0]!.ts;
  const last = sorted[sorted.length - 1]!.ts;
  const span = last - first;
  const unit = span < HOUR ? MINUTE : span < DAY ? HOUR : DAY;
  const start = Math.floor(first / unit) * unit;
  const end = Math.floor(last / unit) * unit;

  const buckets: StatBucket[] = [];
  let i = 0;
  let tried = 0;
  let correct = 0;
  for (let t = start; t <= end; t += unit) {
    const limit = t + unit;
    while (i < sorted.length && sorted[i]!.ts < limit) {
      tried++;
      if (sorted[i]!.correct) correct++;
      i++;
    }
    buckets.push({ t, tried, correct });
  }
  return { buckets, unit };
}
