import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SgnwSymbol } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";
import { WatchAndName } from "../components/WatchAndName";
import { MOVEMENT_PLANE_GAME } from "../lib/watchGames";
import {
  DiagonalPlane3D,
  DiagonalPlaneDown3D,
  FloorPlaneArrows3D,
  SignSpaceSections,
  WallPlaneArrows3D,
} from "../components/SignSpace3D";

const fig = (name: string) => `/figures/ch6/${name}.png`;

type Move = { symbol: string; name: string; desc: string };

const WALL_MOVES: Move[] = [
  { symbol: "񇀡", name: "Wall Plane Straight", desc: "Movement From Elbow" },
  { symbol: "񇅁", name: "Wall Plane Flex", desc: "Movement From Wrist" },
  { symbol: "񇆡", name: "Wall Plane Double", desc: "Small, Quick Movement" },
  { symbol: "񇉡", name: "Wall Plane Nod", desc: "Small, Quick Movement" },
  { symbol: "񇌨", name: "Wall Plane Cross", desc: "Cross 1 Way, Then Other" },
  { symbol: "񇎁", name: "Wall Plane Triple", desc: "Small, Quick Movement" },
  { symbol: "񇑁", name: "Wall Plane Nod & A Half", desc: "Small, Quick Movement" },
  { symbol: "񇕡", name: "Wall Plane Rooftop", desc: "Diagonal-Straight" },
  { symbol: "񇚁", name: "Wall Plane Corner", desc: "Straight-Corner" },
  { symbol: "񇠁", name: "Wall Plane Check", desc: "Diagonal-Corner-Straight" },
  { symbol: "񇤡", name: "Wall Plane Box", desc: "Straight-Corner-Straight" },
  { symbol: "񇩁", name: "Wall Plane ZigZag", desc: "Straight-Corner-Diagonal" },
  { symbol: "񇭡", name: "Wall Plane Peaks", desc: "Mountain Tops" },
  { symbol: "񇰡", name: "Wall Plane Twist", desc: "Straight with Rotation" },
  { symbol: "񇲁", name: "Wall Plane Twist Twist", desc: "Straight with Rotation" },
  { symbol: "񇳡", name: "Wall Plane Twist Shake", desc: "Straight with Rotation" },
];

const FLOOR_MOVES: Move[] = [
  { symbol: "񈙁", name: "Floor Plane Straight", desc: "Movement From Elbow" },
  { symbol: "񈝡", name: "Floor Plane Flex", desc: "Movement From Wrist" },
  { symbol: "񈟁", name: "Floor Plane Double", desc: "Small, Quick Movement" },
  { symbol: "񈢁", name: "Floor Plane Nod", desc: "Small, Quick Movement" },
  { symbol: "񈥁", name: "Floor Plane Cross", desc: "Cross 1 Way, Then Other" },
  { symbol: "񈦡", name: "Floor Plane Triple", desc: "Small, Quick Movement" },
  { symbol: "񈩡", name: "Floor Plane Nod & A Half", desc: "Small, Quick Movement" },
  { symbol: "񈬡", name: "Floor Plane Road Bend", desc: "Diagonal Straight" },
  { symbol: "񈯡", name: "Floor Plane Corner", desc: "Straight-Corner" },
  { symbol: "񈲡", name: "Floor Plane Check", desc: "Diagonal-Corner-Straight" },
  { symbol: "񈵡", name: "Floor Plane Box", desc: "Straight-Corner-Straight" },
  { symbol: "񈺁", name: "Floor Plane ZigZag", desc: "Straight-Corner-Diagonal" },
  { symbol: "񈾡", name: "Floor Plane Peaks", desc: "Mountain Tops" },
  { symbol: "񉁡", name: "Floor Plane Twist", desc: "Straight with Rotation" },
  { symbol: "񉃁", name: "Floor Plane Twist Twist", desc: "Straight with Rotation" },
  { symbol: "񉄡", name: "Floor Plane Twist Shake", desc: "Straight with Rotation" },
];

const CONFUSE: { symbol: string; label: string }[] = [
  { symbol: "񆿁", label: "Up" },
  { symbol: "񇿡", label: "Up-Forward Diagonal" },
  { symbol: "񈗡", label: "Forward" },
  { symbol: "񆿅", label: "Down" },
  { symbol: "񈅥", label: "Down-Back Diagonal" },
  { symbol: "񈗥", label: "Back" },
];

