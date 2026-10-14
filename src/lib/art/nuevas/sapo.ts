// Juego del sapo: el sapo de bronce sentado con la boca abierta, la mesa de madera de quinta con sus agujeros y sus
// casilleros numerados, y las fichas de bronce. El jugador aparece por su ficha; el sapo es el objeto, de metal fundido,
// con sus verrugas y la pátina verde en los pliegues.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { disc, glow, NEGRA_D, rotulo, stars, stream, WOOD, WOOD_D, WOOD_G, WOOD_L } from './_bar-piezas'

/** Bronce del sapo y de las fichas, con la pátina verde. */
const BR = '#C08245', BR_L = '#E8B676', BR_D = '#7A4A1E', BR_XD = '#4A2A10', PATINA = '#7FA493'
/** Oro del sapo de oro. */
const GOLD = { c: P.gold, l: P.goldL, d: P.goldD, xd: '#8A5212' }
const BRONZE = { c: BR, l: BR_L, d: BR_D, xd: BR_XD }
/** Pasto de la quinta y verde del camalote. */
const GRASS = '#8DA453', GRASS_D = '#5E7434', GRASS_L = '#B9C987'

// ── Piezas del sapo ──────────────────────────────────────────────────

const BODY = 'M-17 0C-21 -8 -19.6 -17 -14 -22.6C-15.4 -28 -11 -32.6 -7.6 -32.2C-4.6 -31.8 -3 -29 -3.2 -26.4C-1 -27 1 -27 3.2 -26.4C3 -29 4.6 -31.8 7.6 -32.2C11 -32.6 15.4 -28 14 -22.6C19.6 -17 21 -8 17 0Z'
const FOOT = 'M-21.4 1.2C-23 -.8 -21.6 -3.6 -18.6 -3.8C-16 -6 -11.6 -5.4 -10.2 -2.6C-9.4 -.6 -10 1.2 -12 1.2Z'
const MOUTH = ellipse(0, -16.4, 10, 6.2)

/** Sapo sentado de frente, con la base en (x,y): la boca abierta (con algo adentro, `inMouth`), los ojos de cúpula,
 * las verrugas, la pátina y las patas delanteras. `over` va encima, en coordenadas del sapo. */
function frog(k: Kit, x: number, y: number, s: number, o: { m?: typeof BRONZE; inMouth?: string; over?: string; rot?: number } = {}) {
  const m = o.m ?? BRONZE
  const warts = [[-12, -10], [-14, -15], [-9, -5], [12, -10], [14, -15], [9, -5], [-5, -3], [5, -3], [0, -6]]
    .map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".9" fill="${m.l}" stroke="${m.d}" stroke-width=".3"/>`).join('')
  const eye = (sx: number) =>
    `<circle cx="${sx * 8.2}" cy="-27.6" r="3.6" fill="${m.l}" stroke="${m.xd}" stroke-width=".45"/>` +
    `<path d="M${f(sx * 8.2 - 3.4)} -27.2C${f(sx * 8.2 - 2)} -25.4 ${f(sx * 8.2 + 2)} -25.4 ${f(sx * 8.2 + 3.4)} -27.2" fill="none" stroke="${m.xd}" stroke-width=".55"/>` +
    `<ellipse cx="${f(sx * 8.2 - 1.2)}" cy="-29" rx="1.2" ry=".7" fill="#fff" opacity=".9"/>`
  const foot = (sx: number) => ({
    d: FOOT, t: sx < 0 ? undefined : 'scale(-1 1)', fill: m.c,
    inner: k.sh(FOOT, 0, 0, 1, 1, 0, 0.8, m.d, 0.45) + `<path d="M-19.4 -1.6V1.2M-16.4 -2.8V1.2M-13.2 -2.4V1.2" stroke="${m.xd}" stroke-width=".4"/>`,
  })
  return (
    `<g transform="translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})">` +
    k.draw([
      {
        d: BODY, fill: m.c,
        inner: k.sh(BODY, 0, 0, 1, 0, 0, 0.7, m.d, 0.4) + k.sh('M-22 -12H22V2H-22Z', 0, 0, 0, 1, 0, 0.45, m.xd, 0.25) +
          `<path d="M-22 -34H-6V2H-22Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          `<path d="M-13 -21C-9 -24 9 -24 13 -21" fill="none" stroke="${PATINA}" stroke-width="1.1" opacity=".75"/>` +
          `<path d="M-15.6 -8C-12 -2 12 -2 15.6 -8" fill="none" stroke="${PATINA}" stroke-width=".9" opacity=".6"/>` +
          hair(-16, -18, -18, -10, -15.4, -3, 0.6, m.xd) + hair(16, -18, 18, -10, 15.4, -3, 0.7, m.xd) + warts,
      },
      foot(-1), foot(1),
    ], f(0.7 / s)) +
    `<path d="${MOUTH}" fill="${m.l}" stroke="${m.xd}" stroke-width="${f(0.5 / s)}"/>` +
    `<path d="${ellipse(0, -15.8, 8.6, 5.2)}" fill="${NEGRA_D}"/>` +
    k.clip(ellipse(0, -15.8, 8.6, 5.2), `<path d="${ellipse(0, -18.4, 8.6, 4)}" fill="#3A1E0C"/>` + (o.inMouth ?? '')) +
    `<path d="M-8.2 -18.2C-5 -21.4 5 -21.4 8.2 -18.2" fill="none" stroke="#fff" stroke-width=".5" opacity=".6"/>` +
    eye(-1) + eye(1) +
    (o.over ?? '') +
    `</g>`
  )
}

