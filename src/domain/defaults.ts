import type { AppStateV1 } from "./types";

export const DEFAULT_STATE: AppStateV1 = {
  version: 1,
  timer: { status: "idle" },
  completedSessionIds: [],
  stats: {
    totalFocusSessions: 0,
    totalFocusMinutes: 0,
    byDay: {},
  },
  preferences: {
    focusMinutes: 25,
    breakMinutes: 5,
    soundEnabled: false,
    notificationsEnabled: true,
    reducedMotion: "system",
  },
  ui: {
    lastCelebratedStage: 0,
  },
};
