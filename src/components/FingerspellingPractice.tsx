import { useRef, useState, type FormEvent } from "react";
import { convert } from "@sutton-signwriting/core";
import { SgnwSign } from "./Sgnw";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard, useDialogClose } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import {
  fetchFingerspelling,
  FS_LANGS,
  normalizeAnswer,
  randomWord,
  type FsLang,
} from "../lib/fingerspellingGame";

const GAME_ID = "fingerspelling";

type Round = { word: string; fsw: string };

export function FingerspellingPractice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lang, setLang] = useState<FsLang>(FS_LANGS[0]!);
  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [value, setValue] = useState("");
  const [chosen, setChosen] = useState<string | null>(null);
  const reqId = useRef(0);

  async function start(forLang: FsLang, prevWord?: string) {
    const id = ++reqId.current;
    setRound(null);
    setChosen(null);
    setValue("");
    setFailed(false);
    setLoading(true);
    const word = randomWord(prevWord);
    const fsw = await fetchFingerspelling(forLang.signed, word);
    if (id !== reqId.current) return; // a newer round superseded this fetch
    setLoading(false);
    if (fsw) setRound({ word, fsw });
    else setFailed(true);
  }

  function open() {
    dialogRef.current?.showModal();
    void start(lang);
  }

  useDialogClose(dialogRef, () => {
    reqId.current++;
    setRound(null);
  });

  function chooseLang(next: FsLang) {
    setLang(next);
    void start(next);
  }

  const answered = chosen !== null;
  const correct = answered && !!round && normalizeAnswer(chosen) === normalizeAnswer(round.word);
  const stateClass = answered ? (correct ? "is-correct" : "is-wrong") : "";

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!round || answered || !value.trim()) return;
    setChosen(value);
    recordAttempt(GAME_ID, {
      correct: normalizeAnswer(value) === normalizeAnswer(round.word),
      question: round.fsw,
      chosen: value.trim(),
      answer: round.word,
    });
  }

  return (
    <>
      <PracticeLaunchCard
        label="🔤 Fingerspelling Practice"
        hint="Read a fingerspelled word and type what it spells."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog ${stateClass}`}
        aria-labelledby="fingerspelling-title"
      >
        <div className="practice-body">
          <DialogCloseButton />
          <PracticeHistory game={GAME_ID} title="Fingerspelling Practice" />

          <h2 id="fingerspelling-title">Fingerspelling Practice</h2>

          <select
            className="fingerspell-select"
            aria-label="Signed language"
            value={lang.signed}
            onChange={(e) =>
              chooseLang(FS_LANGS.find((l) => l.signed === e.target.value) ?? FS_LANGS[0]!)
            }
          >
            {FS_LANGS.map((l) => (
              <option key={l.signed} value={l.signed}>
                {l.name}
              </option>
            ))}
          </select>

          <p className="practice-prompt">What is fingerspelled here?</p>

          <div className="rootshape-stimulus">
            {round ? (
              <SgnwSign sign={convert.fsw2swu(round.fsw)} size={64} />
            ) : (
              <span className="fingerspell-status">
                {loading ? "Loading…" : failed ? "Couldn't load — skip ahead." : ""}
              </span>
            )}
          </div>

          <form className="fingerspell-form" onSubmit={submit}>
            <input
              type="text"
              className="fingerspell-input"
              placeholder="Type the word"
              value={chosen ?? value}
              onChange={(e) => setValue(e.target.value)}
              disabled={answered || !round}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button type="submit" className="practice-next" disabled={answered || !round}>
              Check
            </button>
          </form>

          <p className={`quiz-feedback ${stateClass}`} role="status">
            {answered
              ? correct
                ? "Correct! 🎉"
                : `Not quite — it spells "${round?.word}"`
              : ""}
          </p>

          <div className="practice-actions">
            <button
              type="button"
              className="practice-next"
              onClick={() => start(lang, round?.word)}
            >
              {answered || failed ? "Next word →" : "Skip →"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
