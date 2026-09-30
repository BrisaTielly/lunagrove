import { fireEvent, render, screen } from "@testing-library/react";

import { GardenView } from "./GardenView";

describe("GardenView", () => {
  it("tells the garden story even before the first focus", () => {
    render(
      <GardenView
        totalFocusSessions={0}
        reducedMotion={false}
        onBack={vi.fn()}
        onOpenSettings={vi.fn()}
      />,
    );

    expect(screen.getByRole("img", { name: "Lumi tending the garden" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Waiting seed bed" })).toBeVisible();
    expect(screen.getByText("Complete a focus to plant the first seed.")).toBeVisible();
    expect(screen.getByTestId("garden-ambient")).toBeInTheDocument();
  });

  it("shows one permanent garden detail per completed focus", () => {
    render(
      <GardenView
        totalFocusSessions={7}
        reducedMotion={false}
        onBack={vi.fn()}
        onOpenSettings={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Lumi's Garden" })).toBeVisible();
    expect(screen.getByText("7 / 20")).toBeVisible();
    expect(screen.getAllByTestId("garden-detail")).toHaveLength(7);
    expect(screen.getByText("Lily pad")).toBeInTheDocument();
    expect(screen.queryByText("Silver reeds")).not.toBeInTheDocument();
  });

  it("clamps a completed garden to twenty details", () => {
    render(
      <GardenView
        totalFocusSessions={99}
        reducedMotion
        onBack={vi.fn()}
        onOpenSettings={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId("garden-detail")).toHaveLength(20);
    expect(screen.getByRole("region", { name: "Lumi's garden" })).toHaveClass(
      "garden-shell--still",
    );
  });

  it("returns home and keeps settings accessible", () => {
    const onBack = vi.fn();
    const onOpenSettings = vi.fn();
    render(
      <GardenView
        totalFocusSessions={2}
        reducedMotion={false}
        onBack={onBack}
        onOpenSettings={onOpenSettings}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Back to home" }));
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));

    expect(onBack).toHaveBeenCalledOnce();
    expect(onOpenSettings).toHaveBeenCalledOnce();
  });
});
