// Rugby en clave heroica: la pelota ovalada (con sus costuras, los cordones y la estampa en las puntas), las H de los
// palos, el césped y la línea del ingoal. Los puntos se apoyan de panza, corren como un tren y llevan las garras del
// puma; el hombre del partido se gana la milanesa, el casco del scrum con la C y la camiseta enmarcada del buffet.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { FULL, GEORGIA, glow, label } from './_voley-piezas'

/** Césped. */
const GRASS = '#7FA557', GRASS_D = '#57783A', GRASS_L = '#A7C482'
/** Tierra del pique. */
const TIERRA = '#A8774B'
/** Pan rallado de la milanesa y el limón. */
const RALLADO = '#D9A766', RALLADO_D = '#A8743A', RALLADO_L = '#EFCB8E'
const LIMON = '#EFD36A', LIMON_D = '#C9A93A'
/** Cuero acolchado del casco. */
const CASCO = '#3B4F96', CASCO_D = '#24346A', CASCO_L = '#6F84C4'
/** Madera del buffet. */
const MADERA = '#9C6A42', MADERA_D = '#6B4428', MADERA_L = '#C08A5C'

/** Papel del día con el grano azul de la ficha del rugby. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#B9C3EA', 0.5, 0.46, 0.7, 0, 1), '#94A2DA', 0.45)

/** Césped desde y0 con sus franjas de cortadora. */
function grass(k: Kit, y0: number) {
  const d = `M-2 ${y0}H122V132H-2Z`
  const bands = [0, 1, 2, 3].map((i) => `M${-10 + i * 36} ${y0}L${8 + i * 36} ${y0}L${-6 + i * 42} 132L${-26 + i * 42} 132Z`).join('')
  return `<path d="${d}" fill="${GRASS}"/>` + k.clip(d, `<path d="${bands}" fill="${GRASS_L}" opacity=".35"/>`) + k.sh(d, 0, 0, 0, 1, 0, 0.6, GRASS_D, 0.4) + `<path d="M-2 ${y0}H122" stroke="${P.ink}" stroke-width=".6"/>`
}

/** Contorno de la pelota de rugby de largo 2L y alto 2H, con el eje horizontal y el centro en (0,0). */
const oval = (L: number, H: number) => `M${-L} 0C${f(-L * 0.72)} ${f(-H * 1.32)} ${f(L * 0.72)} ${f(-H * 1.32)} ${L} 0C${f(L * 0.72)} ${f(H * 1.32)} ${f(-L * 0.72)} ${f(H * 1.32)} ${-L} 0Z`

interface BallOpts {
  fill?: string
  /** Color de la estampa de las puntas. */
  print?: string
  /** Aros (rayas cruzadas) de dos colores sobre todo el cuerpo, en lugar de la estampa. */
  hoops?: [string, string]
  /** Encima de todo, recortado a la pelota. */
  over?: string
}

