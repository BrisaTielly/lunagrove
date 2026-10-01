import { DEFAULT_STATE } from "../domain/defaults";
import type { AppStateV1 } from "../domain/types";
import { pendingCelebration } from "./celebration";

function stateWith(totalFocusSessions: number, lastCelebratedStage: number): AppStateV1 {
  const state = structuredClone(DEFAULT_STATE);
  state.stats.totalFocusSessions = totalFocusSessions;
  state.ui.lastCelebratedStage = lastCelebratedStage;
  return state;
}

describe("pendingCelebration", () => {
  it("celebrates the newest piece once", () => {
    expect(pendingCelebration(stateWith(3, 2))).toEqual({ stage: 3, unlock: "Moon flower", completedChapter: null });
    expect(pendingCelebration(stateWith(3, 3))).toBeNull();
  });

  it("marks the end of a chapter", () => {
    expect(pendingCelebration(stateWith(10, 9))?.completedChapter).toBe("pond");
  });

  it("stays quiet before the first focus and past the twentieth", () => {
    expect(pendingCelebration(stateWith(0, 0))).toBeNull();
    expect(pendingCelebration(stateWith(27, 20))).toBeNull();
  });

  it("shows only the latest piece after several focus sessions", () => {
    expect(pendingCelebration(stateWith(7, 4))?.unlock).toBe("Lily pad");
  });
});
