// Beer pong: el vaso rojo de plástico con sus anillos marcados y el blanco de adentro, la pelotita de ping pong y la
// mesa de la previa con los diez vasos en triángulo. El cirujano aparece por su pinza; la fiesta, por la guirnalda.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, type Kit } from '../kit'
import { BEER, FOAM, glow, rotulo, stars, WOOD, WOOD_D, WOOD_G, WOOD_L } from './_bar-piezas'

// ── Piezas del beer pong ─────────────────────────────────────────────

/** Vaso rojo con la boca (elipse de radio r) en (x,y) y alto h: el labio enrollado, los anillos, el blanco de adentro
 * y la cerveza. */
function cup(k: Kit, x: number, y: number, r: number, h: number, o: { beer?: boolean; w?: number; gold?: boolean } = {}) {
  const ry = r * 0.3, b = r * 0.7, by = y + h
  const body = `M${f(x - r)} ${y}L${f(x - b)} ${f(by)}A${f(b)} ${f(b * 0.3)} 0 0 0 ${f(x + b)} ${f(by)}L${f(x + r)} ${y}Z`
  const ring = (t: number) => {
    const yy = y + h * t, rr = r + (b - r) * t
    return `M${f(x - rr)} ${f(yy)}A${f(rr)} ${f(rr * 0.3)} 0 0 0 ${f(x + rr)} ${f(yy)}`
  }
  const mouth = ellipse(x, y, r, ry), inner = ellipse(x, f(y + ry * 0.12), f(r * 0.9), f(ry * 0.8))
  const liquid = ellipse(x, f(y + ry * 0.5), f(r * 0.78), f(ry * 0.58))
  const red = o.gold ? P.gold : P.red, dark = o.gold ? P.goldD : P.wine
  return (
    k.draw([
      {
        d: body, fill: red,
        inner: k.sh(body, 0, 0, 1, 0, 0, 0.85, dark, 0.5) + `<path d="M${f(x - r)} ${y}H${f(x - r * 0.45)}V${f(by + 2)}H${f(x - r)}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
          `<path d="${ring(0.18)}${ring(0.56)}${ring(0.74)}" fill="none" stroke="${dark}" stroke-width="${f(Math.max(0.35, r * 0.05))}"/>` +
          `<path d="${ring(0.2)}" fill="none" stroke="#fff" stroke-width="${f(Math.max(0.25, r * 0.03))}" opacity=".5" transform="translate(0 .4)"/>` +
          hair(x - r * 0.74, y + h * 0.26, x - r * 0.78, y + h * 0.5, x - b * 0.86, y + h * 0.88, Math.max(0.5, r * 0.12), '#fff', 0.7),
      },
      { d: mouth, fill: o.gold ? P.goldL : P.white, inner: k.sh(mouth, 0, 0, 0, 1, 0.6, 0, P.blue, 0.35) },
    ], o.w ?? 0.6) +
    `<path d="${inner}" fill="${o.gold ? P.gold : P.sky1}"/>` +
    (o.beer === false ? '' : `<path d="${liquid}" fill="${BEER}"/><path d="${ellipse(x, f(y + ry * 0.38), f(r * 0.62), f(ry * 0.36))}" fill="${FOAM}" opacity=".85"/>`) +
    `<path d="${mouth}" fill="none" stroke="${dark}" stroke-width="${f(Math.max(0.6, r * 0.09))}"/>` +
    `<path d="${mouth}" fill="none" stroke="${P.ink}" stroke-width="${f(Math.max(0.3, r * 0.03))}"/>`
  )
}

/** Pelotita de ping pong. */
function pball(k: Kit, x: number, y: number, r: number, c = P.white) {
  const d = ellipse(x, y, r, r)
  return k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, c === P.white ? P.blue : P.goldD, 0.4) + `<path d="M${f(x - r)} ${y}A${r} ${f(r * 0.3)} 0 0 0 ${f(x + r)} ${y}" fill="none" stroke="${c === P.white ? P.sky2 : P.goldD}" stroke-width="${f(Math.max(0.3, r * 0.06))}" transform="rotate(-18 ${x} ${y})"/>` }], f(Math.min(0.7, 0.3 + r * 0.04))) +
    `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.42)}" rx="${f(r * 0.24)}" ry="${f(r * 0.13)}" fill="#fff" transform="rotate(-38 ${f(x - r * 0.4)} ${f(y - r * 0.42)})"/>`
}

/** Mesa de la previa: la tapa de madera desde y0 hasta abajo. */
const table = (k: Kit, y0: number) => {
  const d = `M-10 ${y0}H130V140H-10Z`
  return k.draw([{ d, fill: WOOD, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, WOOD_G, 0.45) + `<path d="M-10 ${f(y0 + 0.6)}H130" stroke="${WOOD_L}" stroke-width="1"/>` + [8, 18, 30].map((dy, i) => hair(-4 + i * 20, y0 + dy, 50 + i * 10, y0 + dy - 1, 124, y0 + dy + 0.6, 0.45, WOOD_D)).join('') }], 0.55)
}

export const BEERPONG_ART: Record<string, (u: number) => string> = {
  // Tres ganadas: el primer vaso rojo de la colección, con su cartelito de museo, y la pelotita que entra.
  'Vaso de plástico': (u) => {
    const k = kit(u)
    const card = roundRect(-8, -5, 8, 5, 0.6)
    return (
      k.day() +
      k.sun(60, 46, 15, 46, 32, true) +
      glow(k, 60, 50, 22, 22, 0.6) +
      table(k, 86) +
      k.floor(61, 88, 16, 2.4, WOOD_G) +
      `<path d="M30 30C40 20 52 22 58 38" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.6 1.4"/>` +
      cup(k, 60, 48, 15, 39) +
      pball(k, 59, 42, 4.4) +
      hair(53, 36, 54, 34, 56, 33, 0.5, P.mid) + hair(64, 35, 63, 33, 61, 32, 0.5, P.mid) +
      `<g transform="translate(84 84) rotate(-8)">` + `<path d="M-4 5L-6 9M4 5L6 9" stroke="${P.ink}" stroke-width=".6"/>` +
      k.draw([{ d: card, fill: P.white, inner: k.sh(card, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) + `<path d="M-7 -4H7V4H-7Z" fill="none" stroke="${P.gold}" stroke-width=".4"/>` }], 0.4) +
      rotulo(0, 2, 5, 'n.º 1', { c: P.ink, bold: true }) + `</g>` +
      sparkle(36, 56, 1.8) + sparkle(86, 40, 1.4) +
      k.defs()
    )
  },

  // Diez victorias: el último vaso, la pinza de cirujano que deja caer la pelotita y el pulso que no se mueve.
  'Pinza de cirujano': (u) => {
    const k = kit(u)
    const ecg = 'M14 36H40L42 33L44 39L46 36H74L76 33L78 39L80 36H106'
    // Pinza (hemostato): dos brazos que se cruzan en el perno, con los anillos arriba a la derecha y las mandíbulas
    // abajo a la izquierda, apretando la pelotita.
    const armA = 'M62 56L84 30L86 31.6L65 58Z', armB = 'M65 56L88 36L86.6 38.2L62.6 58.6Z'
    const jaws = 'M62 56L56.6 61.4L58 62.6L64 58.4ZM65 56L59.6 64L61 65L66.4 58.4Z'
    const ringL = `${ellipse(87.6, 26.6, 4.2, 4.2)} ${ellipse(87.6, 26.6, 2.6, 2.6)}`, ringR = `${ellipse(92.6, 33.6, 4.2, 4.2)} ${ellipse(92.6, 33.6, 2.6, 2.6)}`
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<path d="${ecg}" fill="none" stroke="${P.white}" stroke-width="2.4" stroke-linejoin="round"/><path d="${ecg}" fill="none" stroke="${P.red}" stroke-width=".9" stroke-linejoin="round"/>` +
      rotulo(28, 31, 3.8, '60 lpm', { c: P.red }) +
      table(k, 88) +
      k.floor(57, 90, 14, 2.2, WOOD_G) +
      cup(k, 56, 66, 12, 23) +
      `<path d="M58.6 64.4V68" stroke="${P.mid}" stroke-width=".6" stroke-dasharray="1 1"/>` +
      `<g transform="translate(58 62) scale(.82) translate(-58 -62)"><g fill-rule="evenodd">` +
      k.draw([
        { d: armB, fill: P.sky2, inner: k.sh(armB, 0, 0, 1, 1, 0, 0.6, P.mid, 0.4) },
        { d: armA, fill: P.sky1, inner: k.sh(armA, 0, 0, 1, 1, 0, 0.5, P.blue, 0.35) + `<path d="M64 56.4L84.6 31.6" stroke="#fff" stroke-width=".4"/>` },
        { d: jaws, fill: P.sky2, inner: `<path d="M57 61.4L63 57M60 64L65.6 58" stroke="${P.blue}" stroke-width=".3" stroke-dasharray=".4 .4"/>` },
        { d: ringL, fill: P.sky1, inner: k.sh(ellipse(87.6, 26.6, 4.2, 4.2), 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) },
        { d: ringR, fill: P.sky2, inner: k.sh(ellipse(92.6, 33.6, 4.2, 4.2), 0, 0, 1, 1, 0, 0.6, P.mid, 0.4) },
      ], 0.5) + `</g>` +
      `<circle cx="70.6" cy="50.6" r="1.1" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M83 36.4L86 33.4L87 35.4" fill="none" stroke="${P.ink}" stroke-width=".5"/></g>` +
      pball(k, 58.4, 62.4, 3.6) +
      `<text x="56" y="83" font-family="Georgia, serif" font-weight="700" font-size="7" fill="${P.white}" text-anchor="middle" opacity=".9">10</text>` +
      sparkle(36, 74, 1.6) + sparkle(86, 70, 1.4) +
      k.defs()
    )
  },

  // Treinta ganadas: la mesa de la previa con los diez vasos en triángulo, la guirnalda de luces y la invitación.
  'Leyenda de la previa': (u) => {
    const k = kit(u)
    const rows: [number, number, number][] = [[4, 54, 0.74], [3, 59.4, 0.83], [2, 65.4, 0.92], [1, 72, 1]]
    let cups = ''
    for (const [n, y, s] of rows) {
      const r = 8 * s
      for (let i = 0; i < n; i++) cups += cup(k, f(60 + (i - (n - 1) / 2) * r * 2.04), y, f(r), f(r * 2.1), { w: 0.5, gold: n === 1 })
    }
    const wire = 'M14 28C30 36 46 38 60 36C74 34 90 36 106 28'
    const bulbs = [[22, 32.2], [34, 35.8], [47, 37.4], [60, 36], [73, 35.4], [86, 36], [98, 32.2]]
    const card = roundRect(-10, -6.6, 10, 6.6, 0.8)
    return (
      k.night() +
      stars([[28, 22], [92, 22], [24, 46, 0.4], [96, 46, 0.4]]) +
      glow(k, 60, 60, 30, 22, 0.55, P.goldL) +
      table(k, 74) +
      k.floor(60, 92, 26, 3, '#000') +
      cups +
      pball(k, 60, 63, 2.6, P.gold) + hair(60, 58, 61, 54, 64, 50, 0.6, P.goldL) +
      `<path d="${wire}" fill="none" stroke="${P.ink}" stroke-width="1"/><path d="${wire}" fill="none" stroke="${P.mid}" stroke-width=".4"/>` +
      bulbs.map(([x, y], i) => glow(k, x, y + 2.6, 4.4, 4.4, 0.8, i % 2 ? P.goldL : P.red) + `<path d="M${x - 1.2} ${y}h2.4v1.4h-2.4Z" fill="${P.ink}"/><path d="${ellipse(x, y + 2.8, 1.6, 2.2)}" fill="${i % 2 ? P.goldL : P.red}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="${x - 0.5}" cy="${y + 2.2}" rx=".4" ry=".7" fill="#fff"/>`).join('') +
      `<g transform="translate(41 86) rotate(8) scale(.85)">` +
      k.draw([{ d: card, fill: P.white, inner: k.sh(card, 0, 0, 1, 1, 0, 0.5, P.goldD, 0.3) + `<path d="${roundRect(-9, -5.6, 9, 5.6, 0.5)}" fill="none" stroke="${P.gold}" stroke-width=".5"/><path d="M-9 -5.6L0 .4L9 -5.6" fill="none" stroke="${P.gold}" stroke-width=".35"/>` }], 0.45) +
      rotulo(0, 3.4, 4.4, 'previa', { c: P.wine, bold: true }) + `</g>` +
      sparkle(32, 62, 1.8, P.goldL) + sparkle(90, 60, 1.6, P.goldL) + sparkle(60, 46, 1.6, '#fff') +
      k.defs()
    )
  },
}
