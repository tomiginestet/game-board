// Básquet 3x3 de plaza, en clave heroica: la pelota naranja, el medio aro con su red de cadena, el cordón y las
// baldosas de la vereda, el farol de la plaza y la zapatilla de bota del streetball. Piezas en ./_basquet-piezas.ts.
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { backboard, bball, GEORGIA, hoopNet, rimBack, rimFront, swoosh } from './_basquet-piezas'

/** Baldosa vainilla de la vereda y el gris del cordón y del asfalto. */
const VAINILLA = '#EAD9B2', VAINILLA_D = '#C7AE7E'
const ASFALTO = '#5B6178', ASFALTO_D = '#353A52'
/** Sombra cálida de la corona sobre la pelota. */
const NAR_SHADOW = '#8E4A22'

/** Eslabones de cadena a lo largo de una curva cuadrática. */
function chain(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, n: number, c = P.sky2) {
  return along(x0, y0, cx, cy, x1, y1, Array.from({ length: n }, (_, i) => i / (n - 1))).map((p, i) => {
    const a = (Math.atan2(p.dy, p.dx) * 180) / Math.PI, ry = i % 2 ? 0.55 : 1.5
    const d = ellipse(0, 0, 2.3, ry)
    return `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(a)})"><path d="${d}" fill="none" stroke="${P.ink}" stroke-width="1.7"/><path d="${d}" fill="none" stroke="${c}" stroke-width=".8"/>` +
      (i % 2 ? '' : `<path d="M-1.6 -1A2.3 1.5 0 0 1 1.2 -1.3" fill="none" stroke="#fff" stroke-width=".35"/>`) + `</g>`
  }).join('')
}

