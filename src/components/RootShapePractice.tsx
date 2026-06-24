import { useRef, useState } from "react";
import { asset } from "../lib/asset";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import { baseSymbolName } from "../lib/baseSymbolNames";
import { handImageForKey, symbolToKey } from "../lib/handImage";
import {
  ROOT_SHAPES,
  randomPracticeSymbol,
  rootNameFor,
} from "../lib/rootShapes";

const GAME_ID = "rootshape";

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

  useDialogClose(dialogRef, () => setRound(null));

  const answered = chosen !== null;
  const correct = answered && chosen === round?.answer;
  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";

  function choose(name: string) {
    if (answered || !round) return;
    setChosen(name);
    recordAttempt(GAME_ID, {
      correct: name === round.answer,
      question: round.photo || round.name,
      questionType: round.photo ? "image" : undefined,
      chosen: name,
      answer: round.answer,
      key: round.answer,
    });
  }

  const optionClass = (name: string) => {
    const classes = ["rootshape-option"];
    if (!answered) return classes.join(" ");
    if (name === round?.answer) classes.push("is-correct");
    else if (name === chosen) classes.push("is-wrong");
    return classes.join(" ");
  };

  return (
    <>
      <PracticeLaunchCard
        label="🌱 Rootshape Practice"
        hint="See a hand and name the rootshape it grows from."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${stateClass}`}
        aria-labelledby="rootshape-practice-title"
      >
        {round && (
          <div className="practice-body">
            <DialogCloseButton />
            <PracticeHistory game={GAME_ID} title="Rootshape Practice" />

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
              {(difficulty === "easy" || answered) && (
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
                  onClick={() => choose(shape.name)}
                >
                  <sgnw-symbol
                    symbol={shape.swu}
                    style={{ fontSize: 44 }}
                  ></sgnw-symbol>
                  <span>{shape.name}</span>
                </button>
              ))}
            </div>

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {answered
                ? `${correct ? "Correct!" : "Not quite —"} ${round.name} is the ${round.answer} rootshape.${correct ? " 🎉" : ""}`
                : ""}
            </p>

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
