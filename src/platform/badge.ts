import { badgeFor, nextBadgeChange } from "../domain/badge";
import type { AppStateV1 } from "../domain/types";

export const BADGE_ALARM = "badge";

// Paints the toolbar countdown and arms a one-shot alarm for its next minute.
export async function refreshBadge(state: AppStateV1, now: number): Promise<void> {
  const badge = badgeFor(state.timer, now);
  await chrome.action.setBadgeText({ text: badge.text });
  if (badge.text) {
    await chrome.action.setBadgeBackgroundColor({ color: badge.color });
    await chrome.action.setBadgeTextColor({ color: "#171a2f" });
  }

  const next = nextBadgeChange(state.timer, now);
  if (next === null) await chrome.alarms.clear(BADGE_ALARM);
  else await chrome.alarms.create(BADGE_ALARM, { when: next });
}
