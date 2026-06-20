import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          🌱 {t("ui.rootPracticeTitle")}
        </button>
        <p className="practice-launch__hint">{t("ui.rootPracticeHint")}</p>
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
              <button
                type="submit"
                aria-label={t("common.close")}
                className="practice-close"
              >
                ×
              </button>
            </form>

            <h2 id="rootshape-practice-title">{t("ui.rootPracticeTitle")}</h2>

            <div
              className="rootshape-difficulty"
              role="group"
              aria-label={t("ui.difficulty")}
            >
              {(["easy", "hard"] as const).map((level) => (
                <button
                  type="button"
                  key={level}
                  className={difficulty === level ? "is-active" : undefined}
                  aria-pressed={difficulty === level}
                  onClick={() => setDifficulty(level)}
                >
                  {level === "easy" ? t("ui.easy") : t("ui.hard")}
                </button>
              ))}
            </div>

            <p className="practice-prompt">{t("ui.rootPrompt")}</p>

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
                  {correct ? t("ui.correct") : t("ui.notQuite")}
                </p>
                <p className="practice-result__detail">
                  {t("ui.rootResult", {
                    name: round.name,
                    answer: round.answer,
                  })}
                </p>
              </div>
            )}

            <div className="practice-actions">
              <button
                type="button"
                className="practice-next"
                onClick={() => start(randomPracticeSymbol(round.symbol))}
              >
                {answered ? t("ui.nextHand") : t("ui.skip")}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
