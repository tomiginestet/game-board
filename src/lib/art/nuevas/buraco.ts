// Medallas del Buraco, redibujadas (ver el kit en ../kit.ts): canastas limpias y sucias, cierres y el muerto.
import { f } from '../helpers'
import { along, ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Rosado del chancho y del jamón de los sánguches. */
const PINK = '#EFB3A6', PINK_D = '#C9776E'
/** El agua del Riachuelo. */
const MURK = '#77803F', MURK_D = '#454B24'

/** Varilla entintada (manija, cordón, cadena): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

// ── Naipes ───────────────────────────────────────────────────────────

type Suit = 'h' | 'd' | 'c' | 's'
/** Un naipe francés: de frente (valor y palo), el comodín, o de dorso (mazo azul o rojo, como los dos mazos del buraco). */
type Face = [string, Suit] | 'joker' | 'blue' | 'red'

/** Palos centrados en (0,0), de unas 10 unidades de alto. */
const SUIT: Record<Suit, string> = {
  h: 'M0 4.8C-6 1 -5.8 -4.6 -2.5 -4.6C-1.2 -4.6 -.3 -3.8 0 -2.7C.3 -3.8 1.2 -4.6 2.5 -4.6C5.8 -4.6 6 1 0 4.8Z',
  d: 'M0 -5.4Q1.9 -2.5 4 0Q1.9 2.5 0 5.4Q-1.9 2.5 -4 0Q-1.9 -2.5 0 -5.4Z',
  s: 'M0 -5.2C-1.8 -2.6 -5.2 -1.2 -5.2 1.6C-5.2 3.6 -2.6 4.4 -.9 2.8L-1.9 5.2H1.9L.9 2.8C2.6 4.4 5.2 3.6 5.2 1.6C5.2 -1.2 1.8 -2.6 0 -5.2Z',
  c: ellipse(0, -2.5, 2.4, 2.4) + ellipse(-2.6, 1.4, 2.4, 2.4) + ellipse(2.6, 1.4, 2.4, 2.4) + 'M-.8 1L-1.9 5.2H1.9L.8 1Z',
}
const isRed = (s: Suit) => s === 'h' || s === 'd'
const pip = (s: Suit, x: number, y: number, sc: number) => `<path d="${SUIT[s]}" transform="translate(${x} ${y}) scale(${sc})" fill="${isRed(s) ? P.red : P.ink}"/>`

/** El naipe, con la base en (0,0): 13 de ancho por 18.4 de alto. */
const CARD = roundRect(-6.5, -18.4, 6.5, 0, 1.3)
const CARD_IN = roundRect(-5.1, -17, 5.1, -1.4, 0.7)
const LATTICE = Array.from({ length: 13 }, (_, i) => {
  const x = -26 + i * 2.6
  return `M${f(x)} -19L${f(x + 20)} 1M${f(x + 20)} -19L${f(x)} 1`
}).join('')

/** Gorro de bufón del comodín, centrado en (0,0) y de unas 18 unidades de ancho. */
function jester(k: Kit) {
  const L = 'M-5.4 2C-5.6 -2 -6.8 -4.8 -9 -6.6C-5.2 -7 -2.4 -4.6 -1.6 -1.4Z'
  const R = 'M5.4 2C5.6 -2 6.8 -4.8 9 -6.6C5.2 -7 2.4 -4.6 1.6 -1.4Z'
  const M = 'M-2.8 2C-2.6 -4 -1.4 -8.6 0 -11.4C1.4 -8.6 2.6 -4 2.8 2Z'
  const band = roundRect(-6.4, 1.2, 6.4, 4.8, 1.2)
  return (
    k.draw([
      { d: L, fill: P.red, inner: k.sh(L, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
      { d: R, fill: P.mid, inner: k.sh(R, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) },
      { d: M, fill: P.gold, inner: k.sh(M, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) },
      { d: band, fill: P.white, inner: [-3.6, 0, 3.6].map((x) => `<path d="M${x} 1.8L${x + 1.2} 3L${x} 4.2L${x - 1.2} 3Z" fill="${P.red}"/>`).join('') },
    ], 0.8) +
    [[-9, -6.6], [0, -11.4], [9, -6.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/>`).join('')
  )
}

/** Lo que va adentro de un naipe (en sus coordenadas, con la base en y=0): relleno, dibujo recortado y dibujo encima. */
function faceOf(k: Kit, face: Face): { fill: string; inner: string; over: string } {
  if (face === 'blue' || face === 'red') {
    const dk = face === 'blue' ? P.night : P.wine
    return {
      fill: face === 'blue' ? P.mid : P.red,
      inner:
        k.clip(CARD_IN, `<path d="${LATTICE}" stroke="${P.paper}" stroke-width=".32" opacity=".5"/>`) +
        `<path d="${CARD_IN}" fill="none" stroke="${P.paper}" stroke-width=".5"/>` +
        `<path d="M0 -13.4L2.8 -9.2L0 -5L-2.8 -9.2Z" fill="${P.paper}" stroke="${dk}" stroke-width=".3"/>` +
        k.sh('M.5 -20H8V1H.5Z', 0, 0, 1, 0, 0, 0.8, dk, 0.35),
      over: '',
    }
  }
  const inner = k.sh('M1.6 -20H8V1H1.6Z', 0, 0, 1, 0, 0, 0.55, P.blue, 0.3)
  if (face === 'joker') {
    return {
      fill: P.white, inner,
      over: `<path d="${starPath(-4.1, -14.6, 2.4, 1, 5)}" fill="${P.red}"/>` + `<g transform="translate(.5 -7.2) scale(.5)">${jester(k)}</g>`,
    }
  }
  const [r, s] = face
  const c = isRed(s) ? P.red : P.ink
  return {
    fill: P.white, inner,
    over:
      `<text x="-4.1" y="-13.4" ${GEORGIA} font-weight="700" font-size="${r.length > 1 ? 3.7 : 4.6}"${r.length > 1 ? ' letter-spacing="-.4"' : ''} fill="${c}" text-anchor="middle">${r}</text>` +
      pip(s, -4.1, -10.2, 0.34) + pip(s, 0.9, -6.8, 0.72),
  }
}

/** Naipe parado, con la base en el origen de `t`. */
function naipe(k: Kit, face: Face, t: string, w = 0.42) {
  const { fill, inner, over } = faceOf(k, face)
  return `<g transform="${t}">` + k.draw([{ d: CARD, fill, inner }], w) + over + `</g>`
}

/** Abanico de naipes alrededor de (cx,cy): de -spread a +spread grados, a distancia R. */
function fan(k: Kit, faces: Face[], cx: number, cy: number, spread: number, R: number, s = 1, w = 0.42) {
  const n = faces.length
  return faces.map((fc, i) => naipe(k, fc, `translate(${cx} ${cy}) rotate(${f(n > 1 ? -spread + (2 * spread * i) / (n - 1) : 0)}) translate(0 ${-R}) scale(${s})`, w / s)).join('')
}

const g3 = (n: number) => +n.toFixed(3)
/** Matriz que acuesta un naipe sobre la mesa: girado `a` grados, achatado `q` y escalado `s`. */
const lay = (a: number, q: number, s = 1) => {
  const r = (a * Math.PI) / 180, c = Math.cos(r) * s, n = Math.sin(r) * s
  return { m: `matrix(${g3(c)} ${g3(n * q)} ${g3(-n)} ${g3(c * q)} 0 0)`, p: (x: number, y: number) => `${f(c * x - n * y)} ${f(q * (n * x + c * y))}` }
}
/** Contorno de un naipe acostado, centrado en (0,0) (calculado, para que la línea no se deforme). */
function flatCard(a: number, q: number, s = 1) {
  const { p } = lay(a, q, s)
  const W = 6.5, H = 9.2, R = 1.3, pts: string[] = []
  for (const [cx, cy, a0] of [[W - R, -H + R, -90], [W - R, H - R, 0], [-W + R, H - R, 90], [-W + R, -H + R, 180]]) {
    for (let i = 0; i <= 4; i++) {
      const t = ((a0 + i * 22.5) * Math.PI) / 180
      pts.push(p(cx + R * Math.cos(t), cy + R * Math.sin(t)))
    }
  }
  return 'M' + pts.join('L') + 'Z'
}
/** Pila de naipes boca abajo (el muerto): `n` cartas con el dorso de arriba, centrada en (x,y). */
function pile(k: Kit, x: number, y: number, a: number, back: 'blue' | 'red', n = 11, q = 0.44, s = 1, dy = 0.5) {
  const d = flatCard(a, q, s), { m } = lay(a, q, s), { fill, inner } = faceOf(k, back)
  return k.draw([
    ...Array.from({ length: n }, (_, i) => ({ d, t: `translate(${x} ${f(y + (n - i) * dy)})`, fill: i % 2 ? P.white : P.paper, line: 0.22 })),
    { d, t: `translate(${x} ${y})`, fill, inner: `<g transform="${m} translate(0 9.2)">${inner}</g>` },
  ], 0.55)
}

/** Burbuja de jabón. */
const bubble = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" fill-opacity=".45" stroke="${P.blue}" stroke-width="${f(Math.min(0.45, r * 0.22))}"/>` +
  `<path d="M${f(x - r * 0.62)} ${f(y - r * 0.1)}A${f(r * 0.64)} ${f(r * 0.64)} 0 0 1 ${f(x - r * 0.05)} ${f(y - r * 0.64)}" fill="none" stroke="#fff" stroke-width="${f(r * 0.24)}" stroke-linecap="round"/>`

/** Pluma de avestruz que nace en (0,0), sube `L` y se vence `bend` hacia un costado: base suave y barbas sueltas. */
function ostrich(L: number, W: number, bend: number, dark: string, light: string, seed: number) {
  const N = 16, l: string[] = [], r: string[] = []
  const q = (t: number) => {
    const a = 1 - t
    return {
      x: t * t * bend, y: 2 * a * t * -L * 0.7 - t * t * L,
      dx: 2 * t * bend, dy: 2 * a * -L * 0.7 + 2 * t * (-L + L * 0.7),
    }
  }
  const env = (t: number) => W * Math.pow(Math.sin(Math.PI * t), 0.6) * (0.35 + 0.65 * t)
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = q(t), len = Math.hypot(p.dx, p.dy) || 1, nx = -p.dy / len, ny = p.dx / len, w = env(t) * 0.74
    l.push(`${f(p.x - nx * w)} ${f(p.y - ny * w)}`)
    r.push(`${f(p.x + nx * w)} ${f(p.y + ny * w)}`)
  }
  let barbs = hair(0, 0, 0, -L * 0.7, bend, -L, 0.5, light, 0.8)
  for (let i = 3; i <= 26; i++) {
    const t = i / 27, p = q(t), len = Math.hypot(p.dx, p.dy) || 1, tx = p.dx / len, ty = p.dy / len, nx = -ty, ny = tx
    for (const sd of [-1, 1]) {
      const w = env(t) * (1.08 + 0.12 * Math.sin(i * 1.9 + seed + sd)), droop = 0.35 + 0.25 * t
      const ex = p.x + sd * nx * w + tx * w * 0.35, ey = p.y + sd * ny * w + ty * w * 0.35 + droop * w
      barbs += hair(p.x, p.y, p.x + sd * nx * w * 0.6 + tx * w * 0.3, p.y + sd * ny * w * 0.6 + ty * w * 0.3, ex, ey, i % 3 ? 0.34 : 0.46, (i + (sd > 0 ? 1 : 0)) % 4 ? dark : light, 0.9)
    }
  }
  return { d: `M${l.join('L')}L${r.reverse().join('L')}Z`, barbs }
}

const ACES: Face[] = [['A', 'h'], ['A', 's'], ['A', 'd'], ['A', 'c'], ['A', 'h'], ['A', 's'], ['A', 'd']]

export const BURACO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Canastas limpias ───────────────────────────────────────────────

  // Cinco limpias: la canasta de ases sale del balde de zinc entre la espuma, en el patio recién baldeado.
  'Patio baldeado': (u) => {
    const k = kit(u)
    const body = 'M38.4 64L44.4 91.4C44.8 95 75.2 95 75.6 91.4L81.6 64Z'
    const mouth = ellipse(60, 64, 21.6, 4.6)
    const foam =
      'M38.6 65.2C34.6 63.8 34.8 58.8 39.4 59C39 55.2 43.6 53.6 46 56C47.2 52.8 51.8 52 54 54.8C55.8 51.8 61 51.6 63 54.6C64.8 51.8 69.6 52.2 70.8 55.6C73.4 53.2 78.4 54.6 78.2 58.4C82.4 58 84.6 62.6 82 65.2C74 69.8 46 69.8 38.6 65.2Z' +
      'M43.4 67.2C43 71.6 45.8 73.8 46.8 71.8C47.4 70.4 47 68.8 47.4 67.8Z M73.6 68C73.4 72.8 76.2 74.8 77 72.4C77.4 70.8 76.8 69.2 77.2 67.4Z'
    const xl = (y: number) => 38.4 + (y - 64) * 0.219
    const rib = (y: number) =>
      `<path d="M${f(xl(y))} ${y}C50 ${f(y + 4)} 70 ${f(y + 4)} ${f(120 - xl(y))} ${y}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M${f(xl(y) + 0.2)} ${f(y + 1)}C50 ${f(y + 5)} 70 ${f(y + 5)} ${f(120 - xl(y) - 0.2)} ${f(y + 1)}" fill="none" stroke="#fff" stroke-width=".7"/>` +
      `<path d="M${f(xl(y) + 0.3)} ${f(y + 1.9)}C50 ${f(y + 5.9)} 70 ${f(y + 5.9)} ${f(120 - xl(y) - 0.3)} ${f(y + 1.9)}" fill="none" stroke="${P.blue}" stroke-width=".35"/>`
    const seam = `<path d="M66.6 67.6L65.4 93" stroke="${P.blue}" stroke-width=".5"/>` + [70, 76, 82, 88].map((y) => `<circle cx="${f(66.4 - (y - 67.6) * 0.047)}" cy="${y}" r=".55" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    const grain = hair(48, 68, 49.4, 80, 50.6, 92, 0.35, P.sky2) + hair(54, 69, 54.6, 80, 55.2, 92.6, 0.3, P.sky2) + hair(72, 69, 71.6, 80, 70.8, 92, 0.35, P.blue, 0.6) + hair(77, 68, 76, 78, 74.6, 90, 0.35, P.blue, 0.6)
    const handle = 'M38.6 65.8Q60 104 81.4 65.8'
    const grip = roundRect(53.2, 82.4, 66.8, 87.2, 2.4)
    const ear = (x: number) => roundRect(f(x - 1.8), 62.6, f(x + 1.8), 67.8, 0.8)
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.shade(ellipse(60, 95.4, 28, 4), k.rad(P.sky, 0.5, 0.5, 0.5, 0.95, 0.15), P.blue, 0.5) +
      hair(36, 95.6, 41, 94.2, 46, 95.2, 0.5, '#fff') + hair(74, 96.4, 79, 95.4, 84, 96, 0.5, '#fff') +
      k.floor(61.6, 94.4, 18, 2.4, P.mid) +
      k.draw([
        {
          d: body, fill: P.sky1, line: 0.35,
          inner:
            grain + rib(72.6) + rib(83.4) + seam +
            k.sh('M64 60C73 68 75 80 73 98H86V60Z', 0, 0, 1, 0, 0, 0.95, P.blue, 0.45) + `<path d="M41 62H50V96H41Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.8, 0)}"/>` +
            k.sh('M36 86H84V96H36Z', 0, 0, 0, 1, 0, 0.65, P.mid, 0.3),
        },
        { d: mouth, fill: P.sky2, inner: k.sh(mouth, 0, 0, 0, 1, 0.9, 0, P.mid, 0.45) },
      ], 0.75) +
      fan(k, ACES, 60, 75, 33, 13.4, 1.14) +
      k.draw([{
        d: foam, fill: P.white,
        inner:
          k.sh('M34 60H86V75H34Z', 0, 0, 0, 1, 0, 0.75, P.sky2, 0.45) + k.sh('M64 52H86V75H64Z', 0, 0, 1, 0, 0, 0.6, P.sky, 0.3) +
          [[44, 61.4, 1.4], [50.6, 59, 1], [57, 62.4, 1.5], [64.6, 59.4, 1.1], [71, 62, 1.3], [77.4, 61, 0.8], [41, 63.4, 0.7], [53.4, 64.6, 0.8], [67.6, 65, 0.9]]
            .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.sky2}" stroke-width=".35"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.25)}" fill="#fff"/>`).join('') +
          hair(41, 59.6, 44, 57, 47.6, 58.4, 0.4, P.sky) + hair(56, 56.6, 59, 54.6, 62.4, 56.2, 0.4, P.sky) + hair(70, 57.4, 73, 55.6, 76.4, 57.8, 0.4, P.sky),
      }], 0.6) +
      rod(handle, P.sky1, 0.8) +
      k.draw([
        { d: grip, fill: P.brown, inner: k.sh(grip, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.45) + `<path d="M55 83.6H64.6" stroke="${P.goldL}" stroke-width=".5" stroke-linecap="round" opacity=".7"/>` },
        { d: ear(38.6), fill: P.sky2, inner: `<circle cx="38.6" cy="65.2" r=".7" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` },
        { d: ear(81.4), fill: P.sky2, inner: `<circle cx="81.4" cy="65.2" r=".7" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` },
      ], 0.5) +
      bubble(31.4, 48, 3) + bubble(88.6, 46, 2.4) + bubble(36.6, 35.4, 1.7) + bubble(82.4, 35, 1.4) + bubble(28, 62, 1.3) + bubble(92, 60, 1.2) +
      hair(30, 84, 26.6, 79, 29.6, 73, 0.65, P.blue) + hair(33.6, 82, 31, 77.4, 33.6, 72, 0.5, P.blue) +
      hair(90, 84, 93.4, 79, 90.4, 73, 0.65, P.blue) + hair(86.4, 82, 89, 77.4, 86.4, 72, 0.5, P.blue) +
      sparkle(44.6, 40, 2) + sparkle(75.6, 41.4, 1.6) + sparkle(60, 28, 1.4) +
      k.defs()
    )
  },

  // Veinticinco limpias: el mantel de los domingos, planchado y bordado; la gota de tuco no se anima a caer.
  'Mantel de domingo': (u) => {
    const k = kit(u)
    const top = 'M38.6 47H81.4L91 59.4H29Z'
    const drape = 'M29 59.4H91L92 76.4Q60 79.4 28 76.4Z'
    const lace = along(28, 76.4, 60, 79.4, 92, 76.4, Array.from({ length: 22 }, (_, i) => i / 21))
      .map((q) => `<circle cx="${f(q.x)}" cy="${f(q.y + 0.7)}" r="1.55" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(q.x)}" cy="${f(q.y + 1.2)}" r=".42" fill="${P.sky2}"/>`).join('')
    const flower = (x: number, y: number) =>
      `<path d="M${f(x - 2.4)} ${f(y + 0.6)}Q${f(x - 1.4)} ${f(y - 0.6)} ${x} ${y}Q${f(x - 0.6)} ${f(y + 1.2)} ${f(x - 2.4)} ${f(y + 0.6)}ZM${f(x + 2.4)} ${f(y + 0.6)}Q${f(x + 1.4)} ${f(y - 0.6)} ${x} ${y}Q${f(x + 0.6)} ${f(y + 1.2)} ${f(x + 2.4)} ${f(y + 0.6)}Z" fill="${P.green}"/>` +
      [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${f(x + Math.cos(((a - 90) * Math.PI) / 180) * 1)}" cy="${f(y - 0.6 + Math.sin(((a - 90) * Math.PI) / 180) * 1)}" rx=".75" ry=".75" fill="${P.red}"/>`).join('') +
      `<circle cx="${x}" cy="${f(y - 0.6)}" r=".5" fill="${P.gold}"/>`
    const leg = (x: number) => `M${f(x - 1.8)} 77.6H${f(x + 1.8)}L${f(x + 1.3)} 80.4L${f(x + 1.8)} 82.2L${f(x + 1)} 88.4H${f(x - 1)}L${f(x - 1.8)} 82.2L${f(x - 1.3)} 80.4Z`
    const hearts: Face[] = [['4', 'h'], ['5', 'h'], ['6', 'h'], ['7', 'h'], ['8', 'h'], ['9', 'h'], ['10', 'h']]
    const spoon = taper(101, 29.4, 92, 32.4, 83, 36, 3.4, 2.4)
    const bowl = ellipse(76.4, 38.4, 6.4, 4.3)
    const drop = 'M70.6 41.2C71 43.2 72.6 44.6 72.6 46.4C72.6 47.8 71.7 48.6 70.6 48.6C69.5 48.6 68.6 47.8 68.6 46.4C68.6 44.6 70.2 43.2 70.6 41.2Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(60, 88.6, 27, 2.2) +
      k.draw([{ d: leg(45.6), fill: P.brownD }, { d: leg(74.4), fill: P.brownD }], 0.5) +
      k.draw([{ d: leg(39), fill: P.brown, inner: k.sh(leg(39), 0, 0, 1, 0, 0, 0.9, P.brownD, 0.4) }, { d: leg(81), fill: P.brown, inner: k.sh(leg(81), 0, 0, 1, 0, 0, 0.9, P.brownD, 0.4) }], 0.55) +
      lace +
      k.draw([
        {
          d: drape, fill: P.white,
          inner:
            k.sh('M68 56C82 62 88 70 88 82H96V56Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + k.sh('M26 58H94V63H26Z', 0, 0, 0, 1, 0.75, 0, P.blue, 0.35) +
            [44.4, 60, 75.6].map((x) => `<path d="M${x} 59.4V${f(78.6 - Math.abs(x - 60) * 0.04)}" stroke="${P.sky2}" stroke-width=".45"/><path d="M${f(x + 0.6)} 59.4V78" stroke="#fff" stroke-width=".5"/>`).join('') +
            `<path d="M28.6 68Q60 71 91.4 68" fill="none" stroke="${P.mid}" stroke-width=".6" stroke-dasharray="1 .9"/><path d="M28.4 74Q60 77 91.6 74" fill="none" stroke="${P.mid}" stroke-width=".6" stroke-dasharray="1 .9"/>` +
            [34, 47.4, 60.8, 74.2, 87.4].map((x) => flower(x, 71.6 + (1 - ((x - 60) / 32) ** 2) * 1.4)).join('') +
            hair(33, 60, 32.4, 68, 31, 76, 0.5, P.blue) + hair(87, 60, 87.6, 68, 89, 76, 0.5, P.blue),
        },
        {
          d: top, fill: P.white,
          inner:
            k.sh(top, 0, 0, 1, 1, 0, 0.55, P.sky2, 0.4) +
            `<path d="M60 47V59.4M34 53.2H86" stroke="${P.sky2}" stroke-width=".45"/><path d="M60.6 47V59.4M34 53.8H86" stroke="#fff" stroke-width=".5"/>` +
            `<path d="M40.8 48.6H79.2L87 58.2H33Z" fill="none" stroke="${P.sky}" stroke-width=".45" stroke-dasharray=".01 1.3" stroke-linecap="round"/>`,
        },
      ], 0.75) +
      k.floor(61, 57.2, 17, 1.6, P.blue) +
      `<g transform="translate(60 53.4) scale(1 .5)">${fan(k, hearts, 0, 8, 40, 2, 0.9, 0.6)}</g>` +
      k.draw([
        { d: spoon, fill: P.brown, inner: k.sh(spoon, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.4) + `<path d="M85 34.4L99 29" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` },
        { d: bowl, t: 'rotate(-16 76.4 38.4)', fill: P.brown, inner: `<path d="${ellipse(76.6, 38, 5, 3.1)}" fill="${P.red}"/>` + k.sh(ellipse(76.6, 38, 5, 3.1), 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + `<ellipse cx="74.6" cy="37" rx="1.4" ry=".6" fill="#fff" opacity=".6"/>` },
        { d: drop, fill: P.red, inner: k.sh(drop, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + `<ellipse cx="69.9" cy="45.6" rx=".5" ry=".8" fill="#fff" opacity=".85"/>` },
      ], 0.5) +
      hair(66, 43.4, 65, 45.4, 66, 47.4, 0.45) + hair(75.2, 43.4, 76.2, 45.4, 75.2, 47.4, 0.45) + hair(64.4, 42.4, 63.4, 45.4, 64.4, 48.4, 0.35) + hair(76.8, 42.4, 77.8, 45.4, 76.8, 48.4, 0.35) +
      sparkle(34, 40, 2.2) + sparkle(46, 32, 1.4) + sparkle(88, 50, 1.4) +
      k.defs()
    )
  },

  // Ochenta limpias: el plumero de la abuela, en alto como un estandarte. Ni una mota de polvo.
  'Abuela con plumero': (u) => {
    const k = kit(u)
    const layer = (angles: number[], L: number, W: number, fill: string, dark: string, light: string, seed: number) => {
      const ps = angles.map((a, i) => ({ a, p: ostrich(L - Math.abs(a) / 9, W, (a / 70) * 8, dark, light, seed + i) }))
      return k.draw(ps.map(({ a, p }) => ({ d: p.d, t: `rotate(${a})`, fill, inner: k.sh(p.d, 0, 0, 1, 1, 0, 0.8, P.night, 0.3) })), 0.4) +
        ps.map(({ a, p }) => `<g transform="rotate(${a})">${p.barbs}</g>`).join('')
    }
    const head =
      layer([-76, -54, -32, -10, 12, 34, 56, 78], 29, 8.6, P.mid, P.night, P.sky2, 0) +
      layer([-44, -21, 2, 25, 48], 24.6, 8, P.blue, P.mid, P.sky1, 3) +
      layer([-24, 0, 24], 18, 7, P.sky2, P.blue, P.white, 7)
    const wisps = ''
    const handle = taper(0, 7.6, 0.2, 18, 0, 28, 4.6, 3.8)
    const ferrule = 'M-3.6 -.6H3.6L3.2 7.8H-3.2Z'
    const knob = ellipse(0, 30.6, 3, 2.6)
    const ring = roundRect(-2.7, 26.6, 2.7, 28.8, 0.9)
    const bow = 'M0 10.4C-3.6 7.4 -8 7.8 -7.6 10.6C-7.2 13.4 -3.4 13.2 0 10.4ZM0 10.4C3.6 7.4 8 7.8 7.6 10.6C7.2 13.4 3.4 13.2 0 10.4Z'
    const tails = 'M-.8 10.6L-4.6 19.6L-2.8 19L-2.2 20.8L.6 11.2ZM.8 10.6L4.2 18.4L2.6 18L1.8 19.8L-.4 11.2Z'
    return (
      k.day() +
      k.sun(60, 50, 17, 47, 28, false) +
      k.shade(ellipse(57, 42, 25, 23), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(51, 99, 31, 90, 28, 64, 7) + laurel(69, 99, 89, 90, 92, 64, 7, true) +
      `<g transform="translate(58 61) rotate(-12) scale(1.06)">` +
      k.cast([handle, ferrule], 1.6, 1.4) +
      rod('M0 32.6C-3.4 36.2 -2 39.6 1.2 39C3.8 38.4 3.4 35 1 33.2', P.red, 0.7) +
      k.draw([
        { d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.95, P.brownD, 0.5) + `<path d="M-1.4 9V26" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round" opacity=".75"/>` + hair(1, 12, 1.6, 19, 0.8, 26, 0.4, P.brownD) + hair(-0.6, 15, -0.2, 19, -0.8, 23, 0.3, P.brownD) },
        { d: ring, fill: P.gold, inner: k.sh(ring, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) },
        { d: knob, fill: P.brown, inner: k.sh(knob, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + `<ellipse cx="-1" cy="29.8" rx=".9" ry=".5" fill="${P.goldL}" opacity=".7"/>` },
      ], 0.6) +
      wisps + head +
      k.draw([{
        d: ferrule, fill: P.gold, line: 0.3,
        inner:
          k.sh(ferrule, 0, 0, 1, 0, 0, 1, P.goldD, 0.45) + `<path d="M-2.4 -.6H-1V7.8H-2.4Z" fill="#fff" opacity=".45"/>` +
          `<path d="M-3.6 1.4H3.6M-3.4 6H3.4" stroke="${P.goldD}" stroke-width=".45"/>` +
          [-2.4, -0.8, 0.8, 2.4].map((x) => `<circle cx="${x}" cy="3.7" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`).join(''),
      }], 0.6) +
      k.draw([
        { d: tails, fill: P.red, inner: k.sh(tails, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) },
        { d: bow, fill: P.red, inner: k.sh(bow, 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) + hair(-6.4, 10.4, -4, 9.4, -1.4, 10.4, 0.35, P.wine) + hair(6.4, 10.4, 4, 9.4, 1.4, 10.4, 0.35, P.wine) },
      ], 0.5) +
      `<circle cx="0" cy="10.4" r="1.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-.4" cy="10" r=".4" fill="#fff" opacity=".8"/>` +
      `</g>` +
      sparkle(84, 38, 2.8) + sparkle(31, 44, 2) + sparkle(76, 22.6, 1.4) + sparkle(40, 26, 1.2) +
      k.defs()
    )
  },

  // ── Canastas sucias ────────────────────────────────────────────────

  // Cinco sucias: el botín embarrado en plena patada, con el comodín pegado en los tapones.
  'Botines embarrados': (u) => {
    const k = kit(u)
    const boot = 'M-19.4 .6C-21.8 -2.6 -22.8 -7.6 -21.6 -12.6C-16.8 -14.2 -12.2 -14.8 -8.4 -14.6C-8 -17.6 -6.4 -19.4 -4.2 -19.2C-2.4 -19 -1.8 -17.6 -2.2 -16.2C.4 -13.6 4.4 -11.8 9.6 -10.6C15.6 -9.2 20.6 -7.4 22.4 -4.4C23.4 -2.4 22.8 .6 20.4 .6Z'
    const studs = [-17, -12.4, 0.4, 6.4, 12.4, 17.6].map((x) => `M${f(x - 1.9)} .4L${f(x - 1.2)} 4.4H${f(x + 1.2)}L${f(x + 1.9)} .4Z`).join('')
    const mud = 'M8.6 -10.4C14.8 -9 20.6 -7.2 22.4 -4.4C23.4 -2.4 22.8 .6 20.4 .8H4.4C2.4 -.4 3.2 -3 5.6 -3.4C4 -5.4 5.6 -8.6 8 -8.2C7.8 -9.2 8 -10.2 8.6 -10.4Z'
    const bars = [0, 1, 2, 3, 4].map((i) => {
      const x = -2.6 + i * 2.9, y = -15.8 + i * 1.25
      return `M${f(x - 0.9)} ${f(y - 1.3)}L${f(x + 0.9)} ${f(y + 1.3)}`
    }).join('')
    const knot = 'M-3.4 -17.4C-6.6 -20.6 -9.6 -19.6 -8.6 -17.6C-7.8 -16.2 -5.4 -16.6 -3.4 -17.4ZM-3.4 -17.4C-2.6 -21.4 .2 -22.6 1 -20.8C1.6 -19.2 -.6 -17.8 -3.4 -17.4Z'
    const blob = (x: number, y: number, r: number) => `<path d="M${f(x - r)} ${y}C${f(x - r)} ${f(y - r * 1.2)} ${f(x + r * 0.6)} ${f(y - r * 1.3)} ${f(x + r)} ${f(y - r * 0.2)}C${f(x + r * 1.4)} ${f(y + r * 0.8)} ${f(x + r * 0.2)} ${f(y + r * 1.2)} ${f(x - r * 0.4)} ${f(y + r)}C${f(x - r)} ${f(y + r * 0.9)} ${f(x - r * 1.1)} ${f(y + r * 0.4)} ${f(x - r)} ${y}Z" fill="${P.brown}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.25)}" fill="${P.goldL}" opacity=".7"/>`
    const puddle = ellipse(60, 91.6, 25, 4.2)
    return (
      k.day() +
      k.stage(60, 60, 34) +
      `<path d="${puddle}" fill="${P.brown}"/>` + k.shade(puddle, k.rad(P.brownD, 0.5, 0.4, 0.6, 0, 1), P.brownD, 0.45) +
      hair(41, 90.4, 46, 89.4, 51, 90.2, 0.5, P.goldL) + hair(66, 93, 71, 92.2, 76, 92.8, 0.5, P.goldL) +
      `<path d="M50 91C48.4 88 47 86.6 45.6 86.4M70 91C71.6 88 73 86.6 74.4 86.4M60 90.4V86.6" fill="none" stroke="${P.brownD}" stroke-width=".6" stroke-linecap="round"/>` +
      `<circle cx="45.2" cy="85.6" r=".9" fill="${P.brown}" stroke="${P.ink}" stroke-width=".3"/><circle cx="74.8" cy="85.6" r=".9" fill="${P.brown}" stroke="${P.ink}" stroke-width=".3"/><circle cx="60" cy="85.4" r=".8" fill="${P.brown}" stroke="${P.ink}" stroke-width=".3"/>` +
      hair(22.6, 46, 27, 45.6, 31.4, 46.8, 0.7, P.blue) + hair(23.4, 54, 28, 53.8, 32.6, 55, 0.8, P.blue) + hair(25, 62, 29, 62, 33.6, 62.8, 0.6, P.blue) +
      `<g transform="translate(59 62) rotate(-7) scale(1.42)">` +
      naipe(k, 'joker', 'translate(-13.4 15.4) rotate(12) scale(.68)', 0.5) +
      k.draw([
        { d: studs, fill: P.white, inner: `<path d="M-30 2.6H30V6H-30Z" fill="${P.brown}"/>` + k.sh('M-30 0H30V6H-30Z', 1, 0, 0, 0, 0, 0.5, P.blue, 0.3) },
        {
          d: boot, fill: P.night,
          inner:
            `<path d="M-24 -1.6H26V2H-24Z" fill="${P.ink}"/>` +
            `<path d="M-21.8 -11.6C-22.6 -7.6 -21.8 -3.6 -20.2 -1.4H-16.4C-17.6 -4.2 -18 -8.4 -17.4 -12.4Z" fill="${P.red}"/>` + k.sh('M-23 -13H-16V0H-23Z', 0, 0, 0, 1, 0, 0.7, P.wine, 0.35) +
            `<path d="M-21.6 -12.6C-16.8 -14.2 -12.2 -14.8 -8.4 -14.6C-12.6 -12.8 -17.2 -12 -21.6 -12.6Z" fill="${P.ink}"/><path d="M-20 -12.9C-16.4 -13.7 -13 -14 -10.4 -13.9" fill="none" stroke="${P.red}" stroke-width=".45"/>` +
            k.sh('M-26 -8H26V2H-26Z', 0, 0, 0, 1, 0, 0.75, '#000', 0.35) + k.sh('M2 -20H26V2H2Z', 0, 0, 1, 0, 0, 0.5, '#000', 0.3) +
            hair(-15, -12.6, -7, -10.8, 1, -7.6, 0.8, P.sky2, 0.5) + hair(-20, -10.4, -20.4, -6.6, -19, -3.4, 0.7, P.sky2, 0.45) + hair(-6, -18.4, -5.2, -17.8, -4.4, -16.6, 0.45, P.sky2, 0.6) +
            `<path d="M-3.8 -16.8L10.8 -11" stroke="${P.mid}" stroke-width="2.4" stroke-linecap="round"/>` +
            `<path d="M-20.6 -5.4C-10 -6 2 -5 11.4 -2.8M9.6 -9.8C12.4 -7 13 -3.6 12.4 -.6M-21 -2.4H22" fill="none" stroke="${P.sky2}" stroke-width=".32" stroke-dasharray=".7 .7"/>` +
            `<path d="M-6.8 -17.8H-4.2V-16.2H-6.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".2" transform="rotate(12 -5.5 -17)"/>` +
            `<path d="${mud}" fill="${P.brown}"/>` + k.sh(mud, 0, 0, 1, 1, 0, 0.95, P.brownD, 0.45) + hair(9.6, -9.2, 14.6, -8.2, 19.6, -5.8, 0.45, P.goldL, 0.8) +
            [[-3, -4.6, 0.9], [-10, -6.6, 0.7], [-15, -9.6, 0.5], [1, -9.4, 0.45], [-7.4, -2.8, 0.8], [-13, -3.2, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.brown}"/>`).join(''),
        },
      ], 0.6) +
      rod(bars, P.white, 0.55) +
      [0, 1, 2, 3, 4].map((i) => `<circle cx="${f(-3.5 + i * 2.9)}" cy="${f(-17.1 + i * 1.25)}" r=".32" fill="${P.sky2}"/>`).join('') +
      k.draw([{ d: knot, fill: P.white, inner: k.sh(knot, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) }], 0.35) +
      `<path d="M-3.4 -17.4C-4.6 -15.4 -5.4 -13.4 -5 -11.4M-3.4 -17.4C-2.4 -15.6 -1.2 -14.6 .2 -14" fill="none" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="M-3.4 -17.4C-4.6 -15.4 -5.4 -13.4 -5 -11.4M-3.4 -17.4C-2.4 -15.6 -1.2 -14.6 .2 -14" fill="none" stroke="${P.white}" stroke-width=".5" stroke-linecap="round"/>` +
      blob(-13.4, 2.8, 1.8) + blob(6.6, 4.2, 1.1) +
      `<path d="${taper(3.4, 4.2, 3.2, 6.2, 3.6, 8.4, 1.5, 0.7)}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".3"/><path d="${taper(14.6, 4.2, 14.8, 5.6, 14.4, 7.2, 1.3, 0.6)}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      blob(93, 46, 1.6) + blob(91, 36.4, 1.1) + blob(85.6, 30.6, 0.8) +
      hair(87.6, 47.4, 90, 46.8, 91.6, 46.4, 0.5, P.brownD) + hair(86.4, 40.4, 88.6, 38.4, 90, 37.2, 0.45, P.brownD) +
      sparkle(36, 34, 2) +
      k.defs()
    )
  },

  // Veinticinco sucias: una muestra de agua del Riachuelo. Adentro flota un comodín, un pescado en espinas… y algo mira.
  'Agua del Riachuelo': (u) => {
    const k = kit(u)
    const jar = 'M41.6 45C41.6 41.6 43.6 40.4 46 40.4H74C76.4 40.4 78.4 41.6 78.4 45V89C78.4 92.4 75.6 94 72 94H48C44.4 94 41.6 92.4 41.6 89Z'
    const lid = roundRect(43.4, 32.4, 76.6, 40.8, 1.6)
    const water = 'M38 55.4C46 53.6 52 56.6 60 54.8C68 53.2 74 56.2 82 54.8V98H38Z'
    const fish =
      `<g transform="translate(53 74) rotate(-8)">` +
      `<path d="M-9 0C-8 -3.6 -4.6 -4.6 -3 -3.4V3.4C-4.6 4.6 -8 3.6 -9 0Z" fill="none" stroke="${P.paper}" stroke-width=".8" stroke-linejoin="round"/>` +
      `<circle cx="-6.2" cy="-1" r=".9" fill="${P.paper}"/>` +
      `<path d="M-3 0H10" stroke="${P.paper}" stroke-width=".8"/>` +
      [0, 2.4, 4.8, 7.2].map((x) => `<path d="M${x} -3.4Q${x + 1} 0 ${x} 3.4" fill="none" stroke="${P.paper}" stroke-width=".6"/>`).join('') +
      `<path d="M10 0L14 -3.4V3.4Z" fill="none" stroke="${P.paper}" stroke-width=".7" stroke-linejoin="round"/>` +
      `</g>`
    const eye = `<ellipse cx="69" cy="86" rx="3.2" ry="2.2" fill="${P.paper}"/><circle cx="67.8" cy="86.2" r="1.3" fill="${P.ink}"/><circle cx="67.4" cy="85.8" r=".4" fill="#fff"/><path d="M65.6 84.6Q69 83 72.4 84.8" fill="none" stroke="${MURK_D}" stroke-width=".9"/>`
    const silt = Array.from({ length: 22 }, (_, i) => `<circle cx="${f(43 + ((i * 37) % 34))}" cy="${f(89 + ((i * 13) % 5))}" r="${0.3 + (i % 3) * 0.2}" fill="${P.brownD}" opacity=".7"/>`).join('')
    return (
      k.day() +
      k.stage(60, 62, 34) +
      k.floor(61, 94.6, 21, 2.6) +
      `<g transform="translate(60 63) scale(1.05) translate(-60 -63)">` +
      k.draw([
        {
          d: jar, fill: P.sky1,
          inner:
            `<path d="${water}" fill="${MURK}"/>` + k.sh(water, 0, 0, 0, 1, 0, 1, MURK_D, 0.6) +
            fish +
            naipe(k, 'joker', 'translate(66 66) rotate(22) scale(.62)', 0.7) +
            `<path d="${water}" fill="${MURK}" opacity=".35"/>` +
            eye + silt +
            `<path d="M38 55.4C46 53.6 52 56.6 60 54.8C68 53.2 74 56.2 82 54.8" fill="none" stroke="${P.goldL}" stroke-width=".7" opacity=".8"/>` +
            hair(44, 57.4, 49, 56.4, 54, 57.2, 0.45, P.sky, 0.8) + hair(62, 56.4, 66, 55.6, 70, 56.6, 0.45, P.red, 0.5) +
            [[48, 64, 1], [46, 82, 0.8], [58, 88, 0.6], [74, 74, 0.7], [50, 59, 0.5], [47, 70, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.paper}" stroke-width=".35" opacity=".8"/>`).join('') +
            k.sh('M64 38H82V96H64Z', 0, 0, 1, 0, 0, 0.7, P.night, 0.3) +
            `<path d="M45.4 48V88" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".55"/><path d="M48.6 50V60" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".5"/><path d="M75 47V86" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".35"/>`,
        },
        { d: lid, fill: P.white, line: 0.3, inner: k.sh(lid, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + [45.6, 48.6, 51.6, 54.6, 57.6, 60.6, 63.6, 66.6, 69.6, 72.6].map((x) => `<path d="M${x} 33V40.4" stroke="${P.sky2}" stroke-width=".5"/>`).join('') + `<path d="M44 34.4H76" stroke="#fff" stroke-width=".6" opacity=".8"/>` },
      ], 0.75) +
      `<g transform="rotate(-4 60 46)">` +
      k.draw([{ d: roundRect(46, 42.6, 74, 51.4, 0.8), fill: P.paper, inner: k.sh('M66 40H76V54H66Z', 0, 0, 1, 0, 0, 0.6, P.brown, 0.3) + `<path d="M47.2 43.8H72.8V50.2H47.2Z" fill="none" stroke="${P.red}" stroke-width=".35"/>` }], 0.45) +
      `<text x="60" y="48.8" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle">Riachuelo</text>` +
      `</g>` +
      `</g>` +
      sparkle(86, 40, 1.8) + sparkle(33, 76, 1.4) +
      k.defs()
    )
  },

  // Ochenta sucias: el chancho en su bañadera de oro llena de barro, con corona y su canasta de comodines.
  'Chiquero de lujo': (u) => {
    const k = kit(u)
    const rim = roundRect(28.6, 60.4, 91.4, 65.8, 2.7)
    const tub = 'M31 65.8H89C89 78 83 86.4 72.4 87.2H47.6C37 86.4 31 78 31 65.8Z'
    const foot = (x: number, sgn: number) => `M${f(x - 3.6 * sgn)} 85.6C${f(x - 4.4 * sgn)} 88 ${f(x - 5.2 * sgn)} 90 ${f(x - 4 * sgn)} 91.4H${f(x + 3.2 * sgn)}C${f(x + 3.8 * sgn)} 90 ${f(x + 3.4 * sgn)} 87.8 ${f(x + 2.6 * sgn)} 85.6Z`
    const mud = 'M28.4 61.4C27.6 57.6 31 55.4 34.4 56.4C35.4 53.6 39.8 52.8 41.8 55C43.4 52.6 47.4 52.8 48.4 55.4C55 56 63 56 70 55.2C71.2 52.8 75.4 52.8 76.6 55.4C78.6 53 83 53.8 84 56.8C87.6 55.6 91.6 57.6 91.6 61.4Z'
    const drips = taper(34, 64, 33.6, 68, 34.4, 72.4, 3, 1.6) + taper(54, 64.6, 54, 67.6, 53.6, 70.6, 2.6, 1.4) + taper(81, 64, 81.4, 69, 81, 74.4, 3, 1.6)
    const head = 'M58 33C66.6 33 72 39 72 46C72 53.4 66 58.6 58 58.6C50 58.6 44 53.4 44 46C44 39 49.4 33 58 33Z'
    const earL = 'M47.6 38.6C45 34.6 44.6 30 45.6 27C49.6 28.2 52.8 31.2 54 35Z'
    const earR = 'M68.4 38.6C71 34.6 71.4 30 70.4 27C66.4 28.2 63.2 31.2 62 35Z'
    const snout = ellipse(58, 50, 5.6, 4)
    const trotL = roundRect(37.6, 54.4, 44.6, 62.4, 3.2), trotR = roundRect(76, 52.4, 83, 60.4, 3.2)
    const crown = 'M51.4 35.4L50.4 27.6L54.4 30.8L58.4 24.8L62.4 30.8L66.4 27.6L65.4 35.4Z'
    const gold = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` })
    const pink = (d: string, line = 0) => ({ d, fill: PINK, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, PINK_D, 0.4) })
    const scroll = (sgn: number) =>
      `<g transform="translate(60 0) scale(${sgn} 1) translate(-60 0)">` +
      `<path d="M52.4 76C48 72 42 72 39.6 75.4C37.6 78.4 40 81.4 42.6 80.6C44.6 80 44.6 77.6 43 77.2" fill="none" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M52.4 76C49 79.6 46 82.4 41.4 83" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-linecap="round"/>` +
      `<path d="M46 72.6C45 70.6 46.6 69.2 48 70.2" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round"/>` +
      `</g>`
    return (
      k.day() +
      k.sun(60, 52, 18, 47, 28, false) +
      k.shade(ellipse(60, 52, 28, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      k.floor(60, 91.6, 26, 2.2) +
      k.draw([gold(foot(43.6, 1)), gold(foot(76.4, -1))], 0.6) +
      `<path d="M41.6 89.6V91.2M43.4 89.4V91.2M78.4 89.6V91.2M76.6 89.4V91.2" stroke="${P.goldD}" stroke-width=".45"/>` +
      k.draw([gold(tub, 0.35)], 0.8) +
      `<path d="M33 69.6C40 71 80 71 87 69.6" fill="none" stroke="${P.goldL}" stroke-width=".9" opacity=".85"/>` +
      scroll(1) + scroll(-1) +
      k.draw([{ d: ellipse(60, 77.4, 6.4, 5.4), fill: P.goldL, inner: k.sh(ellipse(60, 77.4, 6.4, 5.4), 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.45) +
      `<path d="${starPath(60, 77.6, 3.4, 1.4, 5)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.draw([pink(earL), pink(earR)], 0.6) +
      k.draw([pink(head)], 0.7) +
      `<path d="M49.6 43.6Q52 41.4 54.4 43.6M61.6 43.6Q64 41.4 66.4 43.6" fill="none" stroke="${P.ink}" stroke-width=".95" stroke-linecap="round"/>` +
      hair(49.4, 43, 48.4, 42.4, 47.8, 41.2, 0.4) + hair(66.6, 43, 67.6, 42.4, 68.2, 41.2, 0.4) +
      `<ellipse cx="49" cy="48.4" rx="2.6" ry="1.5" fill="${P.red}" opacity=".3"/><ellipse cx="67" cy="48.4" rx="2.6" ry="1.5" fill="${P.red}" opacity=".3"/>` +
      k.draw([{ d: snout, fill: PINK, inner: k.sh(snout, 0, 0, 1, 1, 0, 0.8, PINK_D, 0.4) + `<ellipse cx="56.4" cy="48.4" rx="1.6" ry=".7" fill="#fff" opacity=".5"/>` }], 0.45) +
      `<ellipse cx="56.2" cy="50.2" rx=".95" ry="1.4" fill="${P.wine}"/><ellipse cx="59.8" cy="50.2" rx=".95" ry="1.4" fill="${P.wine}"/>` +
      hair(54, 55.4, 58, 57, 62, 55.4, 0.6) +
      `<g transform="rotate(8 58 33)">` + k.draw([gold(crown)], 0.55) +
      `<circle cx="58.4" cy="31.6" r="1.3" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><circle cx="53.4" cy="32.8" r=".8" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/><circle cx="63.4" cy="32.8" r=".8" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>` +
      [50.4, 58.4, 66.4].map((x, i) => `<circle cx="${x}" cy="${[27.6, 24.8, 27.6][i]}" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') + `</g>` +
      k.draw([{ d: mud, fill: P.brown, inner: k.sh(mud, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + hair(33, 58, 37, 56.6, 41, 57.4, 0.6, P.goldL, 0.8) + hair(72, 56.8, 76, 55.6, 80, 56.6, 0.5, P.goldL, 0.7) }, { d: drips, fill: P.brown, inner: k.sh(drips, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) }], 0.6) +
      k.draw([gold(rim, 0.3)], 0.7) +
      `<path d="M31 61.8H89" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".6"/>` + Array.from({ length: 15 }, (_, i) => `<circle cx="${f(33 + i * 3.9)}" cy="64" r=".5" fill="${P.goldD}"/>`).join('') +
      `<path d="${taper(34, 64.8, 33.6, 68.4, 34.4, 72.4, 3, 1.6) + taper(81, 64.8, 81.4, 69.2, 81, 74.4, 3, 1.6)}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".45"/>` +
      [[40, 58.4, 1.1], [48, 59.6, 0.8], [70, 59.4, 0.9], [62, 60.4, 0.7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.brownD}" stroke-width=".4"/>`).join('') +
      fan(k, ['joker', ['2', 's'], ['K', 'h'], ['2', 'd'], 'joker'], 80, 62, 26, 5, 0.64) +
      k.draw([pink(trotL), pink(trotR)], 0.55) +
      `<path d="M41.1 58.6V62.2M79.5 56.6V60.2" stroke="${P.ink}" stroke-width=".5"/>` +
      `<circle cx="52.6" cy="55" r=".9" fill="${P.brownD}"/><circle cx="66" cy="37.6" r=".7" fill="${P.brownD}"/><circle cx="46" cy="47" r=".6" fill="${P.brownD}"/>` +
      sparkle(34, 40, 2.6) + sparkle(88, 40, 2) + sparkle(84, 76, 1.4) +
      k.defs()
    )
  },

  // ── Se fue ─────────────────────────────────────────────────────────

  // Cinco cierres: el portazo de la casa chorizo, con las cartas volando por la corriente de aire.
  'Portazo': (u) => {
    const k = kit(u)
    const frame = 'M42 33.6H78V90.4H42Z'
    const transom = roundRect(45.4, 36.6, 74.6, 42.6, 0.8)
    const leaf = 'M45.4 44.8H74.6V90.4H45.4Z'
    const P1 = [[48.6, 48.2, 58.6, 65], [61.4, 48.2, 71.4, 65], [48.6, 70, 58.6, 87.2], [61.4, 70, 71.4, 87.2]]
    const bevel = (x0: number, y0: number, x1: number, y1: number) =>
      `<path d="M${x0} ${y0}L${f(x0 + 2)} ${f(y0 + 2)}V${f(y1 - 2)}L${x0} ${y1}Z" fill="${P.goldL}" opacity=".35"/><path d="M${x0} ${y0}H${x1}L${f(x1 - 2)} ${f(y0 + 2)}H${f(x0 + 2)}Z" fill="${P.goldL}" opacity=".45"/>` +
      `<path d="M${x1} ${y0}V${y1}H${x0}L${f(x0 + 2)} ${f(y1 - 2)}H${f(x1 - 2)}V${f(y0 + 2)}Z" fill="${P.brownD}" opacity=".5"/>` +
      `<path d="${roundRect(x0, y0, x1, y1, 0.8)}" fill="none" stroke="${P.ink}" stroke-width=".4"/><path d="M${f(x0 + 2)} ${f(y0 + 2)}H${f(x1 - 2)}V${f(y1 - 2)}H${f(x0 + 2)}Z" fill="none" stroke="${P.brownD}" stroke-width=".3"/>`
    const burst = starPath(60, 61, 44, 31, 18, -80)
    return (
      k.day() +
      `<path d="${burst}" fill="${P.goldL}" opacity=".75"/>` + k.shade(burst, k.rad(P.gold, 0.5, 0.5, 0.5, 0.2, 0.9), P.gold, 0.4) +
      `<path d="${burst}" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
      k.floor(60, 91.4, 22, 2.2) +
      k.draw([
        { d: frame, fill: P.white, inner: k.sh(frame, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + `<path d="M43.6 35.2H76.4V90.4" fill="none" stroke="${P.sky2}" stroke-width=".5"/>` },
        { d: transom, fill: P.sky, inner: `<path d="M52.6 36V43M60 36V43M67.4 36V43" stroke="${P.white}" stroke-width="1.1"/><path d="M52.6 36V43M60 36V43M67.4 36V43" stroke="${P.ink}" stroke-width=".35"/>` + k.sh(transom, 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + `<path d="M46.8 41.8L50.4 37.4M54.6 41.8L58 37.6" stroke="#fff" stroke-width=".7" opacity=".7"/>` },
        {
          d: leaf, fill: P.brown, line: 0.35,
          inner:
            P1.map(([x0, y0, x1, y1]) => bevel(x0, y0, x1, y1)).join('') +
            k.sh('M62 42H78V92H62Z', 0, 0, 1, 0, 0, 0.75, P.brownD, 0.4) + `<path d="M45 42H51V92H45Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.4, 0)}"/>` +
            hair(53, 51, 52.4, 57, 53.6, 63, 0.4, P.brownD) + hair(66, 73, 67, 80, 65.6, 86, 0.4, P.brownD) + hair(55.6, 73, 55.2, 78, 56, 85, 0.35, P.brownD) + hair(68, 50, 68.6, 57, 67.6, 63, 0.35, P.brownD) +
            `<path d="M45.4 67.4H74.6" stroke="${P.brownD}" stroke-width=".5"/>`,
        },
      ], 0.75) +
      `<path d="M45.4 49H47V53H45.4ZM45.4 82.4H47V86.4H45.4Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="60" cy="58" r="2.8" fill="none" stroke="${P.ink}" stroke-width="1.7"/><circle cx="60" cy="58" r="2.8" fill="none" stroke="${P.gold}" stroke-width=".8"/><circle cx="60" cy="55" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="${roundRect(69, 65.4, 71.8, 73.4, 1.2)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="70.4" cy="68" r="1.9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><circle cx="69.9" cy="67.5" r=".55" fill="#fff"/><path d="M70.4 70.6V72" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      hair(38.6, 38, 35, 35.6, 31.6, 35, 0.8) + hair(38, 47, 34.4, 46.6, 30.6, 47.4, 0.8) + hair(81.4, 38, 85, 35.6, 88.4, 35, 0.8) + hair(82, 47, 85.6, 46.6, 89.4, 47.4, 0.8) +
      hair(38.4, 84, 34.6, 84.4, 31.6, 83.4, 0.7) + hair(81.6, 84, 85.4, 84.4, 88.4, 83.4, 0.7) +
      naipe(k, ['K', 's'], 'translate(33.4 77.4) rotate(-24) scale(.6)', 0.7) + naipe(k, ['7', 'h'], 'translate(86.4 62) rotate(24) scale(.6)', 0.7) +
      hair(28, 82, 32.6, 85, 37.6, 85, 0.5, P.blue) + hair(94, 66.6, 91.6, 71, 87.6, 72.6, 0.5, P.blue) +
      `<text x="60" y="31" ${GEORGIA} font-style="italic" font-weight="700" font-size="6.6" fill="${P.red}" stroke="${P.paper}" stroke-width="1.6" paint-order="stroke" text-anchor="middle">¡pum!</text>` +
      k.defs()
    )
  },

  // Veinticinco cierres: la persiana del almacén, baja a la hora de la siesta, bajo el sol de las tres.
  'Persiana baja': (u) => {
    const k = kit(u)
    const sign = roundRect(38.4, 30.8, 81.6, 39.8, 1.4)
    const cornice = 'M34.4 39.4H85.6V42.4H34.4Z'
    const pil = (x: number) => `M${x} 42.4H${f(x + 3.6)}V88H${x}Z`
    const box = 'M38.6 42.4H81.4V47.4H38.6Z'
    const shutter = 'M38.6 47.4H81.4V86H38.6Z'
    const slats = Array.from({ length: 13 }, (_, i) => {
      const y = 49.6 + i * 2.8
      return `<path d="M38 ${f(y)}H82" stroke="${P.blue}" stroke-width=".55"/><path d="M38 ${f(y + 0.7)}H82" stroke="#fff" stroke-width=".55" opacity=".85"/><path d="M38 ${f(y + 1.8)}H82" stroke="${P.sky2}" stroke-width=".4"/>`
    }).join('')
    const step = 'M36.4 86H83.6L84.6 89.4H35.4Z'
    const card = roundRect(47.4, 56, 72.6, 70.2, 0.8)
    const lockBody = roundRect(56.8, 82.6, 63.2, 88.4, 1.2)
    return (
      k.day() +
      k.sun(60, 54, 19, 47, 28, false) +
      k.floor(60, 89.4, 27, 2) +
      k.draw([
        { d: pil(34.8), fill: P.white, inner: k.sh(pil(34.8), 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + `<path d="M36.6 45V86" stroke="${P.sky2}" stroke-width=".4"/>` },
        { d: pil(81.6), fill: P.white, inner: k.sh(pil(81.6), 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M83.4 45V86" stroke="${P.sky2}" stroke-width=".4"/>` },
        { d: shutter, fill: P.sky1, inner: slats + k.sh('M64 44H84V88H64Z', 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + k.sh('M36 46H84V54H36Z', 0, 0, 0, 1, 0.8, 0, P.mid, 0.4) + `<path d="M38 82.4H82V86H38Z" fill="${P.sky2}"/><path d="M38 82.4H82" stroke="${P.ink}" stroke-width=".5"/>` + hair(42, 60, 41.6, 70, 42.4, 80, 0.5, '#fff', 0.7) },
        { d: box, fill: P.sky2, inner: k.sh(box, 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) + [41, 50, 60, 70, 79].map((x) => `<circle cx="${x}" cy="44.9" r=".55" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>`).join('') },
        { d: cornice, fill: P.white, inner: k.sh(cornice, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) },
        { d: step, fill: P.sky2, inner: k.sh(step, 0, 0, 1, 1, 0, 0.7, P.mid, 0.35) },
        { d: sign, fill: P.mid, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.85, P.night, 0.45) + `<rect x="40" y="32.3" width="40" height="6" rx=".8" fill="none" stroke="${P.goldL}" stroke-width=".4"/><path d="M38.4 31H52V33.4H38.4Z" fill="#fff" opacity=".12"/>` },
      ], 0.7) +
      `<text x="60" y="37.6" ${GEORGIA} font-style="italic" font-size="5.4" fill="${P.goldL}" text-anchor="middle">Almacén</text>` +
      `<circle cx="41.8" cy="35.3" r=".6" fill="${P.goldL}"/><circle cx="78.2" cy="35.3" r=".6" fill="${P.goldL}"/>` +
      `<path d="M57.6 83V80.2C57.6 77.2 62.4 77.2 62.4 80.2V83" fill="none" stroke="${P.ink}" stroke-width="1.7"/><path d="M57.6 83V80.2C57.6 77.2 62.4 77.2 62.4 80.2V83" fill="none" stroke="${P.sky1}" stroke-width=".7"/>` +
      k.draw([{ d: lockBody, fill: P.gold, inner: k.sh(lockBody, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M57.6 83.6H59" stroke="#fff" stroke-width=".6" opacity=".6"/>` }], 0.5) + `<circle cx="60" cy="85" r=".75" fill="${P.ink}"/><path d="M60 85.2V86.8" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M60 50.4L49.4 56.6M60 50.4L70.6 56.6" stroke="${P.ink}" stroke-width=".45"/><circle cx="60" cy="50.2" r="1" fill="${P.ink}"/>` +
      `<g transform="rotate(-5 60 63)">` +
      k.draw([{ d: card, fill: P.goldL, inner: k.sh(card, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.4) + hair(49, 68.4, 56, 67.4, 63, 68.6, 0.35, P.goldD) }], 0.5) +
      `<text x="60" y="63.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.6" fill="${P.ink}" text-anchor="middle">Cerrado</text>` +
      `<text x="60" y="68.2" ${GEORGIA} font-style="italic" font-size="3" fill="${P.ink}" text-anchor="middle">vuelvo a las 17</text>` +
      `</g>` +
      `<text x="71.6" y="80.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.6" fill="${P.ink}" stroke="${P.sky1}" stroke-width="1.2" paint-order="stroke" transform="rotate(-14 71.6 80.4)">zzz</text>` +
      k.defs()
    )
  },

  // Setenta y cinco cierres: el último en irse apaga la luz; el filamento, una corona, todavía brilla.
  'El que apaga la luz': (u) => {
    const k = kit(u)
    const glass = 'M54.4 47.6C54.4 52.6 41.6 56.6 41.6 70.2C41.6 81.4 49.6 89.6 60 89.6C70.4 89.6 78.4 81.4 78.4 70.2C78.4 56.6 65.6 52.6 65.6 47.6Z'
    const base = 'M53.2 38.6H66.8V48.2H53.2Z'
    const socket = 'M52 26.4H68L69 39H51Z'
    const collar = roundRect(50.2, 36.6, 69.8, 40.2, 1.2)
    const crown = 'M53.4 74.4L52.2 66L56.6 70L60 63.2L63.4 70L67.8 66L66.6 74.4Z'
    const moon = 'M36 36.4C29.6 37.4 26.6 44.4 29.8 50.2C32.6 55.2 39.6 56 43.6 52.4C38.6 52.4 34.6 48.6 34.4 43.6C34.2 40.6 34.8 38.2 36 36.4Z'
    const chain = along(67.6, 35, 75.4, 52, 74, 68.4, Array.from({ length: 17 }, (_, i) => i / 16)).map((q) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r=".6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".28"/>`).join('')
    const tassel = 'M74 69C72.4 70.8 71.6 74.6 72 77.4H76C76.4 74.6 75.6 70.8 74 69Z'
    const rays = Array.from({ length: 12 }, (_, i) => {
      const a = ((i * 30 + 15) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
      return hair(60 + c * 9, 69 + s * 9, 60 + c * 12, 69 + s * 12, 60 + c * 15.4, 69 + s * 15.4, 0.55, P.goldL, 0.75)
    }).join('')
    return (
      k.night() +
      [[30, 66], [90, 30], [26, 76], [94, 78], [44, 26], [82, 92], [88, 52], [36, 88], [92, 64], [80, 24]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.45 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="${moon}" fill="${P.goldL}"/>` + k.shade(moon, k.lin(P.gold, 0, 0, 1, 1, 0, 0.8), P.goldD, 0.3) +
      k.shade(ellipse(60, 68, 33, 33), k.rad(P.gold, 0.5, 0.5, 0.5, 0.55, 0), P.gold, 0.4) +
      rod('M60 10V27', P.sky2, 0.8) + `<path d="M59.4 11L60.6 13.4M59.4 15L60.6 17.4M59.4 19L60.6 21.4M59.4 23L60.6 25.4" stroke="${P.ink}" stroke-width=".3"/>` +
      k.cast([glass], 2.2, 2) +
      k.draw([
        {
          d: glass, fill: P.mid,
          inner:
            k.sh(glass, 0, 0, 1, 1, 0, 0.9, P.night, 0.45) + k.shade(glass, k.rad(P.sky2, 0.42, 0.6, 0.62, 0, 0.75), P.sky2, 0.4) + k.shade(ellipse(60, 70, 16, 16), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.gold, 0.55) +
            `<path d="M47.6 66C47.6 60 51.4 55.6 56 54" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".6"/><path d="M46.6 72.4V75.6" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>` +
            `<path d="M72 80C70 84 66.6 86.4 62.6 87" fill="none" stroke="${P.sky2}" stroke-width=".7" stroke-linecap="round" opacity=".6"/>`,
        },
        { d: base, fill: P.goldD, inner: [40.2, 42.6, 45, 47.4].map((y) => `<path d="M52.6 ${y}L67.4 ${f(y + 1.3)}" stroke="${P.goldL}" stroke-width=".95"/>`).join('') + k.sh(base, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) },
        { d: socket, fill: P.gold, inner: k.sh(socket, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.45) + `<path d="M54.6 26.4H57V39H54.6Z" fill="#fff" opacity=".35"/>` + [29.4, 31.4].map((y) => `<path d="M52 ${y}H68" stroke="${P.goldD}" stroke-width=".5"/>`).join('') + Array.from({ length: 8 }, (_, i) => `<path d="M${f(53 + i * 2)} 32.6V35.6" stroke="${P.goldD}" stroke-width=".45"/>`).join('') },
        { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.45) + `<path d="M51 37.6H69" stroke="${P.goldL}" stroke-width=".5"/>` },
      ], 0.75) +
      `<path d="M57.6 48.2L58.4 58.6H61.6L62.4 48.2" fill="${P.sky2}" opacity=".35" stroke="${P.sky2}" stroke-width=".4"/>` +
      `<path d="M58.4 58.4L54.4 72M61.6 58.4L65.6 72" stroke="${P.sky2}" stroke-width=".45"/>` +
      rays +
      `<path d="${crown}" fill="${P.gold}" opacity=".45"/>` +
      `<path d="${crown}" fill="none" stroke="${P.goldL}" stroke-width="1.1" stroke-linejoin="round"/>` +
      `<path d="M53.6 72.2H66.4" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      `<circle cx="60" cy="63.2" r="1" fill="#fff"/><circle cx="52.2" cy="66" r=".8" fill="${P.goldL}"/><circle cx="67.8" cy="66" r=".8" fill="${P.goldL}"/>` +
      chain +
      k.draw([{ d: tassel, fill: P.gold, inner: k.sh(tassel, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M72.8 74V77.4M74 74V77.4M75.2 74V77.4" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.45) +
      `<circle cx="74" cy="69" r="1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
      hair(79.4, 66, 82.6, 69.4, 82.4, 74, 0.6, P.goldL) + hair(81.6, 62.4, 85.4, 65, 86.6, 69.4, 0.5, P.goldL) +
      `<text x="83" y="59" ${GEORGIA} font-style="italic" font-size="5.4" fill="${P.goldL}" transform="rotate(-10 83 59)">clic</text>` +
      sparkle(86, 40, 2.4, P.goldL) + sparkle(34, 76, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Muerto olvidado ────────────────────────────────────────────────

  // Un muerto sin tomar: quedó guardado en el ropero, con telarañas, y la polilla se escapa.
  'Muerto en el ropero': (u) => {
    const k = kit(u)
    const body = 'M35 32H77V91H35Z'
    const cornice = 'M32.6 27.4H79.4L78 32H34Z'
    const crest = 'M48 27.6C48 22.6 53 20.6 56 22.4C57.4 20.8 62.6 20.8 64 22.4C67 20.6 72 22.6 72 27.6Z'
    const doorL = 'M37.4 34.6H55.6V88.4H37.4Z'
    const inside = 'M56.4 34.6H74.6V88.4H56.4Z'
    const doorR = 'M74.6 34.6L88 38V85L74.6 88.4Z'
    const mirror = ellipse(46.5, 58, 5.8, 13.6)
    const web = `<path d="M56.4 34.6L64.6 42.4M56.4 34.6L59.4 45.4M56.4 34.6L66.6 37.4" stroke="${P.paper}" stroke-width=".3"/>` +
      `<path d="M58.4 36.6Q59.8 38 61.6 36.2M57.4 39.8Q60.6 40.8 63.4 38.6M57.6 42.2Q61.4 44 64.6 40.6M58 44.4Q62.6 46.2 65.4 42.4" fill="none" stroke="${P.paper}" stroke-width=".3"/>`
    const moth = (x: number, y: number) => `<g transform="translate(${x} ${y}) rotate(-20)">` + k.draw([{ d: 'M0 0C-3.4 -4 -6.6 -2.6 -5.6 .4C-5 2 -2.2 1.8 0 0ZM0 0C3.4 -4 6.6 -2.6 5.6 .4C5 2 2.2 1.8 0 0Z', fill: P.paper, inner: `<path d="M-4 -.6L-1.6 -.2M4 -.6L1.6 -.2" stroke="${P.brown}" stroke-width=".4"/><circle cx="-3.6" cy="-1.4" r=".5" fill="${P.brown}"/><circle cx="3.6" cy="-1.4" r=".5" fill="${P.brown}"/>` }], 0.4) + `<path d="M0 -1.2V1.8" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><path d="M-.3 -1.2L-1.4 -3M.3 -1.2L1.4 -3" stroke="${P.ink}" stroke-width=".3"/></g>`
    const grain = (x: number, y0: number, y1: number) => hair(x, y0, x - 0.8, (y0 + y1) / 2, x + 0.4, y1, 0.35, P.brownD)
    return (
      k.day() +
      k.stage(60, 60, 34) +
      `<g transform="translate(60 59.6) scale(.9) translate(-60 -60)">` +
      k.floor(62, 94, 30, 2.4) +
      `<path d="M38 91V95M74 91V95" stroke="${P.ink}" stroke-width="3.2" stroke-linecap="round"/><path d="M38 91V94.4M74 91V94.4" stroke="${P.brownD}" stroke-width="1.5" stroke-linecap="round"/>` +
      k.draw([
        { d: crest, fill: P.brown, inner: k.sh(crest, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) + `<path d="M52 26.4C52 24 55 23.2 56.6 24.4M68 26.4C68 24 65 23.2 63.4 24.4" fill="none" stroke="${P.brownD}" stroke-width=".55" stroke-linecap="round"/><circle cx="60" cy="25" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` },
        { d: body, fill: P.brown, inner: k.sh(body, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.4) },
        { d: cornice, fill: P.brownD, inner: `<path d="M33 29.4H79" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` + Array.from({ length: 11 }, (_, i) => `<path d="M${36 + i * 4} 30.6V32" stroke="${P.goldL}" stroke-width=".4" opacity=".5"/>`).join('') },
        { d: doorL, fill: P.brown, line: 0.35, inner: `<path d="M38 35H44V88H38Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0)}"/>` + grain(40, 37, 86) + grain(53, 37, 86) + `<path d="${mirror}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".55"/><path d="${ellipse(46.5, 58, 7.4, 15.2)}" fill="none" stroke="${P.goldD}" stroke-width=".7"/>` + k.sh(mirror, 0, 0, 1, 1, 0.1, 0.7, P.sky2, 0.4) + `<path d="M43.4 52L47.6 47.6M43.6 58.6L49.2 53" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` + k.sh(doorL, 0, 0, 1, 0, 0, 0.6, P.brownD, 0.35) },
        {
          d: inside, fill: P.night,
          inner: k.sh(inside, 0, 0, 0, 1, 0, 0.5, P.mid, 0.4) + `<path d="M56.4 46H74.6" stroke="${P.brownD}" stroke-width="1.2"/>` +
            `<path d="M63.6 46.4V48.6M63.6 48.6L59 53.2H68.2Z" fill="none" stroke="${P.sky2}" stroke-width=".55" stroke-linejoin="round"/>` + web +
            k.shade('M74.6 36L58 60L60 88H74.6Z', k.lin(P.goldL, 1, 0, 0, 0, 0.35, 0), P.goldL, 0.3),
        },
        { d: doorR, fill: P.brown, line: 0.35, inner: `<path d="M77 39.6L86 41.8V81.4L77 83.8Z" fill="none" stroke="${P.brownD}" stroke-width=".6"/>` + grain(80, 42, 82) + grain(84, 43, 80) + k.sh(doorR, 0, 0, 1, 0, 0, 0.5, P.brownD, 0.3) },
      ], 0.75) +
      `<circle cx="54" cy="62" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M54 63.4V66.6" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M54 63.4V66.6" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/><path d="M53.4 66.6L52.6 70.6H55.4L54.6 66.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M56.4 88.4H74.6V84H56.4Z" fill="${P.brownD}"/>` +
      pile(k, 65.4, 78, -8, 'red', 11, 0.44, 0.8, 0.42) +
      [[60, 71, 0.35], [68, 69, 0.3], [64, 66, 0.25], [71, 74, 0.3], [62, 62, 0.25]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}" opacity=".8"/>`).join('') +
      `</g>` +
      `<path d="M74 52C80 50 84 50 88 45" fill="none" stroke="${P.ink}" stroke-width=".35" stroke-dasharray=".7 .9"/>` + moth(90, 43) +
      k.defs()
    )
  },

  // Cinco muertos sin tomar: velorio. El muerto, entre velas y con crespón; adelante, la bandeja de sánguches de miga.
  'Velorio con sanguchitos': (u) => {
    const k = kit(u)
    const sandwich = (x: number, y: number, s: number) => {
      const d = 'M-7.2 0L0 -7.6L7.2 0Z'
      const layers =
        `<path d="M-8 -1.5H8V-2.6H-8Z" fill="${PINK}"/><path d="M-8 -2.6H8V-3H-8Z" fill="${PINK_D}" opacity=".7"/>` +
        `<path d="M-8 -4.2H8V-4.9H-8Z" fill="${P.goldL}"/><path d="M-8 -4.9H8V-5.4H-8Z" fill="${P.green}"/>`
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.paper, inner: layers + k.sh(d, 0, 0, 1, 1, 0, 0.6, P.brown, 0.3) + `<path d="M-5.6 -.8L-.8 -5.8" stroke="#fff" stroke-width=".55" opacity=".7"/>` }], 0.45 / s) + `</g>`
    }
    const tray = ellipse(60, 85.6, 28.4, 7)
    const doily = Array.from({ length: 40 }, (_, i) => {
      const a = (i / 40) * Math.PI * 2
      return `<circle cx="${f(60 + Math.cos(a) * 24.4)}" cy="${f(84.6 + Math.sin(a) * 5.4)}" r="1.25" fill="${P.white}" stroke="${P.sky2}" stroke-width=".3"/>`
    }).join('')
    const candle = (x: number) => {
      const stick = `M${x - 2} 48H${x + 2}V80H${x - 2}Z`
      const holder = `M${x - 5} 80H${x + 5}L${x + 3.4} 83.6H${x - 3.4}Z`
      const fl = `M${x} 38.6C${x + 2.4} 42.4 ${x + 2.4} 45.4 ${x} 46.6C${x - 2.4} 45.4 ${x - 2.4} 42.4 ${x} 38.6Z`
      return k.shade(ellipse(x, 43, 8, 8), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
        k.draw([
          { d: stick, fill: P.white, inner: k.sh(stick, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M${x - 2} 49.6C${x - 1} 51 ${x - 1.4} 53 ${x - 0.6} 54" fill="none" stroke="${P.sky2}" stroke-width=".6"/>` },
          { d: holder, fill: P.gold, inner: k.sh(holder, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) },
          { d: fl, fill: P.gold, inner: `<path d="M${x} 42C${x + 1.1} 43.6 ${x + 1.1} 45 ${x} 45.6C${x - 1.1} 45 ${x - 1.1} 43.6 ${x} 42Z" fill="${P.goldL}"/>` },
        ], 0.5) + `<path d="M${x} 46.6V48" stroke="${P.ink}" stroke-width=".5"/>`
    }
    const bow = 'M60 49.8C56 46.2 51.4 46.8 52 49.8C52.6 52.8 57 52.2 60 49.8ZM60 49.8C64 46.2 68.6 46.8 68 49.8C67.4 52.8 63 52.2 60 49.8Z'
    const stand = 'M44.6 66.4H75.4L77.4 80H42.6Z'
    const standTop = 'M46.6 63.8H73.4L75.4 66.6H44.6Z'
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.85), P.night, 0.6) +
      Array.from({ length: 10 }, (_, i) => hair(24 + i * 8, 14, 22 + i * 8 + (i % 2) * 3, 50, 24 + i * 8, 100, 0.8, P.night, 0.5)).join('') +
      candle(33) + candle(87) +
      k.draw([
        { d: stand, fill: P.night, inner: k.sh(stand, 0, 0, 1, 0, 0, 0.8, '#000', 0.4) + hair(48, 68, 47, 74, 46, 80, 0.5, P.mid) + hair(72, 68, 73, 74, 74, 80, 0.5, '#000') + `<path d="M43.2 78.6H76.8" stroke="${P.sky2}" stroke-width="1.2" stroke-dasharray=".5 .7"/>` },
        { d: standTop, fill: P.mid, inner: k.sh(standTop, 0, 0, 1, 0, 0, 0.7, P.night, 0.4) },
      ], 0.6) +
      k.floor(60.6, 66.4, 13, 1.4, '#000') +
      pile(k, 60, 56.2, 4, 'blue', 11, 0.42, 1.25, 0.5) +
      `<path d="M58.6 50.6L56 56.6L58 56L58.6 57.8ZM61.4 50.6L64 56.6L62 56L61.4 57.8Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.draw([{ d: bow, fill: P.night, inner: `<path d="M53.4 49.6C55.4 48.6 57.6 49 59 49.8" fill="none" stroke="${P.sky2}" stroke-width=".4" opacity=".6"/>` }], 0.45) +
      `<circle cx="60" cy="49.8" r="1.3" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.floor(61, 92, 28, 2.4, '#000') +
      k.draw([{ d: tray, fill: P.white, inner: k.sh(tray, 0, 0, 1, 1, 0, 0.85, P.blue, 0.45) + `<path d="M34 84Q38 80 46 79.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` }], 0.75) +
      doily + `<path d="${ellipse(60, 84.6, 24.4, 5.4)}" fill="${P.white}"/>` + `<path d="${ellipse(60, 84.6, 22, 4.4)}" fill="none" stroke="${P.sky2}" stroke-width=".35" stroke-dasharray=".6 .8"/>` +
      sandwich(41.6, 82, 1.16) + sandwich(54, 81.4, 1.16) + sandwich(66, 81.4, 1.16) + sandwich(78.4, 82, 1.16) +
      sandwich(46, 88.6, 1.36) + sandwich(60, 89, 1.36) + sandwich(74, 88.6, 1.36) +
      sparkle(46, 40, 1.4, P.goldL) + sparkle(74, 38, 1.2, P.goldL) +
      k.defs()
    )
  },

  // Quince muertos olvidados: te persiguen por los palcos. El fantasma es su media máscara de porcelana, con el rombo
  // del dorso del naipe grabado, flotando bajo el foco del Colón; en la baranda quedó la rosa.
  'Fantasma del Colón': (u) => {
    const k = kit(u)
    const mask = 'M1.4 -17C-6 -17.4 -12.6 -12.4 -13.6 -4C-14.2 2.4 -12.4 8.6 -8.6 12.6C-5.6 15.6 -2 16.8 1.2 16.4L1.6 7.4C-.6 6.6 -1.4 5 -1 3.2L1.6 -3.4Z'
    const hole = 'M-9.6 -4.6C-8 -6.6 -4.4 -6.8 -2.4 -4.8C-4.2 -2.6 -7.8 -2.4 -9.6 -4.6Z'
    const rose = (x: number, y: number, r: number) => {
      const head = ellipse(0, 0, 4.4, 3.8)
      return `<g transform="translate(${x} ${y}) rotate(${r})">` +
        `<path d="M3.4 1.4C8 2.4 13 2.2 18 .8" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M3.4 1.4C8 2.4 13 2.2 18 .8" fill="none" stroke="${P.green}" stroke-width=".8" stroke-linecap="round"/>` +
        k.draw([{ d: 'M9 2C10 -1.6 13.6 -2.6 15.6 -1.4C14 1 11.6 2.4 9 2Z', fill: P.green, inner: k.sh('M9 -3H16V3H9Z', 0, 0, 0, 1, 0, 0.8, P.greenD, 0.4) }], 0.35) +
        `<path d="M12.6 2.2L13.4 3.6L13.8 2" fill="${P.greenD}"/>` +
        k.draw([{ d: head, fill: P.red, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<path d="M-1.6 -.4C-1.6 -2 1.6 -2 1.6 -.2C1.6 1.4 -1 1.6 -1 .2M-3.4 -1.4C-2.4 -3.6 2.6 -3.8 3.6 -1M-3.6 1.4C-2 3.4 2.4 3.4 3.8 1.2" fill="none" stroke="${P.wine}" stroke-width=".55" stroke-linecap="round"/>` }], 0.45) +
        `<path d="M-2.6 -2.2C-1.6 -3 0 -3.2 1 -2.8" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round" opacity=".7"/></g>`
    }
    const tiers = [38, 54, 70].map((y, i) => {
      const band = `M16 ${y}Q60 ${y + 10} 104 ${y}V${y + 9}Q60 ${y + 19} 16 ${y + 9}Z`
      const boxes = Array.from({ length: 9 }, (_, j) => {
        const x = 24 + j * 9, yy = y + 3 + 9 * (1 - ((x - 60) / 44) ** 2) * 0.95
        return `<path d="M${f(x - 3)} ${f(yy + 6)}V${f(yy + 1.6)}Q${x} ${f(yy - 1.4)} ${f(x + 3)} ${f(yy + 1.6)}V${f(yy + 6)}Z" fill="${P.night}" opacity=".85"/><circle cx="${x}" cy="${f(yy + 4.6)}" r=".5" fill="${P.goldL}" opacity=".6"/>`
      }).join('')
      return `<path d="${band}" fill="${P.red}" opacity="${0.45 + i * 0.12}"/>` + boxes +
        `<path d="M16 ${y + 9}Q60 ${y + 19} 104 ${y + 9}" fill="none" stroke="${P.gold}" stroke-width="1.2"/><path d="M16 ${y + 9}Q60 ${y + 19} 104 ${y + 9}" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round" transform="translate(0 1.2)"/><path d="M16 ${y}Q60 ${y + 10} 104 ${y}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`
    }).join('')
    const curtain = (s: number) =>
      `<g transform="translate(${s > 0 ? 0 : 120} 0) scale(${s} 1)">` +
      k.draw([{ d: 'M14 10H34C30 30 27.6 52 29 66C30 80 33.4 94 36 106H14Z', fill: P.red, inner: k.sh('M14 10H36V106H14Z', 0, 0, 1, 0, 0.2, 0.9, P.wine, 0.45) + hair(20, 14, 19, 60, 22, 104, 1, P.wine) + hair(26, 14, 23.6, 50, 26.4, 96, 0.8, P.wine) + hair(30.4, 16, 28.4, 40, 28.6, 64, 0.5, P.goldL, 0.5) }], 0.7) +
      `<path d="M22 70C26 72.6 30 72.4 33 70" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M22 70C26 72.6 30 72.4 33 70" fill="none" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
      k.draw([{ d: 'M33 70.6C31.4 72.4 30.6 76.4 31 79.4H35.6C36 76.4 35 72.4 33 70.6Z', fill: P.gold, inner: k.sh('M30 70H37V80H30Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) + `<path d="M32 76V79.4M33.3 76V79.4M34.6 76V79.4" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.45) +
      `</g>`
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      tiers +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.5, 0.7, 0, 0.9), P.night, 0.6) +
      k.shade('M47 0H73L104 100H16Z', k.lin(P.goldL, 0, 0, 0, 1, 0.42, 0.05), P.goldL, 0.45) +
      curtain(1) + curtain(-1) +
      k.shade(ellipse(60, 90, 30, 5.4), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.5, 0), P.goldL, 0.45) +
      k.shade(ellipse(60, 58, 30, 32), k.rad(P.sky1, 0.5, 0.5, 0.5, 0.55, 0), P.sky1, 0.45) +
      k.shade(ellipse(61, 86, 16, 3), k.rad(P.night, 0.5, 0.5, 0.5, 0.7, 0), P.night, 0.4) +
      `<g transform="translate(61 56.6) rotate(-8) scale(1.3)">` +
      k.cast([mask], 1.6, 1.8, P.night) +
      k.draw([{
        d: mask, fill: P.white,
        inner:
          k.sh(mask, 1, 0, 0, 1, 0, 0.8, P.sky2, 0.5) + k.sh('M-16 2H4V18H-16Z', 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) +
          `<path d="M-16 -20H-6V18H-16Z" fill="${k.lin(P.blue, 0, 0, 1, 0, 0.45, 0)}"/>` + `<path d="M-4 -18H2V4H-4Z" fill="${k.lin('#ffffff', 1, 0, 0, 0, 0.9, 0)}"/>` +
          `<path d="M.6 -15.8C-5.6 -16 -11.2 -11.8 -12.2 -4.2C-12.8 1.8 -11.2 7.6 -7.8 11.4C-5 14.4 -2 15.4 .4 15.2" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
          `<path d="M-6.4 -13.2L-4.6 -10.6L-6.4 -8L-8.2 -10.6Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".25"/>` +
          `<path d="M-6.4 -13.2C-8.6 -13.4 -10 -12.4 -10.6 -10.8M-6.4 -13.2C-4.2 -13.6 -2.4 -13 -1.4 -11.6" fill="none" stroke="${P.goldD}" stroke-width=".3"/>` +
          hair(-11, 2, -10, 7, -7, 10.4, 0.4, P.blue) + hair(-1.6, 7.6, -3.4, 10, -2.6, 13.4, 0.35, P.blue),
      }], 0.5) +
      `<path d="${hole}" fill="${P.night}"/><path d="${hole}" fill="none" stroke="${P.ink}" stroke-width=".4"/><path d="M-9 -4.4C-7.4 -3.2 -4.6 -3.2 -3 -4.4" fill="none" stroke="${P.gold}" stroke-width=".3"/>` +
      `</g>` +
      `<path d="M16 92Q60 99 104 92V106H16Z" fill="${P.wine}"/>` +
      Array.from({ length: 15 }, (_, i) => {
        const x = 25 + i * 5, y = 92.4 + 3.5 * (1 - ((x - 60) / 44) ** 2)
        return `<path d="M${x} ${f(y)}V${f(y + 6)}" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M${x} ${f(y)}V${f(y + 6)}" stroke="${P.gold}" stroke-width="1" stroke-linecap="round"/>`
      }).join('') +
      `<path d="M16 90.6Q60 98 104 90.6" fill="none" stroke="${P.ink}" stroke-width="3.2"/><path d="M16 90.6Q60 98 104 90.6" fill="none" stroke="${P.gold}" stroke-width="2"/><path d="M16 90Q60 97.4 104 90" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` +
      `<g transform="translate(70 91) scale(1.3)">` + rose(0, 0, -10) + `</g>` +
      sparkle(86, 36, 2, P.goldL) + sparkle(34, 36, 1.4, P.goldL) +
      k.defs()
    )
  },
}
