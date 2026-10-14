// Natación, en clave heroica. Los objetos de la pileta: el patito de goma con antiparras, el agua con su andarivel
// de flotadores, la pared de azulejos con la T de llegada y la gorra firmada con el marcador.
// A las personas reales (Meolans) no se las dibuja: aparecen por sus objetos.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Agua de pileta, con su sombra y su brillo. */
const WATER = '#8FB8E2', WATER_D = '#5A82C2', WATER_L = '#CFE2F4'
/** Pico naranja del patito. */
const BEAK = '#E58A3A', BEAK_D = '#B05A22'

/** Andarivel: flotadores alternados entre (x0,y) y (x1,y). */
function laneRope(k: Kit, x0: number, x1: number, y: number, r = 2.2) {
  const n = Math.floor((x1 - x0) / (r * 2.2))
  let out = `<path d="M${x0} ${y}H${x1}" stroke="${P.ink}" stroke-width=".8"/>`
  for (let i = 0; i < n; i++) {
    const x = x0 + r * 1.1 + i * r * 2.2, d = roundRect(f(x - r), f(y - r), f(x + r), f(y + r), f(r * 0.7))
    const c = i % 4 < 2 ? P.red : P.white
    out += k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, c === P.red ? P.wine : P.blue, 0.4) + `<path d="M${f(x - r * 0.6)} ${f(y - r * 0.5)}H${f(x + r * 0.4)}" stroke="#fff" stroke-width=".5" opacity=".8"/>` }], 0.35)
  }
  return out
}

/** Burbujas: círculos con contorno y brillo. */
const bubbles = (pts: number[][]) =>
  pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${WATER_L}" fill-opacity=".5" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff"/>`).join('')

// ── El patito de goma: de perfil, mirando a la izquierda, la línea de flotación en y≈4 ─────────────────────

const DUCK_BODY = 'M-18.4 1C-19.4 -4.6 -14.4 -8.6 -6 -8.4C0 -8.2 5.6 -7.4 9.6 -9.4C12.6 -11 14.4 -14 15.4 -17.6C18.8 -14.6 20.6 -8.4 19.4 -2C18 5 10.6 9.2 .4 9.2C-9.4 9.2 -17.4 6.6 -18.4 1Z'
const DUCK_HEAD = ellipse(-8.6, -16, 9, 8.6)
const BEAK_D_ = 'M-16.4 -15.4C-20.4 -16.4 -23.6 -15.2 -24.2 -13.2C-22.8 -11.6 -19.4 -11 -16 -11.8Z'

function duck(k: Kit) {
  const wing = 'M-2 -3.4C2 -6.4 8 -6 11.4 -2.6C9.6 .8 4.4 2.4 -.4 .6C-2 0 -2.8 -1.8 -2 -3.4Z'
  return (
    k.draw([
      { d: BEAK_D_, fill: BEAK, inner: k.sh(BEAK_D_, 0, 0, 0, 1, 0, 0.8, BEAK_D, 0.45) + `<path d="M-23.4 -13.4C-21 -13.6 -18.6 -13.4 -16.2 -13.6" stroke="${BEAK_D}" stroke-width=".5" fill="none"/>` },
      {
        d: DUCK_BODY, fill: P.gold,
        inner: k.sh(DUCK_BODY, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="M-20 -10H-4V10H-20Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` +
          `<path d="${wing}" fill="${P.goldD}" opacity=".35"/><path d="M-1 -1.6C3 -3.6 7 -3.4 10 -2" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
          hair(-16, -1, -12, -6.6, -5, -7.2, 0.8, '#fff', 0.85),
      },
      {
        d: DUCK_HEAD, fill: P.gold,
        inner: k.sh(DUCK_HEAD, 0, 0, 1, 1, 0, 0.85, P.goldD, 0.45) + `<ellipse cx="-12" cy="-20.6" rx="3" ry="1.8" fill="#fff" opacity=".8" transform="rotate(-30 -12 -20.6)"/>`,
      },
    ], 0.75) +
    // Antiparras: la tira alrededor de la cabeza y el lente al frente.
    `<path d="M-14.6 -17.4C-10 -18.4 -4 -18 .2 -15.4" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M-14.6 -17.4C-10 -18.4 -4 -18 .2 -15.4" fill="none" stroke="${P.red}" stroke-width="1.3" stroke-linecap="round"/>` +
    k.draw([{ d: ellipse(-13.4, -16.8, 3.4, 3), fill: P.sky, inner: `<path d="M-16 -18.4A3 3 0 0 1 -12 -19.4" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` + k.sh(ellipse(-13.4, -16.8, 3.4, 3), 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) }], 0.6) +
    `<path d="M-13.6 -14.4A2.6 2.6 0 0 0 -11.2 -15.6" fill="none" stroke="${P.white}" stroke-width=".4"/>`
  )
}

