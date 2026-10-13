// Todas las ilustraciones juntas. Se importa sólo desde `loadArt()` (art/index.ts), así queda en un archivo aparte.
// Cada archivo de `nuevas/` exporta un `Record<nombre, dibujo>` terminado en `_ART`.
const files = import.meta.glob<Record<string, unknown>>('./nuevas/*.ts', { eager: true })

export const ALL_ART: Record<string, (u: number) => string> = Object.assign(
  {},
  ...Object.values(files).flatMap((m) =>
    Object.entries(m)
      .filter(([k]) => k.endsWith('_ART'))
      .map(([, v]) => v as Record<string, (u: number) => string>),
  ),
)
