import { useRef, useState } from 'react';
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { gsap, useGSAP, reduced } from '../motion';
import { playIdent } from '../sound';
import { me } from '../data';

const RIBBONS = 36;
const shades = ['#e5383b', '#ff6b6e', '#8a1517', '#ffb3b4', '#b3191c', '#5a0d0e', '#ff8a3d'];

// Netflix-style ident, timed to the synthesized "ta-dum" in sound.js:
// arched wordmark lands, punches on the hit, collapses to the first letter, then the camera
// dives into that letter as it splits into a tunnel of light ribbons.
// Browsers block audio until a click, so an Enter screen comes first.
export default function Intro({ onDone, onReveal }) {
  const root = useRef(null);
  const [started, setStarted] = useState(false);
  const [music, setMusic] = useState(true);
  const done = () => onDone(music);

  useGSAP(() => {
    if (reduced()) return;
    if (!started) {
      gsap.from('.intro-enter', { opacity: 0, y: 20, duration: 1, ease: 'expo.out' });
      return;
    }
    const chars = gsap.utils.toArray('.intro-ch');
    const [first, ...rest] = chars;
    // Distance that slides the first letter to screen centre once the others are gone.
    const toCentre = () => {
      const r = first.getBoundingClientRect();
      return window.innerWidth / 2 - (r.left + r.width / 2);
    };

    gsap.set('.intro-tunnel', { autoAlpha: 0 });
    gsap.timeline({ onComplete: done, defaults: { ease: 'expo.out' } })
      // Land: letters drop in from a soft zoom with a blur, centre-out.
      .from(chars, { opacity: 0, scale: 1.6, filter: 'blur(14px)', duration: 0.9, stagger: { each: 0.05, from: 'center' } }, 0.1)
      // "DUM": a short punch and a flash of glow.
      .to('.intro-logo', { scale: 1.06, duration: 0.12, ease: 'power2.out' }, 0.95)
      .to('.intro-logo', { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, 1.07)
      .to('.intro-glow', { opacity: 1, duration: 0.1 }, 0.95)
      .to('.intro-glow', { opacity: 0.35, duration: 0.9, ease: 'power2.out' }, 1.05)
      // Collapse to the first letter.
      .to(rest, { opacity: 0, x: 40, stagger: 0.03, duration: 0.35, ease: 'power2.in' }, 1.55)
      .to(first, { x: toCentre, duration: 0.6, ease: 'power3.inOut' }, 1.65)
      // Dive: the letter grows and gives way to ribbons that fan out from its stem.
      .to(first, { scale: 5, opacity: 0, duration: 0.9, ease: 'power3.in' }, 2.2)
      .to('.intro-tunnel', { autoAlpha: 1, duration: 0.2 }, 2.35)
      .from('.intro-ribbon', { scaleY: 0, duration: 0.7, stagger: { each: 0.012, from: 'center' } }, 2.35)
      .fromTo('.intro-ribbons', { scaleX: 0.08 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 2.4)
      // Warp: ribbons rush past the camera, smearing into motion blur.
      .to('.intro-ribbons', { scale: 4, filter: 'blur(6px) brightness(1.8)', duration: 0.7, ease: 'power4.in' }, 3.0)
      // Flare at the peak of the whoosh; the gate mounts behind the black.
      .to('.intro-flare', { opacity: 1, scaleX: 1, duration: 0.18, ease: 'power2.out' }, 3.55)
      .add(() => onReveal?.(music), 3.62)
      .set('.intro-tunnel', { autoAlpha: 0 }, 3.7)
      // Shutter: the black splits along the flare line, like a projector gate opening.
      .to('.intro-bar-top', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 3.72)
      .to('.intro-bar-bottom', { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, 3.72)
      .to('.intro-flare', { opacity: 0, scaleY: 0.2, duration: 0.6, ease: 'power2.in' }, 3.8)
      // Behind it, the gate settles out of a slow dolly and soft focus.
      .add(() => gsap.fromTo('.gate', { scale: 1.12, filter: 'blur(12px)' }, {
        scale: 1, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out', clearProps: 'transform,filter',
      }), 3.72);
  }, { scope: root, dependencies: [started] });

  const start = () => {
    if (reduced()) return done();
    playIdent();
    setStarted(true);
  };

  return (
    <div className={`intro${started ? ' is-playing' : ''}`} ref={root}>
      <div className="intro-bar intro-bar-top" aria-hidden="true" />
      <div className="intro-bar intro-bar-bottom" aria-hidden="true" />
      {started ? (
        <>
          <div className="intro-glow" aria-hidden="true" />
          <div className="intro-logo" aria-label={me.logo} role="img">
            {[...me.logo].map((c, k, all) => {
              // Netflix-style arch: letters get taller towards the ends.
              const d = (k - (all.length - 1) / 2) / ((all.length - 1) / 2 || 1);
              return <span className="intro-ch" key={k} style={{ '--arch': 1 + 0.16 * d * d }}>{c}</span>;
            })}
          </div>
          <div className="intro-flare" aria-hidden="true" />
          <div className="intro-tunnel" aria-hidden="true">
            <div className="intro-ribbons">
              {Array.from({ length: RIBBONS }, (_, k) => (
                <i
                  className="intro-ribbon"
                  key={k}
                  style={{
                    '--c': shades[(k * 5) % shades.length],
                    height: `${55 + ((k * 37) % 45)}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="intro-enter">
          <button className="btn btn-primary btn-lg" onClick={start} autoFocus>Enter</button>
          <button className="intro-music" onClick={() => setMusic((m) => !m)} aria-pressed={music}>
            {music ? <SpeakerHigh /> : <SpeakerSlash />} Music {music ? 'on' : 'off'}
          </button>
        </div>
      )}
      <button className="intro-skip" onClick={done}>Skip intro</button>
    </div>
  );
}
