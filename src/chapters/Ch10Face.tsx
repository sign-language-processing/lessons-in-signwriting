import { useState } from "react";
import { key2swu } from "@sutton-signwriting/core/convert";
import { SgnwSymbol } from "../components/Sgnw";
import { SpeechWriting } from "../components/SpeechWriting";
import { useModalDialog } from "../components/useModalDialog";
import { BASE_SYMBOL_NAMES } from "../lib/baseSymbolNames";

const sym = (base: string, fill = 0, rot = 0): string =>
  key2swu(`S${base}${fill.toString(16)}${rot.toString(16)}`);

// A section entry is a 3-hex base (rendered at fill 0, rotation 0) or a 5-hex
// "base+fill+rotation" spec when the canonical form isn't the default variant.
const symFor = (spec: string): string =>
  key2swu(`S${spec.length === 5 ? spec : `${spec}00`}`);
const baseOf = (spec: string): string => spec.slice(0, 3);

const NAME_OVERRIDES: Record<string, string> = {
  "2ff": "Neutral Facial Circle",
  "2ff02": "Back of Head",
  "36c": "Excited",
};
const nameOf = (spec: string): string =>
  NAME_OVERRIDES[spec] ?? BASE_SYMBOL_NAMES[baseOf(spec)] ?? spec;

// Paired features (eyebrows, eyes, ears, cheeks, teeth) write both / right /
// left with the fill digit. Directional features (eyegaze, tongue, chin) point
// the symbol with the rotation digit. A section names which axis its symbols
// vary along, so clicking a symbol can show every variant.
type VariantAxis = "side" | "dir" | null;

const SIDE_VARIANTS = [
  { fill: 0, label: "Both" },
  { fill: 1, label: "Right" },
  { fill: 2, label: "Left" },
];
const DIR_LABELS = [
  "Up",
  "Up-Diagonal",
  "Side",
  "Down-Diagonal",
  "Down",
  "Down-Diagonal",
  "Side",
  "Up-Diagonal",
];

type Section = {
  id: string;
  title: string;
  intro?: string;
  axis: VariantAxis;
  bases: string[];
};

const SECTIONS: Section[] = [
  {
    id: "forehead",
    title: "Forehead",
    axis: null,
    bases: ["311", "312", "313"],
  },
  {
    id: "eyebrows",
    title: "Eyebrows",
    intro:
      "Eyebrows are written above the eyes. The straight eyebrows lift up, " +
      "rest neutral, or pull down; the dreamy eyebrows curve.",
    axis: "side",
    bases: ["30a", "30b", "30c", "30d", "30e", "30f", "310"],
  },
  {
    id: "eyes",
    title: "Eyes",
    axis: "side",
    bases: [
      "314",
      "315",
      "316",
      "317",
      "318",
      "319",
      "31a",
      "31b",
      "31c",
      "31d",
      "31e",
      "31f",
      "320",
    ],
  },
  {
    id: "eyegaze",
    title: "Eyegaze",
    intro:
      "Eyegaze shows where the eyes look. Wall-plane gaze moves up and down " +
      "the front wall; floor-plane gaze moves forward and back.",
    axis: "dir",
    bases: ["321", "322", "323", "324", "325", "326", "327", "328", "329"],
  },
  { id: "ears", title: "Ears", axis: "side", bases: ["330"] },
  {
    id: "cheeks",
    title: "Cheeks",
    axis: "side",
    bases: ["32a", "32b", "32c", "32d", "32e", "32f"],
  },
  {
    id: "nose",
    title: "Nose",
    axis: null,
    bases: ["331", "332", "333", "334"],
  },
  {
    id: "breathing",
    title: "Breathing",
    axis: null,
    bases: ["335", "336", "337", "338", "339", "33a"],
  },
  {
    id: "mouth",
    title: "Mouth",
    axis: null,
    bases: [
      "33b",
      "33c",
      "33d",
      "33e",
      "33f",
      "340",
      "341",
      "342",
      "343",
      "344",
      "345",
      "346",
      "347",
      "348",
      "349",
      "34a",
      "34b",
      "34c",
      "34d",
      "34e",
      "34f",
      "350",
      "351",
      "352",
      "353",
      "354",
      "355",
      "356",
      "357",
      "358",
    ],
  },
  {
    id: "tongue",
    title: "Tongue",
    axis: "dir",
    bases: ["359", "35a", "35b", "35c", "35d", "35e", "35f", "360"],
  },
  {
    id: "teeth",
    title: "Teeth",
    axis: null,
    bases: ["361", "362", "363", "364", "365", "366", "367"],
  },
  {
    id: "chin",
    title: "Chin & Jaw",
    intro:
      "The jaw moves on two planes: wall-plane chin movement points up and " +
      "down, floor-plane chin movement points forward and back.",
    axis: "dir",
    bases: ["368", "369"],
  },
  {
    id: "other",
    title: "Other",
    axis: null,
    bases: ["2ff02", "36a", "36b", "36c"],
  },
];

