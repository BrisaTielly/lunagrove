import { fireEvent, render, screen } from "@testing-library/react";

import { GARDENS } from "./gardens";
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

    expect(screen.getByRole("img", { name: "Lumi, tending the garden" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Waiting seed bed" })).toBeVisible();
    expect(screen.getByText("Complete a focus to plant the first seed.")).toBeVisible();
    expect(screen.queryAllByTestId("garden-detail")).toHaveLength(0);
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

    expect(screen.getByRole("heading", { name: "Moon Garden" })).toBeVisible();
    expect(screen.getByText("7 / 20")).toBeVisible();
    expect(screen.getAllByTestId("garden-detail")).toHaveLength(7);
    expect(screen.getByText("Lily pad")).toBeInTheDocument();
    expect(screen.queryByText("Silver reeds")).not.toBeInTheDocument();
    expect(screen.getByText("Next: Silver reeds")).toBeVisible();
    expect(screen.queryByRole("img", { name: "Waiting seed bed" })).not.toBeInTheDocument();
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

  it.each(GARDENS.map((garden) => [garden.id, garden] as const))(
    "draws every step of the %s garden that is not an effect-only detail",
    (_, garden) => {
      const drawn = new Set(garden.parts.map((part) => part.unlock));
      const effects = Object.values(garden.effects);

      expect(garden.unlocks).toHaveLength(20);
      for (let unlock = 0; unlock < 20; unlock += 1) {
        expect(drawn.has(unlock) || effects.includes(unlock), `unlock ${unlock}`).toBe(true);
      }
      for (const stage of [5, 10, 15, 20]) {
        const visitor = garden.parts.find((part) => part.name.startsWith("visitor-") && part.unlock === stage - 1);
        expect(visitor, `visitor at ${stage}`).toBeDefined();
      }
    },
  );

  it("opens the second garden after twenty focus sessions and keeps the first one to revisit", () => {
    render(<GardenView totalFocusSessions={23} reducedMotion={false} onBack={vi.fn()} onOpenSettings={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Mushroom Hollow" })).toBeVisible();
    expect(screen.getByText("3 / 20")).toBeInTheDocument();
    expect(screen.getAllByTestId("garden-detail")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "Moon Garden" }));

    expect(screen.getByRole("heading", { name: "Moon Garden" })).toBeVisible();
    expect(screen.getAllByTestId("garden-detail")).toHaveLength(20);
  });

  it("animates only the newest unlock in", () => {
    const { container } = render(
      <GardenView totalFocusSessions={3} reducedMotion={false} onBack={vi.fn()} onOpenSettings={vi.fn()} />,
    );

    const details = container.querySelectorAll(".garden-detail");
    expect(details[2]).toHaveClass("garden-detail--new");
    expect(details[0]).not.toHaveClass("garden-detail--new");
  });
});
