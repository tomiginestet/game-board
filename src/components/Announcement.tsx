import { InfoIcon, WarningIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { dismissAnnouncement, isAnnouncementDismissed, useAppConfig, useTouchActivity } from '../lib/appConfig'

/** Anuncio para todos que se escribe desde el panel de admin. Se cierra y no vuelve (hasta que cambie el texto). */
export function Announcement() {
  useTouchActivity()
  const config = useAppConfig()
  const [closed, setClosed] = useState(false)
  const a = config?.announcement
  if (!a?.text || closed || isAnnouncementDismissed(a.text)) return null
  const warn = a.level === 'warn'
  return (
    <div className={'announcement' + (warn ? ' warn' : '')} role={warn ? 'alert' : 'status'}>
      {warn ? <WarningIcon weight="fill" aria-hidden /> : <InfoIcon weight="fill" aria-hidden />}
      <p>{a.text}</p>
      <button
        aria-label="Cerrar anuncio"
        onClick={() => {
          dismissAnnouncement(a.text)
          setClosed(true)
        }}
      >
        <XIcon />
      </button>
    </div>
  )
}
