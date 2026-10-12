// Medallas de Skull King, redibujadas (ver el kit en ../kit.ts).
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Verde agua de la cola de sirena. */
const TEAL = '#5E9F95'
const TEAL_D = '#336F69'
const FULL = 'M0 0H120V130H0Z'

type Pt = [number, number]

/** Mar: una banda con el borde de arriba ondulado (`n` ondas entre x0 y x1) que baja hasta y1. */
function sea(y: number, amp: number, n: number, x0 = -4, x1 = 124, y1 = 130) {
  const w = (x1 - x0) / n
  let d = `M${x0} ${y1}V${y}`
  for (let i = 0; i < n; i++) {
    const a = x0 + i * w
    d += `Q${f(a + w / 4)} ${f(y - amp)} ${f(a + w / 2)} ${y}Q${f(a + (3 * w) / 4)} ${f(y + amp)} ${f(a + w)} ${y}`
  }
  return d + `V${y1}Z`
}

/** Brillos en las crestas de un mar hecho con `sea` (mismos parámetros). */
function crests(y: number, amp: number, n: number, x0 = -4, x1 = 124, c: string = P.white, w = 0.6) {
  const wd = (x1 - x0) / n
  let s = ''
  for (let i = 0; i < n; i++) {
    const a = x0 + i * wd
    s += hair(a + wd * 0.08, y + 0.6, a + wd * 0.25, y - amp + 0.9, a + wd * 0.44, y + 0.2, w, c)
  }
  return s
}

/** Mar entintado: banda ondulada con sombra hacia abajo y brillos en las crestas. */
function water(k: Kit, y: number, amp: number, n: number, fill: string, dark: string, crest: string, op = 1, x0 = -4, x1 = 124) {
  const d = sea(y, amp, n, x0, x1)
  return `<path d="${d}" fill="${fill}"${op < 1 ? ` opacity="${op}"` : ''}/>` + k.sh(d, 0, 0, 0, 1, 0, 0.9, dark, 0.45) + crests(y, amp, n, x0, x1, crest)
}

/** Rayitas de oleaje (grabado) en filas, entre x0 y x1 desde la fila y0, cada `dy`. */
function swell(x0: number, x1: number, y0: number, rows: number, dy: number, c: string = P.white, w = 0.5) {
  let s = ''
  for (let r = 0; r < rows; r++) {
    const y = y0 + r * dy, off = r % 2 ? 7 : 0
    for (let x = x0 + off; x < x1 - 8; x += 15) s += hair(x, y, x + 4, y - 1.3, x + 8, y, w * (1 - r * 0.08), c)
  }
  return s
}

/** Camino de tortuga: arranca en (x,y) mirando a `ang` grados y avanza por tramos [largo, giro en grados]. */
function walk(x: number, y: number, ang: number, segs: [number, number][], step = 1.1): Pt[] {
  const pts: Pt[] = [[x, y]]
  let a = (ang * Math.PI) / 180
  for (const [len, turn] of segs) {
    const n = Math.max(1, Math.round(len / step)), da = (turn * Math.PI) / 180 / n, ds = len / n
    for (let i = 0; i < n; i++) {
      a += da / 2
      x += Math.cos(a) * ds
      y += Math.sin(a) * ds
      a += da / 2
      pts.push([x, y])
    }
  }
  return pts
}

/** Tubo que se afina de w0 a w1 a lo largo de un camino, con la punta redondeada (tentáculos, algas). */
function strand(pts: Pt[], w0: number, w1: number) {
  const L: string[] = [], R: string[] = [], n = pts.length - 1
  pts.forEach(([x, y], i) => {
    const [ax, ay] = pts[Math.max(0, i - 1)], [bx, by] = pts[Math.min(n, i + 1)]
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * Math.pow(i / n, 0.85)) / 2
    L.push(`${f(x - (dy / len) * w)} ${f(y + (dx / len) * w)}`)
    R.push(`${f(x + (dy / len) * w)} ${f(y - (dx / len) * w)}`)
  })
  const r = f(Math.max(w1 / 2, 0.1))
  return `M${L.join('L')}A${r} ${r} 0 0 0 ${R[R.length - 1]}L${R.reverse().join('L')}Z`
}

/** Punto del costado de un camino: `side` 1 es la izquierda del avance (el adentro de una curva horaria), a `frac` del medio ancho. */
function beside(pts: Pt[], i: number, half: number, side: number) {
  const n = pts.length - 1, [x, y] = pts[i], [ax, ay] = pts[Math.max(0, i - 1)], [bx, by] = pts[Math.min(n, i + 1)]
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1
  return { x: x - (dy / len) * half * side, y: y + (dx / len) * half * side, a: (Math.atan2(dy, dx) * 180) / Math.PI }
}

/** Ventosas sobre un tentáculo hecho con `strand`, en dos filas del lado `side`. */
function suckers(pts: Pt[], w0: number, w1: number, side: number, from: number, every: number, r0: number) {
  let s = ''
  const n = pts.length - 1
  for (let i = from; i < n - 2; i += every) {
    const t = i / n, half = (w0 + (w1 - w0) * Math.pow(t, 0.85)) / 2, r = Math.max(0.4, r0 * (1 - t * 0.78))
    const q = beside(pts, i, half * 0.6, side)
    s += `<g transform="translate(${f(q.x)} ${f(q.y)}) rotate(${f(q.a)})"><ellipse rx="${f(r)}" ry="${f(r * 0.82)}" fill="${P.skin}" stroke="${P.wine}" stroke-width=".35"/><ellipse rx="${f(r * 0.45)}" ry="${f(r * 0.36)}" fill="${P.red}" opacity=".55"/></g>`
  }
  return s
}

