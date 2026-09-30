import type { TimerState } from "../../domain/types";

interface TimerControlsProps {
  timer: TimerState;
  timeLeftMs: number;
  focusMinutes: number;
  onStartFocus: () => void;
  onStartBreak: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

function formatTime(timeMs: number, fallbackMinutes: number): string {
  const totalSeconds = Math.ceil((timeMs || fallbackMinutes * 60_000) / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TimerControls({
  timer,
  timeLeftMs,
  focusMinutes,
  onStartFocus,
  onStartBreak,
  onPause,
  onResume,
  onCancel,
}: TimerControlsProps) {
  const isActive = timer.status === "running" || timer.status === "paused";
  const kind = isActive || timer.status === "completed" ? timer.kind : "focus";
  const fallbackMinutes = timer.status === "idle" ? focusMinutes : 0;
  const label =
    timer.status === "running"
      ? kind === "focus"
        ? "Focusing"
        : "Resting"
      : timer.status === "paused"
        ? "Paused"
        : timer.status === "completed"
          ? kind === "focus"
            ? "Focus complete"
            : "Break complete"
          : "Ready for focus";

  const time =
    timer.status === "completed" ? "00:00" : formatTime(timeLeftMs, fallbackMinutes);

  return (
    <section className="timer" aria-label="Pomodoro timer">
      <div className="timer__readout">
        <span className="timer__mode">{label}</span>
        <time className="timer__digits" aria-live="polite">
          {time}
        </time>
      </div>
      <div className="timer__actions">
        {timer.status === "idle" && (
          <button className="button button--primary" onClick={onStartFocus}>
            <span aria-hidden="true">▶</span> Start focus
          </button>
        )}
        {timer.status === "running" && (
          <button className="button button--primary" onClick={onPause}>
            <span aria-hidden="true">Ⅱ</span> Pause
          </button>
        )}
        {timer.status === "paused" && (
          <button className="button button--primary" onClick={onResume}>
            <span aria-hidden="true">▶</span> Resume
          </button>
        )}
        {timer.status === "completed" && timer.kind === "focus" && (
          <button className="button button--primary" onClick={onStartBreak}>
            <span aria-hidden="true">☾</span> Begin break
          </button>
        )}
        {timer.status === "completed" && timer.kind === "break" && (
          <button className="button button--primary" onClick={onStartFocus}>
            <span aria-hidden="true">✦</span> Start focus
          </button>
        )}
        {isActive && (
          <button className="button button--quiet" onClick={onCancel}>
            End session
          </button>
        )}
      </div>
    </section>
  );
}
