// Hearthstone: la taberna. Color propio: el ámbar de la ficha (#B35C00), en maderas, gemas y cueros.
// Nada de la marca: ni el logo, ni el dorso ni los marcos de sus cartas, ni personajes de Blizzard.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const AMB = '#B35C00', AMB_L = '#E0913F', AMB_D = '#7A3B06'

/** Resplandor ámbar de fogón detrás del protagonista. */
const hearth = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.55) => k.shade(ellipse(cx, cy, rx, ry), k.rad(AMB_L, 0.5, 0.5, 0.5, a, 0), AMB_L, 0.35)

/** Gema ámbar tallada (oval), con la mesa arriba a la izquierda y facetas. Centro (0,0). */
function amberGem(k: Kit, rx: number, ry: number) {
  const d = ellipse(0, 0, rx, ry)
  const tx = rx * 0.5, ty = ry * 0.5
  const table = `M${f(-tx)} ${f(-ty * 0.4)}L${f(-tx * 0.4)} ${f(-ty)}H${f(tx * 0.4)}L${f(tx)} ${f(-ty * 0.4)}V${f(ty * 0.4)}L${f(tx * 0.4)} ${f(ty)}H${f(-tx * 0.4)}L${f(-tx)} ${f(ty * 0.4)}Z`
  const v = [[-tx, -ty * 0.4], [-tx * 0.4, -ty], [tx * 0.4, -ty], [tx, -ty * 0.4], [tx, ty * 0.4], [tx * 0.4, ty], [-tx * 0.4, ty], [-tx, ty * 0.4]]
  const rim = (x: number, y: number) => { const a = Math.atan2(y / ry, x / rx); return [Math.cos(a) * rx, Math.sin(a) * ry] }
  const facets = v.map(([x, y]) => { const [ex, ey] = rim(x * 1.6, y * 1.6); return `M${f(x)} ${f(y)}L${f(ex)} ${f(ey)}` }).join('')
  return (
    k.draw([{
      d, fill: AMB,
      inner:
        `<path d="M${f(-rx)} ${f(-ry)}H0L${f(-tx)} ${f(ty)}L${f(-rx)} ${f(ry * 0.4)}Z" fill="${AMB_L}" opacity=".8"/>` +
        k.sh(d, 0, 0, 1, 1, 0, 0.95, AMB_D, 0.5) +
        `<path d="${table}" fill="${k.lin(P.goldL, 0, 0, 1, 1, 0.95, 0.1)}"/>` +
        `<path d="${facets}" fill="none" stroke="${AMB_D}" stroke-width=".45"/><path d="${table}" fill="none" stroke="${AMB_D}" stroke-width=".45"/>`,
    }], 0.55) +
    `<path d="M${f(-rx * 0.62)} ${f(-ry * 0.5)}Q${f(-rx * 0.5)} ${f(-ry * 0.8)} ${f(-rx * 0.15)} ${f(-ry * 0.86)}" fill="none" stroke="#fff" stroke-width="${f(Math.max(rx, ry) * 0.09)}" stroke-linecap="round"/>` +
    sparkle(f(-tx * 0.5), f(-ty * 0.5), f(rx * 0.22), '#fff')
  )
}

