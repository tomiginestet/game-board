// Piezas del básquet compartidas por básquet, 3x3 y tiros libres (no exporta ilustraciones): la pelota naranja con
// sus cuatro costuras, el aro anaranjado partido en dos mitades (para que la pelota pase adentro), la red de rombos,
// el tablero blanco con su cuadrado y el piso de parquet en perspectiva.
import { f } from '../helpers'
import { ellipse, hair, P, roundRect, type Kit } from '../kit'

export const GEORGIA = 'font-family="Georgia, serif"'
/** Naranja de la pelota (apagado, de estampa), su sombra y su luz. */
export const NAR = '#D9803F', NAR_D = '#A4532A', NAR_L = '#F4B57C'
/** Hierro pintado del aro. */
export const RIM = '#D65A32', RIM_D = '#8E3219'
/** Madera del parquet. */
export const WOOD = '#E6BC84', WOOD_D = '#B98450', WOOD_L = '#F6DDB6'

/** Pelota de básquet en (x,y) de radio r, con las costuras giradas `rot` grados. `over` va encima, recortado a ella. */
export function bball(k: Kit, x: number, y: number, r: number, o: { rot?: number; over?: string; c?: string; cd?: string } = {}) {
  const d = ellipse(x, y, r, r), rot = o.rot ?? -24
  const sw = f(Math.max(0.42, r * 0.08))
  const a = f(r * 0.74), b = f(r * 0.68), q = f(r * 0.16), v = f(r * 0.22)
  const seams =
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    `<path d="M0 ${-r}Q${v} 0 0 ${r}M${-r} 0Q0 ${f(r * 0.2)} ${r} 0M${-a} ${-b}Q${-q} 0 ${-a} ${b}M${a} ${-b}Q${f(r * 0.3)} 0 ${a} ${b}" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `</g>`
  return (
    k.draw([{
      d, fill: o.c ?? NAR,
      inner:
        k.sh(d, 0, 0, 1, 1, 0, 0.95, o.cd ?? NAR_D, 0.5) +
        `<path d="${d}" fill="${k.rad('#ffffff', 0.32, 0.28, 0.5, 0.5, 0)}"/>` +
        seams + (o.over ?? ''),
    }], f(Math.min(0.85, 0.3 + r * 0.035))) +
    `<ellipse cx="${f(x - r * 0.45)}" cy="${f(y - r * 0.45)}" rx="${f(r * 0.2)}" ry="${f(r * 0.1)}" fill="#fff" opacity=".85" transform="rotate(-42 ${f(x - r * 0.45)} ${f(y - r * 0.45)})"/>`
  )
}

/** Alto aparente del aro (elipse) para un ancho rx. */
export const rimRy = (rx: number, tilt = 0.28) => f(rx * tilt)

/** Mitad de atrás del aro (va antes de la pelota y de la red). */
export function rimBack(cx: number, cy: number, rx: number, tilt = 0.28) {
  const ry = rimRy(rx, tilt), d = `M${f(cx - rx)} ${cy}A${rx} ${ry} 0 0 1 ${f(cx + rx)} ${cy}`
  return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.6"/><path d="${d}" fill="none" stroke="${RIM_D}" stroke-width="1.3"/>`
}

