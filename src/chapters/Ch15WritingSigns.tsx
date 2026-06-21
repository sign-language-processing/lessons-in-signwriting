import { Fragment, useState } from "react";
import { Figure } from "../components/Figure";
import { Grid, Row } from "../components/Layout";
import { SgnwSign } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";
import { asset } from "../lib/asset";

const D = "/figures/ch15";

type Spoke = { symbol: string; angle: number };

// The 8 movement arrows placed around the Position of Contact like spokes on a
// Movement Wheel (angle measured CCW from East). Wall Plane = double-stemmed
// up/down/side arrows; Floor Plane = single-stemmed forward/back arrows.
const WALL_SPOKES: Spoke[] = [
  { symbol: "񇁁", angle: 90 },
  { symbol: "񇁂", angle: 135 },
  { symbol: "񇁃", angle: 180 },
  { symbol: "񇁄", angle: 225 },
  { symbol: "񇁅", angle: 270 },
  { symbol: "񇁆", angle: 315 },
  { symbol: "񇁇", angle: 0 },
  { symbol: "񇁈", angle: 45 },
];

const FLOOR_SPOKES: Spoke[] = [
  { symbol: "񈙡", angle: 90 },
  { symbol: "񈙢", angle: 135 },
  { symbol: "񈙣", angle: 180 },
  { symbol: "񈙤", angle: 225 },
  { symbol: "񈙥", angle: 270 },
  { symbol: "񈙦", angle: 315 },
  { symbol: "񈙧", angle: 0 },
  { symbol: "񈙨", angle: 45 },
];

const CURVE_SPOKES: Spoke[] = [
  { symbol: "񉎋", angle: 90 },
  { symbol: "񉎊", angle: 135 },
  { symbol: "񉎉", angle: 180 },
  { symbol: "񉎐", angle: 225 },
  { symbol: "񉎏", angle: 270 },
  { symbol: "񉎎", angle: 315 },
  { symbol: "񉎍", angle: 0 },
  { symbol: "񉎌", angle: 45 },
];

// Each arrow combined with the Position of Contact, the arrow placed in its
// spatial direction (the same sign the spoke "writes").
const COMBINED: Record<string, string> = {
  "񇁁": "𝠃𝤓𝤥񂇸𝣼𝤎񆄩𝣺𝤋񇁁𝣾𝣧",
  "񇁂": "𝠃𝤟𝤟񂇸𝤈𝤈񆄩𝤆𝤅񇁂𝣭𝣭",
  "񇁃": "𝠃𝤦𝤓񂇸𝤏𝣼񆄩𝤍𝣹񇁃𝣧𝣼",
  "񇁄": "𝠃𝤟𝤟񂇸𝤈𝣰񆄩𝤆𝣭񇁄𝣭𝤇",
  "񇁅": "𝠃𝤓𝤧񂇸𝣼𝣩񆄩𝣺𝣦񇁅𝣾𝤉",
  "񇁆": "𝠃𝤟𝤟񂇸𝣯𝣰񆄩𝣭𝣭񇁆𝤇𝤇",
  "񇁇": "𝠃𝤦𝤓񂇸𝣨𝣼񆄩𝣦𝣹񇁇𝤈𝣼",
  "񇁈": "𝠃𝤟𝤟񂇸𝣯𝤈񆄩𝣭𝤅񇁈𝤇𝣭",
  "񈙡": "𝠃𝤓𝤥񂇸𝣼𝤎񆄩𝣺𝤋񈙡𝣾𝣧",
  "񈙢": "𝠃𝤟𝤟񂇸𝤈𝤈񆄩𝤆𝤅񈙢𝣮𝣭",
  "񈙣": "𝠃𝤦𝤓񂇸𝤏𝣼񆄩𝤍𝣹񈙣𝣧𝣼",
  "񈙤": "𝠃𝤟𝤟񂇸𝤈𝣱񆄩𝤆𝣮񈙤𝣮𝤉",
  "񈙥": "𝠃𝤓𝤧񂇸𝣼𝣩񆄩𝣺𝣦񈙥𝣾𝤉",
  "񈙦": "𝠃𝤟𝤟񂇸𝣰𝣱񆄩𝣮𝣮񈙦𝤉𝤉",
  "񈙧": "𝠃𝤦𝤓񂇸𝣨𝣼񆄩𝣦𝣹񈙧𝤈𝣼",
  "񈙨": "𝠃𝤟𝤟񂇸𝣰𝤈񆄩𝣮𝤅񈙨𝤉𝣭",
  "񉎋": "𝠃𝤡𝤞񂇸𝣮𝤇񆄩𝣬𝤄񉎋𝤄𝣮",
  "񉎊": "𝠃𝤔𝤥񂇸𝣻𝤎񆄩𝣹𝤋񉎊𝣸𝣨",
  "񉎉": "𝠃𝤝𝤠񂇸𝤆𝤉񆄩𝤄𝤆񉎉𝣯𝣭",
  "񉎐": "𝠃𝤤𝤔񂇸𝤍𝣼񆄩𝤋𝣹񉎐𝣨𝣹",
  "񉎏": "𝠃𝤠𝤜񂇸𝤉𝣴񆄩𝤇𝣱񉎏𝣬𝤍",
  "񉎎": "𝠃𝤔𝤥񂇸𝣼𝣫񆄩𝣺𝣨񉎎𝣹𝤌",
  "񉎍": "𝠃𝤝𝤡񂇸𝣲𝣮񆄩𝣰𝣫񉎍𝤎𝤄",
  "񉎌": "𝠃𝤥𝤔񂇸𝣩𝣼񆄩𝣧𝣹񉎌𝤋𝣹",
};

