// Medallas generales redibujadas (ver el kit en ../kit.ts): Victorias y Racha.
import { f } from '../helpers'
import { along, card, chessPiece, die, ellipse, flame, hair, KING, kit, laurel, P, PAWN, roundRect, sparkle, starPath, taper } from '../kit'

export const GENERALES_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Victorias ──────────────────────────────────────────────────────

  // La primera victoria: la primera ficha, de oro, en lo alto del podio, bajo una gloria de rayos.
  'Primera ficha': (u) => {
    const k = kit(u)
    const top = 'M41 73.4H79L82.4 78.6H37.6Z', front = 'M37.6 78.6H82.4V108H37.6Z'
    const one = 'M55.8 86.2L61.4 82.8H64.2V98.8H67.4V101.6H54.8V98.8H58.4V88.2L55.8 89.6Z'
    const chip = ellipse(60, 49.6, 17.4, 17.4), face = ellipse(60, 49.6, 12.4, 12.4)
    const notches = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8
      return `<rect x="-2.2" y="-1.3" width="4.4" height="2.6" rx=".6" fill="${P.red}" stroke="${P.ink}" stroke-width=".35" transform="translate(${f(60 + Math.cos(a) * 14.9)} ${f(49.6 + Math.sin(a) * 14.9)}) rotate(${f((a * 180) / Math.PI + 90)})"/>`
    }).join('')
    const sprigs = Array.from({ length: 10 }, (_, i) => {
      const a = Math.PI * (0.62 + (i / 9) * 0.76), x = 60 + Math.cos(a) * 9.6, y = 49.6 + Math.sin(a) * 9.6
      return `<path d="M0 0C1 -1.2 3 -1.4 4 -.4C3 .6 1 .8 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f((a * 180) / Math.PI + (i < 5 ? 70 : 110))})" fill="${P.goldD}"/>`
    }).join('')
    return (
      k.day() +
      k.sun(60, 47, 20, 46, 28, false) +
      `<rect x="31.6" y="33" width="4.4" height="2.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".3" transform="rotate(30 34 34)"/><rect x="84" y="31" width="4.4" height="2.2" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3" transform="rotate(-25 86 32)"/>` +
      `<g transform="translate(0 -6)">` +
      k.draw([
        { d: front, fill: P.white, line: 0.4, inner: k.sh('M66 76H84V110H66Z', 0, 0, 1, 0, 0, 0.8) + k.sh('M36 78H84V84H36Z', 0, 0, 0, 1, 0.6, 0, P.blue, 0.3) },
        { d: top, fill: P.sky1, line: 0.4, inner: k.sh(top, 0, 0, 1, 0, 0.2, 0.7, P.sky2, 0.4) },
      ]) +
      k.draw([{ d: one, fill: P.gold, inner: k.sh(one, 0, 0, 1, 1, 0, 1, P.goldD, 0.4) }], 0.45) +
      k.floor(61.6, 74.8, 15, 2) +
      `</g>` +
      k.cast([chip], 2.2, 2.2) +
      k.draw([
        { d: chip, fill: P.gold, inner: k.sh(chip, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M42 32H54V68H42Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` },
        { d: face, fill: P.goldL, inner: k.sh(face, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) },
      ], 0.8) +
      notches + sprigs +
      `<circle cx="60" cy="49.6" r="12.4" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` +
      k.draw([{ d: starPath(60, 49.6, 6.4, 2.7, 5), fill: P.gold, inner: k.sh(starPath(60, 49.6, 6.4, 2.7, 5), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.45) +
      `<path d="M47 41C49 37 53 35 57 34.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>` +
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
      die(k, 31.4, 70.4, 4.4, -10) + chip +
      chessPiece(k, PAWN, 72, 84, 0.72, P.gold, { shade: P.goldD, rings: [-.6] }) +
      sparkle(86, 30, 2) + sparkle(34, 30, 1.5) +
      k.defs()
    )
  },

  // Cincuenta: el rey del tablero, con capa, y los peones rivales tirados.
  'Dueño del tablero': (u) => {
    const k = kit(u)
    const iso = (a: number, b: number) => `${f(60 + (a - b) * 5)} ${f(72 + (a + b) * 2)}`
    let dark = ''
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) dark += `M${iso(i, j)}L${iso(i + 1, j)}L${iso(i + 1, j + 1)}L${iso(i, j + 1)}Z`
    const top = `M${iso(0, 0)}L${iso(6, 0)}L${iso(6, 6)}L${iso(0, 6)}Z`
    const left = 'M30 84L60 96V101L30 89Z'
    const right = 'M60 96L90 84V89L60 101Z'
    const cape = 'M-6 -10C-12 -8 -16 4 -18 24L18 24C16 4 12 -8 6 -10Z'
    return (
      k.day() +
      k.stage(60, 54, 32) +
      k.draw([
        { d: left, fill: P.brown, inner: k.sh(left, 0, 0, 1, 0, 0, 0.6, P.brownD) },
        { d: right, fill: P.brownD, inner: k.sh(right, 0, 0, 1, 0, 0.3, 0.8, P.night) },
        { d: top, fill: P.white, inner: `<path d="${dark}" fill="${P.sky}"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.6) },
      ], 0.7) +
      k.floor(61.4, 81.4, 12, 2.2, P.mid) +
      chessPiece(k, PAWN, 43, 86.6, 0.62, P.sky2, { rot: 84, rings: [-.6] }) + chessPiece(k, PAWN, 78, 87.6, 0.62, P.sky2, { rot: -80, rings: [-.6] }) +
      `<g transform="translate(60 56) scale(.98)">` +
      k.draw([{ d: cape, fill: P.red, inner: k.sh(cape, 0, 0, 1, 0, 0, 0.85, P.wine, 0.45) + hair(-8, -2, -11, 8, -12, 20, 0.6, P.wine) + hair(8, -2, 11, 8, 12, 20, 0.6, P.wine) }], 0.8) +
      `</g>` +
      chessPiece(k, KING, 60, 56, 0.98, P.white, { rings: [-5.6, 10.6, 16, 20.8] }) +
      `<g transform="translate(60 56) scale(.98)">` +
      `<path d="M-6.2 -10.6C-3 -8.4 3 -8.4 6.2 -10.6C6.4 -7.8 3.2 -6.4 0 -6.4C-3.2 -6.4 -6.4 -7.8 -6.2 -10.6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>` +
      [[-3.6, -8.6], [0, -7.6], [3.6, -8.6]].map(([x, y]) => `<path d="M${x} ${y - 0.8}l.6 1.4h-1.2Z" fill="${P.ink}"/>`).join('') +
      `<path d="M-1.6 -30.6H1.6V-26.6H5V-23.4H1.6V-19.6H-1.6V-23.4H-5V-26.6H-1.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<circle cx="0" cy="2" r="2.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-.6" cy="1.4" r=".6" fill="#fff"/>` +
      `</g>` +
      sparkle(32, 40, 2.4) + sparkle(88, 52, 1.8) +
      k.defs()
    )
  },

  // Cien: te besan el anillo antes de repartir. El anillo del capo, en su almohadón, con la rosa.
  'Capo di tutti capi': (u) => {
    const k = kit(u)
    const cushion = 'M28 80C27 71 34 66 60 66C86 66 93 71 92 80C93 89 86 94 60 94C34 94 27 89 28 80Z'
    const band = `${ellipse(60, 58, 12.6, 12.6)} ${ellipse(60, 58, 8.8, 8.8)}`
    const bc = k.id('ring')
    const gem = 'M60 32L67.6 37L66 45H54L52.4 37Z'
    const setting = 'M51.6 44.4H68.4L66.6 50.4H53.4Z'
    const tassel = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r})"><circle cx="0" cy="0" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M-1.4 1.2L-2 6H2L1.4 1.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M-.8 2V5.6M0 2V5.8M.8 2V5.6" stroke="${P.goldD}" stroke-width=".3"/></g>`
    const rose = 'M0 0C-2.6 -.4 -4 -2.6 -3 -4.8C-2 -6.8 .8 -7 2.4 -5.6C4 -4.2 4 -1.6 2.6 -.4C1.8 .2 .8 .2 0 0Z'
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.85), P.night, 0.6) +
      k.shade('M44 0H76L98 96H22Z', k.lin(P.goldL, 0, 0, 0, 1, 0.34, 0), P.goldL, 0.4) +
      k.floor(61, 93, 32, 3, P.night) +
      tassel(29, 80, 30) + tassel(91, 80, -30) +
      k.draw([{ d: cushion, fill: P.red, line: 0.4, inner: k.sh(cushion, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) + `<path d="M30 76C40 72 80 72 90 76" fill="none" stroke="#fff" stroke-width=".9" opacity=".35"/>` + hair(38, 82, 46, 78, 54, 76, 0.5, P.wine) + hair(82, 82, 74, 78, 66, 76, 0.5, P.wine) + `<circle cx="60" cy="80" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` }], 0.8) +
      k.floor(60, 70.6, 13, 2, P.wine) +
      `<path d="${band}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.6 .7)"/>` +
      `<path d="${band}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="${band}" fill-rule="evenodd" fill="${P.gold}"/>` +
      `<clipPath id="${bc}"><path d="${band}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${bc})">` + k.sh(ellipse(60, 58, 12.6, 12.6), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M44 40H56V76H44Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` + `</g>` +
      `<path d="M49.6 52.4C51 49.6 54 47.6 57.4 47" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      `<path d="${ellipse(60, 58, 10.7, 10.7)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
      k.draw([
        { d: setting, fill: P.gold, inner: k.sh(setting, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M53 46.4H67" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: gem, fill: P.red, inner: `<path d="M60 32L54 37H66Z" fill="#E8707A"/><path d="M54 37L57.6 45H54Z M66 37L62.4 45H66Z" fill="${P.wine}"/><path d="M57.6 37L60 45L62.4 37Z" fill="#D9545E"/>` + k.sh(gem, 0, 0, 1, 1, 0, 0.6, P.wine, 0.3) },
      ], 0.75) +
      `<path d="M57 34.4L55.4 36" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` +
      [[52.6, 44.6], [67.4, 44.6], [60, 45.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<g transform="translate(36.6 86) rotate(-14)">` +
      `<path d="M0 0C6 1 12 1 18 0" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M0 0C6 1 12 1 18 0" fill="none" stroke="${P.greenD}" stroke-width="1"/>` +
      `<path d="M8 .4C9.6 -2.6 13 -3 14 -1C12.4 .6 10 1 8 .4Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: rose, fill: P.red, inner: k.sh(rose, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + `<path d="M-1.6 -3.6C-.6 -4.8 1.4 -4.4 1.4 -2.8C1.4 -1.6 -.2 -1.4 -.6 -2.4" fill="none" stroke="${P.wine}" stroke-width=".4"/>` }], 0.45) +
      `</g>` +
      sparkle(60, 28, 2.6, P.goldL) + sparkle(84, 50, 1.6, P.goldL) +
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

  // Quince seguidas: pasaste de nivel. El aura dorada que explota, con rayos y piedras que flotan.
  'Modo Saiyan': (u) => {
    const k = kit(u)
    const aura = (scale: number) => {
      let d = ''
      const N = 30
      for (let i = 0; i <= N * 2; i++) {
        const a = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2, up = Math.max(0, -Math.sin(a))
        const r = ((i % 2 ? 22 : 28 + up * 12) * (1 + up * 0.15)) * scale
        d += (i ? 'L' : 'M') + f(60 + Math.cos(a) * r * 0.9) + ' ' + f(64 + Math.sin(a) * r)
      }
      return d + 'Z'
    }
    const outer = aura(1.12), inner = aura(0.82)
    const core = ellipse(60, 64, 12.6, 12.6)
    const rock = (x: number, y: number, s: number, r: number) => {
      const d = 'M-3 -1.6L-1 -3.2L2.4 -2.6L3.4 .4L1.4 2.8L-2.2 2.4Z'
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.sky2, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.mid) }], 0.4 / s) + `</g>`
    }
    const bolt = (pts: number[][]) => `<path d="M${pts.map((p) => p.join(' ')).join('L')}" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linejoin="round"/><path d="M${pts.map((p) => p.join(' ')).join('L')}" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-linejoin="round"/>`
    return (
      k.night() +
      k.draw([{ d: outer, fill: P.gold, inner: k.shade(outer, k.rad(P.goldD, 0.5, 0.6, 0.6, 0, 0.9), P.goldD, 0.4) }], 0.6) +
      `<path d="${inner}" fill="${P.goldL}"/>` + k.shade(inner, k.rad(P.gold, 0.5, 0.6, 0.55, 0, 0.8), P.gold, 0.35) +
      Array.from({ length: 8 }, (_, i) => { const x = 46 + i * 4; return hair(x, 84, x - 1 + (i % 2) * 2, 66, x, 46 - (i % 3) * 4, 0.7, '#fff', 0.8) }).join('') +
      k.shade(ellipse(60, 64, 22, 22), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.95, 0), '#ffffff', 0.6) +
      k.draw([{ d: core, fill: P.white, inner: k.shade(core, k.rad(P.goldL, 0.5, 0.5, 0.5, 0, 0.9), P.gold, 0.4) }], 0.5) +
      `<path d="M53 58C55 55 58 54 61 54" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` +
      bolt([[30, 50], [35, 55], [32, 57], [38, 63]]) + bolt([[90, 44], [85, 49], [88, 51], [83, 57]]) +
      k.floor(61, 94, 16, 2.2, '#000') +
      rock(34, 86, 1.3, 10) + rock(86, 88, 1, -20) + rock(80, 70, 0.8, 50) +
      sparkle(84, 32, 2.2, P.goldL) + sparkle(36, 32, 1.6, P.goldL) +
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
