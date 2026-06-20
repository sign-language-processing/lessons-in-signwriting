import { useState } from "react";
import { key2swu } from "@sutton-signwriting/core/convert";
import { useTranslation } from "react-i18next";
import { useModalDialog } from "./useModalDialog";

const symFor = (spec: string): string => key2swu(`S${spec}`);

/**
 * A rotatable symbol set: shown as one tile at rotation 0; clicking opens a
 * dialog with all `count` rotations. `prefix` is the base + fill (a single
 * rotation hex digit is appended).
 */
export type RotSet = {
  name: string;
  title: string;
  prefix: string;
  count: number;
};

/** A base symbol (fill 0). `name` doubles as the dialog title unless `title`. */
export const move = (
  base: string,
  name: string,
  count: number,
  title?: string,
): RotSet => ({ name, title: title ?? name, prefix: `${base}0`, count });

/** An explicit base + fill prefix (e.g. "3843" for a rim view). */
export const rot = (
  prefix: string,
  name: string,
  count: number,
  title?: string,
): RotSet => ({ name, title: title ?? name, prefix, count });

function RotationsDialog({
  set,
  onClose,
}: {
  set: RotSet;
  onClose: () => void;
}) {
  const ref = useModalDialog();
  const { t } = useTranslation();
  const dirs = t("common.directions", { returnObjects: true }) as string[];
  return (
    <dialog ref={ref} className="face-dialog" onClose={onClose}>
      <h3>{set.title}</h3>
      <p className="face-dialog__hint">{t("common.rotatedHint")}</p>
      <div className="face-variants">
        {Array.from({ length: set.count }, (_, r) => (
          <figure key={r} className="face-tile">
            <sgnw-symbol
              symbol={symFor(`${set.prefix}${r.toString(16)}`)}
            ></sgnw-symbol>
            <figcaption className="face-tile__name">
              {set.count === 8 ? dirs[r] : t("common.directionN", { n: r + 1 })}
            </figcaption>
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

/** A grid of rotatable symbol tiles sharing one variants dialog. */
export function RotationGrid({ sets }: { sets: RotSet[] }) {
  const [open, setOpen] = useState<RotSet | null>(null);
  return (
    <>
      <div className="face-grid">
        {sets.map((set) => (
          <button
            type="button"
            key={set.prefix}
            className="face-tile"
            onClick={() => setOpen(set)}
          >
            <sgnw-symbol symbol={symFor(`${set.prefix}0`)}></sgnw-symbol>
            <span className="face-tile__name">{set.name}</span>
          </button>
        ))}
      </div>
      {open && <RotationsDialog set={open} onClose={() => setOpen(null)} />}
    </>
  );
}
