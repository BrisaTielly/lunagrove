import { useEffect, useState, type CSSProperties } from "react";

import { LUMI } from "./sceneLayers";
import "./lumi.css";

export type LumiState = "idle" | "water" | "paused" | "rest" | "celebrate";

interface LumiProps {
  state: LumiState;
  style?: CSSProperties;
  className?: string;
  label?: string;
}

const PET_MS = 1200;

// Lumi as a living sprite: a mood per timer state, plus a reaction when petted.
export function Lumi({ state, style, className = "", label }: LumiProps) {
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
