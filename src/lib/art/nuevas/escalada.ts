// Escalada (boulder), en clave heroica. Los objetos del muro: las presas de colores atornilladas al panel con sus
// tuercas, la bolsa de magnesio con su polvo, las huellas blancas, la lagartija, la araña con su tela, el rayo del
// flash, el libro de vías y el Fitz Roy hecho muro de interior.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Panel de terciado del muro, con su sombra. */
const PLY = '#E6CFA4', PLY_D = '#B8935C'
/** Granito del Fitz Roy. */
const ROCK = '#9AA6C6', ROCK_D = '#5F6C96'
/** Verde de la lagartija, con sus manchas. */
const LIZ = '#8DA453', LIZ_D = '#5E7434', LIZ_L = '#C4D392'

// ── Presas ──────────────────────────────────────────────────────────────────────────────────────────

const HOLDS = [
  'M-6 -2C-6.4 -5.4 -3 -6.6 0 -6.4C3.6 -6.2 6.6 -4.4 6.4 -1C6.2 2.4 4 4.6 0 4.8C-3.6 5 -5.8 2.2 -6 -2Z',
  'M-8 1C-7 -2.6 -2 -4 2.6 -3.8C6.4 -3.6 8.6 -1.6 8 1C7.4 3 4 3.6 0 3.6C-4 3.6 -8.4 3.4 -8 1Z',
  'M-5.6 4.4C-6.6 2 -3 -5.6 0 -6.4C2.6 -7 6.6 1.4 5.8 4C5 5.8 -4.6 6.4 -5.6 4.4Z',
  'M-6.6 -3C-5 -6.4 2 -7 5.4 -4.6C7.6 -3 7 1 5.6 3.4C4 6 -1.4 6.4 -4.4 4.6C-7 3 -7.6 -.8 -6.6 -3Z',
]
const DARK: Record<string, string> = { [P.red]: P.wine, [P.gold]: P.goldD, [P.green]: P.greenD, [P.sky]: P.blue, [P.mid]: P.night, [P.white]: P.blue, [P.brown]: P.brownD }

/** Presa atornillada: forma `shape`, color `c`, centrada en (x,y), con su tuerca y su labio. */
function hold(k: Kit, x: number, y: number, s: number, c: string, shape = 0, rot = 0, lip = true) {
  const d = HOLDS[shape % HOLDS.length], dk = DARK[c] ?? P.mid
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([{
      d, fill: c,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, dk, 0.5) + `<path d="M-9 -8H9V-2.6C3 -1.2 -3 -1.2 -9 -2.6Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` +
        (lip ? `<path d="M-4.6 2C-2 3.4 2 3.4 4.6 1.8" fill="none" stroke="${dk}" stroke-width=".55"/>` : ''),
    }], f(0.6 / s)) +
    `<circle cx="0" cy="-.6" r="1.25" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/><path d="M-.6 -.6H.6" stroke="${P.mid}" stroke-width=".5"/>` +
    `</g>`
  )
}

/** Panel de muro: terciado con la grilla de tuercas, recortado a `d`. */
function panel(k: Kit, d: string, x0: number, y0: number, x1: number, y1: number, step = 7) {
  let nuts = ''
  for (let y = y0 + step / 2; y < y1; y += step) for (let x = x0 + step / 2 + ((y - y0) / step % 2 ? step / 2 : 0); x < x1; x += step) nuts += `<circle cx="${f(x)}" cy="${f(y)}" r=".55" fill="${PLY_D}"/>`
  return k.draw([{ d, fill: PLY, inner: nuts + k.sh(d, 0, 0, 1, 1, 0, 0.7, PLY_D, 0.4) + `<path d="M${x0} ${f((y0 + y1) / 2)}H${x1}M${f((x0 + x1) / 2)} ${y0}V${y1}" stroke="${PLY_D}" stroke-width=".4" opacity=".7"/>` }], 0.7)
}

