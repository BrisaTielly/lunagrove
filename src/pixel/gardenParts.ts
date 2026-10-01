// Generated from the Codex artwork: where each piece sits in the scene and in its atlas.
// `unlock` is the 0-based step within the garden (step 1 = unlock 0).
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

export const MOON_ATLAS = { width: 360, height: 260 };
export const MOON_PARTS: GardenPart[] = [
  { unlock: 14, name: "visitor-owl", x: 89, y: 231, width: 30, height: 34, atlasX: 0, atlasY: 0 },
  { unlock: 19, name: "lunar-shrine", x: 404, y: 221, width: 80, height: 68, atlasX: 32, atlasY: 0 },
  { unlock: 19, name: "visitor-moon-fox", x: 398, y: 263, width: 35, height: 30, atlasX: 114, atlasY: 0 },
  { unlock: 17, name: "moon-altar", x: 354, y: 267, width: 42, height: 36, atlasX: 151, atlasY: 0 },
  { unlock: 16, name: "lunar-runes-a", x: 348, y: 308, width: 15, height: 24, atlasX: 195, atlasY: 0 },
  { unlock: 15, name: "shrine-steps", x: 406, y: 292, width: 55, height: 43, atlasX: 212, atlasY: 0 },
  { unlock: 16, name: "lunar-runes-b", x: 463, y: 325, width: 14, height: 20, atlasX: 269, atlasY: 0 },
  { unlock: 11, name: "little-bridge", x: 240, y: 315, width: 73, height: 47, atlasX: 285, atlasY: 0 },
  { unlock: 5, name: "pond-water", x: 53, y: 296, width: 205, height: 80, atlasX: 0, atlasY: 70 },
  { unlock: 6, name: "lily-pad", x: 101, y: 333, width: 51, height: 20, atlasX: 207, atlasY: 70 },
  { unlock: 6, name: "lily-pad-flower", x: 69, y: 326, width: 32, height: 24, atlasX: 260, atlasY: 70 },
  { unlock: 8, name: "moon-reflection", x: 169, y: 336, width: 33, height: 24, atlasX: 294, atlasY: 70 },
  { unlock: 7, name: "silver-reeds", x: 207, y: 301, width: 20, height: 31, atlasX: 329, atlasY: 70 },
  { unlock: 9, name: "visitor-frog", x: 113, y: 320, width: 26, height: 18, atlasX: 0, atlasY: 152 },
  { unlock: 14, name: "moon-gate", x: 396, y: 323, width: 60, height: 59, atlasX: 28, atlasY: 152 },
  { unlock: 12, name: "garden-lantern", x: 327, y: 373, width: 19, height: 36, atlasX: 90, atlasY: 152 },
  { unlock: 13, name: "traveler-marker", x: 228, y: 387, width: 16, height: 31, atlasX: 111, atlasY: 152 },
  { unlock: 2, name: "moon-flower", x: 232, y: 430, width: 38, height: 42, atlasX: 129, atlasY: 152 },
  { unlock: 1, name: "first-leaves", x: 196, y: 460, width: 33, height: 28, atlasX: 169, atlasY: 152 },
  { unlock: 0, name: "seed", x: 195, y: 470, width: 34, height: 19, atlasX: 204, atlasY: 152 },
  { unlock: 10, name: "stone-path-3", x: 393, y: 439, width: 20, height: 11, atlasX: 240, atlasY: 152 },
  { unlock: 10, name: "stone-path-2", x: 355, y: 480, width: 25, height: 14, atlasX: 262, atlasY: 152 },
  { unlock: 10, name: "stone-path-1", x: 382, y: 453, width: 21, height: 11, atlasX: 289, atlasY: 152 },
  { unlock: 10, name: "stone-path-0", x: 367, y: 466, width: 23, height: 12, atlasX: 312, atlasY: 152 },
  { unlock: 3, name: "soft-grass-b", x: 437, y: 477, width: 40, height: 22, atlasX: 0, atlasY: 213 },
  { unlock: 3, name: "soft-grass-a", x: 372, y: 492, width: 51, height: 29, atlasX: 42, atlasY: 213 },
  { unlock: 4, name: "visitor-bunny", x: 232, y: 491, width: 30, height: 35, atlasX: 95, atlasY: 213 },
  { unlock: 4, name: "garden-patch", x: 269, y: 483, width: 88, height: 47, atlasX: 127, atlasY: 213 },
];

