// Star Wars: Unlimited. Nada de la saga tal cual: ni el Halcón, ni la Estrella de la Muerte, ni cascos ni logos.
// Sables, naves y estaciones genéricas, y el chiste de cada descripción. El color propio del juego es el azul
// noche de la ficha (#1C3D5A): todas las medallas pasan en el espacio, con ese cielo y su grano.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const SW = '#1C3D5A', SW_D = '#0E2033', SW_L = '#3E6A8E'
const BLADE_B = '#7CC4EE', BLADE_R = '#E0574A'
const FULL = 'M0 0H120V130H0Z'

/** Estrellas fijas (pseudoazar con semilla) dentro de la ventana. */
const stars = (seed: number, n = 28) => {
  let s = seed
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  return Array.from({ length: n }, () => {
    const x = 18 + rnd() * 84, y = 14 + rnd() * 90, r = 0.25 + rnd() * 0.45
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${P.paper}" opacity="${f(0.45 + rnd() * 0.55)}"/>`
  }).join('')
}

/** Fondo de espacio con el azul noche del juego, un resplandor en el medio y estrellas. */
const space = (k: Kit, seed = 7) =>
  `<rect width="120" height="130" fill="${SW_D}"/>` + k.shade(FULL, k.rad(SW_L, 0.48, 0.44, 0.6, 0.95, 0), SW_L, 0.45) + stars(seed)

/** Gloria de rayos rectos en rojo, del rojo vivo al vino (la del lado oscuro). */
function redGlory(k: Kit, cx: number, cy: number, r0: number, r1: number, n: number) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux, w = i % 2 ? 1.1 : 1.6, len = i % 2 ? r0 + (r1 - r0) * 0.72 : r1
    d += `M${f(cx + ux * r0 + px * w)} ${f(cy + uy * r0 + py * w)}L${f(cx + ux * len)} ${f(cy + uy * len)}L${f(cx + ux * r0 - px * w)} ${f(cy + uy * r0 - py * w)}Z`
  }
  const g = k.id('rg')
  return `<radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r1}"><stop offset="${f(r0 / r1)}" stop-color="${P.red}"/><stop offset=".7" stop-color="${BLADE_R}"/><stop offset="1" stop-color="${P.wine}" stop-opacity=".4"/></radialGradient>` +
    `<path d="${d}" fill="url(#${g})"/>` + k.shade(d, k.rad(P.wine, 0.5, 0.5, 0.5, 0.9, 0), P.wine, 0.2) +
    `<circle cx="${cx}" cy="${cy}" r="${f(r0 - 2)}" fill="none" stroke="${P.red}" stroke-width=".8" stroke-dasharray=".01 1.7" stroke-linecap="round"/>`
}

/** Sable de luz genérico: el emisor en (0,0), la hoja hacia arriba (`len`) y el puño hacia abajo (24 de largo). */
function saber(k: Kit, len: number, glowC: string, sith = false) {
  const metal = sith ? P.night : P.sky1, dark = sith ? '#0B1226' : P.mid, lite = sith ? SW_L : '#ffffff'
  const emitter = 'M-3.2 -1.2L-2.2 -.2H2.2L3.2 -1.2V5H-3.2Z'
  const neck = 'M-2.4 5H2.4V7.2H-2.4Z'
  const body = 'M-2.9 7.2H2.9V19.4H-2.9Z'
  const box = 'M2.9 8.8H4.6V13H2.9Z'
  const pommel = 'M-3.1 19.4H3.1L2.7 22.8C2.3 24 -2.3 24 -2.7 22.8Z'
  const grips = Array.from({ length: 5 }, (_, i) => `<path d="M-2.9 ${f(10 + i * 1.9)}H2.9V${f(10.9 + i * 1.9)}H-2.9Z" fill="${sith ? P.wine : P.night}"/>`).join('')
  const piece = (d: string, fill: string, extra = '') => ({ d, fill, inner: k.sh('M0 -2H6V26H0Z', 0, 0, 1, 0, 0, 0.95, dark, 0.5) + `<path d="M-4 -2H-1V26H-4Z" fill="${k.lin(lite, 0, 0, 1, 0, 0.7, 0)}"/>` + extra })
  const G = roundRect(-4.4, -len - 2.4, 4.4, 0.4, 4.4)
  const B = roundRect(-1.4, -len, 1.4, 0, 1.4)
  return (
    `<path d="M0 0V${-len}" stroke="${glowC}" stroke-width="10" stroke-linecap="round" opacity=".16"/>` +
    k.shade(G, k.lin(glowC, 0, 0, 1, 0, 0.75, 0.75), glowC, 0.3) +
    `<path d="M0 -.4V${-len}" stroke="${glowC}" stroke-width="5" stroke-linecap="round" opacity=".7"/>` +
    `<path d="${B}" fill="#fff"/>` + `<path d="M-.5 -2V${f(-len + 2)}" stroke="#fff" stroke-width=".6"/>` +
    k.draw([
      piece(emitter, metal, `<path d="M-3.2 1.6H3.2" stroke="${dark}" stroke-width=".45"/><path d="M1 -.2V3.6H2.4V-.2" fill="${dark}" opacity=".7"/>`),
      piece(neck, sith ? P.gold : P.sky2),
      piece(body, metal, grips),
      piece(box, sith ? P.gold : P.sky2),
      piece(pommel, metal, `<path d="M-3 20.8H3" stroke="${sith ? P.gold : dark}" stroke-width=".6"/>`),
    ], 0.55) +
    `<circle cx="3.75" cy="10.9" r=".75" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>` +
    (sith ? `<path d="M-2.9 7.6H2.9M-2.9 19H2.9" stroke="${P.gold}" stroke-width=".7"/>` : '')
  )
}

