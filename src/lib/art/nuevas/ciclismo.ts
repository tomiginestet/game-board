// Ciclismo, en clave heroica. Los objetos del ciclista: la bici de barrio con las rueditas que ya sobran, la llave
// inglesa, el maillot a lunares del rey de la montaña y el maillot amarillo de la gran vuelta con sus banderitas.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Montaña de piedra, nieve y verde del pasto. */
const ROCK = '#8E9CC0', ROCK_D = '#5C6A96'
const GRASS = '#7E9C4E', GRASS_D = '#56722F'

// ── La bici: de perfil, el eje trasero en (-17,0) y el delantero en (17,0) ───────────────────────────────

const R = 11

/** Rueda: cubierta de tinta, llanta celeste, rayos y maza. */
function wheel(cx: number, cy: number, r: number, rim = P.sky1) {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + 0.2
    return `M${f(cx + Math.cos(a) * 1.2)} ${f(cy + Math.sin(a) * 1.2)}L${f(cx + Math.cos(a + 0.35) * (r - 2))} ${f(cy + Math.sin(a + 0.35) * (r - 2))}`
  }).join('')
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${P.ink}" stroke-width="3.6"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${P.night}" stroke-width="2.2"/>` +
    `<path d="M${f(cx - r * 0.7)} ${f(cy - r * 0.7)}A${r} ${r} 0 0 1 ${f(cx + r * 0.2)} ${f(cy - r)}" fill="none" stroke="${P.mid}" stroke-width=".7" stroke-linecap="round"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${f(r - 1.7)}" fill="none" stroke="${P.ink}" stroke-width="1.2"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${f(r - 1.7)}" fill="none" stroke="${rim}" stroke-width=".6"/>` +
    `<path d="${spokes}" stroke="${P.ink}" stroke-width=".35"/>` +
    `<circle cx="${cx}" cy="${cy}" r="1.5" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>`
  )
}

/** Tubo entintado de (x0,y0) a (x1,y1). */
const tube = (d: string, c: string, w = 2) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Bici de barrio: cuadro de color con su luz, asiento, manubrio con puños, plato y pedal. */
function bike(k: Kit, o: { frame?: string; frameL?: string; ribbons?: boolean } = {}) {
  const fr = o.frame ?? P.red, frL = o.frameL ?? '#E9857C'
  const frame = 'M-17 0L-2 1.4L-7.4 -15.4M-17 0L-7.4 -15.4L12 -15.4M-2 1.4L13 -12.6'
  const fork = 'M12.6 -17.4L13.6 -12.6L17 0'
  const saddle = 'M-13.8 -19.6C-11 -21 -6.4 -21.2 -3.4 -20.2C-2.4 -19.8 -2.6 -18.4 -3.8 -18.2C-7 -17.8 -10.4 -17.8 -13 -18.2C-14.2 -18.4 -14.6 -19.2 -13.8 -19.6Z'
  const bars = 'M12.4 -18.4L11 -22.2C10.6 -23.2 11.2 -24 12.2 -24H16.2'
  const ring = ellipse(-2, 1.4, 4.2, 4.2)
  const crank = 'M-2 1.4L1.6 6.2'
  return (
    `<path d="M-17 0L-2 1.4" stroke="${P.ink}" stroke-width="1" stroke-dasharray=".9 .5"/>` +
    wheel(-17, 0, R) + wheel(17, 0, R) +
    tube('M-7.4 -15.4L-8.4 -18.6', P.white, 1.3) +
    tube(frame, fr, 2.2) +
    `<path d="M-15.6 -1.6L-8 -14.2M-6.2 -14.6L10.6 -14.6M-.8 -.2L11.6 -11.8" fill="none" stroke="${frL}" stroke-width=".55" stroke-linecap="round"/>` +
    tube(fork, P.white, 1.6) + tube(bars, P.white, 1.3) +
    k.draw([{ d: roundRect(14.6, -25.4, 19.4, -22.6, 1.3), fill: P.night }], 0.4) +
    k.draw([{ d: ring, fill: P.white, inner: `<path d="${ellipse(-2, 1.4, 2.6, 2.6)}" fill="none" stroke="${P.blue}" stroke-width=".5"/>` + k.sh(ring, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) }], 0.5) +
    tube(crank, P.white, 1.2) + k.draw([{ d: roundRect(-.4, 5.4, 4, 7.2, 0.6), fill: P.night }], 0.35) +
    k.draw([{ d: saddle, fill: P.night, inner: `<path d="M-12.6 -19.8C-9.4 -20.6 -6 -20.6 -3.6 -19.8" fill="none" stroke="${P.mid}" stroke-width=".5"/>` }], 0.45) +
    (o.ribbons
      ? `<path d="M18.4 -23C21 -21 21.6 -18 24 -17.4M18.6 -23.6C22 -23 23.4 -20.6 26 -21" fill="none" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><path d="M18.4 -23C21 -21 21.6 -18 24 -17.4" fill="none" stroke="${P.sky}" stroke-width=".55" stroke-linecap="round"/><path d="M18.6 -23.6C22 -23 23.4 -20.6 26 -21" fill="none" stroke="${P.white}" stroke-width=".55" stroke-linecap="round"/>`
      : '') +
    `<circle cx="-2" cy="1.4" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`
  )
}

/** Ruedita de entrenamiento suelta: la rueda chica con su fleje doblado en L. */
function trainer(k: Kit, x: number, y: number, rot: number) {
  const bracket = 'M0 0L0 -9.4L7.6 -10.4'
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    tube(bracket, P.white, 1.5) +
    `<circle cx="7.6" cy="-10.4" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
    k.draw([{ d: ellipse(0, 0, 4.6, 4.6), fill: P.night, inner: `<circle cx="0" cy="0" r="2.8" fill="${P.white}"/><circle cx="0" cy="0" r="2.8" fill="none" stroke="${P.blue}" stroke-width=".4"/><circle cx="0" cy="0" r="1" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` }], 0.55) +
    `</g>`
  )
}

