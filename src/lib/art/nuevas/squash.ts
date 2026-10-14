// Squash: la pelotita negra de punto amarillo, la raqueta de cabeza angosta y la caja (la pared de enfrente con
// la chapa abajo, las líneas rojas y la T del piso de madera). El rincón se mide con útiles de geometría y de pool.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, type Kit } from '../kit'
import { GEORGIA, label, NEGRA_D, PINO, PINO_D, racket, squashBall, stars, trail, voluta } from './_raquetas-piezas'

/** Rojo de las líneas de la cancha. */
const LINE = '#C9473D'
/** Fieltro del pool y tiza azul. */
const FELT = '#5E8C5A', FELT_D = '#3E6640', TIZA = '#6F8FD0'
/** Pizarrón. */
const BOARD = '#2C4A44', BOARD_D = '#1B302C', CHALK = '#EDEFE6'

/** Piso de tablas de madera en perspectiva desde `y0`. */
function floorboards(k: Kit, y0: number) {
  const d = `M0 ${y0}H120V130H0Z`
  const planks = Array.from({ length: 15 }, (_, i) => { const x = -60 + i * 17; return `M${f(60 + (x - 60) * 0.3)} ${y0}L${f(x)} 130` }).join('')
  return `<path d="${d}" fill="${PINO}"/>` + k.sh(d, 0, 0, 0, 1, 0.5, 0, PINO_D, 0.35) +
    `<path d="${planks}" stroke="${PINO_D}" stroke-width=".55" opacity=".8"/>` +
    `<path d="M0 ${y0}H120V${y0 + 6}H0Z" fill="${k.lin(P.brownD, 0, 0, 0, 1, 0.35, 0)}"/>`
}

/** Pared blanca de la cancha con el grano en los bordes. */
function wall(k: Kit, d: string) {
  return `<path d="${d}" fill="${P.white}"/>` + k.shade(d, k.rad(P.sky2, 0.5, 0.4, 0.75, 0, 0.9), '#9EB1DB', 0.45)
}

