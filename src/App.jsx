import { useEffect, useState } from 'react';
import { gsap, useGSAP, reduced, finePointer, startLenis } from './motion';
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
import MusicIsland from './components/MusicIsland';

export default function App() {
  // 'playing' → intro alone; 'reveal' → profile gate mounts under the opening shutter; false → gone.
  const [intro, setIntro] = useState('playing');
  const [music, setMusic] = useState(false);
  const [profile, setProfile] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => (profile ? startLenis() : undefined), [profile]);

  // Section headings: letters rise out of a mask as each one scrolls into view.
  useGSAP(() => {
    if (!profile || reduced()) return;
    gsap.utils.toArray('.split-auto').forEach((el) => {
      gsap.from(el.querySelectorAll('.ch'), {
        yPercent: 115, rotate: 8, stagger: 0.025, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
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

  const introEl = intro && (
    <Intro
      onReveal={(m) => { setMusic(m); setIntro('reveal'); }}
      onDone={(m) => { setMusic(m); setIntro(false); }}
    />
  );
  if (intro === 'playing') return introEl;
  if (!profile) return (
    <>
      <Sakura />
      <ProfileGate onPick={(p) => { window.scrollTo(0, 0); setProfile(p); }} />
      {introEl}
    </>
  );

  return (
    <>
      <MusicIsland autoplay={music} />
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
