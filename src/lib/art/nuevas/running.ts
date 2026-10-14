// Carrera (running), en clave heroica. Los objetos del corredor: la zapatilla de suela gorda con su caja, la media de
// compresión, el reloj con el recorrido del GPS, el lago de Palermo con su vuelta y el dorsal de Zabala en Los Ángeles 32.
// A las personas reales (Zabala) no se las dibuja: aparecen por sus objetos.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Verde del parque y agua del lago. */
const GRASS = '#7E9C4E', GRASS_D = '#56722F'
const WATER = '#8FB3DE', WATER_D = '#5D7FBE'
/** Cartón de la caja de zapatillas y papel de seda. */
const CARTON = '#D9B07A', CARTON_D = '#A87B46'
/** Fierro: gris azulado con su sombra. */
const IRON = '#9AA6BF', IRON_D = '#5F6C8C', IRON_L = '#D3DAE8'

// ── La zapatilla: de perfil, la punta a la derecha y la suela en y≈4 ─────────────────────────────────────

const UPPER = 'M-21.6 -1.6C-23.2 -7 -22.8 -13.4 -20.6 -18.4C-20 -19.8 -18.6 -20.2 -17.6 -19.2C-15.6 -17 -12.6 -15.6 -9.6 -15.6C-7.6 -17.8 -5.6 -19.8 -3.4 -20.4' +
  'C-2 -20.8 -1 -20 -.8 -18.8C3 -15.6 8 -12.6 13.6 -10.2C18.4 -8.2 22.4 -6.6 23.6 -3.8C24 -2.6 23.4 -1.6 22.4 -1.4Z'
const MIDSOLE = 'M-23.2 -2.8C-23.8 -.4 -23.2 2.6 -21.4 4.2H18.8C22 4.2 24.8 2 25.4 -1.2C25.6 -2.4 24.8 -3 23.6 -2.6C14 -1.2 -6 -1 -23.2 -2.8Z'
const OUTSOLE = 'M-22.4 3H24.2C23 4.6 21 5.6 18.8 5.6H-20.4C-21.6 5.6 -22.4 4.6 -22.4 3Z'
/** Siluetas de la zapatilla para las sombras proyectadas. */
const SHOE = [UPPER, MIDSOLE, OUTSOLE]

interface ShoeOpts {
  upper?: string
  upperD?: string
  stripe?: string
  sole?: string
  soleD?: string
  laces?: string
  /** Remaches de fierro en el contorno. */
  rivets?: boolean
  /** Encima de la capellada, recortado a ella. */
  over?: string
}