/** Ficha de bronce acostada. */
const ficha = (k: Kit, x: number, y: number, r: number, o: { gold?: boolean; top?: string } = {}) =>
  disc(k, x, y, r, f(r * 0.42), f(r * 0.24), o.gold ? { top: o.top } : { c: BR_L, edge: BR, dark: BR_D, top: o.top })

/** Ficha parada, vista de frente, con el canto a la derecha. */
function fichaUp(k: Kit, x: number, y: number, r: number, o: { gold?: boolean; inner?: string; rot?: number } = {}) {
  const c = o.gold ? P.gold : BR_L, e = o.gold ? P.goldD : BR, d = o.gold ? P.goldD : BR_D
  const face = ellipse(0, 0, r, r), rim = `M0 ${-r}H${f(r * 0.2)}A${r} ${r} 0 0 1 ${f(r * 0.2)} ${r}H0Z`
  return `<g transform="translate(${x} ${y}) rotate(${o.rot ?? 0})">` + k.draw([
    { d: rim, fill: e, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.8, BR_XD, 0.45) },
    {
      d: face, fill: c,
      inner: k.sh(face, 0, 0, 1, 1, 0, 0.85, d, 0.45) + `<path d="${face}" fill="${k.rad('#ffffff', 0.3, 0.28, 0.55, 0.8, 0)}"/>` +
        `<circle r="${f(r * 0.74)}" fill="none" stroke="${d}" stroke-width=".5"/><circle r="${f(r * 0.74)}" fill="none" stroke="#fff" stroke-width=".3" opacity=".6" transform="translate(-.3 -.3)"/>` +
        (o.inner ?? '') + hair(-r * 0.66, -r * 0.18, -r * 0.55, -r * 0.66, -r * 0.1, -r * 0.82, r * 0.09, '#fff', 0.9),
    },
  ], 0.55) + `</g>`
}

/** Mesa del sapo de frente, con la tapa en perspectiva entre y0 (fondo) e y1 (frente) y el frente hasta y2: la tapa
 * con sus agujeros y el frente con los casilleros numerados. */
