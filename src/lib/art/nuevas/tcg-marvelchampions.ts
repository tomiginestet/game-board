// Marvel Champions: la historieta cooperativa. Color propio: el carmín de la ficha (#C2255C), con la trama de puntos
// de las revistas de kiosco y el estallido de viñeta. Nada de la marca: ni escudos, ni logos, ni personajes reales.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const CRIM = '#C2255C', CRIM_L = '#E2709A', CRIM_D = '#7E1238'

/** Trama de puntos de historieta que crecen del centro hacia los bordes. */
function halftone(cx: number, cy: number, r0: number, r1: number, color: string, op = 0.5, step = 3.4) {
  let d = ''
  let row = 0
  for (let y = 14; y <= 108; y += step * 0.866, row++) {
    for (let x = 14 + (row % 2) * step * 0.5; x <= 106; x += step) {
      const t = Math.min(1, Math.max(0, (Math.hypot(x - cx, y - cy) - r0) / (r1 - r0))), r = t * step * 0.42
      if (r > 0.18) d += `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`
    }
  }
  return `<path d="${d}" fill="${color}" opacity="${op}"/>`
}

/** Estallido de viñeta: estrella de puntas desparejas. */
function burstPath(cx: number, cy: number, R: number, r: number, n: number, rot = 0) {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, rr = i % 2 ? r * (i % 3 ? 1 : 0.9) : R * (i % 4 === 0 ? 1 : 0.84)
    d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * rr) + ' ' + f(cy + Math.sin(a) * rr)
  }
  return d + 'Z'
}

/** Fondo de historieta: papel, trama carmín en los bordes y, si hay, el estallido dorado detrás del protagonista. */
function comicBg(k: Kit, burst?: { cx: number; cy: number; R: number; r: number; n: number; rot?: number }) {
  return (
    `<rect width="120" height="130" fill="${P.paper}"/>` +
    k.shade('M0 0H120V130H0Z', k.rad(CRIM_L, 0.5, 0.46, 0.7, 0, 0.7), CRIM_L, 0.3) +
    halftone(60, 58, 18, 50, CRIM, 0.55) +
    (burst
      ? k.draw([{ d: burstPath(burst.cx, burst.cy, burst.R, burst.r, burst.n, burst.rot), fill: P.goldL, inner: k.shade(burstPath(burst.cx, burst.cy, burst.R, burst.r, burst.n, burst.rot), k.rad(P.gold, 0.5, 0.5, 0.5, 0, 0.95), P.goldD, 0.4) }], 0.6) +
        `<path d="${burstPath(burst.cx, burst.cy, burst.R * 0.72, burst.r * 0.74, burst.n, (burst.rot ?? 0) + 6)}" fill="${P.white}" opacity=".75"/>`
      : '')
  )
}

/** Antifaz de héroe (sin cara: los ojos son huecos), centrado en (0,0) y de 60 de ancho. Las cintas van atrás. */
const MASK =
  'M0 -6.6C5.6 -10.6 15.4 -12.8 24.4 -11C28.8 -10.2 31 -7 30 -2.6C28.8 3.6 24.4 9.8 16.4 11.4C9.8 12.8 4 10 0 6C-4 10 -9.8 12.8 -16.4 11.4C-24.4 9.8 -28.8 3.6 -30 -2.6C-31 -7 -28.8 -10.2 -24.4 -11C-15.4 -12.8 -5.6 -10.6 0 -6.6Z'