/** Zapatilla de running: capellada de malla, franja ondulada, suela gorda de espuma y cordones. */
function shoe(k: Kit, o: ShoeOpts = {}) {
  const up = o.upper ?? P.white, upD = o.upperD ?? P.blue, stripe = o.stripe ?? P.red, sole = o.sole ?? P.white, soleD = o.soleD ?? P.blue
  const band = 'M-19.6 -3C-14 -6 -9.6 -10.6 -4 -11C1 -11.4 4 -6.6 9.6 -6.4C13 -6.2 15.6 -7.4 17.4 -8.6L19.6 -6.2C16.6 -4.2 13 -3 9 -3.2C3.6 -3.4 1 -7.4 -3.6 -7C-8.6 -6.6 -12.6 -2.8 -16.6 -1.4Z'
  const mesh = Array.from({ length: 9 }, (_, i) => `M${-14 + i * 4} -22L${-26 + i * 4} 0`).join('') + Array.from({ length: 9 }, (_, i) => `M${-18 + i * 4} -22L${-6 + i * 4} 0`).join('')
  const eyelets = [0, 1, 2, 3, 4].map((i) => { const t = i / 4; return [-2.4 + t * 11.6, -17.4 + t * 5.4] })
  const laces = eyelets.map(([x, y]) => `<path d="M${f(x - 1.4)} ${f(y - 1.3)}L${f(x + 1.5)} ${f(y + 1.3)}M${f(x - 1.4)} ${f(y + 1.3)}L${f(x + 1.5)} ${f(y - 1.3)}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${f(x - 1.4)} ${f(y - 1.3)}L${f(x + 1.5)} ${f(y + 1.3)}M${f(x - 1.4)} ${f(y + 1.3)}L${f(x + 1.5)} ${f(y - 1.3)}" stroke="${o.laces ?? P.white}" stroke-width=".75" stroke-linecap="round"/>`).join('')
  const tread = Array.from({ length: 12 }, (_, i) => `M${f(-20 + i * 3.6)} 3.4V5.4`).join('')
  const rivets = o.rivets
    ? [[-20.4, -6], [-20.6, -12], [-18.6, -17.4], [-12, -14.6], [14, -8.4], [19.6, -5.6], [-16, -4], [-8, -4], [0, -3.6], [8, -3.4], [16, -3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".95" fill="${IRON_L}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - 0.3)}" cy="${f(y - 0.3)}" r=".3" fill="#fff"/>`).join('')
    : ''
  return (
    k.draw([
      { d: OUTSOLE, fill: P.night, inner: `<path d="${tread}" stroke="${P.mid}" stroke-width=".7"/>` },
      {
        d: MIDSOLE, fill: sole,
        inner: k.sh(MIDSOLE, 0, 0, 0, 1, 0.1, 0.9, soleD, 0.4) + k.sh('M12 -4H27V6H12Z', 0, 0, 1, 0, 0, 0.6, soleD, 0.35) +
          `<path d="M-21 .6C-10 1.4 8 1.4 22.6 .2" fill="none" stroke="${soleD}" stroke-width=".45" opacity=".8"/>` +
          hair(-20, -1.4, -4, -.4, 14, -1, 0.6, '#fff', 0.9),
      },
      {
        d: UPPER, fill: up,
        inner:
          `<path d="${mesh}" stroke="${upD}" stroke-width=".25" opacity=".55"/>` +
          `<path d="${band}" fill="${stripe}"/>` + k.sh(band, 0, 0, 0, 1, 0, 0.7, P.wine, 0.35) +
          `<path d="M-19.6 -3C-14 -6 -9.6 -10.6 -4 -11C1 -11.4 4 -6.6 9.6 -6.4C13 -6.2 15.6 -7.4 17.4 -8.6" fill="none" stroke="#fff" stroke-width=".35" stroke-dasharray=".7 .6" opacity=".8"/>` +
          k.sh('M8 -24H26V0H8Z', 0, 0, 1, 0, 0, 0.6, upD, 0.4) + k.sh('M-24 -6H26V0H-24Z', 0, 0, 0, 1, 0, 0.6, upD, 0.35) +
          `<path d="M-23 -22H-14V0H-23Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="M-21.4 -2C-22.6 -7 -22.2 -13 -20.2 -17.6C-17 -14.4 -13.6 -12.6 -12 -9C-13 -6 -16.6 -3.6 -21.4 -2Z" fill="${upD}" opacity=".35"/>` +
          `<path d="M-9.6 -15.6C-8 -13.8 -5 -13.4 -2.4 -14.4" fill="none" stroke="${upD}" stroke-width=".5"/>` +
          hair(-20.6, -5, -21.4, -11, -19.6, -17, 0.7, '#fff', 0.85) + hair(2, -14.6, 9, -10.6, 16, -8, 0.5, '#fff', 0.8) +
          (o.over ?? ''),
      },
    ], 0.7) +
    `<path d="M-19.2 -19.6C-19.4 -22.6 -17.4 -24 -15.8 -22.4L-16.6 -18.6" fill="none" stroke="${P.ink}" stroke-width="1.7" stroke-linecap="round"/>` +
    `<path d="M-19.2 -19.6C-19.4 -22.6 -17.4 -24 -15.8 -22.4L-16.6 -18.6" fill="none" stroke="${stripe}" stroke-width=".8" stroke-linecap="round"/>` +
    `<path d="M-3.2 -18.4L10.4 -11" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M-3.2 -18.4L10.4 -11" stroke="${upD}" stroke-width="1" stroke-linecap="round" opacity=".6"/>` +
    laces +
    `<path d="M-3 -17.2C-5.6 -14.6 -4.6 -11.6 -6.6 -9.4M-1.6 -17C-.6 -13.6 -2 -11 -.6 -8.2" fill="none" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/>` +
    `<path d="M-3 -17.2C-5.6 -14.6 -4.6 -11.6 -6.6 -9.4M-1.6 -17C-.6 -13.6 -2 -11 -.6 -8.2" fill="none" stroke="${o.laces ?? P.white}" stroke-width=".6" stroke-linecap="round"/>` +
    rivets
  )
}

