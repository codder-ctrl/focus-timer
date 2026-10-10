// ---- sound ----
let audio;
export function unlockAudio() {
  try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch {}
}
export function chime() {
  if (!audio) return;
  [659.25, 783.99, 1046.5].forEach((f, i) => {
    const o = audio.createOscillator(), g = audio.createGain();
    const t = audio.currentTime + i * 0.18;
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    o.connect(g).connect(audio.destination);
    o.start(t); o.stop(t + 0.85);
  });
}
