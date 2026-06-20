import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { SgnwSymbol } from "./Sgnw";

// A skeletal tree (no leaves) drawn as strokes. Each branch is revealed by
// animating its stroke from base to tip, staggered by `delay` so the tree grows
// trunk → boughs → twigs. Widths taper with depth.
//
// The middle SignWriting symbol grows in lockstep: trunk → rootshape only, and
// each of the three big boughs adds one Action Finger. Twigs are decorative and
// don't advance the symbol. `STAGE_AT` mirrors the bough delays below.
type Branch = { d: string; width: number; delay: number };

const TRUNK: Branch[] = [{ d: "M100 240 C95 205 106 188 100 158", width: 12, delay: 0 }];

const BOUGHS: Branch[] = [
  { d: "M100 162 C86 144 76 136 58 118", width: 7.5, delay: 0.7 },
  { d: "M100 158 C114 142 126 134 144 118", width: 7.5, delay: 1.3 },
  { d: "M100 156 C101 130 98 122 100 98", width: 6.5, delay: 1.9 },
];

const LIMBS: Branch[] = [
  { d: "M64 124 C54 116 50 108 40 96", width: 4.5, delay: 2.4 },
  { d: "M72 128 C70 114 74 106 68 92", width: 4.5, delay: 2.45 },
  { d: "M138 124 C148 116 152 108 162 96", width: 4.5, delay: 2.4 },
  { d: "M130 128 C132 114 128 106 134 92", width: 4.5, delay: 2.45 },
  { d: "M99 112 C90 102 85 96 79 84", width: 4, delay: 2.5 },
  { d: "M101 108 C110 98 115 92 121 82", width: 4, delay: 2.5 },
];

const TWIGS: Branch[] = [
  { d: "M44 100 C38 94 36 88 31 80", width: 2.5, delay: 2.9 },
  { d: "M50 106 C48 98 44 94 38 88", width: 2.5, delay: 2.95 },
  { d: "M70 96 C68 88 71 82 66 74", width: 2.5, delay: 2.95 },
  { d: "M162 100 C168 94 170 88 175 80", width: 2.5, delay: 2.9 },
  { d: "M156 106 C158 98 162 94 168 88", width: 2.5, delay: 2.95 },
  { d: "M132 96 C134 88 131 82 136 74", width: 2.5, delay: 2.95 },
  { d: "M79 88 C72 82 69 76 65 68", width: 2.2, delay: 3.1 },
  { d: "M84 86 C86 78 84 74 88 66", width: 2.2, delay: 3.15 },
  { d: "M121 86 C128 80 131 74 135 66", width: 2.2, delay: 3.1 },
  { d: "M117 84 C115 76 117 72 113 64", width: 2.2, delay: 3.15 },
  { d: "M100 100 C99 92 101 86 100 76", width: 2.4, delay: 3.05 },
];

const BRANCHES: Branch[] = [...TRUNK, ...BOUGHS, ...LIMBS, ...TWIGS];

// Foliage clumps that pop in once the branches have grown, near the twig tips.
type Leaf = { cx: number; cy: number; rx: number; ry: number; fill: string; delay: number };

const GREEN = "#5a9e3a";
const GREEN_DK = "#3f7d28";

const LEAVES: Leaf[] = [
  { cx: 32, cy: 80, rx: 9, ry: 7, fill: GREEN, delay: 3.7 },
  { cx: 40, cy: 90, rx: 8, ry: 6, fill: GREEN_DK, delay: 3.75 },
  { cx: 64, cy: 73, rx: 9, ry: 7, fill: GREEN, delay: 3.8 },
  { cx: 175, cy: 80, rx: 9, ry: 7, fill: GREEN, delay: 3.7 },
  { cx: 167, cy: 90, rx: 8, ry: 6, fill: GREEN_DK, delay: 3.75 },
  { cx: 137, cy: 73, rx: 9, ry: 7, fill: GREEN, delay: 3.8 },
  { cx: 64, cy: 67, rx: 8, ry: 6, fill: GREEN_DK, delay: 3.85 },
  { cx: 88, cy: 64, rx: 9, ry: 7, fill: GREEN, delay: 3.9 },
  { cx: 136, cy: 64, rx: 9, ry: 7, fill: GREEN, delay: 3.9 },
  { cx: 112, cy: 62, rx: 8, ry: 6, fill: GREEN_DK, delay: 3.95 },
  { cx: 100, cy: 72, rx: 9, ry: 7, fill: GREEN, delay: 4.0 },
  { cx: 50, cy: 76, rx: 7, ry: 6, fill: GREEN, delay: 4.05 },
  { cx: 122, cy: 74, rx: 7, ry: 6, fill: GREEN_DK, delay: 4.05 },
  { cx: 152, cy: 82, rx: 7, ry: 6, fill: GREEN, delay: 4.1 },
  { cx: 78, cy: 70, rx: 7, ry: 6, fill: GREEN_DK, delay: 4.1 },
];

// Symbols add one Action Finger per bough; index = stage. Times (ms) match the
// trunk start and the three bough delays above.
const SYMBOLS = ["񆄡", "񀀁", "񀕁", "񀭁"];
const STAGE_AT = [0, 700, 1300, 1900];
const CYCLE_MS = 6000;

export function ActionFingersTree() {
  const [cycle, setCycle] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStage(SYMBOLS.length - 1);
      return;
    }
    let timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = () => {
      setStage(0);
      timers = STAGE_AT.slice(1).map((t, i) => setTimeout(() => setStage(i + 1), t));
    };
    schedule();
    const id = setInterval(() => {
      timers.forEach(clearTimeout);
      setCycle((c) => c + 1);
      schedule();
    }, CYCLE_MS);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="action-tree" data-no-print>
      {/* key remount restarts the staggered grow animation each cycle */}
      <svg key={cycle} className="action-tree__svg" viewBox="20 50 172 200" aria-hidden="true">
        {BRANCHES.map((b) => (
          <path
            key={b.d}
            d={b.d}
            pathLength={1}
            strokeWidth={b.width}
            style={{ animationDelay: `${b.delay}s` }}
          />
        ))}
        {LEAVES.map((l) => (
          <ellipse
            key={`${l.cx}-${l.cy}`}
            className="action-tree__leaf"
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            fill={l.fill}
            style={{ animationDelay: `${l.delay}s` }}
          />
        ))}
      </svg>
      <div className="action-tree__symbol">
        {SYMBOLS.map((sym, i) => (
          <span
            key={sym}
            className={i === stage ? "action-tree__glyph is-active" : "action-tree__glyph"}
          >
            <SgnwSymbol symbol={sym} size={140} />
          </span>
        ))}
      </div>
      <div className="action-tree__text">
        <p>
          <Trans i18nKey="ui.actionTree1" />
        </p>
        <p>
          <Trans i18nKey="ui.actionTree2" />
        </p>
      </div>
    </div>
  );
}
