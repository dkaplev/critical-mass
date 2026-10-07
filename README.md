# Critical Mass

A mobile-first chain-reaction puzzle game by Dmitrii Kaplev.

Tap an outlined tile to add an orb. Full tiles burst into their neighbours. Clear the amber targets within the tap budget.

## Current game

- 16 authored levels followed by deterministic generated remixes, on boards up to 6x6.
- Primed tiles, untappable relays, shielded targets, and delayed-ignition challenges.
- Accelerating cascades with flowing directional trails, magical blasts, sound and haptics.
- Undo, restart, skip animation, tile guides, and browser-local progress.
- Stars reward efficient taps and long explosion chains.
- Nova charges all tiles; Row Sweep clears the targets in a selected row.

Powers use free prototype charges. Ads are placeholders; no purchases or advertising SDK are connected.

## Run locally

The complete static application is in `dist/`. No dependencies or build step are needed.

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080.

## Deploy on Vercel

Import this repository at https://vercel.com/new. Use the repository root, framework preset **Other**, no build or install command, and output directory **dist**. The included `vercel.json` configures these settings.

## Verification

Run with Node.js:

```sh
node check-remixes.mjs
node check-powers.mjs
node check-scoring.mjs
node check-tutorials.mjs
```

Simulation is separate from animation. Generated remixes retain verified solutions and tap budgets; orb bounds and a wave cap protect cascade termination. Human difficulty and animation feel still benefit from device playtesting.

Progress is saved per browser and domain. A new hosting domain starts a separate save.

## First-move tutorial

Level 1 has three primed targets. Tapping any target clears them with a five-to-seven-burst chain; the suggested corner gives seven bursts over six waves. A gentle arrow appears after four idle seconds on the untouched first board, starting after the introduction closes. It is suppressed while paused, hidden, or in a menu, and permanently dismissed after the first move. Later tile introductions remain in place.

For the browser regression check, install Playwright and its Chromium browser, then run `node check-onboarding.mjs`. The check starts its own static server and covers hint timing, pause, navigation, replay, undo, saved state, reduced motion, and the first-level result. `BROWSER_EXECUTABLE` can select an existing Chromium executable.

Level 2 teaches a setup move: charge the bottom-right target, then tap again for a seven-burst chain. Its verified minimum is two taps. Nearly full tiles gently pulse while the board is idle; reduced motion shows a static rim. Powers and their help/rescue entry points appear from level 6, with the existing first-use introduction.
