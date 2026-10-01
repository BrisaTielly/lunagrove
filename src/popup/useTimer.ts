import { useCallback, useEffect, useMemo, useState } from "react";

import {
  cancelSession,
  pauseSession,
  remainingMs,
  resumeSession,
  startSession,
} from "../domain/timer";
import { playChime } from "../audio/chime";
import { finishDueSession, nextBreakMinutes, startBreakIfAutomatic } from "../domain/completion";
import { DEFAULT_STATE } from "../domain/defaults";
import type { AppStateV1, SessionKind } from "../domain/types";
import { clearTimerAlarm, scheduleTimerAlarm } from "../platform/alarms";
import { RING_MESSAGE } from "../platform/sound";
import { loadState, saveState, validateImportedState } from "../platform/storage";

export interface TimerServices {
  load: () => Promise<AppStateV1>;
  save: (state: AppStateV1) => Promise<void>;
  schedule: (sessionId: string, endsAt: number) => Promise<void>;
  clear: (sessionId: string) => Promise<void>;
  subscribe: (listener: (state: AppStateV1) => void) => () => void;
  chime: (kind: SessionKind) => Promise<void>;
  now: () => number;
  createSessionId: () => string;
}

let previewState = structuredClone(DEFAULT_STATE);

let previewAudio: AudioContext | null = null;

const isExtensionRuntime = () => typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const defaultServices: TimerServices = {
  load: () => (isExtensionRuntime() ? loadState() : Promise.resolve(previewState)),
  save: (state) => {
    if (isExtensionRuntime()) return saveState(state);
    previewState = state;
    return Promise.resolve();
  },
  schedule: (sessionId, endsAt) =>
    isExtensionRuntime() ? scheduleTimerAlarm(sessionId, endsAt) : Promise.resolve(),
  clear: (sessionId) =>
    isExtensionRuntime() ? clearTimerAlarm(sessionId) : Promise.resolve(),
  subscribe: (listener) => {
    if (!isExtensionRuntime()) return () => undefined;
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
  chime: async (kind) => {
    if (isExtensionRuntime()) {
      await chrome.runtime.sendMessage({ type: RING_MESSAGE, kind });
      return;
    }
    previewAudio ??= new AudioContext();
    playChime(previewAudio, kind);
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
  previewChime: () => void;
  markCelebrated: (stage: number) => Promise<void>;
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

  // Finish on the spot when the popup is open at 00:00 or opens after a
  // session ended without its alarm (e.g. dropped on a browser restart).
  useEffect(() => {
    if (!state || state.timer.status !== "running" || clock < state.timer.endsAt) return;
    const finished = finishDueSession(state, clock);
    if (!finished || finished.timer.status !== "completed") return;
    const { sessionId } = state.timer;
    const { kind } = finished.timer;
    const next = startBreakIfAutomatic(finished, clock, services.createSessionId());
    void persist(next)
      .then(() => services.clear(sessionId))
      .then(() => {
        if (next.timer.status === "running") return services.schedule(next.timer.sessionId, next.timer.endsAt);
      });
    if (next.preferences.soundEnabled) void services.chime(kind).catch(() => undefined);
  }, [clock, persist, services, state]);

  const start = useCallback(
    async (kind: SessionKind) => {
      if (!state) return;
      const now = services.now();
      const minutes = kind === "focus" ? state.preferences.focusMinutes : nextBreakMinutes(state);
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

  const markCelebrated = useCallback(
    async (stage: number) => {
      if (!state || state.ui.lastCelebratedStage >= stage) return;
      await persist({ ...state, ui: { ...state.ui, lastCelebratedStage: stage } });
    },
    [persist, state],
  );

  const previewChime = useCallback(() => {
    void services.chime("focus").catch(() => undefined);
  }, [services]);

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
    previewChime,
    markCelebrated,
  };
}
