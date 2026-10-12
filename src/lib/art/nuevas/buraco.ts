// Medallas del Buraco, redibujadas (ver el kit en ../kit.ts): canastas limpias y sucias, cierres y el muerto.
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Rosado del chancho y del jamón de los sánguches. */
const PINK = '#EFB3A6', PINK_D = '#C9776E'
/** El agua del Riachuelo. */
const MURK = '#77803F', MURK_D = '#454B24'

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
/** Naipe acostado sobre la mesa, centrado en (x,y). `extra` va encima, en coordenadas del naipe. */
function naipeFlat(k: Kit, face: Face, x: number, y: number, a: number, q: number, s = 1, extra = '', w = 0.45) {
  const { fill, inner, over } = faceOf(k, face)
  const { m } = lay(a, q, s)
  return `<g transform="translate(${x} ${y})">` + k.draw([{ d: flatCard(a, q, s), fill, inner: `<g transform="${m} translate(0 9.2)">${inner}</g>` }], w) + `<g transform="${m} translate(0 9.2)">${over}${extra}</g></g>`
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

const ACES: Face[] = [['A', 'h'], ['A', 's'], ['A', 'd'], ['A', 'c'], ['A', 'h'], ['A', 's'], ['A', 'd']]

export const BURACO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Canastas limpias ───────────────────────────────────────────────

  // Cinco limpias: la canasta de ases sale del balde con espuma, en el patio recién baldeado.
  'Patio baldeado': (u) => {
    const k = kit(u)
    const body = 'M40.4 63L44.8 89.6C45.2 93.2 74.8 93.2 75.2 89.6L79.6 63Z'
    const mouth = ellipse(60, 63, 19.6, 4.2)
    const foam =
      'M40.2 64C36.8 62.6 37.2 58.4 41 58.6C41 55.4 45 54.2 47 56.2C48.2 53.6 52 53.2 53.8 55.4C55.4 53 59.8 52.8 61.6 55.2C63.4 53 67.4 53.2 68.6 56C70.8 54.2 74.8 55.2 74.8 58.2C78.4 57.8 80.6 61.8 78.6 64C72 67.6 48 67.6 40.2 64Z' +
      'M45.4 65.6C45 69.4 47.2 71.4 48.2 69.6C48.8 68.4 48.4 67 48.8 66Z M71.4 66.2C71.2 70.4 73.6 72.2 74.4 70.2C74.8 68.8 74.2 67.4 74.6 66Z'
    const yAt = (y: number) => (y - 52) / 52
    const levels = [82, 85.2, 89.2, 94.2, 100.6, 109]
    let checker = '', lines = ''
    levels.forEach((y, r) => {
      lines += `M20 ${y}H100`
      if (r < levels.length - 1) {
        for (let j = -7; j < 7; j++) {
          if ((j + r) % 2) continue
          const y1 = levels[r + 1], x = (jj: number, yy: number) => f(60 + jj * 9 * yAt(yy))
          checker += `M${x(j, y)} ${y}L${x(j + 1, y)} ${y}L${x(j + 1, y1)} ${y1}L${x(j, y1)} ${y1}Z`
        }
      }
    })
    for (let j = -7; j <= 7; j++) lines += `M${f(60 + j * 9 * yAt(82))} 82L${f(60 + j * 9 * yAt(110))} 110`
    const rib = (y: number) => `<path d="M${f(41.4 + (y - 63) * 0.16)} ${y}C50 ${f(y + 3.6)} 70 ${f(y + 3.6)} ${f(78.6 - (y - 63) * 0.16)} ${y}" fill="none" stroke="${P.ink}" stroke-width=".45"/><path d="M${f(41.6 + (y - 63) * 0.16)} ${f(y + 0.9)}C50 ${f(y + 4.5)} 70 ${f(y + 4.5)} ${f(78.4 - (y - 63) * 0.16)} ${f(y + 0.9)}" fill="none" stroke="#fff" stroke-width=".6"/>`
    return (
      k.day() +
      k.stage(60, 62, 33) +
      k.clip(ellipse(60, 62, 33, 33), `<path d="M20 82H100V110H20Z" fill="${P.white}" opacity=".6"/><path d="${checker}" fill="${P.sky2}" opacity=".55"/><path d="${lines}" stroke="${P.blue}" stroke-width=".3" opacity=".7"/>`) +
      k.shade(ellipse(60, 92.4, 27, 4.6), k.rad(P.sky, 0.5, 0.5, 0.5, 0.9, 0.2), P.blue, 0.5) +
      hair(36, 92.6, 42, 91, 48, 92.2, 0.5, '#fff') + hair(70, 94, 76, 93, 82, 93.6, 0.5, '#fff') +
      k.floor(61.4, 91.6, 17, 2.4, P.mid) +
      k.draw([
        { d: body, fill: P.sky1, line: 0.35, inner: rib(71.4) + rib(81.6) + k.sh('M63 60C72 68 74 80 72 96H84V60Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M43 62H51V94H43Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` + k.sh('M38 84H82V94H38Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) },
        { d: mouth, fill: P.sky2, inner: k.sh(mouth, 0, 0, 0, 1, 0.9, 0, P.mid, 0.4) },
      ], 0.7) +
      fan(k, ACES, 60, 72, 32, 12.6, 1.04) +
      k.draw([{ d: foam, fill: P.white, inner: k.sh('M36 60H82V72H36Z', 0, 0, 0, 1, 0, 0.7, P.sky2, 0.45) + [[45, 60, 1.2], [52, 58, 0.9], [58, 61.4, 1.3], [66, 58.4, 1], [72, 61, 1.1], [77, 60.4, 0.7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.sky2}" stroke-width=".35"/>`).join('') }], 0.55) +
      `<path d="M40.4 64.4Q60 99 79.6 64.4" fill="none" stroke="${P.ink}" stroke-width="1.9" stroke-linecap="round"/><path d="M40.4 64.4Q60 99 79.6 64.4" fill="none" stroke="${P.sky1}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([{ d: roundRect(54, 79.6, 66, 83.8, 2.1), fill: P.brown, inner: k.sh(roundRect(54, 79.6, 66, 83.8, 2.1), 0, 0, 0, 1, 0, 0.9, P.brownD, 0.4) }, { d: roundRect(38.8, 62.6, 42, 66.4, 0.6), fill: P.sky2 }, { d: roundRect(78, 62.6, 81.2, 66.4, 0.6), fill: P.sky2 }], 0.45) +
      bubble(33, 46, 2.8) + bubble(87, 44, 2.2) + bubble(38, 36, 1.4) + bubble(83, 33, 1.3) + bubble(90.6, 58, 1.4) + bubble(29.6, 60, 1.2) +
      hair(31, 76, 27, 71, 30, 66, 0.6, P.blue) + hair(89, 76, 93, 71, 90, 66, 0.6, P.blue) +
      sparkle(46, 38, 1.8) + sparkle(76, 40, 1.4) +
      k.defs()
    )
  },

  // Veinticinco limpias: el mantel blanco de los domingos, impecable; la gota de tuco no se anima a caer.
  'Mantel de domingo': (u) => {
    const k = kit(u)
    const top = ellipse(60, 59, 31, 9.4)
    const skirt = 'M29 59C28.4 69 27 78 25 86Q60 99.6 95 86C93 78 91.6 69 91 59Z'
    const lace = along(25, 86, 60, 99.6, 95, 86, Array.from({ length: 19 }, (_, i) => i / 18))
      .map((q) => `<circle cx="${f(q.x)}" cy="${f(q.y + 0.6)}" r="1.7" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(q.x)}" cy="${f(q.y + 1)}" r=".45" fill="${P.sky2}"/>`).join('')
    const hearts: Face[] = [['4', 'h'], ['5', 'h'], ['6', 'h'], ['7', 'h'], ['8', 'h'], ['9', 'h'], ['10', 'h']]
    const spoon = taper(101, 14, 92, 22, 80.6, 33.4, 3.2, 2.2)
    const bowl = 'M80.8 32.6C84 35.6 83 41 78.4 42.4C74.2 43.6 70.4 41.4 70.4 38.4C70.4 34.8 76.6 29 80.8 32.6Z'
    const drop = 'M71.4 42.6C71.8 44.6 73.4 46 73.4 47.8C73.4 49.2 72.5 50 71.4 50C70.3 50 69.4 49.2 69.4 47.8C69.4 46 71 44.6 71.4 42.6Z'
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(61, 95, 30, 2.6) +
      lace +
      k.draw([
        {
          d: skirt, fill: P.white,
          inner:
            k.sh('M66 56C80 64 86 76 84 98H98V56Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + k.sh('M24 56H96V66H24Z', 0, 0, 0, 1, 0.7, 0, P.blue, 0.3) +
            hair(35, 62, 33.6, 74, 31.4, 88, 0.6, P.blue) + hair(46, 66, 45.4, 80, 44, 93, 0.5, P.blue) + hair(75, 66, 76, 80, 77, 93, 0.5, P.blue) + hair(86, 62, 87.4, 74, 89, 88, 0.6, P.blue) +
            `<path d="M26.4 81.6Q60 94.6 93.6 81.6" fill="none" stroke="${P.mid}" stroke-width=".7" stroke-dasharray="1 1.1"/><path d="M26.8 79.4Q60 92.4 93.2 79.4" fill="none" stroke="${P.sky}" stroke-width=".4"/>`,
        },
        { d: top, fill: P.white, inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, P.sky2, 0.4) + `<path d="${ellipse(60, 59, 27.4, 7.6)}" fill="none" stroke="${P.sky}" stroke-width=".4" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` },
      ], 0.7) +
      `<g transform="translate(60 60.4) scale(1 .5)">${fan(k, hearts, 0, 6, 42, 3, 0.98, 0.6)}</g>` +
      k.draw([
        { d: spoon, fill: P.brown, inner: k.sh(spoon, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.4) },
        { d: bowl, fill: P.brown, inner: k.sh(bowl, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M79.8 33.8C82.2 36.4 81.2 40 77.8 41C74.8 41.8 72 40.4 72 38.4C72 35.4 77 31.2 79.8 33.8Z" fill="${P.red}"/>` + k.sh('M72 32H84V44H72Z', 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
        { d: drop, fill: P.red, inner: k.sh(drop, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + `<ellipse cx="70.6" cy="47" rx=".5" ry=".8" fill="#fff" opacity=".8"/>` },
      ], 0.5) +
      hair(66.6, 45.6, 65.6, 47.6, 66.6, 49.6, 0.45) + hair(76.2, 45.6, 77.2, 47.6, 76.2, 49.6, 0.45) + hair(65, 44.6, 64, 47.6, 65, 50.6, 0.35) + hair(77.8, 44.6, 78.8, 47.6, 77.8, 50.6, 0.35) +
      sparkle(34, 44, 2) + sparkle(48, 34, 1.4) +
      k.defs()
    )
  },

  // Ochenta limpias: la abuela pasa el plumero por la canasta de damas, que brilla.
  'Abuela con plumero': (u) => {
    const k = kit(u)
    const plume = (L: number, W: number) => {
      const N = 14, l: string[] = [], r: string[] = []
      for (let i = 0; i <= N; i++) {
        const t = i / N, hw = W * Math.pow(Math.sin(Math.PI * Math.min(t * 1.08, 1)), 0.75) * (i % 2 ? 1 : 0.72), y = f(-L * t)
        l.push(`${f(-hw)} ${y}`)
        r.push(`${f(hw * (i % 2 ? 0.74 : 1))} ${y}`)
      }
      return `M${l.join('L')}L${r.reverse().join('L')}Z`
    }
    const cols = [P.brownD, P.brown, P.goldD, P.brown, P.brownD]
    const angles = [-78, 78, -60, 60, -42, 42, -24, 24, -8, 8, 0]
    const feathers = angles.map((a, i) => {
      const L = 19 - Math.abs(a) / 16, d = plume(L, 4.4), c = cols[i % cols.length]
      return { d, t: `rotate(${a})`, fill: c, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.night, 0.35) + hair(0, -1, 0.4, -L / 2, 0, -L + 1, 0.5, P.goldL) }
    })
    const handle = taper(0, 6, 0, 18, 0, 31, 3.8, 3)
    const ferrule = roundRect(-2.6, 0, 2.6, 6.4, 1)
    const queens: Face[] = [['Q', 'h'], ['Q', 's'], ['Q', 'd'], ['Q', 'c'], ['Q', 'h'], ['Q', 's'], ['Q', 'd']]
    return (
      k.day() +
      k.sun(60, 58, 18, 46, 28, false) +
      k.floor(62, 95, 22, 2.6) +
      fan(k, queens, 64, 98, 30, 11, 1.12) +
      `<g transform="translate(46 54) rotate(-38)">` +
      k.draw([
        { d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + `<path d="M-1.2 8V30" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>` },
        { d: ellipse(0, 32.4, 2.6, 2.6), fill: P.brownD },
        { d: ferrule, fill: P.gold, line: 0.3, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 1, P.goldD, 0.4) + `<path d="M-2.6 2.2H2.6M-2.6 4.2H2.6" stroke="${P.goldD}" stroke-width=".4"/>` },
      ], 0.6) +
      `<g transform="translate(0 1)">` + k.draw(feathers, 0.55) + `</g>` +
      `<path d="M-1.6 7C-6 6 -7.6 9 -6.4 11C-5 13 -2 10 -1.6 7ZM1.6 7C6 6 7.6 9 6.4 11C5 13 2 10 1.6 7Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/><path d="M-1.4 7L-3.4 15M1.4 7L3.6 15" stroke="${P.red}" stroke-width="1.2" stroke-linecap="round"/><circle cx="0" cy="7" r="1.5" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/>` +
      `</g>` +
      sparkle(82, 62, 2.6) + sparkle(46, 72, 1.8) + sparkle(84, 40, 1.6) + sparkle(30, 70, 1.4) +
      k.defs()
    )
  },

  // ── Canastas sucias ────────────────────────────────────────────────

  // Cinco sucias: el botín embarrado acaba de pisar el comodín.
  'Botines embarrados': (u) => {
    const k = kit(u)
    const boot = 'M-21 -1.4C-23.4 -6 -23.6 -15.4 -21.4 -24C-16.4 -25.8 -11.4 -25.8 -6.8 -24.6C-4.4 -18.6 1.4 -12.6 9.4 -10.2C16.6 -8.2 22.6 -6.8 24 -2.6C24.6 -.4 23.2 1.2 21 1.2H-18.6C-20 1.2 -20.6 .2 -21 -1.4Z'
    const studs = [-17, -10.4, 3, 9.6, 16.2].map((x) => `M${f(x - 2.2)} 1L${f(x - 1.4)} 4.6H${f(x + 1.4)}L${f(x + 2.2)} 1Z`).join('')
    const mud = 'M8 -10.8C14 -9.4 22.4 -7.4 24.2 -2.6C24.6 0 23.2 1.4 21 1.4H2C.4 .2 1.6 -2.4 4 -2.6C2.6 -4.6 4.2 -7.6 6.4 -7.4C6.2 -9 6.8 -10.6 8 -10.8Z M-24 -3H-14C-14.4 -1 -16 .2 -18 .2C-17 -1.6 -20 -2.6 -24 -1Z'
    const laces = [0, 1, 2, 3, 4].map((i) => {
      const x = -6.4 + i * 3.1, y = -20.6 + i * 2.4
      return `<path d="M${f(x - 1.6)} ${f(y - 1.6)}L${f(x + 1.8)} ${f(y + 1.2)}" stroke="${P.white}" stroke-width=".9" stroke-linecap="round"/>`
    }).join('')
    const prints = [[-2.2, -14], [2.2, -14], [-2.2, -9], [2.2, -9], [0, -4.4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="1.5" fill="${P.brownD}" opacity=".85"/>`).join('')
    const splash = [[30, 84, 1.2], [88, 86, 1], [35, 79, 0.7], [84, 80, 0.8], [42, 96, 0.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    return (
      k.day() +
      k.stage(60, 60, 33) +
      `<path d="${ellipse(58, 91, 28, 5.6)}" fill="${P.brown}"/>` + k.shade(ellipse(58, 91, 28, 5.6), k.rad(P.brownD, 0.5, 0.4, 0.6, 0, 1), P.brownD, 0.4) +
      hair(36, 89.4, 42, 88, 48, 89, 0.5, P.goldL) + hair(68, 92.6, 74, 91.6, 80, 92.4, 0.5, P.goldL) +
      naipeFlat(k, 'joker', 70, 89.6, -16, 0.42, 1.05, prints) +
      k.floor(57, 84, 20, 2.2, P.night) +
      `<g transform="translate(57 66) rotate(-9) scale(1.25)">` +
      k.draw([
        { d: studs, fill: P.white, inner: `<path d="M-30 2.6H30V6H-30Z" fill="${P.brown}"/>` },
        {
          d: boot, fill: P.night,
          inner:
            `<path d="M-24 -1.6H26V2H-24Z" fill="${P.ink}"/>` +
            `<path d="M-23 -22C-23.6 -16 -23.6 -8 -22 -3L-19.4 -3C-20.6 -8 -20.6 -16 -19.6 -22Z" fill="${P.red}"/>` +
            k.sh('M-26 -14H26V2H-26Z', 0, 0, 0, 1, 0, 0.7, '#000', 0.3) +
            `<path d="M-19 -22C-19.4 -14 -19 -8 -17.6 -4" fill="none" stroke="${P.sky2}" stroke-width=".9" stroke-linecap="round" opacity=".5"/>` +
            `<path d="M-22 -4.6H22.4M7.6 -9.6C10.4 -6.6 11 -3.4 10.4 -.4" fill="none" stroke="${P.sky2}" stroke-width=".35" stroke-dasharray=".8 .8"/>` +
            `<path d="M-14 -16C-8 -12 0 -8 14 -6.2" fill="none" stroke="${P.white}" stroke-width="1.8" stroke-linecap="round"/>` +
            `<path d="${mud}" fill="${P.brown}"/>` + k.sh(mud, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) +
            [[-2, -8, 1], [-10, -6, 0.8], [14, -11, 0.7], [-17, -12, 0.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.brown}"/>`).join(''),
        },
      ], 0.6) +
      laces +
      `<path d="M-7.4 -24.6C-5.6 -29.4 1.4 -28.6 2.6 -24.4C1.6 -21 -2.6 -19.6 -4.8 -21Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".7"/><path d="M-5.4 -25.2C-3.8 -27.6 .2 -27.2 1 -25" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` +
      `<path d="${taper(4.6, 1.6, 4.4, 4, 4.8, 6.6, 2.2, 1.1)}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".35"/><path d="${taper(19.6, 1.6, 19.8, 3.4, 19.4, 5.4, 1.8, 0.9)}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      splash +
      hair(84, 64, 89, 62, 93, 64, 0.6, P.blue) + hair(83, 70, 88, 69.6, 92, 71.6, 0.5, P.blue) +
      sparkle(34, 40, 1.8) +
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
    const eye = `<ellipse cx="69" cy="86" rx="3.2" ry="2.2" fill="${P.paper}"/><circle cx="67.8" cy="86.2" r="1.3" fill="${P.ink}"/><path d="M65.6 84.6Q69 83 72.4 84.8" fill="none" stroke="${MURK_D}" stroke-width=".9"/>`
    return (
      k.day() +
      k.stage(60, 62, 33) +
      k.floor(61, 94.6, 21, 2.6) +
      k.draw([
        {
          d: jar, fill: P.sky1,
          inner:
            `<path d="${water}" fill="${MURK}"/>` + k.sh(water, 0, 0, 0, 1, 0, 1, MURK_D, 0.6) +
            fish +
            naipe(k, 'joker', 'translate(66 66) rotate(22) scale(.62)', 0.7) +
            `<path d="${water}" fill="${MURK}" opacity=".35"/>` +
            eye +
            `<path d="M38 55.4C46 53.6 52 56.6 60 54.8C68 53.2 74 56.2 82 54.8" fill="none" stroke="${P.goldL}" stroke-width=".7" opacity=".8"/>` +
            [[48, 64, 1], [46, 82, 0.8], [58, 88, 0.6], [74, 74, 0.7], [50, 59, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.paper}" stroke-width=".35" opacity=".8"/>`).join('') +
            k.sh('M64 38H82V96H64Z', 0, 0, 1, 0, 0, 0.7, P.night, 0.3) +
            `<path d="M45.4 48V88" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".55"/><path d="M48.6 50V60" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".5"/>`,
        },
        { d: lid, fill: P.white, line: 0.3, inner: k.sh(lid, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + [45.6, 48.6, 51.6, 54.6, 57.6, 60.6, 63.6, 66.6, 69.6, 72.6].map((x) => `<path d="M${x} 33V40.4" stroke="${P.sky2}" stroke-width=".5"/>`).join('') },
      ], 0.7) +
      `<g transform="rotate(-4 60 46)">` +
      k.draw([{ d: roundRect(46, 42.6, 74, 51.4, 0.8), fill: P.paper, inner: k.sh('M66 40H76V54H66Z', 0, 0, 1, 0, 0, 0.6, P.brown, 0.3) }], 0.4) +
      `<text x="60" y="48.8" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle">Riachuelo</text>` +
      `</g>` +
      `<path d="M86 34C90 30 92 36 88 38C84 40 82 34 86 34" fill="none" stroke="${P.ink}" stroke-width=".4" stroke-dasharray=".8 1"/>` +
      `<ellipse cx="88" cy="33.6" rx="1.2" ry=".8" fill="${P.ink}"/><ellipse cx="87.6" cy="32.6" rx="1" ry=".6" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><ellipse cx="88.6" cy="32.6" rx="1" ry=".6" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
      hair(33, 52, 30, 46, 33, 40, 0.6, P.greenD) + hair(37, 50, 40, 45, 37, 39, 0.5, P.greenD) +
      k.defs()
    )
  },

  // Ochenta sucias: el chancho en una bañadera de oro llena de barro, con corona y su canasta de comodines.
  'Chiquero de lujo': (u) => {
    const k = kit(u)
    const tub = 'M28.6 66H91.4C91.4 81 84 90.4 72 91.4H48C36 90.4 28.6 81 28.6 66Z'
    const rim = roundRect(25.4, 62, 94.6, 67.4, 2.6)
    const feet = ['M36 89C34.6 92 32.6 94.4 34.6 96.4H41.4C42 94 41.8 91.4 41 89Z', 'M84 89C85.4 92 87.4 94.4 85.4 96.4H78.6C78 94 78.2 91.4 79 89Z']
    const mud = 'M27.6 63C27.6 59 31.6 57 35 58.4C36 55.4 40.6 54.6 42.6 57C44 54.6 48 54.6 49 57C56 57.6 64 57.6 71 57C72 54.6 76 54.6 77.4 57C79.4 54.6 84 55.4 85 58.4C88.4 57 92.4 59 92.4 63Z'
    const drips = taper(33, 66, 32.6, 70, 33.4, 74, 3, 1.6) + taper(52, 66, 52, 69, 51.6, 72, 2.6, 1.4) + taper(80, 66, 80.4, 71, 80, 76, 3, 1.6)
    const head = 'M60 33.6C68.4 33.6 73.4 39.6 73.4 46.4C73.4 53.6 67.6 58.6 60 58.6C52.4 58.6 46.6 53.6 46.6 46.4C46.6 39.6 51.6 33.6 60 33.6Z'
    const earL = 'M49.4 38.6C46.6 34.6 46 30.4 47 27.4C51.2 28.4 54.4 31.4 55.6 35Z'
    const earR = 'M70.6 38.6C73.4 34.6 74 30.4 73 27.4C68.8 28.4 65.6 31.4 64.4 35Z'
    const snout = ellipse(60, 50.4, 5.4, 3.8)
    const trotL = roundRect(36, 54.6, 43, 62.6, 3.2), trotR = roundRect(77, 52.6, 84, 60.6, 3.2)
    const crown = 'M52.4 34.2L51.2 25.8L55.4 29.4L60 23.4L64.6 29.4L68.8 25.8L67.6 34.2Z'
    const gold = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` })
    const pink = (d: string, line = 0) => ({ d, fill: PINK, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, PINK_D, 0.4) })
    return (
      k.day() +
      k.sun(60, 54, 18, 46, 28, false) +
      k.floor(60, 96, 30, 2.6) +
      k.draw([gold(feet[0]), gold(feet[1])], 0.6) +
      k.draw([gold(tub, 0.35), gold(rim)], 0.75) +
      `<path d="M31 71.4H89" stroke="${P.goldL}" stroke-width=".8" opacity=".8"/>` +
      `<path d="${starPath(60, 79, 3.4, 1.4, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/>` +
      fan(k, ['joker', ['2', 's'], ['K', 'h'], ['2', 'd'], 'joker'], 84, 62, 24, 4, 0.66) +
      k.draw([pink(earL), pink(earR)], 0.6) +
      k.draw([pink(head, 0)], 0.7) +
      `<path d="M50 41.4Q53 39.4 56 41.4M64 41.4Q67 39.4 70 41.4" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
      `<ellipse cx="50.4" cy="46.4" rx="2.6" ry="1.5" fill="${P.red}" opacity=".3"/><ellipse cx="69.6" cy="46.4" rx="2.6" ry="1.5" fill="${P.red}" opacity=".3"/>` +
      k.draw([{ d: snout, fill: PINK, inner: k.sh(snout, 0, 0, 1, 1, 0, 0.8, PINK_D, 0.4) }], 0.45) +
      `<ellipse cx="58.2" cy="50.4" rx=".9" ry="1.4" fill="${P.wine}"/><ellipse cx="61.8" cy="50.4" rx=".9" ry="1.4" fill="${P.wine}"/>` +
      hair(56, 55.4, 60, 57.2, 64, 55.4, 0.6) +
      k.draw([gold(crown)], 0.55) + `<circle cx="60" cy="29.6" r="1.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.draw([{ d: mud, fill: P.brown, inner: k.sh(mud, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) }, { d: drips, fill: P.brown, inner: k.sh(drips, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) }], 0.6) +
      [[38, 59, 1.1], [46, 60.4, 0.8], [74, 60.2, 1], [64, 61.2, 0.7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.brownD}" stroke-width=".4"/>`).join('') +
      hair(31, 59.6, 35, 58.4, 38, 59, 0.6, P.goldL) +
      k.draw([pink(trotL), pink(trotR)], 0.55) +
      `<path d="M39.5 58.6V62.4M80.5 56.6V60.4" stroke="${P.ink}" stroke-width=".5"/>` +
      `<circle cx="54" cy="55" r=".9" fill="${P.brownD}"/><circle cx="67" cy="37.6" r=".7" fill="${P.brownD}"/>` +
      sparkle(34, 42, 2.4) + sparkle(90, 42, 1.8) +
      k.defs()
    )
  },

  // ── Se fue ─────────────────────────────────────────────────────────

  // Cinco cierres: el portazo, con las cartas volando por la corriente de aire.
  'Portazo': (u) => {
    const k = kit(u)
    const frame = 'M40 33H80V94H40Z'
    const leaf = 'M43.4 36.4H76.6V94H43.4Z'
    const panels = [roundRect(47, 40, 58.4, 60, 0.8), roundRect(61.6, 40, 73, 60, 0.8), roundRect(47, 66, 58.4, 89, 0.8), roundRect(61.6, 66, 73, 89, 0.8)]
    const puff = (x: number, y: number, s: number) => {
      const d = 'M-6 2C-8 2 -8.6 -1 -6.4 -1.8C-6.6 -4.6 -2.6 -5.6 -1.2 -3.4C.4 -6 4.6 -4.8 4.4 -1.8C6.6 -1.6 7 1.8 4.6 2Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.45) }], 0.45 / s) + `</g>`
    }
    return (
      k.day() +
      k.stage(60, 62, 33) +
      k.floor(60, 95, 24, 2.4) +
      k.draw([
        { d: frame, fill: P.white, inner: k.sh(frame, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) },
        {
          d: leaf, fill: P.brown, line: 0.35,
          inner:
            panels.map((d) => `<path d="${d}" fill="${P.brownD}" opacity=".35"/><path d="${d}" fill="none" stroke="${P.ink}" stroke-width=".45"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".4" opacity=".6" transform="translate(-.6 -.6)"/>`).join('') +
            k.sh('M62 34H78V96H62Z', 0, 0, 1, 0, 0, 0.75, P.brownD, 0.4) + `<path d="M44 34H50V96H44Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` +
            hair(52, 42, 51, 50, 52.6, 58, 0.4, P.brownD) + hair(66, 68, 67, 78, 65.6, 87, 0.4, P.brownD),
        },
      ], 0.7) +
      `<circle cx="72.6" cy="64" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><circle cx="72" cy="63.4" r=".6" fill="#fff"/><path d="M72.6 67.4V69.4" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
      hair(36, 36, 32, 34, 28, 33, 0.8) + hair(35.4, 46, 31, 45.4, 27, 46, 0.8) + hair(84, 36, 88, 34, 92, 33, 0.8) + hair(84.6, 46, 89, 45.4, 93, 46, 0.8) +
      hair(38, 30, 36, 27, 33, 25.6, 0.6) + hair(82, 30, 84, 27, 87, 25.6, 0.6) +
      puff(37, 92, 0.8) + puff(83, 92, 0.9) +
      naipe(k, ['K', 's'], 'translate(30 70) rotate(-32) scale(.62)', 0.7) + naipe(k, ['7', 'h'], 'translate(90 62) rotate(28) scale(.58)', 0.7) + naipe(k, 'red', 'translate(86 84) rotate(64) scale(.5)', 0.8) +
      hair(26, 76, 30, 80, 35, 81, 0.5, P.blue) + hair(94, 68, 92, 73, 88, 75, 0.5, P.blue) +
      `<g transform="rotate(-10 60 26)"><text x="60" y="28.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="7" fill="${P.red}" text-anchor="middle">¡pum!</text></g>` +
      k.defs()
    )
  },

  // Veinticinco cierres: la persiana del almacén, baja a la hora de la siesta.
  'Persiana baja': (u) => {
    const k = kit(u)
    const wall = 'M26 30H94V92H26Z'
    const sign = roundRect(31, 27.6, 89, 37.4, 1.4)
    const box = 'M33.4 37.4H86.6V42.6H33.4Z'
    const shutter = 'M34.6 42.6H85.4V89H34.6Z'
    const slats = Array.from({ length: 15 }, (_, i) => {
      const y = 45.4 + i * 3
      return `<path d="M34 ${y}H86" stroke="${P.blue}" stroke-width=".55"/><path d="M34 ${f(y + 0.7)}H86" stroke="#fff" stroke-width=".5" opacity=".8"/>`
    }).join('')
    const card = roundRect(47, 55.6, 73, 70.4, 0.8)
    const lockBody = roundRect(56.6, 85, 63.4, 91, 1.2)
    return (
      k.day() +
      k.draw([{ d: wall, fill: P.white, inner: Array.from({ length: 12 }, (_, i) => `<path d="M20 ${30 + i * 5.4}H100" stroke="${P.sky2}" stroke-width=".4"/>`).join('') + k.sh(wall, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) }], 0.6) +
      `<path d="M20 92H100V100H20Z" fill="${P.sky2}"/><path d="M20 92H100" stroke="${P.ink}" stroke-width=".8"/>` +
      [28, 40, 52, 64, 76, 88].map((x) => `<path d="M${x} 92L${x - 3} 100" stroke="${P.blue}" stroke-width=".4"/>`).join('') +
      k.draw([
        { d: shutter, fill: P.sky1, inner: slats + k.sh('M66 40H88V92H66Z', 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + k.sh('M30 42H90V50H30Z', 0, 0, 0, 1, 0.8, 0, P.mid, 0.4) },
        { d: box, fill: P.sky2, inner: k.sh(box, 0, 0, 0, 1, 0, 0.8, P.mid, 0.4) },
        { d: sign, fill: P.mid, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) + `<rect x="32.6" y="29.2" width="54.8" height="6.6" rx=".8" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` },
      ], 0.7) +
      `<text x="60" y="34.6" ${GEORGIA} font-style="italic" font-size="5.8" fill="${P.goldL}" text-anchor="middle">Almacén</text>` +
      `<path d="M34.6 86.4H85.4" stroke="${P.ink}" stroke-width="1.6"/><path d="M34.6 86.4H85.4" stroke="${P.sky2}" stroke-width=".6"/>` +
      `<path d="M57.6 85.4V82.6C57.6 79.6 62.4 79.6 62.4 82.6V85.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M57.6 85.4V82.6C57.6 79.6 62.4 79.6 62.4 82.6V85.4" fill="none" stroke="${P.sky2}" stroke-width=".6"/>` +
      k.draw([{ d: lockBody, fill: P.gold, inner: k.sh(lockBody, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.5) + `<circle cx="60" cy="87.4" r=".7" fill="${P.ink}"/><path d="M60 87.6V89.2" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M60 49.6L50 56.4M60 49.6L70 56.4" stroke="${P.ink}" stroke-width=".4"/><circle cx="60" cy="49.4" r=".9" fill="${P.ink}"/>` +
      `<g transform="rotate(-6 60 63)">` +
      k.draw([{ d: card, fill: P.goldL, inner: k.sh(card, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) }], 0.5) +
      `<text x="60" y="63.2" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.4" fill="${P.ink}" text-anchor="middle">Cerrado</text>` +
      `<text x="60" y="68.2" ${GEORGIA} font-style="italic" font-size="3" fill="${P.ink}" text-anchor="middle">vuelvo a las 17</text>` +
      `</g>` +
      `<text x="78" y="80" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.mid}" transform="rotate(-14 78 80)">zzz</text>` +
      k.defs()
    )
  },

  // Setenta y cinco cierres: el último en irse apaga la luz; el filamento, una corona, todavía brilla.
  'El que apaga la luz': (u) => {
    const k = kit(u)
    const glass = 'M54.6 49C54.6 53.6 43.4 57.4 43.4 70C43.4 80.4 50.6 88.4 60 88.4C69.4 88.4 76.6 80.4 76.6 70C76.6 57.4 65.4 53.6 65.4 49Z'
    const base = 'M53.6 40.6H66.4V49.6H53.6Z'
    const socket = roundRect(52.4, 29, 67.6, 41.6, 1.6)
    const crown = 'M52.8 73L51.6 64.4L56.2 68.6L60 61.6L63.8 68.6L68.4 64.4L67.2 73Z'
    const chain = along(66, 38, 72, 56, 70, 70, Array.from({ length: 16 }, (_, i) => i / 15)).map((q) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    const tassel = 'M70 70.4C68.4 72 67.8 76 68.2 78.4H71.8C72.2 76 71.6 72 70 70.4Z'
    return (
      k.night() +
      [[30, 34], [90, 30], [26, 70], [94, 76], [38, 24], [82, 92], [86, 52]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="M37 40C31 40 28 46 30 51C32 48 36 46.6 40 47C37.6 45 37 42.6 37 40Z" fill="${P.goldL}" opacity=".9"/>` +
      k.shade(ellipse(60, 68, 30, 30), k.rad(P.gold, 0.5, 0.5, 0.5, 0.55, 0), P.gold, 0.35) +
      `<path d="M60 10V30" stroke="${P.ink}" stroke-width="2"/><path d="M60 10V30" stroke="${P.sky2}" stroke-width=".7"/>` +
      k.draw([
        { d: glass, fill: P.mid, inner: k.sh(glass, 0, 0, 1, 1, 0, 0.9, P.night, 0.4) + k.shade(ellipse(60, 69, 14, 14), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.gold, 0.5) + `<path d="M48.4 66C48.4 60 52 56 56 54.4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>` },
        { d: base, fill: P.goldD, inner: [42.4, 44.6, 46.8].map((y) => `<path d="M53 ${y}L67 ${f(y + 1.2)}" stroke="${P.goldL}" stroke-width=".9"/>`).join('') + k.sh(base, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) },
        { d: socket, fill: P.white, inner: k.sh(socket, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
      ], 0.7) +
      `<path d="M57.4 49.6L54.6 70M62.6 49.6L65.4 70" stroke="${P.sky2}" stroke-width=".45"/>` +
      `<path d="${crown}" fill="${P.gold}" opacity=".4"/>` +
      `<path d="${crown}" fill="none" stroke="${P.goldL}" stroke-width="1" stroke-linejoin="round"/>` +
      `<circle cx="60" cy="61.6" r=".9" fill="${P.goldL}"/><circle cx="51.6" cy="64.4" r=".7" fill="${P.goldL}"/><circle cx="68.4" cy="64.4" r=".7" fill="${P.goldL}"/>` +
      chain +
      k.draw([{ d: tassel, fill: P.gold, inner: k.sh(tassel, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) }], 0.45) +
      hair(75, 74, 78, 77, 77.4, 81, 0.6, P.goldL) + hair(77, 70, 81, 72, 81.6, 76, 0.5, P.goldL) +
      `<text x="80" y="66" ${GEORGIA} font-style="italic" font-size="5.6" fill="${P.goldL}" transform="rotate(-10 80 66)">clic</text>` +
      sparkle(34, 64, 1.8, P.goldL) + sparkle(86, 40, 2.2, P.goldL) +
      k.defs()
    )
  },

  // ── Muerto olvidado ────────────────────────────────────────────────

  // Un muerto sin tomar: quedó guardado en el ropero, con telarañas y una polilla.
  'Muerto en el ropero': (u) => {
    const k = kit(u)
    const body = 'M35 32H77V91H35Z'
    const cornice = 'M32.6 27.4H79.4L78 32H34Z'
    const doorL = 'M37.4 34.6H55.6V88.4H37.4Z'
    const inside = 'M56.4 34.6H74.6V88.4H56.4Z'
    const doorR = 'M74.6 34.6L88 38V85L74.6 88.4Z'
    const mirror = ellipse(46.5, 56, 6, 13)
    const web = `<path d="M56.4 34.6L64 42M56.4 34.6L59.6 44.6M56.4 34.6L66 37.6" stroke="${P.paper}" stroke-width=".3"/>` +
      `<path d="M58.4 36.6Q59.6 38 61.4 36.4M57.6 39.6Q60.4 40.6 63 38.6M57.6 41.6Q61 43.6 64.4 40.4" fill="none" stroke="${P.paper}" stroke-width=".3"/>`
    const moth = (x: number, y: number) => `<g transform="translate(${x} ${y}) rotate(-20)"><path d="M0 0C-3 -3.6 -6 -2.4 -5 .4C-4.4 1.8 -2 1.6 0 0ZM0 0C3 -3.6 6 -2.4 5 .4C4.4 1.8 2 1.6 0 0Z" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/><path d="M0 -1V1.6" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/><path d="M-.3 -1L-1.2 -2.6M.3 -1L1.2 -2.6" stroke="${P.ink}" stroke-width=".3"/></g>`
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(62, 94, 28, 2.4) +
      `<path d="M37 91V95M75 91V95" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M37 91V94.4M75 91V94.4" stroke="${P.brownD}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([
        { d: body, fill: P.brown, inner: k.sh(body, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.4) },
        { d: cornice, fill: P.brownD, inner: `<path d="M33 29.4H79" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` },
        { d: doorL, fill: P.brown, line: 0.35, inner: `<path d="M38 35H44V88H38Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="${mirror}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` + `<path d="M43.4 50L47.4 46M43.6 56L49 50.6" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` + k.sh(doorL, 0, 0, 1, 0, 0, 0.6, P.brownD, 0.35) },
        {
          d: inside, fill: P.night,
          inner: k.sh(inside, 0, 0, 0, 1, 0, 0.5, P.mid, 0.4) + `<path d="M56.4 46H74.6" stroke="${P.brownD}" stroke-width="1.2"/>` +
            `<path d="M63 46.4V48.6M63 48.6L58.4 53.2H67.6Z" fill="none" stroke="${P.sky2}" stroke-width=".55" stroke-linejoin="round"/>` + web,
        },
        { d: doorR, fill: P.brown, line: 0.35, inner: `<path d="M77 39.6L86 41.8V81.4L77 83.8Z" fill="none" stroke="${P.brownD}" stroke-width=".6"/>` + k.sh(doorR, 0, 0, 1, 0, 0, 0.5, P.brownD, 0.3) },
      ], 0.7) +
      `<circle cx="54" cy="62" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="76.4" cy="62" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M56.4 88.4H74.6V84H56.4Z" fill="${P.brownD}"/>` +
      pile(k, 65.4, 78.4, -8, 'red', 11, 0.44, 0.78, 0.42) +
      [[60, 71, 0.35], [68, 69, 0.3], [64, 66, 0.25], [71, 74, 0.3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}" opacity=".8"/>`).join('') +
      moth(86, 30) + `<path d="M78 46C82 42 80 38 84 34" fill="none" stroke="${P.ink}" stroke-width=".35" stroke-dasharray=".7 .9"/>` +
      sparkle(30, 44, 1.6) +
      k.defs()
    )
  },

  // Cinco muertos sin tomar: velorio, con el muerto entre velas y la bandeja de sánguches de miga.
  'Velorio con sanguchitos': (u) => {
    const k = kit(u)
    const sandwich = (x: number, y: number, s: number) => {
      const d = 'M-6 0L0 -9L6 0Z'
      const layers = `<path d="M-8 -3.2H8V-2.4H-8Z" fill="${PINK}"/><path d="M-8 -6.4H8V-5.6H-8Z" fill="${P.goldL}"/><path d="M-8 -5.6H8V-5.1H-8Z" fill="${P.green}"/>`
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: layers + k.sh(d, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.35) }], 0.45 / s) + `</g>`
    }
    const tray = ellipse(60, 86, 27, 6.6)
    const candle = (x: number) => {
      const stick = `M${x - 1.8} 46H${x + 1.8}V80H${x - 1.8}Z`
      const holder = `M${x - 4.6} 80H${x + 4.6}L${x + 3} 83.4H${x - 3}Z`
      const fl = `M${x} 37C${x + 2.2} 40.6 ${x + 2.2} 43.4 ${x} 44.6C${x - 2.2} 43.4 ${x - 2.2} 40.6 ${x} 37Z`
      return k.shade(ellipse(x, 41, 7, 7), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
        k.draw([
          { d: stick, fill: P.white, inner: k.sh(stick, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
          { d: holder, fill: P.gold, inner: k.sh(holder, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) },
          { d: fl, fill: P.gold, inner: `<path d="M${x} 40C${x + 1} 41.6 ${x + 1} 43 ${x} 43.6C${x - 1} 43 ${x - 1} 41.6 ${x} 40Z" fill="${P.goldL}"/>` },
        ], 0.5) + `<path d="M${x} 44.6V46" stroke="${P.ink}" stroke-width=".5"/>`
    }
    const bow = 'M60 52.6C56 49 51.4 49.6 52 52.6C52.6 55.6 57 55 60 52.6ZM60 52.6C64 49 68.6 49.6 68 52.6C67.4 55.6 63 55 60 52.6Z'
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.85), P.night, 0.6) +
      Array.from({ length: 10 }, (_, i) => hair(24 + i * 8, 14, 22 + i * 8 + (i % 2) * 3, 50, 24 + i * 8, 100, 0.8, P.night, 0.5)).join('') +
      candle(34) + candle(86) +
      k.floor(60, 66, 20, 2, '#000') +
      pile(k, 60, 58, 4, 'blue', 11, 0.42, 1.2, 0.5) +
      k.draw([{ d: bow, fill: P.night, inner: `<path d="M53.4 52.4C55.4 51.4 57.6 51.8 59 52.6" fill="none" stroke="${P.sky2}" stroke-width=".4" opacity=".6"/>` }], 0.45) +
      `<path d="M58.6 53.4L56 59.4L58 58.8L58.6 60.6ZM61.4 53.4L64 59.4L62 58.8L61.4 60.6Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".35"/><circle cx="60" cy="52.6" r="1.3" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.floor(61, 92, 28, 2.4, '#000') +
      k.draw([{ d: tray, fill: P.white, inner: k.sh(tray, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="${ellipse(60, 85.6, 23, 5)}" fill="none" stroke="${P.sky2}" stroke-width=".6"/>` }], 0.7) +
      sandwich(44, 86, 1) + sandwich(54.6, 86.6, 1) + sandwich(65.4, 86.6, 1) + sandwich(76, 86, 1) +
      sandwich(49.4, 80.4, 1) + sandwich(60, 80.8, 1) + sandwich(70.6, 80.4, 1) +
      sandwich(54.8, 74.6, 1) + sandwich(65.2, 74.6, 1) +
      sandwich(60, 68.8, 1) +
      k.defs()
    )
  },

  // Quince muertos olvidados: un fantasma con dorso de naipe ronda los palcos del Colón.
  'Fantasma del Colón': (u) => {
    const k = kit(u)
    const ghost = 'M60 28C49.4 28 44 35.4 44 45V74C44 76 45.6 76.8 47 75.4L49.4 73L52.4 77L55.8 73L59 77.4L62.4 73L65.6 77L68.6 73L71.4 75.6C72.8 77 76 76.6 76 74V45C76 35.4 70.6 28 60 28Z'
    const inset = 'M60 31.4C51.6 31.4 47.4 37.4 47.4 45V70.6H72.6V45C72.6 37.4 68.4 31.4 60 31.4Z'
    const lat = Array.from({ length: 16 }, (_, i) => {
      const x = 20 + i * 3
      return `M${x} 20L${x + 40} 80M${x + 40} 20L${x} 80`
    }).join('')
    const tiers = [40, 56, 72].map((y, i) => {
      const band = `M18 ${y}Q60 ${y + 10} 102 ${y}V${y + 9}Q60 ${y + 19} 18 ${y + 9}Z`
      const boxes = Array.from({ length: 9 }, (_, j) => {
        const x = 24 + j * 9, yy = y + 3 + 9 * (1 - ((x - 60) / 42) ** 2) * 0.9
        return `<path d="M${f(x - 3)} ${f(yy + 6)}V${f(yy + 1.6)}Q${x} ${f(yy - 1.4)} ${f(x + 3)} ${f(yy + 1.6)}V${f(yy + 6)}Z" fill="${P.night}" opacity=".8"/>`
      }).join('')
      return `<path d="${band}" fill="${P.red}" opacity="${0.5 + i * 0.1}"/>` + boxes + `<path d="M18 ${y + 9}Q60 ${y + 19} 102 ${y + 9}" fill="none" stroke="${P.gold}" stroke-width="1.1"/><path d="M18 ${y}Q60 ${y + 10} 102 ${y}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`
    }).join('')
    const curtain = (s: number) =>
      `<g transform="translate(${s > 0 ? 0 : 120} 0) scale(${s} 1)">` +
      k.draw([{ d: 'M14 10H34C30 30 28 60 30 76C31 86 34 96 36 104H14Z', fill: P.red, inner: k.sh('M14 10H36V106H14Z', 0, 0, 1, 0, 0.2, 0.9, P.wine, 0.4) + hair(22, 14, 21, 60, 24, 104, 1, P.wine) + hair(28, 14, 25, 50, 28, 96, 0.7, P.wine) }], 0.7) +
      `<path d="M30.4 74C34 72 36 76 34 79" fill="none" stroke="${P.gold}" stroke-width="1.6" stroke-linecap="round"/><circle cx="34.6" cy="81" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>`
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      tiers +
      k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.5, 0.7, 0, 0.9), P.night, 0.6) +
      k.shade(ellipse(60, 20, 30, 14), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<path d="M60 10V20" stroke="${P.gold}" stroke-width=".8"/>` +
      `<path d="M50 20Q60 27 70 20" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` + [50, 55, 60, 65, 70].map((x, i) => `<circle cx="${x}" cy="${[20, 23, 24, 23, 20][i] + 1.6}" r="1" fill="${P.goldL}"/>`).join('') +
      curtain(1) + curtain(-1) +
      k.shade(ellipse(60, 54, 24, 30), k.rad(P.sky1, 0.5, 0.5, 0.5, 0.45, 0), P.sky1, 0.4) +
      k.draw([{
        d: ghost, fill: P.mid,
        inner:
          k.clip(inset, `<path d="${lat}" stroke="${P.paper}" stroke-width=".35" opacity=".45"/>`) + `<path d="${inset}" fill="none" stroke="${P.paper}" stroke-width=".7"/>` +
          k.sh(ghost, 0, 0, 1, 1, 0, 0.9, P.night, 0.4) + `<path d="M46 34H54V76H46Z" fill="${k.lin(P.sky1, 0, 0, 1, 0, 0.35, 0)}"/>`,
      }], 0.8) +
      `<ellipse cx="54.6" cy="45" rx="3.2" ry="4.2" fill="${P.paper}"/><ellipse cx="65.4" cy="45" rx="3.2" ry="4.2" fill="${P.paper}"/>` +
      `<circle cx="55.2" cy="46.2" r="1.7" fill="${P.ink}"/><circle cx="66" cy="46.2" r="1.7" fill="${P.ink}"/>` +
      `<ellipse cx="60" cy="56" rx="2.4" ry="3.2" fill="${P.night}" stroke="${P.paper}" stroke-width=".6"/>` +
      `<path d="M18 92Q60 100 102 92V104H18Z" fill="${P.wine}"/>` +
      `<path d="M18 90Q60 98 102 90" fill="none" stroke="${P.ink}" stroke-width="3"/><path d="M18 90Q60 98 102 90" fill="none" stroke="${P.gold}" stroke-width="1.8"/>` +
      sparkle(84, 32, 2, P.goldL) + sparkle(36, 34, 1.4, P.goldL) +
      k.defs()
    )
  },
}
