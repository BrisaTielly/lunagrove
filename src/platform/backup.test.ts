import { DEFAULT_STATE } from "../domain/defaults";
import { parseBackup, serializeBackup } from "./backup";

describe("backup", () => {
  it("round-trips a versioned backup", () => {
    const state = {
      ...structuredClone(DEFAULT_STATE),
      stats: { ...DEFAULT_STATE.stats, totalFocusSessions: 8 },
    };
    const text = serializeBackup(state, "2026-09-30T12:00:00.000Z");

    expect(parseBackup(text)).toEqual({ ok: true, state });
    expect(JSON.parse(text)).toMatchObject({
      format: "lunagrove-backup",
      version: 1,
      exportedAt: "2026-09-30T12:00:00.000Z",
    });
  });

  it("rejects malformed JSON", () => {
    expect(parseBackup("not json")).toEqual({
      ok: false,
      error: "This file is not a valid Lunagrove backup.",
    });
  });

  it("rejects a valid envelope containing unsafe state", () => {
    const text = JSON.stringify({
      format: "lunagrove-backup",
      version: 1,
      state: {
        ...DEFAULT_STATE,
        preferences: { ...DEFAULT_STATE.preferences, breakMinutes: 999 },
      },
    });

    expect(parseBackup(text)).toEqual({
      ok: false,
      error: "Break duration must be between 1 and 180 minutes.",
    });
  });
});
