// Among Us: Sus, Tripulación y Asesino serial, en clave heroica.
// El color propio del juego es el magenta de su ficha (#C92A6E): el resplandor de la noche, la luz que sale de la
// ventilación, los tentáculos. Al tripulante no se lo dibuja (es un muñequito): todo se cuenta con objetos de la nave
// (la rejilla de la ventilación, la palanca de las luces, el escáner, el panel de cables, el botón de emergencia, el
// cuchillo) y nunca con caras.
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** El magenta de la ficha de Among Us, con su sombra, su medio tono y su luz. */
const AU = '#C92A6E', AU_D = '#7E1543', AU_M = '#E0699A', AU_L = '#F4B3CD'
/** El verde del escáner y el acero oscuro de la nave. */
const SCAN = '#7FD18B', SCAN_D = '#3E9A5A'
const STEEL = '#3A4A7E', STEEL_D = '#222D58'

/** Estrellas fijas (pseudoazar con semilla) dentro de la ventana. */
const stars = (seed: number, n = 26) => {
  let s = seed
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  return Array.from({ length: n }, () => {
    const x = 18 + rnd() * 84, y = 14 + rnd() * 88, r = 0.25 + rnd() * 0.45
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${P.paper}" opacity="${f(0.4 + rnd() * 0.6)}"/>`
  }).join('')
}

/** La noche de la nave: azul noche, el resplandor magenta en el medio y estrellas. */
const espacio = (k: Kit, seed = 7, glow = 0.8) =>
  `<rect width="120" height="130" fill="${P.night}"/>` + k.shade(FULL, k.rad(AU, 0.5, 0.48, 0.55, glow, 0), AU, 0.3) + stars(seed)

/** Piso de la nave: una chapa elíptica con el borde remachado y el dibujo de diamantes. */
function deck(k: Kit, cx: number, cy: number, rx: number, ry: number) {
  const d = ellipse(cx, cy, rx, ry)
  let tread = ''
  for (let i = -6; i <= 6; i++) for (let j = -3; j <= 3; j++) {
    const x = cx + i * 6 + (j % 2 ? 3 : 0), y = cy + j * 3.2
    tread += `M${f(x - 1.2)} ${f(y + 0.5)}L${f(x + 1.2)} ${f(y - 0.5)}`
  }
  const rivets = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2
    return `<circle cx="${f(cx + Math.cos(a) * (rx - 2.2))}" cy="${f(cy + Math.sin(a) * (ry - 1.2))}" r=".5" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".2"/>`
  }).join('')
  return k.draw([{ d, fill: STEEL, inner: `<path d="${tread}" stroke="${P.blue}" stroke-width=".55" stroke-linecap="round" opacity=".7"/>` + k.shade(d, k.rad(STEEL_D, 0.5, 0.4, 0.6, 0, 1), STEEL_D, 0.45) + `<path d="${ellipse(cx, cy, rx - 3.6, ry - 2.2)}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` }], 0.6) + rivets
}

/** Gloria de rayos rectos en magenta. */
function magGlory(k: Kit, cx: number, cy: number, r0: number, r1: number, n: number) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux, w = i % 2 ? 1.1 : 1.7, len = i % 2 ? r0 + (r1 - r0) * 0.72 : r1
    d += `M${f(cx + ux * r0 + px * w)} ${f(cy + uy * r0 + py * w)}L${f(cx + ux * len)} ${f(cy + uy * len)}L${f(cx + ux * r0 - px * w)} ${f(cy + uy * r0 - py * w)}Z`
  }
  const g = k.id('mg')
  return `<radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r1}"><stop offset="${f(r0 / r1)}" stop-color="${AU_D}"/><stop offset=".6" stop-color="${AU}"/><stop offset="1" stop-color="${AU_M}" stop-opacity=".45"/></radialGradient>` +
    `<path d="${d}" fill="url(#${g})"/>` + k.shade(d, k.rad(AU_D, 0.5, 0.5, 0.5, 0.9, 0), AU_D, 0.2) +
    `<circle cx="${cx}" cy="${cy}" r="${f(r0 - 2)}" fill="none" stroke="${AU_M}" stroke-width=".8" stroke-dasharray=".01 1.7" stroke-linecap="round"/>`
}

/** Varilla entintada (cable, cordón, cadena): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Rejilla de ventilación en el piso, vista desde arriba en perspectiva, con la tapa levantada sobre la bisagra de
 * atrás y la luz magenta saliendo del ducto. `glow` regula esa luz. */
