import type { TimerState } from "../domain/types";
import gardenBackdrop from "../assets/pixel/lunagrove-night-garden-v3.png";
import lumiWatering from "../assets/pixel/lumi-watering.png";
import sproutIcon from "../assets/pixel/sprout-icon.png";
import type { LumiState } from "./Lumi";
import { pixelProgress } from "./progression";
import "./pixel-ui.css";

interface HomeSceneProps {
  timer: TimerState;
  timeLeftMs: number;
  focusMinutes: number;
  stage: number;
  reducedMotion: boolean;
  error?: string | null;
  onStartFocus: () => void;
  onStartBreak: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onOpenGarden: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
}

function formatTime(timeMs: number, fallbackMinutes: number): string {
  const totalSeconds = Math.ceil((timeMs || fallbackMinutes * 60_000) / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function lumiStateFor(timer: TimerState): LumiState {
  if (timer.status === "completed") return timer.kind === "focus" ? "celebrate" : "rest";
  if (timer.status === "running") return timer.kind === "break" ? "rest" : "water";
  if (timer.status === "paused") return timer.kind === "break" ? "rest" : "idle";
  return "water";
}

function timerPresentation(timer: TimerState, timeLeftMs: number, focusMinutes: number) {
  const kind = timer.status === "idle" ? "focus" : timer.kind;
  const label =
    timer.status === "running"
      ? kind === "focus" ? "FOCUSING" : "RESTING"
      : timer.status === "paused"
        ? "PAUSED"
        : timer.status === "completed"
          ? kind === "focus" ? "NICE WORK!" : "RESTED"
          : "READY";
  const time = timer.status === "completed"
    ? "00:00"
    : formatTime(timeLeftMs, timer.status === "idle" ? focusMinutes : 0);
  return { kind, label, time };
}

export function HomeScene({
  timer,
  timeLeftMs,
  focusMinutes,
  stage,
  reducedMotion,
  error,
  onStartFocus,
  onStartBreak,
  onPause,
  onResume,
  onCancel,
  onOpenGarden,
  onOpenMap,
  onOpenSettings,
}: HomeSceneProps) {
  const progress = pixelProgress(stage);
  const presentation = timerPresentation(timer, timeLeftMs, focusMinutes);
  const active = timer.status === "running" || timer.status === "paused";

  return (
    <section className="pixel-shell" aria-label="Lunagrove home">
      <header className="pixel-header">
        <div className="pixel-brand" aria-label="Lunagrove">
          <span className="pixel-crescent" aria-hidden="true">☾</span>
          <span>LUNAGROVE</span>
        </div>
        <div className="pixel-header-actions">
          <button className="pixel-icon-button" type="button" aria-label="Settings" onClick={onOpenSettings}>
            <span aria-hidden="true">⚙</span>
          </button>
          <button className="pixel-icon-button pixel-close-button" type="button" aria-label="Close Lunagrove" onClick={() => window.close()}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </header>

      <div className={`pixel-stage pixel-stage--${progress.chapter}`}>
        <img className="pixel-world" src={gardenBackdrop} alt="" draggable={false} />

        <img
          className={`pixel-lumi pixel-lumi--${lumiStateFor(timer)}${reducedMotion ? " pixel-lumi--reduced-motion" : ""}`}
          src={lumiWatering}
          data-state={lumiStateFor(timer)}
          role="img"
          aria-label={`Lumi, the moon gardener, ${lumiStateFor(timer)}`}
          draggable={false}
        />

        <section className="pixel-timer-card" aria-label="Pomodoro timer">
          <span className="pixel-mode">{presentation.label}</span>
          <time className="pixel-digits" aria-live="polite">{presentation.time}</time>
        </section>

        <div
          className="pixel-progress-card"
          role="progressbar"
          aria-label="Journey progress"
          aria-valuemin={0}
          aria-valuemax={20}
          aria-valuenow={progress.filledPips}
        >
          <div className="pixel-progress-label">
            <img className="pixel-sprout-icon pixel-sprout-icon--small" src={sproutIcon} alt="" />
            <b>{progress.filledPips} / 20</b>
          </div>
          <ol className="pixel-pips" aria-label="Ten two-step journey capsules">
            {Array.from({ length: 10 }, (_, index) => {
              const completedSteps = progress.filledPips - index * 2;
              const fill = completedSteps >= 2 ? "full" : completedSteps === 1 ? "half" : "empty";
              return <li data-fill={fill} key={index} />;
            })}
          </ol>
        </div>
      </div>

      <div className="pixel-controls">
        <button className="pixel-nav-button" type="button" onClick={onOpenGarden} aria-label="Open garden">
          <img className="pixel-sprout-icon pixel-sprout-icon--large" src={sproutIcon} alt="" />
          <small>GARDEN</small>
        </button>

        <div className="pixel-main-actions">
          {timer.status === "idle" && <button className="pixel-main-button" aria-label="Start focus" onClick={onStartFocus}><span aria-hidden="true">▶</span> Start</button>}
          {timer.status === "running" && <button className="pixel-main-button" onClick={onPause}><span aria-hidden="true">Ⅱ</span> Pause</button>}
          {timer.status === "paused" && <button className="pixel-main-button" onClick={onResume}><span aria-hidden="true">▶</span> Resume</button>}
          {timer.status === "completed" && timer.kind === "focus" && <button className="pixel-main-button" onClick={onStartBreak}><span aria-hidden="true">☾</span> Begin break</button>}
          {timer.status === "completed" && timer.kind === "break" && <button className="pixel-main-button" onClick={onStartFocus}><span aria-hidden="true">✦</span> Start focus</button>}
          {active && <button className="pixel-end-button" onClick={onCancel}>End session</button>}
          {error && <p className="pixel-error" role="alert">{error}</p>}
        </div>

        <button className="pixel-nav-button" type="button" onClick={onOpenMap} aria-label="Open journey map">
          <span className="pixel-chart-mark" aria-hidden="true"><i /><i /><i /></span>
          <small>MAP</small>
        </button>
      </div>

    </section>
  );
}
