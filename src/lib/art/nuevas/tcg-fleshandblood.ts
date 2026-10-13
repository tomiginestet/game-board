// Flesh and Blood: un héroe, un arma y la mano entera en un ataque. Medallas de gesta, con el rojo sangre de la
// ficha como color propio. Nada de la marca: ni héroes, ni armas, ni cartas, ni el logo del juego.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'

/** Rojo sangre de la ficha del juego, con su sombra y su luz. */
const BLOOD = '#862E2E', BLOOD_D = '#561A22', BLOOD_L = '#B5483F'
/** Pino claro de la espada de entrenamiento y arena de la plaza de toros. */
const PINE = '#E6B983', SAND = '#F1D9A8'

/** Espada de entrenamiento de pino, apuntando arriba con el centro del gavilán en (0,0): hoja con vetas y mellas,
 * travesaño atado con soga en cruz, puño envuelto en un trapo rojo con la punta al viento y pomo de nudo. */
function woodenSword(k: Kit) {
  const blade = 'M-4.4 -1V-35.6C-4.4 -40 -2.6 -43.4 0 -45C2.6 -43.4 4.4 -40 4.4 -35.6V-1Z'
  const bladeR = 'M0 -45C2.6 -43.4 4.4 -40 4.4 -35.6V-1H0Z'
  const guard = 'M-15.6 -2.4C-8 -3.6 8 -3.6 15.6 -2.6C16.6 -1.4 16.6 1.4 15.4 2.6C8 1.8 -8 1.8 -15.6 2.4C-16.6 1.2 -16.6 -1.2 -15.6 -2.4Z'
  const grip = 'M-2.9 2.2H2.9L2.6 20.4H-2.6Z'
  const pommel = 'M0 19.8C3.2 19.8 4.8 21.6 4.6 23.8C4.4 26 2.4 27.4 0 27.4C-2.4 27.4 -4.4 26 -4.6 23.8C-4.8 21.6 -3.2 19.8 0 19.8Z'
  const tail = 'M2.4 13.6C6.4 14 9.6 16.6 11 20.6C11.8 23 13.8 24.6 16.6 25C13.4 27 9.4 26 8 23.4C6.6 20.6 4.8 18.4 2.4 17.6Z'
  const wraps = Array.from({ length: 7 }, (_, i) => `<path d="M-3 ${f(3.4 + i * 2.5)}L3 ${f(5.2 + i * 2.5)}" stroke="${BLOOD_D}" stroke-width=".55"/>`).join('')
  const rope = (d: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width="1.5" stroke-linecap="round"/>`
  const twist = (x0: number, y0: number, x1: number, y1: number) =>
    Array.from({ length: 4 }, (_, i) => { const t = (i + 0.5) / 4, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; return `<path d="M${f(x - 0.5)} ${f(y - 0.5)}L${f(x + 0.3)} ${f(y + 0.6)}" stroke="${P.goldD}" stroke-width=".35"/>` }).join('')
  return (
    k.draw([
      { d: tail, fill: BLOOD, inner: k.sh(tail, 0, 0, 1, 1, 0, 0.9, BLOOD_D, 0.45) + hair(4, 15.6, 8, 17.6, 10, 22, 0.4, BLOOD_L) },
      {
        d: blade, fill: PINE,
        inner:
          `<path d="M-5 -46H-1V0H-5Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.9, 0.2)}"/>` + `<path d="${bladeR}" fill="${P.brown}" opacity=".35"/>` + k.sh(bladeR, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.4) +
          hair(-2.4, -2, -3, -20, -1.6, -40, 0.45, P.brownD) + hair(1.4, -3, 2.2, -16, 1.2, -36, 0.4, P.brownD) + hair(-0.4, -8, 0.4, -26, -0.6, -42, 0.35, P.brown) +
          hair(3.2, -6, 3.6, -14, 2.8, -24, 0.35, P.brownD) +
          `<ellipse cx="1.4" cy="-19" rx="1.1" ry="2" fill="${P.brownD}" opacity=".7"/><ellipse cx="1.4" cy="-19" rx="1.9" ry="3.4" fill="none" stroke="${P.brownD}" stroke-width=".35"/>` +
          `<path d="M-4.6 -24.4L-2.8 -23.4L-4.6 -22ZM4.6 -31L3.2 -30.2L4.6 -29.2ZM4.6 -11L3.4 -10.4L4.6 -9.6Z" fill="${P.brownD}"/>`,
      },
      { d: grip, fill: BLOOD, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.9, BLOOD_D, 0.45) + wraps },
      { d: pommel, fill: PINE, line: 0.3, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.95, P.brownD, 0.45) + `<path d="M-2.6 22.4C-1 21.4 1 21.4 2.6 22.4M-2 25.4C-.6 26 .6 26 2 25.4" fill="none" stroke="${P.brownD}" stroke-width=".4"/>` },
      {
        d: guard, fill: PINE,
        inner: k.sh(guard, 0, 0, 0, 1, 0, 0.95, P.brownD, 0.45) + `<path d="M-15 -1.6C-8 -2.4 8 -2.4 15 -1.6" fill="none" stroke="${P.goldL}" stroke-width=".8"/>` +
          hair(-13, 0.6, -10, 0.2, -6.4, 0.6, 0.4, P.brownD) + hair(7, 0.6, 10, 0.2, 13, 0.8, 0.4, P.brownD),
      },
    ], 0.7) +
    `<ellipse cx="-16" cy="0" rx="1" ry="2.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><ellipse cx="16" cy="0" rx="1" ry="2.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>` +
    `<ellipse cx="16" cy="0" rx=".45" ry="1.2" fill="none" stroke="${P.brownD}" stroke-width=".3"/>` +
    rope('M-4.8 -3.4L4.8 3.2') + rope('M4.8 -3.4L-4.8 3.2') + twist(-4.8, -3.4, 4.8, 3.2) + twist(4.8, -3.4, -4.8, 3.2) +
    rope('M-5.4 -3.8C-6.2 -1.4 -6.2 1.4 -5.4 3.6') + rope('M5.4 -3.8C6.2 -1.4 6.2 1.4 5.4 3.6') +
    `<path d="M-1.6 -43C-2.8 -40 -3.4 -37 -3.4 -34" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>`
  )
}

/** Tapa de barril hecha escudo de patio: tablas con vetas, dos travesaños clavados y el aro de fleje. */
function barrelLid(k: Kit, cx: number, cy: number, r: number) {
  const disc = ellipse(cx, cy, r, r)
  const planks = [-2, -1, 0, 1, 2].map((i) => cx + i * r * 0.36)
  const batten = (y: number) => roundRect(f(cx - r * 0.86), f(y - 2.6), f(cx + r * 0.86), f(y + 2.6), 0.8)
  const nail = (x: number, y: number) => `<circle cx="${f(x)}" cy="${f(y)}" r=".75" fill="${P.mid}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x - 0.25)}" cy="${f(y - 0.25)}" r=".25" fill="${P.sky1}"/>`
  return (
    k.draw([{
      d: disc, fill: PINE,
      inner:
        `<path d="${disc}" fill="${P.brown}" opacity=".3"/>` + k.sh(disc, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + `<path d="${disc}" fill="${k.rad(P.goldL, 0.3, 0.3, 0.6, 0.7, 0)}"/>` +
        planks.slice(1).map((x) => `<path d="M${f(x - r * 0.18)} ${f(cy - r)}V${f(cy + r)}" stroke="${P.brownD}" stroke-width=".6"/>`).join('') +
        planks.map((x, i) => hair(x - 2, cy - r * 0.8, x - 1 + (i % 2), cy, x - 2.4, cy + r * 0.8, 0.35, P.brownD, 0.8)).join(''),
    }], 0.7) +
    k.draw([batten(cy - r * 0.42), batten(cy + r * 0.42)].map((d) => ({ d, fill: P.brown, inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.45) + `<path d="${d}" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0)}"/>` })), 0.5) +
    [cy - r * 0.42, cy + r * 0.42].map((y) => nail(cx - r * 0.68, y) + nail(cx + r * 0.68, y) + nail(cx, y)).join('') +
    `<circle cx="${cx}" cy="${cy}" r="${f(r - 1.2)}" fill="none" stroke="${P.ink}" stroke-width="3.4"/><circle cx="${cx}" cy="${cy}" r="${f(r - 1.2)}" fill="none" stroke="${P.blue}" stroke-width="2"/>` +
    `<path d="M${f(cx - r * 0.82)} ${f(cy - r * 0.5)}A${f(r - 1.2)} ${f(r - 1.2)} 0 0 1 ${f(cx - r * 0.3)} ${f(cy - r * 0.9)}" fill="none" stroke="${P.sky1}" stroke-width=".8" stroke-linecap="round"/>` +
    Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + 0.3; return nail(cx + Math.cos(a) * (r - 1.2), cy + Math.sin(a) * (r - 1.2)) }).join('')
  )
}