function vent(k: Kit, glow = 1) {
  const frame = 'M33 90L87 90L81 63H39Z'
  const hole = 'M37.6 87.2H82.4L77.6 65.6H42.4Z'
  const lid = 'M39 63L81 63L76.6 44H43.4Z'
  const lidIn = 'M42.2 60.6H77.8L74.6 46.4H45.4Z'
  const slats = Array.from({ length: 9 }, (_, i) => {
    const x = 36 + i * 5.4
    return `M${f(x)} 61L${f(x + 2.4)} 61L${f(x + 8.6)} 45L${f(x + 6.2)} 45Z`
  }).join('')
  const ribs = Array.from({ length: 4 }, (_, i) => { const t = (i + 1) / 5; return `M${f(37.6 + t * 4.8)} ${f(87.2 - t * 21.6)}H${f(82.4 - t * 4.8)}` }).join('')
  const bolts = [[35.6, 88.6], [84.4, 88.6], [40.4, 64.4], [79.6, 64.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
  return (
    k.draw([{ d: frame, fill: P.sky2, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.85, P.mid, 0.45) + hair(35, 89, 50, 89.4, 70, 89, 0.5, '#fff', 0.7) }], 0.7) +
    `<path d="${hole}" fill="#0B1029"/>` +
    k.clip(hole, `<path d="${ribs}" stroke="${AU_D}" stroke-width=".7"/>` + k.shade(hole, k.rad(AU, 0.5, 0.75, 0.6, 0.95 * glow, 0), AU, 0.5) + k.shade(hole, k.rad(AU_L, 0.5, 0.8, 0.3, 0.8 * glow, 0), AU_M, 0.3)) +
    `<path d="${hole}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` + bolts +
    k.shade('M37.6 87.2H82.4L86 30H34Z', k.lin(AU_M, 0, 1, 0, 0, 0.55 * glow, 0), AU_M, 0.35) +
    k.draw([{
      d: lid, fill: P.sky2,
      inner: k.sh(lid, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) + `<path d="${lidIn}" fill="#141A3A"/>` + k.clip(lidIn, `<path d="${slats}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/>` + k.sh(lidIn, 0, 1, 0, 0, 0, 0.85 * glow, AU, 0.45)) +
        `<path d="${lidIn}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` + hair(41, 61.4, 42.4, 53, 43.8, 45, 0.5, '#fff', 0.8),
    }], 0.7) +
    `<path d="M45 63V65.4M75 63V65.4" stroke="${P.ink}" stroke-width="1.6"/><path d="M45 63V65.4M75 63V65.4" stroke="${P.sky1}" stroke-width=".7"/>`
  )
}

/** Cuchillo: la hoja hacia arriba con la punta en (0,−len), recazo dorado, cachas oscuras con remaches y pomo.
 * `ornate` lo vuelve daga de grabado: hoja más ancha con vaceo y aguafuerte, guarnición con volutas, puño encordado
 * en magenta y pomo con piedra. */
function knife(k: Kit, len: number, ornate = false) {
  const wl = ornate ? 3.4 : 2.6, wr = ornate ? 4.4 : 3.8
  const blade = `M${-wl} 0V${f(-len * 0.62)}C${-wl} ${f(-len * 0.86)} -1 ${f(-len * 0.95)} 0 ${-len}C2.6 ${f(-len * 0.84)} ${wr} ${f(-len * 0.6)} ${wr} ${f(-len * 0.3)}V0Z`
  const bevel = `M${-wl} ${f(-len * 0.62)}C${-wl} ${f(-len * 0.86)} -1 ${f(-len * 0.95)} 0 ${-len}C-.6 ${f(-len * 0.8)} -.8 ${f(-len * 0.6)} -.8 0H${-wl}Z`
  const guard = ornate
    ? 'M-9.6 .2C-6 -1.6 -3 -1 0 -1C3 -1 6 -1.6 9.6 .2C11.2 1.2 10.8 3.2 9 3C6.4 2.8 3 3.4 0 3.4C-3 3.4 -6.4 2.8 -9 3C-10.8 3.2 -11.2 1.2 -9.6 .2Z'
    : 'M-5 0H5.6C6.4 0 6.8 .6 6.8 1.2V2.2C6.8 2.8 6.4 3.4 5.6 3.4H-5C-5.8 3.4 -6.2 2.8 -6.2 2.2V1.2C-6.2 .6 -5.8 0 -5 0Z'
  const grip = 'M-2.8 3.4H3.6L3.2 17.4H-2.4Z'
  const pommel = ornate ? 'M.4 16.6C3.4 16.6 5 18.4 5 20.2C5 22.2 3 23.4 .4 23.4C-2.2 23.4 -4.2 22.2 -4.2 20.2C-4.2 18.4 -2.6 16.6 .4 16.6Z' : 'M-2.8 17.4H3.6V18.8C3.6 20 2.4 20.6 .4 20.6C-1.6 20.6 -2.8 20 -2.8 18.8Z'
  const ricasso = `M${-wl} 0V-4.6H${wr}V0Z`
  const wrap = ornate ? Array.from({ length: 6 }, (_, i) => `M-2.6 ${f(4.4 + i * 2.2)}L3.4 ${f(6.2 + i * 2.2)}M-2.6 ${f(6.2 + i * 2.2)}L3.4 ${f(4.4 + i * 2.2)}`).join('') : ''
  const etch = ornate
    ? `<g opacity=".9">` + hair(-2, -8, -0.4, -12, -2, -16, 0.45, P.mid) + hair(2.6, -8, 1, -12, 2.6, -16, 0.45, P.mid) + hair(-1.8, -18, 0, -21, -1.4, -24.6, 0.4, P.mid) + hair(2.4, -18, 0.8, -21, 2, -24.6, 0.4, P.mid) + `</g>` +
      `<path d="${starPath(0.4, -12, 1.6, 0.6, 4)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/>`
    : ''
  const curl = (x: number, sg: number) =>
    `<g transform="translate(${x} 1.6) scale(${sg} 1)"><path d="M0 0C2.6 0 4 2 3.2 3.8C2.4 5.4 0 5.2 -.2 3.6C-.4 2.4 .8 1.8 1.6 2.6" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M0 0C2.6 0 4 2 3.2 3.8C2.4 5.4 0 5.2 -.2 3.6C-.4 2.4 .8 1.8 1.6 2.6" fill="none" stroke="${P.gold}" stroke-width=".9" stroke-linecap="round"/></g>`
  return (
    k.draw([{
      d: blade, fill: P.sky1,
      inner: k.sh(blade, 0, 0, 1, 0, 0.1, 0.9, P.blue, 0.5) + `<path d="${bevel}" fill="${P.white}"/>` + etch +
        `<path d="M1.6 ${f(-len * 0.08)}V${f(-len * 0.55)}" stroke="${P.blue}" stroke-width="${ornate ? 1.1 : 0.7}" opacity=".7"/>` + hair(-wl + 0.8, -len * 0.1, -wl + 0.6, -len * 0.5, -1.6, -len * 0.82, 0.6, '#fff'),
    }], 0.6) +
    (ornate ? k.draw([{ d: ricasso, fill: P.gold, inner: k.sh(ricasso, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M${-wl} -2.4H${wr}M${-wl} -3.6H${wr}" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.45) : '') +
    (ornate ? curl(-9.4, -1) + curl(9.4, 1) : '') +
    k.draw([
      { d: grip, fill: P.night, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.9, '#0B1226', 0.5) + (wrap ? `<path d="${wrap}" stroke="${AU}" stroke-width=".8"/>` : `<path d="M-1.6 4.6L-1.2 16" stroke="${P.mid}" stroke-width=".6"/>`) },
      { d: guard, fill: P.gold, inner: k.sh(guard, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + (ornate ? `<path d="M-8 .8C-4 2 4 2 8 .8" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` : '') },
      { d: pommel, fill: P.gold, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
    ], 0.55) +
    (wrap ? '' : `<circle cx=".4" cy="7" r=".7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/><circle cx=".4" cy="13" r=".7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>`) +
    (ornate
      ? `<circle cx="0" cy="1.2" r="1.5" fill="${AU}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-.4" cy=".8" r=".45" fill="#fff"/>` +
        `<circle cx=".4" cy="20" r="1.6" fill="${AU}" stroke="${P.ink}" stroke-width=".35"/><circle cx="0" cy="19.5" r=".5" fill="#fff"/>` +
        `<path d="M-.6 23.2H1.4L1 25H-.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
        Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return `<circle cx="${f(0.4 + Math.cos(a) * 2.6)}" cy="${f(20 + Math.sin(a) * 2.1)}" r=".35" fill="${P.goldL}"/>` }).join('')
      : '')
  )
}

/** Gota roja con brillo, con la punta arriba en (x,y). */
const drop = (x: number, y: number, s: number) =>
  `<path d="M${x} ${y}C${f(x - 1.6 * s)} ${f(y + 2.6 * s)} ${f(x - 2 * s)} ${f(y + 3.6 * s)} ${f(x - 2 * s)} ${f(y + 4.4 * s)}C${f(x - 2 * s)} ${f(y + 5.6 * s)} ${f(x - 1.1 * s)} ${f(y + 6.4 * s)} ${x} ${f(y + 6.4 * s)}C${f(x + 1.1 * s)} ${f(y + 6.4 * s)} ${f(x + 2 * s)} ${f(y + 5.6 * s)} ${f(x + 2 * s)} ${f(y + 4.4 * s)}C${f(x + 2 * s)} ${f(y + 3.6 * s)} ${f(x + 1.6 * s)} ${f(y + 2.6 * s)} ${x} ${y}Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/>` +
  `<ellipse cx="${f(x - 0.8 * s)}" cy="${f(y + 4.4 * s)}" rx="${f(0.4 * s)}" ry="${f(0.8 * s)}" fill="#fff" opacity=".85"/>`

/** Tentáculo magenta con ventosas: una curva cuadrática que se afina y una punta enrulada. */
function tentacle(k: Kit, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number, curl: number) {
  const body = taper(x0, y0, cx, cy, x1, y1, w0, w0 * 0.42)
  const len = Math.hypot(x1 - cx, y1 - cy) || 1, ux = (x1 - cx) / len, uy = (y1 - cy) / len, px = -uy * curl, py = ux * curl
  const tipEnd = [x1 + ux * 3 + px * 5, y1 + uy * 3 + py * 5]
  const tip = taper(x1, y1, x1 + ux * 5.4 + px * 1.4, y1 + uy * 5.4 + py * 1.4, tipEnd[0], tipEnd[1], w0 * 0.42, 0.6)
  const side = curl > 0 ? 1 : -1
  const suckers = along(x0, y0, cx, cy, x1, y1, [0.3, 0.42, 0.54, 0.65, 0.75, 0.84, 0.92]).map((q, i) => {
    const l = Math.hypot(q.dx, q.dy) || 1, w = (w0 * (1 - (0.3 + i * 0.1) * 0.58)) / 2, r = Math.max(0.5, w * 0.36)
    const x = q.x + (q.dy / l) * w * 0.5 * side, y = q.y - (q.dx / l) * w * 0.5 * side
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${AU_L}" stroke="${AU_D}" stroke-width=".3"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.4)}" fill="${AU_M}"/>`
  }).join('')
  return k.draw([
    { d: body, fill: AU, inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, AU_D, 0.5) + hair(x0 - 1, y0 - 2, cx - 1.4, cy - 1.4, x1 - 0.6, y1 - 0.6, w0 * 0.14, AU_L, 0.7) },
    { d: tip, fill: AU, inner: k.sh(tip, 0, 0, 1, 1, 0, 0.9, AU_D, 0.5) },
  ], 0.65) + suckers
}

export const AMONGUS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Sus ────────────────────────────────────────────────────────────

  // La primera de impostor: saliste del ducto como si nada. La rejilla con la tapa levantada y la luz que sale de abajo.
  'Ventilación': (u) => {
    const k = kit(u)
    return (
      espacio(k, 5, 0.6) +
      deck(k, 60, 80, 38, 15) +
      vent(k, 1) +
      hair(52, 58, 49, 50, 53, 42, 0.7, AU_L, 0.8) + hair(60, 58, 63, 48, 59, 38, 0.6, AU_L, 0.7) + hair(68, 58, 71, 52, 68, 44, 0.6, AU_L, 0.7) +
      `<text x="60" y="30" ${GEORGIA} font-style="italic" font-size="5" fill="${P.paper}" text-anchor="middle">como si nada…</text>` +
      sparkle(88, 44, 1.8, P.paper) + sparkle(32, 46, 1.4, P.paper) +
      k.defs()
    )
  },

  // Cinco de impostor: apagaste las luces y aprovechaste. La palanca de cuchillas bajada, con chispas, y la lamparita apagada.
  'Sabotaje': (u) => {
    const k = kit(u)
    const plate = roundRect(44, 46, 76, 94, 2.4)
    const clip = (x: number, y: number) => `<path d="M${x - 2} ${y - 2.4}H${x + 2}V${y + 2.4}H${x - 2}Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".45"/><path d="M${x - 1.2} ${y - 2.4}V${y + 2.4}M${x + 1.2} ${y - 2.4}V${y + 2.4}" stroke="${P.goldL}" stroke-width=".35"/>`
    // Las cuchillas giran sobre las bisagras de abajo (y=84); abiertas quedan inclinadas `ang` grados.
    const ang = 50, L = 28, dx = Math.sin((ang * Math.PI) / 180), dy = -Math.cos((ang * Math.PI) / 180)
    const tip = (x: number, l: number) => `${f(x + dx * l)} ${f(84 + dy * l)}`
    const bar = { x: 60 + dx * (L - 3), y: 84 + dy * (L - 3) }
    const bulb = 'M-6.4 -1.6C-6.4 -6 -3.6 -9 0 -9C3.6 -9 6.4 -6 6.4 -1.6C6.4 1.6 4 3.4 3 5.6H-3C-4 3.4 -6.4 1.6 -6.4 -1.6Z'
    const sockets = 'M-3.2 5.6H3.2V10.4H-3.2Z'
    const sparks = [[56, 58, -150], [64, 58, -30], [60, 55.4, -90], [54, 62, 160], [66, 62, 20], [60, 60, 70]].map(([x, y, a]) => {
      const r = (a * Math.PI) / 180
      return `<path d="M${x} ${y}l${f(Math.cos(r) * 4)} ${f(Math.sin(r) * 4)}" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/><circle cx="${f(x + Math.cos(r) * 5.2)}" cy="${f(y + Math.sin(r) * 5.2)}" r=".5" fill="${P.goldL}"/>`
    }).join('')
    return (
      `<rect width="120" height="130" fill="#0E1433"/>` + k.shade(FULL, k.rad(AU_D, 0.5, 0.6, 0.5, 0.7, 0), AU_D, 0.3) + stars(19, 18) +
      `<path d="M38 14V27" stroke="${P.ink}" stroke-width="1.6"/><path d="M38 14V27" stroke="${P.mid}" stroke-width=".7"/>` +
      `<g transform="translate(38 39.6) rotate(180) scale(1.25)">` +
      k.draw([
        { d: sockets, fill: P.sky2, inner: `<path d="M-3.2 6.8H3.2M-3.2 8.2H3.2M-3.2 9.6H3.2" stroke="${P.mid}" stroke-width=".5"/>` },
        { d: bulb, fill: '#2A3566', inner: k.sh(bulb, 0, 0, 1, 1, 0, 0.8, '#0B1226', 0.5) + `<path d="M-4.4 -3C-4.4 -5.6 -2.6 -7.4 -.6 -7.6" fill="none" stroke="${P.sky}" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` },
      ], 0.6) +
      `<path d="M-1.6 5.6L-1.2 -1.6L0 -3L1.2 -1.6L1.6 5.6" fill="none" stroke="${P.blue}" stroke-width=".45"/>` +
      `<path d="M-.2 10.4V11.6" stroke="${P.ink}" stroke-width="1"/></g>` +
      k.cast([plate], 2, 2.4, '#05081A') +
      k.draw([{
        d: plate, fill: P.white,
        inner: k.sh(plate, 0, 0, 1, 1, 0, 0.75, P.blue, 0.4) + `<path d="${roundRect(46.4, 48.4, 73.6, 91.6, 1.4)}" fill="none" stroke="${P.sky}" stroke-width=".6"/>` +
          Array.from({ length: 7 }, (_, i) => `<path d="M${44 + i * 5} 46L${48 + i * 5} 46L${44 + i * 5} 51.4L${40 + i * 5} 51.4Z" fill="${P.gold}"/>`).join('') + `<path d="M44 51.4H76" stroke="${P.ink}" stroke-width=".4"/>` +
          `<path d="M60 64.6L57 71H60.4L58.2 77.4L64 69.4H60.6L62.6 64.6Z" fill="${P.sky}" stroke="${P.blue}" stroke-width=".35"/>`,
      }], 0.7) +
      [[47.4, 49], [72.6, 49], [47.4, 91], [72.6, 91]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/><path d="M${x - 0.6} ${y}H${x + 0.6}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      clip(54, 58) + clip(66, 58) +
      sparks +
      rod(`M54 84L${tip(54, L)}`, P.goldD, 1.8) + rod(`M66 84L${tip(66, L)}`, P.goldD, 1.8) +
      `<path d="M54 84L${tip(54, L)}M66 84L${tip(66, L)}" stroke="${P.goldL}" stroke-width=".45" transform="translate(-.5 -.3)"/>` +
      `<g transform="translate(${f(bar.x)} ${f(bar.y)})">` +
      `<g transform="rotate(${ang})">` + k.draw([
        { d: 'M-1.8 -1.4H1.8L1.4 -11H-1.4Z', fill: P.night, inner: k.sh('M0 -12H3V2H0Z', 0, 0, 1, 0, 0, 0.9, '#0B1226', 0.5) },
        { d: ellipse(0, -12.4, 3.2, 2.6), fill: P.red, inner: k.sh(ellipse(0, -12.4, 3.2, 2.6), 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<circle cx="-1" cy="-13.2" r=".7" fill="#fff"/>` },
      ], 0.55) + `</g>` +
      k.draw([{ d: 'M-8.4 -1.6H8.4V1.6H-8.4Z', fill: P.night, inner: `<path d="M-8.4 -.6H8.4" stroke="${P.mid}" stroke-width=".45"/>` }], 0.5) +
      `<circle cx="-6" cy="0" r=".6" fill="${P.goldL}"/><circle cx="6" cy="0" r=".6" fill="${P.goldL}"/></g>` +
      clip(54, 84) + clip(66, 84) +
      `<circle cx="54" cy="84" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="66" cy="84" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="85" y="38" ${GEORGIA} font-style="italic" font-size="5" fill="${P.paper}" text-anchor="middle" transform="rotate(10 85 38)">¡clac!</text>` +
      sparkle(60, 57, 2.6, P.goldL) +
      k.defs()
    )
  },

  // Doce de impostor: tentáculos y cara de "yo estaba en electricidad". El cartel de Electricidad abrazado por
  // tentáculos, como la coartada.
  'Alien de la nave': (u) => {
    const k = kit(u)
    const sign = roundRect(-23, -13, 23, 13, 1.6)
    const face = roundRect(-19.6, -9.6, 19.6, 9.6, 0.8)
    const stripes = Array.from({ length: 18 }, (_, i) => `M${-30 + i * 4} -15L${-27 + i * 4} -15L${-35 + i * 4} 15L${-38 + i * 4} 15Z`).join('')
    const icon = 'M-1.2 -7.6L-5 -.6H-1.4L-3.4 5.6L3.4 -2.4H-.2L2.2 -7.6Z'
    return (
      espacio(k, 31, 0.5) +
      k.sun(60, 54, 20, 50, 36, false) +
      k.shade(ellipse(60, 54, 26, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.35) +
      tentacle(k, 92, 100, 92, 64, 80, 40, 8.6, -1) +
      tentacle(k, 52, 104, 44, 84, 46, 70, 6.4, 1) +
      `<path d="M46 20L49 40M74 20L71 40" stroke="${P.ink}" stroke-width="1.4"/><path d="M46 20L49 40M74 20L71 40" stroke="${P.sky2}" stroke-width=".7" stroke-dasharray="1.4 .6"/>` +
      `<g transform="translate(60 52) rotate(-5)">` +
      k.cast([sign], 2, 2.4, '#05081A') +
      k.draw([{
        d: sign, fill: P.gold,
        inner: k.clip(sign, `<path d="${stripes}" fill="${P.night}"/>`) + k.sh(sign, 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4),
      }], 0.75) +
      k.draw([{ d: face, fill: P.white, inner: k.sh(face, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) + hair(-16, -7, -6, -8, 6, -7.6, 0.6, '#fff') }], 0.4) +
      `<g transform="translate(0 -3.4) scale(.72)">` + k.draw([{ d: icon, fill: P.gold, inner: k.sh(icon, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.4) + `</g>` +
      `<path d="M-15 -3.4H-6M6 -3.4H15" stroke="${P.sky}" stroke-width=".6"/>` +
      `<text x="0" y="6.2" ${GEORGIA} font-weight="700" font-size="4.2" fill="${P.ink}" text-anchor="middle" textLength="33" lengthAdjust="spacingAndGlyphs">ELECTRICIDAD</text>` +
      [[-21, -11], [21, -11], [-21, 11], [21, 11]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `</g>` +
      tentacle(k, 24, 98, 22, 66, 34, 44, 8.6, 1) +
      tentacle(k, 70, 108, 76, 82, 68, 66, 6.4, -1) +
      sparkle(88, 28, 2.2, P.paper) + sparkle(30, 30, 1.6, P.paper) +
      k.defs()
    )
  },

  // ── Tripulación ────────────────────────────────────────────────────

  // Tres de tripulante: te escaneaste para demostrarlo. La plataforma del escáner con las huellas y el haz verde.
  'Escaneo médico': (u) => {
    const k = kit(u)
    const top = ellipse(60, 82, 22, 7.4)
    const side = 'M38 82V87A22 7.4 0 0 0 82 87V82A22 7.4 0 0 1 38 82Z'
    const beam = 'M39.6 82L44 30H76L80.4 82Z'
    const rings = [[42, 0.35, 0.5], [52, 0.55, 0.6], [70, 0.7, 0.6]].map(([y, o, w]) => `<path d="${ellipse(60, y, 19.4, 6)}" fill="none" stroke="${SCAN}" stroke-width="${w}" opacity="${o}"/>`).join('') +
      `<path d="${ellipse(60, 61, 19.6, 6.2)}" fill="none" stroke="${SCAN}" stroke-width="3" opacity=".35"/><path d="${ellipse(60, 61, 19.6, 6.2)}" fill="none" stroke="#fff" stroke-width="1.1"/>`
    const streaks = [44, 50, 56, 63, 69, 75].map((x, i) => hair(x, 80, x + (i % 2 ? 0.6 : -0.6), 60, x, 36 + (i % 3) * 4, 0.6, i % 2 ? '#fff' : SCAN, 0.55)).join('')
    const boot = (x: number, r: number) => `<g transform="translate(${x} 82) rotate(${r}) scale(1.1 .44)"><path d="M-2.6 -6.4C-2.6 -9 2.6 -9 2.6 -6.4V-1H-2.6Z M-2.6 1H2.6V5C2.6 7.8 -2.6 7.8 -2.6 5Z" fill="${P.night}" opacity=".75"/></g>`
    const check = 'M-3.6 0L-1 2.8L4 -3'
    return (
      espacio(k, 13, 0.4) +
      k.shade(ellipse(60, 58, 30, 34), k.rad(SCAN, 0.5, 0.5, 0.5, 0.45, 0), SCAN, 0.25) +
      k.floor(60, 88, 26, 3, '#000') +
      k.draw([{ d: side, fill: P.sky2, inner: k.sh(side, 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) + Array.from({ length: 9 }, (_, i) => `<circle cx="${f(42 + i * 4.5)}" cy="${f(86.4 + Math.sin(((i + 0.5) / 9) * Math.PI) * 4.4)}" r=".7" fill="${SCAN}" stroke="${P.ink}" stroke-width=".25"/>`).join('') }], 0.65) +
      k.draw([{ d: top, fill: P.white, inner: `<path d="${ellipse(60, 82, 18.4, 5.8)}" fill="${SCAN}"/>` + `<path d="${ellipse(60, 82, 18.4, 5.8)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.8, 0)}"/>` + `<path d="${ellipse(60, 82, 18.4, 5.8)}" fill="none" stroke="${SCAN_D}" stroke-width=".5"/>` + boot(55.4, -6) + boot(64.6, 6) }], 0.6) +
      `<path d="${beam}" fill="${k.lin(SCAN, 0, 1, 0, 0, 0.45, 0)}"/>` +
      `<path d="M47 82L49 30H71L73 82Z" fill="${k.lin('#ffffff', 0, 1, 0, 0, 0.35, 0)}"/>` +
      streaks + rings +
      `<g transform="translate(83.6 42)">` + k.draw([{ d: ellipse(0, 0, 6.4, 6.4), fill: SCAN, inner: k.sh(ellipse(0, 0, 6.4, 6.4), 0, 0, 1, 1, 0, 0.9, SCAN_D, 0.5) }], 0.55) +
      `<path d="${check}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="${check}" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></g>` +
      sparkle(32, 40, 1.6, P.paper) +
      k.defs()
    )
  },

  // Diez de tripulante: todos los colores en su lugar. El panel de cables con las cuatro conexiones cruzadas y la luz verde.
  'Cables conectados': (u) => {
    const k = kit(u)
    const box = roundRect(27, 34, 93, 92, 3)
    const face = roundRect(31.4, 42, 88.6, 87.6, 1.6)
    const ys = [50, 60, 70, 80]
    const left = [P.red, '#4C7FD8', P.gold, AU]
    const right = [P.gold, AU, P.red, '#4C7FD8']
    const wires = left.map((c, i) => {
      const j = right.indexOf(c), y0 = ys[i], y1 = ys[j]
      const d = `M38 ${y0}C52 ${y0} 66 ${y1} 82 ${y1}`
      return `<path d="${d}" fill="none" stroke="#000" stroke-width="5" opacity=".35" transform="translate(1 1.6)"/>` +
        `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="${d}" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7" transform="translate(-.3 -.8)"/>`
    }).join('')
    const term = (x: number, y: number, c: string, flip: number) =>
      `<g transform="translate(${x} ${y}) scale(${flip} 1)">` +
      k.draw([{ d: 'M-5 -3H1V3H-5Z', fill: P.night, inner: `<path d="M-5 -1.6H1" stroke="${P.mid}" stroke-width=".4"/>` }, { d: 'M-6.4 -2.4H-4.6V2.4H-6.4Z', fill: c }], 0.4) +
      `<path d="M1 -1H3.4V1H1Z" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/></g>`
    return (
      espacio(k, 23, 0.5) +
      k.cast([box], 2.2, 2.6, '#05081A') +
      k.draw([{
        d: box, fill: P.sky2,
        inner: k.sh(box, 0, 0, 1, 1, 0, 0.85, P.mid, 0.45) + `<path d="M27 34H93V40H27Z" fill="${P.white}" opacity=".5"/>` +
          `<path d="${face}" fill="#151C40"/>` + k.clip(face, Array.from({ length: 12 }, (_, i) => `<path d="M${31 + i * 5} 42V88" stroke="${STEEL}" stroke-width=".4"/>`).join('') + k.sh(face, 0, 0, 0, 1, 0.6, 0, '#000', 0.4)) +
          `<path d="${face}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` + hair(30, 90, 50, 90.6, 80, 90, 0.5, P.mid, 0.6),
      }], 0.8) +
      [[30, 37], [90, 37], [30, 89.4], [90, 89.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/><path d="M${x - 0.7} ${y + 0.4}L${x + 0.7} ${y - 0.4}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `<circle cx="60" cy="38.2" r="2.6" fill="${SCAN}" stroke="${P.ink}" stroke-width=".5"/><circle cx="59.2" cy="37.4" r=".8" fill="#fff"/>` + k.shade(ellipse(60, 38.2, 6, 4), k.rad(SCAN, 0.5, 0.5, 0.5, 0.7, 0), SCAN, 0.3) +
      `<path d="M44 37.4H52M68 37.4H76" stroke="${P.mid}" stroke-width=".8" stroke-linecap="round"/>` +
      wires +
      ys.map((y, i) => term(37.4, y, left[i], 1) + term(82.6, y, right[i], -1)).join('') +
      sparkle(92, 30, 2, P.paper) + sparkle(28, 98, 1.4, P.paper) +
      k.defs()
    )
  },

  // Veinticinco de tripulante: gorra de capitán y botón de emergencia propio. La mesa con el botón rojo bajo la
  // tapa de vidrio levantada y la gorra con galones apoyada al lado, bajo una gloria dorada.
  'Capitán de la nave': (u) => {
    const k = kit(u)
    const top = ellipse(60, 78, 28, 10)
    const side = 'M32 78V85A28 10 0 0 0 88 85V78A28 10 0 0 1 32 78Z'
    const ring = `${ellipse(60, 77, 14.4, 5.2)} ${ellipse(60, 77, 10, 3.4)}`
    const rc = k.id('hz')
    const stripes = Array.from({ length: 16 }, (_, i) => `M${44 + i * 2.2} 70L${45.2 + i * 2.2} 70L${43.4 + i * 2.2} 84L${42.2 + i * 2.2} 84Z`).join('')
    const dome = 'M51.4 76.4C51.4 69.6 55.2 66.6 60 66.6C64.8 66.6 68.6 69.6 68.6 76.4Z'
    const domeBase = ellipse(60, 76.4, 8.6, 2.8)
    const glass = 'M49.6 74C48 64 52 55 60 53C68 55 72 64 70.4 74C66 72.6 54 72.6 49.6 74Z'
    // La gorra de capitán, de frente: copa blanca, banda y visera azul noche, cordón y escudo dorados.
    const crown = 'M-17.4 -2.6C-18.6 -9 -10 -13.4 0 -13.4C10 -13.4 18.6 -9 17.4 -2.6C15.4 1.2 8 3 0 3C-8 3 -15.4 1.2 -17.4 -2.6Z'
    const band = 'M-14.6 -.4C-8 2.4 8 2.4 14.6 -.4L13.8 6C8 8.4 -8 8.4 -13.8 6Z'
    const peak = 'M-13.8 5.4C-8 8 8 8 13.8 5.4C14.4 8.6 9 12.2 0 12.2C-9 12.2 -14.4 8.6 -13.8 5.4Z'
    const leaves = Array.from({ length: 10 }, (_, i) => {
      const t = (i + 0.5) / 10, x = -11.6 + t * 23.2, y = 8.8 + Math.sin(t * Math.PI) * 1.6, r = (t - 0.5) * 40
      return `<path d="M0 0C.8 -1 2.4 -1 3 0C2.4 1 .8 1 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(r + (i % 2 ? 20 : -20))})" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/>`
    }).join('')
    return (
      espacio(k, 47, 0.4) +
      k.sun(60, 58, 18, 50, 32, false) +
      k.shade(ellipse(60, 60, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.35) +
      k.floor(60, 88, 30, 3, '#000') +
      k.draw([
        { d: side, fill: STEEL, inner: k.sh(side, 0, 0, 1, 0, 0, 0.9, STEEL_D, 0.5) + `<path d="M33 81.6A28 10 0 0 0 87 81.6" fill="none" stroke="${P.blue}" stroke-width=".5"/>` },
        { d: top, fill: P.sky2, inner: k.sh(top, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="${ellipse(60, 78, 24.6, 8.4)}" fill="none" stroke="${P.blue}" stroke-width=".45"/>` + hair(36, 76, 44, 70.6, 56, 68.8, 0.6, '#fff', 0.8) },
      ], 0.7) +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.gold}"/><clipPath id="${rc}"><path d="${ring}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${rc})"><path d="${stripes}" fill="${P.night}"/></g>` +
      `<path d="${ring}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width=".55"/>` +
      `<text x="60" y="87.4" ${GEORGIA} font-weight="700" font-size="3" fill="${P.goldL}" text-anchor="middle" letter-spacing=".3">EMERGENCIA</text>` +
      `<g opacity=".9">` + `<path d="${glass}" fill="${P.sky1}" opacity=".3"/>` + `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` + hair(53, 70, 52, 62, 57, 56, 0.9, '#fff') + `</g>` +
      k.draw([
        { d: domeBase, fill: P.sky1, inner: k.sh(domeBase, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        { d: dome, fill: P.red, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.95, P.wine, 0.5) + `<path d="M54.4 73C54.4 70 56.4 68.4 58.6 68" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>` },
      ], 0.6) +
      `<g transform="translate(37.6 66.4) rotate(-14) scale(.64)">` +
      k.cast([crown, band, peak], 2, 3, '#05081A') +
      k.draw([
        { d: crown, fill: P.white, inner: k.sh(crown, 0, 0, 1, 1, 0, 0.85, P.blue, 0.45) + hair(-13, -6, -8, -11, 0, -12, 1, '#fff') + `<path d="M-16 -4C-8 -1 8 -1 16 -4" fill="none" stroke="${P.sky}" stroke-width=".6"/>` },
        { d: band, fill: P.night, inner: k.sh(band, 0, 0, 1, 0, 0, 0.8, '#0B1226', 0.45) },
        { d: peak, fill: P.night, inner: k.sh(peak, 0, 0, 1, 1, 0, 0.8, '#0B1226', 0.5) + hair(-10, 8, 0, 10.6, 10, 8, 0.8, P.mid) + leaves },
      ], 0.9) +
      `<path d="M-13.4 4.2C-6 6.4 6 6.4 13.4 4.2" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M-13.4 4.2C-6 6.4 6 6.4 13.4 4.2" fill="none" stroke="${P.gold}" stroke-width="1" stroke-dasharray="1.2 .5"/>` +
      `<circle cx="-13.4" cy="4.2" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="13.4" cy="4.2" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<ellipse cx="0" cy="-2.4" rx="4.6" ry="4" fill="none" stroke="${P.gold}" stroke-width="1.8"/><ellipse cx="0" cy="-2.4" rx="4.6" ry="4" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".8 .6"/>` +
      `<path d="${starPath(0, -2.4, 2.8, 1.1, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      sparkle(88, 36, 2.4, '#fff') + sparkle(33, 34, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Asesino serial ─────────────────────────────────────────────────

  // Cinco eliminaciones: discreto, pero efectivo. El cuchillito con una gota y el "shh…".
  'Cuchillito': (u) => {
    const k = kit(u)
    return (
      espacio(k, 17, 0.7) +
      `<circle cx="60" cy="60" r="27" fill="none" stroke="${AU_M}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round" opacity=".8"/>` +
      `<g transform="translate(53 70) rotate(38)">` + k.cast(['M-2.6 0V-26L0 -40L3.8 -26V0Z'], 1.6, 2, '#05081A') + knife(k, 40) + `</g>` +
      drop(80.6, 48, 1) + drop(78, 64, 0.7) +
      `<text x="40" y="44" ${GEORGIA} font-style="italic" font-size="6.2" fill="${P.paper}" text-anchor="middle" transform="rotate(-8 40 44)">shh…</text>` +
      sparkle(84, 32, 1.8, P.paper) +
      k.defs()
    )
  },

  // Veinte eliminaciones: entrás y salís de la ventilación como Pedro por su casa. La rejilla abierta con su felpudo
  // de bienvenida y las pantuflas acomodadas.
  'Ninja del ducto': (u) => {
    const k = kit(u)
    const mat = 'M30 88.6L90 88.6L95 100H25Z'
    const slipper = (x: number, y: number, r: number) => {
      const sole = 'M0 -4.6C2 -4.6 3 -2.6 3 0V3.6C3 5.2 1.8 6 0 6C-1.8 6 -3 5.2 -3 3.6V0C-3 -2.6 -2 -4.6 0 -4.6Z'
      const strap = 'M-3.2 -1.4C-2 -2.6 2 -2.6 3.2 -1.4L3 1.6C2 1 -2 1 -3 1.6Z'
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1 .7)">` + k.draw([{ d: sole, fill: P.white, inner: k.sh(sole, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) }, { d: strap, fill: AU, inner: k.sh(strap, 0, 0, 1, 1, 0, 0.8, AU_D, 0.4) }], 0.4) + `</g>`
    }
    return (
      espacio(k, 29, 0.55) +
      `<g transform="translate(60 54) scale(.86) translate(-60 -64)">` + deck(k, 60, 80, 38, 15) + vent(k, 0.75) + `</g>` +
      k.draw([{
        d: mat, fill: P.brown,
        inner: k.sh(mat, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + Array.from({ length: 24 }, (_, i) => `<path d="M${f(28 + i * 2.8)} 89V99.6" stroke="${P.brownD}" stroke-width=".35" opacity=".6"/>`).join('') +
          `<path d="M32.6 90.6L87.4 90.6L91 98.4H29Z" fill="none" stroke="${P.goldL}" stroke-width=".6"/>`,
      }], 0.6) +
      `<text x="60" y="96.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.4" fill="${P.goldL}" text-anchor="middle">bienvenido</text>` +
      slipper(85, 82, 12) + slipper(91.4, 83, 20) +
      sparkle(86, 32, 2, P.paper) + sparkle(30, 40, 1.4, P.paper) +
      k.defs()
    )
  },

  // Cincuenta eliminaciones: en el espacio nadie te escucha gritar. La daga grabada bajo la gloria magenta, la nave
  // a lo lejos con las luces de alarma y el planeta.
  'Pesadilla espacial': (u) => {
    const k = kit(u)
    const planet = ellipse(96, 112, 40, 34)
    const ship = 'M-14 0C-14 -3 -9 -5 -2 -5.4L4 -7.6H8L7 -5C11 -4.4 14 -2.6 14 0C14 2.6 11 4.4 7 5L8 7.6H4L-2 5.4C-9 5 -14 3 -14 0Z'
    return (
      espacio(k, 61, 0.4) +
      k.draw([{ d: planet, fill: AU_D, inner: k.shade(planet, k.rad(AU, 0.3, 0.2, 0.6, 0.9, 0), AU, 0.4) + `<path d="M58 96C70 92 84 92 96 96M62 104C74 100 86 100 100 104" fill="none" stroke="${AU_M}" stroke-width=".6" opacity=".7"/>` + `<path d="${planet}" fill="none" stroke="${AU_L}" stroke-width="1" opacity=".6"/>` }], 0.6) +
      magGlory(k, 58, 56, 14, 46, 36) +
      k.shade(ellipse(58, 56, 22, 22), k.rad(AU_L, 0.5, 0.5, 0.5, 0.7, 0), AU_M, 0.4) +
      `<g transform="translate(42 31) rotate(-14) scale(.72)">` +
      k.draw([{ d: ship, fill: P.sky2, inner: k.sh(ship, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<path d="M-12 0H12" stroke="${P.mid}" stroke-width=".4"/>` }], 0.5) +
      [-8, -4, 0, 4].map((x) => `<circle cx="${x}" cy="-1.6" r=".9" fill="${P.red}" stroke="${P.ink}" stroke-width=".2"/>`).join('') +
      `<path d="M14 0H19" stroke="${AU_M}" stroke-width="2" stroke-linecap="round" opacity=".6"/></g>` +
      `<g transform="translate(52 76) rotate(32) scale(1.16)">` + k.cast(['M-2.6 0V-26L0 -42L3.8 -26V0Z'], 1.6, 2, '#05081A') + knife(k, 42, true) + `</g>` +
      drop(84.2, 46, 1.1) + drop(87.4, 60, 0.8) +
      `<text x="78" y="88" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.paper}" text-anchor="middle" opacity=".9">¡aaah…</text>` +
      `<text x="86" y="93" ${GEORGIA} font-style="italic" font-size="3.4" fill="${P.paper}" text-anchor="middle" opacity=".45">…</text>` +
      sparkle(88, 30, 2.4, P.paper) + sparkle(28, 66, 1.6, P.paper) +
      k.defs()
    )
  },
}
