// Herramientas de dibujo compartidas por todas las ilustraciones de medallas (mismo estilo que el Ping Pong Club).

export const D = '#2B1B12';
export const f = (n: number) => +n.toFixed(1);
export const ball = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#E7D7C3"/>` +
  `<circle cx="${f(cx - r * .1)}" cy="${f(cy - r * .1)}" r="${f(r * .88)}" fill="#FFFBF4"/>` +
  `<ellipse cx="${f(cx - r * .38)}" cy="${f(cy - r * .42)}" rx="${f(r * .2)}" ry="${f(r * .12)}" fill="#fff" transform="rotate(-35 ${f(cx - r * .38)} ${f(cy - r * .42)})"/>` +
  `<circle class="m-ol" cx="${cx}" cy="${cy}" r="${r}" fill="none"/>`;
export const starPts = (cx: number, cy: number, R: number, r = R * .48, n = 5, rot = -90) => {
  const p: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (rot + i * 180 / n) * Math.PI / 180, rr = i % 2 ? r : R;
    p.push(f(cx + rr * Math.cos(a)) + ',' + f(cy + rr * Math.sin(a)));
  }
  return p.join(' ');
};
export const star = (cx: number, cy: number, R: number, fill: string, sw = 2, r?: number) => `<polygon class="m-ol" style="stroke-width:${sw}" points="${starPts(cx, cy, R, r)}" fill="${fill}"/>`;
export const heart = (cx: number, cy: number, s: number, fill: string, sw = 2) =>
  `<path class="m-ol" style="stroke-width:${sw}" fill="${fill}" d="M${cx} ${f(cy + s * .9)} C${f(cx - s * 1.4)} ${f(cy + s * .1)} ${f(cx - s)} ${f(cy - s)} ${cx} ${f(cy - s * .35)} C${f(cx + s)} ${f(cy - s)} ${f(cx + s * 1.4)} ${f(cy + s * .1)} ${cx} ${f(cy + s * .9)}Z"/>`;
export const stick = (d: string, color: string, w = 3.5) =>
  `<path d="${d}" fill="none" stroke="${D}" stroke-width="${w + 3.6}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const flameSmall = (x: number, y: number, s = 1) =>
  `<path class="m-ol" style="stroke-width:2" transform="translate(${x} ${y}) scale(${s})" d="M0 0 C-5 -4 -2 -9 0 -13 C1 -9 5 -7 4 -2 C3 0 2 1 0 0Z" fill="#FF922B"/>`;
export const t = (x: number, y: number, s: number, txt: string, fill: string, extra = '') =>
  `<text x="${x}" y="${y}" font-family="Lilita One, Arial Rounded MT Bold, sans-serif" font-size="${s}" fill="${fill}" text-anchor="middle" ${extra}>${txt}</text>`;
export const wavyRing = (cx: number, cy: number, R: number, amp: number, k: number, rIn: number) => {
  let d = '';
  for (let i = 0; i <= 72; i++) {
    const a = i / 72 * Math.PI * 2, rr = R + amp * Math.sin(a * k);
    d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a)) + ' ';
  }
  return d + `Z M${cx - rIn} ${cy} a${rIn} ${rIn} 0 1 0 ${rIn * 2} 0 a${rIn} ${rIn} 0 1 0 ${-rIn * 2} 0Z`;
};

