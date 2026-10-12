// Truco, familia Vale cuatro: el siete bravo y los anchos, como en el naipe español, en clave heroica.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, type Kit } from '../kit'

/** Espada del naipe: hoja azul de dos caras, guarnición dorada con volutas, puño rojo encordado y pomo. */
function sword(k: Kit, s = 1) {
  const bladeL = 'M0 -41L-4.6 -30V10H0Z'
  const bladeR = 'M0 -41L4.6 -30V10H0Z'
  const blade = 'M0 -41L4.6 -30V10H-4.6V-30Z'
  const guard =
    'M0 9C6 9 13 8 18.6 6.2C22.4 5 25.6 6.6 24.8 9.8C24.2 12.4 21 12.8 19.8 11.2C18 14 12 15.8 0 15.8' +
    'C-12 15.8 -18 14 -19.8 11.2C-21 12.8 -24.2 12.4 -24.8 9.8C-25.6 6.6 -22.4 5 -18.6 6.2C-13 8 -6 9 0 9Z'
  const grip = 'M-3.4 15.8H3.4L3 31H-3Z'
  const pommel = ellipse(0, 34.6, 4.8, 4.2)
  const curl = (x: number, sgn: number) =>
    `<g transform="translate(${x} 13.6) scale(${sgn} 1)"><path d="M0 0C3.6 0 5.6 3 4.4 5.6C3.2 8 -.4 7.6 -.6 5.2C-.8 3.6 1 2.8 2 3.8" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M0 0C3.6 0 5.6 3 4.4 5.6C3.2 8 -.4 7.6 -.6 5.2C-.8 3.6 1 2.8 2 3.8" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linecap="round"/></g>`
  return (
    `<g transform="scale(${s})">` +
    k.draw([
      { d: blade, fill: P.sky },
      { d: guard, fill: P.gold, line: 0.35, inner: k.sh(guard, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M-22 8.4C-12 10.6 12 10.6 22 8.4" fill="none" stroke="${P.goldL}" stroke-width=".8" opacity=".8"/>` },
      { d: grip, fill: P.red, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.9, P.wine, 0.45) + Array.from({ length: 6 }, (_, i) => `<path d="M-3.6 ${f(17.4 + i * 2.5)}L3.6 ${f(19.4 + i * 2.5)}" stroke="${P.wine}" stroke-width=".7"/>`).join('') },
      { d: pommel, fill: P.gold, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) },
    ], 0.85 / s) +
    `<path d="${bladeL}" fill="${P.white}"/>` +
    `<path d="${bladeR}" fill="${P.sky}"/>` + k.clip(bladeR, k.sh(bladeR, 0, 0, 1, 0, 0.2, 0.9, P.blue, 0.4)) +
    `<path d="${blade}" fill="none" stroke="${P.ink}" stroke-width="${f(0.5 / s)}" stroke-linejoin="round"/>` +
    hair(0, -37, 0.3, -14, 0, 8, 0.9, P.mid) + hair(-2.6, -28, -2.8, -12, -2.6, 6, 0.6, '#fff') +
    curl(-17, -1) + curl(17, 1) +
    `<circle cx="0" cy="12.4" r="2.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/><circle cx="-.7" cy="11.7" r=".7" fill="#fff"/>` +
    `<circle cx="0" cy="34.6" r="1.8" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
    `</g>`
  )
}

/** Silueta del basto: garrote que engorda hacia arriba, con nudos en los costados y la punta redondeada. */
function clubPath() {
  const N = 28, L: string[] = [], R: string[] = []
  const bump = (t: number, at: number, h: number) => h * Math.exp(-(((t - at) / 0.045) ** 2))
  for (let i = 0; i <= N; i++) {
    const t = i / N, y = 40 - 74 * t, w = 4.4 + 6.2 * Math.pow(t, 1.3)
    const l = w + bump(t, 0.28, 1.8) + bump(t, 0.62, 2.2) + bump(t, 0.86, 1.4)
    const r = w + bump(t, 0.45, 2) + bump(t, 0.74, 1.6) + bump(t, 0.16, 1.2)
    L.push(`${f(-l)} ${f(y)}`)
    R.push(`${f(r)} ${f(y)}`)
  }
  return `M${L.join('L')}C-11 -38 -6 -42.6 0 -42.6C6 -42.6 11 -38 ${R[R.length - 1]}L${R.reverse().join('L')}Z`
}

/** Basto del naipe: garrote de madera nudoso, con muñones de ramas y brotes de hojas. */
function club(k: Kit) {
  const body = clubPath()
  const stub = (x: number, y: number, r: number, l: number) => {
    const d = `M0 -2C${f(l * 0.6)} -2.6 ${l} -1.8 ${l} 0C${l} 1.8 ${f(l * 0.6)} 2.6 0 2Z`
    return `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d, fill: P.brown, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) }], 0.6) +
      `<ellipse cx="${l}" cy="0" rx="1" ry="1.8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><ellipse cx="${l}" cy="0" rx=".4" ry=".8" fill="none" stroke="${P.brownD}" stroke-width=".3"/></g>`
  }
  const leaf = (x: number, y: number, r: number, s = 1) => {
    const d = 'M0 0C2 -3.4 7 -4 9.6 -1C7 2.4 2.4 2.4 0 0Z'
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.green, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.4) }], 0.45 / s) + `<path d="M1 -.4Q5 -1.4 8.4 -1" fill="none" stroke="${P.greenD}" stroke-width=".4"/></g>`
  }
  const knot = (x: number, y: number, rx: number, ry: number) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${P.brownD}" opacity=".55"/><ellipse cx="${x}" cy="${y}" rx="${f(rx * 1.7)}" ry="${f(ry * 1.6)}" fill="none" stroke="${P.brownD}" stroke-width=".45"/>`
  return (
    stub(-9.4, -10, 205, 9) + stub(9.6, -24, -25, 8) + stub(8.6, 8, -15, 6) +
    k.draw([{
      d: body, fill: P.brown, line: 0.35,
      inner:
        k.sh('M1.6 -46C8 -24 8 10 5 44H14V-46Z', 0, 0, 1, 0, 0, 0.95, P.brownD, 0.5) + `<path d="M-14 -46H-3V44H-14Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.55, 0)}"/>` +
        hair(-4, -34, -6.4, -6, -3, 34, 0.55, P.brownD) + hair(3, -36, 4.6, -4, 2.4, 36, 0.55, P.brownD) + hair(-0.6, -26, 0.6, 2, -0.8, 30, 0.45, P.brownD) + hair(-7, -24, -8.4, -14, -6.6, -2, 0.4, P.brownD) +
        knot(-2.4, -12, 1.4, 2.2) + knot(2.6, 10, 1.1, 1.8) + knot(-1.2, 24, 0.9, 1.4) + knot(3.4, -28, 1.2, 1.8) +
        k.sh('M-10 32H10V44H-10Z', 0, 0, 0, 1, 0, 0.6, P.brownD, 0.3),
    }], 0.9) +
    leaf(-4, -40.6, -128) + leaf(2, -41.6, -58, 0.9) + leaf(-0.6, -42.4, -94, 0.75) + leaf(18, -28.6, -42, 0.8) + leaf(-17.8, -12.6, 205, 0.85)
  )
}