type Variant = { key: string; label: string };

function variantsFor(base: string, axis: VariantAxis): Variant[] {
  if (axis === "side") {
    return SIDE_VARIANTS.map((v) => ({
      key: sym(base, v.fill),
      label: v.label,
    }));
  }
  return DIR_LABELS.map((label, rot) => ({ key: sym(base, 0, rot), label }));
}

function VariantDialog({
  base,
  axis,
  onClose,
}: {
  base: string;
  axis: Exclude<VariantAxis, null>;
  onClose: () => void;
}) {
  const ref = useModalDialog();
  return (
    <dialog ref={ref} className="face-dialog" onClose={onClose}>
      <h3>{nameOf(base)}</h3>
      <p className="face-dialog__hint">
        {axis === "side"
          ? "Both eyes/brows/cheeks, the right side alone, or the left side alone."
          : "The same symbol rotated to point in each direction."}
      </p>
      <div className="face-variants">
        {variantsFor(base, axis).map((v) => (
          <figure key={v.key} className="face-tile">
            <sgnw-symbol symbol={v.key}></sgnw-symbol>
            <figcaption className="face-tile__name">{v.label}</figcaption>
          </figure>
        ))}
      </div>
      <button
        type="button"
        className="face-dialog__close"
        onClick={() => ref.current?.close()}
      >
        Close
      </button>
    </dialog>
  );
}

function FaceTile({
  base,
  axis,
  onOpen,
}: {
  base: string;
  axis: VariantAxis;
  onOpen: (base: string) => void;
}) {
  const name = nameOf(base);
  if (axis) {
    return (
      <button type="button" className="face-tile" onClick={() => onOpen(base)}>
        <sgnw-symbol symbol={symFor(base)}></sgnw-symbol>
        <span className="face-tile__name">{name}</span>
      </button>
    );
  }
  return (
    <figure className="face-tile">
      <SgnwSymbol symbol={symFor(base)} />
      <figcaption className="face-tile__name">{name}</figcaption>
    </figure>
  );
}

export function Ch10Face() {
  const [open, setOpen] = useState<{ base: string; axis: VariantAxis } | null>(
    null,
  );

  return (
    <>
      <h2 id="chapter-10">Chapter 10 — Facial Expressions</h2>
      <p>
        Facial expressions are written inside the <strong>Facial Circle</strong>
        . The circle is the only standalone symbol here; every feature is a
        small mark <strong>added to it, where that feature sits on a real
        face</strong> — the forehead, eyebrows, and eyes near the top; the nose,
        cheeks, and ears across the middle; the mouth, tongue, teeth, and chin
        at the bottom. Each feature has its own group, below.
      </p>
      <p>
        In sign languages these are not decoration — they are{" "}
        <strong>grammar</strong>. A facial expression can mark a question, a
        negation, or change the meaning of a sign entirely. So write a facial
        expression when it carries meaning, not to capture someone's personal
        signing style — unless you are transcribing a video word-for-word.
      </p>

      <div className="face-neutral">
        <SgnwSymbol symbol={sym("2ff")} size={96} />
        <div>
          <h3>Neutral Facial Circle</h3>
          <p>
            The empty circle is the face seen straight on. Every expression is
            built by adding symbols to it.
          </p>
        </div>
      </div>

      <p className="face-convention">
        <strong>Right and left, both at once.</strong> Paired features —
        eyebrows, eyes, ears, cheeks — are written for <em>both</em> sides, the{" "}
        <em>right</em> side alone, or the <em>left</em> side alone (right and
        left are the signer&rsquo;s own). Directional features — eyegaze,
        tongue, chin — are <em>rotated</em> to point where they go. Click any
        symbol below to see its variants.
      </p>

      {SECTIONS.map((section) => (
        <section key={section.id} className="face-section">
          <h3>{section.title}</h3>
          {section.intro && <p>{section.intro}</p>}
          <div className="face-grid">
            {section.bases.map((base) => (
              <FaceTile
                key={base}
                base={base}
                axis={section.axis}
                onOpen={(b) => setOpen({ base: b, axis: section.axis })}
              />
            ))}
          </div>
        </section>
      ))}

      <SpeechWriting />

      {open && open.axis && (
        <VariantDialog
          base={open.base}
          axis={open.axis}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
