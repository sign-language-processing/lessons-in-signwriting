import { Trans, useTranslation } from "react-i18next";
import { SgnwSign } from "../components/Sgnw";
import { asset } from "../lib/asset";

const VALERIE_IMG =
  "image_000011_1738bb5aa2102114bff889f8c476e8e655ab9eb25cfa21890a469f23d56110ef.png";
const VALERIE_SIGN = "𝠃𝤘𝥨񂇇𝣵𝤠񀕡𝤀𝤮񉨬𝣴𝥅񍝁𝣴𝣵񌏁𝣴𝣵";
const ADAM_IMG =
  "image_000016_8b33582f66ff71f5f93269139bb77797b3d9829fc91ab2b68f555b073d0016db_adam.png";
const ADAM_SIGN = "𝠀񆄢񆷦񆷢񎣡𝠃𝤛𝤛񎣡𝣱𝣲񆄢𝣬𝤆񆷢𝣢𝤆񆷦𝣩𝣺";
const LUCINDA_IMG =
  "image_000016_8b33582f66ff71f5f93269139bb77797b3d9829fc91ab2b68f555b073d0016db_lucinda.png";
const KEVIN_IMG =
  "image_000016_8b33582f66ff71f5f93269139bb77797b3d9829fc91ab2b68f555b073d0016db_kevin.png";
const LUCINDA_SIGN = "𝠀񂣱񆉁񌏁񍝁𝠃𝤡𝤷񌏁𝣴𝣴񍝁𝣴𝣴񂣱𝤌𝤕񆉁𝤋𝤬";
const KEVIN_SIGN = "𝠃𝤝𝥈񁠨𝣲𝤡񈩣𝤎𝤠񌏁𝣴𝣵񍝁𝣴𝣵";
const ART = asset("/docling-out/sw0116-Lessons-SignWriting_artifacts");

const CC_BY = "https://creativecommons.org/licenses/by/3.0/";

export function Ch1Introduction() {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("ch1.title")}</h1>
      <h2 id="chapter-1">
        {t("common.chapterHeading", { number: 1, title: t("toc.chapter-1") })}
      </h2>

      <p>
        <Trans i18nKey="ch1.editions" />
      </p>
      <p>
        <Trans
          i18nKey="ch1.copyright"
          components={{ license: <a href={CC_BY} /> }}
        />
      </p>
      <p>{t("ch1.invention")}</p>
      <p>{t("ch1.credits1")}</p>
      <p>{t("ch1.credits2")}</p>
      <p>{t("ch1.credits3")}</p>

      <h3>{t("ch1.contributorsHeading")}</h3>
      <p>{t("ch1.contributorsIntro")}</p>
      <div className="contributors-grid">
        <figure className="contributor-portrait">
          <img src={`${ART}/${VALERIE_IMG}`} alt="Valerie Sutton" />
          <SgnwSign sign={VALERIE_SIGN} video="/videos/names/valerie.mp4" />
          <figcaption>Valerie Sutton</figcaption>
        </figure>
        <figure className="contributor-portrait">
          <img src={`${ART}/${ADAM_IMG}`} alt="Adam Frost" />
          <SgnwSign sign={ADAM_SIGN} video="/videos/names/adam.mp4" />
          <figcaption>Adam Frost</figcaption>
        </figure>
        <figure className="contributor-portrait">
          <img src={`${ART}/${LUCINDA_IMG}`} alt="Lucinda O'Grady Batch" />
          <SgnwSign sign={LUCINDA_SIGN} />
          <figcaption>Lucinda O'Grady Batch</figcaption>
        </figure>
        <figure className="contributor-portrait">
          <img src={`${ART}/${KEVIN_IMG}`} alt="Kevin Clark" />
          <SgnwSign sign={KEVIN_SIGN} />
          <figcaption>Kevin Clark</figcaption>
        </figure>
      </div>

      <h3>{t("ch1.deafPerspectiveHeading")}</h3>
      {t("ch1.testimonialOriginal") && (
        <p className="original-note">{t("ch1.testimonialOriginal")}</p>
      )}
      <div className="contributor">
        <p>{t("ch1.testimonial")}</p>
        <p>{t("ch1.testimonialAttribution")}</p>
      </div>
    </>
  );
}
