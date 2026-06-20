import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Col, Row } from "../components/Layout";
import { SgnwSymbol } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";

type RosePoint = { symbol: string; label: ReactNode };

function SymbolRose({
  top,
  left,
  bottom,
  right,
}: {
  top: RosePoint;
  left: RosePoint;
  bottom: RosePoint;
  right: RosePoint;
}) {
  return (
    <div className="symbol-rose">
      <div className="symbol-rose__top">
        <span className="symbol-rose__label">{top.label}</span>
        <SgnwSymbol symbol={top.symbol} size={72} />
      </div>
      <div className="symbol-rose__left">
        <span className="symbol-rose__label">{left.label}</span>
        <SgnwSymbol symbol={left.symbol} size={72} />
      </div>
      <div className="symbol-rose__right">
        <SgnwSymbol symbol={right.symbol} size={72} />
        <span className="symbol-rose__label">{right.label}</span>
      </div>
      <div className="symbol-rose__bottom">
        <SgnwSymbol symbol={bottom.symbol} size={72} />
        <span className="symbol-rose__label">{bottom.label}</span>
      </div>
    </div>
  );
}

const GRID = ["񊤡", "񊤦", "񊻁", "񊻆"];
const ROT_GROUPS: Record<string, string[]> = {
  sideOver: ["񉳁", "񉴡", "񉶁", "񉳃", "񉴣", "񉶃"],
  sideUnder: ["񉳅", "񉴥", "񉶅", "񉳇", "񉴧", "񉶇"],
  fwOver: ["񊤡", "񊦁", "񊧡", "񊤦", "񊦆", "񊧦"],
  fwUnder: ["񊻁", "񊼡", "񊾁", "񊻆", "񊼦", "񊾆"],
  fwSide: ["񋎡", "񋐁", "񋑡", "񋎥", "񋐅", "񋑥"],
  sideFw: ["񋎧", "񋐇", "񋑧", "񋎫", "񋐋", "񋑫"],
  travelWall: ["񉆁", "񉇡", "񉉁"],
  travelFloor: ["񉁡", "񉃁", "񉄡"],
};

