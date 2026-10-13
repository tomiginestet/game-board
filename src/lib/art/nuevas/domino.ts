// Dominó: la mesa, la capicúa y el tranque, en clave heroica. Manda el negro carbón de la ficha del juego en el
// catálogo: fichas negras con los puntos de marfil hundidos, la raya del medio y el clavo de bronce.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** El carbón de la ficha del Dominó en el catálogo, con su sombra y su brillo; y el marfil de los puntos. */
const EBONY = '#3D3D3D', EBONY_D = '#1F1F23', EBONY_L = '#6E6E76'
const IVORY = '#F6EFDD', IVORY_D = '#C9BB98'
/** El naranja del cono. */
const CONE = '#E2672B', CONE_D = '#A3421B'
/** El verde del ombú. */
const LEAF = '#6F8F45'

/** Varilla entintada (bastón, caño, pata): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

// ── La ficha ─────────────────────────────────────────────────────────

/** Puntos de media ficha, en unidades de ±1 (la ficha parada; acostada, la girás). */
const PIPS: [number, number][][] = [
  [],
  [[0, 0]],
  [[1, -1], [-1, 1]],
  [[1, -1], [0, 0], [-1, 1]],
  [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
]

const TW = 7.5, TH = 15
/** La cara de la ficha centrada en (0,0): 15 de ancho por 30 de alto. */
const TILE = roundRect(-TW, -TH, TW, TH, 2.2)

/** Un punto de marfil hundido: la sombra adentro arriba a la izquierda y, si `gold`, el aro de bronce. */
const pip = (x: number, y: number, r: number, gold = false) =>
  (gold ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.45)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` : '') +
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${IVORY}" stroke="${EBONY_D}" stroke-width=".3"/>` +
  `<path d="M${f(x - r * 0.8)} ${f(y + r * 0.2)}A${f(r * 0.82)} ${f(r * 0.82)} 0 0 1 ${f(x + r * 0.2)} ${f(y - r * 0.8)}" fill="none" stroke="${IVORY_D}" stroke-width="${f(r * 0.38)}" stroke-linecap="round"/>`

/** Ficha de dominó parada de frente: negra, con el canto a la derecha, el bisel, los puntos `a` (arriba) y `b`
 * (abajo), la raya del medio y el clavo de bronce. `gold` suma el grabado de las medallas altas. */
function tile(k: Kit, a: number, b: number, o: { w?: number; gold?: boolean; edge?: number } = {}) {
  const e = o.edge ?? 2.2, r = 1.55, gap = 4.1
  const side = `M${TW - 1.6} ${-TH + 0.3}C${f(TW + e * 0.5)} ${-TH + 0.5} ${f(TW + e)} ${-TH + 1.6} ${f(TW + e)} ${-TH + 3.2}V${f(TH - 0.6)}C${f(TW + e)} ${f(TH + 0.8)} ${f(TW + e * 0.4)} ${TH + 1.2} ${TW - 1.6} ${TH}Z`
  const half = (n: number, cy: number) => PIPS[n].map(([px, py]) => pip(px * gap, cy + py * gap, r, o.gold)).join('')
  return (
    k.draw([
      { d: side, fill: EBONY_D, inner: `<path d="M${TW} ${-TH}h${e}v${TH * 2 + 2}h${-e}Z" fill="${k.lin(EBONY_L, 0, 0, 1, 0, 0.5, 0)}"/>` },
      {
        d: TILE, fill: EBONY,
        inner:
          k.sh(TILE, 0, 0, 1, 1, 0, 0.85, '#000000', 0.45) + `<path d="M${-TW - 1} ${-TH - 1}H-2V${TH + 1}H${-TW - 1}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.2, 0)}"/>` +
          `<path d="${roundRect(-TW + 1.1, -TH + 1.1, TW - 1.1, TH - 1.1, 1.4)}" fill="none" stroke="${EBONY_L}" stroke-width=".45"/>` +
          hair(-TW + 1.6, -TH + 3, -TW + 1.2, 0, -TW + 1.6, TH - 3, 0.7, '#ffffff', 0.55) +
          (o.gold ? `<path d="${roundRect(-TW + 2, -TH + 2, TW - 2, TH - 2, 1)}" fill="none" stroke="${P.gold}" stroke-width=".45" stroke-dasharray="2 .7 .5 .7"/>` : ''),
      },
    ], o.w ?? 0.6) +
    `<path d="M${-TW + 1.8} -.2H${TW - 1.8}" stroke="${EBONY_D}" stroke-width=".9"/><path d="M${-TW + 1.8} .5H${TW - 1.8}" stroke="${o.gold ? P.gold : IVORY_D}" stroke-width=".5"/>` +
    half(a, -TH / 2) + half(b, TH / 2) +
    `<circle cx="0" cy=".1" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-.4" cy="-.3" r=".4" fill="${P.goldL}"/>`
  )
}

/** Mata redonda de bordes abollonados (una copa de árbol, una bocanada de humo), centrada en (x,y). */
function bush(x: number, y: number, r: number, n = 9, rot = 0) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = rot + (i / n) * Math.PI * 2, rr = r * (1 - 0.08 * ((i * 7) % 3))
    return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]
  })
  return `M${f(pts[0][0])} ${f(pts[0][1])}` + pts.map((_, i) => {
    const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % n], br = Math.hypot(x1 - x0, y1 - y0) * 0.56
    return `A${f(br)} ${f(br)} 0 0 1 ${f(x1)} ${f(y1)}`
  }).join('') + 'Z'
}

