// Dev-only page: every screen in its key states, live and animated.
// Open with `pnpm dev` at /src/dev/gallery.html. Not part of the extension build.
import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/pixelify-sans";
import "@fontsource/silkscreen/400.css";

import { badgeFor } from "../domain/badge";
import { DEFAULT_STATE } from "../domain/defaults";
import type { Season } from "../domain/seasons";
import type { TimerState } from "../domain/types";
import type { Celebration } from "../pixel/celebration";
import { GardenView } from "../pixel/GardenView";
import { HomeScene } from "../pixel/HomeScene";
import { StatsView } from "../pixel/StatsView";
import { SettingsDialog } from "../popup/components/SettingsDialog";
import "../popup/styles.css";
import "./gallery.css";

const noop = () => undefined;
const now = Date.now();
const MIN = 60_000;
const icon = new URL("../../public/icons/icon-32.png", import.meta.url).href;

const running = (kind: "focus" | "break", leftMs: number): TimerState => ({
  status: "running", sessionId: "demo", kind, startedAt: now - MIN, endsAt: now + leftMs, durationMs: 25 * MIN,
});
const paused: TimerState = { status: "paused", sessionId: "demo", kind: "focus", startedAt: now - MIN, remainingMs: 12 * MIN + 30_000, durationMs: 25 * MIN };
const completed = (kind: "focus" | "break"): TimerState => ({ status: "completed", sessionId: "demo", kind, completedAt: now, durationMs: 25 * MIN });

interface HomeCase {
  label: string;
  timer: TimerState;
  timeLeftMs?: number;
  stage?: number;
  celebration?: Celebration;
  longBreakNext?: boolean;
  season?: Season | null;
  error?: string;
  reducedMotion?: boolean;
}

const HOME: HomeCase[] = [
  { label: "First open: 0 / 20", timer: { status: "idle" }, stage: 0 },
  { label: "Idle mid-journey", timer: { status: "idle" }, stage: 9 },
  { label: "Focusing", timer: running("focus", 18 * MIN + 42_000), timeLeftMs: 18 * MIN + 42_000, stage: 9 },
  { label: "Paused", timer: paused, timeLeftMs: 12 * MIN + 30_000, stage: 9 },
  { label: "Focus done: begin break", timer: completed("focus"), stage: 9 },
  { label: "Focus done: long break is next", timer: completed("focus"), stage: 8, longBreakNext: true },
  { label: "On a break (Lumi rests)", timer: running("break", 3 * MIN + 10_000), timeLeftMs: 3 * MIN + 10_000, stage: 9 },
  { label: "Break done: start focus", timer: completed("break"), stage: 9 },
  { label: "Celebration: new piece", timer: completed("focus"), stage: 3, celebration: { stage: 3, unlock: "Moon flower", completedChapter: null, visitor: null } },
  { label: "Celebration: chapter + visitor", timer: completed("focus"), stage: 10, celebration: { stage: 10, unlock: "Moon reflection", completedChapter: "pond", visitor: "a frog" } },
  { label: "Celebration: a new garden", timer: completed("focus"), stage: 1, celebration: { stage: 21, unlock: "Moss patch", completedChapter: null, visitor: null, newGarden: "Mushroom Hollow" } },
  { label: "Error message", timer: running("focus", 20 * MIN), timeLeftMs: 20 * MIN, stage: 9, error: "That change could not be saved. Try again." },
  { label: "Reduced motion (everything still)", timer: { status: "idle" }, stage: 9, reducedMotion: true },
];

const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];
const GARDEN_STAGES = [
  { stage: 0, label: "Empty: before the first focus" },
  { stage: 1, label: "1: the seed" },
  { stage: 5, label: "5: sprout chapter + bunny" },
  { stage: 7, label: "7: pond with lily pads" },
  { stage: 10, label: "10: pond chapter + frog" },
  { stage: 15, label: "15: bridge chapter + owl" },
  { stage: 20, label: "20: complete + moon fox" },
  { stage: 21, label: "21: Mushroom Hollow opens" },
  { stage: 25, label: "25: + snail" },
  { stage: 30, label: "30: + hedgehog" },
  { stage: 35, label: "35: + moth" },
  { stage: 40, label: "40: complete + spirit deer" },
];

