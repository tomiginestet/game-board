// Código Secreto, el de los espías y las 25 palabras, en clave heroica. El violeta de la ficha del juego es el color
// propio (forros, tinta, ovillo, imán, la noche de los espías) y el papel del día lleva su grano violeta. A los
// personajes reales (el Superagente 86, el pulpo Paul) no se los dibuja: aparecen por sus objetos.
import { f } from '../helpers'
import { along, ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Violeta de la ficha de Código Secreto, con su sombra, su luz, un violeta pálido y la noche violeta. */
const CS = '#5F3DC4', CS_D = '#3A2384', CS_L = '#9B85E4', CS_XL = '#DDD5F6', CS_N = '#1E1646'
/** Cartón de las cartas de palabra. */
const CARD = '#E9DCBC', CARD_D = '#B9A47A'
/** Gabardina del piloto. */
const KHAKI = '#CFAE74', KHAKI_D = '#8E6B3B', KHAKI_L = '#EDD8AA'
/** Bronce de vainas y botones. */
const BRASS = '#D9A441', COPPER = '#B8673A'

/** Papel del día con el borde granulado en el violeta de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#C2B5EC', 0.5, 0.46, 0.7, 0, 1), '#A08FDB', 0.5)

/** Noche violeta de los espías, con un resplandor en el medio. */
const dusk = (k: Kit, cy = 0.42) => `<rect width="120" height="130" fill="${CS_N}"/>` + k.shade(FULL, k.rad(CS, 0.48, cy, 0.55, 0.9, 0), CS, 0.35)

/** Escenario violeta: un disco pálido con el borde granulado. */
const stageV = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${CS_XL}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(CS_L, 0.5, 0.5, 0.5, 0, 1), CS_L, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CS}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor dorado suave. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7) => k.shade(ellipse(cx, cy, rx, ry), k.rad(P.goldL, 0.5, 0.5, 0.5, a, 0), P.goldL, 0.45)

/** Espeja un path de comandos absolutos (M L H V C Q Z) alrededor de la vertical x = cx. */
function mirror(d: string, cx = 60) {
  return d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (_, c: string, args: string) => {
    const n = (args.match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? []).map(Number)
    if (c === 'H') return 'H' + n.map((x) => f(2 * cx - x)).join(' ')
    if (c === 'V' || c === 'Z') return c + n.join(' ')
    return c + n.map((v, i) => (i % 2 ? v : f(2 * cx - v))).join(' ')
  })
}

/** Cordón (hilo, lana, cable): tinta por fuera, color y un brillo fino. */
const cord = (d: string, c: string, w = 1.2, hi = '#fff') =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 1.9)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" opacity=".55" transform="translate(-.25 -.25)"/>`

/** Cable enrulado de teléfono a lo largo de una curva cuadrática (una trocoide). */
function coil(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, R: number, turns: number) {
  const N = Math.round(turns * 18)
  const pts = along(x0, y0, cx, cy, x1, y1, Array.from({ length: N + 1 }, (_, i) => i / N)).map((q, i) => {
    const len = Math.hypot(q.dx, q.dy) || 1, tx = q.dx / len, ty = q.dy / len, a = (i / N) * turns * Math.PI * 2
    return `${f(q.x - ty * R * Math.sin(a) + tx * R * 0.85 * Math.cos(a))} ${f(q.y + tx * R * Math.sin(a) + ty * R * 0.85 * Math.cos(a))}`
  })
  return `M${pts.join('L')}`
}

/** Carta de palabra, apaisada y centrada en (0,0): cartón crema, el filete y la franja blanca con la palabra. */
function wordCard(k: Kit, w: number, h: number, o: { word?: string; fill?: string; band?: string; ink?: string; lw?: number } = {}) {
  const x0 = -w / 2, y0 = -h / 2, r = f(Math.min(w, h) * 0.09)
  const d = roundRect(f(x0), f(y0), f(-x0), f(-y0), r)
  const fill = o.fill ?? CARD, ink = o.ink ?? P.ink
  const band = `M${f(x0 + w * 0.1)} ${f(h * 0.02)}H${f(w * 0.4)}V${f(h * 0.36)}H${f(x0 + w * 0.1)}Z`
  const fs = f(h * 0.22)
  return (
    k.draw([{
      d, fill,
      inner:
        k.sh(d, 0, 0, 1, 1, 0, 0.55, o.fill ? P.night : CARD_D, 0.35) +
        `<path d="${roundRect(f(x0 + w * 0.05), f(y0 + h * 0.07), f(-x0 - w * 0.05), f(-y0 - h * 0.07), f(+r * 0.6))}" fill="none" stroke="${o.fill ? '#fff' : CARD_D}" stroke-width="${f(h * 0.025)}" opacity=".8"/>` +
        `<path d="${band}" fill="${o.band ?? P.white}" stroke="${o.fill ? P.night : CARD_D}" stroke-width="${f(h * 0.02)}"/>` +
        (o.word
          ? `<text x="0" y="${f(h * 0.27)}" ${GEORGIA} font-weight="700" font-size="${fs}" fill="${ink}" text-anchor="middle" letter-spacing=".2">${o.word}</text>` +
            `<text x="0" y="${f(-h * 0.14)}" ${GEORGIA} font-size="${f(h * 0.13)}" fill="${o.fill ? '#fff' : CARD_D}" text-anchor="middle" transform="rotate(180 0 ${f(-h * 0.18)})">${o.word}</text>`
          : `<path d="M${f(-w * 0.2)} ${f(h * 0.19)}H${f(w * 0.2)}" stroke="${ink}" stroke-width="${f(h * 0.1)}" stroke-linecap="round"/>` +
            `<path d="M${f(-w * 0.14)} ${f(-h * 0.2)}H${f(w * 0.14)}" stroke="${o.fill ? '#fff' : CARD_D}" stroke-width="${f(h * 0.06)}" stroke-linecap="round"/>`),
    }], o.lw ?? f(Math.min(0.55, h * 0.05)))
  )
}

/** Bala: vaina de bronce y punta de cobre, apuntando a +x, con la base en (0,0). */
function bullet(k: Kit, s = 1) {
  const casing = `M0 -2.2H8.4V2.2H0Z`
  const rim = `M-1 -2.5H.6V2.5H-1Z`
  const tip = `M8.2 -2C11.4 -2 13.8 -1 15 0C13.8 1 11.4 2 8.2 2Z`
  return (
    `<g transform="scale(${s})">` +
    k.draw([
      { d: tip, fill: COPPER, inner: k.sh(tip, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M9 -1.2C11 -1.2 12.6 -.8 13.6 -.3" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-linecap="round"/>` },
      { d: casing, fill: BRASS, inner: k.sh(casing, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M.4 -1.4H8" stroke="${P.goldL}" stroke-width=".6"/><path d="M1.6 -2.2V2.2" stroke="${P.goldD}" stroke-width=".4"/>` },
      { d: rim, fill: BRASS, inner: k.sh(rim, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) },
    ], f(0.45 / s)) +
    `</g>`
  )
}

/** Hoja de árbol al viento, centrada en (0,0) y apuntando a +x. */
function leaf(k: Kit, c: string, cd: string) {
  const d = 'M-5 0C-3 -3 1.6 -3.6 5 0C1.6 3.6 -3 3 -5 0Z'
  return k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, cd, 0.45) + `<path d="M-6 0H4.4M-1 0L1 -1.6M-1 0L1 1.6M1.6 0L3 -1M1.6 0L3 1" fill="none" stroke="${cd}" stroke-width=".35"/>` }], 0.4)
}

