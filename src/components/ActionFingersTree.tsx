import { SgnwSymbol } from "./Sgnw";

// A skeletal tree (no leaves) drawn as a set of strokes. Each branch is revealed
// by animating its stroke from tip to base, staggered by `delay` so the tree
// grows trunk-first, then boughs, then twigs — echoing how Action Fingers branch
// off the Rootshape.
type Branch = { d: string; width: number; delay: number };

const BRANCHES: Branch[] = [
  { d: "M100 238 Q97 194 100 150", width: 10, delay: 0 },
  { d: "M100 168 Q72 150 55 118", width: 6, delay: 0.45 },
  { d: "M100 162 Q132 146 156 122", width: 6, delay: 0.5 },
  { d: "M100 150 Q103 118 96 92", width: 5, delay: 0.55 },
  { d: "M64 132 Q50 122 40 104", width: 3.5, delay: 0.95 },
  { d: "M70 126 Q70 108 60 92", width: 3.5, delay: 1.0 },
  { d: "M146 128 Q162 118 172 100", width: 3.5, delay: 0.95 },
  { d: "M140 124 Q146 106 156 92", width: 3.5, delay: 1.0 },
  { d: "M97 108 Q84 96 76 82", width: 3, delay: 1.05 },
  { d: "M99 102 Q112 90 120 76", width: 3, delay: 1.05 },
  { d: "M44 108 Q38 100 32 92", width: 2, delay: 1.4 },
  { d: "M58 96 Q54 88 48 80", width: 2, delay: 1.45 },
  { d: "M168 104 Q174 96 180 86", width: 2, delay: 1.4 },
  { d: "M152 94 Q158 86 164 78", width: 2, delay: 1.45 },
  { d: "M120 78 Q126 70 132 64", width: 2, delay: 1.5 },
  { d: "M78 84 Q72 78 66 70", width: 2, delay: 1.5 },
];

export function ActionFingersTree() {
  return (
    <div className="action-tree" data-no-print>
      <svg className="action-tree__svg" viewBox="0 0 200 240" aria-hidden="true">
        {BRANCHES.map((b) => (
          <path
            key={b.d}
            d={b.d}
            pathLength={1}
            strokeWidth={b.width}
            style={{ animationDelay: `${b.delay}s` }}
          />
        ))}
      </svg>
      <div className="action-tree__symbol">
        <SgnwSymbol symbol="񀕁" size={140} />
      </div>
      <div className="action-tree__text">
        <p>
          <strong>Action Fingers</strong> are like branches on a tree.
        </p>
        <p>
          <strong>Rootshape</strong> provides the foundation to the symbol.
        </p>
      </div>
    </div>
  );
}