function MovementList({ items }: { items: Move[] }) {
  return (
    <ul className="movement-list">
      {items.map(({ symbol, name, desc }) => (
        <li key={name}>
          <SgnwSymbol symbol={symbol} className="movement-list__symbol" />
          <span>
            <strong>{name}</strong> — {desc}
          </span>
        </li>
      ))}
    </ul>
  );
}

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

      <SignSpaceSections />

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
      <div className="grid-3">
        <SignFigure slug="ch6-follow" />
        <SignFigure slug="ch6-plan" />
      </div>

      <h2>Up-Down Movement</h2>
      <p>
        Up-Down Movement is parallel with the Front Wall or your chest. It is
        written with double-stemmed arrows. Movement with the right hand uses a
        dark arrowhead; movement with the left hand uses a light arrowhead.{" "}
        <strong>Remember!</strong> SignWriting is written from the expressive
        point of view, so it is most correct looking at this from the back.
      </p>
      <div className="print-only">
        <Figure src={fig("ch6-up-down-rose")} />
      </div>
      <div className="screen-only">
        <WallPlaneArrows3D />
      </div>

      <h2>Forward-Back Movement</h2>
      <p>
        Forward-Back Movement is parallel with the Floor or a table top. It is
        written with single-stemmed arrows. Movement with the right hand uses a
        dark arrowhead; movement with the left hand uses a light arrowhead.
      </p>
      <div className="print-only">
        <Figure src={fig("ch6-forward-rose")} />
        <Figure src={fig("ch6-back-rose")} />
      </div>
      <div className="screen-only">
        <FloorPlaneArrows3D />
      </div>


      <h2>Movement To The Side</h2>
      <p>
        Movement to the side can be viewed from either the Front View or the Top
        View. It can be written with either double-stemmed or single-stemmed
        arrows.
      </p>
      <Figure src={fig("ch6-side")} />


      <Row stretch>
        <Col>
          <h2>
            Up or Down <SgnwSymbol symbol="񇉡" />
          </h2>
          <p>
            A double-stemmed arrow means that the movement is straight up or
            down, parallel with the front wall. The movement is flat with the
            front of your body.
          </p>
          <div className="col-figs">
            <SignFigure slug="ch6-monthly" />
            <SignFigure slug="ch6-disappear" />
          </div>
        </Col>
        <Col className="col--divided">
          <h2>
            Forward or Back <SgnwSymbol symbol="񈢁" />
          </h2>
          <p>
            A single-stemmed arrow means that the movement is forward or back,
            parallel with the floor. You are looking down, on top of the
            movement.
          </p>
          <div className="col-figs">
            <SignFigure slug="ch6-excuse-me" />
            <SignFigure slug="ch6-eager" />
          </div>
        </Col>
      </Row>

      <h2>Up-Down Straight Movement</h2>
      <p>
        Up-Down movement is parallel with the Front Wall. It is written with
        double-stemmed arrows.
      </p>
      <MovementList items={WALL_MOVES} />

      <h3>Examples</h3>
      <div className="grid-2">
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
      <MovementList items={FLOOR_MOVES} />

      <h2>Forward-Back Straight Arrows</h2>
      <p>Straight movement parallel with the floor.</p>
      <div className="grid-3">
        <SignFigure slug="ch6-hello" />
        <SignFigure slug="ch6-nothing" />
        <SignFigure slug="ch6-ask-question" />
      </div>

      <h2>Quick Recap</h2>
      <p>Let's review what we have already learned.</p>
      <p>
        Writing movement is based on imaginary planes that cut space. The Plane
        that is parallel with the front wall, is called the Wall Plane. Up-Down
        Movement is parallel with the Wall Plane. It is written with
        double-stemmed arrows.
      </p>
      <p>
        The Plane that is parallel with the floor, is called the Floor Plane.
        Forward-Back Movement is parallel with the Floor Plane. It is written
        with single-stemmed arrows.
      </p>
      <Row stretch>
        <Col>
          <p>
            Imagine a rocketship that travels straight up. Up Movement is
            written with double-stemmed arrows.
          </p>
          <Figure src={fig("ch6-rocketship")} />
        </Col>
        <Col>
          <p>
            Imagine driving a car. Think of the line in the center of the road.
            Forward Movement is written with single-stemmed arrows.
          </p>
          <Figure src={fig("ch6-car")} />
        </Col>
      </Row>

      <section className="signspace-section">
        <div className="signspace-section__text">
          <h2 style={{ color: "#8b5cf6" }}>The Diagonal Plane(s)</h2>
          <p>
            Space is also divided by diagonal planes. The Up-Diagonal Plane
            starts low at your feet and extends up towards the front wall. It is
            both forward and up.
          </p>
          <Figure src={fig("ch6-diagonal-plane")} />
          <h2>Forward or Back Diagonal</h2>
          <p>
            A horizontal bar means away from your chest. A dot means towards
            your chest.
          </p>
          <Figure src={fig("ch6-forward-back-diagonal")} />
        </div>
        <div className="signspace-section__viewer">
          <DiagonalPlane3D />
          <DiagonalPlaneDown3D />
        </div>
      </section>

      <Row stretch>
        <Col>
          <h2>
            Up-Forward Diagonal Movement <SgnwSymbol symbol="񇿡" />
          </h2>
          <p>
            Imagine an airplane taking off, traveling toward the horizon.
            Up-Forward-Diagonal-Movement is written with a double-stemmed arrow.
            A horizontal line, representing the horizon, crosses the stemline.
          </p>
          <Figure src={fig("ch6-up-forward")} />
        </Col>
        <Col className="col--divided">
          <h2>
            Down-Back Diagonal Movement <SgnwSymbol symbol="񈅥" />
          </h2>
          <p>
            Imagine an airplane coming in for a landing, traveling towards you.
            Down-Back-Diagonal Movement is written with double-stemmed arrows. A
            dark dot is written on the stem of the arrow. The dot represents the
            nose of the plane as it is coming towards you.
          </p>
          <Figure src={fig("ch6-down-back")} />
        </Col>
      </Row>

      <h2>Do Not Confuse These Arrows</h2>
      <div className="confuse-grid">
        {CONFUSE.map(({ symbol, label }) => (
          <div className="confuse-cell" key={label}>
            <SgnwSymbol symbol={symbol} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <h2>Building Longer Paths</h2>
      <p>
        These straight arrows are the building blocks. Once you know the shape
        of each one and the movement it stands for, you can join them into
        longer, more complex paths — which is exactly how movement is written
        for classifiers and the curved and circular movements in the chapters
        ahead. Learn the basic arrows well, and the rest are combinations.
      </p>
      <WatchAndName game={MOVEMENT_PLANE_GAME} />
    </>
  );
}
