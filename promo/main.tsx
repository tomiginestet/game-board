/* oxlint-disable react/only-export-components -- es el punto de entrada de la animación, no un módulo con recarga en caliente. */
// Animación promocional de Game Board en 9:16 (540×960 CSS px, se graba a 1080×1920).
// Usa los componentes reales de la app (carátulas, medallas, logo) y se dibuja como función del tiempo:
// `?t=12.5` muestra un cuadro fijo, `?render` espera a que el script de grabación lo maneje,
// y sin parámetros se reproduce en loop para previsualizarla.
import {
  CheckIcon,
  ClipboardTextIcon,
  CrownIcon,
  HandIcon,
  IconContext,
  MagicWandIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparkleIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { memo, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import '../src/game-board.css'
import '../src/catalog.css'
import './promo.css'
import { GameCover } from '../src/components/GameCover'
import { Medal } from '../src/components/Medal'
import { BUILTIN_GAMES } from '../src/lib/games'
import type { GameDef } from '../src/lib/games/schema'
import { LOGO_COLORS, logoAnimation } from '../src/lib/logo'
import { TIERS } from '../src/lib/medalArt'
import { clamp, ease, fadeOut, lerp, pop, prog, rise, rng, slide, typed } from './anim'
import { bang } from './bang'

// ---------- Datos ----------

const game = (id: string): GameDef => {
  const g = BUILTIN_GAMES.find((x) => x.id === id)
  if (!g) throw new Error(`No existe el juego ${id}`)
  return g
}

type Pal = { name: string; emoji: string; color: string }
const P = {
  tomi: { name: 'Tomi', emoji: '🦊', color: '#ff6b35' },
  juli: { name: 'Juli', emoji: '🐼', color: '#4c8dff' },
  caro: { name: 'Caro', emoji: '🦄', color: '#b98cff' },
  fede: { name: 'Fede', emoji: '🐸', color: '#22c55e' },
  sofi: { name: 'Sofi', emoji: '🐙', color: '#f783ac' },
  nico: { name: 'Nico', emoji: '🦁', color: '#ffb400' },
} satisfies Record<string, Pal>
const FRIENDS = [P.tomi, P.juli, P.caro, P.fede, P.sofi, P.nico]

const SQUARES = [LOGO_COLORS.a, LOGO_COLORS.b, LOGO_COLORS.c, LOGO_COLORS.d]
const CONFETTI = [...SQUARES, '#ffb400', '#ffffff']

// Escenas: [inicio, duración] en segundos. Se superponen un poquito para las transiciones.
const SCENES = {
  intro: [0, 2.8],
  any: [2.6, 4.8],
  friends: [7.2, 3.5],
  rank: [10.5, 2.9],
  missing: [13.2, 4.6],
  gen: [17.6, 7.8],
  unlock: [25.2, 3.1],
  outro: [28.1, 2.9],
} as const
const DURATION = 31

// ---------- Piezas ----------

const Cover = memo(GameCover)

function Badge({ g, size = 44 }: { g: Pick<GameDef, 'emoji' | 'color'>; size?: number }) {
  return (
    <span className="game-badge" style={{ width: size, height: size, fontSize: size * 0.55, background: g.color + '33', borderColor: g.color }}>
      {g.emoji}
    </span>
  )
}

function Av({ p, size = 40, style }: { p: Pal; size?: number; style?: CSSProperties }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.55, background: p.color + '33', borderColor: p.color, ...style }}>
      {p.emoji}
    </span>
  )
}

function Headline({ t, at = 0, kicker, title, top = 64, out, size }: { t: number; at?: number; kicker?: ReactNode; title: ReactNode; top?: number; out?: number; size?: number }) {
  return (
    <div className="headline" style={{ top, opacity: out === undefined ? 1 : fadeOut(t, out, out + 0.3) }}>
      {kicker && (
        <div className="kicker" style={rise(t, at, 0.4, 14)}>
          {kicker}
        </div>
      )}
      <div className="title" style={{ ...rise(t, at + 0.08, 0.5, 26), fontSize: size }}>
        {title}
      </div>
    </div>
  )
}