/** Yelmo de perfil mirando a la izquierda, con el centro de la calota en (0,0): calota de acero grabada con
 * volutas, visera de bronce con remaches, carrillera colgada de su bisagra, cubrenuca y cimera de crin roja. */
const HELMET_SHELL = 'M-17.6 1.4C-17.6 -10 -9.4 -18.6 1 -18.6C11 -18.6 17.4 -11 17.4 -2.4C17.4 1.6 18.6 5 21.2 7.6C22.8 9.2 24.8 9.8 26.4 9.8C24 12.4 18.4 13 14 10.8C11 9.4 9.8 6.6 9.6 3.6H-14.4C-16.4 3.6 -17.6 2.8 -17.6 1.4Z'
const HELMET_CHEEK = 'M-11.6 3.4H5.6C7.4 8.4 6.6 15 3.4 20C1.6 22.8 -1.8 23.2 -3.6 20.8C-5 18.6 -5.6 15.4 -7.2 12.8C-8.4 11.2 -10.6 11 -11.2 9.6C-12 7.6 -12.2 5.4 -11.6 3.4Z'
function helmet(k: Kit) {
  const shell = HELMET_SHELL, cheek = HELMET_CHEEK
  const hollow = 'M-12 2H11L10 12H-6Z'
  const visor = 'M-20.4 2.6C-14 -1 -2 -1.6 10.4 -.2L10.2 3.8C-2 2.6 -12 3 -18.4 5.6C-20.8 6.4 -21.8 3.6 -20.4 2.6Z'
  const crest = 'M-10 -17.4C-15.4 -21.4 -16.6 -27.6 -12.4 -31.8C-7 -37 4 -38 12.4 -34.6C20.6 -31.2 25.6 -24 26 -15C26.2 -9.6 24.6 -5 21.6 -1.4C21.4 -7.6 19.4 -13.2 15.6 -16.4C9.6 -19.8 0 -19.8 -10 -17.4Z'
  const holder = 'M-6.6 -18.2C-2 -19.8 4 -19.8 9.6 -18.4L9.4 -21.2C4 -22.6 -2 -22.6 -6.4 -21Z'
  const locks = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14, a = Math.PI * (1.04 + t * 0.94), r0 = 7, r1 = 16.4 + Math.sin(t * Math.PI) * 3
    const x0 = 5 + Math.cos(a) * r0, y0 = -14 + Math.sin(a) * r0 * 0.9, x1 = 5 + Math.cos(a) * r1, y1 = -14 + Math.sin(a) * r1 * 0.98
    return hair(x0, y0, (x0 + x1) / 2 + 2.4, (y0 + y1) / 2 - 1, x1, y1, i % 2 ? 0.55 : 0.75, i % 3 ? P.wine : BLOOD_D)
  }).join('')
  const rivets = Array.from({ length: 7 }, (_, i) => { const x = -16 + i * 4.2, y = 2.4 - (1 - Math.pow((x + 4) / 16, 2)) * 1.6; return `<circle cx="${f(x)}" cy="${f(y)}" r=".62" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>` }).join('')
  return (
    `<path d="${hollow}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
    k.draw([{
      d: crest, fill: BLOOD,
      inner: k.sh(crest, 0, 0, 1, 1, 0, 0.95, BLOOD_D, 0.5) + `<path d="M-18 -40H6V-22C0 -24 -10 -22 -18 -16Z" fill="${k.lin(BLOOD_L, 0, 0, 0, 1, 0.9, 0)}"/>` + locks +
        hair(-12, -29, -4, -36.6, 10, -35.4, 0.6, '#E0897A', 0.8) + hair(-13, -24, -10, -30, -2, -34, 0.45, '#E0897A', 0.7) + hair(14, -33, 21, -28, 23.6, -18, 0.45, '#E0897A', 0.5),
    }], 0.7) +
    k.draw([
      { d: holder, fill: P.gold, inner: k.sh(holder, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
      {
        d: shell, fill: P.sky1,
        inner:
          k.sh('M2 -22C10 -16 14 -6 13 12H30V-22Z', 0, 0, 1, 0, 0, 0.95, P.mid, 0.45) + k.sh(shell, 0, 0, 0, 1, 0.3, 0.9, P.blue, 0.4) +
          `<path d="M-14.6 -8C-11 -14.6 -5 -17.4 1 -17.4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` +
          `<path d="M-6 -9C-2 -13.4 4 -13.4 7 -9.4C9 -6.4 7 -3.4 4 -4.2C2 -4.8 2 -7.2 4 -7.6" fill="none" stroke="${P.goldD}" stroke-width=".55"/>` +
          `<path d="M-12 -4C-9 -7.6 -4.6 -8 -2.4 -6M9.4 -4.6C12.4 -6.6 15.4 -4.6 16 -1.6" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` +
          `<path d="M12.6 5.6C16 7.8 20 9.4 23.4 9.8" fill="none" stroke="${P.mid}" stroke-width=".45"/>`,
      },
      {
        d: cheek, fill: P.sky1,
        inner: k.sh(cheek, 0, 0, 1, 1, 0, 0.95, P.mid, 0.45) + `<path d="M-12 3H-4V22H-12Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          `<path d="M4.2 6.6C5.4 10.6 4.6 15.4 2 19M-8.6 6.6C-7 8.6 -5 9.4 -2.6 9.4" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
          `<circle cx="-.6" cy="13.4" r=".7" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/><circle cx="-.4" cy="18" r=".7" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`,
      },
      { d: visor, fill: P.gold, inner: k.sh(visor, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-19.4 2.8C-13 -.2 -2 -.6 10 .6" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` },
    ], 0.7) +
    `<circle cx="2.4" cy="5.2" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
    rivets
  )
}

/** Rosa roja arrojada a la arena, con el centro de la flor en (0,0) y el tallo hacia la derecha. */
function rose(k: Kit) {
  const bloom = 'M0 -4.4C3.2 -4.8 5 -2.4 4.6 .6C4.2 3.2 1.8 4.6 -.6 4.4C-3.2 4.2 -5 2.2 -4.6 -.6C-4.2 -3.2 -2.2 -4.2 0 -4.4Z'
  const leaf = 'M8 1C9.6 -1.4 12.6 -1.8 14 -.6C12.6 1.6 10 2.2 8 1Z'
  return (
    `<path d="M3.6 1.4C8 2 12 3.6 17 3.2" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M3.6 1.4C8 2 12 3.6 17 3.2" fill="none" stroke="${P.green}" stroke-width=".7" stroke-linecap="round"/>` +
    k.draw([{ d: leaf, fill: P.green, inner: k.sh(leaf, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.4) + `<path d="M8.6 .8L13.2 -.4" stroke="${P.greenD}" stroke-width=".3"/>` }], 0.35) +
    k.draw([{ d: bloom, fill: P.red, inner: k.sh(bloom, 0, 0, 1, 1, 0, 0.9, P.wine, 0.45) }], 0.45) +
    `<path d="M-2.6 -1.2C-1.6 -3 1.4 -3.2 2.4 -1.2C3 .4 1.6 2 0 1.6C-1.2 1.4 -1.4 0 -.4 -.4M-3.6 1.4C-2.4 3.4 1.6 3.8 3.4 1.6" fill="none" stroke="${P.wine}" stroke-width=".5" stroke-linecap="round"/>` +
    `<path d="M-2.6 -2.6C-1.6 -3.6 0 -3.8 1 -3.4" fill="none" stroke="#F4A79C" stroke-width=".5" stroke-linecap="round"/>` +
    `<path d="M3.4 2.4L5.6 1.2L5 3.4Z" fill="${P.greenD}" stroke="${P.ink}" stroke-width=".25"/>`
  )
}

