// Dragon Ball Super Card Game: el naranja de la ficha como acento, con el oro de las auras y la noche del deseo.
// Nada de la marca: ni sus personajes, ni las esferas con sus estrellas rojas, ni el radar ni el dragón tal cual.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'

/** El naranja de la ficha (#F08C00), con su sombra y sus luces. */
const OR = '#F08C00', ORD = '#B35A00', ORL = '#FFC46B', ORLL = '#FFE6B8'

/** Cuerpo largo que sigue los puntos `pts` (Catmull-Rom), con ancho `w(t)`. Devuelve el contorno y los cuadros de la espina. */
function tube(pts: number[][], w: (t: number) => number, N = 90) {
  const seg = pts.length - 1
  const sp: { x: number; y: number }[] = []
  for (let i = 0; i <= N; i++) {
    const u = (i / N) * seg, s = Math.min(Math.floor(u), seg - 1), t = u - s
    const p0 = pts[Math.max(s - 1, 0)], p1 = pts[s], p2 = pts[s + 1], p3 = pts[Math.min(s + 2, seg)]
    const cr = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t)
    sp.push({ x: cr(p0[0], p1[0], p2[0], p3[0]), y: cr(p0[1], p1[1], p2[1], p3[1]) })
  }
  const L: string[] = [], R: string[] = []
  const fr = sp.map((p, i) => {
    const a = sp[Math.max(i - 1, 0)], b = sp[Math.min(i + 1, N)]
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, ww = w(i / N) / 2
    L.push(`${f(p.x + nx * ww)} ${f(p.y + ny * ww)}`)
    R.push(`${f(p.x - nx * ww)} ${f(p.y - ny * ww)}`)
    return { x: p.x, y: p.y, nx, ny, tx: dx / len, ty: dy / len, w: ww }
  })
  return { d: `M${L.join('L')}L${R.reverse().join('L')}Z`, fr }
}

/** Franja de un cuerpo entre dos fracciones del ancho (de −1 a 1), para la panza o el lomo. */
const band = (fr: ReturnType<typeof tube>['fr'], a: number, b: number, i0 = 0, i1 = fr.length - 1) => {
  const s = fr.slice(i0, i1 + 1)
  return `M${s.map((p) => `${f(p.x + p.nx * p.w * a)} ${f(p.y + p.ny * p.w * a)}`).join('L')}L${s.reverse().map((p) => `${f(p.x + p.nx * p.w * b)} ${f(p.y + p.ny * p.w * b)}`).join('L')}Z`
}

/** Rayo en zigzag entintado, del color pedido. */
const bolt = (pts: number[][], c = P.goldL, w = 1) =>
  `<path d="M${pts.map((p) => p.join(' ')).join('L')}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 2)}" stroke-linejoin="round" stroke-linecap="round"/><path d="M${pts.map((p) => p.join(' ')).join('L')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`

/** Nube oriental de rulos, con la base plana en y=0. */
function cloud(k: Kit, x: number, y: number, s: number, c = P.mid, line = P.sky) {
  const d = 'M-14 0C-16 -3 -13 -6.4 -9.6 -5.6C-9.6 -9.6 -4.6 -11.4 -1.6 -8.6C.6 -12 6.6 -11.6 7.6 -7.4C11 -8.4 14.2 -5.4 12.6 -2.4C15 -2 15.6 0 14 0Z'
  return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.night, 0.4) }], 0.6 / s) +
    `<path d="M-9.6 -5.6C-8 -4.4 -6.4 -5 -6.6 -6.6C-6.8 -8 -8.6 -8.2 -9 -7M-1.6 -8.6C0 -6.6 2.6 -6.8 3 -8.6C3.4 -10.2 1.6 -11 .6 -10M7.6 -7.4C8.2 -5.6 10.4 -5.2 11 -6.6" fill="none" stroke="${line}" stroke-width="${f(0.6 / s)}" stroke-linecap="round"/>` +
    `<path d="M-12 -1.6C-6 -3 4 -3 12 -1.6" fill="none" stroke="${line}" stroke-width="${f(0.45 / s)}" opacity=".7"/></g>`
}

