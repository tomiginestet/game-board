// Configuración que se maneja desde el panel de admin (anuncio, IA encendida) y el
// registro de "abrió la app hoy" para contar personas activas.

import { useEffect, useState } from 'react'
import { useAuth } from './auth'
import { supabase } from './sync'

export interface AppConfig {
  ai_enabled: boolean
  announcement: { text: string; level?: 'info' | 'warn'; until?: string | null } | null
}

let configPromise: Promise<AppConfig | null> | undefined

/** Se pide una vez por sesión de la app. Sin conexión o sin Supabase: null. */
export function loadAppConfig(): Promise<AppConfig | null> {
  const sb = supabase()
  if (!sb) return Promise.resolve(null)
  configPromise ??= Promise.resolve(sb.rpc('app_config')).then(
    ({ data, error }) => (error ? null : (data as AppConfig)),
    () => null,
  )
  return configPromise
}

export function useAppConfig(): AppConfig | null {
  const [config, setConfig] = useState<AppConfig | null>(null)
  useEffect(() => {
    let alive = true
    void loadAppConfig().then((c) => alive && setConfig(c))
    return () => {
      alive = false
    }
  }, [])
  return config
}

const TOUCH_KEY = 'game-board-active-day'

/** Una vez por día y cuenta: "abrió la app". */
export function useTouchActivity() {
  const uid = useAuth().session?.user.id
  useEffect(() => {
    const sb = supabase()
    if (!uid || !sb) return
    const mark = `${uid}:${new Date().toDateString()}`
    try {
      if (localStorage.getItem(TOUCH_KEY) === mark) return
    } catch {
      // sin almacenamiento: se manda igual (el servidor ignora los repetidos)
    }
    void Promise.resolve(sb.rpc('touch_activity')).then(({ error }) => {
      if (error) return
      try {
        localStorage.setItem(TOUCH_KEY, mark)
      } catch {
        // ignorar
      }
    })
  }, [uid])
}

const DISMISSED_KEY = 'game-board-announcement-dismissed'

export function isAnnouncementDismissed(text: string): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === text
  } catch {
    return false
  }
}

export function dismissAnnouncement(text: string) {
  try {
    localStorage.setItem(DISMISSED_KEY, text)
  } catch {
    // ignorar
  }
}
