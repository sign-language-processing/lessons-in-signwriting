import { useTranslation } from "react-i18next";
import { Figure } from "../components/Figure";

type PunctText = { term: string; english: string; detail?: string };

const PUNCT_SLUGS = [
  "ch14-pause",
  "ch14-end-of-sentence",
  "ch14-pause-before-end-of-phrase",
  "ch14-questioning-pause",
  "ch14-pause-before-listing",
  "ch14-pause-sub-phrase",
];

export function Ch14Punctuation() {
  const { t } = useTranslation();
  const entries = t("ch14.punctuation", { returnObjects: true }) as PunctText[];

  return (
    <>
      <h2 id="chapter-14">
        {t("common.chapterHeading", { number: 14, title: t("toc.chapter-14") })}
      </h2>

      <dl className="punct-list">
        {PUNCT_SLUGS.map((slug, i) => (
          <div className="punct-list__row" key={slug}>
            <Figure src={`/figures/ch14/${slug}.png`} />
            <div className="punct-list__body">
              <dt>{entries[i]?.term}</dt>
              <dd>
                ({entries[i]?.english})
                {entries[i]?.detail && (
                  <>
                    <br />
                    {entries[i]?.detail}
                  </>
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <h2>{t("ch14.dynamicsHeading")}</h2>
      <p className="punct-subtitle">{t("ch14.dynamicsSubtitle")}</p>
      <div className="punct-dynamics">
        <div className="punct-dynamics__text">
          <p>{t("ch14.dyn1")}</p>
          <p>{t("ch14.dyn2")}</p>
          <p>{t("ch14.dyn3")}</p>
          <p>{t("ch14.dyn4")}</p>
        </div>
        <Figure src="/figures/ch14/ch14-dynamics-chart.png" />
      </div>

      <h2>{t("ch14.readingHeading")}</h2>
      <p>{t("ch14.readingIntro")}</p>

      <Figure
        src="/figures/ch14/ch14-asl-perspective.png"
        caption={t("ch14.cap1")}
      />
      <Figure
        src="/figures/ch14/ch14-where-house.png"
        caption={t("ch14.cap2")}
      />
      <Figure
        src="/figures/ch14/ch14-goldilocks.png"
        caption={t("ch14.cap3")}
      />
    </>
  );
}
