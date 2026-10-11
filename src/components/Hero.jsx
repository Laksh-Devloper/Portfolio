import { useRef } from 'react';
import { Play, FileText } from '@phosphor-icons/react';
import { gsap, useGSAP, reduced } from '../motion';
import { me } from '../data';
import Split from './Split';
import SquareLensEffect from './SquareLensEffect';

export default function Hero() {
  const root = useRef(null);

  useGSAP(() => {
    if (reduced()) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.hero-title .ch', { yPercent: 120, rotate: 10, stagger: 0.035, duration: 1.2 }, 0.2)
      .from('.hero-fade', { y: 24, opacity: 0, stagger: 0.1, duration: 1 }, 0.6);

    // Scroll-out parallax: image drifts slower than the page, copy lifts and fades.
    const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-media', { yPercent: 18, ease: 'none', scrollTrigger: st });
    gsap.to('.hero-copy', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: st });
  }, { scope: root });

  return (
    <section className="hero" ref={root} aria-label="Introduction">
      <div className="hero-media" aria-hidden="true">
        <SquareLensEffect imageSrc={me.heroImg} />
      </div>
      <div className="hero-copy">
        <p className="hero-meta hero-fade">
          <span className="tag">{me.role}</span> <span>{me.now}</span> <span>{me.location}</span>
        </p>
        <h1 className="hero-title"><Split text={me.name} auto={false} /></h1>
        <p className="hero-blurb hero-fade">{me.tagline}</p>
        <div className="hero-ctas hero-fade">
          <a className="btn btn-primary" href="#projects"><Play weight="fill" /> View projects</a>
          <a className="btn btn-glass" href={me.links.resume} target="_blank" rel="noreferrer"><FileText /> Resume</a>
        </div>
      </div>
    </section>
  );
}
