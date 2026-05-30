import { Figure } from "../components/Figure";

const FIG = "/figures/ch10";

export function Ch10Face() {
  return (
    <>
      <h2 id="chapter-10">Chapter 10 — Facial Expressions</h2>
      <p>
        There are ten groups of facial expressions, including the forehead,
        eyebrows, eyes &amp; eyegaze, ears &amp; cheeks, breathing &amp; nose,
        mouth, tongue, teeth, chin and other parts.
      </p>

      <h3>Facial Circle · Forehead · Eyebrows</h3>
      <Figure src={`${FIG}/ch10-facial-forehead-eyebrows.png`} />

      <h3>Eyebrows (continued)</h3>
      <Figure src={`${FIG}/ch10-eyebrows-continued.png`} />

      <h3>Eyes</h3>
      <Figure src={`${FIG}/ch10-eyes.png`} />

      <h3>Eyegaze</h3>
      <Figure src={`${FIG}/ch10-eyegaze.png`} />

      <h3>Ears</h3>
      <Figure src={`${FIG}/ch10-ears.png`} />

      <h3>Cheeks</h3>
      <Figure src={`${FIG}/ch10-cheeks.png`} />

      <h3>Breathing · Nose · Mouth</h3>
      <Figure src={`${FIG}/ch10-breathing-nose-mouth.png`} />

      <h3>Mouth (continued)</h3>
      <Figure src={`${FIG}/ch10-mouth-continued.png`} />

      <h3>Tongue</h3>
      <Figure src={`${FIG}/ch10-tongue.png`} />

      <h3>Tongue (continued)</h3>
      <Figure src={`${FIG}/ch10-tongue-continued.png`} />

      <h3>Teeth · Chin</h3>
      <Figure src={`${FIG}/ch10-teeth-chin.png`} />

      <h3>Chin (continued) · Other</h3>
      <Figure src={`${FIG}/ch10-chin-other.png`} />
    </>
  );
}
