---
target: flujo anotar una partida
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/home/user/game-board/src/pages/PlayScreen.tsx"
target_fingerprint: "sha256:eab7cead439af209013ef87740ded700e21db485da0d1a959a420e6a583dae41"
target_path: /home/user/game-board/src/pages/PlayScreen.tsx
timestamp: 2026-10-13T02-26-52Z
slug: src-pages-playscreen-tsx
---
# Crítica 3: flujo "anotar una partida" (revancha directa → partida → terminar → resumen)

Method: dual-agent (A: revisión de diseño · B: detector + navegador)

## Puntaje: 31/40 (bueno). Tendencia 27 → 30 → 31
| # | Heurística | Puntaje | Problema principal |
|---|---|---|---|
| 1 | Estado | 3 | El mini marcador de generala suma lo no guardado y al terminar antes se pierde. |
| 2 | Mundo real | 4 | Fósforos, planilla, turnos. "Partido redondo" para truco. |
| 3 | Control | 3 | "Cambiar" de la revancha desaparece a los 6 s. |
| 4 | Consistencia | 3 | "Ana & Beto" vs "Ana y Beto"; rótulos en mayúsculas en la ficha de medalla. |
| 5 | Prevención | 2 | Generala pierde lo no guardado; Catán declara ganador sin los puntos ocultos; un aviso tapa los botones del festejo. |
| 6 | Reconocer | 3 | "Lo último anotado" no parece desplegable; retruco/vale cuatro/no quiero escondidos en la primera partida. |
| 7 | Flexibilidad | 3 | Teclado y revancha directa; la planilla no tiene teclado. |
| 8 | Minimalismo | 3 | El resumen repite al ganador y abre la medalla sola. |
| 9 | Recuperación | 3 | La confirmación no avisa que se pierde lo no guardado. |
| 10 | Ayuda | 3 | Ayuda en pantalla y por casilla. |

## Problemas prioritarios
1. [P1] Generala: terminar antes pierde lo anotado en la mano en curso. → harden
2. [P1] Catán: "Terminar partida" declara ganador antes de los puntos de victoria ocultos. → harden
3. [P1] Avisos encima de los botones del festejo y de la confirmación ("Cambiar" puede borrar la partida recién terminada). → polish
4. [P2] Resumen interrumpido (medalla automática) y medallas repetidas por jugador. → distill
5. [P2] Truco: jugadas comunes escondidas en la primera partida; historial que no parece desplegable. → clarify

## Detector y navegador
0 hallazgos en los archivos del flujo; axe 0 violaciones en 8 páginas. Menores: hero-track sin rol, 15px fuera de escala en planilla-summary.css, "Descartar partida" de 40 px.
