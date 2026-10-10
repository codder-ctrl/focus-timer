import { $ } from './dom.js';
import { mode, endAt, setMode, start, pause, finish } from './timer.js';
import { renderStats } from './stats.js';
import { renderTasks } from './tasks.js';

// ---- wiring ----
$('toggle').onclick = () => endAt ? pause() : start();
$('reset').onclick = () => setMode(mode);
$('skip').onclick = () => finish(true);
document.querySelectorAll('.modes button').forEach(b => b.onclick = () => setMode(b.dataset.mode));
document.addEventListener('keydown', e => {
  if (e.target.matches('input')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return; // leave browser shortcuts like Ctrl+S alone
  if (e.repeat) return; // holding a key down shouldn't toggle start/pause over and over
  const key = e.key.toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); $('toggle').click(); }
  else if (key === 'r') $('reset').click();
  else if (key === 's') $('skip').click();
});

setMode('focus');
renderStats();
renderTasks();
