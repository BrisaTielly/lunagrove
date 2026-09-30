import { DEFAULT_STATE } from "./domain/defaults";
import { startSession } from "./domain/timer";
import type { AppStateV1 } from "./domain/types";
import { handleTimerAlarm } from "./platform/background-controller";

describe("background timer completion", () => {
  const startedAt = Date.UTC(2026, 8, 30, 12);
  const endsAt = startedAt + 25 * 60_000;

  function harness(notificationFails = false) {
    let state: AppStateV1 = {
      ...structuredClone(DEFAULT_STATE),
      timer: startSession("focus", 25, startedAt, "session-1"),
    };
    const save = vi.fn(async (next: AppStateV1) => {
      state = next;
    });
    const notify = vi.fn(async () => {
      if (notificationFails) throw new Error("Notifications denied");
    });

    return {
      getState: () => state,
      dependencies: {
        load: async () => state,
        save,
        notify,
        now: () => endsAt,
      },
      save,
      notify,
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

  it("ignores unrelated alarms", async () => {
    const context = harness();

    await expect(handleTimerAlarm("something-else", context.dependencies)).resolves.toBe(
      false,
    );
    expect(context.save).not.toHaveBeenCalled();
  });
});
