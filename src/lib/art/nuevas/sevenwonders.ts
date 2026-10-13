// 7 Wonders, en clave heroica: la Antigüedad en piedra arenisca, bronce y laurel. Manda el ocre de la ficha del juego
// en el catálogo: el grano del papel, la piedra de las maravillas y el bronce de las armas y los instrumentos. A Julio
// César no se lo dibuja: aparece por su corona de laurel. Las maravillas son monumentos, sin cara en primer plano.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** El ocre de la ficha de 7 Wonders (#B08900), con su sombra, su luz y el grano del papel; la arenisca de las piedras. */
const SW = '#B08900', SW_D = '#74540A', SW_L = '#E2C45A', GRAIN = '#C9A73C', PAPER = '#F5EAC6'
/** El bronce del coloso y la madera del escudo: el mismo ocre, más cálido. */
const BRONZE = '#B4842A', BRONZE_D = '#684210', BRONZE_L = '#E8C46E'
const SAND = '#EAD6A2', SAND_D = '#B8985A', SAND_L = '#F7ECCB'
/** El verde de la poción. */
const CHEM = '#6FAE45', CHEM_D = '#3E7428'

/** Papel entonado de ocre, con el grano ocre hacia los bordes. */
const sand = (k: Kit, gx = 0.5, gy = 0.46) => `<rect width="120" height="130" fill="${PAPER}"/>` + k.shade(FULL, k.rad('#D6B54A', gx, gy, 0.7, 0, 1), GRAIN, 0.55)

/** Resplandor dorado suave detrás de algo. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.75) => k.shade(ellipse(cx, cy, rx, ry), k.rad(P.goldL, 0.5, 0.5, 0.5, a, 0), P.goldL, 0.45)

/** Trazo de metal o madera: tinta, color y un filo de luz. */
const rod = (d: string, w: number, c: string, lit: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${lit}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.3 -.3)"/>`

/** Engranaje: dientes trapezoidales alrededor de (cx,cy) y ventanas entre rayos (giradas al revés para que queden huecas). */
function gearPath(cx: number, cy: number, R: number, n: number, phase: number, h: number, holes?: { r1: number; r2: number; count: number; spoke: number }) {
  const step = (Math.PI * 2) / n, hp = step / 2, Rr = R - h / 2, Rt = R + h / 2
  const pt = (a: number, r: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const t = phase + i * step
    pts.push(pt(t - hp * 0.62, Rr), pt(t - hp * 0.3, Rt), pt(t + hp * 0.3, Rt), pt(t + hp * 0.62, Rr), pt(t + hp, Rr))
  }
  let d = `M${pts.join('L')}Z`
  if (holes) {
    const span = (Math.PI * 2) / holes.count
    for (let j = 0; j < holes.count; j++) {
      const a0 = phase + j * span + holes.spoke / 2, a1 = a0 + span - holes.spoke, N = 10
      const o: string[] = [], inn: string[] = []
      for (let q = 0; q <= N; q++) { o.push(pt(a1 - ((a1 - a0) * q) / N, holes.r2)); inn.push(pt(a0 + ((a1 - a0) * q) / N, holes.r1)) }
      d += `M${o.join('L')}L${inn.join('L')}Z`
    }
  }
  return d
}

/** Rama de laurel dorada, hoja por hoja, a lo largo de un arco de círculo (ángulos en grados, de a0 a a1). */
function wreathBranch(cx: number, cy: number, r: number, a0: number, a1: number, n: number) {
  const leaf = 'M0 0C2.4 -2.8 7.6 -3 11 0C7.6 2.8 2.4 2.8 0 0Z'
  const half = 'M0 0C2.4 -2.8 7.6 -3 11 0Z'
  const rad = (a: number) => (a * Math.PI) / 180
  const dir = Math.sign(a1 - a0)
  let stem = ''
  for (let i = 0; i <= 24; i++) { const a = rad(a0 + ((a1 - a0) * i) / 24); stem += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}` }
  let out = `<path d="${stem}" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="${stem}" fill="none" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/>`
  for (let i = 0; i < n; i++) {
    const t = (i + 0.6) / n, a = a0 + (a1 - a0) * t, ar = rad(a)
    const x = cx + Math.cos(ar) * r, y = cy + Math.sin(ar) * r
    const tang = a + 90 * dir, s = 1 - t * 0.3
    for (const side of [-1, 1]) {
      const rot = tang + side * 34
      out += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})"><path d="${leaf}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><path d="${half}" fill="${P.goldL}"/>` +
        `<path d="M1.4 0C4 -.3 7 -.3 9.6 0" fill="none" stroke="${P.goldD}" stroke-width=".45"/></g>`
    }
    if (i % 2 === 1) out += `<circle cx="${f(cx + Math.cos(ar) * (r - 3.4))}" cy="${f(cy + Math.sin(ar) * (r - 3.4))}" r=".9" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".35"/>`
  }
  const tip = rad(a1)
  out += `<g transform="translate(${f(cx + Math.cos(tip) * r)} ${f(cy + Math.sin(tip) * r)}) rotate(${f(a1 + 90 * dir)}) scale(.7)"><path d="${leaf}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><path d="${half}" fill="${P.goldL}"/></g>`
  return out
}

/** Nube de humo con su sombra, centrada en (x,y). */
function puff(k: Kit, x: number, y: number, s: number, r = 0) {
  const d = 'M-9 2C-11 2 -12 0 -10.6 -1.6C-11 -4.6 -7.6 -6 -5.6 -4.4C-4.6 -7.6 0 -8.2 1.6 -5.2C3.6 -7 7.4 -5.6 7 -2.6C9.6 -2.4 10.2 1.6 7.6 2Z'
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.75, P.sky2, 0.45) + hair(-7, 0.4, -1, 1.2, 5, 0.4, 0.4, P.sky2) }], f(0.5 / s)) + `</g>`
}

