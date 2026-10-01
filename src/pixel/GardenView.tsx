import { useState, type CSSProperties } from "react";

import type { Season } from "../domain/seasons";
import { GARDENS, STEPS_PER_GARDEN, journey, type GardenDef } from "./gardens";
import type { GardenPart } from "./gardenParts";
import { GardenLumi, placeGardenLumi } from "./GardenLumi";
import { PixelDigits } from "./PixelDigits";
import { unlockLabel as labelFor } from "./progression";
import { SeasonLayer } from "./SeasonLayer";
import "./pixel-ui.css";
import "./garden.css";

interface GardenViewProps {
  totalFocusSessions: number;
  reducedMotion: boolean;
  season?: Season | null;
  onBack: () => void;
  onOpenSettings: () => void;
}

const DRIFT = ["a", "b", "c"] as const;

function nextLine(garden: number, stage: number): string {
  const def = GARDENS[garden];
  if (stage === 0) return garden === 0 ? "Complete a focus to plant the first seed." : "Your next focus starts this garden.";
  if (stage >= STEPS_PER_GARDEN) return GARDENS[garden + 1] ? `Next: ${GARDENS[garden + 1].title}` : "Every garden is complete";
  return `Next: ${labelFor(def.unlocks[stage])}`;
}

function find(def: GardenDef, name: string): GardenPart | undefined {
  return def.parts.find((part) => part.name === name);
}

// Glows and drifting lights placed around the piece they belong to.
function Effects({ def, index }: { def: GardenDef; index: number }) {
  const { fireflies, spores, lampGlow, shrineLight } = def.effects;
  if (index === lampGlow) {
    const lamp = find(def, "garden-lantern");
    if (lamp) return <i className="garden-lamp-glow" style={{ left: lamp.x + lamp.width / 2 - 20, top: lamp.y - 4 }} aria-hidden="true" />;
  }
  if (index === shrineLight) {
    const shrine = find(def, "lunar-shrine");
    if (shrine) return <i className="garden-shrine-light" style={{ left: shrine.x + shrine.width / 2 - 18, top: shrine.y - 132 }} aria-hidden="true" />;
  }
  const anchor = index === fireflies ? find(def, "pond-water") : index === spores ? find(def, "spring") : undefined;
  if (!anchor) return null;
  return (
    <>
      {Array.from({ length: 6 }, (_, n) => (
        <i
          className={`pixel-firefly pixel-firefly--${DRIFT[n % 3]}${index === spores ? " garden-spore" : ""}`}
          style={{
            left: anchor.x + ((n * 37) % Math.max(20, anchor.width)),
            top: anchor.y - 12 - ((n * 23) % 40),
            animationDelay: `${-n * 1.3}s`,
            animationDuration: `${8 + (n % 3) * 2}s, 2s`,
          }}
          aria-hidden="true"
          key={n}
        />
      ))}
    </>
  );
}

export function GardenView({
  totalFocusSessions,
  reducedMotion,
  season = null,
  onBack,
  onOpenSettings,
}: GardenViewProps) {
  const current = journey(totalFocusSessions);
  const [viewing, setViewing] = useState(current.garden);
  const shown = Math.min(viewing, current.garden);
  const def = GARDENS[shown];
  const stage = shown < current.garden ? STEPS_PER_GARDEN : current.stage;
  const unlocks = def.unlocks.slice(0, stage);
  const scene = season ? def.seasonScenes[season] : def.scene;

  return (
    <section
      className={`garden-shell garden-shell--${def.id}${reducedMotion ? " garden-shell--still" : ""}`}
      style={{ backgroundImage: `url(${scene})`, "--garden-parts": `url(${def.partsImage})`, "--garden-atlas": `${def.atlas.width}px ${def.atlas.height}px` } as CSSProperties}
      data-garden={def.id}
      aria-label="Lumi's garden"
    >
      <span className="garden-brand">LUNAGROVE</span>
      <button className="pixel-hit garden-settings" type="button" aria-label="Settings" onClick={onOpenSettings} />
      <button className="pixel-hit garden-close" type="button" aria-label="Close Lunagrove" onClick={() => window.close()} />

      {shown === 0 && stage < 5 && <span className="garden-bed" role="img" aria-label="Waiting seed bed" />}

      <ol className="garden-details" aria-label="Unlocked garden details">
        {unlocks.map((unlock, index) => (
          <li
            className={`garden-detail${shown === current.garden && index === stage - 1 ? " garden-detail--new" : ""}`}
            data-testid="garden-detail"
            key={unlock}
          >
            {def.parts.filter((part) => part.unlock === index).map((part) => (
              <i
                className={`garden-part garden-part--${part.name}`}
                style={{
                  left: part.x,
                  top: part.y,
                  width: part.width,
                  height: part.height,
                  backgroundPosition: `${-part.atlasX}px ${-part.atlasY}px`,
                }}
                aria-hidden="true"
                key={part.name}
              />
            ))}
            <Effects def={def} index={index} />
            <span className="garden-detail-name">{labelFor(unlock)}</span>
          </li>
        ))}
      </ol>

      <SeasonLayer season={season} />

      <GardenLumi placement={placeGardenLumi(def.parts, stage, shown < current.garden)} />

      <button className="pixel-hit garden-home" type="button" aria-label="Back to home" onClick={onBack} />

      <div className="garden-panel">
        <h1 className={`garden-title${def.title.length > 12 ? " garden-title--long" : ""}`}>{def.title}</h1>
        <div
          className="garden-count"
          role="progressbar"
          aria-label="Garden restored"
          aria-valuemin={0}
          aria-valuemax={20}
          aria-valuenow={stage}
        >
          <PixelDigits text={`${stage} / 20`} unit={1.1} />
          <span className="pixel-digits-text">{stage} / 20</span>
        </div>
        <ol className="garden-pips" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => {
            const completed = stage - index * 2;
            return <li data-fill={completed >= 2 ? "full" : completed === 1 ? "half" : "empty"} key={index} />;
          })}
        </ol>
        <p className="garden-next">{nextLine(shown, stage)}</p>
      </div>

      {current.garden > 0 && (
        <div className="garden-switch">
          {GARDENS.slice(0, current.garden + 1).map((garden, index) => (
            <button
              className={`garden-switch-tab${index === shown ? " is-active" : ""}`}
              type="button"
              aria-pressed={index === shown}
              onClick={() => setViewing(index)}
              key={garden.id}
            >
              {garden.title}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
