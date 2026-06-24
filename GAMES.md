# Games & Practice Plan

Goal: make the book interactive enough to become a guided, Duolingo-style
learning path. Every chapter that teaches a **closed set** (contact types,
movement families, directions, facial regions, punctuation marks…) should end
with at least one drill. This doc maps each chapter to a game and groups them
under a few **reusable engines** so we build components, not one-offs.

## Principles

- **Reuse engines, not bespoke games.** Three engines below cover ~80% of the
  book. A new chapter game should be a *config*, not a new component.
- Ships in release (not authoring-gated), launched from a `.practice-launch`
  card after the relevant section, reusing the `.practice-dialog` shell.
- Light-dismiss (`closedby="any"` + Safari fallback), keyboard-operable.
- **Print expands all states** (per house rules) — or the launch card is
  simply `data-no-print` and the drill is skipped on paper.
- **Sample uniformly over the answer set** (as Rootshape Practice does) so rare
  members appear as often as common ones — important because the sign bank is
  very imbalanced (see data notes).

## The two asset banks we can mine

1. **whatsthatsign video bank** — 2015 ASL clips, each named by its signbox FSW
   and carrying full `sign_fsw`. We can parse the FSW and know *exactly which
   symbols a sign contains*, so we can auto-filter "all clips whose sign uses a
   Touch contact", "…a circular movement", "…a B-group handshape", etc. This is
   the engine behind the user's headline idea: **show a clip, ask which one
   happened.**
2. **symbol-examples** (`symbol-examples.generated.json`) — a still example
   `<sgnw-sign>` per symbol. Good for "read the symbol" drills and for showing
   the answer's canonical example.

FSW symbol parse: `S` + 3-hex base + 1-hex fill + 1-hex rotation. Category is
the base hex. Contact bases verified: Touch `205`, Between `207`, Grasp `208`,
Strike `20b`, Brush `20e`, Rub `211`. A `scripts/build_game_pools.mjs` should
precompute, per game, the list of eligible clips grouped by answer — don't scan
2015 rows at runtime.

---

## Engine 1 — "Watch & Name"  (video → multiple choice)  ⭐ highest value

Show a whatsthatsign clip; ask which member of a closed set the sign uses;
distractors are siblings from the same set. The clip *demonstrates* the concept,
so this is the most pedagogically honest drill we have.

**Config shape:** `{ title, prompt, answers: [{key, name, symbol}], pool:
{answerKey → clipFsw[]} }`. Pool is precomputed: a clip joins answer K's pool if
its FSW contains exactly one member of the set (one contact, one movement
family…) so the question is unambiguous.

Chapters it covers:

| Ch | Concept | Answer set | Bank coverage |
|----|---------|-----------|---------------|
| 4  | Contact type | Touch / Grasp / Strike / Brush / Rub / Between | 532 / 27 / 8 / 270 / 86 / 25 — usable; Strike thin, cap easy rounds to the well-populated four, add the rare ones in "hard" |
| 3  | Handshape group | the 10 groups | hands appear in nearly every sign — huge pool; filter to signs whose *only* hand base is in one group |
| 6  | Plane of movement | Wall vs Floor (double- vs single-stem) | large; coarse 2-way is easy + reliable |
| 6  | Straight direction | Up / Down / Forward / Back / diagonals | good |
| 7  | Curved vs straight | curve present? which family | moderate |
| 8  | Axial / rotation | rotation present? thumb- vs baby-led | moderate |
| 9  | Circular | arm vs wrist circle | smaller pool — verify before building |
| 13 | Movement dynamic | fast / slow / tense / relaxed (dynamics bases `2f7`–`2fe`) | `2fe` appears 1478× — verify these are the dynamic marks before relying on them |

Start with **Contact (Ch4)** — the user's example, best coverage, cleanest set.

---

## Engine 2 — "Read the Symbol"  (still SignWriting → pick the name)

Generalizes the existing `RootShapePractice`. Show one symbol (rendered via
`<sgnw-symbol>`; optionally its green example sign on reveal); pick its name from
the chapter's closed set. No video needed, so it works where the bank is thin.

Chapters it covers:

