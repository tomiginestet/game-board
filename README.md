# 🎲 Game Board

Web app para llevar el historial de juegos con amigos: juegos de mesa, cartas, de fiesta, cooperativos,
deportes y videojuegos. Partidas, torneos, rankings y medallas ilustradas, con el mismo espíritu (y la misma base
de datos) que el [Ping Pong Club](https://github.com/tomiginestet/ping-pong-web-app).

## Qué hace

- **Catálogo tipo Steam / Game Pass**: carátulas generadas para cada juego (dibujo por categoría, color y emoji del juego;
  los juegos del grupo pueden usar una imagen propia con `cover`), carrusel de destacados, estantes por categoría y
  un catálogo completo con buscador, filtros y orden.
- **Cuentas, grupos y amigos**:
  - al entrar: cuenta (Google o link por mail), perfil con @usuario y un onboarding para crear un grupo, buscar uno,
    entrar con un link o ir a buscar amigos. También se puede usar sin cuenta, como antes;
  - una cuenta puede estar en **varios grupos** y cambiar entre ellos desde la barra de arriba (los datos de cada grupo
    quedan guardados en el dispositivo, así el cambio es instantáneo);
  - grupos **públicos** (aparecen en el buscador; se pide permiso para entrar y le llega una notificación al dueño y
    a los admins) o **privados** (invitación a un usuario o link);
  - roles: dueño, admins (aceptan solicitudes, sacan gente) e integrantes (invitan);
  - **amigos** por @usuario y **mano a mano**: cada dupla es un grupo de dos con su historial;
  - **notificaciones** (solicitudes, invitaciones, amistades) en tiempo real;
  - **ranking de cada grupo** (el de siempre) y **ranking global** (todas las cuentas, todos los grupos).

- **Biblioteca de juegos**: vienen 60 de fábrica (truco, Catán, buraco, Skull King, El Impostor, Pistas cruzadas,
  ta-te-ti, chinchón, generala, La Podrida, TEG, Código Secreto, Dixit, Carcassonne, ¡Aventureros al tren!,
  Mario Kart, EA FC, Among Us…) y se pueden **agregar más**.
  - **Cartas coleccionables** (TCG/LCG): Magic, Pokémon TCG, Yu-Gi-Oh!, Lorcana, One Piece, Mitos y Leyendas,
    Flesh and Blood, Digimon, Dragon Ball Super, Star Wars: Unlimited, Riftbound, Marvel Champions y Arkham Horror LCG;
    más Hearthstone y Marvel Snap en videojuegos. Se anotan al mejor de N games y cada uno trae sus formatos como
    opción de la partida (Commander, Draft, Speed Duel, Primer Bloque…).
  - Para sumar otros:
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

Las dos apps comparten el proyecto de Supabase. Los grupos son los mismos clubes (con dueño, descripción, emoji y
visibilidad); amigos, solicitudes, invitaciones, notificaciones y el ranking global están en
`supabase/migrations/20261013000000_groups_social.sql`. El código de un grupo sigue siendo secreto: el buscador nunca
lo devuelve y sólo llega a quien entra (por link, invitación aceptada o solicitud aceptada). En la tabla `entities`, los tipos `player`, `match` y `tournament`
son los del Ping Pong Club (las dos apps los leen y escriben con el mismo formato) y Game Board agrega `play`
(partida de cualquier juego), `cup` (torneo) y `game` (juego agregado por el grupo). `pull_changes` sigue
devolviendo sólo lo de ping pong; Game Board usa `pull_changes_all`. Ver `supabase/migrations/`.

La app funciona offline: todo se guarda en el navegador y, si el dispositivo está en un club, se sincroniza.

## IA

- `src/lib/aiPrompt.ts` arma el pedido (el mismo para el modo gratis y para la API) con el esquema de las fichas
  (`src/lib/games/schema.ts`) y la ficha del Catán como ejemplo.
- `supabase/functions/generate-game` llama a la API de Claude. Necesita el secreto `ANTHROPIC_API_KEY`;
  opcionales: `AI_MODEL`, `AI_MONTHLY_LIMIT_USD` (10) y `AI_DAILY_PER_USER` (10). La función usa una versión
  resumida del esquema (`sources.ts`, más barata por llamada): si cambia el esquema, actualizarla. Después de
  cambiar el pedido: `npm run build:ai` y volver a publicar la función.

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
