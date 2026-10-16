import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CaretRight, Play } from '@phosphor-icons/react';
import { gsap, useGSAP, reduced, finePointer } from '../motion';
import { projects } from '../data';
import Split from './Split';

export default function Projects({ onOpen }) {
  const root = useRef(null);
  const track = useRef(null);
  const preview = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const t = track.current;
    setEdge({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth > t.scrollWidth - 8 });
  };
  useEffect(update, []);

  useGSAP(() => {
    if (reduced()) return;
    // Cards glide in from the right as the row enters, like a shelf being stocked.
    gsap.from('.slot', {
      x: 160, opacity: 0, stagger: 0.09, duration: 1.2, ease: 'expo.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
    });

    if (!finePointer()) return;
    root.current.classList.add('has-preview');

    // Cursor preview: a per-project image trails the pointer and leans with its velocity.
    const pv = preview.current;
    const shots = pv.querySelectorAll('img');
    gsap.set(pv, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    const xTo = gsap.quickTo(pv, 'x', { duration: 0.55, ease: 'power3' });
    const yTo = gsap.quickTo(pv, 'y', { duration: 0.55, ease: 'power3' });
    const rTo = gsap.quickTo(pv, 'rotation', { duration: 0.6, ease: 'power3' });
    let lastX = 0;
    let settle;

    const cleanups = gsap.utils.toArray('.card').map((card, k) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });

      const enter = (e) => {
        gsap.set(pv, { x: e.clientX, y: e.clientY });
        lastX = e.clientX;
        gsap.to(shots, { opacity: (i) => (i === k ? 1 : 0), duration: 0.25 });
        gsap.to(pv, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' });
        gsap.to(card, { scale: 1.04, duration: 0.5, ease: 'expo.out' });
      };
      const move = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.9));
        lastX = e.clientX;
        clearTimeout(settle);
        settle = setTimeout(() => rTo(0), 90);
        // 3D tilt + spotlight position from the pointer's spot on the card.
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 12);
        rx((0.5 - py) * 12);
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      };
      const leave = () => {
        gsap.to(pv, { scale: 0, opacity: 0, duration: 0.4, ease: 'power3.in' });
        gsap.to(card, { scale: 1, duration: 0.6, ease: 'expo.out' });
        rx(0);
        ry(0);
      };
      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      return () => {
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
      };
    });
    return () => { clearTimeout(settle); cleanups.forEach((fn) => fn()); };
  }, { scope: root });

  const page = (dir) => track.current.scrollBy({ left: dir * track.current.clientWidth * 0.85, behavior: reduced() ? 'auto' : 'smooth' });

  return (
    <section className="row section-flush" id="projects" ref={root}>
      <h2 className="section-title"><Split text="Projects" /></h2>
      <div className="row-viewport">
        <button className="row-arrow left" onClick={() => page(-1)} hidden={edge.start} aria-label="Scroll left"><CaretLeft /></button>
        <ul className="row-track" ref={track} onScroll={update}>
          {projects.map((p) => (
            <li className="slot" key={p.id}>
              <button className="card" onClick={() => onOpen(p)} aria-label={`${p.title}. Open project details`}>
                <span className="card-spot" aria-hidden="true" />
                <span className="card-media">
                  <img src={p.img} alt="" loading="lazy" width="1200" height="600" />
                  <span className="card-play" aria-hidden="true"><Play weight="fill" /></span>
                </span>
                <span className="card-body">
                  <span className="card-meta"><b className="status">{p.status}</b> {p.kind}</span>
                  <span className="card-title">{p.title}</span>
                  <span className="card-blurb">{p.blurb}</span>
                  <span className="chips">{p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button className="row-arrow right" onClick={() => page(1)} hidden={edge.end} aria-label="Scroll right"><CaretRight /></button>
      </div>
      {createPortal(
        <div className="cursor-preview" ref={preview} aria-hidden="true">
          {projects.map((p) => <img key={p.id} src={p.hover} alt="" width="1200" height="600" />)}
        </div>,
        document.body,
      )}
    </section>
  );
}