/** Ficha acostada sobre una mesa vista de arriba y de costado: la cara aplastada en `sy` y el canto adelante. */
function flatTile(k: Kit, x: number, y: number, a: number, b: number, rot: number, s: number, sy = 0.36) {
  const edge = `<g transform="translate(${x} ${f(y + 1.2 * s)}) scale(${s} ${f(s * sy)}) rotate(${rot})"><path d="${TILE}" fill="${EBONY_D}"/></g>`
  return edge + `<g transform="translate(${x} ${y}) scale(${s} ${f(s * sy)}) rotate(${rot})">${tile(k, a, b, { edge: 0, w: f(0.5 / s) })}</g>`
}

export const DOMINO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Dominó ─────────────────────────────────────────────────────────

  // Diez dominós: la mesa de cemento de la plaza, a la sombra del ombú, con la mano servida.
  'Mesa de plaza': (u) => {
    const k = kit(u)
    const cx = 64, cy = 74, rx = 28, ry = 11
    const top = ellipse(cx, cy, rx, ry)
    const rim = `M${cx - rx} ${cy}V${cy + 4}C${cx - rx} ${f(cy + 4 + ry * 0.9)} ${f(cx - rx * 0.55)} ${f(cy + 4 + ry)} ${cx} ${f(cy + 4 + ry)}C${f(cx + rx * 0.55)} ${f(cy + 4 + ry)} ${cx + rx} ${f(cy + 4 + ry * 0.9)} ${cx + rx} ${cy + 4}V${cy}C${cx + rx} ${f(cy + ry * 0.9)} ${f(cx + rx * 0.55)} ${cy + ry} ${cx} ${cy + ry}C${f(cx - rx * 0.55)} ${cy + ry} ${cx - rx} ${f(cy + ry * 0.9)} ${cx - rx} ${cy}Z`
    const leg = 'M57 87H71L72.6 101C72.6 103.4 55.4 103.4 55.4 101Z'
    const trunk = 'M12 112C18 100 22 88 23.6 76C25 64 23.4 54 25.4 46C27 40 31 38 34 40C32 47 33.4 56 34.6 66C35.8 80 37 96 44 112Z'
    // La copa del ombú: matas de atrás (oscuras) y de adelante, cada una con su luz arriba a la izquierda.
    const clumpsBack: [number, number, number][] = [[24, 38, 12], [44, 33, 12], [66, 31, 13], [88, 35, 12], [104, 44, 11]]
    const clumpsFront: [number, number, number][] = [[40, 26, 11], [62, 22, 12], [84, 26, 11], [32, 43, 9], [51, 41, 10], [71, 40, 10], [89, 45, 9]]
    const clump = (x: number, y: number, r: number, c: string, dk: string, lt: string) => {
      const d = bush(x, y, r, 9, x * 0.1)
      return k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0.05, 0.9, dk, 0.5) + `<path d="${bush(x - r * 0.25, y - r * 0.28, r * 0.55, 7, x)}" fill="${lt}" opacity=".7"/>` + hair(x - r * 0.5, y + r * 0.1, x - r * 0.1, y - r * 0.2, x + r * 0.4, y + r * 0.05, 0.45, dk) + hair(x - r * 0.2, y + r * 0.5, x + r * 0.2, y + r * 0.3, x + r * 0.6, y + r * 0.45, 0.4, dk) }], 0.6)
    }
    const dapple = [[45, 71, 4, 1.5], [82, 77, 4.4, 1.6], [70, 66.6, 3, 1.1], [56, 80.4, 2.6, 1]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${P.goldL}" opacity=".6"/>`).join('')
    return (
      k.day() +
      k.shade('M0 40H120V70H0Z', k.lin(P.greenD, 0, 0, 0, 1, 0.35, 0), P.greenD, 0.3) +
      k.floor(64, 101, 24, 3.2) +
      k.draw([{ d: trunk, fill: P.brown, inner: k.sh(trunk, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + hair(22, 100, 27, 78, 27, 52, 0.7, P.brownD) + hair(29, 104, 31, 82, 30, 56, 0.6, P.brownD) + hair(35, 108, 35, 86, 33, 66, 0.5, P.brownD) + hair(26, 92, 30, 86, 34, 85, 0.45, P.brownD) + hair(25, 66, 28, 62, 31, 62, 0.4, P.brownD) + hair(25.6, 50, 25.4, 72, 22.6, 92, 0.6, P.goldL, 0.6) }], 0.75) +
      k.draw([
        { d: leg, fill: P.white, inner: k.sh(leg, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + k.sh('M52 87H76V94H52Z', 0, 0, 0, 1, 0.8, 0, P.mid, 0.3) },
        { d: rim, fill: P.sky1, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        { d: top, fill: P.white, inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, P.sky2, 0.4) + dapple + [[38, 74], [88, 73], [60, 81], [74, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".45" fill="${P.blue}"/>`).join('') },
      ], 0.75) +
      flatTile(k, 51.6, 74, 3, 5, 90, 0.56, 0.5) + flatTile(k, 64, 74, 5, 5, 0, 0.56, 0.5) + flatTile(k, 76.4, 74, 5, 2, 90, 0.56, 0.5) +
      `<path d="M0 0H120V30H0Z" fill="${P.greenD}"/>` +
      clumpsBack.map(([x, y, r]) => clump(x, y, r, P.greenD, '#33441D', P.green)).join('') +
      clumpsFront.map(([x, y, r]) => clump(x, y, r, LEAF, P.greenD, '#B4C77A')).join('') +
      sparkle(92, 60, 1.8) +
      k.defs()
    )
  },

  // Cuarenta dominós: en el club te guardan la silla de siempre, con tu boina colgada y el cortado servido.
  'Club de jubilados': (u) => {
    const k = kit(u)
    const loop = 'M46.6 68C45.6 52 44.4 38 48 30C51.6 22 68.4 22 72 30C75.6 38 74.4 52 73.4 68'
    const inner = 'M51 66.4C50.6 54 50.8 42 53.4 36C56 31.4 64 31.4 66.6 36C69.2 42 69.4 54 69 66.4'
    const seat = ellipse(60, 69, 18, 5.6)
    const seatRim = 'M42 69V71.4C42 74.6 50 77 60 77C70 77 78 74.6 78 71.4V69C78 72.2 70 74.6 60 74.6C50 74.6 42 72.2 42 69Z'
    const cane = Array.from({ length: 9 }, (_, i) => `M${44 + i * 4} 64L${48 + i * 4} 74M${48 + i * 4} 64L${44 + i * 4} 74`).join('')
    const beret = 'M-11 1.6C-11.6 -2.6 -6.6 -6 0 -6C6.6 -6 11.8 -3 11.4 1.2C11.2 2.6 9.6 3.2 7.4 3.2H-7.6C-9.6 3.2 -10.8 2.8 -11 1.6Z'
    const band = 'M-8.4 1.8H8.4C8.8 1.8 9 2.2 9 2.6V3.6C9 4 8.8 4.4 8.4 4.4H-8.4C-8.8 4.4 -9 4 -9 3.6V2.6C-9 2.2 -8.8 1.8 -8.4 1.8Z'
    const cup = 'M-5 -6H5L4.2 -.6C3.8 1.2 2.2 2 0 2C-2.2 2 -3.8 1.2 -4.2 -.6Z'
    const saucer = ellipse(0, 2, 8.4, 2.2)
    const ear = 'M4.6 -4.6C7.6 -5.2 8.4 -2 5.8 -1.2L4.2 -.8'
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(61, 97, 22, 3) +
      rod('M51 72L52.6 95', P.brownD, 1.8) + rod('M69 72L67.4 95', P.brownD, 1.8) +
      `<path d="${ellipse(60, 87, 14.4, 3.4)}" fill="none" stroke="${P.ink}" stroke-width="2.4"/><path d="${ellipse(60, 87, 14.4, 3.4)}" fill="none" stroke="${P.brown}" stroke-width="1.2"/>` +
      rod(loop, P.brown, 3.2) + `<path d="M47.4 64C46.6 50 45.8 38 49 31.4C51 27.4 55 25.6 58 25.2" fill="none" stroke="${P.goldL}" stroke-width=".6" opacity=".8"/>` +
      rod(inner, P.brown, 2) +
      rod('M45.4 72L42.8 97', P.brown, 2.4) + rod('M74.6 72L77.2 97', P.brown, 2.4) + `<path d="M45 74L43 94" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>` +
      k.draw([
        { d: seatRim, fill: P.brown, inner: k.sh(seatRim, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) },
        { d: seat, fill: P.goldL, inner: `<path d="${cane}" stroke="${P.brown}" stroke-width=".35" opacity=".8"/>` + k.sh(seat, 0, 0, 1, 1, 0, 0.8, P.brown, 0.4) + `<path d="${ellipse(60, 69, 15.6, 4.4)}" fill="none" stroke="${P.brownD}" stroke-width=".5"/>` },
      ], 0.7) +
      // La boina colgada del respaldo.
      `<g transform="translate(70.4 31.4) rotate(32)">` + k.draw([{ d: beret, fill: EBONY, inner: k.sh(beret, 0, 0, 1, 1, 0, 0.9, '#000000', 0.45) + `<path d="M-6 -3.4C-3 -4.8 2 -5 5 -4" fill="none" stroke="${EBONY_L}" stroke-width=".6"/>` }, { d: band, fill: EBONY_D }], 0.55) +
      `<path d="M.4 -5.8C.6 -7.6 1.8 -8.6 3.2 -8.6" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/>` + hair(-8.6, -0.4, -4, -4.8, 3, -5.2, 0.7, '#ffffff', 0.55) + `<path d="M-8 3.1H8" stroke="${EBONY_L}" stroke-width=".35" stroke-dasharray=".8 .6"/>` + `</g>` +
      // El cortado en el asiento, y la ficha que guarda el lugar.
      `<g transform="translate(55 68)">` +
      k.draw([{ d: saucer, fill: P.white, inner: k.sh(saucer, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) }], 0.45) +
      rod(ear, P.white, 1) +
      k.draw([{ d: cup, fill: P.white, inner: k.sh(cup, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M-4.6 -3.6H4.6" stroke="${P.gold}" stroke-width=".5"/>` }], 0.5) +
      `<path d="${ellipse(0, -6, 5, 1.3)}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".4"/><path d="${ellipse(-0.4, -6.1, 3, .7)}" fill="${P.goldL}"/>` +
      hair(-1.4, -8, -3.4, -12, -1.2, -16, 0.6, P.blue) + hair(1.6, -8.4, 3.4, -12.4, 1.4, -17, 0.5, P.blue) +
      `</g>` +
      `<g transform="translate(68 63.6) rotate(-12) scale(.44)">${tile(k, 6, 6, { w: 1.3 })}</g>` +
      sparkle(88, 36, 2) + sparkle(32, 44, 1.5) +
      k.defs()
    )
  },

  // Ciento veinte dominós: el doble seis, monumento de la cuadra, con el bastón del patriarca apoyado y laureles.
  'Patriarca de la cuadra': (u) => {
    const k = kit(u)
    const plinth = 'M38 86H82L85 92H35Z'
    const plinthTop = 'M40 82.4H80L82 86H38Z'
    const cane = taper(81, 96, 80, 68, 75, 44, 2.6, 2)
    const knob = 'M75.2 45C74.4 39 77 35.2 81 35.2C84.8 35.2 87 38 86.4 42.4'
    return (
      k.day() +
      k.sun(60, 54, 16, 47, 32, false) +
      k.shade(ellipse(60, 54, 24, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(48, 99, 27, 88, 25, 60, 8) + laurel(72, 99, 93, 88, 95, 60, 8, true) +
      k.floor(60, 92, 26, 3, P.mid) +
      k.draw([
        { d: plinth, fill: P.sky1, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        { d: plinthTop, fill: P.white, inner: k.sh(plinthTop, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) },
      ], 0.6) +
      `<path d="M41 89H79" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
      `<g transform="translate(58.4 58.4) scale(1.5)">` + k.cast([TILE], 1.4, 1.2, P.mid) + tile(k, 6, 6, { gold: true, w: 0.5 }) + `</g>` +
      k.draw([{ d: cane, fill: P.brownD, inner: k.sh(cane, 0, 0, 1, 0, 0, 0.8, '#3B2416', 0.4) + hair(76, 48, 78.6, 70, 79.6, 92, 0.5, P.brown) }], 0.6) +
      rod(knob, P.brownD, 2.8) + `<path d="M75 42C75 38.4 77.4 36.2 80.6 36.2" fill="none" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round"/>` + `<circle cx="86.4" cy="42.6" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M73.4 45.4L76.8 44.6L77.4 47L74 47.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M79.4 93.4L82.6 92.8L83 96.4L80 97Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(60, 18, 3.2, '#fff') + sparkle(34, 40, 2) + sparkle(88, 70, 1.6) +
      k.defs()
    )
  },

  // ── Capicúa ────────────────────────────────────────────────────────

  // La primera capicúa: el boleto de colectivo con el número que se lee igual al derecho y al revés.
  'Boleto capicúa': (u) => {
    const k = kit(u)
    let edge = 'M-20 -12'
    for (let i = 0; i < 12; i++) edge += `L${f(-20 + (i + 0.5) * (40 / 12))} ${i % 2 ? -12 : -11.2}`
    edge += 'L20 -12'
    let right = ''
    for (let i = 0; i < 8; i++) right += `L${i % 2 ? 20 : 20.9} ${f(-12 + (i + 1) * 3)}`
    let bottom = ''
    for (let i = 0; i < 12; i++) bottom += `L${f(20 - (i + 0.5) * (40 / 12))} ${i % 2 ? 12 : 11.2}`
    let left = 'L-20 12'
    for (let i = 0; i < 8; i++) left += `L${i % 2 ? -20 : -20.9} ${f(12 - (i + 1) * 3)}`
    const paper = edge + right + bottom + left + 'Z'
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(62, 88, 24, 3) +
      `<g transform="translate(79 74) rotate(24) scale(.62)">` + k.cast([TILE], 1.6, 1.4) + tile(k, 3, 3, { w: 1 }) + `</g>` +
      `<g transform="translate(57 58) rotate(-9) scale(1.16)">` +
      k.cast([paper], 1.6, 1.8) +
      k.draw([{ d: paper, fill: '#F6E6B4', inner: k.sh(paper, 0, 0, 1, 1, 0, 0.4, P.goldD, 0.25) + `<path d="M-22 -14H-8V14H-22Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` }], 0.6) +
      `<path d="M-17 -7.6H17M-17 7.4H17" stroke="${P.red}" stroke-width=".45"/>` +
      `<text x="0" y="-8.8" ${GEORGIA} font-weight="700" font-size="3.4" letter-spacing=".6" fill="${P.red}" text-anchor="middle">BOLETO</text>` +
      `<text x="0" y="4.4" ${GEORGIA} font-weight="700" font-size="10.4" letter-spacing=".3" fill="${P.ink}" text-anchor="middle">12321</text>` +
      `<text x="-15" y="10.6" ${GEORGIA} font-style="italic" font-size="2.6" fill="${P.mid}">línea 60</text><text x="15" y="10.6" ${GEORGIA} font-size="2.6" fill="${P.mid}" text-anchor="end">$ 0,50</text>` +
      hair(-16, 6.6, -6, 7.4, 2, 6.6, 0.3, P.goldD) +
      `</g>` +
      sparkle(86, 34, 2.2) + sparkle(32, 40, 1.6) +
      k.defs()
    )
  },

  // Cinco capicúas: la cola de un auto de los de antes con la patente vieja, negra y de letras blancas, capicúa.
  'Patente capicúa': (u) => {
    const k = kit(u)
    const glassD = 'M30 38C34 24 44 20 60 20C76 20 86 24 90 38Z'
    const body = 'M8 112V44C8 40 12 37.4 18 37.4H102C108 37.4 112 40 112 44V112Z'
    const lid = 'M22 44H98C99.6 44 100.6 45 100.4 46.6L98.6 74H21.4L19.6 46.6C19.4 45 20.4 44 22 44Z'
    const bumper = 'M6 80C6 77 9 75.4 14 75.4H106C111 75.4 114 77 114 80V86C114 89 111 90.6 106 90.6H14C9 90.6 6 89 6 86Z'
    const plate = roundRect(30, 51, 90, 71, 2.6)
    const light = (x: number) => roundRect(x - 4.6, 46, x + 4.6, 62, 1.6)
    const screw = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x - 0.9} ${y}H${x + 0.9}" stroke="${P.mid}" stroke-width=".4"/>`
    return (
      k.day() +
      k.sun(60, 34, 10, 40, 28, false) +
      k.draw([{ d: glassD, fill: P.sky, inner: k.sh(glassD, 0, 0, 1, 1, 0, 0.7, P.mid, 0.4) + `<path d="M40 38L50 21H58L48 38Z" fill="#fff" opacity=".45"/><path d="M54 38L62 21H65L57 38Z" fill="#fff" opacity=".35"/>` }], 0.6) +
      k.draw([
        { d: body, fill: P.sky2, inner: k.sh(body, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M6 36H40V112H6Z" fill="${k.lin(P.white, 0, 0, 1, 0, 0.45, 0)}"/>` + `<path d="M10 40.6H110" stroke="${P.white}" stroke-width="1" opacity=".9"/>` },
        { d: lid, fill: P.sky2, line: 0.4, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + hair(24, 46.6, 60, 45.4, 96, 46.6, 0.7, '#fff', 0.85) + `<path d="M21.6 72H98.4" stroke="${P.white}" stroke-width="1.2"/><path d="M21.6 73.2H98.4" stroke="${P.mid}" stroke-width=".5"/>` + hair(26, 50, 25, 60, 26, 70, 0.6, '#fff', 0.5) },
      ], 0.75) +
      [22, 98].map((x) => k.draw([{ d: light(x), fill: P.red, inner: k.sh(light(x), 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<path d="M${x - 4.6} 54H${x + 4.6}" stroke="${P.white}" stroke-width=".9"/><path d="M${x - 2.6} 48V52" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` }], 0.5)).join('') +
      `<path d="M57 46.6H63V48.6H57Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="60" cy="47.6" r=".5" fill="${P.ink}"/>` +
      k.cast([plate], 1.2, 1.4, P.mid) +
      k.draw([{
        d: plate, fill: EBONY,
        inner: k.sh(plate, 0, 0, 1, 1, 0, 0.8, '#000000', 0.45) + `<path d="M28 50H92V57H28Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.2, 0)}"/>` +
          `<path d="${roundRect(32, 53, 88, 69, 1.6)}" fill="none" stroke="${IVORY}" stroke-width=".8"/>`,
      }], 0.7) +
      screw(35, 55.6) + screw(85, 55.6) +
      `<text x="60.5" y="66.4" ${GEORGIA} font-weight="700" font-size="10.2" fill="${EBONY_D}" text-anchor="middle">B 121.121</text>` +
      `<text x="60" y="65.9" ${GEORGIA} font-weight="700" font-size="10.2" fill="${IVORY}" text-anchor="middle">B 121.121</text>` +
      k.draw([{ d: bumper, fill: P.sky1, inner: k.sh(bumper, 0, 0, 0, 1, 0, 0.95, P.mid, 0.5) + `<path d="M6 78.6H114V80.8H6Z" fill="#fff"/><path d="M6 85H114V87.4H6Z" fill="${P.mid}" opacity=".55"/>` + hair(12, 77, 60, 76.4, 108, 77, 0.6, '#fff') }], 0.75) +
      sparkle(84, 79.6, 2.6, '#fff') + sparkle(36, 26, 1.8) + sparkle(86, 26, 1.4) +
      k.defs()
    )
  },

  // Quince capicúas: el despertador de bronce con cara de ficha, clavado a las 12:21.
  'Reloj a las 12:21': (u) => {
    const k = kit(u)
    const body = roundRect(24, 44, 96, 80, 7)
    const bell = (x: number, y: number, r: number) => {
      const d = 'M-9 3C-9 -5 -5 -9 0 -9C5 -9 9 -5 9 3Z'
      return `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-6 -2C-5 -6 -2 -7.6 1 -7.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/><path d="M-8.4 1H8.4" stroke="${P.goldD}" stroke-width=".5"/><path d="M-8.6 -.4H8.6" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray=".01 1" stroke-linecap="round"/>` }], 0.7) +
        `<circle cx="0" cy="-9.6" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/></g>`
    }
    const flap = (x0: number, txt: string) => {
      const w = roundRect(x0, 50, x0 + 26, 74, 2)
      return k.clip(w, `<path d="${w}" fill="${EBONY}"/><path d="M${x0} 62H${x0 + 26}V74H${x0}Z" fill="${EBONY_D}" opacity=".7"/>` + k.sh(w, 0, 0, 1, 1, 0, 0.7, '#000000', 0.4) +
        `<text x="${x0 + 13}" y="69.6" ${GEORGIA} font-weight="700" font-size="19" fill="${IVORY}" text-anchor="middle">${txt}</text>` +
        `<path d="M${x0} 62H${x0 + 26}" stroke="${EBONY_D}" stroke-width="1.2"/><path d="M${x0} 62.9H${x0 + 26}" stroke="${EBONY_L}" stroke-width=".4"/>` +
        `<path d="M${x0} 50H${x0 + 26}V56H${x0}Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.2, 0)}"/>`) +
        `<path d="${w}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
        `<rect x="${x0 - 0.6}" y="61" width="1.6" height="2.2" rx=".4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><rect x="${x0 + 25}" y="61" width="1.6" height="2.2" rx=".4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
    }
    const beads = Array.from({ length: 21 }, (_, i) => `<circle cx="${f(28 + i * 3.2)}" cy="46.6" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/><circle cx="${f(28 + i * 3.2)}" cy="77.4" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>`).join('')
    return (
      k.day() +
      k.sun(60, 60, 18, 48, 32, false) +
      k.shade(ellipse(60, 60, 34, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(50, 100, 28, 92, 24, 66, 7) + laurel(70, 100, 92, 92, 96, 66, 7, true) +
      `<g transform="translate(60 64) scale(.93) translate(-60 -64)">` +
      rod('M47 36C49 26 71 26 73 36', P.gold, 2) + `<path d="M48.6 33C51 28 58 27 62 27.2" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      bell(40, 41, -22) + bell(80, 41, 22) +
      `<path d="M60 44V35.4M56 33.6L64 37.2" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M60 44V35.4M56 33.6L64 37.2" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/><circle cx="56" cy="33.6" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      rod('M32 80L28 88M88 80L92 88', P.gold, 2) +
      k.cast([body], 2, 2.2, P.mid) +
      k.draw([{
        d: body, fill: P.gold, line: 0.3,
        inner: k.sh(body, 0, 0, 1, 1, 0, 0.85, P.goldD, 0.45) + `<path d="M22 42H96V52H22Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` +
          [[28.6, 49, 1, 1], [91.4, 49, -1, 1], [28.6, 75, 1, -1], [91.4, 75, -1, -1]].map(([x, y, sx, sy]) => `<path d="M0 0C0 -2.4 2.4 -3 3.4 -1.6C4.2 -.4 3 1 2 .4" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round" transform="translate(${x} ${y}) scale(${sx} ${sy})"/>`).join('') +
          `<path d="${roundRect(26.6, 46.6, 93.4, 77.4, 5)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`,
      }], 0.8) +
      beads + flap(31, '12') + flap(63, '21') +
      `<circle cx="60" cy="56.6" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="60" cy="67.4" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="59.5" cy="56.1" r=".45" fill="#fff"/><circle cx="59.5" cy="66.9" r=".45" fill="#fff"/>` +
      `<path d="M60 50V54M60 70V74" stroke="${P.goldD}" stroke-width=".6"/>` +
      `</g>` +
      sparkle(60, 20, 3, '#fff') + sparkle(30, 30, 1.8) + sparkle(94, 46, 1.6) +
      k.defs()
    )
  },

  // ── Trancador ──────────────────────────────────────────────────────

  // Tres tranques: pusiste el cono y nadie pasa. La valla de calle cortada es una ficha.
  'Calle cortada': (u) => {
    const k = kit(u)
    const leg = (x0: number, x1: number) => taper(x0, 63, (x0 + x1) / 2, 78, x1, 93, 2.8, 2.4)
    const cone = 'M-3 -30C-1.4 -31.4 1.4 -31.4 3 -30L11 4H-11Z'
    const base = 'M-15 4H15L16.4 8H-16.4Z'
    const stripe = (y0: number, y1: number) => {
      const w = (y: number) => 3 + (y + 30) * (8 / 34)
      return `M${f(-w(y0))} ${y0}H${f(w(y0))}L${f(w(y1))} ${y1}H${f(-w(y1))}Z`
    }
    const legs = [[46, 39], [46, 53], [72, 65], [72, 79]].map(([a, b]) => ({ d: leg(a, b), fill: P.white, inner: k.sh(leg(a, b), 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M${Math.min(a, b) - 4} 82L${Math.max(a, b) + 4} 76V79L${Math.min(a, b) - 4} 85Z" fill="${P.red}"/>` }))
    return (
      k.day() +
      k.stage(60, 60, 34) +
      `<path d="M16 94H104" stroke="${P.blue}" stroke-width=".6" stroke-dasharray="4 3"/>` +
      k.floor(59, 94, 26, 2.8) +
      k.draw(legs, 0.6) +
      `<path d="M44 64H74" stroke="${P.ink}" stroke-width="2.4"/><path d="M44 64H74" stroke="${P.brown}" stroke-width="1.2"/>` +
      `<g transform="translate(59 54.6) rotate(90) scale(1.18)">` + k.cast([TILE], -1.4, -1.6) + tile(k, 5, 3, { w: 0.55 }) + `</g>` +
      `<g transform="translate(84 89) scale(.86)">` + k.cast([cone, base], 2, 1.4) +
      k.draw([
        { d: base, fill: CONE_D, inner: k.sh(base, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) },
        { d: cone, fill: CONE, inner: k.sh(cone, 0, 0, 1, 0, 0, 0.95, CONE_D, 0.5) + `<path d="${stripe(-20, -14)}" fill="${P.white}"/><path d="${stripe(-8, -2)}" fill="${P.white}"/>` + k.sh(stripe(-20, -14), 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + k.sh(stripe(-8, -2), 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + hair(-3, -26, -6, -10, -8, 2, 0.8, '#fff', 0.6) },
      ], 0.7) + `</g>` +
      sparkle(86, 34, 2.2) + sparkle(32, 40, 1.6) +
      k.defs()
    )
  },

  // Doce tranques: cortaste el Pueyrredón. La barricada de fichas en el puente y las gomas que arden.
  'Piquete en el puente': (u) => {
    const k = kit(u)
    const arch = 'M14 72C26 46 44 34 60 34C76 34 94 46 106 72'
    const archIn = 'M22 72C32 52 46 42 60 42C74 42 88 52 98 72'
    let truss = ''
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI * (1 - i / 12)
      truss += `M${f(60 + Math.cos(a) * 46)} ${f(72 - Math.sin(a) * 38)}L${f(60 + Math.cos(a) * 38)} ${f(72 - Math.sin(a) * 30)}`
      if (i < 12) { const a2 = Math.PI * (1 - (i + 1) / 12); truss += `L${f(60 + Math.cos(a2) * 46)} ${f(72 - Math.sin(a2) * 38)}` }
    }
    const deck = 'M8 72H112V78H8Z'
    const tire = (cy: number) => {
      const side = `M49 ${cy}V${cy + 3.6}C49 ${cy + 5.6} 54 ${cy + 7} 60 ${cy + 7}C66 ${cy + 7} 71 ${cy + 5.6} 71 ${cy + 3.6}V${cy}Z`
      const ring = ellipse(60, cy, 11, 3.6)
      return k.draw([
        { d: side, fill: EBONY_D, inner: Array.from({ length: 10 }, (_, i) => `<path d="M${f(50 + i * 2.2)} ${cy + 1}V${cy + 6.4}" stroke="${EBONY_L}" stroke-width=".5"/>`).join('') },
        { d: ring, fill: EBONY, inner: `<path d="${ellipse(60, cy + 0.2, 5.4, 1.6)}" fill="#000"/>` + k.sh(ring, 0, 0, 1, 0, 0, 0.6, '#000000', 0.4) + `<path d="M50.6 ${cy - 0.6}C53 ${cy - 2.6} 58 ${cy - 3.2} 62 ${cy - 3.2}" fill="none" stroke="${EBONY_L}" stroke-width=".6"/>` },
      ], 0.6)
    }
    const smoke = (x: number, y: number, s: number) => {
      const d = bush(x, y, 6 * s, 8, x)
      return k.draw([{ d, fill: '#A7ABB8', inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) + `<path d="${bush(x - 1.6 * s, y - 1.8 * s, 3 * s, 6, y)}" fill="${P.white}" opacity=".45"/>` }], 0.5)
    }
    return (
      k.day() +
      k.shade('M0 0H120V72H0Z', k.lin(P.gold, 0, 0, 0, 1, 0, 0.55), P.goldD, 0.3) +
      `<path d="${truss}" fill="none" stroke="${P.mid}" stroke-width=".8"/>` +
      rod(arch, P.blue, 2.2) + rod(archIn, P.blue, 1.4) +
      smoke(61, 58, 0.8) + smoke(64, 48, 1.05) + smoke(58, 37, 1.3) + smoke(66, 26, 1.5) +
      k.draw([{ d: deck, fill: P.sky1, inner: k.sh(deck, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + Array.from({ length: 14 }, (_, i) => `<path d="M${10 + i * 7.6} 72V78" stroke="${P.blue}" stroke-width=".5"/>`).join('') }], 0.6) +
      `<path d="M8 78H112V112H8Z" fill="${P.sky2}"/>` + k.sh('M8 78H112V112H8Z', 0, 0, 0, 1, 0, 0.7, P.mid, 0.4) +
      k.floor(60, 94, 34, 3, P.mid) +
      [[-9, 38, 4, 2], [-3, 54.6, 6, 1], [4, 66.6, 2, 5], [9, 83, 3, 3]].map(([r, x, a, b]) => `<g transform="translate(${x} 77) rotate(${r})">${k.cast([TILE], 1.4, 1.2, P.mid)}${tile(k, a, b, { w: 0.6 })}</g>`).join('') +
      tire(91) + tire(85) +
      flame(k, 'translate(60 84) scale(.34) translate(-60 -90)') +
      [[48, 66], [74, 60], [70, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="${P.goldD}"/>`).join('') +
      sparkle(92, 30, 1.8) +
      k.defs()
    )
  },

  // Treinta y cinco tranques: la General Paz en hora pico. Dos carriles de fichas hasta el horizonte, bajo el cartel.
  'General Paz trabada': (u) => {
    const k = kit(u)
    const vx = 60, vy = 52, by = 104
    const road = `M10 ${by}L${vx - 3} ${vy + 2}H${vx + 3}L110 ${by}Z`
    const lane = (side: number, t: number, a: number, b: number) => {
      const y = vy + (by - vy) * t, x = vx + side * 21 * t, s = t * 1.32
      return `<g transform="translate(${f(x)} ${f(y - TH * s)}) scale(${f(s)})">${tile(k, a, b, { w: f(0.6 / s), gold: t > 0.6 })}</g>`
    }
    const ts: [number, number, number, number][] = [[-1, 0.2, 2, 1], [1, 0.22, 4, 4], [-1, 0.3, 6, 2], [1, 0.33, 1, 5], [-1, 0.45, 3, 6], [1, 0.5, 5, 0], [-1, 0.68, 4, 2], [1, 0.74, 6, 3]]
    const dashes = Array.from({ length: 6 }, (_, i) => {
      const t0 = 0.12 + i * 0.16, t1 = t0 + 0.07
      return `M${vx} ${f(vy + (by - vy) * t0)}L${vx} ${f(vy + (by - vy) * t1)}`
    }).join('')
    const sign = roundRect(39, 29.4, 81, 43, 2.2)
    const rivets = [[41.2, 31.6], [78.8, 31.6], [41.2, 40.8], [78.8, 40.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".2"/>`).join('')
    let lattice = ''
    for (let x = 14; x < 106; x += 4) lattice += `M${x} 23L${x + 4} 27M${x + 4} 23L${x} 27`
    return (
      k.day() +
      k.sun(vx, vy, 8, 52, 36, false) +
      k.shade(ellipse(vx, vy, 30, 18), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.5) +
      `<path d="M0 ${vy}H120" stroke="${P.blue}" stroke-width=".5"/>` +
      `<path d="M14 ${vy}V${vy - 5}H19V${vy - 8}H23V${vy - 4}H27V${vy - 10}H30V${vy - 6}H35V${vy - 3}H40V${vy - 7}H44V${vy - 4}H50V${vy}ZM70 ${vy}V${vy - 4}H75V${vy - 9}H78V${vy - 5}H83V${vy - 11}H87V${vy - 6}H92V${vy - 3}H97V${vy - 8}H101V${vy - 4}H106V${vy}Z" fill="${P.blue}" opacity=".45"/>` +
      `<path d="M0 ${vy}H120V130H0Z" fill="${P.sky1}" opacity=".6"/>` +
      k.draw([{ d: road, fill: '#6F7480', inner: k.sh(road, 0, 0, 0, 1, 0, 0.6, EBONY_D, 0.4) + `<path d="${dashes}" stroke="${IVORY}" stroke-width="1.1"/><path d="M12 ${by}L${vx - 2.6} ${vy + 2.2}M108 ${by}L${vx + 2.6} ${vy + 2.2}" stroke="${IVORY}" stroke-width=".8"/>` }], 0.6) +
      ts.map(([s, t, a, b]) => lane(s, t, a, b)).join('') +
      // El pórtico con el cartel.
      `<path d="M10 23H110M10 27H110" stroke="${P.ink}" stroke-width="1.4"/><path d="${lattice}" stroke="${P.mid}" stroke-width=".5"/>` +
      `<path d="M50 27V29.6M70 27V29.6" stroke="${P.ink}" stroke-width="1.2"/>` +
      k.draw([{ d: sign, fill: P.mid, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.7, P.night, 0.4) + `<path d="${roundRect(40.4, 30.8, 79.6, 41.6, 1.2)}" fill="none" stroke="${P.white}" stroke-width=".6"/>` }], 0.6) +
      rivets +
      `<text x="57" y="38.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="6.2" fill="${P.white}" text-anchor="middle">Gral. Paz</text>` +
      `<path d="M75.4 40.2V33.8M73 36L75.4 33.2L77.8 36" fill="none" stroke="${P.white}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>` +
      sparkle(92, 40, 1.8) + sparkle(28, 44, 1.4) +
      k.defs()
    )
  },
}
