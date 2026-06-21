import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/asset";
import { baseSymbolName } from "../lib/baseSymbolNames";
import { handImageForKey, symbolToKey } from "../lib/handImage";
import {
  ROOT_SHAPES,
  randomPracticeSymbol,
  rootNameFor,
} from "../lib/rootShapes";

type Difficulty = "easy" | "hard";

type Round = {
  symbol: string;
  photo: string;
  name: string;
  answer: string;
};

function buildRound(symbol: string): Round {
  const key = symbolToKey(symbol);
  return {
    symbol,
    photo: (key && handImageForKey(key)) || "",
    name: (key && baseSymbolName(key)) || "this handshape",
    answer: rootNameFor(symbol) ?? ROOT_SHAPES[0]!.name,
  };
}

export function RootShapePractice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  function start(symbol: string) {
    setRound(buildRound(symbol));
    setChosen(null);
  }

  function open() {
    start(randomPracticeSymbol());
    dialogRef.current?.showModal();
  }

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => setRound(null);
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  const answered = chosen !== null;
  const correct = answered && chosen === round?.answer;

  const optionClass = (name: string) => {
    const classes = ["rootshape-option"];
    if (!answered) return classes.join(" ");
    if (name === round?.answer) classes.push("is-correct");
    else if (name === chosen) classes.push("is-wrong");
    return classes.join(" ");
  };

  return (
    <>
      <div className="practice-launch" data-no-print>
        <button
          type="button"
          className="practice-launch__button"
          onClick={open}
        >
          🌱 Rootshape Practice
        </button>
        <p className="practice-launch__hint">
          See a hand and name the rootshape it grows from.
        </p>
      </div>

      <dialog
        ref={dialogRef}
        closedby="any"
        className="practice-dialog"
        aria-labelledby="rootshape-practice-title"
      >
        {round && (
          <div className="practice-body">
            <form method="dialog" className="practice-close-form">
              <button type="submit" aria-label="Close" className="practice-close">
                ×
              </button>
            </form>

            <h2 id="rootshape-practice-title">Rootshape Practice</h2>

            <div className="rootshape-difficulty" role="group" aria-label="Difficulty">
              {(["easy", "hard"] as const).map((level) => (
                <button
                  type="button"
                  key={level}
                  className={difficulty === level ? "is-active" : undefined}
                  aria-pressed={difficulty === level}
                  onClick={() => setDifficulty(level)}
                >
                  {level === "easy" ? "Easy" : "Hard"}
                </button>
              ))}
            </div>

            <p className="practice-prompt">
              Which rootshape is this handshape based on?
            </p>

            <div className="rootshape-stimulus">
              {difficulty === "easy" && (
                <sgnw-symbol
                  symbol={round.symbol}
                  style={{ fontSize: 110 }}
                ></sgnw-symbol>
              )}
              {round.photo ? <img src={asset(round.photo)} alt="" /> : null}
            </div>

            <div className="rootshape-options">
              {ROOT_SHAPES.map((shape) => (
                <button
                  type="button"
                  key={shape.name}
                  className={optionClass(shape.name)}
                  disabled={answered}
                  onClick={() => setChosen(shape.name)}
                >
                  <sgnw-symbol
                    symbol={shape.swu}
                    style={{ fontSize: 44 }}
                  ></sgnw-symbol>
                  <span>{shape.name}</span>
                </button>
              ))}
            </div>

            {answered && (
              <div className="practice-result" role="status">
                <p className="practice-result__title">
                  {correct ? "Correct! 🎉" : "Not quite"}
                </p>
                <p className="practice-result__detail">
                  {round.name} is the {round.answer} rootshape.
                </p>
              </div>
            )}

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(randomPracticeSymbol(round.symbol))}
              >
                {answered ? "Next hand →" : "Skip →"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
