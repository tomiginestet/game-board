// EA Sports FC (FIFA), en clave heroica. El cian de la ficha del juego es el color propio (la franja de los botines,
// los guantes, el joystick) y el papel del día lleva su grano cian. Nada de la marca: ni logos ni escudos.
// A las personas reales (Goyco, el Dibu, Higuita) no se las dibuja: aparecen por sus objetos.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Cian de la ficha del juego, con su sombra, su luz y un cian pálido para reflejos. */
const FC = '#0CA0E8', FC_D = '#07639A', FC_L = '#62C4F0', FC_XL = '#CBEBFA'
/** Verde césped y el de la camiseta de Brasil. */
const GRASS = '#6E9B45', GRASS_D = '#4A6E2C'
/** Aluminio de la olla y llama de hornalla. */
const ALU = '#DCE3EE', ALU_D = '#8C9AB8'
const FULL = 'M0 0H120V130H0Z'

/** Papel del día con el borde granulado en el cian de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#B2DCF0', 0.5, 0.46, 0.7, 0, 1), '#8CC4E4', 0.45)

// ── La pelota: un icosaedro truncado de verdad, proyectado sobre la esfera ──────────────────────────────

type V = [number, number, number]
const PHI = (1 + Math.sqrt(5)) / 2
const norm = (v: V): V => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l] }
const lerp = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const ICO: V[] = ([[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]] as V[]).map(norm)
const NB = ICO.map((v, i) => ICO.map((_, j) => j).filter((j) => j !== i && Math.hypot(v[0] - ICO[j][0], v[1] - ICO[j][1], v[2] - ICO[j][2]) < 1.1))

/** Pelota de gajos (pentágonos de tinta y hexágonos blancos) en (cx,cy) de radio r; `a`,`b`,`c` giran la esfera. */
function ball(k: Kit, cx: number, cy: number, r: number, o: { a?: number; b?: number; c?: number; fill?: string; patch?: string; shade?: string; w?: number } = {}) {
  const [a, b, c] = [o.a ?? 0.5, o.b ?? -0.35, o.c ?? 0.25]
  const rot = (v: V): V => {
    let [x, y, z] = v
    ;[y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]
    ;[x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)]
    ;[x, y] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)]
    return [x, y, z]
  }
  const V3 = ICO.map(rot)
  const pt = (v: V) => {
    let [x, y] = v
    if (v[2] < 0) { const l = Math.hypot(x, y) || 1; x /= l; y /= l }
    return `${f(cx + x * r)} ${f(cy - y * r)}`
  }
  const arc = (p: V, q: V, n = 4) => Array.from({ length: n }, (_, i) => pt(norm(lerp(p, q, (i + 1) / n))))
  let pents = '', seams = ''
  V3.forEach((v, i) => {
    if (v[2] < -0.3) return
    const n0 = V3[NB[i][0]], dv = v[0] * n0[0] + v[1] * n0[1] + v[2] * n0[2]
    const t1 = norm([n0[0] - v[0] * dv, n0[1] - v[1] * dv, n0[2] - v[2] * dv])
    const t2: V = [v[1] * t1[2] - v[2] * t1[1], v[2] * t1[0] - v[0] * t1[2], v[0] * t1[1] - v[1] * t1[0]]
    const ring = NB[i].map((j) => V3[j]).sort((p, q) => {
      const ang = (w: V) => Math.atan2((w[0] - v[0]) * t2[0] + (w[1] - v[1]) * t2[1] + (w[2] - v[2]) * t2[2], (w[0] - v[0]) * t1[0] + (w[1] - v[1]) * t1[1] + (w[2] - v[2]) * t1[2])
      return ang(p) - ang(q)
    }).map((w) => norm(lerp(v, w, 1 / 3)))
    pents += 'M' + pt(ring[0]) + ring.map((p, j) => 'L' + arc(p, ring[(j + 1) % 5]).join('L')).join('') + 'Z'
  })
  for (let i = 0; i < 12; i++) for (const j of NB[i]) {
    if (j < i) continue
    const p = lerp(V3[i], V3[j], 1 / 3), q = lerp(V3[i], V3[j], 2 / 3)
    if (norm(lerp(p, q, 0.5))[2] < -0.05) continue
    seams += 'M' + pt(norm(p)) + 'L' + arc(p, q, 3).join('L')
  }
  const d = ellipse(cx, cy, r, r)
  return k.draw([{
    d, fill: o.fill ?? P.white,
    inner:
      `<path d="${pents}" fill="${o.patch ?? P.night}" stroke="${P.ink}" stroke-width="${f(r * 0.03)}" stroke-linejoin="round"/>` +
      `<path d="${seams}" fill="none" stroke="${P.ink}" stroke-width="${f(r * 0.035)}" stroke-linecap="round"/>` +
      `<path d="${seams}" fill="none" stroke="#fff" stroke-width="${f(r * 0.02)}" stroke-linecap="round" transform="translate(${f(-r * 0.03)} ${f(-r * 0.03)})" opacity=".7"/>` +
      k.shade(d, k.rad(o.shade ?? P.blue, 0.32, 0.28, 0.85, 0, 0.8), o.shade ?? P.blue, 0.35) +
      `<ellipse cx="${f(cx - r * 0.38)}" cy="${f(cy - r * 0.42)}" rx="${f(r * 0.26)}" ry="${f(r * 0.14)}" fill="#fff" opacity=".8" transform="rotate(-38 ${f(cx - r * 0.38)} ${f(cy - r * 0.42)})"/>`,
  }], o.w ?? f(Math.min(0.8, r * 0.06)))
}

// ── El botín: de perfil, la punta a la derecha y la suela en y=0 ─────────────────────────────────────────

const BOOT = 'M-21 -1.2C-22.6 -5 -22.4 -11 -20.8 -15.4C-20 -17.8 -18.6 -19.3 -16.4 -19.4C-13.4 -19.6 -10.8 -18.8 -8.6 -17.4C-7.8 -19.4 -6.2 -20.6 -4.2 -20.4C-2.6 -20.2 -1.8 -19 -2.2 -17.4' +
  'C2 -14.8 7.6 -11.6 13 -9.2C17.6 -7.2 21.6 -5.8 23 -3.4C23.8 -2 23.4 -.6 22 0H-20C-20.6 0 -21 -.6 -21 -1.2Z'
const SOLE = 'M-21.2 -.6H22.4C23.6 -.6 24 .6 23.2 1.4C22.6 2 21.6 2.3 20.2 2.3H-19.4C-20.8 2.3 -21.8 1.4 -21.2 -.6Z'
const STUDS = [-17.6, -12.4, 1.6, 7.6, 13.4, 18.4]

