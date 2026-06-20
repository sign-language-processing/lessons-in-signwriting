import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SgnwSymbol } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";
import { ForwardBackOverCurves3D, WallPlaneCurves3D } from "../components/SignSpace3D";

function SymbolFigure({ symbol, caption }: { symbol: string; caption: string }) {
  return (
    <figure>
      <figcaption>
        <div className="caption">{caption}</div>
      </figcaption>
      <span className="img-wrap">
        <SgnwSymbol symbol={symbol} size={96} />
      </span>
    </figure>
  );
}

type CurveItem = { symbol: string; name: string };

const FORWARD_OVER: CurveItem[] = [
  { symbol: "񊒡", name: "Forward-Over" },
  { symbol: "񊕡", name: "Forward-Over-Over" },
  { symbol: "񊛡", name: "Forward-Loop-Over" },
  { symbol: "񊡡", name: "Forward-Over-Under" },
];

const BACK_OVER: CurveItem[] = [
  { symbol: "񊒦", name: "Back-Over" },
  { symbol: "񊕦", name: "Back-Over-Over" },
  { symbol: "񊛦", name: "Back-Loop-Over" },
  { symbol: "񊡦", name: "Back-Under-Over" },
];

const FORWARD_UNDER: CurveItem[] = [
  { symbol: "񊩁", name: "Forward-Under" },
  { symbol: "񊬁", name: "Forward-Under-Under" },
  { symbol: "񊲁", name: "Forward-Loop-Under" },
  { symbol: "񊸁", name: "Forward-Under-Over" },
];

const BACK_UNDER: CurveItem[] = [
  { symbol: "񊩆", name: "Back-Under" },
  { symbol: "񊬆", name: "Back-Under-Under" },
  { symbol: "񊲆", name: "Back-Loop-Under" },
  { symbol: "񊸆", name: "Back-Over-Under" },
];

const FORWARD_SIDE: CurveItem[] = [
  { symbol: "񊿡", name: "Forward-Side" },
  { symbol: "񋇁", name: "Forward-Side-Side" },
  { symbol: "񋈡", name: "Forward-Loop-Side" },
  { symbol: "񋋡", name: "Forward-Side-Back-Side" },
];

const BACK_SIDE: CurveItem[] = [
  { symbol: "񊿥", name: "Back-Side" },
  { symbol: "񋇅", name: "Back-Side-Side" },
  { symbol: "񋈥", name: "Back-Loop-Side" },
  { symbol: "񋋥", name: "Back-Side-Forward-Side" },
];

const SIDE_FORWARD_SIDE: CurveItem[] = [
  { symbol: "񊿧", name: "Side-Forward-Side" },
  { symbol: "񋇇", name: "Side-Forward-Side Twice" },
  { symbol: "񋈧", name: "Side-Forward-Side Loop" },
  { symbol: "񋋧", name: "Side-Forward-Side Snake" },
];

const SIDE_BACK_SIDE: CurveItem[] = [
  { symbol: "񊿫", name: "Side-Back-Side" },
  { symbol: "񋇋", name: "Side-Back-Side Twice" },
  { symbol: "񋈫", name: "Side-Back-Side Loop" },
  { symbol: "񋋫", name: "Side-Back-Side Snake" },
];

function CurveList({ items }: { items: CurveItem[] }) {
  return (
    <ol className="curve-list">
      {items.map(({ symbol, name }) => (
        <li key={name}>
          <SgnwSymbol symbol={symbol} className="curve-list__symbol" />
          <span>{name}</span>
        </li>
      ))}
    </ol>
  );
}

const IMG = {
  coverPhoto1:
    "image_000304_277921798e594fee5105e61291bb89964d19a6d0ba37235f5c5053afc3f9c0f8.png",
  coverPhoto2:
    "image_000305_139d567fcee0f977aed460d419f1210f523b617a976501c8f71fd4e55020caff.png",
};

export function Ch7CurvedMovement() {
  return (
    <>
      <h2 id="chapter-7">Chapter 7 — Curved Movement</h2>

      <Row>
        <Col>
          <Figure src={IMG.coverPhoto1} />
        </Col>
        <Col>
          <Figure src={IMG.coverPhoto2} />
        </Col>
      </Row>

      <h2>Wall Plane Curved Movement</h2>
      <p>
        Up-Down movement is parallel with the front wall. It is written with{" "}
        <strong>double-stemmed</strong> arrows:
      </p>
      <Row stretch>
        <Col>
          <SymbolFigure symbol="񉌋" caption="1. Curve Up-Side" />
          <SymbolFigure symbol="񉛋" caption="2. Curve Up-Up" />
        </Col>
        <Col>
          <SymbolFigure symbol="񉥧" caption="3. Curve Up-Down-Up" />
          <SymbolFigure symbol="񉟫" caption="4. Curve Up-Loop-Up" />
        </Col>
      </Row>
      <WallPlaneCurves3D />

      <h2>Up-Down Curved Arrows</h2>
      <p>The curves are parallel with the wall.</p>
      <div className="examples-row">
        <SignFigure slug="ch7-shape" />
        <SignFigure slug="ch7-spaghetti" />
      </div>

      <h2>Floor Plane Curved Movement</h2>
      <p>
        Forward-Back movement is parallel with the floor. It is written with{" "}
        <strong>single-stemmed</strong> arrows. The thinner section of the arrow
        means <strong>far</strong> from the body; the thick, dark section means{" "}
        <strong>close</strong> to the body — like looking down a road, close is
        wider and darker.
      </p>

      <h3>Forward-Over or Back-Over</h3>
      <Row stretch>
        <Col>
          <h4>Forward-Over</h4>
          <CurveList items={FORWARD_OVER} />
        </Col>
        <Col className="col--divided">
          <h4>Back-Over</h4>
          <CurveList items={BACK_OVER} />
        </Col>
      </Row>

      <h3>Forward-Under or Back-Under</h3>
      <Row stretch>
        <Col>
          <h4>Forward-Under</h4>
          <CurveList items={FORWARD_UNDER} />
        </Col>
        <Col className="col--divided">
          <h4>Back-Under</h4>
          <CurveList items={BACK_UNDER} />
        </Col>
      </Row>

      <ForwardBackOverCurves3D />

      <h3>Forward-Side or Back-Side</h3>
      <Row stretch>
        <Col>
          <h4>Forward-Side</h4>
          <CurveList items={FORWARD_SIDE} />
        </Col>
        <Col className="col--divided">
          <h4>Back-Side</h4>
          <CurveList items={BACK_SIDE} />
        </Col>
      </Row>

      <h3>Side-Forward-Side or Side-Back-Side</h3>
      <Row stretch>
        <Col>
          <h4>Side-Forward-Side</h4>
          <CurveList items={SIDE_FORWARD_SIDE} />
        </Col>
        <Col className="col--divided">
          <h4>Side-Back-Side</h4>
          <CurveList items={SIDE_BACK_SIDE} />
        </Col>
      </Row>

      <h2>Example Signs</h2>
      <div className="examples-row">
        <SignFigure slug="ch7-across" />
        <SignFigure slug="ch7-grandmother" />
        <SignFigure slug="ch7-allow" />
        <SignFigure slug="ch7-workshop" />
      </div>
    </>
  );
}
