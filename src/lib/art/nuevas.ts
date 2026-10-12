// Ilustraciones redibujadas con el kit nuevo: sin contornos, con luz y volumen suaves (ver kit.ts).
import { f } from './helpers'
import { ellipse, kit, starPath, taper, type Kit } from './kit'

/** Destello de cuatro puntas. */
const sparkle = (x: number, y: number, r: number, a = 0.9) => `<path d="${starPath(x, y, r, r * 0.22, 4)}" fill="#fff" opacity="${a}"/>`

/** Dado en perspectiva con la arista del frente arriba en (x,y) y lado s. */
function die(x: number, y: number, s: number, rot: number) {
  const k = s * 0.87, h = s / 2
  const face = (o: [number, number], a: [number, number], b: [number, number], pips: [number, number][]) =>
    `<g transform="matrix(${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(o[0])} ${f(o[1])})">${pips.map(([p, q]) => `<circle cx="${p}" cy="${q}" r=".095" fill="#1E2433"/>`).join('')}</g>`
  return (
    `<g transform="rotate(${rot} ${x} ${y})">` +
    `<path d="M${x} ${f(y - s)}L${f(x + k)} ${f(y - h)}L${x} ${y}L${f(x - k)} ${f(y - h)}Z" fill="#FFFFFF"/>` +
    `<path d="M${f(x - k)} ${f(y - h)}L${x} ${y}L${x} ${f(y + s)}L${f(x - k)} ${f(y + h)}Z" fill="#E3E9F1"/>` +
    `<path d="M${x} ${y}L${f(x + k)} ${f(y - h)}L${f(x + k)} ${f(y + h)}L${x} ${f(y + s)}Z" fill="#BCC7D6"/>` +
    face([x - k, y - h], [k, -h], [k, h], [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]]) +
    face([x - k, y - h], [k, h], [0, s], [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]]) +
    face([x, y], [k, -h], [0, s], [[0.3, 0.3], [0.7, 0.7]]) +
    `</g>`
  )
}

/** Aro dorado (aureolas) con su brillo. */
const halo = (k: Kit, cx: number, cy: number, rx: number, ry: number, t: number) =>
  k.glow(cx, cy, rx * 1.5, '#FFE08A', 0.5) +
  `<path d="${ellipse(cx, cy, rx, ry)} ${ellipse(cx, cy + t * 0.18, rx - t, ry - t * 0.55)}" fill-rule="evenodd" fill="${k.lin([[0, '#FFF4C8'], [0.45, '#F4C24E'], [1, '#B47A16']])}"/>` +
  `<ellipse cx="${f(cx - rx * 0.45)}" cy="${f(cy - ry * 0.72)}" rx="${f(rx * 0.26)}" ry=".55" fill="#fff" opacity=".85"/>`