export function Ch8AxialMovement() {
  const { t } = useTranslation();
  const types = t("ch8.types", { returnObjects: true }) as string[];
  const gridCaps = t("ch8.gridCaptions", { returnObjects: true }) as string[];

  const RotList = ({ group }: { group: keyof typeof ROT_GROUPS }) => {
    const names = t(`ch8.${group}Items`, { returnObjects: true }) as string[];
    return (
      <ol className="curve-list">
        {ROT_GROUPS[group]?.map((symbol, i) => (
          <li key={symbol}>
            <SgnwSymbol symbol={symbol} className="curve-list__symbol" />
            <span>{names[i]}</span>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <>
      <h2 id="chapter-8">
        {t("common.chapterHeading", { number: 8, title: t("toc.chapter-8") })}
      </h2>
      <p>{t("ch8.intro")}</p>
      <ol>
        <li>{types[0]}</li>
        <li>{types[1]}</li>
      </ol>

      <h2>{t("ch8.rotationHeading")}</h2>
      <p>{t("ch8.rot1")}</p>
      <p>{t("ch8.rot2")}</p>
      <h3>{t("ch8.foreUpHeading")}</h3>
      <p>
        <Trans i18nKey="ch8.foreUpIntro" />
      </p>
      <SymbolRose
        top={{ symbol: "񋎡", label: <Trans i18nKey="ch8.rose1.top" /> }}
        bottom={{ symbol: "񋎥", label: <Trans i18nKey="ch8.rose1.bottom" /> }}
        right={{ symbol: "񋎧", label: <Trans i18nKey="ch8.rose1.right" /> }}
        left={{ symbol: "񋎣", label: <Trans i18nKey="ch8.rose1.left" /> }}
      />
      <p>
        <Trans i18nKey="ch8.rose1Note" />
      </p>

      <h3>{t("ch8.foreForwardHeading")}</h3>
      <p>{t("ch8.foreForwardIntro")}</p>
      <SymbolRose
        top={{ symbol: "񉳉", label: <Trans i18nKey="ch8.rose2.top" /> }}
        bottom={{ symbol: "񉳍", label: <Trans i18nKey="ch8.rose2.bottom" /> }}
        right={{ symbol: "񉳋", label: <Trans i18nKey="ch8.rose2.right" /> }}
        left={{ symbol: "񉳏", label: <Trans i18nKey="ch8.rose2.left" /> }}
      />

      <Row stretch>
        <Col>
          <h3>{t("ch8.exUpHeading")}</h3>
          <div className="examples-row">
            <SignFigure slug="ch8-class" />
            <SignFigure slug="ch8-open" />
            <SignFigure slug="ch8-blue" />
          </div>
        </Col>
        <Col>
          <h3>{t("ch8.exForwardHeading")}</h3>
          <div className="examples-row">
            <SignFigure slug="ch8-happen" />
            <SignFigure slug="ch8-finish" />
            <SignFigure slug="ch8-dead" />
          </div>
        </Col>
      </Row>

      <h3>{t("ch8.foreSideHeading")}</h3>
      <p>{t("ch8.foreSideIntro")}</p>
      <div className="symbol-grid">
        {GRID.map((symbol, i) => (
          <figure className="symbol-grid__cell" key={symbol}>
            <SgnwSymbol symbol={symbol} size={84} />
            <figcaption>{gridCaps[i]}</figcaption>
          </figure>
        ))}
      </div>

      <h3>{t("ch8.exSideHeading")}</h3>
      <div className="examples-row">
        <SignFigure slug="ch8-third" />
        <SignFigure slug="ch8-apple" />
        <SignFigure slug="ch8-begin" />
      </div>

      <Row stretch>
        <Col>
          <h3>{t("ch8.sideOverHeading")}</h3>
          <RotList group="sideOver" />
        </Col>
        <Col>
          <h3>{t("ch8.sideUnderHeading")}</h3>
          <RotList group="sideUnder" />
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-scoop" />
        <SignFigure slug="ch8-clown" />
        <SignFigure slug="ch8-knife" />
        <SignFigure slug="ch8-egg" />
        <SignFigure slug="ch8-music" />
        <SignFigure slug="ch8-party" />
      </div>

      <Row stretch>
        <Col>
          <h3>{t("ch8.fwOverHeading")}</h3>
          <RotList group="fwOver" />
        </Col>
        <Col>
          <h3>{t("ch8.fwUnderHeading")}</h3>
          <RotList group="fwUnder" />
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-first" />
        <SignFigure slug="ch8-cow" />
        <SignFigure slug="ch8-key" />
        <SignFigure slug="ch8-sell" />
        <SignFigure slug="ch8-store" />
        <SignFigure slug="ch8-walk" />
      </div>

      <Row stretch>
        <Col>
          <h3>{t("ch8.fwSideHeading")}</h3>
          <RotList group="fwSide" />
        </Col>
        <Col>
          <h3>{t("ch8.sideFwHeading")}</h3>
          <RotList group="sideFw" />
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-blue" />
        <SignFigure slug="ch8-flower" />
        <SignFigure slug="ch8-fruit" />
        <SignFigure slug="ch8-door" />
        <SignFigure slug="ch8-cheese" />
        <SignFigure slug="ch8-green" />
      </div>

      <h2>{t("ch8.travelHeading")}</h2>
      <p>{t("ch8.travelIntro")}</p>
      <Row stretch>
        <Col>
          <RotList group="travelWall" />
        </Col>
        <Col>
          <RotList group="travelFloor" />
        </Col>
      </Row>

      <h2>{t("ch8.shakeHeading")}</h2>
      <p>{t("ch8.shakeIntro")}</p>
      <p>
        <Trans i18nKey="ch8.shakeWallLabel" />
      </p>
      <div className="examples-row">
        <SgnwSymbol symbol="񋓱" size={72} />
        <SgnwSymbol symbol="񋓁" size={72} />
        <SgnwSymbol symbol="񋓑" size={72} />
        <SgnwSymbol symbol="񋓡" size={72} />
      </div>
      <p>
        <Trans i18nKey="ch8.shakeFloorLabel" />
      </p>
      <div className="examples-row">
        <SgnwSymbol symbol="񉸑" size={72} />
        <SgnwSymbol symbol="񉷡" size={72} />
        <SgnwSymbol symbol="񉷱" size={72} />
        <SgnwSymbol symbol="񉸁" size={72} />
      </div>

      <h2>{t("ch8.wristHeading")}</h2>
      <p>{t("ch8.wristIntro")}</p>
      <Row>
        <Col>
          <SignFigure slug="ch8-yes-yes" />
        </Col>
        <Col>
          <p>
            <Trans i18nKey="ch8.yesyes" />
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <SignFigure slug="ch8-flag" />
        </Col>
        <Col>
          <p>
            <Trans i18nKey="ch8.flag" />
          </p>
        </Col>
      </Row>
      <div className="examples-row">
        <SignFigure slug="ch8-chat" />
        <SignFigure slug="ch8-basketball" />
      </div>
    </>
  );
}
