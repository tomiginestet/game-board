// Minigolf: las medallas redibujadas con el kit (../kit.ts). Los objetos del minigolf: la pelotita con hoyuelos,
// el putter de alquiler, el hoyo con su banderita, la alfombra verde y los obstáculos de la costa (el molino, el
// payaso, el castillito). A Tiger Woods no se lo dibuja: aparece por su remera roja del domingo y sus rayas.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { banner, GEORGIA, glow, golfBall, scrolls, speed, sphere, tinted } from './_bolas-piezas'

/** Alfombra verde de la cancha. */
const FELT = '#6E9B45', FELT_D = '#4A6E2C', FELT_L = '#9DBE6E'
/** Naranja de la pelotita de la cábala y la de las rayas del tigre. */
const NAR = '#EC9846', NAR_D = '#B0612A'
/** Acero del palo. */
const ACERO = '#C9D2E2'

const mintDay = (k: Kit) => tinted(k, '#C4E4D6', '#8FC6AE', 0.5)

/** Alfombra de la cancha: una franja verde con el borde de madera, de y0 para abajo. */
function felt(k: Kit, y0: number, curve = 3) {
  const d = `M10 ${y0}Q60 ${y0 - curve} 110 ${y0}V130H10Z`
  return k.draw([{ d, fill: FELT, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, FELT_D, 0.4) + `<path d="M10 ${f(y0 + 1.6)}Q60 ${f(y0 - curve + 1.6)} 110 ${f(y0 + 1.6)}" fill="none" stroke="${FELT_L}" stroke-width=".7"/>` }], 0.6)
}

/** Hoyo visto en perspectiva, con el borde blanco de la copa. */
const cup = (k: Kit, cx: number, cy: number, rx: number) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx + 0.8)}" ry="${f(rx * 0.36 + 0.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".6"/>` +
  `<ellipse cx="${cx}" cy="${f(cy + 0.3)}" rx="${rx}" ry="${f(rx * 0.34)}" fill="${P.night}"/>` +
  k.clip(ellipse(cx, cy + 0.3, rx, rx * 0.34), `<ellipse cx="${cx}" cy="${f(cy + rx * 0.3)}" rx="${rx}" ry="${f(rx * 0.3)}" fill="${P.mid}" opacity=".6"/>`)

/** Putter parado con la cara en (0,0), el mango arriba en y=−46. `grip` pinta el puño; `tape` le pone cinta. */
function putter(k: Kit, o: { grip?: string; gripD?: string; head?: string; tape?: boolean; bent?: boolean } = {}) {
  const grip = o.grip ?? P.night, gripD = o.gripD ?? '#0F1736', head = o.head ?? ACERO
  const shaft = o.bent ? 'M-.8 -32H.8L1.6 -16L.8 -1H-.8L0 -16Z' : 'M-.8 -32H.8L.8 -1H-.8Z'
  const g = roundRect(-2, -47, 2, -30.6, 1.3)
  const h = 'M-3 -1.4H11.4C12.6 -1.4 13.4 -.6 13.4 .6V3C13.4 4 12.6 4.8 11.4 4.8H-3C-4.2 4.8 -4.8 4 -4.8 3V.4C-4.8 -.6 -4.2 -1.4 -3 -1.4Z'
  const neck = 'M-1 -3H1.2L2.4 -1.2H-.8Z'
  return (
    k.draw([
      { d: shaft, fill: head, inner: `<path d="M0 -34V2" stroke="#fff" stroke-width=".4" opacity=".9"/>` },
      { d: neck, fill: head },
      { d: h, fill: head, inner: k.sh(h, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="M-3.6 -.4H12" stroke="#fff" stroke-width=".6"/><path d="M3 0V3.6" stroke="${P.ink}" stroke-width=".45"/>` },
      {
        d: g, fill: grip,
        inner: k.sh(g, 0, 0, 1, 0, 0, 0.8, gripD, 0.4) + Array.from({ length: 6 }, (_, i) => `<path d="M-2 ${f(-45 + i * 2.4)}L2 ${f(-44 + i * 2.4)}" stroke="${gripD}" stroke-width=".4"/>`).join('') +
          (o.tape ? `<path d="M-2.4 -40.4L2.4 -39.2V-36L-2.4 -37.2Z" fill="${P.paper}"/><path d="M-2.4 -40.4L2.4 -39.2M-2.4 -37.2L2.4 -36" stroke="${P.goldD}" stroke-width=".3"/><path d="M-2.4 -35L2.4 -33.8V-32.4L-2.4 -33.6Z" fill="${P.paper}" opacity=".9"/>` : '') +
          `<path d="M-1.2 -46V-31.6" stroke="#fff" stroke-width=".45" opacity=".55"/>`,
      },
    ], 0.55)
  )
}

