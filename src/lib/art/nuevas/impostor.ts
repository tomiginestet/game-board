// El Impostor: máscaras, antifaces, anteojos y palabras robadas, en clave heroica. Manda el magenta de la ficha del
// juego en el catálogo. Las "caras" son objetos (una máscara neutra, un antifaz, unos anteojos, un bigote con galera),
// nunca caras de historieta; a los detectives con derechos se los evoca por sus cosas.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** El magenta del Impostor (el color de su ficha en el catálogo), su sombra, su medio tono, su rosa y el grano rosa. */
const MAG = '#C2255C', MAG_D = '#7C1239', MAG_M = '#DB6A93', MAG_L = '#F3C6D5', MAG_G = '#E39BB5'
/** El gris del aluminio (el gorro de papel plateado) y el del hierro (la bola del preso). */
const FOIL = '#C9CFDC', IRON = '#4A5170', IRON_D = '#262B40'
const FULL = 'M0 0H120V130H0Z'

/** Varilla entintada (cordón, mango, palito): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Papel con el borde granulado en rosa: el cielo del Impostor. */
const rosa = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(MAG_L, 0.5, 0.46, 0.7, 0, 1), MAG_G, 0.55)

/** Escenario rosa: un disco claro con el borde granulado en magenta. */
const escenario = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FBEAF0"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(MAG_L, 0.5, 0.5, 0.5, 0, 1), MAG_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${MAG_M}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Moño de cinta magenta centrado en (0,0), con las dos colas hacia abajo. */
function bow(k: Kit, s = 1) {
  const loopL = 'M0 0C-2.4 -3.6 -7.6 -5.4 -8.6 -2.4C-9.4 .2 -6.4 2.4 0 0Z'
  const loopR = 'M0 0C2.4 -3.6 7.6 -5.4 8.6 -2.4C9.4 .2 6.4 2.4 0 0Z'
  const tailL = 'M-.6 .4C-2 3 -4 6.4 -6.4 8.8L-4 9L-3.6 11.4C-1.6 8.4 -.2 4.4 .6 .8Z'
  const tailR = 'M.6 .4C2 3 3.4 6.6 5 9.4L6.6 7.8L8 9.6C6.4 6.4 3.6 3 1 .2Z'
  const sh = (d: string) => k.sh(d, 0, 0, 1, 1, 0, 0.85, MAG_D, 0.45)
  return (
    `<g transform="scale(${s})">` +
    k.draw([
      { d: tailL, fill: MAG, inner: sh(tailL) },
      { d: tailR, fill: MAG, inner: sh(tailR) },
      { d: loopL, fill: MAG, inner: sh(loopL) + hair(-1.4, -0.8, -4.6, -2.6, -7.4, -2.2, 0.4, MAG_D) },
      { d: loopR, fill: MAG, inner: sh(loopR) + hair(1.4, -0.8, 4.6, -2.6, 7.4, -2.2, 0.4, MAG_D) },
    ], 0.4 / s) +
    k.draw([{ d: roundRect(-1.6, -1.8, 1.6, 1.8, 0.8), fill: MAG_M, inner: k.sh(roundRect(-1.6, -1.8, 1.6, 1.8, 0.8), 0, 0, 1, 1, 0, 0.8, MAG_D, 0.4) }], 0.35 / s) +
    `<path d="M-7 -3.4C-5.6 -4.4 -3.6 -4 -2.4 -2.8" fill="none" stroke="#fff" stroke-width=".4" stroke-linecap="round" opacity=".6"/>` +
    `</g>`
  )
}

/** Papelito doblado con la palabra secreta, centrado en (0,0). */
function papelito(k: Kit, word: string, w = 0.45) {
  const d = 'M-7.2 -5.6L7 -6.4L7.6 5.4L-6.8 6.2Z'
  return (
    k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.55, P.blue, 0.3) + `<path d="M-7 .2L7.3 -.6" stroke="${P.sky2}" stroke-width=".5"/><path d="M-7 .8L7.3 0" stroke="#fff" stroke-width=".4"/>` }], w) +
    `<text x=".2" y="-1.4" ${GEORGIA} font-style="italic" font-size="4" fill="${P.ink}" text-anchor="middle" transform="rotate(-3)">${word}</text>` +
    hair(-4.6, 3.2, -1, 2.6, 3.6, 2.8, 0.4, P.blue)
  )
}

