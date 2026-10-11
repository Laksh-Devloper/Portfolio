import { useRef } from 'react';
import { gsap, useGSAP, reduced } from '../motion';
import { leadership } from '../data';
import Split from './Split';

export default function Leadership() {
  const root = useRef(null);

  // Big names slide in from alternating sides, tied to scroll position.
  useGSAP(() => {
    if (reduced()) return;
    gsap.utils.toArray('.lead-row').forEach((row, k) => {
      gsap.fromTo(row.querySelector('.lead-org'), { xPercent: k % 2 ? 30 : -30, opacity: 0.2 }, {
        xPercent: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 50%', scrub: true },
      });
      gsap.from(row.querySelectorAll('.lead-meta > *'), {
        y: 20, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: row, start: 'top 80%', once: true },
      });
    });
  }, { scope: root });

  return (
    <section className="leadership section" id="leadership" ref={root}>
      <h2 className="section-title"><Split text="Leadership and activities" /></h2>
      <ul className="lead-list">
        {leadership.map((l) => (
          <li className="lead-row" key={`${l.org}-${l.role}`}>
            <span className="lead-fill" aria-hidden="true" />
            <span className="lead-org">{l.org}</span>
            <span className="lead-meta">
              <b>{l.role}</b>
              <span>{l.period}</span>
              <span className={l.status === 'Active' ? 'status' : 'lead-done'}>{l.status}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
