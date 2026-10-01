import { journey } from "./gardens";

describe("journey", () => {
  it("grows the first garden, then the second", () => {
    expect(journey(0)).toMatchObject({ garden: 0, stage: 0 });
    expect(journey(20)).toMatchObject({ garden: 0, stage: 20 });
    expect(journey(21)).toMatchObject({ garden: 1, stage: 1 });
    expect(journey(40)).toMatchObject({ garden: 1, stage: 20, complete: true });
    expect(journey(57)).toMatchObject({ garden: 1, stage: 20, steps: 40 });
  });
});
