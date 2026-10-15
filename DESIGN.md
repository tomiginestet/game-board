---
name: Game Board
description: Partidas, torneos y quién manda en cada juego.
colors:
  bg: "#0d1117"
  bg-2: "#161b22"
  card: "#1c2330"
  card-2: "#242d3d"
  border: "#2d3748"
  border-strong: "#6b7a93"
  text: "#f0f3f8"
  muted: "#9aa5b8"
  accent: "#ff6b35"
  accent-fill: "#c94412"
  accent-fill-hover: "#b93c0e"
  accent-2: "#ffb400"
  win: "#22c55e"
  loss: "#f87171"
  loss-fill: "#c81e1e"
  text-soft: "#d5dbe6"
  accent-soft: "#ffb08f"
  info: "#60a5fa"
  ai-soft: "#e5d9ff"
  on-fill: "#ffffff"
  ink: "#000000"
  logo-orange: "#ff6b35"
  logo-blue: "#4c8dff"
  logo-green: "#22c55e"
  logo-violet: "#b98cff"
typography:
  score:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "72px"
    fontWeight: 900
    lineHeight: 1
  score-sm:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: 1
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  display:
    fontFamily: "Lilita One, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1
  brand:
    fontFamily: "Lilita One, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.1
  h1:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.2
  h2:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
  lead:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  secondary:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  small:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  xs: "4px"
  sm: "8px"
  md: "10px"
  control: "12px"
  card: "16px"
  hero: "20px"
  sheet: "22px"
  pill: "999px"
spacing:
  page-x: "16px"
  section: "20px"
  stack: "12px"
components:
  button-primary:
    backgroundColor: "{colors.accent-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-fill-hover}"
  button-secondary:
    backgroundColor: "{colors.card-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    height: "44px"
  button-danger-fill:
    backgroundColor: "{colors.loss-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    height: "44px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
    padding: "16px"
  input:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    height: "44px"
---

# Design System: Game Board

## Overview
Una app de uso nocturno y en ronda: fondo oscuro azulado, tarjetas apenas más claras y un naranja cálido que marca la acción. La personalidad vive en tres lugares precisos: el **logo de cuatro cuadraditos** (con una animación distinta por momento), las **carátulas y medallas ilustradas** y la **voz rioplatense**. El resto de la interfaz es deliberadamente familiar (modo *Operate*): controles estándar, estados completos y nada que distraiga del juego.

## Colors
Tema oscuro único (`color-scheme: dark`), elegido por el uso: juntadas con poca luz.