/** Casco de práctica con la visera baja tapando los ojos, de tres cuartos, con el centro del borde en (0,0). */
function trainingHelmet(k: Kit) {
  const shell = 'M-13.4 3.6C-14 -6.4 -8.8 -15.4 1 -15.4C10.2 -15.4 14.8 -8 14.6 1L14.8 6.4C14.8 7.6 13.8 8.2 12.8 8L9.2 7.4C4 6.8 -4.2 7 -9.2 7.6L-12.2 8C-13.2 8.1 -13.6 7 -13.4 3.6Z'
  const visor = 'M-13.2 -3.6C-8.4 -7.6 2.4 -8.2 10 -5.4C11 -5 11.4 -4 11.2 -3L10.4 5.8C3.4 4.6 -5.2 4.8 -12.6 6.2Z'
  const ear = ellipse(12.4, 0.6, 2.6, 3.6)
  return (
    k.draw([{
      d: shell, fill: P.white,
      inner: k.sh('M2 -16H16V9H2Z', 0, 0, 1, 0, 0, 0.95, P.blue, 0.45) + k.sh('M-15 2H16V9H-15Z', 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) +
        `<path d="M-4 -15.6C-2 -10 -1.6 -6 -1.8 -4" fill="none" stroke="${P.gold}" stroke-width="1.6"/><path d="M-4 -15.6C-2 -10 -1.6 -6 -1.8 -4" fill="none" stroke="${P.goldL}" stroke-width=".5" transform="translate(-.4 0)"/>` +
        hair(-9, -11, -11, -6, -11.6, -2, 0.7, '#fff') + `<path d="M-13 6.6C-5 5.4 5 5.4 14.6 6.4" fill="none" stroke="${P.blue}" stroke-width=".45"/>`,
    }, {
      d: visor, fill: P.night,
      inner: `<path d="${visor}" fill="${k.lin(SW_L, 0, 0, 1, 1, 0.9, 0)}"/>` + k.sh(visor, 0, 0, 1, 1, 0, 0.6, '#0B1226', 0.4) +
        hair(-10, -2.6, -4, -5.6, 4, -5.6, 0.9, '#fff', 0.85) + hair(-6, 2.6, 0, 1, 6, 1.6, 0.5, SW_L),
    }], 0.75) +
    k.draw([{ d: ear, fill: P.sky1, inner: k.sh(ear, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) }], 0.5) +
    `<circle cx="12.4" cy=".6" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`
  )
}

