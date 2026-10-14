// Pool: los objetos del bar. Las bolas numeradas (lisas, rayadas, la blanca y la negra), el taco con su suela azul
// y sus puntas de marquetería, el cubito de tiza, la mesa de paño verde con la baranda de madera y las troneras, la
// ficha de bronce de la mesa y, para las mesas limpias, la escoba, la franela y la aspiradora.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { cylSide, FELT, FELT_D, FELT_L, glow, NEGRA, NEGRA_D, rotulo, stars, stream, WOOD, WOOD_D, WOOD_G, WOOD_L } from './_bar-piezas'

/** Sombra de cada color de bola. */
const DARK: Record<string, string> = { [P.gold]: P.goldD, [P.mid]: P.ink, [P.red]: P.wine, [P.goldD]: P.brownD, [P.wine]: '#3A0F1A', [NEGRA]: NEGRA_D, [P.white]: P.blue, [FELT]: FELT_D }

// ── Piezas del pool ──────────────────────────────────────────────────

/** Bola de pool: lisa del color, rayada (banda del color sobre blanco), la blanca o la negra; con el círculo del número. */
function poolBall(k: Kit, x: number, y: number, r: number, o: { c?: string; n?: number; stripe?: boolean; rot?: number; spot?: [number, number] } = {}) {
  const c = o.c ?? P.white, d = ellipse(x, y, r, r), dk = DARK[c] ?? P.ink
  const [sx, sy] = o.spot ?? [-0.16, -0.18]
  const nx = x + sx * r, ny = y + sy * r, nr = r * 0.42
  const band = o.stripe ? `<path d="M${f(x - r - 1)} ${f(y - r * 0.5)}Q${x} ${f(y - r * 0.62)} ${f(x + r + 1)} ${f(y - r * 0.5)}V${f(y + r * 0.46)}Q${x} ${f(y + r * 0.6)} ${f(x - r - 1)} ${f(y + r * 0.46)}Z" fill="${c}" transform="rotate(${o.rot ?? -14} ${x} ${y})"/>` : ''
  const num = o.n === undefined ? '' :
    `<circle cx="${f(nx)}" cy="${f(ny)}" r="${f(nr)}" fill="${P.white}" stroke="${dk}" stroke-width="${f(r * 0.02)}"/>` +
    `<text x="${f(nx)}" y="${f(ny + nr * 0.42)}" font-family="Georgia, serif" font-weight="700" font-size="${f(nr * 1.25)}" fill="${P.ink}" text-anchor="middle">${o.n}</text>`
  return (
    k.draw([{
      d, fill: o.stripe ? P.white : c,
      inner: band +
        k.sh(d, 0, 0, 1, 1, 0.05, 0.92, o.stripe ? P.blue : dk, 0.5) +
        `<path d="${d}" fill="${k.rad('#ffffff', 0.32, 0.28, 0.5, c === NEGRA ? 0.35 : 0.7, 0)}"/>` + num +
        (o.n === undefined ? '' : k.sh(ellipse(f(nx), f(ny), f(nr), f(nr)), 0, 0, 1, 1, 0, 0.6, P.blue, 0.3)) +
        hair(x + r * 0.2, y + r * 0.86, x + r * 0.78, y + r * 0.62, x + r * 0.9, y + r * 0.05, r * 0.07, c === NEGRA || c === P.mid ? P.sky : P.white, 0.6),
    }], f(Math.min(0.8, 0.3 + r * 0.03))) +
    `<ellipse cx="${f(x - r * 0.45)}" cy="${f(y - r * 0.45)}" rx="${f(r * 0.2)}" ry="${f(r * 0.11)}" fill="#fff" opacity=".95" transform="rotate(-40 ${f(x - r * 0.45)} ${f(y - r * 0.45)})"/>`
  )
}

/** Taco de (x0,y0) (la suela) a (x1,y1) (la culata): suela azul, virola blanca, maple, puntas de marquetería, empuñadura
 * con hilo y culata oscura. `gold` le suma los anillos dorados. */
