// Golf: la pelotita blanca de hoyuelos, el tee, el green con el hoyo y la bandera numerada, el driver, el carrito
// eléctrico y la chaqueta verde. Los birdies son pájaros de verdad (gorrión, hornero, cóndor, con el pájaro cantor de
// wingspan.ts); a Ángel Cabrera no se lo dibuja: aparece por su apodo, en la funda de pato del driver.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, type Kit } from '../kit'
import { nota, rotulo, volutas } from './_lote6-piezas'

/** Verde del green y del fairway. */
const GREEN = '#7E9A4C', GREEN_D = '#4F6A2C', GREEN_L = '#A9BE72'
/** Verde de la chaqueta, oscuro y apagado. */
const SACO = '#3E6B47', SACO_D = '#263F2C', SACO_L = '#6E9A72'
/** Barro del hornero. */
const MUD = '#B88554', MUD_D = '#80552F', MUD_L = '#DDB585'
/** Plumajes. */
const RUFO = '#B4703A', RUFO_D = '#7E4520', ANTE = '#F2DFC0', GRIS = '#9DA3AE', CASTA = '#9A5A2E', CASTA_D = '#5E3418'
/** Pato: cabeza verde de collar blanco, pico anaranjado. */
const PATO = '#4E7D52', PATO_D = '#2C4A30', PICO = '#E2A23C', PICO_D = '#B0702A'
/** Lana de la funda. */
const LANA = '#C9A27A', LANA_D = '#8E6A46'

// ── Pájaros (el pájaro cantor de wingspan.ts) ──────────────────────────────

