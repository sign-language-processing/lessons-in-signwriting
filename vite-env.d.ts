/// <reference types="vite/client" />

import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "sgnw-sign": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { sign?: string },
        HTMLElement
      >;
      "sgnw-symbol": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { symbol?: string },
        HTMLElement
      >;
      "sgnw-vp": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { vp?: string; colorize?: boolean | string },
        HTMLElement
      >;
      "fsw-sign": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { sign?: string },
        HTMLElement
      >;
      "fsw-symbol": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { symbol?: string },
        HTMLElement
      >;
    }
  }
}
