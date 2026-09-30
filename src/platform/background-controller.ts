import { completeSession } from "../domain/timer";
import type { AppStateV1, SessionKind } from "../domain/types";
import { sessionIdFromAlarm } from "./alarms";

export interface BackgroundDependencies {
  load: () => Promise<AppStateV1>;
  save: (state: AppStateV1) => Promise<void>;
  notify: (kind: SessionKind) => Promise<void>;
  now: () => number;
}

function dateKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export async function handleTimerAlarm(
  alarmName: string,
  dependencies: BackgroundDependencies,
): Promise<boolean> {
  const sessionId = sessionIdFromAlarm(alarmName);
  if (!sessionId) return false;

  const state = await dependencies.load();
  if (state.timer.status !== "running" || state.timer.sessionId !== sessionId) {
    return false;
  }

  const now = dependencies.now();
  const result = completeSession(state.timer, now, state.completedSessionIds);
  if (!result.didComplete || result.timer.status !== "completed") return false;

  let stats = state.stats;
  if (result.timer.kind === "focus") {
    const day = dateKey(now);
    const minutes = Math.round(result.timer.durationMs / 60_000);
    const currentDay = stats.byDay[day] ?? { sessions: 0, minutes: 0 };
    stats = {
      totalFocusSessions: stats.totalFocusSessions + 1,
      totalFocusMinutes: stats.totalFocusMinutes + minutes,
      byDay: {
        ...stats.byDay,
        [day]: {
          sessions: currentDay.sessions + 1,
          minutes: currentDay.minutes + minutes,
        },
      },
    };
  }

  const nextState: AppStateV1 = {
    ...state,
    timer: result.timer,
    completedSessionIds: result.completedSessionIds,
    stats,
  };

  await dependencies.save(nextState);

  if (state.preferences.notificationsEnabled) {
    try {
      await dependencies.notify(result.timer.kind);
    } catch {
      // Notification permission or platform support must not undo earned progress.
    }
  }

  return true;
}
