import { useEffect, useRef, useState } from 'react'
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

/** Cuántas se festejan una por una; el resto queda en la lista del resumen. */
const MAX_CELEBRATED = 3

/**
 * Si se ganaron muchas de golpe (la primera partida de una mesa grande), festeja las más altas,
 * una por persona antes de repetir a alguien, para no hacer pasar quince hojas seguidas.
 */
function highlights(medals: NewMedal[]): NewMedal[] {
  if (medals.length <= MAX_CELEBRATED) return medals
  const sorted = [...medals].sort((a, b) => b.level - a.level)
  const firstEach = sorted.filter((m, i) => sorted.findIndex((x) => x.who === m.who) === i)
  return [...firstEach, ...sorted.filter((m) => !firstEach.includes(m))].slice(0, MAX_CELEBRATED)
}

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
 * Primero se deja ver al ganador (`delay`); se puede adelantar con `requested` (un contador que sube
 * cada vez que alguien toca "Ver medallas nuevas"), que también sirve para volver a verlas después.
 * Sola, se abre una vez por partida; después quedan en la lista del resumen.
 */
export function MedalCelebration({
  id,
  finishedAt,
  medals,
  delay = 1800,
  requested = 0,
}: {
  id: string
  finishedAt?: number
  medals: NewMedal[]
  /** Cuánto se espera antes de abrirse sola, para que primero se vea el resultado. */
  delay?: number
  requested?: number
}) {
  const [step, setStep] = useState<number | null>(null)
  // Si ya se abrió a mano, la apertura automática no vuelve a empezar la ronda.
  const opened = useRef(false)

  useEffect(() => {
    if (!medals.length || !finishedAt || Date.now() - finishedAt > FRESH_MS || seen().includes(id)) return
    // Se marca como vista recién al abrirse (si se marcara antes, el doble efecto de StrictMode
    // la cancelaría para siempre).
    const t = setTimeout(() => {
      if (opened.current) return
      opened.current = true
      markSeen(id)
      setStep(0)
    }, delay)
    return () => clearTimeout(t)
  }, [id, finishedAt, medals.length, delay])

  // Pedido a mano: se abre ya, aunque ya se haya festejado (se ajusta al cambiar el contador).
  const [handled, setHandled] = useState(requested)
  if (requested !== handled) {
    setHandled(requested)
    if (requested && medals.length) setStep(0)
  }
  useEffect(() => {
    if (!requested) return
    opened.current = true
    markSeen(id)
  }, [requested, id])

  const queue = highlights(medals)
  const m = step !== null ? queue[step] : undefined
  if (!m) return null
  const close = () => setStep(null)
  return (
    <MedalSheet
      key={step}
      family={m.family}
      level={m.level}
      mine={{ name: m.who, value: m.value, level: m.level }}
      celebrate={{ who: m.who, step: step! + 1, total: queue.length, onNext: () => (step! + 1 < queue.length ? setStep(step! + 1) : close()) }}
      onClose={close}
    />
  )
}
