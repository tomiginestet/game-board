// Bowling: las medallas redibujadas con el kit (../kit.ts). Los objetos del bowling: la bola con sus tres agujeros
// y su marmolado, el pino blanco con las dos rayas rojas, la pista de madera con sus flechas y las canaletas, y los
// zapatos bicolores. Al Dude no se lo dibuja: aparece por su ruso blanco y su alfombra.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, P, roundRect, sparkle, type Kit } from '../kit'
import { banner, bowlingBall, burst, GEORGIA, glow, pin, PIN, puff, speed, tinted } from './_bolas-piezas'

/** Lila de la ficha del juego, apagado. */
const LILA = '#8A75C9', LILA_D = '#4E3C8C', LILA_L = '#CFC4EE'
/** Madera de la pista. */
const LANE = '#EBCB98', LANE_L = '#F7E3BF', LANE_D = '#B98A52'
/** Café y crema del ruso blanco. */
const CAFE = '#5A3424', CREMA = '#F1E4CB'

const lilacDay = (k: Kit) => tinted(k, '#CFC5EC', '#A697D8', 0.5)

/** Zapato de bowling de perfil, la punta a la derecha y la suela en y=0. */
const SHOE = 'M-20 0C-21.2 -4 -21 -10 -19.6 -15C-19 -17.4 -17.4 -18.6 -15 -18.6H-6.2C-4.8 -18.6 -3.8 -17.8 -3.2 -16.6C-.2 -12.6 5.6 -10.2 11.6 -9.2C17.6 -8.2 22.2 -6.6 23.6 -3.6C24.4 -1.8 23.4 0 21.6 0Z'
const SOLE = 'M-20.6 -.4H22.6C24 -.4 24.6 .8 23.6 1.8C23 2.4 22 2.7 20.6 2.7H-19.2C-20.8 2.7 -21.4 1.3 -20.6 -.4Z'
const SADDLE = 'M-9.4 0C-9.6 -6 -7.6 -12.4 -4.2 -17.6C-1 -13.6 3.6 -11 8.4 -9.8C9 -6.4 8.8 -3 8 0Z'
const HEEL = 'M-22 2V-20H-11.6C-13.4 -13 -13.6 -6 -12.4 2Z'
const TOE = 'M12 2C13.4 -2 13.6 -6 12.2 -9.4L26 -8V2Z'