/** Mitad de adelante del aro (va encima de la pelota y de la red). */
export function rimFront(cx: number, cy: number, rx: number, tilt = 0.28) {
  const ry = rimRy(rx, tilt), d = `M${f(cx - rx)} ${cy}A${rx} ${ry} 0 0 0 ${f(cx + rx)} ${cy}`
  return (
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.9" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${RIM}" stroke-width="1.5" stroke-linecap="round"/>` +
    `<path d="M${f(cx - rx * 0.86)} ${f(cy + ry * 0.35)}A${rx} ${ry} 0 0 0 ${f(cx - rx * 0.1)} ${f(cy + ry * 0.98)}" fill="none" stroke="#fff" stroke-width=".45" stroke-linecap="round" opacity=".8" transform="translate(0 -.4)"/>`
  )
}

/** Red de rombos colgada del aro: `back` (los hilos de atrás, antes de la pelota) y `front`. `flare` abre la boca de abajo. */
export function hoopNet(cx: number, cy: number, rx: number, h: number, o: { tilt?: number; bottom?: number; flare?: number; levels?: number; n?: number; color?: string; sway?: number; dash?: boolean; w?: number } = {}) {
  const ry = rx * (o.tilt ?? 0.28), N = o.n ?? 14, L = o.levels ?? 4, bot = (o.bottom ?? 0.58) + (o.flare ?? 0), sway = o.sway ?? 0
  const pt = (l: number, i: number) => {
    const t = l / L, a = ((i + l * 0.5) / N) * Math.PI * 2
    const r = rx * (1 - (1 - bot) * Math.pow(t, 0.75)) * (o.flare ? 1 + Math.sin(t * Math.PI) * o.flare * 0.3 : 1)
    return { x: cx + Math.cos(a) * r + sway * t * t, y: cy + Math.sin(a) * ry * (1 - t * 0.35) + h * t, front: Math.sin(a) > -0.05 }
  }
  let back = '', front = ''
  for (let l = 0; l < L; l++)
    for (let i = 0; i < N; i++) {
      const p = pt(l, i)
      for (const j of [i, i + 1]) {
        const q = pt(l + 1, j - 1)
        const seg = `M${f(p.x)} ${f(p.y)}L${f(q.x)} ${f(q.y)}`
        if (p.front && q.front) front += seg
        else back += seg
      }
    }
  const c = o.color ?? P.white, w = o.w ?? 1
  if (o.dash)
    return {
      back: `<path d="${back}" fill="none" stroke="${P.blue}" stroke-width=".45" stroke-dasharray=".9 1.1" stroke-linecap="round" opacity=".7"/>`,
      front: `<path d="${front}" fill="none" stroke="${P.mid}" stroke-width=".6" stroke-dasharray="1 1.1" stroke-linecap="round"/>`,
    }
  return {
    back: `<path d="${back}" fill="none" stroke="${P.blue}" stroke-width=".55" stroke-linecap="round" opacity=".8"/>`,
    front: `<path d="${front}" fill="none" stroke="${P.ink}" stroke-width="${f(1.15 * w)}" stroke-linecap="round"/><path d="${front}" fill="none" stroke="${c}" stroke-width="${f(0.55 * w)}" stroke-linecap="round"/>`,
  }
}

/** Tablero de vidrio blanco de (x0,y0) a (x1,y1), con el cuadrado arriba del aro. `inner` va recortado a él. */
export function backboard(k: Kit, x0: number, y0: number, x1: number, y1: number, o: { fill?: string; square?: string; inner?: string; r?: number } = {}) {
  const d = roundRect(x0, y0, x1, y1, o.r ?? 1.6), cx = (x0 + x1) / 2, w = (x1 - x0) * 0.36, h = (y1 - y0) * 0.42
  const sq = `M${f(cx - w / 2)} ${f(y1 - 2.4)}V${f(y1 - 2.4 - h)}H${f(cx + w / 2)}V${f(y1 - 2.4)}`
  return k.draw([{
    d, fill: o.fill ?? P.white,
    inner:
      k.sh(d, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) +
      `<path d="M${x0} ${y0}H${f(x0 + (x1 - x0) * 0.4)}L${f(x0 + (x1 - x0) * 0.2)} ${y1}H${x0}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` +
      `<path d="${roundRect(x0 + 1.4, y0 + 1.4, x1 - 1.4, y1 - 1.4, 0.8)}" fill="none" stroke="${o.square ?? P.red}" stroke-width=".9"/>` +
      `<path d="${sq}" fill="none" stroke="${o.square ?? P.red}" stroke-width=".9"/>` +
      (o.inner ?? ''),
  }], 0.7)
}

/** Piso de parquet en perspectiva desde el horizonte y0, con la fuga en (vx, y0 - fuga). `inner` va recortado al piso. */
export function parquet(k: Kit, y0: number, o: { vx?: number; inner?: string; step?: number } = {}) {
  const d = `M-10 ${y0}H130V140H-10Z`, vx = o.vx ?? 60, step = o.step ?? 8
  let planks = ''
  for (let x = -70; x <= 190; x += step) planks += `M${f(vx + (x - vx) * 0.32)} ${y0}L${x} 140`
  let rows = ''
  for (let i = 1; i < 9; i++) {
    const y = y0 + Math.pow(i / 8, 1.6) * (140 - y0)
    rows += `M-10 ${f(y)}H130`
  }
  return k.draw([{
    d, fill: WOOD,
    inner:
      k.sh(d, 0, 0, 0, 1, 0.55, 0, WOOD_D, 0.4) +
      `<path d="${planks}" stroke="${WOOD_D}" stroke-width=".35" opacity=".8"/>` +
      `<path d="${rows}" stroke="${WOOD_D}" stroke-width=".25" stroke-dasharray="7 9" opacity=".6"/>` +
      `<path d="M-10 ${y0}H130V${y0 + 14}H-10Z" fill="${k.lin(WOOD_L, 0, 0, 0, 1, 0.8, 0)}"/>` +
      (o.inner ?? ''),
  }], 0.6)
}

/** Rayas de movimiento: trazos finos en abanico detrás de algo que vuela hacia (x,y) desde el ángulo `a` (grados). */
export function swoosh(x: number, y: number, a: number, r: number, c = P.mid, n = 3) {
  const rad = (a * Math.PI) / 180, ux = Math.cos(rad), uy = Math.sin(rad), px = -uy, py = ux
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * r * 0.55, l = r * (1.3 - Math.abs(i - (n - 1) / 2) * 0.3)
    const x0 = x + ux * r * 1.15 + px * o, y0 = y + uy * r * 1.15 + py * o
    const x1 = x0 + ux * l, y1 = y0 + uy * l
    return hair(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, 0.9 - Math.abs(i - (n - 1) / 2) * 0.2, c)
  }).join('')
}
