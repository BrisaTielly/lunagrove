<div align="center">
  <img src="docs/assets/lumi.png" width="245" alt="Lumi, Lunagrove's moon gardener, holding a watering can" />

  # Lunagrove

  **A gentle pixel-art Pomodoro that turns focused time into a growing moonlit garden.**

  <p>
    <img alt="Chrome Extension" src="https://img.shields.io/badge/Chrome_Extension-Manifest_V3-302b52?style=for-the-badge&labelColor=171a2f" />
    <img alt="React" src="https://img.shields.io/badge/React-19-68aeb8?style=for-the-badge&labelColor=171a2f" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-7-aaa0d2?style=for-the-badge&labelColor=171a2f" />
    <img alt="Work in progress" src="https://img.shields.io/badge/status-growing-83aa62?style=for-the-badge&labelColor=171a2f" />
  </p>

  Focus. Grow. Return. No streak anxiety, no neglected pet, no punishment for taking a break.
</div>

---

<div align="center">
  <img src="docs/assets/lunagrove-popup.png" width="390" alt="Lunagrove popup showing Lumi watering a flower beside a 25-minute focus timer" />
  <br />
  <sub>The current Lunagrove home screen — designed as a tiny playable pixel-art scene.</sub>
</div>

## Meet Lumi

Lumi is a small moon spirit who cares for Lunagrove while you focus. Every completed Pomodoro moves the journey forward, fills the garden with another permanent detail, and brings the grove closer to its lunar shrine.

Lunagrove is built around a simple idea: **productivity should feel inviting, not demanding**. Progress never regresses, and Lumi will never shame you for leaving.

## What works today

| | Feature | What it does |
|:--:|---|---|
| ⏱️ | Reliable Pomodoro | Start, pause, resume, cancel, and complete focus or break sessions. |
| 🌙 | Persistent timer | Chrome alarms keep sessions reliable even after the popup closes. |
| 🌱 | Gentle progression | Twenty focus sessions form one permanent restoration journey. |
| 💾 | Local-first data | Preferences, progress, and statistics stay in Chrome storage. |
| 🔔 | Optional notifications | Receive a notification when a session finishes. |
| 🎛️ | Personal settings | Adjust focus and break durations, sound, notifications, and motion. |
| 📦 | Backup and restore | Export your grove and safely import it again later. |
| ✨ | Living pixel scene | Lumi blinks, waters the flower, and shares the grove with stars, fireflies, and lantern light. |

## The twenty-step journey

Each completed focus session unlocks one permanent detail:

| Sessions | Chapter | Milestone |
|:--:|---|---|
| `1–5` | **Sprout** | Seed, first leaves, flower, grass, and a garden patch. |
| `6–10` | **Pond** | Water, lily pads, reeds, fireflies, and moonlight. |
| `11–15` | **Bridge** | A path, bridge, lantern, traveler marker, and moon gate. |
| `16–20` | **Shrine** | Steps, runes, altar, shrine light, and the restored sanctuary. |

> Garden and Journey Map screens are the next major features. The progression model is already implemented; their dedicated views are still in development.

## Try it locally

### Requirements

- [Node.js](https://nodejs.org/) 20 or newer
- [pnpm](https://pnpm.io/)
- Google Chrome or another Chromium-based browser

### Development preview

```bash
git clone https://github.com/BrisaTielly/lunagrove.git
cd lunagrove
pnpm install
pnpm dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/src/popup/index.html
```

### Load it as a real Chrome extension

```bash
pnpm build
```

Then:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the generated `dist/` directory.
5. Pin Lunagrove and open it from the extensions toolbar.

Running the unpacked extension is the best way to test alarms, notifications, persistence, and popup lifecycle behavior.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the Vite development server. |
| `pnpm build` | Type-check and create the production extension in `dist/`. |
| `pnpm test -- --run` | Run the complete Vitest suite once. |
| `pnpm test:watch` | Run tests in watch mode. |
| `pnpm run typecheck` | Check TypeScript without creating a build. |

## Built with

- **React 19** and **TypeScript** for the popup experience.
- **Vite** and **CRXJS** for the Manifest V3 build.
- **Chrome Alarms, Storage, and Notifications APIs** for extension behavior.
- **Vitest** and **Testing Library** for domain and interface tests.
- Original pixel-art assets, sprite layers, and custom grid-rendered timer digits.

<details>
  <summary><strong>Why does Lunagrove request these permissions?</strong></summary>

  - `storage` keeps your timer preferences, progress, and local statistics.
  - `alarms` allows an active session to finish reliably after the popup closes.
  - `notifications` optionally tells you when focus or rest time is complete.

  Lunagrove has no account system and does not require a remote backend for the current MVP.
</details>

## Roadmap

- [x] Reliable focus and break timer
- [x] Pause and resume across popup sessions
- [x] Persistent local progress and statistics
- [x] Settings, notifications, backup, and restore
- [x] Animated Lumi home scene
- [ ] Growing Garden view
- [ ] Twenty-step Journey Map
- [ ] Completion and rest celebrations
- [ ] Final extension icons and Chrome Web Store assets
- [ ] Chrome Web Store release

## Contributing

Lunagrove is still growing. Bug reports, accessibility improvements, pixel-art polish, tests, and focused feature proposals are welcome.

Before opening a pull request:

```bash
pnpm test -- --run
pnpm run typecheck
pnpm build
```

Please keep the product's core promise intact: **gentle progress without punishment**.

---

<div align="center">
  <strong>Made under moonlight with tiny pixels and patient focus.</strong>
  <br />
  <sub>Lumi will keep the watering can ready.</sub>
</div>
