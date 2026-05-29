import { Figure } from "../components/Figure";
import { SignFigure } from "../components/SignFigure";
import { Row } from "../components/Layout";

const FIG = "/figures/ch13";

const MOVEMENT_SYMBOLS = [
  {
    slug: "simultaneous",
    title: "Simultaneous Line",
    body: "Both hands move at the same time.",
  },
  {
    slug: "alternating",
    title: "Alternating Lines",
    body: "The right hand moves in one direction, while the left moves simultaneously in the opposite direction.",
  },
  {
    slug: "uneven",
    title: "Un-Even Alternating — One Moves While The Other One Is Still",
    body: "The right hand moves while the left remains still. Then the left moves while the right remains still.",
  },
  { slug: "slow", title: "Slow Movement" },
  { slug: "smooth", title: "Smooth Movement" },
  { slug: "fast", title: "Fast Movement" },
  { slug: "fast-emphasis", title: "Fast Movement with Emphasis" },
  { slug: "tense", title: "Tense Movement" },
  { slug: "tense-emphasis", title: "Tense Movement with Emphasis" },
  { slug: "relaxed", title: "Relaxed Movement" },
  { slug: "relaxed-emphasis", title: "Relaxed Movement with Emphasis" },
];

const BED_PLACEMENTS = [
  {
    slug: "ch13-bed-left",
    body: "This bed is placed to the left side. It is established in the left space, to the left of the facial expression. The lips tense as the classifier is placed in space.",
  },
  {
    slug: "ch13-bed-center",
    body: "This bed is placed in the center. It is established in the center space, directly under the facial expression. The lips tense as the classifier is placed in space.",
  },
  {
    slug: "ch13-bed-right",
    body: "This bed is placed to the right side. It is established in the right space, to the right of the facial expression. The lips tense as the classifier is placed in space.",
  },
];

