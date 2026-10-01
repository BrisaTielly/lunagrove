import type { CSSProperties } from "react";

import type { Season } from "../domain/seasons";
import "./seasons.css";

const PARTICLES = Array.from({ length: 26 }, (_, index) => {
  const spread = (index * 37) % 100;
  return {
    x: 4 + spread * 0.92,
    delay: -((index * 1.7) % 9),
    duration: 7 + ((index * 5) % 6),
    drift: ((index % 5) - 2) * 14,
    size: index % 3,
  };
});

// Calendar-season weather drawn over the scene; the UI cards sit above it.
export function SeasonLayer({ season }: { season: Season | null }) {
  if (!season) return null;

  return (
    <div className={`season-layer season-layer--${season}`} data-season={season} aria-hidden="true">
      <i className="season-tint" />
      <div className="season-particles">
        {PARTICLES.map((particle, index) => (
          <i
            className={`season-particle season-particle--${particle.size}`}
            style={{
              "--x": `${particle.x}%`,
              "--drift": `${particle.drift}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${season === "summer" ? particle.duration + 4 : particle.duration}s`,
            } as CSSProperties}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