function shoe(k: Kit, o: { saddle?: string; saddleD?: string; heel?: string; number?: string } = {}) {
  const saddle = o.saddle ?? P.red, saddleD = o.saddleD ?? P.wine, heel = o.heel ?? P.mid
  const eyelets = [0, 1, 2, 3].map((i) => { const t = i / 3; return [-3.6 + t * 9.6, -15.4 + t * 4.8] })
  return (
    k.draw([
      { d: SOLE, fill: P.night, inner: `<path d="M-20 .6H22.6" stroke="${P.mid}" stroke-width=".4"/>` },
      {
        d: SHOE, fill: P.white,
        inner:
          `<path d="${HEEL}" fill="${heel}"/>` + `<path d="${TOE}" fill="${heel}"/>` + `<path d="${SADDLE}" fill="${saddle}"/>` +
          k.sh(SADDLE, 0, 0, 0, 1, 0, 0.7, saddleD, 0.4) +
          k.sh('M8 -20H26V2H8Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + k.sh('M-22 -5H26V2H-22Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
          `<path d="M-11.6 -19C-13.4 -12 -13.6 -6 -12.4 1M12.2 -9.4C13.6 -6 13.4 -2 12 0M-9.4 0C-9.6 -6 -7.6 -12.4 -4.2 -17.6M8.4 -9.8C9 -6.4 8.8 -3 8 0" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
          `<path d="M-10.6 -18.6C-12.4 -12 -12.6 -6 -11.4 0M-8.4 0C-8.6 -6 -6.8 -12 -3.6 -16.8M9.4 -9.4C10 -6.2 9.8 -3 9 0" fill="none" stroke="${P.white}" stroke-width=".3" stroke-dasharray=".7 .6" opacity=".9"/>` +
          `<path d="M14 -8.4C17.6 -7.4 20.4 -5.6 21.6 -3.4" fill="none" stroke="${P.sky}" stroke-width=".5"/>` +
          hair(-19.2, -3, -20, -9, -18.6, -15, 0.7, P.sky2, 0.8) + hair(11, -8.6, 16, -7.8, 21, -5, 0.6, '#fff', 0.8) +
          (o.number ? `<text x="-17.4" y="-6" ${GEORGIA} font-weight="700" font-size="6" fill="${P.white}" text-anchor="middle">${o.number}</text>` : ''),
      },
    ], 0.7) +
    eyelets.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
    eyelets.slice(0, 3).map(([x, y], i) => { const [x2, y2] = eyelets[i + 1]; return `<path d="M${f(x)} ${f(y)}L${f(x2)} ${f(y2 - 1.6)}M${f(x)} ${f(y - 1.6)}L${f(x2)} ${f(y2)}" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M${f(x)} ${f(y)}L${f(x2)} ${f(y2 - 1.6)}M${f(x)} ${f(y - 1.6)}L${f(x2)} ${f(y2)}" stroke="${P.white}" stroke-width=".6" stroke-linecap="round"/>` }).join('')
  )
}

export const BOWLING_ART: Record<string, (u: number) => string> = {
  // ── Línea perfecta ────────────────────────────────────────────────

  // Pasaste los cien sin barandas: la pista en perspectiva, la bola va derechito por el medio y las dos canaletas
  // quedan vacías.
  'Sin canaleta': (u) => {
    const k = kit(u)
    const lane = 'M51.6 30H68.4L84 104H36Z'
    const gutL = 'M48.6 30H51.6L36 104H28.4Z', gutR = 'M68.4 30H71.4L91.6 104H84Z'
    const planks = Array.from({ length: 9 }, (_, i) => { const t = (i + 1) / 10; return `M${f(51.6 + t * 16.8)} 30L${f(36 + t * 48)} 104` }).join('')
    const arrows = [-2, -1, 0, 1, 2].map((i) => { const x = 60 + i * 5.4, y = 82 - Math.abs(i) * 2.2; return `M${f(x)} ${f(y - 2.6)}L${f(x + 1.1)} ${f(y)}H${f(x - 1.1)}Z` }).join('')
    const pinsTop = [[60, 33.4], [57.4, 31.6], [62.6, 31.6]].map(([x, y]) => pin(k, `translate(${x} ${y}) scale(.17)`)).join('')
    return (
      lilacDay(k) +
      k.cast([lane], 1.6, 1.6, LILA_D) +
      k.draw([
        { d: gutL, fill: LILA_D, inner: k.sh(gutL, 0, 0, 1, 0, 0.8, 0, P.night, 0.4) + `<path d="M50.2 30L32 104" stroke="${LILA}" stroke-width=".5"/>` },
        { d: gutR, fill: LILA_D, inner: k.sh(gutR, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M69.8 30L88 104" stroke="${LILA}" stroke-width=".5"/>` },
        {
          d: lane, fill: LANE,
          inner: `<path d="${planks}" stroke="${LANE_D}" stroke-width=".35" opacity=".8"/>` +
            `<path d="M40 30H60L52 104H30Z" fill="${k.lin(LANE_L, 0, 0, 1, 0, 0.9, 0)}"/>` +
            k.sh(lane, 0, 0, 0, 1, 0.5, 0, LANE_D, 0.35) +
            `<path d="${arrows}" fill="${LILA_D}"/>` +
            `<path d="M60 36V66" stroke="${P.white}" stroke-width=".6" stroke-dasharray="1.4 1.4" opacity=".9"/>`,
        },
      ], 0.6) +
      pinsTop +
      k.floor(60, 93, 13, 2.4, LANE_D) +
      bowlingBall(k, 60, 80, 12.6, LILA, LILA_D, { swirl: LILA_L, rot: -8 }) +
      hair(46, 88, 44, 80, 46.6, 72, 0.7, P.mid, 0.6) + hair(74, 88, 76, 80, 73.4, 72, 0.7, P.mid, 0.6) +
      sparkle(35, 46, 1.8) + sparkle(86, 52, 1.4) +
      k.defs()
    )
  },

  // Ciento cincuenta: los zapatos ya son tuyos. El zapato bicolor, sin el número de alquiler en el talón, con su
  // etiqueta de recién comprado colgando del cordón.
  'Zapatos propios': (u) => {
    const k = kit(u)
    const tag = 'M0 0L4.6 -2.6H15.6C16.6 -2.6 17.2 -2 17.2 -1V7.6C17.2 8.6 16.6 9.2 15.6 9.2H4.6Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(60, 85.6, 30, 3, P.mid) +
      `<g transform="translate(58 82) scale(1.3)">` + k.cast([SHOE], 1.4, 1.2) + shoe(k, { saddle: P.red, saddleD: P.wine, heel: LILA_D }) + `</g>` +
      `<path d="M63.6 64.4C64 60 67 56.6 70.6 56.4" fill="none" stroke="${P.ink}" stroke-width=".9"/><path d="M63.6 64.4C64 60 67 56.6 70.6 56.4" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` +
      `<g transform="translate(70 56.4) rotate(-18)">` +
      k.draw([{ d: tag, fill: P.paper, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M5 -1.4H16" stroke="${P.gold}" stroke-width=".6"/>` }], 0.5) +
      `<circle cx="3" cy="0" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="10.6" y="5.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="5" fill="${P.ink}" text-anchor="middle">míos</text>` +
      `</g>` +
      sparkle(36, 44, 2) + sparkle(88, 76, 1.5) + sparkle(42, 66, 1.2) +
      k.defs()
    )
  },

  // Doscientos: el ruso blanco del Dude (café abajo, la crema arremolinada arriba, hielo) sobre su alfombra, con la
  // bola al lado. De noche, con el brillo de la pista.
  'El Gran Lebowski': (u) => {
    const k = kit(u)
    const glass = 'M37.6 56H70.4L68.6 91C68.5 92.8 67.2 94 65.4 94H42.6C40.8 94 39.5 92.8 39.4 91Z'
    const cream = 'M36 66C44 68.4 56 64 72 66.4V96H36Z'
    const cafe = 'M36 77.6C46 75 56 80.4 72 77V96H36Z'
    const base = 'M39 88.4H69V96H39Z'
    const ice = (x: number, y: number, r: number) => { const d = roundRect(-4.8, -4.4, 4.8, 4.4, 1.3); return `<g transform="translate(${x} ${y}) rotate(${r})"><path d="${d}" fill="${P.white}" opacity=".75" stroke="${P.sky}" stroke-width=".5"/><path d="M-3.4 -3.2H.8M-3.6 -3V0" stroke="#fff" stroke-width=".7" stroke-linecap="round"/></g>` }
    const rug = ellipse(60, 96, 42, 9.4)
    const rings = [34, 26, 18, 10].map((r, i) => `<path d="${ellipse(60, 96, r, r * 0.22)}" fill="none" stroke="${i % 2 ? P.goldL : P.red}" stroke-width="${i % 2 ? 0.8 : 1.6}"/>`).join('') +
      Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return `<path d="M${f(60 + Math.cos(a) * 37)} ${f(96 + Math.sin(a) * 8.2)}L${f(60 + Math.cos(a) * 40.6)} ${f(96 + Math.sin(a) * 9)}" stroke="${P.goldL}" stroke-width="1"/>` }).join('')
    return (
      k.night() +
      glow(k, 60, 64, 40, 34, 0.75, P.gold) +
      [[30, 34], [90, 30], [36, 24], [84, 46], [28, 56]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.draw([{ d: rug, fill: P.wine, inner: rings + k.sh(rug, 0, 0, 0, 1, 0, 0.5, P.night, 0.3) }], 0.55) +
      bowlingBall(k, 80.6, 84, 11.4, LILA_D, P.night, { swirl: LILA, rot: 20, hx: 0.05, hy: -0.25 }) +
      k.cast([glass], 2, 1.4, P.night) +
      k.draw([{
        d: glass, fill: P.sky1,
        inner:
          `<path d="${cream}" fill="${CREMA}"/>` + `<path d="${cafe}" fill="${CAFE}"/>` +
          hair(40, 79, 46, 73, 54, 78, 1.6, CREMA, 0.9) + hair(52, 79, 58, 74, 66, 77.6, 1.2, CREMA, 0.85) + hair(44, 84, 50, 80, 56, 83, 0.8, CREMA, 0.7) +
          hair(42, 70, 50, 74, 58, 70, 0.8, '#C9A27A', 0.8) + hair(56, 70, 62, 72.6, 68, 69.6, 0.6, '#C9A27A', 0.7) +
          ice(49, 64, -12) + ice(59.6, 63, 14) +
          `<path d="${base}" fill="${P.sky1}" opacity=".35"/><path d="M39 88.4H69" stroke="${P.white}" stroke-width=".6" opacity=".9"/>` +
          k.sh('M58 50H74V96H58Z', 0, 0, 1, 0, 0, 0.7, P.night, 0.25) +
          `<path d="M37 54H45L44 96H39Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
          hair(42.4, 60, 42, 74, 43, 86, 1, '#fff', 0.9),
      }], 0.75) +
      `<path d="M37.6 56H70.4" stroke="${P.white}" stroke-width=".7"/>` +
      `<text x="60" y="36" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.goldL}" text-anchor="middle">abide</text>` +
      `<path d="M44 38.6Q60 41 76 38.6" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
      sparkle(84, 56, 2.4, P.goldL) + sparkle(32, 70, 1.8, P.goldL) + sparkle(80, 28, 1.4, P.goldL) + sparkle(38, 46, 1.2, P.goldL) +
      k.defs()
    )
  },

  // ── Chuza ─────────────────────────────────────────────────────────

  // Cinco strikes: un pino sale volando, dando vueltas, hacia la pista de al lado; abajo, la bola y los caídos.
  'Bolo volador': (u) => {
    const k = kit(u)
    return (
      lilacDay(k) +
      k.sun(60, 58, 14, 44, 32, true) +
      k.floor(56, 95, 26, 2.6, P.mid) +
      `<path d="M40 74C46 58 56 48 68 44" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.6 1.4" opacity=".8"/>` +
      pin(k, 'translate(56 93) rotate(-78) scale(.8)') +
      pin(k, 'translate(68 92) rotate(80) scale(.75)') +
      bowlingBall(k, 46, 82, 10, P.mid, P.night, { swirl: P.sky, rot: 30 }) +
      `<g transform="translate(74 46) rotate(-128) scale(.85) translate(0 19)">` + k.cast([PIN], -1.4, 1.6) + `</g>` +
      pin(k, 'translate(74 46) rotate(-128) scale(.85) translate(0 19)') +
      hair(62, 32, 68, 27, 76, 27.4, 0.8, P.mid) + hair(90, 56, 92, 50, 90.6, 44, 0.8, P.mid) + hair(66, 37, 70, 33.6, 75, 33.4, 0.6, P.mid) +
      `<text x="88" y="70" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle" transform="rotate(-8 88 70)">¡ojo!</text>` +
      sparkle(32, 40, 1.8) +
      k.defs()
    )
  },

  // Veinticinco strikes: la bola baja por la pista prendida fuego y deja una estela de humo.
  'Pista de fuego': (u) => {
    const k = kit(u)
    return (
      k.night() +
      [[32, 30], [86, 26], [92, 72], [40, 20]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      puff(k, 30, 80, 9, P.sky1, P.blue) + puff(k, 40, 90, 6, P.sky1, P.blue) +
      `<path d="M24 96L96 84" stroke="${LANE_D}" stroke-width="1.2" opacity=".7"/>` +
      flame(k, 'translate(70 70) rotate(-104) scale(.62) translate(-60 -90)') +
      k.floor(70, 87, 14, 2.2, P.night) +
      bowlingBall(k, 70, 72, 13, P.wine, P.night, { swirl: P.red, rot: -20 }) +
      speed(56, 76, -10, 3, 14, 5, P.goldL, 0.8) +
      sparkle(88, 50, 2, P.goldL) + sparkle(84, 92, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Ochenta strikes: la bola entra al medio y los diez pinos vuelan para todos lados; uno ya está rajado.
  'Demoledor de pinos': (u) => {
    const k = kit(u)
    const flying: [number, number, number, number][] = [[36, 50, -60, 0.8], [84, 50, 58, 0.8], [46, 37, -24, 0.7], [75, 36, 30, 0.72], [60, 33, 4, 0.66]]
    return (
      k.day() +
      k.sun(60, 60, 15, 46, 32, false) +
      glow(k, 60, 62, 24, 22, 0.8) +
      flying.map(([x, y, r, s]) => pin(k, `translate(${x} ${y}) rotate(${r}) scale(${s}) translate(0 19)`, { crack: r === 4 })).join('') +
      burst(k, 60, 66, 15, 8, 9, 10) +
      k.floor(60, 92, 20, 2.6, P.mid) +
      bowlingBall(k, 60, 76, 13.4, P.ink, P.night, { swirl: P.gold, rot: 0 }) +
      banner(k, 60, 92, 44, P.gold, P.goldD, 'strike', P.ink, 4.6) +
      sparkle(30, 70, 2, P.white) + sparkle(90, 70, 2, P.white) + sparkle(60, 22, 1.6, P.white) +
      k.defs()
    )
  },
}
