import { ArrowLeftIcon, SignInIcon, StorefrontIcon, UsersIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { ErrorText } from '../../components/Feedback'
import { GameBadge } from '../../components/GameBits'
import { Logo } from '../../components/Logo'
import { MedalSheet } from '../../components/MedalSheet'
import { MEMBERSHIP_FAMILY } from '../../lib/medals'
import { linkClub, setGuest, useAuth } from '../../lib/auth'
import { savePendingInvite } from '../../lib/pendingInvite'
import { allGames, findGame } from '../../lib/games'
import type { GameDef } from '../../lib/games/schema'
import { plural, UNKNOWN_PLAYER } from '../../lib/hooks'
import { ensureMyPlayer, findClubCard, refreshGroups, switchToGroup, useMyGroups, type ClubCard } from '../../lib/social'
import { computeBoard, levelFor } from '../../lib/stats'
import { fetchClubSnapshot, normalizeCode } from '../../lib/sync'
import { friendlyError } from '../../lib/text'
import type { AppData } from '../../lib/types'
import { ClubPage } from '../ClubPage'
import { playPath } from '../GameDetail'
import { skin } from '../../skins'
import { say } from '../../skins/say'

type Target = { code: string } | { slug: string }

/** El club de un link: `undefined` mientras se busca, `null` si no existe. */
function useClubCard(target: Target): { card: ClubCard | null | undefined; error: string } {
  const key = 'code' in target ? `code:${normalizeCode(target.code)}` : `slug:${target.slug}`
  const [result, setResult] = useState<{ key: string; card?: ClubCard | null; error?: string } | null>(null)
  useEffect(() => {
    let cancelled = false
    const t: Target = key.startsWith('code:') ? { code: key.slice(5) } : { slug: key.slice(5) }
    findClubCard(t)
      .then((card) => !cancelled && setResult({ key, card }))
      .catch((e) => !cancelled && setResult({ key, error: friendlyError(e) }))
    return () => {
      cancelled = true
    }
  }, [key])
  if (result?.key !== key) return { card: undefined, error: '' }
  return { card: result.error ? null : (result.card ?? null), error: result.error ?? '' }
}

/** `/c/:slug`: el link corto de la tarjeta del bar. */
export function ShortLinkRoute() {
  const { slug = '' } = useParams()
  return <ClubInvite key={slug} target={{ slug: slug.toLowerCase() }} />
}

/** `/unirse/:code`: el link de invitación de siempre. */
export function InviteRoute() {
  const { code = '' } = useParams()
  return <ClubInvite key={code} target={{ code }} />
}

/**
 * Invitación a un club (por link o por QR): el club, su ranking y cómo sumarse.
 * - Con cuenta: un toque y adentro. Si el link trae un juego (`?juego=pingpong`, el QR de una mesa), se va a anotar.
 * - Sin cuenta: `onLogin` lleva a entrar y, al volver, se suma. En un club común también se puede seguir sin
 *   cuenta, con el club en este teléfono; en un club de lugar se anota con cuenta.
 */
export function ClubInvite({ target, onLogin, standalone }: { target: Target; onLogin?: (code: string) => void; standalone?: boolean }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { groups } = useMyGroups()
  const { card, error: findError } = useClubCard(target)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Recién sumado: primero se festeja la medalla de socio (el carnet nuevo) y después se entra.
  const [welcome, setWelcome] = useState(false)
  const mine = card ? groups?.find((g) => g.code === card.code) : undefined
  const gameId = params.get('juego') ?? undefined
  const game = gameId ? findGame({ games: [] }, gameId) : undefined

  const goInside = async (code: string, isVenue: boolean) => {
    const list = await refreshGroups()
    const g = list.find((x) => x.code === code)
    if (g) await switchToGroup(g)
    // En un club de lugar cada uno ya tiene su jugador: se va directo al carnet nuevo.
    navigate(game ? playPath(game) : isVenue ? '/perfil#carnet' : '/perfil#yo', { replace: true })
  }

  const join = async () => {
    if (!card) return
    setBusy(true)
    setError('')
    try {
      if (!mine) {
        await linkClub(card.code)
        // En un club de lugar nadie conoce a nadie: cada cuenta entra con su jugador, sin elegir "quién sos".
        if (card.venue) await ensureMyPlayer(card.code)
        setWelcome(true)
        return
      }
      await goInside(card.code, !!card.venue)
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  if (card === undefined) {
    return (
      <div className="page">
        <p className="muted">Buscando el club…</p>
      </div>
    )
  }

  if (card === null) {
    return (
      <div className="page">
        {standalone && <BrandBar />}
        <h1>Club</h1>
        <div className="card warn">
          {findError || ('slug' in target ? 'Ese link no corresponde a ningún club. Revisá que esté bien escrito.' : 'El link no corresponde a ningún club. Revisá que esté completo.')}
        </div>
        {!standalone && (
          <Link to="/" className="back mt">
            <ArrowLeftIcon /> Inicio
          </Link>
        )}
      </div>
    )
  }

  // Sin cuenta, en un club común: el club queda en este teléfono (la pantalla de siempre).
  if (!auth.session && !onLogin && !card.venue && 'code' in target) return <ClubPage inviteCode={card.code} />
  if (!auth.session && !onLogin && !card.venue && 'slug' in target) return <Navigate to={`/unirse/${card.code}`} replace />

  // Sin cuenta: se guarda la invitación y se va a entrar (en modo sin cuenta, saliendo de ese modo).
  const login = () => {
    savePendingInvite(`/unirse/${card.code}${gameId ? `?juego=${encodeURIComponent(gameId)}` : ''}`)
    if (onLogin) onLogin(card.code)
    else setGuest(false)
  }

  const action = mine ? (game ? `Anotar ${game.name}` : 'Ir al club') : 'Sumarme al club'

  return (
    <div className="page">
      {standalone && <BrandBar />}
      <header className="card club-hero invite-hero">
        <div className="club-hero-top">
          <span className="group-emoji huge" aria-hidden>
            {card.emoji ?? (card.venue ? '🏓' : '🎲')}
          </span>
          <div className="club-hero-title">
            <p className="invite-kicker">{mine ? 'Ya sos parte' : card.venue ? 'Club de un lugar' : 'Te invitaron'}</p>
            <h1>{card.name}</h1>
            <p className="club-meta">
              {card.venue ? (
                <span>
                  <StorefrontIcon aria-hidden /> {card.venue.address || 'Bar, club o cancha'}
                </span>
              ) : null}
              {card.members > 0 && (
                <span>
                  <UsersIcon aria-hidden /> {plural(card.members, 'integrante', 'integrantes')}
                </span>
              )}
            </p>
          </div>
        </div>
        {card.description && <p className="club-desc">{card.description}</p>}
        {game && !mine && <p className="invite-game">{say('Después de sumarte, anotás la partida de {juego}.', { juego: game.name })}</p>}
        {auth.session ? (
          <button className="btn primary big block" disabled={busy} onClick={join}>
            <SignInIcon /> {busy ? 'Un momento…' : action}
          </button>
        ) : (
          <>
            <button className="btn primary big block" onClick={login}>
              <SignInIcon /> Sumarme al club
            </button>
            <p className="muted small">
              {card.venue
                ? say('Entrás con Google o con tu mail. Así cada partida queda a tu nombre y nadie anota por vos.')
                : 'Entrás con Google o con tu mail y quedás en el club desde cualquier teléfono.'}
            </p>
            {!card.venue && (
              <button className="btn block" onClick={() => setGuest(true)}>
                Seguir sin cuenta en este teléfono
              </button>
            )}
          </>
        )}
        <ErrorText>{error}</ErrorText>
      </header>

      {welcome && (
        <MedalSheet
          family={MEMBERSHIP_FAMILY}
          level={0}
          celebrate={{ who: card.name, step: 1, total: 1, onNext: () => void goInside(card.code, !!card.venue) }}
          onClose={() => void goInside(card.code, !!card.venue)}
        />
      )}

      <ClubRankingPreview code={card.code} venueGames={card.venue?.games ?? []} focusGame={gameId} />

      {!standalone && (
        <Link to="/" className="back">
          <ArrowLeftIcon /> Inicio
        </Link>
      )}
    </div>
  )
}

function BrandBar() {
  return (
    <div className="invite-brand">
      <Logo size={28} /> {skin.name}
    </div>
  )
}

/** Quién manda en cada juego del club, con los datos bajados en el momento (no se guardan en el teléfono). */
export function ClubRankingPreview({ code, venueGames, focusGame }: { code: string; venueGames: string[]; focusGame?: string }) {
  const [state, setState] = useState<{ code: string; data?: AppData; error?: string } | null>(null)
  useEffect(() => {
    let cancelled = false
    fetchClubSnapshot(code)
      .then((data) => !cancelled && setState({ code, data }))
      .catch((e) => !cancelled && setState({ code, error: friendlyError(e) }))
    return () => {
      cancelled = true
    }
  }, [code])
  const data = state?.code === code ? state.data : undefined
  const board = useMemo(() => (data ? computeBoard(data) : undefined), [data])

  // Los juegos del lugar primero (aunque no se hayan jugado), después los más jugados.
  const games = useMemo(() => {
    if (!data || !board) return [] as { game: GameDef; plays: number }[]
    const count = new Map<string, number>()
    for (const v of board.views) count.set(v.gameId, (count.get(v.gameId) ?? 0) + 1)
    const catalog = allGames(data)
    const ids = [...venueGames, ...[...count.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)]
    const seen = new Set<string>()
    const out: { game: GameDef; plays: number }[] = []
    for (const id of ids) {
      const game = catalog.find((g) => g.id === id)
      if (!game || seen.has(id)) continue
      seen.add(id)
      out.push({ game, plays: count.get(id) ?? 0 })
    }
    return out
  }, [data, board, venueGames])

  const [picked, setPicked] = useState<string | undefined>(focusGame)
  // Si el link no pide un juego, el más jugado del lugar (o el más jugado del club).
  const current = games.find((g) => g.game.id === picked) ?? games.find((g) => g.plays > 0) ?? games[0]

  if (state?.code === code && state.error) return <ErrorText>{state.error}</ErrorText>
  if (!data || !board) return <p className="muted">{say('Cargando el ranking…')}</p>
  if (!games.length) {
    return (
      <section className="invite-ranking">
        <h2>{say('Ranking')}</h2>
        <div className="empty">{say('Todavía no hay partidas anotadas. La primera que anoten arma la tabla.')}</div>
      </section>
    )
  }

  const players = new Map(data.players.map((p) => [p.id, p]))
  const rows = current
    ? [...board.players.values()]
        .map((s) => s.perGame.get(current.game.id))
        .filter((x) => !!x && x.played > 0)
        .sort((a, b) => b!.elo - a!.elo)
        .slice(0, 10)
    : []

  return (
    <section className="invite-ranking" aria-labelledby="invite-ranking-title">
      <h2 id="invite-ranking-title">Quién manda</h2>
      {games.length > 1 && (
        <div className="chips scroll">
          {games.map(({ game }) => (
            <button key={game.id} className={'chip' + (current?.game.id === game.id ? ' active' : '')} aria-pressed={current?.game.id === game.id} onClick={() => setPicked(game.id)}>
              {game.name}
            </button>
          ))}
        </div>
      )}
      {current && (
        <div className="invite-game-head">
          <GameBadge game={current.game} size={36} />
          <span>
            <b className="block">{current.game.name}</b>
            <span className="muted small">{current.plays ? plural(current.plays, say('partida anotada'), say('partidas anotadas')) : say('Sin partidas todavía')}</span>
          </span>
        </div>
      )}
      {rows.length ? (
        <div className="list ranking rank-table">
          <div className="rank-head" aria-hidden>
            <span>#</span>
            <span />
            <span>Jugador</span>
            <span>V–D</span>
            <span>Elo</span>
          </div>
          {rows.map((s, i) => {
            const p = players.get(s!.playerId) ?? UNKNOWN_PLAYER
            return (
              <div key={p.id} className={'rank-row' + (i === 0 ? ' first' : '')}>
                <span className="rank-pos">{i + 1}</span>
                <Avatar player={p} size={32} />
                <span className="rank-who">
                  <b>{p.name}</b>
                  <span className="muted small block">{levelFor(s!.elo).name}</span>
                </span>
                <span className="rank-mid">
                  {s!.wins}–{s!.losses}
                </span>
                <span className="rank-value">{s!.elo}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty">Nadie jugó al {current?.game.name.toLowerCase()} todavía. El primero que gane arranca arriba.</div>
      )}
      <p className="hint">Ordenado por Elo: sube más si le ganás a alguien mejor.</p>
    </section>
  )
}
