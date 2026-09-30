import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DEFAULT_STATE } from "../domain/defaults";
import type { AppStateV1 } from "../domain/types";
import { App } from "./App";
import type { TimerServices } from "./useTimer";

function createServices(initial: AppStateV1 = structuredClone(DEFAULT_STATE)) {
  let state = initial;
  const save = vi.fn(async (next: AppStateV1) => {
    state = next;
  });
  const schedule = vi.fn(async () => undefined);
  const clear = vi.fn(async () => undefined);
  const services: TimerServices = {
    load: async () => state,
    save,
    schedule,
    clear,
    subscribe: () => () => undefined,
    now: () => Date.UTC(2026, 8, 30, 12),
    createSessionId: () => "new-session",
  };

  return { services, schedule, clear, getState: () => state };
}

describe("App", () => {
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
});