export const TCG_DRAGONBALL_NUEVAS_ART: Record<string, (u: number) => string> = {
  // Tres partidas: la esfera del abuelo ya es tuya. La esfera naranja, sobre su almohadón de terciopelo con borlas.
  'Esfera de cuatro estrellas': (u) => {
    const k = kit(u)
    const pillow = 'M29 79.4C36 76.6 46 72.6 58 69.6C61 69 63 69 65.6 69.8C74 72.6 83 76.6 91 79.6C84 83.6 74 88 64 91.4C61.6 92.2 58.6 92.2 56 91.4C46 88 36 83.6 29 79.4Z'
    const side = 'M29 79.4C36 83.6 46 88 56 91.4C58.6 92.2 61.6 92.2 64 91.4C74 88 84 83.6 91 79.6C91.4 81.6 90.4 83.6 88.4 85C80 89.6 72 93 64 95.4C61.6 96.2 58.6 96.2 56 95.4C48 93 40 89.6 31.6 85C29.6 83.6 28.6 81.6 29 79.4Z'
    const orb = ellipse(60, 56, 17, 17)
    const tassel = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d: 'M-1.4 0H1.4L2.6 6.6C1.4 7.6 -1.4 7.6 -2.6 6.6Z', fill: P.gold, inner: k.sh('M0 0H3V8H0Z', 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) + `<path d="M-1.2 1.6L-1.7 6.8M0 1.6V7.2M1.2 1.6L1.7 6.8" stroke="${P.goldD}" stroke-width=".35"/>` }, { d: ellipse(0, -0.6, 1.7, 1.3), fill: P.gold }], 0.4) + `</g>`
    const glints: [number, number, number][] = [[54.4, 50.4, 3.4], [65.6, 50, 3.2], [55.6, 61.6, 3.4], [66.4, 61, 3.2]]
    return (
      k.day() +
      k.sun(60, 54, 18, 47, 32, false) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(ORLL, 0.5, 0.5, 0.5, 0.9, 0), ORL, 0.45) +
      k.floor(60, 93, 32, 3.6, P.mid) +
      // el almohadón del abuelo, de terciopelo con borlas en las puntas
      tassel(29.4, 80.6, 24) + tassel(90.6, 80.8, -24) + tassel(60, 95, 0) +
      k.draw([
        { d: side, fill: P.wine, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, '#3A0F1B', 0.45) + hair(36, 85, 46, 90, 56, 93.4, 0.4, '#3A0F1B') + hair(84, 85, 74, 90, 64, 93.4, 0.4, '#3A0F1B') },
        {
          d: pillow, fill: P.red,
          inner: k.sh(pillow, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + k.shade(ellipse(60, 79.6, 15, 5), k.rad(P.wine, 0.5, 0.5, 0.5, 0.95, 0), P.wine, 0.45) +
            hair(36, 79, 46, 77, 54, 79.6, 0.45, P.wine) + hair(84, 79.4, 74, 77.4, 66, 80, 0.45, P.wine) + hair(56, 72, 58, 75, 57, 78, 0.4, P.wine),
        },
      ], 0.7) +
      `<path d="M29 79.4C36 83.6 46 88 56 91.4C58.6 92.2 61.6 92.2 64 91.4C74 88 84 83.6 91 79.6" fill="none" stroke="${P.gold}" stroke-width="1"/><path d="M29 79.4C36 83.6 46 88 56 91.4C58.6 92.2 61.6 92.2 64 91.4C74 88 84 83.6 91 79.6" fill="none" stroke="${P.goldD}" stroke-width="1" stroke-dasharray=".6 1.2"/>` +
      k.shade(ellipse(60, 79, 17, 4.4), k.rad(OR, 0.5, 0.5, 0.5, 0.95, 0), ORD, 0.45) +
      // la esfera de cristal naranja con cuatro destellos que flotan adentro
      k.draw([{
        d: orb, fill: OR,
        inner: `<circle cx="60" cy="56" r="17" fill="${k.rad(ORLL, 0.62, 0.72, 0.55, 0.95, 0)}"/>` + k.shade(orb, k.rad(ORD, 0.42, 0.38, 0.62, 0, 0.95), ORD, 0.45) +
          glints.map(([x, y, r]) => `<path d="${starPath(x, y, r, r * 0.3, 4)}" fill="${ORLL}" stroke="${ORD}" stroke-width=".4"/><path d="${starPath(x, y, r * 0.55, r * 0.16, 4, -45)}" fill="#fff" opacity=".85"/>`).join('') +
          hair(46, 66, 52, 72.6, 62, 72.6, 0.7, '#fff', 0.7) + hair(70, 44, 74, 50, 74.6, 58, 0.5, ORLL, 0.8),
      }], 0.8) +
      `<path d="M47.4 51C48.6 45.6 52.6 41.6 57.8 40.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>` +
      `<path d="M47.2 56.6C47 55.4 47.1 54.2 47.4 53.2" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".85"/>` +
      sparkle(71, 45, 2.6, '#fff') + sparkle(86, 36, 2.2) + sparkle(34, 44, 1.6) +
      k.defs()
    )
  },

  // Quince victorias: el radar titila y sabés dónde están todas. El radar de bolsillo, con el barrido y los puntos naranjas.
  'Radar del Dragón': (u) => {
    const k = kit(u)
    const cx = 60, cy = 62, R = 24, r = 18.6
    const caseD = ellipse(cx, cy, R, R)
    const screen = ellipse(cx, cy, r, r)
    const crown = roundRect(55.6, 31.4, 64.4, 38.6, 1.4)
    const stem = 'M57.6 36H62.4V39.6H57.6Z'
    const grid = [-12, -6, 0, 6, 12].map((o) => `M${cx + o} ${cy - r}V${cy + r}M${cx - r} ${cy + o}H${cx + r}`).join('')
    const sweepA = (-38 * Math.PI) / 180
    const sweep = `M${cx} ${cy}L${f(cx + Math.cos(sweepA) * r)} ${f(cy + Math.sin(sweepA) * r)}A${r} ${r} 0 0 0 ${f(cx + Math.cos(sweepA - 1.1) * r)} ${f(cy + Math.sin(sweepA - 1.1) * r)}Z`
    const blips: [number, number, number][] = [[68.6, 52.4, 1.6], [50, 56, 1.3], [64, 70, 1.3], [53.6, 72.4, 1.1], [71.4, 64.6, 1.1], [57, 47.6, 1.1], [46.6, 66, 1]]
    const knurl = Array.from({ length: 8 }, (_, i) => `M${f(56.6 + i * 1.1)} 31.6V38.4`).join('')
    return (
      k.day() +
      k.stage(60, 58, 41) +
      k.floor(60, 90, 22, 2.6, P.mid) +
      // los anillos que salen del radar cuando titila
      [30, 34.6, 39].map((rr, i) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${OR}" stroke-width="${f(1 - i * 0.25)}" opacity="${f(0.75 - i * 0.2)}" stroke-dasharray="${i ? '3 2.4' : '0'}"/>`).join('') +
      k.cast([caseD, crown], 2.4, 2.2) +
      k.draw([
        { d: stem, fill: P.gold, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) },
        { d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="${knurl}" stroke="${P.goldD}" stroke-width=".45"/><path d="M55.6 33H64.4" stroke="${P.goldL}" stroke-width=".6"/>` },
        {
          d: caseD, fill: P.gold,
          inner: k.sh(caseD, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M34 36H52V90H34Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<circle cx="${cx}" cy="${cy}" r="${R - 1.6}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
            Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2, r0 = R - 3.6, r1 = i % 4 ? R - 2.4 : R - 1.6; return `<path d="M${f(cx + Math.cos(a) * r0)} ${f(cy + Math.sin(a) * r0)}L${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}" stroke="${P.goldD}" stroke-width="${i % 4 ? 0.3 : 0.55}"/>` }).join(''),
        },
      ], 0.8) +
      // la pantalla con la cuadrícula, el barrido y las esferas
      `<path d="${screen}" fill="${P.night}" stroke="${P.ink}" stroke-width=".7"/>` +
      k.clip(screen,
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${k.rad(P.mid, 0.5, 0.5, 0.5, 0.9, 0.2)}"/>` +
        `<path d="${grid}" stroke="${P.sky}" stroke-width=".35" opacity=".55"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.5)}" fill="none" stroke="${P.sky}" stroke-width=".35" opacity=".6"/>` +
        `<path d="${sweep}" fill="${k.rad(P.sky, 0, 0.5, 1, 0.1, 0.75)}"/>` + `<path d="M${cx} ${cy}L${f(cx + Math.cos(sweepA) * r)} ${f(cy + Math.sin(sweepA) * r)}" stroke="${P.sky1}" stroke-width=".8"/>` +
        blips.map(([x, y, s], i) => `<circle cx="${x}" cy="${y}" r="${f(s * 2.2)}" fill="${OR}" opacity=".3"/><circle cx="${x}" cy="${y}" r="${s}" fill="${i ? ORL : '#fff'}" stroke="${OR}" stroke-width=".5"/>` + (i ? '' : `<circle cx="${x}" cy="${y}" r="${f(s * 3.4)}" fill="none" stroke="${ORL}" stroke-width=".5"/><circle cx="${x}" cy="${y}" r="${f(s * 4.8)}" fill="none" stroke="${ORL}" stroke-width=".35" opacity=".6"/>`)).join('') +
        `<path d="M${cx - 1.4} ${cy}H${cx + 1.4}M${cx} ${cy - 1.4}V${cy + 1.4}" stroke="${P.sky1}" stroke-width=".6"/>` +
        `<path d="M42 50C46 44 52 41 58 40.4L60 45C54 45.6 49 48 46 52Z" fill="#fff" opacity=".22"/>`) +
      `<path d="M41.6 58C42.6 51 46.6 46 51.6 43.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` +
      sparkle(86, 36, 2.4) + sparkle(32, 80, 1.6) +
      k.defs()
    )
  },

  // Cuarenta partidas: se oscurece el cielo y el dragón te concede un deseo. El dragón oriental tras la perla naranja.
  'Shenlong': (u) => {
    const k = kit(u)
    const pts = [[90, 96], [95, 80], [84, 68], [64, 72], [42, 74], [30, 62], [35, 47], [48, 40]]
    const body = tube(pts, (t) => (t < 0.18 ? 1.2 + (t / 0.18) * 7 : 8.2 + 1.8 * Math.sin((Math.PI * (t - 0.18)) / 0.82)))
    const fr = body.fr, n = fr.length
    const belly = band(fr, -0.92, -0.25, 8, n - 1)
    const scales = fr.filter((_, i) => i > 10 && i % 3 === 0).map((p) => {
      const a = { x: p.x + p.nx * p.w * 0.85, y: p.y + p.ny * p.w * 0.85 }, b = { x: p.x + p.nx * p.w * 0.05, y: p.y + p.ny * p.w * 0.05 }
      return `M${f(a.x)} ${f(a.y)}Q${f((a.x + b.x) / 2 + p.tx * 1.6)} ${f((a.y + b.y) / 2 + p.ty * 1.6)} ${f(b.x)} ${f(b.y)}`
    }).join('')
    const plates = fr.filter((_, i) => i > 10 && i % 3 === 1).map((p) => `M${f(p.x - p.nx * p.w * 0.9)} ${f(p.y - p.ny * p.w * 0.9)}L${f(p.x - p.nx * p.w * 0.3)} ${f(p.y - p.ny * p.w * 0.3)}`).join('')
    const fins = fr.filter((_, i) => i > 6 && i < n - 4 && i % 5 === 0).map((p) => {
      const bx = p.x + p.nx * p.w * 0.8, by = p.y + p.ny * p.w * 0.8, s = 0.6 + p.w * 0.12
      return `M${f(bx - p.tx * 2.4 * s)} ${f(by - p.ty * 2.4 * s)}L${f(bx + p.nx * 4.6 * s - p.tx * 3 * s)} ${f(by + p.ny * 4.6 * s - p.ty * 3 * s)}L${f(bx + p.tx * 2.2 * s)} ${f(by + p.ty * 2.2 * s)}Z`
    }).join('')
    // La cabeza, de perfil hacia la derecha, con la boca abierta hacia la perla.
    const skull = 'M0 -6C3 -9.6 8 -11 13 -10.4C16 -10 18 -8.6 20 -8.4C22.6 -8.6 24.8 -9.6 26.6 -8.6C28 -7.6 27.8 -5.4 26.6 -4.4C25.4 -3.6 24 -3.4 22.6 -3.4C18 -2.6 12 -1.4 7 .6C4.6 1.6 2 2.6 0 3Z'
    const jaw = 'M3 2.4C8 3.4 14 5.4 19 7.6C20.6 8.4 21 9.8 19.6 10.4C15 11.8 9 11.4 4 10C1.6 9.4 .2 7.6 0 5.6Z'
    const mouth = 'M22.6 -3.2C18 -2.4 12 -1.2 7 .8C4.6 1.8 2.6 2.6 1.6 3.2C7 4 13 5.8 19 8.2C19.6 4.4 20.8 .4 22.6 -3.2Z'
    const antler = (s: number) => `M0 0C-2 -4 -4 -8 -8 -11.6L-10.6 -11C-9.4 -12.4 -9.8 -14 -11 -15C-8.6 -14.4 -7 -13.2 -6 -11.4C-4 -13 -3.6 -15.6 -4.4 -18C-2 -15.6 -1.6 -12.4 -3.2 -9.6C-1.6 -7 ${f(1 * s)} -3.6 ${f(2 * s)} 0Z`
    const mane = 'M2 -5C-2 -9 -7 -10.4 -12 -10C-9 -8.6 -7.6 -7.4 -7 -6C-10 -6.6 -13 -5.6 -15 -3.4C-11.6 -3.6 -9.6 -2.6 -8.4 -1.4C-11 .4 -12.4 3 -12.4 6C-9.6 3.4 -6 2.2 -2 2.4Z'
    const beard = 'M5 10C4 13 4.6 16 6.4 18.4C6.6 16 7.6 14.4 9 13.4C9.4 15.4 10.6 16.8 12.4 17.4C11.6 15 11.8 12.8 13 11Z'
    const head =
      `<g transform="translate(47 40.6) rotate(-14) scale(.98)">` +
      k.draw([
        { d: antler(1), t: 'translate(9 -9.6)', fill: P.goldL, inner: k.sh(antler(1), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) },
        { d: antler(1), t: 'translate(4.6 -8.6) scale(.82)', fill: P.gold, inner: k.sh(antler(1), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: mane, fill: P.greenD, inner: k.sh(mane, 0, 0, 0, 1, 0, 0.8, P.night, 0.4) + hair(-2, -4, -7, -6, -11, -8.6, 0.4, P.green) },
        { d: beard, fill: P.goldL, inner: k.sh(beard, 0, 0, 1, 1, 0, 0.8, P.gold, 0.45) },
        { d: jaw, fill: P.green, inner: k.sh(jaw, 0, 0, 0, 1, 0, 0.9, P.greenD, 0.5) + `<path d="M4 9.6C9 10.6 14 10.6 18.6 9.6" fill="none" stroke="${P.goldL}" stroke-width="1.2"/>` },
      ], 0.6) +
      `<path d="${mouth}" fill="${P.wine}"/><path d="M5 2.4C9 3.4 13 4.8 17 6.6C13 6.8 8 5.6 5 2.4Z" fill="${P.red}"/>` +
      `<path d="M21.4 -3L20.6 -.2L19.6 -2.8ZM16 -2.2L15.4 .2L14.4 -1.8ZM17.8 7.4L17.4 4.8L16.4 7Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".25"/>` +
      k.draw([{
        d: skull, fill: P.green,
        inner: k.sh(skull, 0, 0, 0, 1, 0, 0.9, P.greenD, 0.5) + `<path d="M0 -12H28V-7C18 -8.6 8 -8.6 0 -5Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.45, 0)}"/>` +
          hair(6, -1, 12, -2.4, 19, -3.4, 0.45, P.greenD) + hair(14, -9.6, 18, -7.6, 22, -8, 0.4, P.greenD),
      }], 0.6) +
      `<path d="M8.4 -9.8C11.4 -11.8 15 -11.4 17 -9C14.6 -9.2 12 -8.6 10 -7.4Z" fill="${P.greenD}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<ellipse cx="13.6" cy="-6.6" rx="2.2" ry="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M13.6 -7.8V-5.4" stroke="${P.red}" stroke-width=".8" stroke-linecap="round"/><circle cx="12.9" cy="-7.1" r=".35" fill="#fff"/>` +
      `<path d="M26.6 -8.6C27.6 -9.2 28.6 -8.6 28.4 -7.4" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linecap="round"/>` +
      `</g>`
    const claw = 'M0 0C3 -1 6 -.6 8.6 1C9.8 -.4 11.6 -.8 12.6 0C11.4 .2 10.6 1 10.4 2.2C11.8 2 13 2.8 13.4 4C12 3.6 10.6 3.8 9.6 4.6C10.2 5.6 10.2 7 9.4 7.8C9 6.4 8 5.4 6.6 5C4 5.6 1.6 5 0 3.8Z'
    const leg = 'M38 50C42 52.4 46 55.6 50 58L52.6 55.8C49 52.4 45 49 41.4 46.4Z'
    return (
      k.night() +
      k.shade('M0 0H120V60H0Z', k.lin('#0F1736', 0, 0, 0, 1, 0.8, 0), '#0F1736', 0.4) +
      bolt([[30, 22], [36, 30], [32, 32], [40, 42]], P.goldL, 0.9) + bolt([[96, 56], [90, 62], [94, 64], [86, 72]], P.goldL, 0.8) +
      [[24, 54], [78, 18], [94, 46], [70, 92], [36, 32]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      // la perla naranja del deseo
      k.shade(ellipse(82, 44, 18, 18), k.rad(ORL, 0.5, 0.5, 0.5, 0.95, 0), OR, 0.5) +
      k.draw([{ d: ellipse(82, 44, 6.6, 6.6), fill: OR, inner: `<circle cx="82" cy="44" r="6.6" fill="${k.rad(ORLL, 0.62, 0.72, 0.6, 0.95, 0)}"/>` + k.shade(ellipse(82, 44, 6.6, 6.6), k.rad(ORD, 0.4, 0.36, 0.6, 0, 0.9), ORD, 0.4) }], 0.55) +
      `<path d="M78.4 41.4C79 39.6 80.4 38.4 82 38.2" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>` +
      hair(86, 38, 89, 34, 88, 30, 0.7, ORL) + hair(77, 39, 76, 35, 78, 31, 0.6, ORL) + hair(88.6, 46, 92, 46, 94, 43, 0.5, ORL) +
      // el cuerpo que se enrosca entre las nubes
      cloud(k, 36, 94, 1.2) +
      k.cast([body.d], 2.2, 2, '#0F1736') +
      `<path d="${fins}" fill="${P.red}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
      k.draw([{ d: leg, fill: P.green, inner: k.sh(leg, 0, 0, 0, 1, 0, 0.9, P.greenD, 0.45) }], 0.55) +
      `<g transform="translate(51 56) rotate(-20)">` + k.draw([{ d: claw, fill: P.goldL, inner: k.sh(claw, 0, 0, 1, 1, 0, 0.8, P.gold, 0.45) }], 0.45) + `</g>` +
      k.draw([{
        d: body.d, fill: P.green,
        inner: k.sh(body.d, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.45) + `<path d="${belly}" fill="${P.goldL}"/>` + k.sh(belly, 0, 0, 1, 1, 0, 0.7, P.gold, 0.4) +
          `<path d="${plates}" stroke="${P.goldD}" stroke-width=".5"/><path d="${scales}" fill="none" stroke="${P.greenD}" stroke-width=".55" stroke-linecap="round"/>`,
      }], 0.7) +
      head +
      hair(71, 38, 78, 32, 86, 30, 0.6, P.goldL) + hair(70, 40.6, 80, 40, 88, 34, 0.5, P.goldL) +
      cloud(k, 92, 90, 0.9) + cloud(k, 26, 40, 0.7) +
      sparkle(60, 22, 2.4, P.goldL) + sparkle(96, 30, 1.4, P.paper) +
      k.defs()
    )
  },

  // Tres despertares: pelo amarillo parado. El pote de gel extrafuerte, con el gel dorado parado en puntas.
  'Super Saiyajin': (u) => {
    const k = kit(u)
    const gel =
      'M44.4 63C41 59 38.4 54.4 37.4 49.4C40.6 51.4 43.6 52 46.4 51.8C43.4 46.6 42.4 40.4 43 34C46 38.8 49.6 41.6 53.4 42.6C52 36.4 52.6 29.6 55.4 23.4C57.4 29.6 60.4 33.6 63.6 35.8' +
      'C64.4 30.4 67 26 71.4 22.8C70.4 28.6 71 33.6 73 37.6C75.6 35 78.6 33.6 82 33.4C79.6 37.4 78.8 41.6 79.6 45.6C81.4 45 83.4 45 85.4 45.8C82.4 49.4 80 53.6 78.4 58C77.8 60 76.8 61.8 75.6 63Z'
    const jar = 'M41 67H79V86C79 90 76 92.6 72 92.6H48C44 92.6 41 90 41 86Z'
    const neck = 'M42.6 61.6H77.4V67.4H42.6Z'
    const inside = 'M42.6 69H77.4V86C77.4 89.4 75.2 91.2 72 91.2H48C44.8 91.2 42.6 89.4 42.6 86Z'
    const label = 'M41 73.4H79V85.4H41Z'
    const strands = [[48, 61, 44, 54, 40, 51], [52, 60, 47, 48, 45, 37], [57, 59, 55, 42, 55.6, 26], [63, 60, 64, 46, 70.4, 25.4], [69, 61, 72, 50, 80.4, 35.6], [74, 62, 78, 55, 83.6, 47]]
    return (
      k.day() +
      k.sun(60, 50, 16, 47, 32, false) +
      k.shade(ellipse(61, 44, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.5) +
      bolt([[30, 40], [35, 45], [32, 47], [37, 53]]) + bolt([[90, 58], [86, 62], [89, 64], [84, 69]]) + bolt([[86, 24], [83, 29], [86, 30], [82, 35]], P.goldL, 0.7) +
      k.floor(60, 92.6, 24, 2.6, P.mid) +
      // el gel parado en puntas, como el pelo
      k.cast([gel], 2, 1.6) +
      k.draw([{
        d: gel, fill: P.gold,
        inner: k.sh(gel, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M36 22H54V64H36Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.75, 0)}"/>` +
          strands.map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.55, P.goldD)).join('') +
          hair(46, 52, 45, 44, 46.4, 38, 0.6, '#fff', 0.8) + hair(56.4, 40, 56, 33, 56.4, 28, 0.6, '#fff', 0.8) + hair(66, 42, 67.4, 34, 70, 28, 0.5, '#fff', 0.7),
      }], 0.75) +
      // el pote de vidrio con su etiqueta naranja
      k.cast([jar], 2.2, 1.8) +
      k.draw([
        { d: jar, fill: P.sky1, inner: `<path d="${inside}" fill="${P.gold}"/>` + k.sh(inside, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) + `<path d="M42.6 69H77.4V70.4H42.6Z" fill="${P.goldL}"/>` },
        { d: neck, fill: P.sky1, line: 0.35, inner: `<path d="M42.6 63.4H77.4M42.6 65.4H77.4" stroke="${P.blue}" stroke-width=".45"/>` + k.sh(neck, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
      ], 0.75) +
      k.draw([{
        d: label, fill: OR,
        inner: k.sh(label, 0, 0, 1, 0, 0, 0.85, ORD, 0.45) + `<path d="M41 74.6H79M41 84.2H79" stroke="${ORLL}" stroke-width=".5"/>` +
          `<path d="M51.6 75.6L48.6 80.2H51L49.6 84L54 78.6H51.4Z" fill="${ORLL}" stroke="${ORD}" stroke-width=".3"/>` +
          `<text x="64" y="81.6" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="5.4" fill="${ORLL}" text-anchor="middle">gel</text>`,
      }], 0.45) +
      `<path d="M44.4 69V90M46.4 70V89.6" stroke="#fff" stroke-width=".9" opacity=".7"/><path d="${jar}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
      sparkle(56, 20, 2.6, '#fff') + sparkle(30, 66, 1.8) + sparkle(90, 80, 1.6) +
      k.defs()
    )
  },

  // Doce despertares: el pelo se te puso celeste y ni pestañeás. El peine que pasa, prolijo, por un mechón de fuego azul.
  'Super Saiyajin Blue': (u) => {
    const k = kit(u)
    const flame = (x: number, h: number, w: number, lean: number) =>
      `M${f(x - w)} 92C${f(x - w * 1.1)} ${f(92 - h * 0.4)} ${f(x - w * 0.6 + lean * 0.5)} ${f(92 - h * 0.75)} ${f(x + lean)} ${f(92 - h)}C${f(x + w * 0.5 + lean * 0.6)} ${f(92 - h * 0.7)} ${f(x + w * 1.1)} ${f(92 - h * 0.4)} ${f(x + w)} 92Z`
    const tongues: [number, number, number, number][] = [[44, 46, 6, -3], [52, 60, 6.4, -1.6], [60, 68, 6.6, 0], [68, 60, 6.4, 1.6], [76, 46, 6, 3]]
    const comb = 'M-25 -3.4C-25 -5.6 -23 -7 -20 -7H20C23 -7 25 -5.6 25 -3.4V0H-25Z'
    const teeth = Array.from({ length: 21 }, (_, i) => { const x = -23.4 + i * 2.34; return `M${f(x - 0.62)} 0H${f(x + 0.62)}V${i % 2 ? 9.6 : 11}C${f(x + 0.62)} ${i % 2 ? 10.6 : 12} ${f(x - 0.62)} ${i % 2 ? 10.6 : 12} ${f(x - 0.62)} ${i % 2 ? 9.6 : 11}Z` }).join('')
    return (
      k.day() +
      k.stage(60, 58, 41) +
      k.shade(ellipse(60, 58, 34, 36), k.rad(P.sky, 0.5, 0.6, 0.5, 0.9, 0), P.blue, 0.4) +
      // el mechón de fuego azul, prolijo y quieto
      tongues.map(([x, h, w, l]) => `<path d="${flame(x, h, w * 1.25, l)}" fill="${P.blue}"/>`).join('') +
      k.draw(tongues.map(([x, h, w, l]) => ({ d: flame(x, h, w, l), fill: P.sky, inner: `<path d="${flame(x, h * 0.78, w * 0.62, l * 0.8)}" fill="${P.sky1}"/><path d="${flame(x, h * 0.5, w * 0.3, l * 0.5)}" fill="#fff"/>` + k.sh(flame(x, h, w, l), 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) })), 0.6) +
      tongues.map(([x, h, , l]) => hair(x - 2, 88, x - 2.6 + l * 0.3, 92 - h * 0.5, x + l * 0.6, 92 - h * 0.85, 0.5, P.mid, 0.7)).join('') +
      // el peine naranja, cruzado en el mechón
      `<g transform="translate(60 70) rotate(-6)">` +
      k.cast([comb + teeth], 1.8, 1.8, P.mid) +
      `<path d="${teeth}" fill="${OR}" stroke="${P.ink}" stroke-width=".4"/>` + `<path d="${teeth}" fill="${k.lin(ORD, 0, 0, 0, 1, 0, 0.7)}"/>` +
      k.draw([{ d: comb, fill: OR, inner: k.sh(comb, 0, 0, 0, 1, 0, 0.8, ORD, 0.45) + `<path d="M-23 -5.4H23" stroke="${ORLL}" stroke-width=".7"/>` + `<circle cx="0" cy="-3.6" r="1.6" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-12" cy="-3.6" r=".9" fill="${ORLL}"/><circle cx="12" cy="-3.6" r=".9" fill="${ORLL}"/>` + hair(-20, -2, -10, -1.4, 0, -1.8, 0.4, ORD) }], 0.6) +
      `</g>` +
      sparkle(60, 22, 2.6, '#fff') + sparkle(86, 40, 2) + sparkle(32, 48, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco despertares: esquivás sin pensar, con el pelo plateado. El gi naranja rasgado, en un aura plateada, dejando su estela.
  'Ultra Instinto': (u) => {
    const k = kit(u)
    const body = 'M52 38Q60 42 68 38L79 42.4C80 50 80.2 58 79.6 64V90C70 93 50 93 40.4 90V64C39.8 58 40 50 41 42.4Z'
    const sl = 'M41 42.4C36 45 31 49.6 27.4 55L25.6 59.6L28.6 59L28 62.6L31.4 61L32 64.4L35 61.8L37.6 63.4L40.4 60C40 55 40 48 41 42.4Z'
    const sr = 'M79 42.4C84 45 89 49.6 92.6 55L94.4 59.6L91.4 59L92 62.6L88.6 61L88 64.4L85 61.8L82.4 63.4L79.6 60C80 55 80 48 79 42.4Z'
    const vee = 'M52 38Q60 42 68 38L56 66Z'
    const lapel = 'M68 38L71.4 39.4L56 70L52.4 66.6Z'
    const lapel2 = 'M52 38L48.6 39.6L52.6 64.6L55 62Z'
    const belt = 'M40.4 70C50 72.2 70 72.2 79.6 70V75.6C70 77.8 50 77.8 40.4 75.6Z'
    const knot = 'M56 69.6H63V77.4H56Z'
    const tail1 = 'M57.4 77L54 90L57.6 89.4L59.6 77.4Z'
    const tail2 = 'M61.6 77.2L64 89.6L67.2 88.4L63.6 77Z'
    const torn = 'M70 82L72.6 80L74 83L76.4 81.4L75.6 85.4L72 86.6Z'
    const all = [body, sl, sr]
    const aura = (s: number) => {
      let d = ''
      const N = 26
      for (let i = 0; i <= N * 2; i++) {
        const a = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2, up = Math.max(0, -Math.sin(a))
        const r = (i % 2 ? 30 : 36 + up * 12) * s
        d += (i ? 'L' : 'M') + f(60 + Math.cos(a) * r * 0.92) + ' ' + f(64 + Math.sin(a) * r)
      }
      return d + 'Z'
    }
    const ghost = (dx: number, op: number) => `<g transform="translate(${dx} -2)" opacity="${op}">${all.map((d) => `<path d="${d}" fill="${P.sky}" stroke="${P.sky1}" stroke-width=".8"/>`).join('')}</g>`
    return (
      k.night() +
      [[30, 30], [88, 28], [24, 72], [96, 80], [42, 20], [80, 96]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      // el aura plateada
      `<path d="${aura(1.08)}" fill="${P.sky}" opacity=".35"/>` + k.shade(aura(1.08), k.rad(P.sky1, 0.5, 0.6, 0.6, 0.9, 0), P.sky1, 0.4) +
      `<path d="${aura(0.86)}" fill="${P.sky1}" opacity=".55"/>` +
      Array.from({ length: 7 }, (_, i) => { const x = 44 + i * 5.4; return hair(x, 92, x - 1.4 + (i % 2) * 2.8, 64, x + (i - 3) * 0.6, 26 + Math.abs(i - 3) * 4, 0.6, '#fff', 0.7) }).join('') +
      // la estela de los esquives
      ghost(-15, 0.28) + ghost(15, 0.28) +
      k.cast(all, 2.2, 2, '#0F1736') +
      k.draw([
        { d: sl, fill: OR, inner: k.sh(sl, 0, 0, 0, 1, 0, 0.7, ORD, 0.4) + hair(36, 48, 34, 53, 31, 57, 0.5, ORD) },
        { d: sr, fill: OR, inner: k.sh(sr, 0, 0, 1, 1, 0.2, 0.95, ORD, 0.45) + hair(84, 48, 86, 53, 89, 57, 0.5, ORD) },
        {
          d: body, fill: OR,
          inner: k.sh('M64 40C68 56 68 74 64 94H84V40Z', 0, 0, 1, 0, 0, 0.85, ORD, 0.45) + k.sh('M38 80H82V94H38Z', 0, 0, 0, 1, 0, 0.7, ORD, 0.4) +
            `<path d="M38 38H50V94H38Z" fill="${k.lin(ORLL, 0, 0, 1, 0, 0.55, 0)}"/>` +
            hair(45, 66, 47, 74, 46, 84, 0.55, ORD) + hair(74, 64, 72, 74, 74, 86, 0.55, ORD) + hair(66, 50, 70, 56, 70, 62, 0.45, ORD),
        },
      ], 0.75) +
      `<path d="${vee}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".5"/>` + k.sh(vee, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) +
      k.draw([
        { d: lapel2, fill: OR, inner: k.sh(lapel2, 0, 0, 1, 0, 0, 0.8, ORD, 0.45) },
        { d: lapel, fill: OR, inner: k.sh(lapel, 0, 0, 1, 0, 0.2, 0.9, ORD, 0.5) + `<path d="M69.4 39.6L54.4 68" stroke="${ORLL}" stroke-width=".5"/>` },
        { d: tail1, fill: P.mid, inner: k.sh(tail1, 0, 0, 1, 0, 0, 0.8, P.ink, 0.4) },
        { d: tail2, fill: P.mid, inner: k.sh(tail2, 0, 0, 1, 0, 0, 0.8, P.ink, 0.4) },
        { d: belt, fill: P.mid, inner: k.sh(belt, 0, 0, 1, 1, 0, 0.8, P.ink, 0.45) + `<path d="M40.4 72.6C50 74.8 70 74.8 79.6 72.6" fill="none" stroke="${P.sky}" stroke-width=".4" stroke-dasharray="1 .8"/>` },
        { d: knot, fill: P.mid, inner: k.sh(knot, 0, 0, 1, 1, 0, 0.8, P.ink, 0.45) + hair(57, 71, 59.6, 73.4, 62, 76, 0.4, P.sky) },
        { d: torn, fill: P.night },
      ], 0.55) +
      `<circle cx="70.4" cy="50.4" r="4.2" fill="${P.white}" stroke="${P.ink}" stroke-width=".55"/><path d="${starPath(70.4, 50.4, 2.8, 1.1, 5)}" fill="${OR}" stroke="${ORD}" stroke-width=".3"/>` +
      `<path d="M44 46L45.6 47.6M46.2 43.6L48 45.4" stroke="${ORD}" stroke-width=".5" stroke-linecap="round"/>` +
      sparkle(84, 30, 2.6, '#fff') + sparkle(34, 36, 2, P.sky1) + sparkle(30, 86, 1.6, '#fff') + sparkle(90, 72, 1.4, P.sky1) +
      k.defs()
    )
  },
}