export function Ch13Dynamics() {
  return (
    <>
      <h2 id="chapter-13">Chapter 13 — Dynamics</h2>
      <Figure
        src={`${FIG}/ch13-classroom-photo.png`}
        caption="Dynamics symbols mark the speed, timing and quality of movement, handshapes, faces and whole phrases."
      />

      <h2>Dynamics Symbols</h2>
      <ol className="dyn-categories">
        <li>
          <p>
            <strong>Movement Dynamics</strong> are small symbols placed near
            movement arrows. They indicate movement that is fast, slow, smooth,
            tense, relaxed, simultaneous, alternating, and uneven-alternating.
          </p>
          <Figure src={`${FIG}/ch13-cat-movement.png`} />
        </li>
        <li>
          <p>
            <strong>Handshape Dynamics</strong> mark <strong>classifiers</strong>.
            They mark a hand that is held in one place for a long time.
          </p>
          <Figure src={`${FIG}/ch13-cat-handshape.png`} />
        </li>
        <li>
          <p>
            <strong>Facial Dynamics</strong> show tense or relaxed facial
            muscles. The Tense Symbol is used for lips that press together, for
            raised cheeks, and for squeezed eyes.
          </p>
          <Figure src={`${FIG}/ch13-cat-facial.png`} />
        </li>
        <li>
          <p>
            <strong>Punctuation Dynamics</strong> show the speed, timing and
            quality of entire phrases and sentences.
          </p>
          <Figure src={`${FIG}/ch13-cat-punctuation.png`} />
        </li>
        <li>
          <p>
            <strong>Unit Dynamics</strong> marks the influence of one symbol on
            a whole group of signs. The Unit-Connecting Line is used to show one
            facial expression influencing several signs.
          </p>
          <Figure src={`${FIG}/ch13-cat-unit.png`} />
        </li>
      </ol>

      <h2>Movement Dynamics</h2>
      <dl className="dyn-list">
        {MOVEMENT_SYMBOLS.map((symbol) => (
          <div className="dyn-list__row" key={symbol.slug}>
            <img
              className="dyn-list__symbol"
              src={`${FIG}/ch13-move-${symbol.slug}.png`}
              alt=""
            />
            <div className="dyn-list__text">
              <dt>{symbol.title}</dt>
              {symbol.body && <dd>{symbol.body}</dd>}
            </div>
          </div>
        ))}
      </dl>

      <h2>Handshape Dynamics — Writing Classifiers</h2>
      <Row>
        <div style={{ flex: 2, textAlign: "left" }}>
          <p>
            <strong>Classifiers</strong> are written with the handshape, plus a{" "}
            <strong>Classifier Marker</strong>. The Classifier Marker is a
            Tension Symbol. It is placed under the handshape.
          </p>
          <p>
            In this sentence, Goldilocks sees a bowl of porridge. The bowl is
            established in space by a feeling of tension, a little like the
            feeling of placing something on a table. It anchors the visual
            picture of a bowl in space. The Tension Symbol marks that feeling.
            It is always placed under the handshapes.
          </p>
          <p>
            Once the classifier is established, one hand continues to mark the
            classifier, held in the same position, while the other hand does
            other signs. The Tension Symbol remains under the hand that{" "}
            <strong>marks the classifier</strong>.
          </p>
          <p>
            Goldilocks is discussing the porridge. She is saying that she sees
            the bowl, and then eats the porridge from it. But the porridge is
            too <strong>hot</strong>!!
          </p>
        </div>
        <div>
          <Figure src={`${FIG}/ch13-handshape-sequence.png`} />
        </div>
      </Row>

      <h2>Facial Dynamics Related To Handshape Dynamics</h2>
      <p>
        <strong>Facial expressions</strong> are essential to writing Sign
        Language stories and literature. They mark grammar and emphasis. The
        Tense Lips symbol shows the dynamics of the lips tensing as the hand is
        established in space by a classifier. Tension on the lips and near the
        hands are oftentimes written together.
      </p>
      <p>
        <strong>Below:</strong> The Classifier for "bed" in American Sign
        Language is written with a Tension Symbol under the handshape to mark
        the classifier. At the same time, the lips also tense, giving the
        feeling of "anchoring the classifier" in space.
      </p>
      <Row>
        {BED_PLACEMENTS.map((placement) => (
          <div key={placement.slug}>
            <Figure src={`${FIG}/${placement.slug}.png`} />
            <p>{placement.body}</p>
          </div>
        ))}
      </Row>
      <p>
        The "bed" classifier on its own is a complete sign in American Sign
        Language:
      </p>
      <div className="examples-row">
        <SignFigure slug="ch13-bed" />
      </div>

      <h2>Unit Dynamics — Unit-Connecting Lines</h2>
      <Row>
        <div style={{ flex: 2 }}>
          <p>Influence is written with a Unit-Connecting Line.</p>
          <p>
            The Unit-Connecting Line is useful for Sign Language researchers. It
            is used to show the influence of one facial expression on a group of
            signs.
          </p>
          <p>
            When one symbol influences a group of symbols or signs, the symbol
            that is influencing the group is written first. Then a line is
            written, like a bracket, connecting the symbol with the group it
            influences.
          </p>
          <p>
            When SignWriting is written vertically, the Unit-Connecting Line is
            written to the side of the vertical column, as shown here. The Unit
            Line is grey or lighter than the signs.
          </p>
          <p>
            In Spain, the Unit-Connecting Line is used for horizontal
            SignWriting literature. When writing horizontally, the
            Unit-Connecting Line is written under or over the writing.
          </p>
          <p>
            In Sutton DanceWriting, the Unit-Connecting Line is used often to
            show the influence of one movement symbol on a group of other
            symbols. In SignWriting, it is rarely used for everyday use.
          </p>
        </div>
        <div>
          <Figure src={`${FIG}/ch13-unit-column.png`} />
        </div>
      </Row>
    </>
  );
}