function mesa(k: Kit, x0: number, x1: number, y0: number, y1: number, y2: number) {
  const dx = (y1 - y0) * 0.5
  const top = `M${x0 + dx} ${y0}H${x1 - dx}L${x1} ${y1}H${x0}Z`
  const front = `M${x0} ${y1}H${x1}V${y2}H${x0}Z`
  const legs = `M${x0 + 1.6} ${y2}h3.6v7h-3.6ZM${x1 - 5.2} ${y2}h3.6v7h-3.6Z`
  const w = x1 - x0, cx = (x0 + x1) / 2, ym = (y0 + y1) / 2
  const holes = [[-0.3, 0.68], [0.3, 0.68], [-0.33, 0.25], [0.33, 0.25]].map(([a, b]) => {
    const yy = y0 + (y1 - y0) * b, half = (w / 2) * (1 - (1 - b) * ((2 * dx) / w)), xx = cx + a * 2 * half
    return `<path d="${ellipse(f(xx), f(yy), f(w * 0.055), f((y1 - y0) * 0.13))}" fill="${NEGRA_D}" stroke="${WOOD_G}" stroke-width=".4"/>`
  }).join('')
  const n = 5, cw = w / n
  const slots = Array.from({ length: n }, (_, i) => {
    const sx = x0 + i * cw
    const mx = sx + cw / 2, my = y1 + (y2 - y1) * 0.42
    return `<path d="M${f(sx + 1.2)} ${f(y2 - 4.6)}H${f(sx + cw - 1.2)}V${f(y2 - 1.4)}H${f(sx + 1.2)}Z" fill="${NEGRA_D}"/>` +
      `<circle cx="${f(mx)}" cy="${f(my)}" r="${f(cw * 0.36)}" fill="${P.white}" stroke="${WOOD_G}" stroke-width=".4"/>` +
      `<text x="${f(mx)}" y="${f(my + 1.1)}" font-family="Georgia, serif" font-weight="700" font-size="${[3, 3.6, 2.6, 3.6, 3][i]}" fill="${i === 2 ? P.red : P.ink}" text-anchor="middle">${[500, 200, 1000, 200, 500][i]}</text>`
  }).join('')
  return (
    k.draw([
      { d: legs, fill: WOOD_D },
      { d: front, fill: WOOD, inner: slots + k.sh(front, 0, 0, 1, 1, 0, 0.6, WOOD_G, 0.4) + `<path d="M${x0} ${f(y2 - 4)}H${x1}" stroke="${WOOD_G}" stroke-width=".4"/>` },
      { d: top, fill: WOOD_L, inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, WOOD_D, 0.35) + hair(x0 + dx + 2, ym - 1, cx, ym - 2, x1 - dx - 2, ym, 0.4, WOOD) + holes },
    ], 0.65)
  )
}

