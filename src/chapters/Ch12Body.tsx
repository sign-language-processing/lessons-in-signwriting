import { figures } from "../content/figures";
import { asset } from "../lib/asset";

const SHOULDER_ITEMS = [
  "ch12-shoulder-shoulders",
  "ch12-shoulder-right-shoulder-up",
  "ch12-shoulder-both-shoulders-up",
  "ch12-shoulder-right-shoulder-down",
  "ch12-shoulder-both-shoulders-down",
  "ch12-shoulder-one-up-one-down",
  "ch12-shoulder-shoulder-moves-up",
  "ch12-shoulder-shoulder-moves-up-diagonal",
  "ch12-shoulder-shoulder-moves-down-diagonal",
  "ch12-shoulder-shoulder-moves-down",
  "ch12-shoulder-shoulder-moves-forward",
  "ch12-shoulder-shoulder-moves-forward-diagonal",
  "ch12-shoulder-shoulder-moves-back-diagonal",
  "ch12-shoulder-shoulder-moves-back",
  "ch12-shoulder-shoulder-moves-up-down",
  "ch12-shoulder-shoulder-moves-forward-back",
];

const TORSO_ITEMS = [
  "ch12-torso-pulls-up",
  "ch12-torso-sinks-down",
  "ch12-torso-curve-up-side",
  "ch12-torso-bends-left",
  "ch12-torso-twists-left",
  "ch12-torso-twists-right",
  "ch12-ribcage-tilts-forward",
  "ch12-ribcage-tilts-forward-diagonal",
  "ch12-ribcage-tilts-side",
  "ch12-ribcage-tilts-back-diagonal",
  "ch12-ribcage-tilts-back",
  "ch12-ribcage-rocks-back-forward",
  "ch12-ribcage-rocks-back-forward-back",
];

function SymbolRow({ slug }: { slug: string }) {
  const fig = figures[slug];
  if (!fig?.illustration) return null;
  return (
    <div className="ch12-ref__row">
      <span className="ch12-ref__symbol">
        <img src={asset(fig.illustration)} alt="" />
      </span>
      <span className="ch12-ref__label">{fig.word}</span>
    </div>
  );
}

function SymbolList({ slugs }: { slugs: string[] }) {
  return (
    <div className="ch12-ref">
      {slugs.map((slug) => (
        <SymbolRow key={slug} slug={slug} />
      ))}
    </div>
  );
}

export function Ch12Body() {
  return (
    <>
      <h2 id="chapter-12">Chapter 12 — The Body</h2>
      <figure className="ch12-cover">
        <img
          className="ch12-cover__photo"
          src={asset("/figures/ch12/ch12-cover-photo.png")}
          alt="A signer raising both shoulders to demonstrate body movement"
        />
        <img
          className="ch12-cover__glyph"
          src={asset("/figures/ch12/ch12-the-body-glyph.png")}
          alt="The SignWriting symbol for the body"
        />
      </figure>

      <h2>Shoulder Positions &amp; Movements</h2>
      <SymbolList slugs={SHOULDER_ITEMS} />

      <h2>Torso (Upper Body) Positions &amp; Movements</h2>
      <SymbolList slugs={TORSO_ITEMS} />

      <h2>Upper Body Tilts</h2>
      <p className="ch12-subhead">Rocking Motion from the Hip Joint</p>
      <p>
        The upper body tilts or rocks back and forth. The neck and torso do not
        bend. They remain straight, moving in a unit from the hip joints.
      </p>
      <figure className="ch12-tilts">
        <img
          src={asset("/figures/ch12/ch12-upper-body-tilts.png")}
          alt="Grid of circle-and-arrow symbols showing every direction the upper body tilts and rocks from the hip joint"
        />
      </figure>
    </>
  );
}
