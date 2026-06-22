import { useEffect, useRef, useState } from "react";
import { convert } from "@sutton-signwriting/core";
import { asset } from "../lib/asset";
import { SgnwSign } from "./Sgnw";
import { PracticeHistory } from "./GameHistory";
import { DialogCloseButton, PracticeLaunchCard } from "./PracticeChrome";
import { recordAttempt } from "../lib/gameStats";
import {
  buildWritingRound,
  gradeWriting,
  WRITING_MODES,
  type WritingRound,
} from "../lib/writingPractice";

const GAME_ID = "writing";

// The deployed SignMaker honours `#?fsw=` on load and `postMessage({fsw})` after,
// and posts `{signmaker:"save", fsw, swu}` to us when the learner saves.
// ponytail: if a future deploy drops that bridge, vendor sign-language-processing/
// signmaker into public/signmaker (built with our Pages base) and point here.
const SIGNMAKER_URL = "https://www.sutton-signwriting.io/signmaker/";
const SIGNMAKER_ORIGIN = "https://www.sutton-signwriting.io";

const buildSrc = (fsw: string) =>
  `${SIGNMAKER_URL}#?ui=en&fsw=${encodeURIComponent(fsw)}`;

export function WritingPractice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const [src, setSrc] = useState<string | null>(null);
  const [mode, setMode] = useState(WRITING_MODES[0]!.key);
  const [round, setRound] = useState<WritingRound | null>(null);
  const roundRef = useRef<WritingRound | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [userFsw, setUserFsw] = useState<string | null>(null);

  const postFsw = (fsw: string) =>
    iframeRef.current?.contentWindow?.postMessage({ fsw }, SIGNMAKER_ORIGIN);

  function startRound(modeKey: string, prevSign?: string) {
    const next = buildWritingRound(modeKey, prevSign);
    roundRef.current = next;
    setRound(next);
    setResult(null);
    setUserFsw(null);
    return next;
  }

  function open() {
    const next = startRound(mode);
    if (!src) setSrc(buildSrc(next.start));
    else if (readyRef.current) postFsw(next.start);
    dialogRef.current?.showModal();
  }

  function chooseMode(modeKey: string) {
    setMode(modeKey);
    const next = startRound(modeKey);
    if (readyRef.current) postFsw(next.start);
  }

  function next() {
    const n = startRound(mode, round?.sign);
    if (readyRef.current) postFsw(n.start);
  }

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== SIGNMAKER_ORIGIN) return;
      const data = event.data as { signmaker?: string; fsw?: string } | null;
      if (data?.signmaker !== "save" || !data.fsw) return;
      const current = roundRef.current;
      if (!current) return;
      const ok = gradeWriting(data.fsw, current);
      setUserFsw(data.fsw);
      setResult(ok ? "correct" : "wrong");
      recordAttempt(GAME_ID, {
        correct: ok,
        question: current.sign,
        questionType: "video",
        chosen: data.fsw,
        answer: current.sign,
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleLoad = () => {
    readyRef.current = true;
    if (round) postFsw(round.start);
  };

  const stateClass = result ? (result === "correct" ? "is-correct" : "is-wrong") : "";

  return (
    <>
      <PracticeLaunchCard
        label="✍️ Writing Practice"
        hint="Watch a sign, then write the missing part in the SignWriting keyboard."
        onClick={open}
      />

      <dialog
        ref={dialogRef}
        closedby="any"
        className={`practice-dialog writing-dialog ${stateClass}`}
        aria-labelledby="writing-practice-title"
      >
        <div className="writing-grid">
          <div className="writing-panel">
            <DialogCloseButton />
            <PracticeHistory game={GAME_ID} title="Writing Practice" />

            <h2 id="writing-practice-title">Writing Practice</h2>

            <div className="writing-modes" role="group" aria-label="What to write">
              {WRITING_MODES.map((m) => (
                <button
                  type="button"
                  key={m.key}
                  className={mode === m.key ? "is-active" : undefined}
                  aria-pressed={mode === m.key}
                  onClick={() => chooseMode(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <p className="practice-prompt">
              {round?.mode.instruction} Watch the sign, build it in the keyboard,
              then press <strong>Save</strong> to check.
            </p>

            <p className="writing-label">The sign</p>
            {round && (
              <video
                key={round.sign}
                className="quiz-video"
                src={asset(`/videos/whatsthatsign/${round.sign}.mp4`)}
                autoPlay
                loop
                muted
                playsInline
              />
            )}

            {result && round && (
              <div className="writing-answer">
                <div>
                  <p className="writing-label">Correct writing</p>
                  <SgnwSign sign={convert.fsw2swu(round.sign)} size={48} />
                </div>
                {userFsw && (
                  <div>
                    <p className="writing-label">You wrote</p>
                    <SgnwSign sign={convert.fsw2swu(userFsw)} size={48} />
                  </div>
                )}
              </div>
            )}

            <p className={`quiz-feedback ${stateClass}`} role="status">
              {result === "correct"
                ? "Correct! 🎉"
                : result === "wrong"
                  ? "Not quite — compare your writing with the answer."
                  : ""}
            </p>

            <div className="practice-actions">
              <button type="button" className="practice-next" onClick={next}>
                {result ? "Next sign →" : "Skip →"}
              </button>
            </div>
          </div>

          <div className="writing-frame">
            {src && (
              <iframe
                ref={iframeRef}
                src={src}
                title="SignWriting keyboard"
                onLoad={handleLoad}
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
