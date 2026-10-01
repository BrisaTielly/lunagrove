import { fireEvent, render, screen } from "@testing-library/react";

import { DEFAULT_STATE } from "../../domain/defaults";
import { SettingsDialog } from "./SettingsDialog";

describe("SettingsDialog", () => {
  it("saves valid timer and comfort preferences", () => {
    const onSave = vi.fn();
    const onPreviewSound = vi.fn();
    render(
      <SettingsDialog
        preferences={DEFAULT_STATE.preferences}
        onClose={() => undefined}
        onSave={onSave}
        onExport={() => undefined}
        onImport={async () => ({ ok: true })}
        onPreviewSound={onPreviewSound}
      />,
    );

    fireEvent.change(screen.getByLabelText("Focus duration"), { target: { value: "45" } });
    fireEvent.change(screen.getByLabelText("Break duration"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("Long break duration"), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText("Long break every"), { target: { value: "3" } });
    fireEvent.click(screen.getByLabelText("Start breaks automatically"));
    fireEvent.click(screen.getByLabelText("Play sounds"));
    expect(onPreviewSound).toHaveBeenCalledOnce();
    fireEvent.change(screen.getByLabelText("Motion"), { target: { value: "true" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSave).toHaveBeenCalledWith({
      focusMinutes: 45,
      breakMinutes: 10,
      longBreakMinutes: 20,
      longBreakEvery: 3,
      autoStartBreaks: true,
      soundEnabled: true,
      notificationsEnabled: true,
      reducedMotion: true,
    });
  });

  it("keeps invalid durations from being saved", () => {
    const onSave = vi.fn();
    const onPreviewSound = vi.fn();
    render(
      <SettingsDialog
        preferences={DEFAULT_STATE.preferences}
        onClose={() => undefined}
        onSave={onSave}
        onExport={() => undefined}
        onImport={async () => ({ ok: true })}
        onPreviewSound={onPreviewSound}
      />,
    );

    fireEvent.change(screen.getByLabelText("Focus duration"), { target: { value: "181" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByRole("alert")).toHaveTextContent("between 1 and 180 minutes");
    expect(onSave).not.toHaveBeenCalled();
  });

  it("keeps the long-break rhythm within bounds", () => {
    const onSave = vi.fn();
    render(
      <SettingsDialog
        preferences={DEFAULT_STATE.preferences}
        onClose={() => undefined}
        onSave={onSave}
        onExport={() => undefined}
        onImport={async () => ({ ok: true })}
        onPreviewSound={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText("Long break every"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByRole("alert")).toHaveTextContent("every 2 to 12 focus sessions");
    expect(onSave).not.toHaveBeenCalled();
  });
});
