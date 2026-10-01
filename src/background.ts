import { DEFAULT_STATE } from "./domain/defaults";
import { handleTimerAlarm, reconcileTimer } from "./platform/background-controller";
import { scheduleTimerAlarm } from "./platform/alarms";
import { BADGE_ALARM, refreshBadge } from "./platform/badge";
import { notifyCompletion } from "./platform/notifications";
import { RING_MESSAGE, isChimeMessage, ringChime } from "./platform/sound";
import { loadState, saveState, validateImportedState } from "./platform/storage";

const dependencies = {
  load: loadState,
  save: saveState,
  notify: notifyCompletion,
  chime: ringChime,
  now: Date.now,
  schedule: scheduleTimerAlarm,
};

const paintBadge = () => loadState().then((state) => refreshBadge(state, Date.now()));

chrome.runtime.onInstalled.addListener(() => {
  void loadState()
    .then((state) => {
      if (state.version !== 1) return saveState(structuredClone(DEFAULT_STATE));
    })
    .then(() => reconcileTimer(dependencies))
    .then(paintBadge);
});

chrome.runtime.onStartup.addListener(() => {
  void reconcileTimer(dependencies).then(paintBadge);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === BADGE_ALARM) void paintBadge();
  else void handleTimerAlarm(alarm.name, dependencies);
});

// Every start, pause, resume, cancel and completion goes through storage.
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || !changes.appState?.newValue) return;
  const result = validateImportedState(changes.appState.newValue);
  if (result.ok) void refreshBadge(result.state, Date.now());
});

chrome.runtime.onMessage.addListener((message: unknown) => {
  if (isChimeMessage(message, RING_MESSAGE)) void ringChime(message.kind).catch(() => undefined);
});
