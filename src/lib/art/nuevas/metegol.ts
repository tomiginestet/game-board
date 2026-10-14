// Metegol: la barra de acero con su mango de goma, el muñequito colgado, la pelotita blanca, la ficha del bar con su
// ranura, y lo que queda cuando ganás en cero (la rodillera gastada, el túnel de lavado, el peaje, la llave del dueño).
// Los muñequitos son tallas de madera sin cara: tronco, cabeza y el pie de patear.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Goma negra del mango: tinta casi negra, para no salir de la paleta. */
const GOMA = '#252A45', GOMA_D = '#10142A'
/** Acero de las barras. */
const STEEL = '#DCE3EE', STEEL_D = '#8C9AB8'

/** Muñequito de metegol de frente, colgado de la barra en (0,0): cabeza arriba, tronco pintado y el pie abajo. */
function player(k: Kit, x: number, y: number, s: number, c: string, cd: string, rot = 0) {
  const body = 'M-3.4 -4.6C-3.4 -6 -2.4 -6.6 0 -6.6C2.4 -6.6 3.4 -6 3.4 -4.6L3 5.6L2.2 11.4H-2.2L-3 5.6Z'
  const head = ellipse(0, -9.2, 2.6, 2.8)
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([
      { d: head, fill: '#F0D9BC', inner: k.sh(head, 0, 0, 1, 1, 0, 0.7, P.brown, 0.4) },
      { d: body, fill: c, inner: k.sh(body, 0, 0, 1, 0, 0, 0.8, cd, 0.45) + `<path d="M-4 -1.4H4" stroke="${P.white}" stroke-width="1.2"/><path d="M-3 6.4H3V12H-3Z" fill="${P.white}"/><path d="M-3 9H3" stroke="${cd}" stroke-width=".4"/>` + `<path d="M-2.6 -5.4C-2.6 -2 -2.4 2 -2 5" fill="none" stroke="#fff" stroke-width=".6" opacity=".7"/>` },
    ], f(0.5 / s)) +
    `</g>`
  )
}

/** Mango de goma con la punta en (x,y), apuntando para `dir` (-1 izquierda, 1 derecha), de largo l. */
function grip(k: Kit, x: number, y: number, dir: number, l = 10, h = 4.2) {
  const x0 = dir > 0 ? x - l : x, x1 = dir > 0 ? x : x + l
  const d = roundRect(x0, y - h / 2, x1, y + h / 2, h / 2)
  const ribs = Array.from({ length: Math.floor(l / 1.6) - 1 }, (_, i) => `M${f(x0 + 2 + i * 1.6)} ${f(y - h / 2)}V${f(y + h / 2)}`).join('')
  return k.draw([{ d, fill: GOMA, inner: `<path d="${ribs}" stroke="${GOMA_D}" stroke-width=".5"/>` + `<path d="M${x0} ${f(y - h / 2 + 0.6)}H${x1}" stroke="${P.mid}" stroke-width=".8"/>` }], 0.45)
}

/** Pelotita de metegol: blanca y lisa, con su brillo y el raspón de tanto uso. */
function pelotita(k: Kit, x: number, y: number, r: number) {
  const d = ellipse(x, y, r, r)
  return k.draw([{
    d, fill: P.white,
    inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.blue, 0.4) + `<path d="${d}" fill="${k.rad('#ffffff', 0.34, 0.3, 0.5, 0.9, 0)}"/>` +
      `<path d="M${f(x + r * 0.1)} ${f(y + r * 0.5)}l${f(r * 0.3)} ${f(-r * 0.12)}M${f(x + r * 0.45)} ${f(y + r * 0.2)}l${f(r * 0.16)} ${f(r * 0.2)}" stroke="${P.sky2}" stroke-width="${f(r * 0.06)}" stroke-linecap="round"/>`,
  }], f(Math.min(0.75, 0.3 + r * 0.05))) +
    `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.42)}" rx="${f(r * 0.24)}" ry="${f(r * 0.13)}" fill="#fff" transform="rotate(-38 ${f(x - r * 0.4)} ${f(y - r * 0.42)})"/>`
}

