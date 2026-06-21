import { key2swu } from "@sutton-signwriting/core/convert";
import { SgnwSymbol } from "../components/Sgnw";
import { move, RotationGrid, type RotSet } from "../components/RotationTiles";

const SHOULDER_LINE = key2swu("S36d00");

const SHOULDERS: RotSet[] = [
  move("36d", "Shoulder Line", 4),
  move("36e", "Shoulder Positions", 6),
  move("36f", "Shoulder Movement, Wall Plane", 8),
  move("370", "Shoulder Movement, Floor Plane", 8),
];

const TORSO: RotSet[] = [
  move("372", "Torso Stretches (Up & Down)", 4),
  move("373", "Torso Curves & Bends", 4),
  move("374", "Torso Twists", 4),
  move("371", "Ribcage Tilts", 8),
];

const TILTS: RotSet[] = [move("375", "Upper Body Tilts", 8)];

export function Ch12Body() {
  return (
    <>
      <h2 id="chapter-12">Chapter 12 — The Body</h2>

      <div className="face-neutral">
        <SgnwSymbol symbol={SHOULDER_LINE} size={96} />
        <div>
          <h3>The Shoulder Line</h3>
          <p>
            Everything in this chapter is built on the{" "}
            <strong>shoulder line</strong> — a horizontal bar across the
            shoulders. From it the body lifts, moves, tilts, bends and twists.
            Click any symbol below to see it in every direction.
          </p>
        </div>
      </div>

      <h2>Shoulder Positions &amp; Movements</h2>
      <p>
        The shoulders hold a position — one or both raised or lowered — or move
        up and down on the Wall Plane, or forward and back on the Floor Plane.
      </p>
      <RotationGrid sets={SHOULDERS} />

      <h2>Torso (Upper Body) Positions &amp; Movements</h2>
      <p>
        The whole upper body stretches up or sinks down, curves and bends to the
        side, twists left or right, or tilts from the ribcage.
      </p>
      <RotationGrid sets={TORSO} />

      <h2>Upper Body Tilts</h2>
      <p className="ch12-subhead">Rocking Motion from the Hip Joint</p>
      <p>
        The upper body tilts or rocks back and forth. The neck and torso do not
        bend — they stay straight, moving as a unit from the hip joints.
      </p>
      <RotationGrid sets={TILTS} />
    </>
  );
}
