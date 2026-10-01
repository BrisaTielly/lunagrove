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
    expect(pendingCelebration(stateWith(3, 2))).toEqual({ stage: 3, unlock: "Moon flower", completedChapter: null, visitor: null, newGarden: null, newSeason: null });
    expect(pendingCelebration(stateWith(3, 3))).toBeNull();
  });

  it("marks the end of a chapter and the visitor who moves in", () => {
    expect(pendingCelebration(stateWith(10, 9))).toMatchObject({ completedChapter: "pond", visitor: "a frog" });
    expect(pendingCelebration(stateWith(20, 19))?.visitor).toBe("a moon fox");
  });

  it("stays quiet before the first focus and once every garden is done", () => {
    expect(pendingCelebration(stateWith(0, 0))).toBeNull();
    expect(pendingCelebration(stateWith(52, 40))).toBeNull();
  });

  it("announces the second garden on the 21st focus", () => {
    expect(pendingCelebration(stateWith(21, 20))).toMatchObject({ stage: 21, unlock: "Moss patch", newGarden: "Mushroom Hollow" });
    expect(pendingCelebration(stateWith(30, 29))).toMatchObject({ completedChapter: "pond", visitor: "a hedgehog" });
  });

  it("shows only the latest piece after several focus sessions", () => {
    expect(pendingCelebration(stateWith(7, 4))?.unlock).toBe("Lily pad");
  });

  it("announces the new season when the garden turns one", () => {
    expect(pendingCelebration(stateWith(6, 5))?.newSeason).toBe("summer");
    expect(pendingCelebration(stateWith(16, 15))?.newSeason).toBe("winter");
    expect(pendingCelebration(stateWith(7, 6))?.newSeason).toBeNull();

    const calendar = stateWith(6, 5);
    calendar.preferences.seasons = "auto";
    expect(pendingCelebration(calendar)?.newSeason).toBeNull();
  });
});
