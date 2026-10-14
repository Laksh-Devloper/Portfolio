/**
 * Original anime-style artwork, drawn as SVG and served as data URIs.
 * No external images: everything here is generated, so it is light, crisp at any size and free to use.
 */

const uri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`;

// Seeded RNG so every visit draws the same skyline and stars.
function rng(seed) {
  let a = [...String(seed)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 2166136261);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cloud = (x, y, s, fill) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">
    <ellipse cx="0" cy="0" rx="120" ry="38"/><ellipse cx="-60" cy="-18" rx="60" ry="40"/>
    <ellipse cx="20" cy="-38" rx="70" ry="52"/><ellipse cx="90" cy="-14" rx="56" ry="36"/>
    <ellipse cx="10" cy="-50" rx="40" ry="20" fill="#ffe7d6" opacity="0.55"/>
  </g>`;

function skyline(r, { base, minH, maxH, color, windowColor, litChance }) {
  let x = -20;
  let out = '';
  while (x < 1940) {
    const w = 40 + r() * 90;
    const h = minH + r() * (maxH - minH);
    const top = base - h;
    out += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h + 400}" fill="${color}"/>`;
    if (r() > 0.6) out += `<rect x="${(x + w / 2 - 2).toFixed(1)}" y="${(top - 30).toFixed(1)}" width="3" height="30" fill="${color}"/>`;
    for (let wy = top + 12; wy < base - 8; wy += 16) {
      for (let wx = x + 8; wx < x + w - 10; wx += 13) {
        if (r() < litChance) out += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="6" height="8" fill="${windowColor}" opacity="${(0.5 + r() * 0.5).toFixed(2)}"/>`;
      }
    }
    x += w + 4 + r() * 10;
  }
  return out;
}

/** Hero key art: dusk over a city, power lines, a coder and their cat on a rooftop. 1920x1080. */
export function heroScene() {
  const r = rng('laksh-hero');
  const stars = Array.from({ length: 140 }, () =>
    `<circle cx="${(r() * 1920).toFixed(0)}" cy="${(r() * 420).toFixed(0)}" r="${(0.6 + r() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.3 + r() * 0.7).toFixed(2)}"/>`).join('');
  const stripes = Array.from({ length: 7 }, (_, k) => `<rect x="0" y="${640 + k * 30 + k * k * 1.6}" width="1920" height="${4 + k * 2.4}" fill="#000"/>`).join('');

  return uri(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#140c33"/><stop offset="0.32" stop-color="#3d1b6b"/>
      <stop offset="0.58" stop-color="#b8306f"/><stop offset="0.78" stop-color="#ff7a59"/><stop offset="1" stop-color="#ffc977"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.3" r="0.7">
      <stop offset="0" stop-color="#fffbe6"/><stop offset="0.6" stop-color="#ffd27a"/><stop offset="1" stop-color="#ff8a5c"/>
    </radialGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#ffb36b" stop-opacity="0.65"/><stop offset="1" stop-color="#ff6f91" stop-opacity="0"/></radialGradient>
    <radialGradient id="screen"><stop offset="0" stop-color="#7ff3ff" stop-opacity="0.9"/><stop offset="1" stop-color="#7ff3ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a76" stop-opacity="0"/><stop offset="1" stop-color="#ff9a76" stop-opacity="0.45"/></linearGradient>
    <mask id="sunMask"><rect width="1920" height="1080" fill="#fff"/>${stripes}</mask>
  </defs>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  ${stars}
  <circle cx="1310" cy="640" r="520" fill="url(#glow)"/>
  <circle cx="1310" cy="640" r="250" fill="url(#sun)" mask="url(#sunMask)"/>
  ${cloud(380, 250, 1.4, '#8b3f8c')}${cloud(1650, 200, 1.1, '#9d4489')}${cloud(980, 380, 0.9, '#c7537d')}${cloud(1820, 470, 1.3, '#d9667a')}
  <path d="M0 760 L180 640 L330 720 L520 590 L700 700 L880 620 L1060 720 L1260 610 L1480 700 L1700 600 L1920 690 L1920 1080 L0 1080Z" fill="#7a2f73" opacity="0.65"/>
  ${skyline(r, { base: 880, minH: 120, maxH: 300, color: '#3b1752', windowColor: '#ffcf7a', litChance: 0.14 })}
  <rect y="700" width="1920" height="200" fill="url(#haze)"/>
  ${skyline(r, { base: 960, minH: 60, maxH: 220, color: '#210d33', windowColor: '#ffd98f', litChance: 0.22 })}
  <rect y="900" width="1920" height="180" fill="#0f0719"/>
  <rect y="896" width="1920" height="8" fill="#2a1240"/>
  <g fill="#0b0514">
    <rect x="300" y="300" width="16" height="610"/><rect x="250" y="340" width="120" height="10"/><rect x="262" y="390" width="96" height="8"/>
    <rect x="1840" y="420" width="12" height="490"/><rect x="1800" y="450" width="96" height="8"/>
  </g>
  <g fill="none" stroke="#0b0514" stroke-width="2.4">
    <path d="M250 345 Q1060 520 1800 454"/><path d="M370 345 Q1100 560 1896 454"/>
    <path d="M262 394 Q1000 600 1800 454"/><path d="M0 420 Q130 470 250 345"/>
  </g>
  <circle cx="1490" cy="868" r="160" fill="url(#screen)" opacity="0.55"/>
  <g fill="#0b0514">
    <path d="M1452 900 C1448 860 1456 820 1470 806 L1512 806 C1528 822 1532 862 1530 900Z"/>
    <path d="M1462 900 L1452 980 L1470 984 L1484 904Z"/><path d="M1508 900 L1522 978 L1540 974 L1530 900Z"/>
    <circle cx="1491" cy="782" r="27"/>
    <path d="M1462 778 L1450 752 L1472 762 L1474 740 L1490 758 L1500 736 L1508 760 L1528 746 L1522 772 L1540 776 L1520 786Z"/>
    <path d="M1600 900 C1598 884 1606 874 1620 874 C1636 874 1642 886 1640 900Z"/>
    <circle cx="1622" cy="866" r="11"/><path d="M1613 860 L1614 846 L1622 857Z"/><path d="M1631 860 L1630 846 L1622 857Z"/>
    <path d="M1640 896 C1662 896 1660 870 1676 866" fill="none" stroke="#0b0514" stroke-width="5" stroke-linecap="round"/>
  </g>
  <path d="M1478 872 L1530 872 L1538 846 L1488 846Z" fill="#a8f6ff"/>
  <rect x="1470" y="872" width="70" height="5" fill="#1a0d2b"/>
</svg>`);
}

const PALETTES = {
  recruiter: { bg: ['#ff8fb8', '#7a3cff'], hair: '#3a2150', hairHi: '#7b4fa8', iris: '#7a3cff', shirt: '#2b2b44', accent: '#ff4d6d' },
  engineer: { bg: ['#5ee7ff', '#2340ff'], hair: '#1b2236', hairHi: '#3d5a9e', iris: '#1fb8ff', shirt: '#3a3f55', accent: '#5ee7ff' },
  founder: { bg: ['#ffd36b', '#ff5a3c'], hair: '#ff7a1a', hairHi: '#ffc04d', iris: '#e0461f', shirt: '#1c1c24', accent: '#ffd36b' },
};

function person(id) {
  const p = PALETTES[id];
  const skin = '#ffe1cf';
  const blink = (cx) => `
    <clipPath id="e${cx}"><ellipse cx="${cx}" cy="168" rx="19" ry="25"/></clipPath>
    <g clip-path="url(#e${cx})">
      <ellipse cx="${cx}" cy="168" rx="19" ry="25" fill="#fff"/>
      <ellipse cx="${cx}" cy="172" rx="15" ry="21" fill="${p.iris}"/>
      <ellipse cx="${cx}" cy="176" rx="8" ry="12" fill="#14101f"/>
      <ellipse cx="${cx - 6}" cy="162" rx="5" ry="7" fill="#fff"/><circle cx="${cx + 6}" cy="182" r="2.5" fill="#fff" opacity="0.8"/>
      <rect x="${cx - 22}" y="140" width="44" height="0" fill="${skin}">
        <animate attributeName="height" values="0;0;56;0" keyTimes="0;0.9;0.95;1" dur="${id === 'engineer' ? 5 : 4.2}s" repeatCount="indefinite"/>
      </rect>
    </g>
    <path d="M${cx - 22} 150 Q${cx} 134 ${cx + 22} 150" fill="none" stroke="#14101f" stroke-width="5" stroke-linecap="round"/>`;

  const extras = {
    recruiter: `<g fill="none" stroke="#1c1426" stroke-width="3.5"><rect x="98" y="148" width="50" height="42" rx="12"/><rect x="172" y="148" width="50" height="42" rx="12"/><path d="M148 166 L172 166"/></g>
      <path d="M152 250 L160 300 L168 250 L160 240Z" fill="${p.accent}"/>`,
    engineer: `<path d="M74 170 Q74 70 160 66 Q246 70 246 170" fill="none" stroke="#20263a" stroke-width="12"/>
      <rect x="60" y="150" width="30" height="56" rx="12" fill="${p.accent}"/><rect x="230" y="150" width="30" height="56" rx="12" fill="${p.accent}"/>`,
    founder: `<path d="M200 214 Q214 210 220 200" fill="none" stroke="#b5574a" stroke-width="3" stroke-linecap="round"/>
      <g fill="#fff"><path d="M262 60 l4 12 12 4 -12 4 -4 12 -4 -12 -12 -4 12 -4Z"/></g>`,
  }[id];

  const bangs = {
    recruiter: 'M86 160 Q90 80 160 74 Q232 80 236 160 Q214 120 196 112 Q180 132 150 120 Q132 134 112 120 Q98 136 86 160Z',
    engineer: 'M88 156 Q92 78 160 72 Q230 78 232 156 L214 118 L200 140 L188 108 L168 134 L156 104 L138 136 L126 110 L108 142Z',
    founder: 'M80 160 L60 90 L104 108 L96 44 L140 86 L160 24 L180 86 L224 44 L216 108 L262 90 L240 160 L214 120 L196 138 L180 104 L162 130 L144 104 L126 138 L106 120Z',
  }[id];

  const backHair = id === 'recruiter'
    ? `<path d="M80 160 Q70 260 96 300 L224 300 Q250 260 240 160 Q240 70 160 66 Q80 70 80 160Z" fill="${p.hair}"/>`
    : `<path d="M86 170 Q80 76 160 68 Q240 76 234 170Z" fill="${p.hair}"/>`;

  return uri(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient></defs>
  <rect width="320" height="320" fill="url(#bg)"/>
  <g fill="#fff" opacity="0.18">${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<path d="M160 230 L${160 + 400 * Math.cos(k * 0.8)} ${230 + 400 * Math.sin(k * 0.8)} L${160 + 400 * Math.cos(k * 0.8 + 0.2)} ${230 + 400 * Math.sin(k * 0.8 + 0.2)}Z"/>`).join('')}</g>
  ${backHair}
  <path d="M60 330 Q66 262 160 252 Q254 262 260 330Z" fill="${p.shirt}"/>
  <rect x="142" y="210" width="36" height="46" fill="#f4c8b4"/>
  <path d="M96 150 Q96 238 160 244 Q224 238 224 150 Q224 96 160 94 Q96 96 96 150Z" fill="${skin}"/>
  <ellipse cx="112" cy="200" rx="13" ry="7" fill="#ff8fa3" opacity="0.55"/><ellipse cx="208" cy="200" rx="13" ry="7" fill="#ff8fa3" opacity="0.55"/>
  ${blink(126)}${blink(194)}
  <path d="M150 212 Q160 ${id === 'founder' ? 222 : 218} 172 210" fill="none" stroke="#b5574a" stroke-width="3" stroke-linecap="round"/>
  <path d="${bangs}" fill="${p.hair}"/>
  <path d="M120 96 Q150 84 186 92" fill="none" stroke="${p.hairHi}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
  ${extras}
</svg>`);
}

function cat() {
  const eye = (cx) => `
    <clipPath id="c${cx}"><ellipse cx="${cx}" cy="180" rx="22" ry="26"/></clipPath>
    <g clip-path="url(#c${cx})">
      <ellipse cx="${cx}" cy="180" rx="22" ry="26" fill="#b6ff6b"/>
      <ellipse cx="${cx}" cy="182" rx="7" ry="20" fill="#14101f"/>
      <circle cx="${cx - 8}" cy="170" r="6" fill="#fff"/>
      <rect x="${cx - 24}" y="152" width="48" height="0" fill="#2c2433">
        <animate attributeName="height" values="0;0;56;0" keyTimes="0;0.88;0.94;1" dur="3.6s" repeatCount="indefinite"/>
      </rect>
    </g>`;
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8ff9e"/><stop offset="1" stop-color="#1fa37a"/></linearGradient></defs>
  <rect width="320" height="320" fill="url(#bg)"/>
  <g fill="#fff" opacity="0.5"><circle cx="50" cy="60" r="4"/><circle cx="270" cy="80" r="3"/><circle cx="280" cy="250" r="5"/><circle cx="40" cy="260" r="3"/></g>
  <path d="M70 140 L60 50 L140 100Z M250 140 L260 50 L180 100Z" fill="#2c2433"/>
  <path d="M78 120 L74 74 L118 102Z M242 120 L246 74 L202 102Z" fill="#ff9fb8"/>
  <ellipse cx="160" cy="190" rx="112" ry="100" fill="#2c2433"/>
  <ellipse cx="160" cy="330" rx="120" ry="80" fill="#2c2433"/>
  ${eye(116)}${eye(204)}
  <path d="M152 214 L168 214 L160 224Z" fill="#ff9fb8"/>
  <path d="M160 224 Q150 236 140 230 M160 224 Q170 236 180 230" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <g stroke="#fff" stroke-width="2" opacity="0.6"><path d="M90 216 L44 208 M90 226 L46 232 M230 216 L276 208 M230 226 L274 232"/></g>
  <ellipse cx="100" cy="220" rx="14" ry="7" fill="#ff8fa3" opacity="0.5"/><ellipse cx="220" cy="220" rx="14" ry="7" fill="#ff8fa3" opacity="0.5"/>
</svg>`);
}

export const avatar = (id) => (id === 'guest' ? cat() : person(id));

const THEMES = {
  zero: { sky: ['#0f1e5c', '#3d7bff', '#9be7ff'], accent: '#5ee7ff', kanji: '解析', motif: 'chart' },
  curaid: { sky: ['#3b0d2e', '#ff4d7a', '#ffc2d4'], accent: '#ff6f91', kanji: '医療', motif: 'heart' },
  holo: { sky: ['#14093a', '#7a3cff', '#ff9ef0'], accent: '#c49bff', kanji: '立体', motif: 'cube' },
  insight: { sky: ['#06281f', '#15b38a', '#d4ff8a'], accent: '#7dffb3', kanji: '洞察', motif: 'wave' },
};

const MOTIFS = {
  chart: (a) => `
    <g transform="translate(560 120)">
      ${[60, 110, 90, 170, 230].map((h, k) => `<rect x="${k * 52}" y="${300 - h}" width="34" height="${h}" rx="4" fill="#fff" opacity="${0.35 + k * 0.13}"/>`).join('')}
      <path d="M17 220 L69 170 L121 196 L173 110 L225 40" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      ${[[17, 220], [69, 170], [121, 196], [173, 110], [225, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="${a}" stroke-width="4"/>`).join('')}
    </g>`,
  heart: (a) => `
    <g transform="translate(700 270)">
      <path d="M0 110 C-150 10 -110 -110 0 -46 C110 -110 150 10 0 110Z" fill="#fff" opacity="0.92"/>
      <path d="M-170 0 L-60 0 L-36 -50 L-6 60 L24 -24 L40 0 L170 0" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  cube: (a) => `
    <g transform="translate(700 270)" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round">
      <path d="M0 -150 L130 -75 L130 75 L0 150 L-130 75 L-130 -75Z" fill="${a}" fill-opacity="0.18"/>
      <path d="M-130 -75 L0 0 L130 -75 M0 0 L0 150"/>
      <path d="M0 -80 L70 -40 L70 40 L0 80 L-70 40 L-70 -40Z" stroke="${a}" stroke-dasharray="10 8"/>
    </g>`,
  wave: (a) => `
    <g transform="translate(520 160)" fill="none" stroke-linecap="round">
      ${[0, 1, 2, 3].map((k) => `<path d="M0 ${120 + k * 36} C80 ${40 + k * 36} 160 ${200 + k * 36} 240 ${120 + k * 36} S400 ${40 + k * 36} 420 ${110 + k * 36}" stroke="${k === 0 ? a : '#fff'}" stroke-width="${7 - k}" opacity="${1 - k * 0.2}"/>`).join('')}
      <circle cx="240" cy="120" r="14" fill="#fff"/>
    </g>`,
};

/** Project key art, like an anime episode title card. Renders at any size; `slice` crops to fill. */
export function projectArt(id, episode, w = 960, h = 540) {
  const t = THEMES[id] ?? THEMES.zero;
  const lines = Array.from({ length: 36 }, (_, k) => {
    const a0 = (k / 36) * Math.PI * 2;
    const a1 = a0 + 0.06;
    return `<path d="M700 270 L${700 + 1200 * Math.cos(a0)} ${270 + 1200 * Math.sin(a0)} L${700 + 1200 * Math.cos(a1)} ${270 + 1200 * Math.sin(a1)}Z"/>`;
  }).join('');

  return uri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.sky[0]}"/><stop offset="0.55" stop-color="${t.sky[1]}"/><stop offset="1" stop-color="${t.sky[2]}"/></linearGradient>
    <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.2" fill="#fff"/></pattern>
    <radialGradient id="fade" cx="0.73" cy="0.5" r="0.6"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#s)"/>
  <g fill="#fff" opacity="0.1">${lines}</g>
  <rect width="960" height="540" fill="url(#dots)" opacity="0.08"/>
  <text x="40" y="500" font-family="'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif" font-weight="900" font-size="300" fill="#fff" opacity="0.13">${t.kanji}</text>
  ${MOTIFS[t.motif](t.accent)}
  <rect width="960" height="540" fill="url(#fade)"/>
  <g font-family="system-ui,sans-serif" fill="#fff">
    <rect x="40" y="40" width="128" height="40" rx="4" fill="#000" opacity="0.35"/>
    <text x="56" y="68" font-size="22" font-weight="800" letter-spacing="3">EP.${String(episode).padStart(2, '0')}</text>
  </g>
  <path d="M0 0 L960 0 L960 14 L0 14Z M0 526 L960 526 L960 540 L0 540Z" fill="#000" opacity="0.5"/>
</svg>`);
}
