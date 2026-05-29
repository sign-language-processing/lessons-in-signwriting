import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SignFigure } from "../components/SignFigure";

const D = "/figures/ch8";

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
      <p>
        A double-lined <strong>axis-line</strong> represents an axis that is
        parallel with the wall. The forearm is up and the rotation revolves
        around this <strong>up-down axis</strong>:
      </p>

      <h3>Forearm points upward, rotates</h3>
      <Figure src={`${D}/forearm-up-rose.png`} />
      <Row>
        <Col>
          <Figure src={`${D}/forearm-up-baby.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is up. Rotation describes the curve of the baby
            finger forward and side. The forearm does not travel, but stays in
            place (see note below).
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-up-thumb.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is up. Rotation describes the curve of the thumb back
            towards the chest and then side. The forearm stays in place (see
            note below).
          </p>
        </Col>
      </Row>
      <p>
        <em>
          Note: The two movements above are technically the same. The
          difference is the <strong>feeling of the baby finger</strong> or the{" "}
          <strong>feeling of the thumb</strong> leading the rotation. Some signs{" "}
          <strong>push</strong> and some signs <strong>pull</strong>. See{" "}
          <strong>Push-Pull Writing Rules</strong>.
        </em>
      </p>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-up-baby-2.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is up. Rotation describes the curve of the baby
            finger side, forward, and then side again. The forearm does not
            travel, but simply rotates in place.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-up-thumb-2.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is up. Rotation describes the curve of the thumb side,
            back and then side again. The forearm does not travel, but simply
            rotates in place.
          </p>
        </Col>
      </Row>

      <p>
        A single-lined "axis-line" represents an axis parallel with the floor.
        When the forearm is pointing forward, parallel with the floor, the
        "axis-line" is a single line pointing forward:
      </p>

      <h3>Forearm points forward, rotates</h3>
      <Figure src={`${D}/forearm-forward-rose.png`} />
      <Row>
        <Col>
          <Figure src={`${D}/forearm-forward-thumb.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is forward, parallel with the floor. Rotation
            describes the curve of the thumb up and side. The forearm does not
            travel, but stays in place.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-forward-baby.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is forward, parallel with the floor. Rotation
            describes the curve of the baby finger down and side. The forearm
            stays in place as it rotates.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-forward-baby-2.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is forward, parallel with the floor. Rotation
            describes the curve of the baby finger side, down and side again.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-forward-thumb-2.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is forward, parallel with the floor. Rotation
            describes the curve of the thumb side, up and side again.
          </p>
        </Col>
      </Row>

      <Row stretch>
        <Col>
          <h3>Rotation, Forearm Up — Parallel with Front Wall</h3>
          <div className="examples-row">
            <SignFigure slug="ch8-class" />
            <SignFigure slug="ch8-close" />
            <SignFigure slug="ch8-finish" />
          </div>
        </Col>
        <Col>
          <h3>Rotation, Forearm Forward — Parallel with Floor</h3>
          <div className="examples-row">
            <SignFigure slug="ch8-happen" />
            <SignFigure slug="ch8-break" />
            <SignFigure slug="ch8-dead" />
          </div>
        </Col>
      </Row>

      <p>
        When the forearm is parallel with the floor, but pointing side, the
        "axis-line" is a single horizontal line pointing side.
      </p>

      <h3>Forearm points sideways, rotates</h3>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-side-1.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is side, parallel with the floor. Rotation describes
            the curve forward, up and over. The forearm does not travel, but
            stays in place as it rotates.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-side-2.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is side, parallel with the floor. Rotation describes
            the curve back, up and over. The forearm does not travel, but stays
            in one place as it rotates.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-side-3.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is side, parallel with the floor. Rotation describes
            the curve forward, down and under. The forearm does not travel, but
            stays in place.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Figure src={`${D}/forearm-side-4.png`} />
        </Col>
        <Col>
          <p>
            Right forearm is side, parallel with the floor. Rotation describes
            the curve back, down and under. The forearm does not travel, but
            stays in one place as it rotates.
          </p>
        </Col>
      </Row>

      <h3>Rotation, Forearm Side — Parallel with Floor</h3>
      <div className="examples-row">
        <SignFigure slug="ch8-third" />
        <SignFigure slug="ch8-apple" />
        <SignFigure slug="ch8-begin" />
      </div>

      <Row stretch>
        <Col>
          <h3>Side-Over &amp; Side-Down-Side Rotations</h3>
          <ol>
            <li>Side-Over — Single Rotation</li>
            <li>Side-Over — Double Rotation</li>
            <li>Side-Over — Alternating Rotation</li>
            <li>Side-Down-Side — Single Rotation</li>
            <li>Side-Down-Side — Double Rotation</li>
            <li>Side-Down-Side — Alternating Rotation</li>
          </ol>
        </Col>
        <Col>
          <h3>Side-Under &amp; Side-Up-Side Rotations</h3>
          <ol>
            <li>Side-Under — Single Rotation</li>
            <li>Side-Under — Double Rotation</li>
            <li>Side-Under — Alternating Rotation</li>
            <li>Side-Up-Side — Single Rotation</li>
            <li>Side-Up-Side — Double Rotation</li>
            <li>Side-Up-Side — Alternating Rotation</li>
          </ol>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-aerobics" />
        <SignFigure slug="ch8-baptism" />
        <SignFigure slug="ch8-broom" />
      </div>

      <h2>Forward-Over &amp; Back-Over / Forward-Under &amp; Back-Under Rotations</h2>
      <Row stretch>
        <Col>
          <h3>Forward-Over &amp; Back-Over Rotations</h3>
          <ol>
            <li>Forward-Over — Single Rotation</li>
            <li>Forward-Over — Double Rotation</li>
            <li>Forward-Over — Alternating Rotation</li>
            <li>Back-Over — Single Rotation</li>
            <li>Back-Over — Double Rotation</li>
            <li>Back-Over — Alternating Rotation</li>
          </ol>
        </Col>
        <Col>
          <h3>Forward-Under &amp; Back-Under Rotations</h3>
          <ol>
            <li>Forward-Under — Single Rotation</li>
            <li>Forward-Under — Double Rotation</li>
            <li>Forward-Under — Alternating Rotation</li>
            <li>Back-Under — Single Rotation</li>
            <li>Back-Under — Double Rotation</li>
            <li>Back-Under — Alternating Rotation</li>
          </ol>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-apple" />
        <SignFigure slug="ch8-bald" />
        <SignFigure slug="ch8-weight" />
      </div>

      <h2>Forward-Side &amp; Back-Side / Side-Forward-Side &amp; Side-Back-Side Rotations</h2>
      <Row stretch>
        <Col>
          <h3>Forward-Side &amp; Back-Side Rotations</h3>
          <ol>
            <li>Forward-Side — Single Rotation</li>
            <li>Forward-Side — Double Rotation</li>
            <li>Forward-Side — Alternating Rotation</li>
            <li>Back-Side — Single Rotation</li>
            <li>Back-Side — Double Rotation</li>
            <li>Back-Side — Alternating Rotation</li>
          </ol>
        </Col>
        <Col>
          <h3>Side-Forward-Side &amp; Side-Back-Side Rotations</h3>
          <ol>
            <li>Side-Forward-Side — Single Rotation</li>
            <li>Side-Forward-Side — Double Rotation</li>
            <li>Side-Forward-Side — Alternating Rotation</li>
            <li>Side-Back-Side — Single Rotation</li>
            <li>Side-Back-Side — Double Rotation</li>
            <li>Side-Back-Side — Alternating Rotation</li>
          </ol>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-blue" />
        <Figure src={`${D}/blue-comparison-books.png`} caption="comparison" />
        <Figure src={`${D}/books-detail.png`} caption="books" />
      </div>

      <h2>Traveling Rotation</h2>
      <p>
        A few movement symbols combine "traveling" movement with an added
        rotation. The forearm rotates as the arm moves in a specific direction.
        The rotation symbol is placed on the stem line of the arrow.
      </p>
      <Row stretch>
        <Col>
          <div className="examples-row">
            <Figure
              src={`${D}/wall-plane-twist.png`}
              caption="Wall-Plane-Twist — Straight With Rotation"
            />
            <Figure
              src={`${D}/wall-plane-twist-twist.png`}
              caption="Wall-Plane-Twist-Twist — Straight With Rotation"
            />
            <Figure
              src={`${D}/wall-plane-twist-shake.png`}
              caption="Wall-Plane-Twist-Shake — Straight With Rotation"
            />
          </div>
        </Col>
        <Col>
          <div className="examples-row">
            <Figure
              src={`${D}/floor-plane-twist.png`}
              caption="Floor-Plane-Twist — Straight With Rotation"
            />
            <Figure
              src={`${D}/floor-plane-twist-twist.png`}
              caption="Floor-Plane-Twist-Twist — Straight With Rotation"
            />
            <Figure
              src={`${D}/floor-plane-twist-shake.png`}
              caption="Floor-Plane-Twist-Shake — Straight With Rotation"
            />
          </div>
        </Col>
      </Row>

      <h2>Shaking Rotation</h2>
      <p>
        Shaking Rotation does not define how many rotations you make. Instead,
        it is a fast, shaking motion. It can be written with or without an
        arrowhead. The dark and light arrowheads are needed at times, to show
        which arm is doing the shaking.
      </p>
      <Figure src={`${D}/shaking-chart.png`} />
      <Row stretch>
        <Col>
          <p>
            <strong>Shaking Movement, Forearm Up or Down</strong> — Parallel
            with the Wall Plane
          </p>
        </Col>
        <Col>
          <p>
            <strong>Shaking Movement, Forearm Forward</strong> — Parallel with
            the Floor Plane
          </p>
        </Col>
      </Row>

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
        <SignFigure slug="ch8-before" />
        <SignFigure slug="ch8-basketball" />
      </div>
    </>
  );
}
