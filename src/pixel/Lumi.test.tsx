import { act, fireEvent, render, screen } from "@testing-library/react";

import { Lumi } from "./Lumi";

describe("Lumi", () => {
  afterEach(() => vi.useRealTimers());

  it("shows her mood for each timer state", () => {
    const { rerender, container } = render(<Lumi state="rest" />);
    expect(container.querySelector(".lumi-zzz")).not.toBeNull();

    rerender(<Lumi state="paused" />);
    expect(container.querySelector(".lumi-bubble")).not.toBeNull();

    rerender(<Lumi state="celebrate" />);
    expect(container.querySelectorAll(".lumi-eye-happy")).toHaveLength(2);
    expect(container.querySelector(".lumi-burst")).not.toBeNull();
  });

  it("smiles and sends a heart when petted, then settles", () => {
    vi.useFakeTimers();
    const { container } = render(<Lumi state="idle" />);

    fireEvent.click(screen.getByRole("button", { name: "Pet Lumi" }));
    expect(container.querySelector(".lumi-heart")).not.toBeNull();
    expect(container.querySelectorAll(".lumi-eye-happy")).toHaveLength(2);

    act(() => vi.advanceTimersByTime(1300));
    expect(container.querySelector(".lumi-heart")).toBeNull();
  });

  it("dresses for the season", () => {
    const { container, rerender } = render(<Lumi state="idle" season="winter" />);
    expect(container.querySelector("[data-accessory='winter']")).not.toBeNull();

    rerender(<Lumi state="idle" season={null} />);
    expect(container.querySelector(".lumi-accessory")).toBeNull();
  });
});
