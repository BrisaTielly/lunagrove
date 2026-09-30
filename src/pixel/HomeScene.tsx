import type { TimerState } from "../domain/types";
import type { LumiState } from "./Lumi";
import { PixelDigits } from "./PixelDigits";
import { FIREFLIES, LANTERN, LUMI, SPARKLES, STARS, spriteStyle, type TwinkleSprite } from "./sceneLayers";
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
  onOpenStats: () => void;
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

function MainButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button className="pixel-hit pixel-main-button" onClick={onClick}>
      <span className="pixel-main-label">
        <span aria-hidden="true">{icon}</span>
        {label}
      </span>
    </button>
  );
}

function twinkleStyle(sprite: TwinkleSprite) {
  return { ...spriteStyle(sprite), animationDelay: `${-sprite.delay}s`, animationDuration: `${sprite.duration}s` };
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
  onOpenStats,
  onOpenSettings,
}: HomeSceneProps) {
  const progress = pixelProgress(stage);
  const presentation = timerPresentation(timer, timeLeftMs, focusMinutes);
  const active = timer.status === "running" || timer.status === "paused";
  const lumiState = lumiStateFor(timer);

  return (
    <section
      className={`pixel-shell pixel-shell--${progress.chapter}${reducedMotion ? " pixel-shell--still" : ""}`}
      aria-label="Lunagrove home"
    >
      <span className="pixel-brand">LUNAGROVE</span>
      <button className="pixel-hit pixel-settings-button" type="button" aria-label="Settings" onClick={onOpenSettings} />
      <button className="pixel-hit pixel-close-button" type="button" aria-label="Close Lunagrove" onClick={() => window.close()} />

      <div className="pixel-ambient" aria-hidden="true">
        <i className="pixel-moon-glow" />
        {STARS.map((star) => (
          <i className="pixel-sprite pixel-star" style={twinkleStyle(star)} key={`${star.x}-${star.y}`} />
        ))}
        <i className="pixel-sprite pixel-lantern" style={spriteStyle(LANTERN)}>
          <i className="pixel-lantern-glow" />
        </i>
      </div>

      <div
        className="pixel-sprite pixel-lumi"
        style={spriteStyle(LUMI)}
        data-state={lumiState}
        role="img"
        aria-label={`Lumi, the moon gardener, ${lumiState}`}
      >
        <i className="pixel-lumi-eyelid pixel-lumi-eyelid--left" aria-hidden="true" />
        <i className="pixel-lumi-eyelid pixel-lumi-eyelid--right" aria-hidden="true" />
      </div>

      <div className="pixel-ambient" aria-hidden="true">
        {lumiState === "water" && (
          <span className="pixel-water" data-testid="watering">
            <i />
            <i />
            <i />
            <i />
          </span>
        )}
        {SPARKLES.map((sparkle) => (
          <i className="pixel-sprite pixel-sparkle" style={twinkleStyle(sparkle)} key={`${sparkle.x}-${sparkle.y}`} />
        ))}
        {FIREFLIES.map((firefly) => (
          <i
            className={`pixel-firefly pixel-firefly--${firefly.path}`}
            style={{ left: firefly.x, top: firefly.y, animationDelay: `${-firefly.delay}s`, animationDuration: `${firefly.duration}s, 2.2s` }}
            key={`${firefly.x}-${firefly.y}`}
          />
        ))}
      </div>

      <section className="pixel-timer-card" aria-label="Pomodoro timer">
        <span className="pixel-mode">{presentation.label}</span>
        <time className="pixel-digits" aria-live="polite">
          <PixelDigits text={presentation.time} unit={3.4} />
          <span className="pixel-digits-text">{presentation.time}</span>
        </time>
      </section>

      <div
        className="pixel-progress-card"
        role="progressbar"
        aria-label="Journey progress"
        aria-valuemin={0}
        aria-valuemax={20}
        aria-valuenow={progress.filledPips}
      >
        <b className="pixel-progress-count">
          <PixelDigits text={`${progress.filledPips} / 20`} unit={0.875} />
          <span className="pixel-digits-text">{progress.filledPips} / 20</span>
        </b>
        <ol className="pixel-pips" aria-label="Ten two-step journey capsules">
          {Array.from({ length: 10 }, (_, index) => {
            const completedSteps = progress.filledPips - index * 2;
            const fill = completedSteps >= 2 ? "full" : completedSteps === 1 ? "half" : "empty";
            return <li data-fill={fill} key={index} />;
          })}
        </ol>
      </div>

      <button className="pixel-hit pixel-garden-button" type="button" onClick={onOpenGarden} aria-label="Open garden" />

      {timer.status === "idle" && (
        <button className="pixel-hit pixel-main-button" aria-label="Start focus" onClick={onStartFocus}>
          <span className="pixel-main-label pixel-main-label--baked" aria-hidden="true">Start</span>
        </button>
      )}
      {timer.status === "running" && <MainButton icon="Ⅱ" label="Pause" onClick={onPause} />}
      {timer.status === "paused" && <MainButton icon="▶" label="Resume" onClick={onResume} />}
      {timer.status === "completed" && timer.kind === "focus" && <MainButton icon="☾" label="Begin break" onClick={onStartBreak} />}
      {timer.status === "completed" && timer.kind === "break" && <MainButton icon="✦" label="Start focus" onClick={onStartFocus} />}
      {active && <button className="pixel-end-button" onClick={onCancel}>End session</button>}
      {error && <p className="pixel-error" role="alert">{error}</p>}

      <button className="pixel-hit pixel-stats-button" type="button" onClick={onOpenStats} aria-label="Open stats" />
    </section>
  );
}
