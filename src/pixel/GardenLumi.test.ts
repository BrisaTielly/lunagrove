import { GARDENS } from "./gardens";
import { placeGardenLumi } from "./GardenLumi";

const moon = GARDENS[0].parts;

describe("placeGardenLumi", () => {
  it("waits by the seed bed before anything grows and sits back in a finished garden", () => {
    expect(placeGardenLumi(moon, 0, false).pose).toBe("stand");
    expect(placeGardenLumi(moon, 20, true).pose).toBe("sit");
  });

  it("waves to the visitor who just moved in, standing next to them", () => {
    const frog = moon.find((part) => part.name === "visitor-frog")!;
    const placement = placeGardenLumi(moon, 10, false);

    expect(placement.pose).toBe("wave");
    expect(Math.abs(placement.bottom - (frog.y + frog.height + 2))).toBeLessThanOrEqual(1);
  });

  it("admires the newest piece and stays inside the scene", () => {
    for (let stage = 1; stage <= 20; stage += 1) {
      const placement = placeGardenLumi(moon, stage, false);
      expect(placement.left).toBeGreaterThanOrEqual(16);
      expect(placement.left).toBeLessThanOrEqual(483);
      expect(placement.bottom).toBeLessThanOrEqual(532);
    }
    expect(placeGardenLumi(moon, 3, false).pose).toBe("sniff");
  });

  it("waves from the meadow to a visitor up in the trees", () => {
    expect(placeGardenLumi(moon, 15, false).bottom).toBeGreaterThanOrEqual(400);
  });
});
