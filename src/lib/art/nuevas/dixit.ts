// Dixit, el de las cartas de sueño y las frases crípticas, en clave heroica. Manda el naranja de la ficha del juego
// (#E67700): el papel del día lleva su grano durazno y la noche de sueño, su resplandor. Nada de caras ni muñequitos:
// la abuela es sus anteojos sobre el libro, el poeta su boina y su pluma, el pintor un bigote y un pincel, el
// hipnotizador su péndulo. A Borges no se lo dibuja: están su bastón y su laberinto.
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Naranja de la ficha de Dixit, con su sombra, su luz, un durazno pálido y la noche de sueño (ciruela tostada). */
const DX = '#E67700', DX_D = '#9A4800', DX_L = '#F7B163', DX_XL = '#FCE5C6', DX_N = '#2B1626'
/** Rosa de las orejas del conejo y del forro. */
const PINK = '#EFB2A6'
/** Negro tinta de la boina, la galera y el bigote. */
const SOOT = '#221A26', SOOT_L = '#4A3D52'
/** Nogal del bastón. */
const WALNUT = '#6B3B1C', WALNUT_D = '#3A1C0B'

/** Papel del día con el borde granulado en el durazno de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#F3C18C', 0.5, 0.46, 0.7, 0, 1), '#E59A55', 0.5)

/** Noche de sueño: ciruela tostada con el resplandor naranja en el medio. */
const dream = (k: Kit, cx = 0.5, cy = 0.44, r = 0.56) =>
  `<rect width="120" height="130" fill="${DX_N}"/>` + k.shade(FULL, k.rad(DX, cx, cy, r, 0.85, 0), DX, 0.4)

/** Escenario durazno: un disco pálido con el borde granulado. */
const stageO = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${DX_XL}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(DX_L, 0.5, 0.5, 0.5, 0, 1), DX_L, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${DX}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor dorado suave. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Estrellitas de la noche. */
const stars = (list: number[][], c = P.paper) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".85"/>`).join('')

/** Espeja un path de comandos absolutos (M L H V C Q Z) alrededor de la vertical x = cx. */
function mirror(d: string, cx = 60) {
  return d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (_, c: string, args: string) => {
    const n = (args.match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? []).map(Number)
    if (c === 'H') return 'H' + n.map((x) => f(2 * cx - x)).join(' ')
    if (c === 'V' || c === 'Z') return c + n.join(' ')
    return c + n.map((v, i) => (i % 2 ? v : f(2 * cx - v))).join(' ')
  })
}

/** Cordón (hilo, cadena, soga): tinta por fuera, color y un brillo fino. */
const cord = (d: string, c: string, w = 1.2, hi = '#fff') =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 1.9)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" opacity=".55" transform="translate(-.25 -.25)"/>`

/** Medialuna: el círculo (x0,y0,R) menos el círculo (x1,y1,r), como un solo contorno. */
function crescent(x0: number, y0: number, R: number, x1: number, y1: number, r: number, N = 44) {
  const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy), a = (R * R - r * r + d * d) / (2 * d), h = Math.sqrt(R * R - a * a)
  const ux = dx / d, uy = dy / d, px = x0 + ux * a, py = y0 + uy * a
  const P1 = [px - uy * h, py + ux * h], P2 = [px + uy * h, py - ux * h]
  const TAU = Math.PI * 2, m = (v: number) => ((v % TAU) + TAU) % TAU
  const arc = (cx: number, cy: number, rr: number, p: number[], q: number[]) => {
    const a1 = Math.atan2(p[1] - cy, p[0] - cx), a2 = Math.atan2(q[1] - cy, q[0] - cx), af = Math.atan2(-uy, -ux)
    const d2 = m(a2 - a1), span = m(af - a1) < d2 ? d2 : d2 - TAU
    return Array.from({ length: N + 1 }, (_, i) => { const t = a1 + (span * i) / N; return `${f(cx + Math.cos(t) * rr)} ${f(cy + Math.sin(t) * rr)}` })
  }
  return `M${arc(x0, y0, R, P1, P2).join('L')}L${arc(x1, y1, r, P2, P1).join('L')}Z`
}

/** Pluma de escribir a lo largo de una curva: cálamo pelado abajo y la barba asimétrica arriba. */
function quill(k: Kit, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, wl: number, wr: number) {
  const N = 26, Lp: string[] = [], Rp: string[] = []
  const pts = along(x0, y0, cx, cy, x1, y1, Array.from({ length: N + 1 }, (_, i) => i / N))
  const prof = (t: number) => (t < 0.2 ? 0 : Math.sin(Math.PI * Math.pow((t - 0.2) / 0.8, 0.62)))
  pts.forEach((q, i) => {
    const t = i / N, len = Math.hypot(q.dx, q.dy) || 1, nx = -q.dy / len, ny = q.dx / len, s = prof(t)
    // Dos muescas en la barba, como en las plumas de verdad.
    const notchL = t > 0.5 && t < 0.56 ? 0.55 : 1, notchR = t > 0.66 && t < 0.72 ? 0.5 : 1
    Lp.push(`${f(q.x + nx * wl * s * notchL)} ${f(q.y + ny * wl * s * notchL)}`)
    Rp.push(`${f(q.x - nx * wr * s * notchR)} ${f(q.y - ny * wr * s * notchR)}`)
  })
  const vane = `M${Lp.join('L')}L${Rp.reverse().join('L')}Z`
  const barbs = pts.filter((_, i) => i > 6 && i < N - 1 && i % 2 === 0).map((q, j) => {
    const len = Math.hypot(q.dx, q.dy) || 1, tx = q.dx / len, ty = q.dy / len, nx = -ty, ny = tx, t = (j * 2 + 8) / N, s = prof(t)
    return hair(q.x, q.y, q.x + nx * wl * s * 0.5 - tx * 1.2, q.y + ny * wl * s * 0.5 - ty * 1.2, q.x + nx * wl * s * 0.9 - tx * 2.6, q.y + ny * wl * s * 0.9 - ty * 2.6, 0.35, DX_D, 0.7) +
      hair(q.x, q.y, q.x - nx * wr * s * 0.5 - tx * 1.2, q.y - ny * wr * s * 0.5 - ty * 1.2, q.x - nx * wr * s * 0.9 - tx * 2.6, q.y - ny * wr * s * 0.9 - ty * 2.6, 0.3, P.blue, 0.7)
  }).join('')
  const shaft = `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`
  return (
    k.draw([{ d: vane, fill: P.white, inner: k.sh(vane, 0, 0, 1, 1, 0, 0.8, DX_L, 0.45) + barbs }], 0.6) +
    `<path d="${shaft}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${shaft}" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>`
  )
}