/** Pelota de rugby de perfil (eje horizontal, centro en 0,0): dos costuras, cordones arriba, estampa en las puntas. */
function rball(k: Kit, L: number, H: number, o: BallOpts = {}) {
  const d = oval(L, H)
  const seamU = `M${-L} 0C${f(-L * 0.6)} ${f(-H * 0.75)} ${f(L * 0.6)} ${f(-H * 0.75)} ${L} 0`
  const seamD = `M${-L} 0C${f(-L * 0.6)} ${f(H * 0.55)} ${f(L * 0.6)} ${f(H * 0.55)} ${L} 0`
  const print = o.print ?? P.mid
  const ends = [-1, 1].map((s) => `M${f(s * L * 0.62)} ${f(-H)}L${f(s * L * 0.72)} ${f(-H)}L${f(s * L * 0.72)} ${f(H)}L${f(s * L * 0.62)} ${f(H)}ZM${f(s * L * 0.78)} ${f(-H)}L${f(s * L * 0.82)} ${f(-H)}L${f(s * L * 0.82)} ${f(H)}L${f(s * L * 0.78)} ${f(H)}Z`).join('')
  const hoops = o.hoops ? Array.from({ length: 7 }, (_, i) => `M${f(-L + (i * 2 + 0.5) * (L / 7))} ${f(-H * 1.4)}h${f(L / 7)}v${f(H * 2.8)}h${f(-L / 7)}Z`).join('') : ''
  const laces = Array.from({ length: 6 }, (_, i) => { const x = -L * 0.2 + i * (L * 0.08), y = -H * 0.56 - Math.cos((x / L) * 1.6) * H * 0.0; return `M${f(x - 0.5)} ${f(y - 1.3)}L${f(x + 0.5)} ${f(y + 1.3)}` }).join('')
  return k.draw([{
    d, fill: o.hoops ? o.hoops[0] : o.fill ?? P.white,
    inner:
      (o.hoops ? `<path d="${hoops}" fill="${o.hoops[1]}"/>` : `<path d="${ends}" fill="${print}"/>` + `<path d="${starPath(-L * 0.36, H * 0.1, H * 0.34, H * 0.14, 5)}" fill="${P.gold}" stroke="${print}" stroke-width=".3"/>`) +
      `<path d="${seamU}${seamD}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="${seamD}" fill="none" stroke="${P.ink}" stroke-width=".35" stroke-dasharray=".6 .8" transform="translate(0 .9)"/>` +
      `<path d="${laces}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${laces}" stroke="${P.white}" stroke-width=".6" stroke-linecap="round"/>` +
      (o.over ?? '') +
      k.sh(d, 0, 0, 0.4, 1, 0, 0.55, P.blue, 0.3) +
      `<path d="M${f(-L * 0.72)} ${f(-H * 0.36)}C${f(-L * 0.5)} ${f(-H * 0.86)} ${f(-L * 0.1)} ${f(-H * 0.98)} ${f(L * 0.16)} ${f(-H * 0.94)}" fill="none" stroke="#fff" stroke-width="${f(H * 0.14)}" stroke-linecap="round" opacity=".7"/>`,
  }], f(Math.min(0.75, H * 0.07)))
}

