import { FlagIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { useAuth } from '../lib/auth'
import { toast, useModal } from '../lib/feedback'
import { supabase } from '../lib/sync'
import { friendlyError } from '../lib/text'
import { skin } from '../skins'

type Target = { kind: 'user'; user_id: string } | { kind: 'group'; group_id: string } | { kind: 'game'; code: string; id: string }

async function report(target: Target, reason: string) {
  const sb = supabase()
  if (!sb) throw new Error('No se puede reportar en esta versión de la app')
  const { kind, ...rest } = target
  const { error } = await sb.rpc('report_content', { p_kind: kind, p_target: rest, p_reason: reason })
  if (error) throw new Error(error.message)
}

function ReportDialog({ target, name, onClose }: { target: Target; name: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby="report-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        className="confirm-body"
        onSubmit={async (e) => {
          e.preventDefault()
          setBusy(true)
          try {
            await report(target, reason)
            toast('Gracias, lo vamos a revisar')
            onClose()
          } catch (err) {
            toast(friendlyError(err))
            setBusy(false)
          }
        }}
      >
        <h2 id="report-title">Reportar {name}</h2>
        <p className="muted">Contanos qué pasa. Lo lee sólo quien administra {skin.name}.</p>
        <textarea className="input" rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Qué pasa" autoFocus />
        <div className="confirm-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn primary" disabled={busy || !reason.trim()}>
            Mandar reporte
          </button>
        </div>
      </form>
    </dialog>
  )
}

/** Botón chico para reportar un club, una persona o un juego. Sólo con cuenta. */
export function ReportButton({ target, name, label = false }: { target: Target; name: string; label?: boolean }) {
  const auth = useAuth()
  const [open, setOpen] = useState(false)
  if (!auth.session) return null
  return (
    <>
      <button className={'btn small' + (label ? '' : ' icon-only')} aria-label={`Reportar ${name}`} title="Reportar" onClick={() => setOpen(true)}>
        <FlagIcon />
        {label && ' Reportar'}
      </button>
      {open && <ReportDialog target={target} name={name} onClose={() => setOpen(false)} />}
    </>
  )
}
