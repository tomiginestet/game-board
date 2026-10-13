// Rummikub: el bingo de la mesa, el atril que se vacía y el comodín que te queda atragantado, en clave heroica.
// Manda el azul de la ficha del juego en el catálogo: el atril, los cartones, la carpa; y las fichas de marfil con
// los números en sus cuatro colores. El comodín y el payaso se cuentan con objetos (la nariz, el gorro, la carpa),
// nunca con caras.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** El azul de la ficha del Rummikub en el catálogo, con su sombra y su luz. */
const RB = '#1971C2', RB_D = '#0E4A85', RB_L = '#6FA8E6'
/** El marfil de las fichas, su sombra y su canto. */
const IVORY = '#FBF5E6', IVORY_D = '#CDBE98', IVORY_E = '#E9DDBF'
/** Los cuatro colores de los números. */
const NUM = { r: '#D23B2F', b: RB, k: '#24262C', o: '#E8891C' }
/** El rojo de la nariz de payaso. */
const NOSE = '#E0322B', NOSE_D = '#99161B'

/** Varilla entintada (alambre, poste, cordón): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Resplandor dorado detrás del protagonista. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7) => k.shade(ellipse(cx, cy, rx, ry), k.rad(P.goldL, 0.5, 0.5, 0.5, a, 0), P.goldL, 0.45)

// ── La ficha y el atril ──────────────────────────────────────────────

const TW = 6.6, TH = 8.8
/** La cara de la ficha centrada en (0,0): 13,2 de ancho por 17,6 de alto. */
const TILE = roundRect(-TW, -TH, TW, TH, 1.8)

/** Ficha de Rummikub parada de frente, centrada en (0,0): marfil, con el canto abajo a la derecha y el número en su
 * color con el aro debajo. `s` la agranda sin agrandar el grano; `mark` reemplaza al número (el comodín); `gold`
 * suma el filete de las medallas altas. */
function tile(k: Kit, n: string, c: string, o: { w?: number; mark?: string; gold?: boolean; s?: number } = {}) {
  const s = o.s ?? 1, tw = TW * s, th = TH * s, e = 1.5 * s, r = 1.8 * s
  const face = s === 1 ? TILE : roundRect(-tw, -th, tw, th, r)
  const edge = roundRect(f(-tw + 0.6 * s), f(-th + e), f(tw + 0.9 * s), f(th + e), r)
  const two = n.length > 1
  return (
    k.draw([
      { d: edge, fill: IVORY_E, inner: k.sh(edge, 0, 0, 1, 1, 0.2, 0.9, IVORY_D, 0.45) },
      {
        d: face, fill: IVORY,
        inner: k.sh(face, 0, 0, 1, 1, 0, 0.6, IVORY_D, 0.35) + `<path d="M${f(-tw - 1)} ${f(-th - 1)}H${f(-2.4 * s)}V${f(th + 1)}H${f(-tw - 1)}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` +
          `<path d="${roundRect(f(-tw + s), f(-th + s), f(tw - s), f(th - s), f(1.1 * s))}" fill="none" stroke="${IVORY_D}" stroke-width="${f(0.35 * Math.sqrt(s))}"/>` +
          (o.gold ? `<path d="${roundRect(f(-tw + 1.7 * s), f(-th + 1.7 * s), f(tw - 1.7 * s), f(th - 1.7 * s), f(0.7 * s))}" fill="none" stroke="${P.gold}" stroke-width="${f(0.4 * s)}" stroke-dasharray="${f(1.6 * s)} ${f(0.5 * s)} ${f(0.4 * s)} ${f(0.5 * s)}"/>` : ''),
      },
    ], o.w ?? 0.5) +
    (o.mark ??
      `<text x="0" y="${f((two ? 2.6 : 3.2) * s)}" ${GEORGIA} font-weight="700" font-size="${f((two ? 7.4 : 9) * s)}" fill="${c}" text-anchor="middle">${n}</text>` +
      `<circle cx="0" cy="${f(5.9 * s)}" r="${f(0.95 * s)}" fill="none" stroke="${c}" stroke-width="${f(0.5 * s)}"/>`)
  )
}

/** Atril de Rummikub en perspectiva, en el azul de la ficha del juego: el perfil escalonado (zócalo, escalón y
 * respaldo inclinado) visto desde adelante a la izquierda, con la punta derecha mostrando la escalera.
 * (x0,y0) es la esquina de adelante abajo a la izquierda; L, el largo. */
function rack(k: Kit, x0: number, y0: number, L: number) {
  const prof: [number, number][] = [[0, 0], [0, 3.2], [3.8, 3.2], [4.6, 9.6], [7.8, 9.6], [9.6, 17.4], [11.4, 17.4], [11.4, 0]]
  const pt = (X: number, z: number, y: number) => `${f(x0 + X + z * 0.55)} ${f(y0 - y - z * 0.45)}`
  const face = (i: number) => { const [za, ya] = prof[i], [zb, yb] = prof[i + 1]; return `M${pt(0, za, ya)}L${pt(L, za, ya)}L${pt(L, zb, yb)}L${pt(0, zb, yb)}Z` }
  const end = 'M' + prof.map(([z, y]) => pt(L, z, y)).join('L') + 'Z'
  const TOP = '#A9CDF2'
  const fills = [RB, TOP, RB, TOP, RB, TOP]
  const box = `M${x0 - 2} ${y0 - 30}H${x0 + L + 10}V${y0 + 2}H${x0 - 2}Z`
  const pieces = fills.map((fill, i) => ({
    d: face(i), fill,
    inner: k.sh(box, 0, 0, 1, 0, 0, 0.75, fill === TOP ? RB : RB_D, 0.35) + `<path d="M${x0 - 2} ${y0 - 30}H${f(x0 + L * 0.2)}V${y0 + 2}H${x0 - 2}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, fill === TOP ? 0.5 : 0.3, 0)}"/>`,
  }))
  const edges = [1, 2, 3, 4, 5, 6].map((i) => { const [z, y] = prof[i]; return `M${pt(0, z, y)}L${pt(L, z, y)}` }).join('')
  const shine = [[3.2, 1], [9.6, 1], [17.4, 0.6]].map(([y, w]) => { const z = y === 3.2 ? 0 : y === 9.6 ? 4.6 : 9.6; return hair(x0 + 3 + z * 0.55, y0 - y - z * 0.45 + 0.5, x0 + L * 0.35 + z * 0.55, y0 - y - z * 0.45 + 0.3, x0 + L * 0.7 + z * 0.55, y0 - y - z * 0.45 + 0.5, w, '#fff', 0.85) }).join('')
  return (
    k.draw([...pieces, { d: end, fill: RB_D, inner: k.sh(end, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) }], 0.75) +
    `<path d="${edges}" fill="none" stroke="${P.ink}" stroke-width=".45"/>` + shine
  )
}

