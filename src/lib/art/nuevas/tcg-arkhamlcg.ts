// Arkham Horror: El juego de cartas. Noches de investigadores, libros prohibidos y tentáculos, con el verde de la
// ficha como color propio (el de la luz que no es de este mundo). Tenebroso sin gore. Nada de la marca: ni sus
// investigadores, ni sus fichas, ni sus íconos ni sus cartas.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

/** Verde de la ficha del juego, con su sombra, su luz y el resplandor de lo arcano. */
const ELDER = '#2B8A3E', ELDER_D = '#17532A', ELDER_L = '#6FBF7E', GLOW = '#CFF2BC'
/** Piedra verdosa de las estrellas talladas. */
const STONE = '#9DB4A4', STONE_L = '#D3E2D6', STONE_D = '#5C7869'

/** Noche con un resplandor verde (velo liso, sin grano, para que no ensucie a 44 px). */
const arkNight = (k: Kit, cx = 0.5, cy = 0.45, a = 0.6) =>
  k.night() + `<path d="M0 0H120V130H0Z" fill="${k.rad(ELDER, cx, cy, 0.55, a, 0)}" opacity=".7"/>`

/** Estrellitas de la noche. */
const stars = (pts: number[][]) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}" opacity=".85"/>`).join('')

/** Curva suave (Catmull-Rom) que pasa por los puntos `pts`, muestreada en `n` tramos por segmento. */
function spline(pts: number[][], n = 12) {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)]
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t
      const c = (a: number, b: number, c2: number, d: number) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3)
      out.push({ x: c(p0[0], p1[0], p2[0], p3[0]), y: c(p0[1], p1[1], p2[1], p3[1]) })
    }
  }
  const last = pts[pts.length - 1]
  out.push({ x: last[0], y: last[1] })
  return out
}

/** Tentáculo que pasa por los puntos `pts`, de ancho `w0` a `w1`, con la panza clara y las ventosas del lado `side`
 * (1 o −1), brillos de tinta arriba y la punta redondeada. */