### Primary
- **Naranja de acción** (`accent-fill` #c94412): rellenos con texto blanco (botón principal, chip activo). 4.9:1 con blanco.
- **Naranja de texto** (`accent` #ff6b35): íconos, bordes y texto naranja sobre fondo oscuro.

### Secondary
- **Dorado** (`accent-2` #ffb400): links, foco, gloria y el ganador en el logo.

### Neutral
`bg` → `bg-2` → `card` → `card-2`: cuatro escalones de superficie. `muted` (#9aa5b8) pasa AA en todas. `border` es decorativo; **`border-strong` (#6b7a93) es el borde de los controles** (inputs, interruptores, puntitos), ≥3:1.

### Named Rules
- **El estado nunca es sólo color.** Guardado: ícono + texto. Resultado: etiqueta "Ganó/Perdió". Selección: forma o ícono además del color.
- **Rojo con dos versiones**: `loss` para texto sobre tarjeta (AA), `loss-fill` para rellenos con texto blanco.

## Typography
- **Interfaz: fuente del sistema** (rápida, familiar, sin descarga). Nada de Inter.
- **Marca: Lilita One** sólo en el título del inicio, el nombre de la app, la bienvenida, medallas y celebraciones.
- Escala fija en px, sin tamaños menores a **12px**. Números comparables con `.num` (`tabular-nums`).

### Hierarchy
display 44 (marca) · brand 32 · h1 28/800 · title 24 · h2 20/700 · lead 18 · cuerpo 16 · secundario 14 · small 13 · label 12/600. El marcador de ping pong usa tamaños fluidos propios (pantalla completa).

## Layout
Columna única de hasta 680px, 16px de margen lateral, 20px entre secciones. Barra de navegación fija abajo (64px). Las filas horizontales (carrusel, estantes) se salen del margen a propósito para insinuar que se desplazan; con mouse muestran una barra fina.

## Elevation & Depth
Profundidad por escalones de superficie, no por sombras. Sombras sólo en lo que flota: avisos y diálogos (`0 8px 24px` / `0 16px 48px`, negras).

## Shapes
Escala: 4 · 8 · 10 · 12 (botones e inputs) · 16 (tarjetas y filas) · 20 (carátulas y hero) · 22 (hojas y diálogos) · píldora.

## Components

### Buttons
Alto mínimo **44px** (40px en `.btn.small`). Primario naranja relleno; secundario `card-2` con borde; `danger` (borde rojo) para la acción destructiva en pantalla y `danger-fill` dentro del diálogo de confirmación. El texto es siempre **verbo + objeto**.

### Chips
"Jugar de nuevo" en el inicio: píldora de 44px con el ícono del juego.

### Selección
- **Opciones chicas** (chip, control segmentado): elegida = relleno naranja con texto blanco.
- **Opciones grandes** (emoji, formato de torneo, jugador, fila de lista): elegida = borde de 2px + tinte del 12%. El grosor es la pista que no depende del color. En el selector de jugadores el color es el del jugador (`--sel`).
- **Colores**: anillo doble alrededor del círculo elegido.
- Siempre con `aria-pressed` o `aria-checked`.

### Cards / Containers
`.card`: fondo `card`, borde `border`, radio 16px, padding 16px. Nunca tarjetas dentro de tarjetas.

### Medallas
La medalla es la protagonista: siempre **arriba y centrada**, con el texto debajo, también centrado. El largo del texto nunca depende de cuántas medallas hay.
- **Familia completa** (ficha del juego, vista previa de un juego con IA): `MedalList` + `MedalListRow` (`src/components/MedalList.tsx`). Una `.card` por familia con los tres primeros niveles a 64px; si hay más, una chapita "+N" cuelga al costado sin correr las medallas. Debajo: nombre (18/700), lo que mide (`muted` 14) y quién llegó más alto (corona Phosphor rellena + nombre en `accent-2`) o "Nadie la tiene todavía". En pantallas anchas, de a dos.
- **Una medalla por familia** (Vitrina, perfil del jugador): la del nivel más alto, sobre la misma superficie `card`. Ganada: borde dorado sólido; bloqueada: borde punteado y medalla en gris (el estado nunca es sólo color). La barra de progreso o los puntos de nivel van al pie, para que queden alineados en cada fila.
- Cada medalla abre su ficha (`MedalSheet`); la ficha es la que muestra todos los niveles, así que las listas no repiten los nombres de los niveles (salvo la vista previa, donde se están revisando).

### Pantalla del club y del equipo
Una vista consolidada de sus jugadores (`src/components/Squad.tsx`, con `ids` para limitarla a un plantel). En el club (la primera pestaña) el orden es: presentación → lo que pide acción (pedidos para entrar) → anotar y jugar de nuevo → en juego y próximos partidos → juegos del club → quién manda (podio de gloria, el primero al medio) → torneos en curso → medallas a la vista → últimas partidas → vitrina (hasta 4) → equipos → integrantes (filas sin tarjeta, con "Invitar al club" al pie). Lo administrativo no va acá: está en **Gestionar club**.
- **Presentación**: una `.card` con una fila arriba: el emoji a 72px a la izquierda y el engranaje de **Gestionar club** a la derecha, centrados entre sí. Debajo, el nombre a todo el ancho (así no se parte en dos), la privacidad y las cuentas como texto con ícono, la descripción a todo el ancho y los cuatro números del club en una franja (columnas separadas por líneas finas, sin cajas). El guardado ya está en el selector de club, no se repite. El engranaje lleva la cantidad de pedidos para entrar.
- **Pedidos para entrar**: una `.card.highlight`; cada pedido es quién (avatar, nombre, @usuario y cuándo), su mensaje en un globo y debajo dos botones del mismo ancho, Aceptar (primario) y Rechazar. Nunca todo en una fila.
- **Gestionar club** (`/club/gestion`): pedidos para entrar → filas de ajustes (`.settings-row`: ícono dorado, título, detalle y flecha) para los datos y los juegos del club → Invitar (el link y "Compartir link" primero, después buscar cuentas, el link corto y la tarjeta para imprimir) → Cuentas, después de una `.section-divided`. En cada cuenta, las acciones ("Hacer admin", "Sacar del club") van como links debajo del nombre.
### Vos
Una sola pantalla para tu cuenta y tu lugar en el club activo (`/perfil`; la pestaña muestra tu avatar). Arriba, tu encabezado de jugador (avatar, nombre, gloria y puesto en el club) con editar perfil; después tu rol en el club, quién sos (si falta), el carnet, tus próximas medallas y tus números (como el perfil del jugador). Al final, después de una `.section-divided`, **Tu cuenta** con filas de ajustes (clubes, amigos, ranking global, ajustes) y, a todo el ancho, "Salir de <club>" (peligro) y "Cerrar sesión" (secundario).
### Listas de pasos (reglas)
`RuleList`: pasos numerados sin tarjeta y **sin líneas entre puntos**, separados por aire (20px, interlineado 1.5). El número va en un círculo de 24px bajado 1px para quedar ópticamente centrado con la primera línea. Íconos y notas al pie se alinean a la columna del texto (36px), no al borde.

### Separar secciones
Una sola línea (`.section-divided`: borde superior + 24px) separa dos secciones de naturaleza distinta (medallas → reglas). Adentro de una sección, aire en vez de divisores; las líneas entre filas quedan para listas densas de datos (la ficha de la medalla, "Medallas a la vista").

### Jerarquía de datos
- **Una pastilla se toca o marca un estado.** Los datos descriptivos van como texto o en una franja, nunca como una fila de pastillas que no hacen nada.
- **Ficha del juego**: la categoría va en la flecha de volver ("← Cartas") y el origen (IA, del club) a su lado. Lo práctico va en `.gd-spec`: columnas iguales (jugadores, peso, cómo se anota) separadas por líneas finas, sin cajas. Lo del club arranca en "En el club · N partidas" (cinturón y ranking).
- **Un número protagonista por pantalla.** Los demás van en una frase, en una lista de etiqueta y valor (`.pd-ledger`, separada por aire) o en una tabla. Nada de grillas de cajas iguales con un número adentro. Un dato se cuenta una vez: partidas, victorias y porcentaje son una frase y una barra.
- **Perfil del jugador**: encabezado a la izquierda (avatar, nombre, gloria y puesto), las victorias como número protagonista con la barra G/E/P, la "Forma" (últimas 8 partidas con letra G/P/E además del color) y "Sus juegos" como tabla (V–D, puesto en el club, Elo); tocar una fila la abre con la curva de Elo.
- **Comparables en columna**: varios elementos del mismo tipo (juegos, sets) van en una tabla alineada antes que en tarjetas o chips de a uno.
- **Planilla de sets** (`SetSheet`): una columna por set, el ganador del set en blanco y negrita, el total al final de la fila, como en el tenis. Es la única forma de mostrar sets (lista de partidas y resultado).
- **Marcador chico** (`MiniScore`, por manos y por turnos): una franja de columnas separadas por líneas finas, sin cajas ni avatares; el primero con el total en dorado y corona, a quien le toca con una raya de su color al pie.
- **Resumen de una partida**: el logo del podio y el ganador arriba; el podio como filas sin cajas (puesto, avatar, nombre, puntaje y Elo ganado o perdido); las medallas nuevas grandes y centradas debajo del podio, no detrás de un botón.
- **Resultado**: el trofeo es una chapita sobre el avatar del ganador (no un ícono aparte), el título en Lilita, la planilla, el Elo en una línea ("+16 → 1016") y la medalla nueva grande y centrada con su nombre y su chiste debajo.

### Marcador en vivo
Para los juegos que se anotan en vivo (bochas, básquet, truco, fútbol), el mismo lenguaje que el ping pong:
- **Tira de TV** arriba (`ScoreStrip`): reloj de la partida, lo último anotado ("Último: +2 de Tomi", confirma el toque) y una fila por lado con sus jugadas y el puntaje; el que va ganando, en naranja.
- **Pantalla completa**: mientras se juega no hay barra del club ni navegación de abajo; sólo volver, el nombre del juego y la barra de Deshacer / Terminar.
- **Pestañas Marcador / Jugadas.** En Marcador, dos formas según el partido:
  - **Partido único de dos lados** (bochas, básquet, truco): dos columnas, cada una con su zona grande (tocar suma) y debajo sus jugadas en lista, una por fila, de 48px, con el nombre (sin emoji) y su contador. Arriba, sólo el reloj y lo último anotado. Si hay meta, cada columna lleva su propia barra al pie con lo que le falta ("Faltan 11"); nunca una barra compartida entre los dos lados.
  - **Con sets o más de dos lados**: tira de TV (`ScoreStrip`) y una banda de todo el ancho por lado, con las jugadas al pie.
  - El "+2" de los juegos que lo tienen es un botón propio. El contador en cero sólo aparece en las jugadas que no suman puntos (las que cuentan para medallas).
- **Atajos de teclado**: funcionan siempre, pero la leyenda sólo se muestra en pantallas de compu (900px o más, con mouse).
- **Por turnos**: la barra de abajo es sólo Deshacer (ícono) y "Pasar turno", que ocupa el resto (naranja, con "a Juli" debajo). Terminar es el banderín de la cabecera y pregunta antes de cerrar (o abre el formulario de cierre, que tiene "Seguir jugando"). Arriba, en la franja fija, sólo "Turno 6 · le toca a Tomi"; con más de 5 jugadores, la franja va en filas de 4 para que se vean todos los puntajes.
- **Por turnos** (Catán): sólo va abierta la tarjeta del que juega; las demás muestran su cabecera (nombre y puntaje) y se abren al tocarla. Usa las mismas pestañas Marcador / Jugadas. **Por manos** no las necesita: la tabla de manos ya es el relato.
- **Jugadas** (`BoardTabs`) es el relato de la partida; lo oculto (cartas de Catán) nunca aparece. Con dos lados muestra el marcador entero de cada momento ("5–4"); con más, el total de quien anotó ("total 7"); los pases de turno van en filas bajas y apagadas.
- El relato: minuto, color del lado, qué pasó, quién y el marcador de ese momento. Cualquier jugada se borra con su ✕, y el aviso ofrece deshacer. La ayuda ("Qué es cada jugada") va al pie de esta pestaña.

### Listas del club
- **En juego** (inicio): una lista, no tarjetas. Cada fila: juego, quiénes (o a quién le toca), el marcador y hace cuánto empezó; descartar es un ícono discreto al costado (con deshacer).
- **Filas de partidas** (`PlayRow`): se leen como la planilla. Arriba el juego y la fecha; abajo el ganador con corona y su puntaje; debajo, el resto en orden ("2º Juli · 3º Nico") o "contra Nico". Nunca una fila de avatares que se parte en dos líneas.
- **Podio de gloria**: el escalón lleva el número (la altura y el número dicen lo mismo) y debajo una línea de rivalidad ("Valen le lleva 292 de gloria a Tomi"). Sin medallitas 1-2-3.
- **Rankings** (`.ranking`): filas separadas por líneas finas, sin tarjetas; el primero con el puesto y el valor en dorado. El del club es una tabla (`.rank-table`) con encabezados: puesto, persona, columna del medio (V / P, Efect., V–D) y el valor. Los filtros van sin emoji y la explicación de cómo se calcula, al pie.
- **Filtros de una lista** (`.filters`): las filas van juntas (8px). Qué mirar (Todas / Ganadas, Siempre / Este mes) va en un segmentado discreto (`.segmented.quiet`); de qué juego o categoría, en chips, que son el único naranja de los filtros. Sin emoji en los filtros ni en los títulos de sección. Una tercera fila (`.chips.sub`) marca lo elegido con borde, sin relleno.
- **Récord de un equipo**: igual que el del perfil (victorias, barra, forma y los tantos en una frase); nunca cajas con números.
- **Jugadores, equipos y torneos** (`.rows`): listas sin tarjetas.
- **Jugadores**: lista sin tarjetas ordenada por gloria, con el detalle en una línea y la gloria en dorado sin ícono.

### Inputs / Fields
Siempre con etiqueta visible (`.field` + `.field-label`); el placeholder es un ejemplo, no la etiqueta. Errores debajo del campo, enlazados con `aria-describedby`.

### Navigation
Barra inferior de 5 pestañas con ícono relleno y texto en la activa. Con cuenta y club: **Club** (la pantalla del club: anotar, lo que está en juego, los juegos del club, quién manda, medallas, últimas partidas y su gente), **Juegos** ("Para jugar hoy" arriba y el catálogo completo con buscador), Torneos, Ranking y **Vos** (tu cuenta y tu lugar en ese club, con tu avatar como ícono). Sin club, la primera es Inicio; sin cuenta, Inicio y Jugadores. Arriba: selector de club (con estado de guardado) y notificaciones.

### Feedback
- **Aviso** (`toast`): abajo, sobre la navegación, `aria-live`. Con acción "Deshacer" cuando algo se borró y se puede recuperar.
- **Diálogo de confirmación** (`<dialog>` modal): sólo para lo irreversible. Foco inicial en "Cancelar", Escape cierra, el foco vuelve al botón que lo abrió.
- **Errores**: `role="alert"`, texto de `friendlyError()` (qué pasó + cómo seguir).

### Signature: logo animado
Cuatro cuadraditos (naranja, azul, verde, violeta; dorado para el ganador) animados en SMIL con una coreografía por momento (`src/lib/logo.ts`). Con movimiento reducido se muestra un cuadro fijo.

## Do's and Don'ts

### Do:
- Poner la acción de anotar arriba y lo del club antes que el catálogo.
- Usar íconos Phosphor en la interfaz; emoji sólo los que elige la gente o en textos con humor.
- Medallas arriba y centradas, texto abajo; la corona del líder es un ícono, no el emoji 👑.
- Ofrecer "Deshacer" en vez de preguntar cuando se puede.
- Con movimiento reducido, reemplazar desplazamientos por fundidos cortos (no apagar todo).

### Don't:
- Rótulos chiquitos en mayúsculas arriba de los títulos (kickers/eyebrows).
- Bordes laterales gruesos de color (para estado o para identificar jugadores: se tiñe la superficie).
- Una línea divisoria en cada fila de una lista corta de texto, o una caja por punto: separa con aire.
- Texto menor a 12px, objetivos táctiles menores a 44px.
- `window.confirm/alert/prompt`.
- Mostrar errores técnicos o en inglés.
- Grillas de cajas iguales con un número y una etiqueta (la plantilla de "número grande").
- Filas de pastillas que mezclan datos de distinta naturaleza (qué es, cómo se juega, qué pasó en el club).
