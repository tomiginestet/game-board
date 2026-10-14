// Handball en clave heroica: la pelota blanca de gajos curvos (más chica que la de fútbol), el arco con los postes
// pintados a franjas rojas y blancas, el área de seis metros y los objetos del chiste (la gomera de chicle, el casco del
// gladiador, la estrella de mar, las tablas clavadas, la pared de goma). A los Gladiadores no se los dibuja.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { GEORGIA } from './_basquet-piezas'

/** Chicle rosa (apagado) de la gomera. */
const CHICLE = '#E7A0B0', CHICLE_D = '#B5607A'
/** Ladrillo de la pared de goma. */
const LADRILLO = '#C46A4E', LADRILLO_D = '#7E3626'
/** Estrella de mar. */
const ESTRELLA = '#E59060', ESTRELLA_D = '#A9532E'

/** Pelota de handball en (x,y) de radio r: blanca, con dos gajos curvos (azul y rojo) y las costuras. */
function hball(k: Kit, x: number, y: number, r: number, rot = -20) {
  const d = ellipse(x, y, r, r), s = 1 / r
  const band1 = 'M-1.2 -.32C-.6 -.95 .5 -.95 1.2 -.12L1.2 .24C.4 -.46 -.6 -.5 -1.2 .1Z'
  const band2 = 'M-1.2 .58C-.4 .2 .5 .28 1.2 .78L1.2 1.02C.5 .58 -.4 .5 -1.2 .84Z'
  const panels =
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${r})">` +
    `<path d="${band1}" fill="${P.mid}"/><path d="${band2}" fill="${P.red}"/>` +
    `<path d="M-1.2 .1C-.6 -.5 .4 -.46 1.2 .24" fill="none" stroke="${P.gold}" stroke-width="${f(0.7 * s)}" transform="translate(0 ${f(1.1 * s)})"/>` +
    `<path d="M-1.2 -.32C-.6 -.95 .5 -.95 1.2 -.12M-1.2 .1C-.6 -.5 .4 -.46 1.2 .24M-1.2 .58C-.4 .2 .5 .28 1.2 .78M-.3 -1.1C-.1 -.4 -.2 .4 -.5 1.1M.6 -.95C.5 -.3 .6 .4 .3 1" fill="none" stroke="${P.ink}" stroke-width="${f(0.5 * s)}"/>` +
    `</g>`
  return (
    k.draw([{
      d, fill: P.white,
      inner: panels + k.sh(d, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) + `<path d="${d}" fill="${k.rad('#ffffff', 0.32, 0.3, 0.5, 0.6, 0)}"/>`,
    }], f(Math.min(0.8, 0.3 + r * 0.035))) +
    `<ellipse cx="${f(x - r * 0.44)}" cy="${f(y - r * 0.46)}" rx="${f(r * 0.2)}" ry="${f(r * 0.1)}" fill="#fff" opacity=".9" transform="rotate(-42 ${f(x - r * 0.44)} ${f(y - r * 0.46)})"/>`
  )
}

