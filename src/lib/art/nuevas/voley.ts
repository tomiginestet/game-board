// Vóley en clave heroica: la pelota de tres aspas, la red con su faja y el parquet del club. Los remates son golpes
// (el piso que se raja, el martillo de rayos), los bloqueos son paredes (el ladrillo hueco, la medianera, la
// muralla) y los partidos ganados terminan en el colegio, en los antebrazos del líbero y en la medalla de Seúl 88.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { FULL, GEORGIA, glow, label, PIEL, PIEL_D, vball, vnet } from './_voley-piezas'

/** Madera del parquet. */
const PARQUET = '#E2B57E', PARQUET_D = '#B07A44', PARQUET_L = '#F2D3A6'
/** Ladrillo cerámico. */
const LAD = '#C9805A', LAD_D = '#8E4F31', LAD_L = '#E6A985'
/** Bronce de la medalla de Seúl. */
const BRONCE = '#C88A56', BRONCE_D = '#8A5530', BRONCE_L = '#EBC296'
/** Piedra del martillo. */
const PIEDRA = '#9AA6C2', PIEDRA_D = '#5E6A8C', PIEDRA_L = '#C9D2E6'

/** Papel del día con el grano dorado de la ficha (el naranja del vóley). */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#F0CB8E', 0.5, 0.46, 0.7, 0, 1), '#E3AC5E', 0.45)

/** Parquet en perspectiva desde y0 hacia abajo, con las tablas que fugan al centro. */
function parquet(k: Kit, y0: number) {
  const d = `M-2 ${y0}H122V132H-2Z`
  let boards = ''
  for (let i = -8; i <= 8; i++) boards += `M${f(60 + i * 5)} ${y0}L${f(60 + i * 22)} 132`
  const rows = [6, 14, 25].map((dy) => `M-2 ${f(y0 + dy)}H122`).join('')
  return (
    `<path d="${d}" fill="${PARQUET}"/>` +
    k.clip(d, `<path d="${boards}" stroke="${PARQUET_D}" stroke-width=".45" fill="none"/><path d="${rows}" stroke="${PARQUET_D}" stroke-width=".3" stroke-dasharray="4 7" fill="none"/>`) +
    k.sh(d, 0, 0, 0, 1, 0, 0.75, PARQUET_D, 0.4) +
    `<path d="M-2 ${f(y0 + 1)}H122" stroke="${PARQUET_L}" stroke-width=".6"/><path d="M-2 ${y0}H122" stroke="${P.ink}" stroke-width=".7"/>`
  )
}

/** Rayo dorado de estampa. */
const bolt = (k: Kit, t: string, s = 1) => {
  const d = 'M2 -14L-6 1H0L-3 14L7 -3H1L5 -14Z'
  return `<g transform="${t} scale(${s})">` + k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) + hair(1.6, -12, -1.6, -6, -3.6, -1, 0.6, P.goldL) }], f(0.5 / s)) + `</g>`
}

/** Ladrillo hueco en perspectiva, con el frente (seis agujeros) centrado en (0,0). */
function brick(k: Kit) {
  const front = 'M-17 -11H13V13H-17Z'
  const top = 'M-17 -11L-11 -17H19L13 -11Z'
  const side = 'M13 -11L19 -17V7L13 13Z'
  const holes = [-12.6, -2.4, 7.8].flatMap((x) => [-6.6, 3.4].map((y) => roundRect(x - 3.6, y - 3.2, x + 3.6, y + 3.2, 0.8))).join('')
  return (
    k.draw([
      { d: side, fill: LAD_D, inner: k.sh(side, 0, 0, 1, 0, 0, 0.6, '#5E2F1A', 0.4) + hair(14.4, -4, 16, -5, 17.6, -6.6, 0.4, LAD) },
      { d: top, fill: LAD_L, inner: hair(-12, -14.2, 0, -14.4, 14, -14.2, 0.4, LAD) },
      {
        d: front, fill: LAD,
        inner:
          `<path d="${holes}" fill="#5E2F1A"/>` +
          `<g transform="translate(-1.2 -1.2)" opacity=".85"><path d="${holes}" fill="${LAD_D}"/></g>` +
          k.sh(front, 0, 0, 1, 1, 0, 0.6, LAD_D, 0.4) +
          `<path d="M-17 -11H-6V13H-17Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` +
          hair(-15, 9, -6, 10.4, 4, 9.4, 0.4, LAD_D) + hair(-15.4, -9.4, -14.6, 0, -15.6, 10, 0.5, LAD_L),
      },
    ], 0.75)
  )
}

