import {
  cancelSession,
  completeSession,
  pauseSession,
  remainingMs,
  resumeSession,
  startSession,
} from "./timer";

describe("timer domain", () => {
  const now = Date.UTC(2026, 8, 30, 12);

  it("starts a focus session from an absolute end time", () => {
    const timer = startSession("focus", 25, now, "focus-1");

    expect(timer).toMatchObject({
      status: "running",
      kind: "focus",
      sessionId: "focus-1",
      startedAt: now,
      endsAt: now + 25 * 60_000,
    });
    expect(remainingMs(timer, now + 60_000)).toBe(24 * 60_000);
  });

  it("pauses and resumes without counting time spent paused", () => {
    const running = startSession("focus", 25, now, "focus-1");
    const paused = pauseSession(running, now + 5 * 60_000);
    const resumed = resumeSession(paused, now + 15 * 60_000);

    expect(paused).toMatchObject({ status: "paused", remainingMs: 20 * 60_000 });
    expect(resumed).toMatchObject({
      status: "running",
      endsAt: now + 35 * 60_000,
    });
  });

  it("cancels without creating a completion", () => {
    const running = startSession("focus", 25, now, "focus-1");

    expect(cancelSession(running)).toEqual({ status: "idle" });
  });

  it("completes an elapsed session exactly once", () => {
    const running = startSession("focus", 25, now, "focus-1");
    const first = completeSession(running, now + 25 * 60_000, []);
    const duplicate = completeSession(
      first.timer,
      now + 26 * 60_000,
      first.completedSessionIds,
    );

    expect(first.didComplete).toBe(true);
    expect(first.timer.status).toBe("completed");
    expect(first.completedSessionIds).toEqual(["focus-1"]);
    expect(duplicate.didComplete).toBe(false);
    expect(duplicate.completedSessionIds).toEqual(["focus-1"]);
  });

  it("does not complete a running session early", () => {
    const running = startSession("focus", 25, now, "focus-1");
    const result = completeSession(running, now + 24 * 60_000, []);

    expect(result.didComplete).toBe(false);
    expect(result.timer).toBe(running);
  });
});
