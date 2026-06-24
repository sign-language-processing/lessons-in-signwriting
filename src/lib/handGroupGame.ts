import { HAND_GROUPS } from "./handGroups";

export type GroupRound = { symbol: string; answerKey: string };

// Pick a random hand symbol, sampling uniformly over the ten groups (not over
// bases) so a big group like Five Fingers doesn't dominate. answerKey is the
// group name — it matches HANDSHAPE_GROUP_GAME.answers, so the same option chips
// drive both the video and symbol versions of the game.
export function randomGroupSymbol(prevKey?: string): GroupRound {
  let groups = HAND_GROUPS;
  if (prevKey && groups.length > 1) groups = groups.filter((g) => g.name !== prevKey);
  const group = groups[Math.floor(Math.random() * groups.length)]!;
  const base = group.bases[Math.floor(Math.random() * group.bases.length)]!;
  return { symbol: base.symbol, answerKey: group.name };
}
