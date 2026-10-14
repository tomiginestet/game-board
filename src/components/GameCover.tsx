import { useId, useState, type ReactNode } from 'react'
import type { Category, GameDef } from '../lib/games/schema'

// Carátula de un juego, estilo "caja" de tienda de videojuegos.
//
// No usamos las cajas reales (tienen derechos), así que la dibujamos: un
// degradé intenso a partir del color del juego, un motivo según la categoría
// (losetas, cartas, dados, confeti...), una variación propia de cada juego
// (sale de un hash del id, así siempre se ve igual), el emoji como
// protagonista y el nombre abajo. Si la ficha trae `cover` (una imagen), se
// muestra esa y, si no carga, la dibujada.

type CoverGame = Pick<GameDef, 'id' | 'name' | 'emoji' | 'color' | 'category'> & { cover?: string }

export interface GameCoverProps {
  game: CoverGame
  /** `portrait`: caja 3:4 (estantes y catálogo). `landscape`: banner 16:9 (carrusel y ficha). */
  aspect?: 'portrait' | 'landscape'
  /** Mostrar el nombre sobre la carátula (por defecto, sí). */
  showTitle?: boolean
  className?: string
  /** Si es decorativa (el nombre ya está al lado), se oculta a los lectores de pantalla. */
  decorative?: boolean
}

export function GameCover({ game, aspect = 'portrait', showTitle = true, className, decorative }: GameCoverProps) {
  const [failed, setFailed] = useState<string | undefined>()
  const img = game.cover && /^(https?:|data:image\/)/.test(game.cover) && failed !== game.cover ? game.cover : undefined
  const cls = ['gcover', `gcover-${aspect}`, showTitle ? '' : 'no-title', img ? 'has-img' : '', className ?? ''].filter(Boolean).join(' ')
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': `Carátula de ${game.name}` }

  return (
    <div className={cls} {...a11y}>
      {img ? (
        <>
          <img src={img} alt="" loading="lazy" decoding="async" onError={() => setFailed(img)} />
          {showTitle && <CoverTitle name={game.name} />}
        </>
      ) : (
        <GeneratedArt game={game} aspect={aspect} showTitle={showTitle} />
      )}
    </div>
  )
}

function CoverTitle({ name }: { name: string }) {
  // Tamaño según el largo total y la palabra más larga, para que ninguna palabra se corte a la mitad.
  const longest = Math.max(1, ...name.split(/\s+/).map((w) => w.length))
  const cap = name.length > 22 ? 9 : name.length > 14 ? 10.5 : name.length > 8 ? 12.5 : 15
  const ts = Math.max(6.5, Math.min(cap, 94 / longest))
  return (
    <span className={'gcover-title' + (name.length > 22 ? ' long' : '')} aria-hidden style={{ ['--ts' as string]: `${ts.toFixed(1)}cqi` }}>
      {name}
    </span>
  )
}

