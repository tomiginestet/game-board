// Super Smash Bros., en clave heroica. El rojo de la ficha del juego es el color propio (el guante, las cuerdas del
// ring, el telón, la mochila) y el papel del día lleva su grano rojo. Nada de la marca ni de sus personajes: la mano
// maestra es una cruceta de títeres, la estrella no tiene ojos y el coyote es sólo su cartelito.
// A Martín Karadagián no se lo dibuja: aparece por el cinturón de campeón.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Rojo de la ficha del juego, con su sombra, su luz y un rosado pálido para reflejos. */
const SM = '#E03131', SM_D = '#951B22', SM_L = '#F27B72', SM_XL = '#F9D4CD'
/** Roca roja del cañón y pelaje del lemming. */
const ROCK = '#C8603F', ROCK_D = '#8A3A24', ROCK_L = '#E79A72'
const FUR = '#C98B4A', FUR_D = '#7A4A22', FUR_L = '#EBC48E'
const FULL = 'M0 0H120V130H0Z'

/** Papel del día con el borde granulado en el rojo de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#EDB4A6', 0.5, 0.46, 0.7, 0, 1), '#DE9483', 0.45)

/** Cielo alto (para las caídas): celeste arriba que se aclara hacia abajo, con el grano rojo en el borde. */
const sky = (k: Kit) =>
  `<rect width="120" height="130" fill="${P.sky1}"/>` + k.shade(FULL, k.lin(P.sky, 0, 0, 0, 1, 0.9, 0), P.sky, 0.45) +
  k.shade(FULL, k.rad('#EDB4A6', 0.5, 0.46, 0.75, 0, 0.8), '#DE9483', 0.3)

/** Nube entintada: un racimo de bollos redondos. */
const cloud = (k: Kit, x: number, y: number, r: number, fill: string = P.white) => {
  const balls: [number, number, number][] = [[-0.6, 0.2, 0.46], [0.56, 0.24, 0.44], [-0.12, -0.24, 0.6], [0.36, -0.12, 0.46], [0.02, 0.3, 0.5]]
  return k.draw(balls.map(([dx, dy, rr]) => {
    const d = ellipse(f(x + dx * r), f(y + dy * r), f(rr * r), f(rr * r))
    return { d, fill, inner: k.sh(d, 0, 0, 1, 1, 0.05, 0.8, P.sky2, 0.45) }
  }), f(Math.min(0.55, r * 0.08)))
}

// ── El guante de box: de perfil, el puño a la derecha, centrado en (0,0) ───────────────────────────────

const FIST = 'M-6 -13.6C2 -18.4 14 -18 20.4 -11.6C25 -7 25.6 1 22.4 7.4C19 14 10 17.4 1 16.6C-2 16.4 -4.6 15.6 -6 14.6Z'
const THUMB = 'M-6.2 1.4C-2 -2.4 8 -3.6 14.4 -.6C17.6 1 18.2 4.6 16 6.6C13.4 8.8 8.4 8.6 4.4 8C0 7.4 -4 6.6 -6.2 5.6Z'
const CUFF = 'M-5 -12.8L-19 -10.6C-20.4 -10.4 -21.2 -9.2 -21.2 -7.8V10C-21.2 11.4 -20.4 12.6 -19 12.8L-5 14.8Z'