/** Corona de oro de tres puntas con la base en (0,0). */
function crown(k: Kit) {
  const d = 'M-11 0L-12.6 -12L-6 -6.4L0 -15L6 -6.4L12.6 -12L11 0Z'
  return k.draw([{
    d, fill: P.gold,
    inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-12 -2.6H12" stroke="${P.goldD}" stroke-width=".6"/>` +
      [-6, 0, 6].map((x) => `<circle cx="${x}" cy="-1.4" r="1" fill="${x ? P.sky : P.red}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<path d="M-10.4 -3.6L-11.4 -10M-5 -3.4L-.6 -12.6" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>`,
  }], 0.6) + [[-12.6, -12], [0, -15], [12.6, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`).join('')
}

/** Volutas de fileteado: espiral entintada, dorada y con su brillo. */
function voluta(d: string, c = P.gold) {
  return (
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#fff" stroke-width=".3" stroke-linecap="round" transform="translate(-.3 -.3)" opacity=".85"/>`
  )
}

/** Ficha de bar: moneda de bronce con sus dos ranuras, de radio r, centrada en (0,0). */
function ficha(k: Kit, r: number) {
  const d = ellipse(0, 0, r, r)
  return k.draw([{
    d, fill: P.gold,
    inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="${d}" fill="${k.rad('#ffffff', 0.32, 0.28, 0.5, 0.6, 0)}"/>` +
      `<circle cx="0" cy="0" r="${f(r * 0.8)}" fill="none" stroke="${P.goldD}" stroke-width=".7"/>` +
      `<circle cx="0" cy="0" r="${f(r * 0.86)}" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      [-1, 1].map((s) => `<path d="M${f(-r * 0.56)} ${f(s * r * 0.2)}H${f(r * 0.56)}" stroke="${P.ink}" stroke-width="${f(r * 0.13)}" stroke-linecap="round"/><path d="M${f(-r * 0.5)} ${f(s * r * 0.2 + r * 0.04)}H${f(r * 0.5)}" stroke="${P.goldD}" stroke-width="${f(r * 0.06)}" stroke-linecap="round"/>`).join('') +
      hair(-r * 0.8, -r * 0.2, -r * 0.7, -r * 0.7, -r * 0.2, -r * 0.85, 0.9, '#fff', 0.9),
  }], 0.7)
}

/** Barrera de peaje: el poste con su caja a la izquierda y el brazo a rayas rojas y blancas hacia la derecha. */
function barrier(k: Kit, x: number, y: number, len: number, rot = 0) {
  const arm = roundRect(0, -1.8, len, 1.8, 1.8)
  const box = roundRect(-6, -4, 2, 16, 1.2)
  let stripes = ''
  for (let i = 0; i < len; i += 7) stripes += `M${i + 3.5} -3L${i + 7} -3L${i + 3.5} 3L${i} 3Z`
  return (
    `<g transform="translate(${x} ${y})">` +
    k.draw([{ d: box, fill: P.sky1, inner: k.sh(box, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M-5 0H1" stroke="${P.blue}" stroke-width=".5"/><circle cx="-2" cy="4" r="1.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` }], 0.55) +
    `<g transform="rotate(${rot})">` +
    k.draw([{ d: arm, fill: P.white, inner: `<path d="${stripes}" fill="${P.red}"/>` + k.sh(arm, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) }], 0.5) +
    `<circle cx="0" cy="0" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
    `</g></g>`
  )
}

export const METEGOL_ART: Record<string, (u: number) => string> = {
  // ── Barra de acero ────────────────────────────────────────────────

  // Cinco ganados: la ficha del bar entra en la ranura. La pone el que pierde.
  'Ficha del bar': (u) => {
    const k = kit(u)
    const plate = roundRect(36, 48, 84, 94, 3)
    const slot = roundRect(56.6, 50, 63.4, 66, 1.4)
    const screw = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="1.4" fill="${STEEL}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x - 0.9} ${y}H${x + 0.9}" stroke="${STEEL_D}" stroke-width=".5"/>`
    return (
      k.night() +
      [[30, 30], [92, 32], [40, 20], [80, 20], [26, 70], [94, 70]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 50, 30, 28), k.rad(P.gold, 0.5, 0.5, 0.5, 0.5, 0), P.gold, 0.3) +
      k.cast([plate], 2.4, 2.4, '#0F1736') +
      k.draw([{
        d: plate, fill: P.brown,
        inner: k.sh(plate, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + hair(38, 60, 38.6, 74, 38, 90, 0.5, P.brownD) + hair(82, 56, 82.4, 70, 81.6, 88, 0.5, P.brownD),
      }], 0.7) +
      k.draw([{ d: roundRect(48, 44, 72, 70, 2), fill: STEEL, inner: k.sh(roundRect(48, 44, 72, 70, 2), 0, 0, 1, 1, 0, 0.8, STEEL_D, 0.45) + `<path d="M48 44H56V70H48Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` }], 0.6) +
      `<path d="${slot}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
      screw(50.6, 46.6) + screw(69.4, 46.6) + screw(50.6, 67.4) + screw(69.4, 67.4) +
      `<path d="${roundRect(44, 74, 76, 88, 1.4)}" fill="${P.paper}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<text x="60" y="80" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.ink}" text-anchor="middle">la pone</text>` +
      `<text x="60" y="85.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.6" fill="${P.red}" text-anchor="middle">el que pierde</text>` +
      k.clip('M0 0H120V58H0Z', `<g transform="translate(60 47) rotate(90) scale(.42 1)">` + ficha(k, 13) + `</g>`) +
      `<g transform="translate(60 36)">` + ficha(k, 12) + `</g>` +
      `<path d="M60 50.6V64" stroke="${P.goldD}" stroke-width=".7" stroke-dasharray="1.2 1.2"/>` +
      hair(44, 30, 42, 36, 44, 42, 0.8, P.goldL) + hair(76, 30, 78, 36, 76, 42, 0.8, P.goldL) +
      sparkle(70, 26, 2, P.goldL) +
      k.defs()
    )
  },

  // Veinticinco: la muñeca hace cosas raras. La barra se dobla como goma y el muñequito da la vuelta entera.
  'Muñeca de goma': (u) => {
    const k = kit(u)
    const rod = 'M14 66C24 66 28 52 38 52C48 52 50 72 60 72C70 72 72 54 80 54'
    return (
      k.day() +
      k.sun(60, 56, 16, 46, 32, false) +
      `<circle cx="46" cy="60" r="19" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-dasharray="1.4 1.6"/>` +
      `<path d="M62 50L64.6 57L68 51" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<g opacity=".3">` + player(k, 46, 60, 1.5, P.red, P.wine, 130) + `</g>` +
      `<g opacity=".55">` + player(k, 46, 60, 1.5, P.red, P.wine, 65) + `</g>` +
      `<path d="${rod}" fill="none" stroke="${P.ink}" stroke-width="5" stroke-linecap="round"/><path d="${rod}" fill="none" stroke="${STEEL}" stroke-width="3.2" stroke-linecap="round"/><path d="${rod}" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" transform="translate(-.4 -.8)"/>` +
      `<path d="${rod}" fill="none" stroke="${STEEL_D}" stroke-width=".8" stroke-linecap="round" transform="translate(.5 1)"/>` +
      player(k, 46, 60, 1.6, P.red, P.wine, 0) +
      `<g transform="rotate(-8 88 54)">` + grip(k, 98, 54, 1, 18, 7.6) + `</g>` +
      hair(84, 64, 90, 68, 96, 66, 1, P.mid) + hair(82, 44, 88, 40, 94, 42, 1, P.mid) +
      `<text x="78" y="86" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" text-anchor="middle" transform="rotate(-6 78 86)">¡boing!</text>` +
      sparkle(84, 32, 1.8) + sparkle(30, 86, 1.4) +
      k.defs()
    )
  },

  // Ochenta ganados: el metegol de la oficina es tuyo. La llave del metegol, de oro, coronada y con su llavero.
  'Dueño del metegol': (u) => {
    const k = kit(u)
    const bow = 'M60 24C69 24 75 30 75 38C75 44 71.6 48.6 66.6 50.6V54H53.4V50.6C48.4 48.6 45 44 45 38C45 30 51 24 60 24Z'
    const hole = ellipse(60, 37.4, 6.4, 6.4)
    const shaft = 'M56.6 53.4H63.4V92H56.6Z'
    const bit = 'M63 74H72V78H69V81H72V86H63Z'
    const g = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` })
    const tag = roundRect(-9, -5.4, 9, 5.4, 1.6)
    return (
      k.day() +
      k.sun(60, 54, 17, 47) +
      k.shade(ellipse(60, 54, 26, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(46, 102, 26, 94, 24, 62, 8) + laurel(74, 102, 94, 94, 96, 62, 8, true) +
      `<g transform="translate(60 62) scale(.88) translate(-60 -56)">` +
      k.cast([bow, shaft, bit], 2.2, 2.2) +
      `<path d="M66 56C74 58 78 62 80 66" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M66 56C74 58 78 62 80 66" fill="none" stroke="${STEEL}" stroke-width=".7" stroke-dasharray="1.2 .5"/>` +
      `<g transform="translate(80 72) rotate(-12)">` +
      k.draw([{ d: tag, fill: P.red, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.7, P.wine, 0.4) + `<path d="${roundRect(-7.6, -4, 7.6, 4, 1)}" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` }], 0.5) +
      `<circle cx="-6.6" cy="-2.8" r=".9" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<text x=".6" y="1.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.2" fill="${P.goldL}" text-anchor="middle">metegol</text>` +
      `</g>` +
      k.draw([g(bit, 0.35), g(shaft), g(bow, 0.35)], 0.7) +
      `<path d="${hole}" fill="${P.paper}" stroke="${P.ink}" stroke-width=".8"/>` + k.clip(hole, k.sh(hole, 0, 0, 1, 1, 0.5, 0, P.sky2, 0.4)) +
      `<path d="M58 60H62M58 66H62M58 72H62" stroke="${P.goldD}" stroke-width=".6"/>` +
      `<path d="M58.2 56V90" stroke="${P.goldL}" stroke-width=".8" stroke-linecap="round"/>` +
      voluta('M53 46C49 46 47.4 41 50 38.6C51.6 37.2 53.6 38.2 53 40') + voluta('M67 46C71 46 72.6 41 70 38.6C68.4 37.2 66.4 38.2 67 40') +
      `<g transform="translate(60 25.4) scale(.86)">` + crown(k) + `</g>` +
      `</g>` +
      sparkle(48, 30, 2.4, '#fff') + sparkle(86, 40, 2, P.goldL) + sparkle(34, 62, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Por abajo de la mesa ──────────────────────────────────────────

  // Ganaste en cero: al rival le toca pasar por abajo. La rodillera gastada, al lado de la boca del arco del metegol.
  'A gatas': (u) => {
    const k = kit(u)
    const panel = roundRect(24, 66, 96, 100, 2)
    const mouth = roundRect(44, 72, 76, 88, 2)
    const pad = 'M0 -19C8 -19 12 -12 12 -2C12 10 7 18 0 18C-7 18 -12 10 -12 -2C-12 -12 -8 -19 0 -19Z'
    const cap = ellipse(0, -1.6, 7.6, 10.4)
    const strap = (y: number) => roundRect(-16, y - 2, 16, y + 2, 1)
    return (
      k.day() +
      k.sun(60, 50, 15, 44, 28, false) +
      k.draw([{ d: panel, fill: P.brown, inner: k.sh(panel, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M24 66H96V69H24Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.7, 0)}"/>` + hair(28, 76, 36, 78, 40, 76, 0.5, P.brownD) + hair(80, 92, 88, 90, 94, 92, 0.5, P.brownD) }], 0.7) +
      `<path d="${mouth}" fill="${P.night}" stroke="${P.ink}" stroke-width=".7"/>` + `<path d="M45 73.4H75" stroke="${P.mid}" stroke-width=".7"/>` +
      pelotita(k, 70, 83.6, 3.4) +
      `<g transform="translate(52 50) rotate(-8)">` +
      k.cast([pad], 2, 2) +
      k.draw([
        { d: strap(-7), fill: P.night, inner: `<path d="M-15 -7.6H15" stroke="${P.mid}" stroke-width=".6"/>` },
        { d: strap(9), fill: P.night, inner: `<path d="M-15 8.4H15" stroke="${P.mid}" stroke-width=".6"/>` },
        { d: pad, fill: P.mid, inner: k.sh(pad, 0, 0, 1, 0, 0, 0.8, P.ink, 0.45) + `<path d="M-11 -19H-5V18H-11Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` },
        {
          d: cap, fill: P.sky,
          inner: k.sh(cap, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) +
            k.shade(ellipse(1, 0, 6, 7), k.rad(P.paper, 0.5, 0.5, 0.5, 0.9, 0), P.paper, 0.5) +
            `<path d="M-3 -3L2 1M1 -5L4 -1M-4 3L-1 5" stroke="${P.blue}" stroke-width=".5" stroke-linecap="round"/>` +
            hair(-5.6, -9, -6.4, -2, -5.4, 6, 0.7, '#fff', 0.8),
        },
      ], 0.7) +
      `<path d="${cap}" fill="none" stroke="${P.white}" stroke-width=".5" stroke-dasharray="1 .8" transform="scale(1.12)"/>` +
      `</g>` +
      `<text x="83" y="44" ${GEORGIA} font-style="italic" font-weight="700" font-size="7" fill="${P.ink}" text-anchor="middle" transform="rotate(8 83 44)">5 a 0</text>` +
      hair(74, 58, 80, 56, 86, 58, 0.8, P.mid) +
      sparkle(32, 36, 1.8) + sparkle(88, 60, 1.4) +
      k.defs()
    )
  },

  // Cinco rivales pasaron por abajo: es un túnel de lavado. La pelotita pasa entre los dos cepillos, con espuma.
  'Túnel de lavado': (u) => {
    const k = kit(u)
    const brush = (x: number, s: number) => {
      const d = roundRect(x - 9, 32, x + 9, 92, 9)
      let fringe = ''
      for (let y = 36; y < 90; y += 3) fringe += `M${x - 9} ${y}Q${x} ${y + s * 2.6} ${x + 9} ${y}`
      const axle = `M${x - 1.6} 24H${x + 1.6}V96H${x - 1.6}Z`
      return k.draw([{ d: axle, fill: STEEL, inner: k.sh(axle, 0, 0, 1, 0, 0, 0.8, STEEL_D, 0.4) }], 0.45) +
        k.draw([{
          d, fill: P.sky,
          inner: `<path d="${fringe}" fill="none" stroke="${P.blue}" stroke-width=".9"/>` + `<path d="${fringe}" fill="none" stroke="${P.sky1}" stroke-width=".5" transform="translate(0 -1.2)"/>` +
            k.sh(d, 0, 0, 1, 0, 0, 0.85, P.mid, 0.45) + `<path d="M${x - 9} 32H${x - 3}V92H${x - 9}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>`,
        }], 0.65) +
        Array.from({ length: 7 }, (_, i) => hair(x + s * 10, 38 + i * 8, x + s * 12, 39 + i * 8, x + s * 13, 41 + i * 8, 0.6, P.mid)).join('')
    }
    const bubbles: [number, number, number][] = [[54, 48, 3.4], [66, 44, 2.4], [60, 38, 1.8], [52, 74, 2.2], [68, 76, 3], [62, 82, 1.6], [57, 56, 1.4], [64, 52, 1.6]]
    return (
      k.night() +
      [[30, 22], [90, 24], [42, 18], [78, 18]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 60, 26, 30), k.rad(P.sky, 0.5, 0.5, 0.5, 0.65, 0), P.sky, 0.35) +
      `<path d="M-10 92H130V140H-10Z" fill="${P.red}"/>` + k.sh('M-10 92H130V140H-10Z', 0, 0, 0, 1, 0, 0.7, P.wine, 0.45) + `<path d="M-10 94.4H130" stroke="${P.gold}" stroke-width=".6"/>` +
      brush(38, 1) + brush(82, -1) +
      k.floor(60, 92, 7, 1.4, P.wine) +
      hair(36, 62, 44, 63, 50, 62, 0.9, P.paper) + hair(38, 68, 45, 68.6, 50, 68, 0.7, P.paper) +
      pelotita(k, 60, 64, 7.4) +
      bubbles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" fill-opacity=".45" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.28)}" fill="#fff"/>`).join('') +
      k.defs()
    )
  },

  // Quince en cero: por abajo de tu mesa pasa más gente que por la Panamericana. La pelotita frena en la barrera y paga con la ficha.
  'Peaje del bar': (u) => {
    const k = kit(u)
    const road = 'M-10 80H130V140H-10Z'
    return (
      k.day() +
      k.sun(60, 50, 17, 47) +
      k.shade(ellipse(60, 50, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(46, 102, 26, 94, 24, 62, 8) + laurel(74, 102, 94, 94, 96, 62, 8, true) +
      `<path d="${road}" fill="${P.mid}"/>` + k.sh(road, 0, 0, 0, 1, 0, 0.6, P.ink, 0.4) +
      `<path d="M-10 80H130" stroke="${P.ink}" stroke-width=".8"/><path d="M40 90H52M62 90H74M84 90H96" stroke="${P.goldL}" stroke-width="1.4"/>` +
      k.floor(30, 82, 8, 1.4, P.ink) +
      barrier(k, 30, 62, 58, 0) +
      `<path d="M28 62V80" stroke="${P.ink}" stroke-width="3"/><path d="M28 62V80" stroke="${P.sky1}" stroke-width="1.6"/>` +
      k.floor(70, 81.4, 8, 1.4, P.ink) +
      pelotita(k, 70, 73.4, 8) +
      `<g transform="translate(70 46)">` + ficha(k, 9) + `</g>` +
      `<path d="M70 56.4V62.4" stroke="${P.goldD}" stroke-width=".8" stroke-dasharray="1.2 1"/>` +
      `<text x="44" y="40" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.6" fill="${P.ink}" text-anchor="middle" transform="rotate(-6 44 40)">peaje</text>` +
      sparkle(86, 34, 2.2, P.goldL) + sparkle(56, 30, 1.8, '#fff') +
      k.defs()
    )
  },
}
