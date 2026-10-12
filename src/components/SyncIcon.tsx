import { ArrowsClockwiseIcon, CheckCircleIcon, CloudSlashIcon, DeviceMobileIcon, WarningCircleIcon } from '@phosphor-icons/react'
import type { SyncStatus } from '../lib/sync'

/** Estado del guardado con forma propia por estado (no sólo color). */
export function SyncIcon({ status }: { status: SyncStatus }) {
  const Icon = { ok: CheckCircleIcon, syncing: ArrowsClockwiseIcon, offline: CloudSlashIcon, error: WarningCircleIcon, off: DeviceMobileIcon }[status]
  return <Icon className={'sync-icon ' + status} weight="fill" aria-hidden />
}