function cue(k: Kit, x0: number, y0: number, x1: number, y1: number, o: { w0?: number; w1?: number; gold?: boolean; tip?: boolean } = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0), a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI
  const w0 = o.w0 ?? 1.5, w1 = o.w1 ?? 3.6, w = (t: number) => (w0 + (w1 - w0) * (t / L)) / 2
  const seg = (a0: number, a1: number) => `M${f(a0)} ${f(-w(a0))}L${f(a1)} ${f(-w(a1))}L${f(a1)} ${f(w(a1))}L${f(a0)} ${f(w(a0))}Z`
  const out = `M0 ${f(-w(0))}L${f(L)} ${f(-w(L))}Q${f(L + w(L) * 0.7)} 0 ${f(L)} ${f(w(L))}L0 ${f(w(0))}Q-.5 0 0 ${f(-w(0))}Z`
  const fa = L * 0.52, fb = L * 0.7, wr = L * 0.88
  // Puntas de la marquetería: triángulos oscuros que salen de la culata hacia la suela.
  const points = [-1, 1].map((s) => `M${f(fb)} ${f(s * w(fb))}L${f(fa + (fb - fa) * 0.1)} ${f(s * w(fa) * 0.15)}L${f(fb)} ${f(s * w(fb) * 0.1)}Z`).join('') +
    `M${f(fb)} ${f(-w(fb) * 0.45)}L${f(fa + (fb - fa) * 0.35)} 0L${f(fb)} ${f(w(fb) * 0.45)}Z`
  const wrapLines = Array.from({ length: Math.floor((wr - fb) / 1.1) }, (_, i) => `M${f(fb + 0.6 + i * 1.1)} ${f(-w(fb) - 1)}l.6 ${f(w(fb) * 2 + 2)}`).join('')
  const rings = (o.gold ? [fb, wr, L * 0.98] : [fb, wr]).map((t) => `<path d="${seg(t - 0.35, t + 0.35)}" fill="${o.gold ? P.gold : P.white}"/>`).join('')
  return (
    `<g transform="translate(${f(x0)} ${f(y0)}) rotate(${f(a)})">` +
    k.draw([{
      d: out, fill: WOOD_L,
      inner:
        `<path d="${seg(fa, L + 2)}" fill="${WOOD}"/>` +
        `<path d="${points}" fill="${P.wine}"/>` +
        `<path d="${seg(fb, wr)}" fill="${NEGRA}"/><path d="${wrapLines}" stroke="${P.mid}" stroke-width=".35"/>` +
        `<path d="${seg(wr, L + 2)}" fill="${P.wine}"/>` +
        hair(L * 0.08, -w(L * 0.08) * 0.1, L * 0.3, -w(L * 0.3) * 0.3, L * 0.5, -w(L * 0.5) * 0.15, 0.35, WOOD, 0.8) +
        rings +
        `<path d="${seg(0, 3.2)}" fill="${P.white}"/>` + (o.tip === false ? `<path d="${seg(-1, 1.1)}" fill="${WOOD_D}"/>` : `<path d="${seg(-1, 1.1)}" fill="${P.mid}"/>`) +
        `<path d="M-1 0H${f(L + 4)}V8H-1Z" fill="${k.lin(P.ink, 0, 0, 0, 1, 0.05, 0.55)}" opacity=".7"/>` +
        `<path d="M${f(L * 0.06)} ${f(-w(L * 0.06) * 0.45)}L${f(L * 0.96)} ${f(-w(L * 0.96) * 0.5)}" stroke="#fff" stroke-width="${f(w0 * 0.22)}" stroke-linecap="round" opacity=".7"/>`,
    }], 0.5) +
    `</g>`
  )
}

/** Cubito de tiza en isométrica con la arista del frente abajo en (x, y+s/2+h): la tapa gastada en el medio y el
 * papel con la estrella en los costados. */
function chalk(k: Kit, x: number, y: number, s: number, h: number) {
  const C = 0.866, T = [x, y - s * 0.5], R = [x + s * C, y], B = [x, y + s * 0.5], Lf = [x - s * C, y]
  const pt = (p: number[]) => `${f(p[0])} ${f(p[1])}`
  const top = `M${pt(T)}L${pt(R)}L${pt(B)}L${pt(Lf)}Z`
  const left = `M${pt(Lf)}L${pt(B)}L${f(B[0])} ${f(B[1] + h)}L${f(Lf[0])} ${f(Lf[1] + h)}Z`
  const right = `M${pt(B)}L${pt(R)}L${f(R[0])} ${f(R[1] + h)}L${f(B[0])} ${f(B[1] + h)}Z`
  const fl = `matrix(${C} .5 0 1 ${f(Lf[0])} ${f(Lf[1])})`, fr = `matrix(${C} -.5 0 1 ${f(B[0])} ${f(B[1])})`
  const paper = (lit: boolean) =>
    `<path d="M-1 ${f(h * 0.3)}H${f(s + 1)}V${f(h + 1)}H-1Z" fill="${lit ? P.white : P.sky1}"/>` +
    `<path d="M-1 ${f(h * 0.3)}H${f(s + 1)}" stroke="${P.ink}" stroke-width=".35"/>` +
    `<path d="M-1 ${f(h * 0.38)}H${f(s + 1)}M-1 ${f(h * 0.92)}H${f(s + 1)}" stroke="${P.mid}" stroke-width=".7"/>` +
    `<path d="${starPath(s * 0.5, h * 0.6, s * 0.17, s * 0.07, 5)}" fill="${lit ? P.mid : P.blue}"/>`
  const scoop = ellipse(x, f(y + s * 0.02), f(s * 0.5), f(s * 0.27))
  return k.draw([
    { d: left, fill: P.mid, inner: `<g transform="${fl}">${paper(true)}</g>` + k.sh(left, 0, 0, 1, 1, 0, 0.35, P.ink, 0.25) },
    { d: right, fill: P.ink, inner: `<g transform="${fr}">${paper(false)}</g>` + k.sh(right, 0, 0, 1, 0, 0.3, 0.8, P.ink, 0.45) },
    {
      d: top, fill: P.blue,
      inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, P.mid, 0.4) +
        `<path d="${scoop}" fill="${P.mid}"/>` + k.clip(scoop, k.sh(ellipse(x, f(y - s * 0.06), f(s * 0.5), f(s * 0.27)), 0, 0, 0, 1, 0.9, 0, P.night, 0.5)) +
        `<path d="M${f(x - s * 0.46)} ${f(y + s * 0.08)}A${f(s * 0.5)} ${f(s * 0.27)} 0 0 0 ${f(x + s * 0.46)} ${f(y + s * 0.08)}" fill="none" stroke="${P.sky}" stroke-width=".6"/>` +
        hair(Lf[0] + s * 0.18, Lf[1] - s * 0.04, x - s * 0.4, y - s * 0.3, T[0] - s * 0.1, T[1] + s * 0.08, 0.6, P.sky1, 0.9),
    },
  ], 0.6)
}

