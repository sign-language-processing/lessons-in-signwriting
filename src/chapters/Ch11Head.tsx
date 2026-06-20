import { key2swu } from "@sutton-signwriting/core/convert";
import { Trans, useTranslation } from "react-i18next";
import { SgnwSign, SgnwSymbol } from "../components/Sgnw";
import { move, rot, RotationGrid, type RotSet } from "../components/RotationTiles";

const sym = (spec: string): string => key2swu(`S${spec}00`);

const VIEWPOINT_SPECS = [
  "2ff00",
  "2ff02",
  "2ff33",
  "2ff31",
  "2ff20",
  "2ff21",
  "2ff23",
];

// Contact Center: the Touch star (S205) centered on each viewpoint (composed
// with signwriting canonicalize so the star sits at the head's center).
const CONTACT_SIGNS = [
  "𝠃𝤘𝤘񋾡𝣴𝣴񆇡𝤁𝤁",
  "𝠃𝤜𝤙񋾣𝣰𝣴񆇡𝤁𝤁",
  "𝠃𝤜𝤙񋿔𝣱𝣴񆇡𝤁𝤁",
  "𝠃𝤜𝤙񋿒𝣱𝣴񆇡𝤁𝤁",
  "𝠃𝤞𝤙񋿁𝣮𝣴񆇡𝤁𝤁",
  "𝠃𝤛𝤛񋿂𝣱𝣱񆇡𝤁𝤁",
  "𝠃𝤛𝤛񋿄𝣱𝣱񆇡𝤁𝤁",
];

export function Ch11Head() {
  const { t } = useTranslation();
  const vpNames = t("ch11.viewpoints", { returnObjects: true }) as string[];
  const contactNames = t("ch11.contact", { returnObjects: true }) as string[];

  const rim: RotSet[] = [
    rot("3000", t("ch11.rimFace"), 8),
    rot("3843", t("ch11.rimBack"), 8),
    rot("3841", t("ch11.rimTop"), 8),
    rot("3844", t("ch11.rimSide"), 8),
  ];
  const relating: RotSet[] = [rot("3840", t("ch11.relating"), 8)];
  const headDirection: RotSet[] = [
    move("301", t("ch11.straightWall"), 8),
    move("303", t("ch11.straightFloor"), 8),
  ];
  const faceDirection: RotSet[] = [
    move("302", t("ch11.tiltsWall"), 8),
    move("304", t("ch11.curvesWall"), 4),
    move("305", t("ch11.curvesFloor"), 4),
    move("306", t("ch11.circles"), 4),
  ];
  const faceLines: RotSet[] = [
    rot("3080", t("ch11.upDown"), 8, t("ch11.upDownTitle")),
    rot("3090", t("ch11.noseTilt"), 8, t("ch11.noseTiltTitle")),
  ];

  return (
    <>
      <h2 id="chapter-11">
        {t("common.chapterHeading", { number: 11, title: t("toc.chapter-11") })}
      </h2>

      <h2>{t("ch11.headHeading")}</h2>
      <p>
        <Trans i18nKey="ch11.headIntro" />
      </p>
      <div className="face-grid">
        {VIEWPOINT_SPECS.map((spec, i) => (
          <figure key={spec} className="face-tile">
            <SgnwSymbol symbol={sym(spec)} />
            <figcaption className="face-tile__name">{vpNames[i]}</figcaption>
          </figure>
        ))}
      </div>

      <h3>{t("ch11.contactHeading")}</h3>
      <p>
        <Trans i18nKey="ch11.contactIntro" />
      </p>
      <div className="face-grid">
        {CONTACT_SIGNS.map((sign, i) => (
          <figure key={sign} className="face-tile">
            <SgnwSign sign={sign} />
            <figcaption className="face-tile__name">{contactNames[i]}</figcaption>
          </figure>
        ))}
      </div>

      <h2>{t("ch11.rimHeading")}</h2>
      <p>{t("ch11.rimIntro")}</p>
      <RotationGrid sets={rim} />

      <h3>{t("ch11.relatingHeading")}</h3>
      <p>
        <Trans i18nKey="ch11.relatingIntro" />
      </p>
      <RotationGrid sets={relating} />

      <h2>{t("ch11.movementHeading")}</h2>
      <p>{t("ch11.movementIntro")}</p>

      <h3>{t("ch11.headDirectionHeading")}</h3>
      <p>{t("ch11.headDirectionIntro")}</p>
      <RotationGrid sets={headDirection} />

      <h3>{t("ch11.faceDirectionHeading")}</h3>
      <p>{t("ch11.faceDirectionIntro")}</p>
      <RotationGrid sets={faceDirection} />

      <h2>{t("ch11.positionsHeading")}</h2>
      <h3>{t("ch11.faceLinesHeading")}</h3>
      <p>{t("ch11.faceLinesIntro")}</p>
      <RotationGrid sets={faceLines} />
    </>
  );
}
