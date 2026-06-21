import { Figure } from "../components/Figure";

type PunctEntry = {
  slug: string;
  term: string;
  english: string;
  detail?: string;
};

const PUNCTUATION: PunctEntry[] = [
  {
    slug: "ch14-pause",
    term: "PAUSE",
    english: "similar to a Comma in English",
  },
  {
    slug: "ch14-end-of-sentence",
    term: "END OF SENTENCE",
    english: "similar to a Period in English",
  },
  {
    slug: "ch14-pause-before-end-of-phrase",
    term: "PAUSE BEFORE END OF PHRASE",
    english: "similar to a Semi-Colon in English",
  },
  {
    slug: "ch14-questioning-pause",
    term: "QUESTIONING PAUSE BEFORE END OF PHRASE",
    english: "similar to a Question Mark in English",
    detail:
      "When a sentence or phrase ends in a question, there is a slight pause at the end. The semi-colon symbol is used to write that pause at the end, but it must be combined with signs that write the grammatically necessary Facial Expressions and Head Movements that occur in sign languages when asking questions, including Head Forward and Eyebrows Up or Down.",
  },
  {
    slug: "ch14-pause-before-listing",
    term: "PAUSE BEFORE LISTING ITEMS",
    english: "similar to a Colon in English",
    detail:
      "This is used in the middle of a sentence, marking a new phrase that lists items 1, 2, 3 and so on.",
  },
  {
    slug: "ch14-pause-sub-phrase",
    term: "PAUSE BEFORE & AFTER A SUB-PHRASE",
    english: "similar to Parentheses in English",
    detail:
      "Marks a second thought inside a sentence, starting with the curved-up symbol and ending in the curved-down parentheses.",
  },
];

export function Ch14Punctuation() {
  return (
    <>
      <h2 id="chapter-14">Chapter 14 — Punctuation</h2>

      <dl className="punct-list">
        {PUNCTUATION.map((entry) => (
          <div className="punct-list__row" key={entry.slug}>
            <Figure src={`/figures/ch14/${entry.slug}.png`} />
            <div className="punct-list__body">
              <dt>{entry.term}</dt>
              <dd>
                ({entry.english})
                {entry.detail && (
                  <>
                    <br />
                    {entry.detail}
                  </>
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <h2>Punctuation Dynamics</h2>
      <p className="punct-subtitle">Sign Language sentences with feeling!</p>
      <div className="punct-dynamics">
        <div className="punct-dynamics__text">
          <p>
            SignWriting, like other writing systems, has punctuation. A dark
            line at the end of a SignWriting sentence is the equivalent to a
            period in English. It marks the end of the sentence or phrase. Two
            lines represent a pause, or comma.
          </p>
          <p>
            SignWriting can add more feeling to sentences by adding Dynamics
            Symbols to the Punctuation.
          </p>
          <p>
            The Fast Symbol represents a sentence executed quickly, with speed.
            This is similar to an Exclamation Point in English.
          </p>
          <p>
            Slow, Smooth, Tense and Relaxed Dynamic Symbols can also be placed
            near Punctuation Symbols to give the feeling of slow, smooth, tense
            or relaxed sentences.
          </p>
        </div>
        <Figure src="/figures/ch14/ch14-dynamics-chart.png" />
      </div>

      <h2>Reading Examples</h2>
      <p>
        Punctuation in context, written in vertical SignWriting columns. The
        Period and Pause lines close each thought; the annotations mark the
        Facial Expressions, Head Movements and Dynamics that carry the meaning.
      </p>

      <Figure
        src="/figures/ch14/ch14-asl-perspective.png"
        caption="English Translation: Writing ASL from the Deaf perspective."
      />

      <Figure
        src="/figures/ch14/ch14-where-house.png"
        caption="English Translation: Where is the house?"
      />

      <Figure
        src="/figures/ch14/ch14-goldilocks.png"
        caption="English Translation: Baby Bear asks “Who are you?” Goldilocks saw the bears, became frightened, shot out of the house, and ran all the way home."
      />
    </>
  );
}