/** Mesa vista desde el jugador: la baranda de madera con los diamantes (arriba en y0), la banda y el paño hasta abajo.
 * `pockets` son las x de las troneras de la baranda. */
function table(k: Kit, y0: number, o: { pockets?: number[]; tilt?: number } = {}) {
  const rail = `M-10 ${f(y0 - 6.4)}H130V${y0}H-10Z`, band = `M-10 ${y0}H130V${f(y0 + 2.6)}H-10Z`, felt = `M-10 ${f(y0 + 2.6)}H130V140H-10Z`
  const diamonds = [-30, -15, 15, 30].map((dx) => `<path d="M${60 + dx} ${f(y0 - 4.3)}l1.3 1.1l-1.3 1.1l-1.3 -1.1Z" fill="${P.white}" stroke="${WOOD_G}" stroke-width=".25"/>`).join('')
  const pockets = (o.pockets ?? []).map((x) => {
    const hole = `M${f(x - 6.4)} ${f(y0 + 2.6)}C${f(x - 6.4)} ${f(y0 - 6.4)} ${f(x + 6.4)} ${f(y0 - 6.4)} ${f(x + 6.4)} ${f(y0 + 2.6)}Z`
    return `<path d="${hole}" fill="${NEGRA_D}" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="M${f(x - 7.6)} ${f(y0 + 2.6)}C${f(x - 7.6)} ${f(y0 - 8)} ${f(x + 7.6)} ${f(y0 - 8)} ${f(x + 7.6)} ${f(y0 + 2.6)}" fill="none" stroke="${P.ink}" stroke-width="2.6"/>` +
      `<path d="M${f(x - 7.6)} ${f(y0 + 2.6)}C${f(x - 7.6)} ${f(y0 - 8)} ${f(x + 7.6)} ${f(y0 - 8)} ${f(x + 7.6)} ${f(y0 + 2.6)}" fill="none" stroke="${P.brownD}" stroke-width="1.5"/>` +
      `<path d="M${f(x - 6.8)} ${f(y0 - 0.6)}C${f(x - 6)} ${f(y0 - 5.2)} ${f(x - 2)} ${f(y0 - 6.2)} ${f(x + 1)} ${f(y0 - 6.1)}" fill="none" stroke="${P.goldL}" stroke-width=".4" opacity=".8"/>`
  }).join('')
  return (
    k.draw([
      {
        d: felt, fill: FELT,
        inner: k.sh(felt, 0, 0, 0, 1, 0, 0.75, FELT_D, 0.45) + `<path d="M-10 ${f(y0 + 2.6)}H130V${f(y0 + 16)}H-10Z" fill="${k.lin(FELT_D, 0, 0, 0, 1, 0.55, 0)}"/>` +
          Array.from({ length: 22 }, (_, i) => hair(-6 + i * 6.2, y0 + 8 + (i % 3) * 9, -4 + i * 6.2, y0 + 10 + (i % 3) * 9, -1 + i * 6.2, y0 + 9 + (i % 3) * 9, 0.35, FELT_L, 0.5)).join(''),
      },
      { d: band, fill: FELT_D, inner: `<path d="M-10 ${f(y0 + 0.5)}H130" stroke="${FELT_L}" stroke-width=".5" opacity=".7"/>` },
      { d: rail, fill: WOOD, inner: k.sh(rail, 0, 0, 0, 1, 0, 0.8, WOOD_G, 0.45) + `<path d="M-10 ${f(y0 - 5.6)}H130" stroke="${WOOD_L}" stroke-width=".8" opacity=".9"/>` + hair(10, y0 - 3, 40, y0 - 2.4, 70, y0 - 3.4, 0.4, WOOD_D) + hair(64, y0 - 2, 90, y0 - 1.4, 118, y0 - 2.4, 0.4, WOOD_D) + diamonds },
    ], 0.6) +
    pockets
  )
}