/** Gota de sangre con la punta arriba y el centro de la panza en (0,0). */
const DROP = 'M0 -18C2 -12 10 -5 10 3.4C10 9.6 5.6 14 0 14C-5.6 14 -10 9.6 -10 3.4C-10 -5 -2 -12 0 -18Z'

/** Dado de veinte caras visto de frente (hexágono con la cara del 1 al centro), centrado en (0,0) con radio R. */
function d20(k: Kit, R: number) {
  const P6 = Array.from({ length: 6 }, (_, i) => { const a = ((-90 + i * 60) * Math.PI) / 180; return [R * Math.cos(a), R * Math.sin(a)] })
  const ri = R * 0.56
  const T3 = [-90, 30, 150].map((d) => { const a = (d * Math.PI) / 180; return [ri * Math.cos(a), ri * Math.sin(a) + R * 0.04] })
  const [A, B, C] = T3, [V0, V1, V2, V3, V4, V5] = P6
  const pt = (p: number[]) => `${f(p[0])} ${f(p[1])}`
  const tri = (a: number[], b: number[], c: number[]) => `M${pt(a)}L${pt(b)}L${pt(c)}Z`
  const out = `M${P6.map(pt).join('L')}Z`
  const faces: [string, string, number][] = [
    [tri(A, V5, V0), P.white, 0], [tri(A, V0, V1), P.white, 0.1], [tri(C, A, V5), P.sky1, 0.2],
    [tri(A, B, V1), P.sky1, 0.3], [tri(B, V1, V2), P.sky, 0.55], [tri(B, V2, V3), P.sky, 0.7],
    [tri(B, C, V3), P.sky1, 0.5], [tri(C, V3, V4), P.sky1, 0.5], [tri(C, V4, V5), P.white, 0.3],
  ]
  const center = tri(A, B, C)
  return (
    k.draw([{
      d: out, fill: P.white,
      inner: faces.map(([d, c, s]) => `<path d="${d}" fill="${c}"/>` + (s ? k.sh(d, 0, 0, 1, 1, s * 0.4, s, P.blue, 0.35) : '')).join('') +
        `<path d="${center}" fill="${P.white}"/>` + k.sh(center, 0, 0, 1, 1, 0, 0.3, P.sky2, 0.3) +
        `<path d="M${pt(A)}L${pt(V0)}M${pt(A)}L${pt(V1)}M${pt(A)}L${pt(V5)}M${pt(B)}L${pt(V1)}M${pt(B)}L${pt(V2)}M${pt(B)}L${pt(V3)}M${pt(C)}L${pt(V3)}M${pt(C)}L${pt(V4)}M${pt(C)}L${pt(V5)}${center}" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linejoin="round"/>` +
        `<path d="M${pt(V5)}L${pt(V0)}L${pt(A)}" fill="none" stroke="#fff" stroke-width=".9" stroke-linejoin="round" opacity=".9"/>`,
    }], 0.7) +
    `<text x="0" y="${f(R * 0.27)}" font-family="Georgia, serif" font-weight="700" font-size="${f(R * 0.6)}" fill="${BLOOD}" text-anchor="middle">1</text>` +
    `<text x="${f(R * 0.5)}" y="${f(-R * 0.36)}" font-family="Georgia, serif" font-weight="700" font-size="${f(R * 0.2)}" fill="${P.mid}" text-anchor="middle" transform="rotate(30 ${f(R * 0.5)} ${f(-R * 0.42)})" opacity=".8">19</text>` +
    `<text x="${f(-R * 0.5)}" y="${f(-R * 0.36)}" font-family="Georgia, serif" font-weight="700" font-size="${f(R * 0.2)}" fill="${P.mid}" text-anchor="middle" transform="rotate(-30 ${f(-R * 0.5)} ${f(-R * 0.42)})" opacity=".8">7</text>` +
    `<text x="0" y="${f(R * 0.8)}" font-family="Georgia, serif" font-weight="700" font-size="${f(R * 0.2)}" fill="${P.mid}" text-anchor="middle" opacity=".8">13</text>`
  )
}

