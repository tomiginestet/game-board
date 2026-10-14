// Desafío del travesaño, en clave heroica. Los objetos del desafío: el arco con su travesaño que suena, la pelota de
// gajos, la campana de iglesia, el calibre de taller y las torres de luz del club de noche.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Verde césped. */
const GRASS = '#6E9B45', GRASS_D = '#4A6E2C'
/** Acero del calibre. */
const STEEL = '#DCE3EE', STEEL_D = '#8C9AB8'
/** Bronce de la campana. */
const BRONZE = '#D9A15A', BRONZE_D = '#9C6830', BRONZE_L = '#F1CF94'

// ── La pelota: un icosaedro truncado proyectado sobre la esfera (como en la del EA FC) ────────────────

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

// ── El arco ──────────────────────────────────────────────────────────────────────────────────────────

/** Travesaño y palos blancos entintados, con la sombra proyectada. `y0` es el borde de arriba del travesaño. */
function goal(k: Kit, x0: number, x1: number, y0: number, y1: number, w = 3.8, cast = P.mid) {
  const bar = roundRect(x0, y0, x1, f(y0 + w), 1.6), postL = roundRect(x0, y0, f(x0 + w), y1, 1.6), postR = roundRect(f(x1 - w), y0, x1, y1, 1.6)
  return (
    k.cast([bar, postL, postR], 1.6, 1.6, cast) +
    k.draw([
      { d: postL, fill: P.white, inner: k.sh(postL, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) },
      { d: postR, fill: P.white, inner: k.sh(postR, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) },
      { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.75, P.blue, 0.4) + `<path d="M${f(x0 + 1)} ${f(y0 + 1.2)}H${f(x1 - 1)}" stroke="#fff" stroke-width=".6"/>` },
    ], 0.6)
  )
}

/** Red de fondo: cuadrícula fina recortada a un rectángulo. */
function net(k: Kit, x0: number, y0: number, x1: number, y1: number, step: number, c = P.white, op = 0.8) {
  let d = ''
  for (let x = x0; x <= x1 + 0.01; x += step) d += `M${f(x)} ${y0}V${y1}`
  for (let y = y0; y <= y1 + 0.01; y += step) d += `M${x0} ${f(y)}H${x1}`
  return k.clip(`M${x0} ${y0}H${x1}V${y1}H${x0}Z`, `<path d="${d}" stroke="${P.ink}" stroke-width=".9" opacity="${f(op * 0.5)}"/><path d="${d}" stroke="${c}" stroke-width=".45" opacity="${op}"/>`)
}

/** Golpe contra el palo: estrella de tinta y oro con rayitas que salen. */
function hit(x: number, y: number, r: number, c = P.goldL) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + 0.2, r0 = r * 1.15, r1 = r * (i % 2 ? 1.6 : 1.9)
    return hair(f(x + Math.cos(a) * r0), f(y + Math.sin(a) * r0), f(x + Math.cos(a) * (r0 + r1) / 2), f(y + Math.sin(a) * (r0 + r1) / 2), f(x + Math.cos(a) * r1), f(y + Math.sin(a) * r1), 0.9, P.goldD)
  }).join('')
  return `<path d="${starPath(x, y, r, r * 0.45, 8, -80)}" fill="${c}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` + rays
}

/** Ondas del sonido: arcos concéntricos hacia un lado (`dir` en grados). */
function waves(x: number, y: number, dir: number, n = 3, r0 = 5, gap = 3.4, c = P.mid) {
  return Array.from({ length: n }, (_, i) => {
    const r = r0 + i * gap, a0 = ((dir - 32) * Math.PI) / 180, a1 = ((dir + 32) * Math.PI) / 180
    const d = `M${f(x + Math.cos(a0) * r)} ${f(y + Math.sin(a0) * r)}A${r} ${r} 0 0 1 ${f(x + Math.cos(a1) * r)} ${f(y + Math.sin(a1) * r)}`
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(1.1 - i * 0.2)}" stroke-linecap="round" opacity="${f(0.9 - i * 0.15)}"/>`
  }).join('')
}

// ── La campana ───────────────────────────────────────────────────────────────────────────────────────

const BELL = 'M-10 8.6C-10 1 -9 -5.6 -6.2 -9.6C-4.2 -12.4 4.2 -12.4 6.2 -9.6C9 -5.6 10 1 10 8.6C11.8 9.4 12.8 10.6 12.8 12H-12.8C-12.8 10.6 -11.8 9.4 -10 8.6Z'