/** Nariz de payaso: la esfera roja con su brillo. */
function nose(k: Kit, x: number, y: number, r: number) {
  const d = ellipse(x, y, r, r)
  return k.draw([{ d, fill: NOSE, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, NOSE_D, 0.5) + `<path d="M${f(x - r)} ${f(y - r)}H${f(x - r * 0.1)}V${f(y + r)}H${f(x - r)}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` }], 0.7) +
    `<ellipse cx="${f(x - r * 0.38)}" cy="${f(y - r * 0.42)}" rx="${f(r * 0.32)}" ry="${f(r * 0.2)}" fill="#fff" opacity=".9" transform="rotate(-35 ${f(x - r * 0.38)} ${f(y - r * 0.42)})"/>` +
    `<circle cx="${f(x + r * 0.42)}" cy="${f(y + r * 0.36)}" r="${f(r * 0.1)}" fill="#fff" opacity=".6"/>`
}

/** Cascabel dorado con su ranura y su argolla. */
function bell(k: Kit, x: number, y: number, r: number) {
  const d = ellipse(x, y, r, r)
  return k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) }], 0.5) +
    `<path d="M${f(x - r * 0.75)} ${f(y + r * 0.2)}H${f(x + r * 0.75)}" stroke="${P.ink}" stroke-width="${f(r * 0.22)}" stroke-linecap="round"/><circle cx="${x}" cy="${f(y + r * 0.55)}" r="${f(r * 0.16)}" fill="${P.ink}"/>` +
    `<circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.22)}" fill="#fff"/>`
}

/** Poroto de los que marcan el cartón. */
const BEAN = 'M-2 -.4C-2 -1.6 -.6 -2 .4 -1.6C1 -1.4 1.4 -1.4 1.8 -1.2C2.6 -.6 2.4 1 1.2 1.4C-.2 1.9 -2 1.4 -2 -.4Z'
const bean = (x: number, y: number, r: number, s = 1.15) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${r}) scale(${s})"><path d="${BEAN}" fill="#9C5B3B" stroke="${P.ink}" stroke-width=".35"/><path d="M-1.2 -.8C-.6 -1.2 .2 -1.2 .6 -1" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-linecap="round"/><circle cx=".2" cy=".5" r=".35" fill="${P.brownD}"/></g>`

/** Cartón de bingo de 9 columnas por 3 filas, centrado en (0,0), con la franja de arriba en el azul del juego.
 * `rows` son los números de cada fila por columna (0 = casillero vacío). */
