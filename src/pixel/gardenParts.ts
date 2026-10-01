// Generated from the Codex artwork on a 2px pixel grid: where each piece sits in the scene
// and in its atlas. `unlock` is the 0-based step within the garden (step 1 = unlock 0).
export interface GardenPart {
  unlock: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  atlasX: number;
  atlasY: number;
  // Sits on the ground and gets a contact shadow.
  shadow: boolean;
}

export const MOON_ATLAS = { width: 400, height: 260 };
export const MOON_PARTS: GardenPart[] = [
  { unlock: 14, name: "visitor-owl", x: 89, y: 231, width: 30, height: 34, atlasX: 0, atlasY: 0, shadow: false },
  { unlock: 19, name: "lunar-shrine", x: 405, y: 221, width: 80, height: 68, atlasX: 32, atlasY: 0, shadow: true },
  { unlock: 19, name: "visitor-moon-fox", x: 399, y: 263, width: 36, height: 30, atlasX: 114, atlasY: 0, shadow: true },
  { unlock: 17, name: "moon-altar", x: 355, y: 267, width: 42, height: 36, atlasX: 152, atlasY: 0, shadow: true },
  { unlock: 16, name: "lunar-runes-a", x: 347, y: 309, width: 14, height: 24, atlasX: 196, atlasY: 0, shadow: false },
  { unlock: 15, name: "shrine-steps", x: 407, y: 291, width: 54, height: 42, atlasX: 212, atlasY: 0, shadow: true },
  { unlock: 16, name: "lunar-runes-b", x: 463, y: 325, width: 14, height: 20, atlasX: 268, atlasY: 0, shadow: false },
  { unlock: 11, name: "little-bridge", x: 239, y: 315, width: 74, height: 48, atlasX: 284, atlasY: 0, shadow: false },
  { unlock: 5, name: "pond-water", x: 53, y: 297, width: 204, height: 80, atlasX: 0, atlasY: 70, shadow: false },
  { unlock: 6, name: "lily-pad", x: 101, y: 333, width: 52, height: 20, atlasX: 206, atlasY: 70, shadow: false },
  { unlock: 6, name: "lily-pad-flower", x: 69, y: 325, width: 32, height: 24, atlasX: 260, atlasY: 70, shadow: false },
  { unlock: 8, name: "moon-reflection", x: 169, y: 335, width: 34, height: 24, atlasX: 294, atlasY: 70, shadow: false },
  { unlock: 7, name: "silver-reeds", x: 207, y: 301, width: 20, height: 30, atlasX: 330, atlasY: 70, shadow: false },
  { unlock: 9, name: "visitor-frog", x: 113, y: 319, width: 26, height: 18, atlasX: 352, atlasY: 70, shadow: false },
  { unlock: 14, name: "moon-gate", x: 397, y: 323, width: 60, height: 60, atlasX: 0, atlasY: 152, shadow: true },
  { unlock: 12, name: "garden-lantern", x: 327, y: 373, width: 18, height: 36, atlasX: 62, atlasY: 152, shadow: true },
  { unlock: 13, name: "traveler-marker", x: 229, y: 387, width: 16, height: 32, atlasX: 82, atlasY: 152, shadow: true },
  { unlock: 2, name: "moon-flower", x: 231, y: 429, width: 38, height: 42, atlasX: 100, atlasY: 152, shadow: true },
  { unlock: 1, name: "first-leaves", x: 195, y: 459, width: 34, height: 28, atlasX: 140, atlasY: 152, shadow: true },
  { unlock: 0, name: "seed", x: 195, y: 471, width: 34, height: 20, atlasX: 176, atlasY: 152, shadow: true },
  { unlock: 10, name: "stone-path-3", x: 393, y: 439, width: 20, height: 12, atlasX: 212, atlasY: 152, shadow: false },
  { unlock: 10, name: "stone-path-2", x: 355, y: 479, width: 26, height: 14, atlasX: 234, atlasY: 152, shadow: false },
  { unlock: 10, name: "stone-path-1", x: 381, y: 453, width: 22, height: 10, atlasX: 262, atlasY: 152, shadow: false },
  { unlock: 10, name: "stone-path-0", x: 367, y: 465, width: 22, height: 12, atlasX: 286, atlasY: 152, shadow: false },
  { unlock: 3, name: "soft-grass-b", x: 437, y: 477, width: 40, height: 22, atlasX: 310, atlasY: 152, shadow: false },
  { unlock: 3, name: "soft-grass-a", x: 371, y: 493, width: 52, height: 28, atlasX: 0, atlasY: 214, shadow: false },
  { unlock: 4, name: "visitor-bunny", x: 233, y: 491, width: 30, height: 36, atlasX: 54, atlasY: 214, shadow: true },
  { unlock: 4, name: "garden-patch", x: 269, y: 483, width: 88, height: 46, atlasX: 86, atlasY: 214, shadow: false },
];

