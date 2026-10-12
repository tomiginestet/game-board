// Logo de Game Board: cuatro cuadraditos (uno por amigo) que se transforman en un momento del juego
// y vuelven a la grilla. El dorado aparece sólo para quien gana.
// Genera SVG animado con SMIL: anda igual inline, como <img> y como archivo suelto.
// Sin dependencias, para poder usarlo también desde scripts/build-logo.mjs.

export type LogoKind = 'secuencia' | 'podio' | 'tabla' | 'turnos' | 'medalla' | 'escalera' | 'duelo'

export const LOGO_COLORS = { a: '#ff6b35', b: '#4c8dff', c: '#22c55e', d: '#b98cff' }
const P = LOGO_COLORS
const GOLD = '#ffb400'
const DIM = '#2a3445'
const TILE = '#202938'
const INK = '#0d1117'
const EASE = '.6 0 .25 1'

type Val = number | string
type Track<T extends Val = Val> = T | T[]

const first = <T extends Val>(v: Track<T>): T => (Array.isArray(v) ? v[0] : v)

function anim(attr: string, vals: Track | undefined, kt: number[], dur: number): string {
  if (!Array.isArray(vals) || vals.every((v) => v === vals[0])) return ''
  if (vals.length !== kt.length) throw new Error(`${attr}: ${vals.length} valores para ${kt.length} tiempos`)
  return (
    `<animate attributeName="${attr}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" ` +
    `keyTimes="${kt.join(';')}" values="${vals.join(';')}" keySplines="${vals.slice(1).map(() => EASE).join(';')}"/>`
  )
}

interface RectSpec {
  x: Track<number>
  y: Track<number>
  w: Track<number>
  h?: Track<number>
  rx?: Track<number>
  fill: Track<string>
  op?: Track<number>
  kt?: number[]
}

function rect(o: RectSpec, kt: number[] | null, dur: number): string {
  const k = o.kt ?? kt ?? []
  const h = o.h ?? o.w
  const rx = o.rx ?? 6
  const op = o.op ?? 1
  const attrs =
    `x="${first(o.x)}" y="${first(o.y)}" width="${first(o.w)}" height="${first(h)}" rx="${first(rx)}" fill="${first(o.fill)}"` +
    (first(op) !== 1 ? ` opacity="${first(op)}"` : '')
  const kids = ([['x', o.x], ['y', o.y], ['width', o.w], ['height', h], ['rx', rx], ['fill', o.fill], ['opacity', op]] as const)
    .map(([a, v]) => anim(a, v, k, dur))
    .join('')
  return `<rect ${attrs}>${kids}</rect>`
}

function rotate(values: string[], kt: number[], dur: number): string {
  return (
    `<animateTransform attributeName="transform" type="rotate" dur="${dur}s" repeatCount="indefinite" calcMode="spline" ` +
    `keyTimes="${kt.join(';')}" values="${values.join(';')}" keySplines="${kt.slice(1).map(() => EASE).join(';')}"/>`
  )
}

