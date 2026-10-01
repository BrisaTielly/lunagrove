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
  onPreviewSound: () => void;
}

export function SettingsDialog({
  preferences,
  onClose,
  onSave,
  onExport,
  onImport,
  onPreviewSound,
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
      draft.breakMinutes > 180 ||
      draft.longBreakMinutes < 1 ||
      draft.longBreakMinutes > 180
    ) {
      setMessage({ kind: "error", text: "Durations must be between 1 and 180 minutes." });
      return;
    }
    if (!Number.isInteger(draft.longBreakEvery) || draft.longBreakEvery < 2 || draft.longBreakEvery > 12) {
      setMessage({ kind: "error", text: "The long break comes every 2 to 12 focus sessions." });
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
          ? { kind: "success", text: "Your garden has been restored from backup." }
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
            <span>Lunagrove</span>
            <h2 id="settings-title">Settings</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close settings" onClick={onClose}>
            <span aria-hidden="true">X</span>
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
              <label>
                <span>Long break</span>
                <span className="number-field">
                  <input
                    aria-label="Long break duration"
                    type="number"
                    min="1"
                    max="180"
                    value={draft.longBreakMinutes}
                    onChange={(event) =>
                      setDraft({ ...draft, longBreakMinutes: Number(event.target.value) })
                    }
                  />
                  <small>min</small>
                </span>
              </label>
              <label>
                <span>Long break every</span>
                <span className="number-field">
                  <input
                    aria-label="Long break every"
                    type="number"
                    min="2"
                    max="12"
                    value={draft.longBreakEvery}
                    onChange={(event) =>
                      setDraft({ ...draft, longBreakEvery: Number(event.target.value) })
                    }
                  />
                  <small>focus</small>
                </span>
              </label>
            </div>
            <label className="switch-row">
              <span>
                <strong>Start breaks automatically</strong>
                <small>Roll straight into the break when a focus ends</small>
              </span>
              <input
                aria-label="Start breaks automatically"
                type="checkbox"
                checked={draft.autoStartBreaks}
                onChange={(event) => setDraft({ ...draft, autoStartBreaks: event.target.checked })}
              />
            </label>
            <p className="settings__note">
              Shortcut: Alt+Shift+L starts or pauses without opening Lunagrove. Change it at
              chrome://extensions/shortcuts.
            </p>
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
                <strong>Play sounds</strong>
                <small>A soft chime when a focus or break ends</small>
              </span>
              <input
                aria-label="Play sounds"
                type="checkbox"
                checked={draft.soundEnabled}
                onChange={(event) => {
                  setDraft({ ...draft, soundEnabled: event.target.checked });
                  if (event.target.checked) onPreviewSound();
                }}
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