/** Carguero redondo genérico, visto de arriba en tres cuartos, con la proa a la izquierda y el centro en (0,0). */
function freighter(k: Kit) {
  const rx = 27, ry = 10
  const top = ellipse(0, 0, rx, ry)
  const hull = `M${-rx} 0A${rx} ${ry} 0 0 1 ${rx} 0V3.8A${rx} ${ry} 0 0 1 ${-rx} 3.8Z`
  const hub = ellipse(1, -1.6, 8, 2.9)
  const hubSide = 'M-7 -1.6A8 2.9 0 0 0 9 -1.6V.2A8 2.9 0 0 1 -7 .2Z'
  const canopy = 'M-26.6 -2.6C-26 -5 -22.4 -6.4 -18.4 -6C-16.6 -5.8 -16 -4.6 -16.6 -3.4L-18 -.6C-21 .4 -24.6 .2 -26.6 -.6Z'
  const panes = 'M-25 -3L-23.2 -5.2L-21.6 -5.1L-23 -2.6ZM-22 -2.4L-20.6 -5L-19 -4.8L-20.2 -2.2Z'
  const spokes = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + 0.2
    return `M${f(1 + Math.cos(a) * 9.6)} ${f(-1 + Math.sin(a) * 3.6)}L${f(Math.cos(a) * (rx - 1.2))} ${f(Math.sin(a) * (ry - 0.6))}`
  }).join('')
  const plates = [[-15, -6.2, 4.6, 1.8], [-11, 4.4, 4, 1.8], [12, -6.6, 4.4, 1.6], [13, 4, 5.4, 2], [-3, -8.6, 3.6, 1.2], [3, 6.8, 4, 1.4], [19, -1.6, 2.8, 2], [-20, 3, 3, 1.4]]
    .map(([x, y, w, h]) => `<path d="M${x} ${y}h${w}v${h}h${-w}Z" fill="${P.sky2}" stroke="${P.blue}" stroke-width=".3"/>`).join('')
  const rust = [[-7, 6.4, 3, 1.1], [9, -7.6, 2.6, 1], [21, 3.6, 2, 0.9]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${P.brown}" opacity=".45"/>`).join('')
  const engine = `M${f(rx * Math.cos(-0.9))} ${f(ry * Math.sin(-0.9) + 1.9)}A${rx} ${ry} 0 0 1 ${f(rx * Math.cos(0.9))} ${f(ry * Math.sin(0.9) + 1.9)}`
  const vents = Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (0.15 + i * 0.1); return `M${f(Math.cos(a) * rx * 0.98)} ${f(Math.sin(a) * ry * 0.98 + 1)}v2.4` }).join('')
  return (
    k.draw([
      { d: hull, fill: P.blue, inner: k.sh(hull, 0, 0, 1, 1, 0, 0.9, P.night, 0.45) + `<path d="${vents}" stroke="${P.night}" stroke-width=".5"/>` },
      {
        d: top, fill: P.sky1,
        inner: k.sh(top, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="${spokes}" stroke="${P.blue}" stroke-width=".4"/>` +
          `<path d="${ellipse(0, 0, 19, 6.8)}" fill="none" stroke="${P.blue}" stroke-width=".5"/><path d="${ellipse(0, 0, 23.6, 8.6)}" fill="none" stroke="${P.blue}" stroke-width=".3" stroke-dasharray="1.4 .8"/>` + plates + rust +
          hair(-22, -3.4, -12, -9, 2, -9.6, 0.6, '#fff'),
      },
      { d: hubSide, fill: P.blue },
      { d: hub, fill: P.white, inner: k.sh(hub, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="${ellipse(1, -1.6, 4.6, 1.6)}" fill="none" stroke="${P.blue}" stroke-width=".4"/><path d="M-3.6 -1.6H-1.4M3.4 -1.6H5.6" stroke="${P.mid}" stroke-width=".5"/>` },
      { d: canopy, fill: P.white, inner: k.sh(canopy, 0, 0, 0, 1, 0, 0.9, P.blue, 0.45) + `<path d="${panes}" fill="${P.night}"/><path d="M-24.6 -3.4L-23.4 -4.8" stroke="${SW_L}" stroke-width=".4"/>` },
    ], 0.6) +
    `<path d="${engine}" fill="none" stroke="${BLADE_B}" stroke-width="5.4" stroke-linecap="round" opacity=".35"/>` +
    `<path d="${engine}" fill="none" stroke="${BLADE_B}" stroke-width="2.8" stroke-linecap="round"/><path d="${engine}" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>`
  )
}

/** Cronómetro de bolsillo dorado con la aguja un pelito antes de las doce. */
function stopwatch(k: Kit, r: number) {
  const knurl = `<circle cx="0" cy="0" r="${f(r - 0.3)}" fill="none" stroke="${P.goldD}" stroke-width=".7" stroke-dasharray=".5 .6"/>`
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2, r0 = r * (i % 3 ? 0.62 : 0.54), r1 = r * 0.7
    return `<path d="M${f(Math.sin(a) * r0)} ${f(-Math.cos(a) * r0)}L${f(Math.sin(a) * r1)} ${f(-Math.cos(a) * r1)}" stroke="${P.ink}" stroke-width="${i % 3 ? 0.35 : 0.6}"/>`
  }).join('')
  const a = (-26 * Math.PI) / 180
  const hand = `M${f(Math.sin(a) * r * 0.62)} ${f(-Math.cos(a) * r * 0.62)}L${f(-Math.sin(a) * r * 0.18)} ${f(Math.cos(a) * r * 0.18)}`
  const bow = ellipse(0, -r - 3.6, 2.6, 2.2)
  return (
    `<path d="${bow} ${ellipse(0, -r - 3.6, 1.5, 1.2)}" fill-rule="evenodd" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
    k.draw([
      { d: `M-1.6 ${f(-r - 2)}H1.6V${f(-r + 0.6)}H-1.6Z`, fill: P.gold, inner: `<path d="M-1.6 ${f(-r - 1)}H1.6M-1.6 ${f(-r)}H1.6" stroke="${P.goldD}" stroke-width=".35"/>` },
      { d: `M${f(r * 0.62)} ${f(-r * 0.86)}l1.6 -1.4l1.2 1.4l-1.6 1.4Z`, fill: P.gold },
      { d: ellipse(0, 0, r, r), fill: P.gold, inner: k.sh(ellipse(0, 0, r, r), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + knurl },
    ], 0.55) +
    `<circle cx="0" cy="0" r="${f(r * 0.76)}" fill="${P.white}" stroke="${P.goldD}" stroke-width=".45"/>` +
    k.clip(ellipse(0, 0, r * 0.76, r * 0.76), k.sh(ellipse(0, 0, r, r), 0, 0, 1, 1, 0.2, 0.7, P.sky2, 0.4)) + ticks +
    `<text x="0" y="${f(-r * 0.2)}" font-family="Georgia, serif" font-size="${f(r * 0.3)}" fill="${P.ink}" text-anchor="middle">12</text>` +
    `<path d="${hand}" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="${hand}" stroke="${P.red}" stroke-width=".55" stroke-linecap="round"/>` +
    `<circle cx="0" cy="0" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
    `<path d="M${f(-r * 0.6)} ${f(-r * 0.3)}A${f(r * 0.66)} ${f(r * 0.66)} 0 0 1 ${f(-r * 0.2)} ${f(-r * 0.62)}" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".9"/>`
  )
}

