// Medallas de la generala, redibujadas (ver el kit en ../kit.ts).
import { f } from '../helpers'
import { along, die, ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** El fondo de la boca del cubilete. */
const HOLLOW = '#3B2416'

/** Varilla entintada (manija, cordón, palito): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.6) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** La boca del cubilete vista desde arriba: lo que se dibuje recortado acá asoma por encima del borde de adelante. */
const MOUTH = 'M-8.6 -28.4A8.6 2.2 0 0 0 8.6 -28.4V-46H-8.6Z'

/** Cubilete de cuero parado, con la base en (0,0) y la boca (de radio 10.6) en y=-28.6: costuras, guarda repujada y el borde enrollado. */
function cubilete(k: Kit, w = 0.7) {
  const body = 'M-9.6 -28.6L-8.8 -2C-8.8 1 8.8 1 8.8 -2L9.6 -28.6Z'
  const base = 'M-9 -6.8L-8.8 -2C-8.8 1 8.8 1 8.8 -2L9 -6.8C9 -4 -9 -4 -9 -6.8Z'
  const lip = 'M-10.6 -28.6A10.6 3 0 0 0 10.6 -28.6V-25.4A10.6 3 0 0 1 -10.6 -25.4Z'
  const rim = ellipse(0, -28.6, 10.6, 3)
  const hole = ellipse(0, -28.4, 8.6, 2.2)
  const stitch = (d: string) => `<path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray="1 .8"/>`
  const bandY = (x: number) => -16.9 + 1.65 * (1 - (x / 9.3) ** 2)
  const tooling = Array.from({ length: 8 }, (_, i) => {
    const x = -7.7 + i * 2.2, y = bandY(x), wx = 0.95 * Math.sqrt(1 - (x / 9.3) ** 2)
    return `<path d="M${f(x)} ${f(y - 1.6)}L${f(x + wx)} ${f(y)}L${f(x)} ${f(y + 1.6)}L${f(x - wx)} ${f(y)}Z" fill="${P.brownD}" opacity=".75"/><circle cx="${f(x + wx * 1.15)}" cy="${f(y - 0.9)}" r=".22" fill="${P.goldL}"/>`
  }).join('')
  const seam = Array.from({ length: 10 }, (_, i) => `<path d="M${f(-6.2 + i * 0.04)} ${f(-24 + i * 1.75)}l1.4 .45" stroke="${P.goldL}" stroke-width=".4"/>`).join('')
  return k.draw(
    [
      {
        d: body, fill: P.brown,
        inner:
          k.sh('M1 -30H11V2H1Z', 0, 0, 1, 0, 0, 0.95, P.brownD, 0.45) + `<path d="M-10 -30H-3V2H-10Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.5, 0)}"/>` +
          k.sh('M-11 -12H11V0H-11Z', 0, 0, 0, 1, 0, 0.5, P.brownD, 0.3) +
          stitch('M-9.5 -24.4C-5 -22.2 5 -22.2 9.5 -24.4') + stitch('M-9 -8.8C-5 -6.8 5 -6.8 9 -8.8') +
          `<path d="M-9.3 -19.6C-5 -17.4 5 -17.4 9.3 -19.6M-9.15 -14.2C-5 -12 5 -12 9.15 -14.2" fill="none" stroke="${P.brownD}" stroke-width=".55"/>` + tooling +
          `<path d="M-5.5 -24.4L-5 -8.6" stroke="${P.brownD}" stroke-width=".55"/>` + seam +
          hair(5.4, -23.6, 6.2, -21.4, 5.6, -19.6, 0.5, P.brownD) + hair(4.4, -12.6, 5.2, -10.6, 4.6, -9, 0.45, P.brownD) +
          hair(-8, -23, -8.4, -21, -7.8, -19.8, 0.5, '#FFE3C2', 0.8) + hair(-7.6, -12.4, -8, -10.8, -7.4, -9.4, 0.45, '#FFE3C2', 0.7),
      },
      { d: base, fill: P.brownD, line: 0.35, inner: k.sh(base, 0, 0, 1, 0, 0, 0.8, P.night, 0.35) + `<path d="M-8 -4.4C-5 -3 0 -2.8 3 -3" fill="none" stroke="${P.brown}" stroke-width=".5" opacity=".8"/>` },
      { d: lip, fill: P.brown, line: 0.35, inner: k.sh(lip, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.4) + `<path d="M-9.6 -25.8C-6.4 -24 -2 -23.6 2 -23.7" fill="none" stroke="#FFE3C2" stroke-width=".55" opacity=".75"/>` },
      {
        d: rim, fill: P.brown, line: 0.35,
        inner: `<path d="${hole}" fill="${HOLLOW}"/><path d="${hole}" fill="${k.lin('#000000', 0, 0, 0, 1, 0.55, 0)}"/>` + `<path d="M-8.4 -29.4C-5 -30.8 2 -31 6 -30.4" fill="none" stroke="#FFE3C2" stroke-width=".45" opacity=".6"/>`,
      },
    ],
    w,
  )
}

/** Hoja de trébol en forma de corazón, con el tallo en (0,0) y la punta hacia arriba. */
const LEAF = 'M0 0C-3.2 -2.2 -7.6 -5.4 -7.6 -10C-7.6 -13.2 -5 -14.8 -2.8 -14.8C-1.3 -14.8 -.3 -14 0 -12.8C.3 -14 1.3 -14.8 2.8 -14.8C5 -14.8 7.6 -13.2 7.6 -10C7.6 -5.4 3.2 -2.2 0 0Z'

/** Trébol de cuatro hojas centrado en (0,0), de radio 15, con la marca clara de cada hoja y las nervaduras. */
function clover(k: Kit, w = 0.6, rot = 0) {
  const R = [0, 90, 180, 270].map((r) => r + rot)
  return (
    k.draw(R.map((r) => ({
      d: LEAF, t: `rotate(${r})`, fill: P.green, line: 0.35,
      inner: k.sh(LEAF, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.45) + `<path d="M-3.8 -8.4Q0 -11.4 3.8 -8.4" fill="none" stroke="#EEF3D8" stroke-width="1.1" stroke-linecap="round" opacity=".85"/>`,
    })), w) +
    R.map((r) => `<g transform="rotate(${r})">${hair(0, -1, 0.2, -6, 0, -12, 0.55, P.greenD)}${hair(0, -6, -2.6, -8.6, -4.6, -11.4, 0.35, P.greenD)}${hair(0, -6, 2.6, -8.6, 4.6, -11.4, 0.35, P.greenD)}</g>`).join('') +
    `<circle r="1.5" fill="${P.greenD}" stroke="${P.ink}" stroke-width=".35"/>`
  )
}

/** Rosa tirada desde la platea, con el tallo hacia la derecha. */
const rose = (x: number, y: number, r: number, s = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0H10" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M0 0H10" stroke="${P.greenD}" stroke-width=".7" stroke-linecap="round"/>` +
  `<path d="M4 0C5 -1.8 7.4 -1.8 7.4 0C7.4 1.8 5 1.8 4 0Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".3"/>` +
  `<circle cx="0" cy="0" r="2.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><path d="M-1.2 -.5Q0 -1.5 1.2 -.3M-.8 .8Q.2 1.2 1 .4" fill="none" stroke="${P.wine}" stroke-width=".45"/></g>`

export const GENERALA_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Generalas ──────────────────────────────────────────────────────

  // Tres generalas: el cubilete de cuero manda en la mesa del bodegón, y la picada llega sin pedirla.
  'Cubilete de bodegón': (u) => {
    const k = kit(u)
    const VY = -30, Y1 = 106
    const px = (xb: number, y: number) => f(60 + ((xb - 60) * (y - VY)) / (Y1 - VY))
    const rows = [74, 79, 85.4, 93.4, 103.4, 118]
    let checks = ''
    for (let i = -9; i < 9; i++) {
      for (let j = 0; j < rows.length - 1; j++) {
        if ((i + j + 20) % 2) continue
        const a = rows[j], b = rows[j + 1], x0 = 60 + i * 9.6, x1 = x0 + 9.6
        checks += `M${px(x0, a)} ${a}L${px(x1, a)} ${a}L${px(x1, b)} ${b}L${px(x0, b)} ${b}Z`
      }
    }
    const cloth = 'M-20 74H140V130H-20Z'
    const board = 'M68 75.4H89.6L92 81.6H70.4Z', edge = 'M70.4 81.6H92V83.8H70.4Z'
    const salame = (x: number, y: number) =>
      `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="1.5" fill="${P.wine}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="${x}" cy="${f(y - 0.1)}" rx="2.2" ry="1" fill="${P.red}"/>` +
      [[-0.9, -0.2], [0.7, 0.2], [0.2, -0.45], [-0.3, 0.45], [1.3, -0.3]].map(([dx, dy]) => `<circle cx="${f(x + dx)}" cy="${f(y + dy)}" r=".24" fill="${P.white}"/>`).join('')
    const cheese = (x: number, y: number) =>
      `<path d="M${f(x - 1.8)} ${f(y - 1)}L${x} ${f(y - 2)}L${f(x + 1.8)} ${f(y - 1)}V${f(y + 1)}L${x} ${f(y + 2)}L${f(x - 1.8)} ${f(y + 1)}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>` +
      `<path d="M${f(x - 1.8)} ${f(y - 1)}L${x} ${f(y - 2)}L${f(x + 1.8)} ${f(y - 1)}L${x} ${y}Z" fill="${P.goldL}"/><path d="M${x} ${y}V${f(y + 2)}" stroke="${P.goldD}" stroke-width=".35"/>` +
      `<path d="M${x} ${f(y - 1)}L${f(x + 0.7)} ${f(y - 6)}" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><path d="M${x} ${f(y - 1)}L${f(x + 0.7)} ${f(y - 6)}" stroke="${P.goldL}" stroke-width=".4" stroke-linecap="round"/>`
    return (
      k.day() +
      k.sun(60, 48, 20, 46, 28, false) +
      `<path d="${cloth}" fill="${P.white}"/><path d="${checks}" fill="${P.red}"/>` +
      k.sh(cloth, 0, 0, 0, 1, 0.3, 0, P.mid, 0.25) + k.sh('M74 74H140V130H74Z', 0, 0, 1, 0, 0, 0.35, P.wine, 0.2) +
      `<path d="M0 74H120" stroke="${P.ink}" stroke-width="1"/>` +
      k.draw([{ d: board, fill: P.brown, inner: k.sh(board, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.4) + hair(72, 77.4, 80, 77, 88, 77.6, 0.4, P.brownD) + hair(74, 79.8, 82, 79.4, 90, 80, 0.4, P.brownD) }, { d: edge, fill: P.brownD }], 0.5) +
      salame(77.4, 78.6) + salame(82.6, 77.4) + cheese(87.2, 78.6) +
      k.floor(61.4, 94.2, 19, 3) +
      `<g transform="translate(60 94) scale(1.45)">${cubilete(k, 0.5)}${k.clip(MOUTH, die(k, 1.4, -30.8, 3.8, 18))}</g>` +
      hair(43.2, 49.6, 41.4, 47.6, 39.6, 46.8, 0.6) + hair(76.8, 49.6, 78.6, 47.6, 80.4, 46.8, 0.6) +
      hair(41.6, 33, 42.6, 28.6, 46.4, 26.4, 0.6) + hair(77.6, 25, 80.4, 28, 80.6, 32.6, 0.6) +
      die(k, 50.6, 37.4, 5.8, -18) + die(k, 68.6, 31.6, 6.2, 14) +
      sparkle(86, 44, 2.2) + sparkle(34, 60, 1.6) +
      k.defs()
    )
  },

  // Quince generalas: cinco dados iguales, con chupete, en el moisés.
  'Quintillizos': (u) => {
    const k = kit(u)
    const xs = [36, 48, 60, 72, 84], rots = [-7, 5, -3, 6, -5]
    const backRim = 'M24.6 58C24.6 50.6 30 49 36 49H84C90 49 95.4 50.6 95.4 58H92C92 53.6 88.6 52.6 84 52.6H36C31.4 52.6 28 53.6 28 58Z'
    const body = 'M25 64H95C94.4 71 93 79.4 89.4 84.4C88 86.4 86 87.4 83.4 87.4H36.6C34 87.4 32 86.4 30.6 84.4C27 79.4 25.6 71 25 64Z'
    const rim = roundRect(23.6, 60.6, 96.4, 66, 2.7)
    let scal = 'M25 62L25 59'
    for (let x = 25; x < 95; x += 5) scal += `Q${x + 2.5} 55.6 ${x + 5} 59`
    scal += 'V62Z'
    const weave = Array.from({ length: 6 }, (_, j) => {
      const y = 69.4 + j * 3.2
      return Array.from({ length: 18 }, (_, i) => `<path d="M${f(24 + i * 4.2 + (j % 2) * 2.1)} ${y}q2.1 -1.7 4.2 0" fill="none" stroke="${P.goldD}" stroke-width=".55"/>`).join('')
    }).join('') + Array.from({ length: 17 }, (_, i) => `<path d="M${f(27.2 + i * 4.2)} 66V88" stroke="${P.brown}" stroke-width=".35" opacity=".7"/>`).join('')
    const pacifier = (x: number, y: number) =>
      `<g transform="translate(${x} ${y})"><path d="M-3.2 -.4C-3.2 -2 3.2 -2 3.2 -.4C3.2 1.4 1.4 1.8 0 1.8C-1.4 1.8 -3.2 1.4 -3.2 -.4Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".45"/><ellipse cx="-1.2" cy="-.7" rx="1.1" ry=".45" fill="#fff" opacity=".85"/>` +
      `<circle cy="1.3" r="1.6" fill="none" stroke="${P.ink}" stroke-width="1.5"/><circle cy="1.3" r="1.6" fill="none" stroke="${P.gold}" stroke-width=".75"/><circle cx="-.6" cy="-.1" r=".3" fill="${P.goldL}"/></g>`
    const star = (x: number, y: number, r: number) => k.draw([{ d: starPath(x, y, r, r * 0.45, 5), fill: P.gold, inner: k.sh(starPath(x, y, r, r * 0.45, 5), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.4)
    const moon = 'M60.6 31.4A4.4 4.4 0 1 0 64.4 38.4A3.6 3.6 0 1 1 60.6 31.4Z'
    return (
      k.night() +
      [[28, 42, 0.6], [92, 44, 0.7], [34, 30, 0.45], [86, 30, 0.5], [26, 70, 0.4], [95, 72, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 58, 40, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.3) +
      `<path d="M60 17V25.6M44 30.6V36M60 27.2V31.4M76 30.6V36" stroke="${P.paper}" stroke-width=".45"/>` +
      rod('M43 31.4Q60 24.4 77 31.4', P.goldD, 1.1) + `<circle cx="60" cy="27.4" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      star(44, 39, 3.6) + star(76, 39, 3.6) +
      k.draw([{ d: moon, fill: P.goldL, inner: k.sh(moon, 0, 0, 1, 1, 0, 0.8, P.gold, 0.4) }], 0.4) +
      k.floor(60, 88.4, 34, 3, '#000') +
      k.draw([{ d: backRim, fill: P.goldL, inner: k.sh(backRim, 0, 0, 0, 1, 0, 0.6, P.goldD, 0.4) + Array.from({ length: 16 }, (_, i) => `<path d="M${27 + i * 4.4} 49V58" stroke="${P.goldD}" stroke-width=".4"/>`).join('') }], 0.55) +
      `<path d="M28 58C28 53.6 31.4 52.6 36 52.6H84C88.6 52.6 92 53.6 92 58Z" fill="${HOLLOW}"/>` +
      xs.map((x, i) => die(k, x, 53, 6.6, rots[i])).join('') +
      k.draw([{ d: scal, fill: P.white, inner: k.sh(scal, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + Array.from({ length: 14 }, (_, i) => `<circle cx="${27.5 + i * 5}" cy="60.2" r=".5" fill="${P.sky}"/>`).join('') }], 0.45) +
      xs.map((x, i) => pacifier(f(x - Math.sin((rots[i] * Math.PI) / 180) * 2), 56.4)).join('') +
      k.draw([
        { d: body, fill: P.goldL, inner: weave + k.sh('M60 60H98V90H60Z', 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) + k.sh('M20 74H100V90H20Z', 0, 0, 0, 1, 0, 0.7, P.brown, 0.35) },
        { d: rim, fill: P.gold, line: 0.35, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) + Array.from({ length: 24 }, (_, i) => `<path d="M${f(24.4 + i * 3.1)} 66L${f(26.4 + i * 3.1)} 60.6" stroke="${P.goldD}" stroke-width=".5"/>`).join('') + `<path d="M27 61.8H93" stroke="#fff" stroke-width=".6" opacity=".55"/>` },
      ], 0.7) +
      sparkle(90, 54, 1.8, P.goldL) + sparkle(31, 50, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Cuarenta generalas: la tómbola de la kermesse de la parroquia, cargada de dados que te obedecen.
  'Tómbola de kermesse': (u) => {
    const k = kit(u)
    const cx = 56, cy = 56, R = 20.4, D = [5.8, -3.8]
    const oct = (x: number, y: number, r: number) => Array.from({ length: 8 }, (_, i) => {
      const a = ((i + 0.5) / 8) * Math.PI * 2
      return [x + Math.cos(a) * r, y + Math.sin(a) * r]
    })
    const poly = (pts: number[][]) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
    const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    const Fp = oct(cx, cy, R), Bp = oct(cx + D[0], cy + D[1], R), Wp = oct(cx, cy, R - 4.2)
    const sides = Fp.map((p, i) => {
      const q = Fp[(i + 1) % 8], qb = Bp[(i + 1) % 8], pb = Bp[i]
      const slats = [0.34, 0.67].map((t) => {
        const [x0, y0] = lerp(p, q, t), [x1, y1] = lerp(pb, qb, t)
        return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="${P.brownD}" stroke-width=".45"/>`
      }).join('')
      return { d: poly([p, q, qb, pb]), slats }
    })
    const front = poly(Fp), win = poly(Wp)
    let mesh = ''
    for (let t = -44; t <= 44; t += 3.2) mesh += `M${cx - 22 + t} ${cy - 22}l44 44M${cx + 22 + t} ${cy - 22}l-44 44`
    const grain = Fp.map((p, i) => {
      const q = Fp[(i + 1) % 8], a = lerp(p, q, 0.18), b = lerp(p, q, 0.82), m = lerp(p, q, 0.5)
      const inw = (pt: number[], d: number) => [pt[0] + (cx - pt[0]) * d, pt[1] + (cy - pt[1]) * d]
      const [x0, y0] = inw(a, 0.1), [x1, y1] = inw(b, 0.1), [mx, my] = inw(m, 0.07)
      return hair(x0, y0, mx, my, x1, y1, 0.45, P.brownD)
    }).join('')
    const bracket = Fp.map(([x, y]) => {
      const a = Math.atan2(y - cy, x - cx) * (180 / Math.PI)
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M-4.6 -2.2L.6 0L-4.6 2.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/><circle cx="-3" cy="0" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/></g>`
    }).join('')
    const string = (x0: number, y0: number, qx: number, qy: number, x1: number, y1: number) => {
      const pts = along(x0, y0, qx, qy, x1, y1, [0.12, 0.27, 0.42, 0.57, 0.72, 0.87])
      const cols = [P.red, P.white, P.sky, P.gold, P.red, P.white]
      return `<path d="M${x0} ${y0}Q${qx} ${qy} ${x1} ${y1}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
        pts.map((q, i) => {
          const len = Math.hypot(q.dx, q.dy), ux = (q.dx / len) * 2.6, uy = (q.dy / len) * 2.6
          return `<path d="M${f(q.x - ux)} ${f(q.y - uy)}L${f(q.x + ux)} ${f(q.y + uy)}L${f(q.x + 0.4)} ${f(q.y + 6)}Z" fill="${cols[i]}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>`
        }).join('')
    }
    const wood = (d: string) => ({ d, fill: P.brown, inner: k.sh(d, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.4) + `<path d="${d}" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.4, 0)}"/>` })
    return (
      k.day() +
      k.sun(cx, cy, 23, 46, 28, false) +
      k.shade(ellipse(cx, cy, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      string(59, 21.6, 42, 34, 25.4, 41) + string(61, 21.6, 78, 34, 94.6, 41) +
      `<circle cx="60" cy="21.4" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.floor(58, 94, 20, 2.6) +
      k.draw([wood('M52.4 66H56L46.8 94H43Z'), wood('M62 66H65.6L74.2 94H70.4Z'), wood('M45 85H71.2L71.8 87.8H44.2Z')], 0.6) +
      `<path d="M42.4 93.2H47.4M69.8 93.2H74.8" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M42.4 93.2H47.4M69.8 93.2H74.8" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
      k.draw([
        ...sides.map((s, i) => ({ d: s.d, fill: i >= 4 && i <= 6 ? P.goldL : P.brown, line: 0.35, inner: s.slats + k.sh(s.d, 0, 0, 1, 1, 0.1, 0.7, P.brownD, 0.35) })),
        {
          d: front, fill: P.brown, line: 0.4,
          inner:
            k.sh(front, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="${front}" fill="${k.lin('#FFE3C2', 0, 0, 1, 1, 0.5, 0)}"/>` + grain +
            `<path d="${poly(oct(cx, cy, R - 1.3))}" fill="none" stroke="${P.goldL}" stroke-width=".45" opacity=".8"/>` +
            `<path d="${win}" fill="${P.sky1}"/>` +
            k.clip(win,
              die(k, 49.4, 51.6, 5.8, -22) + die(k, 63.2, 55.4, 5.8, 16) + die(k, 54.4, 66.4, 5.2, 38) +
              `<path d="${mesh}" stroke="${P.ink}" stroke-width=".28" opacity=".45"/>` + k.sh(win, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) +
              `<path d="M41.6 50C43.4 45 47 41.8 51.6 40.6" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".85"/>`) +
            `<path d="${win}" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="${win}" fill="none" stroke="${P.gold}" stroke-width=".8"/>`,
        },
      ], 0.75) +
      bracket +
      rod(`M${cx} ${cy}L73.4 66.6`, P.sky2, 1.7) + `<path d="M${cx + 1} ${cy - 0.6}L72.6 65.4" stroke="#fff" stroke-width=".4" opacity=".7"/>` +
      `<path d="${starPath(cx, cy, 4.8, 2.8, 8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="2" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${cx - 0.6}" cy="${cy - 0.6}" r=".7" fill="${P.goldL}"/>` +
      rod('M73.4 66.6L79.2 62.8', P.red, 2.8) + `<path d="M74.6 65L78.4 62.6" stroke="#fff" stroke-width=".5" stroke-linecap="round" opacity=".6"/>` + `<circle cx="73.4" cy="66.6" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      hair(82.6, 58.4, 85.8, 61.6, 84.6, 66.4, 0.7) + hair(84.6, 69.4, 81.6, 72.4, 77.4, 72.6, 0.7) +
      sparkle(88, 50, 2.2) + sparkle(30, 62, 1.8) + sparkle(84, 84, 1.4) +
      k.defs()
    )
  },

  // ── Servida ────────────────────────────────────────────────────────

  // Una servida: alguien te colgó una herradura en la puerta, y la suerte (un dado) cayó adentro.
  'Herradura': (u) => {
    const k = kit(u)
    const shoe =
      'M-14.4 -18.6C-16.6 -13.6 -17.8 -7 -17.6 -1C-17.4 9.4 -9.6 18 0 18C9.6 18 17.4 9.4 17.6 -1C17.8 -7 16.6 -13.6 14.4 -18.6L8.4 -17.8' +
      'C10 -13 10.8 -7.4 10.6 -1.4C10.4 5.6 5.8 10.8 0 10.8C-5.8 10.8 -10.4 5.6 -10.6 -1.4C-10.8 -7.4 -10 -13 -8.4 -17.8Z'
    const groove = 'M-11.4 -18.2C-13.2 -13.4 -14.2 -7.2 -14.1 -1.2C-14 7.4 -7.8 14.4 0 14.4C7.8 14.4 14 7.4 14.1 -1.2C14.2 -7.2 13.2 -13.4 11.4 -18.2'
    const holes = [[-12.7, -13.4, 18], [-13.9, -6.6, 6], [-13.8, 0.4, -4], [-11.6, 7.6, -30]].flatMap(([x, y, r]) => [[x, y, r], [-x, y, -r]])
      .map(([x, y, r]) => `<rect x="${f(x - 0.7)}" y="${f(y - 1.1)}" width="1.4" height="2.2" rx=".4" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".25" transform="rotate(${r} ${x} ${y})"/>`).join('')
    const hammer = [[-16, -10, -15.6, -7], [-16.2, 2, -15.4, 5.6], [-8, 15, -5, 16.2], [6, 16.2, 9, 14.8], [15.8, 2.6, 16.2, -1], [15.4, -12, 15.8, -9]]
      .map(([x0, y0, x1, y1]) => hair(x0, y0, (x0 + x1) / 2 + 0.4, (y0 + y1) / 2, x1, y1, 0.45, P.goldD)).join('')
    const planks = Array.from({ length: 11 }, (_, i) => `<path d="M${f(5.5 + i * 11)} 0V130" stroke="${P.blue}" stroke-width=".9"/><path d="M${f(6.4 + i * 11)} 0V130" stroke="${P.sky1}" stroke-width=".5" opacity=".6"/>`).join('')
    const grain = [[12, 20, 60], [23, 70, 110], [34, 30, 64], [45, 84, 120], [80, 26, 58], [89, 74, 116], [100, 36, 80]]
      .map(([x, y0, y1]) => hair(x, y0, x + 1.4, (y0 + y1) / 2, x - 0.4, y1, 0.5, P.blue, 0.7)).join('')
    const bow = 'M0 0C-2.4 -3.2 -5.6 -2.8 -5.4 0C-5.2 2.6 -2.2 2.6 0 0C2.2 2.6 5.2 2.6 5.4 0C5.6 -2.8 2.4 -3.2 0 0Z'
    return (
      `<rect width="120" height="130" fill="${P.sky}"/>` + planks + grain +
      k.shade('M0 0H120V130H0Z', k.rad(P.mid, 0.5, 0.46, 0.7, 0, 0.9), P.mid, 0.5) +
      k.shade(ellipse(60, 58, 36, 36), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.45) +
      [[30, 30], [90, 30], [30, 92], [90, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${P.blue}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      rod('M60 25.4L46 35.4', P.red, 1.3) + rod('M60 25.4L74 35.4', P.red, 1.3) +
      `<g transform="translate(61.6 60.6) scale(1.25)">${k.cast([shoe], 0, 0)}</g>` +
      `<g transform="translate(60 58) scale(1.25)">` +
      k.draw([{
        d: shoe, fill: P.gold,
        inner:
          k.sh(shoe, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="M-20 -20H-6V20H-20Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + hammer +
          `<path d="${groove}" fill="none" stroke="${P.goldD}" stroke-width=".9"/><path d="${groove}" fill="none" stroke="${P.goldL}" stroke-width=".4" transform="translate(-.5 -.4)"/>` + holes,
      }], 0.56) +
      `</g>` +
      die(k, 60, 62.4, 7.6, -6) +
      `<circle cx="60" cy="25.4" r="1.6" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="translate(60 26.6)">` + k.draw([{ d: bow, fill: P.red, inner: k.sh(bow, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], 0.4) + `<circle r="1.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/></g>` +
      sparkle(34, 44, 2.4) + sparkle(86, 50, 2) + sparkle(84, 78, 1.4) + sparkle(37, 74, 1.2) +
      k.defs()
    )
  },

  // Tres servidas: ya es sospechoso. Bajo la lámpara, la lupa encuentra un trébol donde iba el punto del medio.
  'Trébol de cuatro': (u) => {
    const k = kit(u)
    const lx = 61, ly = 52.6, lr = 16.6
    const lens = ellipse(lx, ly, lr, lr)
    const shadeL = 'M55.4 18.6H64.6L72.6 29C68 31 52 31 47.4 29Z'
    const a = Math.PI / 4, hx = lx + Math.cos(a) * lr, hy = ly + Math.sin(a) * lr
    return (
      k.night() +
      k.shade('M49 29H71L100 104H20Z', k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0.06), P.goldL, 0.35) +
      `<path d="M60 0V19" stroke="${P.ink}" stroke-width="1"/>` +
      k.draw([{ d: shadeL, fill: P.greenD, inner: k.sh(shadeL, 0, 0, 1, 0, 0, 0.9, P.night, 0.4) + `<path d="M52 23.6C55 22.4 58 21.6 61 21.4" fill="none" stroke="#EEF3D8" stroke-width=".7" opacity=".6"/>` }], 0.55) +
      `<path d="M47.4 29C52 31 68 31 72.6 29" fill="none" stroke="${P.gold}" stroke-width="1"/><ellipse cx="60" cy="30.4" rx="4.2" ry="1.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.floor(55, 92.6, 22, 2.8, '#000') +
      die(k, 51, 76, 15.4, -8) +
      `<path d="M${f(hx)} ${f(hy)}L87 83.6" stroke="${P.ink}" stroke-width="7.2" stroke-linecap="round"/><path d="M${f(hx)} ${f(hy)}L87 83.6" stroke="${P.brown}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M${f(hx + 2)} ${f(hy + 1)}L86 81.6" stroke="${P.goldL}" stroke-width=".8" stroke-linecap="round" opacity=".6"/>` + hair(78, 74.6, 81, 77.6, 84, 80.6, 0.6, P.brownD) +
      `<path d="M${f(hx - 0.8)} ${f(hy - 0.8)}L${f(hx + 3.6)} ${f(hy + 3.6)}" stroke="${P.ink}" stroke-width="7.6"/><path d="M${f(hx - 0.8)} ${f(hy - 0.8)}L${f(hx + 3.6)} ${f(hy + 3.6)}" stroke="${P.gold}" stroke-width="5.8"/>` +
      `<path d="${lens}" fill="${P.white}"/>` +
      k.clip(lens,
        k.sh(lens, 0, 0, 1, 1, 0, 0.5, P.sky2, 0.4) +
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<circle cx="${f(lx + sx * 9)}" cy="${f(ly + sy * 9)}" r="2.3" fill="${P.ink}"/><circle cx="${f(lx + sx * 9 - 0.7)}" cy="${f(ly + sy * 9 - 0.7)}" r=".6" fill="${P.mid}"/>`).join('') +
        `<g transform="translate(${lx} ${ly}) scale(.74)">${clover(k, 0.8)}</g>` +
        `<path d="${lens}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.55, 0)}"/>`) +
      `<path d="M48.6 47C50.4 42 54.4 38.8 59.4 38.2" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" opacity=".95"/>` +
      `<path d="${lens}" fill="none" stroke="${P.ink}" stroke-width="5.4"/><path d="${lens}" fill="none" stroke="${P.gold}" stroke-width="3.6"/><path d="${lens}" fill="none" stroke="${P.goldD}" stroke-width=".6" transform="translate(.5 .6)"/>` +
      `<path d="${ellipse(lx, ly, lr + 1.4, lr + 1.4)}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      sparkle(34, 44, 1.8, P.goldL) + sparkle(88, 50, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Siete generalas servidas: la mano de Dios, cerrada, le pega al dado.
  'Mano de Dios': (u) => {
    const k = kit(u)
    const finger = (x: number, w: number, top: number) => roundRect(f(x - w / 2), top, f(x + w / 2), 1.6, w / 2)
    const F: [number, number, number][] = [[-9.1, 6.2, -12.8], [-3, 6.2, -14.4], [3.1, 6.1, -13.6], [8.9, 5.6, -11.6]]
    const cuff = 'M-12.4 19H12L13 42H-13.4Z'
    const wrist = 'M-9.4 10H9.2L8.8 21H-9Z'
    const palm = 'M-12.6 -3C-13.2 3 -12.8 9 -10.6 14H10.6C12.8 9 13.2 3 12.4 -3Z'
    const thumb = 'M-10.6 14C-14.6 11.6 -15.6 7.6 -14 3.6C-13.2 1.4 -11.4 0 -9.2 0H.8C3.2 0 4.8 1.4 4.8 3.2C4.8 5 3.2 6.4 1 6.4H-6C-6.6 9 -6 11.6 -4.4 14Z'
    const fist = k.draw(
      [
        { d: cuff, fill: P.sky, line: 0.35, inner: `<path d="M-3.8 17H3.6L4 44H-4.4Z" fill="${P.white}"/>` + k.sh('M3 17H15V44H3Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-15 17H15V25H-15Z', 0, 0, 0, 1, 0.8, 0) + hair(-8, 26, -7, 32, -8.6, 40, 0.5) },
        { d: wrist, fill: P.skin, inner: k.sh('M2 8H11V22H2Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-11 15H11V22H-11Z', 0, 0, 0, 1, 0, 0.6) },
        { d: palm, fill: P.skin, inner: k.sh('M3 -4C8 2 10 8 9 15H14V-4Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-8 5H11V14H-8Z', 0, 0, 0, 1, 0.75, 0.1) },
        ...F.map(([x, w, top]) => ({
          d: finger(x, w, top), fill: P.skin, line: 0.38,
          inner:
            k.sh(`M${f(x)} ${top - 1}H${f(x + w)}V3H${f(x)}Z`, 0, 0, 1, 0, 0, 0.75) + k.sh(`M${f(x - w)} -3H${f(x + w)}V3H${f(x - w)}Z`, 0, 0, 0, 1, 0, 0.6) +
            `<ellipse cx="${f(x - w * 0.16)}" cy="${f(top + 2.2)}" rx="${f(w * 0.17)}" ry=".9" fill="#fff" opacity=".9"/>`,
        })),
        {
          d: thumb, fill: P.skin, line: 0.38,
          inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.7) + `<path d="M.6 1.4H2.4C3.7 1.4 4.3 2.4 4.3 3.2C4.3 4 3.7 5 2.4 5H.6C1.2 4 1.2 2.4 .6 1.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` + hair(-7.6, 1.2, -7, 3.2, -7.6, 5.4, 0.4),
        },
      ],
      0.62,
    )
    return (
      k.day() +
      k.sun(59, 52, 16, 43) +
      `<g transform="translate(61.4 64) scale(1.22)">${k.cast([cuff, wrist, palm, ...F.map(([x, w, top]) => finger(x, w, top)), thumb], 2, 1.8)}</g>` +
      `<g transform="translate(59 62) scale(1.22)">${fist}</g>` +
      hair(48.6, 44, 47.2, 40, 49.2, 35.6, 0.6) + hair(71, 44, 72.4, 40, 70.4, 35.6, 0.6) + hair(53.6, 41.6, 53, 39.6, 54, 37.6, 0.45) + hair(66, 41.6, 66.6, 39.6, 65.6, 37.6, 0.45) +
      die(k, 60, 32.6, 7.2, 12) +
      sparkle(86, 40, 2.2) + sparkle(34, 50, 1.6) +
      k.defs()
    )
  },

  // ── Doble generala ─────────────────────────────────────────────────

  // La primera doble: una doble con queso, con el dado pinchado arriba como aceituna. Sale con papas.
  'Doble con queso': (u) => {
    const k = kit(u)
    const top = 'M33.6 55C33.6 42 44 36 57 36C70 36 80.4 42 80.4 55C80.4 57 78.8 58 76.8 58H37.2C35.2 58 33.6 57 33.6 55Z'
    let lettuce = 'M32.6 57.8H81.4C81.6 59.6 80.6 61 79 60.6'
    for (let x = 79; x > 34; x -= 4.4) lettuce += `Q${f(x - 2.2)} 63.2 ${f(x - 4.4)} 60.8`
    lettuce += 'C33.6 61 32.4 59.6 32.6 57.8Z'
    const cheese = (y: number, drips: number[][]) =>
      `M32.8 ${y}H81.2L80 ${f(y + 1.8)}` + drips.map(([x, d]) => `H${f(x + 1.8)}C${f(x + 1.8)} ${f(y + d)} ${f(x - 1.8)} ${f(y + d)} ${f(x - 1.8)} ${f(y + 1.8)}`).join('') + `H34Z`
    const c1 = cheese(60.6, [[74, 6.4], [64, 4.6], [47, 7], [39.6, 4]]), c2 = cheese(69.6, [[71, 5.6], [55, 6.6], [42, 4.4]])
    const patty1 = roundRect(34, 62, 80, 69.8, 3.9), patty2 = roundRect(34, 71, 80, 78.8, 3.9)
    const bottom = 'M34.6 78H79.4V81C79.4 84.6 77 86.6 73.4 86.6H40.6C37 86.6 34.6 84.6 34.6 81Z'
    const seeds = [[44, 44, -30], [51, 40, -10], [58, 43, 15], [65, 39.6, 30], [71, 44, 50], [48, 49.4, 10], [62, 48.6, -20], [55, 52, 30], [75, 50, -15]]
      .map(([sx, sy, r]) => `<ellipse cx="${sx}" cy="${sy}" rx="1.1" ry=".6" fill="${P.white}" stroke="${P.brownD}" stroke-width=".25" transform="rotate(${r} ${sx} ${sy})"/>`).join('')
    const meat = (d: string, y: number) => ({
      d, fill: P.brownD, line: 0.4,
      inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, P.night, 0.4) + `<path d="M37 ${f(y + 1.6)}H72" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` +
        Array.from({ length: 12 }, (_, i) => `<circle cx="${f(37 + i * 3.7 + (i % 3) * 0.6)}" cy="${f(y + 3.6 + (i % 2) * 1.6)}" r=".45" fill="${P.night}" opacity=".7"/>`).join(''),
    })
    const gold = (d: string) => ({ d, fill: P.gold, line: 0.35, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) })
    const fries = [[77, 50, -12], [81, 48, -4], [85, 49.6, 6], [89, 52, 14], [79.4, 53, -20], [87, 54, 2], [83, 52, -8]]
      .map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y + 10})">` + k.draw([{ d: `M${x - 1.2} ${y}H${x + 1.2}V${y + 12}H${x - 1.2}Z`, fill: P.goldL, inner: k.sh(`M${x} ${y - 1}H${x + 2}V${y + 13}H${x}Z`, 0, 0, 1, 0, 0, 0.8, P.gold, 0.4) }], 0.35) + `</g>`).join('')
    const box = 'M73.6 60H94L91 87H76.6Z'
    return (
      k.day() +
      k.sun(57, 58, 20, 46, 28, false) +
      fries +
      k.draw([{ d: box, fill: P.red, inner: k.sh(box, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) + `<path d="M74 66H94V68.4H74Z" fill="${P.white}"/><path d="M75 72.6H93V73.8H75Z" fill="${P.white}" opacity=".9"/>` }], 0.6) +
      k.floor(59, 87, 26, 3) +
      rod('M57 38V23.6', P.goldL, 0.8) +
      die(k, 57, 29, 4.6, 8) +
      `<path d="M56.2 21.8L57 19.4L57.8 21.8L59.6 21L58.4 22.8L57 23.6L55.6 22.8L54.4 21Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.draw([
        { d: bottom, fill: P.goldD, line: 0.4, inner: k.sh(bottom, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) },
        meat(patty2, 71), gold(c2), meat(patty1, 62), gold(c1),
        { d: lettuce, fill: P.green, line: 0.35, inner: k.sh(lettuce, 0, 0, 1, 0, 0, 0.7, P.greenD, 0.4) },
        {
          d: top, fill: P.goldD, line: 0.4,
          inner: k.sh(top, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + `<path d="M33 36H52V58H33Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.55, 0)}"/>` + seeds +
            `<path d="M40 45C42.4 41 46.4 38.6 51 37.8" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>`,
        },
      ], 0.75) +
      rod('M57 36.4V34', P.goldL, 0.8) +
      sparkle(30, 40, 2.2) + sparkle(88, 34, 1.8) +
      k.defs()
    )
  },

  // Tres dobles: el doble de riesgo se tira del edificio sin cubilete de protección (lo dejó en la terraza).
  'Doble de riesgo': (u) => {
    const k = kit(u)
    const front = 'M12 52H40V112H12Z', side = 'M40 52L45 55V112H40Z', ledge = 'M10.6 49.4H41.4V52.4H10.6Z'
    const windows = Array.from({ length: 12 }, (_, i) => {
      const wx = 15.4 + (i % 3) * 8.4, wy = 58 + Math.floor(i / 3) * 10
      return `<rect x="${wx}" y="${wy}" width="5" height="6.4" fill="${i === 4 || i === 9 ? P.goldL : P.sky}" stroke="${P.ink}" stroke-width=".4"/><path d="M${wx} ${f(wy + 3.2)}H${wx + 5}" stroke="${P.ink}" stroke-width=".3"/><path d="M${wx + 1} ${wy + 2.4}L${wx + 3} ${wy + 0.8}" stroke="#fff" stroke-width=".6" opacity=".7"/>`
    }).join('')
    const bagFront = roundRect(46.4, 81, 79.6, 91, 3.2)
    const bagTop = 'M49.6 77.2H76.4C78.6 77.2 80 78.6 79.6 81H46.4C46 78.6 47.4 77.2 49.6 77.2Z'
    return (
      k.day() +
      k.sun(65, 42.6, 14, 44, 28, false) +
      `<path d="M41.6 47Q45 29 52.6 32.6" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-dasharray="1.6 1.6" stroke-linecap="round"/>` +
      `<path d="M72.4 54.6Q75.4 65 65 76.4" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-dasharray="1.6 1.6" stroke-linecap="round"/>` +
      k.draw([
        { d: side, fill: P.sky2, inner: k.sh(side, 0, 0, 1, 0, 0.2, 0.9, P.mid, 0.4) },
        { d: front, fill: P.white, inner: windows + k.sh('M28 50H42V112H28Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) + `<path d="M12 55H40" stroke="${P.sky2}" stroke-width=".6"/>` },
        { d: ledge, fill: P.sky1, line: 0.35, inner: k.sh(ledge, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) },
      ], 0.7) +
      `<g transform="translate(25 45.6) rotate(86.4) scale(.43)">${cubilete(k, 1.3)}</g>` +
      k.floor(63, 91, 19, 2.4) +
      k.draw([
        {
          d: bagFront, fill: P.red,
          inner: k.sh(bagFront, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + [53, 59.8, 66.6, 73.4].map((x) => hair(x, 81.6, x + 0.8, 86, x, 90.4, 0.7, P.wine)).join('') +
            [50, 56.6, 63.2, 70, 76.4].map((x) => `<path d="M${x} 83.4C${x + 1} 84.8 ${x + 1} 87 ${x} 88.4" fill="none" stroke="#fff" stroke-width=".6" opacity=".45"/>`).join(''),
        },
        {
          d: bagTop, fill: P.white, line: 0.35,
          inner: `<path d="${ellipse(63, 79.1, 9, 1.5)}" fill="none" stroke="${P.red}" stroke-width="1.1"/><path d="${ellipse(63, 79.1, 3.4, 0.7)}" fill="${P.red}"/>` + k.sh(bagTop, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3),
        },
      ], 0.6) +
      hair(48.8, 35, 52, 30.4, 56, 29, 0.75) + hair(49.6, 41.4, 52.6, 37.6, 55.4, 36.4, 0.6) + hair(78, 51, 81, 48.4, 82, 44.4, 0.75) + hair(75, 56, 78.8, 54.8, 80.4, 51.6, 0.6) +
      die(k, 65, 42.6, 12, 30) +
      sparkle(36, 34, 2) + sparkle(90, 44, 1.6) + sparkle(88, 70, 1.3) +
      k.defs()
    )
  },

  // Ocho dobles: dos dados saludan en el Colón, bajo el arco dorado; el público pide otra.
  'Bis en el Colón': (u) => {
    const k = kit(u)
    const arch = 'M24 106V46C24 21 96 21 96 46V106ZM87 106V47C87 31 33 31 33 47V106Z'
    const opening = 'M33 106V47C33 31 87 31 87 47V106Z'
    let valance = 'M30 30H90V41.6'
    for (let x = 90; x > 30; x -= 7.5) valance += `Q${f(x - 3.75)} 46.6 ${f(x - 7.5)} 41.6`
    valance += 'Z'
    let fringe = ''
    for (let x = 30; x < 90; x += 7.5) fringe += `M${x} 41.6Q${f(x + 3.75)} 46.6 ${f(x + 7.5)} 41.6`
    const tassels = Array.from({ length: 7 }, (_, i) => {
      const x = 37.5 + i * 7.5
      return `<path d="M${x} 41.6V44.2" stroke="${P.gold}" stroke-width=".6"/><path d="M${x - 1} 44.2H${x + 1}L${x + 0.6} 46.6H${x - 0.6}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
    }).join('')
    const curtain = 'M33 38H51.6C50 50 46.6 62 45 70C44.2 74 43.8 79 44.6 86H33Z'
    const drape = (flip: boolean) =>
      `<g${flip ? ' transform="translate(120 0) scale(-1 1)"' : ''}>` +
      k.draw([{
        d: curtain, fill: P.red,
        inner:
          k.sh(curtain, 0, 0, 1, 0, 0, 0.85, P.wine, 0.45) + `<path d="M33 38H38V86H33Z" fill="${k.lin(P.wine, 0, 0, 1, 0, 0.5, 0)}"/>` +
          hair(37, 39, 39, 56, 41.4, 70, 0.8, P.wine) + hair(42, 39, 43.6, 54, 43.6, 70, 0.75, P.wine) + hair(47, 39, 46.4, 52, 44.6, 68, 0.6, P.wine) +
          hair(39.4, 40, 41.2, 54, 42.6, 68, 0.5, P.goldL, 0.45) + hair(41.6, 72, 40, 79, 38, 85.6, 0.7, P.wine) + hair(43.4, 72, 42.4, 79, 41.4, 85.6, 0.6, P.wine),
      }], 0.6) +
      rod('M33 70.6Q39 72 44.8 70.2', P.gold, 1.2) +
      `<path d="M37.4 71.6V75.4" stroke="${P.gold}" stroke-width=".7"/><path d="M36 75.2H38.8L38.2 79.2H36.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>`
    const studs = (() => {
      let s = ''
      for (let i = 0; i <= 12; i++) {
        const t = i / 12, a = 1 - t, x = a * a * a * 28.5 + 3 * a * a * t * 28.5 + 3 * a * t * t * 91.5 + t * t * t * 91.5, y = a * a * a * 46.5 + 3 * a * a * t * 25.6 + 3 * a * t * t * 25.6 + t * t * t * 46.5
        s += `<circle cx="${f(x)}" cy="${f(y)}" r=".8" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>`
      }
      for (const y of [56, 66, 76, 86, 96]) s += `<circle cx="28.5" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/><circle cx="91.5" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>`
      return s
    })()
    const scroll = (x: number, sgn: number) =>
      `<g transform="translate(${x} 30) scale(${sgn} 1)"><path d="M0 0C3.6 0 5.6 3 4.4 5.6C3.2 8 -.4 7.6 -.6 5.2C-.8 3.6 1 2.8 2 3.8" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M0 0C3.6 0 5.6 3 4.4 5.6C3.2 8 -.4 7.6 -.6 5.2C-.8 3.6 1 2.8 2 3.8" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linecap="round"/></g>`
    const cartouche = ellipse(60, 29.6, 10.4, 5.6)
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.85), P.night, 0.6) +
      `<path d="${opening}" fill="${P.night}"/>` +
      k.clip(opening,
        k.shade(ellipse(60, 64, 26, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.32, 0), P.goldL, 0.3) +
        k.draw([
          { d: 'M20 78H100L104 88H16Z', fill: P.brown, inner: k.sh('M20 78H100L104 88H16Z', 0, 0, 0, 1, 0, 0.7, P.brownD, 0.4) + [40, 48, 56, 64, 72, 80].map((x) => `<path d="M${x} 78L${f(60 + (x - 60) * 1.3)} 88" stroke="${P.brownD}" stroke-width=".45"/>`).join('') },
          { d: 'M16 88H104V110H16Z', fill: P.brownD, inner: k.sh('M16 88H104V110H16Z', 0, 0, 0, 1, 0, 0.6, P.night, 0.4) },
        ], 0.5) +
        k.shade(ellipse(60, 81, 22, 4), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.5) +
        [42, 51, 60, 69, 78].map((x) => `<path d="M${x - 2} 89.4Q${x} 86.8 ${x + 2} 89.4Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
        k.floor(60, 79.4, 20, 2, P.night) +
        die(k, 50.2, 68.8, 9.4, -12) + die(k, 69.8, 68.8, 9.4, 12) +
        rose(47.4, 83.6, -14) + rose(72.6, 84.8, 194) + rose(61, 86.2, -168, 0.9) +
        drape(false) + drape(true) +
        k.draw([{ d: valance, fill: P.red, inner: k.sh(valance, 0, 0, 0, 1, 0, 0.8, P.wine, 0.45) + Array.from({ length: 8 }, (_, i) => hair(33.75 + i * 7.5, 31, 33.4 + i * 7.5, 38, 33.75 + i * 7.5, 45, 0.6, P.wine)).join('') }], 0.5) +
        `<path d="${fringe}" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` + tassels) +
      k.draw([{
        d: arch, fill: P.gold,
        inner:
          k.sh(arch, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M24 22H38V106H24Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="M26.4 106V46.4C26.4 24.6 93.6 24.6 93.6 46.4V106M30.6 106V46.8C30.6 28.6 89.4 28.6 89.4 46.8V106" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
          `<path d="M26.9 106V46.4C26.9 25.2 93.1 25.2 93.1 46.4V106" fill="none" stroke="${P.goldL}" stroke-width=".4" opacity=".8"/>`,
      }], 0.75) +
      studs +
      scroll(49.6, -1) + scroll(70.4, 1) +
      k.draw([{ d: cartouche, fill: P.gold, inner: k.sh(cartouche, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) + `<path d="${ellipse(60, 29.6, 8.4, 4)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".45"/>` }], 0.6) +
      `<text x="60" y="31.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.8" fill="${P.ink}" text-anchor="middle">¡Otra!</text>` +
      sparkle(60, 56, 1.8, P.goldL) + sparkle(41, 54, 1.2, P.goldL) + sparkle(80, 60, 1.2, P.goldL) +
      k.defs()
    )
  },

  // ── Planillón ──────────────────────────────────────────────────────

  // Doscientos puntos: anotados en la libreta del almacén, con el lápiz que vive detrás de la oreja.
  'Libreta de almacenero': (u) => {
    const k = kit(u)
    const page = roundRect(-16, -26, 16, 29, 1.2)
    const cover = 'M-16.6 -30.4H16.6V-25H-16.6Z'
    // Siete renglones en lápiz: lo que se anotó a la izquierda y los puntos a la derecha.
    const rows = Array.from({ length: 7 }, (_, i) => {
      const y = -15.2 + i * 4.8
      return hair(-9, y, -5.6, y - 1.2 + (i % 2) * 0.8, -1.6 + (i % 3), y - 0.2, 0.55, P.mid) +
        hair(6.4 + (i % 2) * 0.8, y + 0.2, 7.4, y - 1.6, 8.8, y - 0.4, 0.5, P.mid) + hair(9.4, y - 0.2, 10.6 + (i % 3) * 0.3, y - 1.8, 12.6, y - 0.6, 0.5, P.mid)
    }).join('')
    const pencil =
      k.draw([
        { d: 'M-15 -2.7H17V2.7H-15Z', fill: P.gold, inner: `<path d="M-15 -.9H17V.9H-15Z" fill="${P.goldL}"/>` + k.sh('M-16 .9H18V3H-16Z', 0, 0, 0, 1, 0, 0.9, P.goldD, 0.4) + `<path d="M-15 -.9H17M-15 .9H17" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: 'M17 -2.7L25 0L17 2.7Z', fill: P.skin, inner: k.sh('M16 0H26V3H16Z', 0, 0, 0, 1, 0, 0.8, P.brown, 0.4) + `<path d="M22.4 -.9L25 0L22.4 .9Z" fill="${P.ink}"/>` },
        { d: 'M-19.4 -2.9H-15V2.9H-19.4Z', fill: P.sky2, line: 0.3, inner: `<path d="M-18 -3V3M-16.6 -3V3" stroke="${P.blue}" stroke-width=".5"/>` + k.sh('M-20 0H-14V3H-20Z', 0, 0, 0, 1, 0, 0.8, P.mid, 0.4) },
        { d: 'M-19.4 -2.7H-22.4C-23.6 -2.7 -24.2 -1.8 -24.2 0C-24.2 1.8 -23.6 2.7 -22.4 2.7H-19.4Z', fill: P.red, inner: k.sh('M-25 0H-19V3H-25Z', 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) },
      ], 0.55) +
      `<path d="M17 -2.7Q18 -1.4 17.4 0Q18 1.4 17 2.7" fill="none" stroke="${P.goldD}" stroke-width=".4"/>`
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(58, 92, 22, 2.6) +
      `<g transform="translate(55 61) rotate(-6)">` +
      k.cast([page], 2, 2) +
      k.draw([
        { d: roundRect(-15.4, -25.4, 16.8, 29.8, 1.2), fill: P.night },
        { d: roundRect(-15.8, -25.8, 16.4, 29.4, 1.2), fill: P.paper, line: 0.3 },
        {
          d: page, fill: P.white, line: 0.35,
          inner:
            Array.from({ length: 10 }, (_, i) => `<path d="M-16 ${f(-18.4 + i * 4.8)}H16" stroke="${P.sky2}" stroke-width=".45"/>`).join('') +
            `<path d="M-10.6 -26V29" stroke="${P.red}" stroke-width=".45" opacity=".8"/>` + rows +
            `<path d="M-1 19.6H14" stroke="${P.ink}" stroke-width=".55"/>` +
            k.sh('M4 -27H17V30H4Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3),
        },
        { d: cover, fill: P.night, line: 0.3, inner: k.sh(cover, 0, 0, 0, 1, 0, 0.7, '#0E1533', 0.4) + `<path d="M-15 -27.7H15" stroke="${P.sky2}" stroke-width=".4" stroke-dasharray="1 .9" opacity=".8"/>` },
      ], 0.7) +
      `<rect x="-9" y="-26.4" width="3.6" height="2.4" rx=".4" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".35"/><rect x="5.4" y="-26.4" width="3.6" height="2.4" rx=".4" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="2.6" y="-19.6" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle">Fiado</text>` +
      `<text x="6.2" y="26.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="6.6" fill="${P.ink}" text-anchor="middle">200</text>` +
      `<path d="M-2.6 23.6C-3 20.4 4 19.6 10 20.2C15.4 20.8 16 25.6 11.6 27.4C6.6 29.4 -2 28.6 -2.6 24.6" fill="none" stroke="${P.red}" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>` +
      `<g transform="translate(80.6 61) rotate(100)">${k.cast(['M-24.2 -2.8H25V2.8H-24.2Z'], 1.6, -1.4)}${pencil}</g>` +
      sparkle(32, 42, 2) + sparkle(88, 84, 1.4) +
      k.defs()
    )
  },

  // Doscientos cincuenta: la planilla de tapa dura, forrada con papel araña, como en la escuela.
  'Cuaderno Rivadavia': (u) => {
    const k = kit(u)
    const cover = roundRect(-21, -28, 21, 28, 1.6)
    let seed = 7
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
    const fibers = Array.from({ length: 46 }, () => {
      const x = -20 + rnd() * 42, y = -28 + rnd() * 56, a = rnd() * Math.PI * 2, l = 3 + rnd() * 5
      return hair(x, y, x + Math.cos(a) * l * 0.5 + 1.2, y + Math.sin(a) * l * 0.5 - 1, x + Math.cos(a) * l, y + Math.sin(a) * l, 0.45, rnd() > 0.5 ? P.sky : P.white, 0.55)
    }).join('')
    const label = roundRect(-10.6, -16, 15.6, 2.6, 1.6)
    const ribbon = 'M7.4 28.4L6.6 37.6L8.8 35.8L11 37.4L10.6 28.4Z'
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(62, 90, 26, 3) +
      `<g transform="translate(59 58) rotate(-7)">` +
      k.cast([cover], 3, 3) +
      k.draw([{ d: ribbon, fill: P.red, inner: k.sh(ribbon, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.45) +
      k.draw([
        { d: roundRect(-19.6, -26.4, 23.6, 30.6, 1.6), fill: P.night },
        { d: roundRect(-20, -27, 22.4, 29.6, 1.2), fill: P.paper, inner: Array.from({ length: 6 }, (_, i) => `<path d="M-20 ${f(28.4 + i * 0.3)}H23M${f(21.2 + i * 0.3)} -27V30" stroke="${P.sky2}" stroke-width=".25"/>`).join('') },
        {
          d: cover, fill: P.mid,
          inner:
            fibers + k.sh(cover, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) +
            `<path d="M-21 -28H-15.4V28H-21Z" fill="${P.night}"/><path d="M-16.4 -28V28M-19.6 -28V28" stroke="${P.blue}" stroke-width=".35" stroke-dasharray=".8 .8"/>` +
            `<path d="M2 -28H11L-9 28H-18Z" fill="#fff" opacity=".12"/><path d="M14 -28H16L-4 28H-6Z" fill="#fff" opacity=".12"/>`,
        },
      ], 0.8) +
      k.draw([{ d: label, fill: P.white, inner: k.sh(label, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) + `<path d="${roundRect(-9.4, -14.8, 14.4, 1.4, 1)}" fill="none" stroke="${P.red}" stroke-width=".45"/>` + `<path d="M-7 -3.4H12" stroke="${P.sky2}" stroke-width=".5"/>` }], 0.5) +
      `<text x="2.5" y="-7.6" ${GEORGIA} font-style="italic" font-size="5.4" fill="${P.ink}" text-anchor="middle">Generala</text>` +
      hair(-6, -1.6, -2, -2.8, 3, -1.8, 0.45, P.mid) +
      k.draw([{ d: starPath(13, 18, 5.2, 2.3, 5), fill: P.gold, inner: k.sh(starPath(13, 18, 5.2, 2.3, 5), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.5) +
      `<path d="${starPath(12.6, 17.6, 2, 0.9, 5)}" fill="${P.goldL}"/>` +
      `</g>` +
      sparkle(86, 32, 2.2) + sparkle(32, 44, 1.6) +
      k.defs()
    )
  },

  // Trescientos puntos: te contratan para hacer el balance del club. La balanza dorada, con un dado en cada platillo
  // y la visera verde de contador colgada del remate.
  'Contador con visera': (u) => {
    const k = kit(u)
    const column = 'M57.6 44H62.4L63.4 87H56.6Z'
    const capital = 'M54.6 40.4H65.4L64 44.4H56Z'
    const plinth = 'M51 87H69L71.4 91.4H48.6Z'
    const step = 'M45.4 91.4H74.6V97.4H45.4Z'
    const beam = 'M33 33.2C42 32.4 50 32 56 32.6H64C70 32 78 32.4 87 33.2V36.2C78 35.6 70 35.6 64 36.4H56C50 35.6 42 35.6 33 36.2Z'
    const pan = (x: number) => `M${f(x - 9.6)} 62.4H${f(x + 9.6)}C${f(x + 9.2)} 67.6 ${f(x + 4.8)} 70.6 ${x} 70.6C${f(x - 4.8)} 70.6 ${f(x - 9.2)} 67.6 ${f(x - 9.6)} 62.4Z`
    const volute = (x: number, sx: number) =>
      `<g transform="translate(${x} 34.6) scale(${sx} 1)"><path d="M0 0C-3.4 0 -4.6 -3.2 -2.6 -4.6C-1 -5.6 .8 -4.4 .2 -3" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M0 0C-3.4 0 -4.6 -3.2 -2.6 -4.6C-1 -5.6 .8 -4.4 .2 -3" fill="none" stroke="${P.gold}" stroke-width=".9"/><circle cx=".2" cy="-3" r=".6" fill="${P.goldL}"/></g>`
    const chains = (x: number) => `<path d="M${x} 36L${f(x - 8.6)} 62.4M${x} 36L${f(x + 8.6)} 62.4" stroke="${P.ink}" stroke-width=".9"/><path d="M${x} 36L${f(x - 8.6)} 62.4M${x} 36L${f(x + 8.6)} 62.4" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".9 .5"/>`
    const gold = (d: string, inner = '') => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="${d}" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}" opacity=".7"/>` + inner })
    const flutes = [-2.6, -1.3, 0, 1.3, 2.6].map((o) => `<path d="M${f(60 + o * 0.85)} 45V86" stroke="${P.goldD}" stroke-width=".35"/>`).join('')
    const brim = 'M-7 .4C-6.6 6 4 9.6 10.4 4.4C8.4 2.2 5 1.2 1.6 1.2C-1.6 1.2 -4.6 .8 -7 .4Z'
    return (
      k.day() +
      k.sun(60, 50, 16, 46) +
      k.shade(ellipse(60, 50, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      laurel(46, 99, 27, 92, 24, 66, 6) + laurel(74, 99, 93, 92, 96, 66, 6, true) +
      k.floor(60, 97.6, 18, 2.4, P.mid) +
      k.draw([
        gold(step, `<path d="M45.4 92.8H74.6" stroke="${P.goldL}" stroke-width=".6"/>`),
        gold(plinth),
        gold(column, flutes),
        gold(capital, `<path d="M55.4 42.2H64.6" stroke="${P.goldD}" stroke-width=".4"/>`),
      ], 0.7) +
      `<g transform="translate(0 5)">` +
      chains(34) + chains(86) +
      k.draw([
        gold(beam, `<path d="M36 34.2C46 33.4 52 33.4 56 33.8M64 33.8C68 33.4 74 33.4 84 34.2" fill="none" stroke="${P.goldL}" stroke-width=".6"/>`),
        gold(pan(34), `<path d="M26 64.6C30 66.4 38 66.4 42 64.6" fill="none" stroke="${P.goldD}" stroke-width=".4"/>`),
        gold(pan(86), `<path d="M78 64.6C82 66.4 90 66.4 94 64.6" fill="none" stroke="${P.goldD}" stroke-width=".4"/>`),
      ], 0.7) +
      `<ellipse cx="34" cy="62.4" rx="9.6" ry="1.4" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".5"/><ellipse cx="86" cy="62.4" rx="9.6" ry="1.4" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".5"/>` +
      volute(33.4, 1) + volute(86.6, -1) +
      `<path d="${starPath(60, 34.4, 3.6, 1.6, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="60" cy="34.4" r="1.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M58.8 32.4L60 25.4L61.2 32.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/><circle cx="60" cy="24.6" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      die(k, 34, 56.2, 5.8, 0) + die(k, 86, 56.2, 5.8, 0) +
      `<g transform="translate(60.6 28.4) rotate(-16) scale(1.3)">` +
      `<ellipse cx="0" cy="0" rx="6.6" ry="2.2" fill="none" stroke="${P.ink}" stroke-width="2.2"/><ellipse cx="0" cy="0" rx="6.6" ry="2.2" fill="none" stroke="${P.greenD}" stroke-width="1.2"/>` +
      `<path d="${brim}" fill="${P.green}" opacity=".85"/><path d="${brim}" fill="${k.lin(P.greenD, 0, 0, 1, 1, 0, 0.9)}" opacity=".6"/>` +
      `<path d="${brim}" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linejoin="round"/>` +
      `<path d="M-5.6 1.6C-4.4 5.4 3.6 8 8.8 4.6" fill="none" stroke="#EEF3D8" stroke-width=".4" stroke-dasharray=".9 .7"/>` + hair(-3, 3, 1, 5.6, 6, 5, 0.7, '#fff', 0.7) +
      `</g></g>` +
      `<rect x="53.4" y="92.6" width="13.2" height="4" rx=".6" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="60" y="95.9" ${GEORGIA} font-weight="700" font-size="3.6" fill="${P.red}" text-anchor="middle">300</text>` +
      sparkle(28, 40, 2.2) + sparkle(92, 42, 1.8) + sparkle(74, 24, 1.4) +
      k.defs()
    )
  },
}
