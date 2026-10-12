// Medallas del truco, redibujadas (ver el kit en ../kit.ts): envidos, faltas envido y partidos ganados.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'

/** Corchea en (x,y). */
const note = (x: number, y: number, r: number, c: string = P.ink) =>
  `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="0" cy="0" rx="2.1" ry="1.55" transform="rotate(-20)" fill="${c}"/>` +
  `<path d="M1.9 -.4V-8.8C3.8 -7.8 5.2 -6.6 4.6 -4.4" fill="none" stroke="${c}" stroke-width=".75" stroke-linecap="round"/></g>`

/** Dos semicorcheas unidas en (x,y). */
const notes2 = (x: number, y: number, r: number, c: string = P.ink) =>
  `<g transform="translate(${x} ${y}) rotate(${r})">` +
  `<ellipse cx="0" cy="0" rx="2" ry="1.5" transform="rotate(-20)" fill="${c}"/><ellipse cx="6.4" cy="-1.6" rx="2" ry="1.5" transform="rotate(-20 6.4 -1.6)" fill="${c}"/>` +
  `<path d="M1.8 -.4V-8.8M8.2 -2V-10.4" stroke="${c}" stroke-width=".75"/><path d="M1.8 -8.8L8.2 -10.4V-8.6L1.8 -7Z" fill="${c}"/></g>`

