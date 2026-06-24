import { useRef, useState } from "react";
import { convert } from "@sutton-signwriting/core";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import {
  ALPHABET_LANGS,
  randomLetterRound,
  type LetterOption,
  type LetterRound,
} from "../lib/fingerspellingAlphabet";

const GAME_ID = "fingerspelling-alphabet";

export function FingerspellingAlphabetGame() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [code, setCode] = useState(ALPHABET_LANGS[0]!.code);
  const [round, setRound] = useState<LetterRound | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  function start(forCode: string, prevLetter?: string) {
    setRound(randomLetterRound(forCode, prevLetter));
    setChosen(null);
  }

  function open() {
    start(code);
    dialogRef.current?.showModal();
  }

  useDialogClose(dialogRef, () => setRound(null));

  function chooseLang(nextCode: string) {
    setCode(nextCode);
    start(nextCode);
  }

  const answered = chosen !== null;
  const correct = answered && chosen === round?.letter;
  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";

  function choose(option: LetterOption) {
    if (answered || !round) return;
    setChosen(option.letter);
    recordAttempt(GAME_ID, {
      correct: option.letter === round.letter,
      question: round.letter.toUpperCase(),
      chosen: option.fsw,
      answer: round.options.find((o) => o.letter === round.letter)?.fsw ?? "",
    });
  }

  const tileClass = (option: LetterOption) => {
    const classes = ["reading-tile"];
    if (!answered) return classes.join(" ");
    if (option.letter === round?.letter) classes.push("is-correct");
    else if (option.letter === chosen) classes.push("is-wrong");
    return classes.join(" ");
  };

  return (
    <>
      <PracticeLaunchCard
        label="🔠 Fingerspelling Letters"
        hint="See a letter and pick its handshape."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${stateClass}`}
        aria-labelledby="fingerspelling-alphabet-title"
      >
        {round && (
          <div className="practice-body">
            <DialogCloseButton />
            <PracticeHistory game={GAME_ID} title="Fingerspelling Letters" />

            <h2 id="fingerspelling-alphabet-title">Fingerspelling Letters</h2>

            <select
              className="fingerspell-select"
              aria-label="Signed language"
              value={code}
              onChange={(e) => chooseLang(e.target.value)}
            >
              {ALPHABET_LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            <p className="practice-prompt">
              Which handshape spells{" "}
              <strong className="fingerspell-letter">{round.letter.toUpperCase()}</strong>?
            </p>

            <div className="reading-options">
              {round.options.map((option) => (
                <button
                  type="button"
                  key={option.letter}
                  className={tileClass(option)}
                  disabled={answered}
                  onClick={() => choose(option)}
                >
                  <sgnw-sign sign={convert.fsw2swu(option.fsw)} style={{ fontSize: 48 }}></sgnw-sign>
                </button>
              ))}
            </div>

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {answered ? (correct ? "Correct! 🎉" : "Not quite — the highlighted one is right.") : ""}
            </p>

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(code, round.letter)}
              >
                {answered ? "Next letter →" : "Skip →"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
