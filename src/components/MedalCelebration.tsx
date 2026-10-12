import { useEffect, useState } from 'react'
import type { MedalFamily } from '../lib/medals'
import { MedalSheet } from './MedalSheet'

export interface NewMedal {
  who: string
  family: MedalFamily
  /** Nivel recién ganado. */
  level: number
  value: number
}

const SEEN_KEY = 'game-board-celebrated-v1'
/** Sólo se festeja al terminar la partida, no al volver a mirarla días después. */
const FRESH_MS = 15 * 60 * 1000

function seen(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function markSeen(id: string) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen().filter((x) => x !== id), id].slice(-50)))
  } catch {
    // ignorar
  }
}

/**
 * Al terminar una partida, abre una por una las medallas que se ganaron, en grande y con festejo.
 * Se muestra una sola vez por partida; después quedan en la lista del resumen para volver a verlas.
 */
export function MedalCelebration({ id, finishedAt, medals }: { id: string; finishedAt?: number; medals: NewMedal[] }) {
  const [step, setStep] = useState<number | null>(null)

  useEffect(() => {
    if (!medals.length || !finishedAt || Date.now() - finishedAt > FRESH_MS || seen().includes(id)) return
    // Un respiro para que primero se vea el resultado. Se marca como visto recién al abrirse
    // (si se marcara antes, el doble efecto de StrictMode la cancelaría para siempre).
    const t = setTimeout(() => {
      markSeen(id)
      setStep(0)
    }, 700)
    return () => clearTimeout(t)
  }, [id, finishedAt, medals.length])

  const m = step !== null ? medals[step] : undefined
  if (!m) return null
  const close = () => setStep(null)
  return (
    <MedalSheet
      key={step}
      family={m.family}
      level={m.level}
      mine={{ name: m.who, value: m.value, level: m.level }}
      celebrate={{ who: m.who, step: step! + 1, total: medals.length, onNext: () => (step! + 1 < medals.length ? setStep(step! + 1) : close()) }}
      onClose={close}
    />
  )
}
