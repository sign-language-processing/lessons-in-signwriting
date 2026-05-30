import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SignFigure } from "../components/SignFigure";

const IMG = {
  coverPhoto1:
    "image_000304_277921798e594fee5105e61291bb89964d19a6d0ba37235f5c5053afc3f9c0f8.png",
  coverPhoto2:
    "image_000305_139d567fcee0f977aed460d419f1210f523b617a976501c8f71fd4e55020caff.png",
  upSide:
    "image_000307_c0302ca83b292e4d77ed3dc296cf3a9bdefae6405dfee75f9c9b59289ac38a9d.png",
  upUp:
    "image_000308_31ee56e5919ec2aef82e476ff478bd6b3b9fc7c32d0b1ab985167a384c460421.png",
  upDownUp:
    "image_000309_5b42e1bccc762691ddbe3143b577caa0ac8000a2aeacc666e1250697c9b9b048.png",
  upLoopUp:
    "image_000310_b731fae18b38a2368d5562c77bf0b5b7e161133b7e305ca840f998f16d3e8b52.png",
  upDownRose:
    "image_000311_81dd2c30b8ba6d4ea10418141c31a954a97caebaf81e91fb9691ce457a998b1a.png",
  forwardOverPage:
    "image_000313_b3f67e11add3120570a56edadf6fb233a0d56accf66f9cf0c518c7b97591ba06.png",
  forwardOverDiagonals:
    "image_000314_e2012ddd215651456497adcd5ace79f5d98476223a02c683eed63de224a5fdb2.png",
  backOverDiagonals:
    "image_000315_c7e6ebe1955f209c075f5631956a223a0096db62bce80deee8f3d71e1e972759.png",
  forwardUnderPage:
    "image_000316_50f843d22d29d323472b42f0f2612d258846e99c593e7f30ec3f607e9ce69ee7.png",
  forwardUnderDiagonals:
    "image_000317_ab0ce8d44fe8c648e3b0c3c12c4e2630b07795f6e105b835f9b88015b2617999.png",
  backUnderDiagonals:
    "image_000318_202ff4a8a702e085eb4db384daaa6a3c820fe8fe9e2b352876c9fc7d596e1224.png",
  forwardSidePage:
    "image_000319_97045235d8fae39abcad63ed3763b67f9bc5589d3af7173b1d8f0b00c8aa4e67.png",
  forwardSide:
    "image_000320_df88c740559cf07939897695aa478b6469014d970aa3310a01e7e13bddcbee91.png",
  backSide:
    "image_000321_d730a768f669550d7af529a7f0ad599b2fe68a081288a3dc0f49f98669072745.png",
  sideForwardSidePage:
    "image_000322_084a10dd3c572614e9d49ba40441da8bb7060bb666f2528330dc0d8c6aa80069.png",
  sideForwardSideArrow:
    "image_000323_2bd52496c4a674682009401e57e22c3d6df40960eb341c083b6ddf2513df9eff.png",
  sideForwardSideHead:
    "image_000324_040769187f5bc09f88e5d3561618b5468a0664e9f645366bbc54606f067ef009.png",
  sideBackSideArrow:
    "image_000325_543511c6ef3b2b23d09b1545ae5f747641b0c3df8675e5e447e034797e5281b9.png",
  sideBackSideHead:
    "image_000326_201c5b2cdf0a7141e17f6a5fd6910f14d73aabe805c3593d7a201960d939d35b.png",
};

export function Ch7CurvedMovement() {
  return (
    <>
      <h2 id="chapter-7">Chapter 7 — Curved Movement</h2>

      <Row>
        <Col>
          <Figure src={IMG.coverPhoto1} />
        </Col>
        <Col>
          <Figure src={IMG.coverPhoto2} />
        </Col>
      </Row>

      <h2>Up-Down Curved Movement</h2>
      <p>
        Up-Down movement is parallel with the front wall. It is written with{" "}
        <strong>double-stemmed</strong> arrows:
      </p>
      <Row stretch>
        <Col>
          <Figure src={IMG.upSide} caption="1. Curve Up-Side" />
          <Figure src={IMG.upUp} caption="2. Curve Up-Up" />
        </Col>
        <Col>
          <Figure src={IMG.upDownUp} caption="3. Curve Up-Down-Up" />
          <Figure src={IMG.upLoopUp} caption="4. Curve Up-Loop-Up" />
        </Col>
      </Row>
      <Figure src={IMG.upDownRose} />

      <h2>Up-Down Curved Arrows</h2>
      <p>The curves are parallel with the wall.</p>
      <div className="examples-row">
        <SignFigure slug="ch7-drive" />
        <SignFigure slug="ch7-but" />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch7-shape" />
        <SignFigure slug="ch7-spaghetti" />
      </div>

      <h2>Forward-Over or Back-Over Curved Movement</h2>
      <p>
        Forward-Back movement is parallel with the floor. It is written with{" "}
        <strong>single-stemmed</strong> arrows.
      </p>
      <Figure src={IMG.forwardOverPage} />

      <h3>Forward &amp; Over</h3>
      <Figure src={IMG.forwardOverDiagonals} />
      <h3>Back &amp; Over</h3>
      <Figure src={IMG.backOverDiagonals} />

      <h2>Forward-Under or Back-Under Curved Movement</h2>
      <p>
        Forward-Back movement is parallel with the floor. It is written with{" "}
        <strong>single-stemmed</strong> arrows.
      </p>
      <Figure src={IMG.forwardUnderPage} />

      <h3>Forward &amp; Under</h3>
      <Figure src={IMG.forwardUnderDiagonals} />
      <h3>Back &amp; Under</h3>
      <Figure src={IMG.backUnderDiagonals} />

      <h2>Forward-Side or Back-Side Curved Movement</h2>
      <p>
        The movement is parallel with the floor. It is written with{" "}
        <strong>single-stemmed</strong> arrows.
      </p>
      <Figure src={IMG.forwardSidePage} />

      <Row stretch>
        <Col>
          <h3>Forward &amp; Side</h3>
          <Figure src={IMG.forwardSide} />
        </Col>
        <Col>
          <h3>Back &amp; Side</h3>
          <Figure src={IMG.backSide} />
        </Col>
      </Row>

      <h2>Side-Forward-Side or Side-Back-Side Curved Movement</h2>
      <p>
        Forward-Back movement is parallel with the floor. It is written with{" "}
        <strong>single-stemmed</strong> arrows.
      </p>
      <Figure src={IMG.sideForwardSidePage} />

      <Row stretch>
        <Col>
          <h3>Side-Forward-Side</h3>
          <Figure src={IMG.sideForwardSideArrow} />
          <Figure src={IMG.sideForwardSideHead} />
        </Col>
        <Col>
          <h3>Side-Back-Side</h3>
          <Figure src={IMG.sideBackSideArrow} />
          <Figure src={IMG.sideBackSideHead} />
        </Col>
      </Row>

      <h2>Forward-Back Curved Arrows</h2>
      <p>The curves are parallel with the floor.</p>
      <div className="examples-row">
        <SignFigure slug="ch7-across" />
        <SignFigure slug="ch7-we" />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch7-grandmother" />
        <SignFigure slug="ch7-us" />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch7-allow" />
        <SignFigure slug="ch7-workshop" />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch7-announce" />
        <SignFigure slug="ch7-area" />
      </div>
    </>
  );
}