/** Calavera de frente con el centro del cráneo en (0,0); va de y=-14 a y=14.6. `patch` le tapa el ojo derecho. */
const SKULL = 'M0 -14C8.4 -14 13.6 -8.2 13.6 -1C13.6 3.6 11.8 6.6 9.4 8.2L9.2 11.6C9.2 13.4 8 14.6 6.4 14.6H-6.4C-8 14.6 -9.2 13.4 -9.2 11.6L-9.4 8.2C-11.8 6.6 -13.6 3.6 -13.6 -1C-13.6 -8.2 -8.4 -14 0 -14Z'
function skull(k: Kit, extra = '', w = 0.7, goldTooth = false) {
  const eye = 'M-9 .4C-9 -2.4 -7 -3.6 -4.9 -3.6C-2.6 -3.6 -1.3 -2 -1.3 .4C-1.3 3 -3 4.6 -5 4.6C-7.3 4.6 -9 2.8 -9 .4Z'
  return (
    k.draw([{
      d: SKULL, fill: P.white,
      inner:
        k.sh('M3 -16H16V16H3Z', 0, 0, 1, 0, 0, 0.85) + k.sh('M-16 6H16V16H-16Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
        k.shade(ellipse(-9.4, 5.6, 3, 2.4), k.rad(P.blue, 0.5, 0.5, 0.5, 0.6, 0), P.blue, 0.3) + k.shade(ellipse(9.4, 5.6, 3, 2.4), k.rad(P.blue, 0.5, 0.5, 0.5, 0.8, 0), P.blue, 0.3) +
        `<ellipse cx="-6.4" cy="-9" rx="3.6" ry="1.9" fill="#fff" transform="rotate(-30 -6.4 -9)"/>` +
        hair(-11.6, 4.6, -10, 6.6, -8, 7.4, 0.45, P.blue) + hair(11.6, 4.6, 10, 6.6, 8, 7.4, 0.5) + hair(9.4, -9.6, 11.2, -6.6, 11.8, -3, 0.45, P.blue) +
        hair(-12.4, -3, -11.6, -6, -10.2, -8.6, 0.35, P.sky2) + extra,
    }], w) +
    `<path d="${eye}" fill="${P.night}"/><path d="${eye}" fill="${P.night}" transform="scale(-1 1)"/>` +
    `<path d="M-6.8 -1.6Q-5.6 -2.6 -4.2 -2.2" fill="none" stroke="${P.mid}" stroke-width=".5" stroke-linecap="round"/><path d="M3.6 -2.2Q5 -2.6 6.2 -1.6" fill="none" stroke="${P.mid}" stroke-width=".5" stroke-linecap="round"/>` +
    `<path d="M0 5.4C.8 5.4 1.9 7.6 1.9 8.4C1.9 9 1.2 9.2 0 8.6C-1.2 9.2 -1.9 9 -1.9 8.4C-1.9 7.6 -.8 5.4 0 5.4Z" fill="${P.night}"/>` +
    (goldTooth ? `<rect x="1.3" y="11" width="2.2" height="2.8" rx=".4" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".25"/><path d="M1.7 11.6V12.8" stroke="#fff" stroke-width=".35"/>` : '') +
    `<path d="M-6.6 11.4Q0 12.6 6.6 11.4" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
    `<path d="M-3.6 10.4V13.6M-1.2 10.8V14.2M1.2 10.8V14.2M3.6 10.4V13.6" stroke="${P.ink}" stroke-width=".45" stroke-linecap="round"/>`
  )
}

/** Hueso blanco centrado en (x,y), de largo `len`, girado `rot` grados. */
function bone(k: Kit, x: number, y: number, rot: number, len: number) {
  const h = len / 2
  const knob = (cx: number, cy: number) => ({ d: ellipse(cx, cy, 2.5, 2.5), fill: P.white, inner: k.sh(ellipse(cx, cy, 2.5, 2.5), 0, 0, 0, 1, 0, 0.8, P.blue, 0.35) })
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    k.draw([
      knob(-h, -1.9), knob(-h, 1.9), knob(h, -1.9), knob(h, 1.9),
      { d: roundRect(-h, -1.8, h, 1.8, 1.8), fill: P.white, inner: k.sh(`M${-h - 3} 0H${h + 3}V3H${-h - 3}Z`, 0, 0, 0, 1, 0, 0.8, P.blue, 0.35) },
    ], 0.55) +
    hair(-h + 3, -0.8, 0, -1.2, h - 3, -0.8, 0.5, '#fff') +
    `</g>`
  )
}

/** Corona de cinco puntas con la base en (0,0) y la punta más alta en y=-15.4. `rich` le suma terciopelo, perlas y grabado. */
const CROWN = 'M-10.6 0L-12.6 -11L-7.6 -5.8L-5.6 -13.6L-2.4 -6.6L0 -15.4L2.4 -6.6L5.6 -13.6L7.6 -5.8L12.6 -11L10.6 0Z'
function crown(k: Kit, w = 0.6, rich = false) {
  const tips: Pt[] = [[-12.6, -11], [-5.6, -13.6], [0, -15.4], [5.6, -13.6], [12.6, -11]]
  const cap = 'M-10 -4C-10.4 -10 -5.6 -12.4 0 -12.4C5.6 -12.4 10.4 -10 10 -4Z'
  const scroll = (x: number, sg: number) => `<path d="M${x} -1.2C${f(x + sg * 0.2)} -3.2 ${f(x + sg * 2)} -3.4 ${f(x + sg * 2.2)} -2C${f(x + sg * 2.3)} -1 ${f(x + sg * 1.2)} -.8 ${f(x + sg * 1.1)} -1.6" fill="none" stroke="${P.goldD}" stroke-width=".35" stroke-linecap="round"/>`
  return (
    (rich ? k.draw([{ d: cap, fill: P.red, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.9, P.wine, 0.45) + hair(-6, -6, -5, -10, -2, -12.4, 0.4, '#fff', 0.5) + hair(2, -5, 2.6, -9, 4.6, -11.6, 0.4, P.wine) }], w) : '') +
    tips.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/>` + (rich ? `<circle cx="${f(x - 0.5)}" cy="${f(y - 0.5)}" r=".45" fill="#fff"/>` : '')).join('') +
    k.draw([{
      d: CROWN, fill: P.gold,
      inner:
        k.sh(CROWN, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="M-14 -16H-3V1H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
        `<path d="M-11.3 -4.2H11.3" stroke="${P.goldD}" stroke-width=".7"/>` +
        (rich
          ? hair(-11.6, -9.4, -10.6, -7, -10.2, -4.8, 0.45, '#fff') + hair(-5, -11.6, -4.6, -8.6, -4.6, -5, 0.45, '#fff') + hair(0.4, -13, 0.6, -9.6, 0.4, -5, 0.4, P.goldL) +
            hair(6.4, -11, 6.4, -8, 6, -5, 0.45, P.goldD) + hair(11.6, -9, 10.8, -6.8, 10.2, -4.8, 0.45, P.goldD) +
            `<path d="M-11 -4.9H11" stroke="${P.goldL}" stroke-width=".4"/>` + scroll(-9.4, 1) + scroll(-3.4, -1) + scroll(3.4, 1) + scroll(9.4, -1)
          : ''),
    }], w) +
    (rich ? [-9.6, -7.2, -4.6, 4.6, 7.2, 9.6].map((x) => `<circle cx="${x}" cy="-4.6" r=".5" fill="${P.white}" stroke="${P.goldD}" stroke-width=".2"/>`).join('') : '') +
    `<path d="M0 -4.2L1.6 -2.1L0 0L-1.6 -2.1Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".35" transform="translate(0 -.1)"/>` +
    `<circle cx="-6" cy="-2.1" r="1.05" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/><circle cx="6" cy="-2.1" r="1.05" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>` +
    (rich ? `<path d="M-.6 -3.2L-.1 -2.6" stroke="#fff" stroke-width=".35"/><path d="${starPath(0, -9.4, 1.7, 0.6, 4)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/><circle cx="-5.6" cy="-8.6" r=".7" fill="${P.sky}" stroke="${P.ink}" stroke-width=".2"/><circle cx="5.6" cy="-8.6" r=".7" fill="${P.sky}" stroke="${P.ink}" stroke-width=".2"/>` : '')
  )
}

/** Doblón de oro centrado en (x,y); `sq` < 1 lo pone de canto. */
function coin(k: Kit, x: number, y: number, r: number, rot = 0, sq = 1) {
  const d = ellipse(0, 0, r, r)
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(1 ${sq})">` +
    k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.4) }], 0.45) +
    `<circle r="${f(r * 0.66)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
    `<path d="M0 ${f(-r * 0.38)}V${f(r * 0.38)}M${f(-r * 0.38)} 0H${f(r * 0.38)}" stroke="${P.goldD}" stroke-width=".55"/>` +
    `<ellipse cx="${f(-r * 0.36)}" cy="${f(-r * 0.42)}" rx="${f(r * 0.3)}" ry="${f(r * 0.15)}" fill="#fff" opacity=".85" transform="rotate(-35 ${f(-r * 0.36)} ${f(-r * 0.42)})"/>` +
    `</g>`
  )
}

/** Galeón de costado, con la proa a la izquierda y la línea de flotación en y≈6. `ghost` le rompe y emparcha las velas. */
function ship(k: Kit, ghost = false) {
  const hull = 'M-33 -5Q-10 1 17 -1L18 -9H31L32 -7L30 1Q26 11 10 11H-14Q-27 10 -33 -5Z'
  const masts: [number, number, number][] = [[-14, -1, -38], [2, 0, -46], [22, -9, -34]]
  const S: [number, number, number, number, number][] = [[-14, -35, -22, 8, 2.6], [-14, -20, -6, 10, 4], [2, -43, -29, 9.4, 2.4], [2, -27, -7, 12, 4.6], [22, -31, -15, 7, 3]]
  const sail = ([x, y0, y1, w, torn]: [number, number, number, number, number]) => {
    const b = (y1 - y0) * 0.22
    const top = `M${f(x - w)} ${y0}Q${x} ${f(y0 + b * 0.5)} ${f(x + w)} ${y0}Q${f(x + w + 2)} ${f((y0 + y1) / 2)} ${f(x + w)} ${y1}`
    if (!ghost) return top + `Q${x} ${f(y1 + b)} ${f(x - w)} ${y1}Q${f(x - w + 2)} ${f((y0 + y1) / 2)} ${f(x - w)} ${y0}Z`
    const jag = [0.12, 0.26, 0.4, 0.55, 0.7, 0.85].map((t, i) => `L${f(x + w - t * 2 * w)} ${f(y1 + b * 0.7 - (i % 2 ? torn : -0.3))}`).join('')
    return top + `${jag}L${f(x - w)} ${f(y1 - 1.6)}Q${f(x - w + 2)} ${f((y0 + y1) / 2)} ${f(x - w)} ${y0}Z`
  }
  const flag = ghost ? 'M2 -46H11.6L9.6 -44.6L12 -43.4L9 -42.2L10.4 -41.2Q6 -41.4 2 -41.6Z' : 'M2 -46H11.6Q10.6 -44 12 -42Q8 -41.4 2 -41.6Z'
  const holes = ghost ? [ellipse(-10.6, -13, 1.8, 1.3), ellipse(6.4, -17, 2, 1.5), ellipse(20.6, -24, 1.1, 1.5)] : []
  const patches = ghost ? `<rect x="-4" y="-22" width="3.6" height="3.2" fill="${P.white}" stroke="${P.blue}" stroke-width=".3" stroke-dasharray=".6 .5" transform="rotate(-6 -2 -20)"/><rect x="-17.6" y="-31" width="3" height="2.6" fill="${P.white}" stroke="${P.blue}" stroke-width=".3" stroke-dasharray=".6 .5"/>` : ''
  const seams = S.map(([x, y0, y1, w]) => [-0.35, 0.35].map((s) => hair(x + w * s, y0 + 1, x + w * s * 1.2, (y0 + y1) / 2, x + w * s, y1, 0.4, ghost ? P.blue : P.sky2)).join('')).join('')
  const shrouds = masts.map(([x, y0, y1]) => {
    const top = y1 + 6
    return `<path d="M${x - 5} ${y0 + 1}L${x} ${top}L${x + 5} ${y0 + 1}" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
      [0.25, 0.5, 0.75].map((t) => `<path d="M${f(x - 5 * (1 - t))} ${f(y0 + 1 + (top - y0 - 1) * t)}H${f(x + 5 * (1 - t))}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
  }).join('')
  const glow = ghost ? P.goldL : P.night
  return (
    `<path d="M-31 -5L-43 -12M-43 -12L-14 -38L2 -46L22 -34L31 -9" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
    shrouds +
    masts.map(([x, y0, y1]) => `<path d="M${x} ${y0}V${y1}" stroke="${P.ink}" stroke-width="2.2"/><path d="M${x} ${y0}V${y1}" stroke="${ghost ? P.sky2 : P.brown}" stroke-width="1"/>`).join('') +
    `<path d="M-23 -35H-5M-24 -20H-4M-8 -43H12M-11 -27H15M14 -31H30" stroke="${P.ink}" stroke-width="1"/>` +
    k.draw(S.map((p) => ({ d: sail(p), fill: ghost ? P.sky1 : P.white, inner: k.sh('M-30 -50H40V0H-30Z', 0, 0, 1, 1, 0, 0.75, ghost ? P.blue : P.sky2, 0.4) + holes.map((h) => `<path d="${h}" fill="${P.mid}" opacity=".8"/>`).join('') })), 0.5) +
    seams + patches +
    (ghost
      ? [[-22, -20, 1], [-24, -5, 1.1], [-7, -28, 0.8], [-10, -6, 0.9], [15, -14, 0.8]].map(([x, y, s]) => hair(x, y, x - 6 * s, y + 3 * s, x - 13 * s, y + 0.6 * s, 0.7, P.white, 0.75) + hair(x - 13 * s, y + 0.6 * s, x - 17 * s, y - 1.6 * s, x - 20 * s, y + 0.4 * s, 0.5, P.white, 0.6)).join('')
      : '') +
    k.draw([{ d: flag, fill: P.night }], 0.4) +
    `<circle cx="6.4" cy="-44" r="1.1" fill="${P.paper}"/><path d="M4.6 -42.2L8.2 -45.8M4.6 -45.8L8.2 -42.2" stroke="${P.paper}" stroke-width=".45"/>` +
    k.draw([{
      d: hull, fill: ghost ? P.sky2 : P.brown,
      inner:
        k.sh(hull, 0, 0, 0, 1, 0, 0.95, ghost ? P.mid : P.brownD, 0.45) +
        `<path d="M-30 -1.6Q-8 4 30 -1.8" fill="none" stroke="${ghost ? P.sky1 : P.gold}" stroke-width="1"/>` +
        hair(-26, 4, -6, 9, 22, 6, 0.5, ghost ? P.blue : P.brownD) + hair(-20, 7, 0, 11, 20, 9, 0.45, ghost ? P.blue : P.brownD) +
        [-20, -11, -2, 7].map((x) => `<rect x="${x}" y="2.4" width="2.6" height="2.2" fill="${glow}"/>`).join('') +
        `<rect x="21" y="-7.4" width="2" height="2.4" fill="${glow}"/><rect x="25.4" y="-7.4" width="2" height="2.4" fill="${glow}"/>`,
    }], 0.55)
  )
}