function tentacle(k: Kit, pts: number[][], w0: number, w1: number, side: 1 | -1, o: { fill?: string; dark?: string; belly?: string; suck?: number; line?: number; suckOp?: number } = {}) {
  const c = spline(pts)
  const N = c.length - 1, L: string[] = [], R: string[] = [], BL: string[] = [], BR: string[] = []
  const q = c.map((p, i) => {
    const a = c[Math.max(i - 1, 0)], b = c[Math.min(i + 1, N)], len = Math.hypot(b.x - a.x, b.y - a.y) || 1, t = i / N
    return { x: p.x, y: p.y, nx: -(b.y - a.y) / len, ny: (b.x - a.x) / len, w: (w0 + (w1 - w0) * Math.pow(t, 0.75)) / 2, t }
  })
  for (const p of q) {
    L.push(`${f(p.x + p.nx * p.w)} ${f(p.y + p.ny * p.w)}`)
    R.push(`${f(p.x - p.nx * p.w)} ${f(p.y - p.ny * p.w)}`)
    BL.push(`${f(p.x + side * p.nx * p.w * 0.1)} ${f(p.y + side * p.ny * p.w * 0.1)}`)
    BR.push(`${f(p.x + side * p.nx * p.w * 1.02)} ${f(p.y + side * p.ny * p.w * 1.02)}`)
  }
  const r = f(Math.max(w1 / 2, 0.2))
  const d = `M${L.join('L')}A${r} ${r} 0 0 ${side > 0 ? 0 : 1} ${R[R.length - 1]}L${R.slice().reverse().join('L')}Z`
  const belly = `M${BL.join('L')}L${BR.slice().reverse().join('L')}Z`
  const fill = o.fill ?? ELDER, dark = o.dark ?? ELDER_D, bel = o.belly ?? ELDER_L
  const step = o.suck ?? 3
  const suck = q.filter((p, i) => i % step === 1 && p.t < 0.93).map((p) => {
    const rr = p.w * 0.4, x = p.x + side * p.nx * p.w * 0.52, y = p.y + side * p.ny * p.w * 0.52
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="${GLOW}" stroke="${P.ink}" stroke-width="${f(Math.min(0.4, rr * 0.4))}"/><circle cx="${f(x + side * p.nx * rr * 0.2)}" cy="${f(y + side * p.ny * rr * 0.2)}" r="${f(rr * 0.45)}" fill="${dark}" opacity=".75"/>`
  }).join('')
  const top = q.filter((_, i) => i % 7 === 3 && i < N - 6).map((p) => {
    const x = p.x - side * p.nx * p.w * 0.55, y = p.y - side * p.ny * p.w * 0.55, tx = p.ny * 1.6, ty = -p.nx * 1.6
    return hair(x - tx, y - ty, x - side * p.nx * 0.4, y - side * p.ny * 0.4, x + tx, y + ty, 0.45, '#fff', 0.45)
  }).join('')
  return {
    d,
    svg: k.draw([{ d, fill, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, dark, 0.5) + `<path d="${belly}" fill="${bel}"/>` + k.shade(belly, k.lin(dark, 0, 0, 1, 1, 0, 0.7), dark, 0.3) + top }], o.line ?? 0.6) +
      (o.suckOp !== undefined ? `<g opacity="${o.suckOp}">${suck}</g>` : suck),
  }
}

/** Ficha redonda de la bolsa con un tentáculo en relieve: canto dorado, fondo noche y el tentáculo verde. */
function chaosToken(k: Kit, r: number) {
  const disc = ellipse(0, 0, r, r)
  const glyph = taper(r * 0.18, r * 0.62, r * 0.7, -r * 0.05, -r * 0.12, -r * 0.42, r * 0.34, r * 0.08)
  return (
    k.draw([{ d: disc, fill: P.gold, inner: k.sh(disc, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) }], 0.6) +
    `<circle cx="0" cy="0" r="${f(r * 0.78)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
    k.shade(ellipse(0, 0, r * 0.78, r * 0.78), k.rad(ELDER, 0.4, 0.4, 0.6, 0.7, 0), ELDER, 0.3) +
    `<circle cx="0" cy="0" r="${f(r * 0.88)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
    `<path d="${glyph}" fill="${ELDER_L}" stroke="${P.ink}" stroke-width=".45"/>` +
    `<path d="M${f(-r * 0.12)} ${f(-r * 0.42)}c${f(-r * 0.18)} ${f(-r * 0.04)} ${f(-r * 0.24)} ${f(r * 0.2)} ${f(-r * 0.08)} ${f(r * 0.24)}" fill="none" stroke="${ELDER_L}" stroke-width="${f(r * 0.08)}" stroke-linecap="round"/>` +
    [0.25, 0.45, 0.65].map((t) => { const x = r * (0.18 + (0.7 - 0.18) * t * 0.6) - r * 0.05, y = r * (0.62 - t * 0.9); return `<circle cx="${f(x - r * 0.06)}" cy="${f(y)}" r="${f(r * 0.06)}" fill="${GLOW}"/>` }).join('') +
    `<path d="M${f(-r * 0.62)} ${f(-r * 0.3)}A${f(r * 0.68)} ${f(r * 0.68)} 0 0 1 ${f(-r * 0.2)} ${f(-r * 0.66)}" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".6"/>`
  )
}

/** Farol de querosén con la base en (0,0): tanque esmaltado verde, tubos laterales, globo de vidrio con la llama,
 * sombrerete con respiraderos y el asa de alambre. */
function lantern(k: Kit) {
  const tank = 'M-12.6 -8.6C-14.4 -7 -14.6 -2.4 -13.2 -.2C-9 1.4 9 1.4 13.2 -.2C14.6 -2.4 14.4 -7 12.6 -8.6C8 -10.2 -8 -10.2 -12.6 -8.6Z'
  const collar = 'M-5.6 -9.4V-13H5.6V-9.4Z'
  const globe = 'M-6 -12.8C-11.6 -16 -12 -30 -5.4 -35.6H5.4C12 -30 11.6 -16 6 -12.8Z'
  const cap = 'M-8 -35.2H8L6.2 -39.6H-6.2Z'
  const dome = 'M-6.2 -39.6C-6.2 -43 -3.2 -45 0 -45C3.2 -45 6.2 -43 6.2 -39.6Z'
  const flameD = 'M0 -29C2.2 -26 3.4 -23.2 3.4 -21C3.4 -18.8 1.9 -17.4 0 -17.4C-1.9 -17.4 -3.4 -18.8 -3.4 -21C-3.4 -23.2 -2.2 -26 0 -29Z'
  const tube = (s: number) => `M${-12 * s} -8.6C${-16.8 * s} -16 ${-16.8 * s} -30 ${-7.8 * s} -36.6`
  const bail = 'M-7.4 -37.6C-12.4 -42.6 -11 -53 0 -53C11 -53 12.4 -42.6 7.4 -37.6'
  const wire = (d: string, w: number, c: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${w + 1.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`
  return (
    wire(bail, 0.9, P.goldD) + `<path d="M-6 -50.4C-3 -52.4 3 -52.4 6 -50.4" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` +
    `<path d="${globe}" fill="${k.rad(P.goldL, 0.5, 0.6, 0.6, 1, 0.45)}"/>` +
    `<path d="${globe}" fill="${GLOW}" opacity=".18"/>` +
    k.shade(ellipse(0, -22, 7, 9), k.rad('#ffffff', 0.5, 0.55, 0.5, 0.9, 0), '#ffffff', 0.5) +
    k.draw([{ d: flameD, fill: P.gold, inner: `<path d="M0 -26C1.4 -23.6 2 -21.8 2 -20.6C2 -19.2 1.1 -18.4 0 -18.4C-1.1 -18.4 -2 -19.2 -2 -20.6C-2 -21.8 -1.4 -23.6 0 -26Z" fill="${P.goldL}"/><ellipse cx="0" cy="-19.8" rx=".9" ry="1.4" fill="#fff"/>` }], 0.3) +
    `<path d="M-1.2 -17.6H1.2V-16H-1.2Z" fill="${P.ink}"/>` +
    `<path d="M-8.6 -16C-10.4 -21 -10.4 -28 -6.8 -33" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".85"/><path d="M8.4 -18C9.4 -22 9.2 -26 8 -29" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".6"/>` +
    `<path d="${globe}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
    `<path d="M-10.6 -24C-4 -22.4 4 -22.4 10.6 -24" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M-10.6 -24C-4 -22.4 4 -22.4 10.6 -24" fill="none" stroke="${ELDER}" stroke-width=".7"/>` +
    wire(tube(1), 2, ELDER) + wire(tube(-1), 2, ELDER) +
    `<path d="${tube(1)}" fill="none" stroke="${ELDER_L}" stroke-width=".5" transform="translate(-.5 0)"/>` +
    k.draw([
      { d: tank, fill: ELDER, inner: k.sh(tank, 0, 0, 1, 1, 0, 0.95, ELDER_D, 0.5) + `<path d="M-15 -11H-5V2H-15Z" fill="${k.lin(ELDER_L, 0, 0, 1, 0, 0.8, 0)}"/>` + `<path d="M-13.4 -2.4C-8 -.8 8 -.8 13.4 -2.4" fill="none" stroke="${P.gold}" stroke-width=".55"/><path d="M-13.2 -6.4C-8 -5 8 -5 13.2 -6.4" fill="none" stroke="${ELDER_D}" stroke-width=".45"/>` },
      { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-5.6 -11.2H5.6" stroke="${P.goldD}" stroke-width=".4"/>` },
      { d: cap, fill: ELDER, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.9, ELDER_D, 0.5) + `<path d="M-7.6 -36.4H7.6" stroke="${ELDER_L}" stroke-width=".5"/>` },
      { d: dome, fill: ELDER, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.9, ELDER_D, 0.5) + `<path d="M-4.4 -41.4C-3.4 -43.2 -1.6 -44 0 -44" fill="none" stroke="${ELDER_L}" stroke-width=".7" stroke-linecap="round"/>` },
    ], 0.6) +
    [-3.6, -1.2, 1.2, 3.6].map((x) => `<circle cx="${x}" cy="-37.6" r=".55" fill="${P.night}"/>`).join('') +
    `<ellipse cx="0" cy="-9.4" rx="12.6" ry="1.8" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
    `<path d="M5.6 -11.2H7.6" stroke="${P.ink}" stroke-width="1.4"/><path d="M5.6 -11.2H7.6" stroke="${P.gold}" stroke-width=".6"/>` +
    `<circle cx="8.6" cy="-11.2" r="1.7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><path d="M7.6 -11.2H9.6M8.6 -12.2V-10.2" stroke="${P.goldD}" stroke-width=".35"/>`
  )
}

/** Libro prohibido abierto, con el lomo en (0,0): tapas de cuero verde con cantoneras, páginas que se arquean con
 * renglones en una escritura que no se lee, un sello en la página derecha, cinta roja y el broche colgando. */
function tome(k: Kit) {
  const cover = 'M-35 -8.4C-22.6 -13.4 -9 -13.4 0 -8.6C9 -13.4 22.6 -13.4 35 -8.4L37 18C24.6 13.8 9 14.6 0 19.6C-9 14.6 -24.6 13.8 -37 18Z'
  const pageL = 'M0 -6.6C-7 -11.6 -19 -13 -31.4 -9.4L-32.8 14.4C-21 11 -9 11.6 0 16.4Z'
  const pageR = 'M0 -6.6C7 -11.6 19 -13 31.4 -9.4L32.8 14.4C21 11 9 11.6 0 16.4Z'
  const lines = (s: number) => Array.from({ length: 7 }, (_, i) => {
    const y = -6.6 + i * 2.7
    if (s > 0 && i > 1 && i < 6) return ''
    return `<path d="M${f(s * 3.6)} ${f(y + 1.6)}C${f(s * 9)} ${f(y - 2.4)} ${f(s * 18)} ${f(y - 3)} ${f(s * 28)} ${f(y - 0.6)}" fill="none" stroke="${P.mid}" stroke-width=".55" stroke-dasharray="${i % 2 ? '2.6 .7 1.2 .7 3.4 .9' : '1.6 .6 3 .8 2 .6'}" opacity=".85"/>`
  }).join('')
  const initial =
    `<path d="M-27.6 -9.2H-22.2V-3.8H-27.6Z" fill="${ELDER}" stroke="${P.ink}" stroke-width=".4"/>` +
    `<path d="M-26.6 -4.6V-8.4H-24.6C-23.2 -8.4 -22.8 -7 -24 -6.4C-22.6 -6 -22.8 -4.6 -24.4 -4.6Z" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linejoin="round"/>`
  const corner = (x: number, y: number, sx: number, sy: number) => `<path d="M${x} ${y}l${f(sx * 4.6)} ${f(sy * 0.6)}l${f(-sx * 0.4)} ${f(sy * 3.6)}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4" transform="rotate(${sx * sy * 4} ${x} ${y})"/>`
  const sigil =
    `<g transform="translate(16.6 2.4) rotate(-6)">` +
    `<ellipse cx="0" cy="0" rx="6.8" ry="5.6" fill="none" stroke="${ELDER}" stroke-width=".7"/><ellipse cx="0" cy="0" rx="5.2" ry="4.2" fill="none" stroke="${ELDER}" stroke-width=".4"/>` +
    `<path d="M0 -3.8C2.6 -1.6 2.6 1.6 0 3.6M-3.4 -1.6C-1 -2.6 1.4 -.4 1 2M3.4 -1.6C1.6 -.4 -1.4 .6 -2.6 2.6" fill="none" stroke="${ELDER_D}" stroke-width=".6" stroke-linecap="round"/>` +
    Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${f(Math.cos(a) * 6)} ${f(Math.sin(a) * 4.9)}l${f(Math.cos(a + 1) * 0.9)} ${f(Math.sin(a + 1) * 0.9)}" stroke="${ELDER_D}" stroke-width=".45"/>` }).join('') +
    `</g>`
  return (
    k.draw([{ d: cover, fill: ELDER_D, inner: k.sh(cover, 0, 0, 1, 1, 0, 0.8, '#0C2A16', 0.5) + `<path d="M-37 14C-24 10 -9 11 0 16C9 11 24 10 37 14" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-dasharray="1.2 .8"/>` }], 0.7) +
    [2.4, 1.6, 0.8].map((dy) => `<path d="${pageL}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".35" transform="translate(${f(-dy * 0.3)} ${dy})"/><path d="${pageR}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".35" transform="translate(${f(dy * 0.3)} ${dy})"/>`).join('') +
    `<path d="M-33.6 15.4L-32.8 14.4M33.6 15.4L32.8 14.4" stroke="${P.ink}" stroke-width=".5"/>` +
    `<path d="${pageL}" fill="${P.white}"/>` + k.clip(pageL, k.sh(pageL, 1, 0, 0, 0, 0.9, 0, P.blue, 0.4) + `<path d="${pageL}" fill="${k.rad(GLOW, 0.95, 0.4, 0.8, 0.6, 0)}"/>` + lines(-1) + initial) +
    `<path d="${pageR}" fill="${P.white}"/>` + k.clip(pageR, k.sh(pageR, 0, 0, 1, 0, 0.9, 0.2, P.blue, 0.35) + `<path d="${pageR}" fill="${k.rad(GLOW, 0.05, 0.4, 0.8, 0.6, 0)}"/>` + lines(1) + sigil) +
    `<path d="${pageL}" fill="none" stroke="${P.ink}" stroke-width=".55"/><path d="${pageR}" fill="none" stroke="${P.ink}" stroke-width=".55"/>` +
    `<path d="M0 -6.6V16.4" stroke="${P.blue}" stroke-width=".6"/>` +
    corner(-36.6, 17.6, 1, -1) + corner(36.6, 17.6, -1, -1) +
    hair(-26, 12.6, -18, 10.4, -8, 12.6, 0.35, P.blue) + hair(26, 12.6, 18, 10.4, 8, 12.6, 0.35, P.blue)
  )
}

/** Estrella de cinco puntas tallada en piedra verdosa, con las caras talladas en bisel, el filo de oro en las aristas y
 * la llama grabada en el centro. Centro en (0,0). */
function starStone(k: Kit, R: number, r: number) {
  const pt = (deg: number, rr: number) => { const a = (deg * Math.PI) / 180; return [Math.cos(a) * rr, Math.sin(a) * rr] }
  const O = Array.from({ length: 5 }, (_, i) => pt(-90 + i * 72, R)), I = Array.from({ length: 5 }, (_, i) => pt(-54 + i * 72, r))
  const s = (p: number[]) => `${f(p[0])} ${f(p[1])}`
  const facets: string[] = []
  for (let i = 0; i < 5; i++) {
    for (const j of [i, (i + 4) % 5]) {
      const d = `M0 0L${s(O[i])}L${s(I[j])}Z`, cx = (O[i][0] + I[j][0]) / 3, cy = (O[i][1] + I[j][1]) / 3
      const b = Math.cos(Math.atan2(cy, cx) - (-135 * Math.PI) / 180)
      const fill = b > 0.45 ? STONE_L : b > -0.3 ? STONE : STONE_D
      facets.push(`<path d="${d}" fill="${fill}"/>` + k.shade(d, k.lin(b > 0 ? '#ffffff' : STONE_D, 0, 0, 1, 1, b > 0 ? 0.4 : 0, b > 0 ? 0 : 0.7), b > 0 ? '#ffffff' : STONE_D, 0.3))
    }
  }
  const star = starPath(0, 0, R, r, 5)
  const speck = Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, rr = 3 + ((i * 7) % 17); return `<circle cx="${f(Math.cos(a) * rr)}" cy="${f(Math.sin(a) * rr)}" r="${i % 3 ? 0.3 : 0.45}" fill="${STONE_D}" opacity=".6"/>` }).join('')
  const flameD = 'M0 -8C2.6 -4.6 4.4 -1.6 4.4 1.4C4.4 4.2 2.4 6 0 6C-2.4 6 -4.4 4.2 -4.4 1.4C-4.4 -1.6 -2.6 -4.6 0 -8Z'
  return (
    `<path d="${star}" fill="${STONE_D}" transform="translate(1.6 2.4)"/>` +
    k.draw([{ d: star, fill: STONE, inner: facets.join('') + speck + `<path d="${O.map((o) => `M0 0L${s(o)}`).join('')}${I.map((p) => `M0 0L${s(p)}`).join('')}" stroke="${P.ink}" stroke-width=".35" opacity=".5"/>` }], 0.8) +
    `<path d="${O.map((o) => `M${f(o[0] * 0.34)} ${f(o[1] * 0.34)}L${f(o[0] * 0.92)} ${f(o[1] * 0.92)}`).join('')}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/>` +
    `<path d="${O.map((o) => `M${f(o[0] * 0.34)} ${f(o[1] * 0.34)}L${f(o[0] * 0.92)} ${f(o[1] * 0.92)}`).join('')}" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
    `<path d="${starPath(0, 0, R * 0.86, r * 0.86, 5)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
    `<circle cx="0" cy="0" r="${f(r * 0.95)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
    k.shade(ellipse(0, 0, r * 0.95, r * 0.95), k.rad(ELDER, 0.5, 0.6, 0.5, 0.9, 0.2), ELDER, 0.4) +
    `<circle cx="0" cy="0" r="${f(r * 0.95)}" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
    `<g transform="scale(${f(r / 11)})">` + k.draw([{ d: flameD, fill: P.gold, inner: `<path d="M0 -4C1.4 -2 2.2 -.4 2.2 1.4C2.2 3 1.2 4 0 4C-1.2 4 -2.2 3 -2.2 1.4C-2.2 -.4 -1.4 -2 0 -4Z" fill="${P.goldL}"/><ellipse cx="0" cy="2.2" rx=".8" ry="1.2" fill="#fff"/>` }], 0.45) + `</g>` +
    `<path d="M${f(O[4][0] * 0.5)} ${f(O[4][1] * 0.5 - 1)}L${f(O[4][0] * 0.62)} ${f(O[4][1] * 0.62 - 1)}" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>`
  )
}

