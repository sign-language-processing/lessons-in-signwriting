import { HAND_GROUPS } from "./handGroups";
import { pickWeighted } from "./gameStats";

export type GroupRound = { symbol: string; answerKey: string };

// Pick a random hand symbol, sampling uniformly over the ten groups (not over
// bases) so a big group like Five Fingers doesn't dominate. answerKey is the
// group name — it matches HANDSHAPE_GROUP_GAME.answers, so the same option chips
// drive both the video and symbol versions of the game.
export function randomGroupSymbol(prevKey?: string): GroupRound {
  let names = HAND_GROUPS.map((g) => g.name);
  if (prevKey && names.length > 1) names = names.filter((n) => n !== prevKey);
  const chosen = pickWeighted("handgroup-symbol", names);
  const group = HAND_GROUPS.find((g) => g.name === chosen)!;
  const base = group.bases[Math.floor(Math.random() * group.bases.length)]!;
  return { symbol: base.symbol, answerKey: group.name };
}
