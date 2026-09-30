import { DEFAULT_STATE } from "../domain/defaults";
import type { AppStateV1, TimerState } from "../domain/types";

const STORAGE_KEY = "appState";

export interface StorageAreaLike {
  get(key: string): Promise<{ appState?: unknown }>;
  set(value: { appState: unknown }): Promise<void>;
}

export type ValidationResult =
  | { ok: true; state: AppStateV1 }
  | { ok: false; error: string };

function defaultStorage(): StorageAreaLike {
  return {
    get: (key) =>
      new Promise((resolve) => {
        chrome.storage.local.get(key, (items) => {
          resolve({ appState: items[STORAGE_KEY] });
        });
      }),
    set: (value) =>
      new Promise((resolve) => {
        chrome.storage.local.set(value, resolve);
      }),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}

function isTimer(value: unknown): value is TimerState {
  if (!isRecord(value) || typeof value.status !== "string") return false;
  if (value.status === "idle") return true;

  if (
    typeof value.sessionId !== "string" ||
    (value.kind !== "focus" && value.kind !== "break") ||
    !isFiniteNumber(value.durationMs) ||
    value.durationMs < 0
  ) {
    return false;
  }

  if (value.status === "running") {
    return isFiniteNumber(value.startedAt) && isFiniteNumber(value.endsAt);
  }

  if (value.status === "paused") {
    return isFiniteNumber(value.startedAt) && isFiniteNumber(value.remainingMs);
  }

  if (value.status === "completed") {
    return isFiniteNumber(value.completedAt);
  }

  return false;
}

export function validateImportedState(value: unknown): ValidationResult {
  if (!isRecord(value) || value.version !== 1) {
    return { ok: false, error: "This backup version is not supported." };
  }

  if (!isTimer(value.timer)) {
    return { ok: false, error: "The timer data in this backup is invalid." };
  }

  if (!isRecord(value.preferences)) {
    return { ok: false, error: "The preferences in this backup are invalid." };
  }

  const focusMinutes = value.preferences.focusMinutes;
  if (!isFiniteNumber(focusMinutes) || focusMinutes < 1 || focusMinutes > 180) {
    return { ok: false, error: "Focus duration must be between 1 and 180 minutes." };
  }

  const breakMinutes = value.preferences.breakMinutes;
  if (!isFiniteNumber(breakMinutes) || breakMinutes < 1 || breakMinutes > 180) {
    return { ok: false, error: "Break duration must be between 1 and 180 minutes." };
  }

  if (
    typeof value.preferences.soundEnabled !== "boolean" ||
    typeof value.preferences.notificationsEnabled !== "boolean" ||
    !(
      value.preferences.reducedMotion === "system" ||
      typeof value.preferences.reducedMotion === "boolean"
    )
  ) {
    return { ok: false, error: "The preferences in this backup are invalid." };
  }

  if (!isRecord(value.stats)) {
    return { ok: false, error: "The statistics in this backup are invalid." };
  }

  if (
    !isNonNegativeInteger(value.stats.totalFocusSessions) ||
    !isNonNegativeInteger(value.stats.totalFocusMinutes) ||
    !isRecord(value.stats.byDay)
  ) {
    return { ok: false, error: "The statistics in this backup are invalid." };
  }

  for (const [day, stats] of Object.entries(value.stats.byDay)) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
      !isRecord(stats) ||
      !isNonNegativeInteger(stats.sessions) ||
      !isNonNegativeInteger(stats.minutes)
    ) {
      return { ok: false, error: "The daily history in this backup is invalid." };
    }
  }

  if (
    !Array.isArray(value.completedSessionIds) ||
    !value.completedSessionIds.every((id) => typeof id === "string") ||
    !isRecord(value.ui) ||
    !isNonNegativeInteger(value.ui.lastCelebratedStage)
  ) {
    return { ok: false, error: "The progress in this backup is invalid." };
  }

  return { ok: true, state: value as unknown as AppStateV1 };
}

export async function loadState(area: StorageAreaLike = defaultStorage()): Promise<AppStateV1> {
  const stored = await area.get(STORAGE_KEY);
  if (stored.appState === undefined) return structuredClone(DEFAULT_STATE);

  const result = validateImportedState(stored.appState);
  return result.ok ? result.state : structuredClone(DEFAULT_STATE);
}

export async function saveState(
  state: AppStateV1,
  area: StorageAreaLike = defaultStorage(),
): Promise<void> {
  const result = validateImportedState(state);
  if (!result.ok) throw new Error(result.error);

  await area.set({ appState: state });
}