/** Mechón en S: cinta sobre una curva cúbica que se afina desde `w` hasta la punta. */
function tuft(x0: number, y0: number, c1x: number, c1y: number, c2x: number, c2y: number, x1: number, y1: number, w: number) {
  const N = 16, L: string[] = [], R: string[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = 1 - t
    const x = a * a * a * x0 + 3 * a * a * t * c1x + 3 * a * t * t * c2x + t * t * t * x1
    const y = a * a * a * y0 + 3 * a * a * t * c1y + 3 * a * t * t * c2y + t * t * t * y1
    const dx = 3 * a * a * (c1x - x0) + 6 * a * t * (c2x - c1x) + 3 * t * t * (x1 - c2x)
    const dy = 3 * a * a * (c1y - y0) + 6 * a * t * (c2y - c1y) + 3 * t * t * (y1 - c2y)
    const len = Math.hypot(dx, dy) || 1, ww = (w / 2) * Math.pow(1 - t, 0.85) + 0.15
    L.push(`${f(x - (dy / len) * ww)} ${f(y + (dx / len) * ww)}`)
    R.push(`${f(x + (dy / len) * ww)} ${f(y - (dx / len) * ww)}`)
  }
  return `M${L.join('L')}L${R.reverse().join('L')}Z`
}

/** Cabeza de león de perfil mirando a la izquierda, rugiendo, con la melena de mechones en S que se van hacia
 * atrás como llamas y terminan en rulo; centro de la melena en (4,0). */
