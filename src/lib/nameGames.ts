export type NameItem = { name: string; symbol?: string; image?: string };

export type NameGame = {
  launchLabel: string;
  launchHint: string;
  title: string;
  prompt: string;
  items: NameItem[];
};

export const PUNCTUATION_GAME: NameGame = {
  launchLabel: "✍️ Name the Punctuation",
  launchHint: "See a punctuation mark and name what it does.",
  title: "Name the Punctuation",
  prompt: "Which punctuation mark is this?",
  items: [
    { name: "Pause (comma)", image: "/figures/ch14/ch14-pause.png" },
    { name: "End of Sentence (period)", image: "/figures/ch14/ch14-end-of-sentence.png" },
    {
      name: "Pause Before End of Phrase (semicolon)",
      image: "/figures/ch14/ch14-pause-before-end-of-phrase.png",
    },
    {
      name: "Questioning Pause (question mark)",
      image: "/figures/ch14/ch14-questioning-pause.png",
    },
    {
      name: "Pause Before Listing (colon)",
      image: "/figures/ch14/ch14-pause-before-listing.png",
    },
    {
      name: "Sub-Phrase (parentheses)",
      image: "/figures/ch14/ch14-pause-sub-phrase.png",
    },
  ],
};

export const DYNAMICS_GAME: NameGame = {
  launchLabel: "✍️ Name the Movement Quality",
  launchHint: "See a dynamics symbol and name the quality of movement it marks.",
  title: "Name the Movement Quality",
  prompt: "Which quality of movement does this symbol mark?",
  items: [
    { name: "Slow", image: "/figures/ch13/ch13-move-slow.png" },
    { name: "Smooth", image: "/figures/ch13/ch13-move-smooth.png" },
    { name: "Fast", image: "/figures/ch13/ch13-move-fast.png" },
    { name: "Tense", image: "/figures/ch13/ch13-move-tense.png" },
    { name: "Relaxed", image: "/figures/ch13/ch13-move-relaxed.png" },
  ],
};

export function nameOptions(game: NameGame): string[] {
  return [...new Set(game.items.map((i) => i.name))];
}

export function randomItem(game: NameGame, exclude?: NameItem): NameItem {
  let items = game.items;
  if (exclude && items.length > 1) items = items.filter((i) => i !== exclude);
  return items[Math.floor(Math.random() * items.length)]!;
}
