// Medallas generales redibujadas (ver el kit en ../kit.ts): Victorias y Racha.
import { f } from '../helpers'
import { along, card, die, ellipse, flame, hair, kit, laurel, MEEPLE, meeple, P, roundRect, sparkle, starPath, taper } from '../kit'

export const GENERALES_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Victorias ──────────────────────────────────────────────────────

  // La primera victoria: un meeple en lo alto del podio, con su medallita, bajo una gloria de rayos.
  'Primera ficha': (u) => {
    const k = kit(u)
    const confetti = ([[34, 36, 20, P.gold], [87, 32, -30, P.sky], [30, 58, 50, P.red], [91, 54, 10, P.gold], [44, 25, -40, P.red], [78, 22, 30, P.sky]] as const)
      .map(([x, y, r, c]) => `<rect x="${x - 2.2}" y="${y - 1.1}" width="4.4" height="2.2" fill="${c}" stroke="${P.ink}" stroke-width=".3" transform="rotate(${r} ${x} ${y})"/>`).join('')
    const top = 'M41 73.4H79L82.4 78.6H37.6Z', front = 'M37.6 78.6H82.4V108H37.6Z'
    const one = 'M55.8 86.2L61.4 82.8H64.2V98.8H67.4V101.6H54.8V98.8H58.4V88.2L55.8 89.6Z'
    const medal =
      `<path d="M-4.4 -10.4L0 -3.8L4.4 -10.4" fill="none" stroke="${P.ink}" stroke-width="3"/><path d="M-4.4 -10.4L0 -3.8L4.4 -10.4" fill="none" stroke="${P.red}" stroke-width="1.8"/>` +
      `<circle cx="0" cy="-1.4" r="3.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><path d="${starPath(0, -1.3, 1.9, 0.8, 5)}" fill="${P.goldD}"/>`
    return (
      k.day() +
      k.sun(60, 46, 20, 46, 28, false) +
      confetti +
      `<g transform="translate(0 -6)">` +
      k.draw([
        { d: front, fill: P.white, line: 0.4, inner: k.sh('M66 76H84V110H66Z', 0, 0, 1, 0, 0, 0.8) + k.sh('M36 78H84V84H36Z', 0, 0, 0, 1, 0.6, 0, P.blue, 0.3) },
        { d: top, fill: P.sky1, line: 0.4, inner: k.sh(top, 0, 0, 1, 0, 0.2, 0.7, P.sky2, 0.4) },
      ]) +
      k.draw([{ d: one, fill: P.gold, inner: k.sh(one, 0, 0, 1, 1, 0, 1, P.goldD, 0.4) }], 0.45) +
      k.floor(61.6, 75.6, 17, 2.2) +
      meeple(k, 60, 50.4, 0.86, P.sky, { over: medal }) +
      `</g>` +
      sparkle(86, 46, 2.4) + sparkle(33, 47, 1.6) +
      k.defs()
    )
  },

  // Diez ganadas: la cámara de turista sale volando; queda el mate.
  'Ya no sos turista': (u) => {
    const k = kit(u)
    const gourd = 'M46 62C41.5 67.5 40 76 43 83.5C46 90.5 52 94 60 94C68 94 74 90.5 77 83.5C80 76 78.5 67.5 74 62Z'
    const band = 'M45 57.6H75V62.6C66 65 54 65 45 62.6Z'
    const rim = ellipse(60, 57.6, 15, 3.4)
    const cam = 'M-9 -4.4Q-9 -6.4 -7 -6.4H-4.4L-2.8 -8.6H2.8L4.4 -6.4H7Q9 -6.4 9 -4.4V5Q9 7 7 7H-7Q-9 7 -9 5Z'
    const diamonds = [46.6, 51.8, 57, 62.2, 67.4, 72.6].map((x) => {
      const y = 79.4 + (1 - ((x - 60) / 18) ** 2) * 2.2
      return `<path d="M${x} ${f(y - 2.2)}L${f(x + 1.9)} ${f(y)}L${x} ${f(y + 2.2)}L${f(x - 1.9)} ${f(y)}Z" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".35"/>`
    }).join('')
    const straw = (d: string, c: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`
    return (
      k.day() +
      k.stage(60, 66, 33) +
      k.floor(61.6, 94.6, 17, 2.6) +
      straw('M63 57.4L70.4 30.6', P.white) + `<path d="M63.6 55L69.6 33.2" stroke="${P.blue}" stroke-width=".45"/>` + straw('M70.4 30.6Q71 27.6 68.4 26.6', P.gold) +
      `<ellipse cx="66.8" cy="43.6" rx="2.4" ry="1.3" transform="rotate(-74 66.8 43.6)" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([
        {
          d: gourd, fill: P.brown, line: 0.4,
          inner:
            k.sh('M62 60C72 66 76 78 72 96H84V60Z', 0, 0, 1, 0, 0, 0.95, P.brownD, 0.4) + k.sh('M38 84H82V96H38Z', 0, 0, 0, 1, 0, 0.7, P.brownD, 0.3) +
            `<path d="M38 62H52V96H38Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.55, 0)}"/>` +
            `<path d="M42 77Q60 82 78 77M42.4 82Q60 87 77.6 82" fill="none" stroke="${P.brownD}" stroke-width=".55"/>` + diamonds,
        },
        { d: band, fill: P.white, line: 0.4, inner: k.sh('M64 56H78V66H64Z', 0, 0, 1, 0, 0, 0.9) + `<path d="M46 60.4Q60 63.4 74 60.4" fill="none" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` },
        { d: rim, fill: P.white, line: 0.4, inner: `<path d="${ellipse(60, 57.8, 12.6, 2.4)}" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` + k.sh(ellipse(60, 57.8, 12.6, 2.4), 0, 0, 1, 0, 0, 0.9, P.greenD, 0.3) },
      ], 0.7) +
      `<path d="M49.4 57.6Q53.4 52.8 58.6 57.4Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` +
      straw('M63 57.4L65.6 48', P.white) +
      hair(53, 52, 50, 46, 53.6, 39.6, 0.8, P.blue) + hair(57.4, 51, 60.4, 45, 57, 38.6, 0.65, P.blue) +
      `<g transform="translate(34 44) rotate(-24) scale(.82)">` +
      k.draw([{ d: cam, fill: P.mid, inner: k.sh(cam, 0, 0, 1, 1, 0, 0.9, P.night) + `<rect x="-9" y="-2" width="18" height="2.4" fill="${P.brownD}"/>` }], 0.7) +
      `<circle cx="0" cy=".6" r="4.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".7"/><circle cx="0" cy=".6" r="3" fill="${P.sky}" stroke="${P.ink}" stroke-width=".5"/><circle cx="-1" cy="-.4" r=".9" fill="#fff"/>` +
      `<rect x="4.6" y="-5.6" width="3" height="1.6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      `<path d="M27 40.6C20 46 23 56 31 54.6" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      hair(44, 50.6, 47, 52.6, 50.4, 53, 0.6) + hair(41.6, 54.6, 44.4, 57, 47.4, 58.2, 0.5) +
      sparkle(86, 38, 2.4) + sparkle(88, 74, 1.5) +
      k.defs()
    )
  },

  // Veinticinco: un pulpo con un tentáculo en cada juego.
  'Pulpo de mesa': (u) => {
    const k = kit(u)
    const arms: [number, number, number, number, number, number][] = [
      [47, 56, 34, 60, 31, 50], [49, 60, 38, 74, 32, 72], [54, 62, 48, 82, 45, 89],
      [66, 62, 72, 82, 72, 86], [71, 60, 82, 74, 88, 72], [73, 56, 86, 60, 89, 50],
    ]
    const head = 'M42 50C40 34 48 24 60 24C72 24 80 34 78 50C77 58 70 63 60 63C50 63 43 58 42 50Z'
    const suckers = arms.map(([x0, y0, cx, cy, x1, y1]) =>
      along(x0, y0, cx, cy, x1, y1, [0.5, 0.66, 0.8, 0.92]).map((q, i) => {
        const len = Math.hypot(q.dx, q.dy) || 1, side = x1 < 60 ? 1 : -1, r = 1.2 - i * 0.22
        return `<circle cx="${f(q.x + (q.dy / len) * 1.6 * side)}" cy="${f(q.y - (q.dx / len) * 1.6 * side)}" r="${f(r)}" fill="${P.white}" stroke="${P.mid}" stroke-width=".3"/>`
      }).join('')).join('')
    const chip = `<circle cx="45" cy="89" r="5" fill="${P.red}" stroke="${P.ink}" stroke-width=".8"/><circle cx="45" cy="89" r="5" fill="none" stroke="${P.white}" stroke-width="1.4" stroke-dasharray="2 2.2"/><circle cx="45" cy="89" r="2.8" fill="${P.red}" stroke="${P.white}" stroke-width=".5"/>`
    const coin = `<circle cx="88.6" cy="72" r="4.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".7"/><circle cx="88.6" cy="72" r="2.8" fill="none" stroke="${P.goldD}" stroke-width=".5"/><path d="M87.6 69.6V74.4M89.6 69.6V74.4" stroke="${P.goldD}" stroke-width=".5"/>`
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(61, 93, 26, 3) +
      k.draw([
        ...arms.map(([x0, y0, cx, cy, x1, y1]) => ({ d: taper(x0, y0, cx, cy, x1, y1, 7.4, 2.6), fill: P.sky, inner: k.sh('M60 20H100V100H60Z', 0, 0, 1, 0, 0, 0.7, P.mid) + k.sh('M20 70H100V100H20Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) })),
        {
          d: head, fill: P.sky, line: 0.4,
          inner:
            k.sh('M62 22C74 28 80 40 76 64H86V22Z', 0, 0, 1, 0, 0, 0.85, P.mid) + k.sh('M40 52H80V64H40Z', 0, 0, 0, 1, 0, 0.7, P.mid, 0.3) +
            `<path d="M40 22H52V64H40Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
            `<ellipse cx="50.4" cy="31.6" rx="4.2" ry="2.2" fill="#fff" opacity=".85" transform="rotate(-35 50.4 31.6)"/>` +
            [[70, 32, 1.8], [74, 38.4, 1.3], [66.6, 28.4, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.blue}" opacity=".6"/>`).join(''),
        },
      ]) +
      suckers +
      `<ellipse cx="53" cy="47.6" rx="2.4" ry="3" fill="${P.ink}"/><ellipse cx="67" cy="47.6" rx="2.4" ry="3" fill="${P.ink}"/><circle cx="53.8" cy="46.6" r=".9" fill="#fff"/><circle cx="67.8" cy="46.6" r=".9" fill="#fff"/>` +
      hair(49, 42.6, 52, 40.6, 55.6, 42, 0.7) + hair(64.4, 42, 68, 40.6, 71, 42.6, 0.7) +
      `<ellipse cx="48.4" cy="53.4" rx="2.6" ry="1.4" fill="${P.red}" opacity=".25"/><ellipse cx="71.6" cy="53.4" rx="2.6" ry="1.4" fill="${P.red}" opacity=".25"/>` +
      hair(56.6, 54, 60, 57.4, 63.4, 54, 0.75) +
      card(k, 31, 52, -18, 'h', 0.8) + card(k, 89, 52, 16, 's', 0.8) +
      die(k, 31.4, 70.4, 4.4, -10) + chip + coin +
      meeple(k, 72, 84.6, 0.27, P.gold, { shade: P.goldD, rot: 8 }) +
      sparkle(86, 30, 2) + sparkle(34, 30, 1.5) +
      k.defs()
    )
  },

  // Cincuenta: el rey del tablero, con capa, corona y cetro; los rivales, tirados.
  'Dueño del tablero': (u) => {
    const k = kit(u)
    const iso = (a: number, b: number) => `${f(60 + (a - b) * 5)} ${f(72 + (a + b) * 2)}`
    let dark = ''
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) dark += `M${iso(i, j)}L${iso(i + 1, j)}L${iso(i + 1, j + 1)}L${iso(i, j + 1)}Z`
    const top = `M${iso(0, 0)}L${iso(6, 0)}L${iso(6, 6)}L${iso(0, 6)}Z`
    const left = 'M30 84L60 96V101L30 89Z'
    const right = 'M60 96L90 84V89L60 101Z'
    const cape = 'M-7 -10.5C-17 -8 -24 10 -27 26L27 26C24 10 17 -8 7 -10.5Z'
    const crown = 'M-7.6 -23.4L-8.8 -32.6L-4.4 -28.2L0 -34.8L4.4 -28.2L8.8 -32.6L7.6 -23.4Z'
    const ermine = 'M-12.4 -10.6C-6 -6.4 6 -6.4 12.4 -10.6C12.6 -5.6 6.4 -2.6 0 -2.6C-6.4 -2.6 -12.6 -5.6 -12.4 -10.6Z'
    const over =
      k.draw([
        { d: ermine, fill: P.white, inner: k.sh(ermine, 0, 0, 1, 1, 0, 0.6) + [[-8, -7.4], [-3, -5.4], [3, -5.4], [8, -7.4], [0, -4]].map(([x, y]) => `<path d="M${x} ${y - 1}l.7 1.6h-1.4Z" fill="${P.ink}"/>`).join('') },
        { d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 1, P.goldD, 0.4) },
      ], 0.7) +
      `<circle cx="0" cy="-26.4" r="1.5" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-4.8" cy="-25.6" r="1" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/><circle cx="4.8" cy="-25.6" r="1" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M21 -1L29 -25" stroke="${P.ink}" stroke-width="3.2" stroke-linecap="round"/><path d="M21 -1L29 -25" stroke="${P.gold}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<circle cx="29.6" cy="-27" r="3" fill="${P.red}" stroke="${P.ink}" stroke-width=".8"/><circle cx="28.6" cy="-28" r=".9" fill="#fff"/>`
    const fallen = (x: number, y: number, r: number) => meeple(k, x, y, 0.2, P.sky2, { rot: r, shade: P.blue })
    return (
      k.day() +
      k.stage(60, 54, 32) +
      k.draw([
        { d: left, fill: P.brown, inner: k.sh(left, 0, 0, 1, 0, 0, 0.6, P.brownD) },
        { d: right, fill: P.brownD, inner: k.sh(right, 0, 0, 1, 0, 0.3, 0.8, P.night) },
        { d: top, fill: P.white, inner: `<path d="${dark}" fill="${P.sky}"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.6) },
      ], 0.7) +
      k.floor(61.4, 79.4, 13, 2.4, P.mid) +
      fallen(43, 85.4, 84) + fallen(77.4, 86.4, -78) +
      meeple(k, 60, 59.6, 0.74, P.sky, { under: k.draw([{ d: cape, fill: P.red, inner: k.sh(cape, 0, 0, 1, 0, 0, 0.8, P.wine) + hair(-10, -4, -14, 8, -16, 22, 0.6, P.wine) + hair(10, -4, 14, 8, 16, 22, 0.6, P.wine) }], 0.9), over }) +
      sparkle(32, 40, 2.4) + sparkle(88, 52, 1.8) +
      k.defs()
    )
  },

  // Cien: el capo, de traje a rayas, sombrero y rosa, bajo el reflector.
  'Capo di tutti capi': (u) => {
    const k = kit(u)
    const head = ellipse(0, -16.8, 9.2, 9.2)
    const hat = 'M-8.2 -22.6C-8.8 -28.6 -6.8 -33.4 -2.8 -33.4C-1 -31.8 1 -31.8 2.8 -33.4C6.8 -33.4 8.8 -28.6 8.2 -22.6Z'
    const brim = 'M-14.4 -22.4C-14.4 -25.6 14.4 -25.6 14.4 -22.4C14.4 -20.2 -14.4 -20.2 -14.4 -22.4Z'
    const stripes = Array.from({ length: 12 }, (_, i) => `<path d="M${-24 + i * 4.4} -12V30" stroke="${P.sky2}" stroke-width=".35" opacity=".6"/>`).join('')
    const suit =
      `<path d="M-5.2 -10.8L0 -.8L5.2 -10.8Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M-1.3 -9.6H1.3L2.1 -2.6L0 .2L-2.1 -2.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      hair(-6.8, -10.4, -4, -5, -1.4, -0.4, 0.8) + hair(6.8, -10.4, 4, -5, 1.4, -0.4, 0.8) +
      `<path d="M-10.8 -5.6L-6.8 -5.6L-8.6 -3.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M8.6 -2.6Q11.6 -3.4 12.4 -.8Q9.6 -.2 8.6 -2.6Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="8.2" cy="-5.2" r="2.3" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><path d="M7.2 -5.6Q8.2 -6.6 9.2 -5.4M7.6 -4.4Q8.4 -4 9 -4.6" fill="none" stroke="${P.wine}" stroke-width=".35"/>` +
      `<circle cx="21.6" cy="-3.6" r="1.6" fill="none" stroke="${P.ink}" stroke-width="1.5"/><circle cx="21.6" cy="-3.6" r="1.6" fill="none" stroke="${P.gold}" stroke-width=".8"/>`
    const face =
      `<path d="M-5.4 -17.8Q-3.6 -16.4 -1.8 -17.6M1.8 -17.6Q3.6 -16.4 5.4 -17.8" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M-6 -20.2L-2 -19.2M6 -20.2L2 -19.2" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M-5.4 -12.8C-3.8 -15 -1 -14.8 0 -13.6C1 -14.8 3.8 -15 5.4 -12.8C3.8 -11.6 1.4 -12 0 -12.5C-1.4 -12 -3.8 -11.6 -5.4 -12.8Z" fill="${P.ink}"/>` +
      `<path d="M-1.6 -10.4Q.4 -9.6 2.4 -10.8" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>`
    const headInner = k.sh(head, 0.3, 0, 1, 0.6, 0, 0.4, P.blue, 0.3) + k.sh('M-10 -27H10V-20.6H-10Z', 0, 0, 0, 1, 0.85, 0, P.blue, 0.4) + `<ellipse cx="-6" cy="-14.8" rx="1.8" ry="1" fill="${P.red}" opacity=".18"/><ellipse cx="6" cy="-14.8" rx="1.8" ry="1" fill="${P.red}" opacity=".18"/>`
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.8), P.night, 0.6) +
      k.shade('M48 0H72L102 102H18Z', k.lin(P.goldL, 0, 0, 0, 1, 0.32, 0), P.goldL, 0.4) +
      k.shade(ellipse(60, 91, 27, 5), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.45, 0), P.goldL, 0.45) +
      k.floor(61, 90.6, 18, 2.6, P.night) +
      `<g transform="translate(60 64.4) scale(.98)">` +
      k.draw([
        { d: MEEPLE, fill: P.mid, inner: stripes + k.sh('M2 -30H30V30H2Z', 0, 0, 1, 0, 0, 0.85, P.night, 0.4) + `<path d="M-30 -12H-4V30H-30Z" fill="${k.lin(P.sky2, 0, 0, 1, 0, 0.35, 0)}"/>` },
        { d: head, fill: P.skin, inner: headInner },
      ], 0.8) +
      suit + hair(-6, 6, -4.6, 11, -6.6, 17, 0.6, P.night) + hair(6, 6, 4.6, 11, 6.6, 17, 0.6, P.night) + face +
      k.draw([
        { d: hat, fill: P.night, inner: `<path d="M-8.7 -26.6C-3 -25.1 3 -25.1 8.7 -26.6L8.6 -23.4C3 -22.2 -3 -22.2 -8.6 -23.4Z" fill="${P.red}"/><path d="M-6 -31C-5 -32.6 -3.8 -33 -2.6 -32.6" fill="none" stroke="${P.sky2}" stroke-width=".6" stroke-linecap="round"/>` },
        { d: brim, fill: P.night, inner: `<path d="M-12 -23.6C-6 -24.8 6 -24.8 12 -23.6" fill="none" stroke="${P.sky2}" stroke-width=".45"/>` },
      ], 0.7) +
      `</g>` +
      k.defs()
    )
  },

  // ── Racha ──────────────────────────────────────────────────────────

  // Tres seguidas: la pava ya silba.
  'Se pasó el agua': (u) => {
    const k = kit(u)
    const body = 'M36.6 84C35.6 72 42 60.6 60 59.4C78 60.6 84.4 72 83.4 84C76 87.4 44 87.4 36.6 84Z'
    const spout = 'M41.6 73C36 71 31.6 65.4 29.4 58.6L27.4 57.2C27 56 28 55 29.2 55.4L33 56.6C34.6 62 38.4 65.6 43.4 66.6Z'
    const lid = 'M48 60.4C48 56.6 53 54.6 60 54.6C67 54.6 72 56.6 72 60.4C68 61.6 52 61.6 48 60.4Z'
    const knob = 'M57.4 54.8C57.4 52.6 58.4 51.4 60 51.4C61.6 51.4 62.6 52.6 62.6 54.8Z'
    const fl = (x: number, s: number) => `M${x} 92.4C${f(x - 2.6 * s)} ${f(90 - s)} ${f(x - 1.6 * s)} ${f(87 - s)} ${x} ${f(85 - 1.6 * s)}C${f(x + 1.6 * s)} ${f(87 - s)} ${f(x + 2.6 * s)} ${f(90 - s)} ${x} 92.4Z`
    return (
      k.day() +
      k.stage(62, 64, 33) +
      `<g transform="translate(3 0)">` +
      ([[46, 0.8], [52.6, 1], [60, 1.15], [67.4, 1], [74, 0.8]] as const).map(([x, s]) => k.draw([{ d: fl(x, s), fill: P.sky, inner: `<path d="${fl(x, s * 0.55)}" fill="${P.white}"/>` }], 0.4)).join('') +
      `<path d="M41 93.6H79" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="M41.6 66C40 52 46 42.4 60 42C74 42.4 80 52 78.4 66" fill="none" stroke="${P.ink}" stroke-width="2.1" stroke-linecap="round"/>` +
      k.draw([
        { d: spout, fill: P.white, inner: k.sh(spout, 0, 0, 0, 1, 0, 0.7, P.blue, 0.3) },
        {
          d: body, fill: P.white, line: 0.4,
          inner:
            `<path d="M36.7 79.4C44 82.4 76 82.4 83.3 79.4L83.4 82.4C76 85.6 44 85.6 36.6 82.4Z" fill="${P.ink}"/>` +
            `<path d="M44 64.6C50 62.6 70 62.6 76 64.6L76.8 66.4C70 64.6 50 64.6 43.2 66.4Z" fill="${P.ink}"/>` +
            k.sh('M64 58C74 64 78 74 76 88H90V58Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M34 76H86V88H34Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
            `<path d="M42.6 76C42 70 45 65.6 49.6 63.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".95"/>`,
        },
        { d: lid, fill: P.white, line: 0.4, inner: k.sh(lid, 0, 0, 1, 0, 0, 0.8, P.blue, 0.3) },
        { d: knob, fill: P.gold, inner: k.sh(knob, 0, 0, 1, 0, 0, 1, P.goldD, 0.3) },
      ], 0.7) +
      `<path d="M51 43.4C54 41.8 66 41.8 69 43.4" fill="none" stroke="${P.ink}" stroke-width="5.4" stroke-linecap="round"/><path d="M51 43.4C54 41.8 66 41.8 69 43.4" fill="none" stroke="${P.gold}" stroke-width="3.6" stroke-linecap="round"/><path d="M53 42.6C56 41.6 62 41.4 65 41.8" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-linecap="round"/>` +
      `</g>` +
      hair(31, 54, 27, 48, 31, 41, 0.9, P.blue) + hair(34.6, 53.6, 38.6, 47.6, 34.4, 40.6, 0.8, P.blue) + hair(28.6, 44, 25.6, 39, 29.4, 34.6, 0.6, P.blue) +
      `<text x="41" y="40" font-family="Georgia, serif" font-style="italic" font-size="6.6" fill="${P.ink}" transform="rotate(-12 41 40)">¡fiu!</text>` +
      sparkle(86, 40, 2.2) + sparkle(90, 72, 1.5) +
      k.defs()
    )
  },

  // Cinco seguidas: la racha está en la parrilla y larga humo.
  'Está que arde': (u) => {
    const k = kit(u)
    const grate = 'M33 64.6H87L92.6 75.4H27.4Z'
    const chorizo = (x: number, y: number, r: number, c: string, dk: string) => {
      const d = roundRect(-10.6, -3.4, 10.6, 3.4, 3.4)
      return (
        `<g transform="translate(${x} ${y}) rotate(${r})">` +
        k.draw([{ d, fill: c, inner: k.sh('M-12 0H12V4H-12Z', 0, 0, 0, 1, 0, 0.9, dk, 0.4) + `<path d="M-7 -2.2H5" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".5"/>` + [-5, 0, 5].map((gx) => `<path d="M${gx - 1.4} -3.6L${gx + 1.4} 3.6" stroke="${P.night}" stroke-width=".9" opacity=".75"/>`).join('') }], 0.55) +
        `<path d="M-10.6 0L-12.6 -.8M10.6 0L12.6 .8" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
        `</g>`
      )
    }
    const ember = (x: number, y: number, rx: number) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${f(rx * 0.62)}" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".5"/>` + `<ellipse cx="${f(x - rx * 0.2)}" cy="${f(y - rx * 0.15)}" rx="${f(rx * 0.55)}" ry="${f(rx * 0.3)}" fill="${P.gold}"/>`
    const smoke = (x: number, y: number, s: number) => {
      const d = 'M-9 2C-11 2 -12 0 -10.6 -1.6C-11 -4.6 -7.6 -6 -5.6 -4.4C-4.6 -7.6 0 -8.2 1.6 -5.2C3.6 -7 7.4 -5.6 7 -2.6C9.6 -2.4 10.2 1.6 7.6 2Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.45) }], 0.45 / s) + `</g>`
    }
    return (
      k.day() +
      k.stage(60, 62, 33) +
      `<path d="M38 75.4L35 94M82 75.4L85 94M48 75.4L47 92M72 75.4L73 92" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      k.draw([{ d: 'M34 78H86L82.6 88H37.4Z', fill: P.night, inner: ember(44, 84, 4) + ember(52, 85.6, 4.6) + ember(61, 84.4, 4.4) + ember(69.6, 85.8, 4.2) + ember(77, 84, 3.6) + k.sh('M30 78H90V82H30Z', 0, 0, 0, 1, 0.6, 0, P.red, 0.4) }], 0.6) +
      `<path d="${grate}" fill="${P.sky1}" opacity=".5"/>` +
      Array.from({ length: 11 }, (_, i) => {
        const t = i / 10
        return `<path d="M${f(33 + t * 54)} 64.6L${f(27.4 + t * 65.2)} 75.4" stroke="${P.ink}" stroke-width=".7"/>`
      }).join('') +
      `<path d="${grate}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linejoin="round"/>` +
      chorizo(48, 68.6, -6, P.red, P.wine) + chorizo(71, 70.4, 8, P.red, P.wine) + chorizo(59, 72.4, -2, P.wine, P.night) +
      smoke(48, 50, 1.1) + smoke(70, 44, 1.3) + smoke(56, 33, 0.9) +
      hair(50, 62, 46, 57, 50, 52.6, 0.7, P.blue) + hair(68, 63, 72, 58, 68.6, 53, 0.7, P.blue) + hair(60, 62, 62, 52, 58, 40, 0.6, P.blue) +
      [[40, 58, 0.7], [79, 60, 0.6], [64, 48, 0.5], [44, 46, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldD}"/>`).join('') +
      sparkle(88, 40, 2) +
      k.defs()
    )
  },

  // Siete seguidas: "He's on fire!", como en el NBA Jam.
  'On fire': (u) => {
    const k = kit(u)
    const ball = ellipse(60, 70, 16.6, 16.6)
    return (
      k.night() +
      [[30, 36], [88, 32], [26, 70], [93, 80], [40, 24], [82, 92]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      flame(k, 'translate(60 60) scale(.92) translate(-60 -60)') +
      k.floor(61, 94, 16, 2.4, '#000') +
      k.draw([{
        d: ball, fill: P.goldD,
        inner:
          k.sh(ball, 0, 0, 1, 1, 0, 0.95, P.brownD, 0.45) + `<path d="M43 53H56V88H43Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.6, 0)}"/>` +
          `<path d="M60 53.4V86.6M43.4 70H76.6M47.6 58.6C53.4 64 53.4 76 47.6 81.4M72.4 58.6C66.6 64 66.6 76 72.4 81.4" fill="none" stroke="${P.ink}" stroke-width=".9"/>` +
          `<ellipse cx="52.4" cy="60" rx="3.4" ry="1.8" fill="#fff" opacity=".75" transform="rotate(-35 52.4 60)"/>`,
      }], 0.8) +
      hair(30, 62, 34, 66, 38, 67, 0.7, P.goldL) + hair(28, 72, 33, 73, 38, 72.4, 0.7, P.goldL) + hair(31, 81, 35, 79, 39, 76.8, 0.6, P.goldL) +
      sparkle(84, 50, 2.2, P.goldL) + sparkle(36, 44, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Diez seguidas: la camiseta con el 10, con aureola y laureles, delante del sol de Mayo.
  'D10S': (u) => {
    const k = kit(u)
    const body = 'M52.6 42.4Q60 45.6 67.4 42.4L75.6 45.4C76.4 50 76.2 55 75.8 60V90.6C66 93.4 54 93.4 44.2 90.6V60C43.8 55 43.6 50 44.4 45.4Z'
    const sl = 'M44.4 45.4C40 48.4 36 51.6 33.2 54.2C32.6 54.8 32.6 55.6 33 56.2L38.2 62.8C38.6 63.4 39.4 63.4 40 63L44.2 60C43.8 55 43.6 50 44.4 45.4Z'
    const sr = 'M75.6 45.4C80 48.4 84 51.6 86.8 54.2C87.4 54.8 87.4 55.6 87 56.2L81.8 62.8C81.4 63.4 80.6 63.4 80 63L75.8 60C76.2 55 76.4 50 75.6 45.4Z'
    const ten =
      'M50.4 64.6L55 61.6H57.8V80.4H53.6V66.8L50.4 68.4Z' +
      'M64.6 61.6C67.8 61.6 69.8 64 69.8 67.2V74.8C69.8 78 67.8 80.4 64.6 80.4C61.4 80.4 59.4 78 59.4 74.8V67.2C59.4 64 61.4 61.6 64.6 61.6Z' +
      'M64.6 65C63.5 65 62.9 65.8 62.9 67V75C62.9 76.2 63.5 77 64.6 77C65.7 77 66.3 76.2 66.3 75V67C66.3 65.8 65.7 65 64.6 65Z'
    return (
      k.day() +
      k.sun(60, 58, 17, 46) +
      k.shade(ellipse(60, 62, 30, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      `<g transform="translate(60 66) scale(1.06) translate(-60 -66)">` +
      k.cast([body, sl, sr]) +
      k.draw([
        { d: sl, fill: P.white, line: 0.4, inner: `<path d="M40.4 46.6L43.6 48.8L38.6 61.2L35.4 58.8Z" fill="${P.sky}"/><path d="M31 57L35 54.6L41.4 61.8L38 65Z" fill="${P.ink}"/>` + k.sh(sl, 0, 0, 0, 1, 0, 0.55, P.blue, 0.3) },
        { d: sr, fill: P.white, line: 0.4, inner: `<path d="M79.6 46.6L76.4 48.8L81.4 61.2L84.6 58.8Z" fill="${P.sky}"/><path d="M89 57L85 54.6L78.6 61.8L82 65Z" fill="${P.ink}"/>` + k.sh(sr, 0, 0, 1, 1, 0.25, 0.95, P.blue, 0.4) },
        {
          d: body, fill: P.white, line: 0.4,
          inner:
            `<path d="M55.4 30H64.6V100H55.4ZM42 30H47.6V100H42ZM72.4 30H78V100H72.4Z" fill="${P.sky}"/>` +
            k.sh('M63 40C66 54 66 72 62 95H90V40Z', 0, 0, 1, 0, 0, 0.85) + k.sh('M40 40H80V51H40Z', 0, 0, 0, 1, 0.6, 0, P.blue, 0.3) +
            k.shade(ellipse(45.6, 63, 3.4, 9), k.rad(P.blue, 0.5, 0.5, 0.5, 0.7, 0), P.blue, 0.3) + k.shade(ellipse(74.4, 63, 3.4, 9), k.rad(P.blue, 0.5, 0.5, 0.5, 0.8, 0), P.blue, 0.3) +
            k.sh('M40 84H80V96H40Z', 0, 0, 0, 1, 0, 0.75, P.blue, 0.3),
        },
      ]) +
      `<path d="M52.6 42.4Q60 39.6 67.4 42.4Q60 45.6 52.6 42.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M52.6 42.4Q60 45.6 67.4 42.4L68.4 43.7Q60 47.9 51.6 43.7Z" fill="${P.ink}"/>` +
      hair(46.2, 62, 48.6, 68.6, 47.6, 76, 0.75) + hair(73.8, 62, 71.4, 68.6, 72.4, 76, 0.75) +
      hair(56.4, 92, 57.2, 88.8, 59, 86.8, 0.55) + hair(65.4, 92.2, 64.8, 89.4, 63.2, 87.6, 0.55) + hair(52.6, 47.4, 55, 49.6, 55.4, 53.4, 0.5) +
      hair(36.6, 55.6, 39.6, 53, 42.4, 50.8, 0.45) + hair(83.4, 55.6, 80.4, 53, 77.6, 50.8, 0.45) +
      `<path d="${ten}" fill-rule="evenodd" fill="${P.ink}"/>` +
      `<path d="M68.8 50.2H73V52.6C73 54.4 71.9 55.4 70.9 56C69.9 55.4 68.8 54.4 68.8 52.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M70.9 50.8V55.2M69.4 52.4H72.4" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      k.shade(ellipse(60, 30.6, 20, 9), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.5) +
      k.draw([{ d: `${ellipse(60, 30.6, 13, 4.2)} ${ellipse(60, 31.2, 9.8, 2.4)}`, fill: P.gold, inner: k.sh(ellipse(60, 30.6, 13, 4.2), 0, 0, 0, 1, 0, 0.9, P.goldD, 0.45) }], 0.55) +
      `<path d="M49.6 28.8Q55 27 60.6 26.8" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      sparkle(86, 30, 2.6) + sparkle(33, 37, 1.8) + sparkle(90, 76, 1.4) +
      k.defs()
    )
  },

  // Quince seguidas: pasaste de nivel. Pelo dorado de punta, aura y piedras que flotan.
  'Modo Saiyan': (u) => {
    const k = kit(u)
    const aura = (() => {
      let d = ''
      const N = 30
      for (let i = 0; i <= N * 2; i++) {
        const a = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2, up = Math.max(0, -Math.sin(a))
        const r = (i % 2 ? 27 : 33 + up * 12) * (1 + up * 0.15)
        d += (i ? 'L' : 'M') + f(60 + Math.cos(a) * r * 0.86) + ' ' + f(64 + Math.sin(a) * r)
      }
      return d + 'Z'
    })()
    const hairD = 'M-9.6 -17.6L-16 -22.6L-9.6 -24L-13.4 -32L-5.4 -28.4L-4.6 -37.4L.8 -29.6L6.4 -36.6L7 -28.2L14 -31.4L10.2 -24L16.2 -22.4L9.6 -17.4C8.4 -23.6 4.4 -26.4 0 -26.4C-4.4 -26.4 -8.4 -23.6 -9.6 -17.6Z'
    const face =
      `<path d="M-5.8 -19.8L-1.6 -18.2M5.8 -19.8L1.6 -18.2" stroke="${P.ink}" stroke-width="1" stroke-linecap="round"/>` +
      `<path d="M-4.6 -16.6H-2M2 -16.6H4.6" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/>` +
      `<path d="M-2 -12.6H2" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>`
    const rock = (x: number, y: number, s: number, r: number) => {
      const d = 'M-3 -1.6L-1 -3.2L2.4 -2.6L3.4 .4L1.4 2.8L-2.2 2.4Z'
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.sky2, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.mid) }], 0.4 / s) + `</g>`
    }
    const bolt = (pts: number[][]) => `<path d="M${pts.map((p) => p.join(' ')).join('L')}" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-linejoin="round"/>`
    return (
      k.night() +
      `<path d="${aura}" fill="${P.gold}" opacity=".35"/>` + k.shade(aura, k.rad(P.goldL, 0.5, 0.6, 0.55, 0.9, 0), P.goldL, 0.4) +
      `<g transform="translate(60 64) scale(.78) translate(-60 -64)"><path d="${aura}" fill="${P.goldL}" opacity=".35"/></g>` +
      bolt([[30, 52], [34, 56], [31.6, 58], [36, 63]]) + bolt([[90, 46], [86, 50], [88.6, 52], [84.6, 57]]) + bolt([[88, 76], [84, 79], [86.4, 81], [82, 85]]) +
      k.floor(61, 92, 17, 2.4, '#000') +
      rock(34, 84, 1.3, 10) + rock(86, 88, 1, -20) + rock(42, 94, 0.8, 30) + rock(79, 70, 0.8, 50) +
      meeple(k, 60, 66, 0.86, P.sky, { over: k.draw([{ d: hairD, fill: P.gold, inner: k.sh(hairD, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) + `<path d="M-4.6 -33.6L-3.6 -28.6M-11 -29L-7.4 -26.4" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".8"/>` }], 0.8) + face + `<path d="M-20.4 1.2H20.4" stroke="${P.gold}" stroke-width="2.2"/><path d="M-20.4 1.2H20.4" stroke="${P.ink}" stroke-width=".4" stroke-dasharray="0 2.2" stroke-linecap="round"/>` }) +
      sparkle(84, 34, 2.2, P.goldL) + sparkle(34, 34, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Veinte seguidas: el barrilete albiceleste, con su sol, rumbo a otro planeta.
  'Barrilete cósmico': (u) => {
    const k = kit(u)
    const kite = 'M60 20L40 43L60 84L80 43Z'
    const stars = [[28, 46, 0.6], [41, 27, 0.45], [86, 25, 0.55], [95, 54, 0.45], [74, 96, 0.5], [44, 66, 0.35], [93, 78, 0.6], [36, 58, 0.35], [83, 64, 0.4], [30, 86, 0.4]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
    const planet = ellipse(31, 72, 6.6, 6.6)
    const ringO = ellipse(31, 72, 12.6, 3), ringI = ellipse(31, 72.3, 9.4, 1.7)
    const ring = (front: boolean) =>
      `<g transform="rotate(-18 31 72)">${k.clip(front ? 'M10 72H52V90H10Z' : 'M10 54H52V72H10Z', `<path d="${ringO} ${ringI}" fill-rule="evenodd" fill="${front ? P.gold : P.goldD}" stroke="${P.ink}" stroke-width=".35"/>`)}</g>`
    const bow = (x: number, y: number, r: number, c: string) =>
      `<path d="M0 0C-1.8 -2.6 -4.4 -2.4 -4.4 0C-4.4 2.4 -1.8 2.6 0 0C1.8 -2.6 4.4 -2.4 4.4 0C4.4 2.4 1.8 2.6 0 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${c}" stroke="${P.ink}" stroke-width=".35"/>`
    return (
      k.night() +
      k.shade(ellipse(90, 88, 26, 20), k.rad('#6E5CB0', 0.5, 0.5, 0.5, 0.7, 0), '#6E5CB0', 0.25) +
      stars + sparkle(88, 38, 2.8, P.paper) + sparkle(29, 33, 1.8, P.paper) + sparkle(80, 88, 1.4, P.paper) +
      `<path d="M60 56Q42 82 20 104" fill="none" stroke="${P.paper}" stroke-width=".35" opacity=".6"/>` +
      ring(false) +
      k.draw([{ d: planet, fill: P.gold, inner: k.sh(planet, 0, 0, 1, 1, 0, 1, P.goldD, 0.4) + `<path d="M24.6 69Q31 67 37.6 70.4M24.8 74.6Q31 73 37.2 76" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.55) +
      ring(true) +
      `<path d="M60 84C55 89 51 93 55 96.6C58.4 99.4 62.6 99 65 102.6" fill="none" stroke="${P.paper}" stroke-width=".7" stroke-linecap="round"/>` +
      bow(54.8, 90.4, -26, P.gold) + bow(58, 97.4, 14, P.sky) + bow(63.6, 101.4, -10, P.gold) +
      `<g transform="translate(60 52) scale(.93) translate(-60 -52)">` +
      k.draw([{
        d: kite, fill: P.white,
        inner:
          `<path d="M60 20L40 43H60Z" fill="${P.sky}"/><path d="M80 43L60 84V43Z" fill="${P.sky}"/>` +
          k.sh('M60 18H82V86H60Z', 0, 0, 1, 1, 0.15, 0.9) + k.sh('M38 40H60V86H38Z', 0, 0, 0, 1, 0, 0.6, P.sky2, 0.3) +
          hair(44, 46, 50, 56, 57, 72, 0.4, P.blue) + hair(76, 46, 70, 56, 63, 72, 0.4, P.ink),
      }]) +
      `<path d="M60 21V83M41.4 43H78.6" stroke="${P.brownD}" stroke-width=".9"/><path d="M59.6 22V82" stroke="${P.goldL}" stroke-width=".35"/>` +
      k.sun(60, 43, 4, 9.4, 16) +
      `<circle cx="60" cy="43" r="3.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` + k.clip(ellipse(60, 43, 3.8, 3.8), k.sh(ellipse(60, 43, 3.8, 3.8), 0, 0, 1, 1, 0, 1, P.goldD, 0.3)) +
      `</g>` +
      k.defs()
    )
  },
}
