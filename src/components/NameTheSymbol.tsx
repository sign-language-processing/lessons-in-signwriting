import { useRef, useState } from "react";
import { asset } from "../lib/asset";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import {
  nameOptions,
  randomItem,
  type NameGame,
  type NameItem,
} from "../lib/nameGames";

type Round = { item: NameItem };

function buildRound(game: NameGame, prev?: NameItem): Round {
  return { item: randomItem(game, prev) };
}

export function NameTheSymbol({ game }: { game: NameGame }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  function start(prev?: NameItem) {
    setRound(buildRound(game, prev));
    setChosen(null);
  }

  function open() {
    start();
    dialogRef.current?.showModal();
  }

  useDialogClose(dialogRef, () => setRound(null));

  const answered = chosen !== null;
  const correct = answered && chosen === round?.item.name;
  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";

  const optionClass = (name: string) => {
    const classes = ["rootshape-option"];
    if (!answered) return classes.join(" ");
    if (name === round?.item.name) classes.push("is-correct");
    else if (name === chosen) classes.push("is-wrong");
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
        aria-labelledby="name-practice-title"
      >
        {round && (
          <div className="practice-body">
            <DialogCloseButton />

            <h2 id="name-practice-title">{game.title}</h2>
            <p className="practice-prompt">{game.prompt}</p>

            <div className="rootshape-stimulus">
              {round.item.symbol && (
                <sgnw-symbol
                  symbol={round.item.symbol}
                  style={{ fontSize: 110 }}
                ></sgnw-symbol>
              )}
              {round.item.image && <img src={asset(round.item.image)} alt="" />}
            </div>

            <div className="rootshape-options">
              {nameOptions(game).map((name) => (
                <button
                  type="button"
                  key={name}
                  className={optionClass(name)}
                  disabled={answered}
                  onClick={() => setChosen(name)}
                >
                  <span>{name}</span>
                </button>
              ))}
            </div>

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {answered
                ? correct
                  ? `Correct! ${round.item.name} 🎉`
                  : `Not quite — it's ${round.item.name}`
                : ""}
            </p>

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(round.item)}
              >
                {answered ? "Next →" : "Skip →"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
