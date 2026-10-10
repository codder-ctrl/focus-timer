import { DURATIONS, LONG_EVERY } from './config.js';
import { $ } from './dom.js';
import { data, todayKey, save } from './store.js';
import { unlockAudio, chime } from './sound.js';
import { renderStats } from './stats.js';
import { renderTasks } from './tasks.js';

const CIRC = 2 * Math.PI * 54;
const bar = $('bar');
bar.style.strokeDasharray = CIRC;

// ---- timer state ----
// `mode` and `endAt` are exported as live bindings; only this module assigns them.
export let mode = 'focus';
let total = DURATIONS.focus * 60 * 1000;
let remaining = total;
export let endAt = null;      // timestamp when running, null when paused
let tick = null;
let focusCount = 0;    // completed focus sessions this page visit, for long-break cadence

function fmt(ms) {
  const s = Math.ceil(ms / 1000);
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function render() {
  const t = fmt(remaining);
  $('time').textContent = t;
  bar.style.strokeDashoffset = CIRC * (remaining / total);
  $('toggle').textContent = endAt ? 'Pause' : (remaining < total ? 'Resume' : 'Start');
  const label = { focus: 'Focus', short: 'Break', long: 'Long break' }[mode];
  document.title = endAt ? `${t} · ${label}` : 'Focus Timer';
}

export function setMode(m) {
  pause();
  mode = m;
  document.documentElement.dataset.mode = m;
  document.querySelectorAll('.modes button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  total = remaining = DURATIONS[m] * 60 * 1000;
  render();
}

export function start() {
  if (endAt) return;
  unlockAudio();
  endAt = Date.now() + remaining;
  tick = setInterval(() => {
    remaining = Math.max(0, endAt - Date.now());
    if (remaining === 0) finish(); else render();
  }, 250);
  render();
}

export function pause() {
  if (!endAt) return;
  remaining = Math.max(0, endAt - Date.now());
  endAt = null;
  clearInterval(tick);
  render();
}

export function finish(skipped = false) {
  pause();
  if (mode === 'focus' && !skipped) {
    const d = data.days[todayKey()] ||= { sessions: 0, minutes: 0 };
    d.sessions++;
    d.minutes += DURATIONS.focus;
    const task = data.tasks.find(t => t.id === data.activeId);
    if (task) task.pomos = (task.pomos || 0) + 1;
    save();
    renderStats();
    renderTasks();
    focusCount++;
  }
  if (!skipped) chime();
  setMode(mode === 'focus' ? (!skipped && focusCount % LONG_EVERY === 0 ? 'long' : 'short') : 'focus');
}
