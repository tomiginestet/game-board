// Fútbol tenis: la red que es una soga (la del tender, con broches), la pelota de gajos que pica una vez, la
// zapatilla que vuela de chilena y la arena de la playa con la vereda de olas de Copacabana. Las piezas comunes
// están en ./_cancha-piezas.ts. A Ronaldinho no se lo dibuja: aparece por la pelota que no baja nunca.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { ball, GEORGIA, goldBall, grass, ZAPA, ZAPA_SOLE, zapa } from './_cancha-piezas'

/** Arena: dorado claro apagado, con su sombra. */
const SAND = '#EBD3A0', SAND_D = '#C9A766'
/** Mar de estampa. */
const SEA = '#7FA6C9'

/** Soga entintada (cuerda torcida) de (x0,y0) a (x1,y1), colgando hasta la flecha `sag`. */
function rope(x0: number, y0: number, x1: number, y1: number, sag: number, c = P.goldL) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + sag * 2
  const d = `M${x0} ${y0}Q${f(cx)} ${f(cy)} ${x1} ${y1}`
  return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${SAND_D}" stroke-width="1.1" stroke-dasharray=".5 1.1"/>`
}

/** Broche de la ropa de madera, parado, con la punta abajo en (x,y). */
function pin(k: Kit, x: number, y: number, rot = 0) {
  const d = 'M-1.4 -5.4H1.4L1 1.6H-1Z'
  return `<g transform="translate(${x} ${y}) rotate(${rot})">` + k.draw([{ d, fill: P.brown, inner: k.sh(d, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.4) + `<path d="M0 -5.4V1.6" stroke="${P.brownD}" stroke-width=".35"/>` }], 0.4) +
    `<path d="M-1.6 -2.4H1.6" stroke="${P.ink}" stroke-width=".9"/><path d="M-1.6 -2.4H1.6" stroke="${P.sky1}" stroke-width=".45"/></g>`
}

/** Piso de vereda de Copacabana desde y0: ondas de tinta sobre el papel, en perspectiva. */
function waves(k: Kit, y0: number) {
  const d = `M-10 ${y0}H130V140H-10Z`
  let w = ''
  for (let r = 0; r < 7; r++) {
    const y = y0 + 2 + r * r * 0.7 + r * 3.2, a = 1.4 + r * 0.8, l = 8 + r * 3
    let p = `M-10 ${f(y)}`
    for (let x = -10; x < 130; x += l) p += `Q${f(x + l / 4)} ${f(y - a)} ${f(x + l / 2)} ${f(y)}Q${f(x + (3 * l) / 4)} ${f(y + a)} ${f(x + l)} ${f(y)}`
    w += `<path d="${p}" fill="none" stroke="${P.night}" stroke-width="${f(1 + r * 0.5)}"/>`
  }
  return `<path d="${d}" fill="${P.white}"/>` + k.clip(d, w) + k.sh(d, 0, 0, 0, 1, 0.5, 0, P.blue, 0.3) + `<path d="M-10 ${y0}H130" stroke="${P.ink}" stroke-width=".8"/>`
}