export const TCG_STARWARSUNLIMITED_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Maestro Jedi ───────────────────────────────────────────────────

  // Tres ganadas: practicás con el casco tapando los ojos. El sable encendido y el casco con la visera baja.
  'Sable de entrenamiento': (u) => {
    const k = kit(u)
    return (
      space(k, 11) +
      k.shade(ellipse(60, 58, 30, 30), k.rad(BLADE_B, 0.5, 0.5, 0.5, 0.45, 0), BLADE_B, 0.25) +
      `<g transform="translate(48 65.4) rotate(40)">` + saber(k, 46, BLADE_B) + `</g>` +
      k.floor(72.4, 89.6, 16, 2.4, '#000') +
      `<g transform="translate(71.6 80.8) scale(1.18)">` + trainingHelmet(k) + `</g>` +
      sparkle(36, 40, 2, P.paper) + sparkle(88, 50, 1.4, BLADE_B) +
      k.defs()
    )
  },

  // Quince ganadas: el corredor de Kessel en menos de doce pársecs. El carguero redondo y el cronómetro antes de las doce.
  'Halcón Milenario': (u) => {
    const k = kit(u)
    const streaks = [[-4, 0.7], [0, 0.9], [4, 0.6], [7.4, 0.5], [-7, 0.5], [10, 0.4]].map(([y, w]) => hair(26, y, 44, y, 64, y, w, '#fff', 0.8)).join('')
    return (
      space(k, 23) +
      `<g transform="translate(62 50) rotate(-16)">` + streaks +
      k.cast([`M-27 0A27 10 0 0 1 27 0V3.8A27 10 0 0 1 -27 3.8Z`], 1.6, 3.6, '#000') +
      freighter(k) + `</g>` +
      `<g transform="translate(37.4 79) rotate(-8)">` + stopwatch(k, 9.4) + `</g>` +
      sparkle(34, 40, 2, P.paper) + sparkle(88, 80, 1.6, P.paper) +
      k.defs()
    )
  },

  // Cuarenta ganadas: tenés una luna que no es una luna. Media esfera es luna con cráteres; la otra media, chapa y ventanitas.
  'Estrella de la Muerte': (u) => {
    const k = kit(u)
    const cx = 60, cy = 57, R = 28, tilt = 0.32
    const sphere = ellipse(cx, cy, R, R)
    // Proyección de un punto de la esfera (lat, lon en grados), vista un poco desde arriba.
    const pr = (lat: number, lon: number) => {
      const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180
      const x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo)
      return { x: cx + R * x, y: cy - R * (y * Math.cos(tilt) - z * Math.sin(tilt)), v: y * Math.sin(tilt) + z * Math.cos(tilt) }
    }
    const line = (fn: (t: number) => [number, number], n = 24) => {
      let d = '', on = false
      for (let i = 0; i <= n; i++) { const [la, lo] = fn(i / n), q = pr(la, lo); if (q.v > 0) { d += (on ? 'L' : 'M') + `${f(q.x)} ${f(q.y)}`; on = true } else on = false }
      return d
    }
    const lats = [-60, -40, -20, 20, 40, 60].map((la) => line((t) => [la, -90 + t * 180])).join('')
    const mers = [-60, -30, 0, 30, 60, 85].map((lo) => line((t) => [-88 + t * 176, lo])).join('')
    let seed = 9
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
    let tiles = '', windows = ''
    for (let la = -80; la < 80; la += 10) for (let lo = -80; lo < 90; lo += 15) {
      const c = [pr(la, lo), pr(la + 10, lo), pr(la + 10, lo + 15), pr(la, lo + 15)]
      if (c.some((q) => q.v <= 0.05)) continue
      const r = rnd()
      if (r < 0.5) tiles += `<path d="M${c.map((q) => `${f(q.x)} ${f(q.y)}`).join('L')}Z" fill="${r < 0.25 ? P.white : P.blue}" opacity="${r < 0.25 ? 0.7 : 0.5}"/>`
      if (rnd() < 0.6) { const q = pr(la + 3 + rnd() * 4, lo + 3 + rnd() * 9); windows += `<path d="M${f(q.x)} ${f(q.y)}h1v.6h-1Z" fill="${P.goldL}"/>` }
    }
    const trench = line((t) => [0, -90 + t * 180], 36)
    const top = { x: cx + 1, y: cy - Math.sqrt(R * R - 1) }, bot = { x: cx - 8, y: cy + Math.sqrt(R * R - 64) }
    const seamPts = Array.from({ length: 21 }, (_, i) => {
      const t = i / 20, a = 1 - t
      const x = a * a * a * top.x + 3 * a * a * t * 71 + 3 * a * t * t * 69 + t * t * t * bot.x
      const y = a * a * a * top.y + 3 * a * a * t * 40 + 3 * a * t * t * 72 + t * t * t * bot.y
      const j = i === 0 || i === 20 ? 0 : (i % 2 ? 0.8 : -0.5) * (0.6 + (i % 3) * 0.3)
      return `${f(x + j)} ${f(y)}`
    })
    const seam = `M${seamPts.join('L')}`
    const moon = `${seam}A${R} ${R} 0 0 1 ${f(top.x)} ${f(top.y)}Z`
    const crater = (x: number, y: number, r: number) =>
      `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.86)}" fill="${P.sky2}"/>` +
      `<path d="M${f(x - r)} ${y}A${r} ${f(r * 0.86)} 0 0 1 ${f(x + r)} ${y}" fill="none" stroke="${P.blue}" stroke-width="${f(Math.max(0.35, r * 0.18))}"/>` +
      `<path d="M${f(x + r * 0.9)} ${f(y + r * 0.3)}A${r} ${f(r * 0.86)} 0 0 1 ${f(x - r * 0.6)} ${f(y + r * 0.7)}" fill="none" stroke="#fff" stroke-width="${f(Math.max(0.35, r * 0.2))}"/>`
    return (
      space(k, 41) +
      k.sun(cx, cy, 30, 52, 36, false) +
      k.shade(ellipse(cx, cy, 36, 36), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.35) +
      k.draw([{
        d: sphere, fill: P.sky2,
        inner:
          tiles + `<path d="${lats}${mers}" fill="none" stroke="${P.mid}" stroke-width=".55"/>` + windows +
          `<path d="${trench}" fill="none" stroke="${P.ink}" stroke-width="2.4"/><path d="${trench}" fill="none" stroke="${P.white}" stroke-width=".5" transform="translate(0 -1.3)"/>` +
          `<path d="${trench}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".6 1.6"/>` +
          k.shade(sphere, k.rad(P.night, 0.3, 0.28, 0.9, 0, 0.5), P.night, 0.35) +
          `<path d="${seam}" fill="none" stroke="${P.night}" stroke-width="2.4" opacity=".55" transform="translate(1.6 .4)"/>` +
          `<path d="${moon}" fill="${P.white}"/>` +
          k.clip(moon,
            `<path d="M36 50C42 46 48 50 46 56C44 62 36 62 34 58Z" fill="${P.sky1}"/><path d="M44 70C50 68 54 72 52 76C50 80 44 78 42 75Z" fill="${P.sky1}"/><path d="M56 36C60 34 66 36 64 40C62 43 56 42 55 39Z" fill="${P.sky1}"/>` +
            crater(46, 40, 3.2) + crater(40, 56, 2.2) + crater(53, 62, 4.2) + crater(60, 47, 1.6) + crater(45, 74, 2.6) + crater(60, 79, 1.8) + crater(36, 66, 1.4) + crater(56, 33.4, 1.3) + crater(66, 58, 1.4) +
            k.shade(sphere, k.rad(P.blue, 0.34, 0.3, 0.8, 0, 0.9), P.blue, 0.4) +
            hair(34, 70, 40, 80, 50, 84, 0.5, P.blue) + hair(33, 62, 36, 72, 42, 78, 0.45, P.blue) + hair(36, 76, 42, 82, 48, 85, 0.4, P.blue)) +
          `<path d="${seam}" fill="none" stroke="${P.ink}" stroke-width="1.1" stroke-linejoin="round"/><path d="${seam}" fill="none" stroke="#fff" stroke-width=".45" transform="translate(-.9 0)"/>`,
      }], 0.9) +
      sparkle(46, 38, 2.4, '#fff') + sparkle(90, 28, 2, P.paper) + sparkle(28, 86, 1.6, P.paper) +
      k.defs()
    )
  },

  // ── Demoledor imperial ─────────────────────────────────────────────

  // Cinco bases: hacés el ruidito del caza con la boca. El caza de cabina redonda y alas de paneles, con su "¡iiiaaauuu!".
  'Caza TIE': (u) => {
    const k = kit(u)
    const ball = ellipse(0, 0, 8.6, 8.6)
    const wing = 'M17 -20.6L24.6 -17.4V17.4L17 20.6Z'
    const pylon = 'M7.6 -2.2L17 -1.4V1.4L7.6 2.2Z'
    const cells = Array.from({ length: 7 }, (_, i) => `M17 ${f(-15 + i * 5)}L24.6 ${f(-12.8 + i * 4.3)}`).join('') + 'M20.8 -19V19'
    const side = (sx: number) =>
      `<g transform="scale(${sx} 1)">` +
      k.draw([
        { d: pylon, fill: P.sky1, inner: k.sh(pylon, 0, 0, 0, 1, 0, 0.9, P.blue, 0.45) },
        { d: wing, fill: P.blue, inner: `<path d="${cells}" fill="none" stroke="${P.night}" stroke-width=".45" opacity=".8"/>` + k.sh(wing, 0, 0, 1, 1, 0, 0.9, P.night, 0.45) + hair(18.4, -17, 18.6, 0, 18.4, 17, 0.6, P.sky1) + `<path d="M17 -20.6L24.6 -17.4" stroke="${P.sky1}" stroke-width=".5"/>` },
      ], 0.6) +
      `<path d="M15.6 -2.6H18.2V2.6H15.6Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/></g>`
    return (
      space(k, 59) +
      k.sun(60, 61, 12, 42, 28, false) +
      k.shade(ellipse(60, 61, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.35) +
      hair(30, 92, 40, 82, 46, 76, 0.6, P.sky, 0.7) + hair(90, 92, 80, 82, 74, 76, 0.6, P.sky, 0.7) + hair(60, 98, 60, 90, 60, 82, 0.5, P.sky, 0.6) +
      `<g transform="translate(60 61)">` +
      side(1) + side(-1) +
      k.draw([{ d: ball, fill: P.sky1, inner: k.sh(ball, 0, 0, 1, 1, 0, 0.95, P.blue, 0.5) + hair(-6, -3, -5, -6.4, -1.6, -7.6, 0.6, '#fff') }], 0.7) +
      `<circle cx="0" cy="0" r="5.2" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M0 -5.2V5.2M-5.2 0H5.2" stroke="${P.sky2}" stroke-width=".7"/><circle cx="0" cy="0" r="2" fill="none" stroke="${P.sky2}" stroke-width=".6"/>` +
      `<path d="M-3.6 -2.2A4.2 4.2 0 0 1 -1.4 -4" fill="none" stroke="${SW_L}" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>` +
      `<text x="60" y="31.4" font-family="Georgia, serif" font-style="italic" font-size="6" fill="${P.paper}" text-anchor="middle">¡iiiaaauuu!</text>` +
      hair(36, 34, 33, 30, 34, 25, 0.5, P.paper, 0.8) + hair(84, 34, 87, 30, 86, 25, 0.5, P.paper, 0.8) +
      k.defs()
    )
  },

  // Veinte bases: tu nave tapa el sol del planeta entero. El destructor en cuña eclipsa al sol, sobre el planeta a oscuras.
  'Destructor Estelar': (u) => {
    const k = kit(u)
    // Casco en planta (punta a la izquierda), aplastado para verlo de arriba en perspectiva.
    const sq = 0.6
    const P2 = (x: number, y: number) => `${f(x)} ${f(y * sq)}`
    const hull = `M${P2(-40, 0)}L${P2(30, -16)}L${P2(30, 16)}Z`
    const lit = `M${P2(-40, 0)}L${P2(30, -16)}L${P2(30, 0)}Z`
    const keel = `M${P2(-40, 0)}L${P2(30, 16)}L30 ${f(16 * sq + 3.4)}L-38 ${f(2.6)}Z`
    const trench = `M${P2(-30, -1.6)}L${P2(26, -13.2)}M${P2(-30, 1.6)}L${P2(26, 13.2)}`
    const lights = Array.from({ length: 12 }, (_, i) => { const t = 0.1 + i * 0.07; return `<circle cx="${f(-40 + 70 * t)}" cy="${f(16 * t * sq + 1.4)}" r=".35" fill="${P.goldL}"/>` }).join('')
    const deck = 'M6 0L7 -3.4H14L15 -6.6H21L22 -11H26.6L27.4 -6.6L28.6 0Z'
    const planet = ellipse(60, 146, 76, 56)
    return (
      space(k, 77) +
      k.sun(62, 52, 10, 50, 36, false) +
      k.shade(ellipse(62, 52, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.5) +
      `<circle cx="62" cy="52" r="9" fill="${P.goldL}"/><circle cx="62" cy="52" r="9" fill="none" stroke="#fff" stroke-width="1.2"/>` +
      k.draw([{ d: planet, fill: SW, inner: k.shade(planet, k.rad(SW_D, 0.5, 0.3, 0.5, 0, 1), SW_D, 0.5) + `<path d="${planet}" fill="none" stroke="${P.sky}" stroke-width="1.8" opacity=".75"/>` + hair(26, 96, 60, 88.6, 94, 96, 1, '#fff', 0.8) +
          [[44, 96], [52, 94.6], [70, 95], [76, 97.4], [62, 97.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".4" fill="${P.goldL}"/>`).join('') }], 0.6) +
      `<g transform="translate(58 54) rotate(-12) scale(.8)">` +
      `<ellipse cx="33" cy="0" rx="5" ry="6" fill="${BLADE_B}" opacity=".35"/>` +
      [-4.6, 0, 4.6].map((y) => `<ellipse cx="31.4" cy="${y}" rx="1.4" ry="1.8" fill="${BLADE_B}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="31.8" cy="${y}" rx=".5" ry=".9" fill="#fff"/>`).join('') +
      k.cast([hull, keel], 2.4, 3, '#000') +
      k.draw([
        { d: keel, fill: SW_D, inner: hair(-30, 4, 0, 8.6, 28, 10.6, 0.4, SW_L) },
        {
          d: hull, fill: SW,
          inner: `<path d="${lit}" fill="${SW_L}"/>` + k.sh(hull, 0, 0, 1, 0, 0, 0.8, SW_D, 0.45) +
            `<path d="${trench}" stroke="${SW_D}" stroke-width=".6"/>` + lights +
            `<path d="M${P2(-40, 0)}L${P2(30, -16)}" stroke="${P.goldL}" stroke-width=".9"/><path d="M${P2(-40, 0)}L${P2(30, 0)}" stroke="${P.sky}" stroke-width=".45" opacity=".8"/>` +
            hair(-10, -4.6, 6, -6.4, 22, -7, 0.4, P.sky, 0.7) +
            [-22, -12, -2, 8, 18].map((x) => `<path d="M${f(x)} ${f(-((x + 40) / 70) * 16 * sq + 0.6)}L${f(x + 3)} ${f(-0.4)}" stroke="${SW_D}" stroke-width=".4"/><path d="M${f(x)} ${f(((x + 40) / 70) * 16 * sq - 0.6)}L${f(x + 3)} .4" stroke="${SW_D}" stroke-width=".4"/>`).join(''),
        },
        { d: deck, fill: SW, inner: k.sh(deck, 0, 0, 1, 0, 0, 0.8, SW_D, 0.45) + `<path d="M7 -3.4H14M15 -6.6H21M22 -11H26.6" stroke="${P.goldL}" stroke-width=".7"/><path d="M9 -1.6H13M17 -4.6H20" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".5 .6"/>` },
      ], 0.6) +
      `<path d="M24 -11V-15.6M25.8 -11V-13.6" stroke="${P.ink}" stroke-width=".5"/>` +
      `</g>` +
      sparkle(30, 30, 1.8, P.paper) + sparkle(92, 70, 1.4, P.paper) +
      k.defs()
    )
  },

  // Sesenta bases: respirás fuerte detrás de una máscara negra. La máscara de laca, el sable rojo y el vapor.
  'Lado oscuro': (u) => {
    const k = kit(u)
    const mask = 'M60 32.4C71 32.4 77.4 39.6 77.8 50.4C78.2 59.6 75.8 68 71.4 74.2C68 79 64 81.6 60 81.6C56 81.6 52 79 48.6 74.2C44.2 68 41.8 59.6 42.2 50.4C42.6 39.6 49 32.4 60 32.4Z'
    const lips = 'M54.8 70.2C56.6 69 58.6 68.8 60 69.6C61.4 68.8 63.4 69 65.2 70.2C63.4 72.6 56.6 72.6 54.8 70.2Z'
    const side = (sx: number) =>
      `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)">` +
      `<path d="M46.8 52.4C49.6 51.2 54 51.4 56.6 53.2C54.4 55 49.6 55.2 46.8 52.4Z" fill="#070C1C" stroke="${P.ink}" stroke-width=".5"/>` +
      hair(46, 48.8, 51, 47.6, 56.4, 49.4, 0.6, SW_L, 0.7) + hair(46.2, 61, 50, 63, 53.4, 62.4, 0.6, SW_L, 0.8) +
      `<path d="M47.2 41.4C45.4 44.6 45 48 45.6 50.6" fill="none" stroke="${P.gold}" stroke-width=".55" stroke-linecap="round"/>` +
      `<path d="M60 46.4C58.4 43.6 55 42.8 53.4 44.6C52.2 46 53.2 47.8 54.6 47.4" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/>` +
      `<path d="M46.4 64.6C47.6 68.4 50 71.6 52.6 73.2" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-linecap="round"/><circle cx="52.6" cy="73.2" r=".5" fill="${P.goldL}"/>` +
      `<circle cx="54.6" cy="47.4" r=".45" fill="${P.goldL}"/></g>`
    const puff = (x: number, y: number, s: number, flip: number) =>
      `<g transform="translate(${x} ${y}) scale(${f(s * flip)} ${s})" opacity=".8">` +
      `<path d="M0 0C-3 1 -4.6 4 -2.6 6C-.8 7.8 2.4 6.6 2 4.4C1.8 3 0 3 -.2 4.2" fill="none" stroke="${P.sky1}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M-2.6 6C-5 8 -4.4 11.4 -1.6 12" fill="none" stroke="${P.sky1}" stroke-width=".6" stroke-linecap="round" opacity=".7"/></g>`
    return (
      space(k, 3) +
      redGlory(k, 60, 57, 22, 50, 36) +
      k.shade(ellipse(60, 57, 30, 32), k.rad(BLADE_R, 0.5, 0.5, 0.5, 0.8, 0), BLADE_R, 0.4) +
      `<g transform="translate(48.4 70) rotate(72)">` + saber(k, 48, BLADE_R, true) + `</g>` +
      k.cast([mask], 2, 2.2, P.wine) +
      k.draw([{
        d: mask, fill: '#0B1226',
        inner:
          `<path d="${mask}" fill="${k.lin(SW_L, 0, 0, 1, 1, 0.6, 0)}"/>` + k.sh('M60 30H80V84H60Z', 0, 0, 1, 0, 0, 0.8, '#05080F', 0.5) +
          Array.from({ length: 6 }, (_, i) => hair(70 + i * 1.3, 44 + i * 2, 74 + i * 0.6, 58, 69 + i * 0.6, 72 - i * 0.6, 0.35, SW_L, 0.7)).join('') +
          `<path d="M60 48C59.2 54 58.6 59 57.8 63.2C58.8 64.4 61.2 64.4 62.2 63.2C61.4 59 60.8 54 60 48Z" fill="${SW_L}" opacity=".45"/>` +
          hair(59.6, 48, 59, 56, 58.6, 62, 0.5, '#fff', 0.6) + hair(51, 58, 50.6, 62, 52, 65, 0.7, '#fff', 0.5) +
          `<path d="M44 40C48 36 54 34.4 60 34.4V43C54 43 48 45 44 49Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.5, 0)}"/>` +
          hair(49.4, 40.6, 53, 37.2, 58, 36, 0.9, '#fff', 0.9) + hair(46, 66, 48, 71, 52, 75.6, 0.8, SW_L) +
          `<path d="${lips}" fill="#070C1C"/><path d="M55.6 70.3C58 70.9 62 70.9 64.4 70.3" fill="none" stroke="${SW_L}" stroke-width=".45"/><path d="M57 72.2C58.6 72.8 61.4 72.8 63 72.2" fill="none" stroke="${SW_L}" stroke-width=".5" opacity=".8"/>` +
          `<path d="${mask}" fill="none" stroke="${P.gold}" stroke-width=".7" transform="translate(60 57) scale(.94) translate(-60 -57)"/>` +
          `<path d="${mask}" fill="none" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray=".01 1.2" stroke-linecap="round" transform="translate(60 57) scale(.89) translate(-60 -57)"/>`,
      }], 0.85) +
      side(1) + side(-1) +
      `<path d="M60 46.4V38.6" stroke="${P.gold}" stroke-width=".6"/><path d="${starPath(60, 38, 2.2, 0.8, 4)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><circle cx="60" cy="38" r=".6" fill="${BLADE_R}"/>` +
      puff(62.6, 81.4, 1, -1) + puff(70.4, 84.6, 0.8, -1) +
      `<text x="82.6" y="86" font-family="Georgia, serif" font-style="italic" font-size="4.4" fill="${P.paper}" text-anchor="middle">kshhh…</text>` +
      sparkle(32, 40, 1.8, P.paper) +
      k.defs()
    )
  },
}