function bell(k: Kit) {
  const crown = 'M-3 -11.6V-14.4C-3 -16.4 3 -16.4 3 -14.4V-11.6Z'
  const clapper = ellipse(0, 13.6, 2.2, 2.2)
  return (
    k.draw([{ d: clapper, fill: BRONZE_D }], 0.5) +
    k.draw([
      { d: crown, fill: BRONZE, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.8, BRONZE_D, 0.45) },
      {
        d: BELL, fill: BRONZE,
        inner: k.sh(BELL, 0, 0, 1, 0, 0, 0.85, BRONZE_D, 0.5) + `<path d="M-14 -14H-4V14H-14Z" fill="${k.lin(BRONZE_L, 0, 0, 1, 0, 0.9, 0)}"/>` +
          `<path d="M-9.4 3H9.4M-9.8 5H9.8" stroke="${BRONZE_D}" stroke-width=".5"/><path d="M-12 10H12" stroke="${BRONZE_D}" stroke-width=".7"/>` +
          `<path d="M-6.6 -7.4H6.6" stroke="${BRONZE_D}" stroke-width=".45"/>` +
          `<path d="${starPath(0, -2, 2.6, 1.1, 5)}" fill="${BRONZE_L}" stroke="${BRONZE_D}" stroke-width=".35"/>` +
          hair(-7.4, -6, -8.6, 0, -8.4, 7, 0.9, '#fff', 0.8),
      },
    ], 0.75)
  )
}

// ── El calibre de taller ─────────────────────────────────────────────────────────────────────────────

/** Calibre con la regla en y=0 (de x0 a x1), la mandíbula fija en `xa` y la corrediza en `xb`, de largo `h`. */
function caliper(k: Kit, x0: number, x1: number, xa: number, xb: number, h: number) {
  const beam = roundRect(x0, 0, x1, 6, 1)
  const jawA = `M${xa - 6} 0H${xa}V${h - 4}L${xa - 3} ${h}C${xa - 5} ${h - 6} ${xa - 6} ${h - 14} ${xa - 6} ${h - 22}Z`
  const jawB = `M${xb} -2H${xb + 12}V8H${xb + 6}V${h - 22}C${xb + 6} ${h - 14} ${xb + 5} ${h - 6} ${xb + 3} ${h}L${xb} ${h - 4}Z`
  const ticks = Array.from({ length: Math.floor((x1 - x0 - 6) / 1.6) }, (_, i) => { const x = x0 + 3 + i * 1.6; return `M${f(x)} 0V${i % 5 ? 1.6 : 2.8}` }).join('')
  const vern = Array.from({ length: 7 }, (_, i) => `M${f(xb + 1.4 + i * 1.5)} 6.6V${i % 2 ? 7.4 : 8}`).join('')
  return (
    k.draw([
      { d: beam, fill: STEEL, inner: k.sh(beam, 0, 0, 0, 1, 0, 0.8, STEEL_D, 0.45) + `<path d="${ticks}" stroke="${P.ink}" stroke-width=".3"/>` + `<path d="M${x0} 4.4H${x1}" stroke="${STEEL_D}" stroke-width=".4"/>` },
      { d: jawA, fill: STEEL, inner: k.sh(jawA, 0, 0, 1, 0, 0.2, 1, STEEL_D, 0.6) + `<path d="M${xa - 5} 2V${h - 10}" stroke="#fff" stroke-width=".6"/>` },
      { d: jawB, fill: STEEL, inner: k.sh(jawB, 0, 0, 1, 0, 0.2, 1, STEEL_D, 0.6) + `<path d="${vern}" stroke="${P.ink}" stroke-width=".3"/>` + `<path d="M${xb + 1} -1H${xb + 11}" stroke="#fff" stroke-width=".5"/>` },
    ], 0.7) +
    `<circle cx="${xb + 9}" cy="-3.4" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M${xb + 8} -3.4H${xb + 10}" stroke="${P.goldD}" stroke-width=".5"/>`
  )
}

// ── La torre de luz ──────────────────────────────────────────────────────────────────────────────────

function tower(k: Kit, x: number, top: number, bottom: number, flip = 1) {
  const head = roundRect(-7, -5, 7, 5, 1.2)
  const lamps = [[-4, -2.2], [0, -2.2], [4, -2.2], [-4, 2.2], [0, 2.2], [4, 2.2]].map(([lx, ly]) => `<circle cx="${lx}" cy="${ly}" r="1.5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(lx - 0.4)}" cy="${f(ly - 0.4)}" r=".5" fill="#fff"/>`).join('')
  const mast = `M${x - 1.4} ${top + 4}L${x - 2.4} ${bottom}H${x + 2.4}L${x + 1.4} ${top + 4}Z`
  const lattice = Array.from({ length: Math.floor((bottom - top - 6) / 4) }, (_, i) => `M${x - 1.6} ${top + 6 + i * 4}L${x + 1.6} ${top + 8 + i * 4}`).join('')
  return (
    k.draw([{ d: mast, fill: P.mid, inner: `<path d="${lattice}" stroke="${P.sky}" stroke-width=".35"/>` }], 0.45) +
    `<g transform="translate(${x} ${top}) rotate(${flip * 10})">` + k.draw([{ d: head, fill: P.night, inner: lamps }], 0.5) + `</g>`
  )
}