/** Cursor de texto: fijo mientras se escribe, titila después. */
function Caret({ t, until }: { t: number; until: number }) {
  const on = t < until || Math.floor((t - until) * 2.4) % 2 === 0
  return <span className="caret" style={{ opacity: on ? 1 : 0 }} />
}

/** Un dedo que toca: se acerca, aprieta y deja una onda. Va dentro de un elemento con position: relative. */
function Tap({ t, at, x = '50%', y = '50%' }: { t: number; at: number; x?: string; y?: string }) {
  if (t < at - 0.3 || t > at + 0.5) return null
  const pre = ease.out(prog(t, at - 0.3, at))
  const post = prog(t, at, at + 0.5)
  return (
    <span className="tap" style={{ left: x, top: y }}>
      <i className="tap-dot" style={{ opacity: post > 0 ? 1 - post : pre, transform: `scale(${lerp(1.6, 1, pre) - 0.15 * Math.sin(post * Math.PI)})` }} />
      <i className="tap-ring" style={{ opacity: post > 0 ? (1 - post) * 0.9 : 0, transform: `scale(${lerp(0.6, 2.8, ease.out(post))})` }} />
    </span>
  )
}

/** Papelitos que saltan desde (x, y) y caen. */
function Confetti({ t, at, x, y, n = 46, seed = 1, power = 1 }: { t: number; at: number; x: number; y: number; n?: number; seed?: number; power?: number }) {
  const tau = t - at
  if (tau < 0 || tau > 2.4) return null
  const r = rng(seed)
  const bits = Array.from({ length: n }, () => {
    const ang = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.25
    const v = (380 + r() * 520) * power
    return { vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, rot: r() * 360, vr: (r() - 0.5) * 1000, c: CONFETTI[Math.floor(r() * CONFETTI.length)], w: 6 + r() * 7, h: 9 + r() * 9, round: r() < 0.3 }
  })
  const drag = (1 - Math.exp(-2.2 * tau)) / 2.2
  return (
    <div className="confetti">
      {bits.map((b, i) => (
        <i
          key={i}
          style={{
            left: x + b.vx * drag,
            top: y + b.vy * drag + 520 * tau * tau,
            width: b.w,
            height: b.round ? b.w : b.h,
            borderRadius: b.round ? '50%' : 2,
            background: b.c,
            opacity: 1 - prog(tau, 1.5, 2.4),
            transform: `translate(-50%, -50%) rotate(${b.rot + b.vr * tau}deg) scaleX(${Math.cos(tau * 9 + i)})`,
          }}
        />
      ))}
    </div>
  )
}

/** Logo animado de la app (SMIL), llevado al segundo exacto. */
function SmilLogo({ time, size }: { time: number; size: number }) {
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg) return
    svg.pauseAnimations()
    svg.setCurrentTime(time)
  }, [time])
  return <svg ref={ref} viewBox="0 0 64 64" width={size} height={size} dangerouslySetInnerHTML={{ __html: logoAnimation('secuencia').inner }} />
}

/** Cuatro cuadraditos del logo. `place(i)` devuelve el estilo de cada uno. */
function Squares({ size, gap, place }: { size: number; gap: number; place?: (i: number) => CSSProperties }) {
  return (
    <div className="squares" style={{ width: size * 2 + gap, gap }}>
      {SQUARES.map((c, i) => (
        <i key={i} style={{ width: size, height: size, borderRadius: size * 0.23, background: c, ...place?.(i) }} />
      ))}
    </div>
  )
}

function Backdrop({ t }: { t: number }) {
  const a = t * 0.35
  return (
    <div className="backdrop">
      <i style={{ background: '#ff6b35', left: 270 + Math.cos(a) * 160 - 260, top: 180 + Math.sin(a * 1.3) * 90 - 260 }} />
      <i style={{ background: '#4c8dff', left: 270 + Math.cos(a + 2.4) * 170 - 260, top: 720 + Math.sin(a * 0.9 + 1) * 110 - 260 }} />
      <i style={{ background: '#b98cff', left: 270 + Math.cos(a + 4.2) * 150 - 260, top: 470 + Math.sin(a * 1.1 + 2) * 140 - 260, opacity: 0.12 }} />
    </div>
  )
}

