import { useRef } from 'react';
import { ArrowUpRight, GithubLogo, LinkedinLogo, InstagramLogo, FileText } from '@phosphor-icons/react';
import { gsap, useGSAP, reduced } from '../motion';
import { me } from '../data';
import Split from './Split';

const socials = [
  ['GitHub', me.links.github, GithubLogo],
  ['LinkedIn', me.links.linkedin, LinkedinLogo],
  ['Instagram', me.links.instagram, InstagramLogo],
  ['Resume', me.links.resume, FileText],
];

export default function Contact() {
  const root = useRef(null);

  useGSAP(() => {
    if (reduced()) return;
    gsap.fromTo('.contact-ghost', { xPercent: 15 }, {
      xPercent: -35, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.contact-inner > *', {
      y: 50, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
    });
  }, { scope: root });

  return (
    <>
      <section className="contact" id="contact" ref={root}>
        <span className="contact-ghost" aria-hidden="true">Still watching</span>
        <div className="contact-inner">
          <h2><Split text="Still watching?" /></h2>
          <p>Open to AI and full-stack roles. Drop me an email and I'll get back to you.</p>
          <a className="btn btn-primary btn-lg" href={`mailto:${me.email}`}>Get in touch <ArrowUpRight weight="bold" /></a>
          <ul className="socials">
            {socials.map(([label, href, Icon]) => (
              <li key={label}><a href={href} target="_blank" rel="noreferrer"><Icon /> {label}</a></li>
            ))}
          </ul>
        </div>
      </section>
      <footer className="footer">© 2026 {me.name}</footer>
    </>
  );
}
