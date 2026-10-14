// Fútbol 7 / 11, la cancha grande. Los objetos: la pelota de gajos, el botín de tapones, el arco con su red de
// verdad, el guante de arquero, la camiseta y la pizarra del técnico. El verde del césped es el color propio.
// A las personas reales (Goycochea) no se las dibuja: aparecen por sus objetos (y por la regadera).
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { ball, banner, BOOT, boot, CUFF, GEORGIA, glove, goldBall, grass, GRASS, GRASS_D, GRASS_L, net, PALM, THUMB } from './_cancha-piezas'

/** Arco de frente: travesaño y palos blancos, de x0 a x1, con el travesaño en y0 y la base en y1. */
function goalFrame(k: Kit, x0: number, x1: number, y0: number, y1: number, w = 3.4) {
  const bar = roundRect(x0, y0, x1, y0 + w, w / 2), postL = roundRect(x0, y0, x0 + w, y1, w / 2), postR = roundRect(x1 - w, y0, x1, y1, w / 2)
  return (
    k.cast([bar, postL, postR], 1.6, 1.6, P.mid) +
    k.draw([
      { d: postL, fill: P.white, inner: k.sh(postL, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) },
      { d: postR, fill: P.white, inner: k.sh(postR, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) },
      { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.75, P.blue, 0.4) + `<path d="M${x0 + 1} ${f(y0 + 1)}H${x1 - 1}" stroke="#fff" stroke-width=".6"/>` },
    ], 0.6)
  )
}

