import { SymbolExplorer, type ExplorerType } from "./SymbolExplorer";

const CONTACTS: ExplorerType[] = [
  {
    name: "Touch",
    symbol: "񆇡",
    sections: [
      {
        paragraphs: [
          "Touch Contact is written with an asterisk.",
          "Touch is defined as the hand gently contacting another part of the body.",
        ],
        slugs: ["more", "school", "dating", "deaf"],
      },
    ],
  },
  {
    name: "Grasp",
    symbol: "񆌁",
    sections: [
      {
        paragraphs: [
          "Grasp Contact is written with two crossed lines.",
          "Grasp is defined as the hand grasping or pinching a part of the body or a prop, such as clothing.",
        ],
        slugs: ["grasp-earring", "grasp-congratulations"],
      },
    ],
  },
  {
    name: "Between",
    symbol: "񆊡",
    sections: [
      {
        paragraphs: [
          "Between Contact is written with a Contact Symbol between two lines.",
          "Between is defined as contacting between two fingers or other parts of the body.",
        ],
        slugs: ["between-disappear", "between-america"],
      },
    ],
  },
  {
    name: "Strike",
    symbol: "񆐡",
    sections: [
      {
        paragraphs: [
          "Strike Contact is written with two lines crossing two lines.",
          "Strike is defined as the hand contacting a surface with force.",
        ],
        slugs: ["strike-hit", "strike-clap"],
      },
    ],
  },
  {
    name: "Brush",
    symbol: "񆕁",
    sections: [
      {
        paragraphs: [
          "Brush Contact is written with a circle with a dark dot in the center.",
          "Brush is defined as movement that first contacts and then moves OFF the surface.",
        ],
        slugs: ["brush-excuse-me", "brush-monthly", "brush-easy"],
      },
    ],
  },
  {
    name: "Rub",
    symbol: "񆙡",
    sections: [
      {
        title: "Circular Rub",
        paragraphs: [
          "Circular Rub Contact is written with a spiral.",
          "Rub is defined as contact that moves, but stays ON the surface.",
        ],
        slugs: ["circular-coffee", "circular-chocolate"],
      },
      {
        title: "Straight Rub",
        paragraphs: [
          "Straight Rub Contact is written with the same spiral symbol, but the spiral symbol is connected with a straight arrow.",
          "When the Rub Contact symbol is connected with an arrow, it rubs in a straight line (not in a circle). It stays ON the surface but moves in the direction of the arrow.",
        ],
        slugs: ["straight-nice", "straight-eager"],
      },
      {
        paragraphs: [],
        slugs: ["rub-temperature"],
      },
    ],
  },
];

export function ContactExplorer() {
  return <SymbolExplorer ariaLabel="Contact symbol" types={CONTACTS} />;
}
