import { key2swu } from "@sutton-signwriting/core/convert";
import { Trans, useTranslation } from "react-i18next";
import { SgnwSymbol } from "../components/Sgnw";
import { move, RotationGrid, type RotSet } from "../components/RotationTiles";

const SHOULDER_LINE = key2swu("S36d00");

export function Ch12Body() {
  const { t } = useTranslation();

  const shoulders: RotSet[] = [
    move("36d", t("ch12.shoulderLine"), 4),
    move("36e", t("ch12.shoulderPositions"), 6),
    move("36f", t("ch12.shoulderWall"), 8),
    move("370", t("ch12.shoulderFloor"), 8),
  ];
  const torso: RotSet[] = [
    move("372", t("ch12.torsoStretch"), 4),
    move("373", t("ch12.torsoBend"), 4),
    move("374", t("ch12.torsoTwist"), 4),
    move("371", t("ch12.ribcageTilt"), 8),
  ];
  const tilts: RotSet[] = [move("375", t("ch12.upperBodyTilts"), 8)];

  return (
    <>
      <h2 id="chapter-12">
        {t("common.chapterHeading", { number: 12, title: t("toc.chapter-12") })}
      </h2>

      <div className="face-neutral">
        <SgnwSymbol symbol={SHOULDER_LINE} size={96} />
        <div>
          <h3>{t("ch12.shoulderLineHeading")}</h3>
          <p>
            <Trans i18nKey="ch12.shoulderLineIntro" />
          </p>
        </div>
      </div>

      <h2>{t("ch12.shouldersHeading")}</h2>
      <p>{t("ch12.shouldersIntro")}</p>
      <RotationGrid sets={shoulders} />

      <h2>{t("ch12.torsoHeading")}</h2>
      <p>{t("ch12.torsoIntro")}</p>
      <RotationGrid sets={torso} />

      <h2>{t("ch12.tiltsHeading")}</h2>
      <p className="ch12-subhead">{t("ch12.tiltsSubhead")}</p>
      <p>{t("ch12.tiltsIntro")}</p>
      <RotationGrid sets={tilts} />
    </>
  );
}
