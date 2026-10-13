// Pokémon TCG. Nada de la marca ni de sus criaturas: esferas de captura propias (con remaches, dial y cerradura),
// cartas genéricas de borde amarillo y un dragón naranja cualquiera. El ámbar del juego va en cintas, bordes y rayos.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

/** Ámbar del juego (el `color` de la ficha), con su luz y su sombra. */
const AMB = '#E0A800', AMB_L = '#F6D77A', AMB_D = '#A87A08'
/** Naranja del dragón de la carta cara. */
const DRG = '#E5843A', DRG_D = '#A3492A'

/** Flecha curva a mano alzada sobre un arco de círculo (de `a0` a `a1`, en grados), con la punta al final. */
function arcArrow(cx: number, cy: number, r: number, a0: number, a1: number, w = 1.1, c: string = P.mid) {
  const p = (a: number) => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r]
  const [x0, y0] = p(a0), [x1, y1] = p(a1), [xm, ym] = p((a0 + a1) / 2)
  const qx = 2 * xm - (x0 + x1) / 2, qy = 2 * ym - (y0 + y1) / 2
  const dx = x1 - qx, dy = y1 - qy, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l
  const s = w * 2.6
  return hair(x0, y0, qx, qy, x1, y1, w, c) +
    `<path d="M${f(x1 + ux * s)} ${f(y1 + uy * s)}L${f(x1 - ux * s * 0.6 - uy * s * 0.8)} ${f(y1 - uy * s * 0.6 + ux * s * 0.8)}L${f(x1 - ux * s * 0.6 + uy * s * 0.8)} ${f(y1 - uy * s * 0.6 - ux * s * 0.8)}Z" fill="${c}"/>`
}

/** Esfera de captura de radio 20 centrada en (0,0), vista un poco desde arriba: casco de color arriba, crema abajo,
 * faja de metal con remaches de bronce y un dial al frente. `shell` elige el casco de cada nivel. */
