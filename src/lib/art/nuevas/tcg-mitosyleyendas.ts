// Mitos y Leyendas, el TCG de este lado de la cordillera. Juego principal: pergamino, piedra de castillo y madera de
// asedio, con el marrón de la ficha. Nada de la marca: ni el logo, ni ilustraciones de cartas reales.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'

/** El color de la ficha (marrón de cuero y madera vieja) y sus tonos; la piedra de los muros. */
const MYL = '#7F4F24', MYLD = '#4A2C12', MYLL = '#B98A5A'
const STONE = '#DCD0B8', STONEL = '#EEE6D4', STONED = '#A8957A', MORTAR = '#8C7A60'

/** Pergamino: papel crema con el borde tostado y granulado. */
function parchment(k: Kit, gx = 0.5, gy = 0.46) {
  return `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade('M0 0H120V130H0Z', k.rad('#C9A57A', gx, gy, 0.72, 0, 0.75), '#CDAE86', 0.6)
}

/** Sillares: hiladas de piedras con juntas trabadas que llenan el rectángulo (recortalas con la forma del muro). */
function ashlar(k: Kit, x0: number, y0: number, x1: number, y1: number, h: number, seed = 1) {
  let s = `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" fill="${MORTAR}"/>`
  const tones = [STONE, '#D3C5AA', '#E3D9C4']
  for (let y = y0, r = 0; y < y1; y += h, r++) {
    let x = x0 - ((r * 7 + seed * 3) % 9)
    for (let c = 0; x < x1; c++) {
      const w = 10 + ((r * 5 + c * 7 + seed) % 4) * 2.4
      const d = roundRect(f(x + 0.4), f(y + 0.4), f(x + w - 0.4), f(y + h - 0.4), 0.9)
      s += `<path d="${d}" fill="${tones[(r + c + seed) % 3]}"/><path d="${d}" fill="${k.lin(STONED, 0, 0, 1, 1, 0, 0.9)}" opacity=".7"/>` +
        `<path d="M${f(x + 1)} ${f(y + 1)}H${f(x + w - 1.6)}" stroke="${STONEL}" stroke-width=".5" opacity=".9"/>` +
        ((r + c) % 3 === 0 ? hair(x + w * 0.3, y + h * 0.3, x + w * 0.45, y + h * 0.55, x + w * 0.4, y + h * 0.8, 0.35, MORTAR, 0.8) : '')
      x += w
    }
  }
  return s
}

/** Almenas: borde superior con merlones de x0 a x1, con la base de los merlones en y y su alto h. */
function crenels(x0: number, x1: number, y: number, n: number, h: number) {
  const w = (x1 - x0) / (n * 2 - 1)
  let d = `M${x0} ${y}`
  for (let i = 0; i < n * 2 - 1; i++) {
    const xa = x0 + i * w, xb = xa + w
    d += i % 2 ? `H${f(xb)}` : `V${f(y - h)}H${f(xb)}V${y}`
  }
  return d
}

