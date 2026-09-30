import type { SessionKind, TimerState } from "./types";

export interface CompletionResult {
  timer: TimerState;
  didComplete: boolean;
  completedSessionIds: string[];
}

export function startSession(
  kind: SessionKind,
  durationMinutes: number,
  now: number,
  sessionId: string,
): TimerState {
  const durationMs = durationMinutes * 60_000;

  return {
    status: "running",
    sessionId,
    kind,
    startedAt: now,
    endsAt: now + durationMs,
    durationMs,
  };
}

export function remainingMs(timer: TimerState, now: number): number {
  if (timer.status === "running") {
    return Math.max(0, timer.endsAt - now);
  }

  if (timer.status === "paused") {
    return timer.remainingMs;
  }

  return 0;
}

export function pauseSession(timer: TimerState, now: number): TimerState {
  if (timer.status !== "running") return timer;

  return {
    status: "paused",
    sessionId: timer.sessionId,
    kind: timer.kind,
    startedAt: timer.startedAt,
    remainingMs: remainingMs(timer, now),
    durationMs: timer.durationMs,
  };
}

export function resumeSession(timer: TimerState, now: number): TimerState {
  if (timer.status !== "paused") return timer;

  return {
    status: "running",
    sessionId: timer.sessionId,
    kind: timer.kind,
    startedAt: timer.startedAt,
    endsAt: now + timer.remainingMs,
    durationMs: timer.durationMs,
  };
}

export function cancelSession(_timer: TimerState): TimerState {
  return { status: "idle" };
}

export function completeSession(
  timer: TimerState,
  now: number,
  completedSessionIds: string[],
): CompletionResult {
  if (
    timer.status !== "running" ||
    now < timer.endsAt ||
    completedSessionIds.includes(timer.sessionId)
  ) {
    return { timer, didComplete: false, completedSessionIds };
  }

  return {
    timer: {
      status: "completed",
      sessionId: timer.sessionId,
      kind: timer.kind,
      completedAt: now,
      durationMs: timer.durationMs,
    },
    didComplete: true,
    completedSessionIds: [...completedSessionIds, timer.sessionId].slice(-100),
  };
}
