// Bádminton: el volante (base de corcho redonda, la cinta y la falda de dieciséis plumas atadas con hilo) y la
// raqueta de marco ovalado, vara finita y encordado en cuadrícula. Las plumas sueltas cuentan los smashes; el árbol
// del patio, la guitarra y el almohadón del emperador ponen el chiste.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { aro, estela, nota, pluma, PLUMA, rotulo, volutas } from './_lote6-piezas'

const HOJA = '#7E9A4C', HOJA_D = '#556E2F', HOJA_L = '#A9BE72'

// ── El volante: el corcho abajo (en y≈4.6), la falda hacia arriba hasta el borde en y=-30 ─────────────────────

const CORK = 'M-5 -3.4V-.6C-5 2.6 -2.8 4.8 0 4.8C2.8 4.8 5 2.6 5 -.6V-3.4Z'
const BAND = roundRect(-5.3, -6, 5.3, -2.8, 0.7)
const RIM_Y = -30, RIM_X = 12, RIM_R = 2.8, BASE_Y = -5.4, BASE_X = 4.6
/** Borde festoneado de la falda: las puntas de las plumas a lo largo de media elipse (arriba: la de atrás). */
function scallops(back: boolean, n = 8) {
  let d = ''
  for (let j = 0; j <= n; j++) {
    const a = Math.PI + (back ? 1 : -1) * (Math.PI * j) / n
    const x = RIM_X * Math.cos(a), y = RIM_Y + RIM_R * Math.sin(a)
    if (j === 0) d += `L${f(x)} ${f(y)}`
    else {
      const am = Math.PI + (back ? 1 : -1) * (Math.PI * (j - 0.5)) / n
      d += `Q${f(RIM_X * 1.04 * Math.cos(am))} ${f(RIM_Y + RIM_R * Math.sin(am) - 2.2)} ${f(x)} ${f(y)}`
    }
  }
  return d
}
const SKIRT = `M${-BASE_X} ${BASE_Y}L${-RIM_X} ${RIM_Y}` + scallops(true).slice(1).replace(/^[^Q]*/, '') + `L${BASE_X} ${BASE_Y}Q0 ${BASE_Y + 1.4} ${-BASE_X} ${BASE_Y}Z`
const FRONT = `M${-BASE_X} ${BASE_Y}L${-RIM_X} ${RIM_Y}` + scallops(false).replace(/^L[^Q]*/, '') + `L${BASE_X} ${BASE_Y}Q0 ${BASE_Y + 1.4} ${-BASE_X} ${BASE_Y}Z`

interface ShuttleOpts {
  /** Color de la cinta. */
  band?: string
  /** Puntas de las plumas teñidas (dorado en el oro). */
  tips?: string
  /** Encima de todo, en coordenadas del volante. */
  top?: string
}

