---
target: flujo anotar una partida
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/home/user/game-board/src/pages/PlayScreen.tsx"
target_fingerprint: "sha256:9b7a60dcf2031364a8898e587223f2f64728f1155652a3d56ea79a66fb3dcba9"
target_path: /home/user/game-board/src/pages/PlayScreen.tsx
timestamp: 2026-10-12T23-24-32Z
slug: src-pages-playscreen-tsx
---
# Crítica: flujo "anotar una partida" (inicio → catálogo → ficha → armado → partida → resumen)

Method: dual-agent (A: revisión de diseño · B: detector + navegador)

## Puntaje: 27/40 (aceptable)
| # | Heurística | Puntaje | Problema principal |
|---|---|---|---|
| 1 | Visibilidad del estado | 3 | El punto final salta al resumen sin pausa. |
| 2 | Coincidencia con el mundo real | 3 | Generala obliga a llenar las categorías en orden fijo ("Cargar 1"). |
| 3 | Control y libertad | 3 | "Corregir" deja la partida en 15/15 sin guía; deshacer arriba a la derecha. |
| 4 | Consistencia | 3 | "biblioteca", "premios", rótulos en mayúsculas en la ficha de medalla. |
| 5 | Prevención de errores | 2 | Suma al apoyar el dedo (pointerdown); generala se cierra a mitad sin aviso; la navegación queda a mano. |
| 6 | Reconocer en vez de recordar | 3 | Líder de generala solo por color dorado; jugador de turno de Catán fuera de pantalla. |
| 7 | Flexibilidad y eficiencia | 2 | "Anotar una partida" lleva al catálogo de 45 juegos (4+ toques). |
| 8 | Estética y minimalismo | 3 | Truco: 14 chips en una columna; Catán: 15 steppers. |
| 9 | Recuperación de errores | 3 | Diálogo de puntos amable. |
| 10 | Ayuda | 2 | La ayuda de cada evento solo está en `title`: invisible en el celular. |

## Especificidad del diseño
Auténtica: fósforos, malas/buenas, falta envido sugerida, Catán por turnos con puntaje oculto, medallas ilustradas. Punto débil: el resumen final es una tarjeta genérica (🏆 + nombre). El detector no encontró antipatrones en el flujo; en el navegador marcó un brillo de color en la flecha del catálogo y el punto que parpadea en "En juego" (este último se apaga con movimiento reducido). Falsos positivos: las carátulas ilustradas y los colores de cada juego son contenido.

## Problemas prioritarios
1. [P1] El final de la partida no tiene momento sin medalla, y con medalla queda tapado. → delight + animate
2. [P1] "Anotar una partida" manda a explorar el catálogo. → distill / shape
3. [P1] Puntos y finales accidentales (pointerdown, sin pausa en el punto final, generala incompleta sin aviso, navegación visible). → harden
4. [P2] Generala: modelo por orden fijo y etiquetas crípticas. → clarify / shape
5. [P2] Densidad del marcador (14 chips, 15 steppers) y ayuda solo en hover; objetivos de 30–32 px en el marcador. → layout

## Personas
- Alex (apurado): 4+ toques para empezar; no recuerda jugadores.
- Sam (accesibilidad): líder solo por color; nombres cortados "C…" en el cierre de Catán; ayuda solo en hover.
- Casey (distraída): deshacer fuera del pulgar; "Pasar turno" lejos del jugador de turno.
- La que anota en la juntada: pasar el teléfono suma un punto; la navegación invita a salirse; el final pasa sin que nadie lo vea.

## Observaciones menores
Chips y stepper duplicados para "A cuánto"; "Guardar resultado" en dos líneas; el resumen de generala pierde la tabla de manos; "4 de 11" vs "3 de 11"; "Ver Truco" compite con "Revancha"; la pantalla de partida no tiene h1; títulos de carátulas a ~10 px.
