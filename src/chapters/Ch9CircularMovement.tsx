import { SignFigure } from "../components/SignFigure";
import { asset } from "../lib/asset";

type Item = { symbol: string; label: string };

function SymbolList({ heading, sub, items }: { heading: string; sub: string; items: Item[] }) {
  return (
    <div className="ch9-col">
      <h3 className="ch9-col__head">{heading}</h3>
      <p className="ch9-col__sub">{sub}</p>
      <ol className="ch9-list">
        {items.map((item) => (
          <li className="ch9-item" key={item.label}>
            <img className="ch9-item__symbol" src={asset(item.symbol)} alt="" />
            <span className="ch9-item__label">{item.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function grid(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/figures/ch9/${prefix}-${i + 1}.png`);
}

const armSingle = grid("arm-single", 8);
const armDouble = grid("arm-double", 8);
const circleSingle = grid("circle-single", 8);
const circleDouble = grid("circle-double", 8);
const wristSideSingle = grid("wrist-side-single", 8);
const wristSideDouble = grid("wrist-side-double", 8);
const wristFbSingle = grid("wrist-fb-single", 6);
const wristFbDouble = grid("wrist-fb-double", 6);

const ARM_LABELS = [
  "Starts High",
  "Starts High-Diagonal-Right",
  "Starts Right Side",
  "Starts Low-Diagonal-Right",
  "Starts Low",
  "Starts Low-Diagonal-Left",
  "Starts Left Side",
  "Starts High-Diagonal-Left",
];

const FB_LABELS = [
  "Parallel with Side Wall",
  "Left High Diagonal",
  "Parallel with Floor",
  "Left Low Diagonal",
  "Parallel with Side Wall",
  "Right Low Diagonal",
  "Parallel with Floor",
  "Right High Diagonal",
];

const WRIST_SIDE_LABELS = [
  "Starts High",
  "Starts High-Diagonal-Right",
  "Starts Right Side",
  "Starts Low-Diagonal-Right",
  "Starts Low",
  "Starts Low-Diagonal-Left",
  "Starts Left Side",
  "Starts High-Diagonal-Left",
];

const WRIST_FB_LABELS = [
  "Parallel with Side Wall",
  "Parallel with Side Wall",
  "Parallel with Side Wall",
  "Parallel with Side Wall",
  "Parallel with Floor",
  "Parallel with Floor",
];

function items(symbols: string[], labels: string[], lead: string): Item[] {
  return symbols.map((symbol, i) => ({
    symbol,
    label: `${i + 1}. ${lead} ${labels[i]}`,
  }));
}

export function Ch9CircularMovement() {
  return (
    <>
      <h2 id="chapter-9">Chapter 9 — Circular Movement</h2>

      <h2>Arm Circles</h2>
      <p>
        Arm circles parallel to the Wall Plane are double-stemmed circles.
        Arrows mark exactly where the circular movement starts. When reading
        Circle Symbols, place your hand where the arrows are located on the
        circle, and then move in the direction of the arrows.
      </p>
      <div className="ch9-cols">
        <SymbolList
          heading="Single Arm Circles"
          sub="Side-To-Side · Parallel Wall Plane"
          items={items(armSingle, ARM_LABELS, "One Circle")}
        />
        <SymbolList
          heading="Double Arm Circles"
          sub="Side-To-Side · Parallel Wall Plane"
          items={items(armDouble, ARM_LABELS, "Two Circles")}
        />
      </div>

      <div className="ch9-cols">
        <SymbolList
          heading="Single Circles Forward-Back"
          sub="Sagittal & Floor Planes"
          items={items(circleSingle, FB_LABELS, "Forward-Back Circle")}
        />
        <SymbolList
          heading="Double Circles Forward-Back"
          sub="Sagittal & Floor Planes"
          items={items(circleDouble, FB_LABELS, "Forward-Back Circle")}
        />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch9-ideas" />
        <SignFigure slug="ch9-international" />
        <SignFigure slug="ch9-inferior" />
      </div>

      <h2>Wrist Circles</h2>
      <p>
        Wrist circles are written with solid lines. Arrows are placed outside
        the circle. When reading Wrist Circle Symbols, place your hand at the
        arrow, and then move in that direction.
      </p>
      <div className="ch9-cols">
        <SymbolList
          heading="Single Wrist Circles Side-To-Side"
          sub="Parallel Wall Plane"
          items={items(wristSideSingle, WRIST_SIDE_LABELS, "One Circle")}
        />
        <SymbolList
          heading="Double Wrist Circles Side-To-Side"
          sub="Parallel Wall Plane"
          items={items(wristSideDouble, WRIST_SIDE_LABELS, "Two Circles")}
        />
      </div>

      <div className="ch9-cols">
        <SymbolList
          heading="Single Wrist Circles Forward-Back"
          sub="Sagittal & Floor Planes"
          items={items(wristFbSingle, WRIST_FB_LABELS, "Forward-Back Circle")}
        />
        <SymbolList
          heading="Double Wrist Circles Forward-Back"
          sub="Sagittal & Floor Planes"
          items={items(wristFbDouble, WRIST_FB_LABELS, "Forward-Back Circle")}
        />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch9-who" />
        <SignFigure slug="ch9-hearing-person" />
        <SignFigure slug="ch9-beautiful" />
      </div>

      <h2>Arm &amp; Wrist Circles</h2>
      <div className="examples-row">
        <SignFigure slug="ch9-festival" />
        <SignFigure slug="ch9-imagine" />
        <SignFigure slug="ch9-aw-beautiful" />
        <SignFigure slug="ch9-hot" />
        <SignFigure slug="ch9-establish" />
        <SignFigure slug="ch9-same-continuously" />
        <SignFigure slug="ch9-use" />
        <SignFigure slug="ch9-worried" />
        <SignFigure slug="ch9-who-left" />
        <SignFigure slug="ch9-who-right" />
      </div>
    </>
  );
}
