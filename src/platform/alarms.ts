const TIMER_ALARM_PREFIX = "timer:";

export function timerAlarmName(sessionId: string): string {
  return `${TIMER_ALARM_PREFIX}${sessionId}`;
}

export function sessionIdFromAlarm(name: string): string | null {
  if (!name.startsWith(TIMER_ALARM_PREFIX)) return null;
  const sessionId = name.slice(TIMER_ALARM_PREFIX.length);
  return sessionId.length > 0 ? sessionId : null;
}

export async function scheduleTimerAlarm(
  sessionId: string,
  endsAt: number,
): Promise<void> {
  await clearTimerAlarms();
  await chrome.alarms.create(timerAlarmName(sessionId), { when: endsAt });
}

export async function clearTimerAlarm(sessionId: string): Promise<void> {
  await chrome.alarms.clear(timerAlarmName(sessionId));
}

export async function clearTimerAlarms(): Promise<void> {
  const alarms = await chrome.alarms.getAll();
  await Promise.all(
    alarms
      .filter((alarm) => sessionIdFromAlarm(alarm.name) !== null)
      .map((alarm) => chrome.alarms.clear(alarm.name)),
  );
}
