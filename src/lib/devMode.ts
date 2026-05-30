/**
 * Authoring-only affordances, on in `vite dev` and stripped from release builds
 * (`vite build`):
 *   - the side-by-side source PDF panel (with scroll persistence),
 *   - "candidate" (matched-but-unconfirmed) SignWriting shown with a red border
 *     and a hover popover,
 *   - double-click-to-copy on figures.
 *
 * A release build shows only finished content: the extracted images plus
 * confirmed live signs. This lets the site ship while transcription continues.
 */
export const AUTHORING = import.meta.env.DEV;