export const IMPOSTOR_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Lobo con piel de oveja ─────────────────────────────────────────

  // Ganaste de impostor sin mover un músculo: la máscara neutra, sin boca ni gesto, en su palito.
  'Cara de nada': (u) => {
    const k = kit(u)
    const mask = 'M0 -19C8.4 -19 14 -12.6 14 -3.6C14 6.4 10 13.6 5 17.4C2.6 19.2 -2.6 19.2 -5 17.4C-10 13.6 -14 6.4 -14 -3.6C-14 -12.6 -8.4 -19 0 -19Z'
    const eyeL = 'M-10.6 -4.2C-8.8 -6.8 -4.6 -7 -2.8 -4.6C-4.6 -2.8 -8.8 -2.6 -10.6 -4.2Z'
    const eyeR = 'M10.6 -4.2C8.8 -6.8 4.6 -7 2.8 -4.6C4.6 -2.8 8.8 -2.6 10.6 -4.2Z'
    const nose = 'M.2 -4.6C1.2 -.6 2.8 3.4 3 6.2C2.2 7.4 .8 7.6 -.6 7.2C.6 6.4 1 2 .2 -4.6Z'
    const stick = 'M70.4 62L84 95'
    const hole = (d: string) => `<path d="${d}" fill="${P.night}"/><path d="${d}" fill="${k.lin(MAG_D, 0, 0, 0, 1, 0, 0.9)}"/><path d="${d}" fill="none" stroke="${P.ink}" stroke-width=".45"/>`
    return (
      rosa(k) +
      escenario(k, 60, 58, 34) +
      k.floor(64, 92, 22, 2.6, MAG_M) +
      // el palito dorado, torneado, por detrás de la máscara
      rod(stick, P.gold, 2) + `<path d="M70.2 63L83.4 94.6" stroke="${P.goldL}" stroke-width=".5" stroke-linecap="round"/>` +
      [[74.4, 72], [78.6, 82.2]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.1" ry="1.1" transform="rotate(-22 ${x} ${y})" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>`).join('') +
      `<circle cx="84.2" cy="95.4" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="83.6" cy="94.8" r=".6" fill="${P.goldL}"/>` +
      `<g transform="translate(56 52) rotate(-8) scale(1.22)">` +
      k.cast([mask], 1.8, 1.6, MAG_M) +
      k.draw([{
        d: mask, fill: P.white,
        inner:
          k.sh(mask, 0, 0, 1, 0, 0, 0.55, P.blue, 0.35) + k.sh('M-16 8H16V20H-16Z', 0, 0, 0, 1, 0, 0.45, P.blue, 0.3) +
          `<path d="M-16 -20H-6V20H-16Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` +
          k.shade(ellipse(7.4, 3.6, 4, 5), k.rad(P.blue, 0.5, 0.5, 0.5, 0.55, 0), P.blue, 0.3) + k.shade(ellipse(-7.4, 3.6, 3.4, 4.4), k.rad(P.sky2, 0.5, 0.5, 0.5, 0.5, 0), P.sky2, 0.3) +
          `<path d="${nose}" fill="${P.sky2}"/>` + k.sh(nose, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) +
          hair(-11.4, -7.6, -7, -10.6, -2.4, -8.2, 0.5, P.blue) + hair(11.4, -7.6, 7, -10.6, 2.4, -8.2, 0.5, P.blue) +
          hair(-1.6, 7.6, 0, 8.4, 1.8, 7.8, 0.4, P.blue) + hair(-4.4, 14.2, 0, 15.6, 4.4, 14.2, 0.4, P.sky2) +
          hair(-12, 2, -11.6, 7, -9, 11, 0.45, P.sky2) +
          `<path d="M0 -17.6C7.4 -17.6 12.6 -11.8 12.6 -3.6C12.6 5.6 9 12.4 4.4 16C2.2 17.6 -2.2 17.6 -4.4 16C-9 12.4 -12.6 5.6 -12.6 -3.6C-12.6 -11.8 -7.4 -17.6 0 -17.6Z" fill="none" stroke="${P.gold}" stroke-width=".45"/>` +
          `<path d="M-8.6 -15C-6.4 -16.6 -3.4 -17.2 -.6 -17" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>`,
      }], 0.6) +
      hole(eyeL) + hole(eyeR) +
      `<path d="M-10 -4.4C-8 -2.8 -5 -2.8 -3.4 -4.4M3.4 -4.4C5 -2.8 8 -2.8 10 -4.4" fill="none" stroke="${P.gold}" stroke-width=".3"/>` +
      `</g>` +
      `<g transform="translate(72.6 66) rotate(-20)">` + bow(k, 1.05) + `</g>` +
      sparkle(36, 34, 2.2, P.white) + sparkle(88, 44, 1.6, P.white) +
      k.defs()
    )
  },

  // Cinco victorias: los convenciste de algo que no sabías. El micrófono de discurso, con el chamuyo hecho voluta.
  'Chamuyero': (u) => {
    const k = kit(u)
    const cap = 'M60 27C66.6 27 70 31.6 70 37.6V54.4C70 60.4 66.6 65 60 65C53.4 65 50 60.4 50 54.4V37.6C50 31.6 53.4 27 60 27Z'
    const band = 'M49.6 44.2H70.4V48H49.6Z'
    const ribs = Array.from({ length: 17 }, (_, i) => { const y = 29 + i * 2.15; return y > 43.6 && y < 48.6 ? '' : `<path d="M48 ${f(y)}H72" stroke="${P.mid}" stroke-width=".55"/><path d="M48 ${f(y + 0.7)}H72" stroke="#fff" stroke-width=".35" opacity=".8"/>` }).join('')
    const curl = (sx: number) =>
      `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)">` +
      rod('M47 38C41 34.6 34.6 35.4 32.6 40C31 43.8 33.4 47 36.4 46.4C38.8 45.8 39.2 43 37.2 42.2', MAG, 1.1) +
      rod('M47.4 52C42 54 38.6 58.6 40 62.4C41 65 44 65.4 45.2 63.4C46 62 45 60.6 43.8 60.8', MAG, 0.9) +
      hair(45.4, 43, 41, 42.6, 38.6, 45.6, 0.5, MAG_M) + hair(45, 47.6, 41.4, 48.6, 38.4, 52, 0.45, MAG_M) +
      `</g>`
    return (
      rosa(k) +
      k.sun(60, 47, 16, 46, 28, false) +
      k.shade(ellipse(60, 47, 22, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.65, 0), P.goldL, 0.45) +
      curl(1) + curl(-1) +
      `<text x="31.4" y="76.4" ${GEORGIA} font-style="italic" font-size="5" fill="${MAG_D}" text-anchor="middle" transform="rotate(-12 31.4 76.4)">bla</text>` +
      `<text x="88.6" y="76.4" ${GEORGIA} font-style="italic" font-size="5" fill="${MAG_D}" text-anchor="middle" transform="rotate(12 88.6 76.4)">bla</text>` +
      k.floor(61, 94, 15, 2.4, MAG_M) +
      // pie: varilla, rosca y base pesada
      rod('M60 70V92', P.white, 2.2) + `<path d="M59.4 71V91" stroke="${P.blue}" stroke-width=".5"/>` +
      k.draw([{ d: 'M47 93.2C47 90.4 52.6 89 60 89C67.4 89 73 90.4 73 93.2V94.4C73 96.4 67.4 97.6 60 97.6C52.6 97.6 47 96.4 47 94.4Z', fill: P.gold, inner: k.sh('M46 88H74V98H46Z', 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M47.2 93.4C49 95 54 96 60 96C66 96 71 95 72.8 93.4" fill="none" stroke="${P.goldD}" stroke-width=".45"/><path d="M50 91.4C53 90.4 57 90 60 90" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` }], 0.6) +
      `<g transform="translate(60 81)">` + bow(k, 0.9) + `</g>` +
      // la horquilla que sostiene la cápsula
      rod('M46.4 46.4V58C46.4 66.4 52 71 60 71C68 71 73.6 66.4 73.6 58V46.4', P.white, 2) +
      `<path d="M45.8 47V58C45.8 64 49 68.6 54 70.2" fill="none" stroke="${P.blue}" stroke-width=".5"/>` +
      k.cast([cap], 1.8, 1.6, MAG_M) +
      k.draw([{
        d: cap, fill: P.white,
        inner:
          `<path d="${cap}" fill="${P.sky1}"/>` + ribs + k.sh(cap, 0, 0, 1, 0, 0, 0.85, P.mid, 0.45) +
          `<path d="M50 27H55V66H50Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.75, 0)}"/>` +
          `<path d="M52.6 30.4C53.4 29.2 55 28.4 56.6 28.2" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>`,
      }], 0.7) +
      k.draw([{ d: band, fill: P.gold, inner: k.sh(band, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M49.6 45H70.4" stroke="${P.goldL}" stroke-width=".5"/>` + Array.from({ length: 9 }, (_, i) => `<circle cx="${f(51 + i * 2.25)}" cy="46.9" r=".35" fill="${P.goldD}"/>`).join('') }], 0.45) +
      k.draw([{ d: ellipse(60, 46.1, 4.4, 3), fill: MAG, inner: k.sh(ellipse(60, 46.1, 4.4, 3), 0, 0, 1, 1, 0, 0.8, MAG_D, 0.4) + `<path d="${starPath(60, 46.1, 2, 0.8, 5)}" fill="${P.goldL}"/>` }], 0.4) +
      [[46.4, 46.4], [73.6, 46.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${x}" cy="${y}" r="1.1" fill="${P.goldD}"/><circle cx="${f(x - 0.8)}" cy="${f(y - 0.8)}" r=".5" fill="#fff"/>`).join('') +
      sparkle(86, 34, 2) + sparkle(34, 33, 1.6) +
      k.defs()
    )
  },

  // Doce victorias: le vendés un buzón a cualquiera. El buzón colorado de la esquina, con su cartelito de "se vende".
  'Vendedor de buzones': (u) => {
    const k = kit(u)
    const dome = 'M47.6 40.4C47.6 32.4 52.8 27.6 60 27.6C67.2 27.6 72.4 32.4 72.4 40.4Z'
    const collar = roundRect(45.6, 39.4, 74.4, 44.4, 1.2)
    const body = 'M47.6 44H72.4V86.4H47.6Z'
    const ring = roundRect(46.2, 85.6, 73.8, 89.2, 0.8)
    const plinth = 'M44.6 89H75.4L77.4 95.4H42.6Z'
    const hood = 'M51.4 49.2H68.6L67.6 52.4H52.4Z'
    const door = roundRect(52.2, 66.4, 67.8, 82.4, 1)
    const plate = roundRect(50.8, 57, 69.2, 62.6, 0.8)
    const tag = 'M-11.6 -4.6H8.4L11.4 -1.6V1.6L8.4 4.6H-11.6Z'
    const flutes = [50.2, 52.6, 67.4, 69.8].map((x) => `<path d="M${x} 44V86" stroke="${MAG_D}" stroke-width=".5" opacity=".7"/>`).join('')
    const rivets = (y: number, x0: number, x1: number, n: number) => Array.from({ length: n }, (_, i) => `<circle cx="${f(x0 + ((x1 - x0) * i) / (n - 1))}" cy="${y}" r=".45" fill="${P.goldL}" stroke="${MAG_D}" stroke-width=".2"/>`).join('')
    return (
      k.day() +
      k.sun(60, 54, 17, 47) +
      k.shade(ellipse(60, 56, 24, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      k.floor(61, 95.6, 20, 2.6, P.mid) +
      k.cast([dome, body, plinth], 2.2, 1.8) +
      k.draw([
        { d: plinth, fill: MAG, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.9, MAG_D, 0.5) + `<path d="M44 91.4H76" stroke="${MAG_D}" stroke-width=".5"/>` },
        {
          d: body, fill: MAG,
          inner:
            flutes + k.sh(body, 0, 0, 1, 0, 0.05, 0.95, MAG_D, 0.5) + `<path d="M49.4 44H54V87H49.4Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
            hair(50.8, 46, 51.4, 64, 50.8, 84, 0.7, '#fff', 0.6) + hair(70.6, 48, 71, 66, 70.6, 84, 0.5, P.wine, 0.8) +
            k.sh('M46 76H74V88H46Z', 0, 0, 0, 1, 0, 0.5, MAG_D, 0.3),
        },
        { d: ring, fill: P.gold, inner: k.sh(ring, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: dome, fill: MAG, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.9, MAG_D, 0.5) + `<path d="M50 40C50.4 34 54 30 59 29" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".7"/>` + hair(60, 29, 64.6, 33, 66.2, 40, 0.45, MAG_D) + hair(60, 29, 55.6, 33, 54, 40, 0.45, MAG_D) + hair(60, 29, 60.4, 34, 60, 40, 0.4, MAG_D) },
        { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M45.6 41.6H74.4" stroke="${P.goldD}" stroke-width=".4"/>` },
      ], 0.75) +
      rivets(42.6, 47.6, 72.4, 9) + rivets(87.4, 48.4, 71.6, 8) +
      // remate de la cúpula
      k.draw([{ d: 'M58 28L58.6 25.2H61.4L62 28Z', fill: P.gold }, { d: ellipse(60, 23.8, 2.2, 2.2), fill: P.gold, inner: k.sh(ellipse(60, 23.8, 2.2, 2.2), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.4) +
      `<circle cx="59.3" cy="23.1" r=".6" fill="#fff"/>` +
      // boca, chapa y puertita
      k.draw([{ d: hood, fill: MAG, inner: k.sh(hood, 0, 0, 0, 1, 0, 0.8, MAG_D, 0.4) }], 0.4) +
      `<path d="M52.6 52.4H67.4L66.8 54.6H53.2Z" fill="${P.night}"/>` +
      k.draw([{ d: plate, fill: P.gold, inner: k.sh(plate, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) }], 0.35) +
      `<text x="60" y="61.1" ${GEORGIA} font-weight="700" font-size="2.9" fill="${MAG_D}" text-anchor="middle">CORREOS</text>` +
      `<path d="${door}" fill="none" stroke="${MAG_D}" stroke-width=".7"/><path d="${roundRect(53.4, 67.6, 66.6, 81.2, 0.6)}" fill="none" stroke="${P.wine}" stroke-width=".4" opacity=".7"/>` +
      `<path d="${starPath(60, 72.6, 4.4, 2.6, 16)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<circle cx="60" cy="72.6" r="2.3" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".35"/><circle cx="59.4" cy="72" r=".6" fill="#fff"/>` +
      `<path d="M58.4 79.4H61.6V81.6H58.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M60 80.1V81" stroke="${P.ink}" stroke-width=".5" stroke-linecap="round"/>` +
      `<path d="M47.6 64.4H72.4" stroke="${P.gold}" stroke-width=".9"/><path d="M47.6 65.4H72.4" stroke="${MAG_D}" stroke-width=".4"/>` +
      [50.4, 54.4, 65.6, 69.6].map((x) => hair(60, 28.6, x + (x < 60 ? 1 : -1), 33, x, 40, 0.4, MAG_D, 0.9)).join('') +
      `<path d="M50.4 47.6C51 45.8 52.6 45 54.4 45" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".6"/>` +
      // el cartelito colgando del pico de la boca
      `<path d="M52.4 51.4C47 52 42 56 39.4 62.4" fill="none" stroke="${P.brownD}" stroke-width=".6"/>` +
      `<g transform="translate(37.4 68) rotate(-16)">` +
      k.draw([{ d: tag, fill: '#F2E2C2', inner: k.sh(tag, 0, 0, 1, 1, 0, 0.6, P.brown, 0.35) }], 0.45) +
      `<circle cx="8.6" cy="0" r=".9" fill="${P.paper}" stroke="${P.brownD}" stroke-width=".35"/>` +
      `<text x="-1.8" y="1.2" ${GEORGIA} font-weight="700" font-size="3.2" fill="${MAG_D}" text-anchor="middle">SE VENDE</text>` +
      `</g>` +
      sparkle(85, 36, 2.6, '#fff') + sparkle(34, 40, 1.8) +
      k.defs()
    )
  },

  // ── Ojo de halcón ──────────────────────────────────────────────────

  // Tres victorias del lado bueno: olfateás al intruso desde la cucha. Sólo asoma la trufa, que ya olió algo.
  'Perro guardián': (u) => {
    const k = kit(u)
    const wall = 'M35 55L60 33L85 55V92H35Z'
    const roofL = 'M60 26.4L28.4 55L32.6 59.4L60 34.6Z'
    const roofR = 'M60 26.4L91.6 55L87.4 59.4L60 34.6Z'
    const door = 'M48.6 92V75C48.6 68.6 53.6 63.6 60 63.6C66.4 63.6 71.4 68.6 71.4 75V92Z'
    const head = 'M15 -6.4C11 -10 4.6 -10.8 -.6 -9C-3.6 -8 -6 -6.6 -9.6 -6C-12.6 -5.6 -14.8 -4.4 -15.2 -2.4C-15.6 -.4 -14.4 1 -12.6 1.4C-10 2 -7 2.4 -4.4 3.4C-1 4.6 4 5.8 8 5.6C12 5.4 15.2 3 16 -.6Z'
    const ear = 'M3.6 -8.2C7.6 -9 10.8 -6.8 11.2 -2.6C11.6 1.6 10.2 6 7.6 8.2C5.6 9.6 3.2 8.4 3.2 6C3.2 2.4 2.4 -1.4 2.2 -4.4C2 -6.4 2.4 -7.8 3.6 -8.2Z'
    const nose = 'M-16.6 -3.6C-16.6 -5.2 -15.2 -6 -13.8 -5.8C-12.6 -5.6 -12.2 -4.4 -12.6 -3.2C-13 -2 -14.2 -1.6 -15.2 -1.8C-16 -2 -16.6 -2.6 -16.6 -3.6Z'
    const planks = Array.from({ length: 9 }, (_, i) => { const y = 41 + i * 5.6; return `<path d="M30 ${f(y)}H90" stroke="${P.brownD}" stroke-width=".6"/>` }).join('')
    const grain = [[38, 48, 50], [70, 76, 61.6], [40, 46, 72.8], [74, 82, 78.4], [37, 44, 84], [76, 83, 89.6], [54, 64, 45], [64, 70, 56.2]]
      .map(([x0, x1, y]) => hair(x0, y - 2.4, (x0 + x1) / 2, y - 3.4, x1, y - 2.4, 0.4, P.brownD, 0.8)).join('')
    const shingles = (side: number) => Array.from({ length: 6 }, (_, i) => {
      const t = (i + 1) / 7, x0 = 60, y0 = 30.4, x1 = 60 + side * 29, y1 = 57
      const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t
      return `<path d="M${f(x - side * 1.6)} ${f(y - 2.6)}L${f(x + side * 2.6)} ${f(y + 1.4)}" stroke="${MAG_D}" stroke-width=".5"/>`
    }).join('')
    const sniff = hair(42.2, 79.4, 39.4, 77, 39.4, 73.6, 0.6, MAG) + hair(41.8, 82.6, 38, 82.6, 36.4, 79.4, 0.6, MAG) + hair(43, 76.2, 41.6, 73.4, 43, 70.4, 0.5, MAG) +
      hair(38.2, 72.8, 36.8, 71, 37.8, 69, 0.4, MAG_M) + hair(35.2, 78.4, 33.6, 77, 33.8, 75, 0.4, MAG_M)
    return (
      rosa(k) +
      escenario(k, 60, 58, 34) +
      k.floor(61, 92.6, 30, 3, MAG_M) +
      k.cast([wall, roofL, roofR], 2.2, 2) +
      k.draw([{
        d: wall, fill: P.brown,
        inner:
          planks + grain + k.sh(wall, 0, 0, 1, 0, 0, 0.75, P.brownD, 0.45) + k.sh('M30 36H90V60H30Z', 0, 0, 0, 1, 0.8, 0, P.brownD, 0.4) +
          `<path d="M35 55H44V92H35Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.45, 0)}"/>`,
      }], 0.75) +
      k.draw([{ d: door, fill: P.night, inner: `<path d="${door}" fill="${k.lin('#000000', 0, 0, 0, 1, 0.35, 0)}"/>` + `<path d="M50 92V75C50 69.6 54.4 65 60 65" fill="none" stroke="${P.mid}" stroke-width=".6" opacity=".6"/>` }], 0.6) +
      `<path d="M48.6 92V75C48.6 68.6 53.6 63.6 60 63.6C66.4 63.6 71.4 68.6 71.4 75V92" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".7" transform="translate(-.6 -.4)"/>` +
      `<g transform="translate(60 80.6) rotate(-12)">` +
      k.clip('M-30 -20H11V20H-30Z', k.draw([
        {
          d: head, fill: '#C9935F',
          inner:
            k.sh(head, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M-16 -12H6V-5C0 -6 -8 -5 -16 -2Z" fill="${k.lin('#FFE3C2', 0, 0, 0, 1, 0.6, 0)}"/>` +
            hair(-12.6, 1.4, -8, 3, -3.6, 3.6, 0.55, P.brownD) + hair(-7.4, -6.4, -4.4, -8.2, -0.6, -8.4, 0.45, P.brownD) +
            [[-10.4, -1.4], [-8.6, -0.6], [-10.6, 0.2], [-7, 0.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".3" fill="${P.brownD}"/>`).join('') +
            `<path d="${head}" fill="${k.lin(P.night, 0.5, 0, 1, 0, 0, 0.9)}"/>`,
        },
        { d: ear, fill: P.brownD, inner: k.sh(ear, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + hair(4.4, -6, 5.6, 0, 5, 6, 0.4, '#C9935F', 0.7) },
        { d: nose, fill: P.ink, inner: `<ellipse cx="-14.6" cy="-4.8" rx="1.2" ry=".55" fill="#fff" opacity=".85"/><path d="M-16 -2.6C-15.4 -2 -14.6 -1.9 -14 -2.2" fill="none" stroke="#000" stroke-width=".6" stroke-linecap="round"/>` },
      ], 0.5)) +
      `<path d="M-5.4 -5.8C-4.6 -6.8 -2.8 -7 -1.8 -6C-2.6 -5 -4.4 -4.8 -5.4 -5.8Z" fill="${P.ink}"/><circle cx="-3.6" cy="-6.1" r=".35" fill="#fff"/>` +
      `</g>` +
      sniff +
      k.draw([
        { d: roofL, fill: MAG, inner: shingles(-1) + k.sh(roofL, 0, 0, 0, 1, 0, 0.6, MAG_D, 0.35) + `<path d="M58 30L32 53.6" stroke="#fff" stroke-width=".7" opacity=".45"/>` },
        { d: roofR, fill: MAG, inner: shingles(1) + k.sh(roofR, 0, 0, 1, 1, 0.2, 0.95, MAG_D, 0.5) },
      ], 0.75) +
      k.draw([{ d: ellipse(60, 27.6, 2.4, 2.4), fill: P.gold, inner: k.sh(ellipse(60, 27.6, 2.4, 2.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.45) +
      // la chapita con el nombre
      k.draw([{ d: roundRect(50.4, 54.4, 69.6, 60.4, 1.2), fill: P.goldL, inner: k.sh(roundRect(50.4, 54.4, 69.6, 60.4, 1.2), 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) }], 0.45) +
      `<text x="60" y="58.8" ${GEORGIA} font-style="italic" font-size="3.8" fill="${P.ink}" text-anchor="middle">Firulais</text>` +
      `<circle cx="51.8" cy="57.4" r=".4" fill="${P.goldD}"/><circle cx="68.2" cy="57.4" r=".4" fill="${P.goldD}"/>` +
      sparkle(86, 36, 2.2) + sparkle(32, 70, 1.6) +
      k.defs()
    )
  },

  // Diez impostores cazados: siempre hay una sola verdad. Los anteojos redondos encandilados y el moño rojo con su perilla.
  'Detective Conan': (u) => {
    const k = kit(u)
    const R = 12.8, r = 10.2
    const ring = (cx: number) => `${ellipse(cx, 0, R, R)} ${ellipse(cx, 0, r, r)}`
    const lens = (cx: number) => ellipse(cx, 0, r, r)
    const bridge = 'M-4.4 -2.4C-2.6 -5.4 2.6 -5.4 4.4 -2.4L3.2 -.6C1.6 -2.4 -1.6 -2.4 -3.2 -.6Z'
    const hinge = (x: number, s: number) => `M${x} -3.6H${f(x + s * 4.6)}V.6H${x}Z`
    const arm = (s: number) => `M${f(s * 30.4)} -1.6C${f(s * 33)} -1 ${f(s * 34.6)} 2 ${f(s * 34.4)} 6`
    const glare = (cx: number) =>
      `<path d="M${f(cx - 10)} 4L${f(cx + 0.4)} -10L${f(cx + 5.6)} -8.6L${f(cx - 6.4)} 7.6Z" fill="#fff" opacity=".95"/>` +
      `<path d="M${f(cx + 2.6)} 8.4L${f(cx + 8.8)} -1.4L${f(cx + 9.8)} 1.4L${f(cx + 5)} 9Z" fill="#fff" opacity=".85"/>`
    const tie = 'M0 0C-3.6 -3.4 -10.6 -6.8 -13.6 -5C-15.4 -2.4 -15.4 2.4 -13.6 5C-10.6 6.8 -3.6 3.4 0 0Z'
    const tieR = 'M0 0C3.6 -3.4 10.6 -6.8 13.6 -5C15.4 -2.4 15.4 2.4 13.6 5C10.6 6.8 3.6 3.4 0 0Z'
    const knot = roundRect(-3.4, -3.8, 3.4, 3.8, 1.4)
    const shTie = (d: string) => k.sh(d, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5)
    return (
      rosa(k) +
      k.sun(56, 50, 14, 46, 28, false) +
      k.shade(ellipse(56, 50, 30, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      // el moño rojo, abajo a la derecha, con la perilla del cambiavoces
      `<g transform="translate(77 79) rotate(24) scale(.95)">` +
      k.cast([tie, tieR], 1.6, 1.6, MAG_M) +
      k.draw([
        { d: tie, fill: P.red, inner: shTie(tie) + hair(-2, -1, -7, -3.4, -12, -3.4, 0.5, P.wine) + hair(-2, 1, -7, 3.4, -12, 3.6, 0.5, P.wine) + `<path d="M-12.6 -3.4C-10 -4.8 -6 -3.6 -3 -1.6" fill="none" stroke="#fff" stroke-width=".55" opacity=".55"/>` },
        { d: tieR, fill: P.red, inner: shTie(tieR) + hair(2, -1, 7, -3.4, 12, -3.4, 0.5, P.wine) + hair(2, 1, 7, 3.4, 12, 3.6, 0.5, P.wine) },
        { d: knot, fill: P.red, inner: k.sh(knot, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) },
      ], 0.6) +
      `<circle cx="0" cy="0" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<path d="M${f(Math.cos(a) * 1.6)} ${f(Math.sin(a) * 1.6)}L${f(Math.cos(a) * 2.4)} ${f(Math.sin(a) * 2.4)}" stroke="${P.goldD}" stroke-width=".3"/>` }).join('') +
      `<path d="M0 0L1.3 -1.1" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
      `</g>` +
      // los anteojos, de costado, con el reflejo que encandila
      `<g transform="translate(57 49) rotate(-14) scale(.94)">` +
      k.cast([ellipse(-14, 0, R, R), ellipse(14, 0, R, R)], 2, 2.2, MAG_M) +
      rod(arm(-1), P.night, 1.4) + rod(arm(1), P.night, 1.4) +
      `<path d="${lens(-14)}" fill="${P.sky1}"/><path d="${lens(14)}" fill="${P.sky1}"/>` +
      k.clip(lens(-14), k.sh(lens(-14), 0, 0, 1, 1, 0, 0.6, P.sky, 0.45) + glare(-14)) +
      k.clip(lens(14), k.sh(lens(14), 0, 0, 1, 1, 0, 0.6, P.sky, 0.45) + glare(14)) +
      `<path d="${ring(-14)} ${ring(14)}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.7 .8)"/>` +
      k.draw([
        { d: hinge(-26.6, -1), fill: P.night },
        { d: hinge(26.6, 1), fill: P.night },
        { d: bridge, fill: P.night, inner: `<path d="M-3 -3.6C-1.4 -4.6 1.4 -4.6 3 -3.6" fill="none" stroke="${P.mid}" stroke-width=".5"/>` },
      ], 0.5) +
      `<path d="${ring(-14)} ${ring(14)}" fill-rule="evenodd" fill="${P.night}"/>` +
      `<path d="M-23.4 -6.4A11.6 11.6 0 0 1 -17 -11.2M4.6 -6.4A11.6 11.6 0 0 1 11 -11.2" fill="none" stroke="${P.sky}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M-5 5A11.6 11.6 0 0 1 -9.4 9.6M23 5A11.6 11.6 0 0 1 18.6 9.6" fill="none" stroke="${P.mid}" stroke-width=".6" stroke-linecap="round"/>` +
      `<path d="${lens(-14)} ${lens(14)}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="${starPath(-5, -9.4, 5, 0.75, 4)}" fill="#fff" stroke="${P.ink}" stroke-width=".25"/>` +
      `<path d="${starPath(22.6, -6.8, 3, 0.5, 4)}" fill="#fff"/>` +
      `</g>` +
      sparkle(32, 74, 1.8) + sparkle(88, 32, 1.6) +
      k.defs()
    )
  },

  // Veinticinco victorias: te atusás el bigote y ya sabés quién es. El bigote engominado, como reliquia en su almohadón.
  'Hércules Poirot': (u) => {
    const k = kit(u)
    const cushion = 'M27.6 77C26.6 68 33.6 63 60 63C86.4 63 93.4 68 92.4 77C93.4 86 86.4 91 60 91C33.6 91 26.6 86 27.6 77Z'
    const wing = (s: number) => taper(0, 0.4, -s * 8, 4.6, -s * 15.6, -0.2, 7.4, 3)
    const tip = (s: number) => taper(-s * 15.2, 0, -s * 21.8, -0.6, -s * 20.2, -7.4, 3.1, 1.1)
    const curlEnd = (s: number) => `<path d="M${f(-s * 20.2)} -7.2C${f(-s * 19.8)} -9.4 ${f(-s * 17.4)} -9.8 ${f(-s * 16.8)} -8C${f(-s * 16.4)} -6.6 ${f(-s * 17.8)} -6 ${f(-s * 18.4)} -6.8" fill="none" stroke="${P.night}" stroke-width="1.1" stroke-linecap="round"/>`
    const strands = (s: number) =>
      hair(-s * 2, -1.4, -s * 8, 1.4, -s * 14, -1.4, 0.4, P.mid) + hair(-s * 2.6, 1.6, -s * 9, 4.2, -s * 15, 0.6, 0.4, P.mid) + hair(-s * 3, 3.4, -s * 7.4, 5.4, -s * 12, 3.4, 0.35, P.mid) +
      hair(-s * 1.4, 0.2, -s * 7, 2.6, -s * 13, -0.2, 0.35, '#fff', 0.55) + hair(-s * 16, -0.4, -s * 20.4, -1, -s * 19.6, -5.4, 0.35, '#fff', 0.6) +
      hair(-s * 3.4, -2.4, -s * 8.6, -0.6, -s * 14.4, -2.2, 0.3, P.mid) + hair(-s * 4, 4.4, -s * 9, 5.6, -s * 13.4, 2.6, 0.3, P.mid) + hair(-s * 15.4, 1.2, -s * 21, 0.4, -s * 21, -4.6, 0.3, P.mid)
    const tassel = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.35)"><circle cx="0" cy="0" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M-1.4 1.2L-2 6.4H2L1.4 1.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M-.8 2V6M0 2V6.2M.8 2V6" stroke="${P.goldD}" stroke-width=".3"/><path d="M-1.6 2.2H1.6" stroke="${P.goldD}" stroke-width=".4"/></g>`
    const flor = (x: number, y: number) => `<g transform="translate(${x} ${y})"><path d="${starPath(0, 0, 2.2, 0.8, 6)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".25"/><circle cx="0" cy="0" r=".6" fill="${P.goldL}"/>${hair(-2.4, 1.4, -4.6, 1, -6, -0.6, 0.35, P.gold)}${hair(2.4, 1.4, 4.6, 1, 6, -0.6, 0.35, P.gold)}</g>`
    const comb = roundRect(-7.4, -1.6, 7.4, 0.6, 0.6)
    const teeth = Array.from({ length: 14 }, (_, i) => `<path d="M${f(-6.6 + i * 1.02)} .4V3" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>`).join('')
    const rid = k.id('cinta')
    const ribbon = 'M37.6 35Q60 26.6 82.4 35V41Q60 32.6 37.6 41Z'
    const tailL = 'M37.6 35L31.6 36.6L34.6 39.6L33 43.6L37.6 41Z'
    const tailR = 'M82.4 35L88.4 36.6L85.4 39.6L87 43.6L82.4 41Z'
    return (
      rosa(k) +
      k.sun(60, 60, 16, 47, 28, false) +
      k.shade(ellipse(60, 62, 28, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      // el almohadón de terciopelo magenta, con sus borlas
      k.floor(61, 90, 30, 3, MAG_M) +
      tassel(28.6, 77.6, 30) + tassel(91.4, 77.6, -30) +
      k.draw([{
        d: cushion, fill: MAG,
        inner:
          k.sh(cushion, 0, 0, 1, 1, 0, 0.9, MAG_D, 0.5) + `<path d="M30 73C40 69 80 69 90 73" fill="none" stroke="#fff" stroke-width=".9" opacity=".35"/>` +
          hair(36, 80, 46, 76, 54, 74, 0.5, MAG_D) + hair(84, 80, 74, 76, 66, 74, 0.5, MAG_D) + hair(40, 86, 50, 84, 58, 84.6, 0.45, MAG_D) +
          `<path d="M28.6 78C34 86 86 86 91.4 78" fill="none" stroke="${P.gold}" stroke-width=".8"/><path d="M28.6 78C34 86 86 86 91.4 78" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-dasharray=".01 1.5" stroke-linecap="round" transform="translate(0 1)"/>` +
          `<path d="M34 75L40 79L46 75L52 79L58 75L64 79L70 75L76 79L82 75M34 79L40 75M46 79L52 75M58 79L64 75M70 79L76 75M82 79L86 76" fill="none" stroke="${MAG_D}" stroke-width=".35" opacity=".6"/>` +
          flor(38, 82.4) + flor(82, 82.4),
      }], 0.8) +
      k.floor(60, 69.4, 22, 2.4, MAG_D) +
      // el bigote engominado
      `<g transform="translate(60 62) scale(1.5)">` +
      k.draw([
        { d: tip(1), fill: P.night }, { d: tip(-1), fill: P.night },
        { d: wing(1), fill: P.night, inner: k.sh('M-17 -6H0V8H-17Z', 0, 0, 0, 1, 0, 0.6, '#000000', 0.3) },
        { d: wing(-1), fill: P.night, inner: k.sh('M0 -6H17V8H0Z', 0, 0, 1, 1, 0, 0.85, '#000000', 0.35) },
      ], 0.5) +
      curlEnd(1) + curlEnd(-1) + strands(1) + strands(-1) +
      `<path d="M-8 -2.2C-5.6 -3 -3 -2.8 -1.4 -2" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".85"/>` +
      `<path d="M-19.4 -3.4C-19.8 -4.6 -19.6 -5.8 -19 -6.6" fill="none" stroke="#fff" stroke-width=".45" stroke-linecap="round" opacity=".8"/>` +
      `</g>` +
      // el peine de carey para atusarlo
      `<g transform="translate(70 86.4) rotate(-8)">` + teeth + k.draw([{ d: comb, fill: P.gold, inner: k.sh(comb, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M-6.6 -1H6.6" stroke="${P.goldL}" stroke-width=".4"/>` }], 0.4) + `</g>` +
      // la cinta con el lema
      k.draw([{ d: tailL, fill: MAG_M, inner: k.sh(tailL, 0, 0, 1, 0, 0, 0.8, MAG_D, 0.4) }, { d: tailR, fill: MAG_M, inner: k.sh(tailR, 0, 0, 1, 0, 0, 0.9, MAG_D, 0.45) }], 0.45) +
      k.draw([{ d: ribbon, fill: P.white, inner: k.sh(ribbon, 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) + `<path d="M37.6 36Q60 27.6 82.4 36M37.6 40Q60 31.6 82.4 40" fill="none" stroke="${MAG}" stroke-width=".35"/>` }], 0.5) +
      `<path id="${rid}" d="M39 39.2Q60 31.2 81 39.2" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">ordre et méthode</textPath></text>` +
      sparkle(60, 20, 3, '#fff') + sparkle(32, 54, 2) + sparkle(89, 50, 1.6) +
      k.defs()
    )
  },

  // ── Ladrón de palabras ─────────────────────────────────────────────

  // Escuchaste las pistas y sacaste la palabra: antena de televisor, la de conejo, y el papelito que cae en la señal.
  'Oreja parada': (u) => {
    const k = kit(u)
    const dome = 'M45 90C45 80.6 51.4 75.6 60 75.6C68.6 75.6 75 80.6 75 90Z'
    const foot = 'M42.4 89.4H77.6V92.8C77.6 94.2 76.4 95.2 75 95.2H45C43.6 95.2 42.4 94.2 42.4 92.8Z'
    const ear = (x0: number, y0: number, x1: number, y1: number) => {
      const seg = (a: number, b: number, w: number) => {
        const xa = x0 + (x1 - x0) * a, ya = y0 + (y1 - y0) * a, xb = x0 + (x1 - x0) * b, yb = y0 + (y1 - y0) * b
        return rod(`M${f(xa)} ${f(ya)}L${f(xb)} ${f(yb)}`, P.white, w) + `<path d="M${f(xa - 0.4)} ${f(ya)}L${f(xb - 0.4)} ${f(yb)}" stroke="${P.sky}" stroke-width="${f(w * 0.3)}"/>`
      }
      const j = (t: number, r: number) => `<circle cx="${f(x0 + (x1 - x0) * t)}" cy="${f(y0 + (y1 - y0) * t)}" r="${r}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>`
      return seg(0.66, 1, 0.9) + seg(0.34, 0.68, 1.3) + seg(0, 0.36, 1.8) + j(0.35, 1.2) + j(0.67, 0.9) +
        `<circle cx="${x1}" cy="${y1}" r="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${f(x1 - 0.5)}" cy="${f(y1 - 0.5)}" r=".5" fill="#fff"/>`
    }
    const waves = (x: number, y: number, a: number) =>
      `<g transform="translate(${x} ${y}) rotate(${a})">` + [4, 6.6, 9.2].map((r, i) => `<path d="M${f(-r * 0.7)} ${f(-r * 0.7)}A${r} ${r} 0 0 1 ${f(r * 0.7)} ${f(-r * 0.7)}" fill="none" stroke="${MAG}" stroke-width="${f(0.9 - i * 0.2)}" stroke-linecap="round" opacity="${f(1 - i * 0.22)}"/>`).join('') + `</g>`
    return (
      rosa(k) +
      escenario(k, 60, 60, 34) +
      waves(38.6, 38, -40) + waves(81.4, 38, 40) +
      k.floor(61, 95, 20, 2.6, MAG_M) +
      ear(57.6, 77.6, 38.6, 38) + ear(62.4, 77.6, 81.4, 38) +
      k.draw([
        { d: foot, fill: MAG_D, inner: k.sh(foot, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M42.4 91.4H77.6" stroke="${P.night}" stroke-width=".4"/>` },
        { d: dome, fill: MAG, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.9, MAG_D, 0.5) + `<path d="M48 88C48 82 52 78.4 57.6 77.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".6"/>` + `<path d="M45.4 86.6H74.6" stroke="${P.gold}" stroke-width=".8"/><path d="M45.4 87.6H74.6" stroke="${P.goldD}" stroke-width=".35"/>` },
      ], 0.7) +
      k.draw([{ d: ellipse(60, 77, 4, 2), fill: P.gold, inner: k.sh(ellipse(60, 77, 4, 2), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.45) +
      `<circle cx="66.6" cy="82.4" r="2.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><path d="M66.6 82.4L67.8 81.2" stroke="${P.ink}" stroke-width=".5" stroke-linecap="round"/>` +
      `<g transform="translate(60 50) rotate(-8) scale(1.2)">` + k.cast(['M-7.2 -5.6L7 -6.4L7.6 5.4L-6.8 6.2Z'], 1.4, 1.6, MAG_M) + papelito(k, 'mate', 0.4) + `</g>` +
      hair(52, 41, 55, 38.6, 58, 38.4, 0.5, MAG) + hair(68, 41, 65, 38.6, 62, 38.4, 0.5, MAG) +
      sparkle(60, 30, 2.2, '#fff') + sparkle(30, 70, 1.6) + sparkle(90, 70, 1.4) +
      k.defs()
    )
  },

  // Cuatro palabras afanadas en el colectivo: el guante del pungista saca el papelito del bolsillo de atrás, con dos dedos.
  'Pungista de pistas': (u) => {
    const k = kit(u)
    const jeans = 'M14 53H106V130H14Z'
    const belt = 'M14 47.4H106V54.6H14Z'
    const loop = (x: number) => `M${f(x - 2.4)} 45.4H${f(x + 2.4)}V58.4H${f(x - 2.4)}Z`
    const pocket = 'M39.6 61.4H80.4V83.6L60 92.6L39.6 83.6Z'
    const twill = Array.from({ length: 22 }, (_, i) => { const x = 4 + i * 5.4; return `<path d="M${x} 54L${f(x + 14)} 106" stroke="${MAG_D}" stroke-width=".45" opacity=".6"/>` }).join('')
    const twillP = Array.from({ length: 12 }, (_, i) => { const x = 30 + i * 4.4; return `<path d="M${x} 60L${f(x + 10)} 94" stroke="${MAG}" stroke-width=".4" opacity=".7"/>` }).join('')
    const glove =
      'M-7.8 -32C-8.2 -27 -9 -22 -9.6 -18.6C-11.4 -16.6 -11.8 -12.6 -10 -10.8C-9 -9.8 -7.8 -9.8 -7 -10.4' +
      'C-7 -5 -6.8 1 -6.4 4.6C-6.2 6.2 -5 7 -4 6.8C-2.8 6.6 -2.2 5.6 -2.2 4.2L-2 -4.6' +
      'C-1.4 0 -.8 5 -.2 8.2C0 9.6 1.2 10.4 2.2 10.2C3.4 10 3.8 8.8 3.6 7.4C3.2 2 3.2 -3.6 3.4 -8.4' +
      'C5 -8 6.8 -8.8 7.4 -10.6C8.8 -11.2 9.6 -13.2 9 -15C9.4 -20 8.8 -26 8 -32Z'
    const cuff = 'M-9 -39.6H9.2L8.4 -31.4H-8.2Z'
    const stitch = (d: string) => `<path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".55" stroke-dasharray="1.3 .8"/>`
    return (
      rosa(k) +
      // el pantalón de jean: la pretina con sus presillas y la tela cruzada
      k.draw([{ d: jeans, fill: MAG, inner: twill + k.sh(jeans, 0, 0, 1, 1, 0, 0.8, MAG_D, 0.45) }], 0.6) +
      k.draw([{ d: belt, fill: MAG_M, inner: k.sh(belt, 0, 0, 0, 1, 0, 0.6, MAG_D, 0.35) + stitch('M14 49H106') + stitch('M14 53H106') }], 0.6) +
      k.draw([{ d: loop(36), fill: MAG_M, inner: k.sh(loop(36), 0, 0, 1, 0, 0, 0.8, MAG_D, 0.4) + stitch('M34.4 47V57') }, { d: loop(88), fill: MAG_M, inner: k.sh(loop(88), 0, 0, 1, 0, 0, 0.8, MAG_D, 0.4) + stitch('M86.4 47V57') }], 0.5) +
      // el papelito asomando y el bolsillo de atrás
      `<g transform="translate(60 56.6) rotate(-10) scale(1.15)">` + papelito(k, 'mate', 0.4) + `</g>` +
      k.cast([pocket], 1.6, 1.8, MAG_D) +
      k.draw([{
        d: pocket, fill: MAG_M,
        inner:
          twillP + k.sh(pocket, 0, 0, 1, 1, 0, 0.75, MAG_D, 0.45) + k.sh('M38 61H82V65H38Z', 0, 0, 0, 1, 0.8, 0, MAG_D, 0.4) +
          `<path d="M38 61H50V94H38Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` + stitch('M41.4 63.6H78.6') + stitch('M41.6 65.2V82.4L60 90.6L78.4 82.4V65.2'),
      }], 0.7) +
      `<circle cx="41.4" cy="63" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/><circle cx="78.6" cy="63" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
      // el guante negro, de arriba a la derecha, con los dos dedos en pinza
      `<g transform="translate(72.4 45.4) rotate(42)">` +
      k.cast([glove], 1.6, 1.4, P.night) +
      k.draw([
        { d: cuff, fill: MAG, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.85, MAG_D, 0.45) + `<path d="M-8.8 -36.8H9" stroke="${MAG_D}" stroke-width=".5"/><circle cx="5.6" cy="-35" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` },
        {
          d: glove, fill: '#2B2440',
          inner:
            k.sh(glove, 0, 0, 1, 0, 0, 0.9, '#000000', 0.4) + `<path d="M-11 -33H-4V6H-11Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.55, 0)}"/>` +
            hair(-3.2, -30, -3, -23, -3.6, -16, 0.45, P.blue) + hair(0.4, -30, 0.6, -23, 0.2, -16, 0.45, P.blue) + hair(3.6, -30, 4, -24, 3.6, -17, 0.45, P.blue) +
            hair(-5.2, -8, -5, -1, -4.6, 4.6, 0.55, P.sky, 0.9) + hair(0.4, -4, 1, 2, 1.6, 8, 0.55, P.sky, 0.9) + `<path d="M-6.8 -2.2C-5.6 -1.6 -3.6 -1.6 -2.2 -2.4M-1.2 0C0 .6 2 .6 3.3 0" fill="none" stroke="#000" stroke-width=".45"/>` +
            `<path d="M-6.6 -10.4C-5.2 -12 -3 -12 -1.8 -11M3.4 -8.4C3 -10 3.6 -11.8 5.2 -12.4M7.4 -10.6C6.8 -12.4 7.4 -14 9 -15M-1.6 -5L-1.6 -9" fill="none" stroke="#000" stroke-width=".55"/>`,
        },
      ], 0.6) +
      `</g>` +
      hair(86, 30, 91, 34, 93, 40, 0.6, MAG) + hair(82, 26, 88, 28, 92, 33, 0.5, MAG_M) +
      sparkle(36, 36, 2.2) + sparkle(48, 28, 1.4) +
      k.defs()
    )
  },

  // Diez palabras adivinadas: la bola de cristal ya la tiene escrita. Al lado, el gorro de papel aluminio, por las dudas.
  'Lector de mentes': (u) => {
    const k = kit(u)
    const ball = ellipse(60, 49, 20, 20)
    const cup = 'M47 66.4C48.6 71.6 53.4 75.2 60 75.2C66.6 75.2 71.4 71.6 73 66.4C67 68.8 53 68.8 47 66.4Z'
    const stem = 'M54.4 89.4C57 86.8 57.6 83 56.8 79.6C56.2 77.6 56.6 75.8 57.6 74.6H62.4C63.4 75.8 63.8 77.6 63.2 79.6C62.4 83 63 86.8 65.6 89.4Z'
    const knop = ellipse(60, 81.4, 4.6, 2.4)
    const base = 'M41.6 91.6C41.6 89.8 49.6 88.6 60 88.6C70.4 88.6 78.4 89.8 78.4 91.6V93.4C78.4 95.2 70.4 96.4 60 96.4C49.6 96.4 41.6 95.2 41.6 93.4Z'
    const talons = [taper(49.6, 70.4, 41.2, 66.6, 42.2, 55.6, 3.6, 0.5), taper(70.4, 70.4, 78.8, 66.6, 77.8, 55.6, 3.6, 0.5), taper(60, 74.4, 61, 69.4, 59.8, 63.6, 3.4, 0.5)]
    const foil = 'M.4 -20L2.6 -13L4.8 -9.6L4.2 -5L6.6 -1.4L8.4 3.4L4 5.4L-1 4.6L-6 5.6L-8.2 2.4L-5.6 -2.4L-6.2 -6L-3.6 -10.2L-2.2 -14.4Z'
    const facets = [
      ['M.4 -20L2.6 -13L-.2 -11Z', P.white], ['M.4 -20L-.2 -11L-2.2 -14.4Z', FOIL], ['M2.6 -13L4.8 -9.6L4.2 -5L-.2 -11Z', P.sky1], ['M-2.2 -14.4L-.2 -11L-3.6 -10.2Z', P.sky2],
      ['M-3.6 -10.2L-.2 -11L4.2 -5L-1.6 -3.4L-6.2 -6Z', P.white], ['M4.2 -5L6.6 -1.4L8.4 3.4L4 5.4L1.2 .4Z', P.sky2], ['M-1.6 -3.4L4.2 -5L1.2 .4Z', FOIL],
      ['M-6.2 -6L-1.6 -3.4L1.2 .4L-1 4.6L-6 5.6L-8.2 2.4L-5.6 -2.4Z', P.sky1], ['M1.2 .4L4 5.4L-1 4.6Z', P.blue],
    ]
    const brim = 'M-9 1.6C-4 3.8 4 3.8 9.2 1.8L8.8 5.6C4 7.2 -4 7.6 -8.8 5.4Z'
    const stars = [[28, 30, 0.6], [92, 32, 0.5], [26, 58, 0.45], [95, 62, 0.55], [36, 22, 0.4], [84, 20, 0.45]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${MAG_D}"/>` + k.shade(FULL, k.rad(MAG, 0.5, 0.42, 0.6, 0.95, 0), MAG, 0.45) +
      k.sun(60, 49, 21, 48, 28, false) +
      stars +
      k.shade(ellipse(60, 49, 30, 30), k.rad(MAG_L, 0.5, 0.5, 0.5, 0.75, 0), MAG_L, 0.5) +
      k.floor(60, 94.6, 24, 3, P.night) +
      // el pie dorado de tres garras
      k.draw([
        { d: base, fill: P.gold, inner: k.sh(base, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M40.8 91.4C44 93.2 52 94.2 60 94.2C68 94.2 76 93.2 79.2 91.4" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` + Array.from({ length: 11 }, (_, i) => `<circle cx="${f(43 + i * 3.4)}" cy="${f(92.8 + Math.sin((i / 10) * Math.PI) * 1.2)}" r=".4" fill="${P.goldL}"/>`).join('') },
        { d: stem, fill: P.gold, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + hair(57.6, 76, 57, 82, 56.4, 88, 0.45, P.goldL) + `<path d="M56 87.4H64M57 77H63" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: knop, fill: P.gold, inner: k.sh(knop, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M56 80.6C58 79.8 61 79.8 62.6 80.4" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` },
      ], 0.7) +
      `<circle cx="60" cy="81.4" r="1.3" fill="${MAG}" stroke="${P.ink}" stroke-width=".35"/><circle cx="59.6" cy="81" r=".4" fill="#fff"/>` +
      // la bola: vidrio con niebla, la palabra adentro y el reflejo
      k.draw([{
        d: ball, fill: P.sky1,
        inner:
          `<path d="${ball}" fill="${k.rad(MAG_L, 0.42, 0.44, 0.6, 0.9, 0)}"/>` + k.sh(ball, 0, 0, 1, 1, 0, 0.85, P.blue, 0.45) +
          hair(42, 60, 50, 53, 60, 57, 1, MAG_M, 0.55) + hair(56, 43, 66, 38.6, 76, 45, 0.9, MAG_M, 0.5) + hair(46, 47, 50, 42, 56, 42, 0.6, MAG_M, 0.5) +
          hair(44, 56, 52, 50, 60, 54, 0.8, '#fff', 0.85) + hair(56, 46, 66, 42, 74, 48, 0.7, '#fff', 0.75) + hair(48, 62, 58, 60, 70, 63, 0.6, '#fff', 0.6) + hair(50, 40, 56, 37, 62, 39, 0.5, '#fff', 0.6) +
          `<text x="60" y="53" ${GEORGIA} font-style="italic" font-size="7" fill="${MAG_D}" text-anchor="middle" opacity=".9">mate</text>` +
          `<path d="${starPath(48, 46, 1.6, 0.3, 4)}" fill="#fff"/><path d="${starPath(71, 56, 1.3, 0.25, 4)}" fill="#fff"/><path d="${starPath(66, 40, 1, 0.2, 4)}" fill="#fff"/>` +
          `<path d="M45 42C46.6 35.6 52 31 58.4 30.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>` +
          `<path d="M70.6 63.4C73.6 61.4 76 58 76.6 54.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".6"/>`,
      }], 0.8) +
      k.draw([{ d: cup, fill: P.gold, inner: k.sh(cup, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + Array.from({ length: 7 }, (_, i) => `<path d="M${f(49.4 + i * 3.5)} ${f(68.4 + Math.sin((i / 6) * Math.PI) * 1.4)}l.9 2.2" stroke="${P.goldD}" stroke-width=".4"/>`).join('') }], 0.55) +
      // las tres garras que sostienen la bola
      k.draw(talons.map((d) => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) })), 0.5) +
      hair(47.6, 67.4, 45.4, 64.6, 45.6, 61, 0.4, P.goldL) + hair(72.4, 67.4, 74.6, 64.6, 74.4, 61, 0.4, P.goldD) + hair(59.4, 72, 59.6, 69, 59.4, 66, 0.4, P.goldL) +
      `<path d="M44.4 65.6L46.4 64.8M75.6 65.6L73.6 64.8M58.8 68.6H61.2" stroke="${P.goldD}" stroke-width=".45" stroke-linecap="round"/>` +
      k.draw([{ d: ellipse(60, 71.4, 1.8, 1.4), fill: MAG, inner: `<circle cx="59.4" cy="70.9" r=".45" fill="#fff"/>` }], 0.35) +
      // el gorro de aluminio, arrugado
      `<g transform="translate(32.4 77.6) rotate(-20)">` +
      k.draw([
        { d: foil, fill: FOIL, inner: facets.map(([d, c]) => `<path d="${d}" fill="${c}" stroke="${P.blue}" stroke-width=".3"/>`).join('') + k.sh(foil, 0, 0, 1, 1, 0, 0.6, P.mid, 0.3) },
        { d: brim, fill: FOIL, inner: `<path d="M-6 2.6L-5 6.4M-1.6 3.4L-1 7M2.6 3.4L2 7.2M6.4 2.6L6.6 6.4" stroke="${P.blue}" stroke-width=".35"/>` + k.sh(brim, 0, 0, 1, 0, 0, 0.7, P.mid, 0.35) + `<path d="M-8 3.4C-4 5 2 5.2 6 4" fill="none" stroke="#fff" stroke-width=".5" opacity=".9"/>` },
      ], 0.55) +
      `<path d="M-8.2 5.2C-6.6 11.6 5.4 12.6 8.4 5.6" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><path d="M-8.2 5.2C-6.6 11.6 5.4 12.6 8.4 5.6" fill="none" stroke="${MAG_L}" stroke-width=".4" stroke-linecap="round"/>` +
      `<path d="${starPath(-1.6, -9.6, 2.2, 0.3, 4)}" fill="#fff"/>` +
      `</g>` +
      sparkle(84, 74, 2) + sparkle(60, 22, 2.6, P.goldL) +
      k.defs()
    )
  },

  // ── Chivo expiatorio ───────────────────────────────────────────────

  // Dos veces te votaron sin ser: es la cara, viste. El cartel de la foto de frente, contra la regla de alturas.
  'Sospechoso de siempre': (u) => {
    const k = kit(u)
    const board = roundRect(35.4, 60.4, 84.6, 82, 1.6)
    const marks = Array.from({ length: 16 }, (_, i) => {
      const y = 26 + i * 4, big = i % 2 === 0
      return `<path d="M${big ? 18 : 30} ${y}H${big ? 102 : 90}" stroke="${MAG_M}" stroke-width="${big ? 0.6 : 0.35}" opacity="${big ? 0.9 : 0.7}"/>`
    }).join('')
    const labels = ['1,70', '1,60', '1,50', '1,40'].map((t, i) => `<text x="29.6" y="${f(41.2 + i * 8)}" ${GEORGIA} font-size="3.2" fill="${MAG_D}" text-anchor="middle">${t}</text>`).join('')
    // Mano que sostiene el cartel desde abajo: puño de camisa, muñeca, cuatro dedos sobre el frente y el pulgar por el costado.
    const hand = (x: number, s: number) => {
      const X = (v: number) => f(x + s * v)
      const cuff = `M${X(-7.4)} 104L${X(-6.4)} 90.4H${X(6.4)}L${X(7.6)} 104Z`
      const wrist = `M${X(-5.6)} 91C${X(-6)} 87.4 ${X(-5.6)} 84 ${X(-4.8)} 81.6H${X(5.4)}C${X(6)} 84 ${X(6)} 87.4 ${X(5.6)} 91Z`
      const thumb = `M${X(-5)} 86C${X(-7.4)} 84.4 ${X(-8.4)} 80.6 ${X(-8)} 77.4C${X(-7.8)} 75.8 ${X(-6.2)} 75.4 ${X(-5.6)} 76.8L${X(-4.4)} 82Z`
      const fingers = [[-3.4, 76.4], [-0.9, 75], [1.6, 75.4], [4.1, 76.8]].map(([dx, top]) => {
        const cx = x + s * dx
        return `M${f(cx - 1.2)} 83.6V${f(top + 1.2)}C${f(cx - 1.2)} ${f(top - 0.2)} ${f(cx + 1.2)} ${f(top - 0.2)} ${f(cx + 1.2)} ${f(top + 1.2)}V83.6Z`
      })
      const sk = (d: string) => k.sh(d, 0, 0, 1, 0, 0, 0.75, P.brown, 0.4)
      return (
        k.draw([
          { d: cuff, fill: P.white, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + `<path d="M${X(-6.6)} 93.4H${X(6.6)}" stroke="${P.blue}" stroke-width=".5"/><circle cx="${X(3.4)}" cy="96.6" r=".7" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>` },
          { d: wrist, fill: P.skin, inner: sk(wrist) + hair(x - 2, 88, x, 86.6, x + 2.4, 88.4, 0.4, P.brown) },
          { d: thumb, fill: P.skin, inner: sk(thumb) },
          ...fingers.map((d) => ({ d, fill: P.skin, inner: sk(d) })),
        ], 0.45) +
        fingers.map((_, i) => { const dx = [-3.4, -0.9, 1.6, 4.1][i], top = [76.4, 75, 75.4, 76.8][i], cx = x + s * dx; return `<path d="M${f(cx - 0.7)} ${f(top + 1.1)}C${f(cx - 0.4)} ${f(top + 0.4)} ${f(cx + 0.4)} ${f(top + 0.4)} ${f(cx + 0.7)} ${f(top + 1.1)}" fill="none" stroke="${P.brown}" stroke-width=".35"/><path d="M${f(cx - 0.9)} 80.4H${f(cx + 0.9)}" stroke="${P.brown}" stroke-width=".35"/>` }).join('')
      )
    }
    return (
      rosa(k) +
      `<path d="M14 20H106V104H14Z" fill="#FBEAF0" opacity=".6"/>` + marks + labels +
      k.cast([board], 2.6, 2.4, MAG_M) +
      k.draw([{
        d: board, fill: P.night,
        inner:
          `<path d="${board}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.55, 0)}"/>` + k.sh(board, 0, 0, 1, 1, 0, 0.6, '#000000', 0.3) +
          `<path d="${roundRect(37.4, 62.4, 82.6, 80, 0.8)}" fill="none" stroke="${P.paper}" stroke-width=".5"/>` +
          hair(40, 74, 50, 73, 58, 75, 0.4, P.mid) + hair(64, 66, 72, 65.4, 80, 66.6, 0.35, P.mid),
      }], 0.75) +
      `<text x="60" y="67.6" ${GEORGIA} font-size="3.6" letter-spacing=".6" fill="${P.paper}" text-anchor="middle">SOSPECHOSO</text>` +
      `<text x="60" y="77.6" ${GEORGIA} font-weight="700" font-size="8.4" fill="${P.paper}" text-anchor="middle">Nº 3</text>` +
      hand(44, 1) + hand(76, -1) +
      `<path d="${starPath(78, 40, 4.6, 0.8, 4)}" fill="#fff" stroke="${MAG_M}" stroke-width=".3"/>` +
      sparkle(86, 50, 1.8, '#fff') + sparkle(44, 36, 1.4, '#fff') +
      k.defs()
    )
  },

  // Seis expulsiones injustas: ni hablás y ya te miran feo. El antifaz de ladrón, bajo la lámpara del interrogatorio.
  'Cara de culpable': (u) => {
    const k = kit(u)
    const shade = 'M53.4 22.6H66.6L68 27.2C74.4 29.2 78.4 33.4 79.4 37.6H40.6C41.6 33.4 45.6 29.2 52 27.2Z'
    const cone = 'M42 37.6H78L102 100H18Z'
    const domino = 'M0 -3.4C3 -6 9 -7.6 14.6 -6.8C18 -6.2 19.4 -3 18.6 .6C17.8 4.6 14.4 7.4 10.2 7.2C6.4 7 3.6 4.8 1.6 3.4C.8 2.8 -.8 2.8 -1.6 3.4C-3.6 4.8 -6.4 7 -10.2 7.2C-14.4 7.4 -17.8 4.6 -18.6 .6C-19.4 -3 -18 -6.2 -14.6 -6.8C-9 -7.6 -3 -6 0 -3.4Z'
    const eyeL = 'M-14.4 -.4C-12.6 -3.2 -7.6 -3.4 -5.4 -.8C-7.4 1.8 -12.4 2 -14.4 -.4Z'
    const eyeR = 'M14.4 -.4C12.6 -3.2 7.6 -3.4 5.4 -.8C7.4 1.8 12.4 2 14.4 -.4Z'
    return (
      `<rect width="120" height="130" fill="#2A1430"/>` + k.shade(FULL, k.rad(MAG_D, 0.5, 0.7, 0.6, 0.9, 0), MAG_D, 0.5) +
      // el cono de luz y la mancha en la mesa
      k.shade(cone, k.lin(P.goldL, 0, 0, 0, 1, 0.75, 0.15), P.goldL, 0.45) +
      `<path d="M14 84Q60 78 106 84V130H14Z" fill="#3B1C3E"/>` +
      k.shade(ellipse(60, 86, 34, 9), k.rad(P.goldL, 0.5, 0.5, 0.5, 1, 0), P.goldL, 0.55) +
      // la lámpara colgada
      rod('M60 0V23', P.night, 1) +
      k.draw([{ d: shade, fill: MAG, inner: k.sh(shade, 0, 0, 1, 0, 0, 0.9, MAG_D, 0.5) + `<path d="M44 34C46 30.6 49.6 28.6 53.4 27.8" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".6"/><path d="M53.6 24.6H66.4" stroke="${MAG_D}" stroke-width=".5"/>` }], 0.6) +
      `<path d="M40.6 37.6H79.4" stroke="${P.white}" stroke-width="1"/>` +
      `<ellipse cx="60" cy="38.4" rx="6" ry="2.6" fill="#fff"/>` + k.shade(ellipse(60, 38.6, 12, 6), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.9, 0), '#ffffff', 0.6) +
      // el antifaz sobre la mesa
      k.floor(61, 82, 26, 3.4, '#000') +
      `<g transform="translate(60 76) scale(1.34 1.1)">` +
      `<path d="M-18.4 .6C-22 1 -25.6 3.6 -27 7.4M-18.4 1.4C-21 3.4 -22.6 6.8 -22.4 9.4" fill="none" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/>` +
      `<path d="M18.4 .6C22 1 25.6 3.6 27 7.4M18.4 1.4C21 3.4 22.6 6.8 22.4 9.4" fill="none" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/>` +
      k.draw([{
        d: domino, fill: '#211A2E',
        inner:
          `<path d="M-20 -8H20V-1C10 -4 -10 -4 -20 -1Z" fill="${k.lin(P.blue, 0, 0, 0, 1, 0.55, 0)}"/>` + k.sh(domino, 0, 0, 1, 1, 0, 0.6, '#000000', 0.3) +
          `<path d="M-14.6 -5.8C-9 -6.6 -3.4 -5 0 -2.4C3.4 -5 9 -6.6 14.6 -5.8" fill="none" stroke="${MAG_M}" stroke-width=".5"/>` +
          hair(-16, 3, -12, 5.6, -7, 5.4, 0.4, P.mid) + hair(16, 3, 12, 5.6, 7, 5.4, 0.4, P.mid),
      }], 0.5) +
      `<path d="${eyeL}" fill="#3B1C3E"/><path d="${eyeR}" fill="#3B1C3E"/><path d="${eyeL} ${eyeR}" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M-12.4 -4.4C-9 -5.2 -5.4 -4.6 -3.2 -3" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".75"/>` +
      `</g>` +
      // las gotas de la culpa, en el aire
      [[38, 58, -20], [82, 60, 20], [44, 50, -10]].map(([x, y, r]) => `<path d="M0 -2.6C1 -1 1.6 0 1.6 .8C1.6 1.8 .8 2.4 0 2.4C-.8 2.4 -1.6 1.8 -1.6 .8C-1.6 0 -1 -1 0 -2.6Z" transform="translate(${x} ${y}) rotate(${r})" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      sparkle(60, 46, 2.4, '#fff') +
      k.defs()
    )
  },

  // Quince condenas siendo inocente: pedí la revisión del caso. La bola del preso, y Alcatraz al atardecer.
  'Preso de Alcatraz': (u) => {
    const k = kit(u)
    const ball = ellipse(70, 80, 13.4, 13.4)
    const island = 'M22 66.6C26 62.6 31 61 36 60.6L38.6 58.4H52L54.6 60.6C60 61.2 64 63.4 66.4 66.6Z'
    const block = 'M37.6 58.6V53.4H51.6V58.6Z'
    const tower = 'M44 53.6L44.8 42.6H47.4L48.2 53.6Z'
    const lamp = 'M44.2 42.6H48V40H44.2Z'
    const sea = 'M0 66.6H120V130H0Z'
    const rock = 'M14 96C22 90 34 88.6 46 89.6C56 90.4 66 92.6 80 92C92 91.4 100 92 106 94V110H14Z'
    const links = Array.from({ length: 6 }, (_, i) => {
      const t = (i + 0.5) / 6, x = 58 - t * 12.6, y = 72 + Math.sin(t * Math.PI) * 4 + t * 9, a = i % 2 ? -30 : 60
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${a})"><path d="${ellipse(0, 0, 3.2, 1.9)} ${ellipse(0, 0, 1.7, 0.65)}" fill-rule="evenodd" fill="${IRON}" stroke="${P.ink}" stroke-width=".5"/><path d="M-2.2 -1.1C-1 -1.8 1 -1.8 2.2 -1.1" fill="none" stroke="${P.sky}" stroke-width=".4"/></g>`
    }).join('')
    const shackle = `${ellipse(39.4, 84.6, 7, 4)} ${ellipse(39.4, 84.4, 5, 2.4)}`
    return (
      `<rect width="120" height="130" fill="${MAG_L}"/>` + k.shade(FULL, k.lin(MAG, 0, 0, 0, 1, 0.9, 0), MAG, 0.5) +
      k.sun(45, 64, 9, 44, 26, false) +
      k.shade(ellipse(45, 62, 16, 12), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.6) +
      `<path d="${sea}" fill="${MAG_D}"/>` + k.shade(sea, k.lin(P.night, 0, 0, 0, 1, 0.1, 0.9), P.night, 0.5) +
      hair(30, 70, 44, 69, 58, 70.4, 0.6, P.goldL) + hair(36, 74, 46, 73.2, 54, 74, 0.5, P.goldL, 0.8) + hair(40, 77.6, 46, 77, 51, 77.6, 0.5, P.goldL, 0.75) +
      hair(42, 81, 46, 80.6, 49.6, 81, 0.45, P.gold, 0.7) + hair(43, 84.4, 46, 84, 48.4, 84.4, 0.4, P.gold, 0.6) + hair(62, 74, 68, 73.6, 74, 74.2, 0.4, MAG_M) + hair(80, 78, 86, 77.6, 92, 78, 0.4, MAG_M) + hair(70, 70, 80, 69.6, 92, 70.4, 0.5, MAG_M) + hair(20, 76, 26, 75.4, 32, 76, 0.4, MAG_M) +
      // Alcatraz: la roca, el penal y el faro
      k.shade('M45 41.4L14 26V40Z', k.lin(P.goldL, 1, 0, 0, 0, 0.95, 0), P.goldL, 0.5) + k.shade('M47.4 41.4L104 30V44Z', k.lin(P.goldL, 0, 0, 1, 0, 0.9, 0), P.goldL, 0.5) +
      k.draw([
        { d: tower, fill: P.night, inner: `<path d="M44 53.6L44.8 42.6H45.8L45.4 53.6Z" fill="${MAG_M}" opacity=".6"/>` },
        { d: lamp, fill: P.goldL },
        { d: 'M54.6 60.6V55.4H57V53H61.6V55.4L62 60.6Z', fill: P.night, inner: `<path d="M57.6 54.4H61" stroke="${MAG_M}" stroke-width=".4"/>` },
        { d: block, fill: P.night, inner: Array.from({ length: 6 }, (_, i) => `<path d="M${f(39 + i * 2.2)} 54.4V55.8M${f(39 + i * 2.2)} 56.8V58" stroke="${P.goldL}" stroke-width=".6" opacity=".85"/>`).join('') + `<path d="M37.6 53.4H51.6" stroke="${MAG_M}" stroke-width=".5"/>` },
        { d: island, fill: P.night, inner: k.sh(island, 0, 0, 0, 1, 0, 0.6, '#000000', 0.3) + hair(26, 64.4, 31, 62.4, 36, 62, 0.45, MAG_M) + hair(54, 61, 59, 62, 63, 64.4, 0.4, MAG_M) },
      ], 0.45) +
      `<path d="M43.6 40H48.6L46.1 37.8Z" fill="${P.night}"/>` +
      // la orilla de piedra
      k.draw([{ d: rock, fill: IRON, inner: k.sh(rock, 0, 0, 0, 1, 0, 0.9, IRON_D, 0.5) + hair(20, 93.6, 32, 91, 44, 91.4, 0.6, P.sky, 0.7) + hair(74, 93.6, 86, 93, 98, 94.4, 0.5, P.sky, 0.6) }], 0.6) +
      // la bola y la cadena con el grillete
      `<path d="${shackle}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.6 .7)"/>` +
      `<path d="${shackle}" fill-rule="evenodd" fill="${IRON}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="M33 83.6C34.6 81.6 37.2 80.6 40.2 80.6" fill="none" stroke="${P.sky}" stroke-width=".6" stroke-linecap="round"/>` +
      `<rect x="44" y="82.6" width="3.4" height="3" rx=".6" fill="${IRON_D}" stroke="${P.ink}" stroke-width=".45"/><circle cx="45.7" cy="84.1" r=".55" fill="${P.goldL}"/>` +
      links +
      k.floor(71, 93, 14, 2.4, '#000') +
      k.draw([{
        d: ball, fill: IRON,
        inner:
          k.sh(ball, 0, 0, 1, 1, 0, 0.95, IRON_D, 0.55) + `<path d="${ball}" fill="${k.rad(P.sky, 0.32, 0.3, 0.45, 0.75, 0)}"/>` +
          [[64, 74, 0.6], [74, 72, 0.5], [68, 84, 0.55], [78, 82, 0.6], [62, 82, 0.45], [74, 88, 0.5], [80, 76, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${IRON_D}" opacity=".8"/>`).join('') +
          `<path d="M57.4 82.6C59 86.4 62 89.6 66 91.4" fill="none" stroke="${MAG_M}" stroke-width=".8" stroke-linecap="round" opacity=".7"/>` +
          `<path d="M57 77.6C61 76 66 75.4 71 75.8C75 76.2 79.6 77.6 83.4 79.6" fill="none" stroke="${IRON_D}" stroke-width="1.2" opacity=".6"/>`,
      }], 0.8) +
      `<path d="M61.4 73.6C63 70.4 66 68.4 69.4 68" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>` +
      `<g transform="translate(72.4 84.4) rotate(-8)">` + k.draw([{ d: roundRect(-5.4, -3.4, 5.4, 3.4, 0.8), fill: P.goldL, inner: k.sh(roundRect(-5.4, -3.4, 5.4, 3.4, 0.8), 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) }], 0.4) +
      `<text x="0" y="1.8" ${GEORGIA} font-weight="700" font-size="4.6" fill="${IRON_D}" text-anchor="middle">15</text>` +
      `<circle cx="-4.4" cy="-2.4" r=".45" fill="${P.goldD}"/><circle cx="4.4" cy="-2.4" r=".45" fill="${P.goldD}"/><circle cx="-4.4" cy="2.4" r=".45" fill="${P.goldD}"/><circle cx="4.4" cy="2.4" r=".45" fill="${P.goldD}"/>` + `</g>` +
      `<path d="${ellipse(60.2, 69.8, 2.6, 2.6)} ${ellipse(60.2, 69.8, 1.2, 1.2)}" fill-rule="evenodd" fill="${IRON}" stroke="${P.ink}" stroke-width=".5"/>` +
      sparkle(86, 32, 2.2, '#fff') + sparkle(28, 44, 1.6, P.goldL) +
      k.defs()
    )
  },
}
