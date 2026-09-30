import { useState, type ChangeEvent, type FormEvent } from "react";

import type { AppStateV1 } from "../../domain/types";

type Preferences = AppStateV1["preferences"];

interface ImportResult {
  ok: boolean;
  error?: string;
}

interface SettingsDialogProps {
  preferences: Preferences;
  onClose: () => void;
  onSave: (preferences: Preferences) => void;
  onExport: () => void;
  onImport: (text: string) => Promise<ImportResult>;
}

export function SettingsDialog({
  preferences,
  onClose,
  onSave,
  onExport,
  onImport,
}: SettingsDialogProps) {
  const [draft, setDraft] = useState(preferences);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(
    null,
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    if (
      draft.focusMinutes < 1 ||
      draft.focusMinutes > 180 ||
      draft.breakMinutes < 1 ||
      draft.breakMinutes > 180
    ) {
      setMessage({ kind: "error", text: "Durations must be between 1 and 180 minutes." });
      return;
    }

    onSave(draft);
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const result = await onImport(await file.text());
      setMessage(
        result.ok
          ? { kind: "success", text: "Your sanctuary has been restored from backup." }
          : { kind: "error", text: result.error ?? "This backup could not be restored." },
      );
    } catch {
      setMessage({ kind: "error", text: "This backup could not be read." });
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="settings-backdrop" role="presentation">
      <section className="settings" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings__header">
          <div>
            <span>Sanctuary care</span>
            <h2 id="settings-title">Settings</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close settings" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <form onSubmit={submit} noValidate>
          <fieldset>
            <legend>Timer</legend>
            <div className="settings__durations">
              <label>
                <span>Focus duration</span>
                <span className="number-field">
                  <input
                    aria-label="Focus duration"
                    type="number"
                    min="1"
                    max="180"
                    value={draft.focusMinutes}
                    onChange={(event) =>
                      setDraft({ ...draft, focusMinutes: Number(event.target.value) })
                    }
                  />
                  <small>min</small>
                </span>
              </label>
              <label>
                <span>Break duration</span>
                <span className="number-field">
                  <input
                    aria-label="Break duration"
                    type="number"
                    min="1"
                    max="180"
                    value={draft.breakMinutes}
                    onChange={(event) =>
                      setDraft({ ...draft, breakMinutes: Number(event.target.value) })
                    }
                  />
                  <small>min</small>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Comfort</legend>
            <label className="switch-row">
              <span>
                <strong>Desktop notifications</strong>
                <small>Let me know when a session ends</small>
              </span>
              <input
                aria-label="Desktop notifications"
                type="checkbox"
                checked={draft.notificationsEnabled}
                onChange={(event) =>
                  setDraft({ ...draft, notificationsEnabled: event.target.checked })
                }
              />
            </label>
            <label className="switch-row">
              <span>
                <strong>Play ambient sound</strong>
                <small>Quiet lagoon ambience during focus</small>
              </span>
              <input
                aria-label="Play ambient sound"
                type="checkbox"
                checked={draft.soundEnabled}
                onChange={(event) => setDraft({ ...draft, soundEnabled: event.target.checked })}
              />
            </label>
            <label className="select-row">
              <span>Motion</span>
              <select
                aria-label="Motion"
                value={String(draft.reducedMotion)}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    reducedMotion:
                      event.target.value === "system" ? "system" : event.target.value === "true",
                  })
                }
              >
                <option value="system">Follow system</option>
                <option value="false">Full motion</option>
                <option value="true">Reduced motion</option>
              </select>
            </label>
          </fieldset>

          <fieldset>
            <legend>Your data</legend>
            <div className="backup-actions">
              <button type="button" className="button button--outlined" onClick={onExport}>
                Export backup
              </button>
              <label className="button button--outlined file-button">
                Restore backup
                <input type="file" accept="application/json,.json" onChange={importFile} />
              </label>
            </div>
            <p className="settings__note">Everything stays in this browser unless you export it.</p>
          </fieldset>

          {message && (
            <p className={`settings__message settings__message--${message.kind}`} role={message.kind === "error" ? "alert" : "status"}>
              {message.text}
            </p>
          )}

          <button className="button button--primary settings__save" type="submit">
            Save changes
          </button>
        </form>
      </section>
    </div>
  );
}
