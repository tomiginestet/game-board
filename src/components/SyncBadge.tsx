import { Link } from 'react-router-dom'
import { SYNC_LABEL, syncAvailable, useSyncState } from '../lib/sync'
import { SyncIcon } from './SyncIcon'

/** Sin cuenta: el club del dispositivo y cómo va el guardado (o el acceso para armar uno). */
export function SyncBadge() {
  const sync = useSyncState()
  if (!syncAvailable) return null
  const label = sync.club ? `${sync.club.name}: ${SYNC_LABEL[sync.status].toLowerCase()}` : 'Armar un club'
  return (
    <Link to="/club" className={'sync-badge ' + sync.status} aria-label={label} title={sync.club ? SYNC_LABEL[sync.status] : undefined}>
      {sync.club && <SyncIcon status={sync.status} />}
      <span className="ellipsis">{sync.club ? sync.club.name : 'Armar un club'}</span>
    </Link>
  )
}
