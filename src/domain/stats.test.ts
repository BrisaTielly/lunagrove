import { summarizeFocus } from "./stats";

const noon = (month: number, day: number) => new Date(2026, month - 1, day, 12).getTime();
const day = (sessions: number) => ({ sessions, minutes: sessions * 25 });

describe("summarizeFocus", () => {
  const stats = {
    totalFocusSessions: 12,
    totalFocusMinutes: 300,
    byDay: {
      "2026-09-20": day(2),
      "2026-09-21": day(1),
      "2026-09-22": day(3),
      "2026-09-23": day(1),
      "2026-09-27": day(1),
      "2026-09-29": day(2),
      "2026-09-30": day(2),
    },
  };

  it("adds up today, the last seven days and all time", () => {
    const summary = summarizeFocus(stats, noon(9, 30));

    expect(summary.today).toEqual({ sessions: 2, minutes: 50 });
    expect(summary.week).toEqual({ sessions: 5, minutes: 125 });
    expect(summary.allTime).toEqual({ sessions: 12, minutes: 300 });
  });

  it("lists the last seven days oldest first, ending today", () => {
    const days = summarizeFocus(stats, noon(9, 30)).lastSevenDays;

    expect(days.map((entry) => entry.key)).toEqual([
      "2026-09-24", "2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28", "2026-09-29", "2026-09-30",
    ]);
    expect(days.at(-1)).toMatchObject({ isToday: true, weekday: "W", sessions: 2 });
  });

  it("counts the current and the best streak of focused days", () => {
    const summary = summarizeFocus(stats, noon(9, 30));

    expect(summary.currentStreak).toBe(2);
    expect(summary.bestStreak).toBe(4);
  });

  it("keeps yesterday's streak alive before today's first focus", () => {
    expect(summarizeFocus(stats, noon(10, 1)).currentStreak).toBe(2);
    expect(summarizeFocus(stats, noon(10, 2)).currentStreak).toBe(0);
  });

  it("starts empty", () => {
    const summary = summarizeFocus({ totalFocusSessions: 0, totalFocusMinutes: 0, byDay: {} }, noon(9, 30));

    expect(summary).toMatchObject({ currentStreak: 0, bestStreak: 0, week: { sessions: 0, minutes: 0 } });
  });
});
