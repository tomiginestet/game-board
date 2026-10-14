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

- **Biblioteca de juegos**: vienen 97 de fábrica (truco, Catán, buraco, Skull King, El Impostor, Pistas cruzadas,
  ta-te-ti, chinchón, generala, La Podrida, TEG, Código Secreto, Dixit, Carcassonne, ¡Aventureros al tren!,
  Mario Kart, EA FC, Among Us…) y se pueden **agregar más**.
  - **Cartas coleccionables** (TCG/LCG): Magic, Pokémon TCG, Yu-Gi-Oh!, Lorcana, One Piece, Mitos y Leyendas,
    Flesh and Blood, Digimon, Dragon Ball Super, Star Wars: Unlimited, Riftbound, Marvel Champions y Arkham Horror LCG;
    más Hearthstone y Marvel Snap en videojuegos. Se anotan al mejor de N games y cada uno trae sus formatos como
    opción de la partida (Commander, Draft, Speed Duel, Primer Bloque…).
  - **Deportes**: de raqueta y red (pádel, tenis, fútbol tenis, vóley, beach vóley, pickleball, bádminton, squash,
    pelota paleta), de equipo (fútbol 5, fútbol 7/11, futsal, básquet, básquet 3x3, handball, hockey, rugby, ultimate),
    de precisión y de bar (pool, metegol, dardos, bowling, bochas, petanca, tejo, sapo, minigolf, golf, cornhole,
    beer pong) y de marcas y tiempos (running, natación, ciclismo, escalada, penales, tiros libres, travesaño).
  - Para sumar otros:
    - **con IA gratis**: la app arma el pedido, lo pegás en cualquier chat (Claude, ChatGPT…) y pegás la respuesta;
    - **con IA automática**: un botón que usa la API de Claude, con tope de gasto mensual (USD 10);
    - **a mano**: un editor de fichas (o el JSON completo).
- **Cada juego se anota a su manera** según su ficha:
  - *marcador en vivo* (truco con fósforos, ta-te-ti al mejor de N);
  - *por manos* (buraco, chinchón con eliminación, generala por categorías, Skull King y La Podrida con apuestas y bazas);
  - *por turnos con puntaje oculto* (Catán: turnos, poblados, ciudades, camino más largo, ejército, cartas ocultas);
  - *resultado final* (orden de llegada, puntajes, roles secretos como impostor/tripulante);
  - *cooperativo* (se gana o se pierde todos juntos);
  - *por sets*, punto a punto (pádel y tenis con 15-30-40, punto de oro, tie-break y super tie-break; vóley,
    fútbol tenis y bádminton con sets a N puntos);
  - *por tiempos* (carreras: se carga 25:14 y gana el más rápido).
  - El ping pong usa el marcador del Ping Pong Club, punto a punto.
- **Torneos según el juego**: eliminación directa, liga, mesas rotativas (para juegos de 3 a 6, con mesa final)
  y partida acumulada. Con premio o castigo en texto libre.
  - **Fecha y cancha**: el fixture sale con día, hora y cancha de cada partido (una fecha por semana, cada dos, todo
    el mismo día…); los partidos de una fecha se reparten entre las canchas y cada uno se puede reprogramar. Los
    próximos partidos aparecen en el inicio.
  - **Goleadores del torneo** y figuras, en los deportes que los llevan.
  - La tabla de las ligas muestra perdidos, goles (o puntos) a favor, en contra y la diferencia.
- **Convocatorias** ("¿quién viene el jueves?"): día, cancha y citados (el plantel de un equipo o los de siempre).
  Se manda al grupo por WhatsApp, cada uno marca Voy / Capaz / No voy y con los que van se arman los equipos parejos;
  la convocatoria pasa a ser el partido. Los partidos del fixture también tienen su previa con quién viene.
- **Cronómetro** en los deportes por tiempo (fútbol, futsal, básquet, handball, hockey, rugby): períodos, pausa y aviso
  al cumplirse el tiempo; cada gol guarda su minuto.
- **Saque** en los deportes por sets: en tenis y pádel cambia en cada game (en el tie-break, de a dos) y en dobles
  rota dentro de la pareja; en vóley, fútbol tenis o bádminton saca el que ganó el punto.
- **Equipos fijos del club** (el fútbol 5 de los jueves, la pareja de pádel): nombre, escudo, color, plantel, capitán
  y cancha de local. Juegan partidos y se anotan en ligas y torneos con su plantel; cada equipo tiene su campaña
  (G-E-P, goles a favor y en contra, últimos resultados), su tabla de goleadores y sus próximos partidos.
