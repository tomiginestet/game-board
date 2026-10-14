// Fútbol 5: el picado de los jueves en la cancha de sintético, en clave heroica. Los objetos: la pelota de gajos, el
// botín, el guante, el arco con su red, la pechera, la camiseta con el número, la tarjeta roja y la cerveza del
// tercer tiempo. A las personas reales (Bati, Riquelme) no se las dibuja: aparecen por sus gestos y sus objetos.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { ball, banner, BOOT, boot, card, CUFF, glove, goalFrame, grass, GRASS, GRASS_D, GRASS_L, label, net, PALM, STUDS_D, stars, THUMB } from './_futbol-piezas'

/** Pechera flúor, apagada para la estampa. */
const PECH = '#C3D06A', PECH_D = '#8E9C3A'
/** Tierra del potrero. */
const DIRT = '#C79A6B', DIRT_D = '#97693F'
/** Cerveza y su espuma. */
const BEER = '#E9A93E', BEER_D = '#B9741F', FOAM = '#FBF3DF'

// ── Piezas propias ──────────────────────────────────────────────────────────────────────────────────

/** Pechera de malla vista de frente, centrada en (0,0), del cuello (y=-24) al ruedo (y=25). */
const BIB = 'M-9 -24C-7 -16 7 -16 9 -24H15C15 -16 17 -10 21 -6V22C21 24 19.4 25 17.4 25H-17.4C-19.4 25 -21 24 -21 22V-6C-17 -10 -15 -16 -15 -24Z'
function bib(k: Kit, fill: string, dark: string) {
  const mesh = Array.from({ length: 13 * 15 }, (_, i) => {
    const c = i % 13, r = Math.floor(i / 13), x = -21 + c * 3.4 + (r % 2) * 1.7, y = -22 + r * 3.4
    return `<circle cx="${f(x)}" cy="${f(y)}" r=".55" fill="${dark}" opacity=".55"/>`
  }).join('')
  const trim = 'M-9 -24C-7 -16 7 -16 9 -24M15 -24C15 -16 17 -10 21 -6M-15 -24C-15 -16 -17 -10 -21 -6'
  return k.draw([{
    d: BIB, fill,
    inner: mesh + k.sh('M4 -26H24V27H4Z', 0, 0, 1, 0, 0, 0.75, dark, 0.45) + k.sh('M-24 14H24V27H-24Z', 0, 0, 0, 1, 0, 0.6, dark, 0.3) +
      `<path d="M-24 -26H-10V27H-24Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
      `<path d="${trim}" fill="none" stroke="${dark}" stroke-width="2.4"/>` + `<path d="${trim}" fill="none" stroke="${P.white}" stroke-width=".5" stroke-dasharray=".8 .7" transform="translate(0 1)"/>` +
      hair(-14, 0, -15, 10, -13.6, 20, 0.7, dark) + hair(10, -2, 11, 10, 9.6, 20, 0.6, dark),
  }], 0.75)
}

/** Camiseta de frente centrada en (0,0): del cuello (y=-24) al ruedo (y=26.4), mangas cortas. */
const SHIRT = 'M-8 -24C-5 -20 5 -20 8 -24L21 -19.4L30 -5L22 .4L18 -4.4V24C18 25.6 16.8 26.4 15 26.4H-15C-16.8 26.4 -18 25.6 -18 24V-4.4L-22 .4L-30 -5L-21 -19.4Z'
const COLLAR = 'M-8 -24C-5 -20 5 -20 8 -24L5.6 -25.6C3 -23.4 -3 -23.4 -5.6 -25.6Z'

/** Mano abierta de frente (palma a la vista), con la muñeca abajo en y≈24. */
const HFING: [number, number, number, number][] = [[-8, -21.4, 5.8, -12], [-2.5, -25.4, 6, -3], [3.2, -23.8, 5.8, 6], [8.6, -18.4, 5.2, 16]]
const hfinger = (x: number, top: number, w: number) => `M${f(x - w / 2)} -3V${f(top + w / 2)}A${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(x + w / 2)} ${f(top + w / 2)}V-3Z`
const HPALM = 'M-11.2 12C-12.6 6 -12.8 0 -11.4 -6.4H11.4C12.8 0 12.6 6 11 12C7 15.6 -7 15.6 -11.2 12Z'
const HTHUMB = 'M-10.4 8C-15 5.6 -18.6 1 -20.2 -4.4C-21 -7 -19.6 -9 -17.4 -8.4C-15.4 -7.8 -13.6 -5 -11 -1.8Z'
const WRIST = roundRect(-8.8, 11, 8.8, 26, 1.6)
function hand(k: Kit) {
  const skinD = '#D9B99C'
  const fingers = HFING.map(([x, top, w, r]) => ({ d: hfinger(x, top, w), t: `rotate(${r} ${x} -3)`, fill: P.skin, inner: k.sh(hfinger(x, top, w), 0, 0, 1, 0, 0, 0.6, skinD, 0.4) }))
  const creases = HFING.map(([x, top, w, r]) => `<g transform="rotate(${r} ${x} -3)">` +
    hair(x - w / 2 + 1, top + w * 1.5, x, top + w * 1.4, x + w / 2 - 1, top + w * 1.5, 0.4, P.brown) +
    hair(x - w / 2 + 1, top + w * 2.6, x, top + w * 2.5, x + w / 2 - 1, top + w * 2.6, 0.4, P.brown) + `</g>`).join('')
  const nails = HFING.map(([x, top, w, r]) => `<path d="M${f(x - w / 2 + 1.3)} ${f(top + w / 2 - 0.4)}A${f(w / 2 - 1.3)} ${f(w / 2 - 1.3)} 0 0 1 ${f(x + w / 2 - 1.3)} ${f(top + w / 2 - 0.4)}" transform="rotate(${r} ${x} -3)" fill="none" stroke="${skinD}" stroke-width=".4"/>`).join('')
  return (
    k.draw([
      { d: WRIST, fill: P.sky, inner: k.sh(WRIST, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M-8.8 14.6H8.8M-8.8 22.4H8.8" stroke="${P.white}" stroke-width="1.2"/><path d="M-8.8 18.5H8.8" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".8 .7"/>` },
      { d: HTHUMB, fill: P.skin, inner: k.sh(HTHUMB, 0, 0, 0, 1, 0, 0.6, skinD, 0.4) + hair(-17.2, -5.4, -16, -4.6, -15, -3, 0.4, P.brown) },
      ...fingers,
      { d: HPALM, fill: P.skin, inner: k.sh(HPALM, 0, 0, 1, 0.3, 0, 0.6, skinD, 0.45) },
    ], 0.75) +
    creases + nails +
    hair(-9, 3, -2, -1.6, 9, -2.4, 0.55, P.brown) + hair(-8.6, 7, -3, 1.4, 1, 0.4, 0.5, P.brown) + hair(-4, 11, -6, 4, -9.4, -1, 0.55, P.brown) +
    hair(-7.4, -16, -7.8, -10, -7.2, -5, 0.6, '#fff', 0.8) + hair(-2, -20, -2.4, -13, -1.8, -5, 0.6, '#fff', 0.8)
  )
}

