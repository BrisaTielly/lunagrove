import { getProgression } from "./progression";

describe("progression", () => {
  it.each([
    [0, 0],
    [1, 1],
    [10, 10],
    [20, 20],
    [42, 20],
  ])("maps %i completed sessions to stage %i", (sessions, stage) => {
    expect(getProgression(sessions).stage).toBe(stage);
  });

  it("unlocks deterministic ambience after the sanctuary is complete", () => {
    expect(getProgression(21).ambientEffect).toBe("shooting-star");
    expect(getProgression(25).ambientEffect).toBe("shooting-star");
  });

  it("never returns progress outside the valid range", () => {
    expect(getProgression(-5)).toEqual({ stage: 0, ambientEffect: null });
  });
});
