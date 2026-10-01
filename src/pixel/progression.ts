export type PixelChapter = "sprout" | "pond" | "bridge" | "shrine";

const JOURNEY_UNLOCKS = [
  "seed",
  "first-leaves",
  "moon-flower",
  "soft-grass",
  "garden-patch",
  "pond-water",
  "lily-pad",
  "silver-reeds",
  "fireflies",
  "moon-reflection",
  "stone-path",
  "little-bridge",
  "garden-lantern",
  "traveler-marker",
  "moon-gate",
  "shrine-steps",
  "lunar-runes",
  "moon-altar",
  "shrine-light",
  "lunar-shrine",
] as const;

export interface PixelProgress {
  stage: number;
  chapter: PixelChapter;
  mapTile: number;
  filledPips: number;
  unlocks: string[];
}

function chapterFor(stage: number): PixelChapter {
  if (stage <= 5) return "sprout";
  if (stage <= 10) return "pond";
  if (stage <= 15) return "bridge";
  return "shrine";
}

export function pixelProgress(totalFocusSessions: number): PixelProgress {
  const safeTotal = Number.isFinite(totalFocusSessions)
    ? Math.max(0, Math.floor(totalFocusSessions))
    : 0;
  const stage = Math.min(JOURNEY_UNLOCKS.length, safeTotal);

  return {
    stage,
    chapter: chapterFor(stage),
    mapTile: stage,
    filledPips: stage,
    unlocks: JOURNEY_UNLOCKS.slice(0, stage),
  };
}

export function unlockLabel(unlock: string): string {
  const words = unlock.split("-").join(" ");
  return words[0].toUpperCase() + words.slice(1);
}
