import { render } from "@testing-library/react";

import { GLYPHS, PixelDigits } from "./PixelDigits";

describe("PixelDigits", () => {
  it("keeps every glyph on the 16-row prototype grid", () => {
    for (const [char, rows] of Object.entries(GLYPHS)) {
      expect(rows, char).toHaveLength(16);
      const width = /\d/.test(char) ? 10 : rows[0].length;
      for (const row of rows) expect(row, char).toMatch(new RegExp(`^[.#]{${width}}$`));
    }
  });

  it("lays out a clock with the prototype spacing", () => {
    const { container } = render(<PixelDigits text="25:00" unit={2} />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("viewBox", "0 0 53 16");
    expect(svg).toHaveAttribute("width", "106");
    expect(svg?.querySelector("path")?.getAttribute("d")).not.toBe("");
  });

  it("spells the journey counter", () => {
    const { container } = render(<PixelDigits text="20 / 20" unit={1} />);

    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 71 16");
  });
});
