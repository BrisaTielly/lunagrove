import { DEFAULT_STATE } from "./domain/defaults";
import { handleTimerAlarm, reconcileTimer } from "./platform/background-controller";
import { scheduleTimerAlarm } from "./platform/alarms";
import { notifyCompletion } from "./platform/notifications";
import { RING_MESSAGE, isChimeMessage, ringChime } from "./platform/sound";
import { loadState, saveState } from "./platform/storage";

const dependencies = {
  load: loadState,
  save: saveState,
  notify: notifyCompletion,
  chime: ringChime,
  now: Date.now,
  schedule: scheduleTimerAlarm,
};

chrome.runtime.onInstalled.addListener(() => {
  void loadState()
    .then((state) => {
      if (state.version !== 1) return saveState(structuredClone(DEFAULT_STATE));
    })
    .then(() => reconcileTimer(dependencies));
});

chrome.runtime.onStartup.addListener(() => {
  void reconcileTimer(dependencies);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  void handleTimerAlarm(alarm.name, dependencies);
});

chrome.runtime.onMessage.addListener((message: unknown) => {
  if (isChimeMessage(message, RING_MESSAGE)) void ringChime(message.kind).catch(() => undefined);
});
