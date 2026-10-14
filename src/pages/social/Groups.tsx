import { ArrowLeftIcon, CaretRightIcon, CheckIcon, MagnifyingGlassIcon, PlusIcon, SwordIcon, UserPlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { switchToGroup, useMyGroups, type MyGroup } from '../../lib/social'
import { useSyncState } from '../../lib/sync'
import { GroupForm, GroupSearch } from './GroupForms'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'
import { plural } from '../../lib/hooks'

/** Todos tus grupos y mano a mano, para cambiar entre ellos o crear/buscar otros. */
export function Groups() {
  const { groups } = useMyGroups()
  const sync = useSyncState()
  const navigate = useNavigate()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const regular = (groups ?? []).filter((g) => g.kind === 'group')
  const duos = (groups ?? []).filter((g) => g.kind === 'duo')

  const open = async (g: MyGroup) => {
    if (g.code === sync.club?.code) return navigate('/grupo')
    setBusy(g.code)
    setError('')
    try {
      await switchToGroup(g)
      navigate('/grupo')
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(null)
    }
  }

  const card = (g: MyGroup) => (
    <button key={g.code} className={'card group-row' + (g.code === sync.club?.code ? ' current' : '')} disabled={!!busy} onClick={() => open(g)}>
      <span className="group-emoji" aria-hidden>
        {g.emoji ?? (g.kind === 'duo' ? '⚔️' : '🎲')}
      </span>
      <span className="grow">
        <b className="block ellipsis">{g.name}</b>
        <span className="muted small">
          {g.kind === 'duo' ? 'Mano a mano' : `${g.members} ${g.members === 1 ? 'integrante' : 'integrantes'} · ${g.is_public ? 'público' : 'privado'}`}
          {g.role === 'owner' && g.kind === 'group' && ' · lo administrás vos'}
        </span>
        {g.pending_requests > 0 && <span className="pill accent tiny">{plural(g.pending_requests, 'solicitud', 'solicitudes')} para entrar</span>}
      </span>
      {g.code === sync.club?.code ? <CheckIcon className="win-text" /> : busy === g.code ? <span className="muted">…</span> : <CaretRightIcon className="muted" />}
    </button>
  )

  return (
    <div className="page">
      <div className="section-head">
        <h1>Clubes</h1>
      </div>
      <p className="muted">Cada club tiene sus jugadores, partidas, torneos y ranking. Podés estar en varios y cambiar cuando quieras.</p>
      <div className="row gap wrap">
        <Link to="/grupos/nuevo" className="btn primary">
          <PlusIcon /> Crear club
        </Link>
        <Link to="/grupos/buscar" className="btn">
          <MagnifyingGlassIcon /> Buscar clubes
        </Link>
        <Link to="/amigos" className="btn">
          <UserPlusIcon /> Amigos
        </Link>
      </div>
      <ErrorText>{error}</ErrorText>

      <section>
        <h2>Tus clubes</h2>
        {groups === undefined && <p className="muted">Cargando…</p>}
        {groups && !regular.length && <div className="empty">Todavía no estás en ningún club. Creá uno o buscá el de tus amigos para sumarte.</div>}
        <div className="list">{regular.map(card)}</div>
      </section>

      <section>
        <div className="section-head">
          <h2>
            <SwordIcon className="inline-icon" /> Mano a mano
          </h2>
          <Link to="/amigos">Jugar con un amigo</Link>
        </div>
        {groups && !duos.length && <div className="empty">Agregá amigos y jueguen mano a mano: cada dupla tiene su propio historial.</div>}
        <div className="list">{duos.map(card)}</div>
      </section>
    </div>
  )
}

export function NewGroupPage() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <Link to="/grupos" className="back">
        <ArrowLeftIcon /> Clubes
      </Link>
      <h1>Nuevo club</h1>
      <GroupForm onDone={() => navigate('/grupo')} />
    </div>
  )
}

export function SearchGroupsPage() {
  const navigate = useNavigate()
  const { groups } = useMyGroups()
  return (
    <div className="page">
      <Link to="/grupos" className="back">
        <ArrowLeftIcon /> Clubes
      </Link>
      <h1>Buscar clubes</h1>
      <p className="muted">Clubes públicos. Al pedir sumarte le llega un aviso a quien lo administra; cuando te acepte, el club aparece en tu lista.</p>
      <GroupSearch
        onOpenMine={(id) => {
          const g = groups?.find((x) => x.id === id)
          if (g) void switchToGroup(g).then(() => navigate('/grupo'))
        }}
      />
    </div>
  )
}
