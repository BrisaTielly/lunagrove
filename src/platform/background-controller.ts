import { finishDueSession, nextBreakMinutes, startBreakIfAutomatic } from "../domain/completion";
import { pauseSession, resumeSession, startSession } from "../domain/timer";
import type { AppStateV1, SessionKind } from "../domain/types";
import { sessionIdFromAlarm } from "./alarms";

export interface BackgroundDependencies {
  load: () => Promise<AppStateV1>;
  save: (state: AppStateV1) => Promise<void>;
  notify: (kind: SessionKind) => Promise<void>;
  chime: (kind: SessionKind) => Promise<void>;
  schedule: (sessionId: string, endsAt: number) => Promise<void>;
  clear: (sessionId: string) => Promise<void>;
  createSessionId: () => string;
  now: () => number;
}

export type ReconcileDependencies = BackgroundDependencies;

async function finishAndNotify(
  state: AppStateV1,
  dependencies: BackgroundDependencies,
): Promise<boolean> {
  const now = dependencies.now();
  const finished = finishDueSession(state, now);
  if (!finished || finished.timer.status !== "completed") return false;
  const { kind } = finished.timer;

  const nextState = startBreakIfAutomatic(finished, now, dependencies.createSessionId());
  await dependencies.save(nextState);
  if (nextState.timer.status === "running") {
    await dependencies.schedule(nextState.timer.sessionId, nextState.timer.endsAt);
  }

  // Neither a denied notification nor a blocked chime may undo earned progress.
  if (state.preferences.notificationsEnabled) {
    await dependencies.notify(kind).catch(() => undefined);
  }
  if (state.preferences.soundEnabled) {
    await dependencies.chime(kind).catch(() => undefined);
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

// The keyboard shortcut does what the popup's main button would do.
export async function toggleTimer(dependencies: BackgroundDependencies): Promise<AppStateV1["timer"]["status"]> {
  const state = await dependencies.load();
  const now = dependencies.now();
  const { timer } = state;

  if (timer.status === "running") {
    await dependencies.save({ ...state, timer: pauseSession(timer, now) });
    await dependencies.clear(timer.sessionId);
    return "paused";
  }

  const next =
    timer.status === "paused"
      ? resumeSession(timer, now)
      : timer.status === "completed" && timer.kind === "focus"
        ? startSession("break", nextBreakMinutes(state), now, dependencies.createSessionId())
        : startSession("focus", state.preferences.focusMinutes, now, dependencies.createSessionId());
  await dependencies.save({ ...state, timer: next });
  if (next.status === "running") await dependencies.schedule(next.sessionId, next.endsAt);
  return "running";
}
