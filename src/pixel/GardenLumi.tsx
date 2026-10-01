import { useEffect, useState } from "react";

import lumiGarden from "../assets/pixel/lumi-garden.png";
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

export function GardenLumi({ placement }: { placement: GardenLumiPlacement }) {
  const [petting, setPetting] = useState(0);
  useEffect(() => {
    if (!petting) return undefined;
    const timeout = window.setTimeout(() => setPetting(0), 1200);
    return () => window.clearTimeout(timeout);
  }, [petting]);

  const box = POSES[placement.pose];
  return (
    <button
      className="garden-lumi"
      type="button"
      aria-label="Pet Lumi"
      data-pose={placement.pose}
      data-petting={petting > 0 || undefined}
      style={{ left: placement.left, top: placement.bottom - box.height, width: box.width, height: box.height }}
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
          transform: placement.facing === "left" ? "scaleX(-1)" : undefined,
        }}
        key={petting}
      />
      {petting > 0 && <i className="lumi-heart garden-lumi-heart" aria-hidden="true" />}
    </button>
  );
}
