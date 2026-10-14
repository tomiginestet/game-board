// Piezas compartidas por las medallas de minigolf, bowling, bochas y petanca: las bolas (la pelotita de golf con
// hoyuelos, la bola de bowling con sus tres agujeros, la bocha de resina, la bola de acero de la petanca y el bochín),
// el pino de bowling, la nube de polvo del golpe y la cinta con texto. No exporta ningún mapa de medallas.
import { f } from '../helpers'
import { ellipse, hair, P, type Kit } from '../kit'

export const GEORGIA = 'font-family="Georgia, serif"'
export const FULL = 'M0 0H120V130H0Z'

/** Acero de la petanca: claro, sombra azulada y el reflejo del cielo. */
export const STEEL = '#B4BED2', STEEL_D = '#4F5F86', STEEL_L = '#EEF2F8'
/** Resina de las bochas: roja y verde, apagadas. */
export const BOCHA_R = '#B9473D', BOCHA_RD = '#7C2620', BOCHA_G = '#6F8F47', BOCHA_GD = '#43602A'
/** Polvo de la cancha (arena, ladrillo molido). */
export const DIRT = '#D9B98C', DIRT_D = '#A97F4E'

/** Papel del día con el borde granulado en otro color (para que cada deporte tenga su clima). */
export const tinted = (k: Kit, edge: string, grain: string, a = 0.45) =>
  `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(edge, 0.5, 0.46, 0.7, 0, 1), grain, a)

/** Resplandor suave detrás de algo. */
export const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) =>
  k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

interface SphereOpts {
  /** Decoración pegada a la bola (rayas, hoyuelos, agujeros), recortada a ella y debajo del sombreado. */
  deco?: string
  /** Encima del sombreado (reflejos especiales). */
  top?: string
  /** Brillo blanco arriba a la izquierda. */
  gloss?: number
  w?: number
}

/** Bola entintada en (cx,cy) de radio r: relleno, sombra radial granulada hacia abajo a la derecha y un brillo. */
export function sphere(k: Kit, cx: number, cy: number, r: number, fill: string, dark: string, o: SphereOpts = {}) {
  const d = ellipse(cx, cy, r, r)
  const g = o.gloss ?? 0.85
  return k.draw([{
    d, fill,
    inner:
      (o.deco ?? '') +
      k.shade(d, k.rad(dark, 0.32, 0.28, 0.85, 0, 0.9), dark, 0.4) +
      `<path d="${ellipse(f(cx + r * 0.35), f(cy + r * 0.45), f(r * 0.9), f(r * 0.5))}" fill="${k.rad(dark, 0.5, 0.5, 0.5, 0.35, 0)}" transform="rotate(-35 ${f(cx + r * 0.35)} ${f(cy + r * 0.45)})"/>` +
      (o.top ?? '') +
      (g > 0 ? `<ellipse cx="${f(cx - r * 0.38)}" cy="${f(cy - r * 0.42)}" rx="${f(r * 0.26)}" ry="${f(r * 0.14)}" fill="#fff" opacity="${g}" transform="rotate(-38 ${f(cx - r * 0.38)} ${f(cy - r * 0.42)})"/>` : ''),
  }], o.w ?? f(Math.min(0.75, 0.25 + r * 0.035)))
}

/** Pelotita de golf: blanca con hoyuelos que se achican hacia el borde. `fill` la pinta (la naranja de la cábala). */
export function golfBall(k: Kit, cx: number, cy: number, r: number, fill = P.white, dark = P.blue, dimple = P.sky2) {
  let dots = ''
  const step = r * 0.3
  for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) {
    const x = (i + (j % 2 ? 0.5 : 0)) * step, y = j * step * 0.87, d = Math.hypot(x, y) / r
    if (d > 0.93) continue
    const s = Math.sqrt(1 - d * d), rr = r * 0.085 * (0.45 + 0.55 * s)
    const ang = (Math.atan2(y, x) * 180) / Math.PI
    dots += `<ellipse cx="${f(cx + x)}" cy="${f(cy + y)}" rx="${f(rr * s + rr * 0.15)}" ry="${f(rr)}" transform="rotate(${f(ang)} ${f(cx + x)} ${f(cy + y)})" fill="${dimple}" opacity=".85"/>`
  }
  return sphere(k, cx, cy, r, fill, dark, { deco: dots })
}

/** Bola de bowling con su marmolado y los tres agujeros (centrados en `hx`,`hy` relativos al radio). */
export function bowlingBall(k: Kit, cx: number, cy: number, r: number, fill = P.mid, dark = P.night, o: { swirl?: string; hx?: number; hy?: number; rot?: number } = {}) {
  const hx = o.hx ?? -0.12, hy = o.hy ?? -0.2, rot = o.rot ?? 0
  const holes = [[0, 0, 0.13], [-0.27, 0.2, 0.11], [0.27, 0.2, 0.11]].map(([x, y, rr]) => {
    const a = (rot * Math.PI) / 180
    const px = cx + r * (hx + x * Math.cos(a) - y * Math.sin(a)), py = cy + r * (hy + x * Math.sin(a) + y * Math.cos(a))
    return `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${f(r * rr)}" ry="${f(r * rr * 0.92)}" fill="${P.night}" stroke="${P.ink}" stroke-width="${f(r * 0.025)}"/>` +
      `<path d="M${f(px - r * rr * 0.7)} ${f(py + r * rr * 0.55)}A${f(r * rr)} ${f(r * rr * 0.92)} 0 0 0 ${f(px + r * rr * 0.75)} ${f(py + r * rr * 0.5)}" fill="none" stroke="${o.swirl ?? P.blue}" stroke-width="${f(r * 0.035)}" opacity=".8"/>`
  }).join('')
  const sw = o.swirl ?? P.blue
  const marble =
    hair(cx - r * 0.9, cy + r * 0.1, cx - r * 0.2, cy + r * 0.7, cx + r * 0.7, cy + r * 0.5, r * 0.09, sw, 0.55) +
    hair(cx - r * 0.6, cy - r * 0.7, cx + r * 0.3, cy - r * 0.2, cx + r * 0.9, cy - r * 0.5, r * 0.07, sw, 0.5) +
    hair(cx - r * 0.3, cy + r * 0.95, cx + r * 0.2, cy + r * 0.3, cx + r * 0.95, cy + r * 0.15, r * 0.05, sw, 0.45)
  return sphere(k, cx, cy, r, fill, dark, { deco: marble + holes, gloss: 0.9 })
}

