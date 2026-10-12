import { useEffect, useRef } from 'react'
import { closeToast, settleConfirm, useConfirm, useModal, useToast, type Confirm, type Toast } from '../lib/feedback'

/** Dibuja los avisos y confirmaciones pedidos con `toast()` y `confirmAction()` (lib/feedback). */
export function FeedbackHost() {
  const t = useToast()
  const c = useConfirm()
  return (
    <>
      {/* La región existe siempre, así los lectores de pantalla anuncian lo que aparece. */}
      <div className="toast-region" role="status" aria-live="polite">
        {t && <ToastView key={t.id} toast={t} />}
      </div>
      {c && <ConfirmView confirm={c} />}
    </>
  )
}

function ToastView({ toast: t }: { toast: Toast }) {
  useEffect(() => {
    const timer = setTimeout(() => closeToast(t.id), t.action ? 6000 : 3500)
    return () => clearTimeout(timer)
  }, [t])
  return (
    <div className="toast">
      <span className="grow">{t.text}</span>
      {t.action && (
        <button
          className="toast-action"
          onClick={() => {
            t.action!.run()
            closeToast(t.id)
          }}
        >
          {t.action.label}
        </button>
      )}
    </div>
  )
}

function ConfirmView({ confirm: c }: { confirm: Confirm }) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby="confirm-title"
      aria-describedby={c.detail ? 'confirm-detail' : undefined}
      onCancel={(e) => {
        e.preventDefault()
        settleConfirm(false)
      }}
      onClick={(e) => e.target === e.currentTarget && settleConfirm(false)}
    >
      {/* El cuerpo ocupa todo el diálogo: un toque fuera de él es un toque en el fondo. */}
      <div className="confirm-body">
        <h2 id="confirm-title">{c.title}</h2>
        {c.detail && (
          <p id="confirm-detail" className="muted">
            {c.detail}
          </p>
        )}
        <div className="confirm-actions">
          <button className="btn" onClick={() => settleConfirm(false)} autoFocus>
            Cancelar
          </button>
          <button className={'btn ' + (c.danger ? 'danger-fill' : 'primary')} onClick={() => settleConfirm(true)}>
            {c.confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

/** Texto de error accesible (se anuncia apenas aparece). */
export function ErrorText({ children }: { children: string }) {
  return children ? (
    <p className="error" role="alert">
      {children}
    </p>
  ) : null
}

