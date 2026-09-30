import { finishDueSession } from "../domain/completion";
import type { AppStateV1, SessionKind } from "../domain/types";
import { sessionIdFromAlarm } from "./alarms";

export interface BackgroundDependencies {
  load: () => Promise<AppStateV1>;
  save: (state: AppStateV1) => Promise<void>;
  notify: (kind: SessionKind) => Promise<void>;
  now: () => number;
}

export interface ReconcileDependencies extends BackgroundDependencies {
  schedule: (sessionId: string, endsAt: number) => Promise<void>;
}

async function finishAndNotify(
  state: AppStateV1,
  dependencies: BackgroundDependencies,
): Promise<boolean> {
  const nextState = finishDueSession(state, dependencies.now());
  if (!nextState || nextState.timer.status !== "completed") return false;

  await dependencies.save(nextState);

  if (state.preferences.notificationsEnabled) {
    try {
      await dependencies.notify(nextState.timer.kind);
    } catch {
      // Notification permission or platform support must not undo earned progress.
    }
  }

  return true;
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

  return finishAndNotify(state, dependencies);
}

// Chrome may drop alarms on restart: finish sessions that ended meanwhile and
// re-arm the alarm of one still running.
export async function reconcileTimer(
  dependencies: ReconcileDependencies,
): Promise<"completed" | "rescheduled" | "idle"> {
  const state = await dependencies.load();
  if (state.timer.status !== "running") return "idle";

  if (state.timer.endsAt <= dependencies.now()) {
    return (await finishAndNotify(state, dependencies)) ? "completed" : "idle";
  }

  await dependencies.schedule(state.timer.sessionId, state.timer.endsAt);
  return "rescheduled";
}
