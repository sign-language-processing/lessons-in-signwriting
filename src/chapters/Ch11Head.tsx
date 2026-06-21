import { key2swu } from "@sutton-signwriting/core/convert";
import { SgnwSign, SgnwSymbol } from "../components/Sgnw";
import { move, rot, RotationGrid, type RotSet } from "../components/RotationTiles";

const sym = (spec: string): string => key2swu(`S${spec}00`);

type Tile = { spec: string; name: string };

const VIEWPOINTS: Tile[] = [
  { spec: "2ff00", name: "Front View" },
  { spec: "2ff02", name: "Back View" },
  { spec: "2ff33", name: "Side View, facing right" },
  { spec: "2ff31", name: "Side View, facing left" },
  { spec: "2ff20", name: "Top View, facing front" },
  { spec: "2ff21", name: "Top View, facing diagonal" },
  { spec: "2ff23", name: "Top View, facing diagonal" },
];

// Contact Center: the Touch star (S205) centered on each viewpoint (composed
// with signwriting canonicalize so the star sits at the head's center).
const CONTACT: Tile[] = [
  { spec: "𝠃𝤘𝤘񋾡𝣴𝣴񆇡𝤁𝤁", name: "Front of Face" },
  { spec: "𝠃𝤜𝤙񋾣𝣰𝣴񆇡𝤁𝤁", name: "Back of Head" },
  { spec: "𝠃𝤜𝤙񋿔𝣱𝣴񆇡𝤁𝤁", name: "Side of Head, right" },
  { spec: "𝠃𝤜𝤙񋿒𝣱𝣴񆇡𝤁𝤁", name: "Side of Head, left" },
  { spec: "𝠃𝤞𝤙񋿁𝣮𝣴񆇡𝤁𝤁", name: "Top of Head, front" },
  { spec: "𝠃𝤛𝤛񋿂𝣱𝣱񆇡𝤁𝤁", name: "Top of Head, diagonal" },
  { spec: "𝠃𝤛𝤛񋿄𝣱𝣱񆇡𝤁𝤁", name: "Top of Head, diagonal" },
];

// Rim of Head & Face — the rim (S300 front, S384 fills for the other views)
// rotated around the head.
const RIM: RotSet[] = [
  rot("3000", "Rim of the Face", 8),
  rot("3843", "Rim of the Back of the Head", 8),
  rot("3841", "Rim of the Top of the Head", 8),
  rot("3844", "Rim of the Side of the Head", 8),
];
const RELATING: RotSet[] = [rot("3840", "Relating to the Head", 8)];

const HEAD_DIRECTION: RotSet[] = [
  move("301", "Straight, Wall Plane", 8),
  move("303", "Straight, Floor Plane", 8),
];
const FACE_DIRECTION: RotSet[] = [
  move("302", "Tilts, Wall Plane", 8),
  move("304", "Curves, Wall Plane", 4),
  move("305", "Curves, Floor Plane", 4),
  move("306", "Circles", 4),
];
const FACE_LINES: RotSet[] = [
  rot("3080", "Up or Down", 8, "Face Direction — Up or Down"),
  rot("3090", "Nose Tilt", 8, "Face Direction — Nose Tilt"),
];

export function Ch11Head() {
  return (
    <>
      <h2 id="chapter-11">Chapter 11 — Head</h2>

      <h2>The Head</h2>
      <p>
        The Head is written as a circle, read from different{" "}
        <strong>viewpoints</strong> — front, back, side or top — shown by small
        marks on the rim: a nose triangle for a side view, a bar or diamond for
        a top view, a double arc for the back.
      </p>
      <div className="face-grid">
        {VIEWPOINTS.map((v) => (
          <figure key={v.spec} className="face-tile">
            <SgnwSymbol symbol={sym(v.spec)} />
            <figcaption className="face-tile__name">{v.name}</figcaption>
          </figure>
        ))}
      </div>

      <h3>Contact Center</h3>
      <p>
        A <strong>Contact Center</strong> star marks the spot where contact is
        made. It sits in the middle of any viewpoint.
      </p>
      <div className="face-grid">
        {CONTACT.map((c) => (
          <figure key={c.name + c.spec} className="face-tile">
            <SgnwSign sign={c.spec} />
            <figcaption className="face-tile__name">{c.name}</figcaption>
          </figure>
        ))}
      </div>

      <h2>Rim of Head &amp; Face</h2>
      <p>
        The Rim marks a place on the edge of the head. Each rim symbol rotates
        to eight positions around the circle, naming a spot on the face, the
        back, the top or the side of the head. Click a symbol to see every
        position.
      </p>
      <RotationGrid sets={RIM} />

      <h3>Relating to the Head</h3>
      <p>
        A rim symbol written beside a sign means the hand is{" "}
        <strong>relating to</strong> that part of the head.
      </p>
      <RotationGrid sets={RELATING} />

      <h2>Head Movement</h2>
      <p>
        Click a movement symbol to see it rotated into every direction. Extra
        arrowheads on the symbol show the movement repeating or going back and
        forth.
      </p>

      <h3>Head-Direction Movement</h3>
      <p>
        The entire head travels in the direction of the arrows. The nose remains
        straight and the neck does not bend.
      </p>
      <RotationGrid sets={HEAD_DIRECTION} />

      <h3>Face-Direction Movement</h3>
      <p>
        The nose moves in the direction of the arrows. The neck bends and
        stretches as the nose moves.
      </p>
      <RotationGrid sets={FACE_DIRECTION} />

      <h2>Head Positions</h2>
      <h3>Face Direction Lines</h3>
      <p>
        This is not movement — it is a stable position. The horizontal bar is
        the shoulders; the stem marks the direction the nose and face point,
        relating to the shoulders. One symbol writes the nose pointing up or
        down; the other adds a head tilt. Click to see every position.
      </p>
      <RotationGrid sets={FACE_LINES} />
    </>
  );
}
