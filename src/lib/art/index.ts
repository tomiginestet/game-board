// Registro de todas las ilustraciones de medallas, por nombre de nivel.
// Cada archivo exporta un `Record<nombre, dibujo>` terminado en `_ART`; se cargan solos.
// Las de `nuevas/` (redibujadas con el kit de kit.ts) se cargan después y reemplazan a las viejas del mismo nombre.
const old = import.meta.glob<Record<string, unknown>>(['./*.ts', '!./index.ts', '!./helpers.ts', '!./glyphs.ts', '!./kit.ts'], { eager: true })
const redrawn = import.meta.glob<Record<string, unknown>>('./nuevas/*.ts', { eager: true })

export const ART_REGISTRY: Record<string, (u: number) => string> = Object.assign(
  {},
  ...[...Object.values(old), ...Object.values(redrawn)].flatMap((m) =>
    Object.entries(m)
      .filter(([k]) => k.endsWith('_ART'))
      .map(([, v]) => v as Record<string, (u: number) => string>),
  ),
)