/** Camiseta a bastones, centrada en (0,0): mangas cortas, cuello en V y el número en la espalda... de frente. */
const SHIRT = 'M-7 -17C-4 -14.6 4 -14.6 7 -17L16.6 -12.6C18.6 -11.6 20 -9.8 21 -7.6L23 -2.6L15.4 .6L13 -3.6V17C13 18.2 12.2 19 11 19H-11C-12.2 19 -13 18.2 -13 17V-3.6L-15.4 .6L-23 -2.6L-21 -7.6C-20 -9.8 -18.6 -11.6 -16.6 -12.6Z'
function shirt(k: Kit, o: { base?: string; stripe?: string; dark?: string; num?: string; numC?: string } = {}) {
  const base = o.base ?? P.white, stripe = o.stripe ?? P.sky, dark = o.dark ?? P.blue
  const stripes = [-9, -1.6, 5.8].map((x) => `M${x} -20H${f(x + 3.6)}V20H${x}Z`).join('')
  return (
    k.draw([{
      d: SHIRT, fill: base,
      inner:
        `<path d="${stripes}" fill="${stripe}"/>` +
        k.sh('M2 -20H24V20H2Z', 0, 0, 1, 0, 0, 0.7, dark, 0.4) + `<path d="M-24 -20H-8V20H-24Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
        `<path d="M-23 -2.6L-15.4 .6L-14.6 -1M23 -2.6L15.4 .6L14.6 -1" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="M-22.2 -4.4L-15 -1.4M22.2 -4.4L15 -1.4" stroke="${P.night}" stroke-width="1.4"/>` +
        `<path d="M-13 -3.6C-12 -7 -12 -10 -13.6 -13M13 -3.6C12 -7 12 -10 13.6 -13" fill="none" stroke="${dark}" stroke-width=".4"/>` +
        hair(-10, 4, -10.6, 10, -9.6, 16, 0.6, dark) + hair(6, 2, 7.4, 9, 6, 16, 0.6, dark),
    }], 0.7) +
    `<path d="M-7 -17C-4 -14.6 4 -14.6 7 -17L0 -9.6Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
    (o.num ? `<text x="0" y="9" ${GEORGIA} font-weight="700" font-size="14" fill="${o.numC ?? P.night}" stroke="${P.white}" stroke-width=".5" paint-order="stroke" text-anchor="middle">${o.num}</text>` : '')
  )
}

/** Pedestal de museo de dos escalones, con la base en y=0 y la tapa en y=-14. */
function pedestal(k: Kit, w: number, o: { gold?: boolean; plaque?: string } = {}) {
  const base = `M${-w / 2 - 3} 0H${w / 2 + 3}L${w / 2 + 1.6} -5H${-w / 2 - 1.6}Z`
  const body = roundRect(-w / 2, -14, w / 2, -5, 0.8)
  const fill = o.gold ? P.night : P.mid
  return (
    k.draw([
      { d: base, fill, inner: k.sh(base, 0, 0, 1, 0, 0, 0.8, '#0F1736', 0.4) + `<path d="M${-w / 2 - 2} -1.6H${w / 2 + 2}" stroke="${P.gold}" stroke-width=".5"/>` },
      { d: body, fill: P.sky, inner: k.sh(body, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + `<path d="M${-w / 2} -14H${-w / 2 + 4}V-5H${-w / 2}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` },
    ], 0.6) +
    (o.plaque
      ? `<path d="${roundRect(-w / 2 + 3, -12.4, w / 2 - 3, -6.6, 0.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
        `<text x="0" y="-8" ${GEORGIA} font-style="italic" font-weight="700" font-size="4" fill="${P.ink}" text-anchor="middle">${o.plaque}</text>`
      : '')
  )
}

/** Volutas de fileteado: espiral entintada, dorada y con su brillo. */
function voluta(d: string, c = P.gold) {
  return (
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#fff" stroke-width=".3" stroke-linecap="round" transform="translate(-.3 -.3)" opacity=".85"/>`
  )
}

/** Mitón de arquero chiquito (para las puntas de los tentáculos): la palma con la muñequera, la punta hacia arriba. */
function mitten(k: Kit, x: number, y: number, rot: number, s: number, shell = P.white, latex = P.sky1) {
  const d = 'M-4.4 4V-3.6C-4.4 -6.6 -2.4 -8.4 0 -8.4C2.4 -8.4 4.4 -6.6 4.4 -3.6V4Z'
  const th = 'M-4.2 1.4C-6.8 .4 -7.6 -2 -7 -3.6C-6.2 -4.8 -4.8 -3.8 -4.2 -2.4Z'
  const cuff = roundRect(-4.8, 3, 4.8, 7, 1.2)
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([
      { d: th, fill: shell },
      { d, fill: shell, inner: `<path d="M-3.2 4V-3.4C-3.2 -5.6 -1.8 -7.2 0 -7.2C1.8 -7.2 3.2 -5.6 3.2 -3.4V4Z" fill="${latex}"/>` + `<path d="M-1.6 -6.6V2M1.6 -6.6V2" stroke="${P.blue}" stroke-width=".4"/>` + k.sh(d, 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) },
      { d: cuff, fill: P.night, inner: `<path d="M-4.8 4.6H4.8" stroke="${P.gold}" stroke-width=".7"/>` },
    ], f(0.6 / s)) +
    `</g>`
  )
}

export const FUTBOL_ART: Record<string, (u: number) => string> = {
  // ── Cañonero ──────────────────────────────────────────────────────

  // Cinco goles en cancha grande: la pelota infla la red de verdad, que suena distinto ("¡fsss!").
  'Primera red': (u) => {
    const k = kit(u)
    const C = [60, 60]
    const inside = 'M27.4 35.4H92.6V90H27.4Z'
    const bend = (x: number, y: number): [number, number] => {
      const dx = x - C[0], dy = y - C[1], d = Math.hypot(dx, dy) || 1
      if (d > 24) return [x, y]
      const push = Math.pow((24 - d) / 24, 1.4) * 7.6
      return [x + (dx / d) * push, y + (dy / d) * push]
    }
    return (
      k.day() +
      k.sun(60, 60, 18, 48, 28, false) +
      grass(k, 86) +
      `<path d="${inside}" fill="${P.night}" opacity=".16"/>` +
      ball(k, C[0], C[1], 15.4, { a: 0.4, b: 0.5, c: -0.1 }) +
      k.clip(inside, k.shade(ellipse(C[0], C[1], 22, 22), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.5, 0), '#ffffff', 0.3)) +
      net(k, inside, 27.4, 35.4, 92.6, 90, 5.4, bend, P.white) +
      `<path d="M20 90H100" stroke="${P.white}" stroke-width="1.3"/>` +
      goalFrame(k, 24, 96, 32, 90) +
      [-1, 1].map((s) => [0, 1, 2].map((i) => {
        const r = 25 + i * 3.6
        return hair(60 + s * r * 0.82, 60 - r * 0.5, 60 + s * (r + 2), 60, 60 + s * r * 0.82, 60 + r * 0.5, 0.75 - i * 0.12, P.ink, 0.85)
      }).join('')).join('') +
      `<text x="60" y="27.6" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" text-anchor="middle">¡fsss!</text>` +
      sparkle(36, 26, 1.8) + sparkle(86, 26, 1.6) +
      k.defs()
    )
  },

  // Veinticinco: no corrés, pero siempre estás donde cae. El botín quieto sobre la cruz de tiza, y la pelota que baja justo ahí.
  'Nueve de área': (u) => {
    const k = kit(u)
    const area = 'M14 104L28 78H92L106 104'
    return (
      k.day() +
      k.sun(60, 54, 15, 44, 32, false) +
      grass(k, 72) +
      `<path d="${area}" fill="none" stroke="${P.white}" stroke-width="1.4" opacity=".9"/>` +
      `<path d="M2 72.6H118" stroke="${P.white}" stroke-width="1.2" opacity=".9"/>` +
      `<path d="M40 78Q60 70 80 78" fill="none" stroke="${P.white}" stroke-width="1" opacity=".8"/>` +
      `<ellipse cx="60" cy="88" rx="16" ry="3.6" fill="none" stroke="${P.white}" stroke-width=".9" stroke-dasharray="1.6 1.2"/>` +
      k.floor(60, 89.6, 18, 2.4, GRASS_D) +
      `<g transform="translate(62 87.4) scale(.92)">` + k.cast([BOOT], 1.4, 1.2, GRASS_D) + boot(k) + `</g>` +
      `<path d="M92 26Q86 40 76 54" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-dasharray="1.4 1.6" stroke-linecap="round"/>` +
      ball(k, 70, 60, 9, { a: 0.9, b: 0.3 }) +
      hair(76, 46, 74.6, 50, 75.4, 53, 0.7, P.mid) + hair(80, 48, 78.6, 52, 79.6, 55, 0.6, P.mid) +
      sparkle(88, 66, 1.8) + sparkle(30, 62, 1.4) +
      k.defs()
    )
  },

  // Ochenta: te piden los botines para el museo del club. En la vitrina, sobre el almohadón, con su chapita.
  'Artillero de la liga': (u) => {
    const k = kit(u)
    const glass = 'M33 34H87V82H33Z'
    const lid = 'M31 30.4H89V34.4H31Z'
    const cushion = 'M38 78.6C38 75.4 41 74 46 74H74C79 74 82 75.4 82 78.6C82 81 79 82 74 82H46C41 82 38 81 38 78.6Z'
    return (
      k.stage(60, 58, 34) +
      k.shade(ellipse(60, 52, 24, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      laurel(46, 102, 26, 94, 24, 62, 8) + laurel(74, 102, 94, 94, 96, 62, 8, true) +
      k.floor(60, 98, 26, 2.4, P.mid) +
      `<g transform="translate(60 98)">` + pedestal(k, 52, { gold: true, plaque: '80 goles' }) + `</g>` +
      k.draw([{ d: cushion, fill: P.red, inner: k.sh(cushion, 0, 0, 0, 1, 0, 0.8, P.wine, 0.45) + `<path d="M42 75.8C50 75 70 75 78 75.8" fill="none" stroke="#F39A96" stroke-width=".6"/>` + [42, 78].map((x) => `<circle cx="${x}" cy="78" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`).join('') }], 0.55) +
      `<g transform="translate(60.6 74.6) rotate(-6) scale(.98)">` + boot(k, { studs: P.gold, stripe: P.gold, stripeD: P.goldD }) + `</g>` +
      `<path d="${glass}" fill="${P.sky1}" opacity=".22"/>` +
      `<path d="M36 80L52 36H58L42 80ZM46 80L60 41H62.6L49 80Z" fill="#fff" opacity=".45"/>` +
      `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width="1.1"/><path d="${glass}" fill="none" stroke="${P.white}" stroke-width=".4" transform="translate(-.5 -.5)"/>` +
      k.draw([{ d: lid, fill: P.gold, inner: k.sh(lid, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.45) + `<path d="M32 31.4H88" stroke="${P.goldL}" stroke-width=".5"/>` }], 0.55) +
      `<g transform="translate(60 30.4)">` + voluta('M-2 0C-2 -3.6 -7 -4.6 -9 -2.2C-10.4 -.6 -9 1 -7.6 .2') + voluta('M2 0C2 -3.6 7 -4.6 9 -2.2C10.4 -.6 9 1 7.6 .2') +
      `<path d="${starPath(0, -3, 2.4, 1, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/></g>` +
      sparkle(80, 44, 2.4, '#fff') + sparkle(40, 50, 1.6, '#fff') + sparkle(92, 30, 1.8, P.goldL) +
      k.defs()
    )
  },

  // ── Crack de la fecha ─────────────────────────────────────────────

  // La figura del partido: la camiseta en la foto instantánea para las redes del club, con su corazón.
  'Jugador de la fecha': (u) => {
    const k = kit(u)
    const frame = roundRect(-21, -26, 21, 26, 1.2)
    const photo = 'M-17.4 -22.4H17.4V13H-17.4Z'
    const heart = 'M0 3.6C-5.4 .2 -6.4 -4 -4 -5.8C-2.4 -7 -.8 -6.2 0 -4.8C.8 -6.2 2.4 -7 4 -5.8C6.4 -4 5.4 .2 0 3.6Z'
    const tape = roundRect(-6, -2, 6, 2, 0.4)
    return (
      k.day() +
      k.sun(60, 58, 16, 46, 32, false) +
      k.cast([`M39 34H81V86H39Z`], 2.6, 2.6) +
      `<g transform="translate(60 60) rotate(-5)">` +
      k.draw([{ d: frame, fill: P.white, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.6) +
      `<path d="${photo}" fill="${GRASS}"/>` + k.clip(photo, k.sh(photo, 0, 0, 0, 1, 0, 0.6, GRASS_D, 0.4) + `<path d="M-17.4 -22.4H17.4V-6H-17.4Z" fill="${P.sky}"/>` + k.shade(photo, k.rad(P.goldL, 0.3, 0.2, 0.6, 0.9, 0), P.goldL, 0.4) + `<path d="M-18 -6H18" stroke="${GRASS_D}" stroke-width=".6"/>` +
        `<g transform="translate(0 -3.6) scale(.68)">${shirt(k, { num: '10' })}</g>`) +
      `<path d="${photo}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<text x="0" y="21.4" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle">la figura</text>` +
      `<g transform="translate(0 -26.6) rotate(4)"><path d="${tape}" fill="${P.goldL}" opacity=".85" stroke="${P.goldD}" stroke-width=".3"/></g>` +
      `</g>` +
      `<g transform="translate(84 40) rotate(10)">` +
      k.draw([{ d: ellipse(0, -1, 9, 9), fill: P.red, inner: k.sh(ellipse(0, -1, 9, 9), 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], 0.55) +
      `<path d="${heart}" fill="${P.white}" transform="translate(0 0) scale(.95)"/>` +
      `</g>` +
      sparkle(32, 34, 2) + sparkle(90, 78, 1.6) + sparkle(30, 82, 1.4) +
      k.defs()
    )
  },

  // Cinco veces figura: fijo en el equipo ideal. La pizarra del técnico con el 4-3-3 en tiza, y vos, la estrella.
  'Once ideal': (u) => {
    const k = kit(u)
    const board = roundRect(26, 32, 94, 86, 2)
    const slate = 'M30 36H90V82H30Z'
    const pos: [number, number][] = [[60, 77], [39, 68], [52, 70], [68, 70], [81, 68], [44, 57], [60, 59], [76, 57], [42, 45], [60, 42], [78, 45]]
    const chalk = 'rgba(244,239,228,.9)'
    return (
      k.stage(60, 58, 34) +
      k.floor(60, 96, 26, 2.6, P.mid) +
      `<path d="M38 86L33 98M82 86L87 98" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M38 86L33 98M82 86L87 98" stroke="${P.brown}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.cast([board], 2.4, 2.4) +
      k.draw([{ d: board, fill: P.brown, inner: k.sh(board, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M26 32H94V35H26Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.6, 0)}"/>` + hair(28, 40, 28.6, 60, 28, 80, 0.4, P.brownD) }], 0.75) +
      `<path d="${slate}" fill="${GRASS_D}"/>` + k.clip(slate, k.sh(slate, 0, 0, 1, 1, 0, 0.7, '#2E461A', 0.45) + `<path d="M30 36H50V82H30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.12, 0)}"/>` +
        `<path d="M30.8 36.8H89.2V81.2H30.8ZM30.8 59H89.2M50 81.2V74H70V81.2M50 36.8V44H70V36.8" fill="none" stroke="${chalk}" stroke-width=".5" opacity=".6"/><circle cx="60" cy="59" r="5" fill="none" stroke="${chalk}" stroke-width=".5" opacity=".6"/>`) +
      `<path d="${slate}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      pos.map(([x, y], i) => i === 9 ? '' : `<circle cx="${x}" cy="${y}" r="2.3" fill="none" stroke="${chalk}" stroke-width="1"/>`).join('') +
      `<path d="M52 70Q58 64 60 59M68 70Q74 60 78 45" fill="none" stroke="${chalk}" stroke-width=".6" stroke-dasharray="1.2 1"/>` +
      `<path d="M76.6 47.6L78 45L75.2 45.6" fill="none" stroke="${chalk}" stroke-width=".6"/>` +
      `<path d="${starPath(60, 42, 5.2, 2.2, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><path d="${starPath(60, 42, 2.6, 1.1, 5)}" fill="${P.goldL}"/>` +
      `<path d="${roundRect(80, 83.6, 87, 85.6, 0.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="60" y="30" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle">4-3-3</text>` +
      sparkle(66, 38, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Quince veces figura: el balón de oro de la liga, en su trofeo, con el sol de Mayo. Te conocen hasta en el buffet.
  'Balón de oro de la liga': (u) => {
    const k = kit(u)
    const cup = 'M50 64C50 68 54 70.6 60 70.6C66 70.6 70 68 70 64Z'
    const stem = 'M56.6 70.4H63.4L64.6 77H55.4Z'
    const base = 'M46 84H74L72.4 77H47.6Z'
    return (
      k.day() +
      k.sun(60, 48, 18, 48) +
      k.shade(ellipse(60, 50, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(48, 100, 28, 92, 26, 60, 8) + laurel(72, 100, 92, 92, 94, 60, 8, true) +
      k.floor(60, 84.6, 18, 2.2, P.mid) +
      k.draw([
        { d: base, fill: P.night, inner: k.sh(base, 0, 0, 1, 0, 0, 0.8, '#0F1736', 0.4) + `<path d="M47.2 81H72.8" stroke="${P.gold}" stroke-width=".6"/>` },
        { d: stem, fill: P.gold, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M56 73.6H64" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: cup, fill: P.gold, inner: k.sh(cup, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M51 64.6C52 67.6 55 69.2 58 69.4" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` },
      ], 0.6) +
      `<g transform="translate(60 64)">` + voluta('M-10 0C-14 0 -16 -4 -13.6 -6.4C-12 -8 -9.6 -7 -10.2 -5.2') + voluta('M10 0C14 0 16 -4 13.6 -6.4C12 -8 9.6 -7 10.2 -5.2') + `</g>` +
      goldBall(k, 60, 47, 15.6, { a: 0.35, b: -0.4, c: 0.2 }) +
      sparkle(52, 38, 2.6, '#fff') + sparkle(71, 57, 1.4, '#fff') +
      banner(k, 60, 88.4, 36, P.white, P.sky, 'de la liga', P.ink, 4.2) +
      sparkle(86, 30, 2.2, P.goldL) + sparkle(32, 34, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Arquerazo ─────────────────────────────────────────────────────

  // El primer penal atajado: los guantes la agarran firme, y el pan de manteca queda tachado. Nadie lo esperaba.
  'Manos de manteca no': (u) => {
    const k = kit(u)
    const butter = 'M-9 -3.6L5 -6.4L11 -3L-3 .2Z'
    const bSide = 'M-9 -3.6L-3 .2V5L-9 1.2Z'
    const bFront = 'M-3 .2L11 -3V1.8L-3 5Z'
    const paper = 'M-10.6 -1.6L-3 3L-3 7L-10.6 2.6Z'
    return (
      k.stage(60, 58, 34) +
      grass(k, 78, false) +
      k.floor(60, 92, 14, 2, GRASS_D) +
      ball(k, 60, 52, 13, { a: 0.6, b: 0.2 }) +
      `<g transform="translate(45 56) rotate(-16) scale(-.68 .68)">` + k.cast([PALM, CUFF], 2, 2, P.mid) + glove(k) + `</g>` +
      `<g transform="translate(75 56) rotate(16) scale(.68)">` + k.cast([PALM, CUFF], 2, 2, P.mid) + glove(k) + `</g>` +
      `<g transform="translate(59 87) scale(1.05)">` +
      k.draw([
        { d: paper, fill: P.white, inner: `<path d="M-10 0L-3.6 3.8" stroke="${P.sky}" stroke-width=".4"/>` },
        { d: bSide, fill: P.goldL, inner: k.sh(bSide, 0, 0, 1, 0, 0, 0.6, P.gold, 0.4) },
        { d: bFront, fill: P.goldL, inner: k.sh(bFront, 0, 0, 1, 0, 0.2, 0.8, P.gold, 0.4) },
        { d: butter, fill: '#FBEBB8', inner: `<path d="M-4 -3.4L4 -5" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` },
      ], 0.5) +
      `<circle cx="1" cy="-.6" r="9.6" fill="none" stroke="${P.ink}" stroke-width="2.6"/><circle cx="1" cy="-.6" r="9.6" fill="none" stroke="${P.red}" stroke-width="1.5"/>` +
      `<path d="M-5.8 6.2L7.8 -7.4" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M-5.8 6.2L7.8 -7.4" stroke="${P.red}" stroke-width="1.5" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(34, 34, 2) + sparkle(84, 32, 1.6) +
      k.defs()
    )
  },

  // Tres penales atajados: tenés ocho brazos. Bajo el travesaño, de noche, ocho tentáculos con sus guantes.
  'Pulpo bajo el arco': (u) => {
    const k = kit(u)
    const OCT = P.red, OCT_D = P.wine
    // Cada tentáculo: base en el manto, punta, y cuánto se curva (la punta lleva su guante).
    const arms: [number, number, number, number, number][] = [
      [50, 86, 30, 66, -10], [70, 86, 90, 66, 10], [52, 84, 34, 46, 8], [68, 84, 86, 46, -8],
      [56, 82, 48, 34, -10], [64, 82, 72, 34, 10], [47, 90, 30, 84, -6], [73, 90, 90, 84, 6],
    ]
    let tent = '', tips = ''
    for (const [x0, y0, x1, y1, c] of arms) {
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy)
      const cx = mx - (dy / l) * c, cy = my + (dx / l) * c
      const d = taper(x0, y0, cx, cy, x1, y1, 6.4, 2.6)
      const pts = [0.25, 0.45, 0.65].map((t) => { const a = 1 - t; return [a * a * x0 + 2 * a * t * cx + t * t * x1, a * a * y0 + 2 * a * t * cy + t * t * y1] })
      tent += k.draw([{ d, fill: OCT, inner: k.sh(d, 0, 0, 1, 1, 0, 0.75, OCT_D, 0.45) }], 0.55) +
        pts.map(([x, y], i) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.1 - i * 0.2)}" fill="#F3B3A8" stroke="${OCT_D}" stroke-width=".3"/>`).join('')
      const ang = (Math.atan2(y1 - cy, x1 - cx) * 180) / Math.PI + 90
      tips += mitten(k, x1, y1, ang, 0.66)
    }
    const mantle = 'M40 106C38 92 46 80 60 80C74 80 82 92 80 106Z'
    return (
      k.night() +
      [[30, 26], [92, 28], [40, 18], [80, 18]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 60, 30, 30), k.rad(P.sky, 0.5, 0.5, 0.5, 0.6, 0), P.sky, 0.35) +
      `<path d="M28 30.6H92V100H28Z" fill="#0F1736" opacity=".35"/>` +
      net(k, 'M28 30.6H92V100H28Z', 28, 30.6, 92, 100, 5.6, (x, y) => [x, y], P.sky1) +
      goalFrame(k, 25, 95, 27, 104) +
      tent +
      k.draw([{ d: mantle, fill: OCT, inner: k.sh(mantle, 0, 0, 1, 0, 0, 0.8, OCT_D, 0.45) + `<path d="M46 92C48 87 52 84 57 83" fill="none" stroke="#F39A96" stroke-width="1" stroke-linecap="round"/>` + [[52, 96], [66, 92], [60, 99], [71, 99]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="${OCT_D}" opacity=".6"/>`).join('') }], 0.7) +
      tips +
      ball(k, 60, 27.4, 6.4, { a: 0.3, b: 0.8 }) +
      k.defs()
    )
  },

  // Ocho penales: te piden que riegues el césped por cábala. El guante de oro sobre su mata, y la regadera haciendo lo suyo.
  'Goycochea de la liga': (u) => {
    const k = kit(u)
    const tuft = 'M38 90C38 84 46 80 60 80C74 80 82 84 82 90C82 93 74 95 60 95C46 95 38 93 38 90Z'
    const can = 'M-9 -7H7L5.6 8C5.4 9.4 4.4 10 3 10H-5C-6.4 10 -7.4 9.4 -7.6 8Z'
    const spout = 'M6 4L19 -6.6L20.4 -5L8 6.4Z'
    const rose = 'M18 -9L23.4 -3.4L21.6 -1.8L16.4 -7.4Z'
    const handle = 'M-8.4 -4C-14 -6 -14.4 4 -8 6'
    const blades = Array.from({ length: 16 }, (_, i) => { const x = 40 + i * 2.6, h = 4 + (i % 3) * 1.6; return `M${f(x)} ${f(84 + Math.abs(i - 7.5) * 0.3)}L${f(x + 0.8)} ${f(84 - h)}L${f(x + 1.6)} ${f(84 + Math.abs(i - 7.5) * 0.3)}Z` }).join('')
    return (
      k.day() +
      k.sun(60, 50, 17, 47) +
      k.shade(ellipse(60, 50, 26, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(46, 102, 26, 94, 24, 62, 8) + laurel(74, 102, 94, 94, 96, 62, 8, true) +
      k.floor(60, 94, 24, 2.4, P.mid) +
      k.draw([{ d: tuft, fill: GRASS, inner: k.sh(tuft, 0, 0, 1, 1, 0, 0.8, GRASS_D, 0.45) + `<path d="M42 86C48 83 56 82 62 82" fill="none" stroke="${GRASS_L}" stroke-width=".8" stroke-linecap="round"/>` }], 0.6) +
      `<path d="${blades}" fill="${GRASS_L}" stroke="${GRASS_D}" stroke-width=".3"/>` +
      `<g transform="translate(54 58) rotate(-4) scale(.96)">` + k.cast([PALM, CUFF, THUMB], 1.6, 1.6, P.mid) +
      glove(k, { shell: P.gold, shellD: P.goldD, latex: P.goldL, latexD: P.gold, strap: P.gold, star: true }) + `</g>` +
      sparkle(46, 38, 2.4, '#fff') + sparkle(62, 70, 1.4, '#fff') +
      `<g transform="translate(91 57) rotate(-58) scale(-.9 .9)">` +
      `<path d="${handle}" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="${handle}" fill="none" stroke="${P.sky1}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([
        { d: spout, fill: P.sky1, inner: k.sh(spout, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) },
        { d: rose, fill: P.sky, inner: k.sh(rose, 0, 0, 1, 1, 0, 0.7, P.mid, 0.4) },
        { d: can, fill: P.sky1, inner: k.sh(can, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M-8 -3H6.6M-7.6 5H5.8" stroke="${P.blue}" stroke-width=".5"/>` + `<path d="M-6.6 -6V8" stroke="#fff" stroke-width=".8" opacity=".8"/>` },
      ], 0.55) +
      `<path d="M-9.4 -7.6H7.4" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M-9.4 -7.6H7.4" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/>` +
      `</g>` +
      [[77, 75], [75.4, 78.6], [79, 79], [76.6, 82.6], [80, 83]].map(([x, y]) => `<path d="M${x} ${f(y - 1.6)}C${f(x + 0.8)} ${f(y - 0.4)} ${f(x + 0.9)} ${f(y + 0.4)} ${x} ${f(y + 0.8)}C${f(x - 0.9)} ${f(y + 0.4)} ${f(x - 0.8)} ${f(y - 0.4)} ${x} ${f(y - 1.6)}Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      sparkle(88, 34, 2.2, P.goldL) + sparkle(32, 40, 1.6, P.goldL) +
      k.defs()
    )
  },
}
