import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DEFAULT_STATE } from "../domain/defaults";
import type { AppStateV1 } from "../domain/types";
import { App } from "./App";
import type { TimerServices } from "./useTimer";

function createServices(initial: AppStateV1 = structuredClone(DEFAULT_STATE), now = Date.UTC(2026, 8, 30, 12)) {
  let state = initial;
  const save = vi.fn(async (next: AppStateV1) => {
    state = next;
  });
  const schedule = vi.fn(async () => undefined);
  const clear = vi.fn(async () => undefined);
  const chime = vi.fn(async () => undefined);
  const services: TimerServices = {
    load: async () => state,
    save,
    schedule,
    clear,
    subscribe: () => () => undefined,
    chime,
    now: () => now,
    createSessionId: () => "new-session",
  };

  return { services, schedule, clear, chime, getState: () => state };
}

describe("App", () => {
  it("opens the garden and returns to the timer", async () => {
    const context = createServices();
    render(<App services={context.services} />);

    fireEvent.click(await screen.findByRole("button", { name: "Open garden" }));
    expect(screen.getByRole("region", { name: "Lumi's garden" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to home" }));
    expect(screen.getByRole("region", { name: "Lunagrove home" })).toBeVisible();
  });

  it("opens the focus stats and returns to the timer", async () => {
    const context = createServices();
    render(<App services={context.services} />);

    fireEvent.click(await screen.findByRole("button", { name: "Open stats" }));
    expect(screen.getByRole("region", { name: "Focus stats" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to home" }));
    expect(screen.getByRole("region", { name: "Lunagrove home" })).toBeVisible();
  });

  it("starts, pauses, resumes and cancels a focus session", async () => {
    const context = createServices();
    render(<App services={context.services} />);

    fireEvent.click(await screen.findByRole("button", { name: "Start focus" }));
    await waitFor(() => expect(context.schedule).toHaveBeenCalledOnce());
    expect(screen.getByText("25:00")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    await waitFor(() => expect(context.clear).toHaveBeenCalledOnce());
    expect(screen.getByRole("button", { name: "Resume" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    await waitFor(() => expect(context.schedule).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByRole("button", { name: "End session" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Start focus" })).toBeVisible());
    expect(context.getState().timer).toEqual({ status: "idle" });
  });

  it("offers a break after completed focus without starting it automatically", async () => {
    const completed: AppStateV1 = {
      ...structuredClone(DEFAULT_STATE),
      timer: {
        status: "completed",
        sessionId: "finished-focus",
        kind: "focus",
        completedAt: Date.UTC(2026, 8, 30, 12),
        durationMs: 25 * 60_000,
      },
      stats: {
        totalFocusSessions: 1,
        totalFocusMinutes: 25,
        byDay: { "2026-09-30": { sessions: 1, minutes: 25 } },
      },
    };
    const context = createServices(completed);
    render(<App services={context.services} />);

    expect(await screen.findByRole("button", { name: "Begin break" })).toBeVisible();
    expect(context.schedule).not.toHaveBeenCalled();
    expect(screen.getByText("1 / 20")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Begin break" }));
    await waitFor(() => expect(context.schedule).toHaveBeenCalledOnce());
    expect(context.getState().timer).toMatchObject({ status: "running", kind: "break" });
  });

  it("finishes a focus that ended while the popup was closed and its alarm was lost", async () => {
    const endsAt = Date.UTC(2026, 8, 30, 12);
    const overdue: AppStateV1 = {
      ...structuredClone(DEFAULT_STATE),
      timer: {
        status: "running",
        sessionId: "lost-alarm",
        kind: "focus",
        startedAt: endsAt - 25 * 60_000,
        endsAt,
        durationMs: 25 * 60_000,
      },
    };
    const context = createServices(overdue, endsAt + 5 * 60_000);
    render(<App services={context.services} />);

    expect(await screen.findByRole("button", { name: "Begin break" })).toBeVisible();
    expect(context.getState().stats.totalFocusSessions).toBe(1);
    await waitFor(() => expect(context.clear).toHaveBeenCalledWith("lost-alarm"));
    expect(context.chime).not.toHaveBeenCalled();
  });

  it("rings the chime when the open popup finishes a session with sounds on", async () => {
    const endsAt = Date.UTC(2026, 8, 30, 12);
    const overdue: AppStateV1 = {
      ...structuredClone(DEFAULT_STATE),
      preferences: { ...DEFAULT_STATE.preferences, soundEnabled: true },
      timer: { status: "running", sessionId: "rest", kind: "break", startedAt: endsAt - 5 * 60_000, endsAt, durationMs: 5 * 60_000 },
    };
    const context = createServices(overdue, endsAt);
    render(<App services={context.services} />);

    await waitFor(() => expect(context.chime).toHaveBeenCalledWith("break"));
  });

  describe("celebrating a new garden piece", () => {
    function grown(): AppStateV1 {
      const state = structuredClone(DEFAULT_STATE);
      state.stats = { totalFocusSessions: 3, totalFocusMinutes: 75, byDay: { "2026-09-30": { sessions: 3, minutes: 75 } } };
      state.ui.lastCelebratedStage = 2;
      return state;
    }

    it("shows the new piece and takes Lumi to the garden", async () => {
      const context = createServices(grown());
      render(<App services={context.services} />);

      expect(await screen.findByRole("status", { name: "New in the garden" })).toHaveTextContent("Moon flower");
      expect(screen.getByRole("img", { name: /Lumi/ })).toHaveAttribute("data-state", "celebrate");

      fireEvent.click(screen.getByRole("button", { name: "See it" }));

      expect(screen.getByRole("region", { name: "Lumi's garden" })).toBeVisible();
      await waitFor(() => expect(context.getState().ui.lastCelebratedStage).toBe(3));
    });

    it("can be put off without showing it again", async () => {
      const context = createServices(grown());
      render(<App services={context.services} />);

      fireEvent.click(await screen.findByRole("button", { name: "Later" }));

      await waitFor(() => expect(screen.queryByRole("status", { name: "New in the garden" })).not.toBeInTheDocument());
      expect(context.getState().ui.lastCelebratedStage).toBe(3);
    });
  });
});
