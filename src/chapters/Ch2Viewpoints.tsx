import { Trans, useTranslation } from "react-i18next";
import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SgnwSign, SgnwSymbol } from "../components/Sgnw";
import { YouTubeVideo } from "../components/YouTubeVideo";
import { TRANSCRIPT_1, VIDEO_CREDITS } from "../content/videos";
import { asset } from "../lib/asset";

const KNOW_LEFT_SIGN = "𝠃𝤘𝤘񋾡𝣴𝣵񂇚𝣝𝣹񆇡𝣲𝣭";
const KNOW_RIGHT_SIGN = "𝠃𝤯𝤘񋾡𝣴𝣵񂇒𝤘𝣹񆇡𝤐𝣭";
const FEEL_LEFT_SIGN = "𝠃𝤘𝤘񆉁𝣞𝣷񃃙𝣤𝤆񎁡𝣴𝣵";
const FEEL_RIGHT_SIGN = "𝠃𝤮𝤘񆉁𝤘𝣷񃃑𝤑𝤆񎁑𝣴𝣵";

const IMG = {
  expressive:
    "image_000055_e6943d6a07baa376b278a7709c12a5fb4b7e20e1dd21a6b026655d019c3600c4.png",
  receptive:
    "image_000054_6acd93443c23083ad25d9808eeff555ee1c9127f638788eb9e6b4fc54ab6c1df.png",
  perspective1:
    "image_000061_09c0070c414db0fb0342cf85d9320b847264b4950425165c7dd3c383c236607d.png",
  perspective2:
    "image_000062_1f737881e77f2ab01df3de09be9cd5fdca012d703ee2c60a6cc00480e3cfc283.png",
  sideHand:
    "image_000063_91b54d4c1e30d2cf6040ea94b46ae76af18b4bfa4b3c007992efc9c6e1bde355.png",
  backHand:
    "image_000064_a4dc22a51134d73c58e6c44aac8e4cb5d156498ac0a1a9471bd67214eac06b07.png",
  headDrawingLeft:
    "image_000065_0ecec8d0acb8bb38f529cc800fdfd1070cbdf2901826b8fbc29b8e5950666052_head.png",
  headDrawingRight:
    "image_000065_0ecec8d0acb8bb38f529cc800fdfd1070cbdf2901826b8fbc29b8e5950666052_head_mirror.png",
  knowLeftFaceFace:
    "image_000067_63c9b023e4ecefdd047168eefcfb9882a5c0d27bc2216aeed7bdf7a9bd1552bb_face.png",
  knowLeftFaceHead:
    "image_000067_63c9b023e4ecefdd047168eefcfb9882a5c0d27bc2216aeed7bdf7a9bd1552bb_head.png",
  facePersonLeft:
    "image_000069_4d813a07ecb7130e71472f18655d8fe07ae960226ea0ad790f474044559e2c2c_kevin.png",
  facePersonRight:
    "image_000069_4d813a07ecb7130e71472f18655d8fe07ae960226ea0ad790f474044559e2c2c_lucinda.png",
};

const OVERLAY_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "3%",
  right: "1%",
};
const OVERLAY_SIZE = 150;

const ART = asset("/docling-out/sw0116-Lessons-SignWriting_artifacts");

/** Head drawing with the asymmetric face overlaid in the empty top corner. */
function FaceOverHead({ mirror }: { mirror: boolean }) {
  return (
    <figure
      style={{
        width: "80%",
        marginInlineStart: mirror ? 0 : "auto",
        marginInlineEnd: mirror ? "auto" : 0,
      }}
    >
      <span
        style={{
          position: "relative",
          display: "inline-block",
          inlineSize: "100%",
          transform: mirror ? "scaleX(-1)" : undefined,
        }}
      >
        <img
          src={`${ART}/${IMG.knowLeftFaceHead}`}
          alt=""
          style={{
            display: "block",
            width: "94%",
            marginInlineStart: "auto",
            marginBlockStart: "5%",
          }}
        />
        <img
          src={`${ART}/${IMG.knowLeftFaceFace}`}
          alt=""
          style={{
            position: "absolute",
            insetBlockStart: "0%",
            insetInlineStart: "0%",
            width: "27%",
            pointerEvents: "none",
          }}
        />
      </span>
    </figure>
  );
}

