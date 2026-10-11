// Registro de todas las ilustraciones de medallas, por nombre de nivel.
// Cada archivo de esta carpeta exporta un `Record<nombre, dibujo>` terminado en `_ART`; se cargan solos.
const modules = import.meta.glob<Record<string, unknown>>(['./*.ts', '!./index.ts', '!./helpers.ts', '!./glyphs.ts'], { eager: true })

export const ART_REGISTRY: Record<string, (u: number) => string> = Object.assign(
  {},
  ...Object.values(modules).flatMap((m) =>
    Object.entries(m)
      .filter(([k]) => k.endsWith('_ART'))
      .map(([, v]) => v as Record<string, (u: number) => string>),
  ),
)
