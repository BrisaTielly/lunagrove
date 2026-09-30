import type { AppStateV1 } from "../../domain/types";

interface StatsBarProps {
  state: AppStateV1;
  now: number;
}

export function StatsBar({ state, now }: StatsBarProps) {
  const todayKey = new Date(now).toISOString().slice(0, 10);
  const today = state.stats.byDay[todayKey] ?? { sessions: 0, minutes: 0 };
  const restored = Math.min(20, state.stats.totalFocusSessions);

  return (
    <dl className="stats" aria-label="Focus statistics">
      <div>
        <dt>Today</dt>
        <dd>{today.sessions} sessions</dd>
      </div>
      <div>
        <dt>Focused</dt>
        <dd>{state.stats.totalFocusMinutes} min</dd>
      </div>
      <div>
        <dt>Sanctuary</dt>
        <dd>{restored} / 20 restored</dd>
      </div>
    </dl>
  );
}
