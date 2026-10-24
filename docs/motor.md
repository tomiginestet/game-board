# Game Board como motor

Game Board es un motor para armar apps de **comunidad + registro + medallas**: un club con carnet, cosas que
se anotan, números que salen de lo anotado y medallas ilustradas que premian esos números. Sobre el mismo
motor se arman distintas apps (**skins**), cada una con su marca, su catálogo y su forma de nombrar las cosas.

## Las tres capas

1. **Núcleo**: comunidad (club, integrantes, carnet, invitaciones), actividad (`GameDef`), registro (`Play`
   y su `log`), métricas (`Metric`), medallas (`AwardDef`, niveles, ilustraciones), progreso, sincronización
   sin conexión y permisos. El núcleo no tendría que saber qué es "ganar".
2. **Módulos**, que se prenden o se apagan por skin:
   - Competencia: lados, ganador, Elo, ranking, cinturones, torneos.
   - Anotadores: truco, sets, rondas, turnos.
   - Convocatorias.
   - Equipos y planteles.
   - Evolución personal (nuevo; ver Gimnasio).
3. **Skin**: marca (nombre, colores, fuente, logo, PWA), catálogo, módulos activos, glosario, voz e
   ilustraciones.

## Cómo funciona hoy un skin

- Vive en `src/skins/<id>/`: `brand.ts` (datos puros de la marca) e `index.ts` (catálogo, módulos y
  palabras). El tipo es `Skin` en `src/skins/types.ts`.
- Se elige **al compilar** con `VITE_SKIN=<id>` (por defecto `gameboard`). Un id que no existe frena el
  build. Cada skin es su propia app, con su dominio y su ícono, sobre la misma base de Supabase (como ya
  pasa con Ping Pong Club).
- `vite.config.ts` completa el `index.html` (título, descripción, pantalla de inicio, fuente, color de la
  barra) y arma el `manifest.webmanifest` con la marca.
- En la app, `skin.name` reemplaza a "Game Board"; `skin.catalog` decide qué juegos de fábrica se muestran
  y cuáles van destacados (los que quedan afuera se siguen reconociendo en partidas viejas); `skin.modules`
  saca de la navegación lo que no se usa; `skin.words` nombra las pestañas.

### Lo que falta mover al skin

- **Tema**: los colores viven en `src/index.css`. Un skin nuevo trae su `theme.css` que pisa las variables
  (`--bg`, `--accent`, `--font-brand`...) y lo importa desde su `index.ts`.
- **Logo e íconos**: `Logo.tsx`, `src/lib/logo.ts`, `public/favicon.svg`, `public/logo-secuencia.svg`.
- **Textos fuera del cliente**: `api/club.ts` y `api/club-og.ts` (vista previa de los links) y
  `src/lib/aiPrompt.ts` (se copia a la función de Supabase) siguen diciendo "Game Board".
- **Glosario completo**: hoy sólo la navegación y los títulos de pestaña. El resto de las pantallas dice
  "partida", "jugador" o "juego" escrito a mano; se migra a medida que un skin lo necesite.
- **Medallas generales** (`GLOBAL_FAMILIES` en `src/lib/medals.ts`): son de juegos ("Pulpo de mesa").
- **Base de datos**: una columna `app` en los clubes, para que cada app vea sólo sus clubes. Se agrega
  cuando salga el segundo skin.

## Skin Fútbol

**Referencias**: EA Sports FC / FIFA, transmisiones de TV, el zócalo del marcador, el álbum de figuritas.

- **Interfaz con lenguaje de partido**: marcador tipo zócalo de TV (escudos, minuto, resultado), formaciones
  sobre la cancha, fichas de jugador con números grandes (estilo carta de Ultimate Team), fixture y tabla
  de posiciones como en los programas deportivos.
- **Catálogo**: fútbol 5, 7, 8 y 11, futsal, fútbol tenis; nada de cartas ni juegos de mesa.
- **Módulos**: competencia, torneos (ligas y copas con fixture), convocatorias ("¿quién viene el jueves?"),
  equipos y planteles, goles, asistencias y figura.
- **Palabras**: partido (no partida), plantel, fecha, tabla, figura, convocados.
- **Medallas**: el mismo kit de estampa pero en clave de fútbol (botines, la red, el banco, la tribuna).
- **Inicio**: el equipo y el próximo partido primero; después la tabla y los goleadores.

Es el **primer skin a construir**: el dominio ya existe (los deportes del catálogo, equipos, estadísticas por
jugador), así que pone a prueba la capa de skin sin cambiar el motor.

## Skin Gimnasio

**Referencias**: Nike Training Club, Adidas Running. Sobrio, mucho blanco y negro, tipografía fuerte, un
solo color de acento, y **el progreso siempre a la vista** (la curva, la marca personal, la racha).

- **Cargar es lo más interactivo de la app**: elegir el ejercicio y anotar series × reps × kg con controles
  grandes (rueditas, +2,5 kg, repetir la serie anterior), descanso con temporizador, tiempo y distancia para
  cardio. Todo pensado para una mano, entre series.
- **El trainer arma todo**: ejercicios (con su medición: peso, reps, tiempo, distancia), rutinas, objetivos
  por alumno ("sentadilla 80 kg"), medallas propias y recomendaciones ("subí 2,5 kg la próxima").
- **Por ahora el trainer marca el progreso**: él anota o valida, el alumno mira lo suyo. Más adelante el
  alumno podría proponer y el trainer confirmar.
- **También sirve solo**: una persona sin trainer lleva su propio progreso; es "un club de uno" donde la
  misma persona es trainer y alumno.
- **Sin ranking contra otros**: cada uno compite contra sí mismo (evolución en el tiempo, marcas personales,
  "tu mejor mes"). Los alumnos no ven los datos de los demás; el trainer ve a todos.
- **Palabras**: alumno (no jugador), sesión o entrenamiento (no partida), ejercicio (no juego), grupo o
  equipo del trainer (no club, a definir).

### Lo que el motor necesita para el gimnasio

- **Registro individual por medición**: un modo nuevo, sin lados ni ganador; cada registro es una lista de
  ejercicios con sus series.
- **Métricas de progreso propio**: marca personal por ejercicio, mejora contra la primera vez, volumen,
  racha de semanas yendo (por calendario), asistencia, "llegó a la meta".
- **Objetivos por persona**: una medalla que el trainer arma para un alumno en particular. Hoy las medallas
  son por juego, no por persona.
- **Medallas otorgadas a mano**: un tipo de métrica que no se calcula, la desbloquea el trainer.
- **Rol de entrenador** en `access.ts` y en las reglas del servidor: sólo él anota y valida.
- **Privacidad entre integrantes**: cada alumno ve lo suyo. Se resuelve con reglas en Supabase (RLS), no
  escondiendo cosas en la pantalla.

## Hoja de ruta

1. ✅ Sacar la configuración de skin, con Game Board como skin por defecto y sin cambiar la app.
2. Skin Fútbol: tema, logo, catálogo, palabras e inicio propios; columna `app` en los clubes.
3. Módulo de evolución personal y skin Gimnasio.
