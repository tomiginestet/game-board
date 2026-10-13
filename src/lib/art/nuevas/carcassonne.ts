// Carcassonne: Urbanista, Granjero y Señor feudal.
// El color propio del juego es el ocre de su ficha: la tierra del fondo, la piedra de las murallas y la madera de las
// piezas; las ciudades llevan su escudito azul y blanco. Sin meeple: los jugadores aparecen por sus objetos (un peón de
// madera, un sombrero de paja, el escudo, el yelmo, el trono).
import { f } from '../helpers'
import { chessPiece, ellipse, hair, kit, laurel, P, PAWN, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El ocre de la ficha de Carcassonne (#A87132): piedra y madera, con su sombra y su luz; la tierra del fondo y la paja.
const OCRE = '#BC8442', OCRE_D = '#83561E', OCRE_L = '#E6C287'
const TIERRA = '#E2C28C', TIERRA_G = '#C99F62'
const STRAW = '#E9CD86'

/** Fondo de Carcassonne: el papel con la tierra ocre granulada hacia los bordes. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(TIERRA, 0.5, 0.46, 0.7, 0, 1), TIERRA_G, 0.5)

/** Ruedo: un disco de tierra clara con el borde granulado (el escenario de Carcassonne). */
const arena = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F7EEDC"/>` + k.shade(ellipse(cx, cy, r, r), k.rad('#EAD3A8', 0.5, 0.5, 0.5, 0, 1), '#D9B784', 0.5) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${OCRE_D}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional (astas, varas, travesaños). */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Hiladas de piedra: renglones con las juntas trabadas, para recortar dentro de un muro. */
function courses(x0: number, y0: number, x1: number, y1: number, h: number, w: number, c = OCRE_D, op = 0.75) {
  let d = ''
  for (let y = y0 + h; y < y1; y += h) d += `M${x0} ${f(y)}H${x1}`
  let r = 0
  for (let y = y0; y < y1; y += h, r++) for (let x = x0 + (r % 2 ? w / 2 : w); x < x1; x += w) d += `M${f(x)} ${f(y)}V${f(Math.min(y + h, y1))}`
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width=".3" opacity="${op}"/>`
}

/** Muro con almenas: los merlones (ancho mw, alto mh) arriba de yTop, y la base en yBot. */
function battlement(x0: number, x1: number, yTop: number, yBot: number, mw: number, mh: number) {
  const n = Math.max(2, Math.round((x1 - x0 + mw * 0.8) / (mw * 1.8)))
  const gap = (x1 - x0 - n * mw) / (n - 1)
  let d = `M${x0} ${yBot}V${f(yTop - mh)}`
  for (let i = 0; i < n; i++) {
    const a = x0 + i * (mw + gap)
    d += `H${f(a + mw)}`
    if (i < n - 1) d += `V${yTop}H${f(a + mw + gap)}V${f(yTop - mh)}`
  }
  return d + `V${yBot}Z`
}

/** Banderín de ciudad: el escudito azul con la banda blanca, en un asta que sale de (x,y) hacia arriba. */
function pennant(x: number, y: number, h: number, dir = 1) {
  const t = y - h
  const flag = `M${x} ${f(t + 0.4)}L${f(x + 8 * dir)} ${f(t + 1.4)}L${f(x + 5.6 * dir)} ${f(t + 3)}L${f(x + 8 * dir)} ${f(t + 4.6)}L${x} ${f(t + 5.2)}Z`
  return rod(`M${x} ${y}V${f(t)}`, P.sky2, 0.5) +
    `<path d="${flag}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>` +
    `<path d="M${x} ${f(t + 2.4)}L${f(x + 6.6 * dir)} ${f(t + 2.9)}" stroke="${P.white}" stroke-width=".9"/>` +
    `<circle cx="${x}" cy="${f(t - 0.4)}" r=".7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
}

/** Torre redonda con techo cónico, la base al frente en (cx,yb): ancho w, cuerpo de alto h y techo de alto rh. */
function tower(k: Kit, cx: number, yb: number, w: number, h: number, rh: number, roof: string = P.mid, roofD: string = P.night) {
  const r = w / 2, yt = yb - h, lw = f(Math.min(0.6, w * 0.06))
  const body = `M${f(cx - r)} ${f(yt)}V${f(yb)}Q${cx} ${f(yb + r * 0.35)} ${f(cx + r)} ${f(yb)}V${f(yt)}Z`
  const cone = `M${f(cx - r - 1)} ${f(yt + 0.6)}L${cx} ${f(yt - rh)}L${f(cx + r + 1)} ${f(yt + 0.6)}Q${cx} ${f(yt + 0.6 + r * 0.32)} ${f(cx - r - 1)} ${f(yt + 0.6)}Z`
  return (
    k.draw([
      {
        d: body, fill: OCRE,
        inner:
          k.sh(body, 0, 0, 1, 0, 0, 0.95, OCRE_D, 0.5) + `<path d="M${f(cx - r)} ${f(yt)}H${f(cx - r * 0.35)}V${f(yb + 2)}H${f(cx - r)}Z" fill="${k.lin(OCRE_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
          courses(cx - r, yt + 1.2, cx + r, yb + 2, Math.max(1.8, w * 0.2), Math.max(2.6, w * 0.32)) +
          `<rect x="${f(cx - 0.45)}" y="${f(yt + h * 0.3)}" width=".9" height="${f(Math.max(2, h * 0.12))}" rx=".4" fill="${P.night}"/>` +
          k.sh(`M${f(cx - r)} ${f(yt)}H${f(cx + r)}V${f(yt + 2.6)}H${f(cx - r)}Z`, 0, 0, 0, 1, 0.7, 0, P.night, 0.35),
      },
      {
        d: cone, fill: roof,
        inner:
          k.sh(cone, 0, 0, 1, 0, 0, 0.95, roofD, 0.5) + `<path d="M${f(cx - r - 1)} ${f(yt + 1)}L${cx} ${f(yt - rh)}L${f(cx - r * 0.2)} ${f(yt + 1)}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          hair(cx - r * 0.5, yt, cx - r * 0.3, yt - rh * 0.5, cx, yt - rh + 1, 0.3, roofD, 0.8) + hair(cx + r * 0.5, yt, cx + r * 0.3, yt - rh * 0.5, cx, yt - rh + 1, 0.3, roofD, 0.8),
      },
    ], lw) +
    `<circle cx="${cx}" cy="${f(yt - rh)}" r="${f(Math.max(0.5, w * 0.07))}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

/** Corona abierta de cinco puntas con perlas, la banda con piedras; base del frente en y0, de x0 a x1. */
function crown(k: Kit, x0: number, x1: number, y0: number, h: number) {
  const w = x1 - x0, cx = (x0 + x1) / 2, yb = y0, band = h * 0.32
  const pts = [[0, 0.62], [0.17, 0.22], [0.3, 0.86], [0.42, 0.3], [0.5, 1], [0.58, 0.3], [0.7, 0.86], [0.83, 0.22], [1, 0.62]]
  const body = `M${f(x0 + 0.6)} ${yb}` + pts.map(([t, v]) => `L${f(x0 + t * w)} ${f(yb - band - v * (h - band))}`).join('') + `L${f(x1 - 0.6)} ${yb}Q${cx} ${f(yb + 1.6)} ${f(x0 + 0.6)} ${yb}Z`
  const bandD = `M${f(x0 + 0.2)} ${f(yb - band)}Q${cx} ${f(yb - band + 1.6)} ${f(x1 - 0.2)} ${f(yb - band)}L${f(x1 - 0.6)} ${yb}Q${cx} ${f(yb + 1.6)} ${f(x0 + 0.6)} ${yb}Z`
  const tips = [0, 0.3, 0.5, 0.7, 1].map((t) => { const v = pts.find((p) => p[0] === t)![1]; return [x0 + t * w, yb - band - v * (h - band)] })
  const gem = (x: number, y: number, r: number, c: string, dk: string) =>
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r + 0.7)}" ry="${f(r * 0.85 + 0.7)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${r}" ry="${f(r * 0.85)}" fill="${c}" stroke="${P.ink}" stroke-width=".3"/><path d="M${f(x - r * 0.6)} ${f(y)}L${f(x)} ${f(y - r * 0.6)}L${f(x + r * 0.6)} ${f(y)}L${f(x)} ${f(y + r * 0.6)}Z" fill="${dk}" opacity=".45"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.28)}" fill="#fff"/>`
  return (
    k.draw([{
      d: body, fill: P.gold,
      inner:
        k.sh(body, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M${x0} ${f(yb - h)}H${f(x0 + w * 0.22)}V${f(yb + 2)}H${x0}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
        [0.17, 0.42, 0.58, 0.83].map((t) => hair(x0 + t * w, yb - band - 0.4, x0 + t * w + (t < 0.5 ? 1 : -1), yb - band - 2, x0 + t * w, yb - band - 4, 0.35, P.goldD)).join(''),
    }], 0.6) +
    k.draw([{ d: bandD, fill: P.gold, inner: k.sh(bandD, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M${x0} ${f(yb - band + 1.2)}Q${cx} ${f(yb - band + 2.8)} ${x1} ${f(yb - band + 1.2)}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` }], 0.45) +
    tips.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y - 0.6)}" r="${f(h * 0.075)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - 0.3)}" cy="${f(y - 0.9)}" r=".3" fill="#fff"/>`).join('') +
    gem(cx, yb - band * 0.45 + 0.6, band * 0.32, P.red, P.wine) + gem(x0 + w * 0.27, yb - band * 0.45 + 0.4, band * 0.24, P.mid, P.night) + gem(x0 + w * 0.73, yb - band * 0.45 + 0.4, band * 0.24, P.mid, P.night)
  )
}

