import { useRef, useState, type CSSProperties } from "react";
import { figures as FIGURES } from "../content/figures";
import { asset } from "../lib/asset";
import { AUTHORING } from "../lib/devMode";
import { SgnwSign } from "./Sgnw";

const POPOVER_HEIGHT = 200;
const POPOVER_GAP = 8;

export type SignFigureProps = {
  /** Key into contact-figures.generated.json. */
  slug: string;
};

/**
 * One book example: the line drawing (when present) above the SignWriting sign
 * above the word. When the word resolves to a whatsthatsign entry, the sign
 * image gets a red border and reveals the live <sgnw-sign> on hover/focus.
 */
export function SignFigure({ slug }: SignFigureProps) {
  const fig = FIGURES[slug];
  const [placement, setPlacement] = useState<"hidden" | "above" | "below">(
    "hidden",
  );
  const signRef = useRef<HTMLSpanElement>(null);

  if (!fig) return null;
  const confirmed = Boolean(fig.confirmed && fig.swu);
  // "Candidate" signs (matched to a sign but not yet confirmed) are an authoring
  // affordance — in release they fall back to the plain extracted image.
  const matched = AUTHORING && !confirmed && Boolean(fig.swu);

  const openPopover = () => {
    const el = signRef.current;
    if (!el) {
      setPlacement("above");
      return;
    }
    const rect = el.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const needed = POPOVER_HEIGHT + POPOVER_GAP;
    if (spaceAbove >= needed) setPlacement("above");
    else if (spaceBelow >= needed) setPlacement("below");
    else setPlacement(spaceBelow > spaceAbove ? "below" : "above");
  };
  const closePopover = () => setPlacement("hidden");

  const popoverPosition: CSSProperties =
    placement === "above"
      ? { bottom: `calc(100% + ${POPOVER_GAP}px)` }
      : { top: `calc(100% + ${POPOVER_GAP}px)` };

  return (
    <figure className="sign-figure">
      {fig.illustration && (
        <img className="sign-figure__illustration" src={asset(fig.illustration)} alt="" />
      )}
      {confirmed ? (
        <span className="sign-figure__sign">
          <SgnwSign sign={fig.swu as string} video={fig.video} />
        </span>
      ) : (
        <span
          ref={signRef}
          className={
            matched ? "sign-figure__sign sign-figure__sign--matched" : "sign-figure__sign"
          }
          onMouseEnter={matched ? openPopover : undefined}
          onMouseLeave={matched ? closePopover : undefined}
          onFocus={matched ? openPopover : undefined}
          onBlur={matched ? closePopover : undefined}
          tabIndex={matched ? 0 : undefined}
        >
          <img src={asset(fig.sign)} alt={fig.word} />
          {matched && placement !== "hidden" && (
            <span
              className="sign-figure__popover"
              style={popoverPosition}
              aria-hidden="true"
            >
              <sgnw-sign sign={fig.swu}></sgnw-sign>
              {fig.video && (
                <video src={asset(fig.video)} autoPlay loop muted playsInline />
              )}
            </span>
          )}
        </span>
      )}
      <figcaption>{fig.word}</figcaption>
      {matched && (
        <span className="sign-figure__print-sign" aria-hidden="true">
          <sgnw-sign sign={fig.swu}></sgnw-sign>
        </span>
      )}
    </figure>
  );
}