/** Zapatilla de bota de perfil con la punta a la derecha y la suela en y=8 (de -26 a 28 de ancho). */
const UPPER = 'M-23 1V-25Q-23 -29.4 -18.6 -29.4H-9.4Q-6 -29.4 -6 -26V-19Q-1 -14 7 -10.6Q17 -6.6 22.4 -3.4Q25.4 -1.6 24.4 1Z'
const SOLE = 'M-25 1H25Q28 1 28 4.4Q28 8 24 8H-23Q-26 8 -26 4.6Q-26 1 -25 1Z'
function sneaker(k: Kit, gold = false) {
  const toe = 'M9 -9.6Q18 -6 24.4 1H7.6Q6.2 -4.6 9 -9.6Z'
  const heel = 'M-24 -15H-15Q-12.6 -7 -14.6 2H-24Z'
  const tongue = 'M-9.4 -28.6L-7 -33.4Q-4 -35 -2.4 -32L-4.6 -22Z'
  const laces = Array.from({ length: 5 }, (_, i) => {
    const t = i / 4, x = -6.4 + t * 12.6, y = -25 + t * 13
    return `<path d="M${f(x - 1.8)} ${f(y - 1.6)}L${f(x + 1.8)} ${f(y + 1.6)}M${f(x + 1.8)} ${f(y - 1.6)}L${f(x - 1.8)} ${f(y + 1.6)}" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M${f(x - 1.8)} ${f(y - 1.6)}L${f(x + 1.8)} ${f(y + 1.6)}M${f(x + 1.8)} ${f(y - 1.6)}L${f(x - 1.8)} ${f(y + 1.6)}" stroke="${P.white}" stroke-width=".6" stroke-linecap="round"/>`
  }).join('')
  return (
    k.draw([
      { d: tongue, fill: P.white, inner: k.sh(tongue, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
      {
        d: UPPER, fill: P.white,
        inner:
          k.sh(UPPER, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M-24 -30H-14V2H-24Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.8, 0)}"/>` +
          `<path d="${toe}" fill="${P.sky1}"/>` + `<path d="${toe}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
          `<path d="M7.8 -7.4Q16 -4.6 21.4 -.6" fill="none" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".8 .6"/>` +
          `<path d="${heel}" fill="${P.red}"/>` + k.sh(heel, 0, 0, 1, 0, 0, 0.7, P.wine, 0.4) + `<path d="${heel}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
          `<path d="M-23 -26.4H-6" stroke="${P.red}" stroke-width="2.4"/><path d="M-23 -26.4H-6" stroke="${P.ink}" stroke-width=".3" transform="translate(0 1.3)"/>` +
          // La raya del costado, que se afina hacia la punta.
          `<path d="M-14 -5.4C-6 -4 2 -6.6 10 -12.6C4 -4.4 -4 -1 -14 -1.8Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
          `<path d="M-6 -24.4L7 -11.4" stroke="${P.sky2}" stroke-width="3.6"/>` +
          [-18.6, -14.6, -10.6].map((x) => `<circle cx="${x}" cy="-23.6" r=".55" fill="${P.ink}"/>`).join('') +
          hair(-20, -12, -19, -6, -20, 0, 0.4, P.blue),
      },
      {
        d: SOLE, fill: P.white,
        inner: k.sh(SOLE, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M-26 5H28" stroke="${gold ? P.gold : P.red}" stroke-width=".9"/>` +
          Array.from({ length: 10 }, (_, i) => `<path d="M${-21 + i * 4.6} 6.4V8" stroke="${P.blue}" stroke-width=".5"/>`).join(''),
      },
    ], 0.75) +
    laces +
    // El parche del tobillo con la estrella.
    `<circle cx="-15.4" cy="-17.4" r="3.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/><path d="${starPath(-15.4, -17.4, 2.5, 1, 5)}" fill="${gold ? P.gold : P.mid}" stroke="${P.ink}" stroke-width=".25"/>` +
    // Ojalillos dorados y la punta de los cordones.
    (gold ? [0, 0.25, 0.5, 0.75, 1].map((t) => `<circle cx="${f(-7.8 + t * 12.6)}" cy="${f(-23.4 + t * 13)}" r=".5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".2"/>`).join('') : '') +
    `<path d="M-5 -26Q-9 -32 -12.6 -30" fill="none" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M-5 -26Q-9 -32 -12.6 -30" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` +
    `<path d="M-12.6 -30L-14.4 -29.4" stroke="${gold ? P.gold : P.sky2}" stroke-width="1" stroke-linecap="round"/>`
  )
}

export const BASQUET3X3_ART: Record<string, (u: number) => string> = {
  // ── Medio aro ──────────────────────────────────────────────────────

  // Cinco ganados: la pelota encadenada con candado. De la cancha no te saca nadie.
  'Ganador se queda': (u) => {
    const k = kit(u)
    const C = [57, 54], R = 18.6
    const shackle = 'M52.8 73V68.4A4.8 4.8 0 0 1 62.4 68.4V73'
    const lock = roundRect(50.6, 71.4, 64.6, 84.2, 2)
    const post = 'M88 30H93.4V110H88Z'
    return (
      k.day() +
      k.stage(58, 58, 35) +
      `<path d="M22 92H98" stroke="${P.white}" stroke-width="1.6"/><path d="M22 92H98" stroke="${P.blue}" stroke-width=".4" transform="translate(0 1)"/>` +
      k.draw([{ d: post, fill: P.mid, inner: k.sh(post, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M89 30V110" stroke="${P.sky}" stroke-width=".7"/>` }], 0.65) +
      k.floor(57, 88, 17, 2.4, P.mid) +
      chain(76, 60, 84, 52, 89, 56, 4) +
      bball(k, C[0], C[1], R, { rot: -12 }) +
      // La cadena da la vuelta a la pelota y va al poste.
      chain(37.6, 57, 57, 74, 76.6, 57.6, 11) +
      `<path d="${shackle}" fill="none" stroke="${P.ink}" stroke-width="2.8" stroke-linecap="round"/><path d="${shackle}" fill="none" stroke="${P.sky2}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([{
        d: lock, fill: P.gold,
        inner: k.sh(lock, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M50 71H55V85H50Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          `<path d="M51.4 74H63.8" stroke="${P.goldD}" stroke-width=".4"/>`,
      }], 0.65) +
      `<path d="M57.6 76.4A1.6 1.6 0 1 1 57.61 76.4ZM57 77.6L56.6 81H58.6L58.2 77.6Z" fill="${P.ink}"/>` +
      sparkle(31, 40, 2.2) + sparkle(82, 82, 1.5) +
      k.defs()
    )
  },

  // Veinte victorias: la corona encima de la pelota y el farol de la plaza, que ya te vio ganar de noche.
  'Rey de la plaza': (u) => {
    const k = kit(u)
    const crown = 'M-11 4.6H11L12.6 -8.6L6 -2.4L0 -11.6L-6 -2.4L-12.6 -8.6Z'
    const band = roundRect(-11, 1, 11, 5.6, 1)
    const pole = 'M87.2 44H89.2V96H87.2Z', base = 'M84.6 96H91.8L90.4 90H86Z'
    const glass = 'M84 34.6H92.4L91 44.4H85.4Z', roof = 'M82.6 34.8L88.2 29.4L93.8 34.8Z'
    return (
      k.day() +
      k.sun(56, 60, 19, 47, 32, false) +
      k.shade(ellipse(88.2, 39, 9, 9), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.45) +
      k.draw([
        { d: pole, fill: P.night, inner: `<path d="M87.8 44V96" stroke="${P.mid}" stroke-width=".5"/>` },
        { d: base, fill: P.night },
        { d: glass, fill: P.goldL, inner: k.sh(glass, 0, 0, 1, 0, 0, 0.6, P.gold, 0.4) + `<path d="M88.2 34.6V44.4" stroke="${P.night}" stroke-width=".6"/><circle cx="88.2" cy="40" r="1.6" fill="#fff"/>` },
        { d: roof, fill: P.night, inner: `<path d="M84 34L88.2 30.2" stroke="${P.mid}" stroke-width=".5"/>` },
        { d: 'M84.8 44.4H91.6V45.8H84.8Z', fill: P.night },
      ], 0.5) +
      `<circle cx="88.2" cy="28.6" r=".9" fill="${P.night}"/>` +
      k.floor(56, 87, 18, 2.6, P.mid) +
      bball(k, 56, 68, 17, { rot: -20 }) +
      `<g transform="translate(55 49.6) rotate(-9)">` +
      k.cast([crown], 1.4, 1.6, NAR_SHADOW) +
      k.draw([{
        d: crown, fill: P.gold,
        inner: k.sh(crown, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-13 -12H-3V6H-13Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          `<path d="${band}" fill="${P.goldD}" opacity=".45"/><path d="M-11 1H11" stroke="${P.ink}" stroke-width=".4"/>`,
      }], 0.6) +
      [[-6.6, 3.3, P.red], [0, 3.3, P.sky], [6.6, 3.3, P.red]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="${c}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      [[-12.6, -8.6], [0, -11.6], [12.6, -8.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `</g>` +
      sparkle(34, 40, 2) + sparkle(30, 72, 1.4) +
      k.defs()
    )
  },

  // Sesenta ganados: la zapatilla de bota, en el aire, con la cámara grabando para el video.
  'Streetball de Harlem': (u) => {
    const k = kit(u)
    const cam = roundRect(-7.4, -4.6, 5, 4.6, 1.4), lens = 'M5 -3.2L10.6 -5.4V5.4L5 3.2Z', vf = roundRect(-6.4, -8, -1.6, -4.6, 0.6)
    return (
      k.night() +
      // El reflector que la ilumina desde arriba.
      k.shade('M46 14H74L94 104H26Z', k.lin(P.sky1, 0, 0, 0, 1, 0.4, 0.05), P.sky1, 0.25) +
      k.shade(ellipse(60, 92, 26, 5), k.rad(P.sky1, 0.5, 0.5, 0.5, 0.7, 0), P.sky1, 0.4) +
      [[30, 28], [92, 34], [26, 60], [94, 66]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.floor(62, 92, 20, 2.4, '#0B1130') +
      `<g transform="translate(56 71) rotate(-10) scale(.95)">` + k.cast([UPPER, SOLE], 2.2, 2.2, '#0B1130') + sneaker(k, true) + `</g>` +
      hair(26, 70, 30, 72, 34, 72, 0.8, P.sky1) + hair(27, 76, 31, 77, 34, 77, 0.6, P.sky1) +
      k.floor(80, 91, 7, 1.2, '#0B1130') + bball(k, 79, 84, 7, { rot: 30 }) +
      // La cámara que graba (REC).
      `<g transform="translate(80.6 37.6) rotate(-8)"><g transform="scale(-1 1)">` +
      k.draw([
        { d: vf, fill: P.mid },
        { d: cam, fill: P.mid, inner: k.sh(cam, 0, 0, 1, 1, 0, 0.8, P.night, 0.45) + `<path d="M-7 -4H-1V5H-7Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` },
        { d: lens, fill: P.sky2, inner: k.sh(lens, 0, 0, 1, 0, 0, 0.7, P.mid, 0.4) },
      ], 0.5) +
      `<circle cx="-4.6" cy="-1.6" r="1.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>` +
      `</g><text x="-4.4" y="-.6" ${GEORGIA} font-size="2.4" font-weight="700" fill="${P.white}">REC</text><g transform="scale(-1 1)">` +
      `<ellipse cx="10.8" cy="0" rx="1" ry="5.2" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g></g>` +
      sparkle(32, 44, 2.4, P.goldL) + sparkle(86, 58, 1.5, P.goldL) + sparkle(46, 26, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Tiro de afuera ─────────────────────────────────────────────────

  // Treinta puntos: la pelota en el cordón de la vereda, entre las baldosas, y el aro allá lejos.
  'Tiro de vereda': (u) => {
    const k = kit(u)
    const walk = 'M-10 70H130V84H-10Z', curb = 'M-10 84H130V90H-10Z', street = 'M-10 90H130V140H-10Z'
    let tiles = ''
    for (let x = -4; x < 124; x += 8.4) {
      tiles += `<path d="M${f(x)} 70V84" stroke="${VAINILLA_D}" stroke-width=".5"/>`
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) tiles += `<rect x="${f(x + 1.4 + i * 2.2)}" y="${f(72 + j * 3 + (j ? 3.4 : 0))}" width="1.4" height="1.4" rx=".5" fill="${VAINILLA_D}" opacity=".7"/>`
    }
    tiles += `<path d="M-10 77H130" stroke="${VAINILLA_D}" stroke-width=".5"/>`
    return (
      k.day() +
      k.sun(74, 40, 9, 30, 24, false) +
      // El aro, a lo lejos.
      k.draw([{ d: 'M73.2 42H74.8V70H73.2Z', fill: P.mid }], 0.4) +
      backboard(k, 67.4, 31, 80.6, 40.6, { r: 0.6 }) +
      rimBack(74, 42.4, 3.8) + rimFront(74, 42.4, 3.8) +
      `<path d="M71 43.6L72 48H76L77 43.6M72.2 46L75.8 46" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M52 50Q60 22 72 40" fill="none" stroke="${P.mid}" stroke-width=".7" stroke-dasharray="1.4 1.2"/>` +
      k.draw([
        { d: walk, fill: VAINILLA, inner: k.sh(walk, 0, 0, 0, 1, 0, 0.5, VAINILLA_D, 0.3) + tiles },
        { d: curb, fill: P.sky1, inner: k.sh(curb, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M-10 84.6H130" stroke="#fff" stroke-width=".6"/>` },
        { d: street, fill: ASFALTO, inner: k.sh(street, 0, 0, 0, 1, 0, 0.6, ASFALTO_D, 0.45) + `<path d="M30 97H44M64 97H78" stroke="${P.goldL}" stroke-width="1.2"/>` },
      ], 0.6) +
      k.floor(48, 84, 13, 2, VAINILLA_D) +
      bball(k, 48, 69.4, 14.4, { rot: 16 }) +
      hair(68, 68, 70, 64, 74, 62, 0.5, P.mid) + hair(70, 74, 73, 70, 77, 69, 0.45, P.mid) +
      // Una hojita que se cuela entre las baldosas.
      `<path d="M84 79C85.4 76.6 88.6 76.4 90 78C88.6 79.8 85.6 80.4 84 79Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(30, 44, 2.2) + sparkle(90, 58, 1.4) +
      k.defs()
    )
  },

  // Ciento cincuenta: el aro pelado. La red no está, pero vos ya la ves (punteada) moverse cuando entra.
  'Aro sin red': (u) => {
    const k = kit(u)
    const C = [60, 58], RX = 21
    const net = hoopNet(C[0], C[1], RX, 22, { dash: true, flare: 0.25 })
    return (
      k.day() +
      k.stage(60, 60, 36) +
      backboard(k, 38, 28, 82, 56) +
      k.draw([{ d: 'M55.6 54H64.4V58H55.6Z', fill: P.mid }], 0.5) +
      net.back +
      rimBack(C[0], C[1], RX) +
      swoosh(60, 63, -90, 11, P.mid) +
      bball(k, 60, 63, 11, { rot: -6 }) +
      rimFront(C[0], C[1], RX) +
      net.front +
      // Los ganchos vacíos del aro.
      [-0.9, -0.62, -0.3, 0, 0.3, 0.62, 0.9].map((t) => {
        const x = C[0] + RX * t, y = C[1] + RX * 0.28 * Math.sqrt(1 - t * t)
        return `<path d="M${f(x)} ${f(y + 0.6)}V${f(y + 2.2)}Q${f(x)} ${f(y + 3.2)} ${f(x - 0.9)} ${f(y + 3)}" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linecap="round"/>`
      }).join('') +
      `<text x="81" y="82" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle" transform="rotate(-8 81 82)">¡chas!</text>` +
      sparkle(31, 66, 2) + sparkle(38, 84, 1.4) +
      k.defs()
    )
  },

  // Quinientos: tu nombre grafiteado en el tablero de la plaza, con la red de cadena y el aerosol.
  'Leyenda del potrero de cemento': (u) => {
    const k = kit(u)
    const net = hoopNet(60, 74, 12.4, 16, { color: P.sky2 })
    const can = roundRect(-4.2, -9, 4.2, 9, 1.8), capD = roundRect(-2.6, -12.6, 2.6, -8.6, 1)
    const drip = (x: number, y: number, l: number) => `<path d="M${f(x - 0.6)} ${y}V${f(y + l)}A.7 .7 0 0 0 ${f(x + 0.8)} ${f(y + l)}V${y}Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>`
    return (
      k.day() +
      k.sun(60, 58, 20, 50, 32) +
      // Un ladrillo de pared, detrás del tablero.
      k.cast([roundRect(32, 36, 88, 71, 1.4)], 2.2, 2.2, P.goldD) +
      backboard(k, 32, 36, 88, 71, {
        square: P.sky,
        inner:
          // La corona dibujada con aerosol y las estrellitas.
          `<path d="M38 46L39.4 40.4L42.6 43.6L45 39L47.2 43.6L50.4 40.4L51.6 46Z" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linejoin="round"/>` +
          `<path d="${starPath(80.4, 42.4, 2.8, 1.1, 5)}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/>` +
          `<path d="${starPath(84.4, 48.4, 1.6, 0.6, 5)}" fill="${P.gold}"/>`,
      }) +
      `<text x="61" y="59.8" ${GEORGIA} font-style="italic" font-weight="700" font-size="13.4" fill="${P.ink}" text-anchor="middle" stroke="${P.ink}" stroke-width="2.6" stroke-linejoin="round" transform="rotate(-6 60 56)">Leyenda</text>` +
      `<text x="60" y="58.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="13.4" fill="${P.red}" text-anchor="middle" stroke="${P.gold}" stroke-width=".5" transform="rotate(-6 60 56)">Leyenda</text>` +
      drip(45.6, 61.4, 3.6) + drip(57.4, 60.4, 5.2) + drip(70.8, 58.6, 3) +
      `<path d="M39 64.6Q60 59 83 61" fill="none" stroke="${P.sky}" stroke-width="1.1" stroke-linecap="round" transform="rotate(-2 60 62)"/>` +
      k.draw([{ d: 'M56 69.6H64V74H56Z', fill: P.mid }], 0.5) +
      net.back +
      rimBack(60, 74, 12.4) +
      rimFront(60, 74, 12.4) +
      net.front +
      // El aerosol, todavía tirando.
      `<g transform="translate(84.6 84) rotate(24)">` +
      k.draw([
        { d: capD, fill: P.white, inner: k.sh(capD, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
        { d: can, fill: P.red, inner: k.sh(can, 0, 0, 1, 0, 0, 0.85, P.wine, 0.45) + `<path d="M-4.2 -9H-1.6V9H-4.2Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/><path d="M-4.2 -3H4.2V3H-4.2Z" fill="${P.gold}"/><path d="M-4.2 -3H4.2M-4.2 3H4.2" stroke="${P.ink}" stroke-width=".35"/>` },
      ], 0.5) +
      `</g>` +
      [[80.4, 70.6, 0.7], [78.6, 68.4, 0.5], [82.6, 69, 0.45], [77.6, 71.6, 0.4], [80, 66.6, 0.35]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.red}"/>`).join('') +
      bball(k, 36, 85, 7.4, { rot: -20 }) +
      sparkle(32, 30, 1.6, P.white) + sparkle(87, 30, 1.4, P.white) +
      k.defs()
    )
  },
}
