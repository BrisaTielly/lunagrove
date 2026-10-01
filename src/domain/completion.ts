import { completeSession, startSession } from "./timer";
import type { AppStateV1 } from "./types";

export function localDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Completes a running session whose time is up, crediting focus stats once.
export function finishDueSession(state: AppStateV1, now: number): AppStateV1 | null {
  if (state.timer.status !== "running") return null;

  const result = completeSession(state.timer, now, state.completedSessionIds);
  if (!result.didComplete || result.timer.status !== "completed") return null;

  let stats = state.stats;
  if (result.timer.kind === "focus") {
    const day = localDateKey(now);
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

  return {
    ...state,
    timer: result.timer,
    completedSessionIds: result.completedSessionIds,
    stats,
  };
}

// Every `longBreakEvery`-th focus earns the long break.
export function isLongBreakNext(state: AppStateV1): boolean {
  const { totalFocusSessions } = state.stats;
  return totalFocusSessions > 0 && totalFocusSessions % state.preferences.longBreakEvery === 0;
}

export function nextBreakMinutes(state: AppStateV1): number {
  return isLongBreakNext(state) ? state.preferences.longBreakMinutes : state.preferences.breakMinutes;
}

// With auto-start on, a finished focus rolls straight into its break.
export function startBreakIfAutomatic(state: AppStateV1, now: number, sessionId: string): AppStateV1 {
  if (!state.preferences.autoStartBreaks) return state;
  if (state.timer.status !== "completed" || state.timer.kind !== "focus") return state;
  return { ...state, timer: startSession("break", nextBreakMinutes(state), now, sessionId) };
}