function sphere(k: Kit, shell: 'red' | 'blue' | 'night') {
  const ball = ellipse(0, 0, 20, 20)
  const top = 'M-22 -24H22V-3.2Q0 8.8 -22 -3.2Z'
  const band = 'M-22 -3.2Q0 8.8 22 -3.2V1.4Q0 13.4 -22 1.4Z'
  const low = 'M-22 1.4Q0 13.4 22 1.4V24H-22Z'
  const [c, cd] = shell === 'red' ? [P.red, P.wine] : shell === 'blue' ? [P.blue, P.mid] : [P.night, '#0E1533']
  const rivets = [-16, -10.6, 10.6, 16].map((x) => {
    const t = (x + 22) / 44, y = (1 - t) * (1 - t) * -0.9 + 2 * t * (1 - t) * 11.1 + t * t * -0.9
    return `<circle cx="${x}" cy="${f(y)}" r=".95" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x - 0.3)}" cy="${f(y - 0.3)}" r=".3" fill="${P.goldL}"/>`
  }).join('')
  // Dos rayas rojas por los meridianos (la del medio nivel), recortadas al casco.
  const stripes = shell === 'blue'
    ? k.clip(top, [-1, 1].map((s) => {
      const d = `M${f(s * -15)} 4C${f(s * -16.4)} -6 ${f(s * -14.4)} -13 ${f(s * -9.6)} -18.4L${f(s * -3.6)} -20C${f(s * -6.8)} -14 ${f(s * -7.6)} -6 ${f(s * -6)} 4Z`
      return `<path d="${d}" fill="${P.red}"/>` + k.shade(d, k.lin(P.wine, s < 0 ? 0 : 1, 0, s < 0 ? 1 : 0, 1, 0, 0.9), P.wine, 0.4) +
        `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width=".45"/>` + hair(s * -13.2, -2, s * -14, -9, s * -9.6, -15, 0.5, P.goldL, 0.7)
    }).join(''))
    : ''
  // El casco de noche lleva una costilla de oro por el medio, con remaches y volutas a los lados.
  const gilt = shell === 'night'
    ? k.clip(top,
      `<path d="M-3.2 6C-3.6 -4 -3.2 -13 -2.2 -21H2.2C3.2 -13 3.6 -4 3.2 6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.sh('M0 -22H4V6H0Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M-1.6 4V-19" stroke="${P.goldL}" stroke-width=".6"/>` +
      [-14, -9, -4.4].map((y) => `<circle cx="0" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`).join('') +
      [-1, 1].map((s) => `<g transform="scale(${s} 1)"><path d="M3.4 -3C7 -4 9 -7 8 -10C7.2 -12.4 4.6 -12.4 4.2 -10.4C3.9 -9 5 -8.2 6 -8.6M3.6 -12C6.4 -13.6 8.6 -16.4 7.6 -18.6" fill="none" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/>` +
        `<path d="M10.4 -1.6C13 -3.4 14.6 -6.4 14.2 -9.6M12 -12.6C13.4 -11.4 14.4 -11.6 15.2 -12.6" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-linecap="round"/>` +
        `<path d="${starPath(11.6, -15.6, 1.6, 0.6, 4)}" fill="${P.goldL}"/></g>`).join(''))
    : ''
  const shellHair = shell === 'night' ? P.mid : cd
  return (
    k.draw([{
      d: ball, fill: P.white,
      inner:
        `<path d="${top}" fill="${c}"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.95, cd, 0.5) +
        (shell === 'night' ? `<path d="${top}" fill="${k.rad(P.mid, 0.3, 0.2, 0.7, 0.9, 0)}"/>` : '') +
        stripes + gilt +
        hair(-15, -6, -14, -13, -8, -17.6, 0.5, shellHair, 0.8) + hair(15.6, -5, 15, -12, 10, -16.6, 0.5, shellHair) +
        k.sh(low, 0, 0, 1, 1, 0, 0.55, P.blue, 0.3) + hair(-14, 8, -9, 13.6, -2, 15.4, 0.5, P.blue, 0.6) + hair(6, 15.6, 12, 13.4, 16, 8.6, 0.5, P.mid, 0.6) +
        `<path d="${band}" fill="${P.night}"/>` + `<path d="M-22 -3.2Q0 8.8 22 -3.2" fill="none" stroke="${P.gold}" stroke-width=".55" opacity=".9"/>` +
        `<path d="M-22 -1.6Q0 10.4 22 -1.6" fill="none" stroke="${P.mid}" stroke-width=".5"/>` + rivets +
        k.shade(ball, k.rad(P.mid, 0.34, 0.3, 0.74, 0, 0.5), P.mid, 0.22) +
        `<ellipse cx="-8.6" cy="-11.6" rx="5.6" ry="2.6" fill="#fff" opacity=".8" transform="rotate(-38 -8.6 -11.6)"/><circle cx="-13.4" cy="-5.4" r="1.1" fill="#fff" opacity=".7"/>`,
    }], 0.8) +
    // El dial del frente: aro de bronce grabado y botón crema (en el de noche, una cerradura).
    `<ellipse cx="0" cy="5.4" rx="6.6" ry="5.9" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
    k.draw([{ d: ellipse(0, 5.4, 5, 4.5), fill: P.gold, inner: k.sh(ellipse(0, 5.4, 5, 4.5), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) }], 0.3) +
    Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return `<path d="M${f(Math.cos(a) * 3.6)} ${f(5.4 + Math.sin(a) * 3.25)}L${f(Math.cos(a) * 4.6)} ${f(5.4 + Math.sin(a) * 4.15)}" stroke="${P.goldD}" stroke-width=".35"/>`
    }).join('') +
    (shell === 'night'
      ? `<ellipse cx="0" cy="5.4" rx="3" ry="2.7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><path d="M0 3.8A.95 .95 0 0 1 .5 5.6L.8 7.4H-.8L-.5 5.6A.95 .95 0 0 1 0 3.8Z" fill="${P.night}"/>`
      : `<ellipse cx="0" cy="5.4" rx="3" ry="2.7" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` + k.clip(ellipse(0, 5.4, 3, 2.7), k.sh(ellipse(0, 5.4, 3, 2.7), 0, 0, 1, 1, 0, 0.8, P.blue, 0.4))) +
    `<path d="M-2 4.4A2.4 2 0 0 1 -.4 3.2" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>`
  )
}

/** Carta genérica de borde amarillo, centrada en (0,0) con ancho `w` y alto `h`. `art` va recortado a la ventana. */
function yellowCard(k: Kit, w: number, h: number, tint: string, art: string, o: { lines?: boolean; edge?: number } = {}) {
  const x = w / 2, y = h / 2, b = o.edge ?? w * 0.075
  const d = roundRect(-x, -y, x, y, w * 0.06)
  const inner = roundRect(-x + b, -y + b, x - b, y - b, w * 0.03)
  const wx0 = -x + b * 2, wx1 = x - b * 2, wy0 = -y + h * 0.14, wy1 = -y + h * 0.52
  const win = `M${f(wx0)} ${f(wy0)}H${f(wx1)}V${f(wy1)}H${f(wx0)}Z`
  return (
    `<path d="${d}" fill="${AMB}" stroke="${P.ink}" stroke-width="${f(w * 0.03)}"/>` +
    `<path d="${inner}" fill="${tint}"/>` +
    k.clip(win, art) + `<path d="${win}" fill="none" stroke="${AMB_D}" stroke-width="${f(w * 0.03)}"/>` +
    (o.lines === false ? '' :
      `<path d="M${f(wx0)} ${f(-y + h * 0.09)}H${f(wx0 + w * 0.4)}M${f(wx0)} ${f(wy1 + h * 0.12)}H${f(wx1)}M${f(wx0)} ${f(wy1 + h * 0.22)}H${f(wx1 - w * 0.2)}M${f(wx0)} ${f(wy1 + h * 0.32)}H${f(wx1)}" stroke="${P.blue}" stroke-width="${f(h * 0.028)}" opacity=".7"/>`)
  )
}

/** Paisaje mínimo para la ventana de una carta: cielo, loma y sol. */
const miniArt = (w: number, h: number, sky: string, hill: string) =>
  `<rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${w}" height="${h}" fill="${sky}"/>` +
  `<path d="M${f(-w / 2)} ${f(-h * 0.05)}Q${f(-w * 0.1)} ${f(-h * 0.2)} ${f(w / 2)} ${f(-h * 0.08)}V${f(h / 2)}H${f(-w / 2)}Z" fill="${hill}"/>` +
  `<circle cx="${f(w * 0.18)}" cy="${f(-h * 0.3)}" r="${f(w * 0.08)}" fill="${P.goldL}"/>`

/** Dragón naranja genérico de perfil hacia la izquierda, con la boca abierta en (−20,4) y el cuello hacia abajo. */
function dragon(k: Kit) {
  const neck = 'M8 -10C22 -10 34 0 40 18C44 30 46 42 46 56H18C18 44 16 34 12 26C8 18 2 13 -4 11Z'
  const skull =
    'M15 -9C12 -13 6 -14.6 0 -13.6C-4 -13 -7 -11 -10 -9.4C-14 -8 -19 -7 -21.6 -4.6C-23.2 -3 -23 -.6 -21.4 .4' +
    'C-18 1.8 -10 2 -4 2.4C2 3 8 4 12 2C15.6 0 17 -5 15 -9Z'
  const jaw = 'M-4 2.6C-10 4.4 -16 7 -19.6 9.4C-21 10.4 -20.4 12.2 -18.6 12C-12 11.4 -4 10.6 2 10.4C8 10.2 12 8 12 4C8 3 2 2.4 -4 2.6Z'
  const mouth = 'M-21 .6C-14 1.8 -8 2.2 -2 2.8C-8 4 -14 6.6 -19 9.2C-18.6 6 -19.6 2.6 -21 .6Z'
  const horn = 'M8 -12C11 -17 15 -21 22 -23C18 -19.6 16 -15.6 14.6 -10.6Z'
  const wing = 'M30 4C34 -14 46 -30 62 -36C58 -28 60 -22 64 -18C58 -16 56 -10 58 -4C52 -4 48 0 48 6C42 2 36 2 30 4Z'
  const belly = 'M-6 8C2 14 8 30 14 58L20 58C14 32 8 18 0 8Z'
  const plates = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5, y = 16 + t * 34, x0 = -1 + t * 20 + t * t * 4, x1 = x0 + 6.6 + t * 2
    return `<path d="M${f(x0)} ${f(y)}Q${f((x0 + x1) / 2)} ${f(y + 2.4)} ${f(x1)} ${f(y - 0.4)}" fill="none" stroke="${DRG_D}" stroke-width=".9"/>`
  }).join('')
  const teethUp = Array.from({ length: 4 }, (_, i) => { const x = -19 + i * 4; return `M${f(x)} ${f(1 + i * 0.2)}L${f(x + 1.1)} ${f(3.8)}L${f(x + 2.2)} ${f(1.3 + i * 0.2)}Z` }).join('')
  return (
    k.draw([{
      d: wing, fill: DRG,
      inner: `<path d="M34 3C38 -10 48 -24 60 -32C56 -24 58 -20 61 -17C56 -14 54 -9 55.6 -4C50 -3.4 47 0 46.4 4.6C41 1.6 37 1.6 34 3Z" fill="${P.sky}"/>` +
        k.sh(wing, 0, 0, 1, 1, 0, 0.9, P.mid, 0.4) + `<path d="M31 4L62 -36M40 2L64 -18M47 4L58 -4" stroke="${DRG_D}" stroke-width="1.1" stroke-linecap="round"/>`,
    }], 1) +
    k.draw([
      { d: neck, fill: DRG, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.95, DRG_D, 0.5) + `<path d="${belly}" fill="${P.goldL}"/>` + k.sh(belly, 0, 0, 1, 0, 0.1, 0.8, P.goldD, 0.45) + plates },
      { d: jaw, fill: DRG, inner: k.sh(jaw, 0, 0, 0, 1, 0.1, 0.95, DRG_D, 0.5) },
    ], 1) +
    `<path d="${mouth}" fill="${P.wine}"/><path d="${teethUp}" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
    k.draw([
      { d: horn, fill: P.goldL, inner: k.sh(horn, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) },
      { d: skull, fill: DRG, inner: k.sh(skull, 0, 0, 0, 1, 0.05, 0.95, DRG_D, 0.5) + `<path d="M-24 -16H16V-6C6 -9 -10 -8 -24 -4Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.55, 0)}"/>` },
    ], 1) +
    `<ellipse cx="-3" cy="-6.4" rx="2.8" ry="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".8" transform="rotate(-12 -3 -6.4)"/><path d="M-3 -8V-4.8" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="M-10 -9.6C-6 -12.4 0 -13 4 -11.4C0 -10 -4 -9 -7 -7.8Z" fill="${DRG_D}"/>`
  )
}

