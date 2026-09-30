import { CHIMES, playChime } from "./chime";

function fakeContext() {
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
  const oscillators: { type: string; frequency: { value: number }; start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }[] = [];
  const node = () => ({ connect: vi.fn((next) => next) });
  const context = {
    currentTime: 1,
    destination: {},
    createGain: () => ({ ...node(), gain: param() }),
    createOscillator: () => {
      const oscillator = { ...node(), type: "", frequency: { value: 0 }, start: vi.fn(), stop: vi.fn() };
      oscillators.push(oscillator);
      return oscillator;
    },
  };
  return { context: context as unknown as AudioContext, oscillators };
}

describe("chime", () => {
  it("rises in pitch for a finished focus", () => {
    const melody = CHIMES.focus.filter((note) => note.wave === "square").map((note) => note.frequency);
    expect(melody).toEqual([...melody].sort((a, b) => a - b));
  });

  it("stays shorter than a second so it never lingers", () => {
    for (const notes of Object.values(CHIMES)) {
      expect(Math.max(...notes.map((note) => note.start + note.duration))).toBeLessThan(1);
    }
  });

  it("schedules one oscillator per note", () => {
    const { context, oscillators } = fakeContext();

    playChime(context, "break");

    expect(oscillators.map((oscillator) => oscillator.frequency.value)).toEqual(CHIMES.break.map((note) => note.frequency));
    for (const oscillator of oscillators) expect(oscillator.start).toHaveBeenCalledOnce();
  });
});
