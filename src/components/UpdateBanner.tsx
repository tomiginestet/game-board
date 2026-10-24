import { ArrowClockwiseIcon } from '@phosphor-icons/react'
import { applyUpdate, useUpdateAvailable } from '../lib/appUpdate'
import { skin } from '../skins'

/** Hay una versión nueva de la app y no la cargamos sola porque estabas en medio de algo. */
export function UpdateBanner() {
  if (!useUpdateAvailable()) return null
  return (
    <div className="announcement update" role="status">
      <ArrowClockwiseIcon weight="bold" aria-hidden />
      <p>Hay una versión nueva de {skin.name}.</p>
      <button className="update-btn" onClick={applyUpdate}>
        Actualizar
      </button>
    </div>
  )
}