/** Corona dorada de tres puntas con su base en (x,y). */
function crown(k: Kit, x: number, y: number, s: number, rot = 0) {
  const d = 'M-7 0L-8 -8L-4 -4.4L0 -10L4 -4.4L8 -8L7 0Z'
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="M-7 -1.6H7" stroke="${P.goldD}" stroke-width=".6"/>` + `<circle cx="0" cy="-3.4" r="1.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` }], f(0.55 / s)) +
    [[-8, -8], [0, -10], [8, -8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
    `</g>`
}

export const SAPO_ART: Record<string, (u: number) => string> = {
  // ── Beso de sapo ───────────────────────────────────────────────────

  // La primera ficha en la boca: entra con la estela movediza de un renacuajo, y el sapo hace "croac".
  'Renacuajo': (u) => {
    const k = kit(u)
    const tail = stream([[42, 64], [36, 59], [31, 63], [26, 58], [22, 61]], 7.4, 0.8)
    return (
      k.day() +
      k.sun(66, 58, 15, 46, 32, true) +
      glow(k, 66, 62, 22, 22, 0.6) +
      k.floor(68, 92, 22, 3) +
      frog(k, 68, 91, 1.3, { inMouth: `<path d="${ellipse(0, -12, 4, 2)}" fill="${BR_D}" opacity=".6"/>` }) +
      `<path d="${tail}" fill="${k.lin(BR_D, 0, 0, 1, 0, 0.1, 0.9)}"/>` +
      `<g transform="rotate(-14 44 64)">` + ficha(k, 44, 64, 7.6) + `</g>` +
      hair(53, 68, 55, 69.4, 57, 71.6, 0.8, BR_D) + hair(52, 60, 54, 60, 56, 61, 0.7, BR_D) +
      rotulo(82, 38, 7.4, '¡croac!', { rot: 12, c: P.ink, bold: true }) +
      hair(76, 42, 74, 44, 75, 47, 0.6, P.ink) + hair(80, 45, 78, 47, 80, 50, 0.5, P.ink) +
      sparkle(34, 70, 1.6) + sparkle(30, 36, 1.4) +
      k.defs()
    )
  },

  // Diez fichas en la boca: el sapo con corona de príncipe, un beso de rouge en el cachete y la ficha adentro.
  'Príncipe encantado': (u) => {
    const k = kit(u)
    const lips = 'M0 0C-1.6 -1.8 -4 -1.8 -5 0C-4 1.4 -2 2.6 0 2.6C2 2.6 4 1.4 5 0C4 -1.8 1.6 -1.8 0 0Z'
    const heart = (x: number, y: number, s: number) => `<path d="M0 2.4C-3 .4 -3.4 -2 -1.8 -2.6C-.9 -3 -.2 -2.4 0 -1.8C.2 -2.4 .9 -3 1.8 -2.6C3.4 -2 3 .4 0 2.4Z" transform="translate(${x} ${y}) scale(${s})" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>`
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(60, 92, 24, 3) +
      frog(k, 60, 91, 1.5, {
        inMouth: `<g transform="translate(0 -14)">` + `<path d="${ellipse(0, 0, 5, 2.2)}" fill="${BR_L}" stroke="${BR_XD}" stroke-width=".35"/><path d="${ellipse(0, -0.2, 3.4, 1.4)}" fill="none" stroke="${BR_D}" stroke-width=".3"/>` + `</g>`,
        over: crown(k, 0, -33.6, 0.52) +
          `<g transform="translate(-12.4 -15) rotate(-14) scale(.62)"><path d="${lips}" fill="${P.red}" opacity=".85"/><path d="M-4 0C-2 .4 2 .4 4 0" fill="none" stroke="${P.wine}" stroke-width=".5"/></g>`,
      }) +
      heart(86, 44, 1.2) + heart(80, 34, 0.8) + heart(34, 40, 0.9) +
      sparkle(36, 62, 1.6) + sparkle(88, 66, 1.6) +
      k.defs()
    )
  },

  // Cuarenta fichas: de noche en la laguna, tu ficha de oro con corona sobre el camalote, y dos sapos de bronce que
  // se inclinan a los costados.
  'Rey de la laguna': (u) => {
    const k = kit(u)
    const water = 'M-10 72H130V140H-10Z'
    const pad = 'M60 86C46 86 36 83 36 79C36 75 46 72 60 72C66 72 71 72.6 75 73.6L62 79L77 82.6C72 84.8 66 86 60 86Z'
    return (
      k.night() +
      stars([[28, 34], [92, 30], [36, 24, 0.4], [80, 22, 0.4], [96, 50, 0.4], [24, 52, 0.4]]) +
      `<path d="M83 32A7 7 0 1 0 83 46A5.6 5.6 0 1 1 83 32Z" fill="${P.paper}"/>` +
      k.draw([{ d: water, fill: P.mid, inner: k.sh(water, 0, 0, 0, 1, 0, 0.8, P.night, 0.45) + [[30, 78, 8], [80, 90, 10], [44, 96, 7], [90, 76, 6]].map(([x, y, l]) => hair(x - l, y, x, y - 0.6, x + l, y, 0.5, P.sky, 0.7)).join('') }], 0.5) +
      glow(k, 60, 56, 26, 24, 0.55, P.goldL) +
      `<path d="M60 74V98" stroke="${P.goldL}" stroke-width="5" opacity=".18"/>` +
      k.draw([{ d: pad, fill: GRASS, inner: k.sh(pad, 0, 0, 1, 1, 0, 0.75, GRASS_D, 0.45) + [-1, 1].map((sx) => hair(60, 79, 60 + sx * 10, 77, 60 + sx * 20, 79, 0.5, GRASS_D)).join('') + hair(42, 76, 50, 74, 58, 74, 0.6, GRASS_L) }], 0.6) +
      frog(k, 32, 84, 0.62, { rot: 16 }) + frog(k, 88, 84, 0.62, { rot: -16 }) +
      fichaUp(k, 60, 63, 12.4, {
        gold: true,
        inner: `<path d="${starPath(0, 0, 5, 2.1, 5)}" fill="${P.goldD}"/><path d="${starPath(-0.3, -0.3, 5, 2.1, 5)}" fill="none" stroke="#fff" stroke-width=".3" opacity=".7"/>` +
          Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * Math.PI * 2; return `<circle cx="${f(Math.cos(t) * 10.6)}" cy="${f(Math.sin(t) * 10.6)}" r=".45" fill="${P.goldL}"/>` }).join(''),
      }) +
      crown(k, 60, 50.4, 0.95) +
      sparkle(44, 44, 1.8, P.goldL) + sparkle(76, 54, 1.4, P.goldL) + sparkle(60, 30, 2, P.goldL) +
      k.defs()
    )
  },

  // ── Patio de quinta ────────────────────────────────────────────────

  // Cinco ganadas: la mesa del sapo en el patio, con el flan del postre esperando arriba y el humo del asado.
  'Mesa de quinta': (u) => {
    const k = kit(u)
    const grass = 'M-10 84C20 80 50 82 70 81C90 80 110 82 130 84V140H-10Z'
    const flan = 'M74.2 49.6L75.6 42.4C77 41.4 82 41.4 83.4 42.4L84.8 49.6C82 50.8 77 50.8 74.2 49.6Z'
    const caramel = 'M75.6 42.4C77 41.4 82 41.4 83.4 42.4L83.8 44.6C81 45.6 78 45.6 75.2 44.6Z'
    const smoke = (x: number) => hair(x, 44, x - 4, 36, x, 28, 1, P.blue, 0.6) + hair(x, 28, x + 4, 22, x, 16, 0.8, P.blue, 0.45)
    return (
      k.day() +
      k.sun(46, 46, 14, 44, 32, false) +
      smoke(26) + smoke(32) +
      k.draw([{ d: grass, fill: GRASS, inner: k.sh(grass, 0, 0, 0, 1, 0, 0.7, GRASS_D, 0.45) + Array.from({ length: 16 }, (_, i) => hair(4 + i * 7.4, 92 + (i % 3) * 4, 5 + i * 7.4, 89 + (i % 3) * 4, 7 + i * 7.4, 86.6 + (i % 3) * 4, 0.6, GRASS_D)).join('') }], 0.5) +
      k.floor(60, 92, 30, 2.6, GRASS_D) +
      mesa(k, 30, 90, 50, 62, 84) +
      frog(k, 55, 57.4, 0.46) +
      `<path d="${ellipse(79.5, 50.4, 7.4, 1.8)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{ d: flan, fill: P.goldL, inner: k.sh(flan, 0, 0, 1, 0, 0, 0.75, P.goldD, 0.4) + `<path d="${caramel}" fill="${P.brown}"/>` + `<path d="M76 47.4L76.6 43.8" stroke="#fff" stroke-width=".6" opacity=".8"/>` }], 0.45) +
      `<path d="M80.4 41.6C80 39 82 38 82.4 39.6C82.6 40.6 81.6 41 81.2 40.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      ficha(k, 40, 92, 3.4) +
      sparkle(90, 36, 1.8) + sparkle(36, 30, 1.4) +
      k.defs()
    )
  },

  // Veinte victorias: la pila de fichas gastadas y la de arriba parada, que brilla de tanto uso.
  'Ficha de bronce': (u) => {
    const k = kit(u)
    const stack = [90, 85.6, 81.2, 76.8, 72.4].map((y, i) => ficha(k, 50 + (i % 2 ? 1 : -0.6), y, 11.4)).join('')
    return (
      k.night() +
      stars([[28, 32], [92, 30], [24, 56, 0.4], [96, 54, 0.4], [40, 22, 0.4]]) +
      glow(k, 62, 52, 28, 26, 0.55, BR_L) +
      k.floor(56, 94, 22, 2.6, '#000') +
      stack +
      fichaUp(k, 70, 58, 14.4, {
        inner: `<text x="0" y="3" font-family="Georgia, serif" font-weight="700" font-size="8" fill="${BR_D}" text-anchor="middle">1000</text>` +
          hair(-8, 4, -2, 7, 6, 5.4, 0.5, BR_D, 0.7) + hair(4, -8, 7, -5, 8, 0, 0.4, BR_D, 0.6),
        rot: 10,
      }) +
      `<g transform="translate(60 46)">` + sparkle(0, 0, 5, '#fff') + `</g>` + sparkle(82, 70, 2.4, BR_L) + sparkle(40, 64, 1.8, BR_L) + sparkle(78, 42, 1.4, '#fff') +
      hair(84, 52, 88, 50, 92, 51, 0.6, BR_L) + hair(83, 60, 87, 60, 91, 62, 0.5, BR_L) +
      k.defs()
    )
  },

  // Cincuenta ganadas: el sapo de oro con moño, arriba de la caja de la mudanza. Es tuyo.
  'Sapo de oro': (u) => {
    const k = kit(u)
    const box = 'M30 66H90V98H30Z'
    const lidL = 'M30 66L22 60L38 58L48 66Z', lidR = 'M90 66L98 60L82 58L72 66Z'
    const bow = 'M0 0C-3 -4 -8 -5 -8.6 -2C-9 1 -4 1.6 0 0C4 1.6 9 1 8.6 -2C8 -5 3 -4 0 0Z'
    return (
      k.day() +
      k.sun(60, 46, 15, 48, 32, true) +
      glow(k, 60, 44, 24, 22, 0.7) +
      k.floor(60, 98, 34, 2.6) +
      k.draw([
        { d: lidL, fill: '#D2A774', inner: k.sh(lidL, 0, 0, 1, 1, 0, 0.6, P.brownD, 0.4) },
        { d: lidR, fill: '#C49563', inner: k.sh(lidR, 0, 0, 1, 1, 0, 0.7, P.brownD, 0.45) },
        {
          d: box, fill: '#D9B07A',
          inner: k.sh(box, 0, 0, 1, 1, 0, 0.7, P.brownD, 0.45) + `<path d="M52 66H68V98H52Z" fill="${P.goldL}" opacity=".75"/><path d="M52 66V98M68 66V98" stroke="${P.goldD}" stroke-width=".4"/>` +
            `<path d="M33 70V95M87 70V95" stroke="${P.brown}" stroke-width=".4" stroke-dasharray="1.4 1"/>`,
        },
      ], 0.7) +
      `<g transform="translate(60 86) rotate(-6)">` + k.draw([{ d: roundRect(-14, -4, 14, 4, 0.6), fill: P.white, inner: `<path d="M-14 -4H14V4H-14Z" fill="none" stroke="${P.red}" stroke-width="1"/>` }], 0.4) +
      rotulo(0, 1.8, 4.8, 'frágil', { c: P.red, bold: true }) + `</g>` +
      frog(k, 60, 66.6, 1.04, { m: GOLD, over: `<g transform="translate(0 -32)">` + k.draw([{ d: bow, fill: P.red, inner: k.sh(bow, 0, 0, 1, 1, 0, 0.7, P.wine, 0.4) }], 0.5) + `<circle r="1.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/></g>` }) +
      `<path d="M38 50C36 46 37 42 40 40M82 50C84 46 83 42 80 40" fill="none" stroke="${P.goldD}" stroke-width=".8"/>` +
      sparkle(36, 44, 2.2, '#fff') + sparkle(86, 48, 1.8, '#fff') + sparkle(54, 36, 1.6, '#fff') +
      k.defs()
    )
  },
}
