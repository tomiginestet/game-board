// Medallas generales redibujadas (ver el kit en ../kit.ts): Habitué, Todoterreno y Mesa larga.
import { f } from '../helpers'
import { card, die, ellipse, flame, hair, kit, MEEPLE, meeple, P, roundRect, sparkle, starPath } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'

export const GENERALES_B_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Habitué ────────────────────────────────────────────────────────

  // Diez partidas: ya marcás tarjeta.
  'Fichado': (u) => {
    const k = kit(u)
    const tc = roundRect(38, 32, 70, 94, 2)
    const rows = Array.from({ length: 7 }, (_, i) => `<path d="M40 ${50 + i * 6.4}H68" stroke="${P.sky2}" stroke-width=".55"/>`).join('') + `<path d="M48.6 44V94M59.4 44V94" stroke="${P.sky2}" stroke-width=".55"/>`
    const marks = [[44.2, 52.4], [44.2, 58.8], [53.8, 52.4], [53.8, 58.8], [44.2, 65.2], [53.8, 65.2]].map(([x, y]) => `<rect x="${x - 3}" y="${y - 1.6}" width="6" height="2.2" fill="${P.mid}" opacity=".55"/>`).join('')
    const clock = ellipse(86, 40, 9.6, 9.6)
    return (
      k.day() +
      k.stage(58, 64, 33) +
      `<g transform="translate(-4 0) rotate(-8 54 63)">` +
      k.cast([tc], 2.4, 2) +
      k.draw([{
        d: tc, fill: P.white, line: 0.4,
        inner: `<path d="M36 30H72V43H36Z" fill="${P.sky}"/>` + rows + marks + k.sh('M58 30H72V96H58Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) +
          `<text x="54" y="40" ${GEORGIA} font-weight="700" font-size="5.6" letter-spacing=".6" fill="${P.ink}" text-anchor="middle">TARJETA</text>`,
      }]) +
      `<circle cx="54" cy="35" r="1.2" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      `<g transform="translate(-4 0) rotate(-16 58 72)" opacity=".92">` +
      `<rect x="40" y="65" width="36" height="13" rx="1.4" fill="${P.red}" opacity=".08" stroke="${P.red}" stroke-width="1.3"/>` +
      `<rect x="42" y="67" width="32" height="9" rx=".8" fill="none" stroke="${P.red}" stroke-width=".45"/>` +
      `<text x="58" y="74.2" ${GEORGIA} font-weight="700" font-size="6" letter-spacing=".3" fill="${P.red}" text-anchor="middle">FICHADO</text>` +
      `</g>` +
      k.draw([
        { d: clock, fill: P.gold, inner: k.sh(clock, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) },
        { d: ellipse(86, 40, 7.4, 7.4), fill: P.white, inner: k.sh(ellipse(86, 40, 7.4, 7.4), 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) },
      ], 0.6) +
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return `<path d="M${f(86 + Math.cos(a) * 5.6)} ${f(40 + Math.sin(a) * 5.6)}L${f(86 + Math.cos(a) * (i % 3 ? 6.3 : 6.8))} ${f(40 + Math.sin(a) * (i % 3 ? 6.3 : 6.8))}" stroke="${P.ink}" stroke-width="${i % 3 ? 0.35 : 0.7}"/>`
      }).join('') +
      `<path d="M86 40V35M86 40H82" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><circle cx="86" cy="40" r=".9" fill="${P.red}"/>` +
      sparkle(33, 40, 2) + sparkle(86, 80, 1.6) +
      k.defs()
    )
  },

  // Veinticinco partidas: nadie se sienta en tu lugar.
  'Silla con tu nombre': (u) => {
    const k = kit(u)
    const posts = ['M43.4 59V30C43.4 27.6 47.4 27.6 47.4 30V59Z', 'M72.6 59V30C72.6 27.6 76.6 27.6 76.6 30V59Z']
    const rail = 'M43.4 28.6C50 24.4 70 24.4 76.6 28.6V33.4C70 29.6 50 29.6 43.4 33.4Z'
    const slat = 'M47.4 47H72.6V50.6H47.4Z'
    const seat = 'M38 57H82L87 66H33Z'
    const apron = 'M33 66H87V70.6H33Z'
    const legs = ['M36 70.6L34 97H38.6L40.6 70.6Z', 'M84 70.6L86 97H81.4L79.4 70.6Z']
    const backLegs = ['M46 70.6L45.4 89H48.6L49.2 70.6Z', 'M74 70.6L74.6 89H71.4L70.8 70.6Z']
    const sign = roundRect(48, 35, 72, 45.4, 1.2)
    const wood = (d: string) => ({ d, fill: P.brown, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.4) })
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(61, 97, 28, 2.6) +
      k.draw(backLegs.map(wood), 0.6) +
      k.draw([
        ...posts.map(wood), wood(slat),
        { d: rail, fill: P.brown, inner: k.sh(rail, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) + `<path d="M46 28.6Q60 25.6 74 28.6" fill="none" stroke="${P.goldL}" stroke-width=".6" opacity=".7"/>` },
        ...legs.map(wood),
        { d: apron, fill: P.brownD, inner: k.sh(apron, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
        { d: seat, fill: P.red, line: 0.4, inner: k.sh(seat, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + [[48, 61.4], [60, 61.4], [72, 61.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.wine}"/>`).join('') + `<path d="M40 59H64" stroke="#fff" stroke-width=".8" opacity=".4"/>` },
      ], 0.7) +
      `<path d="M51 35.4L60 30.4L69 35.4" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="rotate(-5 60 40)">` +
      k.draw([{ d: sign, fill: P.white, inner: k.sh('M66 34H74V47H66Z', 0, 0, 1, 0, 0, 0.7, P.blue, 0.3) + `<rect x="49.2" y="36.2" width="21.6" height="8" rx=".8" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.5) +
      `<text x="60" y="42.4" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle">Reservado</text>` +
      `</g>` +
      sparkle(86, 34, 2.2) + sparkle(32, 50, 1.6) +
      k.defs()
    )
  },

  // Cincuenta partidas: ya tenés copia de la llave (y el ojo de la llave es un meeple).
  'Llave de la casa': (u) => {
    const k = kit(u)
    const shaft = 'M-2.4 -8H2.4V27H-2.4Z'
    const bit = 'M2.2 15.6H9.4V19.4H6.8V22.2H9.4V27H2.2Z'
    const collar = roundRect(-4.2, -9.6, 4.2, -5.6, 1.2)
    const gold = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.4) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` })
    const tag = 'M0 0L4.4 -3H18C19 -3 19.6 -2.4 19.6 -1.4V8.4C19.6 9.4 19 10 18 10H4.4Z'
    return (
      k.day() +
      k.sun(60, 58, 18, 44, 28, false) +
      `<g transform="translate(58 62) rotate(-38)">` +
      k.cast([shaft, bit], 1.6, 1.6) +
      k.draw([gold(shaft), gold(bit), gold(collar, 0.35)], 0.7) +
      `<g transform="translate(0 -20) scale(.5)">` +
      k.draw([gold(MEEPLE)], 1.3) +
      `<path d="${ellipse(0, -16.8, 4.6, 4.6)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width="1.2"/>` +
      hair(-6, 6, -4.6, 11, -6.6, 17, 1.1, P.goldD) + hair(6, 6, 4.6, 11, 6.6, 17, 1.1, P.goldD) +
      `</g>` +
      `<path d="M-1.2 -4V24" stroke="${P.goldL}" stroke-width=".6"/>` +
      `</g>` +
      `<circle cx="47.6" cy="44" r="4.6" fill="none" stroke="${P.ink}" stroke-width="2.4"/><circle cx="47.6" cy="44" r="4.6" fill="none" stroke="${P.white}" stroke-width="1.1"/>` +
      `<path d="M44.4 47.4C42 54 40 58 37.4 62" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `<g transform="translate(30 62) rotate(70)">` +
      k.draw([{ d: tag, fill: P.white, inner: k.sh('M12 -4H20V11H12Z', 0, 0, 1, 0, 0, 0.7, P.blue, 0.3) }], 0.5) +
      `<circle cx="6" cy="3.5" r="1" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="13" y="5.6" ${GEORGIA} font-style="italic" font-size="5.2" fill="${P.ink}" text-anchor="middle">casa</text>` +
      `</g>` +
      sparkle(86, 40, 2.4) + sparkle(84, 82, 1.6) +
      k.defs()
    )
  },

  // Cien partidas: te declararon monumento histórico, con placa azul y todo.
  'Patrimonio del grupo': (u) => {
    const k = kit(u)
    const plate = ellipse(60, 60, 25, 29)
    const joints = Array.from({ length: 9 }, (_, i) => {
      const y = 22 + i * 10, off = i % 2 ? 0 : 10
      return `<path d="M0 ${y}H120" stroke="${P.sky2}" stroke-width=".5"/>` + Array.from({ length: 7 }, (_, j) => `<path d="M${off + j * 20} ${y}V${y + 10}" stroke="${P.sky2}" stroke-width=".5"/>`).join('')
    }).join('')
    const leaf = (x: number, y: number, r: number) => `<path d="M0 0C1.6 -2.6 4.6 -3 6 -1.6C4.6 .4 2 1.4 0 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${P.green}" stroke="${P.ink}" stroke-width=".35"/>`
    return (
      `<rect width="120" height="130" fill="${P.paper}"/>` + joints +
      k.shade('M0 0H120V130H0Z', k.rad(P.sky2, 0.5, 0.46, 0.7, 0, 1), '#9EB1DB', 0.5) +
      k.cast([plate], 2.6, 2.6) +
      k.draw([
        { d: plate, fill: P.gold, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) },
        { d: ellipse(60, 60, 21.6, 25.6), fill: P.night, inner: k.sh(ellipse(60, 60, 21.6, 25.6), 0, 0, 1, 1, 0, 0.7, '#0E1533', 0.4) + `<path d="${ellipse(60, 60, 19.8, 23.8)}" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` },
      ], 0.75) +
      `<text x="60" y="45" ${GEORGIA} font-weight="700" font-size="3.5" letter-spacing=".35" fill="${P.paper}" text-anchor="middle">PATRIMONIO</text>` +
      `<text x="60" y="79.6" ${GEORGIA} font-style="italic" font-size="4" fill="${P.paper}" text-anchor="middle">del grupo</text>` +
      meeple(k, 60, 61, 0.42, P.gold, { shade: P.goldD }) +
      hair(46, 72, 50, 74.6, 54, 74, 0.6, P.goldL) + hair(74, 72, 70, 74.6, 66, 74, 0.6, P.goldL) +
      `<circle cx="36.4" cy="60" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="83.6" cy="60" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M24 30C34 28 38 36 46 34C52 33 54 28 58 30" fill="none" stroke="${P.greenD}" stroke-width=".7"/>` +
      leaf(28, 30, -30) + leaf(34, 31, 40) + leaf(40, 34, -20) + leaf(46, 34, 60) + leaf(52, 31.6, -40) +
      k.defs()
    )
  },

  // Doscientas cincuenta: ya sos parte del sillón (el almohadón es un meeple).
  'Mueble de living': (u) => {
    const k = kit(u)
    const back = 'M34 66C32 44 38 34 60 34C82 34 88 44 86 66Z'
    const armL = 'M26 64C26 55 34 52 38.6 57V88H28.4C26.4 82 26 72 26 64Z'
    const armR = 'M94 64C94 55 86 52 81.4 57V88H91.6C93.6 82 94 72 94 64Z'
    const seat = 'M37 72C37 67.6 83 67.6 83 72V88H37Z'
    const skirt = 'M27 88H93V94H27Z'
    const velvet = (d: string, line = 0) => ({ d, fill: P.green, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` })
    const tufts = [[46, 44], [60, 42], [74, 44], [53, 53], [67, 53]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${P.greenD}" stroke="${P.ink}" stroke-width=".25"/>`).join('') +
      hair(46, 44, 49.6, 48.6, 53, 53, 0.4, P.greenD) + hair(60, 42, 56.6, 47.6, 53, 53, 0.4, P.greenD) + hair(60, 42, 63.4, 47.6, 67, 53, 0.4, P.greenD) + hair(74, 44, 70.4, 48.6, 67, 53, 0.4, P.greenD)
    const remote = roundRect(-2, -6.6, 2, 6.6, 1)
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(60, 97, 32, 2.8) +
      `<path d="M31 94L30 98.6M89 94L90 98.6" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M31 94L30.4 97.8M89 94L89.6 97.8" stroke="${P.brown}" stroke-width="1.2" stroke-linecap="round"/>` +
      k.draw([velvet(back, 0.4)], 0.75) + tufts +
      k.draw([velvet(seat, 0.4)], 0.75) +
      k.floor(61, 73.4, 12, 1.8, P.greenD) +
      meeple(k, 60, 60.4, 0.5, P.sky, { rot: -7 }) +
      k.draw([velvet(armL, 0.4), velvet(armR, 0.4), { d: skirt, fill: P.greenD, inner: k.sh(skirt, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) }], 0.75) +
      `<g transform="translate(88 60) rotate(70)">` + k.draw([{ d: remote, fill: P.night }], 0.4) + `<circle cx="0" cy="-3.6" r=".8" fill="${P.red}"/><circle cx="-.8" cy="0" r=".45" fill="${P.sky2}"/><circle cx=".8" cy="0" r=".45" fill="${P.sky2}"/><circle cx="-.8" cy="2.2" r=".45" fill="${P.sky2}"/><circle cx=".8" cy="2.2" r=".45" fill="${P.sky2}"/></g>` +
      sparkle(32, 40, 2) + sparkle(88, 40, 1.6) +
      k.defs()
    )
  },

  // Quinientas partidas: el lobo viejo, de boina y anteojos, gana sin mirar las cartas.
  'Viejo lobo': (u) => {
    const k = kit(u)
    const head =
      'M60 41C67 41 72.6 44 75.4 49.4L83.6 56L78.6 58.8L86.4 64.8L78.8 67.2L82.4 73.6L72.4 75.4C69.2 82.6 64.8 88.4 60 88.4' +
      'C55.2 88.4 50.8 82.6 47.6 75.4L37.6 73.6L41.2 67.2L33.6 64.8L41.4 58.8L36.4 56L44.6 49.4C47.4 44 53 41 60 41Z'
    const muzzle = 'M60 57C63 61 66.4 61.8 70 61C74 63.4 76 67.4 75.2 71.4C72.2 80 66.6 86.6 60 86.6C53.4 86.6 47.8 80 44.8 71.4C44 67.4 46 63.4 50 61C53.6 61.8 57 61 60 57Z'
    const ear = 'M46.4 50.4L43 28.6L57.4 41.8C53 43.4 49 46.4 46.4 50.4Z'
    const earIn = 'M47.6 45.6L45.6 33.6L53.6 41.4C51.2 42.4 49.2 43.8 47.6 45.6Z'
    const beret = 'M46.6 44.6C49.6 40.4 70 39.2 74.6 43.6C76.4 45.6 74.6 48.8 70.6 49.6C64 50.8 54 50.6 48.6 49.2C46 48.4 45.4 46.2 46.6 44.6Z'
    const sweater = 'M30 106C32 95 42 89.4 52 88H68C78 89.4 88 95 90 106Z'
    const mirror = (s: string) => s + `<g transform="translate(120 0) scale(-1 1)">${s}</g>`
    const craters = [[46, 34, 3.4], [74, 30, 2.4], [79, 58, 2.6], [39, 58, 1.8], [64, 26, 1.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.sky1}" stroke="${P.sky2}" stroke-width=".4"/>`).join('')
    const moon = ellipse(60, 50, 31, 31)
    return (
      k.night() +
      [[28, 34], [92, 30], [26, 76], [95, 78], [36, 22], [86, 92]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="${moon}" fill="${P.paper}"/>` + k.shade(moon, k.rad(P.goldL, 0.4, 0.4, 0.7, 0, 0.8), P.goldL, 0.3) + craters +
      k.draw([{ d: sweater, fill: P.wine, inner: k.sh(sweater, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + Array.from({ length: 9 }, (_, i) => `<path d="M${34 + i * 6.4} 94V106" stroke="${P.red}" stroke-width=".5" opacity=".6"/>`).join('') }], 0.7) +
      mirror(k.draw([{ d: ear, fill: P.sky2, inner: k.sh(ear, 0, 0, 1, 1, 0, 0.7, P.mid, 0.4) + `<path d="${earIn}" fill="#E8B9B4"/>` }], 0.7)) +
      k.draw([
        { d: head, fill: P.sky2, inner: k.sh('M62 40C76 46 84 60 80 90H90V40Z', 0, 0, 1, 0, 0, 0.8, P.mid, 0.4) + k.sh('M30 70H90V90H30Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) },
        { d: muzzle, fill: P.white, inner: k.sh('M62 60C70 66 72 76 66 88H80V60Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) },
        { d: beret, fill: P.night, inner: `<path d="M50 43.4C56 41.4 66 41.2 71 42.6" fill="none" stroke="${P.sky2}" stroke-width=".6" opacity=".7"/>` },
      ], 0.75) +
      `<path d="M60.6 40.2V37.6" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      mirror(
        hair(46.8, 55.2, 50.6, 52, 56.4, 54, 1.4, P.white) +
        `<path d="M49 61.2Q52.6 63.6 56.2 61" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
        `<circle cx="52.6" cy="61.4" r="5.2" fill="none" stroke="${P.ink}" stroke-width="1.5"/><circle cx="52.6" cy="61.4" r="5.2" fill="none" stroke="${P.gold}" stroke-width=".7"/>`,
      ) +
      `<path d="M57.8 61Q60 59.6 62.2 61" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      `<path d="M55.6 70C55.6 68 64.4 68 64.4 70C64.4 72.4 61.8 74.2 60 74.2C58.2 74.2 55.6 72.4 55.6 70Z" fill="${P.ink}"/><ellipse cx="58.4" cy="69.6" rx="1.4" ry=".7" fill="#fff" opacity=".6"/>` +
      `<path d="M60 74.2V76.6M56 77.6Q60 80.4 64.6 77" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
      card(k, 79, 97, -18, 's', 0.62) + card(k, 81, 96.6, 0, 'h', 0.62) + card(k, 83.4, 97, 18, 's', 0.62) +
      sparkle(88, 40, 2.2, P.paper) + sparkle(30, 46, 1.6, P.paper) +
      k.defs()
    )
  },

  // ── Todoterreno ────────────────────────────────────────────────────

  // Tres juegos distintos: la navaja suiza trae un meeple, un dado y una carta.
  'Navaja suiza': (u) => {
    const k = kit(u)
    const handle = roundRect(-25, -6.6, 25, 6.6, 6.6)
    const blade = 'M0 -2.4L30 -3.6C33.4 -3.2 34.6 -1 33.4 1.2L0 2.4Z'
    const stem = 'M0 -1.4H13V1.4H0Z'
    const silver = (d: string, t: string) => ({ d, t, fill: P.white, inner: k.sh('M-2 0H40V5H-2Z', 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) })
    const cross = 'M-1.2 -3.6H1.2V-1.2H3.6V1.2H1.2V3.6H-1.2V1.2H-3.6V-1.2H-1.2Z'
    return (
      k.day() +
      k.stage(60, 58, 33) +
      `<g transform="translate(60 74) rotate(-14)">` +
      k.cast([handle], 2.2, 2.4) +
      k.draw([
        silver(blade, 'translate(-20 0) rotate(-128)'),
        silver(stem, 'translate(-20 0) rotate(-82)'),
        silver(stem, 'translate(20 0) rotate(-62)'),
        silver(stem, 'translate(20 0) rotate(-102)'),
      ], 0.6) +
      `<path d="M-20 0L${f(-20 + 30 * Math.cos((-128 * Math.PI) / 180))} ${f(30 * Math.sin((-128 * Math.PI) / 180))}" stroke="${P.blue}" stroke-width=".4"/>` +
      `<g transform="translate(-20 0) rotate(-82) translate(17.6 0) rotate(82)">${die(k, 0, 0, 4.4, 8)}</g>` +
      `<g transform="translate(20 0) rotate(-62) translate(13 0) rotate(62)">${meeple(k, 0, -3, 0.26, P.white, { shade: P.blue })}</g>` +
      `<g transform="translate(20 0) rotate(-102) translate(13 0) rotate(102)">${card(k, 0, 5.2, -6, 'h', 0.56)}</g>` +
      k.draw([{ d: handle, fill: P.red, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.85, P.wine, 0.45) + `<path d="M-21 -4.2H19" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".45"/>` }], 0.75) +
      `<path d="${roundRect(-5, -5, 5, 5, 1.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><path d="${cross}" fill="${P.red}"/>` +
      `<circle cx="-20" cy="0" r="1.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/><circle cx="20" cy="0" r="1.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>` +
      `</g>` +
      sparkle(86, 36, 2.4) + sparkle(34, 80, 1.6) +
      k.defs()
    )
  },

  // Cinco juegos: tocás todos los instrumentos a la vez.
  'Hombre orquesta': (u) => {
    const k = kit(u)
    const drum = ellipse(0, 6, 12.4, 12.4)
    const cymbal = 'M-12 -30.6C-6 -33.8 6 -33.8 12 -30.6C6 -29.2 -6 -29.2 -12 -30.6Z'
    const harmonica = roundRect(-6, -14.6, 6, -11, 0.8)
    const note = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="0" cy="0" rx="2" ry="1.5" transform="rotate(-20)" fill="${P.ink}"/><path d="M1.8 -.4V-8.6C3.6 -7.6 5 -6.4 4.4 -4.4" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/></g>`
    const zig = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2, b = ((i + 0.5) / 10) * Math.PI * 2
      return `${i ? 'L' : 'M'}${f(Math.cos(a) * 10.4)} ${f(6 + Math.sin(a) * 10.4)}L${f(Math.cos(b) * 7.4)} ${f(6 + Math.sin(b) * 7.4)}`
    }).join('') + 'Z'
    const over =
      k.draw([
        { d: drum, fill: P.red, inner: k.sh(drum, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
        { d: ellipse(0, 6, 9.4, 9.4), fill: P.white, inner: k.sh(ellipse(0, 6, 9.4, 9.4), 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) },
      ], 0.9) +
      `<path d="${zig}" fill="none" stroke="${P.goldD}" stroke-width=".55" stroke-linejoin="round"/>` +
      `<path d="${starPath(0, 6, 4.4, 1.9, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M-14 -9.6L-8 -3M14 -9.6L8 -3" stroke="${P.brownD}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([
        { d: cymbal, fill: P.gold, inner: k.sh(cymbal, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) },
        { d: harmonica, fill: P.white, inner: k.sh(harmonica, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) },
      ], 0.8) +
      `<path d="M0 -30V-27" stroke="${P.ink}" stroke-width="1.6"/>` +
      Array.from({ length: 5 }, (_, i) => `<rect x="${-4.8 + i * 2.1}" y="-13.6" width="1.3" height="1.6" fill="${P.ink}"/>`).join('') +
      `<path d="M22 -3L30 -17" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M22 -3L30 -17" stroke="${P.brown}" stroke-width="1.3" stroke-linecap="round"/><circle cx="30.6" cy="-18.4" r="3" fill="${P.white}" stroke="${P.ink}" stroke-width="1"/>`
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(61, 94, 18, 2.6) +
      meeple(k, 60, 66, 0.84, P.sky, { over }) +
      note(32, 44, -10) + note(88, 48, 12) + note(36, 70, 8) + note(84, 76, -6) +
      sparkle(80, 30, 2) +
      k.defs()
    )
  },

  // Ocho juegos: tenés todos los tomos, hasta el del índice.
  'Enciclopedia Salvat': (u) => {
    const k = kit(u)
    const cols = [P.wine, P.night, P.red, P.night, P.wine, P.night, P.red]
    const nums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    const books = cols.map((c, i) => {
      const x = 33 + i * 7.6, h = [42, 44, 41, 43, 44, 42, 43][i], d = roundRect(x, 82 - h, x + 7, 82, 0.8)
      return (
        k.draw([{
          d, fill: c, line: 0.35,
          inner: k.sh(`M${x + 4} 30H${x + 8}V84H${x + 4}Z`, 0, 0, 1, 0, 0, 0.8, '#000', 0.3) + `<path d="M${x} ${f(82 - h + 4)}H${x + 7}M${x} ${f(82 - h + 5.4)}H${x + 7}M${x} 76.4H${x + 7}M${x} 77.8H${x + 7}" stroke="${P.gold}" stroke-width=".5"/>` +
            `<rect x="${f(x + 1.4)}" y="${f(82 - h + 9)}" width="4.2" height="6" fill="${P.paper}" opacity=".9"/>` + `<path d="M${f(x + 1.2)} 30H${f(x + 2)}V84H${f(x + 1.2)}Z" fill="#fff" opacity=".15"/>`,
        }], 0.55) +
        `<text x="${f(x + 3.5)}" y="${f(82 - h + 13.6)}" ${GEORGIA} font-weight="700" font-size="${nums[i].length > 2 ? 2.6 : 3.4}" fill="${P.ink}" text-anchor="middle">${nums[i]}</text>`
      )
    }).join('')
    const leaning = roundRect(-3.6, -42, 3.6, 0, 0.8)
    const shelf = 'M24 82H96V87H24Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.draw([{ d: shelf, fill: P.brown, inner: k.sh(shelf, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M25 83H95" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` }], 0.7) +
      k.floor(60, 88.6, 34, 2.2, P.mid) +
      books +
      `<g transform="translate(91 82) rotate(-16)">` +
      k.draw([{ d: leaning, fill: P.gold, line: 0.35, inner: k.sh('M0 -44H5V1H0Z', 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) + `<path d="M-3.6 -38H3.6M-3.6 -36.6H3.6M-3.6 -5.6H3.6M-3.6 -4.2H3.6" stroke="${P.ink}" stroke-width=".4"/>` }], 0.55) +
      `<text x="0" y="-21" ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.ink}" text-anchor="middle" transform="rotate(-90 0 -21)">Índice</text>` +
      `</g>` +
      meeple(k, 28.6, 75.6, 0.24, P.gold, { shade: P.goldD }) +
      sparkle(86, 34, 2.2) + sparkle(34, 32, 1.6) +
      k.defs()
    )
  },

  // Doce juegos: sos el Italpark entero.
  'Parque de diversiones': (u) => {
    const k = kit(u)
    const cx = 60, cy = 52, R = 28
    const pts = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + 0.2
      return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]
    })
    const cabins = pts.map(([x, y], i) => {
      const c = [P.red, P.sky, P.gold, P.white][i % 4], d = `M${f(x - 3.6)} ${f(y + 1.6)}H${f(x + 3.6)}V${f(y + 5.6)}C${f(x + 3.6)} ${f(y + 7.4)} ${f(x - 3.6)} ${f(y + 7.4)} ${f(x - 3.6)} ${f(y + 5.6)}Z`
      return `<path d="M${f(x)} ${f(y)}V${f(y + 1.6)}" stroke="${P.ink}" stroke-width=".6"/>` + k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 1, 0, 0, 0.7, P.night, 0.3) }], 0.4) + `<path d="M${f(x - 4)} ${f(y + 1.6)}H${f(x + 4)}" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>`
    }).join('')
    const lights = Array.from({ length: 32 }, (_, i) => {
      const a = (i / 32) * Math.PI * 2
      return `<circle cx="${f(cx + Math.cos(a) * R)}" cy="${f(cy + Math.sin(a) * R)}" r="${i % 2 ? 0.55 : 0.75}" fill="${i % 2 ? P.paper : P.goldL}"/>`
    }).join('')
    const spokes = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      return `M${cx} ${cy}L${f(cx + Math.cos(a) * R)} ${f(cy + Math.sin(a) * R)}`
    }).join('')
    const fw = (x: number, y: number, r: number, c: string) =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return hair(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, x + Math.cos(a) * r * 0.65, y + Math.sin(a) * r * 0.65, x + Math.cos(a) * r, y + Math.sin(a) * r, 0.5, c)
      }).join('')
    return (
      k.night() +
      fw(32, 32, 7, P.goldL) + fw(88, 30, 6, P.sky) +
      k.shade(ellipse(cx, cy, R + 8, R + 8), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.35, 0), P.goldL, 0.3) +
      `<path d="M${cx} ${cy}L44 100M${cx} ${cy}L76 100" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M${cx} ${cy}L44 100M${cx} ${cy}L76 100" stroke="${P.sky2}" stroke-width="1.8" stroke-linecap="round"/><path d="M48 88H72" stroke="${P.sky2}" stroke-width="1.2"/>` +
      `<path d="${spokes}" stroke="${P.sky2}" stroke-width=".45"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.ink}" stroke-width="2.8"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.white}" stroke-width="1.4"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${R - 7}" fill="none" stroke="${P.sky2}" stroke-width=".8"/>` +
      lights + cabins +
      `<circle cx="${cx}" cy="${cy}" r="4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".8"/><circle cx="${cx}" cy="${cy}" r="1.4" fill="${P.goldD}"/>` +
      `<path d="M26 100Q60 92 94 100V104H26Z" fill="${P.night}"/>` +
      k.defs()
    )
  },

  // ── Mesa larga ─────────────────────────────────────────────────────

  // Le ganaste a una mesa de cuatro: te toca la cabecera.
  'Cabecera de mesa': (u) => {
    const k = kit(u)
    const top = 'M50 50H70L91 96H29Z'
    const runner = 'M57.6 50H62.4L67 96H53Z'
    const throne = 'M50.6 50V30C50.6 24 69.4 24 69.4 30V50Z'
    const crown = 'M53.6 24.6L52.6 17.6L56.4 20.6L60 15.4L63.6 20.6L67.4 17.6L66.4 24.6Z'
    const plate = (x: number, y: number, s: number) => `<ellipse cx="${x}" cy="${y}" rx="${f(5 * s)}" ry="${f(2.4 * s)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/><ellipse cx="${x}" cy="${y}" rx="${f(3.2 * s)}" ry="${f(1.4 * s)}" fill="none" stroke="${P.sky2}" stroke-width=".4"/>`
    const glass = (x: number, y: number, s: number) => `<path d="M${f(x - 1.4 * s)} ${f(y - 4.4 * s)}H${f(x + 1.4 * s)}L${f(x + 1 * s)} ${f(y - 1.6 * s)}H${f(x - 1 * s)}Z M${x} ${f(y - 1.6 * s)}V${y}" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>`
    return (
      k.day() +
      k.stage(60, 58, 33) +
      k.draw([
        { d: throne, fill: P.red, line: 0.4, inner: k.sh(throne, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) + `<path d="M53 30C53 27 67 27 67 30V48H53Z" fill="none" stroke="${P.gold}" stroke-width=".6"/>` },
        { d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) },
      ], 0.6) +
      `<circle cx="60" cy="21.6" r=".9" fill="${P.red}"/>` +
      k.draw([{ d: top, fill: P.white, inner: `<path d="${runner}" fill="${P.sky}"/>` + k.sh('M60 48H92V98H60Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + `<path d="M29 96H91L92 99H28Z" fill="${P.sky2}"/>` }], 0.7) +
      plate(52.6, 56, 0.6) + plate(67.4, 56, 0.6) + plate(47.8, 68, 0.8) + plate(72.2, 68, 0.8) + plate(42.4, 83, 1) + plate(77.6, 83, 1) +
      glass(56.6, 60, 0.6) + glass(63.4, 60, 0.6) + glass(53.6, 74, 0.8) + glass(66.4, 74, 0.8) +
      `<path d="M60 52V58M58.4 54H61.6" stroke="${P.gold}" stroke-width=".6"/>` +
      sparkle(80, 30, 2.2) + sparkle(36, 36, 1.6) +
      k.defs()
    )
  },

  // Cinco mesas grandes: pan dulce, sidra y lucecitas.
  'Mesa de Navidad': (u) => {
    const k = kit(u)
    const pan = 'M30 82C30 68 38 60 49 60C60 60 68 68 68 82Z'
    const wrap = 'M29 78H69V88H29Z'
    const bottle = 'M74 90V62C74 57.6 76.4 55.6 77.4 51V40H82.6V51C83.6 55.6 86 57.6 86 62V90Z'
    const foil = 'M77 41V33H83V41Z'
    const label = 'M74 67H86V79H74Z'
    const bits = [[38, 70, P.red], [44, 66, P.green], [52, 65, P.red], [58, 69, P.goldL], [42, 75, P.goldL], [50, 72, P.red], [62, 74, P.green], [35, 77, P.green]].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="2" height="1.6" rx=".4" fill="${c}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    const bulbs = Array.from({ length: 9 }, (_, i) => {
      const x = 26 + i * 8.6, y = 30 + Math.sin((i / 8) * Math.PI) * 6, c = [P.gold, P.red, P.sky, P.green][i % 4]
      return `<ellipse cx="${f(x)}" cy="${f(y + 2.6)}" rx="1.3" ry="1.8" fill="${c}" stroke="${P.ink}" stroke-width=".35"/>` + k.shade(ellipse(x, y + 2.6, 4, 4), k.rad(c, 0.5, 0.5, 0.5, 0.6, 0), c, 0.3)
    }).join('')
    return (
      k.night() +
      `<path d="M22 28Q60 44 98 28" fill="none" stroke="${P.paper}" stroke-width=".5"/>` + bulbs +
      `<path d="M14 90H106V112H14Z" fill="${P.red}"/>` + k.shade('M14 90H106V112H14Z', k.lin(P.wine, 0, 0, 0, 1, 0, 0.8), P.wine, 0.4) + `<path d="M14 90H106" stroke="${P.paper}" stroke-width="1.4"/>` +
      k.floor(49, 88.6, 22, 2.4, '#000') + k.floor(80.6, 90.4, 8, 1.6, '#000') +
      k.draw([
        { d: pan, fill: P.goldD, line: 0.35, inner: k.sh(pan, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + `<path d="M34 70C38 64 44 62 50 62" fill="none" stroke="${P.goldL}" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>` + bits },
        { d: wrap, fill: P.white, inner: k.sh(wrap, 0, 0, 1, 0, 0, 0.7, P.blue, 0.3) + Array.from({ length: 10 }, (_, i) => `<path d="M${31 + i * 4} 78V88" stroke="${P.sky2}" stroke-width=".4"/>`).join('') + `<path d="M29 83H69" stroke="${P.red}" stroke-width="1.2"/>` },
      ], 0.7) +
      k.draw([
        { d: bottle, fill: P.greenD, inner: k.sh(bottle, 0, 0, 1, 0, 0, 0.9, P.night, 0.4) + `<path d="M76.4 60V88" stroke="#fff" stroke-width="1" opacity=".35" stroke-linecap="round"/>` + `<path d="${label}" fill="${P.paper}"/>` + `<path d="M74 70H86M74 76H86" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: foil, fill: P.gold, inner: k.sh(foil, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) },
      ], 0.6) +
      `<text x="80" y="74.6" ${GEORGIA} font-style="italic" font-size="3.4" fill="${P.ink}" text-anchor="middle">sidra</text>` +
      hair(80, 32, 78, 26, 81, 21, 0.6, P.paper) + hair(82, 32, 86, 27, 84, 22, 0.5, P.paper) +
      sparkle(90, 50, 1.8, P.goldL) + sparkle(30, 50, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Quince mesas llenas: sos el asador del casamiento (asado a la cruz).
  'Asado de 40 personas': (u) => {
    const k = kit(u)
    const post = 'M58.6 20H61.4V102H58.6Z'
    const bar = 'M33 40H87V43H33Z'
    const meat = 'M40 40C44 36 52 38.4 60 37.4C68 38.4 76 36 80 40C83 46 80 52 82 58C83.4 66 79 72 80.6 80C74 84 68 80.4 60 82.4C52 80.4 46 84 39.4 80C41 72 36.6 66 38 58C40 52 37 46 40 40Z'
    const ribs = Array.from({ length: 7 }, (_, i) => {
      const y = 46 + i * 4.6
      return hair(42, y + 1, 50, y - 1.2, 57.6, y + 0.6, 1, P.goldL) + hair(62.4, y + 0.6, 70, y - 1.2, 78, y + 1, 1, P.goldL)
    }).join('')
    const wires = [44, 58, 72].map((y) => `<path d="M34 ${y}H86" stroke="${P.ink}" stroke-width=".6"/>`).join('')
    const bones = [47, 56.2, 65.4].map((y) => `<path d="M35.4 ${y}h4.4" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M35.4 ${y}h4.4" stroke="${P.white}" stroke-width="1.2" stroke-linecap="round"/><path d="M80.2 ${y}h4.4" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M80.2 ${y}h4.4" stroke="${P.white}" stroke-width="1.2" stroke-linecap="round"/>`).join('')
    return (
      k.day() +
      k.stage(60, 58, 34) +
      flame(k, 'translate(60 101) scale(.34 .3) translate(-60 -90)') +
      `<g transform="rotate(-6 60 70)">` +
      k.draw([
        { d: post, fill: P.white, inner: k.sh(post, 0, 0, 1, 0, 0.2, 0.9, P.blue, 0.4) },
        { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) },
      ], 0.6) +
      bones +
      k.draw([{ d: meat, fill: '#B5513F', line: 0.4, inner: k.sh(meat, 0, 0, 1, 1, 0, 0.9, P.wine, 0.45) + `<path d="M38 36H52V86H38Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` + ribs + wires + k.sh('M36 66H84V86H36Z', 0, 0, 0, 1, 0, 0.7, P.night, 0.3) }], 0.75) +
      `</g>` +
      hair(46, 34, 42, 28, 46, 22, 0.8, P.blue) + hair(72, 34, 76, 27, 72, 21, 0.7, P.blue) +
      [[44, 90, 0.7], [78, 92, 0.6], [70, 88, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldD}"/>`).join('') +
      sparkle(86, 50, 1.8) +
      k.defs()
    )
  },
}
