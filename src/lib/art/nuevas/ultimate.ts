// Ultimate frisbee en clave heroica: el disco (de canto, en escorzo, con los anillos de vuelo y el borde grueso), el
// césped de la cancha y la zona de gol. Las atrapadas son pegajosas (el guante de abrojo, el imán, el plato volador)
// y los pases se ven derechitos, por arriba de todos y desde un dron.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { FULL, glow, label, PIEL, PIEL_D, sand, sea } from './_voley-piezas'

/** Verde de la ficha (el del juego), apagado de estampa, y el del césped. */
const UL = '#2E9C7A', UL_D = '#1C6A52', UL_L = '#8FCDB6'
const GRASS = '#7FA557', GRASS_D = '#57783A', GRASS_L = '#A7C482'
/** Abrojo. */
const VELCRO = '#3A4466'

/** Papel del día con el grano verde de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#B9DCCB', 0.5, 0.46, 0.7, 0, 1), '#8CC4AC', 0.45)

/** Césped desde y0 con sus franjas de cortadora. */
function grass(k: Kit, y0: number) {
  const d = `M-2 ${y0}H122V132H-2Z`
  const bands = [0, 1, 2, 3].map((i) => `M${-10 + i * 36} ${y0}L${8 + i * 36} ${y0}L${-6 + i * 42} 132L${-26 + i * 42} 132Z`).join('')
  return `<path d="${d}" fill="${GRASS}"/>` + k.clip(d, `<path d="${bands}" fill="${GRASS_L}" opacity=".35"/>`) + k.sh(d, 0, 0, 0, 1, 0, 0.6, GRASS_D, 0.4) + `<path d="M-2 ${y0}H122" stroke="${P.ink}" stroke-width=".6"/>`
}

/** Disco en escorzo centrado en (0,0), de radio r y achatado `sq` (0 de canto, 1 de frente). `under` lo muestra de abajo. */
function disc(k: Kit, r: number, sq: number, o: { fill?: string; dark?: string; ring?: string; under?: boolean; logo?: string } = {}) {
  const fill = o.fill ?? P.white, dark = o.dark ?? P.blue, ring = o.ring ?? UL
  const ry = r * sq, rim = Math.max(1.6, r * 0.16)
  const top = ellipse(0, 0, r, ry)
  const body = `M${-r} 0A${r} ${f(ry)} 0 0 1 ${r} 0V${f(rim)}A${r} ${f(ry)} 0 0 1 ${-r} ${f(rim)}Z`
  if (o.under) {
    const cav = ellipse(0, f(rim * 0.4), f(r * 0.86), f(ry * 0.8))
    return k.draw([{
      d: `M${-r} 0A${r} ${f(ry)} 0 0 1 ${r} 0A${r} ${f(ry)} 0 0 1 ${-r} 0Z`, fill,
      inner: `<path d="${cav}" fill="${dark}" opacity=".55"/>` + k.sh(cav, 0, 0, 0, 1, 0.6, 0, P.ink, 0.35) +
        `<path d="M${f(-r * 0.86)} ${f(rim * 0.4)}A${f(r * 0.86)} ${f(ry * 0.8)} 0 0 0 ${f(r * 0.86)} ${f(rim * 0.4)}" fill="none" stroke="${P.white}" stroke-width=".5" opacity=".8"/>`,
    }], 0.6)
  }
  return k.draw([
    { d: body, fill: dark, inner: k.sh(body, 0, 0, 1, 0, 0, 0.7, P.ink, 0.35) + `<path d="M${-r} ${f(rim * 0.5)}A${r} ${f(ry)} 0 0 0 ${r} ${f(rim * 0.5)}" fill="none" stroke="${P.white}" stroke-width=".35" opacity=".6"/>` },
    {
      d: top, fill,
      inner:
        `<ellipse cx="0" cy="0" rx="${f(r * 0.8)}" ry="${f(ry * 0.8)}" fill="none" stroke="${ring}" stroke-width="${f(Math.max(0.5, r * 0.05))}"/>` +
        `<ellipse cx="0" cy="0" rx="${f(r * 0.66)}" ry="${f(ry * 0.66)}" fill="none" stroke="${ring}" stroke-width="${f(Math.max(0.3, r * 0.025))}" opacity=".8"/>` +
        (o.logo ?? '') +
        k.sh(top, 0, 0, 1, 1, 0, 0.7, dark, 0.35) +
        `<ellipse cx="${f(-r * 0.38)}" cy="${f(-ry * 0.42)}" rx="${f(r * 0.3)}" ry="${f(ry * 0.18)}" fill="#fff" opacity=".8"/>`,
    },
  ], f(Math.min(0.7, r * 0.05)))
}

