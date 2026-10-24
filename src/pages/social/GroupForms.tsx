import { CaretDownIcon, CaretUpIcon, CheckIcon, GlobeHemisphereWestIcon, StorefrontIcon, XIcon, HourglassIcon, LockSimpleIcon, MagnifyingGlassIcon, SparkleIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { ReportButton } from '../../components/ReportButton'
import { cancelJoinRequest, createGroup, requestJoin, searchGroups, setClubVenue, updateGroup, type FoundGroup, type MyGroup, type Venue } from '../../lib/social'
import { allGames } from '../../lib/games'
import { GameBadge } from '../../components/GameBits'
import { useData } from '../../lib/store'
import { useSyncState } from '../../lib/sync'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'
import { EmojiPicker } from '../../components/PlayerForm'
import { ChoiceGroup } from '../../components/PlayerPicker'
import { say } from '../../skins/say'

const GROUP_EMOJIS = ['🎲', '🔥', '🃏', '🏓', '🍕', '🧉', '🏆', '🎉', '👾', '🦁', '🐙', '🌮', '♟️', '🚀', '🍻', '⚽']

/** Formulario para crear (o editar) un club. */
export function GroupForm({ initial, onDone }: { initial?: MyGroup; onDone: (g?: MyGroup) => void }) {
  const data = useData()
  const sync = useSyncState()
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? GROUP_EMOJIS[0])
  const [isPublic, setIsPublic] = useState(initial?.is_public ?? false)
  // Sólo los datos sin club son "de este teléfono": los de un club activo son de ese club y no se copian al nuevo.
  const hasLocal = !initial && !sync.club && data.players.length + data.plays.length + data.matches.length + data.cups.length + data.games.length > 0
  const [importLocal, setImportLocal] = useState(hasLocal)
  // Club de un lugar: sólo si el servidor ya lo maneja (`venue` viene en los grupos, aunque sea null).
  const venueSupported = !initial || initial.venue !== undefined
  const [isVenue, setIsVenue] = useState(!!initial?.venue)
  const [address, setAddress] = useState(initial?.venue?.address ?? '')
  const [venueGames, setVenueGames] = useState<string[]>(initial?.venue?.games ?? [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  return (
    <form
      className="card group-form"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        setBusy(true)
        setError('')
        try {
          const venue: Venue | null = isVenue ? { address: address.trim() || null, games: venueGames } : null
          const venueChanged = JSON.stringify(venue) !== JSON.stringify(initial?.venue ? { address: initial.venue.address || null, games: initial.venue.games } : null)
          if (initial) {
            await updateGroup(initial.code, { name: name.trim(), description, emoji, isPublic })
            if (venueSupported && venueChanged) await setClubVenue(initial.code, venue)
            onDone()
          } else {
            const g = await createGroup({ name: name.trim(), description, emoji, isPublic, importLocal: hasLocal && importLocal })
            if (venue) await setClubVenue(g.code, venue)
            onDone(g)
          }
        } catch (err) {
          setError(friendlyError(err))
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="player-form-top">
        <span className="group-emoji big" aria-hidden>
          {emoji}
        </span>
        <label className="field grow">
          <span className="field-label">Nombre del club</span>
          <input className="input" placeholder="Los del asado" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        </label>
      </div>
      <EmojiPicker label="Emoji del club" options={GROUP_EMOJIS} value={emoji} onChange={setEmoji} />
      <label className="field">
        <span className="field-label">Descripción corta (opcional)</span>
        <textarea className="input" rows={2} maxLength={200} placeholder="Truco los viernes en lo de Juli" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <ChoiceGroup
        className="segmented mt"
        label="Quién puede encontrar el club"
        value={isPublic}
        onChange={setIsPublic}
        options={[
          {
            value: false,
            content: (
              <>
                <LockSimpleIcon /> Privado
              </>
            ),
          },
          {
            value: true,
            content: (
              <>
                <GlobeHemisphereWestIcon /> Público
              </>
            ),
          },
        ]}
      />
      <p className="muted small">
        {isPublic
          ? 'Aparece en el buscador. Quien quiera entrar te pide permiso y vos (o un admin) lo aceptás.'
          : 'No aparece en el buscador. Se entra sólo por invitación o con el link.'}
      </p>
      {venueSupported && (
        <>
          <label className="check-row mt">
            <input type="checkbox" checked={isVenue} onChange={(e) => setIsVenue(e.target.checked)} />
            <span>
              <StorefrontIcon aria-hidden /> Es el club de un lugar (un bar, un club, un complejo de canchas)
            </span>
          </label>
          {isVenue && <VenueFields address={address} onAddress={setAddress} games={venueGames} onGames={setVenueGames} />}
        </>
      )}
      {hasLocal && (
        <label className="check-row">
          <input type="checkbox" checked={importLocal} onChange={(e) => setImportLocal(e.target.checked)} />
          <span>{say('Sumar al club los jugadores y partidas que ya cargaste en este teléfono')}</span>
        </label>
      )}
      <ErrorText>{error}</ErrorText>
      <button className="btn primary block" disabled={busy || !name.trim()}>
        {initial ? (
          busy ? 'Guardando…' : 'Guardar cambios'
        ) : (
          <>
            <SparkleIcon /> {busy ? 'Creando…' : 'Crear club'}
          </>
        )}
      </button>
    </form>
  )
}

/** Buscador de clubes públicos, con el botón para pedir unirse. */
export function GroupSearch({ onOpenMine }: { onOpenMine?: (groupId: string) => void }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<FoundGroup[] | null>(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const t = setTimeout(() => {
      searchGroups(q)
        .then((r) => !cancelled && (setResults(r), setError('')))
        .catch((e) => !cancelled && setError(friendlyError(e)))
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [q])

  const act = async (g: FoundGroup) => {
    setBusyId(g.id)
    setError('')
    try {
      if (g.my_status === 'pending') await cancelJoinRequest(g.id)
      else await requestJoin(g.id)
      setResults((r) => r?.map((x) => (x.id === g.id ? { ...x, my_status: g.my_status === 'pending' ? null : 'pending' } : x)) ?? null)
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="group-search">
      <label className="search">
        <MagnifyingGlassIcon />
        <input className="input" placeholder="Buscar clubes públicos…" aria-label="Buscar clubes públicos" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <ErrorText>{error}</ErrorText>
      {results === null && !error && <p className="muted">Buscando…</p>}
      {results?.length === 0 && <div className="empty">{q ? `No hay clubes públicos con “${q}”. Probá con otra palabra.` : 'Todavía no hay clubes públicos.'}</div>}
      <div className="list">
        {results?.map((g) => (
          <div key={g.id} className="card group-row">
            <span className="group-emoji" aria-hidden>
              {g.emoji ?? '🎲'}
            </span>
            <span className="grow">
              <b className="block ellipsis">{g.name}</b>
              {g.description && <span className="muted small block clamp-2">{g.description}</span>}
              <span className="muted small">
                <UsersThreeIcon className="inline-icon" /> {g.members} {g.members === 1 ? 'integrante' : 'integrantes'}
              </span>
            </span>
            {g.my_status !== 'member' && <ReportButton target={{ kind: 'group', group_id: g.id }} name={g.name} />}
            {g.my_status === 'member' ? (
              <button className="btn small" onClick={() => onOpenMine?.(g.id)}>
                <CheckIcon /> Sos parte
              </button>
            ) : (
              <button className={'btn small' + (g.my_status === 'pending' ? '' : ' primary')} disabled={busyId === g.id} onClick={() => act(g)}>
                {g.my_status === 'pending' ? (
                  <>
                    <HourglassIcon /> Pedido
                  </>
                ) : (
                  'Pedir unirme'
                )}
              </button>
            )}
          </div>
        ))}
      </div>
      {results?.some((g) => g.my_status === 'pending') && <p className="muted small">Te avisamos cuando te acepten. Tocá “Pedido” para cancelar la solicitud.</p>}
    </div>
  )
}

/** Los juegos que suele tener un bar, para elegir rápido. */
const BAR_GAMES = ['pingpong', 'pool', 'metegol', 'dardos', 'bowling', 'sapo', 'tejo', 'beerpong', 'cornhole', 'truco', 'generala', 'jenga']

const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

/** Dirección y juegos del lugar. */
function VenueFields({ address, onAddress, games, onGames }: { address: string; onAddress: (v: string) => void; games: string[]; onGames: (v: string[]) => void }) {
  return (
    <div className="venue-fields">
      <p className="muted small">
        {say('En un club de lugar se anota con cuenta, así cada partida queda a nombre de quien la jugó. Los juegos del lugar salen primero al anotar y en el ranking.')}
      </p>
      <label className="field">
        <span className="field-label">Dirección (opcional)</span>
        <input className="input" maxLength={120} placeholder="Av. Corrientes 1234, CABA" value={address} onChange={(e) => onAddress(e.target.value)} />
      </label>
      <GamePicker label={say('Juegos del lugar')} games={games} onGames={onGames} suggestions={BAR_GAMES} />
    </div>
  )
}

/**
 * Elegir juegos (del lugar o del club): los elegidos, en orden, con un buscador y sugerencias para sumar.
 * `suggestions`: ids que se ofrecen mientras no se busca nada.
 */
export function GamePicker({ label, games, onGames, suggestions, max = 24 }: { label: string; games: string[]; onGames: (v: string[]) => void; suggestions: string[]; max?: number }) {
  const data = useData()
  const catalog = allGames(data)
  const [q, setQ] = useState('')
  const picked = games.map((id) => catalog.find((g) => g.id === id)).filter((g) => !!g)
  const query = norm(q)
  const full = games.length >= max
  const options = (query ? catalog.filter((g) => norm(g.name).includes(query)) : suggestions.map((id) => catalog.find((g) => g.id === id)).filter((g) => !!g))
    .filter((g) => !games.includes(g.id))
    .slice(0, 12)
  const move = (i: number, by: number) => {
    const next = [...games]
    ;[next[i], next[i + by]] = [next[i + by], next[i]]
    onGames(next)
  }
  return (
    <>
      <div className="field">
        <span className="field-label" id="picked-games-label">
          {label}
        </span>
        {picked.length > 0 ? (
          <ul className="venue-games" aria-labelledby="picked-games-label">
            {picked.map((g, i) => (
              <li key={g.id}>
                <GameBadge game={g} size={24} /> <span className="grow ellipsis">{g.name}</span>
                {picked.length > 1 && (
                  <>
                    <button type="button" className="tool-btn small" aria-label={`Subir ${g.name}`} disabled={i === 0} onClick={() => move(i, -1)}>
                      <CaretUpIcon />
                    </button>
                    <button type="button" className="tool-btn small" aria-label={`Bajar ${g.name}`} disabled={i === picked.length - 1} onClick={() => move(i, 1)}>
                      <CaretDownIcon />
                    </button>
                  </>
                )}
                <button type="button" className="tool-btn small" aria-label={`Sacar ${g.name}`} onClick={() => onGames(games.filter((id) => id !== g.id))}>
                  <XIcon />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted small">Todavía no elegiste ninguno.</p>
        )}
      </div>
      {full ? (
        <p className="muted small">{say('Ya elegiste {max}: sacá alguno para sumar otro.', { max })}</p>
      ) : (
        <>
          <label className="search">
            <MagnifyingGlassIcon aria-hidden />
            <input className="input" placeholder={say('Buscar otro juego')} value={q} onChange={(e) => setQ(e.target.value)} aria-label={say('Buscar juego para sumar')} />
          </label>
          <div className="chips">
            {options.map((g) => (
              <button
                key={g.id}
                type="button"
                className="chip"
                onClick={() => {
                  onGames([...games, g.id])
                  setQ('')
                }}
              >
                + {g.name}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
