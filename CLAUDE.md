# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Focus Timer: a Pomodoro-style timer with a progress ring, a task list and daily stats. It's `index.html` (markup), `styles.css` and native ES modules in `js/`. It has no build step, no dependencies, no package manager, no tests and no linter. Keep it free of dependencies and build tooling unless asked otherwise.

## Running

ES modules don't load from `file://`, so serve the folder over HTTP (from this directory):

```bash
python -m http.server 8000
```

Then open http://localhost:8000. To verify a change, reload the page and use it. No automated tests exist.

## Architecture

Modules (`js/`), with `main.js` as the entry point: `config` → `dom` (`$`) → `store` → `sound`, `stats`, `tasks` → `timer` → `main`. There are no import cycles; keep it that way. `timer.js` imports `renderStats` / `renderTasks` / `chime` because `finish()` calls them.

- **Config (`config.js`):** `DURATIONS` (minutes per mode), `LONG_EVERY` (long-break cadence), `KEY` (localStorage key `focus-timer-v1`). The README tells users to edit these, so keep the file and names.
- **Module state:** `mode` and `endAt` are exported from `timer.js` as live bindings that `main.js` reads. Imports are read-only, so only `timer.js` may assign them. Add an exported function if another module needs to change timer state. `data` (in `store.js`) is a `const` object, so mutate its properties and never reassign it.
- **Two kinds of state:**
  - *Persisted* `data = { tasks, activeId, days }`, where `days` is keyed `YYYY-MM-DD` (from `toLocaleDateString('en-CA')`, local time) → `{ sessions, minutes }`. Every change goes through `save()`.
  - *Per-visit timer state:* `mode`, `total`, `remaining`, `endAt`, `focusCount`. `focusCount` isn't persisted, so the long-break cadence restarts when the page reloads.
- **Timing uses the wall clock:** while running, `endAt` is a timestamp and a 250 ms interval recomputes `remaining = endAt - Date.now()`. This keeps time accurate when a background tab is throttled. `endAt === null` means paused. Don't switch to decrementing a counter.
- **Flow:** `start` / `pause` / `finish(skipped)` / `setMode`. `finish` records stats and a 🍅 on the active task only for a focus session that wasn't skipped, then moves to the next mode. `setMode` always pauses and resets the time.
- **Rendering:** `render()` (in `timer.js`; time, ring, button label, tab title), `renderStats()` (today + streak), `renderTasks()` (rebuilds the whole list each time and sets one `onclick` per `<li>` that branches on the clicked element). After changing `data`, call `save()` and then the matching render function.
- **Audio:** `unlockAudio()` creates the AudioContext inside the Start click, because browsers block autoplay. `chime()` plays nothing if audio was never unlocked.
- **Theming (`styles.css`):** CSS custom properties on `:root`. The mode accent is set through `data-mode` on `<html>`, and dark mode through `prefers-color-scheme`.

## Rules to keep

- Wrap every `localStorage` access in try/catch. The app must still work when storage is unavailable (private windows, embedded previews).
- Put user text (task names) in with `textContent`, never by interpolating it into `innerHTML`.
- Keyboard shortcuts (Space / R / S) must ignore key presses while typing in an input, presses with Ctrl/Meta/Alt held, and key auto-repeat (`e.repeat`). These checks fixed earlier bugs (PRs #1 and #2). The keydown listener expects `e.target` to be an element: synthetic events dispatched on `document` itself throw, so test on `document.body`.
- If you change the stored data shape, keep reading old saved data (it's merged with `Object.assign` over the defaults) or bump the version in `KEY`.
