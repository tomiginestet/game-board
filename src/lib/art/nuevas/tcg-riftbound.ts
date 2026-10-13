// Riftbound (el TCG del League of Legends). Nada de campeones, del mapa tal cual ni de logos: runas, cristales,
// torres, cascos y bestias genéricas. El color propio del juego es el verde agua de la ficha (#0C8599): el grano
// del fondo y el brillo de la magia van en ese tono.
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const TEAL = '#0C8599', TEAL_L = '#7DCBD3', TEAL_XL = '#D3F0F1', TEAL_D = '#08606E', TEAL_K = '#053F49'
const VIO = '#6A55A6', VIO_L = '#A797D4', VIO_D = '#3D2B6B'
const FULL = 'M0 0H120V130H0Z'

const poly = (...p: number[][]) => `M${p.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`

/** Fondo de papel con el grano verde agua hacia los bordes (el del juego). */
const rift = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(TEAL_L, 0.5, 0.46, 0.7, 0, 1), '#6DB9C1', 0.5)

/** Resplandor de la magia. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, c = TEAL_L, a = 0.85) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Trazo de runa tallada que brilla: surco oscuro, luz verde agua y el filo blanco. */
const runeLine = (d: string, w = 1) =>
  `<g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
  `<path d="${d}" stroke="${TEAL_L}" stroke-width="${f(5.6 * w)}" opacity=".35"/>` +
  `<path d="${d}" stroke="${TEAL_D}" stroke-width="${f(3 * w)}"/>` +
  `<path d="${d}" stroke="${TEAL}" stroke-width="${f(1.9 * w)}"/>` +
  `<path d="${d}" stroke="${TEAL_XL}" stroke-width="${f(0.75 * w)}"/></g>`

/** Cristal tallado de seis caras (prisma con punta arriba y abajo), centrado en x=0. */
function crystal(k: Kit, w: number, yT: number, y1: number, y2: number, yB: number, d = 1.6, lw = 0.6) {
  const a = w / 2, b = w / 6
  const T = [0, yT], L1 = [-a, y1], F1 = [-b, y1 + d], G1 = [b, y1 + d], R1 = [a, y1]
  const L2 = [-a, y2], F2 = [-b, y2 + d], G2 = [b, y2 + d], R2 = [a, y2], B = [0, yB]
  const out = poly(T, R1, R2, B, L2, L1)
  const faces: [string, string][] = [
    [poly(T, L1, F1), TEAL_XL], [poly(T, F1, G1), TEAL_L], [poly(T, G1, R1), TEAL],
    [poly(L1, F1, F2, L2), TEAL_L], [poly(F1, G1, G2, F2), TEAL], [poly(G1, R1, R2, G2), TEAL_D],
    [poly(L2, F2, B), TEAL], [poly(F2, G2, B), TEAL_D], [poly(G2, R2, B), TEAL_K],
  ]
  const edges = `M${-b} ${y1 + d}L0 ${yT}L${b} ${y1 + d}M${-a} ${y1}L${-b} ${y1 + d}H${b}L${a} ${y1}M${-b} ${y1 + d}V${y2 + d}M${b} ${y1 + d}V${y2 + d}M${-a} ${y2}L${-b} ${y2 + d}H${b}L${a} ${y2}M${-b} ${y2 + d}L0 ${yB}L${b} ${y2 + d}`
  const h = y2 - y1
  return k.draw([{
    d: out, fill: TEAL,
    inner:
      faces.map(([p, c]) => `<path d="${p}" fill="${c}"/>`).join('') +
      k.sh(out, 0, 0, 0, 1, 0, 0.55, TEAL_K, 0.3) +
      `<path d="${edges}" fill="none" stroke="${TEAL_K}" stroke-width="${f(lw * 0.5)}" stroke-linejoin="round" opacity=".7"/>` +
      hair(-a + w * 0.08, y1 + h * 0.08, -a + w * 0.12, y1 + h * 0.5, -a + w * 0.09, y2 - h * 0.1, w * 0.05, '#fff', 0.9) +
      hair(-b + w * 0.06, y1 + h * 0.2, -b + w * 0.1, y1 + h * 0.4, -b + w * 0.05, y1 + h * 0.62, w * 0.035, TEAL_XL, 0.8) +
      hair(b + w * 0.08, y1 + h * 0.3, b + w * 0.14, y1 + h * 0.55, b + w * 0.1, y2 - h * 0.05, w * 0.03, TEAL_L, 0.7),
  }], lw)
}

/** Anillo dorado que orbita: `front` dibuja la mitad de adelante (la de abajo), si no la de atrás. */
function ring(k: Kit, cx: number, cy: number, rx: number, ry: number, front: boolean) {
  const d = ellipse(cx, cy, rx, ry)
  const half = front ? `M${cx - rx - 3} ${cy}H${cx + rx + 3}V${cy + ry + 3}H${cx - rx - 3}Z` : `M${cx - rx - 3} ${cy}H${cx + rx + 3}V${cy - ry - 3}H${cx - rx - 3}Z`
  const beads = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + 0.26, y = cy + Math.sin(a) * ry
    if (front ? y < cy : y >= cy) return ''
    return `<circle cx="${f(cx + Math.cos(a) * rx)}" cy="${f(y)}" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`
  }).join('')
  return k.clip(half,
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.6"/><path d="${d}" fill="none" stroke="${front ? P.gold : P.goldD}" stroke-width="1.5"/>` +
    (front ? `<path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".45" transform="translate(0 -.4)"/>` : '') + beads)
}