/** Corona dorada apoyada en (0,0). */
function crown(k: Kit) {
  const d = 'M-12.6 0L-14.6 -15.4L-7.2 -7.4L0 -19.4L7.2 -7.4L14.6 -15.4L12.6 0Z'
  const band = roundRect(-13.2, -3.4, 13.2, 2.4, 1.2)
  const jewel = (x: number, y: number, r: number, c: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff" opacity=".85"/>`
  return (
    k.draw([
      { d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-15 -20H-4V2H-15Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` + hair(-11, -4, -12, -9, -12.6, -13, 0.6, '#fff', 0.8) },
      { d: band, fill: P.gold, inner: k.sh(band, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-13.2 -1.6H13.2" stroke="${P.goldL}" stroke-width=".4"/>` },
    ], 0.7) +
    [[-14.6, -15.4], [0, -19.4], [14.6, -15.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>`).join('') +
    jewel(-7, -0.5, 1.5, P.red) + jewel(0, -0.5, 1.7, P.sky) + jewel(7, -0.5, 1.5, P.red)
  )
}

/** Termómetro de vidrio parado, centrado en x, de y0 a y1, con el mercurio hasta `lvl` (0..1). */
function thermometer(k: Kit, x: number, y0: number, y1: number, lvl: number) {
  const tubeD = `M${x - 2.6} ${y0 + 2.6}A2.6 2.6 0 0 1 ${x + 2.6} ${y0 + 2.6}V${y1 - 5}A5 5 0 1 1 ${x - 2.6} ${y1 - 5}Z`
  const top = f(y1 - 5 - (y1 - 5 - y0 - 3) * lvl)
  const ticks = Array.from({ length: 8 }, (_, i) => { const y = f(y0 + 5 + i * ((y1 - y0 - 12) / 7)); return `M${x + 2.6} ${y}h${i % 2 ? 1.6 : 2.6}` }).join('')
  return (
    k.draw([{ d: tubeD, fill: P.white, inner: k.sh(tubeD, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) }], 0.6) +
    `<path d="M${x - 1} ${top}H${x + 1}V${y1 - 4}H${x - 1}Z" fill="${P.red}"/>` +
    `<circle cx="${x}" cy="${y1 - 4.2}" r="3.6" fill="${P.red}"/>` + `<circle cx="${f(x - 1.2)}" cy="${f(y1 - 5.4)}" r="1" fill="#fff" opacity=".8"/>` +
    `<path d="${ticks}" stroke="${P.ink}" stroke-width=".5"/>` +
    `<path d="M${x - 1.6} ${y0 + 3}V${y1 - 10}" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".8"/>`
  )
}

/** Transportador de plástico transparente: semicírculo con centro en (0,0) y radio r, la base abajo. */
function protractor(k: Kit, r: number) {
  const outer = `M${-r} 0A${r} ${r} 0 0 1 ${r} 0Z`
  const inner = `M${f(-r * 0.42)} 0A${f(r * 0.42)} ${f(r * 0.42)} 0 0 1 ${f(r * 0.42)} 0Z`
  let ticks = ''
  for (let i = 0; i <= 36; i++) {
    const a = Math.PI + (i / 36) * Math.PI, l = i % 9 === 0 ? 4 : i % 3 === 0 ? 2.6 : 1.5
    ticks += `M${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}L${f(Math.cos(a) * (r - l))} ${f(Math.sin(a) * (r - l))}`
  }
  const nums = [0, 45, 90, 135, 180].map((deg) => { const a = Math.PI + (deg / 180) * Math.PI; return `<text x="${f(Math.cos(a) * (r - 7))}" y="${f(Math.sin(a) * (r - 7) + 1.2)}" ${GEORGIA} font-size="3" fill="${P.ink}" text-anchor="middle">${180 - deg}</text>` }).join('')
  return (
    k.draw([{ d: outer, fill: P.sky1, inner: `<path d="${outer}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.6, 0)}"/>` + k.sh(outer, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.6) +
    `<path d="${inner}" fill="${P.white}" opacity=".5" stroke="${P.blue}" stroke-width=".5"/>` +
    `<path d="${ticks}" stroke="${P.ink}" stroke-width=".4"/>` + nums +
    `<path d="M${-r} -1.6H${r}" stroke="${P.blue}" stroke-width=".5"/><circle cx="0" cy="-1.6" r=".8" fill="${P.red}"/>` +
    hair(-r + 3, -3, -r * 0.7, -r * 0.7, -2, -r + 2, 0.7, '#fff', 0.85)
  )
}

/** Compás de dibujo dorado con la bisagra en (0,0), abierto con las patas hasta y=len. */
function compass(k: Kit, len: number, spread: number) {
  const legL = `M-1.4 0L${f(-spread - 0.8)} ${len}L${f(-spread + 0.6)} ${len}L1 1Z`
  const legR = `M1.4 0L${f(spread - 1.4)} ${f(len - 4)}H${f(spread + 0.4)}L-1 1Z`
  const lead = `M${f(spread - 1.4)} ${f(len - 4.4)}H${f(spread + 0.4)}L${f(spread - 0.4)} ${f(len + 0.6)}Z`
  const head = roundRect(-2.4, -6.6, 2.4, 1.6, 1.2)
  return k.draw([
    { d: legL, fill: P.gold, inner: k.sh(legL, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
    { d: legR, fill: P.gold, inner: k.sh(legR, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
    { d: lead, fill: P.night },
    { d: head, fill: P.gold, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<circle cx="0" cy="-.6" r="1.1" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".35"/>` + `<path d="M-.8 -6.6V-9.4H.8V-6.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` },
  ], 0.55)
}

/** Taco de pool desde (x0,y0) (la suela) hasta la punta en (x1,y1). */
function cue(k: Kit, x0: number, y0: number, x1: number, y1: number) {
  const ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0)
  const body = `M0 -2.6L${f(len - 1.6)} -1L${len} -1V1L${f(len - 1.6)} 1L0 2.6Z`
  return (
    `<g transform="translate(${x0} ${y0}) rotate(${f((ang * 180) / Math.PI)})">` +
    k.draw([{
      d: body, fill: PINO,
      inner:
        `<path d="M0 -3H${f(len * 0.42)}V3H0Z" fill="${P.brownD}"/>` +
        `<path d="M${f(len * 0.42)} -3L${f(len * 0.42 - 3)} 0L${f(len * 0.42)} 3L${f(len * 0.42 + 3)} 0Z" fill="${P.brownD}"/>` +
        `<path d="M${f(len * 0.42 - 6)} -3h1.4v6h-1.4z" fill="${P.goldL}"/>` +
        `<path d="M${f(len - 3)} -3H${len}V3H${f(len - 3)}Z" fill="${P.white}"/><path d="M${f(len - 0.8)} -3H${len}V3H${f(len - 0.8)}Z" fill="${TIZA}"/>` +
        k.sh(body, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M2 -1.6H${f(len - 4)}" stroke="#fff" stroke-width=".5" opacity=".6"/>`,
    }], 0.55) +
    `</g>`
  )
}

export const SQUASH_ART: Record<string, (u: number) => string> = {
  // ── Caja de cristal ────────────────────────────────────────────────

  // Cinco ganados: la pelotita negra de punto amarillo, calentita (sube el vapor) y el termómetro que lo confirma.
  'Pelota de punto amarillo': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(56, 58, 15, 44, 28, false) +
      k.floor(54, 85, 16, 2.6, P.mid) +
      squashBall(k, 54, 68, 15, { rot: 30 }) +
      [44, 54, 64].map((x, i) => { const y = i === 1 ? 44 : 46; return `<path d="M${x} ${y}c-2.4 -2 2.4 -3.6 0 -5.6s2.4 -3.6 0 -5.6" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M${x} ${y}c-2.4 -2 2.4 -3.6 0 -5.6s2.4 -3.6 0 -5.6" fill="none" stroke="${P.red}" stroke-width="1.1" stroke-linecap="round"/>` }).join('') +
      thermometer(k, 84, 40, 84, 0.82) +
      sparkle(32, 40, 2) + sparkle(30, 82, 1.4) +
      k.defs()
    )
  },

  // Veinte ganados: la corona, apoyada justo en la T del piso, con la pelota a los pies.
  'Rey del T': (u) => {
    const k = kit(u)
    const back = 'M0 0H120V64H0Z'
    return (
      wall(k, back) +
      `<path d="M0 30H120" stroke="${LINE}" stroke-width="1.6"/><path d="M0 56H120" stroke="${LINE}" stroke-width="1.2"/>` +
      `<path d="M0 58H120V64H0Z" fill="${P.sky}" opacity=".6"/><path d="M0 58H120" stroke="${P.ink}" stroke-width=".5"/>` +
      floorboards(k, 64) +
      `<path d="M0 80.6H120V83.4H0Z" fill="${LINE}"/><path d="M58.4 82H61.6L64 130H56Z" fill="${LINE}"/>` +
      `<path d="M0 80.6H120" stroke="${P.wine}" stroke-width=".4" opacity=".7"/>` +
      k.floor(60, 82.6, 18, 2.6, P.brownD) +
      `<g transform="translate(60 80) scale(1.3)">` + crown(k) + `</g>` +
      squashBall(k, 84, 88, 5.4) +
      sparkle(36, 44, 2.2) + sparkle(84, 40, 1.8) + sparkle(34, 72, 1.4) +
      k.defs()
    )
  },

  // Cincuenta ganados: la pared de enfrente, con la chapa abajo y las marcas de pelota, devuelve la pelota y la
  // raqueta la espera. Oro: el marco de la pared con volutas.
  'Pared de enfrente': (u) => {
    const k = kit(u)
    const rim = 'M31 31H89V85H31Z'
    const front = 'M35 35H85V81H35Z'
    const tin = 'M35 75H85V81H35Z'
    const marks = [[54, 46, 2.2], [60, 48, 1.8], [65, 44, 2], [57, 52, 1.6], [63, 54, 1.8], [69, 50, 1.6], [50, 54, 1.4]]
      .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.85)}" fill="${P.blue}" opacity=".45"/>`).join('')
    return (
      k.day() +
      k.sun(60, 56, 15, 46) +
      laurel(48, 100, 30, 93, 27, 64, 8) + laurel(72, 100, 90, 93, 93, 64, 8, true) +
      k.cast([rim], 2, 2, P.mid) +
      k.draw([
        { d: rim, fill: P.gold, inner: k.sh(rim, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M32.4 32.4H87.6V83.6H32.4Z" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` + `<path d="M33 33H87V83H33Z" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` },
        {
          d: front, fill: P.white,
          inner:
            k.sh(front, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + marks +
            `<path d="M35 39H85" stroke="${LINE}" stroke-width="1.6"/><path d="M35 60H85" stroke="${LINE}" stroke-width="1.1"/>` +
            `<path d="${tin}" fill="${P.sky}"/>` + `<path d="M35 75H85" stroke="${LINE}" stroke-width="1.6"/>` + k.sh(tin, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4),
        },
      ], 0.6) +
      voluta('M35 31C31 27 32 23 35.6 23.6C37.8 24 37.6 26.6 36 26.6', P.gold) + voluta('M85 31C89 27 88 23 84.4 23.6C82.2 24 82.4 26.6 84 26.6', P.gold) +
      `<path d="M60 49C66 60 71 67 75 71" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.4 1.2"/>` +
      `<g transform="translate(44 82) rotate(26)">` + racket(k, 0, 0, 0, { squash: true, s: 0.78, frame: P.gold, frameD: P.goldD, grip: P.night, gripD: P.mid, engrave: true }) + `</g>` +
      squashBall(k, 76, 74, 6.4) +
      trail(72, 70, 225, 6, 3, 2.4, P.mid, 0.7) +
      sparkle(86, 40, 2.2, '#fff') + sparkle(36, 40, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Rincón ────────────────────────────────────────────────────────

  // Tres rincones: el transportador apoyado en el rincón mide el ángulo del rebote.
  'Escuadra': (u) => {
    const k = kit(u)
    const left = 'M0 0H60V74L0 96Z', right = 'M60 0H120V96L60 74Z', floorD = 'M0 96L60 74L120 96V130H0Z'
    return (
      wall(k, left) + `<path d="${right}" fill="${P.sky1}"/>` + k.shade(right, k.lin(P.sky2, 0, 0, 1, 0, 0.6, 0.2), '#9EB1DB', 0.5) +
      `<path d="${floorD}" fill="${PINO}"/>` + k.sh(floorD, 0, 0, 0, 1, 0, 0.7, PINO_D, 0.35) +
      `<path d="M60 0V74" stroke="${P.blue}" stroke-width=".8"/><path d="M0 96L60 74L120 96" fill="none" stroke="${P.blue}" stroke-width=".8"/>` +
      `<path d="M0 34L60 28L120 34" fill="none" stroke="${LINE}" stroke-width="1.2"/>` +
      k.floor(60, 85, 24, 2.6, PINO_D) +
      `<g transform="translate(60 84)">` + protractor(k, 22) + `</g>` +
      `<path d="M39 41L60 62L81 41" fill="none" stroke="${P.mid}" stroke-width=".9" stroke-dasharray="1.6 1.2"/><path d="M78.4 41.2L82.6 39.4L80.8 43.6Z" fill="${P.mid}"/>` +
      `<path d="M55 57A7 7 0 0 1 65 57" fill="none" stroke="${LINE}" stroke-width=".9"/>` +
      label(60, 52.6, 4.6, '90°', LINE) +
      squashBall(k, 36, 38, 5.4) + trail(32, 34, 225, 5, 3, 2.2, P.mid, 0.6) +
      sparkle(32, 82, 1.8) + sparkle(36, 30, 1.6) +
      k.defs()
    )
  },

  // Quince rincones: la pelota es la bola ocho y el taco le pega con efecto, sobre el paño verde.
  'Billarista': (u) => {
    const k = kit(u)
    const cloth = 'M0 76H120V130H0Z'
    const chalk = 'M0 0H7L8.6 -2.4H1.6Z', chalkF = 'M0 0H7V6.4H0Z', chalkS = 'M7 0L8.6 -2.4V4L7 6.4Z'
    return (
      k.day() +
      k.stage(60, 56, 34) +
      `<path d="${cloth}" fill="${FELT}"/>` + k.sh(cloth, 0, 0, 0, 1, 0, 0.7, FELT_D, 0.4) +
      `<path d="M0 76H120V79H0Z" fill="${FELT_D}"/>` +
      k.floor(62, 82, 16, 2.4, FELT_D) +
      `<path d="M38 58A24 10 0 0 0 86 56" fill="none" stroke="${P.mid}" stroke-width="1" stroke-dasharray="1.6 1.2"/><path d="M84.4 52.6L87.6 56.4L82.6 57.6Z" fill="${P.mid}"/>` +
      cue(k, 22, 90, 44, 72.6) +
      squashBall(k, 62, 62, 16, { dots: 1, dot: P.gold }) +
      `<circle cx="64.8" cy="64" r="5.4" fill="${P.gold}" stroke="${NEGRA_D}" stroke-width=".4"/>` +
      `<text x="64.8" y="67" ${GEORGIA} font-weight="700" font-size="8" fill="${P.ink}" text-anchor="middle">8</text>` +
      `<g transform="translate(84 86)">` + k.draw([{ d: chalkF, fill: TIZA }, { d: chalkS, fill: P.mid }, { d: chalk, fill: P.sky }], 0.45) + `<path d="M2 1.4H5V2.6H2Z" fill="${P.white}" opacity=".8"/></g>` +
      sparkle(36, 40, 2.2) + sparkle(88, 36, 1.6) +
      k.defs()
    )
  },

  // Cuarenta rincones: el pizarrón con la figura de Pitágoras, la pelota en el ángulo recto y el compás de oro.
  'Geómetra de goma': (u) => {
    const k = kit(u)
    const board = 'M0 0H120V130H0Z'
    const tri = 'M40 78H78L40 48Z'
    const chalkLine = (d: string, w = 0.9) => `<path d="${d}" fill="none" stroke="${CHALK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>`
    const txt = (x: number, y: number, s: number, t: string) => `<text x="${x}" y="${y}" ${GEORGIA} font-style="italic" font-size="${s}" fill="${CHALK}" text-anchor="middle">${t}</text>`
    return (
      `<path d="${board}" fill="${BOARD}"/>` + k.shade(board, k.rad(BOARD_D, 0.5, 0.45, 0.65, 0, 1), BOARD_D, 0.5) +
      k.shade(ellipse(60, 58, 34, 32), k.rad(P.gold, 0.5, 0.5, 0.5, 0.35, 0), P.gold, 0.35) +
      stars([[30, 34], [92, 40], [96, 70], [26, 66]], CHALK) +
      `<path d="${tri}" fill="${CHALK}" opacity=".08"/>` + chalkLine(tri, 1.2) +
      chalkLine('M40 73H45V78', 0.7) + chalkLine('M70.4 78A7.6 7.6 0 0 0 71.6 73.4', 0.6) +
      // el rebote en el rincón, en punteado
      `<path d="M78 78L40 48" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-dasharray="1.4 1.2" transform="translate(2 -2)"/>` +
      txt(59, 84.6, 5, 'a') + txt(35.4, 65, 5, 'b') + txt(62.6, 59.6, 5, 'c') +
      txt(60, 94, 5.6, 'a²+b²=c²') +
      laurel(48, 100, 30, 93, 27, 64, 8) + laurel(72, 100, 90, 93, 93, 64, 8, true) +
      `<g transform="translate(72 30) rotate(-8)">` + compass(k, 30, 9) + `</g>` +
      squashBall(k, 40, 78, 5.6) +
      sparkle(86, 50, 2.4, P.goldL) + sparkle(34, 40, 1.6, P.goldL) + sparkle(54, 30, 1.4, '#fff') +
      k.defs()
    )
  },
}