/** Hilada de ladrillos de (x0,y0) a (x1,y1), trabados. */
function wall(k: Kit, x0: number, y0: number, x1: number, y1: number, bw = 9, bh = 4.6) {
  const d = `M${x0} ${y0}H${x1}V${y1}H${x0}Z`
  let bricks = '', joints = ''
  for (let r = 0, y = y0; y < y1 - 0.01; r++, y += bh) {
    joints += `M${x0} ${f(y)}H${x1}`
    for (let x = x0 - (r % 2 ? bw / 2 : 0); x < x1; x += bw) {
      joints += `M${f(x)} ${f(y)}V${f(Math.min(y1, y + bh))}`
      const tone = [LAD, LAD_L, '#D38E68', LAD][(Math.floor(x * 7 + r * 3) % 4 + 4) % 4]
      bricks += `<path d="M${f(x)} ${f(y)}H${f(x + bw)}V${f(y + bh)}H${f(x)}Z" fill="${tone}"/>`
    }
  }
  return k.draw([{
    d, fill: LAD,
    inner: bricks + `<path d="${joints}" stroke="${P.paper}" stroke-width=".9" fill="none"/><path d="${joints}" stroke="${LAD_D}" stroke-width=".35" fill="none" transform="translate(.4 .4)"/>` +
      k.sh(d, 0, 0, 1, 1, 0, 0.7, LAD_D, 0.4),
  }], 0.7)
}

/** Antebrazo con el puño al final: desde el codo (x0,y0) hasta la muñeca (x1,y1). */
function forearm(k: Kit, x0: number, y0: number, x1: number, y1: number, band: string) {
  const arm = taper(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2 + 1, x1, y1, 11, 7.6)
  return k.draw([{ d: arm, fill: PIEL, inner: k.sh(arm, 0, 0, 0, 1, 0, 0.75, PIEL_D, 0.4) + hair(x0, y0 - 3, (x0 + x1) / 2, (y0 + y1) / 2 - 3, x1, y1 - 2.6, 0.6, '#fff', 0.6) }], 0.7) +
    `<path d="${taper(x0 + (x1 - x0) * 0.68, y0 + (y1 - y0) * 0.68, x0 + (x1 - x0) * 0.74, y0 + (y1 - y0) * 0.74, x0 + (x1 - x0) * 0.8, y0 + (y1 - y0) * 0.8, 9.8, 9.2)}" fill="${band}" stroke="${P.ink}" stroke-width=".55"/>`
}

/** Grieta de tinta que se abre desde (x,y) en ángulo a. */
const crack = (x: number, y: number, a: number, len: number, sq = 0.3) => {
  const pts: string[] = [`${x} ${y}`]
  for (let i = 1; i <= 4; i++) {
    const t = i / 4, j = (i % 2 ? 1 : -1) * 1.4
    pts.push(`${f(x + Math.cos(a) * len * t - Math.sin(a) * j)} ${f(y + (Math.sin(a) * len * t + Math.cos(a) * j) * sq)}`)
  }
  return `M${pts.join('L')}`
}

