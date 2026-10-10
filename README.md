# Focus Timer

A Pomodoro-style focus timer with a progress ring, a task list and daily stats. It's plain HTML, CSS and JavaScript (ES modules) with no build step and no dependencies.

## Getting started

The scripts are ES modules, which browsers won't load from a `file://` page, so serve the folder over HTTP instead of opening `index.html` directly. Any static server works, for example:

```bash
python -m http.server 8000 --directory focus-timer
```

Then open <http://localhost:8000>.

## Project layout

| File | Contents |
|---|---|
| `index.html` | Markup; loads `styles.css` and `js/main.js` |
| `styles.css` | All styles, including the mode accents and dark mode |
| `js/config.js` | Durations, long-break cadence and storage key |
| `js/store.js` | Saved data (`localStorage`) |
| `js/timer.js` | Timer state, modes, start / pause / finish, ring and time display |
| `js/stats.js` | Today's stats and the day streak |
| `js/tasks.js` | Task list and the add-task form |
| `js/sound.js` | The end-of-session chime |
| `js/dom.js` | `$` lookup helper |
| `js/main.js` | Buttons, keyboard shortcuts and startup |

## Features

- **Three modes:** Focus (25 min), Short break (5 min) and Long break (15 min). The accent colour changes with the mode.
- **Progress ring:** it fills as time passes, and the browser tab title shows the countdown so you can see it from other tabs.
- **Auto-advance:** when a focus session ends, a short chime plays and a break starts. Every 4th break is a long one.
- **Tasks:** add tasks and click one to make it the current focus. Each finished session adds a 🍅 to that task. Tasks can be ticked off or deleted.
- **Stats:** sessions today, focus minutes today, and a day streak (consecutive days with at least one finished session).

## Keyboard shortcuts

| Key     | Action        |
|---------|---------------|
| `Space` | Start / pause |
| `R`     | Reset         |
| `S`     | Skip          |

## Data storage

Tasks and stats are saved in the browser's `localStorage` under the key `focus-timer-v1`. They stay on your machine, in the browser you used. Storage is per address, so data saved while the page was opened from a file, or from a different port, won't show up at `http://localhost:8000`.

If storage is unavailable (for example in a private window or in some embedded previews), the timer still works, but nothing is saved between visits.

## Customising

The durations are set in `js/config.js`:

```js
export const DURATIONS = { focus: 25, short: 5, long: 15 }; // minutes
export const LONG_EVERY = 4;
```

## Ideas for next steps

- Custom durations set from the page
- An option to start the next session automatically
- A weekly chart of focus minutes
