import { render, screen, within } from "@testing-library/react";

import type { TimerState } from "../domain/types";
import { HomeScene } from "./HomeScene";

const actions = {
  onStartFocus: vi.fn(),
  onStartBreak: vi.fn(),
  onPause: vi.fn(),
  onResume: vi.fn(),
  onCancel: vi.fn(),
  onOpenGarden: vi.fn(),
  onOpenMap: vi.fn(),
  onOpenSettings: vi.fn(),
};

function renderScene(timer: TimerState, stage = 7) {
  return render(
    <HomeScene
      timer={timer}
      timeLeftMs={25 * 60_000}
      focusMinutes={25}
      stage={stage}
      reducedMotion={false}
      {...actions}
    />,
  );
}

describe("HomeScene", () => {
  it("renders the approved virtual-pet composition and twenty pips", () => {
    renderScene({ status: "idle" });

    expect(screen.getByText("LUNAGROVE")).toBeVisible();
    expect(screen.getByRole("button", { name: "Start focus" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Open garden" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Open journey map" })).toBeVisible();

    const progress = screen.getByRole("progressbar", { name: "Journey progress" });
    expect(progress).toHaveAttribute("aria-valuenow", "7");
    expect(within(progress).getAllByRole("listitem")).toHaveLength(10);
    expect(screen.getByText("7 / 20")).toBeVisible();
  });

  it.each([
    [{ status: "idle" }, "water", "Start focus"],
    [
      {
        status: "running",
        sessionId: "focus",
        kind: "focus",
        startedAt: 0,
        endsAt: 1,
        durationMs: 1,
      },
      "water",
      "Pause",
    ],
    [
      {
        status: "paused",
        sessionId: "focus",
        kind: "focus",
        startedAt: 0,
        remainingMs: 1,
        durationMs: 1,
      },
      "idle",
      "Resume",
    ],
    [
      {
        status: "completed",
        sessionId: "focus",
        kind: "focus",
        completedAt: 1,
        durationMs: 1,
      },
      "celebrate",
      "Begin break",
    ],
    [
      {
        status: "running",
        sessionId: "break",
        kind: "break",
        startedAt: 0,
        endsAt: 1,
        durationMs: 1,
      },
      "rest",
      "Pause",
    ],
  ] as const)("maps timer mode to Lumi state", (timer, lumiState, command) => {
    renderScene(timer as TimerState);

    expect(screen.getByRole("img", { name: /Lumi/i })).toHaveAttribute(
      "data-state",
      lumiState,
    );
    expect(screen.getByRole("button", { name: command })).toBeVisible();
  });
});
