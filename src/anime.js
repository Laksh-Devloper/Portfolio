/**
 * Original anime-style profile avatars, drawn as SVG and served as data URIs.
 * No external images: everything here is generated, so it is light, crisp at any size and free to use.
 */

const uri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`;

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
