import { DEFAULT_STATE } from "../domain/defaults";
import { startSession } from "../domain/timer";
import { BADGE_ALARM, refreshBadge } from "./badge";

function stubChrome() {
  const chromeStub = {
    action: { setBadgeText: vi.fn(), setBadgeBackgroundColor: vi.fn(), setBadgeTextColor: vi.fn() },
    alarms: { create: vi.fn(), clear: vi.fn() },
  };
  vi.stubGlobal("chrome", chromeStub);
  return chromeStub;
}

describe("refreshBadge", () => {
  afterEach(() => vi.unstubAllGlobals());
  const now = Date.UTC(2026, 9, 1, 12);

  it("shows the minutes and re-arms itself while a session runs", async () => {
    const stub = stubChrome();
    const state = { ...structuredClone(DEFAULT_STATE), timer: startSession("focus", 25, now, "f") };

    await refreshBadge(state, now);

    expect(stub.action.setBadgeText).toHaveBeenCalledWith({ text: "25" });
    expect(stub.alarms.create).toHaveBeenCalledWith(BADGE_ALARM, { when: now + 60_000 });
  });

  it("clears the badge and its alarm when nothing runs", async () => {
    const stub = stubChrome();

    await refreshBadge(structuredClone(DEFAULT_STATE), now);

    expect(stub.action.setBadgeText).toHaveBeenCalledWith({ text: "" });
    expect(stub.alarms.clear).toHaveBeenCalledWith(BADGE_ALARM);
  });
});