/** Bocha de resina (roja o verde) con su marca: tres circulitos grabados. */
export function bocha(k: Kit, cx: number, cy: number, r: number, verde = false, o: { mark?: boolean; deco?: string } = {}) {
  const fill = verde ? BOCHA_G : BOCHA_R, dark = verde ? BOCHA_GD : BOCHA_RD
  const mark = o.mark === false ? '' : [[-0.05, 0.05], [0.25, -0.12], [0.22, 0.24]].map(([x, y]) =>
    `<circle cx="${f(cx + x * r)}" cy="${f(cy + y * r)}" r="${f(r * 0.1)}" fill="none" stroke="${dark}" stroke-width="${f(r * 0.04)}"/>` +
    `<circle cx="${f(cx + x * r)}" cy="${f(cy + y * r)}" r="${f(r * 0.035)}" fill="${dark}"/>`).join('')
  return sphere(k, cx, cy, r, fill, dark, { deco: (o.deco ?? '') + mark, gloss: 0.9 })
}

/** Bochín (o boliche de la petanca): bolita chica de madera clara o de color. */
export const bochin = (k: Kit, cx: number, cy: number, r: number, fill: string = P.white, dark: string = P.goldD) =>
  sphere(k, cx, cy, r, fill, dark, { gloss: 0.9, w: 0.45 })

