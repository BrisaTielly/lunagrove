import { finishDueSession, isLongBreakNext, localDateKey, nextBreakMinutes, startBreakIfAutomatic } from "./completion";
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

describe("breaks", () => {
  const now = Date.UTC(2026, 9, 1, 12);

  function afterFocus(totalFocusSessions: number, autoStartBreaks = false) {
    const state = structuredClone(DEFAULT_STATE);
    state.stats.totalFocusSessions = totalFocusSessions;
    state.preferences.autoStartBreaks = autoStartBreaks;
    state.timer = { status: "completed", sessionId: "f", kind: "focus", completedAt: now, durationMs: 25 * 60_000 };
    return state;
  }

  it("gives the long break after every fourth focus", () => {
    expect(nextBreakMinutes(afterFocus(3))).toBe(5);
    expect(nextBreakMinutes(afterFocus(4))).toBe(15);
    expect(isLongBreakNext(afterFocus(8))).toBe(true);
  });

  it("starts the break on its own only when asked to", () => {
    expect(startBreakIfAutomatic(afterFocus(4), now, "b").timer.status).toBe("completed");
    expect(startBreakIfAutomatic(afterFocus(4, true), now, "b").timer).toMatchObject({
      status: "running",
      kind: "break",
      durationMs: 15 * 60_000,
    });
  });
});
