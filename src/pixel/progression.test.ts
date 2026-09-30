import { pixelProgress } from "./progression";

describe("pixelProgress", () => {
  it.each([
    [-4, 0, "sprout", 0],
    [0, 0, "sprout", 0],
    [1, 1, "sprout", 1],
    [5, 5, "sprout", 5],
    [6, 6, "pond", 6],
    [10, 10, "pond", 10],
    [11, 11, "bridge", 11],
    [15, 15, "bridge", 15],
    [16, 16, "shrine", 16],
    [20, 20, "shrine", 20],
    [37, 20, "shrine", 20],
  ] as const)(
    "maps %i sessions to stage %i in the %s chapter",
    (sessions, stage, chapter, filledPips) => {
      expect(pixelProgress(sessions)).toMatchObject({
        stage,
        chapter,
        mapTile: stage,
        filledPips,
      });
    },
  );

  it("unlocks one permanent garden detail per completed focus", () => {
    const stages = Array.from({ length: 21 }, (_, stage) => pixelProgress(stage));

    stages.forEach((progress, stage) => {
      expect(progress.unlocks).toHaveLength(stage);
      if (stage > 0) {
        expect(progress.unlocks.slice(0, -1)).toEqual(stages[stage - 1].unlocks);
      }
    });

    expect(stages[5].unlocks.at(-1)).toBe("garden-patch");
    expect(stages[10].unlocks.at(-1)).toBe("moon-reflection");
    expect(stages[15].unlocks.at(-1)).toBe("moon-gate");
    expect(stages[20].unlocks.at(-1)).toBe("lunar-shrine");
  });
});
