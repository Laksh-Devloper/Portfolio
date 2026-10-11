import { useRef, useState } from 'react';
import { SpeakerHigh } from '@phosphor-icons/react';
import { gsap, useGSAP, reduced } from '../motion';
import { playIdent } from '../sound';
import { me } from '../data';

const STREAKS = 28;
const shades = ['var(--accent)', '#ff6b6e', '#8a1517', '#f2f2f0', '#b3191c'];

// Netflix-style ident: letters rise, light ribbons burst, camera dives into the logo.
// Browsers block audio until a click, so an Enter screen comes first.
export default function Intro({ onDone }) {
  const root = useRef(null);
  const [started, setStarted] = useState(false);

  useGSAP(() => {
    if (reduced()) return onDone();
    if (!started) {
      gsap.from('.intro-enter', { opacity: 0, y: 20, duration: 1, ease: 'expo.out' });
      return;
    }
    gsap.timeline({ onComplete: onDone })
      .from('.intro-ch', { yPercent: 120, scaleY: 1.8, opacity: 0, stagger: 0.07, duration: 0.9, ease: 'expo.out' })
      .to('.intro-logo', { scale: 1.12, duration: 1, ease: 'power2.inOut' }, '+=0.1')
      .from('.intro-streak', { scaleY: 0, stagger: { each: 0.012, from: 'center' }, duration: 0.6, ease: 'expo.out' }, '<0.4')
      .to('.intro-logo', { scale: 70, duration: 1.1, ease: 'expo.in' }, '-=0.25')
      .to(root.current, { opacity: 0, duration: 0.3 }, '-=0.3');
  }, { scope: root, dependencies: [started] });

  const start = () => {
    playIdent();
    setStarted(true);
  };

  return (
    <div className="intro" ref={root}>
      {started ? (
        <div className="intro-logo" aria-label={me.logo} role="img">
          {[...me.logo].map((c, k) => <span className="intro-ch" key={k}>{c}</span>)}
          <span className="intro-streaks" aria-hidden="true">
            {Array.from({ length: STREAKS }, (_, k) => (
              <i className="intro-streak" key={k} style={{ background: shades[(k * 7) % shades.length], height: `${40 + ((k * 37) % 60)}%` }} />
            ))}
          </span>
        </div>
      ) : (
        <div className="intro-enter">
          <button className="btn btn-primary btn-lg" onClick={start} autoFocus>Enter</button>
          <p><SpeakerHigh /> Best with sound on</p>
        </div>
      )}
      <button className="intro-skip" onClick={onDone}>Skip intro</button>
    </div>
  );
}
