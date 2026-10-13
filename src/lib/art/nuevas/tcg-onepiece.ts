// One Piece Card Game. Juego principal: el rojo de la ficha, el mar y el sol de los piratas.
// Nada de la marca ni de personajes: ni la bandera de los Sombrero de Paja, ni el sombrero tal cual (este lleva moño
// con colas), ni el barco del león-girasol, ni la fruta violeta con espirales, ni el berry.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

/** El color de la ficha (rojo pirata) y sus tonos. */
const OP = '#C92A2A', OPD = '#7E1A1F', OPL = '#F2A08F'
/** Noche de tormenta, del vino al negro. */
const OPN = '#2A0F1C'

/** Mar con olas grabadas desde la altura y hacia abajo. */
function sea(k: Kit, y: number, x0 = 0, x1 = 120) {
  let crest = `M${x0} ${y}`
  for (let x = x0; x < x1; x += 10) crest += `Q${x + 2.5} ${f(y - 1.6)} ${x + 5} ${y}T${x + 10} ${y}`
  const d = crest + `V130H${x0}Z`
  const waves = Array.from({ length: 5 }, (_, r) => {
    const yy = y + 4 + r * 4.4
    return Array.from({ length: 6 }, (_, i) => hair(8 + i * 20 + (r % 2) * 10, yy, 13 + i * 20 + (r % 2) * 10, yy - 1.6, 18 + i * 20 + (r % 2) * 10, yy, 0.55, P.mid, 0.75)).join('')
  }).join('')
  return `<path d="${d}" fill="${P.sky}"/>` + k.sh(d, 0, 0, 0, 1, 0, 0.85, P.blue, 0.45) + waves + `<path d="${crest}" fill="none" stroke="${P.white}" stroke-width=".7"/>`
}

/** Sombrero de paja de frente, un poco desde arriba, con cinta roja y moño de colas al viento. Centro del ala en (0,0). */
function strawHat(k: Kit, w = 0.75) {
  const brim = ellipse(0, 0, 26, 7.8)
  const crown = 'M-12.4 -1.6C-13.4 -8.6 -10 -15.4 0 -15.4C10 -15.4 13.4 -8.6 12.4 -1.6C8 .6 -8 .6 -12.4 -1.6Z'
  const band = 'M-12.6 -2.8C-8 -.6 8 -.6 12.6 -2.8L12.9 -6.8C8 -4.4 -8 -4.4 -12.9 -6.8Z'
  const tail1 = 'M11.6 -5.4C15.4 -6.6 19.8 -9.8 24.4 -8.8L22.4 -6.4L25.4 -4.2C20.6 -4.4 15.8 -3.4 11.8 -3.2Z'
  const tail2 = 'M11.2 -3.8C14.2 -1.4 16.8 2.4 20.8 3.8L18.4 5.2L19.6 8C15.4 6 12.4 2 10.2 -1.6Z'
  const knot = ellipse(11.4, -4.5, 2.2, 2.5)
  const weave = [22.4, 18.6, 15.2].map((r) => `<path d="${ellipse(0, 0.4, r, r * 0.3)}" fill="none" stroke="${P.goldD}" stroke-width=".45" stroke-dasharray="1.4 .7"/>`).join('')
  const ticks = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a)
    return `M${f(c * 23.6)} ${f(s * 7.1)}L${f(c * 25.8)} ${f(s * 7.74)}`
  }).join('')
  const fray = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2 + 0.1, c = Math.cos(a), s = Math.sin(a), l = i % 3 ? 1.4 : 2.2
    return `M${f(c * 25.6)} ${f(s * 7.7)}L${f(c * (25.6 + l))} ${f(s * (7.7 + l * 0.3) + 0.4)}`
  }).join('')
  const rows = [-4.2, -7.6, -10.6, -13].map((y, i) => `<path d="M${f(-12.6 + i * 0.6)} ${y}Q0 ${f(y + 2.2 - i * 0.3)} ${f(12.6 - i * 0.6)} ${y}" fill="none" stroke="${P.goldD}" stroke-width=".45" stroke-dasharray="1.3 .7"/>`).join('')
  return (
    `<path d="${fray}" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>` +
    k.draw([{
      d: brim, fill: P.goldL,
      inner: k.sh(brim, 0, 0, 1, 1, 0.1, 0.9, P.goldD, 0.5) + `<path d="M-27 -8H-6V2C-14 2 -22 1 -27 0Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.5, 0)}"/>` + weave +
        `<path d="${ticks}" stroke="${P.goldD}" stroke-width=".35"/>` + hair(-20, 4.4, 0, 8.6, 20, 4.4, 0.7, P.goldD, 0.8),
    }], w) +
    k.draw([{
      d: crown, fill: P.goldL,
      inner: k.sh('M1 -17H14V1H1Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-14 -17H-4V1H-14Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.55, 0)}"/>` + rows +
        hair(-8.4, -12.6, -5.4, -14.6, -1.4, -14.8, 0.8, '#fff', 0.9),
    }], w) +
    k.draw([
      { d: band, fill: OP, inner: k.sh(band, 0, 0, 1, 0, 0, 0.9, OPD, 0.5) + hair(-10.6, -4.4, 0, -2, 10, -4, 0.45, OPL, 0.9) },
      { d: tail2, fill: OP, inner: k.sh(tail2, 0, 0, 1, 1, 0, 0.9, OPD, 0.5) + hair(12, -1.6, 15, 2, 18.6, 4.4, 0.35, OPD) },
      { d: tail1, fill: OP, inner: k.sh(tail1, 0, 0, 0, 1, 0, 0.8, OPD, 0.45) + hair(13, -5, 18, -6.4, 22.6, -7.4, 0.35, OPL) },
      { d: knot, fill: OP, inner: k.sh(knot, 0, 0, 1, 1, 0, 0.9, OPD, 0.5) },
    ], w * 0.7)
  )
}