/** Volante entintado con la base del corcho en (x,y), girado `rot` y escalado `s`. */
function shuttle(k: Kit, x: number, y: number, rot: number, s = 1, o: ShuttleOpts = {}) {
  const ribs = Array.from({ length: 9 }, (_, j) => {
    const a = Math.PI * (1 - j / 8)
    const x0 = BASE_X * 0.9 * Math.cos(a), y0 = BASE_Y + 0.7 * Math.sin(a), x1 = RIM_X * Math.cos(a), y1 = RIM_Y + RIM_R * Math.sin(a) + 0.6
    return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="${P.blue}" stroke-width=".4"/>` +
      (j > 0 && j < 8 ? hair(x0 * 0.9 + 0.4, y0 - 4, x1 * 0.6 + 0.3, (y0 + y1) / 2, x1 * 0.92 + 0.5, y1 + 2, 0.5, '#fff', 0.9) : '')
  }).join('')
  const thread = (t: number) => {
    const y = BASE_Y + (RIM_Y - BASE_Y) * t, hw = BASE_X + (RIM_X - BASE_X) * t, ry = 0.7 + (RIM_R - 0.7) * t
    return `M${f(-hw)} ${f(y)}A${f(hw)} ${f(ry)} 0 0 0 ${f(hw)} ${f(y)}`
  }
  const threads = [0.36, 0.56].map((t) => `<path d="${thread(t)}" fill="none" stroke="${P.ink}" stroke-width="1.1"/><path d="${thread(t)}" fill="none" stroke="${o.tips === P.gold ? P.gold : P.sky}" stroke-width=".5"/>`).join('')
  const tips = o.tips ? `<path d="M-14 -36H14V-27.4C6 -25.4 -6 -25.4 -14 -27.4Z" fill="${o.tips}" opacity=".9"/>` : ''
  const opening = ellipse(0, RIM_Y, RIM_X - 0.6, RIM_R - 0.4)
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([{ d: SKIRT, fill: P.white }], f(0.75 / s)) +
    `<path d="${opening}" fill="${P.sky2}"/>` + k.clip(opening, k.sh(opening, 0, 0, 0, 1, 0.9, 0, P.mid, 0.4) + Array.from({ length: 7 }, (_, j) => `<path d="M${f(-9 + j * 3)} ${RIM_Y - 3}L${f(-6 + j * 2)} ${RIM_Y + 3}" stroke="${P.blue}" stroke-width=".35"/>`).join('')) +
    `<path d="${FRONT}" fill="${P.white}"/>` +
    k.clip(FRONT, k.sh(FRONT, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) + `<path d="M-14 -34H-3V-4H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + tips + ribs + threads) +
    `<path d="M${-RIM_X} ${RIM_Y}${scallops(false).replace(/^L[^Q]*/, '')}" fill="none" stroke="${P.ink}" stroke-width="${f(0.5 / s)}" stroke-linejoin="round"/>` +
    k.draw([
      { d: CORK, fill: P.white, inner: k.shade(CORK, k.rad(P.blue, 0.3, 0.2, 0.9, 0, 0.9), P.blue, 0.45) + `<path d="M-3.4 -1.4C-3.4 1 -2.4 2.6 -1 3.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` },
      { d: BAND, fill: o.band ?? P.mid, inner: k.sh(BAND, 0, 0, 1, 0, 0, 0.8, P.ink, 0.4) + `<path d="M-4.6 -4.9H2" stroke="#fff" stroke-width=".5" opacity=".6"/>` },
    ], f(0.6 / s)) +
    (o.top ?? '') +
    `</g>`
  )
}

// ── La raqueta: el mango abajo hasta y=30, la cabeza ovalada centrada en (0,-22) ──────────────────────────────

const HEAD_O = ellipse(0, -22, 9.2, 12.6), HEAD_I = ellipse(0, -22, 7.7, 11.1)
const THROAT = 'M-2.6 -10.4C-1.6 -9.6 -1.2 -8.4 -1 -7H1C1.2 -8.4 1.6 -9.6 2.6 -10.4Z'
const SHAFT = 'M-.9 -7.4H.9L1 13H-1Z'
const GRIP = 'M-2.1 12.4H2.1C2.5 18 2.6 24 2.3 29.4C2.2 30.2 1.6 30.6 1 30.6H-1C-1.6 30.6 -2.2 30.2 -2.3 29.4C-2.6 24 -2.5 18 -2.1 12.4Z'

/** Raqueta entintada con el centro de la cabeza en (x,y). `strings` va recortado al encordado. */
function racket(k: Kit, x: number, y: number, rot: number, s = 1, o: { frame?: string; frameD?: string; grip?: string; strings?: string; over?: string } = {}) {
  const fr = o.frame ?? P.mid, frD = o.frameD ?? P.ink
  let grid = ''
  for (let i = -7; i <= 7; i += 1.55) grid += `M${f(i)} -34V-10`
  for (let j = -33; j <= -11; j += 1.55) grid += `M-8 ${f(j)}H8`
  const wraps = Array.from({ length: 8 }, (_, i) => `M-2.4 ${f(13.4 + i * 2.2)}L2.4 ${f(15.2 + i * 2.2)}`).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(0 22)">` +
    k.draw([
      { d: GRIP, fill: o.grip ?? P.white, inner: k.sh(GRIP, 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) + `<path d="${wraps}" stroke="${P.blue}" stroke-width=".45"/>` + `<path d="M-2.6 28H2.6V31H-2.6Z" fill="${fr}"/>` },
      { d: SHAFT, fill: P.sky1, inner: k.sh(SHAFT, 0, 0, 1, 0, 0, 0.8, P.blue, 0.5) },
      { d: THROAT, fill: fr },
    ], f(0.6 / s)) +
    `<path d="${HEAD_I}" fill="${P.white}" opacity=".18"/>` +
    k.clip(HEAD_I, `<path d="${grid}" stroke="${P.ink}" stroke-width="${f(0.32)}"/><path d="${grid}" stroke="#fff" stroke-width=".14" transform="translate(-.2 -.2)" opacity=".8"/>` + (o.strings ?? '')) +
    aro(k, `${HEAD_O} ${HEAD_I}`, fr,
      k.sh(HEAD_O, 0, 0, 1, 1, 0, 0.9, frD, 0.45) + `<path d="M-8.4 -26C-7.8 -31 -4.6 -34 -.6 -34.2" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".8"/>` +
      `<path d="${ellipse(0, -22, 8.45, 11.85)}" fill="none" stroke="${o.frame === P.gold ? P.goldL : P.sky}" stroke-width=".3" stroke-dasharray=".6 1"/>`, f(0.6 / s)) +
    (o.over ?? '') +
    `</g>`
  )
}

