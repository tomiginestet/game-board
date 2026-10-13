// ¡Aventureros al Tren!: Boletería, Ruta más larga y Locomotora.
// El color propio del juego es el rojo de su ficha (#C92A2A): el grano ladrillo del fondo, las calderas, los vagones,
// las ruedas y los boletos. Las locomotoras son de verdad: remaches, bielas, domos de bronce y vapor. Sin maquinistas
// ni pasajeros: la gente aparece por sus objetos (la gorra, el silbato, la valija, la lupa).
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El rojo de la ficha de Aventureros al Tren, con su sombra y su luz; el ladrillo claro del fondo.
const ROJO = '#C92A2A', ROJO_D = '#871B1E', ROJO_L = '#EE8F84'
const FONDO = '#EDBAA4', FONDO_G = '#DA8E75'
// La noche del expreso, el cartón de los boletos, el cuero de la valija y la nieve.
const NOCHE = '#2A1530'
const CARTON = '#F0DCAE', CARTON_D = '#C9A866'
const CUERO = '#9A4A2E', CUERO_D = '#5E2A1A', CUERO_L = '#C97B52'
const NIEVE = '#FBFAF6'

/** Fondo del juego: el papel con el ladrillo claro granulado hacia los bordes. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(FONDO, 0.5, 0.46, 0.7, 0, 1), FONDO_G, 0.5)

/** Andén: un disco ladrillo claro con el borde granulado (el escenario del juego). */
const anden = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F8E7DD"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(FONDO, 0.5, 0.5, 0.5, 0, 1), FONDO_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ROJO}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Noche bordó, con un resplandor rojo en el medio. */
const noche = (k: Kit) => `<rect width="120" height="130" fill="${NOCHE}"/>` + k.shade(FULL, k.rad(ROJO_D, 0.5, 0.42, 0.55, 0.9, 0), ROJO_D, 0.35)

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional. */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Remache: un botón de bronce con su punto de luz. */
const rivet = (x: number, y: number, r = 0.5, c: string = P.goldL) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${c}" stroke="${P.ink}" stroke-width="${f(r * 0.45)}"/>`

/** Nube de vapor: un óvalo con el borde en festones. */
function puff(cx: number, cy: number, rx: number, ry: number, n: number, rot = 0) {
  const pt = (i: number) => {
    const a = rot + (i / n) * Math.PI * 2
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  }
  let d = `M${pt(0).map(f).join(' ')}`
  for (let i = 1; i <= n; i++) {
    const [x0, y0] = pt(i - 1), [x1, y1] = pt(i), r = f(Math.hypot(x1 - x0, y1 - y0) * 0.62)
    d += `A${r} ${r} 0 0 1 ${f(x1)} ${f(y1)}`
  }
  return d + 'Z'
}

/** Vapor entintado: la nube blanca con su sombra celeste abajo a la derecha y un rulo adentro. */
const steam = (k: Kit, cx: number, cy: number, rx: number, ry: number, n: number, rot = 0, w = 0.55) => {
  const d = puff(cx, cy, rx, ry, n, rot)
  return k.draw([{
    d, fill: P.white,
    inner: k.sh(d, 0, 0, 1, 1, 0.05, 0.85, P.sky2, 0.45) + hair(cx - rx * 0.5, cy + ry * 0.1, cx - rx * 0.1, cy - ry * 0.5, cx + rx * 0.4, cy - ry * 0.3, Math.min(rx, ry) * 0.09, P.sky, 0.9),
  }], w)
}

/** Rueda de locomotora: llanta de acero, rayos rojos, contrapeso y cubo de bronce. Devuelve la rueda y su muñón. */
function wheel(k: Kit, x: number, y: number, r: number, crank: number, s: number) {
  const w = (n: number) => f(n / s)
  const at = (rr: number, a: number) => `${f(x + Math.cos(a) * rr)} ${f(y + Math.sin(a) * rr)}`
  const n = r > 5 ? 14 : 9
  const spokes = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + 0.2; return `M${at(r * 0.22, a)}L${at(r * 0.74, a)}` }).join('')
  const ca = crank + Math.PI
  const cw = r > 5 ? `M${at(r * 0.72, ca - 0.8)}A${f(r * 0.72)} ${f(r * 0.72)} 0 0 1 ${at(r * 0.72, ca + 0.8)}L${at(r * 0.34, ca + 0.55)}A${f(r * 0.34)} ${f(r * 0.34)} 0 0 0 ${at(r * 0.34, ca - 0.55)}Z` : ''
  return (
    k.draw([{ d: ellipse(x, y, r, r), fill: P.sky1, inner: k.sh(ellipse(x, y, r, r), 0, 0, 1, 1, 0, 0.95, P.mid, 0.45) }], 0.6 / s) +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.8)}" fill="${ROJO}" stroke="${P.ink}" stroke-width="${w(0.3)}"/>` +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.7)}" fill="${P.night}"/>` +
    `<path d="${spokes}" stroke="${ROJO}" stroke-width="${f(r * 0.14)}" stroke-linecap="round"/>` +
    (cw ? `<path d="${cw}" fill="${ROJO}" stroke="${ROJO_D}" stroke-width="${w(0.25)}"/>` : '') +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.26)}" fill="${ROJO}" stroke="${ROJO_D}" stroke-width="${w(0.25)}"/>` +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.12)}" fill="${P.gold}" stroke="${P.ink}" stroke-width="${w(0.2)}"/>` +
    `<path d="M${at(r * 0.9, -2.7)}A${f(r * 0.9)} ${f(r * 0.9)} 0 0 1 ${at(r * 0.9, -1.5)}" fill="none" stroke="#fff" stroke-width="${w(0.4)}" stroke-linecap="round"/>`
  )
}

/** Locomotora a vapor de perfil, hacia la izquierda, con los rieles en y=0: chimenea, domos de bronce, caldera roja con
 * zunchos, cabina con chapa de número, tres ruedas motrices con bielas y el miriñaque adelante. `s` es la escala final
 * (para que las líneas no se engorden ni se pierdan). */
