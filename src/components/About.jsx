import { useRef } from 'react';
import { gsap, useGSAP, reduced } from '../motion';
import { about } from '../data';
import Split from './Split';

export default function About() {
  const root = useRef(null);

  useGSAP(() => {
    if (reduced()) return;
    const st = { trigger: root.current, start: 'top 75%', once: true };
    gsap.from('.about-copy > :not(h2)', { x: -60, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: st });
    gsap.from('.stat', { x: 80, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: st });
    // Count-up: the numbers are the point, so they get the motion.
    gsap.utils.toArray('.stat-num b').forEach((el) => {
      gsap.from(el, { textContent: 0, duration: 1.6, ease: 'power2.out', snap: { textContent: 1 }, scrollTrigger: st });
    });
  }, { scope: root });

  return (
    <section className="about section" id="about" ref={root}>
      <div className="about-copy">
        <h2 className="section-title"><Split text="About" /></h2>
        <p className="about-text">{about.text}</p>
        <dl className="facts">
          {about.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </div>
      <ul className="stats" aria-label="Highlights">
        {about.highlights.map((h) => (
          <li className="stat" key={h.label}>
            <span className="stat-num"><b>{h.value}</b>{h.suffix}</span>
            <span className="stat-label">{h.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