const WEEK = {
  totalFocusSessions: 41,
  totalFocusMinutes: 1015,
  byDay: Object.fromEntries(
    [3, 5, 0, 2, 6, 4, 2].map((sessions, index) => {
      const day = new Date(now - (6 - index) * 86_400_000);
      const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
      return [key, { sessions, minutes: sessions * 25 }];
    }),
  ),
};

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="gallery-item" style={{ margin: 0 }}>
      <div className="gallery-frame">{children}</div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function Home(props: HomeCase) {
  return (
    <HomeScene
      timer={props.timer}
      timeLeftMs={props.timeLeftMs ?? 0}
      focusMinutes={25}
      stage={props.stage ?? 0}
      reducedMotion={props.reducedMotion ?? false}
      error={props.error}
      celebration={props.celebration}
      longBreakNext={props.longBreakNext}
      season={props.season ?? null}
      onStartFocus={noop} onStartBreak={noop} onPause={noop} onResume={noop} onCancel={noop}
      onOpenGarden={noop} onOpenStats={noop} onOpenSettings={noop}
    />
  );
}

const BADGES: { label: string; timer: TimerState }[] = [
  { label: "focus", timer: running("focus", 18 * MIN + 5_000) },
  { label: "last minute", timer: running("focus", 30_000) },
  { label: "break", timer: running("break", 4 * MIN) },
  { label: "paused", timer: paused },
  { label: "idle", timer: { status: "idle" } },
];

function Gallery() {
  return (
    <main className="gallery">
      <h1>Lunagrove states</h1>
      <p>Every screen with its real components. Nothing here is saved: buttons do nothing.</p>

      <h2>Toolbar badge</h2>
      <div className="gallery-badges">
        {BADGES.map(({ label, timer }) => {
          const badge = badgeFor(timer, now);
          return (
            <div className="gallery-badge" key={label}>
              <img src={icon} alt="" />
              {badge.text && <b style={{ background: badge.color }}>{badge.text}</b>}
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <h2>Home</h2>
      <div className="gallery-row">
        {HOME.map((item) => <Frame label={item.label} key={item.label}><Home {...item} /></Frame>)}
      </div>

      <h2>Seasons</h2>
      <div className="gallery-row">
        {SEASONS.map((season) => (
          <Frame label={`Home in ${season}`} key={`home-${season}`}><Home label="" timer={{ status: "idle" }} stage={9} season={season} /></Frame>
        ))}
        {SEASONS.map((season) => (
          <Frame label={`Garden in ${season}`} key={`garden-${season}`}>
            <GardenView totalFocusSessions={season === "spring" || season === "autumn" ? 14 : 34} reducedMotion={false} season={season} onBack={noop} onOpenSettings={noop} />
          </Frame>
        ))}
      </div>

      <h2>Garden</h2>
      <div className="gallery-row">
        {GARDEN_STAGES.map(({ stage, label }) => (
          <Frame label={label} key={stage}>
            <GardenView totalFocusSessions={stage} reducedMotion={false} onBack={noop} onOpenSettings={noop} />
          </Frame>
        ))}
      </div>

      <h2>Stats and settings</h2>
      <div className="gallery-row">
        <Frame label="Stats: brand new">
          <StatsView stats={DEFAULT_STATE.stats} now={now} reducedMotion={false} onBack={noop} onOpenSettings={noop} />
        </Frame>
        <Frame label="Stats: a busy week">
          <StatsView stats={WEEK} now={now} reducedMotion={false} onBack={noop} onOpenSettings={noop} />
        </Frame>
        <Frame label="Settings">
          <div className="app">
            <SettingsDialog
              preferences={DEFAULT_STATE.preferences}
              onClose={noop} onSave={noop} onExport={noop} onPreviewSound={noop}
              onImport={async () => ({ ok: true })}
            />
          </div>
        </Frame>
      </div>
    </main>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<StrictMode><Gallery /></StrictMode>);
