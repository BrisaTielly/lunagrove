import type { Season } from "../domain/seasons";
import moonBase from "../assets/pixel/gardens/garden-moon.png";
import moonParts from "../assets/pixel/gardens/garden-moon-parts.png";
import moonSpring from "../assets/pixel/gardens/garden-moon-spring.png";
import moonSummer from "../assets/pixel/gardens/garden-moon-summer.png";
import moonAutumn from "../assets/pixel/gardens/garden-moon-autumn.png";
import moonWinter from "../assets/pixel/gardens/garden-moon-winter.png";
import mushroomBase from "../assets/pixel/gardens/garden-mushroom.png";
import mushroomParts from "../assets/pixel/gardens/garden-mushroom-parts.png";
import mushroomSpring from "../assets/pixel/gardens/garden-mushroom-spring.png";
import mushroomSummer from "../assets/pixel/gardens/garden-mushroom-summer.png";
import mushroomAutumn from "../assets/pixel/gardens/garden-mushroom-autumn.png";
import mushroomWinter from "../assets/pixel/gardens/garden-mushroom-winter.png";
import { MOON_ATLAS, MOON_PARTS, MUSHROOM_ATLAS, MUSHROOM_PARTS, type GardenPart } from "./gardenParts";

export const STEPS_PER_GARDEN = 20;

export interface GardenDef {
  id: "moon" | "mushroom";
  title: string;
  unlocks: string[];
  // Who moves in at the end of each chapter, keyed by step.
  visitors: Record<number, string>;
  parts: GardenPart[];
  atlas: { width: number; height: number };
  partsImage: string;
  scene: string;
  seasonScenes: Record<Season, string>;
  // Steps (0-based) whose detail is an effect rather than a drawn piece.
  effects: { fireflies?: number; spores?: number; lampGlow?: number; shrineLight?: number };
}

export const GARDENS: GardenDef[] = [
  {
    id: "moon",
    title: "Moon Garden",
    unlocks: [
      "seed", "first-leaves", "moon-flower", "soft-grass", "garden-patch",
      "pond-water", "lily-pad", "silver-reeds", "fireflies", "moon-reflection",
      "stone-path", "little-bridge", "garden-lantern", "traveler-marker", "moon-gate",
      "shrine-steps", "lunar-runes", "moon-altar", "shrine-light", "lunar-shrine",
    ],
    visitors: { 5: "a bunny", 10: "a frog", 15: "an owl", 20: "a moon fox" },
    parts: MOON_PARTS,
    atlas: MOON_ATLAS,
    partsImage: moonParts,
    scene: moonBase,
    seasonScenes: { spring: moonSpring, summer: moonSummer, autumn: moonAutumn, winter: moonWinter },
    effects: { fireflies: 8, lampGlow: 12, shrineLight: 18 },
  },
  {
    id: "mushroom",
    title: "Mushroom Hollow",
    unlocks: [
      "moss-patch", "tiny-mushroom", "fern", "mushroom-cluster", "mushroom-ring",
      "blue-mushrooms", "glowworms", "crystals", "spring", "floating-spores",
      "root-bridge", "stepping-stones", "lantern-vines", "acorn-house", "shelf-mushrooms",
      "elder-tree", "glowing-runes", "moon-pool", "spore-beam", "elder-mushroom",
    ],
    visitors: { 5: "a snail", 10: "a hedgehog", 15: "a moth", 20: "a spirit deer" },
    parts: MUSHROOM_PARTS,
    atlas: MUSHROOM_ATLAS,
    partsImage: mushroomParts,
    scene: mushroomBase,
    seasonScenes: { spring: mushroomSpring, summer: mushroomSummer, autumn: mushroomAutumn, winter: mushroomWinter },
    effects: { spores: 9 },
  },
];

export const JOURNEY_LENGTH = GARDENS.length * STEPS_PER_GARDEN;

export interface Journey {
  // Index of the garden being grown now (the last one stays once everything is done).
  garden: number;
  // Steps reached in that garden, 0–20.
  stage: number;
  // Total focus sessions counted towards gardens, capped at the journey length.
  steps: number;
  complete: boolean;
}

export function journey(totalFocusSessions: number): Journey {
  const steps = Math.min(
    JOURNEY_LENGTH,
    Number.isFinite(totalFocusSessions) ? Math.max(0, Math.floor(totalFocusSessions)) : 0,
  );
  // A finished garden stays on screen until the next focus opens the following one.
  const garden = steps === 0 ? 0 : Math.min(GARDENS.length - 1, Math.floor((steps - 1) / STEPS_PER_GARDEN));
  return { garden, stage: steps - garden * STEPS_PER_GARDEN, steps, complete: steps === JOURNEY_LENGTH };
}
