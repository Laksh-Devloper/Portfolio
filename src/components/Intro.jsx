import { useRef, useState } from 'react';
import { SpeakerHigh } from '@phosphor-icons/react';
import { gsap, useGSAP, reduced } from '../motion';
import { playIdent } from '../sound';
import { me } from '../data';
import Sakura from './Sakura';

const RAYS = 40;

// Anime title card: letters slam in on the "ta-dum", speed lines burst, then an iris-out.
// Browsers block audio until a click, so an Enter screen comes first.
export default function Intro({ onDone }) {
  const root = useRef(null);
  const [started, setStarted] = useState(false);
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    onDone();
  };

  useGSAP(() => {
    if (reduced()) return finish();
    if (!started) {
      gsap.from('.intro-enter > *', { opacity: 0, y: 24, stagger: 0.12, duration: 1, ease: 'expo.out' });
      return;
    }
    gsap.timeline({ onComplete: finish })
      .from('.intro-ch', { scale: 3.2, opacity: 0, filter: 'blur(12px)', stagger: 0.08, duration: 0.35, ease: 'power4.in' }, 0.5)
      .fromTo('.intro-rays', { scale: 0.2, opacity: 0, rotate: -20 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'expo.out' }, 0.95)
      .fromTo('.intro-card', { x: -14, y: 8 }, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.2)' }, 0.95)
      .from('.intro-sub', { yPercent: 120, opacity: 0, duration: 0.7, ease: 'expo.out' }, 1.3)
      .to('.intro-rays', { rotate: 25, duration: 2.2, ease: 'none' }, 1.5)
      .to('.intro-ch', { y: -6, stagger: { each: 0.05, yoyo: true, repeat: 1 }, duration: 0.25, ease: 'sine.inOut' }, 1.8)
      .to('.intro-flash', { opacity: 1, duration: 0.12, yoyo: true, repeat: 1 }, 2.9)
      .to(root.current, { clipPath: 'circle(0% at 50% 50%)', duration: 0.7, ease: 'expo.in' }, 3.05);
  }, { scope: root, dependencies: [started] });

  const start = () => {
    if (started) return;
    playIdent();
    setStarted(true);
  };

  return (
    <div className="intro" ref={root}>
      <Sakura density={0.8} />
      {started ? (
        <div className="intro-card" aria-label={me.logo} role="img">
          <svg className="intro-rays" viewBox="-100 -100 200 200" aria-hidden="true">
            {Array.from({ length: RAYS }, (_, k) => {
              const a = (k / RAYS) * Math.PI * 2;
              const b = a + (k % 3 === 0 ? 0.05 : 0.025);
              return <path key={k} d={`M0 0L${150 * Math.cos(a)} ${150 * Math.sin(a)}L${150 * Math.cos(b)} ${150 * Math.sin(b)}Z`} />;
            })}
          </svg>
          <span className="intro-logo">
            {[...me.logo].map((c, k) => <span className="intro-ch" key={k}>{c}</span>)}
          </span>
          <span className="intro-sub-mask"><span className="intro-sub">開発者 · Developer</span></span>
        </div>
      ) : (
        <div className="intro-enter">
          <span className="intro-kicker">第一話 · Episode 1</span>
          <button className="btn btn-primary btn-lg" onClick={start} autoFocus>Enter</button>
          <p><SpeakerHigh /> Best with sound on</p>
        </div>
      )}
      <span className="intro-flash" aria-hidden="true" />
      <button className="intro-skip" onClick={finish}>Skip intro</button>
    </div>
  );
}