- **Estadísticas por jugador dentro del equipo**: en los deportes de equipo cada gol (o punto) se le anota a quien lo
  hizo, con su asistencia; las tarjetas, atajadas o tapas, a quien las hizo; y al final se elige la figura. Salen
  tablas de goleadores (del juego, del equipo y del torneo) y medallas como Hat-trick, Pasador, Figura o Valla invicta.
- **Equipos parejos**: al armar una partida por equipos, un botón reparte a los que vinieron según su Elo en ese juego
  (o en deportes parecidos, si nunca lo jugaron) y muestra las chances de cada lado.
- **Rankings**: puntos de gloria (normalizados por tamaño de mesa y peso del juego), victorias, ELO por juego,
  todoterreno (juegos distintos ganados) y **cinturones** por juego. Por temporada: siempre, año, mes o semana.
- **Medallas** con ilustraciones propias y niveles bronce → leyenda:
  - generales (todos los juegos juntos), genéricas de cada juego (sirven aunque el juego no tenga premios propios)
    y **propias de cada juego** (Ruta 40 en el Catán, Cantor de envidos en el truco, Rey del heno…);
  - los juegos agregados por el grupo o por la IA usan dibujos genéricos, dibujados con el mismo estilo de estampa
    y un toque del color del juego.
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

## Métricas

- **Uso de los clubes** (Supabase): el esquema `metricas` (`supabase/migrations/20261014000000_metricas.sql`) tiene
  vistas para el editor SQL: `metricas.resumen` (lo principal en una fila), `metricas.semanal` (clubes activos,
  partidas, clubes y cuentas nuevas, IA), `metricas.juegos` (los más anotados) y `metricas.retencion` (si los clubes
  vuelven 1 a 4 semanas después). No está en la API: la app no lo puede leer. Sólo cuenta lo que se sincronizó.
- **Visitas** (Vercel Web Analytics, sin cookies): `src/components/Visits.tsx`. Se manda sólo la pantalla genérica
  (`/unirse/:code`, `/juegos/:id`), nunca la dirección real, que puede llevar el código secreto del club
  (`src/lib/visits.ts`). Hay que activar Web Analytics en el proyecto de Vercel; en desarrollo no se manda nada.

## Panel de administración

`#/admin` (también desde Perfil → Panel de admin). Sólo lo ven las cuentas de la tabla `app_admins` que entraron con
Google; cada función `admin_*` lo verifica en el servidor (`supabase/migrations/20261015000000_admin.sql`).

- **Resumen**: cuentas, personas activas por día, clubes, partidas, juegos agregados, gasto de IA, retención y
  los juegos más anotados (con las vistas de `metricas`).
- **Personas, clubes y juegos agregados**: ver todo, editar clubes, cambiar el dueño, cortarle la IA a alguien, bajar
  datos en JSON, y **desactivar** (y reactivar) cuentas y clubes. Por ahora el panel no borra filas: una cuenta
  desactivada no puede entrar; un club desactivado deja de sincronizar en las dos apps y sale del buscador.
- **Papelera**: juegos, partidas, jugadores y torneos que se borran desde el panel se marcan como borrados, igual que
  desde la app (así llega a todos los dispositivos), y se pueden recuperar durante 30 días.
- **Reportes**: con cuenta se puede reportar un club público o una persona desde el buscador.
- **Control**: apagar la IA o cambiar sus topes (la función `generate-game` lo respeta), un anuncio arriba de la app
  y mensajes a todas las cuentas, a un club o a una persona (llegan a las notificaciones).
- **Salud**: clubes vacíos, abandonados, desactivados o sin dueño, cuentas sin perfil y partidas rotas o colgadas.
- **Registro**: todo lo que se hizo desde el panel (`admin_log`).
- Desde esta versión se guarda quién sube cada cosa (`entities.created_by`): lo anterior figura como "autor desconocido".
- Para sumar otro admin: `insert into public.app_admins (user_id) select id from auth.users where email = '…';`

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

Un archivo en `src/lib/games/catalog/<id>.ts` que exporte un `GameDef` (se carga solo). Cada nivel de sus medallas
lleva su ilustración propia en `src/lib/art/nuevas/<id>.ts` (un `Record` exportado con nombre terminado en `_ART`, con
la clave igual al nombre del nivel), dibujada con el kit de `src/lib/art/kit.ts` y el lenguaje de
[docs/medallas-filosofia.md](docs/medallas-filosofia.md). Los juegos del catálogo no usan los dibujos genéricos
(`glyph`): los tests verifican que la ficha sea coherente y que cada medalla tenga su ilustración.