/** Banderín triangular colgado de una cuerda, con la punta hacia abajo. */
const pennant = (k: Kit, x: number, y: number, r: number, fill: string, dark: string) => {
  const d = 'M-3.2 0H3.2L0 7.6Z'
  return `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d, fill, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, dark, 0.45) + `<path d="M-2 1.2H2" stroke="${P.goldL}" stroke-width=".4"/>` }], 0.4) + `</g>`
}

/** Excalibur: espada larga de cruz recta, pomo de rueda con piedra, puño encordado y hoja grabada. Punta en (0,46). */
function excalibur(k: Kit) {
  const blade = 'M-3.6 -9V36L0 46L3.6 36V-9Z'
  const bladeL = 'M-3.6 -9V36L0 46V-9Z'
  const guard = 'M-21 -12.4C-17 -13.4 -12 -13 -6 -12.4H6C12 -13 17 -13.4 21 -12.4C23.4 -11.8 24.4 -9.6 23 -8.4C21.6 -7.2 19.6 -8.4 18.6 -8.6C14 -9 9 -9 4 -8.6H-4C-9 -9 -14 -9 -18.6 -8.6C-19.6 -8.4 -21.6 -7.2 -23 -8.4C-24.4 -9.6 -23.4 -11.8 -21 -12.4Z'
  const boss = 'M-4.8 -14.4H4.8L5.6 -10.6L4.8 -6.6H-4.8L-5.6 -10.6Z'
  const grip = 'M-2.6 -14.4H2.6L2.2 -30.6H-2.2Z'
  const pommel = ellipse(0, -35.4, 5.4, 5.4)
  const wire = Array.from({ length: 7 }, (_, i) => `<path d="M-2.5 ${f(-15.8 - i * 2.2)}L2.5 ${f(-17.6 - i * 2.2)}" stroke="${P.ink}" stroke-width=".8"/><path d="M-2.5 ${f(-15.8 - i * 2.2)}L2.5 ${f(-17.6 - i * 2.2)}" stroke="${P.gold}" stroke-width=".4"/>`).join('')
  const runes = [6, 13, 20, 27].map((y) => `<path d="M-.9 ${y}l.9 -1.6l.9 1.6M-.9 ${y + 2.4}h1.8" fill="none" stroke="${P.goldD}" stroke-width=".35"/>`).join('')
  return (
    k.draw([
      { d: blade, fill: P.sky },
      { d: grip, fill: MYL, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.9, MYLD, 0.5) },
      { d: pommel, fill: P.gold, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<circle cx="0" cy="-35.4" r="3.8" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` },
      { d: guard, fill: P.gold, line: 0.3, inner: k.sh(guard, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-20 -11.2C-12 -11.8 12 -11.8 20 -11.2" fill="none" stroke="${P.goldL}" stroke-width=".8"/>` + hair(-18, -9.6, -12, -10.4, -6, -9.8, 0.4, P.goldD) + hair(18, -9.6, 12, -10.4, 6, -9.8, 0.4, P.goldD) },
    ], 0.8) +
    `<path d="${bladeL}" fill="${P.white}"/>` + k.clip(blade, k.sh('M0 -10H4V47H0Z', 0, 0, 1, 0, 0.2, 0.9, P.blue, 0.45)) +
    `<path d="M-.7 -8V30" stroke="${P.mid}" stroke-width="1.2" opacity=".5"/><path d="M-1.4 -8V30" stroke="#fff" stroke-width=".4"/>` + runes +
    `<path d="${blade}" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
    hair(-2.6, -6, -2.8, 14, -2.6, 34, 0.7, '#fff') +
    wire + `<path d="M-2.8 -14.8H2.8M-2.4 -30.2H2.4" stroke="${P.gold}" stroke-width="1.2"/>` +
    k.draw([{ d: boss, fill: P.gold, inner: k.sh(boss, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.4) +
    `<path d="${starPath(0, -10.6, 2.8, 1.1, 4)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` +
    `<circle cx="-23.4" cy="-10" r="1.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="23.4" cy="-10" r="1.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
    `<circle cx="0" cy="-35.4" r="2.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-.7" cy="-36.1" r=".7" fill="#fff"/>` +
    Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${f(Math.cos(a) * 4.6)}" cy="${f(-35.4 + Math.sin(a) * 4.6)}" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>` }).join('') +
    `<circle cx="0" cy="-41.6" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
  )
}

/** Rueda de madera con rayos y llanta de hierro. */
function wheel(k: Kit, x: number, y: number, r: number) {
  const ringD = `M${f(x - r)} ${y}A${r} ${r} 0 1 1 ${f(x + r)} ${y}A${r} ${r} 0 1 1 ${f(x - r)} ${y}ZM${f(x - r * 0.72)} ${y}A${f(r * 0.72)} ${f(r * 0.72)} 0 1 0 ${f(x + r * 0.72)} ${y}A${f(r * 0.72)} ${f(r * 0.72)} 0 1 0 ${f(x - r * 0.72)} ${y}Z`
  const spokes = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + 0.3; return `M${f(x + Math.cos(a) * r * 0.2)} ${f(y + Math.sin(a) * r * 0.2)}L${f(x + Math.cos(a) * r * 0.8)} ${f(y + Math.sin(a) * r * 0.8)}` }).join('')
  return (
    `<path d="${spokes}" stroke="${P.ink}" stroke-width="2.2"/><path d="${spokes}" stroke="${MYLL}" stroke-width="1"/>` +
    k.draw([{ d: ringD, fill: MYL, inner: k.sh(ringD, 0, 0, 1, 1, 0, 0.9, MYLD, 0.5) + `<circle cx="${x}" cy="${y}" r="${f(r * 0.93)}" fill="none" stroke="${P.mid}" stroke-width="${f(r * 0.14)}"/>` }], 0.55) +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.24)}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${x}" cy="${y}" r="${f(r * 0.09)}" fill="${P.sky}"/>`
  )
}

/** Piedra redonda de proyectil, con su volumen y grietas. */
function boulder(k: Kit, x: number, y: number, r: number) {
  const d = `M${f(x - r)} ${f(y + r * 0.1)}C${f(x - r)} ${f(y - r * 0.7)} ${f(x - r * 0.4)} ${f(y - r)} ${f(x + r * 0.1)} ${f(y - r)}C${f(x + r * 0.7)} ${f(y - r)} ${f(x + r)} ${f(y - r * 0.5)} ${f(x + r)} ${f(y + r * 0.05)}C${f(x + r)} ${f(y + r * 0.7)} ${f(x + r * 0.5)} ${f(y + r)} ${f(x - r * 0.1)} ${f(y + r)}C${f(x - r * 0.7)} ${f(y + r)} ${f(x - r)} ${f(y + r * 0.6)} ${f(x - r)} ${f(y + r * 0.1)}Z`
  return k.draw([{
    d, fill: STONE,
    inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, STONED, 0.55) + `<path d="M${f(x - r)} ${f(y - r)}H${f(x)}V${f(y)}H${f(x - r)}Z" fill="${k.lin('#fff', 0, 0, 1, 1, 0.5, 0)}"/>` +
      hair(x - r * 0.2, y - r * 0.3, x + r * 0.1, y + r * 0.1, x - r * 0.1, y + r * 0.6, 0.5, MORTAR) + hair(x + r * 0.3, y - r * 0.6, x + r * 0.5, y - r * 0.2, x + r * 0.7, y - r * 0.1, 0.4, MORTAR) +
      `<circle cx="${f(x + r * 0.4)}" cy="${f(y + r * 0.4)}" r="${f(r * 0.12)}" fill="${STONED}"/>`,
  }], 0.65)
}

