import { BellSlashIcon, CheckIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { formatDate } from '../../lib/hooks'
import {
  decideJoinRequest,
  deleteNotification,
  markAllRead,
  refreshGroups,
  respondFriendRequest,
  respondGroupInvite,
  switchToGroup,
  useNotifications,
  userAsPlayer,
  type AppNotification,
} from '../../lib/social'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'

function text(n: AppNotification): string {
  const from = n.data.from?.display_name ?? 'Alguien'
  const group = n.data.name ? `“${n.data.name}”` : 'un club'
  switch (n.kind) {
    case 'join_request':
      return `${from} quiere entrar a ${group}`
    case 'join_accepted':
      return `¡Te aceptaron en ${group}!`
    case 'join_rejected':
      return `No te aceptaron en ${group}`
    case 'group_invite':
      return `${from} te invitó a ${group}`
    case 'invite_accepted':
      return `${from} aceptó tu invitación a ${group}`
    case 'friend_request':
      return `${from} te quiere agregar como amigo`
    case 'friend_accepted':
      return `${from} aceptó tu solicitud de amistad`
    case 'removed':
      return `Ya no sos parte de ${group}`
    default:
      return 'Novedad'
  }
}

export function Notifications() {
  const { items, unread } = useNotifications()
  const navigate = useNavigate()
  const [busy, setBusy] = useState<number | null>(null)
  const [done, setDone] = useState<Record<number, string>>({})
  const [error, setError] = useState('')

  // Al rato de verlas quedan leídas. Las solicitudes siguen teniendo sus botones hasta que se responden
  // (al responderlas, el servidor borra el aviso).
  useEffect(() => {
    const t = setTimeout(() => void markAllRead().catch(() => {}), 1500)
    return () => clearTimeout(t)
  }, [])

  const run = async (n: AppNotification, label: string, fn: () => Promise<unknown>) => {
    setBusy(n.id)
    setError('')
    try {
      await fn()
      setDone((d) => ({ ...d, [n.id]: label }))
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(null)
    }
  }

  const openGroup = async (groupId?: string) => {
    const groups = await refreshGroups()
    const g = groups.find((x) => x.id === groupId)
    if (g) {
      await switchToGroup(g)
      navigate('/grupo')
    }
  }

  return (
    <div className="page">
      <div className="section-head">
        <h1>Notificaciones</h1>
        {unread > 0 && (
          <button className="link-btn small" onClick={() => void markAllRead()}>
            Marcar todo como leído
          </button>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
      {!items.length && (
        <div className="empty">
          <BellSlashIcon size={32} className="block-center" />
          <p>No tenés novedades. Acá te van a llegar las solicitudes para entrar a tus clubes, invitaciones y pedidos de amistad.</p>
        </div>
      )}
      <div className="list">
        {items.map((n) => {
          const who = n.data.from ?? n.data.by
          const actionable = !done[n.id]
          return (
            <div key={n.id} className={'card notif-row' + (n.read_at ? '' : ' unread')}>
              {who ? (
                <Avatar player={userAsPlayer(who)} size={40} />
              ) : (
                <span className="group-emoji small" aria-hidden>
                  {n.data.emoji ?? '🔔'}
                </span>
              )}
              <div className="grow">
                <p className="notif-text">{text(n)}</p>
                {n.data.message && <p className="small muted">“{n.data.message}”</p>}
                <span className="muted small">{formatDate(new Date(n.created_at).getTime())}</span>
                {done[n.id] && <span className="pill tiny">{done[n.id]}</span>}
                <div className="row gap wrap notif-actions">
                  {actionable && n.kind === 'join_request' && n.data.request_id && (
                    <>
                      <button className="btn small primary" disabled={busy === n.id} onClick={() => run(n, 'Aceptado', () => decideJoinRequest(n.data.request_id!, true))}>
                        <CheckIcon /> Aceptar
                      </button>
                      <button className="btn small" disabled={busy === n.id} onClick={() => run(n, 'Rechazado', () => decideJoinRequest(n.data.request_id!, false))}>
                        Rechazar
                      </button>
                    </>
                  )}
                  {actionable && n.kind === 'group_invite' && n.data.invite_id && (
                    <>
                      <button
                        className="btn small primary"
                        disabled={busy === n.id}
                        onClick={() =>
                          run(n, 'Aceptada', async () => {
                            await respondGroupInvite(n.data.invite_id!, true)
                            await openGroup(n.data.group_id)
                          })
                        }
                      >
                        <CheckIcon /> Unirme
                      </button>
                      <button className="btn small" disabled={busy === n.id} onClick={() => run(n, 'Rechazada', () => respondGroupInvite(n.data.invite_id!, false))}>
                        No, gracias
                      </button>
                    </>
                  )}
                  {actionable && n.kind === 'friend_request' && n.data.from && (
                    <>
                      <button className="btn small primary" disabled={busy === n.id} onClick={() => run(n, 'Ahora son amigos', () => respondFriendRequest(n.data.from!.user_id, true))}>
                        <CheckIcon /> Aceptar
                      </button>
                      <button className="btn small" disabled={busy === n.id} onClick={() => run(n, 'Rechazada', () => respondFriendRequest(n.data.from!.user_id, false))}>
                        Rechazar
                      </button>
                    </>
                  )}
                  {(n.kind === 'join_accepted' || n.kind === 'invite_accepted') && (
                    <button className="btn small" onClick={() => void openGroup(n.data.group_id)}>
                      Ir al club
                    </button>
                  )}
                  {n.kind === 'friend_accepted' && (
                    <button className="btn small" onClick={() => navigate('/amigos')}>
                      Jugar mano a mano
                    </button>
                  )}
                </div>
              </div>
              <button className="tool-btn" aria-label="Borrar notificación" onClick={() => void deleteNotification(n.id)}>
                <XIcon />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
