import { CaretLeftIcon, CaretRightIcon, ChartBarIcon, CheckCircleIcon, CrownIcon, LockSimpleIcon, ShareNetworkIcon, SparkleIcon, TargetIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { TIERS } from '../lib/medalArt'
import { shareMedal } from '../lib/shareMedal'
import { missingLabel, type MedalFamily } from '../lib/medals'
import { Medal } from './Medal'

/** Progreso de alguien en la familia que se está mirando. */
export interface MedalHolder {
  name: string
  value: number
  /** Índice del nivel alcanzado, -1 si ninguno. */
  level: number
}

const tierOf = (i: number) => TIERS[Math.min(i, TIERS.length - 1)]

/**
 * Ficha de una medalla en grande: se abre con una animación y muestra la descripción,
 * qué hay que hacer para ganarla y cuánto falta. Con flechas se recorren los niveles.
 * `mine` es el progreso de un jugador (perfil, fin de partida); `others`, el de todo el grupo (ficha del juego).
 */
export function MedalSheet({
  family,
  level: initial,
  mine,
  others,
  celebrate,
  onClose,
}: {
  family: MedalFamily
  level: number
  /** Sin nombre, la ficha le habla a quien la mira ("llevás"). */
  mine?: Omit<MedalHolder, 'name'> & { name?: string }
  others?: MedalHolder[]
  /** Festejo de una medalla recién ganada: confeti y un botón para pasar a la siguiente. */
  celebrate?: { who: string; step: number; total: number; onNext: () => void }
  onClose: () => void
}) {
  const last = family.levels.length - 1
  const [level, setLevel] = useState(Math.min(Math.max(initial, 0), last))
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const go = (i: number) => {
    setLevel(Math.min(Math.max(i, 0), last))
    setSharing(null)
  }
  // Deslizar la medalla con el dedo para pasar de nivel.
  const [drag, setDrag] = useState<{ x0: number; dx: number } | null>(null)
  const swipe = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return
      e.currentTarget.setPointerCapture(e.pointerId)
      setDrag({ x0: e.clientX, dx: 0 })
    },
    onPointerMove: (e: React.PointerEvent) => drag && setDrag({ ...drag, dx: e.clientX - drag.x0 }),
    onPointerUp: () => {
      if (drag && Math.abs(drag.dx) > 50) go(level - Math.sign(drag.dx))
      setDrag(null)
    },
    onPointerCancel: () => setDrag(null),
  }
  // En los extremos se resiste, para que se note que no hay más niveles.
  const edge = drag && ((drag.dx > 0 && level === 0) || (drag.dx < 0 && level === last))
  const shift = drag ? drag.dx * (edge ? 0.2 : 0.6) : 0

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // En el festejo se abre sola: el foco va al diálogo para no marcar un botón ni desplazar la ficha.
    ;(celebrate ? dialogRef.current : closeRef.current)?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowLeft') go(level - 1)
    else if (e.key === 'ArrowRight') go(level + 1)
  }

  const l = family.levels[level]
  const tier = tierOf(level)
  const [sharing, setSharing] = useState<'busy' | 'downloaded' | 'error' | null>(null)
  const share = async () => {
    setSharing('busy')
    try {
      const r = await shareMedal(family, level, mine?.name)
      setSharing(r === 'downloaded' ? 'downloaded' : null)
    } catch {
      setSharing('error')
    }
  }
  const locked = mine ? mine.level < level : others ? !others.some((o) => o.level >= level) : false
  const holders = others?.filter((o) => o.level >= level).sort((a, b) => b.value - a.value)
  const closest = others?.filter((o) => o.level < level && o.value > 0).sort((a, b) => b.value - a.value)[0]

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="sheet medal-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Medalla ${l.name}`}
        style={{ ['--tier' as string]: tier.main === 'grad' ? '#B197FC' : tier.main, ['--tier-dark' as string]: tier.dark }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="row-between">
          {celebrate ? (
            <span className="ms-kicker">
              <SparkleIcon weight="fill" aria-hidden /> ¡Medalla nueva! · {celebrate.who}
            </span>
          ) : (
            <span className="medal-family">{family.name}</span>
          )}
          <button ref={closeRef} className="tool-btn" onClick={onClose} aria-label="Cerrar">
            <XIcon />
          </button>
        </div>

        <div className={'ms-stage' + (drag ? ' dragging' : '')} {...swipe}>
          <button className="ms-nav" onClick={() => go(level - 1)} disabled={level === 0} aria-label="Nivel anterior">
            <CaretLeftIcon weight="bold" />
          </button>
          {/* La key reinicia la animación de apertura en cada nivel. */}
          <div
            key={level}
            className={'ms-medal-wrap' + (locked ? ' locked' : '')}
            style={shift ? { transform: `translateX(${shift}px) rotate(${shift * 0.05}deg)` } : undefined}
          >
            <span className="ms-rays" aria-hidden />
            {celebrate && !locked && <Burst />}
            <span className="ms-medal">
              <Medal family={family} level={level} locked={locked} size={168} />
              {!locked && <span className="ms-shine" aria-hidden />}
            </span>
            {locked && (
              <span className="ms-lock" aria-hidden>
                <LockSimpleIcon weight="fill" />
              </span>
            )}
          </div>
          <button className="ms-nav" onClick={() => go(level + 1)} disabled={level === last} aria-label="Nivel siguiente">
            <CaretRightIcon weight="bold" />
          </button>
        </div>

        <div key={'t' + level} className="ms-text">
          <span className="ms-tier">
            {tier.name} · Nivel {tier.roman}
          </span>
          <h2>{l.name}</h2>
          {celebrate && <span className="ms-sub">{family.name}</span>}
          <p className="ms-desc">{l.description}</p>
        </div>

        <dl className="ms-facts">
          <Fact icon={<TargetIcon />} label="Cómo se gana" main={`Llegá a ${family.unit(l.at)}`} sub={family.measures} />

          {mine && <Progress who={mine.name} value={mine.value} target={l.at} got={mine.level >= level} unit={family.unit} />}

          {others && (
            <Fact
              icon={<CrownIcon />}
              label="En el grupo"
              main={holders?.length ? names(holders.map((h) => h.name)) : 'Nadie la tiene todavía'}
              sub={
                <>
                  {holders?.length ? (holders.length === 1 ? 'Ya la tiene.' : 'Ya la tienen.') : '¡Puede ser tuya!'}
                  {closest && (
                    <span className="block">
                      Más cerca: {closest.name}, a {l.at - closest.value} de ganarla.
                    </span>
                  )}
                </>
              }
            />
          )}
        </dl>

        {mine && !locked && !celebrate && (
          <div className="ms-share">
            <button className="btn block" onClick={share} disabled={sharing === 'busy'}>
              <ShareNetworkIcon /> {sharing === 'busy' ? 'Armando la imagen…' : 'Compartir medalla'}
            </button>
            {sharing === 'downloaded' && <p className="muted small">Listo: se descargó la imagen para que la mandes.</p>}
            {sharing === 'error' && <p className="error small">No se pudo armar la imagen. Probá de nuevo.</p>}
          </div>
        )}

        {celebrate && (
          <div className="ms-next">
            <button className="btn big" onClick={share} disabled={sharing === 'busy'} aria-label="Compartir medalla" title="Compartir medalla">
              <ShareNetworkIcon />
            </button>
            <button className="btn primary big grow" onClick={celebrate.onNext}>
              {celebrate.step < celebrate.total ? `Siguiente medalla (${celebrate.step}/${celebrate.total})` : '¡Genial!'}
            </button>
          </div>
        )}
        {celebrate && sharing === 'downloaded' && <p className="muted small ms-note">Listo: se descargó la imagen para que la mandes.</p>}
        {celebrate && sharing === 'error' && <p className="error small ms-note">No se pudo armar la imagen. Probá de nuevo.</p>}

        <ol className="ms-levels" aria-label="Niveles">
          {family.levels.map((x, i) => {
            const got = mine ? mine.level >= i : others ? others.some((o) => o.level >= i) : true
            return (
              <li key={x.name}>
                <button
                  className={'ms-level' + (i === level ? ' active' : '')}
                  onClick={() => go(i)}
                  aria-pressed={i === level}
                  aria-label={`${tierOf(i).name}: ${x.name}`}
                >
                  <Medal family={family} level={i} locked={!got} size={40} />
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

const BURST_COLORS = ['var(--tier)', '#ffb400', '#ff6b35', '#22c55e', '#3b82f6', '#ec4899']

/** Estallido de papelitos desde la medalla (distribución fija, sin Math.random en el render). */
function Burst() {
  return (
    <span className="ms-burst" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <i
          key={i}
          style={{
            ['--a' as string]: `${(i * 360) / 22 + ((i * 7) % 11)}deg`,
            ['--d' as string]: `${110 + ((i * 29) % 60)}px`,
            ['--r' as string]: `${(i * 97) % 360}deg`,
            background: BURST_COLORS[i % BURST_COLORS.length],
            animationDelay: `${0.5 + ((i * 3) % 5) / 40}s`,
          }}
        />
      ))}
    </span>
  )
}

/** "Ana", "Ana y Beto", "Ana, Beto y Caro", "Ana, Beto, Caro y 2 más". */
function names(list: string[]): string {
  if (list.length <= 1) return list.join('')
  if (list.length > 4) return `${list.slice(0, 3).join(', ')} y ${list.length - 3} más`
  return `${list.slice(0, -1).join(', ')} y ${list[list.length - 1]}`
}

/** Un dato de la ficha: ícono, etiqueta chica, lo importante y una aclaración. */
function Fact({ icon, label, main, sub, tone, children }: { icon: ReactNode; label: string; main: ReactNode; sub?: ReactNode; tone?: 'win'; children?: ReactNode }) {
  return (
    <div className={'ms-fact' + (tone ? ' ' + tone : '')}>
      <span className="ms-fact-icon" aria-hidden>
        {icon}
      </span>
      <div className="ms-fact-body">
        <dt>{label}</dt>
        <dd>
          <span className="ms-fact-main">{main}</span>
          {children}
          {sub && <span className="ms-fact-sub">{sub}</span>}
        </dd>
      </div>
    </div>
  )
}

function Progress({ who, value, target, got, unit }: { who?: string; value: number; target: number; got: boolean; unit: (n: number) => string }) {
  const missing = target - value
  const label = who ? `Progreso de ${who}` : 'Tu progreso'
  if (got) {
    return <Fact icon={<CheckCircleIcon weight="fill" />} tone="win" label={label} main={who ? 'La ganó' : '¡La ganaste!'} sub={`Lleva${who ? '' : 's'} ${unit(value)}.`} />
  }
  return (
    <Fact
      icon={<ChartBarIcon />}
      label={label}
      main={
        <>
          {missingLabel({ unit }, missing)}
          <span className="ms-count">
            {value}/{target}
          </span>
        </>
      }
      sub={`Lleva${who ? '' : 's'} ${unit(value)} hasta ahora.`}
    >
      <span className="medal-bar ms-bar" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.min(value, target)} aria-label={label}>
        <i style={{ width: `${Math.round(Math.min(1, Math.max(0, value / target)) * 100)}%` }} />
      </span>
    </Fact>
  )
}
