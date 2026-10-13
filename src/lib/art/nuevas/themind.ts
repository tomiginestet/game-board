// The Mind: Conexión mental y Uno solo, en clave heroica.
// Manda el violeta de la ficha del juego (#7048E8): la noche violeta del fondo, el almohadón de meditar, el cerebro y
// el lazo del sello. Las cartas son propias (del 1 al 100, sin el arte del juego). Nada de gurúes ni monjes dibujados:
// el gurú es el incienso clavado en el mazo y el nirvana, la flor de loto con su aura dorada.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** El violeta de la ficha (#7048E8), con su sombra y su luz. */
const VIO = '#7048E8', VIO_D = '#3A1F9A', VIO_L = '#B9A6F7'
/** La noche violeta del fondo. */
const NOCHE = '#22175A'
/** El rosado del cerebro y del loto. */
const ROSA = '#EBC4E4', ROSA_D = '#B97BB8'

/** Fondo de The Mind: la noche violeta con el resplandor en el medio y estrellitas sueltas. */
const noche = (k: Kit, cx = 0.5, cy = 0.44) =>
  `<rect width="120" height="130" fill="${NOCHE}"/>` + `<path d="${FULL}" fill="${k.rad(VIO_D, cx, cy, 0.7, 0.9, 0)}"/>` + k.shade(FULL, k.rad(VIO, cx, cy, 0.4, 0.75, 0), VIO, 0.5) +
  [[28, 34, 0.6], [92, 32, 0.7], [24, 62, 0.45], [96, 66, 0.5], [40, 24, 0.45], [80, 22, 0.5], [34, 86, 0.4], [88, 88, 0.45]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional. */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Carta numerada (propia, no la del juego), con la base en (0,0): papel, filete violeta, el número grande y los chicos. */
function carta(k: Kit, n: number, w = 14, h = 20, lw = 0.5, ny = 0.5) {
  const d = roundRect(-w / 2, -h, w / 2, 0, 1.4)
  const fs = n >= 100 ? w * 0.42 : w * 0.56
  return (
    k.draw([{ d, fill: P.white, inner: k.sh(`M${f(w * 0.1)} ${-h - 1}H${w}V1H${f(w * 0.1)}Z`, 0, 0, 1, 0, 0, 0.55, VIO_L, 0.35) }], lw) +
    `<path d="${roundRect(-w / 2 + 1.1, -h + 1.1, w / 2 - 1.1, -1.1, 0.8)}" fill="none" stroke="${VIO}" stroke-width="${f(w * 0.035)}"/>` +
    `<text x="0" y="${f(-h * ny + fs * 0.36)}" ${GEORGIA} font-weight="700" font-size="${f(fs)}" fill="${VIO_D}" text-anchor="middle">${n}</text>` +
    `<text x="${f(-w / 2 + 2.6)}" y="${f(-h + 3.6)}" ${GEORGIA} font-size="${f(w * 0.17)}" fill="${VIO}" text-anchor="middle">${n}</text>` +
    `<text x="${f(w / 2 - 2.6)}" y="${f(-1.8)}" ${GEORGIA} font-size="${f(w * 0.17)}" fill="${VIO}" text-anchor="middle" transform="rotate(180 ${f(w / 2 - 2.6)} ${f(-2.9)})">${n}</text>`
  )
}

/** Zafu: el almohadón redondo de meditar, plisado, con la base en (0,0) y la tapa (de radio 21) arriba en y=-12. */
function zafu(k: Kit, w = 0.7) {
  const side = 'M-22 -12C-23.4 -7 -23 -2.4 -21 0C-15 3.6 15 3.6 21 0C23 -2.4 23.4 -7 22 -12Z'
  const top = ellipse(0, -12, 22, 6.4)
  const pleats = Array.from({ length: 15 }, (_, i) => {
    const t = -1 + (i + 0.5) * (2 / 15), x = t * 21.6, sq = Math.sqrt(1 - t * t), y0 = -12 + 6.4 * sq, y1 = 1.6 * sq
    return hair(x, y0, x * 1.06 + (i % 2 ? 0.6 : -0.6), (y0 + y1) / 2, x * 0.98, y1, 0.55, VIO_D, 0.85)
  }).join('')
  const button = ellipse(0, -12, 2.6, 1)
  return (
    k.draw([
      { d: side, fill: VIO, inner: k.sh(side, 0, 0, 1, 0, 0, 0.9, VIO_D, 0.5) + `<path d="M-24 -14H-10V4H-24Z" fill="${k.lin(VIO_L, 0, 0, 1, 0, 0.55, 0)}"/>` + pleats },
      {
        d: top, fill: VIO_L,
        inner: k.sh(top, 0, 0, 1, 1, 0, 0.8, VIO, 0.45) +
          Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return hair(Math.cos(a) * 3, -12 + Math.sin(a) * 0.9, Math.cos(a + 0.2) * 10, -12 + Math.sin(a + 0.2) * 3.4, Math.cos(a) * 19, -12 + Math.sin(a) * 5.6, 0.45, VIO, 0.7) }).join('') +
          `<path d="${ellipse(0, -12, 20.4, 5.6)}" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray="1 .8"/>`,
      },
    ], w) +
    k.draw([{ d: button, fill: P.gold, inner: k.sh(button, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.4)
  )
}

/** Pétalo en punta, con la base en (0,0) y la punta hacia arriba. */
const PETALO = (w: number, h: number) => `M0 0C${f(-w)} ${f(-h * 0.22)} ${f(-w * 0.86)} ${f(-h * 0.72)} 0 ${f(-h)}C${f(w * 0.86)} ${f(-h * 0.72)} ${w} ${f(-h * 0.22)} 0 0Z`

export const THEMIND_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Conexión mental ────────────────────────────────────────────────

  // Nivel cinco: el almohadón de meditar, con las cinco cartas de la mano abiertas detrás como una aureola, y la
  // respiración honda que se abre en anillos.
  'Meditación': (u) => {
    const k = kit(u)
    const nums = [12, 27, 45, 63, 88]
    const mat = 'M24 86C24 82 40 79.6 60 79.6C80 79.6 96 82 96 86C96 90 80 92.6 60 92.6C40 92.6 24 90 24 86Z'
    return (
      noche(k) +
      [16, 22, 28].map((r, i) => `<path d="${ellipse(60, 52, r * 1.15, r)}" fill="none" stroke="${VIO_L}" stroke-width="${0.9 - i * 0.2}" opacity="${f(0.75 - i * 0.2)}"/>`).join('') +
      k.shade(ellipse(60, 54, 26, 24), k.rad(VIO_L, 0.5, 0.5, 0.5, 0.75, 0), VIO_L, 0.4) +
      nums.map((n, i) => `<g transform="translate(60 80) rotate(${-48 + i * 24}) translate(0 -13)">` + k.cast([roundRect(-7, -20, 7, 0, 1.4)], 1.2, 1.2, NOCHE) + carta(k, n, 14, 20, 0.5, 0.7) + `</g>`).join('') +
      k.draw([{ d: mat, fill: VIO_D, inner: k.sh(mat, 0, 0, 0, 1, 0, 0.8, NOCHE, 0.45) + `<path d="${ellipse(60, 86, 33.6, 5.4)}" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-dasharray="1.4 1"/>` }], 0.6) +
      k.floor(60, 85, 24, 3, NOCHE) +
      `<g transform="translate(60 84)">${zafu(k)}</g>` +
      sparkle(88, 40, 2.2, P.goldL) + sparkle(32, 46, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Nivel ocho: la silla de bar, vacía, y el almohadón flotando un palmo arriba del asiento. No hace falta hablar.
  'Levitando': (u) => {
    const k = kit(u)
    const wood = P.brown, woodD = P.brownD
    const loopO = 'M50.6 72C49.4 60 48.6 48 50 40C51.4 33 56 30 61 30C66 30 70.6 33 72 40C73.4 48 72.6 60 71.4 72'
    const loopI = 'M53.6 70C52.8 60 52.4 50 53.6 43.6C54.6 38.6 57.4 36.6 61 36.6C64.6 36.6 67.4 38.6 68.4 43.6C69.6 50 69.2 60 68.4 70'
    const seat = ellipse(60, 73, 16, 5)
    const seatRim = 'M44 73C44 76.6 52 79 60 79C68 79 76 76.6 76 73V75.4C76 79 68 81.4 60 81.4C52 81.4 44 79 44 75.4Z'
    const leg = (d: string) => rod(d, wood, 1.8, '#FFE3C2')
    return (
      noche(k) +
      k.shade(ellipse(60, 54, 28, 30), k.rad(VIO_L, 0.5, 0.5, 0.5, 0.6, 0), VIO_L, 0.35) +
      k.floor(60, 96, 22, 2.6, NOCHE) +
      // La silla de bar de madera curvada: el respaldo en lazo, el asiento redondo y el aro entre las patas.
      leg('M53 76L52.6 95') + leg('M70 76L71.6 95') +
      `<path d="${ellipse(60, 89, 11.6, 3)}" fill="none" stroke="${P.ink}" stroke-width="2.6"/><path d="${ellipse(60, 89, 11.6, 3)}" fill="none" stroke="${wood}" stroke-width="1.3"/>` +
      rod(loopO, wood, 2.2, '#FFE3C2') + rod(loopI, wood, 1.6, '#FFE3C2') +
      k.draw([
        { d: seatRim, fill: woodD, inner: k.sh(seatRim, 0, 0, 1, 0, 0, 0.8, '#3B2416', 0.4) },
        { d: seat, fill: wood, inner: k.sh(seat, 0, 0, 1, 1, 0, 0.8, woodD, 0.45) + `<path d="${ellipse(60, 73, 13, 3.6)}" fill="none" stroke="${woodD}" stroke-width=".4"/>` + Array.from({ length: 9 }, (_, i) => `<circle cx="${f(48 + i * 3)}" cy="${f(73 + Math.sin((i / 8) * Math.PI) * 2.6)}" r=".35" fill="${woodD}"/>`).join('') },
      ], 0.6) +
      leg('M46 75L41.6 96') + leg('M74 75L78.4 96') +
      // La sombra del almohadón sobre el asiento y la luz que lo sostiene.
      `<path d="${ellipse(60, 73.4, 11, 3)}" fill="${NOCHE}" opacity=".35"/>` +
      k.shade(ellipse(60, 64, 20, 9), k.rad(VIO_L, 0.5, 0.5, 0.5, 0.8, 0), VIO_L, 0.45) +
      [[46, 66, 46.6, 61, 45.6, 56], [74, 66, 73.4, 61, 74.4, 56], [52, 67, 51, 63, 52.4, 59], [68, 67, 69, 63, 67.6, 59]].map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.6, VIO_L)).join('') +
      `<g transform="translate(60 56) scale(.78)">${zafu(k, 0.9)}</g>` +
      sparkle(86, 36, 2.2, P.goldL) + sparkle(32, 44, 1.6, P.goldL) + sparkle(88, 70, 1.2, P.goldL) +
      k.defs()
    )
  },

  // Nivel doce: la telepatía, certificada por escribano. El sello de lacre dorado con el cien, las cintas violetas y
  // el certificado firmado detrás.
  'Mente maestra': (u) => {
    const k = kit(u)
    const cx = 62, cy = 62, R = 17
    const paper = 'M32 37H80V72C70 75 58 71 48 73.4C42 74.6 37 74 32 72Z'
    const curl = 'M32 37C32 34.4 34.4 33 37 33H84C81.4 33 80 34.6 80 37Z'
    const scal = starPath(cx, cy, R, R - 2.2, 28, -90)
    const ribbon = (sx: number) => {
      const d = `M${cx} ${cy}L${cx + sx * 4} ${cy + 26}L${cx + sx * 7.4} ${cy + 22.6}L${cx + sx * 11} ${cy + 25}L${cx + sx * 9} ${cy + 1}Z`
      return k.draw([{ d, fill: VIO, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, VIO_D, 0.45) + `<path d="M${cx + sx * 3} ${cy + 4}L${cx + sx * 6} ${cy + 22}" stroke="${VIO_L}" stroke-width=".6" opacity=".8"/>` }], 0.55)
    }
    const tp = k.id('mm'), bp = k.id('mm')
    const rays = Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2; return `<path d="M${f(cx + Math.cos(a) * 9.6)} ${f(cy + Math.sin(a) * 9.6)}L${f(cx + Math.cos(a) * 10.8)} ${f(cy + Math.sin(a) * 10.8)}" stroke="${P.goldD}" stroke-width=".3"/>` }).join('')
    const lines = Array.from({ length: 5 }, (_, i) => hair(37, 48 + i * 4.2, 50, 47 + i * 4.2 + (i % 2), 64 - (i % 3) * 4, 48 + i * 4.2, 0.5, P.mid, 0.8)).join('')
    return (
      noche(k) +
      k.sun(cx, cy, 20, 48, 32, false) +
      k.shade(ellipse(cx, cy, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(50, 101, 28, 94, 24, 66, 8) + laurel(70, 101, 92, 94, 96, 66, 8, true) +
      // El certificado: el papel con su rulo arriba, el título y los renglones.
      `<g transform="rotate(-8 56 54)">` +
      k.cast([paper], 2, 2, NOCHE) +
      k.draw([
        { d: paper, fill: P.paper, inner: k.sh(paper, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.35) + `<path d="${roundRect(34.4, 39.4, 77.6, 70.4, 0.6)}" fill="none" stroke="${VIO}" stroke-width=".5"/>` + lines },
        { d: curl, fill: P.white, inner: k.sh(curl, 0, 0, 0, 1, 0, 0.8, P.sky2, 0.45) },
      ], 0.6) +
      `<text x="53" y="45" ${GEORGIA} font-style="italic" font-size="4.6" fill="${VIO_D}" text-anchor="middle">Telepatía</text>` +
      `<path d="M38 68C40 64 43 68 45 65C47 62 49 68 52 64" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
      `</g>` +
      ribbon(-1) + ribbon(1) +
      k.cast([scal], 1.8, 1.8, NOCHE) +
      k.draw([{ d: scal, fill: P.gold, inner: k.sh(scal, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M${cx - R} ${cy - R}H${cx}V${cy + R}H${cx - R}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` }], 0.7) +
      `<circle cx="${cx}" cy="${cy}" r="${R - 3.4}" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
      Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * (R - 4.4))}" cy="${f(cy + Math.sin(a) * (R - 4.4))}" r=".35" fill="${P.goldL}"/>` }).join('') +
      `<path id="${tp}" d="M${cx - 11.6} ${cy}A11.6 11.6 0 0 1 ${cx + 11.6} ${cy}" fill="none"/><path id="${bp}" d="M${cx - 12.6} ${cy}A12.6 12.6 0 0 0 ${cx + 12.6} ${cy}" fill="none"/>` +
      `<text ${GEORGIA} font-weight="700" font-size="2.6" letter-spacing=".4" fill="${P.brownD}"><textPath href="#${tp}" startOffset="50%" text-anchor="middle">TELEPATÍA</textPath></text>` +
      `<text ${GEORGIA} font-style="italic" font-size="2.5" fill="${P.brownD}"><textPath href="#${bp}" startOffset="50%" text-anchor="middle">certificada</textPath></text>` +
      k.draw([{ d: ellipse(cx, cy, 9, 9), fill: P.gold, inner: k.sh(ellipse(cx, cy, 9, 9), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.45) + rays +
      `<text x="${cx + 0.4}" y="${cy + 2.7}" ${GEORGIA} font-weight="700" font-size="7.6" fill="${P.goldD}" text-anchor="middle">100</text>` +
      `<text x="${cx}" y="${cy + 2.3}" ${GEORGIA} font-weight="700" font-size="7.6" fill="${P.goldL}" text-anchor="middle">100</text>` +
      `<path d="M${cx - 12} ${cy - 6}C${cx - 10} ${cy - 10} ${cx - 6} ${cy - 13} ${cx - 2} ${cy - 13.6}" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".85"/>` +
      sparkle(cx, 22, 3, '#fff') + sparkle(90, 38, 2, P.goldL) + sparkle(30, 84, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Uno solo ───────────────────────────────────────────────────────

  // La primera ganada en equipo: un solo cerebro, y de él salen los hilos dorados a las cartas de cada uno, que van
  // en fila: treinta y cuatro, treinta y cinco, treinta y seis.
  'Cerebro compartido': (u) => {
    const k = kit(u)
    const brain = 'M38.6 58C37 48 43 39.6 52 37.4C57 33.6 66 33.2 72 37C79.4 39 84 46 83 53.6C85 59.6 81.6 65.6 75.6 67C72.6 70.6 66.4 71.6 62 69.4C56 71.4 47 70.6 42.6 66.6C40 64.6 38.8 61.6 38.6 58Z'
    const cereb = 'M63.4 67.6C65.6 72.4 72 74.4 76.6 72C80 70 80.8 66.2 79 64.2C75.6 66.8 69.6 68.4 63.4 67.6Z'
    const stem = 'M61.6 68.6C61.6 71.6 60.8 74.4 59.6 77L64 78C64.4 75 65 72 66.2 69.6Z'
    // Las circunvoluciones: meandros cortos sembrados por todo el cerebro, con su sombra al lado.
    let seed = 23
    const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
    const gyri = Array.from({ length: 34 }, (_, i) => {
      const col = i % 7, row = Math.floor(i / 7), x = 42 + col * 6.2 + (row % 2) * 3 + (r() - 0.5) * 2, y = 40 + row * 6.4 + (r() - 0.5) * 2, a = r() * Math.PI
      const dx = Math.cos(a) * 3, dy = Math.sin(a) * 3, nx = -dy * 0.7, ny = dx * 0.7
      const d = `M${f(x - dx)} ${f(y - dy)}C${f(x - dx * 0.4 + nx)} ${f(y - dy * 0.4 + ny)} ${f(x + dx * 0.4 - nx)} ${f(y + dy * 0.4 - ny)} ${f(x + dx)} ${f(y + dy)}`
      return `<path d="${d}" fill="none" stroke="${ROSA_D}" stroke-width="1.5" stroke-linecap="round" opacity=".55" transform="translate(.5 .7)"/><path d="${d}" fill="none" stroke="${VIO_D}" stroke-width=".65" stroke-linecap="round"/>`
    }).join('')
    const thread = (x: number, y: number, qx: number, qy: number) =>
      `<path d="M60 53Q${qx} ${qy} ${x} ${y}" fill="none" stroke="${P.goldD}" stroke-width="1.8" opacity=".55"/><path d="M60 53Q${qx} ${qy} ${x} ${y}" fill="none" stroke="${P.goldL}" stroke-width=".7"/>`
    const c = (x: number, y: number, rot: number, n: number) => `<g transform="translate(${x} ${y}) rotate(${rot})">${k.cast([roundRect(-5.5, -15.6, 5.5, 0, 1.4)], 1, 1, NOCHE)}${carta(k, n, 11, 15.6)}</g>`
    return (
      noche(k) +
      k.shade(ellipse(60, 54, 30, 26), k.rad(VIO_L, 0.5, 0.5, 0.5, 0.75, 0), VIO_L, 0.4) +
      thread(36, 44, 44, 44) + thread(84, 44, 76, 44) + thread(60, 82, 58, 70) +
      c(36, 56, -14, 34) + c(84, 56, 14, 36) + c(60, 97, 0, 35) +
      `<g transform="translate(60 54) scale(.78) translate(-60 -54)">` +
      k.cast([brain], 2, 2, NOCHE) +
      k.draw([
        { d: stem, fill: ROSA_D, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.8, VIO_D, 0.45) + hair(62, 70, 61.6, 73, 60.6, 76, 0.4, VIO_D) },
        { d: cereb, fill: ROSA, inner: k.sh(cereb, 0, 0, 0, 1, 0, 0.8, ROSA_D, 0.45) + [0, 1, 2, 3].map((i) => hair(65 + i, 69 + i * 1, 71, 69.8 + i * 1.1, 78.6 - i, 66.4 + i * 1.4, 0.45, VIO_D)).join('') },
        {
          d: brain, fill: ROSA,
          inner: k.sh(brain, 0, 0, 1, 1, 0, 0.8, ROSA_D, 0.5) + `<path d="M36 34H52V72H36Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` + gyri +
            // La cisura lateral y la central, más hondas que las demás.
            `<path d="M46 63C52 60 58 57 64 56C68 55.4 72 55.6 75 54" fill="none" stroke="${VIO_D}" stroke-width="1.4" stroke-linecap="round"/>` +
            `<path d="M64 35.6C62.4 40 63.6 44 62 48C61 51 62 53 63 55" fill="none" stroke="${VIO_D}" stroke-width="1.1" stroke-linecap="round"/>`,
        },
      ], 0.8) +
      `</g>` +
      `<circle cx="60" cy="53" r="2" fill="${P.goldL}" opacity=".9"/>` + sparkle(60, 53, 3.4, '#fff') +
      sparkle(88, 78, 1.8, P.goldL) + sparkle(32, 76, 1.4, P.goldL) + sparkle(60, 26, 2, P.goldL) +
      k.defs()
    )
  },

  // Tres ganadas: el gurú se resuelve con objetos. El sahumerio clavado en el mazo antes de repartir, con el humo que
  // se enrosca, y el rosario de cuentas alrededor.
  'Gurú': (u) => {
    const k = kit(u)
    // El mazo en perspectiva: la carta de arriba es un paralelogramo (A, B, C, D) y abajo asoman los cantos.
    const A = [39, 70], B = [55, 62.4], D = [63, 82], C = [B[0] + D[0] - A[0], B[1] + D[1] - A[1]], T = 7
    const pt = (p: number[], dy = 0) => `${f(p[0])} ${f(p[1] + dy)}`
    const top = `M${pt(A)}L${pt(B)}L${pt(C)}L${pt(D)}Z`
    const sideL = `M${pt(A)}L${pt(D)}L${pt(D, T)}L${pt(A, T)}Z`
    const sideR = `M${pt(D)}L${pt(C)}L${pt(C, T)}L${pt(D, T)}Z`
    const edges = (p: number[], q: number[]) => Array.from({ length: 5 }, (_, i) => `<path d="M${pt(p, 1.2 + i * 1.2)}L${pt(q, 1.2 + i * 1.2)}" stroke="${VIO_L}" stroke-width=".35"/>`).join('')
    // La carta de arriba en coordenadas de carta (14 de ancho por 20 de alto), llevada al paralelogramo.
    const m = `matrix(${f((B[0] - A[0]) / 14)} ${f((B[1] - A[1]) / 14)} ${f((D[0] - A[0]) / 20)} ${f((D[1] - A[1]) / 20)} ${A[0]} ${A[1]})`
    // La carta de arriba, boca abajo: el dorso violeta con el filete dorado y una estrella en el medio.
    const face =
      `<g transform="${m}"><path d="${roundRect(0.6, 0.6, 13.4, 19.4, 1)}" fill="${VIO_D}"/><path d="${roundRect(1.6, 1.6, 12.4, 18.4, 0.7)}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
      `<path d="${roundRect(2.6, 2.6, 11.4, 17.4, 0.5)}" fill="none" stroke="${VIO_L}" stroke-width=".3" stroke-dasharray=".6 .5"/>` +
      `<path d="${starPath(7, 10, 4.4, 1.2, 4)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/><circle cx="7" cy="10" r="1" fill="${VIO}"/></g>`
    const hole = [A[0] + (B[0] - A[0]) * 0.5 + (D[0] - A[0]) * 0.3, A[1] + (B[1] - A[1]) * 0.5 + (D[1] - A[1]) * 0.3]
    const tip = [hole[0] + 1.6, 45]
    const smoke =
      hair(tip[0], tip[1], tip[0] - 5, tip[1] - 6, tip[0], tip[1] - 12, 1.1, VIO_L, 0.9) + hair(tip[0], tip[1] - 12, tip[0] + 6, tip[1] - 18, tip[0] + 1, tip[1] - 24, 0.9, VIO_L, 0.8) +
      hair(tip[0], tip[1], tip[0] + 4, tip[1] - 4, tip[0] + 3, tip[1] - 9, 0.6, '#fff', 0.7) + hair(tip[0] + 3, tip[1] - 9, tip[0] - 2, tip[1] - 15, tip[0] - 6, tip[1] - 16, 0.5, '#fff', 0.6) +
      `<path d="M${f(tip[0] - 6)} ${f(tip[1] - 16)}C${f(tip[0] - 10)} ${f(tip[1] - 16.4)} ${f(tip[0] - 11.4)} ${f(tip[1] - 13)} ${f(tip[0] - 9)} ${f(tip[1] - 11.4)}C${f(tip[0] - 7)} ${f(tip[1] - 10.2)} ${f(tip[0] - 5)} ${f(tip[1] - 12.4)} ${f(tip[0] - 6.4)} ${f(tip[1] - 13.8)}" fill="none" stroke="${VIO_L}" stroke-width=".7" stroke-linecap="round" opacity=".85"/>` +
      `<path d="M${f(tip[0] + 1)} ${f(tip[1] - 24)}C${f(tip[0] + 4)} ${f(tip[1] - 27)} ${f(tip[0] + 8)} ${f(tip[1] - 25.4)} ${f(tip[0] + 7)} ${f(tip[1] - 22.4)}C${f(tip[0] + 6.4)} ${f(tip[1] - 20.6)} ${f(tip[0] + 3.6)} ${f(tip[1] - 21)} ${f(tip[0] + 3.8)} ${f(tip[1] - 22.6)}" fill="none" stroke="${VIO_L}" stroke-width=".6" stroke-linecap="round" opacity=".75"/>`
    const beads = Array.from({ length: 27 }, (_, i) => {
      const a = (i / 27) * Math.PI * 2 + 0.4, x = 60 + Math.cos(a) * 31, y = 80 + Math.sin(a) * 10
      const front = Math.sin(a) > -0.15
      return { front, s: `<circle cx="${f(x)}" cy="${f(y)}" r="1.5" fill="${P.brown}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - 0.5)}" cy="${f(y - 0.5)}" r=".45" fill="#FFE3C2"/>` }
    })
    const tassel = 'M86.6 90L85.2 97H90.2L88.6 90Z'
    return (
      noche(k) +
      k.shade(ellipse(60, 50, 26, 30), k.rad(VIO_L, 0.5, 0.5, 0.5, 0.6, 0), VIO_L, 0.35) +
      k.floor(60, 85, 30, 5, NOCHE) +
      beads.filter((b) => !b.front).map((b) => b.s).join('') +
      k.draw([
        { d: sideL, fill: P.white, inner: edges(A, D) + k.sh(sideL, 0, 0, 1, 1, 0, 0.6, VIO_L, 0.4) },
        { d: sideR, fill: P.white, inner: edges(D, C) + k.sh(sideR, 0, 0, 1, 0, 0.3, 0.9, VIO, 0.45) },
        { d: top, fill: P.white, inner: k.sh(top, 0, 0, 1, 1, 0, 0.45, VIO_L, 0.35) },
      ], 0.7) +
      face +
      // El sahumerio clavado en el mazo, con la brasa encendida.
      `<path d="M${pt(hole)}L${pt(tip)}" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M${pt(hole)}L${pt(tip)}" stroke="${P.brownD}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M${f(hole[0] + 0.3)} ${f(hole[1] - 6)}L${f(tip[0] - 0.1)} ${f(tip[1] + 2.4)}" stroke="${P.red}" stroke-width="1.2" stroke-linecap="round"/>` +
      `<ellipse cx="${f(hole[0])}" cy="${f(hole[1])}" rx="1.6" ry=".6" fill="${VIO_D}"/>` +
      k.shade(ellipse(tip[0], tip[1], 4.4, 4.4), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.5) +
      `<circle cx="${f(tip[0])}" cy="${f(tip[1])}" r="1.2" fill="${P.gold}"/><circle cx="${f(tip[0])}" cy="${f(tip[1])}" r=".6" fill="#fff"/>` +
      smoke +
      // El rosario: las cuentas de adelante, la cuenta del gurú y la borla.
      beads.filter((b) => b.front).map((b) => b.s).join('') +
      `<circle cx="87.6" cy="87.6" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="87" cy="87" r=".6" fill="${P.goldL}"/>` +
      k.draw([{ d: tassel, fill: P.red, inner: `<path d="M86.2 91.4V96.6M87.6 91.4V96.8M89 91.4V96.6" stroke="${P.wine}" stroke-width=".35"/>` }], 0.4) +
      sparkle(32, 42, 2, P.goldL) + sparkle(88, 50, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Ocho ganadas: el nirvana. La flor de loto abierta sobre el agua quieta, con el aura dorada. Cero discusiones.
  'Nirvana': (u) => {
    const k = kit(u)
    const cx = 60, by = 74
    const petal = (a: number, w: number, h: number, back = false) => {
      const d = PETALO(w, h)
      return `<g transform="translate(${cx} ${by}) rotate(${a})">` +
        k.draw([{
          d, fill: back ? ROSA : P.white,
          inner: `<path d="${d}" fill="${k.lin(back ? ROSA_D : ROSA, 0, 1, 0, 0, 0.1, 0.95)}"/>` + k.sh(`M0 0H${w}V${-h}H0Z`, 0, 0, 1, 0, 0, 0.6, back ? VIO : ROSA_D, 0.4) +
            hair(0, -2, -0.6, -h * 0.5, 0, -h * 0.92, 0.5, ROSA_D, 0.8) + hair(-w * 0.32, -h * 0.12, -w * 0.52, -h * 0.42, -w * 0.26, -h * 0.74, 0.35, ROSA_D, 0.6) + hair(w * 0.32, -h * 0.12, w * 0.52, -h * 0.42, w * 0.26, -h * 0.74, 0.35, ROSA_D, 0.6) +
            `<path d="M0 ${f(-h * 0.98)}L${f(-w * 0.12)} ${f(-h * 0.86)}" stroke="#fff" stroke-width=".5"/>`,
        }], 0.55) + `</g>`
    }
    const water = 'M-2 74H122V130H-2Z'
    const pad = 'M30 80C30 76.6 40 75 52 75L55 79L57 75C70 75 82 76.4 82 80C82 84 70 86 56 86C42 86 30 84 30 80Z'
    const stamens = Array.from({ length: 11 }, (_, i) => {
      const a = (-160 + i * 14) * (Math.PI / 180), x1 = cx + Math.cos(a) * 9, y1 = by - 8 + Math.sin(a) * 6
      return `<path d="M${f(cx + Math.cos(a) * 4)} ${f(by - 8 + Math.sin(a) * 2.6)}L${f(x1)} ${f(y1)}" stroke="${P.goldD}" stroke-width=".5"/><circle cx="${f(x1)}" cy="${f(y1)}" r=".75" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`
    }).join('')
    const pod = ellipse(cx, by - 8.6, 6, 2.4)
    return (
      noche(k, 0.5, 0.5) +
      k.sun(cx, 54, 18, 50, 36, false) +
      k.shade(ellipse(cx, 54, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.55) +
      `<circle cx="${cx}" cy="54" r="20" fill="none" stroke="${P.goldL}" stroke-width=".8" opacity=".9"/><circle cx="${cx}" cy="54" r="23" fill="none" stroke="${P.gold}" stroke-width=".4" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      k.draw([{
        d: water, fill: VIO_D,
        inner: k.sh(water, 0, 0, 0, 1, 0, 0.9, NOCHE, 0.5) + `<path d="M-2 74H122V76H-2Z" fill="${VIO}"/>` +
          // El reflejo del aura en el agua quieta.
          [[52, 80, 16], [54, 84, 12], [56, 88, 8], [57, 92, 6]].map(([x, y, w]) => hair(x - w / 2, y, x + 4, y - 0.4, x + w, y, 0.9, P.goldL, 0.85)).join('') +
          hair(24, 82, 30, 81.4, 36, 82, 0.5, VIO_L, 0.7) + hair(84, 84, 90, 83.4, 96, 84, 0.5, VIO_L, 0.7) + hair(30, 92, 36, 91.4, 42, 92, 0.45, VIO_L, 0.6),
      }], 0.5) +
      k.draw([{ d: pad, fill: '#4E8A5C', inner: k.sh(pad, 0, 0, 1, 1, 0, 0.8, '#24452E', 0.45) + [-40, -20, 0, 20, 40].map((dx) => `<path d="M56 80L${56 + dx * 0.6} ${dx === 0 ? 85.6 : 76 + Math.abs(dx) * 0.08}" stroke="#2E5A3A" stroke-width=".4"/>`).join('') }], 0.5) +
      petal(-96, 6, 18, true) + petal(96, 6, 18, true) + petal(-72, 7, 24, true) + petal(72, 7, 24, true) +
      petal(-46, 8, 28) + petal(46, 8, 28) + petal(-22, 8.6, 32) + petal(22, 8.6, 32) +
      stamens +
      k.draw([{ d: pod, fill: P.gold, inner: k.sh(pod, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + [[-3, 0], [0, -0.8], [3, 0], [-1.4, 0.8], [1.4, 0.8]].map(([x, y]) => `<circle cx="${f(cx + x)}" cy="${f(by - 8.6 + y)}" r=".55" fill="${P.goldD}"/>`).join('') }], 0.4) +
      petal(0, 9.4, 34) + petal(-120, 5.4, 13) + petal(120, 5.4, 13) +
      sparkle(cx, 22, 3, '#fff') + sparkle(34, 40, 2, P.goldL) + sparkle(88, 44, 1.6, P.goldL) +
      k.defs()
    )
  },
}
