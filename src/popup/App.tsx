import { SanctuaryScene } from "../scene/SanctuaryScene";
import { StatsBar } from "./components/StatsBar";
import { TimerControls } from "./components/TimerControls";
import { useTimer, type TimerServices } from "./useTimer";
import "./styles.css";

interface AppProps {
  services?: TimerServices;
}

function prefersReducedMotion(preference: "system" | boolean): boolean {
  if (typeof preference === "boolean") return preference;
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

export function App({ services }: AppProps) {
  const timer = useTimer(services);

  if (!timer.state) {
    return (
      <main className="app app--loading">
        <span className="loading-rune" aria-hidden="true">◒</span>
        <p>{timer.error ?? "Waking the sanctuary…"}</p>
      </main>
    );
  }

  const { state } = timer;
  const stage = Math.min(20, state.stats.totalFocusSessions);
  const celebrating =
    state.timer.status === "completed" &&
    state.timer.kind === "focus" &&
    stage > state.ui.lastCelebratedStage;

  return (
    <main className="app">
      <header className="topbar">
        <a className="wordmark" href="#timer" aria-label="Lunagrove home">
          <i aria-hidden="true">◒</i>
          <span>Lunagrove</span>
        </a>
        <button className="icon-button" type="button" aria-label="Settings">
          <span aria-hidden="true">⚙</span>
        </button>
      </header>

      <SanctuaryScene
        stage={stage}
        celebrating={celebrating}
        reducedMotion={prefersReducedMotion(state.preferences.reducedMotion)}
      />

      <div className="control-deck" id="timer">
        <TimerControls
          timer={state.timer}
          timeLeftMs={timer.timeLeftMs}
          focusMinutes={state.preferences.focusMinutes}
          onStartFocus={() => void timer.start("focus")}
          onStartBreak={() => void timer.start("break")}
          onPause={() => void timer.pause()}
          onResume={() => void timer.resume()}
          onCancel={() => void timer.cancel()}
        />
        {timer.error && <p className="error-message" role="alert">{timer.error}</p>}
        <StatsBar state={state} now={services?.now() ?? Date.now()} />
      </div>
    </main>
  );
}
