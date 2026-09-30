import { useState } from "react";

import { downloadBackup, parseBackup } from "../platform/backup";
import { GardenView } from "../pixel/GardenView";
import { HomeScene } from "../pixel/HomeScene";
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
  const [view, setView] = useState<"home" | "garden">("home");

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
  const reducedMotion = prefersReducedMotion(state.preferences.reducedMotion);

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
          onStartFocus={() => void timer.start("focus")}
          onStartBreak={() => void timer.start("break")}
          onPause={() => void timer.pause()}
          onResume={() => void timer.resume()}
          onCancel={() => void timer.cancel()}
          onOpenGarden={() => setView("garden")}
          onOpenMap={() => undefined}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : (
        <GardenView
          totalFocusSessions={state.stats.totalFocusSessions}
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
