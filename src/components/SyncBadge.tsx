import { Link } from 'react-router-dom'
import { syncAvailable, useSyncState } from '../lib/sync'

export function SyncBadge() {
  const sync = useSyncState()
  if (!syncAvailable) return null
  return (
    <Link to="/club" className={'sync-badge ' + sync.status}>
      <span className="sync-dot" />
      <span className="ellipsis">{sync.club ? sync.club.name : 'Sincronizar'}</span>
    </Link>
  )
}
