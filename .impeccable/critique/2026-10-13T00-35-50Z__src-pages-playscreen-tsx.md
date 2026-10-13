---
target: flujo anotar una partida
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:/home/user/game-board/src/pages/PlayScreen.tsx"
target_fingerprint: "sha256:e62e1db704a14272e6f2d9c5dd8cd5ddf76332b33494575e0b04963d88e84f20"
target_path: /home/user/game-board/src/pages/PlayScreen.tsx
timestamp: 2026-10-13T00-35-50Z
slug: src-pages-playscreen-tsx
---
# Crítica 2: flujo "anotar una partida" (inicio → /anotar → armado → partida → punto final → resumen)

Method: dual-agent (A: revisión de diseño · B: detector + navegador)

## Puntaje: 30/40 (bueno), antes 27/40
| # | Heurística | Puntaje | Problema principal |
|---|---|---|---|
| 1 | Estado | 3 | El total de generala queda debajo de la barra fija. |
| 2 | Mundo real | 3 | "Anotar 1 a Ana" ambiguo; "Falta 1 seguidas". |
| 3 | Control | 3 | Corregir reabre sin aviso. |
| 4 | Consistencia | 3 | "¡Ganó Ana & Beto!" en la pausa; "Terminar" naranja solo en turnos; "Datos para los premios". |
| 5 | Prevención | 2 | Truco arranca en "Cada uno solo" con 4 marcados → truco de a 4. |
| 6 | Reconocer | 3 | Recuerda jugadores pero no equipos. |
| 7 | Flexibilidad | 3 | Atajos buenos; sin teclado para anotar en escritorio. |
| 8 | Minimalismo | 3 | Catán: 20 steppers + 8 chips. |
| 9 | Recuperación | 3 | "Guardar igual" deshabilitado sin decir por qué (empate arriba). |
| 10 | Ayuda | 3 | "Qué es cada uno" y ayuda por casilla. |

## Especificidad
Los momentos (fósforos, planilla, festejo) son propios; las pantallas de tarea (selector, armado, cierre) son genéricas, aceptable en modo Operate. Detector: 0 hallazgos en los 13 archivos del flujo; en el inicio, el brillo de la flecha del catálogo y el punto que parpadea (menores) y las carátulas (falso positivo). axe: solo heading-order en el resumen.

## Problemas prioritarios
1. [P1] El armado de truco ignora los equipos de la última partida. → harden
2. [P2] La pausa del punto final es chica frente al tablero y no concuerda en plural. → delight
3. [P2] Totales tapados (generala) o fuera de lugar (Catán reordena cada turno). → layout
4. [P2] El cierre bloquea sin decir por qué; "premios", "1 seguidas". → clarify
5. [P3] Dos primarios naranjas en modo turnos. → quieter

## Medidas
Objetivos <44 px: puntitos del carrusel 24 px, "Vitrina" 20 px, controles del armado 36–40 px, flechas de la ficha de medalla 40 px. Texto: títulos de carátulas ~10 px. Un 15px fuera de escala en playscreen.css.
