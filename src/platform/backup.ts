import type { AppStateV1 } from "../domain/types";
import { validateImportedState, type ValidationResult } from "./storage";

interface BackupEnvelope {
  format: "lunagrove-backup";
  version: 1;
  exportedAt: string;
  state: AppStateV1;
}

export function serializeBackup(
  state: AppStateV1,
  exportedAt = new Date().toISOString(),
): string {
  const envelope: BackupEnvelope = {
    format: "lunagrove-backup",
    version: 1,
    exportedAt,
    state,
  };
  return JSON.stringify(envelope, null, 2);
}

export function parseBackup(text: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file is not a valid Lunagrove backup." };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("format" in parsed) ||
    parsed.format !== "lunagrove-backup" ||
    !("version" in parsed) ||
    parsed.version !== 1 ||
    !("state" in parsed)
  ) {
    return { ok: false, error: "This file is not a valid Lunagrove backup." };
  }

  return validateImportedState(parsed.state);
}

export function downloadBackup(state: AppStateV1): void {
  const blob = new Blob([serializeBackup(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `lunagrove-backup-v1-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
