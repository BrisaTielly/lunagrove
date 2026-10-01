import { activeSeason, hemisphereFor, seasonFor } from "./seasons";

describe("seasons", () => {
  it("knows which side of the equator a time zone is on", () => {
    expect(hemisphereFor("America/Sao_Paulo")).toBe("south");
    expect(hemisphereFor("America/Argentina/Buenos_Aires")).toBe("south");
    expect(hemisphereFor("Australia/Sydney")).toBe("south");
    expect(hemisphereFor("Europe/Lisbon")).toBe("north");
    expect(hemisphereFor("America/New_York")).toBe("north");
  });

  it("follows the calendar, flipped in the south", () => {
    const october = new Date(2026, 9, 1);
    expect(seasonFor(october, "north")).toBe("autumn");
    expect(seasonFor(october, "south")).toBe("spring");
    expect(seasonFor(new Date(2026, 0, 15), "north")).toBe("winter");
    expect(seasonFor(new Date(2026, 6, 15), "south")).toBe("winter");
  });

  it("respects the preference", () => {
    const october = new Date(2026, 9, 1);
    expect(activeSeason("auto", october, "America/Sao_Paulo")).toBe("spring");
    expect(activeSeason("north", october, "America/Sao_Paulo")).toBe("autumn");
    expect(activeSeason("off", october, "America/Sao_Paulo")).toBeNull();
  });
});
