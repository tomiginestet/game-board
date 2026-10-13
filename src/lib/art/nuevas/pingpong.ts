// Ping Pong: las medallas propias del juego (las que no comparten nombre con las generales), redibujadas con el kit
// (../kit.ts) en clave heroica. Los objetos del ping pong: la paleta (goma roja o negra, mango de madera), la pelotita
// con su costura y sus tres estrellas, la red con su cinta blanca y la mesa azul con la línea blanca.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Goma negra de la paleta: una tinta azul casi negra, para no salir de la paleta. */
const NEGRA = '#252A45'
const NEGRA_D = '#10142A'
/** Madera clara del mango y del canto. */
const MADERA = '#E9C793'
/** Curita. */
const CURITA = '#EFC9A0'
const CURITA_D = '#D9A577'
/** Yerba lavada, pálida. */
const YERBA_PALIDA = '#D6D19A'
const YERBA_PALIDA_L = '#ECE5BC'
/** Verde del termo de toda la vida. */
const TERMO = '#6E8B4C'
/** Fernet con coca y su espuma. */
const FERNET = '#3A1B14'
const ESPUMA = '#EEDDBE'

// ── Piezas del ping pong ─────────────────────────────────────────────

/** Paleta parada: la cabeza (radio 14) centrada en (0,-14.6) y el mango hasta y=24.4. */
const BLADE = 'M-3.6 -1.4C-9.6 -3.8 -14 -8.2 -14 -14.6A14 14 0 1 1 14 -14.6C14 -8.2 9.6 -3.8 3.6 -1.4Z'
const RUBBER = 'M-7.2 -3.6C-11.4 -6.2 -13.1 -10.2 -13.1 -14.6A13.1 13.1 0 1 1 13.1 -14.6C13.1 -10.2 11.4 -6.2 7.2 -3.6Q0 -6.8 -7.2 -3.6Z'
const HANDLE = 'M-3.6 -2.6Q0 -5.2 3.6 -2.6C3.1 4 3 10 3.5 16C3.9 19.4 4.4 22.4 3.6 24.4H-3.6C-4.4 22.4 -3.9 19.4 -3.5 16C-3 10 -3.1 4 -3.6 -2.6Z'

interface PaddleOpts {
  negra?: boolean
  s?: number
  /** Encima de la goma, recortado a ella (rayones, curitas). */
  over?: string
  /** Encima del mango, recortado a él (marcas, cintas). */
  handle?: string
  logo?: boolean
  /** Hacia dónde asoma el canto de madera, en coordenadas de la paleta. */
  canto?: [number, number]
  /** Encima de todo, sin recortar (cintas en el borde, moños). */
  top?: string
}

/** Paleta entintada con el cuello en (x,y): canto de madera, goma con su brillo y su logo, mango con la veta y la chapita. */
function paddle(k: Kit, x: number, y: number, rot: number, o: PaddleOpts = {}) {
  const s = o.s ?? 1
  const gc = o.negra ? NEGRA : P.red, gd = o.negra ? NEGRA_D : P.wine, gl = o.negra ? '#6A76A4' : '#F39A96'
  const rubber =
    k.sh(RUBBER, 0, 0, 1, 1, 0, 0.9, gd, 0.45) +
    `<path d="M-14 -29H-3V-2H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, o.negra ? 0.16 : 0.24, 0)}"/>` +
    `<path d="M-9.8 -21C-8.2 -24.6 -5.2 -26.8 -1.6 -27.3" fill="none" stroke="${gl}" stroke-width="1.1" stroke-linecap="round"/>` +
    (o.logo === false ? '' : `<path d="M-3.2 -8.6H3.2" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/><path d="${starPath(0, -11, 1.3, 0.55, 5)}" fill="${P.gold}"/>`) +
    (o.over ?? '')
  const grip =
    k.sh('M.4 -6H5V26H.4Z', 0, 0, 1, 0, 0, 0.9, P.brown, 0.45) + `<path d="M-5 -6H-1.6V26H-5Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` +
    hair(-1.8, 1, -2.4, 10, -1.6, 21, 0.4, P.brown) + hair(1.6, 2, 2.2, 12, 1.4, 22, 0.35, P.brown) +
    `<path d="M-4 21.6H4M-4 23H4" stroke="${P.brown}" stroke-width=".3"/>` +
    `<ellipse cx="0" cy="6.4" rx="1.9" ry="3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="-.5" cy="5.4" rx=".5" ry="1" fill="#fff" opacity=".8"/>` +
    (o.handle ?? '')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([
      { d: BLADE, t: `translate(${(o.canto ?? [1.2, 1]).join(' ')})`, fill: P.brown, inner: `<path d="M-14 -8C-6 0 6 0 14 -8" fill="none" stroke="${P.goldL}" stroke-width=".4" opacity=".8"/>` },
      { d: BLADE, fill: MADERA, line: 0.35 },
      { d: HANDLE, fill: MADERA, line: 0.35, inner: grip },
    ], f(0.75 / s)) +
    `<path d="${RUBBER}" fill="${gc}"/>` + k.clip(RUBBER, rubber) + `<path d="${RUBBER}" fill="none" stroke="${P.ink}" stroke-width="${f(0.45 / s)}"/>` +
    (o.top ?? '') +
    `</g>`
  )
}

/** Pelotita: blanca (o naranja), con la costura del ecuador y, si es grande, las tres estrellas impresas. */
function ball(k: Kit, x: number, y: number, r: number, o: { c?: string; seam?: number; stars?: boolean } = {}) {
  const d = ellipse(x, y, r, r), seam = o.seam ?? -16
  const orange = o.c !== undefined && o.c !== P.white
  const stars = (o.stars ?? r >= 7) ? [-1, 0, 1].map((i) => `<path d="${starPath(x + i * r * 0.22, y - r * 0.52 + Math.abs(i) * r * 0.04, r * 0.1, r * 0.045, 5)}" fill="${P.red}"/>`).join('') : ''
  return (
    k.draw([{
      d, fill: o.c ?? P.white,
      inner:
        k.sh(d, 0, 0, 1, 1, 0, r < 6 ? 0.6 : 0.85, orange ? P.goldD : P.blue, 0.4) +
        `<path d="${d}" fill="${k.rad('#ffffff', 0.34, 0.3, 0.5, 0.9, 0)}"/>` +
        `<path d="M${f(x - r)} ${y}A${r} ${f(r * 0.3)} 0 0 0 ${f(x + r)} ${y}" fill="none" stroke="${orange ? P.goldD : P.sky2}" stroke-width="${f(Math.max(0.3, r * 0.05))}" transform="rotate(${seam} ${x} ${y})"/>` +
        stars,
    }], f(Math.min(0.8, 0.3 + r * 0.03))) +
    `<ellipse cx="${f(x - r * 0.42)}" cy="${f(y - r * 0.4)}" rx="${f(r * 0.22)}" ry="${f(r * 0.12)}" fill="#fff" opacity=".95" transform="rotate(-38 ${f(x - r * 0.42)} ${f(y - r * 0.4)})"/>`
  )
}

/** Tapa de la mesa vista desde una punta, con el borde lejano en y0: azul, con las líneas blancas. */
function mesa(k: Kit, y0: number, mid = true) {
  const top = `M2 ${y0}H118L150 140H-30Z`
  return k.draw([{
    d: top, fill: P.mid,
    inner:
      k.sh(top, 0, 0, 0, 1, 0.6, 0, P.ink, 0.35) + `<path d="M2 ${y0}H118V${y0 + 30}H2Z" fill="${k.lin('#ffffff', 0, 1, 0, 0, 0.12, 0)}"/>` +
      `<path d="M3 ${f(y0 + 0.9)}H117M9.4 ${y0}L-21 140M110.6 ${y0}L141 140" stroke="#fff" stroke-width="1.3"/>` +
      (mid ? `<path d="M60 ${y0}V140" stroke="#fff" stroke-width=".7"/>` : ''),
  }], 0.6)
}

/** Red del ping pong de x0 a x1: cinta blanca arriba (en y0), la malla hasta y1 y el poste con la prensa a la derecha. */
function net(k: Kit, x0: number, x1: number, y0: number, y1: number) {
  let g = ''
  for (let x = x0 + 1; x < x1; x += 1.9) g += `M${f(x)} ${f(y0 + 2)}V${y1}`
  for (let y = y0 + 4.4; y < y1; y += 1.9) g += `M${x0} ${f(y)}H${x1}`
  const tape = `M${x0} ${y0}H${x1}V${f(y0 + 3.2)}H${x0}Z`
  const post = `M${x1} ${f(y0 - 1.6)}H${f(x1 + 3)}V${f(y1 + 2)}H${x1}Z`
  const clamp = `M${f(x1 - 1)} ${f(y1 - 1)}H${f(x1 + 4.4)}V${f(y1 + 4)}H${f(x1 - 1)}Z`
  return (
    `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" fill="${P.night}" opacity=".18"/>` +
    `<path d="${g}" stroke="${P.ink}" stroke-width=".32"/>` +
    `<path d="M${x0} ${y1}H${x1}" stroke="${P.ink}" stroke-width=".9"/>` +
    k.draw([
      { d: tape, fill: P.white, inner: k.sh(tape, 0, 0, 0, 1, 0, 0.7, P.blue, 0.3) },
      { d: post, fill: P.night, inner: `<path d="M${f(x1 + 0.6)} ${y0}V${y1}" stroke="${P.mid}" stroke-width=".6"/>` },
      { d: clamp, fill: P.night, inner: `<circle cx="${f(x1 + 1.7)}" cy="${f(y1 + 1.5)}" r=".8" fill="${P.sky2}"/>` },
    ], 0.5)
  )
}

