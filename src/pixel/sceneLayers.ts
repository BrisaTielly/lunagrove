// Boxes (prototype pixels) of the pieces cut into lunagrove-sprites.png.
export interface SpriteBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TwinkleSprite extends SpriteBox {
  delay: number;
  duration: number;
}

export const LUMI: SpriteBox = { x: 18, y: 284, width: 193, height: 211 };
export const LANTERN: SpriteBox = { x: 128, y: 182, width: 34, height: 47 };

export const STARS: TwinkleSprite[] = [
  { x: 427, y: 100, width: 17, height: 19, delay: 0, duration: 3.4 },
  { x: 265, y: 102, width: 14, height: 14, delay: 1.1, duration: 2.8 },
  { x: 459, y: 128, width: 7, height: 7, delay: 0.4, duration: 2.2 },
  { x: 250, y: 155, width: 17, height: 21, delay: 2.2, duration: 3.9 },
  { x: 291, y: 190, width: 11, height: 12, delay: 0.7, duration: 2.6 },
  { x: 434, y: 204, width: 15, height: 17, delay: 1.8, duration: 3.1 },
  { x: 197, y: 245, width: 14, height: 11, delay: 2.9, duration: 2.4 },
];

export const SPARKLES: TwinkleSprite[] = [
  { x: 224, y: 352, width: 19, height: 24, delay: 0.3, duration: 1.9 },
  { x: 246, y: 373, width: 21, height: 23, delay: 1.2, duration: 2.3 },
  { x: 284, y: 458, width: 19, height: 22, delay: 0.8, duration: 2.1 },
];

export interface Firefly {
  x: number;
  y: number;
  path: "a" | "b" | "c";
  delay: number;
  duration: number;
}

// Kept away from the timer and journey cards on the right.
export const FIREFLIES: Firefly[] = [
  { x: 60, y: 250, path: "a", delay: 0, duration: 9 },
  { x: 190, y: 200, path: "b", delay: 2.5, duration: 11 },
  { x: 120, y: 505, path: "c", delay: 1.2, duration: 8 },
  { x: 330, y: 495, path: "a", delay: 4, duration: 10 },
  { x: 440, y: 470, path: "b", delay: 0.6, duration: 12 },
  { x: 250, y: 120, path: "c", delay: 3.3, duration: 9.5 },
];

export function spriteStyle(box: SpriteBox) {
  return {
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height,
    backgroundPosition: `${-box.x}px ${-box.y}px`,
  };
}