/** Arco de handball de (x0,y0) a (x1,y1): postes y travesaño a franjas rojas y blancas, con la red detrás. */
function goal(k: Kit, x0: number, y0: number, x1: number, y1: number, w = 3.4, o: { net?: boolean } = {}) {
  const bar = `M${x0} ${y0}H${x1}V${f(y0 + w)}H${x0}Z`, pl = `M${x0} ${y0}H${f(x0 + w)}V${y1}H${x0}Z`, pr = `M${f(x1 - w)} ${y0}H${x1}V${y1}H${f(x1 - w)}Z`
  const seg = (y1 - y0) / 5
  let stripesV = '', stripesH = ''
  for (let i = 1; i < 5; i += 2) stripesV += `M${x0 - 1} ${f(y0 + i * seg)}H${x1 + 1}V${f(y0 + (i + 1) * seg)}H${x0 - 1}Z`
  const hs = (x1 - x0) / 7.5
  for (let i = 1; i < 8; i += 2) stripesH += `M${f(x0 + i * hs)} ${y0 - 1}V${f(y0 + w + 1)}H${f(x0 + (i + 1) * hs)}V${y0 - 1}Z`
  let net = ''
  if (o.net !== false) {
    for (let x = x0 + w + 2.4; x < x1 - w; x += 3) net += `M${f(x)} ${f(y0 + w)}V${y1}`
    for (let y = y0 + w + 2.6; y < y1; y += 3) net += `M${f(x0 + w)} ${f(y)}H${f(x1 - w)}`
  }
  const post = (d: string, stripes: string, vertical: boolean) => ({ d, fill: P.white, inner: `<path d="${stripes}" fill="${P.red}"/>` + k.sh(d, 0, 0, vertical ? 1 : 0, vertical ? 0 : 1, 0, 0.75, P.wine, 0.4) })
  return (
    `<path d="M${f(x0 + w)} ${f(y0 + w)}H${f(x1 - w)}V${y1}H${f(x0 + w)}Z" fill="${P.night}" opacity=".12"/>` +
    `<path d="${net}" stroke="${P.ink}" stroke-width=".9" opacity=".55"/><path d="${net}" stroke="${P.white}" stroke-width=".4"/>` +
    k.cast([bar, pl, pr], 1.6, 1.6, P.mid) +
    k.draw([post(pl, stripesV, true), post(pr, stripesV, true), post(bar, stripesH, false)], 0.6)
  )
}

/** Piso de la cancha (azul) desde y0, con el área de seis metros (línea entera) y la de nueve (punteada). */
function court(k: Kit, y0: number, a6: number, a9: number) {
  const d = `M-10 ${y0}H130V140H-10Z`
  return k.draw([{
    d, fill: P.blue,
    inner:
      k.sh(d, 0, 0, 0, 1, 0, 0.7, P.mid, 0.45) + `<path d="M-10 ${y0}H130V${y0 + 10}H-10Z" fill="${k.lin(P.sky, 0, 0, 0, 1, 0.8, 0)}"/>` +
      `<path d="M${f(60 - a6 * 1.7)} ${y0}Q60 ${f(y0 + a6 * 2)} ${f(60 + a6 * 1.7)} ${y0}" fill="${P.goldD}" opacity=".5"/>` +
      `<path d="M${f(60 - a6 * 1.7)} ${y0}Q60 ${f(y0 + a6 * 2)} ${f(60 + a6 * 1.7)} ${y0}" fill="none" stroke="#fff" stroke-width="1.1"/>` +
      `<path d="M${f(60 - a9 * 1.7)} ${y0}Q60 ${f(y0 + a9 * 2)} ${f(60 + a9 * 1.7)} ${y0}" fill="none" stroke="#fff" stroke-width=".9" stroke-dasharray="2.4 1.8"/>`,
  }], 0.5)
}

