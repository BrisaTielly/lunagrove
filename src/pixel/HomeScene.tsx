import type { TimerState } from "../domain/types";
import { Lumi, type LumiState } from "./Lumi";
import { PixelDigits } from "./PixelDigits";
import { FIREFLIES, LANTERN, LUMI, SPARKLES, STARS, spriteStyle, type TwinkleSprite } from "./sceneLayers";
import type { Season } from "../domain/seasons";
import type { Celebration } from "./celebration";
import { SeasonLayer } from "./SeasonLayer";
import { pixelProgress } from "./progression";
import "./pixel-ui.css";

interface HomeSceneProps {
  timer: TimerState;
  timeLeftMs: number;
  focusMinutes: number;
  stage: number;
  reducedMotion: boolean;
  error?: string | null;
  celebration?: Celebration | null;
  longBreakNext?: boolean;
  season?: Season | null;
  onSeeCelebration?: () => void;
  onDismissCelebration?: () => void;
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
  if (timer.status === "completed") return timer.kind === "focus" ? "celebrate" : "idle";
  if (timer.status === "running") return timer.kind === "break" ? "rest" : "water";
  if (timer.status === "paused") return "paused";
  return "idle";
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
      <span className={`pixel-main-label${label.length > 6 ? " pixel-main-label--long" : ""}`}>
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
  celebration = null,
  longBreakNext = false,
  season = null,
  onSeeCelebration,
  onDismissCelebration,
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
  const lumiState = celebration ? "celebrate" : lumiStateFor(timer);

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

      {/* Weather tints the painted cards and their live digits alike; Lumi stays in her own colours. */}
      <SeasonLayer season={season} />

      <Lumi state={lumiState} style={{ left: LUMI.x, top: LUMI.y, width: LUMI.width, height: LUMI.height }} />

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

      {celebration && (
        <section className="pixel-celebration" role="status" aria-label="New in the garden">
          <i className="pixel-celebration-spark pixel-celebration-spark--1" aria-hidden="true" />
          <i className="pixel-celebration-spark pixel-celebration-spark--2" aria-hidden="true" />
          <i className="pixel-celebration-spark pixel-celebration-spark--3" aria-hidden="true" />
          <p className="pixel-celebration-kicker">
            {celebration.completedChapter ? `${celebration.completedChapter} chapter complete` : "New in the garden"}
          </p>
          <p className="pixel-celebration-name">{celebration.unlock}</p>
          {celebration.visitor && <p className="pixel-celebration-visitor">and {celebration.visitor} moved in!</p>}
          <div className="pixel-celebration-actions">
            <button className="pixel-celebration-see" type="button" onClick={onSeeCelebration}>See it</button>
            <button className="pixel-celebration-later" type="button" onClick={onDismissCelebration}>Later</button>
          </div>
        </section>
      )}

      <button className="pixel-hit pixel-garden-button" type="button" onClick={onOpenGarden} aria-label="Open garden" />

      {timer.status === "idle" && (
        <button className="pixel-hit pixel-main-button" aria-label="Start focus" onClick={onStartFocus}>
          <span className="pixel-main-label pixel-main-label--baked" aria-hidden="true">Start</span>
        </button>
      )}
      {timer.status === "running" && <MainButton icon="Ⅱ" label="Pause" onClick={onPause} />}
      {timer.status === "paused" && <MainButton icon="▶" label="Resume" onClick={onResume} />}
      {timer.status === "completed" && timer.kind === "focus" && <MainButton icon="☾" label={longBreakNext ? "Long break" : "Begin break"} onClick={onStartBreak} />}
      {timer.status === "completed" && timer.kind === "break" && <MainButton icon="✦" label="Start focus" onClick={onStartFocus} />}
      {active && <button className="pixel-end-button" onClick={onCancel}>End session</button>}
      {error && <p className="pixel-error" role="alert">{error}</p>}

      <button className="pixel-hit pixel-stats-button" type="button" onClick={onOpenStats} aria-label="Open stats" />
    </section>
  );
}
