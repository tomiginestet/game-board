import { useEffect, useRef, useState } from 'react'
import { cheerFor, type Outcome } from '../lib/cheers'
import type { GameDef } from '../lib/games/schema'
import { logoAnimation, type LogoKind } from '../lib/logo'
import type { MedalProgress } from '../lib/medals'
import type { Id, Play, Player } from '../lib/types'
import { TeamAvatar } from './Avatar'
import { sideName, sidePlayersOf } from './GameBits'
import { spokenNames } from '../pages/play/winnerText'
import { Logo } from './Logo'
import { Medal } from './Medal'
import '../styles/celebration.css'

/** Cuántas caras se muestran como mucho cuando el resultado es de todos (empate, cooperativo). */
const MAX_FACES = 6
/** Qué fracción del ciclo del logo se ve antes de quedar quieto en el cuadro del ganador. */
const LOGO_LEAD = 0.4

const joinNames = (names: string[]) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`)

/**
 * Arranque del resumen de una partida: quién ganó, en grande, con el logo del podio (el cuadradito
 * dorado es el ganador) y una frase de la casa. Es el h1 de la pantalla y se anuncia una vez.
 */
export function WinnerHero({
  play,
  game,
  players,
  fresh,
  hint,
}: {
  play: Play
  game: GameDef
  players: Map<Id, Player>
  /** Recién terminada: se anima la entrada y se anuncia el resultado. Si no, aparece quieta. */
  fresh: boolean
  /** Próxima medalla de alguien de la mesa, cuando en esta partida no cayó ninguna (las nuevas van debajo del podio). */
  hint?: { text: string; progress: MedalProgress }
}) {
  const places = play.result?.places ?? []
  const coop = play.result?.coopWin
  const sides = play.sides.map((_, i) => i)
  const winners = sides.filter((i) => places[i] === 1)
  const draw = coop === undefined && sides.length > 1 && winners.length === sides.length
  const lowWins = !!game.scoring.lowWins
  const hasScores = !!play.result?.scores?.some((s) => s !== null && s !== undefined)

  let outcome: Outcome
  let title: string
  let verdict = ''
  let faces: Player[][]
  let kind: LogoKind | undefined
  if (coop !== undefined) {
    outcome = coop ? 'coopWin' : 'coopLoss'
    title = coop ? '¡Ganaron todos!' : 'Perdieron contra el juego'
    // En cooperativo es un solo equipo: cada cara por separado.
    faces = sides.flatMap((i) => sidePlayersOf(play.sides[i], players).map((p) => [p]))
    kind = coop ? 'medalla' : undefined
  } else if (draw || !winners.length) {
    outcome = 'draw'
    title = 'Empate'
    verdict = `entre ${joinNames(sides.map((i) => sideName(play.sides[i], players)))}`
    faces = sides.map((i) => sidePlayersOf(play.sides[i], players))
  } else {
    // Con tiempos (carreras), gana el más rápido: festejo normal, no el del puntaje bajo.
    outcome = lowWins && !game.scoring.time ? 'lowWin' : 'win'
    // Igual que en la pausa del punto final: 'Ana y Beto', no 'Ana & Beto'.
    title = joinNames(winners.flatMap((i) => spokenNames(play.sides[i], players)))
    const many = winners.length > 1 || play.sides[winners[0]].players.length > 1 || !!play.sides[winners[0]].name
    verdict = winners.length > 1 ? 'comparten el primer puesto' : many ? 'ganaron la partida' : 'ganó la partida'
    if (lowWins && hasScores) verdict += game.scoring.time ? ' con el mejor tiempo' : ' con el puntaje más bajo'
    faces = winners.map((i) => sidePlayersOf(play.sides[i], players))
    kind = 'podio'
  }
  const cheer = cheerFor(outcome, play.id)
  const shownFaces = faces.slice(0, MAX_FACES)
  const extra = faces.length - shownFaces.length
  const faceSize = faces.length === 1 ? 56 : 40

  // El logo arranca ya en movimiento (sin la pausa inicial del ciclo), llega al cuadro del ganador
  // en unos dos segundos y se queda ahí. Con movimiento reducido, Logo ya muestra ese cuadro fijo.
  const logoWrap = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const svg = logoWrap.current?.querySelector('svg')
    if (!svg || !kind) return
    const { dur, still } = logoAnimation(kind)
    const freeze = () => {
      svg.pauseAnimations()
      svg.setCurrentTime(dur * still)
    }
    if (!fresh || matchMedia('(prefers-reduced-motion: reduce)').matches) return freeze()
    const lead = Math.min(LOGO_LEAD, still)
    svg.setCurrentTime(dur * (still - lead))
    const t = setTimeout(freeze, dur * lead * 1000)
    return () => clearTimeout(t)
  }, [kind, fresh])

  // Una sola vez, y sólo al terminarla: con el contenido ya puesto, para que el lector lo diga.
  const [announce, setAnnounce] = useState('')
  // Se anuncia lo del primer momento; si después cambia algo (por ejemplo, al corregir), no se repite.
  const [spoken] = useState(() => `${title}${verdict ? ' ' + verdict : ''}${/[!?]$/.test(title) && !verdict ? '' : '.'} ${cheer}`)
  useEffect(() => {
    if (!fresh) return
    const t = setTimeout(() => setAnnounce(spoken), 150)
    return () => clearTimeout(t)
  }, [fresh, spoken])

  return (
    <div className={`winner-hero winner-${outcome}${fresh ? ' is-fresh' : ''}`}>
      <div className="winner-stage" aria-hidden="true">
        <span ref={logoWrap} className="winner-logo">
          <Logo kind={kind} size={72} />
        </span>
        <span className="winner-faces">
          {shownFaces.map((team, k) => (
            <TeamAvatar key={k} team={team} size={faceSize} />
          ))}
          {extra > 0 && <span className="winner-more num">+{extra}</span>}
        </span>
      </div>

      <h1 className="winner-title">
        <span className={'winner-name' + (title.length > 18 ? ' is-long' : '')}>{title}</span>
        {verdict && <span className="winner-verdict"> {verdict}</span>}
      </h1>
      <p className="winner-cheer">{cheer}</p>

      {hint && (
        <p className="winner-next">
          <Medal family={hint.progress.family} level={hint.progress.level + 1} size={36} />
          <span>{hint.text}</span>
        </p>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}
