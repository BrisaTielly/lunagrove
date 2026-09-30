# Lunagrove Pixel Redesign

## Direction

Lunagrove becomes a compact virtual-pet Pomodoro with authentic low-resolution pixel art. Lumi, a small moon spirit, restores a garden and travels toward a lunar shrine as focus sessions are completed.

The redesign replaces detailed AI-like scenery with large readable shapes, a limited palette, short animations, and a game-like interface inspired by handheld games. The supplied concept is a compositional reference, not an asset to reproduce verbatim.

## Main screen

- Fixed logical canvas around 160 × 224 pixels, scaled to a 400 × 560 Chrome popup with nearest-neighbor rendering.
- Header: crescent mark, `LUNAGROVE`, settings button.
- Main stage: Lumi on the left caring for the current garden object.
- Timer: large block on the upper right.
- Progress: twenty pips and an `n / 20` label.
- Primary command: `START`, `PAUSE`, `RESUME`, or `REST`.
- Secondary commands: garden on the left; map and statistics on the right.

## Lumi

- Original round moon spirit, approximately 48 × 48 logical pixels.
- Pale moon body, tiny sprout, crescent forehead mark, simple face, short feet, and a watering can.
- Sprites: idle, blink, water, walk, celebrate, rest.
- Two to four frames per animation.
- Lumi never scolds the user, loses health, or looks neglected after an absence.

## Progression

Twenty focus sessions form one journey:

- **1–5 — Sprout:** seed, first leaves, flower, grass, garden patch.
- **6–10 — Pond:** water, lily pad, reeds, fireflies, moon reflection.
- **11–15 — Bridge:** path, bridge, lantern, traveler marker, gate.
- **16–20 — Shrine:** steps, runes, altar, shrine light, completed sanctuary.

Every session:

1. Advances Lumi one point on the map.
2. Adds one permanent garden detail.
3. Fills one progress pip.
4. Plays a short celebration after the completed focus.

Nothing regresses. Sessions after twenty rotate through gentle ambient variations until a future journey is added.

## Secondary screens

### Garden

A tiny isometric diorama using the same limited tiles. It shows all unlocked objects without controls for placement in the first release.

### Map

A five-by-four tile journey showing pond, grove, bridge, and shrine. Lumi occupies the current tile. Statistics are limited to today, total sessions, and total focused minutes.

### Break

Lumi rests by a moon window or the restored water bowl. The next session never starts automatically.

## Visual system

Palette:

- Night ink: `#171a2f`
- Deep violet: `#302b52`
- Moon cream: `#ffe6a7`
- Moss: `#83aa62`
- Water: `#68aeb8`
- Coral action: `#ef806f`
- Pale lilac: `#aaa0d2`
- Warm lamp: `#f4b85d`

Rules:

- One- or two-pixel outlines.
- Flat color clusters and almost no dithering.
- No gradients, glassmorphism, bloom, complex particles, painterly texture, or high-resolution detail hidden behind pixelation.
- Pixel font only for numbers and short labels; accessible system font may be used for settings.
- Animation uses stepped timing and respects reduced motion.

## Product invariants

- Existing timer reliability, local storage, alarms, notifications, statistics, settings, and backup remain intact.
- Only bundled local assets are used.
- Popup remains within Chrome's 800 × 600 maximum.
- All commands remain keyboard accessible with visible focus.