/** Huella de mano con magnesio (mano derecha, dedos hacia arriba), centrada en la palma. */
function handprint(k: Kit, x: number, y: number, s: number, rot: number, op = 0.85) {
  const fingers: [number, number, number, number, number][] = [[-3.4, -6.6, 1.2, 2.8, -12], [-1.1, -7.6, 1.25, 3.2, -4], [1.3, -7.4, 1.2, 3.1, 4], [3.5, -6.2, 1.05, 2.6, 12], [5.6, -.6, 1.15, 2.6, 52]]
  const d = ellipse(0, 0, 4.4, 4.8) + fingers.map(([fx, fy, rx, ry]) => ellipse(fx, fy, rx, ry)).join('')
  const g = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`
  return (
    g + `<path d="${ellipse(0, 0, 4.4, 4.8)}" fill="${P.white}" opacity="${op}"/>` +
    fingers.map(([fx, fy, rx, ry, r]) => `<ellipse cx="${fx}" cy="${fy}" rx="${rx}" ry="${ry}" fill="${P.white}" opacity="${op}" transform="rotate(${r} ${fx} ${fy})"/>`).join('') +
    `</g>` + g + k.shade(d, k.rad('#ffffff', 0.5, 0.5, 0.6, 0.9, 0.2), '#ffffff', 0.2) + `</g>`
  )
}

// ── La bolsa de magnesio ─────────────────────────────────────────────────────────────────────────────

const BAG = 'M-11 -8C-12.8 -2 -13.6 6 -11.8 11.4C-10.4 15 -6 16 0 16C6 16 10.4 15 11.8 11.4C13.6 6 12.8 -2 11 -8Z'
const RIM = ellipse(0, -8.4, 12.4, 4)

function chalkBag(k: Kit) {
  const chalk = 'M-9.6 -8.4C-7 -12 -3 -12.6 0 -11.4C3 -12.8 7.4 -12 9.6 -8.4C4 -6.4 -4 -6.4 -9.6 -8.4Z'
  const brush = 'M9.6 -2.4L16.4 -16.6C17 -17.8 18.6 -17.4 18.4 -16L13 -1.2Z'
  const bristles = 'M16.2 -16.6L14.6 -22.4C15.6 -23.6 18 -23.8 19.4 -22.8L18.6 -16Z'
  const cord = 'M-3 -6.4C-4 -2 -2.4 1.6 -4.6 5.4M-1 -6.4C.4 -2.4 -.4 1 1.4 4.6'
  return (
    k.draw([
      { d: bristles, fill: P.white, inner: `<path d="M15.6 -22L16.8 -16.4M17.2 -22.6L17.8 -16.2M18.6 -22.6L18.6 -16.2" stroke="${P.sky}" stroke-width=".4"/>` },
      { d: brush, fill: P.gold, inner: k.sh(brush, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) },
    ], 0.5) +
    k.draw([
      {
        d: BAG, fill: P.red,
        inner: k.sh(BAG, 0, 0, 1, 0, 0, 0.85, P.wine, 0.5) + k.sh('M-14 8H14V16H-14Z', 0, 0, 0, 1, 0, 0.6, P.wine, 0.4) +
          `<path d="M-14 -8H-5V16H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          `<path d="M7 -6.6L12 -6.6L11.4 8C10 8.6 8.4 8.6 7.2 8Z" fill="${P.wine}" opacity=".55"/>` +
          hair(-7, -4, -8.4, 3, -7.4, 12, 0.7, P.wine, 0.8) + hair(3, -3, 4.4, 4, 3.6, 13, 0.6, P.wine, 0.8) + hair(-1, 7, 1, 10, 0, 14, 0.5, P.wine, 0.7) +
          `<path d="M-10.6 12.4C-4 14.4 4 14.4 10.6 12.4" fill="none" stroke="${P.wine}" stroke-width=".5" stroke-dasharray=".9 .7"/>`,
      },
      { d: RIM, fill: P.white, inner: `<path d="${ellipse(0, -8.4, 10.4, 2.8)}" fill="${P.sky1}"/>` + k.sh(RIM, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + Array.from({ length: 14 }, (_, i) => `<circle cx="${f(-11 + i * 1.7)}" cy="${f(-6.2 + Math.sin(i) * 0.4)}" r=".5" fill="${P.sky2}"/>`).join('') },
    ], 0.75) +
    k.draw([{ d: chalk, fill: P.white, inner: k.sh(chalk, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) }], 0.35) +
    `<path d="${cord}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${cord}" fill="none" stroke="${P.white}" stroke-width=".6" stroke-linecap="round"/>` +
    k.draw([{ d: roundRect(-3.6, 2.6, .4, 7, 1.2), fill: P.night, inner: `<path d="M-2.6 4H-.6" stroke="${P.mid}" stroke-width=".5"/>` }], 0.4)
  )
}

