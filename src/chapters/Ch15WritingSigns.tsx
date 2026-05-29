import { Figure } from "../components/Figure";
import { Grid, Row } from "../components/Layout";
import { SignFigure } from "../components/SignFigure";

const D = "/figures/ch15";

export function Ch15WritingSigns() {
  return (
    <>
      <h2 id="chapter-15">Chapter 15 — Writing Signs &amp; Sign Literature</h2>

      <h2>Writing Signs</h2>
      <h3>SignSpelling Guideline 1 — First, write the Position of Contact</h3>
      <p>
        When starting to write a sign, ask yourself: "Is there a Position of
        Contact in this sign?". Are the hands contacting each other? Are the
        hands contacting the Face or Body? Write that Position of Contact
        first, which becomes the "Center of the Sign".
      </p>
      <p>
        When writing the Position of Contact, try to place the two contacting
        symbols as close to each other as possible. Try to make it look like it
        does in real life. There should be very little space between the two
        contacting symbols.
      </p>
      <p>
        SignSpellings revolve around the Position of Contact like a small
        universe. The Position of Contact is the Center of the Sign, and the
        Movement and Contact Symbols relate to that center.
      </p>
      <Row>
        <Figure src={`${D}/ch15-correct.png`} alt="Correct example" />
        <Figure src={`${D}/ch15-incorrect.png`} alt="Incorrect example" />
      </Row>
      <p>
        The Position of Contact is important because it holds the meaning in a
        sign. The eye focuses on the Position of Contact when reading. The
        Position of Contact is like a unit.
      </p>
      <p>
        Writing the Position of Contact also creates smaller signs in width and
        height, which makes writing in vertical columns more centered and
        compact, making the columns themselves less wide.
      </p>
      <p>
        Writing the Position of Contact gives a visual picture of the sign.
        Since you can see the two hands are touching by their close placement,
        the single Touch Contact Star is rarely necessary. It is not wrong to
        write the single Touch Contact Star, but it is not necessary either.
        This simplifies the writing of signs.
      </p>
      <p>
        Double Touch Contact Stars are written no matter what, because Double
        Touch, or Touch-Touch, is a movement, not a position. It is only single
        Touch Contact Stars that can be eliminated.
      </p>

      <h3>SignSpelling Guideline 1 (continued)</h3>
      <p>
        The two contacting symbols, such as the Hands and Face, are written
        close to each other. Then Movement Symbols are placed nearby.
      </p>
      <p>
        Sometimes the entire sign is nothing but the Position of Contact, with
        no other symbols needed.
      </p>
      <Figure
        src={`${D}/ch15-correct-grid.png`}
        alt="Five rows comparing the Correct and Not Correct placement of contacting symbols"
        caption="Correct (left) vs. Not Correct (right)"
      />

      <h2>SignSpelling Guideline 2 — Every Sign Has A Center</h2>
      <p>
        Every sign has a Center, like a little universe (the Sun is the center
        and the planets rotate around it). The Center of the Sign gives the
        sign focus for the reader. It is an Anchor, that grabs your attention.
      </p>

      <p>1. The Position of Contact is usually the Center of the Sign:</p>
      <div className="examples-row">
        <SignFigure slug="ch15-meet" />
        <SignFigure slug="ch15-see" />
      </div>
      <Row>
        <p style={{ flex: 1, minWidth: "240px" }}>
          <strong>MEET (ASL)</strong> — Position of Contact is the Center of
          this Sign.
        </p>
        <p style={{ flex: 1, minWidth: "240px" }}>
          <strong>SEE (ASL)</strong> — Position of Contact is the Center of this
          Sign.
        </p>
      </Row>

      <p>2. If there is NO contact, then the Beginning Position is the Center:</p>
      <div className="examples-row">
        <SignFigure slug="ch15-curtains" />
        <SignFigure slug="ch15-you" />
      </div>
      <Row>
        <p style={{ flex: 1, minWidth: "240px" }}>
          <strong>CURTAINS (ASL)</strong> — Beginning Handshapes are the Center
          of this Sign.
        </p>
        <p style={{ flex: 1, minWidth: "240px" }}>
          <strong>YOU (ASL)</strong> — Beginning Handshape is the Center of this
          Sign.
        </p>
      </Row>

      <p>
        3. Movement Symbols relate to the Center like planets rotating around
        the Sun in 8 possible directions.
      </p>
      <Figure
        src={`${D}/ch15-movement-wheel-intro.png`}
        alt="The beginning handshape in the middle of space, with movement symbols in eight directions dragging it"
      />
      <p>
        The beginning handshape is in the middle of space. The movement symbol
        "drags the handshape" in different directions. The beginning handshape
        is placed near the beginning stem of the arrow.
      </p>

      <h2>SignSpelling Guideline 3 — Step-by-Step Writing Process</h2>
      <p>
        1. The Position of Contact is written first. It is the Center of the
        sign.
      </p>
      <Figure
        src={`${D}/ch15-step-contact.png`}
        alt="A Position of Contact written first, beside its line drawing"
      />
      <p>
        2. There are 8 possible placements of Movement Symbols around the
        Center. The arrows PULL or DRAG the hands in the direction of the
        arrow. Imagine a Movement wheel with 8 spokes:
      </p>
      <Figure
        src={`${D}/ch15-step-wheel.png`}
        alt="A Movement Wheel with eight arrow spokes around a Position of Contact"
      />

      <h3>Step-by-Step Writing Process (continued)</h3>
      <p>3. Choose the arrow from the Movement Wheel.</p>
      <p>
        If the movement is straight UP, choose the UP arrow. Keep the UP arrow
        in the same spatial-relationship to the CENTER as it was when all the
        other arrows were in the Wheel. The UP arrow, in other words, is always
        placed ABOVE the CENTER of the sign, pulling it UP:
      </p>
      <Figure src={`${D}/ch15-up.png`} alt="The UP arrow placed above the Center" />

      <p>
        If the movement is straight FORWARD, choose the FORWARD arrow. Keep the
        FORWARD arrow in the same spatial-relationship to the CENTER as it was
        when all the other arrows were in the Wheel.
      </p>
      <p>
        The FORWARD arrow, in other words, is always placed ABOVE the CENTER of
        the sign, pulling it FORWARD:
      </p>
      <Figure
        src={`${D}/ch15-forward.png`}
        alt="The FORWARD arrow placed above the Center"
      />

      <p>
        If the movement is FORWARD-DIAGONAL, choose the FORWARD-DIAGONAL arrow.
        Keep the FORWARD-DIAGONAL arrow in the same spatial-relationship to the
        CENTER as it was when all the other arrows were in the Wheel.
      </p>
      <p>The FORWARD-DIAGONAL arrow is always placed above and to the diagonal:</p>
      <Figure
        src={`${D}/ch15-forward-diagonal.png`}
        alt="The Forward-Left-Diagonal arrow placed above and to the side"
      />
      <p>
        The Back Arrow is placed BELOW the Center. This means the movement is
        coming straight back towards your chest…
      </p>
      <Figure src={`${D}/ch15-back.png`} alt="The Back arrow placed below the Center" />

      <h3>Step-by-Step Writing Process (continued)</h3>
      <p>
        If the movement is CURVED, choose the CURVE arrow needed. Keep the
        CURVED arrow in the same spatial-relationship to the CENTER as it was
        when all the other arrows were in the Wheel.
      </p>
      <Figure
        src={`${D}/ch15-curve-chart.png`}
        alt="A wheel of eight curved arrows around a Position of Contact"
      />
      <div className="examples-row">
        <SignFigure slug="ch15-help" />
      </div>
      <p>
        <strong>HELP ALL OF YOU</strong> — a curved arrow placed above the
        Center.
      </p>

      <h3>Step-by-Step Writing Process (continued)</h3>
      <p>
        If the movement is a ROTATION ARROW, choose the ROTATION ARROW needed.
        Keep the ROTATION ARROW in the same spatial-relationship to the CENTER
        as it was when all the other arrows were in the Wheel.
      </p>
      <Figure
        src={`${D}/ch15-rotation.png`}
        alt="Rotation arrows shown in their spatial relationships to the Center"
      />
      <p>
        If the curve of the Rotation Arrow is curved down, it is usually placed
        under the hands. If the curve of the Rotation Arrow is curved up, then
        it is usually placed above the hands.
      </p>
      <Figure
        src={`${D}/ch15-rotation-placement.png`}
        alt="Rotation arrows placed above or below the hands depending on their curve"
      />

      <h3>Step-by-Step Writing Process (continued)</h3>
      <p>
        EXCEPTION: Occasionally arrows can collide with other symbols, such as
        the Facial Circle or the Shoulder Line. When this happens there is no
        choice but to place the Movement Arrow a little to the side to avoid the
        collision. This happens mostly when contacting the Face.
      </p>
      <p>Three ASL Signs that are exceptions:</p>
      <Grid columns="repeat(3, 1fr)">
        <SignFigure slug="ch15-really" />
        <SignFigure slug="ch15-not" />
        <SignFigure slug="ch15-good" />
      </Grid>
      <p>If the Facial Circle had not been there, these signs would be written like this:</p>
      <Figure
        src={`${D}/ch15-exception-without-circle.png`}
        alt="The three exception signs rewritten without the Facial Circle"
      />
    </>
  );
}