export const MUSHROOM_ATLAS = { width: 400, height: 360 };
export const MUSHROOM_PARTS: GardenPart[] = [
  { unlock: 14, name: "visitor-moth", x: 195, y: 187, width: 32, height: 30, atlasX: 0, atlasY: 0, shadow: false },
  { unlock: 6, name: "glowworms", x: 93, y: 167, width: 102, height: 84, atlasX: 34, atlasY: 0, shadow: false },
  { unlock: 12, name: "lantern-vines", x: 397, y: 195, width: 64, height: 104, atlasX: 138, atlasY: 0, shadow: false },
  { unlock: 14, name: "shelf-mushrooms", x: 25, y: 197, width: 54, height: 114, atlasX: 204, atlasY: 0, shadow: false },
  { unlock: 19, name: "elder-mushroom", x: 247, y: 189, width: 132, height: 132, atlasX: 260, atlasY: 0, shadow: true },
  { unlock: 19, name: "visitor-spirit-deer", x: 335, y: 257, width: 38, height: 62, atlasX: 0, atlasY: 134, shadow: true },
  { unlock: 18, name: "spore-beam", x: 261, y: 277, width: 22, height: 60, atlasX: 40, atlasY: 134, shadow: false },
  { unlock: 13, name: "acorn-house", x: 205, y: 291, width: 60, height: 58, atlasX: 64, atlasY: 134, shadow: true },
  { unlock: 9, name: "visitor-hedgehog", x: 165, y: 323, width: 38, height: 28, atlasX: 126, atlasY: 134, shadow: true },
  { unlock: 8, name: "spring", x: 349, y: 323, width: 84, height: 52, atlasX: 166, atlasY: 134, shadow: true },
  { unlock: 2, name: "fern", x: 73, y: 347, width: 54, height: 36, atlasX: 252, atlasY: 134, shadow: true },
  { unlock: 15, name: "elder-tree", x: 399, y: 269, width: 70, height: 112, atlasX: 308, atlasY: 134, shadow: true },
  { unlock: 16, name: "glowing-runes", x: 469, y: 317, width: 22, height: 36, atlasX: 0, atlasY: 248, shadow: false },
  { unlock: 10, name: "root-bridge", x: 247, y: 375, width: 88, height: 38, atlasX: 24, atlasY: 248, shadow: false },
  { unlock: 1, name: "tiny-mushroom", x: 195, y: 399, width: 16, height: 18, atlasX: 114, atlasY: 248, shadow: true },
  { unlock: 17, name: "moon-pool", x: 339, y: 391, width: 86, height: 58, atlasX: 132, atlasY: 248, shadow: false },
  { unlock: 4, name: "mushroom-ring", x: 247, y: 391, width: 44, height: 64, atlasX: 220, atlasY: 248, shadow: true },
  { unlock: 3, name: "mushroom-cluster", x: 167, y: 419, width: 34, height: 46, atlasX: 266, atlasY: 248, shadow: true },
  { unlock: 5, name: "blue-mushrooms", x: 389, y: 425, width: 58, height: 58, atlasX: 302, atlasY: 248, shadow: true },
  { unlock: 7, name: "crystals", x: 421, y: 479, width: 54, height: 46, atlasX: 0, atlasY: 314, shadow: true },
  { unlock: 0, name: "moss-patch", x: 195, y: 501, width: 84, height: 26, atlasX: 56, atlasY: 314, shadow: false },
  { unlock: 4, name: "visitor-snail", x: 219, y: 487, width: 34, height: 22, atlasX: 142, atlasY: 314, shadow: true },
  { unlock: 11, name: "stepping-stones-6", x: 357, y: 509, width: 42, height: 24, atlasX: 178, atlasY: 314, shadow: false },
  { unlock: 11, name: "stepping-stones-5", x: 335, y: 493, width: 38, height: 20, atlasX: 222, atlasY: 314, shadow: false },
  { unlock: 11, name: "stepping-stones-4", x: 283, y: 451, width: 62, height: 46, atlasX: 262, atlasY: 314, shadow: false },
];
