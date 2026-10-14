// Desafío de tiros libres en clave heroica: la pelota naranja, el aro con su red, la línea de libres sobre el parquet
// y los objetos del tirador (la muñequera, el pañuelo de seda, la mira, la máquina lanzadora). Piezas en
// ./_basquet-piezas.ts.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { backboard, bball, GEORGIA, hoopNet, parquet, rimBack, rimFront, swoosh } from './_basquet-piezas'

/** Seda del pañuelo: un celeste pálido con su sombra. */
const SEDA = '#C9473D', SEDA_D = '#6A1F31', SEDA_L = '#F3A49B'

/** Engranaje de `n` dientes en (x,y). */
function gear(k: Kit, x: number, y: number, r: number, n: number) {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a0 = (i / (n * 2)) * Math.PI * 2, a1 = ((i + 1) / (n * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.8 : r
    d += (i ? 'L' : 'M') + `${f(x + Math.cos(a0) * rr)} ${f(y + Math.sin(a0) * rr)}L${f(x + Math.cos(a1) * rr)} ${f(y + Math.sin(a1) * rr)}`
  }
  d += 'Z'
  return k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<circle cx="${x}" cy="${y}" r="${f(r * 0.5)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.5) +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.24)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/>`
}

export const TIROSLIBRES_ART: Record<string, (u: number) => string> = {
  // ── Muñeca perfecta ────────────────────────────────────────────────

  // Diez de diez: la pelota que pasa por la red sin tocar el aro. ¡Swish!
  'Swish': (u) => {
    const k = kit(u)
    const C = [60, 56], RX = 16
    const net = hoopNet(C[0], C[1], RX, 25, { flare: 0.35, sway: 1.6, levels: 5 })
    return (
      k.day() +
      k.sun(60, 48, 15, 44, 28, false) +
      backboard(k, 40, 29, 80, 52) +
      k.draw([{ d: 'M56 51H64V55H56Z', fill: P.mid }], 0.5) +
      net.back +
      rimBack(C[0], C[1], RX) +
      k.clip(`M20 ${C[1]}H100V100H20Z`, bball(k, 60.6, 71, 10.4, { rot: 14 })) +
      rimFront(C[0], C[1], RX) +
      net.front +
      hair(41, 60, 39, 64, 40, 68, 0.7, P.mid) + hair(80, 64, 82, 70, 80, 77, 0.8, P.mid) +
      `<text x="34" y="77" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" text-anchor="middle" transform="rotate(-10 34 77)">¡swish!</text>` +
      sparkle(84, 64, 2.2) + sparkle(77, 86, 1.4) + sparkle(36, 64, 1.4) +
      k.defs()
    )
  },

  // Cinco rondas perfectas: el pañuelo de seda, y la pelota que sale sola, flotando.
  'Mano de seda': (u) => {
    const k = kit(u)
    const silk = 'M27.6 82.6C33 76 40 80.4 46 76.6C52 72.6 58 79 64.6 75.4C71 72 78.6 77.4 84 73C87 70.6 90 70.4 92.4 72L88.6 93.6C83 90 77 95.4 70 92C63 88.6 56 95.6 49 92.6C42 89.6 35 95 29.6 92.4Z'
    const back = 'M27.6 82.6C30 79 33 78 36 78.4L33 91C31.6 91.4 30.4 91.8 29.6 92.4Z'
    return (
      k.day() +
      k.stage(60, 58, 36) +
      k.shade(ellipse(60, 50, 24, 24), k.rad(P.white, 0.5, 0.5, 0.5, 0.9, 0), P.white, 0.4) +
      k.floor(60, 84, 22, 2.6, P.blue) +
      swoosh(60, 50, 90, 15, P.blue) +
      bball(k, 60, 50, 15, { rot: -14 }) +
      k.cast([silk], 2, 2, P.mid) +
      k.draw([
        { d: back, fill: SEDA_D },
        {
          d: silk, fill: SEDA,
          inner:
            k.sh(silk, 0, 0, 1, 1, 0, 0.8, SEDA_D, 0.45) +
            // Brillos de la seda y los pliegues.
            hair(31, 86, 40, 80, 46, 79, 1.2, SEDA_L, 0.95) + hair(50, 82, 57, 78.6, 64, 79.4, 1.1, SEDA_L, 0.9) + hair(68, 79, 76, 75, 84, 76, 1, SEDA_L, 0.85) + hair(34, 84, 38, 82, 41, 81.6, 0.5, '#fff', 0.9) +
            hair(46, 77, 47, 84, 45, 92, 0.6, SEDA_D) + hair(64.6, 76, 66, 84, 64, 91, 0.6, SEDA_D) + hair(84, 74, 83, 82, 85, 90, 0.5, SEDA_D) +
            `<path d="M29.4 89.6C35 92.6 42 87 49 90C56 93 63 86 70 89.4C77 92.8 83 87.6 88.2 90.8" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-dasharray="1 .7"/>`,
        },
      ], 0.7) +
      // Flecos dorados en las puntas.
      [[29.6, 92.4], [88.6, 93.6]].map(([x, y]) => [-1.4, 0, 1.4].map((o) => hair(x + o, y, x + o * 1.4, y + 2, x + o * 1.6, y + 4, 0.5, P.goldD)).join('')).join('') +
      sparkle(36, 40, 2.4) + sparkle(84, 36, 1.8) + sparkle(82, 58, 1.3) + sparkle(40, 62, 1.2) +
      k.defs()
    )
  },

  // Quince rondas perfectas: la línea de libres con tu nombre en una placa de bronce, como en el paseo de la fama.
  'Línea de libres propia': (u) => {
    const k = kit(u)
    const key = 'M48.6 54H71.4L84 80H36Z'
    const plate = 'M41.4 75.6H78.6L81.4 85.6H38.6Z'
    return (
      k.day() +
      k.sun(60, 44, 13, 40, 32) +
      // El aro, al fondo.
      k.draw([{ d: 'M59.2 42H60.8V54H59.2Z', fill: P.mid }], 0.4) +
      backboard(k, 51, 31, 69, 41.6, { r: 0.8 }) +
      rimBack(60, 43.4, 5) + rimFront(60, 43.4, 5) +
      `<path d="M55.6 44.6L56.8 49H63.2L64.4 44.6M56.4 47H63.6" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      parquet(k, 54, {
        inner:
          `<path d="${key}" fill="${P.mid}"/>` + k.sh(key, 0, 0, 0, 1, 0, 0.7, P.ink, 0.35) +
          `<path d="${key}" fill="none" stroke="#fff" stroke-width="1.1"/>` +
          `<path d="M36 80A24 9 0 0 0 84 80" fill="none" stroke="#fff" stroke-width="1.1"/>` +
          `<path d="M36 80A24 6 0 0 1 84 80" fill="none" stroke="#fff" stroke-width=".7" stroke-dasharray="2 1.6"/>` +
          `<path d="M30 80H90" stroke="#fff" stroke-width="2.2"/>`,
      }) +
      laurel(36.6, 84, 33, 76, 37, 70, 5) + laurel(83.4, 84, 87, 76, 83, 70, 5, true) +
      k.draw([{
        d: plate, fill: P.gold,
        inner: k.sh(plate, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M38 75H54L50 86H38Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          `<path d="M42.4 76.8H77.6L80 84.4H40Z" fill="none" stroke="${P.goldD}" stroke-width=".45"/>`,
      }], 0.65) +
      `<text x="60" y="83" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" text-anchor="middle">tu nombre</text>` +
      [[41.6, 77.6], [78.4, 77.6], [40.4, 83.8], [79.6, 83.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('') +
      k.floor(84, 72, 8, 1.6, P.brownD) +
      bball(k, 83, 65.6, 7, { rot: 20 }) +
      sparkle(32, 44, 2.2, P.white) + sparkle(30, 66, 1.4, P.white) + sparkle(62, 92, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Tirador ────────────────────────────────────────────────────────

  // Quince adentro en una partida: la muñequera prende fuego, y el termómetro explota.
  'Muñeca caliente': (u) => {
    const k = kit(u)
    const C = [54, 52], RX = 15.6, RY = 4.8, H = 22
    const body = `M${C[0] - RX} ${C[1]}V${C[1] + H}A${RX} ${RY} 0 0 0 ${C[0] + RX} ${C[1] + H}V${C[1]}A${RX} ${RY} 0 0 1 ${C[0] - RX} ${C[1]}Z`
    const stripe = (y: number) => `M${C[0] - RX} ${y}A${RX} ${RY} 0 0 0 ${C[0] + RX} ${y}V${y + 2.4}A${RX} ${RY} 0 0 1 ${C[0] - RX} ${y + 2.4}Z`
    let terry = ''
    for (let x = C[0] - RX + 1.6; x < C[0] + RX; x += 1.8) terry += `M${f(x)} ${C[1] + 5}v1.2M${f(x + 0.9)} ${C[1] + 13.4}v1.2M${f(x)} ${C[1] + 19}v1.2`
    const tube = roundRect(-2.2, -24, 2.2, 4, 2.2), bulb = ellipse(0, 6.6, 4, 4)
    return (
      k.day() +
      k.sun(56, 52, 13, 42, 28, false) +
      flame(k, `translate(${C[0]} ${C[1] + 2}) scale(.42) translate(-60 -90)`) +
      k.floor(C[0], C[1] + H + 5, 19, 2.4, P.mid) +
      k.draw([{
        d: body, fill: P.white,
        inner:
          k.sh(body, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M${C[0] - RX} 40H${C[0] - RX + 6}V90H${C[0] - RX}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.8, 0)}"/>` +
          `<path d="${terry}" stroke="${P.sky}" stroke-width=".5" stroke-linecap="round"/>` +
          `<path d="${stripe(C[1] + 7.4)}" fill="${P.red}"/><path d="${stripe(C[1] + 15.6)}" fill="${P.red}"/>` +
          k.sh(stripe(C[1] + 7.4), 0, 0, 1, 0, 0, 0.7, P.wine, 0.4) + k.sh(stripe(C[1] + 15.6), 0, 0, 1, 0, 0, 0.7, P.wine, 0.4),
      }], 0.8) +
      `<path d="${ellipse(C[0], C[1], RX, RY)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".8"/>` +
      `<path d="${ellipse(C[0], C[1] + 0.6, RX - 2.2, RY - 1.4)}" fill="${P.mid}"/>` +
      k.clip(ellipse(C[0], C[1] + 0.6, RX - 2.2, RY - 1.4), `<path d="${ellipse(C[0], C[1] - 1.6, RX - 2, RY - 1)}" fill="${P.goldD}" opacity=".7"/>`) +
      // Las lenguas de fuego chicas que salen de la boca de la muñequera.
      flame(k, `translate(${C[0]} ${C[1] + 1}) scale(.2 .16) translate(-60 -90)`) +
      bball(k, C[0], C[1] + 12.4, 4.4, { rot: 10 }) +
      // El termómetro, con el mercurio pasado de rosca.
      `<g transform="translate(83 66) rotate(16)">` +
      k.draw([
        { d: tube, fill: P.white, inner: k.sh(tube, 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) + `<path d="M-.9 -23V4H.9V-23Z" fill="${P.red}"/>` + [-18, -13, -8, -3].map((y) => `<path d="M-2.2 ${y}H-.6" stroke="${P.ink}" stroke-width=".4"/>`).join('') },
        { d: bulb, fill: P.red, inner: k.sh(bulb, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) },
      ], 0.55) +
      `<ellipse cx="-1.3" cy="5.2" rx=".9" ry="1.3" fill="#fff" opacity=".8"/>` +
      `<path d="${starPath(0, -25.6, 4.4, 1.6, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      hair(32, 66, 29, 62, 31, 56, 0.8, P.mid) + hair(29, 72, 26, 68, 27.6, 63, 0.6, P.mid) +
      k.defs()
    )
  },

  // Veinticinco adentro: el aro visto por la mira telescópica, con el punto rojo en el medio de la red.
  'Francotirador del aro': (u) => {
    const k = kit(u)
    const C = [60, 58], R = 31
    const lens = ellipse(C[0], C[1], R, R)
    const net = hoopNet(60, 63, 13.4, 17)
    const mils = [-24, -18, -12, -6, 6, 12, 18, 24].map((o) => `M${C[0] + o} ${C[1] - 0.9}V${C[1] + 0.9}M${C[0] - 0.9} ${C[1] + o}H${C[0] + 0.9}`).join('')
    return (
      k.night() +
      [[28, 26], [92, 28], [24, 92], [98, 86]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      `<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="${P.paper}"/>` +
      k.clip(lens,
        k.sun(60, 50, 12, 34, 28, false) +
        backboard(k, 40, 34, 80, 58) +
        k.draw([{ d: 'M55.6 57H64.4V61.6H55.6Z', fill: P.mid }], 0.5) +
        net.back + rimBack(60, 63, 13.4) + rimFront(60, 63, 13.4) + net.front +
        `<path d="${lens}" fill="${k.rad(P.night, 0.5, 0.5, 0.5, 0, 0.75)}"/>`) +
      // La retícula: la cruz, los puntos de mil y el punto rojo.
      `<path d="M${C[0] - R} ${C[1]}H${C[0] - 5}M${C[0] + 5} ${C[1]}H${C[0] + R}M${C[0]} ${C[1] - R}V${C[1] - 5}M${C[0]} ${C[1] + 5}V${C[1] + R}" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M${C[0] - R} ${C[1]}H${C[0] - 20}M${C[0] + 20} ${C[1]}H${C[0] + R}M${C[0]} ${C[1] - R}V${C[1] - 20}M${C[0]} ${C[1] + 20}V${C[1] + R}" stroke="${P.ink}" stroke-width="1.8"/>` +
      `<path d="${mils}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<circle cx="${C[0]}" cy="${C[1]}" r="1.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.shade(ellipse(C[0], C[1], 3.4, 3.4), k.rad(P.red, 0.5, 0.5, 0.5, 0.8, 0), P.red, 0.4) +
      `<text x="${C[0] + 14}" y="${C[1] + 15}" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.red}" text-anchor="middle">25×</text>` +
      // El tubo de la mira.
      `<circle cx="${C[0]}" cy="${C[1]}" r="${R + 1.4}" fill="none" stroke="${P.ink}" stroke-width="4.4"/>` +
      `<circle cx="${C[0]}" cy="${C[1]}" r="${R + 1.4}" fill="none" stroke="${P.mid}" stroke-width="2.6"/>` +
      `<path d="M${C[0] - R + 2} ${C[1] - 12}A${R + 1.4} ${R + 1.4} 0 0 1 ${C[0] - 10} ${C[1] - R + 1.4}" fill="none" stroke="${P.sky}" stroke-width=".8" stroke-linecap="round"/>` +
      `<circle cx="${C[0]}" cy="${C[1]}" r="${R + 3}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      sparkle(90, 44, 1.8, P.paper) + sparkle(28, 72, 1.4, P.paper) +
      k.defs()
    )
  },

  // Cuarenta adentro: la máquina lanzadora, con la tolva llena de pelotas, el contador en 40 y la antenita. ¿Sos un robot?
  'Máquina de lanzar': (u) => {
    const k = kit(u)
    const box = roundRect(32, 63, 76, 93, 3)
    const panel = roundRect(36, 69, 66, 89, 1.4)
    const hopper = 'M31 47H57L53 64H35Z'
    const tube = roundRect(0, -5.6, 22, 5.6, 1.6), muzzle = roundRect(20, -7, 25, 7, 1.2)
    const display = roundRect(53, 80.6, 63.6, 87, 0.8)
    return (
      k.day() +
      k.sun(60, 60, 18, 48, 32) +
      k.floor(55, 97, 26, 2.6, P.mid) +
      gear(k, 77.4, 62, 7.4, 10) +
      `<g transform="translate(68 66) rotate(-50)">` +
      k.draw([
        { d: tube, fill: P.sky1, inner: k.sh(tube, 0, 0, 0, 1, 0, 0.85, P.blue, 0.45) + `<path d="M0 -5.6H22V-2.4H0Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.8, 0)}"/>` + `<path d="M8 -5.6V5.6M16 -5.6V5.6" stroke="${P.blue}" stroke-width=".5"/>` },
        { d: muzzle, fill: P.gold, inner: k.sh(muzzle, 0, 0, 0, 1, 0, 0.85, P.goldD, 0.45) },
      ], 0.65) +
      `</g>` +
      swoosh(86.4, 41.6, 140, 6.4, P.mid) +
      bball(k, 86.4, 41.6, 6.4, { rot: 30 }) +
      // Las pelotas que esperan en la tolva.
      bball(k, 38.6, 46, 6.4, { rot: 10 }) + bball(k, 50.4, 45.4, 6.4, { rot: -30 }) +
      k.draw([{
        d: hopper, fill: P.sky2,
        inner: k.sh(hopper, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) + `<path d="M31 47H39L37 64H35Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` +
          `<path d="M32.4 52H55.6M33.6 57.4H54.4" stroke="${P.mid}" stroke-width=".5"/>`,
      }], 0.65) +
      // La antenita.
      `<path d="M70 63V52" stroke="${P.ink}" stroke-width="1.4"/><path d="M70 63V52" stroke="${P.sky2}" stroke-width=".6"/><circle cx="70" cy="51" r="1.8" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="69.4" cy="50.4" r=".5" fill="#fff"/>` +
      k.draw([
        { d: ellipse(39, 94.4, 3.6, 3.6), fill: P.night },
        { d: ellipse(69, 94.4, 3.6, 3.6), fill: P.night },
        {
          d: box, fill: P.mid,
          inner: k.sh(box, 0, 0, 1, 1, 0, 0.85, P.night, 0.5) + `<path d="M32 63H76V67H32Z" fill="${k.lin(P.sky, 0, 0, 0, 1, 0.8, 0)}"/>` +
            [[34.4, 65.4], [73.6, 65.4], [34.4, 90.6], [73.6, 90.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('') +
            `<path d="M68 72H73M68 75H73M68 78H73M68 81H73M68 84H73" stroke="${P.night}" stroke-width=".9" stroke-linecap="round"/>`,
        },
      ], 0.8) +
      k.draw([{ d: panel, fill: P.sky1, inner: k.sh(panel, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.45) +
      // El reloj de presión, las luces y el contador.
      `<circle cx="44" cy="79" r="6" fill="${P.white}" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="M39.6 81.4A5 5 0 0 1 48.4 81.4" fill="none" stroke="${P.sky}" stroke-width=".9"/><path d="M47.2 76.8A5 5 0 0 1 48.4 81.4" fill="none" stroke="${P.red}" stroke-width=".9"/>` +
      `<path d="M44 79L47.6 76.2" stroke="${P.red}" stroke-width=".7" stroke-linecap="round"/><circle cx="44" cy="79" r=".8" fill="${P.ink}"/>` +
      `<circle cx="55.4" cy="74" r="1.5" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><circle cx="60.4" cy="74" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<circle cx="54.9" cy="73.5" r=".45" fill="#fff"/><circle cx="59.9" cy="73.5" r=".45" fill="#fff"/>` +
      k.draw([{ d: display, fill: P.night }], 0.35) +
      `<text x="58.3" y="86" ${GEORGIA} font-weight="700" font-size="5.6" fill="${P.goldL}" text-anchor="middle">40</text>` +
      sparkle(30, 34, 1.8, P.white) + sparkle(84, 78, 1.4, P.white) +
      k.defs()
    )
  },
}