| Ch | Concept | Answer set |
|----|---------|-----------|
| 4  | Contact symbol → name | the 6 contact glyphs |
| 14 | Punctuation mark → name | the 6 marks |
| 13 | Dynamics symbol → name | Fast / Slow / Smooth / Tense / Relaxed |
| 6–9| Movement symbol → name | per-chapter direction/family sets (already enumerated in each chapter's data) |
| 10 | Facial marker → region | the 12 regions |
| 11 | Head rim → which view | the 4 rims / 7 viewpoints |

This is the "flashcard" tier — cheap to instantiate once Engine 2 is generic.

---

## Engine 3 — "Match pairs"  (already exists: `HandOrientationPractice`)

A 2-column matching grid (`practice-board`). Generalize its hard-coded
"symbol↔photo for one base's six fills" into `{ left[], right[], pairKey }` so we
can reuse it for:

| Ch | Match A | Match B |
|----|---------|---------|
| 3  | handshape symbol | 3D-hand photo (current behavior) |
| 10 | facial-marker symbol | photo/illustration of the expression |
| 8/11/12 | rotation symbol | direction label or arrow diagram |
| 2  | sign parameter name | its symbol family example |

---

## Bespoke micro-games (only where no engine fits)

- **Ch5 Sequential finger movement — ordering.** Show a sign; put "index,
  middle, ring, pinky" in the order they close/open. Sequencing UI, not MC.
- **Ch15 Compose / place — extend `MovementWheel`.** It already shows arrows
  around a contact center; turn it into "place the arrow that makes THIS sign"
  (drag/þick a spoke, compare to target). Highest-effort, do last.
- **Ch15 Read a column — order the signs.** Given a shuffled vertical column,
  drag into correct top-to-bottom reading order.
- **Ch11/12 Viewpoint match.** Given a head/body symbol, pick the viewpoint
  photo it encodes (could also be Engine 3).

---

## Status (first pass — built)

Shipped via two engines + a precompute step (`scripts/build_game_pools.mjs`):

- **Watch & Name** (`WatchAndName`, `lib/watchGames.ts`): Contact (Ch4),
  Handshape group (Ch3), Movement plane (Ch6), Movement family (Ch9).
- **Name the Symbol** (`NameTheSymbol`, `lib/nameGames.ts`): Dynamics (Ch13),
  Punctuation (Ch14) — built but **unwired** (those chapters aren't
  content-ready yet; re-add the `<NameTheSymbol>` calls when they are).
- **Matching Practice** (`MatchingPractice`, `lib/readingSigns.ts`) — watch a
  sign's clip, pick which of four SignWriting writings records it. Lives in the
  new **Chapter 16 — Practice**, the home for future drills. Distractors are
  currently random signs; could later bias toward same handshape/movement for
  difficulty tiers.
- **Reading Practice** (webcam) — read a sign in SignWriting and perform it to
  the camera. Stubbed "coming soon" in Ch16; not built (needs sign recognition).
- **Writing Practice** (`WritingPractice`, `lib/writingPractice.ts`) — also in
  Ch16. Embeds the SignWriting keyboard (remote iframe); the learner writes a
  blanked-out part (hands / contact / movement / face / whole sign) and saves to
  check. Position-independent grading. Needs network for the keyboard iframe.

Deferred (need data we don't have yet, not engine work):
- **Face-region drill (Ch10)** — needs a curated symbol→region list; Ch10's
  section data could be lifted into a `lib/faceMarkers.ts`. Easy follow-up.
- **Ch5 finger-order sequencing** and **Ch15 compose-the-sign** — need
  per-sign authored data (which finger first; target arrow placement) that the
  whatsthatsign bank doesn't carry. Bespoke; do when there's authored data.
- **Engine 2 for movement-direction symbols** — straightforward to add per
  movement chapter once we want symbol-recall (vs. the video-recognition games
  already shipped).

- **Fingerspelling Practice** (`FingerspellingPractice`, `lib/fingerspellingGame.ts`)
  — Ch3. Read a fingerspelled name in SignWriting and type it. Dropdown of the
  14 signed languages the endpoint supports; fingerspelling fetched live from
  `signwriting.nagish.dev/fingerspelling`. Covers SIGN-413 (L2). Needs network;
  lenient (accent/case-insensitive) grading.

## Build order

1. **Engine 1 + Contact game (Ch4).** Proves the video→identify pattern end to
   end, including the `build_game_pools.mjs` precompute step. The user's
   headline example.
2. **Generalize Engine 2** from `RootShapePractice`; drop in Punctuation (Ch14)
   and Contact-symbol (Ch4) flashcards — fast wins, no video dependency.
3. **Movement family/direction games (Ch6, then 7–9)** on Engine 1 — the
   biggest untapped block; verify per-chapter pool sizes first.
4. **Generalize Engine 3**; add Face-marker match (Ch10).
5. **Bespoke** sequencing/compose games (Ch5, Ch15) last.

A small **progress/streak** layer (localStorage, like `scrollPersist`) can come
once ≥3 games ship — that's the bridge toward the learning-path framing. Defer
until there's something to track.

## Data gaps / honesty

- whatsthatsign is **ASL citation-form** clips. Facial-grammar and body markers
  (Ch10–12) rarely appear in isolated dictionary signs, so Engine 1 is weak
  there — use Engine 2/3 (symbol-based) for those chapters.
- The bank is **highly imbalanced** (Touch 532 vs Strike 8). Uniform sampling
  over answers + capping rare members to "hard" mode keeps quizzes fair.
- Verify dynamics (`2f7`–`2fe`) and circular pools against the index before
  committing those games — counts above are coarse.