/** Pata de madera que se afina, de (x0,y0) a (x1,y1). */
const taperLeg = (x0: number, y0: number, x1: number, y1: number) => taper(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, 3.6, 2.8)

/** Piedra en bruto, centrada en (0,0) y de radio ~10, con sus facetas. */
const ROCK = 'M-9.4 -2.6L-6.4 -8.8L.6 -10.6L7.6 -7.4L10.2 -.4L7.2 7.6L-.8 9.8L-7.8 6.6Z'

export const TCG_POKEMONTCG_NUEVAS_ART: Record<string, (u: number) => string> = {
  // Tres partidas: le ganaste al de las piedras. La primera medalla, con su piedra en bruto engarzada y la cinta ámbar.
  'Medalla Roca': (u) => {
    const k = kit(u)
    const ribL = 'M41 12H53.4L63.4 47H56.6Z'
    const ribR = 'M66.6 12H79L63.4 47H56.6Z'
    const stripe = (d: string) => `<path d="${d}" fill="${P.red}"/>`
    const disc = ellipse(60, 67, 18.4, 18.4)
    const field = ellipse(60, 67, 14.2, 14.2)
    const prong = (a: number) => `<g transform="translate(60 67) rotate(${a})"><path d="M-1.6 -14.6C-1.4 -12 -1 -10.2 0 -8.6C1 -10.2 1.4 -12 1.6 -14.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M-.5 -13.6L-.1 -10" stroke="${P.goldL}" stroke-width=".4"/></g>`
    const chip = (x: number, y: number, s: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d: ROCK, fill: P.sky2, inner: k.sh(ROCK, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) + `<path d="M-6.4 -8.8L-1 -2L7.6 -7.4M-1 -2L-.8 9.8" fill="none" stroke="${P.blue}" stroke-width="${f(0.5 / s)}"/>` }], f(0.5 / s)) + `</g>`
    return (
      k.day() +
      k.sun(60, 64, 15, 44, 28, false) +
      k.shade(ellipse(60, 66, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      k.cast([ribL, ribR, disc], 2.2, 2) +
      k.draw([
        { d: ribL, fill: AMB, inner: stripe('M45.8 12H48.6L61.4 47H58.6Z') + k.sh(ribL, 0, 0, 1, 1, 0, 0.8, AMB_D, 0.4) + hair(43, 16, 50, 30, 57, 44, 0.45, AMB_D) },
        { d: ribR, fill: AMB, inner: stripe('M71.4 12H74.2L61.4 47H58.6Z') + k.sh(ribR, 0, 0, 1, 1, 0.2, 0.95, AMB_D, 0.45) + `<path d="M67.6 12L57.4 46" stroke="${AMB_L}" stroke-width=".7"/>` },
      ], 0.7) +
      k.draw([{ d: roundRect(51, 44.4, 69, 49.6, 1.4), fill: P.gold, inner: k.sh(roundRect(51, 44.4, 69, 49.6, 1.4), 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M52 45.8H68" stroke="${P.goldL}" stroke-width=".6"/><path d="M55 44.4V49.6M65 44.4V49.6" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.55) +
      `<ellipse cx="60" cy="49.6" rx="2" ry="1.6" fill="none" stroke="${P.ink}" stroke-width="1.6"/><ellipse cx="60" cy="49.6" rx="2" ry="1.6" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      k.draw([{
        d: disc, fill: P.gold,
        inner: k.sh(disc, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) +
          `<path d="M45 60A16 16 0 0 1 56 50" fill="none" stroke="${P.goldL}" stroke-width="1" stroke-linecap="round"/>`,
      }], 0.8) +
      Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return `<circle cx="${f(60 + Math.cos(a) * 16.3)}" cy="${f(67 + Math.sin(a) * 16.3)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('') +
      `<circle cx="60" cy="67" r="14.4" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="${field}" fill="${P.goldD}"/>` + k.clip(field,
        Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return `<path d="M60 67L${f(60 + Math.cos(a) * 15)} ${f(67 + Math.sin(a) * 15)}" stroke="${i % 2 ? P.gold : AMB_D}" stroke-width=".6"/>` }).join('') +
        k.shade(field, k.rad(P.wine, 0.5, 0.5, 0.5, 0, 0.6), P.wine, 0.3)) +
      `<g transform="translate(60 67) rotate(8)">` +
      k.draw([{
        d: ROCK, fill: P.sky2,
        inner:
          `<path d="M-9.4 -2.6L-6.4 -8.8L.6 -10.6L-1 -2Z" fill="${P.sky1}"/><path d="M-1 -2L.6 -10.6L7.6 -7.4Z" fill="${P.sky}"/>` +
          `<path d="M-1 -2L7.6 -7.4L10.2 -.4L7.2 7.6Z" fill="${P.blue}"/><path d="M-1 -2L7.2 7.6L-.8 9.8Z" fill="${P.mid}"/>` +
          `<path d="M-9.4 -2.6L-1 -2L-7.8 6.6Z" fill="${P.sky}"/>` +
          k.sh(ROCK, 0, 0, 1, 1, 0, 0.6, P.night, 0.3) +
          `<path d="M-6.4 -8.8L-1 -2L.6 -10.6M7.6 -7.4L-1 -2L10.2 -.4M-1 -2L7.2 7.6M-1 -2L-.8 9.8M-9.4 -2.6L-1 -2L-7.8 6.6" fill="none" stroke="${P.ink}" stroke-width=".35" opacity=".8"/>` +
          hair(-6, -5, -4.6, -6.8, -2.4, -8.4, 0.6, '#fff') + hair(3.4, 1.2, 5, 3, 6, 5.6, 0.45, P.sky1, 0.8) +
          `<circle cx="-4" cy="2" r=".5" fill="${P.mid}"/><circle cx="2.4" cy="-6" r=".4" fill="${P.blue}"/><circle cx="5.4" cy="-2" r=".45" fill="${P.night}"/>`,
      }], 0.6) + `</g>` +
      prong(-40) + prong(40) + prong(140) + prong(-140) +
      chip(30, 82, 0.34, 20) + chip(91, 78, 0.28, -30) + chip(86, 43, 0.22, 60) +
      hair(36, 86, 40, 84, 43, 80, 0.5, P.mid) + hair(87, 82, 84, 82, 81, 79, 0.45, P.mid) +
      sparkle(36, 40, 2.4) + sparkle(77.4, 56, 1.8, '#fff') +
      k.defs()
    )
  },

  // Quince victorias: la gorra de entrenador llena de medallas, rumbo a la Liga.
  'Ocho medallas': (u) => {
    const k = kit(u)
    const crown = 'M33.6 62C32.4 44 46 31 63 31C80 31 91 43 90 60C90 64.6 88.8 67.6 86.8 69C72 72 48 69.6 33.6 62Z'
    const front = 'M20 20H63.4C59.6 40 58 56 58.4 76H20Z'
    const visor = 'M34.6 61C27.4 62.6 23.4 68 24.6 74.2C26 80.8 37.6 83.8 51 80.2C57.4 78.4 62.6 75.4 66.4 70.8C55 70.8 43.4 67.2 34.6 61Z'
    const spots: [number, number, number][] = [[44.6, 45.4, -24], [54.6, 40.4, -12], [66.4, 39.6, 4], [78, 43.6, 16], [40.6, 55.6, -26], [51, 52.4, -14], [63.6, 51.8, 2], [76.4, 54.8, 14]]
    const shapes: [string, string][] = [
      [ROCK, P.sky2],
      ['M0 -9C4 -3 7 1 7 4C7 8 4 10 0 10C-4 10 -7 8 -7 4C-7 1 -4 -3 0 -9Z', P.sky],
      ['M0 -9C6 -6 9 0 7 6C5 9 -2 10 -6 7C-9 3 -8 -4 0 -9Z', P.green],
      ['M0 9C-6 5 -10 1 -10 -4C-10 -8 -6 -10 -3 -9C-1.6 -8.6 -.6 -7.4 0 -6C.6 -7.4 1.6 -8.6 3 -9C6 -10 10 -8 10 -4C10 1 6 5 0 9Z', P.red],
      [starPath(0, 0, 10, 4.2, 6), P.white],
      ['M2 -10C-6 -9 -10 -3 -9 3C-8 8 -2 11 4 9C-1 7 -4 3 -4 -1C-4 -5 -2 -8 2 -10Z', P.mid],
      ['M0 -10L7 0L0 10L-7 0Z', P.wine],
      ['M2 -10L-6 2H0L-2 10L6 -2H0Z', P.sky1],
    ]
    const badge = (i: number) => {
      const [x, y, r] = spots[i], [d, c] = shapes[i]
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(.36 .34)"><path d="${d}" fill="${c}" stroke="${P.goldD}" stroke-width="3"/><path d="${d}" fill="none" stroke="${P.ink}" stroke-width="1.3"/>` +
        `<circle cx="-3" cy="-3.4" r="1.9" fill="#fff" opacity=".85"/></g>`
    }
    return (
      k.day() +
      k.sun(60, 56, 15, 44, 28, false) +
      k.shade(ellipse(60, 56, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(58, 84, 30, 3.6, P.mid) +
      k.cast([crown, visor], 2.6, 2.4) +
      k.draw([{
        d: crown, fill: AMB,
        inner:
          `<path d="${front}" fill="${P.white}"/>` + k.sh(front, 0, 0, 1, 1, 0, 0.55, P.sky2, 0.4) +
          k.sh('M68 28C80 38 86 52 84 74H94V28Z', 0, 0, 1, 0, 0, 0.95, AMB_D, 0.5) + `<path d="M28 28H42C37 40 36 52 38 70H28Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
          k.sh('M30 58H92V74H30Z', 0, 0, 0, 1, 0, 0.7, P.mid, 0.3) +
          hair(62, 32, 49, 42, 42.6, 64.6, 0.6, P.blue) + hair(63.4, 32, 59.6, 48, 58.6, 70, 0.6, P.blue) + hair(64.6, 32, 76, 42, 79, 68.6, 0.55, AMB_D) +
          `<path d="M60.6 33.4C57.8 47 57 58 57.2 69.4M41 63.4C44.6 50 50 40 60.6 33" fill="none" stroke="${P.blue}" stroke-width=".35" stroke-dasharray="1 .8"/>` +
          hair(38, 52, 39, 44, 44, 37, 0.8, '#fff', 0.9),
      }], 0.8) +
      k.draw([{ d: ellipse(63.2, 31.4, 3.6, 1.7), fill: AMB, inner: k.sh(ellipse(63.2, 31.4, 3.6, 1.7), 0, 0, 1, 1, 0, 0.9, AMB_D, 0.5) }], 0.45) +
      `<circle cx="85.4" cy="49" r="1" fill="${AMB_D}" stroke="${P.ink}" stroke-width=".35"/>` +
      spots.map((_, i) => badge(i)).join('') +
      k.draw([
        { d: visor, t: 'translate(0 1.6)', fill: AMB_D },
        {
          d: visor, fill: AMB,
          inner:
            k.sh(visor, 0, 0, 1, 1, 0, 0.9, AMB_D, 0.5) + k.sh('M30 60H66V68C52 70 40 66 30 60Z', 0, 0, 0, 1, 0.5, 0, P.mid, 0.3) +
            `<path d="M27.6 73.4C29.4 78.4 39 80.4 50 77.4C55 76 58.6 73.8 60.2 71.4M30.8 72.4C32.8 76 40.6 77.2 49.4 74.8C53.6 73.6 56.6 72 58 70.4" fill="none" stroke="${AMB_D}" stroke-width=".4" stroke-dasharray="1 .7"/>` +
            hair(28, 70, 31, 66, 36, 64, 0.7, '#fff', 0.8),
        },
      ], 0.8) +
      sparkle(88, 34, 2.4) + sparkle(30, 42, 1.8) + sparkle(53.4, 46, 1.4, '#fff') +
      k.defs()
    )
  },

  // Cuarenta partidas: el Salón de la Fama. La copa grande con tu equipo de seis engarzado en la panza.
  'Campeón de la Liga': (u) => {
    const k = kit(u)
    const bowl = 'M41.6 31.6C41.6 46 47.4 56.4 60 58.4C72.6 56.4 78.4 46 78.4 31.6Z'
    const lip = ellipse(60, 31.4, 18.6, 3.6)
    const mouth = ellipse(60, 31, 16.8, 2.6)
    const stem = 'M55.6 57.6C57 60 57 62 55.6 64H64.4C63 62 63 60 64.4 57.6Z'
    const knop = ellipse(60, 64.6, 5.4, 2.2)
    const foot = 'M57.4 66.6C57.6 68.6 55.4 70.4 50 72H70C64.6 70.4 62.4 68.6 62.6 66.6Z'
    const base = 'M47 72H73L75 76H45Z'
    const plinth = 'M42 76H78V89H42Z'
    const handle = 'M42.4 35.4C34 33 29.4 38.6 31.4 44.6C33 49.6 38.6 52.4 45 50.4'
    const gems = [P.red, P.sky, P.green, AMB, '#9C7BC4', P.brown]
    const gemRow = gems.map((c, i) => {
      const x = 46.6 + i * 5.36, y = 41.2 + 1.6 * (1 - ((x - 60) / 15) ** 2)
      return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="2.1" ry="2.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="1.4" ry="1.6" fill="${c}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x - 0.45)}" cy="${f(y - 0.55)}" r=".45" fill="#fff"/>`
    }).join('')
    const gadroons = Array.from({ length: 9 }, (_, i) => {
      const x = 47 + i * 3.25, bend = (x - 60) * 0.2
      return hair(x, 46.6, x + bend * 0.2, 51, 60 + (x - 60) * 0.4, 57, 0.55, P.goldD)
    }).join('')
    const beam = 'M48 10H72L96 104H24Z'
    const rid = k.id('salon')
    return (
      k.night() +
      `<path d="${beam}" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0.05)}"/>` + k.shade(beam, k.lin(P.goldL, 0, 0, 0, 1, 0.45, 0), P.goldL, 0.2) +
      k.shade(ellipse(60, 50, 30, 30), k.rad(P.gold, 0.5, 0.5, 0.5, 0.55, 0), P.gold, 0.4) +
      [[30, 30], [92, 44], [27, 62], [96, 66], [86, 26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.paper}"/>`).join('') +
      laurel(46, 96, 27, 86, 26, 56, 8) + laurel(74, 96, 93, 86, 94, 56, 8, true) +
      k.floor(60, 89, 26, 2.6, '#000') +
      [handle, `M77.6 35.4C86 33 90.6 38.6 88.6 44.6C87 49.6 81.4 52.4 75 50.4`].map((d) =>
        `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round" transform="translate(-.4 -.4)"/>`).join('') +
      `<circle cx="31.4" cy="44.6" r="1.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="88.6" cy="44.6" r="1.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([
        {
          d: plinth, fill: P.brownD,
          inner: `<path d="${plinth}" fill="${k.lin(P.brown, 0, 0, 1, 0, 0.9, 0.1)}"/>` + k.sh(plinth, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) +
            `<path d="M42 79H78" stroke="${P.gold}" stroke-width=".9"/><path d="M42 78.2H78" stroke="${P.ink}" stroke-width=".35"/>` +
            hair(44, 84, 46, 82, 50, 83, 0.35, P.brown) + hair(70, 86, 74, 84, 77, 85, 0.35, P.night),
        },
        { d: base, fill: P.gold, inner: k.sh(base, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M46 74.4H74" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: foot, fill: P.gold, inner: k.sh(foot, 0, 0, 1, 0, 0.1, 0.95, P.goldD, 0.5) + `<path d="M58 67H59.4V71H56Z" fill="${P.goldL}" opacity=".8"/>` },
        { d: stem, fill: P.gold, inner: k.sh(stem, 0, 0, 1, 0, 0.1, 0.95, P.goldD, 0.5) },
        { d: knop, fill: P.gold, inner: k.sh(knop, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M55.4 64.6H64.6" stroke="${P.goldD}" stroke-width=".35"/>` },
        {
          d: bowl, fill: P.gold,
          inner:
            k.sh('M62 28C70 40 70 50 62 60H82V28Z', 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M38 28H50C46 40 47 50 52 60H38Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.75, 0)}"/>` +
            `<path d="M41.6 35.6C50 38.4 70 38.4 78.4 35.6" fill="none" stroke="${P.goldD}" stroke-width=".5"/><path d="M42.4 44.6C50 47.4 70 47.4 77.6 44.6" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
            gadroons + hair(46, 38, 46.4, 44, 49, 52, 0.9, '#fff', 0.8),
        },
      ], 0.85) +
      Array.from({ length: 10 }, (_, i) => { const x = 43.6 + i * 3.64; return `<circle cx="${f(x)}" cy="${f(36.4 + 1.6 * (1 - ((x - 60) / 17) ** 2))}" r=".5" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".18"/>` }).join('') +
      gemRow +
      k.draw([{ d: lip, fill: P.gold, inner: k.sh(lip, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.55) +
      `<path d="${mouth}" fill="${P.goldD}"/>` + k.clip(mouth, k.sh(mouth, 0, 0, 0, 1, 0.9, 0.1, P.wine, 0.4)) +
      `<path d="M44.6 30.2Q60 27.6 75 30" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="${roundRect(46, 80.6, 74, 86.8, 0.8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${roundRect(46.8, 81.4, 73.2, 86, 0.5)}" fill="none" stroke="${P.goldD}" stroke-width=".3"/>` +
      `<path id="${rid}" d="M47 84.7H73" fill="none"/>` +
      `<text font-family="Georgia, serif" font-style="italic" font-size="3.4" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">Salón de la Fama</textPath></text>` +
      sparkle(60, 20.6, 3.4, '#fff') + sparkle(40.6, 25, 2, P.goldL) + sparkle(80, 25.4, 1.8, P.goldL) + sparkle(73.6, 50, 1.6, '#fff') +
      k.defs()
    )
  },

  // Diez KO: ya la tirás con efecto. La esfera en el aire, girando, con la curva que dejó.
  'Pokébola': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(64, 54, 14, 42, 28, false) +
      k.shade(ellipse(64, 54, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<path d="M25 97C27 82 34 71 45 64.6" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="2 1.8" stroke-linecap="round"/>` +
      hair(30, 84, 34, 74, 43, 68, 0.9, P.blue) + hair(36, 92, 38, 80, 48, 72.6, 0.7, P.blue) + hair(28, 72, 34, 66, 42, 62, 0.6, P.blue, 0.8) +
      k.floor(56, 95, 15, 2.6) +
      `<g transform="translate(64 54) rotate(-16)">` + k.cast([ellipse(0, 0, 20, 20)], 2.4, 2.4) + sphere(k, 'red') + `</g>` +
      arcArrow(64, 54, 26.6, 196, 246, 1.2) + arcArrow(64, 54, 26.6, 16, 66, 1.2) +
      sparkle(90, 34, 2.4) + sparkle(32, 44, 1.6) +
      k.defs()
    )
  },

  // Cincuenta KO: la azul con rayas rojas, para los que no fallan. Clavada en el centro del blanco.
  'Superball': (u) => {
    const k = kit(u)
    const cx = 57, cy = 56, RX = 25.6, RY = 31.4
    const ring = (s: number) => ellipse(cx, cy, f(RX * s), f(RY * s))
    const rim = ellipse(cx + 3.8, cy + 0.8, RX, RY)
    const legL = taperLeg(46, 78, 41, 104), legR = taperLeg(70, 78, 77, 104)
    const rings: [number, string][] = [[1, P.white], [0.8, AMB], [0.6, P.white], [0.4, AMB], [0.2, P.white]]
    const crack = (pts: number[][]) => `<path d="M${pts.map((p) => p.map(f).join(' ')).join('L')}" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linejoin="round" stroke-linecap="round"/>`
    return (
      k.day() +
      k.sun(cx, cy, 14, 46, 28, false) +
      k.floor(62, 96, 22, 3, P.mid) +
      k.draw([{ d: legL, fill: P.brown, inner: k.sh(legL, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) }, { d: legR, fill: P.brown, inner: k.sh(legR, 0, 0, 1, 0, 0.2, 0.95, P.brownD, 0.5) }], 0.6) +
      k.cast([rim], 2, 2.2, P.mid) +
      k.draw([{
        d: rim, fill: P.brown,
        inner: k.sh(rim, 0, 0, 1, 0, 0.3, 0.95, P.brownD, 0.5) + Array.from({ length: 9 }, (_, i) => hair(cx + 22 + (i % 3), cy - 24 + i * 6, cx + 27 + (i % 2), cy - 21 + i * 6, cx + 25, cy - 18 + i * 6, 0.4, P.brownD)).join(''),
      }, { d: ring(1), fill: P.white }], 0.75) +
      rings.map(([s, c]) =>
        `<path d="${ring(s)}" fill="${c}" stroke="${P.ink}" stroke-width=".4"/>` + k.clip(ring(s), k.sh(ring(s), 0, 0, 1, 1, 0.1, 0.8, c === AMB ? AMB_D : P.blue, 0.35))).join('') +
      `<path d="${ring(0.9)}" fill="none" stroke="${P.blue}" stroke-width=".35" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` +
      crack([[cx + 12, cy - 6], [cx + 15, cy - 9], [cx + 15.6, cy - 13], [cx + 19.6, cy - 16]]) + crack([[cx - 11, cy + 7], [cx - 14, cy + 9], [cx - 14, cy + 13], [cx - 18, cy + 17.4]]) +
      crack([[cx - 6, cy - 13], [cx - 8, cy - 17], [cx - 6.6, cy - 21], [cx - 9, cy - 25]]) + crack([[cx + 7, cy + 13], [cx + 9.6, cy + 17], [cx + 8.4, cy + 20.6]]) +
      `<g transform="translate(${cx} ${cy}) rotate(-12) scale(.76)">` + k.cast([ellipse(0, 0, 20, 20)], 2.4, 2.6, AMB_D) + sphere(k, 'blue') + `</g>` +
      hair(24, 34, 28, 38, 32, 40, 0.8, P.mid) + hair(22, 42, 27, 44, 31, 45, 0.7, P.mid) + hair(28, 28, 31, 32, 35, 35, 0.6, P.mid) +
      sparkle(90, 34, 2.4, '#fff') + sparkle(32, 80, 1.6) +
      k.defs()
    )
  },

  // Ciento cincuenta KO: nada se te escapa. La de noche con costilla de oro y cerradura, en su almohadón y su gloria.
  'Ultraball': (u) => {
    const k = kit(u)
    const cushion = 'M33 85C33 78 45 74 60 74C75 74 87 78 87 85C87 91.4 75 95 60 95C45 95 33 91.4 33 85Z'
    return (
      k.day() +
      k.sun(60, 56, 16, 48, 32, false) +
      k.shade(ellipse(60, 56, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.goldL, 0.45) +
      laurel(48, 99, 28, 90, 25, 58, 8) + laurel(72, 99, 92, 90, 95, 58, 8, true) +
      k.draw([{
        d: cushion, fill: P.red,
        inner: k.sh(cushion, 0, 0, 1, 1, 0, 0.95, P.wine, 0.5) + `<path d="M35 85.6C45 89 75 89 85 85.6" fill="none" stroke="${P.gold}" stroke-width=".9"/><path d="M35 85.6C45 89 75 89 85 85.6" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round" transform="translate(0 1.4)"/>` +
          hair(38, 80, 42, 77.4, 47, 76.4, 0.6, '#fff', 0.6),
      }], 0.7) +
      [[33, 85], [87, 85]].map(([x, y]) => `<path d="M${x} ${y}l${x < 60 ? -2.6 : 2.6} 4.6l${x < 60 ? 3.2 : -3.2} -.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      k.floor(61, 80.4, 18, 3.4, P.wine) +
      hair(40, 81, 44, 80.6, 46, 79, 0.5, P.wine) + hair(80, 81, 76, 80.6, 74, 79, 0.5, P.wine) + hair(50, 84, 55, 83.6, 58, 82.4, 0.45, P.wine) +
      `<g transform="translate(60 58.6) rotate(-6) scale(1.06)">` + sphere(k, 'night') + `</g>` +
      sparkle(60, 22.6, 3.6, '#fff') + sparkle(35, 38, 2.2) + sparkle(86, 40, 2) + sparkle(47, 45, 1.6, '#fff') +
      k.defs()
    )
  },

  // Tres ex: tu carpeta brilla con la luz de la ventana. La hoja de nueve fundas en penumbra y la holo del medio encendida.
  'Holo brillante': (u) => {
    const k = kit(u)
    const page = roundRect(-22, -28, 22, 28, 1.6)
    const tints = [P.sky1, '#E3EBCD', '#F3DAD0', P.paper, '', '#E3EBCD', '#F3DAD0', P.sky1, P.paper]
    const skies = [P.sky, P.sky2, P.goldL, P.sky1, '', P.sky, P.sky2, P.goldL, P.sky]
    const hills = [P.green, P.blue, P.brown, P.greenD, '', P.mid, P.green, P.red, P.brown]
    const W = 11.6, H = 16.4
    const holo = (w: number, h: number) =>
      `<rect x="${-w}" y="${-h}" width="${w * 2}" height="${h * 2}" fill="${P.white}"/>` +
      [[P.sky, -7], [P.goldL, -3.6], ['#F2C6CF', -0.2], [P.sky1, 3.2], ['#CFE3B4', 6.6], [P.goldL, 10]].map(([c, o]) => `<path d="M${o} -10L${+o + 3.4} -10L${+o - 4.6} 10L${+o - 8} 10Z" fill="${c}"/>`).join('') +
      `<path d="${starPath(0.6, -0.6, 4.6, 1.2, 8)}" fill="#fff"/><circle cx=".6" cy="-.6" r="1.6" fill="${P.goldL}"/>`
    const cards = Array.from({ length: 9 }, (_, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = -16.4 + W / 2 + c * (W + 1.1), y = -25.6 + H / 2 + r * (H + 1)
      const art = i === 4 ? holo(W / 2, H / 2) : miniArt(W, H, skies[i], hills[i])
      return `<g transform="translate(${f(x)} ${f(y)})">` + yellowCard(k, W, H, i === 4 ? P.white : tints[i], art, { edge: 0.85 }) + `</g>`
    }).join('')
    const pockets = Array.from({ length: 9 }, (_, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = -16.9 + c * (W + 1.1), y = -26.1 + r * (H + 1)
      return `<path d="${roundRect(f(x), f(y), f(x + W + 1), f(y + H + 1), 0.6)}" fill="none" stroke="${P.blue}" stroke-width=".35"/>` + hair(x + 1.6, y + H - 2, x + 4, y + H * 0.5, x + W - 2, y + 2, 0.5, '#fff', 0.8)
    }).join('')
    // La ventana proyectada: cuatro paños de luz torcidos, separados por la cruz de la carpintería.
    const o = [-24.4, -26.6], uu = [15.4, -2], vv = [3.4, 17.6], g = 1.1
    const panes = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j]) => {
      const x = o[0] + i * uu[0] * g + j * vv[0] * g, y = o[1] + i * uu[1] * g + j * vv[1] * g
      return `M${f(x)} ${f(y)}L${f(x + uu[0])} ${f(y + uu[1])}L${f(x + uu[0] + vv[0])} ${f(y + uu[1] + vv[1])}L${f(x + vv[0])} ${f(y + vv[1])}Z`
    }).join('')
    return (
      `<rect width="120" height="130" fill="${P.mid}"/>` + k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.6, 0.6, 0.75, 0, 0.95), P.night, 0.45) +
      `<path d="M0 8L30 0L76 46L50 80Z" fill="${k.lin(P.goldL, 0, 0, 1, 1, 0.75, 0.15)}"/>` + k.shade('M0 8L30 0L76 46L50 80Z', k.lin(P.goldL, 0, 0, 1, 1, 0.6, 0), P.goldL, 0.15) +
      `<g transform="translate(60 61) rotate(-7)">` +
      k.cast([page], 2.4, 2.4, P.night) +
      k.draw([{ d: page, fill: P.sky1, inner: k.sh(page, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.7) +
      [-17, 0, 17].map((y) => `<circle cx="-19.6" cy="${y}" r="1.25" fill="${P.mid}" stroke="${P.ink}" stroke-width=".45"/>`).join('') +
      cards + pockets +
      k.clip(page, `<path d="${page} ${panes}" fill="${P.night}" fill-rule="evenodd" opacity=".58"/><path d="${panes}" fill="${P.goldL}" opacity=".3"/><path d="${panes}" fill="#fff" opacity=".18"/>`) +
      `</g>` +
      sparkle(62.6, 58.6, 5.4, '#fff') + sparkle(68.6, 52.6, 2, '#fff') + sparkle(56, 66.4, 1.6, P.goldL) +
      [[30, 22], [40, 30], [46, 20], [26, 36]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${0.4 + (i % 2) * 0.25}" fill="${P.goldL}" opacity=".9"/>`).join('') +
      k.defs()
    )
  },

  // Quince ex: tus cartas no tienen ni borde. La tormenta del dibujo se sale de la carta, con rayo y todo.
  'Carta full art': (u) => {
    const k = kit(u)
    const card = roundRect(-18, -25, 18, 25, 2)
    const bolt = 'M10.6 -38L-3.6 -13.4L4 -12L-8.2 9.4L-.4 10.2L-12.6 31.6L4.4 6.6L-3.6 5.8L8.8 -14.6L.6 -15.8L18 -38Z'
    const boltCore = 'M13.6 -36L.6 -14.8L6.8 -13.4L-4 6.2L2.2 6.8L-10.4 28.4'
    const mountains = 'M-20 6L-13 -3.4L-9 1L-2 -8.6L5 -.4L9.6 -4.6L20 5.4V26H-20Z'
    const puff = (x: number, y: number, r: number, c: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`
    const clouds = (c1: string, c2: string) =>
      puff(-14, -22, 7, c2) + puff(-6, -24, 7.4, c2) + puff(4, -25, 6.4, c2) + puff(13, -22, 6.6, c2) + puff(20, -19, 5, c2) +
      puff(-17, -16, 5, c1) + puff(-9, -17.6, 5.6, c1) + puff(0, -18.6, 5, c1) + puff(9, -17, 5, c1) + puff(17, -15, 4.4, c1)
    const cloudL = 'M-17 -20C-21 -23 -27 -21 -27 -16.6C-30 -15 -29.6 -10 -26 -9.4C-25 -6.4 -20.6 -6 -18.6 -8.4C-16.6 -7 -13.6 -7.6 -13 -10H-17Z'
    const cloudR = 'M14 -24.6C13.4 -30.6 19.6 -34 23.6 -30.6C26.6 -33.4 32 -31.4 31.6 -27C35 -25.4 34.4 -20 30.4 -19.4C29.4 -16.4 25 -16 23.2 -18.4C21 -16.6 17.4 -17.4 17 -20.4Z'
    return (
      k.day() +
      k.sun(60, 60, 14, 46, 28, false) +
      `<g transform="translate(60 61) rotate(-8)">` +
      k.cast([card], 2.6, 2.4, P.mid) +
      k.draw([{
        d: card, fill: P.night,
        inner:
          `<path d="M-20 -26H20V26H-20Z" fill="${k.lin(P.mid, 0, 0, 0, 1, 0.1, 0.95)}"/>` +
          `<path d="M-20 -26H20V26H-20Z" fill="${k.rad(P.sky, 0.4, 0.42, 0.5, 0.55, 0)}"/>` +
          clouds(P.blue, P.mid) + k.sh('M-20 -30H20V-10H-20Z', 0, 0, 0, 1, 0, 0.6, P.night, 0.4) +
          hair(-14, -11.4, -9, -13, -4, -12, 0.6, AMB_L) + hair(6, -12.6, 10, -13.6, 15, -10.6, 0.6, AMB_L) +
          Array.from({ length: 14 }, (_, i) => { const x = -17 + i * 2.6; return hair(x, -10 + (i % 3) * 3, x - 2.4, -2, x - 4.4, 6 + (i % 2) * 6, 0.3, P.sky, 0.6) }).join('') +
          `<path d="${mountains}" fill="${P.ink}"/>` + hair(-13, -3.4, -12, 0, -9.6, 1, 0.5, P.sky) + hair(-2, -8.6, -1, -5, 2, -3, 0.55, AMB_L) + hair(9.6, -4.6, 11, -2, 13.4, -.6, 0.45, P.sky) +
          `<path d="M-20 15C-10 11 4 14 20 10V26H-20Z" fill="${P.night}"/><path d="M-20 18C-8 15 6 17 20 14" fill="none" stroke="${P.mid}" stroke-width=".5"/>` +
          Array.from({ length: 9 }, (_, i) => `<path d="M${-22 + i * 6} -26L${-30 + i * 6} 26" stroke="#fff" stroke-width=".25" opacity=".2"/>`).join('') +
          `<path d="M-15 -21.4H-2.4" stroke="#fff" stroke-width="1.1" opacity=".8"/><circle cx="13.4" cy="-21.4" r="1.8" fill="${AMB}" stroke="${P.ink}" stroke-width=".35"/>` +
          `<path d="M-15 18.4H6M-15 21.4H12" stroke="#fff" stroke-width=".7" opacity=".6"/>`,
      }], 0.75) +
      `<path d="${card}" fill="none" stroke="${P.sky}" stroke-width=".4" transform="scale(.97)"/>` +
      // Las nubes y el rayo desbordan la carta.
      k.draw([{ d: cloudL, fill: P.sky2, inner: k.sh(cloudL, 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + hair(-25, -10, -22, -9, -19, -9.4, 0.4, AMB_L) }], 0.55) +
      k.draw([{ d: cloudR, fill: P.sky1, inner: k.sh(cloudR, 0, 0, 1, 1, 0, 0.85, P.blue, 0.45) + hair(16, -24, 20, -26, 23.6, -25, 0.4, P.blue) + hair(24, -19, 27.6, -19.4, 30, -21, 0.45, AMB_L) }], 0.6) +
      k.draw([{ d: bolt, fill: AMB, inner: k.sh(bolt, 0, 0, 1, 0, 0, 0.8, AMB_D, 0.4) + `<path d="${boltCore}" fill="none" stroke="${P.white}" stroke-width="1.4" stroke-linejoin="round"/>` }], 0.8) +
      hair(-4, 2, -9, 3, -13.6, 7.6, 0.8, AMB_L) + hair(4.6, -14, 9, -16, 12, -21, 0.7, AMB_L) +
      `<path d="${starPath(-12.4, 31.2, 5.4, 1.8, 8, -70)}" fill="${AMB_L}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-12.4" cy="31.2" r="1.4" fill="#fff"/>` +
      `</g>` +
      sparkle(84, 22, 2.4, AMB_L) + sparkle(28, 32, 1.8) + sparkle(92, 74, 1.6, '#fff') +
      k.defs()
    )
  },

  // Cuarenta ex: el dragón naranja holográfico de primera edición, encapsulado y con nota 10. No se vende.
  'Charizard primera edición': (u) => {
    const k = kit(u)
    const slab = roundRect(-21, -30, 21, 30, 3)
    const well = roundRect(-18.6, -14.6, 18.6, 28, 1.6)
    const label = roundRect(-18.6, -27.8, 18.6, -16.6, 1.2)
    const W = 30, H = 41.6
    const card = roundRect(-W / 2, -H / 2, W / 2, H / 2, 1.6)
    const inner = roundRect(-W / 2 + 1.7, -H / 2 + 1.7, W / 2 - 1.7, H / 2 - 1.7, 0.6)
    const win = 'M-12.4 -16.4H12.4V3.4H-12.4Z'
    const holo =
      `<rect x="-14" y="-18" width="28" height="22" fill="${P.goldL}"/>` +
      [[P.sky1, -14], ['#F4CFC4', -8], [P.white, -3], [P.sky, 3], ['#F7E3A6', 9], [P.sky1, 14]].map(([c, o]) => `<path d="M${o} -18L${+o + 5} -18L${+o - 4} 4L${+o - 9} 4Z" fill="${c}" opacity=".85"/>`).join('') +
      Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<path d="M-6 -6L${f(-6 + Math.cos(a) * 26)} ${f(-6 + Math.sin(a) * 26)}" stroke="#fff" stroke-width=".5" opacity=".5"/>` }).join('')
    return (
      k.day() +
      k.sun(60, 58, 16, 48, 32, false) +
      k.shade(ellipse(60, 58, 28, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.goldL, 0.45) +
      laurel(48, 99, 28, 92, 24, 62, 8) + laurel(72, 99, 92, 92, 96, 62, 8, true) +
      `<g transform="translate(60 60) scale(.96)">` +
      k.cast([slab], 2.6, 2.4, P.mid) +
      k.draw([{ d: slab, fill: P.sky1, inner: k.sh(slab, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M-21 -31H-17V31H-21Z" fill="#fff" opacity=".6"/>` }], 0.8) +
      `<path d="${roundRect(-19.6, -28.8, 19.6, 28.8, 2.2)}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` +
      `<path d="${well}" fill="${P.sky2}" stroke="${P.blue}" stroke-width=".4"/>` +
      // Etiqueta de la calificación: renglones, la cinta roja y el 10 grande.
      `<path d="${label}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` + k.clip(label, `<path d="M-19 -27.8H19V-25.8H-19Z" fill="${P.red}"/>` + k.sh(label, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3)) +
      `<text x="-16.8" y="-21.4" font-family="Georgia, serif" font-style="italic" font-size="3.4" fill="${P.ink}">1ª edición</text>` +
      `<path d="M-16.8 -18.8H1.6" stroke="${P.blue}" stroke-width=".7"/>` +
      `<path d="${roundRect(8, -25, 17, -17.6, 0.8)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="12.5" y="-18.9" font-family="Georgia, serif" font-weight="700" font-size="6" fill="${P.white}" text-anchor="middle">10</text>` +
      `<g transform="translate(0 6.4)">` +
      `<path d="${card}" fill="${AMB}" stroke="${P.ink}" stroke-width=".55"/>` + k.clip(card, k.sh(card, 0, 0, 1, 1, 0, 0.6, AMB_D, 0.35)) +
      `<path d="${inner}" fill="#F6E2CE"/>` + k.clip(inner, k.sh(inner, 0, 0, 1, 1, 0, 0.4, P.goldD, 0.3)) +
      `<path d="M-12.4 -18.4H1" stroke="${P.ink}" stroke-width=".9"/><circle cx="11.2" cy="-18.4" r="1.3" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.clip(win, holo +
        `<g transform="translate(-.4 -4.6) scale(.31)">` + dragon(k) + `</g>` +
        flame(k, 'translate(-7.2 -3.4) rotate(-86) scale(.12) translate(-60 -90)')) +
      `<path d="${win}" fill="none" stroke="${P.gold}" stroke-width=".9"/><path d="${win}" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
      `<circle cx="-11.4" cy="4.4" r="2.1" fill="${P.ink}" stroke="${P.white}" stroke-width=".35"/><text x="-11.4" y="5.6" font-family="Georgia, serif" font-weight="700" font-size="2.8" fill="${P.white}" text-anchor="middle">1ª</text>` +
      `<path d="M-8 5.6H12.4" stroke="${P.goldD}" stroke-width=".5"/>` +
      `<circle cx="-11" cy="10" r="1.3" fill="${P.red}"/><path d="M-8.4 10H6M-8.4 14.4H8" stroke="${P.blue}" stroke-width=".9"/><path d="M8.6 10H12.2M9.8 14.4H12.2" stroke="${P.ink}" stroke-width="1"/>` +
      `<circle cx="-11" cy="14.4" r="1.3" fill="${P.red}"/><path d="M-12 17.6H12" stroke="${P.blue}" stroke-width=".4"/>` +
      `</g>` +
      k.clip(slab, `<path d="M-30 -6L4 -40L12 -40L-22 -6Z" fill="#fff" opacity=".45"/><path d="M-4 42L30 8V14L2 42Z" fill="#fff" opacity=".35"/>`) +
      `</g>` +
      sparkle(60, 19.6, 3.4, '#fff') + sparkle(33.4, 36, 2.2) + sparkle(87, 40, 2) + sparkle(81.6, 82, 1.6, '#fff') +
      k.defs()
    )
  },
}
