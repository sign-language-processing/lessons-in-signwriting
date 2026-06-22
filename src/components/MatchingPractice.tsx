import { useRef, useState } from "react";
import { asset } from "../lib/asset";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import {
  randomReadingRound,
  readingClip,
  readingSwu,
  type ReadingRound,
} from "../lib/readingSigns";

const GAME_ID = "matching";

export function MatchingPractice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState<ReadingRound | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  function start(prev?: string) {
    setRound(randomReadingRound(prev));
    setChosen(null);
  }

  function open() {
    start();
    dialogRef.current?.showModal();
  }

  useDialogClose(dialogRef, () => setRound(null));

  const answered = chosen !== null;
  const correct = answered && chosen === round?.answer;
  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";

  function choose(fsw: string) {
    if (answered || !round) return;
    setChosen(fsw);
    recordAttempt(GAME_ID, {
      correct: fsw === round.answer,
      question: round.answer,
      questionType: "video",
      chosen: fsw,
      answer: round.answer,
    });
  }

  const tileClass = (fsw: string) => {
    const classes = ["reading-tile"];
    if (!answered) return classes.join(" ");
    if (fsw === round?.answer) classes.push("is-correct");
    else if (fsw === chosen) classes.push("is-wrong");
    return classes.join(" ");
  };

  return (
    <>
      <PracticeLaunchCard
        label="🃏 Matching Practice"
        hint="Watch a sign and pick the SignWriting that records it."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${stateClass}`}
        aria-labelledby="matching-practice-title"
      >
        {round && (
          <div className="practice-body">
            <DialogCloseButton />
            <PracticeHistory game={GAME_ID} title="Matching Practice" />

            <h2 id="matching-practice-title">Matching Practice</h2>
            <p className="practice-prompt">
              Which SignWriting records this sign?
            </p>

            <video
              key={round.answer}
              className="quiz-video"
              src={asset(readingClip(round.answer))}
              autoPlay
              loop
              muted
              playsInline
            />

            <div className="reading-options">
              {round.options.map((fsw) => (
                <button
                  type="button"
                  key={fsw}
                  className={tileClass(fsw)}
                  disabled={answered}
                  onClick={() => choose(fsw)}
                >
                  <sgnw-sign
                    sign={readingSwu(fsw)}
                    style={{ fontSize: 48 }}
                  ></sgnw-sign>
                </button>
              ))}
            </div>

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {answered ? (correct ? "Correct! 🎉" : "Not quite — the highlighted one matches.") : ""}
            </p>

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(round.answer)}
              >
                {answered ? "Next sign →" : "Skip →"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
