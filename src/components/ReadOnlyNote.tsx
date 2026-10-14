import { EyeIcon } from '@phosphor-icons/react'
import { canEdit, useAccess, type Authored } from '../lib/access'
import type { EntityKind } from '../lib/diff'

const WHO: Partial<Record<EntityKind, string>> = {
  play: 'Esta partida la anotan los que juegan, quien la cargó o un admin del club.',
  match: 'Este partido lo anotan los que juegan, quien lo cargó o un admin del club.',
  cup: 'Este torneo lo manejan quien lo armó o un admin del club.',
  tournament: 'Este torneo lo manejan quien lo armó o un admin del club.',
}

/**
 * Con cuenta, en algo que no es tuyo: se avisa que sólo se mira (sin cuenta ya lo dice el aviso de arriba).
 * Si igual se toca algo, el store no lo guarda y avisa.
 */
export function ReadOnlyNote({ kind, entity, className = '' }: { kind: EntityKind; entity: Authored; className?: string }) {
  const access = useAccess()
  if (access.mode !== 'member' || canEdit(access, kind, entity)) return null
  return (
    <p className={'readonly-note ' + className}>
      <EyeIcon aria-hidden /> {WHO[kind] ?? 'Esto lo pueden cambiar quien lo creó o un admin del club.'}
    </p>
  )
}
