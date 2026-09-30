import { useCallback, useEffect, useMemo, useState } from "react";

import {
  cancelSession,
  pauseSession,
  remainingMs,
  resumeSession,
  startSession,
} from "../domain/timer";
import type { AppStateV1, SessionKind } from "../domain/types";
import { clearTimerAlarm, scheduleTimerAlarm } from "../platform/alarms";
import { loadState, saveState, validateImportedState } from "../platform/storage";

export interface TimerServices {
  load: () => Promise<AppStateV1>;
  save: (state: AppStateV1) => Promise<void>;
  schedule: (sessionId: string, endsAt: number) => Promise<void>;
  clear: (sessionId: string) => Promise<void>;
  subscribe: (listener: (state: AppStateV1) => void) => () => void;
  now: () => number;
  createSessionId: () => string;
}

const defaultServices: TimerServices = {
  load: loadState,
  save: saveState,
  schedule: scheduleTimerAlarm,
  clear: clearTimerAlarm,
  subscribe: (listener) => {
    const onChanged = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== "local" || !changes.appState?.newValue) return;
      const result = validateImportedState(changes.appState.newValue);
      if (result.ok) listener(result.state);
    };
    chrome.storage.onChanged.addListener(onChanged);
    return () => chrome.storage.onChanged.removeListener(onChanged);
  },
  now: Date.now,
  createSessionId: () => crypto.randomUUID(),
};

export interface UseTimerResult {
  state: AppStateV1 | null;
  timeLeftMs: number;
  error: string | null;
  start: (kind: SessionKind) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  cancel: () => Promise<void>;
  updatePreferences: (preferences: AppStateV1["preferences"]) => Promise<void>;
  replaceState: (state: AppStateV1) => Promise<void>;
}

export function useTimer(services: TimerServices = defaultServices): UseTimerResult {
  const [state, setState] = useState<AppStateV1 | null>(null);
  const [clock, setClock] = useState(services.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void services
      .load()
      .then((loaded) => {
        if (active) setState(loaded);
      })
      .catch(() => {
        if (active) setError("Lunagrove could not load your local progress.");
      });
    const unsubscribe = services.subscribe((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [services]);

  useEffect(() => {
    if (state?.timer.status !== "running") return undefined;
    const interval = window.setInterval(() => setClock(services.now()), 1_000);
    return () => window.clearInterval(interval);
  }, [services, state?.timer.status]);

  const persist = useCallback(
    async (next: AppStateV1) => {
      setState(next);
      setError(null);
      try {
        await services.save(next);
      } catch {
        setError("That change could not be saved. Try again.");
      }
    },
    [services],
  );

  const start = useCallback(
    async (kind: SessionKind) => {
      if (!state) return;
      const now = services.now();
      const minutes =
        kind === "focus" ? state.preferences.focusMinutes : state.preferences.breakMinutes;
      const timer = startSession(kind, minutes, now, services.createSessionId());
      const next = { ...state, timer };
      await persist(next);
      if (timer.status === "running") await services.schedule(timer.sessionId, timer.endsAt);
      setClock(now);
    },
    [persist, services, state],
  );

  const pause = useCallback(async () => {
    if (!state || state.timer.status !== "running") return;
    const previous = state.timer;
    await persist({ ...state, timer: pauseSession(previous, services.now()) });
    await services.clear(previous.sessionId);
  }, [persist, services, state]);

  const resume = useCallback(async () => {
    if (!state || state.timer.status !== "paused") return;
    const timer = resumeSession(state.timer, services.now());
    await persist({ ...state, timer });
    if (timer.status === "running") await services.schedule(timer.sessionId, timer.endsAt);
  }, [persist, services, state]);

  const cancel = useCallback(async () => {
    if (!state || (state.timer.status !== "running" && state.timer.status !== "paused")) return;
    const sessionId = state.timer.sessionId;
    await persist({ ...state, timer: cancelSession(state.timer) });
    await services.clear(sessionId);
  }, [persist, services, state]);

  const updatePreferences = useCallback(
    async (preferences: AppStateV1["preferences"]) => {
      if (!state) return;
      await persist({ ...state, preferences });
    },
    [persist, state],
  );

  const replaceState = useCallback(
    async (next: AppStateV1) => {
      if (state?.timer.status === "running" || state?.timer.status === "paused") {
        await services.clear(state.timer.sessionId);
      }
      await persist(next);
      if (next.timer.status === "running" && next.timer.endsAt > services.now()) {
        await services.schedule(next.timer.sessionId, next.timer.endsAt);
      }
    },
    [persist, services, state],
  );

  const timeLeftMs = useMemo(
    () => (state ? remainingMs(state.timer, clock) : 0),
    [clock, state],
  );

  return {
    state,
    timeLeftMs,
    error,
    start,
    pause,
    resume,
    cancel,
    updatePreferences,
    replaceState,
  };
}
