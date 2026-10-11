// Original synthesized "ta-dum" ident (Web Audio, no samples). Must be called from a user gesture.
export function playIdent() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const out = ctx.createDynamicsCompressor();
  out.connect(ctx.destination);
  const t0 = ctx.currentTime + 0.05;

  const env = (g, t, peak, attack, release) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  };

  // Boom: a sine that drops in pitch (the thump) plus a triangle an octave up (the body).
  const hit = (t, freq, release, vol) => {
    [['sine', 1, vol], ['triangle', 2, vol * 0.35]].forEach(([type, mult, v]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq * mult * 2.2, t);
      o.frequency.exponentialRampToValueAtTime(freq * mult, t + 0.09);
      env(g, t, v, 0.008, release);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + release + 0.1);
    });
  };

  hit(t0 + 0.55, 62, 0.45, 0.7); // "ta"
  hit(t0 + 0.9, 46, 2.4, 1); // "DUM"

  // Swell: detuned saws through an opening low-pass, timed with the light streaks.
  const swellAt = t0 + 1.7;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(200, swellAt);
  lp.frequency.exponentialRampToValueAtTime(4000, swellAt + 1.3);
  const sg = ctx.createGain();
  sg.gain.setValueAtTime(0.0001, swellAt);
  sg.gain.exponentialRampToValueAtTime(0.12, swellAt + 1.1);
  sg.gain.exponentialRampToValueAtTime(0.0001, swellAt + 1.9);
  lp.connect(sg).connect(out);
  [110, 164.8, 220, 277.2].forEach((f, k) => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.detune.value = k % 2 ? 9 : -9;
    o.connect(lp);
    o.start(swellAt);
    o.stop(swellAt + 2);
  });

  setTimeout(() => ctx.close(), 5000);
}