/** Palos en H: postes en x0 y x1, travesaño en yb. */
function posts(k: Kit, x0: number, x1: number, top: number, yb: number, bottom: number) {
  const pole = (x: number) => `M${f(x - 1.3)} ${top}H${f(x + 1.3)}V${bottom}H${f(x - 1.3)}Z`
  const bar = `M${x0} ${f(yb - 1.2)}H${x1}V${f(yb + 1.2)}H${x0}Z`
  const pad = (x: number) => roundRect(x - 2.6, bottom - 10, x + 2.6, bottom, 1)
  return k.draw([
    { d: pole(x0), fill: P.white, inner: k.sh(pole(x0), 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
    { d: pole(x1), fill: P.white, inner: k.sh(pole(x1), 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
    { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) },
    { d: pad(x0), fill: P.red, inner: k.sh(pad(x0), 0, 0, 1, 0, 0, 0.6, P.wine, 0.4) },
    { d: pad(x1), fill: P.red, inner: k.sh(pad(x1), 0, 0, 1, 0, 0, 0.6, P.wine, 0.4) },
  ], 0.5)
}

/** Nube de humo entintada. */
const puff = (k: Kit, x: number, y: number, r: number) => {
  const balls: [number, number, number][] = [[-0.55, 0.18, 0.5], [0.5, 0.22, 0.48], [-0.15, -0.3, 0.62], [0.42, -0.2, 0.44]]
  return k.draw(balls.map(([dx, dy, rr]) => {
    const d = ellipse(f(x + dx * r), f(y + dy * r), f(rr * r), f(rr * r))
    return { d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0.05, 0.8, P.sky2, 0.45) }
  }), f(Math.min(0.55, r * 0.08)))
}

/** Corchea. */
const note = (x: number, y: number, c = P.ink) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="1.3" fill="${c}" transform="rotate(-20 ${x} ${y})"/><path d="M${f(x + 1.6)} ${y}V${y - 7}Q${f(x + 4)} ${y - 5} ${f(x + 4.4)} ${y - 3}" fill="none" stroke="${c}" stroke-width=".7"/>`

export const RUGBY_ART: Record<string, (u: number) => string> = {
  // ── Apoyador ───────────────────────────────────────────────────────

  // Quince puntos: la pelota apoyada sobre la línea del ingoal, con el surco de la tirada de panza y las H atrás.
  'Pelota en el ingoal': (u) => {
    const k = kit(u)
    const skid = 'M12 96C24 92 34 90 46 88L47 92C34 94 24 96 12 100Z'
    return (
      field(k) +
      k.sun(60, 44, 13, 40, 32, false) +
      posts(k, 42, 78, 18, 56, 78) +
      grass(k, 74) +
      `<path d="M-2 86L122 80" stroke="${P.white}" stroke-width="2.6"/><path d="M-2 86L122 80" stroke="${P.sky}" stroke-width=".5" transform="translate(0 1)"/>` +
      `<path d="${skid}" fill="${TIERRA}" opacity=".8"/>` + hair(16, 96, 30, 92, 44, 89.4, 0.6, P.brownD) +
      Array.from({ length: 10 }, (_, i) => `<circle cx="${f(46 + (i * 7.3) % 14)}" cy="${f(80 + (i * 3.7) % 8)}" r="${i % 2 ? 0.6 : 0.9}" fill="${i % 3 ? TIERRA : GRASS_D}"/>`).join('') +
      k.floor(62, 88, 16, 2.6, GRASS_D) +
      `<g transform="translate(62 80) rotate(-8)">` + rball(k, 17, 8.6) + `</g>` +
      label(88, 66, '¡try!', 6.6, -8) +
      sparkle(30, 40, 2) +
      k.defs()
    )
  },

  // Setenta y cinco puntos: la pelota hecha locomotora corre pegada a la raya, que es la vía.
  'Wing veloz': (u) => {
    const k = kit(u)
    const chimney = 'M70 52H76L77.4 44H68.6Z'
    const cab = roundRect(36, 46, 48, 60, 1.6)
    const catcher = 'M82 66L88 72H78Z'
    const wheel = (x: number, r: number) => `<circle cx="${x}" cy="72" r="${r}" fill="${P.red}" stroke="${P.ink}" stroke-width=".8"/><circle cx="${x}" cy="72" r="${f(r * 0.4)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` + [0, 1, 2, 3].map((i) => `<path d="M${x} 72L${f(x + Math.cos(i * 0.785) * r * 0.9)} ${f(72 + Math.sin(i * 0.785) * r * 0.9)}" stroke="${P.ink}" stroke-width=".4"/>`).join('')
    return (
      field(k) +
      k.stage(60, 58, 34) +
      grass(k, 76) +
      `<path d="M-2 78H122" stroke="${P.white}" stroke-width="2.4"/>` +
      Array.from({ length: 12 }, (_, i) => `<path d="M${i * 11 - 2} 80.6H${i * 11 + 4}" stroke="${P.brownD}" stroke-width="1.2"/>`).join('') +
      [0, 1, 2].map((i) => hair(14, 50 + i * 7, 22, 50 + i * 7, 32, 51 + i * 7, 1 - i * 0.15, P.mid, 0.7)).join('') +
      puff(k, 60, 30, 8) + puff(k, 44, 26, 6) + puff(k, 32, 30, 4.4) +
      k.floor(62, 78, 26, 2, GRASS_D) +
      k.draw([{ d: cab, fill: P.mid, inner: `<path d="M38.6 48.6H45.4V54H38.6Z" fill="${P.goldL}"/>` + k.sh(cab, 0, 0, 1, 0, 0, 0.6, P.ink, 0.35) }], 0.6) +
      k.draw([{ d: chimney, fill: P.night, inner: `<path d="M68.6 44H77.4V46H68.6Z" fill="${P.gold}"/>` }], 0.6) +
      `<g transform="translate(62 62)">` + rball(k, 22, 10) + `</g>` +
      k.draw([{ d: catcher, fill: P.gold, inner: `<path d="M80 68L82 72M83 68L84.6 72M85.4 70L86.4 72" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.5) +
      `<circle cx="84" cy="62" r="2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/>` +
      wheel(44, 5.4) + wheel(58, 4) + wheel(70, 4) +
      `<path d="M44 72H70" stroke="${P.ink}" stroke-width="1.4"/><path d="M44 72H70" stroke="${P.gold}" stroke-width=".6"/>` +
      sparkle(92, 40, 2) + sparkle(86, 88, 1.4) +
      k.defs()
    )
  },

  // Doscientos puntos: la pelota a rayas celestes y blancas, con el zarpazo del puma, bajo el sol de Mayo.
  // Las corcheas son el himno.
  'Puma en el Mundial': (u) => {
    const k = kit(u)
    const claws = [-6, 0, 6].map((dx) => `M${f(-10 + dx)} -11C${f(-4 + dx)} -4 ${f(1 + dx)} 3 ${f(7 + dx)} 11C${f(4.4 + dx)} 6 ${f(-1 + dx)} 1 ${f(-7.6 + dx)} -9.6C${f(-8.6 + dx)} -10.4 ${f(-9.4 + dx)} -10.8 ${f(-10 + dx)} -11Z`).join('')
    return (
      field(k) +
      k.sun(60, 56, 16, 48) +
      glow(k, 60, 56, 30, 28, 0.8) +
      laurel(48, 101, 30, 93, 27, 63, 8) + laurel(72, 101, 90, 93, 93, 63, 8, true) +
      k.floor(60, 92, 20, 2.6, P.goldD) +
      `<g transform="translate(60 60) rotate(-32)">` +
      k.cast([oval(25, 13)], 2.2, 2.2, P.goldD) +
      rball(k, 25, 13, {
        hoops: [P.white, P.sky],
        over: `<path d="${claws}" fill="${P.night}" transform="rotate(32) translate(1 -1)"/><path d="${claws}" fill="${P.mid}" transform="rotate(32) translate(.6 -1.2) scale(.9)"/>`,
      }) +
      `</g>` +
      note(32, 40) + note(86, 42, P.mid) + note(90, 76) +
      sparkle(40, 30, 2.6, '#fff') + sparkle(80, 30, 2, '#fff') +
      k.defs()
    )
  },

  // ── Hombre del partido ─────────────────────────────────────────────

  // La figura: la milanesa del tercer tiempo, ovalada como la pelota y más grande que el plato, con limón y tenedor.
  'Milanesa del tercer tiempo': (u) => {
    const k = kit(u)
    const plate = ellipse(60, 74, 30, 12)
    const mila = 'M24 70C26 58 44 52 62 53C80 54 96 60 96 70C96 80 80 86 62 86C42 86 22 82 24 70Z'
    const crumbs = Array.from({ length: 90 }, (_, i) => { const a = i * 2.4, d = Math.sqrt(((i * 0.618) % 1)); return `<circle cx="${f(60 + Math.cos(a) * d * 34)}" cy="${f(70 + Math.sin(a) * d * 15)}" r="${i % 3 ? 0.45 : 0.7}" fill="${i % 2 ? RALLADO_D : RALLADO_L}"/>` }).join('')
    const fork = 'M-1 0V-14M-3 -22V-15C-3 -13 3 -13 3 -15V-22M-1 -22V-15M1 -22V-15'
    const seg = Array.from({ length: 8 }, (_, i) => `M0 0L${f(Math.cos((i * Math.PI) / 4) * 5.4)} ${f(Math.sin((i * Math.PI) / 4) * 5.4)}`).join('')
    return (
      field(k) +
      k.sun(60, 46, 14, 42, 32, false) +
      glow(k, 60, 50, 26, 22, 0.6) +
      k.floor(60, 84, 36, 5, P.blue) +
      k.draw([{ d: plate, fill: P.white, inner: `<ellipse cx="60" cy="74" rx="24" ry="9" fill="none" stroke="${P.sky}" stroke-width=".8"/>` + k.sh(plate, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) }], 0.7) +
      k.cast([mila], 1.6, 2, P.mid) +
      k.draw([{
        d: mila, fill: RALLADO,
        inner: crumbs + k.sh(mila, 0, 0, 1, 1, 0, 0.75, RALLADO_D, 0.45) +
          `<path d="M24 66C30 58 44 54 60 54" fill="none" stroke="${RALLADO_L}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` +
          hair(40, 74, 56, 78, 70, 76, 0.6, RALLADO_D) + hair(64, 62, 74, 62, 84, 66, 0.5, RALLADO_D),
      }], 0.75) +
      `<g transform="translate(74 66) scale(1 .6)">` +
      k.draw([{ d: ellipse(0, 0, 7.4, 7.4), fill: LIMON, inner: `<circle cx="0" cy="0" r="6.2" fill="#F7E8A6"/><path d="${seg}" stroke="${LIMON_D}" stroke-width=".55"/>` }], 0.6) +
      `</g>` +
      `<g transform="translate(44 70) rotate(-28)">` + `<path d="${fork}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="${fork}" fill="none" stroke="${P.sky1}" stroke-width="1" stroke-linecap="round"/>` + `</g>` +
      label(60, 38, 'tercer tiempo', 5.6, -4) +
      sparkle(88, 46, 1.8) + sparkle(30, 56, 1.4) +
      k.defs()
    )
  },

  // Cinco veces figura: el casco acolchado del scrum, con la C de capitán bordada y las orejeras.
  'Capitán del scrum': (u) => {
    const k = kit(u)
    const cap = 'M-20 6C-21 -12 -12 -24 0 -24C12 -24 21 -12 20 6C20 10 17 12 14 11L12 2C6 0 -6 0 -12 2L-14 11C-17 12 -20 10 -20 6Z'
    const ribs = 'M0 -24V2M-9 -21.4C-12 -14 -12.6 -6 -11.6 2M9 -21.4C12 -14 12.6 -6 11.6 2M-16.6 -14C-19 -6 -19 2 -17 8M16.6 -14C19 -6 19 2 17 8'
    const band = 'M-20 2C-10 -2 10 -2 20 2L20 6C10 2 -10 2 -20 6Z'
    const ear = ellipse(-15.6, 6, 5.4, 6.4)
    const badge = ellipse(0, -12, 5.4, 5.4)
    return (
      field(k) +
      k.stage(60, 56, 34) +
      k.floor(60, 92, 24, 3, P.mid) +
      `<g transform="translate(78 88) rotate(-14)">` + rball(k, 11, 5.6) + `</g>` +
      `<path d="M38 72C36 82 44 90 52 92" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M38 72C36 82 44 90 52 92" fill="none" stroke="${CASCO_L}" stroke-width=".9"/>` +
      `<g transform="translate(60 62) scale(1.3)">` +
      k.cast([cap], 1.6, 1.6, P.mid) +
      k.draw([{
        d: cap, fill: CASCO,
        inner: `<path d="${ribs}" fill="none" stroke="${CASCO_D}" stroke-width="1"/><path d="${ribs}" fill="none" stroke="${CASCO_L}" stroke-width=".35" transform="translate(-.6 0)"/>` +
          k.sh(cap, 0, 0, 1, 1, 0, 0.75, CASCO_D, 0.45) + `<path d="${band}" fill="${P.gold}"/>` +
          `<path d="M-14 -16C-10 -21 -5 -22.6 0 -22.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".6"/>` +
          Array.from({ length: 14 }, (_, i) => `<circle cx="${f(-17 + i * 2.6)}" cy="${f(-8 - Math.sin((i / 13) * Math.PI) * 4)}" r=".3" fill="${CASCO_L}"/>`).join(''),
      }], f(0.75 / 1.3)) +
      k.draw([{ d: ear, fill: CASCO, inner: `<ellipse cx="-15.6" cy="6" rx="3" ry="3.8" fill="${CASCO_D}"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${f(-15.6 + Math.cos(i) * 1.6)}" cy="${f(6 + Math.sin(i) * 2)}" r=".45" fill="${P.ink}"/>`).join('') }], f(0.6 / 1.3)) +
      k.draw([{ d: badge, fill: P.white, inner: `<circle cx="0" cy="-12" r="4.4" fill="none" stroke="${P.gold}" stroke-width=".8"/>` }], f(0.6 / 1.3)) +
      `<text x="0" y="-9.4" ${GEORGIA} font-weight="700" font-size="7.4" fill="${P.red}" text-anchor="middle">C</text>` +
      `</g>` +
      sparkle(34, 36, 2) + sparkle(86, 34, 1.6) +
      k.defs()
    )
  },

  // Quince veces figura: la camiseta a rayas enmarcada en el buffet del club, con su placa de bronce.
  'Leyenda del club': (u) => {
    const k = kit(u)
    const frame = roundRect(32, 26, 88, 92, 1.6)
    const inside = 'M38 32H82V86H38Z'
    const shirt = 'M-7.6 -15C-4.6 -13 4.6 -13 7.6 -15L17 -10L14 -1L10 -3V19H-10V-3L-14 -1L-17 -10Z'
    const hoops = [-12, -4, 4, 12].map((y) => `M-20 ${y}H20V${y + 4}H-20Z`).join('')
    const corner = (x: number, y: number, sx: number, sy: number) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 0C3 -1 6 0 7 3C5 2 3 2.4 2.4 4C4 4.6 4.4 6.4 3 7C0 6 -1 3 0 0Z" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/></g>`
    const plaque = roundRect(48, 94, 72, 100, 1)
    return (
      `<rect width="120" height="130" fill="${MADERA}"/>` +
      Array.from({ length: 7 }, (_, i) => `<path d="M${i * 18 + 4} 0V130" stroke="${MADERA_D}" stroke-width=".8"/><path d="M${i * 18 + 5} 0V130" stroke="${MADERA_L}" stroke-width=".4"/>`).join('') +
      k.shade(FULL, k.rad(MADERA_D, 0.5, 0.46, 0.65, 0, 1), MADERA_D, 0.5) +
      k.sun(60, 58, 16, 50, 36, false) +
      laurel(46, 104, 26, 96, 23, 64, 8) + laurel(74, 104, 94, 96, 97, 64, 8, true) +
      k.cast([frame], 2.4, 2.4, '#3A2414') +
      k.draw([{
        d: frame, fill: P.gold,
        inner: k.sh(frame, 0, 0, 1, 1, 0, 0.85, P.goldD, 0.5) +
          `<path d="M34.4 28.4H85.6V89.6H34.4Z" fill="none" stroke="${P.goldL}" stroke-width=".8"/><path d="M36 30H84V88H36Z" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-dasharray=".8 .8"/>` +
          `<path d="M32 26H88V30H32Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>`,
      }], 0.75) +
      k.draw([{ d: inside, fill: P.night, inner: k.shade(inside, k.rad(P.mid, 0.5, 0.45, 0.6, 0.9, 0), P.mid, 0.4) }], 0.4) +
      corner(34.6, 28.6, 1, 1) + corner(85.4, 28.6, -1, 1) + corner(34.6, 89.4, 1, -1) + corner(85.4, 89.4, -1, -1) +
      `<g transform="translate(60 58) scale(1.08)">` +
      k.draw([{
        d: shirt, fill: P.gold,
        inner: `<path d="${hoops}" fill="${P.mid}"/>` + k.sh(shirt, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) +
          `<path d="M-7.6 -15C-4.6 -10.6 4.6 -10.6 7.6 -15" fill="none" stroke="${P.white}" stroke-width="1.4"/>` +
          hair(-8, 0, -8.6, 8, -7.6, 18, 0.5, P.goldD) + hair(7, 2, 7.6, 10, 6.6, 18, 0.5, P.goldD),
      }], f(0.7 / 1.08)) +
      `<text x="0" y="8" ${GEORGIA} font-weight="700" font-size="11" fill="${P.white}" stroke="${P.ink}" stroke-width="1.2" paint-order="stroke" text-anchor="middle">10</text>` +
      `</g>` +
      `<path d="M60 26L54 18H66Z" fill="none" stroke="${P.ink}" stroke-width=".7"/><circle cx="60" cy="17.6" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: plaque, fill: P.goldL, inner: k.sh(plaque, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.4) }], 0.45) +
      `<text x="60" y="98.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="3.6" fill="${P.ink}" text-anchor="middle">leyenda</text>` +
      sparkle(80, 36, 2.4, '#fff') + sparkle(42, 76, 1.8, '#fff') + sparkle(30, 30, 1.6, P.goldL) +
      k.defs()
    )
  },
}
