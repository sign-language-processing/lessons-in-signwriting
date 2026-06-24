import { useRef, useState } from "react";
import { asset } from "../lib/asset";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import { randomOrientationRound, type OrientationRound } from "../lib/orientationGame";

const GAME_ID = "orientation-fill";

export function OrientationFillGame() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState<OrientationRound | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);

  function start(prevBase?: string) {
    setRound(randomOrientationRound(prevBase));
    setChosen(null);
  }

  function open() {
    start();
    dialogRef.current?.showModal();
  }

  useDialogClose(dialogRef, () => setRound(null));

  const answered = chosen !== null;
  const correct = answered && chosen === round?.fill;
  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";
  const nameOf = (fill: number) =>
    round?.options.find((o) => o.fill === fill)?.name ?? "";

  function choose(fill: number) {
    if (answered || !round) return;
    setChosen(fill);
    recordAttempt(GAME_ID, {
      correct: fill === round.fill,
      question: round.photo,
      questionType: "image",
      chosen: nameOf(fill),
      answer: nameOf(round.fill),
    });
  }

  const optionClass = (fill: number) => {
    const classes = ["rootshape-option"];
    if (!answered) return classes.join(" ");
    if (fill === round?.fill) classes.push("is-correct");
    else if (fill === chosen) classes.push("is-wrong");
    return classes.join(" ");
  };

  return (
    <>
      <PracticeLaunchCard
        label="🤚 Palm, Side or Back?"
        hint="See a hand and pick the symbol fill that matches its facing."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${stateClass}`}
        aria-labelledby="orientation-fill-title"
      >
        {round && (
          <div className="practice-body">
            <DialogCloseButton />
            <PracticeHistory game={GAME_ID} title="Palm, Side or Back?" />

            <h2 id="orientation-fill-title">Palm, Side or Back?</h2>
            <p className="practice-prompt">
              Which symbol fill matches the way this hand faces?
            </p>

            <div className="rootshape-stimulus">
              <img src={asset(round.photo)} alt="" />
            </div>

            <div className="rootshape-options rootshape-options--three">
              {round.options.map((option) => (
                <button
                  type="button"
                  key={option.fill}
                  className={optionClass(option.fill)}
                  disabled={answered}
                  onClick={() => choose(option.fill)}
                >
                  <sgnw-symbol symbol={option.symbol} style={{ fontSize: 44 }}></sgnw-symbol>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {answered
                ? correct
                  ? `Correct! ${nameOf(round.fill)} 🎉`
                  : `Not quite — this is ${nameOf(round.fill)}`
                : ""}
            </p>

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(round.base)}
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
