# GitHub README Showcase Implementation Plan

> **For the agent:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Create an image-rich English README that introduces Lunagrove, puts Lumi in the spotlight, and documents development and Chrome installation accurately.

**Architecture:** Keep documentation images in `docs/assets/` so GitHub paths remain stable. Derive the mascot portrait directly from the approved sprite sheet and reuse the approved home-screen artwork rather than generating new visuals.

**Tech Stack:** GitHub-flavored Markdown, HTML alignment blocks, PNG assets, React/TypeScript/Vite project commands.

---

### Task 1: Prepare official README artwork

**Files:**
- Create: `docs/assets/lumi.png`
- Create: `docs/assets/lunagrove-popup.png`

**Step 1: Crop Lumi from the approved sprite sheet**

Crop the `193 × 211` Lumi box beginning at `(18, 284)` in `src/assets/pixel/lunagrove-sprites.png`. Preserve alpha and add no effects or reinterpretation.

**Step 2: Copy the approved product screen**

Copy `src/assets/pixel/lunagrove-home.png` to `docs/assets/lunagrove-popup.png` so README artwork is self-contained.

**Step 3: Verify the images**

Run:

```bash
file docs/assets/lumi.png docs/assets/lunagrove-popup.png
```

Expected: two non-empty PNG files; Lumi uses RGBA and the popup uses the approved `493 × 657` composition.

**Step 4: Commit**

```bash
git add docs/assets
git commit -m "docs: add official readme artwork"
```

### Task 2: Build the GitHub showcase README

**Files:**
- Create: `README.md`

**Step 1: Write the visual introduction**

Add a centered title, concise English tagline, a small set of accurate badges, the transparent Lumi portrait, and the approved popup screenshot.

**Step 2: Document the product**

Describe the current timer, persistence, alarms, notifications, settings, backup, progress journey, and gentle no-punishment philosophy. Clearly mark Garden and Journey Map as upcoming.

**Step 3: Add development and installation guidance**

Include prerequisites, `pnpm install`, `pnpm dev`, `pnpm build`, test commands, and Chrome's Load unpacked flow using `dist/`.

**Step 4: Verify local links and project commands**

Run:

```bash
test -s README.md
test -f docs/assets/lumi.png
test -f docs/assets/lunagrove-popup.png
pnpm test -- --run
pnpm run typecheck
```

Expected: asset checks exit zero, all tests pass, and TypeScript reports no errors.

**Step 5: Commit**

```bash
git add README.md
git commit -m "docs: showcase lunagrove on github"
```