/** Timón de madera de ocho cabillas torneadas, con aros de bronce y el cubo dorado. */
function helm(k: Kit, cx: number, cy: number, R: number) {
  const ring = (r: number, cw: boolean) => `M${f(cx - r)} ${cy}A${r} ${r} 0 1 ${cw ? 1 : 0} ${f(cx + r)} ${cy}A${r} ${r} 0 1 ${cw ? 1 : 0} ${f(cx - r)} ${cy}Z`
  const rim = ring(R, true) + ring(R * 0.8, false)
  const spoke = 'M4 -1.2H21.2C22.4 -1.2 23 -2.4 24.6 -2.4C26.2 -2.4 26.8 -1.6 27.6 -1.6C29.8 -1.6 31.4 -1.2 31.4 0C31.4 1.2 29.8 1.6 27.6 1.6C26.8 1.6 26.2 2.4 24.6 2.4C23 2.4 22.4 1.2 21.2 1.2H4Z'
  const s = R / 20
  const spokes = Array.from({ length: 8 }, (_, i) =>
    `<g transform="translate(${cx} ${cy}) rotate(${-90 + i * 45}) scale(${f(s)})">` +
    k.draw([{ d: spoke, fill: P.brown, inner: k.sh(spoke, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M23.4 -2.6V2.6M26.6 -2V2" stroke="${P.brownD}" stroke-width=".4"/>` + hair(6, -0.5, 14, -0.8, 20, -0.5, 0.45, P.goldL, 0.8) }], f(0.6 / s)) +
    `</g>`).join('')
  const fittings = Array.from({ length: 8 }, (_, i) => {
    const a = ((-90 + i * 45) * Math.PI) / 180, x = cx + Math.cos(a) * R * 0.9, y = cy + Math.sin(a) * R * 0.9
    return `<rect x="-1.8" y="-${f(R * 0.11)}" width="3.6" height="${f(R * 0.22)}" rx=".5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35" transform="translate(${f(x)} ${f(y)}) rotate(${-90 + i * 45 + 90})"/>`
  }).join('')
  const hub = ellipse(cx, cy, R * 0.3, R * 0.3)
  return (
    spokes +
    k.draw([{
      d: rim, fill: P.brown,
      inner: k.sh(rim, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) + `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.9)}" fill="none" stroke="${P.brownD}" stroke-width=".4" stroke-dasharray="3 1.4"/>` +
        `<path d="M${f(cx - R * 0.9)} ${f(cy - R * 0.1)}A${f(R * 0.9)} ${f(R * 0.9)} 0 0 1 ${f(cx - R * 0.1)} ${f(cy - R * 0.9)}" fill="none" stroke="${P.goldL}" stroke-width=".7" opacity=".8"/>`,
    }], 0.7) +
    fittings +
    k.draw([{ d: hub, fill: P.gold, inner: k.sh(hub, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.55) +
    `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.2)}" fill="none" stroke="${P.goldD}" stroke-width=".45"/><path d="${starPath(cx, cy, R * 0.16, R * 0.06, 8)}" fill="${P.goldD}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.05)}" fill="${OP}"/>`
  )
}

/** Dorso de carta propio: rojo, con filete dorado y una rosa de los vientos. Centro en (0,0). */
function opCard(k: Kit, w: number, h: number) {
  const d = roundRect(-w / 2, -h / 2, w / 2, h / 2, 1.2)
  return (
    k.draw([{
      d, fill: OP,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, OPD, 0.5) + `<path d="${roundRect(-w / 2 + 1.2, -h / 2 + 1.2, w / 2 - 1.2, h / 2 - 1.2, 0.6)}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
        `<path d="${starPath(0, 0, w * 0.3, w * 0.07, 4)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/><path d="${starPath(0, 0, w * 0.2, w * 0.05, 4, -45)}" fill="${P.gold}"/><circle cx="0" cy="0" r="${f(w * 0.06)}" fill="${OPD}"/>`,
    }], 0.45)
  )
}

/** Rayo de haki: zigzag negro que se afina, de r0 a r1 en el ángulo a. */
function bolt(cx: number, cy: number, a: number, r0: number, r1: number, w: number, seed: number) {
  const N = 6, L: string[] = [], R: string[] = []
  const ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux
  for (let i = 0; i <= N; i++) {
    const t = i / N, r = r0 + (r1 - r0) * t, off = i === 0 || i === N ? 0 : Math.sin(seed * 3.7 + i * 2.3) * 2.4 * (i % 2 ? 1 : -1), ww = w * (1 - t * 0.92)
    const x = cx + ux * r + px * off, y = cy + uy * r + py * off
    L.push(`${f(x + px * ww)} ${f(y + py * ww)}`)
    R.push(`${f(x - px * ww)} ${f(y - py * ww)}`)
  }
  return `M${L.join('L')}L${R.reverse().join('L')}Z`
}

/** Cabeza de león tallada y dorada, de perfil hacia la izquierda (mascarón de proa). Centro en (0,0). */
function lionHead(k: Kit) {
  const mane =
    'M-4 -9C-2 -12 0 -13.4 2 -14.6C2.6 -12.8 4 -12.2 5.2 -12.6C6.8 -13.4 8.4 -13.4 10 -13C9.6 -11.2 10.6 -10 11.8 -9.6C13 -9.2 14.2 -8.2 15.2 -7C14.2 -5.6 14.4 -4 15.2 -3.2C16 -2.2 16.8 -.8 17 .6' +
    'C15.8 1.2 15.2 2.4 15.4 3.8C15.6 5 15.4 6.2 14.8 7.2C13.6 7 12.2 7.8 11.6 9C11 10.2 10.2 11.2 9.2 12C8.2 11 6.6 10.8 5.4 11.4C4.2 12 2.8 12.6 1.4 12.8C1 11.4 -.6 10.6 -2.2 10.8Z'
  const face = 'M-1 -8.2C-4.2 -8.4 -6.8 -6.6 -7.8 -4C-9.6 -3.8 -10.8 -2.6 -10.6 -.8C-10.4 .6 -9.4 1.4 -8.4 1.6L-4.4 2.6L-8.2 4.4C-7.2 6.6 -4.4 8.2 -1.6 8.2C1.4 8.2 4 5.8 4.2 3.2C4.8 -.4 4.2 -5.4 -1 -8.2Z'
  const ear = 'M1.4 -7.8C1.8 -10.4 4 -11.4 5.4 -10.4C5.6 -8.6 4.4 -7 2.6 -6.4Z'
  const locks = [
    [3, -9, 6, -11, 9, -10.4], [6, -6.4, 10, -7.4, 13, -5.6], [7, -2.4, 11, -2.6, 14.6, 0], [6.6, 2, 10.4, 3, 13, 5.6], [4.8, 5.8, 7, 8, 8.6, 10.4], [1.4, 8.6, 3, 10.6, 3.6, 11.6],
  ].map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.9, P.goldL)).join('')
  return (
    k.draw([
      { d: mane, fill: P.goldD, inner: k.sh(mane, 0, 0, 1, 1, 0, 0.95, P.brownD, 0.5) + locks },
      { d: ear, fill: P.goldL, inner: k.sh(ear, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
      {
        d: face, fill: P.goldL,
        inner: k.sh(face, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + hair(-7.4, -4.6, -4, -6.6, 0, -6.4, 0.6, P.goldD) +
          hair(-1.4, 1.6, 1.4, 3, 1.4, 6.2, 0.6, P.goldD, 0.8) + hair(-8.6, -3, -6.6, -5.6, -3, -7.4, 0.8, '#fff', 0.9),
      },
    ], 0.6) +
    `<path d="M-6 -3.4C-5.2 -4.4 -3.6 -4.6 -2.8 -3.6C-3.6 -2.8 -5 -2.6 -6 -3.4Z" fill="${P.ink}"/>` +
    `<path d="M-8.4 1.6L-4.4 2.6L-8.2 4.4Z" fill="${OPD}" stroke="${P.ink}" stroke-width=".35" stroke-linejoin="round"/><path d="M-8 1.8L-7.4 2.8L-6.8 2M-7.8 4.2L-7.2 3.4L-6.6 4" fill="none" stroke="#fff" stroke-width=".35"/>` +
    `<path d="M-10.2 -1.2L-9.2 -1.8" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>`
  )
}

export const TCG_ONEPIECE_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Rey de los Piratas ─────────────────────────────────────────────

  // Tres ganadas: el sombrero de paja colgado del timón; te lo encasquetás y salís a navegar.
  'Sombrero de paja': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 50, 14, 46, 32, false) +
      sea(k, 86) +
      helm(k, 60, 49, 19) +
      `<g transform="translate(60 74) rotate(-5)">` + k.cast([ellipse(0, 0, 26, 7.8)], 1.6, 2.6, P.mid) + strawHat(k) + `</g>` +
      sparkle(32, 36, 2.2, '#fff') + sparkle(89, 74, 1.6, '#fff') +
      k.defs()
    )
  },

  // Quince: el cartel de "Se busca" clavado en el muelle; la cara no se ve, el sombrero sí, y la recompensa ya subió.
  'Cartel de Se Busca': (u) => {
    const k = kit(u)
    const post = 'M54.4 8H65.6V112H54.4Z'
    const paper = 'M-20 -27L-6 -27.6L8 -26.8L20 -27.4L20.6 -10L19.6 6L20.4 20.6C18 23.4 16 25.8 13 27.4L-4 26.8L-20.4 27.4L-19.6 10L-20.6 -8Z'
    const curl = 'M20.4 20.6C18 23.4 16 25.8 13 27.4C14 23.6 16.4 21.4 20.4 20.6Z'
    const frame = 'M-14 -14.4H14V8.6H-14Z'
    const nail = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(x - 0.4)}" cy="${f(y - 0.4)}" r=".4" fill="#fff"/>`
    const T = (x: number, y: number, s: number, txt: string, o = '') => `<text x="${x}" y="${y}" font-family="Georgia, serif" font-size="${s}" text-anchor="middle" ${o}>${txt}</text>`
    return (
      k.day() +
      k.sun(60, 54, 14, 46, 32, false) +
      sea(k, 80) +
      k.draw([{ d: post, fill: P.brown, inner: k.sh(post, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + hair(57, 12, 56.4, 50, 57.4, 108, 0.6, P.brownD) + hair(62, 10, 63, 40, 62, 70, 0.5, P.brownD) + `<path d="M54 22H66M54 96H66" stroke="${P.brownD}" stroke-width=".5"/>` + hair(55.6, 14, 55.6, 60, 55.6, 108, 0.8, P.goldL, 0.5) }], 0.7) +
      `<g transform="translate(60 59.6) rotate(-4)">` +
      k.cast([paper], 1.8, 2, P.brown) +
      k.draw([{
        d: paper, fill: '#F3E3BE',
        inner:
          k.sh(paper, 0, 0, 1, 1, 0, 0.75, P.brown, 0.4) + k.sh('M-22 18H22V30H-22Z', 0, 0, 0, 1, 0, 0.6, P.brown, 0.3) +
          hair(-18, -4, -4, -6, 18, -2, 0.4, P.brown, 0.7) + hair(-6, -26, -5, 0, -7, 26, 0.35, P.brown, 0.6) +
          `<circle cx="13" cy="-20" r="2.6" fill="${P.brown}" opacity=".18"/><path d="M-18 24L-14 26.6" stroke="${P.brown}" stroke-width=".4"/>`,
      }], 0.65) +
      k.draw([{ d: curl, fill: '#E2CC9C', inner: k.sh(curl, 0, 0, 1, 1, 0, 0.8, P.brown, 0.4) }], 0.4) +
      `<path d="M-18 -24.8H18M-18 -15.6H18" stroke="${P.brownD}" stroke-width=".4"/>` +
      `<g fill="${OPD}" font-weight="700">${T(0, -17.6, 6.8, 'SE BUSCA', 'letter-spacing=".4"')}</g>` +
      `<path d="${frame}" fill="${P.sky1}"/>` + k.clip(frame, k.sh(frame, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.5) + `<g transform="translate(0 2.6) scale(.42)">${strawHat(k, 1.4)}</g>`) +
      `<path d="${frame}" fill="none" stroke="${P.brownD}" stroke-width=".8"/><path d="M-12.8 -13.2H12.8V7.4H-12.8Z" fill="none" stroke="${P.brownD}" stroke-width=".3"/>` +
      `<g fill="${P.brownD}" font-style="italic" font-weight="700">${T(0, 13.4, 3.4, 'recompensa', 'letter-spacing=".3"')}</g>` +
      `<g fill="${P.brownD}" font-weight="700">${T(-8, 18.8, 4.2, '1.000')}</g><path d="M-14.2 17.4L-1.8 16.4" stroke="${OP}" stroke-width="1" stroke-linecap="round"/>` +
      `<g fill="${OP}" font-weight="700" font-style="italic">${T(2, 24.6, 6, '3.000.000', 'transform="rotate(-4 2 23)"')}</g>` +
      nail(-17, -24) + nail(17, -24.4) +
      `</g>` +
      sparkle(88, 30, 2.2, '#fff') + sparkle(30, 46, 1.6, '#fff') +
      k.defs()
    )
  },

  // Cuarenta: barco propio, con el león dorado en la proa y la escalerita de la pileta en cubierta.
  'Thousand Sunny': (u) => {
    const k = kit(u)
    const hull = 'M34 70C38 69 42 68.8 47 69H78L78.8 61.6H91.2C92.4 61.6 93.2 62.6 93 63.8L92.2 70C91.2 77 89 82.6 85.6 87.4H46C40.4 85.4 36.4 79.4 34 70Z'
    const rail = 'M34 70C38 69 42 68.8 47 69H78V71.6H47C42 71.6 38.6 72 35 73Z'
    const stripe = 'M35.6 75.4C40 74.4 43 74 47 74H92L91.6 77H47C43.4 77 40.4 77.6 37.2 78.6Z'
    const castle = 'M78.8 61.6H91.2C92.4 61.6 93.2 62.6 93 63.8L92.2 70H78Z'
    const mainSail = 'M55 27.4H77C79.6 35 79.6 46 77 55.6C70 58.4 62 58.4 55 55.6C52.4 46 52.4 35 55 27.4Z'
    const foreSail = 'M41.4 37H55.4C57 43 57 50 55.4 57.6C50.6 59.4 46.2 59.4 41.4 57.6C39.8 50 39.8 43 41.4 37Z'
    const yard = (x0: number, x1: number, y: number) => `<path d="M${x0} ${y}H${x1}" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M${x0} ${y}H${x1}" stroke="${P.brown}" stroke-width="1" stroke-linecap="round"/>`
    const mast = (x: number, y0: number, y1: number) => `<path d="M${x} ${y0}V${y1}" stroke="${P.ink}" stroke-width="2.6"/><path d="M${x} ${y0}V${y1}" stroke="${P.brown}" stroke-width="1.3"/><path d="M${f(x - 0.4)} ${y0}V${y1}" stroke="${P.goldL}" stroke-width=".35"/>`
    const planks = [78.6, 81.6, 84.4].map((y, i) => hair(40 + i * 2.6, y, 64, y + 0.4, 90 - i * 1.6, y - 0.4, 0.45, P.brownD)).join('')
    const ports = [50, 57, 64, 71].map((x) => `<circle cx="${x}" cy="80.4" r="1.3" fill="${P.night}" stroke="${P.gold}" stroke-width=".5"/>`).join('')
    const wins = [81, 85, 89].map((x) => `<rect x="${x}" y="64" width="2.4" height="3" rx=".6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    const balusters = Array.from({ length: 7 }, (_, i) => `M${f(79.4 + i * 2)} 61.6V59.2`).join('')
    const ring = ellipse(0, 0, 3.4, 3.4), hole = ellipse(0, 0, 1.6, 1.6)
    const ladder = (x: number) => `<path d="M${x} 69V64.6C${x} 62.6 ${f(x + 1.4)} 62 ${f(x + 2.6)} 62.6" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${x} 69V64.6C${x} 62.6 ${f(x + 1.4)} 62 ${f(x + 2.6)} 62.6" fill="none" stroke="${P.white}" stroke-width=".6" stroke-linecap="round"/>`
    return (
      k.day() +
      k.sun(66, 46, 14, 48, 32, false) +
      sea(k, 84) +
      // Jarcia y mástiles detrás de las velas.
      `<path d="M37 70L50 31M50 31L66 21M92 61L66 21" fill="none" stroke="${P.brownD}" stroke-width=".4"/>` +
      mast(50, 30, 70) + mast(66, 19, 70) +
      k.draw([
        {
          d: foreSail, fill: P.white,
          inner: k.sh(foreSail, 0, 0, 1, 0, 0, 0.8, P.sky2, 0.5) + hair(44, 40, 42.8, 48, 44, 56, 0.45, P.sky2) + hair(52, 40, 53.6, 48, 52.4, 56, 0.45, P.blue, 0.7) + `<path d="M45 37V58.4M48.4 37V59M51.8 37V58.6" stroke="${P.sky2}" stroke-width=".35"/>` + `<path d="M41 47.4C46 49 51 49 56 47.4" fill="none" stroke="${OP}" stroke-width="1.4"/>`,
        },
        {
          d: mainSail, fill: P.white,
          inner: k.sh(mainSail, 0, 0, 1, 0, 0, 0.8, P.sky2, 0.5) + hair(58, 31, 56.6, 42, 58, 53, 0.5, P.sky2) + hair(74, 31, 76, 42, 74.4, 53, 0.5, P.blue, 0.7) + `<path d="M59.4 27.4V57M63 27.4V57.8M69 27.4V57.8M72.6 27.4V57" stroke="${P.sky2}" stroke-width=".35"/>` +
            `<path d="M54 49.6C62 52 70 52 78 49.6" fill="none" stroke="${OP}" stroke-width="1.6"/>` +
            k.sun(66, 39.6, 4.2, 8.6, 16, false) + `<circle cx="66" cy="39.6" r="4" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".4"/><circle cx="66" cy="39.6" r="2.4" fill="${P.goldL}"/>`,
        },
      ], 0.6) +
      yard(53.6, 78.4, 27.4) + yard(53.6, 78.4, 55.6) + yard(40, 56.8, 37) + yard(40, 56.8, 57.6) +
      `<path d="M50 30.6L61 32.6L50 34.8Z" fill="${OP}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>` +
      ladder(57.4) + ladder(60.4) + `<path d="M57.4 66H60.4M57.4 68H60.4" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="${balusters}" stroke="${P.ink}" stroke-width=".9"/><path d="${balusters}" stroke="${P.gold}" stroke-width=".4"/><path d="M78.6 59.2H92" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><path d="M78.6 59.2H92" stroke="${P.gold}" stroke-width=".5"/>` +
      k.draw([
        {
          d: hull, fill: P.brown,
          inner: k.sh(hull, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + k.sh('M74 60H96V90H74Z', 0, 0, 1, 0, 0, 0.6, P.brownD, 0.4) + `<path d="${castle}" fill="${P.brownD}" opacity=".3"/>` + planks + ports + wins +
            `<path d="${stripe}" fill="${OP}"/>` + k.sh(stripe, 0, 0, 0, 1, 0, 0.7, OPD, 0.4) + `<path d="${rail}" fill="${P.gold}"/>` + k.sh(rail, 0, 0, 1, 0, 0, 0.7, P.goldD, 0.4) +
            `<path d="M78.4 61.6V87" stroke="${P.brownD}" stroke-width=".5"/>` + hair(40, 82, 56, 85.6, 80, 85.6, 0.6, P.goldL, 0.5) +
            `<path d="M80 69.2C82 67.6 84 68.4 84 70M92 69.2C90 67.6 88 68.4 88 70M86 68.6V70.4" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/>`,
        },
      ], 0.75) +
      `<g transform="translate(85.6 73.4)">` + k.draw([{ d: ring, fill: P.white, inner: `<path d="M0 -4V4M-4 0H4" stroke="${OP}" stroke-width="2"/>` + k.sh(ring, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) }], 0.4) + `<path d="${hole}" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".35"/></g>` +
      `<path d="M34 73C30.6 72 29 69.4 29.6 66.4" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M34 73C30.6 72 29 69.4 29.6 66.4" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linecap="round"/>` +
      `<g transform="translate(30.4 63.6) scale(.78)">` + lionHead(k) + `</g>` +
      // Espuma en la proa y la estela.
      hair(32, 85.4, 38, 82, 46, 86, 1.1, '#fff') + hair(30, 88, 36, 86, 42, 89, 0.8, '#fff', 0.9) + hair(86, 88, 92, 86, 98, 88, 0.8, '#fff', 0.8) +
      sparkle(32, 38, 2, '#fff') + sparkle(90, 34, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Fruta del diablo ───────────────────────────────────────────────

  // Tres triggers: la fruta rara, roja con espirales, cuelga de un cabito que se estira como chicle; no hay quien la alcance.
  'Fruta Gomu Gomu': (u) => {
    const k = kit(u)
    const fruit = (() => {
      const N = 72, pts: string[] = []
      for (let i = 0; i < N; i++) {
        const t = (i / N) * Math.PI * 2 - Math.PI / 2, d = Math.min(i, N - i) / N * Math.PI * 2, dip = 1 - 0.13 * Math.exp(-((d / 0.32) ** 2))
        const r = 15.8 * (1 + 0.045 * Math.cos(t * 9)) * dip
        pts.push(`${f(58 + Math.cos(t) * r * 1.02)} ${f(74.4 + Math.sin(t) * r * 1.04)}`)
      }
      return `M${pts.join('L')}Z`
    })()
    const leaf = 'M58.4 59C56.4 55.4 51.8 53.6 47.6 55C49.8 58.4 54 60 58.4 59Z'
    const branch = taper(101, 44, 91, 37, 79, 37.6, 3.8, 1.9)
    const twigLeaf = (x: number, y: number, r: number, s = 1) => {
      const d = 'M0 0C2 -3.4 7 -4 9.6 -1C7 2.4 2.4 2.4 0 0Z'
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.green, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.4) }], 0.45 / s) + `<path d="M1 -.4Q5 -1.4 8.4 -1" fill="none" stroke="${P.greenD}" stroke-width=".4"/></g>`
    }
    // El cabito estirado: una curva con ondas que se calman hacia abajo.
    const N = 40, pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const t = i / N, x0 = 81 + (58.2 - 81) * t, y0 = 38 + (59 - 38) * t, off = Math.sin(t * Math.PI * 4) * 2.4 * Math.sin(t * Math.PI)
      pts.push(`${f(x0 + off * 0.94)} ${f(y0 + off * 0.33)}`)
    }
    const stem = `M${pts.join('L')}`
    const spiral = (cx: number, cy: number, r: number, sx = 1) =>
      `<path d="M${cx} ${cy}c${f(r * 0.3 * sx)} ${f(-r * 0.2)} ${f(r * 0.6 * sx)} ${f(r * 0.3)} ${f(r * 0.2 * sx)} ${f(r * 0.6)}s${f(-r * sx)} ${f(-r * 0.2)} ${f(-r * 0.8 * sx)} ${f(-r * 0.9)}s${f(r * 1.2 * sx)} ${f(-r)} ${f(r * 1.6 * sx)} ${f(r * 0.1)}s${f(-r * 0.4 * sx)} ${f(r * 1.6)} ${f(-r * 1.4 * sx)} ${f(r * 1.4)}" fill="none" stroke="${P.goldL}" stroke-width="1" stroke-linecap="round"/>`
    return (
      k.day() +
      k.sun(58, 72, 15, 44, 32, false) +
      k.floor(59.6, 97, 13, 2.2) +
      `<path d="M38 66C35 70 35 78 38 82M78 66C81 70 81 78 78 82" fill="none" stroke="${P.mid}" stroke-width=".9" stroke-linecap="round"/><path d="M34 69C32.4 72 32.4 76 34 79M82 69C83.6 72 83.6 76 82 79" fill="none" stroke="${P.blue}" stroke-width=".7" stroke-linecap="round"/>` +
      hair(48, 93, 54, 94.6, 60, 93.4, 0.6, P.mid) +
      k.draw([{ d: branch, fill: P.brown, inner: k.sh(branch, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + hair(92, 27.6, 84, 25, 74, 26, 0.4, P.goldL, 0.8) }], 0.6) +
      twigLeaf(84, 37, -120, 0.9) + twigLeaf(92, 39.4, -60, 0.8) +
      `<path d="${stem}" fill="none" stroke="${P.ink}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="${stem}" fill="none" stroke="${P.green}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      hair(66, 40, 70, 42, 74, 44, 0.6, P.mid) + hair(62, 46, 66, 49, 70, 50, 0.6, P.mid) +
      k.cast([fruit], 2.2, 2.2) +
      k.draw([
        {
          d: fruit, fill: OP,
          inner:
            k.sh(fruit, 0, 0, 1, 1, 0, 0.95, OPD, 0.5) + `<path d="M40 56H56V78C50 76 44 74 40 72Z" fill="${k.lin(OPL, 0, 0, 1, 1, 0.8, 0)}"/>` +
            spiral(52.6, 69, 4.2) + spiral(64.6, 75.4, 3.8, -1) + spiral(55.4, 82.6, 2.8) + spiral(66.4, 64.4, 2.6, -1) + spiral(47.6, 79, 2) +
            hair(58, 60, 57.4, 66, 58, 72, 0.6, OPD, 0.7),
        },
        { d: leaf, fill: P.green, inner: k.sh(leaf, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.5) + `<path d="M57.2 58.6Q53 56 48.6 55.4" fill="none" stroke="${P.greenD}" stroke-width=".4"/>` },
      ], 0.8) +
      hair(46.6, 70, 47, 64.6, 51.4, 61.4, 1.3, '#fff', 0.9) + `<circle cx="46.8" cy="74" r=".85" fill="#fff"/>` +
      sparkle(34, 46, 2.2, '#fff') + sparkle(87, 52, 1.6, '#fff') +
      k.defs()
    )
  },

  // Doce triggers: la corona del rey suelta el haki; los rayos negros barren la mesa y las cartas del rival se desmayan.
  'Haki del Rey': (u) => {
    const k = kit(u)
    const cx = 60, cy = 46
    const angles = [-168, -140, -112, -76, -48, -18, 12, 168, 196, 150, 30]
    const bolts = angles.map((deg, i) => bolt(cx, cy, (deg * Math.PI) / 180, 14, 40 + (i % 3) * 4, 3, i + 1)).join('')
    const forks = angles.filter((_, i) => i % 2 === 0).map((deg, i) => bolt(cx + Math.cos((deg * Math.PI) / 180) * 26, cy + Math.sin((deg * Math.PI) / 180) * 26, ((deg + 22) * Math.PI) / 180, 0, 12, 1.4, i + 7)).join('')
    const points = 'M-15.4 -6.6L-17.4 -19.4L-11.8 -12.2L-8.6 -23.2L-4 -14.2L0 -27L4 -14.2L8.6 -23.2L11.8 -12.2L17.4 -19.4L15.4 -6.6C5 -4.6 -5 -4.6 -15.4 -6.6Z'
    const band = 'M-15 0C-15 -2 -15 -4.4 -15.4 -6.6C-5 -4.6 5 -4.6 15.4 -6.6C15 -4.4 15 -2 15 0C5 1.6 -5 1.6 -15 0Z'
    const cap = 'M-12 -8C-11 -16 -5 -19.4 0 -19.4C5 -19.4 11 -16 12 -8C5 -6.6 -5 -6.6 -12 -8Z'
    const gem = (x: number, y: number, r: number, c: string) => `<circle cx="${x}" cy="${y}" r="${f(r + 0.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff"/>`
    const pearl = (x: number, y: number, r = 1.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - 0.4)}" cy="${f(y - 0.4)}" r=".4" fill="#fff"/>`
    const table = 'M10 86C28 80.6 92 80.6 110 86V130H10Z'
    const shock = [[14, 2.4], [26, 4.2], [38, 6]].map(([rx, ry], i) => `<path d="${ellipse(60, 88.4 + i * 1.4, rx, ry)}" fill="none" stroke="${OPL}" stroke-width="${0.8 - i * 0.15}" stroke-dasharray="${3 + i * 2} ${1.6 + i}" opacity="${0.9 - i * 0.2}"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${OPN}"/>` + k.shade('M0 0H120V130H0Z', k.rad(OP, 0.5, 0.36, 0.42, 0.95, 0), OP, 0.5) +
      k.draw([{ d: table, fill: '#5A2A1E', inner: k.sh(table, 0, 0, 0, 1, 0, 0.9, '#1E0A0E', 0.5) + hair(20, 85.6, 60, 82.4, 100, 85.6, 0.6, OPL, 0.6) + hair(24, 92, 40, 90.4, 52, 90.6, 0.4, '#1E0A0E') + hair(70, 96, 84, 95, 98, 96, 0.4, '#1E0A0E') }], 0.6) +
      shock +
      `<path d="${bolts}${forks}" fill="none" stroke="${OP}" stroke-width="3.6" stroke-linejoin="round" opacity=".5"/>` +
      `<path d="${bolts}${forks}" fill="none" stroke="${OPL}" stroke-width="1.6" stroke-linejoin="round" opacity=".8"/>` +
      `<path d="${bolts}${forks}" fill="#14060C"/>` +
      k.shade(ellipse(cx, cy - 2, 19, 19), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<g transform="translate(35 82) rotate(-64)">` + opCard(k, 9.6, 13.6) + `</g>` + `<g transform="translate(86 80.4) rotate(58)">` + opCard(k, 9.6, 13.6) + `</g>` +
      hair(38, 80, 42, 78, 46, 78, 0.6, OPL) + hair(82, 79, 78, 77.4, 74, 77.6, 0.6, OPL) +
      `<g transform="translate(${cx} ${cy + 13}) scale(1.3)">` +
      k.floor(0, 1.4, 15, 2, '#14060C') +
      k.draw([
        { d: cap, fill: OP, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.9, OPD, 0.5) + hair(-6, -9, -5, -14, -1, -17.6, 0.6, OPL, 0.9) },
        {
          d: points, fill: P.gold,
          inner: k.sh(points, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-16 -26H-6V-4H-16Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.4, 0)}"/>` +
            `<path d="M-14.6 -8.6L-15.8 -16.6M-7.6 -9L-8.2 -19M7.6 -9L8.2 -19M14.6 -8.6L15.8 -16.6M0 -9.4V-23" stroke="${P.goldD}" stroke-width=".4"/>`,
        },
        { d: band, fill: P.gold, inner: k.sh(band, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-15 -1.6C-5 0 5 0 15 -1.6M-15.2 -5C-5 -3.2 5 -3.2 15.2 -5" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` + hair(-13, -3.6, -8, -2.6, -4, -2.4, 0.5, '#fff') },
      ], f(0.75 / 1.3)) +
      pearl(-17.4, -20.2) + pearl(-8.6, -24.2) + pearl(0, -28.2, 1.5) + pearl(8.6, -24.2) + pearl(17.4, -20.2) +
      gem(0, -3.2, 1.6, OP) + gem(-8, -3, 1.1, P.sky) + gem(8, -3, 1.1, P.sky) + gem(-13, -3.4, 0.7, OP) + gem(13, -3.4, 0.7, OP) +
      `<path d="${starPath(0, -12, 1.8, 0.7, 4)}" fill="${P.goldL}"/>` +
      `</g>` +
      sparkle(60, 21, 2.4, '#fff') + sparkle(88, 36, 1.6, OPL) + sparkle(32, 40, 1.6, OPL) +
      k.defs()
    )
  },

  // Treinta y cinco triggers: te reís, el sol se pone blanco y la mesa rebota como si fuera de goma.
  'Gear Fifth': (u) => {
    const k = kit(u)
    const cx = 60, cy = 39
    const puffs = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2, r = 16, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r
      return { x, y, a }
    })
    const cloud = puffs.map(({ x, y }, i) => ellipse(f(x), f(y), i % 2 ? 4.8 : 5.8, i % 2 ? 4.8 : 5.8)).join('')
    const curls = puffs.map(({ x, y, a }, i) => {
      const c = Math.cos(a), s = Math.sin(a), r = i % 2 ? 2.4 : 3
      return `<path d="M${f(x + c * r)} ${f(y + s * r)}a${r} ${r} 0 1 1 ${f(-s * r * 1.2)} ${f(c * r * 1.2)}a${f(r * 0.5)} ${f(r * 0.5)} 0 1 1 ${f(s * r * 0.6)} ${f(-c * r * 0.6)}" fill="none" stroke="${P.sky}" stroke-width=".6" stroke-linecap="round"/>`
    }).join('')
    const disc = ellipse(cx, cy, 12.4, 12.4)
    // La mesa: tapa redonda, canto y tres patas que se doblan como goma; el piso queda lejos (está en el aire).
    const top = ellipse(60, 76, 23, 5.6)
    const edge = 'M37 76C37 79.4 47 82.8 60 82.8C73 82.8 83 79.4 83 76V78.8C83 82.2 73 85.6 60 85.6C47 85.6 37 82.2 37 78.8Z'
    const legs = [taper(43, 82, 33, 87, 38.6, 95, 3.4, 2.4), taper(77, 82, 87, 87, 81.4, 95, 3.4, 2.4), taper(60, 85, 54, 90.6, 60, 96.6, 3.6, 2.6)]
    return (
      `<rect width="120" height="130" fill="${OPN}"/>` + k.shade('M0 0H120V130H0Z', k.rad(OP, 0.5, 0.34, 0.6, 0.95, 0), OP, 0.5) +
      // El sol blanco con su melena de nubes.
      k.shade(ellipse(cx, cy, 36, 36), k.rad('#fff', 0.5, 0.5, 0.5, 0.6, 0), '#fff', 0.4) +
      Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2, r1 = i % 2 ? 30 : 39, w = i % 2 ? 0.9 : 1.6
        return hair(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20, cx + Math.cos(a) * (r1 - 6), cy + Math.sin(a) * (r1 - 6), cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, w, '#fff', 0.85)
      }).join('') +
      k.draw([{ d: cloud, fill: P.white, inner: k.sh(cloud, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + curls }], 0.6) +
      k.draw([{ d: disc, fill: '#fff', inner: k.shade(disc, k.rad(P.sky1, 0.5, 0.5, 0.5, 0, 1), P.sky2, 0.6) }], 0.55) +
      `<circle cx="${cx}" cy="${cy}" r="9.8" fill="none" stroke="${P.sky}" stroke-width=".5" stroke-dasharray=".01 1.5" stroke-linecap="round"/>` +
      `<g fill="${P.goldL}" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="5"><text x="34" y="62" text-anchor="middle" transform="rotate(-14 34 62)">¡ja,</text><text x="86" y="60" text-anchor="middle" transform="rotate(12 86 60)">ja!</text></g>` +
      // Cartas que saltan, la mesa que rebota y el piso abajo.
      `<g transform="translate(44 64.4) rotate(-26)">` + opCard(k, 8.6, 12.4) + `</g>` + `<g transform="translate(75.6 63) rotate(20)">` + opCard(k, 8.6, 12.4) + `</g>` +
      k.floor(60, 100, 16, 2.2, '#14060C') +
      `<path d="M30 88C34 90 38 91 42 91M90 88C86 90 82 91 78 91M33 94C37 95.4 41 96 45 96M87 94C83 95.4 79 96 75 96" fill="none" stroke="${OPL}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw(legs.map((d) => ({ d, fill: P.brown, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) })), 0.65) +
      k.draw([
        { d: edge, fill: P.brownD, inner: k.sh(edge, 0, 0, 1, 0, 0, 0.7, '#3E2414', 0.4) + hair(40, 80, 50, 83.6, 60, 84, 0.45, P.goldL, 0.6) },
        { d: top, fill: P.brown, inner: k.sh(top, 0, 0, 1, 1, 0, 0.85, P.brownD, 0.5) + `<path d="${ellipse(60, 76, 19.4, 4.4)}" fill="none" stroke="${P.goldD}" stroke-width=".7"/>` + hair(42, 74.6, 50, 72, 60, 72.2, 0.7, P.goldL, 0.9) + hair(56, 78.6, 66, 79.6, 74, 78, 0.5, P.brownD) },
      ], 0.7) +
      `<path d="M34 76C33 72.6 34 70 36 68.4M86 74C87 70.6 86 68 84 66.4" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` +
      sparkle(30, 46, 1.6, '#fff') + sparkle(92, 70, 1.4, '#fff') +
      k.defs()
    )
  },
}
