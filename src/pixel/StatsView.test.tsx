import { fireEvent, render, screen } from "@testing-library/react";

import { StatsView } from "./StatsView";

const stats = {
  totalFocusSessions: 9,
  totalFocusMinutes: 225,
  byDay: {
    "2026-09-28": { sessions: 3, minutes: 75 },
    "2026-09-29": { sessions: 4, minutes: 100 },
    "2026-09-30": { sessions: 2, minutes: 50 },
  },
};

function renderStats(onBack = vi.fn()) {
  render(
    <StatsView
      stats={stats}
      now={new Date(2026, 8, 30, 18).getTime()}
      reducedMotion={false}
      onBack={onBack}
      onOpenSettings={vi.fn()}
    />,
  );
}

describe("StatsView", () => {
  it("shows today, the week and all-time focus", () => {
    renderStats();

    expect(screen.getByText("2 focus")).toBeInTheDocument();
    expect(screen.getAllByText("9 focus")).toHaveLength(2);
    expect(screen.getByText("50 min")).toBeVisible();
    expect(screen.getAllByText("3 h 45 min")).toHaveLength(2);
  });

  it("charts the last seven days and the streaks", () => {
    renderStats();

    expect(screen.getAllByTestId("stats-day")).toHaveLength(7);
    expect(screen.getByRole("img", { name: /2026-09-30: 2/ })).toBeInTheDocument();
    expect(screen.getByText("Current streak: 3 days")).toBeVisible();
    expect(screen.getByText("Best streak: 3 days")).toBeVisible();
  });

  it("returns home", () => {
    const onBack = vi.fn();
    renderStats(onBack);

    fireEvent.click(screen.getByRole("button", { name: "Back to home" }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