export function Ch2Viewpoints() {
  const { t } = useTranslation();
  return (
    <>
      <h2 id="chapter-2">
        {t("common.chapterHeading", { number: 2, title: t("toc.chapter-2") })}
      </h2>
      <YouTubeVideo
        videoId="0WdqJF_5iBk"
        title={t("ch2.videoTitle")}
        credits={VIDEO_CREDITS}
        transcript={TRANSCRIPT_1}
      />
      <p>
        <Trans
          i18nKey="ch2.intro"
          components={{ ch15: <a href="#chapter-15" /> }}
        />
      </p>

      <Row stretch>
        <Col>
          <h2>{t("ch2.expressiveHeading")}</h2>
          <p>{t("ch2.expressiveIntro")}</p>
          <Figure src={IMG.expressive} style={{ marginTop: "auto" }} />
        </Col>
        <Col>
          <h2>{t("ch2.receptiveHeading")}</h2>
          <p>{t("ch2.receptiveIntro")}</p>
          <Figure src={IMG.receptive} style={{ marginTop: "auto" }} />
        </Col>
      </Row>

      <h2>{t("ch2.expressiveMainHeading")}</h2>
      <p>{t("ch2.expressiveMainIntro")}</p>

      <h2>{t("ch2.palmHeading")}</h2>
      <p>{t("ch2.palmIntro")}</p>

      <Row>
        <Figure
          src={IMG.perspective1}
          overlay={
            <SgnwSymbol symbol="񂇁" size={OVERLAY_SIZE} style={OVERLAY_STYLE} />
          }
        />
        <Figure src={IMG.perspective2} />
      </Row>

      <Row stretch>
        <Col>
          <h2>{t("ch2.sideHeading")}</h2>
          <p>{t("ch2.side1")}</p>
          <p>{t("ch2.side2")}</p>
          <Figure
            src={IMG.sideHand}
            style={{ marginTop: "auto" }}
            overlay={
              <SgnwSymbol symbol="񂇑" size={OVERLAY_SIZE} style={OVERLAY_STYLE} />
            }
          />
        </Col>
        <Col>
          <h2>{t("ch2.backHeading")}</h2>
          <p>{t("ch2.back1")}</p>
          <p>{t("ch2.back2")}</p>
          <Figure
            src={IMG.backHand}
            style={{ marginTop: "auto" }}
            overlay={
              <SgnwSymbol symbol="񂇡" size={OVERLAY_SIZE} style={OVERLAY_STYLE} />
            }
          />
        </Col>
      </Row>

      <h2>{t("ch2.sidesHeadHeading")}</h2>
      <p>{t("ch2.sidesHeadIntro")}</p>
      <Row>
        <Col>
          <h3>{t("ch2.leftSideHead")}</h3>
          <SgnwSign
            sign={KNOW_LEFT_SIGN}
            video="/videos/know/know.mp4"
            videoMirror
          />
          <Figure src={IMG.headDrawingLeft} />
        </Col>
        <Col>
          <h3>{t("ch2.rightSideHead")}</h3>
          <SgnwSign sign={KNOW_RIGHT_SIGN} video="/videos/know/know.mp4" />
          <Figure src={IMG.headDrawingRight} />
        </Col>
      </Row>

      <h2>{t("ch2.sidesFaceHeading")}</h2>
      <p>
        <Trans i18nKey="ch2.sidesFaceIntro" />
      </p>
      <Row>
        <Col>
          <h3>{t("ch2.leftSideFace")}</h3>
          <SgnwSign sign={FEEL_LEFT_SIGN} />
          <FaceOverHead mirror={false} />
          <Figure
            src={IMG.facePersonLeft}
            imgStyle={{ transform: "scaleX(-1)" }}
          />
        </Col>
        <Col>
          <h3>{t("ch2.rightSideFace")}</h3>
          <SgnwSign sign={FEEL_RIGHT_SIGN} />
          <FaceOverHead mirror={true} />
          <Figure src={IMG.facePersonRight} />
        </Col>
      </Row>
    </>
  );
}
