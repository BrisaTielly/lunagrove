import type { TimerState } from "../domain/types";
import { Lumi, type LumiState } from "./Lumi";
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
        <button className="pixel-icon-button" type="button" aria-label="Settings" onClick={onOpenSettings}>
          <span aria-hidden="true">⚙</span>
        </button>
      </header>

      <div className={`pixel-stage pixel-stage--${progress.chapter}`}>
        <svg className="pixel-world" viewBox="0 0 160 142" shapeRendering="crispEdges" aria-hidden="true">
          <rect width="160" height="142" fill="#302b52" />
          <rect y="55" width="160" height="87" fill="#29284b" />
          <path fill="#3e3b6b" d="M0 68h18V58h13V47h10v95H0zM160 65h-15V54h-12V43h-11v99h38z" />
          <path fill="#555184" d="M60 64h17v-6h12v6h13v5H60zM104 45h13v-5h9v5h9v4h-31z" />

          <path fill="#171a2f" d="M8 0h38v7h8v12h-8v8h-6v27h-8V30H18v9H8z" />
          <path fill="#4d5272" d="M13 4h28v6h8v7h-9v7H27v-6H14z" />
          <path fill="#83aa62" d="M21 18h5v15h-3v7h-3v-9h1zM39 10h4v18h-3v7h-3V22h2z" />
          <rect x="29" y="25" width="8" height="18" fill="#72566d" />
          <rect x="26" y="23" width="14" height="4" fill="#171a2f" />
          <rect x="28" y="26" width="10" height="15" fill="#f4b85d" />
          <rect x="30" y="28" width="6" height="11" fill="#ffe6a7" />

          <path fill="#ffe6a7" d="M105 9h19v3h6v5h4v18h-4v6h-6v3h-19v-3h-6v-6h-3V18h3v-6h6z" />
          <rect x="106" y="17" width="5" height="5" fill="#e9c58c" />
          <rect x="118" y="29" width="7" height="5" fill="#e9c58c" />
          <rect x="102" y="32" width="4" height="4" fill="#e9c58c" />

          <path fill="#f4b85d" d="M82 18h2v-4h2v4h4v2h-4v4h-2v-4h-2zM139 31h2v-3h2v3h3v2h-3v3h-2v-3h-2zM91 51h2v-3h2v3h3v2h-3v3h-2v-3h-2z" />

          <path fill="#171a2f" d="M0 121h18v-6h16v4h20v-5h23v6h22v-8h20v5h18v-4h23v29H0z" />
          <path fill="#4d5272" d="M0 123h21v-5h13v4h25v-5h16v6h25v-7h17v5h20v-4h23v25H0z" />
          <path fill="#83aa62" d="M4 118h3v-8h2v8h3v4H4zM45 120h3v-10h2v6h3v6h-8zM129 119h3v-9h2v6h4v6h-9z" />

          <path fill="#171a2f" d="M75 112h22v5h3v21H72v-21h3z" />
          <path fill="#b85f53" d="M75 118h22l-3 18H78z" />
          <rect x="72" y="113" width="28" height="6" fill="#ef806f" />
          <rect x="84" y="91" width="3" height="22" fill="#83aa62" />
          <path fill="#83aa62" d="M86 99h8v4h-5v4h-3zM83 96h-8v4h5v4h3z" />
          {progress.stage >= 3 && <path fill="#ffe6a7" d="M81 88h9v3h3v7h-3v3h-9v-3h-3v-7h3z" />}
          {progress.stage >= 3 && <rect x="84" y="91" width="3" height="5" fill="#f4b85d" />}
        </svg>

        <div className="pixel-lumi-wrap">
          <Lumi state={lumiStateFor(timer)} reducedMotion={reducedMotion} />
        </div>

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
            <span aria-hidden="true">♧</span>
            <b>{progress.filledPips} / 20</b>
          </div>
          <ol className="pixel-pips" aria-label="Twenty journey steps">
            {Array.from({ length: 20 }, (_, index) => (
              <li className={index < progress.filledPips ? "is-filled" : ""} key={index} />
            ))}
          </ol>
        </div>
      </div>

      <div className="pixel-controls">
        <button className="pixel-nav-button" type="button" onClick={onOpenGarden} aria-label="Open garden">
          <span aria-hidden="true">♧</span>
          <small>GARDEN</small>
        </button>

        <div className="pixel-main-actions">
          {timer.status === "idle" && <button className="pixel-main-button" onClick={onStartFocus}><span aria-hidden="true">▶</span> Start focus</button>}
          {timer.status === "running" && <button className="pixel-main-button" onClick={onPause}><span aria-hidden="true">Ⅱ</span> Pause</button>}
          {timer.status === "paused" && <button className="pixel-main-button" onClick={onResume}><span aria-hidden="true">▶</span> Resume</button>}
          {timer.status === "completed" && timer.kind === "focus" && <button className="pixel-main-button" onClick={onStartBreak}><span aria-hidden="true">☾</span> Begin break</button>}
          {timer.status === "completed" && timer.kind === "break" && <button className="pixel-main-button" onClick={onStartFocus}><span aria-hidden="true">✦</span> Start focus</button>}
          {active && <button className="pixel-end-button" onClick={onCancel}>End session</button>}
          {error && <p className="pixel-error" role="alert">{error}</p>}
        </div>

        <button className="pixel-nav-button" type="button" onClick={onOpenMap} aria-label="Open journey map">
          <span aria-hidden="true">▥</span>
          <small>MAP</small>
        </button>
      </div>

      <p className="pixel-restored">{progress.filledPips} / 20 restored</p>
    </section>
  );
}