/** Volutas de fileteado porteño: la espiral con su hoja, entintada, dorada y con el brillo blanco. */
function voluta(d: string, c = P.gold) {
  return (
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.3" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#fff" stroke-width=".35" stroke-linecap="round" transform="translate(-.3 -.35)" opacity=".85"/>`
  )
}

/** Polilínea suavizada (Chaikin): para ríos de lava, cintas y caminos que doblan sin quiebres. */
function smooth(pts: number[][], it = 3) {
  let q = pts
  for (let n = 0; n < it; n++) {
    const out: number[][] = [q[0]]
    for (let i = 0; i < q.length - 1; i++) {
      const [a, b] = [q[i], q[i + 1]]
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75])
    }
    out.push(q[q.length - 1])
    q = out
  }
  return q
}

/** Cinta de ancho variable (de w0 a w1) a lo largo de una polilínea suavizada. */
function stream(pts: number[][], w0: number, w1: number) {
  const q = smooth(pts), L: string[] = [], R: string[] = []
  q.forEach((p, i) => {
    const a = q[Math.max(0, i - 1)], b = q[Math.min(q.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * (i / (q.length - 1))) / 2
    L.push(`${f(p[0] - (dy / l) * w)} ${f(p[1] + (dx / l) * w)}`)
    R.push(`${f(p[0] + (dy / l) * w)} ${f(p[1] - (dx / l) * w)}`)
  })
  return `M${L.join('L')}L${R.reverse().join('L')}Z`
}

export const PINGPONG_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Victorias ──────────────────────────────────────────────────────

  // El primer triunfo: la pelotita con dos curitas en cruz, como rodilla de potrero (y la gota de la primera sangre).
  'Primera sangre': (u) => {
    const k = kit(u)
    const band = roundRect(-18.4, -4.8, 18.4, 4.8, 4.8), pad = roundRect(-5.4, -3.4, 5.4, 3.4, 1)
    const holes = [-15.2, -12.4, -9.6, 9.6, 12.4, 15.2].map((x) => `<circle cx="${x}" cy="-1.7" r=".42" fill="${CURITA_D}"/><circle cx="${x}" cy="1.7" r=".42" fill="${CURITA_D}"/>`).join('')
    const curita = (rot: number, stain: boolean) =>
      `<g transform="translate(60 56) rotate(${rot})">` +
      k.draw([{
        d: band, fill: CURITA,
        inner:
          k.sh(band, 0, 0, 0, 1, 0, 0.75, P.brown, 0.3) + holes + `<path d="${pad}" fill="${CURITA_D}"/>` +
          `<path d="M-4.4 -2.2H4.4M-4.4 0H4.4M-4.4 2.2H4.4" stroke="${P.brown}" stroke-width=".5" stroke-dasharray=".01 1" stroke-linecap="round"/>` +
          (stain ? `<path d="M-1.8 -1.6C0 -2.8 2.8 -1.8 2.6 .2C2.4 2 -.4 2.6 -2 1.3C-3 .4 -2.8 -1 -1.8 -1.6Z" fill="${P.red}" opacity=".8"/>` : '') +
          `<path d="M-16.4 -3H-7.2M7.2 -3H16.4" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".6"/>`,
      }], 0.55) +
      `</g>`
    const drop = 'M0 -6C1.6 -3 3.4 -1 3.4 1.4A3.4 3.4 0 0 1 -3.4 1.4C-3.4 -1 -1.6 -3 0 -6Z'
    return (
      k.day() +
      k.sun(60, 52, 20, 46, 28, false) +
      mesa(k, 76) +
      k.floor(61.4, 78.4, 18, 2.6, P.night) +
      ball(k, 60, 56, 21, { seam: -12 }) +
      k.clip(ellipse(60, 56, 21, 21), [-38, 38].map((r) => `<path d="${band}" transform="translate(61.4 57.4) rotate(${r})" fill="${P.blue}" opacity=".35"/>`).join('')) +
      curita(-38, false) + curita(38, true) +
      `<g transform="translate(86 40) rotate(12)">` + k.draw([{ d: drop, fill: P.red, inner: k.sh(drop, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], 0.45) + `<ellipse cx="-1.3" cy=".6" rx=".7" ry="1.3" fill="#fff" opacity=".85"/></g>` +
      `<circle cx="81.6" cy="30.4" r=".9" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      sparkle(33, 42, 2.2) + sparkle(87, 64, 1.5) +
      k.defs()
    )
  },

  // Diez ganados: el chupete queda colgado de la red, como en el árbol de los chupetes. Con su cartelito.
  'Chau chupete': (u) => {
    const k = kit(u)
    const ring = `${ellipse(60, 47.6, 6.4, 6.4)} ${ellipse(60, 47.6, 4, 4)}`
    const stem = 'M57.6 53H62.4V59.6H57.6Z'
    const shield = 'M37.4 59.8C43 56 51 57.6 60 57.6C69 57.6 77 56 82.6 59.8C82.4 61.4 81.8 62.8 80.8 63.8C74 66.6 46 66.6 39.2 63.8C38.2 62.8 37.6 61.4 37.4 59.8Z'
    const shieldTop = 'M37.4 59.8C43 56 51 57.6 60 57.6C69 57.6 77 56 82.6 59.8C76 62.6 44 62.6 37.4 59.8Z'
    const nipple = 'M57.6 64.6C57.6 67 57 68.6 55.4 70.6C52.6 74 52.2 79.6 54.4 83.2C56.6 86.8 63.4 86.8 65.6 83.2C67.8 79.6 67.4 74 64.6 70.6C63 68.6 62.4 67 62.4 64.6Z'
    const knob = ellipse(60, 59.6, 5, 1.8)
    const loop = (sx: number) => `M60 35.6C${60 + sx * 2} 31.6 ${60 + sx * 7.4} 30.2 ${60 + sx * 7.8} 33.2C${60 + sx * 8.2} 36 ${60 + sx * 3} 37 60 35.6Z`
    const tail = (sx: number) => `M60 36.2L${60 + sx * 4.6} 41.6L${60 + sx * 3.4} 42.4L${60 + sx * 5.6} 43.6L${60 + sx * 6.4} 40.4L${60 + sx * 1.2} 35.6Z`
    const tag = roundRect(-7.4, -4.2, 7.4, 4.2, 0.8)
    const rid = k.id('rr')
    return (
      k.day() +
      mesa(k, 45) +
      net(k, 6, 93, 31, 53.4) +
      k.floor(61, 92, 10, 1.8, P.ink) +
      k.cast([shield, nipple, ring], 2.4, 1.6) +
      `<path d="M58.8 36.4L59.2 41.6M61.2 36.4L60.8 41.6" stroke="${P.ink}" stroke-width="1.7" stroke-linecap="round"/><path d="M58.8 36.4L59.2 41.6M61.2 36.4L60.8 41.6" stroke="${P.sky}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M58.6 36.4C52 38 46 39 42.6 42.4" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<g transform="translate(39 46.4) rotate(-10)">` +
      k.draw([{ d: tag, fill: P.white, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) + `<rect x="-6.2" y="-3" width="12.4" height="6" rx=".5" fill="none" stroke="${P.sky}" stroke-width=".3"/>` }], 0.45) +
      `<circle cx="4.8" cy="-2.4" r=".7" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<text x="-.6" y="1.7" ${GEORGIA} font-style="italic" font-size="4.8" fill="${P.ink}" text-anchor="middle">chau</text>` +
      `</g>` +
      k.draw([
        {
          d: nipple, fill: P.goldL,
          inner: k.sh(nipple, 0, 0, 1, 0, 0, 0.85, P.goldD, 0.45) + k.sh('M50 64H70V72H50Z', 0, 0, 0, 1, 0.7, 0, P.goldD, 0.35) +
            `<path d="M55.6 74.6C54.6 78 55.2 81.6 57.4 83.6" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".9"/>` + hair(64.6, 74, 66, 78.6, 64, 83, 0.5, P.goldD),
        },
        { d: stem, fill: P.white, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) },
        {
          d: shield, fill: P.sky,
          inner: k.sh(shield, 0, 0, 1, 0, 0, 0.8, P.mid, 0.4) + `<path d="${shieldTop}" fill="${P.sky1}"/>` + k.sh(shieldTop, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) +
            `<path d="${shieldTop}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
            `<path d="M40.6 59.4C45 57.8 50 58.4 54 58.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` + hair(42, 64, 50, 65.4, 58, 65.6, 0.5, '#fff', 0.7),
        },
        { d: knob, fill: P.white, inner: k.sh(knob, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
      ], 0.65) +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.5 .6)"/><path d="${ring}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="1.3"/>` +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.white}"/>` +
      `<clipPath id="${rid}"><path d="${ring}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${rid})">${k.sh(ellipse(60, 47.6, 6.4, 6.4), 0, 0, 1, 1, 0, 0.9, P.blue, 0.4)}</g>` +
      `<path d="M55.4 45.8A5 5 0 0 1 59 42.6" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      k.draw([{ d: loop(-1), fill: P.sky }, { d: loop(1), fill: P.sky }, { d: tail(-1), fill: P.sky }, { d: tail(1), fill: P.sky }], 0.45) +
      k.draw([{ d: ellipse(60, 35.6, 1.7, 1.9), fill: P.sky, inner: k.sh(ellipse(60, 35.6, 1.7, 1.9), 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) }], 0.4) +
      hair(55, 33.4, 53.6, 33.4, 53, 34.4, 0.4, P.mid) + hair(65, 33.4, 66.4, 33.4, 67, 34.4, 0.4, P.mid) +
      sparkle(84, 76, 2) + sparkle(35, 70, 1.5) +
      k.defs()
    )
  },

  // Veinticinco: ya le tomaste el gusto a la sangre. El cáliz del conde, con la pelotita flotando, delante de su capa.
  'Conde Pelotula': (u) => {
    const k = kit(u)
    const capeOut = 'M60 41C50 41 40 36.4 30.6 21.6C33 40 30 62 23 86C36 98 48 104 60 104C72 104 84 98 97 86C90 62 87 40 89.4 21.6C80 36.4 70 41 60 41Z'
    const lining = 'M60 45.4C51 45.4 43 41.4 36.6 31.4C37.6 48 35.4 66 30.6 86C41 95 50 99 60 99C70 99 79 95 89.4 86C84.6 66 82.4 48 83.4 31.4C77 41.4 69 45.4 60 45.4Z'
    const bowl = 'M45 48C45 58.6 51.2 66.2 60 66.6C68.8 66.2 75 58.6 75 48Z'
    const rim = ellipse(60, 48, 15, 3.8), blood = ellipse(60, 48, 13.2, 2.7)
    const neck = 'M57.6 66H62.4V70.4H57.6Z', knop = ellipse(60, 72.8, 5.2, 3.2), stem = 'M58 75.6H62L62.8 84.6H57.2Z'
    const foot = 'M47 92C47.4 88 53 84.6 60 84.6C67 84.6 72.6 88 73 92C73 94 67.6 95.2 60 95.2C52.4 95.2 47 94 47 92Z'
    const drip = (x: number, l: number) => `M${x - 1.2} 49.6C${x - 1} ${f(52 + l * 0.3)} ${x - 1.4} ${f(53 + l)} ${x - 0.2} ${f(53.6 + l)}A1.3 1.3 0 0 0 ${x + 1.2} ${f(53 + l)}C${x + 1} ${f(52 + l * 0.4)} ${x + 1.4} 51 ${x + 1.2} 49.8Z`
    const bat = 'M0 0C-1.6 -1.8 -4.2 -2.4 -6.8 -1.4C-5.8 -.6 -5.6 .5 -6 1.3C-4.6 .6 -3.2 .8 -2.4 1.9C-1.8 1 -.9 .8 0 1.5C.9 .8 1.8 1 2.4 1.9C3.2 .8 4.6 .6 6 1.3C5.6 .5 5.8 -.6 6.8 -1.4C4.2 -2.4 1.6 -1.8 0 0ZM-.7 -.5L-.9 -1.6L-.2 -.9H.2L.9 -1.6L.7 -.5Z'
    const gold = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` })
    const arches = [49.6, 54.8, 60, 65.2, 70.4].map((x) => `<path d="M${f(x - 2.2)} 58.6V54.4Q${x} 50.8 ${f(x + 2.2)} 54.4V58.6" fill="none" stroke="${P.goldD}" stroke-width=".45"/>`).join('')
    const beads = Array.from({ length: 11 }, (_, i) => { const x = 47.4 + i * 2.52; return `<circle cx="${f(x)}" cy="${f(51.4 + Math.pow((x - 60) / 13, 2) * -0.8 + 0.6)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    const bid = k.id('cb')
    return (
      k.night() +
      [[46, 22], [76, 22], [52, 34], [69, 35]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 26.4, 13, 13), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.3) +
      `<path d="M63 19.4A7.6 7.6 0 1 0 63 33.4A6.4 6.4 0 1 1 63 19.4Z" fill="${P.paper}"/>` +
      `<path d="${bat}" fill="${NEGRA}" stroke="${P.sky2}" stroke-width=".35" transform="translate(46.6 32) rotate(-12) scale(.75)"/><path d="${bat}" fill="${NEGRA}" stroke="${P.sky2}" stroke-width=".4" transform="translate(73.4 30.4) rotate(10) scale(.6)"/>` +
      k.draw([
        { d: capeOut, fill: NEGRA, inner: k.sh(capeOut, 0, 0, 1, 0, 0, 0.9, NEGRA_D, 0.5) + `<path d="${capeOut}" fill="${k.lin(P.blue, 0, 0, 1, 0, 0.45, 0)}"/>` + hair(33, 30, 32, 58, 26, 84, 0.8, P.mid) + hair(87, 30, 88, 58, 94, 84, 0.6, NEGRA_D) },
        {
          d: lining, fill: P.red,
          inner: k.sh(lining, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + k.shade(ellipse(60, 70, 24, 28), k.rad(P.wine, 0.5, 0.5, 0.5, 0, 0.9), P.wine, 0.4) +
            hair(40, 44, 41, 66, 37, 90, 0.8, '#F39A96') + hair(46, 50, 47, 70, 44, 94, 0.6, P.wine) + hair(80, 44, 79, 66, 83, 90, 0.8, P.wine) + hair(74, 50, 73, 70, 76, 94, 0.6, P.wine),
        },
      ], 0.8) +
      `<path d="${lining}" fill="none" stroke="${P.gold}" stroke-width=".5" transform="translate(60 70) scale(1.03) translate(-60 -70)" opacity=".8"/>` +
      `<path d="M38.4 36.4C44 42 50 44.6 55 45.4M81.6 36.4C76 42 70 44.6 65 45.4" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M38.4 36.4C44 42 50 44.6 55 45.4M81.6 36.4C76 42 70 44.6 65 45.4" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-dasharray="1 .5"/>` +
      [[37.6, 35.6], [82.4, 35.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${x}" cy="${y}" r="1" fill="${P.red}"/>`).join('') +
      k.floor(61, 94.2, 15, 2.2, NEGRA_D) +
      k.cast([bowl, stem, foot, knop], 2, 1.8, NEGRA_D) +
      k.draw([gold(foot, 0.35), gold(stem), gold(neck), gold(knop, 0.35), gold(bowl, 0.35)], 0.75) +
      `<path d="M49 89.6C53 87.6 58 87 62 87.2" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/><path d="${ellipse(60, 91.2, 9.6, 2)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      [[55.6, 72.8], [60, 73.6], [64.4, 72.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".95" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      arches + beads +
      `<circle cx="60" cy="61.2" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="60" cy="61.2" r="1.5" fill="${P.red}"/><circle cx="59.5" cy="60.7" r=".45" fill="#fff"/>` +
      hair(47.6, 50.6, 48.4, 57, 52.6, 62.4, 0.8, '#fff', 0.85) +
      k.draw([{ d: drip(50.2, 3.4), fill: P.red, inner: k.sh(drip(50.2, 3.4), 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }, { d: drip(69.4, 6), fill: P.red, inner: k.sh(drip(69.4, 6), 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.35) +
      k.draw([{ d: rim, fill: P.gold, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) }], 0.55) +
      `<path d="${blood}" fill="${P.wine}"/>` + k.clip(blood, `<path d="${ellipse(60, 48.8, 12, 2.2)}" fill="${P.red}"/>`) +
      `<clipPath id="${bid}"><path d="M46.8 20H73.2V48A13.2 2.7 0 0 1 46.8 48Z"/></clipPath><g clip-path="url(#${bid})">` + ball(k, 60, 44.6, 7.2, { seam: -20 }) + `</g>` +
      `<path d="M53.4 48.6Q60 50.4 66.6 48.6" fill="none" stroke="${P.red}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M46.4 47.2C49 45.8 53 45.2 56 45.2" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>` +
      sparkle(40, 62, 1.6, P.goldL) + sparkle(81, 70, 1.3, P.goldL) +
      k.defs()
    )
  },

  // Cincuenta: el colectivo fileteado de la línea 11 (como los juegos), que viene derecho y no para en ninguna parada.
  'Colectivo sin frenos': (u) => {
    const k = kit(u)
    const body = 'M34 35Q34 27.6 41 27.6H79Q86 27.6 86 35V86H34Z'
    const sign = 'M38 30.6H82V38.8H38Z'
    const paneL = 'M37.6 43.2Q37.6 41.4 39.4 41.4H58.8V61.4H37.6Z'
    const paneR = 'M61.2 41.4H80.6Q82.4 41.4 82.4 43.2V61.4H61.2Z'
    const panel = 'M34 64.6H86V86H34Z'
    const bumper = roundRect(31.4, 84.8, 88.6, 90.6, 1.6)
    const tire = (x: number) => `M${x} 90.6H${f(x + 9.6)}V96.4Q${f(x + 9.6)} 98.4 ${f(x + 7.6)} 98.4H${f(x + 2)}Q${x} 98.4 ${x} 96.4Z`
    const arm = (s: number) => `M${60 + s * 25.6} 31.6Q${60 + s * 32.6} 30.6 ${60 + s * 31.6} 41.6`
    const mirrorD = (s: number) => roundRect(f(60 + s * 31.6 - 2.8), 41, f(60 + s * 31.6 + 2.8), 51.4, 1.4)
    const lamp = (x: number) =>
      k.draw([{ d: ellipse(x, 79.6, 4.2, 4.2), fill: P.sky1, inner: k.sh(ellipse(x, 79.6, 4.2, 4.2), 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) }], 0.5) +
      `<circle cx="${x}" cy="79.6" r="2.7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - 0.8)}" cy="78.8" r=".9" fill="#fff"/>` +
      k.shade(ellipse(x, 79.6, 7, 7), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.3)
    const scroll = 'M3.6 0C5.6 -4.2 11 -5.6 14.2 -2.6C16.8 0 15.4 4 12.4 4C10.2 4 9.6 1.8 11 .8'
    const scroll2 = 'M3.4 2.4C6 6.4 10.4 7.4 13 5.6'
    const leaf = 'M0 0C1.6 -2.6 5 -3.2 7 -1.2C5 .8 1.8 1.2 0 0Z'
    const filete = (s: number) =>
      `<g transform="translate(60 74) scale(${s * 0.78} .78)">` + voluta(scroll) + voluta(scroll2, P.sky) +
      `<g transform="translate(13 -6) rotate(-30)"><path d="${leaf}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".5"/><path d="M.8 -.3Q3.6 -1.2 6 -1" fill="none" stroke="#fff" stroke-width=".4"/></g>` +
      `<g transform="translate(15.4 6) rotate(30)"><path d="${leaf}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/></g>` +
      `<circle cx="17.6" cy="-1" r=".8" fill="#fff" stroke="${P.ink}" stroke-width=".3"/><circle cx="7.4" cy="-6.6" r=".6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>` +
      `</g>`
    const speed = (s: number) => [[56, 12], [63, 9], [70, 13], [77, 8]].map(([y, l]) => hair(60 + s * 29, y, 60 + s * (29 + l / 2), y + 0.3, 60 + s * (29 + l), y, 1, P.ink)).join('')
    const puff = (x: number, y: number, s: number) => {
      const d = 'M-6 1.6C-7.6 1.6 -8 -.6 -6.6 -1.4C-6.4 -3.6 -3.8 -4.4 -2.4 -3C-1.4 -5.2 2 -5.2 2.8 -2.8C4.6 -3.6 6.8 -2 6.2 .2C7.4 .6 7.2 1.6 6 1.6Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.4) }], f(0.4 / s)) + `</g>`
    }
    return (
      k.day() +
      k.sun(60, 60, 26, 52, 32, false) +
      speed(-1) + speed(1) +
      k.floor(60, 98.6, 32, 2.6, P.mid) +
      `<g transform="rotate(-3 60 62)">` +
      `<path d="${arm(-1)}M${arm(1).slice(1)}" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      k.draw([{ d: mirrorD(-1), fill: P.night, inner: `<path d="${roundRect(26.4, 42.4, 30.4, 50, 1)}" fill="${P.sky}"/><path d="M27.2 49L29.6 43.6" stroke="#fff" stroke-width=".5"/>` }, { d: mirrorD(1), fill: P.night, inner: `<path d="${roundRect(89.6, 42.4, 93.6, 50, 1)}" fill="${P.sky}"/><path d="M90.4 49L92.8 43.6" stroke="#fff" stroke-width=".5"/>` }], 0.5) +
      k.draw([
        { d: tire(36), fill: NEGRA, inner: `<path d="M37 93H45" stroke="${P.mid}" stroke-width=".5"/>` },
        { d: tire(74.4), fill: NEGRA, inner: `<path d="M75.4 93H83.4" stroke="${P.mid}" stroke-width=".5"/>` },
        {
          d: body, fill: P.white, line: 0.4,
          inner: k.sh('M70 26H88V88H70Z', 0, 0, 1, 0, 0, 0.75, P.blue, 0.35) + `<path d="M32 26H40V88H32Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
            [[36.2, 40], [83.8, 40], [36.2, 62.6], [83.8, 62.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".45" fill="${P.blue}"/>`).join(''),
        },
        {
          d: panel, fill: P.red,
          inner: k.sh(panel, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + `<path d="M34 64.6H86V66.6H34Z" fill="${P.gold}"/><path d="M34 66.6H86V67.4H34Z" fill="${P.goldD}"/>` +
            `<path d="M34 83.4H86V86H34Z" fill="${P.sky}"/>`,
        },
        { d: bumper, fill: P.sky1, inner: k.sh(bumper, 0, 0, 0, 1, 0, 0.9, P.blue, 0.45) + `<path d="M33 86.4H87" stroke="#fff" stroke-width=".7"/>` + `<path d="${roundRect(53.4, 85.6, 66.6, 89.8, 0.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><path d="M55.4 87.7H64.6" stroke="${P.ink}" stroke-width="1.2" stroke-dasharray="1.6 .7"/>` },
      ], 0.75) +
      `<path d="${sign}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<rect x="38.8" y="31.4" width="8.6" height="6.6" rx=".5" fill="${P.white}"/>` +
      `<text x="43.1" y="37" ${GEORGIA} font-weight="700" font-size="6" fill="${P.ink}" text-anchor="middle">11</text>` +
      `<text x="64.6" y="36.6" ${GEORGIA} font-weight="700" font-size="4.3" letter-spacing=".5" fill="${P.gold}" text-anchor="middle">DIRECTO</text>` +
      `<path d="M49 32.4H80.6" stroke="${P.goldL}" stroke-width=".3" opacity=".4"/>` +
      k.draw([
        { d: paneL, fill: P.sky, inner: k.sh(paneL, 0, 0, 1, 1, 0, 0.6, P.mid, 0.35) + `<path d="M37 56L50 41H55L39 60Z" fill="#fff" opacity=".55"/><path d="M42.6 61L56 44.6H57.4L44.4 61Z" fill="#fff" opacity=".4"/>` },
        { d: paneR, fill: P.sky, inner: k.sh(paneR, 0, 0, 1, 1, 0.2, 0.75, P.mid, 0.4) + `<path d="M61 56L74 41H78L63 60Z" fill="#fff" opacity=".4"/>` },
      ], 0.5) +
      `<path d="M47.4 41.6V47" stroke="${P.ink}" stroke-width=".35"/>` + ball(k, 47.4, 49, 2.1, { stars: false }) +
      `<path d="M41.4 60.6L53.4 54.6M64.6 60.6L76.6 54.6" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="M34.6 62.9H85.4" stroke="${P.sky}" stroke-width="1.6"/>` + Array.from({ length: 13 }, (_, i) => `<circle cx="${f(37 + i * 3.833)}" cy="62.9" r=".55" fill="${i % 2 ? P.red : P.gold}"/>`).join('') +
      `<path d="${roundRect(36, 68.6, 84, 82.4, 1.4)}" fill="none" stroke="${P.goldL}" stroke-width=".45" opacity=".9"/>` +
      [-1, 1].map((sx) => `<g transform="translate(${60 + sx * 19.6} 69.8) scale(${sx * 0.5} .5)">` + voluta('M-6 4C-6 0 -2 -1.6 1 -.4C3.4 .6 3 3.6 1 3.8C-.6 4 -1 2.4 0 1.8', P.sky) + `</g>`).join('') +
      filete(1) + filete(-1) +
      k.draw([{ d: ellipse(60, 74, 3.8, 3.8), fill: P.gold, inner: k.sh(ellipse(60, 74, 3.8, 3.8), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.5) +
      `<circle cx="60" cy="74" r="2.2" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><path d="M58.4 73.4A1.8 1.8 0 0 1 60.4 72.2" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` +
      lamp(40.8) + lamp(79.2) +
      `<path d="M36.2 69.6H39.4V72H36.2ZM80.6 69.6H83.8V72H80.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      puff(33, 96, 0.9) + puff(88, 96.4, 0.8) +
      k.defs()
    )
  },

  // Cien: el volcán ya escupe pelotitas. La erupción, de noche, con los ríos de lava y la columna de humo.
  'Imparable': (u) => {
    const k = kit(u)
    const mount = 'M8 110C22 94 34 78 42.4 65.4C45.4 60.8 48.6 58 51.6 58.2L54.4 60.4L57.6 58.6L60.6 60.2L63.6 58.4L66.2 60.4L68.6 58.2C71.6 58 74.8 60.8 77.6 65.4C86 78 98 94 112 110Z'
    const mouth = 'M51.6 58.4C54 56.8 57 56.4 60 56.6C63 56.4 66 56.8 68.6 58.4C66 60 63 60.6 60 60.6C57 60.6 54 60 51.6 58.4Z'
    const puffs: [number, number, number][] = [[60, 47, 6.6], [54.6, 41, 7.4], [66, 40, 7.6], [60, 32, 8.4], [49, 30, 7.2], [72, 29, 7.6], [40.6, 36.6, 5.4], [80.6, 35.6, 5.8], [62, 23, 7.2], [48, 21.4, 5.6], [75, 20.6, 5.4]]
    const river = (pts: number[][], w0: number, w1: number) =>
      `<path d="${stream(pts, w0 * 2.8, w1 * 2.4)}" fill="${P.goldD}" opacity=".3"/>` +
      k.draw([{ d: stream(pts, w0, w1), fill: P.red, inner: `<path d="${stream(pts.map(([x, y]) => [x - 0.2, y]), w0 * 0.62, w1 * 0.5)}" fill="${P.gold}"/><path d="${stream(pts.map(([x, y]) => [x - 0.4, y]), w0 * 0.24, w1 * 0.2)}" fill="${P.goldL}"/>` }], 0.4)
    const flying: [number, number, number, number, number][] = [[60, 31, 7.4, 60, 48], [38.6, 44, 4.8, 49, 46], [82.6, 42, 5.2, 72, 44], [30, 62, 3.4, 40, 51], [91, 60, 3.6, 82, 50]]
    const tail = (x: number, y: number, r: number, cx: number, cy: number) => {
      const dx = 60 - x, dy = 56 - y, l = Math.hypot(dx, dy), ex = x + (dx / l) * r * 3.4, ey = y + (dy / l) * r * 3.4
      return `<path d="${taper(x, y, (x + ex) / 2 + (cx - (x + 60) / 2) * 0.2, (y + ey) / 2 + (cy - (y + 56) / 2) * 0.2, ex, ey, r * 1.7, 0.3)}" fill="${k.lin(P.gold, 0, 0, 1, 1, 0.9, 0.1)}"/>`
    }
    return (
      `<rect width="120" height="130" fill="${P.night}"/>` +
      `<rect width="120" height="130" fill="${k.rad(P.red, 0.5, 0.56, 0.62, 0.7, 0)}"/>` +
      k.shade(ellipse(60, 54, 26, 22), k.rad(P.gold, 0.5, 0.5, 0.5, 0.55, 0), P.gold, 0.4) +
      [[28, 30], [93, 30], [24, 74], [97, 72], [34, 20], [88, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.draw(puffs.map(([x, y, r]) => ({ d: ellipse(x, y, r, r), fill: '#343C66', inner: k.sh(ellipse(x, y, r, r), 0, 0, 1, 1, 0, 0.85, NEGRA_D, 0.45) + k.shade(ellipse(x, y + r * 0.9, r * 1.3, r * 0.75), k.rad(P.goldD, 0.5, 0.5, 0.5, 0.75, 0), P.goldD, 0.4) })), 0.7) +
      puffs.map(([x, y, r]) => hair(x - r * 0.75, y - r * 0.1, x - r * 0.55, y - r * 0.72, x + r * 0.1, y - r * 0.86, 0.55, P.blue)).join('') +
      flying.map(([x, y, r, cx, cy]) => tail(x, y, r, cx, cy)).join('') +
      flame(k, 'translate(60 59) scale(.36 .4) translate(-60 -90)') +
      k.draw([{
        d: mount, fill: P.mid,
        inner:
          k.sh('M62 56C70 74 76 92 78 114H114V56Z', 0, 0, 1, 0, 0.3, 1, P.night, 0.55) + k.sh(mount, 0, 0, 0, 1, 0, 0.55, P.night, 0.35) +
          `<path d="M8 56H60V112H8Z" fill="${k.lin(P.goldD, 1, 0, 0, 1, 0.55, 0)}"/>` +
          hair(52, 62, 46, 76, 40, 92, 0.5, P.night) + hair(56, 62, 53, 80, 50, 100, 0.6, P.night) + hair(64, 62, 67, 80, 70, 100, 0.7, P.night) + hair(68, 62, 74, 76, 82, 94, 0.7, P.night) +
          hair(48, 66, 40, 80, 30, 96, 0.5, P.night) + hair(72, 66, 80, 80, 92, 96, 0.8, P.night) + hair(60, 64, 60, 82, 60, 102, 0.5, P.night) +
          hair(47, 64, 42, 74, 36, 82, 0.4, P.goldL, 0.8) + hair(44, 70, 37, 81, 29, 92, 0.35, P.goldL, 0.6) +
          `<path d="M30 92Q36 89 40 92M44 84Q48 81 52 84M70 86Q74 83 78 86M80 96Q85 93 90 96" fill="none" stroke="${P.night}" stroke-width=".5"/>`,
      }], 0.8) +
      river([[53.4, 59.6], [50.6, 64], [48, 68.6], [45, 73.4], [45.4, 78.4], [44, 85], [39.6, 92], [36.6, 97], [35, 104]], 3.6, 1.6) +
      river([[66.6, 59.6], [69.6, 64.6], [72, 70], [74.6, 76], [73.6, 82], [76, 90], [80.6, 98]], 3.2, 1.4) +
      river([[60, 60.4], [61, 65], [60.4, 70], [59, 75.4], [60.6, 81]], 2.4, 1.1) +
      `<path d="${mouth}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><path d="M54 58.4C57 57.4 63 57.4 66 58.4" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-linecap="round"/>` +
      flying.map(([x, y, r]) => k.shade(ellipse(x, y, r * 1.8, r * 1.8), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.35) + ball(k, x, y, r, { seam: (x - 60) * 1.4 })).join('') +
      [[44, 54, 0.8], [76, 52, 0.7], [53, 50, 0.6], [68, 50, 0.6], [35, 54, 0.5], [86, 52, 0.5], [50, 40, 0.5], [70, 36, 0.5], [46, 60, 0.5], [74, 60, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}"/>`).join('') +
      sparkle(26, 48, 1.6, P.goldL) + sparkle(94, 46, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Pastelito ──────────────────────────────────────────────────────

  // El primero en cero sale fácil: un pastelito del 25 de Mayo, con su membrillo y su almíbar, sobre la mesa.
  'Pastelito': (u) => {
    const k = kit(u)
    const petal = (L: number) => {
      const w = L * 0.4
      return `M1.6 ${f(-w)}C${f(L * 0.36)} ${f(-w * 1.3)} ${f(L * 0.78)} ${f(-w * 0.78)} ${L} 0C${f(L * 0.78)} ${f(w * 0.78)} ${f(L * 0.36)} ${f(w * 1.3)} 1.6 ${f(w)}Z`
    }
    const side = (a: number, L: number, dy: number) =>
      `<g transform="translate(0 ${dy}) rotate(${a})">` + k.draw([{ d: petal(L), fill: P.goldD, inner: k.sh(petal(L), 0, 0, 0, 1, 0, 0.8, P.brown, 0.4) }], 0.9) + `</g>` +
      [0.36, 0.68].map((t) => `<g transform="translate(0 ${f(dy * t)}) rotate(${a})"><path d="${petal(L)}" fill="none" stroke="${P.goldL}" stroke-width=".55"/></g>`).join('')
    const leaf = (a: number, L: number, top: boolean) => {
      const d = petal(L), w = L * 0.4
      return (
        `<g transform="rotate(${a})">` +
        k.draw([{
          d, fill: top ? P.goldL : P.gold,
          inner: k.shade(d, k.lin(P.goldD, 0, 0, 1, 0, 0.05, 0.8), P.goldD, 0.4) + `<path d="${d}" fill="${k.rad(P.brown, 1, 0.5, 0.45, 0.7, 0)}"/>` +
            hair(4, f(-w * 0.62), f(L * 0.42), f(-w * 0.98), f(L * 0.86), -0.8, 0.55, P.goldD) + hair(4, f(w * 0.62), f(L * 0.42), f(w * 0.98), f(L * 0.86), 0.8, 0.55, P.goldD) +
            hair(6, f(-w * 0.3), f(L * 0.5), f(-w * 0.5), f(L * 0.8), -0.3, 0.4, P.brown),
        }], 0.9) +
        `</g>`
      )
    }
    const quince = ellipse(0, 0.6, 5.8, 5)
    const sprinkles = [[-9, -4, P.sky], [8, -7, P.red], [5, 9, P.sky], [-6, 9, P.white], [12, 2, P.white], [-13, 3, P.red], [-3, -12, P.white], [8, -13, P.sky], [-12, -10, P.goldD], [14, -4, P.red], [2, 13, P.red], [-15, -3, P.sky]]
      .map(([x, y, c], i) => `<rect x="${f(+x - 1.1)}" y="${f(+y - 0.5)}" width="2.2" height="1" rx=".5" fill="${c}" stroke="${P.ink}" stroke-width=".25" transform="rotate(${i * 47} ${x} ${y})"/>`).join('')
    return (
      k.day() +
      k.sun(60, 50, 16, 46) +
      k.shade(ellipse(60, 52, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      mesa(k, 73) +
      k.floor(61, 86, 33, 4.2, P.night) +
      `<g transform="translate(60 66.6) scale(1.38 .9)">` +
      [225, 315, 135, 45].map((a) => side(a, 20, 4.6)).join('') + [225, 315, 135, 45].map((a) => leaf(a, 20, false)).join('') +
      [270, 180, 0, 90].map((a) => side(a, 15.6, 3.4)).join('') + [270, 180, 0, 90].map((a) => leaf(a, 15.6, true)).join('') +
      k.draw([{ d: quince, fill: P.red, inner: k.sh(quince, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<path d="${ellipse(0, 1.6, 6, 4.6)}" fill="${P.wine}" opacity=".35"/>` }], 0.6) +
      `<ellipse cx="-2.2" cy="-2.4" rx="2.4" ry="1.4" fill="#fff" opacity=".85"/>` +
      hair(-17, -2, -12, -10, -4, -13, 1, '#fff', 0.8) + hair(4, -14, 10, -12, 13, -8, 0.8, '#fff', 0.6) + hair(-14, 5, -10, 8, -5, 9.6, 0.6, '#fff', 0.5) +
      sprinkles +
      `</g>` +
      sparkle(86, 40, 2.2) + sparkle(33, 46, 1.6) +
      k.defs()
    )
  },

  // Tres en cero: el zapato de charol del rival, embalsamado en la pared como trofeo de caza, con la chapita del 11 a 0.
  'Zapatero': (u) => {
    const k = kit(u)
    const plaque = 'M60 24.4C67 28 77 28.4 86.8 26C89.8 43.6 88.4 66.6 60 92.4C31.6 66.6 30.2 43.6 33.2 26C43 28.4 53 28 60 24.4Z'
    const bevel = 'M60 28.8C66.6 31.8 75 32.2 83.2 30.4C85.2 45.6 83.4 64.2 60 86.8C36.6 64.2 34.8 45.6 36.8 30.4C45 32.2 53.4 31.8 60 28.8Z'
    const upper = 'M36.8 62C34.8 57.6 36.8 53.4 42.2 52C48.6 50.4 54.2 48.2 58.6 44.6L62.2 41.6C64 40.2 66.6 40.2 68 41.8C70.8 44.8 74.8 45.8 78.6 45.2L82.6 44.4C84.6 46.2 85.2 52.2 85 58.2L84.6 62Z'
    const sole = 'M35.6 61.4C35.2 64.2 37.2 65.6 40.2 65.6H72.8V64.4H85.4V61.4Z'
    const heel = 'M72.8 64.4H85.4V69.4H74.2Z'
    const lining = 'M68 41.8C72.2 44.4 77.8 45 82.6 44.4C78.8 42.2 72.6 40.8 68 41.8Z'
    const tongue = 'M60.8 43C60.6 39.8 61.8 37.2 64 36.8C65.4 37 65.8 38.8 65.4 41.4Z'
    const plate = roundRect(47.6, 75.6, 72.4, 82.4, 1)
    const screw = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/><path d="M${f(x - 0.6)} ${f(y + 0.3)}L${f(x + 0.6)} ${f(y - 0.3)}" stroke="${P.goldD}" stroke-width=".3"/>`
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.cast([plaque], 2.6, 2.4) +
      k.draw([
        { d: plaque, fill: P.brownD, inner: k.sh(plaque, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) + `<path d="M30 24H44V70H30Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.4, 0)}"/>` },
        {
          d: bevel, fill: P.brown, line: 0.35,
          inner:
            k.sh(bevel, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M36 30H52V72H36Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.55, 0)}"/>` +
            hair(42, 34, 46, 54, 56, 78, 0.45, P.brownD) + hair(50, 32, 52, 50, 60, 72, 0.4, P.brownD) + hair(74, 33, 76, 52, 68, 74, 0.45, P.brownD) + hair(66, 31, 66, 48, 63, 66, 0.35, P.brownD) +
            `<ellipse cx="72" cy="38" rx="2" ry="1.2" fill="none" stroke="${P.brownD}" stroke-width=".4"/><path d="M38.6 34C42 31.6 48 31.4 52 31.2" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>`,
        },
      ], 0.8) +
      k.cast([upper, sole, heel], 2.4, 2.6, P.brownD) +
      k.draw([
        { d: heel, fill: P.brownD, inner: `<path d="M73.4 67H85.4" stroke="${P.brown}" stroke-width=".5"/>` + k.sh(heel, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
        { d: sole, fill: P.brownD, inner: `<path d="M36 62.6H85" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".8 .6"/>` + k.sh(sole, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
        { d: tongue, fill: NEGRA, inner: k.sh(tongue, 0, 0, 1, 0, 0, 0.8, NEGRA_D, 0.4) + hair(62, 41, 62.4, 39, 63.6, 37.8, 0.4, P.sky2) },
        {
          d: upper, fill: NEGRA, line: 0.35,
          inner:
            k.sh('M60 38C70 48 80 52 86 64H90V38Z', 0, 0, 1, 0, 0, 0.85, NEGRA_D, 0.5) + `<path d="M34 48H56V64H34Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.9, 0)}"/>` +
            `<path d="M45.6 51.2C43.4 54.4 43 58.4 43.8 62" fill="none" stroke="${NEGRA_D}" stroke-width=".6"/><path d="M46.6 51C44.6 54.2 44.2 58.2 45 62" fill="none" stroke="${P.blue}" stroke-width=".35" stroke-dasharray=".7 .6"/>` +
            `<path d="M66.6 43.4C66 50 67 56 69.6 62" fill="none" stroke="${NEGRA_D}" stroke-width=".6"/><path d="M67.8 44.4C67.4 50.4 68.4 56 70.8 62" fill="none" stroke="${P.blue}" stroke-width=".35" stroke-dasharray=".7 .6"/>` +
            `<path d="M54 48.6C57 47 60.4 44.6 62.8 42.4" fill="none" stroke="${NEGRA_D}" stroke-width="2.4"/>` +
            [0, 1, 2, 3].map((i) => `<path d="M${f(55 + i * 2.3)} ${f(49.6 - i * 1.9)}L${f(54 + i * 2.3)} ${f(46.2 - i * 1.9)}" stroke="${P.sky2}" stroke-width=".8" stroke-linecap="round"/>`).join(''),
        },
        { d: lining, fill: P.red, inner: k.sh(lining, 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) },
      ], 0.7) +
      hair(38.4, 58, 39.4, 54.4, 44, 52.6, 1.3, '#fff', 0.95) + hair(47, 51.6, 52.6, 49.8, 57, 46.4, 0.9, '#fff', 0.8) + hair(74, 48.2, 79, 47.2, 83.4, 47.6, 0.8, '#fff', 0.6) + hair(40, 60.4, 50, 61, 60, 60.4, 0.5, P.sky2, 0.7) +
      `<path d="M63.4 41.4C61 38.4 57.6 38.2 57.4 40.4C57.2 42.4 60.6 42.4 63.4 41.4C64.6 38.6 67.6 36.6 68.6 38.4C69.6 40.4 66.2 41.8 63.4 41.4ZM63.4 41.4L60.4 46.6M63.4 41.4L66.6 46" fill="none" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<path d="M63.4 41.4C61 38.4 57.6 38.2 57.4 40.4C57.2 42.4 60.6 42.4 63.4 41.4C64.6 38.6 67.6 36.6 68.6 38.4C69.6 40.4 66.2 41.8 63.4 41.4ZM63.4 41.4L60.4 46.6M63.4 41.4L66.6 46" fill="none" stroke="${P.sky2}" stroke-width=".55" stroke-linecap="round"/>` +
      k.draw([{ d: plate, fill: P.gold, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M47 75H55V83H47Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` }], 0.5) +
      screw(49.6, 79) + screw(70.4, 79) +
      `<text x="60" y="80.8" ${GEORGIA} font-weight="700" font-size="4.6" fill="${P.ink}" text-anchor="middle">11 a 0</text>` +
      sparkle(40.6, 54.6, 1.6) + sparkle(88, 76, 1.8) + sparkle(31, 74, 1.4) +
      k.defs()
    )
  },

  // Diez en cero: la rosca de Pascua, redonda como el cero, en su bandeja de puntilla, con pelotitas en lugar de huevos.
  'Rosca': (u) => {
    const k = kit(u)
    const cx = 60, cy = 61.6, RX = 28.4, RY = 14, rx = 10.2, ry = 4.4, H = 5
    const top = ellipse(cx, cy, RX, RY), hole = ellipse(cx, cy - 0.8, rx, ry)
    const side = `M${cx - RX} ${cy}A${RX} ${RY} 0 0 0 ${cx + RX} ${cy}V${cy + H}A${RX} ${RY} 0 0 1 ${cx - RX} ${cy + H}Z`
    const at = (deg: number, s: number) => {
      const a = (deg * Math.PI) / 180, R = rx + s * (RX - rx), Ry = ry + s * (RY - ry)
      return { x: cx + Math.cos(a) * R, y: cy - 0.6 + Math.sin(a) * Ry }
    }
    const gid = k.id('tor')
    const torus =
      `<radialGradient id="${gid}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${RX}" gradientTransform="translate(${cx} ${cy}) scale(1 ${f(RY / RX)}) translate(${-cx} ${-cy})">` +
      `<stop offset=".36" stop-color="${P.brownD}" stop-opacity=".85"/><stop offset=".5" stop-color="${P.brownD}" stop-opacity="0"/><stop offset=".64" stop-color="#fff" stop-opacity=".55"/>` +
      `<stop offset=".78" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="${P.brownD}" stop-opacity=".75"/></radialGradient>`
    const cream = (deg: number) => {
      const p0 = at(deg, 0.14), p1 = at(deg, 0.88), m = at(deg + 7, 0.5)
      const d = `M${f(p0.x)} ${f(p0.y)}Q${f(m.x)} ${f(m.y)} ${f(p1.x)} ${f(p1.y)}`
      return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.9" stroke-linecap="round" transform="translate(.3 .4)"/><path d="${d}" fill="none" stroke="${P.goldD}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width="1.9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width=".55" stroke-linecap="round" stroke-dasharray=".9 .8" transform="translate(-.25 -.3)"/>`
    }
    const cherry = (deg: number) => {
      const p = at(deg, 0.52)
      return `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="2.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(p.x - 0.7)}" cy="${f(p.y - 0.7)}" r=".6" fill="#fff"/>`
    }
    const fruit = (deg: number) => {
      const p = at(deg, 0.62)
      return `<rect x="${f(p.x - 1.4)}" y="${f(p.y - 0.8)}" width="2.8" height="1.6" rx=".3" fill="${P.green}" stroke="${P.ink}" stroke-width=".35" transform="rotate(${deg / 3} ${f(p.x)} ${f(p.y)})"/>`
    }
    const egg = (deg: number) => {
      const p = at(deg, 0.5)
      return k.floor(p.x + 0.8, p.y + 3.4, 4.6, 1.3, P.brownD) + ball(k, f(p.x), f(p.y - 1.4), 4.8, { seam: deg / 6, stars: false })
    }
    const items: [number, string][] = []
    for (let i = 0; i < 12; i++) {
      const deg = i * 30 + 15
      if (![45, 135, 225, 315].includes(deg)) items.push([deg, cream(deg)])
    }
    ;[0, 90, 180, 270].forEach((deg) => items.push([deg, cherry(deg)]))
    ;[30, 150, 210, 330].forEach((deg) => items.push([deg + 0.05, fruit(deg)]))
    ;[45, 135, 225, 315].forEach((deg) => items.push([deg + 0.1, egg(deg)]))
    items.sort((a, b) => Math.sin((a[0] * Math.PI) / 180) - Math.sin((b[0] * Math.PI) / 180))
    const sugar = Array.from({ length: 30 }, (_, i) => {
      const p = at(i * 41 + 7, 0.08 + ((i * 37) % 84) / 100)
      return `<circle cx="${f(p.x)}" cy="${f(p.y)}" r=".38" fill="#fff"/>`
    }).join('')
    const trayIn = ellipse(60, 68.2, 30, 12.6)
    const lace = Array.from({ length: 34 }, (_, i) => {
      const a = (i / 34) * Math.PI * 2, x = 60 + Math.cos(a) * 33.2, y = 68.4 + Math.sin(a) * 14.4
      return `<circle cx="${f(x)}" cy="${f(y)}" r="1.9" fill="${P.white}" stroke="${P.goldD}" stroke-width=".35"/><circle cx="${f(x + Math.cos(a) * 0.5)}" cy="${f(y + Math.sin(a) * 0.3)}" r=".5" fill="${P.sky1}" stroke="${P.goldD}" stroke-width=".2"/>`
    }).join('')
    return (
      k.day() +
      k.sun(60, 54, 20, 47, 28, false) +
      k.shade(ellipse(60, 56, 34, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      k.floor(61, 76, 40, 5, P.mid) +
      `<path d="${ellipse(60.6, 69.2, 33.2, 14.4)}" fill="${P.sky1}" stroke="${P.goldD}" stroke-width=".4"/>` + lace +
      k.draw([{ d: trayIn, fill: P.gold, inner: k.sh(trayIn, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="${ellipse(60, 68.2, 29.6, 12)}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` }], 0.5) +
      k.floor(61, 69.4, 31, 7.4, P.brownD) +
      `<defs>${torus}</defs>` +
      k.draw([
        { d: side, fill: P.goldD, inner: k.sh(side, 0, 0, 1, 0, 0, 0.9, P.brown, 0.45) + hair(33, 64.6, 42, 70, 52, 71.6, 0.5, P.brown) + hair(66, 72, 78, 70.6, 87, 65.4, 0.5, P.brownD) },
        { d: top, fill: P.gold, inner: `<path d="${top}" fill="url(#${gid})"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) },
      ], 0.8) +
      `<path d="${hole}" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".7"/>` + k.clip(hole, `<path d="${ellipse(cx, cy + 2.4, rx, ry)}" fill="${P.gold}"/>` + k.sh(hole, 0, 0, 0, 1, 0.7, 0, NEGRA_D, 0.45)) +
      `<path d="M33.4 57C37.6 52 47 48.6 56 48.2" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".75"/>` +
      sugar + items.map(([, s]) => s).join('') +
      sparkle(32, 38, 2.4) + sparkle(88, 40, 1.8) + sparkle(60, 22, 2) +
      k.defs()
    )
  },

  // ── Remontada ──────────────────────────────────────────────────────

  // Cobraste de lo lindo y la diste vuelta, como Rocky: el guante rojo con la cinta, en el gancho que manda la pelotita a volar.
  'Adriaaan': (u) => {
    const k = kit(u)
    const main = 'M-12.4 6C-14.6 -2 -14.8 -14 -9.6 -21C-5.6 -26.4 6 -27.4 11.4 -22C16.4 -17 16 -4 13 6Z'
    const thumb = 'M-12.6 4.6C-17.6 3.6 -19.4 -3.4 -17.6 -9C-16.6 -12 -13.6 -12.8 -12 -10.8L-9.4 2.6Z'
    const cuff = 'M-11 5H12.6L11.8 24C11.8 26 10.6 27 8.6 27H-7.6C-9.6 27 -10.8 26 -10.8 24Z'
    const tape = 'M-11.4 9.4H12.4L12.2 19.6H-11Z'
    const burst = starPath(70.4, 44.6, 10, 4, 9, -8)
    return (
      k.day() +
      k.sun(60, 58, 18, 46, 28, false) +
      k.shade(burst, k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0.2), P.goldL, 0.5) +
      k.draw([{ d: burst, fill: P.white, inner: `<path d="${starPath(70.4, 44.6, 6, 2.7, 9, 12)}" fill="${P.goldL}"/>` }], 0.45) +
      hair(30, 92, 31, 80, 36, 68, 0.9, P.blue) + hair(37, 96, 38, 86, 42, 76, 0.7, P.blue) + hair(26, 82, 27, 74, 31, 64, 0.6, P.blue) +
      `<g transform="translate(52 74) rotate(28) scale(1.04)">` +
      k.cast([main, thumb, cuff], 1.8, 1.6) +
      k.draw([
        { d: cuff, fill: P.red, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.85, P.wine, 0.45) + k.sh('M-12 20H13V28H-12Z', 0, 0, 0, 1, 0, 0.6, P.wine, 0.3) },
        { d: thumb, fill: P.red, line: 0.35, inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.8, P.wine, 0.45) + hair(-16.4, -6, -17, -2, -14.6, 2, 0.6, '#fff', 0.6) },
        {
          d: main, fill: P.red, line: 0.35,
          inner: k.sh('M2 -28C12 -20 14 -6 12 8H18V-28Z', 0, 0, 1, 0, 0, 0.9, P.wine, 0.45) + k.sh('M-15 -2H16V8H-15Z', 0, 0, 0, 1, 0, 0.7, P.wine, 0.35) +
            `<path d="M-16 -28H-4V8H-16Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
            `<path d="M-11.6 -7C-6 -10.4 6 -10.6 13.4 -7" fill="none" stroke="${P.wine}" stroke-width=".7"/><path d="M-11.6 -6C-6 -9.4 6 -9.6 13.4 -6" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".8 .7"/>` +
            `<path d="M-6 -22.6C-3 -24.6 3 -25 7 -23" fill="none" stroke="${P.wine}" stroke-width=".5"/>` +
            `<path d="M-9.4 -16C-8.4 -20 -5.4 -23 -1.6 -24" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>` +
            hair(-7, -4, -1, -2.6, 6, -3.4, 0.6, P.wine),
        },
        {
          d: tape, fill: P.white,
          inner: k.sh(tape, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) +
            [-9, -5, -1, 3, 7].map((x) => `<path d="M${x} 9.4L${x + 4.4} 19.6" stroke="${P.sky2}" stroke-width=".5"/>`).join('') +
            `<path d="M-11.2 14.4H12.3" stroke="${P.sky2}" stroke-width=".4"/>` + hair(-6, 11.4, 0, 12.6, 6, 11.2, 0.5, P.red, 0.6),
        },
      ], f(0.7 / 1.04)) +
      `<path d="M8.4 19.6L10.6 22.6L12.4 20.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<rect x="-5" y="21.4" width="10" height="3" rx=".6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="${starPath(0, 22.9, 1.2, 0.5, 5)}" fill="${P.red}"/>` +
      `</g>` +
      ball(k, 76.4, 33.4, 5.4, { seam: 30 }) +
      hair(80.6, 40.6, 83.6, 40, 86.6, 41.6, 0.6) + hair(82, 45, 85, 44.6, 88, 46.4, 0.5) + hair(66.6, 34, 69, 31.6, 71, 30.6, 0.5) +
      sparkle(34, 40, 2) + sparkle(90, 60, 1.6) +
      k.defs()
    )
  },

  // Estabas enterrado y saliste de la tumba con la paleta en alto. De noche, con la lápida partida.
  'Volví del más allá': (u) => {
    const k = kit(u)
    const stone = 'M64 94V52C64 41.4 70.4 35.6 78 35.6C85.6 35.6 92 41.4 92 52V94Z'
    const mound = 'M10 108C18 90 32 81.4 50 80.6C66 80 80 83 92 89C99 92.6 104 98 108 108Z'
    const fist = 'M-6.4 -7.6C-3 -9.6 4 -9.6 7.4 -7.4C8.8 -2 8.8 3 7.2 6.8H-5.8C-7.2 2 -7.4 -3 -6.4 -7.6Z'
    const fingers = [[-7.6, 4.8], [-4.2, 5.2], [-0.8, 5], [2.6, 4.2]].map(([y, w]) => roundRect(f(-7 - (5.2 - w) * 0.2), y, f(-7 + w + 6), f(y + 3.3), 1.6))
    const thumbD = 'M6 -8.4C2.6 -11.4 -3 -11.8 -6.4 -9.6C-7.6 -8.8 -7.2 -7.2 -5.8 -7.4C-2.4 -8.2 1.6 -7.8 4.4 -6Z'
    const arm = 'M-5.8 6H7.2L8.8 34H-6.8Z'
    const sleeve = 'M-7.8 15.6L-5.6 13.8L-3.6 15.2L-1 13.4L1.6 15L4.2 13.2L6.6 14.8L8.8 13.6L10.2 34H-8.8Z'
    const skin = (d: string, line = 0) => ({ d, fill: P.skin, line, inner: k.sh(d, 0, 0, 1, 0, 0.1, 0.85, P.blue, 0.35) + k.sh(d, 0, 0, 0, 1, 0, 0.4, P.mid, 0.25) })
    const clod = (x: number, y: number, s: number, r: number) => `<path d="M-2 -1L0 -2.2L2.2 -1.2L2 1.2L-.4 2L-2.2 .8Z" fill="${P.brown}" stroke="${P.ink}" stroke-width="${f(0.35 / s)}" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`
    return (
      k.night() +
      [[30, 30], [44, 24], [90, 30], [26, 64], [96, 66], [70, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(80, 30, 14, 14), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.5, 0), P.goldL, 0.3) +
      `<path d="${ellipse(80, 30, 7.4, 7.4)}" fill="${P.paper}"/><circle cx="82" cy="28.4" r="1.4" fill="${P.sky1}"/><circle cx="78" cy="32.4" r="1" fill="${P.sky1}"/>` +
      `<g transform="rotate(8 78 94)">` +
      k.cast([stone], 2.2, 1.6, NEGRA_D) +
      k.draw([{
        d: stone, fill: P.sky2,
        inner: k.sh(stone, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) + `<path d="M62 34H70V96H62Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          `<path d="${roundRect(67.6, 41, 88.4, 94, 8)}" fill="none" stroke="${P.blue}" stroke-width=".5"/>` +
          `<path d="M82.6 35.6L80.6 41.4L83.4 45L80 51.6L81.6 55" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linejoin="round"/><path d="M80.6 41.4L78 43" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
          hair(70, 70, 76, 72, 82, 70, 0.5, P.mid) + hair(72, 76, 78, 78, 86, 76, 0.4, P.mid) +
          `<circle cx="73" cy="62" r="1.6" fill="${P.green}" opacity=".7"/><circle cx="75" cy="63" r="1.1" fill="${P.greenD}" opacity=".7"/>`,
      }], 0.7) +
      `<text x="78.4" y="57" ${GEORGIA} font-weight="700" font-size="7" letter-spacing=".6" fill="${P.paper}" text-anchor="middle" opacity=".7" transform="translate(.4 .4)">RIP</text>` +
      `<text x="78.4" y="57" ${GEORGIA} font-weight="700" font-size="7" letter-spacing=".6" fill="${P.mid}" text-anchor="middle">RIP</text>` +
      `</g>` +
      `<g transform="translate(47 66) rotate(7)">` +
      paddle(k, 0, -13.4, 0) +
      k.draw([skin(arm), { d: sleeve, fill: P.white, inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + hair(-4, 18, -3.4, 25, -4.4, 32, 0.6, P.blue) + hair(5, 18, 6, 25, 6.4, 32, 0.5, P.blue) + `<circle cx="2" cy="22" r="1.4" fill="${P.brown}" opacity=".5"/><circle cx="-2.4" cy="27" r="1" fill="${P.brown}" opacity=".45"/>` }], 0.7) +
      k.draw([skin(fist), ...fingers.map((d) => skin(d, 0.35)), skin(thumbD, 0.35)], 0.65) +
      `<path d="M7.4 -4.6C8.4 -2 8.4 1 7.6 3.6" fill="none" stroke="${P.blue}" stroke-width=".5"/>` +
      [-6, -2.6, 0.8, 4].map((y) => `<path d="M-5.6 ${y}C-6.2 ${y - 0.6} -6.2 ${y - 1.6} -5.6 ${y - 2}" fill="none" stroke="${P.blue}" stroke-width=".4"/>`).join('') +
      `</g>` +
      k.draw([{
        d: mound, fill: P.brownD,
        inner: k.sh(mound, 0, 0, 1, 1, 0, 0.8, NEGRA_D, 0.45) + `<path d="M24 92C32 85 44 82.4 54 82.2" fill="none" stroke="${P.brown}" stroke-width="1.4" stroke-linecap="round"/>` +
          hair(30, 96, 40, 92, 50, 92, 0.6, NEGRA_D) + hair(62, 90, 74, 89, 84, 93, 0.6, NEGRA_D) + hair(40, 86, 47, 84, 54, 84.6, 0.5, P.brown) +
          `<path d="M40.6 84.8L43.6 83L45.4 84.6L48.6 82.4L50.2 84.2L53.6 83" fill="none" stroke="${NEGRA_D}" stroke-width=".6" stroke-linejoin="round"/>`,
      }], 0.75) +
      clod(36, 76, 1, 20) + clod(58, 73, 0.8, -30) + clod(32, 66, 0.6, 60) + clod(63, 78, 0.7, 10) + clod(40, 70, 0.5, -15) +
      hair(36, 82, 34, 78, 35, 73, 0.5, P.paper, 0.6) + hair(58, 80, 60, 77, 59, 74, 0.5, P.paper, 0.6) +
      sparkle(32, 44, 1.8, P.paper) + sparkle(62, 26, 1.4, P.paper) +
      k.defs()
    )
  },

  // De las cenizas: ibas 1 a 10 y ganaste igual. El ave fénix, heráldica, que nace de la pelotita partida entre las llamas.
  'Ave Fénix': (u) => {
    const k = kit(u)
    const mirror = (s: string) => s + `<g transform="translate(120 0) scale(-1 1)">${s}</g>`
    const tips = [[27.4, 39.6], [24.8, 48.6], [25.4, 57.6], [29.2, 65.6], [35.4, 71], [43, 73.4]]
    const bases = [[46.6, 44], [45.4, 48], [45.8, 52.4], [47.6, 56.6], [50, 60.4], [53, 63.4]]
    const primaries = tips.map(([tx, ty], i) => {
      const [bx, by] = bases[i], l = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / l, ny = (tx - bx) / l
      const mx = bx + (tx - bx) * 0.6, my = by + (ty - by) * 0.6
      const d = `M${f(bx)} ${f(by)}Q${f(mx + nx * 7.4)} ${f(my + ny * 7.4)} ${f(tx)} ${f(ty)}Q${f(mx - nx * 6.4)} ${f(my - ny * 6.4)} ${f(bx)} ${f(by)}Z`
      return {
        d, fill: P.red,
        inner: `<path d="${d}" fill="${k.lin(P.gold, 1, 0, 0, 0, 0, 1)}"/><path d="${d}" fill="${k.lin(P.goldL, 1, 0, 0, 0, 0, 0.75)}"/>` + k.sh(d, 0, 0, 0, 1, 0, 0.55, P.wine, 0.3) +
          hair(bx, by, mx, my, tx, ty, 0.75, P.wine) + hair(bx - 0.4, by + 1.6, mx, my + 1.6, tx + 1, ty + 1.2, 0.35, P.wine, 0.7),
      }
    })
    const coverts = 'M57 45.6C51.6 38.6 42 35 31.4 37.4C34.6 42 36.4 47.4 38.4 52.6C40.6 58.4 45 63 52.6 66L57.4 61Z'
    const rows = [[[33, 40.6], [38.6, 41.6], [44, 43.6], [49.6, 46.4]], [[37, 47], [41.6, 49.2], [46.4, 52], [51, 55]], [[41, 54.6], [45, 57.6], [49.6, 60.4]]]
      .map((row) => row.map(([x, y]) => `<path d="M${f(x - 2.8)} ${f(y - 1.6)}Q${f(x - 1.6)} ${f(y + 2.8)} ${f(x + 2.6)} ${f(y + 1.6)}" fill="none" stroke="${P.goldD}" stroke-width=".55"/>`).join('')).join('')
    const wing =
      k.draw(primaries, 0.6) +
      k.draw([{ d: coverts, fill: P.gold, inner: k.sh(coverts, 0, 0, 1, 1, 0, 0.85, P.goldD, 0.45) + `<path d="M30 34H44V60H30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` + rows }], 0.65) +
      `<path d="M56.4 45.2C51 38.6 42 35.4 32.2 37.6" fill="none" stroke="${P.goldL}" stroke-width="1" stroke-linecap="round"/>`
    const body = 'M60 40C67.4 41 71.4 47 70.6 54C69.8 61.6 65.4 67.6 60 71.6C54.6 67.6 50.2 61.6 49.4 54C48.6 47 52.6 41 60 40Z'
    const neck = 'M56.6 46C55 41 55.4 36.4 57.6 33.4L63.4 34C64.4 38 64 42.6 62.4 46.4Z'
    const head = 'M55.8 32.4C55.6 28.6 58 26.2 61.2 26.2C64.4 26.2 66 28.6 65.4 31.6C65 34 63.4 35.4 61 35.6C58.4 35.8 56 34.6 55.8 32.4Z'
    const beak = 'M56.4 29.4C54.6 29.2 52.2 29.8 50.8 31.8C52.6 31.2 54.4 31.4 55.4 32.4L57 32Z'
    const tail: [number, number, number, number, number, number, string][] = [[57.4, 68, 45, 70, 37.6, 82, P.gold], [58.4, 69.4, 49, 78, 44.6, 90.6, P.red], [60, 70, 58, 84, 56.4, 96.4, P.gold], [60, 70, 62, 84, 63.6, 96.4, P.red], [61.6, 69.4, 71, 78, 75.4, 90.6, P.gold], [62.6, 68, 75, 70, 82.4, 82, P.red]]
    const half = (sx: number) => `M0 0A6.2 6.2 0 0 0 ${sx * 12.4} 0L${sx * 10.6} -1.4L${sx * 9} .4L${sx * 7} -1.8L${sx * 5} .2L${sx * 3} -1.6L${sx * 1.4} .4Z`
    const shell = (x: number, y: number, r: number, sx: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d: half(sx), fill: P.white, inner: k.sh(half(sx), 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M${sx * 0.6} 1.6A6 3 0 0 0 ${sx * 11.8} 1.6" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` }], 0.5) +
      `<path d="${starPath(sx * 6.2, 3.6, 1, 0.42, 5)}" fill="${P.red}"/></g>`
    const scales = [[56, 49], [60, 48.4], [64, 49], [54.4, 54], [58, 53.6], [62, 53.6], [65.6, 54], [55.6, 59], [60, 58.6], [64.4, 59], [57.4, 64], [62.6, 64], [60, 69]]
      .map(([x, y]) => `<path d="M${x - 1.9} ${y}Q${x} ${y + 2.6} ${x + 1.9} ${y}" fill="none" stroke="${P.gold}" stroke-width=".6"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${P.night}"/>` +
      `<rect width="120" height="130" fill="${k.rad(P.red, 0.5, 0.64, 0.62, 0.8, 0)}"/>` +
      k.shade(ellipse(60, 56, 30, 30), k.rad(P.goldD, 0.5, 0.5, 0.5, 0.75, 0), P.goldD, 0.35) +
      Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2 - Math.PI / 2; return hair(60 + Math.cos(a) * 18, 54 + Math.sin(a) * 18, 60 + Math.cos(a) * 28, 54 + Math.sin(a) * 28, 60 + Math.cos(a) * 42, 54 + Math.sin(a) * 42, 1.3, P.gold, 0.3) }).join('') +
      flame(k, 'translate(60 101) scale(.86 .46) translate(-60 -90)') +
      mirror(wing) +
      k.draw(tail.map(([x0, y0, cx, cy, x1, y1, c]) => ({ d: taper(x0, y0, cx, cy, x1, y1, 6.6, 1.2), fill: c, inner: k.sh('M30 66H90V100H30Z', 0, 0, 0, 1, 0, 0.8, c === P.red ? P.wine : P.goldD, 0.45) + hair(x0, y0, cx, cy, x1, y1, 0.55, c === P.red ? P.gold : P.goldD) })), 0.55) +
      k.draw([
        { d: neck, fill: P.red, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) + hair(57.6, 44, 57, 40, 58.4, 36, 0.5, P.gold) },
        { d: body, fill: P.red, line: 0.35, inner: k.sh(body, 0, 0, 1, 0, 0, 0.85, P.wine, 0.45) + `<path d="M50 40H58V76H50Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` + scales },
        { d: head, fill: P.red, inner: k.sh(head, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<path d="M55 25H60V36H55Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0)}"/>` },
        { d: beak, fill: P.gold, inner: k.sh(beak, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.4) },
      ], 0.6) +
      `<path d="M57.2 30.2C58 29.4 59.4 29.4 60 30.2C59.4 31 58 31 57.2 30.2Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/><circle cx="58.6" cy="30.2" r=".55" fill="${P.ink}"/>` +
      k.draw([
        { d: taper(62.6, 27, 66, 23.6, 69, 24.6, 2.2, 1.2), fill: P.gold },
        { d: taper(61.6, 26.6, 63, 21.8, 65.6, 21, 2.2, 1.1), fill: P.goldL },
        { d: taper(64, 28.4, 68.4, 27.6, 70.4, 29.6, 2, 1.1), fill: P.goldD },
      ], 0.4) +
      shell(47.4, 91.6, -14, 1) + shell(72.6, 91.6, 14, -1) +
      [[34, 80, 0.8], [86, 78, 0.7], [40, 88, 0.6], [80, 90, 0.6], [28, 30, 0.5], [92, 32, 0.5], [70, 20, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}"/>`).join('') +
      sparkle(36, 28, 2, P.goldL) + sparkle(85, 27, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Sangre fría ────────────────────────────────────────────────────

  // El primer decisivo, sin transpirar: los anteojos de píxeles bajan sobre la pelotita metida en un cubito de hielo.
  'Deal with it': (u) => {
    const k = kit(u)
    const T = [60, 49], Rr = [80.6, 60.4], F = [60, 71.8], Ll = [39.4, 60.4], H = 22.4
    const p = (q: number[], dy = 0) => `${q[0]} ${f(q[1] + dy)}`
    const out = `M${p(T)}L${p(Rr)}L${p(Rr, H)}L${p(F, H)}L${p(Ll, H)}L${p(Ll)}Z`
    const top = `M${p(T)}L${p(Rr)}L${p(F)}L${p(Ll)}Z`
    const left = `M${p(Ll)}L${p(F)}L${p(F, H)}L${p(Ll, H)}Z`
    const right = `M${p(F)}L${p(Rr)}L${p(Rr, H)}L${p(F, H)}Z`
    const rows = ['00000000000000000', '01111110001111110', '00111110000111110', '00011100000011100']
    const px = 2.3, gx = 60 - (17 * px) / 2, gy = 32
    const glint: Record<string, boolean> = { '1,2': true, '1,3': true, '2,3': true, '1,11': true, '1,12': true, '2,12': true }
    let glasses = '', shine = ''
    rows.forEach((row, r) => row.split('').forEach((c, i) => {
      if (r === 0 || c === '1') glasses += `M${f(gx + i * px)} ${f(gy + r * px)}h${px}v${px}h-${px}Z`
      if (glint[`${r},${i}`]) shine += `<rect x="${f(gx + i * px)}" y="${f(gy + r * px)}" width="${px}" height="${px}" fill="#fff"/>`
    }))
    glasses += `M${f(gx - px)} ${gy}h${px}v${px}h-${px}ZM${f(gx + 17 * px)} ${gy}h${px}v${px}h-${px}Z`
    return (
      k.day() +
      k.stage(60, 64, 32) +
      k.floor(61, 94.6, 26, 3.6, P.blue) +
      `<path d="${ellipse(62, 94.4, 23, 2.8)}" fill="${P.sky1}" stroke="${P.sky}" stroke-width=".5"/><path d="M44 93.6Q54 92.4 62 92.8" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([{ d: out, fill: P.sky }], 0.85) +
      k.clip(out, `<path d="${out}" fill="${k.rad(P.white, 0.5, 0.6, 0.5, 0.7, 0)}"/>` + ball(k, 59.6, 75.4, 11.6, { seam: -24 }) + `<path d="${out}" fill="${P.sky1}" opacity=".1"/>`) +
      `<path d="${top}" fill="${P.white}" opacity=".5"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.3, P.sky, 0.3) +
      k.sh(left, 0, 0, 0, 1, 0, 0.25, P.sky, 0.3) +
      `<path d="${right}" fill="${P.blue}" opacity=".3"/>` + k.sh(right, 0, 0, 1, 1, 0, 0.6, P.mid, 0.35) +
      `<path d="M${p(Ll)}L${p(F)}L${p(Rr)}M${p(F)}L${p(F, H)}" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M${p(Ll)}L${p(F)}L${p(Rr)}M${p(F)}L${p(F, H)}" fill="none" stroke="${P.blue}" stroke-width=".35" transform="translate(.5 .5)"/>` +
      hair(42, 66, 43, 74, 42, 81, 1, '#fff', 0.85) + hair(45, 58.6, 52, 56, 57, 52.4, 0.9, '#fff', 0.85) + hair(77.6, 66, 78.6, 73, 77.6, 80, 0.6, '#fff', 0.5) + hair(63, 54, 68, 56.6, 72, 59, 0.6, '#fff', 0.6) +
      [[48, 84, 0.9], [51, 88, 0.55], [72, 86, 0.8], [69, 68, 0.55], [44, 76, 0.45], [75, 78, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width=".4"/>`).join('') +
      `<path d="M70 91V95" stroke="${P.sky}" stroke-width="1.4" stroke-linecap="round"/>` +
      [[53, 22.6, 28], [60, 20.4, 28], [67, 22.6, 28]].map(([x, y0, y1]) => `<path d="M${x} ${y0}V${y1}" stroke="${P.mid}" stroke-width=".9" stroke-linecap="round" stroke-dasharray="1.6 1.2"/>`).join('') +
      `<path d="${glasses}" fill="${NEGRA_D}" transform="translate(.6 .6)" opacity=".35"/>` +
      `<path d="${glasses}" fill="${NEGRA_D}"/>` + shine +
      sparkle(30, 56, 2) + sparkle(90, 52, 1.6) + sparkle(88, 82, 1.3) + sparkle(32, 80, 1.2) +
      k.defs()
    )
  },

  // Tres finales de bandera con el pulso a 40: el bisturí partió la pelotita justo por la costura.
  'Pulso de cirujano': (u) => {
    const k = kit(u)
    const cx = 60, cy = 74, r = 15
    const leftHalf = `M${cx} ${f(cy - r)}A${r} ${r} 0 0 0 ${cx} ${f(cy + r)}A4.2 ${r} 0 0 0 ${cx} ${f(cy - r)}Z`
    const rightHalf = `M${cx} ${f(cy - r)}A${r} ${r} 0 0 1 ${cx} ${f(cy + r)}A4.2 ${r} 0 0 1 ${cx} ${f(cy - r)}Z`
    const face = ellipse(cx, cy, 4.2, r), hollow = ellipse(cx + 0.4, cy, 3.2, r - 1.1)
    const handle = roundRect(-2.2, -26, 2.2, -1.4, 1.2)
    const blade = 'M-1.3 1.6H1.4C3.8 4.8 4.4 9.4 2.6 12.8C1.8 14.2 .4 14.8 -.9 15C-.3 11 -1.3 6 -1.3 1.6Z'
    const neckD = 'M-1.1 -1.6H1.1V2H-1.1Z'
    const knurl = Array.from({ length: 7 }, (_, i) => `<path d="M-2.2 ${f(-12 + i * 1.5)}L2.2 ${f(-13.4 + i * 1.5)}M-2.2 ${f(-13.4 + i * 1.5)}L2.2 ${f(-12 + i * 1.5)}" stroke="${P.blue}" stroke-width=".3"/>`).join('')
    const ecg = 'M23 43H37L39 41.4L41 43H43L45.4 33L48.2 50.4L50.6 43H54L56.4 40.8L58.8 43H97'
    return (
      k.day() +
      k.stage(60, 62, 33) +
      `<path d="${ecg}" fill="none" stroke="${P.sky}" stroke-width="2.6" stroke-linejoin="round" opacity=".6"/>` +
      `<path d="${ecg}" fill="none" stroke="${P.ink}" stroke-width="1.1" stroke-linejoin="round"/>` +
      `<circle cx="97" cy="43" r="1.1" fill="${P.red}"/>` +
      `<path d="M30 52.6C28.4 51.4 27.6 50 28.6 49C29.4 48.2 30.4 48.6 30.8 49.4C31.2 48.6 32.2 48.2 33 49C34 50 33.2 51.4 31.6 52.6L30.8 53.2Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="36" y="53.4" ${GEORGIA} font-weight="700" font-size="5.6" fill="${P.ink}">40</text>` +
      k.floor(61, 89.4, 20, 2.6, P.mid) +
      `<g transform="translate(-4.2 0) rotate(-7 ${cx} ${cy + r})">` +
      k.draw([{ d: leftHalf, fill: P.white, inner: k.sh(leftHalf, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="${ellipse(cx - 6, cy - 5, 5, 7)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.9, 0)}"/>` }], 0.7) +
      `<path d="${face}" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/><path d="${hollow}" fill="${P.sky2}"/>` + k.clip(hollow, k.sh(hollow, 0, 0, 1, 0, 0.9, 0.1, P.mid, 0.4)) +
      `<path d="${ellipse(cx - 7.6, cy - 6.6, 2.4, 1.3)}" fill="#fff" transform="rotate(-38 ${cx - 7.6} ${cy - 6.6})"/>` +
      [-1, 0, 1].map((i) => `<path d="${starPath(cx - 6 + i * 2.6, cy - 6.4 + Math.abs(i) * 0.5, 1.2, 0.5, 5)}" fill="${P.red}"/>`).join('') +
      `</g>` +
      `<g transform="translate(4.2 0) rotate(7 ${cx} ${cy + r})">` +
      k.draw([{ d: rightHalf, fill: P.white, inner: k.sh(rightHalf, 0, 0, 1, 1, 0.15, 0.85, P.blue, 0.4) }], 0.7) +
      `<path d="M${cx} ${f(cy - r)}A4.2 ${r} 0 0 0 ${cx} ${f(cy + r)}" fill="none" stroke="${P.sky2}" stroke-width=".7" transform="translate(.8 0)"/>` +
      `</g>` +
      `<path d="M58.2 55.4L60 60.6L61.8 55.4" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
      `<g transform="translate(67.4 46.6) rotate(40) scale(.92)">` +
      k.cast([handle, blade], 1.8, 1.4) +
      k.draw([
        { d: handle, fill: P.sky1, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + `<path d="M-1.6 -25V-2" stroke="#fff" stroke-width=".7"/>` + knurl + `<text x="0" y="-17.4" ${GEORGIA} font-size="3.2" fill="${P.mid}" text-anchor="middle" transform="rotate(-90 0 -18.4)">4</text>` },
        { d: neckD, fill: P.sky2 },
        { d: blade, fill: P.white, inner: k.sh(blade, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + `<path d="M1.6 3C3.4 6 3.6 9.6 2.2 12.4" fill="none" stroke="${P.sky}" stroke-width=".5"/>` },
      ], 0.5) +
      `</g>` +
      sparkle(56.6, 58.8, 1.4, '#fff') + sparkle(88, 66, 1.8) + sparkle(32, 70, 1.4) +
      k.defs()
    )
  },

  // Diez decisivos: ya sos el Dibu en los penales. El guante de oro del arquero, con la pelotita atajada.
  'Mirá que te como': (u) => {
    const k = kit(u)
    const fingers: [number, number, number][] = [[-7.8, 6.2, -30.6], [-1.6, 6.4, -33.2], [4.6, 6.2, -31.4], [10.4, 5.4, -26.4]]
    const finger = ([x, w, top]: [number, number, number]) => roundRect(f(x - w / 2), top, f(x + w / 2), -6, w / 2)
    const palm = 'M-11.4 -13C-12.6 -4 -12.2 4 -10.8 10H11.8C13.2 4 13.8 -4 13.4 -13Z'
    const thumbD = taper(-9.6, 2, -18.6, -1, -21.6, -16, 7.4, 5.8)
    const strap = 'M-12.2 9.4L12.8 7.4L13.4 18.4L-12 20.4Z'
    const cuff = 'M-11.4 19H12.6L13 29H-11.8Z'
    const gold = (d: string, line = 0.35) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.22, 0)}"/>` })
    return (
      k.day() +
      k.sun(60, 54, 16, 46) +
      k.shade(ellipse(60, 54, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(50, 100, 29, 92, 26, 64, 8) + laurel(70, 100, 91, 92, 94, 64, 8, true) +
      `<g transform="translate(60.6 63.4) rotate(-6) scale(1.04)">` +
      k.cast([palm, thumbD, ...fingers.map(finger), strap, cuff], 2, 1.8) +
      k.draw([
        { d: cuff, fill: P.goldD, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.8, P.brown, 0.4) + [-8, -4, 0, 4, 8].map((x) => `<path d="M${x} 21V29" stroke="${P.brown}" stroke-width=".5"/>`).join('') },
        gold(thumbD),
        ...fingers.map((fg) => ({
          ...gold(finger(fg)),
          inner: gold(finger(fg)).inner + `<path d="${roundRect(f(fg[0] - fg[1] / 2 + 1), fg[2] + 1.2, f(fg[0] + fg[1] / 2 - 1), -6, fg[1] / 2 - 1)}" fill="${P.goldL}"/>` +
            `<path d="M${f(fg[0] - fg[1] / 2 + 0.6)} ${fg[2] + 3}V-7M${f(fg[0] + fg[1] / 2 - 0.6)} ${fg[2] + 3}V-7" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray=".7 .6"/>` +
            `<ellipse cx="${f(fg[0] - fg[1] * 0.18)}" cy="${fg[2] + 2.4}" rx="${f(fg[1] * 0.16)}" ry=".9" fill="#fff" opacity=".9"/>`,
        })),
        { ...gold(palm), inner: gold(palm).inner + `<path d="M-9.6 -11.6C-10.2 -4 -9.8 2 -8.6 8H10C11 2 11.6 -4 11.2 -11.6Z" fill="${P.goldL}"/>` + [[-6, 4], [-2, 6], [2, 6], [6, 4], [-4, -1], [4, -1]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".45" fill="${P.goldD}"/>`).join('') },
        { d: strap, fill: P.night, inner: k.sh(strap, 0, 0, 1, 0, 0, 0.6, NEGRA_D, 0.4) + `<path d="M-11.6 10.6L12.4 8.6M-11.4 19L12.8 17" stroke="${P.gold}" stroke-width=".4" stroke-dasharray=".8 .6"/>` },
      ], 0.6) +
      `<text x=".6" y="17.2" ${GEORGIA} font-weight="700" font-size="6" fill="${P.goldL}" text-anchor="middle" transform="rotate(-4.6 .6 15)">23</text>` +
      hair(-17.6, -12, -16.4, -6, -12.6, -1, 0.7, '#fff', 0.8) + hair(-9.6, -10, -9.8, -2, -8.6, 6, 0.8, '#fff', 0.7) +
      ball(k, 1, -6.6, 8.6, { seam: -26 }) +
      `</g>` +
      sparkle(86, 40, 2.4) + sparkle(33, 44, 1.8) +
      k.defs()
    )
  },

  // ── Maratón ────────────────────────────────────────────────────────

  // Un 15 a 13 en un juego a 11, y vos como si nada: la pila, rojo y negro como las gomas, con la carga llena.
  'Tiene pila': (u) => {
    const k = kit(u)
    const x0 = 46, x1 = 70, yt = 34, yb = 83, ry = 3.6
    const body = `M${x0} ${yt}V${yb}A12 ${ry} 0 0 0 ${x1} ${yb}V${yt}Z`
    const band = `M${x0} ${yt}V47A12 ${ry} 0 0 0 ${x1} 47V${yt}Z`
    const cap = ellipse(58, yt, 12, ry), capIn = ellipse(58, yt, 9.6, 2.6)
    const nub = 'M54.2 34V29.6A3.8 1.2 0 0 1 61.8 29.6V34Z'
    const bolt = 'M60.6 52.6L52.4 66H57.8L55.2 77.6L64 62.6H58.4Z'
    const bars = [0, 1, 2, 3].map((i) => `<rect x="64.6" y="${f(73 - i * 5.6)}" width="3" height="4.4" rx=".5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    return (
      k.day() +
      k.sun(58, 54, 18, 46, 28, false) +
      mesa(k, 78) +
      k.floor(59, 87.4, 16, 2.6, P.night) + k.floor(81, 87.8, 6.4, 1.2, P.night) +
      hair(55, 27, 52, 24, 49.6, 23.6, 0.8, P.goldD) + hair(58, 26.6, 58.4, 23, 57.6, 20.4, 0.8, P.goldD) + hair(61, 27, 64, 24, 66.4, 24, 0.8, P.goldD) +
      `<path d="M50 22.6L51.4 24.8L49.6 25.6M66.6 22.4L65.6 24.8L67.4 25.4" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-linejoin="round"/>` +
      k.draw([
        { d: nub, fill: P.sky1, inner: k.sh(nub, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        {
          d: body, fill: NEGRA,
          inner: k.sh(body, 0, 0, 1, 0, 0.2, 0.95, NEGRA_D, 0.5) + `<path d="${band}" fill="${P.red}"/>` + k.clip(band, k.sh(band, 0, 0, 1, 0, 0.1, 0.9, P.wine, 0.45)) +
            `<path d="M${x0} 47A12 ${ry} 0 0 0 ${x1} 47" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` +
            `<path d="M47.4 34H51.4V86H47.4Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="M48.6 37V80" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>` +
            `<path d="M56 40.6H60M58 38.6V42.6" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>`,
        },
        { d: cap, fill: P.sky1, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) + `<path d="${capIn}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` },
        { d: ellipse(58, 29.6, 3.8, 1.2), fill: P.white },
      ], 0.7) +
      k.draw([{ d: bolt, fill: P.gold, inner: k.sh(bolt, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) + `<path d="M59.4 54.6L54.4 63" stroke="${P.goldL}" stroke-width=".7"/>` }], 0.55) +
      bars +
      ball(k, 81, 82.2, 5.6, { seam: 20 }) +
      sparkle(36, 44, 2.2) + sparkle(84, 48, 1.6) +
      k.defs()
    )
  },

  // Un 17 a 15: duró tanto que se lavó el mate. La calabaza con la yerba pálida, aguada y llena de palitos.
  'Mate lavado': (u) => {
    const k = kit(u)
    const gourd = 'M45.8 58C40.8 64 39.6 74 43.6 81C47 87 52.8 90 60.2 90C67.6 90 73.4 87 76.8 81C80.8 74 79.6 64 74.6 58Z'
    const band = 'M45.4 52.6H75L74.6 58.6C68 60.6 52 60.6 45.8 58.6Z'
    const rim = ellipse(60.2, 52.6, 14.8, 4.8), yerba = ellipse(60.2, 52.9, 12.8, 3.7)
    const leather = 'M42 70C41.6 75 42.2 78.6 43.6 81C47 87 52.8 90 60.2 90C67.6 90 73.4 87 76.8 81C78.2 78.6 78.8 75 78.4 70C70 73.4 50.4 73.4 42 70Z'
    const straw = (d: string, c: string, w: number) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${w + 1.3}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`
    const sticks = [[52, 52.4, 20], [56.6, 50.8, -30], [65.4, 54.6, 10], [55, 54.6, 60], [68, 52, -50], [61.4, 52.6, 80], [59, 55.4, -10], [50.4, 54.6, 40]].map(([x, y, r]) => `<rect x="${x - 1.4}" y="${y - 0.3}" width="2.8" height=".6" rx=".3" fill="${YERBA_PALIDA_L}" stroke="${P.brown}" stroke-width=".2" transform="rotate(${r} ${x} ${y})"/>`).join('')
    return (
      k.day() +
      k.stage(60, 58, 33) +
      mesa(k, 78) +
      k.floor(61.4, 90.4, 17, 2.6, P.night) + k.floor(84.4, 88.6, 6, 1.2, P.night) +
      straw('M65.6 52.6L74.4 32.6', P.sky1, 1.7) + `<path d="M66.2 51L73.6 33.4" stroke="#fff" stroke-width=".5"/>` + straw('M74.4 32.6Q75.6 29.8 73.6 28.8', P.gold, 1.7) +
      `<ellipse cx="70.8" cy="40.8" rx="2.4" ry="1.3" transform="rotate(-66 70.8 40.8)" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([
        {
          d: gourd, fill: P.brown, line: 0.4,
          inner:
            k.sh('M62 56C74 62 78 76 72 94H86V56Z', 0, 0, 1, 0, 0, 0.95, P.brownD, 0.45) + k.sh('M40 80H82V92H40Z', 0, 0, 0, 1, 0, 0.6, P.brownD, 0.3) +
            `<path d="M40 58H53V92H40Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<path d="${leather}" fill="${P.brownD}"/>` + k.sh(leather, 0, 0, 1, 0, 0, 0.8, NEGRA_D, 0.4) +
            `<path d="M42.6 72.6C50.6 75.6 69.8 75.6 77.8 72.6" fill="none" stroke="${P.goldL}" stroke-width=".55" stroke-dasharray="1.2 .9"/>` +
            hair(46, 64, 44.6, 70, 46.6, 76, 1, '#fff', 0.55),
        },
        { d: band, fill: P.sky1, line: 0.35, inner: k.sh(band, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + `<path d="M46 56.6Q60 59.4 74.4 56.6" fill="none" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` },
        { d: rim, fill: P.white, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
      ], 0.7) +
      `<path d="${yerba}" fill="${YERBA_PALIDA}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.clip(yerba, k.sh(yerba, 0, 0, 0, 1, 0.7, 0, P.brown, 0.35) + `<path d="${ellipse(62, 54, 8.6, 2.4)}" fill="${P.sky1}" opacity=".9"/><path d="M55.6 54.2Q60 53 64.6 53.8" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` + sticks) +
      straw('M65.6 52.6L67 49.4', P.sky1, 1.7) +
      `<path d="M46.4 53.6C48.4 52 52 51.2 55 51.2" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      hair(50, 47.6, 48, 44, 50.4, 40.4, 0.5, P.sky2, 0.8) + hair(55, 47, 56.4, 43.6, 54.6, 40.6, 0.45, P.sky2, 0.7) +
      ball(k, 84.4, 83.4, 5.4, { seam: 30 }) +
      sparkle(34, 42, 2) + sparkle(88, 60, 1.5) +
      k.defs()
    )
  },

  // Un 19 a 17: más capítulos que la novela de la tarde. La tele de la abuela, con la pelotita congelada sobre la red.
  'Continuará…': (u) => {
    const k = kit(u)
    const cab = roundRect(28, 38.6, 92, 90, 5)
    const bezel = roundRect(32.2, 42.6, 74.4, 86.2, 6), screen = 'M36.6 48.6C36.6 45.8 38.2 44.8 41 44.8H65.6C68.4 44.8 70 45.8 70 48.6V80.4C70 83.2 68.4 84.2 65.6 84.2H41C38.2 84.2 36.6 83.2 36.6 80.4Z'
    const leg = (x0: number, x1: number) => `M${x0 - 1.6} 89H${x0 + 1.6}L${x1 + 0.7} 98.4H${x1 - 0.7}Z`
    const knob = (y: number) =>
      k.draw([{ d: ellipse(83, y, 3.6, 3.6), fill: P.gold, inner: k.sh(ellipse(83, y, 3.6, 3.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.5) +
      `<circle cx="83" cy="${y}" r="2" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/><path d="M83 ${f(y - 2)}V${f(y - 0.6)}" stroke="${P.ink}" stroke-width=".6"/>` +
      Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${f(83 + Math.cos(a) * 3.6)} ${f(y + Math.sin(a) * 3.6)}L${f(83 + Math.cos(a) * 4.3)} ${f(y + Math.sin(a) * 4.3)}" stroke="${P.goldD}" stroke-width=".4"/>` }).join('')
    const show =
      `<rect x="34" y="42" width="40" height="44" fill="${P.sky1}"/>` +
      k.shade('M34 42H74V86H34Z', k.lin(P.sky2, 0, 0, 0, 1, 0.9, 0), P.sky2, 0.4) +
      `<path d="M44.6 66.4H62L72 86H34.6Z" fill="${P.mid}"/><path d="M44.6 66.4H62M53.3 66.4V86M44.6 66.4L34.6 86M62 66.4L72 86" stroke="#fff" stroke-width=".8"/>` +
      `<path d="M41.8 66.6H64.8V71.6H41.8Z" fill="${P.night}" opacity=".35"/>` +
      Array.from({ length: 12 }, (_, i) => `<path d="M${f(42.6 + i * 1.9)} 63.6V71.6" stroke="${P.ink}" stroke-width=".3"/>`).join('') + `<path d="M41.8 67.8H64.8M41.8 69.8H64.8" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M41.8 62.6H64.8V64H41.8Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><path d="M64.8 61.4H66.2V72.6H64.8Z" fill="${P.night}"/>` +
      `<path d="M39.6 74C43 60 48 53.6 53 52.6" fill="none" stroke="${P.blue}" stroke-width=".7" stroke-dasharray="1.2 1"/>` +
      ball(k, 55, 52.6, 3.6, { seam: 20 }) + hair(57.6, 49, 59.6, 47.6, 61.6, 47.8, 0.4) +
      `<text x="53.6" y="80.6" ${GEORGIA} font-style="italic" font-size="4.8" fill="${P.ink}" text-anchor="middle" transform="translate(.4 .4)" opacity=".7">Continuará…</text>` +
      `<text x="53.6" y="80.6" ${GEORGIA} font-style="italic" font-size="4.8" fill="${P.white}" text-anchor="middle">Continuará…</text>` +
      Array.from({ length: 21 }, (_, i) => `<path d="M34 ${f(43 + i * 2)}H74" stroke="${P.ink}" stroke-width=".25" opacity=".18"/>`).join('') +
      `<path d="M38 60L52 44.6H58L38 66Z" fill="#fff" opacity=".28"/>` +
      `<path d="${screen}" fill="${k.rad(P.night, 0.5, 0.5, 0.75, 0, 0.55)}"/>`
    const lace = Array.from({ length: 9 }, (_, i) => `<path d="M${f(49.6 + i * 2.3)} 38.6A1.15 1.15 0 0 0 ${f(51.9 + i * 2.3)} 38.6" fill="${P.white}" stroke="${P.blue}" stroke-width=".3"/>`).join('')
    return (
      k.day() +
      k.sun(60, 60, 22, 48, 28, false) +
      k.floor(61, 98.4, 30, 2.4, P.mid) +
      `<path d="M58.8 37L50.4 25.6M61.2 37L71 26.4" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M58.8 37L50.4 25.6M61.2 37L71 26.4" stroke="${P.sky1}" stroke-width=".6" stroke-linecap="round"/>` +
      `<circle cx="50.4" cy="25.6" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="71" cy="26.4" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.draw([
        { d: leg(36, 34.4), fill: P.brownD }, { d: leg(84, 85.6), fill: P.brownD }, { d: leg(46, 46), fill: P.brownD }, { d: leg(74, 74), fill: P.brownD },
        {
          d: cab, fill: P.brown, line: 0.4,
          inner: k.sh(cab, 0, 0, 1, 1, 0, 0.85, P.brownD, 0.45) + `<path d="M26 38H40V92H26Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0)}"/>` +
            hair(30, 50, 31, 66, 30, 84, 0.45, P.brownD) + hair(88, 46, 89, 62, 88, 80, 0.45, P.brownD) + `<path d="M30 88H90" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` +
            `<path d="${roundRect(76.6, 44, 89.4, 86, 1.6)}" fill="${P.brownD}" opacity=".35"/>` +
            Array.from({ length: 7 }, (_, i) => `<path d="M78 ${f(71.4 + i * 2)}H88" stroke="${P.night}" stroke-width=".9" stroke-linecap="round"/>`).join(''),
        },
        { d: bezel, fill: NEGRA, inner: k.sh(bezel, 0, 0, 1, 1, 0, 0.7, NEGRA_D, 0.4) },
      ], 0.75) +
      k.clip(screen, show) + `<path d="${screen}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      knob(52) + knob(62.4) +
      `<path d="M52.4 38.6C52.4 36 55.4 34.6 60 34.6C64.6 34.6 67.6 36 67.6 38.6Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/><path d="M54.4 37C56 36 58 35.8 60 35.8" fill="none" stroke="${P.sky2}" stroke-width=".5"/>` +
      `<path d="M49.6 38.6H70.6V40H49.6Z" fill="${P.white}" stroke="${P.blue}" stroke-width=".3"/>` + lace +
      sparkle(34, 34, 2.2) + sparkle(90, 34, 1.6) +
      k.defs()
    )
  },

  // ── Habitué ────────────────────────────────────────────────────────

  // Diez partidos: la tarjetita de sellos del club, completa (el último sello es la estrella), y el sello de goma.
  'Cliente frecuente': (u) => {
    const k = kit(u)
    const cardD = roundRect(-26, -17, 26, 17, 2.4)
    const stamp = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})" opacity=".88"><path d="${ellipse(0, -1.2, 2.4, 2.4)}" fill="${P.red}"/><path d="M-.6 1H.6L.8 3.6H-.8Z" fill="${P.red}"/><path d="${ellipse(0, -1.2, 1.4, 1.4)}" fill="none" stroke="${P.paper}" stroke-width=".35" stroke-dasharray=".6 .5"/></g>`
    const slots = [0, 1].map((row) => [0, 1, 2, 3, 4].map((i) => {
      const x = -19.2 + i * 9.6, y = -0.6 + row * 9.6, last = row === 1 && i === 4
      return `<circle cx="${x}" cy="${y}" r="3.9" fill="none" stroke="${P.sky2}" stroke-width=".45" stroke-dasharray="1 .6"/>` +
        (last ? `<path d="${starPath(x, y, 3.6, 1.5, 5)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".4" opacity=".95"/>` : stamp(x + ((i * 7) % 3) * 0.3 - 0.3, y, (i * 37 + row * 53) % 50 - 25))
    }).join('')).join('')
    const knob = ellipse(83.4, 41.6, 5.2, 4.6)
    const neck = 'M81.4 45.6H85.4L86.2 54H80.6Z'
    const base = roundRect(75, 54, 91.6, 60.4, 1.2)
    const rubberD = 'M75.8 60.4H90.8V62.6H75.8Z'
    return (
      k.day() +
      k.stage(58, 60, 33) +
      `<g transform="translate(53 63) rotate(-8)">` +
      k.cast([cardD], 2.4, 2.2) +
      k.draw([{
        d: cardD, fill: P.white, line: 0.4,
        inner: `<path d="M-27 -18H27V-9.2H-27Z" fill="${P.red}"/>` + k.sh('M-27 -18H27V-9.2H-27Z', 0, 0, 1, 0, 0, 0.6, P.wine, 0.4) + `<path d="M-27 -9.2H27" stroke="${P.gold}" stroke-width=".8"/>` +
          k.sh('M12 -18H27V18H12Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) + slots +
          `<path d="M-23 14.2H8" stroke="${P.sky2}" stroke-width=".4"/>`,
      }], 0.7) +
      `<text x="-22.6" y="-11.6" ${GEORGIA} font-weight="700" font-size="4.6" letter-spacing=".5" fill="${P.white}">CLUB</text>` +
      `<circle cx="23" cy="-13.6" r="1.3" fill="${P.white}"/>` +
      `</g>` +
      k.floor(84, 63.6, 10, 1.8, P.mid) +
      k.draw([
        { d: rubberD, fill: P.red },
        { d: base, fill: P.brown, line: 0.35, inner: k.sh(base, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) + `<path d="M76 56H90" stroke="${P.goldL}" stroke-width=".5"/>` + `<rect x="79.6" y="55.6" width="7.4" height="3.2" rx=".4" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><path d="${starPath(83.3, 57.2, 1.2, 0.5, 5)}" fill="${P.red}"/>` },
        { d: neck, fill: MADERA, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.85, P.brown, 0.45) },
        { d: knob, fill: MADERA, inner: k.sh(knob, 0, 0, 1, 1, 0, 0.9, P.brown, 0.45) + `<ellipse cx="81.6" cy="39.6" rx="1.6" ry="1" fill="#fff" opacity=".8"/>` },
      ], 0.7) +
      hair(76, 66.6, 74, 68.6, 71.6, 69, 0.6, P.red, 0.8) +
      sparkle(36, 40, 2.2) + sparkle(88, 80, 1.6) +
      k.defs()
    )
  },

  // Veinticinco: si traés el termo, ya sos de la casa. El termo verde de toda la vida, lleno de calcos.
  'Termo stickereado': (u) => {
    const k = kit(u)
    const cup = 'M46.8 25.2H69.2L68.4 36.4H47.6Z'
    const ring = 'M45.8 36.4H70.2V40H45.8Z'
    const body = roundRect(45, 40, 71, 90, 2.4)
    const bottom = 'M46.2 90H69.8L69 94.4H47Z'
    const handle = 'M71 46H75.8Q78.4 46 78.4 48.6V79.4Q78.4 82 75.8 82H71'
    const hammer = Array.from({ length: 34 }, (_, i) => `<ellipse cx="${f(46.6 + ((i * 37) % 24))}" cy="${f(42 + ((i * 53) % 46))}" rx="1.1" ry=".7" fill="${P.goldL}" opacity=".3"/>`).join('')
    const sticker = (inner: string, x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r})">${inner}</g>`
    const paddleSticker =
      `<g transform="scale(.44)"><path d="${BLADE}" fill="${P.white}" stroke="${P.white}" stroke-width="6" stroke-linejoin="round"/><path d="${HANDLE}" fill="${P.white}" stroke="${P.white}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="${BLADE}" fill="none" stroke="${P.ink}" stroke-width="8.2" stroke-linejoin="round" opacity=".25"/>` +
      `<path d="${BLADE}" fill="${MADERA}"/><path d="${HANDLE}" fill="${MADERA}" stroke="${P.brown}" stroke-width=".8"/><path d="${RUBBER}" fill="${P.red}"/><path d="M-9 -21C-7.4 -24.6 -4.6 -26.6 -1 -27" fill="none" stroke="#F39A96" stroke-width="2"/></g>`
    const sunSticker =
      `<circle r="6" fill="${P.white}" stroke="${P.blue}" stroke-width=".3"/><circle r="5" fill="${P.white}"/>` + k.clip(ellipse(0, 0, 5, 5), `<path d="M-5 -5H5V-1.7H-5ZM-5 1.7H5V5H-5Z" fill="${P.sky}"/>`) +
      `<circle r="1.3" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/>` + Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${f(Math.cos(a) * 1.6)} ${f(Math.sin(a) * 1.6)}L${f(Math.cos(a) * 2.5)} ${f(Math.sin(a) * 2.5)}" stroke="${P.goldD}" stroke-width=".4"/>` }).join('')
    const pong = `<path d="M-8 -3.4H8V3.4H-6.4L-8 1.8Z" fill="${P.white}" stroke="${P.blue}" stroke-width=".3"/><path d="M-8 1.8L-6.4 3.4L-6 1.6Z" fill="${P.sky2}"/><text x=".6" y="1.8" ${GEORGIA} font-weight="700" font-size="4.6" letter-spacing=".3" fill="${P.red}" text-anchor="middle">PONG</text>`
    const starSticker = `<path d="${starPath(0, 0, 5.2, 2.4, 5)}" fill="${P.white}" stroke="${P.white}" stroke-width="1.6" stroke-linejoin="round"/><path d="${starPath(0, 0, 4.4, 1.9, 5)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".4"/>`
    const ballSticker = `<circle r="3.8" fill="${P.white}" stroke="${P.blue}" stroke-width=".3"/><circle r="2.8" fill="${P.goldD}"/><path d="M-2.8 0A2.8 .9 0 0 0 2.8 0" fill="none" stroke="${P.white}" stroke-width=".35" transform="rotate(-20)"/><ellipse cx="-1" cy="-1" rx=".7" ry=".4" fill="#fff"/>`
    return (
      k.day() +
      k.stage(60, 60, 33) +
      `<g transform="translate(58 62) scale(.93) translate(-58 -62)">` +
      k.floor(60, 94.6, 17, 2.4, P.mid) +
      `<path d="${handle}" fill="none" stroke="${P.ink}" stroke-width="3.8" stroke-linecap="round"/><path d="${handle}" fill="none" stroke="${TERMO}" stroke-width="2.2" stroke-linecap="round"/><path d="M76.6 49V79" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` +
      k.draw([
        { d: bottom, fill: P.greenD, inner: k.sh(bottom, 0, 0, 1, 0, 0, 0.8, NEGRA_D, 0.35) + [48.6, 51.6, 54.6, 57.6, 60.6, 63.6, 66.6].map((x) => `<path d="M${x} 90.6V94" stroke="${NEGRA_D}" stroke-width=".4"/>`).join('') },
        { d: body, fill: TERMO, line: 0.4, inner: hammer + k.sh(body, 0, 0, 1, 0, 0, 0.9, P.greenD, 0.5) + `<path d="M44 40H51V90H44Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + `<path d="M47.6 43V87" stroke="#fff" stroke-width=".7" opacity=".5"/>` },
        { d: ring, fill: P.sky1, inner: k.sh(ring, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + `<path d="M46 38.2H70" stroke="${P.blue}" stroke-width=".35"/>` },
        { d: cup, fill: TERMO, line: 0.35, inner: hammer + k.sh(cup, 0, 0, 1, 0, 0, 0.85, P.greenD, 0.45) + [28.6, 31.4, 34].map((y) => `<path d="M46 ${y}H70" stroke="${NEGRA_D}" stroke-width=".45"/>`).join('') + `<path d="M48.6 26V36" stroke="#fff" stroke-width=".6" opacity=".55"/>` },
      ], 0.7) +
      sticker(paddleSticker, 53.6, 55.4, -16) + sticker(sunSticker, 64.4, 50, 8) + sticker(starSticker, 64.6, 71.4, 14) + sticker(ballSticker, 51, 74.6, 0) + sticker(pong, 58.4, 83.2, -6) +
      `</g>` +
      sparkle(36, 42, 2.2) + sparkle(86, 34, 1.6) +
      k.defs()
    )
  },

  // Cincuenta: el carnet de socio número 50, con foto (de la paleta) y todo, y el sello dorado del club.
  'Socio del club': (u) => {
    const k = kit(u)
    const cardD = roundRect(-27, -18, 27, 18, 2.2)
    const photo = 'M-23.4 -6.4H-8.6V12.4H-23.4Z'
    const corner = (x: number, y: number, r: number) => `<path d="M0 0H3.4L0 3.4Z" fill="${NEGRA}" transform="translate(${x} ${y}) rotate(${r})"/>`
    const guilloche = Array.from({ length: 6 }, (_, i) => `<path d="M-27 ${f(-7 + i * 4.4)}Q-20 ${f(-9.4 + i * 4.4)} -13 ${f(-7 + i * 4.4)}T1 ${f(-7 + i * 4.4)}T15 ${f(-7 + i * 4.4)}T29 ${f(-7 + i * 4.4)}" fill="none" stroke="${P.sky1}" stroke-width=".5"/>`).join('')
    const seal = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2, r = i % 2 ? 9.4 : 10.6; return `${i ? 'L' : 'M'}${f(83 + Math.cos(a) * r)} ${f(77 + Math.sin(a) * r)}` }).join('') + 'Z'
    return (
      k.day() +
      k.sun(60, 56, 20, 47, 28, false) +
      k.shade(ellipse(60, 58, 30, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      `<g transform="translate(57 57) rotate(-7)">` +
      k.cast([cardD], 2.6, 2.4) +
      k.draw([{
        d: cardD, fill: P.paper, line: 0.4,
        inner: guilloche + `<path d="M-28 -19H28V-9.6H-28Z" fill="${NEGRA}"/>` + `<path d="M-28 -9.6H28V-8H-28Z" fill="${P.red}"/>` + k.sh('M10 -19H28V19H10Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) +
          `<path d="${photo}" fill="${P.goldL}"/>` + k.clip(photo, k.sh(photo, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<g transform="translate(-16 5) rotate(-18) scale(.46)"><path d="${BLADE}" fill="${P.brown}"/><path d="${HANDLE}" fill="${P.brownD}"/><path d="${RUBBER}" fill="${P.brownD}"/></g>`) +
          `<path d="${photo}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` + corner(-23.4, -6.4, 0) + corner(-8.6, -6.4, 90) + corner(-8.6, 12.4, 180) + corner(-23.4, 12.4, 270) +
          `<path d="M-3 9.6H22" stroke="${P.sky2}" stroke-width=".4"/>` + hair(-1, 8.6, 5, 4.6, 9, 8.4, 0.6, P.mid) + hair(8, 8.4, 12, 5, 16, 8, 0.5, P.mid) +
          `<circle cx="22.4" cy="-13.6" r="1.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>`,
      }], 0.75) +
      `<text x="-3" y="-12.4" ${GEORGIA} font-weight="700" font-size="3.6" letter-spacing=".3" fill="${P.goldL}" text-anchor="middle">CLUB DE PING PONG</text>` +
      `<text x="-3" y="-1.4" ${GEORGIA} font-style="italic" font-size="4.2" fill="${P.mid}">socio</text>` +
      `<text x="-3" y="6.2" ${GEORGIA} font-weight="700" font-size="7.4" fill="${P.ink}">Nº 50</text>` +
      `</g>` +
      `<g transform="translate(-2.4 -3.4)">` +
      `<path d="M78.4 84L76.4 93.4L79.6 91.6L81.2 94.4L83.2 85.4Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/><path d="M87.4 84L89.4 93.4L86.2 91.6L84.6 94.4L82.6 85.4Z" fill="${NEGRA}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
      k.cast([seal], 1.4, 1.4) +
      k.draw([{ d: seal, fill: P.gold, inner: k.sh(seal, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M72 66H80V88H72Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` }], 0.6) +
      `<circle cx="83" cy="77" r="7.2" fill="none" stroke="${P.goldD}" stroke-width=".5"/><circle cx="83" cy="77" r="6.4" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
      `<path d="${starPath(83.4, 77.5, 4.6, 1.9, 5)}" fill="${P.goldD}"/><path d="${starPath(83, 77, 4.6, 1.9, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/>` +
      `</g>` +
      sparkle(33, 40, 2.2) + sparkle(88, 36, 1.6) + sparkle(30, 76, 1.3) +
      k.defs()
    )
  },

  // Cien: como la calabaza, con los años se cura. El mate imperial de virola cincelada, con la paleta grabada en el medallón.
  'Mate curado': (u) => {
    const k = kit(u)
    const gourd = 'M41.2 57C38 67.6 40 79.6 47.4 86.2C51.2 89.6 55.6 90.8 60 90.8C64.4 90.8 68.8 89.6 72.6 86.2C80 79.6 82 67.6 78.8 57Z'
    const band = 'M39.8 49.4H80.2L80.8 58.4C74 61.4 46 61.4 39.2 58.4Z'
    const rim = ellipse(60, 49.4, 20.2, 4.6), yerba = ellipse(60, 49.6, 17.8, 3.4)
    const yb = (x: number) => 89.4 - 8.2 * ((x - 60) / 16.4) ** 2
    const cradle = 'M43.6 78.6C48 84.4 53.4 86.8 60 86.8C66.6 86.8 72 84.4 76.4 78.6L77.4 84.6C73.2 91 67 93.6 60 93.6C53 93.6 46.8 91 42.6 84.6Z'
    const foot = 'M50.6 93.2H69.4L72.4 99H47.6Z'
    const medal = ellipse(60, 70.6, 7, 8.2)
    const silver = (d: string, line = 0) => ({ d, fill: P.white, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.blue, 0.45) + `<path d="${d}" fill="${k.lin(P.sky1, 0, 0, 0, 1, 0, 0.9)}"/>` })
    const rope = (y: number, x0: number, x1: number, dy = 0) => Array.from({ length: Math.round((x1 - x0) / 1.5) }, (_, i) => { const x = x0 + i * 1.5, yy = y + Math.pow((x - 60) / 20, 2) * dy; return `<path d="M${f(x)} ${f(yy + 0.7)}L${f(x + 1)} ${f(yy - 0.7)}" stroke="${P.blue}" stroke-width=".5"/>` }).join('')
    const scrolls = [-1, 1].map((sx) => `<g transform="translate(60 54) scale(${sx} 1)">` +
      `<path d="M3 0C5 -2.6 9 -3 11 -.8C12.6 1 11.4 3 9.6 2.6C8.2 2.2 8.4 .6 9.4 .4M11 -.8C13.6 -2.8 17.6 -2.4 19 0" fill="none" stroke="${P.mid}" stroke-width=".55" stroke-linecap="round"/>` +
      `<path d="M14.6 1.8C15.6 .6 17.2 .4 18 1.2" fill="none" stroke="${P.mid}" stroke-width=".45"/><circle cx="6" cy="1.6" r=".5" fill="${P.gold}"/></g>`).join('') +
      `<path d="M58.4 54L60 51.8L61.6 54L60 56.2Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/>`
    const gadroons = Array.from({ length: 9 }, (_, i) => { const x = 46 + i * 3.5, y = yb(x) + 1.2; return `<path d="M${f(x - 1.6)} ${f(y)}Q${f(x)} ${f(y + 3.6)} ${f(x + 1.6)} ${f(y)}" fill="none" stroke="${P.blue}" stroke-width=".45"/>` }).join('') +
      Array.from({ length: 12 }, (_, i) => { const x = 44.8 + i * 2.75; return `<circle cx="${f(x)}" cy="${f(yb(x) - 2.6)}" r=".55" fill="${P.white}" stroke="${P.blue}" stroke-width=".25"/>` }).join('')
    const straw = (d: string, c: string, w: number) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${w + 1.3}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`
    const engraved = `<g transform="translate(58.8 75) rotate(-28) scale(.31)"><path d="${BLADE}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="1.8"/><path d="${HANDLE}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="1.8"/><path d="${RUBBER}" fill="none" stroke="${P.goldD}" stroke-width="1.4"/></g>` +
      `<circle cx="64.2" cy="66.6" r="1.4" fill="${P.white}" stroke="${P.goldD}" stroke-width=".4"/>`
    return (
      k.day() +
      k.sun(60, 58, 20, 47, 28, false) +
      k.shade(ellipse(60, 62, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      k.floor(61, 98.6, 20, 2.4, P.mid) +
      straw('M66.6 49.6L75.2 32.6', P.white, 1.8) + `<path d="M67.2 48L74.4 33.6" stroke="${P.sky}" stroke-width=".5"/>` + straw('M75.2 32.6Q76.4 29.8 74.4 28.8', P.gold, 1.8) +
      `<ellipse cx="71.6" cy="39.6" rx="2.6" ry="1.4" transform="rotate(-63 71.6 39.6)" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><ellipse cx="73.2" cy="36.4" rx="1.8" ry="1" transform="rotate(-63 73.2 36.4)" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([
        silver(foot, 0.35),
        {
          d: gourd, fill: P.brownD, line: 0.4,
          inner: k.sh('M62 56C74 64 78 78 72 94H86V56Z', 0, 0, 1, 0, 0, 0.85, NEGRA_D, 0.5) + `<path d="${gourd}" fill="${k.rad(P.brown, 0.32, 0.45, 0.5, 0.8, 0)}"/>` +
            `<path d="M40 56H54V90H40Z" fill="${k.lin(P.brown, 0, 0, 1, 0, 1, 0)}"/>` + hair(44.4, 62, 43.6, 72, 47.4, 80, 1.1, P.goldL, 0.7) +
            hair(50, 60, 49, 70, 51, 80, 0.4, NEGRA_D, 0.6) + hair(70, 60, 72, 70, 69, 80, 0.4, NEGRA_D, 0.6),
        },
        silver(cradle, 0.35),
        silver(band, 0.35),
        silver(rim),
        { ...silver(medal, 0.35), inner: silver(medal).inner + `<path d="${ellipse(60, 70.6, 5.4, 6.6)}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` },
      ], 0.75) +
      `<path d="${foot}" fill="none"/>` + [52.4, 55.4, 58.4, 61.6, 64.6, 67.6].map((x) => `<path d="M${x} 93.8L${f(x + (x - 60) * 0.12)} 98.4" stroke="${P.blue}" stroke-width=".5"/>`).join('') +
      gadroons +
      rope(58.6, 39.8, 80.6, 1.4) + rope(50.4, 40.4, 80, 0) + scrolls +
      Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<circle cx="${f(60 + Math.cos(a) * 6.3)}" cy="${f(70.6 + Math.sin(a) * 7.5)}" r=".42" fill="${P.white}" stroke="${P.blue}" stroke-width=".2"/>` }).join('') +
      engraved +
      `<path d="${yerba}" fill="${P.green}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.clip(yerba, k.sh(yerba, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.4) + `<path d="M43 51C46 46.4 52 45.4 56 47.6C53 48.6 48 50 43 51Z" fill="${P.greenD}"/>`) +
      `<path d="M44.4 50.2C47 47.2 51.6 46.4 55 47.8" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` + [[50, 49.6], [53, 50.8], [62, 51.4], [58, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.goldL}"/>`).join('') +
      straw('M66.6 49.6L68.2 46.4', P.white, 1.8) +
      `<path d="M42 50C46 47.4 52 46.6 56 46.6" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` +
      hair(42, 54, 44, 57.6, 47, 59, 0.6, '#fff', 0.8) + hair(46, 83, 50, 87.6, 55, 89.2, 0.5, '#fff', 0.7) +
      sparkle(41, 52.6, 1.6, '#fff') + sparkle(32, 40, 2.2) + sparkle(88, 44, 1.8) + sparkle(86, 82, 1.4) +
      k.defs()
    )
  },

  // Doscientos cincuenta: la paleta de guerra. Goma rayada, cinta en el borde, curita, las marcas de cada partido y su medalla.
  'Paleta de guerra': (u) => {
    const k = kit(u)
    const scratches =
      hair(-9, -20, -4, -16, 2, -17, 0.5, '#F39A96') + hair(-6, -8, 0, -10, 6, -7, 0.45, '#F39A96') + hair(3, -26, 6, -22, 10, -21, 0.4, '#F39A96') +
      hair(-11, -14, -9, -10, -6, -6.4, 0.4, '#F39A96') + hair(5, -14, 8, -12, 11, -13, 0.35, P.wine) + hair(-3, -24, -1, -22, 1, -23.6, 0.35, P.wine) +
      `<path d="${ellipse(0, -13.6, 5.6, 5)}" fill="${P.wine}" opacity=".35"/>`
    const band = roundRect(-6.4, -1.8, 6.4, 1.8, 1.8)
    const curita = `<g transform="translate(6.6 -19.6) rotate(-38)">` + k.draw([{ d: band, fill: CURITA, inner: k.sh(band, 0, 0, 0, 1, 0, 0.7, P.brown, 0.3) + `<path d="${roundRect(-2, -1.3, 2, 1.3, 0.4)}" fill="${CURITA_D}"/>` + `<circle cx="-4.4" cy="0" r=".3" fill="${CURITA_D}"/><circle cx="4.4" cy="0" r=".3" fill="${CURITA_D}"/>` }], 0.3) + `</g>`
    const chip = `<path d="M-13.4 -16.6L-10.6 -15.8L-11 -13.4L-9 -12L-11.8 -10.6L-13.6 -11.4Z" fill="${MADERA}" stroke="${P.ink}" stroke-width=".3"/>`
    const tape =
      `<path d="M-13.8 -12A14 14 0 0 1 9 -25.4" fill="none" stroke="${P.ink}" stroke-width="2.2"/><path d="M-13.8 -12A14 14 0 0 1 9 -25.4" fill="none" stroke="${NEGRA}" stroke-width="1.5"/>` +
      `<path d="M-12.8 -16A13.4 13.4 0 0 1 2 -27.8" fill="none" stroke="${P.sky2}" stroke-width=".35"/>` +
      `<path d="M9 -25.4L10.6 -23.6L9.8 -22.4L11.4 -21.2" fill="none" stroke="${P.ink}" stroke-width=".4"/>`
    const tally = [-2.2, -1.1, 0, 1.1].map((x) => `<path d="M${x} 11.2V16.4" stroke="${P.brownD}" stroke-width=".4"/>`).join('') + `<path d="M-2.8 15.8L1.8 11.6" stroke="${P.brownD}" stroke-width=".4"/>` +
      [-2.2, -1.1, 0, 1.1].map((x) => `<path d="M${x} 17.6V21" stroke="${P.brownD}" stroke-width=".4"/>`).join('')
    const medal = ellipse(48.4, 84.4, 5.2, 5.2)
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.85), P.night, 0.55) +
      k.sun(56, 50, 18, 47, 28, false) +
      k.shade(ellipse(56, 50, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.4) +
      laurel(52, 100, 30, 92, 26, 64, 8) + laurel(68, 100, 90, 92, 94, 64, 8, true) +
      k.cast([ellipse(54.6, 45, 19, 19)], 2.4, 2.4, NEGRA_D) +
      paddle(k, 60, 64.4, -16, { s: 1.35, over: scratches + curita + chip, handle: tally, top: tape }) +
      `<g transform="translate(0 2.4)">` +
      `<path d="M57.6 62.6C55 66 52.6 72 50.4 79" fill="none" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M57.6 62.6C55 66 52.6 72 50.4 79" fill="none" stroke="${P.sky}" stroke-width="2.2" stroke-linecap="round"/><path d="M57.4 63C55 66.4 52.8 72 50.8 78.6" fill="none" stroke="${P.white}" stroke-width=".7"/>` +
      `<path d="M61 62.4C63.6 64.6 65.4 67.6 66 71L63.4 69.6L62.4 72.2C62 69 61 66 59 63.6Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
      k.draw([{ d: ellipse(59.6, 62.4, 2.2, 1.8), fill: P.sky }], 0.4) +
      k.draw([{ d: medal, fill: P.gold, inner: k.sh(medal, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.55) +
      `<path d="${starPath(48.4, 84.4, 3.6, 1.5, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/><circle cx="48.4" cy="84.4" r="4.4" fill="none" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray=".01 .9" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(84, 34, 2.4, P.goldL) + sparkle(30, 46, 1.6, P.goldL) + sparkle(86, 70, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Dupla dinámica ─────────────────────────────────────────────────

  // Tres ganados en dobles: chocan las paletas (la roja y la negra) y la pelotita salta del festejo.
  'Chocá los cinco': (u) => {
    const k = kit(u)
    const burst = starPath(60, 38.6, 13, 5.4, 10, -90)
    return (
      k.day() +
      k.sun(60, 46, 16, 44, 28, false) +
      k.shade(burst, k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0.2), P.goldL, 0.5) +
      k.draw([{ d: burst, fill: P.white, inner: `<path d="${starPath(60, 38.6, 7.6, 3.4, 10, -72)}" fill="${P.goldL}"/>` }], 0.45) +
      hair(31, 62, 29, 52, 32.6, 42, 0.9, P.blue) + hair(27, 68, 24.6, 58, 27, 48, 0.6, P.blue) +
      hair(89, 62, 91, 52, 87.4, 42, 0.9, P.blue) + hair(93, 68, 95.4, 58, 93, 48, 0.6, P.blue) +
      k.floor(44, 90, 8, 1.6) + k.floor(76, 90, 8, 1.6) +
      paddle(k, 45, 66, 26) + paddle(k, 75, 66, -26, { negra: true }) +
      ball(k, 60, 24.6, 4.6, { seam: -10 }) +
      hair(55.6, 31, 56.6, 29.6, 57.2, 28, 0.5) + hair(64.4, 31, 63.4, 29.6, 62.8, 28, 0.5) +
      sparkle(36, 34, 2) + sparkle(84, 34, 1.8) +
      k.defs()
    )
  },

  // Diez juntos: son el Batman y Robin del club. La señal en el cielo, con la paleta y la pelotita.
  'Dúo dinámico': (u) => {
    const k = kit(u)
    const oval = ellipse(68, 37, 17.6, 11.4)
    const beam = 'M45.6 80L51.4 31.6C56 25.4 78 24.8 84.6 41.6L51.4 83.4Z'
    const emblem = `<g transform="translate(65 41.6) rotate(-40) scale(.38) translate(0 4)"><path d="${BLADE}" fill="${NEGRA}"/><path d="${HANDLE}" fill="${NEGRA}"/></g><circle cx="76.4" cy="30.6" r="2.6" fill="${NEGRA}"/>`
    const cloud = (x: number, y: number, s: number, lit: boolean) => {
      const d = 'M-10 3C-12.6 3 -13.4 0 -11.4 -1.4C-11.6 -4.6 -7.8 -6.2 -5.4 -4.4C-4 -7.8 1.4 -8.4 3 -5C5.6 -6.8 9.6 -5 9 -1.6C11.8 -1.4 12.6 3 9.6 3Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: lit ? P.blue : P.mid, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.night, 0.45) + (lit ? `<path d="${d}" fill="${k.lin(P.goldL, 0, 1, 0, 0, 0.6, 0)}"/>` : '') }], f(0.5 / s)) + `</g>`
    }
    const building = (x: number, w: number, h: number) => {
      const d = `M${x} 104V${104 - h}H${x + w}V104Z`
      const wins = Array.from({ length: Math.floor((h - 4) / 4.4) }, (_, r) => Array.from({ length: Math.floor((w - 2) / 3) }, (_, c) => ((r * 3 + c * 7 + x) % 5 < 2 ? `<rect x="${f(x + 1.6 + c * 3)}" y="${f(104 - h + 2.6 + r * 4.4)}" width="1.4" height="2" fill="${P.gold}"/>` : '')).join('')).join('')
      return k.draw([{ d, fill: NEGRA, inner: wins }], 0.5)
    }
    const lamp = 'M-7 -5.6H4.4V5.6H-7Z'
    return (
      k.night() +
      [[28, 50], [34, 30], [90, 60], [26, 70], [46, 22], [92, 74]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="${beam}" fill="${k.lin(P.goldL, 0, 1, 1, 0, 0.75, 0.25)}"/>` + k.shade(beam, k.lin(P.goldL, 0, 1, 1, 0, 0.4, 0), P.goldL, 0.2) +
      cloud(46, 56, 1.1, true) + cloud(86, 56, 0.9, true) +
      k.shade(ellipse(68, 37, 24, 17), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.35) +
      k.draw([{ d: oval, fill: P.goldL, inner: k.shade(oval, k.rad(P.gold, 0.5, 0.5, 0.5, 0, 0.9), P.gold, 0.4) }], 0.5) +
      emblem +
      cloud(48, 34, 0.7, true) +
      building(22, 12, 20) + building(70, 10, 24) + building(80, 12, 16) + building(92, 8, 26) +
      `<path d="M36 93H66V106H36Z" fill="${NEGRA}" stroke="${P.ink}" stroke-width=".8"/><path d="M36 93H66" stroke="${P.sky2}" stroke-width=".6"/>` +
      `<path d="M45 93L48 84.6H52L55 93Z" fill="${P.mid}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<g transform="translate(50 81) rotate(-66)">` +
      k.draw([{ d: lamp, fill: P.mid, inner: k.sh(lamp, 0, 0, 0, 1, 0, 0.8, P.night, 0.45) + `<path d="M-7 -4.4H4.4" stroke="${P.sky2}" stroke-width=".6"/><path d="M-4 -5.6V5.6M-1 -5.6V5.6" stroke="${P.night}" stroke-width=".5"/>` }, { d: ellipse(4.6, 0, 2.2, 6.4), fill: P.goldL, inner: k.shade(ellipse(4.6, 0, 2.2, 6.4), k.rad(P.gold, 0.5, 0.5, 0.5, 0, 0.8), P.gold, 0.3) }], 0.6) +
      `</g>` +
      `<path d="M45 85.6C43 83 43.4 79 46 77.6M55 85.6C57 83 56.6 79 54 77.6" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M45 85.6C43 83 43.4 79 46 77.6M55 85.6C57 83 56.6 79 54 77.6" fill="none" stroke="${P.sky2}" stroke-width=".6" stroke-linecap="round"/>` +
      sparkle(32, 40, 1.6, P.paper) + sparkle(88, 84, 1.3, P.paper) +
      k.defs()
    )
  },

  // Veinticinco juntos: la dupla definitiva, como en Córdoba. Dos fernet con coca que brindan (uno con pelotita, al estilo beer pong).
  'Fernet con coca': (u) => {
    const k = kit(u)
    const glass = 'M-10.8 -22L-8.8 22C-8.7 23.6 -7.6 24.6 -6 24.6H6C7.6 24.6 8.7 23.6 8.8 22L10.8 -22Z'
    const liquid = 'M-10 -13L-8.1 21.2C-8 22.4 -7.2 23 -6 23H6C7.2 23 8 22.4 8.1 21.2L10 -13Z'
    const foam = 'M-11.6 -21.4C-13 -24 -10.6 -26.8 -8 -25.6C-7 -28.4 -3 -28.8 -1.6 -26.6C0 -29 4.4 -28.6 5.2 -25.8C7.8 -27.2 11.4 -25.4 11 -22.4C12.8 -21 12 -18 10.4 -17.4L10.2 -13C4 -11.6 -4 -11.6 -10 -13L-10.6 -17.4C-12.4 -18 -12.8 -20.4 -11.6 -21.4Z'
    const drip = 'M8.6 -18C10 -16 10.6 -12 10.2 -9.6A1.2 1.2 0 0 1 7.8 -9.8C8 -12 8.2 -15 8 -17Z'
    const ice = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="${roundRect(-3.4, -3, 3.4, 3, 1)}" fill="${P.sky2}" opacity=".45" stroke="${P.white}" stroke-width=".4"/><path d="M-2.4 -1.8H1" stroke="#fff" stroke-width=".6" stroke-linecap="round"/></g>`
    const bubbles = [[-6, -20], [-2, -23], [3, -21], [7, -22], [-8, -17], [0, -18], [5, -16.6]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${0.5 + (i % 3) * 0.25}" fill="none" stroke="${P.goldD}" stroke-width=".3"/>`).join('')
    const one = (x: number, y: number, r: number, withBall: boolean) =>
      `<g transform="translate(${x} ${y}) rotate(${r})">` +
      k.floor(0, 25, 10, 1.8, P.mid) +
      k.draw([{
        d: glass, fill: P.white,
        inner: `<path d="${liquid}" fill="${FERNET}"/>` + `<path d="${liquid}" fill="${k.lin(P.red, 0, 0, 1, 0, 0.45, 0)}"/>` + k.sh(liquid, 0, 0, 1, 0, 0, 0.8, NEGRA_D, 0.45) +
          ice(-3, -9, 14) + ice(3.6, -7.4, -10) + ice(-1, -3.4, 30) +
          [[-5, 6], [2, 10], [-2, 15], [4, 2], [-6, -2]].map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r=".5" fill="none" stroke="${P.goldL}" stroke-width=".3" opacity=".7"/>`).join('') +
          `<path d="M-8.6 18H8.6V25H-8.6Z" fill="${P.sky1}" opacity=".55"/>` +
          `<path d="M-8 -20L-6.4 20" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".55"/><path d="M6.4 -18L5.2 18" stroke="#fff" stroke-width=".5" opacity=".4"/>`,
      }], 0.7) +
      k.draw([{ d: foam, fill: ESPUMA, inner: k.sh(foam, 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) + bubbles + `<path d="M-9 -23C-7 -25 -3.6 -25.4 -1.6 -24.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` }, { d: drip, fill: ESPUMA }], 0.5) +
      (withBall ? ball(k, 1.6, -26.6, 4.6, { seam: 18 }) : '') +
      `</g>`
    return (
      k.day() +
      k.sun(60, 52, 16, 46, 28, false) +
      k.shade(ellipse(60, 52, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      one(46.6, 65.4, 13, false) + one(73.4, 65.4, -13, true) +
      [[57, 36, 1.2, ESPUMA], [62.6, 34, 1, ESPUMA], [60, 31, 0.8, FERNET], [55, 31.6, 0.7, FERNET], [64.8, 37.6, 0.8, FERNET], [58.4, 27.6, 0.6, ESPUMA]].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      hair(55, 40, 53, 36, 53.6, 32, 0.5) + hair(65, 40, 67, 36, 66.4, 32, 0.5) +
      sparkle(32, 40, 2.2) + sparkle(89, 50, 1.6) + sparkle(60, 23.6, 1.8) +
      k.defs()
    )
  },
}
