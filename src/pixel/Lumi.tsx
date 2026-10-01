import { useEffect, useState, type CSSProperties } from "react";

import type { Season } from "../domain/seasons";
import { LUMI } from "./sceneLayers";
import "./lumi.css";

export type LumiState = "idle" | "water" | "paused" | "rest" | "celebrate";

interface LumiProps {
  state: LumiState;
  style?: CSSProperties;
  className?: string;
  label?: string;
  season?: Season | null;
}

const PET_MS = 1200;

// Boxes in lumi-accessories.png, positioned in Lumi's own sprite pixels.
const ACCESSORIES: Record<Season, { x: number; y: number; width: number; height: number; atlasX: number }> = {
  spring: { x: 30, y: 10, width: 136, height: 24, atlasX: 0 },
  summer: { x: 32, y: -4, width: 136, height: 40, atlasX: 140 },
  autumn: { x: 34, y: -6, width: 116, height: 40, atlasX: 280 },
  winter: { x: 36, y: -12, width: 128, height: 52, atlasX: 400 },
};

// Lumi as a living sprite: a mood per timer state, plus a reaction when petted.
export function Lumi({ state, style, className = "", label, season = null }: LumiProps) {
  const [petting, setPetting] = useState(0);

  useEffect(() => {
    if (!petting) return undefined;
    const timeout = window.setTimeout(() => setPetting(0), PET_MS);
    return () => window.clearTimeout(timeout);
  }, [petting]);

  const happy = state === "celebrate" || petting > 0;

  return (
    <button
      className={`lumi ${className}`.trim()}
      style={style}
      type="button"
      aria-label="Pet Lumi"
      data-petting={petting > 0 || undefined}
      onClick={() => setPetting((count) => count + 1)}
    >
      <span
        className="lumi-body pixel-sprite"
        style={{ width: LUMI.width, height: LUMI.height, backgroundPosition: `${-LUMI.x}px ${-LUMI.y}px` }}
        data-state={state}
        role="img"
        aria-label={label ?? `Lumi, the moon gardener, ${state}`}
        key={petting}
      >
        {happy ? (
          <>
            <i className="lumi-eye-happy lumi-eye-happy--left" />
            <i className="lumi-eye-happy lumi-eye-happy--right" />
          </>
        ) : (
          <>
            <i className="pixel-lumi-eyelid pixel-lumi-eyelid--left" />
            <i className="pixel-lumi-eyelid pixel-lumi-eyelid--right" />
          </>
        )}

        {season && (
          <i
            className="lumi-accessory"
            data-accessory={season}
            style={{
              left: ACCESSORIES[season].x,
              top: ACCESSORIES[season].y,
              width: ACCESSORIES[season].width,
              height: ACCESSORIES[season].height,
              backgroundPosition: `${-ACCESSORIES[season].atlasX}px 0`,
            }}
          />
        )}

        {state === "rest" && !happy && (
          <span className="lumi-zzz" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span>
        )}
        {state === "paused" && !happy && (
          <span className="lumi-bubble" aria-hidden="true"><i /><i /><i /></span>
        )}
        {state === "celebrate" && (
          <span className="lumi-burst" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
        )}
        {petting > 0 && <i className="lumi-heart" aria-hidden="true" />}
      </span>
    </button>
  );
}
