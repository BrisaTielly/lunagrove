import { render } from "@testing-library/react";

import { SeasonLayer } from "./SeasonLayer";

describe("SeasonLayer", () => {
  it("draws the weather of the current season", () => {
    const { container } = render(<SeasonLayer season="autumn" />);

    expect(container.querySelector("[data-season='autumn']")).not.toBeNull();
    expect(container.querySelectorAll(".season-particle").length).toBeGreaterThan(0);
  });

  it("draws nothing when seasons are off", () => {
    const { container } = render(<SeasonLayer season={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
