import { Fragment } from "react";
import { asset } from "../lib/asset";
import { handImageFor } from "../lib/handImage";
import { SgnwSymbol } from "./Sgnw";

const SYMBOLS = ["񀙑", "񀥑", "񀦱", "񁟱", "񁡑"];

// +0x01 on the symbol codepoint steps to the next 45° rotation variant.
function rotate45(symbol: string): string {
  return String.fromCodePoint((symbol.codePointAt(0) ?? 0) + 1);
}

/** 3×5 grid: each handshape symbol, its hand photo, and the same symbol rotated 45°. */
export function FingerDirectionGrid() {
  return (
    <div className="finger-direction-grid">
      {SYMBOLS.map((symbol) => {
        const img = handImageFor(symbol);
        return (
          <Fragment key={symbol}>
            <SgnwSymbol symbol={symbol} size={56} />
            {img ? <img src={asset(img)} alt="" /> : <span />}
            <SgnwSymbol symbol={rotate45(symbol)} size={56} />
          </Fragment>
        );
      })}
    </div>
  );
}
