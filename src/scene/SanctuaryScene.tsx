import type { CSSProperties } from "react";

import dormantSanctuary from "../assets/scene/sanctuary-dormant.png";
import restoredSanctuary from "../assets/scene/sanctuary-restored.png";
import { sanctuaryStage } from "./stages";
import "./scene.css";

interface SanctuarySceneProps {
  stage: number;
  celebrating: boolean;
  reducedMotion: boolean;
}

type SceneStyle = CSSProperties & { "--restore-radius": string };

export function SanctuaryScene({
  stage,
  celebrating,
  reducedMotion,
}: SanctuarySceneProps) {
  const current = sanctuaryStage(stage);
  const restoreRadius = current.stage === 20 ? 100 : current.stage * 4.25;
  const style: SceneStyle = { "--restore-radius": `${restoreRadius}%` };

  return (
    <figure
      className="sanctuary-scene"
      role="img"
      aria-label={`Lunagrove restoration stage ${current.stage} of 20. ${current.message}`}
      data-celebrating={celebrating}
      data-reduced-motion={reducedMotion}
      data-stage={current.stage}
      style={style}
    >
      <img className="sanctuary-scene__image" src={dormantSanctuary} alt="" />
      <img
        className="sanctuary-scene__image sanctuary-scene__restored"
        src={restoredSanctuary}
        alt=""
      />
      <div className="sanctuary-scene__moonwash" aria-hidden="true" />
      <div className="sanctuary-scene__fireflies" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <figcaption className="sanctuary-scene__caption">
        <span>{current.chapter}</span>
        <strong>{current.message}</strong>
      </figcaption>
    </figure>
  );
}
