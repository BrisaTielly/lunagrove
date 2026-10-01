import { useState } from "react";

import { downloadBackup, parseBackup } from "../platform/backup";
import { GardenView } from "../pixel/GardenView";
import { isLongBreakNext } from "../domain/completion";
import { activeSeason, localTimeZone } from "../domain/seasons";
import { pendingCelebration } from "../pixel/celebration";
import { journey } from "../pixel/gardens";
import { HomeScene } from "../pixel/HomeScene";
import { StatsView } from "../pixel/StatsView";
import { SettingsDialog } from "./components/SettingsDialog";
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<"home" | "garden" | "stats">("home");

  if (!timer.state) {
    return (
      <main className="app app--loading">
        <span className="loading-rune" aria-hidden="true">☾</span>
        <p>{timer.error ?? "Waking the grove…"}</p>
      </main>
    );
  }

  const { state } = timer;
  const stage = journey(state.stats.totalFocusSessions).stage;
  const reducedMotion = prefersReducedMotion(state.preferences.reducedMotion);
  const celebration = pendingCelebration(state);
  const season = activeSeason(state.preferences.seasons, new Date(), localTimeZone());

  return (
    <main className="app">
      {view === "home" ? (
        <HomeScene
          timer={state.timer}
          timeLeftMs={timer.timeLeftMs}
          focusMinutes={state.preferences.focusMinutes}
          stage={stage}
          reducedMotion={reducedMotion}
          error={timer.error}
          celebration={celebration}
          longBreakNext={isLongBreakNext(state)}
          season={season}
          onSeeCelebration={() => {
            if (celebration) void timer.markCelebrated(celebration.stage);
            setView("garden");
          }}
          onDismissCelebration={() => {
            if (celebration) void timer.markCelebrated(celebration.stage);
          }}
          onStartFocus={() => void timer.start("focus")}
          onStartBreak={() => void timer.start("break")}
          onPause={() => void timer.pause()}
          onResume={() => void timer.resume()}
          onCancel={() => void timer.cancel()}
          onOpenGarden={() => {
            if (celebration) void timer.markCelebrated(celebration.stage);
            setView("garden");
          }}
          onOpenStats={() => setView("stats")}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : view === "garden" ? (
        <GardenView
          totalFocusSessions={state.stats.totalFocusSessions}
          reducedMotion={reducedMotion}
          season={season}
          onBack={() => setView("home")}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : (
        <StatsView
          stats={state.stats}
          now={Date.now()}
          reducedMotion={reducedMotion}
          onBack={() => setView("home")}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      {settingsOpen && (
        <SettingsDialog
          preferences={state.preferences}
          onClose={() => setSettingsOpen(false)}
          onSave={(preferences) => {
            void timer.updatePreferences(preferences);
            setSettingsOpen(false);
          }}
          onExport={() => downloadBackup(state)}
          onPreviewSound={timer.previewChime}
          onImport={async (text) => {
            const result = parseBackup(text);
            if (!result.ok) return result;
            await timer.replaceState(result.state);
            return { ok: true };
          }}
        />
      )}
    </main>
  );
}