const EYE_L = 'M-22 -.4C-21.4 1.2 -20.2 2.6 -18.4 3.2C-13.6 4.4 -8.4 1.8 -7.2 -2.6C-12.4 -5.6 -19.4 -4.4 -22 -.4Z'
const EYE_R = 'M7.2 -2.6C8.4 1.8 13.6 4.4 18.4 3.2C20.2 2.6 21.4 1.2 22 -.4C19.4 -4.4 12.4 -5.6 7.2 -2.6Z'
function domino(k: Kit, c: string, cD: string, s = 1, ties = true) {
  const d = MASK + EYE_L + EYE_R
  const w = (n: number) => f(n / s)
  const tieA = 'M-28.6 -5.4C-33 -6 -37 -4.4 -40.4 -.8L-37.4 -.2L-39 3C-35.4 .4 -32 -1 -28.4 -1.4Z'
  const tieB = 'M-28.4 -2C-31.6 .6 -33.6 4.4 -34.4 9.4L-32.2 7.8L-31.2 10.8C-30.4 6 -29 2.6 -27 .4Z'
  const tie = (sx: number) =>
    `<g transform="scale(${sx} 1)">` +
    k.draw([
      { d: tieB, fill: cD, inner: k.sh(tieB, 0, 0, 1, 1, 0, 0.6, P.night, 0.4) },
      { d: tieA, fill: c, inner: k.sh(tieA, 0, 0, 0, 1, 0, 0.8, cD, 0.5) + hair(-30, -4, -34, -4.4, -38, -1.6, 0.35, cD) },
      { d: ellipse(-29, -3.2, 2.2, 2.8), fill: cD },
    ], 0.5 / s) +
    `</g>`
  return (
    `<g transform="scale(${s})">` +
    (ties ? tie(1) + tie(-1) : '') +
    k.draw([{
      d, fill: c,
      inner:
        k.sh(MASK, 0, 0, 1, 1, 0, 0.95, cD, 0.5) +
        `<path d="M-32 -14H6V-6C-6 -8.6 -22 -6.6 -32 -1Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` +
        `<path d="${MASK}" fill="none" stroke="${P.goldL}" stroke-width="${w(0.45)}" stroke-dasharray="1.2 .9" transform="scale(.9) translate(0 .3)" opacity=".9"/>` +
        `<path d="${EYE_L}${EYE_R}" fill="none" stroke="${cD}" stroke-width="${w(1.6)}"/>` +
        hair(0, -4.6, 0.8, 0, 0, 4.8, 0.6, cD) +
        hair(-26, -6, -20, -9, -12, -8.6, 0.55, '#fff', 0.8) + hair(12, -8.6, 18, -9.4, 24, -8, 0.45, '#fff', 0.6),
    }], 0.7 / s) +
    `</g>`
  )
}

