import type { SessionKind } from "../domain/types";

// Served from public/; a missing file makes notifications.create fail silently.
export const NOTIFICATION_ICON = "icons/icon-128.png";

export async function notifyCompletion(kind: SessionKind): Promise<void> {
  const title = kind === "focus" ? "The sanctuary is stirring" : "Your break is complete";
  const message =
    kind === "focus"
      ? "A new piece of Lunagrove is ready to reveal."
      : "Return when you feel ready. Your sanctuary will wait.";

  await chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL(NOTIFICATION_ICON),
    title,
    message,
  });
}