/** Piedra de potrero, apoyada en (0,0). */
function stone(k: Kit, w: number, h: number) {
  const d = `M${f(-w / 2)} 0C${f(-w / 2 - 1)} ${f(-h * 0.5)} ${f(-w * 0.25)} ${f(-h)} ${f(w * 0.05)} ${f(-h)}C${f(w * 0.4)} ${f(-h)} ${f(w / 2 + 1)} ${f(-h * 0.45)} ${f(w / 2)} 0Z`
  return k.draw([{ d, fill: P.sky2, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.mid, 0.45) + hair(-w * 0.3, -h * 0.55, -w * 0.1, -h * 0.85, w * 0.15, -h * 0.9, 0.6, '#fff', 0.8) + hair(w * 0.1, -h * 0.3, w * 0.2, -h * 0.15, w * 0.32, -h * 0.05, 0.5, P.mid) }], 0.7)
}

/** Botín con un parche cosido y el cordón atado con un nudo de más: el de barrio. */
const patch = `<path d="M5 -11.6L13.6 -8.2L12 -2.2L3.4 -4.6Z" fill="${P.brown}"/><path d="M5 -11.6L13.6 -8.2L12 -2.2L3.4 -4.6Z" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray=".9 .7"/>` +
  `<path d="M6 -9.6L11.6 -7.2" stroke="${P.brownD}" stroke-width=".4"/>`