/** Botín negro de cuero con la franja cian, cordones blancos y tapones. `studs` pinta los tapones (dorados en oro). */
function boot(k: Kit, o: { studs?: string; stripe?: string } = {}) {
  const studs = STUDS.map((x) => `M${f(x - 1.7)} 2.2L${f(x - 1)} 5H${f(x + 1)}L${f(x + 1.7)} 2.2Z`).join('')
  const stripe = 'M-13.6 -.4C-10 -6.4 -6 -11.4 -1.4 -15.4L1.8 -13.8C-2.4 -10 -6 -5.4 -8.8 -.4Z'
  const stripe2 = 'M-7.4 -.4C-4.6 -5 -1.4 -9 2.6 -12.6L4.6 -11.6C1 -8.2 -1.8 -4.4 -4.2 -.4Z'
  const eyelets = [0, 1, 2, 3, 4].map((i) => { const t = i / 4; return [-1.4 + t * 10.6, -16.4 + t * 5.6] })
  const laces = eyelets.map(([x, y]) => `<path d="M${f(x - 1.3)} ${f(y - 1.4)}L${f(x + 1.5)} ${f(y + 1.2)}M${f(x - 1.3)} ${f(y + 1.2)}L${f(x + 1.5)} ${f(y - 1.4)}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${f(x - 1.3)} ${f(y - 1.4)}L${f(x + 1.5)} ${f(y + 1.2)}M${f(x - 1.3)} ${f(y + 1.2)}L${f(x + 1.5)} ${f(y - 1.4)}" stroke="${P.white}" stroke-width=".8" stroke-linecap="round"/>`).join('')
  return (
    k.draw([
      { d: studs, fill: o.studs ?? P.white, inner: k.sh(studs, 0, 0, 1, 0, 0, 0.9, o.studs ? P.goldD : P.blue, 0.4) },
      { d: SOLE, fill: P.white, inner: k.sh(SOLE, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="M-20 .8H22" stroke="${P.sky}" stroke-width=".4"/>` },
      {
        d: BOOT, fill: P.night,
        inner:
          `<path d="M-24 -22H6C0 -16 -8 -12 -24 -10Z" fill="${k.lin(P.mid, 0, 0, 0, 1, 0.75, 0)}"/>` +
          k.sh('M4 -22H26V2H4Z', 0, 0, 1, 0, 0, 0.7, '#0F1736', 0.45) +
          `<path d="M-8.6 -17.4C-7.8 -19.4 -6.2 -20.6 -4.2 -20.4C-2.6 -20.2 -1.8 -19 -2.2 -17.4C-3.4 -16.6 -6.6 -16.4 -8.6 -17.4Z" fill="${P.mid}"/>` +
          `<path d="${stripe}" fill="${o.stripe ?? FC}"/><path d="${stripe2}" fill="${o.stripe ?? FC}"/>` +
          k.sh(stripe + stripe2, 0, 0, 0, 1, 0, 0.6, FC_D, 0.4) +
          `<path d="M-12.4 -1.6C-9 -6.8 -5.4 -11 -1.4 -14.4M-6.6 -1.6C-4 -5.6 -1 -9 2.4 -11.8" fill="none" stroke="${o.stripe ? P.goldL : FC_L}" stroke-width=".45"/>` +
          `<path d="M12.6 -9.4C15.4 -6.4 16.4 -3.4 16 0" fill="none" stroke="${P.mid}" stroke-width=".55"/>` +
          `<path d="M13.6 -8.8C16.4 -5.8 17.4 -3 17 0" fill="none" stroke="${P.mid}" stroke-width=".35" stroke-dasharray=".8 .7"/>` +
          `<path d="M-15.4 0C-15.8 -6 -16 -12 -16.6 -19" fill="none" stroke="${P.mid}" stroke-width=".55"/>` +
          `<path d="M-14.4 0C-14.8 -6 -15 -12 -15.6 -18.8" fill="none" stroke="${P.mid}" stroke-width=".35" stroke-dasharray=".8 .7"/>` +
          hair(-19.6, -4, -20.4, -10, -19, -16, 0.7, P.sky, 0.8) + hair(-1, -16.6, 6, -13, 13.6, -9.8, 0.6, P.sky, 0.7) + hair(15, -7.4, 19, -6, 21.6, -4, 0.55, '#fff', 0.8),
      },
    ], 0.7) +
    `<path d="M-1.6 -16.6L9.6 -10.6" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/>` +
    laces + `<path d="M-1.8 -15.6C-3.6 -13 -3 -10.6 -4.6 -8.6M-.4 -15.6C.4 -12.6 -.6 -10.4 .6 -8" fill="none" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>`
  )
}

// ── El guante de arquero: de frente, la palma a la vista, la muñeca abajo en y≈21 ───────────────────────────

const FINGERS: [number, number, number, number][] = [[-8.2, -21.6, 5.6, -9], [-2.7, -25.6, 5.6, -2], [2.8, -24.2, 5.6, 3], [8.2, -18.6, 5.2, 10]]
const fingerPath = (x: number, top: number, w: number) => `M${f(x - w / 2)} -4V${f(top + w / 2)}A${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(x + w / 2)} ${f(top + w / 2)}V-4Z`
const PALM = 'M-11 10C-12.4 4 -12.6 -2 -11.2 -7.4H11.2C12.4 -2 12.4 4 11 10Z'
const THUMB = 'M-10.6 7C-14.6 5 -17.8 .6 -19.4 -4.6C-20.2 -7.2 -18.8 -9.2 -16.6 -8.6C-14.6 -8 -13 -5.4 -10.8 -2.4Z'
const CUFF = roundRect(-9.6, 8, 9.6, 21.4, 2.4)

/** Guante de arquero (mano derecha, palma al frente): cáscara de color, látex claro en la palma y muñequera con abrojo. */
function glove(k: Kit, o: { shell?: string; shellD?: string; latex?: string; latexD?: string; strap?: string } = {}) {
  const shell = o.shell ?? FC, shellD = o.shellD ?? FC_D, latex = o.latex ?? P.white, latexD = o.latexD ?? P.blue
  const fingers = FINGERS.map(([x, top, w, r]) => ({ d: fingerPath(x, top, w), t: `rotate(${r} ${x} -4)`, fill: shell }))
  const inset = FINGERS.map(([x, top, w, r]) => `<path d="${fingerPath(x, top + 0.9, w - 1.8)}" transform="rotate(${r} ${x} -4)" fill="${latex}"/>` +
    `<path d="M${f(x - w / 2 + 1)} ${f(top + w * 0.9)}H${f(x + w / 2 - 1)}M${f(x - w / 2 + 1)} ${f(top + w * 1.9)}H${f(x + w / 2 - 1)}" transform="rotate(${r} ${x} -4)" stroke="${latexD}" stroke-width=".4" opacity=".7"/>`).join('')
  const dots = Array.from({ length: 24 }, (_, i) => { const x = -8.6 + (i % 6) * 3.4 + (Math.floor(i / 6) % 2) * 1.7, y = -4.6 + Math.floor(i / 6) * 3.4; return `<circle cx="${f(x)}" cy="${f(y)}" r=".42" fill="${latexD}" opacity=".55"/>` }).join('')
  return (
    k.draw([
      { d: THUMB, fill: shell, inner: `<path d="M-11.4 4.6C-14.6 2.6 -16.8 -.6 -18 -4.4C-18.4 -6 -17.6 -7 -16.6 -6.6C-15 -6 -13.6 -3.6 -11.6 -1Z" fill="${latex}"/>` + k.sh(THUMB, 0, 0, 0, 1, 0, 0.6, latexD, 0.3) },
      ...fingers,
      { d: PALM, fill: shell },
      { d: CUFF, fill: o.strap ?? P.night, inner: k.sh(CUFF, 0, 0, 1, 0, 0, 0.8, o.strap ? shellD : '#0F1736', 0.4) },
    ], 0.75) +
    inset +
    `<path d="M-9.8 10C-11 4 -11.2 -2 -10 -6.4H10C11 -2 11 4 9.8 10Z" fill="${latex}"/>` +
    k.clip('M-12 -8H12V10H-12Z', dots) +
    k.sh('M-13 -30H14V10H-13Z', 0, 0, 1, 0.4, 0, 0.5, latexD, 0.3) +
    `<path d="M-6 -4.6C-3 -3.4 3 -3.4 6 -4.6M-7 3C-3 5 3 5 7 3" fill="none" stroke="${latexD}" stroke-width=".45" opacity=".8"/>` +
    `<path d="M-10.6 11.6L10 18.4V21.4H6L-10.2 15.8Z" fill="${shell}"/><path d="M-10.6 11.6L10 18.4" stroke="${shellD}" stroke-width=".5"/>` +
    `<path d="M-9.6 8H9.6V9.6H-9.6Z" fill="${shellD}"/>` +
    hair(-7.4, -18, -7.8, -12, -7.2, -6, 0.6, '#fff', 0.85) + hair(-2.3, -21, -2.5, -14, -2, -6, 0.6, '#fff', 0.85) +
    (o.strap
      ? `<path d="M-6.4 19.6C-4 17 -1 16.6 1 17.6M-6.4 19.6C-5 21 -2.4 21.4 -.4 20.4" fill="none" stroke="${shellD}" stroke-width=".45"/>` +
        `<path d="${starPath(4.6, 15.4, 2.2, 0.9, 5)}" fill="${P.goldL}" stroke="${shellD}" stroke-width=".3"/>` +
        FINGERS.map(([x, top, w, r]) => `<path d="M${f(x - w / 2 + 0.6)} -4V${f(top + w / 2)}" transform="rotate(${r} ${x} -4)" stroke="${shellD}" stroke-width=".35" stroke-dasharray=".7 .6"/>`).join('')
      : '')
  )
}

// ── El joystick: genérico, de frente, centrado en (0,0) ──────────────────────────────────────────────────

const PAD = 'M-12 -11C-4 -12.6 4 -12.6 12 -11C18 -10.4 21 -7 22.4 -1C24 6 25 12 22 15C19 18 15 16.6 13 13C11 9.6 8 8 4 8H-4C-8 8 -11 9.6 -13 13C-15 16.6 -19 18 -22 15C-25 12 -24 6 -22.4 -1C-21 -7 -18 -10.4 -12 -11Z'

/** Joystick cian con cruceta, cuatro botones y dos palancas. */
function gamepad(k: Kit, body = FC, dark = FC_D) {
  const bumpers = 'M-19.4 -9.6C-17.6 -12.6 -14 -13.8 -9.6 -13.4L-9.2 -11.2C-13 -11 -16.4 -10.4 -19.4 -9.6ZM19.4 -9.6C17.6 -12.6 14 -13.8 9.6 -13.4L9.2 -11.2C13 -11 16.4 -10.4 19.4 -9.6Z'
  const cross = 'M-14.2 -4.6H-11.8V-2.2H-9.4V.2H-11.8V2.6H-14.2V.2H-16.6V-2.2H-14.2Z'
  const btn = (x: number, y: number, c: string) => `<circle cx="${x}" cy="${y}" r="1.75" fill="${c}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${f(x - 0.55)}" cy="${f(y - 0.55)}" r=".5" fill="#fff" opacity=".85"/>`
  const stick = (x: number, y: number) =>
    `<circle cx="${x}" cy="${y}" r="3.9" fill="${dark}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${x}" cy="${y}" r="2.9" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>` +
    `<circle cx="${x}" cy="${y}" r="2" fill="none" stroke="${P.mid}" stroke-width=".35" stroke-dasharray=".5 .5"/><path d="M${f(x - 1.8)} ${f(y - 1)}A2.2 2.2 0 0 1 ${f(x - 0.4)} ${f(y - 2.3)}" fill="none" stroke="${P.sky}" stroke-width=".5" stroke-linecap="round"/>`
  return (
    k.draw([{ d: bumpers, fill: P.night }], 0.5) +
    k.draw([{
      d: PAD, fill: body,
      inner:
        k.sh('M4 -14H26V20H4Z', 0, 0, 1, 0, 0, 0.75, dark, 0.45) + k.sh('M-26 6H26V20H-26Z', 0, 0, 0, 1, 0, 0.8, dark, 0.4) +
        `<path d="M-26 -14H-8V6H-26Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +

        hair(-20, 2, -21.4, 8, -20, 13, 0.6, dark) + hair(20, 2, 21.4, 8, 20, 13, 0.6, dark) +
        hair(-18, -8.4, -12, -10.6, -4, -11, 0.7, '#fff', 0.85),
    }], 0.75) +
    k.draw([{ d: cross, fill: P.night, inner: `<path d="M-14.2 -4.6H-11.8V-2.6H-14.2Z" fill="${P.mid}"/>` }], 0.35) +
    btn(12.6, -5.2, P.gold) + btn(16.2, -1.8, P.red) + btn(9, -1.8, P.sky) + btn(12.6, 1.6, P.green) +
    stick(-6, 4.4) + stick(6, 4.4) +
    `<path d="M-3.6 -9.6H3.6" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-3.4 -9.6H3.4" stroke="${FC_XL}" stroke-width=".6" stroke-linecap="round"/>`
  )
}

/** Red de arco: cuadrícula de hilos recortada a `d`, con `bend` desplazando cada nudo (para la red inflada o rota). */
function net(k: Kit, d: string, x0: number, y0: number, x1: number, y1: number, step: number, bend: (x: number, y: number) => [number, number] = (x, y) => [x, y], c = P.white, skip?: (x: number, y: number) => boolean) {
  let lines = ''
  const seg = (pts: [number, number][]) => {
    let cur: string[] = []
    const flush = () => { if (cur.length > 1) lines += 'M' + cur.join('L'); cur = [] }
    for (const [x, y] of pts) {
      if (skip && skip(x, y)) { flush(); continue }
      const [bx, by] = bend(x, y)
      cur.push(`${f(bx)} ${f(by)}`)
    }
    flush()
  }
  for (let x = x0; x <= x1 + 0.01; x += step) seg(Array.from({ length: Math.ceil((y1 - y0) / 1.2) + 1 }, (_, i) => [x, Math.min(y1, y0 + i * 1.2)] as [number, number]))
  for (let y = y0; y <= y1 + 0.01; y += step) seg(Array.from({ length: Math.ceil((x1 - x0) / 1.2) + 1 }, (_, i) => [Math.min(x1, x0 + i * 1.2), y] as [number, number]))
  return k.clip(d, `<path d="${lines}" fill="none" stroke="${P.ink}" stroke-width="1.05" stroke-linecap="round"/><path d="${lines}" fill="none" stroke="${c}" stroke-width=".5" stroke-linecap="round"/>`)
}

/** Nube de vapor entintada: un racimo de bollos redondos, cada uno con su sombra abajo a la derecha. */
const puff = (k: Kit, x: number, y: number, r: number) => {
  const balls: [number, number, number][] = [[-0.55, 0.18, 0.5], [0.5, 0.22, 0.48], [-0.15, -0.3, 0.62], [0.42, -0.2, 0.44], [0.05, 0.3, 0.52]]
  return k.draw(balls.map(([dx, dy, rr]) => {
    const d = ellipse(f(x + dx * r), f(y + dy * r), f(rr * r), f(rr * r))
    return { d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0.05, 0.8, P.sky2, 0.45) }
  }), f(Math.min(0.55, r * 0.08)))
}

