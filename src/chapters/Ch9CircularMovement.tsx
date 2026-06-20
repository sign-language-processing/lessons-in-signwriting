import { useTranslation } from "react-i18next";
import { SgnwSymbol } from "../components/Sgnw";
import { SignFigure } from "../components/SignFigure";

type Item = { symbol: string; label: string };

function SymbolList({
  heading,
  sub,
  items,
}: {
  heading: string;
  sub: string;
  items: Item[];
}) {
  return (
    <div className="ch9-col">
      <h3 className="ch9-col__head">{heading}</h3>
      <p className="ch9-col__sub">{sub}</p>
      <ol className="ch9-list">
        {items.map((item) => (
          <li className="ch9-item" key={item.label}>
            <SgnwSymbol symbol={item.symbol} className="ch9-item__symbol" />
            <span className="ch9-item__label">{item.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const armSingle = ["񋔩", "񋔪", "񋔫", "񋔬", "񋔭", "񋔮", "񋔯", "񋔰"];
const armDouble = ["񋗩", "񋗪", "񋗫", "񋗬", "񋗭", "񋗮", "񋗯", "񋗰"];
const circleSingle = ["񋛑", "񋛒", "񋛓", "񋛔", "񋛕", "񋛖", "񋛗", "񋛘"];
const circleDouble = ["񋟱", "񋟲", "񋟳", "񋟴", "񋟵", "񋟶", "񋟷", "񋟸"];
const wristSideSingle = ["񋣩", "񋣪", "񋣫", "񋣬", "񋣭", "񋣮", "񋣯", "񋣰"];
const wristSideDouble = ["񋥉", "񋥊", "񋥋", "񋥌", "񋥍", "񋥎", "񋥏", "񋥐"];
const wristFbSingle = ["񋦡", "񋦢", "񋦣", "񋦤", "񋦥", "񋦦"];
const wristFbDouble = ["񋨁", "񋨂", "񋨃", "񋨄", "񋨅", "񋨆"];

export function Ch9CircularMovement() {
  const { t } = useTranslation();
  const startLabels = t("ch9.startLabels", { returnObjects: true }) as string[];
  const fbLabels = t("ch9.fbLabels", { returnObjects: true }) as string[];
  const wristFbLabels = t("ch9.wristFbLabels", {
    returnObjects: true,
  }) as string[];

  const items = (symbols: string[], labels: string[], lead: string): Item[] =>
    symbols.map((symbol, i) => ({
      symbol,
      label: `${i + 1}. ${lead} ${labels[i]}`,
    }));

  return (
    <>
      <h2 id="chapter-9">
        {t("common.chapterHeading", { number: 9, title: t("toc.chapter-9") })}
      </h2>

      <h2>{t("ch9.armHeading")}</h2>
      <p>{t("ch9.armIntro")}</p>
      <div className="ch9-cols">
        <SymbolList
          heading={t("ch9.singleArm")}
          sub={t("ch9.subWall")}
          items={items(armSingle, startLabels, t("ch9.oneCircle"))}
        />
        <SymbolList
          heading={t("ch9.doubleArm")}
          sub={t("ch9.subWall")}
          items={items(armDouble, startLabels, t("ch9.twoCircles"))}
        />
      </div>

      <div className="ch9-cols">
        <SymbolList
          heading={t("ch9.singleFb")}
          sub={t("ch9.subFloor")}
          items={items(circleSingle, fbLabels, t("ch9.fbCircle"))}
        />
        <SymbolList
          heading={t("ch9.doubleFb")}
          sub={t("ch9.subFloor")}
          items={items(circleDouble, fbLabels, t("ch9.fbCircle"))}
        />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch9-travel" />
        <SignFigure slug="ch9-circle" />
        <SignFigure slug="ch9-area" />
        <SignFigure slug="ch9-always" />
      </div>

      <h2>{t("ch9.wristHeading")}</h2>
      <p>{t("ch9.wristIntro")}</p>
      <div className="ch9-cols">
        <SymbolList
          heading={t("ch9.singleWristSide")}
          sub={t("ch9.subWallPlane")}
          items={items(wristSideSingle, startLabels, t("ch9.oneCircle"))}
        />
        <SymbolList
          heading={t("ch9.doubleWristSide")}
          sub={t("ch9.subWallPlane")}
          items={items(wristSideDouble, startLabels, t("ch9.twoCircles"))}
        />
      </div>

      <div className="ch9-cols">
        <SymbolList
          heading={t("ch9.singleWristFb")}
          sub={t("ch9.subFloor")}
          items={items(wristFbSingle, wristFbLabels, t("ch9.fbCircle"))}
        />
        <SymbolList
          heading={t("ch9.doubleWristFb")}
          sub={t("ch9.subFloor")}
          items={items(wristFbDouble, wristFbLabels, t("ch9.fbCircle"))}
        />
      </div>
      <div className="examples-row">
        <SignFigure slug="ch9-only" />
        <SignFigure slug="ch9-look" />
        <SignFigure slug="ch9-character" />
        <SignFigure slug="ch9-government" />
        <SignFigure slug="ch9-gymnastics" />
      </div>
    </>
  );
}
