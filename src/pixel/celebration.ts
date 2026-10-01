import type { AppStateV1 } from "../domain/types";
import { GARDENS, journey } from "./gardens";
import { pixelProgress, unlockLabel, type PixelChapter } from "./progression";

export interface Celebration {
  // Journey step being celebrated (1–40); stored once shown.
  stage: number;
  unlock: string;
  completedChapter: PixelChapter | null;
  visitor: string | null;
  // Set when this focus opened a new garden.
  newGarden?: string | null;
}

// The newest garden piece the user has not been shown yet, if any.
export function pendingCelebration(state: AppStateV1): Celebration | null {
  const current = journey(state.stats.totalFocusSessions);
  if (current.steps === 0 || current.steps <= state.ui.lastCelebratedStage) return null;

  const garden = GARDENS[current.garden];
  return {
    stage: current.steps,
    unlock: unlockLabel(garden.unlocks[current.stage - 1]),
    completedChapter: current.stage % 5 === 0 ? pixelProgress(current.stage).chapter : null,
    visitor: garden.visitors[current.stage] ?? null,
    newGarden: current.stage === 1 && current.garden > 0 ? garden.title : null,
  };
}