/** Moneda parada de frente con el canto asomando a la derecha. */
function coin(k: Kit, x: number, y: number, r: number, inner: string, o: { c?: string; edge?: string; dark?: string; dx?: number } = {}) {
  const c = o.c ?? P.gold, edge = o.edge ?? P.goldD, dark = o.dark ?? P.goldD, dx = o.dx ?? r * 0.16
  const face = ellipse(x, y, r, r)
  const rim = `M${x} ${f(y - r)}H${f(x + dx)}A${r} ${r} 0 0 1 ${f(x + dx)} ${f(y + r)}H${x}Z`
  const ridges = Array.from({ length: 15 }, (_, i) => { const t = -Math.PI / 2 + (i + 0.5) * (Math.PI / 15), yy = y + Math.sin(t) * r; return `M${f(x + Math.cos(t) * r)} ${f(yy)}H${f(x + dx + Math.cos(t) * r)}` }).join('')
  return k.draw([
    { d: rim, fill: edge, inner: `<path d="${ridges}" stroke="#5A3412" stroke-width=".45"/>` + k.sh(rim, 0, 0, 1, 0, 0, 0.7, '#5A3412', 0.4) },
    {
      d: face, fill: c,
      inner: k.sh(face, 0, 0, 1, 1, 0, 0.85, dark, 0.45) + `<path d="${face}" fill="${k.rad('#ffffff', 0.3, 0.28, 0.55, 0.75, 0)}"/>` +
        `<circle cx="${x}" cy="${y}" r="${f(r * 0.84)}" fill="none" stroke="${dark}" stroke-width=".55"/><circle cx="${f(x - 0.25)}" cy="${f(y - 0.25)}" r="${f(r * 0.84)}" fill="none" stroke="#fff" stroke-width=".3" opacity=".7"/>` +
        inner + hair(x - r * 0.66, y - r * 0.2, x - r * 0.55, y - r * 0.68, x - r * 0.1, y - r * 0.82, r * 0.08, '#fff', 0.85),
    },
  ], 0.65)
}

