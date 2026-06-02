import { useRef, useState, type CSSProperties } from "react";
import { asset } from "../lib/asset";
import { handImageFor, symbolToKey } from "../lib/handImage";
import { exampleForSymbol } from "../lib/symbolExamples";
import { useSymbolDialog } from "./SymbolDialogContext";

const POPOVER_HEIGHT = 200;
const DICT_POPOVER_HEIGHT = 320;
const POPOVER_GAP = 8;

const POPOVER_BOX: CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  maxWidth: "90vw",
  background: "white",
  border: "1px solid #ccc",
  boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
  padding: 8,
  borderRadius: 6,
  zIndex: 100,
  pointerEvents: "none",
};

export type SgnwSymbolProps = {
  /** A single SignWriting symbol character (e.g. "񂇁"). */
  symbol: string;
  /** Font size override (defaults to the 48px global). Accepts any CSS length. */
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  /** Override the hover hand photo (e.g. rotation-indexed for wrist-view symbols). */
  handImage?: string | null;
};

/**
 * Typed React wrapper for the <sgnw-symbol> custom element registered by
 * @sutton-signwriting/sgnw-components. Renders a single SignWriting symbol
 * that is selectable as live text.
 *
 * Hand-category symbols (symid starts with "01-") render dark-blue and show a
 * hover popover with the matching 3d-hands-benchmark photograph (click opens
 * the fill-variant dialog). Any other symbol that the whatsthatsign dictionary
 * has an example sign for renders dark-green and shows that sign plus its clip
 * on hover. Symbols with neither render plain.
 */
