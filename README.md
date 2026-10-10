# Focus Timer

A Pomodoro-style focus timer with a progress ring, a task list and daily stats. It's a single HTML file with no build step and no dependencies.

## Getting started

Open `index.html` in any modern browser:

```bash
start focus-timer/index.html
```

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

Tasks and stats are saved in the browser's `localStorage` under the key `focus-timer-v1`. They stay on your machine, in the browser you used.

If storage is unavailable (for example in a private window or in some embedded previews), the timer still works, but nothing is saved between visits.

## Customising

The durations are set at the top of the script in `index.html`:

```js
const DURATIONS = { focus: 25, short: 5, long: 15 }; // minutes
const LONG_EVERY = 4;
```

## Ideas for next steps

- Custom durations set from the page
- An option to start the next session automatically
- A weekly chart of focus minutes
