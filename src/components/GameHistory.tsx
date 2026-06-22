import { useEffect, useState, type MouseEvent } from "react";
import { convert } from "@sutton-signwriting/core";
import { asset } from "../lib/asset";
import {
  cumulativeSeries,
  getAttempts,
  type Attempt,
  type StatSeries,
} from "../lib/gameStats";
import { useModalDialog } from "./useModalDialog";

const W = 520;
const H = 200;
const PAD = { top: 12, right: 12, bottom: 24, left: 32 };

const isSign = (v: string) => /^[BLMR]\d/.test(v);

function Cell({ value }: { value: string }) {
  if (!value) return <span className="history-cell-empty">—</span>;
  if (isSign(value))
    return <sgnw-sign sign={convert.fsw2swu(value)} style={{ fontSize: 36 }}></sgnw-sign>;
  return <span>{value}</span>;
}

function playOnce(e: MouseEvent<HTMLVideoElement>) {
  const v = e.currentTarget;
  v.currentTime = 0;
  void v.play();
}

function QuestionCell({ attempt }: { attempt: Attempt }) {
  const { question, questionType } = attempt;
  if (questionType === "video")
    return (
      <video
        className="history-video"
        src={asset(`/videos/whatsthatsign/${question}.mp4`)}
        muted
        playsInline
        preload="metadata"
        onClick={playOnce}
      />
    );
  if (questionType === "image")
    return <img className="history-img" src={asset(question)} alt="" />;
  return <Cell value={question} />;
}

function formatTick(t: number, unit: number): string {
  const d = new Date(t);
  if (unit < 60 * 60_000)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (unit < 24 * 60 * 60_000)
    return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function Chart({ series }: { series: StatSeries }) {
  const { buckets, unit } = series;
  const max = buckets[buckets.length - 1]?.tried ?? 0;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = buckets.length;
  const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (max === 0 ? 0 : (v / max) * innerH);
  const line = (key: "tried" | "correct") =>
    buckets.map((b, i) => `${x(i)},${y(b[key])}`).join(" ");

  return (
    <svg className="history-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Attempts over time">
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerH} stroke="#ccc" />
      <line x1={PAD.left} y1={PAD.top + innerH} x2={W - PAD.right} y2={PAD.top + innerH} stroke="#ccc" />
      <text x={PAD.left - 6} y={PAD.top + 4} textAnchor="end" className="history-axis">{max}</text>
      <text x={PAD.left - 6} y={PAD.top + innerH} textAnchor="end" className="history-axis">0</text>
      <text x={PAD.left} y={H - 6} textAnchor="start" className="history-axis">
        {formatTick(buckets[0]!.t, unit)}
      </text>
      {n > 1 && (
        <text x={W - PAD.right} y={H - 6} textAnchor="end" className="history-axis">
          {formatTick(buckets[n - 1]!.t, unit)}
        </text>
      )}
      <polyline points={line("tried")} fill="none" stroke="#2f6fe0" strokeWidth="2" />
      <polyline points={line("correct")} fill="none" stroke="#2f9e57" strokeWidth="2" />
      {buckets.map((b, i) => (
        <g key={b.t}>
          <circle cx={x(i)} cy={y(b.tried)} r="2.5" fill="#2f6fe0" />
          <circle cx={x(i)} cy={y(b.correct)} r="2.5" fill="#2f9e57" />
        </g>
      ))}
    </svg>
  );
}

function HistoryDialog({
  game,
  title,
  onClose,
}: {
  game: string;
  title: string;
  onClose: () => void;
}) {
  const dialogRef = useModalDialog();
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onCloseEvent = () => onClose();
    dlg.addEventListener("close", onCloseEvent);
    return () => dlg.removeEventListener("close", onCloseEvent);
  }, [dialogRef, onClose]);
  const attempts = getAttempts(game);
  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const rows = [...attempts].reverse().slice(0, 500);

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      className="practice-dialog history-dialog"
      aria-labelledby="history-title"
    >
      <div className="practice-body">
        <form method="dialog" className="practice-close-form">
          <button type="submit" aria-label="Close" className="practice-close">
            ×
          </button>
        </form>

        <h2 id="history-title">{title} — History</h2>

        {total === 0 ? (
          <p className="practice-prompt">No attempts yet. Play a round and come back!</p>
        ) : (
          <>
            <p className="practice-prompt">
              {correct} correct of {total} ({Math.round((correct / total) * 100)}%)
            </p>
            <div className="history-legend">
              <span className="history-legend__tried">Tried</span>
              <span className="history-legend__correct">Correct</span>
            </div>
            <Chart series={cumulativeSeries(attempts)} />

            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Question</th>
                    <th>Correct answer</th>
                    <th>Your answer</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.ts} className={a.correct ? "is-correct" : "is-wrong"}>
                      <td className="history-when">
                        {new Date(a.ts).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td><QuestionCell attempt={a} /></td>
                      <td><Cell value={a.answer} /></td>
                      <td><Cell value={a.chosen} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

export function PracticeHistory({ game, title }: { game: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="practice-history"
        aria-label="History"
        title="History"
        onClick={() => setOpen(true)}
      >
        📖
      </button>
      {open && <HistoryDialog game={game} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}