export const MUSHROOM_ATLAS = { width: 360, height: 476 };
export const MUSHROOM_PARTS: GardenPart[] = [
  { unlock: 14, name: "visitor-moth", x: 196, y: 188, width: 33, height: 29, atlasX: 0, atlasY: 0 },
  { unlock: 6, name: "glowworms", x: 93, y: 167, width: 102, height: 83, atlasX: 35, atlasY: 0 },
  { unlock: 12, name: "lantern-vines", x: 396, y: 196, width: 64, height: 104, atlasX: 139, atlasY: 0 },
  { unlock: 14, name: "shelf-mushrooms", x: 24, y: 198, width: 55, height: 115, atlasX: 205, atlasY: 0 },
  { unlock: 19, name: "elder-mushroom", x: 247, y: 188, width: 132, height: 131, atlasX: 0, atlasY: 117 },
  { unlock: 19, name: "visitor-spirit-deer", x: 334, y: 257, width: 37, height: 63, atlasX: 134, atlasY: 117 },
  { unlock: 18, name: "spore-beam", x: 260, y: 277, width: 21, height: 59, atlasX: 173, atlasY: 117 },
  { unlock: 13, name: "acorn-house", x: 206, y: 291, width: 60, height: 58, atlasX: 196, atlasY: 117 },
  { unlock: 9, name: "visitor-hedgehog", x: 166, y: 322, width: 38, height: 28, atlasX: 258, atlasY: 117 },
  { unlock: 8, name: "spring", x: 350, y: 324, width: 84, height: 51, atlasX: 0, atlasY: 250 },
  { unlock: 2, name: "fern", x: 73, y: 347, width: 55, height: 35, atlasX: 86, atlasY: 250 },
  { unlock: 15, name: "elder-tree", x: 398, y: 270, width: 71, height: 112, atlasX: 143, atlasY: 250 },
  { unlock: 16, name: "glowing-runes", x: 470, y: 317, width: 22, height: 35, atlasX: 216, atlasY: 250 },
  { unlock: 10, name: "root-bridge", x: 247, y: 375, width: 88, height: 38, atlasX: 240, atlasY: 250 },
  { unlock: 1, name: "tiny-mushroom", x: 195, y: 398, width: 17, height: 18, atlasX: 330, atlasY: 250 },
  { unlock: 17, name: "moon-pool", x: 339, y: 391, width: 86, height: 59, atlasX: 0, atlasY: 364 },
  { unlock: 4, name: "mushroom-ring", x: 247, y: 390, width: 44, height: 63, atlasX: 88, atlasY: 364 },
  { unlock: 3, name: "mushroom-cluster", x: 168, y: 418, width: 35, height: 46, atlasX: 134, atlasY: 364 },
  { unlock: 5, name: "blue-mushrooms", x: 390, y: 424, width: 59, height: 58, atlasX: 171, atlasY: 364 },
  { unlock: 7, name: "crystals", x: 421, y: 479, width: 55, height: 46, atlasX: 232, atlasY: 364 },
  { unlock: 0, name: "moss-patch", x: 194, y: 500, width: 84, height: 26, atlasX: 0, atlasY: 429 },
  { unlock: 4, name: "visitor-snail", x: 219, y: 486, width: 33, height: 23, atlasX: 86, atlasY: 429 },
  { unlock: 11, name: "stepping-stones-6", x: 358, y: 510, width: 43, height: 24, atlasX: 121, atlasY: 429 },
  { unlock: 11, name: "stepping-stones-5", x: 335, y: 494, width: 39, height: 20, atlasX: 166, atlasY: 429 },
  { unlock: 11, name: "stepping-stones-4", x: 284, y: 450, width: 63, height: 47, atlasX: 207, atlasY: 429 },
];
