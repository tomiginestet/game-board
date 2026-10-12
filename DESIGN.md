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
  logo-orange: "#ff6b35"
  logo-blue: "#4c8dff"
  logo-green: "#22c55e"
  logo-violet: "#b98cff"
typography:
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
  h2:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
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
  sm: "10px"
  md: "12px"
  card: "16px"
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
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-fill-hover}"
  button-secondary:
    backgroundColor: "{colors.card-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    height: "44px"
  button-danger-fill:
    backgroundColor: "{colors.loss-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: "44px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
    padding: "16px"
  input:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
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
brand 32 · h1 28/800 · h2 19/700 · h3 16 · cuerpo 16 · small 13 · label 12/600.

## Layout
Columna única de hasta 680px, 16px de margen lateral, 20px entre secciones. Barra de navegación fija abajo (64px). Las filas horizontales (carrusel, estantes) se salen del margen a propósito para insinuar que se desplazan; con mouse muestran una barra fina.

## Elevation & Depth
Profundidad por escalones de superficie, no por sombras. Sombras sólo en lo que flota: avisos y diálogos (`0 8px 24px` / `0 16px 48px`, negras).

## Shapes
Botones e inputs 12px, tarjetas 16px, carátulas y hero 20px, hojas y diálogos 22px, chips y píldoras redondas.

## Components

### Buttons
Alto mínimo **44px** (40px en `.btn.small`). Primario naranja relleno; secundario `card-2` con borde; `danger` (borde rojo) para la acción destructiva en pantalla y `danger-fill` dentro del diálogo de confirmación. El texto es siempre **verbo + objeto**.

### Chips
"Jugar de nuevo" en el inicio: píldora de 44px con el ícono del juego.

### Cards / Containers
`.card`: fondo `card`, borde `border`, radio 16px, padding 16px. Nunca tarjetas dentro de tarjetas.

### Inputs / Fields
Siempre con etiqueta visible (`.field` + `.field-label`); el placeholder es un ejemplo, no la etiqueta. Errores debajo del campo, enlazados con `aria-describedby`.

### Navigation
Barra inferior de 5 pestañas (Inicio, Juegos, Torneos, Ranking, Club/Jugadores) con ícono relleno y texto en la activa. Arriba: selector de club (con estado de guardado), notificaciones y perfil.

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
- Ofrecer "Deshacer" en vez de preguntar cuando se puede.
- Con movimiento reducido, reemplazar desplazamientos por fundidos cortos (no apagar todo).

### Don't:
- Rótulos chiquitos en mayúsculas arriba de los títulos (kickers/eyebrows).
- Bordes laterales gruesos de color para indicar estado.
- Texto menor a 12px, objetivos táctiles menores a 44px.
- `window.confirm/alert/prompt`.
- Mostrar errores técnicos o en inglés.