/** Espuma alrededor de algo que flota: trazos blancos cortados a lo largo de una elipse. */
function foam(cx: number, cy: number, rx: number, ry: number, n = 7, w = 0.8) {
  let s = ''
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * (0.05 + (0.9 * i) / n), a1 = a0 + (0.62 * Math.PI) / n
    const p = (a: number) => [cx - Math.cos(a) * rx, cy + Math.sin(a) * ry * (i % 2 ? 1 : 0.6)]
    const [x0, y0] = p(a0), [x1, y1] = p(a1), [xm, ym] = p((a0 + a1) / 2)
    s += hair(x0, y0, xm, ym + 0.4, x1, y1, w, P.white)
  }
  return s
}

/** Gota de agua blanca. */
const drop = (x: number, y: number, r: number, s: number) =>
  `<path d="M0 -2.6C1 -1.2 1.6 -.2 1.6 .8C1.6 1.8 .8 2.4 0 2.4C-.8 2.4 -1.6 1.8 -1.6 .8C-1.6 -.2 -1 -1.2 0 -2.6Z" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${P.white}" stroke="${P.ink}" stroke-width="${f(0.4 / s)}"/>`

/** Burbuja. */
const bubble = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" fill-opacity=".3" stroke="${P.white}" stroke-width=".5"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.28)}" fill="#fff"/>`

/** Estrellitas de un cielo de noche. */
const stars = (pts: number[][]) => pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('')

/** Pata de palo torneada: punta de bronce en (0,0), caña con anillos, cuja de cuero y la botamanga del pantalón que entra desde arriba. */
function pegLeg(k: Kit) {
  const N = 34, L: string[] = [], R: string[] = []
  const bump = (t: number, at: number, h: number, wd = 0.045) => h * Math.exp(-(((t - at) / wd) ** 2))
  for (let i = 0; i <= N; i++) {
    const t = i / N, y = -4.6 - 33 * t, w = 2.6 + 1.7 * t + bump(t, 0.34, 1.6) + bump(t, 0.7, 1.7) + bump(t, 1, 1.5, 0.07)
    L.push(`${f(-w)} ${f(y)}`)
    R.push(`${f(w)} ${f(y)}`)
  }
  const shaft = `M${L.join('L')}L${R.reverse().join('L')}Z`
  const ferrule = 'M-2.9 -5.4H2.9L2.6 -1C2.5 -.2 1.6 .4 0 .4C-1.6 .4 -2.5 -.2 -2.6 -1Z'
  const cup = 'M-6.2 -37C-8.6 -43 -10.6 -51 -11.2 -58.6C-6 -60.4 6 -60.4 11.2 -58.6C10.6 -51 8.6 -43 6.2 -37C2 -35.8 -2 -35.8 -6.2 -37Z'
  const leg = 'M-11.2 -60C-12.4 -70 -12.8 -84 -12.4 -100H12.4C12.8 -84 12.4 -70 11.2 -60Z'
  const cuff = 'M-12.6 -63.6C-6 -65.6 6 -65.6 12.6 -63.6L12.3 -57.4C6 -55.6 -6 -55.6 -12.3 -57.4Z'
  const strap = (y: number, hw: number) => `M${-hw} ${f(y - 1.6)}Q0 ${f(y)} ${hw} ${f(y - 1.6)}L${f(hw + 0.3)} ${f(y + 1.2)}Q0 ${f(y + 2.8)} ${f(-hw - 0.3)} ${f(y + 1.2)}Z`
  const buckle = (x: number, y: number) => `<rect x="${f(x - 1.6)}" y="${f(y - 1.9)}" width="3.2" height="3.6" rx=".5" fill="none" stroke="${P.ink}" stroke-width="1.3"/><rect x="${f(x - 1.6)}" y="${f(y - 1.9)}" width="3.2" height="3.6" rx=".5" fill="none" stroke="${P.gold}" stroke-width=".6"/><path d="M${x} ${f(y - 1.9)}V${f(y + 1.7)}" stroke="${P.ink}" stroke-width=".4"/>`
  return (
    k.draw([
      { d: shaft, fill: P.brown, line: 0.3, inner: k.sh('M1 -40H8V0H1Z', 0, 0, 1, 0, 0, 0.95, P.brownD, 0.5) + `<path d="M-8 -40H-1.2V0H-8Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.6, 0)}"/>` + hair(-1.6, -8, -1.2, -16, -1.8, -22, 0.4, P.brownD) + hair(1, -24, 1.6, -30, 1, -35, 0.4, P.brownD) + hair(0.6, -7, 1, -10, 0.6, -14, 0.35, P.brownD) + `<path d="M-6 -16.2H6M-6 -27.7H6" stroke="${P.brownD}" stroke-width=".4"/>` + hair(-2.6, -17.4, -2.8, -16.4, -2.6, -15.2, 0.5, '#fff', 0.8) + hair(-3, -29, -3.2, -28, -3, -26.6, 0.5, '#fff', 0.8) },
      { d: ferrule, fill: P.gold, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.45) + `<path d="M-2.8 -3.8H2.8" stroke="${P.goldD}" stroke-width=".45"/><path d="M-1.6 -5V-1" stroke="#fff" stroke-width=".5" opacity=".8"/>` },
      {
        d: cup, fill: P.brownD,
        inner:
          k.sh('M2 -62H14V-34H2Z', 0, 0, 1, 0, 0, 0.9, P.night, 0.45) + `<path d="M-12 -62H-4V-34H-12Z" fill="${k.lin(P.brown, 0, 0, 1, 0, 0.8, 0)}"/>` +
          `<path d="M-6.6 -38.6C-8.4 -44 -9.8 -51 -10.2 -57M6.6 -38.6C8.4 -44 9.8 -51 10.2 -57" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".9 .8" opacity=".8"/>` +
          hair(-4, -40, -5, -48, -5.4, -56, 0.4, P.brown),
      },
    ], 0.7) +
    k.draw([
      { d: strap(-44.4, 8.2), fill: P.wine, inner: k.sh(strap(-44.4, 8.2), 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
      { d: strap(-52.6, 9.8), fill: P.wine, inner: k.sh(strap(-52.6, 9.8), 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
    ], 0.45) +
    buckle(2.8, -43.6) + buckle(3.2, -51.8) +
    k.draw([
      {
        d: leg, fill: P.mid,
        inner:
          k.sh('M3 -100H16V-50H3Z', 0, 0, 1, 0, 0, 0.9, P.night, 0.45) + `<path d="M-14 -100H-5V-50H-14Z" fill="${k.lin(P.sky2, 0, 0, 1, 0, 0.55, 0)}"/>` +
          hair(-6, -92, -7.4, -80, -5, -66, 0.5, P.night) + hair(5, -88, 6.6, -76, 4.6, -66, 0.5, P.night) + hair(-1, -74, 1, -70, 0, -65, 0.4, P.night) +
          `<path d="${roundRect(-8.4, -86, -1.6, -79, 0.6)}" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".35"/><path d="${roundRect(-7.6, -85.2, -2.4, -79.8, 0.4)}" fill="none" stroke="${P.white}" stroke-width=".3" stroke-dasharray=".7 .6"/>`,
      },
      { d: cuff, fill: P.sky1, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M-12.4 -60.4C-6 -62.2 6 -62.2 12.4 -60.4" fill="none" stroke="${P.blue}" stroke-width=".45"/>` + hair(-10, -63.6, -4, -64.8, 2, -64.6, 0.4, '#fff') },
    ], 0.65)
  )
}