/** Cinta con las puntas en cola de golondrina y un texto en cursiva sobre su curva. */
function banner(k: Kit, cx: number, cy: number, w: number, fill: string, dark: string, text: string, tc: string, fs = 4.4) {
  const x0 = cx - w / 2, x1 = cx + w / 2
  const band = `M${x0} ${f(cy - 3.6)}Q${cx} ${f(cy + 0.4)} ${x1} ${f(cy - 3.6)}V${f(cy + 3.4)}Q${cx} ${f(cy + 7.4)} ${x0} ${f(cy + 3.4)}Z`
  const tail = (x: number, s: number) => `M${f(x - s * 2)} ${f(cy - 1.6)}L${f(x + s * 7)} ${f(cy - 1.2)}L${f(x + s * 4.4)} ${f(cy + 2.4)}L${f(x + s * 7)} ${f(cy + 6)}L${f(x - s * 2)} ${f(cy + 5.6)}Z`
  const rid = k.id('ban')
  return (
    k.draw([{ d: tail(x0, -1), fill: dark }, { d: tail(x1, 1), fill: dark }], 0.5) +
    k.draw([{ d: band, fill, inner: k.sh(band, 0, 0, 0, 1, 0, 0.6, dark, 0.35) + `<path d="M${x0} ${f(cy - 2.4)}Q${cx} ${f(cy + 1.6)} ${x1} ${f(cy - 2.4)}M${x0} ${f(cy + 2.2)}Q${cx} ${f(cy + 6.2)} ${x1} ${f(cy + 2.2)}" fill="none" stroke="${P.goldL}" stroke-width=".35"/>` }], 0.55) +
    `<path id="${rid}" d="M${x0} ${f(cy + 1.4)}Q${cx} ${f(cy + 5.2)} ${x1} ${f(cy + 1.4)}" fill="none"/>` +
    `<text ${GEORGIA} font-style="italic" font-weight="700" font-size="${fs}" fill="${tc}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`
  )
}

/** Ala de plumas, como la de las insignias: el hombro en (0,0), la punta arriba a la derecha y las remeras abajo. */
const WING = 'M0 -3C7 -9.4 17 -17 31.6 -22.2C30.6 -19 28.8 -16.6 26.4 -15C29 -14.4 30 -12.4 28.8 -10.8C26.6 -9.6 24.6 -9.2 22.6 -9C25 -7.4 25.6 -5.2 24.4 -3.8' +
  'C22 -3 19.6 -3.2 17.6 -3.6C19.6 -1.6 19.8 .6 18.6 1.8C16 2.4 13.6 2 11.6 1.2C12.8 3 12.6 5 11.2 5.8C8.4 6 5.4 5.2 3.6 3.6C2 3.4 .6 2.6 0 1.6Z'
