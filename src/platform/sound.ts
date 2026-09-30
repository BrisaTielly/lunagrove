import type { SessionKind } from "../domain/types";

// Popup -> service worker, and service worker -> offscreen document.
export const RING_MESSAGE = "lunagrove:ring";
export const PLAY_CHIME_MESSAGE = "lunagrove:play-chime";

const OFFSCREEN_PAGE = "src/offscreen/index.html";

export interface ChimeMessage {
  type: string;
  kind: SessionKind;
}

export function isChimeMessage(message: unknown, type: string): message is ChimeMessage {
  if (typeof message !== "object" || message === null) return false;
  const candidate = message as Partial<ChimeMessage>;
  return candidate.type === type && (candidate.kind === "focus" || candidate.kind === "break");
}

let creating: Promise<void> | null = null;

async function ensureOffscreenDocument(): Promise<void> {
  if (await chrome.offscreen.hasDocument()) return;
  creating ??= chrome.offscreen
    .createDocument({
      url: OFFSCREEN_PAGE,
      reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
      justification: "Play a short chime when a focus or break ends.",
    })
    .finally(() => {
      creating = null;
    });
  await creating;
}

// Service workers cannot play audio, so the chime plays in an offscreen page.
export async function ringChime(kind: SessionKind): Promise<void> {
  await ensureOffscreenDocument();
  await chrome.runtime.sendMessage({ type: PLAY_CHIME_MESSAGE, kind } satisfies ChimeMessage);
}
