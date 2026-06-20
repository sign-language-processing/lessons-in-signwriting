import type { ReactNode } from "react";
import { Col, Row } from "../components/Layout";
import { SgnwSymbol } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";

type RosePoint = { symbol: string; label: ReactNode };

function SymbolRose({
  top,
  left,
  bottom,
  right,
}: {
  top: RosePoint;
  left: RosePoint;
  bottom: RosePoint;
  right: RosePoint;
}) {
  return (
    <div className="symbol-rose">
      <div className="symbol-rose__top">
        <span className="symbol-rose__label">{top.label}</span>
        <SgnwSymbol symbol={top.symbol} size={72} />
      </div>
      <div className="symbol-rose__left">
        <span className="symbol-rose__label">{left.label}</span>
        <SgnwSymbol symbol={left.symbol} size={72} />
      </div>
      <div className="symbol-rose__right">
        <SgnwSymbol symbol={right.symbol} size={72} />
        <span className="symbol-rose__label">{right.label}</span>
      </div>
      <div className="symbol-rose__bottom">
        <SgnwSymbol symbol={bottom.symbol} size={72} />
        <span className="symbol-rose__label">{bottom.label}</span>
      </div>
    </div>
  );
}

export function Ch8AxialMovement() {
  return (
    <>
      <h2 id="chapter-8">Chapter 8 — Axial Movement</h2>
      <p>There are two types of Axial Movement:</p>
      <ol>
        <li>Rotation Movement of the Forearm</li>
        <li>Flexing Movement of the Wrist</li>
      </ol>

      <h2>Rotation</h2>
      <p>
        SignWriting includes symbols which show rotation movements made with
        your forearm. The forearm does not travel. It stays in one place and
        rotates.
      </p>
      <p>
        Rotation Symbols place a curved arrow on an "axis". The "axis-line"
        represents the forearm. The rotation revolves around this axis.
      </p>
      <h3>Forearm points upward, rotates</h3>
      <p>
        A double-lined <strong>axis-line</strong> represents an axis that is
        parallel with the wall. The forearm is up and the rotation revolves
        around this <strong>up-down axis</strong>:
      </p>
      <SymbolRose
        top={{
          symbol: "񋎡",
          label: (
            <>
              <strong>Baby finger</strong> leads — forward, then side.
            </>
          ),
        }}
        bottom={{
          symbol: "񋎥",
          label: (
            <>
              <strong>Thumb</strong> leads — back toward the chest, then side.
            </>
          ),
        }}
        right={{
          symbol: "񋎧",
          label: (
            <>
              <strong>Baby finger</strong> leads — side, forward, then side
              again.
            </>
          ),
        }}
        left={{
          symbol: "񋎣",
          label: (
            <>
              <strong>Thumb</strong> leads — side, back, then side again.
            </>
          ),
        }}
      />
      <p>
        <em>
          Note: The top and bottom movements are technically the same. The
          difference is the <strong>feeling of the baby finger</strong> or the{" "}
          <strong>feeling of the thumb</strong> leading the rotation — some signs{" "}
          <strong>push</strong> and some signs <strong>pull</strong>.
        </em>
      </p>

      <h3>Forearm points forward, rotates</h3>
      <p>
        A single-lined "axis-line" represents an axis parallel with the floor.
        When the forearm is pointing forward, parallel with the floor, the
        "axis-line" is a single line pointing forward:
      </p>
      <SymbolRose
        top={{
          symbol: "񉳉",
          label: (
            <>
              <strong>Thumb</strong> leads — up, then side.
            </>
          ),
        }}
        bottom={{
          symbol: "񉳍",
          label: (
            <>
              <strong>Baby finger</strong> leads — down, then side.
            </>
          ),
        }}
        right={{
          symbol: "񉳋",
          label: (
            <>
              <strong>Baby finger</strong> leads — side, down, then side again.
            </>
          ),
        }}
        left={{
          symbol: "񉳏",
          label: (
            <>
              <strong>Thumb</strong> leads — side, up, then side again.
            </>
          ),
        }}
      />

      <Row stretch>
        <Col>
          <h3>Rotation, Forearm Up — Parallel with Front Wall</h3>
          <div className="examples-row">
            <SignFigure slug="ch8-class" />
            <SignFigure slug="ch8-open" />
            <SignFigure slug="ch8-blue" />
          </div>
        </Col>
        <Col>
          <h3>Rotation, Forearm Forward — Parallel with Floor</h3>
          <div className="examples-row">
            <SignFigure slug="ch8-happen" />
            <SignFigure slug="ch8-finish" />
            <SignFigure slug="ch8-dead" />
          </div>
        </Col>
      </Row>

      <h3>Forearm points sideways, rotates</h3>
      <p>
        When the forearm is parallel with the floor, but pointing side, the
        "axis-line" is a single horizontal line pointing side.
      </p>
      <div className="symbol-grid">
        <figure className="symbol-grid__cell">
          <SgnwSymbol symbol="񊤡" size={84} />
          <figcaption>Forward, up, and over.</figcaption>
        </figure>
        <figure className="symbol-grid__cell">
          <SgnwSymbol symbol="񊤦" size={84} />
          <figcaption>Back, up, and over.</figcaption>
        </figure>
        <figure className="symbol-grid__cell">
          <SgnwSymbol symbol="񊻁" size={84} />
          <figcaption>Forward, down, and under.</figcaption>
        </figure>
        <figure className="symbol-grid__cell">
          <SgnwSymbol symbol="񊻆" size={84} />
          <figcaption>Back, down, and under.</figcaption>
        </figure>
      </div>

      <h3>Rotation, Forearm Side — Parallel with Floor</h3>
      <div className="examples-row">
        <SignFigure slug="ch8-third" />
        <SignFigure slug="ch8-apple" />
        <SignFigure slug="ch8-begin" />
      </div>

      <Row stretch>
        <Col>
          <h3>Side-Over &amp; Side-Down-Side Rotations</h3>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񉳁" className="curve-list__symbol" />
              <span>Side-Over — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉴡" className="curve-list__symbol" />
              <span>Side-Over — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉶁" className="curve-list__symbol" />
              <span>Side-Over — Alternating Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉳃" className="curve-list__symbol" />
              <span>Side-Down-Side — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉴣" className="curve-list__symbol" />
              <span>Side-Down-Side — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉶃" className="curve-list__symbol" />
              <span>Side-Down-Side — Alternating Rotation</span>
            </li>
          </ol>
        </Col>
        <Col>
          <h3>Side-Under &amp; Side-Up-Side Rotations</h3>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񉳅" className="curve-list__symbol" />
              <span>Side-Under — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉴥" className="curve-list__symbol" />
              <span>Side-Under — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉶅" className="curve-list__symbol" />
              <span>Side-Under — Alternating Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉳇" className="curve-list__symbol" />
              <span>Side-Up-Side — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉴧" className="curve-list__symbol" />
              <span>Side-Up-Side — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉶇" className="curve-list__symbol" />
              <span>Side-Up-Side — Alternating Rotation</span>
            </li>
          </ol>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-scoop" />
        <SignFigure slug="ch8-clown" />
        <SignFigure slug="ch8-knife" />
        <SignFigure slug="ch8-egg" />
        <SignFigure slug="ch8-music" />
        <SignFigure slug="ch8-party" />
      </div>

      <Row stretch>
        <Col>
          <h3>Forward-Over &amp; Back-Over Rotations</h3>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񊤡" className="curve-list__symbol" />
              <span>Forward-Over — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊦁" className="curve-list__symbol" />
              <span>Forward-Over — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊧡" className="curve-list__symbol" />
              <span>Forward-Over — Alternating Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊤦" className="curve-list__symbol" />
              <span>Back-Over — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊦆" className="curve-list__symbol" />
              <span>Back-Over — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊧦" className="curve-list__symbol" />
              <span>Back-Over — Alternating Rotation</span>
            </li>
          </ol>
        </Col>
        <Col>
          <h3>Forward-Under &amp; Back-Under Rotations</h3>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񊻁" className="curve-list__symbol" />
              <span>Forward-Under — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊼡" className="curve-list__symbol" />
              <span>Forward-Under — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊾁" className="curve-list__symbol" />
              <span>Forward-Under — Alternating Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊻆" className="curve-list__symbol" />
              <span>Back-Under — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊼦" className="curve-list__symbol" />
              <span>Back-Under — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񊾆" className="curve-list__symbol" />
              <span>Back-Under — Alternating Rotation</span>
            </li>
          </ol>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-first" />
        <SignFigure slug="ch8-cow" />
        <SignFigure slug="ch8-key" />
        <SignFigure slug="ch8-sell" />
        <SignFigure slug="ch8-store" />
        <SignFigure slug="ch8-walk" />
      </div>

      <Row stretch>
        <Col>
          <h3>Forward-Side &amp; Back-Side Rotations</h3>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񋎡" className="curve-list__symbol" />
              <span>Forward-Side — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋐁" className="curve-list__symbol" />
              <span>Forward-Side — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋑡" className="curve-list__symbol" />
              <span>Forward-Side — Alternating Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋎥" className="curve-list__symbol" />
              <span>Back-Side — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋐅" className="curve-list__symbol" />
              <span>Back-Side — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋑥" className="curve-list__symbol" />
              <span>Back-Side — Alternating Rotation</span>
            </li>
          </ol>
        </Col>
        <Col>
          <h3>Side-Forward-Side &amp; Side-Back-Side Rotations</h3>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񋎧" className="curve-list__symbol" />
              <span>Side-Forward-Side — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋐇" className="curve-list__symbol" />
              <span>Side-Forward-Side — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋑧" className="curve-list__symbol" />
              <span>Side-Forward-Side — Alternating Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋎫" className="curve-list__symbol" />
              <span>Side-Back-Side — Single Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋐋" className="curve-list__symbol" />
              <span>Side-Back-Side — Double Rotation</span>
            </li>
            <li>
              <SgnwSymbol symbol="񋑫" className="curve-list__symbol" />
              <span>Side-Back-Side — Alternating Rotation</span>
            </li>
          </ol>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-blue" />
        <SignFigure slug="ch8-flower" />
        <SignFigure slug="ch8-fruit" />
        <SignFigure slug="ch8-door" />
        <SignFigure slug="ch8-cheese" />
        <SignFigure slug="ch8-green" />
      </div>

      <h2>Traveling Rotation</h2>
      <p>
        A few movement symbols combine "traveling" movement with an added
        rotation. The forearm rotates as the arm moves in a specific direction.
        The rotation symbol is placed on the stem line of the arrow.
      </p>
      <Row stretch>
        <Col>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񉆁" className="curve-list__symbol" />
              <span>Wall-Plane-Twist</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉇡" className="curve-list__symbol" />
              <span>Wall-Plane-Twist-Twist</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉉁" className="curve-list__symbol" />
              <span>Wall-Plane-Twist-Shake</span>
            </li>
          </ol>
        </Col>
        <Col>
          <ol className="curve-list">
            <li>
              <SgnwSymbol symbol="񉁡" className="curve-list__symbol" />
              <span>Floor-Plane-Twist</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉃁" className="curve-list__symbol" />
              <span>Floor-Plane-Twist-Twist</span>
            </li>
            <li>
              <SgnwSymbol symbol="񉄡" className="curve-list__symbol" />
              <span>Floor-Plane-Twist-Shake</span>
            </li>
          </ol>
        </Col>
      </Row>

      <h2>Shaking Rotation</h2>
      <p>
        Shaking Rotation does not define how many rotations you make. Instead,
        it is a fast, shaking motion. It can be written with or without an
        arrowhead. The dark and light arrowheads are needed at times, to show
        which arm is doing the shaking.
      </p>
      <p>
        <strong>Shaking Movement, Forearm Up or Down</strong> — Parallel with
        the Wall Plane
      </p>
      <div className="examples-row">
        <SgnwSymbol symbol="񋓱" size={72} />
        <SgnwSymbol symbol="񋓁" size={72} />
        <SgnwSymbol symbol="񋓑" size={72} />
        <SgnwSymbol symbol="񋓡" size={72} />
      </div>
      <p>
        <strong>Shaking Movement, Forearm Forward</strong> — Parallel with the
        Floor Plane
      </p>
      <div className="examples-row">
        <SgnwSymbol symbol="񉸑" size={72} />
        <SgnwSymbol symbol="񉷡" size={72} />
        <SgnwSymbol symbol="񉷱" size={72} />
        <SgnwSymbol symbol="񉸁" size={72} />
      </div>

      <h2>Wrist-Flexing Movement</h2>
      <p>
        The wrist remains stable while the hand moves in different directions.
        This flexing motion is written with a horizontal line cutting the
        wrist. The horizontal line represents the axis of motion. Small arrows
        point in the direction of the flexing motion. The arrows represent the
        direction of the hand as it moves.
      </p>
      <Row>
        <Col>
          <SignFigure slug="ch8-yes-yes" />
        </Col>
        <Col>
          <p>
            <strong>ASL Sign For "Yes-Yes"</strong>
            <br />
            Wrist Flexing Down Twice
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <SignFigure slug="ch8-flag" />
        </Col>
        <Col>
          <p>
            <strong>ASL Sign For "Flag"</strong>
            <br />
            Wrist Flexing Forward and Back Towards the Chest
          </p>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-chat" />
        <SignFigure slug="ch8-basketball" />
      </div>
    </>
  );
}
