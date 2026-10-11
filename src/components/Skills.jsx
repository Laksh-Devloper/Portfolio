import { useRef, useState } from 'react';
import { gsap, useGSAP, reduced } from '../motion';
import { skills } from '../data';
import Split from './Split';

// Skills browsed like genres: pick a category, its tiles slide in.
export default function Skills() {
  const root = useRef(null);
  const [i, setI] = useState(0);
  const [genre, items] = skills[i];

  useGSAP(() => {
    if (reduced()) return;
    gsap.from('.genre-tabs li', {
      x: 60, opacity: 0, stagger: 0.05, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
    });
  }, { scope: root });

  useGSAP(() => {
    if (reduced()) return;
    gsap.fromTo('.skill', { x: 50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'expo.out' });
  }, { scope: root, dependencies: [i] });

  return (
    <section className="skills section" id="skills" ref={root}>
      <h2 className="section-title"><Split text="Skills" /></h2>
      <ul className="genre-tabs" role="tablist" aria-label="Skill categories">
        {skills.map(([name, list], k) => (
          <li key={name}>
            <button role="tab" id={`tab-${k}`} aria-selected={k === i} aria-controls="skill-panel"
              className={k === i ? 'genre active' : 'genre'} onClick={() => setI(k)}>
              {name} <span>{list.length}</span>
            </button>
          </li>
        ))}
      </ul>
      <ul className="skill-grid" id="skill-panel" role="tabpanel" aria-labelledby={`tab-${i}`} aria-label={genre}>
        {items.map((s) => <li className="skill" key={s}>{s}</li>)}
      </ul>
    </section>
  );
}
