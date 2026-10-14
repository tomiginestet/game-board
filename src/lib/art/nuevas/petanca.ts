// Petanca: las medallas redibujadas con el kit (../kit.ts). Los objetos de la petanca: la bola de acero con sus
// estrías y el horizonte reflejado, el boliche de madera, el círculo de tiro, las alpargatas, la plaza de tierra
// de Provenza con su lavanda, y el cuadrito de Fanny (tapado con su cortina: a ella no se la dibuja).
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, taper, type Kit } from '../kit'
import { banner, bochin, boule, DIRT, DIRT_D, GEORGIA, glow, puff, scrolls, speed, tinted } from './_bolas-piezas'

/** Rojo del círculo de plástico y el del boliche. */
const ROJO = '#C4513F', ROJO_D = '#86302A'
/** Lavanda de Provenza. */
const LAV = '#A592DC', LAV_D = '#6A5A9E'
/** Tierra de la plaza y raíces. */
const SOIL = '#8E6440', SOIL_D = '#5E3E24', ROOT = '#D8BC92'
/** Yute de la alpargata. */
const YUTE = '#E3C79A', YUTE_D = '#B08F5C'

const sand = (k: Kit) => tinted(k, '#E9DCC4', '#CDB38A', 0.5)

/** Boliche (cochonnet) de madera pintada. */
const cochonnet = (k: Kit, x: number, y: number, r = 3.4) => bochin(k, x, y, r, ROJO, ROJO_D)

/** Alpargata vista desde arriba, la punta hacia arriba, centrada en (0,0). */
function espadrille(k: Kit, flip = false) {
  const sole = 'M0 -12.4C4.6 -12.4 5.6 -7 5.4 -2.6C5.2 1.6 4 4 4.2 7.4C4.4 10.6 2.4 12.4 0 12.4C-2.4 12.4 -4.4 10.6 -4.2 7.4C-4 4 -5.2 1.6 -5.4 -2.6C-5.6 -7 -4.6 -12.4 0 -12.4Z'
  const upper = 'M0 -11C3.6 -11 4.4 -6.6 4.2 -2.6C4 1 3 3.4 3 5.4H-3C-3 3.4 -4 1 -4.2 -2.6C-4.4 -6.6 -3.6 -11 0 -11Z'
  const throat = ellipse(0, 5.8, 2.6, 3.6)
  return (
    `<g transform="scale(${flip ? -1 : 1} 1)">` +
    k.draw([{
      d: sole, fill: YUTE,
      inner: `<path d="${sole}" fill="none" stroke="${YUTE_D}" stroke-width="1.6" stroke-dasharray=".7 .6"/>` +
        `<path d="${upper}" fill="${P.mid}"/>` + k.clip(upper, `<path d="M-6 -8H6M-6 -4.4H6M-6 -.8H6M-6 2.8H6" stroke="${P.white}" stroke-width="1.3"/>`) +
        `<path d="${upper}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="${throat}" fill="${YUTE_D}"/><path d="${ellipse(0, 6.4, 2, 2.8)}" fill="#6E5432"/>` +
        k.sh(sole, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3),
    }], 0.55) +
    `</g>`
  )
}