/** Llave inglesa de boca regulable, con el mango hacia +x. */
function wrench(k: Kit, x: number, y: number, rot: number) {
  const d = 'M-6 -3.8C-8.8 -3.8 -10.4 -2 -10.4 0C-10.4 2 -8.8 3.8 -6 3.8L-5 1.8H-7.6V-1.8H-5ZM-5.4 -2.6L-3 -1.6H12.4C13.6 -1.6 14.2 -.8 14.2 0C14.2 .8 13.6 1.6 12.4 1.6H-3L-5.4 2.6Z'
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + `<path d="M0 -.4H11" stroke="#fff" stroke-width=".5"/><circle cx="11.6" cy="0" r=".7" fill="none" stroke="${P.blue}" stroke-width=".4"/>` }], 0.5) +
    `</g>`
  )
}

// ── El maillot: de frente, centrado en (0,0) ─────────────────────────────────────────────────────────────

const JERSEY = 'M-6.4 -22C-3.6 -19.6 3.6 -19.6 6.4 -22L15.4 -19C18 -18 20 -16.4 21.6 -14L26 -6.6L18.4 -2.4L14.8 -7.4C14.4 2 14.6 12 15.4 21.6' +
  'C5 24 -5 24 -15.4 21.6C-14.6 12 -14.4 2 -14.8 -7.4L-18.4 -2.4L-26 -6.6L-21.6 -14C-20 -16.4 -18 -18 -15.4 -19Z'

