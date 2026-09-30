import { DEFAULT_STATE } from "./domain/defaults";
import { startSession } from "./domain/timer";
import type { AppStateV1 } from "./domain/types";
import { handleTimerAlarm, reconcileTimer } from "./platform/background-controller";

describe("background timer completion", () => {
  const startedAt = Date.UTC(2026, 8, 30, 12);
  const endsAt = startedAt + 25 * 60_000;

  function harness(notificationFails = false, soundEnabled = false) {
    let state: AppStateV1 = {
      ...structuredClone(DEFAULT_STATE),
      timer: startSession("focus", 25, startedAt, "session-1"),
    };
    state.preferences.soundEnabled = soundEnabled;
    const save = vi.fn(async (next: AppStateV1) => {
      state = next;
    });
    const notify = vi.fn(async () => {
      if (notificationFails) throw new Error("Notifications denied");
    });
    const chime = vi.fn(async () => {
      if (notificationFails) throw new Error("Audio blocked");
    });

    return {
      getState: () => state,
      dependencies: {
        load: async () => state,
        save,
        notify,
        chime,
        now: () => endsAt,
      },
      save,
      notify,
      chime,
    };
  }

  it("awards a focus session only once when an alarm repeats", async () => {
    const context = harness();

    await handleTimerAlarm("timer:session-1", context.dependencies);
    await handleTimerAlarm("timer:session-1", context.dependencies);

    expect(context.getState().stats.totalFocusSessions).toBe(1);
    expect(context.getState().stats.totalFocusMinutes).toBe(25);
    expect(context.getState().completedSessionIds).toEqual(["session-1"]);
    expect(context.notify).toHaveBeenCalledTimes(1);
  });

  it("saves completion even when a notification cannot be shown", async () => {
    const context = harness(true);

    await expect(
      handleTimerAlarm("timer:session-1", context.dependencies),
    ).resolves.toBe(true);

    expect(context.save).toHaveBeenCalledOnce();
    expect(context.getState().stats.totalFocusSessions).toBe(1);
  });

  it("rings the chime only when sounds are on", async () => {
    const quiet = harness();
    await handleTimerAlarm("timer:session-1", quiet.dependencies);
    expect(quiet.chime).not.toHaveBeenCalled();

    const loud = harness(false, true);
    await handleTimerAlarm("timer:session-1", loud.dependencies);
    expect(loud.chime).toHaveBeenCalledWith("focus");
  });

  it("keeps progress when both the notification and the chime fail", async () => {
    const context = harness(true, true);

    await expect(handleTimerAlarm("timer:session-1", context.dependencies)).resolves.toBe(true);
    expect(context.getState().stats.totalFocusSessions).toBe(1);
  });

  it("ignores unrelated alarms", async () => {
    const context = harness();

    await expect(handleTimerAlarm("something-else", context.dependencies)).resolves.toBe(
      false,
    );
    expect(context.save).not.toHaveBeenCalled();
  });

  describe("after a browser restart", () => {
    function restartHarness(now: number) {
      const context = harness();
      const schedule = vi.fn(async () => undefined);
      return { ...context, schedule, dependencies: { ...context.dependencies, now: () => now, schedule } };
    }

    it("completes a focus whose alarm was lost while Chrome was closed", async () => {
      const context = restartHarness(endsAt + 10 * 60_000);

      await expect(reconcileTimer(context.dependencies)).resolves.toBe("completed");

      expect(context.getState().timer).toMatchObject({ status: "completed", kind: "focus" });
      expect(context.getState().stats.totalFocusSessions).toBe(1);
      expect(context.notify).toHaveBeenCalledOnce();
      expect(context.schedule).not.toHaveBeenCalled();
    });

    it("re-arms the alarm of a focus that is still running", async () => {
      const context = restartHarness(endsAt - 60_000);

      await expect(reconcileTimer(context.dependencies)).resolves.toBe("rescheduled");

      expect(context.schedule).toHaveBeenCalledWith("session-1", endsAt);
      expect(context.save).not.toHaveBeenCalled();
    });

    it("does not credit the same focus twice if the alarm also fires", async () => {
      const context = restartHarness(endsAt + 1);

      await reconcileTimer(context.dependencies);
      await handleTimerAlarm("timer:session-1", context.dependencies);

      expect(context.getState().stats.totalFocusSessions).toBe(1);
    });
  });
});
