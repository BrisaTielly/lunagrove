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
import moonFront from "../assets/pixel/gardens/garden-moon-front.png";
import moonSpringFront from "../assets/pixel/gardens/garden-moon-spring-front.png";
import moonSummerFront from "../assets/pixel/gardens/garden-moon-summer-front.png";
import moonAutumnFront from "../assets/pixel/gardens/garden-moon-autumn-front.png";
import moonWinterFront from "../assets/pixel/gardens/garden-moon-winter-front.png";
import mushroomFront from "../assets/pixel/gardens/garden-mushroom-front.png";
import mushroomSpringFront from "../assets/pixel/gardens/garden-mushroom-spring-front.png";
import mushroomSummerFront from "../assets/pixel/gardens/garden-mushroom-summer-front.png";
import mushroomAutumnFront from "../assets/pixel/gardens/garden-mushroom-autumn-front.png";
import mushroomWinterFront from "../assets/pixel/gardens/garden-mushroom-winter-front.png";
import { MOON_ATLAS, MOON_PARTS, MUSHROOM_ATLAS, MUSHROOM_PARTS, type GardenPart } from "./gardenParts";

export const STEPS_PER_GARDEN = 20;

// A place Lumi likes to rest in a garden (prototype pixels, her feet at `bottom`).
export interface RestSpot {
  left: number;
  bottom: number;
  facing: "left" | "right";
  // Under a canopy: she sits in its shadow.
  shade?: boolean;
}

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
  // The scene's bright grass blades alone, drawn over Lumi's feet.
  front: string;
  seasonFronts: Record<Season, string>;
  // Lumi's resting places; the first is where she waits before anything grows.
  spots: RestSpot[];
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
    front: moonFront,
    seasonFronts: { spring: moonSpringFront, summer: moonSummerFront, autumn: moonAutumnFront, winter: moonWinterFront },
    spots: [
      { left: 44, bottom: 318, facing: "right", shade: true },
      { left: 120, bottom: 470, facing: "right" },
      { left: 300, bottom: 448, facing: "left" },
      { left: 60, bottom: 512, facing: "right" },
    ],
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
    front: mushroomFront,
    seasonFronts: {
      spring: mushroomSpringFront,
      summer: mushroomSummerFront,
      autumn: mushroomAutumnFront,
      winter: mushroomWinterFront,
    },
    spots: [
      { left: 70, bottom: 338, facing: "right", shade: true },
      { left: 110, bottom: 470, facing: "right" },
      { left: 290, bottom: 432, facing: "left" },
      { left: 360, bottom: 330, facing: "left", shade: true },
    ],
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
