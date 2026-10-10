import { $ } from './dom.js';
import { data, todayKey } from './store.js';

// ---- stats ----
export function renderStats() {
  const d = data.days[todayKey()] || { sessions: 0, minutes: 0 };
  $('today').textContent = d.sessions;
  $('minutes').textContent = d.minutes;
  // streak: consecutive days with ≥1 session, ending today (or yesterday if none yet today)
  let streak = 0;
  const day = new Date();
  if (!data.days[todayKey()]) day.setDate(day.getDate() - 1);
  while (data.days[day.toLocaleDateString('en-CA')]?.sessions) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  $('streak').textContent = streak;
}