// ── El delfín: un tubo que se afina a lo largo de una curva, con aletas ────────────────────────────────

/** Delfín dando la vuelta: la cabeza en (hx,hy), la curva por (cx,cy) y la cola en (tx,ty). */
function dolphin(k: Kit, hx: number, hy: number, cx: number, cy: number, tx: number, ty: number, body = P.blue, dark = P.mid) {
  const d = taper(hx, hy, cx, cy, tx, ty, 12, 2.6)
  const head = ellipse(hx, hy, 6.2, 6)
  // Hocico hacia afuera de la curva, en la dirección contraria a la del control.
  const ax = hx - cx, ay = hy - cy, al = Math.hypot(ax, ay), ux = ax / al, uy = ay / al
  const snout = `M${f(hx + ux * 4 - uy * 2)} ${f(hy + uy * 4 + ux * 2)}C${f(hx + ux * 9 - uy * 2)} ${f(hy + uy * 9 + ux * 2)} ${f(hx + ux * 11 - uy * 0.4)} ${f(hy + uy * 11 + ux * 0.4)} ${f(hx + ux * 10.6 + uy * 1)} ${f(hy + uy * 10.6 - ux * 1)}C${f(hx + ux * 9 + uy * 2)} ${f(hy + uy * 9 - ux * 2)} ${f(hx + ux * 6 + uy * 3)} ${f(hy + uy * 6 - ux * 3)} ${f(hx + ux * 4 + uy * 3)} ${f(hy + uy * 4 - ux * 3)}Z`
  // Cola: dos lóbulos perpendiculares a la tangente final.
  const bx = tx - cx, by = ty - cy, bl = Math.hypot(bx, by), vx = bx / bl, vy = by / bl
  const fluke = `M${f(tx - vx)} ${f(ty - vy)}C${f(tx + vx * 2 - vy * 4)} ${f(ty + vy * 2 + vx * 4)} ${f(tx + vx * 6 - vy * 8)} ${f(ty + vy * 6 + vx * 8)} ${f(tx + vx * 7 - vy * 9)} ${f(ty + vy * 7 + vx * 9)}` +
    `C${f(tx + vx * 5 - vy * 4)} ${f(ty + vy * 5 + vx * 4)} ${f(tx + vx * 5 + vy * 4)} ${f(ty + vy * 5 - vx * 4)} ${f(tx + vx * 7 + vy * 9)} ${f(ty + vy * 7 - vx * 9)}` +
    `C${f(tx + vx * 6 + vy * 8)} ${f(ty + vy * 6 - vx * 8)} ${f(tx + vx * 2 + vy * 4)} ${f(ty + vy * 2 - vx * 4)} ${f(tx - vx)} ${f(ty - vy)}Z`
  // Aleta dorsal, hacia afuera de la curva, cerca de la mitad.
  const m = { x: 0.25 * hx + 0.5 * cx + 0.25 * tx, y: 0.25 * hy + 0.5 * cy + 0.25 * ty }
  const ox = m.x - (hx + tx) / 2, oy = m.y - (hy + ty) / 2, ol = Math.hypot(ox, oy), nx = ox / ol, ny = oy / ol
  const mx = m.x + nx * 3, my = m.y + ny * 3
  const dorsal = `M${f(mx - ny * 5)} ${f(my + nx * 5)}C${f(mx + nx * 4)} ${f(my + ny * 4)} ${f(mx + nx * 8 + ny * 3)} ${f(my + ny * 8 - nx * 3)} ${f(mx + nx * 9 + ny * 6)} ${f(my + ny * 9 - nx * 6)}C${f(mx + nx * 4 + ny * 4)} ${f(my + ny * 4 - nx * 4)} ${f(mx + ny * 4)} ${f(my - nx * 4)} ${f(mx + ny * 5)} ${f(my - nx * 5)}Z`
  // Aleta pectoral, hacia adentro, cerca de la cabeza.
  const p = { x: 0.64 * hx + 0.32 * cx + 0.04 * tx, y: 0.64 * hy + 0.32 * cy + 0.04 * ty }
  const pect = `M${f(p.x)} ${f(p.y)}C${f(p.x - nx * 6)} ${f(p.y - ny * 6)} ${f(p.x - nx * 9 + ny * 3)} ${f(p.y - ny * 9 - nx * 3)} ${f(p.x - nx * 10 + ny * 5)} ${f(p.y - ny * 10 - nx * 5)}C${f(p.x - nx * 6 + ny * 5)} ${f(p.y - ny * 6 - nx * 5)} ${f(p.x + ny * 4)} ${f(p.y - nx * 4)} ${f(p.x + ny * 3)} ${f(p.y - nx * 3)}Z`
  const belly = taper(f(hx - nx * 3), f(hy - ny * 3), f(cx - nx * 4), f(cy - ny * 4), f(tx - nx * 1), f(ty - ny * 1), 6, 1)
  return (
    k.draw([
      { d: dorsal, fill: body, inner: k.sh(dorsal, 0, 0, 1, 1, 0, 0.8, dark, 0.45) },
      { d: fluke, fill: body, inner: k.sh(fluke, 0, 0, 1, 1, 0, 0.8, dark, 0.45) },
      { d: snout, fill: body },
      { d: d + head, fill: body, inner: `<path d="${belly}" fill="${P.sky1}"/>` + k.sh(d + head, 0, 0, 1, 1, 0, 0.8, dark, 0.45) + hair(f(mx - nx * 4), f(my - ny * 4), f(cx + nx * 2), f(cy + ny * 2), f(tx), f(ty), 0.6, '#fff', 0.6) },
      { d: pect, fill: dark },
    ], 0.75) +
    `<circle cx="${f(hx + ux * 1.4 + nx * 2.6)}" cy="${f(hy + uy * 1.4 + ny * 2.6)}" r=".9" fill="${P.ink}"/>` +
    `<path d="M${f(hx + ux * 4.4 - uy * 1.6)} ${f(hy + uy * 4.4 + ux * 1.6)}Q${f(hx + ux * 7)} ${f(hy + uy * 7)} ${f(hx + ux * 10)} ${f(hy + uy * 10)}" fill="none" stroke="${P.ink}" stroke-width=".45"/>`
  )
}

