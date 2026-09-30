import { render, screen } from "@testing-library/react";

import { SanctuaryScene } from "./SanctuaryScene";

describe("SanctuaryScene", () => {
  it("describes the current restoration stage", () => {
    render(<SanctuaryScene stage={7} celebrating={false} reducedMotion={false} />);

    expect(screen.getByRole("img")).toHaveAccessibleName(/stage 7 of 20/i);
    expect(screen.getByText("Moonflowers open along the path.")).toBeVisible();
  });

  it("marks celebration and reduced motion without changing progress", () => {
    render(<SanctuaryScene stage={20} celebrating reducedMotion />);

    const scene = screen.getByRole("img");
    expect(scene).toHaveAttribute("data-celebrating", "true");
    expect(scene).toHaveAttribute("data-reduced-motion", "true");
  });
});
