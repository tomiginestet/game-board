// La Podrida: Bien podrido, Cero absoluto y Pronóstico exacto, en clave heroica.
// Manda la ciruela de la ficha del juego (#7A4B94): el lila del fondo, el pantalón, la heladera, el esmalte de la
// balanza y del reloj, y el terciopelo de la tarotista. Lo podrido se cuenta con objetos de verdad (la banana con
// pintas, el queso azul, la heladera encadenada), y el monje zen con su cuenco vacío y el ensō, sin monje.
import { f } from '../helpers'
import { along, ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** La ciruela de la ficha (#7A4B94), con su sombra y su luz. */
const CIR = '#7A4B94', CIR_D = '#47275E', CIR_L = '#BC98D2'
/** El lila pálido del fondo y su grano. */
const LILA = '#E2D4EC', LILA_G = '#BFA4D3'
/** El verde del moho y del olor. */
const MOHO = '#8FA86A', MOHO_D = '#566C3A'
/** La banana y sus pintas. */
const BAN = '#F6D35C', BAN_D = '#D19C2C', PINTA = '#6B4424'
/** La pasta del queso y la cáscara. */
const PASTA = '#F7E7B8', CASCARA = '#D9BE84'
/** El esmalte de la heladera. */
const ESMALTE = '#ECE2F2'
/** El cartón del carnet. */
const HUESO_C = '#F3E8CF'

/** Fondo de la Podrida: el papel con el lila granulado hacia los bordes. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(LILA, 0.5, 0.46, 0.7, 0, 1), LILA_G, 0.55)

/** Escenario lila: un disco claro con el borde granulado. */
const escenario = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F7F1FA"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(LILA, 0.5, 0.5, 0.5, 0, 0.85), LILA_G, 0.45) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CIR}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional. */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Contorno de un cuerpo a lo largo de una curva cuadrática, con ancho w(t). */
function bodyAlong(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w: (t: number) => number, N = 26) {
  const pts = along(x0, y0, cx, cy, x1, y1, Array.from({ length: N + 1 }, (_, i) => i / N))
  const L: string[] = [], R: string[] = []
  pts.forEach((q, i) => {
    const len = Math.hypot(q.dx, q.dy) || 1, ww = w(i / N) / 2, nx = -q.dy / len, ny = q.dx / len
    L.push(`${f(q.x + nx * ww)} ${f(q.y + ny * ww)}`)
    R.push(`${f(q.x - nx * ww)} ${f(q.y - ny * ww)}`)
  })
  return `M${L.join('L')}L${R.reverse().join('L')}Z`
}

/** Línea paralela a una curva cuadrática, corrida o·w(t)/2 hacia abajo de la marcha (o negativo, hacia arriba). */
function offsetLine(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w: (t: number) => number, o: number, t0 = 0, t1 = 1, N = 20) {
  const ts = Array.from({ length: N + 1 }, (_, i) => t0 + ((t1 - t0) * i) / N)
  return 'M' + along(x0, y0, cx, cy, x1, y1, ts).map((q, i) => {
    const len = Math.hypot(q.dx, q.dy) || 1, ww = (w(ts[i]) / 2) * o
    return `${f(q.x - (q.dy / len) * ww)} ${f(q.y + (q.dx / len) * ww)}`
  }).join('L')
}

/** Generador de números pseudoaleatorios con semilla (para que las pintas y las vetas salgan siempre iguales). */
const rng = (seed: number) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)

/** Copa del naipe español (el palo), con el pie en (0,0) y la boca arriba. */
const COPA = 'M-4.6 -13C-4.6 -8.4 -2.6 -5.6 -.9 -4.8V-1.8C-2.4 -1.4 -3.6 -.8 -3.6 0H3.6C3.6 -.8 2.4 -1.4 .9 -1.8V-4.8C2.6 -5.6 4.6 -8.4 4.6 -13Z'
function copa(k: Kit, s = 1) {
  return `<g transform="scale(${s})">` +
    k.draw([{ d: COPA, fill: P.gold, inner: k.sh(COPA, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M-4.4 -11.4C-2 -10.4 2 -10.4 4.4 -11.4V-10C2 -9 -2 -9 -4.4 -10Z" fill="${P.red}"/>` + `<path d="M-1 -4.6H1V-3.6H-1Z" fill="${P.red}"/>` }], f(0.45 / s)) +
    `<ellipse cx="0" cy="-13" rx="4.6" ry="1" fill="${P.goldD}" stroke="${P.ink}" stroke-width="${f(0.35 / s)}"/>` + `<path d="M-3.2 -12C-3 -9 -2 -7 -1 -6" fill="none" stroke="#fff" stroke-width="${f(0.5 / s)}" opacity=".8"/>` +
    `</g>`
}

/** Naipe español del as de copas, con la base en (0,0): el marco con un corte, la copa grande y el 1 en las esquinas. */
function asDeCopas(k: Kit) {
  const d = roundRect(-9, -28, 9, 0, 1.4)
  return (
    k.draw([{ d, fill: P.white, inner: k.sh('M2 -30H10V2H2Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) }], 0.5) +
    `<path d="M-7.4 -26.4H7.4V-1.6H-7.4Z" fill="none" stroke="${P.red}" stroke-width=".5" stroke-dasharray="14 1.8 50"/>` +
    `<text x="-5.4" y="-21.6" ${GEORGIA} font-weight="700" font-size="3.6" fill="${P.red}" text-anchor="middle">1</text>` +
    `<g transform="translate(0 -5)">${copa(k, 1.05)}</g>`
  )
}

/** Telaraña: rayos desde (cx,cy) a los anclajes y la espiral que los cruza, en hilo claro. */
function telarana(cx: number, cy: number, anchors: number[][], rings: number[], c = '#FFFFFF') {
  let s = anchors.map(([x, y]) => `M${cx} ${cy}L${x} ${y}`).join('')
  for (const r of rings) {
    const pts = anchors.map(([x, y]) => [cx + (x - cx) * r, cy + (y - cy) * r])
    s += pts.map(([x, y], i) => {
      const [nx, ny] = pts[(i + 1) % pts.length], mx = (x + nx) / 2, my = (y + ny) / 2
      return `M${f(x)} ${f(y)}Q${f(mx + (cx - mx) * 0.18)} ${f(my + (cy - my) * 0.18)} ${f(nx)} ${f(ny)}`
    }).join('')
  }
  return `<path d="${s}" fill="none" stroke="${P.ink}" stroke-width=".9" opacity=".35"/><path d="${s}" fill="none" stroke="${c}" stroke-width=".4"/>`
}

export const PODRIDA_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Bien podrido ───────────────────────────────────────────────────

  // Tres ganadas: la banana empieza a madurar, con pintitas, la etiqueta del palo de copas y una mosquita que ya ronda.
  'Banana manchada': (u) => {
    const k = kit(u)
    const B = [26, 60, 52, 92, 88, 44] as const
    const w = (t: number) => 3 + 14.6 * Math.pow(Math.sin(Math.PI * Math.min(t * 1.06, 1)), 0.62) * (1 - t * 0.18)
    const body = bodyAlong(...B, w)
    const r = rng(17)
    const spots = Array.from({ length: 46 }, () => {
      const t = 0.08 + r() * 0.84, o = -0.85 + r() * 1.7, q = along(...B, [t])[0], len = Math.hypot(q.dx, q.dy), ww = (w(t) / 2) * o
      const x = q.x - (q.dy / len) * ww, y = q.y + (q.dx / len) * ww, rr = 0.3 + r() * r() * 1.4
      return (rr > 0.9 ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr * 1.8)}" fill="${BAN_D}" opacity=".45"/>` : '') + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="${PINTA}"/>`
    }).join('')
    const end = along(...B, [1])[0], el = Math.hypot(end.dx, end.dy), ux = end.dx / el, uy = end.dy / el
    const stem = `M${f(end.x - uy * 2.2)} ${f(end.y + ux * 2.2)}L${f(end.x + ux * 7.4 - uy * 1.6)} ${f(end.y + uy * 7.4 + ux * 1.6)}L${f(end.x + ux * 7.4 + uy * 1.6)} ${f(end.y + uy * 7.4 - ux * 1.6)}L${f(end.x + uy * 2.2)} ${f(end.y - ux * 2.2)}Z`
    const cut = ellipse(end.x + ux * 7.4, end.y + uy * 7.4, 1.2, 1.7)
    const lab = along(...B, [0.56])[0], la = (Math.atan2(lab.dy, lab.dx) * 180) / Math.PI
    const fly = (x: number, y: number) =>
      `<g transform="translate(${x} ${y}) rotate(-20)"><ellipse cx="-1.6" cy="-1.8" rx="2.6" ry="1.3" fill="#fff" opacity=".85" stroke="${P.ink}" stroke-width=".3" transform="rotate(-30 -1.6 -1.8)"/><ellipse cx="1.4" cy="-1.9" rx="2.6" ry="1.3" fill="#fff" opacity=".85" stroke="${P.ink}" stroke-width=".3" transform="rotate(30 1.4 -1.9)"/>` +
      `<ellipse cx="0" cy="0" rx="1.2" ry="2" fill="${P.ink}"/><circle cx="0" cy="-2" r=".9" fill="${P.wine}"/><path d="M-1 .6L-2.4 2M1 .6L2.4 2M-1 -.4L-2.6 0M1 -.4L2.6 0" stroke="${P.ink}" stroke-width=".3"/></g>`
    return (
      fondo(k) +
      escenario(k, 60, 60, 34) +
      k.floor(58, 86, 26, 3.4, CIR) +
      k.cast([body], 2.6, 2.6, CIR) +
      k.draw([
        { d: stem, fill: '#A69552', inner: k.sh(stem, 0, 0, 0, 1, 0, 0.9, MOHO_D, 0.4) + `<path d="${stem}" fill="none" stroke="${MOHO_D}" stroke-width=".3"/>` },
        {
          d: body, fill: BAN,
          inner:
            k.sh(body, 0, 0, 0, 1, 0, 0.8, BAN_D, 0.45) + spots +
            `<path d="${offsetLine(...B, w, -0.15, 0.06, 0.96)}" fill="none" stroke="${BAN_D}" stroke-width=".5"/>` +
            `<path d="${offsetLine(...B, w, 0.42, 0.08, 0.94)}" fill="none" stroke="${BAN_D}" stroke-width=".45"/>` +
            `<path d="${offsetLine(...B, w, -0.62, 0.14, 0.86)}" fill="none" stroke="#FFF6D6" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>` +
            k.sh(body, 0, 0, 1, 0, 0.45, 0, PINTA, 0.2),
        },
      ], 0.8) +
      `<path d="${cut}" fill="${PINTA}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<ellipse cx="${f(along(...B, [0])[0].x - 0.4)}" cy="${f(along(...B, [0])[0].y + 0.2)}" rx="1.8" ry="1.5" fill="${P.ink}"/>` +
      // La etiqueta ovalada, con el palo de copas.
      `<g transform="translate(${f(lab.x + 1)} ${f(lab.y - 1.8)}) rotate(${f(la)})">` +
      k.draw([{ d: ellipse(0, 0, 5.2, 3.8), fill: P.white, inner: `<path d="${ellipse(0, 0, 4.4, 3)}" fill="none" stroke="${P.red}" stroke-width=".5"/>` + k.sh(ellipse(0, 0, 5.2, 3.8), 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.4) +
      `<g transform="translate(0 2) scale(.32)">${copa(k)}</g>` +
      `</g>` +
      `<path d="M58 40C56 32 66 30 66 36C66 42 74 42 76 37" fill="none" stroke="${CIR}" stroke-width=".55" stroke-dasharray="1.2 1.2" stroke-linecap="round"/>` +
      fly(79, 35) +
      sparkle(32, 40, 2.2) + sparkle(90, 66, 1.6) +
      k.defs()
    )
  },

  // Doce ganadas: la cuña de queso azul, con las vetas de moho que la recorren y el olor que sube. A los entendidos
  // les encanta.
  'Queso azul': (u) => {
    const k = kit(u)
    const front = 'M34 82L80 82L80 47Z'
    const top = 'M34 82L80 47L86 39.2L40 74.2Z'
    const rind = 'M80 47L86 39.2C87.4 50 87.4 62 86 74.2L80 82Z'
    const r = rng(41)
    // Cada veta: una grieta fina con manchones de moho azul a los costados, más cargados cerca de la grieta.
    const AZUL = ['#4F6FA0', '#6F8DBA', '#3E5A8A', CIR_L]
    const vena = (x: number, y: number, a: number, n: number) => {
      let crack = `M${f(x)} ${f(y)}`, blots = '', px = x, py = y
      for (let j = 0; j < n; j++) {
        a += (r() - 0.5) * 1.2
        px += Math.cos(a) * 2.2; py += Math.sin(a) * 2.2
        crack += `L${f(px)} ${f(py)}`
        for (let m = 0; m < 2; m++) {
          const bx = px + (r() - 0.5) * 4, by = py + (r() - 0.5) * 4, br = 0.5 + r() * 1.3
          const pts = Array.from({ length: 6 }, (_, q) => { const aa = (q / 6) * Math.PI * 2, rr = br * (0.6 + r() * 0.6); return `${f(bx + Math.cos(aa) * rr)} ${f(by + Math.sin(aa) * rr)}` })
          blots += `<path d="M${pts.join('L')}Z" fill="${AZUL[Math.floor(r() * 4)]}" opacity="${f(0.7 + r() * 0.3)}"/>`
        }
      }
      return blots + `<path d="${crack}" fill="none" stroke="${P.ink}" stroke-width=".4" opacity=".6"/>`
    }
    const holes = [[60, 76, 2, 1.2], [71, 64, 1.5, 1], [74, 77.6, 1.3, 0.8], [50, 79.4, 1.2, 0.8]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${CASCARA}" stroke="${P.ink}" stroke-width=".35"/><path d="M${f(x - rx)} ${y}A${rx} ${ry} 0 0 1 ${f(x + rx)} ${y}" fill="${P.brownD}" opacity=".35"/>`).join('')
    const board = 'M36 87C36 84 46 82.4 60 82.4C74 82.4 84 84 84 87C84 90 74 92.4 60 92.4C46 92.4 36 90 36 87Z'
    const blade = 'M1 -2.2H4.6L3.4 2.2H1Z'
    const haft = 'M-1.4 -2.4H-12C-13.6 -2.4 -14.4 -1.4 -14.4 0C-14.4 1.4 -13.6 2.4 -12 2.4H-1.4Z'
    const smell = (x: number, y: number, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})">` + hair(0, 0, -4, -6, 0, -12, 1.3, MOHO_D, 0.9) + hair(0, -12, 4, -17, 0.6, -23, 1.1, MOHO_D, 0.8) + `</g>`
    return (
      fondo(k) +
      k.sun(60, 56, 18, 46, 28, false) +
      k.shade(ellipse(60, 58, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.draw([{ d: board, fill: P.brown, inner: k.sh(board, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + hair(42, 87, 54, 85.6, 66, 86.2, 0.45, P.brownD) + hair(50, 89.6, 62, 88.6, 76, 89, 0.4, P.brownD) + `<path d="M40 85.4C48 83.6 72 83.6 80 85.4" fill="none" stroke="#FFE3C2" stroke-width=".6" opacity=".6"/>` }], 0.6) +
      k.floor(62, 86, 26, 2.4, P.brownD) +
      smell(48, 58, 1) + smell(60, 50, 1.15) + smell(72, 42, 0.9) +
      `<g transform="translate(0 2.6)">` +
      k.cast([front, top, rind], 2, 1.6, CIR) +
      k.draw([
        {
          d: rind, fill: CASCARA,
          inner: k.sh(rind, 0, 0, 1, 0, 0, 0.9, P.brown, 0.45) + Array.from({ length: 14 }, () => `<circle cx="${f(80.6 + r() * 5.4)}" cy="${f(42 + r() * 38)}" r="${f(0.4 + r() * 0.7)}" fill="${r() > 0.5 ? '#fff' : CIR_L}" opacity=".85"/>`).join('') +
            hair(83, 46, 84.4, 60, 83.6, 74, 0.5, P.brown, 0.7) + hair(85, 44, 86.2, 56, 85.6, 70, 0.4, '#fff', 0.7),
        },
        {
          d: top, fill: PASTA,
          inner: `<path d="${top}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.7, 0)}"/>` + vena(44, 74, -0.66, 8) + vena(58, 63, -0.66, 8) + vena(72, 52, -0.66, 6) + k.sh(top, 0, 0, 1, 1, 0.3, 0, CIR_L, 0.25),
        },
        {
          d: front, fill: PASTA,
          inner: k.sh(front, 0, 0, 1, 1, 0, 0.55, CIR_L, 0.4) + vena(42, 80, -0.3, 10) + vena(56, 78, -1, 9) + vena(66, 70, -1.4, 9) + vena(72, 60, 1.7, 7) + vena(77, 52, 1.9, 6) + vena(60, 66, 0.4, 6) + vena(74, 76, -2.4, 6) + holes,
        },
      ], 0.75) +
      `<path d="M34 82L80 47" stroke="#fff" stroke-width=".8" opacity=".85"/><path d="M80 47V82" stroke="${CASCARA}" stroke-width=".6" opacity=".9"/>` +
      // El cuchillo de queso, clavado en la cuña: la hoja calada con la punta en horqueta y el cabo de madera.
      `<g transform="translate(56.4 63.6) rotate(38)">` +
      k.draw([
        { d: blade, fill: P.sky1, inner: k.sh(blade, 0, 0, 0, 1, 0, 0.85, P.blue, 0.45) + `<path d="M1 -1.2H4" stroke="#fff" stroke-width=".5"/>` },
        { d: haft, fill: P.brown, inner: k.sh(haft, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.45) + `<circle cx="-4" cy="0" r=".55" fill="${P.goldL}"/><circle cx="-9" cy="0" r=".55" fill="${P.goldL}"/>` + hair(-12, -1, -7, -1.6, -2, -1, 0.4, '#FFE3C2', 0.7) },
        { d: 'M-1.4 -3.2H1V3.2H-1.4Z', fill: P.goldD },
      ], 0.5) +
      `</g>` +
      `<path d="M58.6 64.4C59.6 66 61.4 66.4 62.6 65.4" fill="none" stroke="${P.brownD}" stroke-width=".5" opacity=".7"/>` +
      `</g>` +
      sparkle(86, 32, 2.2) + sparkle(32, 46, 1.6) + sparkle(30, 70, 1.2) +
      k.defs()
    )
  },

  // Cuarenta ganadas: la heladera vieja, encadenada y con candado. Nadie se anima a abrir la puerta para pararte.
  'Heladera abandonada': (u) => {
    const k = kit(u)
    const body = 'M41 36C41 30.4 44.4 27.4 50 27.4H70C75.6 27.4 79 30.4 79 36V86H41Z'
    const side = 'M79 36C79 31.4 77 28.4 73.6 27.6C78 27.6 82.6 30 83.6 34.4V83.4L79 86Z'
    const door = 'M43 37C43 32 46 30 50.6 30H69.4C74 30 77 32 77 37V78H43Z'
    const plinth = 'M41 78H79V86H41Z'
    const chain = (x0: number, y0: number, x1: number, y1: number, n: number) => {
      const a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI
      return Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t
        return i % 2
          ? `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M-2.2 0H2.2" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M-2.2 0H2.2" stroke="${P.sky1}" stroke-width="1" stroke-linecap="round"/></g>`
          : `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><ellipse rx="2.6" ry="1.5" fill="none" stroke="${P.ink}" stroke-width="1.5"/><ellipse rx="2.6" ry="1.5" fill="none" stroke="${P.sky1}" stroke-width=".6"/><path d="M-1.6 -1.1Q0 -1.7 1.6 -1.1" fill="none" stroke="#fff" stroke-width=".35"/></g>`
      }).join('')
    }
    const lockB = roundRect(-5, -2, 5, 6.6, 1.4)
    const handle = 'M72.4 46H75.6C76.4 46 76.8 46.6 76.8 47.4V60C76.8 60.8 76.4 61.4 75.6 61.4H72.4Z'
    const grille = Array.from({ length: 7 }, (_, i) => `<path d="M${46 + i * 4.6} 80.4V84" stroke="${CIR_D}" stroke-width="1.2" stroke-linecap="round"/>`).join('')
    const rust = [[45, 76, 1.6], [47.6, 74, 0.8], [76, 82, 1.4], [44, 84, 1.2], [70, 34, 0.7]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${P.brown}" opacity=".7"/><circle cx="${x}" cy="${y}" r="${f(rr * 0.5)}" fill="${P.brownD}" opacity=".8"/>`).join('')
    return (
      fondo(k) +
      k.sun(60, 56, 20, 48, 32, false) +
      k.shade(ellipse(60, 56, 30, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(48, 101, 27, 94, 23, 66, 8) + laurel(72, 101, 93, 94, 97, 66, 8, true) +
      `<g transform="translate(60 58) scale(.9) translate(-60 -58)">` +
      k.floor(62, 87.6, 24, 2.8, CIR_D) +
      `<path d="M44 86.4V89.4M76 86.4V89.4M81.6 84.2V87" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/>` +
      k.cast([body, side], 2, 1.6, CIR) +
      k.draw([
        { d: side, fill: CIR_L, inner: k.sh(side, 0, 0, 1, 0, 0.2, 0.9, CIR, 0.45) + hair(81.4, 40, 82, 60, 81.4, 80, 0.4, CIR_D) },
        { d: body, fill: ESMALTE, inner: k.sh(body, 0, 0, 1, 0, 0, 0.6, CIR_L, 0.4) },
        {
          d: door, fill: ESMALTE, line: 0.4,
          inner:
            `<path d="M43 30H54V78H43Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.9, 0)}"/>` + k.sh('M64 30H78V78H64Z', 0, 0, 1, 0, 0, 0.7, CIR_L, 0.45) +
            k.sh(door, 0, 0, 0, 1, 0, 0.35, CIR, 0.3) + rust +
            // La abolladura y los rayones de la puerta.
            hair(50, 64, 53, 66.4, 56, 65, 0.5, CIR, 0.8) + hair(51, 66, 54, 68, 57, 67.4, 0.4, '#fff', 0.9) + hair(62, 70, 66, 69, 69, 71, 0.35, CIR) +
            `<path d="M46.6 33.6C48.6 31.8 52 31.2 56 31.2" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".95"/>`,
        },
        { d: plinth, fill: CIR_L, line: 0.35, inner: k.sh(plinth, 0, 0, 1, 1, 0, 0.8, CIR, 0.4) + grille },
      ], 0.8) +
      // La placa cromada con la estrella, y la manija de palanca.
      `<rect x="54.6" y="33.4" width="10.8" height="4" rx="2" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(60, 35.4, 1.6, 0.7, 5)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/><path d="M55.6 34.4H58M62 34.4H64.4" stroke="#fff" stroke-width=".4"/>` +
      k.draw([{ d: handle, fill: P.sky1, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + `<path d="M73.4 47.4V60" stroke="#fff" stroke-width=".7"/>` }], 0.5) +
      // El olor que se escapa por el burlete.
      hair(42.6, 46, 36, 42, 38, 34, 1.3, MOHO_D, 0.9) + hair(42.4, 60, 35, 58, 33, 50, 1.2, MOHO_D, 0.85) + hair(78.6, 44, 85, 40, 83, 32, 1.2, MOHO_D, 0.9) + hair(50, 28.6, 48, 23, 52, 18.6, 1, MOHO_D, 0.85) + hair(70, 28.6, 73, 24, 70, 19, 0.9, MOHO_D, 0.8) +
      hair(38, 34, 41, 30, 39, 26, 0.8, MOHO, 0.8) + hair(83, 32, 80.6, 28, 83, 24, 0.7, MOHO, 0.8) +
      // Las cadenas en cruz y el candado.
      chain(36.4, 38, 84.4, 70.4, 15) + chain(84.4, 38, 36.4, 70.4, 15) +
      `<g transform="translate(60.4 54.6)">` +
      `<path d="M-3.2 -1.6V-4.4C-3.2 -7.4 3.2 -7.4 3.2 -4.4V-1.6" fill="none" stroke="${P.ink}" stroke-width="2.6"/><path d="M-3.2 -1.6V-4.4C-3.2 -7.4 3.2 -7.4 3.2 -4.4V-1.6" fill="none" stroke="${P.sky1}" stroke-width="1.2"/>` +
      k.draw([{ d: lockB, fill: P.gold, inner: k.sh(lockB, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-5 -.4H5" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.55) +
      `<circle cx="0" cy="1.8" r="1" fill="${P.ink}"/><path d="M-.45 2.2H.45L.7 4.2H-.7Z" fill="${P.ink}"/><path d="M-3.8 -.8V4.6" stroke="#fff" stroke-width=".6" opacity=".8"/>` +
      `</g>` +
      `</g>` +
      sparkle(86, 30, 2.4) + sparkle(33, 48, 1.8) + sparkle(30, 76, 1.2) +
      k.defs()
    )
  },

  // ── Cero absoluto ──────────────────────────────────────────────────

  // Tres ceros: los dos bolsillos del pantalón dados vuelta. Ni una pelusa: la última se va volando.
  'Bolsillo vacío': (u) => {
    const k = kit(u)
    const pants = 'M34 40H86C87.4 54 89 68 89.6 82L90.4 112H63.6L61.2 88C60.8 85.6 59.2 85.6 58.8 88L56.4 112H29.6L30.4 82C31 68 32.6 54 34 40Z'
    const band = 'M34 40H86L86.6 46.4H33.4Z'
    const liningL = 'M47 46.6C40 47.4 31 50 25.6 55.4C21.6 59.6 21 66 23.6 70.4C26.4 74.6 31.6 74 33.6 70C35 66.4 33.6 62 32.8 58.8C37.4 54.6 43 49.6 47 46.6Z'
    const liningR = 'M73 46.6C80 47.4 89 50 94.4 55.4C98.4 59.6 99 66 96.4 70.4C93.6 74.6 88.4 74 86.4 70C85 66.4 86.4 62 87.2 58.8C82.6 54.6 77 49.6 73 46.6Z'
    const ribs = Array.from({ length: 22 }, (_, i) => `<path d="M${f(31 + i * 2.7)} 46V112" stroke="${CIR_D}" stroke-width=".5" opacity=".55"/>`).join('')
    const stitch = (d: string) => `<path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".55" stroke-dasharray="1.1 .8"/>`
    const lining = (d: string, flip: number) => ({
      d, fill: P.white,
      inner: k.sh(d, 0, 0, flip > 0 ? 1 : 0, 1, 0, 0.75, P.sky2, 0.45) +
        `<g transform="${flip > 0 ? '' : 'translate(120 0) scale(-1 1)'}">` + hair(42, 49, 32, 54, 26, 64, 0.6, P.blue) + hair(38, 52.4, 31, 60, 29.6, 70, 0.55, P.blue) + hair(33, 52, 26, 56, 24, 62, 0.4, P.blue, 0.7) +
        `<path d="M23.6 68C25.6 72.4 30.6 73.4 33 70" fill="none" stroke="${P.blue}" stroke-width=".45" stroke-dasharray=".9 .7"/></g>`,
    })
    const loops = [40, 60, 80].map((x) => `<rect x="${x - 1.4}" y="38.4" width="2.8" height="8.6" rx=".6" fill="${CIR}" stroke="${P.ink}" stroke-width=".45"/><path d="M${x} 39.4V46" stroke="${P.gold}" stroke-width=".4" stroke-dasharray=".8 .6"/>`).join('')
    const lint = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, l = 2.6 + (i % 3) * 0.6; return hair(72 + Math.cos(a) * 1, 29 + Math.sin(a) * 1, 72 + Math.cos(a + 0.3) * l * 0.6, 29 + Math.sin(a + 0.3) * l * 0.6, 72 + Math.cos(a) * l, 29 + Math.sin(a) * l, 0.35, P.mid) }).join('')
    return (
      fondo(k) +
      escenario(k, 60, 58, 34) +
      `<g transform="translate(60 64) scale(.84) translate(-60 -64)">` +
      k.cast([pants], 2.4, 2, CIR) +
      k.draw([{
        d: pants, fill: CIR,
        inner:
          ribs + k.sh('M62 40C72 56 76 80 74 112H96V40Z', 0, 0, 1, 0, 0, 0.85, CIR_D, 0.5) + `<path d="M28 40H44V112H28Z" fill="${k.lin(CIR_L, 0, 0, 1, 0, 0.6, 0)}"/>` +
          // La bragueta, las costuras y los pliegues.
          stitch('M63.6 46.6V70C63.6 73 62 74.6 60 75.4') + `<path d="M60 46.6V86" stroke="${CIR_D}" stroke-width=".7"/>` +
          stitch('M33.2 50L32.6 82M86.8 50L87.4 82') + hair(50, 84, 52, 92, 51, 104, 0.6, CIR_D) + hair(70, 84, 68, 92, 69, 104, 0.6, CIR_D) +
          hair(54, 66, 56, 74, 58, 80, 0.5, CIR_D) + hair(66, 66, 64, 74, 62, 80, 0.5, CIR_D),
      }], 0.8) +
      k.draw([{ d: band, fill: CIR, inner: ribs + k.sh(band, 0, 0, 1, 0, 0, 0.8, CIR_D, 0.45) + stitch('M34 41.6H86M33.6 45.2H86.4') }], 0.5) +
      loops +
      // El botón de cobre y los remaches de los bolsillos.
      `<circle cx="60" cy="43.2" r="2.1" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".5"/><circle cx="60" cy="43.2" r="1.2" fill="none" stroke="${P.goldL}" stroke-width=".4"/><circle cx="59.4" cy="42.6" r=".4" fill="#fff"/>` +
      // Los forros de los bolsillos, dados vuelta.
      k.cast([liningL, liningR], 1.6, 1.4, CIR_D) +
      k.draw([lining(liningL, 1), lining(liningR, -1)], 0.6) +
      stitch('M47 46.6C43 49.6 37.4 54.6 32.8 58.8') + stitch('M73 46.6C77 49.6 82.6 54.6 87.2 58.8') +
      `<circle cx="33.4" cy="58.4" r="1.1" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".4"/><circle cx="86.6" cy="58.4" r="1.1" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      // La última pelusa, que se va volando.
      `<path d="M88 56C92 46 80 40 74.6 32.4" fill="none" stroke="${P.mid}" stroke-width=".55" stroke-dasharray="1.1 1.2" stroke-linecap="round"/>` +
      `<circle cx="72" cy="29" r="1.8" fill="${P.white}" stroke="${P.mid}" stroke-width=".45"/>` + lint +
      sparkle(40, 32, 2) + sparkle(28, 82, 1.4) +
      k.defs()
    )
  },

  // Quince ceros: la billetera de jubilado, abierta. Del lado de las tarjetas, el carnet; del de los billetes, la telaraña.
  'Billetera de jubilado': (u) => {
    const k = kit(u)
    const left = roundRect(27, 48, 59.6, 84, 2.4), right = roundRect(60.4, 48, 93, 84, 2.4)
    const fold = 'M58.6 47.4H61.4V84.6H58.6Z'
    const slot = (y: number) => `M30 ${y}C38 ${y - 1.6} 48 ${y - 1.6} 56.6 ${y}V81H30Z`
    const card = roundRect(31.6, 53, 54.6, 66, 1)
    const pocket = 'M63.4 52.6H90V80.4H63.4Z'
    const spider = (x: number, y: number) =>
      `<path d="M${x} ${y - 1.4}V${y - 10}" stroke="#fff" stroke-width=".3"/>` +
      `<g transform="translate(${x} ${y})" stroke="${P.ink}" stroke-width=".35" fill="none"><path d="M-.6 -.4L-2.8 -2.4L-3.4 -1M-.6 0L-3.2 -.6L-3.8 .8M-.6 .4L-3 1.4L-3.2 3M-.4 .8L-2 2.6L-1.8 4M.6 -.4L2.8 -2.4L3.4 -1M.6 0L3.2 -.6L3.8 .8M.6 .4L3 1.4L3.2 3M.4 .8L2 2.6L1.8 4"/></g>` +
      `<circle cx="${x}" cy="${y - 0.8}" r=".9" fill="${P.ink}"/><ellipse cx="${x}" cy="${f(y + 0.9)}" rx="1.3" ry="1.6" fill="${P.ink}"/><circle cx="${f(x - 0.4)}" cy="${f(y + 0.4)}" r=".35" fill="${P.mid}"/>`
    return (
      fondo(k) +
      k.sun(60, 60, 18, 46, 28, false) +
      k.shade(ellipse(60, 62, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(60, 87.4, 32, 3, CIR) +
      `<g transform="rotate(-4 60 66)">` +
      k.cast([left, right], 2.2, 2, CIR) +
      k.draw([
        { d: left, fill: P.brown, inner: k.sh(left, 0, 0, 1, 1, 0, 0.7, P.brownD, 0.4) + `<path d="${roundRect(28.4, 49.4, 58.2, 82.6, 1.8)}" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray="1 .8"/>` },
        { d: right, fill: P.brown, inner: k.sh(right, 0, 0, 1, 1, 0.1, 0.8, P.brownD, 0.45) + `<path d="${roundRect(61.8, 49.4, 91.6, 82.6, 1.8)}" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray="1 .8"/>` },
        { d: fold, fill: P.brownD },
      ], 0.75) +
      // El carnet, asomando de la ranura de arriba: sin foto, sólo el sello y los renglones.
      k.draw([{
        d: card, fill: HUESO_C, line: 0.3,
        inner: `<path d="M31.6 53H54.6V56.4H31.6Z" fill="${CIR}"/><text x="43.1" y="55.6" ${GEORGIA} font-size="2.2" letter-spacing=".25" fill="${P.white}" text-anchor="middle">JUBILADO</text>` +
          `<rect x="33.4" y="58" width="6.4" height="6.6" fill="${P.sky1}" stroke="${P.blue}" stroke-width=".35"/><circle cx="38.6" cy="63.4" r="2.2" fill="none" stroke="${P.red}" stroke-width=".4" opacity=".8"/>` +
          `<path d="M41.6 59H52.6M41.6 61H51M41.6 63H52" stroke="${P.blue}" stroke-width=".45"/>`,
      }], 0.4) +
      // Las ranuras escalonadas de las tarjetas, cosidas.
      k.draw([60.6, 66.4, 72.2].map((y) => ({
        d: slot(y), fill: P.brown,
        inner: k.sh(slot(y), 0, 0, 0, 1, 0, 0.6, P.brownD, 0.4) + `<path d="M30.6 ${f(y + 1.2)}C38 ${f(y - 0.4)} 48 ${f(y - 0.4)} 56 ${f(y + 1.2)}" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".9 .7"/>` +
          `<path d="M31 ${f(y + 0.4)}C38 ${f(y - 1)} 46 ${f(y - 1.1)} 52 ${f(y - 0.6)}" fill="none" stroke="#FFE3C2" stroke-width=".5" opacity=".6"/>`,
      })), 0.45) +
      // El bolsillo de los billetes, abierto y vacío, con el forro ciruela y la telaraña.
      `<path d="${pocket}" fill="${CIR_D}"/>` + k.sh(pocket, 0, 0, 0, 1, 0, 0.8, '#1C0B28', 0.5) +
      `<path d="M63.4 52.6H90" stroke="${P.ink}" stroke-width=".8"/>` +
      telarana(76.6, 64.6, [[63.4, 52.6], [76.6, 52.6], [90, 52.6], [90, 66], [90, 80.4], [76.6, 80.4], [63.4, 80.4], [63.4, 66]], [0.25, 0.45, 0.65, 0.85]) +
      `<path d="${pocket}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      spider(82.4, 73) +
      `</g>` +
      sparkle(34, 38, 2) + sparkle(88, 36, 1.6) +
      k.defs()
    )
  },

  // Cuarenta ceros: el monje zen se resuelve con su cuenco vacío, sobre la arena rastrillada, y el ensō, el cero del zen.
  'Monje zen': (u) => {
    const k = kit(u)
    const cx = 60, cy = 51, R = 25.4
    // El ensō: una pincelada que da casi toda la vuelta, cargada al empezar y que se seca y se abre en cerdas al final.
    const a0 = (196 * Math.PI) / 180, span = (322 * Math.PI) / 180, N = 72
    const wAt = (t: number) => (t < 0.08 ? 5.2 + t * 24 : 7.1 - 2.6 * Math.pow((t - 0.08) / 0.92, 1.2))
    const P_ = (a: number, rr: number) => `${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`
    const L: string[] = [], Rr: string[] = []
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = a0 + span * t, w = wAt(t) / 2, rr = R + Math.sin(t * 7) * 0.6 - t * 1.4
      L.push(P_(a, rr + w))
      Rr.push(P_(a, rr - w))
    }
    const enso = `M${L.join('L')}L${Rr.reverse().join('L')}Z`
    // Las vetas secas del pincel: hilos de papel que corren dentro del trazo en la segunda mitad.
    const dry = [-1.6, -0.4, 0.9, 2].map((off, j) => {
      const pts = Array.from({ length: 16 }, (_, i) => { const t = 0.68 + j * 0.05 + (i / 15) * (0.3 - j * 0.05), a = a0 + span * t; return P_(a, R + Math.sin(t * 7) * 0.6 - t * 1.4 + off * wAt(t) * 0.22) })
      return `<path d="M${pts.join('L')}" fill="none" stroke="#F3ECF6" stroke-width="${0.35 + (j % 2) * 0.2}" stroke-linecap="round"/>`
    }).join('')
    const bristles = [-2.4, -1.2, 0, 1.2, 2.2].map((off, j) => {
      const tS = 0.9, tE = 1.01 + (j % 3) * 0.015, rr = (t: number) => R + Math.sin(t * 7) * 0.6 - t * 1.4 + off * 0.5
      const aS = a0 + span * tS, aE = a0 + span * tE, aM = (aS + aE) / 2
      return hair(cx + Math.cos(aS) * rr(tS), cy + Math.sin(aS) * rr(tS), cx + Math.cos(aM) * rr(0.96), cy + Math.sin(aM) * rr(0.96), cx + Math.cos(aE) * rr(tE), cy + Math.sin(aE) * rr(tE), 0.5, P.ink, 0.9)
    }).join('')
    // Las marcas de las cerdas a lo largo de todo el trazo.
    const streaks = [-0.34, -0.12, 0.1, 0.3].map((o, j) => {
      const pts = Array.from({ length: 30 }, (_, i) => { const t = 0.04 + j * 0.03 + (i / 29) * (0.8 - j * 0.05), a = a0 + span * t; return P_(a, R + Math.sin(t * 7) * 0.6 - t * 1.4 + o * wAt(t)) })
      return `<path d="M${pts.join('L')}" fill="none" stroke="${P.mid}" stroke-width=".35" stroke-linecap="round" opacity=".7"/>`
    }).join('')
    const splat = [[0.4, 7.4, 0.9], [-0.3, 8.6, 0.6], [0.8, 9.6, 0.45]].map(([da, dr, rr]) => `<circle cx="${f(cx + Math.cos(a0 + da * 0.1) * (R + dr))}" cy="${f(cy + Math.sin(a0 + da * 0.1) * (R + dr))}" r="${rr}" fill="${P.ink}"/>`).join('')
    const bowl = 'M40 76C40 86 49 91.4 60 91.4C71 91.4 80 86 80 76Z'
    const rim = ellipse(60, 76, 20, 4.4)
    const mouth = ellipse(60, 76.2, 17.6, 3.2)
    const sand = 'M-2 70H122V130H-2Z'
    const ripples = [26, 33, 40, 47].map((rx) => `<path d="${ellipse(60, 84, rx, rx * 0.2)}" fill="none" stroke="${CIR_L}" stroke-width=".7"/><path d="${ellipse(60, 84.5, rx, rx * 0.2)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/>`).join('')
    const waves = Array.from({ length: 5 }, (_, i) => {
      const x = 45 + i * 7.5, y = 84 + (i % 2) * 1.2
      return `<path d="M${x - 3} ${y}A3 3 0 0 1 ${x + 3} ${y}M${x - 2} ${y}A2 2 0 0 1 ${x + 2} ${y}M${x - 1} ${y}A1 1 0 0 1 ${x + 1} ${y}" fill="none" stroke="${P.gold}" stroke-width=".4"/>`
    }).join('')
    return (
      fondo(k) +
      k.sun(cx, cy, 16, 46, 32, false) +
      k.shade(ellipse(cx, cy, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.draw([{ d: sand, fill: '#EFE6F3', inner: k.sh(sand, 0, 0, 0, 1, 0, 0.7, LILA_G, 0.4) + Array.from({ length: 6 }, (_, i) => `<path d="M-2 ${72 + i * 3.2}H122" stroke="${CIR_L}" stroke-width=".55"/>`).join('') }], 0.4) +
      `<path d="${ellipse(60, 84, 50, 11)}" fill="#EFE6F3"/>` + ripples +
      // El ensō, entintado: la tinta y las cerdas secas.
      `<path d="${enso}" fill="${CIR}" transform="translate(.8 .9)" opacity=".3"/><path d="${enso}" fill="${P.ink}"/>` + streaks + dry + bristles + splat +
      k.floor(60, 90.4, 22, 2.6, CIR_D) +
      k.draw([
        {
          d: bowl, fill: P.night,
          inner: k.sh(bowl, 0, 0, 1, 1, 0, 0.9, '#070C22', 0.5) + `<path d="M40 74H52V92H40Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.9, 0)}"/>` + waves +
            `<path d="M43.4 80C45 85 49 88.4 54 89.6" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".6"/>`,
        },
        { d: rim, fill: P.gold, inner: `<path d="${mouth}" fill="${P.wine}"/>` + k.sh(mouth, 0, 0, 0, 1, 0.9, 0.2, '#1A0610', 0.5) + `<path d="M44 75C50 73.6 58 73.4 64 73.6" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` },
      ], 0.75) +
      `<path d="M47 75.6C52 77.6 68 77.6 73 75.6" fill="none" stroke="#fff" stroke-width=".4" opacity=".35"/>` +
      sparkle(88, 32, 2.2, '#fff') + sparkle(32, 40, 1.6) +
      k.defs()
    )
  },

  // ── Pronóstico exacto ──────────────────────────────────────────────

  // Seis manos cumplidas: la balanza de almacén, con las bazas en un plato y las pesas en el otro, en el fiel exacto.
  'Balanza de almacén': (u) => {
    const k = kit(u)
    const front = 'M29 72C29 70.6 30 70 31.4 70H88.6C90 70 91 70.6 91 72V84.6C91 86.2 90 87 88.6 87H31.4C30 87 29 86.2 29 84.6Z'
    const deck = 'M33 65.4H87L90.4 70.2H29.6Z'
    const tower = 'M54.4 65.6V55.4C54.4 51.6 56.8 49.6 60 49.6C63.2 49.6 65.6 51.6 65.6 55.4V65.6Z'
    const dial = ellipse(60, 56, 4, 4)
    const plate = (x: number) => ellipse(x, 58.4, 14, 3.4)
    const weight = (x: number, y: number, w: number, h: number) => {
      const d = `M${x - w / 2} ${y}V${y - h}A${w / 2} ${f(w * 0.2)} 0 0 1 ${x + w / 2} ${y - h}V${y}A${w / 2} ${f(w * 0.2)} 0 0 1 ${x - w / 2} ${y}Z`
      return k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M${x - w / 2 + 1} ${y - h + 1}V${y - 1}" stroke="#fff" stroke-width=".6" opacity=".8"/>` }], 0.45) +
        `<ellipse cx="${x}" cy="${f(y - h)}" rx="${w / 2}" ry="${f(w * 0.2)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="M${x - 1} ${f(y - h)}V${f(y - h - 2.2)}A1 1 0 0 1 ${x + 1} ${f(y - h - 2.2)}V${f(y - h)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    }
    // Las bazas: naipes españoles apilados de canto, con el dorso ciruela.
    const stack = Array.from({ length: 5 }, (_, i) => {
      const y = 57.6 - i * 1.6, x = 41 + (i % 2 ? 0.8 : -0.6), d = `M${x - 9} ${y}L${x - 6} ${y - 3}H${x + 9}L${x + 6} ${y}Z`
      return `<path d="${d}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/><path d="M${x - 9} ${y}H${x + 6}V${y + 0.9}H${x - 9}Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>`
    }).join('')
    const topCard = 'M31.6 50.4L35 46.4H51L47.6 50.4Z'
    return (
      fondo(k) +
      escenario(k, 60, 60, 34) +
      k.floor(60, 88.6, 32, 2.6, CIR_D) +
      `<path d="M33 87V90M87 87V90" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/>` +
      k.draw([
        { d: deck, fill: CIR_L, inner: k.sh(deck, 0, 0, 0, 1, 0, 0.6, CIR, 0.4) },
        {
          d: front, fill: CIR,
          inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, CIR_D, 0.45) + `<path d="M29 70H44V88H29Z" fill="${k.lin(CIR_L, 0, 0, 1, 0, 0.6, 0)}"/>` +
            // El filete dorado y la cartela de la balanza.
            `<path d="${roundRect(31.4, 72.2, 88.6, 84.8, 1.4)}" fill="none" stroke="${P.gold}" stroke-width=".6"/>` +
            `<path d="M44 78.4C40 76 36.6 76.6 36 78.6C35.4 80.6 38 81.4 39.4 80M76 78.4C80 76 83.4 76.6 84 78.6C84.6 80.6 82 81.4 80.6 80" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
            `<path d="${roundRect(46, 74.6, 74, 82.4, 3.8)}" fill="${P.white}" stroke="${P.gold}" stroke-width=".7"/>` +
            `<text x="60" y="80.4" ${GEORGIA} font-style="italic" font-size="4.4" fill="${CIR_D}" text-anchor="middle">al gramo</text>`,
        },
        { d: tower, fill: CIR, inner: k.sh(tower, 0, 0, 1, 0, 0, 0.9, CIR_D, 0.45) + `<path d="M55.6 64H64.4" stroke="${P.gold}" stroke-width=".5"/>` },
      ], 0.75) +
      `<path d="M42 65.6V60.4M78 65.6V60.4" stroke="${P.ink}" stroke-width="2.6"/><path d="M42 65.6V60.4M78 65.6V60.4" stroke="${P.goldD}" stroke-width="1.2"/>` +
      // El fiel: dos agujas que se tocan justo en el medio.
      k.draw([{ d: dial, fill: P.white, inner: Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (1.2 + i * 0.1); return `<path d="M${f(60 + Math.cos(a) * 3.2)} ${f(56 + Math.sin(a) * 3.2)}L${f(60 + Math.cos(a) * 2.4)} ${f(56 + Math.sin(a) * 2.4)}" stroke="${P.ink}" stroke-width=".3"/>` }).join('') }], 0.45) +
      `<path d="M60 58.6V52.6" stroke="${P.red}" stroke-width=".7" stroke-linecap="round"/><circle cx="60" cy="58" r=".7" fill="${P.ink}"/>` +
      k.draw([{ d: plate(42), fill: P.gold, inner: k.sh(plate(42), 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="${ellipse(42, 58.2, 11.6, 2.4)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` }, { d: plate(78), fill: P.gold, inner: k.sh(plate(78), 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="${ellipse(78, 58.2, 11.6, 2.4)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.6) +
      stack +
      k.draw([{ d: topCard, fill: CIR_D, inner: `<path d="M35.6 47.2H50.2L47.4 49.6H33.4Z" fill="none" stroke="${P.gold}" stroke-width=".4"/>` + Array.from({ length: 5 }, (_, i) => `<circle cx="${37.6 + i * 2.6}" cy="48.4" r=".45" fill="${P.goldL}"/>`).join('') }], 0.45) +
      weight(74.6, 58.4, 7, 7.4) + weight(83.4, 58.2, 5, 4.4) +
      sparkle(88, 40, 2.2) + sparkle(32, 40, 1.6) +
      k.defs()
    )
  },

  // Diez manos cumplidas: el reloj de estación, de dos caras, colgado de su ménsula de hierro. Puntual como el tren
  // que nunca llega.
  'Reloj de estación': (u) => {
    const k = kit(u)
    const cx = 62, cy = 65, R = 20.4
    const drum = `M${cx} ${f(cy - R)}H${cx + 4.2}A${R} ${R} 0 0 1 ${cx + 4.2} ${f(cy + R)}H${cx}Z`
    const bezel = ellipse(cx, cy, R, R), face = ellipse(cx, cy, R - 3.2, R - 3.2)
    const roman = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
    const nums = roman.map((n, i) => {
      const a = ((i * 30 - 90) * Math.PI) / 180, rr = R - 7.6
      return `<text x="${f(cx + Math.cos(a) * rr)}" y="${f(cy + Math.sin(a) * rr + 1.1)}" ${GEORGIA} font-size="${n.length > 2 ? 2.4 : 3}" fill="${P.ink}" text-anchor="middle" transform="rotate(${i * 30} ${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)})">${n}</text>`
    }).join('')
    const ticks = Array.from({ length: 60 }, (_, i) => {
      const a = (i / 60) * Math.PI * 2, r1 = R - 4.2, r2 = i % 5 ? R - 5 : R - 5.8
      return `<path d="M${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}L${f(cx + Math.cos(a) * r2)} ${f(cy + Math.sin(a) * r2)}" stroke="${P.ink}" stroke-width="${i % 5 ? 0.25 : 0.55}"/>`
    }).join('')
    const hand = (len: number, ang: number, w: number) =>
      `<g transform="translate(${cx} ${cy}) rotate(${ang})"><path d="M-${w} 2.4L0 ${-len}L${w} 2.4Z" fill="${P.ink}"/><path d="${ellipse(0, -len * 0.62, w * 1.4, w * 2)}" fill="none" stroke="${P.ink}" stroke-width=".55"/></g>`
    const arm = 'M14 37.4H58.6'
    const scroll = 'M32 37.6C32 45 38 49 44 47C48.6 45.4 48.4 40 45 39.4C42.4 39 41.4 42.4 43.4 43.6'
    const scroll2 = 'M48 37.6C48 42 52 44 55 42.6C57 41.6 56.6 39 54.8 38.8'
    return (
      fondo(k) +
      k.sun(cx, cy, 22, 47, 28, false) +
      k.shade(ellipse(cx, cy, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      // La ménsula de hierro forjado, con sus volutas y el colgante.
      rod(scroll, P.night, 1.2) + rod(scroll2, P.night, 1) + rod(arm, P.night, 2.4) + `<path d="M28 36.4H57.6" stroke="${P.mid}" stroke-width=".5"/>` +
      `<path d="M58.6 35.4L61.6 37.4L58.6 39.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      rod(`M${cx} 37.6V${f(cy - R - 1.6)}`, P.night, 1.6) + `<circle cx="${cx}" cy="${f(cy - R - 2)}" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.cast([bezel, drum], 2.4, 2.2, CIR) +
      k.draw([
        { d: drum, fill: CIR_D, inner: k.sh(drum, 0, 0, 1, 0, 0, 0.9, '#1C0B28', 0.45) + `<path d="M${cx + 2} ${f(cy - R + 2)}V${f(cy + R - 2)}" stroke="${P.gold}" stroke-width=".5"/>` },
        { d: bezel, fill: CIR, inner: k.sh(bezel, 0, 0, 1, 1, 0, 0.85, CIR_D, 0.45) + `<path d="${bezel}" fill="${k.lin(CIR_L, 0, 0, 1, 1, 0.7, 0)}"/>` },
      ], 0.8) +
      `<path d="${ellipse(cx, cy, R - 1.6, R - 1.6)}" fill="none" stroke="${P.gold}" stroke-width="1.4"/><path d="${ellipse(cx, cy, R - 1.6, R - 1.6)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      `<path d="${face}" fill="${P.white}" stroke="${P.ink}" stroke-width=".6"/>` + k.clip(face, k.sh(face, 0, 0, 1, 1, 0.1, 0.5, P.sky2, 0.4)) +
      ticks + nums +
      `<text x="${cx}" y="${f(cy + 7.6)}" ${GEORGIA} font-style="italic" font-size="2.4" fill="${CIR}" text-anchor="middle">Estación</text>` +
      hand(R - 10, -60, 1) + hand(R - 6.2, 60, 0.7) + `<path d="M${cx} ${cy}L${f(cx + Math.sin(Math.PI) * 13)} ${f(cy + 13)}" stroke="${P.red}" stroke-width=".4"/>` +
      `<circle cx="${cx}" cy="${cy}" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      // El vidrio: un brillo largo arriba a la izquierda.
      `<path d="M${cx - 13} ${cy - 5}C${cx - 11} ${cy - 11} ${cx - 6} ${cy - 14} ${cx - 1} ${cy - 15}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".75"/>` +
      `<path d="M${cx - 2} ${f(cy + R)}L${cx} ${f(cy + R + 3.6)}L${cx + 2} ${f(cy + R)}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      sparkle(90, 40, 2.2) + sparkle(32, 70, 1.6) +
      k.defs()
    )
  },

  // Catorce manos cumplidas: la bola de cristal sobre su pie dorado y el terciopelo de la tarotista; adentro, entre la
  // niebla, ya se ve el as de copas que te va a tocar.
  'Bola de cristal': (u) => {
    const k = kit(u)
    const cx = 60, cy = 50.4, R = 21
    const ball = ellipse(cx, cy, R, R)
    const cloth = 'M-2 78C20 74 40 73 60 73C80 73 100 74 122 78V130H-2Z'
    const stand = 'M47.6 70.4C50 68.6 54.6 68 60 68C65.4 68 70 68.6 72.4 70.4L74.6 76.6C75.4 79 72 80.6 60 80.6C48 80.6 44.6 79 45.4 76.6Z'
    const collar = 'M49 69C52 66.4 56 65.6 60 65.6C64 65.6 68 66.4 71 69C68 70.4 64 71 60 71C56 71 52 70.4 49 69Z'
    const claw = (x: number, sx: number) => `<g transform="translate(${x} 72) scale(${sx} 1)"><path d="M0 0C-3.6 -.6 -6 -3.4 -5 -6.4C-4.4 -8.2 -2 -8.4 -1.2 -6.8" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M0 0C-3.6 -.6 -6 -3.4 -5 -6.4C-4.4 -8.2 -2 -8.4 -1.2 -6.8" fill="none" stroke="${P.gold}" stroke-width="1" stroke-linecap="round"/><circle cx="-1.2" cy="-6.8" r=".6" fill="${P.goldL}"/></g>`
    const fringe = Array.from({ length: 21 }, (_, i) => {
      const x = 2 + i * 5.8, y = 96 + Math.sin(i * 0.9) * 0.6
      return `<path d="M${x} ${y}V${y + 3.4}" stroke="${P.gold}" stroke-width=".8"/>`
    }).join('')
    const mist = hair(cx - 14, cy + 6, cx - 4, cy + 1, cx + 6, cy + 8, 1.1, '#fff', 0.7) + hair(cx - 8, cy + 12, cx + 2, cy + 8, cx + 14, cy + 12, 0.9, '#fff', 0.6) + hair(cx - 12, cy - 4, cx - 6, cy - 8, cx + 2, cy - 6, 0.7, '#fff', 0.5)
    return (
      fondo(k) +
      k.sun(cx, cy, 22, 50, 32, false) +
      // El terciopelo, con sus pliegues y el fleco dorado.
      k.draw([{
        d: cloth, fill: CIR,
        inner: k.sh(cloth, 0, 0, 0, 1, 0, 0.9, CIR_D, 0.5) + hair(30, 80, 28, 88, 30, 98, 0.8, CIR_D) + hair(90, 80, 92, 88, 90, 98, 0.8, CIR_D) + hair(46, 82, 44, 90, 46, 98, 0.6, CIR_D) + hair(74, 82, 76, 90, 74, 98, 0.6, CIR_D) +
          hair(38, 80, 36, 88, 38, 96, 0.6, CIR_L, 0.7) + hair(82, 80, 84, 88, 82, 96, 0.6, CIR_L, 0.7) + `<path d="M-2 95C30 97 90 97 122 95V98C90 100 30 100 -2 98Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`,
      }], 0.6) +
      fringe +
      k.floor(cx, 80.4, 18, 2.4, '#1C0B28') +
      // El pie dorado: la base con las garras y el cuello que abraza la bola.
      k.draw([{ d: stand, fill: P.gold, inner: k.sh(stand, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M46.4 76.4C50 78 70 78 73.6 76.4" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${50 + i * 3.4} 70.4L${f(49 + i * 3.6)} 78" stroke="${P.goldD}" stroke-width=".4"/>`).join('') }], 0.65) +
      claw(48.6, 1) + claw(71.4, -1) +
      k.shade(ellipse(cx, cy, R + 7, R + 7), k.rad(CIR_L, 0.5, 0.5, 0.5, 0.75, 0), CIR_L, 0.4) +
      k.draw([{
        d: ball, fill: '#E6DDF3',
        inner:
          k.shade(ball, k.rad(CIR, 0.42, 0.38, 0.62, 0, 0.75), CIR, 0.35) + `<path d="${ellipse(cx, cy + 16, 16, 5)}" fill="${CIR}" opacity=".25"/>` +
          `<path d="${ball}" fill="${k.rad('#ffffff', 0.4, 0.36, 0.5, 0.9, 0)}"/>` + mist +
          `<g transform="translate(${cx + 1} ${cy + 13}) rotate(8) scale(.9)">${asDeCopas(k)}</g>` +
          hair(cx - 16, cy + 8, cx - 6, cy + 4, cx + 6, cy + 9, 1.2, '#fff', 0.55) + hair(cx - 4, cy + 17, cx + 6, cy + 13, cx + 16, cy + 15, 1, '#fff', 0.5),
      }], 0.8) +
      `<path d="M${cx - 15} ${cy - 6}C${cx - 13} ${cy - 13} ${cx - 7} ${cy - 17} ${cx - 1} ${cy - 18}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>` +
      `<path d="M${cx + 12} ${cy + 14}C${cx + 15} ${cy + 11} ${cx + 17} ${cy + 7} ${cx + 18} ${cy + 3}" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>` +
      k.draw([{ d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M51 68.6C56 70 64 70 69 68.6" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` }], 0.55) +
      [52.4, 56.2, 60, 63.8, 67.6].map((x) => `<circle cx="${x}" cy="${f(69.4 + Math.abs(x - 60) * -0.06)}" r=".6" fill="${P.red}" stroke="${P.ink}" stroke-width=".2"/>`).join('') +
      sparkle(cx + 9, cy - 11, 1.8, '#fff') + sparkle(30, 44, 2.2, P.goldL) + sparkle(90, 48, 1.8, P.goldL) +
      k.defs()
    )
  },
}