/** Carta dorada (marco propio, no el del juego): ventana oval con cielo y estrella, cinta del nombre y renglones. Centro (0,0), 30×42. */
function goldCard(k: Kit, s = 1) {
  const d = roundRect(-15, -21, 15, 21, 2.4)
  const win = ellipse(0, -6, 9.2, 10.6)
  const banner = 'M-13.6 4.6C-6 3 6 3 13.6 4.6L13 9.6C6 8 -6 8 -13 9.6Z'
  const w = (n: number) => f(n / s)
  return (
    `<g transform="scale(${s})">` +
    k.draw([{
      d, fill: P.gold,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-16 -22H0L-16 6Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.55, 0)}"/>` +
        `<path d="${roundRect(-12.6, -18.6, 12.6, 18.6, 1.4)}" fill="${P.goldL}"/>` + k.sh(roundRect(-12.6, -18.6, 12.6, 18.6, 1.4), 0, 0, 1, 1, 0, 0.7, P.gold, 0.4) +
        `<path d="${roundRect(-12.6, -18.6, 12.6, 18.6, 1.4)}" fill="none" stroke="${P.goldD}" stroke-width="${w(0.45)}"/>` +
        `<path d="${roundRect(-13.8, -19.8, 13.8, 19.8, 1.8)}" fill="none" stroke="${P.goldL}" stroke-width="${w(0.35)}" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
        hair(-10.6, 16, -6, 14.6, -1, 16.4, 0.4, P.goldD) + hair(10.6, 16, 6, 14.6, 1, 16.4, 0.4, P.goldD),
    }], 0.6 / s) +
    k.draw([{
      d: win, fill: P.night,
      inner: `<path d="${win}" fill="${k.rad(P.mid, 0.5, 0.45, 0.6, 1, 0)}"/>` + k.shade(ellipse(0, -6, 7, 7), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.5) +
        `<path d="${starPath(0, -6, 6.4, 1.3, 4)}" fill="#fff"/><path d="${starPath(0, -6, 3.6, 0.9, 4, -45)}" fill="${P.goldL}"/>` +
        `<circle cx="-5" cy="-11" r=".45" fill="${P.paper}"/><circle cx="5.4" cy="-1" r=".4" fill="${P.paper}"/><circle cx="4" cy="-12.4" r=".35" fill="${P.paper}"/>`,
    }], 0.45 / s) +
    `<path d="${win}" fill="none" stroke="${P.goldD}" stroke-width="${w(0.9)}" transform="scale(1.1) translate(0 .55)" opacity=".8"/>` +
    k.draw([{ d: banner, fill: AMB, inner: k.sh(banner, 0, 0, 0, 1, 0, 0.8, AMB_D, 0.45) + `<path d="M-13 5.6C-6 4.2 6 4.2 13 5.6" fill="none" stroke="${AMB_L}" stroke-width="${w(0.5)}"/>` }], 0.4 / s) +
    `<path d="M-7 7C-2.4 6.2 2.4 6.2 7 7" fill="none" stroke="${P.goldL}" stroke-width="${w(0.8)}" stroke-dasharray="1.6 .7"/>` +
    `<path d="M-8.6 12.4H8.6M-8.6 14.4H8.6M-5 16.4H5" stroke="${P.goldD}" stroke-width="${w(0.55)}" opacity=".8"/>` +
    `<g transform="translate(0 -20.2)">` +
    `<path d="M-7 1C-5 -2.4 -2.4 -3 0 -3C2.4 -3 5 -2.4 7 1C4 .2 2 1.6 0 1.6C-2 1.6 -4 .2 -7 1Z" fill="${P.gold}" stroke="${P.ink}" stroke-width="${w(0.45)}"/>` +
    `<g transform="scale(.9)">${amberGem(k, 3.4, 4.2)}</g></g>` +
    `</g>`
  )
}

/** Corona dorada de cinco puntas con perlas. Base en (0,0). */
function crown(k: Kit) {
  const d = 'M-11 0L-12.4 -11L-7 -5.4L-3.4 -13L0 -6.6L3.4 -13L7 -5.4L12.4 -11L11 0Z'
  return (
    k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-12 -3.6H12V0H-12Z" fill="${P.goldD}" opacity=".45"/><path d="M-11.6 -3.6H11.6" stroke="${P.ink}" stroke-width=".35"/>` + hair(-9, -3, -9.6, -6, -10.6, -8.6, 0.4, P.goldL) }], 0.55) +
    [[-12.4, -11.6], [-3.4, -13.6], [3.4, -13.6], [12.4, -11.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.15" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
    `<circle cx="0" cy="-7.8" r="1.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
    `<circle cx="-6.4" cy="-1.8" r=".9" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/><circle cx="6.4" cy="-1.8" r=".9" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/><circle cx="0" cy="-1.8" r="1.1" fill="${AMB}" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

/** Voluta de grabado (trazo de tinta y oro encima), en coordenadas absolutas. */
const scroll = (d: string, w = 2.2) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.2)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.3 -.3)"/>`

/** Hoja de acanto dorada, con la base en (0,0) y la punta hacia +x. */
function acanthus(k: Kit, x: number, y: number, r: number, s: number) {
  const d = 'M0 0C3 -4.6 9 -6 14 -4.2C11.6 -3.4 10.4 -2.4 10 -1C12.6 -1.4 15 -.6 16.6 1.4C12 2 8 3.4 4.6 3.6C2.4 3.6 .8 2 0 0Z'
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
    k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.5) + hair(1.4, .6, 7, -2.6, 13, -3.4, 0.5, P.goldD) + hair(5, 1.6, 9, .6, 14.6, 1.2, 0.4, P.goldD) }], f(0.5 / s)) +
    `</g>`
}