export const NUEVAS_ART: Record<string, (u: number) => string> = {
  // Diez seguidas: la camiseta con el 10 y su aureola, en un altar de luz. El Diego, sin mostrarlo.
  'D10S': (u) => {
    const k = kit(u)
    const shirt =
      'M53 40.2L44.2 43.2C40 46.4 36 49.6 33.2 52.2C32.6 52.8 32.6 53.6 33 54.2L38.2 60.8C38.6 61.4 39.4 61.4 40 61L44.2 58V88.6' +
      'C54 91.4 66 91.4 75.8 88.6V58L80 61C80.6 61.4 81.4 61.4 81.8 60.8L87 54.2C87.4 53.6 87.4 52.8 86.8 52.2C84 49.6 80 46.4 75.8 43.2L67 40.2Q60 47.8 53 40.2Z'
    const ink = '#1B2650'
    const ten =
      'M50.4 62.6L55 59.6H57.8V78.4H53.6V64.8L50.4 66.4Z' +
      'M64.6 59.6C67.8 59.6 69.8 62 69.8 65.2V72.8C69.8 76 67.8 78.4 64.6 78.4C61.4 78.4 59.4 76 59.4 72.8V65.2C59.4 62 61.4 59.6 64.6 59.6Z' +
      'M64.6 63C63.5 63 62.9 63.8 62.9 65V73C62.9 74.2 63.5 75 64.6 75C65.7 75 66.3 74.2 66.3 73V65C66.3 63.8 65.7 63 64.6 63Z'
    return (
      `<rect width="120" height="130" fill="${k.rad([[0, '#3A6CC4'], [0.55, '#1D3474'], [1, '#0C1433']], 0.5, 0.46, 0.62)}"/>` +
      k.glow(60, 64, 42, '#BFE0FF', 0.42) +
      k.shadow(61, 93, 22, 3.2, 0.35) +
      `<path d="${shirt}" fill="#F6F4EF"/>` +
      k.clip(
        shirt,
        `<path d="M55.4 30H64.6V100H55.4ZM42 30H47.6V100H42ZM72.4 30H78V100H72.4Z" fill="#78B0DE"/>` +
          `<rect x="30" y="30" width="60" height="70" fill="${k.lin([[0, '#fff', 0.3], [0.45, '#fff', 0], [0.6, ink, 0], [1, ink, 0.3]], 0, 0, 1, 0)}"/>` +
          `<path d="M44.2 57.6C46.6 60.4 47.6 65 47 71C45.6 66.6 44.8 62.2 44.2 57.6Z" fill="${ink}" opacity=".2"/>` +
          `<path d="M75.8 57.6C73.4 60.4 72.4 65 73 71C74.4 66.6 75.2 62.2 75.8 57.6Z" fill="${ink}" opacity=".22"/>` +
          `<path d="M50 60C52 70 51.4 80 50.6 91H53.4C54 80 53.6 70 51.8 60Z" fill="${ink}" opacity=".07"/>` +
          `<path d="M40 85.6C54 88.8 66 88.8 80 85.6V96H40Z" fill="${ink}" opacity=".14"/>` +
          `<path d="M53 40.2Q60 50.6 67 40.2Q60 46.6 53 40.2Z" fill="${ink}" opacity=".18"/>`,
      ) +
      `<path d="M53 40.2Q60 47.8 67 40.2L64.9 39.4Q60 44.6 55.1 39.4Z" fill="#22306A"/>` +
      `<path d="M55.1 39.4Q60 44.6 64.9 39.4Q60 41.6 55.1 39.4Z" fill="#0E1533"/>` +
      `<path d="${ten}" fill-rule="evenodd" fill="${ink}" opacity=".22" transform="translate(.7 .9)"/>` +
      `<path d="${ten}" fill-rule="evenodd" fill="#22306A"/>` +
      halo(k, 60, 31, 14, 4.6, 3.6) +
      sparkle(80, 27, 2.6) + sparkle(38, 36, 1.8, 0.7) +
      k.grain() + k.defs()
    )
  },

  // Veinte seguidas: "¿de qué planeta viniste?". Un barrilete celeste y blanco entre las estrellas.
  'Barrilete cósmico': (u) => {
    const k = kit(u)
    const stars = [[28, 46, 0.7], [41, 27, 0.5], [84, 24, 0.6], [94, 50, 0.5], [73, 92, 0.6], [26, 82, 0.5], [90, 72, 0.8], [47, 64, 0.4], [79, 60, 0.4]]
      .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${i % 2 ? 0.55 : 0.9}"/>`).join('')
    const ringOut = ellipse(33, 67, 13.6, 3.3), ringIn = ellipse(33, 67.2, 10, 1.9)
    const ring = (half: 'back' | 'front') =>
      `<g transform="rotate(-16 33 67)">` +
      k.clip(half === 'back' ? 'M10 50H56V67H10Z' : 'M10 67H56V84H10Z', `<path d="${ringOut} ${ringIn}" fill-rule="evenodd" fill="${k.lin([[0, '#FFE7A8'], [0.5, '#E8A84C'], [1, '#8A5A2B']], 0, 0, 1, 0)}"/>`) +
      `</g>`
    const planet = ellipse(33, 67, 7.6, 7.6)
    const bow = (x: number, y: number, r: number) =>
      `<path d="M0 0C-2 -2.8 -4.8 -2.6 -4.8 0C-4.8 2.6 -2 2.8 0 0C2 -2.8 4.8 -2.6 4.8 0C4.8 2.6 2 2.8 0 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${k.lin([[0, '#FFE9A6'], [1, '#E39A2D']])}"/>`
    return (
      `<rect width="120" height="130" fill="${k.rad([[0, '#4A35A8'], [0.5, '#22175E'], [1, '#0B0822']], 0.38, 0.3, 0.8)}"/>` +
      k.glow(86, 82, 36, '#FF5FA8', 0.3) + k.glow(30, 32, 30, '#45C8FF', 0.24) +
      stars + sparkle(88, 36, 3.2) + sparkle(30, 88, 2.2, 0.7) +
      ring('back') +
      `<path d="${planet}" fill="${k.rad([[0, '#FFC2DC'], [0.5, '#C05BA8'], [1, '#4B1F6E']], 0.35, 0.3, 0.8)}"/>` +
      k.clip(planet, `<path d="${ellipse(36.4, 70, 8.4, 8.4)} ${ellipse(31.4, 64.6, 8.6, 8.6)}" fill-rule="evenodd" fill="#1A0B33" opacity=".35"/>`) +
      ring('front') +
      k.glow(60, 48, 32, '#9FD8FF', 0.32) +
      `<path d="${taper(60, 83, 46, 93, 62, 100, 1.9, 0.8)}" fill="#EEF3FA" opacity=".9"/>` +
      bow(54.4, 91, -24) + bow(57.8, 97, 18) +
      k.shadow(62, 56, 22, 26, 0.25, '#05030F') +
      `<path d="M60 20L40 43H60Z" fill="#86BDE8"/><path d="M60 20L80 43H60Z" fill="#F7F8FB"/>` +
      `<path d="M40 43L60 83V43Z" fill="#FFFFFF"/><path d="M80 43L60 83V43Z" fill="#74ACDF"/>` +
      `<path d="M60 20L40 43L60 83L80 43Z" fill="${k.lin([[0, '#fff', 0.18], [0.6, '#fff', 0], [1, '#0B1F44', 0.16]], 0, 0, 0.6, 1)}"/>` +
      k.glow(60, 43, 9, '#FFD873', 0.7) +
      `<circle cx="60" cy="43" r="4.4" fill="${k.rad([[0, '#FFF3C4'], [0.6, '#F6C04E'], [1, '#C98A1B']], 0.4, 0.35, 0.7)}"/>` +
      k.grain() + k.defs()
    )
  },

  // Siete generalas servidas: la mano de Dios sale de las nubes, con la manga albiceleste, y larga el dado.
  'Mano de Dios': (u) => {
    const k = kit(u)
    const hand =
      'M-8.4 24L-10.6 8C-13.6 4.6 -16.4 -.6 -18.2 -5C-19.4 -8 -16.4 -10 -14.4 -7.8C-12.6 -5.8 -11.4 -3.6 -10.6 -2.4' +
      'L-11.8 -18.8C-12.2 -22.8 -7 -23.4 -6.8 -19.6L-6 -5.4L-4.8 -5.4L-5.2 -22.2C-5.2 -26.4 .2 -26.4 .2 -22.2L0 -5.6L1.2 -5.6' +
      'L1.2 -20.4C1.6 -24.2 6.6 -23.8 6.2 -20L5 -4.8L6.2 -4.8L7.4 -14.6C8.2 -18 12.4 -17.4 11.8 -14L10.6 2L8.4 24Z'
    const cuff = 'M-11.4 20H11.4L12.6 42H-12.6Z'
    const cloud =
      'M14 122V110C14 104 19 100 25 101C26 95 32 91 38 93C41 87.6 49 86 54 90.4C58 86 67 86 70 91C75 87.6 83 89 85 95C91 93 97 97 96 103C102 103 106 107 106 112V122Z'
    return (
      `<rect width="120" height="130" fill="${k.lin([[0, '#6FB2E6'], [0.6, '#B8DEF6'], [1, '#E8F5FD']])}"/>` +
      k.glow(58, 40, 48, '#FFFFFF', 0.85) +
      `<g transform="translate(58 57) rotate(6) scale(1.02)">` +
      `<path d="${cuff}" fill="#78B0DE"/>` +
      k.clip(cuff, `<path d="M-3.4 18H3.4L3.8 44H-3.8Z" fill="#F6F4EF"/><rect x="-14" y="18" width="28" height="26" fill="${k.lin([[0, '#fff', 0.35], [0.45, '#fff', 0], [1, '#0B1F44', 0.32]], 0, 0, 1, 0)}"/><path d="M-12 18H12V23H-12Z" fill="#0B1F44" opacity=".22"/>`) +
      `<path d="${hand}" fill="${k.lin([[0, '#FFDDC6'], [0.55, '#F3B48F'], [1, '#D68A63']], 0, 0, 1, 0.25)}"/>` +
      k.clip(
        hand,
        `<path d="M-1 3C5 5 9.6 10 9.6 25H14V-2Z" fill="#B8653E" opacity=".28"/>` +
          `<ellipse cx="-11.2" cy="2" rx="1.6" ry="5" fill="#B8653E" opacity=".25"/>` +
          `<ellipse cx="-9.4" cy="-19.4" rx="1.1" ry="2" fill="#fff" opacity=".5"/><ellipse cx="-2.6" cy="-22.6" rx="1.1" ry="2" fill="#fff" opacity=".5"/>` +
          `<ellipse cx="3.6" cy="-20.6" rx="1" ry="1.8" fill="#fff" opacity=".4"/>` +
          `<path d="M-12 -6H12V-3.6H-12Z" fill="#B8653E" opacity=".12"/>`,
      ) +
      `</g>` +
      `<path d="${cloud}" fill="#FFFFFF"/>` +
      k.clip(cloud, `<rect x="10" y="100" width="100" height="22" fill="${k.lin([[0, '#DDEBF6', 0], [1, '#BFD5E8']])}"/>`) +
      halo(k, 58.6, 25, 12.2, 4.2, 3.4) +
      die(81, 38, 8.2, 16) +
      sparkle(88, 60, 2.4) +
      k.grain() + k.defs()
    )
  },
}
