import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SignFigure } from "../components/SignFigure";

const fig = (name: string) => `/figures/ch6/${name}.png`;

export function Ch6StraightMovement() {
  return (
    <>
      <h2 id="chapter-6">Chapter 6 — Straight Movement</h2>

      <Row stretch>
        <Col>
          <h2>Wall Plane</h2>
          <p>The Wall Plane is parallel with the front wall.</p>
          <Figure src={fig("ch6-wall-kevin-1")} />
          <Figure src={fig("ch6-wall-kevin-2")} />
        </Col>
        <Col>
          <h2>Floor Plane</h2>
          <p>The Floor Plane is parallel with the floor.</p>
          <Figure src={fig("ch6-floor-cindy-1")} />
          <Figure src={fig("ch6-floor-cindy-2")} />
        </Col>
      </Row>

      <h2>Signing Space</h2>
      <Row>
        <Col style={{ textAlign: "left" }}>
          <p>
            Signing space is the area in which you move while you sign. It is the
            distance you can reach in front, below and above you. Signing space
            travels with you wherever you go.
          </p>
          <p>
            Think of your signing space like a room. It has a front and back wall
            and a floor and ceiling. It is divided into planes. A plane is an
            imaginary flat surface that dissects your signing space.
          </p>
          <p>
            There are two planes used in SignWriting: the Wall Plane and the
            Floor Plane. The Wall Plane is parallel with the front and back
            walls. The Floor Plane is parallel with the floor and ceiling. All
            movement symbols in SignWriting relate to these two planes.
          </p>
        </Col>
        <Col>
          <Figure src={fig("ch6-signing-space")} />
        </Col>
      </Row>

      <Row stretch>
        <Col>
          <Figure src={fig("ch6-wall-plane-person")} />
        </Col>
        <Col>
          <Figure src={fig("ch6-wall-plane-rose")} />
          <h2>Wall Plane</h2>
          <p>
            The Wall Plane cuts the body like a door, from side to side. Movement
            parallel with the Wall Plane is up and down. It is written with
            double-stemmed arrows.
          </p>
        </Col>
      </Row>

      <Row stretch>
        <Col>
          <Figure src={fig("ch6-floor-plane-rose")} />
          <h2>Floor Plane</h2>
          <p>
            The Floor Plane cuts the body like a tabletop, from front to back.
            Movement parallel with the Floor Plane is forward and back. It is
            written with single-stemmed arrows.
          </p>
        </Col>
        <Col>
          <Figure src={fig("ch6-floor-plane-person")} />
        </Col>
      </Row>

      <h2>The Planes</h2>
      <Row>
        <Figure src={fig("ch6-planes-wall-room")} caption="Wall Plane" />
        <Figure src={fig("ch6-planes-floor-room")} caption="Floor Plane" />
      </Row>
      <Row>
        <Figure
          src={fig("ch6-planes-wall-room-arrows")}
          caption="Wall Plane — Double-Stemmed Arrows"
        />
        <Figure
          src={fig("ch6-planes-floor-room-arrows")}
          caption="Floor Plane — Single-Stemmed Arrows"
        />
      </Row>

      <h2>Up-Down Movement</h2>
      <p>
        Up-Down Movement is parallel with the Front Wall or your chest. It is
        written with double-stemmed arrows.
      </p>
      <Figure src={fig("ch6-up-down-rose")} />

      <h2>Forward-Back Movement</h2>
      <p>
        Forward-Back Movement is parallel with the Floor or a table top. It is
        written with single-stemmed arrows.
      </p>
      <Figure src={fig("ch6-forward-rose")} />
      <Figure src={fig("ch6-back-rose")} />

      <Row stretch>
        <Col>
          <h2>Movement With The Right Hand</h2>
          <p>A dark arrowhead.</p>
          <Figure src={fig("ch6-right-hand")} />
        </Col>
        <Col>
          <h2>Movement With The Left Hand</h2>
          <p>A light arrowhead.</p>
          <Figure src={fig("ch6-left-hand")} />
        </Col>
      </Row>

      <h2>Movement To The Side</h2>
      <p>
        Movement to the side can be viewed from either the Front View or the Top
        View. It can be written with either double-stemmed or single-stemmed
        arrows.
      </p>
      <Figure src={fig("ch6-side")} />

      <h2>General Arrowhead Writes Overlapping Paths</h2>
      <p>
        When a right movement arrow writes ON TOP OF a left movement arrow, the
        two movement paths overlap each other. The two arrows blend together.
        The dark arrowhead and the light arrowhead become one arrowhead, called
        the General Arrowhead.
      </p>
      <p>
        Often the hands are contacting when moving in overlapping paths, but it
        is NOT ONLY for contacting hands. For example, two hands can be parallel,
        side by side, without contact, and then both move to the same side, so
        that the right arrow writes on top of the left arrow. This creates a
        General Arrowhead.
      </p>

      <h2>Straight Movement — Examples</h2>
      <Row>
        <Figure
          src={fig("ch6-confuse-up")}
          caption="Double-stemmed arrows mean movement is UP"
        />
        <Figure
          src={fig("ch6-confuse-forward")}
          caption="Single-stemmed arrows mean movement is FORWARD"
        />
      </Row>

      <Row stretch>
        <Col>
          <h2>Up or Down</h2>
          <p>
            A double-stemmed arrow means that the movement is straight up or
            down, parallel with the front wall. The movement is flat with the
            front of your body.
          </p>
        </Col>
        <Col>
          <h2>Forward or Back</h2>
          <p>
            A single-stemmed arrow means that the movement is forward or back,
            parallel with the floor. You are looking down, on top of the
            movement.
          </p>
        </Col>
      </Row>

      <div className="grid-3">
        <SignFigure slug="ch6-monthly" />
        <SignFigure slug="ch6-disappear" />
        <SignFigure slug="ch6-excuse-me" />
        <SignFigure slug="ch6-eager" />
      </div>

      <h2>Up-Down Straight Movement</h2>
      <p>
        Up-Down movement is parallel with the Front Wall. It is written with
        double-stemmed arrows.
      </p>
      <ul>
        <li><strong>Wall-Plane-Straight</strong> — Movement From Elbow</li>
        <li><strong>Wall-Plane-Flex</strong> — Movement From Wrist</li>
        <li><strong>Wall-Plane-Double</strong> — Small, Quick Movement</li>
        <li><strong>Wall-Plane-Nod</strong> — Small, Quick Movement</li>
        <li><strong>Wall-Plane-Cross</strong> — Cross 1 Way, Then Other</li>
        <li><strong>Wall-Plane-Triple</strong> — Small, Quick Movement</li>
        <li><strong>Wall-Plane Nod-&amp;-A-Half</strong> — Small, Quick Movement</li>
        <li><strong>Wall-Plane-Rooftop</strong> — Diagonal-Straight</li>
        <li><strong>Wall-Plane-Corner</strong> — Straight-Corner</li>
        <li><strong>Wall-Plane-Check</strong> — Diagonal-Corner-Straight</li>
        <li><strong>Wall-Plane-Box</strong> — Straight-Corner-Straight</li>
        <li><strong>Wall-Plane-ZigZag</strong> — Straight-Corner-Diagonal</li>
        <li><strong>Wall-Plane-Peaks</strong> — Mountain Tops</li>
        <li><strong>Wall-Plane-Twist</strong> — Straight with Rotation</li>
        <li><strong>Wall-Plane-Twist-Twist</strong> — Straight with Rotation</li>
        <li><strong>Wall-Plane-Twist-Shake</strong> — Straight with Rotation</li>
      </ul>
      <Figure src={fig("ch6-wall-plane-chart")} />

      <h2>Up-Down Straight Arrows</h2>
      <p>Movement Parallel With The Front Wall.</p>
      <div className="grid-3">
        <SignFigure slug="ch6-exam-test" />
        <SignFigure slug="ch6-house" />
        <SignFigure slug="ch6-system" />
        <SignFigure slug="ch6-square" />
      </div>

      <h2>Forward-Back Straight Movement</h2>
      <p>
        Forward-Back movement is parallel with the floor. It is written with
        single-stemmed arrows.
      </p>
      <ul>
        <li><strong>Floor-Plane-Straight</strong> — Movement From Elbow</li>
        <li><strong>Floor-Plane-Flex</strong> — Movement From Wrist</li>
        <li><strong>Floor-Plane-Double</strong> — Small, Quick Movement</li>
        <li><strong>Floor-Plane-Nod</strong> — Small, Quick Movement</li>
        <li><strong>Floor-Plane-Cross</strong> — Cross 1 Way, Then Other</li>
        <li><strong>Floor-Plane-Triple</strong> — Small, Quick Movement</li>
        <li><strong>Floor-Plane Nod-&amp;-A-Half</strong> — Small, Quick Movement</li>
        <li><strong>Floor-Plane-Road-Bend</strong> — Diagonal Straight</li>
        <li><strong>Floor-Plane-Corner</strong> — Straight-Corner</li>
        <li><strong>Floor-Plane-Check</strong> — Diagonal-Corner-Straight</li>
        <li><strong>Floor-Plane-Box</strong> — Straight-Corner-Straight</li>
        <li><strong>Floor-Plane-ZigZag</strong> — Straight-Corner-Diagonal</li>
        <li><strong>Floor-Plane-Peaks</strong> — Mountain Tops</li>
        <li><strong>Floor-Plane-Twist</strong> — Straight with Rotation</li>
        <li><strong>Floor-Plane-Twist-Twist</strong> — Straight with Rotation</li>
        <li><strong>Floor-Plane-Twist-Shake</strong> — Straight with Rotation</li>
      </ul>
      <Figure src={fig("ch6-floor-plane-chart")} />

      <h2>Forward-Back Straight Arrows</h2>
      <p>Straight movement parallel with the floor.</p>
      <div className="grid-3">
        <SignFigure slug="ch6-hello" />
        <SignFigure slug="ch6-nothing" />
        <SignFigure slug="ch6-right" />
        <SignFigure slug="ch6-ask-question" />
      </div>

      <h2>Writing Movement On Diagonal Planes</h2>
      <p>Let's review what we have already learned.</p>
      <p>
        Writing movement is based on imaginary planes that cut space. The Plane
        that is parallel with the front wall, is called the Wall Plane. Up-Down
        Movement is parallel with the Wall Plane. It is written with
        double-stemmed arrows.
      </p>
      <p>
        Imagine a rocketship that travels straight up. Up Movement is written
        with double-stemmed arrows.
      </p>
      <Figure src={fig("ch6-rocketship")} />
      <p>
        The Plane that is parallel with the floor, is called the Floor Plane.
        Forward-Back Movement is parallel with the Floor Plane. It is written
        with single-stemmed arrows. Imagine driving a car. Think of the line in
        the center of the road. Forward Movement is written with single-stemmed
        arrows.
      </p>
      <Figure src={fig("ch6-car")} />

      <h2>The Diagonal Plane</h2>
      <p>
        Space is also divided by diagonal planes. The Up-Diagonal Plane starts
        low at your feet and extends up towards the front wall. It is both
        forward and up.
      </p>
      <Figure src={fig("ch6-diagonal-plane")} />
      <h2>Forward or Back Diagonal</h2>
      <p>
        A horizontal bar means away from your chest. A dot means towards your
        chest.
      </p>
      <Figure src={fig("ch6-forward-back-diagonal")} />

      <h2>Up-Forward Diagonal Movement</h2>
      <p>
        Imagine an airplane taking off, traveling toward the horizon.
        Up-Forward-Diagonal-Movement is written with a double-stemmed arrow. A
        horizontal line, representing the horizon, crosses the stemline.
      </p>
      <Figure src={fig("ch6-up-forward")} />

      <h2>Down-Back Diagonal Movement</h2>
      <p>
        Imagine an airplane coming in for a landing, traveling towards you.
        Down-Back-Diagonal Movement is written with double-stemmed arrows. A
        dark dot is written on the stem of the arrow. The dot represents the nose
        of the plane as it is coming towards you.
      </p>
      <Figure src={fig("ch6-down-back")} />

      <h2>Do Not Confuse These Arrows</h2>
      <Figure
        src={fig("ch6-confuse-diag-up")}
        caption="Up · Up-Forward-Diagonal · Forward"
      />
      <Figure
        src={fig("ch6-confuse-diag-down")}
        caption="Down · Down-Back-Diagonal · Back"
      />
    </>
  );
}
