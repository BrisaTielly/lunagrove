import { render, screen } from "@testing-library/react";

import { Lumi, type LumiState } from "./Lumi";

describe("Lumi", () => {
  it.each<LumiState>(["idle", "blink", "water", "walk", "celebrate", "rest"])(
    "renders the %s sprite state",
    (state) => {
      render(<Lumi state={state} />);

      const sprite = screen.getByRole("img", { name: /Lumi/i });
      expect(sprite).toHaveAttribute("data-state", state);
      expect(sprite).toHaveClass(`lumi--${state}`);
    },
  );

  it("uses a static frame when reduced motion is requested", () => {
    render(<Lumi state="water" reducedMotion />);

    expect(screen.getByRole("img", { name: /Lumi/i })).toHaveClass(
      "lumi--reduced-motion",
    );
  });
});
