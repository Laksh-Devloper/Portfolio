import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced } from '../motion';
import { me } from '../data';

const links = [['Home', '#top'], ['About', '#about'], ['Projects', '#projects'], ['Experience', '#experience'], ['Leadership', '#leadership'], ['Skills', '#skills'], ['Contact', '#contact']];

export default function Nav({ profile, onSwitch }) {
  const ref = useRef(null);

  useGSAP(() => {
    ScrollTrigger.create({ start: 'top -80', onToggle: (s) => ref.current.classList.toggle('solid', s.isActive) });
    if (!reduced()) gsap.from(ref.current, { y: -80, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.2 });
  });

  return (
    <header className="nav" ref={ref}>
      <a href="#top" className="logo">{me.logo}</a>
      {/* Links split around the centre, which belongs to the music island. */}
      <nav aria-label="Primary" className="nav-split">
        <ul className="nav-links">
          {links.slice(0, 4).map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
        </ul>
        <ul className="nav-links">
          {links.slice(4).map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
        </ul>
      </nav>
      <button className="nav-profile" onClick={onSwitch} aria-label={`Switch profile, current: ${profile.label}`}>
        <img src={profile.avatar} alt="" width="32" height="32" />
        <span>{profile.label}</span>
      </button>
    </header>
  );
}
