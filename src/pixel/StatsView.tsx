import type { AppStateV1 } from "../domain/types";
import { summarizeFocus, type FocusTotals } from "../domain/stats";
import { PixelDigits } from "./PixelDigits";
import "./pixel-ui.css";
import "./stats.css";

interface StatsViewProps {
  stats: AppStateV1["stats"];
  now: number;
  reducedMotion: boolean;
  onBack: () => void;
  onOpenSettings: () => void;
}

const BAR_MAX = 96;

function formatMinutes(minutes: number): string {
  if (minutes < 120) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

function days(count: number): string {
  return `${count} ${count === 1 ? "day" : "days"}`;
}

function Tile({ label, totals, x }: { label: string; totals: FocusTotals; x: number }) {
  return (
    <div className="stats-tile" style={{ left: x }}>
      <dt>{label}</dt>
      <dd className="stats-tile-count">
        <PixelDigits text={String(totals.sessions)} unit={2} />
        <span className="pixel-digits-text">{totals.sessions} focus</span>
      </dd>
      <dd className="stats-tile-minutes">{formatMinutes(totals.minutes)}</dd>
    </div>
  );
}

export function StatsView({ stats, now, reducedMotion, onBack, onOpenSettings }: StatsViewProps) {
  const summary = summarizeFocus(stats, now);
  const busiest = Math.max(1, ...summary.lastSevenDays.map((day) => day.sessions));
  const chartLabel = summary.lastSevenDays.map((day) => `${day.key}: ${day.sessions}`).join(", ");

  return (
    <section className={`stats-shell${reducedMotion ? " stats-shell--still" : ""}`} aria-label="Focus stats">
      <span className="stats-brand">LUNAGROVE</span>
      <button className="pixel-hit stats-settings" type="button" aria-label="Settings" onClick={onOpenSettings} />
      <button className="pixel-hit stats-close" type="button" aria-label="Close Lunagrove" onClick={() => window.close()} />

      <dl className="stats-tiles">
        <Tile label="Today" totals={summary.today} x={30} />
        <Tile label="This week" totals={summary.week} x={176} />
        <Tile label="All time" totals={summary.allTime} x={322} />
      </dl>

      <p className="stats-chart-title">Last 7 days</p>
      <ol className="stats-chart" role="img" aria-label={`Focus sessions per day. ${chartLabel}`}>
        {summary.lastSevenDays.map((day) => (
          <li className={`${day.isToday ? "is-today" : ""}${day.sessions ? "" : " is-empty"}`.trim()} data-testid="stats-day" key={day.key}>
            {day.sessions > 0 && <span className="stats-bar-count">{day.sessions}</span>}
            <i className="stats-bar" style={{ height: day.sessions ? Math.max(8, (day.sessions / busiest) * BAR_MAX) : 3 }} />
            <span className="stats-weekday">{day.weekday}</span>
          </li>
        ))}
      </ol>

      <button className="pixel-hit stats-home" type="button" aria-label="Back to home" onClick={onBack} />

      <div className="stats-panel">
        <h1 className="stats-title">Focus stats</h1>
        <p className="stats-streak">Current streak: {days(summary.currentStreak)}</p>
        <p className="stats-best">Best streak: {days(summary.bestStreak)}</p>
      </div>
    </section>
  );
}
