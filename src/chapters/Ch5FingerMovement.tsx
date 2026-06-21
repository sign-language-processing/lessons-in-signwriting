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
  return (
    <>
      <h2 id="chapter-5">Chapter 5 — Finger Movement</h2>
      <p>There are two main types:</p>
      <Row>
        <Col>
          <Figure src={IMG.middleJointIntro} />
          <p>
            <strong>Middle Joint — Squeeze &amp; Flick:</strong> Finger movements
            written with small dots.
          </p>
        </Col>
        <Col>
          <Figure src={IMG.knuckleJointIntro} />
          <p>
            <strong>Knuckle Joint — Hinge &amp; Trill:</strong> Finger movements
            written with small arrows.
          </p>
        </Col>
      </Row>

      <FingerExplorer />

      <h2>Sequential Finger Movement</h2>
      <p>Specific finger-by-finger opening and closing.</p>
      <p>
        When a handshape changes during a sign and one configuration matters
        more than the other, write the more important one — usually the
        starting handshape.
      </p>
      <div className="seq-grid">
        <figure className="seq-cell">
          <img src={asset("/figures/finger/seq-name-sign.png")} alt="a name sign" />
          <figcaption>a name sign</figcaption>
          <p>
            Just follow the arrows. The movement starts at the stem of the
            arrow, and moves toward the arrowheads. So in this sign, the baby
            finger bends first, finishing in the A handshapes at the side of the
            head.
          </p>
        </figure>
        <div className="seq-cell">
          <img src={asset("/figures/finger/seq-closes.png")} alt="" />
          <h3>Sequential Finger Movement That Closes</h3>
          <p className="seq-sub">From The Middle Joint</p>
          <p>…very specific finger-by-finger closing of the fingers…</p>
          <p>Exact details of which finger closes first, second and third.</p>
        </div>
        <figure className="seq-cell">
          <img src={asset("/figures/finger/seq-few.png")} alt="FEW" />
          <figcaption>
            <strong>FEW</strong>
            <br />
            in American Sign Language
          </figcaption>
          <p>(one of several ways to write this sign)</p>
        </figure>
        <div className="seq-cell">
          <h3>Sequential Finger Movement That Opens</h3>
          <p className="seq-sub">From The Middle Joint</p>
          <p>…very specific finger-by-finger opening of the fingers…</p>
          <p>Exact details of which finger opens first, second and third.</p>
          <p>
            In the example to the left, the sign for FEW opens the index finger
            first, then the middle finger, ring finger and baby finger.
          </p>
        </div>
      </div>
    </>
  );
}
