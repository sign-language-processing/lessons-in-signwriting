# Lessons in SignWriting — agent notes

Faithful, interactive web rebuild of *Lessons in SignWriting* by Valerie
Sutton. Source: the 2014 fourth-edition PDF distributed at
[signwriting.org/archive](https://www.signwriting.org/archive/docs2/sw0116-Lessons-SignWriting.pdf).

**Live:** <https://research.sign.mt/lessons-in-signwriting/>

**Scope is narrow.** This project does only the book. Don't add Q&A,
exercise scoring, multi-module curriculum, etc.

## Stack

| Concern | Choice |
|---|---|
| Runtime / pkg mgr | **Bun** — never npm/yarn. `bunx` instead of `npx`. |
| Build | **Vite 7** + `@vitejs/plugin-react`, **React 19** |
| Routing | None. `App.tsx` renders all 15 chapters on one page; the TOC uses `#chapter-N` hash anchors. |
| Styling | Plain CSS in `src/styles.css` (no Tailwind). |
| 3D | **three** + `@react-three/fiber` + `@react-three/drei` (hand viewer, sign-space viewers). |
| SignWriting | `@sutton-signwriting/core` (FSW↔SWU) + `@sutton-signwriting/sgnw-components` (web components). |
| Typecheck | `tsc -b` (TypeScript 5.7, strict, `noUncheckedIndexedAccess`). |
| Hosting | **GitHub Pages** (custom domain `research.sign.mt`), sub-path `/lessons-in-signwriting/`. |

No tests are wired up. Imports are relative (`../components/…`) — no path aliases.

## Commands

```bash
bun install
bun run dev       # http://localhost:5173/
bun run build     # tsc -b && vite build  → dist/
bun run preview   # serve dist/ (respects the base path)
```

To verify rendering, drive a headless browser against the dev server or
`bun run preview`. For a production-shaped check, build with the Pages base and
preview: `VITE_BASE=/lessons-in-signwriting/ bunx vite build && … vite preview`,
which serves at `/lessons-in-signwriting/`.

## What's in the repo

- `src/App.tsx` — renders `<Sidebar>`, all `Ch*` chapters in order, and (dev
  only) the source-PDF side panel.
- `src/chapters/Ch*.tsx` + `registry.ts` — one component per chapter; the
  registry drives the TOC.
- `src/components/` — `Figure`, `SignFigure`, `Sgnw` (the `<SgnwSymbol>` /
  `<SgnwSign>` wrappers), the interactive explorers (`HandshapeExplorer`,
  `HandGroupsExplorer`, `SignSpace3D`, `Fingerspelling`, …), `Sidebar`,
  `PlanButton`, `SymbolDialog`.
- `src/content/*-figures.generated.json` — per-chapter figure manifests, merged
  by `figures.ts` into one slug→`FigureData` map. Other `*.generated.json` hold
  fingerspelling and handshape-example data. Treat all as data artifacts.
- `src/lib/` — `asset.ts` (base-path helper), `devMode.ts` (`AUTHORING` flag),
  `handGroups.ts`, `handImage.ts`, `baseSymbolNames.ts`, `scrollPersist.ts`.
- `public/figures/` cropped figures · `public/videos/` whatsthatsign clips +
  name signs · `public/models/` avatar GLBs · `public/hands/` 3D-hand photos ·
  `public/vendor/sgnw-components/` the Stencil bundle + Sutton TTFs ·
  `public/pdfjs/` the source-PDF viewer · `public/docling-out` → symlink to the
  `sw0116-Lessons-SignWriting_artifacts/` extraction (hash-named images, served
  at `/docling-out/…`).
- `scripts/` — Python extraction/build pipeline (`.venv` has PIL/numpy/scipy).

## Asset paths & the GitHub Pages sub-path

The site is served from a sub-path, so **every public asset URL must go through
`asset()`** (`src/lib/asset.ts`), which rebases a root-relative path onto
`import.meta.env.BASE_URL`. It's idempotent and passes through absolute URLs.
`Figure`, `SignFigure`, `Sgnw`, the explorers, and the chapter `IMG`/`ART`
consts already do this — match that when adding new `<img>`/`<video>`/`useGLTF`
references. Vite `base` = `process.env.VITE_BASE ?? "/"`; the deploy workflow
sets `/lessons-in-signwriting/`.

## Dev vs release (`AUTHORING`)

`src/lib/devMode.ts` exports `AUTHORING = import.meta.env.DEV` — true in
`vite dev`, tree-shaken out of release builds. Authoring-only affordances:

- the source-PDF side panel + scroll persistence (`App.tsx`, `scrollPersist`),
- **candidate** signs: a figure matched to a sign but not yet `confirmed` shows
  a red-bordered image with a hover popover,
- double-click-to-copy on figures.

In a release build candidates fall back to the plain extracted image, and
`<html class="authoring">` (set in `main.tsx`) is absent, so `#root` drops the
PDF column (2 cols instead of 3). **Confirmed** signs still render live, so the
site can ship while transcription continues.

## SignFigure states

`SignFigure` reads a manifest entry (`word`, `sign`, `illustration?`, `swu?`,
`video?`, `confirmed?`) and renders one of:

- **confirmed** (`confirmed && swu`) → live `<SgnwSign>` + hover video,
- **matched** (`swu`, not confirmed) → red-border image + hover popover —
  *authoring only*,
- **plain** → the extracted image.

To confirm a sign: download its whatsthatsign clip
(`https://www.whatsthatsign.com/videos/<urlencoded-swu>.mov`), center-crop to a
720×720 mp4 like the pipeline below, drop it at the manifest's `video` path,
set `swu`, and add `"confirmed": true`. Edit the generated JSON with a script
(not by hand) so the plane-1/plane-4 SWU codepoints stay intact.

## SignWriting components: always use the `<SgnwSymbol>` / `<SgnwSign>` wrappers

Render symbols and signs through the React wrappers in `components/Sgnw.tsx`,
**not** the raw `<sgnw-symbol>` / `<sgnw-sign>` custom elements. The wrappers add
behaviour the bare elements don't:

- `<SgnwSymbol>` — for a hand-category symbol (symid `01-…`, via
  `handImageFor`) it renders dark-blue, shows the matching 3D-hands photo on
  hover/focus, and opens the fill-variant dialog on click. A raw
  `<sgnw-symbol>` renders a plain black glyph with none of this, so if a hand
  symbol isn't blue/hoverable, you almost certainly used the bare element.
- `<SgnwSign>` — accepts an optional `video` prop; with it the sign turns
  dark-blue and reveals a hover video popover (`videoMirror` flips it). Both
  wrappers default to the global 48px font-size; pass `size` to override.

`main.tsx` registers the elements once by loading Stencil's prebuilt lazy ESM
bundle from `public/vendor/sgnw-components/` via a module `<script>` tag (it
self-resolves its `p-*` chunks + the Sutton TTFs relative to its own URL, so it
works under the Pages sub-path). **Don't** bundle the package's `loader` (or its
`dist/components`) through Vite — the loader emits `*.entry.js` requests that
404 on a sub-path, and the custom-elements build needs `@stencil/core` and
rendered empty in testing.

## House rules

- TypeScript strict, `noUncheckedIndexedAccess`. No `any`.
- Named exports only.
- Default to no comments; add one only when the *why* is non-obvious.
- No manual `useCallback` / `useMemo` / `React.memo`.
- Don't hand-transcribe book content. Figures flow from the generated JSON and
  `public/…` crops; if a figure is wrong, fix the extraction (re-run the
  relevant `scripts/build_*.py`) or fix the renderer — don't retype the page.
- When recreating a book diagram as a component (e.g. `ActionFingersTree`),
  delete the now-orphaned source image and any dead manifest/`IMG` entry.

## Print

Every chapter must work on paper. `styles.css` has a `@media print` block;
chrome marked `data-no-print` is hidden. **Interactive components must expand
all states in print** — anything that shows one of several states at a time
(tabs, panel selectors, hover popovers) should render every state sequentially.

## whatsthatsign pipeline (hand-group examples + sign matching)

Example clips come from the **whatsthatsign** dataset and are regenerable:

1. **Index.** `scripts/whatsthatsign_index.csv` — committed dataset index. Each
   row has the dataset-relative `file` and an `extra` JSON whose `sign_fsw`
   holds the FSW. FSW symbols are `SBBBFR` — 3-hex base (`100`–`204` is a hand),
   1-digit fill `0`–`5`, 1-hex rotation.
2. **Select.** `scripts/build_hand_examples.py` picks one sign per fill 0..5 per
   group (root base at rotation 0 preferred; ties → short, single, lowercase).
   A `null` slot is a genuinely missing fill (kept as a placeholder).
3. **Download + crop.** `scripts/download_hand_example_videos.py` runs
   `gsutil cp gs://sign-external-datasets/whatsthatsign/<file>`, center-crops
   1280×720 → 720×720
   (`ffmpeg -vf crop=720:720:280:0 -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an`),
   writes `public/videos/whatsthatsign/<slug>/<slug>.mp4`.
4. **Wire up.** Convert `fsw` → SWU (`@sutton-signwriting/core` `convert.fsw2swu`)
   and place `{ word, sign, video }` into the group's array in
   `src/lib/handGroups.ts`. Missing-fill slots get `{ word: "", placeholder: true }`.

Requires `gsutil` and `ffmpeg` on PATH.

## Practice games

Interactive drills launched from a button (the `.practice-launch` card) after a
section. They ship in release (not authoring-gated) and reuse the shared
`.practice-dialog` shell (viewport-centered, full-screen on mobile).

- **Hand Orientation Practice** (after "Expressive Top View") — `HandOrientationPractice`
  + `PracticeContext` + `lib/practiceHands.ts`. Match a handshape's six fill
  symbols to its six orientation photos. Also launchable from `SymbolDialog`
  ("Practice this handshape"). Eligible bases = all hands minus the seven Wrist
  View bases and `15b` (missing photos).
- **Rootshape Practice** (after "Rootshapes") — `RootShapePractice` +
  `lib/rootShapes.ts`. Show a hand photo; pick which of the seven rootshapes it
  grows from. Samples **uniformly over rootshapes** (so rare ones like Flat
  Thumb Across appear as often as Tight Fist).

### Rootshape mapping (`scripts/build_rootshapes.py`)

Maps eligible hand bases → one of seven rootshapes, written to
`src/content/rootshapes.generated.json` (`{roots, bases}`; per-base scores +
the unresolved list in `scripts/rootshapes_debug.json`). Re-runnable:
`python scripts/build_rootshapes.py`. A base is mapped **only when two rules
agree** (no LLM — it was too error-prone):

- **Rule 1 — convolution.** Render the base glyph and each rootshape glyph
  (`signwriting` lib), bottom-center align, and measure inclusion
  `|rootshape ∩ base| / |rootshape|` (does the base contain the whole
  rootshape?). The best-covered rootshape is rule 1's answer.
- **Rule 2 — name keyword.** Only the five unambiguous ISWA keywords count:
  Fist, Circle, Cup, Hinge, Angle.

Convolution alone is unreliable (rootshape glyphs overlap heavily, so it
over-predicts Circle and can't separate Angle from Hinge), which is why a name
keyword must confirm it. The game quizzes only the resolved bases. Everything
unresolved (no keyword, or rules disagree) is left unmapped and printed for
manual follow-up. The `scripts/.venv` needs `signwriting` (+ `regex`) alongside
PIL/numpy/scipy.
