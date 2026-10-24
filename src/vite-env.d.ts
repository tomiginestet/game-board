/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_KEY?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
  /** Qué app se arma sobre el motor (`gameboard` por defecto); ver `src/skins/`. */
  readonly VITE_SKIN?: string
}

/** Versión del build (commit del deploy), ver `vite.config.ts`. */
declare const __APP_VERSION__: string
