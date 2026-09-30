import type { CSSProperties } from "react";

import { pixelProgress, type PixelChapter } from "./progression";
import "./garden.css";

interface GardenViewProps {
  totalFocusSessions: number;
  reducedMotion: boolean;
  onBack: () => void;
  onOpenSettings: () => void;
}

interface GardenPosition {
  x: number;
  y: number;
}

const DETAIL_POSITIONS: GardenPosition[] = [
  { x: 218, y: 355 }, { x: 192, y: 344 }, { x: 252, y: 337 }, { x: 147, y: 377 }, { x: 304, y: 370 },
  { x: 338, y: 321 }, { x: 377, y: 298 }, { x: 410, y: 330 }, { x: 350, y: 266 }, { x: 397, y: 248 },
  { x: 62, y: 373 }, { x: 91, y: 345 }, { x: 121, y: 317 }, { x: 151, y: 288 }, { x: 180, y: 263 },
  { x: 230, y: 242 }, { x: 256, y: 215 }, { x: 281, y: 190 }, { x: 307, y: 163 }, { x: 334, y: 135 },
];

function labelFor(unlock: string): string {
  return unlock
    .split("-")
    .map((word, index) => index === 0 ? word[0].toUpperCase() + word.slice(1) : word)
    .join(" ");
}

function chapterForDetail(index: number): PixelChapter {
  if (index < 5) return "sprout";
  if (index < 10) return "pond";
  if (index < 15) return "bridge";
  return "shrine";
}

export function GardenView({
  totalFocusSessions,
  reducedMotion,
  onBack,
  onOpenSettings,
}: GardenViewProps) {
  const progress = pixelProgress(totalFocusSessions);
  const nextUnlock = progress.stage < 20
    ? labelFor(pixelProgress(progress.stage + 1).unlocks.at(-1) ?? "")
    : "Garden complete";

  return (
    <section
      className={`garden-shell garden-shell--${progress.chapter}${progress.stage === 0 ? " garden-shell--empty" : ""}${reducedMotion ? " garden-shell--still" : ""}`}
      aria-label="Lumi's garden"
    >
      <span className="garden-brand">LUNAGROVE</span>
      <button className="garden-hit garden-settings" type="button" aria-label="Settings" onClick={onOpenSettings} />
      <button className="garden-hit garden-back" type="button" aria-label="Back to home" onClick={onBack} />

      <div className="garden-scene">
        <header className="garden-title-card">
          <h1>Lumi&apos;s Garden</h1>
          <p>Growing focus by focus</p>
        </header>

        <div className="garden-ambient" data-testid="garden-ambient" aria-hidden="true">
          <i className="garden-lantern-light" />
          <i className="garden-leaf garden-leaf--one" />
          <i className="garden-leaf garden-leaf--two" />
          {Array.from({ length: 6 }, (_, index) => (
            <i className={`garden-firefly garden-firefly--${index + 1}`} key={index} />
          ))}
        </div>

        <div className="garden-lumi" role="img" aria-label="Lumi tending the garden">
          <i className="garden-lumi-eyelid garden-lumi-eyelid--left" aria-hidden="true" />
          <i className="garden-lumi-eyelid garden-lumi-eyelid--right" aria-hidden="true" />
          <span className="garden-drops" aria-hidden="true"><i /><i /><i /></span>
        </div>

        <div className="garden-seed-bed" role="img" aria-label="Waiting seed bed">
          <i className="garden-seed" aria-hidden="true" />
        </div>

        {progress.stage === 0 && (
          <div className="garden-empty-sign">
            <span aria-hidden="true">✦</span>
            <p>Complete a focus to plant the first seed.</p>
          </div>
        )}

        <ol className="garden-details" aria-label="Unlocked garden details">
          {progress.unlocks.map((unlock, index) => {
            const position = DETAIL_POSITIONS[index];
            const style = {
              "--detail-x": `${position.x}px`,
              "--detail-y": `${position.y}px`,
              "--detail-delay": `${-(index % 5) * 0.35}s`,
            } as CSSProperties;

            return (
              <li
                className={`garden-detail garden-detail--${chapterForDetail(index)}`}
                data-testid="garden-detail"
                style={style}
                key={unlock}
              >
                <span className="garden-detail-name">{labelFor(unlock)}</span>
              </li>
            );
          })}
        </ol>

        <div className="garden-progress" role="progressbar" aria-label="Garden restored" aria-valuemin={0} aria-valuemax={20} aria-valuenow={progress.stage}>
          <div className="garden-progress-copy">
            <span>Garden restored</span>
            <strong>{progress.stage} / 20</strong>
          </div>
          <ol className="garden-pips" aria-label="Twenty garden milestones">
            {Array.from({ length: 20 }, (_, index) => (
              <li className={index < progress.stage ? "is-filled" : ""} key={index} />
            ))}
          </ol>
          <p>{progress.stage < 20 ? `Next: ${nextUnlock}` : nextUnlock}</p>
        </div>
      </div>
    </section>
  );
}
