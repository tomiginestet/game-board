# Game Board

App de clubes de juegos y deportes (React + TS + Vite, Supabase). Ver README.md, PRODUCT.md y DESIGN.md.

## Medallas

- Cada nivel de medalla de un juego del catálogo lleva su **ilustración propia** en `src/lib/art/nuevas/<juego>.ts`,
  con el estilo de estampa de [docs/medallas-filosofia.md](docs/medallas-filosofia.md) y el kit de `src/lib/art/kit.ts`
  (tinta azul, papel crema, grano, sol/escenario/noche, un protagonista con el chiste en el objeto).
- Nunca se usan los dibujos genéricos viejos (`glyph`/`color`) en el catálogo; quedan sólo para los juegos que agregan
  el grupo o la IA, y también están dibujados con el estilo nuevo (`src/lib/art/glyphs.ts`).
- Referencia de detalle: los últimos dibujados (`eafc.ts`, `pingpong.ts`, los deportes). Revisar cada medalla grande
  y a 44 px con `npm run medals -- salida.png nuevas/<juego>` antes de darla por terminada.
- `npm test` falla si una medalla del catálogo no tiene ilustración propia.

## Skins

- Game Board es un motor; cada app (skin) vive en `src/skins/<id>/` y se elige al compilar con `VITE_SKIN`.
  Plan y pendientes en [docs/motor.md](docs/motor.md).
- El nombre de la app en pantallas y textos es `skin.name`, nunca "Game Board" escrito a mano.
