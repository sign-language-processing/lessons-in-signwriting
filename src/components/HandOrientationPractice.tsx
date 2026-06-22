import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/asset";
import { baseSymbolName } from "../lib/baseSymbolNames";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import {
  practicePairs,
  randomPracticeBase,
  shuffle,
  type PracticePair,
} from "../lib/practiceHands";

const GAME_ID = "hand-orientation";

export type HandOrientationPracticeProps = {
  /** Base (3-hex) to seed the first round, or null when the dialog is closed. */
  openBase: string | null;
  onClose: () => void;
};

type Side = "symbol" | "photo";
type Selection = { side: Side; fill: number };
type Round = { base: string; pairs: PracticePair[]; order: number[] };

const WRONG_FLASH_MS = 700;

function buildRound(base: string): Round {
  const pairs = practicePairs(base);
  return { base, pairs, order: shuffle(pairs.map((p) => p.fill)) };
}

export function HandOrientationPractice({
  openBase,
  onClose,
}: HandOrientationPracticeProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<Selection[] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedRef = useRef(false);

  function start(base: string) {
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    setRound(buildRound(base));
    setSelected(null);
    setMatched(new Set());
    setWrong(null);
    setMistakes(0);
    recordedRef.current = false;
  }

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (openBase) {
      start(openBase);
      if (!dlg.open) dlg.showModal();
    } else if (dlg.open) {
      dlg.close();
    }
  }, [openBase]);

  useEffect(
    () => () => {
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!round || recordedRef.current) return;
    if (matched.size !== round.pairs.length) return;
    recordedRef.current = true;
    recordAttempt(GAME_ID, {
      correct: mistakes === 0,
      question: baseSymbolName(round.base) ?? round.base,
      chosen: `${mistakes} mistake${mistakes === 1 ? "" : "s"}`,
      answer: "0 mistakes",
    });
  }, [matched, round, mistakes]);

  if (!round) {
    return <dialog ref={dialogRef} className="practice-dialog" onClose={onClose} />;
  }

  const solved = matched.size === round.pairs.length;

  const isWrong = (side: Side, fill: number) =>
    wrong?.some((w) => w.side === side && w.fill === fill) ?? false;

  function tap(side: Side, fill: number) {
    if (wrong || matched.has(fill)) return;
    if (!selected) {
      setSelected({ side, fill });
      return;
    }
    if (selected.side === side) {
      setSelected({ side, fill });
      return;
    }
    if (selected.fill === fill) {
      setMatched((prev) => new Set(prev).add(fill));
      setSelected(null);
      return;
    }
    const pair = [selected, { side, fill }];
    setWrong(pair);
    setSelected(null);
    setMistakes((n) => n + 1);
    wrongTimer.current = setTimeout(() => setWrong(null), WRONG_FLASH_MS);
  }

  const tileClass = (side: Side, fill: number) => {
    const classes = ["practice-tile"];
    if (matched.has(fill)) classes.push("is-matched");
    else if (isWrong(side, fill)) classes.push("is-wrong");
    else if (selected?.side === side && selected.fill === fill)
      classes.push("is-selected");
    return classes.join(" ");
  };

  const name = baseSymbolName(round.base) ?? "this handshape";

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      className="practice-dialog"
      aria-labelledby="practice-title"
      onClose={onClose}
    >
      <div className="practice-body">
        <DialogCloseButton />
        <PracticeHistory game={GAME_ID} title="Hand Orientation Practice" />

        <h2 id="practice-title">Hand Orientation Practice</h2>
        <p className="practice-prompt">
          Match each <strong>{name}</strong> symbol to its photo.
        </p>

        <div className="practice-board" aria-hidden={solved}>
        <div className="practice-column">
          {round.pairs.map((pair) => (
            <button
              type="button"
              key={`sym-${pair.fill}`}
              data-fill={pair.fill}
              className={tileClass("symbol", pair.fill)}
              disabled={matched.has(pair.fill) || Boolean(wrong)}
              onClick={() => tap("symbol", pair.fill)}
            >
              <sgnw-symbol
                symbol={pair.swu}
                style={{ fontSize: 64 }}
              ></sgnw-symbol>
            </button>
          ))}
        </div>

        <div className="practice-column">
          {round.order.map((fill) => {
            const pair = round.pairs[fill]!;
            return (
              <button
                type="button"
                key={`photo-${fill}`}
                data-fill={fill}
                className={tileClass("photo", fill)}
                disabled={matched.has(fill) || Boolean(wrong)}
                onClick={() => tap("photo", fill)}
              >
                <img src={asset(pair.photo)} alt="" />
              </button>
            );
          })}
        </div>
      </div>

      {solved && (
        <div className="practice-result" role="status">
          <p className="practice-result__title">
            {mistakes === 0 ? "Perfect! 🎉" : "Solved! ✅"}
          </p>
          <p className="practice-result__detail">
            {mistakes === 0
              ? "No mistakes."
              : `${mistakes} mistake${mistakes === 1 ? "" : "s"}.`}
          </p>
        </div>
      )}

        <div className="practice-actions">
          <button
            type="button"
            className="practice-next"
            onClick={() => start(randomPracticeBase(round.base))}
          >
            {solved ? "Next handshape →" : "Skip →"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
