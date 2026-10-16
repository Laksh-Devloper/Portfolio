import { useRef, useState } from 'react';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { gsap, useGSAP, reduced } from '../motion';
import { seasons } from '../data';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

// One node per season, rising left to right: the career as a growth chart.
// Nodes and path must terminate at the SAME coordinate, or the focal dot
// (which rides the full path length) will overshoot the last visible marker.
const NODES = [[14, 76], [36, 64], [58, 52], [80, 40], [100, 30], [114, 24]];
const PATH = 'M6 82 C10 80 12 78 14 76 S30 66 36 64 S52 54 58 52 S74 42 80 40 S94 32 100 30 S108 26 114 24';
const END_SCALE = 0.75;
const [ENDX, ENDY] = [114, 24]; // must equal the PATH's final coordinate
// Camera centre sits right of middle so the details panel on the left never covers the line.
const CX = 76;

function Card({ s, k }) {
  return (
    <>
      <p className="ep-num">S{k + 1} <span>{s.type}</span> <span>{s.period}</span></p>
      <h3>{s.title}</h3>
      <p className="ep-org">{s.org}</p>
      <ul className="ep-points">{s.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
    </>
  );
}

// Scroll draws the path; a focal point rides it while the camera pans to keep it centred and zooms out.
export default function PositionsGraph() {
  const root = useRef(null);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);
  const [reduce] = useState(reduced);

  useGSAP(() => {
    if (reduce) return;
    const path = root.current.querySelector('.gp-path');
    const pan = root.current.querySelector('.pov-pan');
    const focal = root.current.querySelector('.focal-point');

    // Where along the path (0..1) each node sits, so dots and cards trigger exactly as the point arrives.
    const L = path.getTotalLength();
    const fracs = NODES.map(([nx, ny]) => {
      let best = 0;
      let bestD = Infinity;
      for (let s = 0; s <= L; s += L / 400) {
        const p = path.getPointAtLength(s);
        const d = (p.x - nx) ** 2 + (p.y - ny) ** 2;
        if (d < bestD) { bestD = d; best = s; }
      }
      return best / L;
    });

    // Scale around SVG (0,0), not the group's bbox corner (the oversized grid would shift it).
    gsap.set('.pov-scale', { svgOrigin: '0 0' });
    const xTo = gsap.quickTo(pan, 'x', { duration: 0.3 });
    const yTo = gsap.quickTo(pan, 'y', { duration: 0.3 });

    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      onUpdate: () => {
        xTo(-gsap.getProperty(focal, 'x'));
        yTo(-gsap.getProperty(focal, 'y'));
        const p = tl.progress();
        const k = fracs.reduce((acc, f, i) => (p >= f - 0.005 ? i : acc), -1);
        if (k !== activeRef.current) { activeRef.current = k; setActive(k); }
      },
    });

    tl.fromTo('.gp-svg', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0)
      .from(path, { drawSVG: 0 }, 0)
      .to(focal, { motionPath: { path }, immediateRender: true }, 0)
      // Ends with the whole graph centred: pan keeps the focal point at the scale origin, so offset by it.
      .fromTo('.pov-scale', { x: CX, y: 49, scale: 2.6 }, {
        x: CX + (ENDX - CX) * END_SCALE, y: 49 - (49 - ENDY) * END_SCALE, scale: END_SCALE, ease: 'expo.inOut',
      }, 0);
    gsap.utils.toArray('.gp-node', root.current).forEach((node, i) => {
      tl.fromTo(node.querySelector('.gp-dot'), { attr: { r: 0 } }, { attr: { r: 2.2 }, duration: 0.03, ease: 'back.out(3)' }, fracs[i])
        .fromTo(node.querySelector('.gp-label'), { opacity: 0, y: 2 }, { opacity: 1, y: 0, duration: 0.04 }, fracs[i]);
    });

    gsap.set(pan, { x: -gsap.getProperty(focal, 'x'), y: -gsap.getProperty(focal, 'y') });
  }, { scope: root });

  useGSAP(() => {
    if (reduce) return;
    gsap.fromTo('.gp-card', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
  }, { scope: root, dependencies: [active] });

  return (
    <section className={reduce ? 'positions static' : 'positions'} id="experience" ref={root}>
      <div className="gp-stage">
        <h2 className="gp-heading">Experience and education</h2>
        <svg className="gp-svg" viewBox="0 0 122 98" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <pattern id="gp-grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M6 0H0V6" fill="none" className="gp-gridline" />
            </pattern>
          </defs>
          <g className="pov-scale">
            <g className="pov-pan">
              <rect x="-60" y="-60" width="242" height="218" fill="url(#gp-grid)" />
              <path className="gp-path" d={PATH} />
              {NODES.map(([x, y], k) => (
                <g className="gp-node" key={k}>
                  <circle className="gp-dot" cx={x} cy={y} r="2.2" />
                  <text className="gp-label" x={x} y={y - 4.5} textAnchor="middle">{seasons[k].year}</text>
                </g>
              ))}
              <g className="focal-point">
                <circle className="gp-glow" r="3.2" />
                <circle className="gp-focal" r="1.2" />
              </g>
            </g>
          </g>
        </svg>
        <div className="gp-panel">
          {reduce ? (
            seasons.map((s, k) => <div className="gp-card" key={s.title}><Card s={s} k={k} /></div>)
          ) : (
            <>
              <ol className="gp-steps" aria-hidden="true">
                {seasons.map((s, k) => <li key={s.title} className={k <= active ? 'on' : ''} />)}
              </ol>
              <div className="gp-card" key={active}>
                {active < 0
                  ? <p className="gp-hint">Follow the line. Each point is a step in my career, from a diploma to shipping GenAI.</p>
                  : <Card s={seasons[active]} k={active} />}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