export const HANDBALL_ART: Record<string, (u: number) => string> = {
  // ── Lanzador ───────────────────────────────────────────────────────

  // Diez goles: el brazo se estira como chicle. La gomera con las tiras de chicle rosa estiradas, a punto de soltar.
  'Brazo de goma': (u) => {
    const k = kit(u)
    const handle = taper(48, 98, 48.6, 84, 48, 70, 8, 7)
    const armL = taper(48, 72, 40, 62, 38.4, 40, 7.4, 5.2)
    const armR = taper(48, 72, 57, 61, 60.6, 38.4, 7.4, 5.2)
    const B = [80, 72], R = 10.4
    const gum = (x0: number, y0: number, cx: number, cy: number) => {
      const p = taper(x0, y0, cx, cy, B[0] - 6, B[1] - 2, 3.2, 1.8)
      return k.draw([{ d: p, fill: CHICLE, inner: k.sh(p, 0, 0, 0, 1, 0, 0.8, CHICLE_D, 0.4) }], 0.45)
    }
    const pouch = `M${B[0] - 8.6} ${B[1] - 7}C${B[0] - 2} ${B[1] - 5.4} ${B[0] + 1.6} ${B[1] + 2} ${B[0] - 1.2} ${B[1] + 9.4}C${B[0] - 6} ${B[1] + 6} ${B[0] - 9.6} ${B[1] + 2} ${B[0] - 8.6} ${B[1] - 7}Z`
    const wood = (d: string) => ({ d, fill: P.brown, inner: k.sh(d, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) + `<path d="${d}" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.55, 0)}"/>` })
    return (
      k.day() +
      k.sun(60, 54, 15, 44, 28, false) +
      k.floor(52, 98, 14, 2, P.mid) +
      gum(38.4, 40.6, 58, 52) +
      k.draw([wood(handle), wood(armL), wood(armR)], 0.8) +
      hair(46.6, 76, 47.4, 84, 46.8, 94, 0.5, P.brownD) + hair(40, 46, 40.6, 56, 44, 64, 0.4, P.brownD) +
      // La empuñadura forrada.
      [80, 84.4, 88.8].map((y) => `<path d="M43.6 ${y}Q48.2 ${y + 1.6} 52.4 ${y}V${y + 2.6}Q48.2 ${y + 4.2} 43.6 ${y + 2.6}Z" fill="${P.wine}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      gum(60.6, 39, 70, 52) +
      hball(k, B[0], B[1], R, 24) +
      k.draw([{ d: pouch, fill: P.brownD, inner: k.sh(pouch, 0, 0, 1, 0, 0, 0.6, P.night, 0.4) + hair(B[0] - 7, B[1] - 3, B[0] - 4, B[1] + 2, B[0] - 2.4, B[1] + 7, 0.4, P.brown) }], 0.45) +
      // La tensión del chicle.
      hair(88, 56, 92, 60, 94, 66, 0.7, P.mid) + hair(92, 74, 95, 78, 94, 84, 0.6, P.mid) +
      `<circle cx="66.6" cy="44.4" r="2.4" fill="${CHICLE}" stroke="${P.ink}" stroke-width=".45"/><circle cx="65.9" cy="43.7" r=".6" fill="#fff"/>` +
      sparkle(32, 30, 2) + sparkle(30, 78, 1.4) +
      k.defs()
    )
  },

  // Cincuenta: el salto en suspensión. La pelota vuela con alas arriba del área, y su sombra queda allá abajo.
  'Lanzamiento en suspensión': (u) => {
    const k = kit(u)
    const wing = 'M0 0C-3 -5 -9 -8 -17 -8C-14 -6 -13 -5 -13 -4C-15 -3.6 -16.4 -2.4 -17 -.8C-14.4 -1.2 -12.6 -1 -11.6 -.4C-12.8 .6 -13.4 2 -13.4 3.4C-10 1.6 -5 1.6 0 3Z'
    const wingD = (s: number) => `<g transform="translate(${60 + s * 9} 41) scale(${-s * 1.3} 1.3) rotate(8)">` +
      k.draw([{ d: wing, fill: P.white, inner: k.sh(wing, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + hair(-2, 0, -7, -3, -13, -5.4, 0.4, P.blue) + hair(-2, 1.6, -7, -.4, -11, -.6, 0.35, P.blue) }], 0.5) + `</g>`
    return (
      k.day() +
      k.stage(60, 50, 34) +
      goal(k, 47, 56, 73, 70, 1.6) +
      court(k, 70, 10, 15) +
      // La sombra en el piso, lejos.
      k.floor(60, 84, 8, 1.8, P.night) +
      `<path d="M60 52V80" stroke="${P.mid}" stroke-width=".5" stroke-dasharray="1 1.4"/>` +
      wingD(-1) + wingD(1) +
      hball(k, 60, 40, 12, -30) +
      hair(54, 60, 53, 55, 54, 51.6, 0.8, P.mid) + hair(66, 60, 67, 55, 66, 51.6, 0.8, P.mid) +
      sparkle(34, 32, 2.2) + sparkle(87, 38, 1.6) +
      k.defs()
    )
  },

  // Ciento cincuenta: el casco del gladiador, de oro, con la cresta celeste y blanca. Y la pelota, a sus pies.
  'Gladiador del área': (u) => {
    const k = kit(u)
    const dome = 'M39 62C39 45 48 37 60 37C72 37 81 45 81 62Z'
    const brim = 'M29 63.4Q60 56.6 91 63.4L89 68.4Q60 62.8 31 68.4Z'
    const visor = 'M44.4 64.4H75.6V82Q75.6 88.6 69.6 90H50.4Q44.4 88.6 44.4 82Z'
    const crest = 'M55 39C52.4 33 47.6 27 47.4 21C52 23.4 56 22.6 60 19.4C64 22.6 68 23.4 72.6 21C72.4 27 67.6 33 65 39Z'
    let holes = ''
    for (let y = 68; y < 88; y += 3.4) for (let x = 48; x < 74; x += 3.4) if (!(y > 84 && (x < 50 || x > 70))) holes += `<circle cx="${f(x)}" cy="${f(y)}" r="1.05" fill="${P.night}"/>`
    const gold = (d: string) => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` })
    const scroll = 'M2 0C3.6 -3.6 8.4 -4.8 11 -2.2C13.2 0 12 3.4 9.4 3.4C7.6 3.4 7 1.6 8.2 .8'
    const vol = (d: string, c = P.goldL) => `<path d="${d}" fill="none" stroke="${P.goldD}" stroke-width="1.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width=".5" stroke-linecap="round"/>`
    return (
      k.day() +
      k.sun(60, 58, 20, 50, 32) +
      k.floor(60, 92, 22, 2.6, P.goldD) +
      k.cast([dome, brim, visor], 2.4, 2.2, P.goldD) +
      k.draw([
        {
          d: crest, fill: P.white,
          inner: `<path d="M53.4 40L46 18H51.6L56.6 40ZM63.4 40L68.4 18H74L66.6 40Z" fill="${P.sky}"/>` + k.sh(crest, 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) +
            hair(56, 38, 52, 30, 49, 22.6, 0.4, P.mid) + hair(60, 38, 60, 30, 60, 21, 0.4, P.blue) + hair(64, 38, 68, 30, 71, 22.6, 0.4, P.mid) + hair(58, 37, 56, 30, 55, 23.4, 0.3, P.blue) + hair(62, 37, 64, 30, 65, 23.4, 0.3, P.blue),
        },
        gold(dome),
        { d: visor, fill: P.sky2, inner: k.sh(visor, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + holes + `<path d="M44 64H50V91H44Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` },
        gold(brim),
      ], 0.8) +
      // Grabado del casco: la cinta del centro, las volutas y los remaches.
      `<path d="M60 37.6V61.4" stroke="${P.goldD}" stroke-width="2.4"/><path d="M60 37.6V61.4" stroke="${P.goldL}" stroke-width=".8"/>` +
      `<g transform="translate(60 52) scale(.62)">` + vol(scroll) + `</g><g transform="translate(60 52) scale(-.62 .62)">` + vol(scroll) + `</g>` +
      [[42, 60], [49, 58.4], [71, 58.4], [78, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      hair(43, 56, 45, 46, 52, 40, 0.9, '#fff', 0.85) +
      `<path d="M44.4 64.4H75.6" stroke="${P.goldD}" stroke-width="1"/>` +
      hball(k, 82.6, 84, 8.6, -10) +
      sparkle(34, 40, 2.2, P.white) + sparkle(88, 44, 1.6, P.white) + sparkle(31, 80, 1.4, P.white) +
      k.defs()
    )
  },

  // ── Arquero de handball ────────────────────────────────────────────

  // Diez atajadas: la estrella de mar, abierta de brazos y piernas, tapando el arco.
  'Estrella de mar': (u) => {
    const k = kit(u)
    const S = [60, 58]
    const star = starPath(S[0], S[1], 22, 8.6, 5, -90)
    let bumps = ''
    for (let i = 0; i < 5; i++) {
      const a = ((-90 + i * 72) * Math.PI) / 180
      for (const t of [0.3, 0.5, 0.68, 0.84]) bumps += `<circle cx="${f(S[0] + Math.cos(a) * 22 * t)}" cy="${f(S[1] + Math.sin(a) * 22 * t)}" r="${f(1.3 - t * 0.6)}" fill="${P.goldL}" stroke="${ESTRELLA_D}" stroke-width=".3"/>`
    }
    return (
      k.day() +
      k.stage(60, 54, 34) +
      goal(k, 28.6, 33, 91.4, 75.4, 3.2) +
      court(k, 75.4, 13, 19) +
      k.floor(60, 79, 18, 2, P.night) +
      k.cast([star], 2.4, 2.4, P.mid) +
      `<g stroke-linejoin="round">` +
      k.draw([{ d: star, fill: ESTRELLA, inner: k.sh(star, 0, 0, 1, 1, 0, 0.85, ESTRELLA_D, 0.45) + `<path d="${star}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.45, 0)}"/>` + bumps }], 0.8) +
      `</g>` +
      `<circle cx="${S[0]}" cy="${S[1]}" r="2.2" fill="${P.gold}" stroke="${ESTRELLA_D}" stroke-width=".4"/>` +
      // La pelota que rebota en un brazo y sale.
      `<path d="${starPath(78.6, 47, 4.4, 1.6, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
      hball(k, 85.4, 40, 6.6, 10) +
      hair(74, 34, 77, 31, 80, 30, 0.6, P.mid) + hair(76, 39, 78.6, 36.6, 79, 34, 0.5, P.mid) +
      sparkle(36, 26, 1.6) + sparkle(36, 88, 1.4) +
      k.defs()
    )
  },

  // Cuarenta atajadas: el arco parece más chico. Tan chico que está tapado con tablas, y con el cartel de cerrado.
  'Arco tapado': (u) => {
    const k = kit(u)
    const plank = (y: number, rot: number, len = 64, h = 7) => {
      const d = roundRect(-len / 2, -h / 2, len / 2, h / 2, 0.8)
      return `<g transform="translate(60 ${y}) rotate(${rot})">` +
        k.cast([d], 1.4, 1.6, P.mid) +
        k.draw([{ d, fill: P.brown, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.45) + `<path d="${d}" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0)}"/>` + hair(-len / 2 + 4, -0.6, 0, 0.8, len / 2 - 6, -0.4, 0.4, P.brownD) + hair(-10, 1.6, 4, 2.2, 14, 1.4, 0.35, P.brownD) }], 0.55) +
        [-len / 2 + 3.4, len / 2 - 3.4].map((x) => `<circle cx="${f(x)}" cy="-1.6" r=".7" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x)}" cy="1.6" r=".7" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
        `</g>`
    }
    const sign = roundRect(-12, -5, 12, 5, 1)
    return (
      k.day() +
      k.sun(60, 54, 15, 44, 28, false) +
      court(k, 78, 12, 18) +
      goal(k, 31, 36, 89, 78, 3.2) +
      plank(46, -3) + plank(56.4, 2.4) + plank(67, -1.6) +
      // El cartel colgado de un clavo.
      `<path d="M52 77L60 70.6L68 77" fill="none" stroke="${P.ink}" stroke-width=".55"/><circle cx="60" cy="70.4" r=".9" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<g transform="translate(60 81) rotate(-4)">` +
      k.draw([{ d: sign, fill: P.white, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.5) +
      `<text x="0" y="1.8" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.4" fill="${P.red}" text-anchor="middle">cerrado</text>` +
      `</g>` +
      hball(k, 80.4, 87, 6, 30) +
      hair(84, 78, 86, 76, 89, 75.6, 0.6, P.mid) + hair(87, 82, 89.6, 80, 91.6, 80, 0.5, P.mid) +
      sparkle(32, 30, 1.8) + sparkle(88, 30, 1.6) +
      k.defs()
    )
  },

  // Ciento veinte: la pared de goma. Los ladrillos se hunden y la pelota sale rebotando. ¡Boing!
  'Pared de goma': (u) => {
    const k = kit(u)
    const H = [60, 58]
    const warp = (x: number, y: number): [number, number] => {
      const dx = x - H[0], dy = y - H[1], d = Math.hypot(dx, dy) || 1
      if (d > 26) return [x, y]
      const pull = Math.pow((26 - d) / 26, 1.6) * 5.6
      return [x - (dx / d) * pull, y - (dy / d) * pull]
    }
    const quad = (x0: number, y0: number, x1: number, y1: number) => {
      const pts: [number, number][] = []
      const N = 5
      for (let i = 0; i <= N; i++) pts.push(warp(x0 + ((x1 - x0) * i) / N, y0))
      for (let i = 0; i <= N; i++) pts.push(warp(x1, y0 + ((y1 - y0) * i) / N))
      for (let i = N; i >= 0; i--) pts.push(warp(x0 + ((x1 - x0) * i) / N, y1))
      for (let i = N; i >= 0; i--) pts.push(warp(x0, y0 + ((y1 - y0) * i) / N))
      return 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
    }
    let bricks = ''
    const BW = 12, BH = 6.2
    for (let r = 0; r < 12; r++) {
      const y0 = 24 + r * BH, off = r % 2 ? -BW / 2 : 0
      for (let x0 = 16 + off; x0 < 104; x0 += BW) bricks += quad(x0 + 0.5, y0 + 0.5, x0 + BW - 0.5, y0 + BH - 0.5)
    }
    const wall = 'M10 23H110V100H10Z'
    return (
      k.day() +
      `<path d="${wall}" fill="${P.paper}"/>` +
      k.shade(wall, k.lin(P.sky2, 0, 0, 0, 1, 0.3, 0.7), P.blue, 0.3) +
      `<path d="${bricks}" fill="${LADRILLO}"/>` +
      k.shade(bricks, k.lin(LADRILLO_D, 0, 0, 1, 1, 0, 0.8), LADRILLO_D, 0.4) +
      `<path d="${bricks}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      // El hundimiento: sombra y anillos que tiemblan.
      k.shade(ellipse(H[0], H[1], 14, 14), k.rad(P.night, 0.5, 0.5, 0.5, 0.8, 0), P.night, 0.4) +
      [9, 15, 21].map((r, i) => `<path d="${ellipse(H[0], H[1], r, r * 0.92)}" fill="none" stroke="${P.goldL}" stroke-width="${0.9 - i * 0.2}" stroke-dasharray="${3 + i} ${2 + i}" opacity=".85"/>`).join('') +
      // La pelota, que vuelve con todo.
      `<path d="M62 60Q74 62 78 74" fill="none" stroke="${P.white}" stroke-width=".8" stroke-dasharray="1.4 1.2"/>` +
      k.floor(84, 96, 10, 1.6, P.night) +
      hball(k, 81.4, 79, 10, 30) +
      hair(66, 70, 68, 74, 70, 78, 0.8, P.white) + hair(70, 66, 73, 69, 75, 72, 0.6, P.white) +
      `<text x="40.4" y="86" ${GEORGIA} font-style="italic" font-weight="700" font-size="8" fill="${P.ink}" text-anchor="middle" stroke="${P.white}" stroke-width="2.2" stroke-linejoin="round" paint-order="stroke" transform="rotate(-8 40 86)">¡boing!</text>` +
      `<path d="${starPath(H[0], H[1], 4.4, 1.6, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(32, 36, 2, P.goldL) + sparkle(88, 40, 1.6, P.goldL) +
      k.defs()
    )
  },
}
