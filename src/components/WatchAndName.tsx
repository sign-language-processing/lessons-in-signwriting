import { useRef, useState } from "react";
import { convert } from "@sutton-signwriting/core";
import { asset } from "../lib/asset";
import { SgnwSign } from "./Sgnw";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import { randomAnswerKey, randomClip, type WatchGame } from "../lib/watchGames";

type Round = { answerKey: string; clip: string };

function buildRound(game: WatchGame, prevKey?: string): Round {
  const answerKey = randomAnswerKey(game, prevKey);
  return { answerKey, clip: randomClip(game, answerKey) };
}

export function WatchAndName({ game }: { game: WatchGame }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  function start(prevKey?: string) {
    setRound(buildRound(game, prevKey));
    setChosen(null);
  }

  function open() {
    start();
    dialogRef.current?.showModal();
  }

  useDialogClose(dialogRef, () => setRound(null));

  const answered = chosen !== null;
  const correct = answered && chosen === round?.answerKey;
  const nameOf = (key: string) =>
    game.answers.find((a) => a.key === key)?.name ?? key;
  const answerName = round ? nameOf(round.answerKey) : "";

  function choose(key: string) {
    if (answered || !round) return;
    setChosen(key);
    recordAttempt(`watch:${game.id}`, {
      correct: key === round.answerKey,
      question: round.clip,
      questionType: "video",
      chosen: nameOf(key),
      answer: nameOf(round.answerKey),
      key: round.answerKey,
    });
  }

  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";

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
        label={game.launchLabel}
        hint={game.launchHint}
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${stateClass}`}
        aria-labelledby="watch-practice-title"
      >
        {round && (
          <div className="practice-body">
            <DialogCloseButton />
            <PracticeHistory game={`watch:${game.id}`} title={game.title} />

            <h2 id="watch-practice-title">{game.title}</h2>
            <p className="practice-prompt">{game.prompt}</p>

            <div className="quiz-watch">
              <video
                key={round.clip}
                className="quiz-video"
                src={asset(`/videos/whatsthatsign/${round.clip}.mp4`)}
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="quiz-sign-slot">
                {answered && (
                  <SgnwSign sign={convert.fsw2swu(round.clip)} size={72} />
                )}
              </div>
            </div>

            <div
              className={`rootshape-options${game.columnOrder ? " rootshape-options--column" : ""}`}
            >
              {game.answers.map((answer) => (
                <button
                  type="button"
                  key={answer.key}
                  className={optionClass(answer.key)}
                  disabled={answered}
                  onClick={() => choose(answer.key)}
                >
                  {answer.symbol && (
                    <sgnw-symbol
                      symbol={answer.symbol}
                      style={{ fontSize: 40 }}
                    ></sgnw-symbol>
                  )}
                  <span>{answer.name}</span>
                </button>
              ))}
            </div>

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {answered
                ? correct
                  ? `Correct! ${answerName} 🎉`
                  : `Not quite — it's ${answerName}`
                : ""}
            </p>

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(round.answerKey)}
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