/** Escudo redondo propio (rodela): canto de acero con remaches, campo carmín con una gloria grabada y umbo dorado. */
function roundShield(k: Kit) {
  const rim = ellipse(0, 0, 22, 22)
  const field = ellipse(0, 0, 17.4, 17.4)
  const ring = ellipse(0, 0, 7.6, 7.6)
  const boss = ellipse(0, 0, 5.2, 5.2)
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2, w = i % 2 ? 0.05 : 0.09, r1 = i % 2 ? 13.4 : 16
    return `M${f(Math.cos(a - w) * 8.4)} ${f(Math.sin(a - w) * 8.4)}L${f(Math.cos(a) * r1)} ${f(Math.sin(a) * r1)}L${f(Math.cos(a + w) * 8.4)} ${f(Math.sin(a + w) * 8.4)}Z`
  }).join('')
  const rivets = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + 0.26, x = Math.cos(a) * 19.7, y = Math.sin(a) * 19.7
    return `<circle cx="${f(x)}" cy="${f(y)}" r=".95" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - 0.3)}" cy="${f(y - 0.3)}" r=".3" fill="#fff"/>`
  }).join('')
  return (
    k.draw([{
      d: rim, fill: P.sky1,
      inner: k.sh(rim, 0, 0, 1, 1, 0, 0.95, P.blue, 0.5) + `<path d="M-21 -6A22 22 0 0 1 -6 -21" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>` + rivets,
    }], 0.75) +
    k.draw([{
      d: field, fill: CRIM,
      inner: k.sh(field, 0, 0, 1, 1, 0, 0.95, CRIM_D, 0.5) + `<path d="${rays}" fill="${P.gold}" opacity=".9"/>` + k.sh(field, 0, 0, 1, 1, 0, 0.6, CRIM_D, 0.25) +
        `<circle cx="0" cy="0" r="16.2" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
        `<path d="M-15 -6A16 16 0 0 1 -6 -15" fill="none" stroke="${CRIM_L}" stroke-width="1.2" stroke-linecap="round"/>`,
    }], 0.45) +
    k.draw([{ d: ring, fill: P.sky1, inner: k.sh(ring, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) }], 0.4) +
    k.draw([{ d: boss, fill: P.gold, inner: k.sh(boss, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<circle cx="0" cy="0" r="3.4" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.4) +
    `<path d="M-3 -1.6A3.4 3.4 0 0 1 -1 -3.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>`
  )
}

/** Tomo encuadernado parado con la base en (0,0): lomo redondeado, nervios dorados y la etiqueta con el número. */
function tome(k: Kit, w: number, h: number, c: string, cD: string, n: string) {
  const d = `M0 0V${f(-h + 1.6)}C0 ${f(-h + 0.4)} ${f(w * 0.25)} ${f(-h)} ${f(w / 2)} ${f(-h)}C${f(w * 0.75)} ${f(-h)} ${w} ${f(-h + 0.4)} ${w} ${f(-h + 1.6)}V0Z`
  const band = (y: number) => `<path d="M0 ${f(y)}H${w}" stroke="${P.ink}" stroke-width="1.5"/><path d="M0 ${f(y)}H${w}" stroke="${P.gold}" stroke-width=".8"/><path d="M0 ${f(y - 0.3)}H${w}" stroke="${P.goldL}" stroke-width=".25"/>`
  const lab = roundRect(f(w * 0.16), f(-h * 0.64), f(w * 0.84), f(-h * 0.46), 0.6)
  return (
    k.draw([{
      d, fill: c,
      inner: `<path d="M0 ${-h}H${f(w * 0.36)}V0H0Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` + k.sh(`M${f(w * 0.5)} ${-h}H${w}V0H${f(w * 0.5)}Z`, 0, 0, 1, 0, 0, 0.9, cD, 0.45) +
        band(-h + 4.4) + band(-h + 7) + band(-5.4) + band(-2.8) +
        `<path d="${lab}" fill="${P.paper}" stroke="${P.goldD}" stroke-width=".35"/>` +
        `<text x="${f(w / 2)}" y="${f(-h * 0.515)}" font-family="Georgia, serif" font-weight="700" font-size="3.2" fill="${P.ink}" text-anchor="middle">${n}</text>` +
        `<path d="M${f(w * 0.3)} ${f(-h * 0.36)}H${f(w * 0.7)}M${f(w * 0.3)} ${f(-h * 0.3)}H${f(w * 0.7)}" stroke="${P.goldL}" stroke-width=".4"/>`,
    }], 0.55)
  )
}

export const TCG_MARVELCHAMPIONS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Vengadores ─────────────────────────────────────────────────────

  // Tres villanos: el antifaz te queda pintado. El antifaz carmín, con las cintas al viento, sobre el estallido de viñeta.
  'Antifaz de héroe': (u) => {
    const k = kit(u)
    return (
      comicBg(k, { cx: 60, cy: 58, R: 40, r: 25, n: 13, rot: -8 }) +
      `<g transform="translate(61.6 61.6) scale(.9)">` + k.cast([MASK + EYE_L + EYE_R], 2, 2, CRIM_D) + `</g>` +
      `<g transform="translate(60 59.6) scale(.9)">` + domino(k, CRIM, CRIM_D) + `</g>` +
      sparkle(84, 80, 2.4, '#fff') + sparkle(34, 76, 1.8, '#fff') +
      k.defs()
    )
  },

  // Quince villanos: tirás el escudo y vuelve solo a la mano. La rodela en el aire y la estela que da la vuelta.
  'Escudo del Capitán': (u) => {
    const k = kit(u)
    const loop = taper(66, 34, 104, 44, 84, 80, 0.6, 4.4)
    const head = 'M77.6 86.4L86.8 76.4L89.4 87.2Z'
    return (
      comicBg(k) +
      k.sun(56, 58, 16, 44, 28, false) +
      // Estela de vuelta, por detrás.
      k.draw([{ d: loop, fill: P.white, inner: k.sh(loop, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.5) }], 0.55) +
      k.draw([{ d: head, fill: P.white, inner: k.sh(head, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) }], 0.55) +
      hair(22, 52, 27, 49, 33, 48.6, 0.8, P.mid) + hair(20, 60, 26, 58.6, 32, 59, 0.9, P.mid) + hair(22, 68, 27, 68.2, 32, 69.6, 0.8, P.mid) +
      `<g transform="translate(56 59) rotate(-16) scale(1.12 .94)">` +
      `<path d="${ellipse(1.4, 2.2, 22, 22)}" fill="${P.blue}" stroke="${P.ink}" stroke-width="1.3"/>` +
      `<path d="${ellipse(1.4, 2.2, 22, 22)}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0, 0.9)}"/>` +
      roundShield(k) +
      `</g>` +
      sparkle(36, 34, 2.4, '#fff') + sparkle(88, 30, 1.8, '#fff') + sparkle(32, 82, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Cuarenta villanos: la torre tiene tu nombre en la puerta. Rascacielos art déco con su aguja, bajo la gloria.
  'Torre de los Vengadores': (u) => {
    const k = kit(u)
    // Bloques escalonados (frente y costado en fuga), de abajo hacia arriba. Coordenadas absolutas.
    const B: [number, number, number, number, number, number][] = [[38, 78, 80, 98, 6, 8], [42, 74, 60, 80, 5.4, 6], [46, 70, 44, 60, 4.6, 5], [49.6, 66.4, 32.4, 44, 3.8, 4]]
    const front = ([x0, x1, y0, y1]: number[]) => `M${x0} ${y1}V${y0}H${x1}V${y1}Z`
    const side = ([, x1, y0, y1, dx]: number[]) => `M${x1} ${y1}V${y0}L${f(x1 + dx)} ${f(y0 - dx * 0.45)}V${f(y1 - dx * 0.45)}Z`
    // Fachada déco: pilares continuos, tiras de ventanas y enjutas carmín en cada piso; algunas ventanas encendidas.
    const facade = ([x0, x1, y0, y1, , n]: number[], seed: number) => {
      const w = (x1 - x0) / n
      let out = ''
      for (let i = 0; i < n; i++) {
        const xa = x0 + w * 0.24 + i * w, xb = x0 + w * 0.76 + i * w
        out += `<path d="M${f(xa)} ${f(y0 + 1.8)}H${f(xb)}V${f(y1 - 1.4)}H${f(xa)}Z" fill="${P.mid}"/>`
        for (let y = y0 + 4.4, j = 0; y < y1 - 2; y += 3.4, j++) {
          out += `<path d="M${f(xa)} ${f(y)}H${f(xb)}" stroke="${CRIM_D}" stroke-width="1"/>`
          if ((i * 7 + j * 3 + seed) % 5 === 0) out += `<path d="M${f(xa + 0.3)} ${f(y - 2.6)}H${f(xb - 0.3)}V${f(y - 0.6)}H${f(xa + 0.3)}Z" fill="${P.goldL}"/>`
        }
        out += `<path d="M${f(xa + 0.4)} ${f(y0 + 1.8)}V${f(y1 - 1.4)}" stroke="${P.sky}" stroke-width=".35"/>`
      }
      return out + `<path d="M${x0} ${y0}H${x1}V${f(y0 + 1.4)}H${x0}Z" fill="${P.sky2}"/>`
    }
    const cornice = ([x0, x1, y0, , dx]: number[]) =>
      `<path d="M${f(x0 - 0.8)} ${f(y0 + 0.4)}V${f(y0 - 1)}H${f(x1 + 0.6)}L${f(x1 + dx + 0.6)} ${f(y0 - 1 - dx * 0.45)}V${f(y0 + 0.4 - dx * 0.45)}L${f(x1 + 0.6)} ${f(y0 + 0.4)}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    // Corona: tres arcos escalonados con ventanas en triángulo, como los rascacielos de los años treinta.
    const arch = (r: number, y: number) => `M${f(58 - r)} ${y}V${f(y - r * 0.5)}A${r} ${f(r * 1.05)} 0 0 1 ${f(58 + r)} ${f(y - r * 0.5)}V${y}Z`
    const tri = (r: number, y: number, c: string) =>
      Array.from({ length: 5 }, (_, i) => { const a = Math.PI + (i + 0.5) * (Math.PI / 5), x = 58 + Math.cos(a) * r * 0.62, yy = y - r * 0.5 + Math.sin(a) * r * 0.66; return `<path d="M${f(x - 0.6)} ${f(yy + 0.9)}L${f(x)} ${f(yy - 0.9)}L${f(x + 0.6)} ${f(yy + 0.9)}Z" fill="${c}"/>` }).join('')
    const beam = (x: number, a: number) => `<path d="M${x} 32L${f(x + Math.cos(a - 0.06) * 80)} ${f(32 + Math.sin(a - 0.06) * 80)}L${f(x + Math.cos(a + 0.06) * 80)} ${f(32 + Math.sin(a + 0.06) * 80)}Z" fill="${k.lin(P.white, 0, 0, 1, 1, 0.9, 0)}" opacity=".75"/>`
    const door = 'M53.8 98V89.4C53.8 86.2 55.6 84.4 58 84.4C60.4 84.4 62.2 86.2 62.2 89.4V98Z'
    const pennant = 'M58.6 20.4L65.4 22.3L58.6 24.2Z'
    return (
      comicBg(k) +
      k.sun(58, 34, 12, 48, 32, false) +
      beam(58, -2.55) + beam(58, -0.6) +
      k.floor(60, 98, 30, 3, CRIM_D) +
      B.map((b) => k.draw([{ d: side(b), fill: P.sky, inner: k.sh(side(b), 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) + `<path d="M${f(b[1] + b[4] * 0.5)} ${f(b[2] + 1)}V${f(b[3] - 1)}" stroke="${P.blue}" stroke-width=".5"/>` }], 0.6)).join('') +
      k.draw(B.map((b, i) => ({ d: front(b), fill: P.white, inner: facade(b, i) + k.sh(front(b), 0, 0, 1, 1, 0, 0.55, P.sky2, 0.35) + `<path d="M${b[0]} ${b[2]}h3.4v${f(b[3] - b[2])}h-3.4Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` })), 0.65) +
      B.map(cornice).join('') +
      // Corona y aguja.
      k.draw([
        { d: arch(6.6, 32.6), fill: P.gold, inner: k.sh(arch(6.6, 32.6), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + tri(6.6, 32.6, P.night) },
        { d: arch(4.4, 29.8), fill: P.goldL, inner: k.sh(arch(4.4, 29.8), 0, 0, 1, 0, 0, 0.8, P.gold, 0.5) + tri(4.4, 29.8, P.mid) },
        { d: arch(2.4, 27.2), fill: P.gold, inner: k.sh(arch(2.4, 27.2), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
      ], 0.45) +
      `<path d="M58 25.6V18.4" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M58 25.6V18.4" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      k.draw([{ d: pennant, fill: CRIM, inner: k.sh(pennant, 0, 0, 1, 1, 0, 0.8, CRIM_D, 0.4) }], 0.4) +
      `<circle cx="58" cy="18.6" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
      // La puerta, con la plaquita del nombre arriba.
      k.draw([{ d: door, fill: P.gold, inner: k.sh(door, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M58 84.4V98M55.4 91H60.6" stroke="${P.goldD}" stroke-width=".45"/>` + `<path d="${starPath(58, 88.4, 1.8, 0.7, 8)}" fill="${P.goldL}"/>` }], 0.5) +
      `<path d="M51.4 80.6H64.6V83.4H51.4Z" fill="${CRIM}" stroke="${P.ink}" stroke-width=".4"/><path d="M53.2 82H62.8" stroke="${P.goldL}" stroke-width=".55" stroke-dasharray="1.2 .5"/>` +
      sparkle(86, 26, 2.4, '#fff') + sparkle(30, 44, 1.8, '#fff') + sparkle(92, 60, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Lector de historietas ──────────────────────────────────────────

  // Cinco partidas: tu primera historieta, doblada en el bolsillo de atrás del jean.
  'Revista de kiosco': (u) => {
    const k = kit(u)
    const pocket = 'M32 62.4L88 58.6L86.6 85L60 95.6L34.2 87.4Z'
    const comic = 'M-15 0V-38.4C-10 -40.4 -5 -41 0 -40.8C5 -41 10 -40.4 15 -38.4V0Z'
    const twill = Array.from({ length: 30 }, (_, i) => `<path d="M${-20 + i * 5} 0L${-60 + i * 5} 130" stroke="${P.night}" stroke-width=".6" opacity=".35"/>`).join('')
    const stitch = (d: string) => `<path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-dasharray="1.6 1"/>`
    const rivet = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="1.7" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${x}" cy="${y}" r=".9" fill="${P.gold}"/><circle cx="${f(x - 0.4)}" cy="${f(y - 0.4)}" r=".35" fill="#fff"/>`
    return (
      `<rect width="120" height="130" fill="${P.mid}"/>` + twill + k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.5, 0.7, 0, 0.9), P.night, 0.4) +
      halftone(60, 50, 8, 60, P.sky, 0.25, 3) +
      // Costura del canesú.
      `<path d="M14 40C40 34 80 32 106 36" fill="none" stroke="${P.night}" stroke-width="1.2" opacity=".6"/>` + stitch('M14 38.4C40 32.4 80 30.4 106 34.4') + stitch('M14 41.8C40 35.8 80 33.8 106 37.8') +
      // La historieta enrollada asomando.
      `<g transform="translate(60 72) rotate(9)">` +
      k.cast([comic], 2, 1.4, P.night) +
      k.draw([{
        d: comic, fill: P.goldL,
        inner:
          `<path d="M-16 -30H16V0H-16Z" fill="${k.lin(P.sky, 0, 0, 0, 1, 0, 0.8)}"/>` +
          `<path d="M-16 -42H16V-31H-16Z" fill="${CRIM}"/>` + k.sh('M-16 -42H16V-31H-16Z', 0, 0, 0, 1, 0, 0.6, CRIM_D, 0.4) +
          `<path d="M-11 -38.4H-3.6V-33.4H-11ZM-1.6 -38.6H2.4V-33.4H-1.6ZM4.4 -38.4H11.4V-33.4H4.4Z" fill="${P.white}"/>` +
          `<path d="M-14 -30H-8V-24H-14Z" fill="${P.paper}" stroke="${P.ink}" stroke-width=".35"/><text x="-11" y="-25.6" font-family="Georgia, serif" font-weight="700" font-size="3.2" fill="${P.ink}" text-anchor="middle">1</text>` +
          `<path d="${burstPath(3, -16, 11, 6.4, 10, 4)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><path d="${burstPath(3, -16, 7.6, 4.6, 10, 10)}" fill="${P.goldL}"/>` +
          `<text x="3.2" y="-14.2" font-family="Georgia, serif" font-weight="700" font-style="italic" font-size="5" fill="${CRIM_D}" text-anchor="middle">¡paf!</text>` +
          halftone(60, 58, 0, 40, CRIM, 0.3, 2.2).replace('<path', `<path transform="translate(-60 -74)"`) +
          // Cilindro: la revista está enrollada.
          k.sh('M5 -42H16V0H5Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + k.sh('M-16 -42H-8V0H-16Z', 1, 0, 0, 0, 0, 0.6, P.blue, 0.35) +
          `<path d="M-8 -40.4V0" stroke="#fff" stroke-width="1.2" opacity=".7"/>` + hair(6, -30, 7, -18, 6, -4, 0.45, P.blue),
      }], 0.7) +
      `<path d="M-15 -38.4C-10 -36.6 -5 -36 0 -36.2C5 -36 10 -36.6 15 -38.4" fill="none" stroke="${P.sky2}" stroke-width=".5"/>` +
      `</g>` +
      // El bolsillo, cosido encima.
      k.cast([pocket], 1.6, 1.8, P.night) +
      k.draw([{
        d: pocket, fill: P.blue,
        inner: `<g opacity=".7">${twill}</g>` + k.sh(pocket, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + k.sh('M30 58H90V68H30Z', 0, 1, 0, 0, 0, 0.7, P.night, 0.4) +
          stitch('M34.4 64.6L85.8 61.2') + stitch('M34.8 67.2L85.6 63.8') + stitch('M35.6 70L36.6 85.4L60 93L84.4 83.6L85.4 66.6') +
          hair(44, 76, 48, 80, 54, 82, 0.5, P.sky) + hair(70, 78, 74, 76, 78, 72, 0.45, P.night),
      }], 0.7) +
      rivet(34, 63.6) + rivet(86, 60) +
      sparkle(88, 26, 2.4, '#fff') + sparkle(30, 48, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Veinticinco partidas: el estante lleno de tomos con lomo de colores, y el último apoyado en el sujetalibros.
  'Colección encuadernada': (u) => {
    const k = kit(u)
    const plank = 'M24 85.6H96V91.4H24Z'
    const end = 'M80.6 85.6V54.6C80.6 52.6 82 51.4 84 51.4H85.6C87.4 51.4 88.6 52.6 88.6 54.6V85.6Z'
    const books: [number, number, number, string, string, string][] = [
      [28, 9, 40, CRIM, CRIM_D, 'I'], [37, 8, 44, P.mid, P.ink, 'II'], [45, 9.4, 38, P.gold, P.goldD, 'III'],
      [54.4, 8, 45, P.green, P.greenD, 'IV'], [62.4, 8.6, 41.4, CRIM_D, P.wine, 'V'],
    ]
    return (
      comicBg(k) +
      k.shade(ellipse(58, 60, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.sun(58, 56, 16, 44, 28, false) +
      k.floor(58, 86, 34, 2.4, CRIM_D) +
      books.map(([x, w, h, c, cD, n]) => `<g transform="translate(${x} 85.6)">${tome(k, w, h, c, cD, n)}</g>`).join('') +
      // El sexto tomo, inclinado contra el sujetalibros.
      `<g transform="translate(71 85.6) rotate(15)">` + tome(k, 9.6, 40.4, P.sky, P.blue, 'VI') + `</g>` +
      k.draw([{ d: end, fill: P.gold, inner: k.sh(end, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M82 54V84" stroke="${P.goldL}" stroke-width=".7"/>` }], 0.6) +
      `<circle cx="84.6" cy="62" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="84.6" cy="62" r="1.6" fill="${CRIM}" stroke="${P.ink}" stroke-width=".3"/><circle cx="84" cy="61.4" r=".5" fill="#fff"/>` +
      `<path d="M81.6 70C83 72 86 72 87.6 70M81.6 74C83 76 86 76 87.6 74" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` +
      // El estante, con sus ménsulas.
      k.draw([
        { d: plank, fill: P.brown, inner: k.sh(plank, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M24 86.6H96" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>` + hair(34, 88.6, 46, 88, 58, 88.8, 0.4, P.brownD) + hair(64, 89.4, 76, 88.6, 90, 89.2, 0.4, P.brownD) },
        { d: 'M34 91.4H38.4L38.4 93.4C37 96 35.4 96.6 34 96.6Z', fill: P.brownD },
        { d: 'M82 91.4H86.4L86.4 93.4C85 96 83.4 96.6 82 96.6Z', fill: P.brownD },
      ], 0.6) +
      sparkle(32, 34, 2.2, '#fff') + sparkle(88, 40, 1.8, '#fff') +
      k.defs()
    )
  },

  // Setenta y cinco partidas: jugaste con todas las versiones de vos mismo. Antifaces de todos los colores entran en espiral al portal.
  'Multiverso': (u) => {
    const k = kit(u)
    const cx = 60, cy = 56
    const arm = (a0: number, c: string, op: number) => {
      const N = 40, L: string[] = [], R: string[] = []
      for (let i = 0; i <= N; i++) {
        const t = i / N, a = a0 + t * Math.PI * 2.2, r = 2 + 31 * Math.pow(t, 1.15), w = 0.3 + 3.4 * t
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.94, nx = Math.cos(a), ny = Math.sin(a)
        L.push(`${f(x + nx * w * 0.5)} ${f(y + ny * w * 0.5)}`)
        R.push(`${f(x - nx * w * 0.5)} ${f(y - ny * w * 0.5)}`)
      }
      return `<path d="M${L.join('L')}L${R.reverse().join('L')}Z" fill="${c}" opacity="${op}"/>`
    }
    const portal = ellipse(cx, cy, 33, 31)
    const masks: [number, number, number, number, string, string][] = []
    const cols: [string, string][] = [[CRIM, CRIM_D], [P.gold, P.goldD], [P.green, P.greenD], [P.sky, P.mid], [P.white, P.blue]]
    for (let i = 0; i < 5; i++) {
      const a = ((125 - i * 100) * Math.PI) / 180, r = 26 * Math.pow(0.66, i)
      masks.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.56 * Math.pow(0.72, i), -14 + i * 22, cols[i][0], cols[i][1]])
    }
    const studs = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 33)}" cy="${f(cy + Math.sin(a) * 31)}" r=".7" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>` }).join('')
    const stars = [[24, 30, 0.6], [94, 26, 0.55], [98, 64, 0.45], [20, 66, 0.5], [88, 90, 0.5], [30, 92, 0.45], [74, 16, 0.4]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
    return (
      k.night() +
      k.shade(ellipse(cx, cy, 46, 44), k.rad(CRIM, 0.5, 0.5, 0.5, 0.9, 0), CRIM, 0.35) +
      stars +
      k.sun(cx, cy, 30, 48, 36, false) +
      k.draw([{
        d: portal, fill: P.night,
        inner: `<path d="${portal}" fill="${k.rad(CRIM_D, 0.5, 0.5, 0.55, 0.2, 1)}"/>` +
          arm(0, CRIM, 0.85) + arm(Math.PI * 0.4, P.gold, 0.7) + arm(Math.PI * 0.8, CRIM_L, 0.6) + arm(Math.PI * 1.2, P.mid, 0.8) + arm(Math.PI * 1.6, P.goldL, 0.55) +
          Array.from({ length: 10 }, (_, j) => {
            const a0 = j * 0.63 + 0.3, pts: string[] = []
            for (let i = 0; i <= 24; i++) { const t = i / 24, a = a0 + t * Math.PI * 1.6, r = 4 + 28 * Math.pow(t, 1.1); pts.push(`${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r * 0.94)}`) }
            return `<path d="M${pts.join('L')}" fill="none" stroke="${j % 2 ? P.goldL : '#fff'}" stroke-width=".35" opacity=".55"/>`
          }).join('') +
          k.shade(ellipse(cx, cy, 14, 13), k.rad('#ffffff', 0.5, 0.5, 0.5, 1, 0), P.goldL, 0.7) +
          `<circle cx="${cx}" cy="${cy}" r="3" fill="#fff"/>`,
      }], 0.75) +
      `<path d="${portal}" fill="none" stroke="${P.gold}" stroke-width="2.2"/><path d="${portal}" fill="none" stroke="${P.goldL}" stroke-width=".6" transform="translate(-.4 -.4)"/>` + studs +
      masks.slice().reverse().map(([x, y, s, r, c, cD]) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${r})">${domino(k, c, cD, f(s), s > 0.3)}</g>`).join('') +
      sparkle(cx, cy, 4.6, '#fff') + sparkle(88, 36, 2.2, P.goldL) + sparkle(30, 40, 1.8, P.goldL) +
      k.defs()
    )
  },
}