export const TCG_MITOSYLEYENDAS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Señor del castillo ─────────────────────────────────────────────

  // Tres ganadas: las primeras hiladas de la muralla, con las almenas de un lado y la cuchara clavada en la mezcla.
  'Muralla de piedra': (u) => {
    const k = kit(u)
    const wall = 'M24 106V61H28.6V53H37.4V61H44.6V53H53.4V61H62V67.4H73V75.6H98V106Z'
    const topFace = 'M62 67.4H73L75.6 65.4H64.6ZM73 75.6H98L99 73.6H75.6Z'
    const mortar = 'M64 67.6C64 65.4 66.4 64.2 69 64.2C71.4 64.2 73.6 65.4 73.6 67.6Z'
    const blade = 'M0 0L-5.4 -9.4C-5.8 -12 -3.6 -14.4 0 -14.4C3.6 -14.4 5.8 -12 5.4 -9.4Z'
    const tang = 'M-.9 -14.2C-1.2 -17 -.4 -19 1.4 -20L3.8 -21.2L4.6 -19.6L2.6 -18.6C1.6 -18 1 -16.8 .9 -14.2Z'
    const handle = 'M3.4 -22C5.4 -23.6 8.4 -25.6 12.4 -28.4C13.6 -29.2 15 -28.8 15.4 -27.8C15.8 -26.8 15.2 -25.8 14.2 -25.2C10.2 -22.8 7.2 -21 5 -19.6Z'
    const block = 'M78 66H92V74H78Z'
    return (
      parchment(k) +
      k.sun(60, 54, 15, 46, 32, false) +
      k.floor(62, 102, 38, 4, MYL) +
      k.cast([wall], 2.2, 2, MYLD) +
      k.draw([{
        d: wall, fill: STONE,
        inner: ashlar(k, 20, 53, 100, 108, 8, 2) + k.sh(wall, 0, 0, 1, 0, 0, 0.32, MYLD, 0.3) + k.sh('M20 92H100V108H20Z', 0, 0, 0, 1, 0, 0.4, MYLD, 0.3),
      }], 0.8) +
      `<path d="${topFace}" fill="${STONEL}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
      `<path d="M28.6 53H37.4M44.6 53H53.4" stroke="${STONEL}" stroke-width="1"/>` +
      k.draw([{ d: mortar, fill: '#C9BDA8', inner: k.sh(mortar, 0, 0, 1, 1, 0, 0.8, MORTAR, 0.4) + hair(65.6, 66, 68, 64.8, 71, 65.4, 0.4, '#fff') }], 0.45) +
      // La próxima piedra, esperando arriba del escalón.
      `<g transform="translate(0 -.4)">` + k.draw([{ d: block, fill: STONE, inner: k.sh(block, 0, 0, 1, 1, 0, 0.8, STONED, 0.5) + `<path d="M79 67H91" stroke="${STONEL}" stroke-width=".6"/>` + hair(84, 67.6, 85.4, 70, 84.6, 73, 0.4, MORTAR) }], 0.6) + `<path d="M78 66L80.6 63.8H94.6L92 66ZM92 66L94.6 63.8V71.8L92 74Z" fill="${STONED}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/></g>` +
      // La cuchara de albañil, clavada en la mezcla.
      `<g transform="translate(68.4 66.2) rotate(-14)">` +
      k.draw([
        { d: handle, fill: MYL, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.9, MYLD, 0.5) + hair(6, -21.6, 9.4, -24, 13, -27, 0.4, MYLL) },
        { d: tang, fill: P.sky1, inner: k.sh(tang, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        { d: blade, fill: P.sky1, inner: k.sh(blade, 0, 0, 1, 0, 0.1, 0.9, P.blue, 0.5) + `<path d="M0 -1V-13.6" stroke="${P.blue}" stroke-width=".4"/>` + hair(-3.6, -10, -2.4, -12.6, 0, -13.4, 0.6, '#fff') },
      ], 0.6) +
      `<path d="M4.2 -21.4L5.4 -19.4" stroke="${P.gold}" stroke-width="1.2"/>` +
      `</g>` +
      sparkle(36, 34, 2.4, '#fff') + sparkle(88, 46, 1.8, '#fff') +
      k.defs()
    )
  },

  // Quince: la torre del homenaje sobre las nubes, con el estandarte al viento; desde arriba se ve todo el reino.
  'Torre del homenaje': (u) => {
    const k = kit(u)
    const front = 'M46.4 104V42H68.4V104Z'
    const side = 'M68.4 104V42L75.6 39V104Z'
    const parapet = crenels(44.6, 70.2, 38.6, 5, 4.6) + 'V43.4H44.6Z'
    const parSide = 'M70.2 38.6L77.6 35.4V40.4L70.2 43.4Z M70.2 38.6V34L72.2 33.2V37.8Z M75.6 36.2V31.6L77.6 30.8V35.4Z'
    const pole = 'M57.6 34.4V19.6'
    const flag = 'M57.8 20.2C61 19 64 21.4 67.4 20.4C68.4 22 68.6 24.2 70.6 25.4C67 26.6 64.4 24.6 61 25.8C60 26.2 58.8 26.4 57.8 26.2Z'
    const cloud = (x: number, y: number, s: number, flip = 1) => {
      const d = 'M-16 4C-18 4 -19.4 2.4 -18.6 .6C-17.8 -1 -16 -1.2 -14.8 -.6C-14.4 -3.6 -11.4 -5.4 -8.6 -4.4C-7.4 -7.6 -3 -9 .2 -7C2.6 -9.4 7.4 -8.8 8.6 -5.2C11.4 -6 14.6 -4 14.2 -1C16.8 -1 18.4 1 17.6 2.8C17.2 3.6 16.4 4 15.4 4Z'
      return `<g transform="translate(${x} ${y}) scale(${f(s * flip)} ${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0.1, 0.8, P.sky2, 0.5) + hair(-12, 1.4, -2, 2.4, 10, 1.6, 0.5, P.sky2) }], f(0.6 / s)) + `</g>`
    }
    const slit = (x: number, y: number) => `<path d="M${x} ${y}h1.2v4.4h-1.2Z" fill="${MYLD}" stroke="${P.ink}" stroke-width=".3"/>`
    return (
      parchment(k, 0.5, 0.36) +
      k.sun(60, 40, 13, 46, 32, false) +
      // Valle a lo lejos, entre las nubes.
      `<path d="M14 92C26 86 36 88 46 84M74 84C84 87 92 84 106 90" fill="none" stroke="${P.greenD}" stroke-width=".6" opacity=".7"/>` +
      `<path d="M14 98C26 90 40 92 50 88V104H14ZM70 88C82 91 94 88 106 94V104H70Z" fill="${P.green}" opacity=".55"/>` +
      k.draw([
        { d: side, fill: STONED, inner: k.clip(side, ashlar(k, 68, 39, 76, 106, 6.4, 3)) + `<path d="${side}" fill="${k.lin(MYLD, 0, 0, 1, 0, 0.3, 0.6)}"/>` },
        {
          d: front, fill: STONE,
          inner: ashlar(k, 44, 42, 70, 106, 6.4, 1) + k.sh(front, 0, 0, 1, 0, 0, 0.32, MYLD, 0.3) + `<path d="M44 42H52V106H44Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.35, 0)}"/>` +
            `<path d="M54 58V52A3.4 3.4 0 0 1 60.8 52V58Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><path d="M57.4 48.6V58M54 54H60.8" stroke="${MYLD}" stroke-width=".45"/>` +
            slit(51, 70) + slit(62.4, 70) + slit(56.8, 84),
        },
      ], 0.75) +
      k.draw([
        { d: parSide, fill: STONED, inner: `<path d="${parSide}" fill="${k.lin(MYLD, 0, 0, 1, 0, 0.3, 0.6)}"/>` },
        { d: parapet, fill: STONE, inner: ashlar(k, 42, 33, 72, 44, 3.6, 4) + k.sh(parapet, 0, 0, 1, 0, 0, 0.5, MYLD, 0.3) },
      ], 0.65) +
      `<path d="M45.4 44.2H69.6M45.4 45.4H69.6" stroke="${MYLD}" stroke-width=".45"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${f(47 + i * 3.4)} 43.6V46.6" stroke="${MYLD}" stroke-width=".7"/>`).join('') +
      `<path d="${pole}" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="${pole}" stroke="${MYLL}" stroke-width=".6"/><circle cx="57.6" cy="19.2" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: flag, fill: MYL, inner: k.sh(flag, 0, 0, 1, 1, 0, 0.8, MYLD, 0.5) + `<path d="M58 22.6C61 21.6 64 23.6 68 22.8" fill="none" stroke="${P.gold}" stroke-width=".9"/>` }], 0.45) +
      cloud(34, 86, 0.95) + cloud(88, 82, 0.9, -1) + cloud(62, 96, 1.1) +
      `<path d="M30 56q1.4 -1.2 2.6 0q1.2 -1.2 2.6 0M84 50q1.2 -1 2.2 0q1 -1 2.2 0" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
      sparkle(84, 32, 2, '#fff') + sparkle(32, 40, 1.6, '#fff') +
      k.defs()
    )
  },

  // Cuarenta: en Camelot, Excalibur en la pared sobre la mesa redonda, bajo una guirnalda de banderines.
  'Castillo de Camelot': (u) => {
    const k = kit(u)
    const table = ellipse(60, 95, 38, 9)
    const tableEdge = 'M22 95C22 100 39 104.6 60 104.6C81 104.6 98 100 98 95V99C98 104 81 108.6 60 108.6C39 108.6 22 104 22 99Z'
    const seats = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${f(60 + Math.cos(a) * 12)} ${f(95 + Math.sin(a) * 2.8)}L${f(60 + Math.cos(a) * 34)} ${f(95 + Math.sin(a) * 8)}` }).join('')
    const bracket = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${P.mid}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(x - 0.4)}" cy="${f(y - 0.4)}" r=".45" fill="${P.sky}"/>`
    const garland = (x0: number, y0: number, x1: number, y1: number, sag: number) => {
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag
      const cols: [string, string][] = [[P.red, P.wine], [P.gold, P.goldD], [MYL, MYLD], [P.sky, P.blue]]
      const pts = [0.06, 0.15, 0.24, 0.33, 0.67, 0.76, 0.85, 0.94].map((t, i) => {
        const a = 1 - t, x = a * a * x0 + 2 * a * t * mx + t * t * x1, y = a * a * y0 + 2 * a * t * my + t * t * y1
        const dy = 2 * a * (my - y0) + 2 * t * (y1 - my), dx = 2 * a * (mx - x0) + 2 * t * (x1 - mx)
        return pennant(k, f(x), f(y), f((Math.atan2(dy, dx) * 180) / Math.PI), cols[i % 4][0], cols[i % 4][1])
      })
      return `<path d="M${x0} ${y0}Q${mx} ${my} ${x1} ${y1}" fill="none" stroke="${P.ink}" stroke-width=".8"/><path d="M${x0} ${y0}Q${mx} ${my} ${x1} ${y1}" fill="none" stroke="${MYLL}" stroke-width=".35"/>` + pts.join('')
    }
    return (
      `<rect width="120" height="130" fill="${STONE}"/>` + ashlar(k, 0, 10, 120, 130, 9, 5) + `<rect width="120" height="130" fill="${P.paper}" opacity=".5"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(MYL, 0.5, 0.42, 0.66, 0, 0.6), MYL, 0.6) +
      k.sun(60, 52, 12, 50, 36, false) +
      k.shade(ellipse(60, 52, 22, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.55) +
      garland(23, 37, 97, 37, 14) +
      `<g transform="translate(60 50.6) scale(.74)">` + k.cast(['M-3.6 -9V36L0 46L3.6 36V-9Z'], 2.6, 2.4, MYLD) + excalibur(k) + `</g>` +
      `<path d="M54.6 49.4C55 52 56 53 57.4 53.2M65.4 49.4C65 52 64 53 62.6 53.2M54.6 68.4C55 71 56 72 57.4 72.2M65.4 68.4C65 71 64 72 62.6 72.2" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<path d="M54.6 49.4C55 52 56 53 57.4 53.2M65.4 49.4C65 52 64 53 62.6 53.2M54.6 68.4C55 71 56 72 57.4 72.2M65.4 68.4C65 71 64 72 62.6 72.2" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-linecap="round"/>` +
      bracket(54.6, 49) + bracket(65.4, 49) + bracket(54.6, 68) + bracket(65.4, 68) +
      k.draw([
        { d: tableEdge, fill: MYLD, inner: k.sh(tableEdge, 0, 0, 1, 0, 0, 0.7, '#2A180A', 0.4) },
        {
          d: table, fill: MYL,
          inner: k.sh(table, 0, 0, 1, 1, 0, 0.9, MYLD, 0.5) + `<path d="${seats}" stroke="${MYLD}" stroke-width=".55"/>` +
            `<path d="${ellipse(60, 95, 34, 8)}" fill="none" stroke="${P.gold}" stroke-width=".8"/><path d="${ellipse(60, 95, 12, 2.8)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".5"/>` +
            `<path d="${starPath(60, 95, 6, 2.2, 8)}" fill="${P.goldL}" transform="translate(0 95) scale(1 .24) translate(0 -95)"/>` + hair(30, 92, 44, 88.6, 60, 88, 0.7, MYLL, 0.9),
        },
      ], 0.75) +
      sparkle(60, 21, 2.6, '#fff') + sparkle(38, 62, 1.8, '#fff') + sparkle(84, 66, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Asedio ─────────────────────────────────────────────────────────

  // Tres golpes grandes: tocaste la puerta con un tronco. El ariete colgado de sus sogas pega en el portón.
  'Ariete': (u) => {
    const k = kit(u)
    const arch = 'M63 106V49A14.6 14.6 0 0 1 92.2 49V106Z'
    const door = 'M66.4 106V50A11.2 11.2 0 0 1 88.8 50V106Z'
    const log = 'M14 60.6C24 59.4 46 59 62.6 59.6C64.6 59.6 66 61.6 66 64.2C66 66.8 64.6 68.8 62.6 68.8C46 69.4 24 69 14 67.8Z'
    const cap = 'M58.4 58.6C62 58.2 66.6 58.6 69.4 60.6C71 61.8 71 66.6 69.4 67.8C66.6 69.8 62 70.2 58.4 69.8Z'
    const horn = 'M61 59.4C59.6 55.6 61.6 52.6 64.8 53C67.4 53.4 68 56.2 66 57.4C64.8 58 63.6 57.2 64 56.2'
    const studs = Array.from({ length: 12 }, (_, i) => `<circle cx="${f(70 + (i % 3) * 7.6)}" cy="${f(60 + Math.floor(i / 3) * 11)}" r=".8" fill="${P.mid}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    const rope = (x: number) => `<path d="M${x} 14L${x + 1} 60.4" stroke="${P.ink}" stroke-width="2"/><path d="M${x} 14L${x + 1} 60.4" stroke="${MYLL}" stroke-width=".9" stroke-dasharray="1.2 .6"/>` +
      `<path d="M${x - 1.4} 59.4C${x - 1.6} 63 ${x - 1} 67 ${x + 0.6} 69.4M${x + 2.6} 59.4C${x + 2.8} 63 ${x + 2.6} 67 ${x + 1.4} 69.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M${x - 1.4} 59.4C${x - 1.6} 63 ${x - 1} 67 ${x + 0.6} 69.4M${x + 2.6} 59.4C${x + 2.8} 63 ${x + 2.6} 67 ${x + 1.4} 69.4" fill="none" stroke="${MYLL}" stroke-width=".7"/>`
    const burst = 'M70.4 64.2L74.6 58L74.4 62L79 59.4L76.4 63.6L81 64.6L76.4 66L79.4 70.4L74.6 67.6L74.4 71.4Z'
    return (
      parchment(k, 0.5, 0.5) +
      k.sun(66, 64, 10, 42, 28, false) +
      // Portón en su arco de piedra, con bandas de hierro y tachas.
      k.draw([{ d: arch, fill: STONE, inner: ashlar(k, 60, 30, 96, 108, 7, 2) + k.sh(arch, 0, 0, 1, 0, 0, 0.7, MYLD, 0.4) }], 0.75) +
      k.draw([{
        d: door, fill: MYL,
        inner: k.sh(door, 0, 0, 1, 0, 0, 0.9, MYLD, 0.5) + `<path d="M72 41V106M77.6 38.8V106M83.2 41V106" stroke="${MYLD}" stroke-width=".6"/>` +
          `<path d="M65 55H90V57.6H65ZM65 77H90V79.6H65ZM65 95H90V97.6H65Z" fill="${P.mid}"/>` + studs + hair(69, 46, 68.6, 70, 69, 100, 0.6, MYLL, 0.8),
      }], 0.6) +
      `<path d="M77.6 38.8V48" stroke="${P.ink}" stroke-width=".5"/>` +
      // Astillas y el golpe.
      `<g transform="translate(-5.4 0)">` +
      `<path d="${burst}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<path d="M73.6 52L76 48.6M80 56L84 53.4M80 72L84.4 74.6M74 76L75.4 80" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M79.8 56.4L82.8 54.6L81.6 57.4ZM81 71.4L84 73.6L80.6 73.8Z" fill="${MYLL}" stroke="${P.ink}" stroke-width=".35"/>` +
      // Estela del envión.
      hair(16, 56, 20, 55.4, 26, 55.6, 0.8, P.mid) + hair(18, 72, 24, 72.8, 30, 72.6, 0.8, P.mid) + hair(30, 53.4, 36, 53, 42, 53.2, 0.6, P.mid, 0.8) +
      rope(30) + rope(52) +
      k.cast([log], 1.8, 2.4, MYLD) +
      k.draw([
        {
          d: log, fill: MYL,
          inner: k.sh(log, 0, 0, 0, 1, 0, 0.9, MYLD, 0.5) + `<path d="M10 59H60V62.6C40 62 24 62.4 10 63Z" fill="${k.lin(MYLL, 0, 0, 0, 1, 0.8, 0)}"/>` +
            hair(18, 63.8, 34, 64.6, 50, 63.6, 0.5, MYLD) + hair(22, 66.6, 40, 67.4, 56, 66.4, 0.45, MYLD) + `<ellipse cx="40" cy="62.2" rx="1.6" ry=".9" fill="none" stroke="${MYLD}" stroke-width=".45"/>`,
        },
        {
          d: cap, fill: P.mid,
          inner: k.sh(cap, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) + `<path d="M58 62H70V63H58Z" fill="${P.sky}" opacity=".7"/><path d="M61.4 58.4V70M58.6 58.6V69.8" stroke="${P.night}" stroke-width=".5"/>` +
            [[60, 60], [60, 68], [63.6, 59.6], [63.6, 68.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.sky}"/>`).join(''),
        },
      ], 0.7) +
      `<path d="${horn}" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="${horn}" fill="none" stroke="${P.sky}" stroke-width="1.3" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(40, 36, 2, '#fff') + sparkle(36, 86, 1.6, '#fff') +
      k.defs()
    )
  },

  // Doce golpes: la catapulta suelta el brazo y la piedra pasa por arriba de la muralla.
  'Catapulta': (u) => {
    const k = kit(u)
    const wall = crenels(72, 100, 76, 4, 5.6) + 'V108H72Z'
    const base = 'M20 83.4H66V88.4H20Z'
    const post = 'M46.6 88V58H52.4V88Z'
    const brace = 'M26 86.4L47.4 61.4L50.4 63.6L31.4 87.6Z'
    const brace2 = 'M64 86.4L51.6 66L49.4 68L59 87.6Z'
    const cross = 'M39.4 56H59.6V60.6H39.4Z'
    const arm = 'M49.6 80.4L33.6 43L37.6 41.4L53.4 78.8Z'
    const cup = 'M28.6 38C28 42.6 31 46.4 35.4 46.4C40 46.4 42.4 43 42.2 38.6Z'
    const trail = 'M38 32C46 19 60 17 71 30'
    return (
      parchment(k, 0.5, 0.42) +
      k.sun(76, 38, 10, 40, 28, false) +
      `<path d="${trail}" fill="none" stroke="${MYL}" stroke-width=".9" stroke-dasharray="1.6 1.6" stroke-linecap="round"/>` +
      hair(63, 24, 68, 25, 71.6, 30, 1, P.goldD) + hair(62, 29.4, 66.6, 30.4, 70, 34.6, 0.7, P.goldD, 0.8) +
      k.cast([wall], 2, 2, MYLD) +
      k.draw([{ d: wall, fill: STONE, inner: ashlar(k, 68, 64, 102, 108, 7, 6) + k.sh(wall, 0, 0, 1, 0, 0, 0.6, MYLD, 0.35) }], 0.75) +
      `<g transform="translate(47 92) scale(1.05) translate(-44 -92)">` +
      k.floor(44, 96, 28, 3.4, MYL) +
      k.draw([
        { d: brace, fill: MYL, inner: k.sh(brace, 0, 0, 1, 1, 0, 0.8, MYLD, 0.4) },
        { d: brace2, fill: MYL, inner: k.sh(brace2, 0, 0, 1, 1, 0, 0.9, MYLD, 0.5) },
        { d: post, fill: MYL, inner: k.sh(post, 0, 0, 1, 0, 0, 0.9, MYLD, 0.5) + hair(48, 62, 47.8, 74, 48.2, 86, 0.5, MYLL) },
        { d: base, fill: MYL, inner: k.sh(base, 0, 0, 0, 1, 0, 0.9, MYLD, 0.5) + hair(22, 84.8, 44, 84.4, 64, 84.8, 0.5, MYLL, 0.9) + [24, 40, 56].map((x) => `<circle cx="${x}" cy="86" r=".6" fill="${P.mid}"/>`).join('') },
        { d: arm, fill: MYLL, inner: k.sh(arm, 0, 0, 1, 0, 0, 0.9, MYL, 0.5) + hair(50.6, 78, 42.6, 61, 36, 44.6, 0.55, MYLD) + `<path d="M43.8 63.4L47.4 61.8M40.8 56.4L44.4 54.8" stroke="${P.mid}" stroke-width="1.2"/>` },
        { d: cross, fill: MYL, inner: k.sh(cross, 0, 0, 0, 1, 0, 0.9, MYLD, 0.5) + `<path d="M39.4 58.2H59.6" stroke="${MYLD}" stroke-width=".4"/>` + hair(41, 57, 50, 56.6, 58, 57, 0.4, MYLL) },
        { d: cup, fill: MYL, inner: k.sh(cup, 0, 0, 1, 1, 0, 0.9, MYLD, 0.5) + `<path d="M29.6 40.2C33.6 42 37.6 42 41.4 40.2" fill="none" stroke="${MYLD}" stroke-width=".45"/>` + `<path d="M28.4 38.4H42.4" stroke="${P.mid}" stroke-width=".8"/>` },
      ], 0.65) +
      `<circle cx="51.4" cy="79.6" r="1.7" fill="${P.mid}" stroke="${P.ink}" stroke-width=".45"/><circle cx="51" cy="79.2" r=".5" fill="${P.sky}"/>` +
      `<path d="M38 82.6C35.4 77 35 71 36.4 65" fill="none" stroke="${P.ink}" stroke-width="1.5"/><path d="M38 82.6C35.4 77 35 71 36.4 65" fill="none" stroke="${MYLL}" stroke-width=".65" stroke-dasharray="1 .5"/>` +
      `<circle cx="42" cy="58.3" r=".75" fill="${P.mid}"/><circle cx="57" cy="58.3" r=".75" fill="${P.mid}"/>` +
      wheel(k, 29, 89, 7.2) + wheel(k, 58, 89, 7.2) + `</g>` +
      boulder(k, 77, 37.6, 6.8) +
      sparkle(88, 50, 1.8, '#fff') + sparkle(30, 58, 1.4, '#fff') +
      k.defs()
    )
  },

  // Treinta y cinco golpes: ya es ingeniería. El trebuchet sobre el plano, con el compás y la traza del tiro.
  'Trebuchet': (u) => {
    const k = kit(u)
    const px = 57, py = 53
    const al = (-150 * Math.PI) / 180, L1 = 27, L2 = 11
    const tip = { x: px + Math.cos(al) * L1, y: py + Math.sin(al) * L1 }, butt = { x: px - Math.cos(al) * L2, y: py - Math.sin(al) * L2 }
    const armW = 1.7, nx = -Math.sin(al) * armW, ny = Math.cos(al) * armW
    const arm = `M${f(tip.x + nx * 0.6)} ${f(tip.y + ny * 0.6)}L${f(butt.x + nx)} ${f(butt.y + ny)}L${f(butt.x - nx)} ${f(butt.y - ny)}L${f(tip.x - nx * 0.6)} ${f(tip.y - ny * 0.6)}Z`
    const legL = 'M37 92L55.4 52L58.6 52.6L42.4 92Z', legR = 'M77 92L58.6 52.6L55.4 53.4L71.6 92Z'
    const base = 'M24 91H94V95.6H24Z'
    const brace = 'M43 78H71V81.2H43Z'
    const box = `M${f(butt.x - 6.6)} ${f(butt.y + 3)}H${f(butt.x + 6.6)}L${f(butt.x + 5.6)} ${f(butt.y + 14.6)}H${f(butt.x - 5.6)}Z`
    const hang = `M${f(butt.x - 4)} ${f(butt.y + 3.2)}L${f(butt.x)} ${f(butt.y + 0.2)}L${f(butt.x + 4)} ${f(butt.y + 3.2)}`
    const sling = `M${f(tip.x)} ${f(tip.y)}C${f(tip.x - 6)} ${f(tip.y + 4)} ${f(tip.x - 8)} ${f(tip.y + 10)} ${f(tip.x - 5.4)} ${f(tip.y + 14.6)}`
    const arc = Array.from({ length: 13 }, (_, i) => { const a = al - 0.2 + (i / 12) * 1.9; return `${f(px + Math.cos(a) * L1)} ${f(py + Math.sin(a) * L1)}` })
    const compassLegs = 'M0 0L-7.4 26.6L-6 27L-.8 6.6M0 0L7.4 26.6L6 27L.8 6.6'
    return (
      parchment(k, 0.5, 0.48) +
      k.sun(60, 50, 14, 48, 32, false) +
      // Traza del plano: el arco del brazo, la cota y la cuadrícula tenue.
      `<path d="${Array.from({ length: 9 }, (_, i) => `M${18 + i * 10.6} 20V100`).join('') + Array.from({ length: 8 }, (_, i) => `M18 ${24 + i * 10.6}H104`).join('')}" stroke="${MYLL}" stroke-width=".25" opacity=".6"/>` +
      `<path d="M${arc.join('L')}" fill="none" stroke="${MYL}" stroke-width=".7" stroke-dasharray="1.6 1.4"/>` +
      `<path d="M${px} ${py}L${f(tip.x)} ${f(tip.y)}" stroke="${MYL}" stroke-width=".4" stroke-dasharray=".8 .8" transform="rotate(64 ${px} ${py})"/>` +
      `<path d="M26 99.4H92M26 97.6V101.2M92 97.6V101.2" stroke="${MYLD}" stroke-width=".45"/>` +
      `<text x="59" y="98.6" font-family="Georgia, serif" font-style="italic" font-size="2.8" fill="${MYLD}" text-anchor="middle">fig. I</text>` +
      // La máquina.
      k.floor(58, 95, 36, 2.8, MYL) +
      k.draw([
        { d: legR, fill: MYL, inner: k.sh(legR, 0, 0, 1, 0, 0, 0.9, MYLD, 0.5) + hair(74, 90, 66, 72, 58, 55, 0.4, MYLD) },
        { d: legL, fill: MYLL, inner: k.sh(legL, 0, 0, 1, 0, 0, 0.8, MYL, 0.5) + hair(40.4, 88, 47, 70, 55, 55, 0.45, '#fff', 0.6) + hair(42, 90, 48.6, 72, 56.4, 56, 0.35, MYL) },
        { d: brace, fill: MYL, inner: k.sh(brace, 0, 0, 0, 1, 0, 0.9, MYLD, 0.5) },
        { d: base, fill: MYL, inner: k.sh(base, 0, 0, 0, 1, 0, 0.9, MYLD, 0.5) + hair(26, 92.4, 58, 92, 92, 92.4, 0.5, MYLL, 0.9) + [30, 46, 70, 86].map((x) => `<circle cx="${x}" cy="93.4" r=".7" fill="${P.mid}"/>`).join('') },
      ], 0.65) +
      [[44.6, 79.6], [69.4, 79.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.mid}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<path d="${hang}" fill="none" stroke="${P.ink}" stroke-width="1.2"/><path d="${hang}" fill="none" stroke="${P.sky}" stroke-width=".45"/>` +
      k.draw([
        {
          d: box, fill: MYL,
          inner: k.sh(box, 0, 0, 1, 1, 0, 0.9, MYLD, 0.5) + `<path d="M${f(butt.x - 7)} ${f(butt.y + 6.4)}H${f(butt.x + 7)}M${f(butt.x - 7)} ${f(butt.y + 11)}H${f(butt.x + 7)}" stroke="${P.mid}" stroke-width="1"/>` +
            `<path d="M${f(butt.x - 2.2)} ${f(butt.y + 3)}V${f(butt.y + 15)}M${f(butt.x + 2.2)} ${f(butt.y + 3)}V${f(butt.y + 15)}" stroke="${MYLD}" stroke-width=".45"/>` +
            [[-4.4, 6.4], [0, 6.4], [4.4, 6.4], [-4.2, 11], [0, 11], [4.2, 11]].map(([dx, dy]) => `<circle cx="${f(butt.x + dx)}" cy="${f(butt.y + dy)}" r=".45" fill="${P.sky}"/>`).join(''),
        },
        {
          d: arm, fill: MYLL,
          inner: k.sh(arm, 0, 0, 1, 1, 0, 0.9, MYL, 0.5) + hair(tip.x + 2, tip.y + 0.4, (tip.x + butt.x) / 2, (tip.y + butt.y) / 2 - 0.8, butt.x - 2, butt.y - 1.6, 0.45, MYLD) +
            [0.3, 0.55].map((t) => { const x = tip.x + (butt.x - tip.x) * t, y = tip.y + (butt.y - tip.y) * t; return `<path d="M${f(x + nx * 1.4)} ${f(y + ny * 1.4)}L${f(x - nx * 1.4)} ${f(y - ny * 1.4)}" stroke="${P.mid}" stroke-width="1.2"/>` }).join(''),
        },
      ], 0.65) +
      `<path d="${sling}" fill="none" stroke="${P.ink}" stroke-width="1.3"/><path d="${sling}" fill="none" stroke="${MYLL}" stroke-width=".5"/>` +
      boulder(k, f(tip.x - 5), f(tip.y + 17.4), 3.6) +
      `<circle cx="${px}" cy="${py}" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${px}" cy="${py}" r=".8" fill="${P.goldD}"/>` +
      `<g transform="translate(84 90)">` + [3.6, 2.6, 1.6].map((r) => `<ellipse cx="0" cy="0" rx="${r * 1.6}" ry="${r * 0.6}" fill="none" stroke="${P.ink}" stroke-width="1.3"/><ellipse cx="0" cy="0" rx="${r * 1.6}" ry="${r * 0.6}" fill="none" stroke="${MYLL}" stroke-width=".55"/>`).join('') + `</g>` +
      // El compás de dibujo, de bronce, abierto sobre el plano.
      `<g transform="translate(84.4 42) rotate(12) scale(1.12)">` +
      `<path d="${compassLegs}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
      `<path d="M-6.6 24.6L-7.6 29.6M6.6 24.6L7.6 29.6" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="M-6.6 24.6L-7.6 29.6M6.6 24.6L7.6 29.6" stroke="${P.sky1}" stroke-width=".5" stroke-linecap="round"/>` +
      `<path d="M-4.6 16.4Q0 18.6 4.6 16.4" fill="none" stroke="${P.goldD}" stroke-width=".7"/>` +
      `<circle cx="0" cy="0" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="0" cy="0" r="1" fill="${P.goldD}"/><path d="M0 -2.6V-6" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M0 -2.6V-6" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      hair(-1.8, 5, -4, 14, -6, 22, 0.4, P.goldL) +
      `</g>` +
      sparkle(32, 38, 1.8, '#fff') + sparkle(92, 82, 1.6, '#fff') +
      k.defs()
    )
  },
}