/** Bola de petanca: acero con el horizonte reflejado y las estrías grabadas, inclinadas `tilt` grados. */
export function boule(k: Kit, cx: number, cy: number, r: number, o: { tilt?: number; gold?: boolean; deco?: string } = {}) {
  const tilt = o.tilt ?? -24
  const fill = o.gold ? P.gold : STEEL, dark = o.gold ? P.goldD : STEEL_D, light = o.gold ? P.goldL : STEEL_L
  const groove = (dx: number) => `<ellipse cx="${f(cx + dx * r)}" cy="${cy}" rx="${f(r * 0.36 * Math.sqrt(1 - dx * dx))}" ry="${f(r * Math.sqrt(1 - dx * dx))}" fill="none" stroke="${dark}" stroke-width="${f(r * 0.05)}" transform="rotate(${tilt} ${cx} ${cy})"/>`
  const deco =
    // cielo arriba, tierra abajo: la línea del horizonte un poco debajo del centro
    `<path d="M${cx - r} ${f(cy - r)}H${cx + r}V${f(cy + r * 0.12)}C${f(cx + r * 0.4)} ${f(cy + r * 0.22)} ${f(cx - r * 0.4)} ${f(cy + r * 0.22)} ${cx - r} ${f(cy + r * 0.08)}Z" fill="${light}" opacity=".75"/>` +
    `<path d="M${cx - r} ${f(cy + r * 0.08)}C${f(cx - r * 0.4)} ${f(cy + r * 0.22)} ${f(cx + r * 0.4)} ${f(cy + r * 0.22)} ${cx + r} ${f(cy + r * 0.12)}" fill="none" stroke="${dark}" stroke-width="${f(r * 0.05)}" opacity=".7"/>` +
    `<path d="M${cx - r} ${f(cy + r * 0.08)}C${f(cx - r * 0.4)} ${f(cy + r * 0.22)} ${f(cx + r * 0.4)} ${f(cy + r * 0.22)} ${cx + r} ${f(cy + r * 0.12)}V${f(cy + r)}H${cx - r}Z" fill="${dark}" opacity=".28"/>` +
    groove(-0.32) + groove(-0.18) + groove(0.42) +
    (o.deco ?? '')
  const top = hair(cx - r * 0.75, cy - r * 0.05, cx - r * 0.7, cy - r * 0.65, cx - r * 0.15, cy - r * 0.85, r * 0.07, '#fff', 0.8)
  return sphere(k, cx, cy, r, fill, dark, { deco, top, gloss: 0.95 })
}

/** Pino de bowling parado con la base en (0,0) y la cabeza en y=−38. */
export const PIN =
  'M-4.4 0C-6.6 -4 -8 -9 -7.6 -13.4C-7.2 -18.4 -3.6 -22 -2.9 -26C-2.6 -28.2 -4.2 -30.2 -4.2 -32.8C-4.2 -36 -2.4 -38 0 -38C2.4 -38 4.2 -36 4.2 -32.8C4.2 -30.2 2.6 -28.2 2.9 -26C3.6 -22 7.2 -18.4 7.6 -13.4C8 -9 6.6 -4 4.4 0Z'

/** Pino entintado: blanco con las dos rayas rojas del cuello. `t` lo ubica (transform). */
export function pin(k: Kit, t: string, o: { crack?: boolean; stripe?: string } = {}) {
  const red = o.stripe ?? P.red
  return (
    `<g transform="${t}">` +
    k.draw([{
      d: PIN, fill: P.white,
      inner:
        `<path d="M-9 -27.8H9V-26.4H-9ZM-9 -25.4H9V-24H-9Z" fill="${red}"/>` +
        k.sh('M1 -40H9V1H1Z', 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) + k.sh('M-9 -6H9V1H-9Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
        hair(-5.4, -18, -6.4, -12, -4.6, -4, 0.8, '#fff') + `<ellipse cx="-1.6" cy="-35" rx="1.2" ry=".7" fill="#fff" transform="rotate(-40 -1.6 -35)"/>` +
        (o.crack ? `<path d="M2 -38L-.4 -33.6L1.6 -31L-.6 -27L.8 -23" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>` : ''),
    }], 0.6) +
    `</g>`
  )
}

/** Nube de polvo: un racimo de bollos con su sombra, en color tierra o blanco. */
export const puff = (k: Kit, x: number, y: number, r: number, fill: string = P.white, dark: string = P.sky2) => {
  const balls: [number, number, number][] = [[-0.55, 0.18, 0.5], [0.5, 0.22, 0.48], [-0.15, -0.3, 0.62], [0.42, -0.2, 0.44], [0.05, 0.3, 0.52]]
  return k.draw(balls.map(([dx, dy, rr]) => {
    const d = ellipse(f(x + dx * r), f(y + dy * r), f(rr * r), f(rr * r))
    return { d, fill, inner: k.sh(d, 0, 0, 1, 1, 0.05, 0.8, dark, 0.45) }
  }), f(Math.min(0.55, r * 0.08)))
}

/** Estallido de un golpe: puntas de estrella irregulares, dorado. */
export function burst(k: Kit, cx: number, cy: number, R: number, r: number, n = 9, rot = 0) {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, rr = i % 2 ? r : R * (i % 4 === 0 ? 1 : 0.78)
    d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a))
  }
  d += 'Z'
  return k.draw([{ d, fill: P.goldL, inner: k.shade(d, k.rad(P.gold, 0.5, 0.5, 0.5, 0.2, 1), P.goldD, 0.35) }], 0.55)
}

