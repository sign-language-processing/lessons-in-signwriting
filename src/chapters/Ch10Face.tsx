import { useState } from "react";
import { key2swu } from "@sutton-signwriting/core/convert";
import { Trans, useTranslation } from "react-i18next";
import { SgnwSymbol } from "../components/Sgnw";
import { useModalDialog } from "../components/useModalDialog";

const sym = (base: string, fill = 0, rot = 0): string =>
  key2swu(`S${base}${fill.toString(16)}${rot.toString(16)}`);
const symFor = (spec: string): string =>
  key2swu(`S${spec.length === 5 ? spec : `${spec}00`}`);
const nameKey = (spec: string): string =>
  spec === "2ff" ? "neutral" : spec === "2ff02" ? "backOfHead" : spec;

type VariantAxis = "side" | "dir" | null;

const SECTIONS: { id: string; axis: VariantAxis; bases: string[] }[] = [
  { id: "forehead", axis: null, bases: ["311", "312", "313"] },
  {
    id: "eyebrows",
    axis: "side",
    bases: ["30a", "30b", "30c", "30d", "30e", "30f", "310"],
  },
  {
    id: "eyes",
    axis: "side",
    bases: ["314", "315", "316", "317", "318", "319", "31a", "31b", "31c", "31d", "31e", "31f", "320"],
  },
  {
    id: "eyegaze",
    axis: "dir",
    bases: ["321", "322", "323", "324", "325", "326", "327", "328", "329"],
  },
  { id: "ears", axis: "side", bases: ["330"] },
  { id: "cheeks", axis: "side", bases: ["32a", "32b", "32c", "32d", "32e", "32f"] },
  { id: "nose", axis: null, bases: ["331", "332", "333", "334"] },
  { id: "breathing", axis: null, bases: ["335", "336", "337", "338", "339", "33a"] },
  {
    id: "mouth",
    axis: null,
    bases: ["33b", "33c", "33d", "33e", "33f", "340", "341", "342", "343", "344", "345", "346", "347", "348", "349", "34a", "34b", "34c", "34d", "34e", "34f", "350", "351", "352", "353", "354", "355", "356", "357", "358"],
  },
  { id: "tongue", axis: "dir", bases: ["359", "35a", "35b", "35c", "35d", "35e", "35f", "360"] },
  { id: "teeth", axis: null, bases: ["361", "362", "363", "364", "365", "366", "367"] },
  { id: "chin", axis: "dir", bases: ["368", "369"] },
  { id: "other", axis: null, bases: ["2ff02", "36a", "36b", "36c"] },
];

function VariantDialog({
  base,
  axis,
  onClose,
}: {
  base: string;
  axis: Exclude<VariantAxis, null>;
  onClose: () => void;
}) {
  const ref = useModalDialog();
  const { t } = useTranslation();
  const side = t("ch10.side", { returnObjects: true }) as string[];
  const dirs = t("common.directions", { returnObjects: true }) as string[];
  const variants =
    axis === "side"
      ? side.map((label, fill) => ({ key: sym(base, fill), label }))
      : dirs.map((label, rot) => ({ key: sym(base, 0, rot), label }));
  return (
    <dialog ref={ref} className="face-dialog" onClose={onClose}>
      <h3>{t(`ch10.names.${nameKey(base)}`)}</h3>
      <p className="face-dialog__hint">
        {axis === "side" ? t("ch10.sideHint") : t("common.rotatedHint")}
      </p>
      <div className="face-variants">
        {variants.map((v) => (
          <figure key={v.key} className="face-tile">
            <sgnw-symbol symbol={v.key}></sgnw-symbol>
            <figcaption className="face-tile__name">{v.label}</figcaption>
          </figure>
        ))}
      </div>
      <button
        type="button"
        className="face-dialog__close"
        onClick={() => ref.current?.close()}
      >
        {t("common.close")}
      </button>
    </dialog>
  );
}

function FaceTile({
  base,
  axis,
  onOpen,
}: {
  base: string;
  axis: VariantAxis;
  onOpen: (base: string) => void;
}) {
  const { t } = useTranslation();
  const name = t(`ch10.names.${nameKey(base)}`);
  if (axis) {
    return (
      <button type="button" className="face-tile" onClick={() => onOpen(base)}>
        <sgnw-symbol symbol={symFor(base)}></sgnw-symbol>
        <span className="face-tile__name">{name}</span>
      </button>
    );
  }
  return (
    <figure className="face-tile">
      <SgnwSymbol symbol={symFor(base)} />
      <figcaption className="face-tile__name">{name}</figcaption>
    </figure>
  );
}

export function Ch10Face() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<{ base: string; axis: VariantAxis } | null>(
    null,
  );

  return (
    <>
      <h2 id="chapter-10">
        {t("common.chapterHeading", { number: 10, title: t("toc.chapter-10") })}
      </h2>
      <p>
        <Trans i18nKey="ch10.intro" />
      </p>

      <div className="face-neutral">
        <SgnwSymbol symbol={sym("2ff")} size={96} />
        <div>
          <h3>{t("ch10.names.neutral")}</h3>
          <p>{t("ch10.neutralText")}</p>
        </div>
      </div>

      <p className="face-convention">
        <Trans i18nKey="ch10.convention" />
      </p>

      {SECTIONS.map((section) => {
        const intro = t(`ch10.intros.${section.id}`, { defaultValue: "" });
        return (
          <section key={section.id} className="face-section">
            <h3>{t(`ch10.sections.${section.id}`)}</h3>
            {intro && <p>{intro}</p>}
            <div className="face-grid">
              {section.bases.map((base) => (
                <FaceTile
                  key={base}
                  base={base}
                  axis={section.axis}
                  onOpen={(b) => setOpen({ base: b, axis: section.axis })}
                />
              ))}
            </div>
          </section>
        );
      })}

      {open && open.axis && (
        <VariantDialog
          base={open.base}
          axis={open.axis}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