function locoSide(k: Kit, s = 1, plate = '') {
  const w = (n: number) => f(n / s)
  const boiler = 'M-21 -26H13V-12H-21Z'
  const smokebox = 'M-20.6 -26H-31.6C-33.2 -26 -34.2 -22.6 -34.2 -19C-34.2 -15.4 -33.2 -12 -31.6 -12H-20.6Z'
  const stack = 'M-26.6 -25.6L-28.8 -36.6H-20.4L-22.6 -25.6Z'
  const stackRim = 'M-29.8 -39.2H-19.4L-19.8 -36.4H-29.4Z'
  const dome = 'M-8.4 -25.6C-8.4 -30.4 -6.4 -32.4 -3.9 -32.4C-1.4 -32.4 .6 -30.4 .6 -25.6Z'
  const sand = 'M3.6 -25.6C3.6 -28.4 5 -29.8 6.8 -29.8C8.6 -29.8 10 -28.4 10 -25.6Z'
  const cab = 'M12 -36H33V-9H12Z'
  const roof = 'M9.6 -36.2C13 -39.6 31.4 -39.6 35.4 -36.2V-34.8H9.6Z'
  const win = roundRect(15.4, -32.4, 26.4, -23.2, 1.8)
  const frame = 'M-33 -12.2H34V-8.8H-33Z'
  const beam = 'M-36.4 -14H-32.2V-6.4H-36.4Z'
  const pilot = 'M-33.8 -6.6H-25.6V-1.2H-41.4Z'
  const cyl = roundRect(-31, -16.4, -18.6, -8.2, 1.8)
  const lamp = 'M-35 -31.4H-29.6V-26H-35Z'
  const wd = [[-25.2, -3.6, 3.6], [-10.6, -6.2, 6.2], [3.4, -6.2, 6.2], [17.4, -6.2, 6.2]]
  const crank = 2.25
  const pins = wd.slice(1).map(([x, y]) => [x + Math.cos(crank) * 2.6, y + Math.sin(crank) * 2.6])
  const band = (x: number) => `<path d="M${x - 0.6} -26H${x + 0.6}V-12H${x - 0.6}Z" fill="${P.gold}"/><path d="M${x + 0.6} -26V-12" stroke="${P.goldD}" stroke-width="${w(0.3)}"/>`
  return (
    k.draw([
      { d: stack, fill: P.night, inner: k.sh(stack, 0, 0, 1, 0, 0, 0.9, '#0F1736', 0.4) + `<path d="M-27.6 -35H-25.4V-26H-27.2Z" fill="${P.mid}"/>` },
      { d: stackRim, fill: P.night, inner: `<path d="M-29.6 -38.4H-19.6" stroke="${P.mid}" stroke-width="${w(0.5)}"/>` },
      { d: dome, fill: P.gold, inner: k.sh(dome, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M-7 -27C-7 -29.6 -5.6 -31 -4.2 -31.2" fill="none" stroke="#fff" stroke-width="${w(0.5)}" stroke-linecap="round"/>` },
      { d: sand, fill: P.gold, inner: k.sh(sand, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) },
      { d: cab, fill: ROJO, inner: k.sh(cab, 0, 0, 1, 0, 0, 0.8, ROJO_D, 0.45) + `<path d="${roundRect(13.6, -21, 31.4, -11, 0.8)}" fill="none" stroke="${P.goldL}" stroke-width="${w(0.35)}"/>` },
      { d: roof, fill: P.night, inner: `<path d="M10.6 -36.2C14 -38.6 30 -38.6 34 -36.2" fill="none" stroke="${P.mid}" stroke-width="${w(0.5)}"/>` },
      {
        d: boiler, fill: ROJO,
        inner: k.sh(boiler, 0, 0, 0, 1, 0, 0.95, ROJO_D, 0.5) + `<path d="M-22 -25.2H14V-22H-22Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.45, 0)}"/>` +
          band(-9.4) + band(1.8) + band(11.6) + hair(-18, -23.6, -4, -24.4, 10, -23.6, 0.45, '#fff', 0.7),
      },
      { d: smokebox, fill: P.night, inner: k.sh(smokebox, 0, 0, 0, 1, 0, 0.8, '#0F1736', 0.45) + `<path d="M-34 -24H-21V-22H-34Z" fill="${P.mid}" opacity=".7"/>` },
      { d: lamp, fill: P.gold, inner: k.sh(lamp, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) },
      { d: frame, fill: P.night, inner: `<path d="M-33 -11.6H34" stroke="${P.mid}" stroke-width="${w(0.5)}"/>` },
      { d: cyl, fill: P.sky2, inner: k.sh(cyl, 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) + `<path d="M-28.6 -16.4V-8.2M-21 -16.4V-8.2" stroke="${P.mid}" stroke-width="${w(0.4)}"/>` },
      { d: beam, fill: ROJO, inner: k.sh(beam, 0, 0, 1, 0, 0, 0.8, ROJO_D, 0.4) },
      { d: pilot, fill: P.sky2, inner: k.sh(pilot, 0, 0, 0, 1, 0, 0.8, P.mid, 0.45) + `<path d="M-31.6 -6.6L-37.4 -1.2M-29.2 -6.6L-33.4 -1.2M-27 -6.6L-29.4 -1.2" stroke="${P.mid}" stroke-width="${w(0.45)}"/>` },
    ], 0.7 / s) +
    // Ventana de la cabina, chapa de número y silbato.
    `<path d="${win}" fill="${P.sky1}" stroke="${P.ink}" stroke-width="${w(0.45)}"/>` + k.clip(win, k.sh(win, 0, 0, 1, 1, 0.1, 0.8, P.sky, 0.4) + `<path d="M17 -24L22 -32.4H24.4L19.4 -24Z" fill="#fff" opacity=".7"/>`) +
    `<path d="M20.9 -32.4V-23.2" stroke="${P.ink}" stroke-width="${w(0.35)}"/>` +
    (plate ? `<path d="${roundRect(16.4, -19.6, 28.6, -12.6, 1.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width="${w(0.35)}"/><text x="22.5" y="-14.6" ${GEORGIA} font-weight="700" font-size="5" fill="${P.ink}" text-anchor="middle">${plate}</text>` : '') +
    `<path d="M11.4 -36V-41.4" stroke="${P.ink}" stroke-width="${w(1.4)}"/><path d="M11.4 -36V-41.4" stroke="${P.gold}" stroke-width="${w(0.7)}"/><path d="M10.2 -42.2H12.6V-40.6H10.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width="${w(0.3)}"/>` +
    // Pasamanos, faro y remaches.
    `<path d="M-30 -21.4H10.6" stroke="${P.ink}" stroke-width="${w(0.9)}" stroke-linecap="round"/><path d="M-30 -21.4H10.6" stroke="${P.goldL}" stroke-width="${w(0.35)}" stroke-linecap="round"/>` +
    `<path d="${ellipse(-35.2, -28.7, 1, 2)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width="${w(0.3)}"/>` +
    [-24, -20, -16].map((y) => rivet(-21.6, y, 0.45)).join('') + [-33, -29, -25, -21, -17, -13].map((y) => rivet(32, y + 4, 0.4)).join('') +
    [-30, -26, -22, -18, -14].map((x) => rivet(x, -10.4, 0.38, P.sky1)).join('') +
    // Ruedas, bielas y la cruceta.
    wd.map(([x, y, r]) => wheel(k, x, y, r, crank, s)).join('') +
    `<path d="M-18.6 -12.4H-6M-18.6 -10.4H-6" stroke="${P.ink}" stroke-width="${w(0.5)}"/>` +
    rod(`M${f(pins[0][0])} ${f(pins[0][1])}L${f(pins[2][0])} ${f(pins[2][1])}`, P.sky1, 1.3 / s, '#fff') +
    rod(`M-12.6 -11.4L${f(pins[1][0])} ${f(pins[1][1])}`, P.sky1, 1.6 / s, '#fff') +
    `<path d="M-14.6 -13H-10.6V-9.8H-14.6Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width="${w(0.35)}"/>` +
    pins.map(([x, y]) => rivet(x, y, 0.75, P.gold)).join('')
  )
}

/** Coche de pasajeros de perfil, con la base sobre los rieles en y=0, de x=0 a x=`L`. */
function coach(k: Kit, L: number, s = 1) {
  const w = (n: number) => f(n / s)
  const body = roundRect(0, -28, L, -8, 1.6)
  const roof = `M-1 -27.6C1 -32.4 ${L - 1} -32.4 ${L + 1} -27.6Z`
  const n = Math.round((L - 8) / 6)
  const wins = Array.from({ length: n }, (_, i) => { const x = 5 + (i * (L - 10)) / n; return `<path d="${roundRect(f(x), -24, f(x + 3.8), -17.4, 0.8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width="${w(0.35)}"/>` }).join('')
  const truck = (x: number) => wheel(k, x - 3.4, -3, 3, 1, s) + wheel(k, x + 3.4, -3, 3, 1, s)
  return (
    k.draw([
      { d: roof, fill: P.night, inner: `<path d="M1 -28.6C4 -31 ${L - 4} -31 ${L - 1} -28.6" fill="none" stroke="${P.mid}" stroke-width="${w(0.5)}"/>` },
      { d: body, fill: ROJO, inner: k.sh(body, 0, 0, 0, 1, 0, 0.85, ROJO_D, 0.45) + `<path d="M0 -15H${L}V-13.6H0Z" fill="${P.goldL}"/><path d="M0 -26.4H${L}V-25.6H0Z" fill="${P.goldL}" opacity=".8"/>` },
      { d: `M2 -8.4H${L - 2}V-6.6H2Z`, fill: P.night },
    ], 0.6 / s) +
    wins + truck(9) + truck(L - 9)
  )
}

/** Picaboletos del guarda: dos mangos con fundas rojas y la boca con el sacabocados, con el eje en (0,0). */
function punch(k: Kit) {
  const hu = taper(0, -0.6, 10, -3.8, 21, -4.4, 4, 3)
  const hl = taper(0.4, 0.8, 10, 5.4, 19.6, 8.8, 4, 3)
  const gu = taper(9, -2.8, 15, -4.4, 21, -4.4, 4.6, 3.6)
  const gl = taper(9, 3.6, 14.6, 6.6, 19.6, 8.8, 4.6, 3.6)
  const jawU = 'M1 -2.2C-3 -3.6 -6 -5.6 -9.4 -5.8C-11.6 -6 -12.6 -4.8 -12.6 -3.4C-12.6 -2.2 -11.6 -1.4 -10 -1.2L1 1Z'
  const jawL = 'M1 2.6C-3 3.6 -6 5.4 -9.4 5.6C-11.6 5.8 -12.6 4.6 -12.6 3.4C-12.6 2.2 -11.6 1.4 -10 1.2L1 -.4Z'
  const metal = (d: string) => k.sh(d, 0, 0, 0, 1, 0, 0.95, P.mid, 0.45)
  return (
    `<path d="M14 -3C18 0 18 3 14 6.2" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M14 -3C18 0 18 3 14 6.2" fill="none" stroke="${P.sky2}" stroke-width=".6" stroke-linecap="round"/>` +
    k.draw([
      { d: hl, fill: P.sky1, inner: metal(hl) },
      { d: jawL, fill: P.sky1, inner: metal(jawL) },
      { d: gl, fill: ROJO, inner: k.sh(gl, 0, 0, 0, 1, 0, 0.9, ROJO_D, 0.45) + [12, 14.4, 16.8].map((x) => hair(x, 3.8 + (x - 9) * 0.45, x + 0.4, 5.4 + (x - 9) * 0.45, x, 7 + (x - 9) * 0.45, 0.35, ROJO_D)).join('') },
      { d: hu, fill: P.sky1, inner: metal(hu) + `<path d="M1 -1.6L9 -3.2" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` },
      { d: jawU, fill: P.sky1, inner: metal(jawU) + `<path d="M-10.6 -4.4C-8 -4.6 -5 -3.6 -1 -1.8" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` },
      { d: gu, fill: ROJO, inner: k.sh(gu, 0, 0, 0, 1, 0, 0.9, ROJO_D, 0.45) + `<path d="M10 -3.4L20 -5" stroke="${ROJO_L}" stroke-width=".6" stroke-linecap="round"/>` },
    ], 0.5) +
    `<circle cx="-9.4" cy="-3.6" r="1.7" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-9.4" cy="-3.6" r=".7" fill="${P.mid}"/>` +
    `<circle cx="0" cy=".2" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M-1 .2H1" stroke="${P.goldD}" stroke-width=".4"/>`
  )
}

export const AVENTUREROS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Boletería ──────────────────────────────────────────────────────

  // Cuatro billetes cumplidos: el boleto de cartón de segunda, recién picado por el guarda.
  'Boleto picado': (u) => {
    const k = kit(u)
    const card = roundRect(-23, -12.4, 23, 12.4, 1.6)
    const hole = (x: number, y: number, r: number) => `M${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}Z`
    const holed = card + hole(19.2, -7.4, 1.35) + hole(19.2, -3, 1.35) + hole(19.2, 1.4, 1.35)
    const band = 'M-24 -13H-10.4L-17.6 13H-24Z'
    return (
      fondo(k) +
      anden(k, 60, 61, 33) +
      `<g transform="translate(51 55) rotate(-12)">` +
      k.cast([card], 2.6, 2.6, ROJO_D) +
      k.draw([{
        d: holed, fill: CARTON,
        inner:
          k.sh(card, 0, 0, 1, 1, 0, 0.75, CARTON_D, 0.4) + `<path d="${band}" fill="${ROJO}"/>` + k.sh(band, 0, 0, 1, 1, 0, 0.8, ROJO_D, 0.4) +
          `<path d="${roundRect(-21.2, -10.6, 21.2, 10.6, 0.8)}" fill="none" stroke="${CARTON_D}" stroke-width=".4" stroke-dasharray="1.6 .7"/>` +
          `<path d="${roundRect(-20.4, -9.8, 20.4, 9.8, 0.6)}" fill="none" stroke="${CARTON_D}" stroke-width=".25"/>` +
          hair(-6, 9.2, 4, 8.4, 15, 9.4, 0.4, CARTON_D) + hair(-8, -10.6, 4, -11.4, 16, -10.6, 0.4, '#fff', 0.8) + hair(-22, -10, -21.6, 0, -22, 10, 0.5, ROJO_L, 0.8),
      }], 0.6) +
      `<text x="-17.6" y="4" ${GEORGIA} font-weight="700" font-size="10" fill="${P.paper}" text-anchor="middle" transform="rotate(-8 -17.6 0)">2ª</text>` +
      `<text x="3" y="-6.2" ${GEORGIA} font-size="2.6" fill="${P.mid}" text-anchor="middle" letter-spacing=".5">FERROCARRIL</text>` +
      `<text x="3" y="1" ${GEORGIA} font-weight="700" font-size="6.4" fill="${P.ink}" text-anchor="middle" letter-spacing=".3">BOLETO</text>` +
      `<path d="M-7.4 3.2H13.4" stroke="${ROJO}" stroke-width=".5"/><path d="M-5 4.2H11" stroke="${ROJO}" stroke-width=".25"/>` +
      `<text x="3" y="8.2" ${GEORGIA} font-style="italic" font-size="3.4" fill="${P.ink}" text-anchor="middle">Nº 0004</text>` +
      `<g transform="translate(19.6 18.6) rotate(48) scale(.92)">` + punch(k) + `</g>` +
      `</g>` +
      [[65.6, 71.4, 0.95], [61.6, 76.8, 0.8], [68, 81.2, 0.7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CARTON}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      hair(57.6, 72, 56.6, 76, 57.6, 80, 0.45, ROJO) + hair(71.6, 69, 73.6, 72, 73.4, 76, 0.45, ROJO) +
      sparkle(84, 36, 2.4) + sparkle(31, 74, 1.6) +
      k.defs()
    )
  },

  // Siete billetes: viajás más que un comisionista. La valija de cuero con el abono del mes, picado día por día.
  'Abono mensual': (u) => {
    const k = kit(u)
    const front = roundRect(38, 48, 90, 80, 2.4)
    const top = 'M40 48C40 45.4 41.4 44.2 44 44.2H84C86.6 44.2 88 45.4 88 48Z'
    const handle = 'M55.4 44.6C55.4 37.6 57.6 35.6 64 35.6C70.4 35.6 72.6 37.6 72.6 44.6H69.8C69.8 39.8 68.6 38.6 64 38.6C59.4 38.6 58.2 39.8 58.2 44.6Z'
    const strap = (x: number) => `M${x} 44.2H${x + 4.4}V80H${x}Z`
    const corner = (x: number, y: number, sx: number, sy: number) =>
      `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 0H6.4C5.2 1.2 3.4 1.8 1.8 1.8C1.8 3.4 1.2 5.2 0 6.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="1.5" cy="1.5" r=".5" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/></g>`
    const latch = (x: number) => `<path d="${roundRect(x - 2.4, 46.6, x + 2.4, 52.4, 0.8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M${x - 1.2} 49.6H${x + 1.2}" stroke="${P.goldD}" stroke-width=".5"/><circle cx="${x - 1}" cy="47.8" r=".4" fill="#fff"/>`
    const cardD = roundRect(-16, -10.6, 16, 10.6, 1.2)
    const holes = [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24]
    const grid = Array.from({ length: 28 }, (_, i) => {
      const c = i % 7, r = Math.floor(i / 7), x = -12.6 + c * 4.2, y = -2.8 + r * 3.3
      return `<rect x="${f(x - 1.6)}" y="${f(y - 1.3)}" width="3.2" height="2.6" fill="none" stroke="${CARTON_D}" stroke-width=".25"/>` +
        (holes.includes(i) ? `<circle cx="${f(x)}" cy="${f(y)}" r=".95" fill="${CUERO_D}"/>` : `<text x="${f(x)}" y="${f(y + 0.9)}" ${GEORGIA} font-size="2.2" fill="${P.ink}" text-anchor="middle">${i + 1}</text>`)
    }).join('')
    return (
      fondo(k) +
      anden(k, 60, 60, 33) +
      k.floor(64, 81, 28, 2.6, ROJO_D) +
      k.draw([
        { d: handle, fill: CUERO, inner: k.sh(handle, 0, 0, 1, 1, 0, 0.9, CUERO_D, 0.5) + `<path d="M57 42C57 38.6 59 37 64 37" fill="none" stroke="${CUERO_L}" stroke-width=".6" stroke-linecap="round"/>` },
        { d: top, fill: CUERO_L, inner: k.sh(top, 0, 0, 1, 0, 0, 0.8, CUERO, 0.4) },
        {
          d: front, fill: CUERO,
          inner:
            k.sh(front, 0, 0, 1, 1, 0, 0.9, CUERO_D, 0.5) + `<path d="M36 46H48V82H36Z" fill="${k.lin(CUERO_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
            `<path d="${roundRect(40, 50, 88, 78, 1.6)}" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray="1.2 .8" opacity=".85"/>` +
            `<path d="M38 55.4H90" stroke="${CUERO_D}" stroke-width=".5"/>` +
            hair(52, 62, 60, 60.6, 68, 62.4, 0.4, CUERO_D) + hair(74, 70, 80, 69, 86, 70.4, 0.35, CUERO_D) + hair(44, 74, 50, 73, 56, 74.4, 0.35, CUERO_D),
        },
        { d: strap(46), fill: CUERO_D, inner: `<path d="M46.6 44.2V80" stroke="${CUERO}" stroke-width=".4"/>` },
        { d: strap(77.6), fill: CUERO_D, inner: `<path d="M78.2 44.2V80" stroke="${CUERO}" stroke-width=".4"/>` },
      ], 0.7) +
      `<path d="M44.6 58.4H51.8V63.6H44.6ZM76.2 58.4H83.4V63.6H76.2Z" fill="none" stroke="${P.ink}" stroke-width="1.5"/><path d="M44.6 58.4H51.8V63.6H44.6ZM76.2 58.4H83.4V63.6H76.2Z" fill="none" stroke="${P.gold}" stroke-width=".7"/><path d="M48.2 58.4V63.6M79.8 58.4V63.6" stroke="${P.goldD}" stroke-width=".6"/>` +
      latch(56) + latch(72) +
      corner(38, 48, 1, 1) + corner(90, 48, -1, 1) + corner(38, 80, 1, -1) + corner(90, 80, -1, -1) +
      `<path d="M57.6 44.6H59.4M68.6 44.6H70.4" stroke="${P.ink}" stroke-width="1.6"/><path d="M57.6 44.6H59.4M68.6 44.6H70.4" stroke="${P.gold}" stroke-width=".8"/>` +
      // El abono, en su funda de celuloide, delante de la valija.
      `<g transform="translate(51 79) rotate(-11)">` +
      k.cast([cardD], 2, 2, CUERO_D) +
      k.draw([{
        d: cardD, fill: CARTON,
        inner: k.sh(cardD, 0, 0, 1, 1, 0, 0.6, CARTON_D, 0.35) + `<path d="M-17 -11H17V-5.4H-17Z" fill="${ROJO}"/>` + k.sh('M-17 -11H17V-5.4H-17Z', 0, 0, 0, 1, 0, 0.8, ROJO_D, 0.4) + grid,
      }], 0.55) +
      `<text x="0" y="-6.8" ${GEORGIA} font-weight="700" font-size="4.2" fill="${P.paper}" text-anchor="middle" letter-spacing=".5">ABONO</text>` +
      `<path d="M-13 -10.4L-8 -10.4L-16 10.6H-16Z" fill="#fff" opacity=".22"/><path d="M-5 -10.6H-1L-9.4 10.6H-13.4Z" fill="#fff" opacity=".15"/>` +
      `</g>` +
      sparkle(32, 44, 2) + sparkle(90, 36, 1.6) +
      k.defs()
    )
  },

  // Diez billetes: llegás a todos lados, hasta Salta por los viaductos. El tren cruza la Polvorilla sobre las nubes.
  'Tren a las Nubes': (u) => {
    const k = kit(u)
    const hills = 'M8 64L18 50L24 53L33 40L40 45L49 34L55 38L62 30L70 40L77 35L86 46L93 43L112 56V100H8Z'
    const deck = 'M8 59.6H112V66.4H8Z'
    const tower = (x: number) => {
      const t = 66.4, b = 112, wt = 5.4, wb = 11
      const leg = (sg: number) => `M${f(x + sg * wt)} ${t}L${f(x + sg * wb)} ${b}`
      const at = (y: number, sg: number) => f(x + sg * (wt + ((wb - wt) * (y - t)) / (b - t)))
      const ys = [66.4, 74, 82, 90, 98, 106]
      let brace = ''
      for (let i = 0; i < ys.length - 1; i++) brace += `M${at(ys[i], -1)} ${ys[i]}L${at(ys[i + 1], 1)} ${ys[i + 1]}M${at(ys[i], 1)} ${ys[i]}L${at(ys[i + 1], -1)} ${ys[i + 1]}M${at(ys[i + 1], -1)} ${ys[i + 1]}H${at(ys[i + 1], 1)}`
      return `<path d="${brace}" stroke="${P.ink}" stroke-width="1.1"/><path d="${brace}" stroke="${P.blue}" stroke-width=".45"/>` + rod(leg(-1), P.mid, 1.6, P.sky) + rod(leg(1), P.mid, 1.6)
    }
    const truss = Array.from({ length: 16 }, (_, i) => { const x = 8 + i * 6.6; return `M${f(x)} 66L${f(x + 3.3)} 60.2L${f(x + 6.6)} 66` }).join('')
    return (
      fondo(k) +
      k.sun(60, 36, 12, 44) +
      k.shade(ellipse(60, 36, 22, 18), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      k.draw([{
        d: hills, fill: P.sky,
        inner: k.sh(hills, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + k.clip(hills, `<path d="M0 0H120V42L93 47L88 44.6L84 47L79 40L75 42.6L70 37L65 40L62 34.6L58 39.6L55 41L50 38L46 42.6L40 47.6L35 44L31 47.6L24 56L18 54L0 62Z" fill="${P.white}"/>`) +
          hair(49, 35, 47, 42, 43, 48, 0.5, P.mid) + hair(33, 41, 31, 47, 27, 52, 0.45, P.mid) + hair(62, 31, 64, 38, 61, 45, 0.45, P.mid) + hair(77, 36, 79, 41, 76, 47, 0.4, P.mid) + hair(86, 47, 88, 51, 86, 56, 0.4, P.mid) +
          hair(55, 39, 57, 44, 56, 50, 0.4, P.blue) + hair(70, 41, 69, 46, 71, 52, 0.4, P.blue),
      }], 0.55) +
      tower(30) + tower(60) + tower(90) +
      // Nubes por debajo del puente.
      steam(k, 24, 88, 14, 6, 9, 0.3) + steam(k, 52, 92, 18, 7, 11, 0.1) + steam(k, 84, 88, 16, 6.4, 10, 0.5) + steam(k, 100, 82, 10, 5, 8) +
      k.draw([{
        d: deck, fill: P.mid,
        inner: `<path d="${truss}" fill="none" stroke="${P.sky}" stroke-width=".7"/>` + k.sh(deck, 0, 0, 0, 1, 0, 0.8, P.night, 0.4) + `<path d="M8 60.4H112" stroke="${P.sky1}" stroke-width=".6"/>` +
          Array.from({ length: 33 }, (_, i) => `<circle cx="${f(9 + i * 3.3)}" cy="65" r=".35" fill="${P.sky1}"/>`).join(''),
      }], 0.6) +
      `<path d="M8 59.2H112" stroke="${P.ink}" stroke-width=".9"/>` +
      // El tren: la locomotora adelante y dos coches.
      `<g transform="translate(29.6 59.2) scale(.36)">` +
      `<g transform="translate(37 0)">` + locoSide(k, 0.36) + `</g>` +
      `<g transform="translate(73 0)">` + coach(k, 46, 0.36) + `</g>` +
      `<g transform="translate(121 0)">` + coach(k, 46, 0.36) + `</g>` +
      `</g>` +
      steam(k, 45.6, 40, 4.2, 3, 7, 0, 0.4) + steam(k, 53, 36.4, 5.4, 3.6, 8, 0.4, 0.45) + steam(k, 62.8, 33.4, 6.4, 4, 8, 0.2, 0.45) + steam(k, 74, 30.4, 5, 3.4, 8, 0.5, 0.4) +
      sparkle(86, 34, 2.4) + sparkle(30, 46, 1.6) +
      k.defs()
    )
  },

  // ── Ruta más larga ─────────────────────────────────────────────────

  // Ganaste con la ruta más larga: la gorra a rayas del maquinista y su silbato de bronce.
  'Maquinista': (u) => {
    const k = kit(u)
    const crown = 'M32.4 47.4C32.4 41.6 44.6 37.8 60 37.8C75.4 37.8 87.6 41.6 87.6 47.4C87.4 53 85.4 57.4 82.6 60.4C74 63.6 46 63.6 37.4 60.4C34.6 57.4 32.6 53 32.4 47.4Z'
    const top = 'M32.4 47.4C32.4 41.6 44.6 37.8 60 37.8C75.4 37.8 87.6 41.6 87.6 47.4C87.6 52.6 75.4 55.8 60 55.8C44.6 55.8 32.4 52.6 32.4 47.4Z'
    const band = 'M37.4 59.6C46 62.8 74 62.8 82.6 59.6L82.4 66.6C74 69.8 46 69.8 37.6 66.6Z'
    const visor = 'M37.6 65.6C45 70.6 75 70.6 82.4 65.6C86.4 68.4 84 77.4 60 79C36 77.4 33.6 68.4 37.6 65.6Z'
    // Rayas: en el frente bajan hacia la vincha; en la tapa fugan hacia atrás.
    const front = Array.from({ length: 13 }, (_, i) => {
      const x = 33.2 + i * 4.4, xb = 60 + (x - 60) * 0.84
      return `M${f(x)} 48L${f(x + 1.9)} 48L${f(xb + 1.6)} 70H${f(xb)}Z`
    }).join('')
    const back = Array.from({ length: 13 }, (_, i) => {
      const x = 33.2 + i * 4.4, xb = 60 + (x - 60) * 0.6
      return `M${f(x)} 56.4L${f(xb)} 37H${f(xb + 1.2)}L${f(x + 1.9)} 56.4Z`
    }).join('')
    const pleats = [-5, -3, -1.4, 1.4, 3, 5].map((s) => hair(60 + s * 0.5, 46, 60 + s * 2.6, 47.4 + Math.abs(s) * 0.2, 60 + s * 4.6, 50.6 + Math.abs(s) * 0.3, 0.45, P.ink, 0.8)).join('')
    // Silbato de bronce: el barril, la boquilla y la argolla.
    const barrel = 'M-4.6 -4.8C-1.6 -6.6 3.4 -6.2 5.2 -3C6.8 -.2 5.6 3.6 2.6 4.8C-.6 6 -4.4 5 -5.8 2.4Z'
    const mouth = 'M-5.6 -2.4L-13.4 -3.4C-14.4 -3.6 -15 -2.8 -15 -1.8V.6C-15 1.6 -14.4 2.2 -13.4 2.2L-5.4 2.4Z'
    return (
      fondo(k) +
      anden(k, 60, 60, 33) +
      k.floor(61, 77, 26, 3, ROJO_D) +
      k.cast([crown, visor], 2, 2.2, ROJO_D) +
      k.draw([
        { d: crown, fill: P.white, inner: `<path d="${front}" fill="${P.mid}"/>` + k.sh(crown, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + k.sh('M30 55H90V64H30Z', 0, 0, 0, 1, 0, 0.8, P.mid, 0.35) + hair(36, 52, 37.4, 56.4, 39.4, 60.4, 0.5, P.ink) + hair(84, 52, 82.6, 56.4, 80.6, 60.4, 0.5, P.ink) + hair(46, 57, 47, 59.4, 48.4, 61.6, 0.4, P.ink, 0.7) + hair(70, 57.4, 71, 59.6, 70.6, 61.6, 0.4, P.ink, 0.7) },
        { d: top, fill: P.white, inner: `<path d="${back}" fill="${P.mid}"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M34 37H50V55H34Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` + pleats },
        { d: band, fill: P.white, inner: `<path d="${front}" fill="${P.mid}"/>` + k.sh(band, 0, 0, 1, 1, 0.2, 0.85, P.blue, 0.45) + `<path d="M37.4 61.2C46 64.4 74 64.4 82.6 61.2M37.6 65.2C46 68.4 74 68.4 82.4 65.2" fill="none" stroke="${P.ink}" stroke-width=".4" stroke-dasharray="1 .7"/>` },
        { d: visor, fill: P.night, inner: k.sh(visor, 0, 0, 1, 1, 0, 0.9, '#0F1736', 0.45) + `<path d="M41 71C50 74.6 70 74.6 79 71" fill="none" stroke="${P.mid}" stroke-width=".7" stroke-linecap="round"/><path d="M38.6 68.8C42 71.8 48 73.4 52 73.8" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` },
      ], 0.8) +
      `<path d="M32.6 47.6C33.4 52.6 45 55.8 60 55.8C75 55.8 86.6 52.6 87.4 47.6" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="M34.2 49.6C36 53.6 47 56.8 60 56.8C73 56.8 84 53.6 85.8 49.6" fill="none" stroke="${P.ink}" stroke-width=".35" stroke-dasharray=".9 .7"/>` +
      `<ellipse cx="60" cy="46" rx="2.2" ry="1.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/><ellipse cx="59.5" cy="45.6" rx=".7" ry=".4" fill="${P.sky}"/>` +
      // La chapa de la gorra: una locomotorita repujada en bronce.
      k.draw([{ d: ellipse(60, 63.6, 6.4, 3.6), fill: P.gold, inner: k.sh(ellipse(60, 63.6, 6.4, 3.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.45) +
      `<path d="M55.8 64.8H63.4V62.8H61.6V61H60.4V62.8H58V61.6H56.8V62.8H55.8ZM63.4 64.8H64.6L64 63.6H63.4Z" fill="${P.goldD}"/><circle cx="57.4" cy="65.2" r=".7" fill="${P.goldD}"/><circle cx="61.8" cy="65.2" r=".7" fill="${P.goldD}"/>` +
      `<ellipse cx="60" cy="63.6" rx="5.4" ry="2.8" fill="none" stroke="${P.goldD}" stroke-width=".3" stroke-dasharray=".01 .9" stroke-linecap="round"/>` +
      // El cordón rojo y el silbato.
      `<path d="M83.2 64C90 68 92 76 86 81.6" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M83.2 64C90 68 92 76 86 81.6" fill="none" stroke="${ROJO}" stroke-width=".9" stroke-linecap="round" stroke-dasharray="1.2 .5"/>` +
      `<g transform="translate(80.4 84.4) rotate(-24)">` +
      `<circle cx="6.6" cy="-5.6" r="1.9" fill="none" stroke="${P.ink}" stroke-width="1.5"/><circle cx="6.6" cy="-5.6" r="1.9" fill="none" stroke="${P.gold}" stroke-width=".6"/>` +
      k.draw([
        { d: mouth, fill: P.gold, inner: k.sh(mouth, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-14 -2.2H-6" stroke="#fff" stroke-width=".45"/>` },
        { d: barrel, fill: P.gold, inner: k.sh(barrel, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-3.4 -3.6C-1 -4.8 2 -4.6 3.4 -2.8" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` },
      ], 0.55) +
      `<path d="M-4.6 -4.6L-2 -6.4L.4 -5.6L-2.2 -3.8Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      hair(64, 88, 68, 92, 72, 93, 0.6, ROJO) + hair(61.6, 84, 63, 89.4, 66.4, 93, 0.5, ROJO) +
      sparkle(32, 42, 2.2) + sparkle(90, 44, 1.6) +
      k.defs()
    )
  },

  // Tres victorias: lujo y algún misterio. La ventanilla del coche cama, de noche, y la lupa sobre una huella.
  'Expreso de Oriente': (u) => {
    const k = kit(u)
    const side = 'M8 40C26 34.4 94 34.4 112 40V120H8Z'
    const roof = 'M8 40C26 34.4 94 34.4 112 40V43.4C94 37.8 26 37.8 8 43.4Z'
    const win = roundRect(34, 46, 86, 76, 4)
    const curtL = 'M34 46H43.6C43 52 42.4 57 43.4 61C41 63.6 40 69 40.4 76H34Z'
    const curtR = 'M86 46H76.4C77 52 77.6 57 76.6 61C79 63.6 80 69 79.6 76H86Z'
    const valance = 'M34 46H86V49.6C83.4 51.4 80.8 51.4 78.2 49.6C75.6 51.4 73 51.4 70.4 49.6C67.8 51.4 65.2 51.4 62.6 49.6C60 51.4 57.4 51.4 54.8 49.6C52.2 51.4 49.6 51.4 47 49.6C44.4 51.4 41.8 51.4 39.2 49.6C36.6 51.4 34 51.4 34 49.6Z'
    const shade = 'M47.4 62.6H56.6L59.6 68.8H44.4Z'
    const lx = 73, ly = 61, lr = 10.4, rr = 12.6
    const lens = ellipse(lx, ly, lr, lr)
    const rim = `${ellipse(lx, ly, rr, rr)} M${f(lx - lr)} ${ly}A${lr} ${lr} 0 1 1 ${f(lx + lr)} ${ly}A${lr} ${lr} 0 1 1 ${f(lx - lr)} ${ly}Z`
    const grip = `M${f(lx + 8.4)} ${f(ly + 10.6)}L${f(lx + 10.6)} ${f(ly + 8.4)}L${f(lx + 22.4)} ${f(ly + 20.2)}C${f(lx + 23.6)} ${f(ly + 21.4)} ${f(lx + 23.6)} ${f(ly + 23)} ${f(lx + 22.4)} ${f(ly + 24.2)}C${f(lx + 21.2)} ${f(ly + 25.4)} ${f(lx + 19.6)} ${f(ly + 25.4)} ${f(lx + 18.4)} ${f(ly + 24.2)}Z`
    const print = Array.from({ length: 7 }, (_, i) => {
      const r = 1.3 + i * 1.2
      return `<path d="M${f(lx - r)} ${f(ly + r * 0.3)}C${f(lx - r)} ${f(ly - r * 1.2)} ${f(lx + r)} ${f(ly - r * 1.2)} ${f(lx + r)} ${f(ly + r * 0.2)}${i > 3 ? `C${f(lx + r)} ${f(ly + r * 0.8)} ${f(lx + r * 0.6)} ${f(ly + r)} ${f(lx + r * 0.3)} ${f(ly + r * 1.1)}` : ''}" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>`
    }).join('')
    return (
      noche(k) +
      [[28, 26, 0.6], [40, 21, 0.45], [80, 22, 0.55], [92, 30, 0.5], [60, 20, 0.4], [70, 26, 0.35]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      sparkle(52, 26, 1.6, P.goldL) +
      k.draw([
        {
          d: side, fill: ROJO_D,
          inner:
            k.sh(side, 0, 0, 1, 1, 0, 0.8, '#3E0B12', 0.5) + `<path d="M8 44H30V120H8Z" fill="${k.lin(ROJO, 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<path d="M14 44.4C30 40.4 90 40.4 106 44.4V98H14Z" fill="none" stroke="${P.gold}" stroke-width=".6"/><path d="M16.4 46.6C31 43 89 43 103.6 46.6V95.6H16.4Z" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` +
            `<path d="M20 50H30V92H20ZM90 50H100V92H90Z" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
            hair(22, 56, 25, 71, 22, 86, 0.4, '#3E0B12') + hair(98, 56, 95, 71, 98, 86, 0.4, '#3E0B12'),
        },
        { d: roof, fill: P.night, inner: `<path d="M8 41.4C26 35.8 94 35.8 112 41.4" fill="none" stroke="${P.mid}" stroke-width=".6"/>` },
      ], 0.6) +
      `<path d="${starPathRose(25, 71, 2.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><path d="${starPathRose(95, 71, 2.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      // La ventanilla encendida, con las cortinas de terciopelo y el velador del coche comedor.
      k.draw([{
        d: win, fill: P.goldL,
        inner:
          k.shade(win, k.rad(P.gold, 0.5, 0.75, 0.75, 0, 0.9), P.goldD, 0.4) +
          k.shade(ellipse(52, 66, 13, 9), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.8, 0), '#ffffff', 0.5) +
          k.draw([{ d: shade, fill: ROJO_L, inner: k.sh(shade, 0, 0, 1, 0, 0, 0.8, ROJO, 0.45) + `<path d="M49 62.8L47 68.6M52 62.6V68.8M55 62.8L57 68.6" stroke="${ROJO}" stroke-width=".35"/>` }], 0.4) +
          `<path d="M44.6 68.8Q46 70.4 47.4 68.8Q48.8 70.4 50.2 68.8Q51.6 70.4 53 68.8Q54.4 70.4 55.8 68.8Q57.2 70.4 58.6 68.8" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
          `<path d="M51.4 68.8H52.6V74.6H51.4Z" fill="${P.goldD}"/><path d="M48.6 74.6C48.6 73.6 55.4 73.6 55.4 74.6V76H48.6Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/>` +
          `<path d="M34 74H86V77H34Z" fill="${P.white}"/><path d="M34 74H86" stroke="${P.ink}" stroke-width=".35"/>` +
          k.draw([
            { d: curtL, fill: ROJO, inner: k.sh(curtL, 0, 0, 1, 0, 0, 0.9, ROJO_D, 0.45) + hair(37, 47, 37.4, 56, 36.6, 75, 0.5, ROJO_D) + hair(40.6, 47, 41, 54, 42.4, 61, 0.45, ROJO_D) + hair(42.4, 64.4, 41.4, 70, 41.8, 75, 0.4, ROJO_D) },
            { d: curtR, fill: ROJO, inner: k.sh(curtR, 0, 0, 1, 0, 0.2, 0.95, ROJO_D, 0.45) + hair(83, 47, 82.6, 56, 83.4, 75, 0.5, ROJO_D) + hair(79.4, 47, 79, 54, 77.6, 61, 0.45, ROJO_D) + hair(77.6, 64.4, 78.6, 70, 78.2, 75, 0.4, ROJO_D) },
            { d: valance, fill: ROJO_D, inner: `<path d="M34 47.4H86" stroke="${P.gold}" stroke-width=".5"/>` },
          ], 0.4) +
          `<path d="M41.8 60.6C42.4 61.8 44.2 62 44.6 60.8M75.4 60.8C75.8 62 77.6 61.8 78.2 60.6" fill="none" stroke="${P.gold}" stroke-width=".9" stroke-linecap="round"/>` +
          [39.2, 47, 54.8, 62.6, 70.4, 78.2].map((x) => `<circle cx="${f(x - 2.6)}" cy="51.4" r=".6" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/>`).join(''),
      }], 0.7) +
      `<path d="${roundRect(32.6, 44.6, 87.4, 77.4, 5)}" fill="none" stroke="${P.gold}" stroke-width=".9"/>` +
      `<text x="60" y="88.6" ${GEORGIA} font-size="3.6" fill="${P.gold}" text-anchor="middle" letter-spacing=".6">EXPRESO DE ORIENTE</text>` +
      `<path d="M38 84.4H82M38 90.6H82" stroke="${P.goldD}" stroke-width=".35"/>` +
      // La lupa: aro de bronce, el vidrio con la huella agrandada y el mango de madera.
      k.cast([ellipse(lx, ly, rr, rr), grip], 2.2, 2.2, '#000') +
      `<path d="${lens}" fill="#fff" opacity=".2"/>` + k.clip(lens, print + `<path d="M${lx - 9} ${ly - 3}C${lx - 7} ${ly - 7} ${lx - 4} ${ly - 8.6} ${lx} ${ly - 8.8}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`) +
      k.draw([
        { d: grip, fill: P.brownD, inner: k.sh(grip, 0, 0, 1, 1, 0, 0.9, '#3A1E10', 0.5) + `<path d="M${lx + 10.6} ${ly + 10}L${lx + 21.4} ${ly + 21}" stroke="${P.brown}" stroke-width=".7" stroke-linecap="round"/>` },
        { d: rim, fill: P.gold, inner: k.sh(ellipse(lx, ly, rr, rr), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M${lx - 11.2} ${ly - 5}C${lx - 9} ${ly - 9.6} ${lx - 5} ${ly - 11.6} ${lx} ${ly - 11.6}" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` },
      ], 0.7) +
      `<path d="M${lx + 7.6} ${ly + 9.8}L${lx + 9.8} ${ly + 7.6}L${lx + 12.4} ${ly + 10.2}L${lx + 10.2} ${ly + 12.4}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="${ellipse(lx, ly, 11.5, 11.5)}" fill="none" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
      k.defs()
    )
  },

  // Siete victorias de punta a punta del mapa: la locomotora rusa de frente, abriéndose paso en la nieve con el quitanieves.
  'Transiberiano': (u) => {
    const k = kit(u)
    const snow = 'M0 78C30 74 90 74 120 78V130H0Z'
    const ridge = 'M8 76L12 70L15 74L19 66L23 74L27 69L30 75H90L93 69L97 74L101 66L105 74L108 70L112 76Z'
    return (
      fondo(k) +
      k.sun(60, 50, 18, 48, 28, false) +
      k.shade(ellipse(60, 50, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<path d="${ridge}" fill="${P.blue}" opacity=".55"/>` +
      k.draw([{ d: snow, fill: NIEVE, inner: k.sh(snow, 0, 0, 0, 1, 0, 0.7, P.sky2, 0.45) + hair(20, 84, 30, 82, 40, 84, 0.45, P.sky) + hair(80, 84, 90, 82, 100, 84, 0.45, P.sky) + hair(14, 92, 24, 90, 34, 92.4, 0.4, P.sky) + hair(86, 92, 96, 90, 106, 92.4, 0.4, P.sky) }], 0.5) +
      `<path d="M52 98L40 112M68 98L80 112" stroke="${P.blue}" stroke-width=".8" opacity=".7"/>` +
      `<g transform="translate(60 97.6) scale(.93)">` + locoFront(k) + `</g>` +
      [[26, 40, 0.8], [33, 56, 0.6], [92, 46, 0.7], [86, 60, 0.55], [40, 30, 0.5], [79, 30, 0.6], [24, 64, 0.5], [96, 66, 0.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${P.blue}" stroke-width=".25"/>`).join('') +
      k.defs()
    )
  },

  // ── Locomotora ─────────────────────────────────────────────────────

  // Cien puntos: paseo tranquilo con vista al río. El coche motor de la costa sobre el terraplén, con el río a los dos
  // lados, su reflejo en el agua y un velero.
  'Trencito de la Costa': (u) => {
    const k = kit(u)
    const river = 'M0 66H120V130H0Z'
    const wall = 'M6 81.4H114V88.6H6Z'
    const body = 'M30 79V61.6C30 57.6 32.6 55.4 36.6 55.4H83.4C87.4 55.4 90 57.6 90 61.6V79Z'
    const roof = 'M31.2 56C33 53 36 52.2 40 52.2H80C84 52.2 87 53 88.8 56Z'
    const sail = 'M90 44.6V65H79C82.4 59 86.4 51.6 90 44.6Z'
    const jib = 'M91.2 47.6L98 65H91.2Z'
    const hull = 'M77.6 65.6H99.6L97.4 68.6H79.8Z'
    const wins = [39.6, 47.4, 55.2, 62.8, 70.6].map((x) => `<path d="${roundRect(x, 59.4, x + 5.6, 66.4, 1.2)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/><path d="M${f(x + 0.8)} 66L${f(x + 3.2)} 59.8H${f(x + 4.6)}L${f(x + 2.2)} 66Z" fill="#fff" opacity=".75"/>`).join('')
    const stones = Array.from({ length: 3 }, (_, r) => Array.from({ length: 12 }, (_, i) => `M${f(8 + i * 9.4 + (r % 2) * 4.7)} ${f(81.4 + r * 2.4)}V${f(83.8 + r * 2.4)}`).join('') + `M6 ${f(83.8 + r * 2.4)}H114`).join('')
    const ripple = (y: number, x0: number, x1: number, c: string, w: number) => hair(x0, y, (x0 + x1) / 2, y - 0.6, x1, y, w, c)
    return (
      fondo(k) +
      k.sun(34, 38, 6, 16, 24) +
      k.draw([{
        d: river, fill: P.sky,
        inner: k.sh(river, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M0 66H120V67.6H0Z" fill="${P.sky1}"/>` +
          ripple(70, 14, 24, '#fff', 0.5) + ripple(72.6, 100, 110, '#fff', 0.45) + ripple(68.6, 30, 38, P.gold, 0.5) +
          // Debajo del terraplén: el reflejo rojo del coche, hecho de rayitas que tiemblan.
          [92, 94.6, 97.2, 99.8].map((y, i) => ripple(y, 34 + i * 1.6, 68 - i * 1.4, ROJO, 0.8) + ripple(y + 1.2, 38 + i, 62 - i, P.paper, 0.5)).join('') +
          ripple(92.6, 18, 28, '#fff', 0.5) + ripple(95, 80, 90, '#fff', 0.45) + ripple(91.4, 31, 36, P.gold, 0.45),
      }], 0.4) +
      // El velero, del otro lado del terraplén.
      `<path d="M90 44V66" stroke="${P.ink}" stroke-width=".7"/>` +
      k.draw([
        { d: sail, fill: P.white, inner: k.sh(sail, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) + hair(84, 62, 87, 56, 89.4, 49, 0.35, P.sky) + `<path d="M80 62.4H90" stroke="${ROJO}" stroke-width=".9"/>` },
        { d: jib, fill: P.white, inner: k.sh(jib, 0, 0, 1, 0, 0, 0.7, P.sky2, 0.4) },
        { d: hull, fill: P.night, inner: `<path d="M77.6 66.6H99.6" stroke="${P.paper}" stroke-width=".5"/>` },
      ], 0.4) +
      `<path d="M89.6 43.6L93 45.2L89.6 46.6Z" fill="${ROJO}" stroke="${P.ink}" stroke-width=".3"/>` +
      // El terraplén de piedra y los rieles.
      k.draw([{ d: wall, fill: '#E9DEC8', inner: `<path d="${stones}" fill="none" stroke="${CARTON_D}" stroke-width=".4"/>` + k.sh(wall, 0, 0, 0, 1, 0, 0.8, P.blue, 0.35) }], 0.5) +
      Array.from({ length: 19 }, (_, i) => `<path d="M${f(10 + i * 5.4)} 80.2V82" stroke="${P.brownD}" stroke-width="1.4"/>`).join('') +
      `<path d="M8 80H112" stroke="${P.ink}" stroke-width="1.5"/><path d="M8 79.7H112" stroke="${P.sky1}" stroke-width=".5"/>` +
      `<g transform="translate(55 80) scale(.88) translate(-60 -81.6)">` +
      k.floor(60, 81.6, 32, 1.8, P.night) +
      // El coche motor: carrocería roja con faja crema, pantógrafo, faro y bogies.
      `<path d="M50 52.4L54.6 46.6L59.4 52.4M54.6 46.6L48 44.8H62" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linejoin="round"/><path d="M50 52.4L54.6 46.6L59.4 52.4M54.6 46.6L48 44.8H62" fill="none" stroke="${P.sky1}" stroke-width=".55" stroke-linejoin="round"/>` +
      k.draw([
        { d: roof, fill: P.sky2, inner: k.sh(roof, 0, 0, 0, 1, 0, 0.8, P.mid, 0.4) + `<path d="M40 53.4H80" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` },
        {
          d: body, fill: ROJO,
          inner:
            k.sh(body, 0, 0, 1, 1, 0, 0.85, ROJO_D, 0.45) + `<path d="M28 56H38V80H28Z" fill="${k.lin(ROJO_L, 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<path d="M30 57.4H90V68.4H30Z" fill="${P.paper}"/>` + k.sh('M30 57.4H90V68.4H30Z', 0, 0, 1, 1, 0, 0.6, CARTON_D, 0.35) +
            `<path d="M30 70.6H90M30 72H90" stroke="${P.goldL}" stroke-width=".45"/>` +
            `<path d="M79.6 58.6H86.2V77.4H79.6Z" fill="${ROJO_D}"/><path d="M80.6 59.6H85.2V66.4H80.6Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/><circle cx="84.4" cy="71.4" r=".5" fill="${P.goldL}"/>` +
            [34, 42, 50, 58, 66, 74].map((x) => rivet(x, 74.6, 0.35)).join('') + hair(36, 76.6, 56, 76, 76, 76.6, 0.4, ROJO_D),
        },
      ], 0.7) +
      wins +
      `<path d="${roundRect(31.4, 59.4, 37, 66.4, 1.6)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<circle cx="31.4" cy="74" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M28.6 77.4H32" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/>` +
      wheel(k, 39, 79.4, 2.6, 1, 0.88) + wheel(k, 46, 79.4, 2.6, 1, 0.88) + wheel(k, 74, 79.4, 2.6, 1, 0.88) + wheel(k, 81, 79.4, 2.6, 1, 0.88) +
      `</g>` +
      sparkle(56, 32, 2) + sparkle(98, 52, 1.4) +
      k.defs()
    )
  },

  // Ciento treinta puntos: chucu-chucu y humo por todos lados. La locomotora a vapor de perfil, envuelta en su vapor.
  'Locomotora a vapor': (u) => {
    const k = kit(u)
    return (
      fondo(k) +
      anden(k, 60, 58, 34) +
      steam(k, 52, 31, 7, 5, 9, 0.2) + steam(k, 66, 27, 8.4, 5.6, 9, 0.6) + steam(k, 80, 32, 7.6, 5.4, 9, 0.4) + steam(k, 90, 42, 5.6, 4.4, 8) +
      steam(k, 41.6, 36.6, 4.6, 3.6, 8, 0.3, 0.5) +
      `<path d="M14 80.6H106" stroke="${P.ink}" stroke-width="1.6"/><path d="M14 80.3H106" stroke="${P.sky1}" stroke-width=".5"/>` +
      Array.from({ length: 16 }, (_, i) => `<path d="M${f(18 + i * 5.6)} 81.4V83.4" stroke="${P.brownD}" stroke-width="1.6"/>`).join('') +
      k.floor(62, 81, 34, 2.2, ROJO_D) +
      `<g transform="translate(62.8 80) scale(.92)">` + locoSide(k, 0.92, '130') + `</g>` +
      steam(k, 30, 75, 6.4, 4.2, 8, 0.3) + steam(k, 39.6, 79, 5, 3.4, 7) + steam(k, 26, 82, 4, 2.8, 7, 0.5, 0.45) +
      `<text x="60" y="92.6" ${GEORGIA} font-style="italic" font-size="5.4" fill="${P.ink}" text-anchor="middle" transform="rotate(-4 60 92.6)">chucu-chucu</text>` +
      sparkle(31, 50, 2) + sparkle(92, 60, 1.4) +
      k.defs()
    )
  },

  // Ciento sesenta puntos: pasaste y nadie te vio. El tren bala sale de la gloria, con las hojas volando atrás.
  'Tren bala': (u) => {
    const k = kit(u)
    const body = 'M60 -15H6C-6 -15 -18 -12 -28 -6C-35 -1.8 -41 2.6 -42.4 5.2C-43 6.6 -42 8 -40 8.6C-36 9.6 -30 10 -24 10H60Z'
    const glass = 'M-1.6 -14.4C-10 -13.8 -18 -10.8 -24 -6.6C-20 -6 -12 -6.4 -6.4 -8C-3.4 -9 -1.4 -11.4 -1.6 -14.4Z'
    const stripe = 'M60 .6H-22C-28 .6 -34 1.6 -39.6 4.2L-40.6 6C-35 4 -29 3.6 -22 3.6H60Z'
    const skirt = 'M60 6.6H-24C-30 6.6 -35 7 -39 7.8C-36 9.4 -30 10 -24 10H60Z'
    const wins = Array.from({ length: 9 }, (_, i) => { const x = 12 + i * 5; return `<path d="${roundRect(x, -10.2, x + 3, -6.4, 0.9)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/><path d="M${f(x + 0.5)} -6.8L${f(x + 1.9)} -9.8H${f(x + 2.6)}L${f(x + 1.2)} -6.8Z" fill="${P.sky}" opacity=".8"/>` }).join('')
    const leaf = (x: number, y: number, r: number, c: string) => `<path d="M0 0C1.6 -2.4 5 -2.8 7 -.6C5 1.4 2 1.6 0 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${c}" stroke="${P.ink}" stroke-width=".35"/><path d="M.8 -.3L6 -.6" transform="translate(${x} ${y}) rotate(${r})" stroke="${P.greenD}" stroke-width=".3"/>`
    return (
      fondo(k) +
      k.sun(52, 56, 15, 48, 32, false) +
      k.shade(ellipse(52, 56, 24, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<g transform="translate(70 63) rotate(-9)">` +
      hair(-14, -21, 16, -20.4, 50, -21.4, 0.8, P.blue) + hair(2, -27, 28, -26.4, 54, -27, 0.6, P.blue) + hair(-20, -32, 0, -31.6, 22, -32, 0.45, P.blue) +
      hair(-8, 18, 22, 17.4, 52, 18.2, 0.8, P.blue) + hair(8, 24, 32, 23.4, 56, 24, 0.55, P.blue) + hair(-24, 22, -12, 21.6, 2, 22, 0.45, P.blue) +
      hair(-50, -10, -40, -10.4, -30, -10, 0.5, '#fff') + hair(-52, 12, -42, 11.6, -32, 12, 0.5, '#fff') +
      `<path d="M-30 13.4H60" stroke="${P.ink}" stroke-width="1.4"/><path d="M-30 13.1H60" stroke="${P.sky1}" stroke-width=".45"/>` +
      k.cast([body], 2.2, 2.4, ROJO_D) +
      k.draw([{
        d: body, fill: P.white,
        inner:
          k.sh(body, 0, 0, 0, 1, 0.05, 0.75, P.sky2, 0.45) + `<path d="M-44 -16H60V-10C30 -12 -10 -12 -44 -4Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.8, 0)}"/>` +
          `<path d="${skirt}" fill="${P.sky2}"/>` + k.sh(skirt, 0, 0, 0, 1, 0, 0.9, P.blue, 0.4) +
          `<path d="${stripe}" fill="${ROJO}"/>` + k.sh(stripe, 0, 0, 0, 1, 0, 0.6, ROJO_D, 0.4) + `<path d="M60 4.8H-22C-28 4.8 -33 5.4 -37 6.4" fill="none" stroke="${ROJO}" stroke-width=".6"/>` +
          `<path d="M3.4 -12.6V6.4M7.6 -12.6V6.4" stroke="${P.blue}" stroke-width=".4"/>` +
          hair(-30, -2.6, -18, -9, -2, -12.6, 0.45, P.sky) + hair(-39, 4, -30, 1.8, -20, .8, 0.4, ROJO_D) +
          `<path d="M-36 -.6C-30 -5 -20 -10 -8 -12.6" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>`,
      }], 0.75) +
      k.draw([{ d: glass, fill: P.night, inner: k.sh(glass, 0, 0, 1, 1, 0, 0.6, P.mid, 0.4) + `<path d="M-18 -9.4C-14 -11.8 -9 -13 -4.4 -13.4L-5 -12.2C-9 -11.8 -13 -10.4 -16 -8.6Z" fill="${P.sky}"/>` }], 0.4) +
      wins +
      `<ellipse cx="-36.4" cy="2" rx="2" ry="1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35" transform="rotate(-24 -36.4 2)"/>` +
      `<path d="M14 10H34V12.6H14Z" fill="${P.night}"/><circle cx="18" cy="12" r="1.6" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".35"/><circle cx="30" cy="12" r="1.6" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M40 -15L44 -20.6L48 -15M44 -20.6H38.6" fill="none" stroke="${P.ink}" stroke-width="1.1" stroke-linejoin="round"/><path d="M40 -15L44 -20.6L48 -15M44 -20.6H38.6" fill="none" stroke="${P.sky1}" stroke-width=".4" stroke-linejoin="round"/>` +
      `</g>` +
      leaf(84, 41, -30, P.green) + leaf(76, 84, 20, P.gold) + leaf(88, 76, 60, P.green) +
      hair(76, 42, 79, 40, 82, 40.6, 0.4, P.blue) + hair(71, 82, 73, 83, 75, 82.6, 0.4, P.blue) +
      sparkle(30, 70, 2.6, '#fff') + sparkle(78, 34, 1.8) +
      k.defs()
    )
  },
}

/** Rosetón de marquetería (estrella de ocho puntas) para los paneles del coche. */
function starPathRose(cx: number, cy: number, r: number) {
  let d = ''
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.42 : r
    d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * rr) + ' ' + f(cy + Math.sin(a) * rr)
  }
  return d + 'Z'
}

/** Locomotora rusa de frente, con los rieles en y=0: quitanieves rojo, viga con paragolpes, la puerta redonda de la
 * caja de humo con sus bisagras, el faro arriba, la chimenea y la cabina asomando detrás. */
function locoFront(k: Kit) {
  const cab = 'M-25 -27V-62C-25 -66.4 -14 -69 0 -69C14 -69 25 -66.4 25 -62V-27Z'
  const walk = 'M-26.4 -28H26.4V-24.6H-26.4Z'
  const beam = 'M-23.4 -24.8H23.4V-15.6H-23.4Z'
  const plow = 'M-20.6 -15.8H20.6L26 -1C15 .8 -15 .8 -26 -1Z'
  const box = ellipse(0, -43, 15.6, 15.6)
  const door = ellipse(0, -42.4, 12.2, 12.2)
  const chimney = 'M-4.4 -70.4H4.4V-58H-4.4Z'
  const lip = 'M-5.6 -73H5.6V-70.2H-5.6Z'
  const lamp = ellipse(0, -59.4, 5, 5)
  const buffer = (x: number) => `<path d="M${x - 1.2} -20.2H${x + 1.2}" stroke="${P.ink}" stroke-width="3"/><circle cx="${x}" cy="-20.2" r="3.4" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".6"/><circle cx="${x}" cy="-20.2" r="3.4" fill="${k.rad(P.mid, 0.6, 0.6, 0.6, 0, 0.8)}"/><path d="M${x - 2.2} -21.4A2.4 2.4 0 0 1 ${x - 0.6} -22.8" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>`
  const marker = (x: number) => `<circle cx="${x}" cy="-31.6" r="2.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${x}" cy="-31.6" r="1.2" fill="#fff"/><path d="M${x} -29.4V-28" stroke="${P.ink}" stroke-width=".8"/>`
  const ribs = [-15, -10, -5, 5, 10, 15].map((x) => `<path d="M${x} -15.6L${f(x * 1.26)} -.6" stroke="${ROJO_D}" stroke-width=".6"/>`).join('')
  const hinge = (y: number) => `<path d="M-12 ${y}H-3" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M-12 ${y}H-3" stroke="${P.sky}" stroke-width=".7" stroke-linecap="round"/>`
  return (
    // El penacho de vapor, detrás de todo.
    steam(k, 2, -78.6, 7, 5, 9, 0.2) + steam(k, 13, -82.4, 7.6, 5, 9, 0.5) + steam(k, -9.4, -81.6, 5.4, 4, 8) +
    k.draw([
      {
        d: cab, fill: ROJO,
        inner: k.sh(cab, 0, 0, 1, 0, 0, 0.9, ROJO_D, 0.5) + `<path d="M-26 -70H-14V-26H-26Z" fill="${k.lin(ROJO_L, 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="M-26 -71C-14 -68.4 14 -68.4 26 -71V-64.6C14 -67.4 -14 -67.4 -26 -64.6Z" fill="${P.night}"/><path d="M-25 -64.6C-14 -67.4 14 -67.4 25 -64.6" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` +
          `<path d="M-21.6 -63V-29M21.6 -63V-29M-25 -45H-16M16 -45H25" stroke="${ROJO_D}" stroke-width=".5"/>` +
          [0, 1, 2, 3, 4, 5, 6].map((i) => hair(19 + i * 0.9, -60, 19.4 + i * 0.9, -46, 19 + i * 0.9, -30, 0.35, ROJO_D, 0.8)).join('') +
          [-60, -54, -48, -42, -36, -30].map((y) => rivet(-23.4, y, 0.42) + rivet(23.4, y, 0.42)).join(''),
      },
      { d: lip, fill: P.night, inner: `<path d="M-5.6 -72H5.6" stroke="${P.mid}" stroke-width=".6"/>` },
      { d: chimney, fill: P.night, inner: `<path d="M-3.4 -70H-1.6V-58H-3.4Z" fill="${P.mid}"/>` },
      {
        d: box, fill: P.night,
        inner: k.sh(box, 0, 0, 1, 1, 0, 0.8, '#0F1736', 0.45) + `<path d="M-16 -59H-6V-27H-16Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.9, 0)}"/>`,
      },
    ], 0.75) +
    // Nieve sobre el techo de la cabina y los deflectores de humo, de canto.
    steam(k, -17, -68.6, 6, 2, 7, 0, 0.4) + steam(k, 17, -68.6, 6, 2, 7, 0.5, 0.4) +
    k.draw([
      { d: 'M-19.4 -62.4L-15.8 -61V-27H-19.4Z', fill: ROJO_D, inner: `<path d="M-18.6 -61.8V-27" stroke="${P.gold}" stroke-width=".5"/>` },
      { d: 'M19.4 -62.4L15.8 -61V-27H19.4Z', fill: ROJO_D, inner: `<path d="M18.6 -61.8V-27" stroke="${P.gold}" stroke-width=".5"/>` },
    ], 0.5) +
    `<path d="${ellipse(0, -43, 14.4, 14.4)}" fill="none" stroke="${P.sky2}" stroke-width=".5"/>` +
    [0, 1, 2, 3].map((i) => hair(8 + i * 1.4, -31 - i * 0.6, 13 + i * 0.6, -36 - i * 0.6, 14 - i * 0.2, -44 - i * 0.4, 0.35, P.mid, 0.9)).join('') +
    Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * Math.PI * 2; return rivet(Math.cos(a) * 13.8, -43 + Math.sin(a) * 13.8, 0.38, P.sky1) }).join('') +
    k.draw([{ d: door, fill: P.night, inner: k.sh(door, 0, 0, 1, 1, 0, 0.7, '#0F1736', 0.4) + `<path d="M-9 -51C-6 -53.6 -2 -54.4 2 -54" fill="none" stroke="${P.sky}" stroke-width=".9" stroke-linecap="round"/>` }], 0.4) +
    hinge(-47) + hinge(-38) +
    `<path d="M-6.6 -42.4H6.6" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M-6.6 -42.4H6.6" stroke="${P.gold}" stroke-width="1" stroke-linecap="round"/>` +
    `<circle cx="0" cy="-42.4" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="0" cy="-42.4" r="1.2" fill="${P.goldD}"/><circle cx="-.8" cy="-43.2" r=".5" fill="#fff"/>` +
    `<path d="${roundRect(-3.4, -52.4, 3.4, -47.4, 1.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><text x="0" y="-48.4" ${GEORGIA} font-weight="700" font-size="4.4" fill="${P.ink}" text-anchor="middle">7</text>` +
    // El pasamanos que abraza la caja de humo.
    `<path d="M-17.4 -36C-19 -46 -14 -57 -4 -60.4M17.4 -36C19 -46 14 -57 4 -60.4" fill="none" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><path d="M-17.4 -36C-19 -46 -14 -57 -4 -60.4M17.4 -36C19 -46 14 -57 4 -60.4" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-linecap="round"/>` +
    // El faro, encendido.
    k.shade(ellipse(0, -59.4, 14, 11), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.6) +
    k.draw([{ d: lamp, fill: P.gold, inner: k.sh(lamp, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.55) +
    `<circle cx="0" cy="-59.4" r="3.2" fill="${P.white}" stroke="${P.goldD}" stroke-width=".5"/><circle cx="0" cy="-59.4" r="3.2" fill="${k.rad(P.goldL, 0.5, 0.5, 0.5, 0, 1)}"/><circle cx="-1" cy="-60.4" r=".9" fill="#fff"/>` +
    // Pasarela, faroles, viga, paragolpes y quitanieves.
    k.draw([
      { d: walk, fill: P.night, inner: `<path d="M-26.4 -27.4H26.4" stroke="${P.mid}" stroke-width=".5"/>` },
      { d: beam, fill: ROJO, inner: k.sh(beam, 0, 0, 0, 1, 0, 0.8, ROJO_D, 0.45) + `<path d="M-23.4 -23.8H23.4" stroke="${ROJO_L}" stroke-width=".5"/>` + [-20, -8, 8, 20].map((x) => rivet(x, -17.4, 0.4)).join('') },
      { d: plow, fill: ROJO, inner: k.sh(plow, 0, 0, 1, 0, 0, 0.9, ROJO_D, 0.5) + ribs + `<path d="M0 -15.6V0" stroke="${ROJO_D}" stroke-width="1"/><path d="M-.6 -15.6V0" stroke="${ROJO_L}" stroke-width=".4"/>` + k.sh('M-27 -6H27V2H-27Z', 0, 0, 0, 1, 0, 0.8, P.white, 0.5) },
    ], 0.75) +
    marker(-19) + marker(19) +
    buffer(-16.4) + buffer(16.4) +
    `<path d="M-3 -22.8H3V-17.6H-3Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".5"/><path d="M-1.6 -20.2H1.6" stroke="${P.ink}" stroke-width=".7"/>` +
    // La nieve que levanta el quitanieves.
    steam(k, -27, -6, 6.4, 3.6, 8, 0.4, 0.45) + steam(k, 27, -6, 6.4, 3.6, 8, 0.1, 0.45) + steam(k, -34, -12, 3.6, 2.4, 7, 0, 0.4) + steam(k, 34, -12, 3.6, 2.4, 7, 0.6, 0.4) +
    hair(-30, -16, -36, -22, -42, -24, 0.6, P.sky) + hair(30, -16, 36, -22, 42, -24, 0.6, P.sky)
  )
}