function MovementWheel({ spokes }: { spokes: Spoke[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const radius = 120;
  return (
    <div className="movement-wheel">
      <img
        className="movement-wheel__center"
        src={asset(`${D}/ch15-step-contact-right.png`)}
        alt="Position of Contact"
      />
      {spokes.map(({ symbol, angle }) => {
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = -radius * Math.sin(rad);
        const active = hovered === symbol;
        const combined = COMBINED[symbol];
        return (
          <span
            key={symbol}
            className="movement-wheel__spoke"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              zIndex: active ? 10 : undefined,
            }}
            onMouseEnter={() => setHovered(symbol)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Re-key on hover so the glyph re-renders in red (a CSS color
                change alone doesn't recolor an already-rendered symbol). */}
            <sgnw-symbol
              key={active ? "on" : "off"}
              symbol={symbol}
              style={active ? { color: "red" } : undefined}
            ></sgnw-symbol>
            {active && combined && (
              <span className="movement-wheel__tip">
                <SgnwSign sign={combined} size={64} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function Em({ children }: { children: string }) {
  return <span className="em-term">{children}</span>;
}

function RotationRose({
  center,
  top,
  right,
  bottom,
  left,
}: {
  center: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
}) {
  return (
    <div className="rotation-rose">
      <sgnw-symbol className="rotation-rose__top" symbol={top}></sgnw-symbol>
      <sgnw-symbol className="rotation-rose__left" symbol={left}></sgnw-symbol>
      <sgnw-symbol className="rotation-rose__center" symbol={center}></sgnw-symbol>
      <sgnw-symbol className="rotation-rose__right" symbol={right}></sgnw-symbol>
      <sgnw-symbol className="rotation-rose__bottom" symbol={bottom}></sgnw-symbol>
    </div>
  );
}

export function Ch15WritingSigns() {
  return (
    <>
      <h2 id="chapter-15">Chapter 15 — Writing Signs</h2>
      <p>
        One principle guides almost every rule in this chapter:{" "}
        <strong>economy</strong> — write only what a reader needs to understand
        the sign, and no more. Most rules below are not really rules to
        memorize; because the writing is iconic, they fall into place as you
        write.
      </p>

      <h3>Position of Contact</h3>
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
      <Row stretch>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠃𝤬𝤰񀀉𝣻𝣳񀀡𝤂𝣼񈙂𝤖𝤚񈙖𝣟𝣝" />
          </span>
          <figcaption>
            <strong>Correct</strong> — Position of Contact is the Center of the
            Sign.
          </figcaption>
        </figure>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠃𝤶𝤴񀀉𝣗𝣍񀀡𝤧𝤖񈙂𝤌𝤋񈙖𝣫𝣫񆇡𝤁𝤀" />
          </span>
          <figcaption>
            <strong>Incorrect</strong> — Sign is too spread out and the focus is
            missing.
          </figcaption>
        </figure>
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

      <p>
        The two contacting symbols, such as the Hands and Face, are written
        close to each other. Then Movement Symbols are placed nearby.
      </p>
      <p>
        Sometimes the entire sign is nothing but the Position of Contact, with
        no other symbols needed.
      </p>
      <div className="correct-grid">
        <div className="correct-grid__head">Correct</div>
        <div className="correct-grid__head">Not Correct</div>
        {[1, 2, 3, 4, 5].map((n) => (
          <Fragment key={n}>
            <div className="correct-grid__cell">
              <img src={asset(`${D}/ch15-grid-correct-${n}.png`)} alt="" />
            </div>
            <div className="correct-grid__cell">
              <img src={asset(`${D}/ch15-grid-incorrect-${n}.png`)} alt="" />
            </div>
          </Fragment>
        ))}
      </div>

      <h2>Every Sign Has a Center</h2>
      <p>
        Every sign has a Center, like a little universe (the Sun is the center
        and the planets rotate around it). The Center of the Sign gives the
        sign focus for the reader. It is an Anchor, that grabs your attention.
      </p>

      <p>The Position of Contact is usually the Center of the Sign:</p>
      <Row stretch>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠃𝤬𝤰񀀉𝣻𝣳񀀡𝤂𝣼񈙂𝤖𝤚񈙖𝣟𝣝" />
          </span>
          <figcaption>
            <strong>MEET (ASL)</strong> — Position of Contact is the Center of
            this Sign.
          </figcaption>
        </figure>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠀񀕁񌞑񀀇񆇡񈗡𝠃𝤥𝤣񋾡𝣴𝣵񀕁𝤐𝤅񈗡𝤗𝣲" video="/videos/whatsthatsign/M531x529S2ff00482x483S10e00510x499S26500517x480.mp4" />
          </span>
          <figcaption>
            <strong>SEE (ASL)</strong> — Position of Contact is the Center of
            this Sign.
          </figcaption>
        </figure>
      </Row>

      <p>
        If there is <Em>no</Em> contact, then the Beginning Position is the
        Center:
      </p>
      <Row stretch>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠀񁦡񋽁񁦩񋽁񏀇񆿅񆿕𝠃𝤪𝤟񁦡𝤔𝣭񁦩𝣣𝣭񆿅𝤖𝤐񆿕𝣩𝤐" video="/videos/whatsthatsign/M536x525S14420514x475S14428465x475S22a04516x510S22a14471x510.mp4" />
          </span>
          <figcaption>
            <strong>CURTAINS (ASL)</strong> — Beginning Handshapes are the
            Center of this Sign.
          </figcaption>
        </figure>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠀񀁁񋽁񀀇񈗡񌏁𝠃𝤘𝥎񀁁𝣿𝤰񈗡𝣿𝤠񌏁𝣴𝣵" video="/videos/whatsthatsign/M518x572S10040493x542S26500493x526S30a00482x483.mp4" />
          </span>
          <figcaption>
            <strong>YOU (ASL)</strong> — Beginning Handshape is the Center of
            this Sign.
          </figcaption>
        </figure>
      </Row>


      <h2>Arrow Positions</h2>
      <p>
        The Position of Contact is written first. It is the Center of the sign.
      </p>
      <Row style={{ alignItems: "center" }}>
        <SgnwSign sign="𝠃𝤓𝤓񂇸𝣼𝣼񆄩𝣺𝣹" />
        <Figure
          src={`${D}/ch15-step-contact-right.png`}
          alt="The line drawing of the Position of Contact"
        />
      </Row>
      <p>
        There are 8 possible placements of Movement Symbols around the Center.
        Each arrow <Em>pulls</Em> or <Em>drags</Em> the hands in its
        direction, and keeps the same spatial relationship to the Center as it
        has on the Wheel.
      </p>

      <div className="write-guide">
        <div className="write-guide__text">
          <h3>Wall Plane — Up, Down &amp; Side</h3>
          <p>
            Straight movement parallel with the front wall is written with{" "}
            <strong>double-stemmed</strong> arrows.
          </p>
          <p>
            <strong>Hover each arrow</strong> on the wheel to see the sign it
            writes. The arrow stays where it sits on the wheel: the <Em>up</Em>{" "}
            arrow is placed <Em>above</Em> the Center, the <Em>down</Em> arrow{" "}
            <Em>below</Em>, the <Em>side</Em> arrows to the left or right, and the
            diagonals above- or below-and-to-the-side.
          </p>
        </div>
        <aside className="write-guide__sticky">
          <MovementWheel spokes={WALL_SPOKES} />
        </aside>
      </div>

      <div className="write-guide">
        <div className="write-guide__text">
          <h3>Floor Plane — Forward &amp; Back</h3>
          <p>
            Straight movement parallel with the floor is written with{" "}
            <strong>single-stemmed</strong> arrows.
          </p>
          <p>
            <strong>Hover each arrow</strong> to see the sign it writes. The{" "}
            <Em>forward</Em> arrow is placed <Em>above</Em> the Center (the
            movement travels away from your chest), the <Em>back</Em> arrow{" "}
            <Em>below</Em> (toward your chest), and the diagonals above- or
            below-and-to-the-side.
          </p>
        </div>
        <aside className="write-guide__sticky">
          <MovementWheel spokes={FLOOR_SPOKES} />
        </aside>
      </div>

      <div className="write-guide">
        <div className="write-guide__text">
          <h3>Curved Movement</h3>
          <p>
            If the movement is <Em>curved</Em>, choose the curve arrow you need.
            Like the
            straight arrows, each curve keeps the same spatial relationship to
            the Center as it has on the Wheel.
          </p>
          <p>
            <strong>Hover each arrow</strong> to see the sign it writes — a curve
            above the Center curves over the top, a curve below curves under, and
            so on around the wheel.
          </p>
        </div>
        <aside className="write-guide__sticky">
          <MovementWheel spokes={CURVE_SPOKES} />
        </aside>
      </div>
      <div className="examples-row">
        <figure>
          <SgnwSign sign="𝠃𝤚𝤙񂇸𝣵𝤂񆄩𝣳𝣿񋀉𝤄𝣴" />
          <figcaption>Help all of you</figcaption>
        </figure>
      </div>

      <p>
        If the movement is a <Em>rotation arrow</Em>, choose the{" "}
        <Em>rotation arrow</Em> needed. Keep the <Em>rotation arrow</Em> in the
        same spatial-relationship to the <Em>center</Em> as it was when all the
        other arrows were in the Wheel.
      </p>
      <Row>
        <RotationRose center="񀀁" top="񋎩" right="񋎫" bottom="񋎭" left="񋎯" />
        <RotationRose center="񀀱" top="񉳁" right="񉳇" bottom="񉳅" left="񉳃" />
      </Row>
      <p>
        If the curve of the Rotation Arrow is curved down, it is usually placed
        under the hands. If the curve of the Rotation Arrow is curved up, then
        it is usually placed above the hands.
      </p>
      <Figure
        src={`${D}/ch15-rotation-placement.png`}
        alt="Rotation arrows placed above or below the hands depending on their curve"
      />

      <p>
        <strong>
          <u>EXCEPTION</u>
        </strong>
        : Occasionally arrows can collide with other symbols, such as
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
      <Grid columns="repeat(3, 1fr)">
        <SgnwSign sign="𝠃𝤎𝤛񀀑𝣿𝣽񈗡𝤀𝣱" />
        <SgnwSign sign="𝠃𝤎𝤥񅰡𝣿𝤍񆕁𝤁𝣻񈗡𝤀𝣨" />
        <SgnwSign sign="𝠃𝤒𝤛񂇂𝣻𝤄񈗡𝣾𝣱" />
      </Grid>

      <h2>On the Page</h2>
      <p>
        Signs are written in <strong>vertical columns</strong> — top to bottom,
        with the columns running left to right across the page. This is the
        modern convention: Deaf writers found vertical writing more natural than
        horizontal, since it mirrors how the eyes take in signing. A sentence is
        a column of sign boxes ending in a punctuation box.
      </p>
      <p>
        Each box sits on a <strong>midline</strong> — the body's vertical line
        of symmetry. To find where a sign sits on it: center a head or torso
        symbol on the midline if the sign has one; otherwise center the Position
        of Contact; otherwise center the whole cluster of symbols. A sign can
        also be shifted off the midline, into a side <Em>lane</Em>, to place
        things side by side in space — for comparisons, or to show the body
        shifting between characters.
      </p>

      <h2>Going Further</h2>
      <p>
        This book covers everyday reading and writing. For the fuller, formal
        system — locating signs precisely on the body by height, depth, and
        width, and the SignSpelling notation used to order signs in dictionaries
        — see{" "}
        <a
          href="https://www.signwriting.org/archive/docs13/sw1283_A_GRAMMAR_OF_SIGNWRITING_by_Stuart_Thiessen.pdf"
          target="_blank"
          rel="noreferrer"
        >
          A Grammar of SignWriting
        </a>{" "}
        by Stuart Thiessen, pages 177–185.
      </p>
    </>
  );
}
