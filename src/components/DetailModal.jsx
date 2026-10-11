import { useEffect, useRef } from 'react';
import { X, GithubLogo } from '@phosphor-icons/react';
import { gsap, useGSAP, reduced, lenis } from '../motion';
import { projects } from '../data';

export default function DetailModal({ project, onOpen, onClose }) {
  const root = useRef(null);
  const closeBtn = useRef(null);

  function close() {
    if (reduced()) return onClose();
    gsap.to(root.current.querySelector('.modal'), { y: 40, scale: 0.96, opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(root.current.querySelector('.modal-backdrop'), { opacity: 0, duration: 0.3, onComplete: onClose });
  }

  useEffect(() => {
    if (!project) return;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('locked');
    lenis?.stop();
    root.current.scrollTop = 0;
    closeBtn.current.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('locked');
      lenis?.start();
    };
  }, [project]);

  useGSAP(() => {
    if (!project || reduced()) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.modal-backdrop', { opacity: 0, duration: 0.5 })
      .from('.modal', { y: 80, scale: 0.92, opacity: 0, duration: 0.9 }, 0)
      .from('.modal-hero img', { scale: 1.2, duration: 1.6 }, 0)
      .from('.modal-body > *', { y: 30, opacity: 0, stagger: 0.07, duration: 0.8 }, 0.25)
      .from('.related li', { x: 60, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.4);
  }, { scope: root, dependencies: [project?.id], revertOnUpdate: true });

  if (!project) return null;
  const others = projects.filter((p) => p.id !== project.id);

  return (
    <div className="modal-layer" data-lenis-prevent ref={root} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-backdrop" onClick={close} />
      <article className="modal">
        <button ref={closeBtn} className="modal-close" onClick={close} aria-label="Close"><X weight="bold" /></button>
        <div className="modal-hero">
          <img src={project.wide} alt={`${project.title} preview`} />
          <div className="modal-hero-copy">
            <h2 id="modal-title">{project.title}</h2>
            <a className="btn btn-primary" href={project.repo} target="_blank" rel="noreferrer"><GithubLogo weight="fill" /> View code</a>
          </div>
        </div>
        <div className="modal-body">
          <p className="hero-meta"><b className="status">{project.status}</b> <span className="tag">{project.kind}</span></p>
          <p className="modal-blurb">{project.detail}</p>
          <div>
            <h3>Built with</h3>
            <span className="chips">{project.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</span>
          </div>
          <h3>More projects</h3>
          <ul className="related">
            {others.map((r) => (
              <li key={r.id}>
                <button onClick={() => onOpen(r)}>
                  <img src={r.img} alt="" loading="lazy" width="480" height="270" />
                  <span><b>{r.title}</b><small>{r.kind}</small></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