export const FUTBOL5_ART: Record<string, (u: number) => string> = {
  // ── Goleador ──────────────────────────────────────────────────────

  // Diez goles: el botín de barrio, emparchado, pisa la pelota que le pasan sin mirar.
  'Botín de barrio': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 56, 15, 44) +
      k.floor(60, 90, 20, 2.6, P.mid) +
      ball(k, 58, 76, 14, { a: 0.4, b: 0.2 }) +
      `<g transform="translate(61 62.6) rotate(-9)">` + k.cast([BOOT], 1.6, 1.6) + boot(k, { stripe: P.white, over: patch }) + `</g>` +
      `<path d="M66 51.4C70 47 74.6 47.6 74 51C73.4 53.6 69.4 53 68 50.6" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M66 51.4C70 47 74.6 47.6 74 51C73.4 53.6 69.4 53 68 50.6" fill="none" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>` +
      hair(34, 72, 31.6, 77, 34, 82, 0.8, P.mid) + hair(30.4, 73, 28, 78, 30.6, 83, 0.6, P.mid) +
      sparkle(38, 38, 2) + sparkle(88, 74, 1.6) +
      k.defs()
    )
  },

  // Cincuenta goles y el que arma los equipos: las dos pecheras, una para cada lado, y la pelota de los jueves.
  'Pichichi del jueves': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.stage(60, 58, 33) +
      k.floor(60, 92, 22, 2.6, P.mid) +
      `<g transform="translate(50 61) rotate(-12) scale(.84)">` + k.cast([BIB], 2, 2) + bib(k, P.sky, P.blue) + `</g>` +
      `<g transform="translate(66 62) rotate(8) scale(.86)">` + k.cast([BIB], 2, 2) + bib(k, PECH, PECH_D) + `</g>` +
      ball(k, 80, 84, 8.4, { a: 0.7, b: -0.4 }) +
      banner(k, 50, 89, 34, P.white, P.sky, 'los jueves', P.ink, 4.2) +
      sparkle(36, 36, 1.8) + sparkle(88, 40, 2.2) +
      k.defs()
    )
  },

  // Ciento cincuenta goles en el potrero, con dos piedras de palos: la pelota brilla y hasta el arquero aplaude.
  'Goleador de potrero': (u) => {
    const k = kit(u)
    const dirt = 'M0 82C30 79 90 79 120 82V130H0Z'
    const tufts = [[30, 84], [46, 88], [74, 86], [88, 90], [56, 95]].map(([x, y]) => hair(x, y, x - 1, y - 3, x - 2.4, y - 5, 0.8, GRASS_D) + hair(x + 1, y, x + 1.6, y - 3.4, x + 2.6, y - 5.4, 0.8, GRASS) + hair(x + 0.4, y, x + 0.2, y - 3.6, x + 0.4, y - 6, 0.7, GRASS_D)).join('')
    const claps = [[-1, 0], [1, 0]].map(([s]) => [0, 1, 2].map((i) => {
      const a = (-90 + s * (30 + i * 22)) * Math.PI / 180
      return hair(60 + Math.cos(a) * 21, 60 + Math.sin(a) * 21, 60 + Math.cos(a) * 24, 60 + Math.sin(a) * 24, 60 + Math.cos(a) * 27, 60 + Math.sin(a) * 27, 0.9, P.goldD)
    }).join('')).join('')
    return (
      k.day() +
      k.sun(60, 58, 16, 48) +
      k.shade(ellipse(60, 58, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(48, 101, 30, 94, 26, 66, 8) + laurel(72, 101, 90, 94, 94, 66, 8, true) +
      `<path d="${dirt}" fill="${DIRT}"/>` + k.sh(dirt, 0, 0, 0, 1, 0, 0.7, DIRT_D, 0.45) + tufts +
      `<g transform="translate(34 86)">` + stone(k, 11, 8) + `</g>` + `<g transform="translate(86 86)">` + stone(k, 10, 9) + `</g>` +
      k.floor(60, 84, 14, 2, DIRT_D) +
      claps +
      ball(k, 60, 62, 16, { a: 0.3, b: 0.5, c: 0.1 }) +
      label(60, 32, 5.2, '¡clap, clap!', P.ink) +
      sparkle(40, 42, 2.4, '#fff') + sparkle(82, 46, 2, '#fff') + sparkle(78, 74, 1.4) +
      k.defs()
    )
  },

  // ── Hat-trick ─────────────────────────────────────────────────────

  // Tres goles: la pelota se va a tu casa, asomando del bolso, con las tres estrellas del partido.
  'Triplete': (u) => {
    const k = kit(u)
    const bag = 'M33 66C33 61 36 58.6 41 58.6H79C84 58.6 87 61 87 66V84C87 87.4 85 89 81.6 89H38.4C35 89 33 87.4 33 84Z'
    const end = ellipse(35.4, 74, 3.4, 13), endR = ellipse(84.6, 74, 3.4, 13)
    const strap = 'M44 60C44 46 52 42 60 42C68 42 76 46 76 60'
    const pocket = roundRect(46, 72, 74, 84, 2)
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(60, 91, 26, 2.4, P.mid) +
      `<path d="${strap}" fill="none" stroke="${P.ink}" stroke-width="4.6" stroke-linecap="round"/><path d="${strap}" fill="none" stroke="${P.night}" stroke-width="3" stroke-linecap="round"/>` +
      ball(k, 60, 56, 13, { a: 0.6, b: 0.3 }) +
      k.cast([bag], 2.2, 2.2) +
      k.draw([{
        d: bag, fill: P.mid,
        inner:
          k.sh(bag, 0, 0, 1, 1, 0, 0.85, P.night, 0.5) + `<path d="M33 58H87V66H33Z" fill="${k.lin(P.blue, 0, 0, 0, 1, 0.8, 0)}"/>` +
          `<path d="M39 61.2H81" stroke="${P.ink}" stroke-width="1.6"/><path d="M39 61.2H81" stroke="${P.goldL}" stroke-width=".7" stroke-dasharray=".6 .7"/>` +
          `<path d="M33 69H87" stroke="${P.white}" stroke-width="1.4"/>` +
          `<path d="${end}" fill="${P.night}"/><path d="${endR}" fill="${P.night}"/>`,
      }], 0.75) +
      k.draw([{ d: pocket, fill: P.night, inner: `<path d="M48 74.4H72" stroke="${P.sky}" stroke-width=".5" stroke-dasharray=".9 .7"/>` }], 0.5) +
      `<path d="M78 62L80.4 66.4" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><circle cx="80.6" cy="67" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      [[42, 36, 3], [60, 30, 3.4], [78, 36, 3]].map(([x, y, r]) => `<path d="${starPath(x, y, r, r * 0.42, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(x - 0.3, y - 0.3, r * 0.45, r * 0.2, 5)}" fill="${P.goldL}"/>`).join('') +
      label(60, 81, 4.6, 'a casa', P.paper) +
      k.defs()
    )
  },

  // Cinco goles: la manito abierta, un gol en cada dedo.
  'Manito': (u) => {
    const k = kit(u)
    const tips = HFING.map(([x, top, , r]) => {
      const a = (r * Math.PI) / 180, dy = top - 4 - -3
      return [x - Math.sin(a) * dy, -3 + Math.cos(a) * dy]
    })
    const thumbTip: [number, number] = [-22.6, -10.6]
    const pts = [thumbTip, ...tips].map(([x, y]) => [60 + x * 1.18, 69 + y * 1.18])
    return (
      k.day() +
      k.sun(60, 58, 15, 46, 32, false) +
      k.shade(ellipse(60, 60, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<g transform="translate(60 69) scale(1.18)">` + k.cast([HPALM, WRIST, HTHUMB], 2, 2) + hand(k) + `</g>` +
      pts.map(([x, y], i) => ball(k, f(x + (i === 0 ? -1 : 0)), f(y - 3.4), 3.6, { a: 0.3 + i * 0.5, b: i * 0.7, w: 0.45 })).join('') +
      k.defs()
    )
  },

  // Ocho goles: la ametralladora del nueve. La pelota sale en ráfaga, de noche, con el fogonazo atrás.
  'Noche de Batistuta': (u) => {
    const k = kit(u)
    const end = [70, 54], start = [32, 84]
    const ghosts = Array.from({ length: 7 }, (_, i) => {
      const t = 0.3 + i * 0.095, x = end[0] + (start[0] - end[0]) * t, y = end[1] + (start[1] - end[1]) * t, r = 2.5 - i * 0.16
      return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${P.white}" opacity="${f(1 - i * 0.1)}" stroke="${P.ink}" stroke-width=".6"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.3)}" fill="#fff" opacity=".7"/>`
    }).reverse().join('')
    const flash = starPath(start[0], start[1], 11, 4, 9, -10)
    return (
      k.night() +
      stars([[30, 34], [88, 30], [44, 24], [78, 24], [94, 62], [56, 20]]) +
      laurel(46, 101, 28, 96, 24, 70, 7) + laurel(74, 101, 92, 96, 96, 70, 7, true) +
      k.shade(ellipse(end[0], end[1], 24, 24), k.rad(P.gold, 0.5, 0.5, 0.5, 0.7, 0), P.gold, 0.35) +
      hair(start[0] + 4, start[1] - 10, 50, 64, end[0] - 8, end[1] - 10, 0.9, P.goldL, 0.7) + hair(start[0] + 10, start[1] - 2, 56, 72, end[0] + 4, end[1] + 10, 0.9, P.goldL, 0.7) +
      ghosts +
      `<path d="${flash}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><path d="${starPath(start[0], start[1], 6, 2.6, 9, -10)}" fill="${P.goldL}"/>` +
      ball(k, end[0], end[1], 13, { a: 0.2, b: 0.8, c: -0.3 }) +
      label(52, 30, 5.6, '¡ra-ta-ta!', P.goldL, -8) +
      sparkle(88, 44, 2.4, P.goldL) + sparkle(84, 76, 1.6, P.goldL) + sparkle(40, 50, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Pasador ───────────────────────────────────────────────────────

  // Diez asistencias: la pelota picando sobre la línea del arco, con el arco vacío. Sólo falta empujarla.
  'Pase de la muerte': (u) => {
    const k = kit(u)
    const path = 'M22 62Q31 44 40 77Q48 60 56 73'
    return (
      k.day() +
      k.stage(60, 50, 30) +
      grass(k, 77) +
      `<path d="M31.6 33.6H88.4V77H31.6Z" fill="${P.sky1}" opacity=".6"/>` +
      net(k, 'M31.6 33.6H88.4V77H31.6Z', 31.6, 33.6, 88.4, 77, 4.6) +
      goalFrame(k, 28, 92, 30, 78) +
      `<path d="M14 79.6H106" stroke="${P.ink}" stroke-width="2.6"/><path d="M14 79.6H106" stroke="${P.white}" stroke-width="1.6"/>` +
      `<path d="${path}" fill="none" stroke="${P.white}" stroke-width="1.6" stroke-dasharray=".01 2.6" stroke-linecap="round"/>` +
      `<path d="${path}" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-dasharray=".01 2.6" stroke-linecap="round"/>` +
      hair(36, 80, 38, 78.6, 40, 80, 0.6, P.white) + hair(41, 80, 43, 78.6, 45, 80, 0.6, P.white) +
      k.floor(63, 80, 10, 1.6, GRASS_D) +
      ball(k, 63, 70, 9.4, { a: 0.4, b: 0.6 }) +
      hair(55, 64, 53, 68, 54.4, 72, 0.6, P.mid) + hair(71, 64, 73, 68, 71.6, 72, 0.6, P.mid) +
      label(60, 91, 5, '¡empujala!', P.white) +
      k.defs()
    )
  },

  // Cuarenta asistencias: el 10 de toda la vida juega con la de tiento, la de cuero cosido a mano.
  'Enganche clásico': (u) => {
    const k = kit(u)
    const C = [60, 55], R = 18
    const d = ellipse(C[0], C[1], R, R)
    const seams = 'M43.4 49C50 46 54 46 60 47.4C66 46 70 46 76.6 49M43 61.6C50 64 54 64 60 62.6C66 64 70 64 77 61.6' +
      'M60 47.4V62.6M51 46.4C49.6 40 50 38 52 37.8M69 46.4C70.4 40 70 38 68 37.8M51 63.6C49.6 70 50 72 52 72.2M69 63.6C70.4 70 70 72 68 72.2'
    const lace = [0, 1, 2, 3].map((i) => { const y = 40 + i * 2.4; return `<path d="M57.4 ${y}L62.6 ${f(y + 2)}M62.6 ${y}L57.4 ${f(y + 2)}" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M57.4 ${y}L62.6 ${f(y + 2)}M62.6 ${y}L57.4 ${f(y + 2)}" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` }).join('')
    return (
      k.day() +
      k.sun(60, 55, 15, 45, 32, false) +
      k.shade(ellipse(60, 55, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(60, 77, 16, 2.2, P.mid) +
      k.cast([d], 2, 2) +
      k.draw([{
        d, fill: P.brown,
        inner:
          k.shade(d, k.rad(P.brownD, 0.32, 0.28, 0.85, 0, 0.95), P.brownD, 0.45) +
          `<path d="${seams}" fill="none" stroke="${P.brownD}" stroke-width="1.1"/><path d="${seams}" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray=".7 .8" transform="translate(.6 .6)"/>` +
          `<path d="M57 38.6H63V50H57Z" fill="${P.brownD}"/>` + lace +
          `<ellipse cx="53" cy="44.6" rx="6" ry="3" fill="#fff" opacity=".55" transform="rotate(-35 53 44.6)"/>`,
      }], 0.8) +
      hair(30, 52, 27, 60, 30, 68, 0.8, P.mid) + hair(90, 52, 93, 60, 90, 68, 0.8, P.mid) +
      banner(k, 60, 86, 40, P.white, P.sky, 'el diez de siempre', P.ink, 4) +
      sparkle(80, 36, 2) + sparkle(36, 74, 1.4) +
      k.defs()
    )
  },

  // Ciento veinte asistencias: pausa, pisada y pase gol. El botín pisa la pelota en la sintética y todo espera.
  'Riquelme de cancha sintética': (u) => {
    const k = kit(u)
    const crumbs = Array.from({ length: 34 }, (_, i) => {
      const x = 8 + ((i * 37) % 104), y = 84 + ((i * 13) % 18)
      return `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.5 : 0.7}" fill="${P.night}"/>`
    }).join('')
    const bar = (x: number) => roundRect(x, 60, x + 3.4, 72, 1.2)
    const pass = 'M74 64Q88 52 88 38'
    return (
      k.day() +
      k.sun(60, 54, 15, 46) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      laurel(48, 101, 30, 94, 26, 66, 8) + laurel(72, 101, 90, 94, 94, 66, 8, true) +
      grass(k, 80) + crumbs +
      k.floor(60, 82, 16, 2.2, GRASS_D) +
      ball(k, 60, 70, 12, { a: 0.3, b: 0.5 }) +
      `<g transform="translate(57.6 58.6) rotate(-12) scale(.86)">` + k.cast([BOOT], 1.6, 1.6) + boot(k, { stripe: P.gold, stripeD: P.goldD, studs: P.gold }) + `</g>` +
      k.draw([{ d: bar(31), fill: P.gold, inner: k.sh(bar(31), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) }, { d: bar(37), fill: P.gold, inner: k.sh(bar(37), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) }], 0.55) +
      `<path d="${pass}" fill="none" stroke="${P.ink}" stroke-width="1" stroke-dasharray="1.6 1.6" stroke-linecap="round"/>` +
      `<path d="${starPath(88, 34, 3.2, 1.3, 5)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>` +
      sparkle(76, 38, 1.8, '#fff') + sparkle(30, 62, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Figura ────────────────────────────────────────────────────────

  // La primera vez figura: el diario deportivo con tu nota, un 8 en rojo marcado con birome.
  'Nota 8 en el Olé': (u) => {
    const k = kit(u)
    const page = roundRect(-22, -28, 22, 28, 1)
    const cols = [-10, -7, -4, -1, 2, 5, 8].map((y) => `M6.4 ${y}H18.6`).join('') + [16, 19, 22, 25].map((y) => `M-18.6 ${y}H-1`).join('')
    const photo = 'M-18.6 -9H3.4V12H-18.6Z'
    return (
      k.day() +
      k.stage(60, 58, 33) +
      k.floor(60, 92, 22, 2.4, P.mid) +
      `<g transform="translate(60 60) rotate(-6)">` +
      k.cast([page], 2.4, 2.4) +
      k.draw([{
        d: page, fill: P.white,
        inner:
          `<path d="M-22 -28H22V-19.6H-22Z" fill="${P.ink}"/>` +
          `<text x="0" y="-21.6" ${'font-family="Georgia, serif"'} font-weight="700" font-size="6.2" letter-spacing=".6" fill="${P.paper}" text-anchor="middle">DEPORTES</text>` +
          `<path d="M-18.6 -16.4H18.6M-18.6 -12.6H10" stroke="${P.ink}" stroke-width="2"/>` +
          `<path d="${photo}" fill="${P.sky1}"/>` + `<path d="M-18.6 6H3.4V12H-18.6Z" fill="${GRASS_L}"/>` +
          `<path d="${cols}" stroke="${P.blue}" stroke-width=".9"/>` +
          k.sh(page, 0, 0, 1, 1, 0, 0.5, P.sky2, 0.4) +
          `<path d="M14 28L22 20V28Z" fill="${P.sky1}"/>`,
      }], 0.6) +
      `<path d="${photo}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      ball(k, -7.6, 1.4, 5.4, { a: 0.4, b: 0.2, w: 0.4 }) +
      `<path d="M14 28L22 20" stroke="${P.ink}" stroke-width=".5"/>` +
      `<text x="12.2" y="22" ${'font-family="Georgia, serif"'} font-weight="700" font-size="15" fill="${P.red}" text-anchor="middle">8</text>` +
      `<path d="M4.2 13.4C5 9 11 7.4 16.4 8.6C21 9.8 21.6 15 19.4 19.6C17 24.4 10.4 25.4 6.4 22.6C3.4 20.4 3 16.6 5.6 12.4" fill="none" stroke="${P.red}" stroke-width="1.1" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(88, 34, 2) + sparkle(30, 76, 1.6) +
      k.defs()
    )
  },

  // Cinco veces figura y en el tercer tiempo te pagan la cerveza: el chopp rebalsando de espuma, de noche.
  'Ovación en el tercer tiempo': (u) => {
    const k = kit(u)
    const glass = 'M43 46H75L73.4 86C73.3 88 72 89 70 89H48C46 89 44.7 88 44.6 86Z'
    const beer = 'M44 50H74L72.6 85C72.5 86.6 71.4 87.4 69.6 87.4H48.4C46.6 87.4 45.5 86.6 45.4 85Z'
    const handle = 'M74.6 52C84 52 89 57 89 66C89 75 84 80 73.8 80L74 74.4C80 74.4 83.4 71 83.4 66C83.4 61 80.4 57.6 74.4 57.6Z'
    const foam = 'M41 49C38.6 45 41.4 40.6 45.6 41.2C46.4 36.6 52 35 55.4 38C58 33.8 65 33.6 67.4 38C71 35.6 76.6 38 76.2 42.6C79.6 44 79.4 48.6 76.4 49.6C76 52 73 52.6 71.4 51.4V56.4C71.4 58.2 68.6 58.2 68.6 56.4V51.4C62 52.6 52 52.6 46 51.4C43 52 40.8 51 41 49Z'
    const bubbles = [[50, 60, 0.8], [53, 70, 0.6], [49, 78, 0.7], [64, 64, 0.6], [66, 75, 0.8], [58, 82, 0.6], [60, 58, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${FOAM}" opacity=".9"/>`).join('')
    return (
      k.night() +
      stars([[30, 36], [90, 34], [40, 26], [80, 24], [94, 56], [26, 58]]) +
      k.shade(ellipse(60, 64, 30, 28), k.rad(P.gold, 0.5, 0.5, 0.5, 0.55, 0), P.gold, 0.3) +
      k.floor(60, 90, 22, 2.4, '#0F1736') +
      k.draw([{ d: handle, fill: P.sky1, inner: k.sh(handle, 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) + hair(80, 56, 86, 62, 85.6, 70, 0.6, '#fff', 0.8) }], 0.7) +
      k.draw([{
        d: glass, fill: P.sky1,
        inner:
          `<path d="${beer}" fill="${BEER}"/>` + k.sh(beer, 0, 0, 1, 0, 0.1, 0.9, BEER_D, 0.45) + `<path d="M44 50H74V58H44Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.8, 0)}"/>` + bubbles +
          [50, 56, 62, 68].map((x) => `<path d="M${x} 56V84" stroke="${P.goldL}" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`).join('') +
          `<path d="M46.4 50V86" stroke="#fff" stroke-width="1.4" opacity=".75"/>`,
      }], 0.8) +
      k.draw([{ d: foam, fill: FOAM, inner: k.sh(foam, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + `<circle cx="50" cy="44" r="1.2" fill="#fff"/><circle cx="62" cy="41" r="1" fill="#fff"/><circle cx="70" cy="45" r=".8" fill="#fff"/>` }], 0.7) +
      label(60, 28, 5.6, '¡salud!', P.goldL) +
      sparkle(32, 46, 2, P.goldL) + sparkle(90, 46, 1.8, P.goldL) + sparkle(86, 84, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Quince veces figura: te piden para los dos equipos. La camiseta mitad y mitad, con el diez en oro.
  'Diez de la cancha': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 56, 16, 48) +
      k.shade(ellipse(60, 56, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(48, 101, 30, 94, 26, 66, 8) + laurel(72, 101, 90, 94, 94, 66, 8, true) +
      k.floor(60, 89, 22, 2.4, P.mid) +
      `<g transform="translate(60 61) scale(.98)">` +
      k.cast([SHIRT], 2.2, 2.2) +
      k.draw([{
        d: SHIRT, fill: P.mid,
        inner:
          `<path d="M0 -30H32V30H0Z" fill="${PECH}"/>` +
          k.sh('M-32 -30H0V30H-32Z', 0, 0, 1, 0, 0, 0.6, P.ink, 0.35) + k.sh('M8 -30H32V30H8Z', 0, 0, 1, 0, 0, 0.75, PECH_D, 0.45) +
          `<path d="M-32 -30H-12V30H-32Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` +
          `<path d="M0 -21V27" stroke="${P.ink}" stroke-width=".7"/><path d="M.9 -21V27" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".8 .7"/>` +
          `<path d="M-18 -4.4L-21 -16M18 -4.4L21 -16" fill="none" stroke="${P.ink}" stroke-width=".45" opacity=".6"/>` +
          `<path d="M-30 -5L-22 .4M30 -5L22 .4" stroke="${P.gold}" stroke-width="1.6"/>` +
          hair(-12, 6, -13, 14, -11.6, 22, 0.6, P.ink, 0.6) + hair(12, 6, 13, 14, 11.6, 22, 0.6, PECH_D),
      }], 0.8) +
      k.draw([{ d: COLLAR, fill: P.gold, inner: k.sh(COLLAR, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) }], 0.5) +
      `<text x=".6" y="13" ${'font-family="Georgia, serif"'} font-weight="700" font-size="22" fill="${P.ink}" text-anchor="middle" transform="translate(.7 .8)">10</text>` +
      `<text x=".6" y="13" ${'font-family="Georgia, serif"'} font-weight="700" font-size="22" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6" text-anchor="middle">10</text>` +
      `<path d="M-6 -2.4H7" stroke="${P.goldL}" stroke-width=".5" opacity=".9"/>` +
      `</g>` +
      sparkle(38, 34, 2.4, '#fff') + sparkle(84, 36, 2, '#fff') + sparkle(86, 78, 1.4) +
      k.defs()
    )
  },

  // ── Valla invicta ────────────────────────────────────────────────

  // Ganaste sin que te hagan un gol: el guante con la moneda en la palma, delante del cero. El arquero pide aumento.
  'Arco en cero': (u) => {
    const k = kit(u)
    const coin = (x: number, y: number, r: number, rot = 0) =>
      `<g transform="rotate(${rot} ${x} ${y})">` + k.draw([{ d: ellipse(x, y, r, r), fill: P.gold, inner: k.sh(ellipse(x, y, r, r), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.55) +
      `<circle cx="${x}" cy="${y}" r="${f(r * 0.72)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
      `<text x="${x}" y="${f(y + r * 0.5)}" ${'font-family="Georgia, serif"'} font-weight="700" font-size="${f(r * 1.3)}" fill="${P.goldD}" text-anchor="middle">$</text>` +
      `<path d="M${f(x - r * 0.6)} ${f(y - r * 0.3)}A${f(r * 0.7)} ${f(r * 0.7)} 0 0 1 ${f(x - r * 0.1)} ${f(y - r * 0.7)}" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/></g>`
    return (
      k.day() +
      k.stage(60, 58, 33) +
      `<text x="60" y="88" ${'font-family="Georgia, serif"'} font-weight="700" font-size="72" fill="${P.sky}" text-anchor="middle" opacity=".7">0</text>` +
      k.floor(60, 93, 16, 2.2, P.mid) +
      `<g transform="translate(58 66) rotate(-10) scale(1.04)">` + k.cast([PALM, CUFF, THUMB], 2, 2) + glove(k) + coin(0, 1.4, 5.6, 10) + `</g>` +
      coin(76, 36, 4, -14) +
      hair(76, 42, 75, 46, 73.6, 49, 0.6, P.mid) + hair(80, 41, 80, 45, 79, 48, 0.5, P.mid) +
      label(36, 46, 4.6, '¿y lo mío?', P.ink, -8) +
      k.defs()
    )
  },

  // Cinco vallas invictas: el arco cerrado con cadena y candado.
  'Candado': (u) => {
    const k = kit(u)
    const C = [60, 62]
    const links = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12, a = 1 - t
      const x = a * a * 31 + 2 * a * t * 60 + t * t * 89, y = a * a * 48 + 2 * a * t * 74 + t * t * 48
      const dx = 2 * a * (60 - 31) + 2 * t * (89 - 60), dy = 2 * a * (74 - 48) + 2 * t * (48 - 74), ang = (Math.atan2(dy, dx) * 180) / Math.PI
      if (Math.hypot(x - C[0], y - C[1] - 4) < 9) return ''
      const flat = i % 2 === 0
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">` +
        (flat ? `<ellipse rx="3.2" ry="1.9" fill="none" stroke="${P.ink}" stroke-width="2"/><ellipse rx="3.2" ry="1.9" fill="none" stroke="${P.sky1}" stroke-width=".9"/>`
          : `<path d="M-3 0H3" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M-3 0H3" stroke="${P.blue}" stroke-width="1" stroke-linecap="round"/>`) + `</g>`
    }).join('')
    const body = roundRect(-10, 0, 10, 16, 2.6)
    const shackle = 'M-6.4 1V-5A6.4 6.4 0 0 1 6.4 -5V1'
    return (
      k.day() +
      k.stage(60, 52, 32) +
      grass(k, 80) +
      `<path d="M31.6 37.6H88.4V80H31.6Z" fill="${P.sky1}" opacity=".6"/>` +
      net(k, 'M31.6 37.6H88.4V80H31.6Z', 31.6, 37.6, 88.4, 80, 4.6) +
      goalFrame(k, 28, 92, 34, 81) +
      links +
      `<g transform="translate(${C[0]} ${C[1]}) scale(1.15)">` +
      `<path d="${shackle}" fill="none" stroke="${P.ink}" stroke-width="4.4"/><path d="${shackle}" fill="none" stroke="${P.sky1}" stroke-width="2.6"/><path d="M-5.2 -2V-5A5.2 5.2 0 0 1 -1 -10.2" fill="none" stroke="#fff" stroke-width=".7"/>` +
      k.cast([body], 1.6, 1.6) +
      k.draw([{ d: body, fill: P.gold, inner: k.sh(body, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-10 0H-5V16H-10Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="M-8 2.6H8M-8 13.4H8" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.7) +
      `<path d="M0 5.2A1.9 1.9 0 0 1 1 8.6L1.6 11.6H-1.6L-1 8.6A1.9 1.9 0 0 1 0 5.2Z" fill="${P.ink}"/>` +
      `</g>` +
      sparkle(84, 28, 1.8) + sparkle(38, 88, 1.4, '#fff') +
      k.defs()
    )
  },

  // Quince partidos sin goles en contra: catenaccio. El cerrojo de bronce que cierra el arco, con la cinta tricolor.
  'Cerrojo italiano': (u) => {
    const k = kit(u)
    const plate = roundRect(32, 49, 58, 67, 2)
    const keeper = roundRect(80, 48, 90, 68, 1.6)
    const bolt = roundRect(36, 54.4, 86, 61.6, 3.6)
    const knob = roundRect(48.4, 40, 52.6, 58, 2)
    const screws = [[35, 52], [55, 52], [35, 64], [55, 64], [85, 51], [85, 65]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x - 0.8} ${y - 0.5}L${x + 0.8} ${y + 0.5}" stroke="${P.goldD}" stroke-width=".4"/>`).join('')
    const volutas = `<path d="M38 58C38 54 42 53 43 56C44 58 41 59 40.6 57.4M52 58C52 54 48 53 47 56C46 58 49 59 49.4 57.4" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`
    const cx = 60, cy = 80, w = 46, x0 = cx - w / 2, x1 = cx + w / 2, rid = k.id('ban')
    const tail = (x: number, sg: number) => `M${f(x - sg * 2)} ${f(cy - 1.6)}L${f(x + sg * 7)} ${f(cy - 1.2)}L${f(x + sg * 4.4)} ${f(cy + 2.4)}L${f(x + sg * 7)} ${f(cy + 6)}L${f(x - sg * 2)} ${f(cy + 5.6)}Z`
    const band = `M${x0} ${f(cy - 3.6)}Q${cx} ${f(cy + 0.4)} ${x1} ${f(cy - 3.6)}V${f(cy + 3.4)}Q${cx} ${f(cy + 7.4)} ${x0} ${f(cy + 3.4)}Z`
    return (
      k.day() +
      k.stage(60, 56, 33) +
      `<path d="M31.6 33.6H88.4V84H31.6Z" fill="${P.sky1}" opacity=".5"/>` +
      net(k, 'M31.6 33.6H88.4V84H31.6Z', 31.6, 33.6, 88.4, 84, 4.6) +
      goalFrame(k, 28, 92, 30, 85) +
      k.cast([plate, keeper, bolt], 2, 2) +
      k.draw([
        { d: plate, fill: P.gold, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M32 49H58V53H32Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.8, 0)}"/>` + volutas },
        { d: keeper, fill: P.gold, inner: k.sh(keeper, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M82.6 53.6H88V62.4H82.6Z" fill="${P.goldD}"/>` },
      ], 0.7) +
      k.draw([
        { d: bolt, fill: P.sky1, inner: k.sh(bolt, 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) + `<path d="M36 55.6H86" stroke="#fff" stroke-width="1"/>` + [62, 70, 78].map((x) => `<path d="M${x} 54.4V61.6" stroke="${P.blue}" stroke-width=".4"/>`).join('') },
        { d: knob, fill: P.sky1, inner: k.sh(knob, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) },
      ], 0.65) +
      `<circle cx="50.5" cy="40" r="3.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".7"/><circle cx="49.6" cy="39" r=".9" fill="#fff" opacity=".8"/>` +
      screws +
      k.draw([{ d: tail(x0, -1), fill: GRASS_D }, { d: tail(x1, 1), fill: P.wine }], 0.5) +
      k.draw([{ d: band, fill: P.white, inner: `<path d="M${x0} ${cy - 5}H${f(x0 + w / 3)}V${cy + 9}H${x0}Z" fill="${GRASS}"/><path d="M${f(x1 - w / 3)} ${cy - 5}H${x1}V${cy + 9}H${f(x1 - w / 3)}Z" fill="${P.red}"/>` + k.sh(band, 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) }], 0.55) +
      `<path id="${rid}" d="M${x0} ${f(cy + 1.4)}Q${cx} ${f(cy + 5.2)} ${x1} ${f(cy + 1.4)}" fill="none"/>` +
      `<text font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="4.2" fill="${P.ink}" stroke="${P.white}" stroke-width=".9" paint-order="stroke"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">catenaccio</textPath></text>` +
      sparkle(40, 42, 2, '#fff') + sparkle(76, 44, 1.6, '#fff') + sparkle(84, 30, 2.2, P.goldL) +
      k.defs()
    )
  },

  // ── Carnicero ────────────────────────────────────────────────────

  // La primera roja: la plancha, tapones adelante. "Fui a la pelota".
  'Patada de amigo': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 56, 15, 44, 32, false) +
      k.floor(56, 88, 16, 2.2, P.mid) +
      hair(30, 46, 26, 56, 30, 66, 1, P.mid) + hair(34, 40, 29, 52, 32, 64, 0.8, P.mid) + hair(36, 70, 32, 76, 36, 82, 0.7, P.mid) +
      `<g transform="translate(52 60) rotate(-68)">` + k.cast([BOOT, STUDS_D], 1.6, -1.6) + boot(k, { stripe: P.red, stripeD: P.wine }) + `</g>` +
      `<g transform="translate(83 52) rotate(14)">` + card(k) + `</g>` +
      label(60, 92, 4.4, '“fui a la pelota”', P.ink) +
      sparkle(76, 30, 1.8) +
      k.defs()
    )
  },

  // Tres rojas: el bolsillo del árbitro, con la roja ya asomando, y el silbato colgando.
  'Tarjeta en el bolsillo': (u) => {
    const k = kit(u)
    const pocket = 'M38 54H82V84C82 87 80 89 77 89H43C40 89 38 87 38 84Z'
    const flap = 'M36.6 50H83.4V58C83.4 60 82 61 80 61.4L60 64.6L40 61.4C38 61 36.6 60 36.6 58Z'
    const cord = 'M72 22C78 40 84 52 75 71'
    const whistle = 'M74 70H86C90 70 92.6 73 92.6 76.6C92.6 80.4 89.6 83.2 86 83.2C82.4 83.2 79.6 80.6 79.4 77H74Z'
    return (
      k.day() +
      k.stage(60, 58, 33) +
      k.cast([pocket], 2.4, 2.4) +
      k.draw([{ d: pocket, fill: P.night, inner: k.sh(pocket, 0, 0, 1, 1, 0, 0.8, '#0F1736', 0.45) + `<path d="M38 54H52V89H38Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.7, 0)}"/>` + `<path d="M40.4 56V84C40.4 85.6 41.6 86.6 43.4 86.6H76.6C78.4 86.6 79.6 85.6 79.6 84V56" fill="none" stroke="${P.sky}" stroke-width=".5" stroke-dasharray="1 .8"/>` }], 0.75) +
      `<g transform="translate(58 58) rotate(-10)">` + card(k, P.gold, P.goldD) + `</g>` +
      `<g transform="translate(64 59) rotate(7) scale(1.25)">` + card(k) + `</g>` +
      k.draw([{ d: flap, fill: P.night, inner: k.sh(flap, 0, 0, 0, 1, 0, 0.8, '#0F1736', 0.45) + `<path d="M36.6 50H83.4V52.6H36.6Z" fill="${P.mid}"/>` + `<path d="M39 58.4L60 61.8L81 58.4" fill="none" stroke="${P.sky}" stroke-width=".5" stroke-dasharray="1 .8"/>` }], 0.75) +
      `<circle cx="60" cy="60" r="2" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".5"/><path d="M59.2 59.2L60.8 60.8M60.8 59.2L59.2 60.8" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="${cord}" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="${cord}" fill="none" stroke="${P.red}" stroke-width=".8" stroke-linecap="round"/>` +
      k.draw([{ d: whistle, fill: P.sky1, inner: k.sh(whistle, 0, 0, 1, 1, 0, 0.9, P.blue, 0.5) + `<path d="M74 71.4H85" stroke="#fff" stroke-width=".8"/>` + `<circle cx="86.4" cy="76.8" r="2" fill="${P.blue}"/>` }], 0.65) +
      `<circle cx="74" cy="72" r="1.6" fill="none" stroke="${P.ink}" stroke-width=".9"/>` +
      sparkle(84, 34, 2) + sparkle(32, 70, 1.4) +
      k.defs()
    )
  },

  // Ocho expulsiones: jugás con hacha. El hacha clavada en el tronco, con la roja clavada al lado.
  'Leñador': (u) => {
    const k = kit(u)
    const stumpBody = 'M38 70C38 76 38 84 36 90C34 92 30 93 28 94H92C90 93 86 92 84 90C82 84 82 76 82 70Z'
    const top = ellipse(60, 70, 22, 6.4)
    const rings = [17, 12, 7.4, 3.4].map((r) => `<ellipse cx="60.6" cy="70.2" rx="${r}" ry="${f(r * 0.29)}" fill="none" stroke="${P.brown}" stroke-width=".55"/>`).join('')
    const handle = taper(36, 36, 47, 50, 59, 66, 3.6, 3.2)
    const head = 'M54 58.4L66 54C68.4 58 69.4 63.4 68.6 69L58.6 70C59.6 66.4 58 61.6 54 58.4Z'
    const chips = [[30, 64, -30], [90, 62, 40], [86, 54, 70], [34, 56, -60]].map(([x, y, r]) => `<path d="M${x - 2.4} ${y}L${x + 2.4} ${y - 0.8}L${x + 2} ${y + 0.8}Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4" transform="rotate(${r} ${x} ${y})"/>`).join('')
    return (
      k.day() +
      k.sun(60, 54, 16, 48) +
      k.shade(ellipse(60, 56, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(46, 101, 28, 94, 24, 66, 8) + laurel(74, 101, 92, 94, 96, 66, 8, true) +
      k.floor(60, 94, 30, 2.6, P.mid) +
      k.draw([
        { d: stumpBody, fill: P.brown, inner: k.sh(stumpBody, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + [44, 52, 66, 74].map((x, i) => hair(x, 72, x + (i % 2 ? 1 : -1), 82, x + (i % 2 ? -0.6 : 0.6), 92, 0.6, P.brownD)).join('') },
        { d: top, fill: P.goldL, inner: k.sh(top, 0, 0, 1, 1, 0, 0.7, P.brown, 0.4) + rings },
      ], 0.75) +
      k.draw([{ d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + hair(37, 37, 46, 48, 56, 62, 0.5, P.goldL) + `<path d="M38 39.4L41.4 37M39.6 42L43 39.4" stroke="${P.red}" stroke-width="1"/>` }], 0.7) +
      k.draw([{ d: head, fill: P.sky1, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.blue, 0.5) + `<path d="M66 54C68.4 58 69.4 63.4 68.6 69L67 69C67.6 64 67 59 64.6 55Z" fill="${P.gold}"/>` + hair(57, 59, 61, 57.4, 65, 56, 0.5, '#fff') }], 0.7) +
      `<path d="M58.6 70.2L68.6 69.2" stroke="${P.brownD}" stroke-width="1"/>` +
      `<g transform="translate(76 86) rotate(-8) scale(.9)">` + card(k) + `<circle cx="0" cy="-12.6" r=".9" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/></g>` +
      chips +
      sparkle(42, 36, 2.4, '#fff') + sparkle(82, 40, 2, '#fff') +
      k.defs()
    )
  },
}