/** Copa de árbol: racimos de hojas entintados con luz arriba a la izquierda. */
function copa(k: Kit, blobs: number[][]) {
  const d = blobs.map(([x, y, r]) => ellipse(x, y, r, r * 0.92)).join('')
  return (
    blobs.map(([x, y, r]) => `<ellipse cx="${f(x + 0.7)}" cy="${f(y + 0.9)}" rx="${f(r + 0.7)}" ry="${f(r * 0.92 + 0.7)}" fill="${P.ink}"/>`).join('') +
    `<path d="${d}" fill="${HOJA}"/>` +
    k.clip(d, k.sh(d, 0, 0, 1, 1, 0, 0.9, HOJA_D, 0.5) + blobs.map(([x, y, r]) => `<ellipse cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.35)}" rx="${f(r * 0.5)}" ry="${f(r * 0.35)}" fill="${HOJA_L}" opacity=".7"/>` +
      hair(x - r * 0.6, y + r * 0.2, x - r * 0.1, y + r * 0.5, x + r * 0.5, y + r * 0.3, 0.6, HOJA_D)).join(''))
  )
}

export const BADMINTON_ART: Record<string, (u: number) => string> = {
  // ── Volante ───────────────────────────────────────────────────────

  // Cinco ganados: el volante ya no se queda en el árbol. Arriba, los dos viejos todavía enganchados; el nuevo cae libre.
  'Volante en el árbol': (u) => {
    const k = kit(u)
    const trunk = 'M14 50C24 46 32 44 40 40C44 38 47 34 48 30L51 31C50 36 47 40 43 43C36 48 26 52 16 56Z'
    const twig = 'M38 41.6C42 42.4 45.6 44.4 48 47.6L46.6 48.6C44.4 45.8 41.2 44 37.6 43.4Z'
    return (
      k.day() +
      k.draw([
        { d: trunk, fill: P.brown, inner: k.sh(trunk, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + hair(18, 51, 28, 47, 40, 41.6, 0.5, P.brownD) },
        { d: twig, fill: P.brown },
      ], 0.6) +
      copa(k, [[34, 31, 11], [50, 25, 12], [66, 28, 11], [78, 37, 8.4], [47, 39, 8], [62, 40, 8]]) +
      shuttle(k, 44, 30, -150, 0.42, {}) +
      shuttle(k, 73, 35.4, 160, 0.38, {}) +
      `<g opacity=".9">` + pluma(k, 30, 58, -40, 7, 2, { s: 1 }) + `</g>` +
      k.floor(70, 95, 12, 2, P.mid) +
      estela(70.4, 54, 0.1, 1, 3, 12, 3.6, P.ink, 0.8) +
      shuttle(k, 70, 90, 8, 1.05, { band: P.red }) +
      sparkle(88, 60, 2) + sparkle(30, 76, 1.5) +
      rotulo(40, 76, 7, '¡libre!', { rot: -8 }) +
      k.defs()
    )
  },

  // Veinte: las cuerdas suenan como guitarra. La raqueta con la boca de guitarra en el encordado y las notas que salen.
  'Raqueta de cuerda': (u) => {
    const k = kit(u)
    const rosette = `<circle cx="0" cy="-22" r="3.6" fill="${P.night}" opacity=".85"/><circle cx="0" cy="-22" r="4.6" fill="none" stroke="${P.goldD}" stroke-width=".8"/><circle cx="0" cy="-22" r="5.4" fill="none" stroke="${P.gold}" stroke-width=".4" stroke-dasharray=".5 .6"/>`
    const vib = (xx: number) => `<path d="M${xx} -33.6Q${xx + 0.9} -28 ${xx} -22T${xx} -10.4" fill="none" stroke="${P.gold}" stroke-width=".4"/><path d="M${xx} -33.6Q${xx - 0.9} -28 ${xx} -22T${xx} -10.4" fill="none" stroke="${P.gold}" stroke-width=".3" opacity=".6"/>`
    return (
      k.day() +
      k.sun(60, 56, 18, 46, 32, true) +
      k.floor(62, 94, 16, 2.2, P.mid) +
      `<g transform="translate(2.4 2.2)">` + `<path d="${ellipse(0, 0, 9.4, 12.8)}" transform="translate(55 50) rotate(-28) scale(1.6)" fill="${P.blue}" opacity=".3"/>` + `</g>` +
      racket(k, 55, 50, -28, 1.6, { strings: rosette + vib(-5.4) + vib(5.4) }) +
      nota(80, 36, 0.95, 12) + nota(84, 58, 0.75, -8, true) + nota(72, 27, 0.6, 18) +
      hair(73, 44, 76, 41, 78, 44, 0.6) + hair(75, 48.4, 79, 46, 81, 49, 0.6) +
      sparkle(34, 34, 2) + sparkle(88, 76, 1.6) +
      k.defs()
    )
  },

  // Cincuenta: "el de Indonesia". El volante coronado, sobre un almohadón rojo y blanco con borlas de oro.
  'Emperador del volante': (u) => {
    const k = kit(u)
    const cushTop = 'M34 78C34 73 42 69.6 60 69.6C78 69.6 86 73 86 78C86 80.4 78 82.4 60 82.4C42 82.4 34 80.4 34 78Z'
    const cushion = 'M32.4 78C32.4 74 42 71 60 71C78 71 87.6 74 87.6 78V83.4C87.6 87 78 89.4 60 89.4C42 89.4 32.4 87 32.4 83.4Z'
    const crown = 'M-11 0L-13.4 -11L-7 -6.4L-3.6 -14.4L0 -7.4L3.6 -14.4L7 -6.4L13.4 -11L11 0Z'
    const crownBand = roundRect(-11.4, -2.8, 11.4, 1.6, 0.6)
    const tassel = (x: number, sx: number) => {
      const t = `M${x} 82.4C${x + sx * 1.2} 84 ${x + sx * 2.2} 86.6 ${x + sx * 1.8} 90H${x + sx * -1.4}C${x + sx * -1.2} 86.6 ${x - sx * 0.4} 84.4 ${x} 82.4Z`
      return k.draw([{ d: t, fill: P.gold, inner: k.sh(t, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) + `<path d="M${x - 0.8} 86.4V89.6M${x + 0.3} 86.4V89.8M${x + 1.2} 86V89.4" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.4) +
        `<circle cx="${x}" cy="82.2" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    }
    return (
      k.night() +
      k.sun(60, 50, 17, 44, 24, false) +
      laurel(46, 100, 26, 90, 25, 56, 7) + laurel(74, 100, 94, 90, 95, 56, 7, true) +
      k.floor(60, 89, 26, 2.6, P.ink) +
      k.draw([{
        d: cushion, fill: P.white,
        inner: `<path d="M20 66H100V80.6C80 83.6 40 83.6 20 80.6Z" fill="${P.red}"/>` + k.sh(cushion, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) +
          k.sh('M20 70H100V84H20Z', 0, 0, 1, 0, 0, 0.8, P.wine, 0.45) +
          `<path d="M32.4 81C42 83.6 78 83.6 87.6 81" fill="none" stroke="${P.gold}" stroke-width="1.1"/><path d="M32.4 81C42 83.6 78 83.6 87.6 81" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".8 .8"/>`,
      }], 0.65) +
      `<path d="${cushTop}" fill="${P.red}"/>` + k.clip(cushTop, k.sh(cushTop, 0, 0, 1, 1, 0, 0.7, P.wine, 0.4) + hair(40, 74.6, 48, 72, 58, 71.8, 0.7, '#fff', 0.5) + hair(62, 77, 70, 78.6, 80, 77.6, 0.6, P.wine)) +
      tassel(36.4, -1) + tassel(83.6, 1) +
      k.floor(60, 77, 9, 1.6, P.wine) +
      shuttle(k, 60, 73.4, 0, 1.0, { band: P.gold, tips: P.goldL }) +
      `<g transform="translate(60 44.6) scale(.9)">` +
      k.draw([
        { d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M-13 -14H-4V2H-13Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` },
        { d: crownBand, fill: P.gold, inner: k.sh(crownBand, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + [-7, 0, 7].map((x) => `<ellipse cx="${x}" cy="-.6" rx="1.5" ry="1.1" fill="${x ? P.sky : P.red}" stroke="${P.ink}" stroke-width=".35"/>`).join('') },
      ], 0.55) +
      [-13.4, -3.6, 3.6, 13.4].map((x) => `<circle cx="${x}" cy="${Math.abs(x) > 10 ? -11.6 : -15}" r="1.2" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      `<path d="${starPath(0, -9.6, 1.8, 0.7, 4)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      volutas(60, 99, 18, 0.5) +
      sparkle(36, 34, 2.4, P.goldL) + sparkle(85, 40, 2, P.goldL) + sparkle(74, 26, 1.4, '#fff') + sparkle(42, 62, 1.2, '#fff') +
      k.defs()
    )
  },

  // ── Smash ─────────────────────────────────────────────────────────

  // Cinco smashes: quedaron plumas por todo el patio. El volante baja en picada y va soltando plumas.
  'Plumas al viento': (u) => {
    const k = kit(u)
    return (
      k.day() +
      `<path d="M14 88C36 84 84 84 106 88V130H14Z" fill="${P.sky1}"/>` + k.sh('M14 84H106V100H14Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
      `<path d="M20 90.4H100" stroke="#fff" stroke-width="1"/>` +
      estela(52, 48, 0.6, 0.8, 5, 22, 3.4, P.mid, 0.9) +
      pluma(k, 34, 46, -60, 10, 2.6) + pluma(k, 84, 34, 30, 9, 2.4) + pluma(k, 40, 82, -100, 8, 2.2) + pluma(k, 88, 72, 70, 9, 2.4) + pluma(k, 48, 28, 10, 7, 2) +
      k.floor(76, 90, 8, 1.4, P.mid) +
      shuttle(k, 72, 74, -38, 1.08, { band: P.red }) +
      hair(80, 82, 84, 84, 88, 83, 0.7) + hair(80, 85, 83, 88, 86, 89, 0.6) +
      rotulo(46, 64, 8, '¡paf!', { rot: -10 }) +
      k.defs()
    )
  },

  // Veinticinco smashes: el volante pide el retiro. Pelado, con tres plumas que le quedan y la bandera blanca.
  'Gallo desplumado': (u) => {
    const k = kit(u)
    const stubs = Array.from({ length: 9 }, (_, j) => {
      const a = Math.PI * (1 - j / 8), x0 = 4.2 * Math.cos(a), x1 = 6.6 * Math.cos(a)
      return `M${f(x0)} -5.4L${f(x1)} -11.4`
    }).join('')
    const flag = 'M0 0C3 -1.4 6 1 9 -.2C11 -1 12.6 -.6 13.6 0L13.6 8.4C12 7.8 10.6 7.6 8.6 8.4C6 9.4 3 7.2 0 8.4Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(58, 89, 20, 2.2, P.mid) +
      pluma(k, 45, 89, -84, 8, 2.2) + pluma(k, 76, 89.4, 88, 7.4, 2.1) +
      `<g transform="translate(57 84) scale(1.7)">` +
      `<path d="${stubs}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${stubs}" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>` +
      `<g transform="translate(-4.2 -6) rotate(-22)">${k.draw([{ d: PLUMA(19, 3.6), fill: P.white, inner: k.sh(PLUMA(19, 3.6), 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) }], 0.45)}<path d="M0 0Q.5 -9 0 -18" fill="none" stroke="${P.ink}" stroke-width=".4"/></g>` +
      `<g transform="translate(3.8 -6) rotate(30)"><g transform="rotate(0)">${k.draw([{ d: 'M0 0C2.6 -3 3.6 -8 3 -11C5.6 -12 9.4 -11 11.6 -8.4C9.4 -9 6.6 -8.6 4.6 -7.2C3.6 -4 2 -1.6 0 0Z', fill: P.white, inner: k.sh('M0 -12H12V0H0Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) }], 0.45)}</g></g>` +
      `</g>` +
      `<g transform="translate(57 84) scale(1.7)">` +
      k.draw([
        { d: CORK, fill: P.white, inner: k.shade(CORK, k.rad(P.blue, 0.3, 0.2, 0.9, 0, 0.9), P.blue, 0.45) },
        { d: BAND, fill: P.mid, inner: k.sh(BAND, 0, 0, 1, 0, 0, 0.8, P.ink, 0.4) },
      ], 0.5) +
      `</g>` +
      `<path d="M66 78L76 42" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M66 78L76 42" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round"/>` +
      `<g transform="translate(75.8 42.6) rotate(8)">` + k.draw([{ d: flag, fill: P.white, inner: k.sh(flag, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + hair(3, 2, 6, 4, 10, 3, 0.5, P.sky2) }], 0.45) + `</g>` +
      `<circle cx="76" cy="41.8" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      rotulo(50, 34, 7, 'me retiro', { rot: -6 }) +
      k.defs()
    )
  },

  // Ochenta smashes: nadie ve llegar el volante. Un rayo de plumas en la noche, con las puntas doradas.
  'Rayo de plumas': (u) => {
    const k = kit(u)
    const bolt = 'M30 20L52 20L44 36L58 36L36 70L42 46L28 46Z'
    return (
      k.night() +
      [[22, 40], [94, 30], [88, 84], [28, 84], [100, 60]].map(([x, y], i) => sparkle(x, y, 1 + (i % 2) * 0.8, P.goldL)).join('') +
      `<g transform="translate(16 16) scale(.8)">` + k.draw([{ d: bolt, fill: P.gold, inner: k.sh(bolt, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M30 20H44L36 36H24Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.6, 0)}"/>` }], 0.7) + `</g>` +
      estela(66, 58, 0.62, 0.78, 5, 20, 3.4, P.goldL, 0.9) +
      shuttle(k, 80, 80, -38, 1.05, { band: P.gold, tips: P.goldL }) +
      `<circle cx="84" cy="84" r="9" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-dasharray="1.2 1.6" opacity=".8"/>` +
      volutas(60, 99, 22, 0.42, P.gold) +
      rotulo(72, 38, 6.6, '¿lo viste?', { rot: -6, c: P.goldL, halo: P.night }) +
      sparkle(66, 44, 2.6, '#fff') + sparkle(92, 66, 1.8, '#fff') +
      k.defs()
    )
  },
}
