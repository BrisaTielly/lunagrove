export type SessionKind = "focus" | "break";

export type TimerState =
  | { status: "idle" }
  | {
      status: "running";
      sessionId: string;
      kind: SessionKind;
      startedAt: number;
      endsAt: number;
      durationMs: number;
    }
  | {
      status: "paused";
      sessionId: string;
      kind: SessionKind;
      startedAt: number;
      remainingMs: number;
      durationMs: number;
    }
  | {
      status: "completed";
      sessionId: string;
      kind: SessionKind;
      completedAt: number;
      durationMs: number;
    };

export interface DailyStats {
  sessions: number;
  minutes: number;
}

export interface AppStateV1 {
  version: 1;
  timer: TimerState;
  completedSessionIds: string[];
  stats: {
    totalFocusSessions: number;
    totalFocusMinutes: number;
    byDay: Record<string, DailyStats>;
  };
  preferences: {
    focusMinutes: number;
    breakMinutes: number;
    longBreakMinutes: number;
    longBreakEvery: number;
    autoStartBreaks: boolean;
    seasons: "journey" | "auto" | "north" | "south" | "off";
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    reducedMotion: "system" | boolean;
  };
  ui: {
    lastCelebratedStage: number;
  };
}