/** Rastro de velocidad: tres trazos que se afinan, hacia la izquierda de (x,y). */
const speed = (x: number, y: number, c = P.mid) =>
  hair(x, y, x - 7, y - 0.6, x - 14, y, 0.9, c, 0.8) + hair(x - 2, y + 5, x - 8, y + 4.6, x - 14, y + 5.2, 0.7, c, 0.7) + hair(x + 1, y - 5, x - 5, y - 5.6, x - 10, y - 5.2, 0.6, c, 0.6)

export const RUNNING_ART: Record<string, (u: number) => string> = {
  // ── Primero en la meta ────────────────────────────────────────────

  // Tres ganadas: la zapatilla recién salida de la caja, con el papel de seda y el olor a nuevo que sube.
  'Zapatillas nuevas': (u) => {
    const k = kit(u)
    const lid = 'M30 44.4L72.4 34.2L76.4 41L34 51.2Z'
    const lidSide = 'M34 51.2L76.4 41L76.8 44.6L34.4 54.8Z'
    const back = 'M33 70L42 62.4H93L84 70Z'
    const front = 'M33 70H84V93H33Z'
    const side = 'M84 70L93 62.4V85.4L84 93Z'
    const tissue = 'M35 70C38 64 41 60.6 45 63C48 58.6 52 60 54 62.6C58 58 63 59 65 62C69 58.4 74 59.6 76 63C80 60 85 61 87 64.6L84 70Z'
    return (
      k.day() +
      k.sun(60, 54, 15, 45, 32, false) +
      k.shade(ellipse(60, 54, 26, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(62, 94, 32, 3, P.mid) +
      k.cast([lid], 1.6, 1.8) +
      k.draw([
        { d: lidSide, fill: CARTON_D },
        { d: lid, fill: CARTON, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.6, CARTON_D, 0.4) + `<path d="M40 46L66 39.6" stroke="${P.white}" stroke-width="1.6"/><path d="M40 46L66 39.6" stroke="${P.red}" stroke-width=".6"/>` },
      ], 0.6) +
      k.draw([{ d: back, fill: CARTON_D, inner: k.sh(back, 0, 0, 0, 1, 0.6, 0.1, '#6E4A22', 0.4) }], 0.5) +
      k.draw([{ d: tissue, fill: P.white, inner: k.sh(tissue, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + hair(44, 64, 46, 67, 44, 70, 0.4, P.sky) + hair(64, 63, 66, 66, 64, 70, 0.4, P.sky) }], 0.45) +
      `<g transform="translate(60 64) rotate(-12) scale(1.02)">` + shoe(k) + `</g>` +
      k.draw([
        { d: side, fill: CARTON_D, inner: k.sh(side, 0, 0, 1, 0, 0, 0.6, '#6E4A22', 0.4) },
        {
          d: front, fill: CARTON,
          inner: k.sh(front, 0, 0, 1, 1, 0, 0.55, CARTON_D, 0.4) + `<path d="M33 70H84V73H33Z" fill="${CARTON_D}" opacity=".5"/>` +
            `<path d="M33 77.6H84" stroke="${P.white}" stroke-width="3"/><path d="M33 77.6H84" stroke="${P.red}" stroke-width="1"/>` +
            k.draw([{ d: roundRect(64, 82, 80, 89.6, 0.8), fill: P.white }], 0.3) +
            `<path d="M66 84.2H76M66 86H74M66 87.8H72" stroke="${P.ink}" stroke-width=".45"/>` +
            `<path d="M76.6 84V88.4M77.4 84V88.4M78.2 84V88.4" stroke="${P.ink}" stroke-width=".35"/>`,
        },
      ], 0.65) +
      `<text x="44" y="89.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="5" fill="${P.ink}" text-anchor="middle">42</text>` +
      hair(42, 50, 38, 44, 42, 37, 0.7, P.mid, 0.8) + hair(48, 49, 45, 42, 49, 34, 0.6, P.mid, 0.7) + hair(80, 46, 84, 40, 80, 33, 0.7, P.mid, 0.8) +
      sparkle(88, 32, 2.2) + sparkle(32, 32, 1.6) + sparkle(78, 54, 1.4, P.white) +
      k.defs()
    )
  },

  // Diez ganadas: la vuelta a los lagos de Palermo, con los botes y el camino de tierra; la zapatilla pasa volando.
  'Vuelta a los Lagos': (u) => {
    const k = kit(u)
    const park = ellipse(60, 62, 38, 22)
    const path = `${ellipse(60, 62, 33, 18)} ${ellipse(60, 62, 28.6, 14.4)}`
    const lake = 'M34 62C33 55 44 49 56 49.6C64 50 68 52.6 75 51.4C83 50.4 88 56 86 62C84.4 68 76 72.6 64 73C52 73.4 35.4 69 34 62Z'
    const tree = (x: number, y: number, r: number) => {
      const d = ellipse(x, y, r, r * 0.9)
      return k.draw([{ d: `M${f(x - 0.6)} ${y}H${f(x + 0.6)}V${f(y + r + 1.6)}H${f(x - 0.6)}Z`, fill: P.brownD }, { d, fill: GRASS, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, GRASS_D, 0.45) + `<circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.3)}" fill="#A9C27A"/>` }], 0.45)
    }
    // El bote a remo del lago, con sus dos remos.
    const boat = 'M-7 -1.4H7C6.4 1 4.6 2.2 2 2.2H-3.4C-5.4 2.2 -6.6 1 -7 -1.4Z'
    const arrows = [0.15, 0.48, 0.82].map((t) => {
      const a = t * Math.PI * 2 + Math.PI, x = 60 + Math.cos(a) * 30.8, y = 62 + Math.sin(a) * 16.2, rot = (Math.atan2(Math.cos(a) * 16.2, -Math.sin(a) * 30.8) * 180) / Math.PI
      return `<path d="M-1.6 -1.6L1.6 0L-1.6 1.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3" transform="translate(${f(x)} ${f(y)}) rotate(${f(rot + 180)})"/>`
    }).join('')
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(60, 76, 40, 6, P.mid) +
      k.draw([{ d: park, fill: GRASS, inner: k.sh(park, 0, 0, 0, 1, 0, 0.8, GRASS_D, 0.4) }], 0.7) +
      `<path d="${path}" fill-rule="evenodd" fill="#E9D3A6"/>` + k.shade(path, k.lin(CARTON_D, 0, 0, 0, 1, 0, 0.7), CARTON_D, 0.3) +
      `<path d="${ellipse(60, 62, 30.8, 16.2)}" fill="none" stroke="${CARTON_D}" stroke-width=".4" stroke-dasharray="1 1.4"/>` +
      arrows +
      k.draw([{ d: lake, fill: WATER, inner: k.sh(lake, 0, 0, 0, 1, 0, 0.8, WATER_D, 0.45) + `<path d="M42 58H52M60 55H70M48 66H60M68 64H78" stroke="#fff" stroke-width=".5" stroke-linecap="round" opacity=".8"/>` }], 0.5) +
      `<g transform="translate(64 61.6) rotate(-6)">` + `<path d="M-8.4 3.6L-2 -1M8.4 3.6L2 -1" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M-8.4 3.6L-2 -1M8.4 3.6L2 -1" stroke="${P.goldL}" stroke-width=".5" stroke-linecap="round"/>` +
        k.draw([{ d: boat, fill: P.red, inner: k.sh(boat, 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) + `<path d="M-6.6 -.4H6.6" stroke="${P.white}" stroke-width=".6"/>` }], 0.45) + `</g>` +
      tree(30.4, 52, 4.4) + tree(36, 47.4, 3.6) + tree(84, 47.6, 4) + tree(90, 54, 3.6) +
      speed(44, 84, P.mid) +
      `<g transform="translate(62 86) rotate(-6) scale(.78)">` + k.cast(SHOE, 1.8, 2) + shoe(k, { upper: P.sky1, upperD: P.blue }) + `</g>` +
      `<text x="60" y="35.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.2" fill="${P.ink}" text-anchor="middle">×10</text>` +
      sparkle(88, 36, 2) + sparkle(32, 74, 1.4, P.white) +
      k.defs()
    )
  },

  // Treinta ganadas: el dorsal de Los Ángeles 32 con la corona de laurel, bajo el sol de Mayo. Zabala, por su objeto.
  'Zabala del barrio': (u) => {
    const k = kit(u)
    const bib = 'M40 46.4C46 45.4 54 47.4 60 46.6C66 45.8 74 45.2 80 46.4L81.4 78.6C74 79.6 66 78.4 60 79.2C54 80 46 80.6 38.8 79.4Z'
    const pin = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-3.2 -.7H2.6A.9 .9 0 0 1 2.6 .7H-3.2" fill="none" stroke="${P.ink}" stroke-width="1.1"/><path d="M-3.2 -.7H2.6A.9 .9 0 0 1 2.6 .7H-3.2" fill="none" stroke="${P.goldL}" stroke-width=".45"/><circle cx="-3.4" cy="0" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/></g>`
    const wreath = laurel(48, 94, 26, 80, 34, 36, 9) + laurel(72, 94, 94, 80, 86, 36, 9, true)
    const frame = 'M43 50.4C48 49.8 54 51 60 50.6C66 50.2 72 49.6 77 50.4L78 75.6C72 76.4 66 75.4 60 76C54 76.6 48 77 42.2 76.2Z'
    return (
      k.day() +
      k.sun(60, 58, 16, 48) +
      k.shade(ellipse(60, 58, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      wreath +
      k.floor(60, 86, 24, 2.6, P.mid) +
      k.cast([bib], 2.2, 2.4) +
      k.draw([{
        d: bib, fill: P.white,
        inner:
          k.sh(bib, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) +
          `<path d="M36 44H84V52H36Z" fill="${P.sky}"/><path d="M36 73.6H84V82H36Z" fill="${P.sky}"/>` +
          `<path d="${frame}" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray="1.2 .8"/>` +
          hair(46, 56, 48, 66, 45, 76, 0.5, P.sky) + hair(72, 54, 74, 64, 71, 75, 0.5, P.sky) +
          `<path d="M38 46H48V80H38Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>`,
      }], 0.75) +
      `<text x="60" y="49.8" ${GEORGIA} font-size="2.8" letter-spacing=".5" fill="${P.ink}" text-anchor="middle">LOS ÁNGELES</text>` +
      `<text x="60.6" y="71" ${GEORGIA} font-weight="700" font-size="20" fill="${P.ink}" text-anchor="middle" transform="translate(.6 .6)">32</text>` +
      `<text x="60.6" y="71" ${GEORGIA} font-weight="700" font-size="20" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6" text-anchor="middle">32</text>` +
      `<path d="${starPath(60, 77.2, 1.9, 0.8, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      pin(42.6, 48.6, -20) + pin(77.4, 48.2, 20) + pin(42, 77, 20) + pin(78.4, 76.6, -20) +
      [[46.6, 31.6, 2.6], [60, 26, 3.2], [73.4, 31.6, 2.6]].map(([x, y, r]) => `<path d="${starPath(x, y, r, r * 0.42, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(x, y, r * 0.5, r * 0.2, 5)}" fill="${P.goldL}"/>`).join('') +
      sparkle(86, 44, 2.4, '#fff') + sparkle(34, 64, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Kilómetros en las piernas ─────────────────────────────────────

  // Cinco corridas: la media de compresión, tan ajustada que se para sola; las flechitas aprietan de los dos lados.
  'Medias de compresión': (u) => {
    const k = kit(u)
    const sock = 'M49.4 27H68.6C68.2 40 66.8 53 65.2 68.4C64.8 73 66.6 75.4 71 77C77 79.2 83 80.6 85.4 84C86.8 86.6 85.4 89.6 82.2 89.8H54.6C49.6 89.8 46.8 86.2 47.8 81.4C48.8 76 50.8 72 51.4 66C50.6 52 50 40 49.4 27Z'
    const cuff = 'M49.4 27H68.6L68.4 32.6H49.6Z'
    const heel = 'M51 72.6C47.6 76 46.4 80.6 47.8 84.6C49 88 51.6 89.8 54.6 89.8H58C55.6 86 55.6 80 57.6 75.6Z'
    const toe = 'M78 79.2C82 80.4 84.6 81.8 85.4 84C86.8 86.6 85.4 89.6 82.2 89.8H77.4C79 86.4 79.4 82.4 78 79.2Z'
    const bands = [36, 41, 46, 51, 56, 61].map((y, i) => `<path d="M44 ${y}Q59 ${y + 1.8} 74 ${y}V${y + 2.4 - i * 0.2}Q59 ${y + 4.2 - i * 0.2} 44 ${y + 2.4 - i * 0.2}Z" fill="${P.sky}" opacity="${f(0.55 + i * 0.07)}"/>`).join('')
    const rib = Array.from({ length: 9 }, (_, i) => `M${f(51 + i * 2)} 27.6V32`).join('')
    const squeeze = (x: number, y: number, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s} 1)"><path d="M0 0H5" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M0 0H5" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/><path d="M5.6 0L2.8 -2.2V2.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/></g>`
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(66, 91, 24, 2.6, P.mid) +
      k.cast([sock], 2.4, 2) +
      k.draw([{
        d: sock, fill: P.mid,
        inner:
          bands +
          k.sh(sock, 0, 0, 1, 0, 0, 0.7, P.night, 0.4) + k.sh('M40 70H90V92H40Z', 0, 0, 0, 1, 0, 0.6, P.night, 0.35) +
          `<path d="${heel}" fill="${P.gold}"/><path d="${toe}" fill="${P.gold}"/>` + k.sh(heel + toe, 0, 0, 1, 1, 0, 0.7, P.goldD, 0.45) +
          `<path d="${cuff}" fill="${P.white}"/><path d="${rib}" stroke="${P.sky}" stroke-width=".45"/>` +
          `<path d="M44 26H54V90H44Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
          hair(53, 34, 54, 50, 53.4, 66, 0.7, '#fff', 0.7) + hair(60, 80, 66, 83, 74, 83.4, 0.5, P.sky, 0.8),
      }], 0.75) +
      `<path d="M51 72.6C47.6 76 46.4 80.6 47.8 84.6M57.6 75.6C55.6 80 55.6 86 58 89.8M78 79.2C79.4 82.4 79 86.4 77.4 89.8" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      squeeze(37.4, 46, 1.4) + squeeze(38.4, 58, 1.4) + squeeze(78.4, 46, -1.4) + squeeze(76.2, 58, -1.4) +
      `<text x="80" y="40" ${GEORGIA} font-style="italic" font-weight="700" font-size="6.4" fill="${P.ink}" text-anchor="middle" transform="rotate(10 80 40)">¡uf!</text>` +
      sparkle(34, 32, 1.8) + sparkle(88, 70, 1.4) +
      k.defs()
    )
  },

  // Veinte corridas: el reloj con GPS de noche, la pantalla con el recorrido y la nubecita que lo sube todo.
  'Reloj con GPS': (u) => {
    const k = kit(u)
    const strapT = 'M50.6 22H69.4L68 42H52Z'
    const strapB = 'M52 78H68L69.4 100H50.6Z'
    const caseD = roundRect(39, 39.6, 81, 80.4, 9.6)
    const screen = roundRect(43, 43.6, 77, 76.4, 7)
    const route = 'M48.6 70.4C50 65 54.6 66.4 55.6 61.6C56.6 56.6 51.4 55 53 50.6C54.4 47 59.6 48.4 61.6 51.4C63.6 54.4 61 58.6 64.4 60.6C67.6 62.4 70.8 59.6 71.6 56'
    const pinD = 'M71.6 56C69.4 53.4 68.6 51.6 68.6 50.2A3 3 0 0 1 74.6 50.2C74.6 51.6 73.8 53.4 71.6 56Z'
    const holes = [30, 35, 84, 89, 94].map((y) => `<ellipse cx="60" cy="${y}" rx="1.4" ry="1" fill="${P.night}"/>`).join('')
    const cloud = 'M65.4 74C63.4 74 62.4 72.8 62.6 71.4C62.8 70 64 69.4 65 69.6C65.4 68 66.8 67.2 68.2 67.4C69.6 67.6 70.6 68.6 70.8 69.8C72.2 69.6 73.4 70.6 73.2 72C73 73.4 72 74 70.8 74Z'
    return (
      k.night() +
      [[30, 30], [92, 34], [26, 56], [96, 62], [40, 22], [82, 22], [30, 84], [90, 88]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 60, 32, 32), k.rad(P.sky, 0.5, 0.5, 0.5, 0.6, 0), P.sky, 0.35) +
      k.draw([
        { d: strapT, fill: P.red, inner: k.sh(strapT, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) + `<path d="M52 26H68" stroke="${P.wine}" stroke-width=".5"/>` },
        { d: strapB, fill: P.red, inner: k.sh(strapB, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) + holes },
      ], 0.6) +
      k.draw([{ d: 'M81 54H84.2C85 54 85.4 54.6 85.4 55.4V58.6C85.4 59.4 85 60 84.2 60H81Z', fill: P.white }, { d: 'M81 63H83.6C84.4 63 84.8 63.6 84.8 64.4V66.6C84.8 67.4 84.4 68 83.6 68H81Z', fill: P.red }], 0.45) +
      k.cast([caseD], 2, 2.2, '#0F1736') +
      k.draw([{
        d: caseD, fill: P.white,
        inner: k.sh(caseD, 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) + `<path d="M39 40H52V80H39Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return `<circle cx="${f(60 + Math.cos(a) * 19.4)}" cy="${f(60 + Math.sin(a) * 19.4)}" r=".35" fill="${P.blue}"/>` }).join(''),
      }], 0.75) +
      k.draw([{
        d: screen, fill: P.night,
        inner:
          `<path d="M43 44H77V60C66 54 52 52 43 54Z" fill="${P.mid}" opacity=".5"/>` +
          `<path d="M43 50H77M43 58H77M43 66H77M51 43V77M60 43V77M69 43V77" stroke="${P.mid}" stroke-width=".3" opacity=".7"/>` +
          `<path d="${route}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/>` +
          `<path d="${route}" fill="none" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
          `<circle cx="48.6" cy="70.4" r="1.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
          k.draw([{ d: cloud, fill: P.sky1 }], 0.3) + `<path d="M67.8 73V70M66.4 71.2L67.8 69.6L69.2 71.2" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round" stroke-linejoin="round"/>` +
          `<path d="M44 44C50 43.6 56 45.6 60 49" fill="none" stroke="#fff" stroke-width=".6" opacity=".35"/>`,
      }], 0.5) +
      k.draw([{ d: pinD, fill: P.red, inner: `<circle cx="71.6" cy="50.4" r="1.1" fill="${P.white}"/>` }], 0.4) +
      sparkle(32, 46, 2, P.paper) + sparkle(88, 76, 1.6, P.paper) +
      k.defs()
    )
  },

  // Sesenta corridas: la zapatilla de fierro, remachada como una caldera; al lado, la bolsa de hielo para las rodillas.
  'Maratonista de fierro': (u) => {
    const k = kit(u)
    // El yunque: la zapatilla se forjó ahí, a martillazos.
    const anvil = 'M40 68.6H85.4V74.6C81 75 77.6 76.4 75.6 79L74.6 84.4H50.4L49.4 79C47.6 76.6 44.6 75.4 40.6 74.8C34 74.4 29 72.6 25.6 69.4C30 68.8 35 68.6 40 68.6Z'
    const foot = 'M42.6 84.4H78.4C80.4 84.4 81.6 86 81.6 88V91.4H39.4V88C39.4 86 40.6 84.4 42.6 84.4Z'
    const sparks = [[30, 64, -150], [33, 58, -130], [88, 60, -40], [91, 66, -20], [26, 70, -170]].map(([x, y, a]) => {
      const r = (a * Math.PI) / 180
      return hair(x, y, x + Math.cos(r) * 2, y + Math.sin(r) * 2, x + Math.cos(r) * 4.4, y + Math.sin(r) * 4.4, 0.9, P.goldD)
    }).join('')
    return (
      k.day() +
      k.sun(60, 54, 15, 46, 32, false) +
      k.shade(ellipse(60, 56, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(46, 100, 28, 92, 25, 64, 8) + laurel(74, 100, 92, 92, 95, 64, 8, true) +
      k.floor(60, 92, 28, 2.6, P.mid) +
      k.cast([anvil, foot], 2, 2) +
      k.draw([
        { d: foot, fill: IRON_D, inner: k.sh(foot, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M40 88H81" stroke="${IRON}" stroke-width=".5"/>` },
        {
          d: anvil, fill: IRON,
          inner: k.sh(anvil, 0, 0, 1, 1, 0, 0.8, IRON_D, 0.5) + `<path d="M24 67H88V71.2C70 71.6 44 71.6 24 70.6Z" fill="${IRON_L}"/>` +
            `<path d="M50 77V84M75 77V84" stroke="${IRON_D}" stroke-width=".5"/>` + `<rect x="78.6" y="69.6" width="2.4" height="2.4" fill="${P.night}"/>` +
            hair(34, 71.4, 50, 72, 66, 71.4, 0.6, '#fff', 0.9),
        },
      ], 0.75) +
      `<text x="62" y="83" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.2" fill="${P.night}" text-anchor="middle">42 km</text>` +
      `<g transform="translate(60 62.6) rotate(-3) scale(1.08)">` + k.cast(SHOE, 1.6, 1.4) +
      shoe(k, {
        upper: IRON, upperD: IRON_D, stripe: P.gold, sole: IRON_L, soleD: IRON_D, laces: P.goldL, rivets: true,
        over: `<path d="M-14 -11C-10 -9 -6 -9.4 -2 -11" fill="none" stroke="${IRON_D}" stroke-width=".4"/>` + `<path d="M-23 -10H25" stroke="${IRON_D}" stroke-width=".35" stroke-dasharray="2 1"/>`,
      }) + `</g>` +
      sparks +
      sparkle(84, 40, 2.4, '#fff') + sparkle(34, 40, 1.8, '#fff') + sparkle(74, 52, 1.4, '#fff') +
      k.defs()
    )
  },
}
