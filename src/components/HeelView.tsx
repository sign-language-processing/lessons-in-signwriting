import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { asset } from "../lib/asset";
import { handImageForRotation } from "../lib/handImage";
import { SgnwSymbol } from "./Sgnw";

const BASE = asset("/textbook/heel-views");

export type HeelRow = {
  photo: string;
  /** Optional companion photo (e.g. the Top-View pose alongside the Wrist-View pose). */
  altPhoto?: string;
  /** Each symbol is either a `.png` filename under /textbook/heel-views or a live SWU character. */
  symbolL: string;
  symbolR: string;
};

function Sym({
  value,
  alt,
  rotationView = false,
}: {
  value: string;
  alt: string;
  /** Wrist-view symbols index their hover photo by rotation, not fill. */
  rotationView?: boolean;
}) {
  if (value.endsWith(".png")) {
    return <img className="heel-table__sym" src={`${BASE}/${value}`} alt={alt} />;
  }
  return (
    <span className="heel-table__sym">
      <SgnwSymbol
        symbol={value}
        size={72}
        handImage={rotationView ? handImageForRotation(value) : undefined}
      />
    </span>
  );
}

/**
 * A handshape that can be written two equivalent ways — the Heel of Hand
 * "Wrist View" or the traditional Top View. Laid out as a grid table so the
 * two column headings appear once instead of repeating per row, and every row
 * shares the same photo / Wrist-View / Top-View columns.
 */
export function HeelViewTable({ rows }: { rows: HeelRow[] }) {
  const { t } = useTranslation();
  return (
    <div className="heel-table">
      <span className="heel-table__head" />
      <span className="heel-table__head">{t("ui.heelWrist")}</span>
      <span className="heel-table__head">{t("ui.topView")}</span>
      {rows.map((r) => (
        <Fragment key={r.photo}>
          <div className="heel-table__photos">
            <img src={`${BASE}/${r.photo}`} alt="" />
            {r.altPhoto ? <img src={`${BASE}/${r.altPhoto}`} alt="" /> : null}
          </div>
          <Sym value={r.symbolL} alt={t("ui.heelWrist")} rotationView />
          <Sym value={r.symbolR} alt={t("ui.topView")} />
        </Fragment>
      ))}
    </div>
  );
}
