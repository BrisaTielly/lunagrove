import { DEFAULT_STATE } from "../domain/defaults";
import { loadState, saveState, validateImportedState } from "./storage";

function createStorage(initial?: unknown) {
  let value = initial;

  return {
    get: vi.fn(async () => ({ appState: value })),
    set: vi.fn(async (next: { appState: unknown }) => {
      value = next.appState;
    }),
  };
}

describe("local storage", () => {
  it("returns defaults when there is no state", async () => {
    const area = createStorage();

    await expect(loadState(area)).resolves.toEqual(DEFAULT_STATE);
  });

  it("round-trips a valid state", async () => {
    const area = createStorage();
    const state = {
      ...DEFAULT_STATE,
      stats: { ...DEFAULT_STATE.stats, totalFocusSessions: 3 },
    };

    await saveState(state, area);

    await expect(loadState(area)).resolves.toEqual(state);
  });

  it("rejects unsafe imported values", () => {
    const unsafe = {
      ...DEFAULT_STATE,
      preferences: { ...DEFAULT_STATE.preferences, focusMinutes: 999 },
    };

    expect(validateImportedState(unsafe)).toEqual({
      ok: false,
      error: "Focus duration must be between 1 and 180 minutes.",
    });
  });

  it("upgrades saves from before long breaks existed", () => {
    const old = structuredClone(DEFAULT_STATE) as unknown as { preferences: Record<string, unknown> };
    delete old.preferences.longBreakMinutes;
    delete old.preferences.longBreakEvery;
    delete old.preferences.autoStartBreaks;
    delete old.preferences.seasons;

    const result = validateImportedState(old);

    expect(result.ok && result.state.preferences).toMatchObject({ longBreakMinutes: 15, longBreakEvery: 4, autoStartBreaks: false, seasons: "auto" });
  });
});
