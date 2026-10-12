import { useMemo } from 'react'
import type { AwardLevel } from '../lib/games/schema'
import { medalSvg, TIERS } from '../lib/medalArt'

/** Medalla (estampita) de un nivel de una familia. `locked` la muestra en gris; de 160px para arriba lleva el nombre en la cinta. */
export function Medal({ family, level, locked = false, size = 64 }: { family: { levels: AwardLevel[] }; level: number; locked?: boolean; size?: number }) {
  const l = family.levels[level]
  // El SVG sale de ilustraciones propias (sin datos del usuario salvo el nombre, que se escapa), así que es seguro inyectarlo.
  const html = useMemo(
    () =>
      medalSvg(l.name, level, {
        face: l.face,
        glyph: l.glyph,
        color: l.color,
        value: l.at,
        detail: size >= 160,
        label: `${l.name}, nivel ${TIERS[Math.min(level, TIERS.length - 1)].roman}${locked ? ' (bloqueado)' : ''}`,
      }),
    [l, level, locked, size],
  )
  return <span className={'medal' + (locked ? ' locked' : '')} style={{ width: size }} dangerouslySetInnerHTML={{ __html: html }} />
}
