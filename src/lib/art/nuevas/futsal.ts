// Futsal: la pelota pesada que no pica, el piso de parquet barnizado y la zapatilla de suela lisa (de perfil, o de
// suela, con su dibujo de goma). Las piezas comunes están en ./_cancha-piezas.ts. A Falcão no se lo dibuja:
// aparece por la suela y por el pasillo de baldosas donde se aprende.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { ball, banner, GEORGIA, goldBall, GUM, GUM_D, parquet, wing, WOOD_D, ZAPA, ZAPA_SOLE, zapa } from './_cancha-piezas'

/** Suela de zapatilla vista desde abajo, la punta arriba, centrada en (0,0) y de 52 de largo. */
const SOLE_TOP = 'M0 -26C5.6 -26 8.6 -21.4 8.6 -14.6C8.6 -8.6 6.8 -4.4 6.6 1.4C6.4 7.4 8 11.6 7.4 17.6C6.8 23.4 3.8 26.4 0 26.4C-3.8 26.4 -6.8 23.4 -7 17.6C-7.4 11.6 -5.6 7.4 -5.8 1.4C-6 -4.4 -8.4 -8.6 -8.4 -14.6C-8.4 -21.4 -5.6 -26 0 -26Z'

/** Suela de goma con espiga, el círculo de giro bajo la planta y el taco con su número. */
function soleTop(k: Kit, o: { gum?: string; gumD?: string; gold?: boolean } = {}) {
  const gum = o.gum ?? GUM, gumD = o.gumD ?? GUM_D
  let tread = ''
  for (let y = -30; y < 30; y += 2.6) tread += `M-10 ${f(y)}L0 ${f(y - 3)}L10 ${f(y)}`
  return k.draw([{
    d: SOLE_TOP, fill: gum,
    inner:
      `<path d="${tread}" fill="none" stroke="${gumD}" stroke-width=".7" opacity=".85"/>` +
      `<circle cx="0" cy="-13" r="5.6" fill="${gum}" stroke="${gumD}" stroke-width=".7"/>` +
      [3.2, 1.6].map((r) => `<circle cx="0" cy="-13" r="${r}" fill="none" stroke="${gumD}" stroke-width=".5"/>`).join('') +
      `<path d="${roundRect(-4.6, 13, 4.6, 22, 3)}" fill="${gum}" stroke="${gumD}" stroke-width=".6"/>` +
      `<text x="0" y="20" ${GEORGIA} font-weight="700" font-size="5" fill="${gumD}" text-anchor="middle">42</text>` +
      k.sh(SOLE_TOP, 0, 0, 1, 0.3, 0, 0.8, gumD, 0.4) + `<path d="M-10 -28H-3V28H-10Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
      hair(-6.4, -20, -7.4, -12, -5, -4, 0.7, '#fff', 0.8) +
      (o.gold ? `<path d="M-6.4 1.4C-6.4 -4 -8 -8 -8 -14.6M6.4 1.4C6.4 -4 8.2 -8 8.2 -14.6" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` : ''),
  }], 0.75)
}

/** Corona de oro de tres puntas, con la base en (0,0). */
function crown(k: Kit) {
  const d = 'M-11 0L-12.6 -12L-6 -6.4L0 -15L6 -6.4L12.6 -12L11 0Z'
  return k.draw([{
    d, fill: P.gold,
    inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-12 -2.6H12" stroke="${P.goldD}" stroke-width=".6"/>` +
      `<path d="M-10.4 -3.6L-11.4 -10M-5 -3.4L-.6 -12.6" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>` +
      [-6, 0, 6].map((x) => `<circle cx="${x}" cy="-1.4" r="1" fill="${x ? P.sky : P.red}" stroke="${P.ink}" stroke-width=".3"/>`).join(''),
  }], 0.6) + [[-12.6, -12], [0, -15], [12.6, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`).join('')
}

/** Piso de baldosas de pasillo en damero, en perspectiva, desde y0. */
function tiles(k: Kit, y0: number) {
  const d = `M-10 ${y0}H130V140H-10Z`
  const rows = [0, 4, 9.4, 16.4, 25.6, 38, 54]
  let dark = ''
  for (let r = 0; r < rows.length - 1; r++) {
    const ya = y0 + rows[r], yb = y0 + rows[r + 1]
    for (let i = -8; i < 8; i++) {
      if ((i + r) % 2 === 0) continue
      const xa = (y: number, j: number) => 60 + j * 8 * (1 + (y - y0) / 30)
      dark += `M${f(xa(ya, i))} ${f(ya)}L${f(xa(ya, i + 1))} ${f(ya)}L${f(xa(yb, i + 1))} ${f(yb)}L${f(xa(yb, i))} ${f(yb)}Z`
    }
  }
  return `<path d="${d}" fill="${P.white}"/>` + k.clip(d, `<path d="${dark}" fill="${P.mid}"/>`) + k.sh(d, 0, 0, 0, 1, 0.6, 0, P.ink, 0.35) +
    `<path d="M-10 ${y0}H130V${y0 + 1.4}H-10Z" fill="${P.ink}" opacity=".5"/>`
}

export const FUTSAL_ART: Record<string, (u: number) => string> = {
  // ── Pivot ─────────────────────────────────────────────────────────

  // Diez goles con la pelota que no pica: cae sobre el parquet y se queda ahí, con un "¡plof!". El pique, chato.
  'Pelota de cuero pesado': (u) => {
    const k = kit(u)
    const cracks = 'M50 80L44 84L40 83M44 84L42 89M70 80L76 83.6L81 82.4M76 83.6L79 88M58 82L56 88M64 82L67 87.4'
    return (
      k.day() +
      k.sun(60, 56, 16, 44, 28, false) +
      parquet(k, 74) +
      `<path d="M28 34Q34 50 40 72Q44 62 48 72" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-dasharray="1.4 1.5" stroke-linecap="round"/>` +
      k.floor(60, 81, 20, 3.2, WOOD_D) +
      `<path d="${cracks}" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>` +
      ball(k, 60, 63.4, 17, { a: 0.5, b: 0.1, patch: P.mid }) +
      hair(38, 74, 34, 72, 30, 73, 0.9, P.ink) + hair(82, 74, 86, 72, 90, 73, 0.9, P.ink) + hair(40, 70, 36, 66, 32, 65, 0.7, P.ink) + hair(80, 70, 84, 66, 88, 65, 0.7, P.ink) +
      `<text x="78" y="38" ${GEORGIA} font-style="italic" font-size="7" fill="${P.ink}" text-anchor="middle" transform="rotate(8 78 38)">¡plof!</text>` +
      sparkle(40, 32, 1.8) +
      k.defs()
    )
  },

  // Cuarenta goles: el piso brilla cuando entrás. La pelota con corona, reflejada en el parquet barnizado.
  'Rey del parquet': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.stage(60, 50, 32) +
      parquet(k, 70, { shine: true, line: P.red }) +
      `<g transform="translate(0 141) scale(1 -1)" opacity=".35">` + ball(k, 60, 56, 15, { a: 0.3, b: -0.5, patch: P.mid }) + `</g>` +
      `<path d="M14 84H106" stroke="#fff" stroke-width=".6" opacity=".4"/>` +
      ball(k, 60, 55, 15, { a: 0.3, b: -0.5, patch: P.mid }) +
      `<g transform="translate(61 42) rotate(8)">` + crown(k) + `</g>` +
      sparkle(30, 80, 2.6, '#fff') + sparkle(88, 86, 2, '#fff') + sparkle(76, 78, 1.4, '#fff') + sparkle(44, 92, 1.6, '#fff') +
      sparkle(84, 36, 1.8, P.goldL) + sparkle(36, 44, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Ciento veinte: campeón del mundo de futsal, como la Selección en Colombia 2016. La copa con la cinta celeste y blanca.
  'Mundial de Colombia 2016': (u) => {
    const k = kit(u)
    const bowl = 'M44 40H76C76 54 70 63 60 64C50 63 44 54 44 40Z'
    const rim = ellipse(60, 40, 16, 3)
    const stem = 'M56.4 63.4H63.6L62.6 70H57.4Z'
    const knop = ellipse(60, 71, 5, 2)
    const foot = 'M50 80C50 76 54 72.6 60 72.6C66 72.6 70 76 70 80Z'
    const base = roundRect(46, 80, 74, 86, 1)
    const handle = (s: number) => `M${60 + s * 15.4} 43C${60 + s * 24} 41 ${60 + s * 24} 54 ${60 + s * 12} 56`
    const g = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` })
    const ribbon = 'M46 50C52 53 68 53 74 50L73 56C67 59 53 59 47 56Z'
    return (
      k.day() +
      k.sun(60, 54, 18, 48) +
      k.shade(ellipse(60, 52, 26, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(48, 100, 28, 92, 26, 60, 8) + laurel(72, 100, 92, 92, 94, 60, 8, true) +
      [[46, 24], [60, 20], [74, 24]].map(([x, y], i) => `<path d="${starPath(x, y, i === 1 ? 3 : 2.2, i === 1 ? 1.3 : 0.95, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      k.floor(60, 86.6, 18, 2.2, P.mid) +
      [handle(-1), handle(1)].map((d) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round" transform="translate(-.4 -.4)"/>`).join('') +
      k.draw([
        { d: base, fill: P.night, inner: k.sh(base, 0, 0, 1, 0, 0, 0.8, '#0F1736', 0.4) + `<path d="M47 82.6H73" stroke="${P.gold}" stroke-width=".5"/>` },
        g(foot, 0.35), g(stem), g(knop, 0.35), g(bowl, 0.35),
      ], 0.65) +
      `<path d="${ribbon}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".5"/>` + k.clip(ribbon, `<path d="M40 52.4H80V54.6H40Z" fill="${P.white}"/>` + k.sh(ribbon, 0, 0, 1, 0, 0, 0.6, P.mid, 0.35)) +
      `<circle cx="60" cy="54.4" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="${starPath(60, 54.4, 1.6, 0.7, 8)}" fill="${P.goldL}"/>` +
      `<path d="M47 43C48 50 51 56 55 59" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` +
      k.draw([{ d: rim, fill: P.goldD, inner: `<path d="${ellipse(60, 40.6, 14.4, 2.2)}" fill="${P.gold}"/>` }], 0.5) +
      goldBall(k, 60, 34, 7.6, { a: 0.4, b: 0.6 }) +
      banner(k, 60, 90, 44, P.white, P.sky, 'Colombia 2016', P.ink, 4) +
      sparkle(84, 36, 2.2, '#fff') + sparkle(36, 40, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Suela mágica ──────────────────────────────────────────────────

  // Tres jugadas de suela: la zapatilla pisa la pelota y la lleva para atrás. El rival se quedó mirando el piso.
  'Pisadita': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 54, 15, 44, 32, false) +
      parquet(k, 80) +
      k.floor(58, 86, 14, 2, WOOD_D) +
      ball(k, 58, 73, 12.6, { a: 0.8, b: 0.2, patch: P.mid }) +
      `<g transform="translate(63 60.4) rotate(-14) scale(1.12)">` + k.cast([ZAPA, ZAPA_SOLE], 1.4, 1.6) + zapa(k) + `</g>` +
      `<path d="M40 88Q32 87 26 84" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-dasharray="1.6 1.4" stroke-linecap="round"/><path d="M28 81.4L25 84L28.6 86" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>` +
      hair(42, 66, 39, 72, 42, 78, 0.8, P.mid) + hair(37, 68, 34, 73, 36.4, 78, 0.6, P.mid) +
      `<text x="86" y="78" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" text-anchor="middle">¿eh?</text>` +
      sparkle(32, 40, 2) + sparkle(88, 40, 1.6) +
      k.defs()
    )
  },

  // Quince jugadas: la suela hace lo que quiere. La suela, vista de abajo, con la pelota dando la vuelta sobre las baldosas del pasillo.
  'Falcão de pasillo': (u) => {
    const k = kit(u)
    const loop = 'M60 88C40 88 30 74 34 58C38 42 52 32 66 36C80 40 88 54 82 68C78 78 66 80 60 74'
    return (
      k.day() +
      k.shade(ellipse(60, 52, 32, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      tiles(k, 78) +
      `<path d="${loop}" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-dasharray="1.6 1.5" stroke-linecap="round"/>` +
      `<g transform="translate(58 58) rotate(18)">` + k.cast([SOLE_TOP], 2.4, 2.2) + soleTop(k) + `</g>` +
      ball(k, 82, 66, 7.4, { a: 0.9, b: 0.6, patch: P.mid }) +
      hair(84, 52, 88, 56, 89, 61, 0.8, P.mid) + hair(88, 50, 92, 55, 92.6, 60, 0.6, P.mid) +
      `<path d="M58.6 87.4L62 88.4L59 90.4" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>` +
      sparkle(36, 34, 2) + sparkle(86, 34, 1.6) + sparkle(32, 70, 1.3) +
      k.defs()
    )
  },

  // Cuarenta jugadas de suela: tus zapatillas tienen vida propia. Vuela sola, con alas, de noche y entre estrellas.
  'Zapatilla encantada': (u) => {
    const k = kit(u)
    const stars = [[30, 32], [88, 28], [40, 22], [80, 20], [26, 62], [94, 64], [34, 84], [88, 86]]
    return (
      k.night() +
      stars.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 56, 30, 28), k.rad(P.gold, 0.5, 0.5, 0.5, 0.5, 0), P.gold, 0.35) +
      laurel(46, 100, 28, 92, 26, 62, 8) + laurel(74, 100, 92, 92, 94, 62, 8, true) +
      `<g transform="translate(46 54) scale(-.7 .7) rotate(-14)">` + wing(k, P.white, P.sky2, P.gold) + `</g>` +
      `<g transform="translate(62 66) rotate(-10) scale(1.08)">` + k.cast([ZAPA, ZAPA_SOLE], 2, 2.6, '#0F1736') + zapa(k, { toe: P.goldL, stripe: P.gold, stripeD: P.goldD }) + `</g>` +
      `<g transform="translate(58 52) scale(.78) rotate(-24)">` + wing(k, P.white, P.sky2, P.gold) + `</g>` +
      hair(28, 76, 36, 74, 42, 76, 0.9, P.goldL) + hair(26, 82, 34, 80, 40, 82, 0.7, P.goldL) +
      [[50, 84], [62, 86], [72, 82]].map(([x, y], i) => sparkle(x, y, 2.2 - i * 0.4, P.goldL)).join('') +
      sparkle(84, 42, 2.6, P.goldL) + sparkle(34, 40, 1.8, P.goldL) +
      k.defs()
    )
  },
}