export const SKULLKING_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Cazador de reyes ───────────────────────────────────────────────

  // La primera sirena: el Skull King se hunde con la corona torcida y un beso de rouge en la frente; la cola ya se zambulle.
  'Beso de sirena': (u) => {
    const k = kit(u)
    const lips = 'M-4.6 -.2C-3.6 -2 -1.6 -2.6 0 -1.2C1.6 -2.6 3.6 -2 4.6 -.2C2.8 .3 -2.8 .3 -4.6 -.2ZM-4.4 .5C-3 3 3 3 4.4 .5C2.6 1.1 -2.6 1.1 -4.4 .5Z'
    const creases = [-3.4, -2.3, -1.2, 1.2, 2.3, 3.4].map((x) => hair(x, -1.3 + Math.abs(x) * 0.12, x * 1.04, -0.6, x * 1.08, -0.1, 0.18, P.white, 0.75) + hair(x * 0.9, 0.7, x * 0.94, 1.4, x * 0.86, 2.1 - Math.abs(x) * 0.18, 0.18, P.white, 0.75)).join('')
    const kiss =
      `<g transform="translate(-2.8 -7.8) rotate(-16) scale(1.5)"><path d="${lips}" fill="${P.red}" opacity=".9"/>` + k.shade(lips, k.lin(P.wine, 0, 0, 1, 1, 0.1, 0.9), P.wine, 0.25) + creases + `</g>`
    const fin = 'M0 1.6C-1.4 -1.6 -5 -4.8 -10 -5.8C-8.6 -2.4 -6.4 0 -2.6 2.8H2.6C6.4 0 8.6 -2.4 10 -5.8C5 -4.8 1.4 -1.6 0 1.6Z'
    const stem = 'M-2.4 8C-2.6 5 -2 3 -1.2 1.6H1.2C2 3 2.6 5 2.4 8Z'
    return (
      k.day() +
      k.sun(58, 56, 19, 47, 28, false) +
      water(k, 78, 2.6, 5, P.sky, P.mid, P.white) +
      `<g transform="translate(57 64.4) rotate(-8) scale(1.55)">` +
      skull(k, kiss + hair(4.6, -13, 6, -10, 5.2, -7.4, 0.35, P.blue), 0.5) +
      `<g transform="translate(3 -11.6) rotate(22) scale(.86)">${crown(k, 0.5, true)}</g>` +
      `</g>` +
      water(k, 80, 2.2, 4, P.sky, P.mid, P.white, 0.78, -6, 126) +
      swell(26, 100, 87, 2, 5.4) +
      foam(57, 80.2, 17, 2) +
      `<g transform="translate(88 75) rotate(26) scale(1.05)">` +
      k.draw([
        { d: stem, fill: TEAL, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.9, TEAL_D, 0.4) },
        { d: fin, fill: TEAL, inner: k.sh(fin, 0, 0, 1, 1, 0, 0.8, TEAL_D, 0.4) + hair(-1, 0, -4, -2.6, -7.6, -4.4, 0.4, TEAL_D) + hair(-1.4, 1, -4.4, -0.6, -7, -1.4, 0.35, TEAL_D) + hair(1, 0, 4, -2.6, 7.6, -4.4, 0.4, TEAL_D) + hair(1.4, 1, 4.4, -0.6, 7, -1.4, 0.35, TEAL_D) + hair(-8, -5, -5, -3.6, -2, -1.4, 0.5, '#fff', 0.6) },
      ], 0.5) +
      `</g>` +
      `<path d="${ellipse(87, 80.4, 6, 1.4)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
      drop(94.6, 72, 30, 0.9) + drop(80, 72, -30, 0.8) + drop(91, 66.4, 10, 0.6) +
      sparkle(86, 36, 2.4) + sparkle(31, 48, 1.6) +
      k.defs()
    )
  },

  // Tres reyes: una corona más baja al fondo del mar, con la luz de arriba y la estela de burbujas.
  'Corona al agua': (u) => {
    const k = kit(u)
    const sand = 'M-4 90C14 85 30 88 46 87C62 86 78 83 96 86C106 88 114 86 124 84V130H-4Z'
    const weed = (x: number, h: number, s: number) => strand(walk(x, 101, -90, [[h * 0.34, 34 * s], [h * 0.36, -48 * s], [h * 0.3, 36 * s]]), 3.8, 1.1)
    const weeds = [weed(28, 44, 1), weed(33, 30, -1), weed(91, 40, -1), weed(95, 28, 1)]
    return (
      `<rect width="120" height="130" fill="${P.sky}"/>` +
      k.shade(FULL, k.lin(P.mid, 0, 0, 0, 1, 0, 0.95), P.mid, 0.5) +
      k.shade('M38 0H52L42 100H14Z', k.lin(P.white, 0, 0, 0, 1, 0.6, 0), P.white, 0.3) +
      k.shade('M64 0H74L94 100H72Z', k.lin(P.white, 0, 0, 0, 1, 0.55, 0), P.white, 0.3) +
      k.shade('M54 0H62L66 80H48Z', k.lin(P.white, 0, 0, 0, 1, 0.5, 0), P.white, 0.25) +
      k.shade(ellipse(60, 54, 34, 26), k.rad(P.white, 0.5, 0.5, 0.5, 0.8, 0), P.white, 0.45) +
      k.draw(weeds.map((d) => ({ d, fill: P.green, inner: k.sh('M60 0H120V130H60Z', 0, 0, 1, 0, 0, 0.6, P.greenD, 0.4) + k.sh(FULL, 0, 0, 0, 1, 0.6, 0, P.greenD, 0.3) })), 0.5) +
      k.draw([{ d: sand, fill: P.goldL, inner: k.sh(sand, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.35) }], 0.6) +
      hair(30, 94, 40, 92.4, 50, 93.6, 0.5, P.goldD) + hair(64, 91, 74, 89.4, 84, 90.6, 0.5, P.goldD) + hair(46, 99, 54, 97.6, 62, 98.8, 0.45, P.goldD) +
      k.floor(61, 90, 22, 2.4, P.goldD) +
      hair(46, 20, 45.6, 26, 46.4, 32, 0.6, P.white) + hair(74, 20, 74.4, 26, 73.6, 32, 0.6, P.white) + hair(60, 16, 60.2, 21, 60, 26, 0.5, P.white) +
      `<g transform="translate(60.6 73) rotate(12) scale(2)">${crown(k, 0.38, true)}</g>` +
      bubble(64, 33, 2.2) + bubble(57.6, 26, 1.6) + bubble(63.4, 19.4, 1.1) + bubble(36, 60, 1.5) + bubble(33, 51, 1) + bubble(86, 46, 1.3) +
      sparkle(32, 40, 2) + sparkle(90, 64, 1.6) +
      k.defs()
    )
  },

  // Ocho reyes: el kraken coronado asoma de la tormenta, con la luna detrás y los tentáculos en alto.
  'Leviatán': (u) => {
    const k = kit(u)
    const L = walk(45, 95, -99, [[27, -6], [12, -12], [9, -80], [7, -120], [5, -150]])
    const R = walk(75, 95, -81, [[27, 6], [12, 12], [9, 80], [7, 120], [5, 150]])
    const head = 'M42.6 96C40 88 40.6 81.4 44.6 77.6C41.6 71.4 40.6 62.6 43.4 55.6C46.4 48.2 52.6 45 60 45C67.4 45 73.6 48.2 76.6 55.6C79.4 62.6 78.4 71.4 75.4 77.6C79.4 81.4 80 88 77.4 96Z'
    const DEEP = '#3A0F1B'
    const tent = (pts: Pt[]) => {
      const d = strand(pts, 11, 1.4)
      return { d, fill: P.wine, inner: k.sh(d, 0, 0, 1, 0, 0, 0.85, DEEP, 0.5) + k.sh(FULL, 0, 0, 0, 1, 0, 0.6, DEEP, 0.35) }
    }
    const shine = (pts: Pt[], side: number) => {
      let s = ''
      for (let i = 3; i < pts.length - 12; i += 6) {
        const a = beside(pts, i, 2.7, side), b = beside(pts, i + 5, 2.5, side)
        s += hair(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2, b.x, b.y, 0.55, P.red, 0.9)
      }
      return s
    }
    const eye = (x: number) =>
      `<ellipse cx="${x}" cy="83" rx="4.4" ry="3.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".6"/><ellipse cx="${x}" cy="83" rx="3" ry="2.8" fill="${P.gold}"/>` + k.shade(ellipse(x, 83, 5, 5), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.clip(ellipse(x, 83, 3, 2.8), k.sh(ellipse(x, 83, 3, 2.8), 0, 0, 0, 1, 0, 0.9, P.goldD, 0.4)) +
      `<path d="M${x} 80.4C${x + 0.9} 81.8 ${x + 0.9} 84.2 ${x} 85.6C${x - 0.9} 84.2 ${x - 0.9} 81.8 ${x} 80.4Z" fill="${P.night}"/>` +
      `<path d="M${x - 4.8} 82.2C${x - 3} 79 ${x + 3} 79 ${x + 4.8} 82.2C${x + 2} 80.8 ${x - 2} 80.8 ${x - 4.8} 82.2Z" fill="${DEEP}" stroke="${P.ink}" stroke-width=".5"/>`
    const moon = ellipse(60, 44, 26, 26)
    const spots = ([[53, 58, 1.7], [66, 57, 1.3], [60, 62.4, 1], [49.6, 65, 1.2], [70.6, 64.6, 1.4], [56.6, 52.4, 0.9], [46.6, 71, 0.9], [73.4, 70.4, 1]] as const)
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${DEEP}" opacity=".8"/><circle cx="${x}" cy="${y}" r="${f(r + 0.7)}" fill="none" stroke="${P.red}" stroke-width=".3" opacity=".7"/>`).join('')
    return (
      k.night() +
      stars([[26, 60], [94, 58], [90, 26], [30, 28], [24, 76], [97, 74]]) +
      `<path d="${moon}" fill="${P.paper}"/>` + k.shade(moon, k.rad(P.goldL, 0.4, 0.4, 0.7, 0, 0.85), P.goldL, 0.3) +
      `<path d="${ellipse(60, 44, 28.4, 28.4)}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      water(k, 88, 2.6, 5, P.mid, P.night, P.sky2) +
      k.draw([tent(L), tent(R)], 0.65) +
      shine(L, 1) + shine(R, -1) +
      suckers(L, 11, 1.4, -1, 4, 3, 1.7) + suckers(R, 11, 1.4, 1, 4, 3, 1.7) +
      k.draw([{
        d: head, fill: P.wine,
        inner:
          k.sh('M62 44C76 54 82 72 78 96H90V44Z', 0, 0, 1, 0, 0, 0.85, DEEP, 0.5) + k.sh('M34 84H86V96H34Z', 0, 0, 0, 1, 0, 0.7, DEEP, 0.4) +
          `<path d="M38 44H51V96H38Z" fill="${k.lin(P.red, 0, 0, 1, 0, 0.7, 0)}"/>` + spots +
          hair(49, 54, 52.6, 50.4, 57, 49, 0.7, '#fff', 0.7) + hair(44.6, 70, 44.6, 63, 47, 57, 0.5, '#fff', 0.5) +
          hair(46, 76.6, 53, 74.6, 60, 75.6, 0.55, DEEP) + hair(60, 75.6, 67, 74.6, 74, 76.6, 0.55, DEEP) + hair(50, 69, 60, 67, 70, 69, 0.4, DEEP) + hair(54, 89, 60, 90.6, 66, 89, 0.5, DEEP),
      }], 0.75) +
      `<path d="M44.6 79.4C47 77.4 52 77.2 56.6 80.4M75.4 79.4C73 77.4 68 77.2 63.4 80.4" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      eye(50.6) + eye(69.4) +
      `<g transform="translate(60.4 49.6) rotate(-5) scale(1.2)">${crown(k, 0.5, true)}</g>` +
      water(k, 91, 2.2, 4, P.mid, P.night, P.sky, 1, -6, 126) +
      swell(24, 100, 96, 2, 4.4, P.sky2, 0.45) +
      foam(60, 91, 20, 2.2, 8, 0.9) +
      drop(36.6, 85, -30, 0.8) + drop(83.4, 85, 30, 0.8) + drop(31, 89.4, -50, 0.6) + drop(89, 89.4, 50, 0.6) +
      sparkle(92, 42, 2, P.goldL) + sparkle(28, 46, 1.4, P.paper) +
      k.defs()
    )
  },

  // ── Terror de piratas ──────────────────────────────────────────────

  // Tres piratas: ya tenés el look; la calavera de la bandera con pañuelo, parche y diente de oro.
  'Parche en el ojo': (u) => {
    const k = kit(u)
    const bandana = 'M-13.2 -6.4C-12.8 -12.6 -7.6 -15.4 0 -15.4C7.6 -15.4 12.8 -12.6 13.2 -6.4C8 -9.6 -8 -9.6 -13.2 -6.4Z'
    const tails = 'M12.4 -8.4C16 -8.6 19.2 -7.4 21.4 -4.8C18.6 -4.8 16.8 -4 15.6 -2.6C17.8 -1.2 19 1.2 19.2 4.2C16.6 2.6 14.2 .6 12.4 -2.2Z'
    const patch = 'M.8 -3.2C.8 -4.6 9.8 -4.6 9.8 -3.2V1.4C9.8 4.6 7.6 6.2 5.3 6.2C3 6.2 .8 4.6 .8 1.4Z'
    const dots = ([[-8, -11.6], [-3, -13.4], [2.6, -13], [7.4, -11.4], [-5.4, -9.6], [0, -10.6], [5, -9.6], [10.6, -8.8], [-10.6, -8.8]] as Pt[]).map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.white}"/>`).join('')
    return (
      k.day() +
      k.sun(60, 58, 18, 46, 28, false) +
      `<g transform="translate(59 55) scale(1.52)">` +
      bone(k, 0, 12, 34, 33) + bone(k, 0, 12, -34, 33) +
      skull(k, '', 0.5, true) +
      `<path d="M-12.8 -7.4L1.8 -3.4M9.6 -1.6L13.4 .6" stroke="${P.night}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="${patch}" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M1.8 -2.8H8.8V1.2C8.8 3.8 7 5.2 5.3 5.2C3.6 5.2 1.8 3.8 1.8 1.2Z" fill="none" stroke="${P.mid}" stroke-width=".3" stroke-dasharray=".6 .5"/>` +
      `<path d="M2.6 -2Q4.4 -2.8 6.4 -2.2" fill="none" stroke="${P.sky2}" stroke-width=".4" stroke-linecap="round"/><circle cx="5.3" cy="1.2" r=".7" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/>` +
      `<circle cx="-5.4" cy=".6" r=".9" fill="${P.goldL}"/><circle cx="-5.7" cy=".3" r=".3" fill="#fff"/>` +
      k.draw([
        { d: tails, fill: P.red, inner: k.sh(tails, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + hair(13.6, -7.4, 17, -7.4, 20, -5.4, 0.35, P.wine) + hair(13.8, -4.6, 16.4, -2.4, 18.2, 2, 0.35, P.wine) },
        { d: bandana, fill: P.red, inner: dots + k.sh(bandana, 0, 0, 1, 1, 0, 0.85, P.wine, 0.4) + `<path d="M-10.4 -9.6C-9 -12.6 -5.6 -14.4 -1.6 -14.6" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".5"/>` + hair(-4, -9.2, 2, -11.4, 9, -10.6, 0.35, P.wine) },
      ], 0.45) +
      `<circle cx="12.8" cy="-7.4" r="2" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><path d="M11.8 -8L13.6 -6.8" stroke="${P.wine}" stroke-width=".35"/>` +
      `</g>` +
      sparkle(32, 40, 2.4) + sparkle(88, 76, 1.6) +
      k.defs()
    )
  },

  // Doce piratas: la pata de palo, torneada y con correas, golpeando la cubierta. Toc, toc.
  'Pata de palo': (u) => {
    const k = kit(u)
    const deck = 'M10 87.6H110V112H10Z'
    const planks = [92.4, 97.4].map((y) => `<path d="M10 ${y}H110" stroke="${P.brownD}" stroke-width=".55"/>`).join('') +
      ([[34, 87.6, 92.4], [80, 87.6, 92.4], [50, 92.4, 97.4], [72, 92.4, 97.4]] as const).map(([x, a, b]) => `<path d="M${x} ${a}V${b}" stroke="${P.brownD}" stroke-width=".5"/>`).join('') +
      [[37, 90], [77, 90], [53, 95], [69, 95]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".4" fill="${P.brownD}"/>`).join('') +
      hair(16, 90, 26, 89.4, 36, 90.2, 0.4, P.brownD) + hair(40, 95, 48, 94.4, 56, 95.2, 0.4, P.brownD)
    return (
      k.day() +
      k.stage(60, 56, 34) +
      k.draw([{ d: deck, fill: P.brown, inner: planks + k.sh(deck, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M10 88.2H110" stroke="${P.goldL}" stroke-width=".6" opacity=".6"/>` }], 0.6) +
      k.floor(65.4, 89, 12, 1.8, P.brownD) +
      `<g transform="translate(64.4 89.8) rotate(-17) scale(.9)">${pegLeg(k)}</g>` +
      hair(59.4, 86.6, 56.4, 85.2, 53.4, 85.2, 0.55) + hair(60.4, 83.6, 57.8, 81.2, 55.6, 79.6, 0.5) + hair(69.8, 87, 72.8, 85.6, 75.8, 85.6, 0.55) + hair(69.2, 84, 71.8, 81.6, 74.2, 80.2, 0.5) +
      `<text x="84" y="62" ${GEORGIA} font-style="italic" font-size="7" fill="${P.ink}" text-anchor="middle" transform="rotate(-10 84 62)">toc,</text>` +
      `<text x="86" y="73" ${GEORGIA} font-style="italic" font-size="7" fill="${P.ink}" text-anchor="middle" transform="rotate(-10 86 73)">toc</text>` +
      sparkle(84, 40, 2.2) + sparkle(32, 72, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco piratas: de Barba Negra sólo se ven el tricornio, los ojos encendidos y la barba trenzada que humea.
  'Barba Negra': (u) => {
    const k = kit(u)
    const crownH = 'M-13.4 -5C-13.6 -15.4 -7.4 -21 0 -21C7.4 -21 13.6 -15.4 13.4 -5Z'
    const brim = 'M-28.4 -3.4C-21 -10.4 -11 -9 0 -13.6C11 -9 21 -10.4 28.4 -3.4C22 .8 12.4 2.6 4.4 7.8L0 10.6L-4.4 7.8C-12.4 2.6 -22 .8 -28.4 -3.4Z'
    const brimTop = 'M-28.4 -3.4C-21 -10.4 -11 -9 0 -13.6C11 -9 21 -10.4 28.4 -3.4'
    const face = 'M-13.4 6C-13 13 -8 18.6 0 18.6C8 18.6 13 13 13.4 6C8 9 4 9.6 0 10.6C-4 9.6 -8 9 -13.4 6Z'
    const beard = 'M-15.4 12C-17.6 21 -15.8 30 -11 37.6C-8 42.4 -4 45.6 0 48.6C4 45.6 8 42.4 11 37.6C15.8 30 17.6 21 15.4 12C11 17.4 6 19.6 0 19.6C-6 19.6 -11 17.4 -15.4 12Z'
    const stache = 'M0 16.4C-2.4 14.2 -7 14.4 -9.6 16.6C-11.4 18.2 -13 17.6 -13.6 16.2C-13.4 19.8 -10.2 21.4 -6.6 20.6C-3.8 20 -1.6 18.8 0 18C1.6 18.8 3.8 20 6.6 20.6C10.2 21.4 13.4 19.8 13.6 16.2C13 17.6 11.4 18.2 9.6 16.6C7 14.4 2.4 14.2 0 16.4Z'
    const braid = (x: number, y0: number, n: number) => Array.from({ length: n }, (_, i) => `<path d="${ellipse(x, f(y0 + i * 2.6), 1.7, 1.6)}" fill="${P.night}" stroke="${P.mid}" stroke-width=".35"/><path d="M${f(x - 1.2)} ${f(y0 + i * 2.6 - 0.6)}Q${x} ${f(y0 + i * 2.6 + 0.6)} ${f(x + 1.2)} ${f(y0 + i * 2.6 - 0.6)}" fill="none" stroke="${P.mid}" stroke-width=".3"/>`).join('')
    const bow = (x: number, y: number) => `<path d="M${x} ${y}C${x - 1.6} ${y - 2} ${x - 3.6} ${y - 1.2} ${x - 3.2} ${y + 0.6}C${x - 2.8} ${y + 1.8} ${x - 1} ${y + 1} ${x} ${y}C${x + 1} ${y + 1} ${x + 2.8} ${y + 1.8} ${x + 3.2} ${y + 0.6}C${x + 3.6} ${y - 1.2} ${x + 1.6} ${y - 2} ${x} ${y}Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>`
    const fuse = (x0: number, y0: number, x1: number, y1: number) =>
      `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M${x0} ${y0}L${x1} ${y1}" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="${starPath(x1, y1, 3, 0.9, 6)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/><circle cx="${x1}" cy="${y1}" r=".9" fill="${P.goldL}"/>`
    const smoke = (x: number, y: number, dir: number) =>
      hair(x, y, x + dir * 4, y - 5, x, y - 9, 1.1, P.sky2) + hair(x, y - 9, x - dir * 4, y - 13, x + dir * 1, y - 18, 0.9, P.sky2) + hair(x + dir * 1, y - 18, x + dir * 4, y - 21, x + dir * 1, y - 25, 0.7, P.sky2)
    const strands = [-11, -7.4, -3.6, 0, 3.6, 7.4, 11].map((x, i) => hair(x * 0.95, 21, x * 1.15 + (i % 2 ? 1 : -1), 31, x * 0.55, 43 - Math.abs(x) * 0.6, 0.55, P.mid)).join('') +
      [-9, -5, 5, 9].map((x) => hair(x, 26, x * 1.1, 32, x * 0.8, 38, 0.4, P.sky2, 0.6)).join('')
    const embers = [[30, 52, 0.7], [90, 50, 0.6], [26, 72, 0.5], [94, 74, 0.5], [34, 84, 0.5], [86, 88, 0.6], [44, 26, 0.5], [76, 24, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.gold}"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${P.night}"/>` +
      `<g opacity=".6">${k.sun(60, 54, 20, 50, 28, false)}</g>` +
      k.shade(FULL, k.rad(P.gold, 0.5, 0.44, 0.45, 0.75, 0), P.goldD, 0.35) +
      embers +
      `<g transform="translate(60 47.4) scale(1.06)">` +
      smoke(-18.6, 13, -1) + smoke(18.6, 13, 1) +
      k.draw([{ d: face, fill: '#0E1533' }], 0.5) +
      `<path d="M-8.8 11.6Q-6 10 -3 12M8.8 11.6Q6 10 3 12" fill="none" stroke="${P.gold}" stroke-width="1.6" stroke-linecap="round"/><path d="M-8.4 11.6Q-6 10.6 -3.4 12M8.4 11.6Q6 10.6 3.4 12" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      k.shade(ellipse(-6, 11.4, 4, 2.4), k.rad(P.gold, 0.5, 0.5, 0.5, 0.7, 0), P.gold, 0.4) + k.shade(ellipse(6, 11.4, 4, 2.4), k.rad(P.gold, 0.5, 0.5, 0.5, 0.7, 0), P.gold, 0.4) +
      k.draw([{ d: beard, fill: P.night, inner: k.sh(beard, 0, 0, 1, 1, 0, 0.7, '#0E1533', 0.4) + strands }], 0.7) +
      braid(-4.4, 41, 3) + braid(4.4, 41, 3) + bow(-4.4, 48.6) + bow(4.4, 48.6) +
      k.draw([{ d: stache, fill: P.night, inner: hair(-11, 18, -7, 16.4, -2, 17, 0.4, P.mid) + hair(11, 18, 7, 16.4, 2, 17, 0.4, P.mid) }], 0.5) +
      fuse(-11.4, 26, -18.6, 13.4) + fuse(11.4, 26, 18.6, 13.4) +
      k.draw([
        { d: crownH, fill: P.night, inner: k.sh(crownH, 0, 0, 1, 0, 0, 0.6, '#0E1533', 0.4) + hair(-8, -12, -6, -17, -1, -19.4, 0.6, P.sky2, 0.7) },
        {
          d: brim, fill: P.night,
          inner:
            k.sh(brim, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) + `<path d="${brimTop}" fill="none" stroke="${P.gold}" stroke-width="2"/><path d="${brimTop}" fill="none" stroke="${P.goldL}" stroke-width=".5" transform="translate(0 -.4)"/>` +
            hair(-22, -2, -12, -4, -4, -1.6, 0.5, P.mid) + hair(22, -2, 12, -4, 4, -1.6, 0.5, P.mid),
        },
      ], 0.6) +
      [-24, -18, -12, 12, 18, 24].map((x) => `<circle cx="${x}" cy="${f(-6.2 + Math.pow(Math.abs(x) / 28, 2) * 2.6 - (Math.abs(x) < 15 ? 3.4 : 1.4))}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>`).join('') +
      `<circle cx="0" cy="-3.4" r="3" fill="${P.paper}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-1.1" cy="-3.6" r=".75" fill="${P.night}"/><circle cx="1.1" cy="-3.6" r=".75" fill="${P.night}"/><path d="M-.9 -1.6V-.9M0 -1.6V-.9M.9 -1.6V-.9" stroke="${P.night}" stroke-width=".3"/>` +
      `<path d="M-4.6 .4L4.6 3.4M-4.6 3.4L4.6 .4" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-4.6 .4L4.6 3.4M-4.6 3.4L4.6 .4" stroke="${P.paper}" stroke-width=".8" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(90, 60, 2, P.goldL) + sparkle(30, 62, 1.5, P.goldL) +
      k.defs()
    )
  },

  // ── Polizón ────────────────────────────────────────────────────────

  // Tres ceros: en la bodega, escondido en un barril de ron; sólo se te ven los ojos.
  'Polizón': (u) => {
    const k = kit(u)
    const body = 'M41.6 48C39.4 58 39.4 76 41.6 87C48 90.6 72 90.6 78.4 87C80.6 76 80.6 58 78.4 48C72 45 48 45 41.6 48Z'
    const hoop = (y: number, bulge: number) => `M${f(40 + bulge)} ${y}C48 ${f(y + 3)} 72 ${f(y + 3)} ${f(80 - bulge)} ${y}L${f(80 - bulge)} ${f(y + 3.2)}C72 ${f(y + 6.2)} 48 ${f(y + 6.2)} ${f(40 + bulge)} ${f(y + 3.2)}Z`
    const staves = [46, 53, 60, 67, 74].map((x) => hair(x, 50, x + (x - 60) * 0.14, 68, x, 87, 0.5, P.brownD)).join('')
    const grain = hair(43.6, 60, 44.2, 66, 43.8, 72, 0.35, P.brownD) + hair(50, 58, 50.6, 64, 50.2, 70, 0.35, P.brownD) + hair(64, 60, 64.4, 64, 64, 68, 0.35, P.brownD) + hair(70.6, 70, 71, 74, 70.6, 78, 0.35, P.brownD) + hair(56, 75, 56.4, 79, 56, 83, 0.35, P.brownD)
    const rim = ellipse(60, 47.6, 18.6, 3.6)
    const lid = ellipse(0, 0, 19, 3.8)
    const lidSide = 'M-19 0V2.4C-19 4.4 19 4.4 19 2.4V0C19 2 -19 2 -19 0Z'
    const boards = [28, 40, 52, 64, 76, 88].map((x) => `<path d="M${x} 0V96" stroke="${P.ink}" stroke-width=".6" opacity=".5"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${P.night}"/>` + boards +
      `<path d="M0 93H120V130H0Z" fill="${P.ink}"/>` + `<path d="M0 93H120" stroke="${P.mid}" stroke-width=".6"/>` +
      k.shade('M46 0H74L104 100H16Z', k.lin(P.goldL, 0, 0, 0, 1, 0.45, 0.05), P.goldL, 0.4) +
      k.shade(ellipse(60, 93, 32, 6), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.45) +
      `<g transform="translate(60 67) scale(1.14) translate(-60 -67)">` +
      k.floor(61, 89.4, 22, 2.6, '#000') +
      k.draw([
        { d: body, fill: P.brown, inner: staves + grain + k.sh('M64 40C74 52 76 70 74 92H84V40Z', 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + k.sh('M36 80H84V92H36Z', 0, 0, 0, 1, 0, 0.7, P.brownD, 0.3) + `<path d="M36 44H50V92H36Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.5, 0)}"/>` },
        { d: hoop(52, 0.6), fill: P.mid, inner: k.sh(hoop(52, 0.6), 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M42 53Q60 57 72 55.6" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` },
        { d: hoop(80, 0.8), fill: P.mid, inner: k.sh(hoop(80, 0.8), 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M42 81Q60 85 72 83.6" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` },
        { d: rim, fill: P.night },
      ], 0.7) +
      [44, 76].map((x) => `<circle cx="${x}" cy="53.8" r=".5" fill="${P.sky2}"/><circle cx="${x}" cy="81.8" r=".5" fill="${P.sky2}"/>`).join('') +
      `<text x="60" y="71.6" ${GEORGIA} font-weight="700" font-size="7" letter-spacing=".8" fill="${P.brownD}" opacity=".85" text-anchor="middle">RON</text>` +
      `<ellipse cx="54.4" cy="47.8" rx="2.3" ry="1.7" fill="${P.white}"/><ellipse cx="61.4" cy="47.8" rx="2.3" ry="1.7" fill="${P.white}"/>` +
      `<circle cx="53.4" cy="48" r="1" fill="${P.ink}"/><circle cx="60.4" cy="48" r="1" fill="${P.ink}"/><circle cx="53.1" cy="47.6" r=".3" fill="#fff"/><circle cx="60.1" cy="47.6" r=".3" fill="#fff"/>` +
      `<g transform="translate(62.4 41.2) rotate(-10)">` +
      k.draw([
        { d: lidSide, fill: P.brownD },
        { d: lid, fill: P.brown, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M-12 -1.6H10M-15 .6H16" stroke="${P.brownD}" stroke-width=".4"/>` + `<path d="M-14 -1.2Q-6 -3 4 -2.8" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>` },
      ], 0.6) +
      `</g>` +
      `</g>` +
      sparkle(90, 44, 1.8, P.goldL) +
      k.defs()
    )
  },

  // Doce ceros: a la deriva en una botella con el mensaje adentro, sin tocar una baza.
  'Botella al mar': (u) => {
    const k = kit(u)
    const glass = 'M-20 -8H6C10 -8 12 -3.4 15 -3.2H22V3.2H15C12 3.4 10 8 6 8H-20C-22.4 8 -23.4 6 -23.4 0C-23.4 -6 -22.4 -8 -20 -8Z'
    const lip = roundRect(21.4, -4, 24.4, 4, 1)
    const cork = 'M24.4 -2.8H29.4C30.2 -2.8 30.6 -2.2 30.6 -1.4V1.4C30.6 2.2 30.2 2.8 29.4 2.8H24.4Z'
    const scroll = roundRect(-18, -4.4, 4, 4.4, 2)
    return (
      k.day() +
      k.sun(60, 60, 18, 46, 28, false) +
      water(k, 70, 2, 6, P.sky, P.mid, P.white) +
      `<g transform="translate(57 66.4) rotate(-22) scale(1.25)">` +
      k.cast([glass, lip, cork], 0, 3) +
      k.draw([
        {
          d: glass, fill: P.sky1,
          inner:
            `<path d="${scroll}" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/>` + k.sh(scroll, 0, 0, 0, 1, 0, 0.7, P.brown, 0.3) +
            hair(-15, -2.6, -7, -3.2, 1, -2.6, 0.35, P.brown) + hair(-15, 2.4, -7, 1.8, 1, 2.4, 0.35, P.brown) +
            `<path d="M-8 -4.4V4.4M-6.4 -4.4V4.4" stroke="${P.red}" stroke-width=".9"/><circle cx="-7.2" cy="0" r="1.4" fill="${P.red}" stroke="${P.wine}" stroke-width=".35"/>` +
            `<path d="${ellipse(-18, 0, 1.3, 4.4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/><path d="M-18 -2.4Q-17 0 -18 2.4" fill="none" stroke="${P.brown}" stroke-width=".3"/>` +
            k.sh(glass, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M-20 -5.6H8" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/><path d="M-21.4 -3V2" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` +
            hair(-20, 6.2, -6, 7, 8, 5.4, 0.5, P.mid),
        },
        { d: lip, fill: P.sky1, inner: k.sh(lip, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) },
        { d: cork, fill: P.brown, inner: k.sh(cork, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.4) + `<circle cx="27" cy="-1" r=".4" fill="${P.brownD}"/><circle cx="28.6" cy="1" r=".4" fill="${P.brownD}"/><circle cx="26" cy="1.4" r=".3" fill="${P.brownD}"/>` },
      ], 0.55) +
      `<path d="M16.4 -3.6C16 -1 16 1 16.4 3.6M18.4 -3.4C18 -1 18 1 18.4 3.4" fill="none" stroke="${P.brownD}" stroke-width="1"/><path d="M18.4 3.4C19.4 6 18 8.6 16.4 9.6" fill="none" stroke="${P.brownD}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M14 -1.8Q17 -2.6 21 -2.2" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` +
      `</g>` +
      water(k, 74.6, 1.8, 5, P.sky, P.mid, P.white, 0.72, -2, 122) +
      foam(57, 76.4, 24, 2.6, 8) +
      swell(24, 100, 82, 3, 5.4) +
      sparkle(86, 40, 2.4) + sparkle(32, 46, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco ceros: el barco fantasma; estás, pero la luna se ve a través de las velas rotas.
  'Barco fantasma': (u) => {
    const k = kit(u)
    const moon = ellipse(62, 44, 23, 23)
    return (
      k.night() +
      stars([[28, 40], [92, 30], [30, 66], [96, 62], [40, 24], [84, 20], [24, 52]]) +
      `<path d="${moon}" fill="${P.paper}"/>` + k.shade(moon, k.rad(P.goldL, 0.4, 0.4, 0.7, 0, 0.8), P.goldL, 0.3) +
      `<path d="${ellipse(62, 44, 25.4, 25.4)}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      k.shade(ellipse(60, 62, 44, 34), k.rad(P.sky1, 0.5, 0.5, 0.5, 0.5, 0), P.sky1, 0.3) +
      water(k, 85, 2.6, 5, P.mid, P.night, P.sky2) +
      [44, 56, 68, 80].map((x, i) => hair(x, 89 + (i % 2) * 2, x + 1, 95, x - 0.6, 101, 0.8, P.sky2, 0.6)).join('') +
      `<g transform="translate(64.6 78.6) scale(.94)" opacity=".86">${ship(k, true)}</g>` +
      [[46.6, 81.6], [55, 82.2], [63.4, 82]].map(([x, y]) => k.shade(ellipse(x, y, 3.4, 2.6), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.5)).join('') +
      k.shade('M10 83C30 80 50 86 70 83C86 81 100 85 112 83V95H10Z', k.lin(P.white, 0, 0, 0, 1, 0.55, 0.05), P.white, 0.35) +
      hair(24, 84, 38, 81.6, 52, 84, 0.7, P.white, 0.8) + hair(68, 85, 82, 82.6, 96, 85, 0.7, P.white, 0.8) +
      swell(26, 100, 95, 2, 4.4, P.sky2, 0.45) +
      sparkle(92, 48, 2.2, P.paper) + sparkle(28, 30, 1.5, P.paper) +
      k.defs()
    )
  },

  // ── Navegante exacto ───────────────────────────────────────────────

  // Seis rondas: el catalejo en primer plano; en el horizonte, contra el sol, ya asoma la baza (un barco con una carta de vela).
  'Catalejo': (u) => {
    const k = kit(u)
    const brass = (d: string) => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.45) + `<path d="M-40 -10H40V-2.4H-40Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.6, 0)}"/>` })
    const ring = (x: number, r: number) => brass(roundRect(f(x - 1.3), -r, f(x + 1.3), r, 0.6))
    const leather = roundRect(-20.4, -6.6, -1.2, 6.6, 0.8)
    const lens = ellipse(-27.6, 0, 2.4, 7)
    const boat = 'M-7.4 0H7.4L5.2 3.8H-5.2Z'
    const hz = 53
    const sunD = ellipse(60, hz, 9.6, 9.6)
    return (
      k.day() +
      k.clip(`M0 0H120V${hz}H0Z`, k.sun(60, hz, 11, 46, 28, false) + `<path d="${sunD}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/>` + k.clip(sunD, k.sh(sunD, 0, 0, 1, 1, 0, 1, P.goldD, 0.4))) +
      `<path d="M-4 ${hz}H124V130H-4Z" fill="${P.sky}"/>` + k.sh(`M-4 ${hz}H124V130H-4Z`, 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) +
      k.shade(`M53 ${hz}H67L72 100H48Z`, k.lin(P.goldL, 0, 0, 0, 1, 0.85, 0), P.goldL, 0.45) +
      `<path d="M-4 ${hz}H124" stroke="${P.ink}" stroke-width=".55"/>` +
      swell(18, 106, 58, 6, 6, P.white, 0.5) +
      `<g transform="translate(60 ${hz - 0.4})">` +
      k.draw([{ d: boat, fill: P.brown, inner: k.sh(boat, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) }], 0.4) + `<path d="M0 0V-14" stroke="${P.ink}" stroke-width=".8"/>` +
      `<g transform="rotate(5 0 -7.6)">` + k.draw([{ d: roundRect(-5, -14, 5, -2, 1), fill: P.white, inner: k.sh('M1 -15H6V-1H1Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) }], 0.45) +
      `<path d="M0 -5.8C-2.8 -7.6 -2.7 -10.2 -1.2 -10.3C-.4 -10.3 -.1 -10 0 -9.4C.1 -10 .4 -10.3 1.2 -10.3C2.7 -10.2 2.8 -7.6 0 -5.8Z" fill="${P.red}"/>` +
      `<text x="-3.2" y="-11" ${GEORGIA} font-weight="700" font-size="2.8" fill="${P.red}" text-anchor="middle">A</text></g>` +
      `<path d="M0 -14L3.2 -15.2L0 -16.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      `<g transform="translate(60 71) rotate(9) scale(1.08)">` +
      k.cast([roundRect(-28, -7.6, 28.6, 7.6, 2)], 1.4, 2.4) +
      k.draw([
        brass(roundRect(23, -2.8, 28.6, 2.8, 0.8)),
        brass(roundRect(12.4, -3.8, 23.6, 3.8, 0.6)),
        brass(roundRect(-1.6, -5, 13, 5, 0.6)),
        {
          d: leather, fill: P.brown,
          inner:
            k.sh(leather, 0, 0, 0, 1, 0, 0.95, P.brownD, 0.45) + `<path d="M-20 -4H-1.6" stroke="${P.goldL}" stroke-width=".8" opacity=".45"/>` +
            [-17, -13, -9, -5].map((x) => `<path d="M${x} -6.6L${x + 2} 6.6" stroke="${P.brownD}" stroke-width=".5"/>`).join('') +
            `<path d="M-20 -5.4H-1.6M-20 5.4H-1.6" stroke="${P.goldL}" stroke-width=".35" stroke-dasharray=".8 .8" opacity=".75"/>`,
        },
        brass(roundRect(-28.4, -7.6, -20.2, 7.6, 1)),
        ring(-1.4, 5.6), ring(12.6, 4.6), ring(23, 3.4), ring(27.6, 3.2),
      ], 0.6) +
      `<path d="M1 -1.6C3 -3.4 5 -3.4 6 -1.6C7 .2 9 .2 11 -1.6" fill="none" stroke="${P.goldD}" stroke-width=".4"/><path d="M1 2C3 .2 5 .2 6 2C7 3.8 9 3.8 11 2" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
      `<path d="M15 -2.8H21" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>` +
      hair(-27, -5.8, -24, -6.6, -21, -5.8, 0.5, '#fff') + `<path d="M-26.6 -2.6H-22M-26.6 2.6H-22" stroke="${P.goldD}" stroke-width=".35"/>` +
      `<path d="${lens}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".6"/>` + `<path d="${ellipse(-27.6, 0, 1.5, 5)}" fill="${P.sky2}"/>` + `<path d="M-27.6 -4.6Q-26.4 -2 -27.2 1" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(33, 50, 2.2) + sparkle(87, 40, 1.8) +
      k.defs()
    )
  },

  // Ocho rondas: la daga clavada justo en la cruz del mapa.
  'Mapa del tesoro': (u) => {
    const k = kit(u)
    const sheet = 'M34 39.4C46 38 74 38 86 39.4V80.6C74 82 46 82 34 80.6Z'
    const rollL = roundRect(29.4, 37, 36.4, 83, 3.5), rollR = roundRect(83.6, 37, 90.6, 83, 3.5)
    const island = 'M45 66C43 60 47 53 54 52C58 48.6 66 48.6 70 52C77 53 80 59 77 65C80 71 73 76 66 74C61 77 53 77 50 73C45 73 43 69 45 66Z'
    const trail = 'M42 76C48 75 49 70 54 69C59 68 59 63 63.4 61.2'
    const rose = starPath(44, 46.6, 5.6, 1.2, 4, -90)
    const blade = 'M-1.7 0L-2.1 -6V-18H2.1V-6L1.7 0Z'
    const guard = 'M-6.6 -20.4C-5 -19.2 5 -19.2 6.6 -20.4L6.2 -18.2C4.6 -17.4 -4.6 -17.4 -6.2 -18.2Z'
    const grip = roundRect(-1.5, -28.2, 1.5, -19.6, 0.8)
    const pommel = ellipse(0, -30, 2.3, 2.3)
    const marks = ([[40, 58], [80, 46], [80, 74], [70, 44], [38, 70]] as Pt[]).map(([x, y]) => `<path d="M${x - 2.4} ${y}q1.2 -1.2 2.4 0t2.4 0" fill="none" stroke="${P.blue}" stroke-width=".45"/>`).join('')
    const rhumbs = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return `<path d="M44 46.6L${f(44 + Math.cos(a) * 60)} ${f(46.6 + Math.sin(a) * 60)}" stroke="${P.brown}" stroke-width=".25" opacity=".55"/>`
    }).join('')
    const palm = `<path d="M57 60Q57.6 55 56 51" fill="none" stroke="${P.brownD}" stroke-width="1"/>` +
      ['M56 51C53 49 50 50 49 52', 'M56 51C58.4 48.4 62 48.4 63.4 50.6', 'M56 51C55 48 52.6 46.8 50.6 47.2', 'M56 51C57.6 48 60.4 46.6 62.4 47.4'].map((d) => `<path d="${d}" fill="none" stroke="${P.greenD}" stroke-width="1.2" stroke-linecap="round"/>`).join('')
    return (
      k.day() +
      k.stage(60, 60, 34) +
      `<g transform="rotate(-6 60 60)">` +
      k.cast([sheet, rollL, rollR], 2, 2.2) +
      k.draw([{
        d: sheet, fill: P.paper,
        inner:
          rhumbs + k.shade(sheet, k.rad(P.brown, 0.5, 0.5, 0.62, 0, 0.75), P.brown, 0.3) + marks +
          `<path d="${island}" fill="none" stroke="${P.blue}" stroke-width=".4" transform="translate(61 63) scale(1.13) translate(-61 -63)" stroke-dasharray=".8 1"/>` +
          `<path d="${island}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".55"/>` + k.clip(island, k.sh(island, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.3)) +
          palm +
          `<path d="${trail}" fill="none" stroke="${P.red}" stroke-width=".8" stroke-dasharray="1.4 1.2"/>` +
          `<path d="${rose}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="${starPath(44, 46.6, 3.2, 0.8, 4, -45)}" fill="${P.goldD}"/><circle cx="44" cy="46.6" r=".7" fill="${P.paper}" stroke="${P.ink}" stroke-width=".25"/>` +
          `<text x="44" y="39.8" ${GEORGIA} font-weight="700" font-size="3" fill="${P.ink}" text-anchor="middle">N</text>`,
      }], 0.6) +
      k.draw([
        { d: rollL, fill: P.paper, inner: k.sh(rollL, 0, 0, 1, 0, 0, 0.8, P.brown, 0.4) + hair(31, 40, 31.4, 60, 31, 80, 0.4, '#fff') },
        { d: rollR, fill: P.paper, inner: k.sh(rollR, 0, 0, 1, 0, 0, 0.8, P.brown, 0.4) + hair(85.2, 40, 85.6, 60, 85.2, 80, 0.4, '#fff') },
      ], 0.6) +
      `<path d="M60.4 57.4L67.6 64.6M67.6 57.4L60.4 64.6" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M60.4 57.4L67.6 64.6M67.6 57.4L60.4 64.6" stroke="${P.red}" stroke-width="1.7" stroke-linecap="round"/>` +
      `</g>` +
      k.shade('M64.6 61L74 30L78.6 31.4L67.6 62Z', k.lin(P.ink, 0, 0, 0, 1, 0, 0.5), P.ink, 0.22) +
      `<g transform="translate(63.4 60.6) rotate(10)">` +
      k.draw([
        { d: blade, fill: P.white, inner: k.sh(blade, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M0 -1V-17" stroke="${P.sky2}" stroke-width=".55"/>` + hair(-1.3, -3, -1.3, -10, -1.3, -17, 0.4, '#fff') },
        { d: grip, fill: P.brownD, inner: [-26.6, -24.4, -22.2].map((y) => `<path d="M-1.5 ${y}L1.5 ${y - 1.2}" stroke="${P.brown}" stroke-width=".55"/>`).join('') },
        { d: guard, fill: P.gold, inner: k.sh(guard, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) },
        { d: pommel, fill: P.gold, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) + `<circle cx="-.7" cy="-30.7" r=".55" fill="#fff"/>` },
      ], 0.55) +
      `<circle cx="0" cy="-18.9" r=".8" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>` +
      `</g>` +
      hair(56.6, 62, 59, 61.4, 61, 62.6, 0.45) + hair(66, 62.8, 68.4, 62.4, 70.6, 63, 0.45) +
      sparkle(88, 32, 2.2) + sparkle(30, 88, 1.4) +
      k.defs()
    )
  },

  // Diez de diez: el cofre abierto, desbordado de doblones que saltan para repartir.
  'Cofre del tesoro': (u) => {
    const k = kit(u)
    const lid = 'M37.4 63L39.4 41C44 34 76 34 80.6 41L82.6 63Z'
    const pile = 'M34 66C36 57 46 50.6 60 50.6C74 50.6 84 57 86 66Z'
    const front = 'M34 66H86V91C86 92.2 85.2 93 84 93H36C34.8 93 34 92.2 34 91Z'
    const rim = 'M32.6 63.6H87.4V68.4H32.6Z'
    const lock = 'M55.4 70H64.6V78.6C64.6 80.6 62.6 82 60 82C57.4 82 55.4 80.6 55.4 78.6Z'
    const band = (x: number) => `M${x - 1.8} 68.4H${x + 1.8}V93H${x - 1.8}Z`
    const pileCoins = ([[42, 63, 2.6], [48, 60.4, 2.8], [54.4, 58, 2.8], [61, 57.4, 2.8], [67.4, 58.6, 2.8], [73.6, 60.6, 2.8], [79, 63.4, 2.4], [51, 64.4, 2.6], [64, 63, 2.8], [57.6, 53.8, 2.4], [70.4, 54.6, 2.2], [45.6, 66, 2.2], [76, 66, 2.2]] as const)
      .map(([x, y, r]) => coin(k, x, y, r)).join('')
    const gem = (x: number, y: number, c: string, dk: string, s: number) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 -1.4L-1.6 -3H1.6L3 -1.4L0 3Z" fill="${c}" stroke="${P.ink}" stroke-width=".45"/><path d="M-3 -1.4H3M-1.6 -3L-.8 -1.4L0 3L.8 -1.4L1.6 -3" fill="none" stroke="${dk}" stroke-width=".3"/><path d="M-1.6 -2.4L-.9 -1.6" stroke="#fff" stroke-width=".4"/></g>`
    const pearls = along(36, 70, 42, 82, 50, 77, [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 1]).map((q) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="1.15" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    const wood = hair(36, 72, 40, 71.4, 42, 72.4, 0.35, P.brownD) + hair(48, 80, 52, 79.4, 54, 80.4, 0.35, P.brownD) + hair(66, 88, 70, 87.4, 74, 88.4, 0.35, P.brownD) + hair(78, 72, 80, 71.6, 84, 72.2, 0.35, P.brownD)
    return (
      k.day() +
      k.sun(60, 56, 18, 47, 28, false) +
      k.floor(61, 89.6, 28, 2.6) +
      `<g transform="translate(60 63) scale(.95) translate(-60 -66)">` +
      k.draw([{ d: lid, fill: P.brownD, inner: k.sh(lid, 0, 0, 0, 1, 0.2, 0.9, P.night, 0.4) + `<path d="M44 38V63M76 38V63" stroke="${P.gold}" stroke-width="2.6"/><path d="M44 38V63M76 38V63" stroke="${P.goldD}" stroke-width=".5"/>` + `<path d="M39 46C46 41 74 41 81 46" fill="none" stroke="${P.brown}" stroke-width=".6"/>` }], 0.7) +
      k.draw([{ d: pile, fill: P.goldD, inner: k.sh(pile, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) }], 0.6) +
      pileCoins + gem(53, 54.4, P.red, P.wine, 1.15) + gem(74.6, 58.4, P.sky, P.mid, 1.05) + gem(62.6, 50.6, P.green, P.greenD, 0.95) +
      k.draw([
        { d: front, fill: P.brown, inner: k.sh(front, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + k.sh('M30 84H90V94H30Z', 0, 0, 0, 1, 0, 0.6, P.brownD, 0.3) + `<path d="M34 76H86M34 84.4H86" stroke="${P.brownD}" stroke-width=".5"/>` + wood + `<path d="${band(44)}${band(76)}" fill="${P.gold}"/>` + `<path d="${band(44)}${band(76)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` },
        { d: rim, fill: P.gold, inner: k.sh(rim, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M33 64.6H66" stroke="#fff" stroke-width=".7" opacity=".6"/>` },
        { d: lock, fill: P.gold, inner: k.sh(lock, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M56.4 71H60" stroke="#fff" stroke-width=".6" opacity=".7"/>` },
      ], 0.75) +
      `<path d="M60 72.6C61 72.6 61.6 73.3 61.6 74.1C61.6 74.7 61.3 75.1 60.9 75.4L61.4 78.6H58.6L59.1 75.4C58.7 75.1 58.4 74.7 58.4 74.1C58.4 73.3 59 72.6 60 72.6Z" fill="${P.ink}"/>` +
      [[44, 70], [76, 70], [44, 90.4], [76, 90.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="${P.goldD}"/>`).join('') +
      [[34, 68.4, 1, 1], [86, 68.4, -1, 1], [34, 93, 1, -1], [86, 93, -1, -1]].map(([x, y, sx, sy]) =>
        `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 0H7.4V2.2H2.2V7.4H0Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M2.2 2.2C4.6 2.4 5.6 4.2 4.8 5.6C4.2 6.6 2.8 6.2 3 5.2" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round"/><circle cx="1.1" cy="1.1" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/></g>`).join('') +
      [72, 77, 82, 87].map((y) => `<circle cx="44" cy="${y}" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/><circle cx="76" cy="${y}" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>`).join('') +
      [38, 50, 70, 82].map((x) => `<circle cx="${x}" cy="66" r=".5" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>`).join('') +
      [44, 76].map((x) => [42, 48, 54, 60].map((y) => `<circle cx="${x}" cy="${y}" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>`).join('')).join('') +
      pearls +
      `</g>` +
      coin(k, 29.4, 52, 3, -20, 0.55) + coin(k, 90.6, 48, 3, 24, 0.6) + coin(k, 35.4, 38.6, 2.6, 30, 0.5) + coin(k, 85.6, 35.6, 2.4, -18, 0.8) +
      hair(33, 56, 36, 59, 39, 60, 0.5) + hair(87, 52, 84, 56, 81, 57.6, 0.5) + hair(38, 43, 40, 47, 42, 49, 0.45) + hair(83, 40, 81, 44, 79, 46, 0.45) +
      sparkle(60, 40, 2.4) + sparkle(30, 70, 1.5) + sparkle(92, 66, 1.4) +
      k.defs()
    )
  },
}
