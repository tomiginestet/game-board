// Wavelength (Onda): Tiro al blanco y En la misma onda.
// El color propio del juego es el rosa de su ficha (#E64980): el grano del fondo, las ondas que viajan, las plumas de
// los dardos y las bandas de la torre. Las ondas son el hilo de toda la familia: de la diana al satélite, del
// walkie-talkie a la radio y a la torre que emite para todo el país. A Guillermo Tell no se lo dibuja: aparece por su
// ballesta y la manzana partida.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El rosa de la ficha de Wavelength, con su sombra y su luz; el rosa claro del fondo y la noche ciruela.
const ROSA = '#E64980', ROSA_D = '#A3215A', ROSA_L = '#F6A6C5'
const FONDO = '#F2BBD3', FONDO_G = '#E089B0'
const NOCHE = '#2A1438'
// Manzana, madera de la ballesta, hueso de las incrustaciones y el sisal de la diana.
const APPLE = '#D2382F', APPLE_D = '#8E1D1C'
const PULPA = '#F8EDCF'
const WOOD = '#B07A4C', WOOD_D = '#6E4425', WOOD_L = '#DCAE7E'
const BONE = '#F4ECDA'
const SISAL = '#EADBB8'

/** Fondo del juego: el papel con el rosa claro granulado hacia los bordes. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(FONDO, 0.5, 0.46, 0.7, 0, 1), FONDO_G, 0.5)

/** Escenario: un disco rosa claro con el borde granulado. */
const escenario = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FAEAF1"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(FONDO, 0.5, 0.5, 0.5, 0, 0.9), FONDO_G, 0.5) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ROSA}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Noche ciruela con un resplandor rosa. */
const noche = (k: Kit) => `<rect width="120" height="130" fill="${NOCHE}"/>` + k.shade(FULL, k.rad(ROSA_D, 0.5, 0.45, 0.55, 0.8, 0), ROSA_D, 0.35)

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional. */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Arco de onda alrededor de (cx,cy), de radio r, entre los ángulos a0 y a1 (en grados). */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => `${f(cx + Math.cos((a * Math.PI) / 180) * r)} ${f(cy + Math.sin((a * Math.PI) / 180) * r)}`
  return `M${p(a0)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${p(a1)}`
}

/** Ondas que salen de (cx,cy): arcos rosas entintados, cada vez más finos. */
const waves = (cx: number, cy: number, rs: number[], a0: number, a1: number, c = ROSA) =>
  rs.map((r, i) => rod(arc(cx, cy, r, a0, a1), c, f(1.5 - i * 0.22), i < 2 ? '#fff' : undefined)).join('')

/** Sector de corona circular entre r1 y r2 y los ángulos a0 y a1 (radianes). */
const sector = (cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) => {
  const p = (r: number, a: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`
  return `M${p(r2, a0)}A${r2} ${r2} 0 0 1 ${p(r2, a1)}L${p(r1, a1)}A${r1} ${r1} 0 0 0 ${p(r1, a0)}Z`
}

/** Dardo con la punta en (0,0) y el cuerpo hacia +x: barril moleteado de bronce, caña y tres plumas rosas. */
function dart(k: Kit) {
  const barrel = 'M2.6 -1.2C4 -1.6 9 -1.6 11.6 -1.1V1.1C9 1.6 4 1.6 2.6 1.2Z'
  const flightU = 'M14.6 -.6L18.6 -6.4H23.6L22.6 -.6Z'
  const flightD = 'M14.6 .6L18.6 6.4H23.6L22.6 .6Z'
  return (
    `<path d="M0 0L3 0" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M0 0L3 0" stroke="${P.sky1}" stroke-width=".55" stroke-linecap="round"/>` +
    rod('M11.4 0H22.6', ROSA_D, 0.9) +
    k.draw([
      { d: flightD, fill: ROSA, inner: k.sh(flightD, 0, 0, 1, 1, 0, 0.9, ROSA_D, 0.45) + `<path d="M16 1.6L19 5.4H23" fill="none" stroke="${P.white}" stroke-width=".55"/>` },
      { d: barrel, fill: P.gold, inner: k.sh(barrel, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.5) + [5, 6.4, 7.8, 9.2].map((x) => `<path d="M${x} -1.6V1.6" stroke="${P.goldD}" stroke-width=".4"/>`).join('') + `<path d="M3 -.6H11" stroke="#fff" stroke-width=".4"/>` },
      { d: flightU, fill: ROSA_L, inner: k.sh(flightU, 0, 0, 1, 1, 0, 0.8, ROSA, 0.45) + `<path d="M16 -1.6L19 -5.4H23" fill="none" stroke="${P.white}" stroke-width=".55"/>` },
    ], 0.45) +
    `<path d="M15 0H23.4" stroke="${P.ink}" stroke-width=".7"/>`
  )
}

