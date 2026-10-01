import { useEffect, useState } from "react";

import outfits from "../assets/pixel/lumi-garden-outfits.png";
import lumiGarden from "../assets/pixel/lumi-garden.png";
import type { Season } from "../domain/seasons";
import type { GardenPart } from "./gardenParts";
import type { RestSpot } from "./gardens";
import "./lumi.css";

export type GardenPose = "stand" | "sit" | "sniff" | "wave";

// Boxes in lumi-garden.png (drawn by Codex at the gardens' pixel scale).
// Each pose carries a 1-cell ink outline, like the other garden sprites.
const POSES: Record<GardenPose, { x: number; y: number; width: number; height: number }> = {
  stand: { x: 0, y: 0, width: 68, height: 66 },
  sit: { x: 70, y: 10, width: 68, height: 56 },
  sniff: { x: 140, y: 0, width: 82, height: 66 },
  wave: { x: 224, y: 0, width: 76, height: 66 },
};
const ATLAS = "302px 66px";

// Where each pose's head is, so the seasonal outfit sits on it.
const HEADS: Record<GardenPose, { centre: number; top: number }> = {
  stand: { centre: 34, top: 6 },
  sit: { centre: 33, top: 6 },
  sniff: { centre: 47, top: 2 },
  wave: { centre: 34, top: 5 },
};

// lumi-garden-outfits.png: the home outfits redrawn on the gardens' 2px grid.
// `sink` is how far each one sits down over the top of the head.
const OUTFITS: Record<Season, { width: number; height: number; atlasX: number; sink: number }> = {
  spring: { width: 46, height: 8, atlasX: 0, sink: 6 },
  summer: { width: 46, height: 14, atlasX: 48, sink: 6 },
  autumn: { width: 40, height: 14, atlasX: 96, sink: 6 },
  winter: { width: 44, height: 18, atlasX: 138, sink: 8 },
};
const WANDER_MS = 6000;
const WALK_MS = 2400;

// Scene window of the garden screen (prototype pixels).
const WINDOW = { left: 16, right: 483, top: 300, bottom: 532 };
const HOME_SPOT = { left: 90, bottom: 512 };
// Visitors live in trees, on lily pads or up the hill: Lumi waves at them from the meadow.
const MEADOW_TOP = 430;

export interface GardenLumiPlacement {
  pose: GardenPose;
  left: number;
  bottom: number;
  facing: "left" | "right";
  shade?: boolean;
}

function rest(spot: RestSpot, pose: GardenPose): GardenLumiPlacement {
  return { pose, left: spot.left, bottom: spot.bottom, facing: spot.facing, shade: spot.shade };
}

// Lumi walks up to the newest piece: sniffing it, waving to a new visitor,
// standing by when nothing has grown yet, sitting back in a finished garden.
export function placeGardenLumi(
  parts: GardenPart[],
  stage: number,
  finished: boolean,
  spots: RestSpot[] = [],
): GardenLumiPlacement {
  const home: RestSpot = spots[0] ?? { ...HOME_SPOT, facing: "right" };
  if (stage === 0) return rest(home, "sit");
  if (finished) return rest(home, "sit");

  const newest = parts.filter((part) => part.unlock === stage - 1);
  const visitor = newest.find((part) => part.name.startsWith("visitor-"));
  const anchor = visitor ?? newest.sort((a, b) => b.width * b.height - a.width * a.height)[0];
  const pose: GardenPose = visitor ? "wave" : "sniff";
  if (!anchor) return rest(home, "stand");

  const { width } = POSES[pose];
  const base = anchor.y + anchor.height + 2;
  const bottom = Math.min(WINDOW.bottom, visitor ? Math.max(MEADOW_TOP, base) : Math.max(WINDOW.top, base));
  const leftOf = anchor.x - width + 6;
  if (leftOf >= WINDOW.left) return { pose, left: leftOf, bottom, facing: "right" };
  return { pose, left: Math.min(WINDOW.right - width, anchor.x + anchor.width - 6), bottom, facing: "left" };
}

