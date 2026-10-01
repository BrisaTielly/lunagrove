import { GARDENS } from "./gardens";
import { placeGardenLumi, wanderRoute } from "./GardenLumi";

const moon = GARDENS[0].parts;

describe("placeGardenLumi", () => {
  it("waits by the seed bed before anything grows and sits back in a finished garden", () => {
    expect(placeGardenLumi(moon, 0, false, GARDENS[0].spots)).toMatchObject({ pose: "sit", shade: true });
    expect(placeGardenLumi(moon, 20, true).pose).toBe("sit");
  });

  it("waves from the meadow to the visitor who just moved in", () => {
    const frog = moon.find((part) => part.name === "visitor-frog")!;
    const placement = placeGardenLumi(moon, 10, false);

    expect(placement.pose).toBe("wave");
    expect(placement.bottom).toBeGreaterThanOrEqual(430);
    expect(placement.left + 40).toBeLessThanOrEqual(frog.x + 6);
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
    expect(placeGardenLumi(moon, 15, false).bottom).toBeGreaterThanOrEqual(430);
  });

  it("strolls the meadow and keeps coming back to the newest piece", () => {
    const main = placeGardenLumi(moon, 3, false);
    const route = wanderRoute(main);

    expect(route.filter((spot) => spot === main)).toHaveLength(3);
    expect(new Set(route.map((spot) => spot.left)).size).toBeGreaterThan(2);
  });
});

describe("Lumi's resting places", () => {
  it("strolls between the garden's own spots, coming back to the newest piece", () => {
    const spots = GARDENS[1].spots;
    const main = placeGardenLumi(GARDENS[1].parts, 3, false, spots);
    const route = wanderRoute(main, spots);

    expect(route.filter((spot) => spot === main)).toHaveLength(3);
    for (const stop of route.filter((spot) => spot !== main)) {
      expect(spots.some((spot) => spot.left === stop.left && spot.bottom === stop.bottom)).toBe(true);
    }
  });
});