const eye = (x: number, y: number, r: number, iris = '#2A1A10') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${iris}" stroke="${P.ink}" stroke-width=".25"/><circle cx="${x}" cy="${y}" r="${f(r * 0.55)}" fill="#120C08"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.32)}" fill="#fff"/>`
const legs = (x0: number, x1: number, top: number, c: string) =>
  [x0, x1].map((x) => {
    const d = `M${x} ${top}L${f(x - 0.4)} 0M${f(x - 0.4)} 0L${f(x - 3)} .3M${f(x - 0.4)} 0L${f(x - 2.4)} 1.1M${f(x - 0.4)} 0L${f(x + 1.8)} .4`
    return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width=".55" stroke-linecap="round"/>`
  }).join('')
interface Plumage { back: string; dark: string; belly: string; wing: string; tail: string; bill: string; leg: string; cap?: string; cheek?: string; bib?: string; brow?: string; thin?: boolean; sing?: boolean; leg0?: number; streaks?: string }
/** Pájaro cantor de perfil, mirando a la izquierda, con las patas en (0,0). */
function songbird(k: Kit, o: Plumage) {
  const L = o.leg0 ?? 1.4
  const body = 'M-10.4 -14C-10.4 -17.6 -7.8 -20.2 -4.4 -20.2C-1.2 -20.2 1 -18.2 1.8 -15.6C4.6 -14.6 8.6 -12 11 -8.2C11.6 -7 11.4 -5.6 10.4 -5C7.6 -2.4 4.4 -1.2 1 -1.2C-4.4 -1.2 -8.6 -4 -9.8 -8.4C-10.2 -10 -10.6 -12 -10.4 -14Z'
  const belly = 'M-9.8 -8.4C-8.6 -4 -4.4 -1.2 1 -1.2C4.4 -1.2 7.6 -2.4 10.4 -5C7 -5.6 3 -6.4 -1 -8.4C-4 -10 -6.6 -11.6 -10.2 -12.4Z'
  const wing = 'M-3 -13.4C1.6 -14.8 7.4 -12.6 10.8 -8.8L16.4 -5.4C11.6 -4.6 6 -4.6 2 -5.6C-1.6 -6.4 -3.8 -8.8 -3.8 -11.2C-3.8 -12.2 -3.4 -13 -3 -13.4Z'
  const tail = 'M8.6 -8.8L20 -6.6C20.8 -6.4 20.8 -5 20 -4.8L9 -4.2Z'
  const cap = 'M-10 -16C-9.2 -18.8 -7 -20.2 -4.4 -20.2C-1.6 -20.2 .6 -18.6 1.6 -16C-1 -16.8 -4 -17.2 -6.4 -17C-7.8 -16.8 -9 -16.4 -10 -16Z'
  const bib = 'M-10.2 -12.6C-9.6 -9.8 -8 -8 -5.8 -7.4C-6 -9.4 -7 -11.2 -8.6 -12.6Z'
  const billC = o.sing
    ? 'M-10.2 -15.8L-14.6 -17.4L-10 -14.4ZM-10.2 -13.8L-14 -13.2L-10 -12.6Z'
    : o.thin ? 'M-10.2 -15.4C-12.6 -15.2 -15 -14.4 -17 -13.2C-15 -13.2 -12.6 -12.9 -10.2 -12.9Z' : 'M-10 -15.9C-11.8 -15.6 -13.6 -14.8 -14.4 -14C-13.6 -13.4 -11.8 -12.8 -10 -12.6Z'
  const streaks = o.streaks ? Array.from({ length: 7 }, (_, i) => hair(-1 + i * 2, -12.6 + (i % 2) * 1.6 + i * 0.5, 0.4 + i * 2, -11 + i * 0.5, 2 + i * 2, -9.6 + (i % 2) * 1.2 + i * 0.5, 0.55, o.streaks!)).join('') : ''
  return (
    legs(-1.6, 1.4, -L - 0.6, o.leg) +
    `<g transform="translate(0 ${-L})">` +
    k.draw([
      { d: tail, fill: o.tail, inner: k.sh(tail, 0, 0, 0, 1, 0, 0.8, o.dark, 0.4) },
      {
        d: body, fill: o.back,
        inner: `<path d="${belly}" fill="${o.belly}"/>` + k.sh(body, 0, 0, 1, 1, 0, 0.75, o.dark, 0.4) + `<path d="M-11 -21H-4V-8H-11Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` +
          (o.cap ? `<path d="${cap}" fill="${o.cap}"/>` : '') + (o.bib ? `<path d="${bib}" fill="${o.bib}"/>` : '') + (o.cheek ? `<path d="${ellipse(-5.4, -13.2, 2.8, 1.9)}" fill="${o.cheek}"/>` : '') +
          (o.brow ? hair(-9.6, -17.2, -6, -18.4, -1.6, -17, 0.75, o.brow) : '') + hair(-8.4, -6, -4, -3, 2, -2.6, 0.45, o.dark, 0.5),
      },
      {
        d: wing, fill: o.wing,
        inner: k.sh(wing, 0, 0, 1, 1, 0, 0.8, o.dark, 0.45) + streaks + `<path d="M-2 -11.6C1.6 -12.6 5 -11.8 7.8 -10" fill="none" stroke="${o.belly}" stroke-width=".7" opacity=".9"/>` +
          hair(4, -7.4, 9, -6.6, 15.6, -5.6, 0.45, o.dark) + hair(5, -9, 10, -7.8, 15, -6.2, 0.4, o.dark),
      },
    ], 0.55) +
    k.draw([{ d: billC, fill: o.bill }], 0.3) +
    eye(-6.6, -15.6, 1.05) +
    `</g>`
  )
}
const SPARROW = (sing = false): Plumage => ({ back: CASTA, dark: CASTA_D, belly: '#D9D6CC', wing: '#B27A46', tail: '#7A5232', bill: '#3A3030', leg: '#C99A7A', cap: GRIS, cheek: '#F2EEE6', bib: '#2A2626', streaks: '#3C2414', sing })
const HORNERO: Plumage = { back: RUFO, dark: RUFO_D, belly: ANTE, wing: '#A8683A', tail: '#C4682E', bill: '#6E5A48', leg: '#6A584C', brow: '#F6E7CC', thin: true, leg0: 4.2 }

// ── Piezas del golf ─────────────────────────────────────────────

/** Pelotita de golf con hoyuelos en (x,y) de radio r. */
function pelota(k: Kit, x: number, y: number, r: number) {
  const d = ellipse(x, y, r, r)
  let dots = ''
  for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) {
    const px = (i + (j % 2 ? 0.5 : 0)) * 0.23, py = j * 0.21, rr = Math.hypot(px, py)
    if (rr > 0.92) continue
    const sq = Math.sqrt(1 - rr * rr)
    dots += `<ellipse cx="${f(x + px * r)}" cy="${f(y + py * r)}" rx="${f(r * 0.06 * (0.4 + sq * 0.6))}" ry="${f(r * 0.06)}" transform="rotate(${f((Math.atan2(py, px) * 180) / Math.PI)} ${f(x + px * r)} ${f(y + py * r)})" fill="${P.sky2}" opacity="${f(0.4 + (1 - sq) * 0.5)}"/>`
  }
  return (
    k.draw([{ d, fill: P.white, inner: dots + k.shade(d, k.rad(P.blue, 0.32, 0.28, 0.85, 0, 0.9), P.blue, 0.4) }], f(Math.min(0.7, 0.25 + r * 0.06))) +
    `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.42)}" rx="${f(r * 0.24)}" ry="${f(r * 0.13)}" fill="#fff" opacity=".95" transform="rotate(-38 ${f(x - r * 0.4)} ${f(y - r * 0.42)})"/>`
  )
}

