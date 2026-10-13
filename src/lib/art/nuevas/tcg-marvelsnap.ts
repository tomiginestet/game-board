// Marvel Snap: el cosmos de bolsillo. Color propio: el azul eléctrico de la ficha (#3B5BDB), sobre la noche.
// Nada de la marca: ni el logo, ni sus marcos de cartas, ni personajes; el guantelete y el cubo son genéricos.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const ELEC = '#3B5BDB', ELEC_L = '#93A8F5', ELEC_D = '#1E3392'
const EMER = '#2E9E6E', EMER_L = '#9BE0BC', EMER_D = '#17603F'
/** Las seis gemas: espacio, realidad, poder, alma, mente y tiempo (colores genéricos). */
const GEMS: [string, string][] = [[ELEC, ELEC_D], [P.red, P.wine], ['#8456C4', '#4E2A82'], ['#E8832A', '#9A4A0E'], ['#F2CF45', '#B2861A'], ['#3FA26B', '#1F6440']]

/** Noche cósmica con el resplandor azul eléctrico y estrellas. */
function cosmos(k: Kit, cx = 60, cy = 56, glow = ELEC) {
  const stars = [[24, 32, 0.6], [94, 28, 0.55], [98, 62, 0.45], [20, 64, 0.5], [88, 88, 0.5], [32, 90, 0.45], [76, 16, 0.4], [44, 18, 0.45], [28, 48, 0.35], [92, 46, 0.35]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
  return k.night() + k.shade(ellipse(cx, cy, 46, 44), k.rad(glow, 0.5, 0.5, 0.5, 0.95, 0), glow, 0.4) + stars
}

/** Gema oval facetada, con brillo. */
function gem(k: Kit, x: number, y: number, rx: number, ry: number, c: string, cD: string, w = 0.4) {
  const d = ellipse(x, y, rx, ry)
  return (
    k.draw([{
      d, fill: c,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, cD, 0.55) + `<path d="${ellipse(x, f(y - ry * 0.15), rx * 0.5, ry * 0.42)}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.6, 0)}"/>` +
        `<path d="M${f(x - rx)} ${y}H${f(x + rx)}M${x} ${f(y - ry)}V${f(y + ry)}" stroke="${cD}" stroke-width="${f(w * 0.6)}" opacity=".6"/>`,
    }], w) +
    `<circle cx="${f(x - rx * 0.38)}" cy="${f(y - ry * 0.4)}" r="${f(Math.min(rx, ry) * 0.24)}" fill="#fff"/>`
  )
}

/** Generador pseudoaleatorio con semilla (para el polvo, siempre igual). */
function rnd(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

/** Carta de la mano con el marco eléctrico y una gema en la ventana. Base en (0,0), 18×27. */
function gemCard(k: Kit, c: string, cD: string) {
  const d = roundRect(-9, -27, 9, 0, 1.6)
  const win = roundRect(-6.4, -24.4, 6.4, -7.4, 0.8)
  return (
    k.draw([{
      d, fill: P.white,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) +
        `<path d="${roundRect(-7.8, -25.8, 7.8, -1.2, 1)}" fill="none" stroke="${ELEC}" stroke-width="1.1"/>` +
        `<path d="${roundRect(-7.8, -25.8, 7.8, -1.2, 1)}" fill="none" stroke="${P.gold}" stroke-width=".35"/>` +
        `<path d="M-6.4 -5.6H6.4V-2.8H-6.4Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/><path d="M-4 -4.2H4" stroke="${P.goldD}" stroke-width=".45" stroke-dasharray="1 .5"/>`,
    }], 0.45) +
    k.draw([{ d: win, fill: cD, inner: `<path d="${win}" fill="${k.rad(c, 0.5, 0.5, 0.6, 1, 0)}"/>` + k.sh(win, 0, 0, 1, 1, 0, 0.7, P.night, 0.4) + `<path d="${starPath(0, -15.9, 7, 0.8, 8)}" fill="#fff" opacity=".45"/><circle cx="-3.6" cy="-21.6" r=".4" fill="${P.paper}"/><circle cx="4" cy="-10" r=".35" fill="${P.paper}"/>` }], 0.3) +
    gem(k, 0, -15.9, 4, 4.8, c, cD, 0.4)
  )
}

