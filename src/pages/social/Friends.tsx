import { CheckIcon, HourglassIcon, MagnifyingGlassIcon, SwordIcon, UserMinusIcon, UserPlusIcon, XIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { myFriends, openDuo, removeFriend, respondFriendRequest, searchUsers, sendFriendRequest, userAsPlayer, type Friend, type FoundUser } from '../../lib/social'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'

export function Friends() {
  const navigate = useNavigate()
  const [friends, setFriends] = useState<Friend[] | null>(null)
  const [q, setQ] = useState('')
  const [found, setFound] = useState<FoundUser[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    myFriends()
      .then(setFriends)
      .catch((e) => setError(friendlyError(e)))
  }, [])
  useEffect(load, [load])

  const shown = q.trim().length >= 2 ? found : []

  useEffect(() => {
    if (q.trim().length < 2) return
    let cancelled = false
    const t = setTimeout(() => {
      searchUsers(q)
        .then((r) => !cancelled && setFound(r))
        .catch(() => {})
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [q])

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id)
    setError('')
    try {
      await fn()
      load()
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(null)
    }
  }

  const accepted = (friends ?? []).filter((f) => f.status === 'friend')
  const incoming = (friends ?? []).filter((f) => f.status === 'incoming')
  const outgoing = (friends ?? []).filter((f) => f.status === 'outgoing')

  return (
    <div className="page">
      <h1>Amigos</h1>
      <p className="muted">Sumá amigos por su usuario y jueguen mano a mano. Cada dupla tiene su historial y su ranking; las partidas también cuentan para el ranking global.</p>

      <label className="search">
        <MagnifyingGlassIcon />
        <input className="input" placeholder="Buscar por nombre o @usuario" value={q} onChange={(e) => setQ(e.target.value)} autoCapitalize="none" />
      </label>
      {shown.length > 0 && (
        <div className="list">
          {shown.map((u) => (
            <div key={u.user_id} className="card member-row">
              <Avatar player={userAsPlayer(u)} size={40} />
              <span className="grow">
                <b className="block">{u.display_name}</b>
                <span className="muted small">@{u.username}</span>
              </span>
              {u.friend_status === 'friend' ? (
                <span className="pill">Amigos</span>
              ) : u.friend_status === 'outgoing' ? (
                <span className="pill">
                  <HourglassIcon /> Pedido
                </span>
              ) : (
                <button
                  className="btn small primary"
                  disabled={busy === u.user_id}
                  onClick={() =>
                    run(u.user_id, async () => {
                      const status = await sendFriendRequest(u.user_id)
                      setFound((list) => list.map((x) => (x.user_id === u.user_id ? { ...x, friend_status: status } : x)))
                    })
                  }
                >
                  <UserPlusIcon /> {u.friend_status === 'incoming' ? 'Aceptar' : 'Agregar'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {q.trim().length >= 2 && !shown.length && <p className="muted small">No encontramos a nadie con “{q}”.</p>}
      <ErrorText>{error}</ErrorText>

      {incoming.length > 0 && (
        <section>
          <h2>Te quieren agregar</h2>
          <div className="list">
            {incoming.map((f) => (
              <div key={f.user_id} className="card member-row">
                <Avatar player={userAsPlayer(f)} size={40} />
                <span className="grow">
                  <b className="block">{f.display_name}</b>
                  <span className="muted small">@{f.username}</span>
                </span>
                <button className="btn small primary" disabled={busy === f.user_id} onClick={() => run(f.user_id, () => respondFriendRequest(f.user_id, true))}>
                  <CheckIcon /> Aceptar
                </button>
                <button className="tool-btn" aria-label="Rechazar" disabled={busy === f.user_id} onClick={() => run(f.user_id, () => respondFriendRequest(f.user_id, false))}>
                  <XIcon />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Tus amigos</h2>
        {friends === null && !error && <p className="muted">Cargando…</p>}
        {friends && !accepted.length && <div className="empty">Todavía no agregaste amigos. Buscalos arriba por su nombre o usuario.</div>}
        <div className="list">
          {accepted.map((f) => (
            <div key={f.user_id} className="card member-row">
              <Avatar player={userAsPlayer(f)} size={44} />
              <span className="grow">
                <b className="block">{f.display_name}</b>
                <span className="muted small">@{f.username}</span>
              </span>
              <button
                className="btn small primary"
                disabled={busy === f.user_id}
                onClick={() =>
                  run(f.user_id, async () => {
                    await openDuo(f.user_id)
                    navigate('/juegos')
                  })
                }
              >
                <SwordIcon /> {busy === f.user_id ? '…' : 'Mano a mano'}
              </button>
              <button
                className="tool-btn"
                aria-label={`Dejar de ser amigo de ${f.display_name}`}
                disabled={busy === f.user_id}
                onClick={() => confirm(`¿Sacar a ${f.display_name} de tus amigos? El historial del mano a mano queda guardado.`) && run(f.user_id, () => removeFriend(f.user_id))}
              >
                <UserMinusIcon />
              </button>
            </div>
          ))}
        </div>
      </section>

      {outgoing.length > 0 && (
        <section>
          <h2>Solicitudes enviadas</h2>
          <div className="list">
            {outgoing.map((f) => (
              <div key={f.user_id} className="card member-row">
                <Avatar player={userAsPlayer(f)} size={36} />
                <span className="grow">
                  <b className="block">{f.display_name}</b>
                  <span className="muted small">@{f.username} · esperando respuesta</span>
                </span>
                <button className="btn small" disabled={busy === f.user_id} onClick={() => run(f.user_id, () => removeFriend(f.user_id))}>
                  Cancelar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
