import { CheckIcon, GlobeHemisphereWestIcon, HourglassIcon, LockSimpleIcon, MagnifyingGlassIcon, SparkleIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { cancelJoinRequest, createGroup, requestJoin, searchGroups, updateGroup, type FoundGroup, type MyGroup } from '../../lib/social'
import { useData } from '../../lib/store'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'

export const GROUP_EMOJIS = ['🎲', '🔥', '🃏', '🏓', '🍕', '🧉', '🏆', '🎉', '👾', '🦁', '🐙', '🌮', '♟️', '🚀', '🍻', '⚽']

/** Formulario para crear (o editar) un grupo. */
export function GroupForm({ initial, onDone }: { initial?: MyGroup; onDone: (g?: MyGroup) => void }) {
  const data = useData()
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? GROUP_EMOJIS[0])
  const [isPublic, setIsPublic] = useState(initial?.is_public ?? false)
  const hasLocal = !initial && data.players.length + data.plays.length + data.matches.length + data.cups.length + data.games.length > 0
  const [importLocal, setImportLocal] = useState(hasLocal)
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
          if (initial) {
            await updateGroup(initial.code, { name: name.trim(), description, emoji, isPublic })
            onDone()
          } else {
            onDone(await createGroup({ name: name.trim(), description, emoji, isPublic, importLocal: hasLocal && importLocal }))
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
        <input className="input" placeholder="Nombre del club (Los del asado)" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} aria-label="Nombre del club" />
      </div>
      <div className="emoji-grid">
        {GROUP_EMOJIS.map((em) => (
          <button key={em} type="button" className={'emoji-btn' + (em === emoji ? ' active' : '')} onClick={() => setEmoji(em)}>
            {em}
          </button>
        ))}
      </div>
      <textarea
        className="input"
        rows={2}
        maxLength={200}
        placeholder="Descripción corta (opcional): qué juegan, dónde, cuándo…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Descripción"
      />
      <div className="segmented mt">
        <button type="button" className={!isPublic ? 'active' : ''} onClick={() => setIsPublic(false)}>
          <LockSimpleIcon /> Privado
        </button>
        <button type="button" className={isPublic ? 'active' : ''} onClick={() => setIsPublic(true)}>
          <GlobeHemisphereWestIcon /> Público
        </button>
      </div>
      <p className="muted small">
        {isPublic
          ? 'Aparece en el buscador. Quien quiera entrar te pide permiso y vos (o un admin) lo aceptás.'
          : 'No aparece en el buscador. Se entra sólo por invitación o con el link.'}
      </p>
      {hasLocal && (
        <label className="check-row">
          <input type="checkbox" checked={importLocal} onChange={(e) => setImportLocal(e.target.checked)} />
          <span>Sumar al club los jugadores y partidas que ya cargaste en este teléfono</span>
        </label>
      )}
      <ErrorText>{error}</ErrorText>
      <button className="btn primary block" disabled={busy || !name.trim()}>
        {initial ? (
          'Guardar'
        ) : (
          <>
            <SparkleIcon /> {busy ? 'Creando…' : 'Crear club'}
          </>
        )}
      </button>
    </form>
  )
}

/** Buscador de grupos públicos, con el botón para pedir unirse. */
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