function wing(k: Kit) {
  const quills = [[26.4, -15, 12, -8.4], [22.6, -9, 10, -4.4], [17.6, -3.6, 7.4, -1.4], [11.6, 1.2, 4.4, .8]]
    .map(([x0, y0, x1, y1]) => hair(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2 - 1.2, x1, y1, 0.6, P.blue)).join('')
  const barbs = [[28, -13, 22, -11], [24, -7, 18, -6], [21, -1.6, 15, -1.4], [14.4, 3.4, 8, 2.6], [29, -18.6, 21, -14.6]]
    .map(([x0, y0, x1, y1]) => hair(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2 + 0.4, x1, y1, 0.35, P.sky2)).join('')
  const coverts = Array.from({ length: 6 }, (_, i) => { const x = 3 + i * 4, y = -3.4 - i * 2.6; return `<path d="M${f(x - 2.6)} ${f(y + 1.4)}Q${f(x)} ${f(y + 3.6)} ${f(x + 2.4)} ${f(y - 0.4)}" fill="none" stroke="${P.blue}" stroke-width=".45"/>` }).join('') +
    Array.from({ length: 4 }, (_, i) => { const x = 4 + i * 4.2, y = 0 - i * 2.2; return `<path d="M${f(x - 2.4)} ${f(y + 1)}Q${f(x)} ${f(y + 3)} ${f(x + 2.2)} ${f(y - 0.6)}" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` }).join('')
  return k.draw([{
    d: WING, fill: P.white,
    inner: k.sh(WING, 0, 0, 1, 1, 0.1, 0.85, P.sky2, 0.5) + k.sh('M0 -4H34V8H0Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) + quills + barbs + coverts +
      `<path d="M1 -3.6C8 -10 18 -17.4 30.4 -21.6" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-linecap="round"/>`,
  }], 0.6)
}

/** Escorpión de perfil mirando a la izquierda, con la cola por encima del lomo y el aguijón adelante, en (−12,−33). */
function scorpion(k: Kit) {
  const B = (t: number) => {
    const a = 1 - t, p0 = [15, -3], p1 = [31, -12], p2 = [27, -36], p3 = [5, -36]
    return [a * a * a * p0[0] + 3 * a * a * t * p1[0] + 3 * a * t * t * p2[0] + t * t * t * p3[0], a * a * a * p0[1] + 3 * a * a * t * p1[1] + 3 * a * t * t * p2[1] + t * t * t * p3[1]]
  }
  const shell = FC_D, lit = FC, rim = P.gold
  const seg = (t0: number, t1: number, w: number) => {
    const [x0, y0] = B(t0), [x1, y1] = B(t1), [xm, ym] = B((t0 + t1) / 2)
    const d = taper(x0, y0, xm, ym, x1, y1, w, w * 0.86)
    const ang = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(ang), ny = Math.cos(ang)
    return k.draw([{ d, fill: shell, inner: `<path d="${d}" fill="${k.lin(lit, 0, 0, 1, 1, 0.9, 0)}"/>` + k.sh(d, 0, 0, 1, 1, 0, 0.7, '#04324F', 0.45) }], 0.55) +
      hair(x0 - nx * w * 0.22, y0 - ny * w * 0.22, xm - nx * w * 0.3, ym - ny * w * 0.3, x1 - nx * w * 0.22, y1 - ny * w * 0.22, 0.45, rim) +
      `<path d="M${f(x1 + nx * w * 0.45)} ${f(y1 + ny * w * 0.45)}L${f(x1 - nx * w * 0.45)} ${f(y1 - ny * w * 0.45)}" stroke="${P.goldL}" stroke-width=".5" stroke-linecap="round"/>`
  }
  const tail = [[0, 0.19, 6.2], [0.19, 0.38, 5.8], [0.38, 0.57, 5.4], [0.57, 0.77, 5], [0.77, 1, 5.2]].map(([a, b, w]) => seg(a, b, w)).join('')
  const vesicle = 'M6 -39.4C2 -40.4 -3 -40 -5.6 -37.6C-7.4 -35.6 -6 -32.8 -2.4 -32.4C.8 -32.2 4 -33.2 6 -33.8Z'
  const sting = 'M-4.8 -35.6C-8.6 -35 -11 -32.4 -11.8 -28.2C-10 -30.6 -8 -32 -4.6 -33Z'
  const pros = 'M-17.6 -.6C-17.4 -4.4 -13.4 -6.8 -8.6 -7C-5.4 -7.2 -2.6 -6.2 -1.6 -4.8V3.2C-3.6 4.4 -8 4.8 -11.6 4.4C-15.4 4 -17.8 2.6 -17.6 -.6Z'
  const meso = 'M-3 -5C2 -7.6 9 -8 14 -6.4C17.4 -5.2 18.8 -3 18.4 -.2C18 2.6 15 4.2 11 4.8C6 5.6 0 5.2 -3 3.6Z'
  const tergites = [1.4, 5, 8.6, 12, 15.2].map((x) => `<path d="M${x} ${f(-7.2 + Math.abs(x - 7) * 0.05)}C${f(x + 1.2)} -3 ${f(x + 1.2)} 1 ${x} ${f(4.8 - Math.abs(x - 8) * 0.08)}" fill="none" stroke="#04324F" stroke-width=".55"/><path d="M${f(x - 0.6)} -6.8C${f(x + 0.6)} -3 ${f(x + 0.6)} 1 ${f(x - 0.6)} 4.6" fill="none" stroke="${P.gold}" stroke-width=".35" opacity=".8"/>`).join('')
  const leg = (x: number, kx: number, ky: number, fx: number, fy: number, c: string) => {
    const d = `M${x} 2.4L${kx} ${ky}L${fx} ${fy}`
    return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${kx}" cy="${ky}" r=".55" fill="${P.goldL}"/>`
  }
  const farLegs = leg(-8, -11, 7, -15, 11.6, '#04324F') + leg(-2, -3, 7.4, -6, 12, '#04324F') + leg(4, 6, 7.6, 4, 12.4, '#04324F') + leg(10, 13, 7.4, 13, 12, '#04324F')
  const nearLegs = leg(-10, -14, 8.4, -19, 12.4, lit) + leg(-4, -6.6, 9, -10, 13.6, lit) + leg(2, 3, 9.4, 0, 14, lit) + leg(8, 10.6, 9.4, 9.6, 14, lit)
  const chela = (s: number) => {
    const palm = 'M0 -3.4C3 -3.6 5 -1.6 5 .4C5 2.6 2.6 3.8 0 3.6C-2.2 3.4 -3.4 2.2 -3.6 .8Z'
    const fixed = 'M-3.2 -1C-6.6 -2.2 -10.4 -2 -12.6 -.6C-10.4 -.2 -7 .2 -3.4 .8Z'
    const mov = 'M-3 1.4C-6.4 1.6 -9.6 3.4 -11.4 5.4C-8.8 5 -6 4.4 -2.6 3.6Z'
    return `<g transform="scale(${s})">` + k.draw([
      { d: fixed, fill: shell, inner: k.sh(fixed, 0, 0, 0, 1, 0, 0.8, '#04324F', 0.4) },
      { d: mov, fill: shell, inner: k.sh(mov, 0, 0, 0, 1, 0, 0.8, '#04324F', 0.4) },
      { d: palm, fill: shell, inner: `<path d="${palm}" fill="${k.lin(lit, 0, 0, 1, 1, 0.95, 0)}"/>` + k.sh(palm, 0, 0, 1, 1, 0, 0.7, '#04324F', 0.4) + hair(-2, -2.6, 1, -3.4, 4, -1.6, 0.45, P.goldL) },
    ], 0.5 / s) + `<path d="M-4 -.6L-11 -.8M-4 2L-9.6 4" stroke="${P.goldL}" stroke-width=".3" stroke-dasharray=".5 .6"/></g>`
  }
  const arm = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, c: string) => {
    const d = `M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}`
    return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  }
  return (
    farLegs +
    arm(-14, -2, -18, -10, -22.6, -13, '#04324F') + `<g transform="translate(-24 -14.6) rotate(34)">${chela(1.15)}</g>` +
    tail +
    k.draw([{ d: sting, fill: P.gold, inner: k.sh(sting, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }, { d: vesicle, fill: P.gold, inner: k.sh(vesicle, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + hair(-4, -37.6, 0, -39.4, 4, -38.6, 0.5, P.goldL) + hair(-3, -34, 0, -33.2, 4, -34.4, 0.4, P.goldD) }], 0.55) +
    k.draw([
      { d: meso, fill: shell, inner: `<path d="M-4 -9H20V-2C10 -4 2 -3 -4 -1Z" fill="${k.lin(lit, 0, 0, 0, 1, 0.9, 0)}"/>` + k.sh(meso, 0, 0, 0, 1, 0.1, 0.8, '#04324F', 0.45) + tergites },
      { d: pros, fill: shell, inner: `<path d="M-19 -8H-2V-2C-8 -3.4 -14 -2.6 -19 -1Z" fill="${k.lin(lit, 0, 0, 0, 1, 0.95, 0)}"/>` + k.sh(pros, 0, 0, 0, 1, 0.1, 0.8, '#04324F', 0.45) + hair(-15, -4.6, -10, -6.6, -4, -6, 0.5, P.goldL) + `<path d="M-6 -6.2C-5 -3 -5 1 -6 4" fill="none" stroke="#04324F" stroke-width=".5"/>` },
    ], 0.75) +
    `<circle cx="-11.4" cy="-6.2" r=".75" fill="${P.ink}"/><circle cx="-9.6" cy="-6.5" r=".75" fill="${P.ink}"/><circle cx="-11.6" cy="-6.4" r=".25" fill="${FC_XL}"/>` +
    nearLegs +
    arm(-15, 0, -21.6, -4, -26.6, -4.8, lit) + `<g transform="translate(-28.6 -6.4) rotate(16)">${chela(1.35)}</g>`
  )
}

/** Gorra con visera mirando a la derecha, apoyada en (0,0). */
function cap(k: Kit) {
  const crown = 'M-14 2C-15 -6 -9 -13 -1 -13.4C7 -13.6 12.6 -8 12.6 0C6 3 -6 4 -14 2Z'
  const visor = 'M8.4 -.6C14 -1.6 22 .4 25.4 3.6C26.6 5.4 24.4 7 19 6.8C14 6.6 9.6 5 7.4 3Z'
  const under = 'M9 2.4C14 3.4 20 4.6 24.6 4.6C24 6.2 22 6.8 19 6.8C14 6.6 10 5.2 8 3.4Z'
  return (
    k.draw([
      { d: visor, fill: FC, inner: `<path d="${under}" fill="${FC_D}"/>` + k.sh(visor, 0, 0, 1, 1, 0, 0.6, FC_D, 0.4) + `<path d="M9.6 .4C15 -.2 21 1.6 24.4 4" fill="none" stroke="${P.white}" stroke-width=".45" stroke-dasharray=".8 .7"/><path d="M10 .9C15 .5 20 2.1 23.4 4.4" fill="none" stroke="${P.white}" stroke-width=".35" stroke-dasharray=".8 .7"/>` },
      {
        d: crown, fill: FC,
        inner:
          k.sh('M2 -16H14V4H2Z', 0, 0, 1, 0, 0, 0.8, FC_D, 0.45) + k.sh('M-16 -2H14V4H-16Z', 0, 0, 0, 1, 0, 0.7, FC_D, 0.35) +
          `<path d="M-16 -14H-6V4H-16Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="M-1 -13.4C-5.4 -10 -7.6 -4 -7.6 2.8M-1 -13.4C1.6 -9 3 -3.6 3 2.6M-1 -13.4C5 -11 9.4 -6 10.6 .8" fill="none" stroke="${FC_D}" stroke-width=".55"/>` +
          `<path d="M-1.6 -13C-6 -9.6 -8.2 -4 -8.4 2.6" fill="none" stroke="${FC_XL}" stroke-width=".35" stroke-dasharray=".8 .7"/>` +
          `<path d="M-14 1.4C-6 3.2 6 2.4 12.6 -.4" fill="none" stroke="${FC_D}" stroke-width=".8"/>` +
          [[-4.6, -8], [5.4, -7.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${FC_D}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
          hair(-11, -4, -8, -10, -3, -12.4, 0.8, '#fff', 0.85),
      },
    ], 0.75) +
    `<ellipse cx="-1" cy="-13.6" rx="2.2" ry="1.1" fill="${FC}" stroke="${P.ink}" stroke-width=".5"/>`
  )
}

export const EAFC_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Goleador serial ────────────────────────────────────────────────

  // Ganaste por tres: el botín pisa la pelota y la tribuna canta "¡olé!".
  'Baile': (u) => {
    const k = kit(u)
    return (
      field(k) +
      k.sun(60, 56, 15, 44, 32, false) +
      k.floor(60, 89.4, 20, 2.6, P.mid) +
      ball(k, 58, 75, 14) +
      `<g transform="translate(61 61.6) rotate(-9)">` + k.cast([BOOT], 1.6, 1.6) + boot(k) + `</g>` +
      `<text x="80" y="44" ${GEORGIA} font-style="italic" font-size="7" fill="${P.ink}" text-anchor="middle" transform="rotate(10 80 44)">¡olé!</text>` +
      hair(36, 70, 33.6, 76, 36, 82, 0.8, P.mid) + hair(32.4, 72, 30, 77, 32.6, 82.4, 0.6, P.mid) +
      sparkle(36, 40, 2.2) + sparkle(90, 74, 1.6) +
      k.defs()
    )
  },

  // Cinco de diferencia: el rival pidió la hora. El marcador de chapas, 5 a 0, con el reloj de la cancha arriba.
  'Paliza': (u) => {
    const k = kit(u)
    const board = roundRect(29, 49, 91, 82, 2.2)
    const panel = roundRect(32.4, 52.4, 87.6, 78.6, 1)
    const plate = (x: number, n: string, r: number) => {
      const d = roundRect(-8, 0, 8, 19, 1)
      return `<g transform="translate(${x} 58.6) rotate(${r} 0 0)">` +
        k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M-7 1.6H7" stroke="${P.sky}" stroke-width=".4"/>` }], 0.55) +
        `<text x=".2" y="16.4" ${GEORGIA} font-weight="700" font-size="17" fill="${P.ink}" text-anchor="middle">${n}</text>` +
        [-4.6, 4.6].map((hx) => `<circle cx="${hx}" cy="-.6" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M${hx} -.6V1.6" stroke="${P.ink}" stroke-width=".6"/>`).join('') +
        `</g>`
    }
    const ticks = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, r0 = i % 3 ? 5.6 : 4.8; return `M${f(60 + Math.cos(a) * r0)} ${f(36 + Math.sin(a) * r0)}L${f(60 + Math.cos(a) * 6.6)} ${f(36 + Math.sin(a) * 6.6)}` }).join('')
    const bulbs = Array.from({ length: 9 }, (_, i) => `<circle cx="${f(35 + i * 6.25)}" cy="50.7" r=".75" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`).join('')
    const rivets = [[31, 51], [89, 51], [31, 80], [89, 80], [31, 65.6], [89, 65.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    return (
      k.night() +
      k.shade(ellipse(60, 58, 34, 30), k.rad(FC, 0.5, 0.5, 0.5, 0.55, 0), FC, 0.3) +
      [[30, 30], [92, 34], [26, 52], [96, 62], [42, 22], [80, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.draw([{ d: 'M38 82H42.4V104H38Z', fill: P.mid }, { d: 'M77.6 82H82V104H77.6Z', fill: P.mid }, { d: 'M57.8 43H62.2V49.6H57.8Z', fill: P.mid }], 0.6) +
      k.cast([board], 2.4, 2.4, '#0F1736') +
      k.draw([{
        d: board, fill: P.brown,
        inner: k.sh(board, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M29 49H91V54H29Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.6, 0)}"/>` +
          hair(30, 60, 30.6, 70, 30.2, 80, 0.4, P.brownD) + hair(90, 58, 90.4, 68, 89.8, 78, 0.4, P.brownD),
      }], 0.75) +
      k.draw([{ d: panel, fill: FC_D, inner: k.sh(panel, 0, 0, 1, 1, 0, 0.8, '#04324F', 0.45) + `<path d="M32.4 52.4H50V78.6H32.4Z" fill="${k.lin(FC, 0, 0, 1, 0, 0.45, 0)}"/>` }], 0.4) +
      bulbs + rivets +
      `<text x="44" y="56.8" ${GEORGIA} font-size="2.6" letter-spacing=".3" fill="${FC_XL}" text-anchor="middle">LOCAL</text>` +
      `<text x="76" y="56.8" ${GEORGIA} font-size="2.6" letter-spacing=".3" fill="${FC_XL}" text-anchor="middle">VISITA</text>` +
      plate(44, '5', -2.4) + plate(76, '0', 1.6) +
      `<path d="M57.4 67.6H62.6V69.8H57.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: ellipse(60, 36, 9.6, 9.6), fill: P.gold, inner: k.sh(ellipse(60, 36, 9.6, 9.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.7) +
      `<circle cx="60" cy="36" r="7.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>` + k.clip(ellipse(60, 36, 7.6, 7.6), k.sh(ellipse(60, 36, 7.6, 7.6), 0, 0, 1, 1, 0, 0.6, P.blue, 0.35)) +
      `<path d="${ticks}" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M60 36L60 30.2M60 36L63.4 35" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><path d="M60 36L56.6 39.4" stroke="${P.red}" stroke-width=".4"/><circle cx="60" cy="36" r=".7" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>` +
      `<path d="M54.6 31.6C55.8 30 57.4 29.2 59 29" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>` +
      sparkle(86, 40, 2, P.paper) + sparkle(30, 72, 1.4, P.paper) +
      k.defs()
    )
  },

  // Ocho o más: un Brasil-Alemania en el living. De noche, la pelota rompe la red del arco y entra con un estallido
  // de oro; abajo, la cinta verde y amarilla del 7 a 1.
  'Mineirazo': (u) => {
    const k = kit(u)
    const C = [60, 57], HOLE = 13.6
    const bend = (x: number, y: number): [number, number] => {
      const dx = x - C[0], dy = y - C[1], d = Math.hypot(dx, dy) || 1
      if (d > 30) return [x, y + Math.max(0, (y - 34) * 0.04)]
      const push = Math.pow((30 - d) / 30, 1.5) * 6.4
      return [x + (dx / d) * push, y + (dy / d) * push]
    }
    const frays = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + 0.25, r0 = HOLE + 5.6, r1 = HOLE + 0.4 + (i % 3) * 1.2, tw = i % 2 ? 1.8 : -1.8
      const x0 = C[0] + Math.cos(a) * r0, y0 = C[1] + Math.sin(a) * r0, x1 = C[0] + Math.cos(a + 0.1) * r1, y1 = C[1] + Math.sin(a + 0.1) * r1
      const cx = (x0 + x1) / 2 + Math.cos(a + Math.PI / 2) * tw, cy = (y0 + y1) / 2 + Math.sin(a + Math.PI / 2) * tw
      return hair(x0, y0, cx, cy, x1, y1, 0.9, P.ink) + hair(x0, y0, cx, cy, x1, y1, 0.5, P.white)
    }).join('')
    const shards = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + 0.1, r0 = 18, r1 = 27 + (i % 3) * 3
      return `M${f(C[0] + Math.cos(a - 0.05) * r0)} ${f(C[1] + Math.sin(a - 0.05) * r0)}L${f(C[0] + Math.cos(a) * r1)} ${f(C[1] + Math.sin(a) * r1)}L${f(C[0] + Math.cos(a + 0.05) * r0)} ${f(C[1] + Math.sin(a + 0.05) * r0)}Z`
    }).join('')
    const bar = roundRect(26, 29, 94, 32.6, 1.6), postL = roundRect(26, 29, 29.6, 110, 1.6), postR = roundRect(90.4, 29, 94, 110, 1.6)
    return (
      k.night() +
      [[34, 22], [86, 22], [46, 20], [74, 19]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      `<path d="M29.6 32.6H90.4V110H29.6Z" fill="#0F1736" opacity=".45"/>` +
      net(k, 'M29.6 32.6H90.4V110H29.6Z', 29.6, 32.6, 90.4, 110, 5.2, bend, P.sky1, (x, y) => Math.hypot(x - C[0], y - C[1]) < HOLE + 5) +
      k.shade(ellipse(C[0], C[1], 30, 30), k.rad(P.gold, 0.5, 0.5, 0.5, 0.95, 0), P.gold, 0.45) +
      `<path d="${shards}" fill="${P.goldL}"/>` + k.shade(shards, k.rad(P.gold, 0.5, 0.5, 0.5, 0.2, 0.9), P.goldD, 0.3) +
      frays +
      k.cast([bar, postL, postR], 1.6, 1.6, '#000') +
      k.draw([
        { d: postL, fill: P.white, inner: k.sh(postL, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) },
        { d: postR, fill: P.white, inner: k.sh(postR, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) },
        { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.75, P.blue, 0.4) + `<path d="M27 30.2H93" stroke="#fff" stroke-width=".6"/>` },
      ], 0.6) +
      ball(k, C[0], C[1], 14.2, { a: 0.3, b: 0.6, c: -0.2 }) +
      banner(k, 60, 87.4, 40, GRASS, GRASS_D, '7 a 1', P.goldL, 5.6) +
      sparkle(84, 40, 2.6, P.goldL) + sparkle(36, 44, 1.8, P.goldL) + sparkle(78, 74, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Golazo ────────────────────────────────────────────────────────

  // La primera chilena: el botín da vuelta en el aire, de tapones al cielo, y la tijera deja dos estelas cruzadas.
  'Tijera': (u) => {
    const k = kit(u)
    return (
      field(k) +
      k.sun(60, 58, 15, 46, 32, false) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      hair(36, 88, 58, 86, 84, 62, 1.4, P.mid, 0.7) + hair(32, 70, 58, 78, 82, 88, 1.2, P.mid, 0.6) +
      `<path d="M81.4 60.4L85.8 59.6L84 63.6Z" fill="${P.mid}" opacity=".7"/>` +
      k.floor(60, 94, 18, 2.2, P.mid) +
      `<g transform="translate(62 58) rotate(166) scale(.96)">` + k.cast([BOOT], -1.4, -1.6) + boot(k) + `</g>` +
      ball(k, 37, 40, 9.2, { a: 0.2, b: 0.9 }) +
      hair(30, 30, 26, 33, 24, 38, 0.6, P.mid) + hair(36, 27, 31, 27, 27, 30, 0.5, P.mid) +
      sparkle(86, 34, 2.2) + sparkle(30, 70, 1.6) +
      k.defs()
    )
  },

  // Cinco chilenas: bajo la carpa del circo, el botín cuelga cabeza abajo del trapecio y la pelota sale despedida.
  'Acróbata': (u) => {
    const k = kit(u)
    const bar = roundRect(43, 39.4, 77, 42.4, 1.5)
    const rope = (x0: number, x1: number) => `M${x0} 10L${x1} 40.4`
    const lace = 'M60.6 41.6C58.6 47 62.8 51 60.2 57.6M63.6 41.6C66 47.6 62.4 52.6 63.4 59'
    const stripes = Array.from({ length: 14 }, (_, i) => {
      const a0 = Math.PI * (0.06 + (i / 14) * 0.88), a1 = a0 + Math.PI * 0.88 / 28
      return `M60 -6L${f(60 + Math.cos(a0) * 160)} ${f(-6 + Math.sin(a0) * 160)}L${f(60 + Math.cos(a1) * 160)} ${f(-6 + Math.sin(a1) * 160)}Z`
    }).join('')
    return (
      `<rect width="120" height="130" fill="${P.white}"/>` +
      `<path d="${stripes}" fill="${FC}"/>` + k.shade(stripes, k.lin(FC_D, 0, 0, 0, 1, 0.1, 0.9), FC_D, 0.35) +
      k.shade(FULL, k.rad(P.night, 0.5, 0.42, 0.62, 0, 0.9), P.night, 0.45) +
      k.shade(ellipse(60, 62, 30, 34), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      k.floor(60, 93, 26, 3.4, P.night) +
      [rope(47, 46), rope(73, 74)].map((d) => `<path d="${d}" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="${d}" stroke="${P.goldL}" stroke-width=".8" stroke-linecap="round"/><path d="${d}" stroke="${P.goldD}" stroke-width=".8" stroke-dasharray=".6 .9"/>`).join('') +
      k.draw([{ d: bar, fill: P.gold, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M44 40.4H76" stroke="${P.goldL}" stroke-width=".5"/>` + [50, 56, 62, 70].map((x) => `<path d="M${x} 39.4L${x + 1.6} 42.4" stroke="${P.red}" stroke-width=".9"/>`).join('') }], 0.55) +
      `<path d="${lace}" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="${lace}" fill="none" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>` +
      `<g transform="translate(62 46.4) rotate(76) scale(.9) translate(14 19.4)">` + k.cast([BOOT], 1.8, -1.8, P.night) + boot(k, { stripe: P.gold }) + `</g>` +
      hair(36, 50, 32, 60, 34, 72, 1, P.white, 0.9) + hair(32, 48, 27, 58, 28.6, 70, 0.8, P.white, 0.8) +
      ball(k, 79, 79, 8.6, { a: 0.6, b: -0.8 }) +
      hair(62, 88, 66, 86, 69, 83, 0.8, P.white, 0.9) + hair(60, 82, 63, 81, 67, 78.4, 0.7, P.white, 0.8) +
      sparkle(32, 82, 2, P.goldL) + sparkle(88, 50, 1.8, P.goldL) +
      k.defs()
    )
  },

  // Doce chilenas, de espaldas: el escorpión que patea con la cola por encima del lomo.
  'Escorpión': (u) => {
    const k = kit(u)
    return (
      field(k) +
      k.sun(60, 56, 16, 48, 32, false) +
      k.shade(ellipse(60, 56, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(50, 99, 31, 92, 28, 64, 8) + laurel(70, 99, 89, 92, 92, 64, 8, true) +
      k.floor(64, 86, 22, 2.6, P.mid) +
      `<g transform="translate(68 72) scale(.96)">` + scorpion(k) + `</g>` +
      hair(38, 34, 34, 37, 32, 42, 0.6, P.mid) + hair(42, 31, 37, 31.6, 33.6, 34.6, 0.5, P.mid) +
      ball(k, 46.4, 42, 8.6, { a: 0.8, b: 0.2 }) +
      sparkle(88, 32, 2.4, '#fff') + sparkle(30, 62, 1.6) +
      k.defs()
    )
  },

  // ── Mira de los once metros ────────────────────────────────────────

  // Ganaste por penales: los guantes, firmes bajo los tres palos.
  'Bajo los tres palos': (u) => {
    const k = kit(u)
    const bar = roundRect(27, 37, 93, 40.8, 1.6), postL = roundRect(27, 37, 30.8, 82, 1.6), postR = roundRect(89.2, 37, 93, 82, 1.6)
    const grass = 'M0 80H120V130H0Z'
    return (
      field(k) +
      k.stage(60, 58, 33) +
      `<path d="${grass}" fill="${GRASS}"/>` + k.sh(grass, 0, 0, 0, 1, 0, 0.6, GRASS_D, 0.4) +
      [0, 1, 2, 3].map((i) => `<path d="M${-4 + i * 32} 80L${10 + i * 32} 80L${-2 + i * 34} 104L${-18 + i * 34} 104Z" fill="#fff" opacity=".12"/>`).join('') +
      net(k, 'M30.8 40.8H89.2V81H30.8Z', 30.8, 40.8, 89.2, 81, 4.2, (x, y) => [x, y], P.white) +
      `<path d="M30.8 40.8L38 47M89.2 40.8L82 47M38 47H82" fill="none" stroke="${P.blue}" stroke-width=".5" opacity=".6"/>` +
      `<path d="M22 81.4H98" stroke="${P.white}" stroke-width="1.4"/>` +
      k.cast([bar, postL, postR], 1.6, 1.6, P.mid) +
      k.draw([
        { d: postL, fill: P.white, inner: k.sh(postL, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
        { d: postR, fill: P.white, inner: k.sh(postR, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
        { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) },
      ], 0.6) +
      `<g transform="translate(47.4 62) rotate(-10) scale(-.74 .74)">` + k.cast([PALM, CUFF], 2, 2, P.mid) + glove(k) + `</g>` +
      `<g transform="translate(72.6 62) rotate(10) scale(.74)">` + k.cast([PALM, CUFF], 2, 2, P.mid) + glove(k) + `</g>` +
      sparkle(36, 30, 1.6) + sparkle(86, 30, 2) +
      k.defs()
    )
  },

  // Tres definiciones: Italia 90 en el living. El guante que vuela y la desvía, bajo el sol de Mayo.
  'Goyco': (u) => {
    const k = kit(u)
    return (
      field(k) +
      k.sun(60, 56, 15, 46) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      hair(88, 86, 84, 80, 78, 76, 0.8, P.mid) + hair(92, 80, 88, 74, 82, 70, 0.7, P.mid) + hair(84, 90, 80, 86, 74, 82, 0.6, P.mid) +
      `<g transform="translate(70 66) rotate(-42) scale(.95)">` + k.cast([PALM, CUFF, THUMB], 2.2, 2.2, P.mid) + glove(k) + `</g>` +
      ball(k, 40, 39, 9.4, { a: 0.2, b: 0.9 }) +
      hair(36, 26, 31, 27, 27, 31, 0.6, P.mid) + hair(30, 34, 27, 37, 26, 41, 0.5, P.mid) +
      banner(k, 60, 88.4, 34, P.white, P.sky, 'Italia ’90', P.ink, 4.2) +
      `<path d="M43 85.2Q60 89.2 77 85.2" fill="none" stroke="${GRASS}" stroke-width=".8"/><path d="M43 92Q60 96 77 92" fill="none" stroke="${P.red}" stroke-width=".8"/>` +
      sparkle(88, 36, 2.2) + sparkle(30, 66, 1.6) +
      k.defs()
    )
  },

  // Siete tandas: el guante de oro en su pedestal, con las tres estrellas, el sol de Mayo y la línea del bailecito.
  'Dibu Martínez': (u) => {
    const k = kit(u)
    const base = 'M45 86H75L77 94H43Z'
    const plinth = 'M48.6 78.4H71.4L73 86H47Z'
    const stem = 'M54.6 72H65.4L66.6 78.4H53.4Z'
    return (
      field(k) +
      k.sun(60, 54, 16, 47) +
      k.shade(ellipse(60, 54, 28, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(48, 100, 30, 92, 27, 62, 8) + laurel(72, 100, 90, 92, 93, 62, 8, true) +
      [[44.6, 31, 2.6], [60, 22.6, 3.2], [75.4, 31, 2.6]].map(([x, y, r]) => `<path d="${starPath(x, y, r, r * 0.42, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(x, y, r * 0.5, r * 0.2, 5)}" fill="${P.goldL}"/>`).join('') +
      k.floor(60, 94, 20, 2.4, P.mid) +
      k.shade(ellipse(60, 48, 20, 26), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.95, 0), '#ffffff', 0.55) +
      k.draw([
        { d: base, fill: P.night, inner: k.sh(base, 0, 0, 1, 0, 0, 0.8, '#0F1736', 0.4) + `<path d="M43.6 91H76.4" stroke="${P.gold}" stroke-width=".6"/>` + `<path d="M46 86H58V94H46Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.8, 0)}"/>` },
        { d: plinth, fill: P.sky, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) + `<path d="M53.6 78.4H58.2V86H53.6ZM62.8 78.4H67.4V86H62.8Z" fill="${P.white}"/>` + k.sh(plinth, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) },
        { d: stem, fill: P.gold, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M54 74.6H66" stroke="${P.goldD}" stroke-width=".45"/>` },
      ], 0.6) +
      `<circle cx="60" cy="82.2" r="1.7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="${starPath(60, 82.2, 1.2, 0.5, 8)}" fill="${P.goldL}"/>` +
      `<g transform="translate(61 55.6) scale(.92)">` + k.cast([PALM, CUFF, THUMB], 1.4, 1.6, P.mid) +
      glove(k, { shell: P.gold, shellD: P.goldD, latex: P.goldL, latexD: P.gold, strap: P.gold }) + `</g>` +
      `<path d="M52.6 72.6C55 71.6 58 71.2 60.8 71.4" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>` +
      sparkle(46, 38, 2.4, '#fff') + sparkle(80, 46, 1.8, '#fff') + sparkle(34, 76, 1.4) +
      k.defs()
    )
  },

  // ── Calentón ──────────────────────────────────────────────────────

  // El primer joystick revoleado: sale volando con alas de insignia, con el cable cortado de cola.
  'Joystick volador': (u) => {
    const k = kit(u)
    const cord = 'M57.8 53.4C55.6 46 48 43 42.6 46.6C37.6 50 39.6 57 34 59.4C30.6 60.8 28 59.6 26.4 57.6'
    return (
      field(k) +
      k.stage(60, 60, 33) +
      k.floor(62, 92, 18, 2.2, P.mid) +
      hair(30, 80, 36, 78, 42, 79, 0.8, P.mid) + hair(28, 86, 35, 84.6, 42, 85, 0.7, P.mid) + hair(80, 82, 86, 80.6, 92, 81, 0.6, P.mid) +
      `<g transform="translate(60 64) rotate(-8)">` +
      `<g transform="translate(-13.4 -5) scale(-1.12 1.12) rotate(-4)">` + wing(k) + `</g>` +
      `<g transform="translate(13.4 -5) scale(1.12) rotate(-4)">` + wing(k) + `</g>` +
      `</g>` +
      `<path d="${cord}" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="${cord}" fill="none" stroke="${P.night}" stroke-width="1.1" stroke-linecap="round"/>` +
      `<path d="M27.4 57L24.8 55.8M26.8 58.4L24 58.8M26.6 57.6L24.2 57" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>` +
      `<g transform="translate(60 66) rotate(-8) scale(.84)">` + k.cast([PAD], 2.2, 2.4) + gamepad(k) + `</g>` +
      sparkle(88, 36, 2) + sparkle(32, 34, 1.6) +
      k.defs()
    )
  },

  // Cuatro rage quits: le sale vapor de la cabeza y se le vuela la gorrita. Tranquilo, que es un jueguito.
  'Pibe calentón': (u) => {
    const k = kit(u)
    return (
      field(k) +
      k.stage(60, 60, 33) +
      k.shade(ellipse(60, 92, 34, 20), k.rad(P.red, 0.5, 0.5, 0.5, 0.55, 0), P.red, 0.3) +
      puff(k, 46, 86, 11) + puff(k, 74, 86, 11) + puff(k, 60, 76, 12) + puff(k, 60, 61, 10) + puff(k, 45, 68, 7) + puff(k, 75, 67, 7.4) +
      hair(52, 54, 49, 48, 52, 42.6, 0.8, P.blue) + hair(68, 53.6, 71, 48, 68, 42, 0.8, P.blue) + hair(40, 60, 35, 56, 36, 49, 0.6, P.blue) + hair(80, 58, 85, 54, 84, 47, 0.6, P.blue) +
      `<g transform="translate(57 42) rotate(-14) scale(1.12)">` + k.cast(['M-14 2C-15 -6 -9 -13 -1 -13.4C7 -13.6 12.6 -8 12.6 0C6 3 -6 4 -14 2Z'], 1.6, 1.8) + cap(k) + `</g>` +
      [[38, 44], [82, 40], [86, 72], [34, 78]].map(([x, y], i) => `<path d="M${x} ${y}c-.6 1 -1 1.8 -1 2.4a1 1 0 0 0 2 0c0 -.6 -.4 -1.4 -1 -2.4Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3" transform="rotate(${i % 2 ? 20 : -20} ${x} ${y})"/>`).join('') +
      k.defs()
    )
  },

  // Diez joysticks revoleados: silbás como la olla de los porotos. La olla a presión, con la válvula a full.
  'Olla a presión': (u) => {
    const k = kit(u)
    const body = 'M36 63H84V84.4C84 89.4 79.4 93 73.6 93H46.4C40.6 93 36 89.4 36 84.4Z'
    const rim = ellipse(60, 63, 24, 5.2)
    const lid = 'M37 62.4C37.6 56.8 47.4 54 60 54C72.6 54 82.4 56.8 83 62.4C75 66 45 66 37 62.4Z'
    const hLid = 'M78.4 57.4L95.6 52.6C97.4 52.2 98.6 53.2 98.4 54.8C98.2 56 97.4 56.6 96.2 57L79.4 61.2Z'
    const hPot = 'M83.6 66.6L96 64.4C97.8 64.2 98.8 65.4 98.4 66.8C98.2 67.8 97.4 68.4 96.2 68.6L83.8 70.8Z'
    const ear = 'M36.2 67C33 66.6 30.6 67.6 30.4 69.6C30.2 71.4 32.4 72.6 36.2 72.4Z'
    const weight = 'M57.6 54.4V49.4C57.6 48.4 62.4 48.4 62.4 49.4V54.4Z'
    const knob = 'M58.2 49C58.2 46.6 59 45.6 60 45.6C61 45.6 61.8 46.6 61.8 49Z'
    const flames = Array.from({ length: 9 }, (_, i) => { const x = 40 + i * 5; return `M${f(x - 1.8)} 98C${f(x - 1.8)} 96 ${f(x - 0.6)} 94.4 ${x} 92.6C${f(x + 0.6)} 94.4 ${f(x + 1.8)} 96 ${f(x + 1.8)} 98Z` }).join('')
    return (
      field(k) +
      k.sun(60, 52, 15, 47, 32, false) +
      k.shade(ellipse(60, 54, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      k.draw([{ d: flames, fill: P.sky, inner: `<path d="${flames}" fill="${P.white}" transform="translate(0 2.6)"/>` + k.sh(flames, 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) }], 0.4) +
      `<path d="M30 95.4H90" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M30 95.4H90" stroke="${P.mid}" stroke-width="1" stroke-linecap="round"/>` +
      k.draw([
        { d: ear, fill: P.night },
        { d: hPot, fill: P.night, inner: `<path d="M84 67.4L96.4 65.2" stroke="${P.mid}" stroke-width=".7"/>` },
        {
          d: body, fill: ALU,
          inner:
            k.sh('M64 60H86V95H64Z', 0, 0, 1, 0, 0, 0.9, ALU_D, 0.5) + k.sh('M34 84H86V95H34Z', 0, 0, 0, 1, 0, 0.7, ALU_D, 0.4) +
            `<path d="M36 60H44V95H36Z" fill="${ALU_D}" opacity=".35"/>` +
            `<path d="M41.4 62V92" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M45 63V92.6" stroke="#fff" stroke-width=".5" opacity=".8"/>` +
            `<path d="M36 70.4Q60 74.6 84 70.4M36 86Q60 90.2 84 86" fill="none" stroke="${ALU_D}" stroke-width=".6"/><path d="M36 71.2Q60 75.4 84 71.2" fill="none" stroke="#fff" stroke-width=".4"/>` +
            `<ellipse cx="60" cy="79" rx="6.6" ry="3.6" fill="none" stroke="${ALU_D}" stroke-width=".5"/><path d="M55 79H65" stroke="${ALU_D}" stroke-width=".4" stroke-dasharray=".8 .6"/>`,
        },
        { d: rim, fill: ALU, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.8, ALU_D, 0.4) },
        { d: lid, fill: ALU, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.85, ALU_D, 0.45) + `<path d="M40 61C44 58 52 56.6 58 56.4" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` + `<path d="${ellipse(60, 58.6, 14, 3)}" fill="none" stroke="${ALU_D}" stroke-width=".45"/>` },
        { d: hLid, fill: P.night, inner: `<path d="M79.4 58.6L96 54" stroke="${P.mid}" stroke-width=".8"/>` + k.sh(hLid, 0, 0, 0, 1, 0, 0.6, '#000', 0.3) },
      ], 0.75) +
      [[80.6, 59.8], [86.4, 65.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<circle cx="70.6" cy="58" r="1.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="70.2" cy="57.6" r=".4" fill="#fff"/>` +
      k.draw([{ d: weight, fill: P.night, inner: `<path d="M57.6 50.4H62.4" stroke="${P.mid}" stroke-width=".6"/>` }, { d: knob, fill: P.gold, inner: k.sh(knob, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) }], 0.5) +
      hair(57.4, 50, 50, 46, 46, 38, 1.1, P.blue) + hair(62.6, 50, 70, 46, 74, 38, 1.1, P.blue) + hair(55, 47, 50, 40, 52, 32, 0.7, P.blue) + hair(65, 47, 70, 40, 68, 32, 0.7, P.blue) +
      puff(k, 44, 33, 9) + puff(k, 76, 32, 9.6) +
      `<text x="60" y="27.6" ${GEORGIA} font-style="italic" font-size="5.4" fill="${P.ink}" text-anchor="middle">¡fiiiu!</text>` +
      sparkle(90, 42, 2, '#fff') + sparkle(30, 52, 1.6) +
      k.defs()
    )
  },
}
