import { Figure } from "../components/Figure";

const IMG = {
  viewpoints: "/figures/ch11/ch11-viewpoints.png",
  rimFace: "/figures/ch11/ch11-rim-face.png",
  rimTopSide: "/figures/ch11/ch11-rim-top-side.png",
  rimRelatingTouching: "/figures/ch11/ch11-rim-relating-touching.png",
  faceDirectionMovement: "/figures/ch11/ch11-face-direction-movement.png",
  headDirectionMovement: "/figures/ch11/ch11-head-direction-movement.png",
  faceDirectionLines: "/figures/ch11/ch11-face-direction-lines.png",
};

export function Ch11Head() {
  return (
    <>
      <h2 id="chapter-11">Chapter 11 — Head</h2>

      <h2>The Head</h2>
      <p>The Head can be seen from different viewpoints:</p>
      <Figure src={IMG.viewpoints} alt="The Head seen from different viewpoints, with and without a Contact Center" />

      <h2>Rim of Head &amp; Face</h2>
      <p>
        <strong>Front View — Rim of Front of Face</strong> ·{" "}
        <strong>Back View — Rim of Back of Head</strong>
      </p>
      <Figure src={IMG.rimFace} alt="Rim of Head and Face symbols, front view and back view" />

      <p>
        <strong>Top View — Rim of Top of Head</strong> ·{" "}
        <strong>Side View — Rim of Side of Head</strong>
      </p>
      <Figure src={IMG.rimTopSide} alt="Rim of Head and Face symbols, top view and side view" />

      <p>
        <strong>Front View — Relating To the Side of Head</strong> ·{" "}
        <strong>Front View — Touching the Side of Head</strong>
      </p>
      <Figure src={IMG.rimRelatingTouching} alt="Rim of Head and Face symbols, relating to and touching the side of the head" />

      <h2>Head Movement</h2>

      <h3>Face-Direction Movement Symbols</h3>
      <p>
        The nose moves in the direction of the arrows. The neck bends and
        stretches as the nose moves.
      </p>
      <Figure src={IMG.faceDirectionMovement} alt="Grid of face-direction head-movement symbols" />

      <h3>Head-Direction Movement Symbols</h3>
      <p>
        The entire head travels in the direction of the arrows. The nose remains
        straight, and the neck does not bend.
      </p>
      <Figure src={IMG.headDirectionMovement} alt="Grid of head-direction head-movement symbols" />

      <h2>Head Positions</h2>
      <h3>Face Direction Lines</h3>
      <p>
        This is not movement. It is a stable position marking the direction of
        the nose and face, relating to the shoulders.
      </p>
      <Figure src={IMG.faceDirectionLines} alt="Face Direction Line position symbols with labels" />
    </>
  );
}