/** Haz de luz desde (x,y) hacia (tx,ty), con apertura `w`. */
const beam = (k: Kit, x: number, y: number, tx: number, ty: number, w: number) => {
  const a = Math.atan2(ty - y, tx - x), px = -Math.sin(a) * w, py = Math.cos(a) * w
  const d = `M${f(x)} ${f(y)}L${f(tx + px)} ${f(ty + py)}L${f(tx - px)} ${f(ty - py)}Z`
  return k.shade(d, k.lin(P.goldL, x < tx ? 0 : 1, 0, x < tx ? 1 : 0, 0, 0.7, 0), P.goldL, 0.45)
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

export const TRAVESANO_ART: Record<string, (u: number) => string> = {
  // ── Clang ─────────────────────────────────────────────────────────

  // Tres ganados: el travesaño hecho campanario. La pelota pega arriba y la campana de iglesia suena a dos cuadras.
  'Campana de iglesia': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 60, 15, 46, 32, false) +
      k.shade(ellipse(60, 62, 26, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      net(k, 27, 44, 93, 96, 5, P.white, 0.6) +
      goal(k, 23, 97, 39, 104) +
      `<path d="M60 42.6V52" stroke="${P.ink}" stroke-width="1.8"/><path d="M60 42.6V52" stroke="${P.goldL}" stroke-width=".8"/>` +
      `<g transform="translate(60 68) rotate(8 0 -13) scale(1.26)">` + k.cast([BELL], 1.4, 1.4) + bell(k) + `</g>` +
      waves(60, 70, 0, 3, 20, 3.4) + waves(60, 70, 180, 3, 20, 3.4) +
      hit(41, 41, 3.4) +
      ball(k, 37, 51.4, 7.4, { a: 0.4, b: 0.7 }) +
      hair(30, 62, 33, 59, 34.4, 56, 0.7, P.mid) + hair(26, 60, 29, 56, 30, 53, 0.6, P.mid) +
      `<text x="60" y="33.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="6.4" fill="${P.ink}" text-anchor="middle">¡clang!</text>` +
      sparkle(84, 50, 1.8) + sparkle(30, 76, 1.4, P.white) +
      k.defs()
    )
  },

  // Diez ganados: el calibre de taller mide la pelota al milímetro. Lo de "desde la mitad de la cancha" es ciencia.
  'Pie de calibre': (u) => {
    const k = kit(u)
    const cx = 56, cy = 64, r = 14.6
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(cx, 82, 16, 2.2, P.mid) +
      ball(k, cx, cy, r, { a: 0.3, b: 0.4, c: 0.2 }) +
      `<g transform="translate(0 40)">` + k.cast([roundRect(24, 0, 94, 6, 1)], 1.6, 1.6) + caliper(k, 24, 94, f(cx - r), f(cx + r), 38) + `</g>` +
      `<path d="M${f(cx - r + 1)} 85H${f(cx + r - 1)}" stroke="${P.ink}" stroke-width=".6"/><path d="M${f(cx - r + 3)} 83.6L${f(cx - r + 0.8)} 85L${f(cx - r + 3)} 86.4M${f(cx + r - 3)} 83.6L${f(cx + r - 0.8)} 85L${f(cx + r - 3)} 86.4" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `<text x="${cx}" y="92" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.6" fill="${P.ink}" text-anchor="middle">22 cm</text>` +
      `<text x="60" y="34.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="5" fill="${P.ink}" text-anchor="middle">al milímetro</text>` +
      sparkle(86, 66, 2) + sparkle(34, 86, 1.4) +
      k.defs()
    )
  },

  // Treinta ganados: de noche, con las torres de luz del club prendidas; la pelota pega en el travesaño y el
  // "¡clang!" queda escrito en la cinta dorada.
  'Leyenda del entrenamiento': (u) => {
    const k = kit(u)
    const grass = 'M0 84H120V130H0Z'
    return (
      k.night() +
      [[44, 22], [76, 22], [56, 18], [66, 26]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      beam(k, 30, 30, 62, 80, 14) + beam(k, 90, 30, 58, 80, 14) +
      `<path d="${grass}" fill="${GRASS}"/>` + k.sh(grass, 0, 0, 0, 1, 0, 0.8, GRASS_D, 0.45) +
      [0, 1, 2, 3].map((i) => `<path d="M${-4 + i * 32} 84L${10 + i * 32} 84L${-2 + i * 34} 104L${-18 + i * 34} 104Z" fill="#fff" opacity=".1"/>`).join('') +
      tower(k, 30, 30, 84, -1) + tower(k, 90, 30, 84, 1) +
      laurel(48, 100, 28, 92, 26, 64, 8) + laurel(72, 100, 92, 92, 94, 64, 8, true) +
      net(k, 39, 50, 81, 84, 4.2, P.sky1, 0.5) +
      goal(k, 35.4, 84.6, 46, 85, 3.6, '#0F1736') +
      hit(64, 47.8, 3.4) +
      waves(64, 47.8, -90, 3, 6, 3, P.goldL) +
      ball(k, 66, 58, 8.4, { a: 0.5, b: -0.4 }) +
      hair(78, 72, 75, 68, 73, 64.6, 0.8, P.goldL) + hair(82, 70, 79, 66, 76.6, 62.6, 0.6, P.goldL) +
      banner(k, 60, 88, 34, P.gold, P.goldD, '¡clang!', P.night, 5.4) +
      sparkle(46, 40, 2.2, P.goldL) + sparkle(80, 38, 1.8, P.goldL) +
      k.defs()
    )
  },
}