/** Espada fina del naipe (para los números): hoja, gavilán dorado, puño rojo y pomo; apunta hacia arriba. */
function thinSword(len: number) {
  const h = len / 2
  const blade = `M0 ${-h}L1.2 ${f(-h + 3)}V${f(h - 8)}H-1.2V${f(-h + 3)}Z`
  return (
    `<path d="${blade}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/><path d="M-.5 ${f(-h + 3)}V${f(h - 9)}" stroke="#fff" stroke-width=".5"/>` +
    `<rect x="-4.4" y="${f(h - 8.6)}" width="8.8" height="1.8" rx=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
    `<rect x="-.9" y="${f(h - 6.8)}" width="1.8" height="4.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
    `<circle cx="0" cy="${f(h - 1.2)}" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
  )
}

/** Naipe español con el marco de espadas (dos cortes por lado) y el número en las esquinas. */
function spanishCard(k: Kit, n: string) {
  const d = roundRect(-17, -26, 17, 26, 2.4)
  const frame = 'M-14 -23H14V23H-14Z'
  return (
    k.draw([{ d, fill: P.white, inner: k.sh('M4 -28H19V28H4Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) }], 0.75) +
    `<path d="${frame}" fill="none" stroke="${P.mid}" stroke-width=".7" stroke-dasharray="11 2.2 4 2.2 11 2.2 4 2.2 11 2.2 4 2.2 11" />` +
    `<text x="-11" y="-16" font-family="Georgia, serif" font-weight="700" font-size="6" fill="${P.mid}" text-anchor="middle">${n}</text>` +
    `<text x="11" y="21" font-family="Georgia, serif" font-weight="700" font-size="6" fill="${P.mid}" text-anchor="middle" transform="rotate(180 11 18.9)">${n}</text>`
  )
}

export const TRUCO_ANCHOS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // Tu primer vale cuatro: el siete bravo, con el pulso que tiembla.
  'Siete bravo': (u) => {
    const k = kit(u)
    const mini = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r})">${thinSword(40)}</g>`
    return (
      k.day() +
      k.sun(60, 58, 17, 42) +
      `<g transform="translate(60 60) rotate(-6)">` +
      k.cast([roundRect(-17, -26, 17, 26, 2.4)], 2.4, 2.2) +
      spanishCard(k, '7') +
      k.clip(roundRect(-14, -23, 14, 23, 1), mini(-9.6, 0, 26) + mini(-3.2, 0, 26) + mini(3.2, 0, 26) + mini(9.6, 0, 26) + mini(-6.4, 0, -26) + mini(0, 0, -26) + mini(6.4, 0, -26)) +
      `</g>` +
      hair(33, 44, 30.6, 52, 33, 60, 0.8) + hair(29.4, 47, 27, 54, 29.4, 61, 0.6) + hair(87, 56, 89.4, 64, 87, 72, 0.8) + hair(90.6, 59, 93, 66, 90.6, 73, 0.6) +
      sparkle(84, 36, 2.4) + sparkle(36, 80, 1.6) +
      k.defs()
    )
  },

  // Cinco vale cuatro: el basto que ya no le tiene miedo a subir la parada.
  'Ancho de bastos': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 56, 17, 46) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      laurel(50, 98, 32, 86, 30, 60) + laurel(70, 98, 88, 86, 90, 60, 7, true) +
      `<g transform="translate(60 58) rotate(18) scale(.84)">` + k.cast([clubPath()], 2.6, 2.2) + club(k) + `</g>` +
      sparkle(36, 36, 2.6) + sparkle(86, 40, 1.8) +
      k.defs()
    )
  },

  // Quince vale cuatro: sos la carta que mata a todas.
  'Ancho de espadas': (u) => {
    const k = kit(u)
    // La cinta da una vuelta a la hoja: la parte de atrás va antes de la espada y la de adelante después.
    const ribbonBack = 'M55 44.6C59 43 63 41.8 66 42.4L66 47C63 46.4 59 47.6 55 49.2Z'
    const ribbonFront = 'M42 56.4C48 55.2 56 51.8 66 47V51.8C56 56.6 48 60 42 61.2Z'
    const tailL = 'M42 56.4C38 57.2 35 58.6 32 60.6L35.4 62.2L32.6 65.6C36 64 39 62.2 42 61.2Z'
    const tailR = 'M66 42.4C70 41.4 74 40.4 78.4 37.6L76.4 41.6L80.2 43.6C76 45.6 70 46.6 66 47Z'
    return (
      k.day() +
      k.sun(60, 58, 16, 48) +
      k.shade(ellipse(60, 52, 22, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(52, 99, 30, 90, 27, 62, 8) + laurel(68, 99, 90, 90, 93, 62, 8, true) +
      k.draw([{ d: ribbonBack, fill: P.sky1, inner: k.sh(ribbonBack, 0, 0, 0, 1, 0.3, 0.9, P.blue, 0.4) }], 0.5) +
      `<g transform="translate(60 57.4) scale(1.12)">` + k.cast(['M0 -41L4.6 -30V10H-4.6V-30Z'], 2.2, 2) + sword(k, 1) + `</g>` +
      k.draw([{ d: ribbonFront, fill: P.white, inner: k.sh(ribbonFront, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M46 57.4C52 55.4 58 52.6 64.4 50.2" fill="none" stroke="${P.red}" stroke-width=".8"/>` }], 0.55) +
      k.draw([{ d: tailL, fill: P.white, inner: k.sh(tailL, 0, 0, 0, 1, 0.2, 0.8, P.blue, 0.35) }, { d: tailR, fill: P.white, inner: k.sh(tailR, 0, 0, 0, 1, 0.2, 0.8, P.blue, 0.35) }], 0.5) +
      sparkle(60, 12, 3.6, '#fff') + sparkle(34, 40, 2.2) + sparkle(87, 72, 1.8) +
      k.defs()
    )
  },
}
