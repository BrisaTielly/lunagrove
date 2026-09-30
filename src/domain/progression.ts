export type AmbientEffect =
  | "shooting-star"
  | "fireflies"
  | "aurora"
  | "spirit-visitor";

const AMBIENT_EFFECTS: AmbientEffect[] = [
  "shooting-star",
  "fireflies",
  "aurora",
  "spirit-visitor",
];

export interface Progression {
  stage: number;
  ambientEffect: AmbientEffect | null;
}

export function getProgression(totalFocusSessions: number): Progression {
  const safeTotal = Math.max(0, Math.floor(totalFocusSessions));
  const { stage } = pixelProgress(safeTotal);

  if (safeTotal <= 20) {
    return { stage, ambientEffect: null };
  }

  return {
    stage,
    ambientEffect: AMBIENT_EFFECTS[(safeTotal - 21) % AMBIENT_EFFECTS.length],
  };
}
import { pixelProgress } from "../pixel/progression";