/** Guante de box rojo, con el pulgar cosido, la muñequera blanca y el cordón cruzado. */
function boxGlove(k: Kit, o: { fill?: string; dark?: string; light?: string; laces?: boolean } = {}) {
  const fill = o.fill ?? SM, dark = o.dark ?? SM_D, light = o.light ?? SM_L
  const lace = 'M-17 -7.4H-9M-17 -4.6H-9M-17 -1.4H-9M-17 1.4H-9M-17 4.6H-9M-17 7.4H-9'
  const bow = 'M-13 -7.4C-15.6 -10.6 -18.4 -10 -17.6 -8.2C-17 -7 -14.6 -7 -13 -7.4C-11.4 -10.6 -8.6 -10 -9.4 -8.2C-10 -7 -12.4 -7 -13 -7.4M-13 -7.4C-14 -5 -15.4 -3.4 -16.2 -2.6M-13 -7.4C-12 -5.2 -11 -3.6 -10 -3'
  return (
    k.draw([
      {
        d: CUFF, fill,
        inner: k.sh(CUFF, 0, 0, 0, 1, 0, 0.85, dark, 0.45) + `<path d="M-21.4 -11H-17.2V13H-21.4Z" fill="${P.white}"/>` + k.sh('M-21.4 -11H-17.2V13H-21.4Z', 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) +
          `<path d="M-17.2 -10.6V12.6" stroke="${P.ink}" stroke-width=".45"/>` +
          `<path d="M-6.4 -12.4C-7.4 -4 -7.4 6 -6.4 14.4" fill="none" stroke="${dark}" stroke-width=".7"/>`,
      },
      {
        d: FIST, fill,
        inner:
          k.sh('M6 -20H28V20H6Z', 0, 0, 1, 1, 0, 0.85, dark, 0.45) + k.sh('M-8 6H28V20H-8Z', 0, 0, 0, 1, 0, 0.8, dark, 0.4) +
          `<path d="M-8 -20H10V-6C4 -8 -2 -8 -8 -6Z" fill="${k.lin(light, 0, 0, 0, 1, 0.9, 0)}"/>` +
          `<ellipse cx="6" cy="-12.4" rx="6.4" ry="2.2" fill="${SM_XL}" opacity=".85" transform="rotate(-10 6 -12.4)"/><ellipse cx="3.4" cy="-13" rx="2" ry=".8" fill="#fff" transform="rotate(-10 3.4 -13)"/>` +
          `<path d="M-3.6 -12C3 -16 13 -16 19 -10.4C23 -6.6 23.6 0 21 5.6" fill="none" stroke="${dark}" stroke-width=".45" stroke-dasharray="1 .8"/>` +
          hair(20, -10, 22.6, -4, 21.6, 2, 0.6, dark) + hair(10, 14.4, 15, 12.6, 18.6, 9, 0.6, dark),
      },
    ], 0.8) +
    k.draw([{ d: THUMB, fill, inner: k.sh(THUMB, 0, 0, 1, 1, 0, 0.85, dark, 0.45) + `<path d="M-1 1.4C3 -1.4 9 -2 14 .4" fill="none" stroke="${light}" stroke-width=".9" stroke-linecap="round"/>` + hair(4, 7.4, 9, 8, 14, 7, 0.5, dark) }], 0.5) +
    `<path d="M-4.6 2.4C0 -.6 8 -1.4 13 .6C16 1.8 17 4.2 15.8 6.2" fill="none" stroke="${dark}" stroke-width=".4" stroke-dasharray=".9 .7"/>` +
    (o.laces === false
      ? hair(-16, -8, -16.6, 1, -16, 10, 0.7, light) + hair(-10, -9, -10.6, 1, -10, 11, 0.6, dark)
      : `<path d="${lace}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${lace}" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>` +
        `<path d="${bow}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${bow}" fill="none" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>` +
        [-7.4, -4.6, -1.4, 1.4, 4.6, 7.4].map((y) => `<circle cx="-17" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/><circle cx="-9" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join(''))
  )
}

// ── La plataforma flotante de las caídas ───────────────────────────────────────────────────────────────

/** Plataforma de piedra flotante: tapa con su borde rojo y la roca que se afina abajo. */
function platform(k: Kit, x0: number, x1: number, y: number, depth: number) {
  const top = `M${x0} ${f(y - 2.6)}H${x1}V${f(y + 1.8)}H${x0}Z`
  const cx = (x0 + x1) / 2
  const rock = `M${f(x0 + 1)} ${f(y + 1.6)}H${f(x1 - 1)}C${f(x1 - 3)} ${f(y + depth * 0.4)} ${f(cx + 8)} ${f(y + depth * 0.8)} ${f(cx + 2)} ${f(y + depth)}C${f(cx - 6)} ${f(y + depth * 0.82)} ${f(x0 + 4)} ${f(y + depth * 0.5)} ${f(x0 + 1)} ${f(y + 1.6)}Z`
  const cracks = hair(cx - 8, y + 4, cx - 4, y + depth * 0.4, cx - 1, y + depth * 0.75, 0.55, P.night) + hair(cx + 10, y + 4, cx + 6, y + depth * 0.35, cx + 4, y + depth * 0.6, 0.5, P.night) + hair(x0 + 6, y + 4, x0 + 9, y + 8, x0 + 13, y + 10, 0.45, P.night)
  return (
    k.draw([
      { d: rock, fill: P.mid, inner: k.sh(rock, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + `<path d="M${x0} ${y}H${f(cx - 6)}V${f(y + depth)}H${x0}Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.5, 0)}"/>` + cracks },
      { d: top, fill: P.sky1, inner: `<path d="M${x0} ${f(y - 0.2)}H${x1}V${f(y + 1.8)}H${x0}Z" fill="${SM}"/>` + k.sh(top, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + `<path d="M${f(x0 + 1)} ${f(y - 1.6)}H${f(x1 - 1)}" stroke="#fff" stroke-width=".6"/>` + `<path d="M${x0} ${f(y + 1.2)}H${x1}" stroke="${SM_D}" stroke-width=".5"/>` },
    ], 0.7)
  )
}

export const SMASH_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Luchador ──────────────────────────────────────────────────────

  // Tres victorias: el guante de box rojo, y el golpe que se escucha.
  'Guante de box': (u) => {
    const k = kit(u)
    const burst = starPath(84, 50.6, 7.8, 3.9, 9, -10)
    return (
      field(k) +
      k.sun(60, 58, 15, 46, 32, false) +
      k.shade(ellipse(58, 58, 26, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.draw([{ d: burst, fill: P.goldL, inner: k.sh(burst, 0, 0, 1, 1, 0, 0.8, P.gold, 0.4) }], 0.5) +
      hair(24, 50, 28, 49, 32, 49.6, 0.8, P.mid) + hair(22, 58, 27, 58, 32, 58.6, 0.9, P.mid) + hair(24, 66, 28, 66.6, 32, 67.4, 0.7, P.mid) +
      `<g transform="translate(55.6 59.6) rotate(-6) scale(1.06)">` + k.cast([FIST, CUFF], 2, 2.2) + boxGlove(k) + `</g>` +
      sparkle(88, 34, 2.2) + sparkle(36, 84, 1.6) +
      k.defs()
    )
  },

  // Diez victorias: Titanes en el Ring. El cinturón de campeón colgado de las cuerdas, bajo el reflector.
  'Titanes en el Ring': (u) => {
    const k = kit(u)
    const ropeY = [44, 55.4, 66.8]
    const rope = (y: number) => `M14 ${f(y + 6)}Q50 ${f(y + 3)} 86 ${y}`
    const post = roundRect(84.6, 34, 91.4, 104, 2)
    const pad = (y: number) => roundRect(83.4, y - 3.2, 92.6, y + 3.2, 1.6)
    const strap = 'M18 59.4C34 66.4 50 69 62 69C74 69 86 66.4 96 61L97 70C86 75.4 74 78 62 78C50 78 34 75.4 18 68.6Z'
    const plate = 'M48 58.4C48 53 54 49.6 62 49.6C70 49.6 76 53 76 58.4V69.6C76 75 70 79.4 62 79.4C54 79.4 48 75 48 69.6Z'
    const side = (x: number) => roundRect(x - 4.6, 61.6, x + 4.6, 73.6, 1.8)
    const rivets = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<circle cx="${f(62 + Math.cos(a) * 11.6)}" cy="${f(64.6 + Math.sin(a) * 12.4)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    return (
      k.night() +
      k.shade('M42 0H78L104 110H16Z', k.lin(P.goldL, 0, 0, 0, 1, 0.45, 0.05), P.goldL, 0.35) +
      [[28, 30], [94, 26], [22, 50], [40, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.draw([{ d: post, fill: P.sky1, inner: k.sh(post, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + `<path d="M85.6 36V102" stroke="#fff" stroke-width=".8"/>` }], 0.7) +
      ropeY.map((y, i) => `<path d="${rope(y)}" fill="none" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="${rope(y)}" fill="none" stroke="${i === 1 ? P.white : SM}" stroke-width="2" stroke-linecap="round"/><path d="${rope(y)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".6" transform="translate(0 -.6)"/>`).join('') +
      k.draw(ropeY.map((y, i) => ({ d: pad(y), fill: i === 1 ? P.white : SM, inner: k.sh(pad(y), 0, 0, 1, 1, 0, 0.8, i === 1 ? P.blue : SM_D, 0.45) })), 0.55) +
      k.cast([strap, plate], 2.2, 2.4, '#000') +
      k.draw([{ d: strap, fill: P.night, inner: `<path d="M18 61C34 68 50 70.6 62 70.6C74 70.6 86 68 96 62.6" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-dasharray="1 .7"/><path d="M18 67C34 74 50 76.4 62 76.4C74 76.4 86 74 96.6 68.6" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-dasharray="1 .7"/>` + k.sh(strap, 0, 0, 0, 1, 0, 0.6, '#000', 0.3) }], 0.6) +
      k.draw([{ d: side(37), fill: P.gold, inner: k.sh(side(37), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="${starPath(37, 67.6, 2.6, 1.1, 5)}" fill="${SM}" stroke="${P.goldD}" stroke-width=".3"/>` }, { d: side(87), fill: P.gold, inner: k.sh(side(87), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="${starPath(87, 67.6, 2.6, 1.1, 5)}" fill="${SM}" stroke="${P.goldD}" stroke-width=".3"/>` }], 0.5) +
      k.draw([{
        d: plate, fill: P.gold,
        inner: k.sh(plate, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M46 48H56V80H46Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.7, 0)}"/>` +
          `<path d="M52 58.8C52 55.6 56.4 53.6 62 53.6C67.6 53.6 72 55.6 72 58.8V69.4C72 72.8 67.6 75.4 62 75.4C56.4 75.4 52 72.8 52 69.4Z" fill="${SM}" stroke="${P.goldD}" stroke-width=".6"/>` +
          k.sh('M52 53H72V76H52Z', 0, 0, 1, 1, 0, 0.8, SM_D, 0.4) +
          `<path d="${starPath(62, 64.4, 7, 2.9, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/><path d="${starPath(62, 64.4, 3.2, 1.3, 5)}" fill="${P.gold}"/>` + rivets,
      }], 0.75) +
      `<path d="M51 55C53 52.4 57 51 61 51" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".85"/>` +
      `<path d="M44 80.6C50 83 74 83 80 80.6" fill="none" stroke="${P.goldL}" stroke-width=".4" opacity=".5"/>` +
      sparkle(76, 50, 2.6, '#fff') + sparkle(34, 40, 1.6, P.goldL) + sparkle(30, 88, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Veinticinco victorias: la mano maestra. La cruceta del titiritero, de oro, mueve dos guantes con sus hilos, frente
  // al telón rojo.
  'Mano Maestra': (u) => {
    const k = kit(u)
    const bar = roundRect(37, 34, 83, 37.6, 1.8)
    const cross = roundRect(58.2, 27, 61.8, 45, 1.8)
    const knob = (x: number, y: number) => k.draw([{ d: ellipse(x, y, 2.4, 2.4), fill: P.gold, inner: k.sh(ellipse(x, y, 2.4, 2.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.45) + `<circle cx="${f(x - 0.7)}" cy="${f(y - 0.7)}" r=".6" fill="#fff"/>`
    const drape = (x0: number, x1: number, flip: number) => {
      const d = flip > 0 ? `M${x0} 0H${x1}C${x1 - 2} 30 ${x1 + 4} 70 ${x1 - 6} 110H${x0}Z` : `M${x0} 0H${x1}V110H${x0 + 6}C${x0 - 4} 70 ${x0 + 2} 30 ${x0} 0Z`
      const folds = Array.from({ length: 4 }, (_, i) => { const x = x0 + 3 + i * ((x1 - x0 - 6) / 3); return hair(x, 2, x + flip * 1.4, 50, x + flip * 0.4, 106, 0.8, SM_D) }).join('')
      return k.draw([{ d, fill: SM, inner: k.sh(d, 0, 0, flip > 0 ? 1 : 0, 0, flip > 0 ? 0 : 0.9, flip > 0 ? 0.9 : 0, SM_D, 0.5) + folds + `<path d="M${x0} 0H${x1}V110H${x0}Z" fill="${k.lin(SM_L, flip > 0 ? 0 : 1, 0, flip > 0 ? 1 : 0, 0, 0.5, 0)}"/>` }], 0.7)
    }
    const valance = 'M0 0H120V17C114 21 108 21 102 17C96 21 90 21 84 17C78 21 72 21 66 17C60 21 54 21 48 17C42 21 36 21 30 17C24 21 18 21 12 17C6 21 0 21 0 17Z'
    const fringe = Array.from({ length: 21 }, (_, i) => { const x = 3 + i * 6; return `M${x} ${f(18.6 + (i % 2) * 0.6)}V${f(21.4 + (i % 2) * 0.6)}` }).join('')
    const string = (x0: number, y0: number, x1: number, y1: number) => `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${P.goldL}" stroke-width=".45" opacity=".95"/>`
    const hang = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(.62)">` + k.cast([FIST, CUFF], 2.6, 2.6, '#000') + boxGlove(k, { laces: false }) + `</g>`
    return (
      k.night() +
      k.shade('M44 0H76L100 110H20Z', k.lin(P.goldL, 0, 0, 0, 1, 0.4, 0.05), P.goldL, 0.35) +
      drape(-4, 30, 1) + drape(90, 124, -1) +
      k.draw([{ d: valance, fill: SM, inner: k.sh(valance, 0, 0, 0, 1, 0, 0.8, SM_D, 0.45) + `<path d="M0 12H120" stroke="${P.gold}" stroke-width="1.2"/><path d="M0 13.6H120" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.6) +
      `<path d="${fringe}" stroke="${P.gold}" stroke-width=".9"/>` +
      k.floor(60, 96, 30, 3.4, '#000') +
      laurel(48, 101, 32, 95, 30, 76, 6) + laurel(72, 101, 88, 95, 90, 76, 6, true) +
      string(38, 36, 41, 64) + string(58.6, 44, 45, 66) + string(82, 36, 79, 62) + string(61.4, 44, 75.6, 64) +
      hang(42, 74, 84) + hang(78, 72, 98) +
      k.draw([
        { d: bar, fill: P.gold, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M39 34.8H81" stroke="${P.goldL}" stroke-width=".6"/>` + [44, 50, 70, 76].map((x) => `<path d="M${x} 34V37.6" stroke="${P.goldD}" stroke-width=".5"/>`).join('') },
        { d: cross, fill: P.gold, inner: k.sh(cross, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M59 29V43" stroke="${P.goldL}" stroke-width=".6"/>` },
      ], 0.65) +
      `<circle cx="60" cy="35.8" r="2.6" fill="${SM}" stroke="${P.ink}" stroke-width=".5"/><circle cx="59.3" cy="35.1" r=".7" fill="#fff"/>` +
      knob(37, 35.8) + knob(83, 35.8) + knob(60, 27) + knob(60, 45) +
      sparkle(46, 46, 2.2, P.goldL) + sparkle(76, 48, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Intocable ─────────────────────────────────────────────────────

  // Una perfecta: ni un pelo fuera de lugar. El frasco de gomina y el peine, brillando.
  'Ni despeinado': (u) => {
    const k = kit(u)
    const jar = 'M41 58C41 55.6 42.6 54.4 45 54.4H67C69.4 54.4 71 55.6 71 58V86C71 89.4 68.6 91.4 65 91.4H47C43.4 91.4 41 89.4 41 86Z'
    const lid = roundRect(40, 46.6, 72, 55, 1.8)
    const label = 'M41 64H71V80H41Z'
    const comb = roundRect(-22, -3.6, 22, 2.2, 1.6)
    const teeth = Array.from({ length: 19 }, (_, i) => { const x = -20 + i * 2.22, l = i < 9 ? 7.4 : 5.6; return `M${f(x)} 1.6V${f(1.6 + l)}` }).join('')
    return (
      field(k) +
      k.stage(60, 62, 33) +
      k.floor(58, 92, 22, 2.6, P.mid) +
      k.cast([jar, lid], 2.2, 2.2) +
      k.draw([
        { d: jar, fill: P.sky1, inner: `<path d="M41 60H71V92H41Z" fill="${P.green}" opacity=".35"/>` + k.sh(jar, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M44.6 58V88" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M47.4 58V88" stroke="#fff" stroke-width=".5" opacity=".7"/>` },
        { d: label, fill: SM, inner: k.sh(label, 0, 0, 1, 0, 0, 0.8, SM_D, 0.45) + `<path d="M41 65.4H71M41 78.6H71" stroke="${P.gold}" stroke-width=".6"/><path d="M41 66.4H71M41 77.6H71" stroke="${P.goldD}" stroke-width=".3" stroke-dasharray=".6 .6"/>` },
        { d: lid, fill: P.gold, inner: k.sh(lid, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + Array.from({ length: 14 }, (_, i) => `<path d="M${f(42 + i * 2.2)} 47V54.6" stroke="${P.goldD}" stroke-width=".5"/>`).join('') + `<path d="M41 48.4H71" stroke="${P.goldL}" stroke-width=".7"/>` },
      ], 0.75) +
      `<text x="56" y="74.2" ${GEORGIA} font-style="italic" font-size="5.6" fill="${P.white}" text-anchor="middle">gomina</text>` +
      `<g transform="translate(70 76) rotate(-58)">` + k.cast([comb], 1.6, 1.6) +
      `<path d="${teeth}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${teeth}" stroke="${P.brown}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([{ d: comb, fill: P.brown, inner: k.sh(comb, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + [[-14, -1], [-6, -.4], [3, -1.4], [12, -.6], [18, -1.2]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1" fill="${P.brownD}" opacity=".6"/>`).join('') + `<path d="M-20 -2.6H20" stroke="${P.goldL}" stroke-width=".5"/>` }], 0.5) +
      `</g>` +
      hair(32, 46, 34, 40, 38, 36, 0.6, P.mid) + hair(30, 52, 31, 48, 33, 45, 0.5, P.mid) +
      sparkle(46, 44, 3, '#fff') + sparkle(84, 40, 2.2) + sparkle(36, 74, 1.6) +
      k.defs()
    )
  },

  // Cuatro perfectas: teflón, no se te pega nada. La sartén y el huevo que se resbala.
  'Teflón': (u) => {
    const k = kit(u)
    const pan = ellipse(52, 66, 24, 15)
    const inner = ellipse(52, 65, 20.6, 12.4)
    const handle = 'M73.4 58.6L90.4 49.6C92.6 48.4 94.6 49.4 94.6 51.4C94.6 52.8 93.8 53.8 92.4 54.6L75.6 63.6Z'
    const white = 'M30 61C28 56.6 31 53 35.6 53.4C38.4 50.4 44 51 45.6 54.6C49.6 54.4 51.4 58 49.4 61C50.6 64.6 47 67.4 43 66.2C40 68.6 34.6 68 33.6 65C30.4 65.2 28.6 63 30 61Z'
    return (
      field(k) +
      k.stage(60, 60, 33) +
      k.floor(54, 84, 26, 3.4, P.mid) +
      k.cast([pan, handle], 2.4, 2.4) +
      k.draw([
        { d: handle, fill: SM, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.9, SM_D, 0.5) + `<path d="M75 59.6L91.4 51" stroke="${SM_L}" stroke-width=".8"/>` + `<circle cx="90.8" cy="52" r="1" fill="${P.night}"/>` },
        { d: pan, fill: P.sky2, inner: k.sh(pan, 0, 0, 0, 1, 0.1, 0.9, P.mid, 0.5) + `<path d="M28 68C32 76 44 81 52 81C60 81 72 76 76 68" fill="none" stroke="#fff" stroke-width=".6" opacity=".6"/>` },
      ], 0.75) +
      `<path d="${inner}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
      k.clip(inner, k.shade(inner, k.rad(P.mid, 0.4, 0.35, 0.7, 0.9, 0), P.mid, 0.4) +
        `<path d="M36 58C42 55 54 54 62 55.6" fill="none" stroke="${P.sky}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/><path d="M58 72C64 72 68 70 70 68" fill="none" stroke="${P.sky}" stroke-width=".9" stroke-linecap="round" opacity=".6"/>`) +
      `<path d="M69.6 64.4L74 62.2" stroke="${P.goldL}" stroke-width="1.6"/><circle cx="71.4" cy="63.4" r=".7" fill="${P.ink}"/>` +
      `<g transform="translate(-4 -2) rotate(-16 40 60)">` +
      k.cast([white], 1.2, 1.4, P.mid) +
      k.draw([{ d: white, fill: P.white, inner: k.sh(white, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + `<path d="M31 59C32 56 35 54.6 38 55" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` }], 0.6) +
      k.draw([{ d: ellipse(40.6, 59.4, 4.6, 4), fill: P.gold, inner: k.sh(ellipse(40.6, 59.4, 4.6, 4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.5) +
      `<ellipse cx="39.2" cy="58" rx="1.6" ry=".9" fill="#fff" opacity=".9" transform="rotate(-30 39.2 58)"/>` +
      `</g>` +
      hair(50, 50, 54, 47, 59, 46.4, 0.7, P.mid) + hair(48, 54, 53, 51.6, 58, 51, 0.6, P.mid) +
      sparkle(66, 58, 2.6, '#fff') + sparkle(86, 34, 2) + sparkle(30, 80, 1.6) +
      k.defs()
    )
  },

  // Diez perfectas: la estrella invencible, tallada en facetas, que brilla de todos los colores. Sin ojos.
  'Estrella invencible': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58, R = 27, r = 11.6
    const pt = (i: number, rr: number) => { const a = ((-90 + i * 36) * Math.PI) / 180; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)] }
    let facets = ''
    for (let i = 0; i < 5; i++) {
      const o = pt(i * 2, R), il = pt(i * 2 - 1, r), ir = pt(i * 2 + 1, r)
      for (const [side, inn] of [[-1, il], [1, ir]] as const) {
        const mx = (o[0] + inn[0] + cx) / 3 - cx, my = (o[1] + inn[1] + cy) / 3 - cy, dot = (-mx * 0.6 - my * 0.8) / Math.hypot(mx, my)
        const c = dot > 0.35 ? P.goldL : dot > -0.2 ? (side < 0 ? P.gold : '#F7C66E') : side < 0 ? P.gold : P.goldD
        facets += `<path d="M${f(cx)} ${f(cy)}L${f(o[0])} ${f(o[1])}L${f(inn[0])} ${f(inn[1])}Z" fill="${c}"/>`
      }
    }
    const star = starPath(cx, cy, R, r, 5)
    const ridges = Array.from({ length: 5 }, (_, i) => { const o = pt(i * 2, R), q = pt(i * 2 + 1, r); return `M${f(cx)} ${f(cy)}L${f(o[0])} ${f(o[1])}M${f(cx)} ${f(cy)}L${f(q[0])} ${f(q[1])}` }).join('')
    const colors = [SM, P.gold, P.green, P.sky, P.mid, '#B07CC6']
    const rays = Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2, w = 0.07, r0 = 14, r1 = 50
      return `<path d="M${f(cx + Math.cos(a - w) * r0)} ${f(cy + Math.sin(a - w) * r0)}L${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}L${f(cx + Math.cos(a + w) * r0)} ${f(cy + Math.sin(a + w) * r0)}Z" fill="${colors[i % 6]}" opacity=".8"/>`
    }).join('')
    const rings = colors.map((c, i) => `<circle cx="${cx}" cy="${cy}" r="${32 - i * 1.6}" fill="none" stroke="${c}" stroke-width="1.6" opacity=".9"/>`).join('')
    return (
      field(k) +
      rays + k.shade(FULL, k.rad(P.paper, 0.5, 0.45, 0.6, 0, 0.9), P.paper, 0.5) +
      rings + `<circle cx="${cx}" cy="${cy}" r="33" fill="none" stroke="${P.ink}" stroke-width=".5"/><circle cx="${cx}" cy="${cy}" r="23.2" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      k.shade(ellipse(cx, cy, 24, 24), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.95, 0), '#ffffff', 0.6) +
      laurel(48, 101, 31, 94, 28, 70, 7) + laurel(72, 101, 89, 94, 92, 70, 7, true) +
      k.cast([star], 2.4, 2.6, P.mid) +
      k.draw([{ d: star, fill: P.gold, inner: facets + `<path d="${ridges}" stroke="${P.goldD}" stroke-width=".45"/>` + k.shade(star, k.rad(P.goldD, 0.6, 0.62, 0.6, 0, 0.6), P.goldD, 0.25) }], 0.85) +
      `<path d="${starPath(cx, cy, R - 2.6, r - 1.1, 5)}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="3.4" fill="${P.white}" stroke="${P.goldD}" stroke-width=".6"/><path d="${starPath(cx, cy, 2.6, 0.7, 4)}" fill="${P.goldL}"/>` +
      hair(cx - 3, cy - 21, cx - 1.6, cy - 14, cx - 0.4, cy - 9, 0.9, '#fff') + hair(cx - 21, cy - 8, cx - 14, cy - 6.6, cx - 8, cy - 4.6, 0.8, '#fff') +
      sparkle(cx - 1.4, cy - 22, 3.4, '#fff') + sparkle(88, 34, 2.4, '#fff') + sparkle(32, 40, 2) + sparkle(86, 80, 1.6) +
      k.defs()
    )
  },

  // ── Al vacío ──────────────────────────────────────────────────────

  // Tres caídas solas: seguías a alguien, seguro. El lemming en el borde, mirando las huellas que siguen al vacío.
  'Lemming': (u) => {
    const k = kit(u)
    const body = 'M-11 1C-12.4 -6.4 -7.6 -12.4 -.4 -12.8C6.4 -13.2 11.8 -9.4 13.2 -3.8C14 -.6 12.6 2.4 9.4 3.2H-7.6C-9.6 3.2 -10.8 2.4 -11 1Z'
    const cap = 'M-1.6 -12.6C5.4 -13.4 11.6 -9.6 13.2 -3.8C12.4 -1.6 11 -.6 9.2 -.8C8.6 -4.6 6 -7.6 1.6 -8.6C-.2 -9 -1.8 -10.4 -1.6 -12.6Z'
    const ear = 'M3.4 -12.4C3 -14.8 4.8 -16 6.4 -15C7.4 -14.2 7.2 -12.6 6.2 -11.8Z'
    const belly = 'M-9.6 1.6C-6 -1 4 -1.4 10.4 .6C10 2.4 9.6 3 9.4 3.2H-7.6C-8.8 3.2 -9.6 2.6 -9.6 1.6Z'
    const prints = [[68, 75.4, 1.1], [73.2, 74, 1.05], [78.4, 75.4, 1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) rotate(90) scale(${s} ${f(s * 0.55)})"><ellipse cx="0" cy=".4" rx="1.5" ry="1.1" fill="${P.ink}"/><circle cx="-1.7" cy="-1.4" r=".55" fill="${P.ink}"/><circle cx="-.6" cy="-2.1" r=".55" fill="${P.ink}"/><circle cx=".6" cy="-2.1" r=".55" fill="${P.ink}"/><circle cx="1.7" cy="-1.4" r=".55" fill="${P.ink}"/></g>`).join('')
    return (
      sky(k) +
      cloud(k, 92, 100, 10) + cloud(k, 74, 32, 6) +
      platform(k, 14, 83, 76, 26) +
      prints +
      `<path d="M83.6 75C89 76 91 82 90 92" fill="none" stroke="${P.mid}" stroke-width=".7" stroke-dasharray="1.2 1.2"/>` +
      hair(88, 80, 91, 86, 90.4, 94, 0.8, P.mid) + hair(92, 78, 95, 84, 94.6, 90, 0.6, P.mid) +
      `<g transform="translate(43 70.8) scale(1.58)">` +
      k.floor(1, 3.4, 13, 1.6, P.mid) +
      `<path d="M-10 0C-13 -1 -14.6 -.4 -15.4 .6" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-10 0C-13 -1 -14.6 -.4 -15.4 .6" fill="none" stroke="${FUR_D}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([
        { d: ear, fill: FUR_D, inner: `<path d="M4.4 -12.6C4.2 -14 5 -14.6 5.8 -14.2" fill="none" stroke="${SM_L}" stroke-width=".6"/>` },
        {
          d: body, fill: FUR,
          inner:
            `<path d="${cap}" fill="${P.night}"/>` + `<path d="${belly}" fill="${FUR_L}"/>` +
            k.sh(body, 0, 0, 1, 1, 0, 0.6, FUR_D, 0.4) + `<path d="M-12 -14H2V-4C-4 -6 -8 -5 -12 -2Z" fill="${k.lin(FUR_L, 0, 0, 1, 1, 0.8, 0)}"/>` +
            hair(-8, -6, -6, -9, -2, -10.4, 0.5, FUR_D) + hair(-9.4, -2, -6, -4, -2, -4.4, 0.45, FUR_D) + hair(-4, -1, 0, -2.6, 4, -2.4, 0.4, FUR_D) + hair(4, -11.6, 7.6, -11, 10.6, -7.6, 0.45, P.mid),
        },
      ], 0.65) +
      `<ellipse cx="13.4" cy="-3" rx="1" ry=".8" fill="${SM_L}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="8.6" cy="-6.6" r="1" fill="#000"/><circle cx="8.9" cy="-6.9" r=".3" fill="#fff"/>` +
      `<path d="M12.6 -2.2L17 -3.4M12.6 -1.6L16.6 -.8M12.4 -2.6L16.4 -5" stroke="${P.ink}" stroke-width=".25"/>` +
      `<path d="M7.4 3.2C7.4 2 8.4 1.6 9.6 2.4L10.6 3.4H7.4Z M-6.6 3.2C-6.6 2.2 -5.6 1.8 -4.6 2.6L-4 3.4H-6.6Z" fill="${SM_L}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      sparkle(90, 50, 1.8, '#fff') + sparkle(30, 44, 1.6, '#fff') +
      k.defs()
    )
  },

  // Diez caídas solas: ¿para qué esperar a que te peguen? La mochila del paracaídas quedó en el borde.
  'Salto sin paracaídas': (u) => {
    const k = kit(u)
    const pack = roundRect(-11, -15, 11, 13, 3.4)
    const flap = 'M-11 -11.6C-11 -13.6 -9.4 -15 -7.4 -15H7.4C9.4 -15 11 -13.6 11 -11.6V-6C4 -3.6 -4 -3.6 -11 -6Z'
    const strapL = 'M-8.6 -15C-12 -10 -12.4 4 -9 13.4L-6 13.4C-9 4 -8.6 -8 -5.4 -15Z'
    const strapR = 'M8.6 -15C12 -10 12.4 4 9 13.4L6 13.4C9 4 8.6 -8 5.4 -15Z'
    return (
      sky(k) +
      cloud(k, 72, 96, 11) + cloud(k, 102, 90, 8) + cloud(k, 88, 30, 6) +
      platform(k, 14, 62, 70, 30) +
      `<path d="M66 66C72 70 76 80 76 94" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.4 1.2"/>` +
      hair(70, 72, 74, 80, 73.6, 90, 1, P.mid) + hair(76, 70, 80, 78, 80, 88, 0.8, P.mid) + hair(82, 72, 85, 78, 85, 85, 0.6, P.mid) +
      `<g transform="translate(42 54) rotate(-4)">` +
      k.floor(1, 14, 14, 1.8, P.mid) +
      k.cast([pack], 2, 2) +
      k.draw([
        {
          d: pack, fill: SM,
          inner: k.sh(pack, 0, 0, 1, 1, 0, 0.85, SM_D, 0.45) + `<path d="M-12 -16H-4V14H-12Z" fill="${k.lin(SM_L, 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<path d="M-8 -2H8V10H-8Z" fill="none" stroke="${SM_D}" stroke-width=".5" stroke-dasharray="1 .7"/>` +
            `<path d="M-5 6.6C-5 2.6 -2.6 .6 0 .6C2.6 .6 5 2.6 5 6.6C3.4 5.6 1.6 5.6 0 6.6C-1.6 5.6 -3.4 5.6 -5 6.6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
            `<path d="M-5 6.6L0 9.6L5 6.6M-1.6 6.2L0 9.6L1.6 6.2" fill="none" stroke="${P.ink}" stroke-width=".3"/>`,
        },
        { d: flap, fill: SM, inner: k.sh(flap, 0, 0, 1, 1, 0, 0.8, SM_D, 0.5) + `<path d="M-10 -7C-3 -5 3 -5 10 -7" fill="none" stroke="${SM_D}" stroke-width=".5" stroke-dasharray="1 .7"/>` + hair(-8, -13.4, -2, -14, 6, -13.4, 0.6, SM_L) },
      ], 0.7) +
      k.draw([{ d: strapL, fill: P.night }, { d: strapR, fill: P.night }], 0.45) +
      `<path d="M-10.4 -8.6H10.4V-6.4H-10.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".45"/><path d="M-2 -9.4H2V-5.6H-2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M-.9 -7.5H.9" stroke="${P.goldD}" stroke-width=".5"/>` +
      `<path d="M10.6 -4C14.6 -3 16 1 14.4 4.6" fill="none" stroke="${P.ink}" stroke-width="1.3"/><path d="M10.6 -4C14.6 -3 16 1 14.4 4.6" fill="none" stroke="${P.sky}" stroke-width=".5"/>` +
      `<path d="M12.6 4.4C11.4 6.6 12.2 9.4 14.6 9.6C17 9.8 18.2 7.2 17 5Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="14.6" cy="7.2" r="1" fill="${SM}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      sparkle(30, 34, 1.8, '#fff') + sparkle(56, 26, 1.4, '#fff') +
      k.defs()
    )
  },

  // Veinticinco al vacío: mirás para abajo, cartelito de "chau" y caés. En el cañón, sólo queda el cartel en el aire
  // y la polvareda allá abajo.
  'Coyote': (u) => {
    const k = kit(u)
    const cliff = 'M0 52H40C42.4 52 43.4 53 43 55L40.6 64L42.4 72L39 82L41.4 92L38.6 104L37 130H0Z'
    const cliffTop = 'M0 49.6H40.4C42.6 49.6 43.6 51 43.2 53H0Z'
    const butte = 'M74 70L77 61H96L99 70L101 92H72Z'
    const strata = (x0: number, x1: number, ys: number[], c: string) => ys.map((y, i) => hair(x0, y, (x0 + x1) / 2, y + (i % 2 ? 0.8 : -0.6), x1, y + 0.4, 0.6, c)).join('')
    const sign = roundRect(-14, -8.6, 14, 8.6, 1.2)
    const stick = 'M-1.6 7H1.6L1.2 26H-1.2Z'
    return (
      `<rect width="120" height="130" fill="${P.goldL}"/>` +
      k.shade(FULL, k.lin(SM_L, 0, 0, 0, 1, 0, 0.95), SM_L, 0.4) +
      k.sun(60, 92, 14, 70, 36, false) +
      k.shade(FULL, k.rad('#EDB4A6', 0.5, 0.46, 0.75, 0, 0.7), '#DE9483', 0.3) +
      k.draw([{ d: butte, fill: ROCK_L, inner: k.sh(butte, 0, 0, 1, 0, 0, 0.8, ROCK, 0.45) + strata(73, 100, [66, 72, 78, 84, 90], ROCK) + hair(80, 64, 82, 72, 80.6, 82, 0.4, ROCK) + hair(92, 66, 94, 74, 93, 86, 0.4, ROCK) }], 0.55) +
      `<path d="M44 100C56 96 70 96 106 100V130H44Z" fill="${ROCK}" opacity=".7"/>` +
      k.draw([
        {
          d: cliff, fill: ROCK,
          inner: k.sh(cliff, 0, 0, 1, 0, 0.1, 0.9, ROCK_D, 0.5) + `<path d="M0 50H22V130H0Z" fill="${k.lin(ROCK_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
            strata(0, 42, [58, 64.6, 71, 78, 85, 92, 99], ROCK_D) + strata(4, 38, [61.4, 74.6, 88.4], ROCK_L) + hair(30, 56, 34, 70, 31, 86, 0.6, ROCK_D) + hair(16, 60, 20, 76, 18, 96, 0.5, ROCK_D) +
            hair(36, 54, 38.6, 60, 37, 66, 0.5, ROCK_D) + hair(24, 66, 26, 72, 24.6, 80, 0.45, ROCK_D) + hair(38, 74, 39.6, 80, 38, 86, 0.45, ROCK_D) + hair(10, 70, 12, 78, 10.6, 86, 0.45, ROCK_D),
        },
        { d: cliffTop, fill: ROCK_L, inner: k.sh(cliffTop, 0, 0, 1, 0, 0, 0.6, ROCK, 0.4) },
      ], 0.75) +
      `<path d="M44 54C52 58 56 74 58 94" fill="none" stroke="${ROCK_D}" stroke-width=".7" stroke-dasharray="1.4 1.3" opacity=".8"/>` +
      [[47, 60, 1.2, 20], [50, 68, 0.9, 50], [45.6, 66, 0.7, 0]].map(([x, y, r, a]) => `<path d="M${f(x - r)} ${y}L${x} ${f(y - r)}L${f(x + r * 1.2)} ${f(y - r * 0.2)}L${f(x + r * 0.4)} ${f(y + r)}Z" fill="${ROCK}" stroke="${P.ink}" stroke-width=".35" transform="rotate(${a} ${x} ${y})"/>`).join('') +
      hair(48, 96, 44, 94, 40, 95, 0.6, ROCK_D) + hair(70, 96, 74, 94, 78, 95, 0.6, ROCK_D) + hair(52, 92, 49, 89, 46, 89, 0.5, ROCK_D) + hair(66, 92, 69, 89, 72, 89, 0.5, ROCK_D) +
      cloud(k, 60, 98, 8, P.goldL) + cloud(k, 52, 101, 5.4, P.goldL) + cloud(k, 69, 101, 5.6, P.goldL) +
      `<g transform="translate(68 42) rotate(8)">` +
      k.cast([sign, stick], 2, 2.2, ROCK_D) +
      k.draw([
        { d: stick, fill: P.brown, inner: k.sh(stick, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) },
        {
          d: sign, fill: '#E9C99A',
          inner: k.sh(sign, 0, 0, 1, 1, 0, 0.7, P.brown, 0.4) + hair(-12, -4, -2, -5, 12, -4.4, 0.4, P.brown) + hair(-12, 5, 0, 4.4, 12, 5.4, 0.4, P.brown) + hair(-6, -7, 2, -7.4, 10, -6.6, 0.35, P.brown),
        },
      ], 0.7) +
      [[-12, -6.6], [12, -6.6], [-12, 6.6], [12, 6.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.ink}"/>`).join('') +
      `<text x="0" y="3.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="9.4" fill="${P.ink}" text-anchor="middle">chau</text>` +
      `</g>` +
      hair(60, 30, 62, 26, 66, 24, 0.6, ROCK_D) + hair(74, 28, 76, 25, 80, 24, 0.5, ROCK_D) +
      sparkle(90, 38, 2.2, '#fff') + sparkle(30, 30, 1.6, '#fff') +
      k.defs()
    )
  },
}
