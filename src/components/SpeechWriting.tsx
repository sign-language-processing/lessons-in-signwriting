import { useEffect, useState } from "react";
import { convert } from "@sutton-signwriting/core";
import { SgnwSign } from "./Sgnw";
import mouthingData from "../content/mouthing.json";

// The mouthing table, copied from signwriting/mouthing/mouthing.json upstream.
type Mouthing = {
  writing: string;
  grapheme: string;
  example: string;
  description: string;
  instruction: string;
  alternatives?: string[];
};

const ROWS = Object.entries(mouthingData as Record<string, Mouthing>);

const API = "https://signwriting.nagish.io/mouthing";

// epitran codes the endpoint answers for; the rest error or pass Latin through.
const LANGS = [
  { code: "eng-Latn", name: "English" },
  { code: "deu-Latn", name: "German" },
  { code: "fra-Latn", name: "French" },
  { code: "nld-Latn", name: "Dutch" },
  { code: "por-Latn", name: "Portuguese" },
  { code: "swe-Latn", name: "Swedish" },
  { code: "pol-Latn", name: "Polish" },
  { code: "ron-Latn", name: "Romanian" },
  { code: "tur-Latn", name: "Turkish" },
  { code: "vie-Latn", name: "Vietnamese" },
  { code: "ind-Latn", name: "Indonesian" },
];

const EXAMPLES = [
  { text: "hello", lang: "eng-Latn" },
  { text: "SignWriting", lang: "eng-Latn" },
  { text: "Hallo", lang: "deu-Latn" },
];

type Result = { ipa: string; fsw: string | null };

const cache = new Map<string, Result>();

async function mouth(text: string, lang: string): Promise<Result> {
  const key = `${lang}|${text}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const res = await fetch(
    `${API}?text=${encodeURIComponent(text)}&spoken_language=${lang}`,
  );
  const data = (await res.json()) as { ipa?: string; fsw?: string | null };
  const result = { ipa: data.ipa ?? "", fsw: data.fsw ?? null };
  cache.set(key, result);
  return result;
}

function MouthedWord({ text, lang }: { text: string; lang: string }) {
  const [result, setResult] = useState<Result | "error" | null>(null);

  useEffect(() => {
    let live = true;
    setResult(null);
    mouth(text, lang)
      .then((r) => live && setResult(r))
      .catch(() => live && setResult("error"));
    return () => {
      live = false;
    };
  }, [text, lang]);

  if (result === null)
    return <span className="speechwriting-out__pending">…</span>;
  if (result === "error")
    return (
      <span className="speechwriting-out__pending">couldn&rsquo;t load</span>
    );
  return (
    <>
      <code className="speechwriting-ipa">/{result.ipa}/</code>
      {result.fsw ? (
        <SgnwSign sign={convert.fsw2swu(result.fsw)} size={48} />
      ) : (
        <span className="speechwriting-out__pending">
          no SpeechWriting for these sounds
        </span>
      )}
    </>
  );
}

function TryIt() {
  const [text, setText] = useState("hello");
  const [lang, setLang] = useState("eng-Latn");
  const [asked, setAsked] = useState<{ text: string; lang: string } | null>({
    text: "hello",
    lang: "eng-Latn",
  });

  return (
    <div className="speechwriting-try">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) setAsked({ text: text.trim(), lang });
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a word"
          aria-label="Word to mouth"
        />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label="Spoken language"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
        <button type="submit">Write it</button>
      </form>
      {asked && (
        <div className="speechwriting-out">
          <MouthedWord
            key={`${asked.lang}|${asked.text}`}
            text={asked.text}
            lang={asked.lang}
          />
        </div>
      )}
    </div>
  );
}

export function SpeechWriting() {
  return (
    <section className="face-section" id="speechwriting">
      <h3>SpeechWriting</h3>
      <p>
        The mouth symbols above write what the mouth <em>does</em>. There is also
        a way to write what the mouth <em>says</em>:{" "}
        <strong>SpeechWriting</strong> (German{" "}
        <em lang="de">Mundbildschrift</em>), invented by{" "}
        <strong>Stefan Wöhrmann</strong> for articulation training with deaf
        children. Each sound of the spoken language gets its own symbol, so a
        mouthed word can be written out sound by sound and read back as a
        sequence of mouth pictures.
      </p>
      <p>
        It is spelled by <em>sound</em>, not by letters: German{" "}
        <em lang="de">Vater</em> starts with the <code>f</code> symbol, because
        that is what the mouth does. Below, the symbols are drawn as SignWriting
        mouth symbols, written left to right inside one sign.
      </p>

      <h4>Examples</h4>
      <div className="speechwriting-examples">
        {EXAMPLES.map((ex) => (
          <figure key={`${ex.lang}|${ex.text}`}>
            <div className="speechwriting-out">
              <MouthedWord text={ex.text} lang={ex.lang} />
            </div>
            <figcaption>{ex.text}</figcaption>
          </figure>
        ))}
      </div>

      <h4>The symbols</h4>
      <p>
        {ROWS.length} sounds, with the German spellings and example words from
        Wöhrmann&rsquo;s charts. The spellings are German, but the sounds are
        IPA, so the table reads for any spoken language.
      </p>
      <div className="speechwriting-table-wrap">
        <table className="speechwriting-table">
          <thead>
            <tr>
              <th>IPA</th>
              <th>SignWriting</th>
              <th>Spelled</th>
              <th>Example words</th>
              <th>Sounds like</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([ipa, info]) => (
              <tr key={ipa}>
                <td>
                  <code className="speechwriting-ipa">
                    {[ipa, ...(info.alternatives ?? [])].join(" / ")}
                  </code>
                </td>
                <td>
                  <SgnwSign sign={convert.fsw2swu(info.writing)} size={40} />
                </td>
                <td>{info.grapheme}</td>
                <td lang="de">{info.example}</td>
                <td>
                  {info.description}
                  <span className="speechwriting-instruction">
                    {info.instruction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>Try it</h4>
      <p>
        Type a word and the server transcribes it to IPA, then writes each sound
        in SignWriting.
      </p>
      <TryIt />

      <p className="speechwriting-source">
        Standards:{" "}
        <a href="https://www.gebaerdenschrift.de/read/Mundbilder/uebersicht_mundbilder.htm">
          2002
        </a>
        ,{" "}
        <a href="https://www.signwriting.org/archive/docs7/sw0642_%DCbersicht_Symbole_der_Mundbildschrift_2010.pdf">
          2010
        </a>
        ,{" "}
        <a href="https://www.signwriting.org/symposium/archive/sws0002_05_Overview_of_Symbols_in_Mundbildschrift_Juli_2014.pdf">
          2014
        </a>
        . Spelling rules:{" "}
        <a href="https://www.signwriting.org/symposium/archive/sws0002_02_Mundbilder_in_SignWriting_and_Spelling_rules.pdf">
          Wöhrmann (2014)
        </a>
        . Table and endpoint from{" "}
        <a href="https://github.com/sign-language-processing/signwriting">
          sign-language-processing/signwriting
        </a>
        .
      </p>
    </section>
  );
}
