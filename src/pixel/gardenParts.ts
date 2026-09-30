// Generated from the garden artwork: where each unlock piece sits in the scene
// and where it lives in lunagrove-garden-parts.png. Unlock = journey stage - 1.
export interface GardenPart {
  unlock: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  atlasX: number;
  atlasY: number;
}

export const GARDEN_ATLAS = { width: 340, height: 458 };

export const GARDEN_PARTS: GardenPart[] = [
  { unlock: 0, name: "seed", x: 168, y: 498, width: 39, height: 21, atlasX: 0, atlasY: 0 },
  { unlock: 1, name: "first-leaves", x: 171, y: 468, width: 33, height: 39, atlasX: 41, atlasY: 0 },
  { unlock: 2, name: "moon-flower", x: 204, y: 441, width: 27, height: 69, atlasX: 76, atlasY: 0 },
  { unlock: 3, name: "soft-grass-0", x: 6, y: 510, width: 18, height: 18, atlasX: 105, atlasY: 0 },
  { unlock: 3, name: "soft-grass-1", x: 171, y: 516, width: 18, height: 18, atlasX: 125, atlasY: 0 },
  { unlock: 3, name: "soft-grass-2", x: 309, y: 501, width: 18, height: 18, atlasX: 145, atlasY: 0 },
  { unlock: 3, name: "soft-grass-3", x: 375, y: 513, width: 18, height: 18, atlasX: 165, atlasY: 0 },
  { unlock: 3, name: "soft-grass-4", x: 435, y: 498, width: 18, height: 18, atlasX: 185, atlasY: 0 },
  { unlock: 3, name: "soft-grass-5", x: 267, y: 444, width: 18, height: 18, atlasX: 205, atlasY: 0 },
  { unlock: 4, name: "garden-patch", x: 237, y: 483, width: 60, height: 36, atlasX: 225, atlasY: 0 },
  { unlock: 5, name: "pond-water", x: 171, y: 378, width: 324, height: 87, atlasX: 0, atlasY: 71 },
  { unlock: 6, name: "lily-pad", x: 198, y: 387, width: 81, height: 39, atlasX: 0, atlasY: 160 },
  { unlock: 7, name: "silver-reeds", x: 174, y: 360, width: 132, height: 60, atlasX: 83, atlasY: 160 },
  { unlock: 9, name: "moon-reflection", x: 237, y: 399, width: 33, height: 21, atlasX: 217, atlasY: 160 },
  { unlock: 10, name: "stone-path", x: 300, y: 378, width: 81, height: 156, atlasX: 252, atlasY: 160 },
  { unlock: 11, name: "little-bridge", x: 330, y: 408, width: 54, height: 39, atlasX: 0, atlasY: 318 },
  { unlock: 12, name: "garden-lantern", x: 375, y: 444, width: 27, height: 72, atlasX: 56, atlasY: 318 },
  { unlock: 13, name: "traveler-marker", x: 297, y: 453, width: 42, height: 45, atlasX: 85, atlasY: 318 },
  { unlock: 14, name: "moon-gate", x: 324, y: 321, width: 75, height: 69, atlasX: 129, atlasY: 318 },
  { unlock: 15, name: "shrine-steps", x: 378, y: 291, width: 51, height: 48, atlasX: 206, atlasY: 318 },
  { unlock: 16, name: "lunar-runes", x: 393, y: 243, width: 93, height: 45, atlasX: 0, atlasY: 392 },
  { unlock: 17, name: "moon-altar", x: 402, y: 258, width: 33, height: 33, atlasX: 95, atlasY: 392 },
  { unlock: 19, name: "lunar-shrine", x: 429, y: 225, width: 51, height: 66, atlasX: 130, atlasY: 392 },
];