export const POOL_ART: Record<string, (u: number) => string> = {
  // ── Taco de oro ────────────────────────────────────────────────────

  // Cinco ganadas: el cubito de tiza asoma del bolsillo del chaleco, con el polvo azul que se escapa.
  'Tiza azul': (u) => {
    const k = kit(u)
    const vest = 'M10 72C30 68 46 68 60 69C74 68 90 68 110 72V130H10Z'
    const pocket = 'M36 69.4H84V94Q84 99 79 99H41Q36 99 36 94Z'
    const welt = roundRect(34.6, 66.4, 85.4, 72, 1.2)
    const stripes = Array.from({ length: 16 }, (_, i) => `M${f(14 + i * 6)} 66V130`).join('')
    const stitch = `M38.6 73.4V93.4Q38.6 96.4 41.6 96.4H78.4Q81.4 96.4 81.4 93.4V73.4`
    const dust = [[46, 60, 0.9], [76, 62, 0.7], [72, 56, 0.6], [44, 76, 0.5], [70, 80, 0.6], [52, 86, 0.45], [80, 74, 0.5], [40, 64, 0.5], [66, 52, 0.5]]
    return (
      k.day() +
      k.sun(60, 50, 16, 46, 32, true) +
      glow(k, 60, 48, 22, 18, 0.6) +
      `<g transform="rotate(-10 60 64)">` + chalk(k, 61, 40, 19, 34) + `</g>` +
      k.draw([{
        d: vest, fill: P.wine,
        inner: `<path d="${stripes}" stroke="#8C3448" stroke-width=".45"/>` + k.sh(vest, 0, 0, 1, 1, 0, 0.8, '#2E0A16', 0.45) +
          `<path d="M10 72C30 68 46 68 60 69C74 68 90 68 110 72V78C90 74 74 74 60 75C46 74 30 74 10 78Z" fill="${k.lin('#000', 0, 0, 0, 1, 0.35, 0)}"/>`,
      }], 0.7) +
      k.draw([{
        d: pocket, fill: '#7E2B3E',
        inner: `<path d="${stripes}" stroke="#9A4458" stroke-width=".45"/>` + k.sh(pocket, 0, 0, 1, 1, 0, 0.85, '#2E0A16', 0.5) +
          `<path d="${stitch}" fill="none" stroke="${P.goldL}" stroke-width=".55" stroke-dasharray="1.4 .9"/>` +
          hair(42, 82, 50, 86, 60, 85, 0.6, '#2E0A16', 0.7) + hair(62, 88, 70, 90, 78, 87, 0.5, '#2E0A16', 0.6),
      }], 0.7) +
      k.draw([{ d: welt, fill: '#8C3448', inner: k.sh(welt, 0, 0, 0, 1, 0, 0.8, '#2E0A16', 0.45) + `<path d="M36 68.6H84" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray="1.2 .8"/>` }], 0.6) +
      // Polvo de tiza: manchón en el borde del bolsillo y motitas que vuelan.
      k.shade(ellipse(70, 72, 9, 3), k.rad(P.blue, 0.5, 0.5, 0.5, 0.9, 0), P.blue, 0.6) +
      dust.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.blue}" stroke="${P.ink}" stroke-width=".2"/>`).join('') +
      `<path d="M40 94l1.4 -1M42 95.4l1 -1.2" stroke="${P.blue}" stroke-width=".5"/>` +
      sparkle(84, 40, 2.2) + sparkle(34, 50, 1.6) +
      k.defs()
    )
  },

  // Veinte victorias: la ficha de bronce de la mesa parada sobre el paño, y la libreta del bar con el "fiado".
  'Paño verde': (u) => {
    const k = kit(u)
    const note = roundRect(-9.6, -7.4, 9.6, 7.4, 0.6)
    const slot = roundRect(-1.4, -9, 1.4, 9, 1.4)
    return (
      k.day() +
      k.stage(60, 46, 30) +
      table(k, 66, { pockets: [] }) +
      k.floor(62, 84.6, 17, 2.6, FELT_D) +
      coin(k, 64, 60, 17,
        `<path d="${slot}" transform="translate(60 63)" fill="${P.goldD}" stroke="#5A3412" stroke-width=".45"/><path d="M59 55V71" stroke="${P.goldL}" stroke-width=".4" transform="translate(-.2 0)"/>` +
        `<text x="60" y="52.6" font-family="Georgia, serif" font-weight="700" font-size="4.6" letter-spacing=".6" fill="#7A4614" text-anchor="middle">BAR</text>` +
        `<text x="60" y="77.4" font-family="Georgia, serif" font-weight="700" font-size="3.6" letter-spacing=".4" fill="#7A4614" text-anchor="middle">POOL</text>` +
        `<path d="${starPath(48.6, 63, 2, 0.85, 5)}${starPath(71.4, 63, 2, 0.85, 5)}" fill="${P.goldD}"/>`, { dx: 3 }) +
      `<g transform="translate(37 81) rotate(-12) scale(1.1)">` +
      k.draw([{ d: note, fill: P.white, inner: k.sh(note, 0, 0, 1, 1, 0, 0.55, P.blue, 0.35) + `<path d="M-9.6 -3.4H9.6M-9.6 .6H9.6M-9.6 4.6H9.6" stroke="${P.sky}" stroke-width=".3"/><path d="M-6.6 -7.4V7.4" stroke="${P.red}" stroke-width=".35"/>` }], 0.45) +
      rotulo(1.6, -.8, 4.6, 'fiado', { c: P.ink }) +
      `<path d="M-4 3.4V6M-2.8 3.4V6M-1.6 3.4V6M-.4 3.4V6M-4.6 5.4L.2 3.8" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
            sparkle(84, 38, 2.2) + sparkle(36, 44, 1.6) + sparkle(80, 76, 1.4) +
      k.defs()
    )
  },

  // Sesenta ganadas: el salón de noche, la lámpara verde sobre el paño, la negra a la luz y el taco de dos piezas
  // con las puntas de marquetería y los anillos dorados: el de los que saben.
  'El Buscavidas': (u) => {
    const k = kit(u)
    const shade = 'M44 28C44 24.6 50 22.6 60 22.6C70 22.6 76 24.6 76 28L82 38.4C82 40 72 41.4 60 41.4C48 41.4 38 40 38 38.4Z'
    const bulb = ellipse(60, 40, 9, 2)
    const cone = 'M40 39.6L22 104H98L80 39.6Z'
    const scroll = (s: number) => `<g transform="translate(${60 + s * 22} 92) scale(${s} 1)">` +
      `<path d="M0 0C3 -4 9 -4.4 11 -1.4C12.6 1 11 3.6 8.6 3.2C6.8 2.8 6.8 .8 8.2 .4" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M0 0C3 -4 9 -4.4 11 -1.4C12.6 1 11 3.6 8.6 3.2C6.8 2.8 6.8 .8 8.2 .4" fill="none" stroke="${P.gold}" stroke-width="1" stroke-linecap="round"/>` +
      `<path d="M-1 1.6C2 4.4 6 5 8 4.2" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-1 1.6C2 4.4 6 5 8 4.2" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>`
    return (
      k.night() +
      stars([[28, 34], [92, 32], [24, 58, 0.4], [96, 56, 0.4]]) +
      table(k, 78) +
      `<path d="${cone}" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.55, 0.12)}"/>` + k.shade(cone, k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0.05), P.goldL, 0.2) +
      k.shade(ellipse(60, 90, 34, 9), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.goldL, 0.5) +
      `<path d="M60 0V23" stroke="${P.ink}" stroke-width="1.4"/><path d="M60 0V23" stroke="${P.goldD}" stroke-width=".5"/>` +
      cue(k, 84, 60, 28, 100, { gold: true, w0: 1.6, w1: 4 }) +
      k.floor(62, 85, 13, 2.2, NEGRA_D) +
      poolBall(k, 60, 70, 14.5, { c: NEGRA, n: 8 }) +
      k.shade(ellipse(60, 70, 14.5, 14.5), k.rad(P.goldL, 0.5, 0.18, 0.5, 0.55, 0), P.goldL, 0.3) +
      `<path d="${bulb}" fill="${P.goldL}"/>` + glow(k, 60, 41, 12, 4, 0.9, '#fff') +
      k.draw([{
        d: shade, fill: FELT,
        inner: k.sh(shade, 0, 0, 1, 0, 0, 0.85, FELT_D, 0.5) + `<path d="M38 36H82V42H38Z" fill="${FELT_D}"/>` + `<path d="M38 36.4C46 37.6 74 37.6 82 36.4" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
          `<path d="M45 30C48 27.6 53 26.6 57 26.4" fill="none" stroke="${FELT_L}" stroke-width="1.1" stroke-linecap="round"/>` +
          [44, 52, 60, 68, 76].map((x) => `<circle cx="${x}" cy="${f(39.2 + Math.abs(x - 60) * -0.02)}" r=".55" fill="${P.goldL}"/>`).join(''),
      }], 0.7) +
      k.draw([{ d: roundRect(57.4, 19.8, 62.6, 23.4, 0.8), fill: P.gold, inner: k.sh(roundRect(57.4, 19.8, 62.6, 23.4, 0.8), 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) }], 0.4) +
      scroll(1) + scroll(-1) +
      sparkle(76, 60, 2) + sparkle(44, 58, 1.4) + sparkle(54.4, 62.4, 1.2, P.goldL) +
      k.defs()
    )
  },

  // ── Mesa limpia ────────────────────────────────────────────────────

  // La primera mesa limpia: la escoba nueva, con la etiqueta todavía puesta, barre las bolas a la tronera.
  'Escoba nueva': (u) => {
    const k = kit(u)
    const head = 'M-11 -2.6C-6 -4 6 -4 11 -2.6L11.6 3.4C6 2.4 -6 2.4 -11.6 3.4Z'
    const straw = 'M-11.6 3.4C-6 2.4 6 2.4 11.6 3.4C13.4 9 15 14 16.4 19C10 20.8 -10 20.8 -16.4 19C-15 14 -13.4 9 -11.6 3.4Z'
    const fibers = Array.from({ length: 19 }, (_, i) => { const t = -1 + (i / 18) * 2; return `M${f(t * 11.4)} 4L${f(t * 16)} 19.4` }).join('')
    const tag = 'M0 0L7 -2.4L9.6 4.6L2.6 7Z'
    return (
      k.day() +
      k.sun(56, 46, 14, 44, 32, true) +
      table(k, 60, { pockets: [88] }) +
      // Bolas que ruedan a la tronera; una ya se está cayendo.
      `<g transform="translate(88 58)">` + k.clip('M-7 -12H7V2.2H-7Z', poolBall(k, 0, 0.8, 4.6, { c: P.red, n: 3 })) + `</g>` +
      k.floor(76, 74.6, 6, 1.4, FELT_D) + poolBall(k, 76, 70.4, 4.6, { c: P.mid, n: 2 }) +
      hair(62, 70, 66, 70.6, 69, 70, 0.7, P.white) + hair(62, 73.6, 65.4, 74, 68.6, 73.6, 0.5, P.white) +
      hair(80, 62, 83, 61, 85, 61.4, 0.6, P.white) +
      `<g transform="translate(50 82) rotate(22)">` +
      `<path d="${roundRect(-1.8, -64, 1.8, -2, 1.8)}" fill="${P.ink}" transform="translate(.6 .7)"/>` +
      k.draw([{ d: roundRect(-1.8, -64, 1.8, -2, 1.8), fill: P.red, inner: `<path d="M-1.8 -64H-.6V0H-1.8Z" fill="#fff" opacity=".35"/>` + k.sh('M.4 -64H2V0H.4Z', 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.5) +
      `<g transform="translate(1.6 -46) rotate(-30)">` + `<path d="M0 0L-3 -2" stroke="${P.ink}" stroke-width=".4"/>` + k.draw([{ d: tag, fill: P.goldL, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) }], 0.35) +
      rotulo(4.8, 3, 2.4, 'nueva', { rot: 70 }) + `<circle cx="1.6" cy=".6" r=".5" fill="${P.paper}" stroke="${P.ink}" stroke-width=".25"/></g>` +
      k.draw([
        { d: straw, fill: P.goldL, inner: `<path d="${fibers}" stroke="${P.goldD}" stroke-width=".35"/>` + k.sh(straw, 0, 0, 1, 1, 0, 0.75, P.goldD, 0.45) + `<path d="M-16 13.6C-8 15 8 15 16 13.6" fill="none" stroke="${P.red}" stroke-width=".9"/><path d="M-14.6 9C-8 10.2 8 10.2 14.6 9" fill="none" stroke="${FELT_D}" stroke-width=".8"/>` },
        { d: head, fill: P.red, inner: k.sh(head, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<path d="M-10 -1.4C-4 -2.4 4 -2.4 10 -1.4" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-dasharray="1 .6"/>` },
      ], 0.6) +
      `</g>` +
      [[28, 92], [33, 96], [58, 96], [24, 84]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${FELT_L}"/>`).join('') +
      hair(56, 88, 60, 86, 64, 87, 0.6, FELT_L) + hair(57, 92, 62, 90.6, 66, 92, 0.5, FELT_L) +
      sparkle(36, 36, 1.8) + sparkle(29, 69, 1.5, P.goldL) +
      k.defs()
    )
  },

  // Cinco mesas limpias: la blanca reluce bajo la franela amarilla del bar, que no deja ni el polvo.
  'Franela del bar': (u) => {
    const k = kit(u)
    const cloth = 'M42 52C46 43 55 39.4 64 40.4C73 41.4 80 47 82.4 55C84.6 63 86.4 73 89 82.6L84.6 80.4L81.4 86.6L78 79.4L74.4 83.4C72.6 74 71.4 64 66.6 57.4C60 49.6 50 48.6 42 52Z'
    const flap = 'M66.6 57.4C71.4 64 72.6 74 74.4 83.4L70.6 80.6L68 84C67 74 65 64 60.4 58.4Z'
    const border = (d: string) => `<path d="${d}" fill="none" stroke="${P.red}" stroke-width="2.4" stroke-dasharray="1.8 1.2"/>`
    return (
      k.day() +
      k.stage(60, 58, 34) +
      table(k, 80) +
      k.floor(58, 82, 18, 2.6, FELT_D) +
      poolBall(k, 56, 64, 17, {}) +
      k.clip(ellipse(56, 64, 17, 17), `<path d="M38 50C46 54 52 62 54 72" fill="none" stroke="#fff" stroke-width="1.2" opacity=".6"/>`) +
      k.draw([
        { d: flap, fill: P.goldD, inner: k.sh(flap, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + border(flap) },
        {
          d: cloth, fill: P.gold,
          inner: k.sh(cloth, 0, 0, 1, 0, 0, 0.85, P.goldD, 0.5) + border(cloth) +
            hair(66, 44, 74, 52, 76, 66, 0.8, P.goldD) + hair(72, 44, 80, 54, 82, 72, 0.7, P.goldD) + hair(76, 62, 78, 70, 81, 80, 0.6, P.goldD) +
            hair(46, 48, 54, 42, 64, 42, 0.9, P.goldL) + hair(52, 49, 60, 47, 66, 52, 0.6, P.goldD),
        },
      ], 0.7) +
      `<g transform="translate(46 50)">` + sparkle(0, 0, 4.4) + `</g>` + sparkle(36, 70, 2.4) + sparkle(54, 82, 1.6) + sparkle(30, 44, 2) +
      hair(26, 60, 22, 58, 18, 59, 0.6, P.blue) + hair(28, 54, 24, 50, 21, 49, 0.5, P.blue) +
      k.defs()
    )
  },

  // Quince mesas limpias: la aspiradora industrial de tambor chupa las bolas del paño con la manguera corrugada.
  'Aspiradora industrial': (u) => {
    const k = kit(u)
    const drum = cylSide(78, 56, 13, 4.4, 26)
    const lid = ellipse(78, 56, 13, 4.4)
    const motor = 'M68.6 55.4C68.6 49 72 46 78 46C84 46 87.4 49 87.4 55.4Z'
    const hosePts = [[68, 74], [58, 82], [44, 82], [34, 72], [34, 60]]
    const hose = stream(hosePts, 5, 5)
    const ribs = Array.from({ length: 22 }, (_, i) => i / 21)
    const nozzle = 'M30 60L38 60L40.4 51.4H27.6Z'
    const bands = [62, 72].map((y) => `M65 ${y}A13 4.4 0 0 0 91 ${y}`).join('')
    const wheel = (x: number) => `<circle cx="${x}" cy="85" r="3" fill="${NEGRA}" stroke="${P.ink}" stroke-width=".6"/><circle cx="${x}" cy="85" r="1" fill="${P.sky2}"/>`
    // La costura de la manguera: aros a lo largo de la curva suavizada.
    const pts = (() => { const q: number[][] = []; const s = hosePts; for (const t of ribs) { const n = s.length - 1, i = Math.min(n - 1, Math.floor(t * n)), u2 = t * n - i; q.push([s[i][0] + (s[i + 1][0] - s[i][0]) * u2, s[i][1] + (s[i + 1][1] - s[i][1]) * u2, Math.atan2(s[i + 1][1] - s[i][1], s[i + 1][0] - s[i][0])]) } return q })()
    return (
      k.day() +
      k.sun(60, 50, 15, 48, 32, false) +
      glow(k, 34, 38, 16, 16, 0.7) +
      table(k, 86) +
      k.floor(78, 88, 17, 2.4, FELT_D) +
      // Bolas que vuelan hacia la boca, con su estela.
      [[37, 32, 4.2, P.gold, 1], [48, 38, 3.4, P.red, 3], [27, 40, 3, P.mid, 2]].map(([x, y, r, c, n]) =>
        `<path d="${taper(x as number, (y as number) + (r as number) * 0.6, x as number, (y as number) + 5, 34, 48, (r as number) * 1.6, 0.4)}" fill="${k.lin(P.white, 0, 0, 0, 1, 0.8, 0)}"/>` +
        poolBall(k, x as number, y as number, r as number, { c: c as string, n: n as number, stripe: n === 3 })).join('') +
      hair(24, 46, 27, 48, 29, 50, 0.6, P.blue) + hair(46, 44, 43, 47, 41, 50, 0.6, P.blue) +
      k.draw([{ d: hose, fill: P.mid, inner: k.sh(hose, 0, 0, 0, 1, 0, 0.8, P.night, 0.45) + pts.map(([x, y, a]) => `<path d="M0 -2.6V2.6" transform="translate(${f(x)} ${f(y)}) rotate(${f((a * 180) / Math.PI)})" stroke="${P.night}" stroke-width=".55"/>`).join('') }], 0.65) +
      k.draw([{ d: nozzle, fill: P.sky2, inner: k.sh(nozzle, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M28.6 54H39.6" stroke="${P.blue}" stroke-width=".5"/>` }], 0.6) +
      `<path d="${ellipse(34, 51.4, 6.4, 1.6)}" fill="${NEGRA_D}" stroke="${P.ink}" stroke-width=".5"/>` +
      wheel(68) + wheel(88) +
      k.draw([
        { d: drum, fill: P.sky2, inner: k.sh(drum, 0, 0, 1, 0, 0, 0.85, P.mid, 0.5) + `<path d="${drum}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` + `<path d="${bands}" fill="none" stroke="${P.blue}" stroke-width="1.4"/><path d="${bands}" fill="none" stroke="#fff" stroke-width=".4" transform="translate(0 -.8)"/>` },
        { d: lid, fill: P.sky1, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) },
        { d: motor, fill: P.mid, inner: k.sh(motor, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M71 52H85M71.6 49.6H84.4" stroke="${P.night}" stroke-width=".5"/><path d="M72 48.4C74 47 77 46.6 79 46.8" fill="none" stroke="${P.sky}" stroke-width=".8" stroke-linecap="round"/>` },
      ], 0.7) +
      `<path d="M78 46V42M74 42H82" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M78 46V42M74 42H82" stroke="${P.sky2}" stroke-width=".6" stroke-linecap="round"/>` +
      // Chapa de bronce con el rótulo, con volutas.
      k.draw([{ d: roundRect(69, 64.4, 87, 70.6, 1), fill: P.gold, inner: k.sh(roundRect(69, 64.4, 87, 70.6, 1), 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) }], 0.4) +
      rotulo(78, 68.8, 3.4, 'industrial', { c: '#6A3A10' }) +
      `<path d="M66.4 77C68 75 70.6 75.2 71 77C71.2 78.4 69.6 79 69 78" fill="none" stroke="${P.gold}" stroke-width=".7"/><path d="M89.6 77C88 75 85.4 75.2 85 77C84.8 78.4 86.4 79 87 78" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      sparkle(92, 52, 2) + sparkle(62, 58, 1.4, P.goldL) + sparkle(52, 40, 1.6) +
      k.defs()
    )
  },
}
