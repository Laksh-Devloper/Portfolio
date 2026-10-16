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

  // Whoosh: filtered noise sweeping up into the flare, then a low sub hit as the shutter opens.
  const whooshAt = t0 + 2.9;
  const noise = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate);
  const ch = noise.getChannelData(0);
  for (let k = 0; k < ch.length; k++) ch[k] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(300, whooshAt);
  bp.frequency.exponentialRampToValueAtTime(5000, whooshAt + 0.75);
  const wg = ctx.createGain();
  wg.gain.setValueAtTime(0.0001, whooshAt);
  wg.gain.exponentialRampToValueAtTime(0.35, whooshAt + 0.7);
  wg.gain.exponentialRampToValueAtTime(0.0001, whooshAt + 1.1);
  src.connect(bp).connect(wg).connect(out);
  src.start(whooshAt);
  hit(t0 + 3.62, 38, 1.6, 0.8);

  setTimeout(() => ctx.close(), 6500);
}