/** Líneas de velocidad (trazos afinados) detrás de algo que se mueve hacia `ang` grados. */
export function speed(x: number, y: number, ang: number, n: number, len: number, gap: number, c: string = P.mid, w = 0.9) {
  const a = (ang * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux
  let s = ''
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * gap, l = len * (i % 2 ? 0.7 : 1)
    const x0 = x + px * o, y0 = y + py * o, x1 = x0 - ux * l, y1 = y0 - uy * l
    s += hair(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, w, c, 0.75)
  }
  return s
}

/** Cinta con las puntas en cola de golondrina y un texto en cursiva sobre su curva. */
export function banner(k: Kit, cx: number, cy: number, w: number, fill: string, dark: string, text: string, tc: string, fs = 4.4) {
  const x0 = cx - w / 2, x1 = cx + w / 2
  const band = `M${x0} ${f(cy - 3.6)}Q${cx} ${f(cy + 0.4)} ${x1} ${f(cy - 3.6)}V${f(cy + 3.4)}Q${cx} ${f(cy + 7.4)} ${x0} ${f(cy + 3.4)}Z`
  const tail = (x: number, s: number) => `M${f(x - s * 2)} ${f(cy - 1.6)}L${f(x + s * 7)} ${f(cy - 1.2)}L${f(x + s * 4.4)} ${f(cy + 2.4)}L${f(x + s * 7)} ${f(cy + 6)}L${f(x - s * 2)} ${f(cy + 5.6)}Z`
  const rid = k.id('ban')
  return (
    k.draw([{ d: tail(x0, -1), fill: dark }, { d: tail(x1, 1), fill: dark }], 0.5) +
    k.draw([{ d: band, fill, inner: k.sh(band, 0, 0, 0, 1, 0, 0.6, dark, 0.35) + `<path d="M${x0} ${f(cy - 2.4)}Q${cx} ${f(cy + 1.6)} ${x1} ${f(cy - 2.4)}M${x0} ${f(cy + 2.2)}Q${cx} ${f(cy + 6.2)} ${x1} ${f(cy + 2.2)}" fill="none" stroke="${P.goldL}" stroke-width=".35"/>` }], 0.55) +
    `<path id="${rid}" d="M${x0} ${f(cy + 1.4)}Q${cx} ${f(cy + 5.2)} ${x1} ${f(cy + 1.4)}" fill="none"/>` +
    `<text ${GEORGIA} font-style="italic" font-weight="700" font-size="${fs}" fill="${tc}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`
  )
}

/** Volutas grabadas de oro (dos espirales enfrentadas) bajo una figura, centradas en (cx,cy). */
export function scrolls(cx: number, cy: number, w: number, c: string = P.goldD) {
  const s = (dir: number) => {
    const x = cx + dir * w
    return `<path d="M${cx} ${cy}C${f(cx + dir * w * 0.4)} ${f(cy + 3)} ${f(x - dir * 2)} ${f(cy + 3)} ${f(x)} ${f(cy)}C${f(x + dir * 1.6)} ${f(cy - 2.6)} ${f(x - dir * 1.6)} ${f(cy - 4)} ${f(x - dir * 2.6)} ${f(cy - 2)}C${f(x - dir * 3.2)} ${f(cy - .6)} ${f(x - dir * 1.8)} ${f(cy + .4)} ${f(x - dir * 1.2)} ${f(cy - .8)}" fill="none" stroke="${c}" stroke-width=".7" stroke-linecap="round"/>`
  }
  return s(-1) + s(1) + `<circle cx="${cx}" cy="${cy}" r=".9" fill="${c}"/>`
}