function GeneratedArt({ game, aspect, showTitle }: { game: CoverGame; aspect: 'portrait' | 'landscape'; showTitle: boolean }) {
  const uid = 'gc' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const W = aspect === 'portrait' ? 300 : 640
  const H = aspect === 'portrait' ? 400 : 360
  const seed = hash(game.id || game.name)
  const rnd = rng(seed)
  const pal = palette(game.color, seed)
  // Centro del emoji (en % del ancho/alto): en el banner va a la derecha para dejar lugar al texto.
  const cx = aspect === 'portrait' ? W * 0.5 : W * 0.72
  const cy = aspect === 'portrait' ? H * 0.42 : H * 0.44
  const tilt = (rnd() - 0.5) * 24

  return (
    <>
      <svg className="gcover-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2={0.25 + rnd() * 0.5} y2="1">
            <stop offset="0" stopColor={pal.top} />
            <stop offset="0.55" stopColor={pal.mid} />
            <stop offset="1" stopColor={pal.deep} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx={cx / W} cy={cy / H} r={aspect === 'portrait' ? 0.55 : 0.42} gradientTransform={aspect === 'portrait' ? undefined : `translate(${cx / W} ${cy / H}) scale(${H / W} 1) translate(${-cx / W} ${-cy / H})`}>
            <stop offset="0" stopColor={pal.glow} stopOpacity="0.75" />
            <stop offset="0.45" stopColor={pal.glow} stopOpacity="0.18" />
            <stop offset="1" stopColor={pal.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-scrim`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070c" stopOpacity="0" />
            <stop offset="1" stopColor="#05070c" stopOpacity={showTitle ? 0.92 : 0.55} />
          </linearGradient>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.5" />
          </linearGradient>
          <mask id={`${uid}-mask`}>
            <rect width={W} height={H} fill={`url(#${uid}-fade)`} />
          </mask>
        </defs>

        <rect width={W} height={H} fill={`url(#${uid}-bg)`} />
        <g mask={`url(#${uid}-mask)`}>{game.category === 'deporte' ? sportMotif(game.id, { W, H, cx, cy, rnd, pal, tilt }) : motif(game.category, { W, H, cx, cy, rnd, pal, tilt })}</g>
        <rect width={W} height={H} fill={`url(#${uid}-glow)`} />
        <path d={`M0 0H${W * 0.62}L0 ${H * 0.7}Z`} fill={`url(#${uid}-shine)`} />
        <rect y={H * (showTitle ? 0.5 : 0.62)} width={W} height={H * (showTitle ? 0.5 : 0.38)} fill={`url(#${uid}-scrim)`} />
        <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="#fff" strokeOpacity="0.12" />
      </svg>
      <span className="gcover-emoji" aria-hidden style={{ left: `${(cx / W) * 100}%`, top: `${(cy / H) * 100}%`, ['--tilt' as string]: `${tilt * 0.35}deg`, ['--glow' as string]: pal.glow }}>
        {game.emoji}
      </span>
      {showTitle && <CoverTitle name={game.name} />}
    </>
  )
}

/* ---------- Motivos por categoría ---------- */

interface MotifCtx {
  W: number
  H: number
  cx: number
  cy: number
  rnd: () => number
  pal: Palette
  tilt: number
}

function motif(category: Category, c: MotifCtx): ReactNode {
  switch (category) {
    case 'mesa':
      return hexTiles(c)
    case 'cartas':
      return fannedCards(c)
    case 'tcg':
      return tradingCards(c)
    case 'dados':
      return dice(c)
    case 'fiesta':
      return confetti(c)
    case 'cooperativo':
      return rings(c)
    case 'clasico':
      return checkerboard(c)
    case 'deporte':
      return court(c)
    case 'video':
      return pixels(c)
    default:
      return hexTiles(c)
  }
}

const f = (n: number) => Math.round(n * 10) / 10

/** Mesa: losetas hexagonales, algunas pintadas, como un tablero. */
function hexTiles({ W, H, rnd, pal, tilt }: MotifCtx) {
  const r = 34 + rnd() * 10
  const w = Math.sqrt(3) * r
  const out: ReactNode[] = []
  const hex = (x: number, y: number) =>
    Array.from({ length: 6 }, (_, k) => {
      const a = (Math.PI / 3) * k + Math.PI / 6
      return `${f(x + (r - 3) * Math.cos(a))},${f(y + (r - 3) * Math.sin(a))}`
    }).join(' ')
  let i = 0
  for (let row = -2; row * r * 1.5 < H + 2 * r; row++) {
    for (let col = -2; col * w < W + 2 * w; col++) {
      const x = col * w + (row % 2 ? w / 2 : 0)
      const y = row * r * 1.5
      const v = rnd()
      out.push(
        <polygon
          key={i++}
          points={hex(x, y)}
          fill={v > 0.82 ? pal.accent : v > 0.62 ? '#fff' : 'none'}
          fillOpacity={v > 0.82 ? 0.38 : v > 0.62 ? 0.07 : 0}
          stroke="#fff"
          strokeOpacity="0.2"
          strokeWidth="2"
        />,
      )
    }
  }
  return <g transform={`rotate(${f(tilt * 0.4)} ${W / 2} ${H / 2})`}>{out}</g>
}

/** Cartas: un abanico de naipes detrás del emoji. */
function fannedCards({ W, H, cx, cy, rnd, pal }: MotifCtx) {
  const n = 5
  const cw = Math.min(W, H) * 0.34
  const ch = cw * 1.42
  const spread = 16 + rnd() * 8
  const suits = ['♠', '♥', '♦', '♣']
  const s0 = Math.floor(rnd() * 4)
  const px = cx
  const py = cy + ch * 0.95
  return (
    <g>
      {Array.from({ length: n }, (_, k) => {
        const a = (k - (n - 1) / 2) * spread
        const red = (s0 + k) % 4 === 1 || (s0 + k) % 4 === 2
        return (
          <g key={k} transform={`rotate(${f(a)} ${f(px)} ${f(py)})`}>
            <rect x={f(px - cw / 2)} y={f(py - ch * 1.45)} width={f(cw)} height={f(ch)} rx={f(cw * 0.1)} fill="#fff" fillOpacity={k === 2 ? 0.2 : 0.11} stroke="#fff" strokeOpacity="0.45" strokeWidth="2" />
            <text x={f(px - cw / 2 + cw * 0.16)} y={f(py - ch * 1.45 + cw * 0.3)} fontSize={f(cw * 0.22)} fill={red ? pal.accent : '#fff'} fillOpacity="0.8" textAnchor="middle">
              {suits[(s0 + k) % 4]}
            </text>
          </g>
        )
      })}
      {Array.from({ length: 7 }, (_, k) => (
        <text key={'s' + k} x={f(rnd() * W)} y={f(rnd() * H * 0.9)} fontSize={f(18 + rnd() * 26)} fill="#fff" fillOpacity="0.1" transform={`rotate(${f((rnd() - 0.5) * 60)})`} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {suits[k % 4]}
        </text>
      ))}
    </g>
  )
}

/** Cartas coleccionables: cartas con marco (ilustración, caja de texto y costo) y brillitos de holo. */
function tradingCards({ W, H, cx, cy, rnd, pal }: MotifCtx) {
  const cw = Math.min(W, H) * 0.36
  const ch = cw * 1.4
  const spots = W > H
    ? [[cx - 210, cy + 10, -14], [cx + 210, cy - 10, 12], [cx - 95, cy + 70, -6], [cx + 95, cy + 80, 7]]
    : [[cx - 120, cy - 20, -16], [cx + 120, cy - 10, 14], [cx, cy + 110, 3]]
  const card = (x: number, y: number, rot: number, k: number) => {
    const x0 = -cw / 2
    const y0 = -ch / 2
    const pad = cw * 0.08
    const hot = k % 2 === 0
    return (
      <g key={k} transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot + (rnd() - 0.5) * 6)})`}>
        <rect x={f(x0)} y={f(y0)} width={f(cw)} height={f(ch)} rx={f(cw * 0.07)} fill="#fff" fillOpacity={hot ? 0.16 : 0.1} stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
        <rect x={f(x0 + pad)} y={f(y0 + pad * 1.9)} width={f(cw - pad * 2)} height={f(ch * 0.44)} rx="3" fill={hot ? pal.accent : '#fff'} fillOpacity={hot ? 0.35 : 0.12} stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
        <rect x={f(x0 + pad)} y={f(y0 + pad * 2.6 + ch * 0.44)} width={f(cw - pad * 2)} height={f(ch * 0.3)} rx="3" fill="#fff" fillOpacity="0.09" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.5" />
        {[0.18, 0.3, 0.42].map((t) => (
          <rect key={t} x={f(x0 + pad * 1.8)} y={f(y0 + pad * 2.6 + ch * (0.44 + t * 0.55))} width={f((cw - pad * 3.6) * (t === 0.42 ? 0.6 : 1))} height="3" rx="1.5" fill="#fff" fillOpacity="0.3" />
        ))}
        <circle cx={f(-x0 - pad * 1.3)} cy={f(y0 + pad * 1.05)} r={f(cw * 0.065)} fill={pal.glow} fillOpacity="0.7" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
        <path d={`M${f(x0 + pad)} ${f(y0 + pad * 1.9 + ch * 0.3)} L${f(-x0 - pad)} ${f(y0 + pad * 1.9 + ch * 0.06)}`} stroke="#fff" strokeOpacity="0.25" strokeWidth="6" />
      </g>
    )
  }
  const sparks = Array.from({ length: W > H ? 14 : 10 }, (_, k) => {
    const x = rnd() * W
    const y = rnd() * H * 0.9
    const r = 4 + rnd() * 7
    return <path key={'s' + k} d={`M${f(x)} ${f(y - r)} L${f(x + r * 0.3)} ${f(y - r * 0.3)} L${f(x + r)} ${f(y)} L${f(x + r * 0.3)} ${f(y + r * 0.3)} L${f(x)} ${f(y + r)} L${f(x - r * 0.3)} ${f(y + r * 0.3)} L${f(x - r)} ${f(y)} L${f(x - r * 0.3)} ${f(y - r * 0.3)}Z`} fill={k % 3 ? '#fff' : pal.accent} fillOpacity="0.35" />
  })
  return (
    <g>
      {sparks}
      {spots.map(([x, y, rot], k) => card(x, y, rot, k))}
    </g>
  )
}

/** Dados: varios dados desparramados con sus puntitos. */
function dice({ W, H, cx, cy, rnd, pal }: MotifCtx) {
  const pips: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [[0.27, 0.27], [0.73, 0.73]],
    3: [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]],
    4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]],
    5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
    6: [[0.27, 0.25], [0.73, 0.25], [0.27, 0.5], [0.73, 0.5], [0.27, 0.75], [0.73, 0.75]],
  }
  const out: ReactNode[] = []
  const count = W > H ? 9 : 7
  for (let k = 0; k < count; k++) {
    const s = 40 + rnd() * 50
    let x = rnd() * W
    let y = rnd() * H * 0.85
    // Que no tapen el emoji.
    if (Math.abs(x - cx) < 70 && Math.abs(y - cy) < 70) x = (x + W / 2) % W
    if (k === 0) {
      x = cx + (W > H ? -150 : -90)
      y = cy + 60
    }
    const n = 1 + Math.floor(rnd() * 6)
    const hot = k % 3 === 0
    out.push(
      <g key={k} transform={`translate(${f(x)} ${f(y)}) rotate(${f(rnd() * 90)})`}>
        <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={s * 0.2} fill={hot ? pal.accent : '#fff'} fillOpacity={hot ? 0.35 : 0.12} stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
        {pips[n].map(([px, py], j) => (
          <circle key={j} cx={f(-s / 2 + px * s)} cy={f(-s / 2 + py * s)} r={f(s * 0.085)} fill="#fff" fillOpacity="0.7" />
        ))}
      </g>,
    )
  }
  return <g>{out}</g>
}

/** Fiesta: confeti y globos de diálogo. */
function confetti({ W, H, cx, cy, rnd, pal }: MotifCtx) {
  const colors = [pal.accent, '#fff', pal.glow, pal.accent2]
  const out: ReactNode[] = []
  for (let k = 0; k < (W > H ? 60 : 44); k++) {
    const x = rnd() * W
    const y = rnd() * H
    const c = colors[k % colors.length]
    const rot = rnd() * 180
    out.push(
      k % 3 === 0 ? (
        <circle key={k} cx={f(x)} cy={f(y)} r={f(3 + rnd() * 4)} fill={c} fillOpacity="0.55" />
      ) : (
        <rect key={k} x={f(x)} y={f(y)} width={f(5 + rnd() * 6)} height={f(12 + rnd() * 10)} rx="2" fill={c} fillOpacity="0.5" transform={`rotate(${f(rot)} ${f(x)} ${f(y)})`} />
      ),
    )
  }
  const bubble = (x: number, y: number, w: number, flip: boolean, k: number) => {
    const h = w * 0.62
    const tail = flip ? `M${f(x + w * 0.7)} ${f(y + h - 2)} l${f(w * 0.12)} ${f(h * 0.4)} l${f(-w * 0.3)} ${f(-h * 0.4)}Z` : `M${f(x + w * 0.2)} ${f(y + h - 2)} l${f(-w * 0.1)} ${f(h * 0.4)} l${f(w * 0.3)} ${f(-h * 0.4)}Z`
    return (
      <g key={'b' + k} fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.5" strokeWidth="2">
        <rect x={f(x)} y={f(y)} width={f(w)} height={f(h)} rx={f(h * 0.45)} />
        <path d={tail} stroke="none" />
        {[0.3, 0.5, 0.7].map((p) => (
          <circle key={p} cx={f(x + w * p)} cy={f(y + h / 2)} r={f(w * 0.05)} fill="#fff" fillOpacity="0.8" stroke="none" />
        ))}
      </g>
    )
  }
  return (
    <g>
      {out}
      {bubble(cx - (W > H ? 250 : 130), cy - 120 - rnd() * 20, 100, false, 1)}
      {bubble(cx + (W > H ? 120 : 45), cy - 150 + rnd() * 30, 84, true, 2)}
    </g>
  )
}

/** Cooperativos: anillos entrelazados alrededor del emoji. */
function rings({ W, H, cx, cy, rnd, pal }: MotifCtx) {
  const R = Math.min(W, H) * 0.24
  const n = 3 + Math.floor(rnd() * 2)
  const rot = rnd() * 360
  const out: ReactNode[] = []
  for (let k = 0; k < n; k++) {
    const a = ((Math.PI * 2) / n) * k + (rot * Math.PI) / 180
    out.push(<circle key={k} cx={f(cx + Math.cos(a) * R * 0.62)} cy={f(cy + Math.sin(a) * R * 0.62)} r={f(R)} fill="none" stroke={k % 2 ? pal.accent : '#fff'} strokeOpacity={k % 2 ? 0.6 : 0.35} strokeWidth="6" />)
  }
  const dots: ReactNode[] = []
  for (let k = 0; k < 3; k++) {
    dots.push(<circle key={'o' + k} cx={f(cx)} cy={f(cy)} r={f(R * (2 + k * 0.7))} fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />)
  }
  return (
    <g>
      {dots}
      {out}
    </g>
  )
}

/** Clásicos: un tablero de damas en perspectiva. */
function checkerboard({ W, H, rnd, pal }: MotifCtx) {
  const n = 8
  const out: ReactNode[] = []
  const horizon = H * 0.3
  const bottom = H * 1.05
  const topW = W * 0.5
  const botW = W * 1.9
  const off = (rnd() - 0.5) * W * 0.2
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  // Perspectiva: filas más altas cuanto más cerca.
  const rowY = (t: number) => lerp(horizon, bottom, t * t * 0.55 + t * 0.45)
  const xAt = (u: number, y: number) => {
    const t = (y - horizon) / (bottom - horizon)
    const w = lerp(topW, botW, t)
    return W / 2 + off * (1 - t) + (u - 0.5) * w
  }
  for (let r = 0; r < n; r++) {
    const y0 = rowY(r / n)
    const y1 = rowY((r + 1) / n)
    for (let c = 0; c < n; c++) {
      if ((r + c) % 2) continue
      const u0 = c / n
      const u1 = (c + 1) / n
      out.push(<polygon key={r * n + c} points={`${f(xAt(u0, y0))},${f(y0)} ${f(xAt(u1, y0))},${f(y0)} ${f(xAt(u1, y1))},${f(y1)} ${f(xAt(u0, y1))},${f(y1)}`} fill={(r * 3 + c) % 7 === 0 ? pal.accent : '#fff'} fillOpacity={(r * 3 + c) % 7 === 0 ? 0.35 : 0.13} />)
    }
  }
  const sx = rnd() * W
  return (
    <g>
      {out}
      <circle cx={f(sx)} cy={f(H * 0.12)} r={f(W * 0.08)} fill="#fff" fillOpacity="0.07" />
    </g>
  )
}

/** Deportes: líneas de cancha y una pelota con estela. */
function court({ W, H, cx, cy, rnd, pal }: MotifCtx) {
  const m = Math.min(W, H) * 0.1
  const bx = cx + (W > H ? -200 : -80) + rnd() * 30
  const by = cy - 90 - rnd() * 30
  return (
    <g fill="none" stroke="#fff" strokeWidth="4">
      <g strokeOpacity="0.3" transform={`rotate(${W > H ? 0 : 90} ${W / 2} ${H / 2})`}>
        <rect x={W > H ? m : (W - H) / 2 + m} y={W > H ? m : (H - W) / 2 + m} width={W > H ? W - 2 * m : H - 2 * m} height={W > H ? H - 2 * m : W - 2 * m} rx="6" />
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} strokeOpacity="0.9" strokeWidth="6" strokeDasharray="10 6" />
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} strokeOpacity="0.6" />
      </g>
      <path d={`M${f(bx - 120)} ${f(by + 70)} Q ${f(bx - 60)} ${f(by - 30)} ${f(bx)} ${f(by)}`} stroke={pal.accent} strokeOpacity="0.6" strokeWidth="5" strokeDasharray="1 12" strokeLinecap="round" />
      <circle cx={f(bx)} cy={f(by)} r="14" fill="#fff" fillOpacity="0.85" stroke="none" />
    </g>
  )
}

/* ---------- Deportes: cada uno con su cancha ---------- */

type SportKind = 'pitch' | 'rugby' | 'racket' | 'net' | 'hoop' | 'pool' | 'foosball' | 'pingpong' | 'target' | 'lanes' | 'green' | 'track' | 'swim' | 'wall' | 'fronton'

const SPORT_KIND: Record<string, SportKind> = {
  futbol5: 'pitch', futbol: 'pitch', futsal: 'pitch', handball: 'pitch', hockey: 'pitch', penales: 'pitch', travesano: 'pitch', ultimate: 'pitch',
  rugby: 'rugby',
  tenis: 'racket', padel: 'racket', pickleball: 'racket', badminton: 'racket', squash: 'fronton',
  voley: 'net', beachvoley: 'net', futboltenis: 'net', paleta: 'fronton',
  basquet: 'hoop', basquet3x3: 'hoop', tiroslibres: 'hoop',
  pool: 'pool', metegol: 'foosball', pingpong: 'pingpong',
  dardos: 'target', tejo: 'target', sapo: 'target', bochas: 'target', petanca: 'target', cornhole: 'target',
  bowling: 'lanes', minigolf: 'green', golf: 'green',
  running: 'track', ciclismo: 'track', natacion: 'swim', escalada: 'wall',
}

/** Muñecos por barra del metegol, de un arco al otro. */
const FOOS_ROWS = [1, 2, 5, 5, 2, 1]

/** Caja apaisada centrada (la cancha); en las carátulas verticales se gira 90°. */
function fieldBox({ W, H }: MotifCtx) {
  const L = Math.max(W, H)
  const S = Math.min(W, H)
  const m = S * 0.09
  return { x: (W - L) / 2 + m, y: (H - S) / 2 + m, w: L - 2 * m, h: S - 2 * m, rot: W > H ? undefined : `rotate(90 ${W / 2} ${H / 2})` }
}

function sportMotif(id: string, c: MotifCtx): ReactNode {
  const kind = SPORT_KIND[id]
  if (!kind) return court(c)
  const { x, y, w, h, rot } = fieldBox(c)
  const mx = x + w / 2
  const my = y + h / 2
  const line = { fill: 'none', stroke: '#fff', strokeOpacity: 0.32, strokeWidth: 4 }
  const accent = { fill: 'none', stroke: c.pal.accent, strokeOpacity: 0.55, strokeWidth: 5 }
  switch (kind) {
    case 'pitch': {
      const bw = h * 0.42
      return (
        <g transform={rot} {...line}>
          <rect x={x} y={y} width={w} height={h} rx="4" />
          <line x1={mx} y1={y} x2={mx} y2={y + h} />
          <circle cx={mx} cy={my} r={h * 0.17} />
          <rect x={x} y={my - bw / 2} width={w * 0.13} height={bw} />
          <rect x={x + w - w * 0.13} y={my - bw / 2} width={w * 0.13} height={bw} />
          <rect x={x - 14} y={my - h * 0.1} width="14" height={h * 0.2} {...accent} />
          <rect x={x + w} y={my - h * 0.1} width="14" height={h * 0.2} {...accent} />
          <circle cx={mx} cy={my} r="5" fill="#fff" fillOpacity="0.5" />
        </g>
      )
    }
    case 'rugby':
      return (
        <g transform={rot} {...line}>
          <rect x={x} y={y} width={w} height={h} />
          {[0.1, 0.32, 0.5, 0.68, 0.9].map((k) => (
            <line key={k} x1={x + w * k} y1={y} x2={x + w * k} y2={y + h} strokeDasharray={k === 0.5 ? undefined : '14 10'} />
          ))}
          {[x + w * 0.04, x + w * 0.96].map((px) => (
            <path key={px} d={`M${f(px)} ${f(my - h * 0.16)}V${f(my + h * 0.16)}M${f(px - 10)} ${f(my)}H${f(px + 10)}`} {...accent} />
          ))}
        </g>
      )
    case 'racket':
    case 'net':
      return (
        <g transform={rot} {...line}>
          <rect x={x} y={y} width={w} height={h} />
          {kind === 'racket' ? (
            <>
              <line x1={x} y1={y + h * 0.12} x2={x + w} y2={y + h * 0.12} />
              <line x1={x} y1={y + h * 0.88} x2={x + w} y2={y + h * 0.88} />
              <line x1={x + w * 0.24} y1={y + h * 0.12} x2={x + w * 0.24} y2={y + h * 0.88} />
              <line x1={x + w * 0.76} y1={y + h * 0.12} x2={x + w * 0.76} y2={y + h * 0.88} />
              <line x1={x + w * 0.24} y1={my} x2={x + w * 0.76} y2={my} />
            </>
          ) : (
            <>
              <line x1={x + w * 0.33} y1={y} x2={x + w * 0.33} y2={y + h} strokeDasharray="12 8" />
              <line x1={x + w * 0.67} y1={y} x2={x + w * 0.67} y2={y + h} strokeDasharray="12 8" />
            </>
          )}
          <line x1={mx} y1={y - 16} x2={mx} y2={y + h + 16} stroke="#fff" strokeOpacity="0.85" strokeWidth="6" strokeDasharray="4 4" />
          <circle cx={x + w * 0.66} cy={y + h * 0.3} r="11" fill={c.pal.accent} fillOpacity="0.8" stroke="none" />
        </g>
      )
    case 'hoop': {
      const key = h * 0.36
      return (
        <g transform={rot} {...line}>
          <rect x={x} y={y} width={w} height={h} />
          <line x1={mx} y1={y} x2={mx} y2={y + h} />
          <circle cx={mx} cy={my} r={h * 0.14} />
          {[0, 1].map((side) => {
            const bx = side ? x + w : x
            const dir = side ? -1 : 1
            return (
              <g key={side}>
                <rect x={side ? bx - w * 0.2 : bx} y={my - key / 2} width={w * 0.2} height={key} />
                <path d={`M${f(bx)} ${f(y + h * 0.06)}H${f(bx + dir * w * 0.12)}A${f(h * 0.44)} ${f(h * 0.44)} 0 0 ${side ? 0 : 1} ${f(bx + dir * w * 0.12)} ${f(y + h * 0.94)}H${f(bx)}`} />
                <circle cx={bx + dir * w * 0.055} cy={my} r="9" {...accent} />
              </g>
            )
          })}
        </g>
      )
    }
    case 'pool': {
      const balls: ReactNode[] = []
      let k = 0
      for (let row = 0; row < 5; row++)
        for (let i = 0; i <= row; i++)
          balls.push(<circle key={k++} cx={x + w * 0.68 + row * 15} cy={my + (i - row / 2) * 16} r="7.5" fill={k % 3 ? c.pal.accent : '#fff'} fillOpacity={k === 5 ? 0.95 : 0.55} stroke="none" />)
      return (
        <g transform={rot}>
          <rect x={x} y={y} width={w} height={h} rx="18" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="10" />
          {[[x, y], [mx, y], [x + w, y], [x, y + h], [mx, y + h], [x + w, y + h]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="11" fill="#000" fillOpacity="0.45" />
          ))}
          {balls}
          <circle cx={x + w * 0.25} cy={my} r="7.5" fill="#fff" fillOpacity="0.9" />
          <line x1={x + w * 0.04} y1={my + h * 0.22} x2={x + w * 0.22} y2={my + 6} stroke={c.pal.accent} strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
        </g>
      )
    }
    case 'foosball':
      return (
        <g transform={rot}>
          <rect x={x} y={y} width={w} height={h} fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" />
          {[0.1, 0.24, 0.4, 0.6, 0.76, 0.9].map((k, i) => (
            <g key={k}>
              <line x1={x + w * k} y1={y - 20} x2={x + w * k} y2={y + h + 20} stroke="#fff" strokeOpacity="0.45" strokeWidth="4" />
              {Array.from({ length: FOOS_ROWS[i] }, (_, j) => (
                <rect key={j} x={x + w * k - 7} y={y + (h * (j + 1)) / (FOOS_ROWS[i] + 1) - 11} width="14" height="22" rx="4" fill={i % 2 ? c.pal.accent : '#fff'} fillOpacity="0.55" />
              ))}
            </g>
          ))}
        </g>
      )
    case 'pingpong':
      return (
        <g transform={rot} {...line}>
          <rect x={x + w * 0.08} y={y + h * 0.1} width={w * 0.84} height={h * 0.8} />
          <line x1={x + w * 0.08} y1={my} x2={x + w * 0.92} y2={my} strokeOpacity="0.2" />
          <line x1={mx} y1={y} x2={mx} y2={y + h} stroke="#fff" strokeOpacity="0.85" strokeWidth="6" strokeDasharray="4 4" />
          <circle cx={x + w * 0.7} cy={y + h * 0.32} r="9" fill="#fff" fillOpacity="0.9" stroke="none" />
        </g>
      )
    case 'target': {
      const tx = c.cx + (c.W > c.H ? -170 : 0)
      const ty = c.cy + (c.W > c.H ? 20 : 120)
      return (
        <g fill="none" stroke="#fff">
          {[120, 92, 64, 38, 16].map((rr, i) => (
            <circle key={rr} cx={tx} cy={ty} r={rr} strokeOpacity={0.18 + i * 0.08} strokeWidth={i === 4 ? 8 : 4} stroke={i % 2 ? c.pal.accent : '#fff'} />
          ))}
          {Array.from({ length: 12 }, (_, k) => {
            const a = (Math.PI / 6) * k
            return <line key={k} x1={tx + 16 * Math.cos(a)} y1={ty + 16 * Math.sin(a)} x2={tx + 120 * Math.cos(a)} y2={ty + 120 * Math.sin(a)} strokeOpacity="0.12" strokeWidth="2" />
          })}
        </g>
      )
    }
    case 'lanes':
      return (
        <g transform={rot} {...line}>
          {[0, 1, 2].map((k) => (
            <rect key={k} x={x} y={y + (h / 3) * k + 8} width={w} height={h / 3 - 16} rx="6" strokeOpacity={k === 1 ? 0.5 : 0.22} />
          ))}
          {[0, 1, 2, 3].flatMap((row) =>
            Array.from({ length: row + 1 }, (_, i) => <circle key={`${row}-${i}`} cx={x + w * 0.86 + row * 13} cy={my + (i - row / 2) * 13} r="5" fill="#fff" fillOpacity="0.6" stroke="none" />),
          )}
          <circle cx={x + w * 0.2} cy={my} r="14" fill={c.pal.accent} fillOpacity="0.75" stroke="none" />
        </g>
      )
    case 'green': {
      const gx = c.cx + (c.W > c.H ? -150 : 40)
      const gy = c.cy + (c.W > c.H ? 40 : 110)
      return (
        <g>
          <ellipse cx={gx} cy={gy} rx="150" ry="90" fill="#fff" fillOpacity="0.1" />
          <ellipse cx={gx} cy={gy} rx="150" ry="90" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" strokeDasharray="10 8" />
          <circle cx={gx + 40} cy={gy + 10} r="9" fill="#000" fillOpacity="0.45" />
          <line x1={gx + 40} y1={gy + 10} x2={gx + 40} y2={gy - 110} stroke="#fff" strokeOpacity="0.7" strokeWidth="4" />
          <path d={`M${gx + 40} ${gy - 110}l46 14l-46 14z`} fill={c.pal.accent} fillOpacity="0.8" />
          <path d={`M${gx - 120} ${gy + 60}Q${gx - 40} ${gy - 30} ${gx + 30} ${gy + 8}`} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeDasharray="1 10" strokeLinecap="round" />
        </g>
      )
    }
    case 'track':
    case 'swim':
      return (
        <g transform={rot} fill="none">
          {Array.from({ length: 6 }, (_, k) => {
            const inset = k * (h / 14)
            return kind === 'track' ? (
              <rect key={k} x={x + inset} y={y + inset} width={w - 2 * inset} height={h - 2 * inset} rx={h / 2 - inset} stroke="#fff" strokeOpacity={k === 0 ? 0.4 : 0.18} strokeWidth="3" />
            ) : (
              <line key={k} x1={x} y1={y + (h / 6) * k + h / 12} x2={x + w} y2={y + (h / 6) * k + h / 12} stroke={k % 2 ? c.pal.accent : '#fff'} strokeOpacity="0.4" strokeWidth="4" strokeDasharray="6 6" />
            )
          })}
          {kind === 'swim' && <rect x={x} y={y} width={w} height={h} stroke="#fff" strokeOpacity="0.3" strokeWidth="5" />}
          {kind === 'track' && <line x1={mx} y1={y} x2={mx} y2={y + h * 0.43} stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeDasharray="8 8" />}
        </g>
      )
    case 'fronton': {
      // La pared de enfrente vista desde la cancha: chapa abajo, línea de saque y el piso en perspectiva.
      const top = c.H * 0.08
      const floor = c.H * 0.62
      const l = c.W * 0.08
      const rr = c.W * 0.92
      return (
        <g fill="none" stroke="#fff">
          <rect x={l} y={top} width={rr - l} height={floor - top} strokeOpacity="0.3" strokeWidth="4" />
          <line x1={l} y1={floor - (floor - top) * 0.12} x2={rr} y2={floor - (floor - top) * 0.12} stroke={c.pal.accent} strokeOpacity="0.7" strokeWidth="6" />
          <line x1={l} y1={top + (floor - top) * 0.45} x2={rr} y2={top + (floor - top) * 0.45} strokeOpacity="0.35" strokeWidth="3" />
          <path d={`M${f(l)} ${f(floor)}L0 ${c.H}M${f(rr)} ${f(floor)}L${c.W} ${c.H}`} strokeOpacity="0.25" strokeWidth="4" />
          <line x1={c.W / 2} y1={floor} x2={c.W / 2} y2={c.H} strokeOpacity="0.2" strokeWidth="3" strokeDasharray="10 8" />
          <circle cx={c.W * 0.3} cy={top + (floor - top) * 0.3} r="9" fill="#fff" fillOpacity="0.4" stroke="none" />
        </g>
      )
    }
    case 'wall': {
      const holds: ReactNode[] = []
      for (let k = 0; k < 26; k++) {
        const hx = c.rnd() * c.W
        const hy = c.rnd() * c.H
        const rr = 7 + c.rnd() * 12
        holds.push(<path key={k} d={`M${f(hx - rr)} ${f(hy)}Q${f(hx)} ${f(hy - rr * 1.3)} ${f(hx + rr)} ${f(hy)}Q${f(hx)} ${f(hy + rr * 0.8)} ${f(hx - rr)} ${f(hy)}Z`} fill={k % 3 ? '#fff' : c.pal.accent} fillOpacity={k % 3 ? 0.18 : 0.5} />)
      }
      return (
        <g>
          {Array.from({ length: Math.ceil(c.W / 60) }, (_, k) => (
            <line key={k} x1={k * 60} y1={0} x2={k * 60} y2={c.H} stroke="#fff" strokeOpacity="0.07" strokeWidth="2" />
          ))}
          {holds}
        </g>
      )
    }
  }
}

/** Videojuegos: píxeles, líneas de barrido y botones de joystick. */
function pixels({ W, H, cx, cy, rnd, pal }: MotifCtx) {
  const s = 20
  const out: ReactNode[] = []
  for (let k = 0; k < (W > H ? 70 : 50); k++) {
    const x = Math.floor(rnd() * (W / s)) * s
    const y = Math.floor(rnd() * (H / s)) * s
    const v = rnd()
    out.push(<rect key={k} x={x} y={y} width={s - 3} height={s - 3} fill={v > 0.7 ? pal.accent : '#fff'} fillOpacity={v > 0.7 ? 0.45 : 0.1 + v * 0.1} />)
  }
  const lines: ReactNode[] = []
  for (let y = 0; y < H; y += 6) lines.push(<line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#000" strokeOpacity="0.12" strokeWidth="2" />)
  const dx = cx + (W > H ? -210 : -95)
  const dy = cy + (W > H ? 70 : 105)
  const bx = cx + (W > H ? 190 : 95)
  return (
    <g>
      {out}
      {lines}
      <path d={`M${dx - 9} ${dy - 27}h18v18h18v18h-18v18h-18v-18h-18v-18h18z`} fill="#fff" fillOpacity="0.25" />
      {[
        [0, -16],
        [16, 0],
        [0, 16],
        [-16, 0],
      ].map(([x, y], k) => (
        <circle key={k} cx={bx + x} cy={dy + y} r="9" fill={k % 2 ? pal.accent : '#fff'} fillOpacity={k % 2 ? 0.6 : 0.3} />
      ))}
    </g>
  )
}

/* ---------- Color y azar determinístico ---------- */

interface Palette {
  top: string
  mid: string
  deep: string
  glow: string
  accent: string
  accent2: string
}

function palette(color: string, seed: number): Palette {
  const [h0, s0, l0] = hexToHsl(color)
  const gray = s0 < 0.12
  const h = h0
  const s = gray ? 0.18 : Math.max(s0, 0.62)
  const shift = ((seed % 41) - 20) * 0.9
  const accentShifts = [35, 150, 180, -45, 200]
  const ah = (h + accentShifts[seed % accentShifts.length] + 360) % 360
  return {
    top: hsl(h - shift * 0.3, s, clamp(l0 * 1.05, 0.36, 0.52)),
    mid: hsl(h + shift * 0.5, s * 0.95, clamp(l0 * 0.62, 0.2, 0.3)),
    deep: hsl(h + shift, Math.min(1, s * 0.9), 0.08),
    glow: hsl(h - 8, Math.min(1, s + 0.15), gray ? 0.75 : 0.66),
    accent: hsl(ah, gray ? 0.7 : 0.88, 0.62),
    accent2: hsl((ah + 90) % 360, 0.85, 0.65),
  }
}

function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return [260, 0.6, 0.45]
  const v = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  const r = parseInt(v.slice(0, 2), 16) / 255
  const g = parseInt(v.slice(2, 4), 16) / 255
  const b = parseInt(v.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s, l]
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(((h % 360) + 360) % 360)} ${Math.round(clamp(s, 0, 1) * 100)}% ${Math.round(clamp(l, 0, 1) * 100)}%)`
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Generador pseudoaleatorio chiquito (mulberry32): mismo id, mismo dibujo. */
function rng(seed: number) {
  let a = seed || 1
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