/** Maillot de manga corta con cuello, cierre y costuras. `pattern` va recortado a la tela. */
function jersey(k: Kit, o: { fill: string; dark: string; pattern?: string; collar?: string; trim?: string; extra?: string }) {
  const collar = 'M-6.4 -22C-3.6 -19.6 3.6 -19.6 6.4 -22L7.4 -20.4C4 -17.4 -4 -17.4 -7.4 -20.4Z'
  return (
    k.draw([{
      d: JERSEY, fill: o.fill,
      inner:
        (o.pattern ?? '') +
        `<path d="M-26 -6.6L-18.4 -2.4L-17.6 -3.8L-25.2 -8ZM26 -6.6L18.4 -2.4L17.6 -3.8L25.2 -8Z" fill="${o.trim ?? P.mid}"/>` +
        `<path d="M-16 18.6C-5 21 5 21 16 18.6V24H-16Z" fill="${o.trim ?? P.mid}"/>` +
        k.sh('M2 -24H28V26H2Z', 0, 0, 1, 0, 0, 0.75, o.dark, 0.45) + k.sh('M-28 10H28V26H-28Z', 0, 0, 0, 1, 0, 0.6, o.dark, 0.35) +
        `<path d="M-28 -24H-6V26H-28Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
        `<path d="M-14.8 -7.4C-15.4 -11 -15.8 -15 -15.4 -19M14.8 -7.4C15.4 -11 15.8 -15 15.4 -19" fill="none" stroke="${o.dark}" stroke-width=".5"/>` +
        hair(-10, -4, -12, 6, -11, 16, 0.7, o.dark, 0.7) + hair(9, 2, 11, 10, 10, 18, 0.6, o.dark, 0.7) +
        `<path d="M.4 -19.4V20.8" stroke="${P.ink}" stroke-width=".9"/><path d="M.4 -19.4V20.8" stroke="${P.white}" stroke-width=".4" stroke-dasharray=".5 .5"/>` +
        hair(-19, -15, -14, -18.6, -8, -19.6, 0.7, '#fff', 0.8) + (o.extra ?? ''),
    }], 0.75) +
    k.draw([{ d: collar, fill: o.collar ?? P.white }], 0.45) +
    `<path d="M-.6 -18.4H1.4V-15.4H-.6Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`
  )
}

export const CICLISMO_ART: Record<string, (u: number) => string> = {
  // ── Maillot amarillo ──────────────────────────────────────────────

  // Tres ganadas: la bici de barrio, ya sin rueditas; las dos quedaron tiradas en el piso con la llave inglesa.
  'Rueditas sacadas': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.stage(60, 56, 34) +
      `<path d="M24 74H96" stroke="${P.blue}" stroke-width=".6" stroke-dasharray="1.6 1.2"/>` +
      k.floor(60, 73.6, 30, 2.4, P.mid) +
      `<g transform="translate(60 60.4) scale(1.16)">` + bike(k, { ribbons: true }) + `</g>` +
      k.floor(60, 89, 22, 2, P.mid) +
      trainer(k, 45.4, 86.4, -90) + trainer(k, 74.6, 86.4, 90) +
      wrench(k, 60.4, 84.6, -14) +
      hair(29, 54, 26, 58, 27, 63, 0.7, P.mid, 0.8) + hair(33, 50, 30, 55, 31, 60, 0.6, P.mid, 0.7) +
      sparkle(87, 40, 2) + sparkle(33, 40, 1.5) +
      k.defs()
    )
  },

  // Diez ganadas: el maillot a lunares del rey de la montaña, flameando arriba de los picos; las subidas, de chiste.
  'Rey de la montaña': (u) => {
    const k = kit(u)
    const back = 'M10 100L30 70L38 76L60 46L74 64L84 58L110 100Z'
    const snow = 'M53.4 55.2L60 46L66.4 54.4L63 53.6L60.4 57L57.6 53.8ZM27 75.4L30 70L33.6 73.2L31.2 73.2L30 75Z'
    const front = 'M10 100L26 86L38 90L50 80L62 88L76 82L92 90L110 100Z'
    const road = 'M60.4 57C58 62 63 64 60 68C57 72 52 72 55 77C58 82 64 81 62 88'
    const dots = Array.from({ length: 30 }, (_, i) => {
      const x = -24 + (i % 6) * 9 + (Math.floor(i / 6) % 2) * 4.5, y = -20 + Math.floor(i / 6) * 9
      return `<circle cx="${f(x)}" cy="${f(y)}" r="2.8" fill="${P.red}"/><circle cx="${f(x - 0.8)}" cy="${f(y - 0.8)}" r=".9" fill="#E9857C"/>`
    }).join('')
    const hanger = 'M-12 -20.6L-1.2 -25.4M12 -20.6L1.2 -25.4M0 -25.6V-28C0 -30 2.6 -30 2.6 -28.4'
    return (
      k.day() +
      `<circle cx="60" cy="58" r="34" fill="${P.sky1}"/>` +
      k.sun(84, 44, 6.4, 20, 24, false) +
      `<circle cx="84" cy="44" r="6.4" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".6"/>` +
      k.clip(ellipse(60, 58, 42, 42),
        k.draw([{ d: back, fill: ROCK, inner: k.sh(back, 0, 0, 1, 1, 0, 0.8, ROCK_D, 0.45) + `<path d="M60 46L74 64L66 62L60 52Z" fill="${ROCK_D}" opacity=".4"/><path d="${snow}" fill="${P.white}"/>` }], 0.65) +
        `<path d="${road}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="${road}" fill="none" stroke="${P.paper}" stroke-width="1.3" stroke-linecap="round"/>` +
        k.draw([{ d: front, fill: GRASS, inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, GRASS_D, 0.45) }], 0.6)) +
      tube('M60 47V22', P.white, 1.1) + `<circle cx="60" cy="21.6" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<g transform="translate(60 52) rotate(4) scale(.66)">` + `<g transform="translate(-2.6 0)">` + tube(hanger, P.goldL, 1.4) + `</g>` + k.cast([JERSEY], 2.4, 2.4) +
      jersey(k, { fill: P.white, dark: P.blue, trim: P.red, pattern: dots }) + `</g>` +
      hair(28, 62, 33, 60, 38, 62, 0.7, P.mid) + hair(27, 67, 33, 66, 38, 68, 0.6, P.mid) +
      `<text x="36" y="44" ${GEORGIA} font-style="italic" font-weight="700" font-size="6.4" fill="${P.ink}" text-anchor="middle" transform="rotate(-12 36 44)">¡ja!</text>` +
      sparkle(84, 64, 1.6, P.white) + sparkle(42, 30, 1.6) +
      k.defs()
    )
  },

  // Treinta ganadas: el maillot amarillo de la gran vuelta del barrio, bajo el sol de Mayo y con las banderitas
  // colgadas de esquina a esquina.
  'Gran vuelta del barrio': (u) => {
    const k = kit(u)
    const string = (y0: number, sag: number) => `M22 ${y0}Q60 ${y0 + sag} 98 ${y0}`
    const flags = (y0: number, sag: number, n: number, off: number) => Array.from({ length: n }, (_, i) => {
      const t = (i + off) / n, x = 22 + 76 * t, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + sag) + t * t * y0
      const c = [P.sky, P.white, P.gold, P.white][i % 4]
      return `<path d="M${f(x - 2.6)} ${f(y)}L${f(x + 2.6)} ${f(y)}L${f(x)} ${f(y + 5.2)}Z" fill="${c}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>`
    }).join('')
    const filigree =
      `<path d="M-10 -6C-6 -10 -2 -6 -5 -3C-7 -1 -9 -3 -7.6 -4.4M10.8 -6C6.8 -10 2.8 -6 5.8 -3C7.8 -1 9.8 -3 8.4 -4.4" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round"/>` +
      `<path d="M-11 8C-6 4 -2 10 .4 6C2.8 10 6.8 4 11.8 8" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round"/>` +
      `<path d="${starPath(-8.6, -12, 3, 1.3, 5)}" fill="${P.white}" stroke="${P.goldD}" stroke-width=".4"/>`
    return (
      k.day() +
      k.sun(60, 58, 16, 48) +
      k.shade(ellipse(60, 58, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(48, 100, 28, 92, 26, 62, 8) + laurel(72, 100, 92, 92, 94, 62, 8, true) +
      `<path d="${string(38, 8)}" fill="none" stroke="${P.ink}" stroke-width=".55"/>` + flags(38, 8, 9, 0.5) +
      k.floor(60, 89, 22, 2.4, P.mid) +
      `<g transform="translate(60 68) scale(.86)">` + k.cast([JERSEY], 2.4, 2.4, P.goldD) +
      jersey(k, { fill: P.gold, dark: P.goldD, trim: P.ink, collar: P.goldL, pattern: filigree, extra: `<path d="M-22 -10L-20 -12.6M22 -10L20 -12.6" stroke="${P.goldL}" stroke-width=".5"/>` }) + `</g>` +
      sparkle(86, 46, 2.4, '#fff') + sparkle(34, 50, 1.8, '#fff') + sparkle(70, 52, 1.4, '#fff') +
      k.defs()
    )
  },
}
