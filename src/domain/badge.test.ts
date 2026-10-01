import { badgeFor, nextBadgeChange } from "./badge";
import { pauseSession, startSession } from "./timer";

const now = Date.UTC(2026, 9, 1, 12);

describe("toolbar badge", () => {
  it("counts whole minutes left, rounded up like the popup", () => {
    const focus = startSession("focus", 25, now, "f");

    expect(badgeFor(focus, now).text).toBe("25");
    expect(badgeFor(focus, now + 60_001).text).toBe("24");
    expect(badgeFor(focus, (now + 25 * 60_000) - 5_000).text).toBe("1");
  });

  it("tells focus, break and pause apart", () => {
    const focus = startSession("focus", 25, now, "f");
    const rest = startSession("break", 5, now, "b");

    expect(badgeFor(focus, now).color).not.toBe(badgeFor(rest, now).color);
    expect(badgeFor(pauseSession(focus, now + 1_000), now + 1_000).text).toBe("II");
    expect(badgeFor({ status: "idle" }, now).text).toBe("");
  });

  it("wakes exactly when the shown minute changes", () => {
    const focus = startSession("focus", 25, now, "f");

    expect(nextBadgeChange(focus, now)).toBe(now + 60_000);
    expect(nextBadgeChange(focus, now + 20_000)).toBe(now + 60_000);
    expect(nextBadgeChange(focus, (now + 25 * 60_000) - 30_000)).toBeNull();
    expect(nextBadgeChange({ status: "idle" }, now)).toBeNull();
  });
});
