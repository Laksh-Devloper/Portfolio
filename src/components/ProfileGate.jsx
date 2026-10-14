import { useRef } from 'react';
import { gsap, useGSAP, reduced } from '../motion';
import { profiles, me } from '../data';

export default function ProfileGate({ onPick }) {
  const root = useRef(null);
  const picked = useRef(false);

  const { contextSafe } = useGSAP(() => {
    if (reduced()) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.gate .logo', { opacity: 0, y: -20, duration: 0.8 })
      .from('.gate-title', { y: 40, opacity: 0, duration: 1 }, '<0.1')
      .from('.gate-profile', { y: 60, scale: 0.85, opacity: 0, stagger: 0.08, duration: 1.1 }, '<0.15')
      .from('.gate-glow', { scale: 0.6, opacity: 0, duration: 2, ease: 'power2.out' }, 0);
  }, { scope: root });

  // A double click used to start two exit timelines and call onPick twice.
  const pick = contextSafe((profile, el) => {
    if (picked.current) return;
    picked.current = true;
    if (reduced()) return onPick(profile);
    const others = gsap.utils.toArray('.gate-profile').filter((n) => n !== el);
    gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: () => onPick(profile) })
      .to(others, { opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.04 })
      .to('.gate-title', { opacity: 0, y: -20, duration: 0.5 }, 0)
      .to(el, { scale: 1.25, duration: 0.7 }, 0.1)
      .to(root.current, { scale: 1.6, opacity: 0, duration: 0.7, ease: 'expo.in' }, 0.55);
  });

  return (
    <div className="gate" ref={root}>
      <span className="gate-glow" aria-hidden="true" />
      <span className="logo">{me.logo}</span>
      <h1 className="gate-title">Who's watching?</h1>
      <ul className="gate-list">
        {profiles.map((p) => (
          <li key={p.id}>
            <button className="gate-profile" onClick={(e) => pick(p, e.currentTarget)}>
              <img src={p.avatar} alt="" width="160" height="160" />
              <span>{p.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