function lionHead(k: Kit) {
  const C = { x: 4, y: 0 }
  const mane = (deg: number, r0: number, len: number, w: number) => {
    const a = (deg * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), sg = Math.sin(a) < 0 ? 1 : -1, bx = -uy * sg, by = ux * sg
    const x0 = C.x + ux * r0, y0 = C.y + uy * r0
    const x1 = x0 + ux * len + bx * len * 0.42, y1 = y0 + uy * len + by * len * 0.42
    const d = tuft(x0, y0, x0 + ux * len * 0.4 - bx * 2, y0 + uy * len * 0.4 - by * 2, x0 + ux * len * 0.75 + bx * 3.4, y0 + uy * len * 0.75 + by * 3.4, x1, y1, w)
    const curl = `M${f(x1)} ${f(y1)}c${f(bx * 1.8 - ux * 0.4)} ${f(by * 1.8 - uy * 0.4)} ${f(bx * 1.6 - ux * 2.4)} ${f(by * 1.6 - uy * 2.4)} ${f(-ux * 2.2 + bx * 0.2)} ${f(-uy * 2.2 + by * 0.2)}`
    return { d, curl, mid: [x0 + ux * len * 0.5, y0 + uy * len * 0.5], ux, uy, bx, by }
  }
  const outer = [-168, -146, -122, -98, -74, -50, -26, -2, 22, 46, 70, 94, 118, 142].map((d, i) => mane(d, 9, 15.6 - Math.abs(Math.abs(d) - 70) / 40 + (i % 2) * 1.4, 9.4))
  const inner = [-156, -132, -108, -84, -60, -36, -12, 12, 36, 60, 84, 108, 130].map((d, i) => mane(d, 6.4, 10.4 + (i % 2) * 1.2, 7))
  const base = ellipse(C.x + 1, C.y, 16, 17)
  const face =
    'M-19.8 -3.2C-19.8 -5.2 -18.6 -6.6 -17 -6.8C-13.6 -8.6 -9.6 -10.8 -5.4 -12.2C-1.4 -13.4 3.4 -13 6.6 -10.6C8.6 -6 8.6 2.4 6 8C3 11.6 -2 13.6 -6.4 13.8' +
    'C-10 14 -13.4 13.2 -15.2 11.6C-16 10.8 -15.8 9.6 -15.2 9.2L-8 5.6L-17.4 2.8C-18.8 2.4 -19.8 1 -19.8 -3.2Z'
  const mouth = 'M-17.8 2.4L-7.4 5.6L-15.6 9.6C-17.2 7.6 -18 5 -17.8 2.4Z'
  const nose = 'M-20.2 -3.8C-20.4 -5.6 -19.2 -6.8 -17.4 -6.6C-16.6 -5 -17 -3.2 -18.6 -2.2C-19.4 -2 -20 -2.6 -20.2 -3.8Z'
  /** Gorguera: mechones cortos que tapan el borde de atrás de la cara y la barba bajo la quijada. */
  const ruff = ([[3.6, -10.6, -40], [6.4, -5, -14], [6.8, 1.4, 10], [4.8, 7.2, 34], [.4, 11.6, 62], [-5.6, 13, 84]] as const).map(([x0, y0, deg]) => {
    const a = (deg * Math.PI) / 180, len = 7.4, x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len
    return { d: tuft(x0, y0, x0 + Math.cos(a) * 2.6 - Math.sin(a) * 1.6, y0 + Math.sin(a) * 2.6 + Math.cos(a) * 1.6, x0 + Math.cos(a) * 5 + Math.sin(a) * 1.4, y0 + Math.sin(a) * 5 - Math.cos(a) * 1.4, x1, y1, 4.4), x0, y0, x1, y1 }
  })
  type T = ReturnType<typeof mane>
  const layer = (ls: T[], fill: string, dark: string, curlC: string, lit: boolean) =>
    `<g fill="${P.ink}">${ls.map((l) => `<path d="${l.d}" transform="translate(.5 .7)"/>`).join('')}</g>` +
    ls.map((l) => `<path d="${l.d}" fill="${fill}" stroke="${P.ink}" stroke-width=".55"/>`).join('') +
    ls.map((l) => k.clip(l.d, k.sh(l.d, 0, 0, 1, 1, 0, 0.9, dark, 0.45) + (lit ? `<path d="${l.d}" fill="${k.lin(P.goldL, 0, 0, 1, 1, 0.5, 0)}"/>` : ''))).join('') +
    ls.map((l) => `<path d="${l.curl}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${l.curl}" fill="none" stroke="${fill}" stroke-width=".6" stroke-linecap="round"/>`).join('') +
    ls.map((l) => { const [mx, my] = l.mid; return hair(mx - l.ux * 3, my - l.uy * 3, mx + l.bx * 0.8, my + l.by * 0.8, mx + l.ux * 4 + l.bx * 1.6, my + l.uy * 4 + l.by * 1.6, 0.4, curlC) }).join('')
  return (
    k.draw([{ d: base, fill: P.brown, inner: k.sh(base, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) }], 0.5) +
    layer(outer, P.brown, P.brownD, P.brownD, true) +
    layer(inner, P.goldD, P.brownD, P.brownD, true) +
    `<path d="${mouth}" fill="${BLOOD_D}" stroke="${P.ink}" stroke-width=".4"/><path d="M-16.4 5.4C-14 5.6 -11.6 6 -9.6 6.4C-11.6 7.6 -13.6 8.4 -15.4 8.6Z" fill="${P.red}" opacity=".7"/>` +
    k.draw([
      {
        d: face, fill: P.gold,
        inner:
          k.sh('M-2 -16C4 -8 4 4 -2 15H10V-16Z', 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M-21 -16H2V-7C-5 -9 -12 -7 -21 -3Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.85, 0)}"/>` +
          `<path d="M-17 3.4C-13 6 -9.4 7 -6 6.8C-9 10 -13.4 12 -15.6 11.4Z" fill="${P.goldD}" opacity=".45"/>` +
          `<path d="${ellipse(-13.2, -0.6, 4.6, 3)}" fill="${P.goldL}" opacity=".75"/>` +
          hair(-16.4, -5.6, -12, -8.4, -7, -10.4, 0.45, P.goldD) + hair(-15.4, -2.6, -13.4, -.4, -13.4, 2.4, 0.45, P.goldD) + hair(-12.6, -3.2, -8.6, -1.6, -4, -2.4, 0.5, P.goldD) + hair(-3, 3.4, 0.4, 1.4, 4, 3, 0.55, P.goldD) +
          hair(-7, 10.4, -2.6, 10.8, 1.6, 8.6, 0.45, P.goldD) + hair(-1.4, -10, 1.4, -6, 1.4, -1.4, 0.45, P.goldD) + hair(-10.6, -8, -9, -9.4, -7, -9.8, 0.35, P.goldD) +
          [[-14.2, -1], [-12.6, .2], [-14.8, 1], [-12, -1.6], [-11, -.2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".38" fill="${P.brownD}"/>`).join(''),
      },
    ], 0.6) +
    ruff.map((r) => `<path d="${r.d}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` + k.clip(r.d, k.sh(r.d, 0, 0, 1, 1, 0.2, 0.9, P.goldD, 0.45)) + hair(r.x0, r.y0, r.x0 + 2, r.y0 + 0.4, r.x1, r.y1, 0.35, P.brownD)).join('') +
    `<path d="${nose}" fill="${BLOOD_D}" stroke="${P.ink}" stroke-width=".35"/><path d="M-19.4 -5.2C-18.8 -5.8 -18 -5.8 -17.6 -5.4" fill="none" stroke="${BLOOD_L}" stroke-width=".4"/>` +
    `<path d="M-17 2.8L-15.8 6.6L-14.8 3.4ZM-11.6 4.4L-10.8 6.4L-10 4.8ZM-14.6 9.6L-13.8 6.6L-12.8 8.8Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
    `<path d="M-12 -7.8C-9.6 -9.8 -6 -10.2 -3.6 -8.8" fill="none" stroke="${P.brownD}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="M-10.8 -6.2C-9.4 -8 -6.6 -8.2 -5 -6.8C-6.4 -5.2 -9.2 -5 -10.8 -6.2Z" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".7"/><circle cx="-7.8" cy="-6.7" r=".9" fill="${P.ink}"/><circle cx="-8.1" cy="-7" r=".26" fill="#fff"/>`
  )
}

/** Pluma de ave larga apuntando arriba desde (0,0). */
const FEATHER = (len: number, w: number) =>
  `M0 0C${f(w)} ${f(-len * 0.22)} ${f(w * 0.95)} ${f(-len * 0.78)} ${f(w * 0.2)} ${f(-len)}C${f(-w * 0.5)} ${f(-len * 0.82)} ${f(-w * 0.75)} ${f(-len * 0.3)} 0 0Z`

/** Ala de fénix en alto (la derecha; la izquierda es la misma espejada), con el hombro en (0,0): de la muñeca al
 * hombro salen en abanico tres filas de plumas, las remeras rojas con la punta dorada, las segundas naranjas y las
 * cobertoras doradas, y por encima el filo del ala. */
function phoenixWing(k: Kit) {
  const W = { x: 14, y: -20 }, S = { x: 2, y: 2 }
  const at = (t: number) => ({ x: W.x + (S.x - W.x) * t, y: W.y + (S.y - W.y) * t, a: 6 + t * 102, len: 26 - t * 11 })
  const feather = (x: number, y: number, a: number, len: number, w: number, fill: string, dark: string, tip: string, tipTo: number) => {
    const d = FEATHER(len, w)
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">` +
      k.draw([{ d, fill, inner: `<path d="M-6 ${f(-len - 1)}H6V${f(-len * tipTo)}H-6Z" fill="${k.lin(tip, 0, 0, 0, 1, 1, 0)}"/>` + k.sh(d, 0, 0, 1, 0, 0, 0.9, dark, 0.45) }], 0.42) +
      hair(0, -1, w * 0.15, -len * 0.5, w * 0.2, -len * 0.95, 0.4, P.goldL) +
      (len > 12 ? hair(w * 0.3, -len * 0.25, w * 0.75, -len * 0.42, w * 0.62, -len * 0.6, 0.3, dark, 0.8) + hair(-w * 0.2, -len * 0.3, -w * 0.5, -len * 0.48, -w * 0.3, -len * 0.66, 0.28, dark, 0.6) : '') + `</g>`
  }
  const row = (n: number, t0: number, t1: number, dx: number, dy: number, da: number, k2: number, w: number, fill: string, dark: string, tip: string, tipTo: number) =>
    Array.from({ length: n }, (_, i) => at(t0 + ((t1 - t0) * i) / (n - 1))).reverse().map((p) => feather(p.x + dx, p.y + dy, p.a + da, p.len * k2, w, fill, dark, tip, tipTo)).join('')
  const edge = taper(S.x - 1, S.y + 1, 6, -8, W.x + 1, W.y - 1, 3.6, 2)
  return (
    row(9, 0, 1, 0, 0, 0, 1, 4.4, P.red, BLOOD, P.gold, 0.42) +
    row(8, 0.02, 0.95, -2.2, 1.4, -4, 0.66, 4.2, P.goldD, P.red, P.goldL, 0.5) +
    row(7, 0.04, 0.9, -4, 2.6, -8, 0.38, 3.8, P.gold, P.goldD, P.goldL, 0.6) +
    k.draw([{ d: edge, fill: P.gold, inner: k.sh(edge, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.4) +
    [0.2, 0.4, 0.6, 0.8].map((t) => { const x = S.x - 1 + (W.x + 2 - S.x) * t, y = S.y + 1 + (W.y - 2 - S.y) * t; return `<circle cx="${f(x)}" cy="${f(y)}" r=".5" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
  )
}

/** Fénix con las alas en alto, la cabeza de perfil a la izquierda con su penacho y la cola que cae en el fuego.
 * Centro del pecho en (0,0). */
function phoenix(k: Kit) {
  const body = 'M0 -12.6C5.6 -10.6 7.6 -3 7 4.2C6.4 9.6 3.8 13.4 0 15.6C-3.8 13.4 -6.4 9.6 -7 4.2C-7.6 -3 -5.6 -10.6 0 -12.6Z'
  const head = 'M-2.4 -11C-4.4 -14 -6.2 -17.6 -5.8 -21.2C-5.4 -24.8 -2.4 -27 .8 -26.6C4.2 -26.2 6 -23.2 5.4 -19.6C4.8 -16.6 3.6 -14 3.8 -10.6Z'
  const beak = 'M-5.4 -23.4C-8.4 -24 -11.4 -23 -12.8 -20.6C-13.2 -19.8 -12.8 -19.2 -12 -19.6C-10.4 -20.4 -8.4 -20.4 -5.8 -19.8Z'
  const plume = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) =>
    k.draw([{ d: taper(x0, y0, cx, cy, x1, y1, 1.8, 0.6), fill: P.gold, inner: hair(x0, y0, cx, cy, x1, y1, 0.4, P.red) }], 0.35) +
    `<path d="${ellipse(x1, y1, 1.5, 1.5)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x1 - 0.4)}" cy="${f(y1 - 0.4)}" r=".45" fill="${P.goldL}"/>`
  const tail = (ang: number, len: number, fill: string, dark: string, tip: string) => {
    const d = FEATHER(len, 5.2)
    return `<g transform="translate(0 11) rotate(${180 + ang})">` +
      k.draw([{ d, fill, inner: `<path d="M-7 ${f(-len - 1)}H7V${f(-len * 0.55)}H-7Z" fill="${k.lin(tip, 0, 0, 0, 1, 1, 0)}"/>` + k.sh(d, 0, 0, 1, 0, 0, 0.9, dark, 0.45) }], 0.5) +
      hair(0, -1, 0.6, -len * 0.5, 1, -len * 0.96, 0.45, P.goldL) +
      `<path d="M-1.6 ${f(-len * 0.7)}L.6 ${f(-len * 0.8)}L2.4 ${f(-len * 0.7)}M-1.2 ${f(-len * 0.6)}L.6 ${f(-len * 0.7)}L2.2 ${f(-len * 0.6)}" fill="none" stroke="${dark}" stroke-width=".45"/>` + `</g>`
  }
  return (
    tail(-44, 24, P.red, BLOOD, P.gold) + tail(44, 24, P.red, BLOOD, P.gold) + tail(-22, 29, P.goldD, P.red, P.goldL) + tail(22, 29, P.goldD, P.red, P.goldL) + tail(0, 32, P.red, BLOOD, P.gold) +
    `<g transform="translate(5 -4)">` + phoenixWing(k) + `</g>` +
    `<g transform="translate(-5 -4) scale(-1 1)">` + phoenixWing(k) + `</g>` +
    plume(3, -24.6, 7, -30, 13.6, -31) + plume(4.4, -22, 9, -25, 13.4, -23.4) + plume(1, -26, 2, -32, 7, -36) +
    k.draw([
      {
        d: body, fill: P.gold,
        inner: k.sh(body, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-8 -14H-1V18H-8Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` +
          [-7, -3, 1, 5, 9].map((y, i) => `<path d="M${f(-4.6 + i * 0.4)} ${y}q${f(2.3 - i * 0.2)} 2.6 ${f(4.6 - i * 0.4)} 0q${f(2.3 - i * 0.2)} 2.6 ${f(4.6 - i * 0.4)} 0" fill="none" stroke="${P.goldD}" stroke-width=".45"/>`).join(''),
      },
      { d: head, fill: P.gold, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-7 -27H.6V-11H-7Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.7, 0)}"/>` + hair(1.4, -13, 2.8, -17, 2, -21.4, 0.45, P.goldD) },
      { d: beak, fill: P.goldL, inner: k.sh(beak, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) },
    ], 0.6) +
    `<path d="M-4.4 -21.8C-3.4 -23 -1.6 -23 -.8 -21.8C-1.6 -20.8 -3.4 -20.8 -4.4 -21.8Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-2.6" cy="-21.8" r=".55" fill="${P.ink}"/><circle cx="-2.9" cy="-22.1" r=".18" fill="#fff"/>`
  )
}

/** Espada de monumento clavada de punta, con el centro del gavilán en (0,0): hoja con vaceo, gavilán dorado de
 * volutas con un rubí, puño rojo encordado de oro y pomo facetado arriba. */
function monumentSword(k: Kit, L: number) {
  const blade = `M-4.4 0H4.4V${L}H-4.4Z`
  const guard = 'M0 -3.6C7 -3.6 13 -4.6 17.6 -6.6C20.6 -8 23.4 -6.4 22.6 -3.6C22 -1.4 19.4 -1 18.2 -2.4C14 0 8 1.6 0 1.6C-8 1.6 -14 0 -18.2 -2.4C-19.4 -1 -22 -1.4 -22.6 -3.6C-23.4 -6.4 -20.6 -8 -17.6 -6.6C-13 -4.6 -7 -3.6 0 -3.6Z'
  const grip = 'M-2.8 -4H2.8L2.4 -18H-2.4Z'
  const pommel = 'M0 -25.4C3.4 -25.4 5.4 -23.6 5.4 -21.4C5.4 -19 3.4 -17.4 0 -17.4C-3.4 -17.4 -5.4 -19 -5.4 -21.4C-5.4 -23.6 -3.4 -25.4 0 -25.4Z'
  const wire = Array.from({ length: 5 }, (_, i) => `<path d="M-2.8 ${f(-6 - i * 2.6)}L2.8 ${f(-4.4 - i * 2.6)}" stroke="${P.ink}" stroke-width=".9"/><path d="M-2.8 ${f(-6 - i * 2.6)}L2.8 ${f(-4.4 - i * 2.6)}" stroke="${P.gold}" stroke-width=".45"/>`).join('')
  return (
    k.draw([
      { d: blade, fill: P.sky1, inner: `<path d="M0 0H4.4V${L}H0Z" fill="${P.sky}"/>` + k.sh(`M0 0H4.4V${L}H0Z`, 0, 0, 1, 0, 0.2, 0.9, P.blue, 0.4) + `<path d="M-.8 2H.8V${L}H-.8Z" fill="${P.mid}" opacity=".5"/>` + hair(-3, 3, -3.2, L / 2, -3, L, 0.6, '#fff') },
      { d: grip, fill: BLOOD, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.9, BLOOD_D, 0.45) },
      { d: pommel, fill: P.gold, line: 0.3, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M0 -25.4V-17.4M-4 -24C-2 -22 -2 -20.6 -4 -18.8M4 -24C2 -22 2 -20.6 4 -18.8" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` },
      { d: guard, fill: P.gold, line: 0.3, inner: k.sh(guard, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-20 -5C-10 -2.6 10 -2.6 20 -5" fill="none" stroke="${P.goldL}" stroke-width=".8"/>` },
    ], 0.75) +
    wire +
    `<circle cx="0" cy="-1" r="3.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="0" cy="-1" r="2" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-.6" cy="-1.6" r=".55" fill="#fff"/>` +
    Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${f(Math.cos(a) * 2.7)}" cy="${f(-1 + Math.sin(a) * 2.7)}" r=".32" fill="${P.goldL}"/>` }).join('') +
    `<circle cx="0" cy="-21.4" r="1.7" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-.5" cy="-21.9" r=".45" fill="#fff"/>` +
    [-1, 1].map((s) => `<g transform="scale(${s} 1)"><path d="M14 -2.6C17 .4 16 4 13 4C11 4 10.6 1.6 12.4 1.2" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M14 -2.6C17 .4 16 4 13 4C11 4 10.6 1.6 12.4 1.2" fill="none" stroke="${P.gold}" stroke-width=".9"/></g>`).join('')
  )
}

/** Corona de laurel colgada, vista de frente un poco desde abajo, centrada en (0,0). */
function wreath(rx: number, ry: number, n: number) {
  const leaf = 'M0 0C2 -2.2 5.8 -2.2 8 0C5.8 2.2 2 2.2 0 0Z'
  let back = '', front = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry
    const rot = (a * 180) / Math.PI + 90 + 34
    const g = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(1.3)"><path d="${leaf}" fill="${i % 2 ? P.gold : P.goldL}" stroke="${P.ink}" stroke-width=".4"/><path d="M1 0H7" stroke="${P.goldD}" stroke-width=".3"/></g>`
    if (Math.sin(a) < -0.1) back += g
    else front += g
  }
  const ring = `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="${P.ink}" stroke-width="1.8"/><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="${P.goldD}" stroke-width=".8"/>`
  return { back: ring + back, front }
}

export const TCG_FLESHANDBLOOD_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Héroe de Rathe ──────────────────────────────────────────────────

  // Tres ganadas: entrenás en el patio. La espada de pino atada con soga, sobre una tapa de barril hecha escudo.
  'Espada de madera': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(56, 56, 14, 42, 24, false) +
      k.cast([ellipse(50, 56, 21, 21)], 2.2, 2) +
      barrelLid(k, 50, 56, 21) +
      `<g transform="translate(62 67) rotate(32) scale(.9)">` + k.cast(['M-4.4 -1V-35.6C-4.4 -40 -2.6 -43.4 0 -45C2.6 -43.4 4.4 -40 4.4 -35.6V-1Z', 'M-2.9 2.2H2.9L2.6 20.4H-2.6Z'], 2.4, 1.2) + woodenSword(k) + `</g>` +
      sparkle(86, 46, 2) + sparkle(30, 84, 1.6) +
      k.defs()
    )
  },

  // Quince ganadas: la arena corea tu nombre. El yelmo de cimera roja sobre la arena, las rosas que tiró el público.
  'Arena de Rathe': (u) => {
    const k = kit(u)
    const yTop = (x: number) => { const t = (x - 18) / 84; return 72 - 24 * t + 24 * t * t }
    const wall = 'M16 72.6Q60 60 104 72.6V87Q60 77 16 87Z'
    const arches = Array.from({ length: 11 }, (_, i) => {
      const x = 21 + i * 7.8, y = yTop(x) + 3.4
      return `<path d="M${f(x - 2.4)} ${f(y + 9)}V${f(y + 2.4)}A2.4 2.4 0 0 1 ${f(x + 2.4)} ${f(y + 2.4)}V${f(y + 9)}Z" fill="${P.blue}"/>` + k.sh(`M${f(x - 2.4)} ${f(y)}H${f(x + 2.4)}V${f(y + 9)}H${f(x - 2.4)}Z`, 0, 0, 0, 1, 0.9, 0.2, P.mid, 0.4)
    }).join('')
    const sand = 'M0 84Q60 75 120 84V130H0Z'
    return (
      k.day() +
      k.sun(58, 46, 13, 44, 32, false) +
      k.draw([{ d: wall, fill: P.sky1, inner: arches + k.sh(wall, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + `<path d="M16 75.6Q60 63 104 75.6" fill="none" stroke="${P.blue}" stroke-width=".5"/>` }], 0.5) +
      [[26, 67.6], [94, 67.6]].map(([x, y]) => `<path d="M${x} ${y}V${y - 9}" stroke="${P.ink}" stroke-width=".7"/><path d="M${x} ${y - 9}L${x + (x < 60 ? 6 : -6)} ${y - 7.4}L${x} ${y - 5.6}Z" fill="${BLOOD}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      `<path d="${sand}" fill="${SAND}"/>` + k.shade(sand, k.lin(P.goldD, 0, 0, 0, 1, 0.15, 0.6), P.goldD, 0.3) +
      hair(22, 92, 30, 90, 38, 92, 0.4, P.goldD) + hair(84, 94, 92, 92, 100, 94, 0.4, P.goldD) +
      k.floor(61, 86, 22, 3, P.brownD) +
      `<g transform="translate(58 63)">` + k.cast([HELMET_SHELL, HELMET_CHEEK], 2, 1.6, P.mid) + helmet(k) + `</g>` +
      `<g transform="translate(37.4 86.4) rotate(-12)">` + rose(k) + `</g>` +
      `<g transform="translate(84 86.6) rotate(192) scale(.85)">` + rose(k) + `</g>` +
      sparkle(88, 38, 2.2) + sparkle(32, 40, 1.6) +
      k.defs()
    )
  },

  // Cuarenta ganadas: te hacen estatua en la plaza. La espada del héroe clavada en el pedestal, con su laurel.
  // OJO: no se registra como 'Leyenda viviente' porque ese nombre ya es la medalla general (generales-c.ts) y el
  // registro va por nombre; queda lista para cuando el nivel de la ficha se llame 'Estatua de Rathe'.
  'Estatua de Rathe': (u) => {
    const k = kit(u)
    const cornice = 'M34 76H86V81H34Z'
    const shaft = 'M39 81H81V96H39Z'
    const base = 'M33 96H87V101H33Z'
    const stone = (d: string) => ({ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) })
    const plaque = 'M47.6 83.4H72.4V92.6H47.6Z'
    const w = wreath(11.4, 8, 18)
    const bow = 'M0 0C-2.6 -2.4 -5.4 -1.8 -5 .6C-4.6 2.6 -2 2.4 0 0C2 2.4 4.6 2.6 5 .6C5.4 -1.8 2.6 -2.4 0 0Z'
    const tails = 'M-1 .6C-3 4 -4.6 8 -4.4 12L-2.6 10.8L-1.4 12.8C-1.6 8.8 -.6 4.4 .6 1ZM1 .6C3 4 4.2 8 4 12.4L2.4 11L1.2 12.8C1.4 8.6 .6 4.4 -.6 1Z'
    const sy = 48
    return (
      k.day() +
      k.sun(60, 50, 16, 48, 32, false) +
      k.shade(ellipse(60, 50, 26, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(41, 100, 26, 92, 25, 66, 6) + laurel(79, 100, 94, 92, 95, 66, 6, true) +
      k.floor(60, 101.4, 30, 2.4) +
      k.draw([stone(base), stone(shaft), stone(cornice)], 0.7) +
      `<path d="M43 81V96M77 81V96" stroke="${P.sky2}" stroke-width=".7"/><path d="M34 78H86" stroke="${P.sky2}" stroke-width=".5"/>` +
      hair(74, 82, 76, 88, 73, 94, 0.4, P.blue) + hair(45, 84, 44, 89, 46, 94, 0.35, P.sky2) +
      k.draw([{ d: plaque, fill: P.gold, inner: k.sh(plaque, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M49 84.8H71V91.2H49Z" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.45) +
      `<text x="60" y="89.8" font-family="Georgia, serif" font-style="italic" font-size="4.4" fill="${P.ink}" text-anchor="middle">al héroe</text>` +
      `<g transform="translate(60 ${sy})">` +
      `<g transform="translate(0 12)">${w.back}</g>` +
      k.cast([`M-4.4 0H4.4V${76 - sy}H-4.4Z`], 2, 0, P.mid) + monumentSword(k, 76 - sy) +
      `<g transform="translate(0 12)">${w.front}</g>` +
      `<g transform="translate(0 19.4)">` + k.draw([{ d: tails, fill: BLOOD, inner: k.sh(tails, 0, 0, 1, 1, 0, 0.9, BLOOD_D, 0.45) }, { d: bow, fill: BLOOD, inner: k.sh(bow, 0, 0, 1, 1, 0, 0.8, BLOOD_D, 0.4) }], 0.4) + `<circle cx="0" cy=".2" r="1.1" fill="${BLOOD_D}" stroke="${P.ink}" stroke-width=".35"/></g>` +
      `</g>` +
      `<path d="M50.6 76L53.4 74.4L55.6 76M63.6 76L66 74.2L69.4 76" fill="none" stroke="${P.mid}" stroke-width=".55" stroke-linejoin="round"/>` +
      `<path d="M55.6 76H64.4" stroke="${P.night}" stroke-width=".9"/>` +
      sparkle(86, 34, 2) + sparkle(33, 38, 1.6) +
      k.defs()
    )
  },

  // ── Al límite ───────────────────────────────────────────────────────

  // Un game al filo: ganaste con una gota encima. La gota de sangre cae sobre el dado de vida, que marca 1.
  'Gota de sangre': (u) => {
    const k = kit(u)
    const drop = `<g transform="translate(60 42) scale(1.12)">` +
      k.draw([{
        d: DROP, fill: BLOOD,
        inner: k.sh(DROP, 0, 0, 1, 1, 0, 0.95, BLOOD_D, 0.5) + `<path d="M-10 -2C-8 6 -2 11 6 12.6C2 14.4 -6 13 -9 8Z" fill="${BLOOD_L}" opacity=".85"/>` +
          `<path d="${DROP}" fill="${k.rad(BLOOD_L, 0.4, 0.62, 0.45, 0.8, 0)}"/>`,
      }], 0.75) +
      `<path d="M-5.6 -1.6C-5.6 -5.4 -3.4 -9 -1.4 -11.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><circle cx="-6" cy="2.4" r=".9" fill="#fff"/>` +
      `<path d="M4 8C5.6 6.6 6.4 4.6 6.4 2.6" fill="none" stroke="#F4A79C" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>`
    return (
      k.day() +
      k.sun(60, 46, 13, 42, 28, false) +
      k.floor(60, 95.4, 18, 2.6) +
      `<g transform="translate(60 80)">` + k.cast([`M0 -15L13 -7.5V7.5L0 15L-13 7.5V-7.5Z`], 2, 1.6) + d20(k, 15) + `</g>` +
      drop +
      sparkle(86, 40, 2) + sparkle(34, 66, 1.6) +
      k.defs()
    )
  },

  // Cinco games al filo: cuanto menos vida, más fuerte pegás. El escudo en forma de corazón con el león rugiendo.
  'Corazón de león': (u) => {
    const k = kit(u)
    const heart = 'M60 96C44 84 27 71 27 52C27 39 35 31 45.6 31C52 31 57 34.4 60 39.4C63 34.4 68 31 74.4 31C85 31 93 39 93 52C93 71 76 84 60 96Z'
    const heartIn = 'M60 91.2C46 80.6 31.4 69 31.4 52.2C31.4 41.6 37.6 35.4 45.8 35.4C51.6 35.4 56.4 38.8 60 45C63.6 38.8 68.4 35.4 74.2 35.4C82.4 35.4 88.6 41.6 88.6 52.2C88.6 69 74 80.6 60 91.2Z'
    return (
      k.day() +
      k.sun(60, 60, 16, 46, 32, false) +
      `<g transform="translate(60 62) scale(.93) translate(-60 -62)">` +
      k.cast([heart], 2.4, 2.2) +
      k.draw([{
        d: heart, fill: P.gold,
        inner: k.sh(heart, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M28 32H52V60C44 56 36 56 28 60Z" fill="${k.lin(P.goldL, 0, 0, 1, 1, 0.8, 0)}"/>`,
      }], 0.8) +
      `<path d="${heartIn}" fill="${BLOOD}"/>` +
      k.clip(heartIn,
        k.sh(heartIn, 0, 0, 1, 1, 0.1, 0.95, BLOOD_D, 0.5) + `<path d="M30 34H54V64C46 58 38 58 30 64Z" fill="${k.lin(BLOOD_L, 0, 0, 1, 1, 0.75, 0)}"/>` +
        Array.from({ length: 9 }, (_, i) => `<path d="M${24 + i * 9} 30L${12 + i * 9} 100" stroke="${BLOOD_D}" stroke-width=".35" opacity=".6"/>`).join('')) +
      `<path d="${heartIn}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="${heartIn}" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".01 1.6" stroke-linecap="round" transform="translate(60 61) scale(.94) translate(-60 -61)"/>` +
      `<path d="M33 46C34.6 39.4 40 36.6 46 37.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".55"/>` +
      `<g transform="translate(57 60) scale(.92)">` + lionHead(k) + `</g>` +
      `</g>` +
      sparkle(90, 30, 2.2) + sparkle(30, 30, 1.6) + sparkle(92, 86, 1.4) +
      k.defs()
    )
  },

  // Quince games al filo: ya nadie cree que puedan matarte. El fénix que renace del fuego con las alas en alto.
  'Inmortal de Rathe': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 54, 16, 48, 32, false) +
      k.shade(ellipse(60, 54, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.5) +
      flame(k, 'translate(60 101) scale(.5) translate(-60 -90)') +
      `<g transform="translate(60 62.4) scale(.82)">` + phoenix(k) + `</g>` +
      hair(28, 70, 26, 62, 30, 54, 0.5, P.goldD) + hair(92, 70, 94, 62, 90, 54, 0.5, P.goldD) +
      `<circle cx="38" cy="86" r=".8" fill="${P.gold}"/><circle cx="83" cy="84" r=".7" fill="${P.gold}"/><circle cx="44" cy="80" r=".5" fill="${P.red}"/><circle cx="78" cy="78" r=".55" fill="${P.red}"/>` +
      sparkle(60, 14, 3.2, '#fff') + sparkle(30, 40, 1.8) + sparkle(90, 42, 1.8) +
      k.defs()
    )
  },
}

