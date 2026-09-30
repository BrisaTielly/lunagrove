import { playChime } from "../audio/chime";
import { PLAY_CHIME_MESSAGE, isChimeMessage } from "../platform/sound";

let context: AudioContext | null = null;

chrome.runtime.onMessage.addListener((message: unknown) => {
  if (!isChimeMessage(message, PLAY_CHIME_MESSAGE)) return;
  context ??= new AudioContext();
  playChime(context, message.kind);
});
