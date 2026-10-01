import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Lunagrove — Pixel Pomodoro",
  short_name: "Lunagrove",
  version: "0.2.0",
  description:
    "A gentle pixel-art Pomodoro that grows a moonlit garden, one focus at a time.",
  permissions: ["storage", "alarms", "notifications", "offscreen"],
  icons: {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  },
  action: {
    default_popup: "src/popup/index.html",
    default_title: "Open Lunagrove",
    default_icon: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
    },
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
});
