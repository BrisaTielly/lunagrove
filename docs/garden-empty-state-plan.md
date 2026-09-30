# Living Garden Empty State Implementation Plan

> **For the agent:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Make Lumi's Garden immediately recognizable at stage zero and give it a small, charming ambient life without making the screen busy.

**Architecture:** Keep `GardenView` read-only and derive every visible unlock from `pixelProgress`. Build the zero-state story from existing local pixel assets plus CSS-stepped animation layers; no new storage state, timers, or dependencies are needed.

**Tech Stack:** React, TypeScript, CSS stepped animations, existing PNG sprite sheets, Vitest, Testing Library, Vite.

---

## Approved design

- Lumi is visible from stage zero beside a waiting patch of soil and the first seed.
- The empty-state sign reads “Complete a focus to plant the first seed.”
- The garden title belongs to the scene rather than resembling application chrome.
- Ambient motion is limited to Lumi breathing and blinking, watering drops, lantern sway, leaf movement, and drifting fireflies.
- A newly available detail uses a small sprout-and-sparkle entrance before becoming a permanent part of the garden.
- Progress stays visible but secondary.
- Reduced-motion mode freezes every decorative animation.

### Task 1: Specify the recognizable empty state

**Files:**
- Modify: `src/pixel/GardenView.test.tsx`
- Modify: `src/pixel/GardenView.tsx`

**Steps:**

1. Add a failing test that stage zero includes Lumi, the waiting seed bed, and the first-focus instruction.
2. Run `pnpm test -- --run src/pixel/GardenView.test.tsx` and confirm failure.
3. Add semantic scene elements with stable accessible names and keep unlock rendering derived from `pixelProgress`.
4. Run the focused test and confirm it passes.

### Task 2: Give the garden restrained ambient motion

**Files:**
- Modify: `src/pixel/GardenView.tsx`
- Modify: `src/pixel/garden.css`

**Steps:**

1. Reuse the approved Lumi sprite crop and add local-only lantern, leaves, drops, fireflies, and sparkle layers.
2. Use stepped or low-amplitude keyframes so the screen remains calm.
3. Keep every decorative element out of the accessibility tree.
4. Confirm `.garden-shell--still` and `prefers-reduced-motion` disable every animation.

### Task 3: Verify behavior and visual clarity

**Files:**
- Modify: `src/pixel/GardenView.test.tsx`
- Modify: `docs/garden-empty-state-plan.md`

**Steps:**

1. Run `pnpm test -- --run src/pixel/GardenView.test.tsx src/popup/App.test.tsx`.
2. Run `pnpm exec tsc --noEmit` and `pnpm build`.
3. Inspect the zero-stage Garden at 400 × 533 in the in-app browser.
4. Confirm the screen reads as “Lumi tending a garden that is waiting for the first focus” before reading any small copy.
5. Commit all behavior, styling, tests, and this plan once with `feat: bring Lumi's garden to life`, then push.
