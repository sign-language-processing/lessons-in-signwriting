import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/asset";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import { shuffle } from "../lib/practiceHands";

const GAME_ID = "basic-handshapes";
const ARTIFACTS = "/docling-out/sw0116-Lessons-SignWriting_artifacts";
const WRONG_FLASH_MS = 700;

const PAIRS = [
  { id: 0, name: "Closed Fist", symbol: "񆄡", photo: "image_000078_1e6269e098684a67d7a642e2a90844457f8f25909103a3389683082899a59853.png" },
  { id: 1, name: "Open Fist", symbol: "񂱁", photo: "image_000079_735614923830a79c56e968d735bd3e8f3341b61cfb936b452dd734382c80ed62.png" },
  { id: 2, name: "Flat Hand", symbol: "񂇁", photo: "image_000080_74ae1ac7d6eb32c7ee94f26bf4053e4599830738da157ad26acffa50e377950b.png" },
];

type Side = "symbol" | "photo";
type Selection = { side: Side; id: number };

export function BasicHandshapesGame() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [order, setOrder] = useState<number[]>([0, 1, 2]);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<Selection[] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedRef = useRef(false);

  function start() {
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    setOrder(shuffle([0, 1, 2]));
    setSelected(null);
    setMatched(new Set());
    setWrong(null);
    setMistakes(0);
    recordedRef.current = false;
  }

  function open() {
    start();
    dialogRef.current?.showModal();
  }

  useDialogClose(dialogRef, () => {
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    setSelected(null);
  });

  const solved = matched.size === PAIRS.length;

  useEffect(() => {
    if (matched.size !== PAIRS.length || recordedRef.current) return;
    recordedRef.current = true;
    recordAttempt(GAME_ID, {
      correct: mistakes === 0,
      question: "",
      chosen: `${mistakes} mistake${mistakes === 1 ? "" : "s"}`,
      answer: "0 mistakes",
    });
  }, [matched, mistakes]);

  useEffect(() => () => {
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
  }, []);

  const isWrong = (side: Side, id: number) =>
    wrong?.some((w) => w.side === side && w.id === id) ?? false;

  function tap(side: Side, id: number) {
    if (wrong || matched.has(id)) return;
    if (!selected || selected.side === side) {
      setSelected({ side, id });
      return;
    }
    if (selected.id === id) {
      setMatched((prev) => new Set(prev).add(id));
      setSelected(null);
      return;
    }
    setWrong([selected, { side, id }]);
    setSelected(null);
    setMistakes((n) => n + 1);
    wrongTimer.current = setTimeout(() => setWrong(null), WRONG_FLASH_MS);
  }

  const tileClass = (side: Side, id: number) => {
    const classes = ["practice-tile"];
    if (matched.has(id)) classes.push("is-matched");
    else if (isWrong(side, id)) classes.push("is-wrong");
    else if (selected?.side === side && selected.id === id) classes.push("is-selected");
    return classes.join(" ");
  };

  return (
    <>
      <PracticeLaunchCard
        label="🧩 Match the Basic Handshapes"
        hint="Match each of the three basic hand symbols to its photo."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${solved ? "is-correct" : ""}`}
        aria-labelledby="basic-handshapes-title"
      >
        <div className="practice-body">
          <DialogCloseButton />
          <PracticeHistory game={GAME_ID} title="Match the Basic Handshapes" />

          <h2 id="basic-handshapes-title">Match the Basic Handshapes</h2>
          <p className="practice-prompt">Match each symbol to its hand.</p>

          <div className="practice-board">
            <div className="practice-column">
              {PAIRS.map((pair) => (
                <button
                  type="button"
                  key={`sym-${pair.id}`}
                  className={tileClass("symbol", pair.id)}
                  disabled={matched.has(pair.id) || Boolean(wrong)}
                  onClick={() => tap("symbol", pair.id)}
                >
                  <sgnw-symbol symbol={pair.symbol} style={{ fontSize: 64 }}></sgnw-symbol>
                </button>
              ))}
            </div>
            <div className="practice-column">
              {order.map((id) => {
                const pair = PAIRS[id]!;
                return (
                  <button
                    type="button"
                    key={`photo-${id}`}
                    className={tileClass("photo", id)}
                    disabled={matched.has(id) || Boolean(wrong)}
                    onClick={() => tap("photo", id)}
                  >
                    <img src={asset(`${ARTIFACTS}/${pair.photo}`)} alt="" />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="quiz-feedback" role="status">
            {solved
              ? mistakes === 0
                ? "Perfect! 🎉"
                : `Solved with ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`
              : ""}
          </p>

          <div className="practice-actions">
            <button type="button" className="practice-next" onClick={start}>
              {solved ? "Shuffle again →" : "Reset →"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
