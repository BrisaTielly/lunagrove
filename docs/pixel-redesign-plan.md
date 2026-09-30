# Lunagrove Pixel Redesign Implementation Plan

> **For the agent:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Replace the detailed sanctuary UI with a simple virtual-pet pixel-art experience centered on Lumi, a garden, and a twenty-step quest map.

**Architecture:** Preserve the existing timer domain, Chrome alarm integration, storage schema, and settings. Replace only the scene and popup presentation with code-driven sprite sheets, deterministic progression selectors, and three small React views: home, garden, and map.

**Tech Stack:** React, TypeScript, CSS stepped animations, locally bundled PNG sprite sheets, Vitest, Testing Library, Vite, Chrome Manifest V3.

---

### Task 1: Pixel progression model

**Files:**
- Create: `src/pixel/progression.ts`
- Create: `src/pixel/progression.test.ts`
- Modify: `src/domain/progression.ts`

**Step 1: Write failing tests**

Test that sessions 0–20 map to four chapters, twenty monotonic unlocks, the correct map tile, and one filled pip per completed session.

**Step 2: Run the tests**

Run: `pnpm test -- --run src/pixel/progression.test.ts`

Expected: FAIL because the selectors do not exist.

**Step 3: Implement selectors**

Create `pixelProgress(totalSessions)` returning:

```ts
{
  stage: number;
  chapter: "sprout" | "pond" | "bridge" | "shrine";
  mapTile: number;
  filledPips: number;
  unlocks: string[];
}
```

Clamp negative totals to zero and totals above twenty to stage twenty.

**Step 4: Verify**

Run: `pnpm test -- --run src/pixel/progression.test.ts && pnpm run typecheck`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/pixel src/domain/progression.ts
git commit -m "feat: model lumi's twenty-step journey"
```

### Task 2: Lumi and environment sprites

**Files:**
- Create: `src/assets/pixel/lumi-sprites.png`
- Create: `src/assets/pixel/garden-tiles.png`
- Create: `src/assets/pixel/map-tiles.png`
- Create: `src/pixel/sprites.css`
- Create: `src/pixel/Lumi.tsx`
- Create: `src/pixel/Lumi.test.tsx`

**Step 1: Define sprite requirements**

Use a consistent logical grid. Lumi must include idle, blink, water, walk, celebrate, and rest states. Tiles must reuse the approved eight-color palette.

**Step 2: Create original sprite sheets**

Generate concepts with the built-in image tool, then redraw or clean them into deterministic low-resolution sheets. Do not ship the high-resolution concept mockup as the UI.

**Step 3: Write rendering tests**

Test that each named Lumi state selects a valid sprite class and that reduced motion selects a static frame.

**Step 4: Implement and verify**

Run: `pnpm test -- --run src/pixel/Lumi.test.tsx && pnpm run typecheck`

Expected: PASS.

**Step 5: Commit assets separately**

```bash
git add src/assets/pixel
git commit -m "feat: add lumi and lunagrove pixel sprites"
```

**Step 6: Commit the sprite component**

```bash
git add src/pixel
git commit -m "feat: animate lumi with stepped sprite states"
```

### Task 3: Main virtual-pet popup

**Files:**
- Create: `src/pixel/HomeScene.tsx`
- Create: `src/pixel/HomeScene.test.tsx`
- Create: `src/pixel/pixel-ui.css`
- Modify: `src/popup/App.tsx`
- Modify: `src/popup/components/TimerControls.tsx`
- Modify: `src/popup/components/StatsBar.tsx`
- Modify: `src/popup/styles.css`

**Step 1: Write failing interaction tests**

Test the approved composition, main command labels, twenty progress pips, garden/map buttons, and Lumi states for idle, running, paused, completed, and break modes.

**Step 2: Run tests and observe failure**

Run: `pnpm test -- --run src/pixel/HomeScene.test.tsx src/popup/App.test.tsx`

Expected: FAIL against the old sanctuary UI.

**Step 3: Implement the coarse-grid layout**

Build at 400 × 560 while aligning dimensions to a 2.5× enlargement of the 160 × 224 logical grid. Use `image-rendering: pixelated`, stepped transitions, square panels, and the approved palette.

**Step 4: Remove the old scene from runtime**

Stop importing `SanctuaryScene` and its detailed images. Keep old files until the new visual verification passes so rollback remains easy.

**Step 5: Verify**

Run: `pnpm test -- --run src/pixel src/popup && pnpm run typecheck`

Expected: PASS.

**Step 6: Commit**

```bash
git add src/pixel src/popup
git commit -m "feat: rebuild popup around lumi"
```

### Task 4: Garden and quest map screens

**Files:**
- Create: `src/pixel/GardenView.tsx`
- Create: `src/pixel/GardenView.test.tsx`
- Create: `src/pixel/MapView.tsx`
- Create: `src/pixel/MapView.test.tsx`
- Modify: `src/popup/App.tsx`

**Step 1: Write navigation and progression tests**

Test opening and closing both screens, visible garden unlocks, current map tile, and compact statistics.

**Step 2: Implement garden**

Render a read-only tile diorama derived from `pixelProgress`. Do not add decoration placement or inventory.

**Step 3: Implement map**

Render twenty tiles in four landmark groups and place Lumi on the current tile.

**Step 4: Verify**

Run: `pnpm test -- --run src/pixel/GardenView.test.tsx src/pixel/MapView.test.tsx`

Expected: PASS.

**Step 5: Commit each screen**

```bash
git add src/pixel/GardenView.tsx src/pixel/GardenView.test.tsx src/popup/App.tsx
git commit -m "feat: add lumi's growing garden"
git add src/pixel/MapView.tsx src/pixel/MapView.test.tsx src/popup/App.tsx
git commit -m "feat: add the lunagrove quest map"
```

### Task 5: Visual QA and cleanup

**Files:**
- Delete: `src/assets/scene/sanctuary-dormant.png`
- Delete: `src/assets/scene/sanctuary-restored.png`
- Delete: `src/scene/SanctuaryScene.tsx`
- Delete: `src/scene/SanctuaryScene.test.tsx`
- Delete: `src/scene/scene.css`
- Modify: `docs/manual-qa.md`

**Step 1: Run automated verification**

Run: `pnpm test -- --run && pnpm run typecheck && pnpm run build`

Expected: all tests PASS, typecheck exit 0, build completes.

**Step 2: Inspect in the in-app browser**

Review idle, running, paused, completed, break, settings, garden, and map states at 400 × 560. Confirm crisp pixels, no clipping, keyboard focus, and reduced motion.

**Step 3: Remove old artwork**

Delete the unused high-detail scene only after the new interface passes visual review.

**Step 4: Repeat final verification**

Run: `pnpm test -- --run && pnpm run typecheck && pnpm run build`

Expected: PASS with no detailed sanctuary assets in `dist/`.

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: retire the detailed sanctuary artwork"
```