export function SgnwSymbol({
  symbol,
  size,
  className,
  style,
  handImage: handImageOverride,
}: SgnwSymbolProps) {
  const [placement, setPlacement] = useState<"hidden" | "above" | "below">(
    "hidden",
  );
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const dialog = useSymbolDialog();

  const handImage =
    handImageOverride !== undefined ? handImageOverride : handImageFor(symbol);
  // Non-hand symbols have no photo; offer a dictionary example sign instead.
  const example = handImage ? null : exampleForSymbol(symbol);
  const popoverHeight = handImage ? POPOVER_HEIGHT : DICT_POPOVER_HEIGHT;

  const openPopover = () => {
    const el = wrapperRef.current;
    if (!el) {
      setPlacement("above");
      return;
    }
    const rect = el.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const needed = popoverHeight + POPOVER_GAP;
    // Prefer above if it fits, otherwise below; if neither fits, pick whichever has more room.
    if (spaceAbove >= needed) setPlacement("above");
    else if (spaceBelow >= needed) setPlacement("below");
    else setPlacement(spaceBelow > spaceAbove ? "below" : "above");
  };
  const closePopover = () => setPlacement("hidden");

  // The font-size MUST be applied directly to <sgnw-symbol> — the global
  // rule `sgnw-symbol { font-size: 48px }` has higher specificity than
  // inheritance from any wrapper, so a font-size on the wrapper has no
  // effect on the rendered glyph.
  const symbolStyle: CSSProperties = {
    ...(size === undefined ? {} : { fontSize: size }),
    ...(handImage
      ? { color: "darkblue" }
      : example
        ? { color: "darkgreen" }
        : {}),
  };

  if (!handImage && !example) {
    // No photo and no dictionary example — render the bare custom element.
    return (
      <sgnw-symbol
        symbol={symbol}
        className={className}
        style={{ ...symbolStyle, ...style }}
      ></sgnw-symbol>
    );
  }

  const handleClick = () => {
    if (!handImage) return; // dictionary examples are hover-only
    const key = symbolToKey(symbol);
    if (key) dialog.open(key);
  };

  // Wrapper carries caller positioning (e.g. `position: absolute; top: 3%;
  // right: 1%` for overlays). Defaults to `position: relative; display:
  // inline-block` so the absolute hover popover anchors correctly.
  const wrapperStyle: CSSProperties = {
    display: "inline-block",
    position: "relative",
    cursor: handImage ? "pointer" : "help",
    ...style,
  };
  const popoverPosition: CSSProperties =
    placement === "above"
      ? { bottom: `calc(100% + ${POPOVER_GAP}px)` }
      : { top: `calc(100% + ${POPOVER_GAP}px)` };

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={wrapperStyle}
      onMouseEnter={openPopover}
      onMouseLeave={closePopover}
      onFocus={openPopover}
      onBlur={closePopover}
      onClick={handleClick}
      role={handImage ? "button" : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (handImage && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <sgnw-symbol symbol={symbol} style={symbolStyle}></sgnw-symbol>
      {placement !== "hidden" && handImage && (
        <img
          src={asset(handImage)}
          alt=""
          style={{
            ...POPOVER_BOX,
            ...popoverPosition,
            height: POPOVER_HEIGHT,
            width: "auto",
          }}
        />
      )}
      {placement !== "hidden" && !handImage && example && (
        <span
          style={{
            ...POPOVER_BOX,
            ...popoverPosition,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <sgnw-sign sign={example.sign} style={{ fontSize: 56 }}></sgnw-sign>
          <video
            src={asset(example.video)}
            autoPlay
            loop
            muted
            playsInline
            style={{
              height: 200,
              width: "auto",
              maxWidth: "90vw",
              borderRadius: 4,
            }}
          />
        </span>
      )}
    </span>
  );
}

export type SgnwSignProps = {
  /** A SignWriting sign string (Formal SignWriting / Unicode). */
  sign: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  /** Optional video URL — shown as a hover popover (autoplay, loop, muted). */
  video?: string;
  /** Mirror the hover video horizontally (e.g., to flip a right-handed sign). */
  videoMirror?: boolean;
};

const VIDEO_HEIGHT = 240;
const VIDEO_GAP = 8;

/**
 * Typed React wrapper for the <sgnw-sign> custom element registered by
 * @sutton-signwriting/sgnw-components. Renders a full sign (sign-box).
 *
 * If a `video` URL is supplied, the sign becomes interactive: hover or focus
 * displays a popover with the video autoplaying on loop.
 */
export function SgnwSign({
  sign,
  size,
  className,
  style,
  video,
  videoMirror,
}: SgnwSignProps) {
  const [placement, setPlacement] = useState<"hidden" | "above" | "below">(
    "hidden",
  );
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const baseStyle: CSSProperties = {
    ...(size === undefined ? {} : { fontSize: size }),
    ...(video ? { color: "darkblue" } : {}),
    ...style,
  };
  const mergedStyle: CSSProperties | undefined =
    Object.keys(baseStyle).length === 0 ? undefined : baseStyle;

  if (!video) {
    return (
      <sgnw-sign
        sign={sign}
        className={className}
        style={mergedStyle}
      ></sgnw-sign>
    );
  }

  const openPopover = () => {
    const el = wrapperRef.current;
    if (!el) {
      setPlacement("above");
      return;
    }
    const rect = el.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const needed = VIDEO_HEIGHT + VIDEO_GAP;
    if (spaceAbove >= needed) setPlacement("above");
    else if (spaceBelow >= needed) setPlacement("below");
    else setPlacement(spaceBelow > spaceAbove ? "below" : "above");
  };
  const closePopover = () => setPlacement("hidden");

  const popoverPosition: CSSProperties =
    placement === "above"
      ? { bottom: `calc(100% + ${VIDEO_GAP}px)` }
      : { top: `calc(100% + ${VIDEO_GAP}px)` };

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={{ display: "inline-block", position: "relative", ...style }}
      onMouseEnter={openPopover}
      onMouseLeave={closePopover}
      onFocus={openPopover}
      onBlur={closePopover}
    >
      <sgnw-sign sign={sign} style={mergedStyle}></sgnw-sign>
      {placement !== "hidden" && (
        <video
          src={asset(video)}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            left: "50%",
            transform: videoMirror
              ? "translateX(-50%) scaleX(-1)"
              : "translateX(-50%)",
            ...popoverPosition,
            height: VIDEO_HEIGHT,
            width: "auto",
            maxWidth: "90vw",
            background: "white",
            border: "1px solid #ccc",
            boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
            padding: 8,
            borderRadius: 6,
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  );
}
