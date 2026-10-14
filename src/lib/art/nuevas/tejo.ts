// Tejo de playa: la arena, el mar al fondo, los tejos de metal (discos chatos) y el tejín colorado; la ojota que hace
// de cinta métrica, la sombrilla a rayas y el cartel de madera de la bajada a la playa.
import { f } from '../helpers'
import { ellipse, hair, kit, P, sparkle, type Kit } from '../kit'
import { disc, glow, rotulo, SAND, SAND_D, SAND_L, WOOD, WOOD_D, WOOD_G, WOOD_L } from './_bar-piezas'

// ── Piezas del tejo ──────────────────────────────────────────────────

/** Playa: el mar hasta y0 (con la espuma) y la arena con sus huellas y sus granos. */
function beach(k: Kit, y0: number, o: { dune?: boolean } = {}) {
  const sea = `M-10 ${f(y0 - 12)}H130V${y0}H-10Z`
  const sand = o.dune
    ? `M-10 ${f(y0 + 2)}C20 ${f(y0 - 4)} 40 ${f(y0 - 2)} 60 ${y0}C80 ${f(y0 + 2)} 100 ${f(y0 - 2)} 130 ${y0}V140H-10Z`
    : `M-10 ${y0}C20 ${f(y0 - 1.4)} 50 ${f(y0 + 1)} 70 ${f(y0 - 0.4)}C90 ${f(y0 - 1.4)} 110 ${f(y0 + 0.6)} 130 ${y0}V140H-10Z`
  const grains = Array.from({ length: 40 }, (_, i) => {
    const x = ((i * 37.3) % 120), y = y0 + 6 + ((i * 19.7) % 40)
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${i % 3 ? 0.35 : 0.5}" fill="${SAND_D}"/>`
  }).join('')
  return (
    k.draw([{
      d: sea, fill: P.sky,
      inner: k.sh(sea, 0, 0, 0, 1, 0.5, 0, P.mid, 0.4) +
        [[20, y0 - 8, 8], [70, y0 - 9, 10], [96, y0 - 6, 7], [44, y0 - 5, 9]].map(([x, y, l]) => hair(x - l, y, x, y - 0.8, x + l, y, 0.5, P.white, 0.9)).join('') +
        `<path d="M-10 ${f(y0 - 1.6)}C10 ${f(y0 - 3)} 20 ${f(y0 - 0.6)} 36 ${f(y0 - 2)}C52 ${f(y0 - 3.4)} 70 ${f(y0 - 0.8)} 88 ${f(y0 - 2.2)}C104 ${f(y0 - 3.2)} 118 ${f(y0 - 1)} 130 ${f(y0 - 2)}V${y0}H-10Z" fill="${P.white}"/>`,
    }], 0.5) +
    k.draw([{ d: sand, fill: SAND, inner: k.sh(sand, 0, 0, 0, 1, 0, 0.75, SAND_D, 0.45) + `<path d="M-10 ${y0}H130V${f(y0 + 6)}H-10Z" fill="${k.lin(SAND_L, 0, 0, 0, 1, 0.8, 0)}"/>` + grains }], 0.6)
  )
}

/** Tejo de metal acostado en la arena (acero o, con `gold`, de oro). */
const tejo = (k: Kit, x: number, y: number, r: number, gold = false) =>
  k.floor(x + 1, y + r * 0.42 + r * 0.16, r * 1.1, r * 0.3, SAND_D) +
  disc(k, x, y, r, f(r * 0.4), f(r * 0.2), gold ? { ring: true } : { c: P.sky1, edge: P.sky2, dark: P.blue, ring: true })

/** El tejín: la bolita colorada. */
function tejin(k: Kit, x: number, y: number, r: number) {
  const d = ellipse(x, y, r, r)
  return k.floor(x + 0.6, y + r * 0.9, r * 1.2, r * 0.3, SAND_D) +
    k.draw([{ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) + `<path d="M${f(x - r)} ${y}A${r} ${f(r * 0.3)} 0 0 0 ${f(x + r)} ${y}" fill="none" stroke="${P.white}" stroke-width="${f(r * 0.2)}"/>` }], 0.45) +
    `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.42)}" rx="${f(r * 0.24)}" ry="${f(r * 0.14)}" fill="#fff" transform="rotate(-38 ${f(x - r * 0.4)} ${f(y - r * 0.42)})"/>`
}