/** Tee de madera con la copa en (x,y). */
function tee(k: Kit, x: number, y: number, s = 1, c = P.red) {
  const d = `M${f(x - 3 * s)} ${y}H${f(x + 3 * s)}C${f(x + 2.4 * s)} ${f(y + 1.6 * s)} ${f(x + 1 * s)} ${f(y + 2 * s)} ${f(x + 0.8 * s)} ${f(y + 3 * s)}L${f(x + 0.3 * s)} ${f(y + 10 * s)}L${x} ${f(y + 11 * s)}L${f(x - 0.3 * s)} ${f(y + 10 * s)}L${f(x - 0.8 * s)} ${f(y + 3 * s)}C${f(x - 1 * s)} ${f(y + 2 * s)} ${f(x - 2.4 * s)} ${f(y + 1.6 * s)} ${f(x - 3 * s)} ${y}Z`
  return k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.4)
}

/** Green visto de costado: una loma elíptica con el corte del pasto y el hoyo en (hx,hy). */
function green(k: Kit, cx: number, cy: number, rx: number, ry: number, hole?: [number, number]) {
  const d = ellipse(cx, cy, rx, ry)
  let stripes = ''
  for (let i = -6; i <= 6; i++) stripes += `<path d="M${f(cx + i * 8)} ${f(cy - ry)}L${f(cx + i * 8 + 10)} ${f(cy + ry)}H${f(cx + i * 8 + 14)}L${f(cx + i * 8 + 4)} ${f(cy - ry)}Z" fill="#fff" opacity=".08"/>`
  return (
    k.draw([{ d, fill: GREEN, inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, GREEN_D, 0.5) + stripes + `<path d="${ellipse(cx - rx * 0.2, cy - ry * 0.35, rx * 0.55, ry * 0.3)}" fill="${GREEN_L}" opacity=".5"/>` }], 0.6) +
    (hole ? `<ellipse cx="${hole[0]}" cy="${hole[1]}" rx="3.4" ry="1.2" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="M${f(hole[0] - 3)} ${f(hole[1] - 0.2)}A3.4 1.2 0 0 1 ${f(hole[0] + 3)} ${f(hole[1] - 0.2)}" fill="none" stroke="#fff" stroke-width=".5"/>` : '')
  )
}

/** Asta con bandera triangular numerada: la base en (x,y), el tope en y-h. */
function bandera(k: Kit, x: number, y: number, h: number, num = '', c = P.red, wave = 0) {
  const top = y - h
  const flag = `M${f(x + 0.6)} ${f(top + 0.6)}C${f(x + 6)} ${f(top + 1.6 + wave)} ${f(x + 11)} ${f(top + 3.4 - wave)} ${f(x + 15)} ${f(top + 5.6)}C${f(x + 11)} ${f(top + 7.4 + wave)} ${f(x + 6)} ${f(top + 9.4 - wave)} ${f(x + 0.6)} ${f(top + 11)}Z`
  const pole = `M${f(x - 0.8)} ${f(top - 0.6)}H${f(x + 0.8)}V${y}H${f(x - 0.8)}Z`
  return (
    k.draw([
      { d: pole, fill: P.white, inner: `<path d="M${x} ${top}V${y}" stroke="${P.sky2}" stroke-width=".6"/>` + [0.2, 0.4, 0.6, 0.8].map((t) => `<path d="M${f(x - 0.8)} ${f(top + h * t)}h1.6v${f(h * 0.1)}h-1.6z" fill="${P.red}" opacity=".8"/>`).join('') },
      { d: flag, fill: c, inner: k.sh(flag, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + hair(x + 2, top + 3, x + 7, top + 4, x + 11, top + 5.4, 0.5, '#fff', 0.5) },
    ], 0.5) +
    (num ? `<text x="${f(x + 5.6)}" y="${f(top + 8)}" font-family="Georgia, serif" font-weight="700" font-size="5.4" fill="#fff" text-anchor="middle">${num}</text>` : '')
  )
}

/** Driver parado: la cabeza abajo en (0,0) mirando a la izquierda, la vara hacia arriba hasta y=-L. */
function driver(k: Kit, L: number, head = true) {
  const shaft = `M-.8 -6H.8L1.2 ${-L}H-1.2Z`
  const grip = `M-1.8 ${-L + 14}H1.8L2.1 ${-L}H-2.1Z`
  const club = 'M2 -7C-2 -8 -9 -7.4 -12.6 -4.6C-14.6 -3 -14.4 -.2 -12.4 .8C-8 2.4 -1 2.2 2.6 .4C3.8 -.4 4 -5 2 -7Z'
  return (
    k.draw([
      { d: shaft, fill: P.sky1, inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.8, P.blue, 0.5) },
      { d: grip, fill: P.night, inner: Array.from({ length: 6 }, (_, i) => `<path d="M-2 ${f(-L + 1.6 + i * 2.2)}l4 1.2" stroke="${P.mid}" stroke-width=".5"/>`).join('') },
      ...(head ? [{ d: club, fill: P.night, inner: k.sh(club, 0, 0, 1, 1, 0, 0.8, '#0F1736', 0.45) + `<path d="M-12 -3.6C-8 -6.2 -3 -6.6 1.6 -5.8" fill="none" stroke="${P.mid}" stroke-width=".8"/><path d="M-11.6 .2C-7 1.4 -1 1.2 2.4 0" stroke="${P.gold}" stroke-width=".5" fill="none"/>` }] : []),
    ], 0.55)
  )
}

