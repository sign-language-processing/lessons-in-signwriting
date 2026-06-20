import { Fragment, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Figure } from "../components/Figure";
import { Grid, Row } from "../components/Layout";
import { SgnwSign } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";
import { asset } from "../lib/asset";

const D = "/figures/ch15";

const TRANS_COMPONENTS = {
  term: <span className="em-term" />,
  u: <u />,
};

/** A paragraph/caption with inline <strong>/<term>/<u> markup from a key. */
function T({ k }: { k: string }) {
  return <Trans i18nKey={k} components={TRANS_COMPONENTS} />;
}

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
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<string | null>(null);
  const radius = 120;
  return (
    <div className="movement-wheel">
      <img
        className="movement-wheel__center"
        src={asset(`${D}/ch15-step-contact-right.png`)}
        alt={t("ch15.positionOfContact")}
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
  const { t } = useTranslation();
  return (
    <>
      <h2 id="chapter-15">
        {t("common.chapterHeading", { number: 15, title: t("toc.chapter-15") })}
      </h2>

      <h3>{t("ch15.posContactHeading")}</h3>
      <p>{t("ch15.pc1")}</p>
      <p>{t("ch15.pc2")}</p>
      <p>{t("ch15.pc3")}</p>
      <Row stretch>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠃𝤬𝤰񀀉𝣻𝣳񀀡𝤂𝣼񈙂𝤖𝤚񈙖𝣟𝣝" />
          </span>
          <figcaption>
            <T k="ch15.correctCaption" />
          </figcaption>
        </figure>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠃𝤶𝤴񀀉𝣗𝣍񀀡𝤧𝤖񈙂𝤌𝤋񈙖𝣫𝣫񆇡𝤁𝤀" />
          </span>
          <figcaption>
            <T k="ch15.incorrectCaption" />
          </figcaption>
        </figure>
      </Row>
      <p>{t("ch15.pc4")}</p>
      <p>{t("ch15.pc5")}</p>
      <p>{t("ch15.pc6")}</p>
      <p>{t("ch15.pc7")}</p>
      <p>{t("ch15.pc8")}</p>
      <p>{t("ch15.pc9")}</p>
      <div className="correct-grid">
        <div className="correct-grid__head">{t("ch15.gridCorrect")}</div>
        <div className="correct-grid__head">{t("ch15.gridNotCorrect")}</div>
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

      <h2>{t("ch15.centerHeading")}</h2>
      <p>{t("ch15.center1")}</p>
      <p>{t("ch15.center2")}</p>
      <Row stretch>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠃𝤬𝤰񀀉𝣻𝣳񀀡𝤂𝣼񈙂𝤖𝤚񈙖𝣟𝣝" />
          </span>
          <figcaption>
            <T k="ch15.meetCaption" />
          </figcaption>
        </figure>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠀񀕁񌞑񀀇񆇡񈗡𝠃𝤥𝤣񋾡𝣴𝣵񀕁𝤐𝤅񈗡𝤗𝣲" video="/videos/whatsthatsign/M531x529S2ff00482x483S10e00510x499S26500517x480.mp4" />
          </span>
          <figcaption>
            <T k="ch15.seeCaption" />
          </figcaption>
        </figure>
      </Row>

      <p>
        <T k="ch15.noContactIntro" />
      </p>
      <Row stretch>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠀񁦡񋽁񁦩񋽁񏀇񆿅񆿕𝠃𝤪𝤟񁦡𝤔𝣭񁦩𝣣𝣭񆿅𝤖𝤐񆿕𝣩𝤐" video="/videos/whatsthatsign/M536x525S14420514x475S14428465x475S22a04516x510S22a14471x510.mp4" />
          </span>
          <figcaption>
            <T k="ch15.curtainsCaption" />
          </figcaption>
        </figure>
        <figure className="compare">
          <span className="compare__sign">
            <SgnwSign sign="𝠀񀁁񋽁񀀇񈗡񌏁𝠃𝤘𝥎񀁁𝣿𝤰񈗡𝣿𝤠񌏁𝣴𝣵" video="/videos/whatsthatsign/M518x572S10040493x542S26500493x526S30a00482x483.mp4" />
          </span>
          <figcaption>
            <T k="ch15.youCaption" />
          </figcaption>
        </figure>
      </Row>


      <h2>{t("ch15.arrowHeading")}</h2>
      <p>{t("ch15.arrow1")}</p>
      <Row style={{ alignItems: "center" }}>
        <SgnwSign sign="𝠃𝤓𝤓񂇸𝣼𝣼񆄩𝣺𝣹" />
        <Figure
          src={`${D}/ch15-step-contact-right.png`}
          alt={t("ch15.positionOfContact")}
        />
      </Row>
      <p>
        <T k="ch15.arrow2" />
      </p>

      <div className="write-guide">
        <div className="write-guide__text">
          <h3>{t("ch15.wallGuideHeading")}</h3>
          <p>
            <T k="ch15.wallGuide1" />
          </p>
          <p>
            <T k="ch15.wallGuide2" />
          </p>
        </div>
        <aside className="write-guide__sticky">
          <MovementWheel spokes={WALL_SPOKES} />
        </aside>
      </div>

      <div className="write-guide">
        <div className="write-guide__text">
          <h3>{t("ch15.floorGuideHeading")}</h3>
          <p>
            <T k="ch15.floorGuide1" />
          </p>
          <p>
            <T k="ch15.floorGuide2" />
          </p>
        </div>
        <aside className="write-guide__sticky">
          <MovementWheel spokes={FLOOR_SPOKES} />
        </aside>
      </div>

      <div className="write-guide">
        <div className="write-guide__text">
          <h3>{t("ch15.curveGuideHeading")}</h3>
          <p>
            <T k="ch15.curveGuide1" />
          </p>
          <p>
            <T k="ch15.curveGuide2" />
          </p>
        </div>
        <aside className="write-guide__sticky">
          <MovementWheel spokes={CURVE_SPOKES} />
        </aside>
      </div>
      <div className="examples-row">
        <figure>
          <SgnwSign sign="𝠃𝤚𝤙񂇸𝣵𝤂񆄩𝣳𝣿񋀉𝤄𝣴" />
          <figcaption>{t("ch15.helpCaption")}</figcaption>
        </figure>
      </div>

      <p>
        <T k="ch15.rotationIntro" />
      </p>
      <Row>
        <RotationRose center="񀀁" top="񋎩" right="񋎫" bottom="񋎭" left="񋎯" />
        <RotationRose center="񀀱" top="񉳁" right="񉳇" bottom="񉳅" left="񉳃" />
      </Row>
      <p>{t("ch15.rotationPlacement")}</p>
      <Figure
        src={`${D}/ch15-rotation-placement.png`}
        alt={t("ch15.rotationPlacementAlt")}
      />

      <p>
        <T k="ch15.exception" />
      </p>
      <p>{t("ch15.exceptionExamples")}</p>
      <Grid columns="repeat(3, 1fr)">
        <SignFigure slug="ch15-really" />
        <SignFigure slug="ch15-not" />
        <SignFigure slug="ch15-good" />
      </Grid>
      <p>{t("ch15.exceptionWithout")}</p>
      <Grid columns="repeat(3, 1fr)">
        <SgnwSign sign="𝠃𝤎𝤛񀀑𝣿𝣽񈗡𝤀𝣱" />
        <SgnwSign sign="𝠃𝤎𝤥񅰡𝣿𝤍񆕁𝤁𝣻񈗡𝤀𝣨" />
        <SgnwSign sign="𝠃𝤒𝤛񂇂𝣻𝤄񈗡𝣾𝣱" />
      </Grid>
    </>
  );
}