/** Ficha de casino de canto: un cilindro chato con las rayas blancas, centrado en (x,y) (la cara de arriba). */
function chip(k: Kit, x: number, y: number, rx: number, c: string, th = 2.2) {
  const dk = c === P.red ? P.wine : c === P.gold ? P.goldD : c === P.white ? P.blue : '#0E1533'
  const ry = f(rx * 0.36)
  const side = `M${f(x - rx)} ${y}V${f(y + th)}A${rx} ${ry} 0 0 0 ${f(x + rx)} ${f(y + th)}V${y}A${rx} ${ry} 0 0 1 ${f(x - rx)} ${y}Z`
  const top = ellipse(x, y, rx, rx * 0.36)
  const dash = f((rx * Math.PI) / 8)
  const stripe = c === P.white ? P.red : P.white
  return (
    k.draw([
      { d: side, fill: c, inner: `<path d="M${f(x - rx)} ${f(y + th / 2)}A${rx} ${ry} 0 0 0 ${f(x + rx)} ${f(y + th / 2)}" fill="none" stroke="${stripe}" stroke-width="${f(th * 0.8)}" stroke-dasharray="${f(dash * 0.5)} ${dash}"/>` + k.sh(side, 0, 0, 1, 0, 0, 0.85, dk, 0.4) },
      { d: top, fill: c, inner: `<path d="${ellipse(x, y, rx * 0.68, rx * 0.25)}" fill="none" stroke="${stripe}" stroke-width=".5" stroke-dasharray="1.2 .9"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.5, dk, 0.3) + `<path d="${ellipse(x - rx * 0.3, y - rx * 0.08, rx * 0.3, rx * 0.08)}" fill="#fff" opacity=".35"/>` },
    ], 0.45)
  )
}

/** Fósforo acostado (de canto), de (x0,y0) a la cabeza en (x1,y1). */
function palito(k: Kit, x0: number, y0: number, x1: number, y1: number, w = 2.6) {
  const a = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0), deg = f((a * 180) / Math.PI)
  const stick = `M0 ${f(-w / 2)}H${f(len)}V${f(w / 2)}H0Z`
  const head = ellipse(len + 0.6, 0, w * 0.95, w * 0.78)
  return (
    `<g transform="translate(${x0} ${y0}) rotate(${deg})">` +
    k.draw([
      { d: stick, fill: P.goldL, inner: `<path d="M0 ${f(w * 0.1)}H${f(len)}V${f(w / 2 + 1)}H0Z" fill="${P.gold}"/>` + `<path d="M0 ${f(-w / 2)}H${f(len)}" stroke="#fff" stroke-width=".5" opacity=".7"/>` },
      { d: head, fill: P.red, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + `<ellipse cx="${f(len)}" cy="${f(-w * 0.3)}" rx="${f(w * 0.4)}" ry="${f(w * 0.22)}" fill="#fff" opacity=".6"/>` },
    ], 0.45) +
    `</g>`
  )
}

export const TRUCO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Cantor de envidos ──────────────────────────────────────────────

  // Diez envidos: ya te pasan en la AM de la tarde. La radio capilla del abuelo, con un pajarito que canta arriba.
  'Pajarito de la radio': (u) => {
    const k = kit(u)
    const body = 'M39 87V61C39 51 47 43.4 60 41.6C73 43.4 81 51 81 61V87Z'
    const plinth = 'M37 85H83L84 89.4H36Z'
    const grill = 'M45.4 71V61.6C45.4 54.4 51.4 49 60 47.6C68.6 49 74.6 54.4 74.6 61.6V71Z'
    const dial = roundRect(48.6, 74, 71.4, 80.8, 1.6)
    const knob = (x: number) =>
      k.draw([{ d: ellipse(x, 77.4, 2.7, 2.7), fill: P.brownD, inner: k.sh(ellipse(x, 77.4, 2.7, 2.7), 0, 0, 1, 1, 0, 0.9, P.night, 0.4) }], 0.4) +
      `<circle cx="${x}" cy="77.4" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><path d="M${x} 76V77.4" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(x - 0.9)}" cy="76.4" r=".5" fill="#fff" opacity=".7"/>`
    const ribs =
      `<path d="M52.4 46V72M60 46V72M67.6 46V72" stroke="${P.ink}" stroke-width="3"/><path d="M52.4 46V72M60 46V72M67.6 46V72" stroke="${P.brown}" stroke-width="1.7"/>` +
      `<path d="M45.4 66H74.6" stroke="${P.ink}" stroke-width="2.6"/><path d="M45.4 66H74.6" stroke="${P.brown}" stroke-width="1.3"/>` +
      `<path d="M51.6 46V72M59.2 46V72M66.8 46V72" stroke="${P.goldL}" stroke-width=".4" opacity=".8"/>`
    const cloth = Array.from({ length: 12 }, (_, i) => `<path d="M44 ${f(49 + i * 2)}H76" stroke="${P.goldD}" stroke-width=".25" opacity=".55"/>`).join('')
    const ticks = Array.from({ length: 11 }, (_, i) => `<path d="M${f(51 + i * 1.8)} 75.4V${i % 2 ? 76.4 : 77}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    // El pajarito, mirando a la izquierda, con las patas en (0,0).
    const birdBody = 'M-6.4 -7.6C-6.4 -12 -2.8 -14.6 1.2 -14.2C6 -13.8 8.6 -10.2 8.2 -6.8C7.8 -3.2 4.6 -1.2 .8 -1.2C-3.4 -1.2 -6.4 -3.6 -6.4 -7.6Z'
    const birdHead = ellipse(-4.2, -15.2, 4.1, 3.9)
    const birdTail = 'M6.6 -8.6L14 -12C14.8 -12.2 15.2 -11.4 14.6 -10.8L7.8 -4.8Z'
    const bird =
      `<g transform="translate(61.4 42.4)">` +
      `<path d="M-1 -1.6L-1.6 .2M2.2 -1.6L2.6 .2" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([
        { d: birdTail, fill: P.gold, inner: k.sh(birdTail, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) },
        { d: birdBody, fill: P.gold, inner: k.sh('M0 -16H10V0H0Z', 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-7 -16H-1V0H-7Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` },
        { d: birdHead, fill: P.gold, inner: k.sh(birdHead, 0.2, 0, 1, 1, 0, 0.8, P.goldD, 0.4) },
      ], 0.5) +
      `<path d="M-1 -10.4C2 -12.6 6.8 -11 7.8 -7.6C5 -6 1 -6.6 -1 -10.4Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".35"/>` +
      hair(1, -9.4, 4, -9.4, 6.6, -7.8, 0.4, P.ink) +
      `<path d="M-8 -17L-12.8 -18.6L-8.2 -15Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".35" stroke-linejoin="round"/>` +
      `<path d="M-8.2 -14.4L-12.2 -13.2L-7.8 -12.8Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".35" stroke-linejoin="round"/>` +
      `<circle cx="-4.8" cy="-16.2" r=".8" fill="${P.ink}"/><circle cx="-4.6" cy="-16.5" r=".25" fill="#fff"/>` +
      `<ellipse cx="-3.4" cy="-13.4" rx="1.3" ry=".8" fill="${P.red}" opacity=".35"/>` +
      `</g>`
    return (
      k.day() +
      k.stage(60, 62, 34) +
      k.floor(61, 89.4, 26, 2.6) +
      k.draw([
        { d: plinth, fill: P.brownD, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M37.4 86.2H82.6" stroke="${P.goldL}" stroke-width=".4" opacity=".5"/>` },
        {
          d: body, fill: P.brown, line: 0.35,
          inner:
            k.sh('M64 40C76 46 80 60 79 90H86V40Z', 0, 0, 1, 0, 0, 0.95, P.brownD, 0.45) + k.sh('M36 80H84V90H36Z', 0, 0, 0, 1, 0, 0.6, P.brownD, 0.35) +
            `<path d="M38 40H47V90H38Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.5, 0)}"/>` +
            hair(41.4, 60, 40.8, 72, 41.6, 85, 0.45, P.brownD) + hair(43, 56, 42.4, 66, 43.2, 76, 0.35, P.brownD) + hair(78.6, 60, 79.2, 72, 78.4, 85, 0.45, P.brownD) + hair(76.8, 58, 77.6, 68, 76.8, 78, 0.35, P.brownD) +
            `<path d="M42.2 85V61.4C42.2 52.4 49.4 45.8 60 44.2C70.6 45.8 77.8 52.4 77.8 61.4V85" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".75"/>`,
        },
      ], 0.75) +
      k.draw([{ d: grill, fill: P.goldL, inner: cloth + k.sh(grill, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) + ribs + k.sh('M45 46H75V52H45Z', 0, 0, 0, 1, 0.7, 0, P.brownD, 0.3) }], 0.5) +
      k.draw([{ d: dial, fill: P.goldL, inner: k.shade(dial, k.rad(P.gold, 0.5, 0.6, 0.6, 0, 0.9), P.goldD, 0.4) + ticks }], 0.45) +
      `<text x="52.2" y="80" ${GEORGIA} font-weight="700" font-size="2.6" fill="${P.ink}" text-anchor="middle">AM</text>` +
      `<path d="M62.4 80.2L64.2 75" stroke="${P.red}" stroke-width=".6" stroke-linecap="round"/>` +
      knob(44.2) + knob(75.8) +
      bird +
      note(40, 40, -14) + notes2(29.6, 56, -8) +
      hair(86, 52, 89.6, 59, 86, 66, 0.7) + hair(89.8, 47, 95, 59, 89.8, 71, 0.6) + hair(83.2, 56, 85, 59, 83.2, 62, 0.6) +
      sparkle(84, 40, 2.2) + sparkle(30, 80, 1.5) +
      k.defs()
    )
  },

  // Cuarenta envidos: cantás los tantos con voz de tango. El zorzal, de gacho y lengue, canta sobre el bandoneón.
  'Zorzal criollo': (u) => {
    const k = kit(u)
    const boxL = roundRect(37, 71, 48.4, 89, 2.4), boxR = roundRect(71.6, 71, 83, 89, 2.4)
    const bellows = 'M47.6 72.4H72.4V87.6H47.6Z'
    const pleats = Array.from({ length: 8 }, (_, i) => {
      const x = 47.6 + i * 3.1
      return `<path d="M${f(x + 1.55)} 72.4V87.6" stroke="${P.blue}" stroke-width="1.6" opacity=".55"/><path d="M${f(x + 3.1)} 72.4V87.6" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="M${f(x + 0.4)} 72.6L${f(x + 1.55)} 74.4L${f(x + 2.7)} 72.6ZM${f(x + 0.4)} 87.4L${f(x + 1.55)} 85.6L${f(x + 2.7)} 87.4Z" fill="${P.gold}"/>`
    }).join('')
    const buttons = (x0: number) => Array.from({ length: 12 }, (_, i) => `<circle cx="${f(x0 + (i % 3) * 2.8)}" cy="${f(75.4 + Math.floor(i / 3) * 3.6 + (i % 3 === 1 ? 1.2 : 0))}" r=".8" fill="${P.paper}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    const box = (d: string, x0: number) => ({
      d, fill: P.night,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, '#0E1533', 0.4) + `<path d="${d}" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.35, 0)}"/>` +
        `<path d="${roundRect(x0 - 2, 72.6, x0 + 7.6, 87.4, 1.6)}" fill="none" stroke="${P.gold}" stroke-width=".45"/>` + buttons(x0),
    })
    // El zorzal, mirando a la izquierda, con las patas en (0,0).
    const tail = 'M9 -10L24 -3.4C25 -3 24.8 -1.4 23.6 -1.6L8 -4Z'
    const body = 'M-11 -17C-12 -24 -6 -28 1 -27.6C9 -27 15 -21 15 -13.6C15 -6.4 9 -2.6 1.4 -2.6C-6 -2.6 -10.4 -9.6 -11 -17Z'
    const head = ellipse(-7.6, -28.4, 6.4, 6)
    const chest = ellipse(-5.4, -12.4, 7, 10.4)
    const wing = 'M-2 -21C4 -24.4 12 -21.4 14.4 -14C11.6 -10.4 3.6 -11.6 -2 -21Z'
    const spots = [[-8, -15], [-5, -13], [-2, -15.6], [-7, -10], [-3.6, -8.4], [-0.6, -11], [-5.6, -6]]
      .map(([x, y]) => `<path d="M${x} ${f(y - 1.2)}C${f(x + 0.9)} ${f(y - 0.2)} ${f(x + 0.8)} ${f(y + 0.8)} ${x} ${f(y + 0.8)}C${f(x - 0.8)} ${f(y + 0.8)} ${f(x - 0.9)} ${f(y - 0.2)} ${x} ${f(y - 1.2)}Z" fill="${P.brownD}"/>`).join('')
    const crown = 'M-14 -34.6C-14.6 -39.4 -12 -42.4 -8 -42.6C-6.6 -41.4 -4.6 -41.4 -3.2 -42.4C.4 -42 1.4 -38.8 .6 -34.6Z'
    const brim = 'M-19.6 -34C-17 -36.8 2 -37.4 5.4 -34.6C6 -33.6 3.6 -32.6 1 -32.8C-5 -33.4 -12 -33 -17.4 -32.2C-19 -32 -20.2 -33 -19.6 -34Z'
    const scarf = 'M-13 -23.6C-8 -20.4 -1 -20.6 3 -24L4.4 -21.4C0 -17.4 -8.6 -17 -13.6 -20.6Z'
    const scarfTail = 'M.6 -21.6C4.6 -18.2 9 -17.4 14.6 -18.8L13.4 -15.4C8 -14.4 3.4 -15.6 -1 -19.4Z'
    const zorzal =
      `<g transform="translate(62 71.2) scale(1.05)">` +
      `<path d="M-3 -3L-4 0M2.6 -3L3.2 0M-5.6 .2H-2.4M1.6 .2H4.6" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
      k.draw([
        { d: tail, fill: P.brown, inner: k.sh(tail, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + hair(10, -7.4, 16, -5, 23, -2.6, 0.4, P.brownD) },
        {
          d: body, fill: P.brown,
          inner: `<path d="${chest}" fill="${P.white}"/>` + k.sh(chest, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.35) + spots +
            k.sh('M4 -30H18V0H4Z', 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + k.sh('M-14 -8H18V0H-14Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3),
        },
        { d: head, fill: P.brown, inner: k.sh(head, 0.2, 0, 1, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M-14 -27.6C-11 -26 -8 -26 -4 -27V-22H-14Z" fill="${P.white}"/>` },
      ], 0.75) +
      k.draw([{ d: wing, fill: P.brownD, inner: k.sh(wing, 0, 0, 1, 1, 0, 0.8, P.night, 0.35) }], 0.4) +
      hair(1, -19.4, 7, -18.6, 12.6, -14.6, 0.5, P.goldL, 0.7) + hair(2.6, -16.4, 7.6, -15.4, 12, -12.4, 0.45, P.goldL, 0.6) +
      `<path d="M-13.2 -30.6L-21.6 -33.6L-13.6 -27.6Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<path d="M-13.6 -27.6L-19.4 -28.4L-13.4 -26.8Z" fill="${P.wine}"/>` +
      `<path d="M-13.4 -26.8L-20.4 -26.6L-12.6 -25Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<path d="M-10.6 -30.2Q-8.8 -28.6 -7 -30.2" fill="none" stroke="${P.ink}" stroke-width=".85" stroke-linecap="round"/>` + hair(-10.4, -29.4, -11.4, -28.8, -12, -28, 0.4) +
      k.draw([
        { d: scarf, fill: P.white, inner: k.sh(scarf, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) },
        { d: scarfTail, fill: P.white, inner: k.sh(scarfTail, 0, 0, 1, 1, 0.1, 0.7, P.blue, 0.35) + hair(2, -19.6, 7, -17, 12.6, -17, 0.4, P.blue) },
      ], 0.45) +
      `<path d="M14.2 -18.4L15.8 -17.6M14.4 -17.2L16 -16.2M13.8 -16L15.4 -14.8" stroke="${P.paper}" stroke-width=".35"/>` +
      `<g transform="rotate(-9 -7 -34)">` +
      k.draw([
        { d: crown, fill: P.sky2, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.9, P.mid, 0.4) + `<path d="M-14.2 -36.8C-9.6 -38 -4 -38 .8 -36.8L.6 -34.6C-4 -35.6 -9.6 -35.6 -14 -34.6Z" fill="${P.ink}"/>` + hair(-5.6, -41.8, -5.4, -39.6, -5.8, -38, 0.5, P.mid) },
        { d: brim, fill: P.sky2, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + `<path d="M-17 -34.2C-10 -35.6 0 -35.8 3.6 -34.6" fill="none" stroke="${P.white}" stroke-width=".45" opacity=".7"/>` },
      ], 0.55) +
      `</g>` +
      `</g>`
    return (
      k.night() +
      k.shade('M47 0H73L104 104H16Z', k.lin(P.goldL, 0, 0, 0, 1, 0.42, 0.1), P.goldL, 0.4) +
      k.shade(ellipse(60, 90, 30, 6), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.45) +
      [[30, 36], [90, 32], [27, 70], [94, 74], [38, 24], [84, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.floor(61, 90, 26, 2.4, '#000') +
      `<path d="M48.4 76C55 74 65 74 71.6 76M48.4 84C55 86 65 86 71.6 84" stroke="${P.brownD}" stroke-width="1.2"/>` +
      k.draw([box(boxL, 39.4), box(boxR, 74)], 0.7) +
      k.draw([{ d: bellows, fill: P.white, inner: pleats + k.sh(bellows, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) }], 0.55) +
      `<path d="M38.4 74.8C41 79 41.6 83 39.4 87.2M81.6 74.8C79 79 78.4 83 80.6 87.2" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M38.4 74.8C41 79 41.6 83 39.4 87.2M81.6 74.8C79 79 78.4 83 80.6 87.2" fill="none" stroke="${P.brown}" stroke-width="1.2" stroke-linecap="round"/>` +
      zorzal +
      note(33.6, 46, -14, P.goldL) + notes2(28, 58, -6, P.goldL) + note(86, 46, 12, P.goldL) +
      sparkle(80, 30, 2, P.goldL) + sparkle(34, 32, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Ciento veinte envidos: cada día cantás mejor. El disco de pasta del Abasto, con el gacho gris requintado, en el
  // lugar de la cara del sol de Mayo y entre laureles.
  'Gardel en el Abasto': (u) => {
    const k = kit(u)
    const cx = 60, cy = 60, R = 24.6
    const pt = (r: number, a: number) => `${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`
    const disc = ellipse(cx, cy, R, R)
    const label = ellipse(cx, cy, 9.8, 9.8)
    const grooves = Array.from({ length: 13 }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${f(11 + i * 1.05)}" fill="none" stroke="${P.mid}" stroke-width="${i % 4 === 2 ? 0.55 : 0.22}" opacity=".8"/>`).join('')
    const shine = (a0: number, a1: number) =>
      Array.from({ length: 9 }, (_, i) => {
        const r = 11.6 + i * 1.5, mid = 1 - Math.abs(i - 4) / 5
        return `<path d="M${pt(r, a0)}A${r} ${r} 0 0 1 ${pt(r, a1)}" fill="none" stroke="#fff" stroke-width="${f(0.4 + mid * 0.5)}" stroke-linecap="round" opacity="${f(0.25 + mid * 0.5)}"/>`
      }).join('')
    const arcTop = k.id('arc'), arcBot = k.id('arc')
    // Gacho gris, con la base del ala en (0,0): copa con la hendidura, cinta con moño, ala ribeteada.
    const crown = 'M-9.6 -1.6C-10.4 -7 -9 -12 -5.4 -13.4C-3.4 -12.2 -1.4 -12 0 -12.8C1.4 -12 3.4 -12.2 5.4 -13.4C9 -12 10.4 -7 9.6 -1.6Z'
    const brim = 'M-16.4 -.4C-16.4 -3.4 16.4 -3.4 16.4 -.4C16.4 2 9.4 3.6 0 3.6C-9.4 3.6 -16.4 2 -16.4 -.4Z'
    const band = 'M-9.8 -4.8C-3.4 -3.4 3.4 -3.4 9.8 -4.8L9.7 -1.6C3.4 -.4 -3.4 -.4 -9.7 -1.6Z'
    const bow = 'M-9.6 -4.2L-12.4 -6.2L-12 -1.8L-9.6 -2.6Z'
    const hat =
      `<g transform="translate(60.6 36.2) rotate(9) scale(1.1)">` +
      k.cast([brim, crown], 1.4, 1.2) +
      k.draw([
        { d: brim, fill: P.sky2, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.85, P.mid, 0.45) + `<path d="M-15.4 -.6C-15.4 1.4 -8.6 2.8 0 2.8C8.6 2.8 15.4 1.4 15.4 -.6" fill="none" stroke="${P.mid}" stroke-width=".35" stroke-dasharray=".8 .6"/>` + `<path d="M-14 -1.4C-6 -2.8 6 -2.8 14 -1.4" fill="none" stroke="${P.white}" stroke-width=".5" opacity=".8"/>` },
        {
          d: crown, fill: P.sky2,
          inner: k.sh(crown, 0.2, 0, 1, 0, 0, 0.95, P.mid, 0.45) + `<path d="M-10 -14H-4.6V0H-10Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
            hair(0, -12.4, -0.8, -9, 0, -5.6, 0.6, P.mid) + hair(-5.4, -12.8, -7, -9.4, -7, -5.6, 0.45, P.mid) + hair(5.4, -12.8, 6.6, -9.4, 6.8, -5.6, 0.45, P.mid) +
            k.sh('M-10 -14H10V-10H-10Z', 0, 0, 0, 1, 0.5, 0, P.mid, 0.3),
        },
      ], 0.6) +
      `<path d="${band}" fill="${P.ink}"/><path d="M-9.4 -4.2C-3.4 -2.8 3.4 -2.8 9.4 -4.2" fill="none" stroke="${P.mid}" stroke-width=".35"/>` +
      `<path d="${bow}" fill="${P.ink}" stroke="${P.ink}" stroke-width=".3" stroke-linejoin="round"/><path d="M-11.6 -5.2L-11.4 -2.6" stroke="${P.mid}" stroke-width=".3"/>` +
      `</g>`
    return (
      k.day() +
      k.sun(cx, cy, 24, 46) +
      k.shade(ellipse(cx, cy, 34, 34), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.35) +
      laurel(51.4, 98, 31, 91, 28.6, 64, 8) + laurel(68.6, 98, 89, 91, 91.4, 64, 8, true) +
      k.cast([disc], 2.6, 2.2) +
      k.draw([{
        d: disc, fill: P.night,
        inner: grooves + k.sh(disc, 0, 0, 1, 1, 0, 0.8, '#0E1533', 0.4) + shine(-2.55, -1.95) + shine(0.6, 1.2) +
          `<circle cx="${cx}" cy="${cy}" r="${f(R - 0.9)}" fill="none" stroke="${P.blue}" stroke-width=".5" opacity=".8"/>`,
      }], 0.85) +
      k.draw([{
        d: label, fill: P.gold,
        inner: k.sh(label, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M${cx - 10} ${cy - 10}H${cx - 2}V${cy + 10}H${cx - 10}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
          `<circle cx="${cx}" cy="${cy}" r="8.8" fill="none" stroke="${P.goldD}" stroke-width=".4"/><circle cx="${cx}" cy="${cy}" r="8.1" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1" stroke-linecap="round"/>`,
      }], 0.45) +
      `<path id="${arcTop}" d="M${cx - 5.9} ${cy}A5.9 5.9 0 0 1 ${cx + 5.9} ${cy}" fill="none"/><path id="${arcBot}" d="M${cx - 7.6} ${cy}A7.6 7.6 0 0 0 ${cx + 7.6} ${cy}" fill="none"/>` +
      `<text ${GEORGIA} font-weight="700" font-size="3.1" letter-spacing=".35" fill="${P.ink}"><textPath href="#${arcTop}" startOffset="50%" text-anchor="middle">ABASTO</textPath></text>` +
      `<text ${GEORGIA} font-style="italic" font-size="2.3" fill="${P.ink}"><textPath href="#${arcBot}" startOffset="50%" text-anchor="middle">cada día mejor</textPath></text>` +
      `<path d="${starPath(cx - 4.6, cy + 1.2, 1, 0.42, 5)}${starPath(cx + 4.6, cy + 1.2, 1, 0.42, 5)}" fill="${P.ink}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="1.3" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/>` +
      hat +
      note(34.4, 44, -14) + notes2(80.6, 40, 10) +
      sparkle(87, 74, 2.2) + sparkle(33, 77, 1.8) +
      k.defs()
    )
  },

  // ── Jugado a la falta ──────────────────────────────────────────────

  // Una falta envido: metiste la mano en la lata de los ahorros, y salió bien.
  'Mano en la lata': (u) => {
    const k = kit(u)
    const cx = 58, top = 55, bot = 88, rx = 19, ry = 5.4
    const body = `M${cx - rx} ${top}V${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}V${top}A${rx} ${ry} 0 0 1 ${cx - rx} ${top}Z`
    const band = (y: number, h: number) => `M${cx - rx} ${y}A${rx} ${ry} 0 0 0 ${cx + rx} ${y}V${f(y + h)}A${rx} ${ry} 0 0 1 ${cx - rx} ${f(y + h)}Z`
    const mouth = ellipse(cx, top, rx, ry)
    const label = 'M44 69.4Q58 73.8 72 69.4V81.2Q58 85.6 44 81.2Z'
    const bill = (x: number, y: number, r: number) => {
      const d = roundRect(-6.4, -11, 6.4, 3, 0.6)
      return `<g transform="translate(${x} ${y}) rotate(${r})">` +
        k.draw([{ d, fill: P.green, inner: `<rect x="-5.2" y="-9.8" width="10.4" height="11.6" fill="none" stroke="${P.paper}" stroke-width=".5"/><ellipse cx="0" cy="-4" rx="2.6" ry="3.4" fill="${P.greenD}"/>` + k.sh(d, 0, 0, 1, 1, 0, 0.7, P.greenD, 0.35) }], 0.45) +
        `<text x="-3.6" y="-6.4" ${GEORGIA} font-weight="700" font-size="2.8" fill="${P.paper}" text-anchor="middle">$</text></g>`
    }
    const coin = (x: number, y: number, r: number, sx = 1) =>
      `<g transform="translate(${x} ${y}) scale(${sx} 1)">` + k.draw([{ d: ellipse(0, 0, r, r), fill: P.gold, inner: k.sh(ellipse(0, 0, r, r), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.45 / sx) +
      `<circle cx="0" cy="0" r="${f(r * 0.66)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/><circle cx="${f(-r * 0.35)}" cy="${f(-r * 0.35)}" r="${f(r * 0.2)}" fill="#fff" opacity=".8"/></g>`
    // El brazo entra a la lata desde arriba a la derecha (coordenadas del brazo: la mano abajo, en y>0).
    const sleeve = 'M-7 -14.6L-9.6 -60H9.6L7 -14.6Z'
    const cuff = roundRect(-7.2, -15.6, 7.2, -8.6, 1)
    const hand = 'M-5.8 12C-6.2 4 -6.4 -4 -5.6 -9.4H5.6C6.4 -4 6.2 4 5.8 12Z'
    const thumb = 'M-5.4 -6.6C-8.6 -5.4 -9.6 -1.6 -8.4 2C-8 3.2 -6.4 3.2 -6 2Z'
    const arm =
      `<g transform="translate(62.4 60.8) rotate(36)">` +
      k.draw([
        { d: thumb, fill: P.skin, inner: k.sh(thumb, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
        { d: hand, fill: P.skin, inner: k.sh('M1 -12H8V14H1Z', 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) + `<ellipse cx="-2.6" cy="-5.6" rx="1.4" ry="2.4" fill="#fff" opacity=".6"/>` + hair(-3.6, -1.2, -1.6, -2.2, 0, -1.4, 0.5, P.blue) + hair(1, -1.6, 2.8, -2.4, 4.4, -1.4, 0.5, P.blue) + hair(-1.6, -8, -1, -5.6, -1.6, -3.4, 0.4, P.blue) },
        { d: sleeve, fill: P.sky, inner: k.sh('M1 -62H12V-12H1Z', 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) + `<path d="M-10 -62H-3V-12H-10Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + hair(-3, -50, -1.6, -36, -3.4, -22, 0.55, P.mid) + hair(4, -46, 5, -34, 3.6, -20, 0.5, P.mid) },
        { d: cuff, fill: P.white, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.8, P.blue, 0.35) + `<path d="M-7.2 -12.2H7.2" stroke="${P.sky2}" stroke-width=".4"/>` },
      ], 0.7) +
      `<circle cx="3.6" cy="-12.2" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>`
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(60, 92, 23, 3) +
      k.draw([{ d: mouth, fill: P.night, inner: k.shade(ellipse(cx, top + 3, rx, ry), k.rad(P.red, 0.5, 0.5, 0.5, 0.7, 0), P.red, 0.3) }], 0.6) +
      bill(48.6, 53.6, -26) + bill(54, 51.6, -8) +
      arm +
      k.draw([{
        d: body, fill: P.red,
        inner:
          `<path d="${band(top + 2.4, 3.4)}" fill="${P.gold}"/><path d="${band(bot - 6.4, 3.4)}" fill="${P.gold}"/>` +
          `<path d="M${cx - rx} ${f(top + 4.1)}A${rx} ${ry} 0 0 0 ${cx + rx} ${f(top + 4.1)}M${cx - rx} ${f(bot - 4.7)}A${rx} ${ry} 0 0 0 ${cx + rx} ${f(bot - 4.7)}" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` +
          k.sh('M64 50C74 58 76 76 74 96H80V50Z', 0, 0, 1, 0, 0, 0.95, P.wine, 0.45) + `<path d="M38 50H46V96H38Z" fill="${k.lin('#FFD9CF', 0, 0, 1, 0, 0.55, 0)}"/>` +
          `<path d="${label}" fill="${P.paper}" stroke="${P.goldD}" stroke-width=".5"/><path d="M45.4 70.8Q58 74.8 70.6 70.8V79.8Q58 83.8 45.4 79.8Z" fill="none" stroke="${P.gold}" stroke-width=".35"/>` +
          `<text x="${cx}" y="79.2" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle">ahorros</text>` +
          k.sh(label, 0, 0, 1, 0, 0, 0.6, P.blue, 0.25),
      }], 0.8) +
      `<path d="M${cx - rx} ${top}A${rx} ${ry} 0 0 0 ${cx + rx} ${top}" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` +
      coin(37.6, 38.6, 3.2) + coin(46.4, 31.6, 2.6, 0.5) +
      `<g transform="translate(83 88) scale(1 .42)">${k.draw([{ d: ellipse(0, 0, 3.4, 3.4), fill: P.gold, inner: k.sh(ellipse(0, 0, 3.4, 3.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.5)}</g>` +
      hair(42.4, 42, 44, 45.4, 46.6, 47.8, 0.6) + hair(35.4, 45.6, 38.4, 48.6, 42, 50, 0.55) +
      sparkle(30, 42, 2) + sparkle(52, 26, 1.6) + sparkle(84, 70, 1.6) +
      k.defs()
    )
  },

  // Tres faltas envido: te reconocen en la ruleta de la Bristol.
  'Casino de Mar del Plata': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58, q = 0.46
    const E = (r: number, dy = 0) => ellipse(cx, cy + dy, r, r * q)
    const pt = (r: number, a: number, dy = 0) => `${f(cx + r * Math.cos(a))} ${f(cy + dy + r * q * Math.sin(a))}`
    const N = 26
    const pockets = Array.from({ length: N }, (_, i) => {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2
      const c = i === 0 ? P.green : i % 2 ? P.red : P.night
      return `<path d="M${pt(24.6, a0)}L${pt(24.6, a1)}L${pt(17.2, a1)}L${pt(17.2, a0)}Z" fill="${c}" stroke="${P.goldL}" stroke-width=".3"/>`
    }).join('')
    const numbers = Array.from({ length: N }, (_, i) => {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2
      return `<path d="M${pt(27, a0)}L${pt(27, a1)}L${pt(24.6, a1)}L${pt(24.6, a0)}Z" fill="${i === 0 ? P.green : i % 2 ? P.wine : P.ink}" stroke="${P.goldL}" stroke-width=".25"/>`
    }).join('')
    const deflect = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + 0.2, x = cx + 29.6 * Math.cos(a), y = cy + 29.6 * q * Math.sin(a)
      return `<path d="M${f(x - 1.3)} ${f(y)}L${f(x)} ${f(y - 0.7)}L${f(x + 1.3)} ${f(y)}L${f(x)} ${f(y + 0.7)}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
    }).join('')
    const wall = `M${cx - 35} ${cy}V${cy + 7}A35 ${f(35 * q)} 0 0 0 ${cx + 35} ${cy + 7}V${cy}A35 ${f(35 * q)} 0 0 1 ${cx - 35} ${cy}Z`
    const cone = E(17.2)
    const spindle = 'M58.4 57.4L59.2 46.4H60.8L61.6 57.4Z'
    const arms = 'M51.2 52.2L68.8 47.8M53.4 47.4L66.6 52.6'
    const ballA = 1.25, bx = f(cx + 20.9 * Math.cos(ballA)), by = f(cy + 20.9 * q * Math.sin(ballA))
    return (
      k.night() +
      [[30, 34], [90, 30], [26, 76], [94, 78], [40, 22], [80, 22], [34, 92]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 54, 40, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.35, 0), P.goldL, 0.3) +
      k.floor(61, 82, 38, 5, '#000') +
      `<g transform="translate(60 58) scale(.94) translate(-60 -58)">` +
      k.draw([
        { d: wall, fill: P.brown, inner: k.sh(wall, 0, 0, 1, 0, 0, 0.95, P.brownD, 0.45) + `<path d="M24 60H42V70H24Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.4, 0)}"/>` + hair(27, 61.6, 60, 92.4, 93, 61.6, 0.45, P.brownD) + hair(30, 63.4, 60, 93.6, 90, 63.4, 0.35, P.brownD) + hair(26, 59.6, 60, 90.6, 94, 59.6, 0.3, P.goldL) + `<path d="M${cx - 35} ${cy + 4}A35 ${f(35 * q)} 0 0 0 ${cx + 35} ${cy + 4}" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>` },
        { d: E(35), fill: P.brown, inner: `<path d="${E(32.4)}" fill="${P.brownD}"/>` + k.sh(E(35), 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) },
      ], 0.8) +
      `<path d="${E(31.6)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".6"/>` + k.shade(E(31.6), k.lin(P.blue, 0, 0, 1, 1, 0.2, 0.8), P.blue, 0.35) +
      deflect +
      numbers + pockets +
      `<path d="${E(27)}" fill="none" stroke="${P.ink}" stroke-width=".55"/><path d="${E(17.2)}" fill="none" stroke="${P.ink}" stroke-width=".55"/>` +
      k.shade(`${E(27)} ${E(17.2)}`, k.lin(P.night, 0, 0, 1, 1, 0, 0.45), P.night, 0.2) +
      k.draw([{ d: cone, fill: P.gold, inner: k.shade(cone, k.rad(P.goldD, 0.6, 0.65, 0.6, 0.1, 0.95), P.goldD, 0.45) + `<path d="${E(9.4, -0.6)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.5) +
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.4
        return `<path d="M${pt(9.6, a, -0.6)}L${pt(16.4, a)}" stroke="${P.goldD}" stroke-width=".5"/>`
      }).join('') +
      `<path d="${arms}" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="${arms}" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
      [[51.2, 52.2], [68.8, 47.8], [53.4, 47.4], [66.6, 52.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>`).join('') +
      k.draw([{ d: spindle, fill: P.gold, inner: k.sh(spindle, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) }], 0.45) +
      `<circle cx="60" cy="45.4" r="2.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".55"/><circle cx="59.3" cy="44.7" r=".7" fill="#fff"/>` +
      `<ellipse cx="${bx}" cy="${f(+by + 1)}" rx="2" ry=".7" fill="${P.night}" opacity=".5"/><circle cx="${bx}" cy="${by}" r="1.8" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(+bx - 0.6)}" cy="${f(+by - 0.6)}" r=".5" fill="#fff"/>` +
      `</g>` +
      k.draw([{ d: roundRect(48.6, 75.2, 71.4, 80.2, 1.2), fill: P.gold, inner: k.sh(roundRect(48.6, 75.2, 71.4, 80.2, 1.2), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.4) +
      `<circle cx="50" cy="77.7" r=".45" fill="${P.goldD}"/><circle cx="70" cy="77.7" r=".45" fill="${P.goldD}"/>` +
      `<text x="60" y="78.9" ${GEORGIA} font-style="italic" font-size="3.4" fill="${P.ink}" text-anchor="middle">Mar del Plata</text>` +
      chip(k, 82, 80.4, 6.4, P.red) + chip(k, 82, 78.2, 6.4, P.night) + chip(k, 82, 76, 6.4, P.red) + chip(k, 82, 73.8, 6.4, P.gold) +
      chip(k, 37, 81.6, 6, P.gold) + chip(k, 37, 79.4, 6, P.red) +
      sparkle(88, 40, 2.2, P.goldL) + sparkle(30, 50, 1.6, P.goldL) + sparkle(74, 32, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Diez faltas envido: te jugaste hasta la casa, y la seguís teniendo. El chalet con su gallo veleta, apostado arriba
  // de las fichas, en el paño.
  'Hipoteca al paño': (u) => {
    const k = kit(u)
    const rail = ellipse(60, 87, 28, 6.8)
    const felt = ellipse(60, 86.4, 25.4, 5.2)
    const walls = 'M44 55.6H76V76H44Z'
    const roofFace = 'M38.8 58.4L60 37L81.2 58.4Z'
    const fascia = 'M36.4 59.4L60 35.4L83.6 59.4L81.8 60.8L60 38.8L38.2 60.8Z'
    const chimney = 'M68.4 46V36.4H73.8V51.4Z'
    const door = 'M55.8 76V67.4C55.8 63.4 64.2 63.4 64.2 67.4V76Z'
    const rooster = 'M-4.6 -5.6C-4.8 -7 -3.8 -8 -2.6 -7.8C-1.6 -7.6 -1.2 -6.6 -1.4 -5.6C-1 -4.2 .2 -3.6 1.6 -3.8C2.4 -5.6 2.8 -8 4.6 -9.4C4 -7.6 4.2 -6.4 4.6 -5.6C5 -7 5.8 -8 7 -8.4C6 -6.8 6 -5.2 6.2 -4C6.6 -4.8 7.2 -5.2 7.8 -5.2C7.2 -3.4 6.2 -1.4 3.8 -.6C2.2 0 .2 0 -1.2 -.6C-2.8 -1.4 -3.6 -3 -3.6 -4.6Z'
    const win = (x: number) =>
      `<rect x="${x}" y="60.4" width="7.4" height="7.6" fill="${P.sky}" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M${x} 60.4L${f(x + 7.4)} 68V60.4Z" fill="${P.sky1}" opacity=".55"/>` +
      `<path d="M${f(x + 0.4)} 60.8Q${f(x + 1.6)} 64 ${f(x + 0.6)} 67.6L${f(x + 2.4)} 67.6Q${f(x + 3)} 64 ${f(x + 2)} 60.8Z" fill="${P.white}" opacity=".9"/>` +
      `<path d="M${f(x + 3.7)} 60.4V68M${x} 64.2H${f(x + 7.4)}" stroke="${P.white}" stroke-width=".6"/>` +
      `<rect x="${f(x - 2.4)}" y="60" width="2.2" height="8.4" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/><rect x="${f(x + 7.6)}" y="60" width="2.2" height="8.4" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M${f(x - 2)} 62.6H${f(x - 0.6)}M${f(x - 2)} 65.4H${f(x - 0.6)}M${f(x + 8)} 62.6H${f(x + 9.4)}M${f(x + 8)} 65.4H${f(x + 9.4)}" stroke="${P.greenD}" stroke-width=".35"/>` +
      `<path d="M${f(x - 0.8)} 68.4H${f(x + 8.2)}L${f(x + 7.6)} 70.4H${f(x - 0.2)}Z" fill="${P.brown}" stroke="${P.ink}" stroke-width=".4"/>` +
      [1, 2.6, 4.2, 5.8].map((dx, i) => `<circle cx="${f(x + dx + 0.3)}" cy="${f(67.8 - (i % 2) * 0.5)}" r=".75" fill="${i % 2 ? P.gold : P.red}" stroke="${P.ink}" stroke-width=".2"/>`).join('')
    const tiles = Array.from({ length: 5 }, (_, r) => {
      const y = 41.4 + r * 3.5, half = ((y - 37) / 21.4) * 21.2
      return `<path d="M${f(60 - half)} ${f(y)}H${f(60 + half)}" stroke="${P.wine}" stroke-width=".5"/>` +
        Array.from({ length: Math.max(1, Math.round((half * 2) / 3.2)) }, (_, i) => {
          const x = 60 - half + 1.6 + i * 3.2
          return `<path d="M${f(x - 1.6)} ${f(y)}Q${f(x)} ${f(y + 2.4)} ${f(x + 1.6)} ${f(y)}" fill="none" stroke="${P.wine}" stroke-width=".35"/>`
        }).join('')
    }).join('')
    const bricks = [[44.6, 72.6], [48.4, 72.6], [46.4, 70.4], [71, 57.6], [73.2, 59.8]].map(([x, y]) => `<rect x="${x}" y="${y}" width="3.2" height="1.8" fill="none" stroke="${P.sky2}" stroke-width=".4"/>`).join('')
    return (
      k.day() +
      k.sun(60, 52, 18, 46, 28, false) +
      k.shade(ellipse(60, 56, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.35) +
      k.draw([{ d: rail, fill: P.brown, inner: k.sh(rail, 0, 0, 1, 1, 0, 0.85, P.brownD, 0.45) + `<path d="${ellipse(60, 87.6, 26.8, 5.8)}" fill="none" stroke="${P.goldL}" stroke-width=".4" opacity=".6"/>` }], 0.7) +
      `<path d="${felt}" fill="${P.green}"/>` + k.shade(felt, k.rad(P.greenD, 0.5, 0.35, 0.65, 0, 0.95), P.greenD, 0.45) +
      `<path d="${ellipse(60, 86.4, 22.4, 4.2)}" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` +
      chip(k, 41.4, 86.6, 4.4, P.red, 1.8) + chip(k, 41.4, 84.8, 4.4, P.gold, 1.8) + chip(k, 79.2, 87, 4.4, P.night, 1.8) +
      k.floor(61, 88.4, 16, 2.4, P.greenD) +
      chip(k, 60, 82.2, 14, P.red, 2.8) + chip(k, 60, 79.4, 14.6, P.white, 2.8) + chip(k, 60, 76.6, 15, P.gold, 2.8) +
      k.floor(61, 76.8, 15, 1.6, P.goldD) +
      k.draw([
        { d: chimney, fill: P.red, inner: k.sh(chimney, 0, 0, 1, 0, 0, 0.9, P.wine, 0.4) + `<path d="M68 39H74.2M68 42.4H74.2M68 45.8H74.2M71 36.4V39M70 39V42.4M72.4 42.4V45.8" stroke="${P.wine}" stroke-width=".4"/>` },
        { d: 'M67.4 36.6H74.8V34.4H67.4Z', fill: P.brownD },
        {
          d: walls, fill: P.white, line: 0.35,
          inner: k.sh('M67 52H80V78H67Z', 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + k.sh('M40 54H80V61H40Z', 0, 0, 0, 1, 0.85, 0, P.blue, 0.4) + bricks +
            k.sh('M40 72H80V78H40Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3),
        },
        { d: fascia, fill: P.white, inner: k.sh(fascia, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) },
      ], 0.75) +
      `<path d="${roofFace}" fill="${P.red}"/>` + k.clip(roofFace, tiles + k.sh(roofFace, 0, 0, 1, 1, 0, 0.75, P.wine, 0.45) + `<path d="M38 58L60 37L60 42Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0)}"/>`) +
      `<path d="${roofFace}" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M60 35V30.6" stroke="${P.ink}" stroke-width=".9"/><path d="M55.4 32.4H64.4M55.4 32.4L56.8 31.4M55.4 32.4L56.8 33.4M64.4 32.4L65.4 31.2M64.4 32.4L65.4 33.6" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
      `<g transform="translate(59.6 30.8)"><path d="M-.6 -.6L-.2 .2M1 -.6L1.2 .2" stroke="${P.ink}" stroke-width=".5"/>` + k.draw([{ d: rooster, fill: P.gold, inner: k.sh(rooster, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.35) + `<path d="M-4.4 -7.6L-4.2 -8.8L-3.4 -8.2L-2.8 -9.2L-2.2 -7.8Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".25" stroke-linejoin="round"/>` + `<path d="M-4.6 -6.4L-5.8 -6L-4.6 -5.4Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".25"/><path d="M-4 -5.2Q-4.4 -4 -3.4 -4.2Z" fill="${P.red}"/><circle cx="-3" cy="-6.6" r=".35" fill="${P.ink}"/>` + hair(-.6, -3.2, 1.6, -2, 3.6, -3, 0.35, P.goldD) + `</g>` +
      `<circle cx="60" cy="49.6" r="3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><path d="M60 46.6V52.6M57 49.6H63" stroke="${P.ink}" stroke-width=".35"/><circle cx="60" cy="49.6" r="3.9" fill="none" stroke="${P.white}" stroke-width=".7"/>` +
      win(46.6) + win(66) +
      k.draw([{ d: door, fill: P.brown, inner: k.sh(door, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) + `<path d="M58.6 67V76M61.4 67V76M56.6 71.4H63.4" stroke="${P.brownD}" stroke-width=".4"/><path d="M56.8 66.8C57.4 64.6 62.6 64.6 63.2 66.8Z" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".35"/>` }], 0.45) +
      `<circle cx="62.6" cy="71.6" r=".6" fill="${P.gold}"/><path d="M54.6 76H65.4" stroke="${P.ink}" stroke-width=".8"/>` +
      sparkle(87, 42, 2.4) + sparkle(33, 46, 1.8) +
      k.defs()
    )
  },

  // ── Truquero ───────────────────────────────────────────────────────

  // Cinco partidos: el primer fósforo encendido, parado en el medio del cuadrado de cinco con que se anota.
  'Fósforo encendido': (u) => {
    const k = kit(u)
    const stick = 'M56.4 53H63.6V92.6H56.4Z'
    const head = 'M54.6 51.6C54 44.6 56.4 40.4 60 40.4C63.6 40.4 66 44.6 65.4 51.6C63.4 53.6 56.6 53.6 54.6 51.6Z'
    return (
      k.day() +
      k.sun(60, 46, 14, 44, 28, false) +
      k.shade(ellipse(60, 40, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.5) +
      k.floor(60.6, 92.4, 23, 3.4) +
      palito(k, 61, 83.2, 79.6, 88.6) + palito(k, 40.6, 88.8, 59.4, 83.4) +
      flame(k, 'translate(60.4 53) scale(.44 .42) translate(-60 -90)') +
      k.cast([stick], 2, 1.4) +
      k.draw([
        {
          d: stick, fill: P.goldL,
          inner: `<path d="M60.6 50H64V95H60.6Z" fill="${P.gold}"/>` + k.sh('M58 50H66V95H58Z', 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) +
            k.sh('M55 52H65V62H55Z', 0, 0, 0, 1, 0.95, 0, P.brownD, 0.5) +
            hair(57.8, 64, 58.2, 76, 57.6, 90, 0.4, P.brown) + hair(62, 60, 61.6, 70, 62.2, 82, 0.35, P.brown) + `<path d="M56.6 53V92.6" stroke="#fff" stroke-width=".7" opacity=".7"/>`,
        },
        { d: head, fill: P.red, inner: k.sh(head, 0, 0, 1, 1, 0, 0.95, P.wine, 0.45) + `<ellipse cx="57.6" cy="44.6" rx="1.4" ry="2.2" fill="#fff" opacity=".55" transform="rotate(14 57.6 44.6)"/>` + k.sh(head, 0, 0, 0, 1, 0.6, 0, P.goldD, 0.3) },
      ], 0.75) +
      palito(k, 79.6, 90.6, 61, 95.4) + palito(k, 40.6, 90.8, 59.4, 95.6) +
      [[46, 36, 0.7], [76, 30, 0.6], [72, 42, 0.5], [49, 26, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldD}"/>`).join('') +
      sparkle(86, 50, 2.2) + sparkle(33, 58, 1.6) +
      k.defs()
    )
  },

  // Veinte partidos: una caja entera de fósforos anotando a tu favor, la de los tres patitos, ante el sol de Mayo.
  'Tres Patitos': (u) => {
    const k = kit(u)
    const front = 'M30 55H68V84H30Z'
    const strike = 'M30 55L38 47.6H76L68 55Z'
    const tray = 'M68 56H82.4V84H68Z'
    const trayEnd = 'M82.4 56L90.4 48.6V76.6L82.4 84Z'
    const trayTop = 'M68 56H82.4L90.4 48.6H76Z'
    const matches = Array.from({ length: 7 }, (_, j) => {
      const jj = 6 - j, dx = f(jj * 1.14), dy = f(-jj * 1.06), y = f(55.4 + dy)
      return `<path d="M${f(66 + dx)} ${y}H${f(80.4 + dx)}" stroke="${P.goldD}" stroke-width="1.5"/><path d="M${f(66 + dx)} ${f(y - 0.3)}H${f(80.4 + dx)}" stroke="${P.goldL}" stroke-width=".6"/>` +
        `<ellipse cx="${f(81.8 + dx)}" cy="${y}" rx="2.1" ry="1.3" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="${f(81.2 + dx)}" cy="${f(y - 0.45)}" rx=".75" ry=".35" fill="#fff" opacity=".65"/>`
    }).join('')
    const grain = Array.from({ length: 46 }, (_, i) => `<circle cx="${f(31 + ((i * 37) % 46) + ((i * 11) % 7) * 0.5)}" cy="${f(48.2 + ((i * 23) % 64) / 10)}" r=".38" fill="${P.goldD}" opacity=".75"/>`).join('')
    const duck = (x: number, y: number, s: number) => {
      const bod = 'M-5.4 -3.6C-5.4 -6.4 -2.6 -7.4 .4 -7C2.6 -6.8 4.6 -5.8 5.2 -3.8C5.6 -1.6 3.6 0 .4 0C-2.6 0 -4.6 -.6 -5.4 -2.2L-7.6 -5.6Z'
      const hd = ellipse(3.6, -9.6, 2.9, 2.8)
      return `<g transform="translate(${x} ${y}) scale(${s})">` +
        k.draw([
          { d: bod, fill: P.gold, inner: k.sh(bod, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) + hair(-3, -4.6, 0, -2.6, 3, -3.6, 0.55, P.goldD) + `<path d="M-6 -5H-1V0H-6Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` },
          { d: hd, fill: P.gold, inner: k.sh(hd, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) },
        ], 0.4 / s) +
        `<path d="M6.2 -10.2L9 -9.4L6.2 -8.4Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3" stroke-linejoin="round"/>` +
        `<circle cx="4.4" cy="-10.4" r=".6" fill="${P.ink}"/><circle cx="4.6" cy="-10.6" r=".2" fill="#fff"/>` +
        `</g>`
    }
    return (
      k.day() +
      k.sun(58, 52, 16, 44) +
      k.cast([front, strike, trayEnd, tray], 2.4, 2) +
      k.floor(61, 86, 31, 2.6) +
      k.draw([{ d: strike, fill: P.brownD, inner: grain + k.sh(strike, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) + `<path d="M31 54.4L38.6 48.2" stroke="${P.goldL}" stroke-width=".4" opacity=".6"/>` }], 0.7) +
      k.draw([
        { d: trayTop, fill: P.goldD, inner: matches },
        { d: trayEnd, fill: P.sky1, inner: k.sh(trayEnd, 0, 0, 1, 0, 0.35, 0.95, P.blue, 0.5) },
        { d: tray, fill: P.sky1, inner: k.sh(tray, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + `<path d="M68 57.4H82.4" stroke="${P.white}" stroke-width=".6"/>` },
      ], 0.7) +
      `<path d="M68 56H82.4L90.4 48.6" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{
        d: front, fill: P.mid,
        inner:
          `<path d="M32.4 57.4H65.6V81.6H32.4Z" fill="${P.paper}"/>` + `<path d="M33.6 58.6H64.4V80.4H33.6Z" fill="none" stroke="${P.red}" stroke-width=".55"/>` +
          `<path d="M32.4 75.4Q36.4 73.6 40.4 75.4T48.4 75.4T56.4 75.4T64.4 75.4L65.6 75V81.6H32.4Z" fill="${P.sky}"/>` +
          `<path d="M32.4 75.4Q36.4 73.6 40.4 75.4T48.4 75.4T56.4 75.4T64.4 75.4" fill="none" stroke="${P.blue}" stroke-width=".5"/>` +
          k.sh('M58 52H70V86H58Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + k.sh('M28 52H70V86H28Z', 0, 0, 1, 1, 0, 0.5, P.night, 0.3) +
          `<path d="M30.8 55.6V83.4" stroke="${P.sky}" stroke-width=".6" opacity=".7"/>`,
      }], 0.75) +
      `<text x="49" y="64" ${GEORGIA} font-style="italic" font-size="4.4" fill="${P.ink}" text-anchor="middle">fósforos</text>` +
      duck(39.2, 75.4, 0.86) + duck(49.4, 75.4, 0.86) + duck(59.6, 75.4, 0.86) +
      hair(36.2, 77.6, 39.2, 78.2, 42.2, 77.6, 0.45, P.white) + hair(52, 78.6, 55, 79.2, 58, 78.6, 0.45, P.white) +
      palito(k, 42, 91.2, 64, 88.4) +
      sparkle(87, 36, 2.4) + sparkle(30, 40, 1.8) +
      k.defs()
    )
  },

  // Sesenta partidos: un fogón de estancia hecho con fósforos gigantes, bajo la Cruz del Sur.
  'Fogón de estancia': (u) => {
    const k = kit(u)
    const S = (x: number, z: number, h: number) => `${f(55 + x + z * 0.5)} ${f(88 - h - z * 0.36)}`
    const t = 4
    const wood = (d: string, c: string, sh = 0.7) => ({ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0, sh, P.brownD, 0.35) })
    const headAt = (x: number, z: number, h: number, r: number) => {
      const [hx, hy] = S(x, z, h).split(' ').map(Number), d = ellipse(hx, hy, r, r * 0.92)
      return { d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.wine, 0.45) + `<ellipse cx="${f(hx - r * 0.35)}" cy="${f(hy - r * 0.4)}" rx="${f(r * 0.35)}" ry="${f(r * 0.22)}" fill="#fff" opacity=".6"/>` }
    }
    // Palito a lo largo de x (en la profundidad z), con la cabeza a la derecha (dir 1) o a la izquierda (-1).
    const alongX = (z: number, h: number, dir: number) => {
      const a = -17, b = 17, z0 = z - t / 2, z1 = z + t / 2
      const fr = `M${S(a, z0, h)}L${S(b, z0, h)}L${S(b, z0, h + t)}L${S(a, z0, h + t)}Z`
      const tp = `M${S(a, z0, h + t)}L${S(b, z0, h + t)}L${S(b, z1, h + t)}L${S(a, z1, h + t)}Z`
      const en = `M${S(b, z0, h)}L${S(b, z1, h)}L${S(b, z1, h + t)}L${S(b, z0, h + t)}Z`
      const [gx0, gy0] = S(a + 3, z0, h + 1.4).split(' ').map(Number), [gx1, gy1] = S(b - 4, z0, h + 1.8).split(' ').map(Number)
      const [hx0, hy0] = S(a + 8, z0, h + 2.8).split(' ').map(Number), [hx1, hy1] = S(b - 9, z0, h + 2.6).split(' ').map(Number)
      const front = { ...wood(fr, P.goldL), inner: wood(fr, P.goldL).inner + hair(gx0, gy0, (gx0 + gx1) / 2, gy0 - 0.6, gx1, gy1, 0.45, P.brown) + hair(hx0, hy0, (hx0 + hx1) / 2, hy0 + 0.5, hx1, hy1, 0.35, P.brown) + `<path d="M${S(a, z0, h + t - 0.5)}L${S(b, z0, h + t - 0.5)}" stroke="#fff" stroke-width=".5" opacity=".7"/>` }
      return k.draw([wood(en, P.gold, 0.9), wood(tp, P.white, 0.4), front, headAt(dir * 18.2, z, h + t / 2, 3)], 0.55)
    }
    // Palito a lo largo de z (de adelante para atrás), en x, con la cabeza adelante.
    const alongZ = (x: number, h: number) => {
      const a = -3, b = 23, x0 = x - t / 2, x1 = x + t / 2
      const fr = `M${S(x0, a, h)}L${S(x1, a, h)}L${S(x1, a, h + t)}L${S(x0, a, h + t)}Z`
      const tp = `M${S(x0, a, h + t)}L${S(x1, a, h + t)}L${S(x1, b, h + t)}L${S(x0, b, h + t)}Z`
      const sd = `M${S(x1, a, h)}L${S(x1, b, h)}L${S(x1, b, h + t)}L${S(x1, a, h + t)}Z`
      const [gx0, gy0] = S(x - 0.4, a + 2, h + t).split(' ').map(Number), [gx1, gy1] = S(x - 0.4, b - 2, h + t).split(' ').map(Number)
      const top = { ...wood(tp, P.white, 0.4), inner: wood(tp, P.white, 0.4).inner + hair(gx0, gy0, (gx0 + gx1) / 2 + 0.4, (gy0 + gy1) / 2, gx1, gy1, 0.4, P.goldD) }
      const side = { ...wood(sd, P.gold, 0.9), inner: wood(sd, P.gold, 0.9).inner + `<path d="M${S(x1, a + 1, h + 1.6)}L${S(x1, b - 1, h + 1.6)}" stroke="${P.goldD}" stroke-width=".4"/>` }
      return k.draw([side, top, wood(fr, P.goldL), headAt(x, a - 1.2, h + t / 2, 3)], 0.55)
    }
    const inside = `M${S(-17, 0, 0)}L${S(17, 0, 0)}L${S(17, 22, 0)}L${S(17, 22, 16)}L${S(-17, 22, 16)}L${S(-17, 0, 16)}Z`
    const stars = [[30, 50, 0.55], [92, 44, 0.5], [50, 24, 0.5], [88, 30, 0.6], [74, 26, 0.45], [27, 62, 0.45], [93, 60, 0.5], [68, 20, 0.4]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
    const cruz = sparkle(38, 28.6, 2, P.paper) + sparkle(37, 41.6, 2.4, P.paper) + sparkle(31.4, 35.6, 1.6, P.paper) + sparkle(43.4, 34, 1.8, P.paper) + `<circle cx="40.6" cy="37.6" r=".6" fill="${P.paper}"/>`
    const sil = '#0E1533'
    const molino =
      `<path d="M85 76L88 50L91 76M85.8 69H90.2M86.6 62H89.4M85.8 69L89.4 62M90.2 69L86.6 62" fill="none" stroke="${sil}" stroke-width=".9" stroke-linejoin="round"/>` +
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return `<path d="M88 49L${f(88 + Math.cos(a) * 6.6)} ${f(49 + Math.sin(a) * 6.6)}" stroke="${sil}" stroke-width="1.1"/>`
      }).join('') +
      `<circle cx="88" cy="49" r="6.6" fill="none" stroke="${sil}" stroke-width=".6"/><path d="M88 49H95.6V46.4Z" fill="${sil}"/>`
    return (
      k.night() +
      stars + cruz +
      `<path d="M0 76Q30 72.6 60 75T120 74V130H0Z" fill="${sil}"/>` + molino +
      `<path d="M0 76Q30 72.6 60 75T120 74" fill="none" stroke="${P.mid}" stroke-width=".5"/>` +
      k.shade(ellipse(60, 80, 40, 14), k.rad(P.goldD, 0.5, 0.5, 0.5, 0.75, 0), P.goldD, 0.4) +
      k.shade(ellipse(60, 52, 34, 34), k.rad(P.gold, 0.5, 0.5, 0.5, 0.45, 0), P.gold, 0.3) +
      `<path d="${inside}" fill="${P.goldD}"/>` + k.shade(inside, k.rad(P.red, 0.5, 0.4, 0.6, 0, 0.9), P.red, 0.4) +
      alongX(20, 0, -1) + alongX(2, 0, 1) +
      alongZ(-13, t) + alongZ(13, t) +
      alongX(20, 2 * t, 1) + alongX(2, 2 * t, -1) +
      flame(k, 'translate(60.4 74) scale(.62 .72) translate(-60 -90)') +
      hair(52, 62, 49, 52, 53, 42, 0.7, P.goldL, 0.8) + hair(68, 60, 72, 50, 67.6, 40, 0.6, P.goldL, 0.8) + hair(60.4, 64, 58.6, 54, 61, 46, 0.8, P.white, 0.7) +
      alongZ(-13, 3 * t) + alongZ(13, 3 * t) +
      [[47, 90.4, 2.2], [53.4, 91.4, 1.6], [70.4, 90.8, 2], [76, 89.6, 1.4], [62, 92, 1.3]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.6)}" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="${f(x - r * 0.2)}" cy="${f(y - r * 0.15)}" rx="${f(r * 0.55)}" ry="${f(r * 0.3)}" fill="${P.gold}"/>`).join('') +
      [[46, 30, 0.8], [76, 24, 0.7], [80, 40, 0.6], [42, 44, 0.6], [68, 18.6, 0.5], [54, 20, 0.5], [86, 30, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}"/>`).join('') +
      hair(44, 50, 41, 44, 43, 38, 0.6, P.goldL) + hair(78, 46, 81, 40, 79, 34, 0.6, P.goldL) +
      k.defs()
    )
  },
}
