import { ArrowLeftIcon, CheckCircleIcon, DownloadSimpleIcon, TrashIcon, UploadSimpleIcon, XCircleIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { actions, getData } from '../lib/store'
import { useSyncState } from '../lib/sync'
import { confirmAction } from '../lib/feedback'
import { friendlyError } from '../lib/text'

export function Settings() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error' | 'info'; text: string } | null>(null)
  const inClub = !!useSyncState().club

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getData(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `game-board-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importFile = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text())
      const ok = await confirmAction({
        title: '¿Reemplazar los datos por los del archivo?',
        detail: 'Los jugadores, partidas y torneos que hay ahora en este teléfono se cambian por los de la copia.',
        confirmLabel: 'Reemplazar datos',
        danger: true,
      })
      if (!ok) return
      actions.importData(parsed)
      setMessage({ kind: 'ok', text: 'Listo: los datos de la copia ya están cargados.' })
    } catch (e) {
      setMessage({ kind: 'error', text: friendlyError(e) })
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back">
        <ArrowLeftIcon /> Inicio
      </Link>
      <h1>Ajustes</h1>

      <section className="card">
        <h3>Copia de seguridad</h3>
        <p className="muted">
          {inClub
            ? 'Los datos del club quedan guardados en el club. Igual podés bajar una copia para tenerla a mano.'
            : 'Sin club, los datos se guardan solo en este teléfono. Bajá una copia para no perderlos o para pasarlos a otro. También podés cargar una copia del Ping Pong Club.'}
        </p>
        <div className="row gap wrap">
          <button className="btn primary" onClick={exportData}>
            <DownloadSimpleIcon /> Bajar copia
          </button>
          <button className="btn" disabled={inClub} onClick={() => fileRef.current?.click()}>
            <UploadSimpleIcon /> Cargar copia
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importFile(f)
              e.target.value = ''
            }}
          />
        </div>
        {inClub && <p className="muted small">Mientras estés en un club no se puede cargar una copia: reemplazaría los datos de todos.</p>}
        {message && (
          <p className={'status-message ' + message.kind} role={message.kind === 'error' ? 'alert' : 'status'}>
            {message.kind === 'ok' && <CheckCircleIcon weight="fill" />}
            {message.kind === 'error' && <XCircleIcon weight="fill" />}
            {message.text}
          </p>
        )}
      </section>

      <section className="card">
        <h3>Zona peligrosa</h3>
        {inClub && <p className="muted small">Mientras estés en un club no se puede borrar todo: afectaría a todos sus integrantes.</p>}
        <button
          className="btn danger"
          disabled={inClub}
          onClick={async () => {
            const ok = await confirmAction({
              title: '¿Borrar todos los datos?',
              detail: 'Se borran todos los jugadores, partidas, torneos y juegos agregados de este teléfono. No se puede deshacer.',
              confirmLabel: 'Borrar todo',
              danger: true,
            })
            if (ok) {
              actions.resetAll()
              setMessage({ kind: 'info', text: 'Listo: borramos todos los datos.' })
            }
          }}
        >
          <TrashIcon /> Borrar todo
        </button>
      </section>
    </div>
  )
}