/** Ramito de lavanda: el tallo de (0,0) hacia arriba y las espigas. */
function lavender(k: Kit, x: number, y: number, rot: number, len = 30) {
  const buds = Array.from({ length: 9 }, (_, i) => {
    const yy = -len + i * 2.3, s = i % 2 ? 1 : -1
    return `<ellipse cx="${f(s * 1.3)}" cy="${f(yy)}" rx="1.7" ry="2.4" fill="${LAV}" stroke="${P.ink}" stroke-width=".35" transform="rotate(${s * 24} ${f(s * 1.3)} ${f(yy)})"/>`
  }).join('')
  return `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    `<path d="M0 0V${-len + 2}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M0 0V${-len + 2}" stroke="${P.green}" stroke-width=".7" stroke-linecap="round"/>` +
    `<path d="M0 -8C-3 -10 -4.6 -13 -4.6 -16M0 -12C2.6 -14 3.8 -16.4 3.8 -19" fill="none" stroke="${P.greenD}" stroke-width=".7" stroke-linecap="round"/>` +
    buds + k.shade(`M-2.6 ${-len - 2}H2.6V${-len + 18}H-2.6Z`, k.lin(LAV_D, 0, 0, 1, 0, 0, 0.8), LAV_D, 0.2) +
    `</g>`
}

export const PETANCA_ART: Record<string, (u: number) => string> = {
  // ── Boule ─────────────────────────────────────────────────────────

  // Cinco ganadas: las dos alpargatas juntitas adentro del círculo de tiro, vistas desde arriba, y la bola que ya
  // salió volando.
  'Pies juntos': (u) => {
    const k = kit(u)
    return (
      sand(k) +
      k.sun(56, 72, 14, 40, 32, true) +
      k.shade(ellipse(56, 72, 21, 21), k.rad(DIRT, 0.5, 0.5, 0.5, 0.95, 0.6), DIRT_D, 0.35) +
      `<circle cx="56.5" cy="72.6" r="22.7" fill="none" stroke="${P.ink}" stroke-width="4.2"/><circle cx="56" cy="72" r="22.7" fill="none" stroke="${P.ink}" stroke-width="4.2"/>` +
      `<circle cx="56" cy="72" r="22.7" fill="none" stroke="${ROJO}" stroke-width="2.6"/>` +
      `<circle cx="56" cy="72" r="22.7" fill="none" stroke="${k.lin(ROJO_D, 0, 0, 1, 1, 0, 0.9)}" stroke-width="2.6"/>` +
      `<path d="M37 64A20 20 0 0 1 52 50" fill="none" stroke="#E79A88" stroke-width=".6"/>` +
      `<g transform="translate(50.4 72) rotate(-4)">` + k.cast(['M-5 -12H5V12H-5Z'], 1, 1, DIRT_D) + espadrille(k) + `</g>` +
      `<g transform="translate(61.6 72) rotate(4)">` + k.cast(['M-5 -12H5V12H-5Z'], 1, 1, DIRT_D) + espadrille(k, true) + `</g>` +
      speed(80, 43, -40, 3, 10, 3.2, P.mid) +
      boule(k, 81, 43, 8.4) +
      sparkle(30, 48, 1.8) + sparkle(88, 70, 1.4) +
      k.defs()
    )
  },

  // Veinte victorias: hablás francés con las manos. La mano agarra la bola de arriba, con la palma para abajo
  // (como se tira en Marsella), la manga a rayas de marinero y los trazos del gesto.
  'Plaza de Marsella': (u) => {
    const k = kit(u)
    const hand =
      'M90 47C82 43.4 72 44 64 47.4C56 50.6 48 52.4 43.6 57.6C41 60.8 41.4 65 44 66.4C45.4 67.2 47.4 66.6 48.4 64.8C48.6 67.6 50.6 69.4 53.2 69C55.4 68.6 56.4 66.6 56.6 64.6C57.4 67 59.4 68.2 61.6 67.6C63.6 67 64.4 65 64.4 63.2C65.4 64.8 67.4 65.4 69 64.6C71 63.6 71.4 61.4 70.6 59.4C75 59 82 58 92 57.4Z'
    const sleeve = 'M84 42.4L94 34.6L106 52L93 60.6Z'
    const knuckles = [[47.6, 59.4], [54.4, 58], [61, 57], [67, 56.4]].map(([x, y]) => hair(x - 1.6, y + 0.6, x, y - 0.6, x + 1.6, y + 0.4, 0.55, '#C9A88C')).join('')
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(56, 92, 18, 2.6, P.mid) +
      boule(k, 56, 76, 15.4, { tilt: 20 }) +
      k.cast([hand], 1.4, 1.6) +
      k.draw([
        {
          d: sleeve, fill: P.white,
          inner: k.clip(sleeve, `<path d="M80 40L96 30M84 46L100 36M88 52L104 42M92 58L108 48" stroke="${P.mid}" stroke-width="2.4"/>`) + k.sh(sleeve, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35),
        },
        {
          d: hand, fill: P.skin,
          inner: k.sh(hand, 0, 0, 0, 1, 0.1, 0.8, '#D9B596', 0.45) + `<path d="M60 40C70 42 80 44 92 46V50C80 49 70 49 62 50Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` +
            knuckles + `<path d="M48.4 64.8C48.6 62.6 49 61.4 49.6 60.6M56.6 64.6C56.6 62.4 57 61 57.6 60M64.4 63.2C64.6 61.4 65 60.2 65.6 59.4" fill="none" stroke="#B88E6E" stroke-width=".5" stroke-linecap="round"/>` +
            hair(70, 47.6, 78, 46.4, 86, 47.4, 0.6, '#fff', 0.7),
        },
      ], 0.65) +
      hair(36, 50, 32, 56, 33, 63, 0.9, P.ink) + hair(31, 47, 26.6, 54, 27.6, 62, 0.7, P.ink) +
      hair(72, 70, 78, 74, 84, 72, 0.9, P.ink) + hair(74, 76, 80, 80, 86, 78, 0.7, P.ink) +
      `<text x="44" y="38" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" text-anchor="middle" transform="rotate(-8 44 38)">bof!</text>` +
      sparkle(84, 84, 1.6) +
      k.defs()
    )
  },

  // Cincuenta ganadas y Fanny, nunca: el cuadrito de Fanny del bar, con la cortina bien cerrada, y la bola de oro
  // adelante. Abajo, la cinta del 13 a 0... a favor.
  'Fanny': (u) => {
    const k = kit(u)
    const frame = roundRect(40, 27, 80, 72, 2.6)
    const inner = roundRect(44.4, 31.4, 75.6, 67.6, 1)
    const curtainL = 'M44.4 31.4H61.4C60.8 42 61.6 56 61 67.6H44.4Z'
    const curtainR = 'M75.6 31.4H59.6C60.2 42 59.4 56 60 67.6H75.6Z'
    const folds = [47.6, 51.4, 55.4].map((x) => `M${x} 33V67`).join('') + [72.4, 68.6, 64.6].map((x) => `M${x} 33V67`).join('')
    const valance = 'M43.6 30.6H76.4V36.6C72.4 38.6 68.4 35.6 64.4 37.6C61.4 39.4 58.6 39.4 55.6 37.6C51.6 35.6 47.6 38.6 43.6 36.6Z'
    return (
      sand(k) +
      k.sun(60, 54, 15, 46, 32, false) +
      k.cast([frame], 2.2, 2, P.goldD) +
      k.draw([{
        d: frame, fill: P.gold,
        inner: k.sh(frame, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="M40 27H80V30H40Z" fill="${P.goldL}" opacity=".7"/>` +
          [[42.2, 29.2], [77.8, 29.2], [42.2, 69.8], [77.8, 69.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/>`).join(''),
      }], 0.7) +
      `<path d="${inner}" fill="${P.night}"/>` +
      k.draw([
        { d: curtainL, fill: P.wine, inner: `<path d="${folds}" stroke="#4A1222" stroke-width=".8"/>` + k.sh(curtainL, 0, 0, 1, 0, 0, 0.6, '#3B0E1B', 0.4) + hair(46, 40, 46.6, 54, 46, 66, 0.8, P.red, 0.8) },
        { d: curtainR, fill: P.wine, inner: `<path d="${folds}" stroke="#4A1222" stroke-width=".8"/>` + k.sh(curtainR, 0, 0, 1, 0, 0, 0.8, '#3B0E1B', 0.4) + hair(73, 40, 72.4, 54, 73, 66, 0.6, P.red, 0.8) },
        { d: valance, fill: P.red, inner: k.sh(valance, 0, 0, 0, 1, 0, 0.7, P.wine, 0.4) + `<path d="M41.6 33.4H78.4" stroke="${P.goldL}" stroke-width=".5"/>` },
      ], 0.45) +
      `<path d="${roundRect(49, 74, 71, 80.4, 1.4)}" fill="${P.paper}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<text x="60" y="79" ${GEORGIA} font-style="italic" font-weight="700" font-size="5" fill="${P.wine}" text-anchor="middle">Fanny</text>` +
      boule(k, 81, 80, 8.6, { gold: true, tilt: -30 }) +
      scrolls(60, 23.6, 9, P.goldD) +
      banner(k, 60, 87.4, 34, P.mid, P.night, '13 a 0', P.goldL, 4.6) +
      sparkle(30, 62, 2) + sparkle(90, 62, 1.8) +
      k.defs()
    )
  },

  // ── Tirador ───────────────────────────────────────────────────────

  // El primer carreau: tu bola quedó clavada en el lugar exacto de la otra, que sale volando entre el polvo.
  'Tiro limpio': (u) => {
    const k = kit(u)
    const mark = ellipse(60, 84, 16, 4)
    return (
      sand(k) +
      k.sun(60, 60, 14, 42, 32, false) +
      `<path d="M10 82Q60 80 110 82V130H10Z" fill="${DIRT}"/>` + k.sh('M10 82Q60 80 110 82V130H10Z', 0, 0, 0, 1, 0, 0.8, DIRT_D, 0.4) +
      `<path d="${mark}" fill="none" stroke="${DIRT_D}" stroke-width=".7" stroke-dasharray="1.4 1"/>` +
      puff(k, 40, 76, 7, DIRT, DIRT_D) +
      speed(32, 52, 200, 3, 10, 3.4, P.mid) +
      boule(k, 30, 50, 7.6, { tilt: 30 }) +
      k.floor(60, 85, 15, 2.6, DIRT_D) +
      boule(k, 60, 71, 14) +
      cochonnet(k, 84, 86, 3.2) +
      `<text x="66" y="38" ${GEORGIA} font-style="italic" font-weight="700" font-size="7" fill="${P.ink}" text-anchor="middle" transform="rotate(-6 66 38)">carreau!</text>` +
      sparkle(86, 56, 1.8) + sparkle(46, 32, 1.4) +
      k.defs()
    )
  },

  // Cinco carreaux: tus bolas echan raíces. La bola quieta en la tierra de la plaza, y abajo, en el corte, las raíces.
  'Bola clavada': (u) => {
    const k = kit(u)
    const soil = 'M10 74Q60 72 110 74V130H10Z'
    const roots = [
      [52, 80, 46, 88, 40, 100, 2.4], [56, 82, 54, 92, 50, 104, 2.2], [62, 82, 64, 92, 62, 104, 2.2], [67, 80, 74, 88, 82, 96, 2.4], [58, 82, 58, 90, 57, 98, 1.6],
      [46, 88, 40, 90, 34, 88, 1], [74, 88, 80, 90, 86, 86, 1], [52, 94, 48, 96, 46, 100, 0.8],
    ].map(([x0, y0, cx, cy, x1, y1, w]) => `<path d="${taper(x0, y0, cx, cy, x1, y1, w, 0.3)}" fill="${ROOT}" stroke="${P.ink}" stroke-width=".45"/>`).join('')
    const pebbles = [[30, 84], [92, 90], [36, 98], [78, 100], [88, 80]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${i % 2 ? 1.6 : 1.1}" ry="${i % 2 ? 1 : 0.8}" fill="${SOIL_D}"/>`).join('')
    const leaf = (x: number, y: number, r: number) => `<path d="M${x} ${y}C${x - 1} ${y - 4} ${x + 2} ${y - 7} ${x + 6} ${y - 7}C${x + 6} ${y - 3} ${x + 3} ${y} ${x} ${y}Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".5" transform="rotate(${r} ${x} ${y})"/>`
    return (
      k.day() +
      k.stage(60, 50, 30) +
      k.draw([{ d: soil, fill: SOIL, inner: k.sh(soil, 0, 0, 0, 1, 0, 0.8, SOIL_D, 0.45) + `<path d="M10 76Q60 74 110 76" fill="none" stroke="${DIRT}" stroke-width="3"/>` + pebbles + roots }], 0.6) +
      k.floor(60, 75, 16, 2.4, SOIL_D) +
      boule(k, 60, 62, 14.4) +
      `<path d="M60.4 47.8C60.6 45 61 42.6 62 40.4" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M60.4 47.8C60.6 45 61 42.6 62 40.4" fill="none" stroke="${P.green}" stroke-width=".6" stroke-linecap="round"/>` +
      leaf(62, 41, -10) + leaf(61.4, 42, 200) +
      sparkle(34, 44, 1.8) + sparkle(86, 50, 1.4) +
      k.defs()
    )
  },

  // Quince carreaux: te llaman de la federación francesa. La bola de acero en el centro de la mira, de noche, con
  // dos ramitos de lavanda cruzados abajo.
  'Francotirador provenzal': (u) => {
    const k = kit(u)
    const C = [60, 58]
    const ticks = [-22, -18, 18, 22].map((d) => `M${C[0] + d} ${C[1] - 1.4}V${C[1] + 1.4}M${C[0] - 1.4} ${C[1] + d}H${C[0] + 1.4}`).join('')
    const cross = `M${C[0] - 27} ${C[1]}H${C[0] - 15.6}M${C[0] + 15.6} ${C[1]}H${C[0] + 27}M${C[0]} ${C[1] - 27}V${C[1] - 15.6}M${C[0]} ${C[1] + 15.6}V${C[1] + 27}`
    return (
      k.night() +
      [[30, 30], [92, 30], [26, 60], [94, 66], [40, 22], [80, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      glow(k, C[0], C[1], 26, 26, 0.55, P.gold) +
      lavender(k, 36, 96, -22, 34) + lavender(k, 84, 96, 22, 34) +
      `<path d="${cross}" stroke="${P.ink}" stroke-width="2"/><path d="${cross}" stroke="${P.goldL}" stroke-width=".9"/>` +
      `<path d="${ticks}" stroke="${P.ink}" stroke-width="1.6"/><path d="${ticks}" stroke="${P.goldL}" stroke-width=".7"/>` +
      `<circle cx="${C[0]}" cy="${C[1]}" r="28.8" fill="none" stroke="${P.ink}" stroke-width="4"/>` +
      `<circle cx="${C[0]}" cy="${C[1]}" r="28.8" fill="none" stroke="${P.gold}" stroke-width="2.4"/>` +
      `<circle cx="${C[0]}" cy="${C[1]}" r="28.8" fill="none" stroke="${k.lin(P.goldD, 0, 0, 1, 1, 0, 0.9)}" stroke-width="2.4"/>` +
      `<path d="M38 40A28.8 28.8 0 0 1 56 29.4" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` +
      boule(k, C[0], C[1], 13, { tilt: -18 }) +
      `<path d="M${C[0] - 15.6} ${C[1]}H${C[0] + 15.6}M${C[0]} ${C[1] - 15.6}V${C[1] + 15.6}" stroke="${P.ink}" stroke-width=".5" opacity=".85"/>` +
      `<circle cx="${C[0]}" cy="${C[1]}" r="1.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(88, 40, 2, P.goldL) + sparkle(32, 40, 1.6, P.goldL) +
      k.defs()
    )
  },
}
