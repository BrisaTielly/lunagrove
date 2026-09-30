import { DEFAULT_STATE } from "./domain/defaults";
import { handleTimerAlarm } from "./platform/background-controller";
import { notifyCompletion } from "./platform/notifications";
import { loadState, saveState } from "./platform/storage";

chrome.runtime.onInstalled.addListener(() => {
  void loadState().then((state) => {
    if (state.version !== 1) return saveState(structuredClone(DEFAULT_STATE));
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  void handleTimerAlarm(alarm.name, {
    load: loadState,
    save: saveState,
    notify: notifyCompletion,
    now: Date.now,
  });
});