/** Nube de polvo de magnesio: bollos blancos con grano. */
function dust(k: Kit, x: number, y: number, r: number) {
  const balls: [number, number, number][] = [[-0.55, 0.18, 0.5], [0.5, 0.22, 0.48], [-0.15, -0.3, 0.62], [0.42, -0.2, 0.44], [0.05, 0.3, 0.52]]
  return balls.map(([dx, dy, rr]) => {
    const d = ellipse(f(x + dx * r), f(y + dy * r), f(rr * r), f(rr * r))
    return `<path d="${d}" fill="${P.white}" opacity=".85"/>` + k.shade(d, k.rad(P.sky2, 0.4, 0.4, 0.6, 0, 0.9), P.sky2, 0.3)
  }).join('')
}

// ── La lagartija: vista desde arriba, la cabeza hacia arriba ─────────────────────────────────────────

function lizard(k: Kit) {
  const body = 'M0 -12C3 -12 4.4 -8 4.2 -3C4 3 3.4 8 0 10C-3.4 8 -4 3 -4.2 -3C-4.4 -8 -3 -12 0 -12Z'
  const head = 'M0 -24C2.8 -24 4.6 -21.4 4.4 -18C4.2 -15 3 -12.6 0 -12C-3 -12.6 -4.2 -15 -4.4 -18C-4.6 -21.4 -2.8 -24 0 -24Z'
  const tail = taper(0, 8, 2, 20, -10, 28, 4.6, 0.6)
  const leg = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
    const d = taper(x0, y0, cx, cy, x1, y1, 2.6, 1.6)
    const a = Math.atan2(y1 - cy, x1 - cx)
    const toes = [-0.9, -0.3, 0.3, 0.9].map((o) => {
      const tx = x1 + Math.cos(a + o) * 3, ty = y1 + Math.sin(a + o) * 3
      return taper(x1, y1, (x1 + tx) / 2, (y1 + ty) / 2, tx, ty, 0.9, 0.8) + ellipse(f(tx), f(ty), 0.8, 0.8)
    }).join('')
    return d + toes
  }
  const legs = leg(3, -9, 9, -12, 11, -17) + leg(-3, -9, -9, -11, -12, -16) + leg(3, 6, 9, 6, 11, 12) + leg(-3, 6, -9, 8, -11, 13)
  const spots = [[-1.4, -7, 0.9], [1.6, -4, 0.8], [-1.2, 0, 0.9], [1.4, 3.6, 0.8], [0, 7, 0.7], [0.6, 13, 0.7], [-1.6, 18.4, 0.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${LIZ_D}"/>`).join('')
  return (
    k.draw([
      { d: tail, fill: LIZ, inner: k.sh(tail, 0, 0, 1, 1, 0, 0.8, LIZ_D, 0.45) },
      { d: legs, fill: LIZ, inner: k.sh(legs, 0, 0, 1, 1, 0, 0.6, LIZ_D, 0.4) },
      { d: body, fill: LIZ, inner: `<path d="M-1.2 -12H1.2V10H-1.2Z" fill="${LIZ_L}" opacity=".7"/>` + k.sh(body, 0, 0, 1, 0, 0, 0.8, LIZ_D, 0.45) },
      { d: head, fill: LIZ, inner: k.sh(head, 0, 0, 1, 0, 0, 0.8, LIZ_D, 0.45) + hair(-2.6, -20, -1.8, -22.6, 0, -23, 0.6, LIZ_L) },
    ], 0.6) +
    spots +
    `<circle cx="-2.6" cy="-18.4" r=".9" fill="${P.night}"/><circle cx="2.6" cy="-18.4" r=".9" fill="${P.night}"/>` +
    `<circle cx="-2.9" cy="-18.7" r=".3" fill="#fff"/><circle cx="2.3" cy="-18.7" r=".3" fill="#fff"/>` +
    hair(-2, -11, -2.6, -2, -1.6, 8, 0.6, '#fff', 0.6)
  )
}

// ── La araña ─────────────────────────────────────────────────────────────────────────────────────────

function spider(k: Kit, body = P.night, mark = P.gold) {
  const abd = ellipse(0, 5, 6.4, 7.6)
  const ceph = ellipse(0, -4.4, 4.2, 4)
  const legPts: [number, number, number, number, number, number][] = [
    [3, -6, 10, -14, 14, -8], [3.6, -4, 13, -6, 17, 1], [3.6, -2.4, 12, 2, 15, 9], [3, -1, 9, 7, 11, 15],
  ]
  const legs = legPts.flatMap(([x0, y0, kx, ky, x1, y1]) => [
    `M${x0} ${y0}L${kx} ${ky}L${x1} ${y1}`, `M${-x0} ${y0}L${-kx} ${ky}L${-x1} ${y1}`,
  ]).join('')
  return (
    `<path d="${legs}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${legs}" fill="none" stroke="${body}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>` +
    legPts.map(([, , kx, ky]) => `<circle cx="${kx}" cy="${ky}" r=".7" fill="${mark}"/><circle cx="${-kx}" cy="${ky}" r=".7" fill="${mark}"/>`).join('') +
    k.draw([
      { d: abd, fill: body, inner: k.sh(abd, 0, 0, 1, 1, 0, 0.8, '#0B1030', 0.5) + `<path d="${starPath(0, 5, 3.6, 1.4, 4)}" fill="${mark}"/><path d="M-3 0C-1 -1.6 1 -1.6 3 0" fill="none" stroke="${mark}" stroke-width=".5"/>` + `<ellipse cx="-2.6" cy="1.6" rx="1.6" ry="1" fill="#fff" opacity=".4" transform="rotate(-30 -2.6 1.6)"/>` },
      { d: ceph, fill: body, inner: k.sh(ceph, 0, 0, 1, 1, 0, 0.8, '#0B1030', 0.5) },
    ], 0.6) +
    [[-1.4, -6], [1.4, -6], [-2.4, -5], [2.4, -5]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i < 2 ? 0.7 : 0.45}" fill="${mark}"/>`).join('')
  )
}

/** Tela de araña: radios desde (cx,cy) y vueltas en espiral. */
function web(cx: number, cy: number, R: number, n = 12, rings = 6, c = P.sky1) {
  let d = ''
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; d += `M${cx} ${cy}L${f(cx + Math.cos(a) * R)} ${f(cy + Math.sin(a) * R)}` }
  for (let r = 1; r <= rings; r++) {
    const rr = (R * r) / (rings + 0.4)
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2, sag = rr * 0.86
      d += `M${f(cx + Math.cos(a0) * rr)} ${f(cy + Math.sin(a0) * rr)}Q${f(cx + Math.cos(am) * sag)} ${f(cy + Math.sin(am) * sag)} ${f(cx + Math.cos(a1) * rr)} ${f(cy + Math.sin(a1) * rr)}`
    }
  }
  return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width=".9" opacity=".6"/><path d="${d}" fill="none" stroke="${c}" stroke-width=".4"/>`
}

// ── El rayo del flash ────────────────────────────────────────────────────────────────────────────────

const BOLT = 'M3 -20L-9 2H-1.6L-5.4 20L9.4 -4.4H1.8L7.4 -20Z'

// ── El Fitz Roy: las agujas, con la base a y=0 ───────────────────────────────────────────────────────

const FITZ = 'M-38 0L-30 -16L-24 -20L-20 -30L-15 -27L-10 -44L-6 -38L0 -62L5 -46L9 -50L13 -33L17 -36L22 -22L28 -18L38 0Z'
const SNOW = 'M-3.2 -50.6L0 -62L3.4 -52.4L1.4 -53.4L.2 -50.8L-1.6 -53ZM-11.8 -38L-10 -44L-7.6 -40.4L-9 -40.8L-10 -38.6ZM7.6 -45.6L9 -50L10.8 -44L9.4 -45ZM-21.4 -27.4L-20 -30L-17.6 -28.6Z'
const GOAT = 'M-6 -8C-4 -9 2 -9 5 -8.6C6.6 -8.4 7.6 -9.4 8 -10.4L8.6 -9.4C8.4 -8 7.8 -7 7.4 -6.2C7.6 -4.6 7.2 -3.4 6.6 -2.8L6.8 0H5.6L5.2 -2.6C4.4 -2.4 3.6 -2.4 3.2 -2.6L3 0H1.8L1.8 -3.2C-.6 -3 -2.8 -3 -4.4 -3.4L-4.6 0H-5.8L-6 -3.6C-6.6 -3.6 -7 -3.8 -7.2 -4.2L-7.4 0H-8.6L-8.4 -5.2' +
  'C-8.8 -6 -8.6 -7 -8.2 -7.6C-9.6 -8.6 -10.4 -10.4 -10.6 -12.2C-11.2 -12.4 -12 -12.8 -12.6 -13.6C-13 -14.6 -12.4 -15.4 -11.4 -15.6C-10.4 -15.8 -9.4 -15.4 -8.8 -14.6C-8 -13.6 -7.6 -11.8 -7.6 -10.4C-7.2 -9.4 -6.8 -8.6 -6 -8Z'

export const ESCALADA_ART: Record<string, (u: number) => string> = {
  // ── Encadenador ───────────────────────────────────────────────────

  // Cinco bloques: la bolsa de magnesio largando polvo, y el muro lleno de huellas blancas.
  'Manos de magnesio': (u) => {
    const k = kit(u)
    const wall = roundRect(26, 22, 94, 92, 4)
    return (
      k.day() +
      k.stage(60, 58, 35) +
      k.cast([wall], 2, 2.4) +
      panel(k, wall, 26, 22, 94, 92) +
      hold(k, 38, 34, 0.9, P.sky, 1, -10) + hold(k, 82, 40, 0.85, P.green, 3, 20) + hold(k, 36, 62, 0.8, P.gold, 2, 0) + hold(k, 84, 66, 0.8, P.mid, 0, 0) +
      handprint(k, 48, 34, 1.1, -14) + handprint(k, 72, 30, 1, 16) + handprint(k, 33, 47, 0.9, -30, 0.7) + handprint(k, 86, 53, 0.9, 26, 0.7) +
      handprint(k, 40, 76, 0.8, -8, 0.6) + handprint(k, 80, 80, 0.8, 18, 0.6) +
      dust(k, 54, 54, 9) + dust(k, 66, 50, 7) +
      k.floor(60, 92, 18, 2.4, P.mid) +
      `<g transform="translate(60 74) rotate(-6) scale(1.02)">` + k.cast([BAG, RIM], 2, 2) + chalkBag(k) + `</g>` +
      [[48, 46], [72, 44], [56, 42], [64, 40]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.white}" stroke="${P.sky2}" stroke-width=".2"/>`).join('') +
      sparkle(88, 30, 1.8) + sparkle(30, 88, 1.4) +
      k.defs()
    )
  },

  // Diez bloques: la lagartija pegada al muro, con una pata en cada presa.
  'Lagartija': (u) => {
    const k = kit(u)
    const wall = 'M30 18L94 30L90 96L26 88Z'
    return (
      k.day() +
      k.sun(60, 58, 15, 46, 32, false) +
      k.cast([wall], 2.4, 2.4) +
      panel(k, wall, 26, 18, 94, 96, 7.4) +
      hold(k, 72.4, 37.6, 0.7, P.red, 0, 30) + hold(k, 46, 39.6, 0.7, P.sky, 3, -20) + hold(k, 74, 69.6, 0.7, P.gold, 2, 10) + hold(k, 46, 73.4, 0.7, P.mid, 0, -10) +
      hold(k, 36, 56, 0.8, P.green, 1, 70) + hold(k, 84, 54, 0.6, P.white, 3, 0) +
      `<g transform="translate(60 60) rotate(12) scale(1.32)">` + k.cast(['M0 -24C4 -24 5 -16 4 0C3.4 8 0 10 0 10C0 10 -3.4 8 -4 0C-5 -16 -4 -24 0 -24Z'], 1.4, 1.6, PLY_D) + lizard(k) + `</g>` +
      hair(32, 26, 30, 30, 32, 34, 0.6, P.mid) + hair(88, 86, 90, 82, 88, 78, 0.6, P.mid) +
      sparkle(90, 22, 1.8) + sparkle(28, 92, 1.4) +
      k.defs()
    )
  },

  // Veinte bloques: de noche, la araña dorada colgada de su hilo, con la tela tejida entre las presas.
  'Hombre araña del muro': (u) => {
    const k = kit(u)
    return (
      k.night() +
      [[30, 32], [92, 36], [26, 60], [96, 66], [44, 22], [78, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 58, 32, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.45, 0), P.goldL, 0.35) +
      web(60, 46, 36, 14, 7) +
      laurel(48, 100, 28, 92, 26, 64, 8) + laurel(72, 100, 92, 92, 94, 64, 8, true) +
      hold(k, 36, 40, 0.85, P.red, 0, -20) + hold(k, 85, 42, 0.8, P.sky, 3, 20) + hold(k, 40, 78, 0.8, P.green, 2, 0) + hold(k, 82, 76, 0.85, P.white, 1, -14) +
      `<path d="M60 18V54" stroke="${P.ink}" stroke-width="1.2"/><path d="M60 18V54" stroke="${P.white}" stroke-width=".5"/>` +
      k.shade(ellipse(61, 64, 14, 14), k.rad(P.gold, 0.5, 0.5, 0.5, 0.6, 0), P.gold, 0.3) +
      `<g transform="translate(60 62) scale(1.4)">` + spider(k, P.gold, P.night) + `</g>` +
      `<path d="M55.4 64.6C57 62.6 59 62 60.4 62.2" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>` +
      sparkle(46, 54, 2.2, P.goldL) + sparkle(78, 60, 1.8, P.goldL) + sparkle(70, 88, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Flash ─────────────────────────────────────────────────────────

  // Cinco de una: la presa partida por el rayo del flash. Ni lo pensaste.
  'A la primera': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<g transform="rotate(-6 60 60)">` + panel(k, roundRect(32, 34, 88, 90, 3), 32, 34, 88, 90, 7) + `</g>` +
      k.shade(ellipse(60, 58, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      `<g transform="translate(55 70) rotate(-10) scale(2.7)">` + k.cast([HOLDS[0]], 0.8, 0.8, PLY_D) + `</g>` +
      hold(k, 53, 68, 2.7, P.green, 0, -10, false) +
      `<g transform="translate(53 68) rotate(-10) scale(2.7)"><path d="M-4.4 -3.6C-2 -2 2.4 -2.2 4.6 -3.8C3.8 -5.4 -3.6 -5.6 -4.4 -3.6Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".2"/><path d="M-4 -3.4C-2 -2.4 2.2 -2.4 4.2 -3.6" fill="none" stroke="${LIZ_L}" stroke-width=".25"/>` +
      Array.from({ length: 18 }, (_, i) => `<circle cx="${f(-4.6 + (i % 6) * 1.8)}" cy="${f(-4.4 + Math.floor(i / 6) * 2.4 + (i % 2) * 0.6)}" r=".14" fill="${P.greenD}"/>`).join('') + `</g>` +
      `<g transform="translate(70 47) rotate(12) scale(.9)">` + k.cast([BOLT], 1.6, 1.6, P.mid) +
      k.draw([{ d: BOLT, fill: P.gold, inner: k.sh(BOLT, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.5) + `<path d="M3 -20L-9 2H-5L4.6 -20Z" fill="${P.goldL}"/>` }], 0.7) + `</g>` +
      [[-160, 30], [-120, 28], [180, 30], [20, 30], [150, 28]].map(([a, r]) => {
        const rad = (a * Math.PI) / 180, x0 = 60 + Math.cos(rad) * (r - 8), y0 = 58 + Math.sin(rad) * (r - 8), x1 = 60 + Math.cos(rad) * r, y1 = 58 + Math.sin(rad) * r
        return hair(f(x0), f(y0), f((x0 + x1) / 2), f((y0 + y1) / 2), f(x1), f(y1), 1, P.goldD)
      }).join('') +
      `<text x="43" y="36" ${GEORGIA} font-style="italic" font-weight="700" font-size="6.2" fill="${P.ink}" text-anchor="middle" transform="rotate(-12 43 36)">¡de una!</text>` +
      sparkle(86, 46, 2) + sparkle(84, 78, 1.4) +
      k.defs()
    )
  },

  // Veinticinco flashes: el libro abierto con el muro en las páginas y la vía marcada, paso por paso.
  'Lectura de vía': (u) => {
    const k = kit(u)
    const cover = 'M24 50C36 46 50 47 60 52C70 47 84 46 96 50V90C84 86 70 87 60 92C50 87 36 86 24 90Z'
    const left = 'M27 46C38 42.6 51 44 60 49V88C51 83.6 38 82.6 27 86Z'
    const right = 'M93 46C82 42.6 69 44 60 49V88C69 83.6 82 82.6 93 86Z'
    const lines = (sx: number) => Array.from({ length: 6 }, (_, i) => `M${60 + sx * 8} ${f(56 + i * 5)}Q${60 + sx * 19} ${f(52.6 + i * 5)} ${60 + sx * 29} ${f(53.6 + i * 5)}`).join('')
    const route = 'M70 82C68 76 76 72 74 66C72 60 80 58 78 52'
    return (
      k.day() +
      k.sun(60, 54, 14, 44, 32, false) +
      k.shade(ellipse(60, 56, 26, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(60, 92, 34, 3, P.mid) +
      k.cast([cover], 2, 2.2) +
      k.draw([{ d: cover, fill: P.red, inner: k.sh(cover, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) }], 0.75) +
      k.draw([
        { d: left, fill: P.white, inner: k.sh(left, 1, 0, 0, 0, 0, 0.6, P.sky2, 0.45) + `<path d="${lines(-1)}" fill="none" stroke="${P.sky}" stroke-width=".7"/>` },
        { d: right, fill: PLY, inner: k.sh(right, 0, 0, 1, 0, 0, 0.6, PLY_D, 0.45) + Array.from({ length: 16 }, (_, i) => `<circle cx="${f(64 + (i % 4) * 7)}" cy="${f(52 + Math.floor(i / 4) * 9 + (i % 4) * -0.6)}" r=".5" fill="${PLY_D}"/>`).join('') },
      ], 0.55) +
      `<path d="M60 49V88" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="${route}" fill="none" stroke="${P.ink}" stroke-width="1.3" stroke-dasharray="1.6 1.2" stroke-linecap="round"/>` +
      hold(k, 70, 82, 0.5, P.red, 0) + hold(k, 75, 72, 0.45, P.red, 1, 10) + hold(k, 73, 63, 0.45, P.red, 2) + hold(k, 79, 54, 0.5, P.red, 3) +
      hold(k, 85, 66, 0.4, P.sky, 0) + hold(k, 66, 58, 0.4, P.green, 2) +
      `<path d="M31 56H40M31 60H44M31 64H38" stroke="${P.ink}" stroke-width=".6"/>` +
      `<text x="43.6" y="73.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="6" fill="${P.ink}" text-anchor="middle">V4</text>` +
      `<path d="M66 44V28L69 31L72 28V43" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round" transform="translate(-2 6)"/>` +
      sparkle(86, 34, 2) + sparkle(32, 36, 1.6) +
      k.defs()
    )
  },

  // Ochenta flashes: el Fitz Roy hecho muro de interior, con las presas atornilladas a la piedra y la cabra arriba.
  'Cabra de montaña': (u) => {
    const k = kit(u)
    const base = roundRect(20, 88, 100, 94, 1)
    return (
      k.day() +
      k.sun(60, 54, 16, 48) +
      k.shade(ellipse(60, 54, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(48, 100, 28, 92, 26, 64, 8) + laurel(72, 100, 92, 92, 94, 64, 8, true) +
      `<g transform="translate(60 89) scale(.86)">` + k.cast([FITZ], 2.4, 1.6) +
      k.draw([{
        d: FITZ, fill: ROCK,
        inner: k.sh(FITZ, 0, 0, 1, 0, 0, 0.8, ROCK_D, 0.5) + `<path d="M0 -62L5 -46L9 -50L13 -33L17 -36L22 -22L28 -18L38 0H0Z" fill="${ROCK_D}" opacity=".35"/>` +
          `<path d="${SNOW}" fill="${P.white}"/>` +
          `<path d="M-38 -6H38" stroke="${PLY_D}" stroke-width=".4" opacity=".6"/>` +
          hair(-8, -30, -6, -20, -9, -10, 0.6, ROCK_D) + hair(8, -26, 10, -16, 7, -6, 0.6, ROCK_D) + hair(-22, -14, -20, -8, -24, -2, 0.5, ROCK_D) +
          hair(-2, -48, -3, -40, -2, -30, 0.7, '#fff', 0.6),
      }], 0.75) +
      `</g>` +
      k.draw([{ d: base, fill: PLY, inner: Array.from({ length: 10 }, (_, i) => `<circle cx="${24 + i * 8}" cy="91" r=".6" fill="${PLY_D}"/>`).join('') + k.sh(base, 0, 0, 0, 1, 0, 0.8, PLY_D, 0.4) }], 0.55) +
      hold(k, 52, 80, 0.55, P.red, 0, 10) + hold(k, 61, 72, 0.5, P.red, 1, -10) + hold(k, 56, 63, 0.5, P.red, 2) + hold(k, 61, 54, 0.45, P.red, 3) +
      hold(k, 40, 82, 0.5, P.gold, 3) + hold(k, 76, 80, 0.5, P.sky, 0) + hold(k, 68, 66, 0.45, P.green, 2, 20) + hold(k, 48, 70, 0.45, P.mid, 1, -20) +
      `<g transform="translate(60.6 36.2) scale(.9)">` + k.draw([{ d: GOAT, fill: P.white, inner: k.sh(GOAT, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) }], 0.6) +
      `<path d="M-9.6 -15.4C-8.6 -19 -5.4 -19.6 -4 -17" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M-9.6 -15.4C-8.6 -19 -5.4 -19.6 -4 -17" fill="none" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M-12 -13.2L-11.4 -10.4" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` + `</g>` +
      sparkle(86, 40, 2.4, '#fff') + sparkle(34, 42, 1.8, '#fff') +
      k.defs()
    )
  },
}