/** Medio walkie-talkie centrado en (0,0) (base en y=22): cuerpo, antena, perilla, rejilla, botón y la lucecita. */
function walkie(k: Kit, c: string, dk: string, lt: string, ax = -4.6) {
  const body = roundRect(-9, -16, 9, 22, 3.4)
  const grille = roundRect(-6, -10.4, 6, 3.4, 1.6)
  const ptt = 'M-9 -6H-11C-11.8 -6 -12.2 -5.4 -12.2 -4.6V4.6C-12.2 5.4 -11.8 6 -11 6H-9Z'
  return (
    rod(`M${ax} -16V-35`, P.night, 1.6, P.mid) + `<circle cx="${ax}" cy="-36" r="1.6" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${f(ax - 0.5)}" cy="-36.5" r=".5" fill="${P.sky}"/>` +
    k.draw([
      { d: ptt, fill: dk },
      { d: `M${f(-ax - 2.6)} -16V-19.4H${f(-ax + 2.6)}V-16Z`, fill: P.night, inner: `<path d="M${f(-ax - 1.6)} -19.4V-16M${f(-ax)} -19.4V-16M${f(-ax + 1.6)} -19.4V-16" stroke="${P.mid}" stroke-width=".4"/>` },
      {
        d: body, fill: c,
        inner: k.sh(body, 0, 0, 1, 0, 0, 0.9, dk, 0.5) + `<path d="M-10 -16H-5V22H-10Z" fill="${k.lin(lt, 0, 0, 1, 0, 0.8, 0)}"/>` + k.sh('M-10 14H10V23H-10Z', 0, 0, 0, 1, 0, 0.7, dk, 0.35),
      },
    ], 0.7) +
    k.draw([{ d: grille, fill: P.night, inner: Array.from({ length: 6 }, (_, i) => `<path d="M-4.8 ${f(-8.6 + i * 2)}H4.8" stroke="${P.mid}" stroke-width=".9" stroke-linecap="round"/>`).join('') }], 0.4) +
    `<path d="${roundRect(-6.4, 6.4, 6.4, 18.4, 1.4)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
    `<path d="M-4.6 9.6H4.6M-4.6 12.2H2" stroke="${P.sky}" stroke-width=".7" stroke-linecap="round"/>` +
    `<circle cx="3.6" cy="15.4" r="1.3" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><circle cx="3.2" cy="15" r=".4" fill="#fff"/>` +
    `<path d="M-7 -14C-7.2 -6 -7.2 6 -7 18" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".6"/>`
  )
}

export const WAVELENGTH_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Tiro al blanco ─────────────────────────────────────────────────

  // Tres veces al centro, como en el bar del barrio: la diana de sisal con los tres dardos clavados en el ojo.
  'Dardo en la diana': (u) => {
    const k = kit(u)
    const cx = 57, cy = 62, nums = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]
    const st = (Math.PI * 2) / 20, a0 = -Math.PI / 2 - st / 2
    let face = ''
    for (let i = 0; i < 20; i++) {
      const b = a0 + i * st, e = b + st
      face += `<path d="${sector(cx, cy, 14, 23.6, b, e)}" fill="${i % 2 ? SISAL : P.night}"/><path d="${sector(cx, cy, 5, 12.4, b, e)}" fill="${i % 2 ? SISAL : P.night}"/>`
      face += `<path d="${sector(cx, cy, 23.6, 26, b, e)}" fill="${i % 2 ? P.green : ROSA}"/><path d="${sector(cx, cy, 12.4, 14, b, e)}" fill="${i % 2 ? P.green : ROSA}"/>`
    }
    const wires = Array.from({ length: 20 }, (_, i) => { const b = a0 + i * st; return `M${f(cx + Math.cos(b) * 5)} ${f(cy + Math.sin(b) * 5)}L${f(cx + Math.cos(b) * 26)} ${f(cy + Math.sin(b) * 26)}` }).join('')
    const labels = nums.map((n, i) => { const a = -Math.PI / 2 + i * st; return `<text x="${f(cx + Math.cos(a) * 28.6)}" y="${f(cy + Math.sin(a) * 28.6 + 1.1)}" ${GEORGIA} font-weight="700" font-size="3" fill="${P.paper}" text-anchor="middle">${n}</text>` }).join('')
    const board = ellipse(cx, cy, 31.4, 31.4)
    return (
      fondo(k) +
      k.cast([board], 2.6, 2.6, ROSA_D) +
      k.draw([{ d: board, fill: P.night, inner: k.sh(board, 0, 0, 1, 1, 0.1, 0.9, '#0B0F22', 0.5) }], 0.8) +
      `<circle cx="${cx}" cy="${cy}" r="31.4" fill="none" stroke="${P.mid}" stroke-width=".6" transform="translate(-.4 -.4)"/>` +
      labels +
      `<circle cx="${cx}" cy="${cy}" r="26" fill="${P.night}"/>` + face +
      `<circle cx="${cx}" cy="${cy}" r="5" fill="${P.green}"/><circle cx="${cx}" cy="${cy}" r="2.4" fill="${ROSA}"/>` +
      k.shade(ellipse(cx, cy, 26, 26), k.rad(SISAL, 0.35, 0.3, 0.7, 0.35, 0), '#fff', 0.25) + k.sh(ellipse(cx, cy, 26, 26), 0, 0, 1, 1, 0, 0.55, P.night, 0.3) +
      `<g fill="none" stroke="${P.sky1}" stroke-width=".35"><path d="${wires}"/><circle cx="${cx}" cy="${cy}" r="26"/><circle cx="${cx}" cy="${cy}" r="23.6"/><circle cx="${cx}" cy="${cy}" r="14"/><circle cx="${cx}" cy="${cy}" r="12.4"/><circle cx="${cx}" cy="${cy}" r="5"/><circle cx="${cx}" cy="${cy}" r="2.4"/></g>` +
      hair(40, 48, 44, 44, 49, 42, 0.5, '#fff', 0.5) + hair(36, 56, 37, 52, 40, 48, 0.45, '#fff', 0.4) +
      // Los tres dardos en el ojo de buey, con su sombra sobre el sisal.
      [[-38, 1], [-62, 0.92], [-14, 0.9]].map(([r, s]) => `<g transform="translate(${cx + 2} ${cy + 2}) rotate(${r}) scale(${s})" opacity=".35">${`<path d="M0 0H22" stroke="${P.night}" stroke-width="3" stroke-linecap="round"/>`}</g>`).join('') +
      [[-62, 0.92], [-14, 0.9], [-38, 1]].map(([r, s]) => `<g transform="translate(${cx} ${cy}) rotate(${r}) scale(${s})">${dart(k)}</g>`).join('') +
      sparkle(88, 36, 2.2) + sparkle(30, 90, 1.6) +
      k.defs()
    )
  },

  // Diez blancos perfectos: la manzana partida al medio por la saeta, sobre la ballesta de Guillermo Tell.
  'Guillermo Tell': (u) => {
    const k = kit(u)
    const stock = 'M0 -3.4C0 -4.6 1 -5.2 2.4 -5.2C6 -5 12 -4 18 -3.2H46.4L47.6 -1.8V1.8L46.4 3.2H18C12 4 6 5 2.4 5.2C1 5.2 0 4.6 0 3.4Z'
    const inlay = 'M3 -2.8C7 -2.6 11 -2.2 15 -1.8V1.8C11 2.2 7 2.6 3 2.8Z'
    const limbU = taper(44.6, -1, 49, -14, 40.4, -26, 3.8, 1.4)
    const limbD = taper(44.6, 1, 49, 14, 40.4, 26, 3.8, 1.4)
    const lever = 'M22.4 3C21.6 5.4 18.6 6.8 11.6 7.6C10.4 7.8 10 9 11 9.4C18.4 9.6 23 7.2 24.6 3Z'
    const half = 'M-8 0C-8 -5 -4.4 -8.6 0 -8.6C4.4 -8.6 8 -5 8 0Z'
    const cut = ellipse(0, 0, 8, 2.6)
    const seeds = [[-2.4, 0, -20], [2.4, 0, 20], [0, -0.8, 0]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="1.1" ry=".55" fill="${P.brownD}" transform="rotate(${r} ${x} ${y})"/>`).join('')
    const appleHalf = (top: boolean) =>
      `<g transform="scale(1 ${top ? 1 : -1})">` +
      k.draw([{ d: half, fill: APPLE, inner: k.sh(half, 0, 0, 1, 1, 0, 0.9, APPLE_D, 0.5) + `<path d="M-8 -9H-2V0H-8Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` + hair(-5, -5, -2, -7.4, 2, -7.6, 0.4, P.goldL, 0.8) }], 0.6) +
      `</g>` +
      k.draw([{ d: cut, fill: PULPA, inner: k.sh(cut, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) + `<path d="${ellipse(0, 0, 4.6, 1.4)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` + seeds }], 0.45)
    return (
      fondo(k) +
      k.sun(60, 54, 14, 47, 28, false) +
      k.shade(ellipse(60, 50, 24, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      // La manzana partida, arriba, con la saeta que pasó por el medio y su estela.
      `<g transform="translate(60 36.4) rotate(-90) scale(1.08)">` +
      hair(-26, -3.4, -20, -3.2, -12, -3.6, 0.6, ROSA) + hair(-26, 3.4, -20, 3.2, -12, 3.6, 0.6, ROSA) + hair(-24, -6, -19, -5.8, -14, -6.6, 0.45, ROSA_D) + hair(-24, 6, -19, 5.8, -14, 6.6, 0.45, ROSA_D) +
      `<g transform="translate(0 -5.4) rotate(-12)">` + appleHalf(true) + `<path d="M7.6 -1.6C9.4 -2 10.6 -2.8 11.4 -4.2" fill="none" stroke="${P.brownD}" stroke-width="1" stroke-linecap="round"/>` +
      k.draw([{ d: 'M10.6 -3.4C13.4 -4.8 16.4 -3.2 16.6 -.8C14.2 .2 11.6 -.8 10.6 -3.4Z', fill: P.green, inner: `<path d="M11.2 -3L16 -1.2" stroke="${P.greenD}" stroke-width=".4"/>` }], 0.4) + `</g>` +
      rod('M-14 0H10', WOOD, 1.1, WOOD_L) +
      `<path d="M9.4 -1.8L13.6 0L9.4 1.8Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<path d="M-16 0L-11.6 -3.4H-8.4L-10.6 0ZM-16 0L-11.6 3.4H-8.4L-10.6 0Z" fill="${ROSA}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>` +
      `<g transform="translate(0 5.4) rotate(12)">` + appleHalf(false) + `</g>` +
      `<circle cx="2" cy="12" r=".6" fill="${PULPA}" stroke="${P.ink}" stroke-width=".25"/><circle cx="3" cy="-12.6" r=".5" fill="${PULPA}" stroke="${P.ink}" stroke-width=".25"/>` +
      `</g>` +
      // La ballesta: culata con hueso, tablero, nuez de bronce, arco de acero atado y el estribo.
      `<g transform="translate(60 97) rotate(-90) scale(.88)">` +
      k.cast([stock, limbU, limbD], 2, 2.4, ROSA_D) +
      rod('M40.8 -25.4L40.8 25.4', P.paper, 0.5) +
      k.draw([
        { d: lever, fill: P.sky2, inner: k.sh(lever, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) },
        { d: limbU, fill: P.sky1, inner: k.sh(limbU, 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) + hair(46, -4, 47, -12, 43, -21, 0.4, '#fff') },
        { d: limbD, fill: P.sky1, inner: k.sh(limbD, 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) },
        {
          d: stock, fill: WOOD,
          inner: k.sh(stock, 0, 0, 0, 1, 0, 0.95, WOOD_D, 0.5) + `<path d="M0 -7H48V-3H0Z" fill="${k.lin(WOOD_L, 0, 0, 0, 1, 0.7, 0)}"/>` +
            hair(14, 1.6, 28, 2.2, 44, 1.6, 0.45, WOOD_D) + hair(18, -1.4, 30, -1.8, 42, -1.2, 0.35, WOOD_D) + `<path d="M24 -3.2H46" stroke="${WOOD_D}" stroke-width=".6"/>`,
        },
      ], 0.7) +
      k.draw([{ d: inlay, fill: BONE, inner: k.sh(inlay, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) + `<path d="M4.6 0C6 -1.6 7.4 -1.6 8.6 0C9.8 1.6 11.2 1.6 12.6 0" fill="none" stroke="${WOOD_D}" stroke-width=".45"/><circle cx="4.6" cy="0" r=".55" fill="${ROSA}"/><circle cx="12.6" cy="0" r=".55" fill="${ROSA}"/>` }], 0.35) +
      `<path d="M16.6 -2.2H22M16.6 2.2H22" stroke="${BONE}" stroke-width=".9"/>` +
      `<circle cx="25.4" cy="-3.2" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M24.2 -3.6H26.6" stroke="${P.goldD}" stroke-width=".5"/>` +
      // Las ataduras del arco y el estribo.
      `<path d="M43.2 -3.6L46.8 3.6M43.2 3.6L46.8 -3.6M43.8 -4L44.6 4M45.8 -4L45 4" stroke="${P.ink}" stroke-width="1.2"/><path d="M43.2 -3.6L46.8 3.6M43.2 3.6L46.8 -3.6M43.8 -4L44.6 4M45.8 -4L45 4" stroke="${ROSA_L}" stroke-width=".55"/>` +
      rod('M47.6 -3.4C52 -4.4 54.6 -2.6 54.6 0C54.6 2.6 52 4.4 47.6 3.4', P.sky2, 1.1, '#fff') +
      `</g>` +
      sparkle(88, 76, 2) + sparkle(34, 40, 1.8) +
      k.defs()
    )
  },

  // Veinticinco al centro: captan todas las señales del satélite. La antena parabólica, de noche, recibiendo las ondas.
  'Antena parabólica': (u) => {
    const k = kit(u)
    const D = { x: 52, y: 60 }, rx = 26.4, ry = 11.4, rot = 45
    const rad = (rot * Math.PI) / 180
    const P2 = (lx: number, ly: number) => ({ x: D.x + lx * Math.cos(rad) - ly * Math.sin(rad), y: D.y + lx * Math.sin(rad) + ly * Math.cos(rad) })
    const rimPt = (t: number, s = 1) => P2(Math.cos(t) * rx * s, Math.sin(t) * ry * s)
    const F = { x: D.x + 12.4, y: D.y - 12.4 }
    const dish = `<g transform="rotate(${rot} ${D.x} ${D.y})">`
    const shell = ellipse(D.x - 2.2, D.y + 3, rx + 0.6, ry + 1.6)
    const bowl = ellipse(D.x, D.y, rx, ry)
    const panels = Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * Math.PI * 2, a = rimPt(t, 0.12), b = rimPt(t); return `M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}` }).join('')
    const strut = (t: number) => { const p = rimPt(t, 0.97); return rod(`M${f(p.x)} ${f(p.y)}L${f(F.x)} ${f(F.y)}`, P.sky1, 0.7) }
    const sat = { x: 79, y: 35 }
    const satBody = roundRect(-2.6, -2.6, 2.6, 2.6, 0.6)
    const panel = (sx: number) => `<g transform="scale(${sx} 1)"><path d="M3.4 -2.2H13.4V2.2H3.4Z" fill="${P.mid}" stroke="${P.ink}" stroke-width=".4"/><path d="M5.8 -2.2V2.2M8.4 -2.2V2.2M11 -2.2V2.2M3.4 0H13.4" stroke="${P.sky}" stroke-width=".3"/><path d="M2.6 0H3.4" stroke="${P.ink}" stroke-width=".6"/></g>`
    const stars = [[24, 30, 0.6], [34, 22, 0.45], [70, 22, 0.5], [104, 50, 0.5], [22, 52, 0.45], [96, 86, 0.6], [28, 80, 0.4], [76, 34, 0.35], [40, 40, 0.35]]
    return (
      noche(k) +
      stars.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') + sparkle(30, 38, 1.6, P.paper) + sparkle(100, 66, 1.4, P.paper) +
      // La gloria rosa que se abre detrás del plato: capta todas las señales.
      k.shade(ellipse(56, 56, 34, 34), k.rad(ROSA, 0.5, 0.5, 0.5, 0.75, 0), ROSA, 0.35) +
      `<path d="${Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2, w = i % 2 ? 0.035 : 0.06, L = i % 2 ? 34 : 44; return `M${f(56 + Math.cos(a - w) * 12)} ${f(56 + Math.sin(a - w) * 12)}L${f(56 + Math.cos(a) * L)} ${f(56 + Math.sin(a) * L)}L${f(56 + Math.cos(a + w) * 12)} ${f(56 + Math.sin(a + w) * 12)}Z` }).join('')}" fill="${ROSA_L}" opacity=".22"/>` +
      // Las ondas que bajan del satélite al foco de la antena.
      waves(sat.x, sat.y, [8, 13.4, 18.8], 108, 160) +
      // El satélite: el cuerpo de lámina dorada y los dos paneles.
      `<g transform="translate(${sat.x} ${sat.y}) rotate(22) scale(.92)">` + panel(1) + panel(-1) +
      k.draw([{ d: satBody, fill: P.gold, inner: k.sh(satBody, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-2.6 -.6H2.6M-.6 -2.6V2.6" stroke="${P.goldD}" stroke-width=".3"/>` }], 0.4) +
      `<path d="M-1.6 2.6L-2.6 5.4H2.6L1.6 2.6Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/></g>` +
      // El pie: el mástil, la horquilla y la base atornillada.
      `<path d="M50 63L56 96" stroke="${P.ink}" stroke-width="5.4" stroke-linecap="round"/><path d="M50 63L56 96" stroke="${P.sky2}" stroke-width="3.6" stroke-linecap="round"/><path d="M49.4 64.6L55 95" stroke="#fff" stroke-width=".8" opacity=".7"/>` +

      k.draw([{ d: 'M44 94.6H68L70 98.6H42Z', fill: P.mid, inner: k.sh('M44 94.6H68L70 98.6H42Z', 0, 0, 1, 0, 0, 0.8, P.night, 0.4) }], 0.6) +
      [47, 56, 65].map((x) => `<circle cx="${x}" cy="96.6" r=".8" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      // La parábola: la cáscara de atrás, el plato con sus gajos y remaches, y el aro.
      dish + k.draw([{ d: shell, fill: P.mid, inner: k.sh(shell, 0, 0, 1, 1, 0, 0.8, P.night, 0.45) }], 0.75) + `</g>` +
      dish + k.draw([{
        d: bowl, fill: P.white,
        inner: k.shade(bowl, k.rad(P.sky2, 0.3, 0.3, 0.8, 0.9, 0), P.sky2, 0.45) + k.shade(bowl, k.rad(ROSA_L, 0.75, 0.6, 0.5, 0.7, 0), ROSA, 0.3) +
          [0.4, 0.7].map((s) => `<path d="${ellipse(D.x, D.y, rx * s, ry * s)}" fill="none" stroke="${P.sky}" stroke-width=".5"/>`).join(''),
      }], 0.75) + `</g>` +
      `<path d="${panels}" stroke="${P.sky}" stroke-width=".45"/>` +
      Array.from({ length: 16 }, (_, i) => { const p = rimPt((i / 16) * Math.PI * 2 + 0.2, 0.9); return `<circle cx="${f(p.x)}" cy="${f(p.y)}" r=".45" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".25"/>` }).join('') +
      dish + `<path d="${ellipse(D.x, D.y, rx, ry)}" fill="none" stroke="${P.sky1}" stroke-width="1.4"/><path d="${ellipse(D.x, D.y, rx - 0.6, ry - 0.6)}" fill="none" stroke="${P.ink}" stroke-width=".4"/></g>` +
      `<path d="M${f(rimPt(3.6).x)} ${f(rimPt(3.6).y)}A${rx} ${ry} ${rot} 0 1 ${f(rimPt(4.6).x)} ${f(rimPt(4.6).y)}" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      `<circle cx="${D.x}" cy="${D.y}" r="2.4" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${D.x}" cy="${D.y}" r="1" fill="${P.mid}"/>` +
      `<path d="${starPath(55, 83.4, 4.2, 3.2, 12)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="55" cy="83.4" r="1.9" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".4"/><circle cx="54.4" cy="82.8" r=".6" fill="${P.goldL}"/>` +
      // El brazo con el cabezal en el foco.
      strut(0) + strut(Math.PI) + strut(Math.PI / 2) +
      `<g transform="translate(${F.x} ${F.y}) rotate(-45)">` + k.draw([{ d: roundRect(-3.4, -2.2, 3.4, 2.2, 0.8), fill: P.gold, inner: k.sh(roundRect(-3.4, -2.2, 3.4, 2.2, 0.8), 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) }], 0.45) +
      `<path d="M-1.6 2.2H1.6L2.4 4.6H-2.4Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".4"/></g>` +
      k.shade(ellipse(F.x, F.y, 6, 6), k.rad(ROSA_L, 0.5, 0.5, 0.5, 0.9, 0), ROSA_L, 0.5) +
      sparkle(F.x - 3, F.y - 3, 2.4, '#fff') +
      k.defs()
    )
  },

  // ── En la misma onda ───────────────────────────────────────────────

  // Tres victorias: cambio y fuera. Dos walkie-talkies, uno rosa y uno dorado, con la misma onda entre las antenas.
  'Walkie-talkie': (u) => {
    const k = kit(u)
    let wave = ''
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, x = 44.6 + t * 33.4, y = 33.4 + t * 3.2 + Math.sin(t * Math.PI * 4) * 3.2
      wave += (i ? 'L' : 'M') + f(x) + ' ' + f(y)
    }
    return (
      fondo(k) +
      escenario(k, 60, 62, 33) +
      k.floor(60, 94.6, 30, 2.6, ROSA_D) +
      waves(42, 33.1, [3.6, 6.6], 205, 275) + waves(80.6, 36.8, [3.6, 6.6], -95, -25) +
      rod(wave, ROSA, 1.5, '#fff') +
      `<g transform="translate(79.6 69.4) rotate(9) scale(.9)">` + walkie(k, P.gold, P.goldD, P.goldL) + `</g>` +
      `<g transform="translate(42.4 69.4) rotate(-8)">` + walkie(k, ROSA, ROSA_D, ROSA_L, 4.6) + `</g>` +
      `<text x="60" y="50" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle">cambio</text>` +
      sparkle(60, 26, 2) + sparkle(30, 84, 1.4) +
      k.defs()
    )
  },

  // Diez victorias: se escuchan clarito hasta en Tandil. La radio portátil de baquelita rosa, con la aguja en Tandil.
  'Radio AM': (u) => {
    const k = kit(u)
    const body = roundRect(27, 46, 93, 86, 7)
    const face = roundRect(30, 49.4, 90, 82.6, 5)
    const dialC = { x: 73, y: 74 }, R = 14
    const dial = `M${dialC.x - R} ${dialC.y}A${R} ${R} 0 0 1 ${dialC.x + R} ${dialC.y}Z`
    const ticks = Array.from({ length: 25 }, (_, i) => {
      const a = Math.PI + (i / 24) * Math.PI, r1 = R - (i % 4 ? 1.4 : 2.4)
      return `M${f(dialC.x + Math.cos(a) * (R - 0.6))} ${f(dialC.y + Math.sin(a) * (R - 0.6))}L${f(dialC.x + Math.cos(a) * r1)} ${f(dialC.y + Math.sin(a) * r1)}`
    }).join('')
    const grille = ellipse(46, 65.4, 13, 13)
    const handle = 'M38 47C38 36 44 32 60 32C76 32 82 36 82 47H78.6C78.6 38.6 74 35.4 60 35.4C46 35.4 41.4 38.6 41.4 47Z'
    const knob = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${x}" cy="${y}" r="2.1" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".5 .5"/><circle cx="${f(x - 0.9)}" cy="${f(y - 0.9)}" r=".7" fill="#fff"/>`
    const city = (name: string, a: number, r: number, size: number, c: string) => `<text x="${f(dialC.x + Math.cos(a) * r)}" y="${f(dialC.y + Math.sin(a) * r + size * 0.35)}" ${GEORGIA} font-style="italic" font-size="${size}" fill="${c}" text-anchor="middle">${name}</text>`
    return (
      fondo(k) +
      escenario(k, 60, 62, 33) +
      k.floor(60, 88, 32, 2.6, ROSA_D) +
      waves(60, 44, [10.6, 15, 19.4], -152, -116) + waves(60, 44, [10.6, 15, 19.4], -64, -28) +
      k.draw([{ d: handle, fill: P.sky1, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) + `<path d="M40 44C40.4 37 46 34 58 33.8" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` }], 0.6) +
      `<path d="M36.4 44.4H43V48H36.4ZM77 44.4H83.6V48H77Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.cast([body], 2.4, 2.2, ROSA_D) +
      k.draw([{
        d: body, fill: ROSA,
        inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, ROSA_D, 0.5) + `<path d="M26 45H36V87H26Z" fill="${k.lin(ROSA_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
          `<path d="${face}" fill="none" stroke="${P.goldL}" stroke-width=".8"/><path d="M30 78H90" stroke="${ROSA_D}" stroke-width=".4"/>` +
          hair(30, 48.6, 50, 47.6, 70, 48.6, 0.5, '#fff', 0.6),
      }], 0.8) +
      // El parlante: la rejilla de tela dorada con el calado.
      k.draw([{
        d: grille, fill: P.goldL,
        inner: Array.from({ length: 13 }, (_, i) => `<path d="M33 ${f(54.4 + i * 1.8)}H59" stroke="${P.goldD}" stroke-width=".4"/>`).join('') + k.sh(grille, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) +
          `<path d="${ellipse(46, 65.4, 9, 9)}" fill="none" stroke="${P.gold}" stroke-width="1.4"/><path d="${ellipse(46, 65.4, 4.6, 4.6)}" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` +
          `<path d="M46 52.4V78.4M33 65.4H59" stroke="${P.gold}" stroke-width="1"/>`,
      }], 0.6) +
      `<circle cx="46" cy="65.4" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      // El dial de media luna con las ciudades y la aguja en Tandil.
      k.draw([{ d: dial, fill: P.paper, inner: k.sh(dial, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) + `<path d="${arc(dialC.x, dialC.y, R - 3.6, 180, 360)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.6) +
      `<path d="${ticks}" stroke="${P.ink}" stroke-width=".35"/>` +
      city('Azul', Math.PI * 1.18, 8.4, 2.3, P.mid) + city('Salta', Math.PI * 1.82, 8.4, 2.3, P.mid) +
      `<path d="${roundRect(dialC.x - 5.6, dialC.y - 12.2, dialC.x + 5.6, dialC.y - 8.2, 1.2)}" fill="${ROSA_L}" opacity=".6"/>` +
      city('Tandil', Math.PI * 1.5, 10.2, 3.2, ROSA_D) +
      rod(`M${dialC.x} ${dialC.y - 0.6}V${dialC.y - 7.4}`, P.red, 0.7) + `<path d="M${dialC.x - 1} ${dialC.y - 7.2}L${dialC.x} ${dialC.y - 8.4}L${dialC.x + 1} ${dialC.y - 7.2}Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="${dialC.x}" cy="${dialC.y}" r="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M${dialC.x - R} ${dialC.y}H${dialC.x + R}" stroke="${P.ink}" stroke-width=".6"/>` +
      knob(64, 80.6) + knob(82, 80.6) +
      `<text x="46" y="83.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="3.6" fill="${P.goldL}" text-anchor="middle">Onda</text>` +
      sparkle(88, 36, 2) + sparkle(30, 40, 1.6) +
      k.defs()
    )
  },

  // Veinticinco victorias: emiten para todo el país. La torre de reticulado con su faro y las ondas a los dos lados.
  'Torre de transmisión': (u) => {
    const k = kit(u)
    const top = 34, bot = 106, wt = 3.2, wb = 17
    const xAt = (y: number, sg: number) => 60 + sg * (wt + ((wb - wt) * (y - top)) / (bot - top))
    const levels = [34, 42, 51, 61, 72, 84, 97, 106]
    const legs = `M${f(xAt(top, -1))} ${top}L${f(xAt(bot, -1))} ${bot}M${f(xAt(top, 1))} ${top}L${f(xAt(bot, 1))} ${bot}`
    let brace = '', rungs = ''
    for (let i = 0; i < levels.length - 1; i++) {
      const y0 = levels[i], y1 = levels[i + 1]
      brace += `M${f(xAt(y0, -1))} ${y0}L${f(xAt(y1, 1))} ${y1}M${f(xAt(y0, 1))} ${y0}L${f(xAt(y1, -1))} ${y1}`
      rungs += `M${f(xAt(y1, -1))} ${y1}H${f(xAt(y1, 1))}`
    }
    // Bandas rosas y blancas, de abajo hacia arriba.
    const bands = [[34, 42, ROSA], [42, 51, P.white], [51, 61, ROSA], [61, 72, P.white], [72, 84, ROSA], [84, 97, P.white], [97, 106, ROSA]] as const
    const legPaint = bands.map(([y0, y1, c]) => `<path d="M${f(xAt(y0, -1))} ${y0}L${f(xAt(y1, -1))} ${y1}M${f(xAt(y0, 1))} ${y0}L${f(xAt(y1, 1))} ${y1}" stroke="${c}" stroke-width="1.6"/>`).join('')
    const platform = (y: number) => `<path d="M${f(xAt(y, -1) - 3)} ${y}H${f(xAt(y, 1) + 3)}" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M${f(xAt(y, -1) - 3)} ${y}H${f(xAt(y, 1) + 3)}" stroke="${P.sky1}" stroke-width="1" stroke-linecap="round"/>` +
      `<path d="M${f(xAt(y, -1) - 3)} ${y}V${y - 2.6}H${f(xAt(y, 1) + 3)}V${y}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      Array.from({ length: 5 }, (_, i) => { const x = xAt(y, -1) - 3 + (i * (xAt(y, 1) - xAt(y, -1) + 6)) / 4; return `<path d="M${f(x)} ${y}V${y - 2.6}" stroke="${P.ink}" stroke-width=".35"/>` }).join('')
    const roofs = (x: number, w: number, h: number, c: string) => `<path d="M${x} 94V${f(94 - h)}L${f(x + w / 2)} ${f(90 - h)}L${x + w} ${f(94 - h)}V94Z" fill="${c}" stroke="${P.ink}" stroke-width=".4"/><path d="M${f(x + w / 2 - 0.7)} ${f(94 - h * 0.5)}h1.4v1.8h-1.4Z" fill="${P.goldL}"/>`
    return (
      fondo(k) +
      k.sun(60, 26, 8, 48, 32, false) +
      k.shade(ellipse(60, 30, 20, 18), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.goldL, 0.5) +
      // Las ondas que salen para los dos lados.
      waves(60, 30, [11, 17.4, 23.8, 30.2], 154, 206) + waves(60, 30, [11, 17.4, 23.8, 30.2], -26, 26) +
      // El campo con los pueblitos lejos.
      `<path d="M10 93C30 90 90 90 110 93V120H10Z" fill="${P.green}" opacity=".55"/>` + k.sh('M10 93C30 90 90 90 110 93V120H10Z', 0, 0, 0, 1, 0, 0.7, P.greenD, 0.3) +
      roofs(26, 6, 3, P.white) + roofs(33, 5, 2.4, ROSA_L) + roofs(81, 6, 3, ROSA_L) + roofs(88, 5, 2.4, P.white) +
      // La torre.
      `<path d="${legs}" stroke="${P.ink}" stroke-width="3.2" stroke-linecap="round"/>` + legPaint +
      `<path d="${brace}${rungs}" stroke="${P.ink}" stroke-width="1.3"/><path d="${brace}${rungs}" stroke="${P.sky1}" stroke-width=".5"/>` +
      `<path d="M${f(xAt(top, -1) + 0.4)} ${top}L${f(xAt(bot, -1) + 0.6)} ${bot}" stroke="#fff" stroke-width=".45" opacity=".8"/>` +
      platform(51) + platform(72) +
      levels.slice(0, -1).map((y0, i) => { const y1 = levels[i + 1], w0 = xAt(y0, 1) - 60, w1 = xAt(y1, 1) - 60, ym = y0 + ((y1 - y0) * w0) / (w0 + w1); return `<circle cx="60" cy="${f(ym)}" r=".6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>` }).join('') +
      [42, 51, 61, 72, 84, 97].map((y) => `<circle cx="${f(xAt(y, -1))}" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/><circle cx="${f(xAt(y, 1))}" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('') +
      // El mástil, las antenitas y el faro.
      rod('M60 34V22.6', P.sky1, 1.2, '#fff') + rod('M55.6 30H64.4M57 26H63', P.sky1, 0.6) +
      k.shade(ellipse(60, 21, 9, 7), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.95, 0), '#ffffff', 0.6) +
      `<path d="M57.8 23.6H62.2L61.6 22H58.4Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<circle cx="60" cy="20.6" r="2.3" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/><circle cx="59.3" cy="19.9" r=".8" fill="#fff"/>` +
      sparkle(66, 18.6, 1.6, '#fff') +
      k.defs()
    )
  },
}