// ── La gorra de natación: de frente, el borde en y≈8 ───────────────────────────────────────────────────

const CAP = 'M-23 7.6C-24.2 -8.4 -14.4 -21 0 -21C14.4 -21 24.2 -8.4 23 7.6C14 11 -14 11 -23 7.6Z'

export const NATACION_ART: Record<string, (u: number) => string> = {
  // ── Pez ───────────────────────────────────────────────────────────

  // Tres ganadas: el patito de goma con antiparras, flotando con estilo entre las ondas.
  'Patito de goma': (u) => {
    const k = kit(u)
    const water = 'M18 72C26 70 34 74 42 72C50 70 58 74 66 72C74 70 82 74 90 72C94 71 98 72 102 72V110H18Z'
    return (
      k.day() +
      k.stage(60, 56, 34) +
      k.clip(ellipse(60, 56, 34, 34),
        `<path d="${water}" fill="${WATER}"/>` + k.sh(water, 0, 0, 0, 1, 0, 0.8, WATER_D, 0.4) +
        `<path d="M24 80C30 78.6 36 81 42 80M70 84C76 82.6 82 85 88 84M36 88C42 86.6 48 89 54 88" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>`) +
      `<path d="${water.split('V')[0]}" fill="none" stroke="${P.ink}" stroke-width=".8"/>` +
      k.cast([DUCK_BODY, DUCK_HEAD], 2, 1.6, WATER_D) +
      `<g transform="translate(62 66) scale(1.22)">` + duck(k) + `</g>` +
      // La línea de flotación: el agua tapa la panza del pato.
      k.clip(ellipse(60, 56, 34, 34), `<path d="M30 74.6C36 72.6 44 76.4 52 74.6C60 72.8 68 76.6 76 74.6C82 73 88 75 92 74.6V80H30Z" fill="${WATER}" opacity=".85"/>`) +
      `<path d="M34 74.6C40 72.6 46 76.4 52 74.6C60 72.8 68 76.6 76 74.6C82 73 86 75 88 74.6" fill="none" stroke="${P.white}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="${ellipse(62, 76, 30, 4)}" fill="none" stroke="${P.white}" stroke-width=".5" stroke-dasharray="1.4 1.2" opacity=".9"/>` +
      `<text x="82" y="42" ${GEORGIA} font-style="italic" font-weight="700" font-size="6" fill="${P.ink}" text-anchor="middle" transform="rotate(12 82 42)">¡cuac!</text>` +
      sparkle(34, 40, 2) + sparkle(44, 30, 1.4) +
      k.defs()
    )
  },

  // Diez ganadas: el delfín dando la vuelta olímpica contra la pared de azulejos, al lado del andarivel.
  'Delfín de pileta': (u) => {
    const k = kit(u)
    const wall = 'M82 20H110V110H82Z'
    const tiles = Array.from({ length: 12 }, (_, i) => `M82 ${24 + i * 6}H110`).join('') + Array.from({ length: 5 }, (_, i) => `M${86 + i * 6} 20V110`).join('')
    const target = 'M82 60H90V62.6H85.6V68.6H82Z'
    const water = 'M0 38H82V130H0Z'
    return (
      k.day() +
      `<path d="${water}" fill="${WATER}"/>` + k.sh(water, 0, 0, 0, 1, 0, 0.9, WATER_D, 0.45) +
      [44, 56, 70, 84].map((y, i) => `<path d="M${10 + i * 6} ${y}C${24 + i * 6} ${y - 2} ${36 + i * 6} ${y + 2} ${50 + i * 6} ${y}" fill="none" stroke="${WATER_L}" stroke-width=".6" opacity=".7"/>`).join('') +
      k.draw([{ d: wall, fill: P.white, inner: `<path d="${tiles}" stroke="${P.sky}" stroke-width=".5"/>` + `<path d="M82 38H110V110H82Z" fill="${WATER}" opacity=".55"/>` + `<path d="${target}" fill="${P.night}"/>` + k.sh(wall, 0, 0, 1, 0, 0.3, 0, P.blue, 0.4) }], 0.6) +
      `<path d="M0 38H82" stroke="${P.ink}" stroke-width=".9"/><path d="M0 38H82" stroke="${P.white}" stroke-width=".4"/>` +
      laneRope(k, 18, 82, 38, 2) +
      `<path d="M58 40C56 46 46 50 40 46" fill="none" stroke="${P.white}" stroke-width=".7" stroke-dasharray="1.2 1" opacity=".9"/>` +
      dolphin(k, 72, 82, 24, 64, 68, 44) +
      bubbles([[76, 54, 1.6], [79, 49, 1.1], [74.6, 46, 0.9], [44, 82, 1.2], [40, 86, 0.8], [78, 64, 1]]) +
      hair(46, 92, 56, 96, 68, 93, 0.8, WATER_D, 0.8) + hair(44, 88, 52, 91.6, 60, 90, 0.6, WATER_D, 0.7) +
      sparkle(32, 30, 2) + sparkle(64, 28, 1.6) +
      k.defs()
    )
  },

  // Treinta ganadas: la gorra firmada, con las antiparras doradas y el marcador destapado; firma en el vestuario.
  'Meolans de club': (u) => {
    const k = kit(u)
    const band = 'M-24 -2C-12 -5 12 -5 24 -2V3C12 0 -12 0 -24 3Z'
    const sig = 'M-14 -12C-13 -16 -10.6 -16.4 -11 -12.4C-11.4 -9 -12.8 -8.4 -12 -11C-11 -13.6 -8 -14 -7.6 -11.6C-7.2 -9.4 -5 -10 -4.4 -12.4C-4 -14 -2 -14 -1.8 -12C-1.6 -10.4 0 -10.6 .8 -12.6C1.6 -14.6 3.4 -14 3.6 -12C3.8 -10.2 6 -10.6 7.4 -13.4C8.4 -15.4 10 -15 10.4 -13.2'
    const pen = 'M0 -2.2H22C23.2 -2.2 24 -1.2 24 0C24 1.2 23.2 2.2 22 2.2H0Z'
    const tip = 'M0 -2.2L-4.4 -.8C-5.2 -.5 -5.2 .5 -4.4 .8L0 2.2Z'
    const lens = (x: number) => ellipse(x, 6.2, 5.6, 4)
    return (
      k.day() +
      k.sun(60, 58, 16, 48) +
      k.shade(ellipse(60, 58, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(48, 100, 27, 92, 25, 62, 8) + laurel(72, 100, 93, 92, 95, 62, 8, true) +
      k.floor(60, 82, 26, 3, P.mid) +
      `<g transform="translate(60 66) scale(1.12)">` +
      k.cast([CAP], 1.8, 1.8) +
      k.draw([{
        d: CAP, fill: P.sky,
        inner:
          `<path d="${band}" fill="${P.white}"/>` +
          `<circle cx="0" cy=".4" r="1.8" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".35"/>` +
          `<path d="M-22 -1.4C-12 -4.2 12 -4.2 22 -1.4M-22 2C-12 -.8 12 -.8 22 2" fill="none" stroke="${P.white}" stroke-width=".35" stroke-dasharray=".8 .6" opacity=".8"/>` +
          k.sh(CAP, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="M-24 -22H-8V10H-24Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
          hair(-12, -6, -10, -14, -3, -18, 0.8, '#fff', 0.9) + hair(4, -18, 12, -15, 18, -8, 0.5, P.blue, 0.8) +
          `<path d="M-20 -6C-12 -9 12 -9 20 -6M-16 -13C-8 -16 8 -16 16 -13" fill="none" stroke="${P.goldL}" stroke-width=".35" stroke-dasharray="1 .8" opacity=".9"/>`,
      }], 0.75) +
      `<path d="${sig}" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M-13 -7.4C-5 -8.6 4 -8.6 11 -9.6" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linecap="round"/>` +
      `<path d="${starPath(14.4, -13.4, 2.4, 1, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M-24 5C-14 3 14 3 24 5" fill="none" stroke="${P.ink}" stroke-width="2.4"/><path d="M-24 5C-14 3 14 3 24 5" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` +
      k.draw([
        { d: lens(-7.4), fill: P.sky, inner: k.sh(lens(-7.4), 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="M-11 4.4A4 3 0 0 1 -7 2.8" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` },
        { d: lens(7.4), fill: P.sky, inner: k.sh(lens(7.4), 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="M3.8 4.4A4 3 0 0 1 7.8 2.8" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` },
      ], 0.6) +
      `<path d="${lens(-7.4)}${lens(7.4)}" fill="none" stroke="${P.gold}" stroke-width="1"/>` +
      `<path d="M-2 5.6Q0 4.4 2 5.6" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M-2 5.6Q0 4.4 2 5.6" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      `</g>` +
      `<g transform="translate(76 90) rotate(-28)">` + k.cast([pen, tip], 1.2, 1.4) +
      k.draw([
        { d: tip, fill: P.night },
        { d: pen, fill: P.night, inner: `<path d="M3 -2.2H20V-.6H3Z" fill="${P.mid}"/><path d="M14 -2.2H16V2.2H14Z" fill="${P.gold}"/>` + hair(2, -1.2, 10, -1.6, 19, -1.2, 0.5, '#fff', 0.7) },
      ], 0.5) +
      `</g>` +
      sparkle(84, 40, 2.4, '#fff') + sparkle(36, 40, 1.8, '#fff') + sparkle(42, 86, 1.4, '#fff') +
      k.defs()
    )
  },
}
