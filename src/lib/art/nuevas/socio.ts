// Socio: la antigüedad en el club (el bar de juegos o el grupo de amigos), redibujada con el kit (../kit.ts). Los objetos
// de la vida de socio: el carnet recién salido del sobre, el recibo de la cuota (gratis, pero pagada), la mesa
// reservada con el café de siempre, la placa de bronce de la entrada y, al final, el carnet de oro que ya no vence.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Papel del sobre por dentro, un poco más oscuro que el de afuera. */
const SOBRE_IN = '#E6DAC0'
/** Bronce de la placa: el cuerpo, la sombra y el brillo. */
const BRONCE = '#C68A4E'
const BRONCE_D = '#8A5530'
const BRONCE_L = '#F1C88E'
/** Café y la espuma del cortado. */
const CAFE = '#6B3E22'
const ESPUMA = '#EBD3AE'
/** Mármol del pedestal y sus vetas. */
const MARMOL = '#F7F3EA'

// ── Piezas ───────────────────────────────────────────────────────────

/** Lacre: una gota de cera con el borde irregular, en (x,y) y radio r. */
function waxBlob(x: number, y: number, r: number) {
  const n = 22
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, rr = r * (1 + 0.07 * Math.sin(i * 2.7) + 0.05 * Math.cos(i * 5.3))
    d += `${i ? 'L' : 'M'}${f(x + Math.cos(a) * rr)} ${f(y + Math.sin(a) * rr)}`
  }
  return d + 'Z'
}

/** Infinito (lemniscata) centrado en (x,y), de ancho total 2a. */
function infinity(x: number, y: number, a: number) {
  const pts: string[] = []
  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) * Math.PI * 2, s = Math.sin(t), c = Math.cos(t), q = 1 + s * s
    pts.push(`${f(x + (a * c) / q)} ${f(y + (a * s * c) / q)}`)
  }
  return `M${pts.join('L')}Z`
}

/** Texto grabado en metal: el surco oscuro y el filo de luz abajo a la derecha. */
function engraved(x: number, y: number, size: number, txt: string, dark: string, light: string, extra = '') {
  const t = (dx: number, dy: number, c: string) => `<text x="${f(x + dx)}" y="${f(y + dy)}" ${GEORGIA} font-size="${size}" fill="${c}" text-anchor="middle" ${extra}>${txt}</text>`
  return t(0.3, 0.35, light) + t(0, 0, dark)
}

/** Esquineros de foto carnet en un rectángulo. */
function corners(x0: number, y0: number, x1: number, y1: number, c: string, s = 3) {
  const one = (x: number, y: number, r: number) => `<path d="M0 0H${s}L0 ${s}Z" fill="${c}" transform="translate(${x} ${y}) rotate(${r})"/>`
  return one(x0, y0, 0) + one(x1, y0, 90) + one(x1, y1, 180) + one(x0, y1, 270)
}

/** Fondo guilloche de los carnets: ondas finas que se cruzan. */
function guilloche(x0: number, y0: number, n: number, gap: number, c: string, w = 0.45) {
  return Array.from({ length: n }, (_, i) => {
    const y = y0 + i * gap
    return `<path d="M${x0} ${f(y)}Q${f(x0 + 7)} ${f(y - 2.4)} ${f(x0 + 14)} ${f(y)}T${f(x0 + 28)} ${f(y)}T${f(x0 + 42)} ${f(y)}T${f(x0 + 56)} ${f(y)}T${f(x0 + 70)} ${f(y)}" fill="none" stroke="${c}" stroke-width="${w}"/>` +
      `<path d="M${x0} ${f(y)}Q${f(x0 + 7)} ${f(y + 2.4)} ${f(x0 + 14)} ${f(y)}T${f(x0 + 28)} ${f(y)}T${f(x0 + 42)} ${f(y)}T${f(x0 + 56)} ${f(y)}T${f(x0 + 70)} ${f(y)}" fill="none" stroke="${c}" stroke-width="${f(w * 0.7)}"/>`
  }).join('')
}

/** Tornillo de cabeza redonda con la ranura, en (x,y). */
function screw(k: Kit, x: number, y: number, r: number, rot: number, metal = BRONCE, dark = BRONCE_D, light = BRONCE_L) {
  const d = ellipse(x, y, r, r)
  return k.draw([{ d, fill: metal, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, dark, 0.45) + `<circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.32)}" fill="${light}"/>` }], 0.4) +
    `<path d="M${f(-r * 0.75)} 0H${f(r * 0.75)}" stroke="${dark}" stroke-width="${f(r * 0.32)}" stroke-linecap="round" transform="translate(${x} ${y}) rotate(${rot})"/>`
}

