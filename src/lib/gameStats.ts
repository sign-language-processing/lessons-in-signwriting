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
