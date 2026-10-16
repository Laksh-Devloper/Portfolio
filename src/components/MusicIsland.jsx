import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, MusicNotes } from '@phosphor-icons/react';
import { tracks } from '../tracks';

const DEFAULT_TINT = '#7b3fe4';
const BARS = 4;

// Average the album art down to one colour, favouring saturated pixels so greys don't win.
function tintFrom(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 24;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 24, 24);
        const d = ctx.getImageData(0, 0, 24, 24).data;
        let r = 0, g = 0, b = 0, w = 0;
        for (let i = 0; i < d.length; i += 4) {
          const max = Math.max(d[i], d[i + 1], d[i + 2]);
          const min = Math.min(d[i], d[i + 1], d[i + 2]);
          const k = (max - min) / 255 + 0.05;
          r += d[i] * k; g += d[i + 1] * k; b += d[i + 2] * k; w += k;
        }
        resolve(`rgb(${Math.round(r / w)} ${Math.round(g / w)} ${Math.round(b / w)})`);
      } catch {
        resolve(DEFAULT_TINT);
      }
    };
    img.onerror = () => resolve(DEFAULT_TINT);
    img.src = src;
  });
}

const fmt = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

// Dynamic Island style player: a black pill at the top that grows into the full controls.
export default function MusicIsland({ autoplay = false }) {
  const root = useRef(null);
  const audio = useRef(null);
  const bars = useRef([]);
  const analyser = useRef(null);
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(() => Math.floor(Math.random() * tracks.length));
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ now: 0, dur: 0 });
  const [tint, setTint] = useState(DEFAULT_TINT);
  const track = tracks[i];

  useEffect(() => {
    if (!track?.art) return setTint(DEFAULT_TINT);
    let live = true;
    tintFrom(track.art).then((c) => live && setTint(c));
    return () => { live = false; };
  }, [track?.art]);

  // Close on outside tap or Escape.
  useEffect(() => {
    if (!open) return;
    const away = (e) => !root.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  // Waveform bars follow the real audio once Web Audio is allowed (after the first play).
  useEffect(() => {
    if (!playing) return;
    let raf;
    const data = new Uint8Array(32);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const a = analyser.current;
      if (a) a.getByteFrequencyData(data);
      bars.current.forEach((el, k) => {
        if (!el) return;
        const v = a ? data[2 + k * 5] / 255 : 0.3 + 0.7 * Math.abs(Math.sin(performance.now() / (180 + k * 70)));
        el.style.transform = `scaleY(${Math.max(0.18, v)})`;
      });
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const connect = () => {
    if (analyser.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const node = ctx.createAnalyser();
      node.fftSize = 64;
      ctx.createMediaElementSource(audio.current).connect(node);
      node.connect(ctx.destination);
      analyser.current = node;
      if (ctx.state === 'suspended') ctx.resume();
    } catch { /* falls back to the idle wave */ }
  };

  const toggle = () => {
    const a = audio.current;
    if (!track) return;
    connect();
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  // Start on mount when music was left on at the Enter screen; that click unlocks audio.
  // Calls play() only (never toggles) so StrictMode's double effect can't pause it again.
  // If the browser still blocks it, start on the first click or key press instead.
  useEffect(() => {
    if (!autoplay || !track) return;
    const start = () => {
      connect();
      audio.current?.play().catch(() => {});
    };
    const later = () => { cleanup(); start(); };
    const cleanup = () => {
      document.removeEventListener('pointerdown', later);
      document.removeEventListener('keydown', later);
    };
    connect();
    audio.current?.play().catch(() => {
      document.addEventListener('pointerdown', later, { once: true });
      document.addEventListener('keydown', later, { once: true });
    });
    return cleanup;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Skipping keeps playing if music was on; the new src only exists after the re-render.
  const resume = useRef(false);
  const go = (dir) => {
    if (!tracks.length) return;
    resume.current = playing || resume.current;
    setI((n) => (n + dir + tracks.length) % tracks.length);
  };
  useEffect(() => {
    if (resume.current && audio.current) audio.current.play().catch(() => {});
    resume.current = false;
  }, [i]);

  const seek = (e) => {
    const a = audio.current;
    if (!a.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
  };

  const art = track?.art
    ? <img src={track.art} alt="" />
    : <span className="island-art-empty"><MusicNotes weight="fill" /></span>;

  return (
    <div
      ref={root}
      className={`island${open ? ' open' : ''}${playing ? ' playing' : ''}`}
      style={{ '--tint': tint }}
    >
      {track && (
        <audio
          ref={audio}
          src={track.src}
          crossOrigin="anonymous"
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { resume.current = true; go(1); }}
          onTimeUpdate={(e) => setTime({ now: e.target.currentTime, dur: e.target.duration })}
          onLoadedMetadata={(e) => setTime({ now: 0, dur: e.target.duration })}
        />
      )}

      <button className="island-pill" onClick={() => setOpen(true)} aria-label="Open music player" aria-expanded={open} tabIndex={open ? -1 : 0}>
        <span className="island-art">{art}</span>
        <span className="island-wave" aria-hidden="true">
          {Array.from({ length: BARS }, (_, k) => <i key={k} ref={(el) => { bars.current[k] = el; }} />)}
        </span>
      </button>

      <div className="island-panel" aria-hidden={!open}>
        <div className="island-head">
          <span className="island-art lg">{art}</span>
          <span className="island-meta">
            <b>{track?.title ?? 'Nothing playing'}</b>
            <small>{track?.artist ?? 'Playlist coming soon'}</small>
          </span>
          <span className="island-wave lg" aria-hidden="true">
            {Array.from({ length: BARS }, (_, k) => <i key={k} />)}
          </span>
        </div>
        <div className="island-time">
          <span>{fmt(time.now)}</span>
          <span className="island-bar" onClick={seek} role="presentation">
            <i style={{ transform: `scaleX(${time.dur ? time.now / time.dur : 0})` }} />
          </span>
          <span>{fmt(time.dur)}</span>
        </div>
        <div className="island-controls">
          <button onClick={() => go(-1)} disabled={tracks.length < 2} aria-label="Previous track" tabIndex={open ? 0 : -1}><SkipBack weight="fill" /></button>
          <button className="island-play" onClick={toggle} disabled={!track} aria-label={playing ? 'Pause' : 'Play'} tabIndex={open ? 0 : -1}>
            {playing ? <Pause weight="fill" /> : <Play weight="fill" />}
          </button>
          <button onClick={() => go(1)} disabled={tracks.length < 2} aria-label="Next track" tabIndex={open ? 0 : -1}><SkipForward weight="fill" /></button>
        </div>
      </div>
    </div>
  );
}
