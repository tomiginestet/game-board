// Todas las ilustraciones juntas. Se importa sólo desde `loadArt()` (art/index.ts), así queda en un archivo aparte.
// Cada archivo exporta un `Record<nombre, dibujo>` terminado en `_ART`; las de `nuevas/` se cargan después y reemplazan a
// las viejas del mismo nombre.
const old = import.meta.glob<Record<string, unknown>>(['./*.ts', '!./index.ts', '!./registry.ts', '!./helpers.ts', '!./glyphs.ts', '!./kit.ts'], { eager: true })
const redrawn = import.meta.glob<Record<string, unknown>>('./nuevas/*.ts', { eager: true })

export const ALL_ART: Record<string, (u: number) => string> = Object.assign(
  {},
  ...[...Object.values(old), ...Object.values(redrawn)].flatMap((m) =>
    Object.entries(m)
      .filter(([k]) => k.endsWith('_ART'))
      .map(([, v]) => v as Record<string, (u: number) => string>),
  ),
)
