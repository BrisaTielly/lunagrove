import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Lunagrove — Pixel Pomodoro",
  short_name: "Lunagrove",
  version: "0.1.0",
  description:
    "A gentle focus timer that restores a magical pixel-art sanctuary, one Pomodoro at a time.",
  permissions: ["storage", "alarms", "notifications"],
  action: {
    default_popup: "src/popup/index.html",
    default_title: "Open Lunagrove",
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
});
