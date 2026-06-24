import { useRef, useState } from "react";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import { HANDSHAPE_GROUP_GAME } from "../lib/watchGames";
import { randomGroupSymbol, type GroupRound } from "../lib/handGroupGame";

const GAME_ID = "handgroup-symbol";
const ANSWERS = HANDSHAPE_GROUP_GAME.answers;

export function HandGroupSymbolGame() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState<GroupRound | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  function start(prevKey?: string) {
    setRound(randomGroupSymbol(prevKey));
    setChosen(null);
  }

  function open() {
    start();
    dialogRef.current?.showModal();
  }

  useDialogClose(dialogRef, () => setRound(null));

  const answered = chosen !== null;
  const correct = answered && chosen === round?.answerKey;
  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";
  const nameOf = (key: string) => ANSWERS.find((a) => a.key === key)?.name ?? key;

  function choose(key: string) {
    if (answered || !round) return;
    setChosen(key);
    recordAttempt(GAME_ID, {
      correct: key === round.answerKey,
      question: round.symbol,
      chosen: nameOf(key),
      answer: nameOf(round.answerKey),
      key: round.answerKey,
    });
  }

  const optionClass = (key: string) => {
    const classes = ["rootshape-option"];
    if (!answered) return classes.join(" ");
    if (key === round?.answerKey) classes.push("is-correct");
    else if (key === chosen) classes.push("is-wrong");
    return classes.join(" ");
  };

  return (
    <>
      <PracticeLaunchCard
        label="✋ Name the Hand Group"
        hint="See a hand symbol and pick which of the ten groups it belongs to."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${stateClass}`}
        aria-labelledby="handgroup-symbol-title"
      >
        {round && (
          <div className="practice-body">
            <DialogCloseButton />
            <PracticeHistory game={GAME_ID} title="Name the Hand Group" />

            <h2 id="handgroup-symbol-title">Name the Hand Group</h2>
            <p className="practice-prompt">
              Which group of hands does this symbol belong to?
            </p>

            <div className="rootshape-stimulus">
              <sgnw-symbol symbol={round.symbol} style={{ fontSize: 120 }}></sgnw-symbol>
            </div>

            <div className="rootshape-options rootshape-options--column">
              {ANSWERS.map((answer) => (
                <button
                  type="button"
                  key={answer.key}
                  className={optionClass(answer.key)}
                  disabled={answered}
                  onClick={() => choose(answer.key)}
                >
                  {answer.symbol && (
                    <sgnw-symbol symbol={answer.symbol} style={{ fontSize: 40 }}></sgnw-symbol>
                  )}
                  <span>{answer.name}</span>
                </button>
              ))}
            </div>

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {answered
                ? correct
                  ? `Correct! ${nameOf(round.answerKey)} 🎉`
                  : `Not quite — it's ${nameOf(round.answerKey)}`
                : ""}
            </p>

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(round.answerKey)}
              >
                {answered ? "Next symbol →" : "Skip →"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
