import { useMyGroups } from './social'
import { useSyncState } from './sync'
import type { Id } from './types'

/** Qué jugador del club sos (con cuenta y el club activo). `undefined` si no se sabe. */
export function useMyPlayerId(): Id | undefined {
  const sync = useSyncState()
  const { groups } = useMyGroups()
  return groups?.find((g) => g.code === sync.club?.code)?.player_id ?? undefined
}
