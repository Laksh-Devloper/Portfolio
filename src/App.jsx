import { useEffect, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced, finePointer, startLenis } from './motion';
import Intro from './components/Intro';
import ProfileGate from './components/ProfileGate';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import PositionsGraph from './components/PositionsGraph';
import Leadership from './components/Leadership';
import Skills3D from './components/skills-3d/Skills3D';
import Contact from './components/Contact';
import DetailModal from './components/DetailModal';
import Sakura from './components/Sakura';

export default function App() {
  const [intro, setIntro] = useState(true);
  const [profile, setProfile] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => (profile ? startLenis() : undefined), [profile]);

  // Fonts and lazy images change the page height after triggers are measured; re-measure once they settle.
  useEffect(() => {
    if (!profile) return;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, [profile]);

  // Section headings: letters rise out of a mask as each one scrolls into view.
  useGSAP(() => {
    if (!profile || reduced()) return;
    gsap.utils.toArray('.split-auto').forEach((el) => {
      gsap.from(el.querySelectorAll('.ch'), {
        yPercent: 115, rotate: 8, stagger: 0.025, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    // Japanese kickers above each heading slide in like a manga caption.
    gsap.utils.toArray('.kicker').forEach((el) => {
      gsap.from(el, {
        x: -40, opacity: 0, skewX: -20, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });
    gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }, { dependencies: [profile] });

  // Magnetic buttons: one delegated listener covers every .btn, including ones mounted later.
  useEffect(() => {
    if (!profile || !finePointer()) return;
    let current = null;
    const release = (b) => gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    const move = (e) => {
      const b = e.target.closest?.('.btn');
      if (current && current !== b) release(current);
      current = b;
      if (!b) return;
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: 'power3.out' });
    };
    document.addEventListener('pointermove', move);
    return () => document.removeEventListener('pointermove', move);
  }, [profile]);

  if (intro) return <Intro onDone={() => setIntro(false)} />;
  if (!profile) return (
    <>
      <Sakura />
      <ProfileGate onPick={(p) => { window.scrollTo(0, 0); setProfile(p); }} />
    </>
  );

  return (
    <>
      <span className="progress" aria-hidden="true" />
      <Sakura density={0.6} />
      <Nav profile={profile} onSwitch={() => setProfile(null)} />
      <main id="top">
        <Hero />
        <About />
        <Projects onOpen={setActive} />
        <PositionsGraph />
        <Leadership />
        <Skills3D />
        <Contact />
      </main>
      <DetailModal project={active} onOpen={setActive} onClose={() => setActive(null)} />
    </>
  );
}
