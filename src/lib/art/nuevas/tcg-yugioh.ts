// Yu-Gi-Oh!: el violeta de la ficha como acento, con el oro del antiguo Egipto y la noche de los duelos.
// Nada de la marca: ni sus monstruos, ni el Rompecabezas tal cual, ni el dorso ni el marco de sus cartas.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'

/** El violeta de la ficha (#5F3DC4), con su sombra y sus luces. */
const VIO = '#5F3DC4', VIOD = '#3B2585', VIOL = '#A28CEB', VIOLL = '#DDD5F8'

/** Tramo de una ranura de rompecabezas hasta `x`, con una perilla hacia `d` (1 abajo, −1 arriba). */
const knobH = (x: number, y: number, d: number) => `H${f(x - 1.2)}C${f(x - 3)} ${f(y + d * 3.6)} ${f(x + 3)} ${f(y + d * 3.6)} ${f(x + 1.2)} ${y}`
/** Lo mismo en vertical (hacia abajo), con la perilla hacia `d` (1 derecha, −1 izquierda). */
const knobV = (x: number, y: number, d: number) => `V${f(y - 1.2)}C${f(x + d * 3.6)} ${f(y - 3)} ${f(x + d * 3.6)} ${f(y + 3)} ${x} ${f(y + 1.2)}`

/** Ranura grabada en metal: surco de tinta con su filo de luz al costado. */
const groove = (d: string, c = P.goldD, l = P.goldL, w = 0.7) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${l}" stroke-width="${f(w * 0.55)}" stroke-linejoin="round" stroke-linecap="round" transform="translate(.45 .5)"/>`

/** Rayos rectos de un resplandor (gloria) del color pedido, alrededor de (cx,cy). */
function burst(k: Kit, cx: number, cy: number, r0: number, r1: number, n: number, c: string) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, len = i % 2 ? r0 + (r1 - r0) * 0.7 : r1, w = i % 2 ? 1 : 1.6
    const ux = Math.cos(a), uy = Math.sin(a)
    d += `M${f(cx + ux * r0 - uy * w)} ${f(cy + uy * r0 + ux * w)}L${f(cx + ux * len)} ${f(cy + uy * len)}L${f(cx + ux * r0 + uy * w)} ${f(cy + uy * r0 - ux * w)}Z`
  }
  return `<path d="${d}" fill="${k.rad(c, 0.5, 0.5, 0.5, 0.95, 0.1)}"/>` + k.shade(d, k.rad(c, 0.5, 0.5, 0.5, 0.9, 0), c, 0.2)
}

/** Ojo genérico (no el de Horus): almendra blanca, iris violeta y párpado de tinta. Centro en (0,0). */
function eye(k: Kit, w: number, h: number) {
  const d = `M${-w} 0C${f(-w * 0.6)} ${f(-h * 1.1)} ${f(w * 0.6)} ${f(-h * 1.1)} ${w} 0C${f(w * 0.6)} ${f(h * 1.1)} ${f(-w * 0.6)} ${f(h * 1.1)} ${-w} 0Z`
  const r = h * 0.95
  const fibers = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${f(Math.cos(a) * r * 0.45)} ${f(Math.sin(a) * r * 0.45)}L${f(Math.cos(a) * r * 0.9)} ${f(Math.sin(a) * r * 0.9)}` }).join('')
  return (
    `<path d="${d}" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>` +
    k.clip(d, k.sh(d, 0, 0, 0, 1, 0, 0.6, P.sky2, 0.4) +
      `<circle r="${f(r)}" fill="${VIO}" stroke="${VIOD}" stroke-width=".5"/><path d="${fibers}" stroke="${VIOL}" stroke-width=".3"/>` +
      `<circle r="${f(r * 0.42)}" fill="${P.ink}"/><circle cx="${f(-r * 0.35)}" cy="${f(-r * 0.35)}" r="${f(r * 0.22)}" fill="#fff"/>`) +
    hair(-w - 0.4, 0.2, 0, -h * 2.05, w + 0.4, -0.2, 1.1) + hair(-w * 0.8, h * 0.5, 0, h * 1.4, w * 0.8, h * 0.5, 0.45)
  )
}

/** Puño cerrado visto de costado con el pulgar arriba (la mano del abuelo). Muñeca abajo en (0,0). */
function thumbsUp(k: Kit) {
  const palm = 'M-9.4 -20C-10.4 -14 -10 -7 -8.6 0H8.2C9.4 -6 9.8 -13 9 -20Z'
  const F: [number, number, number][] = [[-22.4, -17.2, 14.6], [-17.2, -12, 15], [-12, -7, 14.2], [-7, -2.6, 12.4]]
  const finger = ([y0, y1, x1]: [number, number, number]) => { const r = (y1 - y0) / 2; return `M-4 ${y0}H${f(x1 - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x1 - r)} ${y1}H-4Z` }
  const thumb = 'M-8.6 -18.4C-9.4 -24 -9 -30 -7.6 -35.6C-6.6 -39.6 -1.6 -40 -.6 -36C.2 -32.6 .2 -27 -.4 -21.6Z'
  const nail = 'M-6.6 -36.4C-6.2 -38.4 -2.6 -38.8 -2 -36.6L-2.2 -33.8C-3.6 -33.2 -5.6 -33.2 -6.6 -33.8Z'
  return (
    k.draw([
      { d: palm, fill: P.skin, inner: k.sh(palm, 0, 0, 1, 0, 0, 0.75, P.blue, 0.35) + hair(-6, -12, -6.6, -7, -5.4, -2, 0.4, P.brown) },
      ...F.map((g, i) => ({
        d: finger(g), fill: P.skin, line: 0.35,
        inner: k.sh(finger(g), 0, 0, 1, 1, 0, 0.75, P.blue, 0.35) + `<path d="M${f(g[2] - 6.4)} ${f(g[0] + 0.8)}C${f(g[2] - 7.2)} ${f((g[0] + g[1]) / 2)} ${f(g[2] - 7.2)} ${f((g[0] + g[1]) / 2)} ${f(g[2] - 6.4)} ${f(g[1] - 0.8)}" fill="none" stroke="${P.brown}" stroke-width=".35"/>` +
          hair(g[2] - 2.4, g[0] + 1.2, g[2] - 1.2, (g[0] + g[1]) / 2, g[2] - 2.4, g[1] - 1.2, 0.35, P.brown) + (i === 2 ? '' : ''),
      })),
      { d: thumb, fill: P.skin, line: 0.35, inner: k.sh(thumb, 0, 0, 1, 0, 0, 0.8, P.blue, 0.35) + hair(-7.4, -24, -5, -25, -2.4, -24.4, 0.4, P.brown) + hair(-7.2, -27, -5, -28, -2.6, -27.4, 0.35, P.brown) },
    ], 0.6) +
    `<path d="${nail}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
    // anillo de bodas en el anular
    `<path d="M2.2 -12.2V-6.8" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M2.2 -12.2V-6.8" stroke="${P.gold}" stroke-width="1.3" stroke-linecap="round"/>` +
    `<circle cx="-5" cy="-15" r=".5" fill="${P.brown}" opacity=".6"/><circle cx="-3.4" cy="-10" r=".4" fill="${P.brown}" opacity=".5"/><circle cx="-6.6" cy="-6" r=".45" fill="${P.brown}" opacity=".5"/>`
  )
}

