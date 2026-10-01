# Chrome Web Store submission

Copy-paste material for the Developer Dashboard. Images live next to this file.

## Store listing

**Name:** Lunagrove — Pixel Pomodoro (from the manifest)

**Summary** (from the manifest, 132 characters max):
A gentle pixel-art Pomodoro that grows a moonlit garden, one focus at a time.

**Category:** Productivity → Workflow & Planning

**Language:** English

**Description:**

```
Lunagrove is a gentle Pomodoro timer wrapped in a tiny pixel-art world.

Meet Lumi, a little moon spirit who tends a moonlit garden while you focus. Every focus session you complete plants something new: a seed, a moon-flower, a pond with lily pads, a little bridge, a moon gate, and finally a glowing shrine on the hill. Twenty sessions turn an empty meadow into a living garden. Then a second garden opens: Mushroom Hollow, a glowing forest clearing with its own twenty pieces. Your progress never goes backwards.

FOCUS, GENTLY
- Classic focus and break sessions with your own durations, plus a long break every few sessions
- Pause, resume or end a session at any time
- Keeps time even with the popup closed, and recovers sessions after a browser restart
- The minutes left show right on the toolbar icon
- A soft 8-bit chime and an optional notification when a session ends
- Start or pause from anywhere with Alt+Shift+L, and let breaks start on their own if you like

WATCH IT GROW
- Twenty garden pieces across four chapters: Sprout, Pond, Bridge and Shrine, each one celebrated by Lumi
- A new friend moves in at the end of every chapter: a bunny, a frog, an owl and a moon fox, then a snail, a hedgehog, a moth and a spirit deer
- Two gardens to grow, and you can revisit the first one any time
- Seasons that turn with your garden: spring flowers, summer grass, autumn leaves and winter snow, with an outfit for Lumi in each (or follow the real calendar)
- Lumi has a mood for every moment, and she loves being petted
- Focus stats: today, this week, all time, the last seven days and your streaks
- Living pixel scenes: Lumi breathes and blinks, stars twinkle, the lantern sways and fireflies drift
- Reduced-motion mode that stills every animation

PRIVATE BY DESIGN
- No account, no tracking, no ads, no servers
- Everything stays in your browser
- Export and restore a backup whenever you like

No streak anxiety, no neglected pet, no punishment for taking a break. Focus. Grow. Return.
```

**Graphic assets:**

| Field | File |
|---|---|
| Store icon (128×128) | `store-icon-128.png` |
| Screenshots (1280×800) | `screenshot-1-home.png` … `screenshot-5-privacy.png` |
| Small promo tile (440×280) | `promo-small-440x280.png` |
| Marquee promo tile (1400×560) | `promo-marquee-1400x560.png` |

**Links:**
- Homepage: https://github.com/BrisaTielly/lunagrove
- Support: https://github.com/BrisaTielly/lunagrove/issues

## Privacy practices

**Single purpose:**
Lunagrove is a Pomodoro focus timer. Completed focus sessions grow a pixel-art garden and are summarized in local focus stats.

**Permission justifications:**

| Permission | Justification |
|---|---|
| `storage` | Saves the user's timer preferences, the current session and their focus history locally so progress survives closing the popup and restarting Chrome. |
| `alarms` | Ends a focus or break session at the right time while the popup is closed, and resumes pending sessions after a browser restart. |
| `notifications` | Optionally tells the user that a focus or break session has ended. Can be turned off in the settings. |
| `offscreen` | Plays the optional end-of-session chime while the popup is closed, since the service worker cannot play audio. |

**Remote code:** No, I am not using remote code. All scripts ship inside the package.

**Data usage:** Lunagrove does not collect any of the listed data types. Check all three certifications (no selling or transferring data, no unrelated use, no creditworthiness use).

**Privacy policy URL:** https://github.com/BrisaTielly/lunagrove/blob/feat/lunagrove-mvp/PRIVACY.md

## Package

```bash
pnpm package
```

Builds the extension and writes `lunagrove-<version>.zip` (with `manifest.json` at its root) to the project folder. Upload that file under **Package → Upload new package**. Bump `version` in both `package.json` and `manifest.config.ts` before each new upload.