export const TCG_HEARTHSTONE_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Leyenda ────────────────────────────────────────────────────────

  // Tres ganadas: la jarra de madera de la taberna, con la espuma que se cae por los costados. La primera invita la casa.
  'Jarra de la taberna': (u) => {
    const k = kit(u)
    const body = 'M39.6 49C38.6 62 38.4 77 37.4 90.4C44 93.4 68 93.4 74.6 90.4C73.6 77 73.4 62 72.4 49Z'
    const handle = 'M72.6 55C84.6 53.4 91 59.4 91 69.6C91 80.4 84.4 86.6 73.4 85.8L73.6 79.6C80.6 79.6 84.6 75.6 84.6 69.4C84.6 62.6 80.4 60.2 72.8 61.2Z'
    const edge = (y: number) => 39.6 - ((y - 49) / 41.4) * 2.2
    const hoop = (y: number, h: number) => {
      const l0 = f(edge(y) - 0.7), l1 = f(edge(y + h) - 0.7), r0 = f(112 - edge(y) + 0.7), r1 = f(112 - edge(y + h) + 0.7)
      return `M${l0} ${y}Q56 ${f(y + 3.4)} ${r0} ${y}L${r1} ${f(y + h)}Q56 ${f(y + h + 3.4)} ${l1} ${f(y + h)}Z`
    }
    const rivets = (y: number) => [42.4, 50, 58, 66, 70.6].map((x) => { const yy = y + 2.2 + 2.6 * (1 - Math.pow((x - 56) / 17, 2)); return `<circle cx="${x}" cy="${f(yy)}" r=".75" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` }).join('')
    const staves = [42.4, 47.4, 52.4, 57.6, 62.6, 67.6].map((x) => hair(x, 51, x + (x - 56) * 0.03, 70, x - (x - 56) * 0.02, 91, 0.5, AMB_D)).join('')
    const foam =
      'M37.4 50.6C34.6 48.6 35 43.6 38.8 42.6C38.6 38 43.4 35.4 47.4 37.6C49.4 33.4 55.6 32.2 58.8 35.8C61.8 32.4 68 33 69.6 37.4C73.8 35.6 78.4 38.6 77.4 43C80.4 44.4 80 49.6 76 50.6' +
      'C74.6 52.4 73.6 54.4 73.4 57.6C73.2 60.8 70.2 60.8 70 57.6C69.8 55 67.6 53.8 64.4 54C61.6 54.2 60.8 56.4 60.8 61.4C60.8 65.4 56.8 65.4 56.8 61.4C56.8 57 54.6 55 50.6 55.2' +
      'C46.6 55.4 45 54.2 43.8 56C42.4 58.4 40 57 40.2 54.6C40.4 52.6 39 51.6 37.4 50.6Z'
    const bubbles = [[44, 45, 1.6], [50, 41.4, 1.2], [63, 42.6, 1.8], [70, 46.4, 1.1], [56.4, 47.4, 1], [40.4, 48, 0.8], [74.4, 43, 0.9]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.blue}" stroke-width=".4"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff"/>`).join('')
    return (
      k.day() +
      k.sun(58, 58, 18, 47, 32, false) +
      hearth(k, 58, 60, 30, 30) +
      k.floor(58, 92.6, 30, 3.6, AMB_D) +
      k.cast([body, handle], 2.4, 1.8) +
      k.draw([
        { d: handle, fill: AMB, inner: k.sh(handle, 0, 0, 1, 1, 0.1, 0.95, AMB_D, 0.5) + hair(76, 57.6, 87, 60, 87.6, 70, 0.5, AMB_L) + hair(86, 74, 84, 80, 77, 83, 0.45, AMB_D) },
        {
          d: body, fill: AMB,
          inner:
            `<path d="M36 46H47C46 62 46 78 46.6 96H36Z" fill="${k.lin(AMB_L, 0, 0, 1, 0, 0.95, 0.2)}"/>` +
            k.sh('M60 46H78V96H60Z', 0, 0, 1, 0, 0, 0.95, AMB_D, 0.5) + staves +
            hair(44, 64, 44.6, 68, 44, 73, 0.4, AMB_D) + hair(65, 66, 64.4, 70, 65, 75, 0.4, '#5A2A04') +
            `<ellipse cx="50" cy="72" rx="1.2" ry="2" fill="${AMB_D}" opacity=".6"/><ellipse cx="50" cy="72" rx="2" ry="3.2" fill="none" stroke="${AMB_D}" stroke-width=".4"/>` +
            k.sh('M36 86H78V96H36Z', 0, 0, 0, 1, 0, 0.7, AMB_D, 0.35),
        },
      ], 0.8) +
      k.draw([
        { d: hoop(59.4, 4.2), fill: P.gold, inner: k.sh(hoop(59.4, 4.2), 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M38 60.4Q56 63.6 74 60.4" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` },
        { d: hoop(81, 4.2), fill: P.gold, inner: k.sh(hoop(81, 4.2), 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M37.6 82Q56 85.2 74.6 82" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` },
      ], 0.45) +
      rivets(59.4) + rivets(81) +
      k.draw([{
        d: foam, fill: P.white,
        inner: k.sh(foam, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + k.sh('M36 50H80V66H36Z', 0, 0, 0, 1, 0.1, 0.7, P.blue, 0.3) +
          hair(42, 41, 47, 39.4, 52, 40.4, 0.45, P.sky) + hair(58, 38.6, 63, 37, 67.4, 38.6, 0.45, P.sky) + bubbles,
      }], 0.7) +
      `<path d="M41 41.6C43 39.4 46 38.6 48.6 39.6" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>` +
      sparkle(88, 40, 2.6) + sparkle(30, 70, 1.8) + sparkle(84, 88, 1.4) +
      k.defs()
    )
  },

  // Quince victorias: abriste un sobre y salió brillando. La carta dorada sube del sobre rasgado, con su gema.
  'Legendaria dorada': (u) => {
    const k = kit(u)
    // Sobre de papel metalizado, un poco inflado, con la boca rasgada en zigzag y el pliegue engrapado abajo.
    let torn = 'M37.4 96.6C36 89 35.8 81 37 73.6'
    const xs = [37, 39.6, 42.2, 45, 47.6, 50.4, 53, 55.8, 58.4, 61.2, 63.8, 66.6, 69.2, 72, 74.6, 77.4, 80, 83]
    xs.forEach((x, i) => { torn += `L${x} ${f(73.6 - (x - 37) * 0.05 + (i % 2 ? -2.2 : 0.4) + (i % 3 === 0 ? 0.5 : 0))}` })
    torn += 'C84.2 81 84 89 82.6 96.6Z'
    const mouth = 'M37.4 74.4C44 68.6 76 66.6 82.6 71.6L82.8 73.6C76 69 44 71 37.2 76.4Z'
    const rays = Array.from({ length: 13 }, (_, i) => {
      const a = (-160 + i * (140 / 12)) * Math.PI / 180, w = 0.05
      return `M60 70L${f(60 + Math.cos(a - w) * 62)} ${f(70 + Math.sin(a - w) * 62)}L${f(60 + Math.cos(a + w) * 62)} ${f(70 + Math.sin(a + w) * 62)}Z`
    }).join('')
    const crimp = Array.from({ length: 19 }, (_, i) => `<path d="M${f(38.6 + i * 2.4)} 92.8V96.4" stroke="${AMB_D}" stroke-width=".45"/>`).join('')
    const sheen = `<path d="M40 96L52 70H57L45 96Z" fill="#fff" opacity=".28"/><path d="M47.4 96L59.4 70H61L49 96Z" fill="#fff" opacity=".35"/><path d="M71 96L80 74H82L73 96Z" fill="#fff" opacity=".18"/>`
    return (
      k.day() +
      `<path d="${rays}" fill="${k.rad(P.gold, 0.5, 0.95, 0.8, 0.95, 0.1)}"/>` + k.shade(rays, k.rad(P.goldD, 0.5, 0.95, 0.8, 0.7, 0), P.goldD, 0.2) +
      k.shade(ellipse(60, 46, 26, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.5) +
      k.floor(60, 96.4, 26, 3, AMB_D) +
      `<path d="${mouth}" fill="${AMB_D}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<g transform="translate(60 47.4) rotate(-5)">` + k.cast([roundRect(-15, -21, 15, 21, 2.4)], 2, 1.8, P.goldD) + goldCard(k, 1) + `</g>` +
      k.shade(ellipse(60, 72, 18, 5), k.rad(P.goldL, 0.5, 0.5, 0.5, 1, 0), P.goldL, 0.6) +
      k.draw([{
        d: torn, fill: AMB,
        inner:
          `<path d="M34 70H46C44 80 44 90 45 100H34Z" fill="${k.lin(AMB_L, 0, 0, 1, 0, 0.95, 0)}"/>` + k.sh(torn, 0, 0, 1, 1, 0, 0.95, AMB_D, 0.5) +
          k.sh('M34 70H86V79H34Z', 0, 1, 0, 0, 0, 0.6, AMB_D, 0.35) + sheen + crimp +
          `<path d="M37.6 92.4H82.4" stroke="${AMB_D}" stroke-width=".55"/>` +
          hair(78, 76, 80.4, 84, 79, 91, 0.5, AMB_D),
      }], 0.75) +
      `<circle cx="60" cy="83.4" r="6.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/>` + k.clip(ellipse(60, 83.4, 6.2, 6.2), k.sh(ellipse(60, 83.4, 6.2, 6.2), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5)) +
      `<circle cx="60" cy="83.4" r="4.7" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` +
      `<path d="${starPath(60, 83.4, 4.1, 1.6, 8)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/><circle cx="60" cy="83.4" r="1.3" fill="${AMB}" stroke="${P.ink}" stroke-width=".3"/>` +
      sparkle(84, 34, 3, '#fff') + sparkle(34, 46, 2.2, '#fff') + sparkle(82, 60, 1.6, P.goldL) + sparkle(38, 28, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Cuarenta partidas: ya tenés número al lado del nombre. La gema ámbar coronada, entre volutas, con su número en la cinta.
  'Rango Leyenda': (u) => {
    const k = kit(u)
    const bezel = ellipse(60, 52, 15.4, 18.6)
    const beads = Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2; return `<circle cx="${f(60 + Math.cos(a) * 14)}" cy="${f(52 + Math.sin(a) * 17.2)}" r=".62" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".22"/>` }).join('')
    const ribbon = 'M36.4 78.4C46 80.6 74 80.6 83.6 78.4L84.6 86.2C74 88.6 46 88.6 35.4 86.2Z'
    const tailL = 'M36.4 78.4C32 78.2 28.6 77.2 25.6 75.8L28.8 80.4L25.4 84.6C28.6 85.6 32 86.2 35.4 86.2Z'
    const tailR = 'M83.6 78.4C88 78.2 91.4 77.2 94.4 75.8L91.2 80.4L94.6 84.6C91.4 85.6 88 86.2 84.6 86.2Z'
    const rid = k.id('rib')
    return (
      k.day() +
      k.sun(60, 54, 18, 48, 32, false) +
      k.shade(ellipse(60, 52, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.5) +
      // Volutas y acantos a los costados del engarce.
      scroll('M46 42C38 38 31 40 29.6 46C28.4 51.4 33 54.4 36.4 52C38.6 50.4 37.6 47.4 35.4 47.6') +
      scroll('M74 42C82 38 89 40 90.4 46C91.6 51.4 87 54.4 83.6 52C81.4 50.4 82.4 47.4 84.6 47.6') +
      acanthus(k, 45.4, 58, 162, 1) + acanthus(k, 74.6, 58, 18, 1) + acanthus(k, 46, 45, 196, 0.85) + acanthus(k, 74, 45, -16, 0.85) +
      k.cast([bezel], 2, 2, P.goldD) +
      k.draw([{ d: bezel, fill: P.gold, inner: k.sh(bezel, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M46 50A14.4 17.6 0 0 1 56 35" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` }], 0.7) +
      beads +
      `<g transform="translate(60 52)">` + amberGem(k, 11.4, 14.4) + `</g>` +
      // Garras del engarce.
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<path d="M${f(60 + sx * 8.6)} ${f(52 + sy * 11.6)}l${f(sx * 2.4)} ${f(sy * 2.4)}" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M${f(60 + sx * 8.6)} ${f(52 + sy * 11.6)}l${f(sx * 2.4)} ${f(sy * 2.4)}" stroke="${P.gold}" stroke-width="1.3" stroke-linecap="round"/>`).join('') +
      `<g transform="translate(60 38.4) scale(.92)">` + crown(k) + `</g>` +
      k.draw([
        { d: tailL, fill: P.sky1, inner: k.sh(tailL, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) },
        { d: tailR, fill: P.sky1, inner: k.sh(tailR, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) },
        { d: ribbon, fill: P.white, inner: k.sh(ribbon, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M37 79.8C46 82 74 82 83 79.8M36.2 85C46 87.2 74 87.2 83.8 85" fill="none" stroke="${AMB}" stroke-width=".45"/>` },
      ], 0.55) +
      `<path id="${rid}" d="M38 84.6C48 86.6 72 86.6 82 84.6" fill="none"/>` +
      `<text font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="5.8" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">nº 1</textPath></text>` +
      sparkle(36, 30, 2.4, '#fff') + sparkle(86, 30, 2) + sparkle(30, 68, 1.6) + sparkle(90, 66, 1.4) +
      k.defs()
    )
  },

  // ── Corazón de las cartas ──────────────────────────────────────────

  // Tres topdecks salvadores: cruzaste los dedos delante del mazo y funcionó.
  'Dedos cruzados': (u) => {
    const k = kit(u)
    // Mano derecha vista de dorso: el índice cruza por delante del mayor; anular y meñique doblados; el pulgar al costado.
    const cuff = 'M-13 20H13L14.4 46H-14.6Z'
    const wrist = 'M-10.4 11H10.6L10.2 22H-10Z'
    const palm = 'M-12.4 -3.6C-13.6 2 -13 9 -10.6 15H11C13.4 9 14 2 13.2 -4C8 -6.6 -7 -6.4 -12.4 -3.6Z'
    const ring = roundRect(3.4, -8.8, 9, 3, 2.8)
    const pinky = roundRect(8.8, -6.6, 13.6, 3, 2.4)
    const mid = taper(-0.4, -2, -1.6, -20, -6.8, -33.4, 6.4, 5.6)
    const index = taper(-7.4, -1, -6.4, -18, 2.8, -29.6, 6.6, 5.6)
    const thumb = taper(-10.4, 12, -17, 3, -11.4, -6.4, 7.4, 5.4)
    const all = [cuff, wrist, mid, thumb, palm, ring, pinky, index]
    const back = roundRect(-13, -18, 13, 18, 2.2)
    const nail = (x: number, y: number, r: number) => `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="2.3" transform="rotate(${r} ${x} ${y})" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><ellipse cx="${f(x - 0.5)}" cy="${f(y - 0.6)}" rx=".5" ry=".9" transform="rotate(${r} ${x} ${y})" fill="#fff"/>`
    return (
      k.day() +
      k.sun(58, 52, 16, 44, 32, false) +
      hearth(k, 58, 52, 26, 26, 0.6) +
      // El mazo detrás, con la carta de arriba levantándose.
      `<g transform="translate(82 70) rotate(14)">` +
      k.draw([{ d: 'M-12 -15H14.6V20H-12Z', fill: P.white, inner: `<path d="M-12 -15H14.6V20H-12Z" fill="${P.sky1}"/>` + `<path d="M-12 16H14.6M-12 17.6H14.6M-12 19.2H14.6" stroke="${P.blue}" stroke-width=".35"/>` + k.sh('M-12 -15H14.6V20H-12Z', 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) }], 0.55) +
      `<g transform="translate(-1 -3) rotate(-10)">` +
      k.draw([{ d: back, fill: AMB, inner: k.sh(back, 0, 0, 1, 1, 0, 0.9, AMB_D, 0.5) + `<path d="${roundRect(-10.6, -15.6, 10.6, 15.6, 1.2)}" fill="none" stroke="${P.gold}" stroke-width=".7"/>` + `<path d="${starPath(0, 0, 6.6, 2.6, 8)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/><circle cx="0" cy="0" r="1.8" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` }], 0.6) +
      `</g></g>` +
      `<g transform="translate(59.6 68.4) scale(1.08)">${k.cast(all, 1.8, 1.6)}</g>` +
      `<g transform="translate(58 66.6) scale(1.08)">` +
      k.draw([
        { d: cuff, fill: P.sky, line: 0.35, inner: `<path d="M-14 20H14V25.6H-14Z" fill="${AMB}"/>` + `<path d="M-14 24.6H14" stroke="${P.gold}" stroke-width=".7"/>` + k.sh('M3 19H16V46H3Z', 0, 0, 1, 0, 0, 0.9) + hair(-8, 30, -7, 36, -8.6, 44, 0.5) + hair(5, 30, 6, 36, 5, 44, 0.45) },
        { d: wrist, fill: P.skin, inner: k.sh('M2 8H12V23H2Z', 0, 0, 1, 0, 0, 0.9) },
        { d: mid, fill: P.skin, line: 0.35, inner: k.sh(mid, 0, 0, 1, 0, 0, 0.5, P.blue, 0.25) + hair(-4.4, -21, -3.2, -20.4, -2, -21, 0.35) + nail(-6.6, -31.2, -16) },
        { d: thumb, fill: P.skin, line: 0.35, inner: k.sh(thumb, 0, 0, 1, 1, 0, 0.5, P.blue, 0.25) + hair(-15, 2, -14, 1.4, -12.6, 1.8, 0.35) + nail(-12.2, -4.2, 30) },
        { d: palm, fill: P.skin, inner: k.sh('M3 -8C8 0 10 8 9 15H15V-8Z', 0, 0, 1, 0, 0, 0.9) + `<path d="M-14 -8H-2V16H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + hair(-4, 4, -1, 6, 0, 10, 0.4) + hair(4, 3, 4.6, 6, 4, 10, 0.4) },
        { d: pinky, fill: P.skin, line: 0.35, inner: k.sh('M11 -8H15V4H11Z', 0, 0, 1, 0, 0, 0.8) },
        { d: ring, fill: P.skin, line: 0.35, inner: k.sh('M6 -10H10V4H6Z', 0, 0, 1, 0, 0, 0.7) + `<ellipse cx="5" cy="-6.6" rx=".8" ry="1.2" fill="#fff" opacity=".8"/>` },
        { d: index, fill: P.skin, line: 0.35, inner: k.sh(index, 0, 0, 1, 1, 0, 0.5, P.blue, 0.25) + `<path d="M-9 -8H-4.6L-1 -26H-4Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` + hair(-7, -12.6, -5.6, -11.6, -4, -12.2, 0.38) + nail(2.4, -27.4, 30) },
      ], 0.62) +
      `</g>` +
      hair(36, 30, 38.4, 26.6, 42, 25, 0.6) + hair(70, 25, 73, 24, 75, 25.6, 0.6) + hair(33, 38, 34.4, 35, 37, 33.4, 0.5) +
      sparkle(84, 32, 2.4) + sparkle(30, 56, 1.8) +
      k.defs()
    )
  },

  // Doce topdecks: entrás gritando tu nombre y sale bien igual. La puerta del calabozo pateada y el muslo de pollo en alto.
  '¡Leeroy Jenkins!': (u) => {
    const k = kit(u)
    const outer = 'M30 104V56C30 38 43.4 27 60 27C76.6 27 90 38 90 56V104Z'
    const opening = 'M39 104V58C39 44.6 48.4 36 60 36C71.6 36 81 44.6 81 58V104Z'
    const vous = Array.from({ length: 11 }, (_, i) => {
      const a = Math.PI + (i / 10) * Math.PI, c = Math.cos(a), s = Math.sin(a)
      return `M${f(60 + c * 21)} ${f(58 + s * 22)}L${f(60 + c * 30)} ${f(58 + s * 31)}`
    }).join('')
    const leaf = 'M81 104V58C81 52 79.6 47 77.4 43L70.4 47.6C71.6 51 72 54.6 72 58V104Z'
    // Muslo de pollo: carne en gota y hueso con nudo; apunta hacia arriba antes de girarlo.
    const meat = 'M0 -30C8.6 -30 13.4 -22 13 -14C12.6 -6 8 -.6 4 2.4L3 6H-3L-4 2.4C-8 -.6 -12.6 -6 -13 -14C-13.4 -22 -8.6 -30 0 -30Z'
    const bone = 'M-2.2 4H2.2L2 15.4C4.4 14.2 6.6 15.4 6.4 17.6C6.2 19.2 4.6 19.8 3.6 19.4C4 21.2 2.8 22.8 1 22.6C-1 22.4 -1.4 20.2 -.6 19C-1.6 19.8 -3.6 19.4 -3.8 17.8C-4 15.6 -2 14.6 -2 15.4Z'
    const crisp = [[-6, -22, -9, -16, -8, -9], [5, -24, 8, -17, 7, -9], [-2, -16, -3, -10, -1.6, -3], [4, -12, 5, -7, 3, -2]].map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.55, AMB_D)).join('')
    return (
      k.day() +
      k.sun(60, 60, 18, 48, 32, false) +
      k.draw([{ d: outer, fill: P.sky1, inner: k.sh(outer, 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) + `<path d="${vous}" stroke="${P.blue}" stroke-width=".7"/>` + `<path d="M30 74H39M30 86H39M81 70H90M81 84H90M30 62H39M81 96H90" stroke="${P.blue}" stroke-width=".6"/>` + hair(33, 44, 36, 40, 40, 38, 0.5, '#fff') }], 0.8) +
      k.draw([{
        d: opening, fill: P.night,
        inner: `<path d="${ellipse(60, 100, 28, 34)}" fill="${k.rad(AMB_L, 0.5, 0.5, 0.5, 0.75, 0)}"/><path d="${ellipse(60, 100, 16, 20)}" fill="${k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0)}"/>`,
      }], 0.4) +
      // La hoja de la puerta, abierta de una patada hacia adentro.
      k.draw([{
        d: leaf, fill: AMB,
        inner: k.sh(leaf, 0, 0, 1, 0, 0.1, 0.95, AMB_D, 0.5) + `<path d="M75 46V104M78.4 44V104" stroke="${AMB_D}" stroke-width=".55"/>` +
          `<path d="M71.6 56L81 53.6V57.4L71.8 59.6ZM72 84L81 82.4V86L72 87.6Z" fill="${P.mid}" stroke="${P.ink}" stroke-width=".35"/>` + `<circle cx="73.4" cy="72" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`,
      }], 0.55) +
      hair(30, 56, 25, 54, 20, 55, 0.7, P.mid) + hair(30, 66, 24, 66, 19, 68, 0.6, P.mid) + hair(90, 52, 95, 49, 99, 49, 0.6, P.mid) +
      `<g transform="translate(55 70) rotate(-28)">` +
      k.cast([meat, bone], 2.4, 2) +
      k.draw([
        { d: bone, fill: P.white, inner: k.sh(bone, 0, 0, 1, 0, 0, 0.8, P.sky2, 0.45) + `<path d="M-.6 5V14" stroke="${P.sky2}" stroke-width=".6"/>` },
        {
          d: meat, fill: AMB_L,
          inner: `<path d="${meat}" fill="${k.rad(P.goldL, 0.35, 0.3, 0.6, 0.9, 0)}"/>` + k.sh(meat, 0, 0, 1, 1, 0, 0.95, AMB, 0.55) + k.sh('M0 -32H14V8H0Z', 0, 0, 1, 0, 0, 0.6, AMB_D, 0.35) + crisp +
            `<circle cx="-4" cy="-19" r=".7" fill="${AMB_D}"/><circle cx="3.4" cy="-6" r=".6" fill="${AMB_D}"/><circle cx="6" cy="-18" r=".5" fill="${AMB_D}"/><circle cx="-6" cy="-8" r=".55" fill="${AMB_D}"/>`,
        },
      ], 0.75) +
      `<path d="M-7 -25C-4.6 -27.6 -1 -28.4 2 -27.4" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M-10 -17C-10.4 -14 -9.8 -11 -8.6 -9" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` +
      `</g>` +
      `<g fill="none" stroke-linecap="round"><path d="M40.6 40C38.4 36.6 41.6 34.4 40 31C38.8 28.6 40 26.6 41.6 25.6" stroke="${P.ink}" stroke-width="1.6"/><path d="M40.6 40C38.4 36.6 41.6 34.4 40 31C38.8 28.6 40 26.6 41.6 25.6" stroke="#fff" stroke-width=".8"/>` +
      `<path d="M46.4 37.4C44.8 34.6 47.4 32.6 46.2 29.6" stroke="${P.ink}" stroke-width="1.4"/><path d="M46.4 37.4C44.8 34.6 47.4 32.6 46.2 29.6" stroke="#fff" stroke-width=".7"/></g>` +
      sparkle(26, 84, 2) + sparkle(92, 70, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco topdecks: el rival denunció la partida por brujería. En la bola de cristal ya se ve la carta que vas a robar.
  'Bendición de la RNG': (u) => {
    const k = kit(u)
    const ball = ellipse(60, 46, 21, 21)
    const collar = 'M44.6 62C48 66.6 53.6 69 60 69C66.4 69 72 66.6 75.4 62L77.4 66C73.6 71.6 67.4 74.4 60 74.4C52.6 74.4 46.4 71.6 42.6 66Z'
    const stem = 'M53.4 73.6H66.6C66 77 64.4 79 63.6 80.4C66 81.4 66 84 63.6 84.6L64.4 86H55.6L56.4 84.6C54 84 54 81.4 56.4 80.4C55.6 79 54 77 53.4 73.6Z'
    const base = 'M43 95C43 90.4 49.6 86 60 86C70.4 86 77 90.4 77 95Z'
    const claw = (sx: number) =>
      `<g transform="translate(60 0) scale(${sx} 1)"><path d="M10.4 87.4C14.6 86 18 87.6 19 90.6C19.6 92.6 18.6 94.4 17 95H11.6C13.4 93.6 13.6 91.6 12.6 90.2C11.8 89 10.8 88.6 10.4 87.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M13 95C14.4 93.6 14.8 92 14.4 90.4M15.4 95C16.8 93.4 17.2 91.6 16.6 90" fill="none" stroke="${P.goldD}" stroke-width=".4"/></g>`
    const beads = Array.from({ length: 15 }, (_, i) => { const x = 45.6 + i * 2.06; return `<circle cx="${f(x)}" cy="${f(68.4 + 2.6 * (1 - Math.pow((x - 60) / 15, 2)))}" r=".6" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    const card = roundRect(-6, -8.4, 6, 8.4, 1.2)
    const mist = [[44, 52, 52, 46, 60, 52], [56, 56, 66, 50, 76, 54], [46, 40, 54, 36, 62, 40], [60, 60, 52, 62, 46, 58]].map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.7, P.sky, 0.75)).join('')
    const stars = [[47, 38, 0.5], [72, 36, 0.45], [70, 56, 0.4], [50, 58, 0.45], [64, 30, 0.35], [76, 46, 0.4]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
    return (
      k.day() +
      k.sun(60, 46, 22, 48, 32, false) +
      hearth(k, 60, 50, 34, 34, 0.7) +
      k.floor(60, 95, 24, 3, AMB_D) +
      // Pie: base con garras, vástago torneado y la copa que abraza la bola.
      k.draw([
        { d: base, fill: P.gold, inner: k.sh(base, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M46 92.4C50 89.6 70 89.6 74 92.4" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` + hair(52, 89, 56, 88, 60, 88.6, 0.4, '#fff') },
        { d: stem, fill: P.gold, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M55 80.4H65M56 84.6H64" stroke="${P.goldD}" stroke-width=".45"/>` },
      ], 0.65) +
      claw(1) + claw(-1) +
      hair(47, 93, 52, 90.6, 57, 90.4, 0.45, P.goldD) + hair(73, 93, 68, 90.6, 63, 90.4, 0.45, P.goldD) +
      acanthus(k, 55, 75.4, 200, 0.42) + acanthus(k, 65, 75.4, -20, 0.42) +
      `<circle cx="60" cy="82.4" r="1.4" fill="${AMB}" stroke="${P.ink}" stroke-width=".35"/><circle cx="59.6" cy="82" r=".4" fill="#fff"/>` +
      // La bola.
      k.draw([{
        d: ball, fill: P.night,
        inner:
          `<path d="${ball}" fill="${k.rad(P.mid, 0.4, 0.35, 0.7, 1, 0.1)}"/>` + k.sh(ball, 0, 0, 1, 1, 0.1, 0.95, '#0F1736', 0.5) +
          k.shade(ellipse(60, 47, 15, 15), k.rad(AMB_L, 0.5, 0.5, 0.5, 1, 0), AMB_L, 0.55) + stars + mist +
          `<g transform="translate(60 46) rotate(-8) scale(1.25)">` +
          k.shade(ellipse(0, 0, 9, 11), k.rad(P.goldL, 0.5, 0.5, 0.5, 1, 0), P.goldL, 0.7) +
          `<path d="${starPath(0, 0, 13, 1.2, 8)}" fill="${P.goldL}" opacity=".55"/>` +
          k.draw([{ d: card, fill: P.gold, inner: `<path d="${roundRect(-4.4, -6.8, 4.4, 6.8, 0.6)}" fill="${P.white}"/>` + k.shade(ellipse(0, -1, 4, 4), k.rad(P.goldL, 0.5, 0.5, 0.5, 1, 0), P.goldL, 0.5) + `<path d="${starPath(0, -1.2, 3.4, 0.9, 4)}" fill="${P.gold}"/><path d="M-3 4H3M-3 5.4H3" stroke="${P.goldD}" stroke-width=".4"/>` + k.sh(card, 0, 0, 1, 1, 0, 0.5, P.goldD, 0.3) }], 0.35) +
          `</g>`,
      }], 0.75) +
      `<path d="M44.6 38C46.6 31.6 52 27.6 58.6 27" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/><circle cx="46" cy="44" r="1" fill="#fff" opacity=".8"/>` +
      `<path d="M68 63.4C72.4 61.6 76 58 77.6 53.4" fill="none" stroke="${P.sky}" stroke-width=".8" stroke-linecap="round" opacity=".7"/>` +
      k.draw([{ d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + hair(46, 65, 52, 69, 58, 70.4, 0.5, P.goldL) }], 0.6) +
      beads +
      [1, -1].map((sx) => {
        const d = 'M15.4 17C19 13 20.6 7.6 20 2.4C21.6 6 21.8 11 20 15.4C19 17.6 17.4 19 15.4 19.6Z'
        return `<g transform="translate(60 46) scale(${sx} 1)">` + k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.45) + `<circle cx="20.2" cy="3" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/></g>`
      }).join('') +
      `<circle cx="60" cy="70.6" r="1.5" fill="${AMB}" stroke="${P.ink}" stroke-width=".35"/><circle cx="59.5" cy="70.1" r=".45" fill="#fff"/>` +
      sparkle(60, 19.6, 2.8, '#fff') + sparkle(32, 40, 2.2, '#fff') + sparkle(88, 44, 1.8, '#fff') + sparkle(84, 76, 1.4, '#fff') +
      k.defs()
    )
  },
}
