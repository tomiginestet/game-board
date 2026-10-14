// Piezas de fútbol para las medallas de Fútbol 5 y de la Tanda de penales (no exporta ilustraciones): la pelota de
// gajos, el botín de perfil, el guante de arquero, el arco con su red, la tarjeta, la cinta con rótulo y el césped.
// Mismo dibujo que las de eafc.ts, pero sin el cian de la ficha de EA: acá la franja del botín y el guante van en
// la paleta P (celeste, dorado) y el verde del césped es el propio del deporte.
import { f } from '../helpers'
import { ellipse, hair, P, roundRect, starPath, type Kit } from '../kit'

export const GEORGIA = 'font-family="Georgia, serif"'
/** Verde césped, apagado, con su sombra y una luz. */
export const GRASS = '#6E9B45', GRASS_D = '#4A6E2C', GRASS_L = '#A3C27A'
export const FULL = 'M0 0H120V130H0Z'

// ── La pelota: un icosaedro truncado de verdad, proyectado sobre la esfera ──────────────────────────────

type V = [number, number, number]
const PHI = (1 + Math.sqrt(5)) / 2
const norm = (v: V): V => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l] }
const lerp = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const ICO: V[] = ([[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]] as V[]).map(norm)
const NB = ICO.map((v, i) => ICO.map((_, j) => j).filter((j) => j !== i && Math.hypot(v[0] - ICO[j][0], v[1] - ICO[j][1], v[2] - ICO[j][2]) < 1.1))

export interface BallOpts { a?: number; b?: number; c?: number; fill?: string; patch?: string; shade?: string; w?: number; over?: string }

/** Pelota de gajos (pentágonos de tinta y hexágonos blancos) en (cx,cy) de radio r; `a`,`b`,`c` giran la esfera. */
export function ball(k: Kit, cx: number, cy: number, r: number, o: BallOpts = {}) {
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
      (o.over ?? '') +
      `<ellipse cx="${f(cx - r * 0.38)}" cy="${f(cy - r * 0.42)}" rx="${f(r * 0.26)}" ry="${f(r * 0.14)}" fill="#fff" opacity=".8" transform="rotate(-38 ${f(cx - r * 0.38)} ${f(cy - r * 0.42)})"/>`,
  }], o.w ?? f(Math.min(0.8, r * 0.06)))
}

// ── El botín: de perfil, la punta a la derecha y la suela en y=0 ─────────────────────────────────────────

export const BOOT = 'M-21 -1.2C-22.6 -5 -22.4 -11 -20.8 -15.4C-20 -17.8 -18.6 -19.3 -16.4 -19.4C-13.4 -19.6 -10.8 -18.8 -8.6 -17.4C-7.8 -19.4 -6.2 -20.6 -4.2 -20.4C-2.6 -20.2 -1.8 -19 -2.2 -17.4' +
  'C2 -14.8 7.6 -11.6 13 -9.2C17.6 -7.2 21.6 -5.8 23 -3.4C23.8 -2 23.4 -.6 22 0H-20C-20.6 0 -21 -.6 -21 -1.2Z'
export const SOLE = 'M-21.2 -.6H22.4C23.6 -.6 24 .6 23.2 1.4C22.6 2 21.6 2.3 20.2 2.3H-19.4C-20.8 2.3 -21.8 1.4 -21.2 -.6Z'
const STUDS = [-17.6, -12.4, 1.6, 7.6, 13.4, 18.4]
export const STUDS_D = STUDS.map((x) => `M${f(x - 1.7)} 2.2L${f(x - 1)} 5H${f(x + 1)}L${f(x + 1.7)} 2.2Z`).join('')

export interface BootOpts { studs?: string; stripe?: string; stripeD?: string; body?: string; over?: string }