// ---------- 1. Logo ----------

function Intro({ t }: { t: number }) {
  const out = ease.in(prog(t, 2.3, 2.8))
  return (
    <div className="scene center-col" style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.4})` }}>
      <Squares
        size={74}
        gap={12}
        place={(i) => {
          const at = 0.1 + i * 0.13
          const k = prog(t, at, at + 0.7)
          const pulse = 1 + 0.14 * Math.sin(prog(t, 1.45 + i * 0.07, 1.75 + i * 0.07) * Math.PI)
          return { opacity: clamp(k * 6), transform: `translateY(${(1 - ease.spring(k)) * -340}px) rotate(${(1 - ease.out(k)) * (i % 2 ? 120 : -120)}deg) scale(${pulse})` }
        }}
      />
      <div className="wordmark" style={rise(t, 0.6, 0.5, 30)}>
        Game Board
      </div>
      <div className="intro-tag">
        <span style={rise(t, 1.0, 0.45, 18)}>Todos tus juegos.</span>
        <span className="accent" style={rise(t, 1.2, 0.45, 18)}>
          Todos tus amigos.
        </span>
      </div>
    </div>
  )
}

// ---------- 2. Cualquier juego ----------

const WALL = Array.from({ length: 4 }, (_, c) => BUILTIN_GAMES.filter((_, i) => i % 4 === c).slice(0, 8))
const SLOT = ['truco', 'catan', 'generala', 'mariokart', 'skullking', 'chinchon', 'teg', 'amongus'].map(game)
const CATS = ['🎲 Mesa', '🃏 Cartas', '🎉 Fiesta', '🎮 Videojuegos', '🏓 Deportes', '🤝 Cooperativos']

function AnyGame({ t }: { t: number }) {
  const out = ease.in(prog(t, 4.3, 4.8))
  const inK = ease.out(prog(t, 0, 0.7))
  const step = 0.3
  const s0 = 0.4
  const finalAt = s0 + SLOT.length * step
  // Posición del rodillo: -1 (vacío) → 0..7 (cada juego) → 8 ("cualquier juego"). Cada paso gira en un ratito y frena.
  const u = (t - s0) / step
  const idx = Math.floor(u)
  const reel = u < 0 ? -1 : idx > SLOT.length ? SLOT.length : idx - 1 + ease.out(clamp((u - idx) / (idx === SLOT.length ? 0.8 : 0.45)))
  return (
    <div className="scene" style={{ opacity: 1 - out }}>
      <div className="wall" style={{ opacity: inK, transform: `translate(-50%, -50%) rotate(-12deg) scale(${lerp(1.45, 1.15, inK) + out * 0.3})` }}>
        {WALL.map((col, c) => {
          const dir = c % 2 ? -1 : 1
          const y = (dir > 0 ? -420 : -140) + dir * 58 * t
          return (
            <div key={c} className="wall-col" style={{ transform: `translateY(${y}px)` }}>
              {col.map((g) => (
                <div key={g.id} className="wall-cover">
                  <Cover game={g} decorative />
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <div className="wall-scrim" />

      <div className="headline" style={{ top: 92 }}>
        <div className="kicker" style={rise(t, 0.2, 0.4, 14)}>
          Llevá la cuenta de
        </div>
        <div className="slot">
          {/* Rodillo tipo tragamonedas: los nombres van pegados uno debajo del otro, así nunca se pisan. */}
          {[...SLOT, null].map((g, i) => {
            const y = (i - reel) * 76
            if (Math.abs(y) >= 76) return null
            return g ? (
              <div key={g.id} className="slot-item" style={{ transform: `translateY(${y}px)` }}>
                <Badge g={g} size={54} /> {g.name}
              </div>
            ) : (
              <div key="final" className="slot-item final" style={{ transform: `translateY(${y}px)` }}>
                cualquier juego
                <i className="underline" style={{ transform: `scaleX(${ease.out(prog(t, finalAt + 0.3, finalAt + 0.7))})` }} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="count-card" style={pop(t, 3.0, 0.5, 0.5)}>
        <b>{BUILTIN_GAMES.length}</b>
        <span>juegos de fábrica</span>
      </div>
      <div className="chips center cat-chips">
        {CATS.map((c, i) => (
          <span key={c} className="pill big" style={pop(t, 3.25 + i * 0.08, 0.4)}>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------- 3. Con amigos: historial ----------

const HISTORY = [
  { g: game('truco'), when: 'Hoy', who: [P.tomi, P.juli, P.fede, P.caro], win: 'Tomi & Juli', score: '30 a 24' },
  { g: game('catan'), when: 'Ayer', who: [P.caro, P.nico, P.sofi, P.tomi], win: 'Caro', score: '10 puntos' },
  { g: game('generala'), when: 'Sáb', who: [P.fede, P.juli, P.nico], win: 'Fede', score: '312' },
  { g: game('mariokart'), when: 'Vie', who: [P.juli, P.sofi, P.tomi, P.fede], win: 'Juli', score: '1.° puesto' },
]

function Friends({ t }: { t: number }) {
  const out = ease.in(prog(t, 3.0, 3.5))
  return (
    <div className="scene">
      <Headline t={t} kicker="Con tus amigos" title="Cada partida queda anotada" out={3.0} size={46} />
      <div className="group-card card" style={{ ...pop(t, 0.25, 0.45, 0.7), opacity: (pop(t, 0.25).opacity as number) * (1 - out) }}>
        <span className="group-icon">
          <UsersThreeIcon weight="fill" />
        </span>
        <div className="grow">
          <b>Los del jueves</b>
          <span className="muted small block">6 amigos · 128 partidas</span>
        </div>
        <span className="av-stack">
          {FRIENDS.map((p, i) => (
            <Av key={p.name} p={p} size={34} style={{ ...pop(t, 0.4 + i * 0.06, 0.35), zIndex: 10 - i }} />
          ))}
        </span>
      </div>
      <div className="history" style={{ transform: `translateY(${-out * 80}px)`, opacity: 1 - out }}>
        {HISTORY.map((h, i) => (
          <div key={h.g.id} className="h-card card" style={slide(t, 0.6 + i * 0.22, 0.5, 160)}>
            <Badge g={h.g} size={52} />
            <div className="grow">
              <div className="row-between">
                <b className="h-game">{h.g.name}</b>
                <span className="muted small">{h.when}</span>
              </div>
              <div className="h-win">
                <CrownIcon weight="fill" color="#ffb400" /> {h.win} <span className="muted">· {h.score}</span>
              </div>
              <div className="h-avs">
                {h.who.map((p) => (
                  <Av key={p.name} p={p} size={24} />
                ))}
              </div>
            </div>
            {i === 1 && (
              <span className="pill gold streak" style={pop(t, 2.0, 0.4)}>
                🔥 3 seguidas
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- 4. Ranking ----------

const PODIUM = [
  { p: P.tomi, pts: 1105, h: 160, at: 0.6, place: 2, tier: TIERS[1] },
  { p: P.caro, pts: 1240, h: 225, at: 0.8, place: 1, tier: TIERS[2] },
  { p: P.juli, pts: 980, h: 112, at: 0.45, place: 3, tier: TIERS[0] },
]
const TABS = ['✨ Gloria', '🏆 Victorias', '📈 ELO', '🥊 Cinturones']

function Ranking({ t }: { t: number }) {
  const out = ease.in(prog(t, 2.5, 2.9))
  return (
    <div className="scene" style={{ opacity: 1 - out }}>
      <Headline t={t} kicker="Rankings y torneos" title="¿Quién manda?" />
      <div className="chips center tabs">
        {TABS.map((c, i) => (
          <span key={c} className={'pill big' + (i === 0 ? ' active' : '')} style={pop(t, 0.2 + i * 0.08, 0.4)}>
            {c}
          </span>
        ))}
      </div>
      <div className="podium">
        {PODIUM.map((s) => {
          const k = prog(t, s.at, s.at + 0.8)
          const n = Math.round(s.pts * ease.out(prog(t, s.at + 0.1, s.at + 1.0)))
          const crown = prog(t, 1.4, 2.0)
          return (
            <div key={s.p.name} className="pod-col">
              {s.place === 1 && (
                <span className="pod-crown" style={{ opacity: clamp(crown * 5), transform: `translateY(${(1 - ease.spring(crown)) * -70}px) rotate(-8deg)` }}>
                  👑
                </span>
              )}
              <div style={pop(t, s.at + 0.25, 0.4)}>
                <Av p={s.p} size={s.place === 1 ? 78 : 64} />
              </div>
              <b className="pod-name" style={rise(t, s.at + 0.35, 0.35, 10)}>
                {s.p.name}
              </b>
              <span className="pod-pts" style={rise(t, s.at + 0.35, 0.35, 10)}>
                {n.toLocaleString('es-AR')} pts
              </span>
              <div className="pod-block" style={{ height: s.h * ease.spring(k), background: `linear-gradient(180deg, ${s.tier.main}, ${s.tier.dark})` }}>
                <span>{s.place}</span>
              </div>
            </div>
          )
        })}
      </div>
      <Confetti t={t} at={1.5} x={270} y={380} n={60} seed={7} />
    </div>
  )
}

// ---------- 5. ¿Tu juego no está? ----------

const NOTES = 'con el Sheriff a 5 vidas'

function Missing({ t }: { t: number }) {
  const outA = ease.in(prog(t, 2.0, 2.3))
  const out = ease.in(prog(t, 4.25, 4.6))
  const query = typed(t, 'Bang!', 0.6, 12)
  const notes = typed(t, NOTES, 2.6, 28)
  const auto = t >= 3.5
  const pressA = 1 - 0.05 * Math.sin(prog(t, 1.75, 1.95) * Math.PI)
  const pressB = 1 - 0.05 * Math.sin(prog(t, 4.05, 4.25) * Math.PI)
  return (
    <div className="scene" style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.08})` }}>
      {t < 2.4 && <Headline t={t} at={0.05} title="¿Tu juego no está?" top={110} out={2.0} size={56} />}
      {t >= 2.1 && <Headline t={t} at={2.1} kicker="No pasa nada" title="Agregalo vos" top={74} />}

      {t < 2.4 && (
        <div className="block-abs" style={{ top: 270, opacity: 1 - outA, transform: `translateX(${-outA * 120}px)` }}>
          <div className="input search-fake" style={rise(t, 0.3, 0.45, 30)}>
            <MagnifyingGlassIcon />
            <span>
              {query}
              <Caret t={t} until={1.1} />
            </span>
          </div>
          <div className="empty big-empty" style={pop(t, 1.15, 0.45, 0.8)}>
            <div className="empty-emoji">🤔</div>
            <p>
              No encontramos <b>«Bang!»</b> en el catálogo.
            </p>
            <div className="rel" style={{ transform: `scale(${pressA})` }}>
              <button className="btn primary big">
                <PlusIcon /> Agregar juego
              </button>
              <Tap t={t} at={1.75} />
            </div>
          </div>
        </div>
      )}

      {t >= 2.1 && (
        <div className="block-abs card form-card" style={{ top: 235, ...slide(t, 2.2, 0.5, 200) }}>
          <h2 className="form-title">Agregar un juego</h2>
          <div className="field">
            <label>Nombre del juego</label>
            <div className="input">Bang!</div>
          </div>
          <div className="field">
            <label>Cómo lo juegan ustedes (opcional)</label>
            <div className="input">
              {notes}
              {t >= 2.5 && t < 3.6 && <Caret t={t} until={2.6 + NOTES.length / 28} />}
            </div>
          </div>
          <div className="segmented">
            <button className={auto ? '' : 'active'}>
              <ClipboardTextIcon /> IA gratis
            </button>
            <button className={'rel' + (auto ? ' active' : '')} style={auto ? pop(t, 3.5, 0.3, 0.85) : undefined}>
              <MagicWandIcon /> IA automática
              <Tap t={t} at={3.5} />
            </button>
            <button>
              <HandIcon /> A mano
            </button>
          </div>
          <div className="rel mt-btn" style={{ transform: `scale(${pressB})` }}>
            <button className={'btn primary big block' + (t > 4.05 ? ' glow' : '')}>
              <MagicWandIcon /> Generar ficha
            </button>
            <Tap t={t} at={4.05} />
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- 6. La IA arma la ficha ----------

const CHECKS = [
  { label: 'Cómo se anota', at: 2.35 },
  { label: 'Torneos', at: 2.95 },
  { label: 'Medallas propias', at: 3.45 },
]

function Generate({ t }: { t: number }) {
  const loaderOut = ease.in(prog(t, 1.15, 1.45))
  const out = ease.in(prog(t, 7.3, 7.8))
  const done = t >= 6.25
  const press = 1 - 0.05 * Math.sin(prog(t, 6.2, 6.4) * Math.PI)
  const flash = t > 1.3 && t < 1.9 ? 1 - prog(t, 1.3, 1.9) : 0
  return (
    <div className="scene" style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.12})` }}>
      <Headline t={t} kicker={<><SparkleIcon weight="fill" /> Con IA</>} title="La app arma la ficha" top={56} size={44} />

      {t < 1.5 && (
        <div className="loader" style={{ opacity: 1 - loaderOut, transform: `scale(${lerp(0.5, 1, ease.back(prog(t, 0.05, 0.5))) * (1 - loaderOut * 0.6)})` }}>
          <div className="orbit" style={{ transform: `rotate(${t * 140}deg)` }}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} style={{ transform: `rotate(${i * 60}deg) translateY(-128px) rotate(${-i * 60 - t * 140}deg)`, opacity: 0.5 + 0.5 * Math.sin(t * 8 + i) }}>
                ✨
              </span>
            ))}
          </div>
          <SmilLogo time={0.4 + t * 1.6} size={150} />
          <p className="loader-text">Pensando el juego{'.'.repeat(1 + (Math.floor(t * 4) % 3))}</p>
        </div>
      )}
      {flash > 0 && <div className="flash" style={{ opacity: flash * 0.55 }} />}

      {t >= 1.3 && (
        <>
          <div className="checks">
            {CHECKS.map((c) => {
              const on = t >= c.at
              return (
                <span key={c.label} className={'check' + (on ? ' on' : '')} style={rise(t, 1.4, 0.4, 10)}>
                  <i style={on ? pop(t, c.at, 0.35, 0.3) : undefined}>{on ? <CheckIcon weight="bold" /> : null}</i>
                  {c.label}
                </span>
              )
            })}
          </div>

          <div className="sheet">
            <div className="sheet-head" style={pop(t, 1.45, 0.5, 0.7)}>
              <div className="sheet-cover">
                <Cover game={bang} />
              </div>
              <div className="grow">
                <div className="sheet-name">{bang.name}</div>
                <p className="muted sheet-tag">{bang.tagline}</p>
                <div className="chips">
                  <span className="pill">4–7 jugadores</span>
                  <span className="pill">Resultado final</span>
                  <span className="pill accent">✨ Hecho con IA</span>
                </div>
              </div>
            </div>

            <section className="card sheet-card" style={rise(t, 1.9, 0.4, 24)}>
              <h3>Se anota</h3>
              <div className="chips">
                {bang.events.filter((e) => !e.hidden).map((e, i) => (
                  <span key={e.id} className="pill" style={pop(t, 2.0 + i * 0.08, 0.35)}>
                    {e.emoji} {e.name}
                  </span>
                ))}
              </div>
              <div className="sheet-sub" style={rise(t, 2.45, 0.35, 10)}>
                <span className="muted small">Roles</span>
                <div className="chips">
                  {bang.roles!.map((r, i) => (
                    <span key={r} className="pill gold" style={pop(t, 2.5 + i * 0.07, 0.35)}>
                      {['⭐', '🤠', '🦹', '🃏'][i]} {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sheet-sub" style={rise(t, 2.8, 0.35, 10)}>
                <span className="muted small">Torneos</span>
                <div className="chips">
                  {['🏆 Mesas rotativas', '➕ Partida acumulada'].map((r, i) => (
                    <span key={r} className="pill live" style={pop(t, 2.85 + i * 0.08, 0.35)}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="card sheet-card medals-card" style={rise(t, 3.25, 0.4, 24)}>
              <h3>Medallas propias</h3>
              {bang.awards.map((a, r) => {
                const at = 3.4 + r * 0.62
                return (
                  <div key={a.id} className="award-row" style={rise(t, at, 0.35, 16)}>
                    <div className="award-medals">
                      {a.levels.map((_, i) => {
                        const k = prog(t, at + 0.1 + i * 0.12, at + 0.55 + i * 0.12)
                        return (
                          <span key={i} style={{ ...pop(t, at + 0.1 + i * 0.12, 0.45, 0.2), display: 'inline-block', filter: `drop-shadow(0 0 ${10 * Math.sin(k * Math.PI)}px rgba(255, 210, 77, .9))` }}>
                            <Medal family={a} level={i} size={58} />
                          </span>
                        )
                      })}
                    </div>
                    <div className="grow">
                      <b>{a.name}</b>
                      <span className="muted small block">{a.measures}</span>
                      <span className="small block levels" style={{ opacity: ease.out(prog(t, at + 0.45, at + 0.75)) }}>
                        {a.levels.map((l) => l.name).join(' · ')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </section>
          </div>

          <div className="sticky-add" style={{ transform: `translateY(${(1 - ease.out(prog(t, 5.55, 6.0))) * 160}px)` }}>
            <div className="rel" style={{ transform: `scale(${press})` }}>
              <button className={'btn big block ' + (done ? 'success' : 'primary')}>
                {done ? (
                  <span style={pop(t, 6.25, 0.4, 0.6)}>
                    <CheckIcon /> ¡Listo! Ya está en la biblioteca
                  </span>
                ) : (
                  <>
                    <CheckIcon /> Agregar a la biblioteca
                  </>
                )}
              </button>
              <Tap t={t} at={6.2} />
            </div>
          </div>
          <Confetti t={t} at={6.25} x={270} y={860} n={70} seed={3} power={1.25} />
        </>
      )}
    </div>
  )
}

// ---------- 7. Medalla desbloqueada ----------

const OUTLAW = bang.awards[0]

function Unlock({ t }: { t: number }) {
  const out = ease.in(prog(t, 2.7, 3.1))
  const lvl = t < 1.0 ? 0 : t < 1.9 ? 1 : 2
  const since = [0.1, 1.0, 1.9][lvl]
  const flip = prog(t, since, since + 0.35)
  const enter = lvl === 0 ? ease.back(prog(t, 0.1, 0.6)) : 1
  const scale = enter * (1 + 0.18 * Math.sin(flip * Math.PI))
  const l = OUTLAW.levels[lvl]
  return (
    <div className="scene" style={{ opacity: 1 - out }}>
      <div className="rays" style={{ opacity: 0.55 * ease.out(prog(t, 0, 0.6)), transform: `translate(-50%, -50%) rotate(${t * 22}deg) scale(${1 + 0.1 * lvl})` }} />
      <div className="rays-glow" style={{ background: `radial-gradient(circle, ${TIERS[lvl].main}55 0%, transparent 60%)` }} />
      <Headline t={t} at={0.05} kicker={`${OUTLAW.name} · ${bang.name}`} title="¡Medalla desbloqueada!" top={92} size={46} />
      <div className="big-medal" style={{ transform: `translate(-50%, 0) scale(${scale}) rotateY(${lvl === 0 ? 0 : (1 - ease.out(flip)) * 180}deg)` }}>
        <Medal family={OUTLAW} level={lvl} size={250} />
      </div>
      <div className="unlock-text" key={lvl} style={rise(t, since + 0.1, 0.35, 16)}>
        <div className="unlock-name">{l.name}</div>
        <div className="unlock-tier" style={{ color: TIERS[lvl].main }}>
          Nivel {TIERS[lvl].roman} · {TIERS[lvl].name}
        </div>
        <p className="muted">{l.description}</p>
      </div>
      <div className="tiers" style={rise(t, 0.4, 0.4, 14)}>
        {TIERS.map((tr, i) => (
          <span key={tr.name} className={'tier' + (i <= lvl ? ' on' : '')} style={i <= lvl ? { borderColor: tr.main === 'grad' ? '#B197FC' : tr.main, color: tr.main === 'grad' ? '#B197FC' : tr.main } : undefined}>
            {tr.name}
          </span>
        ))}
      </div>
      <Confetti t={t} at={0.35} x={270} y={430} n={36} seed={11} power={0.9} />
      <Confetti t={t} at={1.0} x={270} y={430} n={44} seed={12} />
      <Confetti t={t} at={1.9} x={270} y={430} n={80} seed={13} power={1.3} />
    </div>
  )
}

// ---------- 8. Cierre ----------

function Outro({ t }: { t: number }) {
  const from = [
    [-260, -420],
    [260, -420],
    [-260, 420],
    [260, 420],
  ]
  return (
    <div className="scene center-col outro">
      <Squares
        size={70}
        gap={11}
        place={(i) => {
          const k = ease.out(prog(t, 0.05 + i * 0.05, 0.6 + i * 0.05))
          return { opacity: clamp(k * 3), transform: `translate(${(1 - k) * from[i][0]}px, ${(1 - k) * from[i][1]}px) rotate(${(1 - k) * 200}deg)` }
        }}
      />
      <div className="wordmark" style={rise(t, 0.35, 0.5, 30)}>
        Game Board
      </div>
      <p className="outro-tag" style={rise(t, 0.65, 0.5, 20)}>
        Partidas, torneos y quién manda en cada juego.
      </p>
      <div className="chips center">
        {['🎲 Cualquier juego', '👥 Con amigos', '🏅 Medallas'].map((c, i) => (
          <span key={c} className="pill big" style={pop(t, 0.95 + i * 0.1, 0.4)}>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------- Armado ----------

function Promo({ t }: { t: number }) {
  const scene = (key: keyof typeof SCENES, El: (p: { t: number }) => ReactNode) => {
    const [start, len] = SCENES[key]
    return t >= start && t <= start + len ? <El key={key} t={t - start} /> : null
  }
  return (
    <IconContext.Provider value={{ size: '1.2em', weight: 'bold' }}>
      <div className="stage">
        <Backdrop t={t} />
        {scene('intro', Intro)}
        {scene('any', AnyGame)}
        {scene('friends', Friends)}
        {scene('rank', Ranking)}
        {scene('missing', Missing)}
        {scene('gen', Generate)}
        {scene('unlock', Unlock)}
        {scene('outro', Outro)}
      </div>
    </IconContext.Provider>
  )
}

declare global {
  interface Window {
    __seek: (t: number) => Promise<void>
    __duration: number
    __ready: boolean
  }
}

const params = new URLSearchParams(location.search)
const holder = document.getElementById('root')!
const root = createRoot(holder)
const draw = (t: number) => flushSync(() => root.render(<Promo t={t} />))

window.__duration = DURATION
window.__seek = (t) =>
  new Promise((resolve) => {
    draw(t)
    requestAnimationFrame(() => resolve())
  })

await document.fonts.load('48px "Lilita One"')
await document.fonts.ready

if (params.has('render')) {
  document.body.classList.add('rendering')
  draw(0)
} else {
  // Vista previa: la escena entra en la ventana y se reproduce en loop (o queda fija con ?t=).
  const fit = () => (holder.style.zoom = String(Math.min(innerWidth / 540, innerHeight / 960)))
  fit()
  addEventListener('resize', fit)
  if (params.has('t')) draw(Number(params.get('t')))
  else {
    const start = performance.now()
    const loop = () => {
      draw(((performance.now() - start) / 1000) % DURATION)
      requestAnimationFrame(loop)
    }
    loop()
  }
}
window.__ready = true
