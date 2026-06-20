import { Trans, useTranslation } from "react-i18next";
import { Figure } from "../components/Figure";
import { Col, Row } from "../components/Layout";
import { SgnwSymbol } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";
import {
  DiagonalPlane3D,
  DiagonalPlaneDown3D,
  FloorPlaneArrows3D,
  SignSpaceSections,
  WallPlaneArrows3D,
} from "../components/SignSpace3D";

const fig = (name: string) => `/figures/ch6/${name}.png`;

type Move = { name: string; desc: string };

const WALL_SYMBOLS = ["񇀡", "񇅁", "񇆡", "񇉡", "񇌨", "񇎁", "񇑁", "񇕡", "񇚁", "񇠁", "񇤡", "񇩁", "񇭡", "񇰡", "񇲁", "񇳡"];
const FLOOR_SYMBOLS = ["񈙁", "񈝡", "񈟁", "񈢁", "񈥁", "񈦡", "񈩡", "񈬡", "񈯡", "񈲡", "񈵡", "񈺁", "񈾡", "񉁡", "񉃁", "񉄡"];
const CONFUSE_SYMBOLS = ["񆿁", "񇿡", "񈗡", "񆿅", "񈅥", "񈗥"];

function MovementList({ symbols, moves }: { symbols: string[]; moves: Move[] }) {
  return (
    <ul className="movement-list">
      {symbols.map((symbol, i) => (
        <li key={symbol}>
          <SgnwSymbol symbol={symbol} className="movement-list__symbol" />
          <span>
            <strong>{moves[i]?.name}</strong> — {moves[i]?.desc}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Ch6StraightMovement() {
  const { t } = useTranslation();
  const wallMoves = t("ch6.wallMoves", { returnObjects: true }) as Move[];
  const floorMoves = t("ch6.floorMoves", { returnObjects: true }) as Move[];
  const confuse = t("ch6.confuse", { returnObjects: true }) as string[];

  return (
    <>
      <h2 id="chapter-6">
        {t("common.chapterHeading", { number: 6, title: t("toc.chapter-6") })}
      </h2>

      <Row stretch>
        <Col>
          <h2>{t("ch6.wallHeading")}</h2>
          <p>{t("ch6.wallIntro")}</p>
          <Figure src={fig("ch6-wall-kevin-1")} />
          <Figure src={fig("ch6-wall-kevin-2")} />
        </Col>
        <Col>
          <h2>{t("ch6.floorHeading")}</h2>
          <p>{t("ch6.floorIntro")}</p>
          <Figure src={fig("ch6-floor-cindy-1")} />
          <Figure src={fig("ch6-floor-cindy-2")} />
        </Col>
      </Row>

      <SignSpaceSections />

      <h2>{t("ch6.generalHeading")}</h2>
      <p>{t("ch6.gen1")}</p>
      <p>{t("ch6.gen2")}</p>
      <div className="grid-3">
        <SignFigure slug="ch6-follow" />
        <SignFigure slug="ch6-plan" />
      </div>

      <h2>{t("ch6.upDownHeading")}</h2>
      <p>
        <Trans i18nKey="ch6.upDownIntro" />
      </p>
      <div className="print-only">
        <Figure src={fig("ch6-up-down-rose")} />
      </div>
      <div className="screen-only">
        <WallPlaneArrows3D />
      </div>

      <h2>{t("ch6.fwBackHeading")}</h2>
      <p>{t("ch6.fwBackIntro")}</p>
      <div className="print-only">
        <Figure src={fig("ch6-forward-rose")} />
        <Figure src={fig("ch6-back-rose")} />
      </div>
      <div className="screen-only">
        <FloorPlaneArrows3D />
      </div>

      <h2>{t("ch6.sideHeading")}</h2>
      <p>{t("ch6.sideIntro")}</p>
      <Figure src={fig("ch6-side")} />

      <Row stretch>
        <Col>
          <h2>
            {t("ch6.upOrDownHeading")} <SgnwSymbol symbol="񇉡" />
          </h2>
          <p>{t("ch6.upOrDownIntro")}</p>
          <div className="col-figs">
            <SignFigure slug="ch6-monthly" />
            <SignFigure slug="ch6-disappear" />
          </div>
        </Col>
        <Col className="col--divided">
          <h2>
            {t("ch6.fwOrBackHeading")} <SgnwSymbol symbol="񈢁" />
          </h2>
          <p>{t("ch6.fwOrBackIntro")}</p>
          <div className="col-figs">
            <SignFigure slug="ch6-excuse-me" />
            <SignFigure slug="ch6-eager" />
          </div>
        </Col>
      </Row>

      <h2>{t("ch6.upDownStraightHeading")}</h2>
      <p>{t("ch6.upDownStraightIntro")}</p>
      <MovementList symbols={WALL_SYMBOLS} moves={wallMoves} />

      <h3>{t("ch6.examplesHeading")}</h3>
      <div className="grid-2">
        <SignFigure slug="ch6-exam-test" />
        <SignFigure slug="ch6-house" />
        <SignFigure slug="ch6-system" />
        <SignFigure slug="ch6-square" />
      </div>

      <h2>{t("ch6.fwBackStraightHeading")}</h2>
      <p>{t("ch6.fwBackStraightIntro")}</p>
      <MovementList symbols={FLOOR_SYMBOLS} moves={floorMoves} />

      <h2>{t("ch6.fwBackArrowsHeading")}</h2>
      <p>{t("ch6.fwBackArrowsIntro")}</p>
      <div className="grid-3">
        <SignFigure slug="ch6-hello" />
        <SignFigure slug="ch6-nothing" />
        <SignFigure slug="ch6-ask-question" />
      </div>

      <h2>{t("ch6.recapHeading")}</h2>
      <p>{t("ch6.recap1")}</p>
      <p>{t("ch6.recap2")}</p>
      <p>{t("ch6.recap3")}</p>
      <Row stretch>
        <Col>
          <p>{t("ch6.recap4")}</p>
          <Figure src={fig("ch6-rocketship")} />
        </Col>
        <Col>
          <p>{t("ch6.recap5")}</p>
          <Figure src={fig("ch6-car")} />
        </Col>
      </Row>

      <section className="signspace-section">
        <div className="signspace-section__text">
          <h2 style={{ color: "#8b5cf6" }}>{t("ch6.diagonalHeading")}</h2>
          <p>{t("ch6.diag1")}</p>
          <Figure src={fig("ch6-diagonal-plane")} />
          <h2>{t("ch6.fwBackDiagHeading")}</h2>
          <p>{t("ch6.diag2")}</p>
          <Figure src={fig("ch6-forward-back-diagonal")} />
        </div>
        <div className="signspace-section__viewer">
          <DiagonalPlane3D />
          <DiagonalPlaneDown3D />
        </div>
      </section>

      <Row stretch>
        <Col>
          <h2>
            {t("ch6.upFwDiagHeading")} <SgnwSymbol symbol="񇿡" />
          </h2>
          <p>{t("ch6.upFwDiagIntro")}</p>
          <Figure src={fig("ch6-up-forward")} />
        </Col>
        <Col className="col--divided">
          <h2>
            {t("ch6.downBackDiagHeading")} <SgnwSymbol symbol="񈅥" />
          </h2>
          <p>{t("ch6.downBackDiagIntro")}</p>
          <Figure src={fig("ch6-down-back")} />
        </Col>
      </Row>

      <h2>{t("ch6.confuseHeading")}</h2>
      <div className="confuse-grid">
        {CONFUSE_SYMBOLS.map((symbol, i) => (
          <div className="confuse-cell" key={symbol}>
            <SgnwSymbol symbol={symbol} />
            <span>{confuse[i]}</span>
          </div>
        ))}
      </div>
    </>
  );
}
