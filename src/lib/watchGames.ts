import { convert } from "@sutton-signwriting/core";
import { pickWeighted } from "./gameStats";
import poolsJson from "../content/game-pools.generated.json";

export type WatchAnswer = { key: string; name: string; symbol?: string };

export type WatchGame = {
  id: keyof typeof poolsJson;
  launchLabel: string;
  launchHint: string;
  title: string;
  prompt: string;
  answers: WatchAnswer[];
  /** Fill the two-column option grid top-to-bottom (col 1 then col 2) instead
   *  of left-to-right, so a long ordered set reads down each column. */
  columnOrder?: boolean;
};

const POOLS = poolsJson as Record<string, Record<string, string[]>>;

const groupSymbol = (base: string): string => convert.key2swu(`S${base}00`);

export const CONTACT_GAME: WatchGame = {
  id: "contact",
  launchLabel: "🎬 Spot the Contact",
  launchHint: "Watch a sign and name how the hands make contact.",
  title: "Spot the Contact",
  prompt: "Which kind of contact does this sign use?",
  answers: [
    { key: "Touch", name: "Touch", symbol: "񆇡" },
    { key: "Grasp", name: "Grasp", symbol: "񆌁" },
    { key: "Between", name: "Between", symbol: "񆊡" },
    { key: "Strike", name: "Strike", symbol: "񆐡" },
    { key: "Brush", name: "Brush", symbol: "񆕁" },
    { key: "Rub", name: "Rub", symbol: "񆙡" },
  ],
};

export const HANDSHAPE_GROUP_GAME: WatchGame = {
  id: "handshape-group",
  launchLabel: "🎬 Name the Hand Group",
  launchHint: "Watch a sign and name which of the ten hand groups it uses.",
  title: "Name the Hand Group",
  prompt: "Which group of hands does this sign use?",
  columnOrder: true,
  answers: [
    { key: "Index Finger", name: "Index Finger", symbol: groupSymbol("100") },
    { key: "Index & Middle Fingers", name: "Index & Middle", symbol: groupSymbol("10e") },
    { key: "Index, Middle & Thumb", name: "Index, Middle & Thumb", symbol: groupSymbol("11e") },
    { key: "Four Fingers", name: "Four Fingers", symbol: groupSymbol("144") },
    { key: "Five Fingers", name: "Five Fingers", symbol: groupSymbol("14c") },
    { key: "Baby Finger", name: "Baby Finger", symbol: groupSymbol("186") },
    { key: "Ring Finger", name: "Ring Finger", symbol: groupSymbol("1ab") },
    { key: "Middle Finger", name: "Middle Finger", symbol: groupSymbol("1c4") },
    { key: "Index & Thumb", name: "Index & Thumb", symbol: groupSymbol("1db") },
    { key: "Thumb", name: "Thumb", symbol: groupSymbol("1f5") },
  ],
};

export const MOVEMENT_PLANE_GAME: WatchGame = {
  id: "movement-plane",
  launchLabel: "🎬 Wall or Floor?",
  launchHint: "Watch a sign and tell which plane its movement travels in.",
  title: "Wall or Floor Plane?",
  prompt: "Which plane does the movement travel in?",
  answers: [
    { key: "Wall Plane", name: "Wall Plane (up/down/side)" },
    { key: "Floor Plane", name: "Floor Plane (forward/back)" },
  ],
};

export const MOVEMENT_FAMILY_GAME: WatchGame = {
  id: "movement-family",
  launchLabel: "🎬 Name the Movement",
  launchHint: "Watch a sign and name the kind of movement path it draws.",
  title: "Name the Movement",
  prompt: "What kind of movement does this sign use?",
  answers: [
    { key: "Straight", name: "Straight" },
    { key: "Curve", name: "Curved" },
    { key: "Rotation", name: "Rotation" },
    { key: "Circle", name: "Circular" },
  ],
};

export function poolFor(game: WatchGame, key: string): string[] {
  return POOLS[game.id]?.[key] ?? [];
}

export function answersWithClips(game: WatchGame): WatchAnswer[] {
  return game.answers.filter((a) => poolFor(game, a.key).length > 0);
}

export function randomAnswerKey(game: WatchGame, exclude?: string): string {
  let keys = answersWithClips(game).map((a) => a.key);
  if (exclude && keys.length > 1) keys = keys.filter((k) => k !== exclude);
  return pickWeighted(`watch:${game.id}`, keys);
}

export function randomClip(game: WatchGame, key: string, exclude?: string): string {
  const pool = poolFor(game, key);
  const choices = exclude && pool.length > 1 ? pool.filter((c) => c !== exclude) : pool;
  return choices[Math.floor(Math.random() * choices.length)]!;
}
