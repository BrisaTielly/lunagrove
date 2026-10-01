import { GARDEN_PARTS } from "./gardenParts";
import { PixelDigits } from "./PixelDigits";
import { pixelProgress, unlockLabel as labelFor } from "./progression";
import { LANTERN, LUMI, STARS, spriteStyle, type TwinkleSprite } from "./sceneLayers";
import type { Season } from "../domain/seasons";
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

const LANTERN_UNLOCK = 12;
const FIREFLIES_UNLOCK = 8;
const SHRINE_LIGHT_UNLOCK = 18;

const POND_FIREFLIES = [
  { x: 205, y: 360, path: "a", delay: 0, duration: 8 },
  { x: 262, y: 350, path: "b", delay: 2, duration: 10 },
  { x: 300, y: 395, path: "c", delay: 1, duration: 7 },
  { x: 230, y: 455, path: "b", delay: 3.4, duration: 9 },
  { x: 350, y: 470, path: "a", delay: 5, duration: 11 },
];

function twinkleStyle(sprite: TwinkleSprite) {
  return { ...spriteStyle(sprite), animationDelay: `${-sprite.delay}s`, animationDuration: `${sprite.duration}s` };
}

function nextLine(stage: number): string {
  if (stage === 0) return "Complete a focus to plant the first seed.";
  if (stage >= 20) return "Garden complete";
  return `Next: ${labelFor(pixelProgress(stage + 1).unlocks[stage])}`;
}

export function GardenView({
  totalFocusSessions,
  reducedMotion,
  season = null,
  onBack,
  onOpenSettings,
}: GardenViewProps) {
  const progress = pixelProgress(totalFocusSessions);

  return (
    <section
      className={`garden-shell${reducedMotion ? " garden-shell--still" : ""}`}
      aria-label="Lumi's garden"
    >
      <span className="garden-brand">LUNAGROVE</span>
      <button className="pixel-hit garden-settings" type="button" aria-label="Settings" onClick={onOpenSettings} />
      <button className="pixel-hit garden-close" type="button" aria-label="Close Lunagrove" onClick={() => window.close()} />

      <div className="pixel-ambient" aria-hidden="true">
        <i className="pixel-moon-glow" />
        {STARS.map((star) => (
          <i className="pixel-sprite pixel-star" style={twinkleStyle(star)} key={`${star.x}-${star.y}`} />
        ))}
        <i className="pixel-sprite pixel-lantern" style={spriteStyle(LANTERN)}>
          <i className="pixel-lantern-glow" />
        </i>
      </div>

      {progress.stage < 5 && <span className="garden-bed" role="img" aria-label="Waiting seed bed" />}

      <ol className="garden-details" aria-label="Unlocked garden details">
        {progress.unlocks.map((unlock, index) => (
          <li
            className={`garden-detail${index === progress.stage - 1 ? " garden-detail--new" : ""}`}
            data-testid="garden-detail"
            key={unlock}
          >
            {GARDEN_PARTS.filter((part) => part.unlock === index).map((part) => (
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
            {index === LANTERN_UNLOCK && <i className="garden-lamp-glow" aria-hidden="true" />}
            {index === FIREFLIES_UNLOCK && POND_FIREFLIES.map((firefly) => (
              <i
                className={`pixel-firefly pixel-firefly--${firefly.path}`}
                style={{ left: firefly.x, top: firefly.y, animationDelay: `${-firefly.delay}s`, animationDuration: `${firefly.duration}s, 2s` }}
                aria-hidden="true"
                key={`${firefly.x}-${firefly.y}`}
              />
            ))}
            {index === SHRINE_LIGHT_UNLOCK && <i className="garden-shrine-light" aria-hidden="true" />}
            <span className="garden-detail-name">{labelFor(unlock)}</span>
          </li>
        ))}
      </ol>

      <div className="garden-lumi" role="img" aria-label="Lumi tending the garden">
        <div
          className="pixel-sprite pixel-lumi"
          data-state="water"
          style={{ left: 0, top: 0, width: LUMI.width, height: LUMI.height, backgroundPosition: `${-LUMI.x}px ${-LUMI.y}px` }}
        >
          <i className="pixel-lumi-eyelid pixel-lumi-eyelid--left" aria-hidden="true" />
          <i className="pixel-lumi-eyelid pixel-lumi-eyelid--right" aria-hidden="true" />
        </div>
        <span className="pixel-water garden-water" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>

      <SeasonLayer season={season} />

      <button className="pixel-hit garden-home" type="button" aria-label="Back to home" onClick={onBack} />

      <div className="garden-panel">
        <h1 className="garden-title">Lumi&apos;s Garden</h1>
        <div
          className="garden-count"
          role="progressbar"
          aria-label="Garden restored"
          aria-valuemin={0}
          aria-valuemax={20}
          aria-valuenow={progress.stage}
        >
          <PixelDigits text={`${progress.stage} / 20`} unit={1.1} />
          <span className="pixel-digits-text">{progress.stage} / 20</span>
        </div>
        <ol className="garden-pips" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => {
            const completed = progress.stage - index * 2;
            return <li data-fill={completed >= 2 ? "full" : completed === 1 ? "half" : "empty"} key={index} />;
          })}
        </ol>
        <p className="garden-next">{nextLine(progress.stage)}</p>
      </div>
    </section>
  );
}
