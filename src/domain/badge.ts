import type { TimerState } from "./types";

export interface Badge {
  text: string;
  color: string;
}

const MINUTE = 60_000;
const COLORS = { focus: "#ef806f", break: "#aaa0d2", paused: "#5b5586" };

// Whole minutes left, rounded up, the way the popup shows them ("18" until 17:00).
export function badgeFor(timer: TimerState, now: number): Badge {
  if (timer.status === "running") {
    const minutes = Math.max(1, Math.ceil((timer.endsAt - now) / MINUTE));
    return { text: String(minutes), color: COLORS[timer.kind] };
  }
  if (timer.status === "paused") return { text: "II", color: COLORS.paused };
  return { text: "", color: COLORS.focus };
}

// When the badge's minute next changes, or null when nothing is counting down.
export function nextBadgeChange(timer: TimerState, now: number): number | null {
  if (timer.status !== "running") return null;
  const remaining = timer.endsAt - now;
  if (remaining <= MINUTE) return null;
  return now + (remaining % MINUTE || MINUTE);
}