/** Anteojos de sol de marco grueso, centrados en (0,0). */
function shades(k: Kit) {
  const lens = (x: number) => `M${x - 6} -3.6H${x + 6}C${x + 6.4} 1 ${x + 4} 4 ${x} 4C${x - 4} 4 ${x - 6.4} 1 ${x - 6} -3.6Z`
  const L = lens(-7), R = lens(7)
  return (
    `<path d="M-13 -3.2L-17 -5.6M13 -3.2L17 -5.6" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
    k.draw([{ d: L, fill: P.night }, { d: R, fill: P.night }], 0.7) +
    `<path d="M-1 -3C0 -4 0 -4 1 -3" fill="none" stroke="${P.ink}" stroke-width="1.6"/>` +
    k.clip(L + R, `<path d="M-14 4L-8 -4H-5L-11 4ZM0 4L6 -4H9L3 4Z" fill="${P.sky}" opacity=".6"/>` + `<path d="M-14 -4H14V0H-14Z" fill="${P.mid}" opacity=".5"/>`)
  )
}

/** Reposera de playa, de perfil, apoyada en y=0 y abierta hacia la derecha. */
function reposera(k: Kit) {
  const cloth = 'M-12 -22L-9.6 -23L2 -6L18 -7.4L18.4 -5.4L1 -3.6Z'
  return (
    `<path d="M-12 -22L2 -4.4L-4 0M2 -4.4L18 -6.4L14 0M-6 -10L8 0" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M-12 -22L2 -4.4L-4 0M2 -4.4L18 -6.4L14 0M-6 -10L8 0" fill="none" stroke="${P.sky1}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>` +
    k.draw([{ d: cloth, fill: P.red, inner: `<path d="M-12 -18L-1 -5M-6 -24L5 -8M6 -10L8 -2M12 -10L13 -3" stroke="${P.white}" stroke-width="2.2"/>` + k.sh(cloth, 0, 0, 1, 1, 0, 0.6, P.wine, 0.35) }], 0.5)
  )
}

/** Cañón de circo sobre su cureña, apuntando arriba a la izquierda, con la boca en (0,0). */
function cannon(k: Kit, gold: boolean) {
  const barrel = 'M-4.6 -1.4C-4.8 -3.2 4.8 -3.2 4.6 -1.4L7.4 30C7.6 33.4 -7.6 33.4 -7.4 30Z'
  const mouth = ellipse(0, -1.4, 5.8, 2.2)
  const ring = (y: number, w: number) => roundRect(-w, y - 1.2, w, y + 1.2, 1.2)
  const c = gold ? P.gold : P.red, cd = gold ? P.goldD : P.wine
  return (
    k.draw([{
      d: barrel, fill: c,
      inner: k.sh(barrel, 0, 0, 1, 0, 0, 0.9, cd, 0.45) + `<path d="M-8 -4H-2V34H-8Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
        [8, 16, 24].map((y, i) => `<path d="M-6 ${y}H6" stroke="${P.white}" stroke-width="${2.6 - i * 0.2}" opacity=".9"/>`).join('') +
        [12, 20].map((y) => `<path d="${starPath(0, y, 2.2, 0.9, 5)}" fill="${gold ? P.white : P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join(''),
    }], 0.7) +
    k.draw([{ d: ring(3, 6), fill: P.goldL, inner: k.sh(ring(3, 6), 0, 0, 1, 0, 0, 0.7, P.goldD, 0.4) }, { d: ring(29, 8), fill: P.goldL, inner: k.sh(ring(29, 8), 0, 0, 1, 0, 0, 0.7, P.goldD, 0.4) }], 0.5) +
    k.draw([{ d: mouth, fill: P.night }], 0.5)
  )
}

export const FUTBOLTENIS_ART: Record<string, (u: number) => string> = {
  // ── Pie de seda ───────────────────────────────────────────────────

  // Cinco ganados con la red atada al tender: la soga con los broches, la media y el repasador, y la pelota que pasa.
  'Soga de la ropa': (u) => {
    const k = kit(u)
    const sock = 'M-3 0H3V10C3 12 4 13 6.4 13.6C9 14.2 9.4 17.6 6.6 18.2C3.6 18.8 -1 18 -2.4 15.6C-3.2 14.2 -3 12 -3 10Z'
    const towel = 'M-8 0H8L8.6 18H-8.6Z'
    const yAt = (x: number) => { const t = (x - 22) / 76; return (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 64 + t * t * 50 }
    return (
      k.day() +
      k.sun(60, 54, 15, 44, 32, false) +
      grass(k, 86) +
      `<path d="M22 46V96M98 46V96" stroke="${P.ink}" stroke-width="2.8" stroke-linecap="round"/><path d="M22 46V96M98 46V96" stroke="${P.sky1}" stroke-width="1.4" stroke-linecap="round"/>` +
      rope(22, 50, 98, 50, 7) +
      `<g transform="translate(40 ${f(yAt(40))}) rotate(4)">` + k.draw([{ d: sock, fill: P.white, inner: `<path d="M-3 2H3V4.4H-3ZM-3 6H3V8H-3Z" fill="${P.red}"/>` + k.sh(sock, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M3 12C4.8 12.6 7 13 8.8 15" fill="none" stroke="${P.sky}" stroke-width=".5"/>` }], 0.55) + `</g>` +
      pin(k, 40, yAt(40) + 1, 4) +
      `<g transform="translate(77 ${f(yAt(77))}) rotate(-6)">` + k.draw([{ d: towel, fill: P.sky1, inner: [3, 6, 12, 15].map((y) => `<path d="M-9 ${y}H9" stroke="${y % 2 ? P.red : P.mid}" stroke-width="1"/>`).join('') + k.sh(towel, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + hair(-3, 2, -4, 9, -2, 17, 0.5, P.blue) }], 0.55) + `</g>` +
      pin(k, 72, yAt(72) + 1, -6) + pin(k, 82, yAt(82) + 0.6, -6) +
      `<path d="M30 80Q44 26 62 34" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-dasharray="1.4 1.5" stroke-linecap="round"/>` +
      ball(k, 66, 35, 9.4, { a: 0.6, b: 0.4 }) +
      `<path d="M28 82L30.6 80L32 83" fill="none" stroke="${P.ink}" stroke-width=".8"/>` +
      sparkle(86, 30, 1.8) + sparkle(36, 34, 1.4) +
      k.defs()
    )
  },

  // Veinte victorias: jugás descalzo y con anteojos de sol. La pelota en la arena, los anteojos, la huella y la vereda de olas.
  'Playa de Copacabana': (u) => {
    const k = kit(u)
    const sand = 'M-10 64H130V140H-10Z'
    const foot = 'M0 -6C2.4 -6 3.4 -3.6 3.2 -.6C3 2.4 2.2 4 2.4 6.4C2.6 8.4 1.4 10 0 10C-1.6 10 -2.6 8.4 -2.4 6.4C-2.2 4 -3 2 -3 -.6C-3 -3.6 -2.2 -6 0 -6Z'
    const toes = [[-2.4, -8.4, 1], [-.4, -9.4, 1.1], [1.6, -9, 0.95], [3.2, -8, 0.8], [4.4, -6.6, 0.7]]
    return (
      k.day() +
      k.sun(60, 50, 16, 46, 32, false) +
      `<path d="M-10 58H130V66H-10Z" fill="${SEA}"/>` + `<path d="M-10 58H130" stroke="${P.ink}" stroke-width=".6"/>` +
      [24, 50, 78, 98].map((x) => `<path d="M${x} 61.4q2.4 -1.6 4.8 0" fill="none" stroke="#fff" stroke-width=".7"/>`).join('') +
      `<path d="${sand}" fill="${SAND}"/>` + k.sh(sand, 0, 0, 0, 1, 0, 0.6, SAND_D, 0.4) +
      `<path d="M-10 64Q20 61 50 64T130 63.4" fill="none" stroke="#fff" stroke-width="1.2" opacity=".8"/>` +
      waves(k, 84) +
      `<g transform="translate(33 76) rotate(-24)">` + `<path d="${foot}" fill="${SAND_D}" opacity=".75"/>` + toes.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SAND_D}" opacity=".75"/>`).join('') + `</g>` +
      k.floor(60, 79, 16, 2.4, SAND_D) +
      ball(k, 60, 66, 13, { a: 0.4, b: -0.6 }) +
      `<g transform="translate(78 78) rotate(-10) scale(.9)">` + shades(k) + `</g>` +
      sparkle(86, 34, 2) + sparkle(32, 40, 1.6) + sparkle(46, 52, 1.2, '#fff') +
      k.defs()
    )
  },

  // Sesenta ganados: la pelota no toca el piso ni para descansar. Flota, de oro, sobre la reposera vacía.
  'Ronaldinho en la arena': (u) => {
    const k = kit(u)
    const sand = 'M-10 82H130V140H-10Z'
    const arcs = 'M36 70Q36 40 50 34M84 70Q84 40 70 34'
    return (
      k.day() +
      k.sun(60, 46, 16, 46) +
      k.shade(ellipse(60, 46, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(46, 102, 26, 94, 24, 62, 8) + laurel(74, 102, 94, 94, 96, 62, 8, true) +
      `<path d="${sand}" fill="${SAND}"/>` + k.sh(sand, 0, 0, 0, 1, 0, 0.6, SAND_D, 0.4) + `<path d="M-10 82H130" stroke="${SAND_D}" stroke-width=".8"/>` +
      `<path d="${arcs}" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-dasharray="1.2 1.4" stroke-linecap="round"/>` +
      k.floor(62, 91, 16, 1.8, SAND_D) +
      `<g transform="translate(58 91) scale(1.3)">` + reposera(k) + `</g>` +
      goldBall(k, 60, 44, 12.6, { a: 0.2, b: 0.7 }) +
      [[36, 72], [84, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      sparkle(48, 34, 2.4, '#fff') + sparkle(72, 56, 1.4, '#fff') + sparkle(86, 30, 2, P.goldL) + sparkle(32, 46, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Acróbata ──────────────────────────────────────────────────────

  // Tu primera chilena en la red: la zapatilla, patas para arriba sobre la soga. Caíste mal, pero valió.
  'Patada voladora': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 56, 15, 44, 28, false) +
      grass(k, 86) +
      `<path d="M24 66V96M96 66V96" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M24 66V96M96 66V96" stroke="${P.sky1}" stroke-width="1.2" stroke-linecap="round"/>` +
      rope(24, 68, 96, 68, 2) +
      hair(30, 58, 46, 32, 72, 30, 1.2, P.mid, 0.7) + hair(34, 64, 52, 40, 76, 38, 1, P.mid, 0.6) +
      `<g transform="translate(56 52) rotate(-48) scale(1.05)">` + k.cast([ZAPA, ZAPA_SOLE], 1.6, 1.6) + zapa(k) + `</g>` +
      ball(k, 80, 37, 7.4, { a: 0.3, b: 0.9 }) +
      hair(76, 30, 72, 28, 68, 29, 0.6, P.mid) + hair(77, 36, 73, 36, 69, 38, 0.5, P.mid) +
      [[44, 80, 2.2], [52, 76, 1.6], [60, 81, 2]].map(([x, y, r]) => `<path d="${starPath(x, y, r, r * 0.42, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `<text x="80" y="82" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle">¡auch!</text>` +
      k.defs()
    )
  },

  // Cinco chilenas: el mortal para atrás da toda la vuelta, y el kinesiólogo ya te reservó el turno.
  'Mortal atrás': (u) => {
    const k = kit(u)
    const loop = 'M44 76A22 22 0 1 1 78 70'
    const card = roundRect(-12, -8, 12, 8, 1)
    return (
      k.day() +
      k.stage(60, 56, 32) +
      `<path d="${loop}" fill="none" stroke="${P.ink}" stroke-width="4.4" stroke-linecap="round"/><path d="${loop}" fill="none" stroke="${P.sky}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M37 72.4L44 79L45.4 69.4Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".8" stroke-linejoin="round"/>` +
      `<g transform="translate(60 62) rotate(-24) scale(.9)">` + k.cast([ZAPA, ZAPA_SOLE], 1.6, 1.6) + zapa(k) + `</g>` +
      ball(k, 80, 37, 6.4, { a: 0.4, b: 0.2 }) +
      `<g transform="translate(70 86) rotate(-6)">` +
      k.draw([{ d: card, fill: P.white, inner: k.sh(card, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) + `<path d="M-12 -8H12V-3.6H-12Z" fill="${P.red}"/>` + `<path d="M-6 -6H-2M-4 -8V-4" stroke="#fff" stroke-width="1"/>` }], 0.5) +
      `<text x="3.4" y="-4.6" ${GEORGIA} font-size="3.4" font-weight="700" fill="#fff" text-anchor="middle">kinesio</text>` +
      `<text x="0" y="3" ${GEORGIA} font-style="italic" font-size="4" fill="${P.ink}" text-anchor="middle">turno 5</text>` +
      `<path d="M-8 5.6H8" stroke="${P.sky}" stroke-width=".4"/>` +
      `</g>` +
      sparkle(32, 40, 1.8) + sparkle(88, 56, 1.4) +
      k.defs()
    )
  },

  // Quince chilenas: te contrata el Circo de Moscú. El cañón del hombre bala dispara la pelota bajo la carpa a rayas.
  'Hombre bala': (u) => {
    const k = kit(u)
    const stripes = Array.from({ length: 14 }, (_, i) => {
      const a0 = Math.PI * (0.06 + (i / 14) * 0.88), a1 = a0 + (Math.PI * 0.88) / 28
      return `M60 -6L${f(60 + Math.cos(a0) * 160)} ${f(-6 + Math.sin(a0) * 160)}L${f(60 + Math.cos(a1) * 160)} ${f(-6 + Math.sin(a1) * 160)}Z`
    }).join('')
    const wheel = (x: number, y: number) =>
      k.draw([{ d: ellipse(x, y, 7, 7), fill: P.red, inner: k.sh(ellipse(x, y, 7, 7), 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) }], 0.6) +
      `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="${P.gold}" stroke-width=".9"/>` +
      Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI; return `<path d="M${f(x - Math.cos(a) * 5)} ${f(y - Math.sin(a) * 5)}L${f(x + Math.cos(a) * 5)} ${f(y + Math.sin(a) * 5)}" stroke="${P.gold}" stroke-width=".8"/>` }).join('') +
      `<circle cx="${x}" cy="${y}" r="1.6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`
    const FULL = 'M0 0H120V130H0Z'
    return (
      `<rect width="120" height="130" fill="${P.white}"/>` +
      `<path d="${stripes}" fill="${P.red}"/>` + k.shade(stripes, k.lin(P.wine, 0, 0, 0, 1, 0.1, 0.9), P.wine, 0.35) +
      k.shade(FULL, k.rad(P.night, 0.5, 0.42, 0.62, 0, 0.9), P.night, 0.45) +
      k.shade(ellipse(60, 48, 32, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(46, 102, 26, 94, 24, 62, 8) + laurel(74, 102, 94, 94, 96, 62, 8, true) +
      k.floor(56, 88, 22, 2.8, P.night) +
      `<g transform="translate(60 48) rotate(20)">` + cannon(k, true) + `</g>` +
      wheel(52, 80) +
      [[58, 42, 6], [64, 44, 4.8], [56, 37, 4.4], [63, 38, 4.2]].map(([x, y, r]) => k.draw([{ d: ellipse(x, y, r, r), fill: P.white, inner: k.sh(ellipse(x, y, r, r), 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) }], 0.45)).join('') +
      hair(58, 32, 61, 28, 63, 27, 0.9, P.goldL) + hair(64, 34, 67, 31, 69, 30, 0.9, P.goldL) +
      ball(k, 68, 26, 6.6, { a: 0.6, b: 0.4 }) +
      [[78, 26], [84, 44], [50, 26]].map(([x, y], i) => sparkle(x, y, 2 - i * 0.3, P.goldL)).join('') +
      sparkle(32, 40, 2.2, P.goldL) + sparkle(88, 70, 1.6, P.goldL) +
      k.defs()
    )
  },
}
