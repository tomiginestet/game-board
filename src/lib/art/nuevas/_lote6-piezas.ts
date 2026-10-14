// Piezas compartidas por las medallas de bádminton, pickleball, hockey y golf: la pluma suelta (del volante y del
// dink que baja "como una pluma"), las notas musicales, las volutas de fileteado del oro, los aros entintados
// (marcos de raqueta, aros de frasco) y el rótulo en cursiva.
import { f } from '../helpers'
import { hair, P, type Kit } from '../kit'

export const GEORGIA = 'font-family="Georgia, serif"'

/** Rótulo en cursiva Georgia con un filo de papel para que se lea sobre cualquier fondo. */
export const rotulo = (x: number, y: number, size: number, txt: string, o: { rot?: number; c?: string; halo?: string } = {}) =>
  `<g transform="translate(${x} ${y}) rotate(${o.rot ?? 0})">` +
  `<text ${GEORGIA} font-style="italic" font-weight="700" font-size="${size}" text-anchor="middle" fill="none" stroke="${o.halo ?? P.paper}" stroke-width="${f(size * 0.32)}" stroke-linejoin="round">${txt}</text>` +
  `<text ${GEORGIA} font-style="italic" font-weight="700" font-size="${size}" text-anchor="middle" fill="${o.c ?? P.ink}">${txt}</text></g>`

/** Volutas de fileteado: la espiral entintada, dorada y con el brillo blanco. */
export function voluta(d: string, c = P.gold) {
  return (
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.3" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#fff" stroke-width=".35" stroke-linecap="round" transform="translate(-.3 -.35)" opacity=".85"/>`
  )
}

/** Par de volutas en espejo a los lados de (cx,y), para los oros. */
export const volutas = (cx: number, y: number, dx: number, s = 0.6, c = P.gold) =>
  [-1, 1].map((sx) => `<g transform="translate(${f(cx + sx * dx)} ${y}) scale(${f(sx * s)} ${s})">` +
    voluta('M-8 3C-8 -2 -3 -4 1 -2.4C4.4 -1 4 3.4 1.2 3.8C-1 4.1 -1.6 2 -.2 1.2', c) + voluta('M-8 3C-11 3.6 -13.4 2.6 -14.6 .4', c) + `</g>`).join('')

/** Corchea (o dos unidas) de tinta con el brillo, con la base de la cabeza en (x,y). */
export function nota(x: number, y: number, s = 1, rot = 0, doble = false, c = P.ink) {
  const head = (dx: number) => `<ellipse cx="${dx}" cy="0" rx="2.3" ry="1.6" transform="rotate(-24 ${dx} 0)" fill="${c}"/>`
  const stems = doble
    ? head(0) + head(7) + `<path d="M2 -.6V-11M9 -.6V-12.6" stroke="${c}" stroke-width=".9"/><path d="M1.6 -11.6L9.4 -13.2V-10.6L1.6 -9Z" fill="${c}"/>`
    : head(0) + `<path d="M2 -.6V-12" stroke="${c}" stroke-width=".9"/><path d="M2 -12.4C2.6 -9.6 6.4 -9 5.8 -5.2C7.8 -8.4 4.4 -10 2.6 -12.4Z" fill="${c}"/>`
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    `<g transform="translate(.5 .6)" opacity=".3">${stems.replaceAll(c, P.blue)}</g>` + stems +
    `<ellipse cx="-.8" cy="-.5" rx=".7" ry=".35" fill="#fff" opacity=".8" transform="rotate(-24 -.8 -.5)"/></g>`
}

/** Aro entintado (un path con agujero, fill-rule evenodd): contorno por fuera, relleno y su sombreado recortado. */
export function aro(k: Kit, d: string, fill: string, inner = '', w = 0.6) {
  const c = k.id('ar')
  return (
    `<path d="${d}" fill-rule="evenodd" fill="${P.ink}" transform="translate(${f(w * 0.7)} ${f(w * 0.85)})"/>` +
    `<path d="${d}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="${f(w * 2)}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill-rule="evenodd" fill="${fill}"/>` +
    (inner ? `<clipPath id="${c}"><path d="${d}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${c})">${inner}</g>` : '')
  )
}

/** Pluma suelta con el cañón en (0,0) y la punta hacia arriba (largo L, medio ancho w): vexilo, raquis y barbas. */
export const PLUMA = (L: number, w: number) =>
  `M0 0C${f(w * 0.9)} ${f(-L * 0.2)} ${f(w * 1.15)} ${f(-L * 0.7)} ${f(w * 0.35)} ${f(-L)}Q0 ${f(-L * 1.05)} ${f(-w * 0.35)} ${f(-L)}C${f(-w * 1.1)} ${f(-L * 0.72)} ${f(-w * 0.9)} ${f(-L * 0.22)} 0 0Z`
export function pluma(k: Kit, x: number, y: number, rot: number, L = 14, w = 3.4, o: { fill?: string; shade?: string; s?: number } = {}) {
  const d = PLUMA(L, w), sc = o.s ?? 1
  const barbs = [0.3, 0.45, 0.6, 0.75].map((t) =>
    hair(0, -L * t, w * 0.5, -L * (t + 0.04), w * 0.85, -L * (t + 0.12), 0.35, o.shade ?? P.sky2) +
    hair(0, -L * (t - 0.06), -w * 0.5, -L * (t - 0.02), -w * 0.85, -L * (t + 0.06), 0.35, o.shade ?? P.sky2)).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">` +
    k.draw([{ d, fill: o.fill ?? P.white, inner: k.sh(d, 0, 0, 1, 0, 0, 0.75, o.shade ?? P.blue, 0.4) + barbs }], f(0.45 / sc)) +
    `<path d="M0 ${f(L * 0.12)}Q${f(w * 0.12)} ${f(-L * 0.5)} 0 ${f(-L * 0.96)}" fill="none" stroke="${P.ink}" stroke-width="${f(0.45 / sc)}" stroke-linecap="round"/>` +
    `<path d="M-${f(w * 0.12)} ${f(-L * 0.15)}V${f(-L * 0.5)}" stroke="#fff" stroke-width=".4" opacity=".8"/>` +
    `</g>`
  )
}

/** Líneas de velocidad (trazos afinados) paralelas, detrás de algo que va en la dirección (dx,dy). */
export function estela(x: number, y: number, dx: number, dy: number, n = 4, len = 16, gap = 3.2, c = P.ink, w = 0.8) {
  const l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, px = -uy, py = ux
  let out = ''
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * gap, L = len * (1 - Math.abs(i - (n - 1) / 2) * 0.22)
    const x0 = x + px * o - ux * 2, y0 = y + py * o - uy * 2, x1 = x0 - ux * L, y1 = y0 - uy * L
    out += hair(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, w, c)
  }
  return out
}
