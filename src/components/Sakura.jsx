import { useEffect, useRef } from 'react';
import { reduced } from '../motion';

const COLORS = ['#ffc2d4', '#ffb0c8', '#ff9fbd', '#ffd6e2'];

// Falling sakura petals on one fixed canvas. Scrolling blows a gust through them.
export default function Sakura({ density = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (reduced()) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (anywhere) => ({
      x: Math.random() * w * 1.2 - w * 0.1,
      y: anywhere ? Math.random() * h : -20,
      size: 6 + Math.random() * 8,
      vy: 0.5 + Math.random() * 0.9,
      vx: 0.3 + Math.random() * 0.6,
      spin: Math.random() * Math.PI * 2,
      spinV: (Math.random() - 0.5) * 0.04,
      flip: Math.random() * Math.PI * 2,
      flipV: 0.02 + Math.random() * 0.04,
      sway: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.55 + Math.random() * 0.4,
    });
    const count = Math.round((w < 768 ? 16 : 34) * density);
    const petals = Array.from({ length: count }, () => spawn(true));

    // Scroll velocity becomes wind and lift, then decays.
    let lastY = window.scrollY;
    let gust = 0;
    const onScroll = () => {
      gust += (window.scrollY - lastY) * 0.04;
      gust = Math.max(-6, Math.min(6, gust));
      lastY = window.scrollY;
    };

    const draw = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.scale(Math.cos(p.flip), 1);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.9, s * 0.8, s * 0.6, 0, s);
      ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s * 0.9, -s * 0.9, -s * 0.15, -s * 0.85);
      ctx.lineTo(0, -s * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      gust *= 0.94;
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < petals.length; k++) {
        const p = petals[k];
        p.sway += 0.015;
        p.spin += p.spinV + gust * 0.004;
        p.flip += p.flipV;
        p.x += p.vx + Math.sin(p.sway) * 0.6 + Math.abs(gust) * 0.6;
        p.y += p.vy - gust * 0.5;
        if (p.y > h + 20 || p.x > w + 40) petals[k] = spawn(false);
        else if (p.y < -40) p.y = h + 10;
        draw(p);
      }
    };
    tick();

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [density]);

  return <canvas className="sakura" ref={ref} aria-hidden="true" />;
}