/** Mano abierta de frente (silueta para las manos levantadas), con la muñeca en (0,0). */
const HAND = 'M-5 0C-5.4 -4 -6.6 -6 -8.6 -8.6C-9.6 -10 -8 -11.4 -6.6 -10.2L-4.6 -8.4V-17C-4.6 -18.6 -2.6 -18.6 -2.6 -17V-11.6V-19.6C-2.6 -21.2 -.4 -21.2 -.4 -19.6V-11.6V-19C-.4 -20.6 1.8 -20.6 1.8 -19V-11.4V-17C1.8 -18.6 3.8 -18.6 3.8 -17V-8C3.8 -4 3.6 -2 3 0Z'

export const ULTIMATE_ART: Record<string, (u: number) => string> = {
  // ── Receptor ───────────────────────────────────────────────────────

  // Cinco puntos: el guante con la palma de abrojo, y el disco que se le quedó pegado de canto.
  'Manos de velcro': (u) => {
    const k = kit(u)
    const glove = 'M-12 18C-13 10 -13 4 -12.4 -2L-12.8 -16C-12.8 -18.6 -9.4 -18.6 -9.2 -16L-8.6 -6L-7.8 -22C-7.6 -24.6 -4 -24.6 -4 -22L-3.8 -7L-2.6 -24C-2.4 -26.6 1.2 -26.6 1.2 -24L1.2 -7L2.8 -21.4C3 -24 6.6 -23.8 6.4 -21.2L5.6 -4C8.4 -8 11 -11 13.6 -11.6C16 -12 17 -10 15.6 -8C12.4 -3.4 10 2 9.4 8L9.6 18Z'
    const cuff = roundRect(-13, 15, 11, 25, 2)
    const hooks = Array.from({ length: 42 }, (_, i) => {
      const x = -10 + (i % 7) * 2.8 + (Math.floor(i / 7) % 2) * 1.4, y = -4 + Math.floor(i / 7) * 3
      return `M${f(x)} ${f(y)}c.6 -.9 1.4 -.6 1.2 .2`
    }).join('')
    return (
      field(k) +
      k.sun(60, 54, 14, 44, 32, false) +
      glow(k, 60, 56, 26, 26, 0.6) +
      `<g transform="translate(56 62) rotate(-8)">` +
      k.cast([glove, cuff], 2, 2, P.mid) +
      k.draw([
        { d: cuff, fill: UL, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.7, UL_D, 0.4) + `<path d="M-13 18H11" stroke="${UL_L}" stroke-width=".6"/>` },
        {
          d: glove, fill: P.sky1,
          inner: `<path d="M-11.6 -6H9.6V15H-11.6Z" fill="${VELCRO}"/>` + `<path d="${hooks}" fill="none" stroke="${P.blue}" stroke-width=".45" stroke-linecap="round"/>` +
            k.sh(glove, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + hair(-10, -14, -10.6, -8, -10.4, -2, 0.5, '#fff', 0.8) + hair(-5.6, -20, -6, -12, -5.8, -6, 0.5, '#fff', 0.8),
        },
      ], 0.7) +
      `</g>` +
      `<g transform="translate(66 60) rotate(-28)">` + disc(k, 15, 0.42) + `</g>` +
      `<path d="M72 74l1.6 2.4M76 72l2 1.8M68 76l.8 2.6" stroke="${P.ink}" stroke-width=".6" stroke-linecap="round"/>` +
      label(80, 37, 'crrrch', 5.8, 12) +
      sparkle(34, 40, 2) + sparkle(88, 84, 1.4) +
      k.defs()
    )
  },

  // Veinticinco puntos: el imán de herradura, y los discos que le vienen solos, con las líneas del campo.
  'Imán de discos': (u) => {
    const k = kit(u)
    const magnet = 'M-14 -16V2C-14 12 -7 18 0 18C7 18 14 12 14 2V-16H6V2C6 6 3.4 9 0 9C-3.4 9 -6 6 -6 2V-16Z'
    const tips = 'M-14 -16H-6V-9H-14ZM6 -16H14V-9H6Z'
    const lines = [0, 1, 2].map((i) => `M${f(44 - i * 6)} ${f(46 - i * 6)}C${f(30 - i * 8)} ${f(46 - i * 2)} ${f(30 - i * 8)} ${f(74 + i * 2)} ${f(44 - i * 6)} ${f(74 + i * 6)}`).join('')
    return (
      field(k) +
      k.stage(60, 58, 34) +
      `<path d="${lines}" fill="none" stroke="${P.blue}" stroke-width=".7" stroke-dasharray="1.6 1.6"/>` +
      `<g transform="translate(74 58) rotate(-90)">` +
      k.cast([magnet], 2, -2, P.mid) +
      k.draw([{
        d: magnet, fill: P.red,
        inner: `<path d="${tips}" fill="${P.white}"/>` + k.sh(magnet, 0, 0, 1, 1, 0, 0.7, P.wine, 0.45) +
          hair(-11.6, -6, -12, 4, -8, 12, 0.7, '#fff', 0.7) + `<path d="M-14 -9H-6M6 -9H14" stroke="${P.ink}" stroke-width=".5"/>`,
      }], 0.75) +
      `</g>` +
      hair(24, 56, 28, 55.6, 30, 56, 0.8, P.mid) + hair(24, 62, 28, 62, 30, 61.6, 0.8, P.mid) +
      `<g transform="translate(42 58) rotate(-8)">` + disc(k, 10, 0.42) + `</g>` +
      `<g transform="translate(36 40) rotate(16)">` + disc(k, 7, 0.42) + `</g>` +
      `<g transform="translate(36 78) rotate(-24)">` + disc(k, 7, 0.42) + `</g>` +
      sparkle(88, 34, 2) + sparkle(88, 84, 1.6) +
      k.defs()
    )
  },

  // Ochenta puntos: el disco con cúpula y lucecitas, el haz de luz sobre la zona de gol. Un OVNI.
  'Platillo volador': (u) => {
    const k = kit(u)
    const dome = 'M-8 -2C-8 -9 -4 -12.6 0 -12.6C4 -12.6 8 -9 8 -2Z'
    const beam = 'M52 52L66 52L86 98H32Z'
    const lights = Array.from({ length: 7 }, (_, i) => { const t = (i + 0.5) / 7, a = Math.PI * (1 - t); return `<circle cx="${f(Math.cos(a) * 15.6)}" cy="${f(Math.sin(a) * 3.6 + 2.6)}" r="1.1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` }).join('')
    return (
      k.night() +
      Array.from({ length: 14 }, (_, i) => `<circle cx="${f(24 + ((i * 41) % 74))}" cy="${f(22 + ((i * 23) % 40))}" r="${i % 3 ? 0.45 : 0.7}" fill="${P.paper}"/>`).join('') +
      laurel(48, 101, 30, 93, 27, 63, 8) + laurel(72, 101, 90, 93, 93, 63, 8, true) +
      `<path d="M-2 88H122V132H-2Z" fill="${UL_D}"/>` + `<path d="M-2 88H122" stroke="${UL_L}" stroke-width=".8"/><path d="M20 96H100" stroke="${UL_L}" stroke-width=".6" stroke-dasharray="2 2"/>` +
      k.shade(beam, k.lin(P.goldL, 0, 0, 0, 1, 0.85, 0.2), P.goldL, 0.5) +
      `<ellipse cx="59" cy="96" rx="22" ry="3.6" fill="${P.goldL}" opacity=".5"/>` +
      `<g transform="translate(59 92)">` + `<path d="M-3 0L0 -6L3 0Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` + `</g>` +
      `<g transform="translate(59 48) rotate(-6)">` +
      k.draw([{ d: dome, fill: P.sky1, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) + `<path d="M-5 -6C-4 -9 -2 -10.4 0 -10.6" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` }], 0.6) +
      disc(k, 19, 0.3, { ring: P.gold, logo: `<path d="${starPath(0, 0, 2.4, 1, 5)}" fill="${P.gold}" transform="scale(1 .3)"/>` }) +
      lights +
      `</g>` +
      sparkle(86, 30, 2.6, P.goldL) + sparkle(32, 34, 1.8, '#fff') + sparkle(90, 70, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Lanzador ───────────────────────────────────────────────────────

  // Cinco asistencias: el revés de playa sale derechito, por la regla, sobre el mar.
  'Revés de playa': (u) => {
    const k = kit(u)
    return (
      field(k) +
      k.sun(60, 42, 13, 40, 32, false) +
      sea(k, 58, 68) +
      sand(k, 68, 3) +
      `<path d="M22 62H96" stroke="${P.ink}" stroke-width="1" stroke-dasharray="2.4 2"/>` +
      Array.from({ length: 9 }, (_, i) => `<path d="M${24 + i * 9} 66V${i % 2 ? 68.6 : 70}" stroke="${P.ink}" stroke-width=".6"/>`).join('') +
      hair(30, 50, 38, 49.6, 46, 50, 1, P.mid, 0.8) + hair(26, 55, 36, 54.6, 46, 55, 0.8, P.mid, 0.7) +
      `<g transform="translate(66 52) rotate(-4)">` + disc(k, 14, 0.36) + `</g>` +
      k.floor(66, 80, 12, 2, P.mid) +
      label(60, 90, 'derechito', 6, 0) +
      sparkle(90, 40, 2) + sparkle(30, 44, 1.6) +
      k.defs()
    )
  },

  // Veinticinco asistencias: el martillo, el disco dado vuelta que pasa por arriba de todas las manos levantadas.
  'Martillo': (u) => {
    const k = kit(u)
    const arc = 'M30 92Q34 38 66 38'
    const hands = [[42, 92, -8], [60, 90, 4], [78, 93, 12]] as const
    return (
      field(k) +
      k.stage(60, 56, 34) +
      grass(k, 86) +
      `<path d="${arc}" fill="none" stroke="${P.mid}" stroke-width="1" stroke-dasharray="2.2 2" stroke-linecap="round"/>` +
      hands.map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.05)">` + k.cast([HAND], 1.2, 1.2, GRASS_D) + k.draw([{ d: HAND, fill: PIEL, inner: k.sh(HAND, 0, 0, 1, 0, 0, 0.7, PIEL_D, 0.4) }], 0.5) + `<path d="M-5 0H3V8H-5Z" fill="${UL}" stroke="${P.ink}" stroke-width=".5"/></g>`).join('') +
      `<g transform="translate(70 40) rotate(150)">` + disc(k, 13, 0.42, { under: true, dark: P.blue }) + `</g>` +
      `<g transform="translate(70 40) rotate(-30)">` + `<path d="M-13 -1A13 5.4 0 0 0 13 -1" fill="none" stroke="${UL}" stroke-width="1"/>` + `</g>` +
      hair(56, 26, 52, 28, 50, 32, 0.6, P.mid) +
      sparkle(90, 54, 2) + sparkle(34, 40, 1.6) +
      k.defs()
    )
  },

  // Ochenta asistencias: el dron con su cámara sobre la cancha vista de arriba, con las dos zonas de gol.
  'Mariscal del disco': (u) => {
    const k = kit(u)
    const pitch = 'M30 20H90V108H30Z'
    const arm = (a: number) => taper(0, 0, Math.cos(a) * 7, Math.sin(a) * 7, Math.cos(a) * 14, Math.sin(a) * 14, 3, 2.2)
    const rotor = (a: number) => {
      const x = f(Math.cos(a) * 14), y = f(Math.sin(a) * 14)
      return `<circle cx="${x}" cy="${y}" r="7.6" fill="${P.white}" opacity=".35" stroke="${P.ink}" stroke-width=".4" stroke-dasharray="1 1"/>` +
        `<path d="M${f(+x - 6.6)} ${f(+y - 1.4)}L${f(+x + 6.6)} ${f(+y + 1.4)}" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M${f(+x - 6.6)} ${f(+y - 1.4)}L${f(+x + 6.6)} ${f(+y + 1.4)}" stroke="${P.sky1}" stroke-width=".6" stroke-linecap="round"/>` +
        `<circle cx="${x}" cy="${y}" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${x}" cy="${y}" r=".9" fill="${P.goldD}"/>`
    }
    const A = [-Math.PI / 4, Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4]
    const body = roundRect(-6, -8, 6, 8, 3)
    return (
      `<rect width="120" height="130" fill="${GRASS}"/>` +
      k.shade(FULL, k.rad(GRASS_D, 0.5, 0.46, 0.7, 0, 1), GRASS_D, 0.45) +
      [0, 1, 2, 3, 4].map((i) => `<path d="M30 ${20 + i * 17.6}H90V${f(28.8 + i * 17.6)}H30Z" fill="${GRASS_L}" opacity=".3"/>`).join('') +
      `<path d="${pitch}" fill="none" stroke="${P.white}" stroke-width="1.2"/><path d="M30 38H90M30 90H90" stroke="${P.white}" stroke-width="1"/>` +
      [[34, 38], [86, 38], [34, 90], [86, 90]].map(([x, y]) => `<path d="M${x - 1.6} ${y + 1.4}L${x} ${y - 2}L${x + 1.6} ${y + 1.4}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      `<path d="M46 84Q40 70 54 62" fill="none" stroke="${P.white}" stroke-width=".8" stroke-dasharray="1.6 1.6"/>` +
      `<g transform="translate(46 88)">` + disc(k, 5, 1) + `</g>` +
      `<path d="M74 34C74 26 90 26 90 34" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` +
      `<g transform="translate(64 56) rotate(-12) scale(1.25)">` +
      k.shade(ellipse(4, 6, 22, 22), k.rad(P.night, 0.5, 0.5, 0.5, 0.5, 0), P.night, 0.35) +
      k.draw(A.map((a) => ({ d: arm(a), fill: P.night, inner: k.sh(arm(a), 0, 0, 1, 1, 0, 0.6, '#0F1736', 0.3) })), 0.5) +
      A.map(rotor).join('') +
      k.draw([{ d: body, fill: P.white, inner: k.sh(body, 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) + `<path d="M-4 -6H4" stroke="${P.gold}" stroke-width="1"/><path d="M-4 6H4" stroke="${P.gold}" stroke-width=".6"/><path d="${starPath(0, 0, 2.6, 1.1, 5)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/>` }], 0.6) +
      `<circle cx="0" cy="9.6" r="2.2" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/><circle cx="-.6" cy="9" r=".6" fill="${P.sky}"/>` +
      `</g>` +
      sparkle(86, 70, 2.2, P.goldL) + sparkle(38, 30, 1.8, P.goldL) +
      k.defs()
    )
  },
}
