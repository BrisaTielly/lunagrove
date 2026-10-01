import { useEffect, useState } from "react";

import accessories from "../assets/pixel/lumi-accessories.png";
import lumiGarden from "../assets/pixel/lumi-garden.png";
import type { Season } from "../domain/seasons";
import type { GardenPart } from "./gardenParts";
import "./lumi.css";

export type GardenPose = "stand" | "sit" | "sniff" | "wave";

// Boxes in lumi-garden.png (drawn by Codex at the gardens' pixel scale).
const POSES: Record<GardenPose, { x: number; y: number; width: number; height: number }> = {
  stand: { x: 0, y: 0, width: 63, height: 62 },
  sit: { x: 65, y: 10, width: 65, height: 52 },
  sniff: { x: 132, y: 0, width: 78, height: 62 },
  wave: { x: 212, y: 0, width: 71, height: 62 },
};
const ATLAS = "285px 62px";

// Where each pose's head is, so the seasonal outfit sits on it.
const HEADS: Record<GardenPose, { centre: number; top: number }> = {
  stand: { centre: 32, top: 4 },
  sit: { centre: 31, top: 4 },
  sniff: { centre: 45, top: 0 },
  wave: { centre: 32, top: 3 },
};

// The home outfits (lumi-accessories.png), drawn for a head 17px below their bottom edge.
const OUTFITS: Record<Season, { width: number; height: number; atlasX: number; bottom: number }> = {
  spring: { width: 136, height: 24, atlasX: 0, bottom: 34 },
  summer: { width: 136, height: 40, atlasX: 140, bottom: 36 },
  autumn: { width: 116, height: 40, atlasX: 280, bottom: 34 },
  winter: { width: 128, height: 52, atlasX: 400, bottom: 40 },
};
const OUTFIT_SCALE = 0.34;
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
}

// Lumi walks up to the newest piece: sniffing it, waving to a new visitor,
// standing by when nothing has grown yet, sitting back in a finished garden.
export function placeGardenLumi(parts: GardenPart[], stage: number, finished: boolean): GardenLumiPlacement {
  if (stage === 0) return { pose: "stand", ...HOME_SPOT, facing: "right" };
  if (finished) return { pose: "sit", ...HOME_SPOT, facing: "right" };

  const newest = parts.filter((part) => part.unlock === stage - 1);
  const visitor = newest.find((part) => part.name.startsWith("visitor-"));
  const anchor = visitor ?? newest.sort((a, b) => b.width * b.height - a.width * a.height)[0];
  const pose: GardenPose = visitor ? "wave" : "sniff";
  if (!anchor) return { pose: "stand", ...HOME_SPOT, facing: "right" };

  const { width } = POSES[pose];
  const base = anchor.y + anchor.height + 2;
  const bottom = Math.min(WINDOW.bottom, visitor ? Math.max(MEADOW_TOP, base) : Math.max(WINDOW.top, base));
  const leftOf = anchor.x - width + 6;
  if (leftOf >= WINDOW.left) return { pose, left: leftOf, bottom, facing: "right" };
  return { pose, left: Math.min(WINDOW.right - width, anchor.x + anchor.width - 6), bottom, facing: "left" };
}

// A little loop around the meadow, starting and ending at her main spot.
export function wanderRoute(main: GardenLumiPlacement): GardenLumiPlacement[] {
  const strolls: GardenLumiPlacement[] = [
    { pose: "stand", left: 200, bottom: 506, facing: "right" },
    { pose: "sit", left: 70, bottom: 520, facing: "right" },
    { pose: "stand", left: 300, bottom: 486, facing: "left" },
  ];
  return [main, strolls[0], main, strolls[1], main, strolls[2]];
}

interface GardenLumiProps {
  placement: GardenLumiPlacement;
  season?: Season | null;
  still?: boolean;
}

export function GardenLumi({ placement, season = null, still = false }: GardenLumiProps) {
  const [petting, setPetting] = useState(0);
  const [step, setStep] = useState(0);
  const [walking, setWalking] = useState(false);
  const route = wanderRoute(placement);
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
              left: head.centre - (outfit.width * OUTFIT_SCALE) / 2,
              top: head.top + ((outfit.bottom - 17) - outfit.height) * OUTFIT_SCALE,
              width: outfit.width * OUTFIT_SCALE,
              height: outfit.height * OUTFIT_SCALE,
              backgroundImage: `url(${accessories})`,
              backgroundSize: `${532 * OUTFIT_SCALE}px ${52 * OUTFIT_SCALE}px`,
              backgroundPosition: `${-outfit.atlasX * OUTFIT_SCALE}px 0`,
            }}
          />
        )}
      </span>
      {petting > 0 && <i className="lumi-heart garden-lumi-heart" aria-hidden="true" />}
    </button>
  );
}
