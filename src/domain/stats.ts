import { localDateKey } from "./completion";
import type { AppStateV1 } from "./types";

type FocusStats = AppStateV1["stats"];

export interface FocusTotals {
  sessions: number;
  minutes: number;
}

export interface FocusDay extends FocusTotals {
  key: string;
  weekday: string;
  isToday: boolean;
}

export interface FocusSummary {
  today: FocusTotals;
  week: FocusTotals;
  allTime: FocusTotals;
  lastSevenDays: FocusDay[];
  currentStreak: number;
  bestStreak: number;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Calendar arithmetic at local noon, safe across daylight-saving changes.
function shiftDay(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  return localDateKey(new Date(year, month - 1, day + days, 12).getTime());
}

const dayBefore = (key: string) => shiftDay(key, -1);

function totalsFor(stats: FocusStats, key: string): FocusTotals {
  return stats.byDay[key] ?? { sessions: 0, minutes: 0 };
}

export function summarizeFocus(stats: FocusStats, now: number): FocusSummary {
  const todayKey = localDateKey(now);
  const lastSevenDays: FocusDay[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const key = shiftDay(todayKey, -offset);
    const [year, month, date] = key.split("-").map(Number);
    lastSevenDays.push({
      key,
      weekday: WEEKDAYS[new Date(year, month - 1, date).getDay()],
      isToday: key === todayKey,
      ...totalsFor(stats, key),
    });
  }

  const week = lastSevenDays.reduce(
    (sum, day) => ({ sessions: sum.sessions + day.sessions, minutes: sum.minutes + day.minutes }),
    { sessions: 0, minutes: 0 },
  );

  // A streak survives until the end of today even before today's first focus.
  const focused = (key: string) => totalsFor(stats, key).sessions > 0;
  let cursor = focused(todayKey) ? todayKey : dayBefore(todayKey);
  let currentStreak = 0;
  while (focused(cursor)) {
    currentStreak += 1;
    cursor = dayBefore(cursor);
  }

  let bestStreak = 0;
  for (const key of Object.keys(stats.byDay).filter(focused)) {
    if (focused(dayBefore(key))) continue;
    let length = 0;
    let day = key;
    while (focused(day)) {
      length += 1;
      day = shiftDay(day, 1);
    }
    bestStreak = Math.max(bestStreak, length);
  }

  return {
    today: totalsFor(stats, todayKey),
    week,
    allTime: { sessions: stats.totalFocusSessions, minutes: stats.totalFocusMinutes },
    lastSevenDays,
    currentStreak,
    bestStreak,
  };
}
