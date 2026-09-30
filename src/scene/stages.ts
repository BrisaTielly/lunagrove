export interface SanctuaryStage {
  stage: number;
  chapter: "Dormant" | "Awakening" | "Garden" | "Ruins" | "Kindred" | "Sanctuary";
  message: string;
  visibleLayers: string[];
}

const RESTORATIONS = [
  { chapter: "Awakening", layer: "moon-spark", message: "A lunar spark answers your focus." },
  { chapter: "Awakening", layer: "silver-reflection", message: "Silver light returns to the lagoon." },
  { chapter: "Awakening", layer: "water-thread", message: "Water finds its old path." },
  { chapter: "Awakening", layer: "first-moss", message: "Soft moss wakes between the stones." },
  { chapter: "Garden", layer: "star-buds", message: "Tiny starbuds rise from the earth." },
  { chapter: "Garden", layer: "lagoon-glow", message: "The lagoon remembers its turquoise glow." },
  { chapter: "Garden", layer: "moonflowers", message: "Moonflowers open along the path." },
  { chapter: "Garden", layer: "lunar-tree", message: "A lunar tree stretches toward the sky." },
  { chapter: "Ruins", layer: "lower-bridge", message: "The first stones settle back into place." },
  { chapter: "Ruins", layer: "west-rune", message: "An ancient rune begins to hum." },
  { chapter: "Ruins", layer: "lanterns", message: "Warm lanterns mark the way home." },
  { chapter: "Ruins", layer: "crescent-arch", message: "The crescent arch stands whole again." },
  { chapter: "Kindred", layer: "fireflies", message: "Fireflies gather over the water." },
  { chapter: "Kindred", layer: "spirit-bell", message: "A distant spirit bell rings once." },
  { chapter: "Kindred", layer: "observatory", message: "The little observatory opens its eye." },
  { chapter: "Kindred", layer: "gentle-visitor", message: "A gentle visitor leaves a trail of light." },
  { chapter: "Sanctuary", layer: "shrine-flame", message: "The shrine flame burns again." },
  { chapter: "Sanctuary", layer: "living-waterfall", message: "The waterfall sings beneath the moon." },
  { chapter: "Sanctuary", layer: "constellations", message: "New constellations gather overhead." },
  { chapter: "Sanctuary", layer: "full-bloom", message: "Lunagrove is awake, and it remembers you." },
] as const;

export const SANCTUARY_STAGES: SanctuaryStage[] = [
  {
    stage: 0,
    chapter: "Dormant",
    message: "The sanctuary sleeps beneath the moon.",
    visibleLayers: [],
  },
  ...RESTORATIONS.map((restoration, index) => ({
    stage: index + 1,
    chapter: restoration.chapter,
    message: restoration.message,
    visibleLayers: RESTORATIONS.slice(0, index + 1).map((entry) => entry.layer),
  })),
];

export function sanctuaryStage(stage: number): SanctuaryStage {
  const safeStage = Math.max(0, Math.min(20, Math.floor(stage)));
  return SANCTUARY_STAGES[safeStage];
}