/** Bolsa de terciopelo verde con cordón, con el centro de la panza en (0,0) y la boca arriba. */
function bag(k: Kit) {
  const body = 'M-9.6 -12.4C-16.4 -8.6 -20.4 1 -18.6 11.4C-16.8 19.6 -8.6 23.4 0 23.4C8.6 23.4 16.8 19.6 18.6 11.4C20.4 1 16.4 -8.6 9.6 -12.4C5 -14 -5 -14 -9.6 -12.4Z'
  const neck = 'M-9.4 -12.6C-5 -14.2 5 -14.2 9.4 -12.6L7.4 -17.6C3 -18.6 -3 -18.6 -7.4 -17.6Z'
  const ruffle = 'M-7.4 -17.6C-12 -19.4 -14.4 -23.6 -12 -26.6C-9 -29.6 -3 -28.4 0 -29C3 -28.4 9 -29.6 12 -26.6C14.4 -23.6 12 -19.4 7.4 -17.6C3 -18.6 -3 -18.6 -7.4 -17.6Z'
  const mouth = 'M-8.6 -24.6C-5 -27 5 -27 8.6 -24.6C5 -22.6 -5 -22.6 -8.6 -24.6Z'
  const cord = 'M-9.4 -15.2C-4 -12.4 4 -12.4 9.4 -15.2'
  const tasselD = 'M-1.4 0H1.4L2.4 5.4H-2.4Z'
  const tassel = (x: number, y: number, r: number) =>
    `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d: tasselD, fill: P.gold, inner: k.sh(tasselD, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-1 1.4V5.4M0 1.4V5.4M1 1.4V5.4" stroke="${P.goldD}" stroke-width=".3"/>` }], 0.35) + `<circle cx="0" cy="-.2" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/></g>`
  return (
    k.draw([
      {
        d: body, fill: ELDER,
        inner: k.sh(body, 0, 0, 1, 1, 0, 0.95, ELDER_D, 0.5) + `<path d="M-20 -14H-6V24H-20Z" fill="${k.lin(ELDER_L, 0, 0, 1, 0, 0.75, 0)}"/>` +
          `<path d="${body}" fill="${k.rad(GLOW, 0.32, 0.3, 0.3, 0.45, 0)}"/>` +
          hair(-6, -11, -9, 2, -6, 20, 0.6, ELDER_D) + hair(3, -11, 6, 4, 4, 21, 0.6, ELDER_D) + hair(-1.4, -10, -2, 0, -1, 10, 0.45, ELDER_D, 0.7) +
          hair(11, -8, 15, 2, 13, 16, 0.5, ELDER_D) + hair(-13, -4, -15.6, 4, -14.6, 14, 0.45, '#fff', 0.35) +
          `<path d="M-17.6 15C-8 20 8 20 17.6 15" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-dasharray="1.4 1"/>`,
      },
      { d: neck, fill: ELDER, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.9, ELDER_D, 0.5) + `<path d="M-5 -13.6L-4.4 -17.8M0 -13.8V-18.2M5 -13.6L4.4 -17.8" stroke="${ELDER_D}" stroke-width=".5"/>` },
      { d: ruffle, fill: ELDER, inner: k.sh(ruffle, 0, 0, 1, 1, 0, 0.9, ELDER_D, 0.5) + `<path d="M-12 -25.4C-10 -22.6 -9 -20.4 -8.6 -18.4M12 -25.4C10 -22.6 9 -20.4 8.6 -18.4M-4 -28.4L-3.4 -24.6M4 -28.4L3.4 -24.6" fill="none" stroke="${ELDER_D}" stroke-width=".5"/>` },
    ], 0.7) +
    `<path d="${mouth}" fill="#0C2A16" stroke="${P.ink}" stroke-width=".45"/>` +
    `<path d="${cord}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="${cord}" fill="none" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="M-4 -13.6C-6 -10 -8 -6 -8.6 -2M-2 -13.4C-1 -9 -1.6 -5 -3 -1" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M-4 -13.6C-6 -10 -8 -6 -8.6 -2M-2 -13.4C-1 -9 -1.6 -5 -3 -1" fill="none" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/>` +
    `<circle cx="-3" cy="-13.4" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
    tassel(-8.6, -2, 10) + tassel(-3, -1, -8)
  )
}

/** Cama de hierro del asilo vista desde los pies, con el centro del colchón en (0,0): cabecera alta con barrotes,
 * almohada, frazada verde con las correas de cuero, piecera con volutas y perillas de bronce. */
function asylumBed(k: Kit) {
  const knob = (x: number, y: number, r: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.32)}" fill="${P.goldL}"/>`
  const iron = (d: string, w: number) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${w + 1.2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P.white}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
  const ironSh = (d: string, w: number) => `<path d="${d}" fill="none" stroke="${P.sky2}" stroke-width="${f(w * 0.4)}" stroke-linecap="round" transform="translate(${f(w * 0.25)} 0)"/>`
  const head = 'M-17 -22V-6M17 -22V-6M-17 -20C-10 -24.4 10 -24.4 17 -20M-17 -14H17'
  const headBars = [-11.4, -5.8, 0, 5.8, 11.4].map((x) => `M${x} ${f(-22.4 + Math.pow(x / 17, 2) * 2.2)}V-6`).join('')
  const pillow = 'M-12.4 -10.4C-12.8 -13.4 -10.6 -15 -8 -14.6C-3 -14 3 -14 8 -14.6C10.6 -15 12.8 -13.4 12.4 -10.4C12.2 -8 10.4 -7 8 -7.4C3 -8 -3 -8 -8 -7.4C-10.4 -7 -12.2 -8 -12.4 -10.4Z'
  const blanket = 'M-19 -6.4C-10 -8 10 -8 19 -6.4L20.4 11.6C21 14 19.6 15 17.6 14.6C10 13.4 -10 13.4 -17.6 14.6C-19.6 15 -21 14 -20.4 11.6Z'
  const strap = (y: number) => `M-20.2 ${y}C-10 ${f(y - 1.4)} 10 ${f(y - 1.4)} 20.2 ${y}L20.4 ${f(y + 2.6)}C10 ${f(y + 1.2)} -10 ${f(y + 1.2)} -20.4 ${f(y + 2.6)}Z`
  const buckle = (x: number, y: number) => `<rect x="${f(x - 1.6)}" y="${f(y - 0.4)}" width="3.2" height="3.4" rx=".5" fill="none" stroke="${P.ink}" stroke-width="1.3"/><rect x="${f(x - 1.6)}" y="${f(y - 0.4)}" width="3.2" height="3.4" rx=".5" fill="none" stroke="${P.gold}" stroke-width=".6"/><path d="M${x} ${f(y - 0.2)}V${f(y + 2.8)}" stroke="${P.ink}" stroke-width=".4"/>`
  const foot = 'M-21 4V26M21 4V26M-21 6.4C-12 2 12 2 21 6.4M-21 16H21'
  const footBars = [-14, -7, 0, 7, 14].map((x) => `M${x} ${f(4.6 + (1 - Math.pow(x / 21, 2)) * -1.6 + 1.4)}V16`).join('')
  const curl = (x: number, s: number) => `M${x} 16C${f(x + s * 3.4)} 16 ${f(x + s * 4.6)} 19.6 ${f(x + s * 2.6)} 21C${f(x + s * 1)} 22 ${f(x - s * 0.6)} 20.6 ${f(x + s * 0.6)} 19.4`
  return (
    iron(head, 1.6) + iron(headBars, 1) + ironSh(head, 1.6) +
    knob(-17, -23.6, 2.2) + knob(17, -23.6, 2.2) +
    k.draw([{ d: pillow, fill: P.white, inner: k.sh(pillow, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + hair(-8, -9, -4, -10.6, 0, -9.6, 0.45, P.blue) + hair(3, -12.6, 6, -13.4, 9, -12.4, 0.4, P.blue) }], 0.55) +
    k.draw([{
      d: blanket, fill: ELDER,
      inner: k.sh(blanket, 0, 0, 1, 1, 0, 0.9, ELDER_D, 0.5) + `<path d="M-19 -6.4C-10 -8 10 -8 19 -6.4L19.2 -2.6C10 -4.4 -10 -4.4 -19.2 -2.6Z" fill="${P.white}"/>` + k.sh('M-20 -8H20V-2H-20Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) +
        hair(-12, 0, -13, 6, -12, 13, 0.55, ELDER_D) + hair(10, 1, 12, 7, 11, 13, 0.55, ELDER_D) + hair(-2, 2, -1, 8, -2, 13.4, 0.45, ELDER_D, 0.8) +
        `<path d="${strap(-0.6)}" fill="${P.brown}"/><path d="${strap(7.6)}" fill="${P.brown}"/>` + k.sh(strap(-0.6), 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) + k.sh(strap(7.6), 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) +
        `<path d="${strap(-0.6)}${strap(7.6)}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="M-19 -.4C-10 -1.8 10 -1.8 19 -.4M-19 7.8C-10 6.4 10 6.4 19 7.8" fill="none" stroke="${P.goldL}" stroke-width=".3" stroke-dasharray=".8 .6" transform="translate(0 .9)"/>`,
    }], 0.7) +
    buckle(-6, -1.6) + buckle(6, 6.6) +
    iron(foot, 1.8) + iron(footBars, 1.1) + iron(curl(-21, 1) + curl(21, -1), 0.8) + ironSh(foot, 1.8) +
    knob(-21, 2.6, 2.4) + knob(21, 2.6, 2.4) +
    [[-17, -14], [17, -14], [-21, 16], [21, 16], [-21, 6.4], [21, 6.4]].map(([x, y]) => `<rect x="${f(x - 1.6)}" y="${f(y - 1)}" width="3.2" height="2" rx=".6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
    `<path d="M-21 26.4H-19M19 26.4H21" stroke="${P.ink}" stroke-width="1.4"/>`
  )
}

export const TCG_ARKHAMLCG_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Investigador ────────────────────────────────────────────────────

  // Tres escenarios: con la lamparita alcanza para no tropezarte. El farol verde y su charco de luz en la noche.
  'Lámpara de aceite': (u) => {
    const k = kit(u)
    // Adoquín: piedra irregular, con la cara de arriba iluminada por el farol.
    const cobble = (x: number, y: number, w: number, h: number, sk: number) => {
      const d = `M${f(x - w / 2)} ${f(y + h * 0.1)}C${f(x - w / 2)} ${f(y - h * 0.5)} ${f(x - w * 0.3 + sk)} ${f(y - h * 0.6)} ${x + sk} ${f(y - h * 0.6)}C${f(x + w * 0.35 + sk)} ${f(y - h * 0.6)} ${f(x + w / 2)} ${f(y - h * 0.4)} ${f(x + w / 2)} ${f(y + h * 0.1)}C${f(x + w / 2)} ${f(y + h * 0.5)} ${f(x + w * 0.2)} ${f(y + h * 0.55)} ${x} ${f(y + h * 0.55)}C${f(x - w * 0.3)} ${f(y + h * 0.55)} ${f(x - w / 2)} ${f(y + h * 0.45)} ${f(x - w / 2)} ${f(y + h * 0.1)}Z`
      return k.draw([{ d, fill: P.mid, inner: `<path d="${d}" fill="${k.lin(P.gold, 0, 0, 0, 1, 0.75, 0)}"/>` + k.sh(d, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) }], 0.45)
    }
    const lurk = tentacle(k, [[16, 106], [23, 92], [25, 80], [29, 72], [34.4, 71.4], [35.6, 75.4], [33, 77]], 9, 1.2, 1, { fill: '#1C2A5C', dark: '#0B1230', belly: '#2E4278', suck: 3, line: 0.45, suckOp: 0.5 })
    return (
      arkNight(k, 0.5, 0.5, 0.45) +
      stars([[30, 34, 0.5], [88, 30, 0.6], [40, 24, 0.4], [94, 50, 0.4], [26, 58, 0.45]]) +
      k.shade(ellipse(60, 60, 34, 36), k.rad(P.goldL, 0.5, 0.55, 0.5, 0.95, 0), P.gold, 0.55) +
      lurk.svg + hair(30, 64, 33, 62.4, 36, 63, 0.5, P.goldL, 0.7) + hair(35, 68, 37.6, 67.6, 39.6, 69, 0.45, P.goldL, 0.6) +
      cobble(41.6, 89.6, 9, 4.4, 0.6) + cobble(78.4, 89.6, 9, 4.4, -0.6) + cobble(50, 94.4, 9.4, 4.4, -0.4) + cobble(70, 94.4, 9.4, 4.4, 0.4) + cobble(60, 99, 9, 4, 0) +
      k.floor(60, 89, 18, 2.6, P.goldD) +
      `<g transform="translate(60 89) scale(1.06)">` + lantern(k) + `</g>` +
      sparkle(60, 64, 2.4, '#fff') +
      `<circle cx="44" cy="44" r=".5" fill="${P.goldL}"/><circle cx="77" cy="50" r=".45" fill="${P.goldL}"/><circle cx="72" cy="38" r=".35" fill="${P.goldL}"/>` +
      k.defs()
    )
  },

  // Quince escenarios: lo leíste entero y (casi) no te volviste loco. El libro abierto echando humo verde.
  'Necronomicón': (u) => {
    const k = kit(u)
    // Hebras de humo en S: dos trazos encadenados que se afinan, más claros abajo.
    const wisp = (x: number, y: number, dx: number, h: number, w: number) =>
      hair(x, y, x - dx, y - h * 0.25, x, y - h * 0.5, w, GLOW, 0.9) + hair(x, y - h * 0.5, x + dx, y - h * 0.75, x - dx * 0.3, y - h, w * 0.8, GLOW, 0.7)
    const spiral = (x: number, y: number) => `<path d="M${x} ${y}c-3 -1 -4.6 -4.4 -2.4 -6.6c2 -2 5.4 -1.2 5.6 1.4c.2 2 -1.8 3.2 -3.2 2.2c-1 -.8 -.6 -2.2 .4 -2.4" fill="none" stroke="${GLOW}" stroke-width=".7" stroke-linecap="round" opacity=".85"/>`
    const ribbon = 'M-1 16C-1.4 20 -.6 24 .6 28.6L2 26.6L3.6 28C2.6 24 2 20 1.6 16Z'
    return (
      arkNight(k, 0.5, 0.42, 0.4) +
      stars([[28, 30, 0.5], [92, 34, 0.55], [30, 52, 0.4], [90, 56, 0.4], [80, 22, 0.35]]) +
      k.shade(ellipse(60, 44, 16, 26), k.rad(ELDER_L, 0.5, 0.7, 0.5, 0.95, 0), ELDER, 0.5) +
      k.shade(ellipse(60, 50, 10, 16), k.rad(GLOW, 0.5, 0.75, 0.5, 0.9, 0), ELDER_L, 0.4) +
      wisp(59, 60, 5, 30, 1.3) + wisp(62, 60, -6, 36, 1.5) + wisp(56, 61, -4, 20, 0.9) + wisp(65, 61, 4, 22, 0.9) + spiral(62.4, 30) +
      `<g transform="translate(60 66) scale(.95)">` +
      k.floor(0, 20, 34, 3, '#000') +
      tome(k) +
      k.draw([{ d: ribbon, fill: P.red, inner: k.sh(ribbon, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.35) +
      `<path d="M35.6 2.4H41.6V8.6H35.6Z" fill="${ELDER_D}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M40 1.4H44.4V9.6H40Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="42.2" cy="5.5" r="1" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      sparkle(46, 32, 1.8, GLOW) + sparkle(78, 38, 1.4, GLOW) +
      k.defs()
    )
  },

  // Cuarenta escenarios: sellaste a los Primigenios con una estrellita. La estrella de piedra que los manda de vuelta.
  'Signo Arcano': (u) => {
    const k = kit(u)
    const t1 = tentacle(k, [[18, 110], [27, 97], [35, 88], [36.6, 80], [32, 75.4], [27.4, 77], [27.6, 81]], 11, 1.2, 1, { suck: 3 })
    const t2 = tentacle(k, [[102, 110], [93, 97], [85, 88], [83.4, 80], [88, 75.4], [92.6, 77], [92.4, 81]], 11, 1.2, -1, { suck: 3 })
    const ring = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2, r0 = 33.6, r1 = i % 2 ? 35 : 36.4; return `M${f(60 + Math.cos(a) * r0)} ${f(54 + Math.sin(a) * r0)}L${f(60 + Math.cos(a) * r1)} ${f(54 + Math.sin(a) * r1)}` }).join('')
    return (
      arkNight(k, 0.5, 0.42, 0.7) +
      stars([[26, 30, 0.5], [94, 28, 0.55], [22, 62, 0.4], [98, 66, 0.45]]) +
      k.sun(60, 54, 14, 44, 32, false) +
      k.shade(ellipse(60, 54, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.5) +
      `<circle cx="60" cy="54" r="33" fill="none" stroke="${P.gold}" stroke-width=".6"/><path d="${ring}" stroke="${P.gold}" stroke-width=".6"/>` +
      t1.svg + t2.svg +
      hair(34, 72, 36, 68, 35, 64, 0.55, GLOW, 0.85) + hair(29.6, 71, 30.6, 67, 29.4, 63.6, 0.45, GLOW, 0.7) + hair(86, 72, 84, 68, 85, 64, 0.55, GLOW, 0.85) + hair(90.4, 71, 89.4, 67, 90.6, 63.6, 0.45, GLOW, 0.7) +
      `<g transform="translate(60 53) rotate(-4)">` + starStone(k, 29, 11.8) + `</g>` +
      sparkle(60, 15, 3, '#fff') + sparkle(30, 42, 1.8, P.goldL) + sparkle(90, 44, 1.8, P.goldL) +
      k.defs()
    )
  },

  // ── Bolsa del caos ──────────────────────────────────────────────────

  // Cinco tentáculos: ya te tiembla el ojo al meter la mano. La bolsa tiembla y asoma la ficha del tentáculo.
  'Tic nervioso': (u) => {
    const k = kit(u)
    return (
      arkNight(k, 0.5, 0.5, 0.6) +
      stars([[30, 32, 0.5], [90, 30, 0.5], [24, 66, 0.4], [96, 70, 0.4]]) +
      k.shade(ellipse(60, 62, 26, 28), k.rad(GLOW, 0.5, 0.5, 0.5, 0.5, 0), ELDER_L, 0.4) +
      k.floor(60, 92.6, 22, 3, '#000') +
      `<g transform="translate(60 68) rotate(-4)">` + bag(k) + `</g>` +
      `<path d="M58 42C58 37 60 33 62.6 31" fill="none" stroke="${GLOW}" stroke-width=".7" stroke-dasharray="1.4 1.2" stroke-linecap="round"/>` +
      `<g transform="translate(65.4 32.6) rotate(14)">` + chaosToken(k, 9) + `</g>` +
      hair(32, 52, 29, 60, 32, 68, 0.8, ELDER_L) + hair(27, 56, 24, 63, 27, 70, 0.6, ELDER_L) + hair(88, 56, 91, 64, 88, 72, 0.8, ELDER_L) + hair(93, 60, 96, 67, 93, 74, 0.6, ELDER_L) +
      `<path d="M54 25L52 22M51 29L47.6 28M79 22L81.6 19.6M81 29L84.6 28.4" stroke="${GLOW}" stroke-width=".8" stroke-linecap="round"/>` +
      sparkle(84, 46, 1.8, GLOW) +
      k.defs()
    )
  },

  // Veinte tentáculos: te guardan una cama con tu nombre. La cama de hierro del asilo, con correas y su cartelito.
  'Manicomio de Arkham': (u) => {
    const k = kit(u)
    const win = 'M46 46V32C46 24 52 19.6 60 19.6C68 19.6 74 24 74 32V46Z'
    const beam = 'M47 46L74 46L92 104H28Z'
    const tag = roundRect(-8.6, 0, 8.6, 6.6, 0.8)
    return (
      `<rect width="120" height="130" fill="${P.night}"/>` +
      Array.from({ length: 9 }, (_, i) => `<path d="M0 ${f(24 + i * 9)}H120" stroke="#22306A" stroke-width=".45"/>`).join('') +
      `<path d="M0 0H120V130H0Z" fill="${k.rad(ELDER, 0.5, 0.3, 0.6, 0.5, 0)}" opacity=".7"/>` +
      `<g transform="translate(0 2.4)">` + k.draw([{ d: win, fill: P.mid, inner: k.sh(win, 0, 0, 0, 1, 0.2, 0.8, P.night, 0.4) + `<circle cx="64.6" cy="30" r="5.4" fill="${GLOW}"/>` + k.shade(ellipse(64.6, 30, 5.4, 5.4), k.rad(ELDER, 0.65, 0.62, 0.5, 0, 0.7), ELDER, 0.4) + `<circle cx="63" cy="29" r="1" fill="${ELDER_L}" opacity=".6"/><circle cx="66.6" cy="32.4" r=".7" fill="${ELDER_L}" opacity=".6"/>` }], 0.6) +
      `<path d="M51.6 21V46M57.2 19.8V46M62.8 19.8V46M68.4 21V46M46 33.6H74" stroke="${P.ink}" stroke-width="1.6"/><path d="M51.6 21V46M57.2 19.8V46M62.8 19.8V46M68.4 21V46M46 33.6H74" stroke="${P.blue}" stroke-width=".7"/>` +
      `<path d="M44.6 46.6H75.4" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M44.6 46.6H75.4" stroke="${P.sky2}" stroke-width="1" stroke-linecap="round"/></g>` +
      `<path d="${beam}" fill="${k.lin(GLOW, 0, 0, 0, 1, 0.3, 0)}"/>` +
      k.floor(60, 94, 28, 3, '#000') +
      `<g transform="translate(60 70)">` + asylumBed(k) + `</g>` +
      `<path d="M60 77.4L56 82.6M60 77.4L64 82.6" stroke="${P.ink}" stroke-width=".45"/>` +
      `<g transform="translate(60 82) rotate(-5)">` + k.draw([{ d: tag, fill: P.paper, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) }], 0.45) +
      `<circle cx="0" cy="1.2" r=".5" fill="${P.ink}"/><text x="0" y="5.2" font-family="Georgia, serif" font-style="italic" font-size="3.2" fill="${P.ink}" text-anchor="middle">reservada</text></g>` +
      k.defs()
    )
  },

  // Sesenta tentáculos: el Gran Antiguo te saluda como a un viejo amigo. Sale del mar y abraza tu ficha.
  'Abrazo de Cthulhu': (u) => {
    const k = kit(u)
    const back = tentacle(k, [[24, 106], [21, 86], [25, 66], [34, 48], [46, 35], [60, 30.4], [72, 33], [78.6, 40], [77, 46], [72.6, 45.4]], 13, 1.4, 1, { suck: 3 })
    const front = tentacle(k, [[98, 106], [98, 86], [90, 70], [76, 63], [60, 62.6], [47, 60], [40.6, 53], [42.6, 47.4], [46.4, 49]], 13, 1.4, -1, { suck: 3 })
    const sea = 'M0 84C10 82 20 86 30 84C40 82 50 86 60 84C70 82 80 86 90 84C100 82 110 86 120 84V130H0Z'
    return (
      arkNight(k, 0.5, 0.4, 0.35) +
      stars([[24, 30, 0.5], [96, 26, 0.55], [92, 52, 0.4], [40, 22, 0.4], [28, 48, 0.4]]) +
      k.sun(60, 48, 13, 40, 28, false) +
      k.shade(ellipse(60, 48, 22, 22), k.rad(GLOW, 0.5, 0.5, 0.5, 0.85, 0), ELDER_L, 0.5) +
      back.svg +
      `<g transform="translate(60 48) rotate(-10)">` + chaosToken(k, 13.4) + `</g>` +
      front.svg +
      `<path d="${sea}" fill="${P.night}"/>` + k.shade(sea, k.lin(ELDER, 0, 0, 0, 1, 0.4, 0), ELDER, 0.25) +
      `<path d="${sea}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      [88, 93, 98].map((y, i) => `<path d="M${36 + i * 3} ${y}q3 -1.4 6 0t6 0M${70 - i * 3} ${y + 1}q3 -1.4 6 0t6 0" fill="none" stroke="${GLOW}" stroke-width=".5" opacity="${0.75 - i * 0.18}"/>`).join('') +
      `<path d="M13 85.4C17 83 27 83 31 85.6M88 85.4C92 83 102 83 106 85.6" fill="none" stroke="${GLOW}" stroke-width=".8" stroke-linecap="round"/>` +
      `<circle cx="34" cy="80" r=".7" fill="${GLOW}"/><circle cx="37" cy="77" r=".5" fill="${GLOW}"/><circle cx="85" cy="79" r=".6" fill="${GLOW}"/>` +
      sparkle(60, 24, 2.4, '#fff') + sparkle(88, 32, 1.6, GLOW) +
      k.defs()
    )
  },
}
