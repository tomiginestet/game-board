// Los Hombres Lobo de Castronegro: la luna, el lobo de verdad (animal, sin gore) y las armas del pueblo, en clave
// heroica. Manda el índigo de la ficha del juego en el catálogo: casi todo pasa de noche.
import { f } from '../helpers'
import { along, ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** El índigo de los Hombres Lobo (el color de su ficha en el catálogo), su sombra y su luz. */
const IND = '#364FC7', IND_D = '#1E2A78', IND_L = '#9DAEF0'
/** El pelaje del lobo gris (luz, medio, sombra) y el del lobizón, casi negro. */
const FUR_L = '#DCDFEA', FUR = '#9EA5C0', FUR_D = '#5C6388', FUR_N = '#2C3150'
/** El acero de la horquilla y la plata de la bala y la campana. */
const STEEL = '#C3CADB'
const FULL = 'M0 0H120V130H0Z'

/** Varilla entintada (mango, cordón, palillo): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Noche de Castronegro: azul noche con el resplandor índigo en el medio. */
const noche = (k: Kit, cx = 0.5, cy = 0.42) => `<rect width="120" height="130" fill="${P.night}"/>` + k.shade(FULL, k.rad(IND, cx, cy, 0.62, 0.95, 0), IND, 0.55)

/** Estrellitas sueltas. */
const stars = (pts: number[][]) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')

/** Luna llena con halo, cráteres y la sombra del lado de abajo a la derecha. */
function luna(k: Kit, cx: number, cy: number, r: number, halo = 1.5) {
  const d = ellipse(cx, cy, r, r)
  const crater = (x: number, y: number, rr: number) => k.shade(ellipse(cx + x * r, cy + y * r, rr * r, rr * r), k.rad(P.sky2, 0.5, 0.5, 0.5, 0.2, 0.9), P.sky2, 0.4)
  return (
    k.shade(ellipse(cx, cy, r * halo, r * halo), k.rad(IND_L, 0.5, 0.5, 0.5, 0.8, 0), IND_L, 0.45) +
    k.draw([{
      d, fill: P.paper,
      inner:
        crater(-0.3, -0.25, 0.22) + crater(0.28, 0.12, 0.3) + crater(-0.12, 0.42, 0.16) + crater(0.38, -0.42, 0.12) + crater(-0.55, 0.15, 0.1) +
        k.sh(d, 0, 0, 1, 1, 0.1, 0.75, P.sky2, 0.45) + `<path d="${d}" fill="${k.rad('#ffffff', 0.35, 0.3, 0.5, 0.8, 0)}"/>`,
    }], 0.45)
  )
}

// ── El lobo ──────────────────────────────────────────────────────────

/** Cabeza de lobo de perfil, mirando a la izquierda, con la boca entreabierta. El cuello baja a la derecha. */
const HEAD =
  'M-27.4 -2.2C-26.8 -4.2 -25 -5.2 -22.6 -5.4C-17.6 -6.2 -12.4 -8.4 -7.8 -11.6C-5.2 -13.6 -2.6 -15 0 -15.6' +
  'C.6 -19.6 1.6 -24.4 3 -28.6C5.8 -24.8 8.4 -20.4 9.6 -16.2C10.4 -16.6 11.2 -16.8 11.8 -16.6C12.8 -20.6 14.4 -24.8 16 -27.6C18 -22.8 19 -17.2 19.2 -12.2' +
  'C22 -9 24 -4 25 1L28.4 3.2L26.2 5.4L30.4 9.4L27.6 10.8L32.4 16.4L28.8 17.4L33.6 24L31.4 25.6L35 32V46H6C5.6 34 3.6 24 .6 17.4' +
  'L-2.8 16L-1.2 13L-5.2 12.2L-3.6 9.6C-8 9.8 -13 10.6 -18.4 10.8C-20.8 10.8 -22.2 10 -22.2 9C-19.6 7.6 -14.6 5.6 -10.2 4.6' +
  'C-15.4 3 -21.6 1.6 -26.2 .8C-27.2 .6 -27.8 -1 -27.4 -2.2Z'
const EAR_F = 'M-.4 -14.6C.6 -19.6 1.6 -24.4 3 -28.6C5.8 -24.8 8.4 -20.4 9.6 -16.2C7 -14.6 2.6 -14 -.4 -14.6Z'
const EAR_B = 'M11.4 -15.6C12.6 -20.6 14.4 -24.8 16 -27.6C18 -22.8 19 -17.2 19.2 -12.2C16.6 -12.6 13.6 -13.8 11.4 -15.6Z'
const MOUTH = 'M-26.4 .4L-9.6 4.4L-22.6 9.6Z'

/** Cabeza de lobo entintada. `fur`, `light` y `dark` son los tonos del pelaje; `snarl` frunce el hocico y alarga los colmillos. */
function wolfHead(k: Kit, o: { fur: string; light: string; dark: string; snarl?: boolean; w?: number; rim?: string; shine?: number }) {
  const { fur, light, dark } = o
  const belly = 'M-27 .6C-20 2.4 -13 4 -8.6 6.4C-4 9 -1.6 13 .4 18C3 26 5 36 6.4 46H-8L-4.6 14C-9 11 -15 11 -22.6 10Z'
  const fang = (x: number, y: number, h: number) => `M${f(x - 0.9)} ${y}L${f(x + 0.1)} ${f(y + h)}L${f(x + 1)} ${f(y + 0.2)}Z`
  const big = o.snarl ? 1.35 : 1
  const teethUp = fang(-21.6, 1.3, 4.2 * big) + fang(-24.6, 0.7, 1.6) + fang(-17.6, 2.2, 1.8) + fang(-14.4, 3, 1.4)
  const teethDn = `M-21 8.8L-19.9 ${f(8.6 - 3.6 * big)}L-18.8 8.2Z` + 'M-16.4 7.6L-15.6 5.8L-14.8 7.2Z' + 'M-13.4 6.6L-12.7 5.2L-12 6.2Z'
  const tufts = [[6, 14, 2], [10, 20, 4], [14, 8, 6], [20, 16, 9], [18, 26, 12]].map(([x, y, s]) => hair(x, y, x + 2, y + s * 0.4, x + 1, y + s * 0.8 + 3, 0.5, dark)).join('')
  return (
    `<path d="${MOUTH}" fill="${P.wine}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
    `<path d="M-21.6 9.2C-18 7.2 -14 5.8 -10.4 4.8L-11.4 6.6C-14.6 7.6 -18 8.8 -21.4 10Z" fill="${P.red}"/>` +
    k.draw([{
      d: HEAD, fill: fur,
      inner:
        `<path d="${belly}" fill="${light}"/>` + k.sh(HEAD, 0, 0, 0, 1, 0.55, 0, dark, 0.4) + k.sh('M8 -30H37V48H8Z', 0, 0, 1, 0, 0, 0.8, dark, 0.45) +
        `<path d="M-28 -8H-2V-3C-10 -4 -18 -3 -28 -1Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, o.shine ?? 0.45, 0)}"/>` +
        hair(-20, -5, -14, -7, -8.4, -10.2, 0.45, dark) + hair(-4.4, -12.4, 0, -12, 4.4, -13.6, 0.45, dark) + hair(2, -10, 7, -8, 12, -9.4, 0.4, dark) +
        hair(-3, 0, 0, 4, 1, 10, 0.55, dark) + hair(2, -4, 6, 1, 6.6, 8, 0.5, dark) + hair(8, -6, 12, -1, 13, 6, 0.5, dark) + hair(14, -9, 19, -4, 20, 4, 0.5, dark) +
        tufts + hair(-12, 7.6, -8, 8, -5, 10, 0.45, light) + hair(-1, 13, 1, 18, 1.4, 24, 0.5, light, 0.9) +
        (o.snarl ? hair(-19, -6.4, -16.6, -4.8, -14, -6.6, 0.45, dark) + hair(-16.4, -7.4, -14, -5.8, -11.4, -7.8, 0.45, dark) + hair(-13.6, -8.4, -11.6, -7, -9.4, -9, 0.4, dark) : ''),
    }, { d: EAR_B, fill: dark, inner: k.sh(EAR_B, 0, 0, 1, 0, 0, 0.6, P.night, 0.4) + hair(13.2, -16, 14.6, -21, 15.6, -25, 0.45, light, 0.8) }], o.w ?? 0.75) +
    k.draw([{ d: EAR_F, fill: fur, inner: k.sh(EAR_F, 0, 0, 1, 0, 0, 0.7, dark, 0.4) + `<path d="M1.6 -16.4C2 -20.6 2.6 -24 3.2 -26.2C5 -22.6 6.6 -19.6 7.4 -16.6Z" fill="${dark}"/>` + hair(2.4, -16.4, 3.2, -21, 3.6, -24.6, 0.4, light) + hair(4.4, -16.4, 5, -20, 5, -22.6, 0.35, light, 0.8) }], 0.5) +
    `<path d="${teethUp}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3" stroke-linejoin="round"/><path d="${teethDn}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3" stroke-linejoin="round"/>` +
    `<path d="M-28.2 -2C-28.2 -4.2 -26.4 -5.4 -24.4 -5.4C-22.8 -5.4 -22.2 -4.2 -22.4 -2.8C-22.6 -1.2 -24.2 -.4 -25.8 -.4C-27.2 -.4 -28.2 -1 -28.2 -2Z" fill="${P.ink}"/>` +
    `<ellipse cx="-25.4" cy="-4.2" rx="1.2" ry=".55" fill="#fff" opacity=".8"/>` +
    `<path d="M-9.6 -8C-8.4 -10 -5.8 -10.6 -3.8 -9.6C-4.8 -7.6 -7.4 -7 -9.6 -8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/>` +
    `<circle cx="-6.6" cy="-8.8" r=".9" fill="${P.ink}"/><circle cx="-7.1" cy="-9.2" r=".3" fill="#fff"/>` +
    hair(-11, -7.4, -7, -6, -2.4, -9.8, 0.55, P.ink) + hair(-9.6, -7.4, -10.6, -5.4, -11.4, -3, 0.4, dark) +
    (o.rim
      ? hair(-2, -2, 2, 4, 2.4, 12, 0.5, light, 0.55) + hair(4, -6, 9, 0, 10, 9, 0.5, light, 0.5) + hair(10, -8, 15, -2, 17, 6, 0.45, light, 0.45) + hair(15, 4, 20, 10, 21, 20, 0.45, light, 0.4) +
        hair(-16, 2.6, -12, 4.6, -8, 4.6, 0.4, light, 0.6) + hair(-4, -11, -1, -12.6, 3, -12, 0.4, light, 0.5) +
        hair(-22, -5.2, -16, -6.4, -9, -10.4, 0.6, o.rim) + hair(-6, -12.8, -3, -14.6, -0.4, -14.8, 0.55, o.rim) + hair(1, -17, 1.8, -23, 2.8, -27.4, 0.5, o.rim) +
        hair(12.4, -17, 13.6, -22, 15.4, -26.4, 0.45, o.rim, 0.8) + hair(19.4, -11.4, 22.4, -7, 24.4, -1, 0.6, o.rim) + hair(26.4, 4.6, 29, 7.6, 30, 10, 0.5, o.rim, 0.8) + hair(29.2, 17.8, 31.6, 21, 32.6, 24.4, 0.45, o.rim, 0.7)
      : '')
  )
}

/** Melena erizada del lobizón, por detrás del cuello. */
const MANE = 'M17 -14L24 -16L22 -11L31 -10L27 -5L36 -2L30 2L39 7L33 9L41 16L35 18L42 26L36 28L42 36L36 38L40 46H24Z'

/** Lobo sentado aullando, de perfil hacia la izquierda, con las patas en (0,0). */
const HOWL =
  'M-17 -50C-16 -50.8 -14.8 -50.6 -14 -49.8C-12.4 -48 -10.6 -46 -9 -44.4C-8 -43.8 -7 -43.6 -6 -43.8' +
  'C-4.6 -45.6 -2.8 -47.6 -1 -49.2C-.4 -46.8 .4 -44.4 1.4 -42.6C3.4 -40.6 4.6 -37.6 5.4 -34.4L7.2 -33.6L6.4 -31.4L8.4 -30L7.6 -28' +
  'C9.6 -24 13.6 -20 17 -16C21 -11.6 22.4 -5 20.4 -2.6C24.4 -3.4 28.4 -2.8 31.2 -1.4C32.4 -.6 31.6 .6 30 .6H5.6' +
  'C4.6 .6 4.2 -.6 4.8 -1.6C4.6 -4 3.6 -6 2.4 -7C1.8 -5 1.6 -2.4 1.8 .6H-9C-10 .6 -10.2 -.8 -9.2 -1.6' +
  'C-8.6 -7 -8.4 -13 -9.2 -18C-10.8 -22.4 -11.8 -27 -11.4 -31L-12.8 -32.4L-11.8 -34L-13.2 -35.8' +
  'C-13.4 -38 -14 -40.4 -14.8 -42.4L-16.8 -45.4L-13.4 -45.6L-17.4 -48.6Z'

export const HOMBRESLOBO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Manada ─────────────────────────────────────────────────────────

  // Ganaste de lobo: "¡qué dientes tan grandes tenés!". El lobo con la cofia de la abuela atada con la cinta roja.
  'Caperucita engañada': (u) => {
    const k = kit(u)
    const crown = 'M.4 -17.4C3 -20.6 8 -21.8 13 -21.6C21.6 -21.2 27.8 -14.4 27.6 -5.6C27.4 2.4 22.6 8.8 15.2 11.2C11 12.6 8.4 12.6 6.4 12C2.6 4.6 .4 -6 .4 -17.4Z'
    // el volado de la cofia: una tira festoneada que enmarca la cara, de la frente a debajo de la quijada
    const N = 44, L: string[] = [], R: string[] = [], pleats: string[] = []
    along(0.2, -17.6, -1.2, -1.6, 6.6, 12.6, Array.from({ length: N + 1 }, (_, i) => i / N)).forEach((q, i) => {
      const len = Math.hypot(q.dx, q.dy) || 1, nx = -q.dy / len, ny = q.dx / len, t = i / N
      const out = 2.8 + 0.9 * Math.abs(Math.sin(t * Math.PI * 9))
      L.push(`${f(q.x + nx * out)} ${f(q.y + ny * out)}`)
      R.push(`${f(q.x - nx * 0.6)} ${f(q.y - ny * 0.6)}`)
      if (i % 5 === 2) pleats.push(hair(q.x - nx * 0.2, q.y - ny * 0.2, q.x + nx * 1.6, q.y + ny * 1.6, q.x + nx * (out - 0.4), q.y + ny * (out - 0.4), 0.4, P.blue))
    })
    const ruffle = `M${L.join('L')}L${R.reverse().join('L')}Z`
    const dots = [[6, -16], [10, -18], [16, -17], [21, -12.6], [24, -6], [23.6, 1], [8, -11], [14, -11.6], [19, -6], [18, 2], [12, 4], [7, -3], [13, -4], [20, 6.6], [9, 8]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${IND}"/>`).join('')
    const gathers = [[8, -19.6], [15, -19.6], [21.4, -15.6], [25.4, -8], [25, 0], [20.6, 7]].map(([x, y]) => hair(x, y, (x + 16) / 2 + 1, (y - 5) / 2, 16, -5, 0.45, P.sky2)).join('')
    const ribbonTie = 'M4.4 11.2C1.6 13 -2 14.2 -5.4 14.4L-5.8 16.6C-1.6 16.2 2.8 14.8 6.2 12.8Z'
    const bowL = 'M-5.4 15.4C-7.8 12.6 -12 11.8 -12.8 14.2C-13.4 16 -11 18.2 -5.4 15.4Z'
    const bowR = 'M-5.4 15.4C-4.6 12 -1.4 10.2 0 12.2C1 13.8 -.8 16.2 -5.4 15.4Z'
    const tails = 'M-6 15.8C-7.4 18.4 -8.6 21 -9 23.8L-7 23L-5.8 24.8C-5.4 21.8 -5 18.8 -4.8 16Z'
    return (
      noche(k, 0.6, 0.45) +
      stars([[52, 26, 0.6], [86, 28, 0.5], [92, 60, 0.45], [26, 66, 0.5], [70, 20, 0.4], [80, 90, 0.4]]) +
      luna(k, 38, 38, 9.4, 1.8) +
      k.floor(62, 97, 26, 3, '#000') +
      `<g transform="translate(64 58) scale(1.06)">` +
      wolfHead(k, { fur: FUR, light: FUR_L, dark: FUR_D }) +
      // la cofia de la abuela, con las orejas que se escapan por arriba
      k.draw([{
        d: crown, fill: P.white,
        inner: dots + gathers + k.sh(crown, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.5) + `<path d="M0 -18C5 -21 12 -21.4 17 -20" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>`,
      }], 0.6) +
      `<path d="M2.6 -17.4C2.2 -6 4.4 4 9 11.6" fill="none" stroke="${P.red}" stroke-width="1.1"/>` +
      k.draw([
        { d: EAR_B, fill: FUR_D, inner: k.sh(EAR_B, 0, 0, 1, 0, 0, 0.6, P.night, 0.4) },
        { d: EAR_F, fill: FUR, inner: k.sh(EAR_F, 0, 0, 1, 0, 0, 0.7, FUR_D, 0.4) + `<path d="M1.6 -16.4C2 -20.6 2.6 -24 3.2 -26.2C5 -22.6 6.6 -19.6 7.4 -16.6Z" fill="${FUR_D}"/>` + hair(2.4, -16.4, 3.2, -21, 3.6, -24.6, 0.4, FUR_L) },
      ], 0.5) +
      `<path d="M1.4 -17.4C3.4 -18.4 6.4 -18.4 9.2 -17.4M11.6 -18C14 -18.6 17 -17.4 19 -15.4" fill="none" stroke="${P.blue}" stroke-width=".6" stroke-linecap="round"/>` +
      k.draw([{ d: ruffle, fill: P.white, inner: k.sh(ruffle, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + pleats.join('') }], 0.45) +
      // la cinta roja que se ata bajo la quijada
      k.draw([
        { d: ribbonTie, fill: P.red, inner: k.sh(ribbonTie, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
        { d: tails, fill: P.red, inner: k.sh(tails, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
        { d: bowL, fill: P.red, inner: k.sh(bowL, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + hair(-7, 14.6, -9.6, 13.4, -11.6, 14, 0.35, P.wine) },
        { d: bowR, fill: P.red, inner: k.sh(bowR, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) },
      ], 0.4) +
      `<circle cx="-5.4" cy="15.4" r="1.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      sparkle(46, 44, 1.8, P.paper) + sparkle(90, 44, 1.6, P.paper) +
      k.defs()
    )
  },

  // Cuatro victorias lobunas: se te escucha desde el cerro. El lobo sentado en la piedra, recortado contra la luna llena.
  'Aullido a la luna': (u) => {
    const k = kit(u)
    const crag = 'M28 104C30 96 36 90.6 44 88.6C50 87 56 87.4 62 86.4C70 85 78 86 84 88.4C92 91.6 96 97 98 104Z'
    const wolf = `translate(57 87.2) scale(1.04)`
    return (
      noche(k, 0.48, 0.36) +
      stars([[30, 30, 0.6], [90, 34, 0.5], [26, 62, 0.45], [94, 66, 0.5], [44, 22, 0.4], [80, 22, 0.45], [34, 80, 0.4], [88, 80, 0.4]]) +
      luna(k, 56, 46, 25, 1.4) +
      // la piedra
      k.draw([{
        d: crag, fill: IND_D,
        inner:
          k.sh(crag, 0, 0, 0, 1, 0, 0.9, P.night, 0.5) + hair(36, 92, 46, 88.6, 58, 88.2, 0.7, IND_L) + hair(66, 86.6, 76, 86.2, 86, 89.6, 0.6, IND_L, 0.8) +
          hair(44, 94, 48, 98, 46, 104, 0.45, P.night) + hair(74, 92, 78, 96, 80, 104, 0.45, P.night) + hair(58, 92, 62, 95, 66, 94, 0.4, IND),
      }], 0.6) +
      // el lobo, a contraluz, con el borde iluminado por la luna
      `<g transform="${wolf}">` +
      k.draw([{
        d: HOWL, fill: IND_L,
        inner:
          `<path d="${HOWL}" fill="${FUR_N}" transform="translate(.9 1)"/>` +
          hair(-6, -36, -4, -30, -6.6, -22, 0.5, IND, 0.9) + hair(2, -34, 4, -27, 3, -20, 0.5, IND, 0.9) + hair(8, -20, 11, -14, 13, -8, 0.5, IND, 0.9) +
          hair(-9, -26, -8, -18, -7.6, -10, 0.45, IND, 0.8) + hair(20, -4, 24, -3.4, 28, -2, 0.45, IND, 0.8) + hair(-1, -40.6, 1, -39.4, 3.4, -40.4, 0.4, IND_L) +
          hair(17.4, -14, 15, -6, 7, -1.6, 0.7, IND_L, 0.85) + hair(-4.2, -16, -3.6, -8, -3.8, 0, 0.55, IND_L, 0.6) + hair(-11.4, -31, -9, -29.6, -7.6, -26, 0.5, IND_L, 0.7) + hair(-12.6, -36, -10.4, -35, -9, -32, 0.45, IND_L, 0.6),
      }], 0.6) +
      `<path d="M-15.4 -46C-13.6 -45 -12 -44 -10.8 -43.2" fill="none" stroke="${P.night}" stroke-width=".6" stroke-linecap="round"/>` +
      `<path d="M-5.6 -42.6C-4.8 -43.2 -3.8 -43.2 -3.2 -42.6" fill="none" stroke="${IND_L}" stroke-width=".5" stroke-linecap="round"/>` +
      `</g>` +
      hair(38, 34, 34, 30, 36, 25, 0.6, P.paper, 0.8) + hair(42, 31, 40, 26, 43, 22, 0.5, P.paper, 0.7) +
      sparkle(88, 50, 2, P.paper) + sparkle(30, 72, 1.5, P.paper) +
      k.defs()
    )
  },

  // Diez victorias: séptimo hijo varón y luna llena. El lobizón bajo la luna de Mayo, con la cinta celeste y blanca.
  'Lobizón': (u) => {
    const k = kit(u)
    const rid = k.id('cinta')
    const band = 'M34 84.6Q60 92.6 86 84.6V91Q60 99 34 91Z'
    const stripe = 'M34 86.8Q60 94.8 86 86.8V88.8Q60 96.8 34 88.8Z'
    const tailL = 'M34 84.6L27.6 86L30.6 88.6L28.6 92.6L34 91Z'
    const tailR = 'M86 84.6L92.4 86L89.4 88.6L91.4 92.6L86 91Z'
    return (
      noche(k) +
      k.sun(58, 48, 20, 47) +
      luna(k, 58, 48, 19, 1.05) +
      stars([[28, 30, 0.5], [92, 30, 0.5], [24, 60, 0.45], [96, 64, 0.45]]) +
      `<g transform="translate(66 58.6) scale(1.06)">` +
      k.draw([{ d: MANE, fill: '#151A33', inner: hair(22, -8, 30, -2, 33, 6, 0.6, IND_L, 0.7) + hair(26, 6, 33, 12, 36, 20, 0.6, IND_L, 0.6) + hair(28, 22, 34, 28, 36, 36, 0.5, IND_L, 0.5) }], 0.6) +
      k.cast([HEAD], 1.6, 1.6, '#000') +
      wolfHead(k, { fur: FUR_N, light: FUR, dark: '#151A33', snarl: true, w: 0.7, rim: IND_L, shine: 0.1 }) +
      `</g>` +
      // la cinta celeste y blanca
      k.draw([{ d: tailL, fill: P.sky, inner: k.sh(tailL, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) }, { d: tailR, fill: P.sky, inner: k.sh(tailR, 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) }], 0.45) +
      k.draw([{ d: band, fill: P.sky, inner: `<path d="${stripe}" fill="${P.white}"/>` + k.sh(band, 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) }], 0.5) +
      `<path id="${rid}" d="M36 89.4Q60 97 84 89.4" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">séptimo hijo</textPath></text>` +
      sparkle(86, 26, 2.4, P.goldL) + sparkle(34, 40, 1.8, P.goldL) +
      k.defs()
    )
  },

  // ── Pueblo unido ───────────────────────────────────────────────────

  // Tres victorias del pueblo: antorchas y horquillas a la plaza. La horquilla y la antorcha cruzadas, como un escudo.
  'Horquilla en mano': (u) => {
    const k = kit(u)
    const handle = 'M-1.6 36V-12H1.6V36Z'
    const ferrule = 'M-1.9 -11.6H1.9L2.2 -16.4H-2.2Z'
    const bar = 'M-8.8 -15.4C-8.8 -18.6 -5.4 -20.2 0 -20.2C5.4 -20.2 8.8 -18.6 8.8 -15.4L7 -14.8C6.4 -17 -6.4 -17 -7 -14.8Z'
    const tines = [taper(0, -19.6, 0.2, -30, 0, -41, 2.6, 0.6), taper(-7.6, -16.6, -9, -27, -7.8, -38, 2.5, 0.6), taper(7.6, -16.6, 9, -27, 7.8, -38, 2.5, 0.6)]
    const stick = 'M-1.6 34V-8H1.6V34Z'
    const wrap = 'M-2.6 -7.6H2.6L3.2 -16.4H-3.2Z'
    const steel = (d: string) => ({ d, fill: STEEL, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) })
    return (
      noche(k) +
      stars([[30, 30, 0.5], [90, 28, 0.55], [26, 64, 0.45], [94, 70, 0.5], [70, 20, 0.4]]) +
      k.shade(ellipse(44, 42, 26, 24), k.rad(P.gold, 0.5, 0.5, 0.5, 0.85, 0), P.gold, 0.5) +
      // la horquilla, hacia arriba a la derecha
      `<g transform="translate(56 70) rotate(30)">` +
      k.cast([handle, bar], 1.6, 1.6, '#000') +
      k.draw([
        { d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + hair(-0.4, 30, 0, 10, -0.4, -10, 0.35, P.goldL, 0.7) + hair(0.6, 24, 0.8, 14, 0.4, 2, 0.3, P.brownD) },
        ...tines.map(steel), steel(bar), steel(ferrule),
      ], 0.6) +
      `<path d="M-7 -17.4C-3 -18.6 3 -18.6 7 -17.4" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/><path d="M-.6 -22V-38M-8.4 -20V-35M6.8 -20V-35" stroke="#fff" stroke-width=".35" opacity=".7"/>` +
      `<path d="M-1.9 -13.6H1.9M-2 -15H2" stroke="${P.mid}" stroke-width=".4"/>` +
      `</g>` +
      // la antorcha, hacia arriba a la izquierda
      `<g transform="translate(64 70) rotate(-30)">` +
      k.cast([stick, wrap], 1.6, 1.6, '#000') +
      k.draw([
        { d: stick, fill: P.brownD, inner: k.sh(stick, 0, 0, 1, 0, 0, 0.9, P.night, 0.45) + hair(-0.5, 34, -0.2, 14, -0.6, -6, 0.4, P.brown) + `<path d="M-1.6 20L1.6 21M-1.6 8L1.6 9" stroke="${P.night}" stroke-width=".45"/>` },
        { d: wrap, fill: '#E7D5B0', inner: k.sh(wrap, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + `<path d="M-2.8 -9.6L2.8 -11.4M-3 -12.4L3 -14.2M-3.1 -15L3.1 -16.4" stroke="${P.brownD}" stroke-width=".55"/>` + k.sh(wrap, 0, 0, 0, 1, 0.8, 0, P.night, 0.4) },
      ], 0.6) +
      flame(k, 'translate(0 -15.6) scale(.4) translate(-60 -90)') +
      `</g>` +
      [[46, 26, 0.7], [54, 24, 0.5], [36, 38, 0.5], [58, 32, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}"/>`).join('') +
      k.floor(61, 96, 22, 2.4, '#000') +
      sparkle(86, 44, 2, P.paper) +
      k.defs()
    )
  },

  // Diez victorias: cargaste el arma con lo único que funciona. La bala de plata, grabada con la luna, en su gloria.
  'Bala de plata': (u) => {
    const k = kit(u)
    const head = 'M-6.4 -13.6C-6.4 -24 -4 -34 0 -40.4C4 -34 6.4 -24 6.4 -13.6Z'
    const casing = 'M-6.6 -14.4H6.6V-7L10 -1.8V25.8H-10V-1.8L-6.6 -7Z'
    const groove = 'M-8.6 25.6H8.6V28H-8.6Z'
    const rim = 'M-10.4 27.8H10.4V32H-10.4Z'
    const crescent = 'M1.4 -30C-1.4 -29.4 -3 -27 -2.7 -24.2C-2.4 -21.8 -.3 -20 2.2 -20C.5 -21 -.5 -22.8 -.5 -24.9C-.5 -27.2 .3 -29 1.4 -30Z'
    const leaf = (x: number, y: number, r: number) => `<path d="M0 0C.8 -1.2 2.4 -1.4 3 -.4C2.2 .6 .8 .8 0 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${P.goldD}"/>`
    return (
      noche(k) +
      k.sun(60, 54, 14, 47, 28, false) +
      k.shade(ellipse(60, 54, 22, 28), k.rad(IND_L, 0.5, 0.5, 0.5, 0.7, 0), IND_L, 0.45) +
      stars([[28, 30, 0.5], [92, 30, 0.5], [24, 64, 0.45], [96, 68, 0.45]]) +
      k.floor(62, 94, 16, 2.4, '#000') +
      `<g transform="translate(60 60) rotate(-10)">` +
      k.cast([head, casing, rim], 2, 1.8, '#000') +
      k.draw([
        { d: rim, fill: P.gold, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M-10.4 29.4H10.4" stroke="${P.goldL}" stroke-width=".4"/>` },
        { d: groove, fill: P.goldD, inner: k.sh(groove, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) },
        {
          d: casing, fill: P.gold,
          inner:
            k.sh(casing, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.55) + `<path d="M-10 -15H-4.4V27H-10Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
            hair(-7.4, 1, -7.8, 12, -7.4, 24, 0.8, '#fff', 0.7) + hair(-4.6, -13, -4.8, -10, -4.6, -7.6, 0.5, '#fff', 0.6) +
            `<path d="M-6.6 -7H6.6M-10 4H10M-10 20H10" stroke="${P.goldD}" stroke-width=".45"/><path d="M-6.6 -11.6H6.6" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".7 .5"/>` +
            hair(-5, 17, -2.4, 12, 0, 7, 0.45, P.goldD) + hair(5, 17, 2.4, 12, 0, 7, 0.45, P.goldD) +
            leaf(-3.4, 14.6, -130) + leaf(3.4, 14.6, -50) + leaf(-1.8, 10.4, -125) + leaf(1.8, 10.4, -55) +
            `<circle cx="0" cy="6.4" r="1.1" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` +
            `<text x="0" y="1.8" ${GEORGIA} font-weight="700" font-size="3.2" fill="${P.goldD}" text-anchor="middle">Ag</text>`,
        },
        {
          d: head, fill: STEEL,
          inner:
            k.sh(head, 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) + `<path d="M-7 -41H-2V-13H-7Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.85, 0)}"/>` +
            `<path d="${crescent}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` + `<path d="${starPath(3, -26, 1.2, 0.45, 5)}" fill="${P.goldL}"/>` +
            hair(-3, -34, -4.8, -26, -4.8, -15, 0.6, '#fff', 0.9) + hair(-5, -16, -2, -17, 2, -16.4, 0.4, P.mid) + hair(-4.4, -18.4, 0, -19, 4.4, -18.4, 0.35, P.mid, 0.7),
        },
      ], 0.8) +
      `<path d="M0 -40.4L-.5 -37" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(53.4, 19.6, 3.4, '#fff') + sparkle(34, 44, 2, P.paper) + sparkle(86, 70, 1.6, P.paper) +
      k.defs()
    )
  },

  // Veinticinco victorias: te ganaste el sillón municipal. El sillón de terciopelo índigo con el escudo del castillo negro,
  // y el bastón de mando apoyado.
  'Intendente de Castronegro': (u) => {
    const k = kit(u)
    const postL = 'M37.4 31H42V70H37.4Z', postR = 'M78 31H82.6V70H78Z'
    const crest = 'M39.4 34.6C39.4 28.6 45.6 25.2 51.6 27C54.6 23 65.4 23 68.4 27C74.4 25.2 80.6 28.6 80.6 34.6Z'
    const back = roundRect(42, 33, 78, 64.4, 2.6)
    const seat = 'M35.4 63.6H84.6L88.4 71.4H31.6Z'
    const apron = 'M31.6 71.2H88.4V77.6H31.6Z'
    const armL = 'M40 46.6C34 46.6 29.4 49.8 29.6 54.6C29.8 57.8 32 59.6 34.4 59.6C33.6 61.4 33.8 64.4 35.2 66.6H40Z'
    const armR = 'M80 46.6C86 46.6 90.6 49.8 90.4 54.6C90.2 57.8 88 59.6 85.6 59.6C86.4 61.4 86.2 64.4 84.8 66.6H80Z'
    const leg = (s: number) => `M${f(60 - s * 25.6)} 77.4C${f(60 - s * 26.4)} 82.4 ${f(60 - s * 24)} 86.6 ${f(60 - s * 25.4)} 91C${f(60 - s * 26)} 93 ${f(60 - s * 25)} 94.6 ${f(60 - s * 22.8)} 94.6H${f(60 - s * 20)}C${f(60 - s * 20.4)} 90.6 ${f(60 - s * 19.4)} 84.4 ${f(60 - s * 20.2)} 77.4Z`
    const shield = 'M53.2 21.6H66.8V29C66.8 33.4 63.8 36.2 60 37.6C56.2 36.2 53.2 33.4 53.2 29Z'
    const castle = 'M55.6 33.4V27.4H56.9V28.6H58.1V27.4H59.4V28.6H60.6V27.4H61.9V28.6H63.1V27.4H64.4V33.4Z'
    const buttons = [[48, 39], [60, 39], [72, 39], [54, 46], [66, 46], [48, 53], [60, 53], [72, 53], [54, 59.6], [66, 59.6]]
    const tufts = buttons.map(([x, y]) => hair(x - 2.6, y - 3, x, y, x + 2.6, y + 3, 0.4, IND_D) + hair(x + 2.6, y - 3, x, y, x - 2.6, y + 3, 0.4, IND_D)).join('')
    const goldSh = (d: string, dir = 1) => k.sh(d, 0, 0, dir, dir === 1 ? 0 : 1, 0, 0.9, P.goldD, 0.5)
    return (
      noche(k) +
      k.sun(60, 50, 16, 47, 28, false) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      `<g transform="translate(60 64) scale(.93) translate(-60 -64)">` +
      k.floor(61, 95, 30, 3, '#000') +
      k.cast([back, seat, apron], 2.2, 2, '#000') +
      k.draw([
        { d: leg(1), fill: P.gold, inner: goldSh(leg(1)) + hair(34.6, 80, 34, 86, 35, 92, 0.4, P.goldL) },
        { d: leg(-1), fill: P.gold, inner: goldSh(leg(-1)) },
        { d: postL, fill: P.gold, inner: goldSh(postL) + `<path d="M37.4 40H42M37.4 58H42" stroke="${P.goldD}" stroke-width=".5"/>` },
        { d: postR, fill: P.gold, inner: goldSh(postR) + `<path d="M78 40H82.6M78 58H82.6" stroke="${P.goldD}" stroke-width=".5"/>` },
        {
          d: back, fill: IND,
          inner:
            k.sh(back, 0, 0, 1, 1, 0, 0.85, IND_D, 0.5) + `<path d="M42 33H50V65H42Z" fill="${k.lin(IND_L, 0, 0, 1, 0, 0.5, 0)}"/>` + tufts +
            buttons.map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>`).join(''),
        },
        { d: seat, fill: IND, inner: k.sh(seat, 0, 0, 1, 1, 0, 0.8, IND_D, 0.45) + `<path d="M37 66C48 64.6 72 64.6 83 66" fill="none" stroke="${IND_L}" stroke-width=".7" opacity=".7"/>` },
        { d: apron, fill: P.gold, inner: goldSh(apron) + `<path d="M36 74.4C40 71.6 44 77.2 48 74.4C52 71.6 56 77.2 60 74.4C64 71.6 68 77.2 72 74.4C76 71.6 80 77.2 84 74.4" fill="none" stroke="${P.goldD}" stroke-width=".55"/>` + `<circle cx="60" cy="74.4" r="1.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` },
        { d: armL, fill: P.gold, inner: goldSh(armL) + `<path d="M31 51C34 48.4 37 48 40 48" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` },
        { d: armR, fill: P.gold, inner: goldSh(armR) },
        { d: crest, fill: P.gold, inner: goldSh(crest) + `<path d="M42 33C44 30 48 28.6 51.4 29.4M78 33C76 30 72 28.6 68.6 29.4" fill="none" stroke="${P.goldD}" stroke-width=".55"/>` + hair(54, 26.6, 60, 25, 66, 26.6, 0.5, P.goldL) },
      ], 0.75) +
      [[32.4, 54.6], [87.6, 54.6]].map(([x, y]) => `<path d="M${x} ${y}m-2.2 0a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><path d="M${x} ${y}m-1 0a1 1 0 1 1 2 0" fill="none" stroke="${P.goldD}" stroke-width=".4"/>`).join('') +
      [[39.7, 28.4], [80.3, 28.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${f(x - 0.8)}" cy="${f(y - 0.8)}" r=".7" fill="${P.goldL}"/>`).join('') +
      // el escudo de Castronegro: el castillo negro
      k.draw([{ d: shield, fill: P.white, inner: k.sh(shield, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + `<path d="${castle}" fill="${P.night}"/><path d="M59 33.4V31.2C59 30.4 61 30.4 61 31.2V33.4Z" fill="${P.goldL}"/>` + `<path d="M54.4 23H65.6" stroke="${P.gold}" stroke-width=".6"/>` }], 0.55) +
      `<path d="${shield}" fill="none" stroke="${P.gold}" stroke-width=".5" transform="translate(60 29) scale(.86) translate(-60 -29)"/>` +
      // el bastón de mando
      rod('M90.6 95.6L76 41.6', P.night, 1.8) + `<path d="M89.8 94.6L75.6 42.4" stroke="${P.mid}" stroke-width=".5"/>` +
      `<path d="M91.2 96.4L89.4 89.6" stroke="${P.gold}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<path d="M76.6 42.2C80 44 82 47 82.2 50.6" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      `<g transform="translate(82.2 51)">` + `<path d="M-1.4 0L-2 5.4H2L1.4 0Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M-.8 1V5M0 1V5.2M.8 1V5" stroke="${P.goldD}" stroke-width=".3"/><circle cx="0" cy="-.2" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` + `</g>` +
      k.draw([{ d: ellipse(75.6, 39.8, 2.8, 2.8), fill: P.gold, inner: k.sh(ellipse(75.6, 39.8, 2.8, 2.8), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.5) +
      `<circle cx="74.8" cy="39" r=".8" fill="#fff"/>` +
      `</g>` +
      sparkle(60, 18.6, 2.6, '#fff') + sparkle(30, 40, 2, P.goldL) + sparkle(92, 36, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Bocadito ───────────────────────────────────────────────────────

  // Dos veces te comieron primero: sos la entrada. La tabla de picada a la luz de la luna, con tu banderita.
  'Picadita': (u) => {
    const k = kit(u)
    const top = ellipse(60, 75, 32, 11)
    const side = 'M28 75A32 11 0 0 0 92 75V79.4A32 11 0 0 1 28 79.4Z'
    const cube = (x: number, y: number, s: number) => {
      const t = `M${x} ${f(y - s * 0.5)}L${f(x + s * 0.9)} ${y}L${x} ${f(y + s * 0.5)}L${f(x - s * 0.9)} ${y}Z`
      const l = `M${f(x - s * 0.9)} ${y}L${x} ${f(y + s * 0.5)}V${f(y + s * 1.4)}L${f(x - s * 0.9)} ${f(y + s * 0.9)}Z`
      const r = `M${x} ${f(y + s * 0.5)}L${f(x + s * 0.9)} ${y}V${f(y + s * 0.9)}L${x} ${f(y + s * 1.4)}Z`
      return k.draw([{ d: l, fill: P.gold, inner: `<circle cx="${f(x - s * 0.45)}" cy="${f(y + s * 0.75)}" r="${f(s * 0.14)}" fill="${P.goldD}"/>` }, { d: r, fill: P.goldD, inner: `<circle cx="${f(x + s * 0.5)}" cy="${f(y + s * 0.8)}" r="${f(s * 0.12)}" fill="${P.brownD}" opacity=".6"/>` }, { d: t, fill: P.goldL, inner: `<circle cx="${f(x + s * 0.2)}" cy="${y}" r="${f(s * 0.12)}" fill="${P.gold}"/>` }], 0.4)
    }
    const salame = (x: number, y: number, r: number) => {
      const d = ellipse(x, y, 5.2, 3.4)
      const dots = [[-2, -0.6], [1.4, -1.2], [2.6, 0.8], [-0.6, 1.2], [0.4, -0.2], [-3, 0.8]].map(([dx, dy]) => `<circle cx="${f(x + dx)}" cy="${f(y + dy)}" r=".45" fill="${P.white}"/>`).join('')
      return `<g transform="rotate(${r} ${x} ${y})">` + k.draw([{ d, fill: P.red, inner: `<path d="${ellipse(x, y, 4.4, 2.7)}" fill="${P.wine}" opacity=".5"/>` + dots + k.sh(d, 0, 0, 1, 1, 0, 0.6, P.wine, 0.3) }], 0.45) + `</g>`
    }
    const olive = (x: number, y: number) => k.draw([{ d: ellipse(x, y, 2.4, 1.8), fill: P.green, inner: k.sh(ellipse(x, y, 2.4, 1.8), 0, 0, 1, 1, 0, 0.9, P.greenD, 0.4) + `<circle cx="${f(x + 0.6)}" cy="${f(y - 0.3)}" r=".7" fill="${P.red}"/>` }], 0.4) + `<circle cx="${f(x - 1)}" cy="${f(y - 0.7)}" r=".4" fill="#fff"/>`
    const pick = (x0: number, y0: number, x1: number, y1: number) => rod(`M${x0} ${y0}L${x1} ${y1}`, P.goldL, 0.7)
    const flag = 'M51.4 51.4L60.4 53.2L51.4 56.2Z'
    return (
      noche(k) +
      stars([[30, 32, 0.6], [88, 30, 0.5], [24, 62, 0.45], [96, 60, 0.5], [46, 22, 0.4]]) +
      luna(k, 80, 38, 11, 1.6) +
      k.floor(61, 84, 34, 4, '#000') +
      k.draw([
        { d: side, fill: P.brownD, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
        { d: top, fill: P.brown, inner: k.sh(top, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="${ellipse(60, 75, 26, 8.6)} ${ellipse(60, 75, 18, 5.8)} ${ellipse(60, 75, 9, 2.8)}" fill="none" stroke="${P.brownD}" stroke-width=".45"/>` + `<path d="M34 72C40 67.6 52 66 62 66" fill="none" stroke="#FFE3C2" stroke-width=".8" opacity=".6"/>` },
      ], 0.7) +
      // los rasguños del lobo en el borde de la tabla
      hair(78, 80.6, 80, 82, 82.4, 82.6, 0.5, P.night) + hair(79.6, 79.6, 81.6, 81, 84, 81.6, 0.5, P.night) + hair(81.4, 78.6, 83.4, 80, 85.6, 80.4, 0.45, P.night) +
      salame(70, 71.6, -8) + salame(76, 75.4, 6) + salame(66.6, 78, -2) +
      olive(46, 81) + olive(80, 70.4) +
      pick(53.4, 70.2, 51.4, 51.4) + pick(44.6, 73, 41, 60) +
      cube(54, 70, 5.4) + cube(44, 74, 5) + cube(54.6, 78.6, 4.8) +
      k.draw([{ d: flag, fill: P.white, inner: k.sh(flag, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) }], 0.4) +
      `<text x="54.6" y="54.8" ${GEORGIA} font-style="italic" font-size="2.6" fill="${P.red}" text-anchor="middle">vos</text>` +
      `<circle cx="41" cy="60" r="1.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(34, 44, 1.8, P.paper) + sparkle(92, 76, 1.4, P.paper) +
      k.defs()
    )
  },

  // Seis veces devorado de arranque: el chori antes del asado. El choripán con el tarascón del lobo.
  'Choripán de lobo': (u) => {
    const k = kit(u)
    const bunTop = 'M-27 -1.6C-27.4 -7.6 -21 -11.4 -11 -11.4H13C21 -11.4 26.4 -7.6 26 -1.6C18 -3.6 -18 -3.6 -27 -1.6Z'
    const chori = roundRect(-31.4, -5, 30.6, 3.8, 4.4)
    const bunBot = 'M-28 .6C-28.4 6 -22 9.4 -12 9.4H14C22 9.4 27.6 6 27 .6C18 2.6 -18 2.6 -28 .6Z'
    const all = `${bunTop} ${chori} ${bunBot}`
    const cx = 25.6, cy = -1
    const zig = Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2, r = i % 2 ? 9.2 : 11
      return `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r * 1.05)}`
    })
    const bite = `M${zig.join('L')}Z`
    const cid = k.id('mordida')
    const napkin = 'M-30 4L-4 -16L32 2L4 22Z'
    return (
      noche(k) +
      stars([[30, 30, 0.6], [92, 34, 0.5], [26, 66, 0.45], [94, 66, 0.5], [70, 22, 0.4]]) +
      luna(k, 42, 38, 12, 1.6) +
      k.floor(61, 88, 30, 3.4, '#000') +
      `<g transform="translate(60 68) rotate(-12)">` +
      k.draw([{ d: napkin, fill: P.white, inner: k.sh(napkin, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + `<path d="M-25.6 4L-4 -12.6L27.4 2.2L4 18.4Z" fill="none" stroke="${IND}" stroke-width=".7"/><path d="M-23 4L-4 -10.6L24.8 2.2L4 16.2Z" fill="none" stroke="${IND}" stroke-width=".4"/>` }], 0.5) +
      `<clipPath id="${cid}"><path d="M-40 -30H40V30H-40Z ${bite}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${cid})">` +
      k.cast([all], 1.6, 1.8, P.night) +
      k.draw([
        { d: bunBot, fill: P.goldD, inner: k.sh(bunBot, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M-26 2.6C-18 4 18 4 25.6 2.6" fill="none" stroke="#FFE3C2" stroke-width=".6" opacity=".7"/>` },
        {
          d: chori, fill: P.red,
          inner:
            k.sh(chori, 0, 0, 0, 1, 0, 0.9, P.wine, 0.5) + [-22, -14, -6, 2, 10, 18].map((x) => `<path d="M${x - 1.4} -4.6L${x + 1.4} 3.6" stroke="${P.night}" stroke-width=".9" opacity=".7"/>`).join('') +
            `<path d="M-28 -3.4H26" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".45"/>` +
            [[-18, -2], [-10, -1], [-2, -2.4], [6, -1.4], [14, -2.2], [-24, -1.6]].map(([x, y]) => `<path d="M${x} ${y}l1.4 -.6l.4 1.2z" fill="${P.green}"/>`).join(''),
        },
        { d: bunTop, fill: P.gold, inner: k.sh(bunTop, 0, 0, 1, 1, 0, 0.85, P.goldD, 0.5) + `<path d="M-22 -8C-14 -10.4 0 -10.8 8 -10.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>` + hair(-18, -6, -8, -7.6, 2, -7.2, 0.45, P.goldD) + hair(4, -6, 12, -7.4, 20, -6, 0.45, P.goldD) },
      ], 0.65) +
      // la miga y la carne que deja el tarascón
      k.clip(`${bunTop} ${bunBot}`, `<path d="${bite}" fill="none" stroke="#F4E3BE" stroke-width="3"/>`) +
      k.clip(chori, `<path d="${bite}" fill="none" stroke="#E58A86" stroke-width="3"/>`) +
      k.clip(all, `<path d="${bite}" fill="none" stroke="${P.ink}" stroke-width=".9"/>`) +
      `</g>` +
      // gotas de chimichurri
      [[-12, 9.6], [6, 9.8]].map(([x, y]) => `<path d="M${x} ${y}c.8 1 1.2 1.8 1.2 2.4a1.2 1.2 0 0 1 -2.4 0c0 -.6 .4 -1.4 1.2 -2.4z" fill="${P.green}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `</g>` +
      hair(48, 54, 45, 48, 48.6, 42, 0.6, P.paper, 0.7) + hair(56, 52, 59, 46, 56, 40, 0.55, P.paper, 0.6) +
      sparkle(88, 44, 2, P.paper) + sparkle(30, 76, 1.5, P.paper) +
      k.defs()
    )
  },

  // Quince veces el primero en caer: los lobos te esperan con servilleta. La campana de plata, con cubiertos cruzados.
  'Plato principal': (u) => {
    const k = kit(u)
    const dome = 'M33.4 80C33.4 63.4 45 50.6 60 50.6C75 50.6 86.6 63.4 86.6 80Z'
    const rimBand = 'M31.4 79.6H88.6V82.6C80 84.6 40 84.6 31.4 82.6Z'
    const platter = ellipse(60, 83.4, 34, 7)
    const handle = 'M53.4 51C53.4 46 56.4 43.4 60 43.4C63.6 43.4 66.6 46 66.6 51'
    const knife = 'M-1.6 30V2H1.6V30Z'
    const blade = 'M-1.8 2V-28C-1.8 -32 0 -34 2.4 -34C2.4 -22 2.2 -10 1.8 2Z'
    const fork = 'M-1.4 30V0H1.4V30Z'
    const forkHead = 'M-4.6 -18V-6C-4.6 -2 -2 0 0 0C2 0 4.6 -2 4.6 -6V-18H3.4V-6.6H1.6V-18H.6V-6.6H-.6V-18H-1.6V-6.6H-3.4V-18Z'
    const scroll = Array.from({ length: 6 }, (_, i) => {
      const x = 38 + i * 8.8
      return `<path d="M${x} 77.2C${f(x + 1.6)} 73.8 ${f(x + 5)} 73.8 ${f(x + 5.4)} 76.4C${f(x + 5.6)} 78 ${f(x + 3.6)} 78.4 ${f(x + 3)} 77" fill="none" stroke="${P.blue}" stroke-width=".5"/>`
    }).join('')
    return (
      noche(k) +
      k.sun(60, 54, 22, 48, 28, false) +
      luna(k, 60, 52, 21, 1.1) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      // cuchillo y tenedor cruzados por detrás
      `<g transform="translate(60 62) rotate(-40)">` +
      k.draw([
        { d: knife, fill: P.white, inner: k.sh(knife, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M-1.6 8H1.6M-1.6 24H1.6" stroke="${P.blue}" stroke-width=".4"/>` },
        { d: blade, fill: STEEL, inner: k.sh(blade, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) + `<path d="M-1 0V-28" stroke="#fff" stroke-width=".5"/>` },
      ], 0.55) + `</g>` +
      `<g transform="translate(60 62) rotate(40)">` +
      k.draw([
        { d: fork, fill: P.white, inner: k.sh(fork, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M-1.4 8H1.4M-1.4 24H1.4" stroke="${P.blue}" stroke-width=".4"/>` },
        { d: `M-1.4 0V-8H1.4V0Z`, fill: STEEL },
        { d: `M-4.6 -32V-14C-4.6 -10 -2 -8 0 -8C2 -8 4.6 -10 4.6 -14V-32H3.4V-14.6H1.6V-32H.6V-14.6H-.6V-32H-1.6V-14.6H-3.4V-32Z`, fill: STEEL, inner: k.sh(forkHead, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) },
      ], 0.55) + `</g>` +
      // la fuente y la campana
      k.floor(61, 89, 32, 3, '#000') +
      k.draw([{ d: platter, fill: STEEL, inner: k.sh(platter, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="${ellipse(60, 83.4, 30, 5.4)}" fill="none" stroke="${P.blue}" stroke-width=".5"/><path d="${ellipse(60, 83.4, 32, 6.2)}" fill="none" stroke="${P.gold}" stroke-width=".45" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` }], 0.6) +
      k.cast([dome], 1.8, 1.6, '#000') +
      rod(handle, P.gold, 2.2) + `<path d="M54.4 49.6C54.6 46.4 57 44.4 60 44.4" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      k.draw([
        {
          d: dome, fill: P.white,
          inner:
            `<path d="${dome}" fill="${STEEL}"/>` + k.sh(dome, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<path d="M33 50H46V82H33Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.85, 0)}"/>` +
            k.shade(ellipse(70, 62, 4.6, 3.4), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.6) +
            `<path d="M39 72C39 63 44.4 56.4 51 53.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".95"/>` +
            `<path d="M35.6 75.4C46 72.6 74 72.6 84.4 75.4" fill="none" stroke="${P.blue}" stroke-width=".5"/>` + scroll +
            hair(78, 62, 82, 68, 83, 76, 0.5, IND_D, 0.8),
        },
        { d: rimBand, fill: P.gold, inner: k.sh(rimBand, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M31.4 80.6H88.6" stroke="${P.goldL}" stroke-width=".5"/>` },
      ], 0.75) +
      `<circle cx="60" cy="51" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      // la servilleta atada al tenedor
      sparkle(60, 18, 3, '#fff') + sparkle(32, 44, 2, P.goldL) + sparkle(90, 50, 1.6, P.goldL) +
      k.defs()
    )
  },
}