export const VOLEY_ART: Record<string, (u: number) => string> = {
  // ── Martillo ───────────────────────────────────────────────────────

  // Diez remates: la pelota se clava en el parquet, que se raja en estrella y todavía tiembla.
  'Mano pesada': (u) => {
    const k = kit(u)
    const cracks = crack(44, 86, Math.PI * 0.97, 22, 0.35) + crack(76, 86, 0.06, 22, 0.35) + crack(50, 89, Math.PI * 0.8, 18, 0.5) + crack(70, 89, 0.3, 18, 0.5)
    const quake = (x: number, s: number) => [0, 1].map((i) => `<path d="M${x + s * i * 3.2} ${f(74 - i)}q${f(s * 2.4)} 4 0 8" fill="none" stroke="${P.ink}" stroke-width="${i ? 0.6 : 0.9}" stroke-linecap="round"/>`).join('')
    return (
      field(k) +
      k.sun(60, 50, 14, 44, 32, false) +
      glow(k, 60, 52, 26, 24, 0.6) +
      parquet(k, 80) +
      `<path d="${cracks}" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linejoin="round"/><path d="${cracks}" fill="none" stroke="${PARQUET_L}" stroke-width=".3" transform="translate(-.4 -.4)"/>` +
      k.floor(60, 88, 18, 3, PARQUET_D) +
      `<g transform="translate(60 74) scale(1.1 .9) translate(-60 -74)">` + vball(k, 60, 74, 15, { rot: -70 }) + `</g>` +
      hair(44, 26, 48, 38, 49, 52, 1.2, P.mid, 0.7) + hair(76, 26, 72, 38, 71, 52, 1.2, P.mid, 0.7) + hair(60, 20, 60, 32, 60, 46, 1, P.mid, 0.6) +
      quake(34, -1) + quake(86, 1) +
      label(84, 40, '¡pum!', 7, 10) +
      sparkle(34, 44, 2) +
      k.defs()
    )
  },

  // Cuarenta remates: el martillo de piedra con su rayo le pega a la pelota y del otro lado se agachan.
  'Martillo de Thor': (u) => {
    const k = kit(u)
    const head = roundRect(-16, -10, 16, 10, 2.4)
    const face = (x: number) => roundRect(x - 2.6, -11.6, x + 2.6, 11.6, 1.4)
    const handle = roundRect(-2.6, 10, 2.6, 40, 1.6)
    const wraps = Array.from({ length: 9 }, (_, i) => `M-2.6 ${f(12 + i * 3.2)}L2.6 ${f(14.4 + i * 3.2)}`).join('')
    const runes = 'M-8 -5V5M-8 -5L-4 -1M-8 0L-4 4M4 -5L8 0L4 5M6 -2.6V2.6'
    return (
      k.night() +
      [[32, 30], [88, 28], [96, 52], [26, 60], [44, 22], [78, 20]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      glow(k, 70, 70, 26, 22, 0.55, P.gold) +
      bolt(k, 'translate(30 46) rotate(-12)', 0.9) + bolt(k, 'translate(92 44) rotate(16)', 0.7) +
      `<g transform="translate(52 46) rotate(-36)">` +
      k.cast([head, handle], 2.2, 2.2, '#0F1736') +
      k.draw([{ d: handle, fill: P.brown, inner: `<path d="${wraps}" stroke="${P.brownD}" stroke-width="1.1"/>` + k.sh(handle, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) }], 0.6) +
      `<path d="M0 40C-4 42 -5 47 -2 49C1 51 4 48 3 44" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M0 40C-4 42 -5 47 -2 49C1 51 4 48 3 44" fill="none" stroke="${P.brown}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([
        { d: head, fill: PIEDRA, inner: k.sh(head, 0, 0, 1, 1, 0, 0.8, PIEDRA_D, 0.45) + `<path d="M-16 -10H16V-5H-16Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` + `<path d="${runes}" stroke="${P.goldL}" stroke-width=".9" stroke-linecap="round" fill="none"/>` },
        { d: face(-16), fill: PIEDRA_L, inner: k.sh(face(-16), 0, 0, 1, 0, 0, 0.6, PIEDRA_D, 0.3) },
        { d: face(16), fill: PIEDRA, inner: k.sh(face(16), 0, 0, 1, 0, 0.2, 0.8, PIEDRA_D, 0.4) },
      ], 0.7) +
      `</g>` +
      `<path d="M66 60L71 64M60 66L65 69M70 56L73 61" stroke="${P.goldL}" stroke-width="1" stroke-linecap="round"/>` +
      hair(86, 94, 92, 96, 98, 94, 0.8, P.sky, 0.8) + hair(84, 90, 90, 90.6, 95, 88, 0.6, P.sky, 0.7) +
      vball(k, 79, 80, 11, { rot: -30 }) +
      sparkle(66, 72, 2.4, P.goldL) + sparkle(88, 64, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Ciento veinte remates: la camiseta celeste y blanca del 15, colgada en el vestuario, y el flash de la selfie.
  'De Cecco de vestuario': (u) => {
    const k = kit(u)
    const shirt = 'M-10 -20C-6 -17.6 6 -17.6 10 -20L22 -14L18 -2L13 -4.4V24H-13V-4.4L-18 -2L-22 -14Z'
    const stripes = [-9.4, -1.6, 6.2].map((x) => `M${x} -22H${f(x + 3.9)}V26H${x}Z`).join('')
    const phone = roundRect(-7, -12, 7, 12, 2.2)
    return (
      field(k) +
      k.sun(60, 54, 15, 46) +
      glow(k, 60, 54, 28, 30, 0.75) +
      laurel(48, 100, 30, 92, 27, 62, 8) + laurel(72, 100, 90, 92, 93, 62, 8, true) +
      `<g transform="translate(58 58) rotate(-4)">` +
      `<path d="M0 -21.6V-25C0 -28.4 4 -28.6 4.2 -26" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M0 -21.6V-25C0 -28.4 4 -28.6 4.2 -26" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      k.cast([shirt], 2.2, 2.2, P.mid) +
      k.draw([{
        d: shirt, fill: P.white,
        inner:
          `<path d="${stripes}" fill="${P.sky}"/>` +
          k.sh(shirt, 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) +
          `<path d="M-10 -20C-6 -15 6 -15 10 -20" fill="none" stroke="${P.gold}" stroke-width="1.4"/><path d="M-10 -20C-6 -15 6 -15 10 -20" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".6 .7"/>` +
          `<path d="M-22 -14L-18 -2M22 -14L18 -2" stroke="${P.gold}" stroke-width="1.6"/>` +
          hair(-12, -2, -12.6, 10, -11.6, 22, 0.6, P.blue) + hair(9, 0, 8.4, 12, 9.6, 22, 0.6, P.blue) + hair(-4, 16, 0, 15, 4, 18, 0.5, P.blue),
      }], 0.7) +
      `<text x="0" y="12.6" ${GEORGIA} font-weight="700" font-size="17" fill="${P.ink}" text-anchor="middle" stroke="${P.white}" stroke-width=".8" paint-order="stroke">15</text>` +
      `<text x="0" y="12.6" ${GEORGIA} font-weight="700" font-size="17" fill="${P.ink}" text-anchor="middle">15</text>` +
      `</g>` +
      `<g transform="translate(84 80) rotate(12)">` +
      k.cast([phone], 1.6, 1.6, P.mid) +
      k.draw([{ d: phone, fill: P.night, inner: `<path d="${roundRect(-5.8, -9.6, 5.8, 9.6, 1)}" fill="${P.sky1}"/>` + vball(k, 0, -1, 4.2) + `<circle cx="0" cy="7.4" r="1.2" fill="none" stroke="${P.ink}" stroke-width=".4"/>` + k.sh(phone, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.55) +
      `</g>` +
      `<path d="${starPath(77, 64, 7, 1.4, 8)}" fill="#fff"/>` + sparkle(77, 64, 3, P.goldL) +
      sparkle(36, 34, 2.2, '#fff') + sparkle(86, 38, 1.8, '#fff') +
      k.defs()
    )
  },

  // ── Paredón ────────────────────────────────────────────────────────

  // Cinco bloqueos: un ladrillo hueco con las manos arriba. La pelota pega y vuelve.
  'Ladrillo hueco': (u) => {
    const k = kit(u)
    return (
      field(k) +
      k.sun(60, 54, 14, 44, 32, false) +
      glow(k, 60, 56, 26, 24, 0.6) +
      k.floor(62, 84, 24, 3, P.mid) +
      `<g transform="translate(62 68) scale(1.25)">` + k.cast(['M-17 -11L-11 -17H19V7L13 13H-17Z'], 1.6, 1.4) + brick(k) + `</g>` +
      hair(38, 46, 32, 40, 30, 32, 1, P.mid, 0.7) + hair(42, 40, 36, 34, 35, 26, 0.8, P.mid, 0.6) +
      vball(k, 31, 46, 9.4, { rot: -140 }) +
      `<path d="M41 52L44 54M40 57L44 58M42 48L45 48" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
      label(72, 31, '¡tuc!', 6.4, 8) +
      sparkle(90, 86, 1.6) +
      k.defs()
    )
  },

  // Veinte bloqueos: donde iba la red hay una medianera de ladrillo con su faja y su antena. Permiso.
  'Medianera': (u) => {
    const k = kit(u)
    const antenna = 'M88.6 30H91.4V90H88.6Z'
    const stripes = Array.from({ length: 8 }, (_, i) => `M88.6 ${30 + i * 7.6}H91.4V${f(33.8 + i * 7.6)}H88.6Z`).join('')
    return (
      field(k) +
      k.stage(60, 60, 34) +
      `<path d="M0 90H120V130H0Z" fill="${PARQUET}"/>` + k.sh('M0 90H120V130H0Z', 0, 0, 0, 1, 0, 0.7, PARQUET_D, 0.4) + `<path d="M0 90H120" stroke="${P.ink}" stroke-width=".7"/>` +
      k.cast(['M26 50H90V90H26Z'], 2.4, 1.6, P.mid) +
      wall(k, 26, 50, 90, 90) +
      k.draw([{ d: 'M24 45.4H92V50.4H24Z', fill: P.white, inner: k.sh('M24 45.4H92V50.4H24Z', 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M24 47.9H92" stroke="${P.sky}" stroke-width=".4" stroke-dasharray="1.4 1"/>` }], 0.55) +
      k.draw([{ d: antenna, fill: P.white, inner: `<path d="${stripes}" fill="${P.red}"/>` }], 0.45) +
      `<g transform="translate(50 70) rotate(-4)">` +
      k.draw([{ d: roundRect(-11, -5, 11, 5, 1), fill: P.paper, inner: k.sh(roundRect(-11, -5, 11, 5, 1), 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.5) +
      `<text x="0" y="1.8" ${GEORGIA} font-style="italic" font-weight="700" font-size="5" fill="${P.ink}" text-anchor="middle">permiso</text>` +
      `<path d="M-6 -5L0 -10L6 -5" fill="none" stroke="${P.ink}" stroke-width=".5"/><circle cx="0" cy="-10" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      hair(52, 36, 46, 32, 39, 33, 1, P.mid, 0.6) + hair(52, 30, 46, 27.6, 40, 28.6, 0.8, P.mid, 0.5) +
      vball(k, 60, 36, 8.4, { rot: -160 }) +
      `<path d="M68 42L71 44M69 37L72.6 37M66 46L68 49" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
      sparkle(34, 76, 1.6) +
      k.defs()
    )
  },

  // Sesenta bloqueos: la muralla que serpentea por el lomo de la Tierra, vista desde el espacio, con la pelota de luna.
  'Muralla china': (u) => {
    const k = kit(u)
    const earth = ellipse(60, 168, 92, 92)
    const ridge = (x: number) => 78 + Math.pow((x - 60) / 50, 2) * 12 - Math.sin(x / 7) * 3
    const pts = Array.from({ length: 31 }, (_, i) => 12 + i * 3.2)
    const top = pts.map((x) => `${f(x)} ${f(ridge(x) - 5)}`).join('L'), base = pts.slice().reverse().map((x) => `${f(x)} ${f(ridge(x) + 1.2)}`).join('L')
    const wallD = `M${top}L${base}Z`
    const crenels = pts.filter((_, i) => i % 2 === 0).map((x) => `M${f(x - 1)} ${f(ridge(x) - 5)}V${f(ridge(x) - 7)}H${f(x + 1)}V${f(ridge(x) - 5)}Z`).join('')
    const tower = (x: number, s = 1) => {
      const y = ridge(x) - 4, d = `M${f(x - 4 * s)} ${f(y + 3)}V${f(y - 7 * s)}H${f(x + 4 * s)}V${f(y + 3)}Z`, roof = `M${f(x - 5.4 * s)} ${f(y - 7 * s)}L${x} ${f(y - 11.6 * s)}L${f(x + 5.4 * s)} ${f(y - 7 * s)}Z`
      return k.draw([{ d, fill: P.goldL, inner: k.sh(d, 0, 0, 1, 0, 0, 0.7, P.goldD, 0.4) + `<path d="M${f(x - 1.2 * s)} ${f(y - 1)}h${f(2.4 * s)}v${f(3 * s)}h${f(-2.4 * s)}Z" fill="${P.ink}"/>` }, { d: roof, fill: P.red, inner: k.sh(roof, 0, 0, 1, 0, 0, 0.6, P.wine, 0.4) }], 0.5)
    }
    return (
      k.night() +
      Array.from({ length: 16 }, (_, i) => `<circle cx="${f(22 + ((i * 41) % 78))}" cy="${f(20 + ((i * 23) % 46))}" r="${i % 3 ? 0.45 : 0.7}" fill="${P.paper}"/>`).join('') +
      glow(k, 60, 82, 52, 16, 0.6, P.sky) +
      `<path d="${earth}" fill="${P.green}"/>` +
      k.clip(earth, `<path d="M0 90C20 84 40 96 60 88C80 82 100 94 120 86V130H0Z" fill="${P.greenD}" opacity=".6"/>` + k.sh(earth, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.45)) +
      `<path d="${earth}" fill="none" stroke="${P.sky}" stroke-width="1.6" opacity=".7"/><path d="${earth}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      k.draw([{ d: wallD + crenels, fill: P.goldL, inner: k.sh(wallD, 0, 0, 0, 1, 0, 0.7, P.goldD, 0.45) + `<path d="M${top}" fill="none" stroke="${P.goldD}" stroke-width=".4" transform="translate(0 2.6)"/>` }], 0.5) +
      tower(34) + tower(60, 1.15) + tower(86) +
      `<path d="M71 40C68 36 66 30 70 25" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray="1 1.4"/>` +
      glow(k, 48, 42, 16, 16, 0.6, P.goldL) +
      vball(k, 48, 42, 10.6, { rot: -110, cols: [P.white, P.goldL, P.gold], shade: P.goldD }) +
      `<circle cx="51" cy="46" r="1.4" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
      sparkle(82, 32, 2.8, P.goldL) + sparkle(30, 30, 2, '#fff') + sparkle(94, 60, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Rotación ───────────────────────────────────────────────────────

  // Cinco ganados: el saque de abajo, en globito, pasa la red con lo justo. Entra.
  'Saque de abajo': (u) => {
    const k = kit(u)
    const arc = 'M34 90Q44 24 66 36'
    const post = (x: number) => k.draw([{ d: `M${x - 1.2} 62H${x + 1.2}V94H${x - 1.2}Z`, fill: P.white, inner: k.sh(`M${x - 1.2} 62H${x + 1.2}V94H${x - 1.2}Z`, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) }], 0.5)
    return (
      field(k) +
      k.stage(60, 58, 34) +
      parquet(k, 90) +
      post(28) + post(92) +
      vnet(k, 29.2, 64, 90.8, 78) +
      `<path d="${arc}" fill="none" stroke="${P.ink}" stroke-width="1" stroke-dasharray="2.2 2" stroke-linecap="round"/>` +
      `<path d="M80 50Q84 64 82 80" fill="none" stroke="${P.mid}" stroke-width=".9" stroke-dasharray="2 2" stroke-linecap="round"/>` +
      `<path d="M78.6 80.6L82 84.4L87 77.4" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M78.6 80.6L82 84.4L87 77.4" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>` +
      hair(56, 32, 50, 30, 46, 33, 0.7, P.mid) +
      vball(k, 70, 38, 12, { rot: -80 }) +
      label(55, 58, '¡entra!', 6.4, -10) +
      sparkle(90, 34, 2) + sparkle(30, 58, 1.4) +
      k.defs()
    )
  },

  // Veinte ganados: los antebrazos del líbero, con las muñequeras doradas, levantan otra que no toca el piso.
  'Líbero de oro': (u) => {
    const k = kit(u)
    const hands = 'M52.4 72.6C52.4 68.6 55.6 66.6 60 66.6C64.4 66.6 67.6 68.6 67.6 72.6C67.6 77 64.4 80 60 80C55.6 80 52.4 77 52.4 72.6Z'
    const thumbs = roundRect(55.4, 63, 59.8, 79, 2.2) + roundRect(60.2, 63, 64.6, 79, 2.2)
    return (
      field(k) +
      k.stage(60, 54, 34) +
      parquet(k, 92) +
      k.floor(60, 93, 12, 1.6, PARQUET_D) +
      hair(46, 54, 44, 46, 46, 38, 0.8, P.mid, 0.7) + hair(74, 54, 76, 46, 74, 38, 0.8, P.mid, 0.7) +
      `<path d="M60 60V54" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.4 1.4"/>` +
      vball(k, 60, 37, 13, { rot: -95 }) +
      forearm(k, 20, 92, 56, 72, P.gold) + forearm(k, 100, 92, 64, 72, P.gold) +
      k.draw([
        { d: hands, fill: PIEL, inner: k.sh(hands, 0, 0, 1, 1, 0, 0.75, PIEL_D, 0.4) + hair(54, 76, 60, 78.6, 66, 76, 0.5, PIEL_D) },
        { d: thumbs, fill: PIEL, inner: k.sh(thumbs, 0, 0, 1, 0, 0, 0.6, PIEL_D, 0.35) + `<path d="M56.4 76.4C56.6 74.6 58.6 74.6 58.8 76.4M61.2 76.4C61.4 74.6 63.4 74.6 63.6 76.4" fill="none" stroke="${PIEL_D}" stroke-width=".5"/><path d="M60 64V78" stroke="${PIEL_D}" stroke-width=".4"/>` },
      ], 0.6) +
      sparkle(40, 28, 2) + sparkle(82, 26, 1.6) + sparkle(88, 64, 1.4) +
      k.defs()
    )
  },

  // Sesenta ganados: la medalla de bronce de Seúl 88 colgada de la cinta celeste y blanca, con la pelota en relieve.
  'Generación dorada': (u) => {
    const k = kit(u)
    const ribbonL = 'M42 16L54 16L64 54L56 56Z', ribbonR = 'M78 16L66 16L56 54L64 56Z'
    const medal = ellipse(60, 68, 19, 19)
    return (
      field(k) +
      k.sun(60, 66, 16, 48) +
      glow(k, 60, 66, 30, 30, 0.8) +
      laurel(48, 102, 29, 94, 26, 64, 8) + laurel(72, 102, 91, 94, 94, 64, 8, true) +
      k.draw([
        { d: ribbonL, fill: P.sky, inner: `<path d="M46 16L50 16L60 54.6L57.6 55.4Z" fill="${P.white}"/>` + k.sh(ribbonL, 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) },
        { d: ribbonR, fill: P.sky, inner: `<path d="M74 16L70 16L60 54.6L62.4 55.4Z" fill="${P.white}"/>` + k.sh(ribbonR, 0, 0, 1, 0, 0.2, 0.7, P.blue, 0.4) },
      ], 0.55) +
      k.draw([{ d: 'M56 50H64V56H56Z', fill: P.gold, inner: k.sh('M56 50H64V56H56Z', 0, 0, 1, 0, 0, 0.7, P.goldD, 0.4) }], 0.5) +
      k.cast([medal], 2, 2, P.goldD) +
      k.draw([{
        d: medal, fill: BRONCE,
        inner:
          k.sh(medal, 0, 0, 1, 1, 0, 0.85, BRONCE_D, 0.5) +
          `<circle cx="60" cy="68" r="15.6" fill="none" stroke="${BRONCE_D}" stroke-width=".6"/><circle cx="60" cy="68" r="16.4" fill="none" stroke="${BRONCE_L}" stroke-width=".4"/>` +
          `<path d="M44 52A18 18 0 0 1 70 50" fill="none" stroke="${BRONCE_L}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`,
      }], 0.75) +
      `<text x="60" y="80.6" ${GEORGIA} font-weight="700" font-size="4.6" letter-spacing=".3" fill="${BRONCE_L}" text-anchor="middle" transform="translate(.4 .4)">SEÚL ’88</text>` +
      `<text x="60" y="80.6" ${GEORGIA} font-weight="700" font-size="4.6" letter-spacing=".3" fill="${BRONCE_D}" text-anchor="middle">SEÚL ’88</text>` +
      `<path d="M50 83H70" stroke="${BRONCE_D}" stroke-width=".4"/>` +
      vball(k, 60, 64, 8, { rot: -100, cols: [BRONCE_L, BRONCE, BRONCE_D], shade: BRONCE_D, w: 0.45 }) +
      `<path d="${starPath(51, 59, 1.4, 0.5, 5)}M${starPath(69, 59, 1.4, 0.5, 5).slice(1)}" fill="${BRONCE_L}"/>` +
      sparkle(46, 54, 2.6, '#fff') + sparkle(80, 44, 2, '#fff') + sparkle(74, 82, 1.6, '#fff') +
      k.defs()
    )
  },
}