/** Botín de cuero con dos franjas, cordones blancos y tapones. `over` va encima del cuero, recortado a él. */
export function boot(k: Kit, o: BootOpts = {}) {
  const stripeC = o.stripe ?? P.sky, stripeD = o.stripeD ?? P.blue, body = o.body ?? P.night
  const stripe = 'M-13.6 -.4C-10 -6.4 -6 -11.4 -1.4 -15.4L1.8 -13.8C-2.4 -10 -6 -5.4 -8.8 -.4Z'
  const stripe2 = 'M-7.4 -.4C-4.6 -5 -1.4 -9 2.6 -12.6L4.6 -11.6C1 -8.2 -1.8 -4.4 -4.2 -.4Z'
  const eyelets = [0, 1, 2, 3, 4].map((i) => { const t = i / 4; return [-1.4 + t * 10.6, -16.4 + t * 5.6] })
  const laces = eyelets.map(([x, y]) => `<path d="M${f(x - 1.3)} ${f(y - 1.4)}L${f(x + 1.5)} ${f(y + 1.2)}M${f(x - 1.3)} ${f(y + 1.2)}L${f(x + 1.5)} ${f(y - 1.4)}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${f(x - 1.3)} ${f(y - 1.4)}L${f(x + 1.5)} ${f(y + 1.2)}M${f(x - 1.3)} ${f(y + 1.2)}L${f(x + 1.5)} ${f(y - 1.4)}" stroke="${P.white}" stroke-width=".8" stroke-linecap="round"/>`).join('')
  return (
    k.draw([
      { d: STUDS_D, fill: o.studs ?? P.white, inner: k.sh(STUDS_D, 0, 0, 1, 0, 0, 0.9, o.studs ? P.goldD : P.blue, 0.4) },
      { d: SOLE, fill: P.white, inner: k.sh(SOLE, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="M-20 .8H22" stroke="${P.sky}" stroke-width=".4"/>` },
      {
        d: BOOT, fill: body,
        inner:
          `<path d="M-24 -22H6C0 -16 -8 -12 -24 -10Z" fill="${k.lin(P.mid, 0, 0, 0, 1, 0.75, 0)}"/>` +
          k.sh('M4 -22H26V2H4Z', 0, 0, 1, 0, 0, 0.7, '#0F1736', 0.45) +
          `<path d="M-8.6 -17.4C-7.8 -19.4 -6.2 -20.6 -4.2 -20.4C-2.6 -20.2 -1.8 -19 -2.2 -17.4C-3.4 -16.6 -6.6 -16.4 -8.6 -17.4Z" fill="${P.mid}"/>` +
          `<path d="${stripe}" fill="${stripeC}"/><path d="${stripe2}" fill="${stripeC}"/>` +
          k.sh(stripe + stripe2, 0, 0, 0, 1, 0, 0.6, stripeD, 0.4) +
          `<path d="M-12.4 -1.6C-9 -6.8 -5.4 -11 -1.4 -14.4M-6.6 -1.6C-4 -5.6 -1 -9 2.4 -11.8" fill="none" stroke="${P.white}" stroke-width=".45" opacity=".7"/>` +
          `<path d="M12.6 -9.4C15.4 -6.4 16.4 -3.4 16 0" fill="none" stroke="${P.mid}" stroke-width=".55"/>` +
          `<path d="M13.6 -8.8C16.4 -5.8 17.4 -3 17 0" fill="none" stroke="${P.mid}" stroke-width=".35" stroke-dasharray=".8 .7"/>` +
          `<path d="M-15.4 0C-15.8 -6 -16 -12 -16.6 -19" fill="none" stroke="${P.mid}" stroke-width=".55"/>` +
          `<path d="M-14.4 0C-14.8 -6 -15 -12 -15.6 -18.8" fill="none" stroke="${P.mid}" stroke-width=".35" stroke-dasharray=".8 .7"/>` +
          hair(-19.6, -4, -20.4, -10, -19, -16, 0.7, P.sky, 0.8) + hair(-1, -16.6, 6, -13, 13.6, -9.8, 0.6, P.sky, 0.7) + hair(15, -7.4, 19, -6, 21.6, -4, 0.55, '#fff', 0.8) +
          (o.over ?? ''),
      },
    ], 0.7) +
    `<path d="M-1.6 -16.6L9.6 -10.6" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/>` +
    laces + `<path d="M-1.8 -15.6C-3.6 -13 -3 -10.6 -4.6 -8.6M-.4 -15.6C.4 -12.6 -.6 -10.4 .6 -8" fill="none" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>`
  )
}

// ── El guante de arquero: de frente, la palma a la vista, la muñeca abajo en y≈21 ───────────────────────────

const FINGERS: [number, number, number, number][] = [[-8.2, -21.6, 5.6, -9], [-2.7, -25.6, 5.6, -2], [2.8, -24.2, 5.6, 3], [8.2, -18.6, 5.2, 10]]
const fingerPath = (x: number, top: number, w: number) => `M${f(x - w / 2)} -4V${f(top + w / 2)}A${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(x + w / 2)} ${f(top + w / 2)}V-4Z`
export const PALM = 'M-11 10C-12.4 4 -12.6 -2 -11.2 -7.4H11.2C12.4 -2 12.4 4 11 10Z'
export const THUMB = 'M-10.6 7C-14.6 5 -17.8 .6 -19.4 -4.6C-20.2 -7.2 -18.8 -9.2 -16.6 -8.6C-14.6 -8 -13 -5.4 -10.8 -2.4Z'
export const CUFF = roundRect(-9.6, 8, 9.6, 21.4, 2.4)

export interface GloveOpts { shell?: string; shellD?: string; latex?: string; latexD?: string; strap?: string }

/** Guante de arquero (mano derecha, palma al frente): cáscara de color, látex claro en la palma y muñequera con abrojo. */
export function glove(k: Kit, o: GloveOpts = {}) {
  const shell = o.shell ?? P.sky, shellD = o.shellD ?? P.blue, latex = o.latex ?? P.white, latexD = o.latexD ?? P.blue
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
      ? `<path d="${starPath(4.6, 15.4, 2.2, 0.9, 5)}" fill="${P.goldL}" stroke="${shellD}" stroke-width=".3"/>` +
        FINGERS.map(([x, top, w, r]) => `<path d="M${f(x - w / 2 + 0.6)} -4V${f(top + w / 2)}" transform="rotate(${r} ${x} -4)" stroke="${shellD}" stroke-width=".35" stroke-dasharray=".7 .6"/>`).join('')
      : '')
  )
}

// ── El arco ──────────────────────────────────────────────────────────────────────────────────────────

/** Red de arco: cuadrícula de hilos recortada a `d`, con `bend` desplazando cada nudo (para la red inflada). */
export function net(k: Kit, d: string, x0: number, y0: number, x1: number, y1: number, step: number, bend: (x: number, y: number) => [number, number] = (x, y) => [x, y], c = P.white, skip?: (x: number, y: number) => boolean) {
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

/** Palos y travesaño blancos de un arco de x0 a x1, con el travesaño en y0 y los palos hasta y1. `w` es el grosor. */
export function goalFrame(k: Kit, x0: number, x1: number, y0: number, y1: number, w = 3.6, castColor = P.mid, fill = P.white, shadeC = P.blue) {
  const bar = roundRect(x0, y0, x1, y0 + w, w * 0.44), pl = roundRect(x0, y0, x0 + w, y1, w * 0.44), pr = roundRect(x1 - w, y0, x1, y1, w * 0.44)
  return (
    k.cast([bar, pl, pr], 1.6, 1.6, castColor) +
    k.draw([
      { d: pl, fill, inner: k.sh(pl, 0, 0, 1, 0, 0, 0.7, shadeC, 0.35) },
      { d: pr, fill, inner: k.sh(pr, 0, 0, 1, 0, 0, 0.7, shadeC, 0.35) },
      { d: bar, fill, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.7, shadeC, 0.35) + `<path d="M${x0 + 1} ${f(y0 + w * 0.32)}H${x1 - 1}" stroke="#fff" stroke-width=".6"/>` },
    ], 0.6)
  )
}

/** Césped a rayas de corte desde y0 hasta abajo, con su sombra. */
export function grass(k: Kit, y0: number, stripes = true) {
  const g = `M0 ${y0}H120V130H0Z`
  return (
    `<path d="${g}" fill="${GRASS}"/>` + k.sh(g, 0, 0, 0, 1, 0, 0.6, GRASS_D, 0.4) +
    (stripes ? [0, 1, 2, 3].map((i) => `<path d="M${-4 + i * 32} ${y0}L${10 + i * 32} ${y0}L${-2 + i * 34} 130L${-18 + i * 34} 130Z" fill="#fff" opacity=".1"/>`).join('') : '') +
    `<path d="M0 ${y0}H120" stroke="${GRASS_D}" stroke-width=".6"/>`
  )
}

// ── La tarjeta y la cinta ──────────────────────────────────────────────────────────────────────────

/** Tarjeta (roja por defecto) parada con la base en (0,0), de 11×15. */
export function card(k: Kit, fill = P.red, dark = P.wine) {
  const d = roundRect(-5.6, -15.4, 5.6, 0, 1.2)
  return k.draw([{
    d, fill,
    inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, dark, 0.45) + `<path d="M-5.6 -15.4H-1V0H-5.6Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
      hair(-4, -13.6, -4.4, -8, -4, -2, 0.5, '#fff', 0.7),
  }], 0.6)
}

/** Cinta con las puntas en cola de golondrina y un texto en cursiva sobre su curva. */
export function banner(k: Kit, cx: number, cy: number, w: number, fill: string, dark: string, text: string, tc: string, fs = 4.4) {
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

/** Rótulo en cursiva Georgia. */
export const label = (x: number, y: number, s: number, txt: string, c = P.ink, rot = 0) =>
  `<text x="${x}" y="${y}" ${GEORGIA} font-style="italic" font-size="${s}" fill="${c}" text-anchor="middle"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${txt}</text>`

/** Estrellas chicas (puntos de papel) para el cielo de noche. */
export const stars = (pts: [number, number][], c = P.paper) => pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${c}"/>`).join('')