function bingoCard(k: Kit, w: number, h: number, rows: number[][], o: { title?: boolean; numbers?: boolean } = {}) {
  const card = roundRect(-w / 2, -h / 2, w / 2, h / 2, 1.6)
  const x0 = -w / 2 + 2.2, x1 = w / 2 - 2.2, yh = -h / 2 + 2.2, y0 = yh + h * 0.2, y1 = h / 2 - 2.2
  const cw = (x1 - x0) / 9, ch = (y1 - y0) / 3
  let cells = '', grid = ''
  rows.forEach((row, r) => row.forEach((n, c) => {
    const cx = x0 + (c + 0.5) * cw, cy = y0 + (r + 0.5) * ch
    if (!n) cells += `<path d="M${f(x0 + c * cw)} ${f(y0 + r * ch)}h${f(cw)}v${f(ch)}h${f(-cw)}Z" fill="${RB_L}" opacity=".45"/>`
    else if (o.numbers !== false) cells += `<text x="${f(cx)}" y="${f(cy + ch * 0.18)}" ${GEORGIA} font-weight="700" font-size="${f(ch * 0.5)}" fill="${P.ink}" text-anchor="middle">${n}</text>`
  }))
  for (let c = 1; c < 9; c++) grid += `M${f(x0 + c * cw)} ${f(y0)}V${f(y1)}`
  for (let r = 1; r < 3; r++) grid += `M${f(x0)} ${f(y0 + r * ch)}H${f(x1)}`
  return (
    k.draw([{
      d: card, fill: IVORY,
      inner: k.sh(card, 0, 0, 1, 1, 0, 0.5, IVORY_D, 0.3) + `<path d="M${-w / 2 - 1} ${-h / 2 - 1}H${f(-w / 4)}V${h / 2 + 1}H${-w / 2 - 1}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
        `<path d="M${f(x0)} ${f(yh)}H${f(x1)}V${f(y0 - 0.6)}H${f(x0)}Z" fill="${RB}"/>` + cells +
        `<path d="${grid}" stroke="${RB}" stroke-width=".35"/><path d="M${f(x0)} ${f(y0)}H${f(x1)}V${f(y1)}H${f(x0)}Z" fill="none" stroke="${RB}" stroke-width=".7"/>` +
        (o.title !== false ? `<text x="0" y="${f(y0 - 1.9)}" ${GEORGIA} font-weight="700" font-size="${f(h * 0.15)}" letter-spacing="${f(h * 0.04)}" fill="${P.white}" text-anchor="middle">BINGO</text>` : '') +
        `<path d="${starPath(x0 + 3, (yh + y0) / 2 - 0.3, h * 0.07, h * 0.03, 5)}" fill="${P.goldL}"/><path d="${starPath(x1 - 3, (yh + y0) / 2 - 0.3, h * 0.07, h * 0.03, 5)}" fill="${P.goldL}"/>`,
    }], 0.6)
  )
}

/** Posición de un casillero del cartón (para marcarlo). */
const cell = (w: number, h: number, r: number, c: number) => {
  const x0 = -w / 2 + 2.2, x1 = w / 2 - 2.2, y0 = -h / 2 + 2.2 + h * 0.2, y1 = h / 2 - 2.2
  return { x: x0 + (c + 0.5) * ((x1 - x0) / 9), y: y0 + (r + 0.5) * ((y1 - y0) / 3) }
}

const CARD_A = [[3, 0, 24, 0, 41, 0, 62, 0, 85], [0, 17, 0, 35, 48, 0, 0, 71, 88], [9, 0, 26, 0, 0, 53, 67, 79, 0]]
const CARD_B = [[0, 12, 0, 33, 0, 56, 0, 74, 81], [7, 0, 29, 0, 44, 0, 65, 0, 86], [0, 19, 25, 0, 47, 0, 68, 77, 0]]

export const RUMMIKUB_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Atril vacío ────────────────────────────────────────────────────

  // Cinco manos ganadas: ¡bingo, señora! El cartón lleno, con un poroto en cada número.
  'Cartón lleno': (u) => {
    const k = kit(u)
    const w = 58, h = 40
    const marks = CARD_A.flatMap((row, r) => row.map((n, c) => (n ? { r, c } : null)).filter((x): x is { r: number; c: number } => !!x))
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(61, 84, 30, 3) +
      `<g transform="translate(60 59) rotate(-6)">` +
      k.cast([roundRect(-w / 2, -h / 2, w / 2, h / 2, 1.6)], 2, 2.2) +
      bingoCard(k, w, h, CARD_A) +
      marks.map(({ r, c }, i) => { const p = cell(w, h, r, c); return bean(p.x + 0.9, p.y + 1.2, (i * 47) % 180 - 90, 1.05) }).join('') +
      `</g>` +
      bean(38, 88, 20, 1.3) + bean(45, 91, -40, 1.3) + bean(80.6, 89, 70, 1.2) +
      sparkle(31, 36, 2.2) + sparkle(94, 56, 1.6) +
      k.defs()
    )
  },

  // Veinte manos: fibrón en mano y diez cartones a la vez. El abanico de cartones, los anteojos con la cadenita y
  // el fibrón que marca.
  'Abuela del bingo': (u) => {
    const k = kit(u)
    const w = 46, h = 30
    const fan = [-26, -13, 0, 13]
    const front = 13
    const circles = [[0, 1], [1, 4], [2, 6], [0, 8], [1, 2]].map(([r, c]) => { const p = cell(w, h, r, c); return `<circle cx="${f(p.x)}" cy="${f(p.y - 0.4)}" r="2.3" fill="none" stroke="${NUM.r}" stroke-width=".75"/>` }).join('')
    // El fibrón: cuerpo blanco con la banda roja, el capuchón calzado atrás y la punta de fieltro.
    const body = roundRect(-3, -13, 3, 12, 1.4)
    const capd = roundRect(-3.5, 6, 3.5, 17, 1.8)
    const cone = 'M-3 -13L-1.8 -16.6H1.8L3 -13Z'
    const felt = 'M-1.4 -16.6L-.8 -19.4H.8L1.4 -16.6Z'
    // Los anteojos de la abuela: dos lentes redondos con armazón dorado y la cadenita de perlas.
    const lens = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="5.2" fill="#fff" opacity=".35"/>` + k.shade(ellipse(x, y, 5.2, 5.2), k.lin(P.sky, 0, 0, 1, 1, 0, 0.7), P.sky, 0.3) +
      `<circle cx="${x}" cy="${y}" r="5.2" fill="none" stroke="${P.ink}" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="5.2" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      `<path d="M${f(x - 3.4)} ${f(y - 1.6)}A3.8 3.8 0 0 1 ${f(x - 1.2)} ${f(y - 3.6)}" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>`
    const chain = Array.from({ length: 17 }, (_, i) => {
      const t = i / 16, a = 1 - t, x = a * a * 34.4 + 2 * a * t * 40 + t * t * 62.2, y = a * a * 55 + 2 * a * t * 80 + t * t * 48.4
      return `<circle cx="${f(x)}" cy="${f(y)}" r="${i % 2 ? 0.55 : 0.8}" fill="${i % 2 ? P.goldL : P.white}" stroke="${P.ink}" stroke-width=".3"/>`
    }).join('')
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(60, 90, 30, 3) +
      `<g transform="translate(64.4 61.4) scale(.82) translate(-60 -60)">` +
      fan.map((a, i) =>
        `<g transform="translate(60 98) rotate(${a}) translate(0 -36)">` + k.cast([roundRect(-w / 2, -h / 2, w / 2, h / 2, 1.6)], 1.4, 1.6) +
        bingoCard(k, w, h, i % 2 ? CARD_B : CARD_A, { title: a === front, numbers: a === front }) + (a === front ? circles : '') + `</g>`).join('') +
      `</g>` +
      // Los anteojos, apoyados arriba del abanico, con las patillas plegadas.
      `<g transform="translate(46 44) rotate(-12) scale(1.2) translate(-40 -45)">` +
      `<path d="M29.4 44C27.6 46 27.2 50 28.6 52M51.6 43.4C53.4 45.6 53.8 49.6 52.4 51.4" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M29.4 44C27.6 46 27.2 50 28.6 52M51.6 43.4C53.4 45.6 53.8 49.6 52.4 51.4" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
      lens(35, 45.6) + lens(46, 45) + `<path d="M40 44.4Q40.5 42.6 41 44.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M40 44.4Q40.5 42.6 41 44.4" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      `</g>` + chain +
      `<g transform="translate(81 72) rotate(38)">` + k.cast([body], 1.8, 1.6) +
      k.draw([
        { d: felt, fill: NUM.r },
        { d: cone, fill: P.white, inner: k.sh(cone, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        { d: body, fill: P.white, inner: k.sh(body, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + `<path d="M-4 -5H4V1H-4Z" fill="${NUM.r}"/><path d="M-4 -1H4" stroke="${P.white}" stroke-width=".5"/>` + `<path d="M-1.8 -11V10" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` },
        { d: capd, fill: NUM.r, inner: k.sh(capd, 0, 0, 1, 0, 0, 0.9, P.wine, 0.45) + `<path d="M-1.8 8V16" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` },
      ], 0.6) +
      `<path d="M3.5 7.6H5V15.4H3.5" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      sparkle(88, 36, 2.2) + sparkle(30, 70, 1.6) +
      k.defs()
    )
  },

  // Sesenta manos: el rey del bingo. El bolillero de oro coronado y el micrófono del locutor que te saluda.
  'Rey del bingo': (u) => {
    const k = kit(u)
    const cx = 60, cy = 50, R = 16.4
    const ballC = [NUM.r, NUM.b, NUM.o, NUM.k, NUM.b, NUM.r, NUM.o]
    const balls = [[52, 59, -12], [58.4, 61.4, 6], [64.6, 60, 20], [55.4, 55.2, 0], [61.8, 54.6, -8], [69, 55, 14], [50.6, 53, 30]]
      .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3" fill="${ballC[i]}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${x}" cy="${y}" r="1.5" fill="${IVORY}"/><circle cx="${f(x - 1.2)}" cy="${f(y - 1.2)}" r=".6" fill="#fff" opacity=".8"/>`).join('')
    const lats = [-10.4, 0, 10.4].map((dy) => ({ dy, rx: Math.sqrt(R * R - dy * dy), ry: Math.sqrt(R * R - dy * dy) * 0.24 }))
    const back = lats.map(({ dy, rx, ry }) => `<path d="M${f(cx - rx)} ${f(cy + dy)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(cy + dy)}" fill="none" stroke="${P.goldD}" stroke-width=".7" opacity=".7"/>`).join('') +
      [0.35, 0.75].map((s) => `<path d="M${cx} ${cy - R}A${f(R * s)} ${R} 0 0 0 ${cx} ${cy + R}" fill="none" stroke="${P.goldD}" stroke-width=".7" opacity=".7"/>`).join('')
    const wire = (d: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="1.7"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".8"/>`
    const front = lats.map(({ dy, rx, ry }) => wire(`M${f(cx - rx)} ${f(cy + dy)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy + dy)}`)).join('') +
      [0.35, 0.75].map((s) => wire(`M${cx} ${cy - R}A${f(R * s)} ${R} 0 0 1 ${cx} ${cy + R}`)).join('') + wire(`M${cx} ${cy - R}V${cy + R}`)
    const crown = 'M-7 0L-8.2 -8.6L-3.6 -4.4L0 -10.4L3.6 -4.4L8.2 -8.6L7 0Z'
    const base = 'M30 84H90L92.6 90H27.4Z', baseTop = roundRect(33, 79.6, 87, 84.4, 1.4)
    // El micrófono del locutor: cápsula de rejilla cromada sobre su pie.
    const mic = roundRect(-5.4, -9, 5.4, 9, 5)
    const grille = Array.from({ length: 9 }, (_, i) => `<path d="M-5.4 ${f(-6.6 + i * 1.6)}H5.4" stroke="${P.blue}" stroke-width=".45"/>`).join('')
    return (
      k.day() +
      k.sun(60, 50, 16, 47, 32, false) +
      glow(k, 60, 52, 28, 28, 0.8) +
      `<g transform="translate(60 57) scale(.88) translate(-60 -56)">` +
      k.floor(60, 90, 32, 3) +
      // El pie: dos postes que sostienen el eje, sobre la base.
      rod('M41 50L37 81', P.gold, 2) + rod('M79 50L83 81', P.gold, 2) + `<path d="M40.6 52L37.4 79" stroke="${P.goldL}" stroke-width=".6"/>` +
      k.draw([
        { d: base, fill: P.brown, inner: k.sh(base, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) + hair(32, 87, 60, 86.4, 88, 87, 0.45, P.brownD) },
        { d: baseTop, fill: P.gold, inner: k.sh(baseTop, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M34 81.4H86" stroke="${P.goldL}" stroke-width=".6"/>` + Array.from({ length: 13 }, (_, i) => `<circle cx="${f(36 + i * 4)}" cy="82.8" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>`).join('') },
      ], 0.6) +
      // La jaula: atrás los alambres, adentro las bolillas, adelante los alambres de oro.
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${P.white}" opacity=".35"/>` + k.shade(ellipse(cx, cy, R, R), k.rad(P.sky2, 0.4, 0.35, 0.6, 0, 0.8), P.blue, 0.35) +
      back + balls +
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.ink}" stroke-width="2.4"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.gold}" stroke-width="1.3"/>` +
      `<path d="M${f(cx - R * 0.8)} ${f(cy - R * 0.45)}A${R} ${R} 0 0 1 ${f(cx - R * 0.3)} ${f(cy - R * 0.92)}" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      front +
      rod(`M40 ${cy}H44.4M75.6 ${cy}H80`, P.gold, 1.8) +
      [41, 79].map((x) => `<circle cx="${x}" cy="${cy}" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${x}" cy="${cy}" r=".8" fill="${P.goldD}"/>`).join('') +
      // La manija.
      rod('M79 50L87.4 57.4', P.gold, 1.4) + k.draw([{ d: roundRect(85.4, 56.6, 89.4, 63.4, 1.8), fill: P.red, inner: k.sh(roundRect(85.4, 56.6, 89.4, 63.4, 1.8), 0, 0, 1, 0, 0, 0.9, P.wine, 0.4) }], 0.5) +
      // La corona arriba de la jaula.
      `<g transform="translate(60 ${cy - R - 0.4})">` +
      k.draw([{ d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-8 -2.4H8V0H-8Z" fill="${P.goldD}" opacity=".5"/>` }], 0.5) +
      `<circle cx="-8.2" cy="-9.2" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><circle cx="0" cy="-11.1" r="1" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><circle cx="8.2" cy="-9.2" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="0" cy="-4.6" r="1.3" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      // El micrófono.
      rod('M30.4 70V83', P.sky1, 1.2) + k.draw([{ d: 'M25.6 83.4H35.2L36 85.6H24.8Z', fill: P.mid }], 0.4) +
      `<path d="M26 66C26 70.6 34.8 70.6 34.8 66" fill="none" stroke="${P.ink}" stroke-width="1.8"/><path d="M26 66C26 70.6 34.8 70.6 34.8 66" fill="none" stroke="${P.sky1}" stroke-width=".8"/>` +
      `<g transform="translate(30.4 60) rotate(14)">` +
      k.draw([{ d: mic, fill: P.sky1, inner: grille + k.sh(mic, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) + `<path d="M-6 -1H6V1H-6Z" fill="${P.gold}"/><path d="M-3.2 -6.6V5.6" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".85"/>` }], 0.6) +
      `</g>` +
      hair(37, 52, 40, 48, 38.6, 43.4, 0.5, P.mid) + hair(35, 54.6, 39.4, 54, 42, 51, 0.4, P.mid, 0.7) +
      `</g>` +
      sparkle(60, 15.6, 3, '#fff') + sparkle(89, 36, 2) + sparkle(30, 38, 1.6) +
      k.defs()
    )
  },

  // ── De una ─────────────────────────────────────────────────────────

  // Bajaste todo de una vez: el atril pelado, que brilla, y adelante las fichas sobre la mesa.
  'Atril pelado': (u) => {
    const k = kit(u)
    const set: [string, string][] = [['7', NUM.r], ['7', NUM.b], ['7', NUM.k], ['7', NUM.o]]
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(62, 63.6, 30, 2.6) +
      rack(k, 33.4, 62.6, 46) +
      // Las marcas de las fichas que ya no están.
      Array.from({ length: 5 }, (_, i) => { const x = 41.4 + i * 8.6; return `<path d="${roundRect(f(x), 42.6, f(x + 6.2), 48.8, 0.9)}" fill="${RB_L}" opacity=".35"/><path d="${roundRect(f(x), 42.6, f(x + 6.2), 48.8, 0.9)}" fill="none" stroke="${RB_L}" stroke-width=".4" stroke-dasharray=".9 .7"/>` }).join('') +
      sparkle(74, 47.4, 3.4, '#fff') + sparkle(46.6, 55.6, 1.8, '#fff') + sparkle(84.6, 40, 1.4, '#fff') +
      k.floor(60, 87, 30, 2.4) +
      set.map(([n, c], i) => `<g transform="translate(${f(39.9 + i * 13.4)} 78) rotate(${[-4, 2, -2, 4][i]}) scale(.86)">` + k.cast([TILE], 1.4, 1.2) + tile(k, n, c) + `</g>`).join('') +
      sparkle(90, 34, 2) + sparkle(30, 36, 1.5) +
      k.defs()
    )
  },

  // Tres rummikubs: malabares con las fichas en el rojo del semáforo.
  'Malabarista de semáforo': (u) => {
    const k = kit(u)
    const housing = roundRect(27.6, 37.4, 41.6, 75, 3)
    const light = (y: number, c: string, on: boolean) =>
      (on ? k.shade(ellipse(34.6, y, 13, 13), k.rad(NOSE, 0.5, 0.5, 0.5, 0.75, 0), NOSE, 0.35) : '') +
      `<circle cx="34.6" cy="${y}" r="4.2" fill="${c}" stroke="${P.ink}" stroke-width=".6"/>` +
      (on ? `<circle cx="34.6" cy="${y}" r="2.6" fill="#FF8C70"/><circle cx="33.4" cy="${f(y - 1.2)}" r="1.1" fill="#fff" opacity=".9"/>` : `<path d="M31.8 ${f(y - 1)}A3 3 0 0 1 34 ${f(y - 3)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".4"/>`)
    const visor = (y: number) => `<path d="M29.6 ${f(y - 2.4)}C30 ${f(y - 6.2)} 39.2 ${f(y - 6.2)} 39.6 ${f(y - 2.4)}L41 ${f(y - 4.2)}C40 ${f(y - 8)} 29.2 ${f(y - 8)} 28.2 ${f(y - 4.2)}Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>`
    const flying: [number, number, number, string, string][] = [[54, 64, -34, '1', NUM.o], [60.6, 38.6, -14, '2', NUM.o], [77.6, 34.6, 16, '3', NUM.o], [86.4, 58, 38, '4', NUM.o]]
    const street = 'M0 86H120V130H0Z'
    const zebra = Array.from({ length: 10 }, (_, i) => { const x = 16 + i * 9.6, d = (x - 60) * 0.12; return `<path d="M${f(x)} 89.4H${f(x + 4.4)}L${f(x + 4.4 + d)} 97H${f(x + d)}Z" fill="${P.white}" opacity=".75"/>` }).join('')
    return (
      k.day() +
      `<path d="${street}" fill="${P.sky2}"/>` + k.sh(street, 0, 0, 0, 1, 0, 0.7, P.mid, 0.4) + zebra + `<path d="M0 86H120" stroke="${P.blue}" stroke-width=".6"/>` +
      // La trayectoria de los malabares.
      `<path d="M52 72C48 42 62 24 72 28C82 32 90 46 88 70" fill="none" stroke="${P.mid}" stroke-width=".6" stroke-dasharray="1.4 1.4"/>` +
      `<path d="M58 76C60 56 70 46 76 50" fill="none" stroke="${P.mid}" stroke-width=".5" stroke-dasharray="1.2 1.4" opacity=".7"/>` +
      // El semáforo en rojo.
      `<path d="M33.6 75V104H36V75Z" fill="${P.mid}" stroke="${P.ink}" stroke-width=".7"/><path d="M34.2 76V102" stroke="${P.sky}" stroke-width=".5"/>` +
      k.draw([{ d: housing, fill: P.mid, inner: k.sh(housing, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + `<path d="M26 36H31V76H26Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` }], 0.75) +
      `<path d="${roundRect(29, 38.8, 40.2, 73.6, 2.2)}" fill="none" stroke="${P.sky}" stroke-width=".4" opacity=".7"/>` +
      light(46, NOSE, true) + light(56, '#6E5A34', false) + light(66, '#3C5B3F', false) + visor(46) + visor(56) + visor(66) +
      flying.map(([x, y, r, n, c]) => `<g transform="translate(${x} ${y}) rotate(${r})">` + k.cast([TILE], 1.4, 1.4, P.mid) + tile(k, n, c) + `</g>`).join('') +
      hair(48, 70, 47, 66, 49, 62, 0.5, P.mid) + hair(56, 32, 58.6, 30.4, 61.6, 30.6, 0.5, P.mid) + hair(84, 30, 86.6, 32, 88, 35, 0.5, P.mid) + hair(92, 52, 93.4, 56, 92.6, 60, 0.5, P.mid) +
      sparkle(68, 18.6, 2) + sparkle(94, 42, 1.6) +
      k.defs()
    )
  },

  // Ocho rummikubs: Houdini. El candado de oro abierto, las cadenas que se sueltan y la ficha que se esfuma.
  'Houdini': (u) => {
    const k = kit(u)
    const body = roundRect(44.4, 57, 75.6, 87, 4.6)
    const esc = 'M60 63.4C63.4 63.4 65.4 65.6 65.4 68.6C65.4 71 64.2 72.4 63 73.2L64.4 80.4H55.6L57 73.2C55.8 72.4 54.6 71 54.6 68.6C54.6 65.6 56.6 63.4 60 63.4Z'
    const key = 'M60 66.4C61.2 66.4 62 67.2 62 68.4C62 69.2 61.6 69.8 61 70.2L61.8 76.4H58.2L59 70.2C58.4 69.8 58 69.2 58 68.4C58 67.2 58.8 66.4 60 66.4Z'
    const curl = (x: number, y: number, sx: number, sy: number) =>
      `<path d="M0 0C0 -2.8 2.8 -3.6 4 -1.8C5 -.4 3.8 1.2 2.6 .6" fill="none" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round" transform="translate(${x} ${y}) scale(${sx} ${sy})"/>`
    // Una cadena: eslabones alternados (de frente, un óvalo; de canto, una barra) a lo largo de una curva.
    const chain = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, n: number) => Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n, a = 1 - t
      const x = a * a * x0 + 2 * a * t * cx + t * t * x1, y = a * a * y0 + 2 * a * t * cy + t * t * y1
      const dx = 2 * a * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * a * (cy - y0) + 2 * t * (y1 - cy), ang = (Math.atan2(dy, dx) * 180) / Math.PI
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">` + (i % 2
        ? `<path d="M-2.6 0H2.6" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M-2.6 0H2.6" stroke="${P.sky1}" stroke-width="1.1" stroke-linecap="round"/>`
        : `<path d="${ellipse(0, 0, 3.2, 1.9)}" fill="none" stroke="${P.ink}" stroke-width="2.2"/><path d="${ellipse(0, 0, 3.2, 1.9)}" fill="none" stroke="${P.sky1}" stroke-width="1"/><path d="M-2 -1.2Q0 -2 2 -1.2" fill="none" stroke="#fff" stroke-width=".4"/>`) + `</g>`
    }).join('')
    const smoke = (x: number, y: number, r: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.sky1}" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.sky}" stroke-width=".4" opacity=".6"/>`
    return (
      k.night() +
      k.sun(60, 56, 16, 48, 32, false) +
      glow(k, 60, 58, 24, 28, 0.6) +
      laurel(49, 99, 28, 90, 25, 62, 8) + laurel(71, 99, 92, 90, 95, 62, 8, true) +
      // La ficha que se esfuma arriba a la derecha, entre humo y chispas.
      smoke(80, 40, 5) + smoke(86, 36, 3.4) + smoke(75, 34, 2.8) + smoke(84.6, 45.6, 2.4) +
      `<g transform="translate(80.4 40) rotate(16) scale(.74)" opacity=".6">` + tile(k, '13', NUM.b) + `</g>` +
      sparkle(73, 31, 2.2, P.goldL) + sparkle(89, 44, 1.8, P.goldL) + sparkle(86, 30.6, 1.3, '#fff') + sparkle(72, 45, 1.2, '#fff') +
      // Las cadenas que caen sueltas.
      chain(51, 40, 34, 44, 30, 70, 9) + chain(69, 47, 80, 58, 86, 78, 7) +
      // El arco, abierto.
      rod('M51.2 57.4V42.6A8.8 8.8 0 0 1 68.8 42.6V50', P.sky1, 3.6) + `<path d="M50.2 55V42.6A9.8 9.8 0 0 1 56 33.8" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M67.2 50.4H70.4" stroke="${P.ink}" stroke-width="1" stroke-linecap="round"/>` +
      k.floor(60, 89, 18, 2.4, '#000') +
      k.draw([{
        d: body, fill: P.gold,
        inner: k.sh(body, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M42 55H52V90H42Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` +
          `<path d="${roundRect(46.6, 59.2, 73.4, 84.8, 3)}" fill="none" stroke="${P.goldD}" stroke-width=".55"/>` +
          `<path d="${roundRect(46.6, 59.2, 73.4, 84.8, 3)}" fill="none" stroke="${P.goldL}" stroke-width=".4" transform="translate(-.5 -.5)" opacity=".8"/>` +
          curl(49.4, 63.4, 1, 1) + curl(70.6, 63.4, -1, 1) + curl(49.4, 81, 1, -1) + curl(70.6, 81, -1, -1) +
          hair(48.8, 70, 49.6, 75, 48.8, 80, 0.45, P.goldD) + hair(71.2, 70, 70.4, 75, 71.2, 80, 0.45, P.goldD) +
          `<path d="M44 59H76V61H44Z" fill="#fff" opacity=".35"/>`,
      }], 0.85) +
      `<rect x="44.4" y="57" width="31.2" height="2.8" rx="1.4" fill="${P.goldD}" opacity=".5"/>` +
      k.draw([{ d: esc, fill: P.goldL, inner: k.sh(esc, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.4) +
      `<path d="${key}" fill="${P.night}"/>` +
      [[47.6, 60.4], [72.4, 60.4], [47.6, 83.6], [72.4, 83.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<path d="M47 63C48 60.6 50 59.6 52.4 59.4" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      sparkle(60, 15.6, 3, '#fff') + sparkle(30, 40, 1.8, P.goldL) +
      k.defs()
    )
  },

  // ── Payaso ─────────────────────────────────────────────────────────

  // Te quedaste con el comodín: treinta puntos de tristeza. El comodín de −30 con la nariz de payaso colgada de una
  // punta y su nubecita de lluvia propia.
  'Payaso triste': (u) => {
    const k = kit(u)
    const S = 2.15, x = 56.4, y = 63.6
    const mark =
      `<text x="0" y="5" ${GEORGIA} font-weight="700" font-size="15" letter-spacing="-.4" fill="${NUM.r}" text-anchor="middle">−30</text>` +
      `<circle cx="0" cy="11.6" r="1.9" fill="none" stroke="${NUM.r}" stroke-width=".9"/>` +
      `<path d="M-9 -12.6H9" stroke="${IVORY_D}" stroke-width=".5" stroke-dasharray=".01 1.2" stroke-linecap="round"/>`
    const cloud = 'M37.4 39.6C35 39.6 33.6 37.6 34.6 35.6C33.8 32.6 37 30.6 39.4 32C40 28.6 44.6 27.4 46.8 30C48.6 28 52.6 28.6 53.2 31.6C56 31.4 57.4 34.4 55.6 36.4C56.4 38.6 54.8 39.8 52.8 39.6Z'
    const drop = (dx: number, dy: number) => `<path d="M${dx} ${dy}C${f(dx + 0.7)} ${f(dy + 1.4)} ${f(dx + 1)} ${f(dy + 2.1)} ${f(dx + 1)} ${f(dy + 2.6)}C${f(dx + 1)} ${f(dy + 3.3)} ${f(dx + 0.5)} ${f(dy + 3.7)} ${dx} ${f(dy + 3.7)}C${f(dx - 0.5)} ${f(dy + 3.7)} ${f(dx - 1)} ${f(dy + 3.3)} ${f(dx - 1)} ${f(dy + 2.6)}C${f(dx - 1)} ${f(dy + 2.1)} ${f(dx - 0.7)} ${f(dy + 1.4)} ${dx} ${dy}Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/>`
    const tw = TW * S, th = TH * S
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(58, 86.6, 22, 3) +
      `<g transform="translate(${x} ${y}) rotate(-4)">` + k.cast([roundRect(-tw, -th, tw, th, 3.8)], 2, 2) + tile(k, '', NUM.r, { s: S, w: 0.7, mark }) + `</g>` +
      // La nariz de payaso colgada de la punta de la ficha, con su elástico que cuelga por el costado.
      `<path d="M66 43.6C64.6 52 66.6 62 71.4 63.4C76.4 64.8 78.6 54 75.2 44.6" fill="none" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M66 43.6C64.6 52 66.6 62 71.4 63.4C76.4 64.8 78.6 54 75.2 44.6" fill="none" stroke="${P.night}" stroke-width=".55" stroke-linecap="round"/>` +
      nose(k, 70.2, 41.8, 6) +
      // La nube propia, que le llueve encima.
      k.draw([{ d: cloud, fill: P.sky2, inner: k.sh(cloud, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) + `<path d="M36 33.6C37 31.6 39.4 31 41 32.2M46 30.4C47.6 29.4 49.6 29.6 50.6 30.8" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".85"/>` }], 0.6) +
      drop(39.6, 41.2) + drop(45.6, 42.6) + drop(51.4, 41) + drop(42.6, 47.6) + drop(48.8, 48.6) +
      hair(28, 60, 26.6, 66, 28.6, 72, 0.5, P.blue) + hair(88, 76, 90, 70, 89, 64, 0.5, P.blue) +
      sparkle(90, 44, 1.6) +
      k.defs()
    )
  },

  // Cinco comodines atragantados: cascabeles y nada para festejar. El gorro de bufón, caído, sobre la pila de
  // comodines.
  'Bufón de corte': (u) => {
    const k = kit(u)
    const slab = (y: number, dx: number) => {
      const d = `M${f(44 + dx)} ${y}H${f(76 + dx)}V${f(y + 2.6)}C${f(76 + dx)} ${f(y + 3.2)} ${f(75.4 + dx)} ${f(y + 3.4)} ${f(74.8 + dx)} ${f(y + 3.4)}H${f(45.2 + dx)}C${f(44.6 + dx)} ${f(y + 3.4)} ${f(44 + dx)} ${f(y + 3.2)} ${f(44 + dx)} ${f(y + 2.6)}Z`
      return { d, fill: IVORY_E, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, IVORY_D, 0.45) + `<path d="M${f(44 + dx)} ${f(y + 0.5)}H${f(76 + dx)}" stroke="#fff" stroke-width=".5"/>` }
    }
    const top = 'M46 74.6H78L76 78H44Z'
    const lobeL = taper(50, 69, 38, 42, 30.4, 66, 11, 2.2)
    const lobeM = taper(60, 67, 58, 28, 76.4, 46.4, 12, 2.2)
    const lobeR = taper(70, 69, 84, 44, 89.6, 66, 11, 2.2)
    const brim = 'M43.6 67.4C50 64.4 70 64.4 76.4 67.4L77.2 73.6C70 71 50 71 42.8 73.6Z'
    const diamonds = Array.from({ length: 7 }, (_, i) => { const x = 46.4 + i * 4.5, y = 69.4 - Math.sin((i / 6) * Math.PI) * 1.4; return `<path d="M${f(x)} ${f(y - 2)}L${f(x + 1.6)} ${f(y)}L${f(x)} ${f(y + 2)}L${f(x - 1.6)} ${f(y)}Z" fill="${i % 2 ? NUM.r : RB}" stroke="${P.ink}" stroke-width=".3"/>` }).join('')
    const lobe = (d: string, c: string, dk: string, seam: string) => ({ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, dk, 0.5) + seam })
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(61, 90.4, 22, 3) +
      k.draw([slab(86.8, 0.6), slab(83.4, -0.8), slab(80, 0.8), slab(76.6, -0.4)], 0.55) +
      k.draw([{ d: top, fill: IVORY, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, IVORY_D, 0.35) }], 0.5) +
      k.draw([
        lobe(lobeM, NUM.r, P.wine, hair(60, 64, 59.6, 40, 72, 47, 0.5, P.wine) + `<path d="M57.4 64C56.6 50 57 38 63 34" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray="1 .9"/>` + hair(64, 62, 64.6, 52, 68, 44, 0.4, P.wine) + `<path d="M54 30H62V60H54Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>`),
      ], 0.75) +
      k.draw([
        lobe(lobeL, RB, RB_D, hair(49, 66, 41, 46, 32, 63, 0.5, RB_D) + `<path d="M46.6 66C44 56 40.6 49 36 49.6" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray="1 .9"/>` + hair(52, 64, 46, 52, 40, 52, 0.4, RB_D) + `<path d="M36 40H48V56H36Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.35, 0)}"/>`),
        lobe(lobeR, RB, RB_D, hair(71, 66, 80.6, 46, 88, 63, 0.5, RB_D) + `<path d="M73.4 66C76 56 79.4 49 84 49.6" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray="1 .9"/>` + hair(68, 64, 74, 52, 80, 52, 0.4, RB_D)),
      ], 0.75) +
      k.draw([{ d: brim, fill: P.gold, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M43 68.4C50 65.6 70 65.6 77 68.4" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` }], 0.6) +
      diamonds +
      bell(k, 30.4, 68.6, 2.8) + bell(k, 76.6, 49.2, 2.8) + bell(k, 89.6, 68.6, 2.8) +
      // El cascabel que se soltó y rodó.
      bell(k, 81, 88.2, 1.9) + hair(77, 90.2, 74, 90.6, 70.6, 90.2, 0.4, P.blue) +
      sparkle(34, 36, 1.8) + sparkle(88, 34, 1.4) +
      k.defs()
    )
  },

  // Quince comodines: ya armaste tu propia carpa. El circo de rayas azules, con su bandera y la entrada encendida.
  'Circo Rodas': (u) => {
    const k = kit(u)
    const apex = { x: 60, y: 31.6 }
    const eave = (t: number) => { const a = 1 - t; return { x: a * a * 30 + 2 * a * t * 60 + t * t * 90, y: a * a * 57 + 2 * a * t * 66 + t * t * 57 } }
    const ground = (t: number) => { const a = 1 - t; return { x: a * a * 32 + 2 * a * t * 60 + t * t * 88, y: a * a * 87 + 2 * a * t * 97 + t * t * 87 } }
    const N = 10
    let roofS = '', roofW = ''
    for (let i = 0; i < N; i++) {
      const p0 = eave(i / N), p1 = eave((i + 1) / N)
      const d = `M${apex.x} ${apex.y}L${f(p0.x)} ${f(p0.y)}L${f(p1.x)} ${f(p1.y)}Z`
      if (i % 2) roofW += d
      else roofS += d
    }
    const wallsOut = `M30 57Q60 66 90 57L88 87Q60 97 32 87Z`
    const M = 9
    let wallS = ''
    for (let j = 0; j < M; j++) {
      if (j % 2) continue
      const a0 = -1 + (j / M) * 2, a1 = -1 + ((j + 1) / M) * 2
      const s0 = (Math.sin((a0 * Math.PI) / 2) + 1) / 2, s1 = (Math.sin((a1 * Math.PI) / 2) + 1) / 2
      const e0 = eave(s0), e1 = eave(s1), g0 = ground(s0), g1 = ground(s1)
      wallS += `M${f(e0.x)} ${f(e0.y)}L${f(e1.x)} ${f(e1.y)}L${f(g1.x)} ${f(g1.y)}L${f(g0.x)} ${f(g0.y)}Z`
    }
    const door = 'M53.4 95.6V76C53.4 71.6 56.4 68.6 60 68.6C63.6 68.6 66.6 71.6 66.6 76V95.6Z'
    const flapL = 'M53.4 70.6C51 76 49.4 84 50.4 94.6L53.6 95.4C53 88 53.4 80 56.4 72Z'
    const flapR = 'M66.6 70.6C69 76 70.6 84 69.6 94.6L66.4 95.4C67 88 66.6 80 63.6 72Z'
    let scallops = ''
    const K = 12
    for (let i = 0; i < K; i++) {
      const p0 = eave(i / K), p1 = eave((i + 1) / K), mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2
      scallops += `<path d="M${f(p0.x)} ${f(p0.y)}Q${f(mx)} ${f(my + 5.4)} ${f(p1.x)} ${f(p1.y)}Z" fill="${i % 2 ? P.gold : P.goldL}" stroke="${P.ink}" stroke-width=".45"/>`
    }
    const tassels = Array.from({ length: K - 1 }, (_, i) => { const p = eave((i + 1) / K); return `<path d="M${f(p.x)} ${f(p.y)}V${f(p.y + 3)}" stroke="${P.goldD}" stroke-width=".5"/><circle cx="${f(p.x)}" cy="${f(p.y + 3.4)}" r=".7" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>` }).join('')
    const flag = 'M60.6 21.2C64 19.4 67 22.6 71.6 20.6L70.2 24.6L72.6 28C68 30 65 26.8 60.6 28.6Z'
    const beam = (a: number) => `M60 70L${f(60 + Math.cos(a - 0.09) * 90)} ${f(70 + Math.sin(a - 0.09) * 90)}L${f(60 + Math.cos(a + 0.09) * 90)} ${f(70 + Math.sin(a + 0.09) * 90)}Z`
    const beams = beam(-2.16) + beam(-0.98)
    // Los banderines: una guirnalda que cuelga del mástil, con triangulitos de colores.
    const bunting = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, n: number) =>
      `<path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}" fill="none" stroke="${P.goldL}" stroke-width=".45"/>` + Array.from({ length: n }, (_, i) => {
        const t = (i + 0.7) / (n + 0.4), a = 1 - t, x = a * a * x0 + 2 * a * t * cx + t * t * x1, y = a * a * y0 + 2 * a * t * cy + t * t * y1
        return `<path d="M${f(x - 1.3)} ${f(y)}H${f(x + 1.3)}L${f(x)} ${f(y + 3)}Z" fill="${[NOSE, P.gold, RB_L][i % 3]}" stroke="${P.ink}" stroke-width=".3"/>`
      }).join('')
    return (
      k.night() +
      `<path d="${beams}" fill="${k.lin(P.gold, 0, 1, 0, 0, 0.7, 0.1)}"/>` + k.shade(beams, k.lin(P.goldL, 0, 1, 0, 0, 0.8, 0), P.goldL, 0.3) +
      [[26, 46, 0.6], [94, 50, 0.5], [34, 28, 0.45], [86, 26, 0.55], [22, 66, 0.4], [98, 70, 0.45], [44, 20, 0.35], [76, 18, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      sparkle(30, 38, 1.8, P.paper) + sparkle(92, 40, 1.4, P.paper) +
      `<g transform="translate(60 64) scale(.9) translate(-60 -62)">` +
      k.floor(60, 93, 34, 3.6, '#000') +
      // Las paredes, a rayas, y la entrada encendida.
      k.draw([{
        d: wallsOut, fill: IVORY,
        inner: `<path d="${wallS}" fill="${RB}"/>` + k.sh(wallsOut, 0, 0, 1, 0, 0, 0.9, RB_D, 0.45) + k.sh('M28 56H92V68H28Z', 0, 0, 0, 1, 0.7, 0, P.night, 0.35) +
          hair(36, 66, 37, 76, 36, 86, 0.4, RB_D) + hair(84, 66, 83, 76, 84, 86, 0.4, RB_D),
      }], 0.75) +
      `<path d="${door}" fill="${P.goldL}"/>` + k.shade(door, k.rad(P.gold, 0.5, 0.3, 0.7, 0, 0.95), P.goldD, 0.35) +
      `<path d="M57.6 70L54 95.6H66L62.4 70Z" fill="#fff" opacity=".35"/>` +
      `<path d="M53.6 93.4Q60 88.6 66.4 93.4" fill="none" stroke="${P.ink}" stroke-width="2.2"/><path d="M53.6 93.4Q60 88.6 66.4 93.4" fill="none" stroke="${P.white}" stroke-width="1.2"/><path d="M53.6 93.4Q60 88.6 66.4 93.4" fill="none" stroke="${NOSE}" stroke-width="1.2" stroke-dasharray="1.6 1.6"/>` +
      `<path d="${door}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      k.draw([
        { d: flapL, fill: RB, inner: k.sh(flapL, 0, 0, 1, 0, 0, 0.8, RB_D, 0.4) + hair(52.6, 74, 51.6, 84, 52, 94, 0.45, IVORY) },
        { d: flapR, fill: RB, inner: k.sh(flapR, 0, 0, 1, 0, 0.3, 0.9, RB_D, 0.4) + hair(67.4, 74, 68.4, 84, 68, 94, 0.45, IVORY) },
      ], 0.5) +
      `<path d="M50.6 82.6L54.6 81.4M69.4 82.6L65.4 81.4" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
      // El techo, a gajos, con el remate y la bandera.
      k.draw([{
        d: `M${apex.x} ${apex.y}L30 57Q60 66 90 57Z`, fill: IVORY,
        inner: `<path d="${roofS}" fill="${RB}"/>` + k.sh('M58 28H94V68H58Z', 0, 0, 1, 0, 0, 0.85, RB_D, 0.45) + `<path d="M26 28H52V68H26Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          hair(56, 36, 50, 46, 42, 60, 0.45, RB_D) + hair(64, 36, 70, 46, 78, 60, 0.45, RB_D) + hair(60, 36, 59.6, 48, 60, 63, 0.4, RB_D, 0.7),
      }], 0.75) +
      scallops + tassels +
      bunting(60, 23.4, 40, 50, 25, 60, 9) + bunting(60, 23.4, 80, 50, 95, 60, 9) +
      rod('M60 31.8V21', P.gold, 1) +
      k.draw([{ d: flag, fill: NOSE, inner: k.sh(flag, 0, 0, 1, 1, 0, 0.85, NOSE_D, 0.45) + hair(62, 22, 66, 23.4, 70, 22.6, 0.4, NOSE_D) }], 0.45) +
      `<path d="${starPath(65.4, 24.6, 2, 0.8, 5)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>` +
      `<circle cx="60" cy="20.6" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      // Los vientos de la carpa, con sus estacas.
      `<path d="M30.4 58L22.6 84M89.6 58L97.4 84" stroke="${P.goldL}" stroke-width=".5" opacity=".8"/>` +
      `</g>` +
      k.defs()
    )
  },
}
