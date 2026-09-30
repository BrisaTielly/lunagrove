import type { SessionKind } from "../domain/types";

export async function notifyCompletion(kind: SessionKind): Promise<void> {
  const title = kind === "focus" ? "The sanctuary is stirring" : "Your break is complete";
  const message =
    kind === "focus"
      ? "A new piece of Lunagrove is ready to reveal."
      : "Return when you feel ready. Your sanctuary will wait.";

  await chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/icon-128.png"),
    title,
    message,
  });
}