function star(): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 4.6 : 11
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push(`${(32 + r * Math.cos(a)).toFixed(2)},${(32.5 + r * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

const rep = <T>(v: T, n: number): T[] => Array(n).fill(v)

interface Built {
  inner: string
  dur: number
  /** Fracción del ciclo que se muestra quieta si el sistema pide reducir movimiento. */
  still: number
}

function podio(): Built {
  const dur = 5
  const kt = [0, 0.1, 0.35, 0.75, 0.95, 1]
  return {
    dur,
    still: 0.6,
    inner: [
      rect({ x: [4, 4, 2, 2, 4, 4], y: [34, 34, 30, 30, 34, 34], w: [26, 26, 18, 18, 26, 26], h: [26, 26, 30, 30, 26, 26], fill: P.c }, kt, dur),
      rect({ x: [34, 34, 44, 44, 34, 34], y: [34, 34, 40, 40, 34, 34], w: [26, 26, 18, 18, 26, 26], h: [26, 26, 20, 20, 26, 26], fill: P.d }, kt, dur),
      rect({ x: [4, 4, 23, 23, 4, 4], y: [4, 4, 18, 18, 4, 4], w: [26, 26, 18, 18, 26, 26], h: [26, 26, 42, 42, 26, 26], fill: P.a }, kt, dur),
      rect(
        {
          kt: [0, 0.1, 0.3, 0.45, 0.52, 0.75, 0.95, 1],
          x: [34, 34, 41, 26, 26, 26, 34, 34],
          y: [4, 4, 8, 0, 5, 5, 4, 4],
          w: [26, 26, 12, 12, 12, 12, 26, 26],
          rx: [6, 6, 3.5, 3.5, 3.5, 3.5, 6, 6],
          fill: [P.b, P.b, GOLD, GOLD, GOLD, GOLD, P.b, P.b],
        },
        kt,
        dur,
      ),
    ].join(''),
  }
}

function tabla(): Built {
  const dur = 5.2
  const kt = [0, 0.1, 0.28, 0.42, 0.62, 0.8, 0.94, 1]
  const h = [26, 26, 11, 11, 11, 11, 26, 26]
  const rx = [6, 6, 3, 3, 3, 3, 6, 6]
  return {
    dur,
    still: 0.7,
    inner: [
      rect({ x: rep(4, 8), y: [4, 4, 4, 4, 19, 19, 4, 4], w: [26, 26, 52, 52, 52, 52, 26, 26], h, rx, fill: P.a }, kt, dur),
      rect({ x: [34, 34, 4, 4, 4, 4, 34, 34], y: [4, 4, 19, 19, 34, 34, 4, 4], w: [26, 26, 44, 44, 44, 44, 26, 26], h, rx, fill: P.b }, kt, dur),
      rect({ x: rep(4, 8), y: [34, 34, 34, 34, 49, 49, 34, 34], w: [26, 26, 36, 36, 36, 36, 26, 26], h, rx, fill: P.c }, kt, dur),
      rect(
        { x: [34, 34, 4, 4, 4, 4, 34, 34], y: [34, 34, 49, 49, 4, 4, 34, 34], w: [26, 26, 24, 24, 60, 60, 26, 26], h, rx, fill: [P.d, P.d, P.d, P.d, GOLD, GOLD, P.d, P.d] },
        kt,
        dur,
      ),
    ].join(''),
  }
}

function turnos(): Built {
  const dur = 3.6
  const end = [0.64, 0.7, 0.88, 0.96, 1]
  const sq = (bx: number, by: number, t: number, fill: string, winner = false) => {
    const big = (a: number, b: number) => (winner ? a : b)
    return rect(
      {
        kt: [0, t, t + 0.06, t + 0.14, ...end],
        x: [bx, bx, bx - 3, bx, bx, big(bx - 3, bx), big(bx - 3, bx), bx, bx],
        y: [by, by, by - 3, by, by, big(by - 3, by), big(by - 3, by), by, by],
        w: [22, 22, 28, 22, 22, big(28, 22), big(28, 22), 22, 22],
        rx: 5,
        fill: winner ? [fill, fill, fill, fill, fill, GOLD, GOLD, fill, fill] : fill,
        op: winner ? 1 : [1, 1, 1, 1, 1, 0.28, 0.28, 1, 1],
      },
      null,
      dur,
    )
  }
  return { dur, still: 0.78, inner: [sq(35, 7, 0.2, P.b), sq(35, 35, 0.34, P.d), sq(7, 35, 0.48, P.c), sq(7, 7, 0.06, P.a, true)].join('') }
}

const GOLDS = ['#ffb400', '#ffc53d', '#e6a200', '#ffcf5c']

function medalla(): Built {
  const dur = 5
  const kt = [0, 0.12, 0.32, 0.5, 0.72, 0.9, 1]
  const sq = (gx: number, gy: number, cx: number, cy: number, fill: string, g: string) =>
    rect(
      { x: [gx, gx, cx, cx, cx, gx, gx], y: [gy, gy, cy, cy, cy, gy, gy], w: [26, 26, 20, 20, 20, 26, 26], rx: [6, 6, 3, 3, 3, 6, 6], fill: [fill, fill, fill, g, g, fill, fill] },
      kt,
      dur,
    )
  const rot = rotate(['0 32 32', '0 32 32', '0 32 32', '45 32 32', '45 32 32', '0 32 32', '0 32 32'], kt, dur)
  return {
    dur,
    still: 0.6,
    inner:
      `<g>${rot}${sq(4, 4, 12, 12, P.a, GOLDS[0])}${sq(34, 4, 32, 12, P.b, GOLDS[1])}${sq(4, 34, 12, 32, P.c, GOLDS[2])}${sq(34, 34, 32, 32, P.d, GOLDS[3])}</g>` +
      `<polygon points="${star()}" fill="${INK}" opacity="0">${anim('opacity', [0, 0, 0, 1, 1, 0, 0], kt, dur)}</polygon>`,
  }
}

function escalera(): Built {
  const dur = 5.2
  const POS = [2, 18, 34, 50]
  const T = [0.08, 0.26, 0.44, 0.62]
  const cols = [P.d, P.c, P.b, P.a]
  let out = ''
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) out += `<rect x="${POS[c]}" y="${POS[r]}" width="12" height="12" rx="3" fill="${TILE}"/>`
  for (let c = 0; c < 4; c++)
    for (let r = 3 - c; r < 4; r++) {
      if (c === 3 && r === 0) continue // ahí termina la ficha
      const L = r === 3 - c ? T[c] + 0.07 : T[c] + 0.02
      out += rect({ x: POS[c], y: POS[r], w: 12, rx: 3, fill: cols[c], op: [0, 0, 1, 1, 0, 0] }, [0, L, L + 0.06, 0.84, 0.92, 1], dur)
    }
  const kt = [0, T[0]]
  const xs = [2, 2]
  const ys = [50, 50]
  for (let c = 0; c < 3; c++) {
    const s = T[c] + 0.05
    kt.push(s, (s + T[c + 1]) / 2, T[c + 1])
    xs.push(POS[c], (POS[c] + POS[c + 1]) / 2, POS[c + 1])
    ys.push(POS[3 - c], Math.max(0, POS[2 - c] - 6), POS[2 - c])
  }
  kt.push(0.84, 0.94, 1)
  xs.push(50, 2, 2)
  ys.push(2, 50, 50)
  out += rect({ x: xs, y: ys, w: 12, rx: 3, fill: GOLD }, kt.map((k) => +k.toFixed(4)), dur)
  return { dur, still: 0.8, inner: out }
}

function duelo(): Built {
  const dur = 4.4
  const kt = [0, 0.1, 0.28, 0.4, 0.5, 0.6, 0.8, 0.93, 1]
  const dot = (gx: number, gy: number, x: number, fill: string, win: boolean) =>
    rect(
      {
        x: [gx, gx, x, x, x, x, x, gx, gx],
        y: [gy, gy, 50, 50, 50, 50, 50, gy, gy],
        w: [26, 26, 10, 10, 10, 10, 10, 26, 26],
        rx: [6, 6, 3, 3, 3, 3, 3, 6, 6],
        fill: [fill, fill, DIM, DIM, DIM, win ? GOLD : DIM, win ? GOLD : DIM, fill, fill],
      },
      kt,
      dur,
    )
  return {
    dur,
    still: 0.7,
    inner: [
      dot(4, 34, 11, P.c, true),
      dot(34, 34, 43, P.d, false),
      rect({ x: [34, 34, 36, 32, 40, 40, 40, 34, 34], y: [4, 4, 18, 18, 24, 24, 24, 4, 4], w: [26, 26, 24, 24, 18, 18, 18, 26, 26], op: [1, 1, 1, 1, 0.45, 0.45, 0.45, 1, 1], fill: P.b }, kt, dur),
      rect({ x: [4, 4, 4, 8, 2, 2, 2, 4, 4], y: [4, 4, 18, 18, 12, 12, 12, 4, 4], w: [26, 26, 24, 24, 30, 30, 30, 26, 26], fill: P.a }, kt, dur),
    ].join(''),
  }
}

// ---- Secuencia: todas encadenadas sobre las mismas cuatro piezas, volviendo a la grilla entre una y otra ----

interface Piece {
  x: number
  y: number
  w: number
  h?: number
  rx?: number
  fill: string
  op?: number
}
type Pieces = Record<'A' | 'B' | 'C' | 'D', Piece>
interface Frame extends Pieces {
  rot: number
  star: number
}
type Over = { [K in keyof Pieces]?: Partial<Piece> } & { rot?: number; star?: number }

const KEYS = ['A', 'B', 'C', 'D'] as const
const GRID: Frame = {
  A: { x: 4, y: 4, w: 26, fill: P.a },
  B: { x: 34, y: 4, w: 26, fill: P.b },
  C: { x: 4, y: 34, w: 26, fill: P.c },
  D: { x: 34, y: 34, w: 26, fill: P.d },
  rot: 0,
  star: 0,
}

function secuencia(): Built {
  const frames: { d: number; s: Frame }[] = [{ d: 0, s: GRID }]
  let cur = GRID
  let t = 0
  const push = (d: number, s: Frame) => {
    cur = s
    t += d
    frames.push({ d, s })
  }
  const go = (d: number, over: Over) => {
    const s = { ...cur, rot: over.rot ?? cur.rot, star: over.star ?? cur.star }
    for (const k of KEYS) s[k] = { ...cur[k], ...over[k] }
    push(d, s)
  }
  const hold = (d: number) => go(d, {})
  const home = (d: number) => push(d, GRID)

  // Turnos: una ola que recorre la mesa.
  hold(0.3)
  const up = (k: keyof Pieces) => ({ x: GRID[k].x - 2, y: GRID[k].y - 2, w: 30 })
  const down = (k: keyof Pieces) => ({ x: GRID[k].x, y: GRID[k].y, w: 26 })
  go(0.2, { A: up('A') })
  go(0.2, { A: down('A'), B: up('B') })
  go(0.2, { B: down('B'), D: up('D') })
  go(0.2, { D: down('D'), C: up('C') })
  go(0.2, { C: down('C') })
  hold(0.25)
  // Podio
  go(0.7, { A: { x: 23, y: 18, w: 18, h: 42 }, B: { x: 41, y: 8, w: 12, rx: 3.5, fill: GOLD }, C: { x: 2, y: 30, w: 18, h: 30 }, D: { x: 44, y: 40, w: 18, h: 20 } })
  go(0.3, { B: { x: 26, y: 0 } })
  go(0.18, { B: { y: 5 } })
  hold(0.9)
  home(0.7)
  hold(0.3)
  // Tabla
  go(0.7, { A: { x: 4, y: 4, w: 52, h: 11, rx: 3 }, B: { x: 4, y: 19, w: 44, h: 11, rx: 3 }, C: { x: 4, y: 34, w: 36, h: 11, rx: 3 }, D: { x: 4, y: 49, w: 24, h: 11, rx: 3 } })
  hold(0.4)
  go(0.9, { D: { y: 4, w: 60, fill: GOLD }, A: { y: 19 }, B: { y: 34 }, C: { y: 49 } })
  hold(0.8)
  home(0.7)
  hold(0.3)
  // Duelo
  go(0.7, { A: { x: 4, y: 18, w: 24 }, B: { x: 36, y: 18, w: 24 }, C: { x: 11, y: 50, w: 10, rx: 3, fill: DIM }, D: { x: 43, y: 50, w: 10, rx: 3, fill: DIM } })
  go(0.4, { A: { x: 8 }, B: { x: 32 } })
  go(0.35, { A: { x: 2, y: 12, w: 30 }, B: { x: 40, y: 24, w: 18, op: 0.45 } })
  go(0.3, { C: { fill: GOLD } })
  hold(0.8)
  home(0.6)
  hold(0.3)
  // Escalera: tres escalones y una ficha que los sube.
  go(0.7, { C: { x: 2, y: 48, w: 18, h: 12, rx: 4 }, D: { x: 23, y: 34, w: 18, h: 26, rx: 4 }, B: { x: 44, y: 20, w: 18, h: 40, rx: 4 }, A: { x: 5, y: 36, w: 12, rx: 3.5 } })
  hold(0.15)
  go(0.2, { A: { x: 15.5, y: 16 } })
  go(0.2, { A: { x: 26, y: 22 } })
  go(0.2, { A: { x: 36.5, y: 2 } })
  go(0.2, { A: { x: 47, y: 8, fill: GOLD } })
  hold(0.8)
  home(0.7)
  hold(0.3)
  // Medalla
  go(0.6, { A: { x: 12, y: 12, w: 20, rx: 3 }, B: { x: 32, y: 12, w: 20, rx: 3 }, C: { x: 12, y: 32, w: 20, rx: 3 }, D: { x: 32, y: 32, w: 20, rx: 3 } })
  go(0.6, { rot: 45, star: 1, A: { fill: GOLDS[0] }, B: { fill: GOLDS[1] }, C: { fill: GOLDS[2] }, D: { fill: GOLDS[3] } })
  hold(1)
  home(0.7)

  const dur = +t.toFixed(3)
  let acc = 0
  const kt = frames.map((f) => {
    acc += f.d
    return +(acc / dur).toFixed(4)
  })
  kt[kt.length - 1] = 1
  const col = <T extends Val>(fn: (s: Frame) => T) => frames.map((f) => fn(f.s))
  const rects = KEYS.map((k) =>
    rect(
      {
        x: col((s) => s[k].x),
        y: col((s) => s[k].y),
        w: col((s) => s[k].w),
        h: col((s) => s[k].h ?? s[k].w),
        rx: col((s) => s[k].rx ?? 6),
        fill: col((s) => s[k].fill),
        op: col((s) => s[k].op ?? 1),
      },
      kt,
      dur,
    ),
  ).join('')
  const rot = rotate(col((s) => `${s.rot} 32 32`), kt, dur)
  return {
    dur,
    still: 0,
    inner: `<g>${rot}${rects}</g><polygon points="${star()}" fill="${INK}" opacity="0">${anim('opacity', col((s) => s.star), kt, dur)}</polygon>`,
  }
}

const BUILDERS: Record<LogoKind, () => Built> = { secuencia, podio, tabla, turnos, medalla, escalera, duelo }
const cache = new Map<LogoKind, Built>()

/** El contenido animado de cada logo (dentro de un viewBox de 64×64). */
export function logoAnimation(kind: LogoKind): Built {
  let b = cache.get(kind)
  if (!b) cache.set(kind, (b = BUILDERS[kind]()))
  return b
}

/** Los cuatro cuadraditos quietos: el logo en reposo. */
export const LOGO_STATIC = KEYS.map((k) => rect(GRID[k], null, 0)).join('')

/** SVG completo, listo para guardar como archivo. Con `bg` lleva el fondo del ícono de la app. */
export function logoSvg(kind: LogoKind | 'quieto', opts: { bg?: boolean; title?: string } = {}): string {
  const inner = kind === 'quieto' ? LOGO_STATIC : logoAnimation(kind).inner
  const vb = opts.bg ? '-10 -10 84 84' : '0 0 64 64'
  const back = opts.bg ? `<rect x="-10" y="-10" width="84" height="84" rx="19" fill="${INK}"/>` : ''
  const title = opts.title ? `<title>${opts.title}</title>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img">${title}${back}${inner}</svg>\n`
}

/** Qué animación de carga corresponde a cada pantalla, según de qué se trata. */
export function loaderForPath(path: string): LogoKind {
  if (/^\/(partido|ping-pong\/nuevo)/.test(path)) return 'duelo'
  if (/^\/(torneos|ping-pong\/torneo)/.test(path)) return 'podio'
  if (/^\/(jugar|partida)\//.test(path)) return 'turnos'
  if (path.startsWith('/ranking')) return 'tabla'
  if (path.startsWith('/jugadores')) return 'escalera'
  if (path.startsWith('/juegos')) return 'medalla'
  return 'secuencia'
}