export const CODIGOSECRETO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Agencia de inteligencia ────────────────────────────────────────

  // Tres misiones: el piloto colgado en la percha bajo el farol, con el cuello levantado y los anteojos negros.
  'Agente encubierto': (u) => {
    const k = kit(u)
    const hook = 'M0 -24V-31.4C0 -34.4 2 -36.2 4.4 -36.2C6.8 -36.2 8.4 -34.4 8 -32.2'
    const body = 'M-7 -24L-19.4 -17.6C-20.2 -10 -19 -2 -16.4 4L-15.4 8.4L-15.6 13.4C-17.4 20 -19 25.4 -20.2 30.4C-8 33.2 8 33.2 20.2 30.4C19 25.4 17.4 20 15.6 13.4L15.4 8.4L16.4 4C19 -2 20.2 -10 19.4 -17.6L7 -24C4 -22.2 -4 -22.2 -7 -24Z'
    const sleeveL = 'M-19.4 -17.6C-24 -16 -26.6 -11 -27.2 -4L-28.8 22C-26.6 23.4 -23.6 23.8 -21.2 23.2L-18.6 0C-18 -6 -18 -12 -19.4 -17.6Z'
    const backCollar = 'M-8.8 -24.2C-5 -27.8 5 -27.8 8.8 -24.2L7.4 -21.4C4 -23.8 -4 -23.8 -7.4 -21.4Z'
    const lining = 'M-7.4 -21.4C-4 -23.8 4 -23.8 7.4 -21.4L1.8 -1.6H-1.8Z'
    const collarL = 'M-8.8 -24.2C-12 -22.4 -15.6 -18.6 -18.2 -13.6L-12.2 -15L-7.4 -21.4Z'
    const lapelL = 'M-7.4 -21.4L-12.2 -15L-16 -11L-1.6 1.6L-1.8 -1.6Z'
    const belt = 'M-15.4 7.6C-6 9.6 6 9.6 15.4 7.6L15.6 12.8C6 14.8 -6 14.8 -15.6 12.8Z'
    const tail = 'M-7.4 12.6C-8.2 16.6 -7.8 20.6 -6.4 24L-3.8 23.4C-4.8 20 -5 16.6 -4.6 13Z'
    const epL = 'M-19.6 -17.2L-11.2 -21.6L-10.4 -19.4L-18.8 -15Z'
    const cuffL = 'M-28.3 15.6C-25.8 16.4 -23.4 16.6 -21.6 16.4L-21.9 19C-23.8 19.2 -26.2 19 -28.5 18.2Z'
    const pocketL = 'M-15.4 17.6L-11.6 16.6L-8.8 24.4L-12.4 25.4Z'
    const btn = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="1.25" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - 0.35)}" cy="${f(y - 0.35)}" r=".4" fill="${KHAKI_L}"/>`
    const stitch = (d: string) => `<path d="${d}" fill="none" stroke="${KHAKI_D}" stroke-width=".35" stroke-dasharray=".9 .6"/>`
    // Anteojos negros colgados de la solapa por una patilla.
    const lens = 'M-10.6 -2.4C-10.6 -3.8 -9.6 -4.4 -8.2 -4.4H-2.2C-1 -4.4 -.4 -3.6 -.6 -2.4L-1.2 1.6C-1.6 3.6 -3 4.8 -5 4.8H-6.6C-8.6 4.8 -10 3.6 -10.2 1.6Z'
    const glass = (d: string, a: number) =>
      `<path d="${d}" fill="${P.night}"/>` + k.clip(d, `<path d="${d}" fill="${k.lin(CS, 0, 0, 0, 1, 0, 0.95)}"/>` + `<path d="M-12 -6H-6L-10 6H-12Z" fill="${k.lin(CS_XL, 0, 0, 1, 1, a, 0)}" transform="translate(${d === lens ? 0 : 10.6} 0)"/>`)
    const shades =
      `<path d="M-10.4 -3.6C-12.6 -6.6 -12.6 -10.4 -10.6 -13.4" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M-10.4 -3.6C-12.6 -6.6 -12.6 -10.4 -10.6 -13.4" fill="none" stroke="${P.night}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([{ d: lens, fill: P.night }, { d: mirror(lens, 0), fill: P.night }], 0.6) +
      glass(lens, 0.75) + glass(mirror(lens, 0), 0.45) +
      `<path d="M-10.8 -3.6H10.8" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M-10.4 -3.8H10.4" stroke="${P.night}" stroke-width=".6"/>` +
      `<path d="M-.8 -3.2C-.4 -4.4 .4 -4.4 .8 -3.2" fill="none" stroke="${P.ink}" stroke-width=".9"/>` +
      `<path d="M-8.6 -2.4C-7 -3.2 -5 -3.2 -3.4 -2.8" fill="none" stroke="#fff" stroke-width=".55" stroke-linecap="round"/>` +
      `<circle cx="-10.4" cy="-3.6" r=".45" fill="${P.goldL}"/><circle cx="10.4" cy="-3.6" r=".45" fill="${P.goldL}"/>`
    const rain = [[30, 24], [40, 30], [88, 22], [94, 44], [26, 50], [84, 60], [32, 70], [92, 72], [74, 26]]
      .map(([x, y], i) => hair(x, y, x - 1.2, y + 4, x - 2.4, y + 8 + (i % 3), 0.35, CS_XL, 0.55)).join('')
    return (
      dusk(k, 0.4) +
      k.shade('M48 0H72L102 104H18Z', k.lin(P.goldL, 0, 0, 0, 1, 0.42, 0.04), P.goldL, 0.35) +
      glow(k, 60, 54, 30, 34, 0.55) +
      rain +
      `<g transform="translate(60 59) scale(.95)">` +
      `<path d="${hook}" fill="none" stroke="${P.ink}" stroke-width="2.3" stroke-linecap="round"/><path d="${hook}" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linecap="round"/><path d="M-.4 -25V-31" stroke="${P.goldL}" stroke-width=".4"/>` +
      k.draw([
        { d: sleeveL, fill: KHAKI, inner: k.sh(sleeveL, 0, 0, 1, 0, 0, 0.8, KHAKI_D, 0.45) + hair(-25, -6, -26, 4, -25, 14, 0.4, KHAKI_D) + hair(-22, -10, -21.6, 0, -22.6, 10, 0.35, KHAKI_L) },
        { d: mirror(sleeveL, 0), fill: KHAKI, inner: k.sh(mirror(sleeveL, 0), 0, 0, 1, 0, 0.3, 0.95, KHAKI_D, 0.5) + hair(25, -6, 26, 4, 25, 14, 0.4, KHAKI_D) },
      ], 0.75) +
      k.draw([{ d: cuffL, fill: KHAKI, line: 0.3 }, { d: mirror(cuffL, 0), fill: KHAKI, line: 0.3, inner: k.sh(mirror(cuffL, 0), 0, 0, 0, 1, 0, 0.9, KHAKI_D, 0.5) }], 0.35) +
      `<rect x="-26.4" y="15.6" width="2.2" height="3.4" rx=".4" fill="none" stroke="${P.gold}" stroke-width=".55"/><rect x="24.2" y="15.6" width="2.2" height="3.4" rx=".4" fill="none" stroke="${P.goldD}" stroke-width=".55"/>` +
      k.draw([{
        d: body, fill: KHAKI,
        inner:
          k.sh('M5 -26C13 -10 15 10 12 34H24V-26Z', 0, 0, 1, 0, 0, 0.9, KHAKI_D, 0.5) + k.sh('M-22 24H22V34H-22Z', 0, 0, 0, 1, 0, 0.6, KHAKI_D, 0.35) +
          `<path d="M-22 -26H-10V34H-22Z" fill="${k.lin(KHAKI_L, 0, 0, 1, 0, 0.75, 0)}"/>` +
          `<path d="M2.2 1V31.6" stroke="${KHAKI_D}" stroke-width=".5"/>` + stitch('M3.2 1.4V31') +
          hair(-9, 15, -10.6, 23, -12, 31, 0.5, KHAKI_D) + hair(-3, 15, -3.6, 23, -4.6, 31.6, 0.45, KHAKI_D) + hair(8, 15, 9.4, 23, 11, 31, 0.5, KHAKI_D) + hair(13, 15, 15, 22, 17, 30, 0.45, KHAKI_D) +
          hair(-16, -8, -14.4, -2, -13.6, 4, 0.45, KHAKI_D) + hair(15.6, -8, 14.4, -2, 13.6, 4, 0.45, KHAKI_D) +
          `<path d="${pocketL}" fill="none" stroke="${KHAKI_D}" stroke-width=".5"/><path d="${mirror(pocketL, 0)}" fill="none" stroke="${KHAKI_D}" stroke-width=".5"/>` +
          k.sh('M-22 13H22V16H-22Z', 0, 0, 0, 1, 0.6, 0, KHAKI_D, 0.35),
      }], 0.8) +
      k.draw([
        { d: lining, fill: CS, inner: k.sh(lining, 0, 0, 1, 1, 0, 0.9, CS_D, 0.5) + `<path d="M-1 -20L-.6 -4" stroke="${CS_L}" stroke-width=".4"/>` + hair(-5, -20, -3, -12, -1.6, -5, 0.4, CS_D) + hair(5, -20, 3, -12, 1.6, -5, 0.4, CS_D) },
        { d: backCollar, fill: KHAKI, inner: k.sh(backCollar, 0, 0, 0, 1, 0.3, 0.9, KHAKI_D, 0.5) + stitch('M-7.4 -24.2C-4 -26.6 4 -26.6 7.4 -24.2') },
      ], 0.5) +
      k.draw([
        { d: lapelL, fill: KHAKI, inner: k.sh(lapelL, 0, 0, 1, 1, 0, 0.5, KHAKI_D, 0.35) + `<path d="M-14 -16H-6V-4H-14Z" fill="${k.lin(KHAKI_L, 0, 0, 1, 0, 0.6, 0)}"/>` + stitch('M-12.6 -13.2L-2.6 -.4') },
        { d: mirror(lapelL, 0), fill: KHAKI, inner: k.sh(mirror(lapelL, 0), 0, 0, 1, 0, 0.3, 0.9, KHAKI_D, 0.5) + stitch('M12.6 -13.2L2.6 -.4') },
        { d: collarL, fill: KHAKI, inner: k.sh(collarL, 0, 0, 1, 1, 0, 0.6, KHAKI_D, 0.4) + stitch('M-9.6 -22.4C-12.2 -20.4 -14.6 -17.6 -16.4 -14.6') + `<path d="M-18 -15H-9V-23H-18Z" fill="${k.lin(KHAKI_L, 0, 0, 1, 0, 0.5, 0)}"/>` },
        { d: mirror(collarL, 0), fill: KHAKI, inner: k.sh(mirror(collarL, 0), 0, 0, 1, 0, 0.3, 0.95, KHAKI_D, 0.5) + stitch('M9.6 -22.4C12.2 -20.4 14.6 -17.6 16.4 -14.6') },
        { d: epL, fill: KHAKI, line: 0.3, inner: k.sh(epL, 0, 0, 0, 1, 0, 0.8, KHAKI_D, 0.4) },
        { d: mirror(epL, 0), fill: KHAKI, line: 0.3, inner: k.sh(mirror(epL, 0), 0, 0, 0, 1, 0.3, 0.9, KHAKI_D, 0.45) },
      ], 0.6) +
      btn(-12, -19.4) + btn(12, -19.4) + btn(-6.4, 3.8) + btn(6.4, 3.8) + btn(-6.4, 18.6) + btn(6.4, 18.6) + btn(-6.4, 25) + btn(6.4, 25) +
      k.draw([
        { d: tail, fill: KHAKI, inner: k.sh(tail, 0, 0, 1, 0, 0, 0.8, KHAKI_D, 0.45) },
        { d: belt, fill: KHAKI, inner: k.sh(belt, 0, 0, 0, 1, 0, 0.8, KHAKI_D, 0.45) + `<path d="M-15 8.8C-6 10.6 6 10.6 15 8.8" fill="none" stroke="${KHAKI_L}" stroke-width=".5"/>` + stitch('M-15.4 11.6C-6 13.6 6 13.6 15.4 11.6') },
      ], 0.55) +
      `<rect x="-9.6" y="8.2" width="5.6" height="5.8" rx=".8" fill="none" stroke="${P.ink}" stroke-width="1.9"/><rect x="-9.6" y="8.2" width="5.6" height="5.8" rx=".8" fill="none" stroke="${P.gold}" stroke-width="1"/><path d="M-6.8 8.6V13.6" stroke="${P.goldD}" stroke-width=".7"/>` +
      `<g transform="translate(9.4 -1.4) rotate(38) scale(.92)">` + shades + `</g>` +
      `</g>` +
      sparkle(32, 34, 1.8, P.goldL) + sparkle(88, 84, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Diez victorias: "¿Y si le digo que…?". El zapatófono, con el disco en el taco y el cable enrulado, sonando.
  'Superagente 86': (u) => {
    const k = kit(u)
    const upper = 'M-30 6.4C-31.2 2 -29 -1.4 -24 -3.2C-18 -5.2 -10.6 -7.6 -4.4 -10.8L3.6 -15.4C8 -17.2 14 -17.8 19.6 -17.4C23.6 -17 26.6 -15.4 27.6 -12C28.6 -7 28.6 0 27.8 6.4Z'
    const mouth = 'M3.6 -15.4C8 -17.2 14 -17.8 19.6 -17.4C23.6 -17 26.6 -15.4 27.6 -12C22 -13.6 12 -14 3.6 -15.4Z'
    const sole = 'M-30.6 5.6C-31.2 8.4 -28.6 10 -24 10H9.4L11 6.4H-30.4Z'
    const heel = 'M11.6 6H28V14C28 14.8 27.4 15.4 26.6 15.4H13.2C12.4 15.4 11.8 14.8 11.8 14Z'
    const toeCap = 'M-30 6.4C-31.2 2 -29 -1.4 -24 -3.2L-21.4 -4.1C-19.4 -1 -19 2.6 -20 6.4Z'
    const eyelets = [[-3.4, -11.2], [-.6, -12.8], [2.2, -14.4]]
    const lace = 'M-4.2 -10.4L-1.4 -13.8M-1.4 -11.8L1.4 -15.2M-3.6 -12.2L-.8 -10.6M-.8 -14L1.8 -12.4'
    const dial = (x: number, y: number) => {
      const holes = Array.from({ length: 10 }, (_, i) => {
        const a = ((-60 - i * 27) * Math.PI) / 180
        return `<circle cx="${f(x + Math.cos(a) * 5.9)}" cy="${f(y + Math.sin(a) * 5.9)}" r="1.25" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x + Math.cos(a) * 5.9 - 0.3)}" cy="${f(y + Math.sin(a) * 5.9 - 0.3)}" r=".35" fill="${P.white}"/>`
      }).join('')
      const face = ellipse(x, y, 8.2, 8.2)
      return (
        k.draw([{ d: ellipse(x, y, 9.4, 9.4), fill: P.gold, inner: k.sh(ellipse(x, y, 9.4, 9.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.5) +
        `<path d="${face}" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` + k.clip(face, k.sh(face, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4)) +
        `<circle cx="${x}" cy="${y}" r="8.5" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
        holes +
        `<circle cx="${x}" cy="${y}" r="2.9" fill="${CS}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${x}" cy="${y}" r="1.7" fill="none" stroke="${CS_L}" stroke-width=".35"/><circle cx="${x}" cy="${y}" r=".7" fill="${P.goldL}"/>` +
        `<path d="M${f(x + 6.6)} ${f(y + 3)}L${f(x + 8.8)} ${f(y + 4.6)}" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M${f(x + 6.6)} ${f(y + 3)}L${f(x + 8.8)} ${f(y + 4.6)}" stroke="${P.sky1}" stroke-width=".6" stroke-linecap="round"/>`
      )
    }
    const ring = (x: number, y: number, r: number, a0: number, a1: number, w: number) => {
      const p = (a: number) => [x + Math.cos((a * Math.PI) / 180) * r, y + Math.sin((a * Math.PI) / 180) * r]
      const [ax, ay] = p(a0), [bx, by] = p(a1), [mx, my] = p((a0 + a1) / 2)
      return hair(ax, ay, 2 * mx - (ax + bx) / 2, 2 * my - (ay + by) / 2, bx, by, w, CS)
    }
    const coilD = coil(26.4, 13.4, 38, 18, 40, 34, 2.1, 6)
    return (
      field(k) +
      k.sun(60, 58, 16, 46, 32, false) +
      glow(k, 60, 58, 28, 26, 0.6) +
      ring(84, 42, 7, -80, 10, 0.9) + ring(84, 42, 11.4, -82, 12, 0.8) + ring(36, 78, 7, 100, 190, 0.8) + ring(36, 78, 11.4, 98, 192, 0.7) +
      k.floor(60, 84, 27, 2.6, CS) +
      `<g transform="translate(58 61) rotate(-12) scale(1.04)">` +
      cord(coilD, P.night, 1.1, CS_L) +
      k.cast([upper, sole, heel], 2, 2.2, CS) +
      k.draw([
        { d: sole, fill: P.brownD, inner: `<path d="M-30 7.4H9" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray=".8 .6"/>` },
        { d: heel, fill: P.brownD, inner: k.sh(heel, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) + `<path d="M11.8 8.6H28M11.8 11.6H28" stroke="${P.brown}" stroke-width=".4"/>` },
        {
          d: upper, fill: P.night,
          inner:
            `<path d="M-32 -10H6V8H-32Z" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.9, 0)}"/>` + k.sh(upper, 0, 0, 1, 1, 0.1, 0.9, '#0B1130', 0.5) +
            `<path d="M3.6 -15.4C3.4 -6 2.8 0 2 6.4" fill="none" stroke="${P.mid}" stroke-width=".6"/>` +
            `<path d="M3 -15C2.8 -6 2.2 0 1.4 6.4" fill="none" stroke="#0B1130" stroke-width=".5"/>` +
            `<path d="M-27.4 -1.6C-22 -3.2 -12 -6 -6 -8.8" fill="none" stroke="${P.sky}" stroke-width="1" stroke-linecap="round" opacity=".55"/>` +
            hair(-14, -3, -10, -1.6, -6, -2.6, 0.45, P.mid) + hair(-12, 1, -8, 2.4, -4, 1.4, 0.4, P.mid) + hair(6, -10, 7, -4, 6.4, 2, 0.4, P.mid),
        },
      ], 0.8) +
      `<path d="${mouth}" fill="${CS}" stroke="${P.ink}" stroke-width=".5"/>` + k.clip(mouth, k.sh(mouth, 0, 0, 0, 1, 0, 0.9, CS_D, 0.5)) +
      k.draw([{ d: toeCap, fill: P.night, inner: `<path d="M-30 -4H-22V7H-30Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.8, 0)}"/>` }], 0.4) +
      Array.from({ length: 7 }, (_, i) => `<circle cx="${f(-21.2 + Math.sin(i * 0.5) * 0.6 + 0.4)}" cy="${f(-2.6 + i * 1.3)}" r=".32" fill="${P.sky}"/>`).join('') +
      eyelets.map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<path d="${lace}" stroke="${P.white}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M2.4 -15C1 -18.6 -2.6 -19.2 -3.4 -17.2C-4 -15.6 -1 -15 2.4 -15ZM2.4 -15C5.4 -17.6 8.6 -17 8.4 -15C8.2 -13.6 5.4 -13.8 2.4 -15Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M2.4 -15C1.6 -13 1.4 -11 2 -9M2.4 -15C3.8 -13.4 4.4 -11.4 4.2 -9.6" fill="none" stroke="${P.white}" stroke-width=".6" stroke-linecap="round"/>` +
      dial(16.8, -3.4) +
      `<path d="M-24.6 -1.2C-22.6 -2.4 -20 -3.2 -18 -3.6" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".8"/>` +
      `</g>` +
      `<text x="58" y="32.4" ${GEORGIA} font-style="italic" font-size="4.2" fill="${CS_D}" text-anchor="middle">¿y si le digo que…?</text>` +
      sparkle(90, 54, 1.8) + sparkle(30, 46, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Veinticinco misiones: tenés carpeta de todos. La pila de carpetas con elástico, la de arriba violeta y sellada.
  'Jefe de la SIDE': (u) => {
    const k = kit(u)
    const W = 24, H = 17
    const cover = roundRect(-W, -H, W, H, 1.6)
    const tab = (x0: number, x1: number) => `M${x0} ${f(-H + 1)}L${f(x0 + 1.4)} ${f(-H - 3.8)}C${f(x0 + 1.6)} ${f(-H - 4.6)} ${f(x0 + 2.2)} ${f(-H - 5)} ${f(x0 + 3)} ${f(-H - 5)}H${f(x1 - 3)}C${f(x1 - 2.2)} ${f(-H - 5)} ${f(x1 - 1.6)} ${f(-H - 4.6)} ${f(x1 - 1.4)} ${f(-H - 3.8)}L${x1} ${f(-H + 1)}Z`
    const under = ([[3, P.sky1, P.blue, 10, 22], [2, CARD, CARD_D, -4, 8], [1, P.red, P.wine, 6, 18]] as const).map(([i, c, cd, t0, t1]) => {
      const dx = i * 1.5, dy = i * 2.1
      return `<g transform="translate(${f(dx)} ${f(dy)})">` +
        k.draw([
          { d: tab(t0, t1), fill: c, inner: k.sh(tab(t0, t1), 0, 0, 0, 1, 0, 0.8, cd, 0.4) },
          { d: cover, fill: c, inner: k.sh(cover, 0, 0, 1, 1, 0, 0.8, cd, 0.45) },
        ], 0.6) +
        `<path d="M${f(-W + 1)} ${f(H - 0.6)}H${f(W - 1)}M${f(W - 0.6)} ${f(-H + 1)}V${f(H - 1)}" stroke="${P.white}" stroke-width=".7"/>` +
        `<path d="M${f(-W + 1.4)} ${f(H - 1.4)}H${f(W - 1.4)}" stroke="${cd}" stroke-width=".3"/>` +
        `</g>`
    }).join('')
    const elastic = (d: string) => `<path d="${d}" stroke="${P.ink}" stroke-width="2.6"/><path d="${d}" stroke="${P.night}" stroke-width="1.6"/><path d="${d}" stroke="${P.mid}" stroke-width=".4" transform="translate(-.3 -.3)"/>`
    const finger = Array.from({ length: 7 }, (_, i) => {
      const rx = 1 + i * 0.85, ry = 1.4 + i * 1.05
      return `<path d="${ellipse(0, 0, f(rx), f(ry))}" fill="none" stroke="${CS_D}" stroke-width=".42" stroke-dasharray="${f(2.6 + i * 0.8)} ${f(0.7 + (i % 3) * 0.4)}" opacity=".85"/>`
    }).join('')
    const stamp = roundRect(-14.4, -4.8, 14.4, 4.8, 1)
    return (
      field(k) +
      k.sun(60, 56, 16, 48, 32, false) +
      glow(k, 60, 56, 32, 28, 0.75) +
      laurel(48, 100, 27, 92, 24, 64, 8) + laurel(72, 100, 93, 92, 96, 64, 8, true) +
      `<g transform="translate(58.4 58.6) rotate(-7)">` +
      k.cast([cover], 6.4, 8.4, CS) +
      under +
      k.draw([
        { d: tab(-22, -5), fill: CS, inner: k.sh(tab(-22, -5), 0, 0, 0, 1, 0, 0.8, CS_D, 0.45) + `<path d="M-19.4 -20.6H-7.6" stroke="${CS_XL}" stroke-width=".9" stroke-linecap="round"/>` },
        {
          d: cover, fill: CS,
          inner:
            k.sh(cover, 0, 0, 1, 1, 0, 0.85, CS_D, 0.5) + `<path d="M-26 -18H-12V19H-26Z" fill="${k.lin(CS_L, 0, 0, 1, 0, 0.55, 0)}"/>` +
            `<path d="M${-W + 2.2} ${-H + 2.2}H${W - 2.2}V${H - 2.2}H${-W + 2.2}Z" fill="none" stroke="${CS_L}" stroke-width=".45" stroke-dasharray="1.2 .7"/>` +
            hair(-18, 12, -8, 13, 4, 11.6, 0.4, CS_D) + hair(-6, -12, 4, -13, 14, -11.6, 0.35, CS_L),
        },
      ], 0.85) +
      k.draw([{ d: roundRect(-19.6, -12.6, -2, -3.2, 0.6), fill: P.white, inner: `<path d="M-18 -9.6H-4.2M-18 -7.2H-6.6M-18 -4.8H-9" stroke="${P.blue}" stroke-width=".45"/>` + k.sh(roundRect(-19.6, -12.6, -2, -3.2, 0.6), 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.4) +
      `<text x="-18.2" y="-10.4" ${GEORGIA} font-weight="700" font-size="2" fill="${P.ink}">EXPTE. Nº 25</text>` +
      `<g transform="translate(8.6 -9.6) rotate(18) scale(.82)">${finger}</g>` +
      k.clip(cover, elastic('M13 -18.6L25.6 -6') + elastic('M-25.6 6L-13 18.6')) +
      `<g transform="translate(-1.6 5.6) rotate(-9)">` +
      `<path d="${stamp}" fill="${P.white}" opacity=".35"/>` +
      `<path d="${stamp}" fill="none" stroke="${P.red}" stroke-width="1.1"/><path d="${roundRect(-13, -3.4, 13, 3.4, 0.6)}" fill="none" stroke="${P.red}" stroke-width=".4"/>` +
      `<text x="0" y="1.9" ${GEORGIA} font-weight="700" font-size="5" fill="${P.red}" text-anchor="middle" letter-spacing=".5">SECRETO</text>` +
      `</g>` +
      `<path d="M-21.6 -13.8C-21.6 -15 -20.8 -15.6 -19.8 -15.6" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".8"/>` +
      `</g>` +
      sparkle(60, 19, 3, '#fff') + sparkle(88, 34, 1.8) + sparkle(31, 38, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Pista maestra ──────────────────────────────────────────────────

  // Una pista de cuatro: un solo hilo de lana violeta ata cuatro cartas. El ovillo de la abuela, con las agujas.
  'Tejedor': (u) => {
    const k = kit(u)
    const bx = 44, by = 71, R = 15
    const ball = ellipse(bx, by, R, R)
    // Una vuelta de lana: franja entre dos paralelos (girada `rot`), con sus hebras, un brillo y el borde marcado.
    const band = (rot: number, o1: number, o2: number, step = 1.5) => {
      const edge = (o: number) => `M${f(bx - R * 1.3)} ${f(by + o)}Q${bx} ${f(by + o * 1.6)} ${f(bx + R * 1.3)} ${f(by + o)}`
      const back = (o: number) => `L${f(bx + R * 1.3)} ${f(by + o)}Q${bx} ${f(by + o * 1.6)} ${f(bx - R * 1.3)} ${f(by + o)}Z`
      const n = Math.max(1, Math.floor((o2 - o1) / step))
      const lines = Array.from({ length: n }, (_, i) => edge(o1 + (i + 0.5) * ((o2 - o1) / n))).join('')
      return `<g transform="rotate(${rot} ${bx} ${by})"><path d="${edge(o1)}${back(o2)}" fill="${CS}"/>` +
        `<path d="${lines}" fill="none" stroke="${CS_D}" stroke-width=".42"/>` +
        `<path d="${edge(o1 + (o2 - o1) * 0.25)}" fill="none" stroke="${CS_L}" stroke-width=".5"/>` +
        `<path d="${edge(o1)}${edge(o2)}" fill="none" stroke="${CS_D}" stroke-width=".75"/></g>`
    }
    const needle = (x0: number, y0: number, x1: number, y1: number) => {
      const a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI, L = Math.hypot(x1 - x0, y1 - y0)
      const rod = `M0 -1.1H${f(L - 4)}L${f(L)} 0L${f(L - 4)} 1.1H0Z`
      return `<g transform="translate(${x0} ${y0}) rotate(${f(a)})">` +
        k.draw([{ d: rod, fill: P.brown, inner: k.sh(rod, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M0 -.5H${f(L - 4)}" stroke="${P.goldL}" stroke-width=".35"/>` }], 0.45) +
        k.draw([{ d: ellipse(-0.6, 0, 2.6, 2.6), fill: P.gold, inner: k.sh(ellipse(-0.6, 0, 2.6, 2.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.45) +
        `<circle cx="-1.4" cy="-.8" r=".7" fill="${P.goldL}"/></g>`
    }
    const cards = ([[-3, 3.4, -6, 'MATE'], [-1, 2.2, -2, 'TANGO'], [1, 1, 2, 'GOL'], [3, 0, 6, 'ASADO']] as const)
      .map(([dx, dy, r, w]) => `<g transform="translate(${dx} ${dy}) rotate(${r})">${wordCard(k, 25, 16.4, { word: w })}</g>`).join('')
    const yarn = 'M55 79C61 86 67 84 69 78C69.6 76 70 74 70.6 72'
    return (
      field(k) +
      stageV(k, 60, 62, 33) +
      k.floor(46, 87, 16, 2.4, CS) +
      needle(27, 37, 37, 74) + needle(63, 36, 49, 74) +
      k.draw([{ d: ball, fill: CS, inner: k.sh(ball, 0, 0, 1, 1, 0, 0.9, CS_D, 0.5) }], 0.75) +
      k.clip(ball,
        band(30, -22, 22) + band(-58, -7.4, 4.6) + band(78, -1, 8.6) + band(-14, 9, 15.6, 1.4) +
        k.sh(ball, 0, 0, 1, 1, 0, 0.9, CS_D, 0.4) +
        `<path d="M${bx - R} ${by - R}H${bx}V${by + R}H${bx - R}Z" fill="${k.lin(CS_XL, 0, 0, 1, 0, 0.45, 0)}"/>`) +
      `<path d="M33.4 64C35.4 59.4 39.4 56.6 44 56" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".75"/>` +
      cord(yarn, CS, 1.3, CS_XL) +
      `<g transform="translate(78 57) rotate(-10)">` + k.cast([roundRect(-15.5, -8.2, 15.5, 11.6, 1.4)], 1.6, 1.8, CS) + cards +
      cord('M-9.6 -10C-10.4 -4 -10.4 4 -9.4 13.6', CS, 1.3, CS_XL) +
      cord('M-9.6 -10C-13.4 -14.6 -17.4 -13.8 -16.6 -10.8C-15.8 -8.4 -12 -8.6 -9.6 -10C-6.4 -14.2 -2 -13.8 -2.4 -11C-2.8 -8.6 -6.6 -8.4 -9.6 -10', CS, 1.2, CS_XL) +
      cord('M-9.6 -9.6C-11 -7.2 -12.6 -5.2 -15 -4M-9.4 -9.6C-7.4 -7.4 -5.2 -6.2 -2.4 -5.8', CS, 1.1, CS_XL) +
      `<circle cx="-9.5" cy="-9.8" r="1.5" fill="${CS}" stroke="${P.ink}" stroke-width=".5"/>` + `</g>` +
      sparkle(86, 30, 2.2) + sparkle(32, 40, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Cinco pistas gigantes: ocho tentáculos, ocho palabras. La caja de vidrio del oráculo, con su bandera, y el
  // tentáculo que sube del borde y la elige.
  'Pulpo Paul': (u) => {
    const k = kit(u)
    const front = 'M41 66H69V90H41Z', side = 'M69 66L76 60V84L69 90Z', top = 'M41 66L48 60H76L69 66Z'
    const lid = 'M39.6 65.6L47.2 59H77.6L70 65.6Z', lidF = 'M39.6 65.6H70V68H39.6Z', lidS = 'M70 65.6L77.6 59V61.4L70 68Z'
    const flag = 'M58 34C54 32.4 50.4 35.6 46.6 34.2C45.2 33.6 44 33.4 43 33.6V44C44 43.8 45.2 44 46.6 44.6C50.4 46 54 42.8 58 44.4Z'
    const shell = 'M-8.4 0C-7.4 -3.8 -1 -5.8 4.6 -4.8C8 -4.2 9.2 -1.8 8.4 0C3.8 2 -3.8 2 -8.4 0Z'
    const seg1 = taper(108, 88, 99, 46, 82, 40, 12, 7.4)
    const seg2 = taper(82, 40, 70, 35.4, 63.6, 44, 7.4, 3.8)
    const tipF = taper(63.6, 44, 60.4, 49.4, 56.4, 46.6, 3.8, 2.4)
    const tipB = taper(56.4, 46.6, 54.8, 42.6, 58.4, 41, 2.4, 1.2)
    const suck = (pts: { x: number; y: number; dx: number; dy: number }[], off: (i: number) => number, r: (i: number) => number) =>
      pts.map((q, i) => {
        const len = Math.hypot(q.dx, q.dy) || 1, x = q.x + (q.dy / len) * off(i), y = q.y - (q.dx / len) * off(i), rr = r(i)
        return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rr)}" ry="${f(rr * 0.82)}" fill="${P.paper}" stroke="${CS_D}" stroke-width=".4"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(rr * 0.42)}" fill="${CS_XL}" stroke="${CS_L}" stroke-width=".3"/>`
      }).join('')
    const suckers =
      suck(along(108, 88, 99, 46, 82, 40, [0.12, 0.26, 0.4, 0.54, 0.68, 0.82, 0.95]), (i) => 5.4 - i * 0.28, (i) => 1.8 - i * 0.07) +
      suck(along(82, 40, 70, 35.4, 63.6, 44, [0.2, 0.45, 0.7, 0.92]), (i) => 3.4 - i * 0.4, (i) => 1.25 - i * 0.12)
    const bubbles = [[30, 52, 1.5], [33, 44, 1.1], [30, 37, 0.8], [90, 34, 1], [86, 28, 0.7], [64, 52, 0.7], [62, 47, 0.5]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width=".45" opacity=".9"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff"/>`).join('')
    const pebbles = Array.from({ length: 22 }, (_, i) => {
      const x = 22 + i * 3.6 + Math.sin(i * 2.1) * 1.2, y = 92 + Math.sin(i * 1.3) * 1.4 + (i % 3) * 1.3
      return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(1.6 + (i % 3) * 0.4)}" ry="${f(1.1 + (i % 2) * 0.3)}" fill="${i % 3 ? CARD : CS_XL}" stroke="${CARD_D}" stroke-width=".3"/>`
    }).join('')
    const weed = (x: number, h: number, c: string) => hair(x, 94, x - 3, 94 - h * 0.5, x + 1, 94 - h, 1.4, c) + hair(x + 1.4, 94, x + 4, 94 - h * 0.4, x + 1, 94 - h * 0.75, 1.1, c)
    return (
      `<rect width="120" height="130" fill="${P.sky1}"/>` +
      k.shade(FULL, k.lin(CS, 0, 0, 0, 1, 0, 0.85), CS, 0.35) +
      [[34, 30], [54, 40], [74, 26]].map(([x, w]) => `<path d="M${x} 0H${f(x + 8)}L${f(x + w * 0.5 + 8)} 104H${f(x + w * 0.5 - 4)}Z" fill="#fff" opacity=".18"/>`).join('') +
      weed(30, 18, P.greenD) + weed(86, 14, P.green) +
      `<path d="M14 91C30 88 46 90 60 89C76 88 92 89 106 91V110H14Z" fill="${CARD}"/>` + k.shade('M14 88H106V110H14Z', k.lin(CARD_D, 0, 0, 0, 1, 0, 0.8), CARD_D, 0.3) + pebbles +
      k.floor(59, 90, 22, 2.4, CS_D) +
      // La caja de vidrio con el mejillón adentro.
      `<path d="${side}" fill="${P.white}" opacity=".3"/><path d="${top}" fill="${P.white}" opacity=".2"/>` +
      `<path d="M48 60V84L41 90M48 84H76" fill="none" stroke="${P.ink}" stroke-width=".35" opacity=".4"/>` +
      `<path d="M41.6 82C50 80.6 60 81 68.6 82V89.6H41.6Z" fill="${CARD}" opacity=".7"/>` +
      `<g transform="translate(55.4 85.2) rotate(-6)">` +
      k.draw([{ d: shell, fill: CS_D, inner: k.sh(shell, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) + `<path d="M-6 -1.2C-2 -3.6 3 -3.8 6.6 -1.4M-4.6 -.2C-1 -2 3 -2.2 5.6 -.6" fill="none" stroke="${CS_L}" stroke-width=".4"/><path d="M-6.6 -.6C-4 -2.6 0 -3.6 3 -3.4" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".85"/>` }], 0.5) +
      `<path d="M-7 .2C-3 1.6 3 1.6 7 .2" fill="none" stroke="${P.goldL}" stroke-width=".7"/><circle cx="7.4" cy="-.4" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` + `</g>` +
      `<path d="${front}" fill="${P.white}" opacity=".22"/>` +
      `<path d="M41 66H69V90H41ZM69 66L76 60V84L69 90" fill="none" stroke="${P.ink}" stroke-width=".75" stroke-linejoin="round"/>` +
      `<path d="M44 69.6L52 86M47.4 69.6L50.6 76M71.4 66L72.6 80" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".85"/>` +
      k.draw([
        { d: lidS, fill: CS_D },
        { d: lidF, fill: CS, inner: `<path d="M39.6 66.4H70" stroke="${CS_L}" stroke-width=".4"/>` },
        { d: lid, fill: CS_L, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.7, CS, 0.4) + `<path d="M42.6 65L48.4 60" stroke="#fff" stroke-width=".5" opacity=".7"/>` },
      ], 0.5) +
      `<ellipse cx="58.6" cy="62.4" rx="2.2" ry="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      // El tentáculo: la punta pasa por detrás del mástil y lo abraza.
      k.draw([{ d: tipB, fill: CS_L, inner: k.sh(tipB, 0, 0, 0, 1, 0.3, 0.9, CS_D, 0.5) }], 0.45) +
      `<path d="M58.6 62.4V33" stroke="${P.ink}" stroke-width="1.8"/><path d="M58.6 62.4V33" stroke="${P.gold}" stroke-width=".8"/><path d="M58.3 61V35" stroke="${P.goldL}" stroke-width=".3"/>` +
      k.draw([{ d: flag, fill: CS, inner: k.sh(flag, 0, 0, 1, 1, 0, 0.8, CS_D, 0.45) + `<path d="M57.6 36C54 34.4 50.4 37.6 46.6 36.2C45.2 35.6 44 35.4 43 35.6" fill="none" stroke="${CS_L}" stroke-width=".45"/>` }], 0.5) +
      `<text x="50.6" y="42.6" ${GEORGIA} font-weight="700" font-size="7" fill="${P.white}" text-anchor="middle">8</text>` +
      `<circle cx="58.6" cy="32.6" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.cast([seg1, seg2], 1.6, 2, CS_D) +
      k.draw([
        { d: seg1, fill: CS_L, inner: k.sh(seg1, 0, 0, 1, 0, 0, 0.9, CS_D, 0.5) + `<path d="M84 34H100V90H84Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0, 0.35)}"/>` + hair(102, 80, 98, 60, 90, 46, 0.5, CS_XL) },
        { d: seg2, fill: CS_L, inner: k.sh(seg2, 0, 0, 0, 1, 0, 0.9, CS_D, 0.5) + hair(80, 37.4, 74, 35.6, 68, 37.4, 0.45, CS_XL) },
      ], 0.75) +
      suckers +
      k.draw([{ d: tipF, fill: CS_L, inner: k.sh(tipF, 0, 0, 0, 1, 0, 0.9, CS_D, 0.5) }], 0.55) +
      [[94, 56, 0.8], [96.6, 68, 0.6], [90, 46, 0.6], [99, 78, 0.7], [76, 37.6, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CS_D}" opacity=".55"/>`).join('') +
      bubbles +
      k.defs()
    )
  },

  // Doce pistas maestras: todo el tablero enredado en tu tela. La araña en el centro, sobre la luna dorada.
  'Telaraña': (u) => {
    const k = kit(u)
    const cx = 60, cy = 56, N = 12
    const ang = Array.from({ length: N }, (_, i) => -Math.PI / 2 + (i / N) * Math.PI * 2 + Math.sin(i * 1.7) * 0.07)
    const pt = (i: number, r: number) => [cx + Math.cos(ang[(i + N) % N]) * r, cy + Math.sin(ang[(i + N) % N]) * r]
    const radials = ang.map((_, i) => { const [x, y] = pt(i, 52); return `M${cx} ${cy}L${f(x)} ${f(y)}` }).join('')
    const rings = [5.4, 8.6, 12, 15.6, 19.4, 23.4, 27.6, 32, 36.6, 41.4, 46.4]
    const spiral = rings.map((r, j) => ang.map((_, i) => {
      const rr = r + (i % 2 ? 0.5 : 0) + j * 0.08 * i
      const [x0, y0] = pt(i, rr), [x1, y1] = pt(i + 1, rr + 0.12), mx = (x0 + x1) / 2, my = (y0 + y1) / 2
      return `M${f(x0)} ${f(y0)}Q${f(mx + (cx - mx) * 0.1)} ${f(my + (cy - my) * 0.1)} ${f(x1)} ${f(y1)}`
    }).join('')).join('')
    const dew = [[3, 19.4], [5, 27.6], [8, 23.4], [10, 32], [1, 36.6], [7, 41.4], [11, 15.6], [4, 46.4], [9, 12], [2, 27.6], [6, 32]]
      .map(([i, r], j) => { const [x, y] = pt(i, r); return `<circle cx="${f(x)}" cy="${f(y)}" r="${j % 3 ? 0.55 : 0.8}" fill="#fff" stroke="${CS_D}" stroke-width=".2"/>` }).join('')
    const caught = (x: number, y: number, r: number, wd: string) =>
      `<g transform="translate(${x} ${y}) rotate(${r})">` + wordCard(k, 15, 10, { word: wd, lw: 0.45 }) +
      `<path d="M-8 -3L8 4M-8 3.6L7.6 -4.4M-3 -5.6L-1 5.6M4 -5.4L2.6 5.4" stroke="#fff" stroke-width=".4" opacity=".9"/></g>`
    const abdomen = 'M0 1C3.6 1 5.6 4.4 5.6 8.4C5.6 12.6 3.2 15.4 0 15.4C-3.2 15.4 -5.6 12.6 -5.6 8.4C-5.6 4.4 -3.6 1 0 1Z'
    const thorax = 'M0 -6C2.6 -6 3.8 -4.2 3.8 -2C3.8 .2 2.4 1.6 0 1.6C-2.4 1.6 -3.8 .2 -3.8 -2C-3.8 -4.2 -2.6 -6 0 -6Z'
    const legs = [[-1, -4, -8, -10, -12, -20], [-1, -3, -10, -5, -16, -12], [-1, -1.6, -10, 0, -17, 4], [-1, -.6, -8, 4, -13, 14]]
      .flatMap(([sx, y0, kx, ky, fx, fy]) => [[sx * 3, y0, kx, ky, fx, fy], [-sx * 3, y0, -kx, ky, -fx, fy]])
      .map(([x0, y0, kx, ky, fx, fy]) => `M${x0} ${y0}Q${kx} ${f(ky - 3)} ${kx} ${ky}T${fx} ${fy}`).join('')
    return (
      dusk(k, 0.44) +
      k.sun(cx, cy, 20, 50, 32, false) +
      `<circle cx="${cx}" cy="${cy}" r="20" fill="${P.goldL}"/>` + k.shade(ellipse(cx, cy, 20, 20), k.rad(P.gold, 0.4, 0.38, 0.7, 0, 1), P.goldD, 0.5) +
      [[52, 50, 3], [66, 64, 2.4], [68, 46, 1.6], [54, 66, 1.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.goldD}" stroke-width=".45" opacity=".6"/>`).join('') +
      laurel(48, 100, 27, 92, 24, 64, 8) + laurel(72, 100, 93, 92, 96, 64, 8, true) +
      `<path d="${radials}${spiral}" fill="none" stroke="${CS_XL}" stroke-width="1.2" opacity=".18"/>` +
      `<path d="${radials}" fill="none" stroke="#fff" stroke-width=".5" opacity=".95"/>` +
      `<path d="${spiral}" fill="none" stroke="#fff" stroke-width=".38" opacity=".9"/>` +
      dew +
      caught(36.6, 44, -18, 'LUNA') + caught(84, 47, 14, 'NUDO') + caught(70.6, 83.6, -6, 'TELA') +
      `<g transform="translate(${cx} ${cy - 1})">` +
      `<path d="${legs}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${legs}" fill="none" stroke="${CS_D}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([
        { d: abdomen, fill: CS, inner: k.sh(abdomen, 0, 0, 1, 1, 0, 0.9, CS_D, 0.5) + `<path d="M-4 2H-1V16H-4Z" fill="${k.lin(CS_XL, 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="${starPath(0, 8.6, 3.2, 0.9, 4)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` + `<path d="M-3.4 12.6Q0 14 3.4 12.6M-4 5Q0 3.4 4 5" fill="none" stroke="${CS_D}" stroke-width=".4"/>` },
        { d: thorax, fill: CS_D, inner: `<path d="M-2.6 -4.6C-1.6 -5.4 0 -5.6 1.2 -5" fill="none" stroke="${CS_L}" stroke-width=".5" stroke-linecap="round"/>` },
      ], 0.55) +
      `<path d="M-1.2 -6C-1.6 -7.2 -1.2 -8.2 -.4 -8.4M1.2 -6C1.6 -7.2 1.2 -8.2 .4 -8.4" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(88, 30, 2.2, P.goldL) + sparkle(30, 66, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Barrida ────────────────────────────────────────────────────────

  // Una barrida: pasaste el lampazo y te llevaste todo el tablero de una.
  'Lampazo': (u) => {
    const k = kit(u)
    const handle = roundRect(-1.9, -64, 1.9, -5, 1.9)
    const clamp = 'M-7.4 -7H7.4L6.4 0H-6.4Z'
    const sx = 54, sy = 68, N = 17
    const strands = Array.from({ length: N }, (_, i) => {
      const t = (i + 0.5) / N, x0 = 48.8 + t * 10.4, y0 = 71.4 - t * 6.6
      const xe = 33 + i * 2.7 + Math.sin(i * 2.3) * 1.4
      const ye = Math.min(90 - Math.abs(i - 8) * 0.3 + Math.sin(i * 1.7) * 1.2, 81.5 + (xe - 22.8) * 0.578 - 2.2, 81.5 + (97.2 - xe) * 0.578 - 2.2)
      const cx = (x0 + xe) / 2 + Math.sin(i * 3.1) * 3.4 - 1.6, cy = (y0 + ye) / 2 + 3.6
      return taper(x0, y0, cx, cy, xe, ye, 2.7, 2)
    })
    const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => Math.abs(b - 9) - Math.abs(a - 9))
    const drops = [[76, 73, 1.2], [70, 66, 0.9], [66, 74, 0.7], [40, 74, 0.8]].map(([x, y, r]) => `<path d="M${x} ${f(y - r * 2)}C${f(x + r)} ${f(y - r * 0.6)} ${f(x + r)} ${y} ${x} ${f(y + r * 0.2)}C${f(x - r)} ${y} ${f(x - r)} ${f(y - r * 0.6)} ${x} ${f(y - r * 2)}Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    return (
      field(k) +
      k.sun(60, 56, 15, 46, 32, false) +
      glow(k, 60, 58, 28, 26, 0.6) +
      `<path d="${ellipse(58, 88, 31, 5)}" fill="${P.sky}" opacity=".5"/>` + k.shade(ellipse(58, 88, 31, 5), k.rad(P.blue, 0.5, 0.5, 0.5, 0.7, 0), P.blue, 0.3) +
      `<path d="M78 87C82 87.6 85 88.4 87 89.4" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".9"/>` +
      `<g transform="translate(80 80) rotate(-12)">` + wordCard(k, 15, 10, { word: 'VACA', lw: 0.45 }) + `</g>` +
      `<g transform="translate(86.6 64) rotate(22)">` + wordCard(k, 15, 10, { word: 'FUEGO', lw: 0.45 }) + `</g>` +
      `<g transform="translate(77 46) rotate(-30)">` + wordCard(k, 15, 10, { word: 'PARRILLA', lw: 0.45 }) + `</g>` +
      hair(66, 84, 70, 82, 71, 79, 0.6, CS) + hair(72, 68, 76, 64, 78, 60, 0.55, CS) + hair(66, 56, 68, 51, 68, 47, 0.5, CS) +
      k.floor(54, 89.6, 22, 2.6, CS_D) +
      k.draw(order.map((i) => ({ d: strands[i], fill: i % 3 ? CS_L : CS_XL, inner: k.sh(strands[i], 0, 0, 0, 1, 0, 0.85, CS_D, 0.45) })), 0.45) +
      order.filter((i) => i % 2).map((i) => { const xe = 33 + i * 2.7 + Math.sin(i * 2.3) * 1.4; return hair(xe - 1.4, 84 + (i % 3), xe + 0.4, 82.4, xe + 2, 80 + (i % 4), 0.3, '#fff', 0.7) }).join('') +
      `<g transform="translate(${sx} ${sy}) rotate(-32)">` +
      k.draw([
        { d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + `<path d="M-1 -62V-6" stroke="${P.goldL}" stroke-width=".5"/>` + hair(0.6, -50, 1, -40, 0.4, -30, 0.35, P.brownD) + hair(0.2, -26, 0.8, -18, 0.2, -10, 0.35, P.brownD) },
        { d: clamp, fill: P.sky1, inner: k.sh(clamp, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + `<path d="M-6.6 -4.4H6.6" stroke="${P.blue}" stroke-width=".4"/><path d="M-6.8 -6.2H6.8" stroke="#fff" stroke-width=".5"/>` },
      ], 0.6) +
      `<circle cx="0" cy="-3.6" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M-.8 -3.6H.8" stroke="${P.goldD}" stroke-width=".4"/>` +
      `<path d="M-1.9 -58H1.9M-1.9 -55.6H1.9" stroke="${CS}" stroke-width="1.2"/>` +
      `</g>` +
      drops +
      sparkle(90, 34, 2) + sparkle(31, 46, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Cuatro barridas: soplaste y no quedó ni una hojita de agente. La sopladora violeta y la ventolera de hojas.
  'Sopladora de hojas': (u) => {
    const k = kit(u)
    const hood = 'M-22 -3C-23.4 -11 -19 -16 -12 -16H1C6.4 -16 10 -12.6 10 -7.4L9.6 -3Z'
    const housing = ellipse(-6, 5, 11.6, 11.6)
    const outlet = 'M1 -3.4H13.6V12.6H-1Z'
    const tube = 'M12.6 -1.2L38 4.4L36.6 11.4L12 7.6Z'
    const nozzle = 'M37 2.8L42.6 4L40.8 13.4L35.4 12.6Z'
    const handle = 'M-16.4 -15.6C-16.4 -21.6 -13.4 -24.4 -8.4 -24.4H3.6C7.6 -24.4 9 -21.8 7.8 -18.4L6.6 -15.6'
    const fins = Array.from({ length: 7 }, (_, i) => `<path d="M${-17 + i * 3} -14.4V-5" stroke="${CS_D}" stroke-width=".55"/>`).join('')
    const slots = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${f(-6 + Math.cos(a) * 3.6)} ${f(5 + Math.sin(a) * 3.6)}L${f(-6 + Math.cos(a) * 7.4)} ${f(5 + Math.sin(a) * 7.4)}" stroke="${P.mid}" stroke-width=".7"/>` }).join('')
    const wind = [[0, 1.1, 0], [5, 0.9, 2], [-5, 0.8, -3], [10, 0.7, 4], [-10, 0.6, -6]].map(([o, w, b]) => hair(78, 70 + o * 0.6, 88, 66 + o + b, 100, 62 + o * 1.3, w, CS, 0.8)).join('')
    return (
      field(k) +
      k.sun(54, 56, 14, 46, 32, false) +
      glow(k, 54, 58, 28, 26, 0.6) +
      wind +
      `<g transform="translate(84 48) rotate(-24)">` + leaf(k, P.gold, P.goldD) + `</g>` +
      `<g transform="translate(91 60) rotate(30) scale(.9)">` + leaf(k, P.brown, P.brownD) + `</g>` +
      `<g transform="translate(88 74) rotate(-50) scale(.85)">` + leaf(k, P.green, P.greenD) + `</g>` +
      `<g transform="translate(76 34) rotate(18) scale(.8)">` + leaf(k, P.goldD, P.brownD) + `</g>` +
      `<g transform="translate(87 36) rotate(-24)">` + wordCard(k, 14, 9.4, { word: 'HOJA', lw: 0.45 }) + `</g>` +
      k.floor(48, 88, 24, 2.6, CS) +
      `<g transform="translate(48 63) rotate(9) scale(.92)">` +
      k.cast([hood, housing, tube], 2, 2.2, CS_D) +
      `<path d="${handle}" fill="none" stroke="${P.ink}" stroke-width="5" stroke-linecap="round"/><path d="${handle}" fill="none" stroke="${P.night}" stroke-width="3.4" stroke-linecap="round"/><path d="M-15 -17C-15 -21.4 -12.6 -23 -8.4 -23H4" fill="none" stroke="${P.mid}" stroke-width=".6" stroke-linecap="round"/>` +
      Array.from({ length: 6 }, (_, i) => `<path d="M${f(-11 + i * 2.2)} -26V-22.8" stroke="${P.ink}" stroke-width=".5"/>`).join('') +
      `<path d="M-2 -21.6C-1.4 -19 0 -17.6 1.6 -17.2" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-2 -21.6C-1.4 -19 0 -17.6 1.6 -17.2" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
      k.draw([
        { d: tube, fill: P.sky1, inner: k.sh(tube, 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) + `<path d="M14 .4L37.6 5.8" stroke="#fff" stroke-width=".8" opacity=".9"/>` + [20, 27, 34].map((x) => `<path d="M${x} ${f(0.4 + (x - 13) * 0.22)}L${f(x - 0.8)} ${f(6.8 + (x - 13) * 0.17)}" stroke="${P.blue}" stroke-width=".45"/>`).join('') },
        { d: nozzle, fill: P.night, inner: `<path d="M37.4 4.4L42 5.4" stroke="${P.mid}" stroke-width=".6"/>` },
        { d: outlet, fill: CS, inner: k.sh(outlet, 0, 0, 0, 1, 0, 0.9, CS_D, 0.5) },
        { d: housing, fill: CS, inner: k.sh(housing, 0, 0, 1, 1, 0, 0.9, CS_D, 0.5) + `<path d="M-18 -8H-10V17H-18Z" fill="${k.lin(CS_XL, 0, 0, 1, 0, 0.5, 0)}"/>` },
        { d: hood, fill: CS_L, inner: k.sh(hood, 0, 0, 1, 1, 0, 0.9, CS, 0.5) + fins + `<path d="M-22 -16H-12V-3H-22Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` },
      ], 0.75) +
      k.draw([{ d: ellipse(-6, 5, 8.2, 8.2), fill: P.night, inner: slots + `<circle cx="-6" cy="5" r="2.6" fill="${CS_D}" stroke="${P.mid}" stroke-width=".4"/>` }], 0.4) +
      `<circle cx="-6" cy="5" r="8.2" fill="none" stroke="${P.gold}" stroke-width=".9"/><circle cx="-6" cy="5" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M-22 -8L-25.6 -9.4" stroke="${P.ink}" stroke-width=".7"/>` + k.draw([{ d: roundRect(-28.4, -12.2, -24.6, -6.6, 1.1), fill: P.night }], 0.4) +
      `<path d="M3.4 -16.2C3.4 -18.2 7 -18.2 7 -16.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M-15.4 -2.4C-13.6 -6 -10.4 -7.6 -6.6 -7.8" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".75"/>` +
      `</g>` +
      sparkle(32, 36, 2) + sparkle(62, 26, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Diez turnos perfectos: pasaste y no quedó nada en pie. El tornado, con las cartas volando alrededor.
  'Tornado': (u) => {
    const k = kit(u)
    const N = 28, Ls: string[] = [], Rs: string[] = []
    const X = (t: number) => 60 + Math.sin(t * 3.2 + 0.4) * 5 * t - t * 4, Y = (t: number) => 30 + t * 62, Wd = (t: number) => 1.6 + 30 * Math.pow(1 - t, 1.55)
    for (let i = 0; i <= N; i++) { const t = i / N; Ls.push(`${f(X(t) - Wd(t))} ${f(Y(t))}`); Rs.push(`${f(X(t) + Wd(t))} ${f(Y(t))}`) }
    const funnel = `M${Ls.join('L')}L${Rs.reverse().join('L')}Z`
    const bands = Array.from({ length: 15 }, (_, i) => {
      const t = 0.12 + i * 0.058, x = X(t), y = Y(t), w = Wd(t)
      return hair(x - w + 0.4, y + 1.4, x + w * 0.1, y + w * 0.34, x + w - 0.4, y - 1.6, 0.5 + (1 - t) * 0.55, i % 2 ? CS : CS_D, 0.85)
    }).join('')
    const lights = Array.from({ length: 7 }, (_, i) => { const t = 0.14 + i * 0.11, x = X(t), y = Y(t) + 2.2, w = Wd(t); return hair(x - w + 0.8, y, x - w * 0.4, y + w * 0.28, x + w * 0.05, y + w * 0.22, 0.55, '#fff', 0.85) }).join('')
    const billows = [[6, 37, 9], [18, 41.6, 8.4], [30, 38.4, 9], [42, 43, 8.2], [54, 40, 9.4], [66, 43.6, 8.6], [78, 39.4, 9], [90, 42.6, 8.2], [102, 38.4, 9], [114, 41, 8]]
    const sky = 'M0 0H120V38H0Z'
    const rims = billows.map(([x, y, r], i) => {
      const p = (deg: number) => [x + Math.cos((deg * Math.PI) / 180) * (r - 1.1), y + Math.sin((deg * Math.PI) / 180) * (r * 0.8 - 1.1)]
      const [x0, y0] = p(150 - (i % 3) * 8), [x1, y1] = p(56 + (i % 2) * 14), [xm, ym] = p((206 - (i % 3) * 8 + (i % 2) * 14) / 2)
      return hair(x0, y0, 2 * xm - (x0 + x1) / 2, 2 * ym - (y0 + y1) / 2, x1, y1, 0.9, P.goldL, 0.9)
    }).join('')
    const inner = billows.map(([x, y, r], i) => hair(x - r * 0.7, y - r * 0.1 - 6, x, y + r * 0.4 - 6 + (i % 2), x + r * 0.7, y - r * 0.1 - 6, 0.5, i % 2 ? CS_L : CS_D, 0.8)).join('')
    const bolt = 'M30 44L25.4 54.6H29.6L24.6 66L35 51H30.4L34.2 44Z'
    const dust = 'M38 92C40 86 48 84 54 87C58 83 66 84 68 88C74 86 80 89 78 93C70 96 46 96 38 92Z'
    const fly = (x: number, y: number, r: number, wd: string, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + wordCard(k, 14, 9.4, { word: wd, lw: 0.45 }) + `</g>`
    return (
      dusk(k, 0.62) +
      glow(k, 60, 80, 42, 24, 0.9) +
      k.shade('M0 78H120V130H0Z', k.lin(P.gold, 0, 0, 0, 1, 0, 0.55), P.goldD, 0.3) +
      `<path d="M14 94C30 91 48 92 60 92C74 92 90 91 106 94V110H14Z" fill="${CS_D}"/>` + `<path d="M14 94C30 91 48 92 60 92C74 92 90 91 106 94" fill="none" stroke="${P.goldL}" stroke-width=".6" opacity=".7"/>` +
      k.draw([{
        d: funnel, fill: CS_XL,
        inner:
          k.sh('M58 28H96V96H58Z', 0, 0, 1, 0, 0, 0.95, CS, 0.5) + `<path d="M24 28H52V96H24Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.75, 0)}"/>` +
          bands + lights,
      }], 0.8) +
      k.draw([{ d: dust, fill: CS_L, inner: k.sh(dust, 0, 0, 0, 1, 0, 0.9, CS_D, 0.5) + hair(44, 90, 52, 88, 58, 90, 0.4, CS_XL) + `<path d="M40 90C46 87 52 87 56 89" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".8"/>` }], 0.5) +
      k.draw([
        { d: sky, fill: CS, inner: k.sh(sky, 0, 0, 0, 1, 0, 0.8, CS_D, 0.5) },
        ...billows.map(([x, y, r]) => { const d = ellipse(x, y, r, f(r * 0.8)); return { d, fill: CS, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, CS_D, 0.45) + `<path d="${ellipse(x - r * 0.3, y - r * 0.3, r * 0.5, r * 0.3)}" fill="${CS_L}" opacity=".35"/>` } }),
      ], 0.75) +
      inner + rims +
      k.draw([{ d: bolt, fill: P.goldL, inner: `<path d="M30 45L26.4 54" stroke="#fff" stroke-width=".5"/>` }], 0.5) +
      fly(31, 62, -28, 'TRUCO') + fly(88, 56, 24, 'BOMBA') + fly(83, 78, -16, 'PAMPA', 0.9) + fly(36, 82, 18, 'MAR', 0.85) +
      hair(26, 70, 30, 74, 36, 74, 0.6, P.goldL) + hair(94, 66, 92, 70, 88, 72, 0.5, P.goldL) + hair(74, 52, 80, 50, 84, 46, 0.5, CS_XL) + hair(46, 70, 40, 68, 36, 66, 0.5, CS_XL) +
      [[44, 90, 0.7], [74, 88, 0.6], [78, 92, 0.5], [40, 86, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CS_XL}"/>`).join('') +
      sparkle(92, 52, 1.6, P.goldL) + sparkle(24, 76, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Kamikaze ───────────────────────────────────────────────────────

  // Tocaste al asesino: pisaste el palito. La ratonera saltó y quedó apretando la carta negra.
  'Pisó el palito': (u) => {
    const k = kit(u)
    const topF = 'M45 57H75L87 79H33Z', frontF = 'M33 79H87V83.6H33Z'
    const stp = (x: number) => `<path d="M${x} 67.8V64.8H${f(x + 2.6)}V67.8" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M${x} 67.8V64.8H${f(x + 2.6)}V67.8" fill="none" stroke="${P.sky1}" stroke-width=".7"/>`
    const spring = (x: number, sgn: number) => Array.from({ length: 5 }, (_, i) => `<ellipse cx="${f(x + sgn * i * 1.3)}" cy="66.4" rx="1" ry="2.4" fill="none" stroke="${P.ink}" stroke-width="1.3"/><ellipse cx="${f(x + sgn * i * 1.3)}" cy="66.4" rx="1" ry="2.4" fill="none" stroke="${P.sky1}" stroke-width=".5"/>`).join('')
    const bar = 'M45 67L41.4 79.6H78.6L75 67'
    const palito = 'M58.6 60.6L48 34'
    const grain = [[46, 60, 74, 60], [42, 64, 46, 64], [80, 64, 82, 64], [38, 72, 82, 72], [36, 76, 84, 76]].map(([x0, y0, x1, y1]) => hair(x0, y0, (x0 + x1) / 2, y0 + 0.6, x1, y1, 0.35, P.brownD)).join('')
    return (
      field(k) +
      stageV(k, 60, 62, 33) +
      k.floor(60, 85, 31, 3, CS_D) +
      k.draw([
        { d: frontF, fill: P.brown, inner: k.sh(frontF, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.5) + `<path d="M33 80.2H87" stroke="${P.goldL}" stroke-width=".4"/>` },
        { d: topF, fill: P.goldL, inner: k.sh(topF, 0, 0, 1, 1, 0, 0.8, P.brown, 0.45) + grain + `<path d="M30 44H50V80H30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` },
      ], 0.75) +
      // La carta negra del asesino, apretada debajo del arco.
      `<g transform="translate(60 79.4) rotate(-4)">` + wordCard(k, 30, 19, { fill: P.night, band: '#2C3566', ink: P.white, lw: 0.6 }) +
      `<path d="M-1.4 -6.6L0 -9.4L1.4 -6.6V-2.4H-1.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".2"/><path d="M-3 -2.4H3V-1.6H-3ZM-.6 -1.6H.6V.4H-.6Z" fill="${P.gold}"/>` + `</g>` +
      `<path d="${bar}" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linejoin="round"/><path d="${bar}" fill="none" stroke="${P.sky1}" stroke-width="1.2" stroke-linejoin="round"/><path d="M41.8 79H78.2" stroke="#fff" stroke-width=".4"/>` +
      `<path d="M40.4 66.4H79.6" stroke="${P.ink}" stroke-width="1.6"/><path d="M40.4 66.4H79.6" stroke="${P.sky1}" stroke-width=".6"/>` +
      spring(46.4, 1) + spring(73.6, -1) + stp(42) + stp(75.4) +
      k.draw([{ d: 'M54 58.4H64L65 62.6H53Z', fill: P.gold, inner: k.sh('M54 58.4H64L65 62.6H53Z', 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M55 60H63" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.45) +
      `<path d="${palito}" stroke="${P.ink}" stroke-width="2"/><path d="${palito}" stroke="${P.sky1}" stroke-width=".8"/><path d="M48 34L46.4 35.2" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/>` +
      hair(44, 36, 40, 34, 37, 30, 0.6, CS) + hair(46, 30, 44, 26, 44, 22, 0.55, CS) + hair(52, 34, 54, 30, 57, 28, 0.5, CS) +
      hair(30, 76, 26, 74, 24, 70, 0.6, CS) + hair(90, 76, 94, 74, 96, 70, 0.6, CS) +
      `<text x="78" y="40" ${GEORGIA} font-style="italic" font-size="6.6" fill="${CS_D}" text-anchor="middle" transform="rotate(-10 78 40)">¡crac!</text>` +
      sparkle(32, 46, 1.8, P.goldL) +
      k.defs()
    )
  },

  // Cuatro visitas al asesino: el tablero te llama. El imán de herradura violeta, y las balas que vienen derecho.
  'Imán de balas': (u) => {
    const k = kit(u)
    const cx = 74, cy = 60, R = 21, r = 9.4, x0 = 46
    const mag = `M${x0} ${cy - R}H${cx}A${R} ${R} 0 0 1 ${cx} ${cy + R}H${x0}V${f(cy + r)}H${cx}A${r} ${r} 0 0 0 ${cx} ${f(cy - r)}H${x0}Z`
    const pole = (y: number) => `M${x0} ${y}H${x0 + 8}V${f(y + R - r)}H${x0}Z`
    const field1 = [1, 2, 3].map((i) => `<path d="M${x0 - 0.6} ${f(cy - r - 2.6 - i * 0.4)}C${f(x0 - 8 - i * 6)} ${f(cy - r - 4 - i * 2)} ${f(x0 - 8 - i * 6)} ${f(cy + r + 4 + i * 2)} ${x0 - 0.6} ${f(cy + r + 2.6 + i * 0.4)}" fill="none" stroke="${CS_L}" stroke-width=".55" stroke-dasharray="1.6 1.4"/>`).join('')
    return (
      field(k) +
      k.sun(64, 58, 15, 46, 32, false) +
      glow(k, 66, 58, 28, 26, 0.6) +
      field1 +
      k.floor(68, 88, 24, 2.6, CS) +
      `<g transform="translate(2.4 2.4)">` + k.draw([{ d: mag, fill: CS_D }, { d: pole(cy - R), fill: P.blue }, { d: pole(cy + r), fill: P.blue }], 0.7) + `</g>` +
      k.draw([
        {
          d: mag, fill: CS,
          inner:
            k.sh(mag, 0, 0, 1, 1, 0, 0.9, CS_D, 0.5) + `<path d="M40 38H100V44H40Z" fill="${k.lin(CS_XL, 0, 0, 0, 1, 0.6, 0)}"/>` +
            `<path d="M${x0 + 8} ${cy - R + 2}H${cx}A${R - 2} ${R - 2} 0 0 1 ${cx} ${cy + R - 2}H${x0 + 8}" fill="none" stroke="${CS_L}" stroke-width=".5"/>` +
            hair(80, 44, 90, 52, 90, 62, 0.6, CS_XL) + hair(60, 78, 70, 79, 78, 78, 0.45, CS_D),
        },
        { d: pole(cy - R), fill: P.white, inner: k.sh(pole(cy - R), 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + `<path d="M${x0} ${cy - R + 1.4}H${x0 + 8}" stroke="#fff" stroke-width=".7"/>` },
        { d: pole(cy + r), fill: P.white, inner: k.sh(pole(cy + r), 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.5) },
      ], 0.8) +
      `<text x="${x0 + 4}" y="${cy - R + 8.2}" ${GEORGIA} font-weight="700" font-size="5" fill="${P.mid}" text-anchor="middle">N</text>` +
      `<text x="${x0 + 4}" y="${cy + r + 8.2}" ${GEORGIA} font-weight="700" font-size="5" fill="${P.mid}" text-anchor="middle">S</text>` +
      `<g transform="translate(29 44) rotate(14)">` + bullet(k) + `</g>` +
      `<g transform="translate(24.6 60.6) rotate(1)">` + bullet(k, 1.05) + `</g>` +
      `<g transform="translate(30 76) rotate(-14)">` + bullet(k) + `</g>` +
      `<g transform="translate(46.6 44.6) rotate(180)">` + bullet(k, 0.9) + `</g>` +
      hair(18, 41, 22, 41.6, 26, 43, 0.55, CS) + hair(16, 60, 19, 60, 22, 60.4, 0.55, CS) + hair(18, 80, 22, 79, 26, 77.6, 0.55, CS) +
      sparkle(89, 36, 2) + sparkle(36, 92, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Diez visitas al asesino: tocás el botón rojo sin leer el cartel. El dedo, el botón y el "NO TOCAR".
  'Dedo nuclear': (u) => {
    const k = kit(u)
    const topF = 'M45 64H75L85 80H35Z', frontF = 'M35 80H85V88H35Z'
    const bezel = ellipse(60, 71, 11, 4.4), dome = 'M51 71C51 66.6 55 64.6 60 64.6C65 64.6 69 66.6 69 71C66 72.6 54 72.6 51 71Z'
    const cover = 'M50.4 69.6L48.6 54.6C48.4 53.4 49.2 52.6 50.4 52.6H69.6C70.8 52.6 71.6 53.4 71.4 54.6L69.6 69.6Z'
    const stripes = Array.from({ length: 12 }, (_, i) => `<path d="M${33 + i * 5} 88L${37 + i * 5} 80H${39.4 + i * 5}L${35.4 + i * 5} 88Z" fill="${P.ink}"/>`).join('')
    const trefoil = (x: number, y: number, r: number) =>
      [0, 120, 240].map((a) => {
        const a0 = ((a - 30 - 90) * Math.PI) / 180, a1 = ((a + 30 - 90) * Math.PI) / 180, ri = r * 0.3
        return `<path d="M${f(x + Math.cos(a0) * ri)} ${f(y + Math.sin(a0) * ri)}L${f(x + Math.cos(a0) * r)} ${f(y + Math.sin(a0) * r)}A${r} ${r} 0 0 1 ${f(x + Math.cos(a1) * r)} ${f(y + Math.sin(a1) * r)}L${f(x + Math.cos(a1) * ri)} ${f(y + Math.sin(a1) * ri)}Z" fill="${P.ink}"/>`
      }).join('') + `<circle cx="${x}" cy="${y}" r="${f(r * 0.2)}" fill="${P.ink}"/>`
    // La mano que señala: el índice hacia +x con la yema en (0,0); los dedos doblados del lado -y.
    const index = 'M-17 -2.7H-2.6C-1 -2.7 0 -1.4 0 0C0 1.4 -1 2.7 -2.6 2.7H-17Z'
    const nail = 'M-4.2 .7H-1.6C-.9 .7 -.6 1.2 -.7 1.7L-1 2.2H-4.2Z'
    const fist = 'M-15 -3C-17 -8 -22 -11 -28 -10.4L-41 -8.4V9.4L-29 9.2C-23 9 -18.6 7.4 -15.6 2.6Z'
    const curl = roundRect(-20.6, -9.6, -10, -3, 3.2)
    const curl2 = roundRect(-25, -12.6, -14.4, -6.4, 3)
    const thumb = 'M-27 -2.6C-23 -5.6 -17 -6.6 -12 -5.4C-10 -5 -9.8 -2.6 -11.6 -2C-16 -.8 -21 .2 -25 1.6Z'
    const cuff = 'M-41 -10.4H-47V11.4H-41Z'
    const sleeve = 'M-47 -12.6H-80V14H-47Z'
    const hand = k.draw([
      { d: sleeve, fill: CS, inner: k.sh(sleeve, 0, 0, 0, 1, 0, 0.9, CS_D, 0.5) + `<path d="M-80 9H-47V14H-80Z" fill="${CS_D}" opacity=".5"/>` + hair(-52, -8, -60, -6, -70, -8, 0.45, CS_D) + hair(-52, 4, -62, 6, -72, 4, 0.45, CS_L) },
      { d: cuff, fill: P.white, inner: k.sh(cuff, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) },
      { d: curl2, fill: P.skin, inner: k.sh(curl2, 0, 0, 0, 1, 0, 0.9, P.brown, 0.45) },
      { d: fist, fill: P.skin, inner: k.sh(fist, 0, 0, 0, 1, 0, 0.8, P.brown, 0.45) + `<path d="M-40 4H-16V10H-40Z" fill="${k.lin('#ffffff', 0, 1, 0, 0, 0.5, 0)}"/>` + hair(-36, 6.4, -28, 7.4, -20, 5.4, 0.4, P.brown) },
      { d: curl, fill: P.skin, inner: k.sh(curl, 0, 0, 0, 1, 0, 0.9, P.brown, 0.45) + hair(-17, -7.4, -16, -5.6, -14.4, -4.6, 0.4, P.brown) },
      { d: index, fill: P.skin, inner: k.sh(index, 0, 0, 0, 1, 0.4, 0, P.brown, 0.4) + `<path d="M-17 .4H-3" stroke="#fff" stroke-width=".6" opacity=".7"/>` + hair(-12.6, -2.4, -12, 0, -12.6, 2.4, 0.4, P.brown) + hair(-7, -2.4, -6.6, 0, -7, 2.4, 0.35, P.brown) },
      { d: thumb, fill: P.skin, inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.8, P.brown, 0.45) },
    ], 0.65) + `<path d="${nail}" fill="${P.white}" stroke="${P.brown}" stroke-width=".3"/>` +
      `<circle cx="-44" cy="0" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-44.4" cy="-.4" r=".5" fill="${P.goldL}"/>`
    return (
      dusk(k, 0.55) +
      k.sun(60, 68, 12, 50, 32, false) +
      glow(k, 60, 66, 30, 22, 0.9) +
      k.floor(60, 89, 30, 2.4, '#000') +
      k.draw([
        { d: frontF, fill: P.gold, inner: stripes + k.sh(frontF, 0, 0, 1, 0, 0, 0.7, P.goldD, 0.45) },
        { d: topF, fill: P.sky2, inner: k.sh(topF, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="M45.6 65.4H74.4L83.4 79H36.6Z" fill="none" stroke="${P.mid}" stroke-width=".45"/>` + `<path d="M38 78H82" stroke="#fff" stroke-width=".6" opacity=".7"/>` },
      ], 0.75) +
      [[38.6, 77], [81.4, 77], [46.6, 66.4], [73.4, 66.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      k.draw([{ d: roundRect(47, 81.2, 73, 86.8, 0.6), fill: P.white, inner: trefoil(50.4, 84, 2.1) }], 0.4) +
      `<text x="62.8" y="85.6" ${GEORGIA} font-weight="700" font-size="3.3" fill="${P.red}" text-anchor="middle" letter-spacing=".1">NO TOCAR</text>` +
      `<path d="${cover}" fill="${P.sky1}" opacity=".35"/><path d="${cover}" fill="none" stroke="${P.ink}" stroke-width=".6"/><path d="M51.6 56L53 68M68.4 55L67.6 61" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".85"/>` +
      `<path d="M50.6 69.4H69.4" stroke="${P.ink}" stroke-width="1.4"/><path d="M50.6 69.4H69.4" stroke="${P.sky1}" stroke-width=".6"/>` +
      k.draw([{ d: bezel, fill: P.gold, inner: k.sh(bezel, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.55) +
      k.draw([{ d: dome, fill: P.red, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<path d="M53 69C53 67 55 65.8 57.6 65.6" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` }], 0.55) +
      `<g transform="translate(60.6 65.2) rotate(127) scale(.92)">` + hand + `</g>` +
      hair(46, 60, 42, 58, 39, 54, 0.6, P.goldL) + hair(74, 58, 78, 57, 81, 54, 0.6, P.goldL) + hair(44, 66, 40, 66, 36, 64, 0.5, P.goldL) +
      sparkle(32, 40, 2, P.goldL) + sparkle(30, 66, 1.4, P.goldL) +
      k.defs()
    )
  },
}