/** Perro sentado de perfil mirando a la izquierda, con la pata de adelante apoyada en (0,0). */
function dog(k: Kit) {
  const body =
    'M0 0V-6C-.4 -8.6 .2 -10.4 1 -11.4C0 -11.6 -2 -11.8 -3.4 -12C-4.6 -12.2 -5 -13.4 -4.2 -14C-3 -14.8 -1.4 -15.4 .2 -16C1.4 -16.8 3 -16.8 4 -15.8' +
    'C5 -14.8 5.2 -13 4.8 -11.6C6.2 -10 7.6 -7.6 8.4 -5C10.6 -4.6 11.8 -2.4 11.2 0Z'
  const ear = 'M2.4 -15.6C4 -15.4 5 -14 4.8 -12C4.6 -10.6 4 -9.6 3.2 -9.4C2.4 -10.6 2 -13.4 2.4 -15.6Z'
  const patch = 'M6 -8.4C8 -8 9.8 -6.4 10.2 -4.4C9.4 -2.8 7.4 -2.6 6 -3.8C5 -5 5 -7.4 6 -8.4Z'
  const tail = taper(10.6, -0.6, 13.6, -0.4, 14.8, -3.6, 1.6, 0.5)
  return (
    k.draw([{ d: tail, fill: P.white, inner: k.sh(tail, 0, 0, 1, 1, 0, 0.6, OCRE_D, 0.3) }], 0.4) +
    k.draw([{
      d: body, fill: P.white,
      inner:
        `<path d="${patch}" fill="${OCRE}"/>` + k.sh(body, 0, 0, 1, 1, 0, 0.5, OCRE_D, 0.3) + k.sh(body, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) +
        hair(6, -5, 6.6, -2.4, 6, 0, 0.45, OCRE_D) + hair(1.4, -6, 1.8, -3, 1.4, 0, 0.4, P.blue) + hair(-0.4, -14.4, 1, -14, 2, -13.4, 0.3, P.blue),
    }], 0.45) +
    k.draw([{ d: ear, fill: OCRE_D, inner: k.sh(ear, 0, 0, 1, 1, 0, 0.6, P.night, 0.4) }], 0.3) +
    `<path d="M.6 -11.2C1.6 -10.4 3.6 -10.4 4.8 -11.2" fill="none" stroke="${P.red}" stroke-width="1"/><circle cx="2.6" cy="-10.2" r=".55" fill="${P.gold}" stroke="${P.ink}" stroke-width=".2"/>` +
    `<ellipse cx="-.7" cy="-14.1" rx=".6" ry=".5" fill="${P.ink}"/><circle cx="-.9" cy="-14.3" r=".18" fill="#fff"/>` + hair(-1.8, -14.9, -0.8, -15.3, 0.4, -14.9, 0.3, P.blue) +
    `<circle cx="-4.4" cy="-13.3" r=".55" fill="${P.ink}"/><path d="M-3.4 -12.1Q-2.4 -11.7 -1.2 -11.9" fill="none" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

/** Espiga de trigo: el tallo hasta (x,y-h) y los granos de a pares. */
function wheat(x: number, y: number, h: number, lean: number) {
  const tx = x + lean, ty = y - h
  let grains = ''
  for (let i = 0; i < 5; i++) {
    const t = 0.72 + i * 0.065, gx = x + lean * t * t, gy = y - h * t
    for (const s of [-1, 1]) grains += `<ellipse cx="${f(gx + s * 0.9)}" cy="${f(gy)}" rx=".75" ry="1.4" transform="rotate(${f(s * 28 + lean * 2)} ${f(gx + s * 0.9)} ${f(gy)})" fill="${P.gold}" stroke="${OCRE_D}" stroke-width=".3"/>`
  }
  return hair(x, y, x + lean * 0.3, y - h * 0.5, tx, ty, 0.6, OCRE_D) + grains + hair(tx, ty, tx + lean * 0.1, ty - 2, tx + lean * 0.2, ty - 4, 0.25, OCRE_D)
}

/** Cruz paté (de brazos que se abren) centrada en (x,y) con radio r. */
const pattee = (x: number, y: number, r: number) => {
  const a = r * 0.22, b = r * 0.62
  return `M${f(x - a)} ${f(y - a)}L${f(x - b)} ${f(y - r)}H${f(x + b)}L${f(x + a)} ${f(y - a)}L${f(x + r)} ${f(y - b)}V${f(y + b)}L${f(x + a)} ${f(y + a)}L${f(x + b)} ${f(y + r)}H${f(x - b)}L${f(x - a)} ${f(y + a)}L${f(x - r)} ${f(y + b)}V${f(y - b)}Z`
}

export const CARCASSONNE_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Urbanista ──────────────────────────────────────────────────────

  // Treinta puntos de ciudad: el pueblito con su muralla, la torrecita y el perro sentado en la puerta.
  'Pueblo medieval': (u) => {
    const k = kit(u)
    const wall = battlement(29, 91, 62, 87, 4.2, 3.6)
    const gate = 'M53 87V75.6A7 7 0 0 1 67 75.6V87Z'
    const ground = 'M10 112V89C28 85 44 84.2 60 84.2C76 84.2 92 85 110 89V112Z'
    const house = 'M69 62V53.6H83V62Z', houseRoof = 'M67.4 54.2L76 45.4L84.6 54.2Z'
    return (
      fondo(k) +
      arena(k, 60, 62, 33) +
      k.draw([
        { d: house, fill: P.white, inner: k.sh(house, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + `<rect x="72.4" y="56" width="2" height="3" fill="${P.night}"/><rect x="77.6" y="56" width="2" height="3" fill="${P.night}"/>` },
        { d: houseRoof, fill: P.red, inner: k.sh(houseRoof, 0, 0, 1, 0, 0, 0.9, P.wine, 0.5) + hair(70, 53, 74, 50, 76, 46.6, 0.35, P.wine) + hair(79, 53, 78, 50, 76.6, 47, 0.35, P.wine) },
      ], 0.5) +
      k.draw([{
        d: wall, fill: OCRE,
        inner:
          k.sh(wall, 0, 0, 1, 0, 0, 0.6, OCRE_D, 0.4) + k.sh('M28 70H92V88H28Z', 0, 0, 0, 1, 0, 0.6, OCRE_D, 0.35) + courses(29, 62, 91, 88, 2.8, 5.2) +
          `<path d="M29 62H91V63.6H29Z" fill="${OCRE_D}" opacity=".5"/>`,
      }], 0.7) +
      `<path d="${gate}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
      k.clip(gate, `<path d="M52 72H68V77H52Z" fill="${OCRE_D}"/>` + [55, 57.8, 60.6, 63.4, 66.2].map((x) => `<path d="M${x} 68V77.6" stroke="${P.gold}" stroke-width=".55"/>`).join('') + `<path d="M52 74.4H68M52 77H68" stroke="${P.gold}" stroke-width=".5"/>` + [55, 57.8, 60.6, 63.4, 66.2].map((x) => `<path d="M${x - 0.5} 77.6L${x} 79.2L${x + 0.5} 77.6Z" fill="${P.gold}"/>`).join('')) +
      `<path d="M52 75.6A8 8 0 0 1 68 75.6" fill="none" stroke="${OCRE_L}" stroke-width="1.6"/><path d="M52 75.6A8 8 0 0 1 68 75.6" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      `<g transform="translate(60 67.4)"><path d="M-2.4 -2.2H2.4V.6C2.4 2 1.2 3 0 3.6C-1.2 3 -2.4 2 -2.4 .6Z" fill="${P.mid}" stroke="${P.ink}" stroke-width=".4"/><path d="M-2.4 -.4L2.4 .8" stroke="#fff" stroke-width=".7"/></g>` +
      tower(k, 42, 87, 13, 36, 15, P.red, P.wine) +
      pennant(42, 36, 7.4) +
      k.draw([{ d: ground, fill: P.green, inner: k.sh(ground, 0, 0, 0, 1, 0, 0.8, P.greenD, 0.45) + hair(30, 92, 34, 90.6, 38, 91, 0.4, P.greenD) + hair(80, 92, 84, 90.6, 88, 91.4, 0.4, P.greenD) + hair(50, 90, 56, 88.6, 62, 89, 0.4, P.greenD) }], 0.55) +
      k.floor(76, 89.4, 9, 1.6, P.greenD) +
      `<g transform="translate(68.4 89)">` + dog(k) + `</g>` +
      sparkle(84, 38, 2.2) + sparkle(30, 50, 1.6) +
      k.defs()
    )
  },

  // Cincuenta puntos de ciudad: la Cité entera, con sus dos murallas y las torres de techo de pizarra.
  'Ciudad amurallada': (u) => {
    const k = kit(u)
    const keep = battlement(53, 67, 35, 62, 3, 3)
    const inner = battlement(33, 87, 59, 75, 3.4, 2.8)
    const outer = battlement(28, 92, 73, 91, 3.2, 2.6)
    const arch = 'M56.4 91V83.4A3.6 3.6 0 0 1 63.6 83.4V91Z'
    const hill = 'M8 112V93C26 89.6 44 88.6 60 88.6C76 88.6 94 89.6 112 93V112Z'
    const wallPiece = (d: string, x0: number, y0: number, x1: number, y1: number) => ({
      d, fill: OCRE,
      inner: k.sh(d, 0, 0, 1, 0, 0, 0.7, OCRE_D, 0.4) + k.sh(`M${x0} ${y0}H${x1}V${y1}H${x0}Z`, 0, 0, 0, 1, 0, 0.5, OCRE_D, 0.3) + courses(x0, y0, x1, y1, 2.4, 4.6) + `<path d="M${x0} ${y0}H${x1}V${f(y0 + 1.2)}H${x0}Z" fill="${OCRE_D}" opacity=".45"/>`,
    })
    return (
      fondo(k) +
      k.sun(60, 50, 13, 47, 28, false) +
      k.shade(ellipse(60, 50, 24, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      pennant(60, 32.6, 9) +
      k.draw([wallPiece(keep, 53, 35, 67, 62)], 0.6) +
      `<path d="M58.8 46V43.4A1.2 1.2 0 0 1 61.2 43.4V46Z" fill="${P.night}"/><rect x="55.4" y="51" width=".9" height="2.6" fill="${P.night}"/><rect x="63.8" y="51" width=".9" height="2.6" fill="${P.night}"/>` +
      k.draw([wallPiece(inner, 33, 59, 87, 75)], 0.6) +
      tower(k, 38.4, 75, 8.4, 22, 11) + tower(k, 81.6, 75, 8.4, 22, 11) +
      k.draw([wallPiece(outer, 28, 73, 92, 91)], 0.65) +
      tower(k, 31.4, 91, 8.4, 25, 11.4) + tower(k, 88.6, 91, 8.4, 25, 11.4) +
      tower(k, 51.8, 91, 8.8, 27, 13) + tower(k, 68.2, 91, 8.8, 27, 13) +
      `<path d="${arch}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` + k.clip(arch, [57.6, 59.4, 61.2, 63].map((x) => `<path d="M${x} 79V87" stroke="${P.gold}" stroke-width=".45"/>`).join('') + `<path d="M56 84.6H64M56 86.6H64" stroke="${P.gold}" stroke-width=".4"/>`) +
      k.draw([{ d: hill, fill: P.green, inner: k.sh(hill, 0, 0, 0, 1, 0, 0.8, P.greenD, 0.45) + hair(24, 95, 30, 93, 36, 93.4, 0.4, P.greenD) + hair(84, 93.4, 90, 93, 96, 95, 0.4, P.greenD) + hair(52, 94, 60, 93, 68, 94, 0.4, P.greenD) }], 0.55) +
      sparkle(88, 34, 2.2, '#fff') + sparkle(32, 40, 1.6) +
      k.defs()
    )
  },

  // Setenta y cinco puntos: el torreón del rey con la corona puesta, y el foso con su cocodrilo de guardia.
  'Rey del castillo': (u) => {
    const k = kit(u)
    const body = 'M44 52.4H76V87H44Z'
    const mach = 'M41.4 46.8H78.6V52.8H41.4Z'
    const top = battlement(41.4, 78.6, 43.2, 47.2, 4.2, 3.8)
    const door = 'M53.4 87V79A6.6 6.6 0 0 1 66.6 79V87Z'
    const moat = 'M6 86C30 87.2 90 87.2 114 86V112H6Z'
    const corbels = Array.from({ length: 9 }, (_, i) => { const x = 42.6 + i * 4.2; return `M${f(x)} 52.8V51A1.6 1.6 0 0 1 ${f(x + 3.2)} 51V52.8Z` }).join('')
    const banner = (x: number) => {
      const d = `M${x} 53.4H${x + 7}V67L${x + 3.5} 64.2L${x} 67Z`
      return k.draw([{ d, fill: P.mid, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M${x} 59.6L${x + 3.5} 56.6L${x + 7} 59.6V61.6L${x + 3.5} 58.6L${x} 61.6Z" fill="${P.white}"/>` + `<path d="M${x + 0.8} 54.4V65.6" stroke="${P.sky}" stroke-width=".4"/>` }], 0.45) +
        `<path d="M${x - 0.6} 53.4H${x + 7.6}" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="M${x - 0.6} 53.4H${x + 7.6}" stroke="${P.gold}" stroke-width=".5" stroke-linecap="round"/>`
    }
    const snout = 'M-13 0C-12.4 -2.6 -8 -4 -2 -3.6C4 -3.2 10 -2.6 13.2 -1.6C14.8 -1 14.8 0 13.8 .2Z'
    const brow = 'M-9.6 -2.8C-9.8 -6.2 -5 -7 -3.6 -3.4Z'
    const nose = 'M10 -2.6C10.4 -4.2 12.6 -4.2 13 -2.4Z'
    const back = 'M-24 .4C-22 -1.4 -18 -1.8 -14 -.6Z'
    const teeth = Array.from({ length: 6 }, (_, i) => { const x = -1 + i * 2.3; return `M${f(x)} ${f(-0.4 - i * 0.05)}L${f(x + 0.6)} ${f(1.2)}L${f(x + 1.2)} ${f(-0.4 - i * 0.05)}Z` }).join('')
    return (
      fondo(k) +
      k.sun(60, 56, 15, 48, 28, false) +
      k.shade(ellipse(60, 50, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(42, 90, 29, 78, 30, 50, 7) + laurel(78, 90, 91, 78, 90, 50, 7, true) +
      k.cast([body, mach], 2.4, 2.2, OCRE_D) +
      k.draw([
        {
          d: body, fill: OCRE,
          inner:
            k.sh(body, 0, 0, 1, 0, 0, 0.9, OCRE_D, 0.45) + `<path d="M44 52H50V88H44Z" fill="${k.lin(OCRE_L, 0, 0, 1, 0, 0.6, 0)}"/>` + courses(44, 52.8, 76, 88, 2.8, 5.4) +
            k.sh('M44 79H76V88H44Z', 0, 0, 0, 1, 0, 0.6, OCRE_D, 0.35) + `<path d="M44 69.4H76V70.8H44Z" fill="${OCRE_L}" opacity=".7"/><path d="M44 70.8H76" stroke="${OCRE_D}" stroke-width=".4"/>`,
        },
        { d: top, fill: OCRE, inner: k.sh(top, 0, 0, 1, 0, 0, 0.9, OCRE_D, 0.45) + `<path d="M41.4 39H78.6V40.6H41.4Z" fill="${OCRE_L}"/>` },
        { d: mach, fill: OCRE, inner: k.sh(mach, 0, 0, 1, 0, 0, 0.9, OCRE_D, 0.45) + `<path d="${corbels}" fill="${P.night}" opacity=".85"/>` + `<path d="M41.4 47.4H78.6" stroke="${OCRE_L}" stroke-width=".6"/>` },
      ], 0.75) +
      banner(46.6) + banner(66.4) +
      `<path d="M58.6 64V59.6A1.4 1.4 0 0 1 61.4 59.6V64Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/><rect x="59.5" y="72.6" width="1" height="3" rx=".4" fill="${P.night}"/>` +
      `<path d="${door}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
      k.clip(door, [55.2, 57.6, 60, 62.4, 64.8].map((x) => `<path d="M${x} 72V83.4" stroke="${P.gold}" stroke-width=".55"/>`).join('') + `<path d="M52 77.6H68M52 80.4H68M52 83.2H68" stroke="${P.gold}" stroke-width=".5"/>` + [55.2, 57.6, 60, 62.4, 64.8].map((x) => `<path d="M${x - 0.5} 83.4L${x} 85L${x + 0.5} 83.4Z" fill="${P.gold}"/>`).join('')) +
      `<path d="M52.4 79A7.6 7.6 0 0 1 67.6 79" fill="none" stroke="${OCRE_L}" stroke-width="1.4"/><path d="M52.4 79A7.6 7.6 0 0 1 67.6 79" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      crown(k, 45, 75, 41.4, 15.4) +
      k.draw([{ d: moat, fill: P.sky, inner: k.sh(moat, 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) + `<g transform="matrix(1 0 0 -.35 0 117.4)" opacity=".22"><path d="${body}" fill="${OCRE_D}"/></g>` + hair(66, 90.4, 72, 89.8, 78, 90.4, 0.5, '#fff') + hair(44, 97, 52, 96.4, 60, 97.2, 0.45, '#fff') + hair(62, 98, 68, 97.4, 74, 98.2, 0.4, '#fff') }], 0.6) +
      `<g transform="translate(51.6 94) scale(1.34)">` +
      hair(-16, 0.4, -18, 0.8, -20, 1.4, 0.4, P.white) + hair(-15, 1.6, 0, 2.2, 15.6, 1.4, 0.45, P.white) +
      k.draw([
        { d: back, fill: P.greenD },
        { d: snout, fill: P.green, inner: k.sh(snout, 0, 0, 0, 1, 0, 0.9, P.greenD, 0.5) + hair(-6, -3.2, 2, -3.4, 10, -2.4, 0.3, P.greenD) + [-1, 2, 5, 8].map((x) => `<circle cx="${x}" cy="-2.4" r=".3" fill="${P.greenD}"/>`).join('') },
        { d: brow, fill: P.green, inner: k.sh(brow, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.45) + hair(-8.6, -4.6, -7, -6, -5, -5.4, 0.25, P.greenD) },
        { d: nose, fill: P.green },
      ], 0.4) +
      `<path d="${teeth}" fill="${P.white}" stroke="${P.ink}" stroke-width=".22"/>` +
      `<ellipse cx="-6.4" cy="-4" rx="1.3" ry=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><path d="M-6.4 -4.7V-3.3" stroke="${P.ink}" stroke-width=".4" stroke-linecap="round"/>` +
      `<circle cx="11" cy="-3.2" r=".28" fill="${P.ink}"/><circle cx="12.2" cy="-3.1" r=".28" fill="${P.ink}"/>` +
      `</g>` +
      sparkle(86, 34, 2.4, '#fff') + sparkle(34, 42, 1.8) + sparkle(88, 72, 1.4) +
      k.defs()
    )
  },

  // ── Granjero ───────────────────────────────────────────────────────

  // Nueve puntos de campo: el peón de madera tirado panza arriba en el pasto, con el sombrero de paja en la cara.
  'Peón acostado': (u) => {
    const k = kit(u)
    const ground = 'M6 112V77C28 72.6 92 72.6 114 77V112Z'
    const brim = ellipse(0, 0, 11.6, 3.2)
    const hatTop = 'M-6.2 -.8C-6.6 -6 -4.6 -9.2 0 -9.2C4.6 -9.2 6.6 -6 6.2 -.8C2 .4 -2 .4 -6.2 -.8Z'
    const hatBand = 'M-6.4 -2.4C-2 -1.2 2 -1.2 6.4 -2.4L6.2 -.8C2 .4 -2 .4 -6.2 -.8Z'
    const weave = (d: string) => k.clip(d, Array.from({ length: 9 }, (_, i) => `<path d="M${-12 + i * 3} -10L${-8 + i * 3} 4" stroke="${OCRE_D}" stroke-width=".3" opacity=".6"/><path d="M${-8 + i * 3} -10L${-12 + i * 3} 4" stroke="${OCRE}" stroke-width=".3" opacity=".6"/>`).join(''))
    return (
      fondo(k) +
      arena(k, 60, 60, 33) +
      k.sun(79.6, 40.4, 4.6, 10, 16, false) + `<circle cx="79.6" cy="40.4" r="4.2" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".5"/>` +
      wheat(28, 78, 24, -2) + wheat(32, 78, 28, 1) + wheat(36.4, 78, 21, 3) + wheat(84, 78, 22, -3) + wheat(88, 78, 27, -1) + wheat(92, 78, 20, 2) +
      k.draw([{ d: ground, fill: P.green, inner: k.sh(ground, 0, 0, 0, 1, 0, 0.85, P.greenD, 0.45) + [[22, 84], [40, 92], [70, 90], [88, 84], [56, 96], [30, 96]].map(([x, y]) => hair(x, y, x + 1, y - 2.6, x + 2.4, y - 4.4, 0.45, P.greenD) + hair(x + 2, y, x + 2.4, y - 2.4, x + 4, y - 3.6, 0.4, P.greenD)).join('') }], 0.55) +
      k.floor(60, 85.4, 26, 2.6, P.greenD) +
      chessPiece(k, PAWN, 62.6, 71, 2.3, OCRE, { rot: -92, shade: OCRE_D, rings: [-0.6, 4.6] }) +
      `<g transform="translate(62.6 71) rotate(-92) scale(2.3)">` +
      hair(-1.6, 6.6, -2, 2, -1.4, -2.4, 0.22, OCRE_D) + hair(1.8, 6.6, 2.4, 3, 1.8, -.4, 0.2, OCRE_D) + hair(4, 7, 4.4, 5.6, 4.2, 5, 0.18, OCRE_D) +
      `</g>` +
      `<g transform="translate(37.6 63.8) rotate(-52) scale(.92)">` +
      k.draw([
        { d: brim, fill: STRAW, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.8, OCRE_D, 0.4) + weave(brim) },
        { d: hatTop, fill: STRAW, inner: k.sh(hatTop, 0, 0, 1, 0, 0, 0.85, OCRE_D, 0.45) + weave(hatTop) + `<path d="M-1.6 -9C-3.6 -7 -3.8 -4 -3.4 -2" fill="none" stroke="${OCRE_D}" stroke-width=".45"/>` },
      ], 0.5) +
      k.draw([{ d: hatBand, fill: P.red, inner: k.sh(hatBand, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.3) +
      `</g>` +
      `<text x="42" y="54" ${GEORGIA} font-style="italic" font-size="4.4" fill="${P.ink}">z</text>` +
      `<text x="46.4" y="47.6" ${GEORGIA} font-style="italic" font-size="5.6" fill="${P.ink}">z</text>` +
      `<text x="51.6" y="40" ${GEORGIA} font-style="italic" font-size="7" fill="${P.ink}">z</text>` +
      sparkle(86, 40, 2) +
      k.defs()
    )
  },

  // Dieciocho puntos de campo: la tranquera de la estancia, con la marca en el arco, y los potreros hasta el horizonte.
  'Terrateniente': (u) => {
    const k = kit(u)
    const ground = 'M4 56.6H116V112H4Z'
    const vx = 60, vy = 49.6
    const xs = [-90, -40, -6, 22, 46, 74, 98, 126, 160, 210]
    const fills = [P.green, STRAW, P.greenD, OCRE_L, P.green, STRAW, P.greenD, OCRE_L, P.green]
    const strips = xs.slice(0, -1).map((x, i) => `<path d="M${vx} ${vy}L${x} 112H${xs[i + 1]}Z" fill="${fills[i]}"/>`).join('')
    const furrows = Array.from({ length: 34 }, (_, i) => `<path d="M${vx} ${vy}L${-120 + i * 10} 112" stroke="${OCRE_D}" stroke-width=".25" opacity=".45"/>`).join('')
    const post = (x: number) => {
      const d = `M${x} 86.4V43.4L${x + 3} 40.4L${x + 6} 43.4V86.4Z`
      return k.draw([{ d, fill: OCRE, inner: k.sh(d, 0, 0, 1, 0, 0, 0.95, OCRE_D, 0.5) + `<path d="M${x} 44H${x + 1.8}V87H${x}Z" fill="${OCRE_L}" opacity=".6"/>` + hair(x + 2.4, 48, x + 2, 62, x + 2.6, 80, 0.35, OCRE_D) + hair(x + 4.2, 52, x + 4.6, 66, x + 4, 84, 0.3, OCRE_D) + `<path d="M${x} 43.4H${x + 6}" stroke="${OCRE_D}" stroke-width=".5"/>` }], 0.65)
    }
    const rail = (d: string) => rod(d, OCRE, 1.8, OCRE_L)
    const scroll = (x: number, y: number, s: number) => `<path d="M${x} ${y}c${2 * s} -1 ${3.6 * s} .6 ${3 * s} 2.2c${-0.4 * s} 1.2 ${-1.8 * s} 1 ${-1.6 * s} 0" fill="none" stroke="${P.night}" stroke-width=".6" stroke-linecap="round"/>`
    return (
      fondo(k) +
      k.sun(60, 54, 10, 44, 28, false) +
      k.shade(ellipse(60, 52, 18, 12), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.draw([{ d: ground, fill: P.green, inner: strips + furrows + k.sh(ground, 0, 0, 0, 1, 0.6, 0, P.paper, 0.4) + k.sh(ground, 0, 0, 0, 1, 0, 0.5, P.greenD, 0.35) }], 0.5) +
      [24, 27.4, 30.4, 89.6, 92.6, 96].map((x, i) => `<path d="M${x} 57C${x - 1.4} 54 ${x - 1} ${51 - (i % 2) * 2} ${x} ${49.6 - (i % 2) * 2}C${x + 1} ${51 - (i % 2) * 2} ${x + 1.4} 54 ${x} 57Z" fill="${P.greenD}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      // El arco de hierro con la marca.
      rod('M35 42C36 26 84 26 85 42', P.night, 1.1) + rod('M37.6 42.6C38.8 31.4 81.2 31.4 82.4 42.6', P.night, 0.8) +
      scroll(42, 35, 1) + scroll(48, 31.6, 1) + scroll(78, 35, -1) + scroll(72, 31.6, -1) +
      `<circle cx="60" cy="29.4" r="5.4" fill="${P.paper}" stroke="${P.ink}" stroke-width="1.2"/><circle cx="60" cy="29.4" r="4.4" fill="none" stroke="${OCRE_D}" stroke-width=".4"/>` +
      `<path d="M57 28V33M63 28V33M57 30.4H63M56.6 27.4L60 25L63.4 27.4" fill="none" stroke="${P.night}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>` +
      // La tranquera: dos hojas de listones con su diagonal.
      k.floor(60, 87.4, 30, 2.4, P.greenD) +
      rail('M37.4 56H58.6') + rail('M37.4 63.6H58.6') + rail('M37.4 71.2H58.6') + rail('M37.4 78.8H58.6') + rail('M38.4 79.6L57.8 56.6') +
      rail('M61.4 56H82.6') + rail('M61.4 63.6H82.6') + rail('M61.4 71.2H82.6') + rail('M61.4 78.8H82.6') + rail('M62.2 56.6L81.6 79.6') +
      rail('M58.6 54.6V81.4') + rail('M61.4 54.6V81.4') +
      `<path d="M57 66.6H63" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M57 66.6H63" stroke="${P.sky2}" stroke-width=".7" stroke-linecap="round"/>` +
      post(32) + post(82) +
      [[38, 57.4], [38, 77.4], [82, 57.4], [82, 77.4]].map(([x, y]) => `<rect x="${x - 1.6}" y="${y}" width="3.2" height="2.4" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      sparkle(88, 26, 2) + sparkle(30, 30, 1.6) +
      k.defs()
    )
  },

  // Treinta puntos de granjeros: el toro Hereford, gran campeón de la Rural, con su escarapela y la argolla de oro.
  'Sociedad Rural': (u) => {
    const k = kit(u)
    const neck = 'M20 112C22 92 34 79 47.4 74H72.6C86 79 98 92 100 112Z'
    const brisket = 'M50 84C54 90 66 90 70 84L73 112H47Z'
    const head = 'M44 42C44 37 50 35 60 35C70 35 76 37 76 42C77 49 75.4 56 73 63C71.6 68 72.4 74 71.4 79C70 85.6 65.6 89 60 89C54.4 89 50 85.6 48.6 79C47.6 74 48.4 68 47 63C44.6 56 43 49 44 42Z'
    const blaze = 'M43 39C46 36 52 34.6 60 34.6C68 34.6 74 36 77 39C75 45.6 69.4 50.6 67.6 56.6C66.2 62 67.6 68.6 69.4 76H50.6C52.4 68.6 53.8 62 52.4 56.6C50.6 50.6 45 45.6 43 39Z'
    const earL = 'M46.4 46.6C40.4 43.2 32.4 44 28.2 48.4C32.4 51.8 40.4 52.6 46.6 50.6Z', earInL = 'M43.8 47.8C39.2 46.2 34.4 46.8 31.4 48.6C34.8 50.2 39.8 50.4 43.8 49.6Z'
    const earR = 'M73.6 46.6C79.6 43.2 87.6 44 91.8 48.4C87.6 51.8 79.6 52.6 73.4 50.6Z', earInR = 'M76.2 47.8C80.8 46.2 85.6 46.8 88.6 48.6C85.2 50.2 80.2 50.4 76.2 49.6Z'
    const hornL = taper(48.4, 41.4, 40.4, 41, 36.6, 33.8, 4.4, 1.2), hornR = taper(71.6, 41.4, 79.6, 41, 83.4, 33.8, 4.4, 1.2)
    const tuft = 'M48.4 40.6C47.8 35.2 53 31.2 60 31.4C67 31.2 72.2 35.2 71.6 40.6C66 38.4 54 38.4 48.4 40.6Z'
    const muzzle = 'M50.8 79.4C50.8 75.2 55 73.4 60 73.4C65 73.4 69.2 75.2 69.2 79.4C69.2 85.2 65.4 89.6 60 89.6C54.6 89.6 50.8 85.2 50.8 79.4Z'
    const eye = (x: number, s: number) =>
      `<path d="M${f(x - 2.3 * s)} 55.8C${f(x - 1)} 54 ${f(x + 1)} 54 ${f(x + 2.3 * s)} 55C${f(x + 1)} 56.8 ${f(x - 1)} 57 ${f(x - 2.3 * s)} 55.8Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="${f(x - 0.6 * s)}" cy="55.1" r=".45" fill="#fff"/>` + hair(x - 2.8 * s, 54.6, x, 52.6, x + 2.8 * s, 54, 0.55, P.night) + hair(x - 2 * s, 57.6, x, 58.4, x + 2 * s, 57.4, 0.3, OCRE_D)
    const curls = [[52, 35.8], [56, 34.2], [60, 33.8], [64, 34.2], [68, 35.8], [54, 38.2], [58, 36.8], [62, 36.8], [66, 38.2]].map(([x, y]) => `<path d="M${x - 1.4} ${y + 0.4}C${x - 1.4} ${y - 1.2} ${x + 1.2} ${y - 1.4} ${x + 1.2} ${y}C${x + 1.2} ${y + 0.8} ${x} ${y + 1} ${x - 0.2} ${y + 0.2}" fill="none" stroke="${P.blue}" stroke-width=".4"/>`).join('')
    const hairRed = (x0: number, y0: number, x1: number, y1: number) => hair(x0, y0, (x0 + x1) / 2 + 0.6, (y0 + y1) / 2, x1, y1, 0.4, OCRE_D)
    const rosette = starPath(0, 0, 7.4, 5.8, 18)
    return (
      fondo(k) +
      k.sun(60, 50, 16, 48, 28, false) +
      k.shade(ellipse(60, 50, 26, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      k.draw([
        { d: neck, fill: OCRE, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.9, OCRE_D, 0.5) + hair(30, 96, 34, 86, 42, 80, 0.5, OCRE_D) + hair(90, 96, 86, 86, 78, 80, 0.5, OCRE_D) + hair(26, 104, 30, 96, 36, 90, 0.45, OCRE_D) + hair(94, 104, 90, 96, 84, 90, 0.45, OCRE_D) },
        { d: brisket, fill: P.white, inner: k.sh(brisket, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) + hair(54, 92, 55, 98, 54, 104, 0.4, P.blue) + hair(64, 92, 65, 98, 66, 104, 0.4, P.blue) },
      ], 0.7) +
      `<g transform="matrix(1 0 0 .93 0 2.5)">` +
      k.draw([
        { d: hornL, fill: P.paper, inner: k.sh(hornL, 1, 1, 0, 0, 0, 0.9, OCRE_D, 0.45) + hair(46.4, 40, 41.4, 39.4, 38.8, 35.8, 0.35, OCRE_D) },
        { d: hornR, fill: P.paper, inner: k.sh(hornR, 0, 1, 1, 0, 0, 0.9, OCRE_D, 0.45) + hair(73.6, 40, 78.6, 39.4, 81.2, 35.8, 0.35, OCRE_D) },
        { d: earL, fill: OCRE, inner: `<path d="${earInL}" fill="${P.skin}"/>` + k.sh(earL, 0, 0, 1, 1, 0, 0.8, OCRE_D, 0.45) },
        { d: earR, fill: OCRE, inner: `<path d="${earInR}" fill="${P.skin}"/>` + k.sh(earR, 0, 0, 1, 1, 0, 0.9, OCRE_D, 0.5) },
        {
          d: head, fill: OCRE,
          inner:
            k.sh(head, 0, 0, 1, 0, 0, 0.8, OCRE_D, 0.45) + hairRed(46, 46, 47.4, 60) + hairRed(74, 46, 72.6, 60) + hairRed(48.6, 64, 49.6, 74) + hairRed(71.4, 64, 70.4, 74) +
            `<path d="${blaze}" fill="${P.white}"/>` + k.sh(blaze, 0, 0, 1, 0, 0, 0.7, P.sky2, 0.45) + k.sh(blaze, 0, 0, 0, 1, 0, 0.4, P.sky2, 0.3) +
            hair(57, 44, 56.4, 54, 58, 66, 0.4, P.sky2) + hair(63, 44, 63.6, 54, 62, 66, 0.4, P.sky2) + `<path d="M53 42C55 40.6 57 40.2 59 40.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>`,
        },
      ], 0.75) +
      eye(49.4, 1) + eye(70.6, -1) +
      k.draw([{ d: tuft, fill: P.white, inner: k.sh(tuft, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) + curls }], 0.5) +
      k.draw([{ d: muzzle, fill: P.skin, inner: k.sh(muzzle, 0, 0, 1, 1, 0, 0.8, P.brown, 0.4) + `<path d="M53 77C56 75.4 64 75.4 67 77" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` }], 0.55) +
      `<path d="M54.6 79C53.4 80.4 54 82.4 56.2 82.2C57 81.2 56.2 79.8 54.6 79ZM65.4 79C66.6 80.4 66 82.4 63.8 82.2C63 81.2 63.8 79.8 65.4 79Z" fill="${P.night}"/>` +
      `<path d="M55 87C58 88.2 62 88.2 65 87" fill="none" stroke="${P.brown}" stroke-width=".55"/>` +
      // La argolla de oro en la nariz.
      `<path d="${ellipse(60, 86.4, 3.2, 3)}" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="${ellipse(60, 86.4, 3.2, 3)}" fill="none" stroke="${P.gold}" stroke-width="1"/><path d="M57.4 85A3 3 0 0 1 59 83.6" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` +
      `</g>` +
      // La escarapela de gran campeón.
      `<g transform="translate(80.4 77.4) rotate(10)">` +
      k.draw([
        { d: 'M-3.4 3L-6 15.4L-3.6 13.6L-2 16.2L.4 4Z', fill: P.red, inner: k.sh('M-6 3H1V17H-6Z', 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) },
        { d: 'M1 3.6L1.4 16.4L3.2 14.2L5.4 15.6L4.2 2.8Z', fill: P.red, inner: k.sh('M1 3H6V17H1Z', 0, 0, 1, 0, 0, 0.9, P.wine, 0.45) },
        { d: rosette, fill: P.red, inner: k.sh(rosette, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) },
      ], 0.5) +
      `<circle cx="0" cy="0" r="5" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="0" cy="0" r="5" fill="none" stroke="${P.red}" stroke-width=".6" stroke-dasharray=".8 .6"/>` +
      k.draw([{ d: ellipse(0, 0, 3.6, 3.6), fill: P.gold, inner: k.sh(ellipse(0, 0, 3.6, 3.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.35) +
      `<text x="0" y="1.5" ${GEORGIA} font-weight="700" font-size="4" fill="${P.ink}" text-anchor="middle">1º</text>` +
      `</g>` +
      sparkle(88, 32, 2.2, '#fff') + sparkle(30, 66, 1.6) +
      k.defs()
    )
  },

  // ── Señor feudal ───────────────────────────────────────────────────

  // Cien puntos: el escudo del escudero, de cuero ocre con el chevrón azul, apoyado en la lanza con su banderín.
  'Escudero': (u) => {
    const k = kit(u)
    const shield = 'M42 40.4H78V60C78 75 70 85 60 91C50 85 42 75 42 60Z'
    const field = 'M45 43.4H75V60C75 73.4 68.2 81.8 60 87.4C51.8 81.8 45 73.4 45 60Z'
    const chevron = 'M45 70.4L60 51.4L75 70.4V77.4L60 58.4L45 77.4Z'
    const shaft = taper(52.4, 99, 56, 60, 63.4, 27, 2.6, 1.8)
    const head = 'M63.8 17.6C65.4 20.4 66 23.4 65.2 26.4L64.6 28.6H61.8L61.6 26C61.2 23 62 20.2 63.8 17.6Z'
    const flag = 'M63.2 30.4C67 29.4 71.6 30.4 76.4 29.4L73.6 32.8L77.4 35.6C72.4 36.4 67.6 35.4 63 36.6Z'
    return (
      fondo(k) +
      arena(k, 60, 62, 33) +
      k.floor(60, 93, 18, 2.4, OCRE_D) +
      k.draw([{ d: shaft, fill: OCRE, inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.9, OCRE_D, 0.5) + hair(55, 80, 57, 60, 61, 40, 0.3, OCRE_L) }], 0.55) +
      k.draw([{ d: flag, fill: P.white, inner: `<path d="M63 32.6C67.4 31.6 71.8 32.6 75.4 31.8L75.6 33.8C71.6 34.4 67.4 33.6 63 34.6Z" fill="${P.mid}"/>` + k.sh(flag, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.45) +
      k.draw([{ d: head, fill: P.sky1, inner: k.sh(head, 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + `<path d="M63.8 18.6V27.6" stroke="${P.blue}" stroke-width=".35"/>` }], 0.45) +
      `<path d="M61.2 28.6H65.2V30.4H61.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<g transform="rotate(-6 60 64)">` +
      k.cast([shield], 2.4, 2.2, OCRE_D) +
      k.draw([{
        d: shield, fill: OCRE,
        inner:
          k.sh(shield, 0, 0, 1, 1, 0, 0.9, OCRE_D, 0.5) + `<path d="M42 40H48V92H42Z" fill="${k.lin(OCRE_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
          hair(43.6, 46, 43.4, 60, 45, 74, 0.35, OCRE_D) + hair(76.4, 46, 76.6, 60, 75, 74, 0.35, OCRE_D) + hair(50, 41.6, 56, 41.4, 62, 41.8, 0.3, OCRE_D),
      }], 0.8) +
      k.draw([{
        d: field, fill: P.mid,
        inner:
          k.sh(field, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) + `<path d="M45 43H51V88H45Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="${chevron}" fill="${P.white}"/>` + k.sh(chevron, 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) + `<path d="M45 70.4L60 51.4L75 70.4" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
          `<path d="M55 45.6L56.2 48L58.8 48.2L56.8 49.8L57.6 52.4L55 50.8L52.4 52.4L53.2 49.8L51.2 48.2L53.8 48Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".25" transform="translate(-4.4 1)"/>` +
          `<path d="M55 45.6L56.2 48L58.8 48.2L56.8 49.8L57.6 52.4L55 50.8L52.4 52.4L53.2 49.8L51.2 48.2L53.8 48Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".25" transform="translate(14 1)"/>` +
          hair(58, 46, 60, 44.6, 62, 46, 0.3, P.sky) + `<path d="M67 76L70 72M50 61L52 58.4" stroke="${P.sky}" stroke-width=".5" stroke-linecap="round" opacity=".7"/>`,
      }], 0.35) +
      [[44, 42.4], [60, 41.8], [76, 42.4], [43.4, 54], [76.6, 54], [44.6, 68], [75.4, 68], [51, 81.6], [69, 81.6], [60, 89]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      k.draw([{ d: ellipse(60, 64, 4.2, 4.2), fill: P.gold, inner: k.sh(ellipse(60, 64, 4.2, 4.2), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="${starPath(60, 64, 3, 1.4, 8)}" fill="${P.goldL}" opacity=".6"/>` }], 0.45) +
      `<circle cx="58.8" cy="62.8" r=".8" fill="#fff"/>` +
      `<path d="M46.6 46.4C47.4 45.2 48.8 44.6 50.6 44.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` +
      `</g>` +
      sparkle(84, 46, 2.2) + sparkle(34, 74, 1.6) +
      k.defs()
    )
  },

  // Ciento cincuenta puntos: el yelmo del caballero templario, bruñido, sobre el manto blanco con la cruz roja.
  'Caballero templario': (u) => {
    const k = kit(u)
    const mantle = 'M18 112C20 94 32 82.6 46 80.4H74C88 82.6 100 94 102 112Z'
    const helm = 'M43 41C43 33.4 50 29.8 60 29.8C70 29.8 77 33.4 77 41V76.4C77 79.6 71.6 82.4 60 82.4C48.4 82.4 43 79.6 43 76.4Z'
    const slitL = 'M45.4 51.6H57.6V54H45.4Z', slitR = 'M62.4 51.6H74.6V54H62.4Z'
    const crossV = 'M58.4 38.6H61.6V80.6H58.4Z', crossH = 'M44 48.2H76V50.4H44Z'
    const holes = (x: number) => [[0, -4.4], [0, 0], [0, 4.4], [-3.2, 0], [3.2, 0], [0, 8.8]].map(([dx, dy]) => `<circle cx="${f(x + dx)}" cy="${f(64 + dy)}" r=".85" fill="${P.night}"/><circle cx="${f(x + dx + 0.2)}" cy="${f(64 + dy + 0.3)}" r=".85" fill="none" stroke="#fff" stroke-width=".25" opacity=".6"/>`).join('')
    const rivets = (pts: number[][]) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".65" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    return (
      fondo(k) +
      k.sun(60, 54, 15, 48, 28, false) +
      k.shade(ellipse(60, 52, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      k.draw([{
        d: mantle, fill: P.white,
        inner:
          k.sh(mantle, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) +
          hair(36, 92, 32, 100, 30, 110, 0.6, P.blue) + hair(44, 88, 42, 98, 42, 110, 0.5, P.blue) + hair(84, 92, 88, 100, 90, 110, 0.6, P.mid) + hair(76, 88, 78, 98, 78, 110, 0.5, P.mid) +
          `<path d="${pattee(60, 94, 8.4)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/>` + k.sh(pattee(60, 94, 8.4), 0, 0, 1, 1, 0, 0.6, P.wine, 0.4),
      }], 0.7) +
      k.floor(60, 82, 18, 2.4, P.mid) +
      k.draw([{
        d: helm, fill: P.white,
        inner:
          `<path d="${helm}" fill="${k.lin(P.sky1, 0, 0, 1, 0, 0, 1)}"/>` + k.sh('M62 28H80V84H62Z', 0, 0, 1, 0, 0, 0.95, P.mid, 0.5) + k.sh('M40 28H50V84H40Z', 1, 0, 0, 0, 0, 0.45, P.blue, 0.3) +
          `<path d="M46.6 34H50V80H46.6Z" fill="#fff" opacity=".9"/>` + `<path d="M68 36H69V79H68Z" fill="#fff" opacity=".5"/>` +
          `<path d="M43 39.6C48 37.4 72 37.4 77 39.6" fill="none" stroke="${P.mid}" stroke-width=".6"/>` +
          `<path d="M43 74.6C48 77 72 77 77 74.6" fill="none" stroke="${P.mid}" stroke-width=".6"/>` + k.sh('M42 75H78V83H42Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.35) +
          hair(52, 31.6, 56, 30.6, 60, 30.4, 0.6, '#fff'),
      }], 0.8) +
      `<path d="${slitL}" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="${slitR}" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M45.4 54.6H57.6M62.4 54.6H74.6" stroke="#fff" stroke-width=".5"/>` +
      k.draw([
        { d: crossV, fill: P.gold, inner: k.sh(crossV, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M59.2 39V80" stroke="${P.goldL}" stroke-width=".5"/>` },
        { d: crossH, fill: P.gold, inner: k.sh(crossH, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M44 48.8H76" stroke="${P.goldL}" stroke-width=".45"/>` },
      ], 0.4) +
      holes(51.6) + holes(68.4) +
      rivets([[60, 41], [60, 45.6], [60, 58], [60, 64], [60, 70], [60, 76], [46, 49.3], [50.6, 49.3], [69.4, 49.3], [74, 49.3]]) +
      rivets([[45.4, 40.4], [50.8, 39], [69.2, 39], [74.6, 40.4], [45.6, 76.2], [51, 77.4], [69, 77.4], [74.4, 76.2]]) +
      sparkle(48.6, 33.6, 2.6, '#fff') + sparkle(86, 36, 2.2) + sparkle(32, 46, 1.6) +
      k.defs()
    )
  },

  // Doscientos puntos: el trono del señor de los feudos, y a sus pies el diezmo: la bolsa de trigo y las monedas.
  'Señor de los feudos': (u) => {
    const k = kit(u)
    const back = 'M46 70V35.4C46 31.4 50.4 28.4 53.6 27.4L60 20.6L66.4 27.4C69.6 28.4 74 31.4 74 35.4V70Z'
    const velvet = 'M49.6 68V37C49.6 33.6 53.4 31.2 56 30.4L60 26.4L64 30.4C66.6 31.2 70.4 33.6 70.4 37V68Z'
    const postL = 'M40 88V36H45.6V88Z', postR = 'M74.4 88V36H80V88Z'
    const capL = 'M39.2 36.4L42.8 27.4L46.4 36.4Z', capR = 'M73.6 36.4L77.2 27.4L80.8 36.4Z'
    const armL = 'M34.6 64.6C34.6 62.6 36 61.6 38 61.6H46V67.4H38C36 67.4 34.6 66.4 34.6 64.6Z'
    const armR = 'M85.4 64.6C85.4 62.6 84 61.6 82 61.6H74V67.4H82C84 67.4 85.4 66.4 85.4 64.6Z'
    const cushion = 'M44.4 67.4C50 66 70 66 75.6 67.4L77.6 73.4C70 74.6 50 74.6 42.4 73.4Z'
    const apron = 'M42.4 73.4C50 74.6 70 74.6 77.6 73.4V86.4H42.4Z'
    const sack = 'M40.6 91.6C38.6 89.6 39 84.6 41.6 81.8C43.8 79.4 46.6 78.6 48.4 78.2L47.4 76.4C49.6 75.6 52.4 75.6 54.6 76.4L53.6 78.2C55.4 78.6 58.4 79.6 60.4 82C62.6 84.8 62.6 89.6 60.6 91.6C54 93.2 47.2 93.2 40.6 91.6Z'
    const mouth = 'M47.2 76.6C46 74.4 46.4 72.2 48.2 71.4C50 72.2 52.6 72.2 54.4 71.4C56 72.2 56.4 74.4 55.2 76.6C52.6 77.4 49.8 77.4 47.2 76.6Z'
    const coins = [[68, 92.4], [73.4, 92.4], [70.6, 90.4], [70.6, 88.4], [67.4, 90.4], [74.2, 90.4], [70.8, 86.4]]
    const fleurs = Array.from({ length: 12 }, (_, i) => { const x = 52.4 + (i % 3) * 7.6 + (Math.floor(i / 3) % 2) * 3.8, y = 38 + Math.floor(i / 3) * 7.4; return x < 69.6 ? `<path d="M${f(x)} ${f(y - 1.6)}L${f(x + 1.1)} ${f(y)}L${f(x)} ${f(y + 1.6)}L${f(x - 1.1)} ${f(y)}Z" fill="${P.gold}" opacity=".85"/>` : '' }).join('')
    const tracery = [45.4, 56.4, 67.4].map((x) => `<path d="M${x} 85V80.6C${x} 77.6 ${x + 3.6} 76.6 ${x + 3.6} 76.6C${x + 3.6} 76.6 ${x + 7.2} 77.6 ${x + 7.2} 80.6V85" fill="none" stroke="${OCRE_D}" stroke-width=".55"/><circle cx="${f(x + 3.6)}" cy="80.4" r=".9" fill="none" stroke="${OCRE_D}" stroke-width=".4"/>`).join('')
    const wood = (d: string, dark = 0.9) => ({ d, fill: OCRE, inner: k.sh(d, 0, 0, 1, 0, 0, dark, OCRE_D, 0.5) + `<path d="${d}" fill="${k.lin(OCRE_L, 0, 0, 1, 0, 0.5, 0)}"/>` })
    return (
      fondo(k) +
      k.sun(60, 50, 16, 48, 28, false) +
      k.shade(ellipse(60, 48, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      k.floor(60, 89, 26, 3, OCRE_D) +
      k.cast([back, postL, postR], 2.2, 2, OCRE_D) +
      k.draw([
        { d: back, fill: OCRE, inner: k.sh(back, 0, 0, 1, 0, 0, 0.9, OCRE_D, 0.5) + hair(47.4, 66, 47, 50, 48, 38, 0.4, OCRE_D) + hair(72.6, 66, 73, 50, 72, 38, 0.4, OCRE_D) },
        { d: velvet, fill: P.red, inner: k.sh(velvet, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + fleurs + `<path d="M50.6 66V37.6C50.6 35 53 33 55.6 32" fill="none" stroke="#fff" stroke-width=".6" opacity=".4"/>` },
      ], 0.7) +
      `<path d="${velvet}" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      `<circle cx="60" cy="26.8" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="60" cy="20.4" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.draw([wood(postL), wood(postR, 1), { d: capL, fill: P.gold, inner: k.sh(capL, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }, { d: capR, fill: P.gold, inner: k.sh(capR, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.7) +
      [[42.8, 26.6], [77.2, 26.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      [40, 74.4].map((x) => `<path d="M${x} 40H${x + 5.6}M${x} 42H${x + 5.6}M${x} 84H${x + 5.6}" stroke="${OCRE_D}" stroke-width=".5"/>`).join('') +
      k.draw([wood(armL), wood(armR, 1), { d: cushion, fill: P.red, inner: k.sh(cushion, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<path d="M47 68.6C54 67.6 66 67.6 73 68.6" fill="none" stroke="#fff" stroke-width=".7" opacity=".5"/>` }, wood(apron)], 0.7) +
      tracery +
      `<circle cx="36" cy="64.6" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="84" cy="64.6" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      [[43.4, 74.6], [76.6, 74.6]].map(([x, y]) => `<path d="M${x} ${y}L${x - 0.8} ${y + 3.6}H${x + 0.8}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      // El diezmo: la bolsa de trigo y la pila de monedas.
      k.draw([{ d: sack, fill: STRAW, inner: k.sh(sack, 0, 0, 1, 1, 0, 0.9, OCRE_D, 0.5) + `<path d="M38 80H46V94H38Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` + hair(43, 90.6, 42.4, 86, 44.6, 81.4, 0.45, OCRE_D) + hair(57.4, 90.6, 59, 86, 57, 81, 0.45, OCRE_D) + hair(50, 79, 51, 84, 50.4, 91, 0.35, OCRE_D) + `<path d="M39.6 85.4C46 86.6 56 86.6 62 85.4M39.6 88.6C46 89.8 56 89.8 62 88.6" fill="none" stroke="${OCRE}" stroke-width=".35" stroke-dasharray="1 .8"/>` }, { d: mouth, fill: STRAW, inner: k.sh(mouth, 0, 0, 1, 1, 0, 0.8, OCRE_D, 0.45) + [[49, 73], [51.2, 72.6], [53.4, 73], [50, 74.4], [52.4, 74.4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".9" ry=".6" fill="${P.gold}" stroke="${OCRE_D}" stroke-width=".25"/>`).join('') }], 0.55) +
      rod('M47.2 76.8C49.4 77.8 53 77.8 55.2 76.8', P.red, 0.7) + `<path d="M55 77.2L57 80.4M55.4 77L58.4 79" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><path d="M55 77.2L57 80.4M55.4 77L58.4 79" stroke="${P.red}" stroke-width=".4" stroke-linecap="round"/>` +
      wheat(49.6, 73, 9, -2.6) + wheat(51.4, 73, 11, 0.2) + wheat(53, 73, 8.6, 2.6) +
      coins.map(([x, y]) => `<ellipse cx="${x}" cy="${f(y + 0.6)}" rx="2.8" ry="1.2" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="${x}" cy="${y}" rx="1.8" ry=".7" fill="none" stroke="${P.goldD}" stroke-width=".25"/>`).join('') +
      `<g transform="translate(77.6 87) rotate(70)"><ellipse cx="0" cy="0" rx="2.8" ry="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="0" cy="0" rx="1.8" ry=".7" fill="none" stroke="${P.goldD}" stroke-width=".25"/></g>` +
      sparkle(60, 15.6, 2) + sparkle(30, 44, 2) + sparkle(90, 50, 1.6) +
      k.defs()
    )
  },
}
