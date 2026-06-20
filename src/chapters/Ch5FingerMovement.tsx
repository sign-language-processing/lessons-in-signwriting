import { Trans, useTranslation } from "react-i18next";
import { Figure } from "../components/Figure";
import { FingerExplorer } from "../components/FingerExplorer";
import { Col, Row } from "../components/Layout";
import { asset } from "../lib/asset";

const IMG = {
  middleJointIntro:
    "image_000220_f89f059dd8fbda11b21db38a59b3b85227b2f95101ec7c44dcfc386db3ec144e.png",
  knuckleJointIntro:
    "image_000221_3066073d4f241d224547259b54c0187b416b222f7029c740cedc88661b492733.png",
};

export function Ch5FingerMovement() {
  const { t } = useTranslation();
  return (
    <>
      <h2 id="chapter-5">
        {t("common.chapterHeading", { number: 5, title: t("toc.chapter-5") })}
      </h2>
      <p>{t("ch5.intro")}</p>
      <Row>
        <Col>
          <Figure src={IMG.middleJointIntro} />
          <p>
            <Trans i18nKey="ch5.middleJointDesc" />
          </p>
        </Col>
        <Col>
          <Figure src={IMG.knuckleJointIntro} />
          <p>
            <Trans i18nKey="ch5.knuckleJointDesc" />
          </p>
        </Col>
      </Row>

      <FingerExplorer />

      <h2>{t("ch5.seqHeading")}</h2>
      <p>{t("ch5.seqIntro")}</p>
      <div className="seq-grid">
        <figure className="seq-cell">
          <img
            src={asset("/figures/finger/seq-name-sign.png")}
            alt={t("ch5.nameSignCaption")}
          />
          <figcaption>{t("ch5.nameSignCaption")}</figcaption>
          <p>{t("ch5.nameSignBody")}</p>
        </figure>
        <div className="seq-cell">
          <img src={asset("/figures/finger/seq-closes.png")} alt="" />
          <h3>{t("ch5.closesHeading")}</h3>
          <p className="seq-sub">{t("ch5.fromMiddleJoint")}</p>
          <p>{t("ch5.closes1")}</p>
          <p>{t("ch5.closes2")}</p>
        </div>
        <figure className="seq-cell">
          <img src={asset("/figures/finger/seq-few.png")} alt="FEW" />
          <figcaption>
            <Trans i18nKey="ch5.fewCaption" />
          </figcaption>
          <p>{t("ch5.fewBody")}</p>
        </figure>
        <div className="seq-cell">
          <h3>{t("ch5.opensHeading")}</h3>
          <p className="seq-sub">{t("ch5.fromMiddleJoint")}</p>
          <p>{t("ch5.opens1")}</p>
          <p>{t("ch5.opens2")}</p>
          <p>{t("ch5.opens3")}</p>
        </div>
      </div>
    </>
  );
}
