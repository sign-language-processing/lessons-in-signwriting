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

To confirm a sign: set its `swu` and `"confirmed": true`, then point `video` at
the signbox-FSW clip (see the pipeline below — run `download_whatsthatsign.mjs`
to fetch it from the bucket, or `rewrite_video_refs.mjs` to recompute the path
from `swu`). Edit the generated JSON with a script (not by hand) so the
plane-1/plane-4 SWU codepoints stay intact.

## SignWriting components: always use the `<SgnwSymbol>` / `<SgnwSign>` wrappers

Render symbols and signs through the React wrappers in `components/Sgnw.tsx`,
**not** the raw `<sgnw-symbol>` / `<sgnw-sign>` custom elements. The wrappers add
behaviour the bare elements don't:

- `<SgnwSymbol>` — for a hand-category symbol (symid `01-…`, via
  `handImageFor`) it renders dark-blue, shows the matching 3D-hands photo on
  hover/focus, and opens the fill-variant dialog on click. For any other symbol
  the whatsthatsign dictionary has an example for (via `exampleForSymbol` /
  `lib/symbolExamples.ts`), it renders **dark-green** and the hover popover shows
  that example sign (`<sgnw-sign>`) plus its clip — hover-only, no click. A
  symbol with neither renders a plain black glyph, same as the bare
  `<sgnw-symbol>`. So a content symbol that should be blue/green but isn't was
  almost certainly written as the bare element — switch it to `<SgnwSymbol>`.
  (Genuine UI controls that are themselves buttons/tiles — the practice games,
  symbol dialog grid, tab bars — stay raw on purpose.)
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

## whatsthatsign pipeline (example clips)

Example clips come from the **whatsthatsign** dataset and are regenerable.

**Naming.** Every clip is named by its **signbox FSW** — the layout half of the
FSW string, from the first `M`/`L`/`B`/`R` box marker (the leading `A…` query
prefix is dropped so two encodings of the same physical sign compare equal):
`public/videos/whatsthatsign/M509x527S10020494x473S16d20492x507.mp4`. The
filename *is* the sign, so a reference always resolves to the right clip. FSW is
ASCII (≤155 bytes here) — raw-Unicode SWU filenames hit `EILSEQ` on macOS and
url-encoded SWU blows past the 255-byte limit, so FSW signbox is the safe form.
Helpers live in `scripts/whatsthatsign_lib.mjs` (`signboxFsw`, `canonFromSwu`,
`loadIndex`).

1. **Index.** `scripts/whatsthatsign_index.csv` — committed dataset index. Each
   row has the dataset-relative `file` and an `extra` JSON whose `sign_fsw`
   holds the FSW. FSW symbols are `SBBBFR` — 3-hex base (`100`–`204` is a hand),
   1-digit fill `0`–`5`, 1-hex rotation.
2. **Download + crop all clips.** `bun scripts/download_whatsthatsign.mjs`
   `gsutil -m cp`s the whole bucket, center-crops each 1280×720 source to a
   720×720 square
   (`ffmpeg -vf crop=720:720:280:0 -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an`),
   and writes `<signbox-fsw>.mp4`. Idempotent — reruns fetch only what's missing.
3. **Reference by sign.** Manifests/`handGroups.ts` carry a sign's SWU (`swu` or
   `sign`) plus a `video` path. `bun scripts/rewrite_video_refs.mjs [--apply]`
   recomputes every `video` from the entry's SWU → `<signbox-fsw>.mp4`. A clip
   that isn't in the bucket (a few were pulled from whatsthatsign.com directly)
   is flagged so its existing local file can be copied to the FSW name.
4. **Hand-group wiring.** Place `{ word, sign, video }` into the group's array in
   `src/lib/handGroups.ts` (`video` = the signbox-FSW path); missing-fill slots
   get `{ word: "", placeholder: true }`. `scripts/build_hand_examples.py` still
   helps pick one sign per fill 0..5 per group (root base at rotation 0
   preferred; ties → short, single, lowercase).

Requires `gsutil` and `ffmpeg` on PATH.

**Per-symbol examples.** `bun scripts/build_symbol_examples.mjs` scans the index
and writes `src/content/symbol-examples.generated.json` — a lookup from a symbol
(at full `SbbbFR`, `SbbbF`, or `Sbbb` granularity; the Forward/Back curve arrows
`S2b7`–`S2d4` use a rotation-group key `Sbbb.A`/`Sbbb.B` instead of the
rotation-blind base, so an example never crosses facing groups) to an example
sign's signbox FSW. `lib/symbolExamples.ts` reads it so `<SgnwSymbol>` can show a green
dictionary example for non-hand symbols. Symbols absent from the dataset (many
complex movement arrows, e.g. Wall Plane Corner) have no example and stay plain.

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
  `lib/rootShapes.ts`. Show a hand photo; pick which of the ten rootshapes it
  grows from (Tight Fist, Circle, Oval, Curlicue, Cup, Hinge, Angle, Flat Thumb
  Across, Flat, Flat Heel). Easy mode also shows the SignWriting symbol. Samples
  **uniformly over rootshapes** (so rare ones appear as often as common ones).

