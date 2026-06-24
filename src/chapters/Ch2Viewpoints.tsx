import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { OrientationFillGame } from "../components/OrientationFillGame";
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
  // The head drawing has whitespace at its top-left (where the wraparound
  // hand leaves room). The wrapping figure is sized to 80% and pushed to
  // one side via margin: auto. For the right-side variant we flip the whole
  // stack horizontally, which moves the face from top-left to top-right and
  // also flips the head so the hand reaches around the other side.
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
  return (
    <>
      <h2 id="chapter-2">Chapter 2 — Viewpoints</h2>
      <YouTubeVideo
        videoId="0WdqJF_5iBk"
        title="Video 1 — Introduction to SignWriting"
        credits={VIDEO_CREDITS}
        transcript={TRANSCRIPT_1}
      />

      <h2>The Parts of a Sign</h2>
      <p>
        Every sign is built from a few parts working at once: the{" "}
        <strong>handshape</strong>, the <strong>orientation</strong> of the
        palm, the <strong>location</strong> where the sign is made, the{" "}
        <strong>movement</strong>, and the <strong>facial expressions</strong>{" "}
        and other non-manual signals of the face, head, and body.
      </p>
      <p>
        SignWriting can record all of them — not just the hands, but the
        non-manual signals too, down to breathing when it matters. That is what
        sets it apart from systems that only describe the hands. The chapters
        ahead take these one at a time: the <a href="#chapter-3">hands</a>,{" "}
        <a href="#chapter-4">contact</a>, <a href="#chapter-6">movement</a>, and
        the <a href="#chapter-10">face</a>, <a href="#chapter-11">head</a>, and{" "}
        <a href="#chapter-12">body</a>. We begin with the viewpoint.
      </p>

      <h2>Viewpoint</h2>
      <p>
        Because SignWriting mirrors the body, the first choice in writing any
        sign is the <strong>viewpoint</strong> — whose perspective you take.
        There are two: the Expressive and the Receptive. This book teaches
        reading and writing from the Expressive Viewpoint, the standard in
        SignWriting publications today. The Receptive Viewpoint is used only
        occasionally — when transcribing signs from video, or recording foreign
        signs in shorthand; for more on it, see{" "}
        <a href="#chapter-15">Chapter 15</a>.
      </p>

      <Row stretch>
        <Col>
          <h3>Expressive Viewpoint</h3>
          <p>
            When you are signing to someone else, you see signs from your own
            point of view. This is called the Expressive Viewpoint.
          </p>
          <p>
            SignWriting adopted this viewpoint in 1984, when Deaf writers asked
            to record signs the way they see them as they sign. It has been the
            standard ever since.
          </p>
          <Figure src={IMG.expressive} style={{ marginTop: "auto" }} />
        </Col>
        <Col>
          <h3>Receptive Viewpoint</h3>
          <p>
            When someone is facing you, signing to you, you view the signs as an
            observer. The signer's right side is your left side. This is called
            the Receptive Viewpoint.
          </p>
          <p>
            This was SignWriting's original standard, used from 1974 until 1984.
          </p>
          <Figure src={IMG.receptive} style={{ marginTop: "auto" }} />
        </Col>
      </Row>

      <h2>The Expressive Viewpoint</h2>
      <p>
        Read and write signs as if you are looking at your own hands, from your
        own perspective.
      </p>

      <h3>Neutral Space</h3>
      <p>
        By default, a sign is written in <strong>neutral space</strong> — the
        area just in front of your chest. The head, torso, arms, and neck are
        drawn only when a sign actually needs them. That is why most signs are
        written as hands alone, and a head appears only when the sign is made on
        or near the face, as in the examples further down this chapter.
      </p>

      <h3>Dominant Hand</h3>
      <p>
        Most signs have a <strong>dominant hand</strong> — the one doing more of
        the work (the right hand for right-handed signers, the left for
        left-handed signers). Like most SignWriting books, this book writes every
        sign from the right-handed perspective. Left-handed signers can simply
        mirror it, and in practice readers read signs in their own handedness —
        just as you understand both right- and left-handed signers in
        conversation.
      </p>

      <h3>Palm of Hand</h3>
      <p>
        When you see the palm of your hand, while you are signing, the symbol
        for the hand will be white, or hollow. The palm of the hand is always
        written with a white, hollow symbol.
      </p>

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
          <h3>Side of Hand</h3>
          <p>
            When you see the side of your hand while you are signing, the symbol
            for the hand will be half black and half white.
          </p>
          <p>
            The white part of the symbol shows where the palm of the hand faces.
            The dark part represents the back of the hand.
          </p>
          <Figure
            src={IMG.sideHand}
            style={{ marginTop: "auto" }}
            overlay={
              <SgnwSymbol symbol="񂇑" size={OVERLAY_SIZE} style={OVERLAY_STYLE} />
            }
          />
        </Col>
        <Col>
          <h3>Back of Hand</h3>
          <p>
            When you see the back of your hand while you are signing, the symbol
            will be black, or filled-in.
          </p>
          <p>
            The back of the hand is always written with a black, filled-in
            symbol.
          </p>
          <Figure
            src={IMG.backHand}
            style={{ marginTop: "auto" }}
            overlay={
              <SgnwSymbol symbol="񂇡" size={OVERLAY_SIZE} style={OVERLAY_STYLE} />
            }
          />
        </Col>
      </Row>

      <OrientationFillGame />

      <h2>Sides of the Head</h2>
      <p>
        The head is written with a circle, viewed from the back. The symbol for
        the hand is placed on the side of the head it is near. In ASL, this sign
        means "know". An asterisk means touch.
      </p>
      <Row>
        <Col>
          <h3>Left Side of Head</h3>
          <SgnwSign
            sign={KNOW_LEFT_SIGN}
            video="/videos/know/know.mp4"
            videoMirror
          />
          <Figure src={IMG.headDrawingLeft} />
        </Col>
        <Col>
          <h3>Right Side of Head</h3>
          <SgnwSign sign={KNOW_RIGHT_SIGN} video="/videos/know/know.mp4" />
          <Figure src={IMG.headDrawingRight} />
        </Col>
      </Row>

      <h2>Sides of the Face</h2>
      <p>
        Pretend you can see through the back of the head. You are reading and
        writing how your face <strong>feels</strong> when you sign. In ASL,
        this sign also means "know". Two asterisks mean touching two times.
      </p>
      <Row>
        <Col>
          <h3>Left Side of Face</h3>
          <SgnwSign sign={FEEL_LEFT_SIGN} />
          <FaceOverHead mirror={false} />
          <Figure
            src={IMG.facePersonLeft}
            imgStyle={{ transform: "scaleX(-1)" }}
          />
        </Col>
        <Col>
          <h3>Right Side of Face</h3>
          <SgnwSign sign={FEEL_RIGHT_SIGN} />
          <FaceOverHead mirror={true} />
          <Figure src={IMG.facePersonRight} />
        </Col>
      </Row>
    </>
  );
}