/** Aparejo de piedra: hiladas horizontales y juntas alternadas. */
const masonry = (x0: number, x1: number, y0: number, y1: number, h = 4.4, w = 6.4, c: string = P.blue) => {
  let d = ''
  for (let y = y1, r = 0; y > y0; y -= h, r++) {
    d += `M${x0} ${f(y)}H${x1}`
    for (let x = x0 + (r % 2 ? w / 2 : 0.4); x < x1; x += w) d += `M${f(x)} ${f(y)}V${f(y - h)}`
  }
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width=".45"/>`
}

/** Yelmo cerrado de guerra, de frente, con el centro en (0,0): cimera de crin, visera que brilla y gola. */
function helm(k: Kit, plume: boolean) {
  const shell = 'M0 -30C10.4 -30 17.6 -24.4 18.6 -13L19.4 10C19.6 16.4 16 20.4 10 22.4L0 25.6L-10 22.4C-16 20.4 -19.6 16.4 -19.4 10L-18.6 -13C-17.6 -24.4 -10.4 -30 0 -30Z'
  const band = 'M-18.7 -12.2C-8 -15 8 -15 18.7 -12.2L18.9 -7.4C8 -10 -8 -10 -18.9 -7.4Z'
  const slit = 'M-15.8 -2.8C-6 -4.6 6 -4.6 15.8 -2.8L15.7 .8C6 -.8 -6 -.8 -15.7 .8Z'
  const keel = 'M-1.7 -29.8C-.6 -30.1 .6 -30.1 1.7 -29.8L1.9 25H-1.9Z'
  const gorget = 'M-13 20.6C-6 24.4 6 24.4 13 20.6L21.4 28.4C11 33 -11 33 -21.4 28.4Z'
  const holes = [-1, 1].map((s) => Array.from({ length: 9 }, (_, i) => {
    const r = Math.floor(i / 3), c = i % 3
    return `<circle cx="${f(s * (7 + c * 2.6 + r * 0.4))}" cy="${f(6.4 + r * 3 + c * 0.6)}" r=".75" fill="${P.night}"/><circle cx="${f(s * (7 + c * 2.6 + r * 0.4) + 0.25)}" cy="${f(6.4 + r * 3 + c * 0.6 + 0.3)}" r=".35" fill="${P.sky}" opacity=".6"/>`
  }).join('')).join('')
  const rivets = Array.from({ length: 9 }, (_, i) => {
    const x = -16 + i * 4, y = -10.4 - Math.cos((x / 19) * 1.3) * 2.4 + 1.4
    return `<circle cx="${f(x)}" cy="${f(y)}" r=".75" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`
  }).join('')
  const plumeD = [
    [0, -31, 3, -40, 16, -38, 4.6, 1.2, TEAL_D],
    [0, -31, 7, -39, 21, -31, 4.2, 1, TEAL],
    [0, -31, 8, -35, 21, -23, 3.6, 0.8, TEAL_D],
    [0, -31, 1, -38, 10, -40, 3.2, 0.8, TEAL],
  ] as const
  return (
    (plume ? plumeD.map(([x0, y0, cx, cy, x1, y1, w0, w1, c]) => k.draw([{ d: taper(x0, y0, cx, cy, x1, y1, w0, w1), fill: c }], 0.5)).join('') +
      hair(1, -33, 4, -39, 15, -37.6, 0.5, TEAL_XL) + hair(2, -32, 8, -37.6, 20, -30.6, 0.45, TEAL_L) + hair(1.4, -32, 8, -34, 19.6, -24, 0.4, TEAL_L) + hair(1.4, -34, 2.6, -38, 9, -39.2, 0.4, TEAL_XL) +
      hair(4, -34, 9, -37, 14, -35, 0.35, TEAL_K) + hair(5, -32.6, 12, -33.4, 17, -27, 0.35, TEAL_K) : '') +
    k.draw([
      { d: gorget, fill: P.mid, inner: k.sh(gorget, 0, 0, 1, 1, 0, 0.9, P.night, 0.45) + `<path d="M-16.4 24.6C-6 28 6 28 16.4 24.6" fill="none" stroke="${P.night}" stroke-width=".5"/><path d="M-15 23.4C-6 26.6 6 26.6 15 23.4" fill="none" stroke="${P.sky}" stroke-width=".4" opacity=".7"/>` },
      {
        d: shell, fill: P.sky1,
        inner:
          k.sh('M2 -32H22V28H2Z', 0, 0, 1, 0, 0, 0.95, P.mid, 0.45) + `<path d="M-22 -32H-6V28H-22Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          k.sh('M-22 12H22V28H-22Z', 0, 0, 0, 1, 0, 0.7, P.mid, 0.35) +
          hair(-13, -24, -16, -16, -15.6, -6, 0.7, '#fff') + hair(14, -6, 16.6, 4, 15, 16, 0.6, P.mid) + hair(-14.6, 4, -15.6, 10, -13, 17, 0.5, P.blue) + holes +
          `<path d="M17.6 -20C18.6 -12 19.2 0 18.6 12" fill="none" stroke="${P.sky}" stroke-width=".6" opacity=".8"/>` +
          [-1, 1].map((sx) => `<g transform="scale(${sx} 1)"><path d="M-2.6 -15.6C-4 -20.6 -9 -22.4 -12 -19.6C-14 -17.6 -12.6 -14.8 -10.2 -15.4C-8.6 -15.8 -8.6 -17.8 -10 -18M-2.6 -15.6C-3.6 -18 -6 -18.4 -7 -17" fill="none" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>` +
            `<path d="M-2.6 -24.4C-5 -26.4 -8.4 -26 -9.6 -24" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round"/><circle cx="-10" cy="-18" r=".5" fill="${P.gold}"/></g>`).join(''),
      },
    ], 0.8) +
    `<path d="M-19.4 10C-19.6 16.4 -16 20.4 -10 22.4L0 25.6L10 22.4C16 20.4 19.6 16.4 19.4 10" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linejoin="round"/>` +
    `<path d="M-19.4 10C-19.6 16.4 -16 20.4 -10 22.4L0 25.6L10 22.4C16 20.4 19.6 16.4 19.4 10" fill="none" stroke="${P.gold}" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<path d="M-19 11C-19 16 -15.6 19.6 -10 21.6L0 24.6" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` +
    k.draw([{ d: keel, fill: P.sky2, inner: `<path d="M-1.9 -30H0V26H-1.9Z" fill="#fff" opacity=".7"/>` + k.sh(keel, 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) }], 0.35) +
    k.draw([{ d: band, fill: P.gold, inner: k.sh(band, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-18 -11.2C-8 -13.8 8 -13.8 18 -11.2" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` }], 0.4) + rivets +
    `<path d="${slit}" fill="${TEAL_K}" stroke="${P.ink}" stroke-width=".6"/>` +
    `<path d="M-14 -1.2C-5 -2.6 5 -2.6 14 -1.2" fill="none" stroke="${TEAL_L}" stroke-width="1.2" stroke-linecap="round"/><path d="M-12 -1.4C-5 -2.4 5 -2.4 12 -1.4" fill="none" stroke="${TEAL_XL}" stroke-width=".45" stroke-linecap="round"/>` +
    (plume ? `<path d="M-2.6 -30.4H2.6L1.8 -33.4H-1.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` : '')
  )
}

/** Cabeza de serpiente cornuda de perfil hacia la izquierda, con la boca abierta y el cuello en (0,0). */
function wyrmHead(k: Kit) {
  const skull = 'M12 -6C8 -13 -2 -16 -12 -14C-18 -12.6 -24 -9.6 -28 -5.6C-30 -3.6 -29.6 -1 -27.4 -.4C-20 1.4 -10 2 -2 2.4C5 2.8 11 1 13 -2C13.6 -3.4 13 -4.8 12 -6Z'
  const jaw = 'M-2 3C-10 5 -18 9.4 -23.6 13.4C-25 14.6 -24 16.4 -22 16C-14 14.4 -5 12.6 3 11.6C9 10.8 12.6 7.6 11.6 4C7 2.8 2 2.6 -2 3Z'
  const mouth = 'M-27.4 -.4C-18 1.6 -8 2.2 -1 2.8C-9 4.4 -17 8.4 -23.2 12.8C-23 8 -24.8 3 -27.4 -.4Z'
  const horn = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w: number) => {
    const d = taper(x0, y0, cx, cy, x1, y1, w, 0.5)
    return k.draw([{ d, fill: P.goldL, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + Array.from({ length: 5 }, (_, i) => { const p = along(x0, y0, cx, cy, x1, y1, [0.12 + i * 0.15])[0], l = Math.hypot(p.dx, p.dy), nx = -p.dy / l, ny = p.dx / l, ww = (w * (1 - (0.12 + i * 0.15)) + 0.5) / 2; return `<path d="M${f(p.x - nx * ww)} ${f(p.y - ny * ww)}L${f(p.x + nx * ww)} ${f(p.y + ny * ww)}" stroke="${P.goldD}" stroke-width=".4"/>` }).join('') }], 0.55)
  }
  const teethUp = Array.from({ length: 6 }, (_, i) => { const x = -25.6 + i * 3.8; return `M${f(x)} ${f(-0.2 + i * 0.4)}L${f(x + 1)} ${f(2.8 + i * 0.3)}L${f(x + 2)} ${f(0 + i * 0.4)}Z` }).join('')
  const teethDn = Array.from({ length: 5 }, (_, i) => { const x = -21.4 + i * 4; return `M${f(x)} ${f(13.4 - i * 0.7)}L${f(x + 1.1)} ${f(10.4 - i * 0.6)}L${f(x + 2.2)} ${f(13 - i * 0.7)}Z` }).join('')
  const plates = Array.from({ length: 5 }, (_, i) => hair(-24 + i * 5.6, -8.6 + (i < 2 ? 2 - i : 0) * 1.4 - i * 1.1, -22.6 + i * 5.6, -6 - i * 1.1, -22 + i * 5.6, -3 - i * 0.6, 0.45, VIO_D)).join('')
  return (
    horn(4, -12, 10, -26, 24, -32, 5.4) + horn(10, -8, 20, -16, 32, -14, 4.4) +
    k.draw([{ d: jaw, fill: VIO, inner: k.sh(jaw, 0, 0, 0, 1, 0, 0.95, VIO_D, 0.5) + `<path d="M-20 14.6C-12 12.6 -4 11.4 6 10.6V13H-20Z" fill="${P.goldL}" opacity=".85"/>` + hair(-18, 12, -8, 10, 6, 8.6, 0.45, VIO_D) }], 0.75) +
    `<path d="${mouth}" fill="${VIO_D}"/>` + k.shade(mouth, k.lin(P.wine, 0, 0, 1, 0, 0.9, 0.2), P.wine, 0.4) +
    `<path d="${teethUp}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><path d="${teethDn}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
    k.draw([{
      d: skull, fill: VIO,
      inner: k.sh(skull, 0, 0, 0, 1, 0.05, 0.95, VIO_D, 0.5) + `<path d="M-30 -18H14V-7C4 -10 -14 -9 -30 -3Z" fill="${k.lin(VIO_L, 0, 0, 0, 1, 0.7, 0)}"/>` + plates +
        hair(-26, -2.6, -18, -1.4, -8, -1, 0.45, VIO_D) + hair(-2, -12, 4, -11, 9, -7, 0.45, VIO_D),
    }], 0.75) +
    horn(-6, -12, -2, -24, 8, -30, 4.6) +
    `<path d="M-19 -9.4C-15 -12.4 -9 -12.8 -6 -11C-9.6 -9.8 -13.4 -8.8 -16.6 -7.6Z" fill="${VIO_D}" stroke="${P.ink}" stroke-width=".35"/>` +
    `<ellipse cx="-12.4" cy="-6.6" rx="2.6" ry="1.5" fill="${TEAL_XL}" stroke="${P.ink}" stroke-width=".55" transform="rotate(-10 -12.4 -6.6)"/><path d="M-12.4 -7.9V-5.3" stroke="${P.ink}" stroke-width=".85" stroke-linecap="round"/><circle cx="-13.5" cy="-7.1" r=".4" fill="#fff"/>` +
    `<path d="M-26.4 -4.4c.6 -.7 1.6 -.8 2.2 -.3" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linecap="round"/>`
  )
}

export const TCG_RIFTBOUND_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Invocador ──────────────────────────────────────────────────────

  // Tres ganadas: tu primera runa ya brilla. La piedra parada con el signo tallado que se enciende.
  'Runa': (u) => {
    const k = kit(u)
    const stone =
      'M55 30.6C58.6 29.4 64.4 29.6 68.2 31.6C72.6 34 75.6 38.6 76.8 44.4L78.6 53.6C79.6 59 79.4 66 78 72.4L76 81.4C75.4 84.4 72.6 86.4 68.6 86.8' +
      'C62.6 87.6 55.6 87.6 50.4 86.6C46.6 85.8 44.4 83.4 43.8 80L42 70.4C41 64.6 41.2 57.8 42.2 52L44 42.8C45.2 36.6 49.6 32.4 55 30.6Z'
    const chipTop = 'M64 30.2C68.4 31 72.4 33.6 74.8 37.6L70.4 39.4C68.6 36.4 66.2 34.2 62.6 33.2Z'
    const chipL = 'M42.4 51.2L44 42.8L47.4 45.6L46.2 55Z'
    const chipR = 'M78.6 53.6C79.6 59 79.4 66 78 72.4L74.6 68.6C75.6 63.6 75.6 59.4 74.8 56.2Z'
    const glyph = 'M60 41.4V78.6M52.2 60L60 50.8L67.8 60L60 69.2ZM54.4 44.8L60 48.8L65.6 44.8M54.4 75.2L60 71.2L65.6 75.2'
    const specks = [[47, 44, 0.5], [72, 46, 0.45], [49, 72, 0.5], [70, 76, 0.6], [45, 62, 0.4], [74, 64, 0.5], [53, 37, 0.35], [66, 82, 0.45], [56, 81, 0.4], [70, 52, 0.35], [48, 52, 0.35]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.mid}" opacity=".5"/>`).join('')
    const pebble = (x: number, y: number, s: number) => {
      const d = `M${f(x - 3 * s)} ${y}C${f(x - 3 * s)} ${f(y - 2.2 * s)} ${f(x + 2.6 * s)} ${f(y - 2.6 * s)} ${f(x + 3.2 * s)} ${y}Z`
      return k.draw([{ d, fill: P.sky1, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) }], 0.45)
    }
    return (
      rift(k) +
      k.sun(60, 58, 16, 44, 32, false) +
      glow(k, 60, 60, 30, 34, TEAL_L, 0.9) +
      k.floor(60, 91, 18, 2.6, P.mid) + glow(k, 60, 90, 16, 3.6, TEAL_L, 0.9) +
      `<g transform="translate(60 58) rotate(-9) scale(.92) translate(-60 -62)">` +
      k.draw([{
        d: stone, fill: P.sky1,
        inner:
          k.sh(stone, 0, 0, 1, 0.3, 0.05, 0.85, P.sky2, 0.5) + k.sh('M64 28H82V90H64Z', 0, 0, 1, 0, 0, 0.75, P.mid, 0.35) +
          `<path d="M38 28H53V90H38Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          k.sh('M38 72H82V90H38Z', 0, 0, 0, 1, 0, 0.75, P.mid, 0.3) +
          `<path d="${chipTop}" fill="${P.white}"/>` + `<path d="${chipL}" fill="${P.white}" opacity=".8"/>` + `<path d="${chipR}" fill="${P.blue}" opacity=".55"/>` +
          `<path d="M62.6 33.2C66.2 34.2 68.6 36.4 70.4 39.4L74.8 37.6M47.4 45.6L46.2 55M74.8 56.2C75.6 59.4 75.6 63.6 74.6 68.6" fill="none" stroke="${P.mid}" stroke-width=".45"/>` +
          glow(k, 60, 60, 13, 22, TEAL_L, 0.95) +
          hair(44.6, 60, 47.4, 57, 51, 57.4, 0.45, P.blue) + hair(68, 47, 71, 45.6, 74.4, 46.6, 0.45, P.mid) + hair(43.6, 72, 47, 70.4, 50.6, 71, 0.4, P.blue) +
          hair(70, 72, 73.6, 70.4, 76.6, 72, 0.45, P.mid) + hair(48, 82, 54, 84.6, 61, 84.2, 0.45, P.mid) + hair(64.6, 83.6, 69, 84.2, 73.4, 82.6, 0.4, P.mid) +
          hair(72.4, 41, 70.6, 45, 71.6, 49.4, 0.45, P.mid) + hair(71.6, 49.4, 73.6, 52.6, 72.6, 56, 0.4, P.mid) +
          hair(49.4, 36.6, 52.4, 33.4, 57, 32.2, 0.7, '#fff') + hair(44.8, 47, 44.2, 52, 44.6, 57, 0.5, '#fff') + specks +
          Array.from({ length: 7 }, (_, i) => hair(71.4 + i * 1.1, 46 + i * 1.6, 75 + i * 0.5, 62, 71 + i * 0.7, 80 - i * 1.2, 0.35, P.mid, 0.75)).join(''),
      }], 0.85) +
      runeLine(glyph) +
      glow(k, 60, 60, 5, 5, '#ffffff', 0.9) + `</g>` +
      pebble(38.6, 80, 0.8) + pebble(82.6, 76, 0.65) + pebble(31.6, 60, 0.5) +
      hair(53, 86.6, 54, 89, 53.4, 91.4, 0.45, TEAL) + hair(67, 86.6, 66, 89, 66.6, 91.4, 0.45, TEAL) + hair(60, 87.6, 60.4, 89.6, 60, 92, 0.4, TEAL) +
      sparkle(37, 46, 2, TEAL_L) + sparkle(84, 40, 1.6, TEAL_L) + sparkle(83, 70, 1.4, '#fff') + sparkle(35, 68, 1.2, '#fff') +
      k.defs()
    )
  },

  // Quince ganadas: defendés el cristal como si fuera tu casa. El cristal flota sobre el felpudo de "hogar".
  'Nexo': (u) => {
    const k = kit(u)
    const mat = 'M43.4 80.6H76.6L82.4 91.4H37.6Z'
    const matIn = 'M45.6 82.4H74.4L78.4 89.6H41.6Z'
    const fringe = Array.from({ length: 22 }, (_, i) => { const x = 38.6 + i * 2.04; return `M${f(x)} 91.4l${f((x - 60) * 0.02)} 1.4` }).join('')
    const border = Array.from({ length: 2 }, (_, r) => {
      const y = r ? 90.5 : 81.5, t = (y - 80.6) / 10.8, xl = 43.4 - 5.8 * t, xr = 76.6 + 5.8 * t
      return Array.from({ length: 16 }, (_, i) => { const x = xl + ((xr - xl) * (i + 0.5)) / 16; return `M${f(x)} ${f(y - 0.6)}l${f((x - 60) * 0.02)} 1.2` }).join('')
    }).join('')
    return (
      rift(k) +
      k.sun(60, 48, 14, 44, 32, false) +
      glow(k, 60, 50, 26, 32, TEAL_L, 0.95) +
      k.draw([{
        d: mat, fill: P.brown,
        inner: `<path d="${matIn}" fill="${P.goldL}"/>` + k.sh(matIn, 0, 0, 1, 1, 0, 0.6, P.brown, 0.35) + `<path d="${border}" stroke="${P.brownD}" stroke-width=".4"/>` +
          k.sh(mat, 0, 0, 1, 1, 0, 0.6, P.brownD, 0.3) + `<path d="${matIn}" fill="none" stroke="${P.brownD}" stroke-width=".45"/>`,
      }], 0.6) +
      `<path d="${fringe}" stroke="${P.brownD}" stroke-width=".45" stroke-linecap="round"/>` +
      k.floor(60, 84.4, 11, 1.8, P.brownD) +
      `<text x="60" y="88.4" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="5.4" fill="${P.wine}" text-anchor="middle">hogar</text>` +
      ring(k, 60, 54, 20, 4.4, false) +
      `<g transform="translate(43.4 61) rotate(-22)">` + crystal(k, 7.6, -12, -7.6, 5, 9.6, 0.8, 0.45) + `</g>` +
      `<g transform="translate(77 63) rotate(20)">` + crystal(k, 7, -11, -7, 4.4, 8.8, 0.8, 0.45) + `</g>` +
      `<g transform="translate(60 0)">` + crystal(k, 20, 21, 32, 60, 74, 1.8, 0.75) + `</g>` +
      ring(k, 60, 54, 20, 4.4, true) +
      sparkle(55.6, 27.6, 2.2, '#fff') + sparkle(86, 36, 1.8, TEAL_L) + sparkle(33, 44, 1.6, TEAL_L) +
      k.defs()
    )
  },

  // Cuarenta ganadas: te sabés cada arbusto del mapa. El mapa enrollado de la grieta, con su río y sus matas.
  'Grieta del Invocador': (u) => {
    const k = kit(u)
    const sheet = 'M-24 -20H24V20H-24Z'
    const river = 'M-27 -21C-17 -16 -9 -8 -2 -2C5 4 12 13 27 21'
    const bush = (x: number, y: number, s = 1) => {
      const d = 'M-2.8 1.2C-3.6 -.4 -2.6 -2 -1.2 -1.8C-.8 -3.2 1.4 -3.4 2 -1.8C3.4 -1.8 3.8 .4 2.8 1.2Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.green, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.5) + `<circle cx="-1.2" cy="-1" r=".5" fill="${P.goldL}" opacity=".7"/>` }], 0.35) + `</g>`
    }
    const roll = (y: number) => {
      const d = roundRect(-26.4, y - 3.1, 26.4, y + 3.1, 3.1)
      const end = (x: number, sx: number) =>
        `<g transform="translate(${x} ${y}) scale(${sx} 1)">` +
        `<path d="M0 -1.1H3.4V1.1H0Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".4"/>` +
        k.draw([{ d: 'M3.2 -2.2C3.2 -3 4 -3.4 4.8 -3.4C6.8 -3.4 7.8 -1.8 7.8 0C7.8 1.8 6.8 3.4 4.8 3.4C4 3.4 3.2 3 3.2 2.2Z', fill: P.gold, inner: k.sh('M3 -4H8V4H3Z', 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M5.2 -3.1V3.1" stroke="${P.goldD}" stroke-width=".4"/><circle cx="6.2" cy="-1.2" r=".55" fill="#fff"/>` }], 0.4) +
        `<circle cx="8.7" cy="0" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/></g>`
      return end(-26.4, -1) + end(26.4, 1) +
        k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0.15, 0.85, P.goldD, 0.4) + `<path d="M-26 ${f(y - 1.5)}H26" stroke="#fff" stroke-width=".8"/>` + hair(-20, y + 1.5, 0, y + 2.2, 20, y + 1.5, 0.4, P.goldD) }], 0.6) +
        `<ellipse cx="-26.4" cy="${y}" rx="1.3" ry="3.1" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="26.4" cy="${y}" rx="1.3" ry="3.1" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="M26.4 ${f(y - 2)}a.9 2 0 1 1 -.1 0M-26.4 ${f(y - 2)}a.9 2 0 1 0 .1 0" fill="none" stroke="${P.goldD}" stroke-width=".3"/>`
    }
    const seal = (x: number, y: number) => {
      const tail = (sx: number) => { const d = 'M0 0L3.6 9.6L1.8 9L1 11.4L-1.4 1.4Z'; return `<g transform="translate(${x} ${y}) scale(${sx} 1) rotate(-10)">` + k.draw([{ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.4) + `</g>` }
      const blob = 'M0 -4.4C1.6 -4.8 3.4 -3.8 4 -2.4C4.8 -.8 4.6 1.6 3.4 3C2.2 4.6 -.4 4.8 -2 4C-3.8 3.2 -4.8 1.2 -4.4 -.8C-4 -2.8 -2 -4 0 -4.4Z'
      return tail(-1) + tail(1) +
        `<g transform="translate(${x} ${y})">` + k.draw([{ d: blob, fill: P.red, inner: k.sh(blob, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) }], 0.5) +
        `<circle cx="0" cy="0" r="2.6" fill="none" stroke="${P.wine}" stroke-width=".5"/><path d="${starPath(0, 0, 1.8, 0.6, 4)}" fill="${P.wine}"/><path d="M-2.6 -2.2C-1.6 -3.2 0 -3.4 1 -3.2" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-linecap="round"/></g>`
    }
    const lanes = 'M-18 14V-14H18M-18 14H18V-14M-18 14L18 -14'
    const base = (x: number, y: number, c: string, cd: string) =>
      `<circle cx="${x}" cy="${y}" r="4" fill="${c}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${x}" cy="${y}" r="2.8" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` +
      `<path d="${starPath(x, y, 2.2, 0.8, 4)}" fill="${P.goldL}" stroke="${cd}" stroke-width=".25"/>`
    return (
      rift(k) +
      k.sun(60, 58, 16, 48, 32, false) +
      glow(k, 60, 58, 32, 30, P.goldL, 0.75) +
      `<g transform="translate(60 57) rotate(-4) scale(.88)">` +
      k.cast([sheet], 2.4, 2.4, P.mid) +
      k.draw([{
        d: sheet, fill: P.white,
        inner:
          `<path d="${sheet}" fill="${P.green}" opacity=".3"/>` + k.sh(sheet, 0, 0, 1, 1, 0, 0.5, P.goldD, 0.3) +
          `<path d="${river}" fill="none" stroke="${TEAL_D}" stroke-width="7.4"/><path d="${river}" fill="none" stroke="${TEAL}" stroke-width="6"/><path d="${river}" fill="none" stroke="${TEAL_L}" stroke-width="2.4" transform="translate(-.6 -.6)"/>` +
          hair(-16, -15, -12, -12, -9, -10.6, 0.4, '#fff') + hair(5, 3.6, 9, 7, 12, 9, 0.4, '#fff') + hair(14, 11.4, 17, 14, 21, 16, 0.4, '#fff') +
          `<path d="${lanes}" fill="none" stroke="${P.brownD}" stroke-width="2.6" stroke-linejoin="round"/><path d="${lanes}" fill="none" stroke="${P.goldL}" stroke-width="1.6" stroke-linejoin="round"/>` +
          `<path d="${lanes}" fill="none" stroke="${P.brown}" stroke-width=".35" stroke-dasharray="1 1.2"/>` +
          bush(-12, -3) + bush(-7, -9.4, 0.9) + bush(-2.6, -6.4, 0.8) + bush(12, 3.4) + bush(7, 9.6, 0.9) + bush(2.4, 6.4, 0.8) + bush(-12.4, 7.4, 0.8) + bush(12.4, -7.4, 0.8) +
          base(-18, 14, TEAL, TEAL_D) + base(18, -14, P.red, P.wine) +
          `<path d="${starPath(0, 0, 3.4, 1.1, 8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="0" cy="0" r=".8" fill="${P.red}"/>` +
          `<path d="M-23 -20V20M23 -20V20" stroke="${P.brownD}" stroke-width=".5"/><path d="M-21.8 -20V20M21.8 -20V20" stroke="${P.brownD}" stroke-width=".3" stroke-dasharray=".01 1" stroke-linecap="round"/>` +
          k.sh('M-25 14H25V21H-25Z', 0, 0, 0, 1, 0, 0.6, P.brownD, 0.3) + k.sh('M-25 -21H25V-14H-25Z', 0, 1, 0, 0, 0, 0.6, P.brownD, 0.3),
      }], 0.6) +
      roll(-21.4) + roll(21.4) + seal(0, 25.4) +
      `</g>` +
      sparkle(88, 32, 2.4, '#fff') + sparkle(32, 36, 1.8) + sparkle(90, 80, 1.4, TEAL_L) +
      k.defs()
    )
  },

  // ── Conquistador ───────────────────────────────────────────────────

  // Diez conquistas: la primera torre cayó en tu turno. La torre de piedra se parte y la cabeza se viene abajo.
  'Torreta': (u) => {
    const k = kit(u)
    const lower = 'M48 88L50.4 62L53 64.4L55.4 61.6L58.6 64L61.4 60.8L64.6 63.2L67 60.4L69.6 62L72 88Z'
    const upper = 'M50.4 62L52.4 44H51.6L49.6 39.6H46.4V30.6H50V25.6H55V30.6H58V25.6H62V30.6H65V25.6H70V30.6H73.6V39.6H70.4L68.4 44L69.6 62L67 60.4L64.6 63.2L61.4 60.8L58.6 64L55.4 61.6L53 64.4Z'
    const block = (x: number, y: number, r: number, s: number) => {
      const d = 'M-2.4 -1.6H2.4V1.6H-2.4Z'
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.sky1, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) }], 0.45 / s) + `</g>`
    }
    const cloud = (x: number, y: number, s: number, flip = 1) => {
      const d = 'M-6 1.6C-7.6 1.6 -8 -1 -6.2 -1.6C-6.4 -3.6 -4 -4.6 -2.6 -3.2C-2 -5.4 1.6 -5.6 2.4 -3.4C4 -4.4 6.4 -3 5.6 -1C7.4 -.6 7.4 1.6 5.6 1.6Z'
      return `<g transform="translate(${x} ${y}) scale(${f(s * flip)} ${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0.1, 0.8, P.sky2, 0.45) + hair(-4, -1, -1, -2.6, 2, -1.4, 0.35, P.sky2) }], f(0.45 / s)) + `</g>`
    }
    const stoneInner = (x0: number, x1: number, y0: number, y1: number) =>
      k.sh(`M60 ${y0}H${x1}V${y1}H60Z`, 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + `<path d="M${x0} ${y0}H54V${y1}H${x0}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + masonry(x0, x1, y0, y1)
    return (
      rift(k) +
      k.sun(58, 50, 15, 44, 32, false) +
      k.floor(58, 88, 22, 3.4, P.mid) +
      `<g transform="translate(54 88) scale(.88) translate(-60 -88)">` +
      k.draw([{ d: lower, fill: P.sky1, inner: stoneInner(46, 74, 60, 88) + k.sh('M46 78H74V90H46Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) + hair(52, 66, 54, 72, 52.4, 78, 0.45, P.mid) + hair(64, 64, 63, 68, 65, 72, 0.4, P.mid) }], 0.8) +
      `<g transform="translate(2 -3) rotate(13 69.6 62)">` +
      k.cast([upper], 1.6, 2, P.mid) +
      k.draw([{
        d: upper, fill: P.sky1,
        inner: stoneInner(44, 76, 24, 66) + `<path d="M46 39.6H74V42H46Z" fill="${P.blue}" opacity=".5"/>` +
          `<path d="M46.4 30.6H73.6" stroke="${P.mid}" stroke-width=".5"/>` + hair(66, 46, 64.6, 52, 66.4, 58, 0.45, P.mid),
      }], 0.8) +
      `<path d="M57.4 50.6C57.4 48.4 62.6 48.4 62.6 50.6V57H57.4Z" fill="${TEAL_K}" stroke="${P.ink}" stroke-width=".5"/>` +
      glow(k, 60, 52.4, 6, 7, TEAL_L, 0.9) +
      `<circle cx="60" cy="52.4" r="1.6" fill="${TEAL_XL}" stroke="${TEAL}" stroke-width=".5"/>` +
      `</g>` +
      `</g>` +
      block(80, 52, 24, 1) + block(85, 64, -18, 0.85) + block(78.6, 76, 40, 0.9) + block(38.6, 76, -12, 0.7) +
      cloud(40, 86.4, 1.1) + cloud(77.6, 86.8, 1, -1) + cloud(46.6, 61.6, 0.5) + cloud(70, 60, 0.55, -1) +
      hair(82, 40, 86, 44, 87, 50, 0.6, P.mid) + hair(86, 40, 90, 46, 90.6, 52, 0.45, P.mid) +
      sparkle(36, 38, 2, '#fff') + sparkle(30, 62, 1.4, TEAL_L) +
      k.defs()
    )
  },

  // Cuarenta conquistas: ya salen súper súbditos de tu lado. El yelmo enorme al lado del de un súbdito común.
  'Inhibidor': (u) => {
    const k = kit(u)
    return (
      rift(k) +
      k.sun(62, 56, 16, 46, 32, false) +
      glow(k, 62, 58, 28, 30, TEAL_L, 0.8) +
      k.floor(62, 92.4, 24, 3.2, P.mid) + k.floor(33.6, 87, 7, 1.4, P.mid) +
      `<g transform="translate(63 62) scale(.92)">` + k.cast(['M0 -30C10.4 -30 17.6 -24.4 18.6 -13L19.4 10C19.6 16.4 16 20.4 10 22.4L0 25.6L-10 22.4C-16 20.4 -19.6 16.4 -19.4 10L-18.6 -13C-17.6 -24.4 -10.4 -30 0 -30Z'], 2.4, 2) + helm(k, true) + `</g>` +
      `<g transform="translate(33.6 78.6) scale(.27)">` + helm(k, false) + `</g>` +
      sparkle(32, 50, 2, TEAL_L) + sparkle(92, 70, 1.6, '#fff') +
      k.defs()
    )
  },

  // Ciento veinte conquistas: le robaste el Barón a todo el grupo. La bestia sale del foso y el rayo la alcanza.
  'Barón Nashor': (u) => {
    const k = kit(u)
    const x0 = 72, y0 = 94, cx = 92, cy = 62, x1 = 63, y1 = 47, w0 = 18, w1 = 12.4
    const at = (ts: number[]) => along(x0, y0, cx, cy, x1, y1, ts).map((p, i) => {
      const l = Math.hypot(p.dx, p.dy), tx = p.dx / l, ty = p.dy / l
      return { x: p.x, y: p.y, tx, ty, nx: -ty, ny: tx, w: (w0 + (w1 - w0) * ts[i]) / 2 }
    })
    const body = taper(x0, y0, cx, cy, x1, y1, w0, w1)
    const N = 16, ts = Array.from({ length: N + 1 }, (_, i) => 0.04 + (i / N) * 0.92), pts = at(ts)
    const belly = `M${pts.map((p) => `${f(p.x - p.nx * p.w)} ${f(p.y - p.ny * p.w)}`).join('L')}L${pts.reverse().map((p) => `${f(p.x - p.nx * (p.w - 4.2))} ${f(p.y - p.ny * (p.w - 4.2))}`).join('L')}Z`
    const rings = at([0.12, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.9]).map((p) =>
      `<path d="M${f(p.x - p.nx * p.w)} ${f(p.y - p.ny * p.w)}Q${f(p.x + p.tx * 2.2)} ${f(p.y + p.ty * 2.2)} ${f(p.x + p.nx * p.w)} ${f(p.y + p.ny * p.w)}" fill="none" stroke="${VIO_D}" stroke-width=".65"/>`).join('')
    const spikes = at([0.16, 0.28, 0.4, 0.52, 0.64, 0.76, 0.88]).map((p, i) => {
      const a = (Math.atan2(p.ny, p.nx) * 180) / Math.PI + 28
      return `<path d="M0 -2.4C2.6 -2 5.4 -.6 7.2 1.8C4.6 1.2 2 1.4 0 2.4Z" transform="translate(${f(p.x + p.nx * (p.w - 1))} ${f(p.y + p.ny * (p.w - 1))}) rotate(${f(a)}) scale(${f(1.15 - i * 0.06)})"/>`
    }).join('')
    const pit = ellipse(68, 91, 23, 5.6)
    const rock = (x: number, y: number, s: number, r: number) => {
      const d = 'M-3.4 1.6L-2.8 -1.4L-.6 -2.8L2.4 -2.2L3.6 .4L2.6 1.8Z'
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.sky2, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) + `<path d="M-2.8 -1.4L-.6 -2.8L2.4 -2.2L.4 -.6Z" fill="${P.white}" opacity=".7"/>` }], f(0.45 / s)) + `</g>`
    }
    const bolt = [[100, 18], [88, 30], [93.6, 31.4], [79, 40], [84, 41.4], [67, 47.6]]
    const boltD = `M${bolt.map((p) => p.join(' ')).join('L')}`
    return (
      rift(k) +
      k.sun(56, 50, 15, 48, 32, false) +
      glow(k, 64, 62, 30, 30, VIO_L, 0.6) +
      `<g transform="translate(64 93) scale(.86) translate(-64 -93)">` +
      k.draw([{ d: pit, fill: VIO_D, inner: k.sh(pit, 0, 0, 0, 1, 0.9, 0.2, P.night, 0.5) + glow(k, 68, 91, 16, 4.4, TEAL_L, 0.8) }], 0.6) +
      `<g fill="${VIO_D}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round">${spikes}</g>` +
      k.draw([{
        d: body, fill: VIO,
        inner: k.sh(body, 0, 0, 1, 0, 0, 0.95, VIO_D, 0.5) + `<path d="${belly}" fill="${P.goldL}"/>` + k.sh(belly, 0, 0, 1, 1, 0, 0.85, P.goldD, 0.45) + rings +
          hair(x0 + 5, y0 - 12, cx - 3, cy + 3, x1 + 6, y1 + 5, 0.6, VIO_L) + k.sh('M40 84H100V100H40Z', 0, 0, 0, 1, 0, 0.9, P.night, 0.4),
      }], 0.85) +
      rock(47, 92.6, 1.1, -8) + rock(55, 95.6, 1, 12) + rock(64, 96.8, 1.2, -4) + rock(74.4, 96.6, 1, 16) + rock(83, 95, 1.15, -10) + rock(89.6, 91.6, 0.9, 6) +
      `<g transform="translate(${x1} ${y1}) rotate(-18) scale(.9)">` + wyrmHead(k) + `</g>` + `</g>` +
      `<path d="${boltD}" fill="none" stroke="${P.ink}" stroke-width="4.2" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="${boltD}" fill="none" stroke="${P.gold}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="${boltD}" fill="none" stroke="#fff" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="${starPath(67, 47.6, 7, 1.5, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` + sparkle(67, 47.6, 3.4, '#fff') +
      hair(72.6, 45.6, 76, 43, 78.6, 39.6, 0.5, P.goldD) + hair(71, 51.6, 75, 52.6, 79, 51, 0.45, P.goldD) +
      sparkle(30, 34, 2, VIO_L) + sparkle(94, 64, 1.6, '#fff') + sparkle(30, 76, 1.4, TEAL_L) +
      k.defs()
    )
  },
}