**Stats & history.** Every game logs each attempt to localStorage via
`lib/gameStats.ts` (`recordAttempt(gameId, {correct, question, chosen, answer})`;
`question`/`chosen`/`answer` holding a signbox FSW render as a sign in the
table). A 📖 button (`PracticeHistory` from `components/GameHistory.tsx`) sits
beside each dialog's × and opens a history dialog: a cumulative tried/correct
SVG line chart (bucketed per-minute < 1h of data, per-hour < 1 day, else
per-day) plus a green/red attempts table. To add stats to a new game, call
`recordAttempt` on answer and drop `<PracticeHistory game="…" title="…" />` in
the dialog header. Game ids in use: `watch:<config-id>`, `matching`, `writing`,
`rootshape`, `hand-orientation`.

Two reusable **engines** back the rest (one component, many configs — add a
config, not a component). Both sample uniformly over the answer set.

- **Watch & Name** — `WatchAndName` + `lib/watchGames.ts`. Plays a
  whatsthatsign clip and asks which closed-set member the sign uses; distractors
  are siblings. Pools are precomputed by `scripts/build_game_pools.mjs` →
  `src/content/game-pools.generated.json` (`{ gameId: { answer: signboxFsw[] } }`):
  it parses each sign's FSW, classifies by base symbol (contact bases, hand
  groups via `handGroups.ts`, movement plane/family via `BASE_SYMBOL_NAMES`
  keyword), and keeps only **unambiguous** clips (exactly one member of the set),
  capped at 40/answer. Re-run it if the index or classification changes.
  Configs: `CONTACT_GAME` (Ch4), `HANDSHAPE_GROUP_GAME` (Ch3),
  `MOVEMENT_PLANE_GAME` (Ch6), `MOVEMENT_FAMILY_GAME` (Ch9).
- **Matching Practice** — `MatchingPractice` + `lib/readingSigns.ts`, in its own
  **Chapter 16 — Practice** (`Ch16Practice`). Plays a sign's clip and asks which
  of four SignWriting writings records it (the correct one + 3 random signs).
  (Ch16 also stubs a webcam-based **Reading Practice** — "coming soon", not built.)
  Draws from `src/content/reading-signs.generated.json` (flat list of signbox
  FSW for local clips, capped at 800, also emitted by `build_game_pools.mjs`);
  renders each option as a live `<sgnw-sign>` via `convert.fsw2swu`. New games
  go in Ch16.
- **Writing Practice** — `WritingPractice` + `lib/writingPractice.ts`, in Ch16.
  Embeds the SignWriting keyboard (remote iframe to
  `sutton-signwriting.io/signmaker`) and asks the learner to write a part of a
  sign: Hands / Contact / Movement / Face / Entire sign. The original sign is
  reduced (the target symbol class blanked out) and pushed into the keyboard via
  `postMessage({fsw})` — one persistent iframe, no reload between rounds. On the
  keyboard's Save it posts `{signmaker:"save", fsw}` back; grading is
  position-independent (the multiset of `Sbbbfr` identities of the target class
  must match the original). Symbol classes by base hex live in `classOf`. If the
  deployed keyboard ever drops that postMessage bridge, vendor
  `sign-language-processing/signmaker` into `public/signmaker` (built with our
  Pages base) and repoint `SIGNMAKER_URL`.
- **Name the Symbol** — `NameTheSymbol` + `lib/nameGames.ts`. Shows a still
  stimulus (live `<sgnw-symbol>` or a figure image) and asks its name from the
  chapter's closed set. Reuses the `.rootshape-option(s)` MC styles. Configs
  `DYNAMICS_GAME` and `PUNCTUATION_GAME` exist but are **currently unwired** —
  Ch13/Ch14 aren't content-ready; re-add `<NameTheSymbol game={…} />` when they
  are.

### Rootshape mapping

`src/content/rootshapes.json` is the hand-curated source of truth: a flat
`{ handshape-symbol → rootshape-symbol }` map (SWU characters, default
fill/rotation) covering all 261 hand bases. `lib/rootShapes.ts` reads it; the
ten rootshape names/symbols live in `ROOT_SHAPES` there. To change a mapping,
edit the JSON (or `ROOT_SHAPES` to add/rename a rootshape) — no build step. (An
earlier convolution+name script that auto-predicted the map was removed once the
map was reviewed by hand.)