const FALLBACK_STROLLS: RestSpot[] = [
  { left: 200, bottom: 506, facing: "right" },
  { left: 70, bottom: 520, facing: "right" },
  { left: 300, bottom: 486, facing: "left" },
];

// A loop through her favourite places, coming back to the newest piece in between.
export function wanderRoute(main: GardenLumiPlacement, spots: RestSpot[] = []): GardenLumiPlacement[] {
  const places = (spots.length ? spots : FALLBACK_STROLLS)
    .filter((spot) => spot.left !== main.left || spot.bottom !== main.bottom)
    .slice(0, 3);
  const poses: GardenPose[] = ["sit", "stand", "sit"];
  return places.flatMap((spot, index) => [main, rest(spot, poses[index % poses.length])]);
}

interface GardenLumiProps {
  placement: GardenLumiPlacement;
  spots?: RestSpot[];
  // The scene's foreground grass (see gardens.ts), drawn over her feet.
  front?: string;
  season?: Season | null;
  still?: boolean;
}

const FRONT_BAND = 14;

export function GardenLumi({ placement, spots = [], front, season = null, still = false }: GardenLumiProps) {
  const [petting, setPetting] = useState(0);
  const [step, setStep] = useState(0);
  const [walking, setWalking] = useState(false);
  const route = wanderRoute(placement, spots);
  const spot = still ? placement : route[step % route.length];
  const previous = still ? placement : route[(step + route.length - 1) % route.length];

  useEffect(() => {
    if (!petting) return undefined;
    const timeout = window.setTimeout(() => setPetting(0), 1200);
    return () => window.clearTimeout(timeout);
  }, [petting]);

  useEffect(() => {
    setStep(0);
  }, [placement.left, placement.bottom, placement.pose]);

  useEffect(() => {
    if (still) return undefined;
    const wander = window.setInterval(() => {
      setWalking(true);
      setStep((current) => current + 1);
      window.setTimeout(() => setWalking(false), WALK_MS);
    }, WANDER_MS);
    return () => window.clearInterval(wander);
  }, [still]);

  const pose: GardenPose = walking ? "stand" : spot.pose;
  const facing = walking ? (spot.left >= previous.left ? "right" : "left") : spot.facing;
  const box = POSES[pose];
  const head = HEADS[pose];
  const outfit = season ? OUTFITS[season] : null;
  return (
    <button
      className="garden-lumi"
      type="button"
      aria-label="Pet Lumi"
      data-pose={pose}
      data-shade={spot.shade || undefined}
      data-walking={walking || undefined}
      data-petting={petting > 0 || undefined}
      style={{ left: spot.left, top: spot.bottom - box.height, width: box.width, height: box.height }}
      onClick={() => setPetting((count) => count + 1)}
    >
      <i className="garden-lumi-shadow" aria-hidden="true" />
      <span
        className="garden-lumi-body"
        role="img"
        aria-label={`Lumi, ${placement.pose === "wave" ? "waving to a new friend" : placement.pose === "sniff" ? "admiring the newest piece" : "tending the garden"}`}
        style={{
          backgroundImage: `url(${lumiGarden})`,
          backgroundSize: ATLAS,
          backgroundPosition: `${-box.x}px ${-box.y}px`,
          transform: facing === "left" ? "scaleX(-1)" : undefined,
        }}
        key={petting}
      >
        {outfit && (
          <i
            className="garden-lumi-outfit"
            data-outfit={season}
            style={{
              left: Math.round(head.centre - outfit.width / 2),
              top: head.top + outfit.sink - outfit.height,
              width: outfit.width,
              height: outfit.height,
              backgroundImage: `url(${outfits})`,
              backgroundPosition: `${-outfit.atlasX}px 0`,
            }}
          />
        )}
      </span>
      {front && (
        <i
          className="garden-lumi-front"
          aria-hidden="true"
          style={{
            height: FRONT_BAND,
            backgroundImage: `url(${front})`,
            backgroundPosition: `${-spot.left}px ${-(spot.bottom - FRONT_BAND + 2)}px`,
          }}
        />
      )}
      {petting > 0 && <i className="lumi-heart garden-lumi-heart" aria-hidden="true" />}
    </button>
  );
}
