# 🎲 Game Board

Web app para llevar el historial de juegos con amigos: juegos de mesa, cartas, de fiesta, cooperativos,
deportes y videojuegos. Partidas, torneos, rankings y medallas ilustradas, con el mismo espíritu (y la misma base
de datos) que el [Ping Pong Club](https://github.com/tomiginestet/ping-pong-web-app).

## Qué hace

- **Biblioteca de juegos**: vienen 45 de fábrica (truco, Catán, buraco, Skull King, El Impostor, Pistas cruzadas,
  ta-te-ti, chinchón, generala, La Podrida, TEG, Código Secreto, Dixit, Carcassonne, ¡Aventureros al tren!,
  Mario Kart, EA FC, Among Us…) y se pueden **agregar más**:
  - **con IA gratis**: la app arma el pedido, lo pegás en cualquier chat (Claude, ChatGPT…) y pegás la respuesta;
  - **con IA automática**: un botón que usa la API de Claude, con tope de gasto mensual (USD 10);
  - **a mano**: un editor de fichas (o el JSON completo).
- **Cada juego se anota a su manera** según su ficha:
  - *marcador en vivo* (truco con fósforos, ta-te-ti al mejor de N);
  - *por manos* (buraco, chinchón con eliminación, generala por categorías, Skull King y La Podrida con apuestas y bazas);
  - *por turnos con puntaje oculto* (Catán: turnos, poblados, ciudades, camino más largo, ejército, cartas ocultas);
  - *resultado final* (orden de llegada, puntajes, roles secretos como impostor/tripulante);
  - *cooperativo* (se gana o se pierde todos juntos).
  - El ping pong usa el marcador del Ping Pong Club, punto a punto.
- **Torneos según el juego**: eliminación directa, liga, mesas rotativas (para juegos de 3 a 6, con mesa final)
  y partida acumulada. Con premio o castigo en texto libre.
- **Rankings**: puntos de gloria (normalizados por tamaño de mesa y peso del juego), victorias, ELO por juego,
  todoterreno (juegos distintos ganados) y **cinturones** por juego. Por temporada: siempre, año, mes o semana.
- **Medallas** con ilustraciones propias y niveles bronce → leyenda:
  - generales (todos los juegos juntos), genéricas de cada juego (sirven aunque el juego no tenga premios propios)
    y **propias de cada juego** (Ruta 40 en el Catán, Cantor de envidos en el truco, Rey del heno…);
  - los juegos agregados por el grupo usan dibujos genéricos con su color.
- **Clubes sincronizados** con link de invitación (los mismos del Ping Pong Club) y **cuentas opcionales**
  (mail o Google) para tener tus clubes en cualquier dispositivo y decir qué jugador sos.

## Datos y Ping Pong Club

Las dos apps comparten el proyecto de Supabase. En la tabla `entities`, los tipos `player`, `match` y `tournament`
son los del Ping Pong Club (las dos apps los leen y escriben con el mismo formato) y Game Board agrega `play`
(partida de cualquier juego), `cup` (torneo) y `game` (juego agregado por el grupo). `pull_changes` sigue
devolviendo sólo lo de ping pong; Game Board usa `pull_changes_all`. Ver `supabase/migrations/`.

La app funciona offline: todo se guarda en el navegador y, si el dispositivo está en un club, se sincroniza.

## IA

- `src/lib/aiPrompt.ts` arma el pedido (el mismo para el modo gratis y para la API) con el esquema de las fichas
  (`src/lib/games/schema.ts`) y la ficha del Catán como ejemplo.
- `supabase/functions/generate-game` llama a la API de Claude. Necesita el secreto `ANTHROPIC_API_KEY`;
  opcionales: `AI_MODEL`, `AI_MONTHLY_LIMIT_USD` (10) y `AI_DAILY_PER_USER` (10). Después de cambiar el
  esquema o el pedido: `npm run build:ai` y volver a publicar la función.

## Desarrollo

```bash
npm install
npm run dev       # servidor de desarrollo
npm test          # motor de partidas, torneos, estadísticas, fichas y catálogo
npm run lint
npm run build
npm run medals -- salida.png [módulo...]   # hoja con las ilustraciones de medallas (src/lib/art)
```

Variables: `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` (ver `.env.example`). Sin ellas la app funciona sólo con datos locales.

Stack: React + TypeScript + Vite, React Router (HashRouter), Supabase, Vitest.

### Cómo agregar un juego de fábrica

Un archivo en `src/lib/games/catalog/<id>.ts` que exporte un `GameDef` (se carga solo). Las ilustraciones de sus
medallas van en `src/lib/art/` (cualquier `Record` exportado con nombre terminado en `_ART`), con la clave igual al
nombre del nivel. Los tests verifican que la ficha sea coherente y que cada medalla tenga su dibujo.