/** Montañas con la nieve en la punta, de x0 a x1 sobre la línea y0. */
function andes(k: Kit, peaks: number[][], y0: number) {
  let d = `M0 ${y0}`
  peaks.forEach(([x, y]) => (d += `L${x} ${y}`))
  d += `L120 ${y0}V130H0Z`
  const snow = peaks.filter(([, y]) => y < y0 - 10).map(([x, y]) => `M${f(x - 6)} ${f(y + 6)}L${x} ${y}L${f(x + 6)} ${f(y + 6)}L${f(x + 3)} ${f(y + 5)}L${f(x + 1)} ${f(y + 7.4)}L${f(x - 2)} ${f(y + 5)}Z`).join('')
  return `<path d="${d}" fill="${P.mid}"/>` + k.clip(d, k.sh(d, 0, 0, 1, 1, 0, 0.8, P.ink, 0.4) + `<path d="${snow}" fill="${P.white}"/>` + k.sh(snow, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4)) +
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>`
}

export const GOLF_ART: Record<string, (u: number) => string> = {
  // ── Pajarero ──────────────────────────────────────────────────────

  // Tres birdies: cantan los pajaritos del hoyo 7. El gorrión cantando en la punta de la bandera del 7.
  'Gorrión del green': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 48, 14, 40, 28, false) +
      green(k, 60, 86, 40, 10, [56, 84]) +
      bandera(k, 56, 84, 36, '7', P.red, 0.8) +
      `<g transform="translate(56.6 47.4) scale(.95)">` + songbird(k, SPARROW(true)) + `</g>` +
      nota(38, 44, 0.8, -14) + nota(31, 58, 0.62, 10, true) +
      k.floor(76, 86, 4, 0.8, GREEN_D) +
      pelota(k, 76, 82.6, 3.6) +
      sparkle(84, 40, 1.8) + sparkle(30, 66, 1.4) +
      k.defs()
    )
  },

  // Quince birdies: hacés nido en el green. El nido de hornero en la punta del asta, con la pelotita de huevo.
  'Hornero del club': (u) => {
    const k = kit(u)
    const nest = 'M42 60C41.4 47 49.4 36.6 61 36.6C72.6 36.6 80.6 46.4 80 60C70 62.4 52 62.4 42 60Z'
    const door = 'M47.4 59.6V54C47.4 50.4 49.8 48.2 52.6 48.2C55.4 48.2 57.6 50.4 57.6 54V60.4C54.2 60.6 50.8 60.4 47.4 59.6Z'
    const lumps = [[52, 42, 2.4], [66, 41, 2], [74, 50, 1.8], [62, 54, 2.2], [70, 56, 1.6], [46, 52, 1.6], [58, 46, 1.4], [76, 57, 1.2]]
      .map(([x, y, r], i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.6)}" fill="${i % 3 ? MUD_D : MUD_L}" opacity=".55"/>`).join('')
    return (
      k.day() +
      k.sun(60, 50, 16, 46, 32, true) +
      green(k, 60, 92, 34, 7) +
      bandera(k, 61, 90, 24, '', P.red, 0.6) +
      `<g transform="translate(0 6)">` +
      k.floor(61, 61, 18, 1.8, MUD_D) +
      k.draw([{
        d: nest, fill: MUD,
        inner: k.sh(nest, 0, 0, 1, 1, 0, 0.9, MUD_D, 0.5) + `<path d="M40 34H50V62H40Z" fill="${k.lin(MUD_L, 0, 0, 1, 0, 0.6, 0)}"/>` + lumps +
          hair(54, 39.6, 61, 38.6, 68, 40.4, 0.6, MUD_D, 0.6) + hair(76, 46, 78, 52, 78.4, 58, 0.55, MUD_D, 0.7),
      }], 0.75) +
      k.draw([{ d: door, fill: '#2A1A0E' }], 0.55) +
      `<path d="M46.4 60V54C46.4 49.6 49.2 47 52.6 47C56 47 58.6 49.6 58.6 54V60.6" fill="none" stroke="${MUD_L}" stroke-width="1"/>` +
      pelota(k, 52.6, 57, 3.4) +
      `<g transform="translate(70 39.6) scale(.72)">` + songbird(k, HORNERO) + `</g>` +
      `</g>` +
      sparkle(32, 46, 1.8) + sparkle(86, 70, 1.5) +
      k.defs()
    )
  },

  // Cincuenta birdies: volás más alto que todos. El cóndor sobre los Andes, con la pelotita entre las garras.
  'Cóndor de los Andes': (u) => {
    const k = kit(u)
    const wingR = 'M2 -4C10 -10 22 -13 34 -11.4L37.6 -9.4L33.4 -7.6L37 -5.4L32.4 -4.4L35.4 -1.8L30.6 -1.2L32.6 1.6L27 1.2C20 2.2 10 3.4 2 4.6Z'
    const patch = 'M7 -1.4C15 -3 22 -3 27.6 -2.2L26.6 1.2C20 1.8 13 2.8 7 3.6Z'
    const body = ellipse(0, 2, 5, 9), ruff = ellipse(0, -5.4, 5, 2.6), head = 'M-2.4 -7C-2.8 -9.6 -2 -11.6 0 -11.6C2 -11.6 2.8 -9.6 2.4 -7Z'
    const tail = 'M-3.6 9L3.6 9L5 16L0 17L-5 16Z'
    const wing = (sx: number) => `<g transform="scale(${sx} 1)">` + k.draw([{ d: wingR, fill: P.night, inner: k.sh(wingR, 0, 0, 1, 1, 0, 0.6, '#0B1030', 0.4) + `<path d="${patch}" fill="${P.white}"/>` + k.sh(patch, 0, 0, 0, 1, 0, 0.6, P.sky2, 0.4) + hair(8, -4, 18, -7, 30, -8, 0.6, P.mid) + hair(10, -2, 20, -4, 28, -4.4, 0.5, P.mid) }], 0.6) + `</g>`
    return (
      k.day() +
      k.sun(60, 58, 16, 42, 32, true) +
      andes(k, [[14, 78], [30, 62], [40, 72], [54, 56], [66, 70], [78, 58], [92, 74], [106, 66]], 92) +
      `<g transform="translate(60 50) scale(.88)">` +
      wing(-1) + wing(1) +
      k.draw([
        { d: tail, fill: P.night },
        { d: body, fill: P.night, inner: k.sh(body, 0, 0, 1, 0, 0, 0.6, '#0B1030', 0.4) },
        { d: ruff, fill: P.white, inner: k.sh(ruff, 0, 0, 0, 1, 0, 0.6, P.sky2, 0.4) },
        { d: head, fill: '#C99A8A', inner: k.sh(head, 0, 0, 1, 0, 0, 0.6, P.wine, 0.4) },
      ], 0.5) +
      `<path d="M-.6 -11.4C0 -12.6 1 -12.6 1.4 -11.6" fill="none" stroke="${P.wine}" stroke-width=".6"/>` +
      `<path d="M-2.4 10.6L-2 13.4M2.4 10.6L2 13.4" stroke="${P.ink}" stroke-width=".9"/>` +
      `</g>` +
      pelota(k, 60, 66.4, 3.6) +
      `<path d="M56.6 63.8L57.6 65.8M63.4 63.8L62.4 65.8" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
      laurel(48, 100, 30, 94, 25, 70, 6) + laurel(72, 100, 90, 94, 95, 70, 6, true) +
      volutas(60, 98, 16, 0.4) +
      sparkle(32, 34, 2.2, P.goldL) + sparkle(88, 32, 2, P.goldL) + sparkle(76, 78, 1.4, '#fff') +
      k.defs()
    )
  },

  // ── Chaqueta verde ─────────────────────────────────────────────────

  // Tres vueltas: ya manejás el carrito sin chocar. El carrito eléctrico con su bolsa y la "L" de principiante.
  'Carrito eléctrico': (u) => {
    const k = kit(u)
    const body = 'M28 78V68C28 66.4 29 65.4 30.6 65.4H46L50 71H66L71 62H82C85 62 87 64 88 67L91 75C91.6 77 90.4 78.6 88 78.6H29Z'
    const roof = roundRect(28, 36, 86, 40, 1.6)
    const seatB = roundRect(46.4, 56, 51.4, 71, 1.4), seat = roundRect(48, 67.4, 66, 71, 1.4)
    const bag = 'M30.6 48C30.6 46.6 31.6 45.6 33 45.6H38.4C39.8 45.6 40.8 46.6 40.8 48V66H30.6Z'
    const wheel = (x: number) => `${ellipse(x, 79, 6, 6)} ${ellipse(x, 79, 3, 3)}`
    const plate = roundRect(88.6, 68, 95.2, 74.6, 0.8)
    const bolt = 'M66 72.6L72.4 72.6L69.6 75.4H73L66.4 80.4L68.4 76.6H65.4Z'
    return (
      k.day() +
      k.sun(60, 52, 14, 40, 28, false) +
      `<path d="M14 82C40 80 80 80 106 82V130H14Z" fill="${GREEN}"/>` + k.sh('M14 80H106V96H14Z', 0, 0, 0, 1, 0, 0.6, GREEN_D, 0.4) +
      `<path d="M20 90C44 88 76 88 100 90" fill="none" stroke="${GREEN_L}" stroke-width="2.4" opacity=".5"/>` +
      k.floor(60, 85, 32, 2, P.ink) +
      `<path d="M33 40V66M81 40V62" stroke="${P.ink}" stroke-width="2.2"/><path d="M33 40V66M81 40V62" stroke="${P.sky1}" stroke-width="1"/>` +
      k.draw([{ d: roof, fill: P.white, inner: k.sh(roof, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + [0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${30 + i * 8.4} 36H${34 + i * 8.4}V40H${30 + i * 8.4}Z" fill="${P.red}" opacity=".8"/>`).join('') }], 0.55) +
      k.draw([{ d: bag, fill: P.red, inner: k.sh(bag, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) + `<path d="M30.6 52H40.8M30.6 60H40.8" stroke="${P.white}" stroke-width=".8"/>` }], 0.5) +
      [[32.4, 43.6, -16], [35.8, 42.6, 6], [39, 44, 24]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d: 'M-1.2 3H1.2V0C1.2 -1 .6 -1.6 -.2 -1.6H-2.4C-3 -1.6 -3 -.6 -2.4 -.4L-1.2 0Z', fill: P.sky1 }], 0.35) + `</g>`).join('') +
      k.draw([
        { d: body, fill: P.white, inner: k.sh(body, 0, 0, 1, 1, 0, 0.75, P.blue, 0.4) + `<path d="M28 72.6H91" stroke="${P.mid}" stroke-width="1.2"/><path d="M28 74.2H91" stroke="${P.gold}" stroke-width=".5"/>` + hair(73, 63.4, 80, 63, 86, 65, 0.7, '#fff') },
        { d: seatB, fill: P.mid, inner: k.sh(seatB, 0, 0, 1, 0, 0, 0.7, P.ink, 0.4) },
        { d: seat, fill: P.mid, inner: k.sh(seat, 0, 0, 0, 1, 0, 0.7, P.ink, 0.4) },
      ], 0.6) +
      `<path d="M71 62L67.4 54" stroke="${P.ink}" stroke-width="1.4"/><ellipse cx="67" cy="53.6" rx="3" ry="1.2" transform="rotate(-24 67 53.6)" fill="none" stroke="${P.ink}" stroke-width="1.2"/>` +
      k.draw([{ d: bolt, fill: P.gold, inner: k.sh(bolt, 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) }], 0.35) +
      [42, 76].map((x) => `<path d="${wheel(x)}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.5 .6)"/><path d="${wheel(x)}" fill-rule="evenodd" fill="${P.night}" stroke="${P.ink}" stroke-width="1"/>` +
        `<circle cx="${x}" cy="79" r="3" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${x}" cy="79" r="1" fill="${P.blue}"/><path d="M${x - 4.4} 76A5 5 0 0 1 ${x - 1} 74.2" fill="none" stroke="${P.mid}" stroke-width=".6"/>`).join('') +
      `<path d="M88 68.4L90 66.4" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{ d: plate, fill: P.white }], 0.4) +
      `<text x="91.9" y="73.4" font-family="Georgia, serif" font-weight="700" font-size="5.4" fill="${P.red}" text-anchor="middle">L</text>` +
      rotulo(60, 31, 6.6, 'sin chocar', { rot: -4 }) +
      k.defs()
    )
  },

  // Diez victorias: el swing ya es de Ángel Cabrera. El driver con la funda tejida de pato, y la pelotita en el tee: ¡cuac!
  'Pato de Rosario': (u) => {
    const k = kit(u)
    const sock = 'M-6.6 -1C-7.4 7 -6.4 16 -4 26H4C6.4 16 7.4 7 6.6 -1Z'
    const head = 'M-7.4 -6C-7.4 -11.6 -3.8 -15 .6 -15C5.4 -15 8.4 -11.6 8.2 -6.6C8 -2.6 5.6 .4 .6 .4C-4.4 .4 -7.4 -2.4 -7.4 -6Z'
    const bill = 'M-6 -8.4C-10 -8.8 -14.2 -8 -16.2 -6C-16.6 -5 -15.8 -4.4 -14.6 -4.4C-11.2 -4.4 -8.2 -4 -6 -3.4Z'
    const ring = 'M-6.6 -1.6C-3 .2 3 .2 6.6 -1.6V1C3 2.8 -3 2.8 -6.6 1Z'
    const ribs = [-4.4, -2.2, 0, 2.2, 4.4].map((x) => `<path d="M${x} 2Q${x * 1.1} 14 ${f(x * 0.6)} 26" fill="none" stroke="${LANA_D}" stroke-width=".55"/>`).join('')
    return (
      k.day() +
      k.stage(60, 56, 34) +
      `<g transform="translate(57.6 46) rotate(12)">` +
      `<g transform="scale(1 -1)">` + driver(k, 46, false) + `</g>` +
      k.draw([
        { d: sock, fill: LANA, inner: k.sh(sock, 0, 0, 1, 0, 0, 0.8, LANA_D, 0.45) + ribs + `<path d="M-8 18H8V21H-8Z" fill="${P.mid}"/><path d="M-8 22.4H8V24H-8Z" fill="${P.gold}"/>` },
        { d: ring, fill: P.white },
        { d: head, fill: PATO, inner: k.sh(head, 0, 0, 1, 1, 0, 0.85, PATO_D, 0.5) + `<path d="M-6 -12H0V-2H-6Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` + hair(-4, -12.6, 0, -14.6, 5, -13, 0.7, '#9CC29C', 0.8) },
        { d: bill, fill: PICO, inner: k.sh(bill, 0, 0, 0, 1, 0, 0.8, PICO_D, 0.4) + `<path d="M-15.4 -5.4C-12 -6.2 -9 -6.2 -6.4 -5.6" fill="none" stroke="${PICO_D}" stroke-width=".4"/>` },
      ], 0.6) +
      eye(-2.4, -8.6, 1.1) +
      `</g>` +
      tee(k, 82, 82, 0.9) +
      k.floor(82, 92, 5, 0.9, P.mid) +
      pelota(k, 82, 78.2, 3.8) +
      rotulo(36, 48, 8, '¡cuac!', { rot: -10 }) +
      sparkle(84, 38, 2) + sparkle(36, 76, 1.4) +
      k.defs()
    )
  },

  // Treinta ganadas: te prueban la chaqueta verde. La chaqueta colgada en la soga del patio, con su perchita.
  'Augusta en el barrio': (u) => {
    const k = kit(u)
    const jacket = 'M60 40C53 40 46 41 40.4 43.2C36.6 44.6 35 47.6 34.6 51.4L32.4 86C32.4 87.6 33.6 88.6 35.2 88.6H84.8C86.4 88.6 87.6 87.6 87.6 86L85.4 51.4C85 47.6 83.4 44.6 79.6 43.2C74 41 67 40 60 40Z'
    const lining = 'M51.6 40.6L60 67L68.4 40.6C65.6 40.2 62.8 40 60 40C57.2 40 54.4 40.2 51.6 40.6Z'
    const lapL = 'M51.6 40.6L60 67L55 59.4L50.6 49.6L53.4 47.4L48.4 42Z', lapR = 'M68.4 40.6L60 67L65 59.4L69.4 49.6L66.6 47.4L71.6 42Z'
    const sleeveSeam = 'M41 46C40 60 39.4 74 39.4 86M79 46C80 60 80.6 74 80.6 86'
    const pin = (x: number, y: number) => `<g transform="translate(${x} ${y})">` + k.draw([{ d: 'M-1.2 -3H1.2L.9 4H-.9Z', fill: '#D9B98A', inner: `<path d="M-1.2 0H1.2" stroke="${P.brownD}" stroke-width=".4"/>` }], 0.35) + `</g>`
    return (
      k.day() +
      k.sun(60, 58, 18, 46, 32, true) +
      `<path d="M10 30Q60 38 110 30" fill="none" stroke="${P.ink}" stroke-width="1.2"/><path d="M10 30Q60 38 110 30" fill="none" stroke="${P.paper}" stroke-width=".5"/>` +
      pin(34, 32) + pin(86, 32) +
      `<path d="M60 40V36.4C60 34.6 58.4 33.2 57.4 34.2" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M60 40V36.4C60 34.6 58.4 33.2 57.4 34.2" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M40 44.6L60 40L80 44.6" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M40 44.6L60 40L80 44.6" fill="none" stroke="${P.brown}" stroke-width="1"/>` +
      k.cast([jacket], 2.4, 2.2, P.blue) +
      k.draw([{
        d: jacket, fill: SACO,
        inner: k.sh(jacket, 0, 0, 1, 0, 0, 0.75, SACO_D, 0.5) + `<path d="M30 40H46V90H30Z" fill="${k.lin(SACO_L, 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="${lining}" fill="${P.goldL}"/>` + k.sh(lining, 0, 0, 0, 1, 0.6, 0, P.goldD, 0.4) + `<path d="M56 40.4L60 52L64 40.4" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
          `<path d="${sleeveSeam}" fill="none" stroke="${SACO_D}" stroke-width=".7"/>` +
          `<path d="M60 67V88.6" stroke="${SACO_D}" stroke-width=".7"/>` +
          `<path d="M42 78H52M68 78H78" stroke="${SACO_D}" stroke-width="1"/><path d="M42 77.4H52M68 77.4H78" stroke="${SACO_L}" stroke-width=".4"/>` +
          `<path d="M66.6 56H74.6" stroke="${SACO_D}" stroke-width=".9"/>` +
          hair(36, 52, 35.6, 68, 35, 84, 0.7, SACO_L, 0.7),
      }], 0.7) +
      k.draw([
        { d: lapL, fill: SACO, inner: k.sh(lapL, 1, 0, 0, 1, 0, 0.7, SACO_D, 0.45) + hair(52, 43, 55, 52, 58.6, 62, 0.5, SACO_L, 0.8) },
        { d: lapR, fill: SACO, inner: k.sh(lapR, 0, 0, 1, 1, 0, 0.8, SACO_D, 0.45) },
      ], 0.4) +
      `<g transform="translate(70.6 52.6)">` + `<path d="M0 -4V1.6" stroke="${P.goldL}" stroke-width=".5"/><path d="M0 -4L3.4 -2.8L0 -1.6Z" fill="${P.gold}"/><path d="${ellipse(0, 1.8, 2.2, 0.7)}" fill="${P.goldD}"/>` + `</g>` +
      [70, 76.6].map((y) => `<circle cx="61.8" cy="${y}" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="61.4" cy="${y - 0.4}" r=".5" fill="${P.goldL}"/>`).join('') +
      [[44, 86.6], [50, 86.6], [70, 86.6], [76, 86.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      laurel(48, 100, 28, 92, 25, 62, 6) + laurel(72, 100, 92, 92, 95, 62, 6, true) +
      volutas(60, 97, 17, 0.4) +
      sparkle(30, 44, 2, P.goldL) + sparkle(90, 48, 2, P.goldL) + sparkle(54, 58, 1.2, '#fff') +
      k.defs()
    )
  },
}
