import type { SessionKind } from "../domain/types";

export interface ChimeNote {
  frequency: number;
  start: number;
  duration: number;
  wave: OscillatorType;
}

// A short chiptune "level up" for focus and a softer two-note bell for breaks.
export const CHIMES: Record<SessionKind, ChimeNote[]> = {
  focus: [
    { frequency: 523.25, start: 0, duration: 0.5, wave: "triangle" },
    { frequency: 1046.5, start: 0, duration: 0.14, wave: "square" },
    { frequency: 1318.51, start: 0.09, duration: 0.14, wave: "square" },
    { frequency: 1567.98, start: 0.18, duration: 0.14, wave: "square" },
    { frequency: 2093, start: 0.27, duration: 0.5, wave: "square" },
  ],
  break: [
    { frequency: 783.99, start: 0, duration: 0.4, wave: "triangle" },
    { frequency: 1046.5, start: 0.16, duration: 0.7, wave: "triangle" },
  ],
};

const VOLUME = 0.12;

export function playChime(context: AudioContext, kind: SessionKind): void {
  const master = context.createGain();
  master.gain.value = VOLUME;
  master.connect(context.destination);

  const origin = context.currentTime + 0.02;
  for (const note of CHIMES[kind]) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = origin + note.start;
    const end = start + note.duration;

    oscillator.type = note.wave;
    oscillator.frequency.value = note.frequency;
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(note.wave === "square" ? 0.5 : 1, start + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(envelope).connect(master);
    oscillator.start(start);
    oscillator.stop(end + 0.05);
  }
}
