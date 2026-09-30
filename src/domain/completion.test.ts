import { finishDueSession, localDateKey } from "./completion";
import { DEFAULT_STATE } from "./defaults";
import { startSession } from "./timer";

describe("finishDueSession", () => {
  it("files a late-night focus under the local calendar day", () => {
    const lateNight = new Date(2026, 8, 30, 23, 30).getTime();
    const state = {
      ...structuredClone(DEFAULT_STATE),
      timer: startSession("focus", 25, lateNight - 25 * 60_000, "late"),
    };

    const next = finishDueSession(state, lateNight);

    expect(Object.keys(next?.stats.byDay ?? {})).toEqual(["2026-09-30"]);
    expect(localDateKey(new Date(2026, 9, 1, 0, 10).getTime())).toBe("2026-10-01");
  });

  it("leaves a session that is still running alone", () => {
    const now = Date.UTC(2026, 8, 30, 12);
    const state = { ...structuredClone(DEFAULT_STATE), timer: startSession("focus", 25, now, "running") };

    expect(finishDueSession(state, now + 60_000)).toBeNull();
  });

  it("completes a break without crediting focus time", () => {
    const now = Date.UTC(2026, 8, 30, 12);
    const state = { ...structuredClone(DEFAULT_STATE), timer: startSession("break", 5, now, "rest") };

    const next = finishDueSession(state, now + 5 * 60_000);

    expect(next?.timer).toMatchObject({ status: "completed", kind: "break" });
    expect(next?.stats.totalFocusSessions).toBe(0);
  });
});