export const SOCIO_ART: Record<string, (u: number) => string> = {
  // Día cero: el carnet recién salido del sobre (con lacre y todo), todavía sin foto ni número. Bienvenido.
  'Carnet nuevo': (u) => {
    const k = kit(u)
    const flap = 'M29.4 62.6L57.4 33.6Q60 31 62.6 33.6L90.6 62.6Z'
    const lining = 'M34.4 61L58 36.8Q60 34.8 62 36.8L85.6 61Z'
    const back = roundRect(29, 61, 91, 93.4, 1.6)
    const front = 'M29 66.4L56.8 78.2Q60 79.6 63.2 78.2L91 66.4V91.8Q91 93.4 89.4 93.4H30.6Q29 93.4 29 91.8Z'
    const cardD = roundRect(-25, -17, 25, 17, 2.2)
    const photo = 'M-21.4 -4.4H-7.8V12.8H-21.4Z'
    const seal = waxBlob(60, 78.4, 6.2)
    const stripes = Array.from({ length: 14 }, (_, i) => `<path d="M${26 + i * 5} 64L${42 + i * 5} 30" stroke="${P.blue}" stroke-width="1.3"/>`).join('')
    return (
      k.day() +
      k.sun(60, 52, 20, 47, 28) +
      k.shade(ellipse(60, 54, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.floor(61, 94, 33, 2.6, P.mid) +
      // El sobre: la solapa abierta (con el forro rayado), el fondo y, más abajo, el bolsillo con el lacre.
      k.draw([
        { d: flap, fill: P.white, inner: k.sh(flap, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) },
        { d: back, fill: SOBRE_IN, inner: k.sh(back, 0, 0, 0, 1, 0.9, 0, P.brown, 0.35) },
      ], 0.7) +
      `<path d="${lining}" fill="${P.sky1}"/>` + k.clip(lining, stripes + k.sh(lining, 0, 0, 1, 1, 0, 0.6, P.mid, 0.3)) +
      `<path d="${lining}" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
      // El carnet, saliendo.
      `<g transform="translate(62.4 54.6) rotate(-9) scale(.9)">` +
      k.cast([cardD], 1.8, 2.4) +
      k.draw([{
        d: cardD, fill: P.white, line: 0.4,
        inner: guilloche(-26, -5, 5, 4.6, P.sky1) +
          `<path d="M-26 -18H26V-8.4H-26Z" fill="${P.ink}"/>` + k.sh('M-26 -18H26V-8.4H-26Z', 0, 0, 1, 0, 0, 0.7, P.night, 0.5) +
          `<path d="M-26 -8.4H26V-7H-26Z" fill="${P.red}"/>` + `<path d="M-26 -7H26" stroke="${P.goldL}" stroke-width=".35"/>` +
          k.sh('M8 -18H26V18H8Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) +
          `<path d="${photo}" fill="${P.sky1}"/>` + k.clip(photo, k.sh(photo, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.5)) +
          `<path d="${photo}" fill="none" stroke="${P.blue}" stroke-width=".45" stroke-dasharray="1.2 .8"/>` + corners(-21.4, -4.4, -7.8, 12.8, P.ink, 2.8) +
          `<text x="-14.6" y="5.6" ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.blue}" text-anchor="middle">foto</text>` +
          `<path d="M-1.6 7.6H21.6M-1.6 13.4H21.6" stroke="${P.blue}" stroke-width=".5" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
          `<path d="${starPath(20.6, -13.2, 2.4, 1, 5)}" fill="${P.gold}" stroke="${P.goldL}" stroke-width=".3"/>`,
      }], 0.75) +
      `<text x="-22" y="-11.4" ${GEORGIA} font-weight="700" font-size="4.4" letter-spacing=".9" fill="${P.goldL}">SOCIO</text>` +
      `<text x="-1.6" y="-.6" ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.mid}">número</text>` +
      `<text x="-1.6" y="6.6" ${GEORGIA} font-weight="700" font-size="6.4" fill="${P.ink}">Nº</text>` +
      `</g>` +
      // El bolsillo del sobre, con sus pliegues y el lacre roto.
      k.draw([{
        d: front, fill: P.white, line: 0.4,
        inner: k.sh(front, 0, 0, 1, 1, 0, 0.55, P.blue, 0.3) + k.sh('M28 64L60 80L92 64V70L60 84L28 70Z', 0, 0, 0, 1, 0.5, 0, P.blue, 0.3) +
          hair(29.4, 93, 42, 86, 54.6, 80.4, 0.6, P.sky2) + hair(90.6, 93, 78, 86, 65.4, 80.4, 0.6, P.sky2),
      }], 0.75) +
      `<text x="61" y="90.4" ${GEORGIA} font-style="italic" font-size="5.6" fill="${P.ink}" text-anchor="middle" transform="rotate(-3 61 90)">¡bienvenido!</text>` +
      k.cast([seal], 1, 1.2, P.wine) +
      k.draw([{ d: seal, fill: P.red, inner: k.sh(seal, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<ellipse cx="57.6" cy="75.8" rx="2" ry="1.1" fill="#fff" opacity=".55" transform="rotate(-30 57.6 75.8)"/>` }], 0.55) +
      `<circle cx="60" cy="78.4" r="3.9" fill="none" stroke="${P.wine}" stroke-width=".6"/>` +
      `<path d="${starPath(60.3, 78.7, 2.6, 1.1, 5)}" fill="${P.wine}"/><path d="${starPath(60, 78.4, 2.6, 1.1, 5)}" fill="#E07468"/>` +
      `<path d="M55.6 74.4L58 77L57.2 79.2L59.4 82.2" fill="none" stroke="${P.wine}" stroke-width=".55" stroke-linejoin="round"/>` +
      // Sale con envión: los trazos del movimiento y el brillo de lo nuevo.
      sparkle(40.6, 41.4, 2.4, '#fff') + sparkle(34, 30, 2.6) + sparkle(82, 24, 2) + sparkle(94, 62, 1.5) +
      k.defs()
    )
  },

  // Un mes: el recibo de la cuota, pinchado en el clavo del mostrador. Cero pesos, pero PAGADO.
  'Cuota al día': (u) => {
    const k = kit(u)
    const base = 'M46 88C46 82.4 51.6 79.6 60 79.6C68.4 79.6 74 82.4 74 88Z'
    const plinth = roundRect(42.6, 87.2, 77.4, 91.8, 1.4)
    const needle = 'M59.3 81V25.4L60 21.4L60.7 25.4V81Z'
    const zig = (x0: number, x1: number, y: number, n: number) =>
      Array.from({ length: n }, (_, i) => `L${f(x1 - ((i + 0.5) * (x1 - x0)) / n)} ${f(y + 1.5)}L${f(x1 - ((i + 1) * (x1 - x0)) / n)} ${y}`).join('')
    const receipt = `M-17 -5H17V39${zig(-17, 17, 39, 11)}Z`
    // Los recibos de los meses anteriores, más abajo en el clavo (cada uno con su sellito).
    const old = ([[11, 76.4, 13.4], [-8, 72.6, 14.6]] as const).map(([rot, y, w]) => {
      const d = roundRect(-w, -3, w, 8, 0.6)
      return `<g transform="translate(60 ${y}) rotate(${rot})">` +
        k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M${f(-w + 3)} 2H${f(w - 9)}M${f(-w + 3)} 4.8H${f(w - 13)}" stroke="${P.sky2}" stroke-width=".5"/>` }], 0.55) +
        `<rect x="${f(w - 7.6)}" y="1" width="5.6" height="3.6" rx=".5" fill="none" stroke="${P.red}" stroke-width=".55" opacity=".8" transform="rotate(-12 ${f(w - 4.8)} 2.8)"/>` +
        `</g>`
    }).join('')
    const stamp = roundRect(-14.4, -5, 14.4, 5, 1.2)
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(60, 91.6, 22, 2.4, P.mid) +
      // El pinche: la base de bronce y la aguja.
      k.draw([
        { d: plinth, fill: P.goldD, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + `<path d="M44 88.8H76" stroke="${P.goldL}" stroke-width=".5"/>` },
        { d: base, fill: P.gold, inner: k.sh(base, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M45 79H56V89H45Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="M48.6 85.4C50 83 53.6 81.6 57 81.4" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` },
        { d: needle, fill: P.white, inner: `<path d="M60 20V86H62V20Z" fill="${P.sky}"/>` },
      ], 0.5) +
      old +
      // El recibo de este mes, arriba de todo.
      `<g transform="translate(60 35.4) rotate(5)">` +
      k.cast([receipt], 2.2, 2.2) +
      k.draw([{
        d: receipt, fill: P.white, line: 0.35,
        inner: k.sh('M6 -7H20V40H6Z', 0, 0, 1, 0, 0, 0.55, P.blue, 0.3) + k.sh('M-20 28H20V40H-20Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) +
          `<path d="M-13.4 9.2H13.4" stroke="${P.ink}" stroke-width=".55"/><path d="M-13.4 10.3H13.4" stroke="${P.ink}" stroke-width=".25"/>` +
          `<path d="M-1 14.6H9.4" stroke="${P.sky2}" stroke-width=".5" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
          `<path d="M-13.4 17.6H13.4" stroke="${P.ink}" stroke-width=".35" stroke-dasharray="1 .7"/>`,
      }], 0.65) +
      `<text x="0" y="7.2" ${GEORGIA} font-weight="700" font-size="5.4" letter-spacing=".8" fill="${P.ink}" text-anchor="middle">RECIBO</text>` +
      `<text x="-13.4" y="15.4" ${GEORGIA} font-style="italic" font-size="3.3" fill="${P.mid}">cuota</text>` +
      `<text x="13.4" y="15.4" ${GEORGIA} font-size="3.3" fill="${P.mid}" text-anchor="end">1 mes</text>` +
      `<text x="-13.4" y="24.2" ${GEORGIA} font-size="3.3" fill="${P.mid}">total</text>` +
      `<text x="13.6" y="24.8" ${GEORGIA} font-weight="700" font-size="7.4" fill="${P.ink}" text-anchor="end">$ 0,00</text>` +
      // El agujero del pinche.
      `<ellipse cx="0" cy="0" rx="1.5" ry="1.1" fill="${P.ink}"/>` + hair(-1.6, -0.4, -2.4, -1.6, -2.8, -2.6, 0.5, P.blue) + hair(1.4, 0.6, 2.4, 1.4, 3, 2.6, 0.5, P.blue) +
      // El sello, torcido y gastado.
      `<g transform="translate(.4 32.6) rotate(-8)" opacity=".93">` +
      `<path d="${stamp}" fill="${P.red}" opacity=".08"/><path d="${stamp}" fill="none" stroke="${P.red}" stroke-width="1.2"/>` +
      `<rect x="-12.8" y="-3.4" width="25.6" height="6.8" rx=".6" fill="none" stroke="${P.red}" stroke-width=".4"/>` +
      `<text x="0" y="2.3" ${GEORGIA} font-weight="700" font-size="5.4" letter-spacing=".5" fill="${P.red}" text-anchor="middle">PAGADO</text>` +
      k.shade(stamp, k.lin(P.white, 0, 0, 1, 1, 0.12, 0.5), P.white, 0) +
      `</g>` +
      `</g>` +
      // La punta de la aguja, que asoma por delante.
      `<path d="M59.4 35V25.4L60 21.4L60.6 25.4V35Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".55" stroke-linejoin="round"/><path d="M60.2 34V24.6" stroke="${P.sky}" stroke-width=".4"/>` +
      sparkle(60, 19.4, 1.6) + sparkle(34, 42, 2.2) + sparkle(87, 54, 1.6) + sparkle(30, 70, 1.3) +
      k.defs()
    )
  },

  // Seis meses: la mesa de siempre, con el cartelito de reservado y el cortado servido antes de que llegues.
  'De la casa': (u) => {
    const k = kit(u)
    const top = ellipse(60, 75, 31, 8.6)
    const rim = 'M29 75A31 8.6 0 0 0 91 75V78A31 8.6 0 0 1 29 78Z'
    const column = 'M57.8 83.6H62.2L63 104H57Z'
    const shade = 'M47.4 35.6L54.6 27.2Q60 25.4 65.4 27.2L72.6 35.6Q60 38.6 47.4 35.6Z'
    const cone = 'M48.6 36L71.4 36L95 80L25 80Z'
    const sign = 'M36.6 73L39.8 58.6H56.2L59.4 73Z'
    const signBack = 'M39.8 58.6H56.2L58 72L52 70Z'
    const saucer = ellipse(75, 74, 10.6, 3)
    const cup = 'M67.4 61.6H82.6L81.4 69.4Q75 73.6 68.6 69.4Z'
    const handle = 'M82.2 63.4C86.4 62.6 87.6 67.6 81.4 68.4'
    const coffee = ellipse(75, 61.6, 7.6, 1.8)
    return (
      k.night() +
      // La lámpara de la mesa y su luz.
      `<path d="M60 10V27" stroke="${P.ink}" stroke-width="1"/>` +
      k.shade(cone, k.lin(P.goldL, 0, 0, 0, 1, 0.75, 0.15), P.goldL, 0.35) +
      k.shade(ellipse(60, 76, 34, 12), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.4) +
      k.draw([
        { d: shade, fill: P.greenD, inner: k.sh(shade, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + `<path d="M50 34L56 28" stroke="${P.green}" stroke-width="1.2" stroke-linecap="round"/>` },
        { d: 'M58.4 24.4H61.6V27.4H58.4Z', fill: P.gold },
      ], 0.55) +
      `<path d="M49.6 36.2Q60 39 70.4 36.2Q60 37.8 49.6 36.2Z" fill="${P.goldL}"/><ellipse cx="60" cy="37" rx="3.4" ry="1.4" fill="#fff"/>` +
      // La mesa de café: tapa de mármol, canto de bronce y el pie de fundición.
      `<g transform="translate(60 74) scale(1.1) translate(-60 -74)">` +
      k.draw([
        { d: column, fill: P.mid, inner: k.sh(column, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + `<path d="M58.8 86V104" stroke="${P.sky}" stroke-width=".5" opacity=".7"/>` },
        { d: rim, fill: P.goldD, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + `<path d="M29 76.6A31 8.6 0 0 0 91 76.6" fill="none" stroke="${P.goldL}" stroke-width=".45"/>` },
        { d: top, fill: P.white, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + hair(34, 76, 42, 72, 50, 79, 0.5, P.sky2) + hair(66, 80, 74, 76, 86, 77, 0.45, P.sky2) + hair(44, 70, 52, 69, 56, 71, 0.35, P.sky2) },
      ], 0.7) +
      // El cartelito de reservado.
      k.floor(48, 73.4, 12, 1.4, P.mid) +
      k.draw([
        { d: signBack, fill: P.sky1 },
        { d: sign, fill: P.white, line: 0.35, inner: k.sh(sign, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) + `<path d="M39.6 63.2H56.4" stroke="${P.red}" stroke-width=".6"/><path d="M38.8 69.2H57.2" stroke="${P.red}" stroke-width=".6"/>` },
      ], 0.55) +
      `<text x="48" y="67.6" ${GEORGIA} font-style="italic" font-size="3.9" fill="${P.ink}" text-anchor="middle">reservado</text>` +
      `<path d="${starPath(48, 61, 1.3, 0.55, 5)}" fill="${P.gold}"/>` +
      // El cortado de siempre, con el corazón en la espuma.
      k.floor(75, 74.6, 12, 1.6, P.mid) +
      `<path d="${handle}" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="${handle}" fill="none" stroke="${P.white}" stroke-width="1.2" stroke-linecap="round"/>` +
      k.draw([
        { d: saucer, fill: P.white, inner: k.sh(saucer, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="${ellipse(75, 73.6, 7.4, 1.8)}" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` },
        { d: cup, fill: P.white, line: 0.3, inner: k.sh(cup, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + `<path d="M66 64.4H84V66H66Z" fill="${P.sky}"/>` + `<path d="M69.6 63V69" stroke="#fff" stroke-width=".8"/>` },
        { d: coffee, fill: ESPUMA, inner: `<path d="${ellipse(75.6, 61.8, 7, 1.5)}" fill="${CAFE}" opacity=".35"/>` },
      ], 0.5) +
      `<path d="M75 62.6C73.6 61.6 73.4 60.6 74.4 60.6C74.8 60.6 75 61 75 61.2C75 61 75.2 60.6 75.6 60.6C76.6 60.6 76.4 61.6 75 62.6Z" fill="${CAFE}"/>` +
      `<path d="M82 73.4L88 70.6" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M82 73.4L88 70.6" stroke="${P.sky1}" stroke-width=".7" stroke-linecap="round"/>` +
      hair(73, 58.6, 70.4, 54, 73.4, 49.4, 0.8, P.white, 0.85) + hair(77.6, 58.4, 80.4, 53.4, 77.4, 47.4, 0.9, P.white, 0.85) + hair(75.4, 57, 76.8, 53, 75.4, 50, 0.5, P.white, 0.6) +
      `</g>` +
      // Y afuera, la noche.
      sparkle(30, 40, 1.4, P.goldL) + sparkle(90, 34, 1.8, P.goldL) + sparkle(35, 92, 1.2, P.sky) +
      k.defs()
    )
  },

  // Un año: tu nombre en la placa de bronce de la entrada, con sus cuatro tornillos y el laurel grabado.
  'Placa en la puerta': (u) => {
    const k = kit(u)
    const plate = roundRect(31, 38, 89, 82, 3.4)
    const panel = roundRect(36.4, 43.4, 83.6, 76.6, 1.4)
    const GRABADO = '#5A2F16'
    // La pared de ladrillo de la entrada, en celeste, que se pierde hacia los bordes.
    const bricks = Array.from({ length: 12 }, (_, r) => {
      const y = 14 + r * 8, off = r % 2 ? -9 : 0
      return Array.from({ length: 8 }, (_, i) => roundRect(f(4 + off + i * 18), y, f(4 + off + i * 18 + 17), y + 7, 0.8)).join('')
    }).join('')
    const sprig = (sx: number) => `<g transform="translate(60 48.4) scale(${sx} 1)">` +
      `<path d="M4.4 .4C9 .8 14 .2 19 -1" fill="none" stroke="${GRABADO}" stroke-width=".55" stroke-linecap="round"/>` +
      [[7.4, 0.6], [11.2, 0.4], [15, -0.2]].map(([x, y], i) =>
        `<path d="M0 0C1.2 -1.4 3.6 -1.4 4.8 0C3.6 1.4 1.2 1.4 0 0Z" transform="translate(${x} ${y}) rotate(${-150 + i * 4})" fill="${GRABADO}"/>` +
        `<path d="M0 0C1.2 -1.4 3.6 -1.4 4.8 0C3.6 1.4 1.2 1.4 0 0Z" transform="translate(${x} ${y}) rotate(${150 - i * 4})" fill="${GRABADO}"/>`).join('') +
      `<path d="M0 0C1.2 -1.4 3.6 -1.4 4.8 0C3.6 1.4 1.2 1.4 0 0Z" transform="translate(19 -1) rotate(-12)" fill="${GRABADO}"/>` +
      `</g>`
    // La firma grabada: tu nombre, en cursiva de grabador (sin letras: a esta distancia nadie la lee igual).
    const loops = Array.from({ length: 121 }, (_, i) => {
      const t = (i / 120) * Math.PI * 11, amp = 2.4 - (i / 120) * 0.9
      return `${i ? 'L' : 'M'}${f(50.6 + t * 0.62 - 1.5 * Math.sin(t))} ${f(63.6 - amp * Math.cos(t) - (i / 120) * 0.8)}`
    }).join('')
    const firma = (c: string, dx: number, dy: number) => `<g transform="translate(${dx} ${dy})">` +
      `<path d="M45.6 66.4C44.4 62 46 57.4 48.6 57.6C51.2 57.8 49.6 63 46 64.2" fill="none" stroke="${c}" stroke-width=".85" stroke-linecap="round"/>` +
      `<path d="M47.4 62.4C48.6 62.6 49.8 63 50.6 61.2" fill="none" stroke="${c}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="${loops}" fill="none" stroke="${c}" stroke-width=".7" stroke-linejoin="round"/>` +
      hair(44, 68.2, 58, 65.6, 77.2, 67, 0.8, c) + `</g>`
    return (
      k.day() +
      `<g opacity=".8">` + `<path d="${bricks}" fill="${P.sky1}" stroke="${P.sky2}" stroke-width=".6"/>` + `</g>` +
      k.shade('M0 0H120V130H0Z', k.rad(P.sky2, 0.5, 0.46, 0.66, 0, 1), '#9EB1DB', 0.6) +
      k.shade(ellipse(60, 60, 36, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.5) +
      k.cast([plate], 2.8, 3, P.mid) +
      k.draw([
        {
          d: plate, fill: BRONCE,
          inner: k.sh(plate, 0, 0, 1, 1, 0, 0.9, BRONCE_D, 0.5) + `<path d="M28 34H50L40 86H28Z" fill="${k.lin(BRONCE_L, 0, 0, 1, 0, 0.85, 0)}"/>` +
            `<path d="M33 40.6Q33.4 39.6 35 39.6H74" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".75"/>` +
            `<path d="M87.4 46V79Q87.4 80.4 86 80.4H50" fill="none" stroke="${BRONCE_D}" stroke-width="1" opacity=".6"/>`,
        },
      ], 0.9) +
      // El bisel: el panel hundido con su filete de luz.
      `<path d="${panel}" fill="${BRONCE_D}" opacity=".28"/>` +
      k.clip(panel, k.sh(panel, 0, 0, 1, 1, 0.1, 0.75, BRONCE_D, 0.35) + `<path d="M36 43H48L40 78H36Z" fill="${k.lin(BRONCE_L, 0, 0, 1, 0, 0.6, 0)}"/>`) +
      `<path d="${panel}" fill="none" stroke="${GRABADO}" stroke-width=".8"/><path d="${panel}" fill="none" stroke="${BRONCE_L}" stroke-width=".45" transform="translate(.5 .55)"/>` +
      // Lo grabado: el laurel con la estrella, SOCIO, la firma y el año.
      sprig(1) + sprig(-1) +
      `<path d="${starPath(60.35, 48.75, 3.2, 1.3, 5)}" fill="${BRONCE_L}"/><path d="${starPath(60, 48.4, 3.2, 1.3, 5)}" fill="${GRABADO}"/>` +
      engraved(60, 58.4, 7.2, 'SOCIO', GRABADO, BRONCE_L, 'font-weight="700" letter-spacing="1.6"') +
      firma(BRONCE_L, 0.35, 0.4) + firma(GRABADO, 0, 0) +
      engraved(60, 73.6, 3.2, 'UN AÑO DE CLUB', GRABADO, BRONCE_L, 'letter-spacing=".6"') +
      screw(k, 34.4, 41.4, 1.7, 30) + screw(k, 85.6, 41.4, 1.7, -20) + screw(k, 34.4, 78.6, 1.7, 75) + screw(k, 85.6, 78.6, 1.7, 10) +
      sparkle(39.6, 40.4, 2.6, '#fff') + sparkle(84, 72, 1.4, '#fff') + sparkle(30, 30, 2) + sparkle(92, 90, 1.6) +
      k.defs()
    )
  },

  // Tres años: el carnet fundido en oro sobre un pedestal de mármol, con el laurel. Vence: nunca.
  'Socio vitalicio': (u) => {
    const k = kit(u)
    const cardD = roundRect(-25, -16.4, 25, 16.4, 2.2)
    const photo = ellipse(-14.4, 3.4, 6.4, 7.8)
    const capital = 'M35.6 70.6H84.4L86 74.6H34Z'
    const body = 'M38.8 74.6H81.2V95.4H38.8Z'
    const plinth = 'M35 95.4H85L86.4 100H33.6Z'
    const panel = roundRect(44, 78.4, 76, 91.6, 1)
    const holder = 'M42.6 66.4H77.4L78.6 70.8H41.4Z'
    const veins = hair(40, 80, 48, 84, 46, 93, 0.6, P.sky2) + hair(70, 76, 76, 82, 80, 81, 0.5, P.sky2) + hair(58, 92, 66, 90, 74, 95, 0.45, P.sky2) + hair(36, 72, 50, 73, 60, 71.6, 0.4, P.sky2)
    const voluta = (sx: number) => `<g transform="translate(60 85) scale(${sx} 1)">` +
      `<path d="M2 0C4 -3.6 9 -4 11 -1.2C12.6 1 11 3.2 9.2 2.6C7.8 2.2 8 .4 9.2 .2M11 -1.2C13 -3 15 -3 14.6 -1" fill="none" stroke="${P.goldD}" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>`
    const dentils = Array.from({ length: 13 }, (_, i) => `<rect x="${f(39.6 + i * 3.2)}" y="74.6" width="1.8" height="1.6" fill="${P.sky1}" stroke="${P.blue}" stroke-width=".3"/>`).join('')
    const rosette = (x: number, y: number) => Array.from({ length: 6 }, (_, i) => `<ellipse cx="${x}" cy="${f(y - 1.1)}" rx=".6" ry="1.1" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2" transform="rotate(${i * 60} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r=".7" fill="${P.goldD}"/>`
    const rays = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return `<path d="M${f(-14.4 + Math.cos(a) * 2.8)} ${f(3.4 + Math.sin(a) * 3.4)}L${f(-14.4 + Math.cos(a) * 4.8)} ${f(3.4 + Math.sin(a) * 5.8)}" stroke="${P.goldD}" stroke-width=".45"/>`
    }).join('')
    return (
      k.day() +
      k.sun(60, 50, 20, 47, 32) +
      k.shade(ellipse(60, 52, 32, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.goldL, 0.45) +
      // La corona de laurel, por detrás del carnet.
      laurel(45, 72, 23, 52, 49, 24.6, 8) + laurel(75, 72, 97, 52, 71, 24.6, 8, true) +
      k.floor(60, 100, 30, 2.4, P.mid) +
      // El pedestal de mármol.
      k.draw([
        { d: plinth, fill: MARMOL, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) },
        { d: body, fill: MARMOL, inner: k.sh(body, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + veins },
        { d: capital, fill: MARMOL, inner: k.sh(capital, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M35 73H85" stroke="${P.sky2}" stroke-width=".4"/>` },
      ], 0.7) +
      `<path d="${panel}" fill="none" stroke="${P.blue}" stroke-width=".5"/><path d="${panel}" fill="none" stroke="#fff" stroke-width=".35" transform="translate(.45 .5)"/>` +
      voluta(1) + voluta(-1) + dentils + rosette(41.4, 78.8) + rosette(78.6, 78.8) + `<path d="M58.6 85L60 83L61.4 85L60 87Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".35"/>` +
      // El carnet de oro, parado en su ranura.
      `<g transform="translate(60 53) scale(.86)">` +
      k.cast([cardD], 2.2, 2.4, P.goldD) +
      k.draw([{
        d: cardD, fill: P.gold, line: 0.4,
        inner: k.sh(cardD, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-26 -18H-6L-16 18H-26Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.9, 0)}"/>` +
          `<g opacity=".75">${guilloche(-26, -3.6, 5, 4.2, P.goldD, 0.45)}</g>` +
          `<path d="M-26 -18H26V-8.4H-26Z" fill="${P.goldD}"/>` + k.sh('M-26 -18H26V-8.4H-26Z', 0, 0, 1, 0, 0, 0.8, P.brownD, 0.5) +
          `<path d="M-26 -8.2H26" stroke="${P.goldL}" stroke-width=".6"/><path d="M-26 -7.2H26" stroke="${P.goldD}" stroke-width=".4"/>`,
      }], 0.75) +
      `<path d="${cardD}" fill="none" stroke="${P.goldL}" stroke-width=".4" transform="scale(.93)"/>` +
      engraved(0, -11, 4.4, 'VITALICIO', '#4E2A12', P.goldL, 'font-weight="700" letter-spacing="1"') +
      // La foto: un medallón en relieve con la estrella del club.
      k.draw([{ d: photo, fill: P.goldL, inner: k.sh(photo, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.4) +
      `<path d="${ellipse(-14.4, 3.4, 5, 6.2)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1" stroke-linecap="round"/>` + rays +
      `<path d="${starPath(-14.1, 3.8, 2.8, 1.2, 5)}" fill="${P.goldD}"/><path d="${starPath(-14.4, 3.4, 2.8, 1.2, 5)}" fill="${P.white}"/>` +
      `<text x="-3.6" y="0" ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.brownD}">vence</text>` +
      `<path d="${infinity(11, 7.2, 11)}" fill="none" stroke="${P.goldL}" stroke-width="2.6" transform="translate(.4 .5)"/>` +
      `<path d="${infinity(11, 7.2, 11)}" fill="none" stroke="${P.brownD}" stroke-width="2.2"/>` +
      `<path d="${infinity(11, 7.2, 11)}" fill="none" stroke="${P.goldD}" stroke-width=".7"/>` +
      `<path d="M-3.6 13.2H22" stroke="${P.goldD}" stroke-width=".4"/>` +
      // Más cincel: volutas en las esquinas, perlado en el borde y las estrellitas de la banda.
      [[1, 1], [-1, 1]].map(([sx]) => `<g transform="translate(${sx * 21.6} 13.2) scale(${sx} 1)">` +
        `<path d="M0 0C-1 -3 -4.6 -3.4 -5.6 -1.2C-6.2 .2 -4.8 1.2 -3.8 .4M-5.6 -1.2C-7.4 -1.6 -8.4 -.4 -8.2 .6" fill="none" stroke="${P.brownD}" stroke-width=".5" stroke-linecap="round"/></g>`).join('') +
      Array.from({ length: 22 }, (_, i) => `<circle cx="${f(-21.6 + i * (43.2 / 21))}" cy="14.9" r=".42" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".18"/>`).join('') +
      `<path d="${starPath(-20.6, -12.6, 1.6, 0.65, 5)}" fill="${P.goldL}"/><path d="${starPath(20.6, -12.6, 1.6, 0.65, 5)}" fill="${P.goldL}"/>` +
      `</g>` +
      // La ranura dorada donde quedó amurado.
      k.draw([{ d: holder, fill: P.gold, inner: k.sh(holder, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M44 67.4H74" stroke="${P.goldL}" stroke-width=".5"/>` }], 0.55) +
      [47, 53, 60, 67, 73].map((x) => `<circle cx="${x}" cy="68.9" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`).join('') +
      `<path d="M41.6 42.2C43 40.6 45.2 39.8 47.6 39.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      sparkle(80.4, 41.4, 2.8, '#fff') + sparkle(40.4, 63.4, 1.5, '#fff') + sparkle(29, 36, 2) + sparkle(93, 74, 1.6) + sparkle(60, 21.6, 2.2) +
      k.defs()
    )
  },
}
