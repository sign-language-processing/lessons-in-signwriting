import { useMemo, useState } from "react";
import fingerspelling from "../content/fingerspelling.generated.json";
import signVideos from "../content/fingerspelling-videos.generated.json";
import { SgnwSign, SgnwSymbol } from "./Sgnw";

const VIDEOS: Record<string, string> = signVideos;

type SingleSign = { fsw: string; single: true; symbol: string };
type MultiSign = { fsw: string; single: false; swu: string };
type Sign = SingleSign | MultiSign;

type Entry = { letter: string; signs: Sign[] };

type Language = {
  code: string;
  label: string;
  description: string;
  entries: Entry[];
};

const DATA = fingerspelling as { languages: Language[] };
const DEFAULT_CODE = "en-us-ase-asl";

function Cell({ entry }: { entry: Entry }) {
  return (
    <li className="fingerspelling__cell">
      <span className="fingerspelling__letter">{entry.letter}</span>
      <span className="fingerspelling__signs">
        {entry.signs.map((sign, i) =>
          sign.single ? (
            <SgnwSymbol key={i} symbol={sign.symbol} size={36} />
          ) : (
            <SgnwSign key={i} sign={sign.swu} video={VIDEOS[sign.swu]} size={36} />
          ),
        )}
      </span>
    </li>
  );
}

function Alphabet({ language }: { language: Language }) {
  return (
    <div className="fingerspelling__alphabet">
      {language.description ? (
        <p className="fingerspelling__description">{language.description}</p>
      ) : null}
      <ul className="fingerspelling__grid">
        {language.entries.map((entry) => (
          <Cell key={entry.letter} entry={entry} />
        ))}
      </ul>
    </div>
  );
}

export function Fingerspelling() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const language = useMemo(
    () =>
      DATA.languages.find((l) => l.code === code) ??
      DATA.languages.find((l) => l.code === DEFAULT_CODE)!,
    [code],
  );
  const defaultLanguage = useMemo(
    () => DATA.languages.find((l) => l.code === DEFAULT_CODE)!,
    [],
  );

  return (
    <>
      <div className="fingerspelling screen-only">
        <div className="fingerspelling__controls" data-no-print>
          <label htmlFor="fingerspelling-language">Language:</label>
          <select
            id="fingerspelling-language"
            value={language.code}
            onChange={(e) => setCode(e.target.value)}
          >
            {DATA.languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <Alphabet language={language} />
      </div>

      <div className="fingerspelling print-only">
        <Alphabet language={defaultLanguage} />
      </div>
    </>
  );
}
