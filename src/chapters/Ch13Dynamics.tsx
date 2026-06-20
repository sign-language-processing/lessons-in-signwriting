import { Trans, useTranslation } from "react-i18next";
import { Figure } from "../components/Figure";
import { SignFigure } from "../components/SignFigure";
import { Row } from "../components/Layout";
import { asset } from "../lib/asset";

const FIG = asset("/figures/ch13");

const CAT_SLUGS = ["movement", "handshape", "facial", "punctuation", "unit"];
const MOVE_SLUGS = [
  "simultaneous",
  "alternating",
  "uneven",
  "slow",
  "smooth",
  "fast",
  "fast-emphasis",
  "tense",
  "tense-emphasis",
  "relaxed",
  "relaxed-emphasis",
];
const BED_SLUGS = ["ch13-bed-left", "ch13-bed-center", "ch13-bed-right"];

export function Ch13Dynamics() {
  const { t } = useTranslation();
  const moves = t("ch13.movement", { returnObjects: true }) as {
    title: string;
    body?: string;
  }[];
  const beds = t("ch13.bedPlacements", { returnObjects: true }) as string[];

  return (
    <>
      <h2 id="chapter-13">
        {t("common.chapterHeading", { number: 13, title: t("toc.chapter-13") })}
      </h2>
      <Figure
        src={`${FIG}/ch13-classroom-photo.png`}
        caption={t("ch13.caption")}
      />

      <h2>{t("ch13.dynSymbolsHeading")}</h2>
      <ol className="dyn-categories">
        {CAT_SLUGS.map((slug, i) => (
          <li key={slug}>
            <p>
              <Trans i18nKey={`ch13.categories.${i}`} />
            </p>
            <Figure src={`${FIG}/ch13-cat-${slug}.png`} />
          </li>
        ))}
      </ol>

      <h2>{t("ch13.movementHeading")}</h2>
      <dl className="dyn-list">
        {MOVE_SLUGS.map((slug, i) => (
          <div className="dyn-list__row" key={slug}>
            <img
              className="dyn-list__symbol"
              src={`${FIG}/ch13-move-${slug}.png`}
              alt=""
            />
            <div className="dyn-list__text">
              <dt>{moves[i]?.title}</dt>
              {moves[i]?.body && <dd>{moves[i]?.body}</dd>}
            </div>
          </div>
        ))}
      </dl>

      <h2>{t("ch13.classifiersHeading")}</h2>
      <Row>
        <div style={{ flex: 2, textAlign: "left" }}>
          <p>
            <Trans i18nKey="ch13.cl1" />
          </p>
          <p>{t("ch13.cl2")}</p>
          <p>
            <Trans i18nKey="ch13.cl3" />
          </p>
          <p>
            <Trans i18nKey="ch13.cl4" />
          </p>
        </div>
        <div>
          <Figure src={`${FIG}/ch13-handshape-sequence.png`} />
        </div>
      </Row>

      <h2>{t("ch13.facialHeading")}</h2>
      <p>
        <Trans i18nKey="ch13.fac1" />
      </p>
      <p>
        <Trans i18nKey="ch13.fac2" />
      </p>
      <Row>
        {BED_SLUGS.map((slug, i) => (
          <div key={slug}>
            <Figure src={`${FIG}/${slug}.png`} />
            <p>{beds[i]}</p>
          </div>
        ))}
      </Row>
      <p>{t("ch13.bedComplete")}</p>
      <div className="examples-row">
        <SignFigure slug="ch13-bed" />
      </div>

      <h2>{t("ch13.unitHeading")}</h2>
      <Row>
        <div style={{ flex: 2 }}>
          <p>{t("ch13.u1")}</p>
          <p>{t("ch13.u2")}</p>
          <p>{t("ch13.u3")}</p>
          <p>{t("ch13.u4")}</p>
          <p>{t("ch13.u5")}</p>
          <p>{t("ch13.u6")}</p>
        </div>
        <div>
          <Figure src={`${FIG}/ch13-unit-column.png`} />
        </div>
      </Row>
    </>
  );
}
