import { SymbolExplorer, type ExplorerType } from "./SymbolExplorer";

const FINGERS: ExplorerType[] = [
  {
    name: "Squeeze, Middle Joint Closes",
    symbol: "񆡁",
    sections: [
      {
        paragraphs: [
          "When the middle joint of the finger squeezes tight (bends down or in), this closing finger movement is written with a dark dot.",
          "The dot is placed near the finger joint that does the squeezing. Two dots represent two squeezes.",
        ],
        slugs: ["finger-huh", "finger-milk"],
      },
    ],
  },
  {
    name: "Flick, Middle Joint Opens",
    symbol: "񆨡",
    sections: [
      {
        paragraphs: [
          "When the middle joint of the finger flicks open (goes from bent to straight), this opening flicking movement is written with a hollow dot.",
          "The dot is placed near the finger that flicks. Two dots represent two flicks.",
        ],
        slugs: ["finger-eleven", "finger-understand"],
      },
    ],
  },
  {
    name: "Hinge, Knuckle Joint Closes",
    symbol: "񆱥",
    sections: [
      {
        paragraphs: [
          "The middle joint of the finger locks, while the knuckle joint bends down, like the Hinge on a door. This closing knuckle movement is written with a small arrow that points down. The arrow pushes the fingers down. Two arrows mean 2 hinges.",
        ],
        slugs: ["finger-twenty", "finger-boy"],
      },
    ],
  },
  {
    name: "Hinge, Knuckle Joint Opens",
    symbol: "񆱡",
    sections: [
      {
        paragraphs: [
          "The middle joint of the finger locks, while the knuckle joint bends up, like the Hinge on a door. This opening knuckle movement is written with a small arrow that points up. The arrow pulls the fingers up. Two arrows mean 2 hinges up.",
        ],
        slugs: ["finger-send", "finger-send-send"],
      },
    ],
  },
  {
    name: "Hinge, Knuckles Open & Close Together",
    symbol: "񆲅",
    sections: [
      {
        paragraphs: [
          "The fingers move together in the same direction, as a unit. The knuckle-joints of the fingers open and close (bend up and down) together. This open-close knuckle movement is written with one row of small connected arrows pointing up and down.",
        ],
        slugs: ["finger-goodbye", "finger-why"],
      },
    ],
  },
  {
    name: "Trill, Knuckles Open-Close Alternating",
    symbol: "񆸁",
    sections: [
      {
        paragraphs: [
          "The fingers do not move together in a unit. Instead they hinge in opposite directions. One moves up, as the other moves down. This Alternating Finger Movement, also called Finger Trills, is written with two rows of small arrows pointing up and down.",
        ],
        slugs: ["finger-fingerspell", "finger-typing"],
      },
    ],
  },
];

export function FingerExplorer() {
  return <SymbolExplorer ariaLabel="Finger movement" types={FINGERS} />;
}
