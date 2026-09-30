import { SANCTUARY_STAGES } from "./stages";

describe("sanctuary stages", () => {
  it("defines the dormant state plus twenty restorations", () => {
    expect(SANCTUARY_STAGES).toHaveLength(21);
    expect(SANCTUARY_STAGES.map((stage) => stage.stage)).toEqual(
      Array.from({ length: 21 }, (_, index) => index),
    );
  });

  it("keeps every previous restoration visible", () => {
    for (let stage = 1; stage < SANCTUARY_STAGES.length; stage += 1) {
      const previous = SANCTUARY_STAGES[stage - 1].visibleLayers;
      const current = SANCTUARY_STAGES[stage].visibleLayers;

      expect(current.length).toBeGreaterThan(previous.length);
      expect(current).toEqual(expect.arrayContaining(previous));
    }
  });

  it("gives every restoration its own reveal message", () => {
    const messages = SANCTUARY_STAGES.slice(1).map((stage) => stage.message);

    expect(new Set(messages).size).toBe(20);
  });
});