/** Carta de reliquia (no la de la marca): marco dorado, ventana violeta con una pieza de piedra y renglones. Centro en (0,0). */
function relicCard(k: Kit, art: string) {
  const d = roundRect(-8, -11, 8, 11, 1.2)
  const win = 'M-6.2 -9H6.2V3.4H-6.2Z'
  return (
    k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="M-8 -11H-3V11H-8Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.7, 0)}"/>` }], 0.5) +
    `<path d="${roundRect(-7, -10, 7, 10, 0.7)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` +
    `<path d="${win}" fill="${VIOD}"/>` + k.clip(win, `<circle cx="0" cy="-2.8" r="7.4" fill="${k.rad(VIOL, 0.5, 0.5, 0.5, 0.85, 0)}"/>` + art) +
    `<path d="${win}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
    `<path d="M-6 5.6H6M-6 7.2H6M-6 8.8H2.6" stroke="${P.goldD}" stroke-width=".45"/>`
  )
}

/** Las piezas de piedra del prohibido, en coordenadas de la ventana de la carta: cabeza con tocado, brazo y pierna encadenados. */
const STONE_PIECES = {
  head: 'M-5.2 3.4C-5.6 -1.6 -4.8 -7 0 -7.8C4.8 -7 5.6 -1.6 5.2 3.4H3.2L2.8 -2.6H-2.8L-3.2 3.4Z',
  arm: 'M-2.4 3.4H2.4L2.8 -2C4.6 -2.2 5.4 -3.6 5.2 -5.6C5 -7.6 3.6 -8.6 0 -8.6C-3.6 -8.6 -5 -7.6 -5.2 -5.6C-5.4 -3.6 -4.6 -2.2 -2.8 -2Z',
  leg: 'M-2.6 -9H2.6L2.2 -.4L5.6 1.6C6.4 2.2 6 3.4 5 3.4H-2.8Z',
}

export const TCG_YUGIOH_NUEVAS_ART: Record<string, (u: number) => string> = {
  // Tres partidas: armaste el rompecabezas y se te prendió el ojo. La pirámide dorada, con la última pieza entrando.
  'Rompecabezas del Milenio': (u) => {
    const k = kit(u)
    const xl = (y: number) => f(60 - ((y - 25) * 31) / 59), xr = (y: number) => f(60 + ((y - 25) * 31) / 59)
    const body = `M${xl(44)} 44H58.8C57 47.6 63 47.6 61.2 44H${xr(44)}L91 84H29Z`
    const cap = `M60 25L${xr(44)} 44H61.2C63 47.6 57 47.6 58.8 44H${xl(44)}Z`
    const seams =
      `M20 66` + knobH(45, 66, 1) + knobH(75, 66, -1) + `H100` +
      `M51 40` + knobV(51, 55, -1) + `V66M69 40` + knobV(69, 55, 1) + `V66` +
      `M44 66` + knobV(44, 75.4, 1) + `V90M60 66` + knobV(60, 75.4, -1) + `V90M76 66` + knobV(76, 75.4, 1) + `V90`
    const rays = [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map((deg) => {
      const a = (deg * Math.PI) / 180
      return `M${f(60 + Math.cos(a) * 8)} ${f(56 + Math.sin(a) * 5)}L${f(60 + Math.cos(a) * 12)} ${f(56 + Math.sin(a) * 8.6)}`
    }).join('')
    return (
      k.day() +
      k.sun(60, 54, 15, 47, 32, false) +
      k.shade(ellipse(60, 54, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(60, 85, 36, 3.6, P.mid) +
      k.cast([body], 2.4, 1.4) +
      k.draw([{
        d: body, fill: P.gold,
        inner:
          k.sh(body, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M${xl(44)} 44L29 84H42L55 44Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` +
          k.sh('M20 70H100V86H20Z', 0, 0, 0, 1, 0, 0.6, P.goldD, 0.4) + groove(seams) +
          hair(33, 80, 38, 72, 42, 68, 0.5, P.white, 0.8) + hair(84, 80, 80, 74, 78, 70, 0.4, P.goldD) + hair(66, 80, 70, 78, 72, 74, 0.35, P.goldD),
      }], 0.85) +
      k.shade(ellipse(60, 56, 13, 10), k.rad(VIOL, 0.5, 0.5, 0.5, 0.95, 0), VIO, 0.55) +
      `<path d="${rays}" stroke="${P.white}" stroke-width=".8" stroke-linecap="round"/>` +
      `<g transform="translate(60 56)">${eye(k, 7.6, 3.8)}</g>` +
      `<g transform="translate(0 -3.4)">` +
      k.draw([{
        d: cap, fill: P.gold,
        inner: k.sh(cap, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M60 25L${xl(44)} 44H56Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.9, 0.1)}"/>` + groove('M60 30L60 40M56 36H64', P.goldD, P.goldL, 0.5),
      }], 0.75) +
      `</g>` +
      hair(46.4, 28, 45.8, 32, 46.4, 36, 0.6) + hair(43.6, 31, 43, 34.4, 43.6, 37.6, 0.45) + hair(73.6, 28, 74.2, 32, 73.6, 36, 0.6) + hair(76.4, 31, 77, 34.4, 76.4, 37.6, 0.45) +
      sparkle(60, 19, 2.8, '#fff') + sparkle(86, 58, 2) + sparkle(33, 50, 1.6) +
      k.defs()
    )
  },

  // Quince victorias: el disco de duelo atado al brazo hasta para ir al chino, con la bolsa de los mandados.
  'Disco de duelo': (u) => {
    const k = kit(u)
    const sleeve = 'M42 6H72L70.2 31.6C62.6 34.6 52.8 34.6 45.4 31.6Z'
    const cuff = 'M45.2 28C52.8 30.8 62.8 30.8 70.4 28L70.2 32.6C62.6 35.6 52.8 35.6 45.4 32.6Z'
    const arm = 'M50 32H65.6L64.8 57H51.2Z'
    const back = 'M50.8 55H65.2C66 58.6 66 62 65.4 65H50.8C50.2 62 50.2 58.6 50.8 55Z'
    const fingers = [50.8, 54.5, 58.2, 61.9].map((x, i) => roundRect(f(x), 63.4, f(x + 3.7 - (i === 3 ? 0.3 : 0)), i === 0 || i === 3 ? 69.6 : 70.6, 1.8))
    const thumb = 'M51 57.6C48.6 58.4 47.6 61.4 48.2 64.2C48.8 66.8 50.6 68 52.4 67.6L52.6 60Z'
    const hub = ellipse(56.6, 43, 13, 13)
    const blade = 'M62 36.8L92.6 41C95 41.3 96.4 43 96.2 45.4L95.6 57.4C95.4 59.8 93.6 61 91.2 60.6L62 52.4Z'
    const rim = 'M62 36.8L92.6 41C95 41.3 96.4 43 96.2 45.4L96.1 47.4L62 41.4Z'
    const zone = (x: number, i: number) => `M${x} ${f(44.6 + i * 0.6)}H${x + 7.6}V${f(57.4 + i * 0.9)}H${x}Z`
    const bag = 'M45.4 72.6C44.4 80 44.8 88 47 94.6C54.6 96.8 63.4 96.8 70.8 94.8C73 88 73.4 80 72.4 72.6C64 71 54 71 45.4 72.6Z'
    const bread = 'M0 -3.2C8 -3.6 18 -3.4 24 -2.6C27.4 -2.2 28.6 2.2 25 2.8C18 3.6 8 3.6 0 3.2Z'
    const handles = 'M48.4 73.4C49 69 51.4 66.6 53 66.4M69.4 73.4C68.8 69 66.4 66.6 64.4 66.6'
    return (
      k.day() +
      k.stage(60, 58, 41) +
      // la bolsa del chino con el pan, colgada del puño
      `<g transform="translate(51 76) rotate(-128)">` + k.draw([{ d: bread, fill: P.goldL, inner: k.sh(bread, 0, 0, 0, 1, 0, 0.9, P.brown, 0.5) + `<path d="M6 -1.4L9 1.4M11.4 -1.6L14.4 1.2M16.8 -1.6L19.8 1" stroke="${P.brownD}" stroke-width=".55" stroke-linecap="round"/>` }], 0.55) + `</g>` +
      k.cast([bag], 2, 1.6) +
      k.draw([{
        d: bag, fill: P.white,
        inner: k.sh(bag, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + k.sh('M40 86H78V98H40Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
          hair(50, 74, 52, 82, 50, 92, 0.45, P.blue) + hair(66, 74, 64, 84, 67, 93, 0.45, P.blue) + hair(57, 75, 58, 80, 56.6, 86, 0.35, P.blue) +
          `<text x="59" y="87" font-family="Georgia, serif" font-style="italic" font-size="3.8" fill="${P.red}" text-anchor="middle" transform="rotate(-4 59 87)">¡gracias!</text>`,
      }], 0.6) +
      `<path d="${handles}" fill="none" stroke="${P.ink}" stroke-width="1.7" stroke-linecap="round"/><path d="${handles}" fill="none" stroke="${P.white}" stroke-width=".8" stroke-linecap="round"/>` +
      // el brazo con la manga de la campera violeta
      k.cast([sleeve, arm, back, blade], 2.2, 1.8) +
      k.draw([
        { d: arm, fill: P.skin, inner: k.sh(arm, 0, 0, 1, 0, 0, 0.8, P.blue, 0.35) },
        { d: sleeve, fill: VIO, inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.85, VIOD, 0.5) + `<path d="M42 6H50V34H42Z" fill="${k.lin(VIOL, 0, 0, 1, 0, 0.6, 0)}"/>` + hair(52, 14, 50.6, 21, 52.6, 29, 0.55, VIOD) + hair(64, 12, 65.4, 20, 63.4, 28, 0.55, VIOD) + hair(58, 22, 59, 25, 58.4, 29, 0.4, VIOD) },
        { d: cuff, fill: VIOD, inner: `<circle cx="67" cy="30.6" r=".8" fill="${P.gold}"/>` + hair(47, 31, 57, 33.2, 69, 31, 0.4, VIOL, 0.7) },
        { d: back, fill: P.skin, line: 0.3, inner: k.sh(back, 0, 0, 1, 0, 0, 0.8, P.blue, 0.35) + hair(53, 59, 55, 58, 57, 59, 0.35, P.brown) },
        ...fingers.map((d) => ({ d, fill: P.skin, line: 0.3, inner: k.sh(d, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) })),
        { d: thumb, fill: P.skin, inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) },
      ], 0.65) +
      // la bandeja de cartas: filo dorado, el contador de vida y las zonas, con una carta jugada
      k.draw([{
        d: blade, fill: P.sky1,
        inner: k.sh(blade, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="${rim}" fill="${P.gold}"/>` + k.sh(rim, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) + `<path d="M62 41.4L96.1 47.4" stroke="${P.ink}" stroke-width=".45"/>` +
          `<path d="${zone(86.6, 1)}" fill="${VIO}" stroke="${P.ink}" stroke-width=".45"/>` +
          `<path d="M88 47H92.8V52.6H88Z" fill="${VIOLL}"/><path d="${starPath(90.4, 49.8, 2, 0.8, 5)}" fill="${P.gold}"/><path d="M88 54.4H92.8M88 55.8H91.6" stroke="${VIOLL}" stroke-width=".4"/>` +
          `<path d="${roundRect(71.4, 45, 83.4, 51.4, 0.8)}" fill="${P.night}" stroke="${P.goldD}" stroke-width=".4"/>` +
          `<text x="77.4" y="49.9" font-family="Georgia, serif" font-weight="700" font-size="4.2" fill="${P.goldL}" text-anchor="middle">8000</text>` +
          hair(64, 53, 76, 55.6, 92, 58.6, 0.4, P.mid),
      }], 0.65) +
      // el cubo redondo atado al antebrazo
      k.draw([{
        d: hub, fill: P.gold,
        inner: k.sh(hub, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M43 30H56V56H43Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.6, 0)}"/>` +
          `<circle cx="56.6" cy="43" r="9.8" fill="${VIO}" stroke="${P.ink}" stroke-width=".45"/>` + k.sh(ellipse(56.6, 43, 9.8, 9.8), 0, 0, 1, 1, 0, 0.85, VIOD, 0.5) +
          `<circle cx="56.6" cy="43" r="7.6" fill="none" stroke="${VIOL}" stroke-width=".4" stroke-dasharray="1.6 1"/>` +
          Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * Math.PI * 2; return `<path d="M${f(56.6 + Math.cos(a) * 10.8)} ${f(43 + Math.sin(a) * 10.8)}L${f(56.6 + Math.cos(a) * 12.2)} ${f(43 + Math.sin(a) * 12.2)}" stroke="${P.goldD}" stroke-width=".45"/>` }).join(''),
      }], 0.7) +
      // el mazo en el centro del cubo
      `<path d="M52.4 46.6V39.2H60.8V46.6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/><path d="M52.4 46.6H60.8M52.4 45.6H60.8" stroke="${P.sky}" stroke-width=".4"/>` +
      `<path d="M53.2 38.4H61.6V45.4H53.2Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".45"/><path d="M54.2 39.4H60.6V44.4H54.2Z" fill="none" stroke="${P.gold}" stroke-width=".45"/><path d="${starPath(57.4, 41.9, 1.9, 0.75, 4)}" fill="${P.gold}"/>` +
      `<path d="M47 37.4C48.4 34.4 51.4 32.2 54.8 31.6" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      sparkle(32, 34, 2) + sparkle(88, 76, 1.8) +
      k.defs()
    )
  },

  // Cincuenta partidas: el faraón. La esfinge de piedra, con el pelo parado de cinco colores que no le entra en el tocado.
  'Faraón': (u) => {
    const k = kit(u)
    const body = 'M57 48C64 49.4 72 50.4 80 52C87 53.4 92 58 93 65C93.8 71 93 77 91 83H52C50 77 49 71 50 64C50.6 58 53 53 57 48Z'
    const haunch = 'M73 67C77 60.6 88 60.6 91 67C93.2 72 92 78 90.6 83H70C68.6 77.6 70 71 73 67Z'
    const hind = 'M64 79C68 78 74 78.2 77 79.4C78.8 80.2 78.8 82.8 77 83H64.4C62.8 82.6 62.8 79.4 64 79Z'
    const legFar = 'M53 69.6C47 70 40 70.6 34 71.2C31 71.6 29.6 73.6 30 75.6C30.4 77.2 32 77.8 34 77.8H53Z'
    const legNear = 'M57 72C49 73.4 41 75 32 75.8C28.4 76.2 26.6 78.4 27 80.6C27.4 82.4 29 83 31.6 83H58Z'
    const tail = 'M90.6 81C95 80.6 97.4 78 96.6 74.6C96.2 72.8 94.6 72.2 93.6 73.2C95 74.8 94.4 77.6 90.2 78.2Z'
    const nemes = 'M45.6 40C45.2 34.4 49.6 31 55 30.8C61 30.6 65.2 34.4 65.6 40C66 44.6 67.6 48.4 70.6 51.4C66.8 53.6 61.2 53.8 57.6 52.6L52.6 46.6Z'
    const lappet = 'M50.6 41.6L56.6 43L55.6 61.6C55.4 63.6 53.2 64.6 51.2 64.2L49.6 63.8Z'
    const face =
      'M47.6 38.6C46.4 39.4 45.8 40.6 45.6 42L45.2 42.8C44 44.4 43 45.8 42.6 46.8C42.4 47.4 43 47.8 43.8 48L44 49C43.6 49.6 43.8 50.2 44.4 50.4' +
      'C44.2 51.4 44.8 52.4 46 52.8C47.6 53.2 49.4 52.8 50.8 52L52.6 46.6L51.6 40Z'
    const beard = 'M45.6 52.6C45.6 55 45.8 57.4 46.4 59.6C47.4 60.4 48.6 60.4 49.6 59.8C49.4 57.4 49.6 55 50.2 52.4Z'
    const band = 'M45.6 40C45.4 38.6 45.6 37.2 46.2 36L48.4 36.8C48 38 47.8 39.4 48 40.8Z'
    const stone = (d: string, extra = '') => ({ d, fill: P.sky1, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) + extra })
    const stripes = Array.from({ length: 6 }, (_, i) => `<path d="M${f(48 + i * 3.4)} 30C${f(50 + i * 3.6)} 38 ${f(54 + i * 3.6)} 46 ${f(58 + i * 3.4)} 54" fill="none" stroke="${i % 2 ? P.gold : VIO}" stroke-width="1.6"/>`).join('')
    // El pelo: una mata negra que no entra en el tocado, con cinco puntas de color, y el flequillo dorado.
    const c = { x: 55.9, y: 35.6 }, pt = (deg: number, r: number) => ({ x: c.x + Math.cos((deg * Math.PI) / 180) * r, y: c.y + Math.sin((deg * Math.PI) / 180) * r })
    const tips: [number, string][] = [[-170, P.sky], [-26, P.sky], [-134, P.red], [-62, P.red], [-98, VIO]]
    const spikes = tips.map(([a, col]) => {
      const b0 = pt(a - 22, 8.4), b1 = pt(a + 22, 8.4), t = pt(a + 6, 22.4), m0 = pt(a - 8, 15.6), m1 = pt(a + 14, 14.4)
      const d = `M${f(b0.x)} ${f(b0.y)}Q${f(m0.x)} ${f(m0.y)} ${f(t.x)} ${f(t.y)}Q${f(m1.x)} ${f(m1.y)} ${f(b1.x)} ${f(b1.y)}L${f(c.x)} ${f(c.y)}Z`
      const cut0 = pt(a - 30, 13.4), cut1 = pt(a + 34, 13)
      const tip = `M${f(cut0.x)} ${f(cut0.y)}Q${f(pt(a, 12.6).x)} ${f(pt(a, 12.6).y)} ${f(cut1.x)} ${f(cut1.y)}L${f(pt(a + 6, 27).x)} ${f(pt(a + 6, 27).y)}Z`
      const g0 = pt(a - 6, 10), g1 = pt(a + 1, 16.6), g2 = pt(a + 4, 20.6)
      return { d, fill: P.night, line: 0.3, inner: `<path d="${tip}" fill="${col}"/>` + k.sh(d, 0, 0, 1, 1, 0, 0.7, '#0F1736', 0.4) + hair(f(g0.x), f(g0.y), f(g1.x), f(g1.y), f(g2.x), f(g2.y), 0.45, '#fff', 0.55) }
    })
    const dome = 'M46 37.6C46 31 50.4 26.4 56 26.4C61.6 26.4 66 31 66 37.8C62 36.2 58 35.8 55.4 36.4C52 36.4 48.6 36.8 46 37.6Z'
    const bangs = ['M49 36.2C47.2 37.4 46 39 45.8 40.8L44.8 40.4C44 41.6 43.8 43 44.2 44.2C42.6 43 42.2 40.8 43 39C43.8 37.2 46.2 36 49 36.2Z', 'M51.4 36.6C50.2 39 50.2 41.2 51.2 43.2L49.6 43C49.4 45.2 50 47.2 51.2 48.8C48.6 48 47.4 45.6 47.6 42.8C47.8 40 49.2 37.8 51.4 36.6Z', 'M54.8 36.8C54 39.2 54.2 41.4 55.4 43.4L54 43.4C53.8 45.4 54.4 47.2 55.4 48.6C53.2 47.8 52 45.6 52 43C52.2 40.2 53.2 38 54.8 36.8Z']
    return (
      k.day() +
      k.sun(56, 48, 14, 47, 32, false) +
      k.shade(ellipse(56, 44, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      `<path d="M14 84C30 82 44 83.4 60 83C76 82.6 90 83.8 106 82.6V130H14Z" fill="${P.goldL}"/>` + k.sh('M14 82H106V104H14Z', 0, 0, 0, 1, 0, 0.8, P.goldD, 0.4) +
      hair(30, 88, 40, 86.6, 50, 87.6, 0.45, P.goldD) + hair(64, 89, 74, 87.6, 86, 88.4, 0.45, P.goldD) + hair(44, 93, 54, 92, 62, 93, 0.4, P.goldD) +
      k.floor(60, 83.6, 32, 2.2, P.brownD) +
      `<g transform="translate(60 84) scale(.84) translate(-60 -84)">` +
      k.cast([body, legNear], 2.2, 1.6) +
      k.draw([
        stone(tail),
        stone(legFar, k.sh(legFar, 0, 0, 0, 1, 0, 0.6, P.mid, 0.4)),
        stone(body, `<path d="M50 50H68V83H50Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` + hair(60, 56, 66, 54, 72, 55, 0.45, P.blue) + hair(62, 62, 66, 66, 64, 72, 0.45, P.blue) + hair(80, 54.6, 84, 56, 86, 59, 0.4, P.blue) +
          `<path d="M54 60H92M51 70H72M58 78H70" stroke="${P.sky2}" stroke-width=".45" stroke-dasharray="7 1.4 11 1.4"/>`),
        stone(haunch, hair(76, 66, 84, 63, 90, 68, 0.5, P.blue) + hair(74, 74, 78, 70, 84, 70, 0.4, P.blue)),
        stone(hind, `<path d="M66.6 80V83M69.6 80V83" stroke="${P.blue}" stroke-width=".4"/>`),
        stone(legNear, hair(40, 77.4, 48, 76, 56, 76.6, 0.45, P.blue) + `<path d="M29.6 80.4C30.6 80.4 31 81.4 30.6 83M32.8 79.6C33.8 79.8 34.2 81 33.8 83M36 79.4C37 79.6 37.4 81 37 83" fill="none" stroke="${P.blue}" stroke-width=".45"/>`),
      ], 0.7) +
      `<g transform="translate(52 52) scale(1.14) translate(-52 -52)">` +
      k.cast([nemes], 1.6, 1.4) +
      k.draw([{ d: nemes, fill: P.gold, inner: stripes + k.sh(nemes, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) }], 0.65) +
      k.draw([...spikes, { d: dome, fill: P.night, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.7, '#0F1736', 0.4) + hair(49, 33, 52, 28.6, 57, 27.6, 0.55, '#fff', 0.5) + hair(56, 34, 60, 30, 63, 31.6, 0.4, VIOL, 0.6) }], 0.6) +
      k.draw([
        { d: lappet, fill: P.gold, inner: k.sh(lappet, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) + Array.from({ length: 7 }, (_, i) => `<path d="M48 ${f(45 + i * 2.7)}L58 ${f(46.6 + i * 2.7)}" stroke="${VIO}" stroke-width="1.2"/>`).join('') },
        stone(face, k.sh(face, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3)),
        stone(beard, `<path d="M45.6 54.4H50M45.8 56.4H49.8M46 58.4H49.6" stroke="${P.blue}" stroke-width=".4"/>`),
        { d: band, fill: P.gold, inner: k.sh(band, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) },
      ], 0.65) +
      k.draw(bangs.map((d) => ({ d, fill: '#FBE7B0', line: 0.25, inner: k.sh(d, 0, 0, 1, 1, 0.2, 0.9, P.gold, 0.5) })), 0.45) +
      // ojo de perfil a la egipcia (almendra con el delineado hacia atrás) y el ureo en la frente
      `<path d="M45.8 43.4C46.6 42.6 48 42.6 48.8 43.4C48 44 46.6 44 45.8 43.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="47" cy="43.4" r=".5" fill="${P.ink}"/><path d="M48.8 43.4L50.8 43" stroke="${P.ink}" stroke-width=".5" stroke-linecap="round"/>` +
      `<path d="M45.6 41.6C46.6 41 48 41 49 41.6" fill="none" stroke="${P.blue}" stroke-width=".5"/><path d="M44.2 48.4H45.4" stroke="${P.blue}" stroke-width=".4"/>` +
      `<path d="M46.8 36.4C46.2 34.6 46.6 33 47.6 32.4C48.6 33 48.8 34.6 48 36.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g></g>` +
      sparkle(88, 34, 2.4) + sparkle(30, 56, 1.6) + sparkle(78, 22, 1.4) +
      k.defs()
    )
  },

  // Primer OTK: el mago de confianza hizo el trabajo. El báculo con el orbe todavía humeando, como un revólver.
  'Mago Oscuro': (u) => {
    const k = kit(u)
    const shaft = 'M-2 -24H2L2.5 48H-2.5Z'
    const collar = roundRect(-4, -27.6, 4, -21.4, 1.2)
    const grip = roundRect(-2.9, -2, 2.9, 15, 0.6)
    const ring = (y: number) => roundRect(-3.4, y, 3.4, f(y + 2.4), 0.8)
    const prong = 'M-2.6 -26.6C-8.8 -28.4 -11.6 -33.4 -10.6 -38.6C-10 -41.8 -7.8 -44.6 -4.6 -46C-6.8 -43 -7.6 -39.8 -7.2 -36.6C-6.8 -32.6 -4.6 -30 -1 -28.6Z'
    const fin = 'M0 -27C-1.4 -24.6 -1.4 -22 0 -19.6C1.4 -22 1.4 -24.6 0 -27Z'
    const orb = ellipse(0, -36.4, 7.6, 7.6)
    const wrap = Array.from({ length: 9 }, (_, i) => `M-2.9 ${f(-1.4 + i * 1.9)}L2.9 ${f(0 + i * 1.9)}`).join('')
    const smoke = (d: string, w: number) => `<path d="${d}" fill="none" stroke="${P.paper}" stroke-width="${w}" stroke-linecap="round" opacity=".22"/><path d="${d}" fill="none" stroke="${P.paper}" stroke-width="${f(w * 0.45)}" stroke-linecap="round" opacity=".35"/>`
    const w1 = 'M63.4 31C59.6 28.4 64.4 25.4 61.4 22.4C59.6 20.6 57 21 55.6 19.6'
    const w2 = 'M66.4 31.4C69.6 28.8 66.8 26 69 23.4'
    const crack = (x: number, y: number, r: number) => `<path d="M0 0L2.4 1.6L1.6 3.2L4.4 5.6" transform="translate(${x} ${y}) rotate(${r})" fill="none" stroke="${VIOLL}" stroke-width=".7" stroke-linejoin="round" stroke-linecap="round"/>`
    return (
      k.night() +
      [[30, 36], [86, 34], [26, 70], [93, 80], [42, 26], [82, 92], [36, 88], [92, 56], [78, 24]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(62, 42, 28, 28), k.rad(VIOL, 0.5, 0.5, 0.5, 0.9, 0), VIO, 0.55) +
      `<circle cx="62" cy="40.6" r="14.4" fill="none" stroke="${VIOL}" stroke-width=".6" stroke-dasharray=".01 1.8" stroke-linecap="round"/>` +
      `<circle cx="62" cy="40.6" r="17.6" fill="none" stroke="${VIOL}" stroke-width=".4" stroke-dasharray="4 2.4" opacity=".6"/>` +
      // el humo que sale del orbe, como del caño de un revólver
      smoke(w1, 5) + smoke(w2, 3.6) + hair(63.4, 31, 59.4, 27, 62, 24.4, 0.6, P.paper, 0.8) + hair(62, 24.4, 61.4, 21, 56, 19.8, 0.5, P.paper, 0.7) + hair(66.4, 31.4, 69.8, 28.4, 68.4, 25.4, 0.5, P.paper, 0.7) +
      `<g transform="translate(49.4 82.1) rotate(16.7) scale(1.22)">` +
      k.cast([shaft, orb], 1.8, 1.4, '#0F1736') +
      k.draw([
        { d: shaft, fill: P.brownD, inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + `<path d="M-2 -24H-.6V48H-2.5Z" fill="${P.brown}"/>` + Array.from({ length: 12 }, (_, i) => hair(-2.4, -18 + i * 5.6, 0, -16.6 + i * 5.6, 2.4, -15.4 + i * 5.6, 0.4, P.night)).join('') },
        { d: grip, fill: VIO, line: 0.25, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.8, VIOD, 0.5) + `<path d="${wrap}" stroke="${VIOD}" stroke-width=".55"/><path d="${wrap}" stroke="${VIOL}" stroke-width=".25" transform="translate(0 -.5)"/>` },
        { d: ring(-4.4), fill: P.gold, inner: k.sh(ring(-4.4), 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) },
        { d: ring(15), fill: P.gold, inner: k.sh(ring(15), 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) },
        { d: prong, fill: P.gold, inner: k.sh(prong, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + hair(-3.4, -28.6, -8.8, -32, -7.6, -40.6, 0.4, P.goldL) },
        { d: prong, t: 'scale(-1 1)', fill: P.gold, inner: k.sh(prong, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.55) },
        { d: collar, fill: P.gold, line: 0.3, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) + `<path d="M-4 -24.4H4" stroke="${P.goldD}" stroke-width=".4"/>` },
      ], 0.62) +
      `<path d="${fin}" fill="${VIO}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="-7.4" cy="-45.4" r="1.1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/><circle cx="7.4" cy="-45.4" r="1.1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([{
        d: orb, fill: VIO,
        inner: `<circle cx="0" cy="-36.4" r="7.6" fill="${k.rad(VIOLL, 0.35, 0.3, 0.6, 0.9, 0)}"/>` + k.sh(orb, 0, 0, 1, 1, 0, 0.9, VIOD, 0.5) +
          hair(-4.4, -36, -1, -41, 3.4, -37.4, 0.55, VIOLL, 0.85) + hair(-2.6, -32, 2, -30.6, 5, -34.6, 0.5, VIOLL, 0.75) + hair(-1, -38.4, 1.6, -36, 0, -33.6, 0.4, '#fff', 0.7),
      }], 0.55) +
      `<path d="M-4.8 -39.8C-3.8 -41.8 -1.8 -42.8 0 -42.8" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` +
      `</g>` +
      crack(72, 36, -20) + crack(50, 44, 160) + crack(73, 48, 30) +
      sparkle(84, 46, 2.4, VIOLL) + sparkle(44, 34, 1.8, P.paper) + sparkle(40, 60, 1.4, VIOLL) +
      k.defs()
    )
  },

  // Cinco OTK: el dragón blanco de ojos azules levanta la cabeza y suelta la ráfaga. Y a otra cosa.
  'Dragón Blanco de Ojos Azules': (u) => {
    const k = kit(u)
    const skull =
      'M-14 -6C-12 -10 -8 -12.6 -3 -13.4C2 -14.2 6 -13.2 8.6 -10.6C12 -9.8 16 -9.6 19.4 -10.4C21.4 -12 23.6 -12.6 25.2 -11.4C26.6 -10.4 26.8 -8.4 26 -6.8' +
      'C25.4 -5.6 25.6 -4.2 24.6 -3.4C20 -2.6 12 -1.6 6 -.6C3.4 -.2 1.4 .6 0 1.8C-3 3.6 -6 5.2 -9.6 5.6C-13 4 -15.2 -1 -14 -6Z'
    const jaw = 'M0 3C4 5.6 10 8.6 16 11.4C18 12.4 20 12.8 21.6 12.8C23 13 23.4 14.6 22.2 15.4C18 17.6 11 17.6 5 16.4C0 15.4 -4 13.4 -7 10.6C-5 7.6 -2.6 4.8 0 3Z'
    const mouth = 'M24.6 -3.2C18 -2.4 11 -1.4 6 -.4C3.4 .2 1.4 1 0 2.2C4 5 10 8.2 16 11C18 12 20 12.6 21.6 12.8C21.6 7 22.6 1.6 24.6 -3.2Z'
    const hornA = 'M2 -13.6C-1 -18 -4 -22 -6 -27C-6.6 -28.6 -7.4 -30 -8.4 -31C-9.6 -26 -9.6 -21 -8.4 -16.8C-7.8 -14.6 -7 -13 -6 -11.6Z'
    const hornB = 'M-8 -10.4C-11 -13.6 -14.4 -17.6 -17.4 -22C-17.6 -17 -16.4 -11 -13 -5.6Z'
    const frills = ['M-9 4C-14 5 -19 7.6 -23 11C-18 10.6 -13 9.6 -8.4 8Z', 'M-6 9C-10 12 -13 15.6 -15 20.4C-11 18.4 -7 15.4 -4 12Z']
    const neck = 'M-12 -4C-20 0 -27 9 -31 22L-35 48H-3C-5 34 -3 22 2 13C-2 10 -6 7 -8 4Z'
    const brow = 'M-4 -12C1 -13.8 6 -13 9.4 -10.4C5.6 -9.6 2 -9 -1.6 -7.6Z'
    const spikes = Array.from({ length: 6 }, (_, i) => {
      const t = i / 5, x = -13 - t * 19, y = -3 + t * 40, s = 1 - t * 0.25
      return `<path d="M0 0L-6 -3L-1.8 3Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(-10 + t * 30)}) scale(${f(s)})"/>`
    }).join('')
    const plates = Array.from({ length: 6 }, (_, i) => { const t = i / 5, y = 16 + t * 30, x0 = 0 - t * 4; return `<path d="M${f(x0)} ${f(y)}Q${f(x0 - 4)} ${f(y + 2.2)} ${f(x0 - 8.4)} ${f(y + 1)}" fill="none" stroke="${P.blue}" stroke-width=".5"/>` }).join('')
    const scales = Array.from({ length: 9 }, (_, i) => { const r = Math.floor(i / 3), c = i % 3, x = -15 - c * 5.4 - r * 3, y = 12 + r * 9 + c * 1.4; return `<path d="M${f(x)} ${f(y)}q1.6 1.8 3.4 0" fill="none" stroke="${P.sky}" stroke-width=".5"/>` }).join('')
    const teeth =
      Array.from({ length: 5 }, (_, i) => { const t = i / 4, x = 23.4 - t * 15, y = -3 + t * 2.4, l = i === 0 ? 3.8 : 2.4; return `M${f(x)} ${f(y)}L${f(x - 0.9)} ${f(y + l)}L${f(x - 2)} ${f(y + 0.3)}Z` }).join('') +
      Array.from({ length: 4 }, (_, i) => { const t = i / 3, x = 20.6 - t * 12, y = 12.6 - t * 4, l = i === 0 ? 3.6 : 2.2; return `M${f(x)} ${f(y)}L${f(x - 0.9)} ${f(y - l)}L${f(x - 2)} ${f(y - 0.4)}Z` }).join('')
    const blast = 'M0 -2.6C20 -6 44 -12 76 -24C80 -10 80 10 76 24C44 12 20 6 0 2.6Z'
    const core = 'M0 -1.4C20 -3 44 -6 76 -11C78 -4 78 4 76 11C44 6 20 3 0 1.4Z'
    const white = (d: string) => ({ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0.1, 0.7, P.sky2, 0.35) })
    return (
      k.day() +
      k.sun(58, 58, 14, 48, 32, false) +
      k.shade(ellipse(76, 40, 22, 22), k.rad(P.white, 0.5, 0.5, 0.5, 0.95, 0), P.sky1, 0.5) +
      `<g transform="translate(50 75) rotate(-40)">` +
      // la ráfaga, de la boca hacia el cielo
      `<g transform="translate(14 4.6) rotate(5)">` +
      `<path d="${blast}" fill="${P.sky}"/>` + k.shade(blast, k.lin(P.blue, 0, 0, 0, 1, 0.8, 0.8), P.blue, 0.3) +
      `<path d="${core}" fill="${P.white}"/><path d="M0 -.6C30 -1.6 60 -3 76 -4V4C60 3 30 1.6 0 .6Z" fill="#fff"/>` +
      hair(8, -3, 36, -9, 72, -20, 0.8, P.mid) + hair(8, 3, 36, 9, 72, 20, 0.8, P.mid) +
      hair(14, -1.6, 40, -6, 70, -14, 0.5, P.sky) + hair(14, 1.6, 40, 6, 70, 14, 0.5, P.sky) + hair(30, -4, 46, 0, 64, -6, 0.45, P.sky) + hair(36, 5, 52, 1, 70, 7, 0.45, P.sky) +
      `</g>` +
      `<g fill="${P.sky1}" stroke="${P.ink}" stroke-width=".55" stroke-linejoin="round">${spikes}</g>` +
      k.draw([
        { d: hornB, fill: P.sky1, inner: k.sh(hornB, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + hair(-10.6, -9.6, -14, -14, -16.4, -19, 0.4, P.blue) },
        { d: neck, fill: P.white, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.8, P.blue, 0.35) + `<path d="M2 13C-3 22 -5 34 -3 48H-11C-12 34 -9 22 -3 13Z" fill="${P.sky1}"/>` + plates + scales },
        ...frills.map((d) => ({ d, fill: P.sky1, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) })),
        { d: hornA, fill: P.white, inner: k.sh(hornA, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + hair(-1, -15, -4.6, -21, -7.6, -28, 0.4, P.blue) + `<path d="M-2.4 -15L-7.4 -14M-4.4 -19L-8.6 -18.4M-6 -23L-9.2 -22.6" stroke="${P.blue}" stroke-width=".4"/>` },
        white(jaw),
      ], 0.7) +
      `<path d="${mouth}" fill="${P.sky}"/>` + k.shade(mouth, k.lin(P.white, 0, 0, 1, 0, 0.2, 1), P.white, 0.6) +
      `<path d="${teeth}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3" stroke-linejoin="round"/>` +
      k.draw([{
        d: skull, fill: P.white,
        inner: k.sh(skull, 0, 0, 0, 1, 0.1, 0.75, P.blue, 0.35) + `<path d="M-16 -16H28V-8C14 -10 0 -10 -16 -6Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.8, 0)}"/>` +
          hair(8, -2.4, 15, -3.6, 22, -4.4, 0.45, P.blue) + hair(-10, 1.4, -6, -1, -1, -1.6, 0.4, P.blue) + hair(11, -8, 15, -7.4, 19, -7.8, 0.35, P.blue),
      }], 0.7) +
      k.draw([{ d: brow, fill: P.sky, inner: k.sh(brow, 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) }], 0.4) +
      `<path d="M22.6 -9.2c.6 -.7 1.6 -.8 2.2 -.2" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      `<g transform="rotate(-8 3.4 -9)"><ellipse cx="3.4" cy="-9" rx="2.9" ry="1.5" fill="${P.sky}" stroke="${P.ink}" stroke-width=".5"/><circle cx="3.4" cy="-9" r="1.25" fill="${P.blue}"/><path d="M3.4 -10.3V-7.7" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/><circle cx="2.6" cy="-9.6" r=".38" fill="#fff"/></g>` +
      `</g>` +
      sparkle(66.6, 52, 3.6, '#fff') + sparkle(32, 40, 1.8) + sparkle(88, 84, 1.6) +
      k.defs()
    )
  },

  // Quince OTK: un dios egipcio dorado baja a la mesa del living. El sol alado, sobre la mesita ratona con la carpetita.
  'Dragón Alado de Ra': (u) => {
    const k = kit(u)
    const cx = 60, cy = 49
    const feather = (L: number, h: number) => `M0 ${f(-h / 2)}L${f(L - h)} ${f(-h / 2)}Q${L} ${f(-h / 2)} ${L} 0Q${L} ${f(h / 2)} ${f(L - h)} ${f(h / 2)}L0 ${f(h / 2)}Z`
    const coverts = 'M-5 -9.8C-12 -11.6 -20 -11.4 -27.6 -9.8C-29.2 -9.4 -29.4 -7.4 -27.8 -6.8C-20 -5.4 -12 -3.8 -5.6 -1Z'
    const scales = Array.from({ length: 2 }, (_, r) => Array.from({ length: 8 - r * 2 }, (_, j) => { const x = -8 - j * 2.7 - r * 1.4, y = -9.6 + r * 2.2 + j * 0.1 + (r ? j * 0.25 : 0); return `M${f(x)} ${f(y)}a1.35 1.35 0 0 0 -2.7 0` }).join('')).join('')
    const wing = (flip: boolean) => {
      let out = ''
      for (let i = 6; i >= 0; i--) {
        const L = 28 - i * 2, h = 4.2, a = 188 - i * 5.4
        const d = feather(L, h)
        const barbs = Array.from({ length: Math.floor((L - 6) / 2.4) }, (_, j) => `M${f(5 + j * 2.4)} -.3L${f(6.8 + j * 2.4)} ${f(-h / 2 + 0.4)}M${f(5 + j * 2.4)} .3L${f(6.8 + j * 2.4)} ${f(h / 2 - 0.4)}`).join('')
        out += `<g transform="translate(-5 ${f(-6.6 + i * 2.2)}) rotate(${f(a)})">` +
          k.draw([{ d, fill: i % 2 ? P.gold : P.goldL, inner: k.sh(d, 0, 1, 0, 0, 0, 0.75, P.goldD, 0.45) + `<path d="${barbs}" stroke="${P.goldD}" stroke-width=".3"/><path d="M3 0H${f(L - 1.6)}" stroke="${P.goldD}" stroke-width=".5"/>` + `<path d="M${f(L - 9)} ${f(-h / 2)}H${L}V${f(h / 2)}H${f(L - 9)}Z" fill="${VIO}" opacity="${i % 2 ? 0 : 0.85}"/>` }], 0.42) +
          `</g>`
      }
      return `<g transform="translate(${cx} ${cy})${flip ? ' scale(-1 1)' : ''}">` + out +
        k.draw([{ d: coverts, fill: VIO, inner: k.sh(coverts, 0, 0, 0, 1, 0, 0.8, VIOD, 0.5) + `<path d="${scales}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` + `<path d="M-27.8 -6.8C-20 -5.4 -12 -3.8 -5.6 -1" fill="none" stroke="${P.gold}" stroke-width=".9"/>` }], 0.5) +
        `</g>`
    }
    const disk = ellipse(cx, cy, 9, 9)
    const light = `M${cx - 6} ${cy + 8}L${cx + 6} ${cy + 8}L82 84H38Z`
    const top = 'M40 81C40 78.8 49 77.4 60 77.4C71 77.4 80 78.8 80 81C80 83.2 71 84.6 60 84.6C49 84.6 40 83.2 40 81Z'
    const apron = 'M40 81C40 83.2 49 84.6 60 84.6C71 84.6 80 83.2 80 81V83.8C80 86 71 87.4 60 87.4C49 87.4 40 86 40 83.8Z'
    const leg = 'M-1.2 0H1.2C1.6 2 1 4 1.4 6C1.8 7.6 1.4 8.6 0 8.6C-1.4 8.6 -1.8 7.6 -1.4 6C-1 4 -1.6 2 -1.2 0Z'
    let doily = ''
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; doily += `<circle cx="${f(60 + Math.cos(a) * 12.6)}" cy="${f(80.2 + Math.sin(a) * 2.3)}" r=".95" fill="${P.white}" stroke="${P.sky2}" stroke-width=".25"/>` }
    return (
      k.day() +
      k.sun(cx, cy, 12, 48, 32, false) +
      k.shade(ellipse(cx, cy, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.5) +
      `<path d="${light}" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.9, 0.2)}"/>` + k.shade(light, k.lin(P.gold, 0, 0, 0, 1, 0.5, 0), P.gold, 0.2) +
      // la mesita ratona del living con la carpetita al crochet y una carta
      k.floor(60, 94, 20, 2.4, P.mid) +
      [[45, 86], [75, 86], [56, 87.6], [65, 87.6]].map(([x, y], i) => `<g transform="translate(${x} ${y})${i > 1 ? ' scale(.9)' : ''}">` + k.draw([{ d: leg, fill: i > 1 ? P.brownD : P.brown }], 0.4) + `</g>`).join('') +
      k.draw([
        { d: apron, fill: P.brownD, inner: k.sh(apron, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
        { d: top, fill: P.brown, inner: k.sh(top, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + hair(44, 81, 52, 79.6, 60, 79.4, 0.4, P.goldL, 0.7) },
      ], 0.6) +
      `<ellipse cx="60" cy="80.2" rx="12.6" ry="2.3" fill="${P.white}"/>` + doily +
      `<ellipse cx="60" cy="80.2" rx="9.8" ry="1.6" fill="none" stroke="${P.sky2}" stroke-width=".35" stroke-dasharray=".8 .6"/>` +
      `<path d="M55.4 80.8L58.6 78.6H65.2L62 80.8Z" fill="${VIO}" stroke="${P.ink}" stroke-width=".35"/><path d="M57.2 80.2L59.2 79.1H63L61 80.2Z" fill="${VIOLL}"/>` +
      // el sol alado, con sus cobras
      wing(false) + wing(true) +
      k.draw([{
        d: disk, fill: P.gold,
        inner: k.sh(disk, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<circle cx="${cx}" cy="${cy}" r="6.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` + k.sh(ellipse(cx, cy, 6.4, 6.4), 0, 0, 1, 1, 0, 0.9, P.wine, 0.45) +
          `<circle cx="${cx}" cy="${cy}" r="7.7" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.3" stroke-linecap="round"/>`,
      }], 0.7) +
      `<path d="M55.6 46.4C56.6 44.6 58.4 43.6 60.2 43.6" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` +
      sparkle(60, 30, 3.2, '#fff') + sparkle(30, 70, 1.8) + sparkle(90, 70, 1.8) +
      k.defs()
    )
  },

  // Primer Exodia: las cinco piezas juntas, que nadie te creía. Cinco cartas en las puntas de la estrella, como un cuerpo.
  'Las cinco piezas': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58, R = 24
    const V = Array.from({ length: 5 }, (_, i) => { const a = ((-90 + i * 72) * Math.PI) / 180; return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R } })
    const star = [0, 2, 4, 1, 3].map((j, i) => `${i ? 'L' : 'M'}${f(V[j].x)} ${f(V[j].y)}`).join('') + 'Z'
    const stoneFill = (d: string, band: string) =>
      `<path d="${d}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/>` + k.clip(d, k.sh(d, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45)) + band
    const head = stoneFill(STONE_PIECES.head, `<path d="M-4.6 -1.4H4.6M-4.8 .8H4.8" stroke="${P.blue}" stroke-width=".5"/><path d="M-2.8 -2.6H2.8V3.4H-2.8Z" fill="${P.night}"/><circle cx="0" cy="-5.2" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`)
    const arm = stoneFill(STONE_PIECES.arm, `<path d="M-2.9 -.4H2.9V1.4H-2.9Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M-2.6 -8.4V-5.4M0 -8.6V-5.2M2.6 -8.4V-5.4" stroke="${P.blue}" stroke-width=".45"/><path d="M-4.6 -4.4C-2 -3.4 1 -3.4 3.4 -4.8" fill="none" stroke="${P.blue}" stroke-width=".45"/>`)
    const leg = stoneFill(STONE_PIECES.leg, `<path d="M-3 -2.8H3V-1H-3Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`)
    const cards: [number, number, string][] = [[0, 0, head], [1, 12, arm], [2, 6, leg], [3, -6, leg], [4, -12, arm]]
    return (
      k.night() +
      [[30, 36], [88, 32], [26, 80], [93, 84], [44, 22], [78, 24], [60, 94]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(cx, cy, 32, 32), k.rad(VIOL, 0.5, 0.5, 0.5, 0.9, 0), VIO, 0.5) +
      burst(k, cx, cy, 8, 40, 24, VIOL) +
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.ink}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.gold}" stroke-width="1"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${R - 2.2}" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray=".01 1.5" stroke-linecap="round"/>` +
      `<path d="${star}" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linejoin="round"/><path d="${star}" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linejoin="round"/><path d="${star}" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-linejoin="round" transform="translate(-.3 -.3)"/>` +
      cards.map(([j, r, art]) => `<g transform="translate(${f(V[j].x)} ${f(V[j].y)}) rotate(${j === 1 || j === 2 ? r : r}) ${j === 1 || j === 2 ? 'scale(-1 1)' : ''}">` + k.cast([roundRect(-8, -11, 8, 11, 1.2)], 1.6, 1.4, '#0F1736') + relicCard(k, art) + `</g>`).join('') +
      sparkle(cx, cy, 3.4, '#fff') + sparkle(88, 76, 2, VIOLL) + sparkle(32, 76, 1.6, VIOLL) +
      k.defs()
    )
  },

  // Tres Exodias: el abuelo te mira desde el mostrador de la tienda y sonríe. Su pulgar arriba, detrás de la vitrina.
  'Abuelito orgulloso': (u) => {
    const k = kit(u)
    const sleeve = 'M47 66C51 64.4 66 64.4 70.4 66L72.6 78H44.6Z'
    const counterTop = 'M14 73.4H106V78.2H14Z'
    const front = 'M16 78.2H104V104H16Z'
    const glass = 'M22 81H98V104H22Z'
    const bell = 'M78 72.6C78 68.8 80.8 66.4 84 66.4C87.2 66.4 90 68.8 90 72.6Z'
    return (
      k.day() +
      k.sun(60, 50, 15, 46, 32, false) +
      k.shade(ellipse(60, 48, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      k.cast([sleeve], 2, 1.6) +
      k.draw([{ d: sleeve, fill: VIO, inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.85, VIOD, 0.5) + Array.from({ length: 7 }, (_, i) => `<path d="M${f(48 + i * 3.6)} 66V78" stroke="${VIOD}" stroke-width=".5"/>`).join('') + `<path d="M46 67.6C52 66.4 65 66.4 71 67.6" fill="none" stroke="${VIOL}" stroke-width="1.2"/>` }], 0.65) +
      `<g transform="translate(58.6 66) scale(1.12)">` + k.cast(['M-9.4 -20C-10.4 -14 -10 -7 -8.6 0H8.2C9.4 -6 9.8 -13 9 -20ZM-8.6 -18.4C-9.4 -24 -9 -30 -7.6 -35.6C-6.6 -39.6 -1.6 -40 -.6 -36L-.4 -21.6ZM-4 -22.4H14.6V-2.6H-4Z'], 1.8, 1.4) + thumbsUp(k) + `</g>` +
      hair(43, 34, 44.4, 30, 47.2, 27, 0.6) + hair(73, 34, 71.6, 30, 68.8, 27, 0.6) + hair(40, 40, 38, 38, 36.4, 35, 0.45) + hair(76, 40, 78, 38, 79.6, 35, 0.45) +
      // el mostrador con la vitrina y el timbre
      k.draw([
        { d: front, fill: P.brown, inner: k.sh(front, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) },
        { d: counterTop, fill: P.brown, inner: `<path d="M14 73.4H106V75H14Z" fill="${P.goldL}" opacity=".6"/>` + hair(20, 76, 40, 75.4, 60, 76.4, 0.4, P.brownD) + hair(64, 76.2, 80, 75.6, 100, 76.4, 0.4, P.brownD) },
      ], 0.7) +
      `<path d="${glass}" fill="${P.sky1}"/>` + k.clip(glass,
        `<path d="M22 92H98V104H22Z" fill="${VIOD}"/>` +
        [[34, -8], [46, 4], [58, -4], [70, 6], [82, -6]].map(([x, r]) => `<g transform="translate(${x} 93) rotate(${r})"><path d="${roundRect(-3.6, -10, 3.6, 0, 0.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><path d="M-2.6 -9H2.6V-4.4H-2.6Z" fill="${VIOL}"/></g>`).join('') +
        k.sh(glass, 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) +
        `<path d="M26 81L18 104H24L32 81ZM36 81L28 104H30.6L38.6 81Z" fill="#fff" opacity=".7"/>`) +
      `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      k.draw([{ d: bell, fill: P.gold, inner: k.sh(bell, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }, { d: roundRect(76.6, 72.4, 91.4, 74, 0.6), fill: P.goldD }], 0.5) +
      `<path d="M84 66.4V64.2" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><circle cx="84" cy="64" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M80.6 70C81 68.6 82 67.8 83 67.6" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` +
      sparkle(86, 34, 2.2) + sparkle(32, 54, 1.6) +
      k.defs()
    )
  },

  // Seis Exodias: gritás la frase y los vecinos golpean la pared. El puño de piedra encadenado atraviesa el muro.
  '¡Exodia, oblitéralo!': (u) => {
    const k = kit(u)
    const hole = 'M60 27L67 34L77 30L79 40L90 44L84 54L92 62L82 67L85 79L73 77L67 87L58 81L48 87L45 77L34 78L37 67L28 60L37 52L31 43L42 40L44 30L53 34Z'
    let bricks = ''
    for (let r = 0; r < 17; r++) {
      const y = r * 7.4
      bricks += `M0 ${f(y)}H120`
      for (let c = 0; c < 10; c++) { const x = (r % 2 ? 6.5 : 0) + c * 13; bricks += `M${x} ${f(y)}V${f(y + 7.4)}` }
    }
    const fing: [number, number, number, number][] = [[-17.4, -8.6, -15, 2], [-8.6, 0.4, -16.8, 3], [0.4, 8.8, -16, 2.4], [8.8, 15.6, -13.6, 0.8]]
    const finger = ([x0, x1, t, b]: [number, number, number, number]) => roundRect(x0, t, x1, b, 3.4)
    const heel = 'M-17 1C-17.6 7 -14 13 -6 14.8C2 16.4 11 14 15.6 7.6L16 0Z'
    const thumb = 'M-19.6 3.4C-19.6 .4 -17 -1.6 -13 -1.4L2.4 -.4C5.4 -.2 7 1.8 6.8 4C6.6 6.4 4.4 7.6 1.8 7.4L-14 6.8C-17.6 6.6 -19.6 5.6 -19.6 3.4Z'
    const cuff = 'M-13.4 13.6C-6 17 6 17 13.4 13.6L13.8 20.6C6 24.4 -6 24.4 -13.8 20.6Z'
    const stone = (d: string, extra = '') => ({ d, fill: P.sky1, line: 0.35, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) + extra })
    const link = (x: number, y: number, r: number, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="${roundRect(-3.6, -1.9, 3.6, 1.9, 1.9)}" fill="none" stroke="${P.ink}" stroke-width="2.1"/><path d="${roundRect(-3.6, -1.9, 3.6, 1.9, 1.9)}" fill="none" stroke="${P.gold}" stroke-width="1.05"/><path d="M-2.4 -1.6H1.6" stroke="${P.goldL}" stroke-width=".4"/></g>`
    const chip = (x: number, y: number, r: number, s: number) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d: 'M-4 -2.4L3.6 -2.8L4.2 2.2L-3.6 2.8Z', fill: P.red, inner: k.sh('M-4 -2.4L3.6 -2.8L4.2 2.2L-3.6 2.8Z', 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + `<path d="M-4 -.4H4" stroke="${P.paper}" stroke-width=".5" opacity=".6"/>` }], 0.5 / s) + `</g>`
    const cracks = [[28, 60, 18, 62, 10, 58], [90, 44, 98, 40, 108, 42], [85, 79, 90, 86, 94, 96], [44, 30, 42, 22, 44, 14], [34, 78, 28, 84, 24, 92], [77, 30, 80, 24, 86, 20]]
    return (
      `<rect width="120" height="130" fill="${P.paper}"/>` +
      `<path d="${bricks}" stroke="${P.sky2}" stroke-width=".6"/>` + k.shade('M0 0H120V130H0Z', k.rad(P.sky2, 0.5, 0.46, 0.7, 0, 1), '#9EB1DB', 0.5) +
      // el agujero en la pared del vecino: los ladrillos rotos alrededor y la luz violeta adentro
      `<g transform="translate(60 57) scale(1.16) translate(-60 -57)"><path d="${hole}" fill="${P.red}"/>` + k.sh(hole, 0, 0, 1, 1, 0, 0.9, P.wine, 0.45) + k.clip(hole, `<path d="${bricks}" stroke="${P.paper}" stroke-width=".55" opacity=".65"/>`) + `<path d="${hole}" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/></g>` +
      `<path d="${hole}" fill="${VIOD}"/>` + k.clip(hole, burst(k, 60, 56, 5, 40, 28, VIOLL) + k.shade(hole, k.rad(VIOLL, 0.5, 0.5, 0.5, 1, 0), VIOL, 0.55)) +
      `<path d="${hole}" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linejoin="round"/>` +
      cracks.map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.7)).join('') +
      // el puño de piedra, con el grillete dorado y la cadena rota
      `<g transform="translate(60 56) scale(1.16)">` +
      k.cast([heel, thumb, ...fing.map(finger), cuff], 2, 1.8, P.night) +
      k.draw([{
        d: cuff, fill: P.gold,
        inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-13.6 15.6C-6 19 6 19 13.6 15.6M-13.7 18.6C-6 22.2 6 22.2 13.7 18.6" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` +
          [-8, -2.6, 2.6, 8].map((x, i) => `<circle cx="${x}" cy="${f(18.3 + (Math.abs(x) < 5 ? 0.9 : 0.2))}" r="1.1" fill="${i % 2 ? VIO : P.red}" stroke="${P.ink}" stroke-width=".3"/>`).join(''),
      }], 0.6) +
      k.draw([
        stone(heel, hair(-12, 8, -6, 12, 2, 12.6, 0.45, P.blue)),
        ...fing.map((g, i) => stone(finger(g), `<path d="M${g[0]} ${f(g[2] + 7.4)}Q${f((g[0] + g[1]) / 2)} ${f(g[2] + 8.4)} ${g[1]} ${f(g[2] + 7.4)}" fill="none" stroke="${P.blue}" stroke-width=".55"/>` + `<ellipse cx="${f((g[0] + g[1]) / 2 - 1)}" cy="${f(g[2] + 2.8)}" rx="2" ry="1.1" fill="#fff" opacity=".8"/>` + (i === 1 ? hair(-5, -12, -3, -8, -6, -3, 0.45, P.mid) : '') + (i === 2 ? hair(5, -4, 3, -1, 6, 1.4, 0.4, P.mid) : ''))),
        stone(thumb, `<path d="M1.6 .6C3.8 .8 4.8 2.4 4.6 4C4.4 5.4 3.4 6.2 1.6 6.2C2.2 4.4 2.2 2.4 1.6 .6Z" fill="${P.white}" stroke="${P.blue}" stroke-width=".35"/>` + hair(-14, 2, -10, 1, -6, 2.4, 0.4, P.blue)),
      ], 0.75) +
      `</g>` +
      // la cadena rota que vuela
      link(36, 86, 60) + link(31, 81, -10, 0.95) + link(27, 75, 50, 0.9) + link(84, 32, -30, 0.9) + link(89, 27, 30, 0.8) +
      chip(24, 50, 20, 1) + chip(96, 58, -15, 0.9) + chip(86, 90, 35, 0.8) + chip(34, 30, -25, 0.8) + chip(97, 76, 10, 0.6) +
      sparkle(60, 26, 2.6, '#fff') + sparkle(28, 66, 1.6, VIOLL) +
      k.defs()
    )
  },
}