const SOLE = 'M0 -22C6 -22 9 -17 9 -10C9 -3 6.6 2 6.8 8C7 14 8 18 6 21C4 23.4 -4 23.4 -6 21C-8 18 -7 14 -7 8C-7 2 -9 -3 -9 -10C-9 -17 -6 -22 0 -22Z'
const INSOLE = 'M0 -20.4C5 -20.4 7.4 -16 7.4 -10C7.4 -3 5.2 2 5.4 8C5.6 14 6.4 17.6 4.8 19.8C3 21.8 -3 21.8 -4.8 19.8C-6.4 17.6 -5.6 14 -5.6 8C-5.6 2 -7.4 -3 -7.4 -10C-7.4 -16 -5 -20.4 0 -20.4Z'

/** Ojota vista de arriba, centrada en (x,y) y girada `rot`: suela, plantilla gastada y las tiras. `ruler` le marca
 * las rayitas de cinta métrica en el canto. */
function ojota(k: Kit, x: number, y: number, rot: number, o: { ruler?: boolean; s?: number } = {}) {
  const strap = (sx: number) => `M0 -12.6C${sx * 3} -10 ${sx * 6} -5 ${sx * 7.6} .6L${sx * 6} 1.4C${sx * 4.6} -3.4 ${sx * 2.4} -8 -.2 -10.6Z`
  const ticks = o.ruler ? Array.from({ length: 21 }, (_, i) => { const yy = -19 + i * 2, l = i % 5 === 0 ? 2.6 : 1.4; return `M${f(7.2 - (Math.abs(yy) > 15 ? 1.6 : 0))} ${yy}h${-l}` }).join('') : ''
  const nums = o.ruler ? [0, 5, 10, 15, 20].map((i) => `<text x="3.4" y="${f(-18 + i * 2)}" font-family="Georgia, serif" font-size="2" fill="${P.ink}" text-anchor="middle">${i / 5}</text>`).join('') : ''
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${o.s ?? 1})">` +
    k.cast([SOLE], 2, 1.6, SAND_D) +
    k.draw([{
      d: SOLE, fill: P.mid,
      inner: `<path d="${INSOLE}" fill="${P.sky}"/>` + k.sh(INSOLE, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) +
        `<path d="${ellipse(-0.6, -13, 3.8, 5)}${ellipse(0, 14, 3.4, 4.4)}" fill="${P.blue}" opacity=".45"/>` +
        `<path d="${ticks}" stroke="${P.ink}" stroke-width=".5"/>` + nums,
    }], 0.6) +
    k.draw([{ d: strap(-1), fill: P.white, inner: k.sh(strap(-1), 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) }, { d: strap(1), fill: P.white, inner: k.sh(strap(1), 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.45) +
    `<circle cx="0" cy="-12.2" r="1.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
    `</g>`
  )
}

export const TEJO_ART: Record<string, (u: number) => string> = {
  // Cinco ganados: la ojota acostada entre el tejín y el tejo, con las rayitas de la cinta métrica oficial.
  'Ojota de medir': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 40, 13, 40, 32, true) +
      beach(k, 50) +
      tejin(k, 34, 80, 3.6) +
      ojota(k, 58, 72, -62, { ruler: true, s: 1.1 }) +
      tejo(k, 86, 62, 8.4) +
      `<path d="M30 92Q34 94 38 92M74 96Q78 98 82 96" fill="none" stroke="${SAND_D}" stroke-width=".7"/>` +
      `<path d="M38.6 86.4L46 90.6M78.6 72L86 67.4" stroke="${P.red}" stroke-width=".6" stroke-dasharray="1 1"/>` +
      rotulo(42, 60, 4.8, '≈ 2 ojotas', { rot: -6, c: P.ink, bold: true }) +
      sparkle(88, 50, 1.6) + sparkle(30, 62, 1.4) +
      k.defs()
    )
  },

  // Veinte victorias: la sombrilla a rayas clavada en la arena, con su banderín, y los tejos a la sombra.
  'Sombrilla propia': (u) => {
    const k = kit(u)
    const canopy = 'M24 44C30 30 44 22 60 22C76 22 90 30 96 44C90 42 84 42 78 45C72 42 66 41.4 60 44C54 41.4 48 42 42 45C36 42 30 42 24 44Z'
    const flag = 'M60 12L70 14.6L60 17.2Z'
    return (
      k.day() +
      k.stage(60, 46, 34) +
      beach(k, 66) +
      k.shade(ellipse(62, 86, 30, 7), k.rad(SAND_D, 0.5, 0.5, 0.5, 0.95, 0), SAND_D, 0.55) +
      `<path d="M60 22V90" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M60 22V90" stroke="${P.white}" stroke-width="1"/>` +
      `<path d="M58 90H62" stroke="${SAND_D}" stroke-width="1.4"/>` +
      tejo(k, 48, 84, 7.4) + tejo(k, 74, 88, 7.4) + tejin(k, 66, 80, 2.8) +
      k.draw([{
        d: canopy, fill: P.white,
        inner: `<path d="M42 45L48 22H60V44Z" fill="${P.sky}"/><path d="M78 45L72 22H100V50Z" fill="${P.sky}"/><path d="M14 30L36 22L24 50Z" fill="${P.sky}"/>` +
          k.sh(canopy, 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) + hair(42, 45, 46, 32, 52, 24, 0.5, P.ink) + hair(78, 45, 74, 32, 68, 24, 0.5, P.ink) + hair(60, 44, 60, 32, 60, 22, 0.5, P.ink) + hair(30, 40, 36, 30, 44, 25, 0.4, P.mid) + hair(90, 40, 84, 30, 76, 25, 0.4, P.mid),
      }], 0.7) +
      [24, 42, 60, 78, 96].map((x) => `<circle cx="${x}" cy="${x === 24 || x === 96 ? 44 : 45}" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `<path d="M60 22V12" stroke="${P.ink}" stroke-width="1"/>` +
      k.draw([{ d: flag, fill: P.red }], 0.35) +
      rotulo(84, 76, 5.4, 'reservado', { rot: -8, c: P.ink, bold: true }) +
      sparkle(90, 58, 1.6) + sparkle(30, 80, 1.4) +
      k.defs()
    )
  },

  // Cincuenta ganados: el cartel de la bajada 3 coronado, el tejo de oro en la arena y el sol de enero que baja.
  'Rey de Villa Gesell': (u) => {
    const k = kit(u)
    const post = 'M57.8 40H62.2L62.6 92H57.4Z'
    const sign = 'M40 34H76L82 42L76 50H40Z'
    const crown = 'M-8 0L-9 -9L-4.4 -5L0 -11L4.4 -5L9 -9L8 0Z'
    const scroll = (s: number) => `<path d="M${60 + s * 18} 92C${60 + s * 22} 88 ${60 + s * 28} 88 ${60 + s * 29} 91C${60 + s * 30} 94 ${60 + s * 26} 95 ${60 + s * 25} 93" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M${60 + s * 18} 92C${60 + s * 22} 88 ${60 + s * 28} 88 ${60 + s * 29} 91C${60 + s * 30} 94 ${60 + s * 26} 95 ${60 + s * 25} 93" fill="none" stroke="${P.gold}" stroke-width=".9" stroke-linecap="round"/>`
    return (
      k.day() +
      k.sun(60, 60, 14, 50, 32, true) +
      glow(k, 60, 56, 22, 14, 0.8) +
      beach(k, 66, { dune: true }) +
      k.floor(62, 92, 10, 1.6, SAND_D) +
      k.draw([{ d: post, fill: WOOD, inner: k.sh(post, 0, 0, 1, 0, 0, 0.8, WOOD_G, 0.45) + hair(59, 50, 59.6, 70, 59, 88, 0.4, WOOD_D) }], 0.6) +
      k.draw([{
        d: sign, fill: WOOD_L,
        inner: k.sh(sign, 0, 0, 1, 1, 0, 0.6, WOOD_D, 0.4) + `<path d="M40 42H82" stroke="${WOOD}" stroke-width=".5"/>` + hair(44, 38, 56, 37, 70, 38.4, 0.4, WOOD) + hair(44, 46.6, 58, 45.6, 74, 47, 0.4, WOOD),
      }], 0.6) +
      `<text x="58" y="45.4" font-family="Georgia, serif" font-weight="700" font-size="7" fill="${P.ink}" text-anchor="middle">bajada 3</text>` +
      `<circle cx="42.4" cy="36.4" r=".6" fill="${WOOD_G}"/><circle cx="42.4" cy="47.6" r=".6" fill="${WOOD_G}"/>` +
      `<g transform="translate(60 33.6) rotate(-6)">` + k.draw([{ d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="M-8 -1.8H8" stroke="${P.goldD}" stroke-width=".6"/><circle cx="0" cy="-4" r="1.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` }], 0.55) +
      [[-9, -9], [0, -11], [9, -9]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') + `</g>` +
      tejo(k, 42, 80, 9.4, true) + tejin(k, 78, 84, 3.2) +
      scroll(1) + scroll(-1) +
      rotulo(82, 74, 6, 'enero', { rot: -8, c: P.goldD, bold: true }) +
      sparkle(36, 64, 2, '#fff') + sparkle(86, 36, 1.8, '#fff') + sparkle(48, 76, 1.4, '#fff') +
      k.defs()
    )
  },
}