export const SEVENWONDERS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Laboratorio ────────────────────────────────────────────────────

  // Ganaste a pura ciencia: el tubo de ensayo burbujea, salta el corcho y sale el humo. Explotó algo, pero ganaste.
  'Tubo de ensayo': (u) => {
    const k = kit(u)
    const glass = 'M-6.6 -22V17A6.6 6.6 0 0 0 6.6 17V-22Z'
    const lip = roundRect(-8.2, -24.6, 8.2, -21.6, 1.4)
    const liquid = 'M-5.6 -1.6Q0 .4 5.6 -1.6V17A5.6 5.6 0 0 1 -5.6 17Z'
    const cork = 'M-4.4 -3.4H4.4L3.4 3.4H-3.4Z'
    const burst = starPath(0, 0, 11, 5.4, 9)
    const bubbles = [[-2.6, 12, 1.3], [1.8, 6, 1], [-1, 2, 0.8], [2.6, 14.6, 0.7], [0.4, 10, 0.55]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width=".45"/>`).join('')
    const marks = [-14, -10, -6, -2, 2, 6].map((y, i) => `<path d="M2.4 ${y}H${i % 2 ? 4.4 : 5.4}" stroke="${P.mid}" stroke-width=".4"/>`).join('')
    return (
      sand(k, 0.5, 0.42) +
      k.sun(60, 50, 14, 46, 32, false) +
      `<g transform="translate(62 44) rotate(14)">` + `<path d="${burst}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>` + `<path d="${starPath(0, 0, 6.4, 3.4, 9, -70)}" fill="#fff"/>` + `</g>` +
      k.floor(52, 95, 14, 2.4, SW_D) +
      `<g transform="translate(56 70) rotate(14)">` +
      k.cast([glass], 1.8, 1.4, SW_D) +
      k.draw([
        { d: glass, fill: P.sky1, inner: `<path d="${liquid}" fill="${CHEM}"/>` + k.sh(liquid, 0, 0, 1, 0, 0, 0.9, CHEM_D, 0.5) + `<path d="M-5.6 -1.6Q0 .4 5.6 -1.6Q0 -2.6 -5.6 -1.6Z" fill="#B7DB8C"/>` + bubbles + k.sh('M1 -24H8V26H1Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + marks },
        { d: lip, fill: P.sky1, inner: k.sh(lip, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
      ], 0.7) +
      `<path d="M-4.4 -20V16" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/><path d="M-2.6 -19V-8" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      `<circle cx="1" cy="-6" r="1" fill="none" stroke="${CHEM_D}" stroke-width=".4"/><circle cx="-1.6" cy="-11" r=".7" fill="none" stroke="${CHEM_D}" stroke-width=".4"/>` +
      `</g>` +
      puff(k, 52, 38, 0.86, -8) + puff(k, 68, 34, 0.74, 6) +
      `<g transform="translate(79 42) rotate(38)">` + k.draw([{ d: cork, fill: P.brown, inner: k.sh(cork, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + `<circle cx="-1.4" cy="-.6" r=".5" fill="${P.brownD}"/><circle cx="1.4" cy="1.4" r=".4" fill="${P.brownD}"/>` }], 0.5) + `</g>` +
      hair(71, 48, 74, 46.6, 76.4, 46.6, 0.6) + hair(70.6, 44, 72.6, 42, 74, 39.6, 0.5) +
      `<text x="82" y="59" ${GEORGIA} font-style="italic" font-size="5.6" fill="${P.ink}" transform="rotate(10 82 59)" text-anchor="middle">¡pum!</text>` +
      sparkle(34, 54, 2, '#fff') + sparkle(84, 76, 1.6, '#fff') +
      k.defs()
    )
  },

  // Tres victorias con ruedas, tablillas y compases: el compás se electrizó y tiene los pelos parados.
  'Científico loco': (u) => {
    const k = kit(u)
    const tablet = 'M42 40C48 38.6 64 38.4 70 40C71.6 50 71.8 66 70.4 76C64 77.6 48 77.8 41.6 76C40.4 66 40.4 50 42 40Z'
    const wedges = Array.from({ length: 30 }, (_, i) => {
      const r = Math.floor(i / 6), c = i % 6, x = 45.6 + c * 4 + (r % 2) * 0.8, y = 45.4 + r * 6.4
      return i % 7 === 5 ? '' : `<path d="M${f(x)} ${f(y)}l1.4 .7l-1.4 .7Z M${f(x + 1.2)} ${f(y + 0.7)}h1.8" fill="${SAND_D}" stroke="${SW_D}" stroke-width=".3"/>`
    }).join('')
    const gear = gearPath(41, 76, 11, 10, 0.2, 3.6, { r1: 3.4, r2: 7.4, count: 5, spoke: 0.7 })
    const legL = 'M66 39L52.6 86.4L54.6 87L70 41Z'
    const legR = 'M70 39L83.6 82.4L81.6 83.2L66 41Z'
    const tipL = 'M54 81.6L52.6 86.4L54.6 87L56.2 82.2Z'
    const tipR = 'M80 78L83.6 82.4L81.6 83.2L78.4 79Z'
    const bolt = (pts: number[][]) => {
      const d = `M${pts.map((p) => p.join(' ')).join('L')}`
      return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-linejoin="round" stroke-linecap="round"/>`
    }
    return (
      sand(k, 0.5, 0.48) +
      k.sun(60, 56, 16, 46, 32, false) +
      `<g transform="rotate(-8 56 58)">` + k.cast([tablet], 2.2, 2.2, SW_D) +
      k.draw([{
        d: tablet, fill: SAND,
        inner: k.sh(tablet, 0, 0, 1, 1, 0, 0.9, SAND_D, 0.5) + `<path d="M40 38H50V78H40Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.45, 0)}"/>` + wedges +
          hair(44, 70, 50, 66, 53, 72, 0.4, SAND_D) + `<path d="M43.6 43.6H68.4M43.6 50H68.4M43.6 56.4H68.4M43.6 62.8H68.4M43.6 69.2H68.4" stroke="${SAND_D}" stroke-width=".3" opacity=".7"/>`,
      }], 0.75) + `</g>` +
      k.cast([gear], 1.8, 1.8, SW_D) +
      k.draw([{ d: gear, fill: SW_L, inner: k.sh(gear, 0, 0, 1, 1, 0, 0.95, SW, 0.5) + `<circle cx="41" cy="76" r="8.6" fill="none" stroke="${SW}" stroke-width=".5"/>` }], 0.65) +
      `<circle cx="41" cy="76" r="2.6" fill="${SW}" stroke="${P.ink}" stroke-width=".5"/><circle cx="40.4" cy="75.4" r=".7" fill="${P.goldL}"/>` +
      k.floor(68, 86, 18, 2, SW_D) +
      k.draw([
        { d: legL, fill: P.gold, inner: k.sh(legL, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="${tipL}" fill="${P.sky1}"/>` },
        { d: legR, fill: P.gold, inner: k.sh(legR, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="${tipR}" fill="${P.sky1}"/>` },
      ], 0.6) +
      hair(66.6, 44, 61, 64, 55.4, 82, 0.5, P.goldL) + hair(69.6, 44, 75, 62, 80.6, 77, 0.4, P.goldD) +
      `<path d="M60.4 60.6Q68 64 76.4 60.6" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M60.4 60.6Q68 64 76.4 60.6" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      `<rect x="66.4" y="28.6" width="3.2" height="7" rx="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><path d="M66.6 30.4H69.4M66.6 32H69.4M66.6 33.6H69.4" stroke="${P.goldD}" stroke-width=".35"/>` +
      `<circle cx="68" cy="39" r="4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".7"/><circle cx="68" cy="39" r="2.4" fill="none" stroke="${P.goldD}" stroke-width=".4"/><circle cx="68" cy="39" r="1" fill="${P.goldD}"/><circle cx="66.8" cy="37.8" r=".6" fill="#fff"/>` +
      bolt([[64, 30], [60.6, 28.2], [61.6, 26.4], [57.6, 24]]) + bolt([[68, 27.2], [66.8, 24.6], [68.8, 23.6], [67.8, 21]]) + bolt([[72, 30], [75, 28], [74.2, 26.4], [78, 25.4]]) +
      bolt([[62.4, 35.6], [57.6, 35.8], [58.6, 34], [54, 33]]) + bolt([[73.6, 36], [78, 35], [77.4, 33.4], [82, 33]]) +
      sparkle(34, 44, 1.8, '#fff') + sparkle(88, 68, 1.6, '#fff') + sparkle(56, 20.6, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Siete victorias científicas: la medalla de oro del Nobel con el compás y la rueda en relieve, la cinta celeste y
  // blanca y tres estrellas, como Houssay, Leloir y Milstein juntos.
  'Premio Nobel': (u) => {
    const k = kit(u)
    const cx = 60, cy = 64, R = 22.4
    const disc = ellipse(cx, cy, R, R), field = ellipse(cx, cy, R - 4.6, R - 4.6)
    const ribbon = 'M51.4 14H68.6V40.4L60 44.8L51.4 40.4Z'
    const beads = Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * (R - 2.3))}" cy="${f(cy + Math.sin(a) * (R - 2.3))}" r=".6" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".22"/>` }).join('')
    // Ramitas de laurel en relieve a los costados del campo.
    const sprig = (sx: number) => {
      let s = ''
      for (let i = 0; i < 6; i++) {
        const a = Math.PI * (0.64 - i * 0.12), x = cx + sx * Math.cos(a) * 14.2, y = cy + Math.sin(a) * 14.2
        const deg = (Math.atan2(Math.sin(a), sx * Math.cos(a)) * 180) / Math.PI - 90 * sx
        s += `<path d="M0 0C1 -1.5 3.6 -1.7 5 -.2C3.6 1.1 1.2 1.1 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(deg + sx * 40)})" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".35"/>`
      }
      return s
    }
    const gear = gearPath(cx, cy + 7, 7, 9, 0.2, 2.4, { r1: 2, r2: 4.6, count: 4, spoke: 0.9 })
    const legs = `M${cx - 1.2} ${cy - 7}L${cx - 8.4} ${cy + 12.4}L${cx - 6.6} ${cy + 13}L${cx} ${cy - 3}L${cx + 6.6} ${cy + 13}L${cx + 8.4} ${cy + 12.4}L${cx + 1.2} ${cy - 7}Z`
    // El relieve: la figura en oro, con sombra abajo a la derecha y luz arriba a la izquierda, como acuñada.
    const relief = (d: string, sw = 0.5) => `<path d="${d}" fill="${P.goldD}" transform="translate(.5 .55)" opacity=".7"/><path d="${d}" fill="#fff" transform="translate(-.35 -.35)" opacity=".8"/><path d="${d}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="${sw}" stroke-linejoin="round"/>`
    return (
      sand(k, 0.5, 0.5) +
      k.sun(cx, cy, 18, 50) +
      laurel(52, 100, 30, 92, 27, 64, 8) + laurel(68, 100, 90, 92, 93, 64, 8, true) +
      k.draw([{
        d: ribbon, fill: P.white,
        inner: `<path d="M51.4 14H56V46H51.4ZM64 14H68.6V46H64Z" fill="${P.sky}"/>` + k.sh(ribbon, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + k.sh('M50 30H70V46H50Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
          hair(53, 18, 53.4, 28, 53, 38, 0.4, '#fff') + hair(66, 18, 66.4, 28, 66, 38, 0.4, P.blue),
      }], 0.6) +
      `<circle cx="${cx}" cy="41.4" r="2.6" fill="none" stroke="${P.ink}" stroke-width="2.1"/><circle cx="${cx}" cy="41.4" r="2.6" fill="none" stroke="${P.gold}" stroke-width="1"/>` +
      k.cast([disc], 2.4, 2.4, SW_D) +
      k.draw([
        { d: disc, fill: P.gold, inner: k.sh(disc, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M36 40H50V88H36Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.55, 0)}"/>` },
        { d: field, fill: P.goldL, line: 0.45, inner: k.shade(field, k.rad(P.gold, 0.32, 0.3, 0.8, 0, 0.9), P.gold, 0.35) },
      ], 0.85) +
      beads + `<path d="${ellipse(cx, cy, R - 4.6, R - 4.6)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".7" transform="translate(-.4 -.4)"/>` +
      sprig(-1) + sprig(1) +
      relief(gear, 0.4) + `<circle cx="${cx}" cy="${cy + 7}" r="1.2" fill="${P.goldD}"/>` +
      relief(legs) + relief(ellipse(cx, cy - 7.4, 2.2, 2.2), 0.45) +
      `<path d="M${cx - 5.2} ${cy + 5.6}Q${cx} ${cy + 8.4} ${cx + 5.2} ${cy + 5.6}" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
      [[-7.6, cy - 9], [0, cy - 13.4], [7.6, cy - 9]].map(([dx, y]) => `<path d="${starPath(cx + dx, y, 2.5, 1, 5)}" fill="${P.white}" stroke="${P.goldD}" stroke-width=".4"/>`).join('') +
      `<path d="M44.4 54C46.6 48.6 51.4 45 56.6 44" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>` +
      sparkle(81, 47, 2.6, '#fff') + sparkle(40, 81, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Legión ─────────────────────────────────────────────────────────

  // Ganaste a los escudazos: el escudo redondo de tablas, con el umbo de hierro y dos flechas clavadas.
  'Escudo de madera': (u) => {
    const k = kit(u)
    const cx = 60, cy = 61, R = 25
    const disc = ellipse(cx, cy, R, R)
    const rim = `${ellipse(cx, cy, R, R)} ${ellipse(cx, cy, R - 3, R - 3)}`
    const boss = ellipse(cx, cy, 6.6, 6.6)
    const planks = [-15, -5, 5, 15].map((dx) => `<path d="M${cx + dx} ${cy - 26}V${cy + 26}" stroke="${BRONZE_D}" stroke-width=".7"/>`).join('')
    const grain = [[-19, 0.4], [-11, -0.6], [-2, 0.5], [9, -0.4], [19, 0.6]].map(([x, b]) => hair(cx + x, cy - 20, cx + x + b * 3, cy, cx + x - b, cy + 20, 0.4, BRONZE_D, 0.8)).join('')
    const knot = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="1" ry="1.8" fill="${BRONZE_D}" opacity=".6"/><ellipse cx="${x}" cy="${y}" rx="1.8" ry="3" fill="none" stroke="${BRONZE_D}" stroke-width=".4"/>`
    const rivets = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * (R - 1.5))}" cy="${f(cy + Math.sin(a) * (R - 1.5))}" r=".7" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/>` }).join('')
    const bossRiv = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 8.4)}" cy="${f(cy + Math.sin(a) * 8.4)}" r=".7" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/>` }).join('')
    const arrow = (x: number, y: number, ang: number, len: number) => {
      const a = (ang * Math.PI) / 180, ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len
      const fl = (s: number) => `<path d="M0 0L-5 ${f(s * 2.6)}L-8 ${f(s * 2.6)}L-3.6 0Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>`
      return rod(`M${x} ${y}L${f(ex)} ${f(ey)}`, 1.1, P.brown, P.goldL) +
        `<g transform="translate(${f(ex)} ${f(ey)}) rotate(${ang + 180})">${fl(1)}${fl(-1)}<path d="M-1 0H-7" stroke="${P.white}" stroke-width=".5"/></g>` +
        `<path d="M${f(x - 2)} ${f(y - 1)}L${f(x + 1.6)} ${f(y + 1.4)}M${f(x - 1.4)} ${f(y + 1.8)}L${f(x + 1)} ${f(y - 1.6)}" stroke="${BRONZE_D}" stroke-width=".5"/>`
    }
    return (
      sand(k, 0.5, 0.46) +
      k.sun(cx, cy, 20, 47, 32, false) +
      k.floor(62, 88, 22, 2.4, BRONZE_D) +
      k.cast([disc], 2.6, 2.4, BRONZE_D) +
      k.draw([{
        d: disc, fill: BRONZE_L,
        inner: `<path d="M${cx - 10} 30H${cx}V92H${cx - 10}ZM${cx + 10} 30H${cx + 20}V92H${cx + 10}Z" fill="${BRONZE}" opacity=".35"/>` + planks + grain + knot(52, 74) + knot(68, 46) +
          k.sh(disc, 0, 0, 1, 1, 0, 0.9, BRONZE_D, 0.5) + `<path d="M34 34H48V90H34Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          hair(44, 70, 47, 68, 49, 71, 0.6, BRONZE_D) + hair(72, 74, 74, 71, 77, 72, 0.5, BRONZE_D),
      }], 0.85) +
      `<path d="${rim}" fill-rule="evenodd" fill="${P.mid}"/>` + k.clip(disc, k.sh(disc, 0, 0, 1, 1, 0, 0.9, P.night, 0.45)) + `<path d="${rim}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M39 48A23 23 0 0 1 52 37" fill="none" stroke="${P.sky}" stroke-width="1" stroke-linecap="round"/>` + rivets + bossRiv +
      k.draw([{ d: boss, fill: P.sky1, inner: k.sh(boss, 0, 0, 1, 1, 0, 0.95, P.mid, 0.5) + `<ellipse cx="${cx - 2.2}" cy="${cy - 2.4}" rx="2.2" ry="1.2" fill="#fff" transform="rotate(-40 ${cx - 2.2} ${cy - 2.4})"/>` }], 0.7) +
      arrow(46, 49, -142, 17) + arrow(73, 71, -18, 15) +
      sparkle(86, 36, 2.2, '#fff') + sparkle(32, 80, 1.6, '#fff') +
      k.defs()
    )
  },

  // Tres victorias militares: el casco del centurión, de tres cuartos, con su cresta de crin cruzada y la vara de vid.
  'Centurión': (u) => {
    const k = kit(u)
    const crest = 'M40.4 46C38.4 34 46.6 22.4 60 22.4C73.4 22.4 81.6 34 79.6 46C74 42 67 40 60 40C53 40 46 42 40.4 46Z'
    const bowl = 'M42.6 58.6C41.6 46 49 37 60.6 37C71.4 37 78.8 45 79 56.4L79.2 60.6C70 62.6 53 62.4 42.6 58.6Z'
    const neck = 'M70.6 59.6C76.6 60 82.6 59.4 86.4 58.2C88.8 61.8 90.2 67.2 89.4 71.2C83.8 70.2 77.2 68.2 72 65.4Z'
    const brow = 'M42.2 55.2C50.6 58.4 62.6 59.4 73 58.6L73.2 62.6C62.6 63.4 50.6 62.4 42 59.2Z'
    const peak = 'M42.8 58.2C39.8 59 37.6 60.4 37.6 61.8C41 61.9 44.6 61.4 47.4 60.4Z'
    const cheek = 'M47 61C46 67.6 46.8 74.6 50 80.4C51.6 83 54.8 82.6 56 80C57.4 74.6 58 68.2 57.4 61.8Z'
    const face = 'M43.2 60.2C43.6 66 45 71.4 47.6 76.2C46.4 71 46.2 66 47 61.2Z'
    const ear = 'M60.6 62.6C62.8 62.4 64.8 63.8 64.8 66.2C62.6 66.8 60.8 65.4 60.6 62.6Z'
    const skirt = 'M56.6 61C62 61.8 67 61.8 72.6 61L72.8 65.6C67.6 67.4 62.6 67.8 57.6 67.2Z'
    const plume = Array.from({ length: 21 }, (_, i) => {
      const a = Math.PI * (1.06 + (i / 20) * 0.88), x1 = 60 + Math.cos(a) * 21, y1 = 46 + Math.sin(a) * 23
      return hair(60 + Math.cos(a) * 6, 46 + Math.sin(a) * 6, 60 + Math.cos(a + 0.05) * 13, 46 + Math.sin(a + 0.05) * 14, x1, y1, i % 2 ? 0.5 : 0.65, i % 3 ? P.wine : '#E8786C', 0.9)
    }).join('')
    const rivet = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r=".85" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - 0.3)}" cy="${f(y - 0.3)}" r=".3" fill="#fff"/>`
    const vitis = taper(30, 92, 58, 62, 90, 30, 3, 2.2)
    return (
      sand(k, 0.5, 0.44) +
      k.sun(60, 54, 18, 47, 32, false) +
      `<path d="${vitis}" fill="${P.brown}" stroke="${P.ink}" stroke-width=".8"/>` + hair(33, 87.6, 58, 60, 87, 32.4, 0.5, P.brownD) +
      [[37, 84.6], [44.6, 76.6], [76, 44], [83.4, 36.8]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.9" ry="1" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".4" transform="rotate(-45 ${x} ${y})"/>`).join('') +
      `<circle cx="89.6" cy="30.4" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.floor(64, 86, 24, 2.6, SW_D) +
      k.draw([
        { d: crest, fill: P.red, inner: k.sh(crest, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + plume },
        {
          d: neck, fill: P.sky1,
          inner: k.sh(neck, 0, 0, 1, 1, 0.1, 0.95, P.mid, 0.5) + `<path d="M72 62.4C78 63 84 62.4 87.6 61.2M72.4 64C78 64.8 84.4 64.4 88.4 63.4" fill="none" stroke="${P.blue}" stroke-width=".5"/>` +
            `<path d="M72 65.4C77.2 68.2 83.8 70.2 89.4 71.2" fill="none" stroke="${P.gold}" stroke-width="1.2"/>`,
        },
        { d: skirt, fill: P.sky1, inner: k.sh(skirt, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<path d="M57.8 66.4C62.6 67 67.6 66.6 72.6 64.8" fill="none" stroke="${P.gold}" stroke-width=".8"/>` },
        {
          d: bowl, fill: P.white,
          inner: k.sh(bowl, 0, 0, 1, 1, 0, 0.95, P.blue, 0.5) + `<path d="M42 36H54V62H42Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.85, 0)}"/>` +
            hair(46.4, 53, 47.6, 45, 53, 39.6, 1, '#fff') + `<circle cx="68" cy="50" r="3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(68, 50, 2.2, 0.9, 8)}" fill="${P.goldL}"/>` +
            hair(71, 44, 75, 49, 76.6, 56, 0.45, P.mid),
        },
        { d: face, fill: P.night },
        { d: cheek, fill: P.white, inner: k.sh(cheek, 0, 0, 1, 1, 0, 0.85, P.blue, 0.45) + `<path d="M48.8 64C48.4 70 49.4 75.4 51.8 79.2" fill="none" stroke="${P.gold}" stroke-width=".7"/>` + hair(54.6, 64, 55.6, 70, 54.4, 77, 0.5, P.mid) },
        { d: brow, fill: P.gold, inner: k.sh(brow, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M42.2 57.4C50.6 60.6 62.6 61.4 73.1 60.6" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: peak, fill: P.gold, inner: k.sh(peak, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) },
      ], 0.8) +
      `<path d="${ear}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M44.4 47C50 40.6 56 38.6 61 38.6C67 38.6 73 41 77.4 46.6" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M44.4 47C50 40.6 56 38.6 61 38.6C67 38.6 73 41 77.4 46.6" fill="none" stroke="${P.gold}" stroke-width="1.3" stroke-linecap="round"/>` +
      rivet(48.6, 59.6) + rivet(55.6, 61.2) + rivet(52.4, 81) + rivet(66, 61.6) + rivet(76.4, 67.6) + rivet(84.6, 69.6) +
      `<circle cx="61" cy="38.6" r="1.5" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(32, 40, 2, '#fff') + sparkle(88, 50, 1.6, '#fff') +
      k.defs()
    )
  },

  // Siete victorias militares: llegaste, viste y venciste. La corona de laurel de oro, con la cinta roja.
  'Julio César': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58, r = 24
    const field = ellipse(cx, cy, 16.6, 16.6)
    const bowL = 'M60 83C56 79 50 78.4 49.4 81.6C48.8 85 54.6 86 60 83Z'
    const bowR = 'M60 83C64 79 70 78.4 70.6 81.6C71.2 85 65.4 86 60 83Z'
    const tailL = 'M58.6 83.6C56.4 87 53.4 90.4 50 93L52.6 95.4L54.2 92.4C56.6 90 58.6 87 60 84Z'
    const tailR = 'M61.4 83.6C63.6 87 66.6 90.4 70 93L67.4 95.4L65.8 92.4C63.4 90 61.4 87 60 84Z'
    const knot = ellipse(60, 83, 2.2, 1.9)
    const lines = ['VENI', 'VIDI', 'VICI'].map((w, i) => `<text x="${cx}" y="${f(cy - 5 + i * 6.4)}" ${GEORGIA} font-size="5.6" letter-spacing=".6" fill="${P.goldL}" text-anchor="middle">${w}</text>`).join('')
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` + k.shade(FULL, k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.85), P.night, 0.6) +
      k.sun(cx, cy, 20, 50, 36, false) +
      glow(k, cx, cy, 30, 30, 0.5) +
      k.draw([{ d: field, fill: P.wine, inner: k.shade(field, k.rad(P.night, 0.4, 0.35, 0.7, 0, 0.8), '#3A0F1A', 0.5) }], 0.6) +
      `<path d="${ellipse(cx, cy, 14.6, 14.6)}" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` +
      lines + `<path d="M${cx - 6} ${cy + 10.4}H${cx + 6}" stroke="${P.gold}" stroke-width=".5"/><path d="M${cx - 6} ${cy - 11.4}H${cx + 6}" stroke="${P.gold}" stroke-width=".5"/>` +
      wreathBranch(cx, cy, r, 100, 248, 9) + wreathBranch(cx, cy, r, 80, -68, 9) +
      k.draw([
        { d: tailL, fill: P.red, inner: k.sh(tailL, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) },
        { d: tailR, fill: P.red, inner: k.sh(tailR, 0, 0, 1, 1, 0.2, 0.9, P.wine, 0.5) },
        { d: bowL, fill: P.red, inner: k.sh(bowL, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) },
        { d: bowR, fill: P.red, inner: k.sh(bowR, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) },
        { d: knot, fill: P.red, inner: k.sh(knot, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
      ], 0.55) +
      sparkle(cx, 22, 3, P.goldL) + sparkle(30, 44, 2, P.goldL) + sparkle(90, 72, 1.8, P.goldL) +
      k.defs()
    )
  },

  // ── Maravilla del mundo ────────────────────────────────────────────

  // Cincuenta puntos: los cimientos están. El sillar de arenisca con la pirámide tallada y la maza de cantero.
  'Primera piedra': (u) => {
    const k = kit(u)
    const front = 'M38.4 59L72 59.6L71.6 88.4L38.6 88Z'
    const top = 'M38.4 59L49.6 51.4L83.4 51.8L72 59.6Z'
    const side = 'M72 59.6L83.4 51.8L83 80.6L71.6 88.4Z'
    const chisel = (x: number, y: number) => hair(x, y, x + 0.6, y + 1.2, x + 0.2, y + 2.6, 0.5, SAND_D)
    const marks = [[42, 64], [47, 82], [64, 64], [66, 82], [44, 74], [69, 72]].map(([x, y]) => chisel(x, y) + chisel(x + 1.6, y + 0.2) + chisel(x + 3.2, y)).join('')
    const pyr = 'M55.4 63.6L65.2 80.4H45.6Z'
    const head = 'M-5.6 -5.2C-2 -6 2 -6 5.6 -5.2C7 -1.8 7 1.8 5.6 5.2C2 6 -2 6 -5.6 5.2C-7 1.8 -7 -1.8 -5.6 -5.2Z'
    const handle = 'M4.6 -1.3L23 -2.2C24.2 -2.2 24.8 -1.4 24.8 0C24.8 1.4 24.2 2.2 23 2.2L4.6 1.3Z'
    return (
      sand(k, 0.5, 0.46) +
      k.sun(60, 58, 16, 47, 32, false) +
      k.floor(62, 89, 28, 3, SW_D) +
      k.cast([front, side], 2.2, 2, SW_D) +
      k.draw([
        { d: side, fill: SAND_D, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, SW_D, 0.45) + hair(76, 62, 77, 70, 76, 80, 0.4, SW_D) + hair(80, 58, 80.6, 66, 79.8, 74, 0.35, SW_D) },
        { d: top, fill: SAND_L, inner: k.sh(top, 0, 0, 1, 0, 0, 0.5, SAND_D, 0.4) + hair(46, 56, 58, 54.6, 74, 55.4, 0.35, SAND_D) },
        {
          d: front, fill: SAND,
          inner: k.sh(front, 0, 0, 1, 1, 0, 0.75, SAND_D, 0.45) + `<path d="M38 59H46V89H38Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.4, 0)}"/>` + marks +
            `<path d="${roundRect(42.2, 61.6, 68.4, 85.6, 0.6)}" fill="none" stroke="${SAND_D}" stroke-width=".7"/><path d="${roundRect(42.8, 62.2, 69, 86.2, 0.6)}" fill="none" stroke="${SAND_L}" stroke-width=".5"/>`,
        },
      ], 0.8) +
      `<path d="${pyr}" fill="${SAND_D}" opacity=".5"/><path d="${pyr}" fill="none" stroke="${SW_D}" stroke-width=".6" stroke-linejoin="round"/><path d="M55.4 63.6L65.2 80.4" stroke="${SAND_L}" stroke-width=".6" transform="translate(.6 0)"/>` +
      `<path d="M52.4 68.8H58.4M50 73H60.8M47.6 77.2H63.2" stroke="${SW_D}" stroke-width=".4"/>` +
      `<text x="55.4" y="85" ${GEORGIA} font-size="3.6" letter-spacing=".8" fill="${SW_D}" text-anchor="middle">I</text>` +
      // La maza de cantero, de madera, apoyada arriba del sillar.
      `<g transform="translate(58.6 50.4) rotate(-14)">` + k.floor(9, 3.6, 16, 2, SW_D) +
      k.draw([
        { d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + hair(7, -0.4, 15, -0.9, 23, -0.6, 0.4, P.goldL) },
        { d: head, fill: P.brown, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M-6 -6H-1V6H-6Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.6, 0)}"/>` + `<path d="M-6.4 -2.6C-2 -3.4 2 -3.4 6.4 -2.6M-6.4 2.6C-2 3.4 2 3.4 6.4 2.6" fill="none" stroke="${P.mid}" stroke-width="1.1"/>` + hair(-3, -4.4, 0, -5, 3, -4.4, 0.4, P.brownD) },
      ], 0.6) +
      `<ellipse cx="6" cy="0" rx="1.2" ry="5.2" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="6" cy="0" rx=".5" ry="2.6" fill="none" stroke="${P.brown}" stroke-width=".3"/>` +
      `</g>` +
      `<circle cx="40" cy="91" r=".9" fill="${SAND_D}" stroke="${P.ink}" stroke-width=".3"/><circle cx="84" cy="84" r=".7" fill="${SAND_D}" stroke="${P.ink}" stroke-width=".3"/>` +
      sparkle(34, 42, 2.2, '#fff') + sparkle(88, 40, 1.8, '#fff') +
      k.defs()
    )
  },

  // Sesenta y cinco puntos: te ven desde el puerto. Del coloso sólo entran las piernas de bronce, plantadas a los dos
  // lados de la boca del puerto, y el barco que pasa chiquito entre ellas.
  'Coloso de Rodas': (u) => {
    const k = kit(u)
    const legL = 'M46 6C43.4 20 37.4 36 36 49C35 59.6 37.4 70 37.6 77.6H46C45.8 70.4 47 63 48.2 56C50 45 54.6 26 59 6Z'
    const footL = 'M36.4 77.4H46.4C47.2 78.8 48.4 80.2 49.8 81.2C50.6 81.8 50.4 82.8 49.4 82.8H35C34.6 80.8 35.2 78.6 36.4 77.4Z'
    const mirrorX = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${f(120 - Number(x))} ${y}`)
    const legR = mirrorX(legL), footR = mirrorX(footL)
    const sea = 'M0 84Q30 82.6 60 84T120 84V130H0Z'
    const pedL = 'M30.6 82.6H53.4L54.4 98H29.6Z', pedR = 'M66.6 82.6H89.4L90.4 98H65.6Z'
    const hull = 'M51.6 89.4H68.4C67.6 91.4 65.8 93 63 93.2H57C54.4 93 52.4 91.4 51.6 89.4Z'
    const sail = 'M55.6 79Q60 80 64.4 79L63.8 87Q60 88 56.2 87Z'
    const bronze = (d: string, dark = 0.9) => ({ d, fill: BRONZE, inner: k.sh(d, 0, 0, 1, 0, 0, dark, BRONZE_D, 0.55) + `<path d="M30 4H44V100H30Z" fill="${k.lin(BRONZE_L, 0, 0, 1, 0, 0.75, 0)}"/><path d="M74 4H86V100H74Z" fill="${k.lin(BRONZE_L, 0, 0, 1, 0, 0.55, 0)}"/>` })
    const straps = (sx: number) => `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)"><path d="M37.6 73.4Q41.8 75 46 73M37.4 77.4Q42 79 46.4 77.2M40.6 78.4L44.6 82.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M37.6 73.4Q41.8 75 46 73M37.4 77.4Q42 79 46.4 77.2M40.6 78.4L44.6 82.4" fill="none" stroke="${P.gold}" stroke-width=".8"/></g>`
    const muscle = (sx: number) => `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)">` + hair(44, 14, 40, 26, 38.6, 40, 0.6, BRONZE_L) + hair(52, 20, 49.4, 32, 48.4, 42, 0.5, BRONZE_D) + hair(39.6, 45.4, 42.6, 47.6, 47, 46.4, 0.55, BRONZE_D) + hair(38.6, 54, 39.6, 62, 39.4, 70, 0.5, BRONZE_L) + hair(44.4, 56, 43.6, 62, 44, 68, 0.4, BRONZE_D) + `</g>`
    return (
      sand(k, 0.5, 0.42) +
      k.sun(60, 50, 16, 50, 32, false) +
      `<circle cx="60" cy="50" r="15" fill="${P.goldL}" opacity=".85"/>` + k.shade(ellipse(60, 50, 15, 15), k.rad(P.gold, 0.5, 0.5, 0.5, 0, 0.8), P.gold, 0.4) +
      k.draw([{ d: sea, fill: P.sky, inner: k.sh(sea, 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + hair(14, 88, 22, 87, 28, 88.4, 0.5, '#fff') + hair(92, 88.6, 100, 87.6, 106, 88.6, 0.5, '#fff') + hair(40, 99, 50, 98, 58, 99.4, 0.45, P.mid) }], 0.5) +
      k.draw([
        { d: pedL, fill: SAND, inner: k.sh(pedL, 0, 0, 1, 0, 0, 0.8, SAND_D, 0.5) + `<path d="M30 87H53.8M30 91.6H54" stroke="${SAND_D}" stroke-width=".5"/>` },
        { d: pedR, fill: SAND, inner: k.sh(pedR, 0, 0, 1, 0, 0, 0.9, SAND_D, 0.5) + `<path d="M66 87H90M66 91.6H90.2" stroke="${SAND_D}" stroke-width=".5"/>` },
      ], 0.6) +
      k.draw([bronze(legL), bronze(footL), bronze(legR, 0.95), bronze(footR, 0.95)], 0.65) +
      straps(1) + straps(-1) + muscle(1) + muscle(-1) +
      // El barco que pasa por la boca del puerto, chiquito al lado de los pies.
      `<path d="M60 89.6V77.2" stroke="${P.ink}" stroke-width="1.3"/><path d="M60 89.6V77.2" stroke="${P.brown}" stroke-width=".5"/>` +
      k.draw([
        { d: sail, fill: P.white, inner: k.sh(sail, 0, 0, 1, 0, 0, 0.7, P.sky2, 0.4) + `<path d="M56 82.6Q60 83.6 64 82.6V84.2Q60 85.2 56 84.2Z" fill="${P.red}"/>` },
        { d: hull, fill: P.brown, inner: k.sh(hull, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M52.6 90.6H67.6" stroke="${P.goldL}" stroke-width=".4"/>` },
      ], 0.45) +
      `<path d="M60 77.2L63.6 78.2L60 79Z" fill="${P.red}"/>` +
      hair(49, 92.6, 46, 93.4, 42, 93, 0.45, '#fff') + hair(71, 92.6, 74, 93.4, 78, 93, 0.45, '#fff') +
      sparkle(60, 24, 2.6, '#fff') + sparkle(84, 40, 1.6, '#fff') +
      k.defs()
    )
  },

  // Ochenta puntos: iluminás a toda la mesa (y la encandilás). El faro de tres cuerpos sobre su isla, de noche, con el
  // fuego arriba y los haces de luz que barren el cielo.
  'Faro de Alejandría': (u) => {
    const k = kit(u)
    const podium = 'M36.4 92.4V86.6H83.6V92.4Z'
    const step = 'M40.4 86.6V83.4H79.6V86.6Z'
    const base = 'M46.4 83.4L48.4 55.4H71.6L73.6 83.4Z'
    const corn1 = 'M45 55.6H75V52H45Z'
    const mid = 'M50.8 52L52 38.8H68L69.2 52Z'
    const corn2 = 'M49.8 39H70.2V36H49.8Z'
    const lantern = 'M53.6 36V29H66.4V36Z'
    const cap = 'M52.6 29.4H67.4L64.6 26C63 24 57 24 55.4 26Z'
    const sea = 'M0 90Q30 88.6 60 90T120 90V130H0Z'
    const courses = (x0: number, x1: number, y0: number, y1: number, h: number, c: string) => {
      let d = ''
      for (let y = y0 + h, r = 0; y < y1 - 0.5; y += h, r++) {
        d += `M${x0} ${f(y)}H${x1}`
        for (let x = x0 + (r % 2 ? 3 : 1.4); x < x1; x += 4.4) d += `M${f(x)} ${f(y)}V${f(y + h)}`
      }
      return `<path d="${d}" stroke="${c}" stroke-width=".35" opacity=".75"/>`
    }
    const win = (x: number, y: number, h = 3.4) => `<path d="M${f(x - 0.9)} ${f(y + h)}V${f(y + 0.9)}A.9 .9 0 0 1 ${f(x + 0.9)} ${f(y + 0.9)}V${f(y + h)}Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/><path d="M${f(x - 0.9)} ${f(y + h)}H${f(x + 0.9)}" stroke="${P.goldL}" stroke-width=".35"/>`
    const dentils = (x0: number, x1: number, y: number) => { let d = ''; for (let x = x0 + 0.8; x < x1 - 0.6; x += 1.6) d += `M${f(x)} ${y}v1.1`; return `<path d="${d}" stroke="${SW_D}" stroke-width=".7"/>` }
    const beamL = 'M57 31L4 10V56L57 35.4Z', beamR = 'M63 31L116 14V60L63 35.4Z'
    const coreL = 'M57 32.2L10 24V38L57 34.2Z', coreR = 'M63 32.2L110 28V42L63 34.2Z'
    const stars = [[24, 66, 0.6], [34, 78, 0.45], [88, 70, 0.5], [96, 76, 0.4], [30, 88, 0.4], [90, 86, 0.45], [42, 18, 0.4], [78, 18, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
    const triton = (x: number, s: number) => `<path d="M${x} 52C${f(x - s * 0.4)} 48.6 ${f(x - s * 2.6)} 46.6 ${f(x - s * 4)} 47.6C${f(x - s * 2.6)} 48.4 ${f(x - s * 1.6)} 50 ${f(x - s * 1.4)} 52Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/><circle cx="${f(x - s * 4)}" cy="47.6" r=".6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`
    return (
      k.night() + stars +
      `<path d="${beamL}" fill="${k.lin(P.goldL, 1, 0, 0, 0, 1, 0.3)}"/>` + k.shade(beamL, k.lin(P.gold, 1, 0, 0, 0, 0.7, 0), P.gold, 0.2) +
      `<path d="${beamR}" fill="${k.lin(P.goldL, 0, 0, 1, 0, 1, 0.3)}"/>` + k.shade(beamR, k.lin(P.gold, 0, 0, 1, 0, 0.7, 0), P.gold, 0.2) +
      `<path d="${coreL}" fill="${k.lin('#fff', 1, 0, 0, 0, 0.9, 0)}"/><path d="${coreR}" fill="${k.lin('#fff', 0, 0, 1, 0, 0.9, 0)}"/>` +
      hair(50, 31, 30, 24, 8, 18, 0.5, '#fff', 0.6) + hair(70, 31, 90, 26, 112, 22, 0.5, '#fff', 0.6) +
      k.shade(ellipse(60, 33, 30, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.45) +
      k.draw([{ d: sea, fill: P.mid, inner: k.sh(sea, 0, 0, 0, 1, 0, 0.8, P.night, 0.5) + hair(20, 94, 28, 93, 36, 94.4, 0.5, P.sky) + hair(84, 94.4, 92, 93.4, 100, 94.4, 0.5, P.sky) + `<path d="M40 92.6H80" stroke="${P.goldL}" stroke-width=".6" stroke-dasharray="3 2" opacity=".7"/>` }], 0.5) +
      k.draw([
        { d: podium, fill: SAND_D, inner: k.sh(podium, 0, 0, 1, 1, 0, 0.8, SW_D, 0.5) + courses(36, 84, 86.6, 92.4, 2.9, SW_D) },
        { d: step, fill: SAND, inner: k.sh(step, 0, 0, 1, 0, 0, 0.7, SW_D, 0.45) },
        {
          d: base, fill: SAND,
          inner: courses(46, 74, 55.4, 83.4, 3.4, SAND_D) + k.sh(base, 0, 0, 1, 0, 0, 0.85, SW_D, 0.5) + k.sh(base, 0, 0, 0, 1, 0, 0.55, P.night, 0.4) +
            `<path d="M48.4 55.4H54V84H46.4Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.75, 0)}"/>` + `<path d="M50.6 55.6L49 83.4M69.4 55.6L71 83.4" stroke="${SW_D}" stroke-width=".5"/>` +
            win(60, 59) + win(60, 66.6) + win(60, 74.2) + win(54.4, 62.8) + win(65.6, 62.8) + win(54.2, 70.4) + win(65.8, 70.4) +
            `<path d="M57.4 83.4V79.6A2.6 2.6 0 0 1 62.6 79.6V83.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>`,
        },
        { d: corn1, fill: SW_L, inner: k.sh(corn1, 0, 0, 1, 0, 0, 0.8, SW, 0.45) + dentils(45, 75, 54.2) + `<path d="M45 53H75" stroke="${SW}" stroke-width=".4"/>` },
        {
          d: mid, fill: SAND,
          inner: courses(50, 70, 38.8, 52, 3.3, SAND_D) + k.sh(mid, 0, 0, 1, 0, 0, 0.85, SW_D, 0.5) + `<path d="M55.4 38.8V52M64.6 38.8V52" stroke="${SW_D}" stroke-width=".55"/>` +
            `<path d="M50 38H55.4V53H50Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` + win(60, 42) + win(60, 47.2, 3),
        },
        { d: corn2, fill: SW_L, inner: k.sh(corn2, 0, 0, 1, 0, 0, 0.8, SW, 0.45) + dentils(50, 70, 37.6) },
        { d: lantern, fill: P.goldL, inner: k.shade(lantern, k.rad('#fff', 0.5, 0.6, 0.6, 1, 0), '#fff', 0.5) },
        { d: cap, fill: BRONZE, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.9, BRONZE_D, 0.5) + `<path d="M55.4 26C57 25 63 25 64.6 26" fill="none" stroke="${BRONZE_L}" stroke-width=".5"/>` },
      ], 0.75) +
      triton(45, 1) + triton(75, -1) +
      flame(k, 'translate(60 36.2) scale(.1) translate(-60 -90)') +
      `<path d="M56.6 29V36M63.4 29V36" stroke="${P.ink}" stroke-width="1.6"/><path d="M56.6 29V36M63.4 29V36" stroke="${SW_L}" stroke-width=".7"/>` +
      `<path d="M60 24.6V20.4" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M60 24.6V20.4" stroke="${BRONZE_L}" stroke-width=".6" stroke-linecap="round"/><circle cx="60" cy="20" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      sparkle(60, 32.4, 6.4, '#fff') + sparkle(28, 44, 1.6, P.goldL) + sparkle(92, 48, 1.6, P.goldL) +
      k.defs()
    )
  },
}
