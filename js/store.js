import { KEY } from './config.js';

// ---- persisted state ----
export const todayKey = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
export const data = { tasks: [], activeId: null, days: {} }; // days: { 'YYYY-MM-DD': { sessions, minutes } }
try { Object.assign(data, JSON.parse(localStorage.getItem(KEY)) || {}); } catch {}
export const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} };