/** Banderita del hoyo: el palito desde (x,y0) hasta (x,y1) y el banderín al viento. */
function flag(k: Kit, x: number, y0: number, y1: number, fill: string, dark: string, text = '') {
  const pole = `M${f(x - 0.7)} ${y1}H${f(x + 0.7)}V${y0}H${f(x - 0.7)}Z`
  const pen = `M${f(x + 0.6)} ${f(y1 + 0.6)}C${f(x + 6)} ${f(y1 - 0.6)} ${f(x + 10)} ${f(y1 + 2.4)} ${f(x + 16)} ${f(y1 + 1.4)}L${f(x + 13.6)} ${f(y1 + 6)}L${f(x + 16.4)} ${f(y1 + 10.6)}C${f(x + 10)} ${f(y1 + 11.6)} ${f(x + 6)} ${f(y1 + 8.6)} ${f(x + 0.6)} ${f(y1 + 10)}Z`
  return (
    k.draw([{ d: pen, fill, inner: k.sh(pen, 0, 0, 1, 1, 0, 0.7, dark, 0.4) + hair(x + 2, y1 + 2.4, x + 7, y1 + 1.6, x + 12, y1 + 3.4, 0.6, '#fff', 0.6) }], 0.5) +
    (text ? `<text x="${f(x + 7.4)}" y="${f(y1 + 7.6)}" ${GEORGIA} font-weight="700" font-size="5" fill="${P.white}" text-anchor="middle">${text}</text>` : '') +
    k.draw([{ d: pole, fill: P.white, inner: `<path d="M${f(x + 0.1)} ${y1}V${y0}" stroke="${P.sky}" stroke-width=".5"/>` }], 0.45) +
    `<circle cx="${x}" cy="${f(y1 - 0.4)}" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
  )
}

/** Hilera de rayitas de tigre sobre una pelota (en coordenadas de la pelota de radio r, centrada en 0,0). */
const tigerStripes = (r: number) => [[-160, 0.5, 18], [-120, 0.55, -14], [-75, 0.45, 16], [-30, 0.5, -16], [20, 0.55, 14], [65, 0.45, -16], [110, 0.55, 14], [155, 0.45, -14]]
  .map(([deg, len, bend]) => {
    const a = (deg * Math.PI) / 180, b = a + (bend * Math.PI) / 180
    const x0 = Math.cos(a) * r * 1.02, y0 = Math.sin(a) * r * 1.02, x1 = Math.cos(b) * r * (1 - len), y1 = Math.sin(b) * r * (1 - len)
    const mx = Math.cos((a + b) / 2) * r * (1 - len / 2), my = Math.sin((a + b) / 2) * r * (1 - len / 2)
    return hair(x0, y0, mx, my, x1, y1, r * 0.24, P.night, 0.95)
  }).join('')

export const MINIGOLF_ART: Record<string, (u: number) => string> = {
  // ── De un golpe ───────────────────────────────────────────────────

  // Hoyo en uno por el molino: la pelotita sale por la puertita mientras giran las aspas, y alguien lo está
  // grabando (el punto rojo de «rec»).
  'Por el molino': (u) => {
    const k = kit(u)
    const tower = 'M47.4 92L52.4 55H67.6L72.6 92Z'
    const roof = 'M49.6 56L60 44L70.4 56Z'
    const door = 'M55 92V85.6A5 5 0 0 1 65 85.6V92Z'
    const sail = (a: number) => {
      const d = 'M-2.2 -3H2.2L4.6 -24.6H-4.6Z'
      const lat = [-8, -13, -18, -23].map((y) => `M${f(-4.4 * (-y / 24.6))} ${y}H${f(4.4 * (-y / 24.6))}`).join('') + 'M0 -3V-24.6'
      return `<g transform="translate(60 53) rotate(${a}) scale(.85)">` + k.draw([{ d, fill: P.white, inner: `<path d="${lat}" stroke="${P.blue}" stroke-width=".5"/>` + k.sh(d, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) }], 0.5) + `</g>`
    }
    return (
      k.day() +
      felt(k, 88) +
      k.cast([tower], 2.2, 1.4) +
      k.draw([
        {
          d: tower, fill: P.red,
          inner: k.sh(tower, 0, 0, 1, 0, 0, 0.8, P.wine, 0.45) + `<path d="M46 60H74M46 68H74M46 76H74" stroke="${P.wine}" stroke-width=".45" opacity=".7"/>` +
            `<path d="M52 52H56L51.4 92H47Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
            `<path d="${roundRect(57.4, 59, 62.6, 65, 2.6)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><path d="M60 59V65M57.4 62H62.6" stroke="${P.ink}" stroke-width=".4"/>`,
        },
        { d: roof, fill: P.mid, inner: k.sh(roof, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M51.6 53.6L60 45" stroke="${P.sky}" stroke-width=".5"/>` },
        { d: door, fill: P.night },
      ], 0.7) +
      sail(-30) + sail(60) + sail(150) + sail(240) +
      `<circle cx="60" cy="53" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><circle cx="59.4" cy="52.4" r=".7" fill="#fff"/>` +
      hair(84, 40, 88, 48, 86, 58, 0.7, P.mid, 0.7) + hair(36, 60, 32, 52, 34, 42, 0.7, P.mid, 0.7) +
      speed(64, 94.6, 0, 2, 7, 2.4, FELT_D, 0.7) +
      golfBall(k, 68, 94.6, 4.4) +
      `<circle cx="29.6" cy="72.6" r="1.5" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><text x="32" y="74.3" ${GEORGIA} font-weight="700" font-size="4.4" fill="${P.ink}">rec</text>` +
      k.defs()
    )
  },

  // Cinco hoyos en uno por la boca del payaso: la fachada con su sombrero de rayas y su nariz roja, y la pelotita
  // entrando justo por el medio de la sonrisa (sin ojos: el payaso es el obstáculo, no una cara).
  'Payaso domado': (u) => {
    const k = kit(u)
    const block = roundRect(36, 52, 84, 92, 3)
    const mouth = 'M46 92V83C46 77 52 74.6 60 74.6C68 74.6 74 77 74 83V92Z'
    const lips = 'M43.4 92V82.6C43.4 75.4 51 72 60 72C69 72 76.6 75.4 76.6 82.6V92H74V83C74 77 68 74.6 60 74.6C52 74.6 46 77 46 83V92Z'
    const hat = 'M46 53.4L60 27L74 53.4Z'
    const stripes = 'M52.4 53.4L60 27L56.4 53.4ZM63.6 53.4L60 27L67.6 53.4Z'
    const pom = (x: number, y: number, r: number, c: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${P.ink}" stroke-width=".6"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff" opacity=".8"/>`
    return (
      k.day() +
      k.stage(60, 58, 34) +
      felt(k, 90, 2) +
      k.cast([block], 2.2, 1.6) +
      k.draw([{
        d: block, fill: P.white,
        inner: k.sh(block, 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) + `<path d="M36 52H84V57H36Z" fill="${P.sky}"/>` +
          [40, 46, 74, 80].map((x) => `<circle cx="${x}" cy="54.6" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`).join(''),
      }], 0.7) +
      `<path d="${mouth}" fill="${P.night}"/>` + k.clip(mouth, `<ellipse cx="60" cy="92" rx="12" ry="5" fill="${P.mid}" opacity=".6"/>`) +
      k.draw([{ d: lips, fill: P.red, inner: k.sh(lips, 0, 0, 1, 1, 0, 0.7, P.wine, 0.4) + hair(48, 76, 54, 73, 62, 72.6, 0.7, '#fff', 0.7) }], 0.5) +
      k.draw([{ d: hat, fill: P.sky, inner: `<path d="${stripes}" fill="${P.gold}"/>` + k.sh(hat, 0, 0, 1, 0, 0, 0.7, P.mid, 0.4) }], 0.6) +
      pom(60, 27, 3, P.red) + pom(60, 42, 1.6, P.white) +
      k.draw([{ d: ellipse(60, 64, 4.6, 4.6), fill: P.red, inner: k.sh(ellipse(60, 64, 4.6, 4.6), 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<circle cx="58.4" cy="62.4" r="1.2" fill="#fff" opacity=".85"/>` }], 0.6) +
      golfBall(k, 60, 91.4, 4.6) +
      hair(53, 97, 56, 96, 59, 97, 0.6, FELT_D) + hair(61, 97, 64, 96, 67, 97, 0.6, FELT_D) +
      sparkle(88, 38, 2) + sparkle(34, 44, 1.5) +
      k.defs()
    )
  },

  // Quince hoyos en uno: la pelotita con rayas de tigre cae en el hoyo bajo la banderita roja del domingo, con el
  // sol de la costa atrás.
  'Mini Tiger': (u) => {
    const k = kit(u)
    const green = ellipse(60, 90, 40, 11)
    return (
      mintDay(k) +
      k.sun(60, 54, 15, 46, 32, true) +
      glow(k, 56, 64, 22, 20, 0.7) +
      k.draw([{ d: green, fill: FELT, inner: k.sh(green, 0, 0, 0, 1, 0, 0.8, FELT_D, 0.4) + `<path d="${ellipse(60, 90, 32, 8)}" fill="none" stroke="${FELT_L}" stroke-width=".5" stroke-dasharray="1.2 1"/>` }], 0.6) +
      cup(k, 66, 89, 7) +
      flag(k, 70, 89, 32, P.red, P.wine, '15') +
      k.floor(52, 89.6, 8, 1.6, FELT_D) +
      sphere(k, 52, 80, 9.4, NAR, NAR_D, { deco: `<g transform="translate(52 80)">${tigerStripes(9.4)}</g>` + Array.from({ length: 7 }, (_, i) => `<circle cx="${f(47 + (i % 4) * 3.4)}" cy="${f(76 + Math.floor(i / 4) * 4.4 + (i % 2))}" r=".55" fill="#F6C08E" opacity=".8"/>`).join('') }) +
      hair(40, 70, 37, 76, 38, 84, 0.7, P.mid) + hair(36, 66, 32, 74, 33.4, 82, 0.6, P.mid) +
      scrolls(60, 100, 13, P.goldD) +
      sparkle(84, 72, 2.2) + sparkle(34, 40, 1.8) + sparkle(46, 62, 1.3) +
      k.defs()
    )
  },

  // ── Minigolfista ──────────────────────────────────────────────────

  // Tres ganadas con el palo de la entrada: el putter de alquiler, con el puño encintado, la etiqueta con su número
  // atada con un hilo y la vara un poco torcida.
  'Palo prestado': (u) => {
    const k = kit(u)
    const tag = 'M0 3L3.6 0H16.4C17.4 0 18 .6 18 1.6V10.4C18 11.4 17.4 12 16.4 12H3.6L0 9Z'
    return (
      mintDay(k) +
      k.sun(60, 56, 14, 44, 32, false) +
      felt(k, 90) +
      k.floor(64, 92, 18, 2.2, FELT_D) +
      `<g transform="translate(60 90) rotate(14) scale(1.25)">` + putter(k, { grip: P.red, gripD: P.wine, tape: true, bent: true }) + `</g>` +
      `<path d="M51.6 44C47 46 43.6 50 42.4 55" fill="none" stroke="${P.ink}" stroke-width=".9"/><path d="M51.6 44C47 46 43.6 50 42.4 55" fill="none" stroke="${P.paper}" stroke-width=".4"/>` +
      `<g transform="translate(42.4 55) rotate(100)">` +
      k.draw([{ d: tag, fill: P.paper, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.5) +
      `<circle cx="2.6" cy="3" r=".8" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      `<text x="35" y="64.6" ${GEORGIA} font-weight="700" font-size="5" fill="${P.ink}" text-anchor="middle" transform="rotate(8 35 64.6)">Nº7</text>` +
      golfBall(k, 78, 89.4, 4.6) +
      sparkle(86, 40, 1.8) + sparkle(30, 82, 1.4) +
      k.defs()
    )
  },

  // Diez victorias, siempre con la naranja: la pelotita naranja de la cábala, grande y con brillo, delante del
  // balde de las otras de colores que nadie pide.
  'Pelotita de color': (u) => {
    const k = kit(u)
    const bucket = 'M62 58H90L87 84C86.8 86 85.4 87 83.6 87H68.4C66.6 87 65.2 86 65 84Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.cast([bucket], 1.6, 1.4) +
      golfBall(k, 70, 57, 5.2, P.sky, P.mid, P.blue) + golfBall(k, 80, 56, 5.2, P.white) + golfBall(k, 86, 59, 4.4, P.red, P.wine, '#E07C70') + golfBall(k, 75, 53, 4.6, P.green, P.greenD, '#B5C887') +
      k.draw([{ d: bucket, fill: P.mid, inner: k.sh(bucket, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M62 62H90M62 70H90M62 78H90" stroke="${P.sky}" stroke-width=".5" opacity=".7"/><path d="M62 58H68L70 87H66Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` }], 0.6) +
      `<path d="M62 58H90" stroke="${P.sky}" stroke-width="1"/>` +
      k.floor(50, 92, 20, 3, P.mid) +
      golfBall(k, 49, 72, 19, NAR, NAR_D, '#F3B27C') +
      `<path d="${starPath(36, 86, 3.4, 1.3, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(32, 54, 2.4) + sparkle(64, 46, 1.8) + sparkle(70, 92, 1.4) +
      k.defs()
    )
  },

  // Treinta ganadas: el castillito del hoyo 9, de noche con sus faroles, con la banderita dorada en la torre y la
  // cinta con tu nombre.
  'Dueño del castillito': (u) => {
    const k = kit(u)
    const wall = 'M40 92V62H43V58.6H47V62H51V58.6H55V62H65V58.6H69V62H73V58.6H77V62H80V92Z'
    const towerL = 'M31 92V52H33.4V48H37V52H40V48H43.6V52H46V92Z'
    const towerR = 'M74 92V52H76.4V48H80V52H83V48H86.6V52H89V92Z'
    const keep = 'M51 92V44H53.6V40H57.4V44H62.6V40H66.4V44H69V92Z'
    const gate = 'M54 92V79A6 6 0 0 1 66 79V92Z'
    const bricks = (x0: number, x1: number, y0: number, y1: number) => {
      let s = ''
      for (let y = y0, r = 0; y < y1; y += 4, r++) {
        s += `M${x0} ${y}H${x1}`
        for (let x = x0 + (r % 2 ? 2.4 : 0); x < x1; x += 4.8) s += `M${f(x)} ${y}V${y + 4}`
      }
      return `<path d="${s}" stroke="${P.blue}" stroke-width=".35" opacity=".8"/>`
    }
    const win = (x: number, y: number) => `<path d="M${f(x - 1.4)} ${f(y + 3)}V${y}A1.4 1.4 0 0 1 ${f(x + 1.4)} ${y}V${f(y + 3)}Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`
    return (
      k.night() +
      glow(k, 60, 66, 36, 30, 0.6, P.gold) +
      [[30, 32], [92, 36], [42, 22], [80, 22], [96, 58]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.cast([towerL, towerR, wall, keep], 2, 1.6, '#0F1736') +
      k.draw([
        { d: wall, fill: P.white, inner: bricks(40, 80, 62, 92) + k.sh(wall, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) },
        { d: towerL, fill: P.white, inner: bricks(31, 46, 52, 92) + k.sh(towerL, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
        { d: towerR, fill: P.white, inner: bricks(74, 89, 52, 92) + k.sh(towerR, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
        { d: keep, fill: P.white, inner: bricks(51, 69, 44, 92) + k.sh(keep, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
      ], 0.65) +
      win(38.5, 60) + win(81.5, 60) + win(60, 52) +
      k.draw([{ d: gate, fill: P.night, inner: `<ellipse cx="60" cy="92" rx="6" ry="3" fill="${P.mid}" opacity=".6"/>` }], 0.5) +
      `<path d="M55.6 70.6H64.4V75.6H55.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><text x="60" y="74.6" ${GEORGIA} font-weight="700" font-size="4.4" fill="${P.ink}" text-anchor="middle">9</text>` +
      flag(k, 60, 40, 22, P.gold, P.goldD) +
      `<path d="${starPath(67.4, 26.8, 2.4, 1, 5)}" fill="${P.white}"/>` +
      golfBall(k, 60, 89, 3.4) +
      banner(k, 60, 91, 44, P.red, P.wine, 'tu castillo', P.goldL, 4.6) +
      sparkle(90, 44, 2.2, P.goldL) + sparkle(30, 72, 1.6, P.goldL) +
      k.defs()
    )
  },
}