/** Laberinto circular visto de arriba: piso tostado, muros dorados, guarda griega y el hilo rojo que sale. */
function labyrinth(k: Kit, cx: number, cy: number) {
  const P2 = (r: number, a: number) => `${f(cx + Math.cos((a * Math.PI) / 180) * r)} ${f(cy + Math.sin((a * Math.PI) / 180) * r)}`
  const rings = [5.4, 10.6, 15.8, 21, 26.2]
  const gaps = [-90, 0, 150, 30, -60]
  let walls = ''
  rings.forEach((r, i) => {
    const hw = ((1.9 / r) * 180) / Math.PI
    walls += `M${P2(r, gaps[i] + hw)}A${r} ${r} 0 1 1 ${P2(r, gaps[i] - hw)}`
  })
  // Muros radiales, lejos del camino de salida.
  const radial: [number, number][] = [[0, 135], [0, 60], [1, 200], [1, 280], [2, 330], [2, 250], [2, 280], [3, 100], [3, 190], [3, 140]]
  radial.forEach(([i, a]) => { walls += `M${P2(rings[i], a)}L${P2(rings[i + 1], a)}` })
  const floor = ellipse(cx, cy, 28.6, 28.6)
  // El camino: del centro afuera, por los pasillos.
  const mid = [8, 13.2, 18.4, 23.6]
  const arcTo = (r: number, a0: number, a1: number) => `L${P2(r, a0)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${P2(r, a1)}`
  const thread =
    `M${cx} ${cy}L${P2(2, -90)}` + arcTo(mid[0], -90, 0) + arcTo(mid[1], 0, 150) + arcTo(mid[2], 150, 30) + arcTo(mid[3], 30, -60) +
    `L${P2(31, -60)}Q${P2(36, -48)} ${P2(37, -38)}`
  // Guarda griega en el anillo de afuera.
  const n = 26, r0 = 29.6, r1 = 33.4
  const key = [[0, 0], [0, 1], [0.78, 1], [0.78, 0.3], [0.5, 0.3], [0.5, 0.68], [0.24, 0.68], [0.24, 0], [1, 0]]
  let meander = ''
  for (let i = 0; i < n; i++) meander += key.map(([u, v], j) => (j || i ? 'L' : 'M') + P2(r0 + v * (r1 - r0), ((i + u) * 360) / n)).join('')
  const band = `${ellipse(cx, cy, 34.6, 34.6)}`
  return (
    k.cast([band], 2.2, 2.4, '#14080F') +
    k.draw([{
      d: band, fill: P.gold,
      inner:
        k.sh(band, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M${cx - 36} ${cy - 36}H${cx}V${cy}H${cx - 36}Z" fill="${k.lin(P.goldL, 0, 0, 1, 1, 0.8, 0)}"/>` +
        `<path d="${meander}" fill="none" stroke="${DX_D}" stroke-width=".75" stroke-linejoin="round"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${r1 + 0.5}" fill="none" stroke="${P.goldD}" stroke-width=".4"/>`,
    }], 0.8) +
    k.draw([{
      d: floor, fill: '#5A2A0A',
      inner:
        k.shade(floor, k.rad(DX, 0.42, 0.4, 0.6, 0.8, 0), DX, 0.4) + k.sh(floor, 0, 0, 1, 1, 0, 0.85, DX_N, 0.45) +
        `<path d="${walls}" fill="none" stroke="#3A1606" stroke-width="2.6" stroke-linecap="round" transform="translate(.5 .6)" opacity=".7"/>`,
    }], 0.5) +
    `<path d="${walls}" fill="none" stroke="${P.ink}" stroke-width="2.3" stroke-linecap="round"/>` +
    `<path d="${walls}" fill="none" stroke="${P.gold}" stroke-width="1.3" stroke-linecap="round"/>` +
    `<path d="${walls}" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-linecap="round" transform="translate(-.3 -.3)"/>` +
    cord(thread, '#E0483C', 1, '#FFD9C8') +
    `<circle cx="${cx}" cy="${cy}" r="1.7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>` + sparkle(cx, cy, 3.4, '#fff')
  )
}

/** Bastón de madera con el mango curvo, virola dorada y regatón. Punta abajo en (0,0), largo `len`. */
function cane(k: Kit, len: number) {
  const top = -len
  const shaft = `M-1.9 ${top}L-1.4 -2.4H1.4L1.9 ${top}Z`
  const crook = `M1.9 ${top}A5.8 5.8 0 0 0 -9.7 ${top}L-9.7 ${f(top + 3.8)}A1.8 1.8 0 0 1 -6.1 ${f(top + 3.8)}L-6.1 ${top}A2.1 2.1 0 0 1 -1.9 ${top}Z`
  const collar = `M-2.3 ${f(top + 5)}H2.3V${f(top + 9.4)}H-2.3Z`
  const tip = 'M-1.5 -3.8H1.5L1.2 0H-1.2Z'
  return (
    k.draw([
      {
        d: crook, fill: WALNUT,
        inner: k.sh(crook, 0, 0, 1, 1, 0, 0.9, WALNUT_D, 0.5) + hair(-8.2, top + 2.4, -7.4, top - 4.4, -1.8, top - 4.4, 0.7, P.goldL, 0.9),
      },
      {
        d: shaft, fill: WALNUT,
        inner:
          k.sh(`M0 ${top}H2.4V0H0Z`, 0, 0, 1, 0, 0, 0.95, WALNUT_D, 0.55) + `<path d="M-2 ${top}H-.6V0H-2Z" fill="${P.goldL}" opacity=".55"/>` +
          hair(0.4, top + 12, 0.9, top * 0.6, 0.3, -8, 0.4, WALNUT_D) + hair(-0.7, top * 0.7, -0.2, top * 0.4, -0.6, -14, 0.35, WALNUT_D) +
          `<ellipse cx=".6" cy="${f(top * 0.45)}" rx=".6" ry="1.3" fill="none" stroke="${WALNUT_D}" stroke-width=".35"/><ellipse cx="-.3" cy="${f(top * 0.22)}" rx=".5" ry="1" fill="none" stroke="${WALNUT_D}" stroke-width=".3"/>`,
      },
      { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-2.3 ${f(top + 6.5)}H2.3M-2.3 ${f(top + 7.9)}H2.3" stroke="${P.goldD}" stroke-width=".35"/>` },
      { d: tip, fill: P.gold, inner: k.sh(tip, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
    ], 0.7) +
    `<path d="M-1.5 ${f(top + 5.6)}V${f(top + 8.8)}" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>`
  )
}

export const DIXIT_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Cuentacuentos ──────────────────────────────────────────────────

  // Tres narraciones justas: "Había una vez…" y todos callados. Los anteojos de la abuela sobre el libro abierto.
  'Abuela con cuento': (u) => {
    const k = kit(u)
    const L = 'M0 -14C-8 -20 -22 -21 -32 -17L-30 13C-20 9 -8 10 0 16Z'
    const R = mirror(L, 0)
    const cover = 'M0 -11L-33.6 -16.4L-35.6 -14.4L-33.4 17.4C-21 13.4 -8 14.4 0 20.4C8 14.4 21 13.4 33.4 17.4L35.6 -14.4L33.6 -16.4Z'
    const T = [[-32, -17], [-22, -21], [-8, -20], [0, -14]], B = [[-30, 13], [-20, 9], [-8, 10], [0, 16]]
    // Renglón a la altura `s` (0 arriba, 1 abajo) de la hoja izquierda, de afuera al lomo; `right` lo pasa a la derecha.
    const lineAt = (s: number, right = false) => {
      const p = T.map((t, i) => [f(t[0] + (B[i][0] - t[0]) * s), f(t[1] + (B[i][1] - t[1]) * s)])
      return right ? `M${-p[3][0]} ${p[3][1]}C${-p[2][0]} ${p[2][1]} ${-p[1][0]} ${p[1][1]} ${-p[0][0]} ${p[0][1]}` : `M${p[0][0]} ${p[0][1]}C${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]} ${p[3][0]} ${p[3][1]}`
    }
    const words = ['0 3.4 6 1.3 4 1.3 8 1.3 5 99', '0 3.4 9 1.3 5 1.3 6 99', '0 3.4 4 1.3 7 1.3 5 1.3 6 99', '0 3.4 8 1.3 6 1.3 7 99', '0 3.4 5 1.3 9 1.3 4 99']
    const textL = [0.5, 0.62, 0.74, 0.86].map((s, i) => `<path d="${lineAt(s)}" fill="none" stroke="${P.blue}" stroke-width=".75" stroke-dasharray="${words[i]}"/>`).join('')
    const textR = [0.2, 0.32, 0.44, 0.56, 0.68, 0.8].map((s, i) => `<path d="${lineAt(s, true)}" fill="none" stroke="${P.blue}" stroke-width=".75" stroke-dasharray="${words[(i + 2) % 5]}"/>`).join('')
    const t1 = k.id('ln'), t2 = k.id('ln')
    const lens = (x: number) => ellipse(x, 0, 5.3, 4.3)
    const dust = along(60, 50, 50, 38, 62, 30, [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92]).map((q, i) => `<circle cx="${f(q.x + (i % 2 ? 1.2 : -1))}" cy="${f(q.y)}" r="${f(1 - i * 0.08)}" fill="${i % 3 ? P.gold : P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`).join('')
    const glasses =
      `<g transform="translate(16.6 -1.2) rotate(-7)">` +
      k.floor(1.2, 3.6, 13, 2.6, DX_D) +
      cord('M-11 -1.6L1.6 -5', P.gold, 0.7) + cord('M11 -1.6L-1.6 -5.2', P.gold, 0.7) +
      [-6.2, 6.2].map((x) =>
        k.clip(lens(x), `<path d="${lens(x)}" fill="#fff" opacity=".3"/>` +
          [-1.2, 2].map((y, i) => `<path d="M${x - 6} ${f(y - x * 0.04)}H${x + 6}" stroke="${P.blue}" stroke-width=".95" stroke-dasharray="${i % 2 ? '3 1.4 5 1.4 4' : '5 1.4 3 1.4 6'}"/>`).join('') +
          k.sh(lens(x), 0, 0, 1, 1, 0, 0.5, DX_L, 0.35))).join('') +
      [-6.2, 6.2].map((x) => cord(lens(x), P.gold, 0.85, P.goldL)).join('') +
      cord('M-.9 -1.4Q0 -2.8 .9 -1.4', P.gold, 0.8) +
      hair(-10.2, -1.4, -9, -3.6, -6.4, -3.9, 0.6, '#fff') + hair(2.2, -1.4, 3.4, -3.6, 6, -3.9, 0.6, '#fff') +
      `</g>`
    return (
      field(k) +
      stageO(k, 60, 61, 34) +
      glow(k, 60, 52, 32, 24, 0.75) +
      `<g transform="translate(60 66) scale(.9)">` +
      k.cast([cover], 2.4, 2.4, DX_D) +
      k.draw([{ d: cover, fill: DX, inner: k.sh(cover, 0, 0, 1, 1, 0, 0.9, DX_D, 0.5) + `<path d="M-33 15.4C-21 11.6 -8 12.6 0 18.6C8 12.6 21 11.6 33 15.4" fill="none" stroke="${P.gold}" stroke-width=".5"/>` }], 0.8) +
      // El canto de las hojas (tres hojas de grosor por lado).
      [2.4, 1.2].map((dy) => `<g transform="translate(0 ${dy})">` + k.draw([{ d: L, fill: P.white, line: 0.3 }, { d: R, fill: P.white, line: 0.3 }], 0.3) + `</g>`).join('') +
      k.draw([
        { d: L, fill: P.white, inner: k.sh(L, 1, 0, 0, 0, 0, 0.55, DX_L, 0.4) + k.sh('M-6 -22H0V18H-6Z', 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + textL },
        { d: R, fill: P.white, inner: k.sh(R, 0, 0, 1, 1, 0.1, 0.6, P.blue, 0.4) + textR },
      ], 0.55) +
      `<path id="${t1}" d="${lineAt(0.24)}" fill="none"/><path id="${t2}" d="${lineAt(0.37)}" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-size="4" fill="${P.ink}"><textPath href="#${t1}" startOffset="10">abía una</textPath></text>` +
      `<text ${GEORGIA} font-style="italic" font-size="4" fill="${P.ink}"><textPath href="#${t2}" startOffset="10">vez…</textPath></text>` +
      `<g transform="translate(-30.4 -15.2) rotate(-4)"><rect x="0" y="0" width="5.8" height="6.4" fill="${DX}" stroke="${P.ink}" stroke-width=".4"/><rect x=".7" y=".7" width="4.4" height="5" fill="none" stroke="${P.gold}" stroke-width=".35"/>` +
      `<text x="2.9" y="5.1" ${GEORGIA} font-weight="700" font-size="5.2" fill="${P.goldL}" text-anchor="middle">H</text></g>` +
      `<path d="M0 -14V16" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="${taper(0.6, 15, 3.6, 22, 2.4, 29, 2.6, 2.6)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/><path d="M1.2 28.4L2.4 26.6L3.6 28.8" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
      glasses +
      `</g>` +
      // El "había una vez" se escapa del libro hecho polvo de oro.
      dust + `<path d="${starPath(64.4, 27.6, 2.8, 1.1, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(84, 38, 2.2, '#fff') + sparkle(34, 42, 1.6, '#fff') + sparkle(48, 34, 1.4, '#fff') +
      k.defs()
    )
  },

  // Diez narraciones en el punto justo entre críptico y obvio: el tintero con la boina, la pluma de mosquetero y el pucho.
  'Poeta maldito': (u) => {
    const k = kit(u)
    const body = 'M-14 0C-15.6 0 -16.4 -1 -16.4 -2.6V-12C-16.4 -15.4 -13 -17 -8 -17.4H8C13 -17 16.4 -15.4 16.4 -12V-2.6C16.4 -1 15.6 0 14 0Z'
    const ink = 'M-16.4 -2.6V-9.6C-8 -11 6 -8.6 16.4 -10V-2.6C16.4 -1 15.6 0 14 0H-14C-15.6 0 -16.4 -1 -16.4 -2.6Z'
    const collar = 'M-7.2 -17V-21.2H7.2V-17Z'
    const beret = 'M-17 -1.4C-18.8 -5.6 -12 -10.8 -1 -11.2C10 -11.6 19 -8.2 18.8 -3.6C18.6 -.4 12 1.6 1 1.6C-9 1.6 -15.8 .8 -17 -1.4Z'
    const rim = 'M-15.6 -.4C-8 1.8 10 1.8 17.4 -.8L17 1.2C10 3.4 -8 3.4 -15 1.4Z'
    const cig = 'M0 -1.3H16.4V1.3H0Z'
    const GLASS = '#E2E9F4'
    return (
      dream(k, 0.5, 0.52, 0.46) +
      stars([[31, 40, 0.5], [44, 26, 0.4], [86, 40, 0.45], [92, 58, 0.35], [28, 60, 0.4], [70, 26, 0.35], [90, 74, 0.4], [52, 34, 0.3]]) +
      glow(k, 58, 66, 28, 28, 0.4, DX_L) +
      k.floor(59, 89.4, 22, 3.2, '#12060C') +
      // La pluma, clavada en la boina como en el sombrero de un mosquetero.
      quill(k, 69, 66, 76, 50, 82, 31, 5.8, 3.4) +
      `<g transform="translate(58 89)">` +
      k.draw([
        {
          d: body, fill: GLASS,
          inner:
            `<path d="${ink}" fill="${P.night}"/>` + k.sh(ink, 0, 0, 1, 0, 0, 0.8, '#0A0F26', 0.5) + `<path d="M-16.4 -9.6C-8 -11 6 -8.6 16.4 -10" fill="none" stroke="${DX}" stroke-width=".7"/>` +
            k.sh(body, 0, 0, 1, 0, 0.05, 0.75, P.blue, 0.4) + `<path d="M-8.4 -17V-10.2M8.4 -17V-9.4" stroke="${P.blue}" stroke-width=".55"/><path d="M-8.4 -9.6V0M8.4 -9.4V0" stroke="${P.mid}" stroke-width=".5"/>` +
            hair(-13.6, -14.6, -14.4, -8, -13.4, -2, 1.1, '#fff', 0.95) + hair(-6.4, -15.6, -6.8, -10, -6.2, -4, 0.55, '#fff', 0.6) + hair(13.4, -14, 14, -9, 13.4, -3, 0.5, DX_L, 0.8) +
            `<path d="M-16 -2.4H16" stroke="${P.sky}" stroke-width=".5"/>`,
        },
        { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-7.2 -19.2H7.2" stroke="${P.goldD}" stroke-width=".4"/>` + hair(-5.6, -17.6, -5.8, -19.4, -5.6, -20.8, 0.6, '#fff') },
      ], 0.75) +
      `</g>` +
      // El pucho, apoyado en el hombro del tintero: la brasa al aire y el humo que dibuja un verso.
      `<g transform="translate(35.6 75.8) rotate(-14.6)">` +
      k.draw([{ d: cig, fill: P.white, inner: `<path d="M11.6 -1.4H16.6V1.4H11.6Z" fill="${DX_L}"/><path d="M11.6 -1.4V1.4" stroke="${DX_D}" stroke-width=".35"/>` + [12.6, 13.8, 15].map((x) => `<circle cx="${x}" cy="-.3" r=".28" fill="${DX_D}"/>`).join('') + k.sh(cig, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) }], 0.5) +
      `<path d="M0 -1.3H2V1.3H0Z" fill="#A79BA6"/><path d="M-.4 -1.1C-1 -.5 -1 .5 -.4 1.1H.4V-1.1Z" fill="${P.red}"/><circle cx="-.3" cy="0" r=".6" fill="${P.goldL}"/>` +
      `</g>` +
      `<g transform="translate(58 67.6) rotate(-9)">` +
      k.draw([
        {
          d: beret, fill: SOOT,
          inner:
            k.sh(beret, 0, 0, 1, 1, 0, 0.9, '#000', 0.5) + `<path d="M-18 -12H0V2C-8 1 -14 0 -18 -1Z" fill="${k.lin(SOOT_L, 0, 0, 1, 1, 0.9, 0)}"/>` +
            hair(-12, -4.6, -4, -9.6, 8, -8.4, 0.6, SOOT_L) + hair(-8, -1.6, 2, -5.6, 12, -4, 0.5, SOOT_L, 0.8) + hair(-14, -2, -9, -7.6, -1, -9.6, 0.7, '#7C6C86', 0.8) +
            hair(4, -9.6, 10, -8.6, 15, -5.6, 0.5, DX, 0.6),
        },
        { d: rim, fill: '#120C16', inner: `<path d="M-15 .5C-8 2.6 10 2.6 17 .2" fill="none" stroke="${DX}" stroke-width=".35" stroke-dasharray=".9 .7"/>` },
      ], 0.6) +
      `<path d="${taper(0.6, -11, 1.2, -13.2, 2.8, -14.6, 1.4, 0.9)}" fill="${SOOT}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      hair(34.6, 73.4, 29.6, 66, 34.4, 58.6, 0.9, DX_XL, 0.85) + hair(34.4, 58.6, 39, 51, 33.6, 44, 0.8, DX_XL, 0.7) + hair(33.6, 44, 29, 38, 33.4, 31, 0.65, DX_XL, 0.55) +
      hair(36, 70, 39.6, 64, 37.6, 57, 0.5, DX_XL, 0.55) + hair(33.4, 31, 36, 28, 40, 28, 0.45, DX_XL, 0.4) +
      sparkle(88, 52, 1.8, P.goldL) + sparkle(46, 40, 1.4, '#fff') +
      k.defs()
    )
  },

  // Veinticinco narraciones: tus pistas son un laberinto con salida. El laberinto de oro y el bastón, con el hilo rojo.
  'Borges': (u) => {
    const k = kit(u)
    return (
      dream(k, 0.5, 0.46) +
      k.sun(60, 57, 30, 50, 36, false) +
      glow(k, 60, 57, 40, 40, 0.5) +
      labyrinth(k, 60, 57) +
      `<g transform="translate(77 97) rotate(-24)">` + k.cast([`M-1.5 -66L-1.15 -2.4H1.15L1.5 -66Z`], 1.8, 1.6, '#12060C') + cane(k, 66) + `</g>` +
      sparkle(30, 34, 2.2, P.goldL) + sparkle(90, 80, 1.6, '#fff') + sparkle(88, 30, 1.4, '#fff') +
      k.defs()
    )
  },

  // ── Ilusionista ────────────────────────────────────────────────────

  // Cinco veces votaron tu carta trucha: sacaste el conejo de la galera.
  'Conejo en la galera': (u) => {
    const k = kit(u)
    const body = 'M-15.6 1L-13.4 30C-13.4 32 -7 33.4 0 33.4C7 33.4 13.4 32 13.4 30L15.6 1Z'
    const band = 'M-15.5 1.6L-15.1 7.6C-6 10.4 6 10.4 15.1 7.6L15.5 1.6C6 4.4 -6 4.4 -15.5 1.6Z'
    const back = 'M-21.4 0C-21.4 -3.2 -11.8 -5.6 0 -5.6C11.8 -5.6 21.4 -3.2 21.4 0H15.6C15.6 -2 8.6 -3.6 0 -3.6C-8.6 -3.6 -15.6 -2 -15.6 0Z'
    const front = 'M-21.4 0C-21.4 3.2 -11.8 5.6 0 5.6C11.8 5.6 21.4 3.2 21.4 0H15.6C15.6 2 8.6 3.6 0 3.6C-8.6 3.6 -15.6 2 -15.6 0Z'
    const hole = ellipse(0, 0, 15.6, 3.6)
    const head = 'M-8.6 3.6C-8.8 -1.6 -5 -4.6 0 -4.6C5 -4.6 8.8 -1.6 8.6 3.6Z'
    const earL = 'M-5.4 -2C-8.6 -9 -10.4 -21 -8 -28C-6.6 -32 -3.2 -31 -2.6 -26.4C-2 -20 -1.6 -10 -1.4 -2.4Z'
    const earLi = 'M-5 -4C-7.2 -10 -8.4 -19 -6.8 -25.4C-6 -28 -4.2 -27.4 -3.8 -24.6C-3.4 -19 -3 -11 -2.8 -4Z'
    const earR = 'M1.4 -2.4C1.8 -9 2.4 -15 4.4 -18.6C6 -21.4 9.6 -22.4 13.6 -20.8C16.6 -19.6 17.4 -17 15.6 -16.2C12.6 -15 9.4 -16.4 7.4 -14.6C6 -11.6 5.6 -6 5.4 -2Z'
    const earRi = 'M2.8 -4C3.2 -10 3.8 -14.6 5.6 -17.4C7 -19.4 9.8 -20 12.6 -19C14 -18.4 13.8 -17.4 12.6 -17.4C10 -17.4 7.6 -16.6 6.2 -14.6C5 -11.6 4.4 -7.6 4.2 -4Z'
    const wand = 'M-1 -15H1V15H-1Z'
    const fur = '#FFFDF8'
    return (
      field(k) +
      stageO(k, 60, 62, 34) +
      glow(k, 60, 48, 30, 22, 0.8) +
      k.floor(59, 94, 22, 3.6, DX_D) +
      `<g transform="translate(58 61)">` +
      k.draw([
        {
          d: body, fill: SOOT,
          inner:
            k.sh(body, 0, 0, 1, 0, 0, 0.9, '#000', 0.5) + `<path d="M-16 0H-8V34H-16Z" fill="${k.lin(SOOT_L, 0, 0, 1, 0, 0.95, 0)}"/>` +
            hair(-10.6, 10, -10.2, 20, -9.6, 30, 0.8, '#8A7B94', 0.8) + hair(8, 11, 8.6, 21, 8.8, 30.6, 0.5, DX, 0.5) +
            k.sh('M-16 26H16V34H-16Z', 0, 0, 0, 1, 0, 0.8, '#000', 0.4),
        },
        { d: band, fill: DX, inner: k.sh(band, 0, 0, 1, 0, 0, 0.85, DX_D, 0.5) + `<path d="M-15.3 4.4C-6 7.2 6 7.2 15.3 4.4" fill="none" stroke="${DX_D}" stroke-width=".4"/>` },
        { d: back, fill: SOOT, inner: k.sh(back, 0, 0, 0, 1, 0, 0.7, '#000', 0.4) },
      ], 0.7) +
      `<path d="${hole}" fill="${P.wine}"/>` + k.shade(hole, k.lin('#000', 0, 0, 0, 1, 0.9, 0.2), '#000', 0.5) +
      // El conejo: las orejas y la coronilla, nada de cara.
      k.draw([
        { d: earL, fill: fur, inner: `<path d="${earLi}" fill="${PINK}"/>` + k.sh(earL, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) + hair(-6.6, -8, -7.8, -16, -6.6, -24, 0.4, '#C98478') },
        { d: earR, fill: fur, inner: `<path d="${earRi}" fill="${PINK}"/>` + k.sh(earR, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.45) + hair(4.6, -6, 5.4, -12, 7.6, -15.4, 0.4, '#C98478') },
        { d: head, fill: fur, inner: k.sh(head, 0, 0, 1, 1, 0, 0.75, P.sky2, 0.45) + hair(-5, -1.6, -2, -3.6, 1.6, -3.4, 0.45, P.blue, 0.7) + hair(-2, 0, 1, -2, 4.6, -1.6, 0.4, P.blue, 0.6) },
      ], 0.6) +
      k.draw([{ d: front, fill: SOOT, inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, '#000', 0.45) + hair(-19, 1.6, -12, 4.2, -3, 4.6, 0.55, '#8A7B94', 0.8) }], 0.7) +
      `</g>` +
      // La varita, cruzada adelante, y el destello.
      `<g transform="translate(78 80) rotate(52)">` +
      k.draw([{ d: wand, fill: SOOT, inner: `<path d="M-1.2 -15H1.2V-11H-1.2ZM-1.2 11H1.2V15H-1.2Z" fill="${P.white}"/>` + hair(-0.4, -10, -0.4, 0, -0.4, 10, 0.35, '#8A7B94') }], 0.55) +
      `</g>` +
      sparkle(88, 66, 3, '#fff') + sparkle(80, 34, 2.2, P.goldD) + sparkle(36, 40, 1.8, P.goldD) + sparkle(88, 50, 1.4, P.gold) +
      hair(84, 62, 82, 56, 84, 50, 0.4, P.goldD, 0.8) +
      k.defs()
    )
  },

  // Quince engaños: tu carta parecía más del narrador que la del narrador. El pincel acaba de pintar el bigote en el aire.
  'Pintor surrealista': (u) => {
    const k = kit(u)
    const HZ = 80
    const sand = `M0 ${HZ}H120V130H0Z`
    const lobe = (s: number) => {
      const m = (x: number) => f(60 + (x - 60) * s)
      return taper(m(61), 58.2, m(51), 67, m(42), 62.4, 8.4, 3.8) + taper(m(42.6), 62.6, m(34.6), 59.8, m(35.6), 47.4, 3.8, 0.5)
    }
    const stache = lobe(1) + lobe(-1)
    const handle = 'M-1.8 -9L-2.8 25C-2.8 27.6 2.8 27.6 2.8 25L1.8 -9Z'
    const ferrule = 'M-2.4 -18.4H2.4L1.9 -9H-1.9Z'
    const bristles = 'M-2.4 -18.4C-2.8 -21.6 -2.4 -24.6 -.6 -28.6C-.2 -29.4 .4 -29.4 .6 -28.6C2.4 -24.6 2.8 -21.6 2.4 -18.4Z'
    return (
      `<rect width="120" height="130" fill="${DX_XL}"/>` +
      k.shade(`M0 0H120V${HZ}H0Z`, k.lin(DX, 0, 0, 0, 1, 0, 0.75), DX, 0.4) +
      // El sol que se hunde en el horizonte, con la gloria naranja.
      k.clip(`M0 0H120V${HZ}H0Z`, k.sun(60, HZ, 22, 52, 28, false) + `<circle cx="60" cy="${HZ}" r="20" fill="${P.gold}"/>` + k.shade(ellipse(60, HZ, 20, 20), k.rad(DX, 0.5, 0.5, 0.5, 0.2, 0.9), DX, 0.4)) +
      `<path d="${sand}" fill="#F1D7AE"/>` + k.shade(sand, k.lin(DX_D, 0, 0, 0, 1, 0, 0.55), DX_D, 0.3) +
      `<path d="M0 ${HZ}H120" stroke="${P.ink}" stroke-width=".7"/>` +
      // Las líneas del piso fugan al horizonte, como en los cuadros.
      [-60, -30, -12, 12, 30, 60].map((x) => `<path d="M60 ${HZ}L${60 + x * 2.6} 130" stroke="${DX_D}" stroke-width=".35" opacity=".5"/>`).join('') +
      hair(26, 86, 36, 85, 46, 86, 0.5, DX_D, 0.6) + hair(76, 92, 86, 91, 96, 92, 0.5, DX_D, 0.6) +
      // Las sombras en la arena de lo que flota.
      k.floor(60, 89.6, 22, 2.4, DX_D) + k.shade('M44 93.4L80 87.4L81 88.8L45.6 95Z', k.lin(DX_D, 0, 0, 1, 0, 0.7, 0.1), DX_D, 0.35) +
      // El pincel, cruzado detrás del bigote, con la punta cargada de negro.
      `<g transform="translate(60 62) rotate(40)">` +
      k.cast([handle, ferrule, bristles], 1.8, 1.8, DX_D) +
      k.draw([
        { d: handle, fill: P.red, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.95, P.wine, 0.5) + hair(-1.4, -6, -2, 8, -1.9, 24, 0.7, '#fff', 0.7) + `<path d="M-3 18H3V20H-3Z" fill="${P.gold}"/><path d="M-3 18H3M-3 20H3" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: ferrule, fill: P.sky1, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + `<path d="M-2.4 -15.6H2.4M-2.1 -11.6H2.1" stroke="${P.blue}" stroke-width=".45"/>` + hair(-1.4, -17.6, -1.5, -14, -1.3, -9.6, 0.55, '#fff') },
        { d: bristles, fill: P.brown, inner: `<path d="M-3 -30H3V-22.4C1 -23.4 -1 -23.4 -3 -22.4Z" fill="${SOOT}"/>` + k.sh(bristles, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) + hair(-0.8, -19, -1, -23, -0.4, -27, 0.4, P.brownD) + hair(1, -19, 1.2, -22, 0.6, -25, 0.35, P.brownD) },
      ], 0.6) +
      `</g>` +
      k.cast([stache], 2, 2.4, DX_D) +
      k.draw([{
        d: stache, fill: SOOT,
        inner:
          k.sh(stache, 0, 0, 0, 1, 0, 0.8, '#000', 0.45) +
          hair(58, 59.4, 51, 62.4, 43, 60.8, 0.7, '#8A7B94', 0.9) + hair(62, 59.4, 69, 62.4, 77, 60.8, 0.7, '#8A7B94', 0.9) +
          hair(56, 63, 50, 65.4, 44, 63.4, 0.45, SOOT_L) + hair(64, 63, 70, 65.4, 76, 63.4, 0.45, SOOT_L) +
          hair(41.4, 60, 36.6, 56.6, 36.4, 49, 0.45, '#8A7B94', 0.8) + hair(78.6, 60, 83.4, 56.6, 83.6, 49, 0.45, '#8A7B94', 0.8),
      }], 0.65) +
      `<path d="M58.6 58.4L60 61L61.4 58.4" fill="none" stroke="${SOOT_L}" stroke-width=".5" stroke-linecap="round"/>` +
      // Pinceladas secas en las puntas: está recién pintado. Y una gota que cae del pincel.
      `<path d="M78.8 44.6C79.6 46.6 79.4 48.2 78.6 48.8C77.8 48.2 77.6 46.6 78.8 44.6Z" fill="${SOOT}" stroke="${P.ink}" stroke-width=".2"/>` +
      sparkle(32, 70, 1.6, '#fff') + sparkle(92, 66, 1.4, '#fff') + sparkle(46, 36, 1.8, '#fff') +
      k.defs()
    )
  },

  // Cuarenta engaños: mirá el péndulo… votá la mía… El reloj de bolsillo de oro, con la tapa abierta, frente a la espiral.
  'Gran Hipnotizador': (u) => {
    const k = kit(u)
    const cx = 60, cy = 63
    // Espiral de dos brazos: la banda naranja entre r = bθ y r = b(θ + π).
    const b = 2.7, TH = Math.PI * 5.6, N = 160
    const A = Array.from({ length: N + 1 }, (_, i) => { const t = (i / N) * TH; return `${f(cx + Math.cos(t) * b * t)} ${f(cy + Math.sin(t) * b * t)}` })
    const Bp = Array.from({ length: N + 1 }, (_, i) => { const t = TH - (i / N) * TH; return `${f(cx + Math.cos(t) * b * (t + Math.PI))} ${f(cy + Math.sin(t) * b * (t + Math.PI))}` })
    const spiral = `M${A.join('L')}L${Bp.join('L')}Z`
    const R = 17.4
    const caseD = ellipse(0, 0, R, R), dial = ellipse(0, 0, 13, 13)
    const stem = 'M-2.1 -17H2.1V-20.4H-2.1Z', crownD = 'M-3.6 -20.4H3.6V-24.8H-3.6Z', bow = `${ellipse(0, -28.8, 4.6, 4.6)} ${ellipse(0, -28.8, 2.7, 2.7)}`
    const lid = ellipse(26.4, 0, 8.6, 16.8), lidIn = ellipse(26.4, 0, 6.6, 14)
    const ticks = Array.from({ length: 60 }, (_, i) => {
      const a = (i / 60) * Math.PI * 2, r0 = i % 5 ? 11.8 : 10.6
      return `M${f(Math.cos(a) * r0)} ${f(Math.sin(a) * r0)}L${f(Math.cos(a) * 12.6)} ${f(Math.sin(a) * 12.6)}`
    }).join('')
    const guil = Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return `M${f(Math.cos(a) * 14.2)} ${f(Math.sin(a) * 14.2)}L${f(Math.cos(a) * 16.8)} ${f(Math.sin(a) * 16.8)}` }).join('')
    const rosette = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `M26.4 0L${f(26.4 + Math.cos(a) * 5.6)} ${f(Math.sin(a) * 12)}` }).join('')
    const num = (n: string, a: number) => `<text x="${f(Math.cos(a) * 8.4)}" y="${f(Math.sin(a) * 8.4 + 1.1)}" ${GEORGIA} font-size="3.1" fill="${P.ink}" text-anchor="middle">${n}</text>`
    const links = Array.from({ length: 12 }, (_, i) => {
      const y = 14 + i * 2.5
      return i % 2
        ? `<rect x="-.7" y="${f(y - 1.5)}" width="1.4" height="3" rx=".6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
        : `<ellipse cx="0" cy="${f(y)}" rx="1.4" ry="1.9" fill="none" stroke="${P.ink}" stroke-width="1.4"/><ellipse cx="0" cy="${f(y)}" rx="1.4" ry="1.9" fill="none" stroke="${P.gold}" stroke-width=".7"/>`
    }).join('')
    const rid = k.id('hip')
    return (
      dream(k, 0.5, 0.5, 0.6) +
      `<path d="${spiral}" fill="${DX}"/>` + k.shade(spiral, k.rad(P.gold, 0.5, 0.5, 0.5, 0.7, 0), P.gold, 0.35) +
      `<path d="${spiral}" fill="none" stroke="${DX_L}" stroke-width=".5" opacity=".8"/>` +
      k.shade(FULL, k.rad(DX_N, 0.5, 0.48, 0.7, 0, 0.7), DX_N, 0.35) +
      glow(k, 56, 62, 24, 24, 0.7) +
      // El vaivén: arcos de movimiento.
      `<path d="M30 86Q56 100 84 84" fill="none" stroke="${DX_L}" stroke-width=".8" stroke-dasharray="1.6 1.4" stroke-linecap="round"/>` +
      hair(76, 54, 80, 64, 78, 76, 0.8, DX_L, 0.9) + hair(81, 52, 85.6, 64, 83, 78, 0.6, DX_L, 0.7) +
      `<g transform="rotate(8 60 11)"><g transform="translate(60 11)">${links}</g>` +
      `<g transform="translate(60 ${11 + 52})">` +
      k.cast([caseD, lid], 2.4, 2.4, '#12060C') +
      // La tapa abierta, con el rosetón grabado por dentro.
      k.draw([{
        d: lid, fill: P.gold,
        inner: k.sh(lid, 1, 0, 0, 0, 0, 0.9, P.goldD, 0.5) + `<path d="${lidIn}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".5"/>` +
          k.clip(lidIn, `<path d="${rosette}" stroke="${P.goldD}" stroke-width=".35"/>` + k.sh(lidIn, 1, 0, 0, 0, 0, 0.6, P.goldD, 0.4)) +
          `<path d="${ellipse(26.4, 0, 3.2, 7)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".45"/><path d="${starPath(26.4, 0, 2, 0.8, 8)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
          hair(31.6, -10, 33, 0, 31.4, 10, 0.6, '#fff', 0.8),
      }], 0.65) +
      `<path d="M16.6 -3.4H19.4V3.4H16.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M16.6 -1.1H19.4M16.6 1.1H19.4" stroke="${P.goldD}" stroke-width=".35"/>` +
      k.draw([
        { d: bow, fill: P.gold, inner: k.sh(ellipse(0, -28.8, 4.6, 4.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
        { d: crownD, fill: P.gold, inner: k.sh(crownD, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-2.6 -20.4V-24.8M-.9 -20.4V-24.8M.9 -20.4V-24.8M2.6 -20.4V-24.8" stroke="${P.goldD}" stroke-width=".45"/>` },
        { d: stem, fill: P.goldL, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) },
        {
          d: caseD, fill: P.gold,
          inner: k.sh(caseD, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-19 -19H-4V-4C-10 -4 -15 -8 -19 -8Z" fill="${k.lin(P.goldL, 0, 0, 1, 1, 0.9, 0)}"/>` +
            `<path d="${guil}" stroke="${P.goldD}" stroke-width=".35"/>`,
        },
      ], 0.8) +
      `<circle cx="0" cy="0" r="13.9" fill="none" stroke="${P.goldD}" stroke-width=".8"/><circle cx="0" cy="0" r="13.9" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-dasharray=".01 1.5" stroke-linecap="round"/>` +
      k.draw([{ d: dial, fill: P.white, inner: k.sh(dial, 0, 0, 1, 1, 0, 0.6, DX_L, 0.4) + `<circle cx="0" cy="0" r="6.4" fill="none" stroke="${DX_L}" stroke-width=".4"/>` + `<path d="${ticks}" stroke="${P.ink}" stroke-width=".3"/>` }], 0.4) +
      num('XII', -Math.PI / 2) + num('III', 0) + num('VI', Math.PI / 2) + num('IX', Math.PI) +
      `<path d="M0 0L-4.8 -4.4" stroke="${P.ink}" stroke-width=".95" stroke-linecap="round"/><circle cx="-3.3" cy="-3" r=".95" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M0 0L6 -6.8" stroke="${P.ink}" stroke-width=".65" stroke-linecap="round"/><circle cx="4.1" cy="-4.7" r=".75" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M0 0L-1 4.8" stroke="${P.red}" stroke-width=".4"/>` +
      `<circle cx="0" cy="0" r="1.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-.4" cy="-.4" r=".38" fill="#fff"/>` +
      hair(-11, -5.4, -9.8, -10, -5.2, -11.6, 0.85, '#fff', 0.85) +
      `</g></g>` +
      `<path id="${rid}" d="M40 91.4Q60 99.6 80 91.4" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-size="3.6" fill="${DX_XL}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">votá la mía…</textPath></text>` +
      sparkle(86, 30, 2.4, '#fff') + sparkle(32, 40, 1.8, P.goldL) + sparkle(28, 70, 1.4, '#fff') +
      k.defs()
    )
  },

  // ── Soñador ────────────────────────────────────────────────────────

  // Primera victoria atrapada con la red: la mariposa, adentro del cazamariposas.
  'Cazamariposas': (u) => {
    const k = kit(u)
    const wingF = 'M0 0C-3 -6 -10 -11 -15 -9.6C-18 -8.6 -17 -3.6 -13 -1.4C-9 .6 -4 .8 0 0Z'
    const wingB = 'M0 .6C-4 1.4 -10 3.6 -10.6 7.6C-11 10.4 -7 10.6 -4.4 8C-2 5.6 -.6 3 0 .6Z'
    const wing = (sx: number) =>
      `<g transform="scale(${sx} 1)">` + k.draw([
        { d: wingB, fill: DX, inner: k.sh(wingB, 0, 0, 1, 1, 0, 0.8, DX_D, 0.4) + `<path d="M-1 1.4L-8 6.4M-2 2.6L-5 8.6" stroke="${SOOT}" stroke-width=".55"/>` + `<path d="${wingB}" fill="none" stroke="${SOOT}" stroke-width="1.6"/>` + [[-9.4, 7.6], [-7, 9.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".45" fill="#fff"/>`).join('') },
        { d: wingF, fill: DX, inner: `<path d="M-12 -9.6C-14 -7 -14.6 -3.6 -13 -1.4L-20 0V-12Z" fill="${SOOT}"/>` + k.sh(wingF, 0, 0, 1, 1, 0, 0.7, DX_D, 0.4) + `<path d="M-1 -.6L-12 -7.4M-1.6 -.2L-12.6 -3M-5 -3L-8 -8.6" stroke="${SOOT}" stroke-width=".55"/>` + `<path d="${wingF}" fill="none" stroke="${SOOT}" stroke-width="1.6"/>` + [[-15.4, -8.2], [-16.2, -5.6], [-15.2, -3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".5" fill="#fff"/>`).join('') + `<path d="M-6 -4.6C-4 -6 -2 -5.6 -1 -3.6" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".8"/>` },
      ], 0.45) + `</g>`
    const butterfly =
      wing(1) + wing(-1) +
      `<ellipse cx="0" cy="1.6" rx="1.1" ry="5" fill="${SOOT}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M-.4 -3C-1.4 -6 -3 -7.6 -4.4 -8M.4 -3C1.4 -6 3 -7.6 4.4 -8" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linecap="round"/><circle cx="-4.4" cy="-8" r=".5" fill="${P.ink}"/><circle cx="4.4" cy="-8" r=".5" fill="${P.ink}"/>`
    const handle = 'M-1.7 0H1.7L1.3 37H-1.3Z'
    // El aro, visto de costado: centro (42,44), radios 15 y 5.5, inclinado 28°. La bolsa cuelga y el mango sigue el eje.
    const L0 = '28.8 37', R0 = '55.2 51'
    const bagD = `M${L0}C26.6 52 31 68 40 77C46.6 73 52.6 62 ${R0}A15 5.5 28 0 1 ${L0}Z`
    const meshD = Array.from({ length: 16 }, (_, i) => `M${12 + i * 3.6} 30L${30 + i * 3.6} 82M${12 + i * 3.6} 82L${30 + i * 3.6} 30`).join('')
    return (
      field(k) +
      stageO(k, 60, 60, 34) +
      glow(k, 50, 52, 30, 26, 0.6) +
      // El mango, desde el aro hacia abajo a la derecha.
      `<g transform="translate(5 3)">` +
      `<g transform="translate(55.2 51) rotate(-62)">` + k.cast([handle], 1.6, 2, DX_D) + k.draw([{ d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + hair(-0.7, 4, -0.9, 20, -0.7, 35, 0.5, P.goldL, 0.8) + `<path d="M-1.9 26H1.9V31H-1.9Z" fill="${P.red}"/><path d="M-1.9 27.6H1.9M-1.9 29.3H1.9" stroke="${P.wine}" stroke-width=".35"/>` }], 0.6) + `</g>` +
      // Aro de atrás, bolsa de red con la mariposa adentro y aro de adelante.
      cord(`M${L0}A15 5.5 28 0 1 ${R0}`, P.sky1, 1.3) +
      k.clip(bagD, `<path d="${bagD}" fill="${P.white}" opacity=".4"/>` + `<g transform="translate(40.6 59) rotate(-12) scale(.7)">${butterfly}</g>`) +
      `<path d="${bagD}" fill="none" stroke="${P.ink}" stroke-width="1.1" stroke-linejoin="round"/>` +
      k.clip(bagD, `<path d="${meshD}" stroke="${P.mid}" stroke-width=".32" opacity=".8"/>` + k.sh(bagD, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3)) +
      hair(30, 44, 30, 56, 35, 68, 0.6, '#fff', 0.85) +
      cord(`M${R0}A15 5.5 28 0 1 ${L0}`, P.sky1, 1.3) + `<circle cx="55.4" cy="51.2" r="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `</g>` +
      // Otra que se escapa.
      `<g transform="translate(80 34) rotate(18) scale(.46)">${butterfly}</g>` +
      `<path d="M76 40C70 42 68 46 72 48.6C76 51 72 55 64 54.6" fill="none" stroke="${DX_D}" stroke-width=".5" stroke-dasharray="1.2 1.2" stroke-linecap="round"/>` +
      sparkle(70, 84, 1.8, '#fff') + sparkle(30, 72, 1.4, P.goldD) + sparkle(88, 56, 1.4, '#fff') +
      k.defs()
    )
  },

  // Cinco victorias: volás por encima de la mesa. El globo de gajos naranjas, con guirnaldas, sobre las nubes del atardecer.
  'Globo aerostático': (u) => {
    const k = kit(u)
    const cx = 60, top = 22, H = 46
    const w = (t: number) => (t < 0.45 ? 24 * Math.pow(Math.sin(((t / 0.45) * Math.PI) / 2), 0.7) : 24 * (Math.cos((((t - 0.45) / 0.55) * Math.PI) / 2) * 0.72 + 0.28))
    const N = 30
    const ts = Array.from({ length: N + 1 }, (_, i) => i / N)
    const env = `M${ts.map((t) => `${f(cx - w(t))} ${f(top + H * t)}`).join('L')}L${ts.slice().reverse().map((t) => `${f(cx + w(t))} ${f(top + H * t)}`).join('L')}Z`
    const G = 8
    const mer = (j: number) => ts.map((t) => [cx + w(t) * Math.sin(-Math.PI / 2 + (j / G) * Math.PI), top + H * t])
    const gores = Array.from({ length: G }, (_, j) => {
      const a = mer(j), b = mer(j + 1).reverse()
      return `<path d="M${[...a, ...b].map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z" fill="${j % 2 ? DX_XL : DX}"/>`
    }).join('')
    const seams = Array.from({ length: G - 1 }, (_, j) => `<path d="M${mer(j + 1).map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}" fill="none" stroke="${DX_D}" stroke-width=".35"/>`).join('')
    const bandT0 = 0.56, bandT1 = 0.62
    const bandD = `M${f(cx - w(bandT0))} ${f(top + H * bandT0)}Q${cx} ${f(top + H * bandT0 + 3)} ${f(cx + w(bandT0))} ${f(top + H * bandT0)}L${f(cx + w(bandT1))} ${f(top + H * bandT1)}Q${cx} ${f(top + H * bandT1 + 3)} ${f(cx - w(bandT1))} ${f(top + H * bandT1)}Z`
    const swags = Array.from({ length: 6 }, (_, i) => {
      const x0 = cx - 18 + i * 6, y0 = top + H * bandT1 + 1.4 + (1 - Math.pow((x0 + 3 - cx) / 20, 2)) * 1.4
      return `<path d="M${f(x0)} ${f(y0)}Q${f(x0 + 3)} ${f(y0 + 3.4)} ${f(x0 + 6)} ${f(y0)}" fill="none" stroke="${P.gold}" stroke-width=".8"/><circle cx="${f(x0 + 6)}" cy="${f(y0)}" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`
    }).join('')
    const skirt = 'M53.4 68H66.6L65 73.4H55Z'
    const basket = 'M52.6 80.6H67.4L66 90.4C66 91.4 54 91.4 54 90.4Z'
    const weave = Array.from({ length: 4 }, (_, i) => `<path d="M52 ${f(82.6 + i * 2)}H68" stroke="${P.brownD}" stroke-width=".4"/>`).join('') + [55.6, 58.6, 61.6, 64.6].map((x) => `<path d="M${x} 80.6V91" stroke="${P.brownD}" stroke-width=".35"/>`).join('')
    const cloud = (x: number, y: number, s: number, flip = 1) => {
      const d = 'M-16 4C-19 4 -20 0 -16.6 -1.4C-17.4 -6 -12 -8.4 -8.6 -5.6C-7.4 -11 1 -12 3 -6.4C5.6 -9 10.6 -7.6 10.4 -3.6C14 -4 16.4 0 14 3.4C13 4.6 11 4.6 10 4.4Z'
      return `<g transform="translate(${x} ${y}) scale(${f(s * flip)} ${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0.2, 0.9, DX_L, 0.5) + hair(-14, -2, -10, -6.6, -6, -6, 0.6 / s, '#fff') + hair(-4, 2.4, 2, 1, 8, 2.6, 0.5 / s, DX, 0.5) }], 0.55 / s) + `</g>`
    }
    return (
      `<rect width="120" height="130" fill="${DX_XL}"/>` + k.shade(FULL, k.lin(DX, 0, 0, 0, 1, 0, 0.7), DX, 0.4) +
      k.sun(60, 96, 20, 70, 36, false) +
      glow(k, 60, 44, 34, 30, 0.55, '#fff') +
      `<circle cx="34" cy="40" r=".6" fill="#fff"/><circle cx="88" cy="34" r=".5" fill="#fff"/>` +
      cloud(26, 82, 1.1) + cloud(96, 88, 1.2, -1) +
      // Las sogas, el quemador con su llama y la barquilla.
      `<path d="M55 73.4L53.4 80.6M65 73.4L66.6 80.6M57.4 73.4L57.6 80.6M62.6 73.4L62.4 80.6" stroke="${P.ink}" stroke-width=".6"/>` +
      k.draw([{ d: basket, fill: P.brown, inner: k.sh(basket, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + weave + `<path d="M52 80.6H68V82.4H52Z" fill="${P.brownD}"/>` }], 0.6) +
      `<path d="M52 81H68" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M52 81H68" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M52.6 84C51 85 50.6 87 51.4 88.6C52.4 89 53.4 88 53.4 86.6Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><path d="M67.4 84C69 85 69.4 87 68.6 88.6C67.6 89 66.6 88 66.6 86.6Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.cast([env], 2.2, 2.2, DX_D) +
      k.draw([
        { d: skirt, fill: P.red, inner: k.sh(skirt, 0, 0, 1, 0, 0, 0.9, P.wine, 0.5) + `<path d="M56 70V73M58 70V73.4M60 70V73.4M62 70V73.4M64 70V73" stroke="${P.wine}" stroke-width=".35"/>` },
        {
          d: env, fill: DX,
          inner:
            gores + seams +
            k.sh(env, 0, 0, 1, 0, 0, 0.7, DX_D, 0.35) + k.sh(env, 0, 0, 0, 1, 0, 0.55, DX_D, 0.3) +
            `<path d="M30 18H52V70H30Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.4, 0)}"/>` +
            `<path d="${bandD}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` + k.sh(bandD, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) +
            `<path d="M${f(cx - 22)} ${f(top + H * 0.59 + 0.9)}Q${cx} ${f(top + H * 0.59 + 3.8)} ${f(cx + 22)} ${f(top + H * 0.59 + 0.9)}" fill="none" stroke="${P.red}" stroke-width=".5" stroke-dasharray="1.2 1.2"/>` +
            swags +
            hair(42, 32, 38, 42, 40, 54, 1.2, '#fff', 0.85) + hair(46, 26, 44, 30, 43, 34, 0.7, '#fff', 0.7),
        },
      ], 0.75) +
      // La llama del quemador, en la boca del globo.
      `<path d="M60 79.4C57.6 77.8 57.6 75 59.4 72.6C59.6 74.4 60.6 74.6 61 73.4C62.8 75.6 62.4 78 60 79.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M60 78.6C59 77.6 59 76.2 60 75C61 76.2 61 77.6 60 78.6Z" fill="${P.goldL}"/>` +
      `<path d="${ellipse(60, 23.6, 4.6, 1.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M60 22V19.4" stroke="${P.ink}" stroke-width=".6"/><path d="M60 19.6L64 20.6L60 21.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      sparkle(86, 58, 2, '#fff') + sparkle(32, 54, 1.6, '#fff') +
      k.defs()
    )
  },

  // Doce victorias: te sentás en la medialuna a mirar cómo juegan. El almohadón de terciopelo en la luna y la escalera de soga.
  'Dueño de la luna': (u) => {
    const k = kit(u)
    const moon = crescent(57, 57, 28, 69, 47, 25)
    const craters = [[40, 70, 2.6], [36.4, 56, 1.8], [48, 79.6, 2], [41, 44, 1.3], [57.6, 81.6, 1.1], [33.6, 64, 1], [46, 34.6, 1.1]]
      .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.8)}" fill="${P.goldD}" opacity=".3"/><path d="M${f(x - r)} ${y}A${r} ${f(r * 0.8)} 0 0 1 ${f(x + r)} ${y}" fill="none" stroke="${P.goldD}" stroke-width=".45"/><path d="M${f(x - r * 0.7)} ${f(y + r * 0.5)}A${r} ${f(r * 0.8)} 0 0 0 ${f(x + r * 0.7)} ${f(y + r * 0.5)}" fill="none" stroke="#fff" stroke-width=".35" opacity=".8"/>`).join('')
    const hatch = Array.from({ length: 20 }, (_, i) => {
      const a = (60 + i * 8.4) * (Math.PI / 180)
      const x0 = 69 + Math.cos(a) * 25.4, y0 = 47 + Math.sin(a) * 25.4, l = 3.6 + (i % 3) * 1.2
      return hair(x0, y0, x0 - Math.cos(a) * l * 0.5 + 0.6, y0 - Math.sin(a) * l * 0.5, x0 - Math.cos(a) * l, y0 - Math.sin(a) * l, 0.45, P.goldD, 0.7)
    }).join('')
    const rays = (() => {
      let d = ''
      for (let i = 0; i < 44; i++) {
        const a = (i / 44) * Math.PI * 2, r0 = 31, r1 = i % 2 ? 42 : 50, w = i % 2 ? 0.5 : 0.9
        const ux = Math.cos(a), uy = Math.sin(a)
        d += `M${f(57 + ux * r0 - uy * w)} ${f(57 + uy * r0 + ux * w)}L${f(57 + ux * r1)} ${f(57 + uy * r1)}L${f(57 + ux * r0 + uy * w)} ${f(57 + uy * r0 - ux * w)}Z`
      }
      return `<path d="${d}" fill="${k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0.15)}"/>` + k.shade(d, k.rad(P.gold, 0.5, 0.5, 0.5, 0.95, 0.2), P.gold, 0.5)
    })()
    const cushion = 'M-11.4 1.4C-12.4 -2.6 -8 -6.4 0 -6.4C8 -6.4 12.4 -2.6 11.4 1.4C8 4.6 -8 4.6 -11.4 1.4Z'
    const tassel = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r})"><circle cx="0" cy="0" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M-1.1 1L-1.6 5.2H1.6L1.1 1Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M-.6 1.8V4.8M.6 1.8V4.8" stroke="${P.goldD}" stroke-width=".25"/></g>`
    // Escalera de soga que cuelga del cuerno de abajo y se pierde hacia la mesa.
    const ropeL = 'M77.6 71.6Q77 86 72.4 104', ropeR = 'M83.4 69.4Q83.6 85 79.6 104'
    const rungs = [76, 82, 88, 94, 100].map((y) => { const t = (y - 70) / 34; return `M${f(77.4 - t * t * 5)} ${y}L${f(83.4 - t * t * 3.8 - 0.4)} ${f(y - 0.6)}` }).join('')
    return (
      dream(k, 0.46, 0.46, 0.44) +
      stars([[30, 36, 0.6], [40, 24, 0.45], [88, 32, 0.55], [94, 50, 0.4], [92, 76, 0.5], [28, 82, 0.4], [70, 22, 0.35], [24, 56, 0.35], [64, 96, 0.35]]) +
      rays +
      glow(k, 54, 57, 36, 36, 0.6) +
      k.cast([moon], 2.4, 2.6, '#12060C') +
      k.draw([{
        d: moon, fill: P.gold,
        inner:
          `<path d="${moon}" fill="${k.rad(P.goldL, 0.3, 0.45, 0.6, 1, 0)}"/>` + k.sh(moon, 0, 0, 1, 1, 0.1, 0.9, P.goldD, 0.45) +
          k.shade(ellipse(44, 62, 7, 10), k.rad(P.goldD, 0.5, 0.5, 0.5, 0.5, 0), P.goldD, 0.25) + k.shade(ellipse(53, 76, 6, 4), k.rad(P.goldD, 0.5, 0.5, 0.5, 0.45, 0), P.goldD, 0.25) +
          craters + hatch +
          hair(33, 46, 30, 60, 35, 74, 1.1, '#fff', 0.85) + hair(37.6, 39, 35.6, 43, 34.6, 47, 0.7, '#fff', 0.7),
      }], 0.8) +
      // El almohadón, en el fondo del hueco.
      `<g transform="translate(68.8 68)">` +
      k.draw([{ d: cushion, fill: P.red, inner: k.sh(cushion, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + hair(-8, -2.6, -3, -5.2, 3, -4.8, 0.7, '#fff', 0.55) + `<path d="M-7 -.6C-3 1 3 1 7 -.6" fill="none" stroke="${P.wine}" stroke-width=".45"/><path d="M-11 1.4C-8 4 8 4 11 1.4" fill="none" stroke="${P.gold}" stroke-width=".6"/>` + `<circle cx="0" cy="-1.4" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` }], 0.6) +
      tassel(-11.8, 1, 24) + tassel(11.8, 1, -24) +
      `</g>` +
      cord(rungs, P.brown, 1.6, P.goldL) + cord(ropeL, P.goldL, 1) + cord(ropeR, P.goldL, 1) +
      `<path d="M76.4 70.4C77.6 68.6 80.6 67.6 84.6 68.4" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M76.4 70.4C77.6 68.6 80.6 67.6 84.6 68.4" fill="none" stroke="${P.goldL}" stroke-width=".9"/>` +
      `<path d="${starPath(86, 40, 3.4, 1.2, 4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(36, 30, 2.4, '#fff') + sparkle(26, 70, 1.4, P.goldL) + sparkle(78, 26, 1.6, '#fff') +
      k.defs()
    )
  },
}
