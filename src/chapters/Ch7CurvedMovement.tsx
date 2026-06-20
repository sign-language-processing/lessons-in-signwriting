import { Trans, useTranslation } from "react-i18next";
import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SgnwSymbol } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";
import { ForwardBackOverCurves3D, WallPlaneCurves3D } from "../components/SignSpace3D";

function SymbolFigure({ symbol, caption }: { symbol: string; caption: string }) {
  return (
    <figure>
      <figcaption>
        <div className="caption">{caption}</div>
      </figcaption>
      <span className="img-wrap">
        <SgnwSymbol symbol={symbol} size={96} />
      </span>
    </figure>
  );
}

const WALL_CURVES = ["񉌋", "񉛋", "񉥧", "񉟫"];
const GROUPS: Record<string, string[]> = {
  forwardOver: ["񊒡", "񊕡", "񊛡", "񊡡"],
  backOver: ["񊒦", "񊕦", "񊛦", "񊡦"],
  forwardUnder: ["񊩁", "񊬁", "񊲁", "񊸁"],
  backUnder: ["񊩆", "񊬆", "񊲆", "񊸆"],
  forwardSide: ["񊿡", "񋇁", "񋈡", "񋋡"],
  backSide: ["񊿥", "񋇅", "񋈥", "񋋥"],
  sideForwardSide: ["񊿧", "񋇇", "񋈧", "񋋧"],
  sideBackSide: ["񊿫", "񋇋", "񋈫", "񋋫"],
};

const IMG = {
  coverPhoto1:
    "image_000304_277921798e594fee5105e61291bb89964d19a6d0ba37235f5c5053afc3f9c0f8.png",
  coverPhoto2:
    "image_000305_139d567fcee0f977aed460d419f1210f523b617a976501c8f71fd4e55020caff.png",
};

export function Ch7CurvedMovement() {
  const { t } = useTranslation();
  const wallCaptions = t("ch7.wallCurves", { returnObjects: true }) as string[];

  const CurveList = ({ group }: { group: keyof typeof GROUPS }) => {
    const names = t(`ch7.${group}Items`, { returnObjects: true }) as string[];
    return (
      <ol className="curve-list">
        {GROUPS[group]?.map((symbol, i) => (
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
      <h2 id="chapter-7">
        {t("common.chapterHeading", { number: 7, title: t("toc.chapter-7") })}
      </h2>

      <Row>
        <Col>
          <Figure src={IMG.coverPhoto1} />
        </Col>
        <Col>
          <Figure src={IMG.coverPhoto2} />
        </Col>
      </Row>

      <h2>{t("ch7.wallHeading")}</h2>
      <p>
        <Trans i18nKey="ch7.wallIntro" />
      </p>
      <Row stretch>
        <Col>
          <SymbolFigure symbol={WALL_CURVES[0]!} caption={wallCaptions[0]!} />
          <SymbolFigure symbol={WALL_CURVES[1]!} caption={wallCaptions[1]!} />
        </Col>
        <Col>
          <SymbolFigure symbol={WALL_CURVES[2]!} caption={wallCaptions[2]!} />
          <SymbolFigure symbol={WALL_CURVES[3]!} caption={wallCaptions[3]!} />
        </Col>
      </Row>
      <WallPlaneCurves3D />

      <h2>{t("ch7.upDownArrowsHeading")}</h2>
      <p>{t("ch7.upDownArrowsIntro")}</p>
      <div className="examples-row">
        <SignFigure slug="ch7-shape" />
        <SignFigure slug="ch7-spaghetti" />
      </div>

      <h2>{t("ch7.floorHeading")}</h2>
      <p>
        <Trans i18nKey="ch7.floorIntro" />
      </p>

      <h3>{t("ch7.fwOverHeading")}</h3>
      <Row stretch>
        <Col>
          <h4>{t("ch7.forwardOver")}</h4>
          <CurveList group="forwardOver" />
        </Col>
        <Col className="col--divided">
          <h4>{t("ch7.backOver")}</h4>
          <CurveList group="backOver" />
        </Col>
      </Row>

      <h3>{t("ch7.fwUnderHeading")}</h3>
      <Row stretch>
        <Col>
          <h4>{t("ch7.forwardUnder")}</h4>
          <CurveList group="forwardUnder" />
        </Col>
        <Col className="col--divided">
          <h4>{t("ch7.backUnder")}</h4>
          <CurveList group="backUnder" />
        </Col>
      </Row>

      <ForwardBackOverCurves3D />

      <h3>{t("ch7.fwSideHeading")}</h3>
      <Row stretch>
        <Col>
          <h4>{t("ch7.forwardSide")}</h4>
          <CurveList group="forwardSide" />
        </Col>
        <Col className="col--divided">
          <h4>{t("ch7.backSide")}</h4>
          <CurveList group="backSide" />
        </Col>
      </Row>

      <h3>{t("ch7.sideHeading")}</h3>
      <Row stretch>
        <Col>
          <h4>{t("ch7.sideForwardSide")}</h4>
          <CurveList group="sideForwardSide" />
        </Col>
        <Col className="col--divided">
          <h4>{t("ch7.sideBackSide")}</h4>
          <CurveList group="sideBackSide" />
        </Col>
      </Row>

      <h2>{t("ch7.exampleHeading")}</h2>
      <div className="examples-row">
        <SignFigure slug="ch7-across" />
        <SignFigure slug="ch7-grandmother" />
        <SignFigure slug="ch7-allow" />
        <SignFigure slug="ch7-workshop" />
      </div>
    </>
  );
}
