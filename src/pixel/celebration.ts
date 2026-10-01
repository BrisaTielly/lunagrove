import type { AppStateV1 } from "../domain/types";
import { VISITORS } from "./gardenParts";
import { pixelProgress, unlockLabel, type PixelChapter } from "./progression";

export interface Celebration {
  stage: number;
  unlock: string;
  completedChapter: PixelChapter | null;
  visitor: string | null;
}

// The newest garden piece the user has not been shown yet, if any.
export function pendingCelebration(state: AppStateV1): Celebration | null {
  const progress = pixelProgress(state.stats.totalFocusSessions);
  if (progress.stage === 0 || progress.stage <= state.ui.lastCelebratedStage) return null;

  return {
    stage: progress.stage,
    unlock: unlockLabel(progress.unlocks[progress.stage - 1]),
    completedChapter: progress.stage % 5 === 0 ? progress.chapter : null,
    visitor: VISITORS[progress.stage] ?? null,
  };
}
