import { PLAY_CHIME_MESSAGE, RING_MESSAGE, isChimeMessage } from "./sound";

describe("chime messages", () => {
  it("accepts only well-formed messages of the expected type", () => {
    expect(isChimeMessage({ type: RING_MESSAGE, kind: "focus" }, RING_MESSAGE)).toBe(true);
    expect(isChimeMessage({ type: RING_MESSAGE, kind: "focus" }, PLAY_CHIME_MESSAGE)).toBe(false);
    expect(isChimeMessage({ type: RING_MESSAGE, kind: "nap" }, RING_MESSAGE)).toBe(false);
    expect(isChimeMessage(null, RING_MESSAGE)).toBe(false);
  });
});
