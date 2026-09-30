import type { SessionKind } from "../domain/types";

// Served from public/; a missing file makes notifications.create fail silently.
export const NOTIFICATION_ICON = "icons/icon-128.png";

export async function notifyCompletion(kind: SessionKind): Promise<void> {
  const title = kind === "focus" ? "Focus complete" : "Break is over";
  const message =
    kind === "focus"
      ? "Lumi planted something new in the garden."
      : "Come back whenever you are ready. Lumi will wait.";

  await chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL(NOTIFICATION_ICON),
    title,
    message,
  });
}