export const TCG_MARVELSNAP_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Coleccionista ──────────────────────────────────────────────────

  // Tres ganadas: tu primer cubo brilla en el estante, sobre su peana dorada.
  'Cubo cósmico': (u) => {
    const k = kit(u)
    const T = '60 31', UR = '77.6 41', LR = '77.6 61', B = '60 71', LL = '42.4 61', UL = '42.4 41', C = '60 51'
    const cube = `M${T}L${UR}L${LR}L${B}L${LL}L${UL}Z`
    const top = `M${T}L${UR}L${C}L${UL}Z`, left = `M${UL}L${C}L${B}L${LL}Z`, right = `M${C}L${UR}L${LR}L${B}Z`
    const pTop = 'M38.6 62.2L60 74.4L81.4 62.2L60 50Z', pL = 'M38.6 62.2L60 74.4V78.6L38.6 66.4Z', pR = 'M60 74.4L81.4 62.2V66.4L60 78.6Z'
    const rays = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2 - Math.PI / 2, r1 = i % 2 ? 36 : 48, w = i % 2 ? 0.035 : 0.06
      return `M${f(60 + Math.cos(a - w) * 16)} ${f(51 + Math.sin(a - w) * 16)}L${f(60 + Math.cos(a) * r1)} ${f(51 + Math.sin(a) * r1)}L${f(60 + Math.cos(a + w) * 16)} ${f(51 + Math.sin(a + w) * 16)}Z`
    }).join('')
    const plank = 'M14 78.6H106V85.4H14Z'
    const surge = [[48, 46, 52, 41, 58, 43], [63, 58, 68, 53.6, 72.6, 55.6], [48, 60, 51.6, 55.6, 55, 57.6], [64, 39, 67, 37, 71, 38.4], [54, 64, 57, 66, 61, 64]].map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.65, '#fff', 0.9)).join('')
    return (
      cosmos(k, 60, 51) +
      `<path d="${rays}" fill="${k.rad(ELEC_L, 0.5, 0.5, 0.5, 1, 0.1)}"/>` + k.shade(rays, k.rad(ELEC_L, 0.5, 0.5, 0.5, 0.8, 0), ELEC_L, 0.25) +
      k.shade(ellipse(60, 51, 30, 30), k.rad(ELEC_L, 0.5, 0.5, 0.5, 0.95, 0), ELEC_L, 0.55) +
      // El estante y la peana dorada.
      k.draw([{ d: plank, fill: P.brown, inner: k.sh(plank, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M14 79.6H106" stroke="${P.goldL}" stroke-width=".9"/>` + hair(24, 82.4, 38, 81.8, 52, 82.6, 0.45, P.brownD) + hair(66, 83.2, 80, 82.4, 96, 83, 0.45, P.brownD) }], 0.7) +
      k.shade(ellipse(60, 79, 30, 3.4), k.rad(ELEC_L, 0.5, 0.5, 0.5, 1, 0), ELEC_L, 0.6) +
      k.draw([
        { d: pL, fill: P.gold, inner: k.sh(pL, 0, 0, 1, 0, 0, 0.6, P.goldD, 0.4) },
        { d: pR, fill: P.goldD, inner: k.sh(pR, 0, 0, 1, 0, 0, 0.8, '#9A5A1E', 0.4) },
        { d: pTop, fill: P.goldL, inner: k.sh(pTop, 0, 0, 1, 1, 0, 0.6, P.gold, 0.4) },
      ], 0.55) +
      `<path d="M41.6 63.8L60 74.4L78.4 63.8" fill="none" stroke="${P.goldD}" stroke-width=".45" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      `<path d="M39.6 65.4L60 77M60 77L80.4 65.4" stroke="${P.ink}" stroke-width=".35" opacity=".5"/>` +
      // El cubo, translúcido, con el núcleo encendido.
      k.cast([cube], 1.6, 1.8, P.night) +
      k.draw([
        { d: left, fill: ELEC_L, inner: k.sh(left, 0, 0, 1, 1, 0, 0.8, ELEC, 0.45) },
        { d: right, fill: ELEC, inner: k.sh(right, 0, 0, 1, 1, 0, 0.8, ELEC_D, 0.45) },
        { d: top, fill: '#DCE4FC', inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, ELEC_L, 0.4) },
      ], 0.8) +
      `<path d="M60 51V31M60 51L42.4 61M60 51L77.6 61" fill="none" stroke="#fff" stroke-width=".6" stroke-dasharray="1.4 .9" opacity=".75"/>` +
      k.shade(ellipse(60, 52, 13, 13), k.rad('#ffffff', 0.5, 0.5, 0.5, 1, 0), '#ffffff', 0.7) +
      `<circle cx="60" cy="52" r="3" fill="#fff"/>` + surge +
      `<path d="M43 41.6L60 31.8L77 41.6" fill="none" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/><path d="M43.4 43.4V60" stroke="#fff" stroke-width="1" opacity=".8"/><path d="M42.4 41L60 51L77.6 41M60 51V71" fill="none" stroke="${P.ink}" stroke-width=".45" opacity=".55"/>` +
      `<path d="${cube}" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>` +
      sparkle(60, 52, 7, '#fff') + sparkle(88, 30, 2.4, '#fff') + sparkle(30, 38, 1.8, ELEC_L) + sparkle(30, 70, 1.4, '#fff') +
      k.defs()
    )
  },

  // Quince victorias: tus cartas tienen marco 3D y ganas de lucirse. El rayo rompe el marco y sale de la carta.
  'Carta variante': (u) => {
    const k = kit(u)
    const card = 'M-18 -22Q-18 -25 -15 -25H5.6L8 -21.6L10.6 -24.6L12 -19.8L15.6 -19.4L14.4 -15.8L18 -13.6V22Q18 25 15 25H-15Q-18 25 -18 22Z'
    const win = roundRect(-13.6, -20.6, 13.6, 9.4, 1.2)
    const bolt = 'M-3 6L4.6 -8.6L.6 -9.4L12.4 -27.6L10.8 -16L15.4 -15.4L26.2 -37.4L22.4 -14.4L18.4 -15.2L12.6 -4.6L16 -4L-3 6Z'
    const holo = [[P.goldL, 0], ['#F2A3C4', 7], [P.sky1, 14], ['#A6E3C8', 21], [P.goldL, 28], ['#F2A3C4', 35], [P.sky1, 42]]
      .map(([c, x]) => `<path d="M${-30 + +x} 30L${-18 + +x} -30H${-12 + +x}L${-24 + +x} 30Z" fill="${c}" opacity=".7"/>`).join('')
    const shard = (x: number, y: number, r: number, s: number) =>
      `<path d="M0 -2.4L2.6 .6L-.4 2.2L-2.2 -.4Z" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${ELEC}" stroke="${P.ink}" stroke-width="${f(0.4 / s)}"/><path d="M0 -2.4L2.6 .6" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" stroke="${P.gold}" stroke-width="${f(0.6 / s)}"/>`
    return (
      cosmos(k, 58, 58) +
      k.sun(58, 58, 20, 46, 32, false) +
      `<g transform="translate(57 62) rotate(-8)">` +
      // Canto de la carta: el marco tiene espesor.
      `<path d="${card}" fill="${ELEC}" stroke="${P.ink}" stroke-width="1.4" stroke-linejoin="round" transform="translate(2.6 2.4)"/>` +
      `<path d="${card}" fill="${ELEC_D}" transform="translate(2.6 2.4)" opacity=".5"/>` +
      k.draw([{
        d: card, fill: P.white,
        inner: holo + k.sh(card, 0, 0, 1, 1, 0, 0.9, P.sky2, 0.5) +
          `<path d="${roundRect(-16.6, -23.6, 16.6, 23.6, 2.4)}" fill="none" stroke="${ELEC}" stroke-width="1.6"/>` +
          `<path d="M-17 21V-22Q-17 -24 -15 -24H5" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/>` +
          `<path d="${roundRect(-15.4, -22.4, 15.4, 22.4, 1.8)}" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="${roundRect(-15.4, -22.4, 15.4, 22.4, 1.8)}" fill="none" stroke="${P.gold}" stroke-width=".9"/>` +
          `<path d="${win}" fill="${P.night}" stroke="${P.ink}" stroke-width=".8"/>` +
          k.clip(win, `<path d="${win}" fill="${k.rad(ELEC, 0.5, 0.7, 0.7, 1, 0.1)}"/>` + k.shade(ellipse(2, -2, 14, 12), k.rad(ELEC_L, 0.5, 0.5, 0.5, 0.95, 0), ELEC_L, 0.5) +
            `<circle cx="-9" cy="-15" r=".5" fill="${P.paper}"/><circle cx="-5" cy="4" r=".45" fill="${P.paper}"/><circle cx="8" cy="5" r=".4" fill="${P.paper}"/><circle cx="-10" cy="-4" r=".35" fill="${P.paper}"/>`) +
          `<path d="M-12.6 12.6H12.6V19.6H-12.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` + k.sh('M-12.6 12.6H12.6V19.6H-12.6Z', 0, 0, 0, 1, 0, 0.8, P.goldD, 0.4) +
          `<path d="M-8 16.2H8" stroke="${P.goldD}" stroke-width=".9" stroke-dasharray="2 .8"/>`,
      }], 0.75) +
      // Costo, arriba a la izquierda.
      `<circle cx="-14.6" cy="-21.4" r="4.6" fill="${ELEC_D}" stroke="${P.ink}" stroke-width=".8"/><circle cx="-14.6" cy="-21.4" r="3.6" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      `<text x="-14.6" y="-19.4" font-family="Georgia, serif" font-weight="700" font-size="5.4" fill="${P.white}" text-anchor="middle">3</text>` +
      // El rayo que sale del marco.
      k.shade(ellipse(12, -16, 16, 18), k.rad(ELEC_L, 0.5, 0.5, 0.5, 0.9, 0), ELEC_L, 0.5) +
      k.draw([{ d: bolt, fill: P.gold, inner: k.sh(bolt, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M.6 2.6L5.6 -6.8L2.6 -7.4L11 -21" fill="none" stroke="#fff" stroke-width=".9" stroke-linejoin="round"/>` }], 0.7) +
      shard(21, -24, 20, 1.2) + shard(17.6, -31.6, -30, 0.9) + shard(24.6, -16, 60, 0.8) + shard(13, -30.6, 10, 0.7) +
      `</g>` +
      sparkle(32, 30, 2.4, '#fff') + sparkle(90, 72, 1.8, ELEC_L) + sparkle(84, 18.6, 1.4, '#fff') +
      k.defs()
    )
  },

  // Cuarenta partidas: seis gemas y la mitad del grupo hecha polvo. El puño del guantelete dorado, en alto.
  'Guantelete del infinito': (u) => {
    const k = kit(u)
    const cuff = 'M-14.4 20H14.4C15.4 28 17.6 38 20.6 48H-20.6C-17.6 38 -15.4 28 -14.4 20Z'
    const band = 'M-15.6 17.6H15.6L16.2 23.6H-16.2Z'
    const wrist = 'M-11.8 10.6H11.8L12.6 19H-12.6Z'
    const back = 'M-14.8 -9C-15.8 -1 -15.2 6 -12.2 12.6H12.2C15.2 6 15.8 -1 14.8 -9C10 -11.6 -10 -11.6 -14.8 -9Z'
    const F: [number, number, number][] = [[-14.8, 7.2, -21.6], [-7.6, 7.2, -23.6], [-0.4, 7.2, -22.6], [6.8, 6.6, -19.4]]
    const finger = (x: number, w: number, top: number) => roundRect(x, top, f(x + w), -5, 3.2)
    const thumb = 'M-13.6 7C-19.6 5 -22.6 -1.6 -21.6 -8.6C-20.8 -14 -17.4 -17 -13.8 -15.8C-11.2 -15 -10.6 -12.2 -11.6 -9.6C-12.8 -6.4 -13 -2 -11.6 1.4Z'
    const gold = (d: string, extra = '', dark = 0.95) => ({ d, fill: P.gold, line: 0.35, inner: k.sh(d, 0, 0, 1, 1, 0, dark, P.goldD, 0.5) + `<path d="M-24 -30H-6V50H-24Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` + extra })
    const beads = Array.from({ length: 11 }, (_, i) => `<circle cx="${f(-13.6 + i * 2.72)}" cy="20.6" r=".7" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".22"/>`).join('')
    const all = [cuff, band, wrist, back, ...F.map(([x, w, t]) => finger(x, w, t)), thumb]
    const dust = (() => {
      const r = rnd(7)
      let out = ''
      for (let i = 0; i < 46; i++) {
        const t = r(), x = 80 + t * 22 + r() * 4, y = 30 + r() * 46 - t * 10, s = (1 - t) * 1.2 + 0.25
        out += `<path d="M0 -1L1 .2L-.2 1Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(r() * 360)}) scale(${f(s)})" fill="${i % 3 ? P.goldL : P.paper}" opacity="${f(0.95 - t * 0.6)}"/>`
      }
      return out
    })()
    return (
      cosmos(k, 60, 52) +
      k.sun(60, 50, 18, 48, 32, false) +
      k.shade(ellipse(60, 50, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      dust +
      hair(80, 40, 88, 36, 98, 36, 0.5, P.paper, 0.7) + hair(82, 52, 90, 50, 100, 52, 0.45, P.paper, 0.6) +
      `<g transform="translate(62 55.4)">${k.cast(all, 2, 1.8, '#0F1736')}</g>` +
      `<g transform="translate(60 53.6)">` +
      k.draw([
        gold(cuff, `<path d="M-17 40C-6 43.4 6 43.4 17 40M-17.6 42.6C-6 46 6 46 17.6 42.6" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` + hair(-14, 26, -15.4, 32, -17, 38, 0.5, P.goldL) + hair(13, 26, 14.4, 32, 16, 38, 0.5, P.goldD)),
        gold(wrist, `<path d="M-12 13.6H12M-12.4 16.4H12.4" stroke="${P.goldD}" stroke-width=".5"/>`),
        gold(band, `<path d="M-15.6 19.2H15.6M-16 22H16" stroke="${P.goldD}" stroke-width=".35"/>`),
        gold(thumb, hair(-19.6, -4, -18.6, -1, -16, 1, 0.4, P.goldD) + `<path d="M-21.6 -4.2C-19 -3.4 -16 -3.6 -12.6 -4.6" fill="none" stroke="${P.goldD}" stroke-width=".45"/>`),
        gold(back, `<path d="M-9 -2C-7 -6 -4 -8 0 -8C4 -8 7 -6 9 -2M-9 6C-7 9 -4 10.6 0 10.6C4 10.6 7 9 9 6" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` + hair(-12, -4, -11, 2, -9, 8, 0.45, P.goldD) + hair(12, -4, 11, 2, 9, 8, 0.45, P.goldD)),
        ...F.map(([x, w, t]) => gold(finger(x, w, t), `<path d="M${x} ${f(t + 9.4)}H${f(x + w)}M${x} ${f(t + 11)}H${f(x + w)}" stroke="${P.goldD}" stroke-width=".45"/>` + `<ellipse cx="${f(x + w * 0.3)}" cy="${f(t + 2.4)}" rx=".9" ry="1.4" fill="#fff" opacity=".8"/>`)),
      ], 0.75) +
      beads +
      // Placa de nudillos remachada y volutas grabadas en el puño.
      k.draw([gold('M-15.4 -8.4C-8 -10.6 8 -10.6 14.8 -8.4L15 -4.8C8 -7 -8 -7 -15.6 -4.8Z', `<path d="M-15 -6.6C-8 -8.6 8 -8.6 14.8 -6.6" fill="none" stroke="${P.goldL}" stroke-width=".5"/>`)], 0.5) +
      [-12.4, -4.4, 3.8, 11.6].map((x) => `<circle cx="${x}" cy="${f(-7.2 - (1 - Math.abs(x) / 14) * 1.2)}" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      [[-10.6, 10], [10.6, 10], [-12.6, -2], [12.6, -2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<g fill="none" stroke-linecap="round"><path d="M-2 28C-8 26.4 -12.4 29 -12 33C-11.6 36 -8 36.6 -6.6 34.6C-5.6 33 -6.8 31.4 -8.4 32" stroke="${P.ink}" stroke-width="1.4"/><path d="M-2 28C-8 26.4 -12.4 29 -12 33C-11.6 36 -8 36.6 -6.6 34.6C-5.6 33 -6.8 31.4 -8.4 32" stroke="${P.goldL}" stroke-width=".6"/>` +
      `<path d="M2 28C8 26.4 12.4 29 12 33C11.6 36 8 36.6 6.6 34.6C5.6 33 6.8 31.4 8.4 32" stroke="${P.ink}" stroke-width="1.4"/><path d="M2 28C8 26.4 12.4 29 12 33C11.6 36 8 36.6 6.6 34.6C5.6 33 6.8 31.4 8.4 32" stroke="${P.goldL}" stroke-width=".6"/></g>` +
      `<path d="M0 25.4L2.2 28.6L0 31.8L-2.2 28.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><path d="M-.6 27.4L0 26.6" stroke="#fff" stroke-width=".4"/>` +
      // Volutas grabadas alrededor de la gema del dorso.
      `<path d="M-6.4 2C-9 0 -9 -3.6 -6.6 -4.4M6.4 2C9 0 9 -3.6 6.6 -4.4M-6 4.6C-8.4 6.6 -7.6 9 -5 8.6M6 4.6C8.4 6.6 7.6 9 5 8.6" fill="none" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>` +
      `<path d="${ellipse(0, 2, 6.2, 7)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".6"/><path d="${ellipse(0, 2, 6.2, 7)}" fill="none" stroke="${P.goldD}" stroke-width=".45" stroke-dasharray=".01 1.1" stroke-linecap="round" transform="translate(0 .2) scale(.86) translate(0 .3)"/>` +
      gem(k, 0, 2, 4.4, 5.4, GEMS[5][0], GEMS[5][1], 0.45) +
      F.map(([x, w, t], i) => `<path d="${ellipse(f(x + w / 2), f(t + 5.4), 2.9, 2.9)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>` + gem(k, f(x + w / 2), f(t + 5.4), 2.1, 2.1, GEMS[i][0], GEMS[i][1], 0.35)).join('') +
      `<path d="${ellipse(-17.6, -8.6, 2.8, 3.2)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>` + gem(k, -17.6, -8.6, 2, 2.4, GEMS[4][0], GEMS[4][1], 0.35) +
      `</g>` +
      sparkle(34, 30, 2.4, P.goldL) + sparkle(88, 26, 1.8, '#fff') + sparkle(30, 70, 1.4, '#fff') +
      k.defs()
    )
  },

  // ── Doble o nada ───────────────────────────────────────────────────

  // Cinco snaps: chasqueás y el rival traga saliva. La mano a punto de chasquear y la chispa entre los dedos.
  'Chasquido de dedos': (u) => {
    const k = kit(u)
    // Mano derecha vista de dorso: índice estirado, mayor apretado contra la yema del pulgar, anular y meñique doblados.
    const cuff = 'M-13 20H13L14.4 46H-14.6Z'
    const wrist = 'M-10.4 11H10.6L10.2 22H-10Z'
    const palm = 'M-12.4 -3.6C-13.6 2 -13 9 -10.6 15H11C13.4 9 14 2 13.2 -4C8 -6.6 -7 -6.4 -12.4 -3.6Z'
    const index = taper(-8.4, -1, -9.6, -16, -7.4, -31, 6.6, 5.6)
    const mid = taper(-1.4, -3, 1.6, -15.6, 7.6, -20.6, 6.4, 5.6)
    const thumb = taper(9.6, 9, 14.6, -2, 6.6, -16.4, 8, 6)
    const ring = roundRect(3.4, -8.6, 8.8, 3, 2.7)
    const pinky = roundRect(8.4, -6.4, 13, 3, 2.3)
    const all = [cuff, wrist, index, mid, palm, ring, pinky, thumb]
    const nail = (x: number, y: number, r: number) => `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="2.3" transform="rotate(${r} ${x} ${y})" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><ellipse cx="${f(x - 0.5)}" cy="${f(y - 0.6)}" rx=".5" ry=".9" transform="rotate(${r} ${x} ${y})" fill="#fff"/>`
    const sx = 68.6, sy = 42.2
    const lines = Array.from({ length: 9 }, (_, i) => {
      const a = (-170 + i * 26) * Math.PI / 180, r0 = 6, r1 = i % 2 ? 11 : 14.6
      return `<path d="M${f(sx + Math.cos(a) * r0)} ${f(sy + Math.sin(a) * r0)}L${f(sx + Math.cos(a) * r1)} ${f(sy + Math.sin(a) * r1)}" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M${f(sx + Math.cos(a) * r0)} ${f(sy + Math.sin(a) * r0)}L${f(sx + Math.cos(a) * r1)} ${f(sy + Math.sin(a) * r1)}" stroke="${P.goldL}" stroke-width="1" stroke-linecap="round"/>`
    }).join('')
    return (
      cosmos(k, 62, 50) +
      k.sun(64, 48, 16, 44, 28, false) +
      `<g transform="translate(59.4 67.6) scale(1.08)">${k.cast(all, 1.8, 1.6, '#0F1736')}</g>` +
      `<g transform="translate(58 66) scale(1.08)">` +
      k.draw([
        { d: cuff, fill: ELEC, line: 0.35, inner: `<path d="M-14 20H14V25.6H-14Z" fill="${P.gold}"/><path d="M-14 24.6H14" stroke="${P.goldD}" stroke-width=".6"/>` + k.sh('M3 19H16V46H3Z', 0, 0, 1, 0, 0, 0.9, ELEC_D, 0.4) + hair(-8, 30, -7, 36, -8.6, 44, 0.5, ELEC_D) + hair(5, 30, 6, 36, 5, 44, 0.45, ELEC_D) },
        { d: wrist, fill: P.skin, inner: k.sh('M2 8H12V23H2Z', 0, 0, 1, 0, 0, 0.9) },
        { d: index, fill: P.skin, line: 0.35, inner: k.sh(index, 0, 0, 1, 0, 0, 0.5, P.blue, 0.25) + `<path d="M-12 -8H-8.6L-8 -28H-10.6Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` + hair(-10.6, -13, -9.2, -12.2, -7.6, -12.8, 0.38) + nail(-7.6, -28.6, -6) },
        { d: mid, fill: P.skin, line: 0.35, inner: k.sh(mid, 0, 0, 1, 1, 0, 0.5, P.blue, 0.25) + hair(-1, -13, .2, -12.2, 1.4, -12.6, 0.35) },
        { d: palm, fill: P.skin, inner: k.sh('M3 -8C8 0 10 8 9 15H15V-8Z', 0, 0, 1, 0, 0, 0.9) + `<path d="M-14 -8H-2V16H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + hair(-4, 4, -1, 6, 0, 10, 0.4) },
        { d: pinky, fill: P.skin, line: 0.35, inner: k.sh('M10.6 -8H15V4H10.6Z', 0, 0, 1, 0, 0, 0.8) },
        { d: ring, fill: P.skin, line: 0.35, inner: k.sh('M6 -10H10V4H6Z', 0, 0, 1, 0, 0, 0.7) },
        { d: thumb, fill: P.skin, line: 0.35, inner: k.sh(thumb, 0, 0, 1, 0, 0, 0.5, P.blue, 0.25) + hair(11.6, 0, 12.8, -1.4, 13, -3.6, 0.38) + nail(7.8, -14.2, 34) },
      ], 0.62) +
      `</g>` +
      // La chispa entre el mayor y el pulgar.
      lines +
      `<path d="${starPath(sx, sy, 6.4, 1.6, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><path d="${starPath(sx, sy, 3.6, 1, 4, -45)}" fill="#fff"/>` +
      `<path d="M62.4 34.6C66 30.6 71.6 30.4 75 33.6" fill="none" stroke="${ELEC_L}" stroke-width="1" stroke-linecap="round" stroke-dasharray="2.4 1.4"/>` +
      hair(34, 40, 30, 46, 31, 54, 0.7, ELEC_L) + hair(30, 36, 25, 44, 26, 54, 0.6, ELEC_L, 0.7) +
      sparkle(90, 72, 2, '#fff') + sparkle(34, 76, 1.6, ELEC_L) +
      k.defs()
    )
  },

  // Veinte snaps: a veces tenías, a veces no. El farol del embaucador, con cuernos de cabra y fuego fatuo verde.
  'Farol de Loki': (u) => {
    const k = kit(u)
    const cap = 'M45.6 40.6C48 34.4 53.6 30.4 60 30.4C66.4 30.4 72 34.4 74.4 40.6Z'
    const capRim = 'M43.4 40.4H76.6L75.4 44H44.6Z'
    const glassC = 'M51.6 44H68.4V78H51.6Z'
    const glassL = 'M46 44H51.6V78H46.6Z'
    const glassR = 'M68.4 44H74V78H73.4Z'
    const foot = 'M44.6 78H75.4L72.6 83H47.4Z'
    const knob = 'M53.4 83H66.6C66.6 86.6 63.6 89 60 89C56.4 89 53.4 86.6 53.4 83Z'
    const horn = 'M0 0C-3 -4 -9 -6.4 -14.4 -5C-19.6 -3.6 -22.4 1 -21.4 6C-20.8 9 -18 10.6 -15.6 9.6C-17.6 8 -18 5.6 -17 3.4C-15.4 .2 -11 -.6 -7.6 1.2C-5 2.6 -3 4.4 -1.4 6Z'
    const ridges = [-4, -8, -12, -16].map((x) => `<path d="M${x} ${f(-0.6 - Math.abs(x) * 0.2)}C${x - 0.6} ${f(1.2 - Math.abs(x) * 0.1)} ${x - 0.4} ${f(2.6 - Math.abs(x) * 0.05)} ${x + 0.6} ${f(3.8 - Math.abs(x) * 0.08)}" fill="none" stroke="${P.goldD}" stroke-width=".45"/>`).join('')
    const flameOut = 'M60 50C64 55 68.6 59 68.2 66C67.8 72 64.4 75.6 60 75.6C55.6 75.6 52.2 72 51.8 66C51.6 61.6 54 58.6 55.8 56.6C55.8 59.6 56.8 61.6 58.4 62.4C57.8 58 58.2 54 60 50Z'
    const flameIn = 'M60 60C62.4 63 64 65.4 63.8 68.6C63.6 71.6 62 73.4 60 73.4C58 73.4 56.4 71.6 56.2 68.6C56.1 66.6 57.2 64.6 58.4 63.4C58.6 65 59.2 65.8 60 66.2C59.8 64.2 59.8 62.2 60 60Z'
    const bars = `<path d="M51.6 44V78M68.4 44V78" stroke="${P.ink}" stroke-width="2.4"/><path d="M51.6 44V78M68.4 44V78" stroke="${P.gold}" stroke-width="1.2"/>`
    return (
      cosmos(k, 60, 62, EMER) +
      k.shade(ellipse(60, 62, 30, 30), k.rad(EMER_L, 0.5, 0.5, 0.5, 0.75, 0), EMER_L, 0.4) +
      k.sun(60, 62, 16, 44, 24, false) +
      // Cadena y argolla.
      `<path d="M60 17V30.4" stroke="${P.ink}" stroke-width="2.4"/><path d="M60 17V30.4" stroke="${P.gold}" stroke-width="1.1" stroke-dasharray="1.8 .8"/>` +
      `<circle cx="60" cy="27.6" r="2.4" fill="none" stroke="${P.ink}" stroke-width="2"/><circle cx="60" cy="27.6" r="2.4" fill="none" stroke="${P.gold}" stroke-width=".9"/>` +
      // Los cuernos del embaucador, sobre el techo.
      `<g transform="translate(52.6 35.6) rotate(8)">` + k.draw([{ d: horn, fill: P.gold, inner: k.sh(horn, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + ridges }], 0.55) + `</g>` +
      `<g transform="translate(67.4 35.6) rotate(-8) scale(-1 1)">` + k.draw([{ d: horn, fill: P.gold, inner: k.sh(horn, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + ridges }], 0.55) + `</g>` +
      k.floor(60, 89.6, 18, 2.4, '#000') +
      k.draw([
        { d: cap, fill: P.gold, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M49 39C51 35 55 32.6 60 32.4" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-linecap="round"/>` + `<path d="M52 40.6L54 33.6M60 40.6V30.4M68 40.6L66 33.6" stroke="${P.goldD}" stroke-width=".45"/>` },
        { d: capRim, fill: P.gold, inner: k.sh(capRim, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: glassL, fill: EMER_D, inner: k.sh(glassL, 0, 0, 1, 0, 0.2, 0.9, P.night, 0.4) },
        { d: glassR, fill: EMER_D, inner: k.sh(glassR, 0, 0, 1, 0, 0, 0.6, P.night, 0.4) },
        { d: glassC, fill: EMER, inner: `<path d="${glassC}" fill="${k.rad(EMER_L, 0.5, 0.62, 0.6, 1, 0)}"/>` + k.sh(glassC, 0, 0, 1, 1, 0, 0.6, EMER_D, 0.3) },
        { d: foot, fill: P.gold, inner: k.sh(foot, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: knob, fill: P.gold, inner: k.sh(knob, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
      ], 0.7) +
      // El fuego fatuo.
      k.draw([{ d: flameOut, fill: EMER_L, inner: k.sh(flameOut, 0, 0, 1, 1, 0, 0.8, EMER, 0.45) }], 0.45) +
      `<path d="${flameIn}" fill="#fff"/>` + k.shade(flameIn, k.lin(EMER_L, 0, 0, 0, 1, 0, 0.8), EMER_L, 0.3) +
      `<path d="M53.4 46V75" stroke="#fff" stroke-width="1.1" opacity=".55"/>` + hair(47.4, 47, 48, 60, 47.4, 74, 0.5, EMER_L, 0.8) +
      bars +
      `<path d="M45.4 44H74.6M46 78H74" stroke="${P.ink}" stroke-width="1.6"/><path d="M45.4 44H74.6M46 78H74" stroke="${P.goldL}" stroke-width=".6"/>` +
      `<circle cx="60" cy="86.4" r="1.1" fill="${EMER}" stroke="${P.ink}" stroke-width=".3"/>` +
      hair(30, 54, 34, 50, 38, 50, 0.5, EMER_L, 0.8) + hair(90, 54, 86, 50, 82, 50, 0.5, EMER_L, 0.8) +
      sparkle(84, 30, 2.4, EMER_L) + sparkle(34, 32, 1.8, '#fff') + sparkle(86, 82, 1.4, '#fff') +
      k.defs()
    )
  },

  // Sesenta snaps: chasqueás y desaparece medio grupo de la mesa. La mano de seis cartas, y la mitad se vuelve polvo.
  'Snap de Thanos': (u) => {
    const k = kit(u)
    const px = 60, py = 104, N = 6, S = 1.32
    const angle = (i: number) => -30 + i * 12.4
    // Cuánto queda de cada carta: las tres de la derecha se deshacen.
    const rem = [1, 1, 1, 0.62, 0.34, 0.1]
    const r = rnd(11)
    let dust = ''
    const cards = Array.from({ length: N }, (_, i) => {
      const a = angle(i), t = `translate(${px} ${py}) rotate(${a}) translate(0 -14) scale(${S})`
      if (rem[i] >= 1) return `<g transform="${t}">${k.cast([roundRect(-9, -27, 9, 0, 1.6)], 1.2, 1.2, '#0F1736')}${gemCard(k, GEMS[i][0], GEMS[i][1])}</g>`
      // Borde roto desparejo y el polvo que se va hacia arriba a la derecha.
      const edge: string[] = []
      for (let j = 0; j <= 10; j++) {
        const y = 1 - j * 2.9, x = -9 + 18 * rem[i] + (j % 2 ? 1.6 : -1.4) * (0.6 + r())
        edge.push(`${f(x)} ${f(y)}`)
      }
      const keep = `M-10 1.4L${edge.join('L')}L-10 -28.6Z`
      const rad = (a * Math.PI) / 180, ca = Math.cos(rad), sa = Math.sin(rad)
      for (let j = 0; j < 34; j++) {
        const ly = -r() * 27, lx = -9 + 18 * rem[i] + r() * 2, drift = 1 + r() * 26 * (1.2 - rem[i])
        const gx = px + S * (lx * ca - ly * sa) + 14 * sa + drift, gy = py + S * (lx * sa + ly * ca) - 14 * ca - drift * 0.6 - r() * 3
        const sc = Math.max(0.45, 2 - drift / 16)
        const c = j % 4 === 0 ? P.gold : j % 4 === 1 ? GEMS[i][0] : j % 4 === 2 ? P.white : P.goldL
        dust += `<path d="M0 -1.2L1.2 .3L-.4 1.1Z" transform="translate(${f(gx)} ${f(gy)}) rotate(${f(r() * 360)}) scale(${f(sc)})" fill="${c}" stroke="${P.ink}" stroke-width="${f(0.25 / sc)}" opacity="${f(Math.max(0.35, 1 - drift / 38))}"/>`
      }
      return `<g transform="${t}">` + k.clip(keep, gemCard(k, GEMS[i][0], GEMS[i][1])) + `<path d="M${edge.join('L')}" fill="none" stroke="${P.goldL}" stroke-width=".6"/></g>`
    }).join('')
    return (
      cosmos(k, 60, 56) +
      k.sun(58, 62, 16, 50, 32, false) +
      k.shade(ellipse(58, 66, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.35) +
      cards + dust +
      hair(72, 34, 82, 28, 94, 28, 0.6, P.paper, 0.7) + hair(78, 44, 88, 40, 100, 41, 0.5, P.paper, 0.6) + hair(84, 54, 92, 52, 100, 54, 0.45, P.paper, 0.5) +
      sparkle(32, 32, 3.4, P.goldL) + sparkle(26, 50, 1.6, '#fff') +
      k.defs()
    )
  },
}
